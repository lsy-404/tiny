# Plan

用户反馈：无序填入很好，但“替换时有点卡”，希望走 Worker 或 WASM；加载页面不应包含缓存（恢复工程）与渲染，只做所需资源与 Worker 预备。

- [x] 实测定位：Playwright + CDP 采样，人立方粘贴整首（大写使 674 个音符待修正）
- [x] App.vue 工程深度监听去掉 flush:'sync'（批量修改只遍历、序列化、保存一次）
- [x] 歌词匹配移入 Worker：lyric-alignment.worker.js + 共享客户端（合并排队、过期结果丢弃、无 Worker 时主线程回退）；LyricEditor 改为异步结果，按歌词指纹判定结果是否仍有效
- [x] PDF Worker 支持 ping 预热
- [x] 启动页：制谱引擎、字体、歌词编辑器代码、歌词匹配 Worker、PDF Worker；恢复工程与排版移到启动页之后
- [x] 四语文本、i18n 测试；单元与浏览器测试；性能复测
- [ ] 合并 main 并部署，线上验证
- [x] 回答用户：音符合并设置位置、激进程度与记谱标准（见 findings）
