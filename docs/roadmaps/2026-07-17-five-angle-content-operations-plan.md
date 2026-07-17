# Syrtag 五维内容运营分析与统一规划

> 日期：2026-07-17
> 状态：运营分析与规划，尚未授权实施
> 方法：5 个独立子 Agent 分别从 SEO、学术治理、用户增长、商业化、内容系统规模化角度只读审计；本文件由主代理完成事实复核与综合排序。

---

## 一、执行摘要

Syrtag 现在已经不是“网站骨架未完成”的阶段，而是进入了一个更关键的转换期：

> 从“具备 12 个理论及相关实体的可发布内容站”，转向“能够持续获得搜索流量、形成研究者复访，并对每条关键知识关系负责的研究路径产品”。

五个独立视角的共同结论高度一致：

1. **当前最大的外部增长阻断不是内容数量，而是英语定位与中文首屏冲突。** 根页面声明 `lang="en"`，目标是英语世界硕博研究者，但首页、导航、搜索 CTA 与 ARIA 文案仍主要是中文。它同时伤害 SEO 相关性、首次理解、品牌专业度和转化。
2. **当前最大的内部内容风险不是缺少第三学科，而是证据治理仍停留在“页面有来源”。** `ContentSource.supports`、L1/L2/L3 和 Verification 是正确骨架，但还无法稳定回答“这条具体主张/图谱边由哪条来源的哪一处支持、何时由谁复核”。
3. **当前不应接支付，也不应优先做 AI。** 公开内容、搜索和图谱应永久免费；应先验证研究者是否真正需要“可解释、可保存、可分享、可导出、可与导师讨论的理论路径产物”。
4. **当前不应扩 Psychology 或 Management/OB 的公开内容。** 现有 Education/Sociology 的谱系边证据、节点覆盖和关系密度尚不足，第三学科应保持研究包状态，不进入 published、static params、sitemap 或公开图谱。
5. **当前不需要 CMS。** 需要的是轻量的源码内容模块化、typed batch manifest、真实审核日期、关系边证据、archive 回滚和运营指标报表。

一句话战略：

> 未来 6 个月不要追求“更多学科”，而要把 Syrtag 做成英语研究者能够立即理解、愿意保存和分享、且每条核心路径可追溯证据的理论选择系统。

---

## 二、已复核的当前事实

### 2.1 已完成，不应重复执行

- 线上已同步 C1–C7，代表理论页 0 处 `being prepared`；`/pricing` 与 `/editorial-policy` 返回 200 并进入 sitemap。证据：`docs/SITE_CONSTRUCTION_PLAYBOOK.md:42`。
- Graphify 生成图中 99 条 dangling endpoint 已降为 0。该修复没有新增业务关系，也未修改网站运行逻辑。证据：`docs/SITE_CONSTRUCTION_PLAYBOOK.md:210`。
- N21 已把 AdSense 从一期收入 KPI 调整为流量探针；N22 已确认自绘 Canvas 为正式图谱方案。证据：`docs/SITE_CONSTRUCTION_PLAYBOOK.md:206-207`。
- 本地已有 typecheck、构建产物冒烟、content:check、部署回滚、Pricing、Editorial Policy 和订阅 schema 预留。
- 图谱交互与文章阅读流已有新提交：`923b2d6 feat(graph): improve interaction feedback`、`b25c20f feat(content): improve article reading flow`。

### 2.2 当前未收口状态

- 当前分支：`feature/release-positioning-hardening`，领先远端 2 个提交。
- 当前未提交文件：`docs/SITE_CONSTRUCTION_PLAYBOOK.md`、`docs/roadmaps/2026-07-17-content-expansion-roadmap.md`。
- 因此最新 Playbook 和扩学科路线图中的部分结论仍是工作区状态，不应在提交、验证前当成稳定基线。

### 2.3 已验证的关键缺口

1. 首页和导航主要为中文：`src/app/page.tsx:38-57`、`src/components/layout/Header.tsx:6-30`。
2. 正常首页直接渲染 `Header`，没有使用包含 Footer 的 `PageFrame`：`src/app/page.tsx:32-64`。
3. Editorial Policy 只有两段概述，未解释 L1/L2/L3、纠错、复核和下架：`src/app/editorial-policy/page.tsx:1-3`。
4. `ContentSource` 没有 claim locator、页码/章节、审核人和真实 `verifiedAt`：`src/data/templates/theory-template.ts:136-167`。
5. D1 基础合同不强制 sources、reading path 和 verification：`src/data/templates/theory-template.ts:202-211`。
6. 核心实体在 seed 中被统一硬编码为 published，Theory/Work/Concept 等没有真正的源数据 draft/published/archived 流：`prisma/seed.ts:18-25,28-72`。
7. `SeedGenealogy` 没有边级 source、evidence level、verifiedAt 或审核状态：`src/data/seed-content.ts:78-85`。
8. 页面 genealogy 与全局图谱 genealogy 可能语义漂移。例如 Life Course → Teacher Life History 在页面内容中为 `precursor_of`，全局边中为 `integrated_with`：`src/data/seed-content.ts:900,1155-1157`。
9. 理论页标题区用第一条来源等级显示一个徽章，容易让用户误以为整页均为同一核验级别：`src/components/content/TheoryArticle.tsx:53-61`。

---

## 三、五个运营角度的独立结论

## 3.1 SEO 与自然流量

### 当前优势

- 已形成 Discipline → Field/Topic → Theory → Scholar/Work/Concept 的实体网络，而不是普通博客文章集合。
- 12 个理论页中 D2/D3 已包含适用边界、误用、研究设计、数据收集和写作转化，具有明显的长尾差异化。
- canonical、Open Graph、Twitter、published-only sitemap、robots 和静态参数基础正确。
- Topic 页面最接近真实搜索意图，已经具备 primary/supporting/not-recommended 理论路径结构。

### 当前缺口

- 12 个理论只有 4 个 Topic，用户问题入口远少于理论实体页。
- 只有 4 个 Scholar，尚未形成“作者—作品—理论贡献—概念”的完整溯源集群。
- 页面内已有理论比较，但缺少少量、经过人工审校的比较型着陆页。
- 索引页主要是同构卡片列表，尚未承担“从研究问题开始”的意图分流。
- SERP description 模板化，理论、主题、学者、作品、概念的搜索结果价值区分不足。

### 内容支柱建议

1. **Theory Selection**：针对具体研究问题选择理论。
2. **Theory Comparison**：比较相邻理论的分析单位、材料、边界和组合条件。
3. **Theory-to-Research-Design**：把理论转换为分析维度、访谈/材料和写作结构。
4. **Scholars & Foundational Works**：作者、原典、贡献边界与阅读顺序。
5. **Concept Distinctions & Misuse**：概念定义、跨理论差异和常见误用。

### 不应做

- 不做“任意理论 × 任意学科/国家/群体”的排列组合薄页。
- 不开放空学科、空理论或未经核验的程序化页面。
- 不让站内搜索参数页、空结果页进入 sitemap。
- 不用 AI 批量生成 scholar bio、理论比较或论文段落后直接发布。

---

## 3.2 学术可信度与编辑治理

### 当前优势

- `seed-content.ts` 唯一发布事实源、published-only 公开边界和来源等级纪律均正确。
- D1/D2/D3 把内容深度与研究任务分层，而不是简单按篇幅分级。
- L1/L2/L3 能区分稳定事实、编辑综合和研究建议，这是对抗 AI 内容农场的重要基础。

### 当前风险

1. **页面级来源不等于主张级证据。** 当前不能稳定映射到具体句子、字段、页码或章节。
2. **L3 语义混合。** 产品文档曾把 L3 表述为 verification pending；当前 UI 又将其呈现为 Research Guidance。应拆为“证据状态”和“内容性质”两个维度。
3. **genealogy 是核心产品资产，却是证据链最弱的部分。** 当前全局边没有边级来源和复核日期。
4. **D1 合同存在绕过风险。** 现有 6 个 D1 通过专项测试达到较高标准，但通用合同本身没有强制同样的来源和核验要求。
5. **核验日期不可信。** 数据库虽有 `verifiedAt`，作者合同未承载；seed 使用统一日期，不应对外解释为真实最后复核日期。
6. **整页 Verified 暗示过度。** 页面应说明其中包含 source-backed fact、editorial synthesis 和 research guidance，而不是只显示单一徽章。

### 编辑运营 SOP

```text
选题
→ 研究包（主张清单、来源、关系假设、冲突）
→ typed draft
→ 来源核验
→ 领域/方法审核
→ 发布决策
→ seed + build
→ 定期复核
→ 修订 / archive / 下架
```

角色至少区分：内容作者、来源核验者、独立学术审核者、发布负责人。D3 和关键关系不能由作者自己单独批准。

---

## 3.3 用户获取、激活、留存与社群

### 核心用户

1. 选题尚未稳定的硕博研究者：需要从模糊问题得到理论候选。
2. 进入研究设计与写作阶段的博士研究者：需要把理论转换为数据、分析和章节语言。
3. 跨学科或需要比较理论的中后期研究者：需要解释“为什么不是另一个理论”。
4. 研究方法教师、博士项目支持人员和学术馆员：需要可推荐、可引用、来源透明的资源。

### 当前漏斗断点

```text
Google 到达
→ 首屏理解（中英文冲突）
→ 图谱探索（认知负担高，缺任务入口）
→ 搜索/比较（有实体结果，缺完成决策的动作）
→ 内容深读（价值强）
→ 保存/分享/订阅（几乎为空）
→ 复访与传播（缺闭环）
```

### Phase 1 不登录也能做的留存

- 从研究问题开始的 Topic-first 入口。
- 可复制、可复现的理论路径 URL。
- 浏览器本地 Saved Pathways / Read Later。
- 低频、双重确认、来源导向的 Newsletter。
- 按理论/主题订阅更新提醒。
- “Suggest a source correction / Request a pathway”纠错和需求入口。

### 何时才值得接登录

只有本地保存、路径复访和用户访谈证明跨设备保存、个人注释、项目组织、导出或协作需求真实存在时，才进入账户系统。登录不是 Newsletter、分享或基础收藏的前置条件。

### 品牌叙事

推荐英文核心表达：

> Syrtag helps doctoral researchers make a defensible theory choice — by showing the pathway, the boundaries, and the sources behind it.

中文内部解释：

> Syrtag 不替研究者做判断；它让研究者看见理论选择的路径、边界与证据，从而做出更可辩护的判断。

---

## 3.4 商业化、订阅与转化

### 当前判断

- Free/Pro/Scholar 的边界方向正确，但 Pro/Scholar 还只是未经验证的功能假设。
- 公开内容、搜索、图谱、基础 Topic 比较应永久免费。
- 真正可能收费的不是“更多内容”，而是可复用的研究决策资产和个人工作流。
- 当前不应接支付，也不应把 AI、跨项目比较、API 全塞进 Scholar。

### 模式优先级

1. 免费规则匹配验证 → 个人研究工作流订阅。
2. 研究方法课程/导师/研究中心封闭试点。
3. 条件成熟后的课程或机构授权。
4. AdSense 只作流量探针与补充收入。
5. 透明赞助只能与编辑排序完全隔离。
6. API/数据许可属于远期独立 B2B 产品，不应放入个人 Scholar 套餐。

### 最值得验证的付费产物

不是简单 PDF/CSV，也不是“保存一个理论”，而是：

> 一份包含研究问题、候选理论、适配与反适配理由、证据链接、版本记录、下一步研究设计提示的可追溯研究框架包。

### 五项候选能力

| 能力 | 当前建议 |
| --- | --- |
| 框架匹配 | 基础结果免费，先验证效用 |
| 保存研究项目 | 先做本地保存；不要仅为“保存”收费 |
| AI 框架生成 | 只做人工审核/来源约束的封闭实验；未来按受控用量收费 |
| 跨项目比较 | 先验证导师、课程或研究中心需求 |
| API | 独立远期 B2B，不进入 Scholar |

### 不应接支付的条件

- 基础匹配尚未证明有效；
- 用户只有一次性搜索，没有重复工作流；
- 不知道实际付款人；
- 推荐无法解释来源和边界；
- AI 成本、退款、取消、隐私、删除/导出和权限尚未准备。

---

## 3.5 内容生产体系与知识图谱规模化

### 当前优势

现有管线的核心顺序正确：

```text
typed contract
→ validateSeedCorpus()
→ idempotent Prisma seed
→ published records
→ static params / sitemap / graph / search
```

### 当前瓶颈

- `seed-content.ts` 已约 275KB，继续在单物理文件中堆叠内容会增加冲突和审校成本。
- 核心实体状态没有由 authoring contract 控制，难以安全 draft/archived。
- seed 是 upsert，不会自动删除从 corpus 中移除的旧记录；可靠回滚应使用 archived，而不是物理删除。
- 页面 genealogy 和全局 genealogy 是双份事实。
- WorkContent 存在两份模板定义，可能造成生产合同漂移。
- 图谱查询有 `take: 199`，当前不是问题，但单学科接近 150 个理论前必须设计聚焦/分页，避免静默截断。

### 单文件、拆文件和 CMS 阈值

#### 现在应拆分源码语料

当前已满足拆分条件：单文件超过 200KB、总实体超过 100 的临界区、未来将超过 2 学科。推荐：

```text
src/data/seed-content.ts        # 唯一 production manifest / 聚合导出
src/data/corpus/education.ts
src/data/corpus/sociology.ts
src/data/corpus/shared/
src/data/content-batches/
```

“单一真相源”应理解为唯一生产导出和唯一 seed 输入，而不是所有内容必须写在一个物理文件。

#### 现在不建 CMS

满足以下条件任意两项再立项 CMS：

- 已发布实体超过 1,000 或理论中枢超过 250；
- 5 名以上活跃内容角色；
- 每月 8 个以上独立批次；
- 非工程人员每周需要自主发布；
- 来源复核任务每月超过 100 条；
- Git PR 成为真实吞吐瓶颈。

将来 CMS 也只管理研究包、草稿和审核任务；审核后导出 typed snapshot，仍经 Git、validator、seed 和 build 发布。

---

## 四、跨五视角的统一优先级

## P0：现在必须先做

### P0-1 英文产品语言统一

- 将首页 Hero、Header、搜索 CTA、图谱提示、ARIA 文案统一为英文。
- 保持根页面 `lang="en"`。
- 不在没有完整中文内容与 hreflang 前创建 `/zh/` 可索引版本。
- 首页恢复 Footer，补齐 About、Editorial Policy、实体索引和法律页入口。

**影响：** 同时解决 SEO、首屏理解、用户信任和品牌定位问题。
**成本：** 低。
**验收：** 首页与导航主体英文一致；无重复 Header；Footer 可达；375px 无横向滚动。

### P0-2 建立最小运营测量基线

- Search Console 域名资源、sitemap 提交和索引状态。
- 隐私最小化事件字典：Topic→Theory、Theory→Work、图谱节点打开、搜索、分享、保存、订阅。
- 默认不记录原始研究问题、项目标题、笔记或 AI 输入。
- 启用分析/邮件前更新 Privacy/Cookie 说明。

**验收：** 能产生 28 天真实基线，而不是预设流量、CTR 或转化数字。

### P0-3 升级学术证据治理

先做设计与迁移计划，再实施：

1. 把证据状态与内容性质拆开；
2. 为关键 claim 增加 `claimId / fieldPath / sourceId / locator / supportType / verifiedAt / reviewerRole`；
3. 为 genealogy 增加 source、evidence level、verifiedAt、review decision；
4. 合并页面和图谱的双份 genealogy 为 canonical relation record；
5. D1 合同强制来源、阅读路径和核验；
6. 页面头部改为核验摘要，而不是单一 Verified 徽章；
7. 核心实体状态由 authoring contract 控制，支持 draft/published/archived。

**验收：** 现有 8 条展示边全部可核验或从公开图移除；L1 真实复核日期覆盖 100%；必要事实不可核实时自动阻断 published。

### P0-4 冻结扩学科公开发布

- Psychology 与 Management/OB 仅保留候选研究包。
- 不新增公开路由、static params、sitemap 或图谱节点。
- 先补 Education/Sociology 的关系证据、孤立节点和覆盖率。

**Go 门槛：**

- 各现有学科已核验 genealogy 密度 ≥0.20；
- 有边节点覆盖率 ≥80%；
- 新学科至少 4 个跨学科唯一节点对；
- 覆盖至少 3 个新理论和 3 个既有理论；
- 跨学科关系不能集中在单一桥接节点；
- D3 通过独立双审。

### P0-5 收口当前工作区

- 复核并提交 `docs/SITE_CONSTRUCTION_PLAYBOOK.md` 与 `2026-07-17-content-expansion-roadmap.md`。
- 推送领先远端的图谱交互、文章阅读流提交。
- 旧的 next-round prompt 中“线上尚未同步”和“修 Graphify dangling”已过期，应标注 superseded，避免 Codex 重跑。

---

## P1：P0 完成后推进

### P1-1 Topic-first 内容集群

不要一次追求 12/18/30 页。建议每月一个受控批次：

- 首批新增 4–6 个 Education/Sociology 研究问题页；
- 每页必须有 primary/supporting/not-recommended 路径；
- 明确分析单位、材料要求、适用边界、替代理论和阅读路径；
- 由真实 Search Console 查询、站内搜索和用户访谈决定下一批。

### P1-2 人工审校的理论比较

优先 4–6 对真实决策节点，例如：

- Teacher Identity vs Teacher Professional Development；
- Life Course vs Teacher Life History；
- Structuration vs Institutional Theory；
- Practice Theory vs Social Capital；
- Communities of Practice vs Teacher Professional Development；
- Multiple Streams vs Street-Level Bureaucracy。

比较必须说明：解释对象、分析单位、所需材料、边界、可否组合、原典和证据级别。

### P1-3 Scholar 与 Works 溯源闭环

- 只补当前 published theory/work corpus 中已有真实关系的核心作者；
- 不为补数量创建简历式薄页；
- 每页必须有身份范围、贡献边界、代表作品和权威来源；
- 禁止把“相关作者”夸大成“单一创始人”。

### P1-4 无登录留存

- Copy pathway link；
- 浏览器本地 Saved Pathways；
- 更新订阅/Newsletter 的需求验证；
- 来源纠错和路径请求入口；
- Editorial Policy 扩充为可检验的方法论页面。

### P1-5 内容系统轻量模块化

- 拆分 corpus 物理文件，保留 `seed-content.ts` 唯一聚合出口；
- 建 batch manifest、source register、review decision、rollback set；
- 生成只读内容质量指标报告；
- 不建 CMS。

---

## P2：有真实数据后条件式推进

1. 窄范围、规则驱动、可解释的 Framework Matcher Beta；基础结果免费。
2. 封闭式 Research Workspace 试点，验证保存、版本、导出和复用。
3. 价格卡、访谈和 Concierge Test 验证付费意愿，不立即收费。
4. 若本地保存和重复使用成立，再设计登录、跨设备同步和个人项目。
5. 若个人或课程试点同时证明复用、购买人、价格、隐私与成本成立，再接支付。
6. Psychology 只有在全部内容门禁为 Go 后才能公开；Management/OB 必须另行界定 Organization Studies、OB、Public Administration、Public Policy 的边界。
7. API 独立作为远期 B2B，不进入个人 Scholar。

---

## 五、3 / 6 / 12 个月统一路线图

## 0–3 个月：可信度与增长基础

### 核心目标
让英语研究者能理解产品，让现有 12 个理论的核心关系可证明，让运营开始有真实数据。

### 交付物

- 英文首页、英文导航、Footer 和任务型入口；
- Search Console 与最小事件字典；
- 完整 Editorial Policy；
- 证据治理数据合同和迁移方案；
- 现有 8 条 genealogy 边逐条审核；
- 核心实体 draft/published/archived authoring contract；
- corpus 模块化设计和 batch manifest；
- 4–6 个来源充分的 Topic 页面试点；
- 2–4 个比较内容试点。

### KPI

- 首页主体语言与 `lang="en"` 一致；
- 公开链接、sitemap、static params 与 published 集合一致率 100%；
- L1 关键主张可定位来源率 100%；
- genealogy 边证据完整率 100%，无法核验者不公开；
- D3 独立审核覆盖率 100%；
- Search Console 28 天基线建立；
- Topic→Theory、Theory→Work、图谱→详情等路径有可观察基线。

## 3–6 个月：问题型内容与留存验证

### 核心目标
证明用户不是只读一篇理论，而是会沿着问题—比较—理论—原典路径继续探索并复访。

### 交付物

- 按真实查询和用户反馈扩充 Topic 集群；
- 4–6 对高价值理论比较；
- 补齐当前 corpus 中核心 Scholar；
- Copy Pathway、Saved Pathways；
- 低频更新订阅或候选等待名单实验；
- 窄范围免费 Framework Matcher 原型，前提是 Topic-Theory 数据质量达标；
- 课程/导师/馆员发现访谈。

### KPI

- Topic→Theory、Theory→Work 的有效继续探索率；
- 保存后回访、分享后访问和路径复用；
- Search Console 中问题型查询、比较型查询和理论名词查询的真实分布；
- 来源纠错处理率和内容复核按期完成率；
- Framework Matcher 结果的来源查看、边界理解和任务完成情况。

## 6–12 个月：条件式工具化和第三学科

### 核心目标
只在内容、关系、用户和商业门槛均成立时，进入个人研究工作流和第三学科。

### 条件式交付物

- 封闭 Research Workspace 试点；
- 版本化路径、研究框架包导出；
- 受控 AI Concierge Test，不公开承诺无限 AI；
- 课程/cohort 试点；
- Psychology 研究包和独立 Go/No-Go；
- 若达到 CMS 触发阈值，才评估 CMS 草稿工作台。

### KPI

- 同一研究项目的重复使用和版本编辑；
- 明确购买人、预算来源和价格区间；
- AI 单任务成本、失败、重试和人工审核成本；
- Psychology 跨学科关系、来源和双审门禁；
- 公开内容质量和 SEO 不因广告/付费叙事下降。

---

## 六、统一运营指标

### 内容质量

- D1/D2/D3 合同完整率；
- L1 关键 claim 来源覆盖率；
- L2/L3 明确标注率；
- 真实 verifiedAt 覆盖率；
- 过期来源率、纠错关闭时间；
- D3 独立审核覆盖率。

### 图谱健康

- 已核验 genealogy 密度；
- 有边节点覆盖率；
- 孤立理论率；
- 跨学科边数与集中度；
- 关系证据完整率。

### SEO 与发现

- 索引 URL、展示、点击、CTR、查询类型；
- Topic/Theory/Comparison/Scholar/Work 各页面类型表现；
- sitemap 与 published URL 一致率；
- 内部链接健康率；
- 外部课程页、机构页和学术资源引用。

### 用户行为

- 首屏到 Topic/图谱/搜索的下一步行为；
- Topic→Theory、Theory→Work、图谱→详情；
- 分享、保存、回访、订阅确认；
- 来源和 Editorial Policy 的访问；
- “无可靠匹配”是否被正确理解。

### 商业验证

- 可追溯理论路径完成数；
- 重复工作流使用；
- 试点申请和实际试用；
- 购买人、预算来源、价格带反馈；
- AI/支持/退款/支付成本；
- 课程或机构从接触到试点的周期。

---

## 七、内容发布节奏建议

当前不应采用“每天更新”或“按月扩一个学科”。建议：

- 每周最多：1 个 D3，或 2 个 D2，或 3 个 D1 的研究—写作—审核闭环；
- 每月最多：4 个理论中枢增量，并同时补齐必要的 Work、Concept、Scholar、Topic；
- 每个 D3：100% 独立审核、100% L1 claim 抽源、100% genealogy 边审查；
- 每个新关系：100% 双人审查；
- AI 参与的草稿：100% 人工审核，AI 只能做检索线索、结构草案和重复检查；
- 每月安排一次“删减会议”，将无来源、重复、关系不足或性质模糊的候选降为 draft，而不是凑数量。

---

## 八、需要废止或修正的旧任务

1. `2026-07-17-next-round-codex-prompt.md` 中“线上仍未同步 C1–C7”的任务已过期。
2. 同文件中“修 Graphify dangling endpoint”的任务已完成，不应重复执行。
3. UI 4A/4B 已有相关提交，应先审阅实际差异，再决定剩余 4C/4D/4E，不应整批重做。
4. Subscription skeleton 已存在，但应冻结，不继续扩认证、支付或权限模型。
5. Psychology/Management 清单只能作为研究候选池，不能作为固定发布配额。
6. D3×2、D2×4、D1×6 是容量规划，不是必须凑满的最低发布数；不达合同的候选应 draft 或移出。

---

## 九、下一轮建议的实施顺序

```text
A. 收口当前文档与已提交 UI 改动
B. 英文首页 / 导航 / Footer / 任务入口
C. Editorial Policy + 核验摘要表达
D. claim / genealogy / verifiedAt / entity status 治理设计
E. 现有 8 条关系边审计与回填
F. Search Console + 隐私最小化事件基线
G. 首批 Topic + Comparison 内容实验
H. 分享 / 本地保存 / 更新订阅验证
I. 窄范围 Framework Matcher Beta
J. 条件式 Research Workspace / Psychology Go-No-Go
```

这一路线把“用户看得懂 → 内容可证明 → 运营能测量 → 内容能复访 → 工具能验证 → 商业化/扩学科”依次建立，避免继续堆叠尚未被验证的功能和内容。
