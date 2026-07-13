# Codex Prompt 5/5: Backend API & Data Layer

## Context

你正在为 **Syrtag** 建立完整的后端基础设施。

产品文档：`Syrtag-产品设计文档.md`（请先通读第三章"知识图谱数据模型"、第十一章"技术架构"）
数据库 Schema：`prisma/schema.prisma` 已定义所有表和关系
种子数据：`prisma/seed.ts` 包含完整的种子数据

技术栈：Next.js 15 + Prisma + PostgreSQL (Supabase)

## 你的任务

### 1. 数据库连接与 Prisma Client（`src/lib/db.ts`）

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

- 确保开发环境热重载时不创建多个 Prisma 实例
- 添加连接错误处理（数据库不可用时的优雅降级）

### 2. 图谱数据 API（`src/app/api/graph/route.ts`）

核心端点，为首页图谱 Canvas 提供数据。

**GET /api/graph?discipline=education&mode=genealogy**

请求参数：
- `discipline`（必填）：学科 slug
- `mode`（可选，默认 genealogy）：genealogy | scholars | topics

响应格式：
```json
{
  "nodes": [
    {
      "id": "uuid",
      "type": "theory",       // theory | scholar | concept | work | topic
      "label": "Life Course Theory",
      "depth": "D3",          // D1 | D2 | D3（影响节点大小）
      "discipline": "education",
      "data": {
        "slug": "life-course-theory",
        "summary": "A developmental framework...",
        "scholarCount": 3
      }
    }
  ],
  "edges": [
    {
      "id": "uuid",
      "source": "theory-uuid-1",
      "target": "theory-uuid-2",
      "type": "precursor_of",   // precursor_of | branched_from | extended_by | critiqued_by | integrated_with
      "label": "Theoretical foundation for...",
      "strength": 4
    }
  ],
  "meta": {
    "discipline": "Education",
    "mode": "genealogy",
    "nodeCount": 45,
    "edgeCount": 62
  }
}
```

实现要点：
- 查询指定学科下的所有理论（通过 `discipline_theory` 关联表）
- 查询这些理论之间的所有 `theory_genealogy` 关系（source 和 target 都在该学科中）
- 学者模式下：节点类型改为 scholar，边类型改为 `scholar_scholar`
- 主题模式下：节点为 topic + theory，边为 `topic_theory` 的 suitability
- Cache-Control 头：`public, max-age=86400, stale-while-revalidate=3600`（24h 缓存，因为图谱关系数据变更频率极低）
- 响应大小控制在 50KB 以内（节点数 < 200 时足够）

### 3. 搜索 API（`src/app/api/search/route.ts`）

**GET /api/search?q=teacher+identity&type=all**

请求参数：
- `q`（必填）：搜索关键词
- `type`（可选，默认 all）：all | theory | scholar | work | topic
- `limit`（可选，默认 10）

实现：
- 使用 PostgreSQL `tsvector` + `ts_query` 全文搜索
- 搜索范围：title_en + summary_en + content_jsonb 中的英文纯文本
- 按实体类型分组返回结果
- 响应包含匹配节点 ID（供图谱聚焦使用）

```json
{
  "query": "teacher identity",
  "detectedType": "research_topic",
  "results": {
    "theories": [
      {
        "id": "uuid",
        "slug": "teacher-identity-theory",
        "title": "Teacher Identity Theory",
        "summary": "...",
        "relevance": 0.92,
        "nodeId": "uuid" // 供图谱聚焦
      }
    ],
    "scholars": [...],
    "topics": [...]
  },
  "suggestions": [
    "Try: teacher professional identity theoretical framework",
    "Try: Kelchtermans teacher identity"
  ]
}
```

**全文搜索索引创建**（在 Prisma migration 中）：

```sql
-- 理论搜索索引
ALTER TABLE theories ADD COLUMN search_vector_en tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title_en, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary_en, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content_jsonb::text, '')), 'C')
  ) STORED;

CREATE INDEX theories_search_idx ON theories USING GIN (search_vector_en);

-- 学者、研究主题等同理
```

### 4. 内容实体 CRUD 操作层（`src/lib/entities/`）

创建每个实体类型的数据访问函数：

```
src/lib/entities/theories.ts   — getTheoryBySlug, getTheoriesByDiscipline, getTheoriesByField
src/lib/entities/scholars.ts   — getScholarBySlug, getScholarsByTheory
src/lib/entities/works.ts      — getWorkBySlug, getWorksByTheory
src/lib/entities/topics.ts     — getTopicBySlug, getTopicsByDiscipline, getTheoryComparison
src/lib/entities/concepts.ts   — getConceptBySlug
src/lib/entities/disciplines.ts — getDisciplineBySlug, getAllDisciplines
```

每个函数：
- 包含关联数据（Prisma `include` 优化查询）
- 过滤 `status = 'published'`
- 错误处理（实体不存在时返回 null，由页面层调用 `notFound()`）

### 5. 数据库迁移与种子脚本

**prisma/seed.ts**（完善）：
- 从产品文档定义的种子数据中读取
- 使用 `upsert` 防止重复插入
- 包含完整的关联表数据和 verifications 数据
- 运行：`npx prisma db seed`

**package.json scripts**：
```json
{
  "db:migrate": "npx prisma migrate dev",
  "db:push": "npx prisma db push",
  "db:seed": "npx prisma db seed",
  "db:reset": "npx prisma migrate reset",
  "db:studio": "npx prisma studio"
}
```

### 6. 环境变量管理

**.env.example**：
```
# Database
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/[database]

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Site
NEXT_PUBLIC_SITE_URL=https://syrtag.app
```

### 7. API 错误处理与日志

所有 API 端点统一错误格式：
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Discipline 'xxx' not found"
  }
}
```

错误码：`NOT_FOUND` | `INVALID_PARAM` | `DATABASE_ERROR` | `INTERNAL_ERROR`
- 生产环境不暴露 Prisma 原始错误信息
- API 层统一 try-catch，console.error 记录详细错误（仅服务端）

### 8. 缓存策略

| 数据 | 缓存方式 | TTL | 原因 |
|---|---|---|---|
| 图谱数据 | HTTP Cache-Control 头 | 24h | 理论关系数据变更频率极低 |
| 搜索建议 | React Query + HTTP Cache | 5min | 基于已发布内容，变化少 |
| 实体内容页 | Next.js ISR (revalidate) | 1h | 内容更新后 1 小时内反映 |
| 首页 | Next.js ISR | 10min | 新增内容需要较快反映 |
| Sitemap | 构建时生成 + ISR | 24h | 与新内容发布频率一致 |

### 9. 不要做的事

- 不要引入 Redis（Phase 1 不需要，PostgreSQL + HTTP 缓存足够）
- 不要做图数据库（Neo4j 等——理论谱系用关系型表足够）
- 不要做用户认证系统（Phase 3）
- 不要做文件上传
- 不要做 WebSocket / 实时更新
- 不要做向量搜索或 AI Embedding
- 不要做 Elasticsearch / Meilisearch（PostgreSQL tsvector 足够 Phase 1 用）
- 不要做 GraphQL

## 验证

完成后，确保：
1. `npx prisma generate` 无错误
2. `npx prisma db push` 成功建表
3. `npm run db:seed` 成功插入所有种子数据
4. `npx prisma studio` 可浏览所有表和数据
5. `curl http://localhost:3000/api/graph?discipline=education` 返回有效 JSON（nodes + edges 非空）
6. `curl "http://localhost:3000/api/search?q=life+course"` 返回匹配结果
7. 每个实体数据访问函数能找到种子数据
8. `npm run build` 通过
