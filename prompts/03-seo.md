# Codex Prompt 3/5: SEO & Structured Data

## Context

你正在为 **Syrtag** 建立完整的 SEO 基础设施。

产品文档：`Syrtag-产品设计文档.md`（请先通读第六章"页面路由与URL结构"和第七章"内容质量标准"）
技术栈：Next.js 15 App Router，内容通过 Server Components + ISR 渲染
受众：全球英文硕博生，Google 搜索为主（Phase 1 不做百度）

## 你的任务

### 1. SEO 工具库（`src/lib/seo.ts`）

创建统一的 SEO 元数据生成工具：

```typescript
// 每类页面一个 metadata 生成函数
generateTheoryMeta(theory: Theory) → Metadata
generateScholarMeta(scholar: Scholar) → Metadata
generateWorkMeta(work: Work) → Metadata
generateTopicMeta(topic: Topic) → Metadata
generateDisciplineMeta(discipline: Discipline) → Metadata
generateFieldMeta(field: Field) → Metadata
generateHomeMeta() → Metadata
```

每个函数必须生成：
- **title**：实体名称 + 核心关键词（如 `Life Course Theory — Theoretical Framework Guide | Syrtag`）
- **description**：150-160 字符，包含核心关键词的自然语句，不要 keyword stuffing
- **canonical URL**：`https://syrtag.app/theories/life-course-theory`
- **Open Graph**：`og:title`, `og:description`, `og:image`（生成 OG 图片 URL，尺寸 1200×630）
- **Twitter Card**：`twitter:card = 'summary_large_image'`
- **robots**：`index, follow`（默认），`noindex` 用于后台/框架生成器等页面

### 2. JSON-LD 结构化数据（`src/components/seo/`）

为每种页面类型创建 JSON-LD 组件：

**JsonLdArticle.tsx** — 用于理论页、研究主题页
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "author": { "@type": "Organization", "name": "Syrtag" },
  "datePublished": "2026-07-...",
  "dateModified": "2026-07-...",
  "publisher": { "@type": "Organization", "name": "Syrtag" }
}
```

**JsonLdBreadcrumb.tsx** — 面包屑
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://syrtag.app" },
    ...
  ]
}
```

**JsonLdGraph.tsx** — 图谱首页
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Syrtag — Research Theory Knowledge Graph",
  "description": "...",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [...]
  }
}
```

**JsonLdPerson.tsx** — 学者页
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Glen H. Elder Jr.",
  "description": "...",
  "sameAs": ["https://...university page"]
}
```

**JsonLdBook.tsx** — 原典页
```json
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "...",
  "author": "...",
  "isbn": "...",
  "publisher": "..."
}
```

### 3. Sitemap 与 Robots

**sitemap.ts** (`src/app/sitemap.ts`)：
- 使用 Next.js 内置 `sitemap` 导出
- 包含所有已发布的实体页面（status = 'published'）
- 每个 URL 带 `<lastmod>`、`<changefreq>`（理论页 monthly、法律页 yearly）
- 默认 priority：首页 1.0、学科 0.8、理论/主题 0.7、学者/原典 0.6、法律页 0.3

**robots.ts** (`src/app/robots.ts`)：
- 使用 Next.js 内置 `robots` 导出
- 允许所有爬虫
- Sitemap 指向 `https://syrtag.app/sitemap.xml`
- 禁止 `/api/` 路径

### 4. 内链策略实现（`src/lib/internal-links.ts`）

创建一个工具函数，给定一个实体，返回它应链接到的所有相关实体：

```typescript
getInternalLinks(entityType, entitySlug) → { label, href, reason }[]
```

规则：
- 理论页 → 至少引用 3 位关联学者 + 2 个关联理论 + 1-2 个关联研究主题
- 学者页 → 引用他贡献的所有理论 + 学术传承关系中的其他学者
- 研究主题页 → 引用推荐的所有理论（primary + supporting）
- 原典页 → 引用作者 + 关联的理论

### 5. 图片 Alt 文本与无障碍

- 所有图片必须有 `alt` 属性
- 学者照片 alt："Portrait of [Scholar Name], [academic title]"
- 图谱 SVG/Canvas：提供 `aria-label` 和屏幕阅读器可访问的文本描述
- 焦点态可见（`:focus-visible` 轮廓）

### 6. 性能 SEO（Core Web Vitals）

- 所有字体使用 `next/font` 本地加载（已完成）
- 图片使用 `next/image`（如引入）
- 图谱 Canvas 组件用 `dynamic(() => import(...), { ssr: false })` 延迟加载
- ISR revalidate 时间：内容页 3600s（1小时），首页 600s（10分钟）

### 7. 不要做的事

- 不做百度 SEO（Phase 1 只有 Google）
- 不做中文 SEO 关键词（Phase 1 英文版）
- 不搞 keyword stuffing 或隐藏文字
- 不伪造结构化数据（如虚构评分、虚构作者）
- 不做链接农场式内链（不求内链数量，求内链质量）

## 验证

完成后，确保：
1. `npm run build` 通过
2. 每个内容页在浏览器中查看源代码，确认 `<title>`、`<meta name="description">`、`<link rel="canonical">`、`<meta property="og:title">` 均存在且非空
3. sitemap.xml 可访问且包含所有 published 页面
4. robots.txt 可访问且指向 sitemap
5. Google Rich Results Test 验证 JSON-LD 结构无错误
6. 移动端 Core Web Vitals：LCP < 2.5s
