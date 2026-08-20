import type { SeedCorpus, SeedTopicTheory } from "../data/seed-content.ts";
import { isFAN133U3Archived } from "./u3-visibility.ts";
import { isConceptContent, isWorkContent } from "../data/templates/knowledge-entity-template.ts";
import { isScholarContent } from "../data/templates/scholar-template.ts";
import { isTheoryContent } from "../data/templates/theory-template.ts";
import { isPathwayContent } from "../data/templates/pathway-template.ts";

export interface SeedCorpusValidationResult {
  errors: string[];
}

type TopicTheoryPersistenceData = {
  suitability: SeedTopicTheory["suitability"];
  suitabilityNotesEn: string;
  suitabilityNotesZh?: string | null;
  riskNotesEn: string | null;
  riskNotesZh: string | null;
  recommendation: SeedTopicTheory["recommendation"];
};

type TopicTheorySource = {
  id: string;
  url: string;
};

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function allowsArchivedReference(type: string, slug: string, status: string | undefined) {
  return status === "published" || (
    status === "archived" &&
    (type === "work" || type === "concept") &&
    isFAN133U3Archived(type, slug)
  );
}

function acceptedTopicTheoryRiskWording(
  relation: SeedTopicTheory,
  theorySources: readonly TopicTheorySource[],
): string | null {
  const review = relation.riskReview;
  if (
    !review
    || (review.reviewDecision !== "accept_as_worded" && review.reviewDecision !== "accept_with_revision")
    || (review.evidenceStatus !== "verified" && review.evidenceStatus !== "partially_supported")
    || review.reviewReadiness !== "ready_for_human_review"
    || !nonEmpty(review.sourceId)
    || !nonEmpty(review.locator)
    || !nonEmpty(review.verifiedAt)
    || Number.isNaN(Date.parse(review.verifiedAt))
    || !nonEmpty(review.reviewerIdentity)
    || review.reviewerRole !== "methods"
    || !nonEmpty(review.reviewedAt)
    || Number.isNaN(Date.parse(review.reviewedAt))
    || !nonEmpty(review.rationale)
    || !nonEmpty(review.approvedWordingEn)
    || !nonEmpty(relation.riskNotesEn)
    || review.approvedWordingEn !== relation.riskNotesEn
    || "blocker" in review
  ) {
    return null;
  }
  if (review.reviewDecision === "accept_as_worded" && "revisionInstruction" in review) return null;
  if (review.reviewDecision === "accept_with_revision" && !nonEmpty(review.revisionInstruction)) return null;

  const source = theorySources.find((candidate) => candidate.id === review.sourceId);
  if (!source || !relation.sourceUrls.includes(source.url)) return null;

  return review.approvedWordingEn;
}

export function hasAcceptedTopicTheoryRiskReview(
  relation: SeedTopicTheory,
  theorySources: readonly TopicTheorySource[],
): boolean {
  return acceptedTopicTheoryRiskWording(relation, theorySources) !== null;
}

export function buildTopicTheoryUpdateData(
  relation: SeedTopicTheory,
  theorySources: readonly TopicTheorySource[],
): TopicTheoryPersistenceData {
  const approvedRiskWording = acceptedTopicTheoryRiskWording(relation, theorySources);
  return {
    suitability: relation.suitability,
    suitabilityNotesEn: relation.suitabilityNotesEn,
    ...(relation.suitabilityNotesZh !== undefined
      ? { suitabilityNotesZh: relation.suitabilityNotesZh }
      : {}),
    riskNotesEn: approvedRiskWording,
    riskNotesZh: null,
    recommendation: relation.recommendation,
  };
}

export function buildTopicTheoryCreateData(
  relation: SeedTopicTheory,
  theorySources: readonly TopicTheorySource[],
): TopicTheoryPersistenceData & { suitabilityNotesZh: string | null } {
  return {
    ...buildTopicTheoryUpdateData(relation, theorySources),
    suitabilityNotesZh: relation.suitabilityNotesZh ?? null,
  };
}

export function validateSeedCorpus(corpus: SeedCorpus): SeedCorpusValidationResult {
  const errors: string[] = [];
  const publicDisciplineSlugs = new Set(["education", "sociology"]);
  const theorySlugs = new Set(corpus.theories.map((theory) => theory.slug));
  const disciplineSlugs = new Set(corpus.disciplines.map((discipline) => discipline.slug));
  const fieldSlugs = new Set(corpus.fields.map((field) => field.slug));
  const scholarSlugs = new Set(corpus.scholars.map((scholar) => scholar.slug));
  const topicSlugs = new Set(corpus.topics.map((topic) => topic.slug));
  const workSlugs = new Set(corpus.works.map((work) => work.slug));
  const conceptSlugs = new Set(corpus.concepts.map((concept) => concept.slug));
  const theoryStatuses = new Map(corpus.theories.map((theory) => [theory.slug, theory.status]));
  const topicStatuses = new Map(corpus.topics.map((topic) => [topic.slug, topic.status]));
  const fieldStatuses = new Map(corpus.fields.map((field) => [field.slug, field.status]));
  const scholarStatuses = new Map(corpus.scholars.map((scholar) => [scholar.slug, scholar.status]));
  const workStatuses = new Map(corpus.works.map((work) => [work.slug, work.status]));
  const conceptStatuses = new Map(corpus.concepts.map((concept) => [concept.slug, concept.status]));
  const disciplineStatuses = new Map(corpus.disciplines.map((discipline) => [discipline.slug, discipline.status]));
  const sourceUrls = new Set(corpus.theories.flatMap((theory) => theory.content.en.sources?.map((source) => source.url) ?? []));
  const theoryScholarKeys = new Set<string>();
  const topicTheoryKeys = new Set<string>();
  const theoryWorkKeys = new Set<string>();
  const theoryConceptKeys = new Set<string>();

  function validatePublication(record: { status: "draft" | "published" | "archived"; publishedAt?: string }, label: string) {
    if (record.status === "published" && (!record.publishedAt || Number.isNaN(Date.parse(record.publishedAt)))) {
      errors.push(`${label}: published entity requires a valid ISO publishedAt`);
    }
    if (record.status !== "published" && record.publishedAt !== undefined) {
      errors.push(`${label}: draft or archived entity must not author publishedAt`);
    }
  }

  function validatePathway(slug: string, ownerStatus: "draft" | "published" | "archived", content: unknown) {
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
        if (!theorySlugs.has(theorySlug)) {
          errors.push(`${slug}: unknown category theory ${theorySlug}`);
        } else if (ownerStatus === "published" && theoryStatuses.get(theorySlug) !== "published") {
          errors.push(`${slug}: published pathway category theory ${theorySlug} is not published`);
        }
      }
    }
    for (const pathway of content.theory_pathways) {
      if (!theorySlugs.has(pathway.theory_slug)) {
        errors.push(`${slug}: unknown pathway theory ${pathway.theory_slug}`);
      } else if (ownerStatus === "published" && theoryStatuses.get(pathway.theory_slug) !== "published") {
        errors.push(`${slug}: published pathway theory ${pathway.theory_slug} is not published`);
      }
    }
    for (const entry of content.entry_points) {
      const targetStatus = entry.entity_type === "topic" ? topicStatuses.get(entry.slug)
        : entry.entity_type === "field" ? fieldStatuses.get(entry.slug)
          : entry.entity_type === "theory" ? theoryStatuses.get(entry.slug)
            : entry.entity_type === "scholar" ? scholarStatuses.get(entry.slug)
              : entry.entity_type === "work" ? workStatuses.get(entry.slug)
                : conceptStatuses.get(entry.slug);
      if (targetStatus === undefined) {
        errors.push(`${slug}: unknown ${entry.entity_type} entry point ${entry.slug}`);
      } else if (ownerStatus === "published" && !allowsArchivedReference(entry.entity_type, entry.slug, targetStatus)) {
        errors.push(`${slug}: published pathway entry point ${entry.entity_type}:${entry.slug} is not published`);
      }
    }
  }

  for (const theory of corpus.theories) {
    validatePublication(theory, theory.slug);
    if (!isTheoryContent(theory.content.en, theory.depth)) {
      errors.push(`${theory.slug}: does not satisfy ${theory.depth} content contract`);
    }
    if (!theory.content.en.sources?.length) {
      errors.push(`${theory.slug}: missing source metadata`);
    }
    for (const item of theory.content.en.genealogy) {
      if (!theorySlugs.has(item.related_theory)) {
        errors.push(`${theory.slug}: genealogy references unknown theory ${item.related_theory}`);
      } else if (theory.status === "published" && theoryStatuses.get(item.related_theory) !== "published") {
        errors.push(`${theory.slug}: published theory content genealogy target ${item.related_theory} is not published`);
      }
      if (!item.description.trim()) {
        errors.push(`${theory.slug}: genealogy description is empty`);
      }
    }
  }

  for (const work of corpus.works) {
    validatePublication(work, work.slug);
    if (!work.slug.trim() || !work.title.trim() || work.authors.length === 0 || work.year < 1) errors.push(`${work.slug}: incomplete bibliographic record`);
    if (!isWorkContent(work.content.en)) errors.push(`${work.slug}: does not satisfy the work content contract`);
  }
  for (const concept of corpus.concepts) {
    validatePublication(concept, concept.slug);
    if (!concept.slug.trim() || !concept.termEn.trim() || !concept.definitionEn.trim()) errors.push(`${concept.slug}: incomplete concept record`);
    if (!isConceptContent(concept.content.en)) {
      errors.push(`${concept.slug}: does not satisfy the concept content contract`);
      continue;
    }
    for (const variation of concept.content.en.theory_variations) {
      if (!theorySlugs.has(variation.theory_slug)) {
        errors.push(`${concept.slug}: unknown theory variation ${variation.theory_slug}`);
      } else if (concept.status === "published" && theoryStatuses.get(variation.theory_slug) !== "published") {
        errors.push(`${concept.slug}: published concept theory variation ${variation.theory_slug} is not published`);
      }
    }
    for (const relatedWork of concept.content.en.related_works) {
      if (!workSlugs.has(relatedWork.work_slug)) {
        errors.push(`${concept.slug}: unknown related work ${relatedWork.work_slug}`);
      } else if (concept.status === "published" && !allowsArchivedReference("work", relatedWork.work_slug, workStatuses.get(relatedWork.work_slug))) {
        errors.push(`${concept.slug}: published concept related work ${relatedWork.work_slug} is not published`);
      }
    }
    for (const scholar of concept.content.en.related_scholars) {
      if (scholar.scholar_slug && !scholarSlugs.has(scholar.scholar_slug)) {
        errors.push(`${concept.slug}: unknown related scholar ${scholar.scholar_slug}`);
      } else if (scholar.scholar_slug && concept.status === "published" && scholarStatuses.get(scholar.scholar_slug) !== "published") {
        errors.push(`${concept.slug}: published concept related scholar ${scholar.scholar_slug} is not published`);
      }
    }
  }
  const conceptWorkSlugs = new Set(corpus.concepts.flatMap((concept) => isConceptContent(concept.content.en) ? concept.content.en.related_works.map((work) => work.work_slug) : []));
  for (const workSlug of workSlugs) {
    if (workStatuses.get(workSlug) === "published" && !conceptWorkSlugs.has(workSlug)) errors.push(`${workSlug}: is not related to a published concept`);
  }

  for (const field of corpus.fields) {
    validatePublication(field, field.slug);
    if (field.status === "published" && !publicDisciplineSlugs.has(field.disciplineSlug)) errors.push(`${field.slug}: published field is outside the current public discipline scope`);
    if (!disciplineSlugs.has(field.disciplineSlug)) {
      errors.push(`${field.slug}: references unknown discipline ${field.disciplineSlug}`);
    }
    if (!field.descriptionEn.trim()) errors.push(`${field.slug}: field description is empty`);
    validatePathway(field.slug, field.status, field.content.en);
    if (!["topic", "theory", "scholar", "work", "concept"].every((type) => field.content.en.entry_points.some((entry) => entry.entity_type === type))) {
      errors.push(`${field.slug}: field pathway is missing one or more required topic/theory/scholar/work/concept entry points`);
    }
  }
  for (const discipline of corpus.disciplines) {
    validatePublication(discipline, discipline.slug);
    if (discipline.status === "published" && !publicDisciplineSlugs.has(discipline.slug)) errors.push(`${discipline.slug}: published discipline is outside the current public scope`);
    if (!discipline.descriptionEn.trim() || !discipline.overviewEn.trim()) errors.push(`${discipline.slug}: discipline description or overview is empty`);
    validatePathway(discipline.slug, discipline.status, discipline.content.en);
    if (!["topic", "theory", "scholar", "work", "concept"].every((type) => discipline.content.en.entry_points.some((entry) => entry.entity_type === type))) {
      errors.push(`${discipline.slug}: discipline pathway is missing one or more required topic/theory/scholar/work/concept entry points`);
    }
  }
  for (const relation of corpus.disciplineTheories) {
    if (!disciplineSlugs.has(relation.disciplineSlug)) errors.push(`discipline relation: unknown discipline ${relation.disciplineSlug}`);
    if (!theorySlugs.has(relation.theorySlug)) errors.push(`discipline relation: unknown theory ${relation.theorySlug}`);
    if (disciplineStatuses.get(relation.disciplineSlug) === "published" && theoryStatuses.get(relation.theorySlug) !== "published") {
      errors.push(`discipline-theory relation ${relation.disciplineSlug}:${relation.theorySlug}: published discipline target theory ${relation.theorySlug} is not published`);
    }
  }
  for (const relation of corpus.fieldTheories) {
    if (!fieldSlugs.has(relation.fieldSlug)) errors.push(`field relation: unknown field ${relation.fieldSlug}`);
    if (!theorySlugs.has(relation.theorySlug)) errors.push(`field relation: unknown theory ${relation.theorySlug}`);
    if (fieldStatuses.get(relation.fieldSlug) === "published" && theoryStatuses.get(relation.theorySlug) !== "published") {
      errors.push(`field-theory relation ${relation.fieldSlug}:${relation.theorySlug}: published field target theory ${relation.theorySlug} is not published`);
    }
  }
  for (const relation of corpus.theoryWorks) {
    const key = `${relation.theorySlug}:${relation.workSlug}`;
    if (theoryWorkKeys.has(key)) errors.push(`theory-work relation ${key}: duplicate relation`);
    theoryWorkKeys.add(key);
    if (!theorySlugs.has(relation.theorySlug)) errors.push(`theory-work relation: unknown theory ${relation.theorySlug}`);
    if (!workSlugs.has(relation.workSlug)) errors.push(`theory-work relation: unknown work ${relation.workSlug}`);
    if (theoryStatuses.get(relation.theorySlug) === "published" && !allowsArchivedReference("work", relation.workSlug, workStatuses.get(relation.workSlug))) {
      errors.push(`theory-work relation ${key}: published theory target work ${relation.workSlug} is not published`);
    }
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
    if (theoryStatuses.get(relation.theorySlug) === "published" && !allowsArchivedReference("concept", relation.conceptSlug, conceptStatuses.get(relation.conceptSlug))) {
      errors.push(`theory-concept relation ${key}: published theory target concept ${relation.conceptSlug} is not published`);
    }
  }
  const theoryConceptSlugs = new Set(corpus.theoryConcepts.map((relation) => relation.conceptSlug));
  for (const conceptSlug of conceptSlugs) {
    if (!theoryConceptSlugs.has(conceptSlug)) errors.push(`${conceptSlug}: is not related to a published theory`);
  }
  for (const edge of corpus.genealogy) {
    if (!theorySlugs.has(edge.sourceSlug)) errors.push(`${edge.id}: unknown source theory ${edge.sourceSlug}`);
    if (!theorySlugs.has(edge.targetSlug)) errors.push(`${edge.id}: unknown target theory ${edge.targetSlug}`);
    if (theoryStatuses.get(edge.sourceSlug) === "draft") {
      errors.push(`${edge.id}: canonical genealogy source theory ${edge.sourceSlug} is not published`);
    }
    if (theoryStatuses.get(edge.sourceSlug) === "published" && theoryStatuses.get(edge.targetSlug) !== "published") {
      errors.push(`${edge.id}: published genealogy target theory ${edge.targetSlug} is not published`);
    }
    if (!edge.descriptionEn.trim()) errors.push(`${edge.id}: genealogy description is empty`);
  }
  for (const scholar of corpus.scholars) {
    validatePublication(scholar, scholar.slug);
    if (!scholar.slug.trim()) errors.push("scholar: slug is empty");
    if (!scholar.name.trim()) errors.push(`${scholar.slug}: scholar name is empty`);
    if (scholar.status === "published" && !scholar.bioEn.trim()) errors.push(`${scholar.slug}: published scholar bio is empty`);
    if (!isScholarContent(scholar.content.en)) {
      errors.push(`${scholar.slug}: does not satisfy the scholar content contract`);
      continue;
    }
    for (const relation of scholar.content.en.theory_relationships) {
      if (!theorySlugs.has(relation.theory_slug)) {
        errors.push(`${scholar.slug}: unknown theory relationship ${relation.theory_slug}`);
      } else if (scholar.status === "published" && theoryStatuses.get(relation.theory_slug) !== "published") {
        errors.push(`${scholar.slug}: published scholar theory ${relation.theory_slug} is not published`);
      }
    }
    for (const work of scholar.content.en.representative_works) {
      if (work.work_slug && !workSlugs.has(work.work_slug)) {
        errors.push(`${scholar.slug}: unknown representative work ${work.work_slug}`);
      } else if (work.work_slug && scholar.status === "published" && workStatuses.get(work.work_slug) !== "published") {
        errors.push(`${scholar.slug}: published scholar representative work ${work.work_slug} is not published`);
      }
    }
  }
  for (const relation of corpus.theoryScholars) {
    const key = `${relation.theorySlug}:${relation.scholarSlug}`;
    if (theoryScholarKeys.has(key)) errors.push(`theory-scholar relation ${key}: duplicate relation`);
    theoryScholarKeys.add(key);
    if (!theorySlugs.has(relation.theorySlug)) errors.push(`theory-scholar relation: unknown theory ${relation.theorySlug}`);
    if (!scholarSlugs.has(relation.scholarSlug)) errors.push(`theory-scholar relation: unknown scholar ${relation.scholarSlug}`);
    if (theoryStatuses.get(relation.theorySlug) === "published" && scholarStatuses.get(relation.scholarSlug) !== "published") {
      errors.push(`theory-scholar relation ${key}: published theory target scholar ${relation.scholarSlug} is not published`);
    }
    if (!relation.evidenceNotesEn.trim()) errors.push(`theory-scholar relation ${key}: evidence notes are empty`);
    if (relation.sourceUrls.length === 0) errors.push(`theory-scholar relation ${key}: sourceUrls is empty`);
    if (relation.sourceUrls.some((source) => !sourceUrls.has(source))) {
      errors.push(`theory-scholar relation ${key}: source URL is not listed in theory source metadata`);
    }
  }
  for (const topic of corpus.topics) {
    validatePublication(topic, topic.slug);
    if (!topic.slug.trim()) errors.push("topic: slug is empty");
    if (!topic.questionEn.trim()) errors.push(`${topic.slug}: topic question is empty`);
    validatePathway(topic.slug, topic.status, topic.content.en);
  }
  for (const relation of corpus.topicTheories) {
    const key = `${relation.topicSlug}:${relation.theorySlug}`;
    const riskReview = relation.riskReview;
    const hasAuthoredRisk = Boolean(relation.riskNotesEn?.trim());
    const topicStatus = topicStatuses.get(relation.topicSlug);
    const theorySources = corpus.theories
      .find((theory) => theory.slug === relation.theorySlug)
      ?.content.en.sources ?? [];
    if (topicTheoryKeys.has(key)) errors.push(`topic-theory relation ${key}: duplicate relation`);
    topicTheoryKeys.add(key);
    if (!topicSlugs.has(relation.topicSlug)) errors.push(`topic-theory relation: unknown topic ${relation.topicSlug}`);
    if (!theorySlugs.has(relation.theorySlug)) errors.push(`topic-theory relation: unknown theory ${relation.theorySlug}`);
    if (topicStatus === "published" && theoryStatuses.get(relation.theorySlug) !== "published") {
      errors.push(`topic-theory relation ${key}: published topic target theory ${relation.theorySlug} is not published`);
    }
    if (!relation.suitabilityNotesEn.trim()) errors.push(`topic-theory relation ${key}: suitability notes are empty`);
    if (topicStatus === "published" && !riskReview) {
      errors.push(`topic-theory relation ${key}: published relation requires a complete risk review record`);
    }
    if (hasAuthoredRisk && !riskReview) {
      errors.push(`topic-theory relation ${key}: authored risk notes require a risk review record`);
    }
    if (nonEmpty(relation.riskNotesZh)) {
      errors.push(`topic-theory relation ${key}: riskNotesZh has no accepted review contract`);
    }
    if (riskReview) {
      const expectedClaimId = `topic-theory:${relation.topicSlug}:${relation.theorySlug}:risk-notes-en`;
      const expectedFieldPath = `topicTheories[topicSlug="${relation.topicSlug}",theorySlug="${relation.theorySlug}"].riskNotesEn`;
      if (riskReview.claimId !== expectedClaimId) {
        errors.push(`topic-theory relation ${key}: risk review claim ID is not the stable relation claim ID`);
      }
      if (riskReview.fieldPath !== expectedFieldPath) {
        errors.push(`topic-theory relation ${key}: risk review field path is not the exact corpus field path`);
      }
      if (riskReview.contentNature !== "research_guidance") {
        errors.push(`topic-theory relation ${key}: risk review content nature must be research_guidance`);
      }
      if (riskReview.reviewDecision === "pending_review") {
        if (hasAuthoredRisk) {
          errors.push(`topic-theory relation ${key}: pending risk review must not retain substantive risk wording`);
        }
        if (riskReview.evidenceStatus !== "pending_review") {
          errors.push(`topic-theory relation ${key}: pending risk review evidence status must be pending_review`);
        }
        if (riskReview.reviewReadiness !== "blocked" && riskReview.reviewReadiness !== "partially_supported") {
          errors.push(`topic-theory relation ${key}: pending risk review readiness must be blocked or partially_supported`);
        }
        if (!nonEmpty(riskReview.blocker)) {
          errors.push(`topic-theory relation ${key}: pending risk review requires a blocker`);
        }
        if (["sourceId", "locator", "verifiedAt", "reviewerIdentity", "reviewerRole", "reviewedAt", "rationale", "approvedWordingEn", "revisionInstruction"].some((field) => field in riskReview)) {
          errors.push(`topic-theory relation ${key}: pending risk review must not contain acceptance metadata`);
        }
      } else if (riskReview.reviewDecision === "accept_as_worded" || riskReview.reviewDecision === "accept_with_revision") {
        const acceptedSource = theorySources.find((source) => source.id === riskReview.sourceId);
        if (!acceptedSource) {
          errors.push(`topic-theory relation ${key}: accepted risk review source is not listed in theory metadata`);
        } else if (!relation.sourceUrls.includes(acceptedSource.url)) {
          errors.push(`topic-theory relation ${key}: accepted risk review source URL is not listed in relation sourceUrls`);
        }
        if (!hasAuthoredRisk || !nonEmpty(riskReview.approvedWordingEn) || riskReview.approvedWordingEn !== relation.riskNotesEn) {
          errors.push(`topic-theory relation ${key}: accepted risk review approved wording must exactly equal riskNotesEn`);
        }
        if (riskReview.reviewDecision === "accept_as_worded" && "revisionInstruction" in riskReview) {
          errors.push(`topic-theory relation ${key}: accept_as_worded must not include a revision instruction`);
        }
        if (riskReview.reviewDecision === "accept_with_revision" && !nonEmpty(riskReview.revisionInstruction)) {
          errors.push(`topic-theory relation ${key}: accept_with_revision requires a bounded revision instruction`);
        }
        if (!hasAcceptedTopicTheoryRiskReview(relation, theorySources)) {
          errors.push(`topic-theory relation ${key}: accepted risk review is missing readiness, source, locator, verification date, methods reviewer, review date, rationale, or approved final wording`);
        }
      } else {
        if (hasAuthoredRisk) {
          errors.push(`topic-theory relation ${key}: rejected risk review must not retain substantive risk wording`);
        }
        if (
          riskReview.reviewReadiness !== "blocked"
          || !nonEmpty(riskReview.reviewerIdentity)
          || riskReview.reviewerRole !== "methods"
          || !nonEmpty(riskReview.reviewedAt)
          || Number.isNaN(Date.parse(riskReview.reviewedAt))
          || !nonEmpty(riskReview.rationale)
        ) {
          errors.push(`topic-theory relation ${key}: rejected risk review is missing methods reviewer metadata`);
        }
        if (!nonEmpty(riskReview.blocker)) {
          errors.push(`topic-theory relation ${key}: rejected risk review requires a blocker`);
        }
      }
    }
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
      if (item.verifiedAt !== undefined && Number.isNaN(Date.parse(item.verifiedAt))) {
        errors.push(`verification for ${item.entitySlug}: L1 record requires a valid ISO verifiedAt`);
      }
      const theory = corpus.theories.find((entry) => entry.slug === item.entitySlug);
      const sourceUrls = new Set(theory?.content.en.sources?.map((source) => source.url) ?? []);
      if (item.sources.some((source) => !sourceUrls.has(source))) {
        errors.push(`verification for ${item.entitySlug}: L1 source is not listed in page metadata`);
      }
    }
  }

  const publishedPublicTheorySlugs = new Set(corpus.disciplineTheories
    .filter((relation) => publicDisciplineSlugs.has(relation.disciplineSlug) && corpus.disciplines.some((discipline) => discipline.slug === relation.disciplineSlug && discipline.status === "published"))
    .map((relation) => relation.theorySlug));
  for (const theory of corpus.theories) {
    if (theory.status === "published" && !publishedPublicTheorySlugs.has(theory.slug)) errors.push(`${theory.slug}: published theory is outside Education/Sociology scope`);
  }

  return { errors };
}
