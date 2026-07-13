# C4 六个 D1 理论基础页：实施计划

> 日期：2026-07-13  
> 状态：已完成（本地验收通过）  
> 阶段：C4  
> 关联：用户提供的 `Prompt C4`；`docs/roadmaps/2026-07-13-d2-theory-deepening.md`

## 1. 目标与范围

- 将既有六个 D1 页面完善为简洁、可信、可用于初步理论筛选的基础页：Teacher Professional Development Theory、Teacher Life History Research、Educational Equity Theory、Institutional Theory、Street-Level Bureaucracy 与 Multiple Streams Framework。
- 仅更新作者语料、内容验证、呈现回归和建设基线；不新增理论、著作、概念、学科或产品功能。

## 2. 内容合同

每页必须明确其准确性质（严格理论、框架、研究传统或编辑性总称），并给出可追溯的定义、核心概念、适用问题、边界、误用风险和至少一条阅读路径。每个精确事实由 L1 来源支持；跨理论关系明确为 L1 事实或 L2 编辑比较；研究建议保留为 L3 且说明需依问题、材料与场域调整。

## 3. 执行顺序与验收

1. 建立六个条目的权威来源证据包，并先判定术语性质及不可断言的内容。
2. 为六页分别写入非模板化的作者语料、来源、阅读路径和 L1/L2/L3 核验。
3. 为每页补充与既有 D2/D3 理论的有依据关系，不把相邻主题误写成理论谱系。
4. 添加 C4 内容合同与呈现回归测试。
5. 运行内容验证、全量测试、lint、build、差异检查，并浏览器检查至少三个代表 D1 页面。

## 4. 边界与风险

- 不把 Teacher Professional Development 或 Educational Equity 包装为单一、封闭的经典理论；不把 Teacher Life History Research 当作因果理论；不将 Multiple Streams Framework 写成实施模型。
- 不以“被本站引用”断言创始人、谱系或跨理论关系；无法由原著、DOI、出版社、大学、期刊或权威机构支持的关系只保留为明确标注的编辑比较，或删除。
- 不提交、推送、部署或写入远程数据库；本地 seed 仅可用于本机浏览器验收。

## 5. 完成记录

- 实际改动：六个既有 D1 均改为独立、简洁的基础页语料，并新增可见的 `D1 Page Scope & Status` 区块及其来源链接。Teacher Professional Development、Teacher Life History Research、Educational Equity 分别明确为编辑性入口、研究传统、编辑性规范/经验研究总称；Institutional Theory 限定为以组织新制度主义为锚的理论家族页面；Street-Level Bureaucracy 明确为前线实施视角；Multiple Streams 明确为政策过程框架。生命史研究与生命历程理论的图谱关系已由不成立的前驱关系降为条件性的整合关系。
- 来源与核验：新增一份覆盖六页的权威来源证据包；页面语料仅使用原著、DOI、出版社、大学、期刊或权威机构记录。每页有至少两项独立 L1 来源、分层阅读路径、L1/L2/L3 核验，以及附证据的既有 D2/D3 页面关系。
- 验证结果：`npm test` 57/57、`npm run lint`、`npm run db:seed`、`npm run build` 与 `git diff --check` 通过。本机浏览器检查 Teacher Life History Research、Educational Equity Theory、Multiple Streams Framework：页面性质、阅读路径和三种核验标签均显示；每页 13–14 条外部来源链接、占位文案为 0、无横向溢出。
- 独立审查：规格审查 0 项阻断/实质问题；标准审查 0 项硬违反与 0 项实质代码异味。
- 未完成项与原因：未提交、未推送、未部署；线上仍是 C1–C4 前版本，符合本阶段禁止项。
- 下一步：C4 已通过；下一阶段仅可另开 C5，审核并发布既有来源对应的 Works 与去重的 Concepts，不自动启动。
