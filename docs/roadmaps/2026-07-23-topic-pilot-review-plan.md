# Teacher professional learning Topic pilot：三阶段审核与发布计划

> 日期：2026-07-23
> 状态：阶段 A 已完成；阶段 B、C 未授权
> 阶段：P1 内容研究与审核准备
> 目标 Topic：`teacher-professional-learning-and-change`
> 关联：`docs/research/2026-07-23-teacher-professional-learning-and-change-r1.md`

## 1. 目标与完成边界

本计划把证据包、人工审核和单 Topic 发布拆成三个独立工作窗口。阶段之间只传递结构化、可复核的产物；任何阶段的完成都不会自动授权下一阶段。

当前窗口只执行阶段 A。最强结论为 `ready_for_human_review`；它只表示材料可以交给人审，不表示 Topic 已获批准、可发布或已发布。

## 2. 三阶段顺序与硬门禁

```text
阶段 A：证据包完成
  ↓ 需要完整 claim matrix 与可计算覆盖率
阶段 B：人工审核
  ↓ 需要用户指定审核者给出结构化决定
阶段 C：单 Topic 发布实施
  ↓ 仍需独立预览、部署与发布授权
```

禁止在同一窗口合并执行阶段 A、B 或 C。缺少上一阶段的结构化产物时，必须停止。

## 3. 阶段 A：证据包完成（本轮）

### 3.1 包含

- 从当前 corpus 原样提取 Topic 内容和三条 `TopicTheory` 关系。
- 核验五组现有来源的身份、版本、合法全文可得性和 candidate locator。
- 将现有表述逐项分类为 `source_backed_fact`、`editorial_synthesis`、`research_guidance` 或 `unsupported`。
- 建立 claim matrix、三条理论路径审查、覆盖率和待人工决定清单。
- 新建：
  - `docs/research/2026-07-23-teacher-professional-learning-and-change-r1.md`
  - 本计划文件。

### 3.2 不包含

- 不修改 `src/data/**`、测试、schema、migration、数据库或 Topic 状态。
- 不运行 migrate、seed、test、lint、content check、build、smoke 或 E2E。
- 不新增理论、学科、genealogy 或公开路由。
- 不执行 commit、push、PR、merge、preview、deploy 或公网验证。
- 不代替内容负责人或学术审核者作出 `approved`、`verified` 或发布决定。

### 3.3 完成条件

- 五组来源均有 identity check；任何 mismatch 都触发 `blocked_by_source_mismatch`。
- claim matrix 覆盖当前 Topic 的全部要求字段和三条 `TopicTheory` 关系。
- 每条 L1 factual claim 均绑定 corpus `source_id` 和可复现 candidate locator；无法取得时明确写明原因。
- factual source 覆盖率与 locator 覆盖率均给出分子、分母和百分比。
- 所有 L2 路由判断标记为 `editorial_synthesis`，所有 L3 方法建议标记为 `research_guidance`。
- `reviewer_role` 保持 `awaiting_human_review`，`review_decision` 保持 `pending_review`。
- 实际变化只包含本轮允许的两个 docs 文件；corpus 保持不变。

### 3.4 输出判定

阶段 A 只能选择：

- `ready_for_human_review`
- `blocked_by_missing_locators`
- `blocked_by_source_mismatch`
- `blocked_by_unsupported_claims`

若为任一 blocked 结论，阶段 B 不开始，先补齐研究包中点名的唯一阻塞项。

## 4. 阶段 B：人工审核（独立窗口）

### 4.1 授权与角色

只能由用户指定的内容负责人或学术审核者执行。Codex 可以整理、校验格式和指出冲突，但不能把自己写成审核者，也不能代填批准结论。

### 4.2 必需输入

- 阶段 A 的最终 evidence pack。
- 用户指定的审核者身份与角色。
- 每条进入后续实施范围的结构化人工决定。

每条决定必须包含：

```text
claim_id
reviewer_role
review_decision
approved_wording
approved_source_id
approved_locator
reviewed_at
rationale
```

### 4.3 审核事项

- 是否批准 `primary` / `supporting` / `not_recommended` 三条条件式路由。
- 是否接受各项 L2 编辑综合，或要求改写、收窄、删除。
- candidate locator 是否足以支撑对应 safe wording。
- L3 研究建议是否保持条件式表达，且未被误写为固定方法。
- 是否明确保留以下边界：
  - 参加培训、出席活动或满意度不等于实践已经改变；
  - 普通团队、PLC、项目组或平台不自动构成 CoP；
  - `not_recommended` 是针对当前问题的条件判断，不是对 Teacher Identity Theory 的普遍否定。
- 是否批准进入阶段 C；该决定仍不等于批准部署或发布。

### 4.4 完成条件

- 所有拟实施 claim 都有完整结构化决定。
- 没有把 `pending_review`、口头意见或空白字段当成批准。
- 审核者明确处理所有来源、措辞、locator 和路由争议。
- 未获批准的 claim 被明确标记为删除、收窄或继续阻塞。

没有完整结构化人工决定，不得进入阶段 C。

## 5. 阶段 C：单 Topic 发布实施（未来独立窗口，不执行）

### 5.1 启动前门禁

- R4 发布状态已与 `main`、production workflow 和公网结果完成重新对账；历史本地或线上记录不能替代本次核验。
- `origin/main...HEAD` 的分叉已经处理并有明确的实施基线。
- 阶段 B 的结构化人工审核已提供且无未决 claim。
- 用户已单独授权 corpus 实施；preview、deploy 和正式发布仍分别授权。

### 5.2 未来允许修改范围

```text
src/data/corpus/content-batches/2026-07-18-first-enrichment.ts
tests/content-validation.test.ts
tests/seed-integration.test.ts
tests/information-architecture.test.ts
tests/seo.test.ts
tests/e2e/content-enrichment.spec.ts
对应 roadmap
对应 Website-Content-Hub 审核记录
```

实施窗口必须进一步给出精确 allowlist；不得因本节列出候选范围而默认修改全部文件。

### 5.3 实施约束

- 只处理 `teacher-professional-learning-and-change`。
- 只采用阶段 B 批准的 wording、source ID 和 locator。
- 只把这一条 Topic 从 `draft` 提升；其他三个 enrichment Topic、Goodson、Day 和 Kingdon 继续保持 `draft`。
- 不新增 Theory、Scholar、Work、Concept、Field、Discipline、genealogy、schema 或 migration。
- 不扩展 Psychology、Management/OB 或其他第三学科。
- 保持 published-only 的 route、search、graph、static params 和 sitemap 边界。

### 5.4 验证顺序

在获得阶段 C 实施授权后，按仓库当时的权威命令和环境重新确认并依次执行：

```text
migrate
→ seed（第 1 次）
→ seed（第 2 次）
→ focused tests
→ full tests
→ lint
→ content check
→ build
→ build-output smoke
→ E2E
```

任何失败都必须停止并保留真实结果；不得跳过、弱化或删除失败检查来声称完成。

### 5.5 发布门禁

以下决定保持独立：

1. 人工审核通过；
2. corpus 实施与本地验证通过；
3. preview 获得单独授权并通过；
4. deploy 获得单独授权并成功；
5. 公网 published-only、路由、search、graph、sitemap 和页面内容复验通过。

只有第 5 项完成后才能描述为线上已发布。阶段 A 或 B 的完成、PR 合并、workflow 启动或本地 build 成功都不能替代该结论。

## 6. 风险与停止条件

- 来源身份或版本冲突：回到阶段 A，结论为 `blocked_by_source_mismatch`。
- factual claim 无 candidate locator：回到阶段 A，结论为 `blocked_by_missing_locators`。
- safe wording 仍含无法支撑的因果、效果或普遍化表述：回到阶段 A，结论为 `blocked_by_unsupported_claims`。
- 人工决定不完整、审核者未指定或字段缺失：停在阶段 B。
- R4、`main`、production workflow 或公网状态无法对账：不启动阶段 C。
- 实施 diff 超出阶段 C allowlist：停止，不清理、不覆盖既有改动。

## 7. 阶段 A 执行记录

- 启动基线：`676c4f3adc612ffe5fd44471627af9fe1991a987`
- 相对 `origin/main`：左侧 1、右侧 7；记录为未来阶段 C 门禁，本轮不处理。
- 既有未跟踪文件：`prompts/08-p1-t1-teacher-professional-learning-evidence-closure.md`；保留不动。
- corpus、Topic 状态、数据库和公开页面：本轮均不修改、不验证。
- 阶段 A 最终结论：`ready_for_human_review`。
- 来源身份核验：`matched 5 / mismatch 0 / unresolved 0`；全文可得性为 `yes 1 / partial 4`。
- claim matrix：52 项；`supported` 6、`partially_supported` 2、`unverifiable` 4、`editorial_synthesis` 31、`research_guidance` 9。
- factual source 覆盖率：6 / 6（100%）；candidate locator 覆盖率：6 / 6（100%）。
