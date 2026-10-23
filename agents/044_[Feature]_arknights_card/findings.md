# 调研
Tiny 当前主工作区 clean，origin/main b4e1c27，GitHub main protected=false。作品源码必须单独仓库子模块；沿用 minigames Worker / tiny.leisiyu.dev。公开请求授权公开作品源码和入口，不上传用户参考包或输入信息。
采用 Windows 原生 C:/Users/User/.codex/worktrees/tiny/arknights-card 固定worktree，不触动原checkout。
[创建审计目录] -> [New-Item -LiteralPath] -> [New-Item 不支持此参数，使用 System.IO.Directory.CreateDirectory 成功，审计已提交。]

[导航浏览器测试] -> [PLAYWRIGHT_MODULE Windows绝对路径] -> [ESM需要file:/// URL，改环境变量为URL后桌面与390px全部通过。]
既有全站pnpm test通过，织音机176项174通过2跳过（既有Playwright/外部渲染环境限制），本次工具全部4项和QR浏览器测试通过。Wrangler静态资源dry-run通过。
[Workers Builds状态查询] -> [GitHub check-runs、Cloudflare Builds API] -> [GitHub暂未返回构建检查；最初旧Roaming配置过期401，改用XDG_CONFIG_HOME当前配置可读取Worker，但Builds API权限不足10000/12004。不更改凭据或授权，以已有Wrangler Worker部署权限发布已验证静态目录并核对线上产物。]
