import { pathToFileURL } from "node:url";

import type { PublicationStatus, SeedCorpus } from "../data/seed-content.ts";
import { seedCorpus } from "../data/seed-content.ts";
import type { TheoryDepth, TraceableSourceKind } from "../data/templates/theory-template.ts";
import { validateSeedCorpus } from "./content-validation.ts";

type OnboardingEntityType = "discipline" | "field" | "theory" | "scholar" | "work" | "concept" | "topic";

interface OnboardingSource {
  url: string;
  type: TraceableSourceKind;
}

interface OnboardingEntity {
  entityType: OnboardingEntityType;
  slug: string;
  titleEn: string;
  status: PublicationStatus;
  depth?: TheoryDepth;
  sources: OnboardingSource[];
}

interface NewContentBatch {
  entities: OnboardingEntity[];
  genealogy: Array<{ sourceSlug: string; targetSlug: string }>;
  corpus?: SeedCorpus;
}

interface NewBatchValidationResult {
  errors: string[];
  batch: NewContentBatch;
}

function isTraceableSource(source: OnboardingSource) {
  try {
    const url = new URL(source.url);
    return (url.protocol === "https:" || url.protocol === "http:") && source.type.trim().length > 0;
  } catch {
    return false;
  }
}

export function validateNewBatch(batch: NewContentBatch): NewBatchValidationResult {
  const errors = batch.corpus ? [...validateSeedCorpus(batch.corpus).errors] : [];
  const genealogySlugs = new Set(batch.genealogy.flatMap((edge) => [edge.sourceSlug, edge.targetSlug]));
  const entities = batch.entities.map((entity) => {
    const hasRequiredIdentity = entity.slug.trim().length > 0 && entity.titleEn.trim().length > 0;
    const hasTraceableSource = entity.sources.some(isTraceableSource);
    const hasRequiredGenealogy = entity.entityType !== "theory"
      || entity.depth !== "D3"
      || genealogySlugs.has(entity.slug);

    if (!entity.slug.trim()) errors.push(`${entity.entityType}: missing slug`);
    if (!entity.titleEn.trim()) errors.push(`${entity.slug || entity.entityType}: missing titleEn`);
    if (!hasTraceableSource) {
      errors.push(`${entity.slug}: missing a traceable source URL and type${entity.status === "published" ? "; status forced to draft until verified" : ""}`);
    }
    if (!hasRequiredGenealogy) {
      errors.push(`${entity.slug}: D3 theory requires at least one genealogy relation`);
    }
    return hasRequiredIdentity && hasTraceableSource && hasRequiredGenealogy
      ? entity
      : { ...entity, status: "draft" as const };
  });

  return { errors, batch: { ...batch, entities } };
}

export function publicStaticParamSlugs(batch: NewContentBatch, entityType: OnboardingEntityType) {
  return validateNewBatch(batch).batch.entities
    .filter((entity) => entity.entityType === entityType && entity.status === "published")
    .map(({ slug }) => ({ slug }));
}

function sourceList(content: { sources?: Array<{ url: string; source_kind: TraceableSourceKind }> }) {
  return (content.sources ?? []).map((source) => ({ url: source.url, type: source.source_kind }));
}

export function onboardingBatchFromSeedCorpus(corpus: SeedCorpus): NewContentBatch {
  return {
    corpus,
    entities: [
      ...corpus.disciplines.map((entity) => ({ entityType: "discipline" as const, slug: entity.slug, titleEn: entity.titleEn, status: entity.status, sources: sourceList(entity.content.en) })),
      ...corpus.fields.map((entity) => ({ entityType: "field" as const, slug: entity.slug, titleEn: entity.titleEn, status: entity.status, sources: sourceList(entity.content.en) })),
      ...corpus.theories.map((entity) => ({ entityType: "theory" as const, slug: entity.slug, titleEn: entity.titleEn, status: entity.status, depth: entity.depth, sources: sourceList(entity.content.en) })),
      ...corpus.scholars.map((entity) => ({ entityType: "scholar" as const, slug: entity.slug, titleEn: entity.name, status: entity.status, sources: sourceList(entity.content.en) })),
      ...corpus.works.map((entity) => ({ entityType: "work" as const, slug: entity.slug, titleEn: entity.title, status: entity.status, sources: sourceList(entity.content.en) })),
      ...corpus.concepts.map((entity) => ({ entityType: "concept" as const, slug: entity.slug, titleEn: entity.termEn, status: entity.status, sources: sourceList(entity.content.en) })),
      ...corpus.topics.map((entity) => ({ entityType: "topic" as const, slug: entity.slug, titleEn: entity.questionEn, status: entity.status, sources: sourceList(entity.content.en) })),
    ],
    genealogy: corpus.genealogy.map((edge) => ({ sourceSlug: edge.sourceSlug, targetSlug: edge.targetSlug })),
  };
}

function run() {
  const result = validateNewBatch(onboardingBatchFromSeedCorpus(seedCorpus));
  if (result.errors.length > 0) {
    console.error(`Content onboarding validation failed:\n${result.errors.join("\n")}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Content onboarding validation passed for ${seedCorpus.disciplines.length} disciplines and ${seedCorpus.theories.length} theories.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) run();

export type { NewContentBatch, OnboardingEntity, OnboardingEntityType, OnboardingSource };
