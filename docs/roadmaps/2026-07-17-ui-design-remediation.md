# UI 设计修正与无障碍验收：实施记录

> 日期：2026-07-17
> 状态：已完成并发布（PR #6，production workflow 29594180907）
> 阶段：P5–P7
> 负责人：Claude Code + 10 个专项 Agent
> 关联：本文件记录获批的 10-Agent UI 修正范围与本地验收结果

## 1. 目标与用户价值

为英文硕博研究者修正首页、搜索、知识图谱、实体长文和静态页面的 UI，使“研究问题或关键词 → 搜索/图谱 → 已发布实体 → 关系与来源”的核心路径在桌面端和移动端均可读、可操作、可恢复。

用户可观察到的变化包括：首页 Hero 直接搜索、图谱模式和节点详情具备键盘与触控等价路径、长文 TOC 与来源语义更清晰、主要控件统一为至少 44px、未启用广告时不再出现大块空白、全站响应式布局不再横向溢出。

## 2. 范围

### 包含

- 首页直接搜索入口、搜索页标签及无结果恢复路径。
- 图谱模式、节点选择、关系详情、Escape 回焦与 reduced-motion。
- 理论页和通用实体页的 TOC、正文宽度、来源登记与核验范围说明。
- Static Page、Pricing 和 Phase 1 空广告位。
- 全局设计令牌、Next font、聚焦状态、控件高度和响应式 CSS 分域。
- Chromium Playwright + axe 浏览器验收。

### 不包含

- 不修改 `src/data/seed-content.ts`、Prisma schema、迁移、查询或学术事实。
- 不新增公开学科、路由、static params 或 sitemap 项。
- 不实现真实广告、支付、账户、分析、CMS 或新图谱引擎。
- 实施与本地验收阶段不执行 commit、push、PR、merge 或生产部署；2026-07-18 获明确上线授权后，另行通过 PR #6 完成发布。

## 3. 当前证据与决策

- 原 UI 存在首页无直接搜索、图谱控制仅视觉选中、Canvas 缺等价节点路径、TOC 双树及中等宽度越界、页面来源与 claim-level 核验范围混淆、空广告占位过高、控件高度漂移等问题。
- 采用原生 Canvas，不引入 React Flow/Sigma.js；关系与来源只使用当前已发布数据。
- `SearchBox` 最终收敛为渐进增强的 inline 原生表单，删除未使用的 dialog、suggestion、fetch 和对应孤儿 CSS。
- CSS 按职责拆为 `globals.css`、`shell.css`、`search.css`、`graph.css`、`content.css`，每个文件均小于 800 行。
- Playwright 默认不复用已有服务，并通过 preflight 拒绝缺失或早于 build 输入的 `.next/BUILD_ID`；数据库迁移、seed 和 build 不隐藏在 E2E 脚本中。

## 4. 实施步骤

1. 建立设计令牌、Next font、44px 控件、focus 与 reduced-motion 基线。
2. 接入首页 inline 搜索并区分搜索未输入、无结果、服务不可用状态。
3. 完成图谱模式可读状态、节点 picker、关系详情、触控拖拽区分、Escape 回焦和 reduced-motion。
4. 合并响应式 TOC DOM，修正文宽、来源登记与页面级核验说明。
5. 整理 Theory、Static Page、Pricing 和禁用广告状态。
6. 拆分并整合响应式 CSS，覆盖 375、768、769、1024、1440px。
7. 建立 Playwright/axe、fresh-build preflight 和真实搜索/图谱交互测试。
8. 运行生产构建、浏览器矩阵、人工 DOM/尺寸检查和独立审查。

## 5. 数据、内容与安全

- 数据来源与核验等级：未新增或修改学术内容；保持现有 published-only 和 L1/L2/L3 合同。
- 数据迁移/seed 影响：无 schema 或 seed 内容改动。本轮在用户授权的 loopback PostgreSQL 上执行 migrate，并连续两次 seed 成功；未运行 `db:reset`。
- 环境变量/权限需求：构建需要本地 `DATABASE_URL`；验收前只输出了 loopback 分类，未打印凭证。
- 隐私、版权或法律影响：未接入广告脚本、Cookie、Analytics 或外部数据收集。

## 6. 验收标准与结果

- `npm run typecheck`：通过。
- `npm test`：114 项，113 通过、0 失败、1 项既有构建后条件性 skip。
- `npm run lint`：通过。
- `npm run content:check`：通过，2 个学科、12 个理论。
- `npm run build`：通过，93/93 页面；构建产物 smoke 1/1 通过。
- `PLAYWRIGHT_PORT=3101 npm run test:e2e`：20/20 通过，覆盖四视口、769px TOC 边界、axe serious/critical、搜索提交、图谱模式/节点/详情/Escape 回焦和 reduced-motion。
- 人工生产浏览器检查：`/`（1440、375）、`/theories/life-course-theory`（769）、`/search?q=teacher%20identity`（768）均无横向溢出、console error、page error 或 first-party 4xx/5xx。
- 实测主要目标：图谱模式按钮 44px；375px 搜索按钮和移动菜单均为 44px；769px 理论页正文为 720px；图谱 Topics 选中、节点详情和 Escape 回焦通过。
- 本地截图保存于被忽略的 `node_modules/.cache/syrtag-playwright/manual-screenshots/`，不进入仓库。

## 7. 风险、回退与发布判定

- 已关闭独立审查提出的搜索旧建议状态、E2E 复用旧服务、交互测试不足和核验徽章重复朗读问题。
- 端口 3000 被一个非本轮可终止的旧本地服务占用，验收改用可配置的 3101；未 kill 未明确归属本会话的进程。
- 回退方式：按组件、测试和五个 CSS 文件恢复本分支改动；无数据库迁移需要回退。
- 发布判定：PR #6 已于 2026-07-18 合并为 `082debc`；production workflow `29594180907` 完成部署与三次公网健康探测，结论为 success。

## 8. 执行记录

- 实际改动：UI 组件、样式组织、浏览器测试、Playwright 配置及本地文档。
- 验证结果：Node、TypeScript、ESLint、内容、生产构建、20 项 E2E 和人工浏览器检查均通过。
- 发布记录：提交 `1ea147c` 与 `1d42451` 通过 PR #6 合入 `main`，production workflow `29594180907` 成功完成部署。
- 线上复验：`/`、搜索、Life Course Theory、Pricing、robots 与 sitemap 均返回 200；375/768/769/1440px 无横向溢出或浏览器错误，图谱模式、节点详情与 Escape 回焦通过。
- 下一步：进入发布后监测与内容运营，不扩大当前 Education/Sociology 公开范围。
