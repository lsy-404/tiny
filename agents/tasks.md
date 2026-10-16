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
