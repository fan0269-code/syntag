import { getDb } from "./db";
import type { InternalLink } from "./static-internal-links";

export { STATIC_INTERNAL_LINKS } from "./static-internal-links";

export type InternalLinkEntityType = "theory" | "scholar" | "topic" | "work";
export type { InternalLink } from "./static-internal-links";

const published = "published";

function uniqueLinks(links: InternalLink[]) {
  return Array.from(new Map(links.map((link) => [link.href, link])).values());
}

/**
 * Returns only real, published graph relationships. It intentionally does not
 * synthesize links when a sparse entity has fewer connections than the target.
 */
export async function getInternalLinks(entityType: InternalLinkEntityType, entitySlug: string): Promise<InternalLink[]> {
  const db = getDb();

  if (entityType === "theory") {
    const theory = await db.theory.findFirst({
      where: { slug: entitySlug, status: published },
      include: {
        scholars: { where: { scholar: { status: published } }, include: { scholar: true }, take: 3 },
        sourceRelations: { where: { targetTheory: { status: published } }, include: { targetTheory: true }, take: 2 },
        targetRelations: { where: { sourceTheory: { status: published } }, include: { sourceTheory: true }, take: 2 },
        topics: { where: { topic: { status: published } }, include: { topic: true }, take: 2 },
      },
    });
    if (!theory) return [];
    return uniqueLinks([
      ...theory.scholars.map(({ scholar }) => ({ label: scholar.name, href: `/scholars/${scholar.slug}`, reason: "Associated scholar" })),
      ...theory.sourceRelations.map(({ targetTheory }) => ({ label: targetTheory.titleEn, href: `/theories/${targetTheory.slug}`, reason: "Related theory" })),
      ...theory.targetRelations.map(({ sourceTheory }) => ({ label: sourceTheory.titleEn, href: `/theories/${sourceTheory.slug}`, reason: "Related theory" })),
      ...theory.topics.map(({ topic }) => ({ label: topic.questionEn, href: `/topics/${topic.slug}`, reason: "Related research topic" })),
    ]);
  }

  if (entityType === "scholar") {
    const scholar = await db.scholar.findFirst({
      where: { slug: entitySlug, status: published },
      include: {
        theories: { where: { theory: { status: published } }, include: { theory: true } },
        sourceRelations: { where: { targetScholar: { status: published } }, include: { targetScholar: true } },
        targetRelations: { where: { sourceScholar: { status: published } }, include: { sourceScholar: true } },
      },
    });
    if (!scholar) return [];
    return uniqueLinks([
      ...scholar.theories.map(({ theory }) => ({ label: theory.titleEn, href: `/theories/${theory.slug}`, reason: "Theoretical contribution" })),
      ...scholar.sourceRelations.map(({ targetScholar }) => ({ label: targetScholar.name, href: `/scholars/${targetScholar.slug}`, reason: "Academic relationship" })),
      ...scholar.targetRelations.map(({ sourceScholar }) => ({ label: sourceScholar.name, href: `/scholars/${sourceScholar.slug}`, reason: "Academic relationship" })),
    ]);
  }

  if (entityType === "topic") {
    const topic = await db.topic.findFirst({
      where: { slug: entitySlug, status: published },
      include: { theories: { where: { theory: { status: published }, recommendation: { in: ["primary", "supporting"] } }, include: { theory: true } } },
    });
    if (!topic) return [];
    return uniqueLinks(topic.theories.map(({ theory, recommendation }) => ({
      label: theory.titleEn,
      href: `/theories/${theory.slug}`,
      reason: recommendation === "primary" ? "Primary recommended theory" : "Supporting recommended theory",
    })));
  }

  const work = await db.work.findFirst({
    where: { slug: entitySlug, status: published },
    include: { theories: { where: { theory: { status: published } }, include: { theory: true } } },
  });
  if (!work) return [];
  const authorNames = Array.isArray(work.authors)
    ? work.authors.flatMap((author) => typeof author === "object" && author && "name" in author && typeof author.name === "string" ? author.name.split(/\s+and\s+/i) : [])
    : [];
  const scholars = authorNames.length ? await db.scholar.findMany({ where: { status: published, name: { in: authorNames } } }) : [];
  return uniqueLinks([
    ...scholars.map((scholar) => ({ label: scholar.name, href: `/scholars/${scholar.slug}`, reason: "Work author" })),
    ...work.theories.map(({ theory }) => ({ label: theory.titleEn, href: `/theories/${theory.slug}`, reason: "Associated theory" })),
  ]);
}
