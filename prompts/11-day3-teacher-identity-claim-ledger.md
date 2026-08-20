# Day 3 执行提示词：补全 Teacher Identity Theory Claim Ledger

> 日期：2026-08-05
> 状态：待执行
> 对应计划：`docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md` Day 3
> 工作目录：`/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag`

请只执行 Day 3，不提前执行 Day 4–7。

## 一、目标

只补全当前公开 Teacher Identity Theory D3 页面全部页面定义性主张的 claim ledger。

唯一仓库写入目标：

```text
docs/research/claim-audit/teacher-identity-theory.md
```

最强允许结论只能是：

```text
ready_for_human_review
```

不得自行审核，不得改 corpus，不得把 Life Course 的措辞机械复制到 Teacher Identity。

## 二、必须读取

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/roadmaps/2026-08-02-seven-day-content-governance-plan.md`
4. `docs/standards/content-writing-standard.md`
5. `docs/standards/content-update-standard.md`
6. `docs/decisions/ADR-027-evidence-status-and-content-nature.md`
7. `docs/research/claim-audit/life-course-theory.md`
8. `docs/research/claim-audit/teacher-identity-theory.md`
9. `docs/research/2026-07-13-teacher-identity-theory-c2.md`
10. `src/data/corpus/shared/entities.ts`
11. `src/data/templates/theory-template.ts`
12. `src/data/templates/evidence-template.ts`
13. `src/app/theories/[slug]/page.tsx`
14. `src/components/content/TheoryArticle.tsx`
15. `src/lib/theory-presentation.ts`
16. Day 2 交接结果

## 三、前置门禁

先运行：

```bash
git status --short --branch
git rev-parse HEAD
git diff --name-status
git diff --cached --name-status
git rev-list --left-right --count origin/main...HEAD
git diff -- src prisma tests package.json package-lock.json | shasum -a 256
```

只有满足以下条件才能继续：

- Day 2 的 Life Course ledger 已覆盖其当前全部公开 section；
- Life Course ledger 只作为字段结构范例，不作为 Teacher Identity 的内容依据；
- Teacher Identity corpus、渲染结构和注册来源可以明确定位；
- 目标文件没有无法区分所有权的新修改。

若 Life Course ledger 仍只有原始三行占位内容，停止并报告 Day 2 未完成。

## 四、多 Agent 分工

主 Agent 必须启动三个只读子 Agent，子 Agent 不得写文件。

### 子 Agent A：Corpus 与页面 inventory

逐字段枚举：

- 当前公开 section；
- 定义、理论 framing、署名、机制、情境变化、限制、关系和研究指导；
- 精确 `fieldPath`；
- 需要拆分的复合主张。

### 子 Agent B：Evidence audit

核对：

- source identity 与版本；
- substantive support 与书目 support 的边界；
- locator；
- 实际来源核验日期；
- 学术分歧、理论多样性与事实不确定性的区别。

### 子 Agent C：Coverage 与合同检查

检查：

- 每个公开 section 是否有对应行；
- claim ID 是否稳定且唯一；
- 三类 content nature 是否分离；
- evidence status 与 review readiness 是否分离；
- 是否误把多视角研究领域写成单一封闭理论；
- 是否存在未经支持的 founder 或固定归属表述。

### 主 Agent

唯一写入 `teacher-identity-theory.md`，负责合并、去重和记录冲突。

## 五、文件范围

### 允许写入

```text
docs/research/claim-audit/teacher-identity-theory.md
/Users/fanlw/Documents/Website-Content-Hub/20-16-博士知识图谱网站建设/30-待审核/网站更新记录/2026-08-05-teacher-identity-theory-claim-ledger.md
```

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
```

并禁止：

- 修改 Life Course ledger；
- 修改正文、来源、关系、状态、路由或公开输出；
- 新增 corpus entity 或 genealogy；
- 虚构来源、locator、页码、审核者或决定；
- 用 `verifiedAt` 代替 review date；
- 运行 DB、build、E2E；
- commit、push、PR、deploy。

## 六、Ledger 字段合同

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

值域：

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

没有真实人工决定时，review decision 保持 `pending_review`，其余 reviewer 字段保持空白。

## 七、执行步骤

1. 保存 Git 基线与 denied-path 哈希。
2. 等待三个子 Agent 完成只读报告。
3. 按真实页面 section 建立 inventory。
4. 对不同来源、content nature 或审核决定的复合主张拆行。
5. 保留三个已有稳定 claim ID；新增 ID 不依赖排序。
6. 精确填写 `fieldPath`。
7. 区分：

   - 多视角研究领域的事实性描述；
   - Syrtag 的编辑综合；
   - 条件式研究建议。

8. 为实质性事实核对 primary/authoritative source 和 locator。
9. 记录实际 `verifiedAt`；无法访问时写 blocker。
10. 对学术分歧使用 bounded wording，不把未达共识误写成事实错误。
11. reviewer 和 review decision 不得由 Agent 填写。
12. 在文件末尾记录：

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

13. 更新外部审核记录，保持 review/pending/not_started。
14. 复算 denied-path 哈希。

## 八、验证

```bash
git diff --check -- docs/research/claim-audit/teacher-identity-theory.md
git diff -- docs/research/claim-audit/teacher-identity-theory.md
git diff --name-status
git diff -- src prisma tests package.json package-lock.json | shasum -a 256
```

开始和结束的 denied-path 哈希必须一致。

## 九、验收标准

- [ ] 每个公开 section 至少一行。
- [ ] 定义、起源、理论传统、署名、机制、变化、限制、关系和研究指导均有覆盖。
- [ ] 复合主张已按证据或决定拆分。
- [ ] 每行有稳定 ID 和精确 `fieldPath`。
- [ ] 三类 content nature 清楚分离。
- [ ] evidence status 与 review readiness 没有混用。
- [ ] 来源和 locator 可以复现，或存在明确 blocker。
- [ ] 未产生 founder、唯一理论或固定身份等过度归属。
- [ ] reviewer 字段未被推断。
- [ ] corpus、代码、测试、数据库没有变化。

## 十、停止条件

出现任一情况时，保留真实 blocked 状态后停止：

- Day 2 未完成；
- 来源不可访问或 locator 不可复现；
- source/corpus/page 之间存在无法消解的冲突；
- 页面 section 无法映射到字段；
- 需要修改 corpus 才能继续；
- 需要人类决定 wording、content nature 或审核结论；
- 基线发生变化或出现 allowlist 外写入。

## 十一、交接输出

报告：

- ledger 行数和 section coverage；
- source/locator 覆盖率及分母；
- 三类 content nature 数量；
- ready/partial/blocked claim IDs；
- 学术分歧和需人审问题；
- 外部审核记录；
- 明确声明未修改 corpus、页面、DB、commit 或 deployment。

不要自动开始 Day 4。
