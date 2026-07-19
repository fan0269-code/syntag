# Scholar candidate evidence pack — Lave, Wenger, Lipsky, and Kingdon

**Scope and access date:** This evidence pack evaluates four candidate `Scholar` records against the existing published Education and Sociology theory corpus. All links below were accessed on **2026-07-18**. It is a publication-decision record, not a full biography, and it does not alter `src/data/seed-content.ts`.

## 1. Decision rule and corpus anchors

The C6 scholar rule requires: (1) an L1 identity or academic-positioning record from a university, academic institution, publisher, or authoritative archive; (2) an L1 primary-work record; and (3) a bounded relation to an existing Syntag theory entry. Work authorship alone is not evidence that a person solely founded a whole tradition.

| Candidate | Existing theory slug | Existing L1 work/source metadata | Recommended `TheoryScholar` role | Decision |
| --- | --- | --- | --- | --- |
| Jean Lave | `communities-of-practice` | `lave-wenger-1991-situated-learning` — Cambridge DOI | `key_contributor` | **publish** |
| Etienne Wenger | `communities-of-practice` | `lave-wenger-1991-situated-learning`; `cop-wenger-1998` — Cambridge DOI/publisher | `key_contributor` | **publish** |
| Michael Lipsky | `street-level-bureaucracy` | `lipsky-2010-street-level-bureaucracy`; `street-lipsky-1998-ojp` — Russell Sage / U.S. OJP | `key_contributor` | **publish** |
| John W. Kingdon | `multiple-streams-framework` | `kingdon-2011-agendas-alternatives` (**1995** library record); `msf-kingdon-2011` (**2011 [1984]** Pearson metadata) | `key_contributor` | **publish, after edition metadata is kept internally consistent** |

`key_contributor` is deliberately narrower than `founder`. No source gathered here warrants a sole-founder assertion, a teacher/student relation, a wider collaboration network, or an influence genealogy.

## 2. Jean Lave — publish

### L1 evidence matrix

| Requirement | Evidence and safe conclusion | Level |
| --- | --- | --- |
| Identity and academic positioning | The university-hosted Laboratory of Comparative Human Cognition (LCHC) biographical profile describes Lave as a **social anthropologist** interested in social theory and lists her as **Professor of Education and Geography, University of California, Berkeley**. The profile also describes ethnographic work on learning, learners, everyday life, and social practice. | L1 |
| Primary work | Cambridge University Press identifies *Situated Learning: Legitimate Peripheral Participation* as a **1991** book by **Jean Lave and Etienne Wenger**, with DOI `10.1017/CBO9780511815355`. Its record presents legitimate peripheral participation as its central concept. | L1 |
| Bounded corpus relation | The current `communities-of-practice` entry states that the 1991 coauthored book introduced legitimate peripheral participation through situated learning. This establishes a work-to-entry anchor; the candidate’s contribution wording remains editorially bounded. | L1 + L2 |

### Safe English material

**Overview / academic identity**

> Jean Lave is a social anthropologist whose ethnographic work examines learning, everyday life, and social practice. A university-hosted profile lists her as Professor of Education and Geography at the University of California, Berkeley.

**Theory relationship**

> With Etienne Wenger, Lave coauthored *Situated Learning: Legitimate Peripheral Participation* (1991). In Syntag, this book is the primary source anchor for legitimate peripheral participation within the Communities of Practice entry.

**Representative work**

> *Situated Learning: Legitimate Peripheral Participation* (1991), coauthored with Etienne Wenger, introduces legitimate peripheral participation as a way to examine learning through participation in practice.

### Role conclusion and attribution boundary

- **Recommended theory role:** `key_contributor` for `communities-of-practice`.
- **Evidence conclusion:** The role is supported by documented coauthorship of the 1991 corpus anchor and by the entry’s bounded account of legitimate peripheral participation. It is **not** evidence that Lave alone founded Communities of Practice or all situated-learning scholarship.
- **Do not state:** that Lave is the sole founder of Communities of Practice; that every use of “situated learning” or legitimate peripheral participation derives from her alone; that she and Wenger had any relationship beyond the documented coauthored work; or that a non-existent Syntag `situated-learning` theory entry exists.

**Template-safe `scholarly_relations` mapping:** one `collaboration` entry only — “Lave and Wenger are coauthors of *Situated Learning: Legitimate Peripheral Participation* (1991). This record establishes coauthorship of this work only.” Use source ID `lave-wenger-1991-situated-learning`.

### Safe reading path

1. **Lave and Wenger (1991)** — begin with the corpus anchor for legitimate peripheral participation and situated participation.
2. **Wenger (1998)** — then distinguish the later Communities of Practice formulation from the 1991 book rather than collapsing the two works into a single author claim.
3. **Cox (2005)** — use the existing comparative review to examine differences and ambiguity across seminal Communities of Practice texts.

### Sources

| Source | Type | What it supports | URL | Accessed |
| --- | --- | --- | --- | --- |
| LCHC / University of California, San Diego, “Jean Lave” profile | University-hosted academic biographical profile | Social-anthropology positioning; listed UC Berkeley appointment; named works | https://lchcautobio.ucsd.edu/jean-lave/ | 2026-07-18 |
| Cambridge University Press, *Situated Learning: Legitimate Peripheral Participation* | Publisher / DOI work record | Coauthors, 1991 publication, legitimate peripheral participation | https://doi.org/10.1017/CBO9780511815355 | 2026-07-18 |
| Cambridge University Press, *Communities of Practice: Learning, Meaning, and Identity* | Publisher work record | Later Wenger formulation used for reading differentiation | https://www.cambridge.org/highereducation/books/communities-of-practice/724C22A03B12D11DFC345EEF0AD3F22A | 2026-07-18 |
| Cox (2005), “What are communities of practice? A comparative review of four seminal works” | Journal DOI | Existing corpus differentiation source | https://doi.org/10.1177/0165551505057016 | 2026-07-18 |

## 3. Etienne Wenger — publish

### L1 evidence matrix

| Requirement | Evidence and safe conclusion | Level |
| --- | --- | --- |
| Identity and academic positioning | A University of Catalonia-hosted biographical page describes Wenger as a figure in learning theory and reports work with the University of California, Irvine Artificial Intelligence Department and the Institute for Research on Learning. The page does **not** supply dates, a rank, or a current appointment; none is added here. | L1, limited to the source wording |
| Primary works | Cambridge records the 1991 Lave–Wenger book and identifies Wenger as author of *Communities of Practice: Learning, Meaning, and Identity* (**1998**). The latter publisher page describes a theory of learning centred on social participation and social practice. | L1 |
| Bounded corpus relation | The current Communities of Practice entry distinguishes the 1991 LPP source from Wenger’s 1998 formulation of social participation, practice, community, meaning, identity, and boundaries. | L1 + L2 |

### Safe English material

**Overview / academic identity**

> Etienne Wenger is associated with learning-theory research on communities of practice. A university-hosted biographical profile reports work with the University of California, Irvine Artificial Intelligence Department and the Institute for Research on Learning; this profile is not used to assert an unsourced title, date, or current affiliation.

**Theory relationship**

> Wenger coauthored *Situated Learning: Legitimate Peripheral Participation* (1991) with Jean Lave and authored *Communities of Practice: Learning, Meaning, and Identity* (1998). In Syntag, the first anchors legitimate peripheral participation and the second is the core source for the Communities of Practice formulation.

**Representative works**

> *Situated Learning: Legitimate Peripheral Participation* (1991), with Jean Lave, and *Communities of Practice: Learning, Meaning, and Identity* (1998) are the two primary works linked to this bounded profile.

### Role conclusion and attribution boundary

- **Recommended theory role:** `key_contributor` for `communities-of-practice`.
- **Evidence conclusion:** The two primary records support a narrow account of Wenger’s documented contribution to the current entry. Do **not** upgrade the role to `founder`: the sources establish authorship and book scope, not exclusive origin of the wider tradition.
- **Do not state:** that Wenger alone founded Communities of Practice; that his 1998 book makes the 1991 coauthored work his alone; that he held an unspecified UCI or Institute for Research on Learning title; that he is a teacher, mentor, collaborator, or influence relation of any named person except for the documented Lave coauthorship; or that the adjacent Teacher Identity source proves a separate Scholar–Theory relation.

**Template-safe `scholarly_relations` mapping:** one `collaboration` entry only — “Wenger and Lave are coauthors of *Situated Learning: Legitimate Peripheral Participation* (1991). This record establishes coauthorship of this work only.” Use source ID `lave-wenger-1991-situated-learning`.

### Safe reading path

1. **Lave and Wenger (1991)** — read first for legitimate peripheral participation and the shared authorship record.
2. **Wenger (1998)** — read for the separate social-participation formulation of practice, community, meaning, and identity.
3. **Contu and Willmott (2003)** and **Cox (2005)** — use the existing critique and comparative review to avoid treating the 1998 vocabulary as uncontested or exhaustive.

### Sources

| Source | Type | What it supports | URL | Accessed |
| --- | --- | --- | --- | --- |
| Open University of Catalonia, “Etienne Wenger” biographical page | University-hosted biographical profile | Limited learning-theory positioning; reported UCI and Institute for Research on Learning work; named works | https://www.uoc.edu/web/esp/art/uoc/ssanz1003/ewenger1003_cv.html | 2026-07-18 |
| Cambridge University Press, *Situated Learning: Legitimate Peripheral Participation* | Publisher / DOI work record | Coauthorship, 1991 publication, legitimate peripheral participation | https://doi.org/10.1017/CBO9780511815355 | 2026-07-18 |
| Cambridge University Press, *Communities of Practice: Learning, Meaning, and Identity* | Publisher work record | Wenger authorship, 1998 publication, social-participation account | https://www.cambridge.org/highereducation/books/communities-of-practice/724C22A03B12D11DFC345EEF0AD3F22A | 2026-07-18 |
| Contu and Willmott (2003), “Re-embedding situatedness” | Journal record | Existing corpus power critique | https://pubsonline.informs.org/doi/10.1287/orsc.14.3.283.15167 | 2026-07-18 |

## 4. Michael Lipsky — publish

### L1 evidence matrix

| Requirement | Evidence and safe conclusion | Level |
| --- | --- | --- |
| Identity and academic positioning | A Harvard Kennedy School project profile reports that Lipsky was a political-science professor at MIT for 21 years and taught at the University of Wisconsin, Georgetown, and the Harvard Graduate School of Education. The Russell Sage book record identifies him as a senior program director at Demos and an affiliate professor at Georgetown University at the time of that record. | L1 |
| Primary work | Russell Sage Foundation records *Street-Level Bureaucracy: Dilemmas of the Individual in Public Services*, 30th Anniversary Expanded Edition, by Michael Lipsky, published in **April 2010**. Its project record says the original book was published in **1980**. The publisher description directly concerns discretion, client interaction, caseloads, ambiguous goals, inadequate resources, and the gap between formal policy and implementation. | L1 |
| Bounded corpus relation | The existing Street-Level Bureaucracy entry uses Lipsky’s book as its classic formulation and limits the perspective to frontline public-service implementation with client interaction, consequential discretion, and organisational conditions. | L1 + L2 |

### Safe English material

**Overview / academic identity**

> Michael Lipsky is a political scientist and public-policy scholar. A Harvard Kennedy School project profile reports that he was a political-science professor at MIT for 21 years; a Russell Sage Foundation book record also identifies him as an affiliate professor at Georgetown University at the time of that record.

**Theory relationship**

> Lipsky authored *Street-Level Bureaucracy: Dilemmas of the Individual in Public Services*. In Syntag, the work is the classic source anchor for a bounded account of frontline public-service implementation, discretion, client interaction, and organisational constraints.

**Representative work**

> *Street-Level Bureaucracy: Dilemmas of the Individual in Public Services* was first published in 1980; the Russell Sage Foundation’s 30th Anniversary Expanded Edition was published in 2010.

### Role conclusion and attribution boundary

- **Recommended theory role:** `key_contributor` for `street-level-bureaucracy`.
- **Evidence conclusion:** The publisher and authoritative U.S. Office of Justice Programs records support authorship and the current entry’s limited classic-formulation relation. They do not require, or justify, a sole-founder label.
- **Do not state:** that every frontline worker is a street-level bureaucrat; that discretion is automatically bias, misconduct, resistance, autonomy, innovation, or benefit; that Lipsky’s framework explains agenda setting; that later institutional or structuration applications are his personal collaborations or direct influences; or that his institutional appointments continue beyond the cited records.

**Template-safe `scholarly_relations` mapping:** one `development` entry — “Editorially, the 2010 expanded edition revisits Lipsky’s 1980 *Street-Level Bureaucracy* formulation; this is a publication-history sequence, not a relation to another scholar.” Use two distinct source records: `lipsky-1980-russell-sage-publication-history` for the Russell Sage publication-history page that identifies the 1980 original, and `lipsky-2010-street-level-bureaucracy` for the Russell Sage 2010 expanded-edition book record.

### Safe reading path

1. **Lipsky (1980; 2010 expanded edition)** — begin with the primary formulation, taking care to cite the edition actually used.
2. **Lipsky, “Toward a Theory of Street-Level Bureaucracy”** — check the existing U.S. OJP record for direct-interaction, discretion, authority, resource, and goal conditions.
3. **Rice (2013)** and **Dahlvik (2017)** — read only as later, bounded theoretical combinations; neither author establishes a personal relationship with Lipsky.

### Sources

| Source | Type | What it supports | URL | Accessed |
| --- | --- | --- | --- | --- |
| Harvard Kennedy School, Project on Indigenous Governance and Development, “Michael Lipsky” | University project profile | Documented teaching and MIT political-science career facts | https://indigenousgov.hks.harvard.edu/people/michael-lipsky | 2026-07-18 |
| Russell Sage Foundation, *Street-Level Bureaucracy* | Publisher work record | 2010 expanded edition, author identification, book scope, Georgetown/Demos identification at record time | https://www.russellsage.org/publications/book/street-level-bureaucracy | 2026-07-18 |
| Russell Sage Foundation, “Expanded Thirtieth Anniversary Edition of Street-Level Bureaucracy” | Publisher / foundation project record | Original 1980 publication and anniversary-edition context | https://www.russellsage.org/research/grants/expanded-thirtieth-anniversary-edition-street-level-bureaucracy-dilemmas-individual | 2026-07-18 |
| U.S. Office of Justice Programs, “Toward a Theory of Street-Level Bureaucracy” | Authoritative government bibliographic record | Existing corpus definitional-conditions source | https://www.ojp.gov/ncjrs/virtual-library/abstracts/toward-theory-street-level-bureaucracy-criminal-justice-system | 2026-07-18 |

## 5. John W. Kingdon — publish

### L1 evidence matrix

| Requirement | Evidence and safe conclusion | Level |
| --- | --- | --- |
| Identity and academic positioning | The University of Michigan Department of Political Science lists **John W. Kingdon** as **Professor Emeritus of Political Science**. Its profile identifies *Agendas, Alternatives, and Public Policies* among his work and reports that it received the Aaron Wildavsky Award for an enduring contribution to public-policy research. | L1 |
| Primary work | The University of Michigan profile records the book’s first publication in **1984**. The current corpus retains a **1995** library record (`kingdon-2011-agendas-alternatives`) and a Pearson record whose local citation is **2011 [1984]** (`msf-kingdon-2011`). The linked Pearson page displays a **2013** New International Edition, which is a distinct edition record and must not be attached to either existing source ID without a corpus metadata update. | L1, with an edition-metadata reconciliation required before integration |
| Bounded corpus relation | The existing Multiple Streams Framework entry treats Kingdon’s work as the classic U.S. federal-government agenda-setting orientation and explicitly rejects automatic portability across systems, levels, and policy stages. | L1 + L2 |

### Safe English material

**Overview / academic identity**

> John W. Kingdon is Professor Emeritus of Political Science at the University of Michigan. His work includes *Agendas, Alternatives, and Public Policies*, a central source for the agenda-setting orientation represented in Syntag’s Multiple Streams Framework entry.

**Theory relationship**

> Kingdon authored *Agendas, Alternatives, and Public Policies*. In Syntag, the work provides the classic U.S. federal-government orientation for analysing agenda setting, policy alternatives, timing, and the temporary coupling of problem, policy, and politics streams.

**Representative work**

> *Agendas, Alternatives, and Public Policies* was first published in 1984. For the present corpus, cite only the locally retained 1995 library record or the `2011 [1984]` Pearson metadata after the edition audit. The linked Pearson page's 2013 New International Edition must receive its own source/work record before it is cited as a corpus source.

### Role conclusion and attribution boundary

- **Recommended theory role:** `key_contributor` for `multiple-streams-framework`.
- **Evidence conclusion:** The university and publisher records support Kingdon’s identity, authorship, and the bounded classic-orientation link. Use `key_contributor`, not `founder`, because the evidence gathered here does not establish sole origin of all Multiple Streams Framework development, refinements, or applications.
- **Do not state:** that Kingdon alone founded every version of the Multiple Streams Framework; that the framework is automatically valid outside the U.S. federal agenda-setting setting; that it explains implementation after adoption; that later refinements by Zahariadis, Herweg, or Zohlnhöfer show a personal relationship with Kingdon; or that the 2013 Pearson record is the 1984 original edition.

**Template-safe `scholarly_relations` mapping:** one `development` entry — “Editorially, the corpus distinguishes Kingdon’s original 1984 work from its retained 1995 and 2011 [1984] edition records; this is publication-history treatment, not a relation to another scholar.” Use source IDs `kingdon-2011-agendas-alternatives` and `msf-kingdon-2011` only after the edition metadata audit.

### Safe reading path

1. **Kingdon (1984; cite the edition actually consulted)** — start with the original agenda-setting problem and U.S. federal scope.
2. **Corpus-retained 1995 library record or 2011 [1984] Pearson metadata** — use only after checking the precise edition; do not use the linked 2013 publisher page under either existing source ID.
3. **Zahariadis (2023)** and **Herweg, Zahariadis, and Zohlnhöfer (2018; 2022)** — read for framework scope, refinements, and portability limits rather than attributing those developments to Kingdon.

### Sources

| Source | Type | What it supports | URL | Accessed |
| --- | --- | --- | --- | --- |
| University of Michigan, Department of Political Science, “John W. Kingdon” | University emeritus profile | Professor Emeritus status; political-science positioning; first-publication and award information as stated by the profile | https://lsa.umich.edu/polisci/people/emeriti/kingdon.html | 2026-07-18 |
| Pearson, *Agendas, Alternatives, and Public Policies, Update Edition (With an Epilogue on Health Care)* | Publisher work record | A distinct 2013 New International Edition; useful for external edition checking but **not** a substitute for the corpus's current 1995 / 2011 source metadata | https://www.pearson.com/en-gb/subject-catalog/p/agendas-alternatives-and-public-policies-update-edition-with-an-epilogue-on-health-care-pearson-new-international-edition/P200000004628/9781292039206 | 2026-07-18 |
| Zahariadis (2023), “Multiple Streams Framework” | DOI reference work | Existing corpus policy-process scope source | https://doi.org/10.1007/978-3-030-90434-0_70-1 | 2026-07-18 |
| Herweg, Zahariadis, and Zohlnhöfer (2022), “Travelling far and wide?” | Journal DOI | Existing corpus portability-boundary source | https://doi.org/10.1007/s11615-022-00393-8 | 2026-07-18 |

## 6. Integration guardrails and blockers

### Recommendation

Lave, Wenger, and Lipsky meet the conservative three-part publication rule **if the implementation copies only the evidence-bounded wording above**. Kingdon meets the identity/work/theory rule but should be integrated only after the local 1995/2011 edition metadata is reconciled with the separate 2013 publisher record. The relationship fields should use the listed existing theory slugs and `key_contributor` roles only.

### Blocking conditions

There is no missing identity/work/theory-anchor blocker for Lave, Wenger, or Lipsky. **Kingdon has an edition-metadata blocker:** the local 1995 and 2011 source records must not be replaced by, or cited as, the distinct 2013 Pearson edition unless a new source/work record is created in a separate corpus change.

The current `ScholarContent` template requires a non-empty `scholarly_relations` array. This pack therefore supplies the least-assertive valid mapping for every candidate: the sourced 1991 Lave–Wenger coauthorship (`collaboration`) and, for Lipsky and Kingdon, L2 editorial publication-history sequences (`development`) that explicitly do not assert a relationship with another scholar. Integration must use these exact bounded mappings; it must not manufacture a personal relationship merely to satisfy the validator.

The following are publication blockers if the integration would require them:

1. Any `founder` or sole-originator role, including an implicit “father of” formulation.
2. A new scholar–scholar relation (mentorship, influence, collaboration, network, or affiliation) not evidenced by a specific source. The only coauthorship directly documented in this pack is **Lave and Wenger (1991)**.
3. A separate Wenger link to `teacher-identity-theory` based only on an adjacent-theory comparison.
4. Treating the 2013 Pearson update edition as the original 1984 Kingdon publication, or inventing a year for any other edition.
5. Adding appointment dates, current affiliations, reviewer names, locator/page numbers, or biographical details not stated by a cited source.
6. Publishing an unqualified claim that any of the four theories applies across all disciplines, systems, or stages of policy/service work.

### Verification classification for implementation

- **L1 / verified:** the identity and work facts expressly tied to a source row above.
- **L2 / editorial:** `key_contributor` labels, the current-entry connection, comparison language, and every attribution boundary.
- **L3 / proposed:** the reading-path order and any research-use recommendation; these remain conditional on the research question, setting, ethics, access, and disciplinary guidance.
