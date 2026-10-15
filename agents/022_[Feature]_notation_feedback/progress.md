# Progress

- 建立任务 015，读取 converter.js、jianpu.js、analysis.js 结构与 006 页面几何记录。
- 新增 lib/modulation.js（12 个调号集合、按小节计时的音级外时长、切换惩罚一小节、短于 4 小节的段并入邻段）。
- converter.js：noteValues/beatStarts/spellSpan/beamPieces/pieceXml/tempoMarks 取代 decomposeDuration/noteXml/restXml；createScore 新增 modulation 选项与 keyChanges 输出；每小节按当前调号拼写音名并在变化处写 <key>。
- jianpu.js：解析 <beam>，按连杠绘制连续减时线，钩保持短线。
- App.vue：settings 新增 modulation(默认开)、margin(默认 10)；转调摘要；页边距输入；margin 传给简谱排版、文字定位、预览与 PDF。pdf.js createPdf 接受 margin；score-text.js collectScoreTextTargets 接受 margin。
- i18n：识别转调 / 第 {measure} 小节转为 {key} / 页边距 (mm) 四语。
- 测试：converter.test.js 新增连杠、附点/切分、6/8、渐变速、转调用例并更新休止符断言；staff-layout 服务器白名单加入 modulation.js。
- 合并 origin/main（9ab426e）：保留上游返回主菜单链接（桌面带文字、手机仅箭头）、标题与 CASSIE 构建；release-check 改为 1 个 PDF worker。
- 验证：pnpm run build（含 CASSIE）成功；pnpm run test 全部通过（vocal-score 61 通过）；浏览器 continuous-preview、pdf、score-text、state、editor、jianpu、storage、project-navigation、staff-layout 通过。
