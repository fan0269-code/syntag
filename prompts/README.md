# Codex 提示词使用说明

## 执行顺序

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

- `Syntag-产品设计文档.md`（项目根目录）— 产品总纲
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
