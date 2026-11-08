# W3 执行提示词：旗舰 published 后的公开文案与测试对齐

> 日期：2026-11-08  
> 状态：待执行，前置 W2 已产生 published 实体  
> 对应计划：`docs/roadmaps/2026-11-08-content-optimization-and-next-phase.md`

请只执行 W3。没有 W2 的真实 published slug，本窗口停止。

## 一、目标

让首页、About、索引空/非空态、Pricing、SEO、sitemap 测试与 **实际 published 计数** 一致。禁止两头说谎：既不能继续写「一个实体都没有」，也不能写回「12 个理论已公开」。

## 二、必须读取

1. `AGENTS.md`、`CLAUDE.md`、总规划、W2 交接
2. `src/app/page.tsx`、`src/app/about/page.tsx`、`src/app/pricing/page.tsx`
3. `src/components/content/SiteReadingGuide.tsx`、`EntityIndexPage.tsx`
4. `src/lib/seo.ts` 与相关测试
5. `tests/public-claim-consistency.test.ts`（若存在）、`tests/seo.test.ts`、`tests/build-output-smoke.test.ts`
6. `docs/research/2026-11-08-public-claim-consistency-audit.md`（若存在）

## 三、启动门禁

从 seed 计算：

```text
publishedCount = disciplines+fields+theories+scholars+works+topics+concepts 中 status===published 的数量
```

`publishedCount` 必须等于 W2 交接（3 或 4，或主人另批的 allowlist）。若为 0，停止（应走空目录叙事，不在本窗口改成「已有旗舰」）。

## 四、文案合同

对每一处公开句子检查：

| 状态 | 允许说法 |
| --- | --- |
| published = 0 | 目录为空；draft/archived 不展示 |
| published = N（N 为 3 或 4） | 当前仅有 N 个已发布实体；其余仍在审核/归档；不是全科目录 |
| 永远禁止 | 「即将投放广告」；未填的运营者身份；把 archived 当 published；把图谱写成已有完整谱系 |

About Advertising、Privacy、Terms 保持广告关闭。不要申请 AdSense。

索引页：有 published 时列出它们；无则保留现有空态。不要为凑网格而展示 archived。

## 五、测试与浏览器

更新断言「published 0 / 无 `/theories/life-course-theory` 预渲染」的测试，使其匹配 W2。

```bash
npm test
npm run typecheck
npm run lint
```

有新鲜生产 build 时：

```bash
PLAYWRIGHT_PORT=3101 npm run test:e2e
```

至少手工或浏览器工具走：`/`、`/about`、`/theories`、已发布详情页、一个仍 404 的 archived slug。

## 六、禁止

- 解档更多实体来让页面「看起来满」；
- 改图谱引擎；
- 填写 `TODO_OWNER_*` 真实身份（除非主人在本窗口提供字面值）。

## 七、交接

公开 N、改动的文案路径、仍为空的表面、E2E 是否跑过。下一内容包是 W4/W5（收窄）或等待主人，而不是扩科。
