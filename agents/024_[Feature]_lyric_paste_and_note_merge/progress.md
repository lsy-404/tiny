# Progress

- 新增 locatePastedLyrics/applyLocatedLyrics；LyricEditor 改为先定位；i18n 新增写入方式与定位提示，删除 10 条旧匹配模式文案。
- converter 新增 noteMerge 与 mergeConsecutive；App 设置项与摘要；README 更新。
- 测试：lyric-alignment 10 通过、converter 29 通过、i18n 5 通过。
- 构建成功；pnpm run test 全部通过（vocal-score+importers 142）。
- 浏览器：editor（修正测试正则转义后）、continuous-preview、pdf、score-text、state、jianpu、storage、formats、project-navigation、staff-layout 通过。
- 实测完美友人.acep：汉字写成拼音模式粘贴“被子里
可怜虫”→ 已定位 2/2 句 · 替换 6 个音符，只改这 6 个；合并连续音符“中”提示 9 个续唱音符并入前一字。
