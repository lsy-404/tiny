# Findings

- [现有合并] mergeDisjointNotes 逐个“单元”（音符 + 延长音）塞进最早的无重叠声部 -> 人立方_调校工程.svp（V3-1…V5-2 六轨，声库均为 Stardust Minus）实测 211 个和声音符被分散并入 V3-1/V4-1/V5-1；花骨朵_尘only.svp 的 chords（与 main 重叠 0.89）也有 8 个音符并入 main -> 结论：应先按整轨决定是否接续某一声部，再整句搬移，和声轨不拆。
- [现有合并] 任一所选声部带 instrument 时整体关闭合并 -> 混合工程（MusicXML 人声 + 伴奏）中人声也无法合并 -> 改为仅人声轨（无 instrument）参与。
- [三连音] 非器乐时三连音拍按全部声部共享，器乐按声部；混合工程若仍按声部，搬移后的音符会落在目标声部不认识的三连音网格上 -> 人声轨之间共享，器乐轨各自计算。
- [音高曲线] 真实 SVP 的 parameters.pitchDelta.points 为平铺数组 [blick, cents, blick, cents, …]（花骨朵 main 336 点、人立方 V5-1 3 点）；groupPitchCurve 只接受 [[blick, cents]] -> 真实工程的手动曲线从未参与修正，pointCount 还按元素数翻倍 -> 两种写法都接受，按点数计数。
- [自动音高] SV2 在引用上保存 systemPitchDelta（mode cubic，points 平铺，时间为组内 blick，与音符同一坐标；主组即绝对时间）。人立方各轨 5–17k 个值、峰值 ±500–1000 音分（音符过渡处的滑音）。用户选择“仅作参考”：读取并在调校页显示，不改音符。
- [调校提示] “remaining X cent …” 每个不同的剩余音分各一条，读到手动曲线后会刷屏 -> 每个声部汇总一条。
- [声库] SVP：mainRef.database.name 与 groups[].database.name（空字符串表示沿用主声库）。ACEP：tracks[].singers[].singer.name 为空，仅有数字 id -> 不显示。
- [浏览器] 关闭“显示演唱者”时 App 传入 partLabels=null，tagPartNames 的默认参数 [] 只对 undefined 生效 -> 报 “Cannot read properties of null (reading '0')” -> 改为 partLabels?.[index]。
- [测试 DOM] xmldom 没有 querySelector / append -> annotateSingers 与 wordsDirection 改用 DOM Level 2（childNodes、appendChild），与导入器约定一致。
- [时值] model 的 offset 以 divisions 计（十六分网格每四分音符 16），不是每拍 4。
- [样本，临时零重叠规则] 人立方：0 个音符被搬移（原 211 个和声音符被拆散）；花骨朵：仅 Ahu~ → main 14 个，chords 保持完整；main 声库 MEDIUM5·Stardust、chords 声库 MEDIUM5·Shian。花骨朵手动曲线生效后修正 2 个音符；解析 20 ms（自动音高 1.6 万–3 万点，二分采样）。
- [合并规则] 允许重叠 t：同时发声占来源时长 ≤ t，且因重叠留下的音符 ≤ 2t（部分重叠的乐句整句留下，超过则一条旋律会被拆在两个谱表）；候选按同时发声最少、同一声库、音区相近、位置靠上排序。默认 5% 下人立方 0 搬移、花骨朵仅 Ahu~ → main 14；花骨朵 chords 对 Ahu~ 约 5% 的陷阱因 Ahu~ 先并入 main 而不出现。
- [交付] main 无分支保护（gh api 404 Branch not protected）；Workers Builds 从 main 构建 minigames。028 会话的未提交改动与本任务共用 App.vue、i18n.js、README.md、tasks.md -> 暂存区写入“HEAD + 本任务改动”，工作区保持原样。
- [浏览器测试] staff-layout.browser-server.cjs 按白名单提供文件；converter.js 新增 import importers/model.js 后未在白名单 -> 页面模块加载失败、等待 PASS 超时 30 s -> 加入路由。此前干净工作树无 Playwright 而跳过该测试，未暴露。
- [浏览器测试] state.browser 以 #merge-setting 内唯一复选框为合并开关；“允许合并不同声库”放进同一容器导致严格模式匹配 2 个 -> 移到 #merge-singers-setting。
- [浏览器测试] pdf.browser 的样本段固定期望 573 音符 / 102 小节 / 调号 2，即 F:/OneDrive/Files/SV/请不要带我走.svp；传入其他样本会等待超时。Playwright 取 npx 缓存 9833c18b2d85bc59（1.60）。
