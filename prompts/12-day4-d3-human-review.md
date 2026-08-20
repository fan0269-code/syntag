# Day 4 执行提示词：两篇 D3 Theory 的人工审核

> 日期：2026-08-06
> 状态：待执行，需要真实人工输入
> 对应计划：`docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md` Day 4
> 工作目录：`/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag`

请只执行 Day 4。这个窗口的任务是检查审核就绪度、向真实审核者呈现逐条决定包，并仅记录审核者明确给出的决定。

Codex 和任何子 Agent 都不得充当审核者。

## 一、目标

对以下两份完整 claim ledger 进行逐条人工审核：

```text
docs/research/claim-audit/life-course-theory.md
docs/research/claim-audit/teacher-identity-theory.md
```

本窗口最多只能完成：

```text
human_review_complete
```

这个状态仅表示逐条人工决定完整，不授权：

- corpus 实施；
- 页面改写；
- 数据库更新；
- commit；
- deployment；
- publication。

## 二、必须读取

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md`
4. `docs/standards/content-writing-standard.md`
5. `docs/standards/content-update-standard.md`
6. `docs/decisions/ADR-027-evidence-status-and-content-nature.md`
7. `docs/research/claim-audit/life-course-theory.md`
8. `docs/research/claim-audit/teacher-identity-theory.md`
9. Day 2 和 Day 3 的交接结果

## 三、启动门禁

先运行：

```bash
git status --short --branch
git rev-parse HEAD
git diff --name-status
git diff --cached --name-status
git rev-list --left-right --count origin/main...HEAD
```

然后检查：

- 两份 ledger 是否覆盖当前全部公开 section；
- 每个 `source_backed_fact` 是否有 source 和可复现 locator；
- `content_nature`、`evidence_status`、`review_readiness` 是否分离；
- partial/blocked 行是否有精确 blocker；
- claim ID 是否唯一。

如果任一 ledger 仍不完整，停止并回到相应 Day 2 或 Day 3，不向审核者提交半成品。

## 四、多 Agent 分工

主 Agent 必须启动三个只读子 Agent。任何子 Agent 均不得写文件或做审核决定。

### 子 Agent A：Readiness audit

检查两份 ledger 的：

- section coverage；
- claim ID 唯一性；
- 字段结构；
- review readiness；
- blocked/partial 行。

### 子 Agent B：Evidence completeness

检查：

- 每个 factual claim 的 source 和 locator；
- `verifiedAt` 是否是真实来源核验日期；
- 书目 source 是否被错误提升为 substantive support；
- editorial synthesis 和 research guidance 是否被正确标注。

### 子 Agent C：Human input mapping

在用户给出决定后，只读检查：

- reviewer identity；
- reviewer role；
- 真实 review date；
- 每个 claim ID 的决定；
- `accept_with_revision` 的批准措辞或明确修订指令；
- 是否存在遗漏、重复或无法映射的决定。

### 主 Agent

- 汇总就绪度；
- 与真实审核者交互；
- 是唯一写入者；
- 只能转录明确的人类决定，不能补齐、推断或优化决定。

## 五、人工输入硬门禁

在修改任何文件前，必须获得：

```text
reviewer_identity
reviewer_role
review_date
每个 claimId 的 review_decision
每个决定的 rationale
accept_with_revision 的 approved wording 或有限修订指令
```

允许的 D3 决定值只有：

```text
accept_as_worded
accept_with_revision
reject
pending_review
```

以下内容不构成人工决定：

- “整体看没问题”；
- “你来审核”；
- “按你的建议处理”；
- 子 Agent 的 evidence 建议；
- 网络来源核验结果；
- 占位日期；
- Topic 旧表中的 `revise` 或 `defer_for_full_text`。

若人工输入不完整：

1. 只展示缺失项和逐条待决定清单；
2. 请求审核者补充；
3. 不修改 ledger；
4. 不创建“已审核”记录；
5. 停止等待。

## 六、允许文件

只有人工输入硬门禁完整后，才允许修改：

```text
docs/research/claim-audit/life-course-theory.md
docs/research/claim-audit/teacher-identity-theory.md
/Users/fanlw/Documents/Website-Content-Hub/20-16-博士知识图谱网站建设/30-待审核/网站更新记录/2026-08-06-d3-theories-human-review.md
```

若人工输入不完整，本窗口实际写入 allowlist 为：

```text
none
```

## 七、禁止事项

- 不改 `src/**`、`prisma/**`、`tests/**`、corpus 或页面正文。
- 不新增来源、主张、实体或 genealogy。
- 不用人工 review date 覆盖 `verifiedAt`。
- 不把理论级同意扩展为逐条同意。
- 不把 `pending_review` 写成审核完成。
- 不请求或执行 Stage C corpus 实施。
- 不运行 DB、build 或 E2E。
- 不 commit、push、PR、deploy。

## 八、执行步骤

1. 记录 Git 基线。
2. 等待三个子 Agent 完成只读检查。
3. 汇总 readiness blocker。
4. 若未就绪，停止并点名需返回 Day 2/3 的 claim IDs。
5. 若已就绪，向审核者逐条呈现：

```text
claimId
current wording
proposed wording
content nature
evidence status
source and locator
review question
```

6. 等待明确人工决定。
7. 由子 Agent C 检查输入完整性。
8. 只有输入完整时，主 Agent 转录决定。
9. `accept_as_worded` 保留 current wording。
10. `accept_with_revision` 只使用人类批准措辞或有限指令。
11. 分别重算两篇理论的四类决定数。
12. 若存在任何 `pending_review`，状态保持 `human_review_in_progress`。
13. 只有所有拟实施 claim 决定完整时，才可写 `human_review_complete`。
14. 更新 Obsidian 记录，但保持 deployment 未开始。
15. 停止并请求独立 Stage C 授权，不得自行进入。

## 九、验证

```bash
git diff --check -- docs/research/claim-audit/life-course-theory.md docs/research/claim-audit/teacher-identity-theory.md
git diff -- docs/research/claim-audit/life-course-theory.md
git diff -- docs/research/claim-audit/teacher-identity-theory.md
git diff --name-status
```

只读检查：

- claim ID 总数和唯一性不变；
- current wording 仅在真实 `accept_with_revision` 决定允许的字段中改变；
- `verifiedAt` 未被 review date 覆盖；
- 每个新决定都有 identity、role、date、decision、rationale。

## 十、验收标准

- [ ] 两份 ledger 在提交人审前结构完整。
- [ ] 三个子 Agent 只读检查完成。
- [ ] 所有写入均来自真实、逐条人工决定。
- [ ] 每项决定可以映射到唯一 claim ID。
- [ ] `accept_with_revision` 有批准措辞或明确有限指令。
- [ ] 两篇理论分别重算决定统计。
- [ ] 存在 pending 时仍为 review in progress。
- [ ] 没有 corpus、DB、测试、页面、commit 或 deployment 变更。

## 十一、停止条件

任一情况出现立即停止：

- 两份 ledger 任一不完整；
- 缺少 reviewer identity、role、真实日期或逐条决定；
- 用户要求 Agent 替其确认；
- 决定无法映射到唯一 claim ID；
- 需要重新研究来源；
- 出现 allowlist 外写入；
- Git 基线发生实质变化。

## 十二、交接输出

分别报告两篇理论：

- claim 总数；
- accept / revision / reject / pending 数量；
- pending claim IDs 和 blocker；
- reviewer identity、role 和真实日期；
- Stage C 是否获授权。

最后明确：

```text
Corpus implementation: not_authorized
Local verification: not_run
Commit: not_authorized
Deployment: not_authorized
```

不要自动开始 Day 5。
