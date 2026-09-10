# 后端改动交接（给前端）

本文只记**需要前端配合才能落地**的后端改动：新端点、新字段、新错误码，以及
前端具体要改哪个文件。纯后端的加固（事务边界、超时收尾之类）不在这里。

按后端提交倒序排列，最新在上。

---

## 1. 收藏挡住删除 → 结构化 409 + 清空收藏端点

后端提交：`feat(library): 收藏挡住删除时返回结构化 409，并给出清空收藏的端点`

### 变了什么

删除文档 (`DELETE /api/v1/documents/:document_id`) 或删除馆藏图书
(`DELETE /api/v1/library/books/:job_id`) 被收藏锚点挡住时，409 的响应体从
「一句中文 message」变成了带 `error.code` 和 `error.details` 的结构化错误。

同时新增两个端点，用来一次性清空收藏。

### 前端要做什么

**别再从 message 里正则抠数字。** 那句话会随文案改动和多语言而变。

```jsonc
{
  "code": "DELETE_BLOCKED_BY_FAVORITES",
  "message": "document is referenced by 2 favorite(s); remove the favorites first",
  "error": {
    "code": "DELETE_BLOCKED_BY_FAVORITES",
    "http_status": 409,
    "details": {
      "scope": "document",              // 或 "job"
      "document_id": "6f1c…",           // scope=job 时是 job_id
      "favorite_count": 2,
      "clear_favorites_path": "/api/v1/documents/6f1c…/favorites"
    }
  }
}
```

文档级和 run 级**共用同一个错误码**，因为前端要做的事一模一样，只有清空目标
不同，而那个目标已经在 `clear_favorites_path` 里给好了。所以只需要一个分支：

> 读 `favorite_count` → 提示用户「该文档有 N 条收藏，是否一并删除？」
> → 确认后 `DELETE clear_favorites_path` → 重试原来的删除

`DELETE clear_favorites_path` 返回 `{"data": {"deleted_count": N}}`。

几个边界：

- 幂等：目标存在但没有收藏时返回 `deleted_count: 0`，不是错误
- 目标不存在是 **404**，不要和上一条混为一谈
- `force=true` **不绕过**收藏保护，它只绕过「运行中的任务不可删」
- run 级的清空会连 `{job_id}-ocr` 子任务的收藏一起清（因为它解锁的那次删除
  会连着删子任务），所以清一次就够，不会出现「重试又 409」

详见 [图书馆数据层 API](./library-api.md#两个必须处理的边界)。

---

## 2. 新增 `no_output_timeout_seconds`（空闲超时）

后端提交：`fix(jobs): 给 worker 输出收尾加上限…` 之后的空闲超时提交

### 变了什么

任务提交的 `runtime` 块多了一个字段：

```jsonc
"runtime": {
  "timeout_seconds": 1800,
  "no_output_timeout_seconds": 0    // 新增，0 = 关闭（默认）
}
```

`timeout_seconds` 是整段执行的上限，必须按最坏情况给——一本大部头翻译几小时
是正常的，阈值就得设到几小时。于是「打完第一行就卡住不动」这种情况也要等满
那几小时才被发现。

`no_output_timeout_seconds` 独立地盯「还在不在动」：每收到一行 stdout 就重新
计时，只有 worker 彻底不出声才触发。

两者都判为 `failed` / `process_timeout`（处置方式一样），但 `stage_detail` 不同：

| 触发者 | `stage_detail` |
|---|---|
| `timeout_seconds` | `provider timeout`（normalizing 阶段是 `normalization timeout`） |
| `no_output_timeout_seconds` | `no output for {N}s` |

**这个区分是给用户看的**：前者要调阈值或降并发，后者要查上游是不是不回包了。
如果前端有失败原因的展示或文案映射，`no output for {N}s` 需要一条对应的说法。

校验：负数会被 400 拒绝（`no_output_timeout_seconds must be zero (disabled) or
a positive integer`）；`0` 和正数都放行。

### 前端要做什么

**默认关闭，所以不改也不会坏。** 想让用户能设它的话，要改两处字段白名单——
它们是手写的列表，不是从 `@retainpdf/contracts` 的类型生成的：

- `frontend/packages/api/src/jobs-submit.ts` 的 `legacyTopLevelFields`
  （在 `"timeout_seconds"` 旁边加 `"no_output_timeout_seconds"`）
- `frontend/web/src/platform/api/legacy/jobs-submit.ts`：第 33 行附近的字段
  数组，以及第 101 行附近 `appendFormField(form, "timeout_seconds", …)` 那句
  旁边补一句同形的

multipart 提交路径（`/api/v1/translate/bundle` 等）后端已经接受同名的扁平
字段，语义与 JSON 的 `runtime` 块一致。

生成的 DTO 类型 `@retainpdf/contracts` 的 `RuntimeInput` 已经带上这个字段
（`contracts/dist/job-status.d.ts`），是 **required**——如果哪里在手工构造
完整的 `RuntimeInput` 对象，TypeScript 会要求补上，填 `0` 即可。

详见 [任务提交 API](../../../backend/api/docs/api-spec/jobs-submission.md) 的
Timeout note 一节。

---

## 3. 取消语义：normalizing 不再豁免

后端提交：`fix(jobs): 取消一律终止进程，normalizing 不再豁免`

### 变了什么

此前 OCR 任务在 `normalizing` 阶段点取消，后端会**跳过杀进程**，让它跑完。
结果是用户点了取消，任务却继续显示 running 直到自然结束。现在取消一律终止进程。

### 前端要做什么

**不用改代码**，但有一个时序需要知道：

OCR 专用的取消 (`POST /api/v1/ocr/jobs/{job_id}/cancel`) 只在任务还是
`queued` 时由它自己写终态行。过了这个点，它杀进程，终态由 runner 观察到进程
退出后写入。所以**取消后立刻轮询，可能还会读到一次 `running`**。

如果现在的实现是「取消成功 → 立即认定已取消 → 停止轮询」，那会显示不一致；
应该继续轮到状态真的变成 `canceled`。这个时序在改动前后都存在（改动前更糟：
它可能永远不变），只是现在窗口很短。

详见 [任务重试与控制](../../../backend/api/docs/api-spec/jobs-retry-and-control.md#cancel-job)。
