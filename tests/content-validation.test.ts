import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { type SeedCorpus, type SeedTopicTheory } from "../src/data/seed-content.ts";
import { seedCorpus } from "./helpers/public-seed-corpus.ts";
import { isConceptContent, isWorkContent } from "../src/data/templates/knowledge-entity-template.ts";
import { isScholarContent } from "../src/data/templates/scholar-template.ts";
import { isPathwayContent } from "../src/data/templates/pathway-template.ts";
import { requiredTheoryBlocks } from "../src/data/templates/theory-template.ts";
import { entityDetailHref } from "../src/lib/entity-routes.ts";
import {
  buildTopicTheoryCreateData,
  buildTopicTheoryUpdateData,
  validateSeedCorpus,
} from "../src/lib/content-validation.ts";
import { isFAN133U3Archived } from "../src/lib/u3-visibility.ts";

function theorySourcesFor(relation: SeedTopicTheory, corpus = seedCorpus) {
  return corpus.theories
    .find((theory) => theory.slug === relation.theorySlug)
    ?.content.en.sources ?? [];
}

test("the seed corpus satisfies the structural content contract", () => {
  const result = validateSeedCorpus(seedCorpus);

  assert.deepEqual(result.errors, []);
  assert.equal(seedCorpus.theories.filter((theory) => theory.primary).length, 12);
  assert.deepEqual(
    Object.fromEntries(
      ["D1", "D2", "D3"].map((depth) => [
        depth,
        seedCorpus.theories.filter((theory) => theory.depth === depth).length,
      ]),
    ),
    { D1: 6, D2: 4, D3: 2 },
  );
  for (const theory of seedCorpus.theories) {
    for (const block of requiredTheoryBlocks(theory.depth)) {
      const value = theory.content.en[block];
      assert.ok(Array.isArray(value) ? value.length > 0 : Boolean(value?.trim?.()), `${theory.slug} has ${block}`);
    }
  }
  const theorySlugs = new Set(seedCorpus.theories.map((theory) => theory.slug));
  assert.ok(seedCorpus.genealogy.every((edge) => edge.descriptionEn.trim().length > 0));
  assert.ok(seedCorpus.genealogy.every((edge) => theorySlugs.has(edge.sourceSlug) && theorySlugs.has(edge.targetSlug)));
  assert.ok(seedCorpus.theories.every((theory) => theory.content.en.genealogy.every((entry) => theorySlugs.has(entry.related_theory) && entry.description.trim().length > 0)));
  assert.ok(
    seedCorpus.verifications
      .filter((item) => item.level === "L1_verified")
      .every((item) => item.sources.length > 0 && item.sources.every((source) => source.startsWith("https://"))),
  );
});

test("published Discipline, Field, and Theory reject scope outside Education and Sociology", () => {
  const corpus = structuredClone(seedCorpus);
  corpus.disciplines.push({ ...structuredClone(corpus.disciplines[0]), slug: "psychology", titleEn: "Psychology" });
  corpus.fields.push({ ...structuredClone(corpus.fields[0]), slug: "psychology-field", disciplineSlug: "psychology" });
  corpus.theories.push({ ...structuredClone(corpus.theories[0]), slug: "psychology-theory", titleEn: "Psychology Theory" });

  const errors = validateSeedCorpus(corpus).errors;
  assert.ok(errors.some((error) => error.includes("psychology") && error.includes("scope")));
  assert.ok(errors.some((error) => error.includes("psychology-field") && error.includes("scope")));
  assert.ok(errors.some((error) => error.includes("psychology-theory") && error.includes("outside Education/Sociology")));
});

test("Psychology and Management records may exist only as draft research candidates", () => {
  const corpus = structuredClone(seedCorpus);
  corpus.disciplines.push({ ...structuredClone(corpus.disciplines[0]), slug: "psychology", titleEn: "Psychology", status: "draft", publishedAt: undefined });
  corpus.disciplines.push({ ...structuredClone(corpus.disciplines[0]), slug: "management", titleEn: "Management", status: "draft", publishedAt: undefined });

  assert.deepEqual(validateSeedCorpus(corpus).errors, []);
});

test("published entity requires a valid ISO publishedAt", () => {
  const corpus = structuredClone(seedCorpus);
  corpus.works[0].publishedAt = "not-a-date";

  assert.ok(validateSeedCorpus(corpus).errors.some((error) => error.includes(corpus.works[0].slug) && error.includes("valid ISO")));
});

test("legacy L1 source metadata validates an explicitly authored date but does not require one", () => {
  const corpus = structuredClone(seedCorpus);
  const verification = corpus.verifications.find((entry) => entry.level === "L1_verified");

  assert.ok(verification, "the corpus includes an L1 seed verification");
  verification.verifiedAt = "not-a-date";
  assert.ok(
    validateSeedCorpus(corpus).errors.includes(
      `verification for ${verification.entitySlug}: L1 record requires a valid ISO verifiedAt`,
    ),
  );
  delete verification.verifiedAt;
  assert.ok(
    !validateSeedCorpus(corpus).errors.includes(
      `verification for ${verification.entitySlug}: L1 record requires a valid ISO verifiedAt`,
    ),
  );
});

test("the seed corpus includes published scholar and topic graph relations with evidence", () => {
  assert.ok(seedCorpus.scholars.some((scholar) => scholar.status === "published" && scholar.slug === "glen-h-elder-jr"));
  assert.ok(seedCorpus.topics.some((topic) => topic.status === "published" && topic.slug === "educational-transitions-over-time"));
  assert.ok(seedCorpus.theoryScholars.some((relation) => (
    relation.theorySlug === "life-course-theory"
    && relation.scholarSlug === "glen-h-elder-jr"
    && relation.role === "key_contributor"
    && relation.sourceUrls.length > 0
    && relation.evidenceNotesEn.trim().length > 0
  )));
  assert.ok(seedCorpus.topicTheories.some((relation) => (
    relation.topicSlug === "educational-transitions-over-time"
    && relation.theorySlug === "life-course-theory"
    && relation.suitability === "high"
    && relation.recommendation === "primary"
    && relation.suitabilityNotesEn.trim().length > 0
    && !relation.riskNotesEn
    && relation.riskReview?.contentNature === "research_guidance"
    && relation.riskReview.reviewReadiness === "blocked"
    && relation.riskReview.reviewDecision === "pending_review"
    && relation.sourceUrls.length > 0
  )));
  assert.equal(entityDetailHref("scholar", "glen-h-elder-jr"), "/scholars/glen-h-elder-jr");
  assert.equal(entityDetailHref("topic", "educational-transitions-over-time"), "/topics/educational-transitions-over-time");
});

test("canonical relations retain no unreviewed risk wording and published rows keep neutral pending governance", () => {
  assert.equal(seedCorpus.topicTheories.length, 24);
  assert.ok(seedCorpus.topicTheories.every((relation) => !relation.riskNotesEn && !relation.riskNotesZh));
  const publishedRelations = seedCorpus.topicTheories.filter((relation) => seedCorpus.topics.some((topic) => (
    topic.slug === relation.topicSlug && topic.status === "published"
  )));
  const draftRelations = seedCorpus.topicTheories.filter((relation) => seedCorpus.topics.some((topic) => (
    topic.slug === relation.topicSlug && topic.status === "draft"
  )));
  const reviews = publishedRelations.map((relation) => relation.riskReview);

  assert.equal(publishedRelations.length, 12);
  assert.equal(draftRelations.length, 12);
  assert.ok(draftRelations.every((relation) => !relation.riskReview));
  assert.equal(new Set(reviews.map((review) => review?.claimId)).size, 12);
  assert.ok(reviews.every((review) => (
    review?.fieldPath.endsWith(".riskNotesEn")
    && review.contentNature === "research_guidance"
    && review.evidenceStatus === "pending_review"
    && review.reviewReadiness === "blocked"
    && review.reviewDecision === "pending_review"
    && Boolean(review.blocker?.trim())
  )));
});

test("the teacher life-history ethics source resolves to its publisher DOI record", () => {
  const source = seedCorpus.theories
    .find((theory) => theory.slug === "teacher-life-history-research")
    ?.content.en.sources?.find((entry) => entry.id === "teacher-life-history-josselson-2007");

  assert.equal(source?.url, "https://doi.org/10.4135/9781452226552.n21");
  assert.match(source?.citation || "", /Josselson, R\. \(2007\)/);
});

test("published topic-theory relations require neutral risk governance but no unreviewed wording", () => {
  const corpus = structuredClone(seedCorpus);
  const relation = corpus.topicTheories.find((entry) => (
    entry.topicSlug === "educational-transitions-over-time"
    && entry.theorySlug === "life-course-theory"
  ));

  assert.ok(relation, "the published Life Course topic relation exists");
  delete relation.riskReview;
  const missingErrors = validateSeedCorpus(corpus).errors;
  assert.ok(missingErrors.includes(
    "topic-theory relation educational-transitions-over-time:life-course-theory: published relation requires a complete risk review record",
  ));

  const invalidCorpus = structuredClone(seedCorpus);
  const invalidRelation = invalidCorpus.topicTheories.find((entry) => (
    entry.topicSlug === "educational-transitions-over-time"
    && entry.theorySlug === "life-course-theory"
  ));
  assert.ok(invalidRelation);
  assert.ok(invalidRelation.riskReview);
  invalidRelation.riskReview.claimId = "";
  assert.ok(
    validateSeedCorpus(invalidCorpus).errors.includes(
      "topic-theory relation educational-transitions-over-time:life-course-theory: risk review claim ID is not the stable relation claim ID",
    ),
  );
});

test("draft topic-theory relations are not forced to author risk notes", () => {
  const corpus = structuredClone(seedCorpus);
  const relation = corpus.topicTheories.find((entry) => corpus.topics.some((topic) => (
    topic.slug === entry.topicSlug && topic.status === "draft"
  )));

  assert.ok(relation, "the corpus includes a draft topic-theory relation");
  delete relation.riskNotesEn;
  delete relation.riskNotesZh;
  delete relation.riskReview;
  assert.deepEqual(validateSeedCorpus(corpus).errors, []);
});

test("pending risk guidance is fail-closed for persistence and keeps no fabricated review fields", () => {
  const relation = structuredClone(seedCorpus.topicTheories.find((entry) => (
    entry.topicSlug === "educational-transitions-over-time"
    && entry.theorySlug === "life-course-theory"
  )));

  assert.ok(relation);
  const review = relation.riskReview;
  assert.ok(review);
  assert.equal(review.reviewDecision, "pending_review");
  assert.ok(review.blocker);
  assert.equal("reviewerIdentity" in review, false);
  assert.equal("reviewerRole" in review, false);
  assert.equal("reviewedAt" in review, false);
  assert.equal("locator" in review, false);
  assert.equal(review.reviewReadiness, "blocked");
  const theorySources = theorySourcesFor(relation);
  assert.equal(buildTopicTheoryUpdateData(relation, theorySources).riskNotesEn, null);
  assert.equal(buildTopicTheoryCreateData(relation, theorySources).riskNotesEn, null);
});

test("accepted risk guidance persists only complete approved wording tied to the relation source URL", () => {
  const corpus = structuredClone(seedCorpus);
  const relationIndex = corpus.topicTheories.findIndex((entry) => (
    entry.topicSlug === "educational-transitions-over-time"
    && entry.theorySlug === "life-course-theory"
  ));
  const relation = corpus.topicTheories[relationIndex];

  assert.ok(relation);
  assert.ok(relation.riskReview);
  const reviewIdentity = {
    claimId: relation.riskReview.claimId,
    fieldPath: relation.riskReview.fieldPath,
    contentNature: relation.riskReview.contentNature,
  } as const;
  const incompleteRelation = {
    ...relation,
    riskNotesEn: "Approved test fixture guidance.",
    riskReview: {
      ...reviewIdentity,
      evidenceStatus: "verified",
      reviewReadiness: "ready_for_human_review",
      reviewDecision: "accept_as_worded",
      approvedWordingEn: "Approved test fixture guidance.",
    },
  } as unknown as SeedTopicTheory;
  corpus.topicTheories[relationIndex] = incompleteRelation;
  assert.ok(validateSeedCorpus(corpus).errors.some((error) => error.includes("accepted risk review is missing")));
  assert.equal(buildTopicTheoryUpdateData(incompleteRelation, theorySourcesFor(incompleteRelation, corpus)).riskNotesEn, null);

  const source = corpus.theories
    .find((theory) => theory.slug === incompleteRelation.theorySlug)
    ?.content.en.sources?.find((candidate) => incompleteRelation.sourceUrls.includes(candidate.url));
  assert.ok(source);
  const approvedWording = "Approved test fixture guidance.";
  const acceptedRelation = {
    ...relation,
    riskNotesEn: approvedWording,
    riskReview: {
      ...reviewIdentity,
      evidenceStatus: "verified",
      reviewReadiness: "ready_for_human_review",
      reviewDecision: "accept_as_worded",
      sourceId: source.id,
      locator: "test fixture locator",
      verifiedAt: "2026-08-02",
      reviewerIdentity: "test fixture methods reviewer",
      reviewerRole: "methods",
      reviewedAt: "2026-08-02",
      rationale: "The test fixture records an explicit methods-aware acceptance rationale.",
      approvedWordingEn: approvedWording,
    },
  } satisfies SeedTopicTheory;
  corpus.topicTheories[relationIndex] = acceptedRelation;
  assert.deepEqual(validateSeedCorpus(corpus).errors, []);
  assert.equal(
    buildTopicTheoryUpdateData(acceptedRelation, theorySourcesFor(acceptedRelation, corpus)).riskNotesEn,
    approvedWording,
  );
});

test("accepted risk guidance rejects a theory source whose URL is absent from relation sourceUrls", () => {
  const corpus = structuredClone(seedCorpus);
  const relationIndex = corpus.topicTheories.findIndex((entry) => (
    entry.topicSlug === "educational-transitions-over-time"
    && entry.theorySlug === "life-course-theory"
  ));
  const relation = corpus.topicTheories[relationIndex];

  assert.ok(relation?.riskReview);
  const theorySources = theorySourcesFor(relation, corpus);
  const mismatchedSource = theorySources.find((source) => !relation.sourceUrls.includes(source.url));
  assert.ok(mismatchedSource, "the theory fixture includes a source outside this relation");
  const approvedWording = "Approved test fixture guidance.";
  const mismatchedRelation = {
    ...relation,
    riskNotesEn: approvedWording,
    riskReview: {
      claimId: relation.riskReview.claimId,
      fieldPath: relation.riskReview.fieldPath,
      contentNature: relation.riskReview.contentNature,
      evidenceStatus: "verified",
      reviewReadiness: "ready_for_human_review",
      reviewDecision: "accept_as_worded",
      sourceId: mismatchedSource.id,
      locator: "test fixture locator",
      verifiedAt: "2026-08-02",
      reviewerIdentity: "test fixture methods reviewer",
      reviewerRole: "methods",
      reviewedAt: "2026-08-02",
      rationale: "The test fixture deliberately uses a relation-mismatched source.",
      approvedWordingEn: approvedWording,
    },
  } satisfies SeedTopicTheory;
  corpus.topicTheories[relationIndex] = mismatchedRelation;

  assert.ok(validateSeedCorpus(corpus).errors.includes(
    "topic-theory relation educational-transitions-over-time:life-course-theory: accepted risk review source URL is not listed in relation sourceUrls",
  ));
  assert.equal(buildTopicTheoryUpdateData(mismatchedRelation, theorySources).riskNotesEn, null);
});

test("accepted wording must match exactly and revision acceptance persists only the approved final wording", () => {
  const corpus = structuredClone(seedCorpus);
  const relationIndex = corpus.topicTheories.findIndex((entry) => (
    entry.topicSlug === "educational-transitions-over-time"
    && entry.theorySlug === "life-course-theory"
  ));
  const relation = corpus.topicTheories[relationIndex];

  assert.ok(relation?.riskReview);
  const theorySources = theorySourcesFor(relation, corpus);
  const source = theorySources.find((candidate) => relation.sourceUrls.includes(candidate.url));
  assert.ok(source);
  const reviewIdentity = {
    claimId: relation.riskReview.claimId,
    fieldPath: relation.riskReview.fieldPath,
    contentNature: relation.riskReview.contentNature,
  } as const;
  const approvedFinalWording = "Approved final test fixture guidance.";
  const mismatchedWordingRelation = {
    ...relation,
    riskNotesEn: "Different persisted test fixture guidance.",
    riskReview: {
      ...reviewIdentity,
      evidenceStatus: "verified",
      reviewReadiness: "ready_for_human_review",
      reviewDecision: "accept_as_worded",
      sourceId: source.id,
      locator: "test fixture locator",
      verifiedAt: "2026-08-02",
      reviewerIdentity: "test fixture methods reviewer",
      reviewerRole: "methods",
      reviewedAt: "2026-08-02",
      rationale: "The test fixture deliberately mismatches approved and persisted wording.",
      approvedWordingEn: approvedFinalWording,
    },
  } satisfies SeedTopicTheory;
  corpus.topicTheories[relationIndex] = mismatchedWordingRelation;
  assert.ok(validateSeedCorpus(corpus).errors.includes(
    "topic-theory relation educational-transitions-over-time:life-course-theory: accepted risk review approved wording must exactly equal riskNotesEn",
  ));
  assert.equal(buildTopicTheoryUpdateData(mismatchedWordingRelation, theorySources).riskNotesEn, null);

  const incompleteRevision = {
    ...relation,
    riskNotesEn: approvedFinalWording,
    riskReview: {
      ...reviewIdentity,
      evidenceStatus: "verified",
      reviewReadiness: "ready_for_human_review",
      reviewDecision: "accept_with_revision",
      sourceId: source.id,
      locator: "test fixture locator",
      verifiedAt: "2026-08-02",
      reviewerIdentity: "test fixture methods reviewer",
      reviewerRole: "methods",
      reviewedAt: "2026-08-02",
      rationale: "The test fixture records why revision is required.",
      approvedWordingEn: approvedFinalWording,
    },
  } as unknown as SeedTopicTheory;
  corpus.topicTheories[relationIndex] = incompleteRevision;
  assert.ok(validateSeedCorpus(corpus).errors.includes(
    "topic-theory relation educational-transitions-over-time:life-course-theory: accept_with_revision requires a bounded revision instruction",
  ));
  assert.equal(buildTopicTheoryUpdateData(incompleteRevision, theorySources).riskNotesEn, null);

  const revisedRelation = {
    ...relation,
    riskNotesEn: approvedFinalWording,
    riskReview: {
      ...reviewIdentity,
      evidenceStatus: "verified",
      reviewReadiness: "ready_for_human_review",
      reviewDecision: "accept_with_revision",
      sourceId: source.id,
      locator: "test fixture locator",
      verifiedAt: "2026-08-02",
      reviewerIdentity: "test fixture methods reviewer",
      reviewerRole: "methods",
      reviewedAt: "2026-08-02",
      rationale: "The test fixture records why revision is required.",
      approvedWordingEn: approvedFinalWording,
      revisionInstruction: "Replace the unapproved draft with the bounded final fixture wording.",
    },
  } satisfies SeedTopicTheory;
  corpus.topicTheories[relationIndex] = revisedRelation;

  assert.deepEqual(validateSeedCorpus(corpus).errors, []);
  const persistence = buildTopicTheoryUpdateData(revisedRelation, theorySources);
  assert.equal(persistence.riskNotesEn, approvedFinalWording);
  assert.notEqual(persistence.riskNotesEn, revisedRelation.riskReview.revisionInstruction);
});

test("topic-theory update preserves an absent optional suitabilityNotesZh field", () => {
  const relation = structuredClone(seedCorpus.topicTheories[0]);
  delete relation.suitabilityNotesZh;
  const theorySources = theorySourcesFor(relation);

  const updateData = buildTopicTheoryUpdateData(relation, theorySources);
  const createData = buildTopicTheoryCreateData(relation, theorySources);

  assert.equal("suitabilityNotesZh" in updateData, false);
  assert.equal(createData.suitabilityNotesZh, null);
});

test("bibliographic source records keep their edition and support boundaries", () => {
  const sources = seedCorpus.theories.flatMap((theory) => theory.content.en.sources ?? []);
  const kingdon1995 = sources.find((source) => source.id === "kingdon-1995-agendas-alternatives-openlibrary");
  const bourdieu1986 = sources.find((source) => source.id === "practice-capital-1986");
  const goodsonSikes = sources.find((source) => source.id === "teacher-life-history-goodson-sikes-2001");

  assert.equal(kingdon1995?.source_kind, "library");
  assert.match(kingdon1995?.citation || "", /\(1995\).*2nd ed\./);
  assert.ok(kingdon1995?.supports.every((support) => !/2011 edition|original 1984/i.test(support) || /does not verify/i.test(support)));
  assert.equal(bourdieu1986?.source_kind, "university");
  assert.ok(bourdieu1986?.supports.some((support) => /auxiliary reading/i.test(support)));
  assert.ok(bourdieu1986?.supports.some((support) => /does not serve as claim-level proof/i.test(support)));
  assert.equal(goodsonSikes?.source_kind, "library");
  assert.ok(goodsonSikes?.supports.some((support) => /WorldCat\/OCLC bibliographic record/i.test(support)));
});

test("review-flagged DOI publisher journal and university records do not imply claim-level interpretation", () => {
  const boundedSourceIds = new Set([
    "struct-sewell-1992",
    "cop-wenger-2000",
    "cop-contu-willmott-2003",
    "cop-cox-2005",
    "cop-eberle-etal-2014",
    "practice-symbolic-power-1979",
    "social-portes-1998",
    "social-lin-2001",
    "social-woolcock-1998",
  ]);
  const sources = seedCorpus.theories.flatMap((theory) => theory.content.en.sources ?? []);
  const reviewedSources = sources.filter((source) => boundedSourceIds.has(source.id));

  assert.deepEqual(new Set(reviewedSources.map((source) => source.id)), boundedSourceIds);
  assert.ok(reviewedSources.every((source) => source.supports.every((support) => (
    /bibliographic|source record|editorial|claim-level review pending/i.test(support)
  ))));
});

test("Life Course R2 sources are wired into sources, reading path, and L1 verification", () => {
  const expectedSourceIds = [
    "elder-1996-human-lives-changing-societies",
    "elder-2000-life-course-theory-encyclopedia",
    "elder-1999-children-of-the-great-depression-25th",
  ];
  const lifeCourse = seedCorpus.theories.find((theory) => theory.slug === "life-course-theory");

  assert.ok(lifeCourse, "life-course-theory is included");
  const sourceIds = lifeCourse.content.en.sources?.map((source) => source.id) ?? [];
  const readingSourceIds = lifeCourse.content.en.reading_path?.map((entry) => entry.source_id) ?? [];
  const verifiedSourceIds = lifeCourse.content.en.verification
    ?.filter((entry) => entry.evidence_level === "L1" && entry.status === "verified")
    .map((entry) => entry.source_id) ?? [];

  for (const sourceId of expectedSourceIds) {
    assert.equal(sourceIds.filter((id) => id === sourceId).length, 1, `${sourceId} appears once in sources`);
    assert.ok(readingSourceIds.includes(sourceId), `${sourceId} appears in the reading path`);
    assert.ok(verifiedSourceIds.includes(sourceId), `${sourceId} has L1 verified page verification`);
  }
  assert.equal(sourceIds.length, 9, "Life Course has nine sources");
  assert.equal(readingSourceIds.length, 9, "Life Course has nine reading-path entries");
  assert.deepEqual(
    lifeCourse.content.en.reading_path?.map((entry) => entry.order),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    "Life Course reading-path orders are unique and sequential",
  );
});

test("three flagship checks retain genealogy, fit boundaries, paths, operationalization, and sources", () => {
  const slugs = ["life-course-theory", "teacher-identity-theory", "structuration-theory"];

  for (const slug of slugs) {
    const theory = seedCorpus.theories.find((entry) => entry.slug === slug);
    assert.ok(theory, `${slug} is included`);
    assert.ok(theory.content.en.genealogy.length > 0, `${slug} has a genealogy`);
    assert.ok(theory.content.en.applicable_topics.length > 0, `${slug} has fit guidance`);
    assert.ok(theory.content.en.inapplicable_topics.length > 0, `${slug} sets fit boundaries`);
    assert.ok(theory.content.en.reading_path?.length, `${slug} has a reading path`);
    assert.ok((theory.content.en.sources?.length ?? 0) > 0, `${slug} has sources`);
    if (theory.depth !== "D1") {
      assert.ok(theory.content.en.data_collection?.length, `${slug} has operationalization`);
    }
  }
});

test("the two D3 flagships satisfy the C2 depth contract", () => {
  const d3Theories = seedCorpus.theories.filter((theory) => theory.depth === "D3");

  assert.deepEqual(d3Theories.map((theory) => theory.slug), [
    "life-course-theory",
    "teacher-identity-theory",
  ]);

  for (const theory of d3Theories) {
    const content = theory.content.en as typeof theory.content.en & Record<string, unknown>;
    const sourceHosts = new Set(content.sources?.map((source) => new URL(source.url).hostname));
    const verificationLevels = new Set(content.verification?.map((entry) => entry.evidence_level));
    const readingLevels = new Set(content.reading_path?.map((entry) => entry.level));

    assert.ok(typeof content.core_question === "string" && content.core_question.trim(), `${theory.slug} has a core question`);
    assert.ok(Array.isArray(content.historical_development) && content.historical_development.length >= 3, `${theory.slug} has development stages`);
    assert.ok(Array.isArray(content.key_scholars) && content.key_scholars.length >= 3, `${theory.slug} has key scholars and works`);
    assert.ok(content.core_concepts.length >= 4 && content.core_concepts.length <= 6, `${theory.slug} has 4-6 concepts`);
    assert.ok(Array.isArray(content.adjacent_theories) && content.adjacent_theories.length >= 2, `${theory.slug} compares adjacent theories`);
    assert.ok(content.applicable_topics.length >= 3, `${theory.slug} has multiple applicable questions`);
    assert.ok(content.inapplicable_topics.length >= 2, `${theory.slug} has multiple non-fit boundaries`);
    assert.ok(Array.isArray(content.criticisms) && content.criticisms.length >= 2, `${theory.slug} has criticisms and boundaries`);
    assert.ok(content.misuse_risks.length >= 3, `${theory.slug} has misuse risks`);
    assert.ok((content.analysis_dimensions?.length ?? 0) >= 4, `${theory.slug} has analysis dimensions`);
    assert.ok((content.data_collection?.length ?? 0) >= 3, `${theory.slug} distinguishes data materials`);
    assert.ok((content.chapter_structure?.length ?? 0) >= 4, `${theory.slug} covers dissertation chapters`);
    assert.ok((content.reading_path?.length ?? 0) >= 3, `${theory.slug} has a layered reading path`);
    assert.ok(readingLevels.size >= 3 && !readingLevels.has(undefined), `${theory.slug} names at least three reading levels`);
    assert.ok((content.sources?.length ?? 0) >= 4 && sourceHosts.size >= 3, `${theory.slug} has independent authoritative sources`);
    assert.deepEqual(verificationLevels, new Set(["L1", "L2", "L3"]), `${theory.slug} separates L1/L2/L3`);
  }

  assert.notDeepEqual(
    d3Theories[0].content.en.data_collection,
    d3Theories[1].content.en.data_collection,
    "the D3 pages do not reuse the same operationalization copy",
  );
});

test("the four D2 theories satisfy the C3 research-design contract", () => {
  const expected = [
    "structuration-theory",
    "communities-of-practice",
    "practice-theory-bourdieu",
    "social-capital-theory",
  ];
  const d2Theories = seedCorpus.theories.filter((theory) => theory.depth === "D2");

  assert.deepEqual(d2Theories.map((theory) => theory.slug), expected);
  for (const theory of d2Theories) {
    const content = theory.content.en as typeof theory.content.en & Record<string, unknown>;
    const sourceHosts = new Set(content.sources?.map((source) => new URL(source.url).hostname));
    const verificationLevels = new Set(content.verification?.map((entry) => entry.evidence_level));
    const readingLevels = new Set(content.reading_path?.map((entry) => entry.level));
    const comparisons = content.theory_comparisons as Array<{ role?: string }> | undefined;

    assert.ok(content.core_concepts.length >= 4 && content.core_concepts.length <= 6, `${theory.slug} has 4-6 concepts`);
    assert.ok(Array.isArray(content.explanatory_mechanisms) && content.explanatory_mechanisms.length >= 2, `${theory.slug} explains mechanisms`);
    assert.ok(typeof content.analysis_unit === "string" && content.analysis_unit.trim(), `${theory.slug} defines an analysis unit`);
    assert.ok(comparisons?.some((entry) => entry.role === "main_candidate"), `${theory.slug} compares a main candidate`);
    assert.ok(comparisons?.some((entry) => entry.role === "alternative"), `${theory.slug} compares an alternative`);
    assert.ok(Array.isArray(content.boundary_conditions) && content.boundary_conditions.length >= 2, `${theory.slug} states boundary conditions`);
    assert.ok(content.applicable_topics.length >= 3 && content.inapplicable_topics.length >= 2, `${theory.slug} supports fit decisions`);
    assert.ok((content.data_collection?.length ?? 0) >= 3 && (content.chapter_structure?.length ?? 0) >= 4, `${theory.slug} supports research design`);
    assert.ok(readingLevels.size >= 3 && !readingLevels.has(undefined), `${theory.slug} has three reading levels`);
    assert.ok((content.sources?.length ?? 0) >= 4 && sourceHosts.size >= 3, `${theory.slug} has independent sources`);
    assert.deepEqual(verificationLevels, new Set(["L1", "L2", "L3"]), `${theory.slug} separates evidence levels`);
  }

  assert.notDeepEqual(
    d2Theories.map((theory) => theory.content.en.data_collection),
    [d2Theories[0].content.en.data_collection, d2Theories[0].content.en.data_collection, d2Theories[0].content.en.data_collection, d2Theories[0].content.en.data_collection],
    "the D2 pages do not reuse a single data-collection template",
  );
});

test("the six D1 entries satisfy the C4 foundation-page contract", () => {
  const expected = [
    "teacher-professional-development-theory",
    "teacher-life-history-research",
    "educational-equity-theory",
    "institutional-theory",
    "street-level-bureaucracy",
    "multiple-streams-framework",
  ];
  const d1Theories = seedCorpus.theories.filter((theory) => theory.depth === "D1");

  assert.deepEqual(d1Theories.map((theory) => theory.slug), expected);
  for (const theory of d1Theories) {
    const content = theory.content.en as typeof theory.content.en & Record<string, unknown>;
    const sourceHosts = new Set(content.sources?.map((source) => new URL(source.url).hostname));
    const verificationLevels = new Set(content.verification?.map((entry) => entry.evidence_level));
    const nature = content.theory_nature as { kind?: string; explanation?: string; source_ids?: string[] } | undefined;
    const d2OrD3Relation = content.genealogy.find((entry) => {
      const related = seedCorpus.theories.find((candidate) => candidate.slug === entry.related_theory);
      return related?.depth === "D2" || related?.depth === "D3";
    });

    assert.ok(nature && typeof nature.kind === "string" && nature.kind.trim(), `${theory.slug} states its intellectual status`);
    assert.ok(nature && typeof nature.explanation === "string" && nature.explanation.trim(), `${theory.slug} explains that status`);
    assert.ok(nature && Array.isArray(nature.source_ids) && nature.source_ids.length > 0, `${theory.slug} sources that status`);
    assert.ok(content.core_concepts.length >= 3, `${theory.slug} has enough concepts for initial screening`);
    assert.ok(content.applicable_topics.length >= 2 && content.inapplicable_topics.length >= 2, `${theory.slug} has fit boundaries`);
    assert.ok(content.misuse_risks.length >= 3, `${theory.slug} identifies misuse risks`);
    assert.ok(content.reading_path?.length && content.reading_path.length >= 1, `${theory.slug} has a reading path`);
    assert.ok((content.sources?.length ?? 0) >= 2 && sourceHosts.size >= 2, `${theory.slug} has independent L1 sources`);
    assert.deepEqual(verificationLevels, new Set(["L1", "L2", "L3"]), `${theory.slug} separates evidence levels`);
    assert.ok(d2OrD3Relation, `${theory.slug} relates to an existing D2 or D3 page`);
  }
});

test("the C5 works and concepts layer is source-complete, linked, and deduplicated", () => {
  const workSlugs = new Set(seedCorpus.works.map((work) => work.slug));
  const conceptSlugs = new Set(seedCorpus.concepts.map((concept) => concept.slug));
  const theorySlugs = new Set(seedCorpus.theories.map((theory) => theory.slug));

  assert.equal(seedCorpus.works.length, 19, "the reviewed first batch publishes only the 19 source-complete work candidates");
  assert.ok(seedCorpus.concepts.length >= 20 && seedCorpus.concepts.length <= 24, "the first concept layer is deliberately deduplicated");
  assert.equal(workSlugs.size, seedCorpus.works.length, "work candidates have unique slugs");
  assert.equal(conceptSlugs.size, seedCorpus.concepts.length, "concept candidates have unique slugs");

  for (const work of seedCorpus.works) {
    assert.ok(work.title.trim() && work.authors.length > 0 && work.year > 0, `${work.slug} has a bibliographic record`);
    assert.ok(isWorkContent(work.content.en), `${work.slug} has the full work content contract`);
  }
  for (const concept of seedCorpus.concepts) {
    assert.ok(concept.termEn.trim() && concept.definitionEn.trim(), `${concept.slug} has a precise definition`);
    assert.ok(isConceptContent(concept.content.en), `${concept.slug} has the full concept content contract`);
    assert.ok(concept.content.en.related_works.every((entry) => workSlugs.has(entry.work_slug)), `${concept.slug} links reviewed works`);
    assert.ok(concept.content.en.theory_variations.every((entry) => theorySlugs.has(entry.theory_slug)), `${concept.slug} links published theories`);
  }

  const relatedWorkSlugs = new Set(seedCorpus.concepts.flatMap((concept) => concept.content.en.related_works.map((entry) => entry.work_slug)));
  assert.deepEqual(relatedWorkSlugs, workSlugs, "every published work has at least one non-duplicative concept relation");
  const relationalResourceAccess = seedCorpus.concepts.find((concept) => concept.slug === "relational-resource-access");
  assert.ok(relationalResourceAccess && isConceptContent(relationalResourceAccess.content.en));
  assert.deepEqual(new Set(relationalResourceAccess.content.en.theory_variations.map((entry) => entry.relationship)), new Set(["Coleman and Lin formulations", "Bourdieu tradition"]), "the shared social-capital concept distinguishes its traditions");
  assert.deepEqual(new Set(relationalResourceAccess.content.en.related_works.map((entry) => entry.relationship)), new Set(["Core source work", "Coleman formulation", "Bourdieu tradition source"]), "the shared social-capital concept retains source-work qualifiers");

  assert.ok(new Set(seedCorpus.theoryWorks.map((entry) => entry.theorySlug)).size === 12, "every existing theory has at least one reviewed work relationship");
  assert.deepEqual(new Set(seedCorpus.theoryWorks.map((entry) => entry.workSlug)), workSlugs, "every work has a theory relationship");
  assert.equal(new Set(seedCorpus.theoryWorks.map((entry) => `${entry.theorySlug}:${entry.workSlug}`)).size, seedCorpus.theoryWorks.length, "theory-work relationships are unique");
  assert.ok(seedCorpus.theoryWorks.every((entry) => theorySlugs.has(entry.theorySlug) && workSlugs.has(entry.workSlug) && entry.sourceUrls.length > 0 && entry.evidenceNotesEn.trim()), "theory-work relationships are evidenced");
  assert.ok(seedCorpus.theoryWorks.some((entry) => entry.workSlug === "practice-capital-1986" && entry.theorySlug === "social-capital-theory" && entry.relationship === "tradition_source"), "Bourdieu's social-capital relation retains its tradition qualifier");
  assert.ok(seedCorpus.theoryWorks.some((entry) => entry.workSlug === "unesco-2020-inclusion-education" && entry.relationship === "institutional_context_source"), "the UNESCO report remains an institutional context source");
  assert.ok(seedCorpus.theoryWorks.some((entry) => entry.workSlug === "equity-sen-1992" && entry.relationship === "normative_resource"), "Sen remains a normative resource rather than a sole equity definition");
  assert.ok(seedCorpus.theoryConcepts.length >= seedCorpus.concepts.length, "every concept has at least one published theory relationship");
  assert.ok(seedCorpus.theoryConcepts.every((entry) => theorySlugs.has(entry.theorySlug) && conceptSlugs.has(entry.conceptSlug)), "theory-concept relationships resolve");
});

test("C5 detail routes render their audited content rather than generic placeholders", () => {
  for (const route of ["../src/app/works/[slug]/page.tsx", "../src/app/concepts/[slug]/page.tsx"]) {
    const source = readFileSync(new URL(route, import.meta.url), "utf8");
    assert.match(source, /sourceItemsForEntity/, `${route} passes verified sources to the page`);
    assert.doesNotMatch(source, /being prepared|Verification pending/i, `${route} has no generic placeholder copy`);
  }
});

test("the existing scholar pages satisfy the C6 evidence and attribution contract", () => {
  const expectedSlugs = ["glen-h-elder-jr", "geert-kelchtermans", "anthony-giddens", "pierre-bourdieu", "jean-lave", "etienne-wenger", "michael-lipsky", "john-w-kingdon", "ivor-f-goodson", "christopher-day"];
  const secondDraftSlugs = ["ivor-f-goodson", "christopher-day"];
  const theorySlugs = new Set(seedCorpus.theories.map((theory) => theory.slug));
  const workSlugs = new Set(seedCorpus.works.map((work) => work.slug));

  assert.deepEqual(seedCorpus.scholars.map((scholar) => scholar.slug), expectedSlugs);
  for (const scholar of seedCorpus.scholars) {
    assert.ok(isScholarContent(scholar.content.en), `${scholar.slug} has a complete scholar profile`);
    assert.ok(scholar.content.en.theory_relationships.every((entry) => theorySlugs.has(entry.theory_slug)), `${scholar.slug} only relates published theories`);
    assert.ok(scholar.content.en.representative_works.every((entry) => !entry.work_slug || workSlugs.has(entry.work_slug)), `${scholar.slug} only links reviewed works`);
    assert.ok(scholar.content.en.attribution_boundaries.length > 0, `${scholar.slug} states an attribution boundary`);
    assert.deepEqual(new Set(scholar.content.en.verification.map((entry) => entry.evidence_level)), new Set(["L1", "L2", "L3"]), `${scholar.slug} separates L1/L2/L3`);
  }
  for (const slug of secondDraftSlugs) {
    const scholar = seedCorpus.scholars.find((entry) => entry.slug === slug);

    assert.equal(scholar?.status, "draft", `${slug} remains draft pending claim-level review`);
    assert.equal(scholar?.publishedAt, undefined, `${slug} does not author a publication date`);
    assert.ok(scholar && isScholarContent(scholar.content.en), `${slug} has complete draft scholar content`);
  }

  const source = readFileSync(new URL("../src/app/scholars/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(source, /isScholarContent/);
  assert.match(source, /sourceItemsForEntity/);
  assert.doesNotMatch(source, /being prepared|Verification pending/i);
});

test("C7 topics, disciplines, and fields provide sourced theory-selection pathways", () => {
  const roles = new Set(["primary", "supporting", "not_recommended"]);
  assert.equal(seedCorpus.topics.length, 8);
  assert.equal(seedCorpus.disciplines.length, 2);
  assert.equal(seedCorpus.fields.length, 6);

  for (const item of [...seedCorpus.topics, ...seedCorpus.disciplines, ...seedCorpus.fields]) {
    const content = item.content.en;
    assert.ok(content.question_categories.length >= 3, `${item.slug} classifies research questions`);
    assert.ok(content.selection_path.length >= 3, `${item.slug} provides a selection path`);
    assert.deepEqual(new Set(content.theory_pathways.map((pathway) => pathway.role)), roles, `${item.slug} distinguishes primary, supporting, and non-primary routes`);
    assert.ok(content.theory_pathways.every((pathway) => pathway.source_ids.length > 0 && pathway.data_materials.trim() && pathway.analysis_unit.trim() && pathway.limitations.trim()), `${item.slug} compares evidence needs and boundaries`);
    assert.ok(content.sources.length > 0 && content.verification.some((entry) => entry.evidence_level === "L1"), `${item.slug} publishes source-backed verification`);
  }
  for (const item of [...seedCorpus.disciplines, ...seedCorpus.fields]) {
    assert.deepEqual(new Set(item.content.en.entry_points.map((entry) => entry.entity_type).filter((type) => ["topic", "theory", "scholar", "work", "concept"].includes(type))), new Set(["topic", "theory", "scholar", "work", "concept"]), `${item.slug} provides all required entity entry types`);
  }

  for (const route of ["../src/app/topics/[slug]/page.tsx", "../src/app/disciplines/[slug]/page.tsx", "../src/app/fields/[slug]/page.tsx"]) {
    const source = readFileSync(new URL(route, import.meta.url), "utf8");
    assert.match(source, /pathwayContentFromPayload/, `${route} rejects malformed pathway content`);
    assert.match(source, /sourceItemsForEntity/, `${route} displays pathway sources`);
    assert.match(source, /PathwayContentSections/, `${route} renders the theory-selection path`);
    assert.doesNotMatch(source, /being prepared|Verification pending/i, `${route} has no C7 placeholder copy`);
  }
});

test("the four enrichment topics remain draft while satisfying the complete pathway and traceability contract", () => {
  const enrichmentTopicSlugs = new Set([
    "teacher-professional-learning-and-change",
    "education-policy-implementation-frontline-discretion",
    "access-to-educational-support-and-opportunity",
    "communities-of-practice-in-teacher-learning",
  ]);
  const roles = new Set(["primary", "supporting", "not_recommended"]);

  for (const topic of seedCorpus.topics.filter((entry) => enrichmentTopicSlugs.has(entry.slug))) {
    assert.equal(topic.status, "draft", `${topic.slug} remains draft pending claim-level review`);
    assert.equal(topic.publishedAt, undefined, `${topic.slug} does not author a publication date`);
    assert.ok(isPathwayContent(topic.content.en), `${topic.slug} has complete pathway content`);
    assert.deepEqual(new Set(topic.content.en.theory_pathways.map((entry) => entry.role)), roles, `${topic.slug} has all three pathways`);
    assert.deepEqual(new Set(topic.content.en.verification.map((entry) => entry.evidence_level)), new Set(["L1", "L2", "L3"]), `${topic.slug} separates source, editorial, and research guidance`);

    for (const relation of seedCorpus.topicTheories.filter((entry) => entry.topicSlug === topic.slug)) {
      const theorySources = new Set(seedCorpus.theories.find((theory) => theory.slug === relation.theorySlug)?.content.en.sources?.map((source) => source.url));
      assert.ok(relation.sourceUrls.every((url) => theorySources.has(url)), `${topic.slug}:${relation.theorySlug} retains a theory source URL`);
      assert.match(relation.evidenceNotesEn, /editorial/i, `${topic.slug}:${relation.theorySlug} describes fit as editorial`);
    }
  }

  assert.equal(seedCorpus.topics.filter((entry) => enrichmentTopicSlugs.has(entry.slug)).length, 4);
  assert.ok(!seedCorpus.disciplines.some((entry) => entry.status === "published" && ["psychology", "management"].includes(entry.slug)));
  assert.ok(!seedCorpus.fields.some((entry) => entry.status === "published" && ["psychology", "management"].includes(entry.disciplineSlug)));
});

test("published pathways cannot advertise draft entry points, while draft pathways may retain authoring references", () => {
  const publishedCorpus = structuredClone(seedCorpus);
  const publishedOwner = publishedCorpus.topics.find((topic) => topic.status === "published");

  assert.ok(publishedOwner, "the test corpus includes a published topic pathway");
  publishedOwner.content.en.entry_points[0] = {
    ...publishedOwner.content.en.entry_points[0],
    entity_type: "scholar",
    slug: "john-w-kingdon",
  };

  assert.ok(
    validateSeedCorpus(publishedCorpus).errors.includes(
      `${publishedOwner.slug}: published pathway entry point scholar:john-w-kingdon is not published`,
    ),
  );

  const draftCorpus = structuredClone(seedCorpus);
  const draftOwner = draftCorpus.topics.find((topic) => topic.status === "draft");

  assert.ok(draftOwner, "the test corpus includes a draft topic pathway");
  draftOwner.content.en.entry_points[0] = {
    ...draftOwner.content.en.entry_points[0],
    entity_type: "scholar",
    slug: "john-w-kingdon",
  };
  assert.ok(
    !validateSeedCorpus(draftCorpus).errors.includes(
      `${draftOwner.slug}: published pathway entry point scholar:john-w-kingdon is not published`,
    ),
  );
});

test("published pathways cannot render draft theories from categories or theory pathways, while draft owners may retain them", () => {
  for (const referenceKind of ["question category", "theory pathway"] as const) {
    const corpus = structuredClone(seedCorpus);
    const owner = corpus.topics.find((topic) => topic.status === "published");

    assert.ok(owner, "the test corpus includes a published topic pathway");
    const targetSlug = referenceKind === "question category"
      ? owner.content.en.question_categories.flatMap((category) => category.theory_slugs)[0]
      : owner.content.en.theory_pathways[0]?.theory_slug;
    const target = corpus.theories.find((theory) => theory.slug === targetSlug);

    assert.ok(targetSlug, `${referenceKind} has a Theory reference`);
    assert.ok(target, `${referenceKind} Theory reference resolves`);
    target.status = "draft";
    delete target.publishedAt;

    const expectedError = referenceKind === "question category"
      ? `${owner.slug}: published pathway category theory ${target.slug} is not published`
      : `${owner.slug}: published pathway theory ${target.slug} is not published`;
    assert.ok(validateSeedCorpus(corpus).errors.includes(expectedError), expectedError);
  }

  const draftCorpus = structuredClone(seedCorpus);
  const draftOwner = draftCorpus.topics.find((topic) => topic.status === "draft");

  assert.ok(draftOwner, "the test corpus includes a draft topic pathway");
  const draftTheorySlug = draftOwner.content.en.theory_pathways[0]?.theory_slug;
  const draftTheory = draftCorpus.theories.find((theory) => theory.slug === draftTheorySlug);
  assert.ok(draftTheorySlug, "the draft owner has an internal Theory reference");
  assert.ok(draftTheory, "the draft owner's Theory reference resolves");
  draftTheory.status = "draft";
  delete draftTheory.publishedAt;

  assert.ok(
    !validateSeedCorpus(draftCorpus).errors.some(
      (error) => error.includes(draftOwner.slug) && error.includes(draftTheory.slug) && error.includes("not published"),
    ),
    "draft owners may retain internal references to draft Theories",
  );
});

test("canonical genealogy requires published source and target endpoints", () => {
  for (const endpoint of ["source", "target"] as const) {
    const statuses = endpoint === "source" ? (["draft"] as const) : (["draft", "archived"] as const);
    for (const status of statuses) {
      const corpus = structuredClone(seedCorpus);
      const relation = corpus.genealogy[0];
      const endpointSlug = endpoint === "source" ? relation.sourceSlug : relation.targetSlug;
      const target = corpus.theories.find((theory) => theory.slug === endpointSlug);

      assert.ok(target, `canonical genealogy ${endpoint} endpoint resolves`);
      target.status = status;
      delete target.publishedAt;

      const expectedError = endpoint === "source"
        ? `${relation.id}: canonical genealogy source theory ${endpointSlug} is not published`
        : `${relation.id}: published genealogy target theory ${endpointSlug} is not published`;
      assert.ok(
        validateSeedCorpus(corpus).errors.includes(expectedError),
        `${relation.id} rejects a ${status} ${endpoint} endpoint with the exact error`,
      );
    }
  }
});

test("every direct public corpus link rejects draft and archived targets", () => {
  type UnavailableStatus = "draft" | "archived";
  type MutationCase = {
    name: string;
    mutate: (corpus: SeedCorpus, status: UnavailableStatus) => string;
  };
  const makeUnavailable = (
    record: { status: "draft" | "published" | "archived"; publishedAt?: string },
    status: UnavailableStatus,
  ) => {
    record.status = status;
    delete record.publishedAt;
  };
  const cases: MutationCase[] = [
    {
      name: "theory-work",
      mutate(corpus, status) {
        const relation = corpus.theoryWorks.find((entry) => (
          corpus.theories.some((theory) => theory.slug === entry.theorySlug && theory.status === "published")
          && corpus.works.some((work) => work.slug === entry.workSlug && work.status === "published")
        ));
        assert.ok(relation);
        const target = corpus.works.find((work) => work.slug === relation.workSlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `theory-work relation ${relation.theorySlug}:${relation.workSlug}: published theory target work ${relation.workSlug} is not published`;
      },
    },
    {
      name: "theory-content genealogy",
      mutate(corpus, status) {
        const owner = corpus.theories.find((theory) => theory.status === "published" && theory.content.en.genealogy.length > 0);
        assert.ok(owner);
        const targetSlug = owner.content.en.genealogy[0].related_theory;
        const target = corpus.theories.find((theory) => theory.slug === targetSlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `${owner.slug}: published theory content genealogy target ${targetSlug} is not published`;
      },
    },
    {
      name: "concept related work",
      mutate(corpus, status) {
        const owner = corpus.concepts.find((concept) => concept.status === "published" && concept.content.en.related_works.some((entry) => !isFAN133U3Archived("work", entry.work_slug)));
        assert.ok(owner);
        const targetSlug = owner.content.en.related_works.find((entry) => !isFAN133U3Archived("work", entry.work_slug))?.work_slug;
        assert.ok(targetSlug);
        const target = corpus.works.find((work) => work.slug === targetSlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `${owner.slug}: published concept related work ${targetSlug} is not published`;
      },
    },
    {
      name: "concept theory variation",
      mutate(corpus, status) {
        const owner = corpus.concepts.find((concept) => concept.status === "published" && concept.content.en.theory_variations.length > 0);
        assert.ok(owner);
        const targetSlug = owner.content.en.theory_variations[0].theory_slug;
        const target = corpus.theories.find((theory) => theory.slug === targetSlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `${owner.slug}: published concept theory variation ${targetSlug} is not published`;
      },
    },
    {
      name: "concept related scholar",
      mutate(corpus, status) {
        const owner = corpus.concepts.find((concept) => concept.status === "published" && concept.content.en.related_scholars.some((scholar) => (
          scholar.scholar_slug && corpus.scholars.some((target) => target.slug === scholar.scholar_slug && target.status === "published")
        )));
        assert.ok(owner);
        const targetSlug = owner.content.en.related_scholars.find((scholar) => scholar.scholar_slug)?.scholar_slug;
        const target = corpus.scholars.find((scholar) => scholar.slug === targetSlug);
        assert.ok(targetSlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `${owner.slug}: published concept related scholar ${targetSlug} is not published`;
      },
    },
    {
      name: "scholar theory",
      mutate(corpus, status) {
        const owner = corpus.scholars.find((scholar) => scholar.status === "published" && scholar.content.en.theory_relationships.length > 0);
        assert.ok(owner);
        const targetSlug = owner.content.en.theory_relationships[0].theory_slug;
        const target = corpus.theories.find((theory) => theory.slug === targetSlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `${owner.slug}: published scholar theory ${targetSlug} is not published`;
      },
    },
    {
      name: "scholar representative work",
      mutate(corpus, status) {
        const owner = corpus.scholars.find((scholar) => scholar.status === "published" && scholar.content.en.representative_works.some((work) => work.work_slug));
        assert.ok(owner);
        const targetSlug = owner.content.en.representative_works.find((work) => work.work_slug)?.work_slug;
        const target = corpus.works.find((work) => work.slug === targetSlug);
        assert.ok(targetSlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `${owner.slug}: published scholar representative work ${targetSlug} is not published`;
      },
    },
    {
      name: "topic pathway category theory",
      mutate(corpus, status) {
        const owner = corpus.topics.find((topic) => topic.status === "published");
        assert.ok(owner);
        const targetSlug = owner.content.en.question_categories.flatMap((category) => category.theory_slugs)[0];
        const target = corpus.theories.find((theory) => theory.slug === targetSlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `${owner.slug}: published pathway category theory ${targetSlug} is not published`;
      },
    },
    {
      name: "topic pathway theory",
      mutate(corpus, status) {
        const owner = corpus.topics.find((topic) => topic.status === "published");
        assert.ok(owner);
        const targetSlug = owner.content.en.theory_pathways[0].theory_slug;
        const target = corpus.theories.find((theory) => theory.slug === targetSlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `${owner.slug}: published pathway theory ${targetSlug} is not published`;
      },
    },
    ...(["topic", "field", "theory", "scholar", "work", "concept"] as const).map((entityType): MutationCase => ({
      name: `pathway entry-point ${entityType}`,
      mutate(corpus, status) {
        const owner = [...corpus.disciplines, ...corpus.fields, ...corpus.topics].find((entry) => (
          entry.status === "published"
          && entry.content.en.entry_points.some((candidate) => candidate.entity_type === entityType
            && (candidate.entity_type !== "work" && candidate.entity_type !== "concept"
              || !isFAN133U3Archived(candidate.entity_type, candidate.slug)))
        ));
        assert.ok(owner, `the corpus has a published pathway with a ${entityType} entry point`);
        const entry = owner.content.en.entry_points.find((candidate) => candidate.entity_type === entityType
          && (candidate.entity_type !== "work" && candidate.entity_type !== "concept"
            || !isFAN133U3Archived(candidate.entity_type, candidate.slug)));
        assert.ok(entry);
        const target = entityType === "topic" ? corpus.topics.find((candidate) => candidate.slug === entry.slug)
          : entityType === "field" ? corpus.fields.find((candidate) => candidate.slug === entry.slug)
            : entityType === "theory" ? corpus.theories.find((candidate) => candidate.slug === entry.slug)
              : entityType === "scholar" ? corpus.scholars.find((candidate) => candidate.slug === entry.slug)
                : entityType === "work" ? corpus.works.find((candidate) => candidate.slug === entry.slug)
                  : corpus.concepts.find((candidate) => candidate.slug === entry.slug);
        assert.ok(target, `${entityType} entry point resolves`);
        assert.equal(target.status, "published", `${entityType} entry point starts published`);
        makeUnavailable(target, status);
        return `${owner.slug}: published pathway entry point ${entityType}:${entry.slug} is not published`;
      },
    })),
    {
      name: "topic-theory relation",
      mutate(corpus, status) {
        const relation = corpus.topicTheories.find((entry) => corpus.topics.some((topic) => topic.slug === entry.topicSlug && topic.status === "published"));
        assert.ok(relation);
        const target = corpus.theories.find((theory) => theory.slug === relation.theorySlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `topic-theory relation ${relation.topicSlug}:${relation.theorySlug}: published topic target theory ${relation.theorySlug} is not published`;
      },
    },
    {
      name: "canonical genealogy",
      mutate(corpus, status) {
        const relation = corpus.genealogy.find((entry) => corpus.theories.some((theory) => theory.slug === entry.sourceSlug && theory.status === "published"));
        assert.ok(relation);
        const target = corpus.theories.find((theory) => theory.slug === relation.targetSlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `${relation.id}: published genealogy target theory ${relation.targetSlug} is not published`;
      },
    },
    {
      name: "theory-concept relation",
      mutate(corpus, status) {
        const relation = corpus.theoryConcepts.find((entry) => (
          corpus.theories.some((theory) => theory.slug === entry.theorySlug && theory.status === "published")
          && !isFAN133U3Archived("concept", entry.conceptSlug)
        ));
        assert.ok(relation);
        const target = corpus.concepts.find((concept) => concept.slug === relation.conceptSlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `theory-concept relation ${relation.theorySlug}:${relation.conceptSlug}: published theory target concept ${relation.conceptSlug} is not published`;
      },
    },
    {
      name: "theory-scholar relation",
      mutate(corpus, status) {
        const relation = corpus.theoryScholars.find((entry) => (
          corpus.theories.some((theory) => theory.slug === entry.theorySlug && theory.status === "published")
          && corpus.scholars.some((scholar) => scholar.slug === entry.scholarSlug && scholar.status === "published")
        ));
        assert.ok(relation);
        const target = corpus.scholars.find((scholar) => scholar.slug === relation.scholarSlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `theory-scholar relation ${relation.theorySlug}:${relation.scholarSlug}: published theory target scholar ${relation.scholarSlug} is not published`;
      },
    },
    {
      name: "discipline-theory relation",
      mutate(corpus, status) {
        const relation = corpus.disciplineTheories.find((entry) => corpus.disciplines.some((discipline) => discipline.slug === entry.disciplineSlug && discipline.status === "published"));
        assert.ok(relation);
        const target = corpus.theories.find((theory) => theory.slug === relation.theorySlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `discipline-theory relation ${relation.disciplineSlug}:${relation.theorySlug}: published discipline target theory ${relation.theorySlug} is not published`;
      },
    },
    {
      name: "field-theory relation",
      mutate(corpus, status) {
        const relation = corpus.fieldTheories.find((entry) => corpus.fields.some((field) => field.slug === entry.fieldSlug && field.status === "published"));
        assert.ok(relation);
        const target = corpus.theories.find((theory) => theory.slug === relation.theorySlug);
        assert.ok(target);
        makeUnavailable(target, status);
        return `field-theory relation ${relation.fieldSlug}:${relation.theorySlug}: published field target theory ${relation.theorySlug} is not published`;
      },
    },
  ];

  for (const mutationCase of cases) {
    for (const status of ["draft", "archived"] as const) {
      const corpus = structuredClone(seedCorpus);
      const expectedError = mutationCase.mutate(corpus, status);
      assert.ok(
        validateSeedCorpus(corpus).errors.includes(expectedError),
        `${mutationCase.name} rejects a ${status} target`,
      );
    }
  }
});

test("a draft owner may retain an authoring reference to a draft target", () => {
  const corpus = structuredClone(seedCorpus);
  const draftOwner = structuredClone(corpus.concepts[0]);
  const draftTarget = corpus.scholars.find((scholar) => scholar.status === "draft");

  assert.ok(draftTarget, "the corpus includes a draft scholar target");
  draftOwner.slug = "draft-concept-authoring-control";
  draftOwner.termEn = "Draft concept authoring control";
  draftOwner.status = "draft";
  delete draftOwner.publishedAt;
  draftOwner.content.en.related_scholars = [{
    name: draftTarget.name,
    scholar_slug: draftTarget.slug,
    relevance: "Draft authoring reference.",
  }];
  corpus.concepts.push(draftOwner);

  assert.ok(
    !validateSeedCorpus(corpus).errors.includes(
      `${draftOwner.slug}: published concept related scholar ${draftTarget.slug} is not published`,
    ),
  );
});
