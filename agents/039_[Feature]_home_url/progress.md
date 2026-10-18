# 039 操作日志

- 建立任务。
- Tiny：tiny.env（HOME_URL=/）；package.json build 用 `node --env-file=tiny.env scripts/build.mjs`；build.mjs 在每个作品 dist index.html 的 </head> 前写入 `<meta name="home-url" content="/">`，未设置时不写并在日志说明；build-output 校验五个页面都带 tiny.env 的值。
- cassandri-legend 204dbe9、10lightyears 1789247、honeypot-dessert 66b3020：读 meta 设置退出链接 href，无 meta 时加 html.standalone（隐藏）并去 Tiny 标题后缀。cassandri standalone-exit 测试改为 meta 约定，29/29。
- vocal-score 391c704：src/lib/home-url.js；App.vue 与 StartupScreen.vue `v-if="homeUrl" :href="homeUrl"`；顶栏 auto 外边距从 .main-menu-link 移到 #theme-button，有无链接右侧控件位置一致（右缘 1150/1280）；test/home-url.test.js，174 通过 2 跳过。
- CASSIE 8d08f09：src/home-url.ts；TitleBar 与 TerminalEntry 同样处理；README 说明；vitest 226/226，vue-tsc 通过；terminal.spec 新增有/无 meta 用例（page.route 改写 HTML），desktop 86 通过；mobile-webkit 8 个因本机未安装 WebKit（Executable doesn't exist）在启动浏览器时失败，与改动无关，未下载安装。
- 浏览器核对（scratchpad/home-url-check.mjs，/with/ 注入 meta、/without/ 不注入）：三个游戏与织音机有 meta 时显示并指向 /menu/，无 meta 时隐藏且游戏标题去后缀，均无页面错误。
- Tiny 指针：cassie 8d08f09、vocal-score 391c704、cassandri 204dbe9、ten-light-years 1789247、honeypot 66b3020；build 通过、pnpm test 退出 0、五个页面各有 1 个 meta、导航浏览器测试通过；不设 HOME_URL 构建时实际 meta 为 0。
