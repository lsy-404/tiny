# 043 调研记录

- [清单] scratchpad/symbol-inventory.mjs：64 个 emoji（餐品 21 种、客人 17、事件 14、绿植 10、爱心 ❤️🤍、清洁工 🧹、头像回退 🧑，部分重复）；→ 16 处（UPGRADE_DATA 名称/说明 6 行、教程第 10 步 5 处）；✓ 在订单条 order-check；★ 在图鉴 starHtml（实心与 .empty 空心同字符）。
- [方案选择] 在托管层用 MutationObserver 统一把 emoji 文本换成图片，而不是逐个改作者的渲染点：游戏 15+ 处渲染都覆盖到，作者将来的新版本只需带上这一段；代码中不读回含 emoji 的文本（已 grep），图片 pointer-events:none 保证点击仍落在原元素上。
- [字形间距] 图片没有字体字形的左右留白，5 颗爱心会贴在一起 → img.emoji 两侧各 .05em。
- [夜间星级] 原 ★/☆ 用 color 着色，被夜间弹窗 * { color:#fff !important } 覆盖成全白、实空不分；改用 SVG 的 fill 不受该规则影响。
