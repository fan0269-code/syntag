# Release, Positioning, and Experience Hardening

**Date:** 2026-07-14  
**Status:** Approved design  
**Scope:** Release reliability, site positioning, content roadmap, and UI/UX direction. This document does not implement a site-wide redesign or publish new scholarly content.

## 1. Decision

Syrtag will be positioned as an English-language research tool for Education and Sociology researchers:

> **Syrtag helps Education and Sociology researchers move from a research question to a defensible theory pathway, with source-aware comparisons, concepts, and reading routes.**

The initial product is not a cross-disciplinary dissertation-framework generator or a generic theory encyclopedia. It supports theory discovery, comparison, source-aware reading, and research-design reflection. It does not replace original-source reading, methodological review, or supervisory advice.

## 2. Scope and non-goals

### In scope

1. Replace the CI workflow's remote `sed` patch with a version-controlled deployment script upload.
2. Make production sequencing explicit: install dependencies, migrate, seed, build, restart, and verify.
3. Record the release invariant in `CLAUDE.md`: published entities and public slugs must exist before the build that generates static routes and the sitemap.
4. Add a project-level roadmap documenting positioning, information architecture, content priorities, UI direction, execution gates, and success checks.
5. Add a content-audit document with concrete gap remediation prompts for Codex.
6. Add a UI-audit document with concrete design remediation prompts for OpenDesign.

### Out of scope

- No production deployment in this change set.
- No new scholarly claims, source records, disciplines, database fields, or entity URL changes.
- No implementation of the planned UI or content improvements in this change set.
- No attempt to convert the site to a bilingual product.

## 3. Release hardening design

### Current failure mode

The deployed server executes `/var/www/syrtag.com/deploy-production.sh`, while GitHub Actions modifies that remote file with `sed` before execution to insert `npm run db:seed`. The tracked script itself does not seed content. This creates an undocumented state difference between the repository and production deployment behavior.

Additionally, public entity routes obtain static parameters from the database and set `dynamicParams = false`. If published records are not seeded before the build, new slugs are omitted from the build and sitemap; writing them directly to production afterward does not make their pages discoverable.

### Target release chain

```text
GitHub push to main
  → GitHub Actions checks out the repository
  → securely copies the tracked deployment script to the remote host
  → installs it at /var/www/syrtag.com/deploy-production.sh
  → executes the installed script
      → fetches the target commit
      → npm ci
      → prisma migrate deploy
      → npm run db:seed
      → npm run build
      → restart service
      → probes the local production endpoint
```

The tracked `ops/deploy-production.sh` remains the single source of truth. The GitHub workflow must no longer mutate remote scripts with `sed`.

### Release invariant

For any change that adds or revises public content:

1. Apply migrations when schema changes exist.
2. Seed the published corpus.
3. Build only after seeding.
4. Confirm public entity URLs and sitemap entries in the build/deployment verification.
5. Deploy the build.

This applies to initial environments and later additions. ISR cannot make a new slug available when a detail route has `dynamicParams = false` and the slug was absent from `generateStaticParams()` at build time.

## 4. Product model and information architecture

### Primary users

- Education and Sociology master's and doctoral researchers selecting or comparing theories.
- Researchers writing proposals, literature reviews, or theoretical-framework sections.
- Researchers tracing concepts, scholars, foundational works, and source-backed relationships.

### Core task flow

```text
Research question
  → candidate theory comparison
  → theory guide
  → concepts, foundational works, scholars, and related theories
  → reading and research-design reflection
```

### Navigation model

Use task-oriented labels in the primary navigation:

1. Research Questions
2. Theories
3. Disciplines
4. Search
5. About

Keep Scholars, Works, and Concepts as accessible library assets through the footer, search, entity relationships, and a secondary “Research library” context. Do not delete their existing routes or URLs.

### Homepage model

The homepage must prioritize discoverable research tasks over the interactive graph:

1. Scope-aware value proposition for Education and Sociology researchers.
2. A research-question entry point linking existing Topics.
3. Theory browsing grouped by actual supported disciplines.
4. A three-step explanation: Question → Compare → Read and apply.
5. A visible scope and evidence note.
6. The graph as an “Explore theory connections” work area, not the only hero interaction.

## 5. Content roadmap

### Existing content base

The current released corpus contains two disciplines, six fields, twelve theories, four research topics, four scholar profiles, nineteen works, and twenty-four concepts. Its differentiator is not sheer scale but explicit source-aware theory selection, comparison, boundaries, reading paths, and research-design reflection.

### Priority order

1. **Release integrity first:** ensure the complete corpus is seeded before build and visible in sitemap/static routes.
2. **Scope clarity:** align homepage, About, Footer, navigation, and metadata with Education and Sociology only.
3. **Task-entry content:** expose existing Topic pages and Theory pages from the homepage as static crawlable paths.
4. **Decision-support content:** improve theory cards and topic cards with real discipline, research-question, analysis-unit, and recommendation context.
5. **Comparison cluster:** plan additional topic and theory-comparison pages around the existing twelve theories before adding new disciplines.
6. **Semantic SEO improvements:** only after pages and release flow are stable, extend structured data using data already rendered on the page.

### Content acceptance rules

Every future public page must:

- link to real published entities or verified source records;
- distinguish stable facts, editorial interpretation, and context-dependent research advice;
- state limits rather than framing one theory as universally correct;
- avoid expanding the public scope beyond Education and Sociology until a comparable content cluster exists;
- preserve current entity URLs and avoid empty or synthetic recommendation cards.

## 6. UI and accessibility direction

### Desired character

Syrtag should read as a rigorous academic research workbench: calm, legible, source-aware, and task-oriented. The present warm tone can remain, but decorative glass, glow, oversized rounding, and continuous graph motion must not overpower evidence, structure, and readability.

### Priority experience improvements

1. Establish English as the single initial UI language.
2. Add full site framing to the normal homepage, including footer and complete navigation.
3. Make the graph explainable: visible entity/relationship legend, direction explanation, status context, explicit zoom/reset/list controls, and text alternatives.
4. Make the graph accessible: keyboard-visible alternatives, status messaging, reduced-motion behavior, non-color-only distinctions, and correct dialog/focus handling for details.
5. Give long theory articles a stable hierarchy and table of contents: summary, fit, concepts, mechanism and boundaries, comparison, research design, and sources.
6. Treat mobile as a task-first experience: a list/pathway alternative before a large freeform canvas, at least 44px primary touch targets, and non-obscuring detail panels.
7. Make search and entity indexes scan-friendly, visibly labeled, and usable without hover, canvas interaction, or horizontal-only controls.

## 7. Implementation sequence

### Phase A — release reliability (this change set)

- Update `ops/deploy-production.sh` so it explicitly runs `npm run db:seed` after migrations and before build.
- Update `.github/workflows/deploy-production.yml` to checkout the repository, transfer the tracked deployment script to the remote host, install it with sudo, then execute it; remove the `sed` patch.
- Update `CLAUDE.md` with the release invariant and actual CI behavior.
- Validate shell syntax, the relevant Node tests, lint, and build; report any database-dependent validation boundary honestly.

### Phase B — positioning and IA (Codex)

- Implement English UI consistency and the narrowed scope statement.
- Reorder homepage around research-question entry and static pathways.
- Reduce primary navigation to the five task-oriented items without removing existing entity routes.
- Add regression coverage for the homepage links, language consistency, navigation, and scope statement.

### Phase C — content navigation and semantic SEO (Codex)

- Group theory and topic indexes using existing relationships.
- Make theory breadcrumbs begin with Theories rather than a single field.
- Improve metadata and JSON-LD only with already published, rendered data.
- Plan and approve comparison content before writing scholarly copy.

### Phase D — UI workbench redesign (OpenDesign, then implementation)

- Deliver design direction and responsive screens for homepage, graph, theory detail, search, and indexes.
- Require WCAG 2.2 AA acceptance annotations before implementation.
- Implement and verify the design incrementally, beginning with the homepage and graph alternatives.

## 8. Verification and release gates

### Phase A gate

- `bash -n ops/deploy-production.sh`
- `npm test`
- `npm run lint`
- `npm run build`
- Review the workflow to confirm no remote `sed` mutation remains.
- Confirm the tracked script executes seed before build.

### Content release gate

Before a production release, verify:

- published theory, topic, work, concept, scholar, discipline, and field counts match the intended seed corpus;
- representative entity slugs are rendered in the production build;
- sitemap contains only public, reachable entity URLs;
- homepage, a theory page, a topic page, a work page, and a concept page render expected source and status information;
- no document claims that local content is live until production verification proves it.

### Design gate

Before accepting any UI implementation:

- the homepage communicates the supported scope and the first action within ten seconds;
- all core actions work without canvas manipulation;
- graph interactions have a keyboard and text alternative;
- dialogs, focus, status updates, touch targets, responsive layouts, and reduced-motion behavior meet the documented acceptance conditions;
- desktop and 375px mobile reviews use real content density, not placeholders.
