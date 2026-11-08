# Site audit and P0/P1 public-page fixes

> 日期：2026-11-07
> 状态：已完成
> 阶段：P6
> 负责人：Cloud agent
> 关联：`docs/SITE_AUDIT_2026-11-07.md`；PR #13 `cursor/ads-off-trust-pages-4ca5`；FAN-247；SEO/AEO priorities stated for this task

## 1. 目标与用户价值

- A reader who opens the public pages can tell that Syrtag is an education and sociology navigation site, that the entity catalog can be empty, and that advertising is off.
- Titles and descriptions match that page instead of a repeated keyword sentence.
- Search, empty home, and error states offer routes that exist.

## 2. 范围

### 包含

- Audit inventory at `docs/SITE_AUDIT_2026-11-07.md`.
- Reusable skills for UI conventions, public-content updates, and SEO/AEO.
- In-repo P1 fixes: description helper, Home and About narrative, catalog navigation, empty-state search, recovery links, pricing honesty, index descriptions, and touch-target height.

### 不包含

- Repairing HTTP 521 or deploying.
- Merging to `main`.
- Publishing, un-archiving, or inventing scholarly pages.
- Filling operator identity, contact, or source slots.
- Enabling ads or claiming an advertising application is ready.
- Education or sociology deep topics beyond an unpublished template.

## 3. 当前证据与决策

- 现象/复现路径：`createSeoDescription` appended a keyword sentence to every description. Empty home had no search. Search recovery linked to `/#graph`. Header omitted disciplines and fields and collapsed only at 768px. About rendered `TODO_OWNER_*` tokens. Pricing claimed every entity page was available. Corpus count on this branch: published 0, draft 7, archived 74. Live `https://syrtag.com` and `www` returned HTTP 521 during this audit.
- 根因或待确认假设：SEO helper optimized for a 150-character floor by adding generic phrases. Navigation and recovery copy were written when a graph was assumed to be on the homepage.
- 需要用户确认的决策：Whether any archived record may be reviewed again. What legal name and contact channel are real. Neither is decided here.
- 不能假设的事实或外部依赖：Production database contents, Search Console numbers, and origin uptime. The SEO brief file was not in the workspace; the stated priorities were used.

## 4. 实施步骤

1. Branch from PR #13 head so ads-off disclosure stays. — 文件：git — 产物：`cursor/site-audit-p0-p1-a15a`
2. Write the audit from code, corpus counts, and a live curl. — 文件：`docs/SITE_AUDIT_2026-11-07.md`
3. Add skills. — 文件：`.cursor/skills/*/SKILL.md`
4. Change public copy, SEO helper, header, and layout CSS. — 文件：`src/lib/seo.ts`, `src/app/**`, `src/components/**`, `src/app/styles/**`
5. Extend the unpublished flagship stub with a deep-topic template. — 文件：`docs/content/2026-11-07-flagship-source-stubs.md`
6. Update the tests that locked the old keyword suffix, graph hash, and owner tokens.

## 5. 数据、内容与安全

- 数据来源与核验等级：UI and disclosure copy is editorial description of the site's own rules, not a new academic claim. Corpus counts were computed from `seedCorpus` in this worktree.
- 数据迁移/seed 影响：无
- 环境变量/权限需求：无新变量
- 隐私、版权或法律影响：Advertising stays off. No new personal data collection. No invented operator identity.

## 6. 验收标准

- 自动化：`npm test` and `npm run build` succeed.
- 浏览器：生产构建下打开 `/`, `/about`, `/search`, `/theories`, `/pricing`，确认空或不可用状态有搜索或回退链接，且页面无 ads meta。375px 下主导航走菜单。
- 数据：seed 实体 `published` 计数仍为 0。
- 链接/SEO：首页 description 不超过 160 字符，且不含 “Explore this”。

## 7. 风险、回退与发布判定

- P0/P1 风险：P0-1 (521) and P0-2 (no published entities) remain. This PR must not be described as clearing them.
- 回退方式：revert this branch. No migration.
- 发布结论条件：暂不可当作生产已更新。合并与部署需另行决定。不声明可申请广告。

## 8. 执行记录（实施后填写）

- 实际改动：见审计文档 “What this round changed”。状态改为已完成（仓内）。未合并、未部署。
- 验证结果：`npm test` 166 项中 163 通过、0 失败、3 项既有 skip。`npm run lint` 0 error，3 个既有 warning 在 `scripts/generate-fan121-work-concept-pack.mjs`。`npm run build` 通过，静态页 23，实体 slug 未生成（published 0），构建后 smoke 2/2。Chromium smoke + axe `tests/e2e/smoke-a11y.spec.ts` 20/20，视口 375 / 768 / 1024 / 1440。无数据库，所以首页与检索走不可用/空目录状态，而不是 seed 后的空目录。
- 未完成项与原因：521、运营者身份、有来源的 published 页。
- 下一步：运营者处理源站；人审后再谈旗舰页。
