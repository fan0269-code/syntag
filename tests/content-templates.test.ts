import assert from "node:assert/strict";
import test from "node:test";

import {
  isTheoryContent,
  LIFE_COURSE_D2_EXAMPLE,
  requiredTheoryBlocks,
} from "../src/data/templates/theory-template.ts";

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
