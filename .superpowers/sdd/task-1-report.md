# Task 1 report: typed page-content templates

## Scope

Created only the Task 1 templates and focused test:

- `src/data/templates/theory-template.ts`
- `src/data/templates/scholar-template.ts`
- `src/data/templates/work-template.ts`
- `src/data/templates/topic-template.ts`
- `tests/content-templates.test.ts`

The templates provide the requested page-content interfaces, theory-depth block rules, a non-empty block validator, a complete English D2 Life Course example, and compact English scholar, work, and topic examples.

## TDD record

1. Added `tests/content-templates.test.ts` before production code.
2. Ran `node --experimental-strip-types --test tests/content-templates.test.ts`.
3. Observed the expected red failure: `ERR_MODULE_NOT_FOUND` for `src/data/templates/theory-template.ts`.
4. Implemented the template contracts and examples.
5. Re-ran the focused test: 1 passing, 0 failing.

`isTheoryContent` checks that every depth-required block is present and non-empty. This is necessary for the specified negative case in which an empty `fit_writing` array must be rejected.

## Verification

- Focused test: `node --experimental-strip-types --test tests/content-templates.test.ts` — pass (1/1).
- Full test suite: `npm test` — pass (4/4).
- Type check: `npx tsc --noEmit --incremental false` — pass.
- Diff whitespace check: `git diff --check` — pass.

The test commands emit the repository's pre-existing Node module-type warning because `package.json` does not declare `"type": "module"`. This Task intentionally does not change project configuration.

## Self-review

- `TheoryDepth` applies the required D1 subset and full D2/D3 block set.
- The Life Course example supplies all required D2 blocks with English copy and source/verification metadata.
- Scholar, work, and topic contracts reuse shared source, verification, and reading-path types rather than duplicating them.
- No existing unrelated files were modified or staged.

## Review-fix addendum (2026-07-12)

### Fixed findings

- Added explicit Scholar `academic_identity` and `research_fit` fields, with populated Glen Elder example values.
- Added Work `core_question`, `content_guide`, `key_chapters`, and lawful `lawful_access` routes. The compact work example links only to its DOI landing page.
- Added Topic `theory_comparison_table`, `recommended_primary_theory`, and `chapter_structure_suggestion`, with the school-to-work example comparing Life Course Theory and Social Capital Theory.
- Added the `isTheoryDepth` runtime type guard. `isTheoryContent` now rejects unknown depths and validates the required D1/D2/D3 block shapes rather than only checking fields are non-empty.
- Strengthened nested validation for concepts, genealogy, suitability, operationalization, chapters, sources, reading paths, and verification records.
- Made provenance discriminated and explicit: traceable `ContentSource` entries are L1-only and identify a source kind; L1 verification must reference an existing source; L2 is editorial; L3 is proposed.
- Added focused tests for page-specific template fields, invalid depth values, malformed nested blocks, and invalid L1 provenance.

### Commands and results

1. `node --experimental-strip-types --test tests/content-templates.test.ts`
   - Initial red run failed as intended because `isTheoryDepth` was not exported.
   - Final run: 3 tests passed, 0 failed.
2. `npx tsc --noEmit --incremental false`
   - Passed with exit code 0 and no output.
3. `npm test`
   - Final run: 6 tests passed, 0 failed.
4. `git diff --check`
   - Passed with no output.

The test commands retain the repository's pre-existing Node module-type warning because `package.json` does not declare `"type": "module"`; this fix does not alter project configuration.

### Final self-review

- The changes are limited to the four Task 1 template modules and the focused template test.
- L1 claims cannot validate without a source that is present in the template's source list; the compact examples use a DOI-backed L1 source and reserve recommendations for L2/L3.
- The report is an untracked task artifact and is intentionally not staged with the code commit.

## Final re-review fixes (2026-07-12)

- `isTheoryContent` now validates every optional `reading_path[].source_id` against the current page's `ContentSource.id` set, matching the existing L1 verification-source integrity rule.
- Added a focused negative test using `invented-source-id`; it failed before the validator change and passes after it.
- Corrected the compact Life Course journal-article example: its retained `key_chapters` entry is now explicitly an article-level guide and says it is not a chapter title.

### Verification

1. `node --experimental-strip-types --test tests/content-templates.test.ts`
   - Red: 2 expected failures (invented reading-path source was accepted; article example was labeled as a chapter).
   - Green: 4 passed, 0 failed.
2. `npm test`
   - Passed: 7 passed, 0 failed.
3. `git diff --check -- src/data/templates/theory-template.ts src/data/templates/work-template.ts tests/content-templates.test.ts`
   - Passed with no output.

The pre-existing Node module-type warning remains and is outside this Task 1 scope. This report remains untracked and excluded from the Task 1 code/test commit.
