import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Elfsight } from "@/components/Embeds";
import { Icon } from "@/components/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { Rich } from "@/components/Rich";
import { CONTAINER, PageHero, ReviewsBlock } from "@/components/Sections";
import { MIGRAINE } from "@/lib/content";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "A New Beginning for Migraine Relief in Warrenville, IL" },
  description:
    "The R.E.B.I.R.T.H. Migraine Method focuses on neurological function and underlying causes, not just managing symptoms. Gorski Chiropractic Center, Warrenville, IL.",
  alternates: { canonical: "/migraine-relief" },
};

const Prose = ({ paragraphs, dark = false }: { paragraphs: readonly string[]; dark?: boolean }) => (
  <div className={dark ? "mt-8 grid gap-4 text-lg leading-relaxed text-on-dark-soft" : "prose-g mt-8"}>
    {paragraphs.map((t) => (
      <p key={t}>
        <Rich text={t} />
      </p>
    ))}
  </div>
);

export default function MigraineReliefPage() {
  const [pain, overview, causes, solutions, results, different] = MIGRAINE.sections;
  return (
    <>
      <PageHero
        eyebrow="Migraine relief"
        title={MIGRAINE.title}
        lines={["A New Beginning", <span key="accent-line">for Migraine Relief</span>]}
        media={{ image: "/images/migraine-banner.jpg", alt: "A woman breathing calmly at sunrise" }}
        crumbs={[{ label: "Migraine Relief" }]}
        lede={
          <p className="display text-[1.35rem] leading-snug text-ink">
            <Rich text={MIGRAINE.subtitle} />
          </p>
        }
      >
        <Reveal delay={0.6} className="mt-8 flex flex-wrap gap-3">
          <Link href="/migraine-severity-assessment-tool" className="btn btn-primary btn-lg">
            {MIGRAINE.ready.cta}
            <span className="btn-arrow">
              <Icon name="arrowUpRight" className="size-4" />
            </span>
          </Link>
          <a href={SITE.phoneHref} className="btn btn-outline btn-lg">
            <Icon name="phone" className="size-4 text-brand" />
            {SITE.phone}
          </a>
        </Reveal>
      </PageHero>

      {/* Pain */}
      <section className={`${CONTAINER} grid items-center gap-10 pb-20 sm:pb-24 lg:grid-cols-2 lg:gap-16`}>
        <div>
          <Reveal><h2 className="display text-[clamp(1.85rem,3.2vw,2.75rem)] text-ink">{pain.title}</h2></Reveal>
          <Reveal><Prose paragraphs={pain.body} /></Reveal>
        </div>
        <Reveal className="frame aspect-[3/2]">
          <Image src="/media/wordpress/2026/02/Migraines-Cause-Pain-–-and-They-Rob-You-of-Life.png" alt="A woman resting with a migraine" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </Reveal>
      </section>
      {/* Overview */}
      <section className={`${CONTAINER} grid items-center gap-10 pb-20 sm:pb-24 lg:grid-cols-2 lg:gap-16`}>
        <Reveal className="frame aspect-[5/4]">
          <Image src="/images/migraine-5.png" alt="The R.E.B.I.R.T.H. Migraine Method" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </Reveal>
        <Reveal><h2 className="display text-[clamp(1.85rem,3.2vw,2.75rem)] text-ink">{overview.title}</h2><Prose paragraphs={overview.body} /></Reveal>
      </section>

      {/* Causes + Solutions */}
      <section className="dark-section dark-wash py-20 sm:py-24 lg:py-28">
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-2 lg:gap-16`}>
          <Reveal>
            <h2 className="display mt-8 text-[clamp(1.85rem,3.2vw,2.75rem)] text-on-dark">{causes.title}</h2>
            <Prose paragraphs={causes.body} dark />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display mt-8 text-[clamp(1.85rem,3.2vw,2.75rem)] text-on-dark">{solutions.title}</h2>
            <Prose paragraphs={solutions.body} dark />
          </Reveal>
        </div>
      </section>

      {/* Results */}
      <section className={`${CONTAINER} grid items-center gap-10 py-20 sm:py-24 lg:py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-16`}>
        <Reveal className="frame aspect-[3/2]">
          <Image src="/images/migraine-2.png" alt="Dr. Gorski discussing care with a patient" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </Reveal>
        <div>
          <Reveal>
            <h2 className="display mt-8 text-[clamp(1.85rem,3.2vw,2.75rem)] text-ink">{results.title}</h2>
            <Prose paragraphs={results.body} />
          </Reveal>
          <Stagger className="mt-8 grid">
            {results.list!.map((item) => (
              <StaggerItem key={item} className="flex items-start gap-3 rule pt-3">
                <Icon name="check" className="mt-1.5 size-3.5 shrink-0 text-brand" />
                <p className="text-ink-soft">{item}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.1}>
            <Prose paragraphs={results.after!} />
          </Reveal>
        </div>
      </section>

      {/* Different + testimonial */}
      <section className="bg-paper-2 py-20 sm:py-24 lg:py-28">
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16`}>
          <Reveal>
            <h2 className="display mt-8 text-[clamp(1.85rem,3.2vw,2.75rem)] text-ink">{different.title}</h2>
            <Prose paragraphs={different.body} />
          </Reveal>
          <Reveal delay={0.15} className="card flex flex-col justify-between p-8 sm:p-12">
            <div>
              <p className="eyebrow">{MIGRAINE.testimonial.title}</p>
              <blockquote className="display mt-6 text-[clamp(1.3rem,2vw,1.7rem)] leading-snug text-ink">
                “{MIGRAINE.testimonial.quote}”
              </blockquote>
            </div>
            <p className="mt-8 flex items-center gap-3 text-sm font-semibold text-ink">
              <span className="flex text-brand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" className="size-4 fill-current" />
                ))}
              </span>
              {MIGRAINE.testimonial.by}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Ready */}
      <section className={`${CONTAINER} py-20 sm:py-24 lg:py-28`}>
        <Reveal>
          <div className="dark-section grid overflow-hidden rounded-xl lg:grid-cols-[1.1fr_1fr]">
            <div className="p-8 sm:p-12">
              <p className="eyebrow eyebrow-dark">Next step</p>
              <h2 className="display mt-8 text-[clamp(2rem,4vw,3.5rem)] text-on-dark">{MIGRAINE.ready.title}</h2>
              <Prose paragraphs={MIGRAINE.ready.body} dark />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/migraine-severity-assessment-tool" className="btn btn-light btn-lg">
                  {MIGRAINE.ready.cta}
                  <span className="btn-arrow">
                    <Icon name="arrowUpRight" className="size-4" />
                  </span>
                </Link>
                <a href={SITE.phoneHref} className="btn btn-ghost-dark btn-lg">
                  <Icon name="phone" className="size-4" />
                  {SITE.phone}
                </a>
              </div>
            </div>
            <div className="relative min-h-[18rem]">
              <Image src="/images/migraine-3.png" alt="A Migraine Conversation with our team" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      <ReviewsBlock title={MIGRAINE.reviewsTitle}>
        <Elfsight widget="reviewsHome" />
      </ReviewsBlock>
    </>
  );
}
