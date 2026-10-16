# Progress

- 读取 agents/project.md、local.instructions.md、tasks.md；028 仍在进行（LyricEditor/MarkedTextarea/lyric-alignment/layout.css/App.vue 有未提交改动），本任务不改这些歌词文件。
- scratchpad inspect.mjs / tuning.mjs 分析两份本地 SVP：声部小节范围、重叠矩阵、现有合并结果、调校参数分布与 systemPitchDelta。
- 用户澄清：自动音高仅作参考；声库显示在声部名后并在换声库处标注；跨声库合并为开关，默认仅同一声库。
- importers/model.js：singerName、mostCommonSinger，createProject 透传 track/note singer；emptyTuning、emptyTuningSummary 增加自动音高字段。USTX singer、S5P dbName、UST VoiceDir、VPR voices/compID、VSQX vVoiceTable bs/pc、DV 段声库。
- converter.js：curvePoints（平铺/成对）、pitchCurve、representativeCents（二分）；parseSvp 读取组声库与 systemPitchDelta（autoCurve*，tuningSummary.autoPitchCurves/Points）；调校提示按声部汇总；isVocal、splitPhrases、sameSingers、chooseMergeTarget（TODO(human)）、新 mergeDisjointNotes（整轨选目标、整句搬移、kept）；人声共享三连音拍；roles 仅人声；model.tracks.singer/singerChanges；pitchAdjustments.auto 与 notes[].autoCents；删除 mergeUnits。
- annotations.js：singerPartLabels、annotateSingers；staff.js tagPartNames 接受 partLabels；App.vue：mergeAcrossSingers/showSingers 设置、合并说明、整理明细 kept、声部列表声库、调校页自动音高行与列；导入默认 merge 恒为 true。
- i18n.js 三语新增 7 条；svp.warning.residual 改为 {count}；ui-messages 新模式；测试：converter（+6，改 3）、annotations.test.js（2）、六个导入器声库断言、ui-messages 2 处。
- 临时零重叠规则下：pnpm 测试（含两份样本）147 通过；浏览器（vite 5175，合成 SVP）：4→3 谱表、副歌并入主歌、和声完整、Saki 默认不并；开启后 4→2，声部名“主歌（Mai）”，第 9 小节上方“Saki”，五线谱/简谱声部名可点击编辑；+130¢ 手动曲线 E4→F4，剩余音分提示一条；自动音高参考行显示。随后恢复 TODO(human)：合并相关 9 个测试待规则实现。
- 新增 .claude/launch.json（vocal-score 开发服务器）。
- 用户要求直接完成合并并部署：chooseMergeTarget(candidates, tolerance)；候选改报 blockedShare；createScore mergeOverlap（0–0.5，默认 0.05）；App 声部整理新增“允许重叠”（不允许 / 2% / 5% / 10% / 20%，旧文档回落 5%）；三语 3 条；新测试 tunable overlap。pnpm 测试（含两份样本）148 通过；浏览器确认选项与默认值。README 更新合并、声库、自动音高说明。记忆与 local.instructions 记录“无 PR 直接合并 main 并立即部署”。
