# Progress

- 新增 StartupScreen.vue 与 App 启动检查；inert/aria-hidden。
- lyric-alignment：SILENT、音素通配、sourceSequence（跳过续唱韵母）、normalizePinyin 拼写归一、alignCandidates；LyricEditor 显示近似与无音符；i18n。
- converter：separateSnapped、preserveOrder、调校警告受开关控制；analysis：调外音扣分。
- App：useTuning 开关两处、声部列表拖动/上下/改名、导入时器乐排序；ui-messages 与 i18n 新增 svp.warning.snapped 等。
- 测试：converter 34（含三个 SVP 样本）、lyric-alignment 12、analysis 13、i18n 5；pnpm run test 147 通过；浏览器 continuous-preview、pdf、score-text、state、editor、jianpu、storage、formats、project-navigation、staff-layout 全部通过；实测花骨朵 C 大调、改名与拖动排序生效、调校开关默认关。
- 已随 026 一并发布到 main（78be8df）并完成线上验证。
