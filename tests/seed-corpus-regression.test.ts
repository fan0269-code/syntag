import assert from "node:assert/strict";
import test from "node:test";
import { seedCorpus } from "../src/data/seed-content.ts";
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
    scholars: 4,
    theoryScholars: 4,
    topics: 4,
    topicTheories: 12,
    verifications: 36,
  });
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
  ]);
  assert.deepEqual(validateSeedCorpus(seedCorpus).errors, []);
});
