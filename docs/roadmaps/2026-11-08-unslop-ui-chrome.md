# 共享界面去模板化：实施计划

> 日期：2026-11-08  
> 状态：已完成  
> 阶段：P2  
> 负责人：Cloud agent  
> 关联：unslop（Damir Sokolovsky，CC BY 4.0，https://github.com/heydamir/unslop）；PR #20 诚实空态已合并。

## 1. 目标与用户价值

- 让教育与社会学的导航读起来像一份安静的目录，而不是一套发光的模板。
- 访客仍能从空首页、About、Editorial policy 和一个空索引看清：公开记录尚未发布，广告关闭，运营主体未填写。

## 2. 范围

### 包含

- 共享版式、设计令牌、页头页脚、阅读页、图谱外壳、搜索控件和 Open Graph 卡片的视觉。
- 把 unslop 技能副本放进 `.cursor/skills/unslop/`，并保留署名。

### 不包含

- 改写 P0 信任句、空态句、`Not published.`。
- 把旗舰实体写入 seed，或把任何记录改为 `published`。
- 打开广告，或写 AdSense 就绪声明。
- 编造法定名称、邮箱或辖区。
- 修复 `https://syrtag.com` 的 HTTP 521。生成式英雄图。故事视频。

## 3. 当前证据与决策

- 现象/复现路径：页身有蓝/琥珀径向光晕，页头和图谱外壳使用玻璃模糊，字标带光环，大量 12px 标签是全大写加宽字距，按钮字重到 700。生产域仍是 HTTP 521，所以只看本地构建。
- 根因或待确认假设：这是轻到中等的模板痕迹，品牌本身（暖纸、墨色、Source Serif、一处蓝色）可以留下。
- 方向：Syrtag 为教育学与社会学的博士研究提供可溯源的理论导航。性格是 calm, exact, a little warm。世界是阅读室里的纸和墨。丰富处只在已发布图谱里，节点颜色表示类型。空页不画假图谱。签名是字标旁一颗扁平的蓝色节点，不再带光晕。
- 不能假设的事实或外部依赖：合并不等于线上可检。无数据库时首页是不可用状态，空目录文案要在库可连且没有 published 图时才出现。

## 4. 实施步骤

1. 安装技能副本 — 文件：`.cursor/skills/unslop/`。
2. 九轮只改共享样式与 OG 卡片 — 文件：`src/app/globals.css`、`src/app/styles/*.css`、`src/app/api/og/route.tsx`。
3. 用令牌测试锁住无玻璃、无色晕、无全大写字距标签 — 文件：`tests/ui-tokens.test.ts`。

## 5. 数据、内容与安全

- 数据来源与核验等级：无新学术主张。
- 数据迁移/seed 影响：无。
- 环境变量/权限需求：无。
- 隐私、版权或法律影响：广告保持关闭。About 槽位仍是 “Not published.”。unslop 文本按 CC BY 4.0 署名。

## 6. 验收标准

- 自动化：`npm test`、`npm run lint`、`npm run typecheck`、`npm run build`。
- 浏览器：本地生产构建查看空或不可用首页、About、Editorial policy、Theories 索引、页头在 375px 与桌面宽度。
- 数据：seed 的 publication status 不变。
- 链接/SEO：无新路由。

## 7. 风险、回退与发布判定

- P0/P1 风险：若样式改动让控件低于 44px，或让空态看起来像已发布图谱，会伤害可信度。本轮保持 44px 点击高度，空态仍是文字。
- 回退方式：还原本变更。不要在回退时打开发布开关或广告。
- 发布结论条件：可以合并进仓库。`https://syrtag.com` 仍是 HTTP 521，合并不等于现网验收。

## 8. 执行记录（实施后填写）

- 实际改动：共享令牌、页头页脚、阅读页、图谱外壳、搜索控件和 Open Graph 卡片改为暖纸与墨色。去掉玻璃模糊、背景色晕、字标光环、全大写宽字距标签和 650–700 字重。字标保留一颗扁平蓝色节点。空态与信任文案未改。未改 seed，未开广告。技能副本在 `.cursor/skills/unslop/`，署名 Damir Sokolovsky / https://github.com/heydamir/unslop （CC BY 4.0）。
- 验证结果：`npm test` 175 项中 172 通过、0 失败、3 项既有 skip。`npm run lint` 0 error，3 个既有 warning 在生成脚本。`npx next typegen && npm run typecheck` 通过。`npm run build` 通过，构建冒烟 2/2。无数据库的生产构建：首页是 “Data temporarily unavailable”，不是空目录句，也不是 demo 图；About 与 Editorial policy 仍写 “Not published.” 与来源规则；`/theories` 是数据库不可用，没有假卡片。页头在 1090px 收成菜单，1200px 展开。375px 菜单可开，Escape 关闭。正文背景无径向渐变，字标无光晕。
- 未完成项与原因：本环境没有 Postgres，所以看不到 “The knowledge graph is not published yet” 那一态；该文案未改，并由 `tests/trust-empty-copy.test.ts` 锁住。`https://syrtag.com` 仍是 HTTP 521。没有写入 Obsidian 审核记录，本环境没有该 Vault。没有故事视频。
- 下一步：林文恢复现网后再看线上版式。空目录句要在已连接且 published 图为 0 的库上再看一眼。
