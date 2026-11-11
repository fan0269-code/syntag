import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { seedCorpus } from "../src/data/seed-content.ts";
import {
  FAN_247_ARCHIVED_CONCEPT_SLUGS,
  FAN_247_ARCHIVED_DISCIPLINE_SLUGS,
  FAN_247_ARCHIVED_FIELD_SLUGS,
  FAN_247_ARCHIVED_PAGE_COUNT,
  FAN_247_ARCHIVED_SCHOLAR_SLUGS,
  FAN_247_ARCHIVED_THEORY_SLUGS,
  FAN_247_ARCHIVED_TOPIC_SLUGS,
  FAN_247_ARCHIVED_WORK_SLUGS,
} from "../src/lib/fan247-visibility.ts";
import { FAN_133_U3_ARCHIVED_CONCEPT_SLUGS, FAN_133_U3_ARCHIVED_WORK_SLUGS } from "../src/lib/u3-visibility.ts";

const targetGroups = [
  ["discipline", FAN_247_ARCHIVED_DISCIPLINE_SLUGS],
  ["field", FAN_247_ARCHIVED_FIELD_SLUGS],
  ["theory", FAN_247_ARCHIVED_THEORY_SLUGS],
  ["work", FAN_247_ARCHIVED_WORK_SLUGS],
  ["concept", FAN_247_ARCHIVED_CONCEPT_SLUGS],
  ["scholar", FAN_247_ARCHIVED_SCHOLAR_SLUGS],
  ["topic", FAN_247_ARCHIVED_TOPIC_SLUGS],
] as const;

const entityRecords = {
  discipline: seedCorpus.disciplines,
  field: seedCorpus.fields,
  theory: seedCorpus.theories,
  work: seedCorpus.works,
  concept: seedCorpus.concepts,
  scholar: seedCorpus.scholars,
  topic: seedCorpus.topics,
};

test("FAN-247 freezes exactly 58 intended-public pages as archived", () => {
  const allSlugs = targetGroups.flatMap(([, slugs]) => slugs);
  assert.equal(allSlugs.length, FAN_247_ARCHIVED_PAGE_COUNT);
  assert.equal(new Set(allSlugs).size, FAN_247_ARCHIVED_PAGE_COUNT);

  for (const [type, slugs] of targetGroups) {
    const targetSlugs = new Set<string>(slugs);
    assert.deepEqual(
      entityRecords[type]
        .filter((record) => targetSlugs.has(record.slug))
        .map((record) => ({ slug: record.slug, status: record.status, publishedAt: record.publishedAt })),
      slugs.map((slug) => ({ slug, status: "archived", publishedAt: undefined })),
      `${type} target state`,
    );
  }
});

test("FAN-247 targets do not include the existing U3 or draft boundaries", () => {
  const targetSlugs: Set<string> = new Set(targetGroups.flatMap(([, slugs]) => [...slugs]));
  assert.deepEqual(
    [...FAN_133_U3_ARCHIVED_WORK_SLUGS, ...FAN_133_U3_ARCHIVED_CONCEPT_SLUGS]
      .filter((slug) => targetSlugs.has(slug)),
    [],
  );

  const drafts = Object.values(entityRecords).flat().filter((record) => record.status === "draft");
  assert.equal(drafts.length, 7);
  assert.ok(drafts.every((record) => !targetSlugs.has(record.slug)));
  assert.ok(drafts.every((record) => record.publishedAt === undefined));
});

test("FAN-247 stays archived while published pages are the flagship set plus the 2026-11-11 cluster", () => {
  const publishedSlugs = [
    "teacher-professional-identity",
    "communities-of-practice-1998",
    "situated-learning-legitimate-peripheral-participation",
    "life-course-perspective",
    "multiple-streams-education-policy",
    "beijaard-meijer-verloop-2004-reconsidering",
    "wenger-1998-communities-of-practice",
    "lave-and-wenger-1991-situated-learning",
    "elder-children-of-the-great-depression",
    "douwe-beijaard",
    "etienne-wenger-flagship",
    "glen-h-elder-jr-flagship",
    "jean-lave-flagship",
  ];
  const originalPublishedAt = "2026-11-10T00:00:00.000Z";
  const clusterPublishedAt = "2026-11-11T00:00:00.000Z";
  const clusterSlugs = new Set([
    "multiple-streams-education-policy",
    "wenger-1998-communities-of-practice",
    "lave-and-wenger-1991-situated-learning",
    "elder-children-of-the-great-depression",
    "jean-lave-flagship",
  ]);
  const publicRecords = Object.values(entityRecords).flat().filter((record) => record.status === "published");
  assert.deepEqual(publicRecords.map((record) => record.slug).sort(), [...publishedSlugs].sort());
  assert.ok(publicRecords.every((record) => record.publishedAt === (clusterSlugs.has(record.slug) ? clusterPublishedAt : originalPublishedAt)));
  assert.equal(seedCorpus.theoryWorks.filter((relation) => (
    seedCorpus.theories.some((theory) => theory.slug === relation.theorySlug && theory.status === "published")
    && seedCorpus.works.some((work) => work.slug === relation.workSlug && work.status === "published")
  )).length, 4);
  assert.equal(seedCorpus.theoryConcepts.filter((relation) => (
    seedCorpus.theories.some((theory) => theory.slug === relation.theorySlug && theory.status === "published")
    && seedCorpus.concepts.some((concept) => concept.slug === relation.conceptSlug && concept.status === "published")
  )).length, 0);
  assert.equal(seedCorpus.theoryScholars.filter((relation) => (
    seedCorpus.theories.some((theory) => theory.slug === relation.theorySlug && theory.status === "published")
    && seedCorpus.scholars.some((scholar) => scholar.slug === relation.scholarSlug && scholar.status === "published")
  )).length, 5);
  assert.equal(seedCorpus.topicTheories.filter((relation) => (
    seedCorpus.topics.some((topic) => topic.slug === relation.topicSlug && topic.status === "published")
    && seedCorpus.theories.some((theory) => theory.slug === relation.theorySlug && theory.status === "published")
  )).length, 0);
});

test("public surfaces retain published-only fail-closed queries and no review verdict is fabricated", () => {
  for (const path of [
    "src/lib/static-params.ts",
    "src/lib/entities/indexes.ts",
    "src/lib/search.ts",
    "src/lib/graph-data.ts",
    "src/lib/internal-links.ts",
    "src/app/sitemap.ts",
  ]) {
    assert.match(readFileSync(path, "utf8"), /published/);
  }

  const serialized = JSON.stringify(seedCorpus);
  for (const forbidden of ["reviewer_identity", "reviewer_role", "reviewerIdentity", "reviewedAt", "reviewed_at", "wording_verdict"]) {
    assert.equal(serialized.includes(forbidden), false, `seed corpus does not fabricate ${forbidden}`);
  }
  assert.equal(serialized.includes("\"reviewerRole\":\"publication_editor\""), true);
  assert.equal(serialized.includes("\"reviewerRole\":\"methods\""), false);
});
