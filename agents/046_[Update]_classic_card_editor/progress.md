# 操作记录
- 已确认Tiny隔离工作树main与远程14900c6一致，源工具验证完成。

- 固定源工具15717ae；stage子模块gitlink后完成pnpm build，6作品1660静态文件。
- pnpm test通过：织音机174通过，2项既有Playwright缺失跳过；门户及其他现有检查通过。桌面1280与移动390的门户往返导航通过。
- 发布前diff --check通过；仅子模块及本次审计文件修改。

- 首次部署ac53cd0，Workers版本95040183-9a27-48bb-a2c8-524b6d372446，14项工具资源上传，其余未改变。线上导航桌面/手机通过。
- 完整资源核对首次CASSIE FFmpeg首块manifest/checksum边缘缓存版本不一致；直接读取manifest后正确，保持断言不变完整重跑通过：539文件、2 FFmpeg块、6路由、2音频HEAD。
- 真实IAB核对发现字号工具栏默认132空白与昵称字重开关不一致，源工具补修，待验证后更新固定提交并再次部署。

- 最终运行源码eb82bc3，Tiny17807f5，Workers版本d94f3da5-5724-45d8-a460-7e6877fbeffc。追加上传仅3个档案卡JS资源。
- OAuth清缓存API返回401/10000；未扩大凭据权限。改用既有Edge登录的My账户缓存面板，只按URL刷新CASSIE manifest及两个gzip分块；面板确认清除成功。
- 清缓存后完整release-check通过：539文件、2FFmpeg块、gzipOS规范化1项、6路由、2音频HEAD、6作品；保持原校验断言。
- IAB确认默认字号132、整行选项、左侧无平台二维码上传、浅色署名，实际下载1x模板及示例。输出目录保存桌面/手机图。
- 最终子模块eec6b1e仅追加源工具审计，web树与已部署eb82bc3完全一致，无需重复部署。原开发区feature/vocal-score-refresh b4e1c27仍干净。
