# English home and privacy-minimised measurement boundary

> Date: 2026-07-17
> Status: Technical preparation complete; external measurement not configured

## Scope

The English homepage gives researchers two explicit entrances: start with a research question or explore the theory graph. Shared navigation, footer landmarks, and keyboard access use English labels.

## Event definitions only

No event is emitted or collected by this implementation. The following names are reserved for a separately authorised, privacy-reviewed measurement implementation:

- `home_research_question_selected`
- `home_graph_exploration_selected`
- `topic_theory_opened`
- `theory_work_opened`
- `graph_node_opened`
- `search_submitted`

## Data that must not be collected

Future events must not include raw research questions, raw site-search terms, project titles, notes, AI prompts, email addresses, names, account or session IDs, IP addresses, User-Agent strings, fingerprints, full referrers, URL queries, or draft/archived slugs.

If `search_submitted` is authorised later, its payload may contain only a query-length bucket and a result-count bucket. It must not contain the query text.

## Current service boundary

- Syrtag does not use third-party on-site behavioural analytics.
- Google Search Console is an external aggregate search-performance tool, not a collector of on-site research questions.
- Advertising technology, email services, and tracking cookies are not enabled.
- Search Console property confirmation, `/sitemap.xml` submission, and the 28-day baseline require a human with domain access. Credentials must not be recorded here.

Technical preparation complete; Search Console setup and 28-day baseline pending human external action.
