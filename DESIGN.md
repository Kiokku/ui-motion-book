---
name: 感知之书 · The Art of Feel
description: 安静精密的中文 UI 与动效设计实验室
colors:
  primary: "oklch(.505 .19 259)"
  primary-hover: "oklch(.45 .18 259)"
  bg: "oklch(1 0 0)"
  panel: "oklch(.978 .006 255)"
  panel-blue: "oklch(.967 .014 255)"
  ink: "oklch(.245 .035 260)"
  muted: "oklch(.485 .035 260)"
  line: "oklch(.897 .019 255)"
  nav-active: "oklch(.925 .034 255)"
  accent: "oklch(.75 .145 70)"
  success: "oklch(.4 .09 165)"
  error: "oklch(.46 .14 35)"
typography:
  display:
    fontFamily: "'Songti SC', 'STSong', 'Noto Serif CJK SC', serif"
    fontSize: "clamp(43px, 4.5vw, 65px)"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-.025em"
  headline:
    fontFamily: "'Songti SC', 'STSong', 'Noto Serif CJK SC', serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-.025em"
  title:
    fontFamily: "'Songti SC', 'STSong', 'Noto Serif CJK SC', serif"
    fontSize: "25px"
    lineHeight: 1.6
  body:
    fontFamily: "Manrope, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "15px"
    lineHeight: 2
  label:
    fontFamily: "Manrope, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "11px"
  code:
    fontFamily: "'SFMono-Regular', Consolas, monospace"
    fontSize: ".82em"
rounded:
  control: "6px"
  segment: "4px"
  stage: "7px"
  quiz: "8px"
  experiment: "9px"
  cover-study: "10px"
spacing:
  control-gap: "7px"
  small: "12px"
  stage: "20px"
  experiment: "24px"
  chapter-gap: "36px"
  page: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg}"
    rounded: "{rounded.control}"
    padding: "13px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 13px"
  text-input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "5px"
    padding: "10px"
  chapter-navigation-active:
    backgroundColor: "{colors.nav-active}"
    textColor: "{colors.primary}"
    rounded: "5px"
    padding: "11px 9px"
  segment-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg}"
    rounded: "{rounded.segment}"
    padding: "8px 11px"
  experiment:
    backgroundColor: "{colors.panel-blue}"
    rounded: "{rounded.experiment}"
    padding: "24px"
---

# Design System: 感知之书

## Overview

**Creative North Star: "安静精密的设计实验室"**

以长时间中文阅读和自主探索为中心。白色正文、浅蓝灰目录与准确的蓝色图形建立安静、精密、清楚的阅读空间；宋体标题保留书籍感，系统中文黑体与本地 Manrope 承担解释、控制与读数。

实验解释一个明确概念，正文维持连续的阅读顺序。封面直接呈现可操作的缓动实验，读者通过比较、操作和即时反馈建立判断；15 类实验共用同一套浅色表面与语义颜色。

**Key Characteristics:**
- 白色正文与浅蓝灰辅助区域。
- 宋体层级、清晰正文、可核对的图形与读数。
- 宽屏可收起目录、正文与实验、原文编辑器并列阅读。
- 克制的阅读界面与可主动操作的实验。

## Colors

颜色以 CSS 中的 OKLCH 值为准，前置 tokens 保留原始格式。

### Primary
- **实验蓝（primary）**：主要按钮、当前章节、原文主题高亮、可操作链接与曲线。指针悬停使用 primary-hover。

### Secondary
- **观察琥珀（accent）**：曲线当前采样点、运行时对照等需要区分的实验角色。
- **确认绿（success）与反馈红（error）**：已练习、正确反馈及失败状态，配合文字或图标表达。

### Neutral
- **白纸（bg）**：主阅读区、实验内舞台与输入框。
- **冷灰纸（panel）**：固定目录、说明与速查。
- **实验浅蓝（panel-blue）**：实验外框、封面实验与判断题区域。
- **墨色（ink）与注释灰（muted）**：正文层级与辅助说明。
- **分隔线（line）与导航浅蓝（nav-active）**：细线结构和当前目录项。

**The Semantic Color Rule.** 状态与实验角色必须同时提供文字、形状或读数，颜色用于辅助区分。

## Typography

标题使用 display 字族；正文使用 body 字族。Manrope 字体文件本地打包，中文由系统黑体回退；代码使用 code 字族。章节英文副标题单独使用 Georgia 斜体。

- **Display**：封面标题；中屏和手机按现有断点调整字号。
- **Headline**：章节主标题，桌面采用 headline，1000px 以下为 35px，700px 以下为 31px。
- **Title**：正文小节与实验标题；手机为 23px。
- **Body**：正文默认 15px、2 倍行高，手机为 1.95 倍；首段桌面可并排，1000px 以下回到单列。普通段落最大宽度为 75ch。
- **Label**：目录、控制与辅助说明使用紧凑的 10–12px 层级。输入框默认 16px，手机笔记也为 16px。
- **Readout**：时间与进度使用等宽数字；参数使用代码字体，解释以正文提供。

## Layout

桌面目录固定在左侧（232px），1000px 以下缩为 218px；工具栏提供收起与展开按钮，选择保存在当前浏览器，收起后正文区域填补目录空间。顶部工具栏固定阅读上下文（64px 高）。章节容器最大宽度 1840px，左右内边距 30px；正文最大 860px，与最小 360px、比例 .86fr 的原文编辑器相隔 30px。正文宽度不超过 600px 时，以容器查询重新安排实验内部布局。

视口超过 1100px 时，原文编辑器固定在当前阅读视口内（距顶 88px），内部独立滚动。它展示本章固定版本的 SKILL.md 原文，保留原始行号，以正文主题检查点逐段补入；当前主题浅蓝高亮，未读片段合并为折叠占位。回看保留已展开内容；“暂停跟随”停止补全与定位，恢复后跟上阅读位置。章末练习展开全部原文，文件内容不提供编辑与保存。

1100px 及以下采用单栏正文与“查看 SKILL.md”入口，编辑器通过原生 dialog 展示，支持键盘焦点约束与 Escape 返回。700px 以下目录仍为可关闭的覆盖面板。手机从顶部进入术语索引。
正文按小节连续流动，只有实验、速查、边界说明与判断题使用明确的功能表面。封面标题与真实实验在桌面并排，1000px 以下堆叠。普通导航立即切换，章节锚点为固定工具栏保留滚动间距。

## Elevation & Depth

阅读系统通过背景明度、细边线与留白表达层次。正文、实验舞台、按钮和目录不依靠投影建立层级；移动目录使用半透明遮罩区分前后层。实验中的对象可呈现其教学必需的变换，避免把此类行为扩散为阅读界面的装饰。

## Shapes

控制采用小圆角，实验表面比控制略柔和。圆形用于原文跟随状态、运动采样点与弹簧对象，承担位置或状态含义。正文保持开放排版，边线分隔章节层级；避免把普通段落包装成重复卡片。

## Components

- **主要与次要按钮**：主要动作使用实心实验蓝与白字；次要动作使用白色底、细边框。按钮按下时降低不透明度，触感实验另有明确的按压变换。悬停依循当前 CSS；键盘焦点为主色 2px 外轮廓、4px 偏移。
- **输入与搜索**：白色背景、细边框、明确标签；笔记为可调整高度的文本框。不能仅用占位符表达输入用途。
- **目录与原文编辑器**：当前章节使用浅蓝底与蓝字；桌面可收起目录。编辑器通过真实行号、当前主题高亮、展开行数和暂停状态表达阅读进程。手机目录与原文对话框分别约束焦点，Escape 可关闭。
- **实验与分段控制**：浅蓝外层包含白色舞台。分段项的选中态为蓝底白字；读数和说明保留在舞台下方。每类实验保留自己的教学语义与边界说明。
- **缓动实验**：提供 Ease-out、Ease-in-out、Ease-in 反例与 Linear。横轴为时间，纵轴为完成进度，刻度为 0、0.25、0.5、0.75、1。滑块改变时间；当前曲线的点、轨道与百分比共享 bezierProgress 的实际计算。线性轨道提供同一时刻的对照。播放时长为 240ms，5 倍慢速为 1200ms。
- **动效与静阅**：默认曲线为 cubic-bezier(.23,1,.32,1)。播放和重播由实验控制；系统减少动态效果优先，手动静阅同样关闭动画与过渡，并保留静态位置和解释。弹簧可中途抓取，并提供键盘可触发的按钮替代。

**The Computed Evidence Rule.** 曲线、当前位置与文字读数来自同一计算，视觉不能暗示与实际参数不同的进度。

## Do's and Don'ts

### Do:
- Do 保持正文可复制、可缩放，提供可见焦点与触屏可操作的控制。
- Do 用真实可操作的实验配合说明、边界与文字读数。
- Do 在所有章节、术语索引、复习与来源页复用浅色阅读系统。
- Do 把术语放在章节上下文中，并保留完整索引入口。

### Don't:
- Don't 用重复卡片打断普通正文的阅读顺序。
- Don't 用持续循环的装饰运动争夺正文注意力。
- Don't 把浏览器教学模型表达为真实设备性能检测。
- Don't 在减少动态效果时移除实验的静态解释与结果。
