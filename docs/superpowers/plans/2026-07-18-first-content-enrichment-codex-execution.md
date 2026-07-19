# First Content Enrichment Publication-Boundary Implementation Plan

> **For agentic workers:** Execute this plan task-by-task with a test-first workflow. Keep a checklist and record exact command results. Do not commit, push, create a PR, merge, or deploy.

**Goal:** Reconcile the first content-enrichment batch with its evidence packs, keep the four new Topic candidates private as drafts, publish only the three evidence-ready Scholar profiles, and complete the local database, build, smoke, browser, and audit gates needed for a truthful local release-candidate decision.

**Architecture:** Preserve `src/data/seed-content.ts` as the single production corpus entry point and keep the new physical batch module under `src/data/corpus/content-batches/`. The four Topic records and their 12 authored TopicTheory relations remain in the corpus for future review, but public reads must exclude them because the evidence packs do not authorize publication. Public Scholar expansion is limited to Jean Lave, Etienne Wenger, and Michael Lipsky; John W. Kingdon remains draft. Strengthen validation and integration tests so draft entities cannot leak through entry points, static routes, search, sitemap, or graph projections.

**Tech Stack:** Next.js 16 App Router, TypeScript, Node `node:test`, Prisma 7/PostgreSQL, Playwright Chromium, axe-core.

---

## 0. Codex operating contract

Work from:

```text
/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag
```

Before editing, read:

- `CLAUDE.md`
- `AGENTS.md`
- `docs/SITE_CONSTRUCTION_PLAYBOOK.md`
- `docs/roadmaps/2026-07-18-first-content-enrichment.md`
- `docs/research/2026-07-18-teacher-learning-cop-evidence.md`
- `docs/research/2026-07-18-policy-equity-access-evidence.md`
- `docs/research/2026-07-18-scholar-candidate-evidence.md`
- `docs/decisions/ADR-027-evidence-status-and-content-nature.md`

Run and record:

```bash
git status --short --branch
git rev-parse HEAD
git rev-list --left-right --count origin/main...HEAD
git diff --check
```

Current expected baseline:

- Branch: `feature/content-enrichment-batch-1`
- `HEAD` and `origin/main`: `c033b525b59624df89d73f35f3886f263f3b0939`
- Existing uncommitted content-enrichment work must be preserved.
- The local database may already contain an earlier seed of the batch; do not infer that two idempotent seed runs have occurred.

### Hard prohibitions

Do not:

- commit, push, create a PR, merge, or deploy;
- run `npm run db:reset`;
- modify production deployment scripts or workflows;
- add Theory, Work, Concept, Field, Discipline, Genealogy, schema, migration, route, dependency, analytics, authentication, payment, or paywall changes;
- alter the existing eight genealogy edges;
- publish Psychology or Management content;
- invent claim locators, reviewer roles, review decisions, or verification dates;
- weaken, delete, skip, or mark tests `only` to obtain a green result;
- overwrite unrelated user changes, including the existing `.gitignore` change.

If `DATABASE_URL` is not clearly a safe local/non-production database, stop before any migration or seed and report the blocker without printing the connection string.

---

## 1. Final publication decision

Apply this decision unless a real human academic reviewer supplies new claim-level approval records during execution:

| Entity | Final local status | Public behavior |
| --- | --- | --- |
| `teacher-professional-learning-and-change` | `draft` | No static route, search result, sitemap entry, graph node, index card, or public entry point |
| `education-policy-implementation-frontline-discretion` | `draft` | No static route, search result, sitemap entry, graph node, index card, or public entry point |
| `access-to-educational-support-and-opportunity` | `draft` | No static route, search result, sitemap entry, graph node, index card, or public entry point |
| `communities-of-practice-in-teacher-learning` | `draft` | No static route, search result, sitemap entry, graph node, index card, or public entry point |
| `jean-lave` | `published` | Public Scholar page and published-only relations allowed |
| `etienne-wenger` | `published` | Public Scholar page and published-only relations allowed |
| `michael-lipsky` | `published` | Public Scholar page and published-only relations allowed |
| `john-w-kingdon` | `draft` | No public route, search result, sitemap entry, graph node, index card, or public entry point |

Why: both Topic evidence packs explicitly conclude `draft / research-ready; not publish-ready` because they lack real claim locators, reviewer role, review decision, and `verifiedAt`. The implementation must not silently override that evidence boundary.

The 12 TopicTheory authoring records remain in the corpus. Distinguish raw authored totals from published/public totals:

- raw Topics: 8;
- published Topics: 4;
- raw TopicTheory relations: 24;
- public TopicTheory relations whose Topic and Theory are both published: 12;
- raw Scholars: 8;
- published Scholars: 7;
- raw TheoryScholar relations: 8;
- public TheoryScholar relations whose Theory and Scholar are both published: 7;
- public Genealogy relations: 8.

---

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

### Task 2: Require exact Topic pathway/relation role alignment

**Files:**

- Modify: `tests/seed-corpus-regression.test.ts`
- Modify only if needed: `src/lib/content-validation.ts`

The current regression checks only that both sides contain the same role set. That can miss a mismatch where a Theory is `primary` in page content but `supporting` in `TopicTheory`.

- [ ] **Step 1: Add an exact per-Theory regression assertion**

Inside the enrichment Topic loop, compare the two mappings by Theory slug:

```ts
const pathwayRoles = new Map(
  topic?.content.en.theory_pathways.map((entry) => [entry.theory_slug, entry.role]),
);
const relationRoles = new Map(
  relations.map((entry) => [entry.theorySlug, entry.recommendation]),
);

assert.deepEqual(
  [...relationRoles.entries()].sort(([left], [right]) => left.localeCompare(right)),
  [...pathwayRoles.entries()].sort(([left], [right]) => left.localeCompare(right)),
  `${slug} keeps page pathway roles aligned with TopicTheory recommendations`,
);
```

- [ ] **Step 2: Run the focused regression test**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/seed-corpus-regression.test.ts
```

Expected: PASS for the current correct mapping. This is a regression-strengthening change; do not manufacture a production failure.

- [ ] **Step 3: If a mismatch is discovered, fix only the incorrect role**

The expected mappings are:

```text
teacher-professional-learning-and-change
  teacher-professional-development-theory = primary
  communities-of-practice = supporting
  teacher-identity-theory = not_recommended

education-policy-implementation-frontline-discretion
  street-level-bureaucracy = primary
  institutional-theory = supporting
  multiple-streams-framework = not_recommended

access-to-educational-support-and-opportunity
  educational-equity-theory = primary
  social-capital-theory = supporting
  practice-theory-bourdieu = not_recommended

communities-of-practice-in-teacher-learning
  communities-of-practice = primary
  teacher-professional-development-theory = supporting
  social-capital-theory = not_recommended
```

---

### Task 3: Block published pages from linking to draft entry points

**Files:**

- Modify: `src/lib/content-validation.ts`
- Modify: `tests/content-validation.test.ts`

Current `validatePathway()` verifies only that an entry-point slug exists. It must also ensure that a published pathway page cannot advertise a draft or archived entity.

- [ ] **Step 1: Add a failing validation test**

Create an immutable test corpus copy in `tests/content-validation.test.ts` in which an existing published Topic, Discipline, or Field contains an entry point to `john-w-kingdon` or one of the four draft Topic slugs. Assert that `validateSeedCorpus()` returns an error containing both the owner slug and the draft target slug.

Use an explicit expected message shape:

```text
<owner-slug>: published pathway entry point <entity-type>:<target-slug> is not published
```

Also retain a positive assertion that draft Topic pages may keep internal authoring references while they are not public.

- [ ] **Step 2: Run the test and confirm RED**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/content-validation.test.ts
```

Expected: failure because `validatePathway()` currently accepts any known slug regardless of status.

- [ ] **Step 3: Implement status-aware entry-point validation**

In `src/lib/content-validation.ts`:

1. Build read-only status maps for theories, topics, fields, scholars, works, and concepts.
2. Change `validatePathway(slug, content)` to receive the owner status.
3. After confirming that an entry point exists, if the owner is `published`, resolve the target status by `entity_type` and add the exact error above unless the target status is `published`.
4. Update Topic, Discipline, and Field calls to pass their status.
5. Do not reject draft-page references merely because the target is draft; the public-read invariant applies to published surfaces.

Do not mutate corpus entities.

- [ ] **Step 4: Run validation and corpus tests**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test \
  tests/content-validation.test.ts \
  tests/seed-corpus-regression.test.ts
npm run content:check
```

Expected: PASS.

---

### Task 4: Make database verification distinguish raw and public states

**Files:**

- Modify: `src/lib/seed-verification.ts`
- Modify: `tests/seed-integration.test.ts`

Current integration assertions check aggregate counts only and still expect 8 published Topics. Replace that ambiguity with exact state checks.

- [ ] **Step 1: Extend the verification result**

Add these fields to `SeedVerificationResult`:

```ts
totalTopicCount: number;
totalTopicTheoryCount: number;
enrichmentTopicStatuses: Array<{ slug: string; status: string }>;
enrichmentScholarStatuses: Array<{ slug: string; status: string }>;
```

Query:

- all Topic rows and all TopicTheory rows;
- the four exact enrichment Topic slugs ordered by slug;
- the four exact enrichment Scholar slugs ordered by slug.

Keep the existing published-only counts; they remain useful.

- [ ] **Step 2: Update integration expectations before seeding**

In `tests/seed-integration.test.ts`, assert:

```text
publishedTopicCount = 4
searchableTopicCount = 4
public topicTheoryCount = 12
totalTopicCount = 8
totalTopicTheoryCount = 24
publishedScholarCount = 7
public theoryScholarCount = 7
searchableScholarCount = 7
genealogyCount = 8
```

Assert the exact enrichment statuses:

```ts
assert.deepEqual(result.enrichmentTopicStatuses, [
  { slug: "access-to-educational-support-and-opportunity", status: "draft" },
  { slug: "communities-of-practice-in-teacher-learning", status: "draft" },
  { slug: "education-policy-implementation-frontline-discretion", status: "draft" },
  { slug: "teacher-professional-learning-and-change", status: "draft" },
]);

assert.deepEqual(result.enrichmentScholarStatuses, [
  { slug: "etienne-wenger", status: "published" },
  { slug: "jean-lave", status: "published" },
  { slug: "john-w-kingdon", status: "draft" },
  { slug: "michael-lipsky", status: "published" },
]);
```

- [ ] **Step 3: Run the integration test before reseeding**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/seed-integration.test.ts
```

Expected: it may fail if the local database still contains the earlier version with four published enrichment Topics. Record the actual failure; do not alter expectations to match stale data.

---

### Task 5: Rewrite E2E coverage for the final draft/public boundary

**Files:**

- Modify: `tests/e2e/content-enrichment.spec.ts`

The current E2E file expects the four new Topics to be public. That contradicts the evidence packs and final decision.

- [ ] **Step 1: Replace public Topic reachability tests**

Keep the four Topic slug/question cases, but replace each public-page test with a draft-isolation test that verifies:

- the Topic is absent from `/topics`;
- a search using a distinctive phrase does not link to the draft Topic;
- `/sitemap.xml` does not contain the slug;
- direct navigation to `/topics/<slug>` returns 404 and renders the existing unavailable-entry state.

Do not attach the general browser-health watcher to an intentional 404 response.

- [ ] **Step 2: Update search cases**

Remove search expectations that require the draft Topics to appear. Add published Scholar discovery cases instead:

```text
query "Jean Lave" -> Jean Lave
query "Etienne Wenger" -> Etienne Wenger
query "Michael Lipsky" or "frontline discretion" -> Michael Lipsky
query "Kingdon" -> no John W. Kingdon result
```

- [ ] **Step 3: Update the home graph test**

Replace the test that expects a new draft Topic node with assertions that Topic mode loads successfully but none of the four draft Topic questions appears in the accessible node list.

- [ ] **Step 4: Keep and strengthen Scholar checks**

Retain:

- public pages for Lave, Wenger, and Lipsky;
- attribution boundary and page-source-register checks;
- conservative source wording;
- Kingdon absence from index, search, sitemap, and detail route.

Add a 375px no-horizontal-scroll assertion for one representative published Scholar page.

Do not run E2E yet; it requires a fresh seed and production build.

---

### Task 6: Run static and content gates before database writes

**Files:** No new files expected.

- [ ] **Step 1: Run focused tests**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test \
  tests/content-ui-contract.test.ts \
  tests/content-validation.test.ts \
  tests/seed-corpus-regression.test.ts
```

- [ ] **Step 2: Run TypeScript, lint, content, and diff gates**

```bash
npm run typecheck
npm run lint
npm run content:check
git diff --check
```

Expected: every command exits 0. If any command fails, fix only the failure caused by this batch and rerun the exact failing command before continuing.

---

### Task 7: Apply the corpus to a safe local database twice

**Files:** No schema or migration changes expected.

- [ ] **Step 1: Confirm database safety without printing credentials**

Confirm `DATABASE_URL` exists and points to the intended local/non-production database. If safety cannot be established, stop and report that Tasks 7–10 are blocked.

- [ ] **Step 2: Run migration status/application**

```bash
npm run db:migrate
```

Expected: success, normally reporting that the schema is already in sync. No new migration should be created.

- [ ] **Step 3: Run the seed twice**

```bash
npm run db:seed
npm run db:seed
```

Expected: both runs succeed and the second run creates no duplicate entities or relations.

- [ ] **Step 4: Run exact database integration verification**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/seed-integration.test.ts
```

Expected: PASS with the raw/public counts and exact statuses defined in Task 4.

---

### Task 8: Run the complete engineering gate and create a fresh build

**Files:** No source changes unless a verified failure requires a scoped fix.

Run in this order:

```bash
npm run typecheck
npm test
npm run lint
npm run content:check
npm run build
node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts
```

Expected:

- all commands exit 0;
- no new skip/only markers;
- build happens after migrate and seed;
- published Scholar routes are in the fresh build;
- draft Topic and Kingdon routes are absent from public static parameters/sitemap behavior;
- build-output smoke passes.

Do not rely on an existing `.next/BUILD_ID`; it predates or may predate this final corpus state.

---

### Task 9: Run targeted and full browser gates

**Files:** Modify tests only if a test reveals a real mismatch with the approved boundary; do not relax assertions.

- [ ] **Step 1: Run the targeted enrichment suite**

```bash
PLAYWRIGHT_PORT=3101 npx playwright test tests/e2e/content-enrichment.spec.ts
```

Expected: PASS.

- [ ] **Step 2: Run the full configured E2E suite**

```bash
PLAYWRIGHT_PORT=3101 npm run test:e2e
```

Expected: PASS with no serious/critical axe violations, page errors, unexpected console errors, or first-party 4xx/5xx responses. Intentional draft detail-route 404 checks are allowed only in the dedicated assertions.

- [ ] **Step 3: Manually inspect representative desktop and 375px paths**

Verify:

```text
/topics
/scholars
/scholars/jean-lave
/scholars/etienne-wenger
/scholars/michael-lipsky
/search?q=Jean%20Lave
/search?q=Kingdon
/sitemap.xml
/
```

Direct draft checks:

```text
/topics/teacher-professional-learning-and-change
/topics/education-policy-implementation-frontline-discretion
/topics/access-to-educational-support-and-opportunity
/topics/communities-of-practice-in-teacher-learning
/scholars/john-w-kingdon
```

Expected for every draft path: 404/unavailable state and no public inbound link.

---

### Task 10: Update the roadmap with truthful execution evidence

**Files:**

- Modify: `docs/roadmaps/2026-07-18-first-content-enrichment.md`

- [ ] **Step 1: Correct stale scope and status language**

Change the plan to a valid single status:

- `已完成` only if every required local gate passes;
- `阻塞` if any P0/P1 issue remains;
- otherwise `实施中`.

Replace the old statement that the four Topics are locally published with the final draft decision. State clearly that the batch contains draft Topic research/corpus records and three new published Scholar profiles.

- [ ] **Step 2: Correct the data expectations**

Record raw and public counts separately:

```text
raw Topics 8 / published Topics 4
raw TopicTheory 24 / public TopicTheory 12
raw Scholars 8 / published Scholars 7
raw TheoryScholar 8 / public TheoryScholar 7
public Genealogy 8
```

- [ ] **Step 3: Record exact evidence**

Record:

- commands and exit codes;
- two successful seed runs;
- integration results;
- build and smoke results;
- targeted and full E2E results;
- representative browser paths;
- the Topic draft decision and Kingdon draft decision;
- any unresolved limitation, especially that relationship-level evidence notes are authored in the corpus but not fully persisted as a claim-level evidence model.

Do not write “deployed”, “online”, “production verified”, or “Phase 1 complete”. The strongest allowed successful conclusion is:

> The first content-enrichment batch is a locally verified release candidate: three Scholar profiles are eligible for publication, while four Topic research packs and John W. Kingdon remain draft and are excluded from every public surface.

---

### Task 11: Final audit and handoff

Run:

```bash
git status --short --branch
git diff --stat
git diff --check
```

Review every changed and untracked file. Confirm:

- no secrets or connection strings were added;
- no schema/migration/dependency/deployment changes occurred;
- no Psychology/Management public content was added;
- genealogy remains exactly eight public edges;
- the four Topic candidates and Kingdon are draft;
- only Lave, Wenger, and Lipsky expand the public Scholar set;
- no test was weakened;
- no commit, push, PR, merge, or deployment occurred.

Return a final report with:

1. conclusion: `local release candidate passed`, `partially passed`, or `blocked`;
2. files changed;
3. exact test/build/E2E results;
4. raw and public database counts;
5. draft/public entity matrix;
6. unresolved risks;
7. recommended next action, without performing it.

Do not perform the recommended next action automatically.
