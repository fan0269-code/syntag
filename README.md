# Syrtag

Syrtag is a source-aware knowledge graph for doctoral research navigation. It helps a reader move from a research question to theories, scholars, works, concepts, and topics, then back to the sources behind those pages.

When records are published, the graph is a way to move between those pages. It does not replace a readable summary, a source list, or a verification date. Public routes show a record only when its status is `published`. Draft records, archived records, and the local development demo graph are not published scholarship.

The intended public scope is education and sociology. Other disciplines are not offered as published coverage.

Advertising is off. This repository does not claim that Google AdSense has approved the site, and it does not claim that production is healthy.

`AGENTS.md` is the authority for repository conventions, content citation rules, and release practice. This README is a product and local-setup guide.

## Stack

- Next.js 16 App Router and React
- TypeScript
- PostgreSQL through Prisma 7
- React Query for client graph updates
- Tailwind CSS 4
- Node tests (`node:test`) and Chromium Playwright checks

## Run locally

Copy environment variables into an untracked `.env`. Local database commands need `DATABASE_URL`. Do not commit credentials.

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The authored seed keeps entity records in `draft` or `archived` state. A fresh seed therefore does not create public entity pages. In development, the homepage may show a clearly marked demo graph when no published graph is available. Production must not present that demo as published content.

Do not run `npm run db:reset` against a shared or production database.

## Checks

```bash
npm test
npm run lint
npm run typecheck
npm run content:check
npm run build
```

Static entity routes are derived from published slugs at build time. When a database is part of the check, migrate and seed before building. `npm run test:e2e` runs only after a fresh production build.

## Advertising boundary

No advertising script is loaded. `AdSlot` stays off unless a caller passes `enabled`. The public site does not publish an `ads.txt` publisher line or a `google-adsense-account` meta tag while ads remain off. Privacy must be updated in the same change that ever turns advertising on.

## What this repository does not do

- It does not submit an AdSense application.
- It does not deploy the site. Production hosting, including any origin outage, is an operator task.
- It does not invent a legal entity, contact channel, or scholarly citation. About and Corrections show unpublished operator slots as “Not published.” Source gaps for future flagship pages stay outside the seed corpus in `docs/content/2026-11-07-flagship-source-stubs.md` and must not be treated as articles.
