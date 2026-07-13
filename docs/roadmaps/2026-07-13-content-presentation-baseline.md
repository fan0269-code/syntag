# C1 内容显示与基线校准：实施计划

> 日期：2026-07-13
> 状态：已完成
> 阶段：C1
> 负责人：Codex
> 关联：用户提供的 `Prompt C1`；`docs/SITE_CONSTRUCTION_PLAYBOOK.md`

## 1. 目标与用户价值

- 让 Education 与 Sociology 范围内的 12 个理论页按 `seed-content.ts` 的真实结构显示内容，而不是把数组、对象或核验记录误判为空。
- 本轮完成后，用户可以在 D1、D2、D3 页面看到与深度合同一致的区块、阅读路径、来源和 L1/L2/L3 核验状态。

## 2. 范围

### 包含

- 12 个理论页的数据与显示矩阵。
- 理论页结构化内容解析、深度区块选择、真实 verification 呈现及回归测试。
- 本路线图与总规划当前基线的校准。

### 不包含

- 理论正文扩写、新学科、新理论、新著作、新概念或视觉重设计。
- 账户、支付、投稿、部署、提交或推送。

## 3. 当前证据与决策

- 现象：`TheoryArticle.tsx` 对多个数组/对象字段调用仅接受字符串的 `text()`，因此已有内容显示为 `being prepared`。
- 现象：页面顶部写死 `Verification pending`，来源区写死一条 L3 pending 文案，没有读取 `content.en.verification` 与 `content.en.sources`。
- 数据事实：`seed-content.ts` 含 12 个主理论，分布为 D3×2、D2×4、D1×6；每篇都有核心区块、阅读路径、来源与三类核验记录，D2/D3 另有研究设计区块。
- 决策：语料仍是唯一作者真相源；本轮只增加纯展示模型和语义化渲染。D1 隐藏合同外高级区块，D2 显示研究设计区块，D3 再显示由现有内容计算的深度覆盖摘要。

## 4. 实施步骤

1. 增加页面展示回归测试 — 文件：`tests/theory-presentation.test.ts` — 产物：12 页结构、深度差异、来源和核验状态断言。
2. 建立纯展示模型 — 文件：`src/lib/theory-presentation.ts` — 产物：把未知 JSON 安全转换成页面可用结构。
3. 接入理论页 — 文件：`src/components/content/TheoryArticle.tsx` — 产物：不再把结构化内容送入字符串兜底。
4. 校准当前基线 — 文件：`docs/SITE_CONSTRUCTION_PLAYBOOK.md` 与本文件 — 产物：保留历史执行记录，只更新当前事实与 C1 结果。

## 5. 数据、内容与安全

- 数据来源与核验等级：不新增外部事实；直接呈现现有 L1 来源、L2 编辑解释和 L3 研究建议记录。
- 数据迁移/seed 影响：无。
- 环境变量/权限需求：浏览器验收使用现有本地开发数据库；不输出连接信息，不执行写库。
- 隐私、版权或法律影响：无新增内容。

## 6. 验收标准

- 自动化：`npm test`、`npm run lint`、`npm run build` 均退出 0。
- 浏览器：桌面端检查 Life Course Theory（D3）、Structuration Theory（D2）、Institutional Theory（D1）。
- 数据：12 页的核心概念、谱系、适用/不适用、误用风险、阅读路径、来源均有展示模型；D2/D3 另有分析、数据、章节与写作建议。
- 核验：页面状态与来源区来自真实 L1/L2/L3 记录，不含硬编码 `Verification pending`。

## 7. 风险、回退与发布判定

- P0/P1 风险：未知 JSON 被错误吞掉；D1 再次显示合同外占位；来源与核验等级映射错误。
- 回退方式：只回退本路线图、展示模型、理论页接入与回归测试。
- 发布结论条件：C1 门禁与三页浏览器检查全部通过；本结论不代表 C2–C8 完成或全站可发布。

## 8. 执行记录（实施后填写）

- 实际改动：新增纯展示模型，把语料中的数组、对象、阅读路径、来源和 verification 安全转换为页面结构；理论页按 D1/D2/D3 合同显示区块，并删除页头与来源区的硬编码待核验状态；增加模型、损坏 verification 降级和页面接线回归测试。
- 验证结果：`npm test`、`npm run lint`、`npm run build` 与 `git diff --check` 均通过；生产构建生成 49 个页面，其中包含 12 个理论详情页。本地生产预览的 12 页均返回 200，`being prepared` 和旧页头硬编码计数均为 0，且都显示正确深度标签与 3 条真实核验记录。应用内浏览器检查 Life Course Theory（D3）、Structuration Theory（D2）和 Institutional Theory（D1）通过，三页均无横向溢出。
- 未完成项与原因：公开线上尚未同步本地修复。2026-07-13 的只读检查显示 `syrtag.com` 三个代表页均返回 200，但仍是 C1 前版本；本阶段明确禁止部署。
- 下一步：C1 本地验收已通过；只有用户另行授权后才进入 C2，且进入前应保留“本地已完成、线上未同步”的状态边界。

## 9. 12 个理论页数据与显示矩阵

| 理论 | 深度 | 核心区块 | 研究设计区块 | 阅读路径/来源/L1-L3 | 本地页面 |
| --- | --- | --- | --- | --- | --- |
| Life Course Theory | D3 | 已呈现 | 已呈现 + 深度覆盖摘要 | 已呈现 | 200，无解析占位 |
| Teacher Identity Theory | D3 | 已呈现 | 已呈现 + 深度覆盖摘要 | 已呈现 | 200，无解析占位 |
| Structuration Theory | D2 | 已呈现 | 已呈现 | 已呈现 | 200，无解析占位 |
| Communities of Practice | D2 | 已呈现 | 已呈现 | 已呈现 | 200，无解析占位 |
| Practice Theory (Bourdieu) | D2 | 已呈现 | 已呈现 | 已呈现 | 200，无解析占位 |
| Social Capital Theory | D2 | 已呈现 | 已呈现 | 已呈现 | 200，无解析占位 |
| Teacher Professional Development Theory | D1 | 已呈现 | 合同不要求，不显示 | 已呈现 | 200，无解析占位 |
| Teacher Life History Research | D1 | 已呈现 | 合同不要求，不显示 | 已呈现 | 200，无解析占位 |
| Educational Equity Theory | D1 | 已呈现 | 合同不要求，不显示 | 已呈现 | 200，无解析占位 |
| Institutional Theory | D1 | 已呈现 | 合同不要求，不显示 | 已呈现 | 200，无解析占位 |
| Street-Level Bureaucracy | D1 | 已呈现 | 合同不要求，不显示 | 已呈现 | 200，无解析占位 |
| Multiple Streams Framework | D1 | 已呈现 | 合同不要求，不显示 | 已呈现 | 200，无解析占位 |

“核心区块”包括定义、起源、核心概念、谱系、适用/不适用与误用风险；“研究设计区块”包括分析维度、数据收集、章节结构和理论适切性写法。所有行均直接对应 `src/data/seed-content.ts`，未在 C1 扩写正文。
