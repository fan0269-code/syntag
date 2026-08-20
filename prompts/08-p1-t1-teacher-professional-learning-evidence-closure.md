# Codex 提示词：P1-T1 Teacher Professional Learning Topic 证据闭环

> 日期：2026-07-23
> 状态：待执行
> 阶段：P1（内容研究与审核准备）
> 工作目录：`/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag`
> 目标 Topic：`teacher-professional-learning-and-change`

## 一、任务目标

将现有 draft Topic `teacher-professional-learning-and-change` 从“已有内容草稿”提升为“可提交人工审核的研究证据包”。

本轮只做来源核验、claim matrix、candidate locator 和后续发布规划，不修改 corpus，不改变 Topic 状态，不落库、不构建、不发布。

最强允许结论只能是：

```text
ready_for_human_review
```

或：

```text
blocked_by_missing_evidence
```

不得在本轮写成 `publish-ready`、`approved`、`verified` 或已发布。

## 二、开始前必须读取

按顺序阅读：

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/SITE_CONSTRUCTION_PLAYBOOK.md`
4. `docs/roadmaps/2026-07-17-five-angle-content-operations-plan.md`
5. `docs/roadmaps/2026-07-18-first-content-enrichment.md`
6. `docs/research/2026-07-18-content-enrichment-topic-briefs.md`
7. `docs/research/2026-07-18-teacher-learning-cop-evidence.md`
8. `docs/decisions/ADR-027-evidence-status-and-content-nature.md`
9. `docs/research/skill-sop.md`
10. `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts`
11. `src/data/templates/pathway-template.ts`
12. `src/data/templates/theory-template.ts`
13. `tests/content-validation.test.ts`
14. `tests/seed-integration.test.ts`
15. `tests/e2e/content-enrichment.spec.ts`

## 三、启动门禁

先执行并记录：

```bash
git status --short --branch
git rev-parse HEAD
git diff --name-status
git diff --cached --name-status
git diff --check
git rev-list --left-right --count origin/main...HEAD
```

规则：

- 保留所有既有修改和未跟踪文件。
- 不执行 `reset`、`restore`、`checkout`、`stash`、`clean`、`rebase` 或覆盖文件。
- 如果以下目标文件已经存在，或存在无法区分所有权的改动，立即停止并报告：

```text
docs/research/2026-07-23-teacher-professional-learning-and-change-r1.md
docs/roadmaps/2026-07-23-topic-pilot-review-plan.md
```

- 当前分支是否已经并入 `main` 只记录为未来发布门禁；本轮是 docs-only 研究包，可以继续。
- 不执行 `fetch`、`pull`、`push`、`merge`、创建 PR 或部署。

## 四、允许的文件范围

只允许新建：

```text
docs/research/2026-07-23-teacher-professional-learning-and-change-r1.md
docs/roadmaps/2026-07-23-topic-pilot-review-plan.md
```

除这两个文件外，不修改任何文件。

特别禁止修改：

```text
src/data/**
src/lib/**
src/app/**
src/components/**
prisma/**
tests/**
package.json
package-lock.json
.env*
.github/**
ops/**
```

## 五、来源规则

### 5.1 可以核验结构化事实的来源

优先使用：

- Crossref
- 出版社正式页面
- 大学或研究机构页面
- WorldCat 或其他可靠图书馆目录

这些来源可核验作者、题名、年份、DOI、ISBN、期刊、卷期和版本，但不能自动证明正文中的理论主张。

### 5.2 支撑实质性学术主张的来源

优先使用：

- 原始论文全文
- 原始书籍或章节
- 出版社提供的合法全文或章节预览
- 权威学术综述

Wikidata、百科、搜索摘要和二手列表只能用于发现或交叉检查，不能单独支撑页面级实质性 claim。

### 5.3 Locator 规则

有效 candidate locator 可以是：

- PDF 页码；
- 章节及页码；
- 有稳定结构的 section heading；
- 表格、图或编号命题；
- 出版社页面中可重复定位的明确区段。

以下内容不能冒充 locator：

- DOI landing page 本身；
- 搜索结果摘要；
- 仅包含书目信息的 Crossref 返回；
- 推测页码；
- 无法再次访问或复现的位置。

拿不到全文时，写：

```text
candidate_locator: unavailable
reason: full text not lawfully accessible in this run
```

不得猜测。

## 六、执行任务

### Task 1：逐字段盘点当前 Topic 草稿

从 `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` 提取该 Topic 的真实现有内容，覆盖：

- `questionEn`
- `overview`
- `core_questions`
- `question_categories`
- `selection_path`
- `theory_pathways`
- `entry_points`
- `sources`
- `verification`
- 三条 `TopicTheory` 关系

不要改写正文。先建立 current-content inventory，并区分：

- L1：书目事实或来源可以直接支持的事实；
- L2：Syrtag 的 theory-fit、primary/supporting/not-recommended 路由判断；
- L3：研究设计建议；
- unsupported：当前无法得到适当来源支撑的表述。

### Task 2：核验来源身份与版本

至少核验当前 Topic 使用的这些来源：

- Clarke & Hollingsworth 2002
- Timperley 等人的教师专业学习来源
- Lave & Wenger 1991
- Wenger 1998
- Teacher Identity 对照来源

每条来源记录：

| 字段 | 要求 |
| --- | --- |
| `source_id` | 必须与 corpus 一致 |
| `citation` | 核验后的完整书目信息 |
| `url` | DOI、publisher 或权威来源 |
| `source_kind` | 按项目合同填写 |
| `accessed_at` | `2026-07-23` 或实际执行日期 |
| `identity_check` | `matched` / `mismatch` / `unresolved` |
| `full_text_access` | `yes` / `partial` / `no` |
| `safe_support` | 来源可以直接支持什么 |
| `forbidden_extension` | 不能从该来源延伸出什么 |

若发现题名、作者、年份、版本、DOI 或来源 ID 冲突，停止进一步发布规划，将结果标记为 `blocked_by_source_mismatch`。

### Task 3：建立逐项 Claim Matrix

在研究包中建立如下表格：

| claim_id | field_path | current_text | content_nature | source_id | candidate_locator | evidence_status | source_check_date | reviewer_role | review_decision | safe_wording | forbidden_extension |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

要求：

- `claim_id` 使用稳定、可读的 slug。
- `field_path` 精确对应当前 Topic 数据路径。
- L1 factual claim 必须绑定 source 和 candidate locator。
- L2 theory routing 必须明确标记为 `editorial_synthesis`。
- L3 内容必须标记为 `research_guidance`。
- Codex 不得充当人工审核者。

因此以下字段默认保持：

```text
reviewer_role: awaiting_human_review
review_decision: pending_review
```

即使找到了 locator，也只能写 `candidate_locator`，不能自行写 `approved`。

### Task 4：审查三个理论路径

分别审查：

1. `teacher-professional-development-theory` — `primary`
2. `communities-of-practice` — `supporting`
3. `teacher-identity-theory` — `not_recommended`

每条路径必须回答：

- 当前页面真正要解释的对象是什么？
- 分析单位是什么？
- 需要哪些材料才能使用该理论？
- 哪些材料不足以支持该理论？
- 路由判断属于 L1、L2 还是 L3？
- 是否存在把“参加培训”直接写成“实践改变”的风险？
- 是否存在把普通团队、PLC 或项目组直接称为 CoP 的风险？
- `not_recommended` 是否被错误表达成普遍否定，而不是针对当前研究问题的条件判断？

不得新增 genealogy 关系。

### Task 5：给出证据覆盖率

至少计算：

```text
factual_claim_count
factual_claims_with_source
factual_claims_with_candidate_locator
editorial_synthesis_count
research_guidance_count
unsupported_claim_count
source_identity_matched_count
source_identity_unresolved_count
```

覆盖率分母必须写清楚，不得只写“多数”“基本完成”。

### Task 6：形成审核结论

只能从以下结论中选择一个：

```text
ready_for_human_review
blocked_by_missing_locators
blocked_by_source_mismatch
blocked_by_unsupported_claims
```

`ready_for_human_review` 只表示证据材料可以交给人审，不表示内容可发布。

同时列出所有需要内容负责人或学术审核者决定的事项，例如：

- 是否批准 `primary` / `supporting` / `not_recommended` 路由；
- 是否接受某项 L2 编辑综合；
- 是否需要删除或收窄某条表述；
- locator 是否足以支撑当前 safe wording；
- 是否批准后续将 Topic 从 `draft` 改为 `published`。

## 七、完善后续三阶段规划

新建：

```text
docs/roadmaps/2026-07-23-topic-pilot-review-plan.md
```

把后续工作拆成三个独立窗口，不得合并执行。

### 阶段 A：证据包完成

即本轮工作。

完成条件：

- 来源身份核验完成；
- claim matrix 完整；
- candidate locator 覆盖率可计算；
- 所有未知项明确标记；
- 未修改 corpus。

### 阶段 B：人工审核

只能由用户指定的审核者执行。

输出必须是结构化决定：

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

没有结构化人工决定，不得进入阶段 C。

### 阶段 C：单 Topic 发布实施

只写未来实施范围，不执行。

未来允许修改文件应收窄为：

```text
src/data/corpus/content-batches/2026-07-18-first-enrichment.ts
tests/content-validation.test.ts
tests/seed-integration.test.ts
tests/information-architecture.test.ts
tests/seo.test.ts
tests/e2e/content-enrichment.spec.ts
对应 roadmap 和 Website-Content-Hub 审核记录
```

未来阶段 C 必须满足：

- R4 发布状态已经与 `main`、production workflow 和公网结果完成对账；
- Topic 的结构化人工审核已提供；
- 只把这一条 Topic 从 `draft` 提升；
- 其他三个 draft Topic、Goodson、Day、Kingdon 继续保持 `draft`；
- 不新增理论、学科、genealogy、schema 或 migration；
- 完整执行 migrate → 双 seed → tests → lint → content check → build → smoke → E2E；
- 人工审核、预览、部署和发布继续作为独立门禁。

## 八、禁止事项

- 不修改 Topic 正文或 TypeScript corpus。
- 不把来源列表等同于 claim-level verification。
- 不虚构 locator、页码、reviewer、日期或审核结论。
- 不把 L2 路由判断写成普遍学术共识。
- 不把 L3 研究建议写成固定方法。
- 不发布 Goodson、Day、Kingdon 或其他 draft Topic。
- 不新增 Psychology、Management/OB 或任何第三学科内容。
- 不修改 genealogy。
- 不运行数据库、seed、build 或 E2E。
- 不执行 commit、push、PR、merge 或 deploy。

## 九、docs-only 验证

完成后运行：

```bash
git diff --check
git status --short
git diff --name-status
git diff --stat
git diff -- \
  docs/research/2026-07-23-teacher-professional-learning-and-change-r1.md \
  docs/roadmaps/2026-07-23-topic-pilot-review-plan.md
```

确认实际变化仅有两个允许文件。

再运行：

```bash
git diff --name-only | while IFS= read -r file; do
  case "$file" in
    docs/research/2026-07-23-teacher-professional-learning-and-change-r1.md|\
    docs/roadmaps/2026-07-23-topic-pilot-review-plan.md)
      ;;
    *)
      printf 'OUT_OF_SCOPE %s\n' "$file"
      ;;
  esac
done
```

若输出任何 `OUT_OF_SCOPE`，停止，不清理或覆盖文件，报告冲突。

本轮是 docs-only：

- 不运行 `npm test`
- 不运行 `npm run build`
- 不声称数据库、页面、E2E 或线上状态已验证

## 十、最终汇报格式

1. 结论：四种审核结论之一。
2. 实际新增文件。
3. 来源核验数量及 mismatch/unresolved 数量。
4. factual claim 的 source 与 locator 覆盖率。
5. L1/L2/L3/unsupported 数量。
6. 需要人工决定的完整清单。
7. 明确说明未修改 corpus、状态、数据库或公开页面。
8. 下一步只建议一个动作：进入人工审核，或补齐指定缺失来源。
