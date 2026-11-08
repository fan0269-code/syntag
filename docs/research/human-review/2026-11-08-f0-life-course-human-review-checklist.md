# F0 Life Course 人审清单（解档前）

> 日期：2026-11-08（Asia/Shanghai）  
> 状态：`status: review` / `needs_human_review: true` / `owner_decision: pending` / `deployment_status: not_started`  
> 边界：本文件不是人审签字，也不是 U3 解档授权。Agent 不得代填 `reviewer_identity`、`review_decision`、`reviewed_at`。

## 1. 候选实体（仍全部 archived）

| Slug | 类型 | 本轮语料 |
| --- | --- | --- |
| `life-course-theory` | Theory D3 | 已按公开摘要收窄 |
| `elder-1998-life-course` | Work | 已对齐公开摘要 |
| `glen-h-elder-jr` | Scholar | 已对齐贡献边界 |
| `educational-transitions-over-time` | Topic | 已收窄 pathway；**topic–theory risk 仍 pending** |

不解档整科 `education` / `sociology` / `life-course-aging-studies`（会连带强制其他理论 published）。

## 2. 证据基线（2026-11-08 复验）

| Source ID | Locator | 可支撑 |
| --- | --- | --- |
| `elder-1998-life-course` | DOI / publisher Abstract | 历史情境、生命模式与动态、生命全程发展、1960s 以降纲领性形成 |
| `elder-johnson-crosnoe-2003-life-course` | Springer chapter Abstract | 早期忽视 life histories/trajectories；Thomas 纵向 life-history 先声 |
| `shanahan-2000-pathways-adulthood` | Annual Reviews Abstract | 路径变异、过渡作为发展过程、能动与结构化机会/限制的交织 |
| R2 bibliographic trio | 既有 publisher/library 记录 | 仅书目身份，不支撑新的实质原则清单 |

**明确不支撑（仍禁止公开主张）：** Elder 五原则具名清单；Depression 队列机制叙事；Mayer 因果限度原句；Alwin 术语变体原句；turning point / linked lives 的全文原则定义。

## 3. 理论页须行级决定的主块

对每个字段：`accept_as_worded` | `accept_with_revision` | `reject` | `pending_review`，并填身份/角色/真实日期/理由。

| Claim / 字段 | 建议 disposition | 人审焦点 |
| --- | --- | --- |
| `what_is_it` | 摘要合成 | 是否过度合成多个摘要 |
| `core_question` | editorial_synthesis | 不得标为 L1 |
| `origins` | 摘要合成 | 不得写成唯一创始人 |
| `historical_development[0..3]` | 摘要 / 书目 | 时期标签是否过度编辑化 |
| `key_scholars`（3 人） | 摘要归因 | Johnson/Crosnoe「major」措辞；无 Mayer/Alwin 合并行 |
| `core_concepts`（6） | 摘要词汇 | 不得当作 Elder 五原则清单 |
| `genealogy[0]` | editorial | `informs` 方向是否保留或改为 `adjacent_to` / 删除 |
| `adjacent_theories` / fit / criticisms / misuse / guidance | editorial / research_guidance | methods 视角 |

完整旧 ledger 见 `docs/research/claim-audit/life-course-theory.md`；本轮以收窄后的 corpus 措辞为准。

## 4. Topic 风险审查（解档硬闸）

`topicTheories[educational-transitions-over-time → life-course-theory]` 当前为 `pendingTopicTheoryRiskReview`。

公开 topic 前必须有 methods 角色的 `AcceptedTopicTheoryRiskReview`（`accept_as_worded` 或 `accept_with_revision`），且 `approvedWordingEn === riskNotesEn`。Supporting / not_recommended 关系若随 topic 公开，同样需要完整风险记录或保持无实质 `riskNotesEn`。

## 5. 主人 U3 解档步骤（签字后另开 PR）

1. 本清单全部相关行已有真人决定；无 blocker-only 残留在拟公开措辞中。  
2. 主人书面授权 F0 allowlist 解档（本文件或独立授权记录）。  
3. 工程：从 `FAN_247_ARCHIVED_*` 移除上述 slug；更新 `FAN_247_ARCHIVED_PAGE_COUNT` 与 `tests/fan247-visibility.test.ts` / seed 计数测试。  
4. 若公开 genealogy 边：另按 `PUBLIC_GENEALOGY_RELATION_IDS` 与关系证据闸处理（默认仍空）。  
5. `npm run content:check` → migrate → seed → test → build；**不**捆绑 deploy，除非另授权。

## 6. Owner 决策槽

```text
owner_decision: pending
reviewer_identity: not_assigned
reviewed_at: not_assigned
publication_authorization: not_granted
deployment_status: not_started
```
