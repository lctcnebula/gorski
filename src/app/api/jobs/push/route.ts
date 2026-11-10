import { timingSafeEqual } from "node:crypto";
import { deliverPending } from "@/lib/server/push";
import { database } from "@/lib/server/db";
export async function GET(request: Request) {
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
  const actual = request.headers.get("authorization") || "";
  if (!process.env.CRON_SECRET || expected.length !== actual.length || !timingSafeEqual(Buffer.from(expected),Buffer.from(actual))) return new Response("Unauthorized",{status:401});
  await deliverPending();
  await database()`DELETE FROM rate_limits WHERE expires_at < NOW()`;
  return Response.json({ok:true});
}
