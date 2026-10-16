# Progress

- converter.js：beatFits / tripletBeats / beatRhythm（swing 拍、平直八分计数）、snap 中 2/3→1/2、markMelismas（按和弦分组）、hideRepeatedTuplets、MELISMA_STYLES / TUPLET_MARKS / GLIDE_STYLES、mergeAuto、pieceXml 写 slur / slide / grace / tuplet 属性、lyricXml extenders、Swing 方向与 <sound><swing>；结果 swing、noteMerge.glideCount/ornamentCount。staff.js 关闭 OSMD 三连音数字重复限制；jianpu.js 读取 tuplet bracket/show-number、slur、slide、grace（不占时值），画连线、滑音线、倚音。
- App.vue：记谱风格设置区（风格预设 4 种 + 自定义、合并连续音符移入并新增“自动 · 逐音识别”、滑音与装饰音、花腔记法、三连音标记、摇摆记法与摘要），默认 noteMerge 'auto'；i18n 三语 25 条 + svp.warning.swingStraight 四语；ui-messages 新模式。README 更新。
- 测试：converter +4（花腔、三连音标记、摇摆、自动合并与滑音写法）、i18n 列表补齐 029–031 文本、ui-messages 摇摆提示；pdf.browser 期望 568。pnpm run test 155 通过（Playwright + 三份样本）；本地 dist 浏览器 state、editor、notices、score-text、continuous-preview、formats、jianpu、storage、pdf、project-navigation 全部通过；花骨朵四种预设五线谱与简谱截图核对（Swing 标记、无括号三连音、连线、滑音线、倚音、简谱倚音与滑音线）。
