import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/posts";
import { PAGES, SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = PAGES.map((p) => ({
    url: `${SITE.url}${p.href === "/" ? "" : p.href}`,
    changeFrequency: "monthly" as const,
    priority: p.href === "/" ? 1 : /privacy|hipaa|terms/.test(p.href) ? 0.3 : 0.8,
  }));
  const posts = POSTS.map((p) => ({ url: `${SITE.url}/${p.slug}`, lastModified: p.date, priority: 0.6 }));
  return [...pages, ...posts];
}
