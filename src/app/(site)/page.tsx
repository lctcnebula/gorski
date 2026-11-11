import Image from "next/image";
import Link from "next/link";
import { Elfsight, YouTube } from "@/components/Embeds";
import { Hero } from "@/components/Hero";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { Rich } from "@/components/Rich";
import { CONTAINER, SectionHead } from "@/components/Sections";
import { HOME } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* We Welcome New Patients */}
      <section className="pt-8 pb-24 sm:pt-12 sm:pb-32">
        <div className={CONTAINER}>
          <Reveal>
            <div className="card grid overflow-hidden lg:grid-cols-[1fr_1fr]">
              <div className="relative min-h-[18rem]">
                <Image
                  src="/images/welcome-new-patients.webp"
                  alt="We Welcome New Patients"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <p className="eyebrow">New patients</p>
                <h2 className="display mt-8 text-[clamp(2rem,3.4vw,3rem)] text-ink">{HOME.welcome.title}</h2>
                <p className="mt-8 text-lg text-ink-soft">{HOME.welcome.note}</p>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link href="/appointments" className="btn btn-primary">
                    {HOME.welcome.cta}
                  </Link>
                  <a href={SITE.phoneHref} className="link-arrow text-ink">
                    <Icon name="phone" className="size-4 text-brand" />
                    {SITE.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Meet the Doctor */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16`}>
          <Reveal className="self-start lg:sticky lg:top-28">
            <div className="frame aspect-[410/571]">
              <Image src="/images/home-doctor.png" alt="Dr. Andrew Gorski in his white coat" fill sizes="(min-width: 1024px) 40vw, 100vw" style={{ objectFit: "contain" }} />
            </div>
            <p className="mt-4 text-sm text-muted">Dr. Andrew Gorski, D.C.</p>
          </Reveal>
          <div>
            <SectionHead eyebrow="Meet the Doctor" title={HOME.doctor.title} lede={HOME.doctor.lead} />
            <Reveal delay={0.1} className="prose-g mt-8">
              {HOME.doctor.body.map((t) => (
                <p key={t}>
                  <Rich text={t} />
                </p>
              ))}
            </Reveal>
            <Reveal delay={0.2}>
              <Link href="/meet-the-doctor" className="link-arrow mt-8 text-base">
                {HOME.doctor.cta} <Icon name="arrowRight" className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="dark-section py-20 sm:py-24 lg:py-28">
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16`}>
          <div>
            <SectionHead eyebrow="Our Approach" title={HOME.approach.title} dark />
            <Reveal delay={0.1} className="mt-8 grid gap-4 text-lg leading-relaxed text-on-dark-soft">
              {HOME.approach.body.map((t) => (
                <p key={t}>
                  <Rich text={t} />
                </p>
              ))}
            </Reveal>
            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
              <Link href="/our-approach" className="btn btn-light">
                {HOME.approach.cta}
              </Link>
              <Link href="/appointments" className="btn btn-ghost-dark">
                {HOME.approach.cta2}
              </Link>
            </Reveal>
          <Reveal className="mt-10 border-t border-line-dark pt-8">
            <h3 className="display text-2xl text-on-dark sm:text-3xl">{HOME.approach.methodTitle}</h3>
            <div className="mt-6 grid gap-4 leading-relaxed text-on-dark-soft">
              {HOME.approach.method.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </Reveal>
          </div>
          <div className="lg:self-center">
            <Reveal className="frame aspect-[3/2]">
              <Image src="/images/home-doctor-patient.jpg" alt="Dr. Gorski caring for a patient" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            </Reveal>
          </div>
        </div>

      </section>

      {/* Migraine Relief */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div className={`${CONTAINER} grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16`}>
          <Reveal className="frame aspect-[5/4] lg:order-1">
            <Image src="/images/home-migraine.png" alt="Migraine relief at Gorski Chiropractic Center" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </Reveal>
          <div className="lg:order-2">
            <SectionHead eyebrow="Migraine relief" title={HOME.migraine.title} />
            <Reveal delay={0.1} className="prose-g mt-8">
              {HOME.migraine.body.map((t) => (
                <p key={t}>
                  <Rich text={t} />
                </p>
              ))}
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 text-ink">{HOME.migraine.sub}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/migraine-relief" className="btn btn-primary">
                  {HOME.migraine.cta}
                </Link>
                <Link href="/migraine-severity-assessment-tool" className="btn btn-outline">
                  Migraine Assessment
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="linen py-20 sm:py-24 lg:py-28">
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16`}>
          <div>
            <SectionHead eyebrow="Get in touch" title={HOME.contact.title} />
            <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={SITE.phoneHref} className="btn btn-primary btn-lg">
                Call {SITE.phone}
              </a>
              <Link href="/contact-us" className="link-arrow text-base">
                {HOME.contact.cta} <Icon name="arrowRight" className="size-4" />
              </Link>
            </Reveal>
            <dl className="mt-10 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-base text-muted">Address</dt>
                <dd className="mt-1 text-[1.5rem] leading-snug text-ink">
                  <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-brand">
                    {SITE.address.street}
                    <br />
                    {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-base text-muted">Phone</dt>
                <dd className="mt-1 text-[1.5rem] leading-snug text-ink">
                  <a href={SITE.phoneHref} className="transition-colors hover:text-brand">
                    {SITE.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <Reveal delay={0.15}>
            <YouTube video="exam" poster="/images/office.jpg" />
          </Reveal>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div className={CONTAINER}>
          <SectionHead eyebrow="Patient reviews" title={HOME.reviews.title} />
          <Reveal className="mt-8">
            <Elfsight widget="reviewsHome" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
