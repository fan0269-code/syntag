# Content Update Standard

**Status:** Active  
**Applies from:** 2026-08-02  
**Scope:** Corrections, source changes, claim revisions, relation changes, status changes, and maintenance of existing Syrtag content

## 1. Purpose

This standard keeps existing content accurate, traceable, and reversible. It defines when an update is required, how risk determines review depth, which checks must run, and what “updated” means at each layer.

An update is complete only for the layer explicitly reported. A research note, corpus edit, passing build, commit, and public deployment are not interchangeable.

## 2. Update Triggers

Open a bounded update package when any of the following occurs:

- a primary or authoritative source is newly available;
- bibliographic identity, edition, DOI, ISBN, date, or attribution changes;
- a source link dies or no longer reproduces the cited support;
- a claim is found to be unsupported, overstated, ambiguous, or copied from the wrong edition;
- a reviewer issues a correction or new decision;
- two entity records contradict each other;
- a genealogy relation has weak direction, type, or causal wording;
- a public route exposes draft or pending content;
- structured user feedback identifies confusion or an unmet research question;
- Search Console data shows a stable query-page mismatch;
- a scheduled review date is reached;
- code or schema changes alter how content, sources, badges, indexing, or navigation render.

Do not update content solely because it “feels old.” Name the trigger and affected claim or surface.

## 3. Priority

| Priority | Definition | Response target |
|---|---|---|
| P0 | Materially false or unsafe claim, wrong attribution, broken publication boundary, hidden evidence risk, or public draft exposure | Triage immediately; hide or correct only with the minimum authorized action |
| P1 | Substantive evidence gap, misleading synthesis, broken key route, or stale flagship guidance | Put into the next bounded content package |
| P2 | Minor wording, metadata, link, formatting, or navigation improvement with no material meaning change | Batch during scheduled maintenance |

P0 priority does not remove the need for evidence and authorization. It narrows the response to the safest reversible action.

## 4. Change Classes

| Class | Examples | Required review |
|---|---|---|
| U0 — Metadata | corrected DOI, ISBN, URL, edition label, access date | source identity check; focused review |
| U1 — Claim wording | definition, attribution, limitation, mechanism, guidance wording | claim ledger update and row-level human decision |
| U2 — Structure or relation | section moves, comparison route, genealogy edge, endpoint, relation direction | impact audit, evidence review, affected-route tests |
| U3 — Publication state | draft/published, indexing, sitemap, advertising, public visibility | explicit owner authorization and full release gate |

When one package contains multiple classes, use the highest class.

## 5. Required Baseline

Before editing:

1. record the branch and current commit;
2. run `git status --short --branch`;
3. record existing modified and untracked files;
4. identify the exact content entity, claim IDs, field paths, and routes affected;
5. identify the source, review record, tests, seed paths, and derived output affected;
6. define an allowlist and denylist;
7. state the strongest authorized outcome: research only, review only, local implementation, commit, or publication.

Preserve unrelated dirty work. Do not use reset, restore, checkout, stash, clean, mass formatting, or broad staging to manufacture a clean baseline.

## 6. Source Reverification

For every changed substantive claim:

- open the actual source or authoritative record;
- confirm title, author/organization, edition, identifier, and URL;
- reproduce the support at the named locator;
- record the real check date as `verifiedAt`;
- confirm whether the source supports the complete wording or only part of it;
- classify the wording as `source_backed_fact`, `editorial_synthesis`, or `research_guidance`;
- record discrepancies and access limitations.

Never derive `verifiedAt` from:

- source publication date;
- corpus batch date;
- file creation or modification date;
- commit date;
- an earlier researcher’s unchecked note.

If access is snippet-only or the locator cannot be reproduced, keep the claim pending or remove it from the proposed public wording.

## 7. Claim and Relation Update Rules

### 7.1 Claim changes

- Keep the existing stable claim ID.
- Update the exact `fieldPath` if the schema moved.
- Preserve the previous wording in the review record or Git history.
- Record proposed wording, source IDs, locator, evidence status, and rationale.
- Obtain a row-level review decision for U1, U2, and U3 changes.
- Do not treat a source update as automatic approval of new prose.

### 7.2 Relation changes

For every genealogy relation:

- verify both endpoint IDs and public routes;
- verify association, direction, and relation type separately;
- record the public description and its source locator;
- evaluate whether causal or influence language is justified;
- run affected graph, path, and entity-route tests;
- keep the relation hidden or pending if the direction cannot be supported.

Do not add relations to improve graph density or visual balance.

### 7.3 Status changes

Moving content from draft or pending to public requires:

- completed evidence fields;
- completed human review fields;
- explicit implementation authorization;
- passing local validation;
- explicit publication authorization.

Moving content from public to hidden or corrected should use the smallest reversible action consistent with the risk and owner authorization.

## 8. Update Workflow

### Step 1: Intake

Record:

- trigger;
- priority;
- change class;
- exact entities, routes, claim IDs, and field paths;
- reporter and date;
- user impact;
- proposed strongest outcome.

### Step 2: Impact analysis

Inspect:

- corpus data and templates;
- source and verification records;
- claim-audit and human-review documents;
- seed or migration behavior;
- related routes, comparisons, graph edges, search, sitemap, metadata, and advertising eligibility;
- focused tests and generated output.

Do not assume a one-field edit has only one public surface.

### Step 3: Research and proposal

- reverify sources;
- update the source register and claim ledger;
- draft exact replacement wording;
- list unchanged surrounding content;
- state risks and unresolved questions.

Research records remain separate from corpus data.

### Step 4: Human review

For each affected row, record:

- reviewer identity;
- reviewer role;
- real review date;
- decision;
- rationale;
- approved wording or bounded revision instruction.

The accepted decisions are `accept_as_worded`, `accept_with_revision`, `reject`, and `pending_review`.

### Step 5: Implementation authorization

Before editing corpus or publication controls, obtain explicit authorization covering:

- exact file allowlist;
- entity and claim scope;
- treatment of rejected and pending rows;
- whether the work may reach only local verification, commit, or publication.

No authorization means stop after research and review records.

### Step 6: Implement the minimum change

- edit only authorized fields and direct tests;
- preserve IDs and route contracts unless the package explicitly changes them;
- avoid unrelated rewrites;
- update source, claim, and review metadata together where the contract requires them;
- keep draft or pending content out of public output.

### Step 7: Validate

Use the ordered gates in Section 9.

### Step 8: Record and hand off

Update the required Obsidian review record with:

- branch and baseline/result commit when available;
- changed files;
- content summary;
- planning basis;
- academic sources;
- actual verification results;
- publication-status boundary;
- risks;
- owner decision needed.

Set:

```yaml
status: review
needs_human_review: true
owner_decision: pending
deployment_status: not_started
```

Do not mark preview, deployment, approval, indexing, or publication complete on the owner’s behalf.

## 9. Validation Gates

Run only commands supported by the authorized package and local environment, but preserve this order:

```bash
npm run content:check
npm run typecheck
node --experimental-strip-types --test tests/<focused-test>.test.ts
npm test
npm run lint
```

If typed corpus or Prisma seed data changed:

```bash
npm run db:migrate
npm run db:seed
npm run db:seed
```

The second seed verifies idempotence. Never run `db:reset` against shared or production data.

Then run:

```bash
npm run build
node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts
npm run test:e2e
git diff --check
```

Validation rules:

- Replace `tests/<focused-test>.test.ts` with the exact affected test file or files.
- Record a command as `passed`, `failed`, or `not_run` with a reason.
- Do not weaken, skip, or delete a failing test to claim completion.
- A database check is not passed if the database was unavailable.
- A browser check is not passed if it used stale build or seed output.
- A local `READY` state or passing launch check is not proof of public deployment.

## 10. Derived Surfaces to Recheck

Depending on the affected fields, inspect:

- theory, Topic, scholar, work, concept, discipline, and field routes;
- genealogy and learning-path surfaces;
- search results and filters;
- source blocks and verification badges;
- metadata, canonical URLs, sitemap, robots directives, and indexing status;
- draft visibility and advertising eligibility;
- structured data;
- generated Prisma seed output;
- mobile layout and accessibility for changed UI copy.

The impact analysis must name which surfaces apply and which do not.

## 11. Release and Rollback Boundary

### 11.1 Before commit

- provide the exact diff;
- confirm no unrelated file was changed;
- list validation results;
- list remaining pending decisions;
- request commit authorization if commit is desired.

### 11.2 Before deployment

- identify the exact approved commit;
- confirm migration and environment requirements;
- rerun the required clean-snapshot release gates;
- request explicit deployment authorization;
- record the resulting public checks separately from local checks.

### 11.3 Correction or rollback

Prefer the smallest reversible correction:

1. hide or disable the affected draft/public surface if ongoing exposure is materially risky and authorized;
2. restore supported wording through a normal scoped change;
3. remove or revise the relation while retaining an audit trail;
4. issue a public correction note when the error materially affected interpretation.

Do not use destructive Git operations as a rollback mechanism in a dirty worktree.

## 12. Maintenance Cadence

### Weekly

- check newly reported broken links and source-access failures;
- review P0/P1 content risks;
- inspect draft/public boundary failures;
- verify that active content packages have exact owners and next gates.

### Monthly

- review priority D3 and high-traffic pages;
- compare Search Console queries with page intent when real data is available;
- review user-research observations when real sessions exist;
- check source, badge, and navigation consistency;
- select one bounded update package.

### Quarterly

- re-audit D3 flagship claim ledgers;
- re-audit all public genealogy relations;
- review a sample of D2/D1 pages for depth and source quality;
- review source-risk concentration, dead links, and edition drift;
- reassess expansion eligibility against the approved density, coverage, evidence, and demand gates.

### Event-driven

Run an immediate bounded review for:

- credible correction reports;
- public draft exposure;
- broken indexing or publication controls;
- a source retraction or material bibliographic correction;
- a discovered false attribution or unsupported causal relation.

## 13. Update Stop Conditions

Stop and report when:

- the exact target or expected outcome is ambiguous;
- required source access or a locator is missing;
- sources materially conflict;
- a human decision is missing;
- the package would modify files outside its allowlist;
- the change requires a schema, route, or publication-policy decision not included in authorization;
- tests fail outside the package scope;
- the baseline changes during execution;
- commit or deployment is requested without identifying the approved diff or commit.

## 14. Update Completion Checklist

An update package is ready for handoff only when:

- [ ] trigger, priority, and change class are recorded;
- [ ] baseline and dirty files are recorded;
- [ ] exact claims, fields, entities, and routes are identified;
- [ ] sources and locators are reverified;
- [ ] actual verification dates are recorded;
- [ ] content nature and evidence status remain separate;
- [ ] required human decisions are explicit;
- [ ] implementation authorization is recorded;
- [ ] only authorized files and fields changed;
- [ ] affected derived surfaces were inspected;
- [ ] applicable validation gates ran in order;
- [ ] failed or unrun gates are reported truthfully;
- [ ] the Obsidian review record is updated;
- [ ] commit and deployment states are stated separately;
- [ ] owner decisions and remaining risks are listed.

## 15. Handoff Report Template

Use this compact structure:

```markdown
# Content Update Handoff

## Scope
- Trigger:
- Priority and class:
- Entities, claims, and routes:
- Authorized outcome:

## Evidence and review
- Sources reverified:
- Human decisions:
- Pending or blocked rows:

## Changes
- Files:
- Public behavior:
- Draft/public boundary:

## Verification
- Passed:
- Failed:
- Not run:

## State
- Research:
- Human review:
- Corpus implementation:
- Local verification:
- Commit:
- Deployment:

## Owner decision needed
- Decision:
- Risk if deferred:
```

Do not replace any state with the unqualified word “done.”
