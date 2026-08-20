# FAN-138 隐私最小化实验数据契约

> 状态：E0 数据契约完成，未实现、未发射、未收集、未部署  
> 日期：2026-08-14（Asia/Shanghai）  
> 依据：FAN-113 已批准 E0/E1 阈值与 FAN-111 隐私/CMP 边界  
> 实验窗口：E0 D1–7；E1 预计 D8–21，每个已批准高意图分层至少 300 个 qualified sessions  
> 基线：当前为 `not_collected`；任何 0% 或转化率均不是已观测基线。

## 1. 决策摘要

E1 只应实现无 Cookie、无 localStorage、无跨访问身份的第一方批次事件。一个批次只表示一次页面访问，用于将同一访问内的 CTA、任务和 artifact 事件排序、去重和重放，不得用于跨页或跨日识别人。

`second_use_14d` 不能在这一边界内计算。它需要跨访问链接，只能在单独 Privacy/CMP 评审通过后，对明示自愿参与的 pilot 使用 16 天 TTL 的不透明 return token。E1 默认不启用该字段。

可进入 E1 的数据前置：

- 只在已批准的 theory/topic 高意图 allowlist 上运行；精确的三个 E1 实验分层由 E1 配置固化，不从 URL 或用户文本推断。
- `qualified_session` 只由 CTA 之前的内容参与信号触发，不能因 CTA impression/click 而被追认，避免分母污染。
- 数据质量门禁通过且每个实验分层累计至少 300 个 qualified sessions 后，才允许对 E1 做 success/iterate/stop 判断。
- 若只能通过原始搜索词、研究问题、URL query、完整 referrer 或持久身份区分内容消费与工具意图，立即停止进入 E1。

## 2. 分析单位、分母与时间

### 2.1 分析单位

| 单位 | 定义 | 隐私边界 |
|---|---|---|
| `visit_batch` | 同一浏览器 tab 内的一次页面访问事件批次 | `batch_id` 仅在内存中生成，不写 Cookie/localStorage，不在跨页复用 |
| `qualified_session` | 发生在已批准高意图页，且 CTA 之前满足内容参与规则的 `visit_batch` | “session”是实验分母名称，不是持久会话或用户身份 |
| `funnel_step` | 同一 `visit_batch` 内的第一个有效步骤事件 | 不做跨批次串联 |
| `return_cohort` | 显式自愿参与的 artifact completer，用于 14 天二次使用分母 | E1 禁用；必须先过隐私/本地存储评审 |

### 2.2 `qualified_session` 确定规则

规则版本 `qualified-v1`：

1. `page_type` 是 `theory` 或 `topic`，且 `surface_cohort` 出现在当次 E1 预注册 allowlist；
2. 页面处于前台且有效内容可见；
3. 在 CTA 事件之前，满足以下任一项：
   - `active_time_bucket = 30_119s` 或 `120s_plus`；
   - `qualification_reason = research_navigation`，即用户主动打开一个已可见的来源、关系或图谱节点。

只发送桶值和原因枚举，不发送滚动坐标、操作轨迹、链接文本或所选研究内容。活跃时间仅累计 `visibilityState=visible`，后台时间不计。同一批次最多计一个 qualified session。

### 2.3 时间窗口

- E1 主结果：按预注册起止时间的完整批次计算；延迟到达宽限 24 小时。
- E1 判断：每个 `surface_cohort` 至少 300 qualified sessions。CTR `>=3%` 成功，`<1%` 停止该業子，`1%–<3%` 只允许一次文案/位置迭代后复测。
- `second_use_14d`：第一次 `artifact_complete` 后 14×24 小时内第一个合格的创建、更新或导出；延迟到达宽限 48 小时。该指标不得与 E1 的 300-session 分母混用。

## 3. 公共事件 schema

所有枚举值均由发布版本的 allowlist 生成；未知值拒绝，不保存原始字符串。

```ts
type ExperimentEventV1 = {
  event_name:
    | "qualified_session"
    | "tool_cta_impression"
    | "tool_cta_click"
    | "task_start"
    | "artifact_complete"
    | "artifact_export"
    | "second_use";
  schema_version: "1.0.0";
  event_id: string;              // 事件级随机 UUID，仅用于重试去重
  batch_id: string;              // 单 tab、单页、单次访问；不持久化到客户端
  event_index: number;           // 批次内 0 起始单调递增
  occurred_at: string;           // UTC ISO-8601，秒精度
  received_at?: string;          // 服务端填充，UTC
  experiment_id: string;         // 有限枚举，例如 e1-cta-smoke-v1
  experiment_variant: "control" | "cta_copy_a" | "cta_copy_b";
  surface_cohort: string;        // 预注册分层 ID，非 slug
  page_type:
    | "home" | "theory" | "topic" | "scholar" | "work"
    | "concept" | "search" | "graph" | "tool" | "legal" | "other";
  device_class: "mobile" | "tablet" | "desktop" | "unknown";
  locale: "en" | "other" | "unknown";
  traffic_class: "human_candidate" | "known_bot" | "synthetic_test" | "unknown";
  data_use_class: "first_party_ephemeral" | "reviewed_return_link";
  properties: Record<string, string | number | boolean | null>;
};
```

字段约束：

- `device_class` 仅在客户端按 viewport 宽度映射：`mobile < 768`，`tablet 768–1023`，`desktop >= 1024`；不传 User-Agent。
- `locale` 仅来自站点可见语言状态，不传浏览器语言列表。
- `page_type` 由服务端/路由常量设置，不传 path、slug、query 或 URL。
- 同一 `batch_id` 的 `page_type`、`device_class`、`surface_cohort` 和实验分组必须保持一致；如果 CTA 跳转到新页，新页必须开始新批次，E1 不得跨批次串联。
- `surface_cohort`、`experiment_id`、`experiment_variant` 必须在部署 allowlist 中；不允许自由文本。
- `event_id` 和 `batch_id` 的原始值最长保留 35 天，不与账号、IP、设备或其他页访问合并。

## 4. 事件字典

| 事件 | 发生条件 | 必需 `properties` | 分母 / 去重 | 同意分类 |
|---|---|---|---|---|
| `qualified_session` | `qualified-v1` 首次成立 | `qualification_rule_version="qualified-v1"`; `qualification_reason=active_time\|research_navigation`; `active_time_bucket=30_119s\|120s_plus\|not_applicable`; `qualified_before_cta=true` | 每 `batch_id` 第一个有效事件；是 E1 主分母 | A |
| `tool_cta_impression` | CTA 至少 50% 连续可见 1 秒 | `cta_id` allowlist；`placement` allowlist | 每 `batch_id + cta_id + placement` 首次；主 CTR 分母仍是 qualified session | A |
| `tool_cta_click` | 发生真实用户激活且 CTA 处于可用状态 | `cta_id`; `placement` | 每 `batch_id + cta_id + placement` 首次 | A |
| `task_start` | 用户提交结构化任务选项并开始处理 | `task_type` allowlist；`input_mode=public_entity_selection` | 每 `batch_id + task_type` 首次；不记录选择内容 | A |
| `artifact_complete` | 系统产生符合完成合同且可见的 artifact | `artifact_type`; `source_count_bucket=1_2\|3_5\|6_plus`; `uncertainty_items_bucket=0\|1_2\|3_plus`; `completion_mode=generated\|edited` | 每 `batch_id + artifact_type` 首次；不传 artifact 内容 | A |
| `artifact_export` | 已完成的 artifact 成功生成下载/复制结果 | `export_format=markdown\|csv\|copy`; `export_status=success` | 每 `batch_id + artifact_type + export_format` 首次；主导出率按批次去重 | A |
| `second_use` | 同一审查通过的 return cohort 在首次完成后 14 天内再次创建、更新或导出 | `return_join_key`; `second_use_action=create\|update\|export`; `days_since_first_bucket=0_1\|2_7\|8_14` | 每 `return_join_key` 首次；分母是已选择参与且首次完成的 return cohort | B，E1 禁用 |

同意分类：

- **A（拟议无独立同意）：** 第一方、无 Cookie/localStorage、单次访问内、无原文/身份/精确位置的产品质量测量候选。这是产品契约，不是法律结论；实现前仍由 Chief of Staff/Founder 确认 Privacy 告知与适用地区要求。
- **B（必须进一步评审）：** 任何跨访问连接、Cookie/localStorage、账号、邮箱、精确地区、完整 referrer、原始搜索/研究内容、广告/CMP outcome 或第三方 SDK。`second_use` 是 B。
- AdSense/CMP 事件属于 FAN-111 后置 E5 边界，不在 E0/E1 绑定或实现。

若未来 B 类评审通过，跨访问扩展必须使用下列最小合同：用户在首次 `artifact_complete` 后明示选择参与；客户端只保存 128-bit 随机 return token 和到期时间；接收端仅保存按实验轮换密钥计算的 `return_join_key`。首次 `artifact_complete` 和后续 `second_use` 都带同一 join key、`data_use_class="reviewed_return_link"` 与 `participation_notice_version`，以便从原始事件重算 14 天窗口。token/join key 最长 16 天，退出立即删除，不得与账号或其他数据合并。在没有审查版本时，客户端和接收端都必须拒绝该扩展。

## 5. 禁止字段（no-PII 清单）

以下字段不得出现在事件、错误详情、重试队列或调试日志中：

- 姓名、邮箱、电话、账号 ID、帐号名、学校/机构 ID、付款或订单标识；
- IP 地址、User-Agent、广告 ID、设备 ID、指纹、持久 session ID、精确地理位置；
- Cookie 值、localStorage 值、完整 referrer、URL/path/slug/query/hash，draft/archived slug；
- 原始研究问题、站内搜索词、论文全文、未公开研究数据、项目标题、笔记、prompt、artifact 文本；
- 自由文本错误、DOM 文本、链接文本、所选 entity slug/id；
- 原始时区、浏览器语言列表、精确屏幕尺寸、键鼠轨迹或滚动坐标。

接收端必须按 schema allowlist 重建存储对象，不得保存未知字段或原始 request body 作为“备份”。

## 6. 重算指标与分母

所有主指标先排除 `known_bot`、`synthetic_test`、schema 无效和超出窗口的事件，再对语义键取首次有效事件。不将下游事件反向补齐上游分母。

| 指标 | 可重算公式 | 必报分段 |
|---|---|---|
| Qualified sessions | `count(distinct batch_id where qualified_session)` | `surface_cohort`, `page_type`, `device_class`, `experiment_variant` |
| CTA coverage | `qualified batches with impression / qualified batches` | 同上 + `placement` |
| **E1 qualified-session CTR** | `qualified batches with click / qualified batches` | 同上 + `cta_id` |
| Impression CTR（诊断） | `batches with click / batches with impression` | 同上 + `placement` |
| Task start rate | `batches with task_start / qualified batches with click` | 同上 + `task_type` |
| Artifact completion rate | `batches with artifact_complete / batches with task_start` | 同上 + `artifact_type` |
| Export rate | `batches with artifact_export / batches with artifact_complete` | 同上 + `export_format` |
| Second use 14d | `return_join_keys with valid second_use / eligible opted-in return_join_keys with artifact_complete` | `second_use_action`, first-use cohort；同时报 opt-in coverage |
| North-star candidate | `distinct qualified batches with artifact_complete / qualified batches * 100` | 同上；报每 100 qualified sessions 的完成数 |

分析中必须同时报分子、分母、比率、窗口和数据质量状态。当分母未达 300 时只报观测值和不确定性，不做 E1 决策。

## 7. 去重、缺失、序列和机器人

### 去重

1. 传输重试：按 `event_id` 保留最早 `received_at`。
2. 语义重复：按事件字典中的语义键保留最早 `event_index`。
3. `event_index` 相同但内容不同：整个批次进入 quarantine，不猜测顺序。
4. 相同 `batch_id` 不同 `experiment_id` 或分层：整个批次无效。

### 缺失与序列

- 必需字段缺失、枚举越界或时间无法解析：拒绝事件并只记录错误代码聚合计数。
- 下游先于必需上游（例如 `artifact_complete` 无 `task_start`）：保留原始有效事件以便诊断，但该批次不进入相应转化率分子；不回填上游。
- `occurred_at` 比 `received_at` 未来超过 5 分钟或早于 24 小时：标记 `clock_or_late_error`，不进主分析。
- `qualified_session` 出现在 CTA click 之后或 `qualified_before_cta != true`：整个批次不进 E1 主分析。
- 拒绝与 quarantine 不得被记为 0 事件；必须单独报数据丢失。

### 机器人与合成流量

- 在接收边缘以短生命请求信号判定 `known_bot`，只保存枚举结果，不保存 IP/User-Agent 原值。
- 验收流量必须显式标记 `synthetic_test`，与所有业务指标隔离。
- `known_bot` 和 `synthetic_test` 排除于业务漏斗；`unknown` 保留但单独报告，不得静默当作人类。
- 如果机器人分类只能依赖持久 IP/User-Agent 日志，E1 停止，由 CTO 提供无原值保留的边缘分类方案。

## 8. 数据保留与删除

| 数据 | 最长保留 | 删除规则 |
|---|---:|---|
| 有效原始 E0/E1 事件 | 35 天 | 按 `received_at` 每日删除；无备份外例 |
| invalid/quarantine 事件 | 7 天 | 只保留 allowlisted 字段和错误码；原始 body 不入库 |
| `event_id` / `batch_id` | 随原始事件，最长 35 天 | 与原始行同删；不另建身份映射表 |
| 按日/分层聚合计数 | 180 天 | 仅保留达到最小报告阈值的单元；过期自动删除 |
| return token / join key（条件性） | 首次完成后 16 天 | 到期删除 token、join key 和链接表；拒绝/退出时立即删除 |
| 操作性聚合质量计数 | 180 天 | 只保留日期、错误码和数量，不带 `batch_id` |

删除验证必须使用合成标记，不查找或暴露真实用户行。任何备份、数据仓库或第三方复制都必须同时满足 TTL；做不到则不得收集。

## 9. 数据质量门禁

E1 决策前，必须对完整窗口和每个 `surface_cohort` 记录：

| 检查 | PASS | FAIL 动作 |
|---|---:|---|
| schema accept rate | `>=99%` | 暂停试验判断，CTO 修复发射/接收契约 |
| 必需字段缺失率 | `<0.5%` | 暂停试验判断 |
| semantic duplicate rate | `<1%` | 暂停并修复重复发射 |
| qualified 批次 CTA impression coverage | `>=95%` | 不计算 CTR；检查可见性/位置实现 |
| 序列无效率 | `<1%` | 不作漏斗结论 |
| `unknown` traffic 占比 | `<5%` | 只报区间/敏感性；`>=10%` 时停止 E1 判断 |
| 变体暴露与记录一致 | `>=99%` | 整个分层无效，不做因果判断 |
| 分层样本 | 每层 `>=300 qualified sessions` | 只报数据不足，不进行 success/stop 决策 |

这些是实现验收/数据解释门禁，不是已观测生产基线。首个有效窗口后应报实际值，不得将 PASS 阈值当作当前表现。

## 10. 可回放匿名漏斗

以下 JSONL 是合成验收数据，不是生产数据。六行共用一个单页批次，因此可回放 qualified → impression → click → start → complete → export；不包含 second use，因为 E1 不允许跨访问链接。

```jsonl
{"event_name":"qualified_session","schema_version":"1.0.0","event_id":"00000000-0000-4000-8000-000000000001","batch_id":"10000000-0000-4000-8000-000000000001","event_index":0,"occurred_at":"2026-08-14T08:00:30Z","experiment_id":"e1-cta-smoke-v1","experiment_variant":"cta_copy_a","surface_cohort":"cohort_theory_a","page_type":"theory","device_class":"desktop","locale":"en","traffic_class":"synthetic_test","data_use_class":"first_party_ephemeral","properties":{"qualification_rule_version":"qualified-v1","qualification_reason":"active_time","active_time_bucket":"30_119s","qualified_before_cta":true}}
{"event_name":"tool_cta_impression","schema_version":"1.0.0","event_id":"00000000-0000-4000-8000-000000000002","batch_id":"10000000-0000-4000-8000-000000000001","event_index":1,"occurred_at":"2026-08-14T08:00:31Z","experiment_id":"e1-cta-smoke-v1","experiment_variant":"cta_copy_a","surface_cohort":"cohort_theory_a","page_type":"theory","device_class":"desktop","locale":"en","traffic_class":"synthetic_test","data_use_class":"first_party_ephemeral","properties":{"cta_id":"research_map","placement":"after_overview"}}
{"event_name":"tool_cta_click","schema_version":"1.0.0","event_id":"00000000-0000-4000-8000-000000000003","batch_id":"10000000-0000-4000-8000-000000000001","event_index":2,"occurred_at":"2026-08-14T08:00:35Z","experiment_id":"e1-cta-smoke-v1","experiment_variant":"cta_copy_a","surface_cohort":"cohort_theory_a","page_type":"theory","device_class":"desktop","locale":"en","traffic_class":"synthetic_test","data_use_class":"first_party_ephemeral","properties":{"cta_id":"research_map","placement":"after_overview"}}
{"event_name":"task_start","schema_version":"1.0.0","event_id":"00000000-0000-4000-8000-000000000004","batch_id":"10000000-0000-4000-8000-000000000001","event_index":3,"occurred_at":"2026-08-14T08:01:10Z","experiment_id":"e1-cta-smoke-v1","experiment_variant":"cta_copy_a","surface_cohort":"cohort_theory_a","page_type":"theory","device_class":"desktop","locale":"en","traffic_class":"synthetic_test","data_use_class":"first_party_ephemeral","properties":{"task_type":"research_design_map","input_mode":"public_entity_selection"}}
{"event_name":"artifact_complete","schema_version":"1.0.0","event_id":"00000000-0000-4000-8000-000000000005","batch_id":"10000000-0000-4000-8000-000000000001","event_index":4,"occurred_at":"2026-08-14T08:02:10Z","experiment_id":"e1-cta-smoke-v1","experiment_variant":"cta_copy_a","surface_cohort":"cohort_theory_a","page_type":"theory","device_class":"desktop","locale":"en","traffic_class":"synthetic_test","data_use_class":"first_party_ephemeral","properties":{"artifact_type":"research_design_map","source_count_bucket":"3_5","uncertainty_items_bucket":"1_2","completion_mode":"generated"}}
{"event_name":"artifact_export","schema_version":"1.0.0","event_id":"00000000-0000-4000-8000-000000000006","batch_id":"10000000-0000-4000-8000-000000000001","event_index":5,"occurred_at":"2026-08-14T08:02:20Z","experiment_id":"e1-cta-smoke-v1","experiment_variant":"cta_copy_a","surface_cohort":"cohort_theory_a","page_type":"theory","device_class":"desktop","locale":"en","traffic_class":"synthetic_test","data_use_class":"first_party_ephemeral","properties":{"artifact_type":"research_design_map","export_format":"markdown","export_status":"success"}}
```

重放预期：`qualified=1`、`impression=1`、`click=1`、`start=1`、`complete=1`、`export=1`；所有业务主指标仍应排除该批次，因为 `traffic_class=synthetic_test`。验收运行器必须提供 `include_synthetic=true` 才能看到这些预期值。

## 11. 实现验收测试

| ID | 给定 | 必须结果 |
|---|---|---|
| AT-01 | 上述 JSONL | 开启 synthetic 模式时 6 步各 1；默认业务报表各 0 |
| AT-02 | 重放同一 `event_id` 两次 | 原始 accepted 事件仅 1，transport duplicate +1 |
| AT-03 | 两个不同 `event_id` 但同一语义键 | 分析只计 1，semantic duplicate +1 |
| AT-04 | payload 增加 `email`、`query`、`url` 或自由文本字段 | 整个事件拒绝，未知字段不得写入日志/库 |
| AT-05 | `artifact_complete` 没有先行 `task_start` | 保留事件做诊断，不计 completion 分子，invalid sequence +1 |
| AT-06 | `qualified_session` 在 CTA click 之后 | 整批次排除于 E1 主分析 |
| AT-07 | `known_bot`、`synthetic_test`、`unknown` 各一批 | 前两者从业务漏斗排除，`unknown` 单独分段 |
| AT-08 | viewport 767/768/1023/1024 | 分别映射 mobile/tablet/tablet/desktop，不发送原始宽度 |
| AT-09 | 事件时间比接收时间未来 6 分钟 | 标记 `clock_or_late_error`，不进主分析 |
| AT-10 | E1 请求带 Cookie/localStorage token/return key | 接收端拒绝，隐私负向测试通过 |
| AT-11 | 35 天原始行和 7 天 quarantine 行 | TTL 作业删除到期行，备份/副本不留存 |
| AT-12 | 小于 300 qualified sessions | 模板状态为 `insufficient_sample`，不输出 success/iterate/stop |
| AT-13 | 启用 `second_use` 但无审查版本/明示参与记录 | 发射和接收均 fail closed |
| AT-14 | 原始事件重算报表 | 分子/分母与聚合表一致；不一致则整个窗口不可决策 |

E1 工程验收必须把这些测试放入标准 `npm test` 可达路径，不得只有一个孤立脚本。

## 12. 实验分析模板

```md
# E1 结果｜<experiment_id>

## 口径
- 窗口：<UTC start> 至 <UTC end>，延迟到达宽限 <24h>
- 预注册版本：<document/revision>
- 流量单位：qualified-v1 visit_batch；非身份化用户
- 分母：每层 distinct qualified batch_id
- 排除：known_bot、synthetic_test、schema invalid、late/clock error、invalid sequence

## 基线和样本
| cohort | variant | qualified n | impression n | click n | CTR | 状态 |
|---|---|---:|---:|---:|---:|---|
| ... | ... | ... | ... | ... | ... | observed / insufficient_sample |

## 数据质量
- accept / missing / transport duplicate / semantic duplicate / invalid sequence rates：<...>
- CTA coverage：<...>
- known_bot / unknown / synthetic shares：<...>
- 原始重算与聚合差异：<0 or explanation>

## 结果与分段
- 主指标：qualified-session CTR = <click n>/<qualified n> = <%>
- 辅助：impression CTR、task start、artifact complete、export
- 分层：surface cohort / page type / device / variant
- 不确定性与多重分段限制：<...>

## 可能原因与反证
- 可能原因：<意图匹配、CTA 可见性、文案承诺、流量结构>
- 反证：<不同 device/cohort 方向相反、CTA coverage 异常、unknown traffic 过高、下游无启动>
- 归因边界：非随机或季节/渠道结构变化时，只报关联，不报增量因果

## 成本与 guardrails
- 工程/分析工时：<...>
- 模型、计算、存储、带宽、支持成本：<...>
- 任务成功、信任、页面性能、隐私和数据质量 guardrail：<...>

## 决策
- `>=3%` 且每层 n>=300 且质量 PASS：可建议进入人工 artifact 验证，由 Chief of Staff/Founder 决策
- `1%–<3%`：只允许一次文案/位置迭代复测
- `<1%`：停止该業子，不接支付
- 任一数据/隐私/CTA 承诺 guardrail FAIL：暂停或终止，不按 CTR 扩量

## 下一步
- 实验：<一个可证伪变更>
- 成功/停止条件：<...>
- 负责人：Growth 口径与解释；CTO/Founding Engineer 事件与质量；Chief of Staff/Founder Scale/Kill
```

## 13. 实现交接与停止条件

### E1 工程可实现范围

- 仅实现 A 类事件，第一方 endpoint，批次级内存 ID，schema allowlist 与 TTL。
- 把 raw → validate → deduplicate → classify → aggregate 的纯函数与固定 JSONL 纳入 `npm test`。
- 为关闭埋点、拒绝全部事件和排除 synthetic 提供 kill switch。
- 实现前由 CTO/Founding Engineer 进行 schema 与日志边界复核；由 Chief of Staff/Founder 确认 Privacy 告知是否需要同步更新。

### Fail-closed 停止条件

- 无法在不采集原始研究/搜索内容或持久身份的前提下确定 `qualified-v1`；
- 页面实际不能区分内容参与与 CTA 互动，导致分母受实验处理本身影响；
- 稳定去重或机器人排除必须保存 IP/User-Agent 原值或第三方跟踪标识；
- 无法实现 35/7/16 天 TTL 与备份删除；
- 需启用 `second_use`、广告/CMP 或任何 B 类事件，但没有已记录的隐私评审与 owner 授权。

### 责任人

- Growth, SEO & Data Lead：契约、分母、质量门禁、分析与归因边界。
- CTO / Founding Engineer：E1 实现、标准测试路径、服务端 allowlist、TTL/删除和 kill switch。
- Chief of Staff / Founder：Privacy 告知、跨访问存储、外部发布与 Scale/Kill 决策。
- UI：CTA 可见性与交互实现不破坏任务、可访问性或内容信任。

## 14. 当前成本、风险与结论边界

- 本 E0 成本：$0 广告支出，$0 生产基础设施新增；只产出文档与合成验收数据。
- 当前样本量：0；当前数据质量：`not_applicable`；当前转化、留存、贡献毛利与增量结论：`unknown`。
- 这份契约不是同意机制、法律意见、广告接入、实验启动、生产实现或部署授权。
- E1 可在单独工程 Gate 下实现 A 类事件；`second_use_14d` 必须继续保持 `not_measurable` 直到 B 类评审通过。
