# Codex 提示词使用说明

## 2026-08-03 至 2026-08-09：内容治理七窗口

以下七个提示词必须按顺序进入七个独立窗口，不得同时执行：

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
