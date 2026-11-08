# W4 执行提示词：F1 Life Course 同簇概念收窄（保持归档）

> 日期：2026-11-08  
> 状态：待执行；**可与 W1 并行**；不解档  
> 对应计划：`docs/roadmaps/2026-11-08-content-optimization-and-next-phase.md`

请只执行 W4。本窗口优化概念页与 F0 理论页的一致性，不翻转 U3/FAN-247 状态。

## 一、目标

F0 理论页已（或应）省略 Elder 五原则具名清单与 turning-point 全文定义。但 U3 归档概念仍可能写着：

```text
trajectory
transition
turning-point
```

把它们收窄到 **与 F0 相同的公开摘要边界**，或省略无法支撑的 turning-point 实质定义。

最强允许结论：

```text
corpus_narrowed_for_human_review
```

实体保持 `archived`。

## 二、必须读取

1. 两份内容标准、总规划
2. `src/lib/u3-visibility.ts`
3. `src/data/corpus/shared/entities.ts` 中三个 conceptCandidate 与 `lifeCourseContent.core_concepts`
4. `docs/research/claim-audit/life-course-theory.md` §9
5. `docs/research/2026-08-14-work-concept-evidence-and-claim-ledger.md`（若存在）
6. Elder 1998 / Springer 2003 / Shanahan 2000 **公开摘要**（先复验，不凭记忆）

## 三、证据规则

- 书目身份 ≠ 概念定义。  
- 公开摘要若未定义 trajectory/transition/turning-point 三词，不得把旧 seed 定义标为 `verified`。  
- 优先：**省略** turning-point 页的机制定义，改为「本页仅保留书目入口，实质定义待全文 locator」。  
- 不得为凑 250–450 词扩写。

## 四、允许写入

- 三个概念的 `definitionEn` / concept content 字段（收窄或诚实降级）  
- `docs/research/claim-audit/` 下 F1 概念增补  
- `docs/research/pre-review/YYYY-MM-DD-f1-life-course-concepts-pre-review.md`  
- 聚焦测试：断言 U3 仍归档；断言不再出现与 F0 冲突的五原则清单句

不得：解档概念、把概念链进已 published 的 topic `entry_points`（除非该概念已 published，本窗口不是）。

## 五、验证

```bash
npm run content:check
npm run typecheck
node --env-file-if-exists=.env --experimental-strip-types --test tests/content-validation.test.ts
```

若有 W2 已 published 的理论：确认其 `core_concepts` 与概念页不互相矛盾。

## 六、交接

三个 slug 的新证据状态、省略了什么、仍需全文的 blocker、是否建议将来单独 U3 解档（本窗口不执行）。
