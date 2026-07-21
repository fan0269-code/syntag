# 博士研究问题采集库

> 用途：潜水观察真实博士在公开社群里问的"研究问题→理论选择"问题，作为 Syrtag 着陆页与内容优先级的依据。
> 双写：本文件 + `~/Documents/Obsidian Vault/Projects/Syrtag/博士研究问题采集.md`
> 频率：每周汇总一次高频问题，转成着陆页候选清单。
> 红线：只记录公开发布的问题，不截图存隐私信息；引用时匿名化，不暴露提问者身份。

## 1. 为什么做这件事

Syrtag 吸引博士不靠"我是专家"，靠"内容对他的开题有用"。要保证有用，必须知道他们真实在问什么——而不是我猜他们问什么。这份库是"用户真问题"的事实源，优先级高于任何商业假设。

## 2. 潜水平台（每周扫一遍）

| 平台 | 子区/关键词 | 关注什么 |
| --- | --- | --- |
| Reddit | r/PhD、r/GradSchool、r/AskAcademia、r/Education、r/Sociology | "which theory"、"theoretical framework"、"theory for my research"、"help choose theory" |
| Academic Twitter/X | #PhDChat、#AcademicChatter、#EdResearch | 理论选择的困惑吐槽 |
| 博士写作小组/Facebook 群 | Education/Sociology 博士群 | 开题前的理论焦虑 |
| ResearchGate Q&A | theory selection 标签 | 公开提问 |
| Stack Exchange academia.stackexchange | theory-framework 标签 | 结构化问答 |

**不潜水**：私人论坛、付费社群（除非你是成员且合规）、任何要登录才能看的隐私区。

## 3. 采集字段（每条一行）

```
| 日期 | 平台 | 原始研究问题措辞（英文原文） | 隐含的理论候选/痛点 | 学科 | 搜索意图推断（他们 Google 会搜什么） | 优先级 |
```

示例：

| 日期 | 平台 | 原始问题 | 隐含理论/痛点 | 学科 | Google 搜索措辞推断 | 优先级 |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-07-25 | r/PhD | "I'm studying how teachers' careers shift mid-life, can't decide between life course theory and identity theory" | Life Course vs Identity，适用边界不清 | Education | "life course theory vs identity theory teacher career" | P1 |

## 4. 优先级规则

- **P1**：问题措辞具体、含明确理论候选对比、且与 Syrtag 已有语料（Education/Sociology）重合——能直接做成着陆页。
- **P2**：问题真实但理论不在现有语料——记下，作为扩语料的优先信号。
- **P3**：泛泛问"怎么选理论"——记下频率，不急着做页。

## 5. 周汇总动作

每周日做一次：
1. 把本周 P1 问题去重，挑 2-3 个最像真实 Google 搜索的措辞。
2. 对照 `src/data/corpus/` 现有理论，判断 Syrtag 是否已能回答。
3. 能回答 → 立项一个着陆页（或强化现有理论页的"研究问题"对应区块）。
4. 不能回答 → 进"语料缺口"清单，作为下一轮 content-batch 候选。

## 6. 着陆页候选清单（每周更新）

| 周次 | 候选着陆页主题 | 对应已有理论 | 状态 | 计划 slug |
| --- | --- | --- | --- | --- |
| 2026-W30 | （示例）teacher mid-career shift: life course vs identity | life-course-theory / teacher-identity-theory | 待立项 | （待定） |

## 7. 诚实的预期

- SEO 要 3-6 个月起效，所以第 1 天就开始攒。
- 前 4 周大概率只采到 5-15 条有价值问题，正常。
- 这份库的价值不在数量，在"验证 Syrtag 内容方向是否对准真实痛点"。如果连采 1 个月发现博士根本不问 Syrtag 想做的问题，那要回头校准方向，而不是硬推。
