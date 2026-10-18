# 038 调研记录

- [现状] origin/main 与本地一致：只有 apps/cassie 是子模块；织音机、卡桑德里传说、十光年为仓库内完整文件。首页顺序为十光年、卡桑德里、CASSIE、织音机（不是倒序）。
- [独立仓库] cassandri-legend 停在 2026-08-22（Tiny 内已到 v8 并有 20+ 测试）；10lightyears 为 29MB 数据集仓库，网页在 web/，本地克隆落后 3 个提交；织音机没有独立仓库。
- [甜品屋源文件] `F:/OneDrive/Download/甜品店 (3) - 副本 - 副本.html`，2427 行单文件，无外链与网络请求，存档用 localStorage（honeypot_slot_1..8）；标题“蜜罐甜品屋 · 修复版”；body min-width 1100px（桌面布局）；右下角“测试修改器 [F1]”以源码内固定秘钥解锁。
- [测试归属] legend-*/cassandri-*/save-import-export/checkbox-animation/loot-auto-select 读取 games/cassandri-legend；test/vocal-score 读取 apps/vocal-score；build-output、worker-config、portal-*、ten-light-years-preview、project-navigation 为门户/构建集成测试。
- [十光年] 10lightyears/web 与 Tiny 副本对比：Tiny 的 main.js 更新（adoptBodyRoll 手动→自动接管机身滚转），index.html 多 Tiny 标题后缀、og:image、“设置”按钮名与退出链接；three.module.js 只差行尾。仓库 README 原写 `web/data/*.bin` 不随仓库分发；本机全局 gitignore（F:/OneDrive/Config/.gitignore_global:75）忽略 `*.bin`，提交需 `git add -f`。独立站 10lightyears.voidcarve.com 在线（标题无 Tiny）。
- [十光年决定] 用户选择：10lightyears 收录三个 .bin 并改 README；合入滚转修复；退出链接和标题后缀只在 Tiny 子路径下出现，voidcarve 外观不变。
- [全局忽略] F:/OneDrive/Config/.gitignore_global 忽略 `.gitignore`、`*.bin`、`/test/`、`/*test*`。新仓库首个提交漏掉了 test/ 与 .gitignore → 追加 `git add -f`。后续在新仓库提交前先看 `git status --ignored`。
- [卡桑德里 Pages] lsy-404/cassandri-legend 的 GitHub Pages 从 main 构建（lsy-404.github.io/cassandri-legend/ 200）。与十光年同理采用路径规则：退出链接与 Tiny 标题后缀只在 /games/ 下出现。
- [签名] 全局 commit.gpgsign=true，gpg.format=ssh，op-ssh-sign；需 1Password 导出 SHA256_DcAGGG… 公钥文件。
- [Git Bash] 传 `/games/...` 这类参数会被 MSYS 转成 Windows 路径，需 MSYS_NO_PATHCONV=1。
- [签名根因] `ssh-add -l` 显示 1Password agent 仍提供 "Github" 密钥（SHA256:DcAGGG…），只是 ~/.ssh/1Password 中导出的 .pub 文件缺失。用 `git -c user.signingkey="key::<ssh-add -L 中该公钥>"` 可在不改配置与 1Password 目录的情况下用同一把密钥签名（需在 1Password 里批准）。
- [首页编号] orderProjects 按 released 新到旧排序，编号按发布先后（最早 01），新作品加入时旧编号不变；同日按清单顺序（sort 稳定）。
