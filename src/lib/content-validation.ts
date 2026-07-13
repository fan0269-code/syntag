import type { SeedCorpus } from "../data/seed-content.ts";
import { isConceptContent, isWorkContent } from "../data/templates/knowledge-entity-template.ts";
import { isScholarContent } from "../data/templates/scholar-template.ts";
import { isTheoryContent } from "../data/templates/theory-template.ts";
import { isPathwayContent } from "../data/templates/pathway-template.ts";

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
  const workSlugs = new Set(corpus.works.map((work) => work.slug));
  const conceptSlugs = new Set(corpus.concepts.map((concept) => concept.slug));
  const sourceUrls = new Set(corpus.theories.flatMap((theory) => theory.content.en.sources?.map((source) => source.url) ?? []));
  const theoryScholarKeys = new Set<string>();
  const topicTheoryKeys = new Set<string>();
  const theoryWorkKeys = new Set<string>();
  const theoryConceptKeys = new Set<string>();

  function validatePathway(slug: string, content: unknown) {
    if (!isPathwayContent(content)) {
      errors.push(`${slug}: does not satisfy the pathway content contract`);
      return;
    }
    const roles = new Set(content.theory_pathways.map((entry) => entry.role));
    if (!["primary", "supporting", "not_recommended"].every((role) => roles.has(role as never))) {
      errors.push(`${slug}: pathway does not distinguish primary, supporting, and not_recommended theories`);
    }
    for (const category of content.question_categories) {
      for (const theorySlug of category.theory_slugs) {
        if (!theorySlugs.has(theorySlug)) errors.push(`${slug}: unknown category theory ${theorySlug}`);
      }
    }
    for (const pathway of content.theory_pathways) {
      if (!theorySlugs.has(pathway.theory_slug)) errors.push(`${slug}: unknown pathway theory ${pathway.theory_slug}`);
    }
    for (const entry of content.entry_points) {
      const known = entry.entity_type === "topic" ? topicSlugs
        : entry.entity_type === "field" ? fieldSlugs
          : entry.entity_type === "theory" ? theorySlugs
            : entry.entity_type === "scholar" ? scholarSlugs
              : entry.entity_type === "work" ? workSlugs
                : conceptSlugs;
      if (!known.has(entry.slug)) errors.push(`${slug}: unknown ${entry.entity_type} entry point ${entry.slug}`);
    }
  }

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

  for (const work of corpus.works) {
    if (!work.slug.trim() || !work.title.trim() || work.authors.length === 0 || work.year < 1) errors.push(`${work.slug}: incomplete bibliographic record`);
    if (!isWorkContent(work.content.en)) errors.push(`${work.slug}: does not satisfy the work content contract`);
  }
  for (const concept of corpus.concepts) {
    if (!concept.slug.trim() || !concept.termEn.trim() || !concept.definitionEn.trim()) errors.push(`${concept.slug}: incomplete concept record`);
    if (!isConceptContent(concept.content.en)) {
      errors.push(`${concept.slug}: does not satisfy the concept content contract`);
      continue;
    }
    for (const variation of concept.content.en.theory_variations) {
      if (!theorySlugs.has(variation.theory_slug)) errors.push(`${concept.slug}: unknown theory variation ${variation.theory_slug}`);
    }
    for (const relatedWork of concept.content.en.related_works) {
      if (!workSlugs.has(relatedWork.work_slug)) errors.push(`${concept.slug}: unknown related work ${relatedWork.work_slug}`);
    }
    for (const scholar of concept.content.en.related_scholars) {
      if (scholar.scholar_slug && !scholarSlugs.has(scholar.scholar_slug)) errors.push(`${concept.slug}: unknown related scholar ${scholar.scholar_slug}`);
    }
  }
  const conceptWorkSlugs = new Set(corpus.concepts.flatMap((concept) => isConceptContent(concept.content.en) ? concept.content.en.related_works.map((work) => work.work_slug) : []));
  for (const workSlug of workSlugs) {
    if (!conceptWorkSlugs.has(workSlug)) errors.push(`${workSlug}: is not related to a published concept`);
  }

  for (const field of corpus.fields) {
    if (!disciplineSlugs.has(field.disciplineSlug)) {
      errors.push(`${field.slug}: references unknown discipline ${field.disciplineSlug}`);
    }
    if (!field.descriptionEn.trim()) errors.push(`${field.slug}: field description is empty`);
    validatePathway(field.slug, field.content.en);
    if (!["topic", "theory", "scholar", "work", "concept"].every((type) => field.content.en.entry_points.some((entry) => entry.entity_type === type))) {
      errors.push(`${field.slug}: field pathway is missing one or more required topic/theory/scholar/work/concept entry points`);
    }
  }
  for (const discipline of corpus.disciplines) {
    if (!discipline.descriptionEn.trim() || !discipline.overviewEn.trim()) errors.push(`${discipline.slug}: discipline description or overview is empty`);
    validatePathway(discipline.slug, discipline.content.en);
    if (!["topic", "theory", "scholar", "work", "concept"].every((type) => discipline.content.en.entry_points.some((entry) => entry.entity_type === type))) {
      errors.push(`${discipline.slug}: discipline pathway is missing one or more required topic/theory/scholar/work/concept entry points`);
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
  for (const relation of corpus.theoryWorks) {
    const key = `${relation.theorySlug}:${relation.workSlug}`;
    if (theoryWorkKeys.has(key)) errors.push(`theory-work relation ${key}: duplicate relation`);
    theoryWorkKeys.add(key);
    if (!theorySlugs.has(relation.theorySlug)) errors.push(`theory-work relation: unknown theory ${relation.theorySlug}`);
    if (!workSlugs.has(relation.workSlug)) errors.push(`theory-work relation: unknown work ${relation.workSlug}`);
    if (!relation.evidenceNotesEn.trim() || relation.sourceUrls.length === 0) errors.push(`theory-work relation ${key}: missing evidence`);
    const workSources = new Set(corpus.works.find((work) => work.slug === relation.workSlug)?.content.en.sources.map((source) => source.url) ?? []);
    if (relation.sourceUrls.some((source) => !workSources.has(source))) errors.push(`theory-work relation ${key}: source URL is not listed in work metadata`);
  }
  const theoryWorkSlugs = new Set(corpus.theoryWorks.map((relation) => relation.workSlug));
  for (const workSlug of workSlugs) {
    if (!theoryWorkSlugs.has(workSlug)) errors.push(`${workSlug}: is not related to a published theory`);
  }
  for (const relation of corpus.theoryConcepts) {
    const key = `${relation.theorySlug}:${relation.conceptSlug}`;
    if (theoryConceptKeys.has(key)) errors.push(`theory-concept relation ${key}: duplicate relation`);
    theoryConceptKeys.add(key);
    if (!theorySlugs.has(relation.theorySlug)) errors.push(`theory-concept relation: unknown theory ${relation.theorySlug}`);
    if (!conceptSlugs.has(relation.conceptSlug)) errors.push(`theory-concept relation: unknown concept ${relation.conceptSlug}`);
  }
  const theoryConceptSlugs = new Set(corpus.theoryConcepts.map((relation) => relation.conceptSlug));
  for (const conceptSlug of conceptSlugs) {
    if (!theoryConceptSlugs.has(conceptSlug)) errors.push(`${conceptSlug}: is not related to a published theory`);
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
    if (!isScholarContent(scholar.content.en)) {
      errors.push(`${scholar.slug}: does not satisfy the scholar content contract`);
      continue;
    }
    for (const relation of scholar.content.en.theory_relationships) {
      if (!theorySlugs.has(relation.theory_slug)) errors.push(`${scholar.slug}: unknown theory relationship ${relation.theory_slug}`);
    }
    for (const work of scholar.content.en.representative_works) {
      if (work.work_slug && !workSlugs.has(work.work_slug)) errors.push(`${scholar.slug}: unknown representative work ${work.work_slug}`);
    }
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
    validatePathway(topic.slug, topic.content.en);
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
