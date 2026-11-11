import assert from "node:assert/strict";
import test from "node:test";

import { seedCorpus } from "../src/data/seed-content.ts";
import {
  P1_FLAGSHIP_DISCIPLINE_THEORIES,
  P1_FLAGSHIP_DRAFT_SCHOLAR_SLUGS,
  P1_FLAGSHIP_DRAFT_THEORY_SLUGS,
  P1_FLAGSHIP_DRAFT_VERIFIED_AT,
  P1_FLAGSHIP_DRAFT_WORK_SLUG,
  P1_FLAGSHIP_PUBLISHED_AT,
} from "../src/data/corpus/content-batches/2026-11-10-p1-flagship-drafts.ts";
import { isScholarContent } from "../src/data/templates/scholar-template.ts";
import { isWorkContent } from "../src/data/templates/knowledge-entity-template.ts";
import { isTheoryContent } from "../src/data/templates/theory-template.ts";

const verbatimFragments = [
  "The studies considered in this review",
  "Four essential features of teachers",
  "This book presents a theory of learning that starts with the assumption",
  "In this important theoretical treatist",
  "In this highly acclaimed work first published in 1974",
  "push forward the notion of situated learning",
];

test("P1 flagship items 1-8 are published and item 9 is absent", () => {
  const theories = P1_FLAGSHIP_DRAFT_THEORY_SLUGS.map((slug) => {
    const theory = seedCorpus.theories.find((entry) => entry.slug === slug);
    assert.ok(theory, slug);
    assert.equal(theory.status, "published");
    assert.equal(theory.publishedAt, P1_FLAGSHIP_PUBLISHED_AT);
    assert.equal(theory.primary, false);
    assert.equal(theory.depth, "D2");
    assert.ok(isTheoryContent(theory.content.en, theory.depth));
    return theory;
  });
  assert.deepEqual(theories.map((theory) => theory.titleEn), [
    "Teacher professional identity",
    "Communities of practice",
    "Situated learning / legitimate peripheral participation",
    "Life course perspective",
  ]);

  const scholars = P1_FLAGSHIP_DRAFT_SCHOLAR_SLUGS.map((slug) => {
    const scholar = seedCorpus.scholars.find((entry) => entry.slug === slug);
    assert.ok(scholar, slug);
    assert.equal(scholar.status, "published");
    assert.equal(scholar.publishedAt, P1_FLAGSHIP_PUBLISHED_AT);
    assert.ok(isScholarContent(scholar.content.en));
    return scholar;
  });
  assert.deepEqual(scholars.map((scholar) => scholar.name), [
    "Douwe Beijaard",
    "Etienne Wenger",
    "Glen H. Elder, Jr.",
  ]);

  const work = seedCorpus.works.find((entry) => entry.slug === P1_FLAGSHIP_DRAFT_WORK_SLUG);
  assert.ok(work);
  assert.equal(work.status, "published");
  assert.equal(work.publishedAt, P1_FLAGSHIP_PUBLISHED_AT);
  assert.equal(work.title, "Reconsidering research on teachers' professional identity");
  assert.ok(isWorkContent(work.content.en));

  assert.equal(seedCorpus.scholars.filter((scholar) => scholar.slug === "jean-lave").length, 1);
  assert.equal(seedCorpus.scholars.find((scholar) => scholar.slug === "jean-lave")?.status, "archived");
  assert.equal(seedCorpus.theories.filter((theory) => theory.slug === "multiple-streams-framework").length, 1);
  assert.equal(seedCorpus.theories.find((theory) => theory.slug === "multiple-streams-framework")?.status, "archived");
  assert.equal(seedCorpus.theories.some((theory) => theory.slug.includes("agenda-setting")), false);
  assert.deepEqual(
    seedCorpus.theories.filter((theory) => theory.status === "published").map((theory) => theory.slug),
    [...P1_FLAGSHIP_DRAFT_THEORY_SLUGS, "multiple-streams-education-policy"],
  );
  assert.deepEqual(
    seedCorpus.scholars.filter((scholar) => scholar.status === "published").map((scholar) => scholar.slug),
    [...P1_FLAGSHIP_DRAFT_SCHOLAR_SLUGS, "jean-lave-flagship"],
  );
  assert.deepEqual(
    seedCorpus.works.filter((entry) => entry.status === "published").map((entry) => entry.slug),
    [
      P1_FLAGSHIP_DRAFT_WORK_SLUG,
      "wenger-1998-communities-of-practice",
      "lave-and-wenger-1991-situated-learning",
      "elder-children-of-the-great-depression",
    ],
  );
  for (const link of P1_FLAGSHIP_DISCIPLINE_THEORIES) {
    assert.ok(
      seedCorpus.disciplineTheories.some((entry) => entry.disciplineSlug === link.disciplineSlug && entry.theorySlug === link.theorySlug),
      `${link.disciplineSlug}:${link.theorySlug}`,
    );
  }
});

test("P1 drafts paraphrase ledger sources and keep a claim ledger", () => {
  const records = [
    ...seedCorpus.theories.filter((theory) => (P1_FLAGSHIP_DRAFT_THEORY_SLUGS as readonly string[]).includes(theory.slug)),
    ...seedCorpus.scholars.filter((scholar) => (P1_FLAGSHIP_DRAFT_SCHOLAR_SLUGS as readonly string[]).includes(scholar.slug)),
    seedCorpus.works.find((work) => work.slug === P1_FLAGSHIP_DRAFT_WORK_SLUG),
  ];
  const serialized = JSON.stringify(records);
  for (const fragment of verbatimFragments) {
    assert.equal(serialized.includes(fragment), false, fragment);
  }
  assert.equal(serialized.includes("cited_by_count"), false);
  assert.doesNotMatch(serialized, /cited \d|citations?: \d/i);

  const identity = seedCorpus.theories.find((theory) => theory.slug === "teacher-professional-identity");
  const urls = new Set(identity?.content.en.sources?.map((source) => source.url));
  assert.ok(urls?.has("https://doi.org/10.1016/j.tate.2003.07.001"));
  assert.ok(urls?.has("https://scholarlypublications.universiteitleiden.nl/handle/1887/11190"));
  assert.ok(urls?.has("https://api.crossref.org/works/10.1016/j.tate.2003.07.001"));

  const beijaard = seedCorpus.scholars.find((scholar) => scholar.slug === "douwe-beijaard");
  const beijaardUrls = beijaard?.content.en.sources.map((source) => source.url) ?? [];
  assert.ok(beijaardUrls.includes("https://research.tue.nl/p/en/persons/douwe-beijaard"));
  assert.ok(beijaardUrls.includes("https://pub.orcid.org/v3.0/0000-0002-0065-1810"));

  const lifeCourse = seedCorpus.theories.find((theory) => theory.slug === "life-course-perspective");
  const lifeUrls = lifeCourse?.content.en.sources?.map((source) => source.url) ?? [];
  assert.ok(lifeUrls.includes("https://doi.org/10.4324/9780429501739"));
  assert.ok(lifeUrls.includes("https://www.routledge.com/Children-Of-The-Great-Depression-25th-Anniversary-Edition/Elder/p/book/9780813333427"));
  assert.ok(lifeUrls.includes("https://link.springer.com/chapter/10.1007/978-0-306-48247-2_8"));

  for (const theory of seedCorpus.theories.filter((entry) => (P1_FLAGSHIP_DRAFT_THEORY_SLUGS as readonly string[]).includes(entry.slug))) {
    const l1 = theory.content.en.verification?.filter((entry) => entry.evidence_level === "L1") ?? [];
    assert.ok(l1.length > 0, theory.slug);
    assert.ok(l1.every((entry) => entry.claimId && entry.fieldPath && entry.locator && entry.verifiedAt === P1_FLAGSHIP_DRAFT_VERIFIED_AT), theory.slug);
    assert.ok(theory.content.en.verification?.some((entry) => entry.evidence_level === "L2"));
    assert.ok(theory.content.en.verification?.some((entry) => entry.evidence_level === "L3"));
  }

  const lifeCourseText = JSON.stringify(lifeCourse?.content.en);
  assert.equal(lifeCourseText.includes("punctuate"), false);
  assert.equal(lifeCourseText.includes("breaks off"), false);
  assert.equal(lifeCourseText.includes("well-traveled"), false);
  assert.doesNotMatch(serialized, /Human review has not accepted/);

  const reviewedRows = records.flatMap((record) => record && "content" in record ? record.content.en.verification ?? [] : []);
  assert.ok(reviewedRows.length > 0);
  assert.ok(reviewedRows.every((entry) => entry.reviewerRole === "publication_editor" && entry.reviewDecision === "approved"));
  assert.ok(reviewedRows.filter((entry) => entry.evidence_level === "L2").every((entry) => entry.contentNature === "editorial_synthesis" && entry.status === "editorial"));
  assert.ok(reviewedRows.filter((entry) => entry.evidence_level === "L3").every((entry) => (
    entry.contentNature === "research_guidance" && entry.status === "proposed" && entry.evidence_level === "L3"
  )));
});
