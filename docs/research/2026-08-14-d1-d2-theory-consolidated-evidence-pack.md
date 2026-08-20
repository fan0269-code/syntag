# 2026-08-14 D1/D2 Theory consolidated claim-level evidence pack

> FAN-65 research-only deliverable. Decision: `draft-only / ready for independent human review where stated`. This file is not corpus implementation, a human academic decision, owner approval, commit authorization, publication authorization, or deployment evidence.

## 1. Scope, baseline, and fixed boundary

- Access and verification date: 2026-08-14, Asia/Shanghai. Only sources actually opened in this run carry that date.
- Fixed pages: D2 `structuration-theory`, `communities-of-practice`, `practice-theory-bourdieu`, `social-capital-theory`; D1 `teacher-professional-development-theory`, `teacher-life-history-research`, `educational-equity-theory`, `institutional-theory`, `street-level-bureaucracy`, `multiple-streams-framework`.
- User decision supported: which current page-defining claims are reproducible, which require exact narrowing, and which must remain blocked before a corpus implementation proposal can be reviewed.
- Authorized outcome: research and exact corpus proposal only. No `src/`, `prisma/`, `tests/`, publication-state, database, Git staging/commit/push, preview, deployment, or public change.
- Allowlist: this report and the repository-mandated Obsidian review metadata record.
- Denylist: `src/**`, `prisma/**`, `tests/**`, routes, graph, search, sitemap, indexing, database, Git history, deployment, and production.
- Start branch / HEAD: `feature/content-enrichment-batch-1` / `c177740156ad834515f95cf83076e1498240cd9d`.
- Change class: U1 claim wording research package. Human row decisions and implementation authorization remain absent.
- Canonical path convention below: `src/data/corpus/shared/entities.ts -> theories[slug=<slug>].content.en.<field>`. Array indexes refer to the 2026-08-14 frozen canonical object.

### Complete start dirty baseline

All entries below predated FAN-65 and were preserved. The branch was already one commit ahead of its remote.

```text
## feature/content-enrichment-batch-1...origin/feature/content-enrichment-batch-1 [ahead 1]
 M AGENTS.md
 M docs/research/claim-audit/life-course-theory.md
 M docs/research/claim-audit/teacher-identity-theory.md
 M docs/roadmaps/2026-07-28-source-risk-hardening.md
 M prisma/schema.prisma
 M prisma/seed.ts
 M prompts/README.md
 M src/app/about/page.tsx
 M src/app/framework-builder/page.tsx
 M src/app/page.tsx
 M src/app/styles/content.css
 M src/app/topics/[slug]/page.tsx
 M src/app/works/[slug]/page.tsx
 M src/app/works/page.tsx
 M src/components/common/SourceBlock.tsx
 M src/components/common/VerificationBadge.tsx
 M src/components/content/EntityArticle.tsx
 M src/components/content/PathwayContentSections.tsx
 M src/components/content/TheoryArticle.tsx
 M src/components/layout/Footer.tsx
 M src/components/seo/JsonLdGraph.tsx
 M src/data/corpus/content-batches/2026-07-18-first-enrichment.ts
 M src/data/corpus/content-batches/2026-07-19-goodson-day-draft-scholars.ts
 M src/data/corpus/shared/entities.ts
 M src/lib/content-validation.ts
 M src/lib/entities/indexes.ts
 M src/lib/entities/theories.ts
 M src/lib/graph-data.ts
 M src/lib/internal-links.ts
 M src/lib/knowledge-entity-presentation.ts
 M src/lib/seed-verification.ts
 M src/lib/seo.ts
 M src/lib/theory-presentation.ts
 M tests/content-ui-contract.test.ts
 M tests/content-validation.test.ts
 M tests/e2e/content-enrichment.spec.ts
 M tests/e2e/smoke-a11y.spec.ts
 M tests/graph-data.test.ts
 M tests/second-scholar-enrichment.test.ts
 M tests/seed-corpus-regression.test.ts
 M tests/seed-integration.test.ts
 M tests/seo.test.ts
 M tests/theory-presentation.test.ts
 M tests/theory-static-ui.test.ts
?? .agents/skills/academic-claim-audit/SKILL.md
?? .agents/skills/academic-claim-audit/agents/openai.yaml
?? .agents/skills/academic-literature-review/SKILL.md
?? .agents/skills/academic-literature-review/agents/openai.yaml
?? .agents/skills/content-audit-agent/SKILL.md
?? .agents/skills/content-audit-agent/agents/openai.yaml
?? .agents/skills/content-independent-review-agent/SKILL.md
?? .agents/skills/content-independent-review-agent/agents/openai.yaml
?? .agents/skills/content-layout-agent/SKILL.md
?? .agents/skills/content-layout-agent/agents/openai.yaml
?? .agents/skills/content-polish-agent/SKILL.md
?? .agents/skills/content-polish-agent/agents/openai.yaml
?? .agents/skills/content-pre-review-agent/SKILL.md
?? .agents/skills/content-pre-review-agent/agents/openai.yaml
?? .agents/skills/syrtag-research/SKILL.md
?? .agents/skills/syrtag-research/agents/openai.yaml
?? docs/research/2026-07-23-teacher-professional-learning-and-change-r1.md
?? docs/research/2026-07-26-teacher-professional-learning-and-change-human-review.md
?? docs/research/claim-audit/2026-08-02-full-site-verification-migration-inventory.md
?? docs/research/genealogy-audit/2026-08-02-existing-relations-remediation-review.md
?? docs/research/independent-review/2026-08-14-d3-and-genealogy-independent-review.md
?? docs/research/independent-review/2026-08-14-topic-research-guidance-methods-independent-review.md
?? docs/research/pre-review/2026-08-12-todays-content-pre-review.md
?? docs/research/pre-review/2026-08-14-genealogy-fail-closed-u3-pre-review.md
?? docs/research/pre-review/2026-08-14-sitewide-content-maturity-pre-review.md
?? docs/roadmaps/2026-07-23-topic-pilot-review-plan.md
?? docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md
?? docs/roadmaps/2026-08-13-content-status-and-next-projects.md
?? docs/standards/content-update-standard.md
?? docs/standards/content-writing-standard.md
?? prompts/08-p1-t1-teacher-professional-learning-evidence-closure.md
?? prompts/09-day1-p0-source-risk-hardening-closure.md
?? prompts/10-day2-life-course-claim-ledger.md
?? prompts/11-day3-teacher-identity-claim-ledger.md
?? prompts/12-day4-d3-human-review.md
?? prompts/13-day5-genealogy-relation-audit.md
?? prompts/14-day6-topic-research-guidance-human-review.md
?? prompts/15-day7-weekly-closeout-next-package.md
?? src/lib/genealogy-visibility.ts
?? tests/content-independent-review-agent.test.ts
?? tests/content-pipeline-agents.test.ts
?? tests/content-pre-review-agent.test.ts
?? tests/genealogy-visibility.test.ts
```

## 2. Review rules and mechanical result

- `PASS`: the current or proposed wording stays within a reproduced authoritative locator, or is correctly labelled bounded editorial synthesis / conditional guidance and is structurally ready for human review. It is not approval.
- `FAIL`: current wording exceeds reproduced support; the row includes an exact, narrower, evidence-ready replacement.
- `BLOCKED`: a page-defining claim lacks a reproducible substantive locator. Metadata, title, table of contents, or an inaccessible full text is not promoted to substantive support.
- `verified` / `partially_supported` / `pending_review` / `blocked` are evidence statuses. `ready_for_human_review` is only review readiness.
- Reviewer identity, role, date, decision, and rationale remain `not_assigned` / `pending_review` for every row.
- Mechanical total: 10/10 pages assessed; 50 page-defining claim rows; current verdicts **PASS 41 / FAIL 5 / BLOCKED 4**. Exact evidence-ready current-or-replacement proposals: **46/50**. Blocked proposals: **4/50**.
- Depth conclusion: all four D2 pages retain D2 scope only; all six D1 pages retain D1 orientation scope only. This pack does not establish full 900–1,500 or 450–800 word implementation readiness because corpus drafting and row-level human decisions are separate gates.

## 3. D2 — `structuration-theory`

### User question, depth, and boundary

Can this page help a researcher decide whether recurrent enactment of rules/resources across time-space is the relevant mechanism, without reducing Structuration Theory to a slogan? D2 is appropriate only if definition, mechanism, unit, boundary, comparison, and research-use claims remain distinct. Exact canonical proposal paths are `what_is_it`, `origins`, `core_concepts[1]`, `explanatory_mechanisms[0]`, and `fit_writing[0]`.

### Source register

| source ID | identity / author | source type | stable identifier / URL | directly supports | does not support | verifiedAt | risk |
|---|---|---|---|---|---|---|---|
| `struct-giddens-1979` | Anthony Giddens, *Central Problems in Social Theory* (1979), University of California Press | publisher / primary-work record | [UC Press](https://www.ucpress.edu/books/central-problems-in-social-theory/paper), ISBN 9780520039759 | Theory-of-structuration name; knowledgeable actors producing/reproducing social systems; time-space; power/domination; dialogue with interpretive sociology, functionalism, structuralism | Exact definitions of duality, rules/resources, or the full recursive mechanism | 2026-08-14 | Public description and contents only; no chapter text/pages reproduced |
| `struct-giddens-1984` | Anthony Giddens, *The Constitution of Society* (1984; UC Press paper 1986) | publisher / primary-work record | [UC Press](https://www.ucpress.edu/books/the-constitution-of-society/paper), ISBN 9780520057289 | Work identity and publisher statement that it is an integrated, comprehensive formulation connecting theory and empirical method | Exact duality/rules/resources wording or page-level mechanism | 2026-08-14 | Description-level access; substantive concept rows remain blocked |

### Claim ledger

| claimId | canonical fieldPath | current wording | exact proposed wording | nature | sources | reproducible locator | evidence / readiness / verdict | verifiedAt | forbidden extension / blocker |
|---|---|---|---|---|---|---|---|---|---|
| `d2-struct-definition` | `...content.en.what_is_it` | “Structuration Theory explains how recurrent social practices draw on and reproduce or modify rules and resources across time and space. It treats structure and agency as a duality...” | “Giddens's structuration project treats knowledgeable actors as producing and reproducing social systems through conduct and makes time-space relations central to social theory.” | `source_backed_fact` | `struct-giddens-1979` | UC Press, “About the Book,” paras. 1–3 | `partially_supported` / `ready_for_human_review` / **FAIL** | 2026-08-14 | Do not retain rules/resources or duality as verified without original-text locator |
| `d2-struct-origins` | `...content.en.origins` | “Giddens developed the theory through debates with interpretive sociology, functionalism, and structuralism...” | Retain current wording, but change “formed the approach” to “publicly presents the developing approach” and “gave” to “is presented by the publisher as an integrated formulation.” | `editorial_synthesis` | `struct-giddens-1979`; `struct-giddens-1984` | 1979 About the Book; 1984 publisher description | `partially_supported` / `ready_for_human_review` / **PASS** | 2026-08-14 | Do not turn publisher chronology into a sole-origin claim |
| `d2-struct-duality` | `...content.en.core_concepts[1].definition` | “Structure is both the medium and outcome of recursively organised practice.” | No corpus wording proposed until a lawful original-text page/section locator is reproduced. | `source_backed_fact` | `struct-giddens-1984` | Publisher description only; concept text unavailable | `blocked` / `blocked` / **BLOCKED** | not set | Metadata and an integrated-formulation description cannot verify this exact definition |
| `d2-struct-recursive-mechanism` | `...content.en.explanatory_mechanisms[0].process` | “Actors draw on available rules and resources... repeated enactment reproduces... altered enactment may contribute to change.” | No corpus wording proposed until the distinct reproduction and transformation clauses have original-text locators. | `editorial_synthesis` | `struct-giddens-1979`; `struct-giddens-1984` | No reproducible original-text locator | `blocked` / `blocked` / **BLOCKED** | not set | Do not infer a full mechanism from book descriptions |
| `d2-struct-fit-guidance` | `...content.en.fit_writing[0]` | “Name the recurrent practice and time-space setting before claiming Structuration Theory fits.” | Retain as: “For a proposed Structuration study, name the recurrent practice and time-space setting; treat this as conditional research guidance requiring methods-aware review.” | `research_guidance` | `struct-giddens-1979` | UC Press time-space description; guidance is explicitly editorial | `pending_review` / `ready_for_human_review` / **PASS** | 2026-08-14 | Not a universal method or evidence that any selected case is structuration |

### Exact proposal and conclusion

```typescript
const structGiddens1979: ContentSource = { id: "struct-giddens-1979", citation: "Giddens, A. (1979). Central Problems in Social Theory: Action, Structure, and Contradiction in Social Analysis. University of California Press.", url: "https://www.ucpress.edu/books/central-problems-in-social-theory/paper", source_kind: "publisher", evidence_level: "L1", supports: ["Publisher description identifies the theory of structuration, knowledgeable actors producing and reproducing social systems, time-space relations, and power/domination."] };
const structGiddens1984: ContentSource = { id: "struct-giddens-1984", citation: "Giddens, A. (1984). The Constitution of Society: Outline of the Theory of Structuration. University of California Press.", url: "https://www.ucpress.edu/books/the-constitution-of-society/paper", source_kind: "publisher", evidence_level: "L1", supports: ["Publisher record identifies the book as an integrated formulation of Giddens's perspective and its connection to empirical method."] };
```

Proposal: replace only `what_is_it` and the bounded wording in `origins`; keep `core_concepts[1]` and `explanatory_mechanisms[0]` blocked; label `fit_writing[0]` as guidance in verification metadata. Conclusion: **2 PASS / 1 FAIL / 2 BLOCKED; 3/5 exact proposals evidence-ready. D2 corpus implementation is blocked.**

## 4. D2 — `communities-of-practice`

### User question, depth, and boundary

Can a researcher distinguish learning through participation in a sustained practice from a generic group label? D2 is justified because the page needs a definition, origin, LPP mechanism, unit boundary, and fit safeguard. Canonical paths: `what_is_it`, `origins`, `core_concepts[5]`, `analysis_unit`, `fit_writing[0]`.

### Source register

| source ID | identity / author | source type | stable identifier / URL | directly supports | does not support | verifiedAt | risk |
|---|---|---|---|---|---|---|---|
| `cop-lave-wenger-1991` | Jean Lave & Etienne Wenger, *Situated Learning: Legitimate Peripheral Participation* (1991) | publisher / primary-work chapter | [Cambridge](https://www.cambridge.org/highereducation/books/situated-learning/6915ABD21C8E4619F750A4D4ACA616CD/legitimate-peripheral-participation/28CD74BD15EBFABE881F24826917EC4C), DOI 10.1017/CBO9780511815355 | LPP as situated learning; newcomers/old-timers; activities, identities, artefacts, communities; Ch. 1 pp. 27–44; Ch. 4 pp. 89–118 | A universal linear novice-to-expert ladder or guaranteed learning | 2026-08-14 | Public chapter summaries, not full chapters |
| `cop-wenger-1998` | Etienne Wenger, *Communities of Practice: Learning, Meaning, and Identity* (1998) | publisher / primary-work record and chapter summary | [Cambridge](https://www.cambridge.org/highereducation/books/communities-of-practice/724C22A03B12D11DFC345EEF0AD3F22A?chapterId=CBO9780511803932A020), DOI 10.1017/CBO9780511803932 | Engagement in social practice; communities pursuing shared enterprise over time; Chapter 3 summary on sustained mutual engagement, enterprise, temporal practice, participation/reification | Automatic benefit, harmony, equity, or any formal group being a CoP | 2026-08-14 | Publisher description/summary; details beyond visible text require full text |

### Claim ledger

| claimId | canonical fieldPath | current wording | exact proposed wording | nature | sources | locator | evidence / readiness / verdict | verifiedAt | forbidden extension |
|---|---|---|---|---|---|---|---|---|---|
| `d2-cop-definition` | `...content.en.what_is_it` | “Communities of Practice is a social learning theory... A named group is not automatically...” | “Communities of Practice is a social account of learning through engagement in practice and shared enterprise over time; a formal group label alone does not establish such a community.” | `editorial_synthesis` | `cop-lave-wenger-1991`; `cop-wenger-1998` | Cambridge book Description; Wenger Ch. 3 Summary | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Do not promise competence, identity change, or benefit in every case |
| `d2-cop-origins` | `...content.en.origins` | 1991 LPP followed by Wenger's 1998 social-participation formulation | Retain, replacing “introduced” with “presents as its central defining characteristic” and limiting 1998 to the visible practice/community/meaning/identity scope. | `source_backed_fact` | `cop-lave-wenger-1991`; `cop-wenger-1998` | Lave/Wenger Ch. 1 Summary; Wenger Description | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | No sole-founder or co-founder claim |
| `d2-cop-lpp` | `...content.en.core_concepts[5].definition` | “Newcomers' access to meaningful practice and changing recognition can shape participation and identity.” | “LPP directs attention to newcomers' relations with established participants, activities, identities, artefacts, and access to fuller participation in sociocultural practice.” | `source_backed_fact` | `cop-lave-wenger-1991` | Ch. 1, pp. 27–44, public Summary | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Do not make movement linear, inevitable, harmonious, or beneficial |
| `d2-cop-unit` | `...content.en.analysis_unit` | “A socially sustained practice and its participants... not merely a formal team...” | “Analyse a practice sustained through sufficient mutual engagement in an enterprise over time, including participants and shared learning history; do not infer a CoP from a programme, platform, or organisation chart alone.” | `editorial_synthesis` | `cop-wenger-1998` | Ch. 3 “Learning,” pp. 86–102, public Summary | `partially_supported` / `ready_for_human_review` / **PASS** | 2026-08-14 | Do not claim all three dimensions are measured by attendance |
| `d2-cop-fit` | `...content.en.fit_writing[0]` | “Show evidence of practice, mutual engagement, joint enterprise, and repertoire before naming a CoP.” | Retain and append: “This is conditional research guidance, not a diagnostic checklist.” | `research_guidance` | `cop-wenger-1998` | Description + Ch. 3 Summary | `pending_review` / `ready_for_human_review` / **PASS** | 2026-08-14 | Requires methods-aware review and counterevidence |

### Exact proposal and conclusion

```typescript
const copLaveWenger1991: ContentSource = { id: "cop-lave-wenger-1991", citation: "Lave, J., & Wenger, E. (1991). Situated Learning: Legitimate Peripheral Participation. Cambridge University Press.", url: "https://doi.org/10.1017/CBO9780511815355", source_kind: "doi", evidence_level: "L1", supports: ["Cambridge Chapter 1 summary supports LPP, situated learning, newcomers and established participants, activities, identities, artefacts, and communities of practice."] };
const copWenger1998: ContentSource = { id: "cop-wenger-1998", citation: "Wenger, E. (1998). Communities of Practice: Learning, Meaning, and Identity. Cambridge University Press.", url: "https://doi.org/10.1017/CBO9780511803932", source_kind: "doi", evidence_level: "L1", supports: ["Cambridge description and Chapter 3 summary support engagement in social practice, shared enterprise over time, sustained mutual engagement, learning, and identity scope."] };
```

Proposal: replace the five named fields with the exact bounded wording above and preserve sources as distinct records. Conclusion: **5 PASS / 0 FAIL / 0 BLOCKED; 5/5 evidence-ready for human review. No implementation authorization.**

## 5. D2 — `practice-theory-bourdieu`

### User question, depth, and boundary

Can the page guide a preliminary choice when habitus, field, capital, recognition, and patterned practice are the proposed analytic vocabulary, without treating habitus as destiny? Canonical paths: `what_is_it`, `origins`, `core_concepts[0]`, `explanatory_mechanisms[0]`, `misuse_risks[0]`.

### Source register

| source ID | identity / author | source type | stable identifier / URL | directly supports | does not support | verifiedAt | risk |
|---|---|---|---|---|---|---|---|
| `practice-outline-1977` | Pierre Bourdieu, *Outline of a Theory of Practice* (1977), trans. Richard Nice | publisher / primary-work record | [Cambridge](https://www.cambridge.org/core/books/outline-of-a-theory-of-practice/193A11572779B478F5BAA3E3028827D8), DOI 10.1017/CBO9780511812507 | Theory-of-practice identity; habitus mediating objective structures/practices; reproduction, symbolic capital/power; chapter ranges | Exact field mechanism or current “durable but revisable” definition | 2026-08-14 | Description and contents, not full chapter text |
| `practice-logic-1990` | Pierre Bourdieu, *The Logic of Practice* (1990), trans. Richard Nice | publisher / primary-work record | [Stanford](https://www.sup.org/books/sociology/logic-practice), ISBN 9780804720113 | Full theory-of-practice statement; subjectivism/objectivism; structure/practice via habitus; symbolic capital; domination; reflexive standpoint | A universal field boundary, fixed causal sequence, or mechanical reproduction | 2026-08-14 | Publisher description only |

### Claim ledger

| claimId | fieldPath | current wording | exact proposed wording | nature | sources | locator | evidence / readiness / verdict | verifiedAt | forbidden extension / blocker |
|---|---|---|---|---|---|---|---|---|---|
| `d2-practice-definition` | `...content.en.what_is_it` | “...patterned practice through relations among habitus, capital, and field...” | “Bourdieu's theory of practice examines the relation between objective structures and practices through habitus and extends the analysis to symbolic capital, power, and domination; this page treats field and capital relations as a bounded editorial synthesis.” | `editorial_synthesis` | `practice-outline-1977`; `practice-logic-1990` | Cambridge Book description; Stanford Description | `partially_supported` / `ready_for_human_review` / **PASS** | 2026-08-14 | Do not say the accessible records directly state the entire triad mechanism |
| `d2-practice-origins` | `...content.en.origins` | *Outline* (1977) and *Logic* (1990) central; later Wacquant work | “*Outline of a Theory of Practice* (1977) presents the theory and its habitus/structure-practice problem; *The Logic of Practice* (1990) is described by Stanford as its fullest statement.” | `source_backed_fact` | `practice-outline-1977`; `practice-logic-1990` | Cambridge/Stanford descriptions | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Remove the unverified Wacquant clause from this row unless separately checked |
| `d2-practice-habitus` | `...content.en.core_concepts[0].definition` | “Historically formed, durable but revisable dispositions...” | “On the checked publisher records, habitus is the concept through which Bourdieu addresses the interplay between objective structures and practices.” | `source_backed_fact` | `practice-outline-1977`; `practice-logic-1990` | Cambridge Description; Stanford first-part description | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | “Durable but revisable dispositions” needs original-text locator before L1 treatment |
| `d2-practice-field-mechanism` | `...content.en.explanatory_mechanisms[0].process` | “A field organises positions, stakes, and criteria that make some resources valuable, convertible, or legitimate.” | No implementation wording until a primary-work locator directly supports positions, stakes, value, conversion, and legitimacy together or the sentence is split. | `editorial_synthesis` | `practice-outline-1977`; `practice-logic-1990` | No reproduced primary locator for full sentence | `blocked` / `blocked` / **BLOCKED** | not set | Do not infer a composite field-capital mechanism from publisher summaries |
| `d2-practice-misuse` | `...content.en.misuse_risks[0]` | “Treating habitus as destiny.” | “Do not use habitus as a deterministic label; any claim about patterned practice must preserve agency, observed variation, and the evidentiary limits of the study.” | `research_guidance` | `practice-logic-1990` | Stanford description notes agency and opposition to subjectivism/objectivism; guidance is editorial | `pending_review` / `ready_for_human_review` / **PASS** | 2026-08-14 | Not a source quotation or universal operational rule |

### Exact proposal and conclusion

```typescript
const practiceOutline1977: ContentSource = { id: "practice-outline-1977", citation: "Bourdieu, P. (1977). Outline of a Theory of Practice (R. Nice, Trans.). Cambridge University Press.", url: "https://doi.org/10.1017/CBO9780511812507", source_kind: "doi", evidence_level: "L1", supports: ["Cambridge record supports the theory-of-practice identity, habitus as addressing objective structures and practices, reproduction, symbolic capital, and symbolic power."] };
const practiceLogic1990: ContentSource = { id: "practice-logic-1990", citation: "Bourdieu, P. (1990). The Logic of Practice (R. Nice, Trans.). Stanford University Press.", url: "https://www.sup.org/books/sociology/logic-practice", source_kind: "publisher", evidence_level: "L1", supports: ["Stanford describes the book as Bourdieu's fullest statement and identifies subjectivism/objectivism, structure-practice interplay through habitus, symbolic capital, domination, and researcher standpoint."] };
```

Proposal: exact replacements above; omit the blocked mechanism until primary locator work. Conclusion: **4 PASS / 0 FAIL / 1 BLOCKED; 4/5 evidence-ready. D2 implementation blocked.**

## 6. D2 — `social-capital-theory`

### User question, depth, and boundary

Can the page help distinguish a named social-capital tradition, relation, resource, access/mobilisation process, level, and possible negative consequences from a generic positive-network label? Canonical paths: `what_is_it`, `origins`, `core_concepts[1]`, `core_concepts[3]`, `analysis_unit`.

### Source register

| source ID | identity / author | source type | stable identifier / URL | directly supports | does not support | verifiedAt | risk |
|---|---|---|---|---|---|---|---|
| `social-coleman-1988` | James S. Coleman, “Social Capital in the Creation of Human Capital,” *AJS* 94, S95–S120 | journal / primary article | [DOI](https://doi.org/10.1086/228943) | Social capital as resource for action; social structure; obligations/expectations, information channels, norms; closure; education application | All later network metrics or a uniformly positive asset | 2026-08-14 | Public abstract, no article body used |
| `social-lin-2001` | Nan Lin, *Social Capital: A Theory of Social Structure and Action* (2001) | publisher / primary-work chapter summary | [Cambridge](https://www.cambridge.org/core/books/social-capital/E1C3BB67419F498E5E41DC44FA16D5C0), DOI 10.1017/CBO9780511815447 | Resources accessed through connections/relations; structure, opportunity/accessibility, action/use; Ch. 4 pp. 41–54 | Benefit from every tie or equivalence of access and mobilisation | 2026-08-14 | Public description and chapter summary |
| `social-portes-1998` | Alejandro Portes, “Social Capital: Its Origins and Applications in Modern Sociology” | peer-reviewed review | [Annual Reviews](https://www.annualreviews.org/content/journals/10.1146/annurev.soc.24.1.1), DOI 10.1146/annurev.soc.24.1.1 | Multiple origins/definitions; positive functions; four negative consequences; individual-to-community/nation conceptual stretch and limits | One unified definition or proof of any causal benefit | 2026-08-14 | Abstract-level support for limits, not every detailed mechanism |

### Claim ledger

| claimId | fieldPath | current wording | exact proposed wording | nature | sources | locator | evidence / readiness / verdict | verifiedAt | forbidden extension |
|---|---|---|---|---|---|---|---|---|---|
| `d2-social-definition` | `...content.en.what_is_it` | “Social Capital Theory is a family... relationships, membership, network structure, obligations, norms, trust, recognition, and brokerage...” | “Use ‘social capital’ only with a named formulation. Coleman treats it as a resource for action embedded in social structure; Lin centres resources accessed and mobilised through social relations; Portes shows that definitions, levels, functions, and negative consequences cannot be collapsed.” | `editorial_synthesis` | `social-coleman-1988`; `social-lin-2001`; `social-portes-1998` | Coleman Abstract; Lin Description/Ch. 4 Summary; Portes Abstract | `partially_supported` / `ready_for_human_review` / **FAIL** | 2026-08-14 | Current list silently merges concepts not jointly supported by one source |
| `d2-social-origins` | `...content.en.origins` | Distinct Bourdieu, Coleman, Lin, collective/development accounts; Portes warning | “Coleman and Lin provide distinct action/structure and relation-resource formulations; Portes reviews earlier origins, multiple definitions, positive functions, negative consequences, and conceptual stretch.” | `source_backed_fact` | `social-coleman-1988`; `social-lin-2001`; `social-portes-1998` | Named abstracts/descriptions | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Bourdieu and development traditions require separate checked sources before naming here |
| `d2-social-resource-access` | `...content.en.core_concepts[1].definition` | “Information, advice, support, referrals, recognition, or opportunities reached through connections.” | “Resources accessed through social connections and relations; in Lin's formulation, distinguish structural embeddedness, accessibility, and use/mobilisation.” | `source_backed_fact` | `social-lin-2001` | Book Description; Ch. 4 Summary, pp. 41–54 | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Examples beyond the source must be separately supported or editorial |
| `d2-social-obligation` | `...content.en.core_concepts[3].definition` | “Expectations and rules that may enable exchange or impose claims and costs.” | “In Coleman's formulation, obligations and expectations, information channels, and social norms are distinct forms; do not treat any one as a universal proxy for social capital.” | `editorial_synthesis` | `social-coleman-1988` | AJS public Abstract | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Do not merge obligation, trust, closure, and benefit |
| `d2-social-unit` | `...content.en.analysis_unit` | Named individual/dyad/network/organisation/community/system; levels not inferred | Retain and append: “Choose one stated level and justify any cross-level inference; Portes documents the risks of stretching an individual asset into a community or national property.” | `research_guidance` | `social-portes-1998` | Annual Reviews Abstract | `pending_review` / `ready_for_human_review` / **PASS** | 2026-08-14 | Not a universal ban on multilevel designs; requires explicit bridge |

### Exact proposal and conclusion

```typescript
const socialColeman1988: ContentSource = { id: "social-coleman-1988", citation: "Coleman, J. S. (1988). Social capital in the creation of human capital. American Journal of Sociology, 94, S95–S120.", url: "https://doi.org/10.1086/228943", source_kind: "doi", evidence_level: "L1", supports: ["The public abstract supports social capital as a resource for action embedded in social structure, obligations and expectations, information channels, norms, closure, and a bounded education application."] };
const socialLin2001: ContentSource = { id: "social-lin-2001", citation: "Lin, N. (2001). Social Capital: A Theory of Social Structure and Action. Cambridge University Press.", url: "https://doi.org/10.1017/CBO9780511815447", source_kind: "doi", evidence_level: "L1", supports: ["Cambridge description and Chapter 4 summary support resources accessed through social connections and the distinction among embedded structure, accessibility, and use/mobilisation."] };
const socialPortes1998: ContentSource = { id: "social-portes-1998", citation: "Portes, A. (1998). Social capital: Its origins and applications in modern sociology. Annual Review of Sociology, 24, 1–24.", url: "https://doi.org/10.1146/annurev.soc.24.1.1", source_kind: "doi", evidence_level: "L1", supports: ["The abstract supports multiple origins and definitions, positive and negative consequences, and limits of individual-to-collective conceptual stretch."] };
```

Conclusion: **4 PASS / 1 FAIL / 0 BLOCKED; 5/5 exact current-or-replacement proposals evidence-ready. No human or implementation decision.**

## 7. D1 — `teacher-professional-development-theory`

### User question, depth, and boundary

Which named model can orient a study of teachers' professional learning or growth without treating activity attendance as change? This is a D1 editorial entry, not a canonical single theory. Canonical paths: `what_is_it`, `origins`, `core_concepts[0]`, `theory_nature.explanation`, `misuse_risks[0]`.

### Source register

| source ID | identity / author | source type | stable identifier / URL | directly supports | does not support | verifiedAt | risk |
|---|---|---|---|---|---|---|---|
| `teacher-development-clarke-hollingsworth-2002` | David Clarke & Hilary Hollingsworth, “Elaborating a Model of Teacher Professional Growth,” *Teaching and Teacher Education* 18(8), 947–967 | journal / primary article | [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0742051X02000537), DOI 10.1016/S0742-051X(02)00053-7 | Empirically grounded interconnected, non-linear model; four domains; change sequences/growth networks; context | Universal model or proof that participation causes outcomes | 2026-08-14 | Abstract and section snippets, paywalled body |
| `teacher-development-timperley-2007` | Helen Timperley, Aaron Wilson, Heather Barrar & Irene Fung, *Teacher Professional Learning and Development: BES* | government evidence synthesis | [New Zealand Ministry of Education](https://www.educationcounts.govt.nz/publications/series/2515/15341) | Evidence-synthesis identity; learning opportunities, interpretation/use, teaching practice, learner outcomes; relationship is “far from simple” | One activity working everywhere or a single causal theory | 2026-08-14 | Public summary plus downloadable report; this run used summary only |

### Claim ledger

| claimId | fieldPath | current wording | exact proposed wording | nature | sources | locator | evidence / readiness / verdict | verifiedAt | boundary |
|---|---|---|---|---|---|---|---|---|---|
| `d1-tpd-nature` | `...content.en.what_is_it` | Editorial entry into plural models; not one closed theory | Retain exactly. | `editorial_synthesis` | `teacher-development-clarke-hollingsworth-2002`; `teacher-development-timperley-2007` | Clarke abstract; Timperley summary | `partially_supported` / `ready_for_human_review` / **PASS** | 2026-08-14 | Must name a model before making mechanism claims |
| `d1-tpd-origins` | `...content.en.origins` | Names Day, Guskey, Clarke/Hollingsworth, later syntheses | “Clarke and Hollingsworth provide an interconnected, non-linear professional-growth model; Timperley and colleagues provide an evidence-synthesis route showing that links among learning opportunities, interpretation, practice, and outcomes are not simple.” | `editorial_synthesis` | `teacher-development-clarke-hollingsworth-2002`; `teacher-development-timperley-2007` | Article Abstract; ministry Summary | `partially_supported` / `ready_for_human_review` / **FAIL** | 2026-08-14 | Day and Guskey were not substantively re-opened in this run |
| `d1-tpd-learning` | `...content.en.core_concepts[0].definition` | “Learning connected to teachers' work, knowledge, practice, and professional development.” | “Professional learning concerns learning opportunities and how teachers interpret and use them in relation to teaching practice; outcome claims require separate evidence.” | `editorial_synthesis` | `teacher-development-timperley-2007` | Ministry Summary, black-box paragraphs | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Do not equate satisfaction, attendance, practice, and learner outcome |
| `d1-tpd-model-scope` | `...content.en.theory_nature.explanation` | Groups several models; study must name model/mechanism | Retain exactly and add the model citation to the relevant claim row. | `editorial_synthesis` | `teacher-development-clarke-hollingsworth-2002`; `teacher-development-timperley-2007` | Named source identities and scopes | `pending_review` / `ready_for_human_review` / **PASS** | 2026-08-14 | D1 orientation only; no universal theory claim |
| `d1-tpd-workshop-misuse` | `...content.en.misuse_risks[0]` | “Calling any workshop professional development...” | “Do not infer teacher learning, changed practice, or learner outcomes from attendance alone; state the opportunity, proposed change process, context, and outcome evidence separately.” | `research_guidance` | `teacher-development-clarke-hollingsworth-2002`; `teacher-development-timperley-2007` | Clarke Abstract; Timperley Summary | `pending_review` / `ready_for_human_review` / **PASS** | 2026-08-14 | Conditional guidance, not a causal finding |

### Exact proposal and conclusion

```typescript
const teacherDevelopmentClarke2002: ContentSource = { id: "teacher-development-clarke-hollingsworth-2002", citation: "Clarke, D., & Hollingsworth, H. (2002). Elaborating a model of teacher professional growth. Teaching and Teacher Education, 18(8), 947–967.", url: "https://doi.org/10.1016/S0742-051X(02)00053-7", source_kind: "doi", evidence_level: "L1", supports: ["The abstract supports an empirically grounded interconnected, non-linear model with four domains and mediating change sequences/growth networks."] };
const teacherDevelopmentTimperley2007: ContentSource = { id: "teacher-development-timperley-2007", citation: "Timperley, H., Wilson, A., Barrar, H., & Fung, I. (2007). Teacher Professional Learning and Development: Best Evidence Synthesis Iteration. New Zealand Ministry of Education.", url: "https://www.educationcounts.govt.nz/publications/series/2515/15341", source_kind: "authoritative_web", evidence_level: "L1", supports: ["The official summary supports a non-simple relation among professional-learning opportunities, teachers' interpretation/use, teaching practice, and learner outcomes."] };
```

Conclusion: **4 PASS / 1 FAIL / 0 BLOCKED; 5/5 evidence-ready. D1 orientation only.**

## 8. D1 — `teacher-life-history-research`

### User question, depth, and boundary

When is an interpretive life-history/narrative research tradition appropriate for teachers' professional lives, and what must not be inferred from narrated accounts? This is a D1 research-tradition page, not a causal theory. Paths: `what_is_it`, `origins`, `core_concepts[0]`, `core_concepts[1]`, `inapplicable_topics[0]`.

### Source register

| source ID | identity / author | source type | stable identifier / URL | directly supports | does not support | verifiedAt | risk |
|---|---|---|---|---|---|---|---|
| `teacher-life-history-goodson-2013` | Ivor F. Goodson, *Developing Narrative Theory: Life Histories and Personal Representation* (2013) | publisher / primary-work record | [Routledge](https://www.routledge.com/Developing-Narrative-Theory-Life-Histories-and-Personal-Representation/Goodson/p/book/9780415603621), ISBN 9780415603621 | Life narratives, life-story interviews, collaborative exchange, sociological themes/historical patterns, personal representation | Memory accuracy, causal effects, or transparent biography | 2026-08-14 | Publisher description and contents, not full text |
| `teacher-life-history-goodson-sikes-2001` | Ivor F. Goodson & Pat Sikes, *Life History Research in Educational Settings* (2001) | publisher / primary-work record | [McGraw Hill](https://www.mheducation.co.uk/life-history-research-in-educational-settings-9780335207138-emea), ISBN 9780335207138 | Education life-history method; teachers' lives/careers; life story vs life history; social context; epistemology; ethics/power | Population prevalence or causal theory | 2026-08-14 | Publisher description/contents only; displayed author metadata is malformed (“N/A Goodson”) |

### Claim ledger

| claimId | fieldPath | current wording | exact proposed wording | nature | sources | locator | evidence / readiness / verdict | verifiedAt | boundary / blocker |
|---|---|---|---|---|---|---|---|---|---|
| `d1-life-history-nature` | `...content.en.what_is_it` | Qualitative research tradition; not causal theory or transparent biography | “Teacher Life History Research is a qualitative, interpretive research tradition using life stories and contextual inquiry to examine teachers' lives and careers; it is not a causal theory or population-estimation method.” | `editorial_synthesis` | `teacher-life-history-goodson-2013`; `teacher-life-history-goodson-sikes-2001` | Publisher descriptions and contents | `partially_supported` / `ready_for_human_review` / **PASS** | 2026-08-14 | “Transparent biography” is a safeguard, not source quote |
| `d1-life-history-origins` | `...content.en.origins` | Goodson work plus narrative ethics | “Goodson and Sikes provide an education-specific life-history route; Goodson's later work develops narrative theory, life-story interviewing, and personal representation.” | `source_backed_fact` | `teacher-life-history-goodson-2013`; `teacher-life-history-goodson-sikes-2001` | Named descriptions/contents | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Ethics claims beyond the 2001 contents need chapter-text locator |
| `d1-life-history-concept` | `...content.en.core_concepts[0].definition` | “An interpreted account of a life situated in social and historical context.” | “A life-history inquiry relates life stories to social context and explicitly addresses epistemological, ethical, and practical questions.” | `editorial_synthesis` | `teacher-life-history-goodson-sikes-2001` | Contents: “life stories and social context,” “epistemological considerations,” “ethics and power” | `partially_supported` / `ready_for_human_review` / **PASS** | 2026-08-14 | Do not call a table-of-contents phrase a full epistemology |
| `d1-life-history-memory` | `...content.en.core_concepts[1].definition` | “Accounts are told, remembered, and represented for particular audiences and times.” | No implementation wording until a primary chapter or authoritative methods source is opened at a stable section/page supporting memory, audience, and temporality together. | `source_backed_fact` | `teacher-life-history-goodson-2013` | No reproducible text for all clauses | `blocked` / `blocked` / **BLOCKED** | not set | Title/description supports representation, not the complete memory/audience claim |
| `d1-life-history-population` | `...content.en.inapplicable_topics[0]` | “Representative prevalence estimates — Life-history materials do not by themselves support population estimation.” | Retain as explicitly labelled research-design boundary requiring methods-aware review. | `research_guidance` | `teacher-life-history-goodson-2013`; `teacher-life-history-goodson-sikes-2001` | Source scope is qualitative life-history method; inference boundary is editorial | `pending_review` / `ready_for_human_review` / **PASS** | 2026-08-14 | Not a prohibition on mixed methods |

### Exact proposal and conclusion

```typescript
const lifeHistoryGoodson2013: ContentSource = { id: "teacher-life-history-goodson-2013", citation: "Goodson, I. F. (2013). Developing Narrative Theory: Life Histories and Personal Representation. Routledge.", url: "https://www.routledge.com/Developing-Narrative-Theory-Life-Histories-and-Personal-Representation/Goodson/p/book/9780415603621", source_kind: "publisher", evidence_level: "L1", supports: ["Publisher description supports life narratives, life-story interviewing, collaborative exchange, sociological themes, historical patterns, and personal representation."] };
const lifeHistoryGoodsonSikes2001: ContentSource = { id: "teacher-life-history-goodson-sikes-2001", citation: "Goodson, I. F., & Sikes, P. (2001). Life History Research in Educational Settings: Learning from Lives. Open University Press.", url: "https://www.mheducation.co.uk/life-history-research-in-educational-settings-9780335207138-emea", source_kind: "publisher", evidence_level: "L1", supports: ["Publisher description and contents support education life-history research, teachers' lives and careers, social context, epistemological considerations, and ethics/power as chapter topics."] };
```

Conclusion: **4 PASS / 0 FAIL / 1 BLOCKED; 4/5 evidence-ready. D1 implementation blocked on the memory/audience claim.**

## 9. D1 — `educational-equity-theory`

### User question, depth, and boundary

How should a researcher state the population, comparison, dimension, and normative basis of an educational-equity question without claiming one canonical theory or metric? This is a D1 editorial umbrella. Paths: `what_is_it`, `origins`, `theory_nature.explanation`, `core_concepts[0]`, `misuse_risks[0]`.

### Source register

| source ID | identity / author | source type | stable identifier / URL | directly supports | does not support | verifiedAt | risk |
|---|---|---|---|---|---|---|---|
| `equity-unesco-2020` | UNESCO, *Global Education Monitoring Report 2020: Inclusion and Education — All Means All* | authoritative institutional report | [UNESDOC](https://unesdoc.unesco.org/ark:/48223/pf0000373718), record 0000373718 | Inclusion/equity context; equality as state and equity as process in report framing; access, participation, learning, barriers, diversity, belonging; Ch. 1 pp. 10–12 | One “Educational Equity Theory,” one founder, one metric, or a universal causal mechanism | 2026-08-14 | Institutional report with global scope; its framing is not a universal philosophical settlement |

### Claim ledger

| claimId | fieldPath | current wording | exact proposed wording | nature | sources | locator | evidence / readiness / verdict | verifiedAt | forbidden extension |
|---|---|---|---|---|---|---|---|---|---|
| `d1-equity-definition` | `...content.en.what_is_it` | Umbrella over access, participation, treatment, resources, recognition, outcomes | “This page is an editorial orientation for questions of educational inclusion and equity. The checked UNESCO report treats equity as a process aimed at equality and inclusion as actions/practices that embrace diversity and belonging; it does not establish one canonical educational-equity theory.” | `editorial_synthesis` | `equity-unesco-2020` | Report Ch. 1, pp. 10–12 | `partially_supported` / `ready_for_human_review` / **FAIL** | 2026-08-14 | Current multi-dimension list exceeds the one checked locator |
| `d1-equity-origins` | `...content.en.origins` | Institutional reports plus distinct philosophical traditions | “The checked UNESCO report supplies an institutional inclusion/equity orientation. Any capability, redistribution, recognition, or representation route must be attached to a separately verified philosophical source.” | `editorial_synthesis` | `equity-unesco-2020` | Ch. 1, pp. 10–12 | `partially_supported` / `ready_for_human_review` / **FAIL** | 2026-08-14 | Sen and Fraser substantive wording was not reverified today |
| `d1-equity-nature` | `...content.en.theory_nature.explanation` | No single founder/theory/criterion/causal account | Retain exactly as an editorial boundary. | `editorial_synthesis` | `equity-unesco-2020` | Report identity and multiple process/outcome dimensions | `pending_review` / `ready_for_human_review` / **PASS** | 2026-08-14 | Absence of a claim in one report is not proof no theory exists; wording is page-scope policy |
| `d1-equity-inclusion` | `...content.en.core_concepts[0].definition` | “Ways learners may be enabled or prevented from entering and participating...” | “In the checked report, inclusion is both process and state, involving actions and practices that embrace diversity and build belonging; education exclusion can be physical, social, psychological, or systemic.” | `source_backed_fact` | `equity-unesco-2020` | Ch. 1, pp. 11–18 | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Do not generalize report categories into a causal model |
| `d1-equity-misuse` | `...content.en.misuse_risks[0]` | Must name unit, population, comparator, dimension, normative basis | Retain and label as conditional research guidance; add “and distinguish observed inequality from its proposed cause.” | `research_guidance` | `equity-unesco-2020` | Report separates access, participation, learning, governance, finance, curricula, teachers, schools | `pending_review` / `ready_for_human_review` / **PASS** | 2026-08-14 | Not one universally correct equity criterion |

### Exact proposal and conclusion

```typescript
const equityUnesco2020: ContentSource = { id: "equity-unesco-2020", citation: "UNESCO. (2020). Global Education Monitoring Report 2020: Inclusion and Education — All Means All.", url: "https://unesdoc.unesco.org/ark:/48223/pf0000373718", source_kind: "authoritative_web", evidence_level: "L1", supports: ["Chapter 1 supports the report's equality/equity distinction, inclusion as process and state, diversity and belonging, and physical, social, psychological, and systemic exclusion scope."] };
```

Conclusion: **3 PASS / 2 FAIL / 0 BLOCKED; 5/5 exact current-or-replacement proposals evidence-ready. D1 remains an editorial umbrella.**

## 10. D1 — `institutional-theory`

### User question, depth, and boundary

Can the page orient an organisational neo-institutionalist question about rationalised rules, legitimacy, formal structure, fields, isomorphism, and possible decoupling without treating every context as institutional? Paths: `what_is_it`, `origins`, `core_concepts[0]`, `core_concepts[2]`, `misuse_risks[0]`.

### Source register

| source ID | identity / author | source type | stable identifier / URL | directly supports | does not support | verifiedAt | risk |
|---|---|---|---|---|---|---|---|
| `institutional-meyer-rowan-1977` | John W. Meyer & Brian Rowan, “Institutionalized Organizations: Formal Structure as Myth and Ceremony,” *AJS* 83(2), 340–363 | journal / primary article | [DOI](https://doi.org/10.1086/226550) | Rationalised institutional rules; legitimacy/resources/stability; isomorphism with myths; formal structures decoupled from ongoing activities | Every organisation, every formal-practice gap, or all institutional theory | 2026-08-14 | Public abstract only |
| `institutional-dimaggio-powell-1983` | Paul J. DiMaggio & Walter W. Powell, “The Iron Cage Revisited,” *ASR* 48(2), 147–160 | journal / primary article identity | [JSTOR](https://www.jstor.org/stable/2095101), DOI 10.2307/2095101 | Article identity, organisational fields and institutional isomorphism as named subject | Exact coercive/mimetic/normative mechanisms without article-text locator | 2026-08-14 | JSTOR issue/identity and title only in this run |

### Claim ledger

| claimId | fieldPath | current wording | exact proposed wording | nature | sources | locator | evidence / readiness / verdict | verifiedAt | boundary |
|---|---|---|---|---|---|---|---|---|---|
| `d1-institutional-definition` | `...content.en.what_is_it` | Family; D1 anchors organisational neo-institutionalism | Retain, replacing “shape ... practices” with “can shape formal structures and their relation to ongoing activities.” | `editorial_synthesis` | `institutional-meyer-rowan-1977`; `institutional-dimaggio-powell-1983` | Meyer/Rowan Abstract; DiMaggio/Powell article identity | `partially_supported` / `ready_for_human_review` / **PASS** | 2026-08-14 | Do not present this strand as all institutional theory |
| `d1-institutional-origins` | `...content.en.origins` | Meyer/Rowan plus DiMaggio/Powell core orientation | Retain only those two clauses; defer Barley/Tolbert bridge until separately reverified. | `source_backed_fact` | `institutional-meyer-rowan-1977`; `institutional-dimaggio-powell-1983` | Abstract / JSTOR issue record | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | No genealogy or integration claim |
| `d1-institutional-rules` | `...content.en.core_concepts[0].definition` | “Taken-for-granted or rationalised rules that can shape formal organisational arrangements.” | “Rationalised institutional rules can be reflected in formal organisational structures.” | `source_backed_fact` | `institutional-meyer-rowan-1977` | Abstract, sentences 1–3 | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | “Taken-for-granted” not promoted without text locator |
| `d1-institutional-decoupling` | `...content.en.core_concepts[2].definition` | Formal structures may be separated from ongoing activity | “In Meyer and Rowan's account, structures can be decoupled from one another and from ongoing activities while organisations maintain legitimacy.” | `source_backed_fact` | `institutional-meyer-rowan-1977` | Abstract, final sentences | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | A document-practice gap alone does not diagnose decoupling |
| `d1-institutional-misuse` | `...content.en.misuse_risks[0]` | “Calling all context institutional or treating a named organisation as the entire field.” | Retain as bounded editorial safeguard and require evidence of institutional rule, legitimacy relation, organisational field, or specified mechanism. | `research_guidance` | `institutional-meyer-rowan-1977`; `institutional-dimaggio-powell-1983` | Source scopes | `pending_review` / `ready_for_human_review` / **PASS** | 2026-08-14 | Not an empirical claim by either article |

### Exact proposal and conclusion

```typescript
const institutionalMeyerRowan1977: ContentSource = { id: "institutional-meyer-rowan-1977", citation: "Meyer, J. W., & Rowan, B. (1977). Institutionalized organizations: Formal structure as myth and ceremony. American Journal of Sociology, 83(2), 340–363.", url: "https://doi.org/10.1086/226550", source_kind: "doi", evidence_level: "L1", supports: ["The public abstract supports rationalised institutional rules, legitimacy/resources/stability, isomorphic formal structure, and decoupling from ongoing activities."] };
const institutionalDiMaggioPowell1983: ContentSource = { id: "institutional-dimaggio-powell-1983", citation: "DiMaggio, P. J., & Powell, W. W. (1983). The iron cage revisited: Institutional isomorphism and collective rationality in organizational fields. American Sociological Review, 48(2), 147–160.", url: "https://www.jstor.org/stable/2095101", source_kind: "journal", evidence_level: "L1", supports: ["JSTOR verifies article identity, authors, journal, pages, organisational fields, and institutional isomorphism as the article's named subject."] };
```

Conclusion: **5 PASS / 0 FAIL / 0 BLOCKED; 5/5 evidence-ready for human review. D1 orientation only.**

## 11. D1 — `street-level-bureaucracy`

### User question, depth, and boundary

Does the research concern frontline public-service implementation through client interaction and consequential discretion under identifiable organisational conditions? D1 must distinguish implementation from agenda setting and discretion from moral judgment. Paths: `what_is_it`, `origins`, `core_concepts[0]`, `core_concepts[1]`, `misuse_risks[0]`.

### Source register

| source ID | identity / author | source type | stable identifier / URL | directly supports | does not support | verifiedAt | risk |
|---|---|---|---|---|---|---|---|
| `street-lipsky-2010` | Michael Lipsky, *Street-Level Bureaucracy* (30th anniversary expanded ed., 2010; original 1980) | publisher / primary-work record | [Russell Sage Foundation](https://www.russellsage.org/publications/book/street-level-bureaucracy), ISBN 9780871545442 | Frontline public workers; direct public interaction; discretion; huge caseloads, ambiguous goals, inadequate resources; routines/simplifications; policy adaptation | Discretion as necessarily good/bad, all workers, or agenda setting | 2026-08-14 | Rich publisher description, not full book |
| `street-lipsky-1998-ojp` | Michael Lipsky, “Toward a Theory of Street-Level Bureaucracy,” reprint record | government abstract / primary-work record | [U.S. Office of Justice Programs](https://www.ojp.gov/ncjrs/virtual-library/abstracts/toward-theory-street-level-bureaucracy-criminal-justice-system), NCJ 185993 | Public employees interacting with non-voluntary clients; discretion; inadequate resources; contested authority; contradictory/ambiguous expectations | Generalisation to every service or jurisdiction | 2026-08-14 | OJP annotation/abstract of a reprint, not full essay |

### Claim ledger

| claimId | fieldPath | current wording | exact proposed wording | nature | sources | locator | evidence / readiness / verdict | verifiedAt | boundary |
|---|---|---|---|---|---|---|---|---|---|
| `d1-street-definition` | `...content.en.what_is_it` | Frontline public workers implement policy via case interaction/discretion under constraints | Retain exactly. | `editorial_synthesis` | `street-lipsky-2010`; `street-lipsky-1998-ojp` | Russell Sage About This Book; OJP Annotation/Abstract | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Not all service work or agenda setting |
| `d1-street-origins` | `...content.en.origins` | Direct interaction, discretion, inadequate resources, authority, ambiguous goals, routines, delivered policy | Retain only the Lipsky clauses; remove later-combination clause from this row until those sources are separately checked. | `source_backed_fact` | `street-lipsky-2010`; `street-lipsky-1998-ojp` | Named descriptions/abstracts | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Do not claim every condition is present in every setting |
| `d1-street-workers` | `...content.en.core_concepts[0].definition` | Frontline public-service workers interacting directly with clients in implementation | “Public employees who interact directly with clients in delivering public programmes and exercise consequential case-level discretion.” | `editorial_synthesis` | `street-lipsky-2010`; `street-lipsky-1998-ojp` | Russell Sage paras. 2–3; OJP Annotation | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | OJP “non-voluntary clients” is context-specific, not universal |
| `d1-street-discretion` | `...content.en.core_concepts[1].definition` | “Judgement exercised in applying policy to cases.” | Retain and append “under identifiable resource, authority, goal, and workload conditions.” | `editorial_synthesis` | `street-lipsky-2010`; `street-lipsky-1998-ojp` | Russell Sage/OJP | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Not equivalent to autonomy, bias, resistance, innovation, or misconduct |
| `d1-street-misuse` | `...content.en.misuse_risks[0]` | Do not label every teacher/platform/service worker by service role alone | Retain as conditional scope safeguard; require public-policy delivery, client interaction, consequential discretion, and organisational conditions. | `research_guidance` | `street-lipsky-2010`; `street-lipsky-1998-ojp` | Source-defined scope | `pending_review` / `ready_for_human_review` / **PASS** | 2026-08-14 | Requires jurisdiction and service-setting review |

### Exact proposal and conclusion

```typescript
const streetLipsky2010: ContentSource = { id: "street-lipsky-2010", citation: "Lipsky, M. (2010). Street-Level Bureaucracy: Dilemmas of the Individual in Public Services (30th anniversary expanded ed.). Russell Sage Foundation.", url: "https://www.russellsage.org/publications/book/street-level-bureaucracy", source_kind: "publisher", evidence_level: "L1", supports: ["Publisher description supports frontline public-service implementation, direct public interaction, discretion, caseloads, ambiguous goals, inadequate resources, routines, simplifications, and policy adaptation."] };
const streetLipskyOjp1998: ContentSource = { id: "street-lipsky-1998-ojp", citation: "Lipsky, M. (1998). Toward a Theory of Street-Level Bureaucracy. U.S. Office of Justice Programs record, NCJ 185993.", url: "https://www.ojp.gov/ncjrs/virtual-library/abstracts/toward-theory-street-level-bureaucracy-criminal-justice-system", source_kind: "authoritative_web", evidence_level: "L1", supports: ["OJP annotation and abstract support direct client interaction, discretion, inadequate resources, contested authority, and contradictory or ambiguous expectations in the stated setting."] };
```

Conclusion: **5 PASS / 0 FAIL / 0 BLOCKED; 5/5 evidence-ready. D1 orientation only.**

## 12. D1 — `multiple-streams-framework`

### User question, depth, and boundary

Is the research about how issues gain agenda attention and how problems, proposals, politics, actors, timing, and windows become coupled, with explicit jurisdiction/stage limits? D1 is an analytical framework orientation, not an all-stage causal law. Paths: `what_is_it`, `origins`, `core_concepts[0..3]`, `theory_nature.explanation`, `misuse_risks[0]`.

### Source register

| source ID | identity / author | source type | stable identifier / URL | directly supports | does not support | verifiedAt | risk |
|---|---|---|---|---|---|---|---|
| `msf-kingdon-pearson` | John W. Kingdon, *Agendas, Alternatives, and Public Policies*, updated second-edition Pearson record | publisher / primary-work record | [Pearson](https://www.pearson.com/en-gb/subject-catalog/p/kingdon-agendas-alternatives-and-public-policies-update-edition-with-an-epilogue-on-health-care-pearson-new-international-edition-2nd-edition/P200000004628?view=educator) | U.S. federal agenda setting; officials' attention; alternatives; problems, policy, politics; policy windows; actors and methods | Universal portability, complete implementation theory, or any precise 2011-vs-2013 edition claim | 2026-08-14 | Pearson page labels publication 2013/©2014; current corpus citation says 2011 — edition metadata conflict |
| `msf-herweg-etal-2022` | Nicole Herweg, Nikolaos Zahariadis & Reimut Zohlnhöfer, “Travelling Far and Wide?” *Politische Vierteljahresschrift* 63, 203–223 | peer-reviewed open-access article | [Springer](https://link.springer.com/article/10.1007/s11615-022-00393-8), DOI 10.1007/s11615-022-00393-8 | Timing/ambiguity; U.S. agenda-setting origin; policy entrepreneurs, ideas, problems, policy windows/coupling; transfer questions across systems/stages | Automatic portability or a universal three-stream recipe | 2026-08-14 | Open full text; article itself discusses extensions and refinements, so boundary wording must not claim MSF can never apply beyond agenda setting |

### Claim ledger

| claimId | fieldPath | current wording | exact proposed wording | nature | sources | locator | evidence / readiness / verdict | verifiedAt | boundary |
|---|---|---|---|---|---|---|---|---|---|
| `d1-msf-definition` | `...content.en.what_is_it` | Analytical policy-process framework; streams, entrepreneurs, windows; not universal law/complete implementation theory | Retain, replacing “policy choice” with “agenda setting and, where separately justified, later policy stages.” | `editorial_synthesis` | `msf-kingdon-pearson`; `msf-herweg-etal-2022` | Pearson Title overview; Herweg et al. Abstract and §2 | `partially_supported` / `ready_for_human_review` / **PASS** | 2026-08-14 | Do not categorically prohibit later-stage extensions; require justification |
| `d1-msf-origins` | `...content.en.origins` | Kingdon U.S. federal orientation; later refinements/limits | Retain exactly; separate edition metadata from theory history. | `source_backed_fact` | `msf-kingdon-pearson`; `msf-herweg-etal-2022` | Pearson overview; Herweg et al. Abstract/§1–2 | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Do not persist the 2011 date from the current citation without edition reconciliation |
| `d1-msf-streams` | `...content.en.core_concepts[0..3]` | Problem, policy, politics, window/coupling | “The framework distinguishes problems, policy ideas/proposals, and political circumstances; policy entrepreneurs may couple proposals to problems at favourable policy windows.” | `editorial_synthesis` | `msf-kingdon-pearson`; `msf-herweg-etal-2022` | Pearson TOC/overview; Herweg et al. §2 | `verified` / `ready_for_human_review` / **PASS** | 2026-08-14 | Streams are not retrospective labels inferred only from outcome |
| `d1-msf-scope` | `...content.en.theory_nature.explanation` | Bounded framework; dated evidence; no retrospective three-factor story | Retain, changing “not an all-stage implementation model” to “does not by itself supply a complete implementation model; extensions to later stages require explicit theoretical justification.” | `research_guidance` | `msf-herweg-etal-2022` | Abstract and §1 | `pending_review` / `ready_for_human_review` / **PASS** | 2026-08-14 | The article documents later-stage applications; avoid false exclusivity |
| `d1-msf-misuse` | `...content.en.misuse_risks[0]` | Do not name streams only after outcome without tracing development | Retain and require dated actors, evidence, stream development, jurisdiction, stage, and coupling event. | `research_guidance` | `msf-kingdon-pearson`; `msf-herweg-etal-2022` | Source scopes and Herweg et al. §2 | `pending_review` / `ready_for_human_review` / **PASS** | 2026-08-14 | Not a universal process-tracing protocol |

### Exact proposal and conclusion

```typescript
const msfKingdonPearson: ContentSource = { id: "msf-kingdon-pearson", citation: "Kingdon, J. W. Agendas, Alternatives, and Public Policies, updated second edition. Pearson edition metadata requires reconciliation before persistence.", url: "https://www.pearson.com/en-gb/subject-catalog/p/kingdon-agendas-alternatives-and-public-policies-update-edition-with-an-epilogue-on-health-care-pearson-new-international-edition-2nd-edition/P200000004628?view=educator", source_kind: "publisher", evidence_level: "L1", supports: ["Publisher overview supports the U.S. federal agenda-setting problem, officials' attention, alternatives, problems, policies, politics, policy windows, actors, and research-method orientation."] };
const msfHerweg2022: ContentSource = { id: "msf-herweg-etal-2022", citation: "Herweg, N., Zahariadis, N., & Zohlnhöfer, R. (2022). Travelling far and wide? Applying the Multiple Streams Framework to policy-making in autocracies. Politische Vierteljahresschrift, 63, 203–223.", url: "https://doi.org/10.1007/s11615-022-00393-8", source_kind: "doi", evidence_level: "L1", supports: ["The open article supports timing and ambiguity, U.S. agenda-setting origin, policy ideas, problems, entrepreneurs, policy windows/coupling, later-stage applications, and the need to theorise cross-system transfer."] };
```

Conclusion: **5 PASS / 0 FAIL / 0 BLOCKED; 5/5 evidence-ready. Edition metadata reconciliation is mandatory before persisting the Pearson source.**

## 13. Consolidated exact corpus proposal

The actual `ContentSource` contract in `src/data/templates/theory-template.ts` permits only `evidence_level: "L1"`; L2/L3 belong in claim verification metadata, not `ContentSource`. If implementation is later authorized:

1. Reuse or replace source IDs exactly as proposed above; do not retain stale `supports` strings that say only “bibliographic record” when the reproduced public locator supports a narrower substantive statement.
2. Apply only the exact field replacements in the ten claim ledgers.
3. Omit the four BLOCKED rows: `d2-struct-duality`, `d2-struct-recursive-mechanism`, `d2-practice-field-mechanism`, `d1-life-history-memory`.
4. Do not persist `verifiedAt` on any legacy row merely because this report has a 2026-08-14 file date. Each future corpus verification must map to a source actually checked here and the exact locator/wording approved by a human.
5. Leave every `reviewDecision` as `pending_review`; reviewer identity/role/date remain absent until an authorized human records them.
6. Reconcile the Pearson/Kingdon edition identity before adding or updating that source.

## 14. Frozen candidate package and input hashes

Candidate manifest, hashed exactly as newline-delimited `D<depth>:<slug>` rows in the order below:

```text
D2:structuration-theory
D2:communities-of-practice
D2:practice-theory-bourdieu
D2:social-capital-theory
D1:teacher-professional-development-theory
D1:teacher-life-history-research
D1:educational-equity-theory
D1:institutional-theory
D1:street-level-bureaucracy
D1:multiple-streams-framework
```

- Fixed candidate manifest sha256: `d3430972e946e5f6100d79c4b401098a9bc46bbbf4f8b3dc69b398b81c518a3f`.
- `docs/roadmaps/2026-07-13-d1-theory-foundations.md`: `1dc5a7d9c781cbe6f15a63bbd87b2a18b55d9ef13065a7df8cac0944fd66505c`.
- `docs/roadmaps/2026-07-13-d2-theory-deepening.md`: `c567674cc228b01b567aaa2a3bb1b7d4af46c03077bc920aeb0c992051ae5113`.
- `docs/research/2026-07-13-c3-structuration-communities.md`: `a4c476fb83af28b683bb0cecc333282b018f7870db15b6d924abe23297fb2beb`.
- `docs/research/2026-07-13-c3-practice-social-capital.md`: `a44b21a2d01b3d61a29551d0a58d2bfe45441cf10731716f276e96bfb63ba8dc`.
- `docs/research/2026-07-13-c4-d1-theories.md`: `9b79e0eb651089bf9f2e5896ef70aeb4c185f3fd02d44ad7c49f0183d6d20b51`.
- `docs/research/independent-review/2026-08-14-d3-and-genealogy-independent-review.md`: `21ecf30346a4599b69c3a45aa625294d0fc3e4e4902cc6765637e9e6fbecfc1c`.
- `src/data/corpus/shared/entities.ts`: `61fbc2e1528794313f6c6f9066958266a123d859e1d097ad4e3aea47a3b9d730`.
- `src/data/templates/theory-template.ts`: `7f33d4444ec88ad6ba5ce3b6dbb836961b9d399264ce955a1d384381b74e602e`.

## 15. Verification commands and publication boundary

Planned/used commands:

```bash
git branch --show-current
git rev-parse HEAD
git status --short --branch --untracked-files=all
shasum -a 256 <the eight frozen input files>
printf '%s\n' <the ten manifest rows> | shasum -a 256
rg -n 'structuration-theory|communities-of-practice|practice-theory-bourdieu|social-capital-theory|teacher-professional-development-theory|teacher-life-history-research|educational-equity-theory|institutional-theory|street-level-bureaucracy|multiple-streams-framework' <frozen inputs>
node --experimental-strip-types --input-type=module -e '<read-only seedCorpus field extraction>'
node <report integrity checker: source IDs, claim totals, verdict totals, verifiedAt rules>
git diff --no-index --check /dev/null docs/research/2026-08-14-d1-d2-theory-consolidated-evidence-pack.md
```

`npm run content:check`, typecheck, unit tests, lint, build, database, and E2E are not required for this research-only Markdown addition and were not run. No corpus or runtime code changed.

Publication boundary: the report must not be rendered as public content, indexed, added to sitemap/search/graph, seeded, or used to change any entity status. PASS is not human approval. Research completion, human review, corpus implementation, local verification, commit, publication, and deployment remain separate gates.

## 16. Final disposition

- Pages assessed: **10/10**.
- Claim rows: **50**.
- Current verdicts: **PASS 41 / FAIL 5 / BLOCKED 4**.
- Exact evidence-ready current-or-replacement proposals: **46/50**.
- Human review decisions: **0/50 assigned**.
- Corpus implementation: **not authorized / not performed**.
- Commit, publication, deployment: **not authorized / not performed**.
- Required next owner action: assign an independent subject/methods reviewer to decide the 46 evidence-ready rows and commission lawful original-text locator work for the four BLOCKED rows. Only after row-level decisions may a separate implementation issue define an exact file/field allowlist.
