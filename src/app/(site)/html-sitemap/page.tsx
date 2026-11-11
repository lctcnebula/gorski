import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Motion";
import { CONTAINER, PageHero } from "@/components/Sections";
import { publishedPosts } from "@/lib/server/blog";
import { PAGES } from "@/lib/site";

export const metadata: Metadata = { title: "HTML Sitemap", alternates: { canonical: "/html-sitemap" } };

export default async function HtmlSitemapPage() {
  const POSTS = await publishedPosts();
  return (
    <>
      <PageHero eyebrow="Sitemap" title="HTML Sitemap" crumbs={[{ label: "HTML Sitemap" }]} />
      <section className={`${CONTAINER} grid gap-14 pb-24 md:grid-cols-2`}>
        <Reveal>
          <h2 className="display text-2xl text-ink">Pages</h2>
          <ul className="mt-6 grid gap-2.5">
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="text-ink-soft underline-offset-4 hover:text-brand hover:underline">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display text-2xl text-ink">Posts</h2>
          <ul className="mt-6 grid gap-2.5">
            {POSTS.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="text-ink-soft underline-offset-4 hover:text-brand hover:underline">
                  {p.title}
                </Link>
                <span className="ml-2 text-xs text-muted">{p.dateLabel}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
