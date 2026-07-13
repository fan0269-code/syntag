# P5 Information Architecture Implementation Plan

> **For agentic workers:** Execute inline in the current workspace. Do not commit, reset, format unrelated files, or use a subagent.

**Goal:** Make every published Syrtag entity reachable from a real index route and eliminate public navigation dead links.

**Architecture:** Define a small canonical entity-route map shared by navigation, cards, graph details, and list pages. Add bounded, database-backed index queries and reuse one index-page component for the seven entity types. Preserve P3 distinctions: missing content is 404 and database unavailability remains a recoverable site error.

**Tech Stack:** Next.js 16 App Router, React 19, Prisma 7, Node test runner, existing CSS tokens.

## Global Constraints

- Modify only routes, navigation, list/index pages, breadcrumbs, error recovery, and focused tests.
- Do not add database content, graph/search features, SEO work, deployment work, or visual redesign.
- Use a maximum of 50 published records per index page; show a distinct empty state.
- Use canonical paths `/type` and `/type/slug` consistently.
- Keep Header and Footer on all recovery states; do not expose database internals.
- Do not commit or alter unrelated dirty worktree files.

---

### Task 1: Canonical entity-route contract and regression tests

**Files:**
- Create: `src/lib/entity-routes.ts`
- Create: `tests/information-architecture.test.ts`
- Modify: `src/components/graph/TheoryDetail.tsx`

**Interfaces:**
- Produces `ENTITY_INDEXES`, `EntityType`, `entityIndexHref(type)`, and `entityDetailHref(type, slug)`.
- `TheoryDetail` consumes `entityDetailHref` instead of maintaining a local pluralization rule.

- [ ] **Step 1: Write the failing test**

```ts
assert.equal(entityIndexHref("theory"), "/theories");
assert.equal(entityDetailHref("scholar", "glen-elder"), "/scholars/glen-elder");
assert.deepEqual(ENTITY_INDEXES.map(({ href }) => href), [
  "/disciplines", "/fields", "/theories", "/scholars", "/works", "/topics", "/concepts",
]);
```

- [ ] **Step 2: Run the focused test and confirm it fails because the module is absent**

Run: `node --env-file-if-exists=.env --experimental-strip-types --test tests/information-architecture.test.ts`

- [ ] **Step 3: Add the canonical route module and use it in graph details**

```ts
export const ENTITY_INDEXES = [
  { type: "discipline", label: "Disciplines", href: "/disciplines" },
  { type: "field", label: "Fields", href: "/fields" },
  { type: "theory", label: "Theories", href: "/theories" },
  { type: "scholar", label: "Scholars", href: "/scholars" },
  { type: "work", label: "Works", href: "/works" },
  { type: "topic", label: "Topics", href: "/topics" },
  { type: "concept", label: "Concepts", href: "/concepts" },
] as const;
```

- [ ] **Step 4: Re-run the focused test**

Expected: the route contract passes.

### Task 2: Bounded published-entity index data and reusable index component

**Files:**
- Create: `src/lib/entities/indexes.ts`
- Create: `src/components/content/EntityIndexPage.tsx`
- Create: `src/app/disciplines/page.tsx`, `src/app/fields/page.tsx`, `src/app/theories/page.tsx`, `src/app/scholars/page.tsx`, `src/app/works/page.tsx`, `src/app/topics/page.tsx`, `src/app/concepts/page.tsx`
- Test: `tests/information-architecture.test.ts`

**Interfaces:**
- Produces `getPublishedIndex(type, take = 50)` returning `{ slug, title, summary, tags }[]` for published records only.
- `EntityIndexPage` consumes `{ title, description, emptyLabel, items }` and renders cards or a distinct empty state.

- [ ] **Step 1: Extend the failing test with all seven index paths and bounded data contract**

```ts
for (const href of ENTITY_INDEXES.map(({ href }) => href)) {
  assert.match(readFileSync(`src/app${href}/page.tsx`, "utf8"), /EntityIndexPage/);
}
assert.match(readFileSync("src/lib/entities/indexes.ts", "utf8"), /take: 50/);
```

- [ ] **Step 2: Run the test and confirm it fails because index routes do not exist**

- [ ] **Step 3: Implement one query switch and one reusable list page**

```ts
const indexLimit = 50;
export async function getPublishedIndex(type: EntityType, take = indexLimit) {
  const limit = Math.min(Math.max(take, 1), indexLimit);
  // Each branch uses status: "published", orderBy, and take: limit.
}
```

Each route calls `loadDataPage(() => getPublishedIndex(type))`, renders `DataUnavailableState` on `DATA_UNAVAILABLE`, and passes its canonical description and empty label to `EntityIndexPage`.

- [ ] **Step 4: Re-run the focused test**

Expected: all seven index sources exist and use the shared component.

### Task 3: Navigation, breadcrumbs, and recoverable routes

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/common/DataUnavailableState.tsx`
- Modify: `src/app/not-found.tsx`
- Modify: `src/app/concepts/[slug]/page.tsx`, `src/app/disciplines/[slug]/page.tsx`, `src/app/fields/[slug]/page.tsx`, `src/app/scholars/[slug]/page.tsx`, `src/app/theories/[slug]/page.tsx`, `src/app/topics/[slug]/page.tsx`, `src/app/works/[slug]/page.tsx`
- Test: `tests/information-architecture.test.ts`

**Interfaces:**
- Header and Footer consume `ENTITY_INDEXES` and only render real routes; Framework Builder is absent from clickable navigation.
- `DataUnavailableState` accepts optional `indexHref` and `indexLabel` for a related real index.

- [ ] **Step 1: Add failing source-contract assertions**

```ts
assert.doesNotMatch(readFileSync("src/components/layout/Header.tsx", "utf8"), /framework-builder|\/search\?q=/);
assert.doesNotMatch(readFileSync("src/components/layout/Footer.tsx", "utf8"), /framework-builder/);
assert.match(readFileSync("src/app/theories/[slug]/page.tsx", "utf8"), /href: "\/theories"/);
assert.match(readFileSync("src/app/not-found.tsx", "utf8"), /\/theories/);
```

- [ ] **Step 2: Run the focused test and confirm it fails on the old navigation links**

- [ ] **Step 3: Point all navigation and category breadcrumbs at canonical indexes**

Header uses Disciplines, Theories, Scholars, Topics, and About; Footer uses the real entity index routes plus legal routes. Detail-page breadcrumbs replace `/search?q=` or `/` category shortcuts with their matching index route. The global 404 and unavailable state retain the homepage link and add real index links.

- [ ] **Step 4: Re-run the focused test**

Expected: no public navigation link targets search parameters or the unfinished Framework Builder.

### Task 4: Route reachability and final verification

**Files:**
- Test: `tests/information-architecture.test.ts`

- [ ] **Step 1: Add route reachability assertions for the build output**

```ts
for (const href of ENTITY_INDEXES.map(({ href }) => href)) {
  assert.match(readFileSync(".next/server/app-paths-manifest.json", "utf8"), new RegExp(`\\"${href}/page\\"`));
}
```

- [ ] **Step 2: Build, then run the reachability test**

Run: `npm run build && node --env-file-if-exists=.env --experimental-strip-types --test tests/information-architecture.test.ts`

Expected: every public index route is in the built app manifest.

- [ ] **Step 3: Run final project gates**

Run: `npm test && npm run lint && npm run build`

Expected: all tests pass, ESLint exits 0, and Next.js builds every index route.

## Plan self-review

- Coverage: Tasks 1–3 address canonical paths, all seven indexes, bounded lists, navigation, breadcrumbs, error recovery, and Framework Builder removal. Task 4 verifies public route creation and final project gates.
- Scope: No corpus, Prisma schema, graph/search behavior, SEO metadata, deployment, or visual-system changes are included.
- Constraints: No placeholder steps, no commits, and all changed interfaces are defined before their consumers.
