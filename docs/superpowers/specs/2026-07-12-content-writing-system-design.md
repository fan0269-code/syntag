# Syrtag Content Writing System — Design

## Scope and outcome

This delivery turns the initial metadata-only seed into an English-first, source-traceable content system for Syrtag. It covers typed JSON content templates, idempotent Prisma seeding, relation-aware content queries, and validation. Existing uncommitted application changes remain outside scope.

The primary corpus is the twelve theories in the product document, with the stated D3/D2/D1 depth distribution. To preserve every relationship defined in Chapter 10, referenced theories that are outside that twelve-theory list are seeded as supporting graph entities. Supporting entities carry non-empty English content and source metadata; they are not represented as a substitute for the twelve primary, depth-scoped pages.

## Alternatives considered

1. Seed only the twelve primary theories and describe external relationships in prose. This keeps the database small but fails to represent every prescribed genealogy edge.
2. Add empty graph-only external nodes. This keeps the graph complete but violates the requirement that seeded entities are not empty.
3. **Selected: seed complete primary entities and concise, sourced supporting nodes.** This preserves the Chapter 9 primary corpus and the Chapter 10 graph while maintaining usable entity data.

## Data model and content format

`src/data/templates/` defines four TypeScript contracts and examples:

- Theory content has the required explanatory, genealogy, fit, conversion, methods, chapter, writing, sources, and verification blocks. Depth validation determines which extended blocks are required for D1, D2, and D3.
- Scholar, work, and topic content each use a dedicated structure rather than untyped ad hoc JSON.
- All copy is English. Facts that need external support are attached to source objects; editorial interpretation is explicitly marked L2 or L3.

Each theory is stored as `{ en: TheoryContent }`. Seed data is organized by entity plus relation collections, then persisted through `upsert` and composite-key upserts so repeated seeding is safe.

## Source and verification policy

- L1 covers stable bibliographic and biographical facts only, backed by a DOI, publisher, university, library, or equivalent authoritative URL.
- L2 covers editorial explanations, comparative fit reasoning, and application scenarios.
- L3 covers proposed dissertation structures, operationalization prompts, and adviser-response guidance.
- No DOI, publisher detail, URL, price, policy fact, or other precise claim is fabricated. When a source cannot support a claim, the seed uses L2/L3 wording or omits it.

## Query layer

`src/lib/content.ts` provides:

- `getContentBlock(entityType, entitySlug, blockName, lang)` for a single localized JSON block.
- `getContentBlocks(entityType, entitySlug, lang)` for display-ready blocks.
- `getTheoryWithRelations(slug)` for a theory, linked scholars, works, concepts, topics, and incoming/outgoing genealogy edges.

The functions use the existing Prisma client and throw a clear not-found error rather than returning malformed data.

## Validation and acceptance criteria

Automated checks validate that:

1. each theory meets the block set required by its depth;
2. every genealogy edge has a non-empty English description;
3. references point to seeded entities and relation tables contain expected records;
4. L1 verification records contain a non-empty traceable source;
5. three representative theories meet the five-quality-standard structure.

The final technical verification runs the TypeScript checks available in the repository, the relevant test suite, and a seed execution against a configured PostgreSQL database. If no database connection is available, static seed validation still runs and the database insertion result is reported as pending rather than claimed.

## Delivery order

1. Add templates and content validation utilities.
2. Add sourced seed metadata, primary and supporting graph entities, concepts, relations, and verification records.
3. Add content retrieval functions and tests.
4. Run static checks and, if `DATABASE_URL` is available, execute the seed against PostgreSQL.

## Non-goals

- No UI redesign, route changes, or database schema expansion unrelated to content seeding.
- No Chinese content in this Phase 1 corpus.
- No pirated acquisition links; work records point only to lawful publisher, library, author, or institutional access paths.
