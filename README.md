# Tiny Projects

Tiny Projects 是展示小工具、游戏与互动作品的静态门户。门户包含本地运行的织音机（读取 SVP、ACE Studio、VOCALOID、UTAU、MIDI、FL Studio 等工程，预览五线谱与简谱并下载 PDF）和 CASSIE PLUS 广播合成工具，均可返回主菜单；导航可访问 [Blog](https://leisiyu.dev/)。构建后的 `dist/` 可直接部署到静态托管服务。

在线访问：[tiny.leisiyu.dev](https://tiny.leisiyu.dev/)。

## 开发

```bash
corepack pnpm@10.34.6 install --frozen-lockfile
pnpm run build
pnpm run test
```

需要 Node.js 22.13 或更高版本，以及 Git 和 pnpm。构建会初始化固定版本的 `apps/cassie` 子模块、安装其锁定依赖，生成两个工具的静态资源，再将所有项目复制到 `dist/`。更新 CASSIE 时提交新的子模块指针；其代码和音频许可随工具提供。

`main` 已连接 Cloudflare Workers Builds，推送后等待 GitHub 的构建检查成功，再验证线上入口。需要手工发布时可运行 `pnpm run deploy`。

发布入口为 `dist/index.html`。项目清单位于 `apps/portal/projects.json`，每项的 `path` 指定仓库内的静态项目目录；该目录需要包含 `index.html`，构建时会复制到 `dist/<path>/`。

新增静态项目可以放在 `projects/<slug>/` 等目录，并在清单中填写 `slug`、`path`、标题、简介、署名和入口文案。现有游戏保留 `games/<slug>/` 的独立路径。SVP 人声谱的 Vue 源码位于 `apps/vocal-score/`，构建产物写入被忽略的 `projects/vocal-score/`，然后纳入门户构建。

`eyebrow`、`meta` 和封面可按项目需要填写。
