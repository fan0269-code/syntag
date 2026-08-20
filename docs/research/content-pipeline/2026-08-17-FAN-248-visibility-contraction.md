# FAN-248：58 页保守下线实施报告

> 实施日期：2026-08-17（Asia/Shanghai）  
> 授权来源：FAN-247，revision `caec373f-4f30-4f7b-b566-4fce2fff1e09`  
> 范围：仅可见性治理；不代表或推断 academic/editorial/method named-human approval。

## 结论

已在 typed corpus 与本地非生产数据库实施 FAN-247 授权的 58 页可逆收缩：目标实体统一为 `status="archived"`、`publishedAt=null`。已保留内容、claim/evidence ledgers、16 个既有 U3 archived 实体和 7 个 draft 实体；未填充 reviewer identity、role、reviewedAt、wording verdict 或 rationale。

当前可复核状态：

| entity type | FAN-247 archived | pre-existing U3 archived | draft | published |
|---|---:|---:|---:|---:|
| discipline | 2 | 0 | 0 | 0 |
| field | 6 | 0 | 0 | 0 |
| theory | 12 | 0 | 0 | 0 |
| work | 18 | 1 | 0 | 0 |
| concept | 9 | 15 | 0 | 0 |
| scholar | 7 | 0 | 3 | 0 |
| topic | 4 | 0 | 4 | 0 |
| **total** | **58** | **16** | **7** | **0** |

## 实施内容

- 新增 `src/lib/fan247-visibility.ts`，冻结 58 条按 entity type 分组的显式 slug 名单和总数 58。
- `src/data/corpus/shared/entities.ts` 对七类 seed records 应用授权名单；仅目标记录变为 `archived`，`publishedAt` 设为 `undefined`，既有 U3/draft 保持原状态。
- `src/lib/content-validation.ts` 允许已归档内容继续保留内部 claim/evidence 与关系账本，但不把归档关系视为公共 genealogy 或 published relation。
- `src/lib/seed-verification.ts` 增加 58 条数据库快照，按七类记录验证 `archived` 与 `publishedAt=null`。
- 增加 FAN-247 corpus/derived-surface 回归测试和 build-output smoke；通用历史测试使用只存在于测试目录的正向 public fixture，不改变生产 seed。

## Public surface 结果

所有详情 loader、static params、index、search、graph、internal links、sitemap 继续使用 `status="published"` 边界。基于 fresh build：

- 58/58 FAN-247 target URL 不在 prerender manifest。
- 16/16 既有 U3 URL 不在 prerender manifest。
- 7/7 draft URL 不在 prerender manifest。
- 七类实体详情 prerender 数量均为 0；实体详情总数为 0。
- sitemap 保留 14 个非实体静态入口，0 个实体详情 URL；pricing、corrections、robots 等非实体路线保持存在。
- typed corpus 的 public derived relations：Theory–Work、Theory–Concept、Theory–Scholar、Topic–Theory 均为 0 条两端同时 published 的记录。
- 详情 metadata 只有在 published loader 返回实体时才生成；本次无详情实体进入 build，因此无 target canonical/alternate 输出。

## 数据库与 seed 验证

使用 `.env` 指向的本地非生产 PostgreSQL（`127.0.0.1:54329`），未访问生产数据库或密钥：

1. `npm run db:seed`：PASS。
2. 第二次 `npm run db:seed`：PASS，幂等路径成立。
3. `node --env-file-if-exists=.env --experimental-strip-types --test tests/seed-integration.test.ts`：PASS，`1 passed / 0 failed`。

集成断言覆盖：58 条 FAN-247 快照；分组为 `2/6/12/18/9/7/4`；每条 `status="archived"` 且 `publishedAt=null`；published entity、searchable entity、public genealogy、TheoryScholar、TopicTheory 结果均为 0；16 U3 与 7 draft 保持边界。

## Verification record

| command | result |
|---|---|
| `npm run typecheck` | PASS |
| `npm run content:check` | PASS — 2 disciplines / 12 theories |
| `DATABASE_URL= npm test` | PASS — 161 passed / 0 failed / 2 skipped（数据库集成被显式跳过） |
| `npm run lint` | PASS — 0 errors；3 条既有 `scripts/generate-fan121-work-concept-pack.mjs` unused warnings |
| `npm run db:seed` | PASS，执行 2 次 |
| `tests/seed-integration.test.ts`（本地非生产 DB） | PASS — 1/1 |
| `npm run build` | PASS — fresh build，23 static pages generated |
| `tests/build-output-smoke.test.ts`（fresh build） | PASS — 1/1 |
| `git diff --check` | PASS |
| production mutation/deploy/publish/indexing | `not_run` / not authorized |

## Candidate identity and rollback

当前 exact HEAD/base：`3323ebb8d2045cfe54c2c583c61c0cda52be59a5`。工作区在本任务开始前已有大量 tracked/untracked 变更，且本任务修改与已有 `entities.ts`、`content-validation.ts`、`seed-verification.ts` 变更重叠；因此没有创建不安全的混合 commit，也没有覆盖或回滚既有变更。

可复核的 tracked task-file diff 命令及 SHA-256：

```text
git diff --binary -- src/data/corpus/shared/entities.ts src/lib/content-validation.ts src/lib/seed-verification.ts tests/build-output-smoke.test.ts tests/content-onboarding.test.ts tests/content-validation.test.ts tests/fan133-work-concept-contract.test.ts tests/second-scholar-enrichment.test.ts tests/seed-corpus-regression.test.ts tests/seed-integration.test.ts | shasum -a 256
5c95d4764b335e0d3964fbf395ce4c379938b9fcc8c833f15513c181767de3f6
```

新增文件 SHA-256：

```text
454713825413360a8fa3d1a867f6e01401dcdd8d18d8ef818589e5fa57b56f1f  src/lib/fan247-visibility.ts
e16230a9069ae6f491a9460782dd06ecb8cb62c9a1621bdfd55acb45c7dd52b2  tests/fan247-visibility.test.ts
0a8dafbe68676ac7ff3991cce0c8c009e925a0625b647e74e945e2b98a89ab3c  tests/helpers/public-seed-corpus.ts
```

任务变更 manifest：

```text
src/lib/fan247-visibility.ts
src/data/corpus/shared/entities.ts
src/lib/content-validation.ts
src/lib/seed-verification.ts
tests/fan247-visibility.test.ts
tests/helpers/public-seed-corpus.ts
tests/build-output-smoke.test.ts
tests/content-onboarding.test.ts
tests/content-validation.test.ts
tests/fan133-work-concept-contract.test.ts
tests/second-scholar-enrichment.test.ts
tests/seed-corpus-regression.test.ts
tests/seed-integration.test.ts
docs/research/content-pipeline/2026-08-17-FAN-248-visibility-contraction.md
```

回滚方式：在 owner 审核后恢复本任务变更前的 candidate bytes，或移除 `applyFAN247Visibility` 接入并重新执行原 seed；不得通过记忆重建旧 `publishedAt`。本任务未部署、未发布、未改生产数据。

## Review boundary

```text
status: review
needs_human_review: true
owner_decision: pending
deployment_status: not_started
reviewer_identity: not_assigned
reviewer_role: not_assigned
reviewed_at: not_assigned
```

本报告只记录 CEO 授权的可见性实施与技术验证，不替代 FAN-125 的独立复审，不把结构性 PASS 推断为 named-human academic/editorial/method approval。
