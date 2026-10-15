# Findings
- origin/main 更新到 3989904，项目清单和线上 projects.json 内容一致，门户标题均为迷你项目。
- main 当前未保护。主克隆干净，已快进到最新版本，工作树位于专属目录。
- Wrangler 配置与已验证 My 账户、minigames、mini.leisiyu.dev 映射一致；CLI 具有部署所需 workers 权限。
- 现有构建按清单复制静态目录。人声谱源文件保持在 apps/vocal-score，生成目录使用 projects/vocal-score，原有游戏构建不改变。
- 工具原始源码提交为独立本地仓库的 4f759fd；此前 46 项测试和完整浏览器校验通过。
- 远程仓库无 GitHub Actions workflow；发布由显式 Wrangler 操作完成。
- 当前线上版本 ae34a523-e97d-4cb4-9f05-0a009b893947，兼容日期与现有配置一致（2026-08-22 / nodejs_compat）；不引入无关配置变更。
- 用户追加界面要求：设置采用侧栏栏目切换，PDF所有页面纵向连续滚动，并改善五线谱与分页留白；这些修改作为发布前置条件。
- 既有 Windows 测试调用 execFile("npm") 无法解析批处理 shim；将改用 Node 执行构建入口，保持完整构建与断言。

- 纠正初步部署判断：自动构建没有错误产物覆盖；Cloudflare域名负缓存是404原因。后续发布应优先利用main的Workers Builds，避免与手动部署同时执行。
- 线上HTML可能按客户端注入Cloudflare统计脚本；发布校验仅规范化明确的该注入，其他资源保持字节校验。实际Node探测29项均原样匹配。
