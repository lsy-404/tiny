# Findings

- 旧手机遮罩是 .sidebar-open:after 伪元素：伪元素的点按落在 .workspace 本身，没有处理函数，所以点外面不会收起。改为真实元素并在点按时收起；侧栏背景 --fluent-mica 为 88% 不透明且无模糊，叠在谱面上会透出谱面，手机上改为 --fluent-bg。
- 侧栏在滑入的 0.2 s 内，点按左侧仍落在遮罩上（测试需等待动画）。
- CASSIE（apps/cassie/src/components/EditorPane.vue）：textarea 文字透明、caret 可见，上方 pointer-events:none 的 pre 渲染同样文字并用 span 下划线着色，随 textarea 滚动平移、右侧让出滚动条宽度。织音机沿用该结构。
- 定位需要每个音节在粘贴文本中的位置：pastedPhrases 改为 matchAll 记录 start/end（汉字按码点长度累加），原 12 个对齐测试不变；locatePastedLyrics 记录 via（reading/polyphonic/approximate）供置信度分级。
- 图例中的示例线必须把 mark-* 类放在画线的元素本身：text-decoration-color 不继承到子元素自己的装饰线。
- 完美友人.acep 实测：完全匹配、近似（改一字）与谱中未找到三类同时显示，“在→改”突出、未改动音节淡显，按钮“替换 1 个音符”。
