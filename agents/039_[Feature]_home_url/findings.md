# 039 调研记录

- [现状] 038 用路径规则（/games/ 下显示）控制三个游戏的退出链接；织音机（App.vue、StartupScreen.vue）与 CASSIE（TitleBar.vue、TerminalEntry.vue）的返回链接始终显示且固定 href="/"。CASSIE 另有独立部署（pnpm run deploy 以 / 为 base），链接指向自身。
- [测试] CASSIE test/browser/terminal.spec.ts 断言返回链接可见且 href="/"；织音机测试未引用返回链接；Tiny project-navigation 通过名称含 Tiny Projects 的链接返回首页。
- [机制] 静态游戏没有构建步骤，构建期 env 无法到达，故由 Tiny 构建统一写入 meta，各作品运行时读取。
- [构建检查误报] 最初用 `html.includes('name="home-url"')` 防重复注入，误中甜品屋内联脚本里的选择器与注释文字 → 改为只在 </head> 之前查找 `<meta\s+name="home-url"`。
- [CASSIE 浏览器测试] mobile-webkit 项目需要 Playwright WebKit（webkit-2359），本机未安装；desktop 项目覆盖了改动。
