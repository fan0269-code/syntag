# Codex 提示词：R4 将 Life Course R2 source pool 接入公开 corpus

> 日期：2026-07-22
> 状态：已执行（本地门禁完成，待生产发布）
> 阶段：P1（内容语料）
> 工作目录：`/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag`
> 上游：`docs/roadmaps/2026-07-21-life-course-r3-content-batch.md`、commit `7c468ea`

## 目标

把 R3 已核验但尚未被 production manifest 引用的 3 条 Life Course L1 `ContentSource`，接入 `lifeCourseContent.sources`、`reading_path` 和页面级 `verification`。

本轮只关闭“source pool 已存在但页面未引用”的技术缺口。不得借机改写 Life Course 的分析性正文、增加实体、改变发布状态或扩大公开学科。

## 完成定义

- batch 工厂可以由 `entities.ts` 直接调用，不要求一个实际不存在的外部 source pool。
- Life Course 页面包含 9 条 source（原 6 + 新 3）。
- 新 3 条 source 均在 reading path 与 L1 verification 中被引用。
- 测试明确锁定 3 个 source id，且 `content:check`、typecheck、相关测试全绿。
- 无 schema、migration、依赖、路由、static params、sitemap、状态、数据库或部署变更。

## 启动门禁

1. 先读：
   - `AGENTS.md`
   - `CLAUDE.md`
   - `docs/SITE_CONSTRUCTION_PLAYBOOK.md`
   - `docs/roadmaps/2026-07-21-life-course-r3-content-batch.md`
   - `docs/research/2026-07-20-life-course-evidence-r2.md`
   - `src/data/corpus/content-batches/2026-07-21-life-course-evidence-r2.ts`
   - `src/data/corpus/shared/entities.ts`
   - `src/data/templates/theory-template.ts`
   - `tests/content-validation.test.ts`
   - `tests/seed-corpus-regression.test.ts`
2. 运行并记录：

```bash
git status --short --branch
git diff --name-status
git diff --check
```

3. 若以下任一目标文件已有非本任务改动，立即停止并报告，不覆盖、不清理、不 stash：
   - `src/data/corpus/content-batches/2026-07-21-life-course-evidence-r2.ts`
   - `src/data/corpus/shared/entities.ts`
   - `tests/content-validation.test.ts`
4. 不 pull、rebase、merge、reset、restore、commit、push、建 PR 或 deploy。

## 允许修改

- `src/data/corpus/content-batches/2026-07-21-life-course-evidence-r2.ts`
- `src/data/corpus/shared/entities.ts`
- `tests/content-validation.test.ts`
- 实施后回写：
  - `docs/roadmaps/2026-07-21-life-course-r3-content-batch.md`
  - `docs/SITE_CONSTRUCTION_PLAYBOOK.md`
- 按 `AGENTS.md` 生成或更新一条 Website-Content-Hub 待审核记录；只写 `review / needs_human_review: true / owner_decision: pending / deployment_status: not_started`。若该路径不可访问，如实记录阻塞，不伪称已同步。

除上述文件外一律不改。若真实数据所有权要求扩大范围，先说明冲突并等待用户授权。

## 禁止事项

- 不把 Elder 1974 原版加入 corpus；它仍缺 WorldCat/OCLC 或等价 library-level 核验。
- 不把 1999 25th Anniversary Edition 写成 1974 原版，也不声称两版内容完全一致。
- 不依据书目元数据改写 `origins`、`historical_development`、`key_scholars`、解释机制或其他实质性学术正文。
- 不新增或修改 Scholar、Work、Concept、Topic、Genealogy、Field、Discipline。
- 不改变任何 `status` 或 `publishedAt`。
- 不改 `src/data/seed-content.ts`、Prisma、migration、验证器、API、组件、SEO、依赖或部署。
- 不通过删断言、skip/only、放宽校验或改期望计数掩盖失败。

## 执行步骤

### Step 1：写 RED 回归断言

在 `tests/content-validation.test.ts` 中为 `life-course-theory` 增加一个聚焦测试，先断言以下 3 个 id 同时存在于：

- `content.en.sources`
- `content.en.reading_path[].source_id`
- 至少一条 `content.en.verification` 的 `source_id`

目标 id：

```text
elder-1996-human-lives-changing-societies
elder-2000-life-course-theory-encyclopedia
elder-1999-children-of-the-great-depression-25th
```

先运行该测试并确认因尚未接入而失败。若失败原因是语法、导入或环境错误，而非缺少上述 source，则先修正测试本身，不能把假 RED 当作有效证据。

```bash
node --env-file-if-exists=.env --experimental-strip-types --test --test-name-pattern="Life Course R2 sources" tests/content-validation.test.ts
```

### Step 2：把 batch 收紧为自包含工厂

修改 `2026-07-21-life-course-evidence-r2.ts`：

- 保留现有 3 个内部 `ContentSource` 常量及其字段，不重写 citation、URL、supports 或 evidence level。
- 删除不再需要的 `LifeCourseEvidenceR2SourcePool` 接口。
- 将工厂改为零参数：

```typescript
export function createLifeCourseEvidenceR2Batch(): LifeCourseEvidenceR2Batch {
  return {
    sources: [
      elder1996HumanLivesChangingSocieties,
      elder2000LifeCourseTheoryEncyclopedia,
      elder1999ChildrenOfTheGreatDepression25th,
    ],
  };
}
```

这是对当前错误接口的最小修正；不要再在 `entities.ts` 复制这 3 条 source。

### Step 3：接入 `entities.ts`

1. 导入 `createLifeCourseEvidenceR2Batch`。
2. 在现有 batch 实例之后创建：

```typescript
const lifeCourseEvidenceR2Batch = createLifeCourseEvidenceR2Batch();
```

3. 在 `lifeCourseContent.sources` 原 6 条之后追加：

```typescript
...lifeCourseEvidenceR2Batch.sources
```

4. 在 `reading_path` 末尾追加 3 条，order 使用 7、8、9；`source_id` 必须精确对应 3 个新 id。标题与 purpose 只能表达已核验的书目/阅读用途，不把来源抬高为 founding text 或完整理论史。
5. 在页面级 `verification` 中追加 3 条 `L1 / verified`：
   - Elder 1996：作者、章节、Cambridge UP、页码 31–62。
   - Elder 2000：作者、百科条目、Oxford UP、Vol. 5、页码 50–52。
   - Elder 1999：Westview 25th Anniversary Edition、472 页、新增 Chapter 11，并明确不是 1974 原版。

不要修改现有 L2/L3 verification。

### Step 4：验证

依次运行：

```bash
node --env-file-if-exists=.env --experimental-strip-types --test --test-name-pattern="Life Course R2 sources" tests/content-validation.test.ts
npm run content:check
npm run typecheck
node --env-file-if-exists=.env --experimental-strip-types --test tests/content-validation.test.ts tests/seed-corpus-regression.test.ts
git diff --check
```

全部退出码必须为 0。若失败，只修复本任务引入的问题；发现既有或范围外问题时停止并报告。

### Step 5：范围审计与记录

运行：

```bash
git status --short
git diff --name-status
git diff --stat
git diff -- src/data/corpus/content-batches/2026-07-21-life-course-evidence-r2.ts src/data/corpus/shared/entities.ts tests/content-validation.test.ts docs/roadmaps/2026-07-21-life-course-r3-content-batch.md docs/SITE_CONSTRUCTION_PLAYBOOK.md
```

回写计划/Playbook 时只记录真实改动、命令、退出码、未完成项和下一步。不要写“已落库”“已部署”“已公开验证”，因为本轮不运行数据库、build、浏览器或部署。

## 验收标准

| 检查项 | 预期 |
| --- | --- |
| batch 工厂 | 零参数、自包含、不复制 source 定义 |
| Life Course sources | 9 条，3 个新 id 各出现一次 |
| reading path | 9 条，order 1–9，无重复；新 3 条 source_id 有效 |
| 页面 verification | 保留 L1/L2/L3；新 3 条均有 L1 verified |
| RED → GREEN | 同一聚焦测试先因 source 未接入失败，再通过 |
| 内容门禁 | `content:check` 退出码 0 |
| 类型门禁 | typecheck 退出码 0 |
| 回归 | 两个目标测试文件全部通过 |
| 发布边界 | Education/Sociology、published/draft、static params、sitemap 均不变 |
| Git/外部动作 | 无 commit、push、PR、merge、deploy |

## 最终汇报格式

1. 结论：`R4 completed` 或 `R4 blocked`。
2. 实际改动文件。
3. RED/GREEN 与各验证命令的真实退出码。
4. 公开边界：明确“source 已接入 corpus”不等于“已 seed / build / deploy / 线上验证”。
5. 遗留风险：Elder 1974 与 claim-level locator 仍未解决。
6. 下一步建议只给一个，不自动执行。

## 执行记录（2026-07-22）

- R4 corpus 接入已按 RED → GREEN 完成：Life Course 现含 9 条 source、order 1–9 的 reading path，并为 3 条 R2 source 增加页面级 L1 verification。
- 上线前审计补齐了 L1 `verifiedAt` 合同与 Prisma 按记录持久化，未改 schema 或 migration。
- 本机非生产数据库 migration、连续两次 seed、数据库集成回归均通过；`typecheck`、完整 Node 测试、全仓 `lint`、`content:check`、生产 build/smoke 和 Playwright 36/36 均通过。
- 用户已另行授权 commit、push、PR、merge 与 deploy；远端结果和公网证据在生产工作流完成后写入 Website-Content-Hub 审核记录，不在本提示词中提前声明。
