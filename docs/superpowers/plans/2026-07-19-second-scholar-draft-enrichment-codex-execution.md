# Goodson 与 Day 第二批 Scholar 草稿内容完善 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Ivor F. Goodson 与 Christopher Day 建立可追溯的人物证据包和完整但不公开的 Scholar 草稿记录，补强现有 Teacher Life History Research 与 Teacher Professional Development 内容链，同时证明两份草稿不会泄漏到任何公开入口。

**Architecture:** 保持 `src/data/seed-content.ts` 为学术内容唯一入口，新增一个独立的 2026-07-19 Scholar 批次模块，只提供两份 `draft` Scholar 和两条 raw `TheoryScholar` 关系。现有通用 published-only 查询、路由、搜索、sitemap 和图谱代码不修改；通过 corpus、数据库、build 与 E2E 回归证明 raw 内容可持久化、public 内容零增长。由于本轮没有真实人工 reviewer、approval 和 `verifiedAt`，Codex 无权把任一候选改为 `published`。

**Tech Stack:** Next.js 16 App Router、TypeScript、Node `node:test`、Prisma 7/PostgreSQL、Playwright Chromium、axe-core、Markdown evidence packs。

---

## 0. Codex 执行合同

工作目录：

```text
/Users/fanlw/1.Claude workspace/Projects/16-博士知识图谱网站建设/syntag
```

### 0.1 开始前必须阅读

- `CLAUDE.md`
- `AGENTS.md`
- `docs/SITE_CONSTRUCTION_PLAYBOOK.md`
- `docs/decisions/ADR-027-evidence-status-and-content-nature.md`
- `docs/research/2026-07-13-c6-scholars.md`
- `docs/research/2026-07-13-c4-d1-theories.md`
- `docs/research/2026-07-13-c5-works-concepts.md`
- `docs/roadmaps/2026-07-18-first-content-enrichment.md`
- `docs/superpowers/plans/2026-07-18-first-content-enrichment-codex-execution.md`
- `src/data/corpus/shared/entities.ts`
- `src/data/templates/scholar-template.ts`

### 0.2 当前预期基线

```text
Branch: feature/content-enrichment-batch-1
HEAD: 9974fe335a2c8249e90fdf31a9b27f1bd21474f3
origin/main...HEAD: 0 0
Raw Scholars: 8
Published Scholars: 7
Raw TheoryScholar: 8
Public TheoryScholar: 7
Raw Topics: 8
Published Topics: 4
Raw TopicTheory: 24
Public TopicTheory: 12
Public Genealogy: 8
```

执行前已有、且与本任务无关的工作区状态：

```text
M  .gitignore
M  .superpowers/sdd/progress.md
M  .superpowers/sdd/task-1-brief.md
M  .superpowers/sdd/task-1-report.md
?? .claude/
```

这些内容属于既有用户工作。不得修改、格式化、删除、还原、暂存或提交。

### 0.3 本轮冻结的内容决策

| Candidate | Canonical name | Slug | Corpus decision | Public behavior |
| --- | --- | --- | --- | --- |
| Goodson | Ivor F. Goodson | `ivor-f-goodson` | `DRAFT`，证据冲突时降为 `STOP` | 不进入 index、detail static route、search、sitemap、graph 或 published 内链 |
| Day | Christopher Day | `christopher-day` | `DRAFT`，证据冲突时降为 `STOP` | 不进入 index、detail static route、search、sitemap、graph 或 published 内链 |

**禁止从 `DRAFT` 升为 `PUBLISH`。** 本轮没有真实人工学术审核，因此即使官方人物页和代表作均可访问，也只能完成 evidence-ready draft。未来发布需要另立计划并记录真实 reviewer role、review decision、review date、必要 locator 和明确 approval。

### 0.4 推荐且已经预检的身份来源

Codex 必须打开原页面并记录实际访问结果，不得只复制搜索摘要。

| Candidate | Source | URL | 允许支持的最大范围 |
| --- | --- | --- | --- |
| Goodson | University of Brighton, “National honour for Professor Goodson” | `https://www.brighton.ac.uk/about-us/news-and-events/news/2018/10-10-national-honour-for-professor-goodson.aspx` | 页面在 2018-10-10 所述的姓名、Professor of Learning Theory、University of Brighton/Tallinn University 页面时点身份、教育研究定位、BERA recognition；不能证明 2026 年仍持有相同职位 |
| Goodson | British Educational Research Association profile | `https://www.bera.ac.uk/person/ivor-goodson` | 页面所述 curriculum、life-history、teachers’ lives/careers 研究和列出的著作；不能单独证明当前职位或完整履历 |
| Day | University of Nottingham official profile | `https://www.nottingham.ac.uk/Education/People/christopher.day` | 页面当前展示的 Professor of Education、University of Nottingham School of Education、teacher professionalism/development 等研究领域与列出的著作；不能证明来源未直接陈述的私人关系或理论创始权 |

### 0.5 硬禁止

Codex 不得：

1. 执行 `git commit`、`git push`、创建 PR、merge 或 deploy；
2. 创建/切换分支、创建 worktree、stash、reset、restore、clean；
3. 修改 `.gitignore`、`.superpowers/**`、`.claude/**`；
4. 执行 `npm run db:reset`、`prisma migrate reset` 或 `db:push`；
5. 对归属不明、非本地或疑似生产数据库执行 migrate/seed；
6. 修改 Prisma schema、migration、通用 seed 架构、依赖、路由、组件、搜索、sitemap、static params、部署脚本或 workflow；
7. 新增或修改 Theory、Work、Concept、Topic、Field、Discipline、Genealogy；
8. 改动现有八条 genealogy 边；
9. 发布 Psychology 或 Management 内容；
10. 把 Goodson 或 Day 写成 `founder`、sole founder、creator、father of 或完整传统的唯一奠基人；
11. 把 `teacher-life-history-research` 写成 Goodson 一人的封闭理论；
12. 把 `teacher-professional-development-theory` 写成 Day 创建的单一理论；
13. 把 Guskey、Clarke–Hollingsworth、Timperley 或其他作者的模型归给 Day；
14. 从合著、引用、相同机构或相邻理论推导师承、影响或长期合作网络；
15. 使用 Wikipedia、Wikidata、博客或搜索摘要作为实质性主张的唯一证据；
16. 虚构页码、locator、职位、机构、DOI、ISBN、reviewer、approval 或 `verifiedAt`；
17. 把旧模板中的 `L1 + status: "verified"` 解释成 ADR-027 意义上的 claim-level “Source verified”；
18. 弱化、删除或跳过测试，或加入 `only`、`skip`、`todo`；
19. 在双 seed 前运行 production build；
20. 用旧 `.next` 或关键测试 skip 冒充完成。

---

## 1. 文件边界

### 创建

- `docs/roadmaps/2026-07-19-goodson-day-draft-scholar-enrichment.md` — 今日立项、范围、执行证据与最终状态。
- `docs/research/2026-07-19-goodson-day-scholar-evidence.md` — 两人的 person-specific evidence pack、claim matrix 和 attribution boundaries。
- `src/data/corpus/content-batches/2026-07-19-goodson-day-draft-scholars.ts` — 只包含两份 draft Scholar 与两条 raw TheoryScholar。
- `tests/second-scholar-enrichment.test.ts` — 批次级语料、来源、状态和归因合同。
- `tests/e2e/second-scholar-enrichment.spec.ts` — 两份草稿在所有 public surfaces 的隔离合同。

### 修改

- `src/data/corpus/shared/entities.ts` — 导入并合并新批次；不改既有实体内容。
- `tests/content-validation.test.ts` — Scholar slug/数量与 draft 内容合同。
- `tests/seed-corpus-regression.test.ts` — raw 数量、顺序、状态、关系和 genealogy 不变合同。
- `src/lib/seed-verification.ts` — 新增独立的 `secondScholarStatuses` 数据库核验字段。
- `tests/seed-integration.test.ts` — raw 计数增加、public 计数不变、精确状态核验。

### 明确不修改

- `src/data/seed-content.ts`
- `src/data/templates/scholar-template.ts`
- `src/lib/content-validation.ts`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/lib/search.ts`
- `src/lib/static-params.ts`
- `src/app/sitemap.ts`
- `src/app/scholars/**`
- `src/components/**`
- `package.json`
- `.github/**`
- `ops/**`

若执行发现必须修改“明确不修改”列表中的文件才能继续，停止并把结论记为 `BLOCKED_SCOPE_CHANGE`，不得自行扩大范围。

---

### Task 1: 固定基线并创建今日 roadmap

**Files:**
- Create: `docs/roadmaps/2026-07-19-goodson-day-draft-scholar-enrichment.md`

- [ ] **Step 1: 记录 Git 与工作区基线**

运行：

```bash
git status --short --branch
git rev-parse HEAD
git rev-list --left-right --count origin/main...HEAD
git diff --name-status
git ls-files --others --exclude-standard
git diff --check
```

预期：

- HEAD 与上述基线一致；若不一致，停止并报告 `BLOCKED_BASELINE_CHANGED`；
- ahead/behind 为 `0 0`；
- 既有 `.gitignore`、`.superpowers/**`、`.claude/` 状态被原样记录；
- `git diff --check` 退出码为 0。

- [ ] **Step 2: 按 Playbook 模板创建 roadmap**

roadmap 必须使用以下确定内容：

```markdown
# Goodson 与 Day Scholar 草稿证据完善：实施计划

> 日期：2026-07-19  
> 状态：实施中  
> 阶段：P1 内容语料  
> 负责人：Codex  
> 关联：`docs/superpowers/plans/2026-07-19-second-scholar-draft-enrichment-codex-execution.md`

## 1. 目标与用户价值
为 Teacher Life History Research 与 Teacher Professional Development 两条既有理论路径补充可追溯的 Scholar 草稿资产，为未来人工审核与发布建立可靠底稿；本轮公开用户不应看到新增 Scholar 页面。

## 2. 范围
### 包含
- Ivor F. Goodson person-specific evidence pack 与 draft Scholar。
- Christopher Day person-specific evidence pack 与 draft Scholar。
- 各一条 `key_contributor` raw TheoryScholar 关系。
- draft isolation、双 seed、build、smoke 与 E2E 证据。

### 不包含
- 不发布两位 Scholar。
- 不新增或修改 Theory、Work、Concept、Topic、Field、Discipline、Genealogy。
- 不修改 schema、migration、route、component、search、sitemap 或部署。
- 不执行 commit、push、PR、merge 或 deploy。

## 3. 当前证据与决策
- Goodson 复用现有 `goodson-2013-narrative-theory` 等 Work 来源；身份来源候选为 University of Brighton 与 BERA 页面。
- Day 复用现有 `day-1999-developing-teachers` 与 `teacher-development-day-etal-2006`；身份来源候选为 University of Nottingham 页面。
- 两人均固定为 `draft`；若证据不可访问、身份对应不清或关系只能靠推断，则该候选 `STOP`，不进入 corpus。
- 技术校验通过不等于 claim-level academic approval。

## 4. 实施步骤
1. 建立两人的 evidence pack 与 claim matrix。
2. 先写 draft Scholar 合同测试，再新增最小 corpus batch。
3. 更新 corpus 与数据库回归，执行本地双 seed。
4. fresh build 后验证两份草稿不进入任何 public surface。
5. 回写实际命令、计数、阻塞与结论。

## 5. 数据、内容与安全
- 数据来源：大学官方页、BERA、现有出版社/DOI 记录。
- 数据迁移/seed 影响：无 migration；raw Scholar 与 raw TheoryScholar 最多各增加 2，public 数量不变。
- 环境变量：仅在确认 `DATABASE_URL` 指向安全本地非生产库后执行数据库命令。
- 不记录连接串、token 或其他密钥。

## 6. 验收标准
- 两份 Scholar 若进入 corpus，状态必须为 `draft` 且无 `publishedAt`。
- Raw Scholar 8 → 10；Published Scholar 保持 7。
- Raw TheoryScholar 8 → 10；Public TheoryScholar 保持 7。
- `/scholars`、search、sitemap、graph 和 detail static routes 均不暴露两份草稿。
- focused tests、full tests、typecheck、lint、content check、双 seed integration、fresh build、required smoke、targeted/full E2E 全绿且关键项不 skip。

## 7. 风险、回退与发布判定
- 最大风险是 founder 误归因、把来源列出误称 claim-level verified、以及 draft 泄漏。
- 回退方式：移除本批次 module 聚合并重新 seed；不删除或改写既有 corpus。
- 本轮不能形成公开发布结论；最强结论是“本地验证的 draft-only content asset”。

## 8. 执行记录（实施后填写）
- 实际改动：
- 验证结果：
- 未完成项与原因：
- 下一步：
```

- [ ] **Step 3: 检查 roadmap 格式**

```bash
git diff --check -- docs/roadmaps/2026-07-19-goodson-day-draft-scholar-enrichment.md
```

预期：退出码 0。

---

### Task 2: 建立 person-specific evidence pack

**Files:**
- Create: `docs/research/2026-07-19-goodson-day-scholar-evidence.md`

- [ ] **Step 1: 打开并核对 Goodson 身份来源**

必须实际读取：

```text
https://www.brighton.ac.uk/about-us/news-and-events/news/2018/10-10-national-honour-for-professor-goodson.aspx
https://www.bera.ac.uk/person/ivor-goodson
```

只记录页面直接支持的姓名、页面时点职务/机构、研究方向和明确列出的著作。2018 页面中的职位必须写成“the 2018 University of Brighton page identifies…”之类的时间限定句，不能写成 2026 当前任职。

- [ ] **Step 2: 核对 Goodson 现有作品来源**

复用下列 source IDs，不创建重复 Work：

```text
goodson-2013-narrative-theory
teacher-life-history-goodson-1992
teacher-life-history-goodson-sikes-2001
```

必须区分：

- Goodson 是 2013 年著作作者；
- Goodson 是 1992 年 edited volume 的 editor，不得写成单著；
- Goodson 与 Pat Sikes 是 2001 年具体著作的 coauthors；该来源只证明此项合著。

- [ ] **Step 3: 打开并核对 Day 身份来源**

必须实际读取：

```text
https://www.nottingham.ac.uk/Education/People/christopher.day
```

只记录页面直接支持的 Professor of Education、University of Nottingham School of Education、teacher professionalism/development 等研究定位与页面列出的著作。不得从页面推导理论 founder、师承或私人关系。

- [ ] **Step 4: 核对 Day 现有作品来源**

复用下列 source IDs：

```text
day-1999-developing-teachers
teacher-development-day-etal-2006
```

必须区分：

- Day 是 1999 年著作作者；
- Day、Kington、Stobart、Sammons 是 2006 年文章共同作者；
- `teacher-development-guskey-2002`、`teacher-development-clarke-hollingsworth-2002`、`teacher-development-timperley-2007` 属于其他作者，不能归给 Day。

- [ ] **Step 5: 写完整 evidence pack**

文档必须包含以下固定章节，不留 `TBD`/`TODO`：

```markdown
# Ivor F. Goodson and Christopher Day — draft Scholar evidence pack

> Access date: 2026-07-19
> Decision: draft-only; no publication approval

## 1. Publication boundary
## 2. Goodson source register
## 3. Goodson claim matrix
## 4. Goodson attribution boundaries
## 5. Day source register
## 6. Day claim matrix
## 7. Day attribution boundaries
## 8. Source conflicts and non-claims
## 9. Draft/stop decision
## 10. Future human-review requirements
```

每条 source register 必须有：

```text
source ID | citation | URL | source type | directly supports | does not support | accessed date
```

每条 claim matrix 必须有：

```text
claim ID | field path | safe wording | content nature (L1/L2/L3) | source ID | locator if actually available | forbidden extension
```

必须明确写入：

- Goodson 只能是 `teacher-life-history-research` 的 bounded `key_contributor` candidate；
- Day 只能是 plural/editorial `teacher-professional-development-theory` 的 bounded `key_contributor` candidate；
- 两项关系均为 L2 editorial attribution，不是来源直接宣布的 founder 事实；
- 当前没有真实 reviewer、approval 或 `verifiedAt`；
- 页面未来仍只能表达 “Sources listed · editorial synthesis · claim-level review pending”；
- `teacher-life-history-josselson-2007` 的历史 DOI 记录不用于两位 Scholar 的身份或关系证明，也不在本批顺手修复。

- [ ] **Step 6: 应用 STOP 条件**

任一候选出现以下情况时，将该候选在 evidence pack 的决策写为 `STOP`，后续 corpus/test 中完全不加入该候选：

- 官方人物页无法访问且没有另一个权威 person-specific 来源；
- 来源无法排除同名人物；
- 规范名或作品作者对应不清；
- 需要虚构 `scholarly_relations` 才能满足模板；
- 来源之间出现无法解决的职位、版本、作者或身份冲突；
- 关系只能从相邻理论或共享词汇推导。

若两人都 `STOP`，直接跳到 Task 12，结论为 `BLOCKED_BEFORE_CORPUS`；不得修改 `src/`、`tests/`、数据库或 build。

- [ ] **Step 7: 检查 evidence pack**

```bash
git diff --check -- docs/research/2026-07-19-goodson-day-scholar-evidence.md
rg -n "TBD|TODO|placeholder|sole founder|father of|Source verified" docs/research/2026-07-19-goodson-day-scholar-evidence.md
```

预期：

- `git diff --check` 退出码 0；
- 无 `TBD`、`TODO`、placeholder；
- “sole founder”“father of”“Source verified”只允许出现在明确的禁止/非主张语境中。

---

### Task 3: 先写第二批 Scholar 语料合同测试

**Files:**
- Create: `tests/second-scholar-enrichment.test.ts`

> 下列步骤假定两位均通过 Task 2 的 draft 最低证据门槛。若一人 `STOP`，只保留另一人的 exact case，并同步使用 Task 8 的公式计算 raw 数量；不得创建空壳记录。

- [ ] **Step 1: 写失败测试**

测试必须使用 immutable assertions，并定义以下 exact cases：

```ts
const draftScholarCases = [
  {
    slug: "ivor-f-goodson",
    name: "Ivor F. Goodson",
    theorySlug: "teacher-life-history-research",
    workSlug: "goodson-2013-narrative-theory",
    identitySourceId: "goodson-brighton-2018-profile",
    relationSourceId: "goodson-2013-narrative-theory",
    collaborationSourceId: "teacher-life-history-goodson-sikes-2001",
  },
  {
    slug: "christopher-day",
    name: "Christopher Day",
    theorySlug: "teacher-professional-development-theory",
    workSlug: "day-1999-developing-teachers",
    identitySourceId: "day-nottingham-profile",
    relationSourceId: "day-1999-developing-teachers",
    collaborationSourceId: "teacher-development-day-etal-2006",
  },
] as const;
```

每个 case 必须断言：

```ts
assert.ok(scholar, `${entry.slug} exists`);
assert.equal(scholar.status, "draft");
assert.equal(scholar.publishedAt, undefined);
assert.ok(isScholarContent(scholar.content.en));
assert.equal(scholar.name, entry.name);
assert.ok(scholar.content.en.sources.some((source) => source.id === entry.identitySourceId));
assert.ok(scholar.content.en.representative_works.some((work) => work.work_slug === entry.workSlug));
assert.deepEqual(
  scholar.content.en.theory_relationships.map((relation) => relation.theory_slug),
  [entry.theorySlug],
);
assert.ok(scholar.content.en.scholarly_relations.some((relation) => relation.source_ids.includes(entry.collaborationSourceId)));
assert.ok(scholar.content.en.attribution_boundaries.length >= 2);
assert.doesNotMatch(JSON.stringify(scholar.content.en), /sole founder|father of|founded the theory/i);
```

对应 raw relation 必须断言：

```ts
assert.ok(relation, `${entry.slug} has one raw TheoryScholar relation`);
assert.equal(relation.role, "key_contributor");
assert.ok(relation.evidenceNotesEn.toLowerCase().includes("editorial"));
assert.ok(relation.evidenceNotesEn.toLowerCase().includes("not a founder"));
```

另外断言两份草稿不增加 published 数量：

```ts
assert.equal(seedCorpus.scholars.filter((scholar) => scholar.status === "published").length, 7);
assert.equal(seedCorpus.theoryScholars.filter((relation) => {
  const scholar = seedCorpus.scholars.find((candidate) => candidate.slug === relation.scholarSlug);
  const theory = seedCorpus.theories.find((candidate) => candidate.slug === relation.theorySlug);
  return scholar?.status === "published" && theory?.status === "published";
}).length, 7);
```

- [ ] **Step 2: 运行测试并确认 RED**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/second-scholar-enrichment.test.ts
```

预期：FAIL，且失败原因为 `ivor-f-goodson` / `christopher-day` 尚不存在；如果因导入、语法或测试设置失败，先修测试本身，不进入实现。

---

### Task 4: 新增最小 draft Scholar corpus batch

**Files:**
- Create: `src/data/corpus/content-batches/2026-07-19-goodson-day-draft-scholars.ts`
- Modify: `src/data/corpus/shared/entities.ts`
- Test: `tests/second-scholar-enrichment.test.ts`

- [ ] **Step 1: 定义批次接口与身份来源**

新文件只导出：

```ts
export interface GoodsonDayDraftScholarSourcePool {
  teacherDevelopment: ContentSource;
  teacherDevelopmentIdentity: ContentSource;
  lifeHistory: ContentSource;
  lifeHistoryTeachers: ContentSource;
  lifeHistoryGoodsonSikes: ContentSource;
}

export interface GoodsonDayDraftScholarBatch {
  scholars: SeedScholar[];
  theoryScholars: SeedTheoryScholar[];
}

export function createGoodsonDayDraftScholarBatch(
  sources: GoodsonDayDraftScholarSourcePool,
): GoodsonDayDraftScholarBatch
```

批次内部新增 person-specific sources：

```ts
const goodsonBrightonProfile: ContentSource = {
  id: "goodson-brighton-2018-profile",
  citation: "University of Brighton. (2018). National honour for Professor Goodson.",
  url: "https://www.brighton.ac.uk/about-us/news-and-events/news/2018/10-10-national-honour-for-professor-goodson.aspx",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "Page-time academic positioning in 2018",
    "Professor of Learning Theory title stated by the university page",
  ],
};

const goodsonBeraProfile: ContentSource = {
  id: "goodson-bera-profile",
  citation: "British Educational Research Association. Ivor Goodson profile.",
  url: "https://www.bera.ac.uk/person/ivor-goodson",
  source_kind: "authoritative_web",
  evidence_level: "L1",
  supports: [
    "Education-research positioning",
    "Curriculum and life-history research areas stated by the profile",
  ],
};

const dayNottinghamProfile: ContentSource = {
  id: "day-nottingham-profile",
  citation: "University of Nottingham, School of Education. Christopher Day profile.",
  url: "https://www.nottingham.ac.uk/Education/People/christopher.day",
  source_kind: "university",
  evidence_level: "L1",
  supports: [
    "Professor of Education title shown on the profile",
    "Teacher professionalism and development research areas shown on the profile",
  ],
};
```

- [ ] **Step 2: 添加 Goodson draft Scholar**

必须满足：

- slug：`ivor-f-goodson`；
- name：`Ivor F. Goodson`；
- status：`draft`；
- 不写 `publishedAt`；
- `academic_identity.source_ids` 至少包含 `goodson-brighton-2018-profile`；
- overview 对职位采用 2018 页面时点限定，不声称当前任职；
- 唯一 theory relationship 指向 `teacher-life-history-research`；
- representative works 复用：`goodson-2013-narrative-theory`、`teacher-life-history-goodson-1992`、`teacher-life-history-goodson-sikes-2001`；
- scholarly relation 只记录 Goodson 与 Pat Sikes 是 2001 年具体著作的共同作者；
- attribution boundaries 至少明确不把整个研究传统归给 Goodson、不把一个合著扩张为师承/影响/长期合作；
- verification 保持 L1/L2/L3，L2 明确为 bounded editorial synthesis，L3 为 conditional reading guidance。

- [ ] **Step 3: 添加 Day draft Scholar**

必须满足：

- slug：`christopher-day`；name：`Christopher Day`；status：`draft`；无 `publishedAt`；
- `academic_identity.source_ids` 包含 `day-nottingham-profile`；
- 唯一 theory relationship 指向 `teacher-professional-development-theory`，描述必须含 plural/editorial entry 边界；
- representative works 复用 `day-1999-developing-teachers`；2006 文章可作为 source，但不是现有 Work 实体；
- scholarly relation 只记录四位作者是 2006 年具体文章共同作者；
- attribution boundaries 明确该条目不是 Day 创建的单一理论，其他作者模型不能归给 Day；
- verification 不写 claim-level approval。

- [ ] **Step 4: 添加两条 raw TheoryScholar**

```ts
{
  theorySlug: "teacher-life-history-research",
  scholarSlug: "ivor-f-goodson",
  role: "key_contributor",
  sourceUrls: [sources.lifeHistory.url],
  evidenceNotesEn: "Goodson's cited work is a source anchor for this research-tradition entry. The key-contributor label is bounded Syntag editorial synthesis, not a founder claim or claim-level approval.",
}

{
  theorySlug: "teacher-professional-development-theory",
  scholarSlug: "christopher-day",
  role: "key_contributor",
  sourceUrls: [sources.teacherDevelopment.url],
  evidenceNotesEn: "Day's cited book is one source anchor within this plural editorial entry. The key-contributor label is bounded Syntag editorial synthesis, not a founder claim or claim-level approval.",
}
```

- [ ] **Step 5: 在 shared corpus 中接入批次**

导入 `createGoodsonDayDraftScholarBatch`，在 `firstEnrichmentBatch` 后实例化，并且只向最终 `scholars` 与 `theoryScholars` 数组追加新批次。不得改其他数组。

- [ ] **Step 6: 运行 focused test 并确认 GREEN**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/second-scholar-enrichment.test.ts
npm run content:check
```

预期：全部 PASS；`content:check` 退出码 0。

---

### Task 5: 更新 corpus 内容与回归合同

**Files:**
- Modify: `tests/content-validation.test.ts`
- Modify: `tests/seed-corpus-regression.test.ts`

- [ ] **Step 1: 更新 Scholar 精确列表与 draft 断言**

最终列表追加：

```ts
"ivor-f-goodson",
"christopher-day",
```

对新增项断言 `status === "draft"`、`publishedAt === undefined`、`isScholarContent(...) === true`。

- [ ] **Step 2: 更新 corpus baseline**

```text
scholars: 10
theoryScholars: 10
published scholars: 7
public TheoryScholar: 7
genealogy: 8
topics: 8 / published 4
topicTheories: 24 / public 12
works: 19
concepts: 24
```

- [ ] **Step 3: 运行 focused corpus tests**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test \
  tests/second-scholar-enrichment.test.ts \
  tests/content-validation.test.ts \
  tests/seed-corpus-regression.test.ts
```

预期：全部 PASS。

---

### Task 6: 更新数据库核验合同

**Files:**
- Modify: `src/lib/seed-verification.ts`
- Modify: `tests/seed-integration.test.ts`

- [ ] **Step 1: 先更新 integration 期望**

```text
publishedScholarCount = 7
theoryScholarCount = 7
totalScholarCount = 10
totalTheoryScholarCount = 10
searchableScholarCount = 7
```

新增：

```ts
assert.deepEqual(result.secondScholarStatuses, [
  { slug: "christopher-day", status: "draft" },
  { slug: "ivor-f-goodson", status: "draft" },
]);
```

- [ ] **Step 2: 运行 integration 并记录真实 RED/skip**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test tests/seed-integration.test.ts
```

`DATABASE_URL` 缺失导致的 skip 不算通过；旧数据库失败时不得修改期望去适配旧数据。

- [ ] **Step 3: 扩展 `SeedVerificationResult`**

增加 `secondScholarStatuses` 字段和针对两个 slug 的有序查询；不得混入第一批状态字段。

- [ ] **Step 4: 运行静态门禁**

```bash
npm run typecheck
node --env-file-if-exists=.env --experimental-strip-types --test \
  tests/second-scholar-enrichment.test.ts \
  tests/content-validation.test.ts \
  tests/seed-corpus-regression.test.ts
```

预期：全部 PASS。

---

### Task 7: 先写 draft public-surface E2E 合同

**Files:**
- Create: `tests/e2e/second-scholar-enrichment.spec.ts`

- [ ] **Step 1: 定义 cases**

```ts
const draftScholarCases = [
  { slug: "ivor-f-goodson", name: "Ivor F. Goodson", query: "Ivor Goodson" },
  { slug: "christopher-day", name: "Christopher Day", query: "Christopher Day" },
] as const;
```

- [ ] **Step 2: 为每位草稿写全入口隔离测试**

验证 `/scholars`、search、sitemap、Scholar 图谱均无该项，直达 detail 返回 404/unavailable。成功页面使用 `watchBrowserHealth`；预期 404 不挂通用 watcher，不加 404 白名单。

- [ ] **Step 3: 加入回归边界**

确认 Jean Lave 等既有 published Scholar 可见，Kingdon 仍 draft，四个 2026-07-18 Topic 状态不变；在 375×812 检查 `/scholars` 无水平溢出及 serious/critical axe violations。

- [ ] **Step 4: 静态检查**

```bash
git diff --check -- tests/e2e/second-scholar-enrichment.spec.ts
rg -n "test\.skip|test\.only|test\.todo|\.skip\(" tests/e2e/second-scholar-enrichment.spec.ts
```

预期：无 skip/only/todo。此时不运行 E2E。

---

### Task 8: 数据库写入前静态门禁

- [ ] **Step 1: focused tests**

```bash
node --env-file-if-exists=.env --experimental-strip-types --test \
  tests/second-scholar-enrichment.test.ts \
  tests/content-validation.test.ts \
  tests/seed-corpus-regression.test.ts
```

- [ ] **Step 2: 质量门禁**

```bash
npm run typecheck
npm run lint
npm run content:check
git diff --check
```

- [ ] **Step 3: 范围审计**

```bash
git diff --name-status
git diff -- package.json prisma .github ops .gitignore .superpowers .claude
```

预期：全部通过，禁止路径没有本批次改动。

---

### Task 9: 在安全本地数据库执行 migrate 与双 seed

- [ ] **Step 1: 不泄密地确认数据库安全性**

只在明确确认本项目安全本地非生产库后继续；localhost 若是生产 tunnel 也必须停止。不得打印完整连接串。

- [ ] **Step 2: migrate 并确认无 schema 变化**

```bash
git status --short -- prisma
npm run db:migrate
git status --short -- prisma
```

预期：already in sync 且无 migration 变化。

- [ ] **Step 3: 第一次 seed + integration**

```bash
npm run db:seed
node --env-file-if-exists=.env --experimental-strip-types --test tests/seed-integration.test.ts
```

预期 raw 10/10、public 7/7、searchable 7、两候选均 draft；测试实际 PASS，不能 skip。

- [ ] **Step 4: 第二次 seed + integration**

```bash
npm run db:seed
node --env-file-if-exists=.env --experimental-strip-types --test tests/seed-integration.test.ts
```

预期：第二次 seed 和 integration 均实际执行并 PASS；`Raw Scholars = 10`、`Published Scholars = 7`、`Raw TheoryScholar = 10`、`Public TheoryScholar = 7`、`Searchable Scholars = 7`，两位候选状态仍为 `draft`，且结果与第一次完全一致，无重复 Scholar 或 TheoryScholar。

---

### Task 10: 完整工程门禁和 fresh build

- [ ] **Step 1: 固定顺序执行**

```bash
npm run typecheck
npm test
npm run lint
npm run content:check
npm run build
BUILD_OUTPUT_SMOKE_REQUIRED=1 \
node --env-file-if-exists=.env --experimental-strip-types --test tests/build-output-smoke.test.ts
```

预期全部退出 0；required smoke 1 pass/0 fail/0 skip；两位 draft 不生成公共静态路由或 sitemap URL；既有 published/draft 边界无回退。

---

### Task 11: targeted 与 full E2E

- [ ] **Step 1: targeted**

```bash
PLAYWRIGHT_PORT=3101 npx playwright test tests/e2e/second-scholar-enrichment.spec.ts
```

- [ ] **Step 2: full E2E**

```bash
PLAYWRIGHT_PORT=3101 npm run test:e2e
```

预期全部 PASS，无严重无障碍问题、浏览器错误或非预期第一方 4xx/5xx；两位 draft 在全部 public surfaces 隔离。

- [ ] **Step 3: desktop + 375px 手工抽查**

检查 `/scholars`、两条 search、sitemap、首页 Scholar 模式、两条新 detail、Jean Lave 与 Kingdon。记录真实结果。

---

### Task 12: 回写 roadmap 与最终审计

- [ ] **Step 1: 设置真实状态**

只能为 `已完成`、`阻塞` 或 `实施中`。不得宣称 deployed、online、production verified、released 或 claim-level source verified。

- [ ] **Step 2: 回写完整证据**

记录候选决策、来源、文件、RED/GREEN、双 seed、计数、门禁、public-surface 矩阵、风险及未执行 Git/发布操作。

允许的最强结论：

> The Goodson and Day Scholar batch is locally verified as a draft-only content asset. Two source-bounded Scholar drafts and two raw TheoryScholar relations are stored, while published and searchable Scholar counts remain unchanged. No public route, search result, sitemap entry, graph node, production release, or claim-level approval was created.

- [ ] **Step 3: 最终 Git 审计**

```bash
git status --short --branch
git diff --name-status
git diff --stat
git diff --check
git diff -- package.json prisma .github ops .gitignore .superpowers .claude
```

确认无密钥、无超范围改动、八条 genealogy 不变、published Scholar 仍为 7、两候选均 draft、既有用户变更未被触碰、无 commit/push/PR/merge/deploy。

---

## 2. 最终交接格式

```markdown
# 2026-07-19 Goodson 与 Day Scholar 草稿批次：执行交接

## 1. 结论
- Result: DRAFT_ONLY_PASSED | PARTIALLY_PASSED | BLOCKED_BEFORE_CORPUS | BLOCKED_DATABASE_SAFETY | BLOCKED_AFTER_CORPUS | BLOCKED_SCOPE_CHANGE
- Public Scholar increment: 0
- Remaining P0/P1 blockers:

## 2. Git 基线
- Branch:
- Initial HEAD:
- Final HEAD:
- Ahead/behind:
- Pre-existing changes preserved:

## 3. Candidate evidence and decision
| Candidate | Canonical name | Identity sources | Work anchors | Theory | Role | Decision | Blocker |
|---|---|---|---|---|---|---|---|

## 4. Actual files
### Created
- ...
### Modified
- ...
### Explicitly untouched
- `.gitignore`
- `.superpowers/**`
- `.claude/**`
- `package.json`
- `prisma/**`
- `.github/**`
- `ops/**`

## 5. TDD record
| Slice | RED command | RED reason | GREEN command | Result |
|---|---|---|---|---|

## 6. Database and idempotency
- Database safety decision:
- Migrate:
- Seed #1:
- Integration #1:
- Seed #2:
- Integration #2:

| Metric | Before | After raw | After public |
|---|---:|---:|---:|
| Scholars | 8 / 7 public | | |
| TheoryScholar | 8 / 7 public | | |
| Searchable Scholars | 7 | | |

## 7. Engineering gates
| Command | Exit code | Pass/Fail/Skip/Not run | Notes |
|---|---:|---|---|
| focused tests | | | |
| typecheck | | | |
| npm test | | | |
| lint | | | |
| content:check | | | |
| build | | | |
| required smoke | | | |
| targeted E2E | | | |
| full E2E | | | |

## 8. Public-surface matrix
| Candidate | Index | Detail | Search | Sitemap | Scholar graph | Expected |
|---|---|---|---|---|---|---|

## 9. Risks and unresolved items
- ...

## 10. Git and release declaration
- Commit performed: No
- Push performed: No
- PR created: No
- Merge performed: No
- Deploy performed: No

## 11. Recommended next action
- Recommendation only; do not execute it automatically.
```

未实际运行的命令必须写 `NOT RUN`，不能写“应当通过”。

---

## 3. 成功判断

本计划的成功不是新增公开页面，而是同时证明：

1. 两人的人物证据、代表作和理论关系被有边界地记录；
2. 若进入 corpus，均为完整、非虚构、无 `publishedAt` 的 draft；
3. raw Scholar/relations 可幂等写入安全本地数据库；
4. published/searchable Scholar 数保持 7；
5. index、detail static params、search、sitemap、graph 和内链均不泄漏草稿；
6. 技术合同不被错误解释为 claim-level academic approval；
7. 四个 draft Topics、Kingdon draft、八条 genealogy 和 Education/Sociology 范围无回退；
8. 所有结论由实际命令与浏览器结果支持。
