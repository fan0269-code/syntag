# Genealogy fail-closed U3 decision package

> Issue: FAN-48  
> Company: fan l w  
> Mission context: fanlw  
> Review date: 2026-08-14, Asia/Shanghai  
> Status: pre-review recommendation only  
> Boundary: no corpus, database, relation, publication-state, commit, merge, deployment, sitemap, indexing, or production change is authorized by this document.

## Decision summary

Recommend that the owner approve the U3 public-visibility policy below:

1. Public genealogy uses an evidence- and human-decision-complete allowlist.
2. The allowlist is initially empty, so the 8 canonical relations remain stored internally but 0/8 are public.
3. A relation may enter the allowlist only after its association, direction, type, public wording, source/locator, evidence status, real verification date, row-level human decision, and a separate owner release decision are complete.
4. Accepting this U3 decision authorizes only the exact visibility-policy package described here to enter the local implementation/verification gate. It does not authorize a commit, merge, deployment, indexing change, or publication.

This is the smallest reversible response to the P0 boundary risk. Keeping the current production behavior would continue exposing all eight pending editorial relations. Deleting corpus or database rows is unnecessary and is outside scope.

## Frozen baseline

- Captured: `2026-08-14 01:43:33 CST`.
- Branch: `feature/content-enrichment-batch-1`.
- HEAD: `c177740156ad834515f95cf83076e1498240cd9d`.
- Relative to `origin/feature/content-enrichment-batch-1`: ahead 1, behind 0.
- Relative to `origin/main`: ahead 1, behind 2.
- Dirty worktree: 42 tracked modified files and 40 individually enumerated untracked files when `--untracked-files=all` is used.
- Pre-package short-status fingerprint: `sha256:840d0f75ce0350cabc58f0cef7ec81d6c044f9613e37862ef576427c67a7ff93` using the default collapsed untracked-directory view.
- Strongest authorized outcome at capture: decision package and review request only.
- Existing work is preserved; this package does not claim unrelated dirty changes.

### Exact dirty-file manifest at capture

```text
 M AGENTS.md
 M docs/roadmaps/2026-07-28-source-risk-hardening.md
 M prisma/schema.prisma
 M prisma/seed.ts
 M prompts/README.md
 M src/app/about/page.tsx
 M src/app/framework-builder/page.tsx
 M src/app/page.tsx
 M src/app/styles/content.css
 M src/app/topics/[slug]/page.tsx
 M src/app/works/[slug]/page.tsx
 M src/app/works/page.tsx
 M src/components/common/SourceBlock.tsx
 M src/components/common/VerificationBadge.tsx
 M src/components/content/EntityArticle.tsx
 M src/components/content/PathwayContentSections.tsx
 M src/components/content/TheoryArticle.tsx
 M src/components/layout/Footer.tsx
 M src/components/seo/JsonLdGraph.tsx
 M src/data/corpus/content-batches/2026-07-18-first-enrichment.ts
 M src/data/corpus/content-batches/2026-07-19-goodson-day-draft-scholars.ts
 M src/data/corpus/shared/entities.ts
 M src/lib/content-validation.ts
 M src/lib/entities/indexes.ts
 M src/lib/entities/theories.ts
 M src/lib/graph-data.ts
 M src/lib/internal-links.ts
 M src/lib/knowledge-entity-presentation.ts
 M src/lib/seed-verification.ts
 M src/lib/seo.ts
 M src/lib/theory-presentation.ts
 M tests/content-ui-contract.test.ts
 M tests/content-validation.test.ts
 M tests/e2e/content-enrichment.spec.ts
 M tests/e2e/smoke-a11y.spec.ts
 M tests/graph-data.test.ts
 M tests/second-scholar-enrichment.test.ts
 M tests/seed-corpus-regression.test.ts
 M tests/seed-integration.test.ts
 M tests/seo.test.ts
 M tests/theory-presentation.test.ts
 M tests/theory-static-ui.test.ts
?? .agents/skills/academic-claim-audit/SKILL.md
?? .agents/skills/academic-claim-audit/agents/openai.yaml
?? .agents/skills/academic-literature-review/SKILL.md
?? .agents/skills/academic-literature-review/agents/openai.yaml
?? .agents/skills/content-audit-agent/SKILL.md
?? .agents/skills/content-audit-agent/agents/openai.yaml
?? .agents/skills/content-independent-review-agent/SKILL.md
?? .agents/skills/content-independent-review-agent/agents/openai.yaml
?? .agents/skills/content-layout-agent/SKILL.md
?? .agents/skills/content-layout-agent/agents/openai.yaml
?? .agents/skills/content-polish-agent/SKILL.md
?? .agents/skills/content-polish-agent/agents/openai.yaml
?? .agents/skills/content-pre-review-agent/SKILL.md
?? .agents/skills/content-pre-review-agent/agents/openai.yaml
?? .agents/skills/syrtag-research/SKILL.md
?? .agents/skills/syrtag-research/agents/openai.yaml
?? docs/research/2026-07-23-teacher-professional-learning-and-change-r1.md
?? docs/research/2026-07-26-teacher-professional-learning-and-change-human-review.md
?? docs/research/claim-audit/2026-08-02-full-site-verification-migration-inventory.md
?? docs/research/genealogy-audit/2026-08-02-existing-relations-remediation-review.md
?? docs/research/pre-review/2026-08-12-todays-content-pre-review.md
?? docs/research/pre-review/2026-08-14-sitewide-content-maturity-pre-review.md
?? docs/roadmaps/2026-07-23-topic-pilot-review-plan.md
?? docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md
?? docs/roadmaps/2026-08-13-content-status-and-next-projects.md
?? docs/standards/content-update-standard.md
?? docs/standards/content-writing-standard.md
?? prompts/08-p1-t1-teacher-professional-learning-evidence-closure.md
?? prompts/09-day1-p0-source-risk-hardening-closure.md
?? prompts/10-day2-life-course-claim-ledger.md
?? prompts/11-day3-teacher-identity-claim-ledger.md
?? prompts/12-day4-d3-human-review.md
?? prompts/13-day5-genealogy-relation-audit.md
?? prompts/14-day6-topic-research-guidance-human-review.md
?? prompts/15-day7-weekly-closeout-next-package.md
?? src/lib/genealogy-visibility.ts
?? tests/content-independent-review-agent.test.ts
?? tests/content-pipeline-agents.test.ts
?? tests/content-pre-review-agent.test.ts
?? tests/genealogy-visibility.test.ts
```

The report file itself was added after this freeze and is therefore intentionally absent from the captured manifest.

### Post-freeze drift event

At 01:45 CST, after the baseline was frozen, two allowlist-external tracked files changed concurrently:

- `docs/research/claim-audit/life-course-theory.md`
- `docs/research/claim-audit/teacher-identity-theory.md`

They were not present in the 01:43 dirty manifest and are not claimed by this package. The seven U3 candidate file hashes were rechecked after the drift and remained identical to the frozen values below. The decision request is therefore bound to those exact hashes and logical hunks, not to the later whole-worktree state. Any implementation or commit gate must establish a fresh baseline and must not include either claim-audit file unless separately authorized.

## Planning, standards, targets, and evidence scope

- Planning: `docs/roadmaps/2026-08-13-content-status-and-next-projects.md`, Project C and the accepted 30-day route's Day 1-3 package.
- Standards: `docs/standards/content-writing-standard.md` and `docs/standards/content-update-standard.md`.
- Canonical rows: `src/data/corpus/shared/entities.ts`, `seedCorpus.genealogy`.
- Existing evidence review: `docs/research/genealogy-audit/2026-08-02-existing-relations-remediation-review.md`.
- Proposed visibility seam: `src/lib/genealogy-visibility.ts`.
- Derived public surfaces inspected: graph API/home graph, theory detail relation query and section, related-theory internal links.
- No substantive source was reopened on 2026-08-14. Source-access dates and evidence boundaries below are carried forward from the 2026-08-02 fixed audit and are not promoted to current human review.

## Production versus local behavior

Live production was checked on 2026-08-14 at the documented origin `https://syrtag.com`:

| Surface | Production | Local candidate | Intended U3 result |
|---|---:|---:|---:|
| Education genealogy API | 9 nodes / 5 edges | 9 theory nodes / 0 public edges | 0 public edges |
| Sociology genealogy API | 6 nodes / 3 edges | 6 theory nodes / 0 public edges | 0 public edges |
| Total canonical edges exposed | 8 | 0 | 0 until individual release gates pass |
| Theory page genealogy prose | Visible, with `View in graph` | Hidden; temporary evidence-review notice | Hidden |
| Corpus and database rows | Retained | Retained | Retained |

Production edge IDs observed:

- Education: `life-course:teacher-development`, `life-course:teacher-identity`, `teacher-identity:teacher-development`, `street-level:multiple-streams`, `life-course:teacher-life-history`.
- Sociology: `practice:social-capital`, `practice:institutional`, `practice:structuration`.

## Eight-row pre-review

Candidate count: 8. Audit rows: 8. Unique relation IDs: 8. `PASS`: 0. `FAIL`: 0. `BLOCKED`: 8. Recommendation `hide`: 8. All human-review fields remain unassigned and pending.

| item_id | canonical_location | content_type | current_status | plan_alignment | source_ids | locator | content_nature | evidence_status | pre_review_result | recommendation | evidence_boundary | required_change | review_decision | reviewer_identity | reviewer_role | reviewed_at | blocker_or_rationale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `G01 life-course:teacher-life-history` | `seedCorpus.genealogy[id=life-course:teacher-life-history]` | genealogy relation | production public; local quarantined | Project C / Day 1-3 in scope | prior DOI candidate; Butt-Raymond metadata | none; no lawful substantive locator reproduced | editorial_synthesis | blocked | BLOCKED | hide | Metadata does not reproduce support for association, direction, type, or wording | Keep out of public allowlist; obtain direct relation evidence and row-level academic decision | pending_review | not_assigned | not_assigned | not_assigned | Association, direction, type, wording, reviewer decision, and owner release are absent |
| `G02 life-course:teacher-development` | `seedCorpus.genealogy[id=life-course:teacher-development]` | genealogy relation | production public; local quarantined | Project C / Day 1-3 in scope | none | none | editorial_synthesis | blocked | BLOCKED | hide | No reproduced evidence for association or `extended_by` | Keep out of public allowlist; obtain a reproducible locator and row-level academic decision | pending_review | not_assigned | not_assigned | not_assigned | Association, direction, type, wording, reviewer decision, and owner release are absent |
| `G03 life-course:teacher-identity` | `seedCorpus.genealogy[id=life-course:teacher-identity]` | genealogy relation | production public; local quarantined | Project C / Day 1-3 in scope | bullough-2015 metadata | metadata only | editorial_synthesis | blocked | BLOCKED | hide | Topic association metadata does not support the full canonical relation | Keep out of public allowlist; obtain substantive locator and row-level academic decision | pending_review | not_assigned | not_assigned | not_assigned | Direction, type, wording, reviewer decision, and owner release are absent |
| `G04 teacher-identity:teacher-development` | `seedCorpus.genealogy[id=teacher-identity:teacher-development]` | genealogy relation | production public; local quarantined | Project C / Day 1-3 in scope | `external_candidate:passmore-hart-2019` | AJER abstract lines 37-39 | editorial_synthesis | partially_supported | BLOCKED | hide | Supports a bounded identity-to-professional-development application, not the current broad symmetric taxonomy | Keep hidden; register source, decide exact type/direction/wording row by row, then request separate release | pending_review | not_assigned | not_assigned | not_assigned | Exact canonical type, named academic decision, and owner release are absent |
| `G05 practice:social-capital` | `seedCorpus.genealogy[id=practice:social-capital]` | genealogy relation | production public; local quarantined | Project C / Day 1-3 in scope | `practice-capital-1986` | printed pp. 248-249 | editorial_synthesis | partially_supported | BLOCKED | hide | Supports Bourdieu's social-capital concept within capital, not plural Social Capital Theory `branched_from` Practice Theory | Keep hidden; narrow endpoints/type/wording through row-level academic decision, then request separate release | pending_review | not_assigned | not_assigned | not_assigned | Current endpoint/type exceed evidence; reviewer decision and owner release are absent |
| `G06 practice:institutional` | `seedCorpus.genealogy[id=practice:institutional]` | genealogy relation | production public; local quarantined | Project C / Day 1-3 in scope | `external_candidate:zhao-ge-2023` | DOI/Crossref record plus article abstract | editorial_synthesis | partially_supported | BLOCKED | hide | Supports one combined field-theory application, not a universal genealogy direction or current broad wording | Keep hidden; register source and decide exact direction/type/wording, then request separate release | pending_review | not_assigned | not_assigned | not_assigned | Canonical direction/type, reviewer decision, and owner release are absent |
| `G07 practice:structuration` | `seedCorpus.genealogy[id=practice:structuration]` | genealogy relation | production public; local quarantined | Project C / Day 1-3 in scope | comparison candidate | none | editorial_synthesis | blocked | BLOCKED | hide | No reproduced locator supports association or `critiqued_by` | Keep out of public allowlist; obtain direct critique evidence and row-level academic decision | pending_review | not_assigned | not_assigned | not_assigned | Association locator, critique direction/type, reviewer decision, and owner release are absent |
| `G08 street-level:multiple-streams` | `seedCorpus.genealogy[id=street-level:multiple-streams]` | genealogy relation | production public; local quarantined | Project C / Day 1-3 in scope | `external_candidate:petridou-et-al-2024` | DiVA record and abstract | editorial_synthesis | blocked | BLOCKED | hide | Adjacent MSF evidence does not establish association with Street-Level Bureaucracy | Keep out of public allowlist; obtain direct integration evidence and row-level academic decision | pending_review | not_assigned | not_assigned | not_assigned | Association, direction, type, wording, reviewer decision, and owner release are absent |

## Exact U3 diff allowlist

The current worktree contains a candidate implementation. Owner acceptance should apply only to the following files and logical hunks; every other dirty path is denied.

| File | Allowed logical diff | Snapshot SHA-256 | Notes |
|---|---|---|---|
| `src/lib/genealogy-visibility.ts` | New allowlist helper; `PUBLIC_GENEALOGY_RELATION_IDS = []`; ID filter, Prisma `where`, and public-presence helper | `aa9dc619f5b9ae68d8a5f1f83d06d9d95a8452384a54e01f9477c62e6566d883` | Before any commit, replace the unsupported comment `authorized on 2026-08-12` with an accurate reference to the accepted U3 decision; until then it is not authorization evidence |
| `src/lib/graph-data.ts` | Import visibility helpers; constrain discipline relation existence and genealogy query by allowlist; defense-in-depth filter before edge mapping | `57057b69789ca24dd7384d3b2819f92757988ecf3a75ca6daebc432ac98f12d8` | Entire current file diff is U3-related |
| `src/lib/entities/theories.ts` | Constrain `sourceRelations` and `targetRelations` includes by the public genealogy allowlist | `7b3bd1bd73d143b1a2cea19348cfab9706a138a9a2523f70e28b6a722c243d00` | Entire current file diff is U3-related |
| `src/lib/internal-links.ts` | Constrain relation includes and apply defense-in-depth ID filtering before emitting related-theory links | `233ba5090f82ea28378c42bed945fb217c1fa1aa8c81f87da3bf99960e8087e2` | Entire current file diff is U3-related |
| `src/components/content/TheoryArticle.tsx` | Only: import/use `hasPublicGenealogyRelations`; hide `View in graph`; conditionally replace genealogy prose/map with the temporary review notice | `6a86ff24f90919568c15a13a395d89d78cc2b3f9e1c5084e9b9f0da8e2295793` | Mixed file: the `L2_editorial` badge and page-level source-note changes are outside this U3 authorization and must be split or separately approved |
| `tests/genealogy-visibility.test.ts` | New empty-allowlist, filter, and theory-page quarantine tests | `4a75533138732c956c0c3149550c4a112850b675992498a7ec8f0d8ad565e4fd` | Entire new file is U3-related |
| `tests/graph-data.test.ts` | Change genealogy expectations to 0 edges and add explicit allowlist exclusion test | `db5a40d9c062046f466af958fd325d38dbaca257d4121c7942175affd8c8cf3e` | Entire current file diff is U3-related |

### Denylist

- Every dirty path not listed in the table above.
- Within `src/components/content/TheoryArticle.tsx`, the verification-badge and page-level source-semantics hunks.
- `tests/theory-static-ui.test.ts` and all of its current changes; it was executed as a regression check but is not part of this U3 diff.
- `src/data/corpus/shared/entities.ts`, all other `src/data/` content, `prisma/`, schema, migrations, seed behavior, canonical relation rows, relation wording, relation types, and content statuses.
- Any commit, staging action, push, PR, merge, deployment, production database write, sitemap/indexing change, or public release.

### Missing pre-commit evidence

The current focused suite proves empty-allowlist behavior for the helper, graph response, theory section, and general publication boundary. It does not directly exercise `getTheoryBySlug` or `getInternalLinks` with a fake database relation. Before requesting commit authorization, add or identify a focused regression test that proves those two query paths emit no unapproved relation. This is not a blocker to deciding the U3 policy; it is a blocker to claiming the candidate diff is commit-ready.

## Verification

| Check | Result | Evidence |
|---|---|---|
| `npm run content:check` | passed | 2 disciplines and 12 theories |
| `npm run typecheck` | passed | `tsc --noEmit` |
| Focused tests: `genealogy-visibility`, `graph-data`, `theory-static-ui` | passed | 15/15 |
| `tests/publication-boundary.test.ts` | passed | 2/2 |
| `git diff --check` | passed at the 01:43 package check; later whole-tree check failed after external drift | New trailing whitespace in `docs/research/claim-audit/life-course-theory.md` is outside this allowlist; no cleanup attempted |
| Production graph API | observed, not changed | Education 5 edges; Sociology 3 edges |
| Full `npm test`, lint, build, smoke, E2E | not_run | Decision package only; these belong to a clean, approved implementation/commit gate |
| Database migrate/seed/idempotence | not_run | No database or corpus change authorized |

The recurring `MODULE_TYPELESS_PACKAGE_JSON` warning is pre-existing and does not change the pass results.

## Rollback boundary

- Before commit: discard only the authorized U3 hunks through a reviewed patch; do not reset, restore, clean, or stash the dirty worktree.
- After an authorized commit but before deployment: do not deploy that commit; no production rollback is needed.
- After a separately authorized deployment: revert the exact U3 commit and redeploy through the normal production workflow only under a separate owner decision.
- Data remains intact throughout: the canonical corpus and `theory_genealogy` rows are not deleted.
- Reopening one relation is a later allowlist addition and requires completed row-level evidence, human review, owner release, clean-snapshot gates, and separate commit/deploy authorization.

## Decision requested

Approve or reject this statement:

> Adopt the evidence- and human-decision-complete public genealogy allowlist as the U3 visibility policy, initially exposing 0/8 canonical relations. Acceptance authorizes only the exact local visibility-policy scope in this document to proceed to implementation verification. It does not authorize commit, merge, deployment, indexing, or publication.

If accepted, the next implementation gate must first correct the unsupported authorization comment in `src/lib/genealogy-visibility.ts`, preserve the mixed-file hunk boundary, add direct query-path regression coverage, and rerun the baseline before any commit request.

## Fixed declaration

This report is a pre-review recommendation. It does not replace a named academic reviewer, owner U3 decision, implementation authorization beyond the accepted scope, commit authorization, deployment authorization, or public verification. No corpus, database, public allowlist, route, sitemap, index, commit, or deployment state was changed while producing it.
