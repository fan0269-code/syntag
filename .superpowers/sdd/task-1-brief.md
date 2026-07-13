### Task 1: Add typed page-content templates

**Files:**

- Create: \`src/data/templates/theory-template.ts\`
- Create: \`src/data/templates/scholar-template.ts\`
- Create: \`src/data/templates/work-template.ts\`
- Create: \`src/data/templates/topic-template.ts\`
- Test: \`tests/content-templates.test.ts\`

**Produces:** \`TheoryContent\`, \`TheoryDepth\`, \`requiredTheoryBlocks\`, \`isTheoryContent\`, and page-type interfaces.

- [ ] **Step 1: Write the failing theory-depth test.**

\`\`\`ts
assert.deepEqual(requiredTheoryBlocks("D2"), [
  "what_is_it", "origins", "core_concepts", "genealogy", "applicable_topics",
  "inapplicable_topics", "misuse_risks", "analysis_dimensions", "data_collection",
  "chapter_structure", "fit_writing", "sources",
]);
assert.equal(isTheoryContent(LIFE_COURSE_D2_EXAMPLE, "D2"), true);
assert.equal(isTheoryContent({ ...LIFE_COURSE_D2_EXAMPLE, fit_writing: [] }, "D2"), false);
\`\`\`

- [ ] **Step 2: Run the test before implementation.**

Run: \`node --experimental-strip-types --test tests/content-templates.test.ts\`

Expected: failure because the template module does not exist.

- [ ] **Step 3: Implement the minimal reusable template contract.**

\`\`\`ts
export const THEORY_BLOCKS = [
  "what_is_it", "origins", "core_concepts", "genealogy", "applicable_topics",
  "inapplicable_topics", "misuse_risks", "analysis_dimensions", "data_collection",
  "chapter_structure", "fit_writing", "sources",
] as const;
export type TheoryDepth = "D1" | "D2" | "D3";
export type TheoryBlockName = (typeof THEORY_BLOCKS)[number];

export function requiredTheoryBlocks(depth: TheoryDepth) {
  return depth === "D1" ? THEORY_BLOCKS.slice(0, 7) : [...THEORY_BLOCKS];
}
export function isTheoryContent(value: unknown, depth: TheoryDepth) {
  return !!value && typeof value === "object" &&
    requiredTheoryBlocks(depth).every((key) => key in value);
}
\`\`\`

Define concept, genealogy, suitability, operationalization, reading-path, chapter, source, and verification interfaces. Include a complete English D2 Life Course example and compact English examples for scholar, work, and topic pages.

- [ ] **Step 4: Re-run the test.**

Run: \`node --experimental-strip-types --test tests/content-templates.test.ts\`

Expected: PASS.

- [ ] **Step 5: Commit only Task 1 files.**

\`\`\`bash
git add src/data/templates tests/content-templates.test.ts
git commit -m "feat: add typed content templates"
\`\`\`

