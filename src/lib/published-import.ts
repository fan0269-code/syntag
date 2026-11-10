import type {
  PublicationStatus,
  SeedConcept,
  SeedCorpus,
  SeedDiscipline,
  SeedField,
  SeedGenealogy,
  SeedScholar,
  SeedTheory,
  SeedTheoryConcept,
  SeedTheoryDiscipline,
  SeedTheoryField,
  SeedTheoryScholar,
  SeedTheoryWork,
  SeedTopic,
  SeedTopicTheory,
  SeedVerification,
  SeedWork,
} from "../data/seed-content.ts";
import { isFAN247Archived, type FAN247VisibilityEntityType } from "./fan247-visibility.ts";

export const publishedImportCountKeys = [
  "disciplines",
  "fields",
  "theories",
  "works",
  "concepts",
  "scholars",
  "topics",
  "disciplineTheories",
  "fieldTheories",
  "theoryWorks",
  "theoryConcepts",
  "theoryScholars",
  "topicTheories",
  "genealogy",
  "verifications",
] as const;

export type PublishedImportCountKey = (typeof publishedImportCountKeys)[number];
export type PublishedImportCounts = Record<PublishedImportCountKey, number>;

export interface PublishedImportPlan {
  disciplines: SeedDiscipline[];
  fields: SeedField[];
  theories: SeedTheory[];
  works: SeedWork[];
  concepts: SeedConcept[];
  scholars: SeedScholar[];
  topics: SeedTopic[];
  disciplineTheories: SeedTheoryDiscipline[];
  fieldTheories: SeedTheoryField[];
  theoryWorks: SeedTheoryWork[];
  theoryConcepts: SeedTheoryConcept[];
  theoryScholars: SeedTheoryScholar[];
  topicTheories: SeedTopicTheory[];
  genealogy: SeedGenealogy[];
  verifications: SeedVerification[];
  counts: PublishedImportCounts;
}

type PublishedRecord = {
  slug: string;
  status: PublicationStatus;
  publishedAt?: string;
};

const databaseUrlPattern = /\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s'"`)]+/gi;
const databaseHostPattern = /\b(?:[\w-]+\.)+(?:neon\.tech|supabase\.co|pooler\.supabase\.com)(?::\d+)?/gi;
const databaseAssignmentPattern = /\b(?:DATABASE_URL|DIRECT_URL)\s*=\s*\S+/gi;

export function redactConnectionSecrets(value: string): string {
  return value
    .replace(databaseUrlPattern, "[redacted-database-url]")
    .replace(databaseHostPattern, "[redacted-database-host]")
    .replace(databaseAssignmentPattern, (match) => (
      match.trimStart().toLowerCase().startsWith("direct_url")
        ? "DIRECT_URL=[redacted]"
        : "DATABASE_URL=[redacted]"
    ));
}

function publishedRecords<T extends PublishedRecord>(
  type: FAN247VisibilityEntityType,
  records: T[],
): T[] {
  const selected: T[] = [];
  const seen = new Set<string>();
  for (const record of records) {
    if (isFAN247Archived(type, record.slug)) continue;
    if (record.status !== "published") continue;
    if (seen.has(record.slug)) {
      throw new Error(`Duplicate published ${type} slug: ${record.slug}`);
    }
    if (!record.publishedAt || Number.isNaN(Date.parse(record.publishedAt))) {
      throw new Error(`Published ${type} ${record.slug} requires publishedAt`);
    }
    seen.add(record.slug);
    selected.push(record);
  }
  return selected;
}

function countsFor(plan: Omit<PublishedImportPlan, "counts">): PublishedImportCounts {
  return {
    disciplines: plan.disciplines.length,
    fields: plan.fields.length,
    theories: plan.theories.length,
    works: plan.works.length,
    concepts: plan.concepts.length,
    scholars: plan.scholars.length,
    topics: plan.topics.length,
    disciplineTheories: plan.disciplineTheories.length,
    fieldTheories: plan.fieldTheories.length,
    theoryWorks: plan.theoryWorks.length,
    theoryConcepts: plan.theoryConcepts.length,
    theoryScholars: plan.theoryScholars.length,
    topicTheories: plan.topicTheories.length,
    genealogy: plan.genealogy.length,
    verifications: plan.verifications.length,
  };
}

export function assertPublishedImportPlanAllowed(plan: PublishedImportPlan): void {
  const groups = [
    ["discipline", plan.disciplines],
    ["field", plan.fields],
    ["theory", plan.theories],
    ["work", plan.works],
    ["concept", plan.concepts],
    ["scholar", plan.scholars],
    ["topic", plan.topics],
  ] as const;
  for (const [type, records] of groups) {
    for (const record of records) {
      if (record.status !== "published") {
        throw new Error(`Refusing to write non-published ${type} ${record.slug}`);
      }
      if (isFAN247Archived(type, record.slug)) {
        throw new Error(`Refusing to write archived ${type} ${record.slug}`);
      }
    }
  }

  const disciplineSlugs = new Set(plan.disciplines.map((record) => record.slug));
  const fieldSlugs = new Set(plan.fields.map((record) => record.slug));
  const theorySlugs = new Set(plan.theories.map((record) => record.slug));
  const workSlugs = new Set(plan.works.map((record) => record.slug));
  const conceptSlugs = new Set(plan.concepts.map((record) => record.slug));
  const scholarSlugs = new Set(plan.scholars.map((record) => record.slug));
  const topicSlugs = new Set(plan.topics.map((record) => record.slug));

  for (const field of plan.fields) {
    if (!disciplineSlugs.has(field.disciplineSlug)) {
      throw new Error(`Published field ${field.slug} requires a published discipline (${field.disciplineSlug}).`);
    }
  }
  for (const relation of plan.disciplineTheories) {
    if (!disciplineSlugs.has(relation.disciplineSlug) || !theorySlugs.has(relation.theorySlug)) {
      throw new Error(`Refusing to write discipline relation ${relation.disciplineSlug} -> ${relation.theorySlug}`);
    }
  }
  for (const relation of plan.fieldTheories) {
    if (!fieldSlugs.has(relation.fieldSlug) || !theorySlugs.has(relation.theorySlug)) {
      throw new Error(`Refusing to write field relation ${relation.fieldSlug} -> ${relation.theorySlug}`);
    }
  }
  for (const relation of plan.theoryWorks) {
    if (!theorySlugs.has(relation.theorySlug) || !workSlugs.has(relation.workSlug)) {
      throw new Error(`Refusing to write theory-work relation ${relation.theorySlug} -> ${relation.workSlug}`);
    }
  }
  for (const relation of plan.theoryConcepts) {
    if (!theorySlugs.has(relation.theorySlug) || !conceptSlugs.has(relation.conceptSlug)) {
      throw new Error(`Refusing to write theory-concept relation ${relation.theorySlug} -> ${relation.conceptSlug}`);
    }
  }
  for (const relation of plan.theoryScholars) {
    if (!theorySlugs.has(relation.theorySlug) || !scholarSlugs.has(relation.scholarSlug)) {
      throw new Error(`Refusing to write theory-scholar relation ${relation.theorySlug} -> ${relation.scholarSlug}`);
    }
  }
  for (const relation of plan.topicTheories) {
    if (!topicSlugs.has(relation.topicSlug) || !theorySlugs.has(relation.theorySlug)) {
      throw new Error(`Refusing to write topic-theory relation ${relation.topicSlug} -> ${relation.theorySlug}`);
    }
  }
  for (const edge of plan.genealogy) {
    if (!theorySlugs.has(edge.sourceSlug) || !theorySlugs.has(edge.targetSlug)) {
      throw new Error(`Refusing to write genealogy ${edge.sourceSlug} -> ${edge.targetSlug}`);
    }
  }
  for (const record of plan.verifications) {
    if (!theorySlugs.has(record.entitySlug)) {
      throw new Error(`Refusing to write verification for ${record.entitySlug}`);
    }
  }
}

/**
 * Select authored rows that may be upserted.
 * A row is eligible only when its corpus status is published and its slug is
 * outside the FAN-247 archive. Relations are eligible only when every
 * endpoint is itself eligible. Drafts and archived rows are left unread by
 * the writer.
 */
export function planPublishedImport(corpus: SeedCorpus): PublishedImportPlan {
  const disciplines = publishedRecords("discipline", corpus.disciplines);
  const fields = publishedRecords("field", corpus.fields);
  const theories = publishedRecords("theory", corpus.theories);
  const works = publishedRecords("work", corpus.works);
  const concepts = publishedRecords("concept", corpus.concepts);
  const scholars = publishedRecords("scholar", corpus.scholars);
  const topics = publishedRecords("topic", corpus.topics);

  const disciplineSlugs = new Set(disciplines.map((record) => record.slug));
  const fieldSlugs = new Set(fields.map((record) => record.slug));
  const theorySlugs = new Set(theories.map((record) => record.slug));
  const workSlugs = new Set(works.map((record) => record.slug));
  const conceptSlugs = new Set(concepts.map((record) => record.slug));
  const scholarSlugs = new Set(scholars.map((record) => record.slug));
  const topicSlugs = new Set(topics.map((record) => record.slug));

  for (const field of fields) {
    if (!disciplineSlugs.has(field.disciplineSlug)) {
      throw new Error(`Published field ${field.slug} requires a published discipline (${field.disciplineSlug}).`);
    }
  }

  const plan: PublishedImportPlan = {
    disciplines,
    fields,
    theories,
    works,
    concepts,
    scholars,
    topics,
    disciplineTheories: corpus.disciplineTheories.filter((relation) => (
      disciplineSlugs.has(relation.disciplineSlug) && theorySlugs.has(relation.theorySlug)
    )),
    fieldTheories: corpus.fieldTheories.filter((relation) => (
      fieldSlugs.has(relation.fieldSlug) && theorySlugs.has(relation.theorySlug)
    )),
    theoryWorks: corpus.theoryWorks.filter((relation) => (
      theorySlugs.has(relation.theorySlug) && workSlugs.has(relation.workSlug)
    )),
    theoryConcepts: corpus.theoryConcepts.filter((relation) => (
      theorySlugs.has(relation.theorySlug) && conceptSlugs.has(relation.conceptSlug)
    )),
    theoryScholars: corpus.theoryScholars.filter((relation) => (
      theorySlugs.has(relation.theorySlug) && scholarSlugs.has(relation.scholarSlug)
    )),
    topicTheories: corpus.topicTheories.filter((relation) => (
      topicSlugs.has(relation.topicSlug) && theorySlugs.has(relation.theorySlug)
    )),
    genealogy: corpus.genealogy.filter((edge) => (
      theorySlugs.has(edge.sourceSlug) && theorySlugs.has(edge.targetSlug)
    )),
    verifications: corpus.verifications.filter((record) => theorySlugs.has(record.entitySlug)),
    counts: {
      disciplines: 0,
      fields: 0,
      theories: 0,
      works: 0,
      concepts: 0,
      scholars: 0,
      topics: 0,
      disciplineTheories: 0,
      fieldTheories: 0,
      theoryWorks: 0,
      theoryConcepts: 0,
      theoryScholars: 0,
      topicTheories: 0,
      genealogy: 0,
      verifications: 0,
    },
  };
  plan.counts = countsFor(plan);
  assertPublishedImportPlanAllowed(plan);
  return plan;
}

export function formatPublishedImportCounts(plan: PublishedImportPlan, mode: "dry-run" | "applied"): string {
  const lines = [`published-import ${mode}`];
  for (const key of publishedImportCountKeys) {
    lines.push(`${key}: ${plan.counts[key]}`);
  }
  return lines.join("\n");
}
