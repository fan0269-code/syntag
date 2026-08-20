# Day 6 执行提示词：关闭 Topic Pilot 九条 Research Guidance 人工决定

> 日期：2026-08-08
> 状态：待执行，需要真实人工输入
> 对应计划：`docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md` Day 6
> 工作目录：`/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag`

请只处理固定的九条 `research_guidance`。不要重开其余 43 条决定，不进入 Stage C。

## 一、目标

只记录以下九条 claim 的真实人工决定：

```text
tplc-core-question-learning-process
tplc-core-question-change-evidence
tplc-core-question-cop
tplc-selection-name-prompt
tplc-selection-evidence-prompt
tplc-pd-materials
tplc-cop-materials
tplc-identity-materials
tplc-verification-l3
```

目标文件：

```text
docs/research/2026-07-26-teacher-professional-learning-and-change-human-review.md
```

当前参考统计：

```text
total unique claims: 52
accept_as_worded: 14
revise: 29
pending_review: 9
```

必须重新实测，不得直接复制参考值。

## 二、必须读取

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md`
4. `docs/standards/content-writing-standard.md`
5. `docs/standards/content-update-standard.md`
6. `docs/decisions/ADR-027-evidence-status-and-content-nature.md`
7. `docs/roadmaps/2026-07-23-topic-pilot-review-plan.md`
8. `docs/research/2026-07-23-teacher-professional-learning-and-change-r1.md`
9. `docs/research/2026-07-26-teacher-professional-learning-and-change-human-review.md`
10. `prompts/08-p1-t1-teacher-professional-learning-evidence-closure.md`
11. Day 5 交接结果

## 三、启动基线与快照

目标 review 文件当前可能是 untracked，普通 `git diff` 不足以证明本窗口变化。

先运行：

```bash
git status --short --branch
git rev-parse HEAD
git diff --name-status
git diff --cached --name-status
git rev-list --left-right --count origin/main...HEAD
shasum -a 256 docs/research/2026-07-26-teacher-professional-learning-and-change-human-review.md
```

然后：

1. 使用 `mktemp -d` 创建临时目录；
2. 将目标文件复制为只读基线快照；
3. 记录临时路径；
4. 不删除或覆盖用户文件。

若目标文件不存在、52 个 claim ID 不唯一、九条目标行不是 `pending_review`，停止并报告。

## 四、多 Agent 分工

主 Agent 必须启动三个只读子 Agent。

### 子 Agent A：Nine-row extraction

只读提取九条的：

- claim ID；
- current wording；
- proposed safe wording；
- source/locator；
- current reviewer fields；
- current decision。

检查九条是否唯一且范围完整。

### 子 Agent B：Conditional guidance audit

检查九条 proposed wording 是否保留：

- question specificity；
- setting；
- ethics；
- access；
- materials；
- design；
- 不把建议写成固定方法或来源验证事实。

只能指出风险，不得做审核决定。

### 子 Agent C：Stage B and statistics

只读核对：

- 52 个 claim 的唯一性；
- 43 条既有决定的完整性；
- 九条 pending；
- Stage B 完成门禁；
- 新决定写入后的预期统计。

### 主 Agent

- 唯一与人工审核者交互；
- 唯一写入者；
- 只能转录明确的人类决定；
- 不得将子 Agent 建议自动采用为 reviewer decision。

## 五、既有枚举兼容规则

新写作规范使用：

```text
accept_as_worded
accept_with_revision
reject
pending_review
```

当前 Topic Stage B 表的既有合同使用：

```text
accept_as_worded
revise
reject
defer_for_full_text
```

本窗口必须沿用现有 Topic 表合同，不得静默批量迁移枚举。

如果审核者使用 `accept_with_revision`，先明确询问是否映射为当前表中的 `revise`。未经明确确认不得自行映射。

## 六、人工输入硬门禁

修改文件前必须获得：

```text
reviewer_identity
reviewer_role
真实 reviewed_at
九条逐条 review_decision
九条逐条 rationale
revise 行的 reviewed_wording
需要时的 reviewed_source_id / reviewed_locator
```

若没有明确决定：

1. 只展示九条简洁决定包；
2. 请求真实审核者逐条确认；
3. 不写文件；
4. 停止等待。

“按你的建议”“你来确认”“都可以”等内容不构成逐条决定。

## 七、文件范围

### 允许写入

```text
docs/research/2026-07-26-teacher-professional-learning-and-change-human-review.md
/Users/fanlw/Documents/Website-Content-Hub/20-16-博士知识图谱网站建设/30-待审核/网站更新记录/2026-08-08-topic-research-guidance-human-review.md
```

若人工输入不完整，实际写入 allowlist 为 `none`。

### 禁止

- 不改 R1 研究包。
- 不改 Topic roadmap。
- 不改 corpus、source registration、topic status、DB、页面或路由。
- 不重开 43 条既有决定，除非发现可复现具体矛盾；发现时报告并停止。
- 不把 research guidance 写成 verified fact。
- 不进入 Stage C。
- 不 commit、push、PR、build、E2E 或 deploy。

## 八、执行步骤

1. 建立基线快照和哈希。
2. 等待三个子 Agent 的只读报告。
3. 重算 52 行统计与唯一性。
4. 若现状不符合 43 decided + 9 pending，停止。
5. 向审核者只呈现九条：

```text
claim ID
current wording
proposed safe wording
conditional boundary
allowed decision values
```

6. 等待逐条人工决定。
7. 检查 reviewer identity、role、reviewed_at、decision、rationale 完整性。
8. `revise` 行必须有人类明确批准的 `reviewed_wording`。
9. 主 Agent 只转录明确决定。
10. 使用临时快照确认 43 条旧决定逐字段未变化。
11. 重算全部 52 行统计。
12. 只有九条均有终局决定、无 `pending_review` 或 `defer_for_full_text`、且字段完整时，才可把表头写为：

```text
Stage B status: human_review_complete
```

13. 即使 Stage B 完成，也明确写：

```text
Stage C: not_authorized
```

14. 更新外部审核记录。
15. 停止，不实施 corpus。

## 九、验证

```bash
shasum -a 256 docs/research/2026-07-26-teacher-professional-learning-and-change-human-review.md
git diff --check
git status --short
```

并使用基线快照进行只读差异检查，确认：

- 仅九条目标行、统计和允许的表头状态发生变化；
- 43 条旧决定逐字段不变；
- 仍有 52 个唯一 claim；
- 每个新决定字段完整。

## 十、验收标准

- [ ] 九条固定范围无遗漏、无重复。
- [ ] 三个子 Agent 仅做只读检查。
- [ ] 所有新决定来自真实审核者。
- [ ] 现有 Topic 枚举合同未被静默迁移。
- [ ] 43 条既有决定未变化。
- [ ] 52 个 claim 仍唯一。
- [ ] revise 行有批准后的 wording。
- [ ] pending/defer 未清零时仍为 human_review_in_progress。
- [ ] Stage B complete 不等于 Stage C authorized。
- [ ] 未修改 corpus、DB、页面、commit 或 deployment。

## 十一、停止条件

- 缺少真实 reviewer、角色、日期或逐条决定；
- 用户要求 Agent 代为确认；
- 枚举映射未明确；
- 九条之外的历史行发生变化；
- 目标文件状态或所有权不明；
- 52 行统计/唯一性不成立；
- 出现 allowlist 外写入；
- 要求进入 Stage C、corpus、commit 或 deployment。

## 十二、交接输出

报告：

- 前后决定统计；
- 九条逐行最终决定；
- 剩余 pending/defer 和 blocker；
- Stage B 状态；
- Stage C 状态；
- 外部审核记录；
- 明确声明 corpus implementation、local verification、commit、deployment 均未授权或未执行。

不要自动开始 Day 7。
