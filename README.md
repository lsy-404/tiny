# Tiny Projects

Tiny Projects 是展示小工具、游戏与互动作品的静态门户，首页按发布日期倒序列出全部作品并附完整署名；导航可访问 [Blog](https://leisiyu.dev/)。构建后的 `dist/` 可直接部署到静态托管服务。

在线访问：[tiny.leisiyu.dev](https://tiny.leisiyu.dev/)。

## 作品与仓库

Tiny 不保存作品源码：每个作品都是固定提交的 Git 子模块，源码、许可与署名以各自仓库为准。

| 作品 | 子模块 | 仓库 | 分类 |
| --- | --- | --- | --- |
| 蜜罐甜品屋 | `games/honeypot-dessert` | [lsy-404/honeypot-dessert](https://github.com/lsy-404/honeypot-dessert) | 受委托托管（作者槃清） |
| 织音机 | `apps/vocal-score` | [lsy-404/vocal-score](https://github.com/lsy-404/vocal-score)（AGPL-3.0） | 受委托的创作（委托方奥莉安多） |
| CASSIE PLUS | `apps/cassie` | [lsy-404/CASSIE](https://github.com/lsy-404/CASSIE) | 独立个人创作 |
| 卡桑德里传说 | `games/cassandri-legend` | [lsy-404/cassandri-legend](https://github.com/lsy-404/cassandri-legend) | 与他人合作（主创槃清） |
| 十光年的距离 | `games/ten-light-years` | [lsy-404/10lightyears](https://github.com/lsy-404/10lightyears)（发布 `web/`） | 与他人合作（数据处理 StarryMiko2233） |

分类只用于整理，首页署名不写分类名称。

## 开发

```bash
corepack pnpm@10.34.6 install --frozen-lockfile
pnpm run build
pnpm run test
```

需要 Node.js 22.13 或更高版本，以及 Git 和 pnpm。构建先初始化全部子模块，为 CASSIE 和织音机安装各自锁定的依赖并把产物写入 `projects/cassie/`、`projects/vocal-score/`，再按清单把所有作品复制到 `dist/`；子模块中的 `.git`、`test/`、`package.json` 等仓库文件不会发布。测试运行门户与构建检查，以及卡桑德里传说和织音机各自仓库中的测试。返回主菜单的地址只在 [`tiny.env`](tiny.env) 定义一次：`HOME_URL=/`，同名环境变量（例如 Workers Builds 中设置的）优先。构建把它写进每个作品页面的 `<meta name="home-url">`；不设置时所有作品都不显示返回入口。`node test/server.mjs` 在 <http://127.0.0.1:4190/> 预览 `dist/`。

`main` 已连接 Cloudflare Workers Builds，推送后等待 GitHub 的构建检查成功，再验证线上入口（`node test/release-check.mjs`）。需要手工发布时可运行 `pnpm run deploy`。

## 新增或更新作品

1. 作品放在自己的仓库。返回主菜单的入口读取页面里的 `<meta name="home-url" content="…">`：有就显示并指向它，没有就不显示（游戏同时去掉标题里的 Tiny Projects）。
2. `git submodule add <仓库地址> games/<slug>`，之后更新作品时在子模块中检出新提交并提交新的子模块指针。
3. 在 `apps/portal/projects.json` 填写 `slug`、`path`（发布路径）、可选的 `source`（入口不在子模块根目录时的源目录）、`category`（`personal`、`commissioned`、`collaboration` 或 `hosted`）、`released`（首次发布日期，`YYYY-MM-DD`）、标题、简介、署名 `credit` 和入口文案；`eyebrow`、`meta` 与封面可按需填写。
