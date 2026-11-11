import type { Metadata } from "next";
import { PostCard } from "@/components/Content";
import { Reveal } from "@/components/Motion";
import { CONTAINER, CtaBand, PageHero } from "@/components/Sections";
import { publishedPosts } from "@/lib/server/blog";

export const metadata: Metadata = {
  title: { absolute: "Chiropractic Blog | Tips & Wellness from Gorski Chiropractic" },
  description: "Wellness articles from Gorski Chiropractic Center in Warrenville, IL: stress, the nervous system and natural health.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const [latest, ...rest] = await publishedPosts();
  return (
    <>
      <PageHero eyebrow="Blog" title="Blog" lines={[<span key="accent-line">The Blog</span>]} crumbs={[{ label: "Blog" }]} lede="Tips and wellness notes from Dr. Gorski and the team." />
      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        {latest ? <Reveal>
          <PostCard post={latest} featured />
        </Reveal> : <p className="text-lg text-ink-soft">New articles are on the way. Check back soon.</p>}
        {rest.length > 0 && (
          <div className="mt-8 grid gap-14 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
      <CtaBand />
    </>
  );
}
