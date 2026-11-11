import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { database } from "./db";
import { POSTS, type Block, type Post } from "../posts";
import { dateLabel, markdownToBlocks, type AdminPost, type PostInput } from "../blog";

type Row = { slug: string; title: string; seo_title: string; excerpt: string; author: string; category: string; cover: string; blocks: string; date: string; published: boolean; updated_at: string };

let ready: Promise<void> | null = null;
/** Creates the table once per server instance and copies the original posts in on first run. */
function ensureBlog() {
  ready ??= (async () => {
    const sql = database();
    await sql`CREATE TABLE IF NOT EXISTS blog_posts (
      slug text PRIMARY KEY, title text NOT NULL, seo_title text NOT NULL DEFAULT '', excerpt text NOT NULL,
      author text NOT NULL, category text NOT NULL, cover text NOT NULL, blocks text NOT NULL,
      date text NOT NULL, published boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT NOW(), updated_at timestamptz NOT NULL DEFAULT NOW())`;
    const seeded = await sql`INSERT INTO admin_settings(key,value) VALUES ('blog_seeded','1') ON CONFLICT(key) DO NOTHING RETURNING key`;
    if (seeded.length) for (const post of POSTS) {
      await sql`INSERT INTO blog_posts(slug,title,seo_title,excerpt,author,category,cover,blocks,date,published)
        VALUES (${post.slug},${post.title},${post.seoTitle},${post.excerpt},${post.author},${post.category},${post.cover},${JSON.stringify(post.blocks)},${post.date},true)
        ON CONFLICT(slug) DO NOTHING`;
    }
  })().catch(error => { ready = null; throw error; });
  return ready;
}

function toPost(row: Row): AdminPost {
  return {
    slug: row.slug, title: row.title, seoTitle: row.seo_title || row.title, excerpt: row.excerpt, author: row.author,
    category: row.category, cover: row.cover, blocks: JSON.parse(row.blocks) as Block[], date: row.date,
    dateLabel: dateLabel(row.date), published: row.published, updatedAt: row.updated_at,
  };
}

export async function adminPosts() {
  await ensureBlog();
  const rows = await database()`SELECT * FROM blog_posts ORDER BY date DESC, created_at DESC` as Row[];
  return rows.map(toPost);
}
export async function adminPost(slug: string) {
  await ensureBlog();
  const rows = await database()`SELECT * FROM blog_posts WHERE slug=${slug}` as Row[];
  return rows[0] ? toPost(rows[0]) : null;
}

/** Saves a post; returns an error message when the slug is taken. */
export async function savePost(input: PostInput): Promise<{ post: AdminPost } | { error: string }> {
  await ensureBlog();
  const sql = database();
  const blocks = JSON.stringify(markdownToBlocks(input.content));
  if (input.originalSlug) {
    if (input.slug !== input.originalSlug && (await sql`SELECT 1 FROM blog_posts WHERE slug=${input.slug}`).length) return { error: "Another post already uses that URL slug." };
    const rows = await sql`UPDATE blog_posts SET slug=${input.slug},title=${input.title},seo_title=${input.seoTitle},excerpt=${input.excerpt},author=${input.author},
      category=${input.category},cover=${input.cover},blocks=${blocks},date=${input.date},published=${input.published},updated_at=NOW()
      WHERE slug=${input.originalSlug} RETURNING *` as Row[];
    return rows[0] ? { post: toPost(rows[0]) } : { error: "This post no longer exists." };
  }
  const rows = await sql`INSERT INTO blog_posts(slug,title,seo_title,excerpt,author,category,cover,blocks,date,published)
    VALUES (${input.slug},${input.title},${input.seoTitle},${input.excerpt},${input.author},${input.category},${input.cover},${blocks},${input.date},${input.published})
    ON CONFLICT(slug) DO NOTHING RETURNING *` as Row[];
  return rows[0] ? { post: toPost(rows[0]) } : { error: "Another post already uses that URL slug." };
}

export async function deletePost(slug: string) {
  await ensureBlog();
  const rows = await database()`DELETE FROM blog_posts WHERE slug=${slug} RETURNING slug`;
  return rows.length > 0;
}

/** Published posts for the public site. Falls back to the built-in posts if the database is unreachable. */
export const publishedPosts = cache(async (): Promise<Post[]> => {
  await connection();
  try {
    await ensureBlog();
    const rows = await database()`SELECT * FROM blog_posts WHERE published AND date <= to_char(NOW() AT TIME ZONE 'America/Chicago','YYYY-MM-DD') ORDER BY date DESC, created_at DESC` as Row[];
    return rows.map(toPost);
  } catch {
    console.error("Blog posts are temporarily unavailable; showing built-in posts.");
    return POSTS;
  }
});
export async function publishedPost(slug: string) {
  return (await publishedPosts()).find(post => post.slug === slug) ?? null;
}
