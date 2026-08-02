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
