import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { seedCorpus } from "./helpers/public-seed-corpus.ts";
import { isScholarContent } from "../src/data/templates/scholar-template.ts";
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
    theoryScholars: 7,
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

test("embedded Life Course evidence dates stay on their rows without promoting the page source record", () => {
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
    undefined,
    "the page-field legacy source metadata record does not aggregate embedded evidence dates",
  );
  assert.equal(seedCorpus.verifications.filter((entry) => entry.level === "L1_verified").length, 12);
  assert.ok(
    seedCorpus.verifications
      .filter((entry) => entry.level === "L1_verified")
      .every((entry) => entry.verifiedAt === undefined),
    "all twelve legacy source metadata records omit a page-level verification date",
  );
});

test("publication, batch, file, and commit dates cannot become legacy source metadata verification dates", () => {
  const entitiesSource = readFileSync("src/data/corpus/shared/entities.ts", "utf8");

  assert.ok(seedCorpus.verifications.every((entry) => entry.verifiedAt === undefined));
  assert.doesNotMatch(entitiesSource, /entry\.publishedAt\s*\?\?/);
  assert.doesNotMatch(entitiesSource, /verificationDates|latestPageVerificationDate/);
  assert.doesNotMatch(
    entitiesSource,
    /fieldPath:\s*"content_jsonb\.en\.sources"[\s\S]{0,300}verifiedAt:/,
  );
});

test("the two U0 bibliographic corrections match the authoritative records without changing short labels", () => {
  const teacherIdentity = seedCorpus.theories
    .find((theory) => theory.slug === "teacher-identity-theory")
    ?.content.en.sources?.find((source) => source.id === "kelchtermans-2009-teacher-identity");
  const kelchtermansWork = seedCorpus.works.find((work) => work.slug === "kelchtermans-2009-teacher-identity");
  const multipleStreamsHerweg = seedCorpus.theories
    .find((theory) => theory.slug === "multiple-streams-framework")
    ?.content.en.sources?.find((source) => source.id === "msf-herweg-etal-2018");

  assert.equal(
    teacherIdentity?.citation,
    "Kelchtermans, G. (2009). Who I am in how I teach is the message: self-understanding, vulnerability and reflection. Teachers and Teaching, 15(2), 257–272.",
  );
  assert.equal(
    kelchtermansWork?.title,
    "Who I am in how I teach is the message: self-understanding, vulnerability and reflection",
  );
  assert.equal(
    multipleStreamsHerweg?.citation,
    "Herweg, N., Zahariadis, N., & Zohlnhöfer, R. (2018). The Multiple Streams Framework: Foundations, Refinements, and Empirical Applications. In C. M. Weible & P. A. Sabatier (Eds.), Theories of the Policy Process (4th ed., pp. 17–53).",
  );
  assert.equal(teacherIdentity?.url, "https://doi.org/10.1080/13540600902875332");
  assert.equal(multipleStreamsHerweg?.url, "https://doi.org/10.4324/9780429494284-2");

  const teacherIdentityTheory = seedCorpus.theories.find((theory) => theory.slug === "teacher-identity-theory");
  assert.equal(
    teacherIdentityTheory?.content.en.key_scholars?.find((scholar) => scholar.name === "Geert Kelchtermans")?.representative_work,
    "Who I Am in How I Teach Is the Message (2009)",
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
  const kingdon = candidates.get("john-w-kingdon");

  assert.equal(candidates.get("jean-lave")?.status, "published");
  assert.equal(candidates.get("etienne-wenger")?.status, "published");
  assert.equal(candidates.get("michael-lipsky")?.status, "published");
  assert.ok(kingdon);
  assert.equal(kingdon.status, "draft");
  assert.ok(isScholarContent(kingdon.content.en));
  assert.deepEqual(
    kingdon.content.en.theory_relationships.map((relation) => relation.theory_slug),
    ["multiple-streams-framework"],
    "Kingdon keeps the draft authoring relationship",
  );
  assert.ok(seedCorpus.theoryScholars.every((entry) => {
    const scholar = candidates.get(entry.scholarSlug);
    const theory = seedCorpus.theories.find((candidate) => candidate.slug === entry.theorySlug);
    return scholar?.status === "published" && theory?.status === "published";
  }), "canonical TheoryScholar relations stay inside the published graph");
  assert.ok(!seedCorpus.disciplines.some((entry) => entry.status === "published" && ["psychology", "management"].includes(entry.slug)));
  assert.ok(!seedCorpus.fields.some((entry) => entry.status === "published" && ["psychology", "management"].includes(entry.disciplineSlug)));
});
