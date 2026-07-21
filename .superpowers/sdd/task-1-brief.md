### Task 1: Align Topic corpus status with the evidence packs

**Files:**

- Modify: `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts`
- Modify: `tests/content-validation.test.ts`
- Modify: `tests/seed-corpus-regression.test.ts`

- [ ] **Step 1: Change the tests first**

In `tests/content-validation.test.ts`, replace the assertion that the four enrichment Topics are published with assertions that each Topic:

- has `status === "draft"`;
- has `publishedAt === undefined`;
- still satisfies `isPathwayContent()`;
- retains exactly the roles `primary`, `supporting`, and `not_recommended`;
- retains L1/L2/L3 content-nature separation;
- retains three TopicTheory authoring relations with source URLs registered by the corresponding Theory.

Use the exact Topic slug set already present in the test:

```ts
const enrichmentTopicSlugs = new Set([
  "teacher-professional-learning-and-change",
  "education-policy-implementation-frontline-discretion",
  "access-to-educational-support-and-opportunity",
  "communities-of-practice-in-teacher-learning",
]);
```

In `tests/seed-corpus-regression.test.ts`, add exact status assertions:

```ts
for (const slug of enrichmentTopicSlugs) {
  const topic = seedCorpus.topics.find((entry) => entry.slug === slug);
  assert.equal(topic?.status, "draft", `${slug} remains draft pending claim-level review`);
  assert.equal(topic?.publishedAt, undefined, `${slug} does not author a publication date`);
}
```

- [ ] **Step 2: Run the focused tests and confirm RED**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test \
  tests/content-validation.test.ts \
  tests/seed-corpus-regression.test.ts
```

Expected: failure because the four Topic records are currently `published` and author `publishedAt`.

- [ ] **Step 3: Make the minimal corpus change**

In `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts`, for each of the four Topic objects:

- change `status: "published"` to `status: "draft"`;
- remove `publishedAt` from the Topic object;
- leave Topic content, sources, pathways, and the 12 TopicTheory authoring records unchanged;
- leave the three published Scholars and draft Kingdon unchanged.

Do not remove the shared `publishedAt` constant because the three published Scholar records still use it.

- [ ] **Step 4: Re-run the focused tests**

Run the same command. Expected: PASS.

---

