# 038 [Feature] 全部改为子模块、首页倒序与分类署名、托管蜜罐甜品屋

用户：“朋友有做一个这个小游戏，我们考虑将其作为Tiny的新小游戏发布。Tiny现在采用倒序，并且在首页上完成每一个的完整署名……tiny现在不再持有完整仓库，全部都由submodule控制”。
澄清：这次全部迁移；卡桑德里传说为“与他人合作”；甜品屋作者槃清；织音机委托方奥莉安多；十光年直接用 10lightyears（构建只取 web/）；甜品屋加返回 Tiny 入口、标题去“修复版”并加图标、隐藏测试修改器；署名不写类型，类型只用于分类。

## 分类
| 分类 | 作品 |
| :--: | :--: |
| 独立个人创作 personal | CASSIE PLUS |
| 受委托的创作 commissioned | 织音机（奥莉安多） |
| 与他人合作的创作 collaboration | 十光年的距离、卡桑德里传说 |
| 受委托托管 hosted | 蜜罐甜品屋（槃清） |

## 步骤
- [x] 新建 lsy-404/honeypot-dessert：托管版 index.html（标题、图标、主菜单返回、去测试修改器）、README 署名与权利说明
- [x] 新建 lsy-404/vocal-score：保留 apps/vocal-score 历史拆分，带自身 package.json/锁文件、测试与 AGPL 源码链接
- [x] lsy-404/cassandri-legend：同步 Tiny 最新版本与游戏测试（补签后 d30a532）
- [x] lsy-404/10lightyears：web/ 同步 Tiny 最新十光年（补签后 a20ee99）
- [x] Tiny：四个目录改为固定提交子模块；构建初始化全部子模块并按 source 复制；根依赖只保留门户所需
- [x] Tiny 测试：门户与集成测试留在根 test，作品测试随作品仓库并由根 test 脚本调用
- [x] projects.json：发布日期、分类、完整署名；首页按日期倒序（orderProjects，编号按发布先后）
- [x] README、project.md、tasks.md
- [x] 构建、测试、浏览器预览
- [ ] 合并进 main、推送部署、生产验证
