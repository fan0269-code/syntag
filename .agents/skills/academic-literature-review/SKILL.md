---
name: academic-literature-review
description: Plan, execute, and document traceable literature reviews for Syrtag's education and sociology scope. Use for narrative, scoping, or bounded systematic reviews; research-question mapping; source screening; thematic synthesis; research-gap analysis; 文献综述; 研究现状; or 理论脉络整理.
---

# Academic Literature Review

Create an auditable review from a defined question and bounded source set.

## Define the review

1. Read `AGENTS.md` and the relevant files under `docs/research/`.
2. State the research question, review type, discipline, population or context, date range, languages, and intended decision.
3. Define inclusion and exclusion criteria before broad searching.
4. Record unknown or user-dependent choices instead of silently filling them.

Choose the simplest adequate review:

- Use a narrative review for conceptual orientation or intellectual history.
- Use a scoping review for mapping themes, methods, and gaps.
- Call work systematic only when the protocol, databases, queries, screening, and exclusions are fully recorded.

## Search and screen

Build reproducible search strings from the main concepts, synonyms, scholars, and canonical works. Search appropriate academic indexes and authoritative source sites available in the task.

For every retained source, record:

- Full citation and stable identifier.
- Source type and access date.
- Inclusion reason.
- Study or text type, context, and method when applicable.
- Directly supported findings or arguments.
- Limitations and inaccessible material.

Do not treat snippets, abstracts, citation counts, or secondary summaries as proof of claims unavailable in the checked source. Deduplicate records and record exclusion reasons at full-text screening when claiming a systematic process.

## Synthesize

Separate:

1. Descriptive findings: what the sources explicitly report.
2. Interpretive synthesis: patterns inferred across sources.
3. Disagreements: conflicting definitions, results, methods, or traditions.
4. Gaps: genuinely missing evidence, not merely sources not yet searched.

Use cautious causal language. Compare studies only at compatible units, populations, and time periods. Preserve disciplinary and historical context.

## Deliver

Unless the user specifies another artifact, save a Markdown review under:

`docs/research/YYYY-MM-DD-<topic>-literature-review.md`

Include:

- Scope and review question.
- Search protocol and search log.
- Inclusion and exclusion criteria.
- Screening or evidence table.
- Thematic synthesis with claim-level citations.
- Contradictions, limitations, and research gaps.
- Follow-up verification queue.
- Publication boundary.

Keep the output `draft` or `review`. Do not edit corpus data, seed the database, change publication status, or deploy the site.
