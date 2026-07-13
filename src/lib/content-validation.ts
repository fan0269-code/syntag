import type { SeedCorpus } from "../data/seed-content.ts";
import { isTheoryContent } from "../data/templates/theory-template.ts";

export interface SeedCorpusValidationResult {
  errors: string[];
}

export function validateSeedCorpus(corpus: SeedCorpus): SeedCorpusValidationResult {
  const errors: string[] = [];
  const theorySlugs = new Set(corpus.theories.map((theory) => theory.slug));
  const disciplineSlugs = new Set(corpus.disciplines.map((discipline) => discipline.slug));
  const fieldSlugs = new Set(corpus.fields.map((field) => field.slug));
  const scholarSlugs = new Set(corpus.scholars.map((scholar) => scholar.slug));
  const topicSlugs = new Set(corpus.topics.map((topic) => topic.slug));
  const sourceUrls = new Set(corpus.theories.flatMap((theory) => theory.content.en.sources?.map((source) => source.url) ?? []));
  const theoryScholarKeys = new Set<string>();
  const topicTheoryKeys = new Set<string>();

  for (const theory of corpus.theories) {
    if (!isTheoryContent(theory.content.en, theory.depth)) {
      errors.push(`${theory.slug}: does not satisfy ${theory.depth} content contract`);
    }
    if (!theory.content.en.sources?.length) {
      errors.push(`${theory.slug}: missing source metadata`);
    }
    for (const item of theory.content.en.genealogy) {
      if (!theorySlugs.has(item.related_theory)) {
        errors.push(`${theory.slug}: genealogy references unknown theory ${item.related_theory}`);
      }
      if (!item.description.trim()) {
        errors.push(`${theory.slug}: genealogy description is empty`);
      }
    }
  }

  for (const field of corpus.fields) {
    if (!disciplineSlugs.has(field.disciplineSlug)) {
      errors.push(`${field.slug}: references unknown discipline ${field.disciplineSlug}`);
    }
  }
  for (const relation of corpus.disciplineTheories) {
    if (!disciplineSlugs.has(relation.disciplineSlug)) errors.push(`discipline relation: unknown discipline ${relation.disciplineSlug}`);
    if (!theorySlugs.has(relation.theorySlug)) errors.push(`discipline relation: unknown theory ${relation.theorySlug}`);
  }
  for (const relation of corpus.fieldTheories) {
    if (!fieldSlugs.has(relation.fieldSlug)) errors.push(`field relation: unknown field ${relation.fieldSlug}`);
    if (!theorySlugs.has(relation.theorySlug)) errors.push(`field relation: unknown theory ${relation.theorySlug}`);
  }
  for (const edge of corpus.genealogy) {
    if (!theorySlugs.has(edge.sourceSlug)) errors.push(`${edge.id}: unknown source theory ${edge.sourceSlug}`);
    if (!theorySlugs.has(edge.targetSlug)) errors.push(`${edge.id}: unknown target theory ${edge.targetSlug}`);
    if (!edge.descriptionEn.trim()) errors.push(`${edge.id}: genealogy description is empty`);
  }
  for (const scholar of corpus.scholars) {
    if (!scholar.slug.trim()) errors.push("scholar: slug is empty");
    if (!scholar.name.trim()) errors.push(`${scholar.slug}: scholar name is empty`);
    if (scholar.status === "published" && !scholar.publishedAt.trim()) errors.push(`${scholar.slug}: published scholar is missing publishedAt`);
    if (scholar.status === "published" && !scholar.bioEn.trim()) errors.push(`${scholar.slug}: published scholar bio is empty`);
  }
  for (const relation of corpus.theoryScholars) {
    const key = `${relation.theorySlug}:${relation.scholarSlug}`;
    if (theoryScholarKeys.has(key)) errors.push(`theory-scholar relation ${key}: duplicate relation`);
    theoryScholarKeys.add(key);
    if (!theorySlugs.has(relation.theorySlug)) errors.push(`theory-scholar relation: unknown theory ${relation.theorySlug}`);
    if (!scholarSlugs.has(relation.scholarSlug)) errors.push(`theory-scholar relation: unknown scholar ${relation.scholarSlug}`);
    if (!relation.evidenceNotesEn.trim()) errors.push(`theory-scholar relation ${key}: evidence notes are empty`);
    if (relation.sourceUrls.length === 0) errors.push(`theory-scholar relation ${key}: sourceUrls is empty`);
    if (relation.sourceUrls.some((source) => !sourceUrls.has(source))) {
      errors.push(`theory-scholar relation ${key}: source URL is not listed in theory source metadata`);
    }
  }
  for (const topic of corpus.topics) {
    if (!topic.slug.trim()) errors.push("topic: slug is empty");
    if (!topic.questionEn.trim()) errors.push(`${topic.slug}: topic question is empty`);
    if (topic.status === "published" && !topic.publishedAt.trim()) errors.push(`${topic.slug}: published topic is missing publishedAt`);
  }
  for (const relation of corpus.topicTheories) {
    const key = `${relation.topicSlug}:${relation.theorySlug}`;
    if (topicTheoryKeys.has(key)) errors.push(`topic-theory relation ${key}: duplicate relation`);
    topicTheoryKeys.add(key);
    if (!topicSlugs.has(relation.topicSlug)) errors.push(`topic-theory relation: unknown topic ${relation.topicSlug}`);
    if (!theorySlugs.has(relation.theorySlug)) errors.push(`topic-theory relation: unknown theory ${relation.theorySlug}`);
    if (!relation.suitabilityNotesEn.trim()) errors.push(`topic-theory relation ${key}: suitability notes are empty`);
    if (!relation.evidenceNotesEn.trim()) errors.push(`topic-theory relation ${key}: evidence notes are empty`);
    if (relation.sourceUrls.length === 0) errors.push(`topic-theory relation ${key}: sourceUrls is empty`);
    if (relation.sourceUrls.some((source) => !sourceUrls.has(source))) {
      errors.push(`topic-theory relation ${key}: source URL is not listed in theory source metadata`);
    }
  }
  for (const item of corpus.verifications) {
    if (!theorySlugs.has(item.entitySlug)) errors.push(`verification: unknown entity ${item.entitySlug}`);
    if (!item.fieldPath.trim()) errors.push(`verification for ${item.entitySlug}: field path is empty`);
    if (item.level === "L1_verified" && item.sources.length === 0) {
      errors.push(`verification for ${item.entitySlug}: L1 record is missing a source`);
    }
    if (item.level === "L1_verified") {
      const theory = corpus.theories.find((entry) => entry.slug === item.entitySlug);
      const sourceUrls = new Set(theory?.content.en.sources?.map((source) => source.url) ?? []);
      if (item.sources.some((source) => !sourceUrls.has(source))) {
        errors.push(`verification for ${item.entitySlug}: L1 source is not listed in page metadata`);
      }
    }
  }

  return { errors };
}
