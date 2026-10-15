# Findings

- 用户明确确认 tiny.leisiyu.dev，并要求整个站点改名 Tiny Projects。
- 当前 Worker 为 My 账户下 minigames，main 未保护且自动触发 Workers Builds。
- 品牌残留涉及门户标题、标志描述、两个游戏的返回链接可访问名称、README、包名与发布检查。作品标题和署名保留。
- Cloudflare 官方文档允许配置 custom_domain，由平台管理 DNS 和证书。部署前确认目标没有已有冲突记录。
- 浏览器存储按 origin 隔离，域名变更不会自动转移旧 origin 的 IndexedDB。
