import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { authenticated, sameOrigin } from "@/lib/server/security";

export const runtime = "nodejs";
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
const types: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Request not allowed." }, 403);
  if (!await authenticated()) return json({ error: "Sign in required." }, 401);
  if (!process.env.BLOB_READ_WRITE_TOKEN) return json({ error: "Image storage is not configured." }, 503);
  try {
    const file = (await request.formData()).get("file");
    if (!(file instanceof File)) return json({ error: "Choose an image to upload." }, 400);
    const extension = types[file.type];
    if (!extension) return json({ error: "Use a JPG, PNG, WebP or GIF image." }, 400);
    if (file.size > 4 * 1024 * 1024) return json({ error: "Images must be 4 MB or smaller." }, 413);
    const blob = await put(`blog/${randomUUID()}.${extension}`, file, { access: "public", contentType: file.type });
    return json({ url: blob.url });
  } catch { return json({ error: "Could not upload the image. Please try again." }, 503); }
}
