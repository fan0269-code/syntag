# 公开文案一致性审计

- 日期：2026-11-08（Asia/Shanghai）
- 范围：公开信任页、首页阅读说明、定价、Framework Builder、实体索引、README、页脚；不含学术实体正文重写，不含生产源站修复
- 目的：找出互相打架的对外说法，并改到前后一致
- 结论：已修复本轮发现的公开文案矛盾；广告保持关闭；FAN-247 下仍无 published 实体

## 1. 对照轴

| 轴 | 必须同向的说法 |
| --- | --- |
| 广告 | 未启用广告技术；不加载广告脚本；不发布 ads.txt / google-adsense-account；Privacy / About / Terms / 页脚同向 |
| 发布边界 | 只有 `published` 公开；当前语料 draft/archived，seed 后无公开实体页；seed/demo ≠ 已发表学术结论 |
| 身份与联系 | 无注册主体/个人运营者公示；无受监控联系渠道；仅 `TODO_OWNER_*`；无虚构委员会 |
| 学科范围 | 公开意图范围 = education + sociology；不宣称其他学科已覆盖 |
| 定价 | Free = 无付费墙；不等于已有完整公开图谱或实体目录 |

## 2. 发现的矛盾（修复前）

| ID | 严重度 | 矛盾 | 处理 |
| --- | --- | --- | --- |
| C1 | 高 | Privacy 写 About「用白话写了同一广告边界」，但 About 完全不提广告 | About 增加 Advertising 节，与 Privacy / 页脚同向 |
| C2 | 高 | Pricing 写「public research knowledge base is available free today」「Public graph… every public entity… remain freely accessible」，暗示目录已充实 | 改为：Free = 无付费/无账号门；不声称图谱或实体已发布；并写入当前语料无公开实体页 |
| C3 | 中 | Framework Builder 写 Phase 1「open theory graph and source-aware theory pages」，并引导「begin from a research topic or theory in the graph」 | 改为 planned / not live；仅当记录 published 时才有图谱 |
| C4 | 中 | About lede「The graph helps a reader move between published pages」像现状陈述；「not published from this change」是 PR 口吻 | 改为「When records are published…」；「not currently published」 |
| C5 | 中 | SiteReadingGuide 链接文案「Published topics」易暗示已有已发布主题；并称 about/privacy/contact 都写了广告边界，但 About 当时没有 | 链接改为「Topics index」；广告表述改为 about + privacy；联系槽位指向 about / corrections |
| C6 | 低 | 实体索引导语「Browse published … in the knowledge graph」在空目录时偏满 | 改为「currently have published status」+「An empty list means none are published yet」 |
| C7 | 低 | Terms 广告节未与 About 交叉引用，也未约束 Pricing 语义 | Terms 同步 Advertising is off，并说明 Pricing 不声称完整目录 |

## 3. 本轮未改、仍须另案处理

| 项 | 说明 |
| --- | --- |
| 生产 521 | 源站可达性属运维，不在文案一致性修复内 |
| `TODO_OWNER_*` | 仍为空槽，待主人填真实身份与联系渠道 |
| `TODO_SOURCE` 旗舰页 | 仍在 `docs/content/2026-11-07-flagship-source-stubs.md`，未进 seed、未发布 |
| Playbook 基线表 | 仍含 2026-07「线上已同步」历史行；文首已有 2026-11-07 复核说明，不在此轮整表重写 |
| 学术实体正文 | FAN-247 归档实体未解档；未批量生成或编造引用 |

## 4. 锁定测试

`tests/public-claim-consistency.test.ts` 锁定：广告关闭同向、发布空目录同向、身份/联系/范围诚实、不出现 AdSense-ready / production healthy / create-next-app 话术。
