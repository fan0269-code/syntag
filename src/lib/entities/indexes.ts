import { INDEX_LIMIT, type EntityType } from "../entity-routes";
import { getDb } from "../db";

export type EntityIndexItem = { slug: string; title: string; summary: string; tags: string[] };

export async function getPublishedIndex(type: EntityType, take = INDEX_LIMIT): Promise<EntityIndexItem[]> {
  const limit = Math.min(Math.max(take, 1), INDEX_LIMIT);
  const db = getDb();

  if (type === "discipline") return (await db.discipline.findMany({ where: { status: "published" }, orderBy: { titleEn: "asc" }, take: limit, select: { slug: true, titleEn: true, descriptionEn: true } })).map((item) => ({ slug: item.slug, title: item.titleEn, summary: item.descriptionEn || "Published research discipline.", tags: ["Discipline"] }));
  if (type === "field") return (await db.field.findMany({ where: { status: "published" }, orderBy: { titleEn: "asc" }, take: limit, select: { slug: true, titleEn: true, descriptionEn: true, discipline: { select: { titleEn: true } } } })).map((item) => ({ slug: item.slug, title: item.titleEn, summary: item.descriptionEn || "Published research field.", tags: [item.discipline.titleEn] }));
  if (type === "theory") return (await db.theory.findMany({ where: { status: "published" }, orderBy: { titleEn: "asc" }, take: limit, select: { slug: true, titleEn: true, summaryEn: true, depth: true } })).map((item) => ({ slug: item.slug, title: item.titleEn, summary: item.summaryEn || "Published theoretical framework.", tags: [item.depth] }));
  if (type === "scholar") return (await db.scholar.findMany({ where: { status: "published" }, orderBy: { name: "asc" }, take: limit, select: { slug: true, name: true, bioEn: true } })).map((item) => ({ slug: item.slug, title: item.name, summary: item.bioEn || "Published scholar profile.", tags: ["Scholar"] }));
  if (type === "work") return (await db.work.findMany({ where: { status: "published" }, orderBy: { title: "asc" }, take: limit, select: { slug: true, title: true, publisher: true, year: true } })).map((item) => ({ slug: item.slug, title: item.title, summary: item.publisher || "Published foundational work.", tags: item.year ? [String(item.year)] : ["Work"] }));
  if (type === "topic") return (await db.topic.findMany({ where: { status: "published" }, orderBy: { questionEn: "asc" }, take: limit, select: { slug: true, questionEn: true } })).map((item) => ({ slug: item.slug, title: item.questionEn, summary: "Published research topic.", tags: ["Topic"] }));
  return (await db.concept.findMany({ where: { status: "published" }, orderBy: { termEn: "asc" }, take: limit, select: { slug: true, termEn: true, definitionEn: true } })).map((item) => ({ slug: item.slug, title: item.termEn, summary: item.definitionEn || "Published research concept.", tags: ["Concept"] }));
}
