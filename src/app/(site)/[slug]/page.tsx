import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostBody, PostCard } from "@/components/Content";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Motion";
import { CONTAINER, CtaBand, PageHero, ReadingAside } from "@/components/Sections";
import { publishedPost, publishedPosts } from "@/lib/server/blog";
import { SITE } from "@/lib/site";

// Blog posts keep their WordPress URLs, which sit at the site root (/<slug>).
// Posts are managed from the dashboard, so they are read on each request.

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await publishedPost((await params).slug);
  if (!post) return {};
  return {
    title: post.seoTitle,
    description: post.excerpt,
    alternates: { canonical: `/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date, images: [post.cover] },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const POSTS = await publishedPosts();
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();
  const index = POSTS.findIndex((p) => p.slug === slug);
  const newer = POSTS[index - 1];
  const older = POSTS[index + 1];
  const related = POSTS.filter((p) => p.slug !== slug);
  const url = `${SITE.url}/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          url,
          datePublished: post.date,
          author: { "@type": "Person", name: post.author },
          publisher: { "@id": `${SITE.url}/#org` },
          mainEntityOfPage: url,
          image: post.cover.startsWith("/") ? `${SITE.url}${post.cover}` : post.cover,
        }}
      />
      <PageHero
        eyebrow={post.category}
        title={post.title}
        crumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
        lede={
          <p className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <time dateTime={post.date}>{post.dateLabel}</time>
            <span aria-hidden className="h-px w-6 bg-line-strong" />
            <span>By {post.author}</span>
          </p>
        }
      />
      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        <Reveal className="frame aspect-[16/9] max-h-[60svh]">
          <Image src={post.cover} alt="" fill priority sizes="(min-width:1400px) 1320px, 100vw" className="object-cover" />
        </Reveal>
        <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-24">
          <Reveal as="article" className="min-w-0">
            <PostBody blocks={post.blocks} />
            <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:justify-between">
              {older ? (
                <Link href={`/${older.slug}`} className="group max-w-xs">
                  <span className="flex items-center gap-2 text-xs tracking-[0.06em] text-muted uppercase">
                    <Icon name="arrowRight" className="size-3.5 rotate-180" /> Previous
                  </span>
                  <span className="mt-2 block font-semibold text-ink group-hover:text-brand">{older.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link href={`/${newer.slug}`} className="group max-w-xs sm:text-right">
                  <span className="flex items-center gap-2 text-xs tracking-[0.06em] text-muted uppercase sm:justify-end">
                    Next <Icon name="arrowRight" className="size-3.5" />
                  </span>
                  <span className="mt-2 block font-semibold text-ink group-hover:text-brand">{newer.title}</span>
                </Link>
              )}
            </div>
          </Reveal>
          <ReadingAside>
            <p className="eyebrow">Share the Post</p>
            <ul className="mt-8 flex gap-2">
              {[
                { label: "Facebook", icon: "facebook" as const, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
                { label: "LinkedIn", icon: "linkedin" as const, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
                { label: "X", icon: "twitter" as const, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}` },
              ].map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" aria-label={`Share on ${s.label}`} className="grid size-10 place-items-center rounded-md border border-line text-ink-soft transition-colors hover:border-brand hover:text-brand">
                    <Icon name={s.icon} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </ReadingAside>
        </div>
      </section>
      {related.length > 0 && (
        <section className="bg-paper-2 py-24 sm:py-32">
          <div className={CONTAINER}>
            <Reveal>
              <p className="eyebrow">Related Posts</p>
              <h2 className="display mt-8 text-[clamp(1.8rem,3vw,2.6rem)] text-ink">Keep reading</h2>
            </Reveal>
            <div className="mt-8 grid gap-14 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
