# Findings

- 用户明确确认 tiny.leisiyu.dev，并要求整个站点改名 Tiny Projects。
- 当前 Worker 为 My 账户下 minigames，main 未保护且自动触发 Workers Builds。
- 品牌残留涉及门户标题、标志描述、两个游戏的返回链接可访问名称、README、包名与发布检查。作品标题和署名保留。
- Cloudflare 官方文档允许配置 custom_domain，由平台管理 DNS 和证书。部署前确认目标没有已有冲突记录。
- 浏览器存储按 origin 隔离，域名变更不会自动转移旧 origin 的 IndexedDB。
- 已通过 My 账户的 leisiyu.dev DNS 列表核实：全区11条记录中有 mini Worker 绑定，无 tiny 记录；新域名未被占用。现有 games 由独立 domain-redirects Worker 管理，后续核查其目标是否仍指向旧站。
- 新部署把 mini 自定义域名替换为 tiny，旧 mini DNS 被同步移除。缓存请求仍能到边缘，但实时公共 DNS 已不存在 -> 为 mini 新建已代理 A 192.0.2.0，仅作为原生跳转的无源站占位；公共解析和HTTP现已恢复。
- 新建并启用 Single Redirect 05a6d3d9289f4c4c85e52ae1422c7a7a，名称 Tiny Projects canonical domain。表达式 `http.host in {"mini.leisiyu.dev" "games.leisiyu.dev"}`，301目标 `concat("https://tiny.leisiyu.dev", http.request.uri.path)`，保留查询字符串；不作用于新域名或其他子域。
- [表单渲染后节点失效] -> [重新读取当前可见状态] -> [上一字段其实已应用，使用新节点完成剩余字段；保存成功且未重复创建记录]。
- GitHub在推送时提示仓库已由minigames更名tiny；已通过API核实同一仓库正式地址，更新共享origin URL，未重建或重命名Worker服务。
