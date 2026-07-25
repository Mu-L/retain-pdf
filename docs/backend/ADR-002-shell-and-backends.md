# ADR-002：壳 + 后端进程组

> 状态：已采纳（2026-07-24）。**部分推翻 ADR-001** 中"不增加常驻进程数"一条。
> 触发痛点：改一行 API 代码要重启整个后端，正在跑的翻译任务被杀
> （`state_recovery` 把孤儿 worker 终止并标记 `worker_orphaned_after_restart`）。

## 为什么推翻 ADR-001 的那一条

ADR-001 的判断针对**部署形态**（单机单用户不需要按服务伸缩），那部分依然成立。
但它没预料到两件事：

1. **rust_api 长成了身兼四职的 22.3k 行单体**：HTTP 网关 + SQLite 唯一写者 +
   任务调度 + AI 代理。四者变更频率差一个数量级——路由天天改，任务调度几周
   才动一次——却被绑在同一个进程生命周期上。
2. **痛点是开发粒度，不是部署粒度**。改路由重启进程 → 子进程 worker 被连坐，
   十分钟的翻译白跑。这是进程边界画错位置，不是"要不要微服务"。

结论：**按变更频率切进程，不按业务域切**。切完仍是本地单用户拓扑，不引服务
发现、不引消息总线、不拆库——ADR-001 的其余约束全部保留。

## 目标拓扑

```
desktop (Electron)
  └─ retain-shell :41000      ← HTTP 网关 + 图书馆/文档 CRUD + AI 代理 + 监督
       ├─ retain-jobsd :41002 ← 任务调度 + worker 监督（内部 HTTP，仅监听 127.0.0.1）
       │    └─ pipeline workers（子进程，进程组隔离）
       └─ ai_service :41100   ← Python AI agent
```

改壳 → 只重启壳，jobsd 与其 worker 毫发无伤，翻译继续跑。
只有改 job_runner 才需要重启 jobsd——而那时本来就在动这块代码。

## 可行性实证（2026-07-24 实测，非推断）

| 关口 | 结论 | 依据 |
|---|---|---|
| 接缝大小 | **3 个操作，58 行** | `services/runtime_gateway.rs` 全部公开面：`JobRuntimeLauncher::launch`、`RuntimeControl::{request_cancel,clear_cancel}`、`terminate_runtime_process` |
| 注入点 | **现成** | launcher 本就是 `Arc<dyn Fn(String)>` 策略对象，换实现即可，非侵入 |
| 调用点 | **2 处** | `app/jobs.rs`（装配）、`services/jobs/control.rs`（取消/终止） |
| 实时进度 | **已全走 DB** | `live_stage/combined_events.rs::list_combined_job_events` 读 `db.list_job_events`，壳无需任何内存态即可服务 SSE/查询 |
| 共享内存态 | **可整体搬走** | `canceled_jobs`、`job_slots` 仅被 job_runner 消费；`downloads_lock` 归壳自有 |
| 数据面 | **无需改造** | SQLite 已是 `journal_mode=WAL` + `busy_timeout`（`db.rs`），多进程访问同一库是 SQLite 支持的配置 |

## 内部契约：jobs-control.v1

`backend/contracts/jobs-control.v1.schema.json`，四个操作一一对应现有接缝：

| 操作 | 端点 | 语义 |
|---|---|---|
| launch | `POST /internal/v1/jobs/{job_id}/launch` | 发射后不管（与现有闭包同语义） |
| cancel | `POST /internal/v1/jobs/{job_id}/cancel` | 写取消注册表 |
| clear cancel | `DELETE /internal/v1/jobs/{job_id}/cancel` | 清理竞态残留项 |
| terminate | `POST /internal/v1/processes/{pid}/terminate` | 组杀进程树 |

仅监听 `127.0.0.1`，鉴权复用 `RETAIN_API_KEYS` 单源。

## 迁移策略：双实现，默认零变化

`runtime_gateway` 的两个类型改为双实现：

- **InProcess**（默认）：今天的行为，闭包直调 `spawn_job`，单进程跑
- **Remote**：HTTP 调 jobsd，由 `RUST_API_JOBS_MODE=remote` 开启

好处是这一刀**加法式落地**：不开开关时全量测试与运行行为逐字节不变，
开关打开才走新路径。开发/桌面可各自选择，回滚只需改一个 env。

## 分期

- **Phase 1——已落地（2026-07-24）**：契约 + `crates/retain-jobsd` 二进制 +
  双实现接缝。默认 InProcess，行为零变化。
  - 接缝改造：`JobRuntime` 枚举（InProcess / Remote）收口四个操作；
    `JobRuntimeLauncher` 保持 `Arc<dyn Fn>` 形状不变，只在 `app/jobs.rs`
    按模式换闭包——上层（routes / services/jobs）**一行未改**。
  - jobsd 持有自己的 `canceled_jobs` / `job_slots`；壳在远端模式下不再需要
    这两份内存态。
  - 契约双端锁：jobsd 侧 `contract_lock.rs`（路由与契约端点双向相等、
    HTTP 方法齐备、只绑回环）、壳侧 `api_tests/jobs_control_contract.rs`
    （发出路径与契约双向相等、每个操作可追溯到它取代的接缝函数、
    默认模式必须是进程内）。
  - 验收：`cargo test --workspace` 331/331（323→331：+2 配置、+3 jobsd 锁、
    +3 壳侧锁）；架构检查通过；jobsd 四端点 + 鉴权真机冒烟通过；
    壳以 `RUST_API_JOBS_MODE=remote` 与 jobsd 并肩启动、双方 health 正常。
  - **尚未验证**：真实任务（上传 PDF → OCR → 翻译）在远端模式下端到端跑通，
    需要真 PDF 与 provider 凭据，留待 Phase 3 dev 脚本就绪后手动跑一轮。
  - 坑：`auth.local.json` 优先于 `RUST_API_KEYS` 环境变量——冒烟时用 env
    设的 key 会被静默忽略（这也正好证明壳与 jobsd 的钥匙天然同源）。
  - 坑：架构门禁是文本扫描，doc 注释里出现 `AppState` 字样也会判越界；
    改注释措辞而非放宽门禁。
- **Phase 2**：壳侧移除 job_runner 依赖（编译期隔离）——改壳不再重编任务栈，
  壳的重启成本进一步下降。
- **Phase 3**：dev 脚本（分别拉三个进程、各自热重载）+ 桌面端监督接线
  （复用 ai_supervisor 模式监督 jobsd）+ 文档。

## 与既有欠账的关系

- **B 方案（任务彻底脱离后端生命周期）不作废，降级为后续可选**：本 ADR 让
  "改壳不杀任务"成立，但"改 jobsd 也不杀任务"仍需 B（worker 输出落盘 +
  重启后按偏移续读 + 退出码经协议回传）。实测确认 B 需重写 stdio/退出码/
  超时/失败判定四条父子耦合，风险高于本 ADR 一个量级，故后置。
- 桌面端 `RUST_API_AI_SUPERVISE=1` 切换与本 ADR 的 jobsd 监督可一并做（Phase 3）。
