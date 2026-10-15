# Mini Projects

一个展示迷你项目、小工具、游戏与互动作品的静态门户。构建后，`dist/` 可以直接部署到任意静态托管服务。

在线访问：[mini.leisiyu.dev](https://mini.leisiyu.dev/)。

## 开发

```bash
corepack pnpm@10.34.6 install --frozen-lockfile
pnpm run build
pnpm run test
```

部署使用临时 Wrangler CLI：`pnpm run deploy`。

发布入口为 `dist/index.html`。项目清单位于 `apps/portal/projects.json`，每项的 `path` 指定仓库内的静态项目目录；该目录需要包含 `index.html`，构建时会复制到 `dist/<path>/`。

新增项目可以放在 `projects/<slug>/` 等目录，并在清单中填写 `slug`、`path`、标题、简介、署名和入口文案。现有游戏保留 `games/<slug>/` 的独立路径。

`eyebrow`、`meta` 和封面可按项目需要填写。
