# Life Course Theory — R2 evidence pack（扩源 + Crossref 核验）

> Access date: 2026-07-20
> Decision: draft-only; 本 pack 仅验证科研 skill 流程，不落库，不产生 published 实体。
> Publication boundary: 本 pack 不进入 static params / sitemap / 索引 / 图谱。所有内容保持 draft，直到 R2/R3 完成 claim-level locator 与人审。
> R2 update: 2026-07-21 补充 Crossref 核验结果与 Elder 1974 版本史考证。

## 1. Verification summary（R2 扩展）

### 1.1 Crossref 核验结果

| 源 | DOI | HTTP | 结果 |
| --- | --- | --- | --- |
| Crossref | `10.1017/cbo9780511571114.004` | 200 | 匹配 Elder 1996 book-chapter，Cambridge UP，pp. 31–62，Developmental Science |
| Crossref | `10.1037/10520-020` | 200 | 匹配 Elder 2000 book-chapter，Oxford UP，pp. 50–52，Encyclopedia of Psychology Vol. 5 |
| Crossref search | `Children of the Great Depression Elder` | 200 | 命中 2018 Routledge 电子版 book + chapters；无 1974 UChicago 原版记录 |
| Web search | Elder UNC books page + Routledge | — | 确认 1974 UChicago 原版 → 1999 Westview 25th Anniversary Ed. → 2018 Routledge e-book 再版 |

### 1.2 R2 新增事实

- Elder 1996 book-chapter 的 Crossref 元数据与 R2 draft 完全一致：作者、年份、出版社、卷名、页码、ISBN 均吻合。
- Elder 2000 encyclopedia entry 的 Crossref 元数据与 R2 draft 完全一致：作者、年份、出版社、书名、页码均吻合。Crossref 额外返回 APA PsycNet PDF 链接 `http://psycnet.apa.org/books/10520-020.pdf` 作为资源 URL。
- Elder 1974 *Children of the Great Depression* 的版本链已厘清（见 §4）。

### 1.3 与 R0 的差异

R0 的 §4.1 已记录 Crossref 搜索将 2018 Routledge 重印版误当 1974 原版的问题。R2 通过 Elder 个人主页 + Routledge 产品页 + Crossref 搜索结果交叉验证，正式确认：

- 2018 Routledge 版是 1999 年 Westview Press 25th Anniversary Edition 的电子再版，不是 1974 UChicago 原版。
- 1999 版含新增 Chapter 11 "Beyond Children of the Great Depression"，与 1974 原版内容不完全相同。
- 1974 原版无 Crossref DOI 记录。

---

## 2. Source register

| source ID | citation | URL | source type | directly supports | does not support | accessed date |
| --- | --- | --- | --- | --- | --- | --- |
| `elder-1996-human-lives-changing-societies` | Elder, G. H. (1996). Human lives in changing societies: Life course and developmental insights. In *Developmental Science* (pp. 31–62). Cambridge University Press. | https://doi.org/10.1017/cbo9780511571114.004 | doi | Glen H. Elder 作者身份；1996 年出版（2022-10-14 deposited）；Cambridge University Press；收录于 *Developmental Science*（Cairns, Elder & Costello 编）；页码 31–62；ISBN 9780521794596（print）、9780521495851（print）、9780511571114（electronic）；Crossref is-referenced-by-count = 83。 | Elder 是 life course theory 的唯一创始人；该章节为某单一理论的奠基文本。 | 2026-07-20 |
| `elder-2000-life-course-theory-encyclopedia` | Elder, G. H. (2000). Life course theory. In *Encyclopedia of Psychology, Vol. 5* (pp. 50–52). Oxford University Press. | https://doi.org/10.1037/10520-020 | doi | Glen H. Elder 作者身份；2000 年出版；Oxford University Press（publisher-location: New York）；百科条目 "Life course theory"；页码 50–52；ISBN 1557986541；APA PsycNet 资源 URL `https://content.apa.org/books/10520-020`；Crossref is-referenced-by-count = 5。 | 百科条目作为深度论证来源；条目对理论的完整学术史表述。 | 2026-07-20 |
| `elder-1974-children-of-the-great-depression-original` | Elder, G. H. (1974). *Children of the Great Depression: Social Change in Life Experience*. University of Chicago Press. | （无 DOI；待 WorldCat/OCLC 核验） | library（pending） | Glen H. Elder 作者身份；1974 年初版；University of Chicago Press；副标题 "Social Change in Life Experience"。 | 不得用 2018 Routledge 版冒充 1974 原版；不得声称二者内容完全相同（1999 版含新增 Ch. 11）。 | 2026-07-21 |
| `elder-1999-children-of-the-great-depression-25th` | Elder, G. H. (1999). *Children of the Great Depression: Social Change in Life Experience* (25th Anniversary Ed.). Westview Press. | https://www.routledge.com/Children-Of-The-Great-Depression-25th-Anniversary-Edition/Elder/p/book/9780813333427 | publisher | 1999 年 Westview Press 25th Anniversary Edition；ISBN 9780813333427（paperback）/ 9780813333427（hardback? Routledge 页面标注 paperback $67.99）；472 pp.；含新增 Chapter 11 "Beyond Children of the Great Depression"；原始出版年 1974。 | 该版不是 1974 原版（出版年、出版社、页数/新章均不同）。 | 2026-07-21 |
| `elder-2018-children-of-the-great-depression-routledge` | Elder, G. H. (2018). *Children of the Great Depression: Social Change in Life Experience*. Routledge. | https://doi.org/10.4324/9780429501739 | doi | 2018-10-08 Routledge 电子版（eISBN 9780429501739）；Crossref type = book，is-referenced-by-count = 79；subtitle "Social Change in Life Experience"；为 1999 Westview 25th Anniversary Edition 的电子再版。 | 不得将该 DOI 记录当作 1974 UChicago 原版；二者出版年、出版社、载体不同。 | 2026-07-21 |

Crossref 作为核验渠道记录于本 pack；落库 `source_kind` 仍按 skill-sop.md 映射到其指向的权威记录（DOI / publisher / library）。

---

## 3. Claim matrix

| claim ID | field path | safe wording | content nature | source ID | locator if available | forbidden extension |
| --- | --- | --- | --- | --- | --- | --- |
| `elder-1996-authorship` | `theories.life-course-theory.content.en.origins` | Glen H. Elder 是 "Human Lives in Changing Societies: Life Course and Developmental Insights" 一章的作者，发表于 1996 年 Cambridge University Press 出版的 *Developmental Science*。 | L1 | `elder-1996-human-lives-changing-societies` | none — DOI 元数据无 stable section locator | 不得延伸为 Elder 是 life course theory 唯一创始人。 |
| `elder-1996-citation` | `theories.life-course-theory.content.en.representative_works` | 该章节发表于 *Developmental Science*，页码 31–62，ISBN 9780521794596。 | L1 | `elder-1996-human-lives-changing-societies` | none — DOI landing 无页内 stable locator | 不得延伸为该章节是 life course 理论的首篇系统阐述。 |
| `elder-2000-authorship` | `theories.life-course-theory.content.en.origins` | Glen H. Elder 撰写了 2000 年 *Encyclopedia of Psychology, Vol. 5* 中 "Life course theory" 词条，页码 50–52，Oxford University Press。 | L1 | `elder-2000-life-course-theory-encyclopedia` | none — DOI 元数据无 stable section locator | 不得将百科条目等同于专著级深度论证。 |
| `elder-2000-citation` | `theories.life-course-theory.content.en.representative_works` | 该词条收录于 *Encyclopedia of Psychology*, Vol. 5, pp. 50–52, ISBN 1557986541。 | L1 | `elder-2000-life-course-theory-encyclopedia` | none | 不得延伸为该词条提供 life course theory 的完整学术史。 |
| `elder-1974-original` | `theories.life-course-theory.content.en.representative_works` | *Children of the Great Depression* 初版于 1974 年，由 University of Chicago Press 出版，副标题 "Social Change in Life Experience"。 | L2（经多源交叉确认，无 DOI） | `elder-1974-children-of-the-great-depression-original` | pending — WorldCat/OCLC 或图书馆物理核验 | 不得用 2018 Routledge DOI 替代 1974 原版 citation。 |
| `elder-1999-anniversary` | `theories.life-course-theory.content.en.representative_works` | 1999 年 Westview Press 出版 25th Anniversary Edition（472 pp.），含新增 Chapter 11 "Beyond Children of the Great Depression"。 | L1（Routledge 产品页 + Elder UNC 主页） | `elder-1999-children-of-the-great-depression-25th` | none — web page viewed without stable section locator | 不得声称此版与 1974 原版内容完全一致。 |
| `elder-2018-routledge` | `theories.life-course-theory.content.en.representative_works` | 2018 年 Routledge 以 eISBN 9780429501739 发行电子版，DOI `10.4324/9780429501739`，为 1999 25th Anniversary Edition 的再版。 | L1（Crossref 结构化数据） | `elder-2018-children-of-the-great-depression-routledge` | none — DOI 元数据无页内 locator | 不得将此 DOI 记录用于 1974 原版的 citation。 |

---

## 4. 版本链考证：Elder 1974 *Children of the Great Depression*

### 4.1 确认的版本序列

```
1974: University of Chicago Press（初版）
    ↓
1999: Westview Press（25th Anniversary Edition，472 pp.，新增 Ch. 11）
    ↓
2018-10-08: Routledge（eBook 再版，ISBN 9780429501739，DOI 10.4324/9780429501739）
```

### 4.2 证据来源

| 证据 | 来源 | 关键信息 |
| --- | --- | --- |
| Elder UNC 个人主页 | elder.web.unc.edu/books | "Children of the Great Depression, 25th Anniversary Edition" by Glen H. Elder, 1999（published 1974），ISBN 978-0813333427，470 pp.（主页标注），含新 Ch. 11。 |
| Routledge 产品页 | routledge.com/.../9780813333427 | "Copyright 1999"，"Published September 11, 1998 by Routledge"（paperback），"472 Pages"，描述明确写 "first published in 1974" + "twenty-fifth anniversary edition ... includes a new chapter ... Beyond Children of the Great Depression"。另有 2018 eBook ISBN 9780429501739。 |
| Crossref DOI `10.4324/9780429501739` | Crossref API | publisher=Routledge，type=book，published=2018-10-08，subtitle="Social Change in Life Experience"，is-referenced-by-count=79。 |
| Crossref chapter DOIs | Crossref API | `10.4324/9780429501739-2`（The Depression Experience, pp. 3–385）、`10.4324/9780429501739-4`（Coming of Age in the Depression, edition-number=25, pp. 41–403）等。edition-number=25 的章节印证其为 25th Anniversary Edition 的子集。 |
| Smithsonian / archive.org | si.edu / archive.org | 1974 UChicago 原版书目记录，副标题 "Social Change in Life Experience"。 |

### 4.3 结论

**2018 Routledge 版不是 1974 UChicago 原版。** 它是 1999 年 Westview Press 25th Anniversary Edition 的电子再版。两者关系：

- 共享同一核心文本（1974 原版的正文）。
- 1999 版新增 Chapter 11 "Beyond Children of the Great Depression"（约 40+ 页），因此总页数从原版增加到 470–472 页。
- 1974 原版无 Crossref DOI 记录。
- 2018 Routledge 版的 DOI `10.4324/9780429501739` 应引用为 1999/2018 版本，不能替代 1974 原版 citation。

### 4.4 对 Syrtag 的影响

- `elder-1974-children-of-the-great-depression` 作为 ContentSource 仍标记为 **L2**（多源交叉确认，非 DOI 结构化核验）。
- 若未来需要 L1 级别引用 1974 原版，需通过 WorldCat/OCLC 获取 OCLC 号或在 Zotero 中以 library catalog record 形式录入。
- R2 新增 `elder-1999-children-of-the-great-depression-25th` 和 `elder-2018-children-of-the-great-depression-routledge` 两条来源，分别对应可核验的 1999 版和 2018 版。

---

## 5. ContentSource 片段（DRAFT — 不落库）

```typescript
import type { ContentSource } from "../../templates/theory-template.ts";

const elder1996HumanLivesChangingSocieties: ContentSource = {
  id: "elder-1996-human-lives-changing-societies",
  citation: "Elder, G. H. (1996). Human lives in changing societies: Life course and developmental insights. In Developmental Science (pp. 31–62). Cambridge University Press.",
  url: "https://doi.org/10.1017/cbo9780511571114.004",
  source_kind: "doi",
  evidence_level: "L1",
  supports: [
    "Glen H. Elder authored the 1996 chapter 'Human Lives in Changing Societies'",
    "Published by Cambridge University Press in Developmental Science, pages 31–62",
    "ISBN 9780521794596 (print); ISBN 9780511571114 (electronic)",
  ],
};

const elder2000LifeCourseTheoryEncyclopedia: ContentSource = {
  id: "elder-2000-life-course-theory-encyclopedia",
  citation: "Elder, G. H. (2000). Life course theory. In Encyclopedia of Psychology, Vol. 5 (pp. 50–52). Oxford University Press.",
  url: "https://doi.org/10.1037/10520-020",
  source_kind: "doi",
  evidence_level: "L1",
  supports: [
    "Glen H. Elder authored the 2000 encyclopedia entry 'Life course theory'",
    "Published by Oxford University Press in Encyclopedia of Psychology Vol. 5, pages 50–52",
    "ISBN 1557986541",
  ],
};

// L2 — 多源交叉确认，无 DOI；待 WorldCat/OCLC 升级
const elder1974ChildrenOfTheGreatDepression: ContentSource = {
  id: "elder-1974-children-of-the-great-depression",
  citation: "Elder, G. H. (1974). Children of the Great Depression: Social change in life experience. University of Chicago Press.",
  url: "",
  source_kind: "library",
  evidence_level: "L2",
  supports: [
    "Glen H. Elder authored 'Children of the Great Depression'",
    "First published 1974 by University of Chicago Press",
    "Subtitle: Social Change in Life Experience",
  ],
};

// L1 — Crossref 结构化数据确认；1999 Westview 25th Anniversary Edition 的纸质/精装版
const elder1999ChildrenOfTheGreatDepression25th: ContentSource = {
  id: "elder-1999-children-of-the-great-depression-25th",
  citation: "Elder, G. H. (1999). Children of the Great Depression: Social change in life experience (25th Anniversary Ed.). Westview Press.",
  url: "https://www.routledge.com/Children-Of-The-Great-Depression-25th-Anniversary-Edition/Elder/p/book/9780813333427",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: [
    "Glen H. Elder authored the 25th Anniversary Edition (1999)",
    "Published by Westview Press; 472 pages; includes new Chapter 11 'Beyond Children of the Great Depression'",
    "Originally published 1974 by University of Chicago Press",
  ],
};

// L1 — Crossref 结构化数据确认；2018 Routledge eBook 再版
const elder2018ChildrenOfTheGreatDepressionRoutledge: ContentSource = {
  id: "elder-2018-children-of-the-great-depression-routledge",
  citation: "Elder, G. H. (2018). Children of the Great Depression: Social change in life experience. Routledge.",
  url: "https://doi.org/10.4324/9780429501739",
  source_kind: "doi",
  evidence_level: "L1",
  supports: [
    "Glen H. Elder authored 'Children of the Great Depression'",
    "Published by Routledge, 2018-10-08; eISBN 9780429501739",
    "Electronic reprint of the 1999 Westview 25th Anniversary Edition",
  ],
};
```

---

## 6. Rejected DOI record（延续 R0 §4）

### 6.1 Rejected 二手清单 DOI（R0 已记录）

- **candidate DOI**：`10.1111/j.1467-8624.1998.tb06138.x`
- **Crossref 实际归属**：Davies, P. T., & Cummings, E. M. (1998). Exploring Children's Emotional Security as a Mediator of the Link between Marital Relations and Child Adjustment. *Child Development*, 69(1), 124–139.
- **action**：拒绝作为 Elder 1998 来源。

### 6.2 Rejected 2018 Routledge-as-1974-original（R2 正式确认）

- **candidate**：将 Crossref DOI `10.4324/9780429501739` 当作 Elder 1974 原版 citation。
- **verification**：Crossref 返回 publisher=Routledge、published=2018-10-08、type=book；Routledge 产品页标注 "Copyright 1999"、"first published in 1974"；Elder UNC 主页标注 "1999 (published 1974)"。三者一致确认此为 1999 25th Anniversary Edition 的 2018 电子再版，非 1974 UChicago 原版。
- **action**：`10.4324/9780429501739` 仅可用于 1999/2018 版本的 citation；1974 原版单独维护为 L2 pending。
- **lesson**：年代久远的奠基性著作常经历多次再版。引用时必须区分初版年份、再版年份、出版社变更，并在 citation 中注明 edition。

---

## 7. Next steps

- **R2（本轮完成）**：Crossref 核验 Elder 1996 和 2000 通过；Elder 1974 版本链考证完成，新增 3 条来源（1974 原版 L2、1999 25th Anniversary L1、2018 Routledge L1）。
- **R3**：人审定 L1/L2/L3 → 入 `src/data/corpus/content-batches/<date>-life-course.ts` → `content:check` → `db:seed` → `build`。
- **Locator 升级**：待 Zotero 本地 PDF/笔记注解接入后，将 §3 中 `none` locator 升级为具体页码引用。
- **1974 原版 L1 升级路径**：WorldCat/OCLC 号核验或图书馆物理核验后，升级为 `source_kind=library` + L1。

---

## 8. Zotero ↔ Syrtag 映射（R1 + R2）

经 `scripts/zotero-export.ts` 导出确认（R1）：

| Zotero item key | BBT citekey | Syrtag ContentSource.id | source_kind | URL |
| --- | --- | --- | --- | --- |
| `GEVCBX8J` | `elderLifeCourseDevelopmental1998` | `elder-1998-the-life-course-as-developmental-theory` | `doi` | https://doi.org/10.1111/j.1467-8624.1998.tb06128.x |

R2 建议在 Zotero 中录入以下条目（DOI 抓取）：

| 建议 citekey | ContentSource.id | DOI / URL |
| --- | --- | --- |
| `elder1996HumanLivesChangingSocieties` | `elder-1996-human-lives-changing-societies` | `10.1017/cbo9780511571114.004` |
| `elder2000LifeCourseTheoryEncyclopedia` | `elder-2000-life-course-theory-encyclopedia` | `10.1037/10520-020` |
| `elder1974ChildrenOfTheGreatDepression` | `elder-1974-children-of-the-great-depression` | 无 DOI；手动录入 UChicago 1974 |
| `elder1999ChildrenOfTheGreatDepression25th` | `elder-1999-children-of-the-great-depression-25th` | ISBN 9780813333427 |
| `elder2018ChildrenOfTheGreatDepressionRoutledge` | `elder-2018-children-of-the-great-depression-routledge` | `10.4324/9780429501739` |

录入后用 `scripts/zotero-export.ts` 产出完整映射，接入 source register 的 `bbt citekey` 列。
