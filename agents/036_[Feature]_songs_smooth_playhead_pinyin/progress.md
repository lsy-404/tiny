# 036 操作日志

- 建立任务目录与计划；用户选择“歌曲独立，可挂到多个工程”。
- playback.js：playbackRows（按行拼接、单调三次切线）、playheadAt 改为按行；player.js：heard()/position() 不回退；PlayheadLine.vue；ScoreViewer 插槽传页面像素尺寸；layout.css .playhead 改 transform。
- storage.js：audio 存储改为独立歌曲（loadSongs/saveSong/deleteSong），删除工程不再删音频。
- use-playback.js：按 settings.songId 取歌曲，attach/detach，按歌曲 id 解码；App.vue：歌曲区、addSong/attachNewSong/toggleSongAttach/removeSong、导入音频（工程优先，同名挂接）、旧版按工程 id 的音频自动挂回、songId 不触发重排；PlaybackBar：⏏ 解除挂接、挂接已有歌曲下拉。
- lyric-candidates.js（同时/前后文/词语/同音字，together）、lyric-alignment.worker.js 与 lyric-worker.js（suggestLyrics，最新请求覆盖旧请求，无 worker 时主线程）；ScoreTextOverlay 候选弹框、整声部填入；App refreshSuggestions、editScoreText(also)、fillFromOtherParts。
- i18n 18 条（英日韩）+ 测试参数 word/snippet/reading。
- 单元：lyric-candidates.test.js（6 项）、playback.test.js（平滑、跨小节线连续）；共 173 项（171 通过、2 跳过）。playback.browser.mjs 扩展：歌曲挂接/解除/多工程/删除/同名导入、拼音候选弹框与整声部填入 —— PASS。
- 浏览器套件全部通过：state、editor、notices、score-text、continuous-preview、formats、pdf、storage、jianpu、render-performance、staff-layout、playback。
- 提交 a612811 推送 main；约 60 s 上线（index-DP4oFDeA.js）。生产：release-check passed；playback、state、editor、score-text、storage、pdf 全部 PASS；旧版按工程 id 保存的音频在生产上自动挂回（迁移验证 PASS）。
