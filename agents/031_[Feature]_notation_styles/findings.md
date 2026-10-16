# Findings

- [OSMD] public/vendor/opensheetmusicdisplay.min.js 读取 tuplet 的 bracket（"no" 时不画括号）与 show-number（含 none）；EngravingRules 默认 TupletsBracketed/TripletsBracketed=false、TupletNumberLimitConsecutiveRepetitions=true（最多 2 次、AlwaysDisableAfterFirstMax=true），但截图中每组都显示括号与数字（我们写了 bracket="yes"）。RenderSlurs 默认 true。
- [简谱] jianpu.js drawTuplets 对每个 tupletStart…tupletStop 画括号和“3”，不读属性；只按 tied 画连音弧线，没有 slur。
- [标准] 花腔：连线覆盖一个音节的全部音并在音节后画延长线（LilyPond 文档；MusicXML 4.0 extend 示例），也有只用其一的做法；摇摆：平直八分音符加谱首 Swing（♫ = ♩♪³）标记，MusicXML 4.0 用 <sound><swing>。
- [真实工程续唱音分布] 花骨朵：246 个续唱音，十六分以内 62 个（三十二分以内 33 个），其中 52 个紧接新音节；朝下一音继续/落在下一音 24 个（滑音），折返 31 个（装饰音）。请不要带我走：158 个续唱音全部八分以上（真实花腔，必须保留）。人立方：仅 2 个。-> 按音判断而非全局档位。
- [OSMD] 支持 <slide>/<glissando>（RenderGlissandi 默认 true）与 <grace>；花骨朵“流行旋律谱”渲染 22 条滑音线，“合唱谱”倚音为带斜杠小音符。
- [连线配对] 花骨朵 chords 声部同一声部内有平行和弦，链条从和弦第二个音开始时连线起点不写（和弦成员不带 notations）-> 先按相同起止时值合成和弦，再把连线放在和弦首音上；三份工程各合并档位连线全部配对。
- [摇摆] 花骨朵 147 个三连音拍中 73 拍为长短 2:1，另有 55 拍平直八分音符 -> 提示“会被读成摇摆”；摇摆只改写 2:1 拍，其余三连音照常。
- [简谱限制] 花骨朵 chords 声部有重叠发声，简谱本来就不支持（既有提示），简谱验证只选 main。
- [测试期望] 默认改为自动合并后，请不要带我走从 573 个音符变为 568（5 个同音延长并入），pdf.browser 期望同步更新。
