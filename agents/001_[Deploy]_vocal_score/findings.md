# Findings
- origin/main 更新到 3989904，项目清单和线上 projects.json 内容一致，门户标题均为迷你项目。
- main 当前未保护。主克隆干净，已快进到最新版本，工作树位于专属目录。
- Wrangler 配置与已验证 My 账户、minigames、mini.leisiyu.dev 映射一致；CLI 具有部署所需 workers 权限。
- 现有构建按清单复制静态目录。人声谱源文件保持在 apps/vocal-score，生成目录使用 projects/vocal-score，原有游戏构建不改变。
- 工具原始源码提交为独立本地仓库的 4f759fd；此前 46 项测试和完整浏览器校验通过。
