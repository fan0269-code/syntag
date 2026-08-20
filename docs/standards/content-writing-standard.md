# Content Writing Standard

**Status:** Active  
**Applies from:** 2026-08-02  
**Scope:** Theory, Topic, scholar, work, concept, discipline, field, and genealogy content in Syrtag

## 1. Purpose

Syrtag helps researchers understand theories, compare conceptual lenses, inspect intellectual relationships, and make bounded research-design choices. Content must therefore be useful enough to guide inquiry and precise enough that a reader can distinguish:

- what a source explicitly supports;
- what the editorial team has synthesized;
- what is conditional research guidance;
- what still requires human review.

This standard governs research, drafting, review, and readiness for corpus implementation. It does not grant publication approval.

## 2. Non-negotiable Rules

1. Research before drafting. Do not write substantive academic claims from memory.
2. Use a primary or authoritative source for every page-defining definition, attribution, argument, intellectual-history statement, or relation claim.
3. Treat metadata verification and substantive claim support as different tasks.
4. Give every high-risk claim a stable claim ID, an exact corpus field path, a source ID, a reproducible locator, and an evidence status.
5. Use the actual date on which the supporting source was opened and checked as `verifiedAt`.
6. Never infer a human review decision. Reviewer identity, role, date, decision, and rationale must be explicit.
7. Keep draft and review states invisible to public routes unless the owner separately authorizes exposure.
8. Prefer omission or an explicit pending state over plausible but unsupported prose.
9. Do not add words only to meet a length range. Depth is demonstrated by analytical coverage and evidence, not volume.
10. Research completion, corpus implementation, local validation, commit, and deployment are separate gates.

## 3. Source Hierarchy

Choose sources according to the claim being made.

### 3.1 Structured bibliographic facts

Use OpenAlex, Crossref, ORCID, Google Books, WorldCat, publisher records, library catalogues, and institutional profiles for:

- authorship and contributor identity;
- publication year and edition;
- DOI, ISBN, journal, publisher, and volume/issue;
- institutional affiliation;
- work-to-author and edition relationships.

When databases disagree, prefer the original publisher or work record and record the discrepancy.

### 3.2 Substantive theoretical claims

Prefer:

1. the original book, article, lecture, or archival text;
2. an official publisher or author-hosted version;
3. a peer-reviewed scholarly treatment that quotes or precisely locates the original;
4. an authoritative academic encyclopedia or handbook.

Discovery sources may help find a source, but they cannot be the sole support for a page-defining academic claim.

### 3.3 Relationships and intellectual genealogy

A relation requires evidence for both:

- the existence of an association between the two endpoints; and
- the direction and type claimed by the public label.

Do not turn co-occurrence, chronological sequence, thematic similarity, or a secondary author’s comparison into “influenced,” “derived from,” “opposes,” or “extends” without direct support.

### 3.4 Research guidance

Use methods literature, worked research examples, and domain-specific methodological discussion. Guidance must remain conditional on research question, design, population, materials, setting, ethics, and analytical capability.

## 4. Evidence, Content Nature, and Review Decision

These three dimensions must be recorded separately.

| Dimension | Allowed values | Meaning |
|---|---|---|
| Evidence status | verified / partially_supported / pending_review / blocked | Whether the named evidence supports the wording |
| Review readiness | ready_for_human_review / partially_supported / blocked | Whether the row is structurally ready to be submitted for a human decision |
| Content nature | source_backed_fact / editorial_synthesis / research_guidance | What kind of statement the prose makes |
| Review decision | accept_as_worded / accept_with_revision / reject / pending_review | What an authorized human reviewer decided |

### 4.1 Source-backed fact

Required fields:

- stable `claimId`;
- exact `fieldPath`;
- current or proposed wording;
- source ID;
- source type;
- reproducible locator;
- actual `verifiedAt` date;
- evidence status;
- reviewer identity and role when reviewed;
- review date and decision when reviewed.

### 4.2 Editorial synthesis

Editorial synthesis is allowed when the page needs to connect multiple sources, but it must:

- be labelled `editorial_synthesis` in the claim ledger;
- cite the sources being synthesized;
- avoid implying that one source states the entire synthesis;
- use bounded language such as “can be read as,” “is often used to examine,” or “this page groups” where appropriate;
- receive an editorial or subject-matter review decision before corpus implementation.

### 4.3 Research guidance

Research guidance is not a failed factual claim. It is a separate content nature that must:

- describe a decision or possible use, not an academic fact;
- state the conditions under which the guidance may apply;
- name foreseeable limitations, data requirements, or ethical risks;
- avoid “best,” “always,” “guarantees,” and other universal recommendations;
- receive methods-aware human review before implementation.

## 5. Authoring Lifecycle

Every content package follows this sequence:

1. **User question:** Write the concrete researcher question the page will help answer.
2. **Scope contract:** Name the target entity or relation, allowed files, denied work, and stop conditions.
3. **Research package:** Collect primary and authoritative sources before drafting.
4. **Source register:** Record source identity, type, URL or stable identifier, access date, and intended use.
5. **Claim ledger:** Map each page-defining claim to a source, locator, content nature, and evidence status.
6. **Outline:** Organize the page around reader decisions rather than around source summaries.
7. **Draft:** Write only claims supported by the ledger.
8. **Self-review:** Check meaning, evidence, navigation, comparison utility, and risk language.
9. **Human review:** Record row-level decisions; do not infer them.
10. **Corpus proposal:** Prepare exact field-level changes only after implementation authorization.
11. **Local gates:** Validate content, types, tests, lint, build, and affected browser behavior.
12. **Owner decision:** Commit, publish, index, advertise, or deploy only under separate authorization.

If a stage fails, return to that stage. Do not skip forward and compensate with a disclaimer.

## 6. Content Depth

Length ranges are planning guides, not acceptance gates.

| Content type | Planning range | Required depth |
|---|---:|---|
| D3 flagship theory | 1,600–2,400 words | definition, origins, key scholars/works, mechanisms, scope, limitations, comparisons, genealogy, research use, sources |
| D2 developed theory | 900–1,500 words | definition, core ideas, scope, limitations, one comparison route, one research-use route, sources |
| D1 orientation theory | 450–800 words | precise definition, purpose, scope boundary, one comparison or next route, sources |
| Topic guide | 600–1,000 words | research question, primary/supporting/not-recommended lenses, materials, unit of analysis, risks, next route |
| Scholar | 500–900 words | verified identity, contribution, works, associated ideas, attribution limits, related routes |
| Work | 300–600 words | verified bibliographic identity, argument/contribution, associated concepts, edition boundary, related routes |
| Concept | 250–450 words | definition, variations, parent theories, misuse boundary, comparison or application route |
| Discipline or field | 300–600 words | scope, boundaries, constituent entities, navigation purpose, sources where claims are substantive |
| Genealogy relation | 40–100 words | endpoints, direction, relation type, bounded description, evidence locator |

A shorter page is acceptable when it fully answers its bounded question. A longer page fails if it repeats material, hides uncertainty, or lacks usable comparison and navigation.

## 7. Entity-specific Contracts

### 7.1 Theory pages

Every theory page must identify:

- the problem or phenomenon the theory helps explain;
- a precise definition and scope boundary;
- key concepts and mechanisms;
- named scholars and works only when attribution is verified;
- limitations and known variations;
- at least one meaningful comparison or next route;
- research-use guidance appropriate to its depth;
- sources visible to readers.

Depth levels:

- **D1:** Orientation. It helps the reader recognize the theory and choose a next route.
- **D2:** Developed explanation. It supports comparison and a preliminary research choice.
- **D3:** Flagship guide. It supports claim-level scrutiny and a bounded research-design decision.

Do not call a page D3 merely because it is long.

### 7.2 Topic pages

Every Topic page must include:

- a concrete research question or problem frame;
- a primary theoretical lens and why it is primary;
- supporting lenses and the distinct work each performs;
- not-recommended lenses where a plausible choice would misfit the question;
- relevant unit of analysis;
- likely materials or data;
- limitations, ethical risks, and transfer limits;
- a terminating route to the most relevant comparison or theory page.

Topic guidance must not claim that one theory is universally best.

### 7.3 Scholar pages

Every scholar page must distinguish:

- verified identity and affiliation facts;
- original contributions supported by works;
- ideas associated with the scholar by later literature;
- disputed or simplified attributions;
- related works, concepts, and theory routes.

Avoid founder claims unless a source explicitly supports the wording and historical simplification is disclosed.

### 7.4 Work pages

Every work page must include:

- verified title, author, date, edition, publisher or journal, and identifier where available;
- the work’s contribution in bounded language;
- concepts or arguments tied to reproducible locators;
- edition or translation limits;
- links to the relevant scholar, theory, and concept routes.

Do not attribute a summary from a secondary source to the original work.

### 7.5 Concept pages

Every concept page must include:

- a concise definition;
- the theory or tradition in which it is being used;
- major variations when they affect meaning;
- what the concept should not be confused with;
- a comparison or research-use route;
- direct support for named definitions and attributions.

### 7.6 Genealogy relations

Every public relation must record:

- source and target entity IDs;
- relation type and direction;
- public description;
- source ID and locator;
- content nature;
- evidence status and actual verification date;
- human review decision when reviewed.

Graph density is never a reason to publish a weak relation.

## 8. Writing Style

- Public content is written in clear academic English unless a route explicitly serves another language.
- Lead with the research problem or distinction the reader needs.
- Prefer concrete nouns and bounded verbs: “argues,” “defines,” “distinguishes,” “has been used to examine.”
- Avoid unsupported intensifiers and universal claims: “the most important,” “proves,” “always,” “fully explains,” “guarantees.”
- Name the subject of an interpretation. Use “this guide treats…” or “the cited literature frames…” instead of presenting synthesis as neutral fact.
- Use short paragraphs, meaningful subheadings, and explicit comparisons.
- Define specialist terms before using them analytically.
- Preserve disagreement and variation when the literature does not support a single settled formulation.
- Paraphrase by default. Quote only the minimum wording needed and always provide a locator.
- Do not imitate a source’s sentence structure closely. Evidence is not permission to reproduce copyrighted prose.
- Do not use citations as decoration; place them near the claim they support.

## 9. Source Register Contract

Each registered source must contain:

| Field | Requirement |
|---|---|
| Source ID | stable and unique within the project |
| Title | exact source title |
| Author or organization | verified identity |
| Source type | primary work / peer-reviewed article / publisher / archive / database / handbook / discovery-only |
| Stable identifier | DOI, ISBN, catalogue ID, or canonical URL where available |
| URL | direct source or authoritative record |
| Accessed or verified date | actual date checked |
| Intended use | metadata / definition / history / mechanism / limitation / relation / research guidance |
| Risk note | paywall, snippet-only, edition uncertainty, secondary-only, missing locator, or other limitation |

Discovery-only sources cannot be promoted to substantive support without a separate authoritative source.

## 10. Claim Ledger Contract

Use one row per independently reviewable claim:

| Field | Requirement |
|---|---|
| `claimId` | stable identifier; do not renumber when wording changes |
| `fieldPath` | exact target in the corpus contract |
| Current wording | enough text to identify the public claim |
| Proposed wording | required when revision is recommended |
| Content nature | one of the three approved values |
| Source IDs | every source used for support |
| Locator | page, section, chapter, paragraph, table, timestamp, or stable record field |
| Evidence status | one approved evidence value |
| Review readiness | one approved readiness value; never store `ready_for_human_review` as an evidence status |
| `verifiedAt` | actual source-check date |
| Reviewer | explicit human identity |
| Reviewer role | subject / methods / editorial / product owner |
| Review date | actual human decision date |
| Review decision | one approved decision |
| Rationale or blocker | concise and reproducible |

If one sentence contains claims with different evidence or decisions, split it into multiple rows.

## 11. SEO and Navigation

- Give each page one clear search intent and one reader job.
- Use a descriptive title and summary; do not promise a definitive answer when the page offers a bounded guide.
- Link to the next useful comparison, theory, scholar, work, concept, or Topic route.
- Avoid orphan pages and circular “related content” blocks that do not help a decision.
- Draft, pending, or incomplete pages remain excluded from discoverability, advertising, and the sitemap unless an explicit product decision says otherwise.
- Do not create near-duplicate pages for small keyword variations.
- Search demand can prioritize an eligible content package, but it cannot lower the evidence standard.

## 12. Status Lifecycle

Use these content states:

1. `researching`
2. `ready_for_human_review`
3. `human_review_in_progress`
4. `reviewed`
5. `implementation_authorized`
6. `implemented_locally`
7. `locally_verified`
8. `commit_authorized`
9. `publication_authorized`
10. `published`

The state may move backward when evidence changes. Never skip a state that represents an unresolved decision.

## 13. Stop Conditions

Stop and report the blocker when:

- the target entity or exact page is ambiguous;
- the source only appears in a snippet and the claim cannot be reproduced;
- sources conflict on a page-defining fact;
- a locator is missing for a high-risk claim;
- the requested wording overstates what the source supports;
- a reviewer or owner decision is required;
- the change would expose draft content;
- the task would expand beyond its allowlist;
- validation fails outside the authorized scope.

## 14. Writing Acceptance Checklist

A content package is ready for implementation review only when:

- [ ] the user question and entity scope are explicit;
- [ ] the source register is complete;
- [ ] every page-defining claim appears in the ledger;
- [ ] factual, synthesis, and guidance content are separated;
- [ ] every high-risk claim has a reproducible locator;
- [ ] `verifiedAt` values are real source-check dates;
- [ ] limitations and uncertainty are visible;
- [ ] the page satisfies its entity-specific depth contract;
- [ ] the page offers a meaningful next route;
- [ ] required human decisions are recorded row by row;
- [ ] pending rows remain visibly pending;
- [ ] corpus implementation has separate authorization;
- [ ] publication has not been implied or performed.
