# Day 5 执行提示词：审计当前全部 Genealogy Relations

> 日期：2026-08-07
> 状态：待执行
> 对应计划：`docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md` Day 5
> 工作目录：`/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag`

请只执行 Day 5。本窗口只形成 relation evidence audit 和 review recommendation，不修改任何关系。

## 一、目标

审计执行时 corpus 中的全部 genealogy relations：

- 一条当前关系对应一条审计记录；
- 核对端点、方向、类型、描述、公开可见性和来源；
- 分开验证“存在关联”与“支持当前方向/类型”；
- 形成 `keep / revise / hide / remove` 建议；
- 未经真人决定时保持 `pending_review`；
- 扩展状态保持 `No-Go`。

主要输出：

```text
docs/research/genealogy-audit/2026-08-07-existing-relations-review.md
```

## 二、必须读取

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md`
4. `docs/standards/content-writing-standard.md`
5. `docs/standards/content-update-standard.md`
6. `docs/roadmaps/2026-07-17-content-expansion-roadmap.md`
7. `docs/research/genealogy-audit/2026-07-17-existing-relations.md`
8. `src/data/corpus/shared/entities.ts`
9. `src/data/templates/theory-template.ts`
10. `src/lib/content-validation.ts`
11. `prisma/schema.prisma`
12. `prisma/seed.ts`
13. 当前 relation endpoints 对应的 theory/source records
14. Day 4 交接结果

## 三、启动基线

```bash
git status --short --branch
git rev-parse HEAD
git diff --name-status
git diff --cached --name-status
git rev-list --left-right --count origin/main...HEAD
git diff -- src prisma tests package.json package-lock.json | shasum -a 256
```

当前历史审计预期有 8 条，但“8”不是强行目标。必须以执行时 corpus 的 canonical relation inventory 为准。

如果执行时数量、ID、方向或类型与旧审计不同：

1. 记录差异；
2. 判断哪一层是 canonical source；
3. 审计当前全集；
4. 不补边凑数；
5. 无法确定 canonical source 时停止。

## 四、多 Agent 分工

主 Agent 必须启动三个只读子 Agent。

### 子 Agent A：Relation inventory

输出当前全部关系的：

```text
relation ID
source endpoint
target endpoint
relation type
description
strength if present
endpoint existence
public route
visibility
canonical data location
```

### 子 Agent B：Evidence and locator

逐条核对：

- 是否存在可靠 association evidence；
- 是否支持当前方向；
- 是否支持当前 relation type；
- 是否支持 public description；
- source ID、locator、actual verifiedAt；
- partial/blocked 原因。

### 子 Agent C：Semantic risk

检查：

- `influenced`
- `derived`
- `branched_from`
- `extended_by`
- `critiqued_by`
- `opposed`
- `integrated_with`

等关系标签是否把主题相似、时间先后或编辑比较夸大为因果、影响或继承。

### 主 Agent

- 唯一写入者；
- 合并三个维度；
- 可以形成 recommendation；
- 不得形成虚构的人类 review decision。

## 五、允许与禁止范围

### 允许写入

```text
docs/research/genealogy-audit/2026-08-07-existing-relations-review.md
/Users/fanlw/Documents/Website-Content-Hub/20-16-博士知识图谱网站建设/30-待审核/网站更新记录/2026-08-07-genealogy-relation-audit.md
```

若主要输出文件已存在且所有权不明，停止，不覆盖。

### 禁止

- 不修改 `src/**`、`prisma/**`、`tests/**`。
- 不新增、修改、隐藏或删除 corpus relation。
- 不为提高密度新增 edge。
- 不改 endpoint、relation type、route、sitemap 或 public graph。
- 不将 recommendation 写成 review decision。
- 不在缺真人身份/角色/日期/逐条决定时写 approved。
- 不 commit、push、PR、deploy。

## 六、审计表合同

一行一条当前 relation，至少包含：

```text
relation_id
canonical_location
source_endpoint
target_endpoint
current_type
current_description
current_visibility
association_evidence
direction_evidence
type_evidence
source_ids
locator
content_nature
evidence_status
verifiedAt
recommendation
proposed_type_or_direction
proposed_wording
reviewer_identity
reviewer_role
review_date
review_decision
rationale_or_blocker
```

规则：

- association、direction、type 分开记录。
- recommendation 可用 `keep / revise / hide / remove`。
- recommendation 不是人工决定。
- 没有真人逐条决定时，`review_decision: pending_review`。
- `verifiedAt` 只能是真实来源核验日期。
- editorial comparison 必须标记 `editorial_synthesis`。

## 七、执行步骤

1. 保存 Git 基线和 denied-path 哈希。
2. 等待三个子 Agent 返回。
3. 确认 canonical relation inventory。
4. 记录旧审计与当前 inventory 的差异。
5. 每条 relation 建立唯一审计行。
6. 检查两个 endpoint 存在并能解析到公开/内部记录。
7. 分开核验 association、direction、type 和 description。
8. 对过度因果或方向性措辞提出 bounded recommendation。
9. 无证据时标为 partial/blocked，不搜索相似关系替代。
10. 计算：

```text
current_relation_count
audited_relation_count
unique_relation_id_count
keep_recommendation_count
revise_recommendation_count
hide_recommendation_count
remove_recommendation_count
pending_review_count
blocked_count
```

11. 重新计算 graph density/coverage，但只作为诊断。
12. 明确写 `expansion_status: No-Go`，除非既有批准阈值全部由本窗口实证满足。
13. 更新外部审核记录。
14. 复算 denied-path 哈希。

## 八、验证

```bash
npm run content:check
git diff --check -- docs/research/genealogy-audit/2026-08-07-existing-relations-review.md
git diff --name-status
git diff -- src prisma tests package.json package-lock.json | shasum -a 256
```

`npm run content:check` 只检查当前 corpus 基线。若失败，记录失败，不修 corpus。

## 九、验收标准

- [ ] 审计行数等于执行时当前 relation 数量。
- [ ] relation ID 唯一且一一对应。
- [ ] 两个 endpoint 均已检查。
- [ ] association、direction、type 分开评估。
- [ ] 每行有 source/locator 或明确 blocker。
- [ ] recommendation 与 human decision 清楚分离。
- [ ] 没有新关系、关系修改或 public graph 变化。
- [ ] density/coverage 未被用作补边理由。
- [ ] expansion 保持 No-Go 或有完整阈值证据。
- [ ] denied-path 哈希未变化。

## 十、停止条件

- 无法确定 canonical relation source；
- 当前 inventory 与旧审计冲突且无法解释；
- source 或 locator 无法合法复现；
- endpoint 不存在或 route 无法解析；
- 需要修改 corpus 才能继续；
- 要求为了密度新增关系；
- 要求 Agent 代替人类批准；
- 出现 allowlist 外写入或基线变化。

## 十一、交接输出

报告：

- 当前 relation 总数与审计数；
- 每类 recommendation 的 relation IDs；
- blocked/pending relation IDs；
- density/coverage 的计算口径和结果；
- expansion 状态；
- 需要人工决定的问题；
- 明确声明未修改、隐藏或删除任何 corpus edge。

不要自动开始 Day 6。
