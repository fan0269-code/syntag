---
name: academic-claim-audit
description: Audit academic prose, evidence packs, and Syrtag corpus content claim by claim against cited sources. Use for citation checking, DOI or ISBN identity checks, locator review, overclaim detection, source-to-claim traceability, 引文核查, 事实核验, claim audit, or pre-publication academic review.
---

# Academic Claim Audit

Determine whether each material claim is supported by the cited evidence without rewriting or publishing by default.

## Set the audit scope

1. Read `AGENTS.md`, `docs/research/skill-sop.md`, and the exact target files.
2. Record the target files, entity status, baseline, and requested audit depth.
3. Treat the task as read-only unless the user explicitly asks for corrections.
4. Stop if the requested source, prompt, or target file is missing.

Preserve unrelated and untracked work.

## Audit each claim

Split prose into atomic, checkable claims. Classify each as bibliographic, biographical, descriptive, interpretive, comparative, causal, evaluative, or relational.

For each material claim:

1. Identify the cited source and locator.
2. Verify citation identity: authors, title, year, venue or publisher, DOI or ISBN.
3. Check whether the accessible source directly supports the wording.
4. Detect scope expansion, causal inflation, compressed disagreement, temporal mismatch, and unsupported relationships.
5. Assign one status:
   - `supported`
   - `partially_supported`
   - `unsupported`
   - `unverifiable`
   - `citation_mismatch`
6. Assign severity:
   - `high`: fabricated or mismatched identity, unsupported central claim, or publication-blocking error.
   - `medium`: material overstatement, missing locator, or incomplete support.
   - `low`: citation formatting or clarity issue that does not change meaning.

Do not accept a source merely because its topic is related. Do not invent locators or use a secondary source as if it were the primary text.

## Report

Return findings first, ordered by severity, with file and line references when available. Use a table containing:

- Claim ID and location.
- Exact or concise claim wording.
- Source and locator.
- Status and severity.
- Evidence boundary.
- Minimal recommended action.

Conclude with:

- Counts by status and severity.
- Publication blockers.
- Claims safe to retain.
- Claims requiring better sources or human review.
- Sources that could not be accessed.

If asked to save the audit, use `docs/research/claim-audit/` and avoid overwriting an existing audit without explicit authorization. Do not change corpus content, status, database state, or deployment as part of an audit.
