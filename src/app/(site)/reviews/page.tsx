import type { Metadata } from "next";
import { Elfsight } from "@/components/Embeds";
import { Reveal } from "@/components/Motion";
import { CONTAINER, CtaBand, PageHero } from "@/components/Sections";

export const metadata: Metadata = {
  title: { absolute: "Patient Reviews | Gorski Chiropractic" },
  description: "Read what patients say about Gorski Chiropractic Center in Warrenville, IL.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero eyebrow="Patient reviews" title="Reviews" lines={[<span key="accent-line">Patient Reviews</span>]} crumbs={[{ label: "Reviews" }]} lede="In our patients' own words." />
      <section className={`${CONTAINER} pb-24 sm:pb-32`}>
        <Reveal>
          <Elfsight widget="reviewsPage" />
        </Reveal>
      </section>
      <CtaBand />
    </>
  );
}
