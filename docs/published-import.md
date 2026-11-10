# Published corpus import

`npm run db:import-published` upserts authored records whose corpus status is `published`. It is the path for an empty database to receive the eight P1 flagship pages that are `published` in the repo. It is not `npm run db:seed`. `scripts/vercel-build.mjs` does not run it.

`prisma/seed.ts` remains the local seed command (`npm run db:seed`). That file still deletes three retired theory-scholar links. Do not run it for this import. Do not run `npm run db:reset` or `prisma migrate reset`.

The importer reads `src/data/seed-content.ts` (including `src/data/corpus/content-batches/`). It upserts by slug. It writes a row only when that row's status is `published` and the slug is outside the FAN-247 archive. A relation is written only when every endpoint is itself published and outside that archive. Draft rows are not imported. Existing rows that are not in the published set are left untouched. A second run updates the same slugs and does not insert duplicates.

Dry-run does not open a database connection and does not write, even if `DATABASE_URL` is present in the environment. Apply reads `DATABASE_URL` from the environment and does not print it. Do not put connection strings in shell history, tickets, or logs.

## Dry-run

```bash
npm run db:import-published -- --dry-run
```

The command prints upsert counts by entity and relation type.

## Apply

Apply is a later, explicit step. It is not part of the Vercel build, and adding this command does not run it against production or preview.

```bash
npm run db:import-published
```

Run it from a trusted machine, with `DATABASE_URL` set in the environment, only when that write is separately authorized. Migrate first with `npm run db:migrate:deploy` if the schema is not already there. This command does not migrate and does not seed.

Publishing these pages is not an AdSense application and does not make the site eligible to apply. Advertising stays off.
