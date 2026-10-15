# Mini Projects
> 最后更新：2026-10-15

## 项目目标
保留现有门户与互动作品，将已验证的 SVP 人声谱工具接入 mini.leisiyu.dev。

## 技术栈
静态门户、Node 构建、pnpm、Cloudflare Workers 静态资源；人声谱使用 Vue、Vue I18n、Vite、OpenSheetMusicDisplay、PDF.js 和 jsPDF。

## 模块结构
- apps/portal：门户与项目清单
- apps/vocal-score：人声谱 Vue 源码和排版资源
- games：既有互动作品
- scripts/build.mjs：静态门户复制构建
- test：所有测试与验证脚本
- dist：生产资源

[项目约束](local.instructions.md)
