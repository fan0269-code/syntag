---
name: content-update
description: Update Syrtag public-page copy and catalog content without presenting demo, draft, or archived records as published scholarship. Use for homepage and trust-page wording, index empty states, publication-status changes, or a request to add theories, scholars, works, topics, or concepts.
---

# Syrtag content updates

Public pages describe the publication boundary in plain language. They do not invent a catalog, an operator, or a citation.

## What may appear in public HTML

- Records with `status: "published"`, reached through the existing entity queries.
- Trust copy that states the current limit: education and sociology only, advertising off, no monitored contact, no registered operator until one is actually published.
- Empty-catalog sentences. An empty list means nothing of that type is published. It does not mean the literature lacks the subject.

## What must stay out of public HTML

- The development sample graph, unless `NODE_ENV` is development and the page labels it as demo.
- Draft and archived seed rows. Do not flip them to `published` to make a directory look populated.
- Source-gap markers and owner-slot tokens such as `TODO_SOURCE` or `TODO_OWNER_*`. Say "Not published" instead of printing the token.
- A legal name, email, university imprint, committee, or jurisdiction that the operator has not supplied.
- New academic claims, DOIs, quotations, or scholar biographies written to fill space.

## Order of work

1. Read `docs/standards/content-writing-standard.md` before changing scholarly prose. For a correction or a status change, also read `docs/standards/content-update-standard.md`.
2. Keep `src/data/seed-content.ts` as the only academic corpus. Do not hard-code theory text into a page component.
3. A future education or sociology topic, theory, scholar, or work starts as a source stub in `docs/content/`, with empty source fields. It is not a page.
4. Publish only after a citable source, a locator, a verification date, and human review exist. Research, review, corpus edit, and publication are separate steps.
5. Scope stays education and sociology until a separate plan expands it. Do not add psychology or management routes to fill the sitemap.
6. Run `npm run content:check` when the corpus or a publication rule changes. A copy-only trust page does not require a new entity.

## Homepage and About

Lead with the empty catalog when no entity is published. Tell the reader where search and the indexes are, and that those indexes obey the same rule. Do not describe the graph as if it were the article.
