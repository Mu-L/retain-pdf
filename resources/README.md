# resources

此目录保存仓库级的品牌、动画、样例和设计参考资源，不是后端源码或 runtime
目录。

## 分类

- `brand/`：Logo、二维码和发布展示图。
- `animations/`：加载和阶段动效素材。
- `samples/`：可公开的小型测试输入。
- `claude_design/`：设计参考稿，不作为生产前端入口。
- `runtime/`：预留的资源归档入口；不要在这里提交凭据或可再生成的大型二进制。
- `misc/`：尚未归类的资源。

## 当前源码与运行资源位置

- 后端源码：[`services/`](../services/README.md)
- Web 应用：`apps/web/`
- Reader 包：`packages/reader/`
- Docker / 发布基础设施：`infra/` 与 `services/docker/`
- 字体：`services/fonts/`
- Windows Typst runtime 元数据：`infra/typst/win32/`
- 任务数据：默认位于 `services/data/`，实际部署以 `DATA_ROOT` 为准

不要把源码重新放入 `backend/` 或旧 `frontend/` 路径。后端构建产物例如
`services/api/target/` 可以重新生成，应保持忽略；运行数据和模型/OCR 密钥也不应
提交到 `resources/`。
