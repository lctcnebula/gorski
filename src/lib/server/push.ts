import "server-only";
import webpush from "web-push";
import { z } from "zod";
import { database } from "./db";
import { decrypt } from "./security";

export const pushSchema = z.object({
  endpoint: z.string().url().max(2048).refine(value => {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && (!url.port || url.port === "443") &&
      ["fcm.googleapis.com", "updates.push.services.mozilla.com", "web.push.apple.com", "notify.windows.com"].some(host => url.hostname === host || url.hostname.endsWith(`.${host}`));
  }),
  keys: z.object({ p256dh: z.string().regex(/^[A-Za-z0-9_-]+$/).min(40).max(200), auth: z.string().regex(/^[A-Za-z0-9_-]+$/).min(16).max(100) }),
});

export async function deliverPending(send = webpush.sendNotification.bind(webpush)) {
  if (!process.env.VAPID_PRIVATE_KEY || !process.env.VAPID_PUBLIC_KEY) return;
  const sql = database();
  webpush.setVapidDetails(process.env.VAPID_SUBJECT!, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  const jobs = await sql`WITH candidates AS (
    SELECT submission_id, subscription_id FROM push_deliveries WHERE attempts < 5 AND
      (state='pending' OR (state='sending' AND last_attempt_at < NOW() - INTERVAL '5 minutes'))
    LIMIT 30 FOR UPDATE SKIP LOCKED
  ), claimed AS (
    UPDATE push_deliveries d SET state='sending',attempts=d.attempts+1,last_attempt_at=NOW()
    FROM candidates c WHERE d.submission_id=c.submission_id AND d.subscription_id=c.subscription_id RETURNING d.*
  ) SELECT c.submission_id,c.subscription_id,s.payload FROM claimed c JOIN push_subscriptions s ON s.id=c.subscription_id`;
  await Promise.all(jobs.map(async job => {
    try {
      await send(decrypt(job.payload), JSON.stringify({ title: "New website submission", body: "Open your secure dashboard to review it.", url: `/admin?id=${job.submission_id}`, tag: `submission-${job.submission_id}` }), { TTL: 3600, timeout: 5000 });
      await sql`UPDATE push_deliveries SET state='sent' WHERE submission_id=${job.submission_id} AND subscription_id=${job.subscription_id}`;
    } catch (error) {
      const status = (error as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) await sql`DELETE FROM push_subscriptions WHERE id=${job.subscription_id}`;
      else await sql`UPDATE push_deliveries SET state='pending' WHERE submission_id=${job.submission_id} AND subscription_id=${job.subscription_id}`;
    }
  }));
}
