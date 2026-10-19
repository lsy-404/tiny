# 040 操作日志

- 建立任务。
- 新版移植：scratchpad/port-honeypot.mjs（逐处断言唯一匹配）生成子模块 index.html（3672 行，LF）：标题“蜜罐甜品屋 | Tiny Projects”+图标；去掉 .cheat-* 样式、夜间作弊器样式、选项菜单“测试修改器”、cheatModal、F1 绑定与修改器代码；顶栏末尾加退出链接，确认改用游戏自带 showConfirm；末尾加 home-url 读取。
- `node --env-file=tiny.env scripts/build.mjs` 只复制到 dist（未重建 CASSIE/织音机），甜品屋页面 meta 1 个。
- 修复（子模块 index.html）：.game-main 高度 calc(100vh - 220px)/min 650 → calc(100vh - 314px)/min 400；删除商店 shop-section-note 段落；教程第 1 步“左上角”→“上方的”；教程框宽 280→320（CSS 与 tutorialNext 的 boxW）。重新复制 dist。
- 复查：1920×940/1280×860/1100×800 页面高度等于视口；1366×657 页面 714（最小高度 400），餐桌 427..557 在首屏内；教程框 380px 下逐行测量仅第 7、10 步自然折行（末行 4/8 字）；第 6 步框在 1100 宽时 708..1088 不越界；商店无 shop-section-note；退出确认用 showConfirm，“确定”后到 /；独立副本（无 meta）退出隐藏、标题无后缀、无页面错误。
- 退出确认文案加 <br> 分两行（原先“丢/失。”折行）；教程首步再缩为“点击上方「开始营业」开启第一天吧~”避免“~”单独成行。
- 布置第 6 天场景（scratchpad/honeypot-cover.mjs，已复制到本任务目录）发现绿植 10..505px 起排、与新版左上角“用餐区”标题重叠 → .deco-plant { margin-left:86px }；重拍 assets/preview.png（1360×1360，裁剪 232,262,680,680，服务员放在第 1、2 列走道）。projects.json 与 portal-game-cover 测试的 coverAlt 改为“蜜罐甜品屋营业中的用餐区”。
- build-output 增加断言：甜品屋页面不得含“只展示下一次升级带来的变化”。子模块 README 更新托管改动与版本说明。
- honeypot-dessert ef3f424（SSH 签名验证 G）推送 origin/main（66b3020..ef3f424）；子模块本地 main 先 `checkout -B main origin/main` 再提交。
- 首次 pnpm run check 前未暂存指针，子模块被检出回 66b3020 → 停止；重新检出 main（ef3f424）、`git add games/honeypot-dessert`，重跑 check。
- pnpm run check 退出 0：构建 5 个入口 1105 个文件；门户 6 项检查、卡桑德里 29/29、织音机 174 通过 2 跳过；dist 甜品屋不含泄露文字。导航浏览器测试（4191 预览）1280/390 通过。
