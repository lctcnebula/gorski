import type { Metadata } from "next";
import { NativeForm } from "@/components/NativeForm";
import { Reveal } from "@/components/Motion";
import { CONTAINER, PageHero } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Register for Event",
  description: "Register for an upcoming event at Gorski Chiropractic Center.",
  alternates: { canonical: "/register-for-event" },
};

export default function RegisterForEventPage() {
  return (
    <>
      <PageHero eyebrow="Events" title="Register for Event" lines={["Register", <span key="accent-line">for Event</span>]} crumbs={[{ label: "Register for Event" }]} />
      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        <Reveal className="card mx-auto max-w-4xl overflow-hidden p-2 sm:p-4">
          <NativeForm form="event" />
        </Reveal>
      </section>
    </>
  );
}
