import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { CONTAINER, PageHero } from "@/components/Sections";
import { ASSESSMENT_THANKS } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Migraine Severity Assessment Tool | Gorski Chiropractic Center" },
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <>
      <PageHero
        eyebrow="Thank you"
        title={ASSESSMENT_THANKS.title}
        lines={["Assessment Submitted", <span key="accent-line">Successfully</span>]}
        crumbs={[{ label: "Migraine Relief", href: "/migraine-relief" }, { label: "Thank you" }]}
        lede={ASSESSMENT_THANKS.body}
      />
      <section className={`${CONTAINER} pb-24`}>
        <Reveal className="flex flex-wrap gap-3">
          <Link href="/appointments" className="btn btn-primary btn-lg">
            {ASSESSMENT_THANKS.ctaAppointment}
            <span className="btn-arrow">
              <Icon name="arrowUpRight" className="size-4" />
            </span>
          </Link>
          <Link href="/register-for-event" className="btn btn-outline btn-lg">
            {ASSESSMENT_THANKS.ctaEvent}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
