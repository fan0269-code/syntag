# Ivor F. Goodson and Christopher Day — draft Scholar evidence pack

> Access date: 2026-07-19
> Decision: draft-only; no publication approval

## 1. Publication boundary

This is an evidence-ready draft package, not approval to publish either Scholar. It preserves the distinction between source-backed facts (L1), editorial synthesis (L2), and research guidance or pending review (L3). No human reviewer, approval record, claim-level locator review, or `verifiedAt` is present in this batch.

Both proposed records must remain `draft`. If they are ever rendered publicly after an independent review, the only permitted current status semantics are: **Sources listed · editorial synthesis · claim-level review pending**. Neither profile may be presented as source-verified, and neither may be a public route, index entry, search result, sitemap entry, graph node, or published internal link while it is draft.

## 2. Goodson source register

| source ID | citation | URL | source type | directly supports | does not support | accessed date |
| --- | --- | --- | --- | --- | --- | --- |
| `goodson-brighton-2018-profile` | University of Brighton. (2018, October 10). *National honour for Professor Goodson*. | https://www.brighton.ac.uk/about-us/news-and-events/news/2018/10-10-national-honour-for-professor-goodson.aspx | university news page | Ivor F. Goodson's name; the 2018 page's identification of him as Professor of Learning Theory; the page-time Brighton and Tallinn affiliations; education-research context; BERA recognition. | A current 2026 title or affiliation, a complete career history, a theory-founder claim, or a personal/research-network relation. | 2026-07-19 |
| `goodson-bera-profile` | British Educational Research Association. *Ivor Goodson* profile. | https://www.bera.ac.uk/person/ivor-goodson | professional-association profile | The profile's stated work on curriculum, life-history approaches, and teachers' lives and work, together with the works listed on that page. | A current institutional appointment, a complete biography, or sole ownership of a research tradition. | 2026-07-19 |
| `goodson-2013-narrative-theory` | Goodson, I. F. (2013). *Developing Narrative Theory: Life Histories and Personal Representation*. Routledge. | https://www.routledge.com/Developing-Narrative-Theory-Life-Histories-and-Personal-Representation/Goodson/p/book/9780415603614 | publisher record | Goodson's authorship of this 2013 work and its bibliographic record. | A current appointment, founder status, or attribution of every life-history approach to Goodson. | 2026-07-19 |
| `teacher-life-history-goodson-1992` | Goodson, I. F. (Ed.). (1992). *Studying Teachers' Lives*. Routledge. Google Books bibliographic record. | https://books.google.com/books/about/Studying_Teachers_Lives.html?id=43MTmQEACAAJ | authoritative bibliographic web record | The Google Books bibliographic record and its direct listing of Editor Ivor Goodson for this 1992 edited volume. | Sole authorship of the volume, a sole-founder claim, or a general collaboration network. | 2026-07-19 |
| `teacher-life-history-goodson-sikes-2001` | Goodson, I. F., & Sikes, P. J. (2001). *Life History Research in Educational Settings: Learning from Lives*. Open University Press. WorldCat/OCLC 45873740. | https://search.worldcat.org/cs/title/Life-history-research-in-educational-settings-%3A-learning-from-lives/oclc/45873740 | authoritative bibliographic web record | The WorldCat/OCLC bibliographic record and its direct listing of authors Ivor Goodson and Patricia J. Sikes for this specific 2001 work. | A broader collaboration network, a mentorship relation, or ownership of all life-history research. | 2026-07-19 |

## 3. Goodson claim matrix

| claim ID | field path | safe wording | content nature (L1/L2/L3) | source ID | locator if actually available | forbidden extension |
| --- | --- | --- | --- | --- | --- |
| `goodson-identity-2018` | `scholars.ivor-f-goodson.content.en.academic_identity` | The 2018 University of Brighton page identifies Ivor F. Goodson as Professor of Learning Theory and describes Brighton/Tallinn affiliations at that page's time. | L1 | `goodson-brighton-2018-profile` | none — web page viewed without a stable numbered section or paragraph locator | Do not state that he holds the same post or affiliations in 2026. |
| `goodson-research-profile` | `scholars.ivor-f-goodson.content.en.overview` | The BERA profile describes work involving curriculum, life-history approaches, and teachers' lives and work. | L1 | `goodson-bera-profile` | none — web profile viewed without a stable numbered section or paragraph locator | Do not expand this to a complete biography, a current job title, or a claim that every teacher-life-history approach is his. |
| `goodson-work-2013` | `scholars.ivor-f-goodson.content.en.representative_works[0]` | Goodson is the author of the 2013 *Developing Narrative Theory: Life Histories and Personal Representation*. | L1 | `goodson-2013-narrative-theory` | none — publisher web record has no stable page locator | Do not treat the work as proof that Goodson originated all narrative or life-history research. |
| `goodson-work-1992-editor` | `scholars.ivor-f-goodson.content.en.representative_works[1]` | Goodson is the editor, not the sole author, of the 1992 edited volume *Studying Teachers' Lives*. | L1 | `teacher-life-history-goodson-1992` | Google Books bibliographic details: “Editor Ivor Goodson” | Do not call the edited volume a single-authored Goodson book. |
| `goodson-work-2001-coauthors` | `scholars.ivor-f-goodson.content.en.representative_works[2]` | Goodson and Patricia J. Sikes are coauthors of the specific 2001 *Life History Research in Educational Settings: Learning from Lives*. | L1 | `teacher-life-history-goodson-sikes-2001` | WorldCat/OCLC 45873740 bibliographic details: “Ivor Goodson; Patricia J Sikes” | Do not infer an enduring collaboration network, mentorship, or any other relationship. |
| `goodson-theory-relation` | `theoryScholars.teacher-life-history-research:ivor-f-goodson.role` | Editorially, Goodson is a bounded `key_contributor` candidate for `teacher-life-history-research`, a qualitative research tradition rather than a closed causal theory. | L2 | `goodson-bera-profile`; `goodson-2013-narrative-theory`; `teacher-life-history-goodson-1992`; `teacher-life-history-goodson-sikes-2001` | none — no source directly declares the corpus relation | Do not call Goodson a founder, sole founder, creator, father of, or the exclusive owner of the tradition. |
| `goodson-public-status` | `scholars.ivor-f-goodson.status` | The candidate remains draft until a human completes claim-level review. | L3 | `goodson-brighton-2018-profile`; `goodson-bera-profile` | none — review record does not exist | Do not add reviewer, approval, review date, or `verifiedAt`. |

## 4. Goodson attribution boundaries

- The 2018 University of Brighton title and affiliations are time-bounded to that page; they are not a claim about the present.
- The `teacher-life-history-research` relation is an L2 editorial, bounded `key_contributor` candidate. It is not a direct source statement and it is not a founder claim.
- The 1992 record establishes an editor role; it must not be compressed into sole authorship.
- The 2001 record establishes only the named Goodson–Pat Sikes coauthorship for that work. It does not establish mentorship, a school, or a wider collaboration network.
- The corpus's historical DOI record `teacher-life-history-josselson-2007` is not used to establish Goodson's identity or relation, and this batch does not repair that record.

## 5. Day source register

| source ID | citation | URL | source type | directly supports | does not support | accessed date |
| --- | --- | --- | --- | --- | --- | --- |
| `day-nottingham-profile` | University of Nottingham. *Christopher Day* staff profile. | https://www.nottingham.ac.uk/Education/People/christopher.day | university staff profile | Christopher Day's name; Professor of Education; University of Nottingham School of Education; stated work on teacher professionalism, teachers' work and lives, and professional learning and development; works listed by the page. | A theory-founder claim, personal relationships, a complete career history, or attribution of other authors' models to Day. | 2026-07-19 |
| `day-1999-developing-teachers` | Day, C. (1999). *Developing Teachers: The Challenges of Lifelong Learning*. Falmer Press. | https://www.routledge.com/Developing-Teachers-The-Challenges-of-Lifelong-Learning/Day/p/book/9780750707480 | publisher record | Christopher Day's authorship of this 1999 work and its bibliographic record. | Founder status for a single teacher-development theory or authorship of other models. | 2026-07-19 |
| `teacher-development-day-etal-2006` | Day, C., Kington, A., Stobart, G., & Sammons, P. (2006). The personal and professional selves of teachers. *British Educational Research Journal, 32*(4), 601–616. | https://doi.org/10.1080/01411920600775316 | DOI/journal record | Christopher Day, Alison Kington, Gordon Stobart, and Pam Sammons as coauthors of this specific 2006 article. | Sole authorship by Day, a general collaboration network, or authorship of Guskey, Clarke–Hollingsworth, or Timperley models. | 2026-07-19 |
| `teacher-development-guskey-2002` | Guskey, T. R. (2002). Professional development and teacher change. *Teachers and Teaching, 8*(3), 381–391. | https://doi.org/10.1080/135406002100000512 | DOI/journal record | Guskey's authorship of this teacher-change record. | Authorship by Day or proof that Day created Guskey's model. | 2026-07-19 |
| `teacher-development-clarke-hollingsworth-2002` | Clarke, D., & Hollingsworth, H. (2002). Elaborating a model of teacher professional growth. *Teaching and Teacher Education, 18*(8), 947–967. | https://doi.org/10.1016/S0742-051X(02)00053-7 | DOI/journal record | Clarke and Hollingsworth's authorship of their professional-growth model record. | Authorship by Day or proof that Day created the Interconnected Model of Professional Growth. | 2026-07-19 |
| `teacher-development-timperley-2007` | Timperley, H., Wilson, A., Barrar, H., & Fung, I. (2007). *Teacher Professional Learning and Development: Best Evidence Synthesis Iteration*. New Zealand Ministry of Education. | https://www.educationcounts.govt.nz/publications/series/2515/15341 | authoritative government publication | Timperley, Wilson, Barrar, and Fung's named evidence-synthesis record. | Authorship by Day or proof that Day authored the evidence synthesis. | 2026-07-19 |

## 6. Day claim matrix

| claim ID | field path | safe wording | content nature (L1/L2/L3) | source ID | locator if actually available | forbidden extension |
| --- | --- | --- | --- | --- | --- |
| `day-identity-profile` | `scholars.christopher-day.content.en.academic_identity` | The University of Nottingham profile identifies Christopher Day as Professor of Education in its School of Education. | L1 | `day-nottingham-profile` | none — web profile viewed without a stable numbered section or paragraph locator | Do not derive a complete career history, a founder claim, or private relationships. |
| `day-research-profile` | `scholars.christopher-day.content.en.overview` | The profile states research interests including teacher professionalism, teachers' work and lives, and professional learning and development. | L1 | `day-nottingham-profile` | none — web profile viewed without a stable numbered section or paragraph locator | Do not treat the profile as proof that Day authored every teacher-development model or an entire field. |
| `day-work-1999-author` | `scholars.christopher-day.content.en.representative_works[0]` | Day is the author of the 1999 *Developing Teachers: The Challenges of Lifelong Learning*. | L1 | `day-1999-developing-teachers` | none — publisher web record has no stable page locator | Do not call it the founding text of a single closed theory. |
| `day-work-2006-coauthors` | `scholars.christopher-day.content.en.representative_works[1]` | Day, Kington, Stobart, and Sammons are the four coauthors of the specific 2006 article. | L1 | `teacher-development-day-etal-2006` | none — DOI landing record has no stable page locator | Do not reduce the article to Day alone or infer a wider personal/research network. |
| `day-other-models-boundary` | `scholars.christopher-day.content.en.attribution_boundaries` | The Guskey (2002), Clarke–Hollingsworth (2002), and Timperley et al. (2007) records belong to other authors' models or evidence synthesis and are not Day works. | L1 | `teacher-development-guskey-2002`; `teacher-development-clarke-hollingsworth-2002`; `teacher-development-timperley-2007` | none — these cited records are outside the person-specific source set and no stable page locator is used here | Do not attribute those models, their mechanisms, or their authorship to Day. |
| `day-theory-relation` | `theoryScholars.teacher-professional-development-theory:christopher-day.role` | Editorially, Day is a bounded `key_contributor` candidate for the plural, editorial `teacher-professional-development-theory` entry. | L2 | `day-nottingham-profile`; `day-1999-developing-teachers`; `teacher-development-day-etal-2006` | none — no source directly declares the corpus relation | Do not call Day a founder, sole founder, creator, father of, or the author of a single universal teacher-development theory. |
| `day-public-status` | `scholars.christopher-day.status` | The candidate remains draft until a human completes claim-level review. | L3 | `day-nottingham-profile`; `day-1999-developing-teachers` | none — review record does not exist | Do not add reviewer, approval, review date, or `verifiedAt`. |

## 7. Day attribution boundaries

- `teacher-professional-development-theory` is a plural editorial umbrella, not a single theory created by one scholar.
- The Day relation is an L2 editorial, bounded `key_contributor` candidate, not a source-declared founder fact.
- Day is the 1999 work's author. The 2006 article has four named coauthors: Day, Kington, Stobart, and Sammons.
- Guskey (2002), Clarke–Hollingsworth (2002), and Timperley et al. (2007) remain other authors' model or evidence-synthesis records; none may be attributed to Day.
- No personal relationship, scholarly lineage, influence, or long-term collaboration network is inferred from shared subject matter, coauthorship, or institutional context.

## 8. Source conflicts and non-claims

No unresolved identity, work-authorship, or role conflict was found in the reviewed source set. Goodson's institution/title statement is explicitly constrained to the 2018 University of Brighton page, while the Nottingham profile provides Day's displayed staff-profile identity; these are not contradictory time claims.

The sources do not establish that either person founded a theory, owns an entire research tradition, trained another scholar, has a wider collaboration network, or currently holds an unqualified permanent appointment beyond the direct wording and time scope above. Neither relation is inferred merely from adjacent theories or shared vocabulary: each is an L2 corpus editorial synthesis bounded by the cited person-specific research and work records.

The historical DOI record `teacher-life-history-josselson-2007` is outside this identity-and-relation decision. It is not used for either Scholar and is not repaired in this batch.

## 9. Draft/stop decision

| candidate | evidence decision | reason | corpus decision |
| --- | --- | --- | --- |
| Ivor F. Goodson | No STOP condition triggered | The official/person-specific pages and existing work records identify the same scholar, distinguish the 1992 editor role and the 2001 Goodson–Sikes coauthorship, and support only a bounded relation. | `DRAFT` |
| Christopher Day | No STOP condition triggered | The official Nottingham profile and existing work records identify the same scholar, distinguish the 1999 author role and the four 2006 coauthors, and support only a bounded relation. | `DRAFT` |

Both proposed TheoryScholar relations are L2 editorial `key_contributor` candidates only: Goodson for `teacher-life-history-research`, and Day for `teacher-professional-development-theory`. They are not founder relations. The source package supports draft authoring, but no publication decision.

## 10. Future human-review requirements

Before either draft can be published, a qualified human reviewer must independently inspect each claim, retain a real claim-level locator where the source provides one, record their role and review decision, record the review date, and provide explicit publication approval. The reviewer must also decide whether a `verifiedAt` value is warranted for each persisted claim rather than copying a batch access date.

Until that work is complete, retain `draft`, no public surface, and the public-facing semantics: **Sources listed · editorial synthesis · claim-level review pending**.
