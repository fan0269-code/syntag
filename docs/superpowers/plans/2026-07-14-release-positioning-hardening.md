# Release, Positioning, and Experience Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make production deployment reproducible and record a constrained, evidence-based product, content, and UI direction for Syrtag.

**Architecture:** The tracked `ops/deploy-production.sh` becomes the only release sequence definition, while GitHub Actions copies that script to the host rather than patching it remotely. The existing site playbook becomes the single long-term plan; two audit documents translate the approved positioning into scoped Codex and OpenDesign work packages without changing public entity URLs or scholarly data.

**Tech Stack:** Next.js 16, TypeScript, Node built-in test runner, Prisma 7, PostgreSQL, GitHub Actions, Bash, Markdown.

---

## File structure

| File | Responsibility |
| --- | --- |
| `.gitignore` | Exclude local Superpowers brainstorming artifacts from version control. |
| `ops/deploy-production.sh` | Define the complete remote release sequence, including seed before build. |
| `.github/workflows/deploy-production.yml` | Install the tracked remote release script and invoke it without mutating it. |
| `tests/deployment-workflow.test.ts` | Guard the release ordering and workflow's no-runtime-patch rule. |
| `CLAUDE.md` | State the actual CI release chain and the static-route/content release invariant. |
| `docs/SITE_CONSTRUCTION_PLAYBOOK.md` | Serve as the updated total product plan, scope statement, IA model, and release gate. |
| `docs/audits/2026-07-14-content-positioning-audit.md` | Record the content audit, prioritized gaps, remediation rules, and Codex prompts. |
| `docs/audits/2026-07-14-ui-ux-audit.md` | Record the UI/UX audit, acceptance criteria, and OpenDesign prompts. |

## Task 1: Guard the release behavior with a failing test

**Files:**
- Create: `tests/deployment-workflow.test.ts`
- Read: `ops/deploy-production.sh`
- Read: `.github/workflows/deploy-production.yml`

- [ ] **Step 1: Create the failing deployment-contract test**

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readProjectFile = (path: string) => readFileSync(path, "utf8");

test("production deployment seeds published content before building", () => {
  const script = readProjectFile("ops/deploy-production.sh");

  assert.match(
    script,
    /npx prisma migrate deploy\s+\n\s*npm run db:seed\s+\n\s*npm run build/,
  );
});

test("production workflow installs the tracked script without remote text patching", () => {
  const workflow = readProjectFile(".github/workflows/deploy-production.yml");

  assert.match(workflow, /uses: actions\/checkout@v4/);
  assert.match(workflow, /ops\/deploy-production\.sh/);
  assert.match(workflow, /sudo install -m 755/);
  assert.doesNotMatch(workflow, /sed\s+-i/);
});
```

- [ ] **Step 2: Run the test to verify the current release definition fails**

Run:

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/deployment-workflow.test.ts
```

Expected: FAIL because `ops/deploy-production.sh` lacks `npm run db:seed`, and the workflow lacks `actions/checkout@v4` while retaining a `sed -i` mutation.

- [ ] **Step 3: Keep the test focused on observable deployment invariants**

Do not assert secrets, host names, or incidental indentation. The test must only protect migration → seed → build ordering, GitHub Actions checkout of the tracked script, transfer/install of `ops/deploy-production.sh`, and absence of a remote text patch.

## Task 2: Make the tracked deployment script authoritative

**Files:**
- Modify: `ops/deploy-production.sh:39-45`
- Test: `tests/deployment-workflow.test.ts`

- [ ] **Step 1: Insert seed execution between migration and build**

Change the release commands to exactly this order:

```bash
cd "${APP_DIR}"
npm ci
npx prisma migrate deploy
npm run db:seed
npm run build
chown -R ubuntu:ubuntu "${APP_DIR}"
```

Do not add a reset, database push, or remote connection string handling. `npm run db:seed` already uses the server's environment configuration and the seed script performs idempotent upserts.

- [ ] **Step 2: Validate the shell syntax**

Run:

```bash
bash -n ops/deploy-production.sh
```

Expected: exit code 0 with no output.

- [ ] **Step 3: Re-run the deployment contract test**

Run:

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/deployment-workflow.test.ts
```

Expected: the seed-order assertion passes; the workflow assertion remains failing until Task 3.

## Task 3: Replace remote `sed` mutation with a tracked-script installation

**Files:**
- Modify: `.github/workflows/deploy-production.yml:17-35`
- Test: `tests/deployment-workflow.test.ts`

- [ ] **Step 1: Add repository checkout before SSH configuration**

Insert this workflow step before `Configure SSH`:

```yaml
      - uses: actions/checkout@v4
```

- [ ] **Step 2: Replace the `sed` deploy step with an explicit transfer-and-install step**

Replace the current remote `sed` command with:

```yaml
      - name: Install tracked deployment script
        env:
          DEPLOY_HOST: ${{ secrets.SYRTAG_DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.SYRTAG_DEPLOY_USER }}
        run: |
          scp -o BatchMode=yes -o ConnectTimeout=20 ops/deploy-production.sh "$DEPLOY_USER@$DEPLOY_HOST:/tmp/syrtag-deploy-production.sh"
          ssh -o BatchMode=yes -o ConnectTimeout=20 "$DEPLOY_USER@$DEPLOY_HOST" "sudo install -m 755 /tmp/syrtag-deploy-production.sh /var/www/syrtag.com/deploy-production.sh && rm /tmp/syrtag-deploy-production.sh"
```

Keep the subsequent `Deploy` step, which invokes `sudo /var/www/syrtag.com/deploy-production.sh`. The workflow must not use `sed`, invoke an untracked inline deployment procedure, or run migrations/builds outside the installed script.

- [ ] **Step 3: Run the deployment contract test**

Run:

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/deployment-workflow.test.ts
```

Expected: PASS.

- [ ] **Step 4: Review workflow syntax and changed semantics**

Run:

```bash
git diff --check -- .github/workflows/deploy-production.yml ops/deploy-production.sh tests/deployment-workflow.test.ts
```

Expected: exit code 0. Confirm manually that the workflow transfers the version-controlled script before execution and that no `sed -i` command remains.

## Task 4: Preserve planning artifacts without local-tool noise

**Files:**
- Modify: `.gitignore:39-41`

- [ ] **Step 1: Ignore the local brainstorming runtime directory**

Append:

```gitignore

# local agent brainstorming runtime
/.superpowers/
```

Do not ignore `docs/superpowers/`; approved specifications and plans remain tracked project documentation.

- [ ] **Step 2: Verify ignored and tracked documentation paths**

Run:

```bash
git check-ignore -v .superpowers/brainstorm/ 2>/dev/null || true
git status --short
```

Expected: `.superpowers/brainstorm/` is ignored; the design specification and implementation plan under `docs/superpowers/` remain visible as documentation changes.

## Task 5: Update the Claude Code operational guide

**Files:**
- Modify: `CLAUDE.md:35-41`

- [ ] **Step 1: Replace the production deployment statement with the actual release chain**

Replace the production portion with:

```md
Production deployments run from a push to `main`: GitHub Actions checks out the repository, copies `ops/deploy-production.sh` to `/var/www/syrtag.com/deploy-production.sh`, and executes it over SSH. The script fetches the target commit, runs `npm ci`, `npx prisma migrate deploy`, `npm run db:seed`, and `npm run build`, restarts `syrtag`, then probes the local service. CI does not run lint, tests, or a runner-side build.

For every public-content change, migrate when needed and seed before the build. Detail routes generate static parameters from published database slugs and use `dynamicParams = false`; a newly published slug is unavailable until a deployment rebuilds the application and sitemap.
```

- [ ] **Step 2: Check for stale deployment claims**

Run:

```bash
grep -nE "sed -i|migrate deploy|db:seed|dynamicParams|GitHub Actions" CLAUDE.md
```

Expected: the guide describes the tracked script transfer, seed-before-build order, and static-route constraint without mentioning a remote `sed` patch.

## Task 6: Update the total project plan with the approved positioning

**Files:**
- Modify: `docs/SITE_CONSTRUCTION_PLAYBOOK.md:1-55, 73-85, 164-174`

- [ ] **Step 1: Update the document version and current baseline**

Set the date to `2026-07-14` and document that local C1–C7 content remains unproven in production until deployment verification. Do not change any claimed corpus count without checking the seed corpus.

- [ ] **Step 2: Replace the generic value statement with the approved scope**

State that Syrtag is an English-language tool for Education and Sociology researchers moving from a research question to a defensible theory pathway through source-aware comparisons, concepts, and reading routes. Explicitly exclude cross-disciplinary coverage and “dissertation-ready framework” claims.

- [ ] **Step 3: Add the task-first information architecture model**

Document the primary navigation and path:

```text
Research Questions → Theory comparison → Theory guide → Concepts / Works / Scholars
```

Set primary navigation to Research Questions, Theories, Disciplines, Search, and About. Preserve Scholars, Works, and Concepts as secondary library assets and preserve their URLs.

- [ ] **Step 4: Add the release ordering to the production gate**

Add the non-negotiable sequence:

```text
migration (when required) → seed published corpus → build static routes and sitemap → deploy → probe representative public routes and sitemap
```

State that direct post-build database writes do not publish new entity URLs.

- [ ] **Step 5: Check the plan is internally consistent**

Run:

```bash
grep -nE "Education|Sociology|Research Questions|db:seed|dissertation-ready|static" docs/SITE_CONSTRUCTION_PLAYBOOK.md
```

Expected: scope, information architecture, and release gate agree with the approved design; no broad unsupported discipline promise remains.

## Task 7: Write the content positioning audit and Codex execution prompts

**Files:**
- Create: `docs/audits/2026-07-14-content-positioning-audit.md`
- Read: `src/data/seed-content.ts`
- Read: `docs/SITE_CONSTRUCTION_PLAYBOOK.md`
- Read: `src/components/content/TheoryArticle.tsx`
- Read: `src/lib/seo.ts`

- [ ] **Step 1: Write the content audit with evidence-based current assets**

Include the verified initial scope: two disciplines, six fields, twelve theories, four topics, four scholar profiles, nineteen works, and twenty-four concepts. State that the existing advantage is source-aware theory selection and comparison, not broad cross-disciplinary coverage.

- [ ] **Step 2: Record prioritized content and discoverability gaps**

List, in priority order: production static-route/sitemap integrity; narrow scope and English language consistency; homepage research-question and theory entry paths; task-oriented navigation and theory/topic index context; theory comparison and research-method pathway clusters using only existing entities; semantic SEO enhancement after public pages are stable. For each item, state the affected user task, the required correction, and what must not be claimed.

- [ ] **Step 3: Include five bounded Codex prompts**

The document must contain executable prompts in this order: read-only release and sitemap baseline verification; English homepage, scope, and navigation implementation; task-first index and breadcrumb improvements without URL changes; metadata/JSON-LD/sitemap semantic improvements using rendered published data only; content-cluster planning that stops before altering `seed-content.ts`.

Each prompt must define its file scope, constraints, verification commands, and a stop condition. It must forbid invented sources, scope expansion beyond Education and Sociology, empty recommendations, and unapproved deployment.

- [ ] **Step 4: Validate links and prohibited claims**

Run:

```bash
grep -nE "Psychology|Management|dissertation-ready|source-aware|Education|Sociology" docs/audits/2026-07-14-content-positioning-audit.md
```

Expected: excluded disciplines appear only as exclusions; the document does not call the current product a universal doctoral framework library.

## Task 8: Write the UI/UX audit and OpenDesign execution prompts

**Files:**
- Create: `docs/audits/2026-07-14-ui-ux-audit.md`
- Read: `src/app/globals.css`
- Read: `src/app/page.tsx`
- Read: `src/components/graph/GraphCanvas.tsx`
- Read: `src/components/graph/KnowledgeGraphExperience.tsx`
- Read: `src/components/graph/TheoryDetail.tsx`
- Read: `src/components/content/TheoryArticle.tsx`
- Read: `src/components/layout/Header.tsx`
- Read: `src/components/layout/Footer.tsx`

- [ ] **Step 1: State the UI positioning judgment**

Document that the content pages have useful academic-reading foundations, but the homepage graph and glass-heavy styling currently emphasize a visualized product experience over a rigorous, explainable research workbench.

- [ ] **Step 2: Capture P0/P1/P2 experience findings**

The audit must include P0 UI language mismatch; graph explanation, keyboard, semantic, focus, and reduced-motion gaps; unintegrated search interaction; P1 homepage task hierarchy, mobile freeform canvas dominance, long-article table of contents, full homepage frame/footer, navigation completeness, and 44px touch targets; and P2 index-grid styling, active state semantics, and ad/evidence separation.

Each item must name the user harm, the targeted outcome, and the relevant existing file paths.

- [ ] **Step 3: Include six sequenced OpenDesign prompts**

Write prompts for research-workbench visual direction and English-language rules; desktop and 375px homepage task-first redesign; explainable graph workspace and node details; theory-detail reading structure; search, indexes, and mobile task flow; and WCAG 2.2 AA design acceptance.

Every prompt must preserve the existing entity model and URL set, avoid SaaS/marketing visual tropes, require real content density, and name the relevant responsive/accessibility constraints.

- [ ] **Step 4: Validate the audit has a concrete acceptance layer**

Run:

```bash
grep -nE "WCAG|375px|keyboard|reduced-motion|44px|Research Questions" docs/audits/2026-07-14-ui-ux-audit.md
```

Expected: each major user-facing change has a testable desktop, mobile, or accessibility acceptance criterion.

## Task 9: Run the complete Phase A verification pass

**Files:**
- Verify: `.gitignore`
- Verify: `ops/deploy-production.sh`
- Verify: `.github/workflows/deploy-production.yml`
- Verify: `tests/deployment-workflow.test.ts`
- Verify: `CLAUDE.md`
- Verify: `docs/SITE_CONSTRUCTION_PLAYBOOK.md`
- Verify: `docs/audits/2026-07-14-content-positioning-audit.md`
- Verify: `docs/audits/2026-07-14-ui-ux-audit.md`

- [ ] **Step 1: Run the focused release contract test**

Run:

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/deployment-workflow.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run the existing project test suite**

Run:

```bash
npm test
```

Expected: PASS. If the environment lacks a database, record only the tests that are intentionally database-dependent and fail for that demonstrated reason; do not skip them.

- [ ] **Step 3: Run lint and production build**

Run:

```bash
npm run lint
npm run build
```

Expected: both exit with code 0. The build may require `DATABASE_URL` because static parameters and sitemap derive from published database records; report this condition honestly rather than claiming production readiness from a partial build.

- [ ] **Step 4: Inspect the final diff for scope and release safety**

Run:

```bash
git diff --check
git diff -- .gitignore ops/deploy-production.sh .github/workflows/deploy-production.yml tests/deployment-workflow.test.ts CLAUDE.md docs/SITE_CONSTRUCTION_PLAYBOOK.md docs/audits/2026-07-14-content-positioning-audit.md docs/audits/2026-07-14-ui-ux-audit.md
git status --short
```

Expected: no whitespace errors; no remote `sed` deployment patch; no production deployment invoked; only Phase A files changed, plus the approved spec and this plan.
