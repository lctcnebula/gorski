import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/thank-you-for-assessment-submission", "/admin", "/api/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
