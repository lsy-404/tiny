# Progress

- lyric-alignment：新增 lyricSyllables、pairScore、bestLocalAlignment（端点修剪）、alignVoice、alignLyricsToTracks、applyAlignedLyrics；sourceSequence 标可选音；删除 findCandidates/alignCandidates/pastedPhrases/locatePastedLyrics/matchLevel/applyLocatedLyrics/matchHanziLyrics/applyHanziMatch。
- components：LyricEditor 重写；MarkedTextarea（叠层下划线、输入法期间显示原文、自动增高、可选行号）；App 歌词页侧栏加宽，候选与切换条移除。
- i18n：新增 17 个 lyricEditor 文本（四语），移除 35 个无用文本；i18n 测试同步。
- 测试：lyric-alignment 5（乱序分段、多声部、副歌复用、她/他/祂/TA、斜杠异写、续唱与重叠字、拼音写入）；pnpm run test 140 通过；editor 浏览器测试改为新界面；state、score-text、notices、continuous-preview、pdf、formats 通过（dev 服务器）；人立方在 1440/390 宽度实测无页面错误。
- 由 029 会话按用户“合并一下然后跑”提交 cf7decb 并快进 main（af26073 → 6f4b360 → cf7decb）。合并后 pnpm run test 150 项全部通过（含 OSMD 浏览器测试与三份 SVP 样本）；本地 dist 浏览器回归全部通过。Workers Builds 约 50 s 后线上入口 index-BbZdRlXI.js 与本地构建一致；线上 release-check 通过（47 个文件哈希、4 个项目）；state、editor、notices、score-text、continuous-preview、formats（花骨朵、完美友人）、pdf（5 种纸张 + 请不要带我走.svp，0 浏览器错误、0 外部请求）、project-navigation 均通过（ALLOW_CLOUDFLARE_ANALYTICS=1）。
