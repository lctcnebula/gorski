import "server-only";
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { database } from "./db";

export function encrypt(value: unknown) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(process.env.DATA_ENCRYPTION_KEY!, "hex"), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value)), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map(b => b.toString("base64url")).join(".");
}
export function decrypt<T>(value: string): T {
  const [iv, tag, data] = value.split(".").map(s => Buffer.from(s, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", Buffer.from(process.env.DATA_ENCRYPTION_KEY!, "hex"), iv);
  decipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([decipher.update(data), decipher.final()]).toString());
}
export const fingerprint = (value: string) => createHash("sha256").update(value).digest("hex");
export async function currentPasswordHash() {
  const sql = database();
  const rows = await sql`SELECT value FROM admin_settings WHERE key='password_hash'`;
  return String(rows[0]?.value || process.env.ADMIN_PASSWORD_HASH || "");
}
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function passwordMatches(password: string, encoded = process.env.ADMIN_PASSWORD_HASH || "") {
  const [salt, expected] = encoded.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  const hash = Buffer.from(expected, "hex");
  return actual.length === hash.length && timingSafeEqual(actual, hash);
}
export async function session() {
  if (!process.env.SESSION_SECRET) throw new Error("Authentication is not configured");
  return getIronSession<{ authenticated?: boolean; version?: string }>(await cookies(), {
    password: process.env.SESSION_SECRET,
    cookieName: "gorski_admin",
    ttl: 8 * 60 * 60,
    cookieOptions: { secure: process.env.NODE_ENV === "production", httpOnly: true, sameSite: "strict", path: "/" },
  });
}
export const authVersion = async () => fingerprint(await currentPasswordHash());
export async function authenticated() {
  const s = await session();
  return s.authenticated === true && s.version === await authVersion();
}
export function sameOrigin(request: Request) {
  const allowed = [process.env.PUBLIC_APP_URL, process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`];
  if (process.env.NODE_ENV !== "production") allowed.push("http://localhost:3000");
  return allowed.includes(request.headers.get("origin") || "");
}
export async function rateLimit(request: Request, group: string, limit: number, seconds: number) {
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0] || request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const key = createHmac("sha256", process.env.SESSION_SECRET!).update(`${group}:${ip}`).digest("hex");
  const sql = database();
  const rows = await sql`INSERT INTO rate_limits (key, count, expires_at) VALUES (${key}, 1, NOW() + ${seconds} * INTERVAL '1 second')
    ON CONFLICT (key) DO UPDATE SET count = CASE WHEN rate_limits.expires_at < NOW() THEN 1 ELSE rate_limits.count + 1 END,
    expires_at = CASE WHEN rate_limits.expires_at < NOW() THEN NOW() + ${seconds} * INTERVAL '1 second' ELSE rate_limits.expires_at END RETURNING count`;
  return rows[0].count <= limit;
}
