# 感知之书 · 阅读与实验

Mode: Read

User-chosen direction: 安静精密的设计实验室。

Concept reference: output/concepts/route-a-design-laboratory.png。该图用于用户选定的路线落地；其中曲线与读数由真实计算绘制，教学内容沿用现有完整章节。

## Surface contract
- 所有 15 章、目录、索引、复习与来源使用统一浅色阅读视觉。
- 目录可收起；正文与实验 / 原始 SKILL.md 编辑器在宽屏并列。原文按主题检查点逐段补入、可暂停跟随、回看保留已展开内容，章末完整显示。
- 正文按阅读顺序排列，实验不阻断正常阅读。
- 曲线、坐标、当前时间和进度读数对应实际数学计算；动效能主动播放与手动检查。
- 封面提供真实实验入口，替换原来的三维装饰。
- 保留现有笔记与进度的 localStorage 格式、键盘操作、减少动态效果与离线导出。
- 1100px 及以下通过“查看 SKILL.md”打开原文对话框，保留跟随状态。手机目录覆盖展开，实验曲线和进度轨道纵向呈现。

## Implementation truth
src/main.jsx、src/Demos.jsx、src/SkillEditor.jsx、src/skillSource.js、src/styles.css。不新增依赖。

## Verification
已有 Playwright 学习流程、全章 1440/390/320px、axe 自动规则；新增目录收起记忆、原文主题联动与暂停、回看保留、15 个原文完整一致性和手机原文对话框检查。新截图见 output/source-editor/。

## 章节补全 · 2026-10-20

其余十四章现含124个递进小节、14份案例表与42道解释性回忆；长章提供默认折叠的主题地图和原文索引。词汇章的91条完整词典按现象/名称与类别检索，英文原句可展开。代码与词典为按需披露，沿用阅读版视觉，不增加强制动效。原文检查点同步更新，少数长段落按已有行分段。测试增至20项，截图见 output/expanded-lessons/，内容对照见 docs/content-expansion-2026-10-20.md。
