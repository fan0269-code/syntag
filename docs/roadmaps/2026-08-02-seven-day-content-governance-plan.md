# Seven-Day Content Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Between 2026-08-03 and 2026-08-09, close the highest-risk content-governance gaps around the two D3 flagship theories, the eight existing genealogy relations, and the remaining Topic pilot review decisions, without expanding the corpus or publishing unreviewed material.

**Architecture:** Work source-first and claim-first. Each public-facing claim moves through a research package, a structured claim ledger, human review, an explicitly authorized corpus change, local validation, and a separate publication decision. The week ends with one bounded next implementation package, not an open-ended content backlog.

**Tech Stack:** Markdown research records, typed TypeScript corpus data, Prisma seed data, Node test runner, ESLint, Next.js build, Playwright/axe, and the project Obsidian review-record workflow.

## Global Constraints

- The operating timezone is Asia/Shanghai. The seven working dates are 2026-08-03 through 2026-08-09.
- This is a credibility-and-closure week, not an expansion week. Do not add a discipline, field, theory page, Topic page, scholar, work, concept, or genealogy edge merely to increase counts.
- Preserve the current dirty worktree. Do not reset, restore, checkout, stash, clean, overwrite, or reformat unrelated files.
- Treat the current branch as two commits behind `main` until a fresh Git audit proves otherwise. Do not merge, rebase, cherry-pick, or reconcile branches under this plan.
- Research Markdown, human-review records, corpus data, commit state, and deployment state are separate layers. A finished research record does not authorize a corpus edit; a passing local gate does not authorize a commit or deployment.
- Do not infer approval. Only an explicit reviewer identity, review date, and row-level decision can move a claim or relation out of `pending_review`.
- Keep unsupported facts `pending_review`, `partially_supported`, or `verification-pending`. Never convert file dates, batch dates, publication dates, or inferred dates into `verifiedAt`.
- Do not commit, push, open a pull request, modify a remote service, or deploy without separate owner authorization.
- Follow [Content Writing Standard](../standards/content-writing-standard.md) for every draft and [Content Update Standard](../standards/content-update-standard.md) for every change to existing content.

## Verified Starting Point

This plan uses the local repository snapshot audited on 2026-08-02:

- The public/technical MVP is mature, but local P0 source-risk hardening remains unclosed in a dirty worktree.
- The corpus currently covers 2 disciplines, 6 fields, 12 theories, 7 published scholars, 19 works, 24 concepts, 4 published Topics, and 4 draft Topics.
- The 12 theories comprise 2 D3 pages, 4 D2 pages, and 6 D1 pages. The two D3 pages are the only pages deep enough to serve as flagship trust pages.
- The current evidence layer has verification records, but most records still lack claim-level fields such as a locator, reviewer role, and review decision.
- The graph has 8 existing genealogy relations. Current density and coverage are below the approved expansion threshold, so new-node expansion remains blocked.
- The Teacher Professional Learning and Change Topic pilot contains 52 reviewed rows: 14 accepted as worded, 29 requiring revision, and 9 still pending as `research_guidance`.
- Search Console evidence and real user-research observations are not yet available. Topic expansion therefore cannot be justified by measured demand during this week.

If a fresh audit contradicts any starting-point statement, record the discrepancy and use the fresh evidence. Do not silently preserve a stale number.

## Weekly Acceptance Criteria

The week is complete only when all of the following are true:

- [ ] The current source-risk hardening work has an explicit local verification record and unresolved failures are listed.
- [ ] `life-course-theory.md` contains a complete claim ledger for every page-defining public claim in the current D3 article.
- [ ] `teacher-identity-theory.md` contains a complete claim ledger for every page-defining public claim in the current D3 article.
- [ ] Every one of the eight existing genealogy relations has a row-level evidence and review record.
- [ ] The nine pending `research_guidance` rows in the Topic pilot either have explicit human decisions or remain visibly pending with a named blocker.
- [ ] No research record is misrepresented as approved corpus content.
- [ ] No new discipline, field, entity, page, or relation has been added.
- [ ] One and only one next implementation package is proposed with an allowlist, denylist, verification commands, acceptance criteria, and stop rules.
- [ ] The weekly closeout states separately whether research, human review, corpus implementation, local verification, commit, and deployment are complete.

## Daily Operating Rhythm

Use the same four checkpoints each day:

1. **Start:** record the exact baseline, source files, intended output, and files allowed to change.
2. **Research or review:** work only on the day’s bounded package; record uncertainty instead of filling gaps.
3. **Gate:** run the day-specific checks and compare the output with its acceptance criteria.
4. **Close:** record results, unresolved blockers, owner decisions needed, and the next day’s starting condition.

Stop the day’s package when any of these conditions occurs:

- a required primary or authoritative source cannot be accessed;
- a locator cannot be reproduced;
- a human decision is required but no human reviewer has supplied it;
- a task would require changing corpus data before explicit implementation authorization;
- a test failure appears outside the day’s allowlist;
- the working tree or branch baseline differs materially from the recorded baseline.

---

## Day 1 — 2026-08-03: Close the Current P0 Baseline

**Purpose:** Turn the existing source-risk hardening work into a trustworthy, reviewable local baseline before doing more content research.

**Allowed files:**

- `docs/roadmaps/2026-07-28-source-risk-hardening.md`
- the files already modified by that bounded implementation
- the directly affected focused tests
- one Obsidian review record required by `AGENTS.md`

**Denied work:**

- new corpus entities or relations;
- broad copy editing;
- branch reconciliation;
- commit, push, deployment, or public verification claims.

### Task 1.1: Re-audit the baseline

- [ ] Run `git status --short --branch`.
- [ ] Run `git rev-list --left-right --count origin/main...HEAD`.
- [ ] Save the modified and untracked file list in the Day 1 execution record.
- [ ] Confirm that no planned file falls outside the existing source-risk-hardening scope.

**Acceptance:** The branch, divergence, dirty files, and allowed scope are written down before any edit.

### Task 1.2: Reconcile the one stale E2E expectation

- [ ] Inspect the current public copy and the failing assertion together.
- [ ] If the UI copy is the already reviewed source-risk wording, update only the stale assertion.
- [ ] If the UI copy itself is unreviewed, stop and request an owner decision instead of changing either side.
- [ ] Run the narrow E2E test that contains the assertion.

**Acceptance:** The test checks the intended reviewed behavior; it is not weakened, skipped, or deleted.

### Task 1.3: Run the local release gates

Run in this order:

```bash
npm run content:check
npm run typecheck
npm test
npm run lint
npm run db:migrate
npm run db:seed
npm run db:seed
npm run build
node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts
npm run test:e2e
git diff --check
```

- [ ] Record each command, exit result, and any environment limitation.
- [ ] Run the database commands only against the approved local database; the second seed is the idempotence check.
- [ ] Do not label an unrun database or browser check as passing.
- [ ] Update the execution record in `docs/roadmaps/2026-07-28-source-risk-hardening.md`.

**Acceptance:** All required gates pass, or the exact failing gate and blocker are recorded. The strongest allowed outcome is “local release candidate,” not “published.”

### Day 1 closeout

- [ ] Create or update the required Obsidian review record.
- [ ] Set `status: review`, `needs_human_review: true`, `owner_decision: pending`, and `deployment_status: not_started`.
- [ ] Stop before commit or deployment.

---

## Day 2 — 2026-08-04: Complete the Life Course Theory Claim Ledger

**Purpose:** Make the Life Course D3 flagship independently auditable at claim level.

**Primary output:** `docs/research/claim-audit/life-course-theory.md`

**Read-only inputs:**

- current Life Course corpus record and rendered sections;
- `docs/research/2026-07-13-life-course-theory-c2.md`;
- `docs/research/2026-07-20-life-course-evidence-r0.md`;
- `docs/research/2026-07-20-life-course-evidence-r2.md`;
- `docs/research/2026-07-20-life-course-r2-sources.md`;
- registered primary or authoritative sources.

### Task 2.1: Inventory page-defining claims

- [ ] Walk the current page section by section.
- [ ] Create one row for every definition, origin/history statement, named attribution, mechanism, relationship, limitation, and research-use recommendation.
- [ ] Give each row a stable claim ID and exact corpus `fieldPath`.
- [ ] Copy only enough current wording to identify the claim; do not create a second full article in the audit file.

**Acceptance:** Every public section maps to at least one ledger row, and every high-risk factual or attribution claim has its own row.

### Task 2.2: Verify sources and locators

- [ ] Classify each row as `source_backed_fact`, `editorial_synthesis`, or `research_guidance`.
- [ ] Record source ID, source type, reproducible locator, and the real access/verification date.
- [ ] Separate bibliographic identity verification from substantive claim support.
- [ ] Mark partial support explicitly where a source supports only part of the wording.

**Acceptance:** A reviewer can open the named source and reproduce the support without guessing.

### Task 2.3: Prepare human-review state

- [ ] Record `evidence_status` as `verified`, `partially_supported`, `pending_review`, or `blocked`.
- [ ] Record the separate `review_readiness` field as `ready_for_human_review`, `partially_supported`, or `blocked`.
- [ ] Leave reviewer, reviewed date, and review decision empty until supplied by a human.
- [ ] Add a concise blocker for every non-ready row.
- [ ] Do not edit corpus data.

**Acceptance:** The ledger is complete enough for review and contains no inferred approvals.

---

## Day 3 — 2026-08-05: Complete the Teacher Identity Theory Claim Ledger

**Purpose:** Apply the same claim-level evidence contract to the second D3 flagship.

**Primary output:** `docs/research/claim-audit/teacher-identity-theory.md`

**Read-only inputs:**

- current Teacher Identity corpus record and rendered sections;
- the relevant C2/C3 research notes;
- registered primary or authoritative sources;
- the completed Life Course ledger as a structural example only.

### Task 3.1: Inventory page-defining claims

- [ ] Inventory definitions, theoretical framing, named attribution, mechanisms, contextual variation, limitations, relationships, and research guidance.
- [ ] Assign stable claim IDs and exact `fieldPath` values.
- [ ] Split compound claims when different sources or review decisions are required.
- [ ] Preserve theory-specific nuance; do not mechanically copy Life Course wording.

**Acceptance:** Every public section is covered and no compound claim hides mixed evidence.

### Task 3.2: Verify and classify

- [ ] Register or reconcile each source against the repository source data.
- [ ] Add reproducible locators and actual verification dates.
- [ ] Distinguish scholarly disagreement or variation from factual uncertainty.
- [ ] Mark editorial synthesis and research guidance as their own content natures.

**Acceptance:** Each row has sufficient evidence metadata for an independent reviewer.

### Task 3.3: Prepare human-review state

- [ ] Record `evidence_status` and the separate `review_readiness` field; do not put `ready_for_human_review` into `evidence_status`.
- [ ] Add the exact question a reviewer must decide for ambiguous rows.
- [ ] Do not mark any row accepted and do not edit corpus data.

**Acceptance:** The second D3 package is ready for the same row-level review process as the first.

---

## Day 4 — 2026-08-06: Human Review of Both D3 Packages

**Purpose:** Obtain explicit decisions without collapsing evidence verification, editorial judgment, and publication approval into one status.

**Required human input:** A reviewer identity, reviewer role, real review date, and row-level decisions.

### Task 4.1: Validate review readiness

- [ ] Confirm that both ledgers cover all current page sections.
- [ ] Confirm that every `source_backed_fact` row has a source and locator.
- [ ] Confirm that every `editorial_synthesis` and `research_guidance` row is visibly classified.
- [ ] Produce a short list of blocked rows before the reviewer starts.

**Acceptance:** The reviewer is not asked to review incomplete or structurally inconsistent ledgers.

### Task 4.2: Record decisions

For each row, the human reviewer chooses exactly one:

- `accept_as_worded`
- `accept_with_revision`
- `reject`
- `pending_review`

- [ ] Record reviewer identity, role, date, decision, and concise rationale.
- [ ] For `accept_with_revision`, record the approved wording or a bounded revision instruction.
- [ ] For `pending_review`, record the missing evidence or decision.
- [ ] Do not convert a theory-level approval into automatic approval of every row.

**Acceptance:** Every changed review status is backed by an explicit human decision.

### Task 4.3: Decide whether implementation may be planned

- [ ] Count accepted, revision, rejected, and pending rows separately for each theory.
- [ ] Identify corpus fields affected by accepted revisions.
- [ ] Ask the owner for a separate Stage C implementation authorization.
- [ ] If authorization is absent, stop with the research and review layers complete.

**Acceptance:** No corpus edit occurs during Day 4.

---

## Day 5 — 2026-08-07: Audit the Eight Existing Genealogy Relations

**Purpose:** Improve trust in the existing graph before adding graph breadth.

**Primary output:** `docs/research/genealogy-audit/2026-08-07-existing-relations-review.md`

**Read-only inputs:**

- current corpus relation records;
- `docs/research/genealogy-audit/2026-07-17-existing-relations.md`;
- the relevant theory and source records.

### Task 5.1: Inventory all current relations

- [ ] Create exactly one audit row per existing relation.
- [ ] Record source node, target node, relation type, public description, and current visibility.
- [ ] Confirm that both endpoints exist and resolve.
- [ ] Do not create a new relation to improve density.

**Acceptance:** The number of audit rows equals the number of existing public genealogy relations.

### Task 5.2: Verify relation semantics

- [ ] Classify each relation statement as fact, editorial synthesis, or interpretive/research guidance.
- [ ] Record the source, locator, verification date, and whether the source supports direction as well as association.
- [ ] Check whether the relation label overstates causality, derivation, influence, or opposition.
- [ ] Propose `keep`, `revise`, `hide`, or `remove` as a review recommendation, not an automatic action.

**Acceptance:** Every relation has reproducible support or a visible evidence gap.

### Task 5.3: Obtain row-level review

- [ ] Record human reviewer identity, role, date, decision, and rationale when provided.
- [ ] Leave undecided rows pending.
- [ ] Calculate density and coverage as diagnostics only.
- [ ] Keep expansion status `No-Go` unless all previously approved thresholds are independently met.

**Acceptance:** The audit can support a later bounded relation-cleanup package without authorizing it.

---

## Day 6 — 2026-08-08: Close the Topic Pilot Review Decision Set

**Purpose:** Resolve the remaining nine `research_guidance` rows in the Teacher Professional Learning and Change Topic pilot, or document why they remain unresolved.

**Primary output:** `docs/research/2026-07-26-teacher-professional-learning-and-change-human-review.md`

**Governing plan:** `docs/roadmaps/2026-07-23-topic-pilot-review-plan.md`

### Task 6.1: Isolate the nine pending rows

- [ ] Confirm the row IDs and current wording.
- [ ] Confirm that each remains classified as `research_guidance`.
- [ ] Present the source context, conditional wording, and the precise review question.
- [ ] Do not reopen the 43 already decided rows unless a concrete contradiction is discovered.

**Acceptance:** The reviewer sees a bounded nine-row package rather than the full 52-row matrix.

### Task 6.2: Record human decisions

- [ ] Record one of the four approved decisions for each row.
- [ ] Preserve conditional language where methodological applicability depends on design, data, site, population, or ethics.
- [ ] Record reviewer identity, role, date, and rationale.
- [ ] If a row cannot be decided, retain `pending_review` and name the missing evidence or expertise.

**Acceptance:** Either all nine rows have explicit decisions or the remaining pending set has exact blockers.

### Task 6.3: Evaluate the Stage B gate

- [ ] Recount all 52 decisions from the file rather than copying an earlier total.
- [ ] Mark Stage B complete only if its documented requirements are actually met.
- [ ] Keep Stage C unauthorized until the owner explicitly approves a corpus implementation package.
- [ ] Do not update the Topic corpus or expose draft Topics.

**Acceptance:** The status accurately represents human review; it does not imply implementation or publication.

---

## Day 7 — 2026-08-09: Weekly Closure and One Next Package

**Purpose:** Convert the week’s evidence into one bounded next action and prevent a return to open-ended content accumulation.

**Primary output:** `docs/roadmaps/2026-08-09-content-governance-weekly-closeout.md`

### Task 7.1: Audit deliverables

- [ ] Re-run row counts for both D3 ledgers, the genealogy audit, and the Topic pilot.
- [ ] Check for missing source IDs, locators, verification dates, reviewer fields, decisions, and blockers.
- [ ] Check that no research date has been reused as a false verification or review date.
- [ ] Run `git diff --check`.

**Acceptance:** Counts are reproducible and structural gaps are listed, not hidden.

### Task 7.2: Report status by layer

For each package, report these states independently:

| Layer | Allowed status values |
|---|---|
| Research | not_started / in_progress / complete / blocked |
| Human review | not_started / in_progress / complete / blocked |
| Corpus implementation | not_authorized / authorized / in_progress / complete |
| Local verification | not_run / partial / passed / failed |
| Commit | not_authorized / authorized / complete |
| Deployment | not_authorized / authorized / complete |

- [ ] Name every unresolved risk.
- [ ] Name every decision still required from the owner.
- [ ] Do not use “complete” without naming the completed layer.

**Acceptance:** A reader cannot mistake research completion for publication completion.

### Task 7.3: Select one next implementation package

Choose in this priority order:

1. P0 local source-risk hardening closure, if Day 1 is still failing.
2. Approved D3 claim revisions, if Day 4 has complete decisions and implementation authorization.
3. Approved cleanup of existing genealogy relations, if Day 5 has complete decisions and implementation authorization.
4. Approved Topic pilot revisions, if Day 6 completed Stage B and implementation is separately authorized.
5. No corpus package; continue evidence or human review if none of the above is eligible.

The selected package must contain:

- [ ] one outcome statement;
- [ ] an exact file allowlist;
- [ ] an explicit denylist;
- [ ] ordered implementation steps;
- [ ] focused and full validation commands;
- [ ] acceptance criteria;
- [ ] stop conditions;
- [ ] a statement that commit and deployment require separate authorization.

**Acceptance:** Exactly one next package is selected. The week does not end with parallel implementation tracks.

## Weekly Scorecard

Use this scorecard in the Day 7 closeout:

| Metric | Starting value | Week-end target |
|---|---:|---:|
| D3 theories with complete claim ledgers | audit on Day 2 | 2 |
| Existing genealogy relations with row-level audits | audit on Day 5 | all current relations |
| Topic pilot rows with explicit decisions | 43 of 52 | 52 of 52, or exact blockers |
| New corpus entities | 0 | 0 |
| New genealogy relations | 0 | 0 |
| Unauthorized corpus changes | 0 | 0 |
| Unauthorized commits or deployments | 0 | 0 |

The target is governance completeness, not a word count or page-count increase.

## Plan Completion Definition

This seven-day plan is completed when the Weekly Acceptance Criteria are satisfied and the Day 7 closeout selects one eligible next package. If human review or source access blocks completion, the plan may end in a truthful blocked state with exact row IDs and required decisions; it must not manufacture approval or broaden scope to compensate.
