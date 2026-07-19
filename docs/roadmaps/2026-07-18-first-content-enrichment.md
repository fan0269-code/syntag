# 首批内容丰富：实施记录

> 日期：2026-07-18
> 状态：已完成
> 阶段：P1 内容语料
> 边界：本文件记录本地执行证据；不作部署、线上或生产环境验证的声明。

## 1. 结果与公开边界

首批内容丰富批次是一个**本地验证的发布候选**：三份 Scholar profile 符合发布条件；四个 Topic 研究包及 John W. Kingdon 均保持 draft，且已从全部公开 surface 排除。

- 新增 draft Topic 研究/语料记录：教师专业学习与改变、教育政策一线裁量、教育支持与机会获取、教师学习中的实践共同体。
- 新增可公开 Scholar：Jean Lave、Etienne Wenger、Michael Lipsky。
- John W. Kingdon 因 1995/2011/2013 edition metadata 混用风险保持 draft，不进入公开入口。
- Lave、Wenger、Lipsky 的身份、代表作与限定关系使用保守归因边界；Lipsky 的 1980 原版与 2010 expanded edition 分别由 Russell Sage 的 publication-history 与 book-record URL 支持。

## 2. 语料与公开计数

| 对象 | 原始数量 | 公开数量 | 说明 |
| --- | ---: | ---: | --- |
| Topics | 8 | 4 | 4 个本批次 Topic 均为 draft。 |
| TopicTheory | 24 | 12 | draft Topic 的 12 条关系不进入公开 surface。 |
| Scholars | 8 | 7 | 新增 Lave、Wenger、Lipsky 为 published；Kingdon 为 draft。 |
| TheoryScholar | 8 | 7 | Kingdon 关联不公开。 |
| Genealogy | 8 | 8 | 既有八条 genealogy ID 与边未改动。 |

数据库集成验证还确认：公开 theories 为 12、fields 为 6、discipline-theory relations 为 15、field-theory relations 为 8；L1 verification records 为 12，searchable theories/scholars/topics 分别为 12/7/4。

## 3. 实施范围

### 已完成的改动

- 新增独立内容批次模块，并由 `src/data/corpus/shared/entities.ts` 显式合并进 `src/data/seed-content.ts` 的生产 manifest。
- 新增 4 个 Topic、12 条 TopicTheory、4 个 Scholar candidate 与 4 条 TheoryScholar；其中公开边界以本文件第 1 节为准。
- 将 legacy 来源项在 `sourceItemsForEntity()` 映射为 `L3_pending`，保留原 URL，避免把 legacy L1 元数据表述成 claim-level “Source verified”。
- 增加语料、内容合同、seed integration 与浏览器验收覆盖。

### 明确不在本批次内

- 未新增 Theory、Work、Concept、Field、Discipline、Genealogy、路由、schema、migration 或数据库 reset。
- 未改动既有八条 genealogy ID 或边。
- 未执行 commit、push、PR、merge 或部署。

## 4. 本地执行证据

### 预检与数据库写入

| 命令 | 退出码 | 结果 |
| --- | ---: | --- |
| `node --env-file-if-exists=.env --experimental-strip-types --test tests/content-ui-contract.test.ts tests/content-validation.test.ts tests/seed-corpus-regression.test.ts` | 0 | 24/24 通过。 |
| `npm run typecheck` | 0 | `tsc --noEmit` 通过。 |
| `npm run lint` | 0 | ESLint 通过。 |
| `npm run content:check` | 0 | 2 disciplines、12 theories 的 onboarding validation 通过。 |
| `git diff --check` | 0 | 未报告空白错误。 |
| `npm run db:migrate` | 0 | 已同步，无待执行 migration。 |
| `npm run db:seed`（第 1 次） | 0 | `Syrtag seed completed.` |
| `npm run db:seed`（第 2 次） | 0 | `Syrtag seed completed.` |
| `node --env-file-if-exists=.env --experimental-strip-types --test tests/seed-integration.test.ts` | 0 | 1/1 通过；双 seed 后计数与公开边界准确，未引入重复实体或关系。 |

首次 sandbox 内 `npm run db:migrate` 曾因连接本地 loopback PostgreSQL 的 Prisma schema-engine 空错误退出 1；在确认目标为本地数据库后，以窄权限重跑同一命令并以上表的退出码 0 完成。该记录不含连接字符串或凭据。

### 工程、构建与 smoke

| 命令 | 退出码 | 结果 |
| --- | ---: | --- |
| `npm run typecheck` | 0 | 通过。 |
| `npm test` | 0 | 119 项：118 通过、0 失败、1 跳过。跳过项为由 build 驱动的条件 smoke。 |
| `npm run lint` | 0 | 通过。 |
| `npm run content:check` | 0 | 2 disciplines、12 theories 校验通过。 |
| `npm run build` | 0 | 本地 fresh build 完成，生成 96 个静态页面；内置 build-output smoke 为 1 通过、0 失败、0 跳过。 |
| `node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts` | 0 | 命令退出成功，但因未设置 `BUILD_OUTPUT_SMOKE_REQUIRED=1` 而按测试自身 guard 跳过。 |
| `BUILD_OUTPUT_SMOKE_REQUIRED=1 node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts` | 0 | 1 通过、0 失败、0 跳过；与 `npm run build` 中的有效 smoke 一致。 |

fresh build 的路由汇总为 93 个 prerender-manifest routes、74 个 entity detail routes 与 87 个 sitemap `<loc>`。7 个公开 scholar 静态路由和 4 个既有公开 Topic 路由存在；四个 draft Topic 与 Kingdon 在 prerender routes 和 sitemap 中均无公开引用。

### 浏览器与 E2E

| 命令 | 退出码 | 结果 |
| --- | ---: | --- |
| `PLAYWRIGHT_PORT=3101 npx playwright test tests/e2e/content-enrichment.spec.ts` | 0 | 11 通过、0 失败、0 跳过。 |
| `PLAYWRIGHT_PORT=3101 npm run test:e2e` | 0 | 31 通过、0 失败、0 跳过；JUnit 为 `tests="31" failures="0" skipped="0" errors="0"`。 |

在 desktop（`innerWidth = 1280`）和 `375×812` 两个视口，以下公开路径均显示预期 H1、无 unavailable state、`scrollWidth <= clientWidth`，且无 draft href：`/`、`/topics`、`/scholars`、`/scholars/jean-lave`、`/scholars/etienne-wenger`、`/scholars/michael-lipsky`、`/search?q=Jean%20Lave`、`/search?q=Kingdon`。

同一两种视口下，四个 draft Topic 路径和 `/scholars/john-w-kingdon` 均显示 `That entry is not available.`，没有水平溢出，且仅提供安全的恢复/导航链接。sitemap 的本地 fallback 请求返回 200，只匹配 Jean Lave、Etienne Wenger、Michael Lipsky 三个新增 scholar slug，未匹配五个 draft slug。路由矩阵完成后手工浏览器 tab 的 console errors 为 0。

目标与全量 E2E 均保留 axe、水平溢出、draft isolation、公开内容、键盘与 reduced-motion 断言。成功页面的 browser-health watcher 断言 page errors、console errors、同源请求失败和第一方 HTTP 4xx/5xx 均为空；五个预期 draft 404 由各自专用断言处理，不使用通用 404 白名单。

## 5. 内容语义与限制

- theory-fit 标签是 L2 编辑判断；页面仍应诚实表达为 “sources listed / claim-level review pending”。
- relationship-level evidence notes 已在 corpus 中撰写，但尚未完整持久化为 claim-level evidence model；这是当前未解决的模型限制。
- 本地构建的前两次尝试受外部 Google Fonts 短暂获取失败影响；未改动代码后的第三次尝试完成并以上述 build 退出码 0 作为证据。
- standalone smoke 命令在未设置 `BUILD_OUTPUT_SMOKE_REQUIRED=1` 时是成功退出但跳过的合同陷阱；有效非跳过 smoke 已在 `npm run build` 中执行，也已用显式变量单独确认。
- Node 的 `MODULE_TYPELESS_PACKAGE_JSON`、Next edge-runtime 和 `NO_COLOR`/`FORCE_COLOR` 警告均为非阻塞运行时警告，未改变上述结果。
- 五个预期 draft 404 在本地 server log 中仍会伴随 `Internal: NoFallbackError`；专用断言与完整 E2E 均通过，未扩大异常忽略范围。

## 6. 回退与后续边界

- 如需撤回公开边界，可将本批次 Scholar 改为 draft 并从公开 entry points 移除后重新 seed；不删除既有内容或 genealogy。
- 四个 Topic 和 Kingdon 在完成独立、可持久化的 claim-level evidence 审计前继续保持 draft。
- 本文件的最强结论仅为：首批内容丰富批次是本地验证的发布候选；三份 Scholar profile 符合发布条件，而四个 Topic 研究包及 John W. Kingdon 保持 draft，并从全部公开 surface 排除。
