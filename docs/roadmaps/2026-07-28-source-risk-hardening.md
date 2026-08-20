# Source semantics 与 Topic risk model：实施计划

> 日期：2026-07-28
> 状态：实施中
> 阶段：P0
> 负责人：Claude Code
> 关联：本窗口 P0 可信度语义校准 + Topic risk model + 核验展示修正 + 关键版本边界清理

## 1. 目标与用户价值
- 为英文硕博研究者修正页面可信度表达，避免把 DOI/Crossref/Library 元数据误读为整页理论解释或研究建议已 L1 核验。
- 本轮完成后，用户能在理论页和 topic 页看到更准确的 source coverage、bibliographic source、editorial synthesis 与 risk/use-carefully 边界。

## 2. 范围
### 包含
- 收紧 `ContentSource.supports`：DOI、OpenLibrary、Google Books、WorldCat、university-hosted PDF 只支持书目元数据或有限来源定位。
- 打通 Topic-Theory risk notes：seed 类型、seed 写入、topic query 与页面展示。
- 修正理论页顶部核验展示：不再把整页简单显示为 `L3_pending`，改为 source coverage + claim-level review ongoing。
- 清理 Kingdon、Elder、Bourdieu、Goodson/Sikes 等版本与 source_kind 边界。
- 补充测试覆盖 source semantics、risk notes、topic relation 展示与 public scope。

### 不包含
- 不新增 Psychology、Management 或其他学科公开内容。
- 不新增理论、空壳页面或 sitemap 路径。
- 不做中文全站、AI Framework Builder、账号、订阅付费、部署流程或全站视觉重做。
- 不虚构 DOI、ISBN、页码、出版信息、来源 URL 或 claim-level 核验结论。

## 3. 当前证据与决策
- 现象/复现路径：理论页顶部固定渲染 `VerificationBadge level="L3_pending" scope="page"`；topic 页面 relation 区只展示 Fit、Recommendation、Why this route、Core scholars；`prisma/schema.prisma` 已有 `riskNotesEn/riskNotesZh`，但 seed 类型和 seed 写入未打通。
- 根因或待确认假设：source records、verification entries、topic relation metadata 三者语义混在一起；`ContentSource.supports` 多处把 DOI/library metadata 写成理论解释支持。
- 需要用户确认的决策：已确认继续执行；采用无 migration 方案，因为 Prisma schema 已包含 risk notes 字段。
- 不能假设的事实或外部依赖：不能假设数据库凭证存在；不能用 DOI/Crossref 证明理论解释、适配分析、风险判断或论文写作建议。

## 4. 实施步骤
1. 更新 relation 类型与 validation — 文件：`src/data/corpus/shared/entities.ts`、`src/lib/content-validation.ts` — 产物：published topic-theory relation 必须有 `riskNotesEn`。
2. 更新 seed 写入 — 文件：`prisma/seed.ts` — 产物：`riskNotesEn/riskNotesZh` 幂等 upsert 到 `topic_theory`。
3. 更新 topic 展示 — 文件：`src/app/topics/[slug]/page.tsx`、`src/components/content/PathwayContentSections.tsx` — 产物：页面显示 Fit、Recommendation、Why this route、Risk / Use carefully、Boundary。
4. 更新 verification/source 展示 — 文件：`src/components/common/VerificationBadge.tsx`、`src/components/common/SourceBlock.tsx`、`src/components/content/TheoryArticle.tsx`、`src/lib/theory-presentation.ts` — 产物：顶部表达为 source records available / L1 bibliographic records available / editorial synthesis ongoing。
5. 更新 source semantics 与版本边界 — 文件：`src/data/corpus/shared/entities.ts`、`src/data/corpus/content-batches/*` — 产物：DOI/library/Google Books/WorldCat/university PDF 的支持范围收紧，Kingdon/Elder/Bourdieu/Goodson-Sikes source_kind 与 id/citation 语义更清楚。
6. 补充测试 — 文件：`tests/content-validation.test.ts`、必要时新增/更新渲染静态源码测试 — 产物：risk notes、source semantics、verification 文案和范围边界有自动化保护。

## 5. 数据、内容与安全
- 数据来源与核验等级：本轮不新增外部学术事实；只收紧已有来源的支持范围。L1 限定为 bibliographic metadata、publication record、publisher/library record 或明确的 source-defined vocabulary。
- 数据迁移/seed 影响：无 schema migration；有 seed 写入字段补齐。若存在 `DATABASE_URL`，需运行 migration in sync 与双次 seed 验证。
- 环境变量/权限需求：DB 验收需要 `.env` 中 `DATABASE_URL`；无凭证时明确 skipped。
- 隐私、版权或法律影响：不引入盗版下载；Bourdieu university-hosted PDF 不作为 substantive L1 proof，只保留为辅助阅读/accessible copy 边界。

## 6. 验收标准
- 自动化：`npm run content:check`、`npm run typecheck`、`npm test`、`npm run lint`、`npm run build`。
- 数据：如 DB 可用，`npm run db:migrate`、`npm run db:seed` 连续两次成功；topic-theory relation 写入并查询返回 `riskNotesEn`。
- 页面/源码：topic relation 区显示 Risk / Use carefully；理论页不再顶部显示简单 `L3_pending`；SourceBlock 说明 L1 bibliographic records 与 editorial synthesis 边界。
- 范围：Education/Sociology 与 published-only 保持，不新增学科与部署流程修改。

## 7. 风险、回退与发布判定
- P0/P1/P2 风险：若过度收紧 source semantics，部分现有内容可能失去“理论解释”显性支撑；本轮以准确性优先，必要时保留 L2/L3 文案。
- 回退方式：回退本轮 seed/type/component/test/roadmap 改动即可；无 schema migration 回滚压力。
- 发布结论条件：本地门禁通过且 DB seed（如凭证可用）通过后仅能称本地发布候选；未部署与公网验证前不称线上已更新。

## 8. 执行记录（实施后填写）

### Day 1 本地基线关闭（2026-08-02 CST）

#### 启动基线

- 分支：`feature/content-enrichment-batch-1`
- baseline / result HEAD：`676c4f3adc612ffe5fd44471627af9fe1991a987`（本窗口未创建 commit，HEAD 未变化）
- `origin/main...HEAD`：`2 0`；当前分支落后 `main` 2 个 commit，记录为后续发布阻断，本窗口未对账。
- 暂存区：空。
- 启动与编辑前复核：`git diff --check` 均通过；分支、HEAD、divergence 和既有脏文件没有实质漂移。
- 启动时脏文件清单（`tests/e2e/content-enrichment.spec.ts` 是本窗口随后新增的允许范围内修改）：

```text
 M AGENTS.md
 M prisma/seed.ts
 M prompts/README.md
 M src/app/topics/[slug]/page.tsx
 M src/components/common/SourceBlock.tsx
 M src/components/common/VerificationBadge.tsx
 M src/components/content/EntityArticle.tsx
 M src/components/content/PathwayContentSections.tsx
 M src/components/content/TheoryArticle.tsx
 M src/data/corpus/content-batches/2026-07-18-first-enrichment.ts
 M src/data/corpus/shared/entities.ts
 M src/lib/content-validation.ts
 M src/lib/knowledge-entity-presentation.ts
 M src/lib/theory-presentation.ts
 M tests/content-ui-contract.test.ts
 M tests/content-validation.test.ts
 M tests/seed-integration.test.ts
 M tests/theory-presentation.test.ts
 M tests/theory-static-ui.test.ts
?? .agents/skills/academic-claim-audit/SKILL.md
?? .agents/skills/academic-claim-audit/agents/openai.yaml
?? .agents/skills/academic-literature-review/SKILL.md
?? .agents/skills/academic-literature-review/agents/openai.yaml
?? .agents/skills/syrtag-research/SKILL.md
?? .agents/skills/syrtag-research/agents/openai.yaml
?? docs/research/2026-07-23-teacher-professional-learning-and-change-r1.md
?? docs/research/2026-07-26-teacher-professional-learning-and-change-human-review.md
?? docs/roadmaps/2026-07-23-topic-pilot-review-plan.md
?? docs/roadmaps/2026-07-28-source-risk-hardening.md
?? docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md
?? docs/standards/content-update-standard.md
?? docs/standards/content-writing-standard.md
?? prompts/08-p1-t1-teacher-professional-learning-evidence-closure.md
?? prompts/09-day1-p0-source-risk-hardening-closure.md
?? prompts/10-day2-life-course-claim-ledger.md
?? prompts/11-day3-teacher-identity-claim-ledger.md
?? prompts/12-day4-d3-human-review.md
?? prompts/13-day5-genealogy-relation-audit.md
?? prompts/14-day6-topic-research-guidance-human-review.md
?? prompts/15-day7-weekly-closeout-next-package.md
```

#### 范围与文案依据审计

- 两个只读子 Agent 均完成审计。范围审计把 17 个既有实现/测试差异逐项映射到本路线图步骤 1–6；其余脏文件可识别为既有研究、技能或七天治理工作，未发现无法归类的所有权问题，且均保持不变。
- 文案契约审计确认目标 E2E 用例恰有三条旧断言：source-register intro、page-source summary、page-level note；现有实现和 focused/static 契约已使用同一组 source-record / bibliographic / editorial-synthesis 边界。
- 确认依据：本路线图第 3 节记录“已确认继续执行”，第 4–6 节明确要求 source records available、L1 bibliographic records、editorial synthesis ongoing 及 SourceBlock 的 L1/编辑边界；`ADR-027` 的 Accepted compatibility boundary 要求把 source metadata、editorial synthesis 和 claim-level review 分开。
- 没有证据要求修改任何条件允许的实现文件。

#### 实际改动

- 保留既有 P0 实现及全部其他脏文件。
- 仅在 `tests/e2e/content-enrichment.spec.ts` 的 `published scholar profiles show attribution boundaries and source semantics` 测试块内，一起更新三条过时文案断言；未跳过、删除、放宽或增加超时。
- 回填本执行记录。
- 创建 Obsidian 审核记录 `2026-08-03-source-risk-hardening-local-baseline.md`，保持 `review / true / pending / not_started`。

#### 验证结果

```text
command: npm run content:check
result: passed
reason: 2 disciplines、12 theories 的 content onboarding validation 通过。

command: npm run typecheck
result: passed
reason: tsc --noEmit 退出码 0。

command: npm test
result: passed
reason: 沙箱内首次尝试因本机 PostgreSQL 回环连接被 EPERM 阻止；在沙箱外用原命令重跑，126 passed、0 failed、1 skipped（build smoke 按设计留给 build）。

command: npm run lint
result: passed
reason: eslint 退出码 0。

command: npm run db:migrate
result: passed
reason: 仅连接已确认的本机 PostgreSQL 回环数据库；schema 已同步，无待应用 migration。

command: npm run db:seed
result: passed
reason: 第一次 seed 完成。

command: npm run db:seed
result: passed
reason: 第二次 seed 完成，幂等性门禁通过。

command: npm run build
result: passed
reason: Next.js production build 编译成功，96/96 静态页生成；build 内 required-mode output smoke 1 passed。

command: node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts
result: passed
reason: 字面命令退出码 0，但测试自身 guard 报 0 passed / 1 skipped；同一 smoke 断言已在紧邻的 npm run build 内真实通过，并用 BUILD_OUTPUT_SMOKE_REQUIRED=1 补跑为 1 passed / 0 skipped。

command: npm run test:e2e -- tests/e2e/content-enrichment.spec.ts --grep "published scholar profiles show attribution boundaries and source semantics"
result: passed
reason: 新鲜 build 上 1 passed；修改后的三条断言均通过。

command: npm run test:e2e
result: passed
reason: 新鲜 build 上 36 passed；终端有非阻断性的 Next.js NoFallbackError 日志，但 Playwright、浏览器健康和断言全部通过。

command: git diff --check
result: passed
reason: 无输出，退出码 0。
```

环境处置记录：目标 E2E 的首次沙箱运行因本机端口绑定 `EPERM` 未进入测试；沙箱外首次运行发现当前 Playwright Chromium 未安装。执行 `npx playwright install chromium` 后，目标用例在完整门禁前和新鲜 build 后均真实通过。该安装写入用户 Playwright cache，未改变仓库依赖或文件范围。

#### 状态、未完成项与下一步

- 本地验证：`local_release_candidate`。
- Research：本轮不新增学术来源或事实；既有 source semantics 边界保持。
- Human review：P0 UI wording 依据可追溯；本次本地结果仍待 owner 审核。
- Corpus implementation：既有 P0 本地实现已完成本轮门禁；未新增实体、关系、页面或公开路径。
- Commit：未授权、未执行。
- Deployment：`not_started`；未执行公网验证，不声称已发布。
- 未完成项：当前分支落后 `main` 2 个 commit；commit、分支对账、push、PR、deployment 和公网验证均不在 Day 1 授权范围。
- owner 下一步唯一需要决定的事项：是否接受这份 `local_release_candidate` 的精确差异，并另行授权 commit。不得自动开始 Day 2。

### 独立审核修正与 fail-closed 收口（2026-08-02 CST）

#### 基线与执行边界

- 基线 / 当前 HEAD：`c177740156ad834515f95cf83076e1498240cd9d`（`fix: harden source risk semantics`）。
- `origin/main...HEAD`：`2 1`；本轮未 fetch、pull、merge、rebase 或处理分支落后。
- 暂存区为空；本轮修正保持未提交。
- 创建一个全新实施 Agent，仅修改 14 个 P0 直接实现/测试文件；两个既有独立审核 Agent 分别按规格和 Standards/ADR 做了两轮只读复审。
- 实施期间出现与本任务无关的并发页面、SEO、Footer 和测试差异；均按用户工作保留，未纳入本轮修改或所有权声明。
- 未开始 Day 2–7，未新增实体、来源、关系、页面或公开路径，未改 schema、migration、发布状态、索引、sitemap 或广告控制。

#### 审核发现与修正

- 第一轮独立复审发现：24 条未获方法审核的 research guidance 仍位于 canonical corpus；accepted contract 缺少 review readiness、rationale、最终批准 wording / 修订指令；`sourceId` 未绑定 relation 自身 `sourceUrls`；Risk/Boundary 仅有 helper/static 测试。
- 从 canonical `SeedTopicTheory` 数据移除 24/24 条 substantive `riskNotesEn` 草稿。12 条 published relation 只保留不含来源、locator、reviewer、日期或批准结论的 neutral pending governance；12 条 draft relation 不保留 risk wording 或 review record。
- accepted contract 现在必须同时具备 evidence status、`ready_for_human_review`、relation-bound source、locator、真实 verification/review 日期、methods reviewer、rationale 与最终 `approvedWordingEn`；`accept_with_revision` 还必须有 bounded `revisionInstruction`。批准文案与实际 `riskNotesEn` 不完全一致时不持久化。
- seed create/update 对 pending、rejected、incomplete、wording mismatch 或 source mismatch 一律写 `riskNotesEn: null`；同时保留缺省 `suitabilityNotesZh` 的既有数据库值。
- legacy L1/source records 统一展示为 `source_record`，不再冒充 claim-level `L1_verified`。
- Topic 页面始终显示 relation-level `Risk / Use carefully`；数据库无已批准正文时显示 `Pending human review`。Pathway `limitations` 恢复为独立 `Boundary`。
- 新增真实 Topic 路由 E2E，验证 `Risk / Use carefully — Pending human review` 与 `Boundary` 同时、分离可见。

#### 最终验证结果

```text
command: DATABASE_URL= node --env-file-if-exists=.env --experimental-strip-types --test tests/content-ui-contract.test.ts tests/content-validation.test.ts tests/seed-integration.test.ts tests/theory-presentation.test.ts
result: passed
reason: 42 passed、0 failed、1 DB integration skipped；非 DB focused contract 全部通过。

command: npm run content:check
result: passed
reason: 2 disciplines、12 theories 的 content onboarding validation 通过。

command: npm run typecheck
result: passed
reason: 最终工作树上 tsc --noEmit 退出码 0。

command: npm test
result: passed
reason: 136 passed、0 failed、1 build-output smoke skipped；DB integration 连接已确认的本机回环 PostgreSQL 通过。

command: npm run lint
result: passed
reason: 最终工作树上 eslint 退出码 0。

command: npm run db:migrate
result: passed
reason: 仅连接已确认的 127.0.0.1 PostgreSQL；schema 已同步，无 pending migration。

command: npm run db:seed
result: passed
reason: 第一次最终 seed 成功，未审核 risk 正文被清为 null。

command: npm run db:seed
result: passed
reason: 第二次最终 seed 成功，幂等性通过。

command: node --env-file-if-exists=.env --experimental-strip-types --test tests/seed-integration.test.ts
result: passed
reason: seed 后 DB integration 1 passed，代表性 published relation 的 riskNotesEn 为 null。

command: npm run build
result: passed
reason: production build 成功，96/96 静态页；build 内 required-mode smoke 1 passed。

command: node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts
result: passed
reason: 字面命令退出码 0，guard 标记 1 skipped；相同断言已在紧邻 build 的 required mode 中 1 passed / 0 skipped。

command: npm run test:e2e -- tests/e2e/content-enrichment.spec.ts --grep "published topic keeps pending relation risk separate from pathway Boundary content"
result: passed
reason: 首次运行因 exact text locator 无法匹配同一 span 内的粗体标签与正文而失败；Playwright error context 已证明真实页面同时存在两段目标文本。仅修正 locator 后复跑 1 passed，未放宽文案要求。

command: npm run test:e2e -- tests/e2e/content-enrichment.spec.ts --grep "published scholar profiles show attribution boundaries and source semantics"
result: passed
reason: 原 Day 1 目标用例 1 passed。

command: npm run test:e2e
result: passed
reason: 最终全量 37 passed；非阻断性 Next.js NoFallbackError 日志仍存在，但 Playwright 断言与浏览器健康检查全部通过。

command: git diff --check
result: passed
reason: 最终工作树无 whitespace error。
```

#### 最终独立复审与状态

- Spec：`PASS_WITH_BLOCKER`；14 个允许文件无 Critical、Important 或 Minor 发现。
- Standards/ADR：`PASS_WITH_HUMAN_REVIEW_BLOCKER`；14 个允许文件无代码发现。Neutral pending governance 仅标识 claim slot 与阻断状态，不含研究结果、proposed wording、source/locator、reviewer 或推断决定，因此不违反 research-record separation。
- 本地代码/数据/页面验证：`passed_fail_closed`。
- P0 substantive risk guidance：`blocked_pending_methods_review`。12 条 published relation 仍需外部 research/claim-ledger 记录、可复现 source + locator、真实 `verifiedAt`、methods reviewer 身份/日期/逐行决定/rationale 与最终批准 wording；完成前不得进入 corpus、DB 或公开页面。
- Commit：本轮没有新授权，未执行；HEAD 保持 `c177740`。
- Push / PR / deployment / public verification：均未执行；`deployment_status: not_started`。
- 本轮不能继续称 substantive risk model 已完整关闭，也不能自动开始 Day 2。下一步只能是：owner 接受当前 fail-closed 差异并另行授权 commit，或先组织真实方法审核包。

### Comprehensive content-governance remediation execution（2026-08-02 CST）

#### 基线、允许清单与角色

- 当前基线 / HEAD：`c177740156ad834515f95cf83076e1498240cd9d`；实施前 21 个既有允许文件逐一与 `/tmp/syrtag-content-governance.JioHLD/pre-e-snapshot` 比对，无漂移；暂存区为空。
- 角色分离：A = source/date/presentation compatibility；B = 两条 U0 书目修正；C = published-target fail-closed；D = 固定 claim/genealogy 审计、路线图、Vault 评审记录。A/B/C 是自动代码包；D 只记录证据和待决策事项，不批准研究结论。
- 精确允许清单：

```text
src/data/corpus/shared/entities.ts
src/data/corpus/content-batches/2026-07-18-first-enrichment.ts
src/lib/content-validation.ts
src/lib/knowledge-entity-presentation.ts
src/lib/theory-presentation.ts
src/lib/seed-verification.ts
src/components/common/VerificationBadge.tsx
src/components/common/SourceBlock.tsx
src/components/content/EntityArticle.tsx
src/components/content/TheoryArticle.tsx
src/app/styles/content.css
prisma/seed.ts
prisma/schema.prisma
tests/content-validation.test.ts
tests/content-ui-contract.test.ts
tests/seed-corpus-regression.test.ts
tests/seed-integration.test.ts
tests/theory-presentation.test.ts
tests/theory-static-ui.test.ts
tests/seo.test.ts
docs/research/claim-audit/2026-08-02-full-site-verification-migration-inventory.md
docs/research/genealogy-audit/2026-08-02-existing-relations-remediation-review.md
docs/roadmaps/2026-07-28-source-risk-hardening.md
/Users/fanlw/Documents/Website-Content-Hub/20-16-博士知识图谱网站建设/30-待审核/网站更新记录/2026-08-02-syrtag-comprehensive-content-governance-remediation.md
/tmp/syrtag-content-governance.JioHLD/wave3-implementation-report.md
```

#### 精确变更

- A：仅保留三条 Life Course 行级真实日期；删除 publication/global/page-field 日期回退与聚合；12 条 theory-derived DB 兼容记录仍为 `L1_verified` 存储层，但含义固定为 `legacy_source_metadata` 且无聚合日期。公开展示统一为 listed `source_record`；L2 标识改为 `L2_editorial` / `editorial_synthesis`；SourceBlock 与页面说明明确 source record 不等于 claim-level verification。
- B：按 Crossref/IUCAT 记录只修正 Kelchtermans 2009 与 Herweg、Zahariadis、Zohlnhöfer 2018 的长 citation/title；短导航标签及其他解释、关系、publisher 字段未改。
- C：对 published owner 的直接 theory/work/concept/scholar/topic/genealogy/discipline/field 链接增加 published-target fail-closed；draft owner 仍可保留 authoring reference。没有修改发布状态、关系语义、图谱/route/visibility。
- D：新增 79-row L1、74-row L3、9-row Topic 待审核清单和 8-row genealogy evidence review；选择的唯一下一证据包为 `WP-EVIDENCE-NEXT-01`（G04–G06）。没有声称 human approval、corpus completion、publication 或 public verification。

#### TDD 与验证结果

```text
Package A RED: 44 passed / 9 failed（旧日期与展示契约被命中）
Package A GREEN: 53 passed / 0 failed
Package B RED: 5 passed / 1 failed（旧 Kelchtermans citation 被命中）
Package B GREEN: 6 passed / 0 failed
Package C RED: 2 passed / 1 failed（published theory-work → draft 被命中）
Package C focused GREEN: 3 passed / 0 failed（参数化覆盖 16 类 direct link 的 draft/archived target，并含 draft-owner control）
SEO safety regression: 4 passed / 0 failed

npm run content:check: failed — 3 条既有 published theory → draft scholar 关系被新 fail-closed 规则正确阻断。
npm run typecheck: first failed on test narrowing; allowlist 内保持同一运行时断言后 passed。
DATABASE_URL= node --experimental-strip-types --test tests/content-validation.test.ts tests/content-ui-contract.test.ts tests/seed-corpus-regression.test.ts tests/theory-presentation.test.ts tests/seo.test.ts: 48 passed / 6 failed；6 项均由同 3 条既有关系传播。
DATABASE_URL= npm test: 134 passed / 6 failed / 2 skipped；6 项均由同 3 条既有关系传播；DB integration 因空 DATABASE_URL skipped。
npm run lint: passed。
DATABASE_URL= npm run build: reduced coverage / interrupted after约 150 秒；停留在 Next.js optimized production build，无错误输出。未将其声称为 build proof。
git diff --check: passed。
post-edit protected non-allowlist hash check: 35 files checked, no drift。
```

#### DB、E2E、阻断与授权状态

- 未提供本窗口安全 DB 身份/授权：`db:migrate`、`db:seed`、DB integration 与 DB-dependent E2E 全部 `not_run`；未读取或输出 `.env`、DATABASE_URL、主机凭据或 secret。
- 当前硬阻断是三条既有关系：`multiple-streams-framework → john-w-kingdon`、`teacher-life-history-research → ivor-f-goodson`、`teacher-professional-development-theory → christopher-day`。解除阻断需要关系或 publication-state 决策，均超出本轮授权；不得通过弱化验证绕过。
- 74 个 L3 块、8 条 genealogy relation、3 个 `founding_text` 分类、9 条 Topic review 和 79 个 L1 claim migration 仍需指定人类评审；owner 还需决定 U3 visibility/publication 策略。
- 状态：`BLOCKED`（实现已写入允许清单，但 release gate 被真实 legacy publication-boundary violations 阻断）。
- Commit / push / PR / merge / rebase / deployment / public verification：均未授权、未执行；`deployment_status: not_started`。

### E2 correction addendum（2026-08-02 CST）

本附录只纠正 Wave 3 执行记录中的 cohort、taxonomy、genealogy validation/audit 与 Vault 草稿分支陈述；历史执行记录保留。以下陈述取代上文相冲突的“完成”描述：

- 上文 D 包“79-row L1、74-row L3”仅证明行数，不证明 cohort 正确，现由 corrected inventory 取代。正确 published cohort 为 74 entities：discipline 2、field 6、theory 12、scholar 7、work 19、concept 24、topic 4。embedded L1 为 79（2/6/17/7/19/24/4），L2/L3 各 74（2/6/12/7/19/24/4）。draft scholars 不在 L1/L3 queue；9 条 Topic research-guidance 仅存在于独立 review queue。
- 上文未列明的 `founding_text` 完成陈述由三条正确 pending U2 记录取代：`life-course-theory → elder-1998-life-course`、`structuration-theory → struct-giddens-1984`、`institutional-theory → dimaggio-powell-1983-iron-cage`。未改任何 taxonomy 或 relation。
- `WP-EVIDENCE-NEXT-01` 仍只含 G04–G06，但它们分别是 `teacher-identity → teacher-development`、`practice → social-capital`、`practice → institutional`；不得再称为三条 teacher-identity relation。
- 上文 C 包“canonical genealogy source and target”完成陈述由 E2 的可复现 RED→GREEN 取代：canonical list 中每条关系的 source 与 target 均必须 `published`；source/target 各自改为 `draft` 或 `archived` 都产生精确错误。Draft authoring relation 未加入 canonical list。entry-point mutation 现覆盖实际可构造的 topic、field、theory、scholar、work、concept 六类 target，各自覆盖 `draft` 与 `archived`。
- 8-row genealogy audit 的旧非标准值和日期陈述由 corrected 8×21 table 取代。`content_nature` 仅用 `editorial_synthesis`；`evidence_status` 仅用允许词表。G04–G06 为 `partially_supported`，G01–G03、G07–G08 为 `blocked`。G04/G05/G06/G08 的 `2026-08-02` 仅表示实际 source-access/evidence-check，不表示人工批准。
- Vault payload 仍只是 `/tmp` 草稿，`source_branch` 已纠正为 `feature/content-enrichment-batch-1`；外部 Vault 目标仍未写入。

E2 验证证据：

```text
pre-E2 cmp: 7/7 authorized existing files byte-identical to pre-e2-snapshot before first edit
canonical genealogy RED: 0 passed / 1 failed — draft source missing exact fail-closed error
canonical genealogy GREEN: 1 passed / 0 failed
canonical + all direct-link mutation focus: 2 passed / 0 failed
content-validation file: 27 passed / 5 failed; five failures are propagation of the same three pre-existing published-theory → draft-scholar blockers
npm run typecheck: passed
npm run content:check: failed with exactly the same three pre-existing blockers
cohort/document audit: L1 79 (2/6/17/7/19/24/4), L3 74 (2/6/12/7/19/24/4), Topic queue 9, genealogy 8 rows × 21 fields
```

三条既有 blocker、空 DB 下被中止且无证明力的 build、DB/seed/E2E `not_run`、外部 Vault 写入被拒绝的状态均原样保留并超出 E2 范围。E2 未执行 commit、push、PR、merge、rebase、DB mutation、deployment 或 public verification。

### Owner-approved canonical TheoryScholar boundary closure（2026-08-02 CST）

#### Owner 决策与范围

- Owner 明确批准删除三条 canonical `TheoryScholar` 关系：
  - `multiple-streams-framework → john-w-kingdon`
  - `teacher-life-history-research → ivor-f-goodson`
  - `teacher-professional-development-theory → christopher-day`
- 三位 scholar 均继续保持 `draft`、无 `publishedAt`；其 profile、sources、representative works 与 draft content 内部 `theory_relationships` authoring 记录全部保留。
- 未修改三个 theory 的 published 状态，未修改或弱化 published-target validator，未改其他关系。
- 本包修改两个 corpus batch、三个测试文件与 `prisma/seed.ts`，并在本 roadmap 追加结果；未提交、推送、部署或操作数据库。

#### RED → GREEN

```text
RED:
DATABASE_URL= node --experimental-strip-types --test tests/second-scholar-enrichment.test.ts tests/seed-corpus-regression.test.ts
result: 4 passed / 3 failed
reason: Goodson canonical relation仍存在、raw TheoryScholar 总数仍为 10、canonical published graph 仍含 draft target。

GREEN:
DATABASE_URL= node --experimental-strip-types --test tests/second-scholar-enrichment.test.ts tests/seed-corpus-regression.test.ts tests/content-validation.test.ts
result: 39 passed / 0 failed
reason: canonical 总数收敛为 7；三位 draft scholar 的内部 authoring relation 保留；canonical endpoints 全部为 published。
```

#### 最终本地验证

```text
npm run content:check: passed（2 disciplines、12 theories）
npm run typecheck: passed
DATABASE_URL= node --env-file-if-exists=.env --experimental-strip-types --test tests/second-scholar-enrichment.test.ts tests/seed-corpus-regression.test.ts tests/content-validation.test.ts tests/seed-integration.test.ts: 39 passed / 0 failed / 1 DB integration skipped
DATABASE_URL= npm test: 141 passed / 0 failed / 2 skipped
npm run lint: passed
git diff --check: passed
DATABASE_URL= npm run build: interrupted after约 90 秒，exit 130；停留在 Creating an optimized production build，无错误输出，也无成功证明
db:migrate / db:seed ×2 / DB integration runtime: not_run（owner 只授权修改持久化契约，不授权本轮实际数据库操作）
```

#### 当前状态与边界

- 原三条 publication-boundary blocker 已在本地 canonical corpus/content gate 中关闭；这不等于数据库、build、E2E、部署或公网验证完成。
- build 仍无成功证明；空 `DATABASE_URL` 下 DB integration 与 build-output smoke 分别保持 skipped/not reached。
- `WP-EVIDENCE-NEXT-01`（G04–G06）、79 L1、74 L3、9 Topic、8 genealogy 与 3 个 `founding_text` 分类仍保持各自人工审核边界，本包未推进或批准这些事项。
- 独立 Standards 复审曾发现持久化 P1：`prisma/seed.ts` 只 upsert 当前 7 条 canonical 关系，不删除旧 seed 已写入的三条记录。Owner 随后明确扩展 allowlist 到 `prisma/seed.ts` 与 `tests/seed-integration.test.ts`：seed 现在只对三组精确 composite key 执行幂等 `deleteMany`，再 upsert 当前 7 条关系；integration contract 将 total 基线改为 7，并逐组断言三条 retired relation 的 DB count 为 0。未运行数据库，因此该持久化行为是 implemented / typechecked，但仍是 DB runtime `not_run`。
- Obsidian 待审核记录先因缺少外部披露授权被权限审查拒绝；Owner 随后明确授权，已将 `/tmp/syrtag-content-governance.JioHLD/vault-review-draft.md` 精确同步到固定 Vault 目标。记录仍为 `status: review`、`needs_human_review: true`、`owner_decision: pending`、`deployment_status: not_started`。
- Commit / push / PR / merge / rebase / DB mutation / deployment / public verification：均未执行；`deployment_status: not_started`。
