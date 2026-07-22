# Life Course R2 扩源产物：ContentSource 片段（DRAFT — 不落库）

> 日期：2026-07-20
> 来源核验：Crossref 本地代理 127.0.0.1:7897，HTTP 200，mailto=research@syrtag.com
> 状态：draft，待人审定 L1/L2/L3 后并入 content-batches；不进 seed-content.ts

## 核验通过的 L1 来源（2 条）

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
    "ISBN 9780511571114",
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
  ],
};
```

## pending 来源（1 条，不进 L1）

```typescript
// 1974 原版无 Crossref DOI；Crossref 命中的 2018 Routledge 重印版不可冒充原版。
// 本条暂不入 ContentSource；待 WorldCat/OCLC 或图书馆物理核验后补。
const elder1974ChildrenOfTheGreatDepression_PENDING = {
  id: "elder-1974-children-of-the-great-depression",
  status: "pending" as const,
  reason: "1974 UChicago Press 原版无 DOI；Crossref 返回 2018 Routledge book-chapter，出版年/出版社/载体不符，不可等同。Google Books API 本轮 429。",
  nextStep: "WorldCat/OCLC 号核验或图书馆物理核验",
};
```

## Zotero 录入指引（R2 可选并行）

Zotero 里录 Elder 1996 / 2000 可用 DOI 抓取（同 Elder 1998 流程）：
- `10.1017/cbo9780511571114.004`（Elder 1996）
- `10.1037/10520-020`（Elder 2000）

录入后用 `scripts/zotero-export.ts` 产出 citekey 映射，接入 source register 的 `bbt citekey` 列。
