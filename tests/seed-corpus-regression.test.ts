import assert from "node:assert/strict";
import test from "node:test";
import { seedCorpus } from "../src/data/seed-content.ts";
import type { VerificationEntry } from "../src/data/templates/theory-template.ts";
import { validateSeedCorpus } from "../src/lib/content-validation.ts";

test("seed corpus preserves its semantic baseline after module extraction", () => {
  assert.deepEqual({
    disciplines: seedCorpus.disciplines.length,
    fields: seedCorpus.fields.length,
    theories: seedCorpus.theories.length,
    works: seedCorpus.works.length,
    concepts: seedCorpus.concepts.length,
    theoryWorks: seedCorpus.theoryWorks.length,
    theoryConcepts: seedCorpus.theoryConcepts.length,
    disciplineTheories: seedCorpus.disciplineTheories.length,
    fieldTheories: seedCorpus.fieldTheories.length,
    genealogy: seedCorpus.genealogy.length,
    scholars: seedCorpus.scholars.length,
    theoryScholars: seedCorpus.theoryScholars.length,
    topics: seedCorpus.topics.length,
    topicTheories: seedCorpus.topicTheories.length,
    verifications: seedCorpus.verifications.length,
  }, {
    disciplines: 2,
    fields: 6,
    theories: 12,
    works: 19,
    concepts: 24,
    theoryWorks: 21,
    theoryConcepts: 25,
    disciplineTheories: 15,
    fieldTheories: 8,
    genealogy: 8,
    scholars: 10,
    theoryScholars: 10,
    topics: 8,
    topicTheories: 24,
    verifications: 36,
  });
  assert.equal(seedCorpus.scholars.filter((scholar) => scholar.status === "published").length, 7);
  assert.equal(seedCorpus.theoryScholars.filter((relation) => {
    const scholar = seedCorpus.scholars.find((candidate) => candidate.slug === relation.scholarSlug);
    const theory = seedCorpus.theories.find((candidate) => candidate.slug === relation.theorySlug);
    return scholar?.status === "published" && theory?.status === "published";
  }).length, 7);
  assert.equal(seedCorpus.topics.filter((topic) => topic.status === "published").length, 4);
  assert.equal(seedCorpus.topicTheories.filter((relation) => {
    const topic = seedCorpus.topics.find((candidate) => candidate.slug === relation.topicSlug);
    const theory = seedCorpus.theories.find((candidate) => candidate.slug === relation.theorySlug);
    return topic?.status === "published" && theory?.status === "published";
  }).length, 12);
  assert.deepEqual(seedCorpus.theories.map(({ slug }) => slug), [
    "life-course-theory",
    "teacher-identity-theory",
    "structuration-theory",
    "communities-of-practice",
    "practice-theory-bourdieu",
    "social-capital-theory",
    "teacher-professional-development-theory",
    "teacher-life-history-research",
    "educational-equity-theory",
    "institutional-theory",
    "street-level-bureaucracy",
    "multiple-streams-framework",
  ]);
  assert.deepEqual(seedCorpus.genealogy.map(({ id }) => id), [
    "life-course:teacher-life-history",
    "life-course:teacher-development",
    "life-course:teacher-identity",
    "teacher-identity:teacher-development",
    "practice:social-capital",
    "practice:institutional",
    "practice:structuration",
    "street-level:multiple-streams",
  ]);
  assert.deepEqual(seedCorpus.topics.map(({ slug }) => slug), [
    "teachers-professional-identity-during-reform",
    "educational-transitions-over-time",
    "organizational-routines-and-structural-change",
    "inequality-in-educational-and-social-fields",
    "teacher-professional-learning-and-change",
    "education-policy-implementation-frontline-discretion",
    "access-to-educational-support-and-opportunity",
    "communities-of-practice-in-teacher-learning",
  ]);
  assert.deepEqual(seedCorpus.scholars.map(({ slug }) => slug), [
    "glen-h-elder-jr",
    "geert-kelchtermans",
    "anthony-giddens",
    "pierre-bourdieu",
    "jean-lave",
    "etienne-wenger",
    "michael-lipsky",
    "john-w-kingdon",
    "ivor-f-goodson",
    "christopher-day",
  ]);
  assert.deepEqual(validateSeedCorpus(seedCorpus).errors, []);
});

test("Life Course R2 verification dates flow into the persisted L1 seed record", () => {
  const expectedDates = new Map([
    ["elder-1996-human-lives-changing-societies", "2026-07-20T00:00:00.000Z"],
    ["elder-2000-life-course-theory-encyclopedia", "2026-07-20T00:00:00.000Z"],
    ["elder-1999-children-of-the-great-depression-25th", "2026-07-21T00:00:00.000Z"],
  ]);
  const lifeCourse = seedCorpus.theories.find((theory) => theory.slug === "life-course-theory");

  assert.ok(lifeCourse, "life-course-theory is included");
  for (const [sourceId, verifiedAt] of expectedDates) {
    const matchedVerification: VerificationEntry | undefined = lifeCourse.content.en.verification?.find(
      (entry) => entry.evidence_level === "L1" && entry.source_id === sourceId,
    );
    assert.equal(matchedVerification?.verifiedAt, verifiedAt, `${sourceId} retains its evidence review date`);
  }

  const persistedVerification = seedCorpus.verifications.find((entry) => (
    entry.entitySlug === "life-course-theory"
    && entry.fieldPath === "content_jsonb.en.sources"
    && entry.level === "L1_verified"
  ));
  assert.equal(
    persistedVerification?.verifiedAt,
    "2026-07-21T00:00:00.000Z",
    "the persisted source verification uses the latest reviewed source date",
  );
});

test("the first enrichment topics retain their editorial pathways and existing-theory sources", () => {
  const enrichmentTopicSlugs = [
    "teacher-professional-learning-and-change",
    "education-policy-implementation-frontline-discretion",
    "access-to-educational-support-and-opportunity",
    "communities-of-practice-in-teacher-learning",
  ];
  const expectedRoles = new Set(["primary", "supporting", "not_recommended"]);

  for (const slug of enrichmentTopicSlugs) {
    const topic = seedCorpus.topics.find((entry) => entry.slug === slug);
    const relations = seedCorpus.topicTheories.filter((entry) => entry.topicSlug === slug);

    assert.ok(topic, `${slug} exists`);
    assert.equal(topic?.status, "draft", `${slug} remains draft pending claim-level review`);
    assert.equal(topic?.publishedAt, undefined, `${slug} does not author a publication date`);
    assert.deepEqual(new Set(topic?.content.en.theory_pathways.map((entry) => entry.role)), expectedRoles, `${slug} has all pathway roles`);
    assert.equal(relations.length, 3, `${slug} has exactly three topic-theory relations`);
    assert.deepEqual(new Set(relations.map((entry) => entry.recommendation)), expectedRoles, `${slug} has exactly three recommendation roles`);
    const pathwayRoles = new Map(
      topic?.content.en.theory_pathways.map((entry) => [entry.theory_slug, entry.role]),
    );
    const relationRoles = new Map(
      relations.map((entry) => [entry.theorySlug, entry.recommendation]),
    );
    assert.deepEqual(
      [...relationRoles.entries()].sort(([left], [right]) => left.localeCompare(right)),
      [...pathwayRoles.entries()].sort(([left], [right]) => left.localeCompare(right)),
      `${slug} keeps page pathway roles aligned with TopicTheory recommendations`,
    );
    assert.ok(relations.every((entry) => entry.evidenceNotesEn.includes("editorial")), `${slug} marks every fit as editorial`);
    assert.ok(relations.every((entry) => {
      const theory = seedCorpus.theories.find((candidate) => candidate.slug === entry.theorySlug);
      const sourceUrls = new Set(theory?.content.en.sources?.map((source) => source.url));
      return entry.sourceUrls.every((url) => sourceUrls.has(url));
    }), `${slug} uses only source URLs registered by its theory`);
  }
});

test("the enrichment scholars have bounded publication decisions without widening public scope", () => {
  const candidates = new Map(seedCorpus.scholars.map((scholar) => [scholar.slug, scholar]));

  assert.equal(candidates.get("jean-lave")?.status, "published");
  assert.equal(candidates.get("etienne-wenger")?.status, "published");
  assert.equal(candidates.get("michael-lipsky")?.status, "published");
  assert.equal(candidates.get("john-w-kingdon")?.status, "draft");
  assert.ok(seedCorpus.theoryScholars.slice(-4).every((entry) => entry.role === "key_contributor"));
  assert.ok(!seedCorpus.disciplines.some((entry) => entry.status === "published" && ["psychology", "management"].includes(entry.slug)));
  assert.ok(!seedCorpus.fields.some((entry) => entry.status === "published" && ["psychology", "management"].includes(entry.disciplineSlug)));
});
