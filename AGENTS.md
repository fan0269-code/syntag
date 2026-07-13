# Repository Guidelines

## Project Structure & Module Organization

Syrtag is a Next.js 16 App Router application for research-theory knowledge graphs. Application code lives in `src/`: routes in `src/app/`, reusable UI in `src/components/`, data access and domain helpers in `src/lib/`, and typed content contracts in `src/data/`. Prisma schema, migrations, and seeding live in `prisma/`. Node test files are in `tests/` and use the matching `*.test.ts` suffix. Static assets belong in `public/`. Project notes are in `docs/`; execution prompts are in `prompts/`.

## Build, Test, and Development Commands

- `npm run dev` — start the local development server.
- `npm run build` — create a production build and run Next.js type validation.
- `npm run start` — serve a completed production build.
- `npm run lint` — run ESLint with Next.js Core Web Vitals and TypeScript rules.
- `npm test` — run the Node test suite with TypeScript stripping.
- `npm run db:migrate` / `npm run db:seed` — apply local Prisma migrations and seed data; require `DATABASE_URL`.

Never use `npm run db:reset` against shared or production data. Copy `.env.example` to a local `.env` and never commit credentials.

## Coding Style & Naming Conventions

Use TypeScript with the `@/*` import alias. Follow the surrounding file style: two-space indentation, semicolons, double quotes, and concise React components. Use PascalCase for component files and exported React components (for example, `TheoryDetail.tsx`); use lowercase, hyphenated names for routes and data files (for example, `content-validation.ts`). Keep route-specific code near its `src/app/` route and database queries in `src/lib/entities/`.

This project uses a newer Next.js release. Before modifying framework-sensitive APIs or conventions, read the relevant guidance in `node_modules/next/dist/docs/` and address deprecation warnings.

## Testing Guidelines

Add focused `*.test.ts` coverage for changed parsing, content contracts, API behavior, and SEO metadata. Tests use `node:test` and `node:assert/strict`; avoid network and live-database dependencies unless explicitly running an integration check. Run `npm test`, `npm run lint`, and `npm run build` before handing off changes. Do not weaken, skip, or delete a failing test to claim completion.

## Commit & Pull Request Guidelines

Recent history uses concise Conventional Commit-style prefixes, such as `feat: add typed content templates`, `fix: tighten template source references`, and `docs: add content writing system design`. Keep commits scoped and imperative. PRs should explain impact, list verification results, link the relevant issue or prompt, and include screenshots for visual or responsive changes. Call out migrations, seed changes, environment requirements, and unresolved risks.
