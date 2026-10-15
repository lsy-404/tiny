# Plan

用户要求：工具改名“织音机”（保留 /projects/vocal-score/ 路径）；参考 UtaFormatix3 支持全部输入格式，并支持 ACEP、MIDI 与 FL Studio 工程（交响/器乐总谱）；新格式直接加入现有工具并标注 Beta；致谢“感谢奥莉安多提供的样本数据和改善建议”。用户已离开，授权自行决定，要求看到满足全部功能与格式的网站。样本（不入库）：人立方_调校工程.svp、完美友人.acep、6 个 FLP。

- [x] 改名：i18n 源键、标题、门户卡片、README、导航测试
- [x] 共享契约 importers/model.js、乐器识别 instruments.js、注册表 index.js（按需加载）、svp.js
- [x] 依赖：fflate、fzstd、yaml、@xmldom/xmldom(dev)；许可声明与 UtaFormatix3 署名
- [x] App：多格式导入、格式标签与 Beta 标记、空白页格式列表、错误翻译、器乐默认不合并、致谢
- [x] 转换器：同起止音符成和弦、按乐器/音域选谱号（高音/低音/中音/打击乐）、乐器总谱排序、GM 鼓无音高记谱、打击乐不参与调性分析
- [x] 简谱：和弦纵向堆叠、和弦定位修正
- [x] 并行实现解析器：ACEP/MIDI/VOCALOID MIDI/VSQ；VSQX/VPR/CCS/MusicXML/UfData；UST/USTX/S5P/PPSF；DV/TSSLN；FLP
- [x] 集成：注册表文件名核对、package.json 测试脚本加入 importers、构建
- [x] 真实样本：ACEP、6 个 FLP、SVP 在浏览器里排版检查
- [x] 全量测试、提交、合并 main 并验证线上
