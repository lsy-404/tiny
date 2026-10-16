# Progress

- storage.js 新增 upgradeSettings；App 加载时套用；test/vocal-score/storage.test.js（4 个断言）。pnpm 单元测试 152 通过；本地 dist 模拟旧工程重载：noteMerge auto、预设流行旋律谱、无 ou、39 个续唱音并入前一字；截图核对流行旋律谱与合唱谱（11 个音一条连线）。state、storage、editor、score-text、pdf 浏览器测试通过。
- 提交 e0ae223 并快进 main；约 50 s 后线上入口 index-Exg-x51o.js 与本地一致。线上 release-check 通过（47 个文件哈希）、state 与 editor 通过；线上模拟旧工程重载：自动、无 ou、39 个续唱音并入前一字。
