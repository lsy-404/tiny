---
description: Always Load
applyTo: '**'
---
- 原始 SVP、用户歌词和生成的歌曲不进入仓库、构建或部署。
- 全站可见名称使用 Tiny Projects，正式域名为 tiny.leisiyu.dev；保留现有作品内容及署名。
- 审计保存在 agents，测试仅在根 test。
- 发布只使用已确认的 My 账户与 minigames 服务。
- 协作分支本地合并 main；按实时保护状态执行 Git 交付。
- 仓库未要求 PR 时不开 PR：完成后直接合并进 main 并推送，立即部署（Workers Builds minigames），不再等待确认。
- Tiny 不保存作品源码：作品以固定提交子模块接入；首页按 released 倒序，署名写人名与分工，不写分类名称。
- 返回主菜单统一由 tiny.env 的 HOME_URL 决定：构建写入 <meta name="home-url">，作品读取它，未设置则不显示返回入口（游戏同时去掉 Tiny 标题后缀）。
