# Syrtag P0 Hardening and Gated P1 Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 先完成 Syrtag 的英文用户入口、内容发布状态、证据表达与理论关系审核基础，再在人工来源和审核资料齐备后，有条件地开展 Topic-first 内容、理论比较、分享与本地保存实验。

**Architecture:** 保留 `seed-content.ts → validateSeedCorpus() → Prisma seed → published reads` 主干。P0 只做可验证且不需要虚构学术判断的工作：基线收口、英文首页、corpus 纯物理拆分、Education/Sociology 范围门禁、status-aware seed、证据分类兼容层和人工审核包。Genealogy 的数据库字段、seed、公开过滤、页面和图谱切换必须在 8 条关系全部得到人工决定后作为一个原子发布单元完成。P1 内容与留存任务必须获得用户提供的研究包或明确授权后逐项执行。

**Tech Stack:** Next.js 16 App Router、React 19、TypeScript、Tailwind CSS 4、PostgreSQL、Prisma 7、React Query、`node:test`、GitHub Actions。

---

# 1. 给 Codex 的全局执行规则

仓库：

```text
/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag
```

开始前必读：

```text
CLAUDE.md
AGENTS.md
docs/SITE_CONSTRUCTION_PLAYBOOK.md
docs/roadmaps/2026-07-17-five-angle-content-operations-plan.md
docs/roadmaps/2026-07-17-content-expansion-roadmap.md
```

## 1.1 不变量

1. `src/data/seed-content.ts` 是唯一 production manifest 和唯一 seed 输入。允许拆成多个物理模块，但只有该文件可以聚合导出 `seedCorpus`。
2. 所有公开面只暴露 `status: "published"` 的实体。Genealogy 原子切换后，只暴露 `status: "published" && reviewDecision: "approved"` 且两端理论均 published 的关系。
3. 禁止虚构来源、DOI、URL、locator、页码、审核者、审核日期、关系类型、方向和学术结论。
4. 数据库与构建顺序必须是：

```text
db:migrate → db:seed → build
```

5. 不使用 `npm run db:reset`。
6. 不通过删除断言、增加 skip/only、降低测试标准、更新快照掩盖差异或吞掉错误使门禁变绿。
7. 不重新开发已完成的线上 C1–C7 同步、Graphify 修复、GraphCanvas 交互或文章阅读流。
8. Psychology 和 Management/OB 继续 No-Go；不得进入 published、static params、sitemap、公开图谱、搜索或导航。
9. 每个任务独立提交；禁止 `git commit -am`。必须显式 `git add <files>`，随后运行 `git diff --cached --check` 和 `git diff --cached --name-status`。
10. 不 push、不 merge、不创建 PR、不部署，除非用户另行授权。
11. 任何需要学术判断的步骤必须停止并请求人工输入。Codex 只能整理现有事实，不能自行批准内容。
12. 仓库没有浏览器自动化依赖。计划中的桌面和 375px 验收是人工验收，不能伪称为自动化 E2E。

## 1.2 本计划的执行边界

```text
P0-A：Task 1–12 可立即执行；Task 10 紧接 Task 9 执行。Task 12 提交审核包后必须停止并请求人工输入。
P0-B：Task 13 只有在 8 条结构化 genealogy 人工决定已提供且用户明确授权后执行；完成后重跑 Task 10 的 relation 条件测试。
P1：Task 14–16，只有在对应人工内容输入与用户授权后逐项执行。
Final：Task 17 在 P0-A 停止状态或 P0-B 完成状态下均须执行，并明确报告所处状态。
```

完成 P0-A 不等于完成 P0-B；完成 P0 不等于完成 P1。最终报告必须分别写明：

```text
P0-A completed / blocked
P0-B not authorised / completed / blocked
P1 not started / approved task completed / blocked by missing human input
```

---

# 2. P0 工作包 A：基线收口与旧提示词废止

## Task 1：冻结现场并确认实时 Git 状态

**Files:**
- Read: `docs/SITE_CONSTRUCTION_PLAYBOOK.md`
- Read: `docs/roadmaps/2026-07-17-content-expansion-roadmap.md`
- Read: `docs/roadmaps/2026-07-17-next-round-codex-prompt.md`
- Read: `docs/roadmaps/2026-07-17-overhaul-and-operations-codex-prompt.md`

- [ ] **Step 1：只读检查本地状态**

```bash
cd "/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag"
git status --short --branch
git rev-parse --abbrev-ref HEAD
PLAN_BASE_COMMIT=$(git rev-parse HEAD)
printf 'PLAN_BASE_COMMIT=%s\n' "$PLAN_BASE_COMMIT"
git rev-list --left-right --count @{upstream}...HEAD
git rev-list --left-right --count origin/main...HEAD
git log --oneline --decorate --graph -12
git diff --name-status
git diff --cached --name-status
git diff --check
```

Expected：

- 当前分支是 `feature/release-positioning-hardening`；
- 暂存区为空；
- `git diff --check` 无输出；
- 工作树中已有规划文档改动必须保留；
- 把输出按 `PLAN_BASE_COMMIT=<40位完整SHA>` 原样写入 Playbook 本轮执行记录，Task 17 必须从该行读取。

停止条件：

- 分支不正确；
- 暂存区非空；
- 发现未说明的 Prisma、migration、seed、API、依赖或部署改动。

出现停止条件时，不 pull、rebase、merge、restore 或 add；报告状态后停止。

- [ ] **Step 2：可选联网刷新远端状态**

只有用户允许联网更新 Git remote refs 时才运行：

```bash
git fetch --prune origin
git rev-list --left-right --count @{upstream}...HEAD
git rev-list --left-right --count origin/main...HEAD
```

fetch 后 behind 大于 0 时停止，不自行同步分支。

- [ ] **Step 3：审阅已有 UI 提交范围**

```bash
git show --check --stat 923b2d6
git show --check --stat b25c20f
git diff --name-status 923b2d6^ 923b2d6
git diff --name-status b25c20f^ b25c20f
```

确认两提交不包含 schema、seed、API、依赖或部署变更。

## Task 2：运行当前基线门禁并人工验收已有 UI

**Files:**
- No source edits
- Later modify: `docs/SITE_CONSTRUCTION_PLAYBOOK.md`

- [ ] **Step 1：确认 `.env` 指向安全的本地或隔离数据库**

不得打印 `DATABASE_URL`。无法确认时停止数据库命令。

- [ ] **Step 2：执行完整门禁**

```bash
npm run db:migrate \
  && npm run db:seed \
  && npm run typecheck \
  && npm test \
  && npm run lint \
  && npm run content:check \
  && npm run build \
  && node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts
```

Expected：全部退出码为 0。测试数和构建页面数以实时输出为准。

- [ ] **Step 3：人工浏览器验收**

```bash
npm run start
```

检查桌面和 375px：

```text
/
/theories/life-course-theory
/theories/structuration-theory
```

逐项记录图谱 hover/click/模式切换、移动控制条、TOC、阅读宽度、来源区、广告位和横向滚动。

## Task 3：废止旧提示词并更新唯一基线

**Files:**
- Modify: `docs/SITE_CONSTRUCTION_PLAYBOOK.md`
- Modify: `docs/roadmaps/2026-07-17-content-expansion-roadmap.md`
- Modify: `docs/roadmaps/2026-07-17-next-round-codex-prompt.md`
- Modify: `docs/roadmaps/2026-07-17-overhaul-and-operations-codex-prompt.md`
- Add: `docs/roadmaps/2026-07-17-five-angle-content-operations-plan.md`
- Add: `docs/superpowers/plans/2026-07-17-syrtag-content-operations-codex-master-plan.md`

- [ ] **Step 1：两份旧提示词加入相同状态块**

```markdown
> **状态：已废止（superseded）— 2026-07-17。**
> 本文件仅保留历史审计价值，不再作为 Codex 执行入口。后续工作必须以 `docs/SITE_CONSTRUCTION_PLAYBOOK.md` 当前基线、`docs/roadmaps/2026-07-17-five-angle-content-operations-plan.md` 和最新批准的实施计划为准。
```

明确线上同步、Graphify、2A–2C、3A–3D 已完成；4A/4B 以 Task 2 实时验收为准；4C–4E 和扩学科必须重新立项。

- [ ] **Step 2：扩学科路线图顶部改为**

```markdown
> 状态：规划完成；公开扩科 No-Go；未授权录入或发布
```

- [ ] **Step 3：Playbook 新增 N26**

记录实时分支、HEAD、ahead/behind、门禁、UI 人工验收、旧文件路径和“未 push/merge/deploy”。

- [ ] **Step 4：检查和提交**

```bash
git diff --check
git add docs/SITE_CONSTRUCTION_PLAYBOOK.md \
  docs/roadmaps/2026-07-17-content-expansion-roadmap.md \
  docs/roadmaps/2026-07-17-next-round-codex-prompt.md \
  docs/roadmaps/2026-07-17-overhaul-and-operations-codex-prompt.md \
  docs/roadmaps/2026-07-17-five-angle-content-operations-plan.md \
  docs/superpowers/plans/2026-07-17-syrtag-content-operations-codex-master-plan.md
git diff --cached --check
git diff --cached --name-status
git commit -m "docs: close out superseded execution plans"
```

不 push。

---

# 3. P0 工作包 B：英文首页、Footer 与测量边界

## Task 4：英文首页与共享 PageFrame

**Files:**
- Create: `tests/home-experience.test.ts`
- Modify: `src/components/common/PageFrame.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1：写 RED 测试**

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("home uses the shared frame and exposes two English task entrances", () => {
  const home = readFileSync("src/app/page.tsx", "utf8");
  const frame = readFileSync("src/components/common/PageFrame.tsx", "utf8");

  assert.match(home, /PageFrame/);
  assert.doesNotMatch(home, /components\/layout\/Header/);
  assert.match(home, /href="\/topics"/);
  assert.match(home, /Start with a research question/);
  assert.match(home, /href="#graph"/);
  assert.match(home, /Explore the theory graph/);
  assert.doesNotMatch(home, /[一-鿿]/u);
  assert.match(frame, /id="main-content"/);
});
```

- [ ] **Step 2：确认 RED**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/home-experience.test.ts
```

Expected：当前中文首页和直接 Header 导入导致失败。

- [ ] **Step 3：最小修改 PageFrame**

```tsx
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function PageFrame({ children, mainClassName }: { children: ReactNode; mainClassName?: string }) {
  return (
    <>
      <Header />
      <main id="main-content" className={mainClassName}>{children}</main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4：首页使用 PageFrame 并采用以下文案**

```text
Eyebrow: Research theory pathways
H1: Make a defensible theory choice.
Lead: Start with a research question, explore connected theories, and follow the sources behind each pathway.
Primary CTA: Start with a research question → /topics
Secondary CTA: Explore the theory graph → #graph
Graph H2: Explore the theory graph
Graph description: Choose a discipline and explore relationships among research topics, theories, scholars, works, and concepts.
Status: {nodeCount} nodes · {edgeCount} relationships
```

正常首页使用：

```tsx
<PageFrame mainClassName="home-main">...</PageFrame>
```

图谱 section：

```tsx
<section id="graph" tabIndex={-1} aria-label="Interactive theory graph" className="home-graph-shell">
```

保留 `JsonLdGraph`、demo 边界和 `KnowledgeGraphExperience`。

- [ ] **Step 5：确认 GREEN**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/home-experience.test.ts
```

## Task 5：Header、Footer、ARIA 与键盘入口

**Files:**
- Modify: `tests/home-experience.test.ts`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/lib/static-internal-links.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1：追加 RED 测试**

测试英文导航、`Syrtag home`、桌面/移动 nav label、`aria-controls`、skip link、`Search Syrtag`、About、Footer 两个 nav 和 `.skip-link:focus-visible`。

- [ ] **Step 2：确认 RED**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/home-experience.test.ts
```

- [ ] **Step 3：修改 Header**

```ts
const navigation = [
  ["Topics", "/topics"],
  ["Theories", "/theories"],
  ["Scholars", "/scholars"],
  ["Works", "/works"],
  ["Concepts", "/concepts"],
  ["Pricing", "/pricing"],
] as const;
```

加入：

```tsx
<a className="skip-link" href="#main-content">Skip to main content</a>
```

菜单按钮：

```tsx
aria-controls="mobile-primary-navigation"
aria-label={menuOpen ? "Close primary navigation" : "Open primary navigation"}
```

移动 nav：

```tsx
id="mobile-primary-navigation"
aria-label="Mobile primary navigation"
```

- [ ] **Step 4：Footer 和静态链接**

`STATIC_INTERNAL_LINKS` 增加：

```ts
{ label: "About", href: "/about" }
```

Footer 两组分别使用：

```tsx
<nav aria-label="Explore Syrtag">...</nav>
<nav aria-label="Legal information">...</nav>
```

- [ ] **Step 5：skip link 样式**

```css
.skip-link {
  position: fixed;
  inset-block-start: 0.75rem;
  inset-inline-start: 0.75rem;
  z-index: 100;
  transform: translateY(-160%);
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--accent-primary);
  background: var(--accent-primary);
  color: var(--accent-on);
  text-decoration: none;
}
.skip-link:focus-visible { transform: translateY(0); }
```

禁止用 `overflow-x: hidden` 掩盖溢出。

- [ ] **Step 6：GREEN 与提交**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/home-experience.test.ts
git add tests/home-experience.test.ts src/components/common/PageFrame.tsx src/app/page.tsx \
  src/components/layout/Header.tsx src/components/layout/Footer.tsx \
  src/lib/static-internal-links.ts src/app/globals.css
git diff --cached --check
git diff --cached --name-status
git commit -m "feat: align English home navigation and footer"
```

## Task 6：隐私最小化事件字典与 Search Console 人工检查点

**Files:**
- Create: `docs/roadmaps/2026-07-17-english-home-and-minimal-measurement.md`
- Modify: `tests/home-experience.test.ts`
- Modify: `src/app/privacy/page.tsx`
- Modify: `src/app/editorial-policy/page.tsx`

- [ ] **Step 1：RED 测试**

断言：

```text
Privacy 明确未使用第三方 analytics
不为 analytics 收集研究问题和站内搜索原文
Editorial Policy 不宣称整页全部已核验
路线图写明事件仅定义、未发射或收集
```

- [ ] **Step 2：路线图写入允许事件**

```text
home_research_question_selected
home_graph_exploration_selected
topic_theory_opened
theory_work_opened
graph_node_opened
search_submitted
```

禁止字段：原始研究问题、原始站内搜索词、项目标题、笔记、AI prompt、邮箱/姓名/账户/会话 ID、IP、User-Agent、指纹、完整 referrer、URL query、draft/archived slug。

`search_submitted` 未来只允许长度桶和结果数桶。

- [ ] **Step 3：政策文案必须区分**

- Syrtag 当前没有站内第三方行为分析；
- Google Search Console 属于站外聚合搜索表现工具，不等于采集用户站内研究问题；
- 未启用广告技术、邮件服务或追踪 Cookie；
- 不宣称已有 peer-review 委员会、固定复核周期或公开纠错表单。

- [ ] **Step 4：GREEN、全量门禁和提交**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/home-experience.test.ts
npm run typecheck
npm test
npm run lint
npm run content:check
npm run db:migrate
npm run db:seed
npm run build
git add docs/roadmaps/2026-07-17-english-home-and-minimal-measurement.md \
  src/app/privacy/page.tsx src/app/editorial-policy/page.tsx tests/home-experience.test.ts
git diff --cached --check
git diff --cached --name-status
git commit -m "docs: define privacy-minimised measurement boundary"
```

- [ ] **Step 5：人工 Search Console 检查点**

此步骤需要用户授权和域名控制权，由人工完成：确认 property、提交 `/sitemap.xml`、记录日期和结果，不记录凭证。未执行时报告：

```text
Technical preparation complete; Search Console setup and 28-day baseline pending human external action.
```

---

# 4. P0 工作包 C：Corpus 纯行为保持拆分

## Task 7：临时全量 hash 特征化测试

**Files:**
- Create: `tests/seed-corpus-regression.test.ts`

- [ ] **Step 1：写临时测试**

当前基线：

```text
SHA-256: ea25c1948c9ccf649e2e9b72edbf1dd6c444322ace495ebcf2acb111a2b19b86
```

测试 full `JSON.stringify(seedCorpus)` hash、现有 15 个数组计数和 `validateSeedCorpus().errors=[]`。

- [ ] **Step 2：运行，必须在拆分前通过**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/seed-corpus-regression.test.ts
```

hash 不同则停止，由协调者确认当前 corpus；不能自行更新。

- [ ] **Step 3：提交临时测试**

```bash
git add tests/seed-corpus-regression.test.ts
git diff --cached --check
git commit -m "test: characterize seed corpus before module extraction"
```

## Task 8：物理拆分并替换临时 hash

**Files:**
- Create: `src/data/corpus/types.ts`
- Create: `src/data/corpus/shared/sources.ts`
- Create: `src/data/corpus/shared/builders.ts`
- Create: `src/data/corpus/shared/entities.ts`
- Create: `src/data/corpus/education.ts`
- Create: `src/data/corpus/sociology.ts`
- Modify: `src/data/seed-content.ts`
- Modify: `tests/seed-corpus-regression.test.ts`

- [ ] **Step 1：原样迁出类型、sources、builders 和数据**

不修改任何内容值、URL、关系、strength、状态、Prisma 或 seed 行为。跨学科共享实体只保留一份。

- [ ] **Step 2：seed-content.ts 显式聚合**

禁止动态目录扫描。必须维持原数组顺序，使临时 full hash 通过。

- [ ] **Step 3：运行临时 hash 测试和全量门禁**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/seed-corpus-regression.test.ts
npm run typecheck
npm run content:check
npm test
npm run lint
```

- [ ] **Step 4：在同一任务中把永久测试改为语义基线**

拆分验证完成后，删除 full JSON hash 断言，保留：

- 现有理论 slug 顺序；
- 现有 genealogy ID 顺序；
- 现有 topic slug 顺序；
- 已有数组计数，但只检查明确列出的旧字段；
- `validateSeedCorpus(seedCorpus).errors=[]`。

测试不得遍历 `Object.entries(seedCorpus)`，以免后续新增治理字段导致无意义失败。

- [ ] **Step 5：提交**

```bash
git add src/data/corpus src/data/seed-content.ts tests/seed-corpus-regression.test.ts
git diff --cached --check
git diff --cached --name-status
git commit -m "refactor: split seed corpus into discipline modules"
```

---

# 5. P0 工作包 D：范围、发布状态与证据表达兼容层

## Task 9：Education/Sociology 范围门禁和所有实体 status-aware authoring

**Files:**
- Modify: `src/data/corpus/types.ts`
- Modify: corpus entity modules
- Modify: `src/lib/content-validation.ts`
- Modify: `src/lib/content-onboarding.ts`
- Modify: `tests/content-validation.test.ts`
- Modify: `tests/content-onboarding.test.ts`
- Modify: `prisma/seed.ts`
- Modify: `tests/seed-integration.test.ts`

- [ ] **Step 1：先写 RED 测试**

测试名和行为：

```text
published Discipline, Field, and Theory reject scope outside Education and Sociology
Psychology and Management records may exist only as draft research candidates
published entity requires a valid ISO publishedAt
archived or draft entity persists publishedAt as null
onboardingBatchFromSeedCorpus preserves authored status for every entity type
archived entities are excluded from publicStaticParamSlugs
reseed preserves an authored archived status
```

修正当前允许 published Psychology fixture 的反向测试。

- [ ] **Step 2：统一 PublicationStatus**

```ts
export type PublicationStatus = "draft" | "published" | "archived";
```

Discipline、Field、Theory、Work、Concept、Scholar、Topic 均增加：

```ts
status: PublicationStatus;
publishedAt?: string;
```

- [ ] **Step 3：validator 限制当前公开学科**

```ts
const PUBLIC_DISCIPLINE_SLUGS = new Set(["education", "sociology"]);
```

本轮范围校验只对可确定直接学科归属的 `Discipline`、`Field`、`Theory` 建立硬门禁：published Discipline slug 必须在集合中；published Field 的 discipline 必须在集合中；published Theory 必须至少通过 `disciplineTheories` 关联一个 published Education/Sociology discipline。Work、Concept、Scholar、Topic 不直接推断学科归属，只要求它们自身 published 且其公开关联目标也为 published；其嵌套公开边界由 Task 13 覆盖。

同时校验：published entity 必须有可解析的 ISO 8601 `publishedAt`；draft/archived 的 seed 投影必须将 `publishedAt` 写为 null。

- [ ] **Step 4：删除 seed 全局硬编码 published**

所有实体使用：

```ts
function publication(record: { status: PublicationStatus; publishedAt?: string }) {
  if (record.status === "published" && !record.publishedAt) {
    throw new Error("Published content requires publishedAt");
  }
  return {
    status: record.status,
    publishedAt: record.status === "published" ? new Date(record.publishedAt!) : null,
  };
}
```

- [ ] **Step 5：RED→GREEN**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/content-validation.test.ts
node --env-file-if-exists=.env --experimental-strip-types --test tests/content-onboarding.test.ts
npm run db:migrate
npm run db:seed
npm run db:seed
node --env-file-if-exists=.env --experimental-strip-types --test tests/seed-integration.test.ts
npm run typecheck
npm test
npm run lint
npm run content:check
npm run build
```

- [ ] **Step 6：提交**

显式 staging 本任务文件，提交：

```text
feat: enforce authored publication status and public scope
```

## Task 10：全实体与嵌套关系的公开读取边界（P0-A，紧接 Task 9 执行）

**依赖：** Task 9。此任务不等待 genealogy 人工审核。Task 13 尚未执行时，只过滤实体 status 与现有关系端点；Task 13 完成后，追加 relation reviewDecision/evidence 条件并重跑本任务测试。

**Files:**
- Create: `tests/publication-boundary.test.ts`
- Review/Modify: `src/lib/entities/` 下所有 detail/index helpers
- Modify: `src/lib/graph-data.ts`
- Modify: `src/lib/search.ts`
- Modify: `src/lib/internal-links.ts`
- Modify: `src/lib/static-params.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/lib/content-onboarding.ts`

- [ ] **Step 1：先写 RED fixture**

构造 published Theory 分别关联 archived/draft Work、Concept、Scholar、Topic 和 Theory endpoint。测试断言：detail DTO、graph 三种模式、search、internal links、static params、sitemap 和 onboarding 都不含非 published slug。

- [ ] **Step 2：逐文件补过滤**

沿用现有 helper，在 Prisma nested include/select 中加入 related entity `status: "published"`；不要新建 repository 抽象。Task 12 未执行时，不引用尚不存在的 relation review 字段。

- [ ] **Step 3：RED→GREEN**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/publication-boundary.test.ts
node --env-file-if-exists=.env --experimental-strip-types --test tests/entity-route-status.test.ts
node --env-file-if-exists=.env --experimental-strip-types --test tests/graph-data.test.ts
node --env-file-if-exists=.env --experimental-strip-types --test tests/information-architecture.test.ts
npm run typecheck
npm test
npm run lint
npm run content:check
npm run build
```

- [ ] **Step 4：显式 staging 和提交**

```text
fix: enforce published-only nested entity reads
```

## Task 11：定义证据状态与内容性质映射，不改变现有 published 状态

**Files:**
- Create: `src/data/templates/evidence-template.ts`
- Create: `docs/decisions/ADR-027-evidence-status-and-content-nature.md`
- Modify: `src/data/templates/theory-template.ts`
- Modify: `src/lib/theory-presentation.ts`
- Modify: `src/components/common/VerificationBadge.tsx`
- Modify: `tests/theory-presentation.test.ts`

- [ ] **Step 1：先写 ADR 映射表**

采用：

```ts
export type EvidenceStatus =
  | "legacy_source_metadata"
  | "source_verified"
  | "insufficient_evidence"
  | "under_review";

export type ContentNature =
  | "source_backed_fact"
  | "editorial_synthesis"
  | "research_guidance";

export type ReviewDecision =
  | "approved"
  | "needs_revision"
  | "rejected"
  | "pending_review";
```

ADR 必须明确：

- 旧 `L1_verified` 在没有 locator/reviewer/真实日期时只能映射为 `legacy_source_metadata`，不能映射为 `source_verified`；
- 旧 `L2_editorial` 映射为 `editorial_synthesis`，不是事实核验；
- 旧 `L3_pending` 不自动映射，必须人工区分 evidence insufficient 与 research guidance；
- `research_guidance` 是内容性质，不是证据不足；
- 只有 approved + source_verified + source_backed_fact 才允许显示 “Source verified”；
- 旧 Prisma Verification 暂时保留，不新建 ClaimEvidence 表。

- [ ] **Step 2：RED 测试**

断言：

```text
legacy L1 does not produce whole-page Verified
research guidance is not counted as insufficient evidence
pending L3 requires manual classification
page summary reports legacy source metadata honestly
```

- [ ] **Step 3：扩展 VerificationEntry 为兼容字段**

新增可选字段，不要求一次回填全部页面：

```ts
claimId?: string;
fieldPath?: string;
locator?: string;
evidenceStatus?: EvidenceStatus;
contentNature?: ContentNature;
verifiedAt?: string;
reviewerRole?: "source_verifier" | "independent_academic_reviewer" | "methods_reviewer" | "publication_editor";
reviewDecision?: ReviewDecision;
```

- [ ] **Step 4：UI 进入诚实 legacy 模式**

在 claim-level 审核未完成前，理论页不显示全页 “Verified”。使用：

```text
Sources listed · claim-level review pending
Editorial synthesis
Research guidance
Insufficient evidence / under review
```

- [ ] **Step 5：测试和提交**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/theory-presentation.test.ts
npm run typecheck
npm test
npm run lint
```

提交：

```text
fix: distinguish legacy sources from claim-level verification
```

## Task 12：创建理论 claim 审核包和 genealogy 审核包

**Files:**
- Create: `docs/research/claim-audit/life-course-theory.md`
- Create: `docs/research/claim-audit/teacher-identity-theory.md`
- Create: `docs/research/genealogy-audit/2026-07-17-existing-relations.md`

- [ ] **Step 1：D3 claim 审核模板**

每条关键 claim 字段：

```text
claim ID
fieldPath
current claim text
source ID
citation
candidate locator
content nature
evidence status
reviewer role
review decision
verifiedAt
rationale
```

Codex 只能填已有 claim text、source ID/citation；locator、reviewer、decision、date 写 `Awaiting human review`。

- [ ] **Step 2：8 条 genealogy 审核表**

字段：relation ID、source/target、页面关系、数据库关系、candidate source/locator、support type、content nature、evidence status、proposed relation/direction、reviewer、decision、date、rationale。

- [ ] **Step 3：提交并强制停止**

```bash
git add docs/research/claim-audit docs/research/genealogy-audit
git diff --cached --check
git diff --cached --name-status
git commit -m "docs: prepare claims and genealogy for academic review"
```

停止并请求人工审核。没有审核结果，不执行 Task 13。

---

# 6. P0 人工批准后的原子发布单元

## Task 13：一次性完成 Genealogy 审核字段、seed、过滤与页面切换

**前置：** 8 条边全部有结构化人工决定；每条必须是 approved published、rejected archived 或 pending draft。用户明确授权执行。

恢复本任务时必须重新运行 `git status --short --branch`、`git rev-parse HEAD` 并核对 Playbook 执行记录；再次在不打印凭证的前提下确认 `.env` 指向本地或隔离数据库。无法确认时不得运行 `prisma migrate dev`、seed 或 build。

**Files:**
- Modify: `src/data/corpus/types.ts`
- Modify: genealogy data module
- Modify: `prisma/schema.prisma`
- Create: Prisma command-generated `prisma/migrations/*_add_genealogy_review_metadata/migration.sql`
- Modify: `prisma/seed.ts`
- Modify: `src/lib/content-validation.ts`
- Modify: `src/lib/graph-data.ts`
- Modify: `src/lib/entities/theories.ts`
- Modify: `src/lib/internal-links.ts`
- Modify: `src/lib/theory-presentation.ts`
- Modify: `src/components/content/TheoryArticle.tsx`
- Modify: `src/components/common/SourceBlock.tsx`
- Modify: `tests/content-validation.test.ts`
- Modify: `tests/graph-data.test.ts`
- Modify: `tests/theory-presentation.test.ts`
- Modify: `tests/information-architecture.test.ts`
- Modify: `tests/seed-integration.test.ts`

- [ ] **Step 1：RED fixtures**

必须覆盖：

```text
published+approved+source-verified relation with complete evidence appears
approved/published relation missing sourceId, locator, verifiedAt, or reviewerRole fails corpus validation
approved/published relation whose sourceId cannot resolve to the source theory content sources fails validation
approved/published relation with evidenceStatus other than source_verified fails validation
pending/draft relation does not appear
rejected/archived relation does not appear
one archived endpoint removes the relation
detail DTO excludes non-public nested relations
graph and theory page use the same relation ID/type/description
relation DTO exposes citation, source URL, and locator for user-visible evidence
missing-locator edge does not enter graph, detail page, or internal links
```

- [ ] **Step 2：SeedGenealogy 增加字段**

```ts
status: PublicationStatus;
sourceId: string | null;
locator: string | null;
supportType: "direct" | "contextual" | "interpretive" | null;
evidenceStatus: EvidenceStatus;
contentNature: ContentNature;
verifiedAt: string | null;
reviewerRole: ReviewerRole | null;
reviewDecision: ReviewDecision;
```

在 `content-validation.ts` 中实现并测试公开边门禁。公开边必须同时满足：

```text
status = published
reviewDecision = approved
evidenceStatus = source_verified
contentNature = source_backed_fact 或经明确批准的 editorial_synthesis
sourceId 非空且可解析到 source theory 的 content sources
locator 非空
verifiedAt 为有效 ISO 日期
reviewerRole 为 ReviewerRole 枚举值
source/target theory 均 published
```

`research_guidance` 不得作为历史谱系事实发布；若保留，只能在页面限定说明中呈现，不进入 genealogy graph。

- [ ] **Step 3：Prisma 纯加法迁移**

新增 nullable/default 字段。运行：

```bash
npx prisma migrate dev --name add_genealogy_review_metadata
```

人工审阅 SQL：只允许 ADD COLUMN/INDEX；不得删除或改名旧字段。迁移后运行 `npx prisma generate`。

- [ ] **Step 4：写入 8 条人工决定**

只能复制人工批准值。没有批准值的边保持 draft/pending/null。不得自动补 source、locator 或日期。

- [ ] **Step 5：同一提交完成 seed 与公开过滤**

所有 genealogy 公开查询使用：

```ts
where: {
  status: "published",
  reviewDecision: "approved",
  evidenceStatus: "source_verified",
  sourceId: { not: null },
  locator: { not: null },
  verifiedAt: { not: null },
  reviewerRole: { not: null },
  sourceTheory: { status: "published" },
  targetTheory: { status: "published" },
}
```

理论页、图谱、internal links 共用 canonical DB relation；停止读取 content JSON 中重复 relationship/description。实体查询层将 `sourceId` 解析到 source theory 的内容来源，并向页面 DTO 输出：

```ts
type PublicGenealogyRelation = {
  id: string;
  sourceTheory: { slug: string; titleEn: string };
  targetTheory: { slug: string; titleEn: string };
  relationType: string;
  descriptionEn: string;
  citation: string;
  url: string;
  locator: string;
  verifiedAt: Date;
  reviewerRole: ReviewerRole;
  contentNature: ContentNature;
};
```

`TheoryArticle`/`SourceBlock` 至少显示 citation、可访问 URL 与 locator，使关系证据对用户可追溯。

- [ ] **Step 6：图谱发布阻断条件**

切换前计算 approved Education genealogy 边数。若为 0，停止并请求用户决定：

```text
A. 暂不切换 canonical 关系；或
B. 接受首页显示真实 empty/unavailable 状态。
```

Codex 不得自行选择。

- [ ] **Step 7：双 seed 和全门禁**

```bash
npm run db:migrate
npm run db:seed
npm run db:seed
npm run typecheck
npm test
npm run lint
npm run content:check
npm run build
node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts
```

- [ ] **Step 8：人工浏览器验收**

桌面与 375px 验收首页图谱、Life Course、Teacher Identity、Structuration。逐项核对关系 ID/type/description 与审核决定一致。

- [ ] **Step 9：显式 staging 和提交**

```text
feat: publish reviewed canonical genealogy relations
```

发布说明必须写：纯加法迁移；旧应用可读取新增 schema，但 status-aware seed 是后续任何正常部署/修复的最低版本；禁止运行旧 revision 的 seed。

---

# 7. P1：只有人工内容输入和用户授权后执行

## Task 14：发布一个 Topic-first 内容试点

**前置：** 用户提供并批准完整 Topic 研究包，含问题边界、primary/supporting/not_recommended、来源、locator 和审核决定。

**Files:**
- Modify: appropriate corpus module
- Modify: `tests/content-validation.test.ts`
- Modify: `tests/seed-integration.test.ts`
- Modify: `tests/information-architecture.test.ts`
- Modify: `tests/seo.test.ts`

- [ ] **Step 1：RED 测试**

断言新 Topic：slug 唯一；三类 pathway 齐全；关联理论均 published；来源和审核资料完整；进入 published topic slugs、sitemap、canonical、Article JSON-LD 和 internal links。

- [ ] **Step 2：只复制已批准研究包内容到 corpus**

不得补写未提供的学术正文。

- [ ] **Step 3：门禁、浏览器验收和独立提交**

```text
feat(content): publish approved <topic-slug> pathway
```

一次只发布一个 Topic；其余候选继续 research/draft。

## Task 15：实现 Copy pathway link

**Files:**
- Create: `src/components/content/CopyPathwayLink.tsx`
- Modify: Topic detail page/component
- Create: `tests/pathway-actions.test.ts`

实现范围：只复制当前公开 canonical URL；不复制研究问题、query string、个人数据。按钮有成功/失败 aria-live 状态；Clipboard API 不可用时显示可选择 URL，不静默失败。

先写组件行为/源码契约测试，再实现。提交：

```text
feat: add privacy-safe pathway link sharing
```

## Task 16：人工 Search Console 基线

用户授权后人工执行：确认 property、提交 sitemap、记录日期和状态。28 天后另行生成真实展示、点击、CTR、查询类型和落地页基线。Codex 不接 analytics SDK，不宣称已获得 28 天数据。

---

# 8. 明确推迟到后续独立计划

以下不属于本计划，不能顺手实现：

1. 独立 ClaimEvidence 数据表；先完成两个 D3 claim audit 试点，再判断是否需要一 claim 多 source/locator 查询。
2. Batch manifest/source register/multi-role workflow；至少发生第二个真实内容批次、出现两个实际审核角色后再立项。
3. 自动 content metrics CLI；先用真实审核数据确认 denominator 和口径。
4. 理论比较内容试点与 Comparison Prisma/SEO 路由；获得一对完整人工审核研究包后先编写独立实施计划。
5. 浏览器本地 Saved Pathways；用户明确授权后先编写包含 storage key/version、serializer、SSR 边界、删除/清空和隐私测试的独立实施计划。
6. Newsletter 后端、邮件服务、Cookie banner。
7. 登录、跨设备同步、支付、订阅权限、AI 框架生成、API。
8. CMS 或图数据库。
9. Psychology 和 Management/OB 公开扩学科。

---

# 9. 最终验证与报告

## Task 17：最终检查

- [ ] **Step 1：只扫描本计划新增/修改文件中的阻塞模式**

从 Playbook 本轮执行记录读取 Task 1 保存的真实 `PLAN_BASE_COMMIT`，然后运行：

```bash
PLAN_BASE_COMMIT=$(grep -oE 'PLAN_BASE_COMMIT=[0-9a-f]{40}' docs/SITE_CONSTRUCTION_PLAYBOOK.md | tail -1 | cut -d= -f2)
if ! printf '%s' "$PLAN_BASE_COMMIT" | grep -Eq '^[0-9a-f]{40}$'; then
  printf '%s\n' 'Missing valid PLAN_BASE_COMMIT in Playbook execution record'
  exit 1
fi
if ! git cat-file -e "${PLAN_BASE_COMMIT}^{commit}"; then
  printf '%s\n' 'PLAN_BASE_COMMIT is not a commit in this repository'
  exit 1
fi
DIFF_FILE=$(mktemp)
if ! git diff --unified=0 "$PLAN_BASE_COMMIT"...HEAD -- \
  '*.ts' '*.tsx' '*.md' '*.prisma' '*.sql' > "$DIFF_FILE"; then
  rm -f "$DIFF_FILE"
  printf '%s\n' 'git diff failed; blocker scan aborted'
  exit 1
fi
BLOCKERS=$(grep '^+' "$DIFF_FILE" | grep -v '^+++' | \
  grep -E 'TODO|TBD|FIXME|test\.(skip|only)|describe\.(skip|only)|it\.(skip|only)' || true)
rm -f "$DIFF_FILE"
if [ -n "$BLOCKERS" ]; then
  printf '%s\n' "$BLOCKERS"
  exit 1
fi
```

命令只检查本计划新增行，因此既有、未修改的 `seed-integration` 条件性 skip 不会误报；任何新增 skip/only/TODO/TBD/FIXME 都使验收失败。

- [ ] **Step 2：完整门禁**

```bash
npm run db:migrate \
  && npm run db:seed \
  && npm run db:seed \
  && npm run typecheck \
  && npm test \
  && npm run lint \
  && npm run content:check \
  && npm run build \
  && node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts
```

- [ ] **Step 3：人工浏览器矩阵**

```text
/
/topics
/search
/privacy
/editorial-policy
/theories/life-course-theory
/theories/teacher-identity-theory
/theories/structuration-theory
```

桌面和 375px：英文、Footer、skip link、CTA、图谱、TOC、关系、证据文案、无横向滚动、无 draft/archived 泄露。

- [ ] **Step 4：最终报告格式**

```text
P0 status:
- completed tasks
- blocked tasks
- commands and exit codes
- browser checks
- genealogy decisions and public edge count

P1 status:
- not started / approved pilot completed
- missing human input

Safety:
- no fabricated academic data
- no Psychology/Management publication
- no analytics SDK/CMS/login/payment/AI
- no push/merge/PR/deploy unless separately authorised
```

# 10. 最终完成定义

P0 只有在以下条件全部满足时才可称完成：

- 旧提示词废止并纳入版本控制；
- 英文首页、导航、Footer、CTA 与可访问性通过；
- 事件字典只定义未采集，Privacy 与实际一致；
- corpus 物理拆分后语义基线不变；
- Education/Sociology 范围门禁生效；
- 所有核心实体状态由 authoring contract 控制；
- 旧 L1/L2/L3 不再被 UI 误解为整页 claim-level verification；
- 两个 D3 claim audit 和 8 条 genealogy audit 包已生成；
- 若人工审核未完成，计划必须停在 Task 12，不能宣称 genealogy hardening 完成；
- 若执行 Task 12，8 条边全部有明确人工决定，canonical 切换为原子发布单元且公开图不发生未授权清空；
- 双 seed、typecheck、test、lint、content check、build、smoke 全绿；
- 没有未经授权的外部操作。

P1 不计入 P0 完成标准。每个 P1 试点必须单独授权、单独审核、单独提交和单独验收。
