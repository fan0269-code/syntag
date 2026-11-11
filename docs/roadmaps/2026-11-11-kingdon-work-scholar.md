# Kingdon 著作页与学者页：实施计划

> 日期：2026-11-11  
> 状态：已完成  
> 阶段：P1  
> 负责人：Cursor cloud agent  
> 关联：林文 2026-11-11 17:07（Asia/Shanghai）批准的写稿简报；来源清单 2026-11-11；双站统一审核标准 ST1–ST6；PR #29 低 2

## 1. 目标与用户价值
- 让多源流簇在理论页之外有可核对的书目页和作者页。
- 读者能把 1984 初版年与后来的版本层分开，并能从理论页走到新 slug，而看不到草稿学者。

## 2. 范围
### 包含
- 理论 `multiple-streams-education-policy` 的一处机制转述，贴近 EPAA `/article/view/771` 摘要的 “may depend”。
- 新著作 slug `kingdon-agendas-alternatives-and-public-policies`，语料状态 `published`。
- 新学者 slug `john-w-kingdon-flagship`，语料状态 `published`。
- 理论—著作、理论—学者关系，以及三类索引导语仍按渲染时的 published 查询命名。
### 不包含
- 其余 12 条已发表实体的改写、图谱节点、解档、广告、生产库导入、seed、`db:reset`。
- 草稿 `john-w-kingdon` 的解档、改名或公开链接。
- VisaLang。

## 3. 当前证据与决策
- 现象/复现路径：理论页 `explanatory_mechanisms` 写国家模型不能不变地迁到州，比 EPAA 摘要的 “may depend” 更满。
- 根因或待确认假设：转述把条件句写成了已裁定的迁移失败。
- 需要用户确认的决策：无。范围已于 2026-11-11 17:07 批准，新页按 PR #29 的方式在语料中标 `published`。
- 不能假设的事实或外部依赖：Pearson 目录不是全书，也不是教育专论；U-M LSA 页本环境 curl 为 403，以 WebFetch 打开为准；1984 出版社未单选；无书 DOI；OpenAlex 只用 `A5063257234`；无 ORCID。

## 4. 实施步骤
1. 收紧 #9 一句并补账本行 — 文件：`src/data/corpus/content-batches/2026-11-11-cluster-deepening.ts` — 产物：条件句贴近摘要，其余账本不动。
2. 写入著作与学者 — 同一文件 — 产物：新 slug 为 published，草稿学者仍为 draft。
3. 更新计数测试与基线 — 文件：`tests/`、`docs/SITE_CONSTRUCTION_PLAYBOOK.md` — 产物：导入计划计数含新页，导语不写生产已上线。

## 5. 数据、内容与安全
- 数据来源与核验等级：Pearson 目录 curl 200；EPAA `/771` 与 DOI curl 200；UM Press curl 200；LSA 书目页与教员页 WebFetch 打开、curl 403；OpenAlex `A5063257234` API 200。核验日 2026-11-11。L1 / L2 / L3 分开。
- 数据迁移/seed 影响：无。不写数据库。
- 环境变量/权限需求：无。
- 隐私、版权或法律影响：转述，不粘贴目录或院系介绍。不入库价格。广告保持关闭。

## 6. 验收标准
- 自动化：`npm run content:check`、相关 `node:test` 文件、`npm test`、`npm run lint`、`npm run typecheck`。
- 浏览器：本批是语料，不改页面模板。未导入前生产构建不会出现新实体页。
- 数据：著作年 1984；学者 OpenAlex ID `A5063257234`；草稿 `john-w-kingdon` 仍为 draft；无 DOI、无 ORCID。
- 链接/SEO：理论页可指向新 slug；不得指向草稿 slug；不得使用 `/article/view/757` 作为源 URL。

## 7. 风险、回退与发布判定
- P0/P1 风险：把 2013–2014 目录层写成创生年，或把草稿学者链进公开页。
- 回退方式：撤回本分支的语料提交。不需要数据库回滚，因为本批不写库。
- 发布结论条件：语料入库不等于现网上线。导入与现网复测须另经授权。不代申广告。

## 8. 执行记录（实施后填写）
- 实际改动：语料、计数测试、基线与本计划。未改草稿 `john-w-kingdon`。
- 验证结果：`npm run content:check`、`npm test`（200 pass / 0 fail / 3 skipped）、`npm run typecheck`、`npm run lint`（0 errors；3 条既有 warning）。未跑 seed、`db:reset`、`db:import-published`。
- 未完成项与原因：不导入生产库，不合入，不打开广告。本环境没有 Obsidian Vault 路径，未写站外审核记录。
- 下一步：人工审查后决定是否导入。
