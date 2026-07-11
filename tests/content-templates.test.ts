import assert from "node:assert/strict";
import test from "node:test";

import {
  isTheoryContent,
  isTheoryDepth,
  LIFE_COURSE_D2_EXAMPLE,
  requiredTheoryBlocks,
} from "../src/data/templates/theory-template.ts";
import { GLEN_ELDER_COMPACT_EXAMPLE } from "../src/data/templates/scholar-template.ts";
import { LIFE_COURSE_DEVELOPMENTAL_THEORY_COMPACT_EXAMPLE } from "../src/data/templates/work-template.ts";
import { SCHOOL_TO_WORK_TRANSITIONS_COMPACT_EXAMPLE } from "../src/data/templates/topic-template.ts";

test("D2 theory content requires every explanatory block", () => {
  assert.deepEqual(requiredTheoryBlocks("D2"), [
    "what_is_it",
    "origins",
    "core_concepts",
    "genealogy",
    "applicable_topics",
    "inapplicable_topics",
    "misuse_risks",
    "analysis_dimensions",
    "data_collection",
    "chapter_structure",
    "fit_writing",
    "sources",
  ]);
  assert.equal(isTheoryContent(LIFE_COURSE_D2_EXAMPLE, "D2"), true);
  assert.equal(
    isTheoryContent({ ...LIFE_COURSE_D2_EXAMPLE, fit_writing: [] }, "D2"),
    false,
  );
});

test("theory depth validation rejects unknown depths and malformed required blocks", () => {
  assert.equal(isTheoryDepth("D1"), true);
  assert.equal(isTheoryDepth("D2"), true);
  assert.equal(isTheoryDepth("D3"), true);
  assert.equal(isTheoryDepth("D4"), false);
  assert.equal(isTheoryDepth(null), false);
  assert.equal(isTheoryContent(LIFE_COURSE_D2_EXAMPLE, "D3"), true);
  assert.equal(isTheoryContent(LIFE_COURSE_D2_EXAMPLE, "D4"), false);
  assert.equal(
    isTheoryContent(
      { ...LIFE_COURSE_D2_EXAMPLE, core_concepts: [{ name: "Trajectories" }] },
      "D2",
    ),
    false,
  );
  assert.equal(
    isTheoryContent(
      {
        ...LIFE_COURSE_D2_EXAMPLE,
        verification: [
          {
            claim: "An L1 claim without a source is invalid.",
            evidence_level: "L1",
            status: "verified",
          },
        ],
      },
      "D2",
    ),
    false,
  );
});

test("page templates provide their page-specific authoring blocks", () => {
  assert.deepEqual(GLEN_ELDER_COMPACT_EXAMPLE.academic_identity, {
    discipline: "Sociology",
    role: "Life-course researcher",
  });
  assert.match(GLEN_ELDER_COMPACT_EXAMPLE.research_fit, /life-course/i);

  assert.match(
    LIFE_COURSE_DEVELOPMENTAL_THEORY_COMPACT_EXAMPLE.core_question,
    /development/i,
  );
  assert.ok(LIFE_COURSE_DEVELOPMENTAL_THEORY_COMPACT_EXAMPLE.content_guide.length > 0);
  assert.ok(LIFE_COURSE_DEVELOPMENTAL_THEORY_COMPACT_EXAMPLE.key_chapters.length > 0);
  assert.equal(
    LIFE_COURSE_DEVELOPMENTAL_THEORY_COMPACT_EXAMPLE.lawful_access[0]?.access_type,
    "doi",
  );

  assert.ok(SCHOOL_TO_WORK_TRANSITIONS_COMPACT_EXAMPLE.theory_comparison_table.length > 0);
  assert.equal(
    SCHOOL_TO_WORK_TRANSITIONS_COMPACT_EXAMPLE.recommended_primary_theory.theory,
    "Life Course Theory",
  );
  assert.ok(SCHOOL_TO_WORK_TRANSITIONS_COMPACT_EXAMPLE.chapter_structure_suggestion.length > 0);
});
