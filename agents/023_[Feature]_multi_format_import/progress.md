# Progress

- 依赖：pnpm add --save-exact fflate fzstd yaml；-D @xmldom/xmldom。
- 新增 importers/model.js、instruments.js、index.js、svp.js；test/vocal-score/importers/dom.js。
- 派出 5 个并行子任务分别实现解析器（只新增各自文件与测试）。
- 改名脚本更新 i18n、App、index.html、门户 projects.json 与封面标题、README、project.md、导航测试。
- App 导入改为 importProject；ui-messages 增加 Unsupported/Invalid 翻译；i18n 新增导入与致谢文案。
- converter：和弦、谱号、排序、无音高打击乐；analysis 跳过打击乐轨；jianpu 和弦堆叠；converter 测试 28 通过、analysis 13 通过、i18n 5 通过。
- THIRD-PARTY.txt 与 BUNDLED-LICENSES.txt 增加 fflate、fzstd、yaml、UtaFormatix3。
- 子任务完成：ust/ustx/s5p/ppsf（13 测试）、dv/tssln（10 测试，10 万次随机/翻转输入均只产生规范错误）；THIRD-PARTY 增加 LibreSVIP、valuetree-ts 署名。
- 子任务完成：acep/midi/vocaloid-mid/vsq（20 测试；完美友人.acep 解析为 7 轨 294/242/232/253/254/279/25 音符、240 BPM、4/4）。
- 子任务完成：vsqx/vpr/ccs/musicxml(.musicxml/.xml/.mxl)/ufdata（19 测试）。
- 子任务完成：flp（16 测试，6 个真实样本均解析）；导入器测试合计 76 通过。
- flp.js：插件名通道改用播放列表轨道名；测试期望同步更新。
- converter：打击乐声部固定 C 调号；converter 测试 28 通过。App：提示折叠；i18n 新增“还有 {count} 条提示”。
- 构建（含 CASSIE）成功，每种格式独立按需分块；pnpm run test：vocal-score+importers 138 通过、门户测试通过。
- 浏览器：continuous-preview、pdf、score-text（修竞态后）、state、editor、jianpu、storage、formats（含 8 个真实样本）、project-navigation、staff-layout 全部通过。
- README（工具与根目录）更新格式、器乐总谱、致谢与样本验证说明。
- 提交 62f6d3c（feature/vocal-score-refresh，已推送）；--no-ff 合并为 main ae51baf 并推送。Workers Builds: minigames 成功。
- 线上验证（https://tiny.leisiyu.dev/）：页面标题“织音机 · Sound Loom | Tiny Projects”；release-check 通过（47 个文件哈希一致、4 个项目路由）；formats.browser.mjs 在线上导入 8 个真实工程全部通过（ACEP 1.2 s、SVP 0.8 s、FLP 1.3–2.8 s）；project-navigation 与 pdf.browser（5 种纸张 + 真实工程）在线上通过。
