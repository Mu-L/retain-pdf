# backend/ 目录重构方案 —— 已执行（2026-07-24）

> 执行结果：迁移清单全部完成 + 计划外发现 4 处（见文末"执行补记"）。
> 验收：rust 323/323、ai_service 40/40、python 聚合 suite 失败清单与
> 改名前 HEAD worktree 基线**逐名一致**（16 个全是本机环境病：/var
> 符号链接、缺 python-docx 等，与重构无关）、entrypoint 冒烟通过、
> 全仓 grep 清零。

> 2026-07-23。动机：顶层 10 个目录语义不清，最大的工程模块（939 个文件的
> pipeline 引擎）叫 "scripts"，另有废弃目录与 bug 产生的垃圾路径。
> 原则：**只动顶层命名与归属，不动任何目录的内部结构**（scripts/ 内部
> 五层分层、rust_api workspace、ai_service 都是健康的，不碰）。

## 现状体检（2026-07-23 实测）

| 目录 | 内容 | 判定 | 依据 |
|---|---|---|---|
| rust_api/（365 文件） | API 网关 workspace | 保留 | 刚完成三刀拆分 |
| scripts/（939 文件） | OCR/翻译/渲染引擎 | **改名 pipeline/** | 名不副实；内部分层健康 |
| ai_service/ | Python AI agent | 保留 | — |
| contracts/ | 跨服务契约 schema | 保留 | 三份契约 + 三端锁 |
| config/ | ocr_providers.json | **保留** | 活的跨服务单源：rust `provider_config.rs` 与 python `foundation/shared/ocr_provider_config.py` 双端读取 |
| python-tests/ | 聚合测试运行器 + 自测 | 保留 | 活工具；但 `DEFAULT_TEST_ROOTS` 硬编码 `backend/scripts`，改名须同步 |
| fonts/ | 思源宋体 ×2 | 保留 | 渲染层多处引用；单独挪动收益低 |
| typst-win32/ | Windows typst 二进制 | 保留 | vendor 资源 |
| packages/ | retainpdf-core/devtools pyproject（版本停在 4.1.6） | **删除** | 全仓零引用（CI/desktop/pipeline 都不读），废弃的打包尝试 |
| workspace/ | 只剩 MinerU_API/README.md | **删除** | 空壳 |
| scripts/ 内 `\private\var\folders\...` | pytest bug 把反斜杠路径当目录名创建 | **删除** | 垃圾 |

## 目标顶层（10 → 8，每个都有一句话身份）

```
backend/
  contracts/      # 跨服务单一真值（ai-ask / pipeline-stdout / ai-conversations）
  rust_api/       # Rust workspace（主 crate + crates/retain-core|data|jobs）
  pipeline/       # ← scripts/ 改名：OCR→翻译→渲染引擎（内部五层不变）
  ai_service/     # Python AI agent（:41100）
  config/         # 跨服务运行时配置（ocr_providers.json，双端单源）
  python-tests/   # Python 测试聚合运行器（跨 pipeline 与 ai_service）
  fonts/          # 渲染字体资源
  typst-win32/    # Windows typst 二进制 vendor
```

## 迁移清单（scripts → pipeline 的全部引用点，已逐一探明）

1. `git mv backend/scripts backend/pipeline`（历史保留）
2. rust `crates/retain-core/src/config/paths.rs`：
   - `default_scripts_dir()` 的 `join("scripts")` → `join("pipeline")`
   - `from_desktop()` 的 `resource_root.join("scripts")` → `join("pipeline")`
   - **env 变量名 `RUST_API_SCRIPTS_DIR` 不改**（对外接口，兼容优先），注释注明
3. `python-tests/run_python_tests.py` 的 `DEFAULT_TEST_ROOTS`
4. CI 4 个 workflow 共 ~20 处路径：release-desktop / translation-replay /
   translate-sample-pdf / rust-api-architecture
5. 文档与自述：pipeline/README.md、PIPELINE_DIRECTORY_MAP.md、docs/ 内提及
6. 收尾 grep 全仓 `backend/scripts|scripts/entrypoints|scripts/services`
   清零（历史性文档除外）

**桌面端零改动依据**：electron-builder `extraResources` 是
`app/backend → backend` 整目录拷贝，改名自动跟随；rust 侧打包路径由
第 2 条覆盖。desktop/src/main 无 scripts 字面引用（已 grep）。

## 风险与对策

- **release-desktop.yml 本地无法全流程验证**（发版才跑）。对策：改动仅是
  路径字符串替换；`RUST_API_SCRIPTS_DIR` env 兜底保留——若有漏网引用，
  设 env 即可救急，不需要回滚发版。
- **pipeline 内部 import 不受影响**：全部 `sys.path.append(parents[N])`
  相对定位，与顶层目录名无关（已抽查 entrypoints/services）。
- 回滚：单 commit，`git revert` 即可。

## 验收门禁

- rust `cargo test --workspace` ≥ 323；python `pytest ai_service/tests` +
  `python-tests/run_python_tests.py` 全绿；frontend 726
- `rg 'backend/scripts' --type-not md` 全仓零命中
- 手动跑一次 `pipeline/entrypoints/run_render_only.py --help`（验证
  sys.path 与相对资源定位）

## 执行补记（计划外发现，2026-07-24）

方案的迁移清单漏了 4 处，执行时由全仓扫描与测试抓出：

1. **desktop/main.js:138**（方案曾断言"桌面端零改动"——错）：入口文件
   自拼 `backendRoot/scripts` 且带存在性检查（缺失直接抛错）。已改
   `"pipeline"`。教训：当时只 grep 了 desktop/src，入口 main.js 在包根。
2. **.gitignore 7 行**：`scripts/.env/*.env` 等模式改名后失配——.env 里
   是 API token，模式失配意味着可能被 git add 收进来。已同步。
3. **python-tests/conftest.py + test_run_python_tests.py +
   architecture_checks/common.py**：三处硬编码 `backend/scripts`。
4. **docker/entrypoint-app.sh**：RUST_API_SCRIPTS_DIR 默认值。

另删除：`packages/`（死副本，真值是仓库根 pyproject.toml，
sync_python_requirements.py 只读根）、`workspace/`（空壳）、
scripts/ 内 pytest bug 产生的反斜杠路径垃圾目录。

**基线对照法**：python 聚合 suite 在本机有 16 个环境性失败（/var
symlink、缺 docx、测试顺序污染），改名前后无法直接判读——用
`git worktree add <tmp> HEAD` 跑改名前基线，失败清单 diff 为空即证明
重构零引入。此法适用于一切"在既有红灯上做大改动"的验收。
