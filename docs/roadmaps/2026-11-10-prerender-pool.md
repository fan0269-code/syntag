# 构建期预渲染连接池：实施计划

> 日期：2026-11-10  
> 状态：已完成  
> 阶段：P6  
> 负责人：Cloud Agent  
> 关联：已合并的 #26（`ff738e7`）；生产构建 `dpl_7WHK834ZgZaR5TLtobsV2MtMPpm8`、`dpl_CE6kcnQroqbTsRYf7pyEggFQMaBS`、`dpl_68ueG24nF1FbRoRNaVrweHrQqQN6`

## 1. 目标与用户价值

- 让已经写入生产库的八条 published 旗舰页，在下一次成功的生产构建之后可以被访问。
- 构建失败时不把“数据暂时不可用”烤进静态页。

## 2. 范围

### 包含

- Vercel 生产构建（`VERCEL=1` 且 `NEXT_PHASE=phase-production-build`）使用能覆盖并发预渲染的 Prisma/`pg` 池。
- 运行时隔离实例仍保持 `max: 1`。
- 更新部署说明、基线记录和池配置测试。

### 不包含

- `db:seed`、`db:reset`、`deleteMany`，或任何写库。
- 把 `dynamicParams` 改成按请求生成未知 slug。
- 切换广告、AdSense 或 fail-closed 行为。
- 把 `DATABASE_URL` 换成 `DIRECT_URL`。两者必须仍指向同一库；构建继续读运行时使用的 `DATABASE_URL`。
- 打印连接串、密码或环境变量的值。

## 3. 当前证据与决策

- 现象/复现路径：八条 published 记录已在生产 Postgres 中。`#26` 合并时的构建对着空库，详情路由是 `generateStaticParams` + `dynamicParams = false` + `revalidate`，所以这八个 slug 在 `https://syrtag.com` 上是 404，首页仍是当时烤进去的空图谱。之后对同一 `main` 三次重新部署，都在 `prisma migrate deploy`（无待执行迁移）和编译成功之后，于预渲染 `/theories/communities-of-practice-1998` 失败。静态页进度到 23/31。日志只有 `timeout exceeded when trying to connect`。
- 根因：`pg-pool` 只在池已满或已有空闲客户端、且等待超过 `connectionTimeoutMillis` 时使用这句报错。新建 TCP 连接超时是另一句（`Connection terminated due to connection timeout`）。三次日志都没有后一句。Vercel 构建同样设置 `VERCEL=1`，所以 `src/lib/db.ts` 把构建工人限制为 `max: 1`、10 秒排队。Next.js 16 在一个工人里按 `staticGenerationMaxConcurrency`（默认 8）并发预渲染。八个实体页同时各跑 metadata 和页面查询，单连接排队超过 10 秒。计算节点保持活动不能消除这个客户端排队。
- 需要用户确认的决策：无。不合并。
- 不能假设的事实或外部依赖：不能假设 Neon 计算规格或挂起间隔可以改。不能假设重新 seed 是修复手段。

## 4. 实施步骤

1. 为生产构建单独给出池配置 — 文件：`src/lib/db.ts` — 产物：构建期 `max: 16`、排队 30 秒、空闲 60 秒、不在空闲时退出；运行时仍是 `max: 1`。
2. 锁住两种池 — 文件：`tests/deployment-workflow.test.ts`。
3. 更正部署说明和基线 — 文件：`docs/deploy-vercel.md`、`docs/SITE_CONSTRUCTION_PLAYBOOK.md`。

## 5. 数据、内容与安全

- 数据来源与核验等级：无新的学术主张。
- 数据迁移/seed 影响：无。构建仍只在 `PRISMA_MIGRATE_ON_BUILD=1` 时 `migrate deploy`，不 seed，不 reset。
- 环境变量/权限需求：继续使用已配置的 `DATABASE_URL` 与 `DIRECT_URL`。不读取、不打印它们的值。
- 隐私、版权或法律影响：广告保持关闭。发布这八页不是广告申请。

## 6. 验收标准

- 自动化：`npm test`、`npm run typecheck`、`npm run lint`。预期：通过。无数据库的 `npm run build` 仍应完成空目录构建。
- 浏览器：本环境没有生产库，不能代替合并后的线上检查。
- 数据：不连接生产库，不写入。
- 链接/SEO：详情路由仍拒绝构建时不存在的 slug。sitemap 继续只列 published。

## 7. 风险、回退与发布判定

- P0/P1/P2 风险：构建工人会短时间占用最多 16 条到池化端点的客户端连接。运行时隔离实例仍是 1 条。若单条查询本身超过 30 秒，构建仍会失败，而不会把不可用状态写成页面。
- 回退方式：不要合并则现网不变。合并后若构建仍失败，在 Vercel Promote 上一份成功部署。不要 reset 数据库。
- 发布结论条件：PR 不能称为这八页已上线，也不能称为可以申请广告。上线条件是该 PR 合并后的生产构建成功，并且八个 slug 返回页面而不是 404。

## 8. 执行记录（实施后填写）

- 实际改动：`src/lib/db.ts` 在 `VERCEL=1` 且 `NEXT_PHASE=phase-production-build` 时使用 `max: 16`、`connectionTimeoutMillis: 30000`、`idleTimeoutMillis: 60000`、`allowExitOnIdle: false`。运行时池未改。`dynamicParams` 仍为 `false`。未改广告。
- 验证结果：`npm test` 185 passed / 0 failed / 3 skipped。`npm run lint` 通过，仅剩既有 `scripts/generate-fan121-work-concept-pack.mjs` 的 3 条 warning。`npm run typecheck` 通过。无 `DATABASE_URL` 的 `npm run build` 通过，生成 23 个静态页（没有 published slug），构建产物冒烟 2/2，广告信号检查通过。未连接数据库，未执行 seed、reset 或 `deleteMany`。
- 未完成项与原因：本环境没有生产库，不能复现 iad1 到 ap-southeast-1 的预渲染，也不能代替合并后的线上 200 检查。
- 下一步：合并后看新的生产构建是否越过静态页生成。成功后再打开八个旗舰 slug。不要为了这八页 reset 或 seed。
