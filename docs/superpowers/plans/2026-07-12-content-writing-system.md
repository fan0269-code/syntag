# Syntag Content Writing System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Deliver typed, source-traceable English content templates, a complete idempotent Syntag seed corpus, content retrieval functions, and automated structural validation.

**Architecture:** Keep JSONB contracts and source-backed corpus data under \`src/data\`; keep \`prisma/seed.ts\` as an idempotent persistence adapter. Use a client-injected content repository for unit tests and production wrappers that obtain the existing Prisma client from \`getDb()\`.

**Tech Stack:** Next.js 16, TypeScript 5, Prisma 7/PostgreSQL, Node built-in test runner.

## Global Constraints

- Phase 1 page copy is English only.
- The twelve primary theories meet their D1/D2/D3 block and word-count requirements; Chapter 10 supporting nodes are non-empty and source-backed.
- L1 contains only traceable DOI, publisher, university, library, journal, or equivalent authoritative sources. Editorial analysis is L2 or L3.
- Do not invent bibliographic facts or acquisition links. Work records list only lawful publisher, author, library, or institutional access.
- Do not stage or alter the existing uncommitted application work outside the listed files.
- Seeding uses upserts; all genealogy edges have a non-empty English description.

---

## File Structure

- Create \`src/data/templates/theory-template.ts\`: theory types, depth block rules, and Life Course D2 example.
- Create \`src/data/templates/scholar-template.ts\`, \`work-template.ts\`, and \`topic-template.ts\`: page-specific content contracts.
- Create \`src/data/seed-content.ts\`: entities, structured content, concepts, links, sources, and verification specifications.
- Create \`src/lib/content-validation.ts\`: pure corpus validation.
- Modify \`prisma/seed.ts\`: persistence adapter for all entities and relations.
- Create \`src/lib/content.ts\`: production retrieval wrappers and injected repository.
- Create \`tests/content-templates.test.ts\`, \`tests/content-validation.test.ts\`, and \`tests/content-repository.test.ts\`.

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

### Task 2: Build and validate the source-backed corpus

**Files:**

- Create: \`src/data/seed-content.ts\`
- Create: \`src/lib/content-validation.ts\`
- Test: \`tests/content-validation.test.ts\`

**Consumes:** Task 1 template types.

**Produces:** \`seedCorpus\` and \`validateSeedCorpus(corpus)\`.

- [ ] **Step 1: Write the failing corpus test.**

\`\`\`ts
const result = validateSeedCorpus(seedCorpus);
assert.deepEqual(result.errors, []);
assert.equal(seedCorpus.theories.filter((theory) => theory.primary).length, 12);
assert.ok(seedCorpus.genealogy.every((edge) => edge.descriptionEn.trim().length > 0));
assert.ok(seedCorpus.verifications
  .filter((item) => item.level === "L1_verified")
  .every((item) => item.sources.length > 0));
\`\`\`

- [ ] **Step 2: Run the test before adding data.**

Run: \`node --experimental-strip-types --test tests/content-validation.test.ts\`

Expected: failure because corpus and validator do not exist.

- [ ] **Step 3: Implement corpus records using named fields, not positional tuples.**

\`\`\`ts
{
  slug: "life-course-theory",
  primary: true,
  depth: "D3",
  titleEn: "Life Course Theory",
  summaryEn: "A framework for explaining how lives unfold through historical time, social relationships, and changing institutions.",
  content: { en: lifeCourseContent },
}
\`\`\`

Author all 12 primary theories, all listed disciplines, fields, scholars, works, topics, frameworks, concepts, and association records. Add every Chapter 10 external theory as a supporting node and include its source-backed English content. Each primary theory receives its required blocks; every work contains lawful access methods. Source objects use \`citation\`, \`url\`, and \`level\` fields and are verified before being placed in L1.

- [ ] **Step 4: Implement pure validation.**

\`\`\`ts
for (const theory of corpus.theories) {
  if (!isTheoryContent(theory.content.en, theory.depth)) errors.push(theory.slug + ": missing required blocks");
  if (!theory.content.en.sources.length) errors.push(theory.slug + ": no sources");
}
for (const edge of corpus.genealogy) {
  if (!edge.descriptionEn.trim()) errors.push(edge.sourceSlug + " to " + edge.targetSlug + ": missing description");
}
for (const item of corpus.verifications) {
  if (item.level === "L1_verified" && !item.sources.length) errors.push(item.entitySlug + ": missing L1 source");
}
\`\`\`

Validate all relation endpoints against entity slugs and test three theories for genealogy, fit boundaries, reading paths, operationalization, and sources.

- [ ] **Step 5: Re-run the corpus test.**

Run: \`node --experimental-strip-types --test tests/content-validation.test.ts\`

Expected: PASS with no errors.

- [ ] **Step 6: Commit only Task 2 files.**

\`\`\`bash
git add src/data/seed-content.ts src/lib/content-validation.ts tests/content-validation.test.ts
git commit -m "feat: add source-traceable seed corpus"
\`\`\`

### Task 3: Replace metadata seeding with an idempotent corpus adapter

**Files:**

- Modify: \`prisma/seed.ts\`
- Modify: \`tests/content-validation.test.ts\`

**Consumes:** \`seedCorpus\`, \`validateSeedCorpus\`.

**Produces:** upserted primary/supporting entities and all schema association and verification rows.

- [ ] **Step 1: Add a failing relation-endpoint assertion.**

\`\`\`ts
const result = validateSeedCorpus(seedCorpus);
assert.deepEqual(result.errors.filter((message) => message.includes("unknown")), []);
\`\`\`

- [ ] **Step 2: Run the test.**

Run: \`node --experimental-strip-types --test tests/content-validation.test.ts\`

Expected: failure until endpoint validation is implemented.

- [ ] **Step 3: Make seed.ts consume the corpus after preflight.**

\`\`\`ts
const preflight = validateSeedCorpus(seedCorpus);
if (preflight.errors.length) {
  throw new Error("Seed validation failed:\\n" + preflight.errors.join("\\n"));
}
const item = await db.theory.upsert({
  where: { slug: record.slug },
  update: { titleEn: record.titleEn, summaryEn: record.summaryEn, depth: record.depth, contentJsonb: record.content, ...published },
  create: { slug: record.slug, titleEn: record.titleEn, summaryEn: record.summaryEn, depth: record.depth, contentJsonb: record.content, ...published },
});
\`\`\`

Map database IDs by slug. Upsert every composite-key association and use a stable explicit edge ID for \`TheoryGenealogy\`. Create L1 source and L2/L3 editorial verification records with stable \`fieldPath\` values. Keep the existing missing-\`DATABASE_URL\` failure behavior.

- [ ] **Step 4: Re-run static validation.**

Run: \`node --experimental-strip-types --test tests/content-validation.test.ts\`

Expected: PASS.

- [ ] **Step 5: Seed PostgreSQL when configured.**

Run: \`test -n "$DATABASE_URL" && npx prisma db seed || echo "DATABASE_URL absent; static preflight passed"\`

Expected: \`Syntag seed completed.\` or the explicit pending message.

- [ ] **Step 6: Commit only Task 3 files.**

\`\`\`bash
git add prisma/seed.ts tests/content-validation.test.ts
git commit -m "feat: seed full Syntag content graph"
\`\`\`

### Task 4: Add the content query layer and final gates

**Files:**

- Create: \`src/lib/content.ts\`
- Create: \`tests/content-repository.test.ts\`
- Modify: \`tests/content-validation.test.ts\`

**Consumes:** existing \`getDb()\` and seeded JSON contract.

**Produces:** \`getContentBlock(entityType, entitySlug, blockName, lang)\`, \`getContentBlocks(entityType, entitySlug, lang)\`, and \`getTheoryWithRelations(slug)\`.

- [ ] **Step 1: Write a failing injected-repository test.**

\`\`\`ts
const repository = createContentRepository({
  theory: { findUnique: async () => ({
    slug: "life-course-theory",
    contentJsonb: { en: { what_is_it: ["Plain explanation"] } },
  }) },
} as never);
assert.deepEqual(
  await repository.getContentBlock("theory", "life-course-theory", "what_is_it", "en"),
  ["Plain explanation"],
);
\`\`\`

- [ ] **Step 2: Run the test.**

Run: \`node --experimental-strip-types --test tests/content-repository.test.ts\`

Expected: failure because \`content.ts\` does not exist.

- [ ] **Step 3: Implement the repository and wrappers.**

\`\`\`ts
export type ContentEntityType = "theory" | "scholar" | "work" | "topic";
export type ContentLanguage = "en" | "zh";
export type ContentBlockArgs = [ContentEntityType, string, string, ContentLanguage];
export function createContentRepository(client: PrismaClient) {
  return { getContentBlock, getContentBlocks, getTheoryWithRelations };
}
export const getContentBlock = (...args: ContentBlockArgs) =>
  createContentRepository(getDb()).getContentBlock(...args);
\`\`\`

Return \`null\` for a missing entity or missing block. Return ordered \`{ name, value }\` objects for available localized blocks. Query a theory with scholars, works, concepts, topics, disciplines, outgoing edges and targets, and incoming edges and sources.

- [ ] **Step 4: Run repository tests.**

Run: \`node --experimental-strip-types --test tests/content-repository.test.ts\`

Expected: PASS.

- [ ] **Step 5: Run all quality gates.**

Run: \`npm test && npm run lint && npm run build\`

Expected: all commands exit 0. Separately run \`npx prisma db seed\` twice when \`DATABASE_URL\` is configured to demonstrate idempotency. If the environment has no connection string, report database insertion as pending and do not claim it ran.

- [ ] **Step 6: Check off completed plan steps and commit only Task 4 files.**

\`\`\`bash
git add src/lib/content.ts tests/content-repository.test.ts tests/content-validation.test.ts docs/superpowers/plans/2026-07-12-content-writing-system.md
git commit -m "feat: add structured content queries"
\`\`\`
