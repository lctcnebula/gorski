"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { adminInput } from "@/lib/admin-client";
import { blocksToMarkdown, markdownToBlocks, postInputSchema, slugify, type AdminPost } from "@/lib/blog";
import { PostBody } from "./Content";

type Draft = { originalSlug?: string; slug: string; title: string; seoTitle: string; excerpt: string; author: string; category: string; date: string; cover: string; content: string; published: boolean };
const today = () => new Date().toLocaleDateString("en-CA");
const empty = (): Draft => ({ slug: "", title: "", seoTitle: "", excerpt: "", author: "Dr. Andrew Gorski", category: "Wellness", date: today(), cover: "", content: "", published: true });

async function request(path: string, init?: RequestInit) {
  const response = await fetch(`/api/admin/blog${path}`, { cache: "no-store", ...init });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) throw new Error("Session expired. Please sign in again.");
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}
async function upload(file: File): Promise<string> {
  const body = new FormData(); body.set("file", file);
  return (await request("/upload", { method: "POST", body })).url;
}
function status(post: AdminPost) {
  if (!post.published) return { label: "Draft", className: "bg-paper-2 text-ink-soft" };
  if (post.date > today()) return { label: "Scheduled", className: "bg-brand-soft text-brand" };
  return { label: "Published", className: "bg-sage-soft text-sage" };
}

export function AdminBlog() {
  const [posts, setPosts] = useState<AdminPost[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    request("", { signal: controller.signal }).then(data => { if (!controller.signal.aborted) { setPosts(data.posts); setError(""); } })
      .catch(e => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Could not load posts."); });
    return () => controller.abort();
  }, [version]);

  if (draft) return <PostEditor initial={draft} onDone={() => { setDraft(null); setVersion(value => value + 1); }} />;
  async function remove(post: AdminPost) {
    if (!confirm(`Delete “${post.title}”? This removes it from the website and cannot be undone.`)) return;
    try { await request(`?slug=${encodeURIComponent(post.slug)}`, { method: "DELETE" }); setVersion(value => value + 1); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not delete the post."); }
  }
  return <section className="mt-7" aria-labelledby="blog-title">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><h2 id="blog-title" className="text-xl font-semibold">Blog posts</h2><p className="mt-1 text-sm text-ink-soft">Write, edit and remove articles on the website blog. Posts with a future date go live automatically on that day.</p></div>
      <button className="btn btn-primary" onClick={() => setDraft(empty())}>New post</button>
    </div>
    {error && <p role="alert" className="mt-5 rounded-lg bg-brand-soft p-4 text-sm">{error}</p>}
    <div className="mt-5 overflow-hidden rounded-xl border border-line bg-white">
      {!posts ? <p className="p-8 text-center text-sm text-ink-soft">{error ? "Posts could not be loaded." : "Loading posts…"}</p> : !posts.length ? <div className="p-10 text-center"><h3 className="text-lg font-semibold">No posts yet</h3><p className="mt-2 text-sm text-ink-soft">Create your first article with New post.</p></div> :
        <ul className="divide-y divide-line">{posts.map(post => { const badge = status(post); return <li key={post.slug} className="flex flex-wrap items-center gap-4 p-4">
          <Image src={post.cover} alt="" width={120} height={68} className="aspect-[16/9] w-24 shrink-0 rounded-md bg-paper-2 object-cover" />
          <div className="min-w-0 flex-1"><h3 className="break-words font-semibold">{post.title}</h3><p className="mt-1 text-xs text-ink-soft">{post.dateLabel} · {post.category} · /{post.slug}</p></div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}>{badge.label}</span>
          <div className="flex gap-2">
            {badge.label === "Published" && <a href={`/${post.slug}`} target="_blank" rel="noreferrer" className="btn btn-outline">View</a>}
            <button className="btn btn-outline" onClick={() => setDraft({ originalSlug: post.slug, slug: post.slug, title: post.title, seoTitle: post.seoTitle === post.title ? "" : post.seoTitle, excerpt: post.excerpt, author: post.author, category: post.category, date: post.date, cover: post.cover, content: blocksToMarkdown(post.blocks), published: post.published })}>Edit</button>
            <button className="btn btn-outline" onClick={() => void remove(post)}>Delete</button>
          </div>
        </li>; })}</ul>}
    </div>
  </section>;
}

function PostEditor({ initial, onDone }: { initial: Draft; onDone: () => void }) {
  const [draft, setDraft] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.originalSlug));
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState(""), [message, setMessage] = useState("");
  const content = useRef<HTMLTextAreaElement>(null);
  const inlineImage = useRef<HTMLInputElement>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => { setDraft(current => ({ ...current, [key]: value })); setMessage(""); };

  /** Wraps the selection (or inserts at the cursor) in the content box. */
  function insert(before: string, after = "", placeholder = "") {
    const box = content.current; if (!box) return;
    const { selectionStart: start, selectionEnd: end, value } = box;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    set("content", next);
    requestAnimationFrame(() => { box.focus(); box.setSelectionRange(start + before.length, start + before.length + selected.length); });
  }
  async function uploadCover(file?: File) {
    if (!file) return;
    setBusy("cover");
    try { set("cover", await upload(file)); } catch (e) { setMessage(e instanceof Error ? e.message : "Upload failed."); } finally { setBusy(""); }
  }
  async function uploadInline(file?: File) {
    if (!file) return;
    setBusy("inline");
    try { const url = await upload(file); insert(`\n\n![`, `](${url})\n\n`, "Describe the image"); } catch (e) { setMessage(e instanceof Error ? e.message : "Upload failed."); } finally { setBusy(""); if (inlineImage.current) inlineImage.current.value = ""; }
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    const parsed = postInputSchema.safeParse({ ...draft, slug: slugify(draft.slug) });
    if (!parsed.success) { setMessage(parsed.error.issues[0].message); return; }
    setBusy("save"); setMessage("");
    try { await request("", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) }); onDone(); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Could not save the post."); setBusy(""); }
  }
  const label = "block text-sm font-semibold";
  const tool = "min-h-10 rounded-md border border-line bg-white px-3 text-sm font-medium text-ink-soft hover:text-ink";

  return <form onSubmit={save} className="mt-7" aria-labelledby="editor-title">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button type="button" className="min-h-11 text-sm font-medium text-brand" onClick={() => { if (!dirty || confirm("Discard unsaved changes?")) onDone(); }}>← All posts</button>
      <h2 id="editor-title" className="sr-only">{initial.originalSlug ? "Edit post" : "New post"}</h2>
    </div>
    <div className="mt-3 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-5 rounded-xl border border-line bg-white p-5 sm:p-6">
        <label className={label}>Title<input className={`${adminInput} mt-2 text-lg`} value={draft.title} maxLength={200} onChange={event => { const title = event.target.value; setDraft(current => ({ ...current, title, slug: slugTouched ? current.slug : slugify(title) })); setMessage(""); }} placeholder="Post title" /></label>
        <label className={label}>Summary<span className="font-normal text-ink-soft"> — shown on the blog page and in search results</span><textarea className={`${adminInput} mt-2 min-h-20`} value={draft.excerpt} maxLength={600} onChange={event => set("excerpt", event.target.value)} /></label>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={label}>Content</span>
            <div role="tablist" className="flex gap-1 rounded-lg bg-paper-2 p-1 text-sm">{(["write", "preview"] as const).map(value => <button key={value} type="button" role="tab" aria-selected={tab === value} onClick={() => setTab(value)} className={`min-h-9 rounded-md px-3 font-medium capitalize ${tab === value ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}>{value}</button>)}</div>
          </div>
          {tab === "write" ? <>
            <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Formatting">
              <button type="button" className={tool} onClick={() => insert("\n\n## ", "\n\n", "Heading")}>Heading</button>
              <button type="button" className={tool} onClick={() => insert("\n\n### ", "\n\n", "Subheading")}>Subheading</button>
              <button type="button" className={`${tool} font-bold`} onClick={() => insert("**", "**", "bold text")}>B</button>
              <button type="button" className={`${tool} italic`} onClick={() => insert("*", "*", "italic text")}>I</button>
              <button type="button" className={tool} onClick={() => insert("\n\n- ", "\n\n", "List item")}>List</button>
              <button type="button" className={tool} onClick={() => insert("\n\n> ", "\n\n", "Highlighted text")}>Highlight</button>
              <button type="button" className={tool} onClick={() => { const href = prompt("Link address (https://… or /page)"); if (href) insert("[", `](${href})`, "link text"); }}>Link</button>
              <button type="button" disabled={busy === "inline"} className={tool} onClick={() => inlineImage.current?.click()}>{busy === "inline" ? "Uploading…" : "Image"}</button>
              <input ref={inlineImage} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={event => void uploadInline(event.target.files?.[0])} />
            </div>
            <textarea ref={content} className={`${adminInput} mt-2 min-h-[28rem] font-mono text-[0.95rem] leading-relaxed`} value={draft.content} onChange={event => set("content", event.target.value)} placeholder={"Write your post here.\n\nLeave a blank line between paragraphs.\n\n## A heading\n\n- A list item"} />
            <p className="mt-2 text-xs text-ink-soft">Leave a blank line between paragraphs. Use the buttons above for headings, lists, links and images.</p>
          </> : <div className="mt-3 rounded-lg border border-line p-5 sm:p-8">
            {draft.cover && <Image src={draft.cover} alt="" width={1200} height={675} className="aspect-[16/9] w-full rounded-lg object-cover" />}
            <h1 className="display mt-6 text-3xl text-ink sm:text-4xl">{draft.title || "Untitled post"}</h1>
            <div className="mt-6">{draft.content.trim() ? <PostBody blocks={markdownToBlocks(draft.content)} /> : <p className="text-ink-soft">Nothing written yet.</p>}</div>
          </div>}
        </div>
      </div>
      <aside className="space-y-5 rounded-xl border border-line bg-white p-5 lg:sticky lg:top-6">
        <div>
          <span className={label}>Banner image</span>
          {draft.cover ? <Image src={draft.cover} alt="" width={640} height={360} className="mt-2 aspect-[16/9] w-full rounded-lg bg-paper-2 object-cover" /> : <div className="mt-2 grid aspect-[16/9] place-items-center rounded-lg border border-dashed border-line bg-paper text-sm text-ink-soft">No banner yet</div>}
          <label className="btn btn-outline mt-3 w-full cursor-pointer">{busy === "cover" ? "Uploading…" : draft.cover ? "Replace image" : "Upload image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" disabled={busy === "cover"} onChange={event => void uploadCover(event.target.files?.[0])} /></label>
          <p className="mt-1.5 text-xs text-ink-soft">JPG, PNG or WebP up to 4 MB. Wide images (16:9) look best.</p>
        </div>
        <label className={label}>Status<select className={`${adminInput} mt-2`} value={draft.published ? "published" : "draft"} onChange={event => set("published", event.target.value === "published")}><option value="published">Published</option><option value="draft">Draft (hidden)</option></select></label>
        <label className={label}>Publish date<input type="date" className={`${adminInput} mt-2`} value={draft.date} onChange={event => set("date", event.target.value)} /><span className="mt-1.5 block text-xs font-normal text-ink-soft">A future date schedules the post.</span></label>
        <label className={label}>Category<input className={`${adminInput} mt-2`} value={draft.category} maxLength={80} onChange={event => set("category", event.target.value)} /></label>
        <label className={label}>Author<input className={`${adminInput} mt-2`} value={draft.author} maxLength={100} onChange={event => set("author", event.target.value)} /></label>
        <label className={label}>URL<span className="mt-2 flex items-center rounded-lg border border-line bg-paper-2 pl-3 text-sm font-normal text-ink-soft">/<input className="min-h-11 w-full min-w-0 rounded-r-lg bg-white px-2 py-2 text-base text-ink" value={draft.slug} maxLength={120} onChange={event => { setSlugTouched(true); set("slug", slugify(event.target.value) + (event.target.value.endsWith("-") ? "-" : "")); }} /></span></label>
        <label className={label}>SEO title<span className="font-normal text-ink-soft"> (optional)</span><input className={`${adminInput} mt-2`} value={draft.seoTitle} maxLength={200} placeholder={draft.title} onChange={event => set("seoTitle", event.target.value)} /></label>
        {message && <p role="alert" className="rounded-lg bg-brand-soft p-3 text-sm">{message}</p>}
        <button type="submit" disabled={Boolean(busy)} className="btn btn-primary w-full disabled:opacity-50">{busy === "save" ? "Saving…" : initial.originalSlug ? "Save changes" : draft.published ? "Publish post" : "Save draft"}</button>
      </aside>
    </div>
  </form>;
}
