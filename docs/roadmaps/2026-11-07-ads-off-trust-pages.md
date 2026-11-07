# Ads-off trust pages and publication boundary

> 日期：2026-11-07
> 状态：已完成
> 阶段：P6
> 负责人：Cloud agent
> 关联：AdSense readiness notes supplied for this change; FAN-111; FAN-247; `AGENTS.md`

## 1. 目标与用户价值

- A reader, and a later reviewer, can tell what Syrtag is from the README and the public trust pages while advertising stays off.
- The public site no longer publishes AdSense ownership signals that contradict the privacy page.
- Empty indexes explain the publication boundary instead of looking like a broken shell. Scholarly entity pages stay unpublished until sourced.

## 2. 范围

### 包含

- Replace the create-next-app README with a product README.
- Remove `public/ads.txt` and the `google-adsense-account` meta tag. Keep `AdSlot` default off.
- State that boundary on Privacy, About, Terms, and the homepage reading guide.
- Add unpublished `TODO_OWNER_*` identity and contact slots. Add `TODO_SOURCE` flagship stubs outside the seed corpus.
- Light reading typography for static prose and catalog-empty indexes.

### 不包含

- Submitting an AdSense application.
- Enabling ads, loading an advertising script, or writing a publisher ID back into the site.
- Deploying, or repairing the production origin.
- Publishing, un-archiving, or bulk-generating scholarly entities.
- Inventing a legal name, committee, email address, DOI, or academic claim.

## 3. 当前证据与决策

- 现象/复现路径：Privacy says advertising technology is not enabled, while `layout.tsx` emitted `google-adsense-account` and `public/ads.txt` named a publisher ID. About stated that no operator is identified. FAN-247 leaves the authored corpus with no `published` entities. The root README was the create-next-app scaffold.
- 根因或待确认假设：Ownership signals were added before any ad tag and before a matching privacy disclosure. The safer consistent state is ads off with those signals removed, not a privacy page that describes future ads as if a verification program were already underway.
- 需要用户确认的决策：Fill `TODO_OWNER_*` only with a real identity and a monitored channel. Fill `TODO_SOURCE` only after source checks. Decide separately whether any archived page may be reviewed again. Do not treat that decision as made here.
- 不能假设的事实或外部依赖：Production reachability is not verified by this change. The live origin is an operator problem. No publisher account was confirmed in this repository.

## 4. 实施步骤

1. Replace README — file: `README.md` — product description, local run, `AGENTS.md` link, ads-off limit.
2. Remove ownership signals — files: `src/app/layout.tsx`, `public/ads.txt` — no meta tag, no ads.txt.
3. Align trust copy — files: `src/app/privacy/page.tsx`, `src/app/about/page.tsx`, `src/app/terms/page.tsx`, `src/app/corrections/page.tsx`, `src/app/editorial-policy/page.tsx`.
4. Explain empty public surfaces — files: `src/app/page.tsx`, `src/components/content/SiteReadingGuide.tsx`, `src/components/content/EntityIndexPage.tsx`.
5. Record source gaps — file: `docs/content/2026-11-07-flagship-source-stubs.md`.
6. Lock the boundary with tests — files: `tests/ads-off-disclosure.test.ts`, `tests/publisher-transparency.test.ts`, `tests/build-output-smoke.test.ts`.

## 5. 数据、内容与安全

- 数据来源与核验等级：Trust-page prose describes site behavior and publication rules. It does not add academic claims. Flagship stubs are `TODO_SOURCE` with no URLs.
- 数据迁移/seed 影响：无。Seed publication status is unchanged.
- 环境变量/权限需求：无。
- 隐私、版权或法律影响：Privacy now matches the ads-off code. No new personal data collection. No copyrighted excerpts.

## 6. 验收标准

- 自动化：`npm test`, `npm run content:check`, `npm run lint`, `npm run typecheck`. Build smoke asserts the homepage HTML has no AdSense meta tag and that `public/ads.txt` is absent.
- 浏览器：Home, about, privacy, corrections, and an empty index render readable English prose. No ad slot, mailto, or form.
- 数据：Authored corpus still has zero `published` entities.
- 链接/SEO：No new public route. Sitemap static page count stays 14.

## 7. 风险、回退与发布判定

- P0/P1 风险：Removing `ads.txt` and the meta tag withdraws a previously published ownership signal. That is intentional while ads are off. Reintroducing either without a privacy update would make the disclosure false again.
- 回退方式：Revert this change. Do not restore the publisher ID unless Privacy is updated in the same change.
- 发布结论条件：This change is not a production deploy and not an AdSense application. Residual blockers remain: origin reachability, operator identity fill-in, and sourced flagship pages.

## 8. 执行记录（实施后填写）

- 实际改动：README、Privacy/About/Terms/Corrections/Editorial、首页阅读说明、索引导语、导航中的 About、阅读样式。删除 `public/ads.txt` 与 layout 中的 `google-adsense-account`。`AdSlot` 仍默认关闭。旗舰学术页只写在 `docs/content/2026-11-07-flagship-source-stubs.md`，未进入 seed。
- 验证结果：`npm test` 166 项中 163 通过、0 失败、3 项既有 skip。`npm run content:check` 通过（2 disciplines and 12 theories）。`npm run lint` 0 error，3 个既有 warning 在 `scripts/generate-fan121-work-concept-pack.mjs`。`npx next typegen && npm run typecheck` 通过。未生成 `.next/types` 时，`tsc` 会因全局 `PageProps` 缺失而失败，这是既有 Next 类型生成前提，不是本变更引入。`npm run build` 通过，构建后 smoke 2/2，首页 HTML 无 AdSense meta，`ads.txt` 不存在。无数据库时用系统 Chrome 打开生产构建：首页为 “Data temporarily unavailable” 并显示 “How to read Syrtag”；About 含未填写的 `TODO_OWNER_LEGAL_NAME`；页脚进入 Corrections，无 form/mailto；Privacy 声明未启用广告且页面上没有 `google-adsense-account` meta 标签；移动宽度 375 可打开 About 导航。空索引文案在组件中，本环境没有 Postgres，所以 `/theories` 显示的是数据库不可用状态，而不是 seed 之后的空目录。
- 未完成项与原因：未发布学术实体页，因为没有可核验来源，且 FAN-247 归档未解除。生产源站不在本变更范围内。本环境没有 `/Users/fanlw/Documents/Website-Content-Hub/`，因此没有写入 Obsidian 审核记录。
- 下一步：操作者填写身份槽位，并按写作标准完成旗舰页来源后再考虑公开实体。不要在此之前申请 AdSense 或打开广告。
