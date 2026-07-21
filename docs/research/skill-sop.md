# 科研核验 SOP（Syrtag 项目级）

> 版本：v1.0
> 日期：2026-07-20
> 配套 skill：`~/.claude/skills/syrtag-research/SKILL.md`
> 依据：`AGENTS.md` §Content Sources and Citation Rules；`docs/SITE_CONSTRUCTION_PLAYBOOK.md` §4.1/§4.2

本 SOP 是 skill 在 Syrtag 内执行时的项目级规则。skill 提供流程，本文件提供格式合同、来源映射和 boundary 规则。两者冲突时以本文件和 `AGENTS.md` 为准。

## 1. 来源规则三件套

每条要进 `seed-content.ts` 的实体内容，必须同时具备：

1. **source register**：来源登记表，逐条列出 citation/URL/source type/directly supports/does not support/accessed date。
2. **claim matrix**：主张矩阵，每条主张标 L1/L2/L3、field path、source ID、locator、forbidden extension。
3. **ContentSource 片段**：TypeScript 代码，字段对齐 `src/data/corpus/shared/entities.ts` 中的 `ContentSource` 类型。

三者必须互相可追溯：claim matrix 的 source ID 出现在 source register；ContentSource 的 `supports` 镜像 register 的 directly supports。

## 2. retrieval 源 vs persisted source_kind 映射

OpenAlex / Crossref / ORCID 是检索与核验渠道，不直接作为 `source_kind` 落库。落库类型映射到其指向的权威记录：

| 检索渠道 | 核验什么 | 落库 `source_kind` | 最终 URL 指向 |
| --- | --- | --- | --- |
| Crossref DOI | DOI 元数据、作者、年份、卷期页 | `doi` | `https://doi.org/<doi>` |
| OpenAlex 作者页 | 机构、引用关系、works 列表 | `university` / `publisher` / `journal`（看落点） | 作者大学页或出版社页 |
| ORCID | 身份、就职、教育 | `university` | 大学 staff page |
| Google Books | 书目、ISBN、编者/作者角色 | `authoritative_web` | Google Books 记录页 |
| WorldCat/OCLC | 馆藏、书目 | `library` | WorldCat 记录页 |
| 出版社页面 | 出版信息、版次 | `publisher` | 出版社图书页 |
| 政府/学会页面 | 官方报告、profile | `authoritative_web` | 官方页面 |

**规则**：一个 source 的 `url` 最终指向一手权威记录，不是 OpenAlex/Crossref 的 API 页。OpenAlex/Crossref 的用途写在 evidence pack 的 accessed date 注释里，不进 `source_kind`。

## 3. evidence pack 格式（精确表结构）

参照 `docs/research/2026-07-19-goodson-day-scholar-evidence.md`。每份 pack 含：

- 头部：access date、decision（draft-only / approved-for-publish）、publication boundary（不可渲染为公开页、不可入索引/sitemap/图谱，直到 status=published）。
- source register 表（7 列：source ID / citation / URL / source type / directly supports / does not support / accessed date）。
- claim matrix 表（6 列：claim ID / field path / safe wording / L1/L2/L3 / source ID / locator if available / forbidden extension）。
- attribution boundaries 段：逐条点明时间边界、编辑性 vs 来源性、不可压缩关系。

## 4. locator 规则（Zotero 对齐）

evidence pack 当前痛点：locator 列几乎全是 `none — web page viewed without a stable numbered section`。Zotero 注解升级路径：

- Zotero collection 命名：`theories/<slug>`（如 `theories/life-course-theory`）。
- Better BibTeX citekey 规则：BBT 默认 camelCase（如 `elderLifeCourseDevelopmental1998`），**不改 BBT 全局规则**（改规则需重启 Zotero 且影响全部条目，得不偿失）。
- **citekey 与 `ContentSource.id` 不强求同形**：
  - `ContentSource.id` 用 kebab slug：`<first-author-surname>-<year>-<kebab-title>`（如 `elder-1998-the-life-course-as-developmental-theory`）。
  - BBT citekey 用 BBT 默认 camelCase。
  - 两者通过 source register 表的 `bbt citekey` 列显式映射，一一对应。导出脚本（`scripts/zotero-export.ts`）自动产出这层映射。
- locator 写法：`pp. 47–52 (elderLifeCourseDevelopmental1998, Ch.3)`，或 `§3.2 (citekey)`、`Table 2 (citekey)`。
- 无原文页码仍用 `none — <具体原因>`，不编造页码。
- PDF 不上传、不分发；网站只暴露 citation + URL + 页码引用。
- locator 的 PDF 注解数据来源：Zotero 本地 API `/api/users/0/items?itemType=annotation`，关联到父条目 key（R2 落地）。

## 5. ContentSource 片段模板

```typescript
import type { ContentSource } from "../../templates/theory-template.ts";

const <sourceId>: ContentSource = {
  id: "<sourceId>",
  citation: "Author, A., & Author, B. (Year). Title. Publisher.",  // APA
  url: "https://doi.org/10.xxxx/yyyy",
  source_kind: "doi",              // doi | publisher | university | library | journal | authoritative_web
  evidence_level: "L1",            // L1 | L2 | L3
  supports: [
    "fact this source directly establishes",
    "another fact",
  ],
};
```

**字段约束**：
- `id`：slug 风格，与 Zotero citekey 对齐；全 corpus 内唯一。
- `source_kind`：只能是合同定义的 6 类；OpenAlex/Crossref/ORCID 不在此列。
- `evidence_level`：`L1` 需 DOI/publisher/university/primary 级支撑；`L2` 编辑综合；`L3` 待核验/研究建议。
- `supports`：每条对应 claim matrix 中一条 L1 claim 的 safe wording 的事实部分。

## 6. 落库流程（R0 不执行，仅约定）

1. evidence pack 人审定 L1/L2/L3。
2. ContentSource 片段入 `src/data/corpus/content-batches/<date>-<slug>.ts`。
3. `npm run content:check` 全绿。
4. `npm run db:seed`（幂等 upsert）。
5. `npm run build`；published-only static params 与 sitemap 自动只含 `status=published` 实体。

R0 只到步骤 1，不进步骤 2。

## 7. 红线（与 skill 红线一致，项目级强调）

- 不虚构 DOI/ISBN/页码/作者/机构/URL。
- Wikidata/通用百科仅发现与交叉校验，不单独支撑实质论断。
- OpenAlex/Crossref/ORCID 验结构化事实，不验解释性论断；解释性论断须一手著作/出版社/大学档案。
- 无法核验则降级或删除精确断言，`pending` 由 `status: "draft"` + verification notes 承载。
- PDF 不公开；只暴露 citation + URL + 页码。
- 不破 published-only 与 Education/Sociology 边界；Psychology/Management 不进公开 static params。

## 8. 触发命令

用户输入 `/syrtag-research` 或在对话中说"核验理论/scholar/work 来源"时，读取 `~/.claude/skills/syrtag-research/SKILL.md` + 本 SOP 执行。
