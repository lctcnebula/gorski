import { z } from "zod";
import type { Block, Post } from "./posts";

/**
 * Posts are edited as simple Markdown and stored as the same blocks the site already renders.
 *   ## Heading   ### Subheading   #### Small heading
 *   - list item
 *   > highlighted paragraph
 *   ![alt text](image-url)        (optional size: ![alt](url "small") or "medium")
 * A paragraph with single line breaks keeps them. **bold**, *italic* and [links](url) work inline.
 */
export function blocksToMarkdown(blocks: Block[]) {
  return blocks.map(block => {
    switch (block.type) {
      case "p": return block.text;
      case "lines": return block.lines.join("\n");
      case "strong": return `> ${block.text}`;
      case "h2": return `## ${block.text}`;
      case "h3": return `### ${block.text}`;
      case "h4": return `#### ${block.text}`;
      case "ul": return block.items.map(item => `- ${item}`).join("\n");
      case "img": return `![${block.alt}](${block.src}${block.size && block.size !== "full" ? ` "${block.size}"` : ""})`;
    }
  }).join("\n\n");
}

export function markdownToBlocks(markdown: string): Block[] {
  return markdown.replace(/\r\n/g, "\n").split(/\n\s*\n/).map(chunk => chunk.trim()).filter(Boolean).map((chunk): Block => {
    const heading = chunk.match(/^(#{2,4})\s+(.+)$/);
    if (heading && !chunk.includes("\n")) return { type: heading[1].length === 2 ? "h2" : heading[1].length === 3 ? "h3" : "h4", text: heading[2].trim() };
    const image = chunk.match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"(small|medium|full)")?\)$/);
    if (image) return { type: "img", alt: image[1], src: image[2], size: (image[3] as "small" | "medium" | "full" | undefined) ?? "full" };
    const lines = chunk.split("\n").map(line => line.trim());
    if (lines.every(line => /^[-*]\s+/.test(line))) return { type: "ul", items: lines.map(line => line.replace(/^[-*]\s+/, "")) };
    if (lines.every(line => line.startsWith(">"))) return { type: "strong", text: lines.map(line => line.replace(/^>\s?/, "")).join(" ") };
    return lines.length > 1 ? { type: "lines", lines } : { type: "p", text: chunk };
  });
}

export const reservedSlugs = ["admin", "api", "blog", "appointments", "contact-us", "contact", "faq", "home", "hipaa-notice-of-privacy-practices", "html-sitemap", "meet-the-doctor", "migraine-relief", "migraine-severity-assessment-tool", "our-approach", "privacy-policy", "register-for-event", "reviews", "terms-and-conditions", "thank-you-for-assessment-submission", "robots.txt", "sitemap.xml", "images", "category"];

export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
}

const imageUrl = z.string().trim().max(1000).refine(value => value.startsWith("/") || /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(value), "Upload a banner image.");

export const postInputSchema = z.object({
  originalSlug: z.string().max(120).optional(),
  slug: z.string().trim().min(3, "Add a URL slug.").max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes in the URL slug.").refine(value => !reservedSlugs.includes(value), "That URL is used by another page. Choose a different slug."),
  title: z.string().trim().min(3, "Add a title.").max(200),
  seoTitle: z.string().trim().max(200).default(""),
  excerpt: z.string().trim().min(10, "Add a short summary (at least 10 characters).").max(600),
  author: z.string().trim().min(2, "Add an author.").max(100),
  category: z.string().trim().min(2, "Add a category.").max(80),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a publish date."),
  cover: imageUrl,
  content: z.string().trim().min(20, "Write the post content.").max(100000),
  published: z.boolean(),
});
export type PostInput = z.infer<typeof postInputSchema>;

export type AdminPost = Post & { published: boolean; updatedAt?: string };

export function dateLabel(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
