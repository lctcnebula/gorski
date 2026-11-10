import Image from "next/image";
import Link from "next/link";
import type { Block, Post } from "@/lib/posts";
import type { LegalBlock } from "@/lib/legal";
import { Icon } from "./Icon";
import { Reveal } from "./Motion";
import { Rich } from "./Rich";
import { CONTAINER, PageHero, ReadingAside } from "./Sections";

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <article className={`card group overflow-hidden ${featured ? "lg:grid lg:grid-cols-2" : ""}`}>
      <Link href={`/${post.slug}`} className="block overflow-hidden">
        <Image
          src={post.cover}
          alt=""
          width={1200}
          height={675}
          className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
            featured ? "aspect-[4/3] lg:h-full" : "aspect-[16/10]"
          }`}
        />
      </Link>
      <div className="flex flex-col p-8">
        <p className="flex items-center gap-3 text-xs text-muted">
          <time dateTime={post.date}>{post.dateLabel}</time>
          <span aria-hidden className="h-px w-6 bg-line-strong" />
          <span>{post.category}</span>
        </p>
        <h3 className={`display mt-8 text-ink ${featured ? "text-[clamp(1.6rem,3vw,2.5rem)]" : "text-2xl"}`}>
          <Link href={`/${post.slug}`} className="transition-colors group-hover:text-brand">
            {post.title}
          </Link>
        </h3>
        <p className="mt-8 line-clamp-4 text-[0.975rem] leading-relaxed text-ink-soft">{post.excerpt}</p>
        <Link href={`/${post.slug}`} className="link-arrow mt-8">
          Read More <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    </article>
  );
}

export function PostBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-g">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i}>
                <Rich text={b.text} />
              </p>
            );
          case "strong":
            return (
              <p key={i} className="callout">
                <Rich text={b.text} />
              </p>
            );
          case "lines":
            return (
              <p key={i} className="lines">
                {b.lines.map((l, j) => (
                  <span key={j} className="block">
                    {l}
                  </span>
                ))}
              </p>
            );
          case "h2":
            return <h2 key={i}>{b.text}</h2>;
          case "h3":
            return <h3 key={i}>{b.text}</h3>;
          case "h4":
            return <h4 key={i}>{b.text}</h4>;
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it) => (
                  <li key={it}>
                    <Rich text={it} />
                  </li>
                ))}
              </ul>
            );
          case "img":
            return (
              <figure key={i} className={b.size ?? "full"}>
                <Image src={b.src} alt={b.alt} width={1200} height={800} sizes="(min-width: 1024px) 720px, 100vw" />
              </figure>
            );
        }
      })}
    </div>
  );
}

export function LegalBody({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <div className="prose-g">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i}>
                <Rich text={b.text} />
              </p>
            );
          case "h2":
            return <h2 key={i}>{b.text}</h2>;
          case "h3":
            return <h3 key={i}>{b.text}</h3>;
          case "h4":
            return <h4 key={i}>{b.text}</h4>;
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it) => (
                  <li key={it}>
                    <Rich text={it} />
                  </li>
                ))}
              </ul>
            );
          case "hr":
            return <hr key={i} />;
        }
      })}
    </div>
  );
}

export function LegalPage({ title, eyebrow = "Legal", blocks }: { title: string; eyebrow?: string; blocks: LegalBlock[] }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} crumbs={[{ label: title }]} title={title} />
      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-24">
          <Reveal as="article" className="min-w-0">
            <LegalBody blocks={blocks} />
          </Reveal>
          <ReadingAside />
        </div>
      </section>
    </>
  );
}
