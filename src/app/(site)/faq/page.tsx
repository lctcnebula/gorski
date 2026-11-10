import type { Metadata } from "next";
import Link from "next/link";
import { CONTAINER, PageHero } from "@/components/Sections";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find our location, office hours, appointment information, and migraine assessment links.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return <>
    <PageHero eyebrow="Planning your visit" title="Frequently Asked Questions" crumbs={[{ label: "FAQ" }]} lede="Practical information about visiting Gorski Chiropractic Center." />
    <section className={`${CONTAINER} pb-20 sm:pb-24`}>
      <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
        <details className="group py-6" open><summary className="cursor-pointer text-xl font-medium text-ink">How can I request an appointment?</summary><p className="mt-4 leading-relaxed text-ink-soft">Use our <Link href="/appointments" className="underline">appointment form</Link> or call <a href={SITE.phoneHref} className="underline">{SITE.phone}</a>. Our office will confirm your appointment.</p></details>
        <details className="group py-6"><summary className="cursor-pointer text-xl font-medium text-ink">Where is the office?</summary><p className="mt-4 leading-relaxed text-ink-soft">{SITE.address.street}, {SITE.address.city}, {SITE.address.region} {SITE.address.postal}. <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="underline">Get directions</a>.</p></details>
        <details className="group py-6"><summary className="cursor-pointer text-xl font-medium text-ink">What are your office hours?</summary><ul className="mt-4 grid gap-3 text-ink-soft">{SITE.hours.map(h => <li key={h.day} className="flex flex-wrap justify-between gap-2"><span className="font-medium">{h.day}</span><span>{h.time}</span></li>)}</ul></details>
        <details className="group py-6"><summary className="cursor-pointer text-xl font-medium text-ink">Are you welcoming new patients?</summary><p className="mt-4 leading-relaxed text-ink-soft">Yes. We welcome new patients. <Link href="/appointments" className="underline">Request an appointment</Link> or call our office to discuss your visit.</p></details>
        <details className="group py-6"><summary className="cursor-pointer text-xl font-medium text-ink">Where can I learn about the R.E.B.I.R.T.H. Migraine Method?</summary><p className="mt-4 leading-relaxed text-ink-soft">Visit our <Link href="/migraine-relief" className="underline">Migraine Relief page</Link> or complete the <Link href="/migraine-severity-assessment-tool" className="underline">Migraine Severity Assessment</Link>.</p></details>
      </div>
    </section>
  </>;
}
