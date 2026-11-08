# 公开文案一致性审计（相对最新 main）

- 日期：2026-11-08（Asia/Shanghai）
- 基线：`origin/main` @ `fe6f601`（已合入 PR #13 ads-off、PR #14 site-audit）
- 范围：About / Privacy / Terms / Pricing / Framework Builder / 首页阅读说明 / README / 页脚
- 结论：在最新 main 上仍有若干跨页矛盾；本轮已修并对齐

## 仍在最新 main 上发现的矛盾

| ID | 严重度 | 矛盾 | 处理 |
| --- | --- | --- | --- |
| C1 | 高 | Privacy 写 About「states the same advertising boundary」，但 About 无广告节 | About 增加 Advertising；Privacy 改为 repeats advertising-off |
| C2 | 中 | SiteReadingGuide 称 about/privacy/contact 都写了广告边界；About、Corrections 实际未写广告 | 改为 about + privacy；联系槽位单独说明 |
| C3 | 中 | Framework Builder 仍写 Phase 1 open theory graph，并引导从图谱选题 | 改为 planned / not live |
| C4 | 中 | About「not published from this change」是 PR 口吻；「It connects…」像现状已有图谱 | 改为 not currently published；When records are published… |
| C5 | 低 | Terms 广告节未与 About 交叉，且未约束 Pricing 语义 | Advertising is off + About 交叉引用 |
| C6 | 低 | Pricing / 页脚广告叙述不同步 | Pricing 补 Advertising is off |
| C7 | 低 | README 仍写公开页用 `TODO_OWNER_*`，但 About/Corrections 已改为 “Not published.” | README 与公开页同向 |

## 已同向的轴

- 广告关闭：About / Privacy / Terms / Pricing / 页脚 / 阅读说明；无 ads.txt；无 google-adsense-account
- 发布边界：空目录 / draft·archived / 仅 published 公开
- 身份联系：无主体公示；无受监控渠道；公开页不用 TODO_OWNER 伪标签
- 学科范围：education + sociology
- 定价：Free = 无付费墙，不等于实体已发布

## 残留（不在本轮）

- 生产 521
- 主人填写真实运营者与联系渠道
- 旗舰学术页仍需可核验来源后才能发布
- 不宣称可申 AdSense，不部署
