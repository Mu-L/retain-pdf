# 前端文档

这里存放当前生产前端的架构、联调和状态检查资料。

- [前端状态 Smoke](./status_smoke.md)
- [图书馆数据层 API](./library-api.md)
- [统一 React SPA 目标架构](./spa-architecture.md)
- [主题皮肤系统](./theme-system/THEME_SYSTEM.md)
- [主页与阅读器软导航](./reader-home-navigation/soft-reader-no-refresh.md)
- [历史前端优化记录](../../ops/reports/frontend-optimization-notes.md)
- [React 迁移计划与审计](../../ops/planning/frontend-migration/)
- [前端状态 Smoke 最新报告](../../ops/reports/frontend-status-smoke-latest.json)

主要代码入口：

- `apps/web/src/pages/`
- `apps/web/src/js/`
- `apps/web/src/styles/`
- `packages/reader/`
- `packages/ui/`

桌面端同步：

- `apps/web/` 是桌面端前端 bundle 的输入目录。
- 桌面打包入口和校验脚本位于 `apps/desktop/`；不要手工维护第二份前端源码。
