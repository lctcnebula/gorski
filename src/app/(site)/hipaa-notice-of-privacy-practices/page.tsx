import type { Metadata } from "next";
import { LegalPage } from "@/components/Content";
import { HIPAA } from "@/lib/legal";

export const metadata: Metadata = {
  title: "HIPAA Notice of Privacy Practices",
  description: "How medical information about you may be used and disclosed and how you can get access to this information.",
  alternates: { canonical: "/hipaa-notice-of-privacy-practices" },
};

export default function HipaaPage() {
  return <LegalPage title="HIPAA Notice of Privacy Practices" eyebrow="HIPAA" blocks={HIPAA} />;
}
