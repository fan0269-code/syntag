# 内容扩学科路线图

> 日期：2026-07-17<br>
> 状态：规划完成；公开扩科 No-Go；未授权录入或发布<br>
> 当前公开学科：Education、Sociology<br>
> 本轮边界：只定义扩学科流程、优先级、候选清单和触发门槛；不修改 `src/data/seed-content.ts`

## 1. 目标、原则与完成定义

本路线图把“扩一个学科”定义为一个可独立审核、可回退、可复跑的内容批次，而不是简单增加若干理论名。每个批次必须同时交付学科/领域入口、分层理论内容、可追溯来源、核验记录及与既有图谱的有证据关系。

核心原则：

- 先补现有 Education、Sociology 的谱系连接，再开新学科；不以节点数替代图谱质量。
- 先研究与核验，后写正文；OpenAlex、Crossref、ORCID 用于发现或核对元数据，一手论文/著作、出版社、期刊、大学或权威机构页面用于支持实质性论断。
- 所有实体复用 `src/data/templates/*` 的 typed contract，不在页面组件或临时 JSON 中另造内容结构。
- `published` 是核验结果，不是写作进度。来源或关系无法核实时保留 `pending`/`draft`，不得进入公开读取、static params 或 sitemap。
- 深度等级表达内容覆盖范围：D3 是学科骨架，D2 是主要分析路径，D1 是有边界的入口；不代表学术地位排名。

一个扩学科批次只有在本文件第 4 节的指标全部满足、批次内容通过 `validateSeedCorpus()` 与 `npm run content:check` 后，才可提交单独的内容实施窗口。本文自身不构成实施授权。

## 2. 半结构化内容批次录入 SOP

### 2.1 批次边界与 D3/D2/D1 配额

每批次只录入一个学科，首批采用与现有语料一致的 **D3 × 2、D2 × 4、D1 × 6** 结构：

| 层级 | 在批次中的职责 | 必须覆盖的内容 |
| --- | --- | --- |
| D3 × 2 | 学科骨架理论；承担主要导航和跨学科连接 | 完整核心、扩展、深描与研究设计区块；起源、历史发展、关键学者、相邻理论、批评、解释机制、比较与边界条件；至少 1 条有来源的 genealogy 边 |
| D2 × 4 | 学科内主要研究问题或机制路径 | 核心与扩展区块；概念、适用/不适用问题、误用风险、操作化、章节与写作建议、来源和核验；至少提出并核验其与 D3 或既有理论的关系 |
| D1 × 6 | 有边界的专题入口或补充视角 | 定义、起源、核心概念、谱系说明、适用/不适用问题、误用风险；明确它是 theory、framework、model 还是 research tradition，不把编辑性总称伪装成单一理论 |

配额不是发布承诺。候选若无法达到对应合同深度，应降级深度、保留 draft，或移出本批次；不得用空泛文字凑齐数量。

### 2.2 前置盘点与研究包

1. **冻结批次范围。** 写明学科 slug、拟设 fields、12 个理论候选及其 D3/D2/D1 层级；一个候选只设一个主深度。
2. **计算现有图谱门槛。** 按第 4 节口径计算 Education、Sociology 的 genealogy 边密度。未达标时，本窗口只补既有节点间有证据的边，不开始新学科数据录入。
3. **建立研究包。** 复用 `docs/research/` 的证据包格式，为每个候选记录：准确性质、核心问题、主要概念、起源/发展、适用边界、误用风险、候选著作/学者以及拟议关系。研究包不是可直接发布的页面文案。
4. **建立来源登记。** 每条实体至少有一个可访问的 source URL 和 source type。合同内 source type 使用 `doi`、`publisher`、`university`、`library`、`journal`、`authoritative_web`；OpenAlex、Crossref、ORCID 作为检索/元数据核验渠道时，在研究包中保留其用途，最终落库仍映射到合同支持的类型，并优先保留其指向的一手记录。
5. **先审关系，再写长文。** 每条新 genealogy 关系需明确两个端点、关系类型、英文说明、支持该关系的 source URL，以及“来源直接陈述”或“编辑综合”的证据边界。仅有关键词相似、共同作者或同属一个学科，不足以建立边。

### 2.3 Typed contract 录入模板

实施窗口不得另建平行 schema，应按实体类型复用：

- 理论：`src/data/templates/theory-template.ts`
- 学科/领域/研究路径：`src/data/templates/pathway-template.ts`
- 学者：`src/data/templates/scholar-template.ts`
- 著作：`src/data/templates/work-template.ts`
- 概念及其他知识实体：`src/data/templates/knowledge-entity-template.ts`
- 主题：`src/data/templates/topic-template.ts`

每条实体的最小录入卡应包含：

```text
entityType / slug / titleEn / status / depth（仅理论）
scope：准确性质与不应声称的内容
sources[]：citation + URL + source type + supports[]
verification[]：claim + evidence level + status + source reference + verifiedAt
relations[]：端点 + 关系类型 + 说明 + source URL
editorialDecision：publish / draft / pending 及理由
```

**合同差距：**截至本路线图编写时，现有 typed `VerificationEntry` 尚无 `verifiedAt` 字段。扩学科实施前必须先在相关 typed contract、校验器与消费端统一加入该字段，格式固定为 ISO `YYYY-MM-DD`；不能把日期藏在 notes 中。该合同变更应作为实施窗口的显式任务并先通过类型与测试审查，本路线图不修改它。`verifiedAt` 写最后一次实际打开并核对来源的日期，不得用文件创建日或批次发布日期代替。

### 2.4 核验、状态与发布门禁

1. 对每条事实/关系逐项核验：L1 绑定可直接支持 claim 的来源；L2 明示为编辑综合；L3 明示为情境化建议或待研究设计决定。
2. URL 不可访问、来源只能支持元数据不能支持实质性论断、作者身份无法由 ORCID/大学档案等确认，或跨理论关系仅为推断时，标记 `pending`。现有合同若尚无实体级 `pending`，用 `status: "draft"` 承载公开边界，并在核验记录中保留 pending 原因。
3. 任何含 pending 必要论断、缺 source URL/type、缺核验日期，或 D3 无 genealogy 关系的实体均不得 `published`。
4. 将完整候选 corpus 传入 `validateSeedCorpus()`；不得只校验新增数组而忽略与现有端点、来源和关系的整体一致性。
5. 运行 `npm run content:check`。它必须同时覆盖 typed corpus 校验、可追溯来源和 D3 谱系要求；任一错误即停止，不 seed、不生成公开路径。
6. 内容实施窗口的建议检查顺序为：`npm run typecheck` → 相关测试 → `npm run content:check` → `npm run build`。只有全部通过且审稿人确认发布边界，才允许把合格实体切为 `published`。

### 2.5 批次交付与回退

每批次应附一份变更清单：新增/复用实体、D3/D2/D1 数量、来源与核验日期、genealogy 新边、跨学科边、pending 项和各门禁结果。若任一 D3 骨架候选失败，整批次保持 draft；D1/D2 个别候选失败可移出批次，但必须重新确认配额和图谱指标。回退以移除该学科批次的公开状态及关系为界，不影响既有学科内容。

## 3. 扩学科优先级与 Psychology 首批草案

### 3.1 优先级排序与理由

| 顺位 | 学科 | 纳入理由 | 启动前提 |
| --- | --- | --- | --- |
| 第 3 学科 | Psychology | 与现有 Teacher Identity Theory 在身份、自我与能动性研究上可形成有来源连接；与 Life Course Theory 在发展、时间与生命历程上有直接交叉。现有 playbook 已预留 Psychology 名称，导航扩展成本较低。 | 至少核验 4 条跨现有图关系；不得把心理发展与社会生命历程混为同一理论 |
| 第 4 学科 | Management / Organizational Behavior | 可复用现有组织社会学入口，并与 Institutional Theory 的合法性/组织场域路径、Multiple Streams Framework 的组织决策或政策过程边界形成候选交叉。 | Psychology 批次稳定后单独立项；先确认哪些内容属于 OB、organization theory 或 public policy，避免学科归属混写 |

暂不纳入与现有 12 个理论没有可核验交叉、且需要独立来源/核验体系的学科，例如以临床诊断、医学疗效、法律规范或工程技术标准为主要证据对象的方向。它们需要不同的权威来源层级、时效与风险审查，不能沿用本批次的一般社会科学核验流程。候选学科只有在第 4 节全部达标后才能进入排序；“热门”“节点多”或检索结果多不构成提前纳入理由。

### 3.2 Psychology 首批内容清单草案

以下仅是**研究包候选**，不是已核验或已发布内容。最终层级和名称须根据一手文献的实际理论性质调整。

| 深度 | 候选 | 入选目的 / 与现有图的候选连接 | 拟核验来源类型 |
| --- | --- | --- | --- |
| D3 | Social Identity Theory | 身份、自我分类与群体关系骨架；候选连接 Teacher Identity Theory、Social Capital Theory | 一手论文/著作；Crossref/DOI 元数据；出版社或期刊记录；作者 ORCID/大学档案 |
| D3 | Life-Span Developmental Psychology | 发展、时间与情境骨架；候选连接 Life Course Theory，并严格区分心理发展与社会学 life-course perspective | 一手著作/综述；期刊/DOI；出版社；OpenAlex/Crossref 用于文献定位 |
| D2 | Self-Determination Theory | 动机、需要与情境支持路径；候选连接 Teacher Professional Development | 一手论文；官方理论项目页作辅助；Crossref/DOI；大学档案/ORCID |
| D2 | Social Cognitive Theory | 个人、行为与环境交互以及自我效能路径；候选连接 Teacher Identity、教师发展 | 一手著作/论文；出版社；期刊/DOI；大学档案 |
| D2 | Ecological Systems Theory | 嵌套情境与发展路径；候选连接 Life Course、Educational Equity | 一手著作；出版社/图书馆书目；期刊/DOI；OpenAlex 仅作发现 |
| D2 | Attachment Theory | 关系与发展路径，用作心理学内部重要分支并检验其与 linked lives 的边界，而非直接等同 Life Course | 一手著作/论文；出版社/图书馆；期刊/DOI；作者权威档案 |
| D1 | Dialogical Self Theory | 为 Teacher Identity 研究包已出现的 dialogical approach 提供受限入口 | 一手著作/论文；出版社；期刊/DOI；ORCID/大学档案 |
| D1 | Identity Status Model | 身份探索与承诺的研究模型；与身份理论形成对照 | 一手论文；期刊/DOI；Crossref；大学档案 |
| D1 | Possible Selves | 未来自我与动机入口；候选连接 Teacher Identity 的 future perspective | 一手论文；期刊/DOI；Crossref/OpenAlex 定位；大学档案 |
| D1 | Theory of Planned Behavior | 意向、规范与控制感入口；用于与结构/制度解释划界 | 一手论文；期刊/DOI；作者大学主页或 ORCID |
| D1 | Transactional Model of Stress and Coping | 评价与应对过程入口；不得泛化为临床疗效框架 | 一手著作/论文；出版社；期刊/DOI；图书馆记录 |
| D1 | Stage Theory of Cognitive Development | 经典发展理论入口；需明确历史贡献、批评及适用边界 | 一手著作；出版社/图书馆；权威期刊综述；Crossref/OpenAlex 定位 |

研究时优先扩展 `docs/research/2026-07-13-teacher-identity-theory-c2.md` 和 `docs/research/2026-07-13-life-course-theory-c2.md` 已保留的心理学交叉线索，但不得把这些既有研究包当成 Psychology 候选已经核验的证据。每个候选仍需独立研究包和逐条来源审查。

## 4. 扩学科触发标准（按指标，不按时间）

新学科只有同时满足 A、B、C 三道门槛才可进入内容实施；任一不满足均保持 roadmap/research 状态。

### A. 现有学科 genealogy 边密度达标

按学科分别计算：

```text
N = 与该学科存在 primary 或 secondary 映射的已发布理论数
E = 这些理论之间已核验的唯一 genealogy 无向节点对数
边密度 = E / [N × (N - 1) / 2]
```

测算时把相同两个节点间的多条方向/关系视为一个无向节点对，避免双向边或多标签抬高密度；只计算两端均已发布、description 非空、且关系来源已核验的边。门槛为：**Education 与 Sociology 各自边密度均 ≥ 0.20，且每个学科至少 80% 的已发布理论拥有 1 条学科内 genealogy 边。**

以本路线图编写时的 seed 结构作静态基线（最终启动时必须重算）：Education 为 N=9、E=5、密度 5/36≈0.139，尚未达标；Sociology 为 N=6、E=3、密度 3/15=0.20，但仍需检查 80% 节点覆盖率。因此当前结论是**不得直接扩科，应先补 Education 的有证据 genealogy 边及两学科孤立节点**。基线只是结构测算，不代表现有边已完成本节要求的逐边来源核验。

### B. 新学科候选有可核实来源

- 12 个理论候选每条至少有 2 个独立、可访问的权威来源，其中至少 1 个是一手论文/著作或其官方出版社/期刊记录。
- 每个 D3 候选至少有 3 个独立来源，覆盖起源/核心概念、发展或批评、以及至少一条 genealogy 关系。
- 所有拟发布实体均有 source URL、合同支持的 source type 和实际核验日 `verifiedAt`；必要论断没有 pending。
- OpenAlex/Crossref/ORCID 只提供发现或结构化事实时，不得单独承担实质性理论论断。

### C. 与现有图的交叉关系数达到阈值

门槛为：**至少 4 个可核验的跨学科唯一节点对，连接至少 3 个新学科理论与至少 3 个现有理论；其中至少 1 条连接 Education 主映射理论、至少 1 条连接 Sociology 主映射理论。**

测算口径：一端必须是新学科候选理论，另一端必须是当前 Education/Sociology 已发布理论；同一节点对不论方向或多种 relation type 只计 1；关系必须有明确类型、非空说明、source URL，并在核验记录中标明直接证据或有边界的 L2 编辑综合。仅共享关键词、学者、著作或研究对象不计数，pending 关系不计数，新学科内部关系不计入该阈值。

阈值设为 4，是为了避免新学科成为只靠单一“桥接理论”挂接的孤岛，同时仍允许首批 12 节点在有限人工核验量下启动。满足数量后仍需人工审查关系是否集中于一个节点；如 4 条边全部依赖同一现有或新节点，视为不达标。

### 4.1 Go / No-Go 记录

启动实施窗口时应在 roadmap 追加一次只读测算记录：计算日期、N/E/密度、节点覆盖率、来源合格数、D3 来源数、跨学科唯一节点对清单、pending 项与结论。只有三项均为 Go，才能提出修改 `seed-content.ts` 的下一阶段提示词；本路线图当前结论为 **No-Go：先补既有 genealogy 密度与 Psychology 研究包**。

## 5. 本路线图验收

- 已给出按单学科、D3 × 2 / D2 × 4 / D1 × 6 的半结构化录入 SOP。
- 已明确 typed contract、`validateSeedCorpus()`、`npm run content:check`、来源类型、核验日期、pending/draft 与 published 的门禁关系。
- 已排序 Psychology、Management / OB，并解释暂缓无交叉且需独立核验体系的学科。
- 已列 Psychology 的 12 个首批候选及拟核验来源类型。
- 已给出 genealogy 密度、来源与跨图关系的具体阈值和测算口径。
- 本轮只修改本 roadmap；不修改 `src/data/seed-content.ts`，因此不引入运行时代码或内容数据变化。
