import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { CONTAINER, CtaBand, PageHero } from "@/components/Sections";
import { DOCTOR } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Dr. Gorski, Chiropractor | Experienced Chiropractic Care" },
  description:
    "Meet Dr. Andrew Gorski, a Chicago western suburbs native who has practiced chiropractic in Warrenville, IL for over 35 years.",
  alternates: { canonical: "/meet-the-doctor" },
};

const Prose = ({ paragraphs, delay = 0 }: { paragraphs: readonly string[]; delay?: number }) => (
  <Reveal delay={delay} className="prose-g">
    {paragraphs.map((t) => (
      <p key={t}>{t}</p>
    ))}
  </Reveal>
);

export default function MeetTheDoctorPage() {
  return (
    <>
      <PageHero
        eyebrow="Meet the Doctor"
        title={DOCTOR.title}
        lines={["Meet", <span key="accent-line">The Doctor</span>]}
        media={{ image: "/images/dr-gorski.jpg", alt: "Dr. Andrew Gorski", portrait: true }}
        crumbs={[{ label: "Meet the Doctor" }]}
        lede="Dr. Andrew Gorski · Chiropractor · Warrenville, IL"
      />

      {/* Roots */}
      <section className={`${CONTAINER} grid gap-10 pb-20 sm:pb-24 lg:grid-cols-[1fr_1fr] lg:gap-16`}>
        <Reveal className="frame aspect-[3/2] self-start lg:sticky lg:top-28">
          <Image src="/images/dr-gorski-with-patient.jpg" alt="Dr. Gorski with a patient" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </Reveal>
        <Prose paragraphs={DOCTOR.intro} />
      </section>

      {/* A new path */}
      <section className="bg-paper-2 py-20 sm:py-24 lg:py-28">
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16`}>
          <div className="self-start lg:order-2 lg:sticky lg:top-32">
            <Reveal>
              <p className="eyebrow">A new path</p>
              <h2 className="display mt-8 text-[clamp(1.85rem,3.2vw,2.75rem)] text-ink">From the machine shop to the human frame</h2>
            </Reveal>
            <Reveal delay={0.1} className="frame mt-8 aspect-[4/3]">
              <Image src="/images/dr-gorski-fire-fighters.jpg" alt="Dr. Andrew Gorski with fire fighters" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </Reveal>
          </div>
          <Prose paragraphs={DOCTOR.path} delay={0.1} />
        </div>
      </section>

      {/* Hospital years & the pursuit */}
      <section className={`${CONTAINER} grid gap-10 py-20 sm:py-24 lg:py-28 lg:grid-cols-[1.2fr_1fr] lg:gap-16`}>
        <div className="lg:order-2"><Prose paragraphs={DOCTOR.hospital} /></div>
        <div className="self-start lg:order-1 lg:sticky lg:top-32">
          <Reveal delay={0.1} className="frame aspect-[4/3]">
            <Image src="/images/dr-gorski-super-heroes.jpg" alt="Dr. Andrew Gorski with super heroes" fill sizes="(min-width:1024px) 35vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.2} className="card mt-8 flex items-start gap-4 p-8">
            <Icon name="heart" className="size-5 shrink-0 text-brand" />
            <p className="text-ink-soft">
              Through a natural approach, Dr. Gorski hopes to help you live a healthier, more productive life – and he eagerly looks forward to partnering with you in that effort.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Partner with Dr. Gorski toward your best health." cta={DOCTOR.cta} video={{ src: "/video/meet-the-doctor.mp4", poster: "/images/meet-the-doctor-poster.jpg" }} />
    </>
  );
}
