# F0 Life Course 独立预审

> 审核日期：2026-11-08（Asia/Shanghai）  
> 分支：`cursor/f0-life-course-flagship-4ca5`  
> 角色：content-pre-review-agent（建议输出；**不**代替真人审核）

## 1. 基线

- 规划：`docs/roadmaps/2026-11-08-f0-life-course-flagship.md`
- 标准：`docs/standards/content-writing-standard.md`、`docs/standards/content-update-standard.md`
- 目标文件：`src/data/corpus/shared/entities.ts`（Life Course 簇）
- 来源范围：Elder 1998 / Springer 2003 / Shanahan 2000 公开摘要；R2 书目三元组
- FAN-247：仍强制 archived；本预审不授权 published

## 2. 计数

| 项 | 数 |
| --- | --- |
| 候选实体 | 4（theory/work/scholar/topic） |
| 审计主块 | 见下表 |
| 唯一 claim 域 | Life Course F0 narrowed set |

## 3. 逐条预审

| item_id | canonical_location | pre_review_result | recommendation | 说明 |
| --- | --- | --- | --- | --- |
| f0.theory.definition | `life-course-theory` `what_is_it` | PASS | keep | 明确摘要边界、非封闭因果模型 |
| f0.theory.core-question | `core_question` | PASS | keep | 标为编辑问题框架可接受 |
| f0.theory.origins | `origins` | PASS | keep | 含非唯一创始人边界 |
| f0.theory.history | `historical_development` | PASS | keep | 四段均可复现 locator；无五原则全文书写 |
| f0.theory.scholars | `key_scholars` | PASS | keep | 已移除 Mayer/Alwin 合并 blocker 行 |
| f0.theory.concepts | `core_concepts` | PASS | keep | 摘要词汇，非具名五原则 |
| f0.theory.genealogy | `genealogy[0]` | PASS | keep | 明示 editorial；方向待人审 |
| f0.theory.adjacent-fit-criticism | adjacent/fit/criticisms/misuse/guidance | PASS | keep | 编辑/方法建议；无假 L1 |
| f0.theory.verification | `verification` L1 行 | PASS | keep | 2026-11-08 verifiedAt；去掉伪「经典原则/Mayer」L1 |
| f0.work.elder-1998 | work content | PASS | keep | 与摘要对齐 |
| f0.scholar.elder | scholar content | PASS | keep | 贡献边界收紧 |
| f0.topic.transitions | topic pathway | PASS | keep | 去掉未经全文支撑的 linked-lives/turning-point 主路径措辞 |
| f0.topic.risk-review | topicTheories risk | BLOCKED | blocked | 仍 pending；**禁止**公开 topic |
| f0.fan247.status | publication status | PASS | keep | 仍 archived；符合「本轮不解档」 |
| f0.discipline.publish | education/sociology published | PASS | keep | 有意不做，避免连带解档 |

固定字段（整包）：

```text
pre_review_result: PASS（语料收窄）；BLOCKED（topic 风险人审 / 解档）
review_decision: pending_review
reviewer_identity: not_assigned
reviewer_role: not_assigned
reviewed_at: not_assigned
recommendation: keep narrowed corpus; do not publish until human row verdicts + owner U3
```

## 4. 结论

语料收窄达到 F0「可交人审」门槛。公开解档与 AdSense 无关本预审；在 topic risk 与行级人审完成前，任何 `published` 翻转应为 FAIL。
