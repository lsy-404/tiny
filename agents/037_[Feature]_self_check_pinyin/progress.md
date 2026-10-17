# 037 操作日志

- lyric-candidates.js：confident、matched、bar/before/after；SelfCheckDialog.vue；App：selfCheckRows、导入后 askSelfCheckFor、applySelfCheck/undoSelfCheck、refreshSuggestions 返回 Promise；LyricEditor：移除“写入”、自校按钮（emit self-check）；移除延长说明及其四语言文案；新增 11 条文案。
- 单元测试 lyric-candidates 增加自校标记用例（12 项通过）；playback.browser 增加导入自动询问、逐字保留、全部采用、撤销、自校按钮。
- 最终构建后浏览器套件全部通过：editor、pdf、playback、state、score-text、storage、notices、continuous-preview、formats、jianpu、render-performance、staff-layout；单元全部通过。
- 提交 cb854e5 推送 main，约 75 s 上线（index-NcpbxCZZ.js）；生产 release-check、playback、editor、score-text、state 通过；线上导入 在我们成为朋友之前.svp 约 1.3 s 自动弹窗 71 处，全部采用后“已补 71 处 · 撤销”。
