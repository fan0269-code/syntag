# Life Course R4 核验日期与生产上线：实施计划

> 日期：2026-07-22
> 状态：实施中（本地门禁完成，待 PR 合并与生产验收）
> 阶段：P1 → P7
> 负责人：Codex
> 关联：`prompts/07-r4-integrate-life-course-r2-batch.md`、Website-Content-Hub R4 审核记录

## 1. 目标与用户价值

修正 R4 审计发现的 verification date 持久化误差，将已核验的 3 条 Life Course R2 source 通过现有 production workflow 安全发布。上线后，Life Course 页面应展示 9 条来源，且数据库核验日期不再固定为旧的 `2026-07-12`。

## 2. 范围

### 包含

- 为 3 条新页面级 L1 verification 记录实际核验日期。
- 让 `SeedVerification` 显式携带 L1 `verifiedAt`，并由 `prisma/seed.ts` 按记录持久化。
- 完成数据库、工程、构建、PR、Actions 和线上验收。
- 回写 Playbook、R4 提示词状态、本计划与 Website-Content-Hub 记录。

### 不包含

- 不新增 Elder 1974 原版，不扩学科、实体、路由或 sitemap。
- 不改 schema/migration；只修正现有 `Verification.verifiedAt` 的 seed 数据来源。
- 不发布 Goodson、Day、Kingdon 或四个 draft Topic。

## 3. 当前证据与决策

- Elder 1996 与 Elder 2000 在 evidence pack 中的核验日期为 2026-07-20；Elder 1999 版本记录为 2026-07-21。
- 当前 `prisma/seed.ts` 对所有 L1 verification 使用固定 `2026-07-12`；这是本次上线前的唯一阻断性审计项。
- 生产仅跟踪 `main`，上线必须经过 PR 合并触发 `.github/workflows/deploy-production.yml`。

## 4. 实施步骤

1. 增加 verification-date RED 回归测试。
2. 最小修正页面核验日期、`SeedVerification` 和 Prisma seed 映射。
3. 运行 migrate → 双次 seed → typecheck → test → lint → content check → build/smoke。
4. 只暂存明确属于 Life Course R3/R4 与本次发布的文件，提交并推送当前功能分支。
5. 创建 PR 到 `main`，合并后等待 production workflow，再做公网健康与发布边界检查。

## 5. 数据、内容与安全

- 数据迁移：无。
- seed 影响：更新 Life Course `content_jsonb` 与对应 L1 verification 日期；保持幂等。
- 环境要求：只使用现有 `.env`、GitHub Secrets 和部署脚本；不输出密钥。
- 发布边界：Education/Sociology 与 published-only 不变。

## 6. 验收标准

- 自动化：完整本地 release gate 全部退出码 0。
- 数据：双次 seed 成功；Life Course L1 source verification 日期为 `2026-07-21T00:00:00.000Z`。
- 构建：Next.js build 和 build-output smoke 通过。
- 发布：PR 合并后 production workflow 成功。
- 线上：首页和 Life Course 页 200，3 个新 source 可见；draft 边界不回退。

## 7. 风险、回退与发布判定

- 若本地 DB 不能证明为非生产，不运行 migrate/seed。
- 若任何门禁失败，不推送；只修复本批引入问题。
- production workflow 失败时依赖现有 rollback script；数据库不做破坏性回退。

## 8. 执行记录

- 实际改动：R4 的 3 条来源已接入 Life Course 的 source、reading path 和页面级 L1 verification；L1 `verifiedAt` 已成为 seed 合同的一部分，Prisma 按记录持久化日期。为关闭既有发布门禁，另对 `scripts/zotero-export.ts` 做无行为变化的类型与未使用代码清理。
- 数据验证：本机非生产 PostgreSQL migration 已确认 in sync；连续两次 seed 成功；集成测试确认数据库含 3 个目标 source id，持久化的最新 L1 日期为 `2026-07-21T00:00:00.000Z`。
- 工程验证：`typecheck`、Node 测试 123 通过/1 项按设计留给 build、全仓 `lint`、`content:check`、生产 build + build-output smoke 1/1 全部通过；Chromium Playwright 36/36 通过。
- 范围结论：无 schema/migration/dependency、实体状态、公开路由或 sitemap 扩展；Goodson、Day、Kingdon 和四个 draft Topic 仍保持非公开。
- 未完成项：PR、production workflow 与公网探针只能在本提交推送并合并后执行；因此本记录尚不声称已经部署。
- 下一步：显式暂存本批文件，提交并推送当前分支，创建 PR 到 `main`，合并后跟踪生产工作流并完成公网验收。
