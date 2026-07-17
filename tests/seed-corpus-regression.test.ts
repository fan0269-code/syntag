import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { seedCorpus } from "../src/data/seed-content.ts";
import { validateSeedCorpus } from "../src/lib/content-validation.ts";

test("seed corpus matches the pre-extraction characterization", () => {
  const hash = createHash("sha256").update(JSON.stringify(seedCorpus)).digest("hex");
  assert.equal(hash, "ea25c1948c9ccf649e2e9b72edbf1dd6c444322ace495ebcf2acb111a2b19b86");

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
    scholars: 4,
    theoryScholars: 4,
    topics: 4,
    topicTheories: 12,
    verifications: 36,
  });
  assert.deepEqual(validateSeedCorpus(seedCorpus).errors, []);
});
