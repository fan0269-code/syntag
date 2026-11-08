# W1 执行提示词：F0 Life Course 行级人审呈现包

> 日期：2026-11-08  
> 状态：待执行，需要真实人工输入  
> 对应计划：`docs/roadmaps/2026-11-08-content-optimization-and-next-phase.md`  
> 前置：PR #18（或等价提交）的 F0 摘要收窄语料已在工作树；FAN-247 仍 archived

请只执行 W1。Agent 和任何子 Agent 都不得充当审核者，不得填写 `reviewer_identity`、`review_decision`、`reviewed_at`，不得把 status 改为 `published`。

## 一、目标

把 F0 四实体做成可签字的行级决定包，并只记录审核者明确给出的决定。

```text
life-course-theory
elder-1998-life-course
glen-h-elder-jr
educational-transitions-over-time
```

本窗口最强允许结论：

```text
human_review_complete
```

或：

```text
blocked_pending_reviewer
```

不授权 corpus 解档、commit 到生产、deployment、广告申请。

## 二、必须读取

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/roadmaps/2026-11-08-content-optimization-and-next-phase.md`
4. `docs/standards/content-writing-standard.md`
5. `docs/standards/content-update-standard.md`
6. `docs/research/human-review/2026-11-08-f0-life-course-human-review-checklist.md`（若工作树无此文件，先确认 PR #18 是否已合入；缺失则停止）
7. `docs/research/claim-audit/life-course-theory.md` 第 9 节 F0 增补
8. `docs/research/pre-review/2026-11-08-f0-life-course-pre-review.md`
9. `src/data/corpus/shared/entities.ts` 中上述四实体的**当前**措辞
10. `src/lib/content-validation.ts` 中 `acceptedTopicTheoryRiskWording`

## 三、启动门禁

```bash
git status --short --branch
git rev-parse HEAD
git diff --name-status
```

检查：

- `life-course-theory` 的 `status` 经 FAN-247 后仍为 `archived`。
- 正文已省略五原则具名清单与 Mayer/Alwin 全文本主张。
- Topic–theory `educational-transitions-over-time` → `life-course-theory` 的 `riskReview.reviewDecision` 仍为 `pending_review`。
- 工作树没有把其他 FAN-247 slug 偷偷改为 published。

任一失败：停止，回到 F0 收窄，不向审核者提交半成品。

## 四、多 Agent 分工

主 Agent 是唯一写入者。启动两个只读子 Agent：

### 子 Agent A：语料与清单对齐

对照 checklist 每一行与 `entities.ts` 当前措辞。输出：一致 / 过期 / 缺失。

### 子 Agent B：Topic 风险闸

确认公开 topic 所需的 `AcceptedTopicTheoryRiskReview` 字段是否仍空；列出 methods 角色必须决定的那一条 `riskNotesEn` 候选（不得代写为已接受）。

## 五、对真人审核者的呈现

按 checklist §3 逐块询问：

`accept_as_worded` | `accept_with_revision` | `reject` | `pending_review`

禁止：

- 用预审 `PASS` 代替人审；
- 把摘要合成标成 L1；
- 在审核者未给 `riskNotesEn` 签字时解档 topic。

若审核者本窗口不在场：把呈现包写进交接文件，结论记为 `blocked_pending_reviewer`，结束。

## 六、允许写入

仅当审核者给出逐条决定时，更新：

```text
docs/research/human-review/2026-11-08-f0-life-course-human-review-checklist.md
```

可另写交接：

```text
docs/research/human-review/2026-11-08-w1-f0-review-handoff.md
```

不得改 `src/data/`、`src/lib/fan247-visibility.ts`、测试计数、公开文案。

## 七、停止条件

- 审核者未给出身份/角色/真实日期：停止。  
- 任一行仍 `blocked` 且拟公开措辞未省略：停止，不得进 W2。  
- Topic 风险未签：W2 可以解档 theory/work/scholar，**但不得解档 topic**；在交接中写明。

## 八、验证

- 人审字段若已填，必须是审核者提供的字面值，不是推断。  
- `git diff` 不含 corpus / FAN-247。  
- 交接写明：可否进入 W2、topic 是否排除。

## 九、交接给 W2

必须包含：`HEAD`、已签行列表、未签行、是否授予 U3 allowlist、topic 是否可解档。未授予则 W2 不得开始。
