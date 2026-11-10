import { database } from "@/lib/server/db";
import { encrypt, rateLimit, sameOrigin } from "@/lib/server/security";
import { deliverPending } from "@/lib/server/push";
import { submissionSchema } from "@/lib/submission-schema";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Request not allowed." }, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 30000) return Response.json({ error: "Form is too large." }, { status: 413 });
    const parsed = submissionSchema.safeParse(JSON.parse(text));
    if (!parsed.success) return Response.json({ error: "Please complete the required fields.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
    if (parsed.data.website) return Response.json({ ok: true });
    if (!await rateLimit(request, "submission", 8, 600)) return Response.json({ error: "Please wait a few minutes before sending another form." }, { status: 429 });
    const sql = database();
    const { website: _honeypot, ...payload } = parsed.data;
    void _honeypot;
    await sql.transaction([
      sql`INSERT INTO submissions (id,kind,payload) VALUES (${payload.id},${payload.kind},${encrypt(payload)}) ON CONFLICT (id) DO NOTHING`,
      sql`INSERT INTO push_deliveries (submission_id,subscription_id) SELECT ${payload.id},id FROM push_subscriptions ON CONFLICT DO NOTHING`,
    ]);
    await deliverPending().catch(() => undefined);
    return Response.json({ ok: true, id: payload.id }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: "Invalid form data." }, { status: 400 });
    return Response.json({ error: "We could not save your form. Please try again or call the office." }, { status: 503 });
  }
}
