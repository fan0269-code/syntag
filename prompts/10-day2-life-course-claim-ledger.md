# Day 2 执行提示词：补全 Life Course Theory Claim Ledger

> 日期：2026-08-04
> 状态：待执行
> 对应计划：`docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md` Day 2
> 工作目录：`/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag`

请只执行 Day 2，不提前执行 Day 3–7。

## 一、目标

只补全当前公开 Life Course Theory D3 页面全部页面定义性主张的 claim ledger，使每条主张可以独立复核。

唯一仓库写入目标：

```text
docs/research/claim-audit/life-course-theory.md
```

最强允许结论只能是：

```text
ready_for_human_review
```

不得写成 `reviewed`、`approved`、`implementation_authorized`、`publish-ready` 或 `published`。

本窗口不改 corpus、正文、页面、数据库、测试或公开状态。

## 二、开始前必须读取

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md`
4. `docs/standards/content-writing-standard.md`
5. `docs/standards/content-update-standard.md`
6. `docs/decisions/ADR-027-evidence-status-and-content-nature.md`
7. `docs/research/claim-audit/life-course-theory.md`
8. `docs/research/2026-07-13-life-course-theory-c2.md`
9. `docs/research/2026-07-20-life-course-evidence-r0.md`
10. `docs/research/2026-07-20-life-course-evidence-r2.md`
11. `docs/research/2026-07-20-life-course-r2-sources.md`
12. `src/data/corpus/shared/entities.ts`
13. `src/data/corpus/content-batches/2026-07-21-life-course-evidence-r2.ts`
14. `src/data/templates/theory-template.ts`
15. `src/data/templates/evidence-template.ts`
16. `src/app/theories/[slug]/page.tsx`
17. `src/components/content/TheoryArticle.tsx`
18. `src/lib/theory-presentation.ts`
19. Day 1 的实际交接结果

## 三、启动门禁

先运行：

```bash
git status --short --branch
git rev-parse HEAD
git diff --name-status
git diff --cached --name-status
git rev-list --left-right --count origin/main...HEAD
git diff -- src prisma tests package.json package-lock.json | shasum -a 256
```

保存最后一条命令的哈希，结束时重新计算。

只有满足以下条件才能继续：

- Day 1 已形成可信的本地基线记录；
- Day 1 的失败或未运行项不影响 Life Course corpus、渲染结构或 source semantics；
- 目标 ledger 仍是现有 tracked 文件；
- 目标文件不存在无法区分所有权的新修改。

若 Day 1 的阻塞影响上述任一项，停止并报告，不自行修复 Day 1。

## 四、必须使用的多 Agent 分工

主 Agent 必须启动三个只读子 Agent。子 Agent 不得写文件。

### 子 Agent A：页面与 corpus 主张盘点

按照当前 corpus 字段和真实渲染顺序，输出：

- 所有公开 section；
- 每个 section 的页面定义性主张；
- 复合句拆分建议；
- 精确 `fieldPath`；
- 当前主张文本；
- 现有 claim ID 是否可保留。

### 子 Agent B：来源身份与研究包差异

核对：

- corpus source ID；
- 书目身份、版本、DOI/ISBN/URL；
- 既有 R0/R2/C2 研究包之间的冲突；
- 哪些来源只支持书目信息；
- 哪些主张缺少实质性来源。

### 子 Agent C：合法来源与 locator

只读打开合法可访问的原始或权威来源，核对：

- 可复现 locator；
- 来源真正支持的措辞范围；
- 只部分支持的部分；
- 访问限制；
- 实际核验日期。

不得把搜索摘要、DOI landing page 或书目数据库当作实质性主张 locator。

### 主 Agent

- 是唯一写入者；
- 合并、去重并解决三个报告之间的冲突；
- 不得把子 Agent 建议当成人工审核决定。

## 五、文件范围

### 允许写入

```text
docs/research/claim-audit/life-course-theory.md
/Users/fanlw/Documents/Website-Content-Hub/20-16-博士知识图谱网站建设/30-待审核/网站更新记录/2026-08-04-life-course-theory-claim-ledger.md
```

若外部记录已存在且所有权不明，停止，不覆盖。

### 禁止修改

```text
src/data/**
src/lib/**
src/app/**
src/components/**
prisma/**
tests/**
package.json
package-lock.json
.github/**
ops/**
```

并且：

- 不改正文、source registration、页面状态、关系、路由或公开输出；
- 不把研究 Markdown 直接当成 corpus；
- 不虚构页码、locator、来源访问、审核者、审核日期或审核决定；
- 不自行填写 `accept_as_worded`、`accept_with_revision` 或 `reject`；
- 不运行 DB、build、E2E；
- 不 commit、push、PR 或 deploy。

## 六、Claim Ledger 合同

保留已有稳定 claim ID。新增 ID 必须稳定、可读，不依赖行号或排序。

每行至少包含：

```text
claimId
fieldPath
current wording
proposed wording
content_nature
source IDs
source type
locator
evidence_status
review_readiness
verifiedAt
reviewer identity
reviewer role
review date
review decision
rationale or blocker
support boundary
```

字段值规则：

```text
content_nature:
  source_backed_fact
  editorial_synthesis
  research_guidance

evidence_status:
  verified
  partially_supported
  pending_review
  blocked

review_readiness:
  ready_for_human_review
  partially_supported
  blocked
```

`ready_for_human_review` 绝不能写入 `evidence_status`。

无人类逐条决定时：

```text
reviewer identity: blank
reviewer role: blank
review date: blank
review decision: pending_review
```

`verifiedAt` 只能写本窗口真实打开并核验来源的日期，不能从来源出版日期、批次日期、文件日期或旧记录推断。

## 七、执行步骤

1. 保存启动基线和 denied-path diff 哈希。
2. 等待三个子 Agent 返回。
3. 以真实公开页面 section 为准建立 section inventory。
4. 对不同来源、content nature 或审核决定的复合主张拆行。
5. 保留三个已有 claim ID，并补齐遗漏主张。
6. 为每行填写精确 `fieldPath`，数组项应能稳定定位。
7. 分别记录 evidence status 和 review readiness。
8. 为 source-backed fact 记录可复现 locator 和真实 `verifiedAt`。
9. 为 editorial synthesis 记录所综合的来源与条件边界。
10. 为 research guidance 记录适用条件、材料、伦理或方法限制。
11. 无法合法访问或定位时写明确 blocker，不猜测。
12. 在 ledger 末尾加入可复现的完整性统计：

```text
total_claims
section_coverage
source_backed_fact_count
editorial_synthesis_count
research_guidance_count
claims_with_source
claims_with_locator
ready_for_human_review_count
partially_supported_count
blocked_count
```

13. 更新外部审核记录并保持 review/pending/not_started。
14. 重新计算 denied-path 哈希并检查 Git 差异。

## 八、验证

```bash
git diff --check -- docs/research/claim-audit/life-course-theory.md
git diff -- docs/research/claim-audit/life-course-theory.md
git diff --name-status
git diff -- src prisma tests package.json package-lock.json | shasum -a 256
```

开始和结束的 denied-path 哈希必须一致。

另外进行只读统计，确认：

- claim ID 无重复；
- 每个公开 section 至少一行；
- 每个高风险事实都有 source、locator 或明确 blocker；
- reviewer 字段未被推断填写。

## 九、验收标准

- [ ] 当前公开页面全部 section 已覆盖。
- [ ] 定义、起源、署名、机制、关系、限制和研究建议均逐项建账。
- [ ] 每行有稳定 claim ID 和精确 `fieldPath`。
- [ ] content nature、evidence status、review readiness 三者分离。
- [ ] 实质性事实有可复现 locator，或被明确标为 partial/blocked。
- [ ] 书目元数据未冒充理论主张支持。
- [ ] reviewer、review date、review decision 未被 Codex 推断。
- [ ] corpus、代码、测试和数据库没有变化。
- [ ] 所有计数都有明确分母。

## 十、停止条件

出现任一情况时，写入真实 blocker 后停止：

- Day 1 基线仍不可信；
- 目标 ledger 出现无法识别所有权的修改；
- corpus wording 与渲染输出无法对应；
- 关键来源只能看到搜索摘要；
- locator 无法复现或来源实质冲突；
- 需要修改 corpus 才能继续；
- 需要人类决定 wording、content nature 或审核结论；
- 执行过程中基线发生变化。

## 十一、交接输出

最终只报告：

- ledger 总行数与 section coverage；
- source/locator 覆盖率及分母；
- 三类 content nature 数量；
- ready/partial/blocked 数量及 claim ID；
- 需要人类审核的问题；
- 外部审核记录路径；
- 明确声明未改 corpus、页面、DB、commit 或 deployment。

不要自动开始 Day 3。
