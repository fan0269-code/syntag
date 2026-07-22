# Task 1 Report — Topic evidence-pack publication alignment

## Scope

Implemented the brief for the four enrichment Topics only:

- `teacher-professional-learning-and-change`
- `education-policy-implementation-frontline-discretion`
- `access-to-educational-support-and-opportunity`
- `communities-of-practice-in-teacher-learning`

## TDD record

### RED

After changing the focused assertions first, ran:

```bash
node --env-file-if-exists=.env --experimental-strip-types --test \
  tests/content-validation.test.ts \
  tests/seed-corpus-regression.test.ts
```

Result: `18` tests total, `16` passed, `2` failed.

Both failures were expected and named the first enrichment Topic:

```text
teacher-professional-learning-and-change remains draft pending claim-level review
+ actual - expected
+ 'published'
- 'draft'
```

The failures occurred in the enriched-topic contract test and the seed-corpus regression test, confirming the prior corpus records were published and authored `publishedAt` values.

### Minimal implementation

In the first-enrichment batch, changed only the four Topic objects from `status: "published"` to `status: "draft"` and removed each Topic's `publishedAt` property. The shared `publishedAt` constant and all Scholar publication decisions were left intact.

## GREEN

Re-ran the exact focused command:

```bash
node --env-file-if-exists=.env --experimental-strip-types --test \
  tests/content-validation.test.ts \
  tests/seed-corpus-regression.test.ts
```

Result: `18` passed, `0` failed.

The test runner emitted the pre-existing `MODULE_TYPELESS_PACKAGE_JSON` warning only; it did not affect the result.

## Self-review

Read-only corpus inspection confirmed:

```text
four enrichment Topics: status=draft; publishedAt absent
topicTheories=12
publishedScholars=jean-lave:published,etienne-wenger:published,michael-lipsky:published
kingdon=draft
```

The focused contracts also confirm, for each Topic, pathway validity, exactly the `primary` / `supporting` / `not_recommended` roles, L1/L2/L3 verification separation, exactly three TopicTheory relations, and relation source URLs registered on the corresponding Theory.

`git diff --check -- tests/content-validation.test.ts tests/seed-corpus-regression.test.ts` completed with no whitespace errors.

## Files changed by this task

- `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts`
- `tests/content-validation.test.ts`
- `tests/seed-corpus-regression.test.ts`
- `.superpowers/sdd/task-1-report.md` (required task report)

## Concerns

- The worktree contained substantial pre-existing uncommitted changes, including the untracked enrichment batch. They were preserved; this task made only the scoped additive edits above.
- No commit, push, PR, merge, deployment, or database action was performed.
