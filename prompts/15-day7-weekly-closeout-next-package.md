# Day 7 执行提示词：七天内容治理周结与唯一下一包

> 日期：2026-08-09
> 状态：待执行
> 对应计划：`docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md` Day 7
> 工作目录：`/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag`

请只做全周交叉审计、周结和唯一下一包选择。不要执行下一包。

## 一、目标

1. 只读核对 Day 1–6 的真实产物；
2. 重算所有关键数量和缺失字段；
3. 按六层分别报告状态；
4. 写一份周结；
5. 严格选择一个下一实施或闭环包；
6. 不实施、提交或部署该包。

唯一仓库写入目标：

```text
docs/roadmaps/2026-08-09-content-governance-weekly-closeout.md
```

## 二、必须读取

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md`
4. `docs/standards/content-writing-standard.md`
5. `docs/standards/content-update-standard.md`
6. `docs/roadmaps/2026-07-28-source-risk-hardening.md`
7. `docs/research/claim-audit/life-course-theory.md`
8. `docs/research/claim-audit/teacher-identity-theory.md`
9. `docs/research/genealogy-audit/2026-07-17-existing-relations.md`
10. `docs/research/genealogy-audit/2026-08-07-existing-relations-review.md`
11. `docs/roadmaps/2026-07-23-topic-pilot-review-plan.md`
12. `docs/research/2026-07-26-teacher-professional-learning-and-change-human-review.md`
13. Day 1–6 的交接结果
14. 相关 Obsidian 审核记录

缺失的计划产物必须写成：

```text
not_started
```

或：

```text
blocked
```

不得在 Day 7 代做缺失工作。

## 三、启动基线

```bash
git status --short --branch
git rev-parse HEAD
git diff --name-status
git diff --cached --name-status
git rev-list --left-right --count origin/main...HEAD
```

如果周结文件已经存在：

- 所有权明确且用户授权更新：先用 `mktemp -d` 保存快照；
- 所有权不明：停止，不覆盖；
- 不得创建第二份周结绕开冲突。

## 四、多 Agent 分工

主 Agent 必须启动三个只读子 Agent。

### 子 Agent A：Day 1 与 Git/门禁审计

核对：

- Day 1 roadmap 执行记录；
- 每条验证命令真实状态；
- DB/build/E2E 是否真实运行；
- 当前 branch、HEAD、dirty files；
- commit/deployment/public verification 证据；
- 缺失交付物。

### 子 Agent B：内容表完整性重算

重算：

- 两份 D3 ledger 的 claim 总数、唯一性、section coverage；
- source、locator、verifiedAt、reviewer、decision、blocker 缺失数；
- genealogy relation inventory 和审计行数；
- Topic 52 行的唯一性和决定统计。

所有计数必须给出命令或明确口径。

### 子 Agent C：状态与下一包资格

核对：

- Research；
- Human review；
- Corpus implementation；
- Local verification；
- Commit；
- Deployment。

然后按已批准优先级判断哪个包有资格成为唯一下一包。只做资格建议，不写周结、不实施。

### 主 Agent

- 解决子 Agent 报告冲突；
- 唯一写入周结；
- 只选一个下一包；
- 不执行下一包。

## 五、允许与禁止范围

### 允许写入

```text
docs/roadmaps/2026-08-09-content-governance-weekly-closeout.md
```

### 禁止

- 不补写 Day 1–6 的目标文件。
- 不改 ledger、human review、genealogy audit、corpus、代码或测试。
- 不修测试、不改 DB、不执行 seed。
- 不 commit、push、PR、merge 或 deploy。
- 不同时选择多个实施包。
- 不把候选包写成已授权。
- 不把本地验证写成线上状态。

## 六、周结必须包含

### 6.1 基线

- branch；
- HEAD；
- `origin/main...HEAD`；
- dirty tracked/untracked 文件；
- 与 Day 1 baseline 的变化。

### 6.2 Day 1–6 实际状态

每个 Day 写：

```text
planned output
actual output
status
verification evidence
blocker
owner decision needed
```

### 6.3 六层状态

对每个包分别填写：

| Layer | Allowed status |
|---|---|
| Research | not_started / in_progress / complete / blocked |
| Human review | not_started / in_progress / complete / blocked |
| Corpus implementation | not_authorized / authorized / in_progress / complete |
| Local verification | not_run / partial / passed / failed |
| Commit | not_authorized / authorized / complete |
| Deployment | not_authorized / authorized / complete |

不得使用无对象的“已完成”。

### 6.4 可复现统计

至少包含：

```text
Life Course claim count and unique count
Teacher Identity claim count and unique count
D3 missing source/locator/verifiedAt/reviewer/decision counts
current genealogy relation count
genealogy audited count and unique count
Topic total/unique claim count
Topic accept/revise/reject/defer/pending counts
new corpus entities
new genealogy relations
unauthorized corpus changes
unauthorized commit/deployment
```

### 6.5 日期真实性检查

确认没有把以下日期冒充 verification/review date：

- 文件日期；
- 批次日期；
- source publication date；
- commit date；
- 研究包创建日期。

### 6.6 Weekly Scorecard

按七天计划逐项填写实际值、目标值、状态和证据路径。

### 6.7 风险与 owner decisions

列出所有未决事项，按 P0/P1/P2 排序。

## 七、唯一下一包选择

严格按以下顺序：

1. Day 1 P0 本地 source-risk-hardening closure 仍失败；
2. 两篇 D3 已有完整人审决定和独立 implementation authorization；
3. genealogy 已有完整人审决定和独立 implementation authorization；
4. Topic Stage B 完成且 corpus implementation 已独立授权；
5. 以上均不具备资格时，选择一个 evidence 或 human-review closure 包。

只能选择一个。

下一包必须写明：

```text
single outcome
exact file allowlist
explicit denylist
ordered steps
focused verification
full verification
acceptance criteria
stop rules
commit boundary
deployment boundary
```

如果 corpus 实施资格证据不足，不能选择 corpus 包。选择最早的真实 blocker 闭环包。

不得写“备选包 A/B/C”，不得执行任何一步。

## 八、验证

```bash
git diff --check
git status --short --branch
git diff --name-status
```

由于周结文件是新建 untracked 文件，还必须运行：

```bash
git diff --no-index --check /dev/null docs/roadmaps/2026-08-09-content-governance-weekly-closeout.md
```

`git diff --no-index` 返回 1 可以表示存在预期差异；需要检查的是是否有 whitespace error。

另外：

- 重算所有表格行数与唯一 ID；
- 比较执行前后 Git 状态；
- 确认本窗口只产生周结文件变化。

## 九、验收标准

- [ ] 三个子 Agent 已完成只读交叉审计。
- [ ] Day 1–6 缺失产物没有被代做。
- [ ] 所有计数有命令或明确口径。
- [ ] 六层状态逐包分开。
- [ ] 日期真实性已检查。
- [ ] Weekly Scorecard 完整。
- [ ] 风险和 owner decisions 明确。
- [ ] 只选择一个下一包。
- [ ] 下一包含完整 allowlist、denylist、验证、验收和停止条件。
- [ ] 下一包没有被执行。
- [ ] 本窗口无 corpus、代码、测试、commit 或 deployment 变更。

## 十、停止条件

- Git 基线发生实质变化；
- 状态证据互相矛盾且无法消解；
- 关键文件所有权不明；
- 下一包必须依靠猜测授权；
- 无法给出精确 allowlist；
- 用户要求同时执行多个下一包；
- 任务开始触及 corpus、测试修复、commit 或 deployment。

## 十一、交接输出

最终回复必须给出：

- 周结文件路径；
- Day 1–6 状态摘要；
- 可复现统计；
- 六层状态；
- 风险和 owner decisions；
- 唯一下一包名称及其资格依据；
- 明确声明：

```text
Weekly closeout: complete
Selected next package: not_executed
Commit: not_authorized
Deployment: not_authorized
```
