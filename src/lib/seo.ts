import type { Metadata } from "next";

export const siteUrl = "https://syrtag.com";

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

const SEO_DESCRIPTION_MAX = 160;

/** Trims a description on a word boundary. Does not pad short copy with extra keywords. */
export function clampSeoDescription(value: string) {
  const text = cleanText(value);
  if (text.length <= SEO_DESCRIPTION_MAX) return text;

  const shortened = text.slice(0, SEO_DESCRIPTION_MAX - 1);
  const finalSpace = shortened.lastIndexOf(" ");
  const cut = finalSpace > 80 ? finalSpace : SEO_DESCRIPTION_MAX - 1;
  return `${shortened.slice(0, cut).replace(/[,:;\s]+$/, "")}…`;
}

function isProseSummary(value: string) {
  return value.length >= 40 && value.split(" ").filter(Boolean).length >= 8;
}

/**
 * Builds one description from the page name and, when present, its own summary.
 * A real summary is used as written. A missing or fragmentary summary gets a single
 * type label. Neither path appends a second keyword sentence.
 */
export function createSeoDescription(name: string, keyword: string, summary?: string | null) {
  const lead = cleanText(summary);
  const subject = cleanText(name);
  const kind = cleanText(keyword);

  if (isProseSummary(lead)) {
    const sentence = /[.!?…]$/.test(lead) ? lead : `${lead}.`;
    return clampSeoDescription(sentence);
  }

  const fragment = lead ? ` ${lead}.` : "";
  return clampSeoDescription(`${subject} is a ${kind} on Syrtag.${fragment}`);
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
      images: [{ url: image, width: 1200, height: 630, alt: `Syrtag: ${title}` }],
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
  const title = `${theory.titleEn} — Theoretical Framework Guide | Syrtag`;
  return metadataFor({ title, description: createSeoDescription(theory.titleEn, "theoretical framework guide", theory.summaryEn), path: `/theories/${theory.slug}` });
}

export function generateScholarMeta(scholar: Pick<ScholarSeoEntity, "name" | "bioEn" | "slug">): Metadata {
  const title = `${scholar.name} — Scholar Profile & Theoretical Contributions | Syrtag`;
  return metadataFor({ title, description: createSeoDescription(scholar.name, "scholar profile", scholar.bioEn), path: `/scholars/${scholar.slug}` });
}

export function generateWorkMeta(work: Pick<WorkSeoEntity, "title" | "publisher" | "slug">): Metadata {
  const title = `${work.title} — Research Work Guide | Syrtag`;
  return metadataFor({ title, description: createSeoDescription(work.title, "research work guide", work.publisher), path: `/works/${work.slug}` });
}

export function generateTopicMeta(topic: Pick<TopicSeoEntity, "questionEn" | "slug">): Metadata {
  const title = `${topic.questionEn} — Research Theory Selection Guide | Syrtag`;
  return metadataFor({ title, description: createSeoDescription(topic.questionEn, "research theory selection guide"), path: `/topics/${topic.slug}` });
}

export function generateDisciplineMeta(discipline: Pick<DisciplineSeoEntity, "titleEn" | "descriptionEn" | "slug">): Metadata {
  const title = `${discipline.titleEn} Research Theories & Frameworks | Syrtag`;
  return metadataFor({ title, description: createSeoDescription(discipline.titleEn, "discipline research theory guide", discipline.descriptionEn), path: `/disciplines/${discipline.slug}`, type: "website" });
}

export function generateFieldMeta(field: Pick<FieldSeoEntity, "titleEn" | "descriptionEn" | "slug">): Metadata {
  const title = `${field.titleEn} Research Theories & Frameworks | Syrtag`;
  return metadataFor({ title, description: createSeoDescription(field.titleEn, "research field theory guide", field.descriptionEn), path: `/fields/${field.slug}`, type: "website" });
}

export function generateHomeMeta(): Metadata {
  return metadataFor({
    title: "Syrtag — Doctoral theory navigation (education & sociology)",
    description: "Syrtag maps doctoral theories in education and sociology. Public pages appear only when published, so the catalog may be empty.",
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
  const resolvedTitle = title.includes("| Syrtag") ? title : `${title} | Syrtag`;
  const supplied = cleanText(description);
  return metadataFor({
    title: resolvedTitle,
    description: supplied
      ? clampSeoDescription(supplied)
      : createSeoDescription(title.replace(/ \| Syrtag$/, ""), type === "article" ? "research guide" : "Syrtag page"),
    path,
    type,
    noindex,
  });
}
