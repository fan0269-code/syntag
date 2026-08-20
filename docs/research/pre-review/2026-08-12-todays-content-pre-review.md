# 2026-08-12 内容逐条预审

## 结论

本报告是独立 Agent 的逐条预审建议，不是人工审核、owner 决策或发布授权。

| 统计项 | 结果 |
|---|---:|
| 今日候选变更 | 23 |
| 逐条审计记录 | 23 |
| 唯一 item ID | 23 |
| `PASS` | 15 |
| `FAIL` | 0 |
| `BLOCKED` | 8 |
| recommendation=`keep` | 12 |
| recommendation=`remove` | 3 |
| recommendation=`hide` | 8 |

另有 12 条已发布 Topic–Theory 行在当前基线中已经是“无风险正文 + `pending_review` 治理记录”；它们不属于本次工作树 diff，作为基线门禁核对，不计入今日候选变更。

## 基线与范围

- 审核日期：2026-08-12，Asia/Shanghai。
- Git 仓库：`/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag`。
- 分支：`feature/content-enrichment-batch-1`。
- HEAD：`c177740156ad834515f95cf83076e1498240cd9d`。
- 工作树：已有大量未提交改动；本报告只审查可识别的内容治理候选，不把其他 UI、SEO 或测试脏改动自动认领为今日内容更新。
- 今日候选范围：12 条 draft Topic–Theory 风险措辞移除、3 条 draft Scholar canonical 关系撤下、8 条 canonical genealogy 公开关系隔离。

## 规划、标准与证据

- 规划：`docs/roadmaps/2026-07-28-source-risk-hardening.md`、`docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md`。
- 标准：`docs/standards/content-writing-standard.md`、`docs/standards/content-update-standard.md`。
- Topic 证据与人工审阅：`docs/research/2026-07-23-teacher-professional-learning-and-change-r1.md`、`docs/research/2026-07-26-teacher-professional-learning-and-change-human-review.md`。
- Genealogy 证据：`docs/research/genealogy-audit/2026-08-02-existing-relations-remediation-review.md`。
- 预审合同：`.agents/skills/content-pre-review-agent/SKILL.md`。

## 逐条审计表

固定字段约束：本表所有 `review_decision` 均保持 `pending_review`；`reviewer_identity`、`reviewer_role`、`reviewed_at` 均未分配。`PASS` 只表示预审层面未发现当前变更的阻断问题，不表示“审核通过发布”。

| item_id | canonical_location | content_type | current_status | plan_alignment | source_ids | locator | content_nature | evidence_status | pre_review_result | recommendation | evidence_boundary | required_change | review_decision | reviewer_identity | reviewer_role | reviewed_at | blocker_or_rationale |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `topic-theory:teacher-professional-learning-and-change:teacher-professional-development-theory:risk-notes-en` | `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` → `riskNotesEn` | research guidance removal | draft Topic | 符合：draft Topic 不保留未经方法审核的风险正文 | `teacher-development-clarke-hollingsworth-2002` | 当前仅有来源 URL；风险正文已移除，重新起草前仍需可复现 locator | research_guidance | pending_review | PASS | keep | 只保留适配说明和 draft 状态，不把 Clarke 记录当作已批准风险建议 | 如需进入发布候选，建立 claim ledger、locator、`verifiedAt`、methods reviewer 与逐行决定 | pending_review | not_assigned | not_assigned | not_assigned | 移除未审风险措辞符合 fail-closed 规划；不代表原措辞已被认可 |
| `topic-theory:teacher-professional-learning-and-change:communities-of-practice:risk-notes-en` | `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` → `riskNotesEn` | research guidance removal | draft Topic | 符合：draft Topic 不保留未经方法审核的风险正文 | `cop-wenger-1998` | 当前仅有 Cambridge 来源 URL；重新起草前需核对原文定位 | research_guidance | pending_review | PASS | keep | 来源支持范围不能自动扩展为 CoP 方法风险建议 | 如需进入发布候选，补原文 locator 与方法审核 | pending_review | not_assigned | not_assigned | not_assigned | 当前为空风险正文，公开面不应使用该行生成风险建议 |
| `topic-theory:teacher-professional-learning-and-change:teacher-identity-theory:risk-notes-en` | `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` → `riskNotesEn` | research guidance removal | draft Topic | 符合：draft Topic 不保留未经方法审核的风险正文 | `kelchtermans-2009-teacher-identity` | 当前仅有 DOI URL；重新起草前需补 claim locator | research_guidance | pending_review | PASS | keep | DOI 书目记录不等于 identity-method guidance 获得批准 | 重新起草时补 locator、方法审核和有界措辞 | pending_review | not_assigned | not_assigned | not_assigned | 移除是安全收窄，不是对原风险文案的事实判定 |
| `topic-theory:education-policy-implementation-frontline-discretion:street-level-bureaucracy:risk-notes-en` | `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` → `riskNotesEn` | research guidance removal | draft Topic | 符合：draft Topic 不保留未经方法审核的风险正文 | `lipsky-2010-street-level-bureaucracy` | 当前仅有 Russell Sage URL；重新起草前需补直接 locator | research_guidance | pending_review | PASS | keep | 书目/出版者记录不自动支持 implementation-risk guidance | 如需发布，补直接证据与 methods review | pending_review | not_assigned | not_assigned | not_assigned | draft 关系继续留在内部 authoring 层，不进入公开面 |
| `topic-theory:education-policy-implementation-frontline-discretion:institutional-theory:risk-notes-en` | `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` → `riskNotesEn` | research guidance removal | draft Topic | 符合：draft Topic 不保留未经方法审核的风险正文 | `institutional-meyer-rowan-1977` | 当前仅有 DOI URL；重新起草前需补 locator | research_guidance | pending_review | PASS | keep | DOI 元数据不自动证明 legitimacy、decoupling 或 implementation-risk 建议 | 重新起草时补直接证据与条件边界 | pending_review | not_assigned | not_assigned | not_assigned | 当前没有可公开的风险结论 |
| `topic-theory:education-policy-implementation-frontline-discretion:multiple-streams-framework:risk-notes-en` | `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` → `riskNotesEn` | research guidance removal | draft Topic | 符合：draft Topic 不保留未经方法审核的风险正文 | `kingdon-1995-agendas-alternatives-openlibrary` | 当前仅有 OpenLibrary URL；版本与议程阶段 locator 仍需复核 | research_guidance | pending_review | PASS | keep | 书目记录不自动支持“不得用于实施”等方法性建议 | 重新起草时区分 agenda-setting 与 post-adoption implementation，并补方法审核 | pending_review | not_assigned | not_assigned | not_assigned | 风险正文移除与规划中的阶段边界一致 |
| `topic-theory:access-to-educational-support-and-opportunity:educational-equity-theory:risk-notes-en` | `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` → `riskNotesEn` | research guidance removal | draft Topic | 符合：draft Topic 不保留未经方法审核的风险正文 | `unesco-2020-inclusion-education` | 当前为 UNESCO URL；具体 comparator/normative locator 未绑定 | research_guidance | pending_review | PASS | keep | institutional report 不自动批准本 Topic 的 equity comparator 或风险判断 | 重新起草时明确比较维度、规范基础和方法 reviewer | pending_review | not_assigned | not_assigned | not_assigned | 保留 draft，不对教育公平作无条件判断 |
| `topic-theory:access-to-educational-support-and-opportunity:social-capital-theory:risk-notes-en` | `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` → `riskNotesEn` | research guidance removal | draft Topic | 符合：draft Topic 不保留未经方法审核的风险正文 | `coleman-1988-social-capital` | 当前仅有 DOI URL；tie/resource/access locator 未绑定 | research_guidance | pending_review | PASS | keep | DOI 记录不自动支持 relation-enabled access 的方法风险建议 | 重新起草时区分 tie、resource、access、mobilisation 并补审核 | pending_review | not_assigned | not_assigned | not_assigned | 当前没有把联系数量或信任分数当成收益证据 |
| `topic-theory:access-to-educational-support-and-opportunity:practice-theory-bourdieu:risk-notes-en` | `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` → `riskNotesEn` | research guidance removal | draft Topic | 符合：draft Topic 不保留未经方法审核的风险正文 | `bourdieu-1977-outline-practice` | 当前仅有 DOI URL；field/capital/recognition locator 未绑定 | research_guidance | pending_review | PASS | keep | DOI 记录不自动支持 field/capital/recognition 的应用风险建议 | 重新起草时补概念边界、countercase 和方法审核 | pending_review | not_assigned | not_assigned | not_assigned | 当前保持 draft 与公开边界分离 |
| `topic-theory:communities-of-practice-in-teacher-learning:communities-of-practice:risk-notes-en` | `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` → `riskNotesEn` | research guidance removal | draft Topic | 符合：draft Topic 不保留未经方法审核的风险正文 | `cop-wenger-1998` | 当前仅有 Cambridge URL；三项实践条件需合法原文定位 | research_guidance | pending_review | PASS | keep | 书目页不自动证明学校、PLC 或平台就是 CoP | 重新起草时补 participation evidence 与 methods review | pending_review | not_assigned | not_assigned | not_assigned | 移除原风险正文，避免把比较性建议写成事实 |
| `topic-theory:communities-of-practice-in-teacher-learning:teacher-professional-development-theory:risk-notes-en` | `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` → `riskNotesEn` | research guidance removal | draft Topic | 符合：draft Topic 不保留未经方法审核的风险正文 | `teacher-development-clarke-hollingsworth-2002` | 当前仅有 DOI URL；professional-growth mechanism locator 未绑定 | research_guidance | pending_review | PASS | keep | DOI 记录不自动批准 teacher-growth route 的风险建议 | 重新起草时补机制、条件和 methods review | pending_review | not_assigned | not_assigned | not_assigned | 继续保持 draft，不进入公开 Topic route |
| `topic-theory:communities-of-practice-in-teacher-learning:social-capital-theory:risk-notes-en` | `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` → `riskNotesEn` | research guidance removal | draft Topic | 符合：draft Topic 不保留未经方法审核的风险正文 | `coleman-1988-social-capital` | 当前仅有 DOI URL；relation/resource locator 未绑定 | research_guidance | pending_review | PASS | keep | DOI 记录不自动支持 CoP 与 social-capital 的方法区分 | 重新起草时分开 mechanism 与 normative frame，并补审核 | pending_review | not_assigned | not_assigned | not_assigned | 当前更新减少了未经审核的复合建议 |
| `theory-scholar:multiple-streams-framework:john-w-kingdon` | `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts` → `theoryScholars` | canonical relation removal | draft scholar target；关系已撤下 | 符合：规划明确批准撤下三条 draft-target canonical 关系，保留 scholar authoring 内容 | `kingdon-1995-agendas-alternatives-openlibrary`; `msf-kingdon-2011` | 现有出版/版本边界记录；不把 2013 Pearson 记录当作原版 | editorial_synthesis | blocked | PASS | remove | Kingdon profile 与 draft authoring 仍保留；公开 canonical graph 不再连接 draft target | 在授权的本地 DB 上执行 seed、确认 stale relation 为 0；不因此改变 scholar status | pending_review | not_assigned | not_assigned | not_assigned | 规划中有明确 owner scope；DB runtime 尚未验证 |
| `theory-scholar:teacher-life-history-research:ivor-f-goodson` | `src/data/corpus/content-batches/2026-07-19-goodson-day-draft-scholars.ts` → `theoryScholars` | canonical relation removal | draft scholar target；关系已撤下 | 符合：draft scholar 保留 profile/sources/authoring relation，不保留 published canonical edge | `goodson-2013-narrative-theory`; `teacher-life-history-goodson-sikes-2001` | 现有书目记录；未把 key-contributor 编辑判断升级为 founder | editorial_synthesis | blocked | PASS | remove | 只撤 canonical edge，不删除 Goodson draft profile 或 source records | 在授权的本地 DB 上验证 stale relation 为 0；保持 draft | pending_review | not_assigned | not_assigned | not_assigned | owner-approved boundary closure 已记录，但预审不代替真人复核 |
| `theory-scholar:teacher-professional-development-theory:christopher-day` | `src/data/corpus/content-batches/2026-07-19-goodson-day-draft-scholars.ts` → `theoryScholars` | canonical relation removal | draft scholar target；关系已撤下 | 符合：保留 Day draft profile 与 authoring evidence，撤下未具备公开边界的 canonical edge | `day-1999-developing-teachers`; `teacher-development-day-etal-2006` | 现有书目记录；不把 plural field source 变成 single-theory founder claim | editorial_synthesis | blocked | PASS | remove | 关系撤下不改变 Day profile 的 draft 状态和来源 | 在授权的本地 DB 上验证 stale relation 为 0；不发布 profile | pending_review | not_assigned | not_assigned | not_assigned | 当前 diff 与既有 owner-approved allowlist 一致 |
| `G01` | `src/data/seed-content.ts` → `genealogy[id=G01]` | canonical genealogy relation | internal relation retained；public allowlist empty | 符合 fail-closed 方向，但 U3 公开隔离授权存在冲突记录 | prior DOI candidate; Butt-Raymond metadata | none; no lawful substantive locator reproduced | editorial_synthesis | blocked | BLOCKED | hide | 证据表明确不支持当前 association/direction/type；只能内部保留审计记录 | 获取逐条学术决定和明确 U3 owner allowlist；在此之前不得公开 | pending_review | not_assigned | not_assigned | not_assigned | evidence and review fields absent; roadmap still records U3 as pending while code comment claims authorization |
| `G02` | `src/data/seed-content.ts` → `genealogy[id=G02]` | canonical genealogy relation | internal relation retained；public allowlist empty | 符合暂时隐藏方向；尚无 direct relation evidence | none | none | editorial_synthesis | blocked | BLOCKED | hide | 没有 reproducible association/direction/type evidence | 补直接证据、逐条 human review 和 U3 owner decision | pending_review | not_assigned | not_assigned | not_assigned | current relation wording cannot be reliably judged |
| `G03` | `src/data/seed-content.ts` → `genealogy[id=G03]` | canonical genealogy relation | internal relation retained；public allowlist empty | 符合暂时隐藏方向；metadata 只能作候选线索 | `bullough-2015` metadata | metadata only; no substantive locator reproduced | editorial_synthesis | blocked | BLOCKED | hide | metadata does not support current direction/type/wording | 补 substantive locator、逐条 review 和 U3 decision | pending_review | not_assigned | not_assigned | not_assigned | metadata-only association is insufficient |
| `G04` | `src/data/seed-content.ts` → `genealogy[id=G04]` | canonical genealogy relation | internal relation retained；public allowlist empty | 符合暂时隐藏方向；证据只支持 bounded application candidate | `external_candidate:passmore-hart-2019` | AJER article Abstract, lines 37–39 | editorial_synthesis | partially_supported | BLOCKED | hide | source supports identity-to-professional-development application, not broad symmetric `integrated_with` taxonomy | 决定 canonical type/direction，完成逐条 academic review，再做 U3 decision | pending_review | not_assigned | not_assigned | not_assigned | exact canonical type and owner authorization absent |
| `G05` | `src/data/seed-content.ts` → `genealogy[id=G05]` | canonical genealogy relation | internal relation retained；public allowlist empty | 符合暂时隐藏方向；证据只支持 Bourdieu concept-level narrowing | `practice-capital-1986` | University-hosted copy, printed pp. 248–249 | editorial_synthesis | partially_supported | BLOCKED | hide | source does not support plural Social Capital Theory endpoint branching from Practice Theory | 窄化 endpoint/type 后仍需 academic review 和 U3 decision | pending_review | not_assigned | not_assigned | not_assigned | current taxonomy is broader than evidence |
| `G06` | `src/data/seed-content.ts` → `genealogy[id=G06]` | canonical genealogy relation | internal relation retained；public allowlist empty | 符合暂时隐藏方向；证据支持 integration/application candidate，不支持 universal genealogy | `external_candidate:zhao-ge-2023` | DOI/Crossref record and article abstract | editorial_synthesis | partially_supported | BLOCKED | hide | source does not establish current broad organisational-practice wording or canonical direction/type | 决定 bounded relation wording、完成 review 和 U3 decision | pending_review | not_assigned | not_assigned | not_assigned | evidence is partial and public authorization is unresolved |
| `G07` | `src/data/seed-content.ts` → `genealogy[id=G07]` | canonical genealogy relation | internal relation retained；public allowlist empty | 符合暂时隐藏方向；当前没有 direct critique evidence | comparison candidate | none | editorial_synthesis | blocked | BLOCKED | hide | no locator supports `critiqued_by` direction/type | 补 direct critique evidence、逐条 review 和 U3 decision | pending_review | not_assigned | not_assigned | not_assigned | cannot infer critique from comparison |
| `G08` | `src/data/seed-content.ts` → `genealogy[id=G08]` | canonical genealogy relation | internal relation retained；public allowlist empty | 符合暂时隐藏方向；现有 source 是 adjacent MSF evidence | `external_candidate:petridou-et-al-2024` | DiVA repository record and abstract | editorial_synthesis | blocked | BLOCKED | hide | source does not support current association, direction, type, or wording | 寻找 direct integration evidence，完成 row-level review 和 U3 decision | pending_review | not_assigned | not_assigned | not_assigned | adjacent evidence cannot authorize current edge |

## 基线中的 12 条 published Topic–Theory 行

这 12 条不是今日工作树 diff，但预审时核对到它们当前均满足以下安全状态：

- `review_decision: pending_review`；
- `riskNotesEn` 为空，不把未审 research guidance 写入 canonical corpus/DB/public copy；
- `riskReview.reviewDecision: pending_review`；
- `reviewerIdentity`、`reviewerRole`、`reviewedAt` 未伪造；
- 仍需外部 research/claim-ledger、可复现 source locator、真实 `verifiedAt`、methods reviewer、逐行决定、rationale 和 approved wording。

因此它们可作为 `PASS` 的 fail-closed 基线，但不能标记为 `approved` 或 `published`。

## 验证结果

| command | result | note |
|---|---|---|
| `node --experimental-strip-types --test tests/content-pre-review-agent.test.ts` | passed | 1 passed / 0 failed |
| `npm run content:check` | passed | 2 disciplines、12 theories |
| `npm run typecheck` | passed | exit 0 |
| `npm run lint` | passed | exit 0 |
| `DATABASE_URL= npm test` | passed | 146 passed / 0 failed / 2 skipped；DB integration 与 build-output smoke 未运行 |
| `git diff --check` | passed | 无 whitespace error |
| DB migrate/seed | not_run | 本次预审未获数据库运行授权，也不以预审替代 DB 验证 |
| build/E2E/公网验证 | not_run | 不属于本次只读预审门禁；无发布结论 |

## 必须由真人决定的事项

1. 12 条 draft Topic–Theory 风险 guidance 是否需要重新研究、改写和逐条方法审核。
2. 3 条 draft Scholar canonical 关系撤下后的本地数据库 stale-row 验证；不改变 draft profile 的公开状态。
3. G01–G08 每条 genealogy 的 association、direction、type、wording 与最终 human review decision。
4. U3 是否正式采用“8 条全部隐藏”的公开可见性策略，并提供明确的 owner scope/allowlist；现有代码注释与路线图中的 pending 状态冲突，必须以独立 owner 决定消解。

## 状态边界

- 本次只生成了预审报告，没有修改 corpus、数据库、公开白名单、路由、sitemap、索引或部署状态。
- 预审 Agent 没有填写 reviewer、review date、approved wording、owner decision 或 publication authorization。
- 结论：`pre_review_status: BLOCKED_BY_HUMAN_REVIEW_AND_U3_DECISION`。
- Human review：`pending_review`。
- Corpus implementation：当前工作树存在候选实现，但不因本报告获得新的实现授权。
- Commit：未执行。
- Deployment/publication：`not_started`。
