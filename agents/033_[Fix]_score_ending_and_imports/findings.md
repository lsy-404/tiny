# Findings

- [横线来源] 本机 12 个 FL/SVP 工程连线、滑音均配对；横线位于第一行歌词位置，是该小节续唱音（无歌词文字）的延长线。OSMD 只在显示歌词文字的系统里保留歌词行；空文本 <text></text> 会让延长线消失；不写 continue 也不行（线画进下一行谱表，与用户截图一致）。在可能换行的位置（小节开头，系统只在小节线处换行）给续唱首音加 U+00A0 文本可保留歌词行。
- [连线方向] 续到新一行时 OSMD 按符干方向把连线翻到下方并穿过歌词；SlurPlacementFromXML 默认 true，写 placement="above" 后固定在上方（声乐记谱惯例）。
- [OSMD 换行] 实验页需 EngravingRules.NewSystemAtXMLNewSystemAttribute=true 才按 <print new-system> 换行。
- [xmldom] 无效 XML 直接抛错（浏览器返回 parsererror 文档）-> keepLyricRows 两种都返回原文。
