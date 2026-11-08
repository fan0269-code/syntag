# 全站内容优化与下一阶段执行规划

> 日期：2026-11-08  
> 状态：计划中（本 PR 只落规划与提示词，不改 corpus、不解档）  
> 阶段：P1 内容语料 / 发布闸前置  
> 负责人：Cloud agent 规划；人审、U3 解档、deploy 须主人  
> 关联：FAN-247；PR #18 F0 Life Course 摘要收窄；`docs/standards/content-writing-standard.md`；`prompts/16`–`prompts/21`

## 1. 目标与用户价值

硕博读者需要的不是更多空壳页，而是：**一条可追溯的研究问题 → 理论 → 学者/著作路径**，并能分清来源事实、编辑合成与研究建议。

本轮完成后用户可观察的变化：主人拿到一份可按窗口执行的提示词链。公开目录在 W1 人审完成并授权 W2 之前仍为空；Agent 不得把规划写成已发表。

## 2. 范围

### 包含

- 对现有 Education / Sociology 语料做**优化诊断**（不是扩科、不是灌站）。
- 把下一阶段拆成 6 个独立执行窗口，并写出可粘贴的提示词。
- 明确 F0 解档、公开文案切换、同簇概念收窄、Teacher Identity 摘要收窄的依赖顺序。

### 不包含

- 本 PR 不改 `src/data/corpus/`、不改 FAN-247、不部署、不开广告、不换图谱引擎。
- 不伪造人审签字，不把字数当验收。
- 不新增 Psychology / Management。
- 不执行 W2–W6（只提供提示词）。

## 3. 当前证据与决策

### 3.1 现象

| 层 | 2026-11-08 事实 |
| --- | --- |
| 公开目录 | authored seed **published 0 / draft 7 / archived 74**；FAN-247 = 58 页归档；U3 另归档 1 work + 15 concepts |
| 信任页 | About / Privacy / Terms / Editorial / Corrections 已与广告关闭对齐 |
| 旗舰 | F0 候选已在 PR #18 按公开摘要收窄，**仍 archived** |
| 图谱 | N22 自绘 Canvas；无 published 节点可画；主人指示稍后 |
| 生产 | Vercel 切流已合入；域名恢复与 Postgres 仍须主人控制台 |

### 3.2 根因

内容瓶颈是**证据 locator + 真人行级审核 + U3 解档授权**，不是缺页面骨架，也不是缺力导向图谱库。2016–2026 的旧「12 理论已公开」叙述不得再当基线。

### 3.3 需要主人确认

1. 是否在 W1 对 F0 四实体做行级人审（不能由 Agent 代填）。  
2. 人审 PASS 后是否授权 W2 只解档 allowlist 四 slug。  
3. 图谱继续后置到「至少有 published 节点」之后。

### 3.4 不能假设

- 人审已完成；生产已恢复；AdSense 可申请；F0 PR 已合并（执行 W1/W2 前先确认 #18 或等价语料在工作树）。

## 4. 优化诊断（少而深）

优化原则：**省略无 locator 的句子，优于扩写凑字数。** 2026-08-14 成熟度审计指出 Work/Concept 低于规划字数区间；按现行写作标准，那不是扩写许可。

| 问题 | 优化动作 | 窗口 |
| --- | --- | --- |
| F0 理论已去掉五原则具名清单，但 `trajectory` / `transition` / `turning-point` 概念页仍用该词汇 | 先按摘要边界收窄或省略 turning-point；不解档 | W4 |
| Teacher Identity D3 全文 locator 大量 blocked | 复用 F0 方法：公开摘要收窄，省略 blocker | W5 |
| Topic–theory `riskReview` 全 pending | 公开 topic 前必须有 methods 签字；否则保持 archived | W1/W2 |
| 索引/About 按「目录为空」书写 | 一旦有 published，必须改成「当前仅 N 个 published」，禁止继续假装全空或假装 12 理论 | W3 |
| 旗舰 stub 仍是 `TODO_OWNER_FLAGSHIP_*` | 把候选身份改成真实 slug，**不**把 archived 正文拷进 stub 当已发表 | 本 PR 文档 |
| 谱系边 `PUBLIC_GENEALOGY_RELATION_IDS` 为空 | 保持 fail-closed；不为密度解禁 | 全程 |
| draft 学者/主题 7 条 | 保持 draft；不进入 F0/F1 | 全程 |
| 整科 `education` / `sociology` 解档 | 禁止：会强制连带其他理论 published | 全程至 F2 以后另立项 |

推荐公开形状（仅在 W2 授权后）：

```text
Topic  educational-transitions-over-time
Theory life-course-theory
Scholar glen-h-elder-jr
Work   elder-1998-life-course
```

不要同时解档 Field / Discipline / 其他 D3 / 15 个 U3 概念。

## 5. 下一阶段窗口（严格依赖）

```text
W1 人审包（Agent 只呈现，不得代审）
  ├─ 若 blocked：停止 W2/W3；W4/W5 仍可做收窄研究
  └─ 若主人签字 + U3 授权 → W2 四 slug 解档 → W3 公开文案与测试
W4 F1 同簇概念收窄（默认同 W1 并行，仍 archived）
W5 Teacher Identity 摘要收窄（默认同 W1 并行，仍 archived）
W6 阶段结案：只选一个下一包，不执行
```

图谱、AdSense、扩科、批量解档 58 页：**不是本阶段下一包。**

## 6. 实施步骤（本 PR）

1. 写本规划 — 文件：`docs/roadmaps/2026-11-08-content-optimization-and-next-phase.md`  
2. 写 W1–W6 提示词 — 文件：`prompts/16-w1-*.md` … `prompts/21-w6-*.md`  
3. 更新 `prompts/README.md` 为当前执行入口  
4. 旗舰 stub 对齐真实 F0 slug — 文件：`docs/content/2026-11-07-flagship-source-stubs.md`  
5. 回写 playbook 基线与 N37

## 7. 数据、内容与安全

- 本 PR 无 seed / 迁移影响。  
- 后续 W2 才会动 FAN-247 allowlist 与 published 计数。  
- 不申请广告；不在公开页写入未填运营者身份。

## 8. 验收标准（规划本身）

- 六个提示词均可单独开窗；每个写明读取清单、禁止项、产物路径、停止条件。  
- README 把 2026-08 七天窗口标为历史，把 16–21 标为当前入口。  
- 测试锁定提示词文件存在且 README 顺序正确。  
- 无 corpus status 翻转。

## 9. 风险、回退与发布判定

- P0：把本规划当成解档授权 → 提示词写死「本文件不授权 published」。  
- P1：W1 未签就跑 W2 → W2 启动门禁失败即停。  
- 回退：删除本 PR 文档即可；不影响 FAN-247。  
- 发布结论：本 PR 不是生产发布，不是 AdSense 申请。

## 10. 执行记录

- 实际改动：本规划、六份提示词、README、旗舰 stub 身份对齐、playbook N37。  
- 验证：见 PR 描述命令。  
- 未完成：W1 人审；W2 解档。  
- 下一步：主人打开 `prompts/16-w1-f0-human-review.md`。
