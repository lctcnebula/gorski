import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import { Icon } from "./Icon";
import { MaskLines, Reveal } from "./Motion";

export const CONTAINER = "mx-auto w-full max-w-[1400px] px-5 sm:px-10";

type HeroMedia = { video: string; poster: string } | { image: string; alt: string; portrait?: boolean };

/** Inner-page hero: breadcrumb, eyebrow, big serif title, an optional lede and an optional video or photo beside it. */
export function PageHero({
  eyebrow,
  title,
  lines,
  lede,
  crumbs = [],
  media,
  children,
}: {
  eyebrow: string;
  title: string;
  lines?: ReactNode[];
  lede?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  media?: HeroMedia;
  children?: ReactNode;
}) {
  return (
    <section className="relative mb-20 flex min-h-[70svh] flex-col justify-center border-b border-line pt-32 pb-20 sm:mb-28 sm:pb-24 lg:min-h-[80svh] lg:pt-40">
      <div className={media ? `${CONTAINER} grid gap-14 md:grid-cols-[1.1fr_1fr] md:items-center lg:gap-24` : CONTAINER}>
        <div>
          <Reveal y={10}>
            <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-xs text-muted">
              <Link href="/" className="transition-colors hover:text-ink">
                Home
              </Link>
              {crumbs.map((c) => (
                <span key={c.label} className="inline-flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-ink">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-ink">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
            <p className="eyebrow">{eyebrow}</p>
          </Reveal>
          <MaskLines as="h1" onMount delay={0.15} className="display mt-6 max-w-5xl text-[clamp(2.25rem,4.5vw,4rem)] text-ink" lines={lines ?? [title]} />
          {lede && (
            <Reveal delay={0.5}>
              <div className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{lede}</div>
            </Reveal>
          )}
          {children}
        </div>
        {media && (
          <Reveal delay={0.3} className={`frame w-full ${"image" in media && media.portrait ? "aspect-[4/5] max-h-[65svh]" : "aspect-[16/9] max-h-[40svh] md:max-h-[calc(100svh-16rem)]"}`}>
            {"video" in media ? (
              <video
                className="h-full w-full object-cover"
                src={media.video}
                poster={media.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
              />
            ) : (
              <Image src={media.image} alt={media.alt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: media.portrait ? "85% center" : undefined }} />
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}

/** Eyebrow + serif heading used at the top of most sections. */
export function SectionHead({
  eyebrow,
  title,
  lines,
  lede,
  align = "left",
  dark = false,
  className = "",
}: {
  eyebrow: string;
  title: string;
  lines?: ReactNode[];
  lede?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <Reveal y={10}>
        <p className={`eyebrow ${dark ? "eyebrow-dark" : ""} ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</p>
      </Reveal>
      <MaskLines
        as="h2"
        delay={0.1}
        className={`display mt-8 text-[clamp(1.85rem,3.2vw,2.75rem)] ${dark ? "text-on-dark" : "text-ink"}`}
        lines={lines ?? [title]}
      />
      {lede && (
        <Reveal delay={0.3}>
          <div className={`mt-6 text-lg leading-relaxed ${dark ? "text-on-dark-soft" : "text-ink-soft"}`}>{lede}</div>
        </Reveal>
      )}
    </div>
  );
}

/** Closing call to action used on the inner pages. */
export function CtaBand({
  title = "Ready to take the first step?",
  lede = "We welcome new patients. Make an appointment online or give us a call.",
  cta = "Make an Appointment",
  href = "/appointments",
  video,
}: {
  title?: string;
  lede?: string;
  cta?: string;
  href?: string;
  video?: { src: string; poster: string };
}) {
  return (
    <section className={`${CONTAINER} py-16 sm:py-20 lg:py-24`}>
      <Reveal>
        <div className="dark-section relative isolate overflow-hidden rounded-xl px-6 py-20 sm:px-12 sm:py-28">
          {video && <><video src={video.src} poster={video.poster} autoPlay muted loop playsInline preload="metadata" aria-hidden className="absolute inset-0 -z-20 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-black/70" /></>}
          <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow eyebrow-dark">{SITE.shortName}</p>
              <h2 className="display mt-8 text-[clamp(2rem,4vw,3.5rem)] text-on-dark">{title}</h2>
              <p className="mt-6 max-w-xl text-lg text-on-dark-soft">{lede}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href={href} className="btn btn-light btn-lg">
                {cta}
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
        </div>
      </Reveal>
    </section>
  );
}

/** Sticky side card beside long reading pages (blog posts, legal pages): phone and the appointment button. */
export function ReadingAside({ children }: { children?: ReactNode }) {
  return (
    <aside className="self-start lg:sticky lg:top-32">
      <Reveal delay={0.1} className="card p-8">
        {children}
        <div className={children ? "mt-10 border-t border-line pt-6" : ""}>
          <p className="text-xs tracking-[0.06em] text-muted uppercase">Questions?</p>
          <a href={SITE.phoneHref} className="mt-2 block text-lg font-semibold text-ink hover:text-brand">
            {SITE.phone}
          </a>
          <p className="mt-1 text-sm text-ink-soft">
            {SITE.address.street}, {SITE.address.city}, {SITE.address.region}
          </p>
          <Link href="/appointments" className="btn btn-primary mt-8 w-full">
            Make an Appointment
          </Link>
        </div>
      </Reveal>
    </aside>
  );
}

/** "Check Our Reviews" block shared by the inner pages. */
export function ReviewsBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-paper-2 py-16 sm:py-20 lg:py-24">
      <div className={CONTAINER}>
        <SectionHead eyebrow="Patient reviews" title={title} align="center" />
        <Reveal className="mt-8">{children}</Reveal>
      </div>
    </section>
  );
}
