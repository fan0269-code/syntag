# Syntag 2026-07-18 内容更新与 Codex 多代理执行计划

> **给 Codex 主控与子 Agent：** 本计划只规划并指导内容批次的审计、证据补全、语料整合与验收。执行时必须采用多 Agent 分工；共享语料文件只能由一个 Integrator 修改。

**目标：** 在不扩大 Education/Sociology 公开范围、不虚构学术事实、不覆盖现有未提交改动的前提下，审计并收口 2026-07-18 首批内容丰富批次，形成可追溯、可测试、可决定发布状态的 4 个 Topic 与 4 名 Scholar 候选内容。

**架构：** 先由页面证据 Agent 并行拆解 Claim，再由来源、方法、关系、版次与反方审查 Agent 交叉复核；主控冻结“发布决策合同”后，才允许唯一内容 Integrator 与测试 Agent 分区并行写文件。所有数据库、双次 seed、构建、E2E 和最终发布判断由主控 Integrator 串行执行。

**技术栈：** Next.js 16 App Router、TypeScript、Prisma 7、PostgreSQL、node:test、Playwright、axe、Tailwind CSS 4。

---

## 0. 执行结论

今天的最优任务不是继续增加第 5 个 Topic，也不是扩展 Psychology 或 Management，而是把当前未提交的“4 个 Topic + 4 名 Scholar 候选”收口为第一个受控内容更新批次。

### 0.1 默认发布判断

| 对象 | 当前本地状态 | 今日默认判断 | 可改变条件 |
|---|---|---|---|
| `teacher-professional-learning-and-change` | `published` | `HOLD_DRAFT` | Claim 级 locator、独立方法审核、真实审核记录全部通过后，方可单页批准 |
| `education-policy-implementation-frontline-discretion` | `published` | `HOLD_DRAFT` | 明确 policy/service、frontline unit、implementation stage，且 L1/L2 门禁全部通过 |
| `access-to-educational-support-and-opportunity` | `published` | `HOLD_DRAFT` | 明确 support/opportunity、population、comparator、mechanism，且 L1/L2 门禁全部通过 |
| `communities-of-practice-in-teacher-learning` | `published` | `HOLD_DRAFT` | 证明 mutual engagement、joint enterprise、shared repertoire 的适用边界并完成独立复核 |
| `jean-lave` | `published` | 条件候选，默认 `HOLD_DRAFT` | 逐 Claim locator、合著边界、独立 source verifier 和 publication editor 全部批准 |
| `etienne-wenger` | `published` | 条件候选，默认 `HOLD_DRAFT` | 区分 1991 合著与 1998 独著，避免 sole-founder 表述，并完成独立审核 |
| `michael-lipsky` | `published` | 条件候选，默认 `HOLD_DRAFT` | 1980/2010 版次拆分、身份和理论关系全部通过独立审核 |
| `john-w-kingdon` | `draft` | 必须继续 `draft` | 1984/1995/2011/2013 版次账本全部一致后，另行终审 |

### 0.2 今天可接受的公开结果

- 最保守结果：8 个候选全部作为高质量 draft 入库，公开站点无新增页面，但证据链和后续发布条件完整。
- 条件结果：Lave、Wenger、Lipsky 中通过完整门禁的页面可逐页发布；不得按批次打包放行。
- 4 个 Topic 只有在其各自的 Claim、路由、唯一性和方法审核全部通过时才可逐页发布；不得因为页面结构完整或测试通过而自动发布。
- Kingdon 今天不得发布。

---

## 1. 当前基线与问题定义

### 1.1 产品内容目标

Syntag 的定位是：**把研究题目转化为理论路径，把理论路径转化为研究框架。** 内容不是文章堆积，而是“问题入口 → 理论适配 → 学者/原典/概念 → 研究操作化”的知识图谱闭环。

当前公开范围只覆盖 Education 与 Sociology。基线内容包括：2 个 Discipline、6 个 Field、12 个主 Theory、19 个 Work、24 个 Concept、4 个既有 Topic、4 个既有 Scholar、8 条 TheoryGenealogy。

### 1.2 当前未提交批次

当前工作区已经存在以下本地改动，Codex 必须保留并在原基础上审计，禁止重置或覆盖：

- 新增 4 个 Topic；
- 新增 12 条 TopicTheory；
- 新增 4 名 Scholar 候选；
- 新增 4 条 TheoryScholar；
- 新增研究包与路线图；
- 新增内容 batch 模块；
- 修改 legacy L1 来源展示语义；
- 修改静态语料、集成和 E2E 测试。

### 1.3 关键冲突

`docs/research/2026-07-18-*.md` 将多个候选明确标为 research-ready、not publish-ready，且 ADR-027 规定：

- `L1_verified` 的旧值只代表 `legacy_source_metadata`；
- 没有 locator、reviewer、真实 review date 和 approval，不得显示或理解为 claim-level `source_verified`；
- 只有 `approved + source_verified + source_backed_fact` 才能展示 “Source verified”；
- L2 是编辑综合，L3 是研究指导，二者不能伪装成来源事实。

但当前本地 batch 将 4 个 Topic 和 3 名 Scholar 标为 `published`。因此，今天的首要任务是解决“研究证据门槛”与“本地发布状态”不一致，而不是继续扩充数量。

---

## 2. 今日范围

### 2.1 包含

1. 审计现有未提交内容批次，不删除、不重写用户已有工作。
2. 对 4 个 Topic 与 4 名 Scholar 逐页建立 Claim 级证据矩阵。
3. 对 Topic 的 `primary / supporting / not_recommended` 进行独立方法审核。
4. 对 Scholar 身份、作品、版次、理论归因和关系谓词进行来源审核。
5. 建立 Kingdon 版次账本；同时复核 Lipsky 1980/2010 出版史。
6. 冻结逐页发布状态、关系状态、公开计数和 draft 隔离规则。
7. 由唯一内容 Integrator 修改当前 batch/manifest。
8. 由唯一测试 Agent 更新静态、seed integration 和 E2E 断言。
9. 在隔离数据库中完成 migrate、两次幂等 seed、测试、构建、smoke、E2E 和公开表面验收。
10. 更新路线图执行记录，输出明确的 `可发布 / 条件发布 / 不可发布` 结论。

### 2.2 不包含

- 不新增第 5 个 Topic。
- 不新增 Theory、Work、Concept、Field、Discipline 或 Genealogy。
- 不新增 Psychology、Management/OB 或通用 public-policy 公开内容。
- 不修改 Prisma schema 或 migration，除非发现现有数据模型无法保持 public-read invariant；若发生，停止并另立专项。
- 不建设 CMS、账户、付费、AI 框架生成或中文站点。
- 不修改部署脚本。
- 不把 DOI、出版社页、大学人物页或搜索摘要扩大解释为其不能支持的理论主张。
- 不在页面、组件或路由中硬编码学术内容绕过 seed corpus。

---

## 3. 权威文件与读取顺序

所有 Agent 开始前按顺序读取：

1. `CLAUDE.md`
2. `AGENTS.md`
3. `docs/SITE_CONSTRUCTION_PLAYBOOK.md`
4. `docs/decisions/ADR-027-evidence-status-and-content-nature.md`
5. `docs/roadmaps/2026-07-18-first-content-enrichment.md`
6. 与自己页面相关的 `docs/research/2026-07-18-*.md`
7. `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts`
8. `src/data/corpus/shared/entities.ts`
9. `src/data/seed-content.ts`
10. `src/lib/content-validation.ts`
11. 与自己任务相关的测试文件。

产品设计文档 `../Syntag-产品设计文档.md` 仅用于产品方向参考；运行时 schema、内容合同、ADR 和 Playbook 优先。

---

## 4. 全局不可违反规则

1. 先执行 `git status --short --branch` 和 `git diff --name-status`，记录现有未提交内容。
2. 禁止 `git reset --hard`、`git restore .`、`git checkout -- .`、`git clean -fd`、`git stash`。
3. 不覆盖、删除、移动或统一格式化不属于本任务的现有未提交文件。
4. `src/data/seed-content.ts` 继续是唯一生产内容入口；当前 batch 必须通过 `src/data/corpus/shared/entities.ts` 聚合。
5. 所有公开页面、搜索、图谱、API、静态参数、sitemap 和内链只允许 `status: "published"`。
6. draft 实体可以写入数据库，但其本体、slug、标题、别名、关系节点和关系边不得出现在任何 public surface。
7. 任何来源不足、locator 缺失、关系谓词不确定或审核冲突，默认保持 `draft`。
8. 不把“来源已列出”写成“主张已验证”。
9. 不把 L2 theory-fit 写成来源事实或普遍排名。
10. 不把 L3 研究建议写成方法处方、因果结论或效果保证。
11. 不从共同作者、共同引用、时间先后、相邻理论、共同机构或共享词汇推导影响、师承、创始或 genealogy。
12. 不使用 Wikipedia、Wikidata、博客或搜索摘要作为实质性学术主张的唯一来源。
13. 不执行 `npm run db:reset` 或 `prisma migrate reset`。
14. 数据库动作只允许在确认隔离的本地/CI 验收数据库中执行。
15. 严格顺序：`db:migrate → db:seed → db:seed → build`。
16. 在发布合同冻结前，任何写入 Agent 不得修改 batch、manifest 或测试期望。

---

## 5. 多 Agent 编排总览

### 5.1 波次与依赖

| 波次 | Agent | 并行性 | 写入权限 | 主要产物 |
|---|---|---|---|---|
| A | 8 个页面证据 Agent | 8 路并行 | 仅独立审计文档 | 每页 Claim 矩阵、缺口、状态建议 |
| B | 5 个专业复核 Agent | 5 路并行 | 仅独立审计文档 | 来源、方法、关系、版次、反方结论 |
| C | 主控 Publication Editor | 串行 | 发布合同文档 | 逐页最终状态与精确计数 |
| D | 内容 Integrator + 测试 Agent | 2 路并行 | 文件边界互斥 | 内容实现提交、测试提交 |
| E | 主控 Integrator | 串行 | 路线图执行记录 | 数据库、构建、E2E、最终报告 |

### 5.2 单一写入者原则

- `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts`：只有内容 Integrator 可写。
- `src/data/corpus/shared/entities.ts`：只有内容 Integrator 可写。
- `src/lib/knowledge-entity-presentation.ts`：如发布合同要求修复展示语义，只允许单独的来源语义 Agent 或内容 Integrator 中的一人写，不能两人同时写。
- `tests/**`：只有测试 Agent 可写。
- 页面证据 Agent 和专业复核 Agent 不得写 `src/` 或 `tests/`。
- 主控 Integrator 不直接“顺手修”内容或测试；发现问题退回唯一所有者。

---

## 6. 波次 A：8 个页面证据 Agent

每个 Agent 只处理一个页面，产物写入独立文件，互不覆盖。建议路径：`docs/research/reviews/2026-07-18/<slug>-claim-review.md`。

### 6.1 通用任务

每个页面 Agent 必须：

1. 提取页面所有可外部核验的原子 Claim。
2. 将 Claim 标记为 `L1 source_backed_fact`、`L2 editorial_synthesis` 或 `L3 research_guidance`。
3. 为每条 L1 指定 source ID、来源类型、locator、支持范围和不支持范围。
4. 为每条 L2 给出问题、对象、阶段、分析单元、机制、材料和 anti-fit 推理链。
5. 为每条 L3 检查条件性、伦理、访问和学科指导边界。
6. 列出缺失 locator、来源冲突、过度归因、重复意图和不可发布项。
7. 输出 `APPROVE_CANDIDATE / NEEDS_REVISION / REJECT_CANDIDATE`，但不得作最终 published 决定。

### 6.2 四个 Topic Agent

#### Agent T1：Teacher professional learning and change

- 核验页面解释对象是“professional learning → practice change”，而不是出席、满意度或泛化 PD。
- Primary：Teacher Professional Development。
- Supporting：Communities of Practice，仅在 sustained shared practice 有证据时成立。
- Not recommended：Teacher Identity，仅当 self-understanding 不是核心解释对象时成立。
- 检查与既有 identity Topic、CoP Topic、Teacher Education Field 的差异。
- 数据必须能显示实践改变，而非仅报告学习体验。

#### Agent T2：Policy implementation and frontline discretion

- 指明 adopted policy/service、frontline actor、service/client interaction、consequential discretion。
- Primary：Street-Level Bureaucracy。
- Supporting：Institutional Theory，仅在 legitimacy、formal structure 或 decoupling 有证据时成立。
- Not recommended：Multiple Streams，仅限定为 agenda-setting/policy-choice 对照。
- 严格区分 pre-adoption 与 post-adoption。

#### Agent T3：Access to educational support and opportunity

- 指明具体 support/opportunity、population、comparator、normative basis。
- Primary：Educational Equity，作为规范性框架而非自动因果机制。
- Supporting：Social Capital，仅在关系、信息、推荐、信任、资源动员可观察时成立。
- Not recommended：Bourdieu Practice Theory，仅在 field/capital/conversion/recognition 缺失时不作为主路径。
- 检查与既有 inequality Topic 和 equity Field 的差异。

#### Agent T4：Communities of Practice in teacher learning

- 核验 mutual engagement、joint enterprise、shared repertoire。
- 正式团队、PLC、课程、平台或成员名单不能自动视为 CoP。
- Primary：Communities of Practice。
- Supporting：Teacher Professional Development，用于不同的专业成长问题。
- Not recommended：Social Capital，当核心机制是 shared practice 而非 resource access 时成立。
- 与 T1 页面保持明确分工。

### 6.3 四个 Scholar Agent

#### Agent S1：Jean Lave

- 核验身份和学科定位。
- 核验 1991 年与 Wenger 的共同作者关系。
- `key_contributor` 只能是有边界的 L2 归因。
- 禁止 sole founder、长期合作、师承或超出合著作品的关系。

#### Agent S2：Etienne Wenger

- 核验身份和 learning-theory 表述边界。
- 1991 合著与 1998 独著必须分开。
- `key_contributor` 不等于 sole founder。
- 当前/历史职位不得由模糊人物页推断。

#### Agent S3：Michael Lipsky

- 核验身份和 political science/public policy 定位。
- 1980 原始出版与 2010 expanded edition 分开记录。
- 出版史不得表现为 Scholar-to-Scholar 关系。
- `key_contributor` 不扩大为所有 street-level scholarship 的 sole founder。

#### Agent S4：John W. Kingdon

- 核验 Professor Emeritus 身份。
- 建立 1984 首版、1995 第二版、2011 记录与 2013 New International Edition 的完整账本。
- 每条记录包含 title、edition、publisher、year、ISBN/OCLC、URL、source ID。
- 核验 `multipleStreams` 当前 source ID 与实际版次是否一致。
- 任何冲突未清零时必须继续 draft。

---

## 7. 波次 B：专业交叉复核 Agent

### 7.1 Source Verifier

核对全部 L1 的作者、标题、年份、版次、DOI、ISBN、OCLC、机构身份和 locator；区分元数据支持与正文主张支持；缺失或错误 locator 标记 `FAIL`。

### 7.2 Topic Methods Reviewer

审核 Topic 的 `primary / supporting / not_recommended`，以及 explanatory object、stage、unit、mechanism、data、anti-fit；审核 4 页与既有 Topic/Field 的唯一性；审核 L3 研究指导保持条件性。

### 7.3 Scholar Attribution & Relation Auditor

审核 `founder / key_contributor / collaborator / development / influence` 等谓词；检查合著关系是否被扩大；检查出版史是否被错误建模成人际关系；禁止没有直接证据的 genealogy 或 Scholar-to-Scholar 边。

### 7.4 Edition Specialist

建立 Kingdon 与 Lipsky 版次矩阵；核对每个 source ID 与 URL 的实际记录；给出保留、重命名、拆分、弃用建议。Kingdon 本轮仍默认 draft。

### 7.5 Adversarial & Cross-page Reviewer

从“为什么不该发布”的角度审查来源外推、隐含因果、理论最佳适配、跨页年份/版次一致性、Lave/Wenger 合著边界、MSF 使用边界和 Topic 重复/薄页风险。

---

## 8. Claim 证据矩阵模板

| 字段 | 要求 |
|---|---|
| `pageSlug` | 页面 slug |
| `claimId` | 稳定原子 Claim ID |
| `fieldPath` | Claim 所在数据字段 |
| `exactClaim` | 页面最终英文原文 |
| `contentNature` | `source_backed_fact / editorial_synthesis / research_guidance` |
| `evidenceLevel` | `L1 / L2 / L3` |
| `claimType` | identity / bibliographic / substantive / relationship / routing / guidance |
| `sourceId` | 已存在或经批准新增的 source ID |
| `sourceTrust` | S1–S5 |
| `claimSourceFit` | direct / corroborating / context / discovery-only |
| `locator` | 页码、章节、网页字段或注册表字段 |
| `supports` | 来源明确支持什么 |
| `doesNotSupport` | 来源不能支持什么 |
| `reviewerRole` | source verifier / methods reviewer / relation auditor |
| `reviewerRef` | 真实 Agent run ID 或人类审核身份 |
| `reviewDecision` | approved / needs_revision / rejected |
| `verifiedAt` | 实际审核完成的 UTC 时间 |
| `blocker` | 阻塞项及可观察完成条件 |
| `finalWording` | 审核后允许进入页面的措辞 |

### 8.1 来源等级

| 等级 | 来源 | 主要用途 | 限制 |
|---|---|---|---|
| S1 | 原著、原论文、所用版次版权页/页码 | 理论原文、作者论点、精确版次 | 必须对应实际版本 |
| S2 | 出版社、大学、期刊、Crossref、ORCID、WorldCat | 作者、年份、DOI、ISBN、职位、版次 | 通常不能单独支持复杂理论解释 |
| S3 | 同行评审综述、学术手册 | 比较、发展、批评 | 不替代原始来源证明作者原意 |
| S4 | OECD、UNESCO、政府/专业机构 | 政策背景、统计和制度语境 | 不自动证明理论归属或最佳适配 |
| S5 | Wikidata、Wikipedia、博客、搜索摘要 | 发现和交叉核对 | 不得作为唯一 L1 支撑 |

---

## 9. 波次 C：发布决策合同

主控 Publication Editor 在任何实现前创建 `docs/roadmaps/2026-07-18-content-update-publication-contract.md`，冻结：

1. 8 个页面各自的最终状态。
2. 每个页面允许公开的 Claim。
3. 需要删除、降级、重写或保留为 draft 的 Claim。
4. 12 条 TopicTheory 的状态和公开可见性。
5. 4 条 TheoryScholar 的状态和公开可见性。
6. 所有新增 source ID 及其版本语义。
7. stored 总量与 public 总量的精确预期。
8. 搜索、图谱、sitemap、static params 和内链的期望。
9. 每个 `HOLD_DRAFT` 的解除条件。

### 9.1 决策规则

- 任一 L1 缺 locator：`HOLD_DRAFT`。
- 任一 L2 未经独立方法/学术审核：`HOLD_DRAFT`。
- 任一关系由推断得出：删除该关系或 `HOLD_DRAFT`。
- 任一版次冲突未解决：相关页面 `HOLD_DRAFT`。
- 页面仍出现 “claim-level review pending”：不能 `published`。
- 页面与既有页面无法通过唯一性测试：合并或 `REJECT_CANDIDATE`。
- 不允许按批次全部放行；逐页裁决。

---

## 10. 波次 D：实现任务

### Task D1：测试 Agent 先写失败测试

**允许修改：**

- `tests/content-validation.test.ts`
- `tests/seed-corpus-regression.test.ts`
- `tests/seed-integration.test.ts`
- `tests/content-ui-contract.test.ts`
- `tests/e2e/content-enrichment.spec.ts`
- 仅在确有必要时新增一个聚焦测试文件。

**禁止修改：** `src/**`、`prisma/**`、内容 batch、manifest。

- [ ] 根据发布合同写出 8 个页面的精确状态断言。
- [ ] 区分 stored 总量与 public 总量。
- [ ] 检查 12 条 TopicTheory 和 4 条 TheoryScholar 的 endpoint 状态。
- [ ] 验证 draft endpoint 不产生公开节点或边。
- [ ] 验证 draft slug 不进入 search、graph、sitemap、static params、详情页和内链。
- [ ] 验证 legacy source metadata 显示 “Sources listed · claim-level review pending”。
- [ ] 如存在真正获批准的 Claim 级 L1，补充其显示 “Source verified” 的正向测试；禁止把全部 L1 一刀切为 pending。
- [ ] 运行聚焦测试并记录 RED，失败原因必须是实现尚未符合合同，而非语法、导入或测试错误。

聚焦命令：

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/content-validation.test.ts tests/seed-corpus-regression.test.ts tests/content-ui-contract.test.ts
```

预期：新增合同断言在实现前失败；已有无关测试不得新增失败。

### Task D2：内容 Integrator 实现最小修改

**唯一允许修改：**

- `src/data/corpus/content-batches/2026-07-18-first-enrichment.ts`
- `src/data/corpus/shared/entities.ts`
- 如发布合同明确要求：`src/lib/knowledge-entity-presentation.ts`
- 相关路线图执行记录。

**禁止修改：** `tests/**`、schema、migration、route、component、部署脚本。

- [ ] 按发布合同调整 8 个页面状态；draft 不设置 `publishedAt`。
- [ ] 只保留证据矩阵批准的 Claim 和措辞。
- [ ] 4 个 Topic 各保留恰好 3 条路由，但只有通过审核的页面才可公开。
- [ ] 关系只使用已批准的谓词和来源 URL。
- [ ] Kingdon 保持 draft。
- [ ] 修正 Kingdon/Lipsky source ID 与版次语义，禁止 URL 与年份错配。
- [ ] 保持现有显式 batch import/spread，不把内容重新内联到巨型共享文件。
- [ ] 保持不可变数据模式，不原地修改现有对象。
- [ ] 运行静态内容检查。

```bash
npm run content:check
npm run typecheck
```

预期：两项均通过；不得通过弱化 validator 或删除合同字段实现通过。

### Task D3：测试 Agent 转绿

- [ ] 合入内容 Integrator 的实现后重跑聚焦测试。
- [ ] 只修正测试自身的错误，不改变发布合同。
- [ ] 不使用 `skip`、`todo`、放宽计数或删除断言。
- [ ] 确认所有测试名称描述实际业务规则，不保留过时数量名称。

预期：聚焦测试全部通过。

---

## 11. 波次 E：主控串行验收

### Gate 0：工作区与合同冻结

- [ ] 记录分支、HEAD、工作区文件清单。
- [ ] 确认没有重置或覆盖用户已有修改。
- [ ] 确认发布合同包含精确实体、关系、来源和计数。
- [ ] 确认验收数据库为隔离本地/CI 数据库。

### Gate 1：静态语料

```bash
npm run content:check
npm run typecheck
npm run lint
```

必须证明无重复 slug、重复关系、悬挂 source ID、占位文本、虚构引用；4 个 Topic 的 role 集合精确为 primary/supporting/not_recommended；无 Psychology/Management 公开内容。

### Gate 2：数据库迁移与第一次 seed

```bash
npm run db:migrate
npm run db:seed
```

第一次 seed 后记录各实体总数、状态分布、关系复合键、source ID，以及 draft endpoint 在数据库存在但在 public query 隔离的证据。

### Gate 3：第二次 seed 幂等性

```bash
npm run db:seed
```

比较两次 seed：实体总数、状态分布、关系复合键、source ID 集合必须完全一致。

### Gate 4：全量自动化

```bash
npm test
npm run lint
npm run typecheck
npm run content:check
```

要求 0 个新增失败；项目当前没有 coverage script，不得伪造覆盖率数值。

### Gate 5：生产构建

只在 migrate 和两次 seed 成功后执行：

```bash
npm run build
node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts
```

验证 published slug 被静态生成、draft slug 不进入 static params、sitemap 只含 published URL、metadata/canonical 来自既有 SEO 层、构建不使用 demo 学术数据。

### Gate 6：E2E 与公开表面

```bash
PLAYWRIGHT_PORT=3101 npm run test:e2e
```

检查 `/topics`、`/scholars`、获批准 published 页面、draft slug 直接访问、搜索、sitemap、三种图谱模式、首页图谱、375px、768px、桌面、横向溢出、console/page error、first-party 4xx/5xx、axe、键盘和 reduced motion。

---

## 12. 精确计数口径

不得在发布合同冻结前沿用当前路线图的固定公开计数。必须区分：

- `stored total`：数据库中包含 draft 的总量；
- `public total`：`status=published` 且所有关系 endpoint 均 published 的总量。

当前本地候选数据的存储增量上限：Topic +4、TopicTheory +12、Scholar +4、TheoryScholar +4；Theory、Work、Concept、Field、Discipline、Genealogy 均 +0。最终 public 增量由逐页发布合同决定；Kingdon public 增量固定为 0。

---

## 13. 回退策略

1. 页面证据不通过：保持 draft，不删除研究材料。
2. 关系证据不通过：移除关系或只保留在未公开研究文档。
3. 来源语义不通过：降级为 sources listed/pending，不显示 Source verified。
4. seed 或构建失败：禁止部署，修复后从 Gate 1 重跑。
5. E2E 发现 draft 泄漏：立即判定不可发布；修复 public-read 过滤后重跑完整门禁。
6. 不使用数据库 reset 回退；通过状态调整和幂等 seed 回退。
7. 不修改既有 8 条 genealogy。

---

## 14. 最终报告格式

Codex 最终回复必须包含：

1. 发布结论：`可发布 / 条件发布 / 不可发布`。
2. 8 页逐页证据、最终状态、Public URL 和阻塞依据。
3. seed 前后 stored/public 精确计数及第二次 seed 一致性。
4. 所有命令、退出码和结果摘要。
5. draft 在详情、索引、搜索、图谱、sitemap、static params 和内链的泄漏矩阵。
6. 每个 P0/P1、影响、根因、状态和完成条件。
7. 执行前已有未提交文件、本任务实际修改文件和未触碰文件。
8. 是否 commit、push、PR、deploy。

任何未解决 P0/P1 存在时，不得建议部署。

---

# 附录 A：可直接交给 Codex 的主控提示词

```text
你是 Syntag 2026-07-18 内容更新的主控 Integrator。项目根目录：
/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag

目标：审计并收口当前未提交的首批内容丰富批次。批次包含 4 个 Topic、12 条 TopicTheory、4 名 Scholar 候选和 4 条 TheoryScholar。不要新增第 5 个 Topic，不扩大 Education/Sociology 之外的公开范围。

第一原则：先证据、后状态、再实现。当前本地 published 标记不是批准证据。4 个 Topic 默认 HOLD_DRAFT；Jean Lave、Etienne Wenger、Michael Lipsky 默认 HOLD_DRAFT，但可在完整 Claim 级门禁通过后逐页批准；John W. Kingdon 必须继续 draft，直到 1984/1995/2011/2013 版次冲突全部解决。

开始前必须：
1. git status --short --branch
2. git diff --name-status
3. 阅读 CLAUDE.md、AGENTS.md、docs/SITE_CONSTRUCTION_PLAYBOOK.md、ADR-027、2026-07-18 路线图、四份研究包、当前 content batch、shared/entities.ts、seed-content.ts、content-validation.ts 和相关测试。
4. 记录现有未提交文件。禁止 reset、restore、clean、stash、checkout 覆盖。

必须使用多个子 Agent，按以下波次执行：

波次 A：并行启动 8 个页面证据 Agent：T1 teacher-professional-learning-and-change、T2 education-policy-implementation-frontline-discretion、T3 access-to-educational-support-and-opportunity、T4 communities-of-practice-in-teacher-learning、S1 jean-lave、S2 etienne-wenger、S3 michael-lipsky、S4 john-w-kingdon。

每个 Agent 只处理一个页面，输出独立 Claim 证据矩阵：claimId、fieldPath、exactClaim、L1/L2/L3、contentNature、sourceId、sourceTrust、locator、supports、doesNotSupport、reviewerRole、decision、verifiedAt、blocker、finalWording。不得修改 src 或 tests。

波次 B：并行启动 5 个交叉复核 Agent：Source Verifier、Topic Methods Reviewer、Scholar Relation Auditor、Edition Specialist、Adversarial Cross-page Reviewer。

波次 C：你作为 Publication Editor，创建并冻结 docs/roadmaps/2026-07-18-content-update-publication-contract.md。合同逐页规定状态、允许 Claim、删除/降级 Claim、关系、source ID、stored/public 精确计数、draft 隔离规则和解除条件。任一 locator、独立审核、版次或关系证据失败，默认 draft。不得按批次全部放行。

波次 D：合同冻结后并行启动两个写入 Agent，文件不得重叠。

1. 测试 Agent：唯一可写 tests/**。先写失败测试，覆盖精确状态、stored/public 计数、draft 不进入 search/graph/sitemap/static params/detail/internal links、来源展示正反路径。不得改 src，不得 skip/todo/弱化断言。

2. 内容 Integrator：唯一可写 src/data/corpus/content-batches/2026-07-18-first-enrichment.ts、src/data/corpus/shared/entities.ts，以及合同明确要求时的 src/lib/knowledge-entity-presentation.ts。不得改 tests、schema、migration、路由、组件或部署脚本。draft 不设置 publishedAt；Kingdon 保持 draft；只保留审核批准的 Claim、关系和来源语义。

波次 E：你独占数据库、构建和 E2E。先确认 DATABASE_URL 是隔离验收数据库。禁止 db:reset。严格执行：
1. npm run content:check
2. npm run typecheck
3. npm run lint
4. npm run db:migrate
5. npm run db:seed
6. 记录实体/状态/关系/source ID
7. npm run db:seed
8. 证明两次 seed 完全幂等
9. npm test
10. npm run lint
11. npm run typecheck
12. npm run content:check
13. npm run build
14. node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts
15. PLAYWRIGHT_PORT=3101 npm run test:e2e

必须验证：所有 public reads 只返回 published；draft 本体和关联边均不进入搜索、三种图谱模式、sitemap、static params、详情页或内链；公开范围仍只有 Education/Sociology；无新增 Theory/Work/Concept/Field/Discipline/Genealogy；无虚构来源、占位文本、错误版次或推断关系；375px、768px、桌面、键盘、axe、console/page error 均通过。

最终输出必须给出：可发布/条件发布/不可发布；8 页逐页状态与依据；stored/public 精确计数；两次 seed 对比；命令退出码；draft 泄漏矩阵；P0/P1；实际修改文件；未执行项与原因；明确建议是否允许 commit/PR/deploy。

不要把“命令已运行”写成“已通过”；只根据实际输出作结论。没有完成全部门禁时，写“暂不可发布”。
```

---

# 附录 B：子 Agent 通用提示词模板

```text
你是 Syntag 内容更新的独立审查 Agent。你只处理分配给你的一个页面或一个审核维度。先读取项目规则、ADR-027、对应研究包和当前 batch。不得修改 src、tests、数据库、构建或 Git 历史。

输出必须包括：读取文件、原子 Claim 矩阵、来源和 locator、来源支持/不支持范围、L1/L2/L3 分类、关系和版次风险、需要重写或删除的具体措辞、APPROVE_CANDIDATE / NEEDS_REVISION / REJECT_CANDIDATE、HOLD_DRAFT 的具体解除条件。

禁止凭记忆补事实；禁止猜页码、DOI、ISBN、职位或年份；禁止将共同作者扩大为长期合作或师承；禁止将 key_contributor 扩大为 founder；禁止将 Topic theory-fit 写成来源证明的最佳理论；禁止将搜索摘要或百科作为唯一来源；禁止使用模糊的“建议进一步审核”，必须列出可观察的完成条件。
```

---

## 15. 计划自检

- 已覆盖 4 Topic、4 Scholar、12 TopicTheory、4 TheoryScholar。
- 已区分 source metadata 与 claim-level verification。
- 已区分 stored 与 public 数量。
- 已规定多 Agent 并行边界和唯一共享文件写入者。
- 已规定 Kingdon 版次硬阻塞。
- 已规定测试先行、数据库双次 seed、构建顺序、E2E 与 draft 泄漏检查。
- 无 TBD、TODO、占位任务或未定义的发布标准。
- 未包含 Psychology、Management、CMS、账户、付费、AI 或无关重构。
