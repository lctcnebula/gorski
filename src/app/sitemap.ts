import type { MetadataRoute } from "next";
import { publishedPosts } from "@/lib/server/blog";
import { PAGES, SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = PAGES.map((p) => ({
    url: `${SITE.url}${p.href === "/" ? "" : p.href}`,
    changeFrequency: "monthly" as const,
    priority: p.href === "/" ? 1 : /privacy|hipaa|terms/.test(p.href) ? 0.3 : 0.8,
  }));
  const posts = (await publishedPosts()).map((p) => ({ url: `${SITE.url}/${p.slug}`, lastModified: p.date, priority: 0.6 }));
  return [...pages, ...posts];
}
