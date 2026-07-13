# Syrtag P8 Release Readiness

## Current Status

P7 completed the pre-launch site check. The reported gates have passed: `npm run db:seed`, `npm test`, `npm run lint`, and `npm run build`. Browser acceptance covered the homepage, search page, entity detail pages, legal/trust pages, `robots.txt`, `sitemap.xml`, and a 375px mobile viewport. P7 also completed the small fixes for theory genealogy hydration, entity index page canonical metadata, and core index pages in the sitemap.

P8 has not deployed, published, committed, or pushed anything. The current worktree already contains existing uncommitted and untracked files from earlier phases; this document is an added release-preparation artifact, not a clean-release commit.

This phase does not add product features, content expansions, UI redesign, third-party integrations, or production credentials.

## Go / No-Go Summary

Recommendation: Go for "deploy after human confirmation", provided the human checks below are completed and production database access is confirmed.

| Area | Status | Notes |
| --- | --- | --- |
| Code gates | Go | P7 reported `db:seed`, tests, lint, and build passing. Re-run the pre-deploy commands below immediately before deployment. |
| Browser acceptance | Go | P7 reported coverage for core pages, legal/trust pages, SEO files, and 375px mobile. Re-run the smoke test after deployment. |
| Database | Conditional Go | Production PostgreSQL, migration execution, and seed execution must be confirmed. `DATABASE_URL` is required for seeded data and dynamic routes. |
| Legal/trust pages | Conditional Go | Pages exist and were browser-checked, but legal text remains lightweight and needs human legal/product review. |
| Content completeness | Conditional Go | Current public scope is Education and Sociology. Works and concepts index routes are available, but there are no published work/concept entries yet. |

## Required Environment Variables

Do not print or share real values in release notes, logs, tickets, or screenshots.

| Variable | Required | Purpose | Current usage note |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma runtime, migrations, seed, search, graph, and entity pages. | Used by Prisma config, `prisma/seed.ts`, and `src/lib/db.ts`. Missing value makes DB-backed runtime data unavailable. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Intended public site origin for canonical URLs and public metadata. | Current public domain is `https://syrtag.com`; `.env.example` and `src/lib/seo.ts` are aligned. |
| `NEXT_PUBLIC_SUPABASE_URL` | Not confirmed for current runtime | Future/public Supabase client URL if Supabase is used. | Present in `.env.example`; no current source usage found in `src/` or `prisma/`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Not confirmed for current runtime | Future/public Supabase anonymous key if Supabase is used. | Present in `.env.example`; no current source usage found in `src/` or `prisma/`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Not confirmed for current runtime | Future private Supabase service role key if server-side Supabase admin access is used. | Present in `.env.example`; no current source usage found in `src/` or `prisma/`. Treat as secret if ever configured. |

## Database Readiness

Production requires a PostgreSQL database reachable from the deployment environment. Do not use local Docker database settings as production settings.

Required order:

1. Configure the production `DATABASE_URL` in the deployment environment.
2. Apply Prisma migrations to the production database. The package script `npm run db:migrate` currently runs `prisma migrate dev`, so production operations should confirm the intended production command, normally `npx prisma migrate deploy` or the platform equivalent.
3. Run `npm run db:seed` against the production database only after migration success.
4. Verify seeded data with the smoke tests and, where available, a read-only seed verification check.

If `DATABASE_URL` is missing, `prisma/seed.ts` fails immediately and DB-backed runtime pages/API paths treat data as unavailable. The sitemap falls back to static pages when DB access fails.

The current public discipline scope should remain Education and Sociology. Do not open additional disciplines during this release.

## Pre-Deploy Checklist

Run these commands in the release candidate workspace immediately before deployment:

```bash
npm run db:seed
npm test
npm run lint
npm run build
```

Expected result: each command exits successfully. `npm run db:seed` requires a valid `DATABASE_URL` and should complete without changing the intended public scope. Tests should pass without skipped release-critical coverage. Lint and build should complete without new errors.

## Deploy-Time Checklist

1. Confirm the release owner and rollback owner are available.
2. Configure production environment variables without exposing values in logs or chat.
3. Confirm production PostgreSQL connectivity from the deployment environment.
4. Apply migrations with the approved production migration command.
5. Run the seed once after migrations succeed.
6. Build the application from the intended source revision.
7. Deploy the built application through the chosen platform.
8. Watch application, build, database, and edge/function logs for errors.
9. Keep the previous application version available until post-deploy smoke testing passes.

## Post-Deploy Smoke Test

Check the deployed production origin, not only local preview:

- `/`
- `/search?q=Life%20Course%20Theory`
- `/search?q=Elder`
- `/search?q=transitions`
- one no-result search, for example `/search?q=unlikely-no-result-query`
- `/theories/life-course-theory`
- `/scholars/glen-h-elder-jr`
- `/topics/educational-transitions-over-time`
- `/about`
- `/privacy`
- `/terms`
- `/editorial-policy`
- `/robots.txt`
- `/sitemap.xml`

Expected result: public pages return successful responses, search results match seeded data, no-result search is handled gracefully, legal/trust pages render, `robots.txt` disallows `/api/`, and `sitemap.xml` includes static pages plus published entity URLs when the database is reachable.

Also repeat the core page checks at a 375px mobile viewport. Confirm that navigation, search, entity cards, legal pages, and the theory genealogy map remain readable without hydration errors or horizontal layout breakage.

## Rollback Plan

Application rollback:

1. Keep the previous deployable application version available before release.
2. If post-deploy smoke tests fail or logs show release-blocking runtime errors, switch traffic back to the previous application version.
3. After rollback, re-run smoke tests for `/`, search, a theory detail page, legal pages, `robots.txt`, and `sitemap.xml`.
4. Capture the failed version identifier, log excerpts without secrets, and the failing URLs for follow-up.

Database rollback:

- Seed is idempotent through upserts, but it can still change production rows. Confirm whether a pre-seed database backup or snapshot is available before running production seed.
- The initial migration creates the release schema. If a migration has already been applied in production, rolling it back may require database snapshot restore or a separately reviewed down migration.
- No formal migration rollback script is currently documented in the repo. This is a required pre-launch operations confirmation item.

## Security And Privacy Notes

- Do not leak `.env` values, database connection strings, Supabase service keys, tokens, or platform credentials.
- API errors should not expose SQL, connection strings, or internal stack traces. Current API runtime returns generic 503/500 messages and logs limited error name/code details.
- `robots.txt` disallows `/api/`; keep API endpoints out of search indexing.
- Legal, privacy, terms, and editorial-policy pages need human review before public launch.
- If screenshots or logs are shared during release, redact connection strings and secret-bearing request metadata.

## Known Non-Blocking Risks

- Node `MODULE_TYPELESS_PACKAGE_JSON` warning may appear during command execution; track separately unless it becomes a build failure.
- `/api/og` Edge runtime build warning/tip may appear; track separately unless image generation breaks production metadata.
- `works` and `concepts` public index routes are accessible, but no published work/concept entries are currently seeded.
- Legal page text is lightweight and should be reviewed by a human before launch.
- `.env.example` includes `NEXT_PUBLIC_SITE_URL`, and current canonical/metadata code is aligned to `https://syrtag.com`.
- `.env.example` includes Supabase variables that are not confirmed as used by the current runtime.

## Out Of Scope For This Phase

- Expanding theory, scholar, topic, work, or concept body content.
- Opening new disciplines beyond Education and Sociology.
- Adding new product features.
- Redesigning UI or brand packaging.
- Adding advertising, account, payment, submission, or human-service workflows.
- Connecting new third-party services.
- Deploying, publishing, committing, or pushing.
