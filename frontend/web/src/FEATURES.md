# `apps/web/src` 功能与依赖边界

本文说明三页入口、主页的两套 `features`、Reader 包边界，以及共享代码应放在哪里。

## 总览

```text
apps/web/src/
├── pages/
│   ├── home/              # 主页 React UI 与装配
│   │   ├── composition/   # 只接线：external → 领域与 UI
│   │   └── features/      # React UI、hooks、page store
│   ├── detail/            # 独立任务详情页
│   └── reader/            # @retainpdf/reader 的宿主入口与 adapters
├── js/
│   ├── api/               # HTTP 与后端契约
│   ├── features/          # 命令式领域逻辑、ports 与 state
│   ├── job-detail/        # Web 宿主任务详情逻辑
│   ├── status-detail/     # 状态详情 presenter
│   └── config/ state/ mock/ islands/ …
├── shared/                # 跨页 React、主题、装饰、导航、Reader 宿主能力
├── styles/                # home/detail 样式与 Reader 样式代理
└── components/ lib/       # 通用 UI 与兼容入口
```

| 层 | 路径 | 职责 |
|----|------|------|
| 页面 React | `pages/*` | UI、hooks、页面 store 与宿主挂载 |
| 命令式领域 | `js/features/*` | 提交、上传、轮询、凭据、术语表等非 UI 逻辑 |
| 共享 API | `js/api/*` | fetch/XHR 封装与后端端点客户端 |
| 共享宿主能力 | `shared/*` | 跨页 hook、主题、Reader adapter 实现等 |
| 装配 | `pages/home/composition/*` | 依赖接线，不承载业务规则 |
| 共享弹窗 UI | `components/ui/dialog.tsx` | 普通弹窗的遮罩、尺寸、壳、标题/正文/页脚、关闭与嵌套层级 |

## 主页：两套 `features`

主页同时存在：

1. `src/js/features/*`：命令式领域层，通常暴露 controller、mount、port 或 store。
2. `src/pages/home/features/*`：React 视图、页面 hooks、对话框与 UI store。

它们是领域层与 UI 层，不是重复实现。主页对 `src/js/*` 的依赖统一经 `pages/home/composition/external.ts` 导出；新增接线写在对应 `create-*.ts`，不要在 React feature 中新增深层 `../../../js` import。

| 命令式领域 | React UI | 关系 |
|------------|----------|------|
| `app-actions` | workflow/status/upload 消费 | 提交任务与提交后启动轮询 |
| `job-runtime` | status/library 消费 | 当前任务轮询与可见状态同步 |
| `upload` | `workflow` | 上传状态、页码范围与上传视图 |
| `workflow` | `workflow` | 工作流规则、payload 与对话框 |
| `credentials` | `credentials` | 凭据状态、校验与设置 UI |
| `glossaries` | `glossaries` | 术语表 controller 与编辑 UI |
| `recent-jobs` / `documents-library` | `library` / `collections` | 书架资源、任务卡与合集 |
| `status-detail` | `status` / `status-detail` | 状态卡与详情弹窗 |
| `reader-dialog` | `reader` | 主页打开阅读器的路由与软宿主 |
| `artifact-downloads` | library/status 消费 | 受保护产物下载 |

常见修改位置：

| 要修改的能力 | 优先路径 |
|--------------|----------|
| 书架卡片或书籍详情 UI | `pages/home/features/library/**` |
| 上传/翻译对话框 UI | `pages/home/features/workflow/**` |
| 提交任务 | `js/features/app-actions/**` + composition |
| 当前任务轮询 | `js/features/job-runtime/**` |
| 后端端点 | `js/api/**` |
| 新的 `js` 依赖接入主页 | `pages/home/composition/external.ts` + 对应 `create-*.ts` |

所有普通弹窗都从 `components/ui/dialog.tsx` 组合；feature 不直接导入 Radix Dialog。尺寸只从 `compact`、`standard`、`wide`、`workspace` 中选择。Reader 的全屏软宿主保留独立 surface 语义。

上传/翻译对话框采用单流程：一个 PDF 上传入口，上传完成后在同一动作区选择仅收藏、仅 OCR 或翻译；页码范围和术语表在主弹窗内展开，不创建嵌套 Dialog。

`workflow/components/UploadTile.tsx` 只负责 services/store 接线；`workflow/components/upload/*` 是不访问 home services 的展示层。上传卡、处理方式和提示视觉应在展示层修改，避免把 composition 依赖重新带回组件树叶。

主页 AI 的 durable PDF 操作位于 `pages/home/features/home-ask/operations/*`。其中 reducer/selectors 维护 conversation 与 request message 索引，controller 独占 operation 查询、CAS 动作和幂等 key，`AgentOperationCard` 等展示组件只接收 props。首轮提问必须先创建 conversation；`agent_operation`、`agent_confirmation_required` 和 `done.confirmation_requests` 都只作为刷新提示，前端按 `operation_id` 查询 Rust operation 获取权威状态，不解析模型确认文案。409 必须刷新 operation，不能重放 mutation；`ambiguous` 重试只有用户在风险弹窗中明确接受后才能携带 `accept_duplicate_risk`。刷新、重新联网和页面重新可见时再以 operation 列表恢复。操作卡展示的页程序只来自后端重新校验后的 `plan_steps`，不得直接展示 manifest、workspace 路径或 tool stdout。

`credentials/AgentRuntimeSettingsCard.tsx` 是 AI Agent 专用的安全配置入口。模型
Key 与 FX Gateway Key 只保存在该组件的临时 React state，提交到受鉴权的
`/api/v1/ai/runtime-config` 后立即清空；组件只读取后端返回的配置布尔值、掩码
和 active/configured runtime，不得把这些 Agent Key 接入旧的
`credentialsStatePort`、隐藏 input、desktop snapshot 或 localStorage。旧 OCR/
翻译任务凭据仍属于既有 workflow 协议，后续迁移不得与 Agent runtime 配置
重新合并成浏览器单一真值。主页 AI 输入门禁读取同一个后端安全视图：Markdown
检索问答与 OpenAI 兼容 Agent 检查模型 Key，FX Gateway Agent 只检查 Gateway
Key；旧模型 Key 仅在 Markdown 检索问答迁移期兼容，不得阻塞两个 Agent 模式。
`agent_confirmation_mode` 是全局 runtime 配置：`explicit` 逐步确认，`green_light`
允许 Agent 自动执行并提交受支持的 PDF 操作，但操作卡仍持续显示并保留取消入口。
配置保存后，只要 `restart_state`、`restart_required` 或 active/configured revision
任一表明尚未激活，主页 AI 就必须阻止新请求。浏览器旧模型配置只在同时存在旧 Key
时作为完整的单次请求覆盖；没有旧 Key 时不得用浏览器 URL/模型覆盖后端安全配置。
FX 模式另行读取和提交 `fx_gateway_base_url`；FX 0.0.5 只允许带端口的回环 HTTP
Gateway，设置界面必须持续显示该限制。空值表示使用官方 Gateway，远程地址继续
由 OpenAI 兼容 Agent 承担。

翻译任务的 API 配置在同一设置页公开 `API URL`、`模型` 和 `API Key`，支持
DeepSeek 以及提供 `/models`、Chat Completions 等 OpenAI 兼容协议的第三方
服务。三个字段继续落入既有 translation job payload；不要另造只在 UI 中生效
的 provider 状态。

详细接线顺序见 `pages/home/composition/README.md`。

## Reader：包实现与 Web 宿主

Reader 已不再由 `apps/web` 实现，也没有 `?engine=legacy` 的 Web 回退引擎。

| 层 | 路径 | 职责 |
|----|------|------|
| Reader 实现 | `packages/reader` | React 组件、hooks、PDF、批注、AI 与样式真值 |
| Web 页面入口 | `pages/reader/entry.tsx` | 注册 RetainPDF adapters 后显式调用 `bootReader()` |
| Web adapter 装配 | `pages/reader/adapters/retainpdf.ts` | 把宿主能力注入 `@retainpdf/reader/adapters` |
| Web 能力出口 | `pages/reader/external.ts` | API、下载、凭据、收藏与 AI 的单一出口 |
| 宿主实现 | `shared/reader/host/{ai,config,content,data,state}.ts` | RetainPDF 特有的窄适配能力 |
| Reader CSS 代理 | `styles/entries/reader.css` | 导入 `packages/reader/styles/entry.css` |

生产代码只使用 `@retainpdf/reader`、`@retainpdf/reader/boot`、`@retainpdf/reader/adapters`、`@retainpdf/reader/ai` 及公开的 `runtime/*` exports，不得直连 `packages/reader/src`。新的通用 Reader 功能应写入 `packages/reader`；只有 RetainPDF Web 特有的 API 或运行时适配才写在本应用。

## 详情页

`detail.html` → `pages/detail/entry.tsx` → `DetailApp`。`pages/detail/**` 对 `src/js/*` 的依赖统一由 `pages/detail/external.ts` 提供；任务详情的命令式 overview、Markdown、重试与链接逻辑位于 `js/job-detail/*`。

## 其它共享目录

| 路径 | 用途 |
|------|------|
| `@retainpdf/domain/job` | Job 归一化、产物、时间与诊断纯逻辑 |
| `@retainpdf/domain/job-status` | 阶段、进度与状态卡纯领域逻辑 |
| `js/config` | API、provider、runtime 与持久化配置 |
| `js/state` | Web 运行时 store 切片 |
| `js/mock` | URL `?mock=...` 使用的本地场景 |
| `js/islands` | 挂载在页面中的小型 Web Component |
| `js/app-framework` | 轻量 store、resource、command bus 与 selector |
| `shared/theme` / `shared/decor` | 三页主题与装饰舞台 |

## 边界门禁

- `pages/home/features` → `src/js/*`：只经 `pages/home/composition/external.ts`。
- `pages/detail` → `src/js/*`：只经 `pages/detail/external.ts`。
- `pages/reader` → Reader 实现：只经 `@retainpdf/reader` 的公开 exports。
- Job 与 Job Status：只经 `@retainpdf/domain/job`、`@retainpdf/domain/job-status`。
- 无 importer 不等于死代码；动态入口、测试和自定义元素注册都需要纳入判断。

这些规则由 `tests/architecture/*.test.mjs` 持续检查。

## 相关文档

| 文件 | 内容 |
|------|------|
| `../README.md` | 入口、命令与运行时配置 |
| `pages/home/composition/README.md` | 主页装配规则 |
| `pages/home/features/README.md` | 主页 React 域索引 |
| `pages/home/features/library/README.md` | 书架子目录与进度入口 |
| `pages/reader/README.md` | Reader 包与宿主边界 |
| `pages/detail/README.md` | 详情页 external 规则 |
| `styles/README.md` | CSS 入口与归属 |
