import type { Metadata } from "next";
import Link from "next/link";
import { NativeForm } from "@/components/NativeForm";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Motion";
import { CONTAINER, PageHero } from "@/components/Sections";

export const metadata: Metadata = {
  title: { absolute: "Migraine Severity Assessment Tool | Gorski Chiropractic Center" },
  description: "Take the migraine severity assessment to start a Migraine Conversation with Gorski Chiropractic Center.",
  alternates: { canonical: "/migraine-severity-assessment-tool" },
};

export default function AssessmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Migraine relief"
        title="Migraine Severity Assessment Tool"
        lines={["Migraine Severity", <span key="accent-line">Assessment Tool</span>]}
        crumbs={[{ label: "Migraine Relief", href: "/migraine-relief" }, { label: "Assessment" }]}
        lede={
          <>
            A few questions to help us understand how migraines are affecting your life.{" "}
            <Link href="/migraine-relief" className="link-arrow">
              About the R.E.B.I.R.T.H. Migraine Method <Icon name="arrowRight" className="size-4" />
            </Link>
          </>
        }
      />
      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        <Reveal className="card mx-auto max-w-4xl overflow-hidden p-2 sm:p-4">
          <NativeForm form="assessment" />
        </Reveal>
      </section>
    </>
  );
}
