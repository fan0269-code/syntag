# P1 Content Corpus and Validation: Implementation Plan

> Date: 2026-07-12  
> Status: Completed  
> Phase: P1  
> Owner: Codex  
> Related: `prompts/completion/02-content-corpus.md`; `docs/SITE_CONSTRUCTION_PLAYBOOK.md`; `docs/superpowers/specs/2026-07-12-content-writing-system-design.md`

## 1. Goal and user value

- Give English-speaking master's and doctoral researchers a source-traceable first corpus that explains theory choice and limits, rather than exposing title-only records.
- After this work, the twelve confirmed Education and Sociology theories will have depth-appropriate content, boundaries, reading paths, and static validation before any database work begins.

## 2. Scope

### Included

- A single typed content fact source, pure content validation, targeted content tests, and a Prisma seed persistence adapter.
- Twelve primary theories at their existing D3/D2/D1 depths, plus concise sourced supporting nodes only where a genealogy reference requires them.

### Excluded

- Database credentials, migrations, database writes, deployment, UI, routes, navigation, or work for Psychology and Management.
- Changes to unrelated existing uncommitted work.

## 3. Current evidence and decisions

- Reproduction: `tests/content-validation.test.ts` imports the missing `src/data/seed-content.ts`; `npm test` cannot complete.
- Root cause: `prisma/seed.ts` holds title-level tuple data and writes only a `what_is_it` summary, so it cannot be the authored corpus or satisfy the page contract.
- Decision: `src/data/seed-content.ts` is the sole authored source. `prisma/seed.ts` will preflight and adapt it only when a future P2 run has a configured database.
- External dependency: no `DATABASE_URL` is configured. This window will neither configure one nor invoke Prisma seed or migration commands.

## 4. Implementation steps

1. Define the P1 delivery record and preserve the existing worktree — file: `docs/roadmaps/2026-07-12-content-corpus.md` — output: bounded execution plan.
2. Author a typed English corpus with stable slugs, source metadata, relations, and verification records — file: `src/data/seed-content.ts` — output: auditable single source of truth.
3. Add pure structural and cross-reference validation — file: `src/lib/content-validation.ts` — output: deterministic validation errors for invalid corpus data.
4. Replace legacy hard-coded seed metadata with a corpus persistence adapter — file: `prisma/seed.ts` — output: future database consumer with no authored duplicate data.
5. Strengthen focused validation tests and run the project gates — files: `tests/content-validation.test.ts` and project scripts — output: evidence-backed static P1 completion.

## 5. Data, content, and safety

- Data sources and verification: L1 only cites DOI, publisher, university, library, journal, or institutional sources; L2 labels editorial explanations; L3 labels proposed research and chapter guidance.
- Migration/seed impact: no database write in this window. The adapter changes future P2 input only.
- Environment/permissions: no new variables or permissions required.
- Privacy, copyright, and legal: original concise summaries only; no copied long text or unverified bibliographic claims.

## 6. Acceptance criteria

- Automation: `npm test`, `npm run lint`, and `npm run build` exit 0.
- Browser: not applicable; no UI or route changes are in scope.
- Data: exactly 12 primary theories; required blocks match D1/D2/D3; relationship endpoints and descriptions validate; each L1 verification has a traceable source.
- Links/SEO: no navigation, route, or SEO changes.

## 7. Risks, rollback, and release determination

- P0/P1 risks: inaccurate sources, invalid cross-references, or a seed adapter that duplicates authored content.
- Rollback: revert only this plan and the P1 corpus, validator, adapter, and test files.
- Release condition: this closes only static P1 content validation. The product remains not releasable until later database, runtime, information architecture, graph/search, SEO, and browser gates pass.

## 8. Execution record (complete after implementation)

- Actual changes: added the typed, single-source `src/data/seed-content.ts`; added pure cross-reference validation; converted `prisma/seed.ts` from authored tuples to a corpus-only persistence adapter; and strengthened structural corpus tests. The corpus covers exactly 12 primary theories (D3: 2, D2: 4, D1: 6) in Education and Sociology only.
- Verification results: `npm test` passed (11 tests); `npm run lint` passed; `npm run build` passed; `git diff --check` passed. The four corrected publisher/library records that needed URL revalidation returned HTTP 200. DOI and institutional records were reviewed against their authoritative landing pages before inclusion.
- Incomplete items and reason: no database migration or seed execution was attempted because `DATABASE_URL` is absent and this P1 window explicitly excludes database work. No browser check applies because no UI or route changed.
- Next step: P2 may configure a non-production database, run migrations, and execute this adapter twice to demonstrate idempotent persistence before claiming database-backed content availability.
