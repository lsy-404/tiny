# 041 操作日志

- 建立任务；Tiny 与子模块工作区干净（Tiny faf6c64，子模块 main ef3f424）。
- 样式末尾加托管配色块（日间 11 条、夜间 6 条）；renderFoodPane 去掉 btn.style.background="#2e8b57"，“已解锁”#2ecc71→#507c66；renderDecorList 去掉 btn.style.background="#2d8659"。只运行 build.mjs 复制到 dist。
- 浏览器复查（4190，1280×860）：教程框 #fffdfa/金棕边，知道了 #ae766e、跳过 #8e8680、高亮 #e9b44c；结算“知道了” #ae766e；食谱/装修可买 #ae766e、不可买 #eee8e2；“已解锁” #507c66；图鉴分段页签（选中 #fffdfa）、客人名称 #755443；挑战进行中 #fffdfa/#dccbb8/#7a5a46、完成 #507c66。夜间：教程框 #152337/#c69b5e、页签底 #0d1725 选中 #304561、挑战 #152337 与完成 #3f6b55、名称白色；无控制台错误。
- 子模块 600a6e4（签名 G）推送 origin/main；先 git add 新指针再后台 pnpm run check。
- pnpm run check 退出 0：构建 5 个入口；门户 6 项、卡桑德里 29/29、织音机 174 通过 2 跳过；dist 甜品屋为 600a6e4（含托管配色块）。
- Tiny f4214f7（签名 G）快进 main，推送 main 与 feature/vocal-score-refresh。首次查到的 check-run 是功能分支的预览构建（摘要含 Preview Alias URL feature-vocal-score-refresh），此时线上仍为旧版、release-check 报甜品屋哈希不符；15:56:51 生产构建完成后 release-check passed（50 个文件哈希、5 个路由、5 个项目）。
- 线上 1280×860：教程框边 #c49655、知道了 #ae766e、食谱购买 #ae766e、图鉴选中页签 #fffdfa；页面高 860 = 视口；无控制台错误。
