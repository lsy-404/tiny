# Plan

用户要求：标明开源协议和开源地址；织音机本身有许可证吗？没有就补一个 AGPL。

- [x] 检查：仓库（github.com/lsy-404/tiny，公开）没有任何许可证文件，只有 apps/cassie 子模块自带 LICENSE；织音机自身无许可
- [x] apps/vocal-score/LICENSE：gnu.org 官方 AGPL-3.0 全文（34 523 字节，sha256 0d96a4ff…abcb0）
- [x] 界面侧栏底部：织音机源代码（GitHub apps/vocal-score）· AGPL-3.0（LICENSE）· 第三方许可（vendor/THIRD-PARTY.txt），四语
- [x] README：开头标明协议与源代码地址；“许可与源代码”一节（版权声明、AGPL-3.0-or-later、第 13 条网络服务提供源码、第三方许可兼容性、仓库内其他作品不在此范围）；根 README 说明
- [x] 测试与本地验证
- [x] 合并 main、部署、线上验证
