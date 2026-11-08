# Codex 提示词使用说明

## 当前执行入口（2026-11-08）：内容优化下一阶段

图谱后置。先按下列窗口执行；总计划：

```text
docs/roadmaps/2026-11-08-content-optimization-and-next-phase.md
```

```text
W1  prompts/16-w1-f0-human-review.md
W2  prompts/17-w2-f0-unarchive-allowlist.md
W3  prompts/18-w3-published-surface-honesty.md
W4  prompts/19-w4-f1-life-course-concepts.md
W5  prompts/20-w5-teacher-identity-abstract-narrowing.md
W6  prompts/21-w6-phase-closeout.md
```

执行规则：

- 每个窗口先读 `AGENTS.md`、`CLAUDE.md`、总计划和两份内容标准。
- W1 必须获得真人逐条决定；Agent 不得代审、不得解档。
- W2 没有 W1 的书面 U3 授权就必须停止。
- W1 阻塞时：停止 W2/W3；W4/W5 仍可做收窄（保持 archived）。
- W4 与 W5 默认可与 W1 并行，但不得抢先 published。
- W6 只选择一个下一包，不执行该包。
- 研究、人审、corpus 实施、本地验证、commit、deployment 分开报告。
- 本阶段不申请 AdSense、不换图谱库、不扩 Psychology/Management、不解档整科。

写作与更新规范：

```text
docs/standards/content-writing-standard.md
docs/standards/content-update-standard.md
```

## 2026-08-03 至 2026-08-09：内容治理七窗口（历史）

以下七个提示词已完成其规划周期，**不再作为当前入口**。需要对照旧 claim ledger 时只读查阅，且仍须按原顺序理解依赖：

```text
Day 1  prompts/09-day1-p0-source-risk-hardening-closure.md
Day 2  prompts/10-day2-life-course-claim-ledger.md
Day 3  prompts/11-day3-teacher-identity-claim-ledger.md
Day 4  prompts/12-day4-d3-human-review.md
Day 5  prompts/13-day5-genealogy-relation-audit.md
Day 6  prompts/14-day6-topic-research-guidance-human-review.md
Day 7  prompts/15-day7-weekly-closeout-next-package.md
```

执行规则：

- 每个窗口先读取 `AGENTS.md`、七天总计划和两份内容标准。
- 每个窗口内部使用多个只读子 Agent；主 Agent 是唯一写入者。
- Day 4 和 Day 6 必须获得真实审核者的逐条决定，Agent 不得代审。
- 前一窗口 blocked 时，后一窗口只在其前置条件不受影响时继续；否则停止。
- 研究、人工审核、corpus 实施、本地验证、commit 和 deployment 分开报告。
- Day 7 只选择一个下一包，不执行该包。

总计划：

```text
docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md
```

写作与更新规范：

```text
docs/standards/content-writing-standard.md
docs/standards/content-update-standard.md
```

## 初始建站提示词执行顺序

提示词按依赖关系排列，建议按以下顺序提交给 Codex：

```
1. 05-backend.md        ← 数据库 + API（基础层，其他层依赖它）
2. 02-content-writing.md ← 种子数据（依赖 Prisma Schema，API 就绪后填充）
3. 01-ui-design.md       ← 组件库（后端就绪后建立组件）
4. 04-frontend.md        ← 页面与路由（依赖 UI 组件 + 后端 API）
5. 03-seo.md             ← SEO 优化（依赖前端页面就绪）
```

## 每个提示词执行前

Codex 需要能访问以下文件：

- `Syrtag-产品设计文档.md`（项目根目录）— 产品总纲
- `prisma/schema.prisma` — 数据模型
- `src/app/globals.css` — 设计令牌
- 对应提示词的 `prompts/0X-xxx.md`

## 每个提示词执行后

验证标准在每个提示词末尾的"验证"章节。关键验证：

1. `npm run build` 必须通过
2. 移动端 375px 无横向滚动
3. 所有页面可访问、无死链

## 已就绪的脚手架

- Next.js 15（App Router + TypeScript + Tailwind CSS）
- Prisma Schema（定义在 `prisma/schema.prisma`）
- 设计令牌（定义在 `src/app/globals.css`）
- Layout 组件骨架（`src/app/layout.tsx`）
- 目录结构（`src/components/`、`src/lib/`、`src/data/`）
