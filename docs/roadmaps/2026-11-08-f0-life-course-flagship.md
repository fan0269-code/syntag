# F0 旗舰闸：Life Course 簇（摘要可复现收窄）

> 日期：2026-11-08  
> 状态：实施中（语料已收窄；公开解档待人审 + 主人 U3）  
> 阶段：P1 内容语料  
> 负责人：Cloud agent（实现）；人审与解档须主人  
> 关联：`docs/roadmaps/2026-11-08-graph-reuse-and-content-masterplan.md` §5.3；FAN-247；`docs/research/claim-audit/life-course-theory.md`

## 1. 目标与用户价值

- 为谁：主人要把空目录推进到「可审、少而深」旗舰，而不是换图谱引擎。
- 用户可观察变化（本轮）：Life Course 簇正文已按 2026-11-08 可复现公开摘要收窄；人审清单与解档步骤可执行。**公开目录仍为 published = 0**（FAN-247 未解除）。

## 2. 范围

### 包含

| ID | 实体 | 本轮动作 |
| --- | --- | --- |
| F0-1 | Topic `educational-transitions-over-time` | 收窄 pathway 措辞；仍 archived；风险表述仍 `pending_review` |
| F0-2 | Theory D3 `life-course-theory` | 省略 blocker-only 五原则/全文书目主张；改写为摘要支撑词汇 |
| F0-3 | Scholar `glen-h-elder-jr` + Work `elder-1998-life-course` | 对齐公开摘要边界 |
| F0-4 | Discipline 入口 | **不**解档 `education`/`sociology` 整科（会强制连带 published 全部关联理论）；改为在索引空态与本计划中诚实写「旗舰候选已收窄、待人审」 |

### 不包含

- 不解档 FAN-247；不设 `published`；不部署；不开广告；不换图谱库。
- 不伪造 `reviewer_identity` / `review_decision` / topic `riskReview` 人审签字。
- 不引入 Mayer (2009) / Alwin (2012) 全文本主张；不新建 Psychology/Management。

## 3. 当前证据与决策

- 现象：claim ledger（2026-08-14）大量 `blocked`；公开摘要此前未复验。
- 2026-11-08 复验：Elder 1998 DOI/出版社摘要、Springer 2003 章摘要、Shanahan 2000 摘要均可复现。
- 决策：先收窄语料到摘要边界，再等人审 PASS 后另 PR 解档 allowlist。
- 不能假设：主人已完成行级人审；生产 521/托管状态；AdSense。

## 4. 实施步骤

1. 收窄 `lifeCourseContent` / Elder work / Elder scholar / transitions topic — 文件：`src/data/corpus/shared/entities.ts`
2. 调整 R2 接线断言（源/阅读路径数量）— 文件：`tests/content-validation.test.ts`
3. 人审清单 + 预审报告 — 文件：`docs/research/human-review/`、`docs/research/pre-review/`
4. Claim 增补与本立项 — 文件：`docs/research/claim-audit/life-course-theory.md`、本文件
5. 解档（**另 PR，须授权**）：从 `src/lib/fan247-visibility.ts` 移出 allowlist slug；补齐 topic methods 风险人审；更新 `FAN_247_ARCHIVED_PAGE_COUNT` 与相关测试；`content:check` → seed → build

## 5. 数据、内容与安全

- 数据来源：DOI/出版社公开摘要 + 既有 R2 书目身份；核验日写在 verification 行。
- seed 影响：有（措辞变更）；状态仍由 FAN-247 强制 archived。
- 不部署；不申请广告。

## 6. 验收标准

- 自动化：`validateSeedCorpus` 无错；Life Course R2 接线测试更新后通过；相关 content 测试绿。
- 数据：`life-course-theory` / Elder / transitions **仍 archived**；公开 published 计数不变。
- 文档：人审清单列出须签字行与解档步骤。

## 7. 风险、回退与发布判定

- P0：误解档或伪造人审 → 本 PR 明确禁止。
- 回退：还原 `entities.ts` 与测试断言即可。
- 发布结论：本 PR **不是**公开展示授权。解档须主人在人审清单签字后再开 PR。

## 8. 执行记录

- 实际改动：`entities.ts` Life Course 簇收窄；claim 增补；人审/预审文档；F0 锁定测试；playbook N36。
- 验证结果：`npm test` 167 pass / 3 skip；`npm run content:check` 通过；`npm run lint` 0 errors（既有 script warnings）；typecheck 见提交说明。
- 未完成：行级人审；FAN-247 解档；F0-4 学科实体 published；Obsidian 路径在本环境不可用。
- 下一步：主人按 `docs/research/human-review/2026-11-08-f0-life-course-human-review-checklist.md` 签字后开解档 PR。
