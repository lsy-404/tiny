# Progress

- App：sidebar-backdrop、showNotices、warningGroups/noticeText、#message 仅显示错误；layout.css 遮罩、提示面板与按钮样式；ui-messages groupWarnings（整体在前，按声部顺序，长名优先，兼容 Track 前缀）。
- lyric-alignment：pastedPhrases 记录偏移、via、matchLevel（TODO(human)）；LyricEditor：叠层下划线、图例、光标联动、跳过、逐字旧→新、changeCount。
- i18n：转换提示、整体、条提示、置信度、替换 {count} 个音符等四语；移除“还有 {count} 条提示”“lyricEditor.notFound”。
- 测试：lyric-alignment 13（新增偏移与 via）；pnpm run test 145 通过；新增 notices.browser.mjs；editor.browser 新增下划线、跳过与双向选择断言；全部浏览器测试通过。
- matchLevel 由用户要求直接完成后实现（用户未填写 TODO）；lyric-alignment 14 个测试（新增分级用例）；pnpm run test 149 通过（含三个 SVP 样本）；editor、notices、state、score-text 浏览器测试通过；完美友人实测：完全匹配、高置信（八字一处错字）、谱中未找到。
- 线上验证（tiny.leisiyu.dev，main a6da9d4，Workers Builds minigames 成功，入口 index-BHgbLLwN.js 与本地一致）：release-check 通过（47 个文件哈希）；project-navigation、editor、formats、continuous-preview、score-text、notices 通过；state（ALLOW_CLOUDFLARE_ANALYTICS=1）通过；完美友人手机宽度：完全匹配、高置信、谱中未找到三级显示，按钮“替换 1 个音符”，无页面错误。
