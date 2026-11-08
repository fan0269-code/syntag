# W6 执行提示词：内容优化阶段结案与唯一下一包

> 日期：2026-11-08  
> 状态：待执行  
> 对应计划：`docs/roadmaps/2026-11-08-content-optimization-and-next-phase.md`

请只做交叉核对、阶段结案和**一个**下一包选择。不要执行下一包。

## 一、目标

1. 只读核对 W1–W5 的真实产物（未开始的标 `not_started`）。  
2. 重算 published / draft / archived 与 FAN-247 页数。  
3. 写阶段结案。  
4. 严格选择一个下一实施包。  
5. 不实施、不部署该包。

唯一规划写入目标：

```text
docs/roadmaps/YYYY-MM-DD-content-optimization-closeout.md
```

## 二、必须读取

1. 总规划与 `prompts/16`–`prompts/20`
2. 两份内容标准与 playbook「当前基线」
3. W1–W5 交接（缺失则 `not_started`）
4. `src/lib/fan247-visibility.ts`、seed 计数
5. 公开文案：Home / About / 索引

## 三、启动基线

```bash
git status --short --branch
git rev-parse HEAD
git rev-list --left-right --count origin/main...HEAD
```

## 四、下一包候选（只选一个）

按优先级，**第一个仍 blocked 的**即唯一下一包：

1. W1 未完成 → 下一包仍是 W1 人审（不得改选解档）。  
2. W1 完成但 W2 未授权/未做 → 下一包是 W2。  
3. W2 已 published 但公开文案仍当空目录 → 下一包是 W3。  
4. 以上完成，概念与理论仍矛盾 → 下一包是 W4。  
5. 以上完成 → 下一包是 W5 人审（Teacher Identity），不是解档。  
6. 仅当已有 published 节点、主人明确要图谱 → 才允许选「图谱渲染试点」；默认不选。

禁止选：批量解档 FAN-247、Psychology/Management、AdSense 申请、用 AI 灌实体。

## 五、结案必须包含的数字

- published / draft / archived  
- FAN-247 页数  
- 本阶段实际解档 slug 列表（可为空）  
- 人审已签行 / 未签行  
- 公开文案是否与 published 计数一致  

## 六、禁止

- 在结案里把 `pending_review` 写成已发布。  
- 为「看起来有进展」执行下一包。  
- 填写运营者身份或广告状态。

## 七、验证

结案文件存在；所选下一包对应一个已有提示词路径；`git diff` 不含 corpus 解档。
