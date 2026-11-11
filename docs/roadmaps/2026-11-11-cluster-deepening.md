# 簇内加深与新页：实施计划

> 日期：2026-11-11  
> 状态：已完成  
> 阶段：P1  
> 负责人：Cursor cloud agent  
> 关联：已批准写稿简报 2026-11-11 09:15 Asia/Shanghai；来源清单 2026-11-11；双站统一审核标准 ST1–ST6

## 1. 目标与用户价值
- 让已发表的八条页有可定位的 claim ledger，并补上 1991 / 1998 / Elder 著作页、Multiple streams 理论页和 Jean Lave 学者页。
- 读者能从已发表簇内页走到对应著作或学者，而看不到归档旧 slug。

## 2. 范围
### 包含
- 八条已发表实体就地加深，不改 slug。
- 三个新著作 slug、一个新理论 slug、一个新学者 slug，在语料中为 published。
- `/theories`、`/scholars`、`/works` 的导语按渲染时的 published 查询生成。
### 不包含
- 图谱层新节点、解档、广告、生产库导入、seed、`db:reset`。
- 首页改版。首页目录已在另一条已合并的变更里。

## 3. 当前证据与决策
- 现象/复现路径：八条页的账本字段已齐，但页面仍写 claim-level review pending。
- 根因或待确认假设：展示层不读账本是否关闭。
- 需要用户确认的决策：无。范围已于 2026-11-11 09:15 批准。
- 不能假设的事实或外部依赖：Pearson 目录不是全书；EPAA 只用 `/article/view/771`；Lave 的院系表述冲突；1974 芝加哥出版社名不在当日打开的 Routledge HTML 上。

## 4. 实施步骤
1. 收口账本展示 — 文件：`src/lib/claim-ledger.ts` — 产物：关闭的账本不再标 pending。
2. 写入新实体 — 文件：`src/data/corpus/content-batches/2026-11-11-cluster-deepening.ts` — 产物：新 slug 为 published，旧档仍 archived。
3. 索引导语 — 文件：`src/lib/published-index-intro.ts` — 产物：只列出当次查询返回的标题。

## 5. 数据、内容与安全
- 数据来源与核验等级：简报与来源清单中的 URL，核验日 2026-11-11，L1 / L2 / L3 分开。
- 数据迁移/seed 影响：无。不写数据库。
- 环境变量/权限需求：无。
- 隐私、版权或法律影响：转述，不粘贴摘要。广告保持关闭。

## 6. 验收
- `npm run content:check`、`npm test`、`npm run lint`、`npm run typecheck`。
- 不合并，不部署，不导入生产库。
