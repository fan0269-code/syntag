# Life Course Theory — R0 evidence pack（试跑）

> Access date: 2026-07-20
> Decision: draft-only; 本 pack 仅验证科研 skill 流程，不落库，不产生 published 实体。
> Publication boundary: 本 pack 不进入 static params / sitemap / 索引 / 图谱。所有内容保持 draft，直到 R2/R3 完成 claim-level locator 与人审。

## 1. Verification summary（流程跑通情况）

本试跑验证 `/syrtag-research` skill 的检索-核验-产物链路。结果：

| 源 | 路径 | HTTP | 结果 |
| --- | --- | --- | --- |
| Crossref | 本地代理 `127.0.0.1:7897` curl | 200 | 成功，拿到 Elder 1998 真实元数据 |
| OpenAlex | 本地代理 + WebFetch | 429 | 免费层每日预算耗尽（daily budget $0，reset midnight UTC） |
| Google Books | WebFetch | 429 | 共享 IP 限流 |

**流程结论**：Crossref 走本地代理是稳定主路径；OpenAlex 免费层有隐形每日预算；WebFetch 走共享 IP 对学术 API 易 429。两点已回写进 SKILL.md 注意事项。

**skill 拦下的错误（核心价值示范）**：二手清单常将 DOI `10.1111/j.1467-8624.1998.tb06138.x` 当作 Elder 1998 "The Life Course as Developmental Theory"。Crossref 核验显示该 DOI 实际指向 Davies, P. T., & Cummings, E. M. (1998). "Exploring Children's Emotional Security..." *Child Development*, 69(1), 124–139。若盲信二手清单入库，会把 Davies 文章当作 Elder 1998 代表作，造成 L1 事实错误并误导公开页。skill 拦截，记入 §4。

## 2. Source register

| source ID | citation | URL | source type | directly supports | does not support | accessed date |
| --- | --- | --- | --- | --- | --- | --- |
| `elder-1998-life-course-developmental-theory` | Elder, G. H. (1998). The life course as developmental theory. *Child Development*, 69(1), 1–12. | https://doi.org/10.1111/j.1467-8624.1998.tb06128.x | doi | Glen H. Elder 作者身份；1998 年；Child Development 69(1)；页码 1–12；文章标题 "The Life Course as Developmental Theory"。 | Elder 是 life course theory 的唯一创始人；这是首篇 life course 文献；文章对理论的具体论证内容（需 PDF locator，见 §6）。 | 2026-07-20 |
| `elder-1998-life-course-developmental-theory-jstor` | JSTOR stable DOI for the same article. | https://doi.org/10.2307/1132065 | doi | 同一文章的另一稳定 DOI（JSTOR），作交叉校验。 | 任何超出 §2 直接支持的事实。 | 2026-07-20 |
| `elder-1996-human-lives-changing-societies` | Elder, G. H. (1996). Human lives in changing societies: Life course and developmental insights. In *Developmental Science* (pp. 31–62). Cambridge University Press. | https://doi.org/10.1017/cbo9780511571114.004 | doi | Glen H. Elder 作者身份；1996 年；Cambridge University Press；收录于 Developmental Science 编著；页码 31–62；ISBN 9780511571114。 | Elder 是 life course theory 唯一创始人；该章节为某单一理论的奠基文本。 | 2026-07-20 |
| `elder-2000-life-course-theory-encyclopedia` | Elder, G. H. (2000). Life course theory. In *Encyclopedia of Psychology, Vol. 5* (pp. 50–52). Oxford University Press. | https://doi.org/10.1037/10520-020 | doi | Glen H. Elder 作者身份；2000 年；Oxford University Press；百科条目 "Life course theory"；页码 50–52。 | 百科条目作为深度论证来源；条目对理论的完整学术史表述。 | 2026-07-20 |
| `elder-1974-children-of-the-great-depression` | Elder, G. H. (1974). *Children of the Great Depression*. University of Chicago Press. | (pending — 原 1974 版无 Crossref DOI；Google Books API 429 本轮未核验；WorldCat/OCLC 待补) | (pending) | (pending — 待 WorldCat/OCLC 或物理/图书馆核验) | 不得用 Crossref 返回的 2018 Routledge 重印版 book-chapter（DOI 10.4324/9780429501739-*）冒充 1974 原版；二者出版年、出版社、载体不同。 | 2026-07-20 |

Crossref 作为核验渠道记录于本 pack；落库 `source_kind` 仍为 `doi`，URL 指向 `doi.org` 解析的一手记录。OpenAlex（budget 耗尽）与 WebFetch（IP 限流）本轮未成功贡献新事实，不计入 register。

## 3. Claim matrix

| claim ID | field path | safe wording | content nature | source ID | locator if available | forbidden extension |
| --- | --- | --- | --- | --- | --- | --- |
| `elder-1998-authorship` | `theories.life-course-theory.content.en.origins` | Glen H. Elder 是 *Child Development* 69(1) 1998 文章 "The Life Course as Developmental Theory" 的作者。 | L1 | `elder-1998-life-course-developmental-theory` | none — DOI 元数据无 stable section locator | 不得延伸为 Elder 是 life course theory 唯一创始人或该传统的全部归属人。 |
| `elder-1998-citation` | `theories.life-course-theory.content.en.representative_works` | 该文发表于 1998 年 *Child Development* 第 69 卷第 1 期第 1–12 页。 | L1 | `elder-1998-life-course-developmental-theory` | none — DOI landing 无页内 stable locator | 不得延伸为这是 life course theory 的首篇文献或唯一奠基文本。 |
| `elder-1998-argument-content` | `theories.life-course-theory.content.en.core_arguments` | （待 R1/R2 Zotero 本地 PDF 补具体主张的页码定位。） | L3 | （pending） | none — 待 Zotero citekey `elder-1998-life-course-developmental-theory` PDF 注解 | 在补 locator 前不得写入具体论证断言。 |

## 4. Rejected DOI record（skill 拦截记录）

- **candidate DOI（来自二手清单）**：`10.1111/j.1467-8624.1998.tb06138.x`
- **verification via Crossref**：实际为 Davies, P. T., & Cummings, E. M. (1998). Exploring Children's Emotional Security as a Mediator of the Link between Marital Relations and Child Adjustment. *Child Development*, 69(1), 124–139.
- **action**：拒绝作为 Elder 1998 来源；不落库；不入 `content-batches`。
- **lesson**：二手 DOI 必须经 Crossref 核验真实标题/作者/页码后才能进 L1；同卷同期的相邻 DOI 号（tb06128 vs tb06138）极易混淆，是高发错误类型。

### 4.1 Rejected 2018 reprint-as-1974-original（R2 拦截）

- **candidate**：将 Crossref 搜得的 *Children of the Great Depression* 记录当作 Elder 1974 原版。
- **verification via Crossref**：实际返回 2018 年 Routledge 重印版的 book-chapter（DOI `10.4324/9780429501739-14/-15/-2` 等），出版年 2018、出版社 Routledge、类型 book-chapter，与 1974 University of Chicago Press 原版（书，无 DOI）不是同一载体记录。
- **action**：不作为 1974 原版 L1 来源；1974 原版降级为 L3 pending，待 WorldCat/OCLC 或图书馆物理核验。
- **lesson**：年代久远的奠基性著作常无 DOI；Crossref 命中的可能是重印/章节，不能默认等同原版。需 publisher/year/type 三字段比对。

## 5. ContentSource snippet draft（不落库）

```typescript
import type { ContentSource } from "../../templates/theory-template.ts";

const elder1998LifeCourseDevelopmentalTheory: ContentSource = {
  id: "elder-1998-life-course-developmental-theory",
  citation: "Elder, G. H. (1998). The life course as developmental theory. Child Development, 69(1), 1–12.",
  url: "https://doi.org/10.1111/j.1467-8624.1998.tb06128.x",
  source_kind: "doi",
  evidence_level: "L1",
  supports: [
    "Glen H. Elder authored the 1998 article 'The Life Course as Developmental Theory'",
    "Published in Child Development, volume 69, issue 1, pages 1–12",
  ],
};
```

此片段为 draft，**不进入** `src/data/corpus/content-batches/`。R2/R3 完成 locator 补充与人审后再入批次。

## 6. Next steps（R1/R2/R3）

- **R1（2026-07-20 已完成）**：本地 Zotero 7 + Better BibTeX 已装；`theories/life-course-theory` collection 已建；Elder 1998 通过 DOI `10.1111/j.1467-8624.1998.tb06128.x` 录入（Zotero key `GEVCBX8J`，BBT citekey `elderLifeCourseDevelopmental1998`，元数据全对）。`scripts/zotero-export.ts` 跑通，自动产出 ContentSource 片段 + source register 行 + Zotero↔Syrtag citekey 映射。映射记于 §7。
- **R2**：扩源 + locator 升级。挂 Elder 1998 PDF，用 Zotero 注解（`/api/users/0/items?itemType=annotation`）把 §3 的 `elder-1998-argument-content` locator 从 `none` 升级为 `pp. X–Y (elderLifeCourseDevelopmental1998, §...)`。补 Elder 1974 *Children of the Great Depression*（书，需 Google Books/WorldCat）与 Elder 1996 book-chapter、Elder 2000 encyclopedia entry。
- **R3**：人审定 L1/L2/L3 → 入 `src/data/corpus/content-batches/<date>-life-course.ts` → `content:check` → `db:seed` → `build`，published-only 与 Education/Sociology 边界保持不变。
- **源策略校准**：OpenAlex 免费层每日预算不可靠，长期以 Crossref + ORCID + Google Books + WorldCat 为主，OpenAjax 仅作辅助（需 Premium key 或日预算内使用）。

## 7. Zotero ↔ Syrtag 映射（R1 产物）

经 `scripts/zotero-export.ts` 导出确认：

| Zotero item key | BBT citekey (camelCase) | Syrtag ContentSource.id (kebab) | source_kind | URL |
| --- | --- | --- | --- | --- |
| `GEVCBX8J` | `elderLifeCourseDevelopmental1998` | `elder-1998-the-life-course-as-developmental-theory` | `doi` | https://doi.org/10.1111/j.1467-8624.1998.tb06128.x |

导出的 ContentSource 片段（draft，未落库）：

```typescript
const elder1998TheLifeCourseAsDevelopmentalTheory: ContentSource = {
  id: "elder-1998-kebab-title",
  citation: "Elder, G. H. (1998). The Life Course as Developmental Theory. Child Development, 69(1), 1-12.",
  url: "https://doi.org/10.1111/j.1467-8624.1998.tb06128.x",
  source_kind: "doi",
  evidence_level: "L1",
  supports: [
    "Elder, G. H. authored \"The Life Course as Developmental Theory\"",
    "Published in 1998",
    "In Child Development 69(1), 1-12",
    "DOI 10.1111/j.1467-8624.1998.tb06128.x",
  ],
};
```

locator 待 R2 Zotero PDF 注解接入后补。
