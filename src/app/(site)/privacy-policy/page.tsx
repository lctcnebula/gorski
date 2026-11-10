import type { Metadata } from "next";
import { LegalPage } from "@/components/Content";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Gorski Chiropractic Center collects, uses and protects information obtained through gorskichiro.com.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" blocks={PRIVACY} />;
}
