# 041 调研记录

- [旧色位置] 教程 .tutorial-box 边 #ff6b9d、文字 #8b003a、.tutorial-btn #ff6b9d、.tutorial-skip-btn #bbb、.highlight-box #ffeb3b；.gm-btn-ok #ff6b9d；.book-tab 绿描边 #2d8659（夜间蓝 #5b9bd5）；.bc-name #8b003a；.hud-challenge 亮绿 #2ecc71/#eafaf1（.done 实心亮绿，夜间同）；食谱/装修 buy-btn 由 JS 内联 #2e8b57/#2d8659（内联背景连 :disabled 灰也盖掉）；“已解锁”内联 #2ecc71。
- [夜间] body.night :is(.modal,.gm-overlay,.tutorial-box…) * 统一白字 !important，只管文字颜色；背景/边框需另写 body.night 规则（特异性需 ≥ 作者的 body.night .book-tab 等）。
- [范围外] 连击条（橙粉渐变）、商店“当前金币”“推荐购买”标题（#8b003a）也是旧色，但不在用户列出的六项内，只报告。
- [范围外仍为旧色] 连击条 .hud-combo 橙粉渐变；商店“当前金币”“推荐购买”标题 #8b003a；锁定条目的 ❓ 为彩色表情（字形本身粉色，无法用 CSS 改色）。
- [部署核对] 同一提交同时推 main 与功能分支时，commits/<sha>/check-runs 可能先只返回功能分支的预览构建（摘要有 Preview Alias URL），不能据此判定生产已部署；等摘要无预览别名的那次完成后再跑 release-check。
