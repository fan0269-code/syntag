# Codex Prompt 2/5: Content Writing System

## Context

你正在为 **Syntag** 建立内容创作模板和第一批种子数据。

产品文档：`Syntag-产品设计文档.md`（请先通读第七、八、九、十章）
数据库 Schema：`prisma/schema.prisma` 已定义所有表和字段
内容存储在 PostgreSQL，长文内容以结构化 JSONB 字段（`content_jsonb`）存储

## 你的任务

### 1. 创建内容模板文件（`src/data/templates/`）

为每种内容类型创建一个 TypeScript 模板常量，定义 `content_jsonb` 的完整结构：

**theory-template.ts**
- `content_jsonb` 的 TypeScript 接口定义
- 包含 D1/D2/D3 三级深度的字段要求
- 一个完整的示例（Life Course Theory, D2 级别）

**scholar-template.ts**
- 学者页 content_jsonb 结构
- 学术身份 / 核心贡献 / 阅读路径 / 研究适配

**work-template.ts**
- 原典页 content_jsonb 结构
- 核心问题 / 内容导读 / 关键章节 / 合法获取方式

**topic-template.ts**
- 研究主题页 content_jsonb 结构
- 理论适配比较表 / 推荐主理论 / 章节结构建议

### 2. 创建种子数据文件（`prisma/seed.ts`）

按产品文档第九章"第一批内容清单"创建种子数据。要求：

**数据量**：
- 2 个学科（Education, Sociology）
- 6 个研究方向（按产品文档 9.3 节）
- 12 个理论（按产品文档 9.4 节，含 D3×2 + D2×4 + D1×6）
- 12 位学者（按产品文档 9.5 节）
- 12 部原典（按产品文档 9.6 节）
- 10 个研究主题（按产品文档 9.7 节）
- 所有理论之间的谱系关系（按产品文档第十章预定义）
- 所有关联表数据（theory_scholar, theory_work, theory_concept, topic_theory 等）

**数据要求**：

每篇理论页的 `content_jsonb` 必须包含以下区块（英文）：

```
what_is_it        — 2-3段，说清理论定位和核心主张（不用术语，面向初入门的博士生）
origins           — 提出学者 + 年份 + 学科背景 + 关键著作
core_concepts     — 3-7个概念，每个 {term, definition}（定义引用原典）
genealogy         — 前置/后继/平行/对立理论的关系说明
applicable_topics — 至少3个研究场景 + 原因
inapplicable_topics — 至少2个明确反例 + 原因
misuse_risks      — 至少2个典型错误用法
analysis_dimensions — 概念→维度→指标的三级转化表 [{concept, dimension, indicator}]
data_collection   — 资料收集建议
chapter_structure — 按论文章节结构的框架建议
fit_writing       — 2-3段"理论适切性"标准写法模板
```

深度等级要求：
- D3（Life Course Theory, Teacher Identity Theory）：全部区块，8000+ 词
- D2（4个核心理论）：全部区块，4000-6000 词
- D1（6个基础理论）：前7个区块，2000-3000 词

**数据质量标准**（对应产品文档第七章"五有标准"）：

- **有谱系**：每个理论的 `genealogy` 区块必须具体写明前置/后继理论关系，不能用"该理论属于XX学派"糊弄
- **有适配**：必须写"适合"和"不适合"两部分，不能只说"适用于教育研究"
- **有路径**：`origins` 和 `data_collection` 中必须推荐阅读顺序
- **有转化**：`analysis_dimensions` 中概念→维度→指标不能只列概念名
- **有来源**：每个事实声明（学者生平、出版信息、DOI）在底部 `sources` 字段中标注

**内容风格要求**：

- 英文写作，面向国际硕博生
- 学术但不过度学究化——解释概念时"先通俗后学术"
- 不要写"这个理论可以用于各种研究"这类泛化表述
- 具体的 > 抽象的，可操作的 > 概念化的
- 不使用中文（学者名和理论名保留原名）
- 严禁伪造数据：补贴金额、能源价格、政策数字一律不写；涉及具体费用/政策的声明加"Check official sources"提醒

**核验标注**：

每个种子的 `verifications` 表数据须标注：
- 学者生平/L1 出版信息 → L1_verified（附 DOI 或大学官方页面 URL）
- 理论解释/适用场景 → L2_reviewed
- 章节结构建议/导师质疑回应 → L3_pending

### 3. 创建内容工具函数（`src/lib/content.ts`）

- `getContentBlock(entityType, entitySlug, blockName, lang)` — 从 content_jsonb 提取指定区块
- `getContentBlocks(entityType, entitySlug, lang)` — 返回所有区块列表（用于渲染页面）
- `getTheoryWithRelations(slug)` — 返回理论 + 关联的学者/原典/概念/前后置理论

### 4. 不要做的事

- 不要空页面——每个实体都必须有完整 content_jsonb
- 不要伪造 DOI 或出版信息
- 不要写中文内容（Phase 1 英文版）
- 不要提供盗版下载链接（原典页只给合法获取方式）
- 不要用 AI 生成内容直接作为 L1 核验数据——学者生平/DOI/出版信息必须查真实来源

## 验证

完成后，确保：
1. `npx ts-node prisma/seed.ts` 可以成功插入所有种子数据
2. 每篇理论页的 content_jsonb 有 7+ 区块
3. 随机抽查 3 篇理论页，逐项检查五有标准
4. 所有 theory_genealogy 边有对应的 description_en（不能空）
5. 核验表有对应数据
