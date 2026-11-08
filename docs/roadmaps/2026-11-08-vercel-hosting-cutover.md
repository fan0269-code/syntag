# Vercel 生产托管切换：实施计划

> 日期：2026-11-08  
> 状态：已完成  
> 阶段：P6  
> 负责人：Cloud Agent  
> 关联：Owner 林文授权；自建 SSH 部署超时；Cloudflare HTTP 521

## 1. 目标与用户价值

- 让 `syrtag.com` 可以改由 Vercel 托管，并停止向已经失联的源站发起 SSH。
- 合并后，push 到 `main` 不再跑失败的 SSH 部署。现网恢复仍要林文在 Vercel、数据库和 Cloudflare 控制台完成。

## 2. 范围

### 包含

- Vercel 构建命令、Node 22、Prisma generate，以及按需的 `prisma migrate deploy`。
- 删除会 SSH 的 GitHub Actions workflow。
- 环境变量、迁移和 DNS 切换说明。
- 保留广告关闭和空目录文案。

### 不包含

- 创建 Vercel 项目、付费数据库或修改 Cloudflare DNS。
- 向生产库 seed、把实体改成 `published`，或提交 AdSense。
- 修改首页、About 或 Privacy 的学术与广告文案。
- 对任何共享数据库执行 `db:reset`。

## 3. 当前证据与决策

- 现象/复现路径：`.github/workflows/deploy-production.yml` 在 push 到 `main` 时 SSH 到 `SYRTAG_DEPLOY_HOST`。近期运行因 SSH 超时失败。Cloudflare 对 `syrtag.com` 返回 HTTP 521。
- 根因或待确认假设：源站不再接受部署连接。应用本身仍是 Next.js 16 与 Prisma 7，可以改由 Vercel 构建。
- 需要用户确认的决策：林文已授权切换。数据库厂商、Vercel 套餐和 DNS 记录仍由林文在控制台选择。
- 不能假设的事实或外部依赖：不能假设生产 Postgres 已存在，不能假设域名已经指向 Vercel，不能把空的 published 目录写成已上线内容。

## 4. 实施步骤

1. 增加 `vercel-build`、`vercel.json`、Node 22 与 Prisma 直连/池化分工 — 文件：`package.json`、`scripts/vercel-build.mjs`、`prisma.config.ts`、`src/lib/db.ts`、`next.config.ts` — 产物：Vercel 构建生成 Prisma Client，默认不迁移、不 seed。
2. 删除 SSH workflow，并让旧脚本默认退出 — 文件：`.github/workflows/deploy-production.yml`、`ops/deploy-production.sh`、`ops/rollback-production.sh` — 产物：push 到 `main` 不再 SSH。
3. 写下操作步骤 — 文件：`docs/deploy-vercel.md`、`.env.example`、`README.md` — 产物：环境变量、迁移、域名和验收清单。
4. 用测试锁住新合同 — 文件：`tests/deployment-workflow.test.ts` — 产物：无 SSH workflow，构建不 seed。

## 5. 数据、内容与安全

- 数据来源与核验等级：无新的学术主张。
- 数据迁移/seed 影响：仓库不执行迁移或 seed。文档要求林文在托管 Postgres 上运行 `npm run db:migrate:deploy`。禁止 `db:reset`。不把 draft/archived seed 当作公开内容。
- 环境变量/权限需求：`DATABASE_URL`、`DIRECT_URL`、`NEXT_PUBLIC_SITE_URL=https://syrtag.com`。可选 `PRISMA_MIGRATE_ON_BUILD=1` 只放在 Vercel Production。不提交密钥。
- 隐私、版权或法律影响：广告保持关闭。不新增 `ads.txt` 或 AdSense 标记。

## 6. 验收标准

- 自动化：`npm test`、`npm run lint`、`npm run build`。预期：通过；构建不需要生产数据库。
- 浏览器：本轮不改公开页面交互。现网 `syrtag.com` 在 DNS 切换前不会变。
- 数据：不连接、不重置、不 seed 任何数据库。
- 链接/SEO：canonical 仍是 `https://syrtag.com`。`www` 在 `vercel.json` 中永久跳转到 apex。

## 7. 风险、回退与发布判定

- P0/P1/P2 风险：合并后 GitHub 不再尝试旧主机，但域名在林文改 DNS 之前仍然 521。若 `PRISMA_MIGRATE_ON_BUILD` 被误设到 Preview，且 Preview 使用生产库，会把迁移应用到该库。文档要求该开关只放在 Production。
- 回退方式：Vercel 控制台 Promote 上一份 deployment。不要把 DNS 指回失联源站。数据库迁移只向前。
- 发布结论条件：PR 只表示仓库可被 Vercel 构建。不能称为现网已恢复，也不能称为可以申请广告。

## 8. 执行记录（实施后填写）

- 实际改动：见本计划第 4 节文件。未改首页、About、Privacy 文案，未新增广告脚本。
- 验证结果：`npm test` 164 passed / 0 failed / 3 skipped。`npm run lint` 通过，仅剩既有 `scripts/generate-fan121-work-concept-pack.mjs` 的 3 条 warning。`npm run typecheck` 通过。`npm run build` 通过，生成 23 个静态页，构建产物冒烟 2/2，日志中的 Prisma 更新提示未执行。`node scripts/vercel-build.mjs` 退出码 0，并跳过 migrate。未带开关运行 `ops/deploy-production.sh` 退出码 1。未连接数据库，未执行 seed 或 reset。
- 未完成项与原因：未创建 Vercel 项目、数据库或 DNS 记录。未对现网做浏览器验收，因为源站仍是 521，且本轮不改页面。
- 下一步：林文按 `docs/deploy-vercel.md` 在控制台完成导入、环境变量、迁移和域名。
