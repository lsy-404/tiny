# Progress

- lyric-alignment：新增 lyricSyllables、pairScore、bestLocalAlignment（端点修剪）、alignVoice、alignLyricsToTracks、applyAlignedLyrics；sourceSequence 标可选音；删除 findCandidates/alignCandidates/pastedPhrases/locatePastedLyrics/matchLevel/applyLocatedLyrics/matchHanziLyrics/applyHanziMatch。
- components：LyricEditor 重写；MarkedTextarea（叠层下划线、输入法期间显示原文、自动增高、可选行号）；App 歌词页侧栏加宽，候选与切换条移除。
- i18n：新增 17 个 lyricEditor 文本（四语），移除 35 个无用文本；i18n 测试同步。
- 测试：lyric-alignment 5（乱序分段、多声部、副歌复用、她/他/祂/TA、斜杠异写、续唱与重叠字、拼音写入）；pnpm run test 140 通过；editor 浏览器测试改为新界面；state、score-text、notices、continuous-preview、pdf、formats 通过（dev 服务器）；人立方在 1440/390 宽度实测无页面错误。
