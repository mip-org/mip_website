import type { BlogPost } from "./types";

export function parseFrontmatter(raw: string): BlogPost {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Invalid frontmatter");
  }

  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  }

  return {
    title: meta.title ?? "",
    date: meta.date ?? "",
    slug: meta.slug ?? "",
    author: meta.author ?? "",
    summary: meta.summary ?? "",
    content: match[2].trim(),
  };
}
