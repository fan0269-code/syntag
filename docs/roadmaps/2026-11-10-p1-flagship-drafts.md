# P1 flagship drafts #1–#8：实施计划

> 日期：2026-11-10
> 状态：草稿已写入语料；未发布，未 seed
> 阶段：P1 内容语料
> 负责人：Cloud Agent
> 关联：缺口表 2026-11-08 §C #1–#8；来源清单 2026-11-10 复核

## 1. 目标与用户价值
- 为教育与社会学读者准备八条可核验的旗舰实体草稿，每条都能离开图谱独立阅读。
- 本轮完成后，语料里有草稿、来源和核验日。公开目录仍为空，直到人工审核另行授权发布。

## 2. 范围
### 包含
- Teacher professional identity、Douwe Beijaard、Reconsidering research on teachers' professional identity (2004)。
- Communities of practice、Situated learning / legitimate peripheral participation、Etienne Wenger。
- Life course perspective、Glen H. Elder, Jr.
- 这些记录的 claim ledger、来源 URL 与 2026-11-10 核验日。
### 不包含
- #9 Multiple streams / agenda-setting。
- Jean Lave 旗舰学者页。
- 把任何记录改为 `published`，或运行 seed / db reset。
- P0 信任文案、About 槽位、广告、部署、环境变量、Postgres。

## 3. 当前证据与决策
- 现象：公开 `published` 为 0；FAN-247 已把旧的同名实体归档。
- 决策：新草稿使用不在 FAN-247 名单里的 slug，状态固定 `draft`，因此不会把旧档重新公开。
- 不能假设：ScienceDirect / Springer HTML 是开放全文；Pallas 章有独立的 Crossref 日期；1974 年印刷本的出版社名称出现在本次打开的页面上。

## 4. 实施步骤
1. 按 2026-11-10 清单打开主源，只改写可见书目和论断，不粘贴摘要。
2. 写入 `src/data/corpus/content-batches/2026-11-10-p1-flagship-drafts.ts`，并接到 `seedCorpus`，状态为 draft。
3. 用 `content:check` 和针对性测试确认公开计数仍为 0，且 #9 不存在。

## 5. 数据、内容与安全
- 数据来源：来源清单中的 DOI、Crossref、Leiden handle、TU/e、ORCID、Cambridge Aspire、Routledge、Springer、UNC、CPC、OpenAlex 发现层。
- 数据迁移/seed 影响：无。本轮不 seed。
- 环境变量/权限需求：无。
- 版权：摘要为 paraphrase。仓库 PDF 只用于核验，不稳定下载链接不作公开 URL。

## 6. 验收标准
- 自动化：`npm run content:check` 与 `tests/p1-flagship-drafts.test.ts` 通过。
- 数据：八条记录均为 draft；`published` 实体数仍为 0。
- 链接/SEO：草稿不进入 published static params。公开页行为不变，故本轮不做浏览器内容抽检。

## 7. 风险、回退与发布判定
- P1：人审前不得把草稿说成已发布。
- 回退：删除该 batch 的接入即可。
- 发布判定：本 PR 不是发布，也不是广告申请。
