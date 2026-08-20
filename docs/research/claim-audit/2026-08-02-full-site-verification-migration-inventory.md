# Full-site verification migration inventory

Status: corrected fixed audit inventory. This document records queues and blockers only; it does not grant human approval, corpus implementation, publication, or public-verification status.

## Baseline, cohort, and method

The cohort is the 74 entities whose authored corpus status is `published` on 2026-08-02. Draft scholars and the separate Topic review ledger are excluded.

| Type | Published entities | Embedded L1 | Embedded L2 | Legacy L3 |
|---|---:|---:|---:|---:|
| discipline | 2 | 2 | 2 | 2 |
| field | 6 | 6 | 6 | 6 |
| theory | 12 | 17 | 12 | 12 |
| scholar | 7 | 7 | 7 | 7 |
| work | 19 | 19 | 19 | 19 |
| concept | 24 | 24 | 24 | 24 |
| topic | 4 | 4 | 4 | 4 |
| **Total** | **74** | **79** | **74** | **74** |

The 79 embedded L1 rows have: locator missing 79/79; reviewer missing 79/79; `verifiedAt` missing 76/79; explicit authored source-check dates 3/79; native stable `claimId` 0/79. The date counts do not change the locator or human-review blockers.

Path aliases used below are exact repository files:

- `S` = `src/data/corpus/shared/entities.ts`
- `E` = `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts`

## Complete 79-row embedded L1 migration queue

| Audit ID | Type | Slug | Exact verification storage path | Source ID | Locator | verifiedAt | Reviewer | Priority | Blocker |
|---|---|---|---|---|---|---|---|---|---|
| L1-001 | discipline | education | `S :: disciplines[slug=education].content.en.verification[L1:unesco-education]` | unesco-education | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-002 | discipline | sociology | `S :: disciplines[slug=sociology].content.en.verification[L1:struct-giddens-1984]` | struct-giddens-1984 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-003 | field | teacher-education-professional-development | `S :: fields[slug=teacher-education-professional-development].content.en.verification[L1:teacher-development-clarke-hollingsworth-2002]` | teacher-development-clarke-hollingsworth-2002 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-004 | field | rural-remote-education | `S :: fields[slug=rural-remote-education].content.en.verification[L1:unesco-education]` | unesco-education | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-005 | field | educational-equity-policy | `S :: fields[slug=educational-equity-policy].content.en.verification[L1:unesco-2020-inclusion-education]` | unesco-2020-inclusion-education | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-006 | field | life-course-aging-studies | `S :: fields[slug=life-course-aging-studies].content.en.verification[L1:elder-1998-life-course]` | elder-1998-life-course | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-007 | field | sociology-of-education | `S :: fields[slug=sociology-of-education].content.en.verification[L1:coleman-1988-social-capital]` | coleman-1988-social-capital | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-008 | field | organizational-sociology | `S :: fields[slug=organizational-sociology].content.en.verification[L1:struct-giddens-1984]` | struct-giddens-1984 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-009 | theory | life-course-theory | `S :: theories[slug=life-course-theory].content.en.verification[L1:elder-johnson-crosnoe-2003-life-course]` | elder-johnson-crosnoe-2003-life-course | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-010 | theory | life-course-theory | `S :: theories[slug=life-course-theory].content.en.verification[L1:mayer-2009-new-directions]` | mayer-2009-new-directions | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-011 | theory | life-course-theory | `S :: theories[slug=life-course-theory].content.en.verification[L1:elder-1996-human-lives-changing-societies]` | elder-1996-human-lives-changing-societies | missing | 2026-07-20 | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-012 | theory | life-course-theory | `S :: theories[slug=life-course-theory].content.en.verification[L1:elder-2000-life-course-theory-encyclopedia]` | elder-2000-life-course-theory-encyclopedia | missing | 2026-07-20 | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-013 | theory | life-course-theory | `S :: theories[slug=life-course-theory].content.en.verification[L1:elder-1999-children-of-the-great-depression-25th]` | elder-1999-children-of-the-great-depression-25th | missing | 2026-07-21 | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-014 | theory | teacher-identity-theory | `S :: theories[slug=teacher-identity-theory].content.en.verification[L1:beijaard-meijer-verloop-2004-identity]` | beijaard-meijer-verloop-2004-identity | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-015 | theory | teacher-identity-theory | `S :: theories[slug=teacher-identity-theory].content.en.verification[L1:kelchtermans-2009-teacher-identity]` | kelchtermans-2009-teacher-identity | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-016 | theory | structuration-theory | `S :: theories[slug=structuration-theory].content.en.verification[L1:struct-giddens-1984]` | struct-giddens-1984 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-017 | theory | communities-of-practice | `S :: theories[slug=communities-of-practice].content.en.verification[L1:cop-wenger-1998]` | cop-wenger-1998 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-018 | theory | practice-theory-bourdieu | `S :: theories[slug=practice-theory-bourdieu].content.en.verification[L1:practice-logic-1990]` | practice-logic-1990 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-019 | theory | social-capital-theory | `S :: theories[slug=social-capital-theory].content.en.verification[L1:social-portes-1998]` | social-portes-1998 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-020 | theory | teacher-professional-development-theory | `S :: theories[slug=teacher-professional-development-theory].content.en.verification[L1:teacher-development-guskey-2002]` | teacher-development-guskey-2002 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-021 | theory | teacher-life-history-research | `S :: theories[slug=teacher-life-history-research].content.en.verification[L1:teacher-life-history-josselson-2007]` | teacher-life-history-josselson-2007 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-022 | theory | educational-equity-theory | `S :: theories[slug=educational-equity-theory].content.en.verification[L1:unesco-2020-inclusion-education]` | unesco-2020-inclusion-education | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-023 | theory | institutional-theory | `S :: theories[slug=institutional-theory].content.en.verification[L1:institutional-barley-tolbert-1997]` | institutional-barley-tolbert-1997 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-024 | theory | street-level-bureaucracy | `S :: theories[slug=street-level-bureaucracy].content.en.verification[L1:lipsky-2010-street-level-bureaucracy]` | lipsky-2010-street-level-bureaucracy | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-025 | theory | multiple-streams-framework | `S :: theories[slug=multiple-streams-framework].content.en.verification[L1:msf-herweg-etal-2022]` | msf-herweg-etal-2022 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-026 | scholar | glen-h-elder-jr | `S :: scholars[slug=glen-h-elder-jr].content.en.verification[L1:elder-sage-author-profile]` | elder-sage-author-profile | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-027 | scholar | geert-kelchtermans | `S :: scholars[slug=geert-kelchtermans].content.en.verification[L1:kelchtermans-ku-leuven-profile]` | kelchtermans-ku-leuven-profile | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-028 | scholar | anthony-giddens | `S :: scholars[slug=anthony-giddens].content.en.verification[L1:giddens-lse-profile]` | giddens-lse-profile | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-029 | scholar | pierre-bourdieu | `S :: scholars[slug=pierre-bourdieu].content.en.verification[L1:bourdieu-college-france-profile]` | bourdieu-college-france-profile | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-030 | scholar | jean-lave | `E :: scholars[slug=jean-lave].content.en.verification[L1:lave-lchc-profile]` | lave-lchc-profile | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-031 | scholar | etienne-wenger | `E :: scholars[slug=etienne-wenger].content.en.verification[L1:wenger-uoc-profile]` | wenger-uoc-profile | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-032 | scholar | michael-lipsky | `E :: scholars[slug=michael-lipsky].content.en.verification[L1:lipsky-harvard-kennedy-profile]` | lipsky-harvard-kennedy-profile | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-033 | work | elder-1998-life-course | `S :: works[slug=elder-1998-life-course].content.en.verification[L1:elder-1998-life-course]` | elder-1998-life-course | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-034 | work | beijaard-meijer-verloop-2004-identity | `S :: works[slug=beijaard-meijer-verloop-2004-identity].content.en.verification[L1:beijaard-meijer-verloop-2004-identity]` | beijaard-meijer-verloop-2004-identity | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-035 | work | kelchtermans-2009-teacher-identity | `S :: works[slug=kelchtermans-2009-teacher-identity].content.en.verification[L1:kelchtermans-2009-teacher-identity]` | kelchtermans-2009-teacher-identity | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-036 | work | struct-giddens-1984 | `S :: works[slug=struct-giddens-1984].content.en.verification[L1:struct-giddens-1984]` | struct-giddens-1984 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-037 | work | lave-wenger-1991-situated-learning | `S :: works[slug=lave-wenger-1991-situated-learning].content.en.verification[L1:lave-wenger-1991-situated-learning]` | lave-wenger-1991-situated-learning | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-038 | work | cop-wenger-1998 | `S :: works[slug=cop-wenger-1998].content.en.verification[L1:cop-wenger-1998]` | cop-wenger-1998 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-039 | work | bourdieu-1977-outline-practice | `S :: works[slug=bourdieu-1977-outline-practice].content.en.verification[L1:bourdieu-1977-outline-practice]` | bourdieu-1977-outline-practice | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-040 | work | practice-capital-1986 | `S :: works[slug=practice-capital-1986].content.en.verification[L1:practice-capital-1986]` | practice-capital-1986 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-041 | work | coleman-1988-social-capital | `S :: works[slug=coleman-1988-social-capital].content.en.verification[L1:coleman-1988-social-capital]` | coleman-1988-social-capital | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-042 | work | social-lin-2001 | `S :: works[slug=social-lin-2001].content.en.verification[L1:social-lin-2001]` | social-lin-2001 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-043 | work | day-1999-developing-teachers | `S :: works[slug=day-1999-developing-teachers].content.en.verification[L1:day-1999-developing-teachers]` | day-1999-developing-teachers | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-044 | work | teacher-development-clarke-hollingsworth-2002 | `S :: works[slug=teacher-development-clarke-hollingsworth-2002].content.en.verification[L1:teacher-development-clarke-hollingsworth-2002]` | teacher-development-clarke-hollingsworth-2002 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-045 | work | goodson-2013-narrative-theory | `S :: works[slug=goodson-2013-narrative-theory].content.en.verification[L1:goodson-2013-narrative-theory]` | goodson-2013-narrative-theory | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-046 | work | unesco-2020-inclusion-education | `S :: works[slug=unesco-2020-inclusion-education].content.en.verification[L1:unesco-2020-inclusion-education]` | unesco-2020-inclusion-education | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-047 | work | equity-sen-1992 | `S :: works[slug=equity-sen-1992].content.en.verification[L1:equity-sen-1992]` | equity-sen-1992 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-048 | work | dimaggio-powell-1983-iron-cage | `S :: works[slug=dimaggio-powell-1983-iron-cage].content.en.verification[L1:dimaggio-powell-1983-iron-cage]` | dimaggio-powell-1983-iron-cage | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-049 | work | institutional-meyer-rowan-1977 | `S :: works[slug=institutional-meyer-rowan-1977].content.en.verification[L1:institutional-meyer-rowan-1977]` | institutional-meyer-rowan-1977 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-050 | work | lipsky-2010-street-level-bureaucracy | `S :: works[slug=lipsky-2010-street-level-bureaucracy].content.en.verification[L1:lipsky-2010-street-level-bureaucracy]` | lipsky-2010-street-level-bureaucracy | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-051 | work | kingdon-1995-agendas-alternatives | `S :: works[slug=kingdon-1995-agendas-alternatives].content.en.verification[L1:kingdon-1995-agendas-alternatives-openlibrary]` | kingdon-1995-agendas-alternatives-openlibrary | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-052 | concept | trajectory | `S :: concepts[slug=trajectory].content.en.verification[L1:elder-1998-life-course]` | elder-1998-life-course | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-053 | concept | transition | `S :: concepts[slug=transition].content.en.verification[L1:elder-1998-life-course]` | elder-1998-life-course | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-054 | concept | turning-point | `S :: concepts[slug=turning-point].content.en.verification[L1:elder-1998-life-course]` | elder-1998-life-course | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-055 | concept | teacher-professional-identity | `S :: concepts[slug=teacher-professional-identity].content.en.verification[L1:beijaard-meijer-verloop-2004-identity]` | beijaard-meijer-verloop-2004-identity | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-056 | concept | teacher-self-understanding | `S :: concepts[slug=teacher-self-understanding].content.en.verification[L1:kelchtermans-2009-teacher-identity]` | kelchtermans-2009-teacher-identity | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-057 | concept | duality-of-structure | `S :: concepts[slug=duality-of-structure].content.en.verification[L1:struct-giddens-1984]` | struct-giddens-1984 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-058 | concept | rules-and-resources | `S :: concepts[slug=rules-and-resources].content.en.verification[L1:struct-giddens-1984]` | struct-giddens-1984 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-059 | concept | recursive-practice | `S :: concepts[slug=recursive-practice].content.en.verification[L1:struct-giddens-1984]` | struct-giddens-1984 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-060 | concept | legitimate-peripheral-participation | `S :: concepts[slug=legitimate-peripheral-participation].content.en.verification[L1:lave-wenger-1991-situated-learning]` | lave-wenger-1991-situated-learning | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-061 | concept | mutual-engagement | `S :: concepts[slug=mutual-engagement].content.en.verification[L1:cop-wenger-1998]` | cop-wenger-1998 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-062 | concept | shared-repertoire | `S :: concepts[slug=shared-repertoire].content.en.verification[L1:cop-wenger-1998]` | cop-wenger-1998 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-063 | concept | habitus | `S :: concepts[slug=habitus].content.en.verification[L1:bourdieu-1977-outline-practice]` | bourdieu-1977-outline-practice | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-064 | concept | field | `S :: concepts[slug=field].content.en.verification[L1:bourdieu-1977-outline-practice]` | bourdieu-1977-outline-practice | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-065 | concept | capital-conversion | `S :: concepts[slug=capital-conversion].content.en.verification[L1:practice-capital-1986]` | practice-capital-1986 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-066 | concept | symbolic-power | `S :: concepts[slug=symbolic-power].content.en.verification[L1:practice-symbolic-power-1979]` | practice-symbolic-power-1979 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-067 | concept | relational-resource-access | `S :: concepts[slug=relational-resource-access].content.en.verification[L1:social-lin-2001]` | social-lin-2001 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-068 | concept | obligation-and-reciprocity | `S :: concepts[slug=obligation-and-reciprocity].content.en.verification[L1:coleman-1988-social-capital]` | coleman-1988-social-capital | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-069 | concept | professional-learning | `S :: concepts[slug=professional-learning].content.en.verification[L1:teacher-development-clarke-hollingsworth-2002]` | teacher-development-clarke-hollingsworth-2002 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-070 | concept | life-history | `S :: concepts[slug=life-history].content.en.verification[L1:goodson-2013-narrative-theory]` | goodson-2013-narrative-theory | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-071 | concept | educational-equity | `S :: concepts[slug=educational-equity].content.en.verification[L1:unesco-2020-inclusion-education]` | unesco-2020-inclusion-education | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-072 | concept | institutional-isomorphism | `S :: concepts[slug=institutional-isomorphism].content.en.verification[L1:dimaggio-powell-1983-iron-cage]` | dimaggio-powell-1983-iron-cage | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-073 | concept | decoupling | `S :: concepts[slug=decoupling].content.en.verification[L1:institutional-meyer-rowan-1977]` | institutional-meyer-rowan-1977 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-074 | concept | frontline-discretion | `S :: concepts[slug=frontline-discretion].content.en.verification[L1:lipsky-2010-street-level-bureaucracy]` | lipsky-2010-street-level-bureaucracy | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-075 | concept | streams-coupling-policy-window | `S :: concepts[slug=streams-coupling-policy-window].content.en.verification[L1:kingdon-1995-agendas-alternatives-openlibrary]` | kingdon-1995-agendas-alternatives-openlibrary | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-076 | topic | teachers-professional-identity-during-reform | `S :: topics[slug=teachers-professional-identity-during-reform].content.en.verification[L1:kelchtermans-2009-teacher-identity]` | kelchtermans-2009-teacher-identity | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-077 | topic | educational-transitions-over-time | `S :: topics[slug=educational-transitions-over-time].content.en.verification[L1:elder-1998-life-course]` | elder-1998-life-course | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-078 | topic | organizational-routines-and-structural-change | `S :: topics[slug=organizational-routines-and-structural-change].content.en.verification[L1:struct-giddens-1984]` | struct-giddens-1984 | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |
| L1-079 | topic | inequality-in-educational-and-social-fields | `S :: topics[slug=inequality-in-educational-and-social-fields].content.en.verification[L1:bourdieu-1977-outline-practice]` | bourdieu-1977-outline-practice | missing | missing | missing | P1/U1 | atomic claim ID, reproducible locator, and named reviewer required |

## Twelve theory-derived legacy database L1 rows

These are generated at `S :: verifications[entitySlug=<theory>, fieldPath=content_jsonb.en.sources]`. All retain storage level `L1_verified` with compatibility meaning `legacy_source_metadata`; none is `source_verified`, and all 12 page-field `verifiedAt` values are absent.

`life-course-theory`, `teacher-identity-theory`, `structuration-theory`, `communities-of-practice`, `practice-theory-bourdieu`, `social-capital-theory`, `teacher-professional-development-theory`, `teacher-life-history-research`, `educational-equity-theory`, `institutional-theory`, `street-level-bureaucracy`, and `multiple-streams-framework`.

## Complete 74-row legacy L3 mapping/classification queue

All rows currently identify only the stored legacy record. Atomic target mapping is `unmapped`; human classification is `unclassified`; counts are `research_guidance=0`, `insufficient_evidence=0`, and `unmapped/unclassified=74`.

| Audit ID | Type | Slug | Exact verification storage path | Atomic field | Human classification | Decision | Blocker |
|---|---|---|---|---|---|---|---|
| L3-001 | discipline | education | `S :: disciplines[slug=education].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-002 | discipline | sociology | `S :: disciplines[slug=sociology].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-003 | field | teacher-education-professional-development | `S :: fields[slug=teacher-education-professional-development].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-004 | field | rural-remote-education | `S :: fields[slug=rural-remote-education].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-005 | field | educational-equity-policy | `S :: fields[slug=educational-equity-policy].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-006 | field | life-course-aging-studies | `S :: fields[slug=life-course-aging-studies].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-007 | field | sociology-of-education | `S :: fields[slug=sociology-of-education].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-008 | field | organizational-sociology | `S :: fields[slug=organizational-sociology].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-009 | theory | life-course-theory | `S :: theories[slug=life-course-theory].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-010 | theory | teacher-identity-theory | `S :: theories[slug=teacher-identity-theory].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-011 | theory | structuration-theory | `S :: theories[slug=structuration-theory].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-012 | theory | communities-of-practice | `S :: theories[slug=communities-of-practice].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-013 | theory | practice-theory-bourdieu | `S :: theories[slug=practice-theory-bourdieu].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-014 | theory | social-capital-theory | `S :: theories[slug=social-capital-theory].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-015 | theory | teacher-professional-development-theory | `S :: theories[slug=teacher-professional-development-theory].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-016 | theory | teacher-life-history-research | `S :: theories[slug=teacher-life-history-research].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-017 | theory | educational-equity-theory | `S :: theories[slug=educational-equity-theory].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-018 | theory | institutional-theory | `S :: theories[slug=institutional-theory].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-019 | theory | street-level-bureaucracy | `S :: theories[slug=street-level-bureaucracy].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-020 | theory | multiple-streams-framework | `S :: theories[slug=multiple-streams-framework].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-021 | scholar | glen-h-elder-jr | `S :: scholars[slug=glen-h-elder-jr].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-022 | scholar | geert-kelchtermans | `S :: scholars[slug=geert-kelchtermans].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-023 | scholar | anthony-giddens | `S :: scholars[slug=anthony-giddens].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-024 | scholar | pierre-bourdieu | `S :: scholars[slug=pierre-bourdieu].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-025 | scholar | jean-lave | `E :: scholars[slug=jean-lave].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-026 | scholar | etienne-wenger | `E :: scholars[slug=etienne-wenger].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-027 | scholar | michael-lipsky | `E :: scholars[slug=michael-lipsky].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-028 | work | elder-1998-life-course | `S :: works[slug=elder-1998-life-course].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-029 | work | beijaard-meijer-verloop-2004-identity | `S :: works[slug=beijaard-meijer-verloop-2004-identity].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-030 | work | kelchtermans-2009-teacher-identity | `S :: works[slug=kelchtermans-2009-teacher-identity].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-031 | work | struct-giddens-1984 | `S :: works[slug=struct-giddens-1984].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-032 | work | lave-wenger-1991-situated-learning | `S :: works[slug=lave-wenger-1991-situated-learning].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-033 | work | cop-wenger-1998 | `S :: works[slug=cop-wenger-1998].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-034 | work | bourdieu-1977-outline-practice | `S :: works[slug=bourdieu-1977-outline-practice].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-035 | work | practice-capital-1986 | `S :: works[slug=practice-capital-1986].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-036 | work | coleman-1988-social-capital | `S :: works[slug=coleman-1988-social-capital].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-037 | work | social-lin-2001 | `S :: works[slug=social-lin-2001].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-038 | work | day-1999-developing-teachers | `S :: works[slug=day-1999-developing-teachers].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-039 | work | teacher-development-clarke-hollingsworth-2002 | `S :: works[slug=teacher-development-clarke-hollingsworth-2002].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-040 | work | goodson-2013-narrative-theory | `S :: works[slug=goodson-2013-narrative-theory].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-041 | work | unesco-2020-inclusion-education | `S :: works[slug=unesco-2020-inclusion-education].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-042 | work | equity-sen-1992 | `S :: works[slug=equity-sen-1992].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-043 | work | dimaggio-powell-1983-iron-cage | `S :: works[slug=dimaggio-powell-1983-iron-cage].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-044 | work | institutional-meyer-rowan-1977 | `S :: works[slug=institutional-meyer-rowan-1977].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-045 | work | lipsky-2010-street-level-bureaucracy | `S :: works[slug=lipsky-2010-street-level-bureaucracy].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-046 | work | kingdon-1995-agendas-alternatives | `S :: works[slug=kingdon-1995-agendas-alternatives].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-047 | concept | trajectory | `S :: concepts[slug=trajectory].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-048 | concept | transition | `S :: concepts[slug=transition].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-049 | concept | turning-point | `S :: concepts[slug=turning-point].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-050 | concept | teacher-professional-identity | `S :: concepts[slug=teacher-professional-identity].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-051 | concept | teacher-self-understanding | `S :: concepts[slug=teacher-self-understanding].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-052 | concept | duality-of-structure | `S :: concepts[slug=duality-of-structure].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-053 | concept | rules-and-resources | `S :: concepts[slug=rules-and-resources].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-054 | concept | recursive-practice | `S :: concepts[slug=recursive-practice].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-055 | concept | legitimate-peripheral-participation | `S :: concepts[slug=legitimate-peripheral-participation].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-056 | concept | mutual-engagement | `S :: concepts[slug=mutual-engagement].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-057 | concept | shared-repertoire | `S :: concepts[slug=shared-repertoire].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-058 | concept | habitus | `S :: concepts[slug=habitus].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-059 | concept | field | `S :: concepts[slug=field].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-060 | concept | capital-conversion | `S :: concepts[slug=capital-conversion].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-061 | concept | symbolic-power | `S :: concepts[slug=symbolic-power].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-062 | concept | relational-resource-access | `S :: concepts[slug=relational-resource-access].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-063 | concept | obligation-and-reciprocity | `S :: concepts[slug=obligation-and-reciprocity].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-064 | concept | professional-learning | `S :: concepts[slug=professional-learning].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-065 | concept | life-history | `S :: concepts[slug=life-history].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-066 | concept | educational-equity | `S :: concepts[slug=educational-equity].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-067 | concept | institutional-isomorphism | `S :: concepts[slug=institutional-isomorphism].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-068 | concept | decoupling | `S :: concepts[slug=decoupling].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-069 | concept | frontline-discretion | `S :: concepts[slug=frontline-discretion].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-070 | concept | streams-coupling-policy-window | `S :: concepts[slug=streams-coupling-policy-window].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-071 | topic | teachers-professional-identity-during-reform | `S :: topics[slug=teachers-professional-identity-during-reform].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-072 | topic | educational-transitions-over-time | `S :: topics[slug=educational-transitions-over-time].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-073 | topic | organizational-routines-and-structural-change | `S :: topics[slug=organizational-routines-and-structural-change].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |
| L3-074 | topic | inequality-in-educational-and-social-fields | `S :: topics[slug=inequality-in-educational-and-social-fields].content.en.verification[L3]` | unmapped | unclassified | none | atomic target mapping and human classification required |

### L3 visibility strategy comparison

| Strategy | Benefit | Risk / owner blocker | Current decision |
|---|---|---|---|
| Hide explicitly classified blocks | Narrowest control after atomic mapping | No row is mapped or classified; named human decisions are absent | pending owner decision |
| `noindex` affected pages | Page-level search containment | Overbroad for mixed-evidence pages; requires U3 owner authorization | pending owner decision |
| Unpublish affected pages | Strongest containment | Highest route, graph, and reader impact; requires U3 owner authorization | pending owner decision |

No visibility action is authorized.

## Separate nine-row Topic research-guidance review queue

These nine rows are not part of the 74-row L3 cohort. The actual review record is `docs/research/2026-07-26-teacher-professional-learning-and-change-human-review.md`, section 6. Its stable IDs link back to the exact corpus field paths in the review's stated R1 source, `docs/research/2026-07-23-teacher-professional-learning-and-change-r1.md`.

| Review ID | Exact corpus field path | Review record location | Status | Decision blocker |
|---|---|---|---|---|
| tplc-core-question-learning-process | `content.en.core_questions[0]` | human-review §6, `claim_id=tplc-core-question-learning-process` | pending_review | methods-aware row decision absent |
| tplc-core-question-change-evidence | `content.en.core_questions[1]` | human-review §6, `claim_id=tplc-core-question-change-evidence` | pending_review | methods-aware row decision absent |
| tplc-core-question-cop | `content.en.core_questions[2]` | human-review §6, `claim_id=tplc-core-question-cop` | pending_review | methods-aware row decision absent |
| tplc-selection-name-prompt | `content.en.selection_path[0].step/prompt` | human-review §6, `claim_id=tplc-selection-name-prompt` | pending_review | methods-aware row decision absent |
| tplc-selection-evidence-prompt | `content.en.selection_path[1].step/prompt` | human-review §6, `claim_id=tplc-selection-evidence-prompt` | pending_review | methods-aware row decision absent |
| tplc-pd-materials | `content.en.theory_pathways[0].data_materials` | human-review §6, `claim_id=tplc-pd-materials` | pending_review | methods-aware row decision absent |
| tplc-cop-materials | `content.en.theory_pathways[1].data_materials` | human-review §6, `claim_id=tplc-cop-materials` | pending_review | methods-aware row decision absent |
| tplc-identity-materials | `content.en.theory_pathways[2].data_materials` | human-review §6, `claim_id=tplc-identity-materials` | pending_review | methods-aware row decision absent |
| tplc-verification-l3 | `content.en.verification[2]` | human-review §6, `claim_id=tplc-verification-l3` | pending_review | methods-aware row decision absent |

The review record already names `oprah` as content reviewer, but every row above remains `pending_review` with blank decision fields. That header identity is not a row-level decision and is not converted into approval here.

## U0 bibliographic corrections

Accessed 2026-08-02:

- Kelchtermans 2009: [Crossref DOI record](https://api.crossref.org/works/10.1080/13540600902875332).
- Herweg, Zahariadis, and Zohlnhöfer 2018: [Crossref DOI record](https://api.crossref.org/works/10.4324/9780429494284-2) and [IUCAT catalogue record](https://iucat.iu.edu/iuk/19601473).

These checks support only the bounded bibliographic corrections, not surrounding interpretations.

## Three pending `founding_text` taxonomy rows

| Theory endpoint | Work endpoint | Current taxonomy | Evidence conclusion | Decision |
|---|---|---|---|---|
| life-course-theory | elder-1998-life-course | founding_text | Metadata supports the work's identity and contribution but does not establish it as the single founding text for the theory. | U2 pending |
| structuration-theory | struct-giddens-1984 | founding_text | The work is strongly supported as a core, complete statement of structuration, but the `founding_text` taxonomy still requires a human U2 decision. | U2 pending |
| institutional-theory | dimaggio-powell-1983-iron-cage | founding_text | The work's contribution is supported, but that does not make it the unique founding text for all Institutional Theory. | U2 pending |

No work–theory relation or taxonomy value is changed.

## Single next evidence package

`WP-EVIDENCE-NEXT-01` is limited to G04–G06:

1. G04 `teacher-identity-theory → teacher-professional-development-theory`;
2. G05 `practice-theory-bourdieu → social-capital-theory`;
3. G06 `practice-theory-bourdieu → institutional-theory`.

The package must produce relation-level source/locator evidence and named academic-review decisions. It must not modify relations, visibility, publication state, or database records.
