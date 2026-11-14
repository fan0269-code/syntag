import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { seedCorpus } from "../src/data/seed-content.ts";

test("authored 15-entity fixture contract is separate from the empty development seed contract", () => {
  const published = {
    theories: seedCorpus.theories.filter((entry) => entry.status === "published").map((entry) => entry.slug),
    scholars: seedCorpus.scholars.filter((entry) => entry.status === "published").map((entry) => entry.slug),
    works: seedCorpus.works.filter((entry) => entry.status === "published").map((entry) => entry.slug),
  };
  assert.equal(published.theories.length, 5);
  assert.equal(published.scholars.length, 5);
  assert.equal(published.works.length, 5);
  assert.equal(seedCorpus.topics.filter((entry) => entry.status === "published").length, 0);
  assert.equal(seedCorpus.concepts.filter((entry) => entry.status === "published").length, 0);
  assert.equal(seedCorpus.disciplines.filter((entry) => entry.status === "published").length, 0);
  assert.equal(seedCorpus.fields.filter((entry) => entry.status === "published").length, 0);

  const seedContract = readFileSync("tests/seed-integration.test.ts", "utf8");
  assert.match(seedContract, /development empty-seed contract/);
  assert.match(seedContract, /publishedTheoryCount, 0/);
  assert.match(seedContract, /skip: !connectionString/);
  assert.doesNotMatch(seedContract, /db:reset|migrate reset/);
});
