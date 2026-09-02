# 后端架构决策：本地服务化，而非微服务（ADR-001）

> 状态：已采纳（2026-07-22）。Phase 1 已落地，Phase 2/3 是路线图。
> 背景讨论：用户提出"上微服务"，痛点为**服务边界混乱、崩溃隔离、开发体验**；
> 部署目标确认为**纯本地桌面（+ Docker 自托管）**，无多用户云化计划。

## 决策

**保持现有三服务进程拓扑，不做微服务化**（不拆库、不引服务发现/消息总线、
不增加常驻进程数）。把力气花在三件事上：**契约固化、监督统一、单体内模块化**。

```
desktop (Electron)
  └─ rust_api :41000        ← API 网关 + SQLite 唯一写入者 + job 调度
       ├─ ai_service :41100  ← Python AI agent（HTTP；rust ai_proxy 按字节透传 SSE）
       └─ pipeline workers   ← Python OCR/翻译/渲染（子进程 + stdout 协议）
```

### 为什么不上微服务

单机单用户桌面应用不具备微服务要解决的任何前提：无独立伸缩需求、无团队
部署边界、故障隔离已由子进程模型提供。而代价全要付：桌面端监督 N 个常驻
进程（启动慢/端口冲突/Windows 防火墙逐进程弹窗）、SQLite 单写者被拆后的
一致性灾难、函数调用变网络调用。**边界先行、部署后置**：现在的三条边界
就是未来（若云化）的切线，届时换部署单元即可，代码不重写。

## 三条服务边界与契约现状

| 边界 | 协议 | 契约真值 | 门禁 |
|---|---|---|---|
| frontend ↔ rust_api | HTTP/JSON + SSE | 部分隐式 | 前端各 *-contract 测试 |
| rust_api ↔ ai_service | HTTP（ai_proxy 透传 /v1/ask、转发 conversations CRUD） | `services/contracts/ai-ask.v1.schema.json`（与 `packages/schemas` 字节级同步） | 双端契约测试（见下） |
| rust_api ↔ pipeline | 子进程 stdout 行协议 | `job_runner/process_contract.rs` + `stage_contract.rs`（代码即契约） | rust 单测 |

### 契约规则（Phase 1 已生效）

1. `packages/schemas/*.schema.json` 是 monorepo 上游真值；
   `services/contracts/*.schema.json` 是可独立打包后端使用的字节级镜像。
2. 每份契约配**双端测试**：生产者侧
   `services/ai/tests/test_contract_schema.py`、消费者侧对应的 web contract
   测试；`services/contracts/check_parity.py --require-upstream` 额外锁定两份
   schema 镜像一致。改契约必须让生产者、消费者和 parity 同步变绿。
3. **一份逻辑一个主人**：跨语言双实现视为缺陷。先例：Rust
   `visible_path_messages`（全仓无调用方、与 Python 版语义漂移）已删除，
   可见路径算法的唯一主人是 AI 服务
   `retainpdf_ai/conversation_tree.py::visible_path`；会话读写与摘要提交由
   `retainpdf_ai/conversation_state.py::ConversationState` 协调，`app.py`
   不再持有状态算法。
4. **配置单源**：`RETAIN_AI_API_KEYS` 缺省回退 `RETAIN_API_KEYS`，单机部署
   一把钥匙；显式设置仍优先。

## Phase 2：监督统一（稳定性/崩溃隔离）——已落地（2026-07-23）

1. **ai_service 收编 rust 监督** ✅：`services/ai_supervisor.rs` +
   `config/ai_service.rs`。`RUST_API_AI_SUPERVISE=1` 开启（**默认关闭**，
   开发模式手动跑 ai_service 行为不变）。开启后：spawn（互通 env 六件套
   自动注入，钥匙单源直接下发 rust key 集合）→ `/healthz` 就绪等待 →
   周期探活 → 进程退出/连续失败阈值 → 指数退避重启（健康运行过即复位）→
   随 rust 优雅退出回收进程树。
   - 关键实现教训（集成测试实证）：子进程必须 `configure_child_process`
     **自成进程组**——`terminate_job_process_tree` 是组杀（`kill(-pid)`），
     不建组则组杀落空、`child.wait()` 永等，监督器 shutdown 悬挂。
   - shutdown 用 `watch` 通道而非共享 `Notify`：一次性 notify 可能在任务
     未处于 await 时错过。
2. **ai_proxy 快速失败** ✅：监督器判定 unhealthy → 不发起上游连接，直接
   结构化 503（新增 `AppError::ServiceUnavailable`）；starting 放行直连；
   unsupervised 与历史行为完全一致。`/api/v1/health` 新增 `ai_service`
   状态字段（unsupervised/starting/healthy/unhealthy）。
3. **pipeline 卡死检测**：侦察确认已有**总时长超时**兜底
   （`runtime.timeout_seconds` + `persist_timeout_failure` + terminate 树），
   idle（无输出）检测收益有限，降级为欠账不在本 Phase 实施。

**桌面端切换指引（待做）**：desktop main 进程移除自拉 ai_service 的逻辑，
改为给 rust 进程设 `RUST_API_AI_SUPERVISE=1`（互通 env 由 rust 注入，
`desktop/src/main/backend-env.js` 里的 ai 相关变量可清理）。

## Phase 3：单体内模块化（开发体验）——进行中

rust_api 编译慢的解药是 **workspace crate 拆分**（库级边界，非服务边界）。
2026-07-23 实测依赖图（`use crate::` 抽取，无环、方向一致）：

```
config, error(→axum)        ← 零 crate 依赖
models ⇄ storage_paths      ← 唯一互依对，必须同 crate
  ↑ job_failure 三件套（→ models；OcrProviderDiagnostics 本体在 models::domain，
    对 ocr_provider 的 use 只是 re-export 路径，可一行斩断）
db, ocr_provider(→reqwest), worker_command, job_events
job_runner → services → routes → app
```

**第一刀：`crates/retain-core`——已落地（2026-07-23）** = config + models +
storage_paths + job_failure 三件套（~12k 行冷区，git mv 保留历史）。手法与实测：
- 主 crate lib.rs 做**模块级 re-export**（`pub use retain_core::{config, models,
  storage_paths, job_failure};`），全仓 `use crate::` 路径零改写；
  `grep retain_core src/` 除 lib.rs 外为空（**后续新代码也应维持此纪律**）。
- error 留主 crate（→axum）；ocr_provider 留主 crate（→reqwest），job_failure
  对它的两处 use 改从 `models::domain` 直取同一类型。
- **计划外发现**：`models/defaults.rs` 调 `ocr_provider::paddle_default_model()`
  ——所在 `provider_config.rs` 自包含（std+serde_json），整文件搬入
  retain-core 为 `config::provider_config`，ocr_provider 侧 re-export 兜住
  原路径。job_failure_structured/support 是 `#[path]` 私有子模块，不在
  lib.rs 重复声明（会把同一文件编译两份）。
- **坑**：`env!("CARGO_MANIFEST_DIR")` 随 crate 下移两级——两处
  `ancestors().nth(n)` 相应 +2（provider_config::config_path、
  paths::default_rust_api_root），解析结果与拆分前逐字节一致。
- retain-core 依赖仅 serde/serde_json/anyhow/chrono/fastrand；可见性零放宽
  （39 处 pub(crate) 无一被主 crate 引用）。
- 验收：`cargo test --workspace` 270（rust_api）+ 44（retain-core）= 314，
  零缺失。**注意根目录裸 `cargo test` 只跑主 crate，CI/习惯须带
  `--workspace`**。结构性收益达标：改热区（services）后 retain-core 完全
  不重编（`cargo check -v` 仅 Compiling rust_api）；增量 real 时间约
  -12%~-15%（1.35→1.12s 等，绝对值小因 incremental 已吃掉大头，
  收益会随 retain-core 增厚放大）。

**第二刀：`crates/retain-data`——已落地（2026-07-23）** = db + job_events +
worker_command + ocr_provider（~8.9k 行，git mv 106 个 rename）。
- **链式 re-export**：retain-data lib.rs 先 `pub use retain_core::{config,
  job_failure, models, storage_paths};` 再声明四个 pub mod——搬入文件里的
  `crate::models` 等原样解析，路径零改写手法可逐级复用。
- 可见性放宽仅 5 条，全在 worker_command（build_ocr_command /
  build_worker_stage_command / WorkerStageCommand 及两条 re-export），
  子模块本身仍私有，暴露面未超出原 crate 内可达面。
- 验收：workspace 44 + 52 + 218 = 314，零缩水；`retain_data`/`retain_core`
  均不泄漏出主 crate lib.rs；改 services 后两个子 crate 零重编（结构性
  隔离达标）。check 时长本批基本持平（rust_api 自身仍是大头）——收益
  在依赖方向的 Cargo 强制与后续 job_runner 拆出后的累积。

**第三刀：`crates/retain-jobs`——已落地（2026-07-23）** = job_runner
（61 文件 ~7k 行）。侦察证实 job_runner 零引用 crate::error/services/app，
依赖全落前两刀；lib.rs 两级链式 re-export（retain-core + retain-data）。
- 可见性放宽集中在 mod.rs 的 4 条 re-export 及其定义处（spawn_job、
  configure_child_process、terminate_job_process_tree_blocking、
  cancel_registry 两函数、ProcessRuntimeDeps/JobPersistDeps）——正是
  主 crate 5 个调用点用到的面，无过度暴露。
- 唯一反向耦合在测试里：process_runner.rs 测试借主 crate `AppState` 当
  四字段容器——测试内建同形 `TestState` 斩断，断言零改动。
- 验收：workspace 44+52+56+162 = 314，零缩水；crate 名不泄漏出 lib.rs；
  改 services 后三个子 crate 零重编。

**Phase 3 拆分完成后的格局**：主 crate 22.3k 行（services/routes/app/
error/auth + api_tests），retain-core 8.7k / retain-data 8.4k /
retain-jobs 7.0k——约 52% 的代码移出了编译热路径，依赖方向由 Cargo
强制。增量 check 绝对值本就 ~1.4s（incremental 已高效），拆分收益主要
是**结构性隔离**（改上层不重编下层）与大改动/冷构建场景。
新代码纪律：引用子 crate 内容仍走 `crate::config::` 等 re-export 路径，
`retain_core::`/`retain_data::`/`retain_jobs::` 只许出现在 lib.rs。

## 已知欠账（按此架构继续清）

- ~~rust_api ↔ pipeline 的 stdout 协议尚未 schema 化~~ **已落地（2026-07-23）**：
  `contracts/pipeline-stdout.v1.schema.json` 单一真值（五类行：带标签工件行
  ×16、artifact_published JSONL 事件、指标行 ×5、provider 状态行、阶段前缀行）
  + 双端锁：rust 侧 `retain-jobs stdout_parser/contract_lock.rs`（6 测试，
  行为级——契约示例喂 apply_line 断言真落值；key/标签集合双向相等）、
  python 侧 `pipeline/devtools/tests/pipeline/test_stdout_contract_schema.py`
  （5 测试——常量↔schema 对齐、每个标签有发射点、事件 key ⊆ 契约）。
  顺手收敛：4 个 provider 短语标签从 mineru 裸 f-string 收入
  `pipeline_shared/contracts.py` 单源（输出逐字节不变）。
  **坑**：`document_schema.DOCUMENT_SCHEMA_VERSION` 是 "1.1"，stdout 协议的
  "schema version" 行值是 "document.v1"——语义不同，已在 contracts.py 注释
  并锁死。**emit-only 分区**：`source json used` 标签行、translation
  diagnostics/debug_index/review 三个事件 key 是 python 发射但 rust 明确
  不消费（rust 走 storage_paths 按约定解析），双侧都有锁防误消费/误漂移。
- ~~conversations CRUD schema 未入契约目录~~ **已落地（2026-07-23）**：
  `contracts/ai-conversations.v1.schema.json`（六端点 + 九个结构体定义，
  含消息树 parent_id/head_id 语义）。实际拓扑与旧欠账描述相反：**rust 是
  生产者**（SQLite 唯一写者，routes/library_extras.rs），ai_service
  （rust_client.py）与前端（src/js/api/conversations.ts）都是消费者。
  三端锁：rust `api_tests/conversations_contract.rs`（视图序列化键集合
  与契约相等、输入按契约示例可反序列化/缺必填即拒、端点真实挂载）、
  python `tests/test_conversations_contract.py`（请求路径 ⊆ 契约端点、
  写入载荷键 ⊆ 契约输入）、frontend
  `tests/ai-conversations-contract.test.mjs`（TS 类型逐字段相等、路径与
  载荷双向覆盖）。至此三条服务边界的显式契约全部落地。
- 迁移阶梯测试已改为与 `versioned_migration_count()` 动态同步（写死数字
  曾在 v3 加入后红了一轮）——新增迁移无需再改测试
