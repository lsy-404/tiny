# Tiny Projects
> 最后更新：2026-10-17

## 项目目标
在 tiny.leisiyu.dev 展示小工具、游戏和互动作品（蜜罐甜品屋、织音机、CASSIE PLUS、卡桑德里传说、十光年的距离）；首页按发布日期倒序并附完整署名，门户与 leisiyu.dev 博客双向导航。Tiny 不保存作品源码，全部作品为固定提交的子模块。

## 技术栈
静态门户、Node 构建、pnpm、Git 子模块、Cloudflare Workers 静态资源。Tiny 根目录无运行依赖；织音机（Vue、Vite 等）与 CASSIE 的依赖在各自仓库锁定。

## 模块结构
- apps/portal：门户与项目清单 projects.json（category：personal 独立个人 / commissioned 受委托 / collaboration 合作 / hosted 受委托托管，只用于分类；released 首次发布日期；source 可选源目录）
- apps/cassie：子模块 lsy-404/CASSIE（独立个人创作）
- apps/vocal-score：子模块 lsy-404/vocal-score（织音机，奥莉安多委托，AGPL-3.0；历史拆分自本仓库）
- games/honeypot-dessert：子模块 lsy-404/honeypot-dessert（蜜罐甜品屋，槃清作品，受委托托管）
- games/cassandri-legend：子模块 lsy-404/cassandri-legend（与槃清合作）
- games/ten-light-years：子模块 lsy-404/10lightyears，发布其 web/（与 StarryMiko2233 合作）
- scripts/build-submodules.mjs：初始化全部子模块，构建 CASSIE 与织音机到 projects/
- scripts/build.mjs：按清单复制作品到 dist/，排除仓库文件；把 tiny.env 的 HOME_URL 写入每个作品页面 <meta name="home-url">（各作品据此显示返回入口，未设置则不显示）
- test：门户与构建测试、test/server.mjs 预览、release-check 线上核对；作品测试随作品仓库
- dist：生产资源

[项目约束](local.instructions.md)
