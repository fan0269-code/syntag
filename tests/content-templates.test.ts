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
import { isPathwayContent } from "../src/data/templates/pathway-template.ts";

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
    "explanatory_mechanisms",
    "analysis_unit",
    "theory_comparisons",
    "boundary_conditions",
  ]);
  assert.equal(isTheoryContent(LIFE_COURSE_D2_EXAMPLE, "D2"), true);
  assert.equal(
    isTheoryContent({ ...LIFE_COURSE_D2_EXAMPLE, fit_writing: [] }, "D2"),
    false,
  );
  assert.equal(
    isTheoryContent({ ...LIFE_COURSE_D2_EXAMPLE, reading_path: undefined }, "D2"),
    false,
  );
  assert.equal(
    isTheoryContent({ ...LIFE_COURSE_D2_EXAMPLE, verification: undefined }, "D2"),
    false,
  );
});

test("theory depth validation rejects unknown depths and malformed required blocks", () => {
  assert.equal(isTheoryDepth("D1"), true);
  assert.equal(isTheoryDepth("D2"), true);
  assert.equal(isTheoryDepth("D3"), true);
  assert.equal(isTheoryDepth("D4"), false);
  assert.equal(isTheoryDepth(null), false);
  assert.equal(isTheoryContent(LIFE_COURSE_D2_EXAMPLE, "D3"), false);
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

test("theory content rejects a reading-path source that is not listed on the page", () => {
  assert.equal(
    isTheoryContent(
      {
        ...LIFE_COURSE_D2_EXAMPLE,
        reading_path: [
          {
            ...LIFE_COURSE_D2_EXAMPLE.reading_path![0],
            source_id: "invented-source-id",
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
    source_ids: ["elder-1998-life-course"],
  });
  assert.equal(GLEN_ELDER_COMPACT_EXAMPLE.theory_relationships[0]?.theory_slug, "life-course-theory");
  assert.ok(GLEN_ELDER_COMPACT_EXAMPLE.representative_works.length > 0);
  assert.ok(GLEN_ELDER_COMPACT_EXAMPLE.attribution_boundaries.length > 0);

  assert.match(
    LIFE_COURSE_DEVELOPMENTAL_THEORY_COMPACT_EXAMPLE.core_question,
    /development/i,
  );
  assert.ok(LIFE_COURSE_DEVELOPMENTAL_THEORY_COMPACT_EXAMPLE.content_guide.length > 0);
  assert.ok(LIFE_COURSE_DEVELOPMENTAL_THEORY_COMPACT_EXAMPLE.key_chapters.length > 0);
  assert.match(
    LIFE_COURSE_DEVELOPMENTAL_THEORY_COMPACT_EXAMPLE.key_chapters[0]?.chapter ?? "",
    /article-level|verified section/i,
  );
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

test("pathway content requires a sourced selection route and connected entry points", () => {
  const content = {
    overview: "A bounded route from a research question to existing Syntag entries.",
    core_questions: ["What is the explanatory focus?"],
    question_categories: [{ category: "Temporal change", description: "Questions about transitions and sequences.", theory_slugs: ["life-course-theory"] }],
    selection_path: [{ step: "Name the outcome", prompt: "What needs explanation?", routing_rule: "Choose a theory with a matching mechanism." }],
    theory_pathways: [
      { theory_slug: "life-course-theory", role: "primary", explanatory_focus: "Time and linked lives", analysis_unit: "Pathways", data_materials: "Interviews and records", strengths: "Explains sequences", limitations: "Does not establish causality alone", source_ids: ["elder-1998-life-course"] },
      { theory_slug: "social-capital-theory", role: "supporting", explanatory_focus: "Relational resources", analysis_unit: "Networks", data_materials: "Interviews and network records", strengths: "Clarifies access", limitations: "Does not explain sequences alone", source_ids: ["elder-1998-life-course"] },
      { theory_slug: "communities-of-practice", role: "not_recommended", explanatory_focus: "Participation", analysis_unit: "Practice", data_materials: "Observation", strengths: "Clarifies learning", limitations: "Does not match this temporal question", source_ids: ["elder-1998-life-course"] },
    ],
    entry_points: [{ entity_type: "theory", slug: "life-course-theory", label: "Life Course Theory", relevance: "Primary pathway." }],
    sources: [{ id: "elder-1998-life-course", citation: "Elder (1998).", url: "https://doi.org/10.1111/j.1467-8624.1998.tb06128.x", source_kind: "doi", evidence_level: "L1", supports: ["Life-course concepts"] }],
    verification: [{ claim: "The source supports the named concepts.", evidence_level: "L1", source_id: "elder-1998-life-course", status: "verified" }, { claim: "The route is editorial.", evidence_level: "L2", status: "editorial" }, { claim: "The route requires study-specific review.", evidence_level: "L3", status: "proposed" }],
  };

  assert.equal(isPathwayContent(content), true);
  assert.equal(isPathwayContent({ ...content, entry_points: [] }), false);
  assert.equal(isPathwayContent({ ...content, theory_pathways: [{ ...content.theory_pathways[0], source_ids: ["unlisted"] }] }), false);
});
