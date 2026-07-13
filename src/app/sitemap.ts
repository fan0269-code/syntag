import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo";

const published = "published";
const staticPages: MetadataRoute.Sitemap = [
  { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
  { url: absoluteUrl("/disciplines"), changeFrequency: "weekly", priority: 0.8 },
  { url: absoluteUrl("/fields"), changeFrequency: "weekly", priority: 0.8 },
  { url: absoluteUrl("/theories"), changeFrequency: "weekly", priority: 0.8 },
  { url: absoluteUrl("/topics"), changeFrequency: "weekly", priority: 0.7 },
  { url: absoluteUrl("/scholars"), changeFrequency: "weekly", priority: 0.7 },
  { url: absoluteUrl("/works"), changeFrequency: "monthly", priority: 0.5 },
  { url: absoluteUrl("/concepts"), changeFrequency: "monthly", priority: 0.5 },
  { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.3 },
  { url: absoluteUrl("/editorial-policy"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
  { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const db = getDb();
    const [disciplines, fields, theories, scholars, works, topics, concepts] = await Promise.all([
      db.discipline.findMany({ where: { status: published }, select: { slug: true, publishedAt: true, updatedAt: true } }),
      db.field.findMany({ where: { status: published }, select: { slug: true, publishedAt: true, updatedAt: true } }),
      db.theory.findMany({ where: { status: published }, select: { slug: true, publishedAt: true, updatedAt: true } }),
      db.scholar.findMany({ where: { status: published }, select: { slug: true, publishedAt: true, updatedAt: true } }),
      db.work.findMany({ where: { status: published }, select: { slug: true, publishedAt: true, updatedAt: true } }),
      db.topic.findMany({ where: { status: published }, select: { slug: true, publishedAt: true, updatedAt: true } }),
      db.concept.findMany({ where: { status: published }, select: { slug: true, publishedAt: true, updatedAt: true } }),
    ]);
    const entries = (items: typeof theories, path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) => items.map((item) => ({
      url: absoluteUrl(`${path}/${item.slug}`),
      lastModified: item.updatedAt ?? item.publishedAt ?? undefined,
      changeFrequency,
      priority,
    }));
    return [
      ...staticPages,
      ...entries(disciplines, "/disciplines", 0.8, "monthly"),
      ...entries(fields, "/fields", 0.8, "monthly"),
      ...entries(theories, "/theories", 0.7, "monthly"),
      ...entries(topics, "/topics", 0.7, "monthly"),
      ...entries(scholars, "/scholars", 0.6, "monthly"),
      ...entries(works, "/works", 0.6, "monthly"),
      ...entries(concepts, "/concepts", 0.6, "monthly"),
    ];
  } catch {
    return staticPages;
  }
}
