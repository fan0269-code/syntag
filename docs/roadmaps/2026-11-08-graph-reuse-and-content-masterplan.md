# 图谱复用选型 + 全站内容总规划

> 日期：2026-11-08  
> 状态：计划中（待主人拍板）  
> 阶段：P0 规划 / P1 内容闸前置  
> 负责人：Cloud agent 调研；发布与解档须主人授权  
> 关联：N22 自绘 Canvas 决策；FAN-247；`docs/standards/content-writing-standard.md`；AdSense 就绪闸（不在本计划申请）

## 1. 目标与用户价值

- 判断：有没有现成 GitHub 图谱项目能接到 Syrtag，真正降低开发强度，而不是换一套更重的引擎。
- 给出：在广告关闭、公开目录为空（FAN-247）的前提下，教育/社会学内容如何少而深地重建可审页面。
- 用户可观察变化：主人拿到一份可拍板的选型表 + 分阶段内容闸；不假装已有可发布学术正文。

## 2. 范围

### 包含

- GitHub / 主流开源图谱库调研与和本仓现状对照。
- 内容总规划：公开边界、旗舰最小集、闸门顺序、明确不做项。

### 不包含

- 本轮不改 `GraphCanvas` 实现、不引入新依赖、不解档 FAN-247、不写学术主张、不申请 AdSense、不修生产 521、不部署。

## 3. 当前证据与决策

### 3.1 本仓图谱现状

- 渲染：`src/components/graph/GraphCanvas.tsx` 原生 2D Canvas + `requestAnimationFrame` 自绘。
- 决策记录 **N22**：有意不引入 React Flow / Sigma.js；小规模（约 12 节点）布局与无障碍路径已按现实现验收。
- 数据：`/api/graph` + Prisma published-only；生产禁止 demo 样例图。
- 内容：当前 seed 计数约为 disciplines 2 archived、fields 6 archived、theories 12 archived、scholars 7 archived + 3 draft、works 19 archived、concepts 24 archived、topics 4 archived + 4 draft；**published = 0**。

### 3.2 根因 / 假设

- 开发强度的主瓶颈**不是**缺一个力导向布局库，而是：**没有可公开 published 实体页**；图谱没有节点可画。
- 换渲染库只能降低「交互/布局」工时；不能代替 claim ledger、人审、来源核验。

### 3.3 需要主人确认的决策

1. 图谱引擎：继续自绘 / 引入 `react-force-graph-2d` 做封装 / 引入 Sigma+graphology（见 §4）。
2. 内容：是否授权对 **已有 archived 语料** 做「最小旗舰解档」人审（不是批量解档）。
3. 顺序：是否坚持「先修 521，再公开实体」。

### 3.4 不能假设的事实

- 生产源站是否已恢复。
- 哪个 archived 理论已完成 claim-level 人审并可解档。
- AdSense / pub-id 账号侧状态。

## 4. GitHub 可用项目调研（2026-11-08）

方法：`gh api` / `gh search` 取 star、许可、描述；交叉公开选型指南。以下 star 数为当日 API 快照，会变动。

### 4.1 渲染库（可嵌进 Next.js App Router 客户端组件）

| 项目 | Stars（约） | License | 适合 Syrtag？ | 降强度判断 |
| --- | --- | --- | --- | --- |
| [vasturiano/react-force-graph](https://github.com/vasturiano/react-force-graph) | ~3.4k | MIT | **首选候选**：React 组件、`nodes/links` 直喂、2D Canvas 与现有尺度匹配（数十～数百节点） | 高：拖拽/缩放/点击开箱即用，替换自绘交互成本相对低 |
| [jacomyal/sigma.js](https://github.com/jacomyal/sigma.js) + [graphology/graphology](https://github.com/graphology/graphology) + [sim51/react-sigma](https://github.com/sim51/react-sigma) | ~12.2k / ~1.8k / ~240 | MIT | 节点上千、要 WebGL 时再上；需 graphology 数据层 | 中：长期可扩展，短期集成与调试税更高 |
| [cytoscape/cytoscape.js](https://github.com/cytoscape/cytoscape.js) | ~11.3k | MIT | 分析布局/样式最强；学术网常用 | 中低：功能过剩，React 封装偏命令式 |
| [visjs/vis-network](https://github.com/visjs/vis-network) | ~3.6k | Apache-2.0 | 仪表盘网络图 | 中：物理引擎要调稳，包体偏大 |
| [xyflow/xyflow](https://github.com/xyflow/xyflow)（React Flow） | ~38.9k | MIT | **不推荐作知识探索主图**：面向流程/编辑器节点 UI，与谱系探索心智不同；且 N22 已排除 | 低：看起来「好用」但会改产品形态 |

### 4.2 「整站知识图谱产品 / 学术 KG」

| 类型 | 代表 | 结论 |
| --- | --- | --- |
| 学术 KG 数据集 / 研究代码 | KG20C、DBLP-QuAD、各类 scholarly-knowledge-graph NLP 管线 | **不能直接挂到 Syrtag**：数据域、许可证、实体模型与教育/社会学语料合同不一致；易变成灌站 |
| Wiki / 文档花园图 | Telescope、各类 digital garden graph | 产品目标不同；可抄交互灵感，不可整仓搬入 |
| 代码知识图谱可视化 | brain-nexus 等 Sigma 示例 | 可参考 UI，数据层不可用 |

**禁止路径：** 把外部学术 KG 或 AI 抽实体结果批量 seed 成 published。违反 `AGENTS.md` / 内容写作标准。

### 4.3 建议决策（供拍板，非已执行）

```text
推荐默认：先不换引擎；把工时压在「最小旗舰内容闸」。
若自绘维护成本已高于收益，且节点仍 < ~200：试点 react-force-graph-2d，保留现有 GraphData 合同与 published-only。
仅当未来公开图 > ~1k 节点或自绘性能不够：再立项 Sigma.js + graphology + react-sigma。
不采用 React Flow 作主探索图。
不采用整站 ORKG / 外部 scholarly KG 作内容源。
```

降强度真实来源：

1. **内容侧**：复用已有 archived 语料与 claim 研究材料，人审后少而深解档，而不是重写引擎。  
2. **工程侧**：若换库，只换渲染层，不换 Prisma schema / seed / SEO 合同。  
3. **产品侧**：空目录时继续 SSR 信任页叙事，图谱不是唯一内容。

## 5. 全站内容总规划

### 5.1 产品定位（不变）

英文硕博导航：研究问题 → 理论路径 → 来源可追溯实体页；图谱是增强，不是唯一内容。范围：**仅 Education + Sociology**。不做代写、学历中介、期刊替代、AI 灌站。

### 5.2 公开边界（硬约束）

| 规则 | 说明 |
| --- | --- |
| 只公开 `status=published` | draft / archived / demo 永不进 sitemap、搜索、static params |
| FAN-247 不解档即公开 | 解档必须主人授权 + 人审 + 来源闸；禁止「为 AdSense 凑页」 |
| 广告保持关闭 | Privacy / About / ads 信号一致；本规划不接 tag |
| 种子 ≠ 定论 | 仓内 prose 再完整，未过发布闸也不得对外写成已发表 |

### 5.3 最小可审内容集（旗舰闸，少而深）

目标不是篇数，而是「不像空壳」：每页可读摘要 + 边界 + 可点来源 + 核验日。

**建议 Phase F0（主人拍板后）最小集：**

| 优先级 | 类型 | 候选（均来自现有 archived 语料，非新建空壳） | 先决条件 |
| --- | --- | --- | --- |
| F0-1 | Topic | 从 4 个 archived topics 中选 1（如教师专业认同 / 教育过渡） | Topic–theory 关系风险表述已人审；pathway 有来源 |
| F0-2 | Theory D3 | `life-course-theory` **或** `teacher-identity-theory`（先做完 claim ledger 的那一个） | claim ledger 行级 PASS；核验日真实；无仅维基实质主张 |
| F0-3 | Scholar + Work | 与 F0-2 绑定的 1 学者 + 1 代表作 | 身份/书目事实用 OpenAlex/Crossref 等；实质主张有 locator |
| F0-4 | Discipline 入口文 | `education` 或 `sociology` 索引导语（非空列表页） | 诚实写「当前仅若干 published」；不解档全部 field |

**Phase F1（F0 过闸后）：** 同簇再解档 1 个 D2 理论 + 2–3 concepts（仅与 F0 路径直接相关）。  
**Phase F2：** 第二个 D3。  
**明确不做：** Psychology / Management 扩科；批量解档 58 页；无来源 AI 扩写。

### 5.4 内容生产闸（每页同一流水线）

```text
研究包 → 独立审阅 → 润色 → 版式 → 最终审计 → 主人批准 → corpus 实现 → content:check → 本地 seed/build → PR → （另授权）deploy
```

任何一步 FAIL 则停。Agent 的 PASS ≠ 主人批准。

### 5.5 站点信息架构（内容可见性）

| 表面 | 空目录时 | 有旗舰 published 时 |
| --- | --- | --- |
| `/` | SSR 说明 + 信任链；无假图谱 | 真实 genealogy/scholars/topics 图 |
| `/about` `/privacy` `/terms` `/editorial-policy` `/corrections` | 已具备；广告关闭同向 | 不变，除非开广告 |
| 实体索引 | 空列表诚实文案 | 仅 published |
| `/pricing` | Free = 无付费墙，不声称目录充实 | 同左 |
| Framework Builder | planned / not live | 同左 |

### 5.6 与变现 / AdSense 的关系（诚实）

```text
521 恢复 → F0 旗舰可读 → 主人填运营者身份/联系 → 再谈申请
图谱库选型 ≠ AdSense 就绪
本规划不授权申请、不买量、不灌站
```

## 6. 实施步骤（仅规划；本 PR 只落文档）

1. 主人在 §3.3 三选一拍板图谱策略。  
2. 主人指定 F0-2 先做哪一个 D3，并授权 claim ledger / 人审包路径。  
3. 另开内容 PR：只解档 allowlist slug；测试锁定 published 计数与 sitemap。  
4. 若选 `react-force-graph-2d`：另开工程 PR，只替换渲染层，保留 `GraphData` 与 a11y 合同。  
5. 生产 521 由运维另案；内容 PR 不捆绑部署。

## 7. 验收标准（规划本身）

- 文档列出可核验 GitHub URL、许可、适用结论。  
- 内容闸不出现「凑 N 篇」「解档全部 FAN-247」。  
- 明确推荐默认：内容优先于换引擎。

## 8. 风险与回退

| 风险 | 缓解 |
| --- | --- |
| 换 React Flow / 整站 KG 导致产品跑偏 | 本规划显式排除 |
| 未人审解档冲页数 | allowlist + content:check + 人审闸 |
| 以为换库即「网站完成」 | §4.3 / §5.6 写死：瓶颈在内容 |

回退：不合并任何解档或依赖变更即可；本文档可单独保留为决策依据。

## 9. 执行记录

- 实际改动：本文件 + 画布摘要；无代码依赖变更。  
- 验证：GitHub API 抽样 star/license；对照仓内 N22 与 FAN-247 计数。  
- 下一步：主人拍板 §3.3；再开内容或渲染试点 PR。
