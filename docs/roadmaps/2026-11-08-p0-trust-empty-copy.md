# P0 信任页与诚实空态文案：实施计划

> 日期：2026-11-08  
> 状态：已完成  
> 阶段：P0  
> 负责人：Cloud agent  
> 关联：内容缺口表 2026-11-08 第 B 节；SEO/AEO brief 2026-11-07；林文 START（N=8，#9 延后）。VisaLang 深内容优先，本 PR 只做 Syrtag P0。

## 1. 目标与用户价值

- 让访客和爬虫在空的公开图谱上读懂 Syrtag 是什么、范围只到 education 与 sociology、为什么目录是空的、下一步读哪一页。
- 信任页可以引用：来源与核验日、综述不是同行评审、证据不足时标 limited review、当前没有广告和追踪 cookie、导航不是专业意见、更正入口未开通。

## 2. 范围

### 包含

- `/`、`/about`、`/editorial-policy`、`/privacy`、`/terms`、`/corrections` 的英文文案与 meta。
- `/theories`、`/scholars`、`/works`、`/topics`、`/concepts`、`/disciplines`、`/fields` 共用的空态。

### 不包含

- 发布或 seed 缺口表 #1–#8 旗舰实体。#9 继续延后。
- 打开广告、写入 ads.txt 或 AdSense meta。
- 编造运营主体、邮箱或辖区。
- 修复 `syrtag.com` HTTP 521。

## 3. 当前证据与决策

- 现象/复现路径：公开 corpus 在 FAN-247 之后没有 `published` 实体。首页空态与 meta 需要同时说明目录可能为空。生产域 2026-11-08 仍为 HTTP 521。
- 根因或待确认假设：图谱组件不是独特内容。空索引必须写成出版状态，而不是用薄卡片假装有库。
- 需要用户确认的决策：林文已拍板 N=8，但来源与人审仍是发布前置条件，所以本 PR 不发布实体。法定名称仍由林文以后填写。
- 不能假设的事实或外部依赖：合并后的 PR 不能代替线上抽检。Vault 路径若不在本环境，则无法写入 Obsidian 审核记录。

## 4. 实施步骤

1. 对齐首页 meta 与空态三句 — 文件：`src/lib/seo.ts`、`src/app/page.tsx`。
2. 改写信任页可引用段落 — 文件：`src/app/about/page.tsx`、`src/app/editorial-policy/page.tsx`、`src/app/privacy/page.tsx`、`src/app/terms/page.tsx`、`src/app/corrections/page.tsx`。
3. 统一索引导语空态 — 文件：`src/components/content/EntityIndexPage.tsx`。七个索引页已有 “may be empty”，继续共用该组件，不生成占位卡片。
4. 用测试锁住第 B 节纸面验收 — 文件：`tests/trust-empty-copy.test.ts`。

## 5. 数据、内容与安全

- 数据来源与核验等级：这些句子描述站点行为与出版规则，不新增学术主张。
- 数据迁移/seed 影响：无。
- 环境变量/权限需求：无。
- 隐私、版权或法律影响：Privacy 继续声明广告与追踪 cookie 未启用，并写明启用前必须先改本页。Editorial policy 要求已发布摘要是转述加主源，不粘贴版权摘要。About 不填写法定名称。

## 6. 验收标准

- 自动化：`npm test`、`npm run lint`、`npm run typecheck`。`npm run build` 在环境允许时运行。
- 浏览器：信任页与空态首页在生产模式下可读；无数据库时首页是不可用状态，空目录文案要在数据库可连且没有 published 图时才出现。
- 数据：seed 的 publication status 不变。
- 链接/SEO：无新路由。首页与 About 描述不超过 160 字，并写明可能为空、广告关闭。

## 7. 风险、回退与发布判定

- P0/P1 风险：文案若暗示库已装满或广告可申请，会与 published ≈ 0 和 ads-off 冲突。本轮用测试拦住 “74 published”、全学科和 AdSense 就绪话术。
- 回退方式：还原本变更即可。不要在回退时打开发布开关或广告。
- 发布结论条件：本变更可以合并进仓库。`https://syrtag.com` 仍是 HTTP 521，合并不等于现网验收。

## 8. 执行记录（实施后填写）

- 实际改动：首页空态 H1 与三句、信任页可引用段落、七个索引共用空态、对应 meta。Editorial policy 写明转述加主源，禁止粘贴版权摘要。About 槽位仍是 “Not published.”。未改 seed，未开广告。
- 验证结果：`npm test` 171 通过、0 失败、3 项既有 skip。`npm run lint` 0 error（3 个既有 warning 在生成脚本）。`npx next typegen && npm run typecheck` 通过。`npm run content:check` 通过（2 disciplines and 12 theories）。`npm run build` 通过，构建冒烟 2/2。本地空库（published 行数为 0）生产构建后，首页、`/theories`、`/works` 显示空态且没有实体卡片；搜索 “teacher identity” 无学者或理论链接；首页可点到 About 再点到 Editorial policy；375px 菜单可开并用 Escape 关闭；1090px 为菜单，1200px 为桌面导航。无数据库时的旧构建显示 “Data temporarily unavailable”，与空目录不是同一状态。
- 未完成项与原因：`https://syrtag.com` 仍是 HTTP 521，本环境不能做线上抽检。P1 #1–#8 不在本 PR。本环境没有 `/Users/fanlw/Documents/Website-Content-Hub/`，所以没有写入 Obsidian 审核记录。
- 下一步：来源与人审完成后再单独立项发布 #1–#8。林文填写 About 槽位，并在控制台恢复 `syrtag.com`。
