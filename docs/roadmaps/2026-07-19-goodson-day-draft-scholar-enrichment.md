# Goodson 与 Day Scholar 草稿证据完善：实施计划

> 日期：2026-07-19
> 状态：实施中
> 阶段：P1 内容语料
> 负责人：Codex
> 关联：`docs/superpowers/plans/2026-07-19-second-scholar-draft-enrichment-codex-execution.md`

## 1. 目标与用户价值
为 Teacher Life History Research 与 Teacher Professional Development 两条既有理论路径补充可追溯的 Scholar 草稿资产，为未来人工审核与发布建立可靠底稿；本轮公开用户不应看到新增 Scholar 页面。

## 2. 范围
### 包含
- Ivor F. Goodson person-specific evidence pack 与 draft Scholar。
- Christopher Day person-specific evidence pack 与 draft Scholar。
- 各一条 `key_contributor` raw TheoryScholar 关系。
- draft isolation、双 seed、build、smoke 与 E2E 证据。

### 不包含
- 不发布两位 Scholar。
- 不新增或修改 Theory、Work、Concept、Topic、Field、Discipline、Genealogy。
- 不修改 schema、migration、route、component、search、sitemap 或部署。
- 不执行 commit、push、PR、merge 或 deploy。

## 3. 当前证据与决策
- Goodson 复用现有 `goodson-2013-narrative-theory` 等 Work 来源；身份来源候选为 University of Brighton 与 BERA 页面。
- Day 复用现有 `day-1999-developing-teachers` 与 `teacher-development-day-etal-2006`；身份来源候选为 University of Nottingham 页面。
- 两人均固定为 `draft`；若证据不可访问、身份对应不清或关系只能靠推断，则该候选 `STOP`，不进入 corpus。
- 技术校验通过不等于 claim-level academic approval。

## 4. 实施步骤
1. 建立两人的 evidence pack 与 claim matrix。
2. 先写 draft Scholar 合同测试，再新增最小 corpus batch。
3. 更新 corpus 与数据库回归，执行本地双 seed。
4. fresh build 后验证两份草稿不进入任何 public surface。
5. 回写实际命令、计数、阻塞与结论。

## 5. 数据、内容与安全
- 数据来源：大学官方页、BERA、现有出版社/DOI 记录。
- 数据迁移/seed 影响：无 migration；raw Scholar 与 raw TheoryScholar 最多各增加 2，public 数量不变。
- 环境变量：仅在确认 `DATABASE_URL` 指向安全本地非生产库后执行数据库命令。
- 不记录连接串、token 或其他密钥。

## 6. 验收标准
- 两份 Scholar 若进入 corpus，状态必须为 `draft` 且无 `publishedAt`。
- Raw Scholar 8 → 10；Published Scholar 保持 7。
- Raw TheoryScholar 8 → 10；Public TheoryScholar 保持 7。
- `/scholars`、search、sitemap、graph 和 detail static routes 均不暴露两份草稿。
- focused tests、full tests、typecheck、lint、content check、双 seed integration、fresh build、required smoke、targeted/full E2E 全绿且关键项不 skip。

## 7. 风险、回退与发布判定
- 最大风险是 founder 误归因、把来源列出误称 claim-level verified、以及 draft 泄漏。
- 回退方式（仅建议，不在本批次执行）：由于 seed 使用 upsert，单独移除本批次 module 聚合并重新 seed 不会删除已写入数据库的两位 Scholar。安全回退必须先按精确复合键删除 `teacher-life-history-research:ivor-f-goodson` 与 `teacher-professional-development-theory:christopher-day` 两条 TheoryScholar，再按精确 slug 删除 `ivor-f-goodson` 与 `christopher-day` 两条 Scholar；随后移除本批次 module 聚合，重新 seed 并运行 integration 验证。不得扩大删除范围，也不删除或改写既有 corpus。
- 本轮不能形成公开发布结论；最强结论是“本地验证的 draft-only content asset”。

## 8. 执行记录（实施后填写）
- 实际改动：
  - 创建 `docs/research/2026-07-19-goodson-day-scholar-evidence.md`，包含 Goodson 与 Day 的来源登记、claim matrix、归因边界、DRAFT/STOP 决策和未来人工审查要求。
  - 创建 `src/data/corpus/content-batches/2026-07-19-goodson-day-draft-scholars.ts`，仅提供两份 `draft` Scholar（Ivor F. Goodson、Christopher Day）和两条 raw `key_contributor` TheoryScholar 关系；两人均无 `publishedAt`。
  - 创建 `tests/second-scholar-enrichment.test.ts` 与 `tests/e2e/second-scholar-enrichment.spec.ts`，覆盖草稿合同和 public-surface isolation。
  - 修改 `src/data/corpus/shared/entities.ts`、`src/lib/seed-verification.ts`、`tests/content-validation.test.ts`、`tests/seed-corpus-regression.test.ts`、`tests/seed-integration.test.ts`，以聚合本批次、验证 raw/public/searchable 边界并回归 seed 计数。
  - 本批次未修改 `.gitignore`、`.superpowers/**`、`.claude/**`、`package.json`、`prisma/**`、`.github/**` 或 `ops/**`；这些路径在启动前已有用户变更或未跟踪文件，均予以保留。
- 候选与来源决策：
  - Ivor F. Goodson：University of Brighton 2018 页面、BERA profile、Google Books 与 WorldCat/OCLC 书目记录支持时间有界的身份、作品与研究定位；`teacher-life-history-research` 的 `key_contributor` 仅为 L2 有界编辑性综合。决策：`DRAFT`。
  - Christopher Day：University of Nottingham profile 与既有出版社/DOI 记录支持显示身份、作品与研究定位；`teacher-professional-development-theory` 的 `key_contributor` 仅为 L2、多元条目中的有界编辑性综合。决策：`DRAFT`。
  - 两人均不是 founder/sole founder，未写入审稿人、批准记录、`verifiedAt` 或 claim-level approval；草稿不构成公开发布批准。
- RED → GREEN 记录：
  - Task 3：`node --env-file-if-exists=.env --experimental-strip-types --test tests/second-scholar-enrichment.test.ts` 的 RED 真实退出码为 1（0 pass / 1 fail / 0 skip）；失败为 `AssertionError: ivor-f-goodson exists`，不是语法或 import 错误。新增最小 corpus 后，同一命令 GREEN 退出码为 0（1 / 0 / 0）。
  - Task 4：`npm run content:check` 首次退出码为 1，原因是 source-only 的 1992/2001 记录含无效可选 `work_slugs`；仅移除这两个可选字段后重跑退出码为 0。
  - Task 5：三文件 focused suite 退出码为 0（21 / 0 / 0）。
  - Task 6：integration 在受限环境中退出码为 1（EPERM，0 / 1 / 0）；提升后在 seed 前按预期 RED，退出码为 1（旧数据库 `totalScholarCount` 为 8，预期 10，0 / 1 / 0）。补齐验证后，typecheck 退出码为 0，三文件静态 suite 退出码为 0（21 / 0 / 0）。
  - Task 7：E2E spec 静态审计的 `git diff --check` 退出码为 0；禁止 `skip`/`only`/`TODO` 搜索退出码为 1（无匹配）。该任务按计划未运行 E2E。
- 数据库与幂等性：
  - 数据库安全决策：确认本地 loopback、非生产数据库后才继续；连接串未记录。
  - `npm run db:migrate` 在受限环境退出码为 1（EPERM），提升后退出码为 0（in-sync）。
  - Seed #1 在受限环境退出码为 1，提升后退出码为 0；Integration #1 在受限环境退出码为 1，提升后退出码为 0（1 / 0 / 0）。
  - Seed #2 提升后退出码为 0；Integration #2 提升后退出码为 0（1 / 0 / 0）。
  - seed 后计数为 raw Scholars 10、published Scholars 7、raw TheoryScholar 10、public TheoryScholar 7、searchable Scholars 7；八条 genealogy 保持不变。两位候选均为 `draft` 且 `publishedAt` 缺失。
- 工程门禁：
  - Task 8 focused tests 退出码为 0（21 / 0 / 0）；typecheck、lint、`content:check`、`git diff --check` 均退出码为 0。
  - Task 10：typecheck 退出码为 0；`npm test` 在受限环境退出码为 1（EPERM，119 / 1 / 1），相同命令提升后退出码为 0（120 / 0 / 1；该 skip 为既有、非 required-smoke 项，未被计为关键通过）；lint、`content:check`、build 均退出码为 0。build 产生 96 页；显式 required build smoke 退出码为 0（1 / 0 / 0）。
  - Task 11：targeted E2E 在受限环境因端口绑定退出码为 1，提升后退出码为 0（5 / 0 / 0）。full E2E 在受限环境端口绑定退出码为 1；提升后首次退出码为 1（34 / 2 / 0），原命令重试仍退出码为 1（33 / 3 / 0）。五个失败均来自 `assertBrowserHealth` 观察到的静态 JS `net::ERR_ABORTED`，不是 Axe serious/critical violation 或 HTTP 4xx/5xx。
  - 最终复核修正后重跑：targeted 命令先因源码新于 `.next/BUILD_ID` 而在 fresh-build preflight 退出码为 1；此时 full 未运行。获授权仅执行 `npm run build`，退出码为 0（96 页；required build smoke 1 / 0 / 0）。随后 targeted 在受限环境端口绑定退出码为 1，提升后退出码为 0（5 / 0 / 0）；full 在受限环境端口绑定退出码为 1，提升后的最终可核验运行退出码为 1（34 / 2 / 0）。本批次新 spec 在 full 中仍为 5 / 0 / 0；两项失败均位于既有 `tests/e2e/content-enrichment.spec.ts`，仍为静态 JS `net::ERR_ABORTED` health-watcher 失败，未修改该既有 spec 或 watcher。
  - 手动 desktop 与 375×812 矩阵：两位草稿均不在 index、search link、sitemap、Scholar graph 中，detail 均不可用；Jean Lave 可见；Kingdon 仍不在公开面且 detail 不可用；375px 无水平溢出；浏览器 error/warn 数组为空，sitemap HTTP 200。
- Public-surface 结论：Goodson 与 Day 仅作为本地 draft-only content asset 存储；公开 Scholar 增量为 0，published/searchable Scholar 仍为 7。由于 full E2E 未全绿，本批次结果为 `PARTIALLY_PASSED`，状态保持“实施中”。
- 未完成项与原因：full E2E 的多次实际运行均被 browser-health 的 `net::ERR_ABORTED` 阻断，不能把该关键门禁或整个批次声明为通过；这不是内容发布阻塞的解除，也不构成任何公开验证结论。
- 最终复核未改变该判定：新 `second-scholar-enrichment.spec.ts` 已稳定通过 targeted 与 full 内的全部 5 项，但相同 full 命令仍因既有 `content-enrichment.spec.ts` 的 `net::ERR_ABORTED` 退出 1；因此保持 `PARTIALLY_PASSED` 与“实施中”，不独立提升状态。
- 最终 Git 审计（均为只读，真实退出码）：
  - `git status --short --branch`：0；分支 `feature/content-enrichment-batch-1`，启动前受保护路径的 `.gitignore`、`.superpowers/**`、`.claude/**` 变更/未跟踪项仍存在且未被改写。
  - `git diff --name-status`：0；追踪差异仍限于启动前受保护路径和本批次允许的修改文件。
  - `git diff --stat`：0；9 个已追踪文件为已有工作树差异，未将本批次未跟踪新文件误作已追踪 diff。
  - `git diff --check`：0。
  - `git diff -- package.json prisma .github ops .gitignore .superpowers .claude`：0；输出只显示启动前 `.gitignore` 与 `.superpowers/**` 差异；`.claude/**` 为启动前未跟踪项。
  - `git rev-parse HEAD`：0；初始和最终 HEAD 均为 `9974fe335a2c8249e90fdf31a9b27f1bd21474f3`。`git rev-list --left-right --count origin/main...HEAD`：0，结果 `0 0`。
  - 语料只读计数脚本：0；Scholars 10、published Scholars 7、TheoryScholar 10、public TheoryScholar 7、genealogy 8；两位候选均为 `draft` 且无 `publishedAt`。
  - 对本批次新建文件执行常见 credential-marker 文件名扫描：0；仅命中本路线图中“token 不记录”的禁止性文字，未输出或记录任何连接串、token 或密钥值。
  - 未跟踪文件清单已核对：`.claude/hooks/block-dangerous-git.sh`、`.claude/settings.json`、本计划文件及本批次允许的新建 evidence、roadmap、corpus batch 与测试文件；未发现超范围新增。
- Git 与发布声明：未执行 commit、push、PR、merge 或 deploy。
- 下一步：仅在先定位并消除 full E2E 的 `net::ERR_ABORTED` health-watcher 失败、再以相同命令得到非 skip 的全绿结果后，重新进行只读审计；此建议不自动执行。
