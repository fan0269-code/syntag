# Syrtag site audit — 2026-11-07

> Branch base: `cursor/ads-off-trust-pages-4ca5` at `955d39c` (open PR #13, not merged).
> This audit does not authorize a merge to `main`, a production deploy, an advertising application, or a change to publication status.
> Live origin: not fixed here.

## How this was checked

- Public routes, layout, SEO helpers, seed status, and the ads-off disclosure were read in the repository.
- Authored corpus status was counted from `seedCorpus` on this branch: **published 0, draft 7, archived 74** across disciplines (2 archived), fields (6 archived), theories (12 archived), scholars (7 archived / 3 draft), works (19 archived), topics (4 archived / 4 draft), and concepts (24 archived).
- `FAN_247_ARCHIVED_PAGE_COUNT` is 58. U3 archives one further work and 15 concepts. The 74 figure is the corpus count after both gates, not a live-database count. No production database was queried.
- Live probe during this audit (UTC, 2026-11-07): `curl -L https://syrtag.com/` and `https://www.syrtag.com/` both returned **HTTP 521**, body `error code: 521` (16 bytes), about 0.15s. Cloudflare answered. The origin was not diagnosed and was not changed.
- The standalone file `projects/Syrtag/SEO_AEO_brief_2026-11-07.md` was not in the workspace or the uploads folder. Title, description, and information-architecture changes follow the brief priorities that were stated with the task: honest Home and About copy for an empty catalog, education and sociology depth only as source-backed templates after human review, no invented published pages, no AdSense-readiness claim, and 521 plus published ≈ 0 left in place.
- The 立项卡's "AdSense first" goal is **not** the outcome of this change. The execution brief and the monetization checklist both say the site cannot be submitted. This audit agrees.

## What already holds

- Advertising components default to off. `public/ads.txt` is absent. The root layout does not emit `google-adsense-account`. Privacy says advertising technology is not enabled and that those signals are not published while ads stay off.
- Public entity queries, static params, and the sitemap entity loop filter on `status: "published"`.
- The sample graph is allowed only in development, and the homepage labels it as demo data.
- Trust pages exist: About, Privacy, Terms, Editorial policy, Contact and corrections. Corrections does not offer a form or a mailto link.
- Empty indexes already say that an empty list is a publication-status fact.

## Problem inventory

### P0 — blocks a real public catalog or a trustworthy live site

| ID | Area | Problem | This change |
| --- | --- | --- | --- |
| P0-1 | Reachability | `https://syrtag.com` and `www` return HTTP 521. Visitors cannot see any of the pages below. | Not fixed. Origin, Cloudflare, and host access stay with the operator. |
| P0-2 | Content | The authored corpus has **zero** published entities (0 / 7 draft / 74 archived). A restored origin would still show an empty catalog. | Not "fixed" by un-archiving or by writing new scholarly pages. Flagship and deep-topic rows stay unpublished templates in `docs/content/2026-11-07-flagship-source-stubs.md`. |
| P0-3 | Trust / advertising | No monitored operator identity or contact channel is published. That is correct until the operator supplies real values. Combined with P0-1 and P0-2, the site is not in a state to describe as ready for an advertising program. | Identity slots stay empty. Copy no longer prints `TODO_OWNER_*` tokens. No ads signal was added. |

### P1 — misleads a reader, or breaks a core path, in the code that can ship

| ID | Area | Problem | Disposition |
| --- | --- | --- | --- |
| P1-1 | SEO | `createSeoDescription` appended a second keyword sentence ("Explore this {type} through key ideas…") and, when that was still short, "Designed for rigorous research planning." Supplied descriptions on trust and index pages were rewritten the same way. | Fixed. A real summary is used as written. Short copy is not padded. Descriptions are capped at 160 characters. |
| P1-2 | SEO / content | The homepage title and description spoke as if a research-theory graph were the page, and did not say the catalog can be empty. | Fixed. Title and description name education and sociology, published-only pages, a catalog that can be empty, and advertising off. |
| P1-3 | Content / IA | About explained the boundary, but the lede did not lead with the empty catalog, and the page printed `TODO_OWNER_*` and `TODO_SOURCE` into the HTML. | Fixed. Lede states the empty corpus. Slots say "Not published." A "Where to go next" list links the real indexes. |
| P1-4 | Interaction | The empty and unavailable homepage had no search box. Search no-result recovery linked to `/#graph`, which does not exist in those states. With no database, search rendered two H1s: “Results for …” and “Search is temporarily unavailable.” Error and not-found copy said “Return to the knowledge graph.” | Fixed. Empty and unavailable home include search and catalog links. Recovery links go to the homepage or a catalog. An unavailable search has one H1. |
| P1-5 | IA / responsive | Primary navigation omitted Disciplines and Fields (they existed only in the footer). Seven text links plus a long Search control collided between the old 768px collapse and roughly 1100px. | Fixed. Both catalogs are in the header. The menu button takes over at 1100px. The visible search label is "Search"; the accessible name remains "Search Syrtag". Escape closes the menu. |
| P1-6 | Content | Pricing said the free plan includes every public entity page and that all entity detail pages remain accessible. That overclaims a catalog of zero published entities. | Fixed. Free means published pages and trust pages. Pro and Scholar stay "not available" and not for sale. |
| P1-7 | SEO | Index meta descriptions were generic "browse the graph" lines and then received the keyword suffix. | Fixed. Each index description is one published-only sentence for education and sociology. Titles stay the catalog name. |
| P1-8 | Visual | Index card grids were capped by the 720px article column, so the multi-column rules never had room. Trust-page H1s were capped at 18ch, which wraps "Contact and corrections" too early. | Fixed. Indexes use the page container; the intro stays at 68ch. Static H1s allow 22ch. |
| P1-9 | Accessibility | Retry and one search-button rule used a 36px height, under the 44px control token. | Fixed. Those controls use `--control-height`. |

### P2 — backlog, not done here

| ID | Area | Problem | Why it waits |
| --- | --- | --- | --- |
| P2-1 | SEO | Theory, scholar, work, and topic title helpers still add a repeated suffix such as "Theoretical Framework Guide". | No published entity currently uses them. Changing the pattern is safe only with a fixture check, and it is not the Home/About priority. |
| P2-2 | SEO | Open Graph images still use a dark card while the site is warm paper. The words on the card now match the site scope. | Visual only. No live page to compare while the origin is down. |
| P2-3 | Search | Discipline records are not a search group. Fields are. | A query change needs ranking tests. The header now links `/disciplines`. |
| P2-4 | IA | Framework Builder is a noindex placeholder and is absent from the header. | Keep it planned. Do not promote it. |
| P2-5 | Content | Four topic records and three scholar records are draft. Archived pages still hold prior prose in the seed. | Human review and sources first. Do not un-archive to increase page count. |
| P2-6 | Trust | About and corrections cannot name an operator or a monitored address. | The operator has to supply the facts. This change must not invent them. |
| P2-7 | Ops | `@supabase/supabase-js` is a dependency with no runtime import in `src/` or `prisma/`. | Unused-dependency cleanup is separate from this audit. |
| P2-8 | Measurement | No new traffic, ranking, or Core Web Vitals numbers were collected. | The origin returns 521, so those figures would be invented. |
| P2-9 | Product | Pro and Scholar remain named plans with no purchase path. | Honest, and slightly noisy. Removing the names is a product decision. |

## Follow-on feature planning

Do these only as their own reviewed changes:

1. Operator restores origin reachability and re-checks `/`, `/about`, `/privacy`, and that `/ads.txt` stays absent.
2. Operator fills the real legal name, role, jurisdiction, and a monitored contact channel, then removes the "Not published" lines those facts replace.
3. One education or sociology deep topic, then one theory, scholar, and work, using the stub template. Each needs sources, a verification date, and human review before `published`.
4. Only after a published catalog exists and the privacy page is rewritten in the same change should anyone discuss advertising tags. This audit does not start that work.

## What this round changed

- Homepage, About, corrections, pricing, search, not-found, and error copy.
- Index descriptions and the width of catalog indexes.
- Header information architecture and the 1100px menu collapse.
- SEO description helper so supplied summaries are not keyword-padded.
- JSON-LD collection name and the Open Graph fallback label, so they match the public title.
- Skills: `.cursor/skills/ui-design`, `.cursor/skills/content-update`, `.cursor/skills/seo-aeo`.
- Deep-topic template appended to the existing unpublished stub file.

## What this round refused

- Merging to `main`.
- Repairing HTTP 521.
- Writing or un-archiving scholarly entities.
- Filling `TODO_OWNER_*` with a guessed identity.
- Restoring `ads.txt`, an adsense meta tag, or any sentence that the site is ready to apply for advertising.
