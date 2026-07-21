# Syrtag 网站建设总规划与迭代手册

> 版本：v1.0  
> 状态：执行中  
> 最后更新：2026-07-17
> 用途：本文件是 Syrtag 后续建站、内容建设、验收与发布的唯一工作格式。任何新需求、修复或内容批次均先按本文“迭代规划模板”立项，再进入实现。

## 1. 网站目标与边界

Syrtag 面向英文硕博研究者，帮助用户从研究问题进入理论路径，理解理论的谱系、核心概念、适用边界、研究操作化方式及可信来源。网站的核心不是文章集合，而是“实体内容页 + 可探索知识图谱 + 可追溯关系数据”的组合。

一期应交付的闭环为：

```mermaid
flowchart LR
  A[研究问题或关键词] --> B[搜索或图谱入口]
  B --> C[理论/学者/主题实体]
  C --> D[来源可追溯的深度内容]
  D --> E[相关理论、著作、概念与主题]
  E --> B
```

一期不包括账户系统、付费、用户投稿、自动生成论文、中文全站翻译或尚无真实数据支撑的学科。不得为展示完整度而创建空壳页面、虚构内容或虚假数据。

## 2. 当前基线（必须在每轮开始前复核）

| 维度 | 当前事实 | 结论 |
| --- | --- | --- |
| 前端 | 首页、静态说明页、七类实体索引与详情路由、图谱组件和 SEO 基础均已存在；C7 后本地构建生成 92 个页面。 | 具备进入全站内容质量与发布验收的页面骨架。 |
| 内容 | `src/data/seed-content.ts` 是唯一作者语料源，含 Education 与 Sociology 的 12 个主理论（D3×2、D2×4、D1×6）。C1 已校准结构化呈现；C2、C3、C4 已分别在本地完成 D3、D2、D1 内容深化；C5 已从这些理论的现有核心来源发布 19 条 Works 和 24 条去重的 Concepts；C6 已深化 4 位既有学者并完成其余理论作者审计；C7 已为 4 个主题、2 个学科和 6 个领域发布带来源的理论选择路径。 | D3 覆盖深度研究转换；D2 覆盖研究设计判断；D1 已明确理论/框架/研究传统/编辑总称的性质、初步适用边界、阅读路径和来源。Works、Concepts、Scholar、主题、学科和领域页均已呈现真实来源、关系和内容合同；后续转入 C8 全站质量与发布验收。 |
| 数据库 | Prisma schema、迁移与幂等 seed 已存在；当前本地环境的只读 seed 集成核验通过。生产数据库配置与数据状态本轮未验证。 | 仅可确认本地数据可读，不能据此宣称生产数据已同步。 |
| 图谱与搜索 | 真实数据、不可用状态、图谱与搜索的自动化测试在当前本地测试集内通过。 | C1 不扩大图谱/搜索范围；完整浏览器验收留给 C8。 |
| 图谱渲染 | `GraphCanvas` 使用原生 2D Canvas 与 `requestAnimationFrame` 自绘，依赖中无 React Flow/Sigma.js；N22 已回写该有意决策。 | 批次 3A 仅对齐文档与现实，未改渲染代码。 |
| 图谱交互 | N4a 已增加相邻边加粗、邻居高亮与无关节点 30% 淡化；点击改为轻量详情卡，12 节点布局收紧，移动端以图谱上方折叠控制条暴露三种模式。 | 空图和错误状态复用 `DataUnavailableState`；生产 demo 边界保持不变。 |
| 内容阅读 | N4b 将正文稳定在 720px、行高 1.7，并为实体正文增加桌面 sticky / 移动折叠 TOC；来源改为脚注式，标题区显示深度与核验徽章。 | 代表理论页与通用实体页共用阅读基线，无新增依赖。 |
| UI 与无障碍 | N27 已完成首页搜索、图谱键盘/触控等价路径、单树响应式 TOC、页面来源/核验范围、44px 控件、Next font、禁用广告空状态及 375/768/769/1024/1440 响应式修正。 | PR #6 已发布；Chromium Playwright + axe 20/20 通过，线上代表页无横向溢出、console/page error 或 first-party 4xx/5xx。 |
| 工程门禁 | `typecheck`、`.next` 产物冒烟和 Chromium Playwright + axe 已纳入本地命令；E2E preflight 只验证新鲜生产构建，不隐式运行数据库或 build。 | 本地 `npm test` 114 项中 113 通过、0 失败、1 项既有构建后 skip；93/93 build、产物 smoke 1/1、E2E 20/20 通过。 |
| 部署与回滚 | 部署保留上一 commit 的 `.next` 快照；本地存活检查失败会自动回滚，GitHub Actions 另做 3 次公网探测并在失败时远程回滚。回滚恢复旧 commit、依赖与 `.next` 后重启并健康检查；数据库迁移保持前向执行，因此生产迁移必须向后兼容旧应用快照。 | 批次 3C 仅完成本地源码与测试，未触发生产部署，不表示线上已更新。 |
| 内容录入流 | `npm run content:check` 复用 `validateSeedCorpus()` 并增加批次规则：每个实体需有 slug、英文标题与可追溯来源，D3 需有 genealogy；不可核验或缺 D3 谱系者强制降为 draft 并从公开 static params 排除。 | 批次 3D 建立本地校验流，未扩展 Education/Sociology 之外的公开内容。 |
| 信息架构 | `/theories`、`/scholars`、`/works`、`/concepts`、`/topics`、`/disciplines`、`/fields` 索引与详情路由均进入当前构建。 | Works、Concepts、四个既有 Scholar 页，以及主题、学科和领域页均已具备可浏览的内容路径；C8 验收其全站可达性。 |
| 学科范围 | 内容事实源和公开静态参数仅覆盖 Education 与 Sociology。 | Psychology 与 Management 继续不进入本轮公开内容承诺。 |
| 验证 | C1 建立 12 页呈现回归；C2 增加 D3 深度、三层阅读、逐项证据和全来源可达合同；C3 增加 D2 内容合同；C4 增加 D1 性质、来源和关系证据合同；C5 增加 Works/Concepts 的来源、关系、去重与无占位回归；C6 增加 Scholar 的身份、归因边界、关系和无占位回归；C7 增加主题、学科、领域的三类理论路径、来源和无占位回归。2026-07-17 批次 3A、3B、3C、3D 各自独立重跑 `db:migrate → db:seed → test → lint → build` 并通过；`db:migrate` 均为 already in sync。补充门禁还包括 Prisma schema 与 generated `tsvector`/GIN 索引无差异、typecheck、content check、构建产物冒烟。 | C8 仍须逐页重跑全站自动化和浏览器门禁；3A–3D 不代替 C8 或线上验收。 |
| 公开线上 | 线上已同步 C1–C7 与 N27 UI 修正；代表页 0 处 `being prepared`，首页搜索、图谱等价交互、响应式 TOC、来源语义和 Pricing 状态已发布。 | 2026-07-18 PR #6 合并为 `082debc`，production workflow `29594180907` 成功；首页、搜索、Life Course、Pricing、robots 与 sitemap 均返回 200，图谱模式、节点详情和 Escape 回焦公网复验通过。 |

旧提示词引用的 `Syrtag-产品设计文档.md` 当前不在仓库内。后续若拿到该文档，应放入 `docs/product/` 并在本文件“决策记录”中登记版本；在此之前，以当前 schema、内容规范和本手册为准。N21 的商业化阶段表修订待该产品设计文档入库后同步，目标语义为 Phase 1 = `AdSense（探针）`，而非 `AdSense（收入）`。

## 3. 总体路线图

必须按依赖顺序推进。每一阶段的验收通过后，才可进入下一阶段；不得用 UI mock 覆盖数据或内容缺口。

| 阶段 | 目标 | 主要交付物 | 完成门槛 |
| --- | --- | --- | --- |
| P0：基线 | 固定事实、范围和风险。 | 基线记录、任务边界。 | 测试/构建/环境状态如实记录。 |
| P1：内容语料 | 形成可验证的首批英文内容。 | `seed-content.ts`、内容验证测试、来源记录。 | 内容测试全绿；L1 来源可追溯。 |
| P2：数据库 | 把语料可靠写入 PostgreSQL。 | 迁移、幂等 seed、数据核验。 | 两次 seed 成功且数量/关系不重复。 |
| P3：运行时 | 数据失败、空状态、404 与 API 语义清晰。 | API/错误处理测试。 | 无数据库时不误导；有数据库时查询正确。 |
| P4：信息架构 | 形成实体发现与回退闭环。 | 六类实体索引、正确导航、404。 | 公开链接无死链。 |
| P5：图谱与搜索 | 真实数据可探索、可跳转。 | 三种图谱模式、节点详情、搜索。 | 所有公开学科和模式可验收。 |
| P6：SEO 与运维 | 搜录、法律、文档与实际运行一致。 | sitemap、JSON-LD、README、法律页。 | 只收录真实可访问内容。 |
| P7：发布验收 | 用证据判定是否可发布。 | 验收报告、浏览器矩阵、发布结论。 | 自动化、数据、浏览器门槛全满足。 |

对应的可执行提示词保存在 [`prompts/completion/`](../prompts/completion/README.md)。它们是每个阶段的操作说明；本文件负责长期方向、标准与规划格式。

## 4. 四条长期建设主线

### 4.1 内容与学术可信度

- 首批范围：12 个主理论，按 D3/D2/D1 深度组织；支持节点可简洁，但必须有非空说明与来源元数据。
- 每篇理论至少交代：理论定位、起源、核心概念、谱系、适用/不适用情形、误用风险；D2/D3 还须提供分析维度、数据收集、章节建议、理论适切性写法、阅读路径和来源。
- 核验等级：L1 为可由 DOI、出版社、大学或原始资料验证的稳定事实；L2 为编辑解释与比较；L3 为研究建议与待导师确认的内容。
- 禁止虚构 DOI、出版信息、机构链接、人物履历、数据、研究结论或来源 URL。无法核验时降低等级或删除精确断言。

### 4.2 数据与技术可靠性

- 以 `src/data/seed-content.ts` 为内容事实源，`prisma/seed.ts` 仅作持久化适配层。
- 所有实体和关系以稳定 slug/复合键 upsert；连续执行两次 seed 不得产生重复记录。
- 数据库不可用必须返回清晰 503；不存在实体返回 404；无搜索结果与服务不可用必须有不同的用户提示。
- 生产环境不得静默把样例图当真实数据。开发演示若保留样例，必须明显标为 demo，且不可进入 sitemap 或统计。

### 4.3 体验与信息架构

- 所有公开实体均应有“索引页 → 详情页 → 相关实体”的可达路径。
- Header、Footer、面包屑、搜索结果、图谱详情和站内卡片必须共享同一 canonical URL 规则。
- 图谱仅展示已发布且有数据的学科；未建设学科隐藏或明确禁用，不可点击后报错。
- Framework Builder 在功能实现前不应作为普通主导航入口；可保留为明确的 Planned 状态。
- 错误页、空状态、加载态均要说明发生了什么、下一步怎么做，并提供真实可点击的回退路径。

### 4.4 搜录、运营与交接

- sitemap 只列已发布、可访问的静态页和实体页；robots 禁止 API，但不能误封内容路径。
- 元数据、canonical、Open Graph、JSON-LD、发布日期和核验标记必须来自真实内容数据。
- README、`.env.example`、部署说明和法律页需与实际功能一致；不写不存在的分析、广告、账户或合规承诺。
- 不在仓库、日志、截图或验收报告中暴露 `DATABASE_URL`、令牌或其他密钥。

## 5. 统一的迭代规划模板

从现在起，每个新建设窗口必须在 `docs/roadmaps/YYYY-MM-DD-<short-topic>.md` 新建一份计划，并严格使用下列结构。一个计划只解决一个可验收目标；跨越多个主线时拆分为多个计划。

```markdown
# [主题]：实施计划

> 日期：YYYY-MM-DD  
> 状态：计划中 | 实施中 | 阻塞 | 已完成  
> 阶段：P0–P7  
> 负责人：<名称/Agent>  
> 关联：<issue、提示词、上游计划>

## 1. 目标与用户价值
- 用一句话说明要为谁解决什么问题。
- 写出本轮完成后用户能观察到的变化。

## 2. 范围
### 包含
- <明确功能、内容或数据项>
### 不包含
- <明确排除项，防止范围漂移>

## 3. 当前证据与决策
- 现象/复现路径：
- 根因或待确认假设：
- 需要用户确认的决策：
- 不能假设的事实或外部依赖：

## 4. 实施步骤
1. <动作> — 文件：`<path>` — 产物：<可检查结果>
2. <动作> — 文件：`<path>` — 产物：<可检查结果>

## 5. 数据、内容与安全
- 数据来源与核验等级：
- 数据迁移/seed 影响：无 | 有（说明）
- 环境变量/权限需求：
- 隐私、版权或法律影响：

## 6. 验收标准
- 自动化：`<命令>`，预期：<结果>
- 浏览器：<页面、交互、桌面/375px 检查>
- 数据：<数量、关系、来源或状态断言>
- 链接/SEO：<需验证路径>

## 7. 风险、回退与发布判定
- P0/P1/P2 风险：
- 回退方式：
- 发布结论条件：

## 8. 执行记录（实施后填写）
- 实际改动：
- 验证结果：
- 未完成项与原因：
- 下一步：
```

## 6. 任务拆分与优先级规则

| 优先级 | 定义 | 示例 | 处理方式 |
| --- | --- | --- | --- |
| P0 | 阻断真实用户使用、数据可信度或发布。 | 无数据库导致内容页崩溃；内容语料缺失；死链。 | 立即修复，未关闭不得发布。 |
| P1 | 核心路径明显不完整或会误导用户。 | 搜索把 503 显示为无结果；未有数据的学科可点击。 | P0 后修复，进入发布验收前必须关闭。 |
| P2 | 不阻断核心使用，但影响可发现性、维护或体验。 | 说明页完善、样式微调、辅助筛选。 | 记录后排期，不夹带进 P0/P1 修复。 |

任务切片应遵循“垂直闭环”：例如“教育学理论索引页”必须同时包含真实查询、空/错误状态、链接、测试和浏览器验证；不要只完成一个静态 UI 再等待以后接数据。

## 7. 阶段门禁与统一验收

### 每个实施窗口的最低门禁

1. 改动前：阅读相关计划、实现、测试和当前 `git status`；确认不覆盖无关未提交内容。
2. 改动中：只修改范围内文件；数据库、外部来源和部署均不凭空假定。
3. 改动后：至少运行受影响测试；涉及 TypeScript/路由时再运行 `npm run lint` 与 `npm run build`。
4. 交接时：记录改动文件、命令退出码、浏览器结果、阻塞项和下一步；不以“应该可以”代替证据。

### 发布门禁（全部满足才可称“完整”）

- `npm test`、`npm run lint`、`npm run build` 全部成功；
- 已配置的非生产数据库完成迁移，并连续两次 `npm run db:seed` 成功；
- 真实数据库中的主理论、实体关系和 L1 来源数量符合内容计划；
- 首页、公开学科 × 三种图谱模式、搜索、索引页、详情页、错误页及移动端均完成浏览器验收；
- 公开导航无死链，sitemap 仅含真实可访问页面；
- README、环境变量、法律说明和发布方式相互一致；
- 任何未解决 P0/P1 均为零。

若缺少数据库凭证、真实内容语料或任一关键验收证据，发布结论必须写“暂不可发布”，并指出具体阻塞项，不得以 build 成功替代发布验收。

## 8. 指标与持续维护

每次发布或内容批次更新以下指标（只记录可核验数值）：

| 指标 | 定义 | 目标方向 |
| --- | --- | --- |
| 已发布实体数 | 各实体 `status=published` 的数量。 | 与内容计划一致，非盲目增长。 |
| 内容完整率 | 满足对应 D1/D2/D3 必需区块的理论占比。 | 100%。 |
| L1 可追溯率 | L1 记录中带真实权威来源的占比。 | 100%。 |
| 图谱可用率 | 公开学科 × 公开模式中成功加载的组合占比。 | 100%。 |
| 公开链接健康率 | 自动检查中返回成功或预期 404 的站内链接占比。 | 100%，不含死链。 |
| 测试/构建状态 | test、lint、build 最近一次结果。 | 全绿。 |

新增学科、实体类型、语言或商业功能时，必须先建立独立计划，补充数据来源、内容合同、索引路径、图谱投影、SEO 策略与验收矩阵；不能只在 UI 增加一个选项。

## 9. 近期执行顺序

下一步从 [`prompts/completion/01-baseline-and-scope.md`](../prompts/completion/01-baseline-and-scope.md) 开始，并依次执行至 Prompt 08。每完成一步，更新对应的 `docs/roadmaps/` 计划和本文件第 2 节的当前基线；当路线图、实际代码和验收结果不一致时，先更新计划和决策记录，再继续实现。

## 10. 决策记录

| ID | 批次 / 决策 | 基线 / 结论 | 验收记录 / 理由 | 日期 |
| --- | --- | --- | --- | --- |
| C8a | 线上同步批次（P0） | 本地 C1–C7 与 release-positioning-hardening 已经完整门禁验证并通过 PR #2 合入 `main`。原 2026-07-13 每页 18 处 `being prepared` 仅作为历史审计基线；本批部署前代表页已经为 0，本次验收证明合并部署后未回退。 | 本地 `db:migrate → db:seed → typecheck → test → lint → content:check → build` 全绿：74 项测试中 73 通过、0 失败、1 项转由构建后执行并 1/1 通过，构建 93/93 页。production workflow `29573060575` 成功完成 migrate、seed、build、restart 与 3 次公网探测；部署后首页及 Life Course、Teacher Identity、Structuration 理论页均为 200 且 0 处占位，`/pricing`、`/editorial-policy` 为 200，sitemap 同时包含二者。 | 2026-07-17 |
| N21 | Phase 1 商业化目标重设 | Phase 1 不以 AdSense 收入为 KPI；AdSense 仅作为“流量是否到达”的探针与补充收入。Phase 1 KPI 改为：可验证的 Search Console 展示量/点击量、被外部学术页面引用次数、核验体系对外可见度。产品设计文档当前未入库，商业化阶段表待同步为 `AdSense（探针）`。 | 学术垂直内容 RPM 低，12 个着陆页不足以支撑有意义的广告收入；本阶段本质是内容资产与权威信号积累期。 | 2026-07-17 |
| N22 | 图谱渲染引擎 | 采用自绘 Canvas（`GraphCanvas`），不引入 React Flow/Sigma.js（修正 N5 中的候选库表述）。 | 当前实现使用原生 2D Canvas 和 `requestAnimationFrame` 绘制节点、边与动画，并直接处理缩放、拖拽、指针与键盘交互；依赖中无 React Flow/Sigma.js。该方案轻量，交互与可达性可控，无重型图库运行时。 | 2026-07-17 |
| N24 | N4a 图谱交互反馈 | 保留原生 Canvas 与既有设计令牌；小规模图谱收紧半径，hover 只改变透明度和线宽，click 打开轻量详情卡而不直接跳转。移动端三模式置于图谱上方原生折叠控制条。 | `typecheck` 与 `lint` 通过；完整批次门禁见本次提交验收记录。空图/错误路径使用统一不可用状态，未引入 demo 或新依赖。 | 2026-07-17 |
| N25 | N4b 内容页阅读体验 | 正文保持 720px / 1.7 行高；TOC 由页面现有 h2 自动生成，桌面 sticky 并跟踪当前节，移动端使用原生 details。SourceBlock 改为脚注式，标题区直接展示核验徽章。 | 完整门禁全绿：74 项测试中 73 通过、1 项按设计跳过；构建 93/93，构建后冒烟 1/1。 | 2026-07-17 |
| N23 | Graphify 端点 ID 健康修复 | Graphify 生成图中 99 条 dangling-endpoint 边已降为 0；8 个旧绝对路径端点按 extraction spec 改为 `syntag_...` 仓库相对路径 ID，丢失的外部 import 端点根据源文件显式 import 补齐。未新增业务关系，未改网站运行逻辑。 | 已保留 `graphify-out/graph.before-id-repair.json` 和 `graphify-out/dangling-endpoint-edges.json`。已知项：2 组 API route 同时 import/间接调用，另 2 组 `internal-links.ts` 同时 import/re-export，这 4 组多关系在 DiGraph 中会折叠；它们是 Graphify 同端点多边限制，不是端点断裂。 | 2026-07-17 |
| N26 | P0 内容运营主计划执行基线 | `PLAN_BASE_COMMIT=b25c20f3fe2783e7b980d1d601adebcbfc8ebd89`；分支 `feature/release-positioning-hardening`，相对 upstream ahead/behind 为 `0/0`，相对 `origin/main` 为 `3/2`。旧执行入口 `docs/roadmaps/2026-07-17-next-round-codex-prompt.md` 与 `docs/roadmaps/2026-07-17-overhaul-and-operations-codex-prompt.md` 已废止；当前入口为五角度运营路线图与批准的主实施计划。 | 本地 loopback PostgreSQL 依次通过 migrate、seed、typecheck、73/74 tests（1 项既有构建后条件性 skip）、lint、content check、93/93 build 与构建产物 smoke。桌面及 375px 实查 `/`、Life Course、Structuration：图谱模式切换与节点入口可用，移动控制条、TOC、阅读宽度、来源区和广告位存在，三页无横向滚动。线上同步、Graphify、2A–2C、3A–3D 已完成；4A/4B 以本次实时验收为准；4C–4E 与扩学科须重新立项。本轮未 push、merge 或 deploy。 | 2026-07-17 |
| N27 | UI 设计修正与浏览器验收 | 按 [`docs/roadmaps/2026-07-17-ui-design-remediation.md`](roadmaps/2026-07-17-ui-design-remediation.md) 完成首页搜索、图谱等价交互、响应式 TOC、来源/核验范围、静态页、空广告和分域 CSS；保持原生 Canvas、published-only 与 Education/Sociology 范围。 | 本地 loopback PostgreSQL migrate 与双次幂等 seed 通过；typecheck、lint、content check 全绿；Node 114 项中 113 通过、0 失败、1 项既有 skip；build 93/93、产物 smoke 1/1、Chromium Playwright + axe 20/20。PR #6 合并为 `082debc`，production workflow `29594180907` 成功；线上代表页无横向溢出或浏览器错误，图谱模式、节点详情与 Escape 回焦通过。 | 2026-07-18 |
| N28 | 科研 skill + Zotero 联动立项（R0） | 创建 `~/.claude/skills/syrtag-research/SKILL.md` 与项目级 `docs/research/skill-sop.md`，固化五源检索→核验→source register + claim matrix + ContentSource 片段流程；产物保持 draft，不落库、不改 schema。Life Course 试跑用 Crossref 本地代理核验 Elder 1998 真实 DOI `10.1111/j.1467-8624.1998.tb06128.x`，并拦下二手清单误植（`tb06138` 实为 Davies & Cummings 1998）。发现 OpenAlex 免费层每日预算坑与 WebFetch 共享 IP 429，已回写 skill。配套建 `docs/research/user-research/phd-question-log.md` 支持用户侧潜水采集。 | `content:check` 全绿（2 disciplines + 12 theories），基线不受影响；不扩 published 范围、不改 schema、不部署。R1–R3 与 Zotero 接入待续。 | 2026-07-20 |
| N29 | Zotero 联动落地（R1） | Zotero 7 + Better BibTeX 已装；本地 API 23119 已开（Settings → Advanced → Allow other applications）。`theories/life-course-theory` collection 建好，Elder 1998 经 DOI 抓入（Zotero key `GEVCBX8J`，BBT citekey `elderLifeCourseDevelopmental1998`，元数据全对）。`scripts/zotero-export.ts` 跑通：用 Zotero 原生 `?format=bibtex/json` 端点产出 ContentSource 片段 + source register 行 + citekey 映射。SOP §4 更新 citekey 映射规则：BBT 默认 camelCase 不动，`ContentSource.id` 用 kebab slug，两者通过 source register `bbt citekey` 列显式映射。 | `content:check` 全绿；Zotero API 可读（不支持脚本写，写条目仍靠 GUI）。R2 待挂 PDF 做 Zotero 注解升级 claim locator 从 `none` 到页码；R3 待人审落库。 | 2026-07-20 |
| N30 | Life Course 扩源核验（R2 部分） | 用 Crossref 本地代理核验 Elder 代表作：1996 编著章节（DOI `10.1017/cbo9780511571114.004`，Cambridge UP，pp. 31–62）与 2000 百科条目（DOI `10.1037/10520-020`，Oxford UP，pp. 50–52）两条 L1 通过；1974 *Children of the Great Depression* 原版无 Crossref DOI，Crossref 命中的 2018 Routledge 重印 book-chapter 经比对（出版年/出版社/载体三字段不符）判定不可冒充原版，降为 L3 pending。Google Books API 本轮仍 429。 | `content:check` 全绿；evidence pack §2 +3 行、§3 +3 claim、§4.1 拦截记录；`docs/research/2026-07-20-life-course-r2-sources.md` 含两条可落库 ContentSource 片段 draft。R2 locator 升级（PDF 注解）与 R3 落库待续。 | 2026-07-20 |
