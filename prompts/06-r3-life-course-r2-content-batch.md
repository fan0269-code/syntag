# Codex 提示词：R3 Life Course R2 验证产物接入 content-batches

> 日期：2026-07-21
> 阶段：P1（内容语料）
> 前置条件：`docs/research/2026-07-20-life-course-evidence-r2.md`、`docs/research/2026-07-21-goodson-day-evidence-r1.md` 已存在
> 执行者：Codex
> 工作目录：`syntag/`

---

## 任务

把 Life Course R2 经 Crossref 核验通过的 3 条新 ContentSource 写入 `content-batches`，并修正 Goodson-Day batch 中 Day et al. 2006 的标题副标题。

**本轮不改变任何实体的 published/draft 状态，不扩学科范围，不修改 schema/migration。**

---

## 必须读取的文件（按顺序）

1. `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` — 现有 batch 模板
2. `src/data/corpus/content-batches/2026-07-19-goodson-day-draft-scholars.ts` — 需修正的 Goodson/Day batch
3. `src/data/templates/theory-template.ts` — `ContentSource` 类型定义
4. `src/lib/content-validation.ts` — `validateSeedCorpus()` 入口和批次加载规则
5. `docs/research/2026-07-20-life-course-evidence-r2.md` §5 — R2 ContentSource 片段
6. `docs/research/2026-07-21-goodson-day-evidence-r1.md` — R1 核验结论

---

## Step 1: 创建 Life Course R2 batch

新建文件：`src/data/corpus/content-batches/2026-07-21-life-course-evidence-r2.ts`

内容结构：

```typescript
import type { ContentSource } from "../../templates/theory-template.ts";

// 以下三条 ContentSource 来自 docs/research/2026-07-20-life-course-evidence-r2.md §5
// 全部经 Crossref 核验通过，L1

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
  ],
};

const elder1999ChildrenOfTheGreatDepression25th: ContentSource = {
  id: "elder-1999-children-of-the-great-depression-25th",
  citation: "Elder, G. H. (1999). Children of the Great Depression: Social Change in Life Experience (25th Anniversary Ed.). Westview Press / Routledge.",
  url: "https://www.routledge.com/Children-Of-The-Great-Depression-25th-Anniversary-Edition/Elder/p/book/9780813333427",
  source_kind: "publisher",
  evidence_level: "L1",
  supports: [
    "1999 Westview Press 25th Anniversary Edition, 472 pp., includes new Chapter 11",
    "Original publication year 1974; this edition is not the original",
  ],
};

export interface LifeCourseEvidenceR2SourcePool {
  elder1996HumanLivesChangingSocieties: ContentSource;
  elder2000LifeCourseTheoryEncyclopedia: ContentSource;
  elder1999ChildrenOfTheGreatDepression25th: ContentSource;
}

export interface LifeCourseEvidenceR2Batch {
  sources: ContentSource[];
}

export function createLifeCourseEvidenceR2Batch(
  sources: LifeCourseEvidenceR2SourcePool,
): LifeCourseEvidenceR2Batch {
  return {
    sources: [
      sources.elder1996HumanLivesChangingSocieties,
      sources.elder2000LifeCourseTheoryEncyclopedia,
      sources.elder1999ChildrenOfTheGreatDepression25th,
    ],
  };
}
```

**关键约束：**
- 新增 3 条 `id` 不能与 `src/data/corpus/shared/entities.ts` 中已有的 life course sources 重复
- 已有 IDs: `elder-1998-life-course`, `elder-johnson-crosnoe-2003-life-course`, `shanahan-2000-pathways-adulthood`, `mayer-2009-new-directions`, `alwin-2012-life-course-concepts`, `giele-elder-1998-methods`
- 新增 IDs (`elder-1996-human-lives-changing-societies`, `elder-2000-life-course-theory-encyclopedia`, `elder-1999-children-of-the-great-depression-25th`) 不与已有冲突
- `source_kind` 只能取合同枚举值：`doi` | `publisher` | `university` | `library` | `journal` | `authoritative_web`
- `evidence_level` 全部为 `"L1"`
- **不要**把 Elder 1974 原版作为 ContentSource 加入（无 DOI，待 WorldCat/OCLC 核验）

---

## Step 2: 修正 Goodson-Day Day et al. 2006 标题

打开 `src/data/corpus/content-batches/2026-07-19-goodson-day-draft-scholars.ts`，找到 Day et al. 2006 的 `ContentSource`：

将 `citation` 从：
```
Day, C., Kington, A., Stobart, G., & Sammons, P. (2006). The personal and professional selves of teachers. British Educational Research Journal, 32(4), 601–616.
```

改为：
```
Day, C., Kington, A., Stobart, G., & Sammons, P. (2006). The personal and professional selves of teachers: Stable and unstable identities. British Educational Research Journal, 32(4), 601–616.
```

同步更新该 source 的 `supports` 数组中对应描述（如包含旧标题）。

---

## Step 3: 运行验证

```bash
# 内容校验
npm run content:check

# 类型检查
npm run typecheck

# 运行内容相关测试
node --env-file-if-exists=.env --experimental-strip-types --test tests/content-validation.test.ts tests/seed-corpus-regression.test.ts
```

如果 `content:check` 报错，检查：
- 新 batch 是否被 `seed-content.ts` 正确引用/加载
- 如果 `validateSeedCorpus()` 要求 batch 必须通过特定接口，调整 `createLifeCourseEvidenceR2Batch` 的返回结构以匹配

如果 `typecheck` 报错，修复类型不匹配。

---

## Step 4: 确认无未授权变更

完成后检查：

```bash
git status --short
git diff --stat
```

确认：
- ✅ 只新增了 `2026-07-21-life-course-evidence-r2.ts`
- ✅ 只修改了 `2026-07-19-goodson-day-draft-scholars.ts`（Day 2006 标题）
- ❌ 没有修改 `prisma/schema.prisma`、migration、`.env`
- ❌ 没有修改 `tests/` 中的现有测试（除非发现回归）
- ❌ 没有引入 Psychology 或 Management 内容
- ❌ 没有 commit、push、deploy

---

## 验收标准

| 检查项 | 预期结果 |
|---|---|
| `npm run content:check` | 退出码 0，全绿 |
| `npm run typecheck` | 退出码 0，无错误 |
| `content-validation.test.ts` + `seed-corpus-regression.test.ts` | 全绿 |
| 新增 ContentSource 数量 | 3 条（Elder 1996, 2000, 1999） |
| Day et al. 2006 标题 | 含完整副标题 `Stable and unstable identities` |
| 无 schema/migration 变更 | 确认 |
| 无 published 状态变更 | 确认 |
| 无新 static params / sitemap | 确认 |
