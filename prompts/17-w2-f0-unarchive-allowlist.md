# W2 执行提示词：F0 allowlist 解档（仅四 slug）

> 日期：2026-11-08  
> 状态：待执行，**硬前置 W1 主人 U3 授权**  
> 对应计划：`docs/roadmaps/2026-11-08-content-optimization-and-next-phase.md`

请只执行 W2。没有 W1 交接里的书面 `publication_authorization`，本窗口立即停止。

## 一、目标

把已人审的 F0 slug 从 FAN-247 归档名单移除，使 seed 将其写为 `published`。默认 allowlist：

```text
theory  life-course-theory
work    elder-1998-life-course
scholar glen-h-elder-jr
topic   educational-transitions-over-time
```

若 W1 明确排除 topic：本窗口只解档前三项。

不解档 discipline、field、其他理论、U3 概念、谱系边。

## 二、必须读取

1. `AGENTS.md`、`CLAUDE.md`
2. 总规划与 W1 交接
3. `docs/standards/content-update-standard.md` §7.3 状态变更
4. `src/lib/fan247-visibility.ts`
5. `src/lib/u3-visibility.ts`
6. `src/lib/content-validation.ts`（published 耦合：genealogy、pathway entry、topic risk）
7. `tests/fan247-visibility.test.ts`、`tests/seed-integration.test.ts`、`tests/build-output-smoke.test.ts`、`tests/e2e/smoke-a11y.spec.ts`

## 三、启动门禁

W1 交接必须同时满足：

```text
human_review_complete
publication_authorization: granted
owner 署名与真实日期存在
拟解档 slug 的拟公开措辞无 blocker-only 残留
```

Topic 若解档，还必须有 methods 角色的 `AcceptedTopicTheoryRiskReview`，且 `approvedWordingEn === riskNotesEn`。

缺失任一项：停止，不「先解档再补审」。

## 四、实施

1. 从 `FAN_247_ARCHIVED_*` 移除授权 slug。  
2. 重算 `FAN_247_ARCHIVED_PAGE_COUNT`（原 58 减去实际移出数）。  
3. 更新锁定 58 页 / published 0 的测试；改为断言新的精确计数。  
4. 若 topic 仍 archived：其 entry_points 不得指向未 published 的 concept（U3 的 `transition` 等仍 archived）。  
5. **不要**向 `PUBLIC_GENEALOGY_RELATION_IDS` 加边，除非 W1 另有关系级授权（默认不加）。  
6. 不要解档 `education` / `sociology`。  
7. 不要 deploy，除非主人在本窗口另写授权。

理论页 `genealogy` 指向 `teacher-life-history-research`：若该理论仍 archived，`content-validation` 会在 published 理论引用 unpublished 谱系目标时报错。处理方式只允许：

- 从已解档理论的 `content.en.genealogy` 暂时去掉指向未解档理论的条目；或
- 把该关系保留在内部 `seedCorpus.genealogy` 但确认校验规则与页面呈现不会暴露未发布目标。

禁止为了让校验通过而解档第二个理论。

## 五、验证

```bash
npm run content:check
npm run typecheck
npm test
npm run lint
```

若有 DATABASE_URL：`npm run db:migrate` 后连续两次 `npm run db:seed`，再跑 `tests/seed-integration.test.ts`。

断言：

- published 计数 = 本窗口解档数（3 或 4）；
- sitemap / `generateStaticParams` 只含这些 slug；
- 其余 FAN-247 仍 archived；
- 首页在 W3 完成前可能仍写「目录为空」——若测试因此失败，把文案切换留给 W3，但不得为了绿测试去解档更多实体。

## 六、禁止

- 代填人审；
- 解档 58 页或整科；
- 开启 `AdSlot`、恢复 `ads.txt`；
- 引入图谱库。

## 七、交接给 W3

列出实际 published slug、FAN-247 新计数、未解档的 F0 项、已知公开文案不一致（空目录叙事 vs 已有实体）。
