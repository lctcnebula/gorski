import { z } from "zod";
import { authenticated, sameOrigin } from "@/lib/server/security";
import { adminPost, adminPosts, deletePost, savePost } from "@/lib/server/blog";
import { postInputSchema } from "@/lib/blog";

export const runtime = "nodejs";
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request: Request) {
  if (!await authenticated()) return json({ error: "Sign in required." }, 401);
  try {
    const slug = new URL(request.url).searchParams.get("slug");
    if (!slug) return json({ posts: await adminPosts() });
    const post = await adminPost(slug);
    return post ? json({ post }) : json({ error: "Post not found." }, 404);
  } catch { return json({ error: "The blog is temporarily unavailable." }, 503); }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Request not allowed." }, 403);
  if (!await authenticated()) return json({ error: "Sign in required." }, 401);
  try {
    const text = await request.text();
    if (text.length > 120000) return json({ error: "This post is too long." }, 413);
    const parsed = postInputSchema.safeParse(JSON.parse(text));
    if (!parsed.success) return json({ error: parsed.error.issues[0].message }, 400);
    const result = await savePost(parsed.data);
    return "error" in result ? json(result, 409) : json(result);
  } catch (error) {
    return error instanceof SyntaxError ? json({ error: "Invalid request." }, 400) : json({ error: "Could not save the post." }, 503);
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Request not allowed." }, 403);
  if (!await authenticated()) return json({ error: "Sign in required." }, 401);
  const slug = z.string().min(1).max(120).safeParse(new URL(request.url).searchParams.get("slug"));
  if (!slug.success) return json({ error: "Invalid request." }, 400);
  try { return await deletePost(slug.data) ? json({ ok: true }) : json({ error: "Post not found." }, 404); }
  catch { return json({ error: "Could not delete the post." }, 503); }
}
