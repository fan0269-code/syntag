---
name: seo-aeo
description: Write Syrtag titles, meta descriptions, headings, and internal links for search and answer engines without keyword stuffing. Use for metadata, sitemap copy, JSON-LD, Open Graph text, homepage and About snippets, or a request to improve SEO or AEO.
---

# Syrtag SEO and AEO

Snippets should match the page a person actually gets. Syrtag is an education and sociology research-navigation site. The public catalog can be empty. Advertising is off. Do not write copy that says the site is ready for an ad program.

## Title

- One subject, then `| Syrtag` or the site title pattern already used by `src/lib/seo.ts`.
- The homepage title names the product and the scope: education and sociology research navigation.
- About, privacy, terms, corrections, and editorial policy use their page name. Do not append "guide", "framework", and "doctoral" to a trust page.
- Entity titles may include the record's own name. Do not add a second keyword phrase that the record does not use.

## Description

- One or two sentences, at most 160 characters. `clampSeoDescription` enforces the cap and does not pad short text.
- If the page has a real summary, use that summary. Do not append "Explore this {keyword} through key ideas…".
- Homepage and About descriptions state three facts when they are true: education and sociology scope, pages appear only when published, advertising is off.
- Say the catalog can be empty. Do not promise a count of articles, a live graph, or a review committee.
- Do not repeat the title's words in a stack of synonyms.

## Headings and answers

- The H1 answers what the page is. On an empty home, the H1 says the graph is not published yet.
- The first paragraph answers the follow-up a reader or an answer engine would ask: why the page is empty, and what to do next.
- H2s on About name identity, contact, corrections, and the publication boundary. Do not add an H2 for a keyword with no section under it.
- Index H1s stay the catalog name (`Theories`, `Topics`). The description says the list is published-only.

## Internal links

- Link to routes that exist: `/`, `/search`, the seven catalog indexes, and the trust pages in the footer.
- Recovery links from search and errors go to the homepage or a catalog, not to `#graph`, unless that graph is rendered.
- Do not link a stub, a draft slug, or a demo node from a public page.
- Sitemap entries for entities stay limited to `status: "published"`. Static trust pages may stay listed because they are real pages.

## Structured data

- JSON-LD and Open Graph text use the same claims as the visible page.
- Do not emit `Book`, `ScholarlyArticle`, or a person graph for a record that is not published.
- Collection structured data describes published items only. It does not call the graph itself an article.

## Not in scope

- Inventing published topic pages to chase queries.
- Education or sociology "deep topic" pages before source-backed human review. Those remain templates under `docs/content/`.
- Ads.txt, an adsense account meta tag, or any sentence that says an advertising application is ready.
- Treating a knowledge-graph widget as unique article content.
