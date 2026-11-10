"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HOME } from "@/lib/content";
import { SITE } from "@/lib/site";
import { Icon } from "./Icon";
import { EASE, MaskLines } from "./Motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
});

const FACTS: { label: string; value: string }[] = [
  { label: "Established", value: "1988" },
  { label: "Location", value: `${SITE.address.city}, ${SITE.address.region}` },
  { label: "New patients", value: "Welcome" },
];

/**
 * Home hero: a split layout on the paper background. Copy and the two calls to action on the left;
 * the practice's own jogging clip on the right, framed like a photograph rather than used as a backdrop.
 */
export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-center pt-28 pb-16 lg:pt-32 lg:pb-20">
      <div className="mx-auto grid w-full max-w-[1400px] gap-14 px-5 sm:px-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-24">
        <div>
          <motion.p {...fadeUp(0.05)} className="eyebrow">
            {HOME.hero.eyebrow}
          </motion.p>

          <MaskLines
            as="h1"
            onMount
            delay={0.15}
            className="display mt-8 text-[clamp(2.75rem,6vw,5.25rem)] text-ink"
            lines={["Wellness", "awaits you."]}
          />

          <motion.p {...fadeUp(0.55)} className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft sm:text-xl">
            {HOME.hero.lede}
          </motion.p>

          <motion.div {...fadeUp(0.7)} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/appointments" className="btn btn-primary btn-lg">
              {HOME.hero.cta}
              <span className="btn-arrow">
                <Icon name="arrowUpRight" className="size-4" />
              </span>
            </Link>
            <a href={SITE.phoneHref} className="link-arrow text-base text-ink">
              <Icon name="phone" className="size-4 text-brand" />
              Call {SITE.phone}
            </a>
          </motion.div>

          <motion.dl {...fadeUp(0.9)} className="rule mt-10 grid grid-cols-3 gap-14 pt-5 text-sm">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="text-muted">{f.label}</dt>
                <dd className="mt-1 font-medium text-ink">{f.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
          className="relative"
        >
          <div className="frame aspect-[16/10] max-h-[40svh] w-full lg:max-h-[calc(100svh-16rem)]">
            <video
              className="h-full w-full object-cover"
              src="/video/hero.mp4"
              poster="/images/hero.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            />
          </div>
          <figcaption className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-sm text-muted">
            <span>
              {SITE.address.street}, {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
            </span>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
            >
              Get directions
              <Icon name="arrowUpRight" className="size-3.5" />
            </a>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
