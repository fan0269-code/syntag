# Codex Prompt 1/5: UI Design System

## Context

你正在为 **Syntag**（一个面向全球硕博生的理论知识图谱平台）建立完整的 UI 设计系统。

产品文档：`Syntag-产品设计文档.md`（请先通读第五章"视觉设计系统"和第4章"图谱交互模型"）
当前项目：Next.js 15 + Tailwind CSS，代码在 `syntag/src/` 下
设计令牌已在 `syntag/src/app/globals.css` 中定义为 CSS 变量

## 你的任务

### 1. 创建全局 UI 组件（`src/components/layout/`）

创建以下组件，每个组件使用已有设计令牌：

**Header.tsx**
- 深色半透明背景 (#0a0a0f / 90% opacity) + 1px 底部分割线
- 左侧：Syntag Logo（文字 Logo，字体 weight 700，颜色 #f0f0f5）
- 导航链接：Disciplines | Theories | Scholars | Topics | Framework Builder
- 右侧：搜索图标（点击展开搜索浮层）
- 移动端：汉堡菜单
- 不搞 sticky header，让页面往下滚时 header 自然消失

**Footer.tsx**
- 深色背景 + 顶部 1px 分割线
- 三列结构：Brand（简介） / Quick Links（导航） / Legal（隐私/条款/编辑政策等链接）
- 品牌名 Syntag + 定位短语
- 极简风格，文字小号（14px），颜色 `--text-secondary`

**Breadcrumbs.tsx**
- 接收 path 数组：`[{label, href}]`
- 分隔符用 `/`（不是 `>`）
- 颜色 `--text-tertiary`，最后一项用 `--text-primary`
- Schema.org BreadcrumbList JSON-LD 嵌入

### 2. 创建知识图谱视觉组件（`src/components/graph/`）

**GraphCanvas.tsx**
- 这是首页的核心，一个全屏 Canvas/WebGL 容器
- 接收 `nodes` 和 `edges` 数据，渲染为可交互力导向图
- 支持：缩放（滚轮）、平移（拖拽空白区）、节点拖拽
- 加载态：半透明骨架屏，中央一个脉冲圆点
- 空态：提示"No theories found for this discipline"
- 错误态：重试按钮

**GraphNode.tsx**
- 按节点类型渲染不同形状和颜色（参考产品文档 5.3 节）
- 理论节点（圆角矩形，暖白 #e8e4df，大小按深度 D1/D2/D3 递增）
- 学者节点（圆形，冷蓝 #7dd3fc）
- 概念节点（菱形，暖金 #fbbf24）
- 原典节点（小方形，灰绿 #86b8a0）
- 研究主题节点（六角形，淡紫 #c4b5fd）
- 每个节点显示 label（截断到 25 字符），hover 时显示完整名称

**GraphEdge.tsx**
- 按关系类型渲染不同线型和颜色（参考产品文档 5.3 节）
- precursor_of: 实线 + 箭头，白色半透明
- branched_from: 虚线 + 箭头，冷蓝半透明
- extended_by: 实线，暖金色
- critiqued_by: 红色虚线
- integrated_with: 双实线，淡紫色
- hover 边线时显示关系类型标签

**TheoryDetail.tsx**
- 图谱右侧滑出面板（宽度 380px，移动端变成底部抽屉）
- 点击节点时滑入，显示：理论名/学者名、一句话定义、核心概念标签、[Read Full Article →] 按钮
- 带关闭按钮和滑入动画（300ms ease-out）
- 关闭后面板收回，图谱恢复全宽

### 3. 通用组件（`src/components/common/`）

**AdSlot.tsx**
- 接收 `placement: 'in-article' | 'bottom' | 'home-banner'`
- 渲染一个与站点设计语言一致的广告位容器（深色背景 + 细边框 + 8px 圆角）
- 顶部居中显示 "Advertisement" 标签（11px, uppercase, letter-spacing, text-tertiary）
- 内部是一个占位 div（id 用于后续 AdSense 注入），高度自适应当前 placement
- 不做弹窗、不做遮挡、不做诱导点击文字

**EntityCard.tsx**
- 通用卡片组件，用于列表/网格展示理论、学者、原典
- 显示：标题、摘要（2行截断）、标签（分类/深度等级）、阅读时间
- hover 上浮 4px + 边框从 `--border-default` 变为 `--border-visible`
- 链接到对应详情页

**VerificationBadge.tsx**
- 接收 `level: 'L1_verified' | 'L2_reviewed' | 'L3_pending'`
- L1 = 绿色标签 "Verified"
- L2 = 蓝色标签 "Editorially Reviewed"
- L3 = 黄色标签 "Verification Pending"

**SourceBlock.tsx**
- 底部来源与核验状态区块
- 接收 `sources: [{text, level, url?}]`
- 列表展示每条来源，前方标注核验等级徽标

**Disclaimer.tsx**
- 灰底小字免责声明："Content is for informational purposes only and does not constitute professional academic advice."

### 4. 设计细则

- 所有组件**必须**支持移动端（< 768px），适配规则参照产品文档 5.4 节
- 不要大圆角（不超过 8px）、不要大面积渐变、不要装饰球、不要复杂动画
- 过渡动画最长 300ms，使用 ease-out
- 卡片阴影使用 `--shadow-card`（亮边玻璃感），不要用大面积扩散阴影
- 所有交互元素需满足 WCAG AA 对比度
- 图标优先使用内联 SVG（不引入图标库），保持线性极简风格
- 所有文字颜色必须来自设计令牌，不硬编码颜色值

### 5. 不要做的事

- 不引入新的图标库或 UI 库（不用 lucide-react / heroicons / radix 等）
- 不做亮色主题切换（只有深色主题）
- 不做动画库（不用 framer-motion 等）
- 不做表单组件（Phase 1 不需要）
- 不做弹窗/Modal（用滑出面板替代）

## 验证

完成后，确保：
1. 所有组件在 `npm run build` 时无 TypeScript 错误
2. 每个组件接受正确的 Props 类型
3. 移动端 375px 宽度检查无横向滚动
