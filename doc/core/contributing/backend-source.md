# 后端源码锁与独立仓库接入

产品仓库通过根目录的 `backend-source.lock.json` 选择并校验后端源码。所有本地脚本和 CI 都应先调用 `.github/scripts/resolve_backend_source.py`，不要自行假设后端一定在 `services/`。

## 当前双轨模式

锁文件支持两种互斥模式：

- 内嵌模式：`repository` 和 `revision` 都是 `null`，后端来自 `embedded_path`。
- 独立仓库模式：`repository` 是 GitHub `owner/name`，`revision` 是完整的 40 位 commit SHA，后端来自 `checkout_path`。

两种模式都必须提供 `source_tree`。解析器会校验目录结构、Git tree 和 tracked dirty state；独立仓库模式还会校验 checkout 的 HEAD。锁选择独立仓库后，如果 checkout 缺失或校验失败，解析器直接失败，不会静默回退到内嵌后端。

本地查看当前实际使用的后端：

```bash
python3 .github/scripts/resolve_backend_source.py --json
```

需要执行一条依赖后端路径的命令时，可以使用无 shell 展开的包装器：

```bash
python3 .github/scripts/run_with_backend_source.py -- \
  cargo test --locked --workspace --manifest-path {backend}/api/Cargo.toml
```

`RETAIN_PDF_SERVICES_ROOT` 只用于开发者显式指定已存在的本地 checkout；它仍然必须通过锁文件中的 tree、revision 和目录校验，不能绕过锁。

## 切换到独立仓库

切换前，独立后端仓库必须已经存在，并且目标 commit 能被 CI 使用的只读凭据获取。然后一次性更新以下字段：

```json
{
  "repository": "owner/retainpdf-backend",
  "revision": "完整的 40 位 commit SHA",
  "source_tree": "该 commit 的根 tree SHA"
}
```

目标值在独立后端 checkout 中获取：

```bash
git rev-parse HEAD
git rev-parse 'HEAD^{tree}'
```

如果独立仓库是 private repository，需要在产品仓库配置只读 Actions secret `BACKEND_REPOSITORY_TOKEN`。工作流优先使用这个 secret；未配置时只会使用产品仓库自己的 `github.token`，它通常不能读取另一个 private repository。不得把 token 写进锁文件、workflow、日志或提交。

更新锁后至少运行：

```bash
python3 .github/scripts/resolve_backend_source.py --json
python3 -m pytest .github/scripts/tests/test_resolve_backend_source.py -q
npm run test:api -- --no-run
```

CI 的 `.github/actions/prepare-backend-source` 会以锁定 SHA checkout 到 `.backend/retainpdf-services`，关闭凭据持久化，再执行相同校验。`.backend/` 已加入 `.gitignore`。

## 迁移完成条件

只有同时满足以下条件，才删除产品仓库中的内嵌 `services/`：

- 独立后端远端已建立，锁文件已切换到可获取的 commit。
- Rust、Python、架构、translation replay、Docker 和桌面打包工作流均从锁定 checkout 通过。
- 产品与后端的 contract schema parity 检查通过。
- 本地开发命令和发布流程不再依赖内嵌目录。

迁移期间保留 `services/` 是回退材料，但不是独立模式下的运行时 fallback。需要回到内嵌模式时，应显式提交一个把 `repository`、`revision` 恢复为 `null`，并把 `source_tree` 更新为内嵌 `services/` tree 的锁文件变更。
