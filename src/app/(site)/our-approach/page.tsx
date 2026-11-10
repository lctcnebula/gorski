import type { Metadata } from "next";
import Image from "next/image";
import { Elfsight } from "@/components/Embeds";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { CONTAINER, CtaBand, PageHero, ReviewsBlock } from "@/components/Sections";
import { APPROACH } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Chiropractic Approach at Gorski Chiropractic | Natural Pain Relief" },
  description:
    "Our approach starts with your nervous system: screening tests at our expense, a comprehensive evaluation, and natural care that addresses causes, not just symptoms.",
  alternates: { canonical: "/our-approach" },
};

const IMAGES: Record<string, { src: string; alt: string }> = {
  passion: { src: "/images/approach-dr-with-patient.jpg", alt: "Dr. Gorski with a patient" },
  "nervous-system": { src: "/images/approach-nervous-system.jpg", alt: "The nervous system" },
  stress: { src: "/images/approach-stress.jpg", alt: "A young professional under stress" },
  steps: { src: "/images/approach-wellness-nature.jpg", alt: "Wellness care with nature" },
};

export default function OurApproachPage() {
  const [passion, nervous, stress, approach, steps, purpose] = APPROACH.sections;
  return (
    <>
      <PageHero
        eyebrow="Our Approach"
        title={APPROACH.title}
        lines={["Our", <span key="accent-line">Approach</span>]}
        media={{ video: "/video/our-approach.mp4", poster: "/images/our-approach-poster.jpg" }}
        crumbs={[{ label: "Our Approach" }]}
        lede={passion.body[0]}
      >
        <Reveal delay={0.6}>
          <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
            {APPROACH.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="rounded-md border border-line px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-brand hover:text-brand">
                {s.title}
              </a>
            ))}
          </nav>
        </Reveal>
      </PageHero>

      {/* Our Passion */}
      <section id={passion.id} className={`${CONTAINER} grid items-center gap-10 pb-20 sm:pb-24 lg:grid-cols-2 lg:gap-16`}>
        <div className="lg:order-2">
          <Reveal>
            <h2 className="display mt-8 text-[clamp(1.85rem,3.2vw,2.75rem)] text-ink">{passion.title}</h2>
          </Reveal>
          <Reveal delay={0.1} className="prose-g mt-8">
            {passion.body.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </Reveal>
        </div>
        <Reveal delay={0.15} className="frame aspect-[4/3] lg:order-1">
          <Image src={IMAGES.passion.src} alt={IMAGES.passion.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </Reveal>
      </section>

      {/* Your Nervous System */}
      <section id={nervous.id} className="dark-section dark-wash py-20 sm:py-24 lg:py-28">
        <div className={`${CONTAINER} grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16`}>
          <Reveal className="overflow-hidden rounded-xl bg-paper lg:order-2">
            <Image src={IMAGES["nervous-system"].src} alt={IMAGES["nervous-system"].alt} width={627} height={300} sizes="(min-width:1024px) 45vw, 100vw" className="h-auto w-full" />
          </Reveal>
          <div className="lg:order-1">
            <Reveal>
              <h2 className="display mt-8 text-[clamp(1.85rem,3.2vw,2.75rem)] text-on-dark">{nervous.title}</h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-8 grid gap-4 text-lg leading-relaxed text-on-dark-soft">
              {nervous.body.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stress */}
      <section id={stress.id} className={`${CONTAINER} py-20 sm:py-24 lg:py-28`}>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="lg:order-2">
            <Reveal>
              <h2 className="display mt-8 text-[clamp(1.85rem,3.2vw,2.75rem)] text-ink">{stress.title}</h2>
            </Reveal>
            <Reveal delay={0.1} className="prose-g mt-8">
              {stress.body.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </Reveal>
            <Stagger className="mt-8 grid gap-4 sm:grid-cols-3">
              {stress.list!.map((item) => (
                <StaggerItem key={item.title} className="card p-8">
                  <h3 className="mt-6 font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">({item.note})</p>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.1} className="prose-g mt-8">
              {stress.after!.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </Reveal>
          </div>
          <Reveal delay={0.15} className="frame aspect-[3/4] lg:order-1">
            <Image src={IMAGES.stress.src} alt={IMAGES.stress.alt} fill sizes="(min-width:1024px) 35vw, 100vw" className="object-cover" />
          </Reveal>
        </div>
      </section>

      {/* Our Approach + Steps */}
      <section className="bg-paper-2 py-20 sm:py-24 lg:py-28">
        <div className={CONTAINER}>
          <Reveal id={approach.id} className="mx-auto max-w-4xl scroll-mt-28">
            <h2 className="display text-[clamp(1.8rem,3vw,2.6rem)] text-ink">{approach.title}</h2>
            <ul className="mt-8 grid gap-5">
              {approach.body.map((t) => <li key={t} className="border-l-2 border-line pl-5 leading-relaxed text-ink-soft">{t}</li>)}
            </ul>
          </Reveal>
          <div id={steps.id} className="mt-16 grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className="frame aspect-[16/9] lg:order-2">
              <Image src={IMAGES.steps.src} alt={IMAGES.steps.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            </Reveal>
            <Reveal className="lg:order-1">
              <h2 className="display text-[clamp(1.8rem,3vw,2.6rem)] text-ink">{steps.title}</h2>
              <div className="prose-g mt-8">{steps.body.map(t => <p key={t}>{t}</p>)}</div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Purpose */}
      <section id={purpose.id} className={`${CONTAINER} py-20 sm:py-24 lg:py-28`}>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="display mt-8 text-[clamp(1.85rem,3.2vw,2.75rem)] text-ink">{purpose.title}</h2>
          </Reveal>
          <Reveal delay={0.1} className="prose-g mt-8 text-left sm:text-center">
            {purpose.body.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand title="Your best life depends upon your best health." cta={APPROACH.cta} />

      <ReviewsBlock title={APPROACH.reviewsTitle}>
        <Elfsight widget="reviewsHome" />
      </ReviewsBlock>
    </>
  );
}
