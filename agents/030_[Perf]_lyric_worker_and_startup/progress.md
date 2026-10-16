# Progress

- 采样脚本 scratchpad/profile-lyrics.mjs（Playwright 1.60 npx 缓存 + CDP Profiler，dist 由 test/vocal-score/server.js 4291 端口提供）；align-bench.mjs 测 Node 中匹配耗时。
- App.vue：工程深度监听改为默认 pre 刷新；启动改为 prepare()（并行、10 s 可先进入）：制谱引擎、字体、歌词编辑器分块、歌词匹配 Worker、PDF Worker；restoreDocuments() 在启动画面后恢复并排版。新增 lib/lyric-alignment.worker.js、lib/lyric-worker.js（共享 Worker、合并排队、失败后不再重启并回退页面、applyAlignedLyrics 移入以免页面加载拼音词典）；LyricEditor 改为异步结果 + 歌词指纹；pdf.worker ping 与 warmPdfWorker；四语新增 5 条、删除 5 条旧启动文本；README 更新。
- 测试：pnpm run test 151 通过（Playwright + 三份样本，0 跳过）；本地 dist 浏览器 state、editor、notices、score-text、continuous-preview、formats、jianpu、storage、pdf（请不要带我走）、project-navigation 全部通过；startup-check 五步全部 ✓。
