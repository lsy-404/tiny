# Game Archive

一个纯静态游戏与互动资源门户。构建后，`dist/` 可以直接部署到任意静态托管服务。

在线游玩：[games.leisiyu.dev](https://games.leisiyu.dev/)。

## 开发

```bash
corepack pnpm@10.34.6 install --frozen-lockfile
pnpm run build
pnpm run test
```

部署使用临时 Wrangler CLI：`pnpm run deploy`。

发布入口为 `dist/index.html`；每个独立资源发布至 `dist/games/<slug>/`。新增资源时，把可发布的静态文件放入 `games/<slug>/`，并在 `apps/portal/games.json` 添加一项。
