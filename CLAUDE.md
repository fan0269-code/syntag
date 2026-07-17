# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Syrtag is a Next.js 16 App Router application for doctoral-research theory knowledge graphs. It presents published theories, scholars, works, concepts, topics, disciplines, and fields; its primary interactive surfaces are the homepage graph and site search. The project uses PostgreSQL through Prisma 7, React Query for client-side graph data, and Tailwind CSS 4.

`README.md` is the default Create Next App README and does not reflect the application architecture or database workflow. Treat `package.json`, `AGENTS.md`, Prisma configuration, and source code as authoritative.

## Commands

```bash
# Install dependencies; the postinstall hook runs `prisma generate`.
npm install

# Create `.env` with DATABASE_URL, then run locally.
npm run dev

# Quality gates
npm run lint
npm test
npm run build

# Run one test file directly (the npm test script always expands the full suite).
node --env-file-if-exists=.env --experimental-strip-types --test tests/api-runtime.test.ts

# Filter a single test by name in a single file.
node --env-file-if-exists=.env --experimental-strip-types --test --test-name-pattern="graph rejects an unknown mode" tests/api-runtime.test.ts

# Run the production server after a successful build.
npm run start

# Local database operations; all require DATABASE_URL.
npm run db:migrate
npm run db:seed
npm run db:push
npm run db:studio
```

`npm run db:reset` executes `prisma migrate reset`; never use it against shared or production data. For a fresh database, apply migrations and seed published content **before** `npm run build`; static entity routes are derived from published slugs at build time. Production deployments use `npx prisma migrate deploy`, then `npm run db:seed`, then build. There is no separate type-check, coverage, or browser E2E script: `npm run build` performs the project’s Next.js type validation, and tests use Node’s built-in test runner. There is also no Prettier, Husky, `typecheck`, or coverage script in this repo — do not add them speculatively.

Tests live exclusively under `tests/` and use `node:test` + `node:assert/strict`. The npm script globs the full directory, so to run or filter a single file you must bypass npm and call `node --env-file-if-exists=.env --experimental-strip-types --test <file>` directly (examples above). Avoid network or live-database dependencies in unit tests; integration coverage uses fixtures or the documented seed corpus only.

## Architecture

- **Routing and rendering — `src/app/`:** App Router pages render server-side data and route handlers expose the graph and search APIs. Entity detail routes generate static parameters and metadata for published records. `sitemap.ts` and `robots.ts` provide crawler metadata.
- **UI — `src/components/`:** layout, entity-content, graph, search, and SEO components. `KnowledgeGraphExperience` is a client component that starts with server-fetched graph data, then retrieves updated graph data through `/api/graph` with React Query.
- **Domain and data access — `src/lib/`:** `db.ts` constructs a Prisma client using the PostgreSQL adapter; `entities/` owns entity-specific queries; `graph-data.ts` turns published relations into visualization nodes and edges; `search.ts` produces cross-entity search results. API routes remain thin wrappers around helpers in this layer.
- **Content ingestion — `src/data/` and `prisma/`:** `seed-content.ts` defines the typed source corpus. `content-validation.ts` validates it before `prisma/seed.ts` writes idempotent upserts for entities, relations, and field-level verification records.
- **Persistence — `prisma/schema.prisma`:** `Theory` is the central entity, connected to disciplines, fields, scholars, works, concepts, and topics through join tables. `TheoryGenealogy` stores directed theory-to-theory edges. Public reads generally require `status: "published"`; preserve this filtering when adding public data paths.

### Main request flows

```text
PostgreSQL → Prisma (`src/lib/db.ts`) → domain queries (`src/lib/entities/`, graph/search helpers)
  ├─ Server Components in `src/app/`
  └─ GET handlers (`/api/graph`, `/api/search`) → client graph/search components
```

The homepage calls `resolveHomeGraph()` around the `education` genealogy graph. In development, it may show clearly marked local sample data when the database is unavailable or no homepage graph is available; production renders either unavailable or empty states instead. Graph API responses support `genealogy`, `scholars`, and `topics` modes. Preserve this distinction so demo data cannot appear as published content.

SEO metadata is centralized in `src/lib/seo.ts`; route-level metadata helpers supply canonical URLs, Open Graph, and Twitter fields. Reuse them rather than hand-crafting metadata per entity route.

## Project-specific constraints

- Follow the detailed repository conventions in `AGENTS.md`, especially the TypeScript style, Node test conventions, and conventional commit format.
- Use the `@/*` alias for `src/*` imports. Keep database queries in `src/lib/entities/` and route-specific code with its App Router route.
- New or revised scholarly content must be source-verified. Store source URL and type in the content source records; the persisted verification date belongs in `Verification.verifiedAt`. Use primary/authoritative academic sources for substantive claims. Wikidata and general encyclopedias are discovery/cross-checking aids, not sole support.
- Do not replace missing database content with invented values. Database-unavailable paths are designed to render a recoverable unavailable state.
- **`src/data/seed-content.ts` is the single source of truth for academic content.** Do not hard-code theory/scholar/work text in pages or components. All content flows: typed contract → `validateSeedCorpus()` → Prisma idempotent seed → published reads.
- **Public-read invariant:** every public surface (graph, search, detail routes, sitemap, internal links, `generateStaticParams`) only exposes entities with `status: "published"`. When adding a new public entity type or path, add static params, sitemap entries, and SEO metadata in the same change.
- **Build ordering:** static entity routes enumerate published slugs at build time, so locally and in production the order is always `db:migrate` → `db:seed` → `build`. Never build before seeding.
- **Demo data boundary:** the homepage sample graph may render only in development, and only when explicitly marked as demo. Production with an empty or unavailable database must show an unavailable/empty state — never the local sample.
