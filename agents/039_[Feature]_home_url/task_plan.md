# 039 [Feature] 统一 HOME_URL：未设置不显示返回

用户：“我们直接在统一定义一个home url env，不设置不显示返回”。

## 约定
- Tiny 在 `tiny.env` 定义一次 `HOME_URL=/`（环境变量优先，Workers Builds 可覆盖）；scripts/build.mjs 把它写入每个作品页面 `<meta name="home-url" content="…">`。
- 每个作品读取 `meta[name="home-url"]`：有 → 返回链接指向它；无 → 不显示返回链接（游戏同时去掉标题里的 “| Tiny Projects”）。取代 038 的 `/games/` 路径规则。

## 步骤
- [x] Tiny：tiny.env、build 注入、build-output 测试、README/project.md
- [x] cassandri-legend：game.js 读 meta，更新 standalone-exit 测试
- [x] 10lightyears：main.js 读 meta，README
- [x] honeypot-dessert：读 meta 控制顶栏“退出游戏”，README
- [x] vocal-score：App.vue 与 StartupScreen.vue 的返回链接按 meta 显示，测试
- [x] CASSIE：TitleBar 与 TerminalEntry 的返回链接按 meta 显示，单元/浏览器测试
- [x] 各仓库签名提交推送；Tiny 更新子模块指针；构建、测试、浏览器验证（有/无 meta 两种）
- [x] 合并 main、部署、生产验证
