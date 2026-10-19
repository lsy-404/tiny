# 043 [Style] 蜜罐甜品屋美术 emoji 换成统一图片，→ ✓ ★ 改文字或 SVG

用户新规则（042 之后）：“C和tm豁免，→、⚙ 不豁免；包括美术中的emoji，因为在不同设备上不一样，唯一豁免是C和tm这种标准用法”。随后选择：“Replace the Honeypot Dessert House's art emoji (food, guests, events, plants, hearts, cleaner) with a unified emoji image set (e.g. the MIT-licensed Fluent Emoji), turn → ✓ ★ into text or SVG, then merge and deploy as usual.”

## 方案
- 图片：Microsoft Fluent Emoji（MIT），自托管在子模块 assets/emoji/，按码位命名，附 LICENSE。
- 接入：托管层加一段 MutationObserver，把页面文本里已映射的 emoji 换成 `<img class="emoji">`（1em 大小、随上下文字号缩放），覆盖脚本动态生成的全部内容；作者的数据与渲染代码不改，将来移植新版只需带上这一段。
- 文字符号：→ 改写为中文表述；订单已上餐的 ✓ 与图鉴评分 ★ 改为内联 SVG。

## 步骤
- [x] 盘点：源码 94 处 / 67 种（64 个 emoji + → ×16、✓ ×1、★ ×2）
- [x] 取 Fluent Emoji 文件清单，选风格（Color / Flat），按 CLDR 名映射 64 个 emoji，下载到独立目录，核对 SVG 内容（无脚本、无外链）
- [x] 托管层：emoji → 图片映射 + MutationObserver + .emoji 样式
- [x] → ✓ ★ 改写
- [x] 浏览器复查（营业场景、商店、图鉴、提示，日/夜），AP035 布置场景扫描为 0
- [x] 子模块 README（含 Fluent Emoji 许可说明）、提交推送；Tiny 暂存指针、构建、测试
- [x] 合并 main、部署、生产验证
