# Codex Prompt 4/5: Frontend Pages & Routing

## Context

你正在为 **Syntag** 创建所有前端页面和路由。

产品文档：`Syntag-产品设计文档.md`（请先通读第四章"图谱交互模型"、第六章"路由URL"、第十一章"技术架构"）
UI 组件已在 `src/components/` 下就绪
数据模型在 `prisma/schema.prisma` 中定义
SEO 工具在 `src/lib/seo.ts` 中可用

技术栈：Next.js 15 App Router + Server Components + Client Islands

## 你的任务

### 1. 图谱首页（`src/app/page.tsx`）— 最核心页面

这是用户打开网站看到的第一屏，必须是**可交互的知识图谱**，不是搜索框+文章列表。

**页面结构**：
```
┌─ Header ──────────────────────────────────────────┐
│ Logo · 学科筛选 Tab · 模式切换 · 搜索图标  · About │
├────────────────────────────────────────────────────┤
│ ┌─ 左侧边栏(64px) ─┬── 图谱画布(填充剩余) ────────┐ │
│ │ Education        │                              │ │
│ │ Sociology        │   [理论节点]──关系线──[节点]  │ │
│ │ Psychology(灰)   │   缩放 · 拖拽 · 点击         │ │
│ │ Management(灰)   │                              │ │
│ │                  │                              │ │
│ │ [搜索框]         │                              │ │
│ └──────────────────┴──────────┬───────────────────┘ │
│                               │  详情面板(可收起)    │
│                               │  380px               │
└───────────────────────────────┴─────────────────────┘
```

**功能要点**：
- SSR 时预取默认学科（Education）的图谱数据（nodes + edges），注入到客户端组件
- 客户端：React Flow 或 Sigma.js 渲染 Canvas 图谱
- 学科切换：点击 Tab → fetch `/api/graph?discipline=sociology&mode=genealogy` → 图谱平滑过渡到新数据
- 模式切换：谱系模式 / 学者模式 / 主题模式 → 同一 API 端点的 `mode` 参数，返回不同节点类型和边类型
- 搜索：输入关键词 → 调用 `/api/search?q=...` → 返回匹配节点 ID → 图谱聚焦动画移动到匹配节点 + 高亮
- URL 同步：图谱状态变化写入 URL query params（`?discipline=education&mode=genealogy&focus=life-course-theory`），但不要每个拖拽都 push history
- 性能：图谱数据进入 React Query 缓存（staleTime: 24h），不重复请求

### 2. 理论深度页（`src/app/theories/[slug]/page.tsx`）

Server Component + ISR（revalidate: 3600）。页面结构按产品文档 3.5 节 content_jsonb 区块：

```
┌─ Breadcrumbs: Home > Discipline > Field > Theory ────┐
├───────────────────────────────────────────────────────┤
│ TITLE + Subtitle                                      │
│ Meta: reading time / depth / verification status      │
├───────────────────────────────────────────────────────┤
│ Quick Summary（content_jsonb.en.what_is_it）           │
├───────────────────────────────────────────────────────┤
│ [AD: in-article]                                      │
├───────────────────────────────────────────────────────┤
│ 1. Origins & Intellectual History                     │
│ 2. Core Concepts（concept definitions with linked     │
│    concept pages）                                    │
│ 3. Theoretical Genealogy（SVG relation map + links）   │
│ 4. Suitable Research Topics                           │
│ 5. When NOT to Use                                    │
│ 6. Common Misapplications                             │
├───────────────────────────────────────────────────────┤
│ [AD: in-article]                                      │
├───────────────────────────────────────────────────────┤
│ 7. Translating to Analysis Dimensions（concept→       │
│    dimension→indicator table）                        │
│ 8. Data Collection Guidance                           │
│ 9. Suggested Chapter Structure                        │
│ 10. Writing the Theoretical Fit Section               │
│ 11. Related Theories（linked cards）                   │
├───────────────────────────────────────────────────────┤
│ [AD: bottom]                                          │
├───────────────────────────────────────────────────────┤
│ Sources & Verification（SourceBlock + Verification    │
│   Badge per source）                                  │
│ Related Articles / Scholars / Works（3-5 links each）  │
│ Disclaimer                                            │
└───────────────────────────────────────────────────────┘
```

**数据处理**：
```typescript
// page.tsx
export async function generateStaticParams() {
  // 预渲染所有已发布的理论页
  const theories = await db.theory.findMany({ where: { status: 'published' } })
  return theories.map(t => ({ slug: t.slug }))
}

export const revalidate = 3600 // ISR: 1小时
```

### 3. 其他实体页面

按照相同模式创建（Server Component + ISR + breadcrumbs + ad slots）：

- `src/app/scholars/[slug]/page.tsx` — 学者页（按产品文档学者信息架构）
- `src/app/works/[slug]/page.tsx` — 原典页（按产品文档原典信息架构）
- `src/app/topics/[slug]/page.tsx` — 研究主题页（**含理论适配比较表**——这是 SEO 护城河）
- `src/app/concepts/[slug]/page.tsx` — 概念页
- `src/app/disciplines/[slug]/page.tsx` — 学科页
- `src/app/fields/[slug]/page.tsx` — 研究方向页

### 4. 搜索结果嵌入（图谱首页内 + 独立搜索结果页）

**图谱首页内搜索**（GraphCanvas 组件的一部分）：
- 输入即搜（debounce 300ms）
- 结果不是文章列表，而是**高亮匹配节点 + 相机平滑移动到节点**
- 搜索无结果时：提示"No matching theories found. Try a different keyword."

**独立搜索结果页** (`src/app/search/page.tsx`) — 为 SEO 准备：
- 读取 `?q=` query param
- 显示搜索结果：
  - 匹配的理论（标题 + 摘要 + 链接）
  - 匹配的学者（姓名 + 核心贡献 + 链接）
  - 匹配的研究主题（问题 + 推荐理论数 + 链接）
- 分组显示，每组最多 5 条
- 无结果时显示搜索建议

### 5. 静态法律页面

- `src/app/about/page.tsx`
- `src/app/editorial-policy/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`
- `src/app/framework-builder/page.tsx`（Phase 1 静态说明页）

### 6. 客户端交互组件

**SearchBox.tsx** (`src/components/search/`)：
- 'use client' 组件
- 嵌入 Header 中
- Focus 时展开搜索浮层（深色背景 + 玻璃卡片）
- 输入 debounce 300ms → 调用搜索 API → 渲染建议列表
- 按 Enter 跳转 `/search?q=...` 或触发图谱聚焦

**TheoryPathway.tsx** (`src/components/search/`)：
- 搜索结果页的理论路径卡片
- 展示：搜索意图类型（Research Topic / Theory Name / Scholar Name）→ 路径可视化 → 相关实体

**ClientAdSlot.tsx** (`src/components/common/`)：
- 'use client' 组件，用于在客户端动态加载 AdSense 脚本
- Phase 1 先渲染占位 div（id 预留），不加载真实广告脚本
- Phase 1 完成后切换到真实 AdSense

### 7. 移动端适配

- < 768px：图谱全宽，左侧学科筛选栏收缩为顶部横滑 Tab
- 详情面板从右侧滑出变成底部抽屉（占 60% 屏幕高度）
- 节点触控区域 ≥ 44px（手指可点）
- 理论适配比较表：< 600px 时从横表转为垂直卡片堆叠（每行一个理论）
- 正文内容最大宽度 720px，移动端 100%

### 8. 错误与状态处理

每个页面必须处理：
- **Loading**：Next.js 自动 `loading.tsx`（骨架屏）
- **Empty**：实体不存在 → `notFound()` → Next.js 404 页面
- **Error**：`error.tsx` → 显示错误信息 + 重试按钮
- **图谱无数据**：显示空状态提示，不白屏

### 9. 不要做的事

- 不要做用户登录/注册页面（Phase 3）
- 不要做框架生成器交互工具（Phase 2）
- 不要做评论系统
- 不要做中文字段渲染（Phase 1 只显示 en 字段）
- 不要做亮色主题
- 不要用 `'use client'` 标记内容页（保持 Server Component 以获得最佳 SEO）

## 验证

完成后，确保：
1. `npm run build` 成功，无 TypeScript 错误
2. `npm run dev` → 首页可访问，图谱渲染（Mock 数据或种子数据）
3. 每个 slug 页面可访问（`/theories/life-course-theory` 等）
4. 每个页面有 title、description、canonical、OG meta
5. 移动端 375px 所有页面无横向滚动
6. 内部链接无死链
7. 广告位存在但不遮挡正文
