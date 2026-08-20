# FAN-111 — AdSense 与 SEO 上线前联合审计

> 核验日期：2026-08-14（Asia/Shanghai）  
> 审计对象：当前公开站 `https://syrtag.com`、`https://www.syrtag.com`，以及工作区候选快照  
> 候选基线：`3323ebb8d2045cfe54c2c583c61c0cda52be59a5` + 当时工作区未提交变更（77 个 porcelain 条目）  
> 政策依据：仅使用 Google AdSense、Google Publisher Policies、Google Search Central 与 Google 隐私/同意官方资料  
> 结论边界：本审计只能识别已知风险，不能承诺 AdSense 审核通过、Google 收录、canonical 选择、富结果或排名。

## 1. 上线结论

**结论：HOLD，不应在当前状态提交 AdSense 站点审核或接入广告代码。**

候选快照本身的 sitemap、robots、canonical、结构化数据、内部链接、draft 隔离和移动端基础质量总体通过；但 2026-08-14 的公开站实查无法稳定取得任何核心 URL 的 HTTP 200，首次探测出现 Cloudflare `522`，后续对首页、robots、sitemap、法律页和 `ads.txt` 的并行探测均超时。Google 官方把“站点已发布且可访问”列为 AdSense readiness 的基本条件，因此这是上线前必须清零的 P0。

广告代码尚未存在，这是正确的当前边界。现有 Privacy 页面也准确声明尚未启用广告与 tracking cookies；但是一旦任何 AdSense tag 开始加载，该页面会立即失实，而且缺少 Google 要求的 cookie、标识符、数据收集/共享/使用和第三方广告技术披露。面向 EEA、英国、瑞士提供个性化广告时，还必须先完成 Google-certified CMP + IAB TCF v2.3 路径。

## 2. 口径、窗口、样本与数据质量

### 2.1 时间窗口与口径

- 公开站：2026-08-14 单点可达性与 Google Search 结果实查；不是连续 uptime 监控。
- 候选快照：同日工作区生产构建和 localhost 渲染结果；不是已部署生产版本。
- “PASS”表示在上述证据范围内通过；“FAIL”表示已复现缺陷；“BLOCKED”表示缺账户权限、生产可达性或广告实现，当前无法得出事实结论。
- 优先级：P0 为提交审核/加载广告 tag/公开上线前的阻断项；P1 为不一定构成单独政策违规、但显著影响信任、索引一致性、审核可解释性或收入质量的整改项。

### 2.2 样本与基线

| 数据集 | 样本量 | 结果 |
|---|---:|---|
| 候选 sitemap | 87 URL | 13 个静态 URL + 74 个 published 实体 URL；无重复、无 `www`、无 HTTP、无 `/api/` |
| 候选实体语料 | 81 实体 | 74 published；7 draft（3 scholar + 4 topic） |
| DOM 全量扫描 | 87/87 sitemap URL | 全部 HTTP 200、存在 H1、canonical 路径一致、无 `noindex`、JSON-LD 可解析、375px 横向溢出为 0、无孤儿页；非首页最少 2 个站内入链 |
| 生产构建 | 96 个静态页面 | `npm run build` 与 build-output smoke 通过 |
| Chromium + axe | 37 tests | 37/37 通过；覆盖 375、768、1024、1440 宽度、draft 隔离、导航、键盘和 serious/critical axe |
| focused SEO/边界测试 | 22 tests | 22/22 通过 |
| 公开 HTTP 探测 | 8 个核心 URL | 0 个稳定 200；首次 `www` 首页为 Cloudflare 522，后续探测超时 |
| Google 公开索引观察 | `site:syrtag.com` 抽样 | 同时出现 `www.syrtag.com`、`syrtag.com`；另有 `flowlight.me/about` 的 Syrtag 结果，生产重定向/所有权无法因站点不可达而复核 |

### 2.3 数据质量限制

- 无 Google Search Console、AdSense Sites、Policy Center、CMP、Cloudflare/源站或 field Core Web Vitals 访问，所以下列项目保持 BLOCKED：实际索引覆盖、Google-selected canonical、站点所有权验证、AdSense site status、ads.txt status、地区流量占比、CMP 实装与真实广告位体验。
- 公开站不可达使 robots、sitemap、canonical、JSON-LD 和移动体验的生产复验无法完成；候选 PASS 不能替代生产 PASS。
- 内容原创性使用了全语料结构/来源统计和跨实体类型的代表性页面抽样，没有对 74 个 published 页面逐句做版权或相似度鉴定，因此不能把“未发现明显复制”解释为全站版权保证。

## 3. 审计矩阵

### 3.1 当前必须修复或确认（提交 AdSense 审核前）

| ID | 项目 | 状态 | 优先级 | 页面/代码证据 | 结论与动作 | 负责人 |
|---|---|---|---|---|---|---|
| C-01 | 生产可达性、SSL 与 crawler access | **FAIL** | **P0** | `https://syrtag.com/`、`https://www.syrtag.com/`、`/robots.txt`、`/sitemap.xml`、`/privacy`、`/terms`、`/editorial-policy`、`/ads.txt` 均未取得稳定 200；首次返回 Cloudflare 522 | 修复 DNS/Cloudflare origin/部署健康；确认有效 CA 证书、HTTP→HTTPS、Googlebot/AdSense crawler 不受阻；未清零前不要申请 | CTO / Founding Engineer |
| C-02 | 主域、重定向与站点所有权边界 | **BLOCKED** | **P0** | 候选统一输出 `https://syrtag.com`（`src/lib/seo.ts:3,38-40,60-67`；`src/app/layout.tsx:22-25`）；Google 结果抽样混有 `www`/裸域/`flowlight.me` | 选定裸域为唯一主域；恢复站点后验证 HTTP、`www`、`flowlight.me` 是否 301 到同一 HTTPS canonical。AdSense 与 Search Console 都使用同一 exact site/property | CTO / Founding Engineer；Chief of Staff 确认域名 |
| C-03 | sitemap 生成与 published-only | **PASS（候选）/ FAIL（生产）** | **P0** | `src/app/sitemap.ts:5-20,22-52`；构建产物 87 URL；7 个 draft 均未出现；生产 `/sitemap.xml` 不可达 | 保留候选实现；部署后要求 200、XML 可解析、87 个 URL 均为 200/canonical/indexable，再提交 Search Console | Founding Engineer；Growth 复验 |
| C-04 | robots 与索引控制 | **PASS（候选）/ FAIL（生产）** | **P0** | `src/app/robots.ts:4-8` 允许 `/`、仅禁止 `/api/` 并声明 sitemap；生产 `/robots.txt` 不可达 | 部署候选后复验。不要用 robots 隐藏 draft；draft 应继续由发布状态、404/鉴权或可抓取的 `noindex` 控制 | Founding Engineer |
| C-05 | draft 公开暴露 | **PASS** | P0 | `src/lib/static-params.ts:3-16`、`src/app/sitemap.ts:25-33`、`tests/publication-boundary.test.ts:18-23`；E2E 验证 3 draft scholars + 4 draft topics 不在 index/search/sitemap/detail/graph | 保持 `published` fail-closed；任何新实体必须先过 `content:check` 和 draft 隔离 E2E | Content + Founding Engineer |
| C-06 | 内容原创性、实质价值与来源边界 | **PASS（抽样）/ BLOCKED（全语料版权保证）** | P1 | 74 个 published 实体；每个 published 实体至少含 1 条 L1 verified verification row，并保留 L2 editorial/L3 proposed 边界。代表页提供 overview、分析边界、reading focus、sources 和 legal access；`npm run content:check` 通过 2 disciplines + 12 theories | 理论/主题页显示明显的编辑增值；work/concept 页较短且多数仅 1 个来源，广告应先限定在高实质价值页面。未完成全语料版权核验前不把 PASS 外推为版权保证 | Content Lead；Growth 定义首批广告 allowlist |
| C-07 | 导航、可达性与内部链接 | **PASS（候选）** | P0 | `src/components/layout/Header.tsx:6-31`、`Footer.tsx:5-23`；87 URL DOM 扫描无孤儿页，非首页最少 2 入链；37 E2E 通过 | 部署后抽查 Header、Footer、breadcrumb、related links 和搜索恢复路径；生产 200 是前置条件 | Founding Engineer / UI |
| C-08 | publisher transparency | **FAIL** | **P1** | `src/app/about/page.tsx:1-3` 只说明产品目的；`src/app/editorial-policy/page.tsx:9-15` 承认无固定 review cycle 或 correction form；未发现可联系渠道、责任主体/编辑者信息或更正入口 | 增加真实且可核验的运营主体/负责人、内容如何产生与复核、联系与纠错路径；不得虚构委员会、资历、机构关联或审核流程 | Chief of Staff / Founder + Content Lead |
| C-09 | 版权、误导与商业状态 | **PASS（抽样）** | P0 | work 页使用 authoritative record + legal access guidance；`src/app/pricing/page.tsx:14-33,37-63` 明确 Pro/Scholar 尚未提供购买；`src/app/terms/page.tsx:1-3` 与 editorial policy 限定用途 | 保持不声称同 Google、大学、出版社或作者存在未授权关联；不镜像受版权保护全文；每次批量发布继续做来源/引用审计 | Content Lead |
| C-10 | canonical | **PASS（候选）/ BLOCKED（生产）** | **P0** | 88 个生成 HTML 全部存在 canonical；87 个 sitemap URL 的 canonical 路径逐项一致；`src/lib/seo.ts:60-67` | 恢复生产后检查裸域/`www`/HTTP/alternate host 的 301 与 Google-selected canonical。canonical 不是 draft 访问控制 | Founding Engineer；Growth 用 URL Inspection 复验 |
| C-11 | JSON-LD | **PASS（候选）/ BLOCKED（生产富结果验证）** | P1 | 运行时 DOM：JSON-LD 均可解析；80 BreadcrumbList、16 Article、7 Person、1 WebPage，首页 CollectionPage/ItemList 由 `JsonLdGraph` 输出；`src/components/seo/JsonLd.tsx:1-5` 转义 `<` | 部署后用 Rich Results Test 和 URL Inspection 验证代表页；确保 markup 与可见主内容一致。结构化数据只产生资格，不保证富结果 | Growth + Founding Engineer |
| C-12 | 移动体验与页面可用性 | **PASS（候选）/ BLOCKED（生产 field data）** | P1 | 375/768/1024/1440 E2E、axe、no-horizontal-scroll 均通过；87 URL 在 375px DOM 扫描无横向溢出 | 生产恢复后补 PageSpeed/CrUX/Search Console CWV；不要用实验广告结果替代任务成功、可读性和成本 guardrail | UI + Growth |
| C-13 | AdSense 站点所有权与 Ready 状态 | **BLOCKED** | **P0** | 无 AdSense/Search Console 账户访问；仓库没有 publisher meta/tag/pub-ID | 站点恢复后，由账户 owner 选择 ad code、ads.txt、meta tag 或已验证 Search Console property 完成所有权验证；只有 Google 显示 Ready 才可投放。不要在本任务提交申请 | Chief of Staff / Founder；Growth 记录状态 |

### 3.2 接入任何广告代码前或同时必须完成

| ID | 项目 | 状态 | 优先级 | 当前证据 | 接入前成功条件 | 负责人 |
|---|---|---|---|---|---|---|
| A-01 | Privacy/Cookie/广告技术披露 | **FAIL（尚未具备）** | **P0** | `src/app/privacy/page.tsx:9-13` 明确称没有广告技术与 tracking cookies；当前无 AdSense tag，因此现状陈述真实 | 在任何 tag 加载前，披露 Google 产品导致的数据收集/共享/使用、cookie/web beacon/IP/标识符、第三方读写 cookie、广告个性化和 Google partner-sites 链接；上线后 Privacy 不得继续声称“未启用广告” | Chief of Staff / Founder 定口径；Founding Engineer 实现 |
| A-02 | 地区同意与 CMP | **BLOCKED** | **P0** | 无地区流量、广告模式或 CMP 配置；无 consent UI/code | 若向 EEA/英国/瑞士提供个性化广告，先使用 Google-certified、IAB TCF v2.3 CMP；验证拒绝、同意、管理选项、撤回入口和信号。若不做个性化，仍按 Google EU policy 与适用法律确认披露/同意路径 | Chief of Staff / Founder 决策；Founding Engineer；必要时法律审查 |
| A-03 | 广告位干扰、误点与内容密度 | **BLOCKED** | **P0** | `src/components/common/AdSlot.tsx:1-16` 默认 `enabled=false`，未发现调用或 Google tag；候选当前无广告干扰 | 仅对高价值内容页建立 allowlist；排除 draft、404、错误/数据不可用、搜索空结果、`/framework-builder`、导航/法律/低内容屏。移动端验证不覆盖导航/交互、不把内容推出首屏、广告不多于 publisher content、标识清晰 | Growth 定义 allowlist/guardrails；Founding Engineer + UI 实现 |
| A-04 | tag 范围与同意前网络请求 | **BLOCKED** | **P0** | 无 AdSense 实装 | 若 tag 全站加载，其 cookie/请求义务会扩展到全站，即使广告未显示。复验拒绝同意前不发生不允许的请求，并保留 consent evidence | Founding Engineer |
| A-05 | ads.txt | **BLOCKED（强烈建议，非强制）** | P1 | 仓库无 `public/ads.txt`，生产 URL 不可达；无真实 publisher ID | 获取真实 `pub-…` 后在根目录发布 Google 给出的精确行，HTTP 200、纯文本、可抓取，AdSense 显示 Authorized。若暂不发布，记录为已接受风险；不得使用占位 pub-ID | AdSense account owner + Founding Engineer |
| A-06 | 广告上线后的 guardrail | **BLOCKED** | P1 | 尚无广告、收入、留存或成本基线 | 最小事件：page/ad eligible、ad request、consent outcome（聚合且无不必要 PII）、task start、successful result、second use；分段到设备/地区/页面类型。成功必须同时满足任务成功、二次使用、页面体验和贡献毛利不恶化；样本不足不 Scale | Growth；CTO/Founding Engineer 提供事件 |

### 3.3 建议优化

| ID | 建议 | 优先级 | 成功条件 | 负责人 |
|---|---|---|---|---|
| R-01 | 发布者与作者可归责信息 | P1 | About/Editorial/文章页形成“Who / How / Why”闭环，信息真实、可联系、可纠错 | Content Lead + Chief of Staff |
| R-02 | 首批广告页面限制 | P1 | 初期只选择 5–10 个高实质价值 theory/topic 页面；work/concept/index/search 暂不投放，直到页面级价值与密度复验通过 | Growth |
| R-03 | Search Console 基线 | P1 | 记录过去 28 天与过去 3 个月的 indexed/not indexed、clicks、impressions、CTR、position，按 host/目录/设备分段；无样本时只报未知，不报“SEO 上涨” | Growth |
| R-04 | 结构化数据生产验证 | P1 | 首页、1 个 theory、1 个 topic、1 个 scholar 在 Rich Results Test/URL Inspection 无错误；记录 Google 是否实际识别 | Growth |
| R-05 | programmatic quality guardrail | P1 | 新页面必须有独特研究任务、真实来源、清晰边界和至少一个上下文入链；不得以页面数或模板填充为成功指标 | Content + Growth |

## 4. 最小修复包

### 4.1 当前 P0 包（申请前）

1. **恢复生产可达性。** 修复 Cloudflare/origin/DNS/部署，核心 URL 连续两轮从外部返回预期 200；HTTP、`www` 和已知 alternate host 统一 301 到 `https://syrtag.com`。
2. **部署并复验候选 SEO 资产。** `/robots.txt`、`/sitemap.xml`、87 个 sitemap URL、canonical、draft 404/不可发现边界全部在生产复验通过。
3. **完成账户侧所有权事实确认。** exact domain 与 Search Console/AdSense site 一致；记录 verification method、site status 和 ads.txt status。站点不是 Ready 时不提交广告发布。

停止条件：任何核心 URL 非 200/预期 301、robots 或 sitemap 不可达、canonical host 分裂、draft 暴露、Google/AdSense crawler 被阻挡，即停止申请流程并回滚到修复。

### 4.2 广告代码接入 P0 包

1. 在任何 AdSense tag 加载前更新 Privacy/Cookie/Google data-use 披露。
2. Chief of Staff/Founder 明确地区与个性化策略；需要时先完成 Google-certified CMP + TCF v2.3。
3. 建立广告 allowlist 和明确的 no-ad 页面；实现后用 375/768/1024/1440 复验内容遮挡、误点、首屏占用、广告/内容比例和 consent 前请求。
4. 真实 publisher ID 可用后发布并核验 `ads.txt`（推荐，不把它错误描述为普遍强制）。

停止条件：Privacy 与实际 tag 不一致、CMP/地区策略未决定、拒绝同意后仍发生不允许的广告请求、广告遮挡交互或出现在低价值/错误/draft 页面，立即停止广告加载。

### 4.3 P1 包

1. 补齐 publisher identity、内容责任、联系与纠错路径。
2. 首批只对高价值 theory/topic 页面开放广告；以任务成功、二次使用、页面体验和贡献毛利为 guardrail。
3. 建立 28 天/3 个月 Search Console 基线与 URL Inspection/Rich Results 复验记录。

## 5. 复验命令与检查

以下命令不提交申请、不修改生产数据。生产命令应从两个独立网络位置各执行两轮。

```bash
curl -fsSIL --max-time 20 https://syrtag.com/
curl -fsSIL --max-time 20 https://www.syrtag.com/
curl -fsSL --max-time 20 https://syrtag.com/robots.txt
curl -fsSL --max-time 20 https://syrtag.com/sitemap.xml
curl -fsSIL --max-time 20 https://syrtag.com/privacy
curl -fsSIL --max-time 20 https://syrtag.com/editorial-policy
curl -fsSL --max-time 20 https://syrtag.com/ads.txt
```

候选快照验证：

```bash
npm run content:check
node --experimental-strip-types --test tests/seo.test.ts tests/publication-boundary.test.ts tests/information-architecture.test.ts tests/ui-responsive-contract.test.ts tests/theory-static-ui.test.ts tests/entity-route-status.test.ts
npm run build
PLAYWRIGHT_PORT=3107 npm run test:e2e
rg -n 'adsbygoogle|googlesyndication|ca-pub-|google-adsense-account|Consent|cookie' src public
```

生产恢复后还需在 Google 官方工具中完成：

- Search Console：property ownership、Sitemaps、Page indexing、URL Inspection、Core Web Vitals。
- Rich Results Test：home/theory/topic/scholar 代表页。
- AdSense Sites：ownership method、site status、ads.txt status；仅记录 Google 返回的事实，不预测审核结果。

## 6. 官方依据登记

全部来源核验日期均为 **2026-08-14**。

### AdSense / Publisher Policies

1. [Make sure your site's pages are ready for AdSense](https://support.google.com/adsense/answer/7299563?hl=en) — unique/original/relevant content、UX、导航、外部资源增值与版权边界。
2. [Eligibility requirements for AdSense](https://support.google.com/adsense/answer/9724?hl=en) — 高质量原创内容、政策合规与资格。
3. [What to do when your site is not ready to show ads](https://support.google.com/adsense/answer/12176698?hl=en) — live/reachable、crawler、SSL、内容/UX/导航与审核流程。
4. [AdSense site management](https://support.google.com/adsense/answer/12131223?hl=en) — ownership verification、site review 与 Ready 状态。
5. [Owning the site you want to use to participate in AdSense](https://support.google.com/adsense/answer/91205?hl=en) — HTML 控制权与 tag 放置能力。
6. [Google Publisher Policies](https://support.google.com/publisherpolicies/answer/10502938?hl=en) — 内容、行为、隐私与 inventory value 总则。
7. [Intellectual property abuse](https://support.google.com/publisherpolicies/answer/10402772) — 版权侵权。
8. [Misleading representation](https://support.google.com/publisherpolicies/answer/11185754) — 发布者、作者、目的、关联与身份不得误述或隐瞒。
9. [Google-served ads on screens without publisher-content](https://support.google.com/publisherpolicies/answer/11112688?hl=en) — 无/低价值、under construction、导航/提示屏。
10. [Ads interfering](https://support.google.com/publisherpolicies/answer/11035030?hl=en) — 遮挡、邻近交互、推出屏幕与 dead-end。
11. [Ad placement policies](https://support.google.com/adsense/answer/1346295?hl=en) — 误点、仿导航/下载、弹窗与布局。
12. [Privacy disclosures](https://support.google.com/publisherpolicies/answer/10437794?hl=en) 与 [Required content](https://support.google.com/adsense/answer/1348695?hl=en) — 数据、cookie、第三方广告技术与 opt-out 披露。
13. [How AdSense uses cookies](https://support.google.com/adsense/answer/7549925?hl=en) — tag 即可能触发请求/cookie；privacy policy 要求。
14. [Ads.txt guide](https://support.google.com/adsense/answer/12171612?hl=en) 与 [Ensure your ads.txt files can be crawled](https://support.google.com/adsense/answer/7679060?hl=en) — 非强制但强烈建议、正确 pub-ID、根路径与 HTTP 200。
15. [Google consent management requirements for publishers](https://support.google.com/adsense/answer/13554116?hl=en) — EEA/英国/瑞士个性化广告的 Google-certified CMP 要求。
16. [Publisher integration with the IAB Europe TCF](https://support.google.com/adsense/answer/9804260?hl=en) — TCF v2.3 时间线与 tag 信号。
17. [EU user consent policy](https://www.google.com/about/company/user-consent-policy/) 与 [implementation help](https://www.google.com/about/company/user-consent-policy-help/) — 披露、同意、撤回与实现核查。
18. [How Google uses information from sites or apps that use our services](https://policies.google.com/technologies/partner-sites) — Privacy 中应提供的 Google partner-sites 说明目标。

### Google Search

19. [Google Search technical requirements](https://developers.google.com/search/docs/essentials/technical) — Googlebot access、HTTP 200 与 indexable content。
20. [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) — absolute canonical URLs、提交只是 hint。
21. [Introduction to robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro) 与 [Block indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing) — robots 不是可靠移除工具；draft 用鉴权/noindex/移除。
22. [Specify a canonical URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) — redirect/canonical/sitemap 信号与一致内链。
23. [Introduction to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) 与 [General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) — JSON-LD、准确性、验证与非保证边界。
24. [Link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) — crawlable anchors、上下文内链、重要页至少一个入链。
25. [Mobile-first indexing best practices](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing) — 移动内容/metadata/structured data 等价与广告首屏风险。
26. [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) — 原创/实质价值、来源、作者/站点背景与 Who/How/Why。
27. [Spam policies for Google web search](https://developers.google.com/search/docs/essentials/spam-policies) — scaled low-value/unoriginal content 与 abusive scraping。

## 7. 下一责任人与决策闸门

- **CTO / Founding Engineer：** 先修复 C-01/C-02，并提供生产 200/301/SSL/robots/sitemap/canonical 的可复现实证。
- **Growth, SEO & Data Lead：** 生产恢复后执行全量复验，补 Search Console/AdSense account facts；不把相关性、单次抓取或流量单指标当成增量证据。
- **Chief of Staff / Founder：** 决定申请时点、exact domain、地区/个性化/CMP 路径和是否接受暂缓 ads.txt；这是外部发布与合规边界，需明确批准。
- **Content Lead：** 完成 publisher transparency P1，并在首批广告 allowlist 前确认高价值页面与版权/来源边界。

只有当前 P0 和接入广告代码 P0 都由上述责任人提供可复现实证后，才建议把“是否提交 AdSense 审核”交 Chief of Staff/Founder 决策。
