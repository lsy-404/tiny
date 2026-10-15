# Findings

- 基准（本分支改动前，本机 Chrome headless，1440×1080，请不要带我走.svp）：导入 1718/1737ms、标题 1535/1539ms、页眉 1662/1705ms、纸张 1616/1647ms；8 页，527 个 SVG 文本。
- 标题修改不重排谱面（engravingKey 不变）仍需约 1.5s：耗时几乎全部在预览链路 SVG → PNG(144DPI) → jsPDF → PDF.js 解析 → canvas 重绘，每次修改全量 8 页。
- 端口 4190 被其它检出的 test/vocal-score/server.js 占用 -> 在该端口跑出的数字不属于本分支构建 -> 改用 PORT=4291 自启服务器重测。
- 预览直接显示 SVG 时，按 PDF 相同几何（10mm 页边、等比缩放、水平居中、顶部对齐）放置，score-text 的 pdfTextRectangle 比例坐标可原样复用，且与下载 PDF 一致。
- 改后（同机同文件，两次）：导入 724/778ms、标题 275/285ms、页眉 260/277ms、纸张 465/530ms。剩余主要耗时为 OSMD 排版（纸张变化必须重排）与 100ms 防抖。
- 五线谱排版键原含标题/页眉/署名布尔值，首次填写页眉会无谓重排（约 450ms）；这些只影响 decoratePages 的页面装饰，已仅在简谱排版键中保留。
- Fluent 通用按钮样式给无 fluent- 类的按钮加 box-shadow，导致侧栏导航分隔线和谱面文字覆盖按钮出现下划线 -> 显式 box-shadow:none。
- 移除 PDF.js 后构建产物少了 PdfViewer 块（约 437KB）与 pdf.worker.min（约 1.26MB）。
- 浏览器回归（PORT=4291）：continuous-preview、pdf（5 种纸张与真实工程）、score-text、state、editor、jianpu、storage 全部通过；staff-layout 在提供 PLAYWRIGHT_MODULE 时通过。`pnpm check`：54 通过、1 跳过（缺 Playwright 时的 staff-layout）。
