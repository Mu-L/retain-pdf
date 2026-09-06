# 流水线阶段测速

集中管理测速入口、指标读取、离线对比及测试。默认预检，不提交任务；`--run` 才会调用本地 API，OCR/翻译可能计费。

在仓库根目录运行，默认 PDF 为 `tmp/testPDF/test1.pdf`，默认复用本地数据库最新 Qwen 任务配置。建议用 `--config-job JOB_ID` 固定配置；不会读取浏览器未提交的设置。

```bash
# 1. OCR + 标准化
.venv/bin/python services/benchmarks/run.py --stage ocr --run

# 2. 只测翻译：替换 OCR_JOB 为上一步报告中的 job_id
.venv/bin/python services/benchmarks/run.py --stage translate --source-job OCR_JOB --run

# 3. 只测渲染：替换 TRANSLATE_JOB 为翻译任务 job_id
.venv/bin/python services/benchmarks/run.py --stage render --source-job TRANSLATE_JOB --run

# 4. 完整链路（包含渲染）
.venv/bin/python services/benchmarks/run.py --stage full --run

# 比较两次报告，不发起请求
.venv/bin/python services/benchmarks/compare.py BEFORE/report.json AFTER/report.json

# 工具回归测试，不调用供应商
.venv/bin/python -m pytest services/benchmarks/tests -q
```

可用 `--pdf PATH`、`--workers N`、`--batch-size N`、`--timeout SECONDS`。API 限制本机地址，默认 `http://127.0.0.1:41000`；本地开发鉴权不是默认值时，通过 `RETAIN_BENCH_API_KEY` 环境变量设置，勿放入命令行。

## 报告与计时边界

- 报告：`tmp/pipeline-benchmarks/<job_id>/report.json`；原始业务产物仍在 `data/jobs/<job_id>/`。脚本只复制指标白名单，不复制配置密钥和原始日志。
- `wall_seconds` 包含上传、API 排队、执行及轮询误差，不是纯阶段耗时；`server_duration_seconds` 只用服务端 `created_at → finished_at` 计算（包括排队），缺少时间戳则为 null。原 API `duration_seconds` 可能只覆盖末阶段，另存为 `last_stage_duration_seconds`，不再用作总时长。
- `model_executor` 读取现有 SQLite 的新请求日志。旧任务没有这些记录时 `available=false`；字段带 `known_count/unknown_count`，缺失值不补零。只导出指标和配置指纹，不导出响应正文或凭据；费用为未知，不据 token 计数宣称实际账单。
- `phase_elapsed_ms` 是翻译已有的内部计时（连续段复核、页面策略、主批次等）；重试计时可能与主任务重叠，不可相加。
- `stage_elapsed_observations` 保留 worker 事件中的计时观测，包括已有的标准化、渲染子阶段数据。同一阶段可有多个累计值，不能相加；未埋点则缺失，不补零。
- `ocr_child_metrics` 收集独立 OCR 子任务的计时，避免父任务未携带 OCR 事件而漏报。
- 标准化目前随 OCR 执行，不提供独立重跑入口；内部未覆盖的细分步骤需后续补埋点，工具不会捏造耗时。
- 默认保留系统缓存，不是冷缓存测试；OCR 复用情况记录为 `ocr_reused`，不同配置/缓存条件不得直接宣称性能提升。
- `translate` 不带 `--source-job` 时包含 OCR；带参数时先核对 PDF SHA-256 和前置产物，防止拿另一份 PDF 的结果测速。`render` 必须指定已翻译任务。
- 每次运行生成新任务 ID，不修改旧任务或删除缓存。超时/中断尝试取消本次任务；若 `cancel_requested=false`，请按报告的 job_id 检查服务端，勿盲目重新提交。

原 `services/scripts/benchmark_translation.py` 保留为兼容入口。

## 隔离的 Rust / Qwen 两页实测

`live_smoke.py` 默认测试 `test1.pdf` 第 1–2 页、并发 2；`--all-pages --workers 8` 测整本、并发 8。模型为 Qwen3.8-flash、关闭 thinking，复用指定任务的 OCR。使用临时 API 端口、独立数据库和产物目录，不重启当前服务、不复制旧翻译检查点、不自动重发任务。测试结束关闭临时服务并删除临时模型凭据副本，报告和产物保留在 `tmp/pipeline-benchmarks/rust-live-*/`。任务超时默认 1800 秒，可通过 `--timeout` 调整；不会改变单次模型请求截止时间。

```bash
# 先构建当前 Rust API，再预检（不计费）
cargo build --manifest-path services/api/Cargo.toml -p rust_api --bin rust_api --offline
.venv/bin/python services/benchmarks/live_smoke.py --source-job SOURCE_JOB
# 实测会计费；若本机代理使用 198.18/15 Fake-IP，需审查后另加 --allow-fake-ip
.venv/bin/python services/benchmarks/live_smoke.py --source-job SOURCE_JOB --run
# 整本翻译，并发 8（使用 Fake-IP 的本机代理环境另加 --allow-fake-ip）
.venv/bin/python services/benchmarks/live_smoke.py --source-job SOURCE_JOB --workers 8 --all-pages --run
```

2026-09-05 首次成功实测：35.28 秒，13 个 primary 操作全部成功，13 次上游请求，无重试/修复请求；输入 27004 tokens、输出 2346 tokens（缓存命中 12416 输入 tokens）。两页共 18 个条目：16 个 translated，2 个按规则保留原文（公式、编号 `(1)`）。这是两页翻译链路验证，不含 OCR、排版渲染，也不是整本 PDF 性能或质量结论。实际费用未知。

同日整本实测（`rust-live-lzo61u8o`）：17 页、并发 8、93.873 秒，84 个 primary 操作全部成功，84 次上游请求，无超时、重试或修复请求。142 个 translated，37 个按规则 kept_origin（33 个公式、4 个 skip_model_keep_origin 文本）。输入 175817 tokens、输出 20366 tokens，缓存命中 110464 输入 tokens；费用未知。这是复用 OCR 的全篇翻译，不含 OCR/渲染，未进行译文质量评测；页数与两页测试不同，不据此计算并发加速比。

共享队列＋页优先实测（`rust-live-y4o8_dx1`）：同为17页、并发8，49.607秒，95次请求全部一次成功；142 translated / 37 kept_origin。主翻译阶段38.094秒；输入201815、输出21060 tokens，缓存命中123520输入tokens。相对上一轮墙钟缩短47.2%，但同时按页拆分了普通传输批次（82→93批），不能把收益全归因于调度，也不能宣称费用降低。页优先是派发优先级，不是逐页完成屏障；跨页语义单元保持完整。

## 页内重组批实验（默认不启用）

`--strategy baseline` 保持共享队列原方案（默认）；`--strategy page_local_v1` 启用严格独立数字过滤和先按页组批，最多8项、2400源字符，保留现有低风险筛选。策略写入内部引擎指纹，不修改旧transport、公开接口或历史检查点。

诊断新增 `scheduler_metrics`：任务队列等待、峰值活动任务、每页首次结果应用时间。它们不是HTTP计数；真实请求/token以Rust `model_executor`为准。`first_page_commit_ms_since_run_start` 在checkpoint持久化后记录，可能包括翻译前的结构/策略提交，不能当作首页译文完成时间；结果应用时间也不等于提交时间。

获准的两次17页/并发8实测已完成，没有追加重跑：

| 指标 | baseline (`rust-live-d83jwzpa`) | page_local_v1 (`rust-live-5_yi9wgo`) |
|---|---:|---:|
| 墙钟秒 | 51.823 | 51.651 |
| 上游请求 | 97（96 primary + 1 repair） | 97（全 primary） |
| 输入 tokens | 194883 | 196366 |
| 输出 tokens | 20843 | 20730 |
| 缓存输入 tokens | 94208 | 117504 |
| translated / kept_origin / unresolved | 142 / 37 / 0 | 142 / 37 / 0 |

结论：候选未达到请求减少、输入token不增加的门槛，保留baseline为推荐策略。候选过滤1个编号，但批量批次数12→15，未形成净请求收益；候选字符上限与页内重组都会影响批数。两次前置连续段处理的成员关系还在3个条目上发生变化，不能据此次样本归因纯组批收益；源文和公式映射未变，结构对照门槛未通过不等于已经证明漏译。后续若研究组批，需要固定前置翻译计划做离线对照，本轮不额外调用模型。

```bash
.venv/bin/python services/benchmarks/live_smoke.py --source-job SOURCE_JOB --workers 8 --all-pages --strategy baseline --run
.venv/bin/python services/benchmarks/live_smoke.py --source-job SOURCE_JOB --workers 8 --all-pages --strategy page_local_v1 --run
.venv/bin/python services/benchmarks/compare_optimization.py BASELINE/report.json CANDIDATE/report.json --output COMPARISON.json
```

需要Fake-IP时显式追加 `--allow-fake-ip`。对照工具只读两次结果，检查条目覆盖、源文/公式/成员关系、最终状态以及请求/token/耗时门槛；它不是语义质量评估器，也不执行计费请求。

### 提示词精简（离线验证）

`translation_control_v8_compact_prompt` 合并通用规则，标题/参考文献要求按规范语义角色附加；公式指导仅约束译文内容，不再禁止调用方要求的 JSON/tagged 输出。单条和批量 direct_typst 的用户提示也遵循指定的输出协议。源文、上下文窗口、公式修复能力和回复数据结构保持不变。

用 `rust-live-d83jwzpa` 已有页产物，按 `translation` 单元哈希匹配 Rust primary 回执，离线重建 62 个单条请求（不含领域指导）：平均提示词 2994.3 → 2085.4 字符；四份固定模板合计 1832 → 947 字符。字符数不是 token 数，也不是已验证的费用或耗时收益；以上 51 秒实测发生在此次提示词改动之前。此次未新增模型调用。

模板内容参与 prompt hash，代码组装变化同时提升内部协议版本，避免新请求误用旧策略缓存；无需修改历史产物。

可重复运行的离线审计（只读页文件和 SQLite 回执，不启动服务、不调用模型、不输出正文或提示词）：

```bash
.venv/bin/python services/benchmarks/audit_prompts.py tmp/pipeline-benchmarks/rust-live-d83jwzpa/report.json
```

默认用当前 fast/简体中文提示词重建；其他设置显式传 `--mode sci --target-language 英文`。按原回执成员哈希确认单条、tagged 批量和成员 JSON 连续段，不依据请求先后猜分组；无法确认的请求列入 excluded，修复不重建。运行期领域、术语和记忆指引未完整持久化，因此不是原始 HTTP 请求的精确重放；历史 token 与当前字符统计分列，不能直接相减作为 token 节省。

当前基线全部 94 次主翻译请求可匹配：单条 62 次（平均 2085.4 字符）、批量 12 次（3667.4）、连续段 20 次（2819.0）。候选全部 95 次也可匹配：60 / 15 / 20 次。两份各有 2 次前置调用未重建，基线额外排除 1 次修复。下一次付费对照前，仍应冻结真正的翻译前计划及运行期指引，避免把该重建结果误当作严格同条件输入。

### 私有输入快照（默认关闭）

后续获准的 Rust 实测可显式增加 `--capture-inputs`，保存到该次隔离测试目录的 `private-inputs/`。此参数不替代 `--run`，不会自行授权计费。当前针对本地 POSIX 权限环境；Windows 未实现 ACL 保护，开启时拒绝继续。

- `plan-*.json`：在连续段规划、去重、跳过筛选和页优先排序之后，派发前保存批次、源文、成员关系、上下文与静态指引。它是本轮待派发计划，不是完整文档或自动恢复检查点。
- `request-*.json`：Rust executor 提交前保存 Python 最终 messages、temperature、response_format、稳定 operation/unit ID、连接指纹和计划引用，包含实际已拼入的运行期术语/记忆指引；前置领域/连续段判断发生在计划生成前，引用可为空。
- 不读取密钥、capability、HTTP headers、provider URL 或完整运行配置。**文件包含文档正文和指引，仍属于敏感数据**，不加入普通诊断上传；目录 0700、文件 0600，不接受符号链接。每次实验须使用独立目录。
- 原子发布、哈希校验、不可覆盖；同一请求 ID 输入变更时拒绝继续。开启捕获后，写入失败会在提交前停止，不默默丢证据继续计费。捕获成功不代表请求已提交、执行成功或计费成功。

离线检查及派发输入对照（不访问网络、不输出正文）：

```bash
.venv/bin/python services/benchmarks/inspect_capture.py /ABSOLUTE/RUN/private-inputs
.venv/bin/python services/benchmarks/inspect_capture.py /ABSOLUTE/RUN-A/private-inputs --compare /ABSOLUTE/RUN-B/private-inputs
```

派发输入指纹排除 prompt/engine 版本，允许研究提示词变化；`same_dispatch_inputs` 不证明动态指引相同，也不证明性能或质量通过。快照保存 Python 请求输入，不是 Rust 最终 provider HTTP body（模型、thinking 等由连接策略另行应用）。本阶段提供捕获和离线校验，**没有接入付费重放或用快照绕过前置阶段的生产入口**，旧日志也不会被伪造成精确快照。

### 假模型离线重放

```bash
.venv/bin/python services/benchmarks/replay_capture.py /ABSOLUTE/RUN/private-inputs
```

入口只支持内置假模型，没有 URL、密钥、真实模型或 `--run` 选项。先校验快照哈希、文件名、计划引用、稳定 unit/operation ID、连接指纹和主请求完整覆盖，再按计划批次顺序重放已经保存的最终 messages/temperature/response_format；不会重跑分组或提示词构建。修复输入若存在，紧跟所属 primary 重放，不根据假回复触发新的修复。

要求恰好一份非空计划；缓存命中或中断造成的主请求缺失会明确失败。计划生成前的请求仅统计排除，不猜测其执行顺序。顺序指页优先任务队列顺序，不代表历史并发开始/完成顺序。

测试夹具覆盖单条、批量、跨页连续段、公式、静态规则和运行期术语/记忆指引；网络 socket 被禁止，验证输入送达假模型前后完全一致且不修改快照。输出仅计数与摘要哈希，不输出原文或提示词。**这是输入恢复的 round-trip 测试，不是生产翻译/渲染全流程、速度或质量评估，也不能据此启动付费 A/B。**

### 生产入口零网络契约

`tests/test_production_translation_contract.py` 从生产 `translate_batch` 入口经过真实路由、提示词组装、结果解析与验证，Rust 分支在 executor client 处替换为假传输，legacy 分支在 HTTP session 处替换。测试同时禁止 socket 和 DNS；缓存重定向到测试临时目录，不读取用户缓存。子进程隔离避免旧测试的 `sys.modules` 动态替换污染生产导入链。

当前覆盖：legacy/Rust 的单条、tagged 批量、成员 JSON 连续段成功路径（消息摘要、结果和 Rust unit ID 契约）；Rust 连续段协议错误最多 primary+repair 两次、传输错误一次，并验证失败后新单元不再发请求。尚未覆盖 legacy 的全部重试组合，也不是整份 PDF 的质量/速度测试。

首批分层整理没有改变门禁规则：传输选择与独立数字策略移入 `core/execution_policy.py`；调度由调用者显式传入是否允许 tail retry；checkpoint 通过调用方注入的观察回调报告已提交页。固定顺序仍为 snapshot → save → observe → prune → event，旧 executor 异常导入入口保持可用。

### 首轮并行解耦记录

- 组批：`BatchDispatchPlan` 接收已经准备好的单元，负责去重、组批、页优先顺序、队列分配和统计；不进行文件/模型/记忆 I/O。`pending_units` 保留一次元数据准备、快照与执行装配。计划保留原始条目引用及候选浅拷贝规则，不是深层不可变文档；既有兼容导出和 runner 接口未删除。
- 提示词：三个现有 builder 入口保留签名，协议选择、输出规则和单条 user 消息组装收敛到协议模块。模板资源、消息字节、JSON 键序及 sci structured-decision 的历史行为保持不变，不夹带功能修复。
- 测试：五份 retrying-translator 测试共用正常包导入，不再伪造包或替换 `sys.modules`；新增模块/父包身份及 mock 异常恢复检查。

`tests/refactor_baseline.json` 仅含合成文本，固定整理前的 28 组完整消息、成员 ID 和 legacy/Rust 引擎指纹；用 `test_refactor_baseline.py` 逐字验证。扩展协议分支的基线从本地 `062eeafe` 原提示词模块生成，而不是接受重构后的输出。不要为了通过重构测试重新生成基线；合法的语义变更应单独审阅并更新指纹与期望。

本轮未修改 Rust 账本、请求预算、checkpoint 提交协议、生产 provider 设置或模板文本。源码行数减少不作为验收目标；后续 fallback 门面、provider 反向兼容入口和快照全局生命周期仍待单独整理。
