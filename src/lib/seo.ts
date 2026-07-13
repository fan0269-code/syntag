import type { Metadata } from "next";

export const siteUrl = "https://syntag.app";

type EntityMetaInput = {
  name: string;
  summary?: string | null;
  slug: string;
};

export type TheorySeoEntity = EntityMetaInput & { titleEn: string; summaryEn?: string | null };
export type ScholarSeoEntity = EntityMetaInput & { name: string; bioEn?: string | null };
export type WorkSeoEntity = EntityMetaInput & { title: string; publisher?: string | null };
export type TopicSeoEntity = EntityMetaInput & { questionEn: string };
export type DisciplineSeoEntity = EntityMetaInput & { titleEn: string; descriptionEn?: string | null };
export type FieldSeoEntity = EntityMetaInput & { titleEn: string; descriptionEn?: string | null };

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

/** Creates a human-readable description in the 150–160 character range. */
export function createSeoDescription(name: string, keyword: string, summary?: string | null) {
  const lead = cleanText(summary) || `${name} is a research resource for doctoral study.`;
  let description = `${lead} Explore this ${keyword} through key ideas, research fit, related scholars, and source-aware reading pathways for doctoral work.`;

  if (description.length < 150) {
    description += " Designed for rigorous research planning.";
  }

  if (description.length <= 160) return description;

  const shortened = description.slice(0, 157);
  const finalSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, finalSpace > 130 ? finalSpace : 157).replace(/[,:;\s]+$/, "")}…`;
}

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function ogImageUrl(title: string, kind: string) {
  const query = new URLSearchParams({ title, kind });
  return absoluteUrl(`/api/og?${query.toString()}`);
}

function metadataFor({
  title,
  description,
  path,
  type = "article",
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  type?: "article" | "website";
  noindex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);
  const image = ogImageUrl(title, type === "article" ? "Research guide" : "Knowledge graph");

  return {
    title,
    description,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      images: [{ url: image, width: 1200, height: 630, alt: `Syntag: ${title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function generateTheoryMeta(theory: Pick<TheorySeoEntity, "titleEn" | "summaryEn" | "slug">): Metadata {
  const title = `${theory.titleEn} — Theoretical Framework Guide | Syntag`;
  return metadataFor({ title, description: createSeoDescription(theory.titleEn, "theoretical framework guide", theory.summaryEn), path: `/theories/${theory.slug}` });
}

export function generateScholarMeta(scholar: Pick<ScholarSeoEntity, "name" | "bioEn" | "slug">): Metadata {
  const title = `${scholar.name} — Scholar Profile & Theoretical Contributions | Syntag`;
  return metadataFor({ title, description: createSeoDescription(scholar.name, "scholar profile", scholar.bioEn), path: `/scholars/${scholar.slug}` });
}

export function generateWorkMeta(work: Pick<WorkSeoEntity, "title" | "publisher" | "slug">): Metadata {
  const title = `${work.title} — Foundational Research Work Guide | Syntag`;
  return metadataFor({ title, description: createSeoDescription(work.title, "foundational research work guide", work.publisher), path: `/works/${work.slug}` });
}

export function generateTopicMeta(topic: Pick<TopicSeoEntity, "questionEn" | "slug">): Metadata {
  const title = `${topic.questionEn} — Research Theory Selection Guide | Syntag`;
  return metadataFor({ title, description: createSeoDescription(topic.questionEn, "research theory selection guide"), path: `/topics/${topic.slug}` });
}

export function generateDisciplineMeta(discipline: Pick<DisciplineSeoEntity, "titleEn" | "descriptionEn" | "slug">): Metadata {
  const title = `${discipline.titleEn} Research Theories & Frameworks | Syntag`;
  return metadataFor({ title, description: createSeoDescription(discipline.titleEn, "discipline research theory guide", discipline.descriptionEn), path: `/disciplines/${discipline.slug}`, type: "website" });
}

export function generateFieldMeta(field: Pick<FieldSeoEntity, "titleEn" | "descriptionEn" | "slug">): Metadata {
  const title = `${field.titleEn} Research Theories & Frameworks | Syntag`;
  return metadataFor({ title, description: createSeoDescription(field.titleEn, "research field theory guide", field.descriptionEn), path: `/fields/${field.slug}`, type: "website" });
}

export function generateHomeMeta(): Metadata {
  return metadataFor({
    title: "Syntag — Research Theory Knowledge Graph",
    description: "Explore research theories, scholars, foundational works, and dissertation-ready framework pathways in Syntag's source-aware knowledge graph.",
    path: "/",
    type: "website",
  });
}

/** Backwards-compatible helper for static pages and entities without a dedicated SEO profile. */
export function entityMetadata({
  title,
  description,
  path,
  type = "article",
  noindex = false,
}: {
  title: string;
  description?: string | null;
  path: string;
  type?: "article" | "website";
  noindex?: boolean;
}): Metadata {
  const resolvedTitle = title.includes("| Syntag") ? title : `${title} | Syntag`;
  return metadataFor({
    title: resolvedTitle,
    description: createSeoDescription(title, type === "article" ? "research guide" : "research knowledge resource", description),
    path,
    type,
    noindex,
  });
}
