import type { Metadata } from "next";
import { LegalPage } from "@/components/Content";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = {
  title: { absolute: "Terms and Conditions | Gorski Chiropractic" },
  description: "Terms and conditions for using the Gorski Chiropractic Center website.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsPage() {
  return <LegalPage title="Terms and Conditions" blocks={TERMS} />;
}
