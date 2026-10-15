# Tiny Projects
> 最后更新：2026-10-15

## 项目目标
在 tiny.leisiyu.dev 展示小工具、游戏和互动作品，包含 SVP 人声谱与 CASSIE PLUS；门户与 leisiyu.dev 博客双向导航。

## 技术栈
静态门户、Node 构建、pnpm、Cloudflare Workers 静态资源；人声谱使用 Vue、Vue I18n、Vite、OpenSheetMusicDisplay、PDF.js 和 jsPDF。

## 模块结构
- apps/portal：门户与项目清单
- apps/vocal-score：人声谱 Vue 源码和排版资源
- apps/cassie：独立 CASSIE 仓库的固定提交子模块，源码与各类资产许可保留原归属
- games：既有互动作品
- scripts/build.mjs：静态门户复制构建
- scripts/build-cassie.mjs：初始化固定子模块、安装锁定依赖和生成嵌套静态资源
- test：所有测试与验证脚本
- dist：生产资源

[项目约束](local.instructions.md)
