# Syrtag 下一轮 Codex 实施提示词（v2.0：收口部署 + 补完内容/UI）

> 日期：2026-07-17
> 版本：v2.0（承接 v1.0 `2026-07-17-overhaul-and-operations-codex-prompt.md`）
> 用途：v1.0 的 3A/3B/3C/3D/2A/2B/2C 已在本地落地但**未提交、未合并、未部署**；1A/1B/1C/4A–4E 未做。本文件是下一轮交给 Codex 的实施提示词，按"先堵 P0、再补内容、再做 UI"排序。
> 前置必读：`syntag/CLAUDE.md`、`syntag/AGENTS.md`、`syntag/docs/SITE_CONSTRUCTION_PLAYBOOK.md`（先读第 2 节"当前基线"与第 10 节"决策记录"）、v1.0 提示词。

---

## 全局上下文（给 Codex 的前置说明）

你正在 Syrtag 仓库（`syntag/` 目录内，Next.js 16 App Router + PostgreSQL/Prisma 7 + React Query + Tailwind 4）工作。当前 git 状态：分支 `feature/release-positioning-hardening`，工作区有 18 个未提交文件（3A/3B/3C/3D/2A/2B/2C 的成果），分支**落后 origin 1 个提交**，未合并 `main`，未部署。线上 `https://syrtag.com` 仍是 C1 前版本，3 个代表理论页各含 18 处 `being prepared`。

四条铁律（任何批次不得违反）：

1. **`src/data/seed-content.ts` 是学术内容的唯一真相源。** 不在页面/组件硬编码理论/学者/著作文本。流程：typed contract → `validateSeedCorpus()` → Prisma 幂等 seed → published 读。
2. **公开读不变量：** 所有公开面（图谱、搜索、详情路由、sitemap、内链、`generateStaticParams`）只暴露 `status:"published"` 实体。新增公开路径必须同改动加 static params + sitemap + SEO 元数据。
3. **不虚构内容：** DB 不可用走"可恢复的 unavailable 状态"；学术主张须可追溯一手来源（OpenAlex/Crossref/ORCID/Google Books/WorldCat/一手著作），Wikidata/通用百科仅作发现与交叉校验。
4. **构建顺序：** 永远 `db:migrate → db:seed → build`，构建前必先 seed。

未明确授权时不新增 Prettier/Husky 之外的脚手架；不重构未损坏的代码；不"改进"相邻代码。匹配现有风格（2 空格、分号、双引号、PascalCase 组件、kebab-case 路由/数据文件）。每个批次独立提交、独立验收，全部门禁通过才可在 chat 报告"完成"。

---

## 批次 N1：收口本地改动并部署（解除 P0 线上落后）—— 最高优先

### 目标
把本地已完成的 3A/3B/3C/3D/2A/2B/2C 改动提交、合并到 `main`、触发生产部署，让线上追平 C1–C7、消除 18 处 `being prepared`。

### 步骤
1. 先拉齐分支：`git fetch origin && git pull --rebase origin feature/release-positioning-hardening`（当前落后 1 个提交），解决可能的冲突，保留本地 18 个文件的改动。
2. 跑完整本地门禁，确认绿色：
   `npm run db:migrate && npm run db:seed && npm run typecheck && npm test && npm run lint && npm run content:check && npm run build`
   记录测试数、lint、构建页面数（应为 92+，含新增 `/pricing`、`/editorial-policy`）。
3. 核对 12 个代表理论页源码，确认 C1–C7 真实内容已写入 `seed-content.ts`（不是 fallback 的 `being prepared`）。`being prepared` 仅作为 `content.ts` 的兜底文案存在是允许的，但 12 个已发布理论页不应命中它。
4. 核对 `/pricing`、`/editorial-policy` 已进 `src/app/sitemap.ts` 与 `src/lib/internal-links.ts`，Header/Footer 含 Pricing 链接；canonical + Open Graph 完整。
5. 按 conventional commit 分批提交（建议：`feat(pricing): add pricing and editorial-policy pages`、`feat(db): reserve subscription skeleton`、`feat(ops): add rollback and post-deploy probes`、`feat(content): add content-onboarding validation`、`docs: record N21/N22 decisions` 等，不要一坨大提交）。
6. 推送 `feature/release-positioning-hardening`，开 PR 到 `main`，正文说明：迁移要求（`add_subscription_skeleton`）、seed/环境要求、未解决风险、线上当前 18 处 `being prepared` 将在本 PR 部署后消除。
7. 合并到 `main` 后，确认 GitHub Actions（`.github/workflows/deploy-production.yml`）触发：`npm ci → prisma migrate deploy → db:seed → build → restart syrtag`，末尾 3 次公网探测通过。
8. 部署后 `curl https://syrtag.com` 与 3 个代表理论页（如 `/theories/...`），确认 200 且**无 `being prepared`**；`/sitemap.xml` 含 `/pricing`、`/editorial-policy`。

### 验收
- 线上 3 个代表理论页 0 处 `being prepared`；`/pricing`、`/editorial-policy` 返回 200。
- 本地门禁全绿；PR 已合并；部署 workflow 绿；公网探测绿。
- 在 `SITE_CONSTRUCTION_PLAYBOOK.md` 第 2 节"公开线上"行更新为"线上已同步 C1–C7，代表页 0 处 being prepared"，并在第 10 节决策记录登记一条"线上同步批次"执行记录。

### 注意
- **本批次完成前，不得在 chat 对外宣称线上已更新。** 线上变更只在公网探测通过后报告。
- 生产迁移必须向后兼容旧应用快照（回滚机制要求）；`add_subscription_skeleton` 迁移应纯加列、不加非空约束。
- 若 `git pull --rebase` 出现冲突，优先保留本地新增内容，不丢弃 3A–3D/2A–2C 成果。

---

## 批次 N2：修复图谱断边（节点 ID 规范统一）

### 目标
消除 graphify 健康检查约 90 条 dangling-endpoint 边，使 `seed-content.ts` 与模板文件在图中真实连通。不影响网站运行。

### 步骤
1. 跑 graphify 健康检查（见根 `CLAUDE.md` 的 graphify 流程），导出当前 dangling-endpoint 边清单。
2. 审计 `src/lib/entities/*`、`src/data/templates/*`、`src/data/seed-content.ts` 的节点 ID 生成方式。根因：语义层 concept 节点用了"仓库全路径"ID，AST 层用"仓库相对路径 + 下划线连接"ID，导致同实体分裂成两个互不连接节点。
3. 把语义层 concept 节点 ID 统一为与 AST 一致的相对路径格式（见 graphify extraction-spec 的 "Node ID format" 段）。**只统一 ID 命名，不改网站运行逻辑。**
4. 如需补录已存在但未连的关系，必须可追溯来源并在 `Verification.verifiedAt` 登记；无法核验的关系不得补。
5. 重跑 graphify 健康检查，确认 dangling-endpoint 边降至 < 10。

### 验收
- graphify 健康检查无 GRAPH HEALTH WARNING，或仅剩 < 10 条且每条已在 playbook 登记为已知项。
- `npm test && npm run build` 不受影响（本批次不改运行逻辑）。

---

## 批次 N3：补全扩学科规划大纲（完整版）

### 目标
现有 `docs/roadmaps/2026-07-17-content-expansion-roadmap.md` 仅 724 字节骨架，本轮把它补成完整文档。**只产规划文档，不改 `seed-content.ts` 内容数据。**

### 步骤
1. 补"半结构化内容批次录入 SOP"完整版：每批次以一个学科为单元，前置 D3/D2/D1 三层各覆盖哪些理论；录入模板复用 `src/data/templates/*` 的 typed contract，新增内容必须过 `validateSeedCorpus()` + `npm run content:check`；每条实体附 source URL + type，`Verification.verifiedAt` 写核验日期，无法核验标 pending 且不得 published；扩学科前先补 genealogy 边密度。
2. 补"扩学科优先级排序与理由"：第 3 学科 Psychology（与 Sociology 在身份理论/生命历程理论有交叉，playbook 已预留其名）；第 4 学科 Management/OB（与 Institutional Theory、Multiple Streams Framework 有节点交叉）；暂不纳入需独立核验体系且无交叉的学科。
3. 补"Psychology 首批内容清单草案"：D3×2、D2×4、D1×6 理论候选（可基于 `docs/research/` 现有研究包扩展），每条标注拟核验来源类型（OpenAlex/Crossref/ORCID/一手著作等）。
4. 补"扩学科触发标准"（按指标非按时间）：现有学科 genealogy 边密度达标 + 有可核实来源 + 该学科与现有图交叉关系数 ≥ 阈值（给出该阈值的具体数值与测算口径）。

### 验收
- 产出 1 份完整 roadmap，含上述四节。
- 本批次不改 `seed-content.ts`；`npm run build` 不受影响。

---

## 批次 N4：UI 优化（4A–4E 五个子批次）

> 全程不得偏离现有设计令牌（深色底、玻璃卡片、冷蓝强调色、圆角 6–8px、无大渐变/装饰球/复杂动画）与移动端优先。每个子批次独立提交。引用自 v1.0 维度 4，此处只给索引与关键验收，详细步骤见 v1.0 提示词对应批次。

### N4a 图谱交互密度与反馈
- 读 `GraphCanvas.tsx`、`GraphNode.tsx`、`GraphEdge.tsx`、`KnowledgeGraphExperience.tsx`。强化 hover（相邻边加粗 + 邻居高亮 + 其余降至 30% 透明）、click（轻量 tooltip：实体名 + 分类 + 一句摘要 + "查看详情"链接，而非直接跳转）；让 genealogy/scholars/topics 三模式切换在桌面与移动都可见（移动端图谱上方抽屉式控制条）；空图用 `DataUnavailableState`，生产绝不渲染 demo。
- 验收：首页 12 理论规模下不显空；hover/click 反馈明确；三模式在 375px 可达。

### N4b 内容页阅读体验
- 审计 `EntityArticle.tsx`、`TheoryArticle.tsx`、`ContentBlocks.tsx`、`PathwayContentSections.tsx`：正文宽度 680–760px（桌面）、行高 1.6–1.75、段间距充分；TOC 桌面 sticky 随滚动高亮、移动端折叠；`SourceBlock`/`VerificationBadge` 以脚注式或侧栏式不打断阅读；L1/L2/L3 深度标签与核验徽章在标题区可见。
- 验收：一个代表理论页在桌面与 375px 下正文宽度合规、TOC 可追踪、来源块不割裂阅读、核验徽章可见。

### N4c 广告位自然度
- 审计 `AdSlot.tsx`、`ClientAdSlot.tsx`：placement 取值 `'top'|'in-article'|'sidebar'|'bottom'`，线上只启用 in-article、bottom、home-banner 三处（N17）；每处标注 "Advertisement"，外框用站点设计语言（深色玻璃卡片 + 细边框）；移动端单广告位高度 ≤ 视口 40–60%；不遮挡正文、不造成横向滚动、不在首屏挤压 hero；privacy-policy/cookie-policy 已为 AdSense 预留说明（只确认存在）。
- 验收：三处广告位在桌面与 375px 下不遮挡正文、高度合规、标注齐全。

### N4d 移动端 375px 基线
- 对首页、一个理论详情页、`/search`、`/pricing`、一个学科页在 375px 视口做布局检查；修正任何横向滚动来源（固定宽度、负 margin、溢出表格——表格类改可横向滚动容器或卡片化，不撑破正文流）；图谱在 375px 若已支持触控则确认，未实现则登记为已知项不强行加。
- 验收：5 个代表页在 375px 无横向滚动；无破坏桌面布局。

### N4e 信任标识对外可见
- 确认 `VerificationBadge` 在所有实体详情页显著呈现（核验等级 L1/L2/L3 + `Verification.verifiedAt` 最近核验日期）；在 `editorial-policy` 页新增"核验方法论"段落（平实语言说明 L1/L2/L3 含义、来源类型、不可核实时如何标注）——这是对外营销叙事"每条事实可追溯一手来源"；该页进 sitemap 与 internal-links，SEO 元数据完整。
- 验收：核验徽章在详情页可见；核验方法论段可访问；移动端无横向滚动。

---

## 全局验收标准（每批次结束前自检）

- `npm run db:migrate && npm run db:seed && npm run typecheck && npm test && npm run lint && npm run content:check && npm run build` 全通过（改 schema 时迁移在 seed 前）。
- 新增公开路由已进 `generateStaticParams`、`sitemap.ts`、`src/lib/internal-links.ts`，有 canonical 与 Open Graph。
- 涉及页面移动端 375px 无横向滚动。
- 未引入未授权新依赖；未新增 Prettier/Husky 之外脚手架。
- 未违反四条铁律。
- `SITE_CONSTRUCTION_PLAYBOOK.md` 第 2 节"当前基线"与第 10 节"决策记录"已按本批次更新。

## 实施顺序

N1（收口部署，堵 P0）→ N2（修图谱断边）→ N3（补全扩学科大纲）→ N4a–N4e（UI 五子批次）。N1 是硬前置，必须先完成并部署成功，其余批次才依次推进。N2 与 N3 可并行；N4 各子批次可并行但建议按 a→b→c→d→e 顺序以便复用 375px 检查。
