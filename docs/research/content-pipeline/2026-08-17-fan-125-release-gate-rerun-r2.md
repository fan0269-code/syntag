# FAN-125 final content release-gate rerun R2

> Audit date: 2026-08-17 (Asia/Shanghai)  
> Repository: `syntag`  
> Branch / HEAD: `feature/content-enrichment-batch-1` / `3323ebb8d2045cfe54c2c583c61c0cda52be59a5`  
> Reviewer agent: `content-audit-agent`  
> Scope boundary: report only; no corpus edit, seed, commit, merge, deploy, index, or publication

## Final disposition

```text
audit_verdict: BLOCKED
review_decision: pending_review
reviewer_agent: content-audit-agent
reviewer_identity: not_assigned
reviewer_role: not_assigned
reviewed_at: not_assigned
implementation_gate: closed
recommendation: blocked
blocker_or_rationale: The FAN-244 U3 database/build defect is fixed, but the requested release condition is not met. All 58 intended-public pages still lack named-human academic/editorial/method production approval; 48 also contain blocker-only claim rows. The remaining BLOCKED population is therefore not limited to the 16 explicitly hidden U3 pages. The workspace is also a mutable dirty candidate without an immutable result commit or complete attached patch.
```

This rerun closes the former 16-page technical `FAIL`: the U3 contraction now holds in typed data, the isolated database, prerender output, and sitemap. It does not convert unresolved content evidence or an Agent verdict into human publication approval. The release gate remains closed.

The 74-row table below records the current disposition from the frozen row ledgers and the repaired runtime boundary. It is a coordinator release-gate result; it does not claim that one batch context replaced the `content-audit-agent` requirement for one independent article context per final article audit.

## Environment and reproduction

- Local candidate: 2026-08-17; isolated loopback PostgreSQL at the repository-configured nonproduction endpoint.
- Current tracked diff SHA-256: `9a59346be3866646791771153c1f2c1d18beba6d89a51475ff307bcb431f9b31`.
- Current worktree: 99 changed/untracked paths; no result commit, PR, deployment, or publication. The current tracked hash differs from the implementing engineer's recorded `b1404c5899d93ac3ef451624e6533d7a145fd2e075053c1abd5499b21f8264a3`, so candidate immutability is not established even though all scoped checks pass.
- Frozen evidence inputs were rehashed and all seven match the R3 preflight exactly: Life Course, Teacher Identity, FAN-120, FAN-121, FAN-122, FAN-134, and FAN-133 U3 ledgers.

Reproduction path:

1. Compare the 16 CEO/owner U3 rows with `src/lib/u3-visibility.ts`.
2. Enumerate typed corpus state and all draft/archived routes.
3. Rerun the isolated database integration assertion.
4. Run a fresh production build and required build-output smoke.
5. Inspect `.next/prerender-manifest.json` and `.next/server/app/sitemap.xml.body` for public counts and nonpublic leaks.
6. Recheck genealogy and Topic–Theory risk fail-closed contracts.
7. Rehash the seven frozen R3 inputs and compare the 830-claim review state with the latest FAN-123 human-review decision package.

## Findings

### QA-125-R2-01 — U3 publication-state fail-open is closed

- Category: publication-state integrity / authorization boundary.
- Result: PASS for the repaired technical boundary.
- Evidence: typed corpus is 58 published / 7 draft / 16 archived; isolated database integration passes with 1 Work + 15 Concepts archived and every `publishedAt=null`; fresh build contains exactly 58 entity detail routes and 72 sitemap locations; all 16 U3 URLs and all 7 draft URLs are absent from manifest and sitemap.
- Blast radius now contained: the 16 U3 pages are excluded from detail routes, sitemap, published-only queries, indexes, graph-derived links, and static entry points covered by the regression suite.
- Residual risk: production has not been deployed or checked; mutable dirty-workspace identity prevents binding this result to a release artifact.

### QA-125-R2-02 — 58 intended-public pages still lack named-human production approval

- Category: evidence governance / publication authorization / content integrity.
- Severity: P1 Release Blocker.
- Exploitability: no attacker is required; treating structural Agent PASS or an already-public state as approval would release unreviewed wording by process bypass.
- Blast radius: all 58 intended-public pages and all 830 claim rows. Forty-eight of the 58 pages contain at least one blocker-only row; the other ten are structurally human-reviewable but still have no named-human verdict.
- Evidence: frozen R3 result remains 338 Agent `PASS`, 492 `BLOCKED`, 0 `FAIL`; complete-page queues are 10 `PASS` / 64 `BLOCKED` before U3 contraction. FAN-123 explicitly records `academic_editorial_methods_reviewer_identity: not_assigned` and `academic_editorial_methods_review_decision: no_production_approval`.
- Concrete fix: a named academic/editorial/method reviewer must decide the 338 approvable rows; the 492 blocker-only rows must receive lawful locators/readiness and review or remain omitted/hidden. Then run one-article-per-independent-context final audits. An alternative is a separately authorized conservative visibility contraction for affected pages.
- Residual risk: stable IDs and source identity do not prove substantive support or authorize public wording.

### QA-125-R2-03 — candidate remains non-immutable

- Category: dirty-baseline ambiguity / rollback and auditability.
- Severity: P1 Release Blocker under the final-audit contract.
- Evidence: HEAD predates the complete candidate; 99 changed/untracked paths remain; the current tracked diff hash does not match the implementer's recorded tracked patch hash; no attached complete patch, result commit, or PR exists.
- Concrete fix: after content governance closes, bind the exact candidate to an inspectable immutable commit or complete patch work product and rerun the focused gate against that identity.
- Residual risk: passing local outputs cannot prove that a later deployment uses the same bytes.

## Contract and boundary matrix

| Gate | Result | Evidence |
|---|---|---|
| U3 decision rows vs implementation | PASS | 16 vs 16; exact set; no missing or extra slug. |
| Typed corpus publication state | PASS | 58 published / 7 draft / 16 archived. |
| Isolated database U3 state | PASS | 1 Work + 15 Concepts archived; every `publishedAt=null`; published Work 18 and Concept 9. |
| Fresh build public details | PASS | 2 disciplines + 6 fields + 12 theories + 4 topics + 7 scholars + 18 works + 9 concepts = 58. |
| U3 build/sitemap exclusion | PASS | 0/16 leaks. |
| Draft fail-closed | PASS | 0/7 draft route/sitemap leaks. |
| Genealogy visibility | PASS, fail-closed | Canonical 8; public allowlist 0/8; query, graph, prose, and link tests pass. |
| Topic–Theory risk guidance | PASS, fail-closed | 12 published-owner rows; `riskNotesEn` blank/null 12/12; pending review 12/12. |
| Claim IDs and field paths | PASS for frozen-input fidelity | R3 enumerates 830/830 unique stable IDs and canonical locations; seven input hashes still match. |
| Locator / content nature / verified date | BLOCKED for publication | Fields are populated or explicitly blocked in the frozen ledgers; evidence status is verified 145 / partially supported 213 / pending 133 / blocked 339. A package/source-check date is not a human approval date. |
| Named-human academic/editorial/method review | BLOCKED | 0/830 production wording approvals; reviewer identity/role/date remain unassigned. |
| Candidate identity | FAIL | Mutable dirty workspace; no immutable result commit or complete attached patch. |

## Verification record

| Check | Result |
|---|---|
| Focused content/public-boundary suite | PASS — 78/78. |
| `npm run content:check` | PASS — 2 disciplines and 12 theories. |
| `npm run typecheck` | PASS. |
| Isolated DB integration | Environment-recovered PASS — sandbox run reproduced `EPERM 127.0.0.1:54329`; the same original path outside the sandbox passed 1/1. |
| `npm run build` | PASS — fresh Next.js build generated 81 static pages; required build-output smoke passed 1/1. |
| `npm test` | PASS — 158 passed / 0 failed / 1 expected build-smoke skip. |
| `git diff --check` | PASS. |
| Browser/UI evidence | Equivalent build evidence captured: exact prerender and sitemap route inventories. Interactive E2E was not required to prove this server-side publication boundary and was not promoted to PASS. |
| Production checks | `not_run` / not authorized. |

## Shared audit fields

```text
review_decision: pending_review
reviewer_agent: content-audit-agent
reviewer_identity: not_assigned
reviewer_role: not_assigned
reviewed_at: not_assigned
implementation_gate: closed
```

Rationale codes:

- `H58`: intended-public page has no named-human academic/editorial/method production approval; 48 pages also retain blocker-only claims.
- `U3-HIDDEN`: explicit owner/CEO visibility contraction is correctly implemented; page remains nonpublic and receives no academic/content approval by inference.

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
| `work.equity-sen-1992.page` | BLOCKED | hide | U3-HIDDEN. |
| `work.dimaggio-powell-1983-iron-cage.page` | BLOCKED | hold | H58. |
| `work.institutional-meyer-rowan-1977.page` | BLOCKED | hold | H58. |
| `work.lipsky-2010-street-level-bureaucracy.page` | BLOCKED | hold | H58. |
| `work.kingdon-1995-agendas-alternatives.page` | BLOCKED | hold | H58. |
| `concept.trajectory.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.transition.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.turning-point.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.teacher-professional-identity.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.teacher-self-understanding.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.duality-of-structure.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.rules-and-resources.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.recursive-practice.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.legitimate-peripheral-participation.page` | BLOCKED | hold | H58. |
| `concept.mutual-engagement.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.shared-repertoire.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.habitus.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.field.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.capital-conversion.page` | BLOCKED | hold | H58. |
| `concept.symbolic-power.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.relational-resource-access.page` | BLOCKED | hold | H58. |
| `concept.obligation-and-reciprocity.page` | BLOCKED | hold | H58. |
| `concept.professional-learning.page` | BLOCKED | hide | U3-HIDDEN. |
| `concept.life-history.page` | BLOCKED | hold | H58. |
| `concept.educational-equity.page` | BLOCKED | hold | H58. |
| `concept.institutional-isomorphism.page` | BLOCKED | hide | U3-HIDDEN. |
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

Totals: **PASS 0 / FAIL 0 / BLOCKED 74**. Of the 74 blocked rows, 16 are intentionally hidden U3 pages and 58 are intended-public pages blocked by absent named-human production approval. Therefore the required condition “remaining BLOCKED only comes from explicit U3 nonpublication” is not met.

## Next action

The Chief of Staff/content-governance owner must choose and execute one safe path for the 58 intended-public pages: complete named-human academic/editorial/method review and close blocker-only evidence, or authorize a conservative visibility contraction. After that, QA must rerun the original row-level and runtime path against an immutable candidate. Until then, FAN-116 remains blocked and no release may proceed.

No commit, merge, deploy, index, or publication was performed by this audit.
