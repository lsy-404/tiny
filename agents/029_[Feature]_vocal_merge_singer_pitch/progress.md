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
- 提交 a1b8811（仅本任务；App.vue、i18n.js、README.md、tasks.md 暂存“HEAD + 本任务改动”，028 改动留在工作区）。干净工作树（git worktree，pnpm install --frozen-lockfile）：pnpm run build 通过，入口 index-AX1YoPIk.js；pnpm run test 退出 0（vocal-score 158 项：157 通过、1 项因该工作树无 Playwright 跳过，含两份 SVP 样本）。
- main 快进 28f0771 → a1b8811 并推送 main 与 feature/vocal-score-refresh；Workers Builds 部署后 tiny.leisiyu.dev/projects/vocal-score/ 入口为 index-AX1YoPIk.js（推送后约 10 s 可见），与本地干净构建一致。
- 线上（内置浏览器，合成 SVP）：默认 4→3 谱表、副歌并入主歌、和声完整、Saki 不并、允许重叠默认 5%、声部列表显示声库；开启跨声库与显示演唱者后 4→2，声部名“主歌（Mai）”“和声（Mai）”，谱面一处“Saki”；调校页 +130¢ 手动曲线 E4→F4，自动音高 −180¢ 仅作参考（不修正），剩余音分提示一条。无错误提示。
- 未运行：release-check（main 工作区的 dist 含 028 未提交改动，与线上不对应，改以入口哈希一致核对）；Playwright 浏览器测试套件。
- 用户“合并一下然后跑”：合并 028 后 OSMD 浏览器测试与 state 失败（见 findings），修正为 6f4b360；028 提交 cf7decb；pnpm run test 150/150（含 Playwright 与三份样本）；本地 dist 全部浏览器测试通过；推送 main 后线上 index-BbZdRlXI.js 与本地一致；线上 release-check 通过（47 个文件哈希、4 个项目）；state、editor、notices、score-text、continuous-preview、formats（花骨朵、完美友人）、pdf（5 种纸张 + 请不要带我走.svp，0 浏览器错误、0 外部请求）、project-navigation 均通过（ALLOW_CLOUDFLARE_ANALYTICS=1）。
