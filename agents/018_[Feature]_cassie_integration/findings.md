# Findings

- 用户选择迁入 Tiny 子路径，而非仅加外链卡片。
- CASSIE 当前主分支85b2fd7；代码AGPL-3.0-only，音频及第三方各自许可。保留独立仓库和全部许可，避免复制形成两个源码来源。
- 源码多处 fetch 使用根路径，包括 bank、音频、音素、FFmpeg、字典；迁移必须一致按 Vite BASE_URL 解析，不能仅修改页面 base。
- 原 public/_headers 含根级安全策略，接入时将规则限定 projects/cassie；不能覆盖门户、声谱或游戏。
- CASSIE构建现有准备脚本自动产生ffmpeg和spelling；完整音频、phoneme与WORLD运行库已检入，不重新提取游戏数据。
