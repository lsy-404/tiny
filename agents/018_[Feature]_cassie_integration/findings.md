# Findings

- 用户选择迁入 Tiny 子路径，而非仅加外链卡片。
- CASSIE 本地主分支85b2fd7落后远端；fetch后基于最新origin/main 3b421b6（CASSIE PLUS 1.0.1）创建worktree。代码AGPL-3.0-only，音频及第三方各自许可。保留独立仓库和全部许可，避免复制形成两个源码来源。
- 源码多处 fetch 使用根路径，包括 bank、音频、音素、FFmpeg、字典；迁移必须一致按 Vite BASE_URL 解析，不能仅修改页面 base。
- 原 public/_headers 含根级安全策略，接入时将规则限定 projects/cassie；不能覆盖门户、声谱或游戏。
- CASSIE构建现有准备脚本自动产生ffmpeg和spelling；完整音频、phoneme与WORLD运行库已检入，不重新提取游戏数据。
- 用户追加Tiny与Blog互联。当前博客是F:/Development/lsy-404@blog，对应公开leisiyu.dev；旧MyBlog目录是另一个带未提交变更的归档仓库，未触及。博客有独立的历史规范化与Pages Direct Upload工作流，不改其流程也不触发手工付费翻译。
- 博客初次worktree建在默认blog目录后发现项目要求MyBlog专属目录 -> 创建正确目录另一个worktree继续；保留初次未改动worktree，不擅自删除或移动。
