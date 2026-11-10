import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { CONTAINER, PageHero } from "@/components/Sections";
import { CONTACT } from "@/lib/content";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Contact Chiropractor at Gorski Chiropractic | Warrenville, IL" },
  description: `Contact Gorski Chiropractic Center: ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postal}. Call ${SITE.phone}.`,
  alternates: { canonical: "/contact-us" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={CONTACT.title}
        lines={[<span key="accent-line">Contact Us</span>]}
        crumbs={[{ label: "Contact" }]}
        media={{ image: "/images/dr-gorski-with-patient.jpg", alt: "Dr. Gorski caring for a patient" }}
        lede="Call, visit, or request an appointment online. We will answer as soon as we can."
      />
      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        <Stagger className="grid gap-14 lg:grid-cols-3">
          <StaggerItem className="card p-8">
            <Icon name="pin" className="size-5 shrink-0 text-brand" />
            <h2 className="display mt-8 text-2xl text-ink">
              <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-brand">
                {CONTACT.location}
              </a>
            </h2>
            <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="mt-6 block text-ink-soft hover:text-brand">
              {SITE.address.street}, {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
            </a>
            <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="link-arrow mt-8 text-sm">
              Get directions <Icon name="arrowUpRight" className="size-4" />
            </a>
          </StaggerItem>
          <StaggerItem className="card p-8">
            <Icon name="phone" className="size-5 shrink-0 text-brand" />
            <h2 className="display mt-8 text-2xl text-ink">
              <a href={SITE.phoneHref} className="hover:text-brand">
                {CONTACT.call}
              </a>
            </h2>
            <p className="mt-6 text-ink-soft">
              {CONTACT.callNote}{" "}
              <a href={SITE.phoneHref} className="font-semibold text-ink hover:text-brand">
                {SITE.phone}
              </a>
            </p>
            <Link href="/appointments" className="link-arrow mt-8 text-sm">
              Or request an appointment online <Icon name="arrowRight" className="size-4" />
            </Link>
          </StaggerItem>
          <StaggerItem className="card p-8">
            <Icon name="clock" className="size-5 shrink-0 text-brand" />
            <h2 className="display mt-8 text-2xl text-ink">{CONTACT.hours}</h2>
            <ul className="mt-8 grid gap-2 text-sm">
              {SITE.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 border-b border-line pb-2 last:border-0">
                  <span className="font-medium text-ink">{h.day}</span>
                  <span className="text-right text-ink-soft">{h.time}</span>
                </li>
              ))}
            </ul>
          </StaggerItem>
        </Stagger>
      </section>
      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        <Reveal className="overflow-hidden rounded-xl border border-line">
          <iframe
            src={SITE.mapsEmbed}
            title={`Map to ${SITE.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-[28rem] w-full"
          />
        </Reveal>
      </section>
    </>
  );
}
