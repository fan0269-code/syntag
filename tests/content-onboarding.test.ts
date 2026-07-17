import assert from "node:assert/strict";
import test from "node:test";

import { publicStaticParamSlugs, validateNewBatch, type NewContentBatch } from "../src/lib/content-onboarding.ts";

function validBatch(): NewContentBatch {
  return {
    entities: [
      { entityType: "discipline" as const, slug: "psychology", titleEn: "Psychology", status: "published" as const, sources: [{ url: "https://example.edu/psychology", type: "university" }] },
      { entityType: "theory" as const, slug: "developmental-systems-theory", titleEn: "Developmental Systems Theory", status: "published" as const, depth: "D3" as const, sources: [{ url: "https://doi.org/10.0000/example", type: "doi" }] },
    ],
    genealogy: [{ sourceSlug: "developmental-systems-theory", targetSlug: "life-course-theory" }],
  };
}

test("published onboarding entities require a traceable source URL and type", () => {
  const batch = validBatch();
  batch.entities[0].sources = [];

  const result = validateNewBatch(batch);

  assert.ok(result.errors.some((error) => error.includes("psychology") && error.includes("draft")));
});

test("D3 theories require a genealogy relation", () => {
  const batch = validBatch();
  batch.genealogy = [];

  const result = validateNewBatch(batch);

  assert.ok(result.errors.some((error) => error.includes("developmental-systems-theory") && error.includes("genealogy")));
});

test("draft entities are excluded from public static params", () => {
  const batch = validBatch();
  batch.entities.push({ entityType: "theory", slug: "unverified-theory", titleEn: "Unverified Theory", status: "draft", depth: "D1", sources: [] });

  assert.deepEqual(publicStaticParamSlugs(batch, "theory"), [
    { slug: "developmental-systems-theory" },
  ]);
});

test("unverified published entities are forced to draft and excluded from static params", () => {
  const batch = validBatch();
  batch.entities[1].sources = [];

  const result = validateNewBatch(batch);

  assert.equal(result.batch.entities[1].status, "draft");
  assert.deepEqual(publicStaticParamSlugs(batch, "theory"), []);
});

test("published entities missing required identity are forced to draft and excluded from static params", () => {
  const batch = validBatch();
  batch.entities[0].slug = "";
  batch.entities[0].titleEn = "";

  const result = validateNewBatch(batch);

  assert.equal(result.batch.entities[0].status, "draft");
  assert.ok(result.errors.some((error) => error.includes("missing slug")));
  assert.ok(result.errors.some((error) => error.includes("missing titleEn")));
  assert.deepEqual(publicStaticParamSlugs(batch, "discipline"), []);
});
