---
name: syrtag-research
description: Verify academic sources for Syrtag theories, scholars, works, concepts, topics, and knowledge-graph relations. Use for source verification, DOI or ISBN lookup, evidence packs, source registers, claim matrices, ContentSource drafts, locator upgrades, or requests such as 核验理论来源, 核验学者, 文献证据包, and theory sourcing.
---

# Syrtag Research

Produce source-first, field-level evidence that follows Syrtag's content contract.

## Establish the boundary

1. Read `AGENTS.md` and `docs/research/skill-sop.md` completely before researching.
2. Identify the target entity, field path, research question, and requested decision.
3. Inspect relevant existing evidence packs and corpus entries before creating another file.
4. Keep the task research-only unless the user explicitly authorizes content implementation.

If the target or decision is materially ambiguous, stop and ask. Preserve unrelated and untracked work.

## Retrieve and verify

Use current primary or authoritative sources. Browse when verification depends on live records.

- Verify structured facts with DOI resolution, Crossref, publisher or journal records, ORCID, university profiles, Google Books, and WorldCat.
- Use OpenAlex for discovery and cross-checking, not as the persisted source or sole support.
- Support definitions, arguments, intellectual history, and relationships with original books or papers, publisher pages, university archives, or authoritative academic reference works.
- Treat Wikidata and general encyclopedias as discovery aids only.
- Resolve each DOI against its title, authors, year, and publication before accepting it.
- Never infer facts from an adjacent DOI, search-result snippet, citation count, or inaccessible full text.

Record an access date and distinguish what each source directly supports from what it does not support. If a source cannot be checked, mark the claim `L3_pending` or omit it.

## Build the evidence pack

Follow the exact tables and source-kind mapping in `docs/research/skill-sop.md`. Produce:

1. A source register.
2. A claim matrix with field paths, L1/L2/L3 status, locators, and forbidden extensions.
3. A draft `ContentSource` snippet when requested.
4. An explicit decision and publication boundary.

Save new packs under `docs/research/` using the repository's date-and-slug naming convention unless the user supplies an exact path. Reuse an existing target file only when the request clearly authorizes updating it.

## Enforce research integrity

- Do not fabricate DOI, ISBN, author, affiliation, date, page, quotation, citation relation, or URL.
- Do not convert editorial synthesis into an L1 fact.
- Do not claim a source supports text beyond the verified locator or accessible material.
- Keep PDFs internal; expose only citations, URLs, and locators.
- Do not add corpus entries, seed data, migrations, database writes, or published content.
- Do not run deployment or change an entity to `published`.

Finish by checking traceability: every claim source ID exists in the register, every locator is real or explains why absent, and every `supports` item is narrower than or equal to the verified evidence.
