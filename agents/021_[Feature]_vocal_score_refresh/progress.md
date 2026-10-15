# Progress

- 克隆 lsy-404/tiny 到 F:\Development\lsy-404@tiny，读取 agents/project.md、tasks.md、local.instructions.md 与 008 性能记录。
- `corepack pnpm@10.34.6 install --frozen-lockfile`、`pnpm run build` 成功。
- `PORT=4291 node test/vocal-score/server.js`；`render-performance.browser.mjs`（PLAYWRIGHT_MODULE 指向 npx 缓存的 playwright，SVP_SAMPLE_FILES=请不要带我走.svp）两次：见 findings 基准。
- `git switch -c feature/vocal-score-refresh`，建立任务目录 014。
- 新增 `apps/vocal-score/src/assets/logo.svg`（蓝色圆角方块、发声音符与淡五线）；index.html favicon 与顶栏、空白状态共用；删除 `public/favicon.svg`。
- 新增 `components/ScoreViewer.vue`：按纸张比例放置排版 SVG 副本（10mm 页边、xMidYMin meet，与 PDF 几何一致），连续滚动、页码跳转、缩放、远处页面释放副本；删除 `PdfViewer.vue`。
- App.vue：预览不再生成 PDF，`createPdf` 仅在下载时以 220DPI 调用；同一文档重排时保留旧预览；五线谱排版键去掉只影响页眉装饰的标题/页眉/署名开关。
- App.vue 模板：顶栏仅 logo+名称+主题+语言；侧栏去掉简介、导入副提示、存储长提示、设置/字体/合并/分析/微调说明段；主区单行工具栏（标题+元信息+下载 PDF/MusicXML/SVG），记谱切换与排版状态并入预览工具栏；空白状态为带 logo 的导入区。
- layout.css 重写为单层可读样式（移除 .paper/PDF 遗留与打印规则），主区填满视口高度；修复 Fluent 默认按钮阴影导致的导航分隔线与谱面文字下划线。
- `pnpm remove pdfjs-dist`（同时移除可选依赖 @napi-rs/canvas）；删除 PDFJS-LICENSE.txt，更新 THIRD-PARTY.txt 与 BUNDLED-LICENSES.txt。
- i18n：删除 25 条不再使用的文案；新增 导出 SVG / 缩放 / 单独的 - 表示延长前一个字。/ 文件和设置保存在当前浏览器（原缺译）；`node --test test/vocal-score/i18n.test.js` 5/5 通过。
- 测试迁移：.pdf-viewer → .score-viewer，canvas 渲染标记 → .score-viewer__sheet[data-rendered]；continuous-pdf.browser.mjs 改名 continuous-preview.browser.mjs；state 测试的语言标题改读 .brand span。
- 改后基准（同机同文件）：导入 614/735ms、标题 267/271ms、页眉 424/486ms、纸张 453/459ms；去掉五线谱多余重排后：导入 724/778ms、标题 275/285ms、页眉 260/277ms、纸张 465/530ms。
- 文档：更新 apps/vocal-score/README.md、根 README.md、agents/project.md 中关于 PDF.js 预览的描述；tasks.md 014 标记完成。
- App.vue：预览纸张取自已完成排版的结果（rendered.paper），避免改纸张时旧页面短暂套用新纸张比例；重建后 pdf、score-text、continuous-preview 浏览器回归通过。
