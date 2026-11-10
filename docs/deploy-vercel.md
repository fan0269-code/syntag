# Deploy Syrtag on Vercel

Owner 林文 authorized this cutover on 2026-11-08. The live site was a Cloudflare HTTP 521 because the self-hosted origin no longer accepts SSH, and pushes to `main` were still trying that host.

Merging the pull request stops that SSH job. It does not create a Vercel project, a database, or DNS records, and it does not bring `https://syrtag.com` back by itself. Those clicks stay with 林文. This repository does not spend money and does not submit AdSense.

## What the app expects

Syrtag is a Next.js 16 App Router application. Prisma 7 talks to PostgreSQL through `@prisma/adapter-pg` (`src/lib/db.ts`). There is no `output: "export"` and no `output: "standalone"`; Vercel builds the Node server itself.

| Piece | Behavior |
| --- | --- |
| Node | `22.x` (`.node-version` and `package.json` `engines`) |
| Install | `postinstall` runs `prisma generate` |
| Vercel build | `npm run vercel-build` → `scripts/vercel-build.mjs` then `next build` |
| Generate | Always, during that build, so the client exists even if install skips scripts |
| Migrations | Not on each request. Optional during the Production build only when `PRISMA_MIGRATE_ON_BUILD=1` |
| Seed | The Vercel build does not run `npm run db:seed` and does not run `db:reset` |
| Pool | On Vercel (`VERCEL=1`) the runtime pool is `max: 1` |
| `www` | `vercel.json` permanently redirects `www.syrtag.com` to `https://syrtag.com` |

`npm run db:migrate` is `prisma migrate dev`. Use it only for local schema work. Production applies the migrations already in `prisma/migrations` with `npm run db:migrate:deploy` (`prisma migrate deploy`).

Static entity routes call `generateStaticParams` at build time. A missing database, or a migrated database with no `published` rows, yields an empty slug list and the honest empty catalog. That is a successful build. Do not seed production to force entity pages into existence.

The Open Graph image route (`src/app/api/og/route.tsx`) stays on the Edge runtime and does not use Prisma. Pages and the graph/search APIs stay on the Node runtime.

## Environment variables

Set these in the Vercel project (Production, and Preview only where noted). Do not commit values. Placeholders live in `.env.example`.

| Variable | Where | Required | What the code does with it |
| --- | --- | --- | --- |
| `DATABASE_URL` | Production and Preview | Yes, before data-backed pages work | Pooled Postgres URL. `src/lib/db.ts` and `prisma/seed.ts` read it. The serverless pool uses one connection. |
| `DIRECT_URL` | Production, and any environment that runs migrations | Yes when `DATABASE_URL` is pooled | Direct Postgres URL. `prisma.config.ts` prefers it for `prisma migrate deploy`. A transaction-mode pooler (Neon `-pooler`, PgBouncer) cannot apply migrations. |
| `NEXT_PUBLIC_SITE_URL` | Production | Set to `https://syrtag.com` | Not read by application code today. Canonical URLs and `metadataBase` are fixed to `https://syrtag.com` in `src/lib/seo.ts` and `src/app/layout.tsx`. Set the variable so the project records that origin. Do not set a preview URL. |
| `PRISMA_MIGRATE_ON_BUILD` | Production only | Optional | `1` runs `prisma migrate deploy` inside `scripts/vercel-build.mjs` before `next build`. Unset or `0` skips it. Never set it on Preview if Preview shares the production database. |
| `VERCEL` | Set by Vercel | Automatic | Selects the one-connection pool. Do not set this locally. |

Unused names that must stay unset: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Nothing under `src/` or `prisma/` reads them.

`NODE_ENV` is set by Vercel. Production never renders the development demo graph.

If the host offers one URL that is already a direct session connection, set both `DATABASE_URL` and `DIRECT_URL` to that URL. Prefer a pooled runtime URL plus a separate direct URL once traffic is real, so serverless instances do not exhaust the database connection limit.

## Database, before the domain moves

Pick one managed Postgres and create it in that vendor's console. This change does not provision it.

- Neon (the vendor behind current Vercel Postgres), or
- another hosted Postgres you already pay for.

Choose the region closest to the Vercel function region you select in Project Settings. Copy the connection strings from that console into Vercel. Do not paste them into git, issues, or chat.

Then apply migrations once, from a trusted machine, before assigning `syrtag.com`:

```bash
# DIRECT_URL and DATABASE_URL point at the new database.
# DIRECT_URL is the direct connection. Do not print either value.
npm run db:migrate:deploy
```

`prisma migrate deploy` only applies existing migration files. It does not seed.

Leave `npm run db:seed` for a later, explicit content decision. Do not run it to make the eight 2026-11-10 flagship pages appear. `prisma/seed.ts` upserts the authored corpus, including those eight `published` rows, and it also deletes three retired theory-scholar links. It is not a full wipe, and it is still not an approved import path. This cutover does not authorize publishing or seeding. An empty production `published` catalog stays empty until a separate import is authorized. That empty public catalog remains a content blocker for AdSense. Do not submit an AdSense application from this work.

Never run `npm run db:reset` (`prisma migrate reset`) against this database or any other shared database.

After the first successful `migrate deploy`, you may set `PRISMA_MIGRATE_ON_BUILD=1` on Production so later migrations apply during the Vercel build. Until that flag is on, run `npm run db:migrate:deploy` yourself before expecting a new migration to be live. Migrations are forward-only. A bad migration is fixed with a new migration, not a reset.

## Cutover clicks

1. **Import the repo.** Vercel → Add New → Project → import `fan0269-code/syntag`. Framework preset: Next.js. Root directory: repository root. Build command: `npm run vercel-build` (also set in `vercel.json`). Install command: the default `npm install`. Node: 22.x. Production branch: `main`.
2. **Set the environment variables** in that project before the first production deployment you care about. At minimum set `DATABASE_URL`, `DIRECT_URL`, and `NEXT_PUBLIC_SITE_URL=https://syrtag.com` on Production.
3. **Deploy once** so the project has a `*.vercel.app` URL. Confirm the build log contains `prisma generate` and does not contain `db:seed` or `migrate reset`.
4. **Migrate** with `npm run db:migrate:deploy` against `DIRECT_URL`, or redeploy Production after setting `PRISMA_MIGRATE_ON_BUILD=1`.
5. **Check the Vercel URL** before touching DNS. `/` should be HTTP 200. With no database it should say the data is temporarily unavailable. With a migrated database and zero published rows it should say the knowledge graph is not published yet. It must not show the development demo graph. `/privacy` should say advertising is off. `/ads.txt` should be 404. View source should not contain `adsbygoogle`, `ca-pub-`, or `google-adsense-account`.
6. **Add domains** in Vercel → Project → Settings → Domains: `syrtag.com` as the production domain, and `www.syrtag.com` redirected to the apex. Copy the DNS records Vercel shows. Do not reuse an IP address from an old note.
7. **Cloudflare DNS.** The current 521 means Cloudflare is proxying to an origin that does not answer. Remove the A/AAAA records that target that dead host. Create the records Vercel displayed. If Vercel asks for a CNAME, Cloudflare can flatten it at the apex. SSL/TLS mode: Full (strict) after Vercel shows a certificate for the domain. If the certificate stalls, set the new records to DNS only until it issues, then turn the proxy back on with Full (strict). Do not leave the orange cloud pointed at the old server.
8. **Verify the public host.**
   - `https://syrtag.com/` returns 200, not 521.
   - `https://www.syrtag.com/` returns a permanent redirect to `https://syrtag.com/`.
   - `/sitemap.xml` and `/robots.txt` return 200.
   - `/api/graph` without `discipline` returns 400. With the database unset it returns 503 for a valid query. It must not return sample nodes as if they were published.
   - Homepage and About still describe an empty catalog. Advertising slots stay unrendered (`AdSlot` defaults to `enabled = false`).

## Rollback

In Vercel, open the previous successful deployment and choose Promote. That restores the last application build. It does not undo a database migration.

The files `ops/deploy-production.sh` and `ops/rollback-production.sh` are the old systemd path. They exit immediately unless `SYRTAG_ALLOW_SELF_HOST_DEPLOY=1`. GitHub Actions no longer calls them. Do not point `syrtag.com` back at the old host to get out of a bad Vercel deploy; promote the previous Vercel deployment instead.

## Advertising

Advertising stays off. Do not add `public/ads.txt`, a `google-adsense-account` meta tag, or an AdSense script. Privacy, terms, and the reading guide already say ads are off. Turning ads on is a separate change that updates those pages in the same commit, and only after the owner asks. An empty published catalog is still a reason not to apply.
