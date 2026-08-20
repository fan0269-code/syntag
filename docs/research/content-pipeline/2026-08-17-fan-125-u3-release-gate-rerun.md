# FAN-125 U3 visibility contraction and content release-gate rerun

> Audit date: 2026-08-17 (Asia/Shanghai)  
> Repository: `syntag`  
> Branch / HEAD: `feature/content-enrichment-batch-1` / `3323ebb8d2045cfe54c2c583c61c0cda52be59a5`  
> Reviewer agent: `content-audit-agent`  
> Strongest authorized outcome: audit report only; no corpus edit, seed, commit, merge, deploy, index, or publication

## Final disposition

```text
audit_verdict: FAIL
review_decision: pending_review
reviewer_agent: content-audit-agent
reviewer_identity: not_assigned
reviewer_role: not_assigned
reviewed_at: not_assigned
implementation_gate: closed
recommendation: revise
blocker_or_rationale: The 16 authorized U3 contractions exist in the typed corpus but are not applied to the database used by the production build. All 16 remain published, receive static route artifacts, and appear in the generated sitemap. In addition, 48 of the remaining 58 public pages retain blocker-only claim rows, and no academic/editorial/method claim has a named-human production approval. The candidate is also not bound to an immutable commit or complete patch artifact.
```

This is a batch-stopping gate result. The `content-audit-agent` contract permits `PASS` only after every applicable row passes in an independent context and all validation evidence is real. Because a shared P1 publication-boundary failure affects all 16 U3 pages, no independent page context can lawfully pass those rows. The table below records the row-level disposition caused by the shared gates; it does not pretend that one batch context replaced 74 independent article audits.

## Environment and baseline

- Local candidate date: 2026-08-17, Asia/Shanghai.
- Current tracked diff SHA-256: `546c47e4254561ce74045df522b0180e77926cdd02ac854baeac45940c5f935f`.
- The workspace contains a broad tracked diff plus many untracked application, test, and research files. The tracked hash excludes untracked files, including `src/lib/u3-visibility.ts` and `tests/fan133-work-concept-contract.test.ts`.
- [FAN-124](/FAN/issues/FAN-124) produced no commit, PR, attachment, or work product. The current candidate therefore has dirty-baseline ambiguity and no immutable rollback/release anchor.
- Frozen review evidence: [FAN-123 revision 6](/FAN/issues/FAN-123#document-human-review-package) and the R3 independent preflight. The R3 package fingerprints still match the local claim and U3 input files.

## Reproduction and observed failure

1. Read the 16 exact U3 owner/CEO visibility decisions from [FAN-123](/FAN/issues/FAN-123) and compare them with `src/lib/u3-visibility.ts`.
2. Enumerate the typed corpus. It contains 58 `published`, 7 `draft`, and 16 `archived` entities; every U3 record has no `publishedAt`.
3. Query the local nonproduction database read-only for those 16 slugs. Actual result: 16 `published`, 0 `archived`; every row retains `publishedAt = 2026-07-12T00:00:00.000Z`.
4. Run `npm run build` against that database. The build succeeds but prerenders 97 pages. `.next/prerender-manifest.json` contains all 16 prohibited U3 detail routes: 24 concept detail routes and 19 work detail routes remain present.
5. Inspect `.next/server/app/sitemap.xml.body`. All 16 prohibited U3 URLs remain in the sitemap, including `/works/equity-sen-1992`, `/concepts/transition`, and `/concepts/institutional-isomorphism`.

Expected: 16/16 U3 pages are `archived`, have `publishedAt=null`, do not prerender, and do not appear in sitemap, search, graph, indexes, entry points, or detail routes.  
Actual: typed corpus is fail-closed, but the database-backed production candidate is fail-open for 16/16 U3 pages.

## Finding QA-125-01 — authorized U3 pages remain publicly buildable

- Category: publication-state integrity / fail-open persistence / U3 authorization drift.
- Severity: P1 Release Blocker.
- Exploitability: no attacker skill is required; any build or deployment using the current database publishes the routes by default.
- Blast radius: 16 content pages, their canonical metadata, sitemap entries, search/index eligibility, and any derived public links. The generated candidate retains all 74 legacy page routes instead of the intended 58.
- Evidence: database read returned 16/16 `published`; prerender manifest returned 16/16 U3 routes present; sitemap contained 16/16 U3 URLs.
- Concrete fix: run the authorized seed/update against an isolated nonproduction database; assert all 16 records are `archived` with `publishedAt=null`; add database integration and build-output assertions for the 16 slugs and the 58-page total; rebuild from a fingerprinted or immutable candidate.
- Residual risk after fix: production remains unverified until the exact approved candidate is deployed and its routes, sitemap, search, graph, cache, and canonical behavior are checked separately.

## Finding QA-125-02 — public content still lacks named-human production approval

- Category: evidence governance / authorization / content integrity.
- Severity: P1 Release Blocker.
- Blast radius: the remaining 58 intended-public pages and 830 claim rows.
- Evidence: R3 result is 338 Agent `PASS`, 492 `BLOCKED`, 0 `FAIL`; complete pages are 10 `PASS` and 64 `BLOCKED`. After removing the 16 U3 pages, the intended 58 public pages consist of 10 structurally reviewable pages and 48 pages that still contain blocker-only rows. [FAN-123](/FAN/issues/FAN-123) revision 6 explicitly gives the 338 rows no production wording approval and keeps all academic/editorial/method reviewer fields unassigned.
- Contract check: stable `claimId`, exact `fieldPath`, locator, `contentNature`, evidence status, and `verifiedAt` were audited in the frozen R3 ledgers. The candidate correctly does not fabricate reviewer fields or implement claim wording. That preservation is a governance PASS, but it does not open the content implementation or publication gate.
- Concrete fix: keep the 48 blocked public pages non-public or complete lawful claim evidence/readiness; obtain named academic/editorial/method row decisions for any wording proposed for production; then run one-article-per-context final audits.
- Residual risk: source identity and structural completeness do not establish substantive support, reviewer authorization, or publication fitness.

## Contract and boundary matrix

| Gate | Result | Evidence |
|---|---|---|
| 16 U3 decision rows match implementation allowlist | PASS | 16 decision rows and 16 implementation entries; no missing/extra slug; exact order matches. |
| Typed corpus U3 state | PASS | 1 Work + 15 Concepts are `archived`; `publishedAt` is absent. |
| Database U3 state | FAIL | 16/16 remain `published`; 0/16 archived; all retain the old publication timestamp. |
| Production build U3 route exclusion | FAIL | 16/16 U3 routes occur in `.next/prerender-manifest.json`; static artifacts exist. |
| Sitemap U3 exclusion | FAIL | 16/16 U3 canonical URLs remain in the generated sitemap. |
| Intended public corpus count | PASS in typed data only | 58 published = 2 disciplines + 6 fields + 12 theories + 18 works + 9 concepts + 7 scholars + 4 topics. |
| Actual database-backed public detail count | FAIL | Build retains 74 legacy content detail pages: 24 Concepts and 19 Works instead of 9 and 18. |
| Draft boundary | PASS | Typed corpus retains 3 draft Scholars + 4 draft Topics; focused boundary tests reject draft/archived targets. |
| Genealogy visibility | PASS, fail-closed | 8 canonical relations retained; public allowlist remains 0/8; query, graph, prose, and internal-link tests pass. |
| Topic–Theory risk guidance | PASS, fail-closed | 12/12 published-owner rows have blank `riskNotesEn`, pending review, no reviewer identity, and persistence to `null`. |
| Claim/review metadata fidelity | BLOCKED | Frozen ledgers remain structurally exact, but 492/830 claims remain blocker-only and named academic/editorial/method review is absent for 830/830. |
| Candidate identity / rollback anchor | FAIL | Dirty workspace, no commit/PR/patch work product, and tracked hash excludes untracked candidate files. |

## Verification record

| Check | Result |
|---|---|
| `npm run content:check` | PASS — 2 disciplines and 12 theories. |
| `npm run typecheck` | PASS. |
| Focused content/public-boundary suite | PASS — 80/80 (79 high-risk content tests plus 1 content-pipeline agent-contract test). |
| `npm test` | Environment-recovered PASS — first run: 157 passed, 1 failed, 1 skipped because sandbox denied `127.0.0.1:54329`; the original database path was then rerun outside the sandbox and passed 1/1. The build smoke is intentionally skipped before a fresh build. |
| `npm run lint` | PASS — 0 errors, 3 existing unused-variable warnings in `scripts/generate-fan121-work-concept-pack.mjs`. |
| `git diff --check` | PASS. |
| `npm run build` + required build-output smoke | Command PASS — compile/typecheck/static generation 97/97 and smoke 1/1. Behavioral release gate FAIL because the successful output contains all 16 prohibited pages. |
| Browser E2E | `not_run` — the fresh prerender manifest and sitemap already reproduce the public-boundary failure; no E2E result is promoted to PASS. |
| Production checks | `not_run` — deployment and publication are outside scope and not authorized. |

## Shared audit fields for every row below

```text
review_decision: pending_review
reviewer_agent: content-audit-agent
reviewer_identity: not_assigned
reviewer_role: not_assigned
reviewed_at: not_assigned
implementation_gate: closed
```

Rationale codes:

- `H58`: intended-public page has no named-human academic/editorial/method production approval; 48 such pages also retain blocker-only claims.
- `U3-LEAK`: typed corpus says archived, but the database, static output, and sitemap still expose the page.

## 74 page dispositions

| article_id | audit_verdict | recommendation | blocker_or_rationale |
|---|---|---|---|
| `discipline.education.page` | BLOCKED | hold | H58. |
| `discipline.sociology.page` | BLOCKED | hold | H58. |
| `field.teacher-education-professional-development.page` | BLOCKED | hold | H58. |
| `field.rural-remote-education.page` | BLOCKED | hold | H58. |
| `field.educational-equity-policy.page` | BLOCKED | hold | H58. |
| `field.life-course-aging-studies.page` | BLOCKED | hold | H58. |
| `field.sociology-of-education.page` | BLOCKED | hold | H58. |
| `field.organizational-sociology.page` | BLOCKED | hold | H58. |
| `theory.life-course-theory.page` | BLOCKED | hold | H58. |
| `theory.teacher-identity-theory.page` | BLOCKED | hold | H58. |
| `theory.structuration-theory.page` | BLOCKED | hold | H58. |
| `theory.communities-of-practice.page` | BLOCKED | hold | H58. |
| `theory.practice-theory-bourdieu.page` | BLOCKED | hold | H58. |
| `theory.social-capital-theory.page` | BLOCKED | hold | H58. |
| `theory.teacher-professional-development-theory.page` | BLOCKED | hold | H58. |
| `theory.teacher-life-history-research.page` | BLOCKED | hold | H58. |
| `theory.educational-equity-theory.page` | BLOCKED | hold | H58. |
| `theory.institutional-theory.page` | BLOCKED | hold | H58. |
| `theory.street-level-bureaucracy.page` | BLOCKED | hold | H58. |
| `theory.multiple-streams-framework.page` | BLOCKED | hold | H58. |
| `work.elder-1998-life-course.page` | BLOCKED | hold | H58. |
| `work.beijaard-meijer-verloop-2004-identity.page` | BLOCKED | hold | H58. |
| `work.kelchtermans-2009-teacher-identity.page` | BLOCKED | hold | H58. |
| `work.struct-giddens-1984.page` | BLOCKED | hold | H58. |
| `work.lave-wenger-1991-situated-learning.page` | BLOCKED | hold | H58. |
| `work.cop-wenger-1998.page` | BLOCKED | hold | H58. |
| `work.bourdieu-1977-outline-practice.page` | BLOCKED | hold | H58. |
| `work.practice-capital-1986.page` | BLOCKED | hold | H58. |
| `work.coleman-1988-social-capital.page` | BLOCKED | hold | H58. |
| `work.social-lin-2001.page` | BLOCKED | hold | H58. |
| `work.day-1999-developing-teachers.page` | BLOCKED | hold | H58. |
| `work.teacher-development-clarke-hollingsworth-2002.page` | BLOCKED | hold | H58. |
| `work.goodson-2013-narrative-theory.page` | BLOCKED | hold | H58. |
| `work.unesco-2020-inclusion-education.page` | BLOCKED | hold | H58. |
| `work.equity-sen-1992.page` | FAIL | hide | U3-LEAK. |
| `work.dimaggio-powell-1983-iron-cage.page` | BLOCKED | hold | H58. |
| `work.institutional-meyer-rowan-1977.page` | BLOCKED | hold | H58. |
| `work.lipsky-2010-street-level-bureaucracy.page` | BLOCKED | hold | H58. |
| `work.kingdon-1995-agendas-alternatives.page` | BLOCKED | hold | H58. |
| `concept.trajectory.page` | FAIL | hide | U3-LEAK. |
| `concept.transition.page` | FAIL | hide | U3-LEAK. |
| `concept.turning-point.page` | FAIL | hide | U3-LEAK. |
| `concept.teacher-professional-identity.page` | FAIL | hide | U3-LEAK. |
| `concept.teacher-self-understanding.page` | FAIL | hide | U3-LEAK. |
| `concept.duality-of-structure.page` | FAIL | hide | U3-LEAK. |
| `concept.rules-and-resources.page` | FAIL | hide | U3-LEAK. |
| `concept.recursive-practice.page` | FAIL | hide | U3-LEAK. |
| `concept.legitimate-peripheral-participation.page` | BLOCKED | hold | H58. |
| `concept.mutual-engagement.page` | FAIL | hide | U3-LEAK. |
| `concept.shared-repertoire.page` | FAIL | hide | U3-LEAK. |
| `concept.habitus.page` | FAIL | hide | U3-LEAK. |
| `concept.field.page` | FAIL | hide | U3-LEAK. |
| `concept.capital-conversion.page` | BLOCKED | hold | H58. |
| `concept.symbolic-power.page` | FAIL | hide | U3-LEAK. |
| `concept.relational-resource-access.page` | BLOCKED | hold | H58. |
| `concept.obligation-and-reciprocity.page` | BLOCKED | hold | H58. |
| `concept.professional-learning.page` | FAIL | hide | U3-LEAK. |
| `concept.life-history.page` | BLOCKED | hold | H58. |
| `concept.educational-equity.page` | BLOCKED | hold | H58. |
| `concept.institutional-isomorphism.page` | FAIL | hide | U3-LEAK. |
| `concept.decoupling.page` | BLOCKED | hold | H58. |
| `concept.frontline-discretion.page` | BLOCKED | hold | H58. |
| `concept.streams-coupling-policy-window.page` | BLOCKED | hold | H58. |
| `scholar.glen-h-elder-jr.page` | BLOCKED | hold | H58. |
| `scholar.geert-kelchtermans.page` | BLOCKED | hold | H58. |
| `scholar.anthony-giddens.page` | BLOCKED | hold | H58. |
| `scholar.pierre-bourdieu.page` | BLOCKED | hold | H58. |
| `scholar.jean-lave.page` | BLOCKED | hold | H58. |
| `scholar.etienne-wenger.page` | BLOCKED | hold | H58. |
| `scholar.michael-lipsky.page` | BLOCKED | hold | H58. |
| `topic.teachers-professional-identity-during-reform.page` | BLOCKED | hold | H58. |
| `topic.educational-transitions-over-time.page` | BLOCKED | hold | H58. |
| `topic.organizational-routines-and-structural-change.page` | BLOCKED | hold | H58. |
| `topic.inequality-in-educational-and-social-fields.page` | BLOCKED | hold | H58. |

Totals: **PASS 0 / FAIL 16 / BLOCKED 58**. This fails the requested condition “74 pages have no FAIL and remaining BLOCKED is only hidden U3.”

## Genealogy and risk-row dispositions

- Genealogy: 8/8 remain `BLOCKED`, recommendation `hide`, implementation gate closed. This is acceptable only while public visibility remains 0/8; focused query/render tests pass.
- Topic–Theory risk rows: 12/12 published-owner rows remain `BLOCKED`, recommendation `hold`, implementation gate closed. This is acceptable only while `riskNotesEn` remains blank, persistence remains `null`, and the UI renders “Pending human review”; all three conditions pass in the typed contract and current database.

## Required next action

1. The responsible engineer must apply and verify the 16 authorized U3 state changes in an isolated nonproduction database, then add regression coverage that fails when any U3 database row, prerender route, or sitemap URL remains public.
2. The content owner/coordinator must keep the remaining 58 pages out of a release claim until the 48 blocker-only page queues and all named-human production decisions are closed, or explicitly authorize an additional conservative visibility contraction.
3. A new independent audit must rerun the original database query, build manifest, sitemap, 58 public / 7 draft / 16 archived counts, genealogy 0/8, risk 12/12 blank, and row-level claim/reviewer checks against a fingerprinted candidate.

No commit, merge, deploy, index, or publication was performed by this audit.
