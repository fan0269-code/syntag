# R3: 接入 Life Course R2 验证产物 + Goodson-Day R1 修正 → content-batches

> 日期：2026-07-21
> 状态：已完成（R3 source-pool 准备完成；尚未接入 Life Course 页面）
> 阶段：P1（内容语料）— 扩源入 batch，不落库，不改变 published/draft 边界
> 负责人：Codex
> 关联：`docs/research/2026-07-20-life-course-evidence-r0.md`、`docs/research/2026-07-20-life-course-evidence-r2.md`、`docs/research/2026-07-21-goodson-day-evidence-r1.md`、`docs/research/skill-sop.md`

## 1. 目标与用户价值

把 Life Course R2 经核验通过的三条新来源（Elder 1996、Elder 2000、Elder 1999）整理为独立 `content-batches` source pool，同时按 Goodson-Day R1 的 Crossref 核验结果修正 Day et al. 2006 标题副标题。本轮只准备可集成资产，不把新来源接入 Life Course Theory 页面；页面接入留给 R4。

本轮完成后用户能观察到的变化：
- `src/data/corpus/content-batches/2026-07-21-life-course-evidence-r2.ts` 存在且通过 `validateSeedCorpus()`
- 新 batch 内含 3 条 L1 ContentSource，但 Life Course Theory 的 `sources` 数组暂不变化
- Goodson-Day draft batch 中 Day et al. 2006 标题补全副标题 `and unstable identities`
- 无新 published 实体；无新 static params；无新 sitemap 条目
- Education/Sociology 范围不变

## 2. 范围

### 包含
- 新建 `src/data/corpus/content-batches/2026-07-21-life-course-evidence-r2.ts`：
  - 定义 `LifeCourseEvidenceR2SourcePool` 接口，导出 3 条新 `ContentSource`（Elder 1996、Elder 2000、Elder 1999）
  - 定义 `createLifeCourseEvidenceR2Batch()` 函数，返回 `{ sources: ContentSource[] }` 结构（仅扩源，不改 theory content）
  - 所有 source 字段与 `src/data/templates/theory-template.ts` 中的 `ContentSource` 类型严格对齐
- 修改 `src/data/corpus/content-batches/2026-07-19-goodson-day-draft-scholars.ts`：
  - Day et al. 2006 的 citation 从 `The personal and professional selves of teachers` 补全为 `The personal and professional selves of teachers: Stable and unstable identities`（R1 Crossref 核验结果）
  - 同步更新该 source 的 `supports` 数组中对应描述
- 运行 `npm run content:check` 确认全绿
- 运行 `npm test -- --test-name-pattern="content"` 确认内容相关测试不受影响

### 不包含
- 不修改 `src/data/corpus/shared/entities.ts`（shared sources 不在本轮范围内）
- 不修改 `src/data/seed-content.ts`（batch 集成由后续步骤处理）
- 不修改 Prisma schema、migration、数据库
- 不修改 `src/lib/content-validation.ts` 或任何验证逻辑
- 不修改 `tests/` 中的现有测试（除非发现回归）
- 不改变任何实体的 `status`（published/draft 不变）
- 不新增公开 static params、sitemap 条目、图谱节点
- 不引入 Psychology 或 Management 内容
- 不 commit、不 push、不 deploy

## 3. 当前证据与决策

### 3.1 Life Course R2 验证结论

| Source ID | DOI | Crossref 核验 | 状态 |
|---|---|---|---|
| `elder-1996-human-lives-changing-societies` | `10.1017/cbo9780511571114.004` | ✅ 匹配 — Cambridge UP, *Developmental Science*, pp.31–62, ISBN 9780521794596 | L1 |
| `elder-2000-life-course-theory-encyclopedia` | `10.1037/10520-020` | ✅ 匹配 — Oxford UP, *Encyclopedia of Psychology* Vol.5, pp.50–52, ISBN 1557986541 | L1 |
| `elder-1999-children-of-the-great-depression-25th` | Routledge 产品页 | ✅ 匹配 — 1999 Westview 25th Anniv., 472pp, ISBN 9780813333427 | L1 |

### 3.2 Elder 1974 原版

维持 L2 pending。1974 UChicago 原版无 DOI，Crossref 只命中 2018 Routledge 电子版（实际是 1999 Westview 25th Anniversary 的电子再版）。本轮不添加 1974 原版作为 ContentSource。

### 3.3 Goodson-Day R1 核验结论

| DOI | 状态 | 需要修正 |
|---|---|---|
| Day et al. 2006 `01411920600775316` | ✅ 一致 | 标题补全副标题 `Stable and Unstable Identities` |
| Clarke & Hollingsworth 2002 `S0742-051X(02)00053-7` | ✅ 一致 | 无需修正 |
| Guskey 2002 `135406002100000512` | ✅ 一致 | 无需修正 |

### 3.4 ContentSource 合同约束

每条 `ContentSource` 必须包含：
- `id`: slug 风格，全 corpus 唯一
- `citation`: APA 格式
- `url`: 指向一手权威记录（DOI landing / publisher page）
- `source_kind`: `doi` | `publisher` | `university` | `library` | `journal` | `authoritative_web`
- `evidence_level`: `L1`
- `supports`: string[]，每条对应 claim matrix 中一条 L1 claim 的 safe wording 的事实部分

## 4. 实现步骤

### Step 1: 阅读参考文件

必须先读取以下文件以理解现有模式：

1. `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` — 现有 batch 模板（SourcePool 接口 + createBatch 函数模式）
2. `src/data/corpus/content-batches/2026-07-19-goodson-day-draft-scholars.ts` — Goodson/Day batch（需修正 Day 2006 标题）
3. `src/data/corpus/shared/entities.ts` — 查看 Life Course Theory 在现有 sources 中的位置（约 line 267-307），确认不要重复已有 source id
4. `src/data/templates/theory-template.ts` — `ContentSource` 类型定义
5. `src/lib/content-validation.ts` — `validateSeedCorpus()` 入口和批次加载规则
6. `docs/research/2026-07-20-life-course-evidence-r2.md` §5 — R2 ContentSource 片段（直接复用）
7. `docs/research/2026-07-21-goodson-day-evidence-r1.md` — R1 核验结论

### Step 2: 创建 Life Course R2 batch

新建 `src/data/corpus/content-batches/2026-07-21-life-course-evidence-r2.ts`：

```typescript
import type { ContentSource } from "../../templates/theory-template.ts";

// 复用 docs/research/2026-07-20-life-course-evidence-r2.md §5 的 ContentSource 片段

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

注意：
- 3 条 ContentSource 的 `id` 不能与 `entities.ts` 中已有的 life course sources 重复（已有：`elder-1998-life-course`, `elder-johnson-crosnoe-2003-life-course`, `shanahan-2000-pathways-adulthood`, `mayer-2009-new-directions`, `alwin-2012-life-course-concepts`, `giele-elder-1998-methods`）
- `elder-1996-human-lives-changing-societies`、`elder-2000-life-course-theory-encyclopedia`、`elder-1999-children-of-the-great-depression-25th` 不与已有 id 冲突
- `source_kind` 全部为 `doi` 或 `publisher`（Routledge 产品页 → `publisher`）
- `evidence_level` 全部为 `L1`

### Step 3: 修正 Goodson-Day R1

在 `src/data/corpus/content-batches/2026-07-19-goodson-day-draft-scholars.ts` 中找到 Day et al. 2006 的 `ContentSource`：

- 将 `citation` 中的标题从 `The personal and professional selves of teachers` 改为 `The personal and professional selves of teachers: Stable and unstable identities`
- 检查 `supports` 数组是否需要更新以反映完整标题

### Step 4: 运行验证

```bash
# 内容校验
npm run content:check

# 类型检查
npm run typecheck

# 运行内容相关测试
node --env-file-if-exists=.env --experimental-strip-types --test --test-name-pattern="content" tests/
```

预期结果：全部通过。如有失败，修复后重新运行直到全绿。

## 5. 数据、内容与安全

- 数据来源：`docs/research/2026-07-20-life-course-evidence-r2.md`（Crossref 核验通过）
- 核验等级：新增 3 条均为 L1（DOI / publisher 级）
- 内容状态：新增 ContentSource 仅为 source 层扩展，不改变任何已发布实体的 `status`
- 学科范围：Education + Sociology 不变
- 公开边界：无新 published 实体，无新 static params，无新 sitemap 条目
- 安全：不引入密钥、不修改 `.env`、不改 schema/migration

## 6. 验收标准

1. **文件存在**：`src/data/corpus/content-batches/2026-07-21-life-course-evidence-r2.ts` 存在且导出 `createLifeCourseEvidenceR2Batch`
2. **类型对齐**：3 条 ContentSource 均符合 `theory-template.ts` 的 `ContentSource` 接口
3. **ID 唯一**：新增 source id 不与 `entities.ts` 中已有 id 冲突
4. **Goodson-Day 修正**：Day et al. 2006 citation 含完整副标题
5. **content:check 全绿**：`npm run content:check` 退出码 0
6. **typecheck 通过**：`npm run typecheck` 退出码 0
7. **测试不回归**：内容相关测试全部通过
8. **无未授权变更**：无 schema/migration/dependency/deployment 变更，无 Psychology/Management 内容

## 7. 风险、回退与发布判定

- **风险**：source pool 未接入 production manifest 时，`content:check` 只能证明既有 corpus 未回归，不能证明新来源已经进入页面或数据库。R4 必须补充接入断言。
- **回退**：删除新建的 `.ts` 文件和 revert Goodson-Day 修改即回退，不影响已发布内容。
- **发布判定**：本批为 source 层扩写，不改变 public surface。通过 `content:check` + `typecheck` + 测试即视为完成。

## 8. 执行记录

- 实际完成：提交 `7c468ea` 新增 `src/data/corpus/content-batches/2026-07-21-life-course-evidence-r2.ts`，并在 canonical `src/data/corpus/shared/entities.ts` 与 Goodson-Day draft batch 中补全 Day et al. 2006 副标题。
- 验证结果：`npm run content:check`、`npm run typecheck`、目标内容/seed 回归测试与 `git diff --check` 均通过；未修改 schema、migration、公开状态、static params、sitemap 或部署。
- 未完成：3 条 Life Course R2 source 尚未被 `lifeCourseContent.sources`、`reading_path` 和页面级 `verification` 引用；当前 batch 工厂仍要求外部 `SourcePool`，但 `entities.ts` 的 `sources` 不含这些键，不能直接按旧 R4 提示词调用。
- 下一步：执行 [`prompts/07-r4-integrate-life-course-r2-batch.md`](../../prompts/07-r4-integrate-life-course-r2-batch.md)。R4 先把 batch 工厂改为零参数自包含工厂，再接入 Life Course D2 页面并用测试锁定 3 个 source id。

## 9. R4 跟进执行记录（2026-07-22）

- 实际改动：将 `createLifeCourseEvidenceR2Batch()` 收紧为零参数自包含工厂；在 `lifeCourseContent` 原 6 条 source 之后接入 3 条 R2 source，并追加 order 7–9 的 reading path 和 3 条 `L1 / verified` 页面 verification。未改写分析性正文、实体、状态或发布路径。
- RED → GREEN：同一聚焦测试首次因 `elder-1996-human-lives-changing-societies` 未出现在 sources 失败（退出码 1）；接入后通过（退出码 0）。
- 验证结果：`npm run content:check` 退出码 0；`npm run typecheck` 退出码 0；`tests/content-validation.test.ts` + `tests/seed-corpus-regression.test.ts` 21/21 通过（退出码 0）；`git diff --check` 退出码 0。
- 后续上线门禁：在用户另行授权后，本机非生产数据库 migration 与连续两次 seed 成功；数据库集成测试确认 3 个 source id 和最新 L1 日期 `2026-07-21T00:00:00.000Z`。`typecheck`、完整 Node 测试、全仓 `lint`、`content:check`、生产 build/smoke 与 Playwright 36/36 均通过。
- 远端状态：本记录随发布候选提交；PR、production workflow 和公网验收尚待提交合并后完成，因此此处不提前声明线上已更新。
- 遗留项：Elder 1974 原版仍缺 WorldCat/OCLC 或等价 library-level 核验；claim-level locator 仍未升级。
