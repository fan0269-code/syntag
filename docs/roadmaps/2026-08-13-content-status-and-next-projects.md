# Website Content Status and Next Projects

> Date: 2026-08-13  
> Scope: planning/status audit only  
> Repository: `/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag`  
> Publication boundary: no corpus edit, no commit, no deployment, no public verification

## 1. Current Content Stage

Syrtag is past the initial MVP/content-system stage, but it is not ready for broad content expansion.

Current static corpus count from `seedCorpus`:

- Disciplines: 2, both published.
- Fields: 6, all published.
- Theories: 12 total: D3 x 2, D2 x 4, D1 x 6.
- Genealogy relations: 8.
- Scholars: 10 total: 7 published, 3 draft.
- Works: 19.
- Concepts: 24.
- Topics: 8 total: 4 published, 4 draft.
- Topic-theory relations: 24.
- Verification records: 36.

The current `npm run content:check` result is passing for 2 disciplines and 12 theories. This validates the local onboarding contract, not human approval, commit readiness, deployment, or live-site publication.

## 2. What Has Been Updated

The content program has already moved through these layers:

1. The content schema and typed seed corpus exist for disciplines, fields, theories, works, concepts, scholars, topics, genealogy, and verification records.
2. Education and Sociology are the only current public disciplines.
3. The theory corpus has a stable depth structure: 2 D3 flagship pages, 4 D2 developed pages, and 6 D1 orientation pages.
4. The source-first writing and update standards are active in `docs/standards/`.
5. The July 17 expansion roadmap defined a Psychology-first expansion path, but marked expansion as No-Go until existing genealogy density and evidence gates are satisfied.
6. The August 2 seven-day governance plan shifted the project from expansion to credibility closure: D3 claim ledgers, genealogy relation evidence, Topic pilot review, and one bounded next package.
7. The source-risk hardening work has local implementation/verification evidence in its roadmap record, but it remains review-gated and unpublished.

## 3. Current Blockers

- The worktree is already dirty: current branch `feature/content-enrichment-batch-1` is ahead of `origin/feature/content-enrichment-batch-1` by 1 commit and differs from `origin/main` by `2 1`.
- There are 42 tracked modified files and multiple untracked governance/research files. Treat these as existing work, not a clean baseline.
- The latest governance memory records an audit-only stop: prior review and U3/publication authorization remain unresolved.
- Expansion to Psychology or Management/OB is still blocked by the roadmap's own Go/No-Go criteria.
- Passing local checks does not authorize corpus publication, commit, PR, deployment, sitemap exposure, indexing, or public claims.

## 4. Next-Stage Projects

### Project A: Close Current P0 Source-Risk Package

Goal: decide whether the current source-risk hardening package can become an accepted local change.

Deliverables:

- A fresh baseline with branch, HEAD, divergence, tracked dirty files, and untracked files.
- A concise owner-review summary for the existing P0 source semantics/risk display changes.
- A decision record: accepted for commit, needs revision, or stopped.

Stop rules:

- Stop if the dirty file set changes outside the reviewed allowlist.
- Stop if the owner does not explicitly authorize commit or next implementation.

### Project B: Complete D3 Claim Ledgers

Goal: make the two flagship D3 pages independently auditable at claim level.

Deliverables:

- Complete Life Course Theory claim ledger.
- Complete Teacher Identity Theory claim ledger.
- Each row records field path, source, locator, evidence status, content nature, review readiness, and unresolved reviewer question.

Stop rules:

- Do not edit corpus data.
- Do not mark human review decisions without explicit reviewer identity, role, date, decision, and rationale.

### Project C: Audit Existing Genealogy Relations

Goal: decide which of the 8 current genealogy relations can remain public, should be hidden, or need revised wording.

Deliverables:

- One row-level evidence record per relation.
- Endpoint, direction, relation type, public wording, source locator, evidence status, review readiness, and required owner/methods decision.
- A U3 visibility proposal if any public relation should be hidden or changed.

Stop rules:

- Do not delete or hide public relations without exact owner authorization.
- Do not treat co-occurrence, thematic similarity, or chronology as influence evidence.

### Project D: Resolve Topic Pilot Human Review

Goal: close the remaining Topic pilot review gap without expanding the corpus.

Deliverables:

- Final status for the pending research-guidance rows.
- Revised or rejected wording only where a human reviewer gave row-level decisions.
- A corpus-implementation proposal with exact allowed files.

Stop rules:

- Do not publish pending guidance.
- Do not convert research notes into corpus content without implementation authorization.

### Project E: Re-run Expansion Go/No-Go

Goal: decide whether Psychology can enter a research-package window.

Deliverables:

- Fresh Education and Sociology genealogy density calculation.
- Node coverage for published theories.
- At least 4 candidate cross-disciplinary node pairs connecting Psychology to existing published theories.
- A No-Go/Go record appended to the expansion roadmap.

Stop rules:

- Keep Psychology as roadmap/research only unless all Go/No-Go metrics pass.
- Do not edit `seed-content.ts` or add public routes in this stage.

## 5. Recommended Immediate Next Package

Run Project A first, because the existing P0 source-risk package is already in the worktree and must be accepted, revised, or stopped before additional content packages are layered on top.

Acceptance criteria for Project A:

- Fresh Git baseline recorded.
- Existing P0 scope matched to modified files.
- `npm run content:check` result recorded.
- No unrelated file ownership claimed.
- Owner decision requested with exact options: accept for commit, revise specific files, or stop.
