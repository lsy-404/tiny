# Findings

- converter.js 不写 <beam>，OSMD 因此对每个八分/十六分音符单独画符尾；decomposeDuration 只按时长贪心拆分、不看拍位，附点与切分节奏跨拍时可读性差。
- 调号只在第 1 小节写一次（createScore 的单一 fifths），转调后全部用临时记号表示。
- jianpu.js 从同一 MusicXML 读取，已支持小节内 <key> 变化（1=X 标记、按新主音计算唱名）；减时线目前每个音符各画一段。
- 人立方_调校工程.svp：6 个速度点，含 215.99/216.00、288.99/289.00 这类紧邻成对点（SV 的阶跃写法）；单一 4/4 拍号；6 个人声轨（431/225/139/22/14/13 音符）。截图中的整页速度来自另一工程的密集渐变点（133→132.53…）。
- 人立方转调核对：第 1–108 小节音级同时符合 3♯ 与 2♯（G 与 G♯ 都出现），第 109 小节起只含 C D E♭ F G B♭（117 小节有 A♭），符合 3♭（c 小调）；即 b 小调升半音到 c 小调，与群聊描述一致。检测结果：第 109 小节 3♯→3♭。
- 切分写法：严格按拍拆分会把 ♪♩♪ 写成 ♪♪⁀♪♪，可读性差；改为半小节内离拍四分音符保持完整，跨半小节或十六分错位时才拆分加连音线（与用户参考图一致）。
- 渐变速：合成 60 点渐变（133→118）预览只显示 rit. 与 ♩=118；4/4→6/8 拍号变化能写出并按附点四分连杠。
- 手机：Playwright 模拟 Pixel 7、iPhone 13 打开线上门户并点进声谱，页面正常加载、无报错；未复现“点不进去”，需要对方的浏览器信息。线上域名已从 mini 跳转到 tiny.leisiyu.dev。
- 汉字匹配拼音“没匹配上”缺少失败样例，未改动。
- origin/main 期间新增 20 余提交（Tiny Projects 品牌、CASSIE、声谱“返回主菜单”）；以 stash → fast-forward → stash pop 合并，冲突在 README、tasks.md、index.html、App.vue、layout.css、i18n.js；任务编号与上游 014–020 冲突，本分支任务改为 021、022。
- 全局 gitignore 排除 /test/ 与 /agents/，新测试文件 continuous-preview.browser.mjs 与审计目录提交时需 git add -f。
- release-check.mjs 用本地 test/vocal-score/server.js 跑时 projects.json MIME 为 octet-stream 而失败（服务器未映射 .json），与本次改动无关；PDF worker 数量断言改为 1 并已核对构建产物。
