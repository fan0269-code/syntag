# W5 执行提示词：Teacher Identity D3 公开摘要收窄（保持归档）

> 日期：2026-11-08  
> 状态：待执行；**可与 W1/W4 并行**；不解档  
> 对应计划：`docs/roadmaps/2026-11-08-content-optimization-and-next-phase.md`

请只执行 W5。方法对齐 F0 Life Course：复验公开摘要 → 收窄正文 → 省略 blocker-only → 人审清单。不要把 Teacher Identity 解档。

## 一、目标

对 `teacher-identity-theory` 及其绑定的 `geert-kelchtermans`、`kelchtermans-2009-teacher-identity`（可选：topic `teachers-professional-identity-during-reform` 只收窄、不解档）给出与可复现 locator 一致的拟公开措辞。

最强允许结论：

```text
corpus_narrowed_for_human_review
```

## 二、必须读取

1. 两份内容标准、总规划、F0 收窄先例（PR #18 / `lifeCourseContent`）
2. `docs/research/claim-audit/teacher-identity-theory.md`
3. `src/data/corpus/shared/entities.ts` 中 `teacherIdentityContent`
4. Beijaard et al. 2004、Kelchtermans 2009 的 DOI/出版社/ERIC **公开摘要**（先打开再写）

## 三、启动门禁

- 实体经 FAN-247 后为 `archived`。  
- 不得用维基或标题推断五维度、vulnerability 机制、dialogical 全文主张。  
- 摘要不可复现的行：省略，不要改写成「可能」。

## 四、工作步骤

1. 更新 source register 的 Accessed 日期为实际打开日。  
2. 只保留摘要支撑的定义/综述分类/书目归因。  
3. `key_scholars` 不要合并无法分源的贡献。  
4. Topic 路径若仍写「identity mechanism」而摘要只支撑 self-understanding，则收窄并保持 `pendingTopicTheoryRiskReview`。  
5. 写人审清单（空的人审字段）：

```text
docs/research/human-review/YYYY-MM-DD-teacher-identity-narrowing-checklist.md
```

6. 写预审报告；`review_decision` 保持 `pending_review`。

## 五、验证

```bash
npm run content:check
npm run typecheck
npm test
```

断言 FAN-247 仍包含这些 slug；published 总数不被本窗口改变。

## 六、禁止

- 解档；部署；开广告；扩写凑 D3 字数；把 Kelchtermans 写成整个 identity 领域创始人。

## 七、交接

收窄后的可审块、省略块、是否建议作为 F2（第二个 D3）等人审。F2 解档必须另开窗口，本文件不授权。
