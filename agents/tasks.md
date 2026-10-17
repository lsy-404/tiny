# 任务追踪
> 准则版本: v0.2.2

| 编号 | 任务名称 | 任务描述 | 变更动机 | 状态 |
| :--: | :------: | :------: | :------: | :--: |
| 001 | [Deploy] vocal_score | 集成人声谱并发布现有门户 | 用户已提供最新门户源码 | ✅ 已完成 |
| 002 | [Feature] vocal_score_portal | Vue工具接入构建和门户 | 在现有域名发布 | ✅ 已完成 |
| 003 | [Verify] vocal_score_checks | 迁移转换与浏览器测试 | 根test隔离和可复现验证 | ✅ 已完成 |
| 004 | [Verify] release_baseline | 核验门户线上基线 | 确保现有项目资源不回退 | ✅ 已完成 |
| 005 | [Feature] sidebar_navigation | 设置栏目切换与收起 | 用户要求扩大谱面空间 | ✅ 已完成 |
| 006 | [Fix] staff_page_layout | 五线谱页面几何与留白 | 用户反馈谱面展示欠佳 | ✅ 已完成 |
| 007 | [Feature] continuous_pdf | PDF全部页面连续滚动 | 用户要求完整往下拉 | ✅ 已完成 |
| 008 | [Perf] score_rendering | 排版去重、Worker和按需高清导出 | 用户反馈排版慢 | ✅ 已完成 |
| 009 | [Feature] score_text_editing | 谱面直接编辑文字 | 用户要求点击谱面改字 | ✅ 已完成 |
| 010 | [Feature] pinyin_matching | 汉字按拼音匹配补字 | 用户澄清含多音字与局部匹配 | ✅ 已完成 |
| 011 | [BugFix] staff_note_mapping | 多小节来源与唯一音符标识 | 防止同音同词编辑错误 | ✅ 已完成 |
| 012 | [Verify] integrated_release | 集成回归与操作文档 | 全功能和旧门户发布检查 | ✅ 已完成 |
| 013 | [Fix] windows_test_paths | 修复旧测试Windows文件路径 | 保持完整断言并跑通发布检查 | ✅ 已完成 |
| 014 | [Brand] tiny_projects | 全站名称和正式域名统一为 Tiny Projects | 用户确认 tiny.leisiyu.dev | ✅ 已完成 |
| 015 | [Brand] tiny_portal | 门户、作品返回入口与说明改名 | 全站品牌一致 | ✅ 已完成 |
| 016 | [Verify] tiny_brand | 更新现有构建和发布断言 | 域名和品牌验证 | ✅ 已完成 |
| 017 | [Verify] tiny_review | 独立复核可见品牌残留 | 核对构建产物 | ✅ 已完成 |
| 018 | [Feature] cassie_integration | CASSIE迁到子路径并加入主菜单返回入口 | 用户要求统一工具入口 | ✅ 已完成 |
| 019 | [Feature] score_menu | 声谱四语主菜单入口 | 用户要求返回门户 | ✅ 已完成 |
| 020 | [Verify] project_navigation | 项目卡片、资源与键盘导航验证 | 迁移需覆盖真实嵌套路由 | ✅ 已完成 |
| 021 | [Feature] vocal_score_refresh | 人声谱 logo、精简文案与布局、SVG 直接预览 | 用户要求加 logo、去描述文本、优化布局、减少渲染时间 | ✅ 已完成 |
| 022 | [Feature] notation_feedback | 连杠与按拍拼写、转调、渐变速、页边距 | 群聊试用反馈与用户要求 | ✅ 已完成 |
| 023 | [Feature] multi_format_import | 改名织音机，支持 UtaFormatix 全部输入、ACEP、MIDI、FL Studio 器乐总谱（Beta） | 用户要求与群聊反馈 | ✅ 已完成 |
| 024 | [Feature] lyric_paste_and_note_merge | 粘贴歌词按句定位替换；合并连续音符低/中/高 | 用户反馈 | ✅ 已完成 |
| 025 | [Feature] startup_parts_and_matching | 启动画面、声部排序改名、调校开关、调性与网格对齐修正、拼音定位加固 | 用户要求与花骨朵工程反馈 | ✅ 已完成 |
| 026 | [Feature] triplets | 三连音记谱：按拍自适应量化、MusicXML 三连括号、简谱三连标记、识别三连音开关 | 用户要求（花骨朵大量三连音位置） | ✅ 已完成 |
| 027 | [Feature] notices_and_lyric_marks | 手机点外部收起侧栏、转换提示移入分析页、歌词粘贴下划线分级与替换界面 | 用户要求 | ✅ 已完成 |
| 028 | [Feature] lyric_correction | 歌词重做：空白框粘贴整首正确歌词，乱序、分段换行无关，同时对齐所有声部并逐字标注；逐字网格 | 用户要求重新设计 | ✅ 已完成 |
| 029 | [Feature] vocal_merge_singer_pitch | 合并仅作用于人声并按整轨接续、自动音高仅作参考与手动曲线修正、可选显示演唱者（声库） | 用户要求（分段分轨的单人演唱） | ✅ 已完成 |
| 030 | [Perf] lyric_worker_and_startup | 修正歌词时的长时间卡顿（工程监听批量化）、歌词匹配移入 Worker、启动页只做资源与 Worker 预备 | 用户反馈替换时卡、加载页不应包含缓存与渲染 | ✅ 已完成 |
| 031 | [Feature] notation_styles | 记谱风格：花腔连线/延长线、三连音标记样式、摇摆记法、风格预设；自动合并逐音识别滑音与装饰音（默认），合并连续音符移入记谱风格 | 用户要求选择风格、滑音与合并倾向识别 | ✅ 已完成 |
| 032 | [Fix] old_merge_setting | 031 之前保存的工程仍为旧默认“低”：加载时迁移为“自动” | 用户反馈花腔未合并、重复 ou | ✅ 已完成 |
| 033 | [Fix] score_ending_and_imports | 流行旋律谱默认连线 + 延长线、终止线、FL 工程 512 MB 上限、续行延长线与连线位置 | 用户反馈 | ✅ 已完成 |
| 034 | [Docs] license_agpl | 织音机以 AGPL-3.0 开源：LICENSE、界面源代码/许可链接、README 许可说明 | 用户要求标明开源协议与地址 | ✅ 已完成 |
| 035 | [Feature] score_playback | 曲谱播放走带：内置钢琴按谱播放、可打开导出音频跟随、五线谱/简谱光标与点击定位 | 用户提出播放走带，选择内置钢琴并推荐打开音频 | ✅ 已完成 |
| 036 | [Feature] songs_smooth_playhead_pinyin | 歌曲独立并可挂到多个工程、走带光标平滑移动、拼音歌词从其他声部与前后文生成候选弹框 | 用户反馈走带不够平滑并提出歌曲挂接与拼音补充 | ✅ 已完成 |
| 037 | [Feature] self_check_pinyin | 自校：导入时自动询问本曲自源（同时唱/前后同句）可补全的拼音，逐字选择或全部采用并可撤销；移除延长说明与“写入”文字，加自校按钮 | 用户要求自源快速匹配并在导入时询问 | ✅ 已完成 |
