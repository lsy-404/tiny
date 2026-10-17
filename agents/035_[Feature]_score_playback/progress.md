# 035 操作日志

- 建立任务目录与计划。
- 新增 src/lib/playback.js（速度图、播放音符、小节标记写入/收集、光标定位、点击取时）、piano.js（钢琴合成）、piano.worker.js、player.js（Web Audio 播放器）。
- staff.js：markBars 用 VexFlow stave 的 getX/getWidth/getYForLine 与音头位置写每小节标记。
- jianpu.js：每小节写标记（x0..x0+宽，yTop+22..yBottom，各起音位置）。
- storage.js：数据库版本 2，新增 audio 存储；deleteDocument 同时删音频；saveAudio/loadAudio/deleteAudio。
- use-playback.js（组合式状态）、PlaybackBar.vue（走带栏）、ScoreViewer（footer 插槽、pick 点击、reveal 跟随）、App.vue 接线、layout.css .playhead；SVG 导出去掉 .playback-mark；播放设置不触发重排。
- i18n：20 条新文案（英日韩），i18n.test.js 键列表。
- test/vocal-score/playback.test.js（9 项）与 playback.browser.mjs；单元 166 项（164 通过、2 跳过、0 失败）；pnpm run build 通过；playback.browser PASS。
- 截图：五线谱第 3 小节光标贯穿三声部；简谱第 74 小节；手机宽度走带栏换行；深色主题。
- jianpu/staff-layout 浏览器夹具服务器未提供 playback.js -> 加路由后通过（jianpu PASS；staff-layout 1/1）。
- 浏览器套件全部通过：state、editor、notices、score-text、continuous-preview、formats、pdf（五种纸张）、storage、jianpu、render-performance、playback。
