# Repository Guidelines

## Project Structure & Module Organization

Syrtag is a Next.js 16 App Router application for research-theory knowledge graphs. Application code lives in `src/`: routes in `src/app/`, reusable UI in `src/components/`, data access and domain helpers in `src/lib/`, and typed content contracts in `src/data/`. Prisma schema, migrations, and seeding live in `prisma/`. Node test files are in `tests/` and use the matching `*.test.ts` suffix. Static assets belong in `public/`. Project notes are in `docs/`; execution prompts are in `prompts/`.

## Build, Test, and Development Commands

- `npm run dev` — start the local development server.
- `npm run build` — create a production build and run Next.js type validation.
- `npm run typecheck` — run TypeScript with `tsc --noEmit`.
- `npm run start` — serve a completed production build.
- `npm run lint` — run ESLint with Next.js Core Web Vitals and TypeScript rules.
- `npm test` — run the Node test suite with TypeScript stripping.
- `npm run test:e2e` — after a fresh production build, run Chromium Playwright + axe checks; set `PLAYWRIGHT_PORT` when port 3000 is occupied.
- `node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts` — after `npm run build`, verify the core `.next` route artifacts.
- `npm run content:check` — validate the seed corpus and local content-onboarding publication rules.
- `npm run db:migrate` / `npm run db:seed` — apply local Prisma migrations and seed data; require `DATABASE_URL`.

Never use `npm run db:reset` against shared or production data. Copy `.env.example` to a local `.env` and never commit credentials.

## Coding Style & Naming Conventions

Use TypeScript with the `@/*` import alias. Follow the surrounding file style: two-space indentation, semicolons, double quotes, and concise React components. Use PascalCase for component files and exported React components (for example, `TheoryDetail.tsx`); use lowercase, hyphenated names for routes and data files (for example, `content-validation.ts`). Keep route-specific code near its `src/app/` route and database queries in `src/lib/entities/`.

This project uses a newer Next.js release. Before modifying framework-sensitive APIs or conventions, read the relevant guidance in `node_modules/next/dist/docs/` and address deprecation warnings.

## Testing Guidelines

Add focused `*.test.ts` coverage for changed parsing, content contracts, API behavior, and SEO metadata. Tests use `node:test` and `node:assert/strict`; avoid network and live-database dependencies unless explicitly running an integration check. UI changes also use the Chromium-only Playwright + axe suite under `tests/e2e/`; run it only after migrate/seed/build have produced a fresh production build. Run `npm test`, `npm run lint`, `npm run build`, and the relevant E2E checks before handing off changes. Do not weaken, skip, or delete a failing test to claim completion.

## Content Sources and Citation Rules

For every theory, scholar, work, or topic article, research and verify sources before drafting. Record the source URL, source type, and verification date in the content data, and include the relevant sources in the published article.

- Use OpenAlex, Crossref, ORCID, Google Books, and WorldCat to verify structured facts such as authorship, publication date, DOI, ISBN, edition, institutional affiliation, and citation relationships.
- Use original books and papers, publisher pages, university archives, and authoritative academic encyclopedias to support substantive claims about definitions, arguments, intellectual history, influence, and relationships between theories or scholars.
- Treat Wikidata and general encyclopedias as discovery and cross-checking sources only. They must not be the sole support for a substantive academic claim.
- Do not draft from memory or infer unsupported claims. If a claim cannot be verified from an appropriate source, omit it or mark it clearly for human review.

## Commit & Pull Request Guidelines

Recent history uses concise Conventional Commit-style prefixes, such as `feat: add typed content templates`, `fix: tighten template source references`, and `docs: add content writing system design`. Keep commits scoped and imperative. PRs should explain impact, list verification results, link the relevant issue or prompt, and include screenshots for visual or responsive changes. Call out migrations, seed changes, environment requirements, and unresolved risks.

## Obsidian Update Sync

After completing any content-facing change, automatically create or update one review record under `/Users/fanlw/Documents/Website-Content-Hub/20-16-博士知识图谱网站建设/30-待审核/网站更新记录/`. Follow `/Users/fanlw/Documents/Website-Content-Hub/50-内容模板/网站更新同步记录模板.md` and record the branch, baseline/result commit when available, changed files, content summary, planning basis, academic sources, actual verification results, publication-status boundary, risks, and owner decision needed.

This sync is part of the content task and does not require a separate reminder. Preserve unrelated repository and Vault changes. Set the Vault record to `status: review`, `needs_human_review: true`, `owner_decision: pending`, and `deployment_status: not_started`. Never mark the record approved, previewed, deployed, or published on the owner's behalf. Do not expose draft entities or deploy unless the owner separately authorizes it after review.
