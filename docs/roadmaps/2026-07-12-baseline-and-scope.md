# 完成版基线与范围冻结：实施计划

> 日期：2026-07-12  
> 状态：已完成  
> 阶段：P0  
> 负责人：Codex  
> 关联：`prompts/completion/01-baseline-and-scope.md`；`docs/SITE_CONSTRUCTION_PLAYBOOK.md`

## 1. 目标与用户价值

- 为后续实施者固定可复现的项目基线，避免把演示、缺失语料或未配置数据库误当作一期已发布能力。
- 本轮完成后，实施者可根据本文件了解当前命令状态、运行时限制、已知死链及进入 P1 所需输入，而不必依赖聊天记录。

## 2. 范围

### 包含

- 复核项目命令、环境变量是否存在、数据库与图谱实现、路由和测试。
- 如实记录工作树、分支、页面和验证结果。

### 不包含

- 页面视觉、路由、API、数据库 schema、依赖、seed 内容或部署改动。
- 配置数据库、执行迁移、seed、外部访问或发布。

## 3. 当前证据与决策

- 复现路径：`npm test` 在加载 `tests/content-validation.test.ts` 时失败，原因是其导入的 `src/data/seed-content.ts` 不存在（9 通过、1 失败）。
- 复现路径：环境中不存在 `DATABASE_URL`；`src/lib/db.ts` 因此不会构造 Prisma 客户端。构建期间多次记录该配置缺失。
- 复现路径：首页在数据库查询失败或无数据时直接使用 `src/lib/graph-sample.ts` 的 5 节点 Education genealogy 样例，且页面未将其标示为 demo；不能作为发布内容证据。
- 复现路径：`src/app/theories/` 与 `src/app/scholars/` 仅有 `[slug]` 动态详情页；Footer 仍链接 `/theories`、`/scholars`，因此两条链接当前无对应索引页。
- 复现路径：图谱组件公开列出 education、sociology、psychology、management；当前 `prisma/seed.ts` 仅定义 Education 和 Sociology，且内容事实源仍缺失。Psychology 和 Management 没有一期内容依据，不得在公开 UI 中承诺；交由 Prompt 05/06 处理。
- 当前 git 证据：分支 `main`，HEAD `3ea25fc`；开始时有 8 个已修改跟踪文件和 30 个未跟踪路径。本轮未覆盖其中任何文件。
- 本机未发现正在运行的 Next.js 进程，因此未进行只读浏览器/HTTP 页面检查。

## 4. 实施步骤

1. 读取项目约束、脚本、schema、环境示例、数据库/首页/样例图谱实现、测试及完成版提示词 — 产物：本基线中的可复现事实。
2. 运行测试、lint、构建并保存退出结果 — 产物：第 6 节命令证据。
3. 建立本计划兼基线交接记录 — 文件：`docs/roadmaps/2026-07-12-baseline-and-scope.md` — 产物：P0 交接文档。

## 5. 数据、内容与安全

- 数据来源与核验等级：本轮仅检查本地实现和测试；未新增或核验任何学术内容或外部来源。
- 数据迁移/seed 影响：无。`DATABASE_URL` 不存在，未运行数据库命令。
- 环境变量/权限需求：后续 P2 需要有效的非生产 `DATABASE_URL`；本文件仅记录其不存在，未读取或输出任何连接串。
- 隐私、版权或法律影响：无。

## 6. 验收标准

- 自动化：`npm test`，退出码 1；9 个子测试通过，`tests/content-validation.test.ts` 因缺少 `src/data/seed-content.ts` 失败。Node 同时报出 `package.json` 未声明模块类型的性能警告，该警告不是本轮阻断原因。
- 自动化：`npm run lint`，退出码 0。
- 自动化：`npm run build`，退出码 0；Next.js 16.2.10 完成编译、TypeScript 和 14 个静态页面生成；构建日志确认数据库未配置，并提示 edge runtime 页面会禁用静态生成。
- 浏览器：未执行。没有既有本地 Next.js 进程，且本轮不启动或停止进程。
- 数据：无法核验真实数据库；`src/data/seed-content.ts` 缺失，首批 12 个主理论、L1 来源和实体关系均未建立可验证内容事实源。
- 链接/SEO：构建路由表不含 `/theories`、`/scholars` 索引路由；Footer 的对应公开链接为死链。动态详情路由存在，但在无数据库条件下不能作为可用实体内容验证。

## 7. 风险、回退与发布判定

- P0/P1 风险：缺少内容事实源导致测试失败；无数据库使真实实体、搜索和图谱无法验收；首页样例图谱未明显标为 demo；两个 Footer 索引链接无路由；Psychology/Management 的公开选项没有内容证据。
- 回退方式：本轮只新增此文档；删除该文档即可回退本轮变更。
- 发布结论条件：暂不可发布。进入 Prompt 02 不依赖数据库，但必须先建立可追溯的 `seed-content.ts` 并让内容测试全绿；之后仍需完成数据库、运行时、信息架构、图谱/搜索、SEO 和发布验收门禁。

## 8. 执行记录（实施后填写）

- 实际改动：新增本 P0 基线与范围冻结计划；未改动产品代码、测试、schema、seed、环境或部署配置。
- 验证结果：`npm run lint` 与 `npm run build` 成功；`npm test` 如实失败，根因已定位为缺失内容模块。
- 未完成项与原因：未进行数据库、seed 和浏览器验证；前者缺少 `DATABASE_URL`，后者没有已运行的本地站点且本轮范围不启动服务。
- 下一步：按 `prompts/completion/02-content-corpus.md` 建立受内容合同和权威来源约束的首批英文语料；不可通过跳过或删除失败测试来推进。
