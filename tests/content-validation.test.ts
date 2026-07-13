import assert from "node:assert/strict";
import test from "node:test";

import { seedCorpus } from "../src/data/seed-content.ts";
import { requiredTheoryBlocks } from "../src/data/templates/theory-template.ts";
import { entityDetailHref } from "../src/lib/entity-routes.ts";
import { validateSeedCorpus } from "../src/lib/content-validation.ts";

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
    && relation.sourceUrls.length > 0
  )));
  assert.equal(entityDetailHref("scholar", "glen-h-elder-jr"), "/scholars/glen-h-elder-jr");
  assert.equal(entityDetailHref("topic", "educational-transitions-over-time"), "/topics/educational-transitions-over-time");
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
    assert.ok(theory.content.en.sources.length > 0, `${slug} has sources`);
    if (theory.depth !== "D1") {
      assert.ok(theory.content.en.data_collection?.length, `${slug} has operationalization`);
    }
  }
});
