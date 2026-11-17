# Syrtag URL acceptance matrix — 2026-11-14

Audit pack sha256: `21b7642f350d36758afd2135bdb892997942b5c274218d7dd8a53701c2bee58a` (408 files).

This matrix records the PR branch against an isolated local fixture database. It does not describe `https://syrtag.com` after this change. Production was not imported, seeded, reset, or deployed. Live pages stay on the previous deployment until a separate authorization imports this corpus and redeploys the same SHA.

Runtime evidence for this revision is the local fixture only, `next start` on `http://127.0.0.1:3101`, after `db:import-published` of commit `e31643222e4ef6e9bd69de7ae2754cfed7a95b75`. That import is not seed, not reset, and not a production import. The clean tree was built twice:

- Empty shell, `DATABASE_URL` unset, `FIXTURE_CONTENT_BUILD` unset: `BUILD_ID=8hPhhoT2fjw717k-tvcUa`, `CONTENT_ACCEPTANCE=false`, `entityDetailRouteCount=0`.
- Fixture, `FIXTURE_CONTENT_BUILD=1`: `BUILD_ID=b1el3xZfHuvmXgQBN_F1G`, `CONTENT_ACCEPTANCE=true`, `entityRoutes=15`.

Return packs: `/opt/cursor/artifacts/syrtag-return-e316432/01-logs-environment.zip` through `05-screenshots-c.zip`, with `SHA256SUMS.txt`. The earlier full crawl remains in `/opt/cursor/artifacts/syrtag-runtime-r2/`. The six no-JS screenshots and `nojs-recapture.json` were taken again on `b1el3xZfHuvmXgQBN_F1G`. This file does not say the review gate passed.

Desktop pass: 41 URLs, 0 requests matching `pagead`, `adsbygoogle`, `doubleclick`, `googlesyndication`, or `googleads`, 0 `ins.adsbygoogle` / `.ad-slot` / `[data-ad-slot]` nodes. Mobile nav (390px) shows Search, Theories, Scholars, Works, About. No-JS search, topics, and about still render and show no ad nodes.

## ads.txt investigation

| Surface | This probe | Meaning |
| --- | --- | --- |
| `https://syrtag.com/ads.txt` | HTTP 404, `server: Vercel`, `content-type: text/html`, `x-matched-path: /404` | Public file is the Vercel HTML 404. The repo has no `public/ads.txt`. |
| AdSense dashboard | Not opened | The audit pack says the dashboard entry was not found. This PR does not log in, invent a publisher ID, or add `ads.txt`. |
| Privacy copy | Unchanged boundary | Advertising stays off. An ads.txt line would be added only with a later privacy update and a real account value. |

## HTTP notes, this VM versus the audit environment

| URL | Audit environment 2026-11-14 | This VM, same calendar day |
| --- | --- | --- |
| `http://syrtag.com/` | Pingora 500, empty body | `308` from `server: Vercel` to `https://syrtag.com/` |
| `https://www.syrtag.com/` | `308` to apex | `308` to `https://syrtag.com/` |
| Five old slugs | 404 | Still 404 on production headers and on the local preview |

The HTTP difference is the path this VM took. It is not a production code change and it is not evidence that the earlier Pingora response was an origin fault.

## P0 and P1 completion

| Batch | URLs | In this PR |
| --- | --- | --- |
| S-P0 | 20 | Done in code and local runtime |
| S-THEORY | 5 | Done in the published corpus text |
| S-ENTITY | 10 | Done in the published corpus text |
| VisaLang batches | Not this repository | Not started here. This repo is Syrtag only. |

Unfinished by design: production import, production deploy, AdSense application, EPAA `/article/view/771` reread, full-book readings, 1974 and 1984 publisher title pages.

## Per-URL rows

| URL | Original heading / quote | Actual change | Source locator | Structure | Ads / interaction | Result |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | h1 Published theories, scholars, and works; “Open one for its summary and sources.” How to read Syrtag compared concepts and topics. | Catalog lead now routes by question (classroom identity, participation, life trajectory, policy agenda) using the five existing theories. Cards no longer use depth codes or publisher-only work blurbs. Empty-type links leave the primary nav. | In-site state. Audit snapshots under `raw/` and `extracted/`. No new external fact. | Canonical `/`. Robots index. Sitemap keeps `/`. Nav: Theories, Scholars, Works, About. Search stays an action. | `adScreen=navigation`. Desktop screenshot `screenshots/home.png`. 0 ad nodes. | Local 200. Live site not updated. |
| `/topics` | h2 No published topics yet. | Removed from nav and sitemap. `noindex, nofollow`. Empty state links to the three published indexes. Route kept. | In-site empty index. | Canonical `/topics`. Not in sitemap. | `adScreen=empty-type`. Screenshot `screenshots/topics.png`. | Local 200 empty. |
| `/theories` | h1 Theories; inventory sentence naming five titles. | Inventory sentence kept. Added a choice guide that points at the five published theory pages and says the routes are editorial, not mutual bans. | In-site published set. | Canonical `/theories`. In sitemap. | `adScreen=navigation`. Screenshot `screenshots/theories.png`. | Local 200. |
| `/scholars` | h1 Scholars; five-name inventory. | Same inventory sentence plus an attribution guide (review coauthor, 1998/1991 author, cohort author, 1991 coauthor, agenda-book author). | In-site published set. | Canonical `/scholars`. In sitemap. | `adScreen=navigation`. | Local 200. |
| `/works` | h1 Works; five-title inventory. Publisher used as the card line. | Choice guide is version and legal reading. Cards use `card_summary`, not the publisher string. | In-site published set. | Canonical `/works`. In sitemap. | `adScreen=navigation`. | Local 200. |
| `/concepts` | h2 No published concepts yet. | Same contraction as topics. | In-site empty index. | noindex. Not in sitemap. | `adScreen=empty-type`. | Local 200 empty. |
| `/disciplines` | h2 No published disciplines yet. | Same contraction as topics. | In-site empty index. | noindex. Not in sitemap. | `adScreen=empty-type`. | Local 200 empty. |
| `/fields` | h2 No published fields yet. | Same contraction as topics. | In-site empty index. | noindex. Not in sitemap. | `adScreen=empty-type`. | Local 200 empty. |
| `/about` | “No entity pages are published”; “While the public catalog is empty”; “The entity catalog is empty until records are published.” | Those sentences deleted. Page states the loaded counts: 5 theories, 5 scholars, 5 works, and zeros for the four empty types. Operator slots stay “Not published.” No email. | Counts from the local published query. Not a Google threshold. | Canonical `/about`. Still in sitemap. `adScreen=policy`. | Screenshot `screenshots/about.png`. | Local 200. Live about was not rewritten. |
| `/pricing` | “An empty catalog is still free to read.” | Removed from nav and sitemap. Deleted the empty-catalog sentence. Pro and Scholar stay not purchasable. No form. Robots set to noindex, follow as an editorial contraction, not as a claim that Google requires every pricing URL to be noindex. | In-site access state. | Direct URL remains. Not in sitemap. | `adScreen=pricing`. | Local 200. |
| `/search` | h1 Find a published record; searched topics, concepts, and fields; zero results linked `/topics`. | noindex on every query state. Canonical stays `/search`. Zero results and errors link theories, scholars, works. Query text is not turned into an article. | In-site search behavior. | Not in sitemap. | States exercised: empty, `q=`, spaces, `identity`, `zzzz-no-such-record`, script-like query. Mobile and no-JS included. 0 ad requests. | Local 200 for each state. `identity` returned published records. |
| `/editorial-policy` | h1 Editorial policy. “A source list on a future page…” | “Future page” changed to “published page.” No new committee, email, or disclaimer page. | In-site policy. | Canonical unchanged. In sitemap. | `adScreen=policy`. | Local 200. |
| `/privacy` | h1 Privacy. Advertising not enabled. No ads.txt while ads are off. | No current-status catalog sentence to correct. Ads.txt sentence kept. | In-site policy plus the public 404 above. | In sitemap. | `adScreen=policy`. | Local 200. |
| `/terms` | h1 Terms of use. | No empty-catalog sentence. Existing not-advice wording kept. | In-site policy. | In sitemap. | `adScreen=policy`. | Local 200. |
| `/corrections` | h1 Contact and corrections. No monitored channel. | No empty-catalog sentence. No email or form added. | In-site policy. | In sitemap. | `adScreen=policy`. | Local 200. |
| `/scholars/john-w-kingdon` | h1 That entry is not available. | Left unpublished. Draft slug stays draft. | In-site publication boundary. | 404. noindex. Not in sitemap. | `adScreen=error`. | Local 404. Production header still 404. |
| `/scholars/jean-lave` | Same 404 heading. | Left archived. Flagship slug is `jean-lave-flagship`. | In-site publication boundary. | 404. | No ad nodes. | Local 404. |
| `/works/cop-wenger-1998` | Same 404 heading. | Left archived. Published slug is `wenger-1998-communities-of-practice`. | In-site publication boundary. | 404. | No ad nodes. | Local 404. |
| `/works/lave-wenger-1991-situated-learning` | Same 404 heading. | Left archived. Published slug is `lave-and-wenger-1991-situated-learning`. | In-site publication boundary. | 404. | No ad nodes. | Local 404. |
| `/works/elder-1998-life-course` | Same 404 heading. | Left archived. | In-site publication boundary. | 404. | No ad nodes. | Local 404. |
| `/theories/communities-of-practice-1998` | Quick Summary led with the truncated Cambridge crawl. “When NOT” said the newcomer question belongs on 1991. Genealogy heading said relations were temporarily unavailable. | Quick Summary is now the reader question and the visible 1998 unit, with the truncation stated once. The 1991 suggestion is an editorial reading order, not a ban. Numbered genealogy section is omitted while the public relation list is empty. | `SY-1998` https://doi.org/10.1017/CBO9780511803932 Cambridge Aspire visible description, package `sources/cb790222c25f7772.txt`. `SY-1991` for the contrast only. Not a full book. | Indexable entity. In sitemap. | `adScreen=entity` and global ads off, so no slot. | Local 200. Screenshot `screenshots/theories_communities-of-practice-1998.png`. |
| `/theories/life-course-perspective` | Quick Summary used handbook and Pallas chapter detail. Origins carried the edition log. | Reader question first. Routledge cohort facts kept (1974, 167 people, 1920–1921, Oakland, into the 1960s). Pallas limited to the public abstract (age, aging, historical time; title Educational Transitions, Trajectories, and Pathways). Chapter models not added. First publisher not named. Edition choice sent to the work page. | `SY-Elder` Routledge description, `sources/7067d17c8b8067be.txt`. `SY-UNC` books page, `sources/917ef5e39e5b4253.txt`. Pallas abstract note `sources/Pallas_Abstract_本轮核验.md`. Springer body not read. | Indexable. In sitemap. | No ad slot. | Local 200. |
| `/theories/multiple-streams-education-policy` | Opening used path 771 as a current education result and mentioned path 757 in the lead. | Pearson catalog question and chapter titles (problems, policy primeval soup, political stream, policy window) lead. 771 stays the previously recorded citation. This revision did not reopen it, so no new education finding. 757 is named only as a non-source. | `SY-Kingdon` Pearson overview and contents, `sources/c2aad5df95a2eb22.txt` lines 106–126. EPAA 771 not reread. | Indexable. In sitemap. | No ad slot. | Local 200. |
| `/theories/situated-learning-legitimate-peripheral-participation` | “this round does not” / second flagship page. 1998 treated as the other exclusive page. | LPP and fuller participation kept from the visible 1991 description. Truncation stated once. 1998 is a different focus, not a ban. Operational “this round” sentence removed. | `SY-1991` `sources/23e8d46a49d6d97b.txt`. Not a full book. Publisher job labels are not a CV. | Indexable. In sitemap. | No ad slot. | Local 200. |
| `/theories/teacher-professional-identity` | Quick Summary restated the four features without page pins, and the ledger note preceded it. | Summary comes before the short source note. Four features tied to journal pages 122–123 §6.1 of the legal OA PDF. Explicitly not a scale and not a causal experiment. | `SY-2004全文` `sources/38f1d09bc6ba2329.txt` lines 908–981. `SY-2004书目` Leiden handle. | Indexable. In sitemap. | No ad slot. | Local 200. |
| `/scholars/douwe-beijaard` | Overview opened with the portal path and ORCID employment. | Opens with why to read the 2004 review and the coauthor limit. TU/e “Full Professor emeritus” and ORCID employment from 2007 stay two records. | `SY-Beijaard身份` `sources/3b061394330bdaf8.txt` line “Full Professor emeritus”. `SY-2004书目`. | Published slug unchanged. | No ad slot. | Local 200. |
| `/scholars/etienne-wenger-flagship` | “Do not merge … with a separate Etienne Wenger-Trayner author record.” | Database non-merge is now “not checked,” not a claim that the surnames are different people. No employer added. 1991 and 1998 author roles kept. | `SY-1998` and `SY-1991` Cambridge/Crossref author records. No CV source. | Published slug unchanged. | No ad slot. | Local 200. |
| `/scholars/glen-h-elder-jr-flagship` | Representative work said the 1974 University of Chicago Press imprint was a bibliographic layer. | Chicago imprint removed. UNC title kept: Howard W. Odum Distinguished Research Professor and Fellow, Carolina Population Center. Reader is pointed at the cohort study. | `SY-Elder身份` `sources/998c7fbcea22949c.html` site description and biography. `SY-UNC`. `SY-Elder` does not prove the 1974 publisher. | Published slug unchanged. | No ad slot. | Local 200. |
| `/scholars/jean-lave-flagship` | Overview framed two Berkeley pages as a current title conflict and repeated an empty ORCID. | 2011 lecture wording and the current directory are different dates, not a present-tense dispute. 1991 coauthorship kept. No degree year. | `SY-Lave身份` `sources/279f1ce2e1320e43.txt` Professor Emeritus, Department: Education. 2011 lecture wording retained from the prior opened page. `SY-1991`. | Published slug unchanged. Old `/scholars/jean-lave` stays 404. | No ad slot. | Local 200. |
| `/scholars/john-w-kingdon-flagship` | Overview led with curl HTTP 200 / WebFetch / HTTP 403. | Reader purpose first: book author and Michigan political-science emeritus. Press-page fellowships kept once. Faculty fetch log left in the source register. No full biography. Education results not expanded. | `SY-Kingdon身份` `sources/0d03df92cfb44a1f.html` “Professor Emeritus of Political Science, University of Michigan.” `SY-Kingdon` Pearson catalog. | Published slug unchanged. Old `/scholars/john-w-kingdon` stays 404. | No ad slot. | Local 200. |
| `/works/kingdon-agendas-alternatives-and-public-policies` | h2 Central Argument was an edition check. Overview included curl/WebFetch. | Heading is “Version and catalog scope.” Layers 1984, 1995, 2011, 2013-10-03 / copyright 2014, ISBN 9781292053875 kept. First publisher unresolved (Longman printed on the bibliography page; Little, Brown reviews not opened). No DOI invented. | `SY-Kingdon` Pearson contents, `sources/c2aad5df95a2eb22.txt`. LSA bibliography remains the 1984/1995/2011 layer. | Published slug unchanged. | No ad slot. | Local 200. Screenshot `screenshots/works_kingdon-agendas-alternatives-and-public-policies.png`. |
| `/works/elder-children-of-the-great-depression` | “The approved batch bibliography names University of Chicago Press.” | That sentence deleted. Publisher field no longer names Chicago. 1974, 1999 UNC/Westview, and 2018-10-08 DOI 10.4324/9780429501739 kept apart. Reading brief says the cohort cannot be generalized from the catalog pages. | `SY-Elder` Routledge description. `SY-UNC` 1999 record marked published 1974. Neither is a 1974 title page. | Published slug unchanged. | No ad slot. | Local 200. |
| `/works/wenger-1998-communities-of-practice` | Core question and contribution repeated the theory page. | Page task is which book and where the visible description stops. Chapter vocabulary not invented. Card summary is not the publisher name. | `SY-1998` visible description. `SY-1991` only to keep the books apart. | Published slug unchanged. Old `cop-wenger-1998` stays 404. | No ad slot. | Local 200. |
| `/works/beijaard-meijer-verloop-2004-reconsidering` | Central Argument restated all four features in full. | Work page keeps the three study types and names the four features. The page-located gloss stays on the theory page (122–123 §6.1). Legal OA path remains the Leiden handle. Not an experiment. | `SY-2004书目` Leiden handle 1887/11190, pages 107–128. `SY-2004全文` PDF §6.1. | Published slug unchanged. | No ad slot. | Local 200. |
| `/works/lave-and-wenger-1991-situated-learning` | Central Argument repeated the theory-page description. | Page leads with the two-author check and the truncated description. One truncation note. Not the 1998 book. | `SY-1991` visible description and Crossref authors. | Published slug unchanged. Old `lave-wenger-1991-situated-learning` stays 404. | No ad slot. | Local 200. |

## Tests run on this branch

| Check | Result |
| --- | --- |
| `npm test` | 203 pass, 0 fail, 3 skipped (database integration skipped; no `.env` during the suite) |
| `npm run content:check` | Passed |
| `npm run typecheck` | Passed after `next typegen` |
| `npm run lint` | 0 errors; 3 pre-existing warnings in `scripts/generate-fan121-work-concept-pack.mjs` |
| `npm run build` with the local fixture `DATABASE_URL` | Passed, including build-output smoke. Sitemap has 9 static URLs plus 15 entity URLs. |
| Playwright runtime above | 0 ad requests, 5 old slugs 404 |

`npm run test:e2e` against the local fixture server: 38 passed, 0 failed. The old name-exclusion assertions were rewritten, not deleted. They forbid the exact hrefs `/scholars/john-w-kingdon` and `/scholars/jean-lave`, the exact sitemap loc for those slugs, and draft-only sentences. They require the flagship hrefs, titles, and source links. Search, sitemap, and detail assertions all ran.

`/pricing` is `noindex, follow`. It stays HTTP 200, not purchasable, and without ads. This is an editorial contraction for a non-purchasable page. It is not a claim that Google requires every pricing URL to be noindex.
