# Progress

- App.vue defaults melisma both + styleVersion 2、流行旋律谱预设；storage.upgradeSettings 迁移旧流行旋律谱；converter 终止线与 slur placement above；jianpu 终止线；staff.js keepLyricRows；App 文件上限与 Blob 引用；i18n 文件上限文本带 {size}。测试：storage.test +1、converter 终止线、staff-rows.test.js；pnpm run test 159 通过（Playwright + 三份样本）；本地 dist 全部浏览器测试通过；合成五声部工程截图：终止线、连线在上、续行延长线在音符下方不压下一行。
