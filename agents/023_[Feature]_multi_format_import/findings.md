# Findings

- UtaFormatix3 输入格式：vsqx(3/4)、vpr、vsq、mid(VOCALOID)、mid(standard)、ust、ustx、ccs、xml/musicxml、svp、s5p、dv、ppsf(NT)、tssln、ufdata；core/io 中无 ACEP。许可 Apache-2.0（LICENSE.md 为简短声明，全文已随 dompurify 收录于 BUNDLED-LICENSES）。
- 完美友人.acep：JSON {compressMethod:"zstd", content(base64), salt, version:1000}；content 解压后为明文 JSON（ACE Studio 1.9.12），7 条 sing 轨，480 tick/四分音符，tempos 与 timeSignatures(barPos)。
- Node 无 DOMParser：XML 导入器只用 DOM Level 2 接口，测试经 test/vocal-score/importers/dom.js 注入 @xmldom/xmldom。
- 器乐工程若沿用“合并分散独唱”会把下方声部并到上方，破坏总谱；converter 对含 instrument 的工程强制不合并。
- 简谱 parseMeasure 原先把 <chord/> 音符放在前一音符结束处（cursor 已前进），现改为与前一音符同一时刻并纵向堆叠。
- FLP（6 个样本，FL 24.1–25.1.6，PPQ 96）：全部解析；17/15/15/19/17/16 个有音符通道，3514–8044 音符，77–225 小节。播放列表记录 60 字节（FL 21–24）、80 字节（FL 25.1.6）；片段起始偏移以 tick 存储（-1 表示未裁剪）；轨道索引为 500−index；模式循环长度按“自动长度”取整到小节。
- FLP 通道多以插件命名（Infiniti Player #3、LABS #2），改用占多数音符的播放列表轨道名（pad1、大提琴、harp1）作为谱表名，重名时附原名；乐器识别依次用通道名、轨道名、插件名。
- 浏览器实测（本机 Chrome headless，1440×1000）：完美友人.acep 7 声部 1579 音符约 1.0 s/43 页；人立方 SVP 0.7 s/24 页；FLP 1.3–2.9 s/32–67 页，无页面错误。
- formats.browser.mjs 首轮 ACEP 测得 31 s 是测试自身问题：断言消息模板里 `await #message.textContent()` 在无提示时等满 30 s 超时；改为仅在出错时读取。
- OSMD 忽略 <key print-object="no">，打击乐谱表仍显示调号；改为打击乐声部只写 fifths 0 且不随转调变化。
- 器乐工程每个声部都有“节奏网格调整”“重叠音符”提示，提示框过长；改为显示前两条，其余折叠为“还有 N 条提示”。
- score-text.browser.mjs 换文档后立即断言编辑框关闭存在竞态（导入器按需加载后切换稍晚）；改为先等新文档成为当前文档。
- 未复现的反馈：手机“点不进去”（模拟 Pixel 7、iPhone 13 正常）；汉字匹配拼音“没匹配上”缺样例。
