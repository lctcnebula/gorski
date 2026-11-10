import type { Metadata } from "next";
import { NativeForm } from "@/components/NativeForm";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { CONTAINER, PageHero } from "@/components/Sections";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Chiropractic Appointment at Gorski Chiropractic | Warrenville, IL" },
  description: "Request an appointment at Gorski Chiropractic Center in Warrenville, IL, or call (630) 393-6699.",
  alternates: { canonical: "/appointments" },
};

export default function AppointmentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Appointments"
        title="Make an Appointment"
        lines={["Make an", <span key="accent-line">Appointment</span>]}
        media={{ image: "/images/welcome-new-patients.webp", alt: "Dr. Gorski with a new patient" }}
        crumbs={[{ label: "Make an Appointment" }]}
        lede="We welcome new patients. Fill in the form and our office will confirm your appointment, or call us directly."
      />
      <section className={`${CONTAINER} grid gap-14 pb-24 sm:pb-32 lg:grid-cols-[1fr_minmax(0,2fr)] lg:gap-24`}>
        <Reveal className="grid gap-4 self-start lg:sticky lg:top-28">
          <a href={SITE.phoneHref} className="card flex items-center gap-4 p-8 transition-colors hover:border-brand">
            <Icon name="phone" className="size-5 shrink-0 text-brand" />
            <span>
              <span className="block text-xs font-medium tracking-[0.06em] text-muted uppercase">Call us</span>
              <span className="block text-lg font-semibold text-ink">{SITE.phone}</span>
            </span>
          </a>
          <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="card flex items-center gap-4 p-8 transition-colors hover:border-brand">
            <Icon name="pin" className="size-5 shrink-0 text-brand" />
            <span>
              <span className="block text-xs font-medium tracking-[0.06em] text-muted uppercase">Our location</span>
              <span className="block text-ink">
                {SITE.address.street}, {SITE.address.city}, {SITE.address.region} {SITE.address.postal}
              </span>
            </span>
          </a>
          <div className="card p-8">
            <p className="flex items-center gap-2 text-xs font-medium tracking-[0.06em] text-muted uppercase">
              <Icon name="clock" className="size-4 text-brand" /> Operating hours
            </p>
            <ul className="mt-8 grid gap-2 text-sm">
              {SITE.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 border-b border-line pb-2 last:border-0">
                  <span className="font-medium text-ink">{h.day}</span>
                  <span className="text-right text-ink-soft">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="card overflow-hidden p-2 sm:p-4">
          <NativeForm form="appointments" />
        </Reveal>
      </section>
    </>
  );
}
