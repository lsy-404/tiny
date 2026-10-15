# Progress

- converter：TRIPLET_UNIT、quarterBeats、beatAt、tripletBeats、tripletValues；spellSpan 支持三连拍（直值不得止于三连拍内部、切分不跨入三连拍）；beamPieces 标括号、半小节四个八分合杠排除三连；pieceXml 写 time-modification 与 tuplet；tick 换算先乘后除避免浮点误差；结果新增 triplets.{enabled,beatCount}。
- jianpu：读 tuplet，起点四舍五入到 1e-6，drawTuplets 画括号与 3。
- App：triplets 默认 true，进入转换键；“识别三连音”复选框；layout.css；i18n 四语。
- 测试：converter 35（含三连音用例；样本测试对三连音开/关都验证合并不变式与单声部）；pnpm run test 147 通过（1 项无 Playwright 跳过）；jianpu.browser.html 新增三连音括号检查。
- 浏览器：continuous-preview、pdf、score-text、state、editor、jianpu（含三连音括号）、storage、formats（含花骨朵与完美友人样本）、project-navigation、staff-layout 全部通过；实测花骨朵五线谱 OSMD 三连括号正常、简谱（单选 main）173 组三连标记，无页面错误。
