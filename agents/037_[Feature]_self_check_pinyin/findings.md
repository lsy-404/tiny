# 037 调研与问题记录

- 自源可靠匹配数量（confident）：在我们成为朋友之前 71（同时 45、前后 26）；底色 267（181/86）；当我拾起枯叶 267（241/26）；后知后觉 11（0/11）。前后同句无相邻读音匹配的（如 sui yue → 约）不进入自校，只作单字候选。
- 导入真实工程后约 1.3–1.4 s 弹出询问（排版 + worker 计算）。
- [弹窗打开后可滚动列表有黑色焦点框] Chrome 把模态框焦点给第一个可聚焦元素（可滚动列表）-> “全部采用”按钮 autofocus（无结果时焦点在“关闭”）。
- [editor 浏览器测试失败 bulk clear should invalidate export immediately] 新包装层用了已有类名 lyric-editor__tools，测试与样式命中“原文”按钮 -> 改名 lyric-editor__write。
- [pdf 超时] 与中途重建 dist 时间重合，最终构建后重跑。
