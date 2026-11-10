import { z } from "zod";
import { randomUUID } from "node:crypto";
import { database } from "@/lib/server/db";
import { authenticated, currentPasswordHash, hashPassword, decrypt, encrypt, fingerprint, passwordMatches, rateLimit, sameOrigin, session } from "@/lib/server/security";
import { deliverPending, pushSchema } from "@/lib/server/push";
import { submissionFilters } from "@/lib/admin-filters";
import type { SubmissionPayload } from "@/lib/submission-schema";

export const runtime = "nodejs";
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request: Request, context: { params: Promise<{ action: string[] }> }) {
  try {
    if (!await authenticated()) return json({ error: "Sign in required." }, 401);
    const { action } = await context.params;
    if (action[0] === "settings") return json({ email: process.env.ADMIN_EMAIL, vapidPublicKey: process.env.VAPID_PUBLIC_KEY });
    const sql = database();
    if (action[0] === "submission") {
      const id = z.string().uuid().parse(new URL(request.url).searchParams.get("id"));
      const rows = await sql`SELECT id,kind,payload,status,created_at FROM submissions WHERE id=${id}`;
      if (!rows.length) return json({ error: "Submission not found." }, 404);
      const row = rows[0];
      return json({ item: { ...decrypt<SubmissionPayload>(row.payload), id: row.id, kind: row.kind, status: row.status, createdAt: row.created_at } });
    }
    if (action[0] !== "submissions") return json({ error: "Not found." }, 404);
    const filters = submissionFilters.parse(Object.fromEntries(new URL(request.url).searchParams));
    const { page, kind, status } = filters;
    const from = filters.from ?? null, to = filters.to ?? null;
    const rows = await sql`SELECT id,kind,payload,status,created_at FROM submissions
      WHERE (${kind}='all' OR kind=${kind}) AND (${status}='all' OR status=${status})
      AND (${from}::timestamptz IS NULL OR created_at>=${from}::timestamptz)
      AND (${to}::timestamptz IS NULL OR created_at<${to}::timestamptz)
      ORDER BY created_at DESC,id DESC LIMIT 50 OFFSET ${(page-1)*50}`;
    const counts = await sql`SELECT status,kind,COUNT(*)::int AS count FROM submissions
      WHERE (${kind}='all' OR kind=${kind}) AND (${status}='all' OR status=${status})
      AND (${from}::timestamptz IS NULL OR created_at>=${from}::timestamptz)
      AND (${to}::timestamptz IS NULL OR created_at<${to}::timestamptz)
      GROUP BY status,kind`;
    const total = counts.reduce((sum, row) => sum + Number(row.count), 0);
    return json({ items: rows.map(row => ({ ...decrypt<SubmissionPayload>(row.payload), id: row.id, kind: row.kind, status: row.status, createdAt: row.created_at })), counts, total, page });
  } catch (error) { return error instanceof z.ZodError ? json({ error: "Invalid submission filters." }, 400) : json({ error: "The dashboard is temporarily unavailable." }, 503); }
}

export async function POST(request: Request, context: { params: Promise<{ action: string[] }> }) {
  if (!sameOrigin(request)) return json({ error: "Request not allowed." }, 403);
  try {
    const { action } = await context.params;
    const text = await request.text();
    if (text.length > 10000) return json({ error: "Request too large." }, 413);
    const body = text ? JSON.parse(text) : {};
    if (action[0] === "login") {
      if (!await rateLimit(request, "login", 8, 900)) return json({ error: "Too many attempts. Try again in 15 minutes." }, 429);
      const input = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(256) }).safeParse(body);
      const passwordHash = await currentPasswordHash();
      const validPassword = input.success && passwordMatches(input.data.password, passwordHash);
      if (!input.success || !validPassword || input.data.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) return json({ error: "Email or password is incorrect." }, 401);
      const s = await session(); s.authenticated = true; s.version = fingerprint(passwordHash); await s.save();
      return json({ ok: true });
    }
    if (!await authenticated()) return json({ error: "Sign in required." }, 401);
    if (action[0] === "logout") { (await session()).destroy(); return json({ ok: true }); }
    const sql = database();
    if (action[0] === "change-password") {
      if (!await rateLimit(request, "password", 5, 900)) return json({ error: "Too many attempts. Try again in 15 minutes." }, 429);
      const input = z.object({ currentPassword: z.string().min(1).max(256), newPassword: z.string().min(12).max(256) }).parse(body);
      const previous = await currentPasswordHash();
      if (!passwordMatches(input.currentPassword, previous)) return json({ error: "Current password is incorrect." }, 400);
      if (passwordMatches(input.newPassword, previous)) return json({ error: "Choose a different new password." }, 400);
      const next = hashPassword(input.newPassword);
      const changed = await sql`INSERT INTO admin_settings(key,value) VALUES ('password_hash',${next})
        ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value,updated_at=NOW()
        WHERE admin_settings.value=${previous} RETURNING key`;
      if (!changed.length) return json({ error: "Password changed in another session. Please sign in again." }, 409);
      const s = await session(); s.version = fingerprint(next); await s.save();
      return json({ ok: true });
    }
    if (action[0] === "status") {
      const data = z.object({ id: z.string().uuid(), status: z.enum(["new", "reviewed", "completed"]) }).parse(body);
      const updated = await sql`UPDATE submissions SET status=${data.status},updated_at=NOW() WHERE id=${data.id} RETURNING id`;
      if (!updated.length) return json({ error: "Submission not found." }, 404);
      return json({ ok: true });
    }
    if (action[0] === "subscribe") {
      const subscription = pushSchema.parse(body);
      const id = fingerprint(subscription.endpoint);
      await sql`INSERT INTO push_subscriptions(id,payload) VALUES (${id},${encrypt(subscription)}) ON CONFLICT(id) DO UPDATE SET payload=EXCLUDED.payload`;
      return json({ ok: true });
    }
    if (action[0] === "unsubscribe") {
      const data = z.object({ endpoint: z.string().max(2048) }).parse(body);
      await sql`DELETE FROM push_subscriptions WHERE id=${fingerprint(data.endpoint)}`;
      return json({ ok: true });
    }
    if (action[0] === "test-push") {
      const webpush = (await import("web-push")).default;
      webpush.setVapidDetails(process.env.VAPID_SUBJECT!,process.env.VAPID_PUBLIC_KEY!,process.env.VAPID_PRIVATE_KEY!);
      const data = z.object({ endpoint: z.string().max(2048) }).parse(body);
      const rows = await sql`SELECT payload FROM push_subscriptions WHERE id=${fingerprint(data.endpoint)}`;
      if (!rows.length) return json({ error: "Enable notifications on this device first." }, 400);
      await webpush.sendNotification(decrypt(rows[0].payload),JSON.stringify({title:"Notifications are ready",body:"This device can receive new submission alerts.",url:"/admin",tag:randomUUID()}),{timeout:5000});
      return json({ ok: true });
    }
    if (action[0] === "retry-push") { await deliverPending(); return json({ ok: true }); }
    return json({ error: "Not found." }, 404);
  } catch (error) {
    const invalid = error instanceof z.ZodError || error instanceof SyntaxError;
    return json({ error: invalid ? "Invalid request." : "Request could not be completed." }, invalid ? 400 : 503);
  }
}
