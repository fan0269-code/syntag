# Day 1 执行提示词：关闭 P0 Source Risk Hardening 本地基线

> 日期：2026-08-03
> 状态：待执行
> 对应计划：`docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md` Day 1
> 工作目录：`/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag`

请只执行 Day 1，不提前执行 Day 2–7。

## 一、目标

关闭当前 P0 `source-risk-hardening` 的本地验证基线：

1. 审计既有脏工作树和 P0 文件范围；
2. 核实当前 UI source-semantics 文案的已确认依据；
3. 仅在依据明确时，修正同一个 E2E 用例中的三条过时文案断言；
4. 依序运行完整本地门禁；
5. 回填路线图执行记录和 Obsidian 审核记录；
6. 停在 commit、push 和 deployment 之前。

最强允许结论：

```text
local_release_candidate
```

若存在失败、未运行门禁或环境阻塞，只能写：

```text
local_verification_partial
```

或：

```text
blocked
```

不得声称已提交、已合并、已部署、已发布或已完成公网验证。

## 二、开始前必须读取

按顺序读取：

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md`
4. `docs/standards/content-writing-standard.md`
5. `docs/standards/content-update-standard.md`
6. `docs/roadmaps/2026-07-28-source-risk-hardening.md`
7. `docs/decisions/ADR-027-evidence-status-and-content-nature.md`
8. `tests/e2e/content-enrichment.spec.ts`
9. 当前 P0 修改文件及其 Git diff
10. `/Users/fanlw/Documents/Website-Content-Hub/50-内容模板/网站更新同步记录模板.md`

## 三、启动基线

先运行并原样记录：

```bash
git status --short --branch
git rev-parse HEAD
git diff --name-status
git diff --cached --name-status
git rev-list --left-right --count origin/main...HEAD
git diff --check
```

已知参考快照为：

```text
branch: feature/content-enrichment-batch-1
HEAD: 676c4f3adc612ffe5fd44471627af9fe1991a987
origin/main...HEAD: 2 0
```

这个快照仅用于发现漂移，不能替代本窗口实测。若当前值不同，先说明差异及影响，不得静默沿用。

规则：

- 保留所有既有修改和未跟踪文件。
- 禁止 `reset`、`restore`、`checkout`、`stash`、`clean`、`rebase`、`merge`。
- 不执行 `fetch`、`pull` 或分支对账。
- 当前分支落后 `main` 只记录为发布阻断，不在本窗口处理。
- 不打印 `.env`、`DATABASE_URL` 或任何凭据。

## 四、必须使用的多 Agent 分工

主 Agent 必须启动两个只读子 Agent；建议使用隔离上下文。两个子 Agent均不得修改文件。

### 子 Agent A：P0 范围审计

检查当前脏文件和 diff，回答：

- 哪些差异属于 `2026-07-28-source-risk-hardening`；
- 是否混入无关内容；
- 是否出现基线不明或所有权不明的修改；
- 默认允许写入的三个文件之外，是否确有最小修复必要。

### 子 Agent B：E2E 文案契约审计

只读对照：

- `src/components/common/SourceBlock.tsx`
- `src/components/content/EntityArticle.tsx`
- `src/components/content/TheoryArticle.tsx`
- `tests/content-ui-contract.test.ts`
- `tests/theory-static-ui.test.ts`
- `tests/e2e/content-enrichment.spec.ts`

定位 `published scholar profiles show attribution boundaries and source semantics` 用例中三条同语义旧断言：

1. source-register intro；
2. page-source summary；
3. page-level note。

子 Agent 只能报告差异，不能决定哪套文案获批准。

### 主 Agent

- 汇总两个子 Agent 的结果；
- 核实 UI wording 的明确确认依据；
- 是唯一写入者；
- 串行执行数据库、构建和 E2E，不得交给子 Agent 并行运行。

## 五、文件范围

### 默认允许写入

```text
tests/e2e/content-enrichment.spec.ts
docs/roadmaps/2026-07-28-source-risk-hardening.md
/Users/fanlw/Documents/Website-Content-Hub/20-16-博士知识图谱网站建设/30-待审核/网站更新记录/2026-08-03-source-risk-hardening-local-baseline.md
```

若 Obsidian 目标文件已经存在，先检查所有权和现有内容；无法确定时停止，不覆盖。

### 条件允许的 P0 实现文件

只有验证明确证明现有 P0 实现本身存在缺陷时，才能在以下文件内做最小修复：

```text
prisma/seed.ts
src/app/topics/[slug]/page.tsx
src/components/common/SourceBlock.tsx
src/components/common/VerificationBadge.tsx
src/components/content/EntityArticle.tsx
src/components/content/PathwayContentSections.tsx
src/components/content/TheoryArticle.tsx
src/data/corpus/content-batches/2026-07-18-first-enrichment.ts
src/data/corpus/shared/entities.ts
src/lib/content-validation.ts
src/lib/knowledge-entity-presentation.ts
src/lib/theory-presentation.ts
tests/content-ui-contract.test.ts
tests/content-validation.test.ts
tests/seed-integration.test.ts
tests/theory-presentation.test.ts
tests/theory-static-ui.test.ts
```

在修改任何条件允许文件前，先说明：

- 失败证据；
- 根因；
- 为什么默认三文件范围无法修复；
- 将修改的确切文件和最小字段/断言。

### 明确禁止

- 不改 `AGENTS.md`、`.agents/**`、`docs/standards/**`、七天计划或其他 prompt。
- 不新增 corpus 实体、来源、关系、页面或公开路径。
- 不改 schema、migration、published/draft 状态、sitemap、索引或广告控制。
- 不削弱、跳过、删除测试或扩大超时来掩盖失败。
- 不 commit、push、创建 PR 或部署。

## 六、执行步骤

1. 完成启动基线并保存文件清单。
2. 等待两个子 Agent 返回，核对结论是否冲突。
3. 查找当前 UI wording 已获确认的路线图、审核记录或用户决定。
4. 若确认依据不存在，停止，请 owner 决定 UI 文案与测试哪一方是规范。
5. 若确认依据存在，只修改该 E2E test block 内三条过时断言。
6. 先运行该单一 E2E 用例。
7. 按第七节顺序运行完整门禁。
8. 回填 `docs/roadmaps/2026-07-28-source-risk-hardening.md` 的实际改动、验证结果、未完成项和下一步。
9. 创建或更新指定 Obsidian 审核记录，并保持：

```yaml
status: review
needs_human_review: true
owner_decision: pending
deployment_status: not_started
```

10. 复核最终 Git 差异，停在提交和部署之前。

## 七、验证命令

数据库命令只允许连接已确认的本地数据库。若无法确认，标记 `not_run` 并写明原因，不得试探共享或生产数据库。

```bash
npm run content:check
npm run typecheck
npm test
npm run lint
npm run db:migrate
npm run db:seed
npm run db:seed
npm run build
node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts
npm run test:e2e -- tests/e2e/content-enrichment.spec.ts --grep "published scholar profiles show attribution boundaries and source semantics"
npm run test:e2e
git diff --check
```

每条命令必须记录：

```text
command
result: passed | failed | not_run
reason
```

## 八、验收标准

- [ ] 当前基线、HEAD、分支差异和所有脏文件已记录。
- [ ] 两个只读子 Agent 已完成范围与文案契约审计。
- [ ] UI wording 的确认依据可追溯。
- [ ] 同一 E2E 用例的三条旧断言一起对齐，且测试未被弱化。
- [ ] 所有适用门禁都有真实结果。
- [ ] DB 双 seed 通过，或准确记录未运行原因。
- [ ] Roadmap 执行记录已回填。
- [ ] Obsidian 记录保持 review/pending/not_started。
- [ ] 无 allowlist 外新增修改。
- [ ] 未进行 commit、push、PR、deployment 或公网发布声明。

## 九、立即停止条件

出现任一情况立即停止：

- 找不到明确 UI wording 决策；
- P0 diff 混入无法判断所有权的改动；
- 数据库目标不是明确批准的本地数据库；
- 失败根因落在 allowlist 外；
- 需要分支对账、schema 变更、内容扩张、commit 或部署；
- 执行期间 Git 基线发生实质变化。

## 十、交接输出

最终回复按六层分别报告：

```text
Research:
Human review:
Corpus implementation:
Local verification:
Commit:
Deployment:
```

并列出：

- 基线与脏文件；
- 子 Agent 结论；
- 实际修改；
- 每条验证命令结果；
- 未运行项和阻塞原因；
- owner 下一步唯一需要决定的事项。

不要自动开始 Day 2。
