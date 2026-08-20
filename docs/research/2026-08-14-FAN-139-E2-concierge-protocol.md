# FAN-139｜E2 英文硕博 concierge 证据包试验协议

> 版本：v1.0｜拟冻结日期：2026-08-14｜负责人：机会与市场研究负责人  
> 状态：协议准备完成；仅在 E1 Gate 放行后执行。本文不授权招募、联系参与者、收集数据、收款、上线产品或创建实现任务。

## 1. 研究目的与决策边界

本试验只回答一个问题：英文硕士/博士研究者是否会在完成一次人工 source-backed artifact 后，重复使用并把“节省检索与复核时间、降低引用/关系错误风险”视为未来付费结果。

不回答：市场规模、长期留存、生产系统可扩展性、法律合规结论、最终产品形态或正式价格。价格锚点是交付后的意向测试，不是报价、订单或收款。

### 预注册结果线

| 结果 | 预注册判定 |
|---|---|
| 样本 | 10–15 名完成参与者；“完成”=有效同意、完成至少一个任务、收到 artifact、完成交付后反馈 |
| 正向证据 | 至少 3 人选择任一未来付费锚点，并能说出愿意付费的具体结果；至少 2 人在 7 天内提出第二次使用/复用请求 |
| 质量护栏 | 交付 artifact 通过率 ≥80%，且不得出现已知的核心引用伪造、来源错配或关系方向错误 |
| 成本护栏 | 人工复核中位数 ≤30 分钟/份，且复核分钟数不超过交付制作分钟数；连续 3 份超过任一阈值即视为复核成本失控 |
| Stop | 发生研究数据/身份数据泄露、核心引用错误无法在交付前发现，或同意边界无法确认：立即暂停后续任务并由负责人裁决 |
| Park | 少于 2 人复用，或未达到 3 人付费锚点，或成本护栏失控：停止“个人订阅”假设，不把热度或口头兴趣解释为需求 |

以上数值是本试验的操作阈值，不是市场事实；结果只支持本样本与本 artifact 形态下的下一步判断。

## 2. ICP、配额与招募偏差控制

### 纳入条件

- 年满 18 岁，能以英文阅读/描述研究任务；硕士或博士在读、近期毕业或正在进行独立研究。
- 最近 90 天内实际做过文献检索、理论/概念梳理、研究设计或引用整理中的至少一项。
- 能提供公开可访问的来源标识（例如 DOI、ISBN、出版社页、机构仓储或稳定 URL），不要求上传论文全文。
- 愿意完成 1 个 30–45 分钟研究任务，并在交付后给出质量、复用与未来价格锚点反馈。

### 排除条件

- 未成年人、无法确认自愿参与者、负责人直接管理/评价的学生或有明显利益冲突者。
- 需要提交未公开研究数据、受限论文全文、患者/受访者资料、未公开论文草稿或任何第三方个人数据者。
- 以获取免费服务为唯一目的、拒绝人工核验边界，或无法在同意前理解“无收款、无产品承诺、artifact 可能有错误”。

### 配额与偏差记录

- 总量 10–15 人；建议 6–9 名硕士、4–6 名博士/近期博士，至少覆盖两个研究主题/学科子域。
- 单一招募渠道不超过样本的 40%；记录渠道、国家/时区、学位阶段、学科、熟悉工具与是否为转介绍。
- 只招募自愿响应，不抓取名单、不绕过登录或付费墙、不购买样本、不向参与者承诺后续产品机会。
- 若某一渠道或学科占比超过 40%，结果摘要必须单列该偏差，不将其外推为全体英文硕博研究者需求。

### 招募文本（英文，可直接使用）

> **Invitation: research evidence-pack pilot (20–45 minutes)**  
> We are testing a small, manual research-support workflow for English-speaking master's and doctoral researchers. You may submit a public research question and public source identifiers; you will receive a source-backed evidence artifact with citations and uncertainty notes.  
> Participation is voluntary. There is no payment, no purchase, and no promise of a product or publication. Please do not share full papers, unpublished research data, confidential information, or personal data about other people. You may stop at any time. After delivery, we will ask whether a similar result would be worth a future one-off or recurring price; this is only a research question and we will not charge you.  
> If interested, reply with your research stage, broad field, task type, and the public sources you would use. Do not send sensitive material in the first reply.

## 3. 同意、退出与数据删除

### 自愿同意（英文短表）

参与者在任务开始前必须确认以下四项：

> I understand that this is a small product-research pilot, not academic advice or a publication service. I choose to participate voluntarily. I will provide only public, non-sensitive research context and source identifiers; I will not provide full papers, unpublished data, confidential material, or other people’s personal data. I understand that the artifact may contain errors and will be human-reviewed before delivery. I may stop or request deletion at any time before the result is irreversibly aggregated. There is no payment, purchase, or product commitment. I consent to the use of my pseudonymous task records and feedback for this pilot only, with direct identifiers kept separate and deleted on the schedule stated below.

记录 `consent_version`、`consent_at`、`consent_channel`、`consent_understood=yes/no`。任何一项为 no 或缺失，状态为 `not_started`，不得处理任务。

### 退出与删除流程

1. 参与者可通过原联系渠道提出“stop”或“delete my pilot data”，不要求说明理由。
2. 负责人在 7 天内：停止未完成任务；从 tracker、消息、工作区和 artifact 副本移除可识别记录；保留仅含 participant ID 的删除日志（时间、执行人、范围）。
3. 联系方式与同意记录：在试验收尾后 30 天内删除；任务原始输入、人工草稿和交付副本：参与者确认收到后 30 天内删除，若提前退出则立即进入删除队列。
4. 仅保留无法回溯个人的聚合结果（例如样本数、通过率、中位复核分钟数、价格锚点选择数），最长 12 个月；如果聚合前仍可重新识别，不能称为匿名。
5. 若系统备份无法即时逐项删除，记录待清除位置与下一次可控清理时间；不得把“移出主界面”当作已删除。

本节是低风险产品研究的操作护栏，不是对任何参与者所在司法辖区的法律意见。若参与者提出学校 IRB/伦理审查、跨境传输或法定权利问题，暂停该参与者流程，交由 Chief of Staff/指定隐私负责人确认。

## 4. 任务与交付

参与者任选其一；两类任务都只使用公开来源。

### Task A：理论/概念证据图

- 输入：1 个理论或概念、最多 3 个待核查主张、最多 5 个公开来源标识。
- 输出：主张—来源—定位表、定义/边界说明、至少 2 条有方向的关系（如 `concept → used_by → scholar/work`），以及未决问题。
- 观察：参与者是否把“找到材料”与“可复核的证据单元”区分开，交付后是否能指出错误或想再次使用。

### Task B：学者/作品关系核查

- 输入：1 位学者或 1 部作品、1 个关系问题（影响、回应、概念使用或研究路径）、最多 5 个公开来源标识。
- 输出：实体身份核对、关系三元组、每条关系的来源与定位、置信度、反证/范围限制。
- 观察：参与者是否认为关系方向、年代、作者身份和出处正确对其研究结果有实际价值。

### Source-backed artifact 模板

```text
Artifact ID / Participant ID / Task type / Delivery date
1. Research question and scope (what is and is not answered)
2. Source register
   - source_id | author/title/year | source type | DOI/ISBN/URL | accessed_at
   - edition or identity notes | locator available? | verification status
3. Claim ledger
   - claim_id | atomic claim | source_id | exact locator | support grade
   - faithful paraphrase or minimum necessary excerpt | scope/limits | reviewer
4. Relation ledger
   - relation_id | subject | predicate | object | source_id | locator
   - direction check | confidence (high/medium/low) | counter-evidence or caveat
5. Unresolved items and safe next checks
6. Correction log (if any before delivery)
```

不复制论文全文；只保留完成核验所需的最小引文/释义和定位。来源打不开、身份不匹配、定位不足或主张超出来源范围时，明确标为 `unverified`，不得用模型猜测补齐。

## 5. 质量清单与复核 rubric（100 分）

| 项目 | 分值 | 通过标准 |
|---|---:|---|
| 来源身份与版本 | 20 | 作者、题名、年份、DOI/ISBN/URL 与实际来源一致 |
| 可复核定位 | 20 | 页码、章节、段落、表/图或稳定网页定位足够让复核者重现 |
| 主张—证据贴合 | 20 | 每个核心主张由合适来源直接支持，范围没有扩大 |
| 关系方向与实体身份 | 15 | subject/predicate/object、作者身份、作品/理论关系无方向错误 |
| 不确定性与反证 | 10 | 对缺口、冲突来源、外推边界明确标注 |
| 覆盖与完整度 | 10 | 任务中约定的主张/关系均有状态，不静默遗漏 |
| 可用性 | 5 | 参与者能据此继续检索或写作，结构清晰、无不必要信息 |
| **总分** | **100** | **≥80 且无关键失败项 = pass；60–79 = revise；<60 = fail** |

关键失败项：伪造或不存在的引用；核心主张与来源错配；关系方向/实体身份明显错误；交付前发现但未纠正的核心错误；未经授权的全文、未公开数据、敏感信息或第三方个人数据进入 artifact。

### AI 引文/关系错误处置

- AI 可以帮助整理草稿，但不能作为来源；每个引用必须由人工打开来源并核对身份、版本、定位和主张范围。
- 发现错误后立即将 artifact 标记 `quarantined`，不得交付或计入通过率；记录 `error_type`（fabricated source / wrong metadata / wrong locator / unsupported claim / wrong relation / overclaim）、严重度、发现阶段、修正来源、修正分钟数。
- 若错误已交付：在 24 小时内向参与者发送更正与影响范围，撤回错误版本，重新复核；该份计入 `delivered_error`，不重写历史指标。
- 若涉及未公开研究数据、个人数据或秘密：停止当前批次，不继续复制或分析，隔离/删除相关材料，通知负责人和指定隐私责任人；在未完成事故裁决前不扩大招募。

## 6. Participant tracker 字段

只用随机 `participant_id` 关联研究记录；联系地址/账号单独存放，tracker 不写姓名、学校、论文全文或未公开数据。

| 分组 | 字段 |
|---|---|
| 招募 | `participant_id`, `recruitment_source`, `recruited_at`, `channel_quota`, `country_or_timezone_optional`, `degree_stage`, `broad_field`, `referral_flag` |
| 筛选 | `eligibility_status`, `screened_at`, `task_type`, `public_source_confirmed`, `sensitive_data_risk`, `exclusion_reason` |
| 同意 | `consent_version`, `consent_at`, `consent_channel`, `consent_understood`, `withdrawal_at`, `deletion_requested_at`, `deletion_completed_at` |
| 交付 | `task_started_at`, `task_completed_at`, `artifact_id`, `artifact_status`, `delivery_at`, `participant_received`, `quality_score`, `quality_verdict`, `critical_fail_flag` |
| 工时 | `intake_minutes`, `research_minutes`, `draft_minutes`, `review_minutes`, `correction_minutes`, `delivery_minutes`, `total_minutes`, `review_to_delivery_ratio` |
| 行为 | `second_use_requested`, `second_use_at`, `second_use_type`, `why_reused_or_not`, `alternative_used` |
| 付费意向 | `anchor_shown_after_delivery_at`, `anchor_choice`, `anchor_outcome`, `price_reason`, `would_pay_for_what`, `not_a_purchase_acknowledged` |
| 复核审计 | `reviewer_id`, `source_open_check`, `locator_check`, `relation_direction_check`, `ai_assistance_used`, `error_count`, `correction_summary`, `reviewed_at` |

禁止字段：论文全文、未公开数据、密码/令牌、敏感类别数据、第三方姓名/联系方式、未经参与者同意的可识别截图或录音。

## 7. 结果汇总模板与 100 分制机会输入

### 结果汇总

```text
Pilot window / protocol version / responsible reviewer
N recruited / N consented / N completed / N excluded / N withdrawn
Task mix: A __ / B __
Quality: pass __%; revise __%; fail __%; critical failures __
Time: median delivery __ min; median review __ min; review/delivery ratio __
Behavior: second use __ / N; request timing __; stated outcome __
Price anchor: one-off $5 __ / $12 __; recurring $8 __ / $15 __; no choice __
Alternatives: tools/workarounds named, switching cost, failure observed
Counter-evidence: strongest reason not to reuse/pay
Participant/channel/discipline bias
Decision: continue / revise / park / stop
Confidence: high / medium / low, with evidence boundary
Next owner and smallest next test
```

### 100 分制机会输入（研究结论，不是 Gate 批准）

| 维度 | 分值 | 计分口径 |
|---|---:|---|
| 问题频率 | 20 | 复用/重复任务的实际记录，而非泛泛“有兴趣” |
| 痛点严重度 | 15 | 时间、错误风险、返工或研究进度损失的具体结果 |
| 当前替代失败 | 15 | 现有工具/手工流程被明确指出的失败点 |
| 行为需求信号 | 15 | 完成、纠错、二次请求等行为，意见只能作补充 |
| 付费触发 | 15 | 交付后锚点选择 + 可说出的付费结果；不把赞美当付款 |
| 交付/开源杠杆 | 10 | 公开来源与现有工具能否降低人工成本和风险 |
| 竞争与差异 | 5 | 替代方案、免费方案与信任优势/劣势 |
| 证据质量 | 5 | 可打开来源、时间范围、反证与审计完整度 |
| **合计** | **100** | 缺失关键行为数据时不得补分，标 `unknown` |

建议解释：≥70 仅表示值得设计下一次低成本验证；50–69 为 Park/补证；<50 为 Stop，除非出现新的强行为或付费证据。该解释阈值是内部试验规则，不是市场规模或收入预测。

## 8. 最低成本执行顺序（E1 Gate 后）

1. 负责人冻结版本号、招募渠道配额、tracker 与空白 artifact；指定独立复核者。
2. 先做 2 人 dry run：验证同意理解、字段完整度、来源打开率和复核工时；dry run 不计入 10–15 人样本。
3. 分批每次招募 3–5 人；每份 artifact 交付前完成 rubric 与 AI 引文检查；出现 Stop 条件即暂停。
4. 交付 artifact 后一次性展示价格锚点，记录选择与“愿意付费的结果”；不收款、不建账号、不承诺产品。
5. 参与者反馈完成后 7 天窗口记录第二次使用；结算匿名汇总、删除原始数据、形成 Gate 证据包。

## 9. 来源、事实与未知项

### 可追溯来源（截至 2026-08-14 打开核验）

1. [HHS OHRP Belmont Report](https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/read-the-belmont-report/index.html)：事实——尊重个人、善行、正义三项原则；知情同意包含信息、理解、自愿；适用于本协议的同意与风险最小化设计。对本低风险商业试验的适用是方法性推断，不替代伦理/法律判断。
2. [HHS OHRP Informed Consent FAQ](https://www.hhs.gov/ohrp/regulations-and-policy/guidance/faq/informed-consent/index.html)：事实——同意应前置取得，过程强调披露、理解与自愿；本协议据此把同意放在任务开始前，并保留退出路径。
3. [ICO data protection principles](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/) 与 [data minimisation](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/)：事实——目的限制、数据最小化、准确性、安全性与问责是核心原则；本协议据此不收集全文/未公开数据，并分离直接身份信息。
4. [ICO storage limitation](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/storage-limitation/)：事实——个人数据不应保留超过必要期限，过期数据应删除或匿名化；本协议据此设 30 天原始数据删除目标，并单独记录删除状态。
5. [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) 与 [Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)：事实——生成式 AI 可能产生自信但错误的内容与引用（confabulation）；本协议据此要求逐条人工打开来源、隔离错误 artifact、保留更正日志。
6. [OSF Registrations and Preregistrations](https://help.osf.io/article/330-welcome-to-registrations)：事实——预注册用于在数据收集/分析前形成带时间戳的研究计划；本协议把样本、成功线、停止线与分析字段写在执行前。此次协议不代表已向 OSF 公开注册。

### 事实、推断、假设分离

- **事实**：任务上下文已授权 10–15 人、交付后展示价格锚点、不收款、不收集全文/未公开数据，以及“≥3 锚点、<2 复用或复核失控则停止”的方向性门槛。
- **推断**：如果参与者在交付后仍要求第二次 artifact，且能指出具体节省时间/降低风险的结果，这比“喜欢网站/AI”更接近付费触发。
- **假设**：本协议的 30 分钟复核阈值、7 天复用窗口、$5/$12 与 $8/$15 锚点能足以区分低成本人工服务与潜在个人订阅价值；必须由后续试验数据验证。
- **未知**：各参与者司法辖区的研究伦理/隐私要求、不同学科的外推性、真实替代方案成本、交付质量在规模化后的变化；本协议不填补这些未知。

## 10. 交接与责任

- **Chief of Staff**：确认本协议进入 E1 后的执行闸门，并处理涉及司法辖区/伦理审查的升级。
- **Product Strategy**：使用结果汇总和 100 分制输入判断继续、修订或 Park；不把本协议直接转为产品/支付实现。
- **机会与市场研究负责人**：冻结协议、维护 participant tracker、组织人工复核、记录反证与最终证据包。
- **CTO/Founding Engineer**：仅在后续明确授权后评估开源供给或工具化；本任务不创建代码或生产数据管道。
- **E2 执行任务**：仅在 E1 Gate 放行且本协议版本号保持一致后启动；若协议变化，重新记录版本并重新确认同意文本。

**最终结论：**本文件满足 E2-prep 的执行协议验收，可作为 [FAN-142](/FAN/issues/FAN-142) 的冻结输入；当前唯一下一步是等待 E1 Gate 后由指定执行负责人按 v1.0 进行 dry run，不提前招募或收集数据。
