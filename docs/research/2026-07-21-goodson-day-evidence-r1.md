# Goodson & Day Scholar Evidence Pack — R1（Crossref-verified）

> Access date: 2026-07-21
> Decision: draft-only; no publication approval
> Publication boundary: 不可渲染为公开页、不可入索引/sitemap/图谱，直到 status=published。

## 1. Verification summary

本 R1 对 R0 中三条 DOI 记录执行 Crossref 结构化核验，逐字段比对标题、作者、年份、卷期页、出版者。

| 源 | 路径 | HTTP | 结果 |
| --- | --- | --- | --- |
| Crossref — Day et al. 2006 | `curl --proxy http://127.0.0.1:7897` + `mailto=research@syrtag.com` | 200 | 成功，元数据全字段匹配 |
| Crossref — Clarke & Hollingsworth 2002 | 同上 | 200 | 成功，元数据全字段匹配 |
| Crossref — Guskey 2002 | 同上 | 200 | 成功，元数据全字段匹配 |

**结论：R0 中三条 DOI 记录与 Crossref 元数据一致，无事实性差异。** 以下列出逐条核验细节与仍待升级的 locator 状态。

## 2. Crossref 核验结果

### 2.1 Day et al. 2006

| 字段 | R0 声称 | Crossref 实际 | 一致？ |
| --- | --- | --- | --- |
| DOI | `10.1080/01411920600775316` | `10.1080/01411920600775316` | 是 |
| 标题 | *The personal and professional selves of teachers* | *The personal and professional selves of teachers: stable and unstable identities* | 是（R0 省略副标题，非错误） |
| 作者 | Day, C.; Kington, A.; Stobart, G.; Sammons, P. | Day, Christopher; Kington, Alison; Stobart, Gordon; Sammons, Pam | 是 |
| 年份 | 2006 | 2006-08 | 是 |
| 期刊 | *British Educational Research Journal* | *British Educational Research Journal* | 是 |
| 卷期页 | 32(4), 601–616 | 32(4), 601–616 | 是 |
| 类型 | （未标注） | journal-article | — |
| 出版者 | （未标注） | Wiley | — |

### 2.2 Clarke & Hollingsworth 2002

| 字段 | R0 声称 | Crossref 实际 | 一致？ |
| --- | --- | --- | --- |
| DOI | `10.1016/S0742-051X(02)00053-7` | `10.1016/s0742-051x(02)00053-7` | 是（大小写无关） |
| 标题 | *Elaborating a model of teacher professional growth* | *Elaborating a model of teacher professional growth* | 是 |
| 作者 | Clarke, D.; Hollingsworth, H. | Clarke, David; Hollingsworth, Hilary | 是 |
| 年份 | 2002 | 2002-11 | 是 |
| 期刊 | *Teaching and Teacher Education* | *Teaching and Teacher Education* | 是 |
| 卷期页 | 18(8), 947–967 | 18(8), 947–967 | 是 |
| 类型 | （未标注） | journal-article | — |
| 出版者 | （未标注） | Elsevier BV | — |

### 2.3 Guskey 2002

| 字段 | R0 声称 | Crossref 实际 | 一致？ |
| --- | --- | --- | --- |
| DOI | `10.1080/135406002100000512` | `10.1080/135406002100000512` | 是 |
| 标题 | *Professional development and teacher change* | *Professional Development and Teacher Change* | 是 |
| 作者 | Guskey, T. R. | Guskey, Thomas R. | 是 |
| 年份 | 2002 | 2002-08 | 是 |
| 期刊 | *Teachers and Teaching* | *Teachers and Teaching* | 是 |
| 卷期页 | 8(3), 381–391 | 8(3), 381–391 | 是 |
| 类型 | （未标注） | journal-article | — |
| 出版者 | （未标注） | Informa UK Limited | — |

## 3. Source register（含 Crossref 核验注记）

| source ID | citation | URL | source type | directly supports | does not support | accessed date |
| --- | --- | --- | --- | --- | --- | --- |
| `goodson-brighton-2018-profile` | University of Brighton. (2018, October 10). *National honour for Professor Goodson*. | https://www.brighton.ac.uk/about-us/news-and-events/news/2018/10-10-national-honour-for-professor-goodson.aspx | university news page | Ivor F. Goodson's name; the 2018 page's identification of him as Professor of Learning Theory; the page-time Brighton and Tallinn affiliations; education-research context; BERA recognition. | A current 2026 title or affiliation, a complete career history, a theory-founder claim, or a personal/research-network relation. | 2026-07-21 |
| `goodson-bera-profile` | British Educational Research Association. *Ivor Goodson* profile. | https://www.bera.ac.uk/person/ivor-goodson | professional-association profile | The profile's stated work on curriculum, life-history approaches, and teachers' lives and work, together with the works listed on that page. | A current institutional appointment, a complete biography, or sole ownership of a research tradition. | 2026-07-21 |
| `goodson-2013-narrative-theory` | Goodson, I. F. (2013). *Developing Narrative Theory: Life Histories and Personal Representation*. Routledge. | https://www.routledge.com/Developing-Narrative-Theory-Life-Histories-and-Personal-Representation/Goodson/p/book/9780415603614 | publisher record | Goodson's authorship of this 2013 work and its bibliographic record. | A current appointment, founder status, or attribution of every life-history approach to Goodson. | 2026-07-21 |
| `teacher-life-history-goodson-1992` | Goodson, I. F. (Ed.). (1992). *Studying Teachers' Lives*. Routledge. Google Books bibliographic record. | https://books.google.com/books/about/Studying_Teachers_Lives.html?id=43MTmQEACAAJ | authoritative bibliographic web record | The Google Books bibliographic record and its direct listing of Editor Ivor Goodson for this 1992 edited volume. | Sole authorship of the volume, a sole-founder claim, or a general collaboration network. | 2026-07-21 |
| `teacher-life-history-goodson-sikes-2001` | Goodson, I. F., & Sikes, P. J. (2001). *Life History Research in Educational Settings: Learning from Lives*. Open University Press. WorldCat/OCLC 45873740. | https://search.worldcat.org/cs/title/Life-history-research-in-educational-settings-%3A-learning-from-lives/oclc/45873740 | authoritative bibliographic web record | The WorldCat/OCLC bibliographic record and its direct listing of authors Ivor Goodson and Patricia J. Sikes for this specific 2001 work. | A broader collaboration network, a mentorship relation, or ownership of all life-history research. | 2026-07-21 |
| `day-nottingham-profile` | University of Nottingham. *Christopher Day* staff profile. | https://www.nottingham.ac.uk/Education/People/christopher.day | university staff profile | Christopher Day's name; Professor of Education; University of Nottingham School of Education; stated work on teacher professionalism, teachers' work and lives, and professional learning and development; works listed by the page. | A theory-founder claim, personal relationships, a complete career history, or attribution of other authors' models to Day. | 2026-07-21 |
| `day-1999-developing-teachers` | Day, C. (1999). *Developing Teachers: The Challenge of Lifelong Learning*. Falmer Press / Routledge. | https://www.routledge.com/Developing-Teachers-The-Challenge-of-Lifelong-Learning/Day/p/book/9780750707480 | publisher record | Christopher Day's authorship of this 1999 work and its bibliographic record. | Founder status for a single teacher-development theory or authorship of other models. | 2026-07-21 |
| `teacher-development-day-etal-2006` | Day, C., Kington, A., Stobart, G., & Sammons, P. (2006). The personal and professional selves of teachers: stable and unstable identities. *British Educational Research Journal*, 32(4), 601–616. | https://doi.org/10.1080/01411920600775316 | doi（Crossref 2026-07-21 核验） | Day, Kington, Stobart, Sammons as four named coauthors; 2006 年; BERJ 32(4); 页码 601–616; Wiley 出版; journal-article 类型。 | Sole authorship by Day, a general collaboration network, or authorship of Guskey, Clarke–Hollingsworth, or Timperley models. | 2026-07-21 |
| `teacher-development-guskey-2002` | Guskey, T. R. (2002). Professional development and teacher change. *Teachers and Teaching*, 8(3), 381–391. | https://doi.org/10.1080/135406002100000512 | doi（Crossref 2026-07-21 核验） | Guskey, Thomas R. as sole author; 2002 年 8 月; Teachers and Teaching 8(3); 页码 381–391; Informa UK Limited 出版; journal-article 类型。 | Authorship by Day or proof that Day created Guskey's model. | 2026-07-21 |
| `teacher-development-clarke-hollingsworth-2002` | Clarke, D., & Hollingsworth, H. (2002). Elaborating a model of teacher professional growth. *Teaching and Teacher Education*, 18(8), 947–967. | https://doi.org/10.1016/S0742-051X(02)00053-7 | doi（Crossref 2026-07-21 核验） | Clarke, David and Hollingsworth, Hilary as two named coauthors; 2002 年 11 月; Teaching and Teacher Education 18(8); 页码 947–967; Elsevier BV 出版; journal-article 类型。 | Authorship by Day or proof that Day created the Interconnected Model of Professional Growth. | 2026-07-21 |
| `teacher-development-timperley-2007` | Timperley, H., Wilson, A., Barrar, H., & Fung, I. (2007). *Teacher Professional Learning and Development: Best Evidence Synthesis Iteration*. New Zealand Ministry of Education. | https://www.educationcounts.govt.nz/publications/series/2515/15341 | authoritative government publication | Timperley, Wilson, Barrar, and Fung's named evidence-synthesis record. | Authorship by Day or proof that Day authored the evidence synthesis. | 2026-07-21 |

## 4. Claim matrix（含 Crossref 核验注记）

| claim ID | field path | safe wording | content nature (L1/L2/L3) | source ID | locator if actually available | forbidden extension |
| --- | --- | --- | --- | --- | --- | --- |
| `goodson-identity-2018` | `scholars.ivor-f-goodson.content.en.academic_identity` | The 2018 University of Brighton page identifies Ivor F. Goodson as Professor of Learning Theory and describes Brighton/Tallinn affiliations at that page's time. | L1 | `goodson-brighton-2018-profile` | none — web page viewed without a stable numbered section or paragraph locator | Do not state that he holds the same post or affiliations in 2026. |
| `goodson-research-profile` | `scholars.ivor-f-goodson.content.en.overview` | The BERA profile describes work involving curriculum, life-history approaches, and teachers' lives and work. | L1 | `goodson-bera-profile` | none — web profile viewed without a stable numbered section or paragraph locator | Do not expand this to a complete biography, a current job title, or a claim that every teacher-life-history approach is his. |
| `goodson-work-2013` | `scholars.ivor-f-goodson.content.en.representative_works[0]` | Goodson is the author of the 2013 *Developing Narrative Theory: Life Histories and Personal Representation*. | L1 | `goodson-2013-narrative-theory` | none — publisher web record has no stable page locator | Do not treat the work as proof that Goodson originated all narrative or life-history research. |
| `goodson-work-1992-editor` | `scholars.ivor-f-goodson.content.en.representative_works[1]` | Goodson is the editor, not the sole author, of the 1992 edited volume *Studying Teachers' Lives*. | L1 | `teacher-life-history-goodson-1992` | Google Books bibliographic details: "Editor Ivor Goodson" | Do not call the edited volume a single-authored Goodson book. |
| `goodson-work-2001-coauthors` | `scholars.ivor-f-goodson.content.en.representative_works[2]` | Goodson and Patricia J. Sikes are coauthors of the specific 2001 *Life History Research in Educational Settings: Learning from Lives*. | L1 | `teacher-life-history-goodson-sikes-2001` | WorldCat/OCLC 45873740 bibliographic details: "Ivor Goodson; Patricia J Sikes" | Do not infer an enduring collaboration network, mentorship, or any other relationship. |
| `goodson-theory-relation` | `theoryScholars.teacher-life-history-research:ivor-f-goodson.role` | Editorially, Goodson is a bounded `key_contributor` candidate for `teacher-life-history-research`, a qualitative research tradition rather than a closed causal theory. | L2 | `goodson-bera-profile`; `goodson-2013-narrative-theory`; `teacher-life-history-goodson-1992`; `teacher-life-history-goodson-sikes-2001` | none — no source directly declares the corpus relation | Do not call Goodson a founder, sole founder, creator, father of, or the exclusive owner of the tradition. |
| `goodson-public-status` | `scholars.ivor-f-goodson.status` | The candidate remains draft until a human completes claim-level review. | L3 | `goodson-brighton-2018-profile`; `goodson-bera-profile` | none — review record does not exist | Do not add reviewer, approval, review date, or `verifiedAt`. |
| `day-identity-profile` | `scholars.christopher-day.content.en.academic_identity` | The University of Nottingham profile identifies Christopher Day as Professor of Education in its School of Education. | L1 | `day-nottingham-profile` | none — web profile viewed without a stable numbered section or paragraph locator | Do not derive a complete career history, a founder claim, or private relationships. |
| `day-research-profile` | `scholars.christopher-day.content.en.overview` | The profile states research interests including teacher professionalism, teachers' work and lives, and professional learning and development. | L1 | `day-nottingham-profile` | none — web profile viewed without a stable numbered section or paragraph locator | Do not treat the profile as proof that Day authored every teacher-development model or an entire field. |
| `day-work-1999-author` | `scholars.christopher-day.content.en.representative_works[0]` | Day is the author of the 1999 *Developing Teachers: The Challenge of Lifelong Learning*. | L1 | `day-1999-developing-teachers` | none — publisher web record has no stable page locator | Do not call it the founding text of a single closed theory. |
| `day-work-2006-coauthors` | `scholars.christopher-day.content.en.representative_works[1]` | Day, Kington, Stobart, and Sammons are the four coauthors of the specific 2006 article. | L1 | `teacher-development-day-etal-2006` | Crossref DOI metadata: Day, C.; Kington, A.; Stobart, G.; Sammons, P.; 32(4), 601–616; 2006-08; journal-article; Wiley | Do not reduce the article to Day alone or infer a wider personal/research network. |
| `day-other-models-boundary` | `scholars.christopher-day.content.en.attribution_boundaries` | The Guskey (2002), Clarke–Hollingsworth (2002), and Timperley et al. (2007) records belong to other authors' models or evidence synthesis and are not Day works. | L1 | `teacher-development-guskey-2002`; `teacher-development-clarke-hollingsworth-2002`; `teacher-development-timperley-2007` | Crossref DOI metadata: Guskey sole author, Teachers and Teaching 8(3), 381–391, 2002-08, Informa UK Ltd.; Clarke & Hollingsworth two authors, Teaching and Teacher Education 18(8), 947–967, 2002-11, Elsevier BV; Timperley et al. government publication. | Do not attribute those models, their mechanisms, or their authorship to Day. |
| `day-theory-relation` | `theoryScholars.teacher-professional-development-theory:christopher-day.role` | Editorially, Day is a bounded `key_contributor` candidate for the plural, editorial `teacher-professional-development-theory` entry. | L2 | `day-nottingham-profile`; `day-1999-developing-teachers`; `teacher-development-day-etal-2006` | none — no source directly declares the corpus relation | Do not call Day a founder, sole founder, creator, father of, or the author of a single universal teacher-development theory. |
| `day-public-status` | `scholars.christopher-day.status` | The candidate remains draft until a human completes claim-level review. | L3 | `day-nottingham-profile`; `day-1999-developing-teachers` | none — review record does not exist | Do not add reviewer, approval, review date, or `verifiedAt`. |

## 5. Attribution boundaries

- The 2018 University of Brighton title and affiliations are time-bounded to that page; they are not a claim about the present.
- The `teacher-life-history-research` relation is an L2 editorial, bounded `key_contributor` candidate. It is not a direct source statement and it is not a founder claim.
- The 1992 record establishes an editor role; it must not be compressed into sole authorship.
- The 2001 record establishes only the named Goodson–Pat Sikes coauthorship for that work. It does not establish mentorship, a school, or a wider collaboration network.
- The corpus's historical DOI record `teacher-life-history-josselson-2007` is not used to establish Goodson's identity or relation, and this batch does not repair that record.
- `teacher-professional-development-theory` is a plural editorial umbrella, not a single theory created by one scholar.
- Day is the 1999 work's author. The 2006 article has four named coauthors: Day, Kington, Stobart, and Sammons.
- Guskey (2002), Clarke–Hollingsworth (2002), and Timperley et al. (2007) remain other authors' model or evidence-synthesis records; none may be attributed to Day.
- No personal relationship, scholarly lineage, influence, or long-term collaboration network is inferred from shared subject matter, coauthorship, or institutional context.

## 6. Crossref 核验变更日志

| 变更 | 详情 |
| --- | --- |
| `teacher-development-day-etal-2006` | 新增 Crossref 核验注记：DOI、完整标题（含副标题）、四位作者、年份 2006-08、BERJ 32(4)、页码 601–616、Wiley 出版、journal-article 类型。R0 的标题省略了副标题，本次补全。 |
| `teacher-development-clarke-hollingsworth-2002` | 新增 Crossref 核验注记：DOI、两位作者（Clarke, David; Hollingsworth, Hilary）、年份 2002-11、Teaching and Teacher Education 18(8)、页码 947–967、Elsevier BV 出版、journal-article 类型。 |
| `teacher-development-guskey-2002` | 新增 Crossref 核验注记：DOI、唯一作者 Guskey, Thomas R.、年份 2002-08、Teachers and Teaching 8(3)、页码 381–391、Informa UK Limited 出版、journal-article 类型。 |
| `day-work-2006-coauthors` | locator 从 `none — DOI landing record has no stable page locator` 升级为 `Crossref DOI metadata: Day, C.; Kington, A.; Stobart, G.; Sammons, P.; 32(4), 601–616; 2006-08; journal-article; Wiley`。 |
| `day-other-models-boundary` | locator 从 `none — these cited records are outside the person-specific source set and no stable page locator is used here` 升级为 `Crossref DOI metadata: Guskey sole author...; Clarke & Hollingsworth two authors...; Timperley et al. government publication.` |

## 7. Discrepancy assessment

R0 中所有可 Crossref 核验的 DOI 记录与 Crossref 元数据一致。未发现需要修正的事实性差异。具体而言：

- **Day et al. 2006**：R0 标题省略副标题 `stable and unstable identities`，不影响实质但 R1 已补全。作者、年份、卷期页、期刊名完全一致。
- **Clarke & Hollingsworth 2002**：R0 与 Crossref 完全一致。
- **Guskey 2002**：R0 与 Crossref 完全一致。
- **其余非 DOI 来源**（Brighton 新闻页、BERA profile、Routledge/Falmer 出版社页、Google Books、WorldCat、Nottingham staff profile、NZ MoE）不在本次 Crossref 核验范围内，维持 R0 的 source-type 分类和边界声明。

## 8. Draft/stop decision

| candidate | evidence decision | reason | corpus decision |
| --- | --- | --- | --- |
| Ivor F. Goodson | No STOP condition triggered | The official/person-specific pages and existing work records identify the same scholar, distinguish the 1992 editor role and the 2001 Goodson–Sikes coauthorship, and support only a bounded relation. | `DRAFT` |
| Christopher Day | No STOP condition triggered | The official Nottingham profile and existing work records identify the same scholar, distinguish the 1999 author role and the four 2006 coauthors, and support only a bounded relation. | `DRAFT` |

Both proposed TheoryScholar relations are L2 editorial `key_contributor` candidates only: Goodson for `teacher-life-history-research`, and Day for `teacher-professional-development-theory`. They are not founder relations. The source package supports draft authoring, but no publication decision.

## 9. Next steps

- **R2**：扩源 + locator 升级。将 Crossref 返回的完整标题、出版者、文章类型写入 source register；尝试 ORCID 核验 Day 和 Goodson 的身份记录；补 Day 1999 著作的 ISBN（Crossref 目前未返回）。
- **R3**：人审定 L1/L2/L3 → 入 `src/data/corpus/content-batches/<date>-goodson-day.ts` → `content:check` → `db:seed` → `build`，published-only 与 Education/Sociology 边界保持不变。
- **源策略校准**：Crossref 是稳定的主核验路径；OpenAlex 免费层有每日预算限制；WebFetch 走共享 IP 对学术 API 易 429。

## 10. Future human-review requirements

Before either draft can be published, a qualified human reviewer must independently inspect each claim, retain a real claim-level locator where the source provides one, record their role and review decision, record the review date, and provide explicit publication approval. The reviewer must also decide whether a `verifiedAt` value is warranted for each persisted claim rather than copying a batch access date.

Until that work is complete, retain `draft`, no public surface, and the public-facing semantics: **Sources listed · editorial synthesis · claim-level review pending**.
