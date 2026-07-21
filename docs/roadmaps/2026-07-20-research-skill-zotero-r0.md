# 科研 skill + Zotero 联动 R0：实施计划

> 日期：2026-07-20
> 状态：实施中
> 阶段：P1（内容语料）— 不扩学科、不落库、不改 schema
> 负责人：Claude + 用户
> 关联：`docs/SITE_CONSTRUCTION_PLAYBOOK.md` §4.1/§4.2；`AGENTS.md` 来源规则；`docs/research/2026-07-19-goodson-day-scholar-evidence.md`（格式参照）

## 1. 目标与用户价值

为 Syrtag 建一个可复跑的科研核验 skill：把 OpenAlex/Crossref/ORCID/Google Books/WorldCat 五源检索固化，并接入本地 Zotero 以补 claim-level locator（原文页码定位）。

完成后用户能观察到的变化：
- 拿一个理论/scholar/work 候选，跑一遍 skill 就产出对齐格式的 source register + claim matrix + ContentSource 代码片段；
- evidence pack 里的 locator 列从 `none — web page viewed without a stable locator` 升级到 `pp. 47–52 (citekey, Ch.3)`；
- 全程不动数据库、不改 schema、不破 Education/Sociology 与 published-only 边界。

## 2. 范围

### 包含
- `~/.claude/skills/syrtag-research/SKILL.md`：跨项目可复用 skill 骨架。
- `syntag/docs/research/skill-sop.md`：项目级 SOP，对齐 AGENTS.md 来源规则与 evidence pack 格式。
- Life Course 理论首次试跑：产出 1 份 evidence pack 草稿（不落库），验证流程跑通。

### 不包含
- 不改 Prisma schema；不新增 DB 字段或表。
- 不自动落库或自动改 status 为 published；产物停在 draft，过 `validateSeedCorpus()` 人工把关。
- 不扩公开内容范围（Education/Sociology 不变；Psychology/Management 仍不进公开 static params）。
- 不做实时 Zotero API 集成（Phase 1 非目标；耦合过重）。
- 不引入账户、云存储、SSO。

## 3. 当前证据与决策

- 现状：`docs/research/*.md` 全手工写 source register + claim matrix，格式严谨但不可复跑；几乎每行 locator 为 `none`，L1 停在元数据级。
- 内容合同已就位：`ContentSource`（id/citation/url/source_kind/evidence_level/supports）+ `Verification` 表（entityType/fieldPath/level/verifiedAt）；无需改 schema。
- 决策：Zotero 仅作证据仓 + 导出文件（BibTeX/CSL JSON/注解 JSON）接入，不进 DB、不公开分发原文。
- 决策：科研 skill 产物到 draft为止，人审后入 `src/data/corpus/content-batches/<date>-<slug>.ts`。

## 4. 实施步骤

1. 创建 skill 骨架 — 文件：`~/.claude/skills/syrtag-research/SKILL.md` — 产物：frontmatter + 五源检索流程 + 产物三件套定义 + 红线。
2. 创建项目级 SOP — 文件：`syntag/docs/research/skill-sop.md` — 产物：来源类型映射、evidence pack 格式、locator 规则、ContentSource 片段模板。
3. Life Course 试跑 — 产物：`docs/research/2026-07-20-life-course-evidence-r0.md`（source register + claim matrix，含 Zotero locator 示例）— 不落库。
4. 校验对齐 — 跑 `npm run content:check` 确认现有语料不受影响（本批不新增 batch，应全绿）。

## 5. 数据、内容与安全

- 数据来源：OpenAlex（无 key，带 mailto）、Crossref（mailto）、ORCID（公开 API）、Google Books、WorldCat；走代理 `127.0.0.1:7897`。
- 核验等级：L1 结构化事实（作者/年份/DOI/ISBN/机构）；实质性论断须一手著作/出版社/大学档案；Wikidata 仅发现不单独支撑。
- Zotero：本地个人免费库 + Better BibTeX；citekey 与 `ContentSource.id` 对齐；PDF 仅供内部核验，网站只暴露 citation+URL+页码。
- 数据迁移/seed 影响：无。
- 环境变量/权限：无新增。
- 隐私/版权：PDF 不公开分发；只暴露 citation + URL + 页码引用。

## 6. 验收标准

- 自动化：`npm run content:check` 全绿（本批不新增 batch，回归基线）。
- 产物：1 份 evidence pack 草稿，格式与 `goodson-day-scholar-evidence.md` 对齐；至少 2 条 claim 的 locator 非 none（Zotero 页码）。
- 合同对齐：产出的 ContentSource 片段字段与 `src/data/corpus/content-batches/*.ts` 一致（source_kind 枚举：doi/publisher/university/library/journal/authoritative_web）。
- 边界：无新增 published 实体；无新增公开 static params；Education/Sociology 范围不变。

## 7. 风险、回退与发布判定

- P0 风险：skill 放松来源规则（Wikidata 单独支撑、虚构 DOI/页码）— 通过 SOP 红线与 `content:check` 双重把关。
- P1 风险：Zotero citekey 与 ContentSource.id 不对齐导致追溯断 — 试跑时强制校验 citekey 命名规则。
- 回退：本批纯文件产出，删除 SKILL.md/SOP/evidence 草稿即回退，无 DB/build 影响。
- 发布判定：R0 不触发部署；通过 `content:check` + 产物格式校验即视为 R0 完成。

## 8. 执行记录（实施后填写）

- 实际改动：
  - 新建 `~/.claude/skills/syrtag-research/SKILL.md`（跨项目 skill，五源检索 + 产物三件套 + 红线）。
  - 新建 `syntag/docs/research/skill-sop.md`（项目级 SOP，来源映射 + evidence pack 格式 + locator 规则 + ContentSource 模板）。
  - 新建本立项 `docs/roadmaps/2026-07-20-research-skill-zotero-r0.md`。
  - 新建 Life Course 试跑 `docs/research/2026-07-20-life-course-evidence-r0.md`（含 source register + claim matrix + 拦截错 DOI 记录 + ContentSource 片段 draft，不落库）。
  - 新建 `docs/research/user-research/phd-question-log.md`（用户潜水采集模板，R1 用户侧动作）。
  - 回写 SKILL.md：OpenAlex 免费层每日预算坑、WebFetch 共享 IP 429、二手 DOI 必经 Crossref 核验规则。
- 验证结果：
  - `npm run content:check` 全绿：2 disciplines + 12 theories，基线不受影响。
  - Crossref 走本地代理 `127.0.0.1:7897` HTTP 200，成功核验 Elder 1998 真实 DOI `10.1111/j.1467-8624.1998.tb06128.x`（Child Development 69(1), 1–12）。
  - skill 拦下错 DOI：二手清单误植 `tb06138` 实为 Davies & Cummings 1998（pp. 124–139），未入库。
  - OpenAlex 免费层 429（daily budget 耗尽）；WebFetch 共享 IP 对三个 API 均 429 —— 已回写 skill 注意事项。
- 未完成项与原因：
  - Elder 1974 *Children of the Great Depression* 核验未完成（Google Books API 429）；留 R1/R2 用 WorldCat 或本地 Zotero PDF 补。
  - OpenAlex 本轮未贡献新事实（预算耗尽）；长期策略已在 pack §6 记录：以 Crossref/ORCID/GB/WorldCat 为主。
  - locator 列仍为 `none`（R1 接 Zotero 前无法补页码）。
  - R1/R2/R3 未开始。
- 下一步：
  - R1：本地 Zotero 库 + Better BibTeX + 导出脚本，skill 读导出文件补 locator。
  - R2：用 skill+Zotero 完成 1 个 D3 理论的 claim-level evidence，含非 none locator。
  - R3：人审 → `content-batches` → `content:check` → `db:seed` → `build` 全链路。
  - 用户侧并行：按 `phd-question-log.md` 每周潜水采集博士真实研究问题，转着陆页候选。
