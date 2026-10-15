# Progress

- 新增 locatePastedLyrics/applyLocatedLyrics；LyricEditor 改为先定位；i18n 新增写入方式与定位提示，删除 10 条旧匹配模式文案。
- converter 新增 noteMerge 与 mergeConsecutive；App 设置项与摘要；README 更新。
- 测试：lyric-alignment 10 通过、converter 29 通过、i18n 5 通过。
- 构建成功；pnpm run test 全部通过（vocal-score+importers 142）。
- 浏览器：editor（修正测试正则转义后）、continuous-preview、pdf、score-text、state、jianpu、storage、formats、project-navigation、staff-layout 通过。
- 实测完美友人.acep：汉字写成拼音模式粘贴“被子里
可怜虫”→ 已定位 2/2 句 · 替换 6 个音符，只改这 6 个；合并连续音符“中”提示 9 个续唱音符并入前一字。
- 发布 9723c23 后用户反馈：窄屏下返回主菜单只剩“←”不易发现 → 窄屏改为“← 主菜单”短标签（完整无障碍名称不变）；门户卡片顺序按用户要求改为 01 十光年的距离、02 卡桑德里传说、03 CASSIE PLUS、04 织音机（projects.json 顺序即编号）。
- 用户确认发布：main 快进到 9723c23，再快进到 db1eb80；Workers Builds 成功。
- 线上验证（tiny.leisiyu.dev）：release-check 通过（47 个文件哈希）；project-navigation 通过；editor.browser 通过；返回主菜单 1440/900 显示“返回主菜单”、600/390 显示“主菜单”；完美友人.acep 粘贴“被子里/可怜虫”已定位 2/2 句、只改 6 个音符；合并连续音符“中”提示 9 个；门户顺序 01 十光年的距离、02 卡桑德里传说、03 CASSIE PLUS、04 织音机。
