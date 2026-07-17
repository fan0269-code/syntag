# Syrtag 整改与运营规划 — Codex 实施提示词

> 版本：v1.0
> 日期：2026-07-17
> 用途：本文是交给 Codex 的分四个维度的实施提示词集合。每个维度先给"修改意见"(背景与理由),再给"详细实施步骤提示词"(可直接喂给 Codex 执行)。Codex 按本文顺序、逐维度、分批次实施;每个批次结束前必须通过本文末尾"全局验收标准"。

---

## 全局上下文(给 Codex 的前置说明)

你正在 Syrtag 仓库(`syntag/` 目录内,Next.js 16 App Router + PostgreSQL/Prisma 7 + React Query + Tailwind 4)工作。必读且视为权威的文件:

- `syntag/CLAUDE.md` 与 `syntag/AGENTS.md` — 工程约定、命令、不变量。
- `syntag/docs/SITE_CONSTRUCTION_PLAYBOOK.md` — 立项/实现/验收工作格式;每轮先读"当前基线"。
- `Syntag-产品设计文档.md`(仓库上层,未入 git) — 产品定位、数据模型、视觉系统、决策记录(N1–N20)。
- 根目录 `CLAUDE.md` — 项目导航层。

四条铁律,任何维度都不得违反:

1. **`src/data/seed-content.ts` 是学术内容的唯一真相源。** 不在页面/组件里硬编码理论/学者/著作文本。所有内容走:typed contract → `validateSeedCorpus()` → Prisma 幂等 seed → published 读。
2. **公开读不变量:** 所有公开面(图谱、搜索、详情路由、sitemap、内链、`generateStaticParams`)只暴露 `status:"published"` 实体。新增公开路径必须同改动加 static params + sitemap + SEO 元数据。
3. **不虚构内容:** 数据库不可用走"可恢复的 unavailable 状态";学术主张须可追溯一手来源(OpenAlex/Crossref/ORCID/Google Books/WorldCat/一手著作),Wikidata/通用百科仅作发现与交叉校验。
4. **构建顺序:** 永远 `db:migrate → db:seed → build`,构建前必先 seed(静态路由在构建期枚举 published slug)。

未明确授权时,不要新增 Prettier/Husky 之外的额外脚手架;不要重构未损坏的代码;不要"改进"相邻代码。匹配现有风格(2 空格缩进、分号、双引号、PascalCase 组件、kebab-case 路由与数据文件)。

---

## 维度 1：内容方面

### 1.1 修改意见

当前内容体系有三类问题:

- **P0 线上落后**:本地已完成 C1–C7,线上仍是 C1 前版本,且代表理论页各含 18 处 `being prepared` 占位。这是最严重的不诚实状态——本地宣称的深度在线上根本不存在。
- **图谱关系有断边**:graphify 健康检查发现约 90 条 dangling-endpoint 边,集中在 `seed-content.ts` 与模板文件之间。根因是语义层 concept 节点用了"仓库全路径"ID,而 AST 层用"仓库相对路径"ID,导致同一实体在图里分裂成两个互不连接的节点。这不影响网站运行,但削弱"可追溯关系数据"这一核心卖点的可信度。
- **扩学科无机械化路径**:目前扩内容全靠手改 `seed-content.ts` + 重新部署,不是 CMS。一期 12 理论/2 学科(Education + Sociology)对"面向全球硕博"明显偏窄,但 N6 和 playbook 的保守立场(不空壳、不虚构)是对的。真正缺的是"从 2 学科到 N 学科"的半结构化录入流,降低每个新学科的边际成本。

### 1.2 详细实施步骤提示词

```text
你是 Syrtag 的 Codex 执行者。按以下三个批次实施"内容整改与扩学科规划",每批次独立提交、独立验收。

### 批次 1A：解除线上落后(P0)
目标:让线上与本地 C1–C7 一致,消除 18 处 being prepared 占位。
步骤:
1. 在 SITE_CONSTRUCTION_PLAYBOOK.md 的"决策记录"里立项一条 C8a 线上同步批次,记录当前基线:本地 C1–C7 完成、线上 C1 前、代表页 18 处 being prepared。
2. 跑完整 C8 验收门禁:npm run db:migrate && npm run db:seed && npm test && npm run lint && npm run build。记录 62 项测试、lint、92 页构建结果。
3. 对 4 个代表理论页做差异检查,确认 18 处 being prepared 在本地源码里已被真实内容替换。
4. 把 feature/release-positioning-hardening 的变更合并到 main(走 PR,正文说明迁移/seed/环境要求与未解决风险)。
5. 触发 GitHub Actions 部署(.github/workflows/deploy-production.yml),部署后 curl https://syrtag.com 与 3 个代表理论页,确认 200 且无 being prepared。
验收:线上代表页 0 处 being prepared;C8 验收记录写入 playbook;在 chat 里如实报告线上状态。
注意:在完成本批次前,不得对外宣称线上已更新。

### 批次 1B：修复图谱断边(节点 ID 规范统一)
目标:消除约 90 条 dangling-endpoint 边,使 seed-content.ts 与模板文件之间的关系在图中真实连通。
步骤:
1. 审计 src/lib/entities/*、src/data/templates/*、src/data/seed-content.ts 的节点 ID 生成方式,确认 AST 层用的是"仓库相对路径 + 下划线连接"格式(见 graphify extraction-spec 的 Node ID format 段)。
2. 找出语义层 concept 节点中用了"仓库全路径"或仅"文件名"的 ID,统一改为与 AST 一致的相对路径格式。
3. 不要改动网站运行逻辑,只统一 ID 命名;如需在 seed-content.ts 内补录已存在但未连的关系,必须可追溯来源并在 Verification 记录里登记 verifiedAt。
4. 重跑 graphify 健康检查(见根 CLAUDE.md 的 graphify 流程),确认 dangling-endpoint 边降至 < 10。
验收:graphify 健康检查无 GRAPH HEALTH WARNING,或仅剩 < 10 条且每条已在 playbook 登记为已知项。

### 批次 1C：扩学科规划大纲(本轮只产出规划文档,不扩内容)
目标:建立可机械化的内容批次录入 SOP,并给出到第 4 学科为止的内容规划大纲。
步骤:
1. 在 docs/roadmaps/ 新建 2026-07-17-content-expansion-roadmap.md,定义"半结构化内容批次录入流":
   - 每批次以一个学科为单元,前置:该学科 D3(深度研究转换)/D2(研究设计判断)/D1(性质/边界/阅读路径)三层各覆盖哪些理论。
   - 录入模板复用 src/data/templates/* 的 typed contract,新增内容必须通过 validateSeedCorpus()。
   - 每条实体附 source URL + source type,核验日期写入 Verification.verifiedAt;无法核实的标记 Verification pending,不得 published。
   - 扩学科前先补 genealogy 边密度:D3 理论优先补齐与已有学科的交叉关系。
2. 给出扩学科优先级排序与理由,优先选与现有图有交叉关系的学科:
   - 第 3 学科:Psychology(与 Sociology 在身份理论/生命历程理论上有天然交叉,且 playbook 已预留其名)。
   - 第 4 学科:Management/organizational behavior(与 Institutional Theory、Multiple Streams Framework 已有节点交叉)。
   - 暂不纳入:需要独立核验体系且与现有图无交叉的学科。
3. 为第 3 学科(Psychology)给出首批内容清单草案:D3 × 2、D2 × 4、D1 × 6 的理论候选(可基于 docs/research/ 现有研究包扩展),每条标注拟核验来源类型。
4. 明确"扩学科触发标准":不是按时间,而是按现有学科的 genealogy 边密度达标 + 有可核实来源 + 该学科与现有图交叉关系数 ≥ 阈值(给出该阈值)。
验收:产出 1 份 roadmap 文档,含录入 SOP、扩学科优先级、Psychology 首批清单草案、触发标准。本批次不改动 seed-content.ts 内容数据。
```

---

## 维度 2：商业模式方面

### 2.1 修改意见

当前商业模式(决策记录 N13)是"Phase 1 AdSense → Phase 3 订阅付费"。我的核心判断:**AdSense 在学术垂直站是补充收入,不是主业,不应作 KPI**;真正有付费意愿的是 Phase 2 框架匹配工具与 Phase 3 个人研究图谱+AI 框架生成——那是把"图谱资产"变现为"研究生产力工具",溢价远高于广告。

因此建议把 Phase 1 商业化目标从"AdSense 收入"重设为"流量验证 + 权威信号积累",并在工程上**现在就为订阅落地预留脚手架**(数据模型、入口页、gating 边界),而不是等到 Phase 3 才写。这样 Phase 2 工具上线时只需把免费层接到付费层,不用重构。

### 2.2 详细实施步骤提示词

```text
你是 Syrtag 的 Codex 执行者。按以下三个批次实施"商业模式重设与订阅脚手架"。本轮只做规划文档 + 数据模型预留 + 入口页,不接入真实支付、不破坏现有公开内容免费访问。

### 批次 2A：重设 Phase 1 商业化目标并回写决策记录
目标:把"AdSense 收入"从 Phase 1 KPI 改为"流量验证 + 权威信号积累"。
步骤:
1. 在 SITE_CONSTRUCTION_PLAYBOOK.md 决策记录新增 N21:
   - 决策:Phase 1 商业化目标重设。
   - 结论:Phase 1 不以 AdSense 收入为 KPI;AdSense 作为"流量是否到达"的探针与补充收入。Phase 1 KPI 改为:可验证的 Search Console 展示量/点击量、被外部学术页面引用次数、核验体系对外可见度。
   - 理由:学术垂直内容 RPM 低、12 着陆页支撑不了有意义的广告收入;本阶段本质是内容资产积累期。
2. 同步在产品设计文档(若你能在 docs/product/ 找到副本则改副本并在 playbook 登记;若没有副本,只在 playbook 登记 N21 并标注"待产品设计文档同步")的商业化阶段表里,把 Phase 1 商业化列改为"AdSense(探针)"而非"AdSense(收入)"。
验收:N21 写入 playbook 决策记录;商业化阶段表 Phase 1 栏语义已修正。

### 批次 2B：订阅数据模型预留(不接入支付)
目标:在 Prisma schema 预留订阅/账号/个人图谱的骨架,使 Phase 2/3 接付费时无需重构。
步骤:
1. 在 prisma/schema.prisma 新增模型(全部带 status/createdAt/updatedAt,沿用现有命名风格 titleEn/titleZh 等):
   - User: id, email @unique, name?, role(draft|member|subscriber|admin), createdAt, updatedAt。注释说明 Phase 3 才启用认证,本阶段仅预留。
   - Subscription: id, userId, plan(free|pro|scholar), status(active|canceled|past_due), currentPeriodEnd, createdAt, updatedAt。注释:支付集成在 Phase 3。
   - PersonalResearchProject: id, userId, title, description?, createdAt, updatedAt。注释:Phase 3 个人研究图谱载体。
   - PersonalProjectTheory: id, projectId, theoryId, note?。关联 Theory;用于用户把理论加入自己的研究项目。
2. 生成迁移:npx prisma migrate dev --name add_subscription_skeleton(本地)。
3. 不写任何认证/支付路由;不创建 User 记录。仅在 schema 与迁移里预留。
4. 在 prisma/schema.prisma 顶部注释标注:"Subscription skeleton — reserved for Phase 2/3, not wired to auth or payments in Phase 1."
验收:npm run db:migrate 通过;npm run build 通过;现有公开内容访问行为无任何变化(回归测试 npm test 全绿)。

### 批次 2C：付费墙边界文档 + 入口页(无真实 gating)
目标:明确"哪些免费、哪些付费"的边界,并放一个可被未来 gating 复用的静态入口页。
步骤:
1. 在 docs/roadmaps/ 新建 2026-07-17-monetization-and-paywall.md,定义三层:
   - 免费层(公开图谱、搜索、所有实体详情页、sitemap 全部):永不对读者收费,这是 SEO 与权威信号的基础。
   - Pro 层(Phase 2 框架匹配工具的交互式匹配结果导出、保存匹配方案到个人项目):按月订阅。
   - Scholar 层(Phase 3 AI 框架生成、个人研究图谱跨项目对比、API 配额):按月/年订阅,含学术定价。
   并定义"gating 边界":gating 只作用于工具输出与个人化功能,绝不 gating 公开内容页本身(否则破坏 SEO 与信任)。
2. 新建 src/app/pricing/page.tsx(静态页,复用现有 StaticPage/PageFrame 组件,不接支付):
   - 三档对比表(free/pro/scholar),标注 Phase 2/3 各功能何时上线。
   - 明确"公开内容永久免费;付费的是工具与个人化能力"。
   - 加 canonical、Open Graph、JSON-LD(若 schema.org 有合适类型)。
3. 在 Header/Footer 加入 Pricing 链接;在 sitemap.ts 与 src/lib/internal-links.ts 登记 /pricing。
4. pricing 页底部放一句"Phase 2/3 功能上线后将在此开通",不做任何付费按钮。
验收:/pricing 可访问、进入 sitemap、移动端 375px 无横向滚动、构建通过、不引入支付依赖。
```

---

## 维度 3：建站框架方面

### 3.1 修改意见

整体架构**正确**,四条铁律、构建顺序、公开读不变量都立得对。但有 4 处实质缺口需补,且不要破坏现有架构:

- **图谱渲染决策与文档不一致**:决策记录 N5 记的是 React Flow/Sigma.js,实际实现是自绘 Canvas(GraphCanvas)。这未必是坏事(自绘可控性强、体积小),但文档未更新,会让后续协作者误判。需确认这是有意修正并回写 N5。
- **缺质量门禁自动化**:无 typecheck、无浏览器 E2E。C8 全站验收目前全靠人工跑命令,随内容批次增多会越来越重且易漏。
- **部署可观测性不足**:`ops/deploy-production.sh` 只有一次 curl 健康检查,无长期存活探针、无回滚、无告警。Phase 1.5/2 接真实流量前必须有,否则一次坏部署打掉线上且无法快速恢复。
- **无内容 CMS/半结构化录入流**:见维度 1 批次 1C,此处从工程角度补"本地内容录入校验脚本"。

### 3.2 详细实施步骤提示词

```text
你是 Syrtag 的 Codex 执行者。按以下四个批次实施"建站框架修补",每个批次保持现有架构不变,只补缺口。

### 批次 3A：回写图谱渲染决策(消除文档不一致)
目标:确认图谱自绘 Canvas 是有意决策,并回写决策记录。
步骤:
1. 读 src/components/graph/GraphCanvas.tsx 与 KnowledgeGraphExperience.tsx,确认当前渲染方式(确认是否纯 Canvas/WebGL 自绘,是否已无 React Flow/Sigma.js 依赖)。
2. 在 SITE_CONSTRUCTION_PLAYBOOK.md 决策记录新增 N22:
   - 决策:图谱渲染引擎。
   - 结论:采用自绘 Canvas(GraphCanvas),不引入 React Flow/Sigma.js(N5 修正)。
   - 理由:基于现状确认(写出你确认到的实际实现:如"轻量、可控交互、无重型图库依赖");若你发现仍有未清理的图库依赖,则在结论里标注需另起批次清理。
3. 不改任何渲染代码;本批次只对齐文档与现实。
验收:N22 写入决策记录;文档与代码实际渲染方式一致。

### 批次 3B：补 typecheck 与浏览器 E2E 门禁
目标:让 C8 验收可自动化,减少人工漏检。
步骤:
1. 在 package.json 新增脚本:"typecheck": "tsc --noEmit"(利用现有 tsconfig.json,noEmit 已为 true)。不引入新依赖。
2. 在 tests/ 新增一条使用 node:test 的轻量 E2E 冒烟(若环境无浏览器自动化能力,则改为对 build 产物 dist 的静态断言):
   - 优先:若有现成 playwright,新增 tests/e2e-smoke.test.ts 访问本地 build server(或 next start)验证首页、一个理论详情页、/search、/pricing 返回 200 且关键元素存在。
   - 回退:若无浏览器依赖,新增 tests/build-output-smoke.test.ts 断言 .next 构建产物存在且 sitemap/robots 文件内含预期路由数。
   - 不要为此引入重型依赖;优先复用 node:test + 已有依赖。
3. 更新 CLAUDE.md/AGENTS.md 的命令段,补充 typecheck 与新冒烟测试的运行方式。
验收:npm run typecheck 通过;新增冒烟测试通过;npm run build 通过。

### 批次 3C：部署可观测性与回滚
目标:让生产部署有长期存活探针、有快速回滚、有失败可见性。
步骤:
1. 在 ops/deploy-production.sh 增量补:
   - 部署成功后,把上一个 commit 的 .next 产物在备份目录保留为 rollback 快照(复用现有 BACKUP_DIR)。
   - 新增 ops/rollback-production.sh:停服务 → 恢复最近 rollback 快照 → 重启 → 健康检查。带 flock 防并发。
   - 部署后健康检查若失败,自动触发 rollback 并在输出里明示失败原因(不静默)。
2. 在 .github/workflows/deploy-production.yml 末尾加一步:部署后对 https://syrtag.com 做 3 次间隔健康探测,任一失败则 SSH 触发 rollback 脚本并把 job 标记失败。
3. 同步更新 tests/deployment-workflow.test.ts 与 release 排序测试:断言 deploy 脚本含 rollback 逻辑、workflow 含部署后探测步骤。改脚本与测试同提交。
验收:npm test 通过(deployment 测试绿);deploy 脚本含 rollback;workflow 含部署后探测;无破坏现有部署顺序(migrate deploy → seed → build → restart)。

### 批次 3D：本地内容录入校验流(支撑维度 1 的 SOP)
目标:把"扩学科"的人工录入步骤工程化为一个本地校验命令,降低边际成本与出错率。
步骤:
1. 新增 src/lib/content-onboarding.ts:
   - 导出 validateNewBatch(corpus):对拟新增学科批次,校验每个实体有 slug、titleEn、至少一个核验来源(source URL + type),D3 理论必须含 genealogy 关系,无法核验的实体强制 status="draft" 且不得出现在公开 static params。
   - 复用现有 validateSeedCorpus() 与 content-validation.ts,不重复造校验逻辑。
2. 在 package.json 新增脚本:"content:check": "node --experimental-strip-types src/lib/content-onboarding.ts"(或封装为 node:test 风格的可执行入口)。
3. 在 tests/ 新增 content-onboarding.test.ts:覆盖"缺核验来源应阻断 published"、"缺 genealogy 的 D3 理论应阻断"、"draft 实体不得进 static params"等边界。
4. 把该命令写入 docs/roadmaps/2026-07-17-content-expansion-roadmap.md(维度 1 批次 1C 产出)的录入 SOP 第一步。
验收:npm run content:check 可运行;新测试通过;npm run build 不受影响。
```

---

## 维度 4：UI 方面

### 4.1 修改意见

视觉方向"Scholar × Dark Glass × Knowledge Graph"(N14)是对的,可信、克制、学术。但当前有五处可优化,且**不偏离已确立的设计令牌与"无大圆角/无渐变装饰球/无复杂动画"约束**:

- **图谱交互密度**:核心交互面,但若节点稀疏或交互反馈弱,首页"可探索图谱"的 wow 感出不来。需让图谱在节点少时也不显空、在 hover/click 时反馈明确、支持模式切换(genealogy/scholars/topics)的可发现性。
- **内容页阅读体验**:正文宽度、目录 TOC、来源块(VerificationBadge/SourceBlock)的可读性是学术站的生命线。需确认正文宽度在 680–760px、TOC 可滚动追踪、来源块不打断阅读流。
- **广告位自然度**:N17 定"不做侧边栏,仅 3 处流式广告位,外框与站点设计统一"。需确认 in-article/bottom/home-banner 三处不遮挡正文、移动端高度 ≤ 视口 40–60%、标注 Advertisement。
- **移动端**:N11 上线后用跳出率驱动迭代,但 375px 基线验收必须现在做(无横向滚动、图谱可触控、广告位不挤压正文)。
- **信任标识可见度**:L1/L2/L3 核验体系目前是后端机制,运营上应让用户可见(VerificationBadge 已有组件,需确认在详情页显著呈现),这是对抗 AI 内容农场的核心叙事。

### 4.2 详细实施步骤提示词

```text
你是 Syrtag 的 Codex 执行者。按以下五个批次优化 UI,全程不得偏离现有设计令牌(深色底、玻璃卡片、冷蓝强调色、圆角 6–8px、无大渐变/装饰球/复杂动画)与移动端优先原则。

### 批次 4A：图谱交互密度与反馈
目标:首页可探索图谱在当前节点规模下不显空、交互反馈明确。
步骤:
1. 读 GraphCanvas.tsx、GraphNode.tsx、GraphEdge.tsx、KnowledgeGraphExperience.tsx,确认:节点数较少时是否自动调整布局密度(如 force-directed 参数随节点数缩放);hover 是否高亮相连边与邻居并淡化无关节点;click 是否导航到实体详情或聚焦该节点。
2. 强化交互反馈(保持无复杂动画):hover 相邻边加粗 + 邻居高亮 + 其余降至 30% 透明;click 节点弹出轻量 tooltip(实体名 + 分类 + 一句摘要 + "查看详情"链接),而非直接跳转。
3. 让 genealogy/scholars/topics 三模式切换器在桌面端与移动端都可见且可发现(移动端放图谱上方抽屉式控制条)。
4. 确认空图/unavailable 状态用 DataUnavailableState 组件呈现,生产环境绝不渲染 demo 样本。
验收:首页图谱在 12 理论规模下不显空;hover/click 反馈明确;三模式切换在 375px 可达。

### 批次 4B：内容页阅读体验
目标:正文阅读区符合学术阅读舒适度。
步骤:
1. 审计 EntityArticle.tsx、TheoryArticle.tsx、ContentBlocks.tsx、PathwayContentSections.tsx,确认正文容器宽度在 680–760px(桌面),行高 1.6–1.75,段间距充分。
2. 确认 TOC(若 TheoryDetail 有目录)在桌面 sticky 且随滚动高亮当前节;移动端折叠为顶部展开式。
3. 确认 SourceBlock 与 VerificationBadge 在正文流中以不打断阅读的方式呈现(如脚注式或侧栏式引用,而非大块插入)。
4. 确认 L1/L2/L3 深度标签与核验徽章在标题区可见(信任标识对外可见)。
验收:一个代表理论页在桌面与 375px 下正文宽度合规、TOC 可追踪、来源块不割裂阅读、核验徽章可见。

### 批次 4C：广告位自然度
目标:三处流式广告位不破坏阅读。
步骤:
1. 审计 AdSlot.tsx、ClientAdSlot.tsx,确认 placement 取值 'top'|'in-article'|'sidebar'|'bottom' 且当前线上只启用 in-article、bottom、home-banner 三处(N17)。
2. 确认每个广告位标注 "Advertisement";外框用站点设计语言(深色玻璃卡片 + 细边框);移动端单广告位高度 ≤ 视口 40–60%。
3. 确认广告位不遮挡正文、不在移动端造成横向滚动、不在首屏挤压 hero。
4. 在 privacy-policy 与 cookie-policy 页确认已为 AdSense/Google 广告预留说明(批次 4 不改法务内容,只确认存在)。
验收:三处广告位在桌面与 375px 下不遮挡正文、高度合规、标注齐全。

### 批次 4D：移动端 375px 基线
目标:全站在 375px 无横向滚动、可触控。
步骤:
1. 对首页、一个理论详情页、/search、/pricing、一个学科页在 375px 视口做布局检查(用浏览器或 build 后视觉检查)。
2. 修正任何横向滚动来源(固定宽度元素、负 margin、溢出表格)。表格类(如理论适配比较表)在移动端改为可横向滚动容器或卡片化,但不撑破正文流。
3. 确认图谱在 375px 可单指拖拽与双指缩放(若自绘 Canvas 已实现触控;若未实现,标注为已知项并在 playbook 登记,不在本批次强行加触控)。
验收:5 个代表页在 375px 无横向滚动;无破坏桌面布局。

### 批次 4E：信任标识对外可见
目标:把后端核验机制做成用户可见的信任叙事。
步骤:
1. 确认 VerificationBadge 在所有实体详情页(理论/学者/著作/主题)显著呈现,显示核验等级(L1/L2/L3)与最近核验日期(来自 Verification.verifiedAt)。
2. 在 about 或新建 src/app/editorial-policy(若已存在则复用)页,新增"核验方法论"段落,用平实语言说明 L1/L2/L3 含义、来源类型、不可核实时如何标注。这是对外营销叙事("每条事实可追溯一手来源")。
3. 确认该页进 sitemap 与 internal-links,SEO 元数据完整。
验收:核验徽章在详情页可见;核验方法论页可访问、入 sitemap、移动端无横向滚动。
```

---

## 全局验收标准(Codex 每批次结束前自检)

每个批次必须满足以下全部,方可在 chat 里报告"完成":

- `npm run db:migrate && npm run db:seed && npm run test && npm run lint && npm run build` 全部通过(若该批次改了 schema,迁移必须在 seed 前)。
- 新增公开路由(如 /pricing)已进 `generateStaticParams`、`sitemap.ts`、`src/lib/internal-links.ts`,且有 canonical 与 Open Graph。
- 移动端 375px 无横向滚动(对涉及的页面)。
- 未引入未授权的新依赖;未新增 Prettier/Husky 之外的脚手架。
- 未违反四条铁律(seed-content.ts 真相源、公开读不变量、不虚构、构建顺序)。
- SITE_CONSTRUCTION_PLAYBOOK.md 的"当前基线"已按本批次更新;涉及决策的已在"决策记录"登记(N21–N22 等)。
- 不在未完成 P0(线上落后)前宣称线上已更新;线上变更只在批次 1A 验收通过后触发。

## 实施顺序建议(Codex 按此跑,也可由用户指定)

1. 维度 3 批次 3A(回写图谱决策,零风险,先对齐文档)
2. 维度 1 批次 1A(P0 线上同步,最高优先)
3. 维度 3 批次 3B(补 typecheck/E2E,为后续验收铺路)
4. 维度 1 批次 1B(修图谱断边)
5. 维度 3 批次 3C(部署可观测性与回滚)
6. 维度 2 批次 2A→2B→2C(商业模式重设 + 订阅脚手架)
7. 维度 3 批次 3D(内容录入校验流)
8. 维度 1 批次 1C(扩学科规划大纲)
9. 维度 4 批次 4A→4E(UI 优化)

> 说明:这个顺序把"对齐文档 → 解除 P0 → 补门禁 → 修数据 → 加固部署 → 商业模式 → 内容流 → 扩学科 → UI"排成从低风险到高价值的递进。每个批次独立提交,任何一个失败不阻塞其他可并行的批次。
