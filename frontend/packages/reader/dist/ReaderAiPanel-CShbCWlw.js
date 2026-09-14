import { jsx as i, jsxs as E, Fragment as we } from "react/jsx-runtime";
import { useState as K, useRef as L, useEffect as U, useMemo as X, useCallback as G, useId as ct } from "react";
import { Square as dt, ArrowUp as lt, Copy as ut, GitBranch as pt, RefreshCw as mt, Sigma as je, Table2 as ft, Image as ht, Type as gt, X as Ie, BookOpen as Ke, Sparkles as pe, Loader2 as be, FileText as _e, ArrowDown as We, ListTree as yt, FlaskConical as vt, ShieldCheck as wt, Bot as It, ChevronUp as bt, ChevronDown as Ue, TriangleAlert as He, ExternalLink as Rt, Check as Ge, Circle as Ct, Plus as Mt, Pencil as Nt, Trash2 as _t } from "lucide-react";
import { g as Ve, h as kt, d as At, b as St } from "./ReaderApp-BatUxjv6.js";
import { ThreadPrimitive as se, ComposerPrimitive as he, MessagePrimitive as Ye, ActionBarPrimitive as Me, useExternalStoreRuntime as $t, AssistantRuntimeProvider as xt } from "@assistant-ui/react";
import { A as Tt } from "./AiMarkdownAnswer-DET_KlrE.js";
import { M as Et, C as Pe, h as Pt } from "./config-CgaWliJ_.js";
import { k as oe, q as ae, v as Ot } from "./answer-enhance-W8TBaAUL.js";
import { Chat as Dt, useChat as Ft } from "@ai-sdk/react";
import { s as zt, l as Je, c as ue, b as Ae, a as qt } from "./thread-branch-store-Jy9wH_F1.js";
import { describeToolEvent as Bt } from "@retainpdf/domain/ai";
import { toSessionSummary as Lt, makeId as Ne } from "@retainpdf/domain/session";
import { l as jt } from "./ask-answerer-GNQdzitl.js";
import { getConversation as ye, messagesToBranchItems as ve, nextForkConversationTitle as Kt, forkConversationFromPath as Wt, deleteConversation as Ut, patchConversation as Ht, listConversations as Gt } from "@retainpdf/api/conversations";
import { getAgentOperation as Vt, listAgentOperations as Yt, runAgentOperation as Jt, cancelAgentOperation as Qt, commitAgentOperation as Xt, retryAgentOperation as Zt, fetchAgentOperationCandidate as en } from "@retainpdf/api/document-operations";
import { fetchAgentRuntimeConfig as tn } from "@retainpdf/api/agent-runtime-settings";
import { agentOperationShouldReplace as nn, agentOperationEventSeq as sn, agentOperationShouldPoll as rn, agentOperationErrorStatus as an, agentOperationErrorMessage as on, resolveAgentOperationActionKey as cn, clearAgentOperationActionKey as dn } from "@retainpdf/api/agent-operation-model";
function Qe(t) {
  return t.content.filter((e) => e.type === "text").map((e) => e.text).join(`
`).trim();
}
function Oe({ label: t }) {
  return /* @__PURE__ */ E("div", { className: "aui-thinking", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ i(be, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
    /* @__PURE__ */ i("span", { children: t || "思考中…" })
  ] });
}
function ln({ message: t }) {
  return /* @__PURE__ */ i(Ye.Root, { className: "aui-msg aui-msg-user", "data-role": "user", children: /* @__PURE__ */ i("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ i("div", { className: "aui-md-plain", children: Qe(t) }) }) });
}
function un({
  jobId: t,
  message: e,
  citations: n,
  progress: s,
  streaming: a,
  branchBusy: r,
  onJumpCitation: o,
  onBranchFromAnswer: c
}) {
  const m = Qe(e);
  return /* @__PURE__ */ i(Ye.Root, { className: "aui-msg aui-msg-assistant", "data-role": "assistant", children: /* @__PURE__ */ E("div", { className: "aui-msg-stack", children: [
    a && s ? /* @__PURE__ */ i(Oe, { label: s }) : null,
    a && !s && !m ? /* @__PURE__ */ i(Oe, { label: "思考中…" }) : null,
    m ? /* @__PURE__ */ i("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ i(
      Tt,
      {
        content: m,
        streaming: a,
        citations: n,
        jobId: t,
        className: "aui-md",
        streamingClassName: "aui-md-streaming",
        pendingClassName: "aui-md-pending",
        finalClassName: "aui-md-final",
        onJumpCitation: o
      }
    ) }) : null,
    /* @__PURE__ */ E(
      Me.Root,
      {
        className: "aui-msg-actions",
        "data-reader-ai-actions": "",
        hideWhenRunning: !0,
        autohide: "not-last",
        children: [
          /* @__PURE__ */ i(Me.Copy, { className: "aui-action-btn", "aria-label": "复制答案", title: "复制答案", children: /* @__PURE__ */ i(ut, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }) }),
          c ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "aui-action-btn aui-action-btn-branch",
              "aria-label": "从这里开新对话",
              title: "从这里开新对话",
              disabled: r,
              onClick: async () => {
                oe(1200, { overlayDelayMs: 0 }), ae(1200), await c(e.id);
              },
              children: /* @__PURE__ */ i(pt, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 })
            }
          ) : null,
          /* @__PURE__ */ i(Me.Reload, { className: "aui-action-btn", "aria-label": "重新生成", title: "重新生成", children: /* @__PURE__ */ i(mt, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 }) })
        ]
      }
    )
  ] }) });
}
function Xe({
  jobId: t,
  citationsByMessageId: e,
  progressByMessageId: n,
  streamingAssistantId: s,
  isRunning: a,
  branchBusy: r,
  onJumpCitation: o,
  onBranchFromAnswer: c
}) {
  return /* @__PURE__ */ i("div", { className: "aui-message-group", "data-slot": "aui_message-group", children: /* @__PURE__ */ i(se.Messages, { children: ({ message: m }) => {
    var v;
    if (m.role === "user") return /* @__PURE__ */ i(ln, { message: m });
    if (m.role !== "assistant") return null;
    const d = ((v = m.status) == null ? void 0 : v.type) === "running" || a && s === m.id;
    return /* @__PURE__ */ i(
      un,
      {
        jobId: t,
        message: m,
        citations: e[m.id] || [],
        progress: n[m.id] || "",
        streaming: d,
        branchBusy: r,
        onJumpCitation: o,
        onBranchFromAnswer: c
      }
    );
  } }) });
}
function pn({
  mode: t,
  disabled: e,
  onChange: n
}) {
  return /* @__PURE__ */ E("div", { className: "aui-assistant-mode", role: "group", "aria-label": "AI 模式", children: [
    /* @__PURE__ */ E(
      "button",
      {
        type: "button",
        className: t !== "operations" ? "is-active" : "",
        "aria-pressed": t !== "operations",
        disabled: e,
        onClick: () => n == null ? void 0 : n("reading"),
        children: [
          /* @__PURE__ */ i(Ke, { size: 12, strokeWidth: 2.2, "aria-hidden": !0 }),
          /* @__PURE__ */ i("span", { children: "阅读问答" })
        ]
      }
    ),
    /* @__PURE__ */ E(
      "button",
      {
        type: "button",
        className: t === "operations" ? "is-active" : "",
        "aria-pressed": t === "operations",
        disabled: e,
        onClick: () => n == null ? void 0 : n("operations"),
        children: [
          /* @__PURE__ */ i(pe, { size: 12, strokeWidth: 2.2, "aria-hidden": !0 }),
          /* @__PURE__ */ i("span", { children: "PDF Agent" })
        ]
      }
    )
  ] });
}
function mn({
  selectionContext: t,
  onClear: e
}) {
  if (!t) return null;
  const n = t.selectionType === "text" ? "text" : t.kind, s = t.selectionType === "text" ? t.quote : Ve(t.region, t.pane), a = n === "formula" ? "公式" : n === "table" ? "表格" : n === "figure" ? "图片" : "文字";
  return /* @__PURE__ */ E("div", { className: "aui-selection-context", "data-reader-ai-selection-context": "", children: [
    /* @__PURE__ */ i(n === "formula" ? je : n === "table" ? ft : n === "figure" ? ht : gt, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
    /* @__PURE__ */ E("span", { className: "aui-selection-context-meta", children: [
      t.pane === "translated" ? "译文" : "原文",
      " · ",
      t.page,
      " 页 · ",
      a
    ] }),
    /* @__PURE__ */ i("span", { className: "aui-selection-context-text", children: s || "已选择此区域" }),
    /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "aui-selection-context-remove",
        "aria-label": "移除选区上下文",
        title: "移除选区",
        onClick: e,
        children: /* @__PURE__ */ i(Ie, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
      }
    )
  ] });
}
function Ze({
  isRunning: t,
  branchBusy: e,
  mode: n,
  onModeChange: s,
  selectionContext: a,
  onClearSelectionContext: r
}) {
  return /* @__PURE__ */ E(he.Root, { className: "aui-composer", "data-reader-ai-composer": "", children: [
    /* @__PURE__ */ E("div", { className: "aui-composer-shell", children: [
      n !== "operations" ? /* @__PURE__ */ i(mn, { selectionContext: a, onClear: r }) : null,
      /* @__PURE__ */ i(
        he.Input,
        {
          className: "aui-input",
          rows: 1,
          placeholder: n === "operations" ? "描述要执行的 PDF 操作…" : "询问当前文档…",
          "aria-label": n === "operations" ? "描述 PDF 操作" : "向文档 AI 提问",
          autoFocus: !0,
          enterKeyHint: "send",
          disabled: e,
          submitMode: "enter"
        }
      ),
      /* @__PURE__ */ E("div", { className: "aui-composer-toolbar", children: [
        /* @__PURE__ */ i(pn, { mode: n, disabled: t || e, onChange: s }),
        /* @__PURE__ */ i("div", { className: "aui-composer-actions", children: t ? /* @__PURE__ */ i(he.Cancel, { className: "aui-send aui-send-stop", "aria-label": "停止生成", children: /* @__PURE__ */ i(dt, { size: 12, strokeWidth: 2.6, "aria-hidden": !0 }) }) : /* @__PURE__ */ i(he.Send, { className: "aui-send", "aria-label": "发送", children: /* @__PURE__ */ i(lt, { size: 16, strokeWidth: 2.5, "aria-hidden": !0 }) }) })
      ] })
    ] }),
    /* @__PURE__ */ i("p", { className: "aui-hint", children: "AI 可能会出错，请核对原文与引用" })
  ] });
}
function et() {
  return /* @__PURE__ */ E("div", { className: "aui-composer aui-composer-locked", role: "alert", children: [
    /* @__PURE__ */ i("p", { className: "aui-llm-lock-msg", children: Et }),
    /* @__PURE__ */ i("p", { className: "aui-hint", children: "请到首页「设置 → API 设置」填写模型 Key 后即可提问" })
  ] });
}
const fn = [
  { prompt: "把第 1 页旋转 90 度。", label: "旋转页面", icon: _e },
  { prompt: "删除最后一页。", label: "删除页面", icon: _e }
];
function hn({
  jobId: t,
  empty: e,
  citationsByMessageId: n,
  progressByMessageId: s,
  streamingAssistantId: a,
  isRunning: r,
  missingLlmKey: o,
  branchBusy: c,
  agentRequestBlocked: m = !1,
  agentOperationPanel: d,
  onModeChange: v,
  onJumpCitation: g,
  onBranchFromAnswer: I
}) {
  const u = c || m;
  return /* @__PURE__ */ E(we, { children: [
    e ? /* @__PURE__ */ E("div", { className: "aui-empty", children: [
      /* @__PURE__ */ i("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ i("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ i(pe, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ i("h2", { className: "aui-empty-title", children: "想怎样处理 PDF？" }),
      /* @__PURE__ */ i("p", { className: "aui-empty-sub", children: "创建候选版本后由你预览和确认" }),
      /* @__PURE__ */ i("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: fn.map((p) => {
        const T = p.icon;
        return /* @__PURE__ */ E(
          se.Suggestion,
          {
            prompt: p.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: u || o,
            children: [
              /* @__PURE__ */ i(T, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
              /* @__PURE__ */ i("span", { className: "aui-suggestion-label", children: p.label })
            ]
          },
          p.prompt
        );
      }) })
    ] }) : null,
    /* @__PURE__ */ i(
      Xe,
      {
        jobId: t,
        citationsByMessageId: n,
        progressByMessageId: s,
        streamingAssistantId: a,
        isRunning: r,
        branchBusy: c,
        onJumpCitation: g,
        onBranchFromAnswer: I
      }
    ),
    d,
    /* @__PURE__ */ E(se.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !c ? /* @__PURE__ */ i(
        se.ScrollToBottom,
        {
          className: "aui-scroll-bottom-btn aui-scroll-bottom",
          "aria-label": "滚到最新",
          children: /* @__PURE__ */ i(We, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
        }
      ) : null,
      o ? /* @__PURE__ */ i(et, {}) : /* @__PURE__ */ i(
        Ze,
        {
          isRunning: r,
          branchBusy: u,
          mode: "operations",
          onModeChange: v,
          selectionContext: null,
          onClearSelectionContext: void 0
        }
      )
    ] })
  ] });
}
const gn = [
  { prompt: "用几句话总结这篇文献的核心内容。", label: "总结本文", icon: Ke },
  { prompt: "这篇文献的主要结论是什么？", label: "提炼主要结论", icon: yt },
  { prompt: "作者用了什么方法或模型？", label: "梳理方法与模型", icon: vt },
  { prompt: "解释文中的关键公式。", label: "解释关键公式", icon: je }
];
function yn({
  jobId: t,
  empty: e,
  citationsByMessageId: n,
  progressByMessageId: s,
  streamingAssistantId: a,
  isRunning: r,
  missingLlmKey: o,
  branchBusy: c,
  composerDisabled: m = !1,
  onModeChange: d,
  onJumpCitation: v,
  onBranchFromAnswer: g,
  selectionContext: I = null,
  onClearSelectionContext: u,
  footerExtra: p = null
}) {
  return /* @__PURE__ */ E(we, { children: [
    e ? /* @__PURE__ */ E("div", { className: "aui-empty", children: [
      /* @__PURE__ */ i("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ i("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ i(pe, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ i("h2", { className: "aui-empty-title", children: "一起读懂这篇文档" }),
      /* @__PURE__ */ i("p", { className: "aui-empty-sub", children: "总结、解释、检索与计算，不修改 PDF" }),
      /* @__PURE__ */ i("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: gn.map((T) => {
        const x = T.icon;
        return /* @__PURE__ */ E(
          se.Suggestion,
          {
            prompt: T.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: c || m || o,
            children: [
              /* @__PURE__ */ i(x, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
              /* @__PURE__ */ i("span", { className: "aui-suggestion-label", children: T.label })
            ]
          },
          T.prompt
        );
      }) })
    ] }) : null,
    /* @__PURE__ */ i(
      Xe,
      {
        jobId: t,
        citationsByMessageId: n,
        progressByMessageId: s,
        streamingAssistantId: a,
        isRunning: r,
        branchBusy: c,
        onJumpCitation: v,
        onBranchFromAnswer: g
      }
    ),
    p,
    /* @__PURE__ */ E(se.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !c ? /* @__PURE__ */ i(
        se.ScrollToBottom,
        {
          className: "aui-scroll-bottom-btn aui-scroll-bottom",
          "aria-label": "滚到最新",
          children: /* @__PURE__ */ i(We, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
        }
      ) : null,
      o ? /* @__PURE__ */ i(et, {}) : /* @__PURE__ */ i(
        Ze,
        {
          isRunning: r,
          branchBusy: c || m,
          mode: "reading",
          onModeChange: d,
          selectionContext: I,
          onClearSelectionContext: u
        }
      )
    ] })
  ] });
}
function vn({
  jobId: t,
  messages: e,
  citationsByMessageId: n,
  progressByMessageId: s,
  streamingAssistantId: a,
  isRunning: r,
  missingLlmKey: o,
  branchBusy: c,
  agentRequestBlocked: m = !1,
  agentOperationPanel: d,
  assistantMode: v = "reading",
  onAssistantModeChange: g,
  onJumpCitation: I,
  onBranchFromAnswer: u,
  selectionContext: p = null,
  onClearSelectionContext: T
}) {
  const x = e.length === 0, S = v === "operations";
  return /* @__PURE__ */ i(
    se.Root,
    {
      className: `aui-thread aui-thread-root${o ? " is-llm-locked" : ""}`,
      "data-chat-ui": "assistant-ui-official-thread",
      children: /* @__PURE__ */ i(
        se.Viewport,
        {
          className: "aui-viewport",
          "data-slot": "aui_thread-viewport",
          "data-reader-ai-viewport": "true",
          turnAnchor: "top",
          autoScroll: !0,
          children: /* @__PURE__ */ i("div", { className: `aui-thread-inner${x ? " is-empty" : ""}`, children: S ? /* @__PURE__ */ i(
            hn,
            {
              jobId: t,
              empty: x,
              citationsByMessageId: n,
              progressByMessageId: s,
              streamingAssistantId: a,
              isRunning: r,
              missingLlmKey: o,
              branchBusy: c,
              agentRequestBlocked: m,
              agentOperationPanel: d,
              onModeChange: g,
              onJumpCitation: I,
              onBranchFromAnswer: u
            }
          ) : /* @__PURE__ */ i(
            yn,
            {
              jobId: t,
              empty: x,
              citationsByMessageId: n,
              progressByMessageId: s,
              streamingAssistantId: a,
              isRunning: r,
              missingLlmKey: o,
              branchBusy: c,
              composerDisabled: m,
              onModeChange: g,
              onJumpCitation: I,
              onBranchFromAnswer: u,
              selectionContext: p,
              onClearSelectionContext: T
            }
          ) })
        }
      )
    }
  );
}
const tt = "retainpdf.reader-agent-operation.dismissed.v1", wn = /* @__PURE__ */ new Set(["failed", "cancelled"]);
function De(t) {
  return [
    `${t.operation_id || ""}`.trim(),
    Number(t.current_attempt) || 0,
    `${t.status || ""}`
  ].join(":");
}
function In() {
  var t;
  try {
    const e = JSON.parse(((t = globalThis.localStorage) == null ? void 0 : t.getItem(tt)) || "[]");
    return new Set(Array.isArray(e) ? e.filter((n) => typeof n == "string") : []);
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function bn(t) {
  var e;
  try {
    (e = globalThis.localStorage) == null || e.setItem(
      tt,
      JSON.stringify(Array.from(t).slice(-100))
    );
  } catch {
  }
}
function nt(t, e) {
  switch (t) {
    case "draft":
    case "awaiting_confirmation":
      return e === "green_light" ? "等待自动执行" : "等待确认";
    case "queued":
      return "等待执行";
    case "running":
      return "正在执行";
    case "validating":
      return "正在验证";
    case "result_ready":
      return e === "green_light" ? "等待自动应用" : "候选已就绪";
    case "committed":
      return e === "green_light" ? "AI 已直接应用" : "已应用";
    case "failed":
      return "执行失败";
    case "cancelled":
      return "已取消";
    case "ambiguous":
      return "结果不确定";
    default:
      return `${t}`;
  }
}
function Rn(t) {
  switch (t) {
    case "draft":
    case "awaiting_confirmation":
      return [
        { action: "cancel", label: "拒绝" },
        { action: "run", label: "确认执行", primary: !0 }
      ];
    case "queued":
    case "running":
    case "validating":
      return [{ action: "cancel", label: "取消 PDF 操作", danger: !0 }];
    case "result_ready":
      return [
        { action: "cancel", label: "拒绝候选" },
        { action: "commit", label: "接受并应用", primary: !0 }
      ];
    case "failed":
      return [{ action: "retry", label: "重试", primary: !0 }];
    case "ambiguous":
      return [{ action: "retry", label: "确认风险并重试", danger: !0, risk: !0 }];
    default:
      return [];
  }
}
function Cn(t) {
  return t === "failed" || t === "ambiguous" ? He : t === "cancelled" ? Ie : t === "committed" || t === "result_ready" ? Ge : ["queued", "running", "validating"].includes(t) ? be : Ct;
}
function Mn({ events: t, mode: e }) {
  return /* @__PURE__ */ i("ol", { className: "reader-agent-operation-timeline", "aria-label": "PDF 操作步骤", children: t.map((n) => {
    const s = Cn(n.status), a = ["queued", "running", "validating"].includes(n.status);
    return /* @__PURE__ */ E("li", { children: [
      /* @__PURE__ */ i(s, { className: a ? "is-spinning" : "", size: 12, "aria-hidden": !0 }),
      /* @__PURE__ */ i("span", { children: n.summary || n.event || nt(n.status, e) }),
      /* @__PURE__ */ i("time", { children: n.ts ? new Date(n.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "" })
    ] }, `${n.attempt}:${n.seq}`);
  }) });
}
function Nn({
  operation: t,
  loadCandidate: e
}) {
  const [n, s] = K(!1), [a, r] = K(""), [o, c] = K(""), m = L("");
  return U(() => {
    let d = !1;
    return c(""), e(t).then((v) => {
      if (d) return;
      const g = URL.createObjectURL(v);
      m.current && URL.revokeObjectURL(m.current), m.current = g, r(g);
    }).catch(() => {
      d || c("候选 PDF 加载失败，请重试。");
    }), () => {
      d = !0;
    };
  }, [e, t.operation_id, t.current_attempt]), U(() => () => {
    m.current && URL.revokeObjectURL(m.current);
  }, []), /* @__PURE__ */ E(we, { children: [
    /* @__PURE__ */ E("div", { className: "reader-agent-operation-candidate", children: [
      /* @__PURE__ */ E("div", { children: [
        /* @__PURE__ */ i(_e, { size: 13, "aria-hidden": !0 }),
        /* @__PURE__ */ i("span", { children: "候选 PDF" })
      ] }),
      /* @__PURE__ */ i("button", { type: "button", disabled: !a, onClick: () => s((d) => !d), children: a ? n ? "收起" : "预览" : "加载中…" }),
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          disabled: !a,
          "aria-label": "新窗口打开候选 PDF",
          onClick: () => window.open(a, "_blank", "noopener,noreferrer"),
          children: /* @__PURE__ */ i(Rt, { size: 12, "aria-hidden": !0 })
        }
      )
    ] }),
    n ? /* @__PURE__ */ i("iframe", { className: "reader-agent-operation-preview", src: a, title: "候选 PDF 预览" }) : null,
    o ? /* @__PURE__ */ i("p", { className: "reader-agent-operation-error", role: "alert", children: o }) : null
  ] });
}
function _n({
  entry: t,
  mode: e,
  loadCandidate: n,
  onAction: s,
  onDismiss: a
}) {
  var x;
  const { operation: r, pendingAction: o, error: c } = t, [m, d] = K(!1), [v, g] = K(!1), I = r.events || [], u = Rn(r.status), p = !!((r.status === "result_ready" || r.status === "committed") && r.candidate_available), T = wn.has(r.status);
  return /* @__PURE__ */ E("article", { className: `reader-agent-operation-card is-${r.status}`, "data-operation-id": r.operation_id, children: [
    /* @__PURE__ */ E("header", { children: [
      /* @__PURE__ */ i("span", { className: "reader-agent-operation-icon", "aria-hidden": !0, children: /* @__PURE__ */ i(It, { size: 15 }) }),
      /* @__PURE__ */ E("div", { className: "reader-agent-operation-title", children: [
        /* @__PURE__ */ i("span", { children: "PDF 操作" }),
        /* @__PURE__ */ i("strong", { children: r.intent_summary || "处理当前 PDF" })
      ] }),
      /* @__PURE__ */ E("div", { className: "reader-agent-operation-head-actions", children: [
        /* @__PURE__ */ i("span", { className: "reader-agent-operation-status", children: nt(r.status, e) }),
        T ? /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "reader-agent-operation-dismiss",
            "aria-label": r.status === "failed" ? "隐藏这条失败提示" : "隐藏这条已取消提示",
            title: "隐藏",
            onClick: () => a(r),
            children: /* @__PURE__ */ i(Ie, { size: 13, "aria-hidden": !0 })
          }
        ) : null
      ] })
    ] }),
    (x = r.affected_pages) != null && x.length ? /* @__PURE__ */ E("p", { className: "reader-agent-operation-scope", children: [
      "影响页码：",
      r.affected_pages.join("、")
    ] }) : null,
    I.length ? /* @__PURE__ */ E("div", { className: "reader-agent-operation-details", children: [
      /* @__PURE__ */ E("button", { type: "button", onClick: () => d((S) => !S), children: [
        m ? /* @__PURE__ */ i(bt, { size: 12, "aria-hidden": !0 }) : /* @__PURE__ */ i(Ue, { size: 12, "aria-hidden": !0 }),
        m ? "收起步骤" : `执行步骤 ${I.length}`
      ] }),
      m ? /* @__PURE__ */ i(Mn, { events: I, mode: e }) : null
    ] }) : null,
    p ? /* @__PURE__ */ i(Nn, { operation: r, loadCandidate: n }) : null,
    c ? /* @__PURE__ */ i("p", { className: "reader-agent-operation-error", role: "alert", children: c }) : null,
    v ? /* @__PURE__ */ E("div", { className: "reader-agent-operation-risk", role: "alertdialog", "aria-label": "确认重复执行风险", children: [
      /* @__PURE__ */ i(He, { size: 14, "aria-hidden": !0 }),
      /* @__PURE__ */ i("p", { children: "上一次执行结果不确定，重试可能重复操作。确认接受风险后再继续。" }),
      /* @__PURE__ */ E("div", { children: [
        /* @__PURE__ */ i("button", { type: "button", onClick: () => g(!1), disabled: !!o, children: "返回" }),
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "is-danger",
            disabled: !!o,
            onClick: async () => {
              await s("retry", r, { acceptDuplicateRisk: !0 }), g(!1);
            },
            children: o === "retry" ? "处理中…" : "接受风险并重试"
          }
        )
      ] })
    ] }) : u.length ? /* @__PURE__ */ i("div", { className: "reader-agent-operation-actions", children: u.map((S) => /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: S.primary ? "is-primary" : S.danger ? "is-danger" : "",
        disabled: !!o,
        onClick: () => {
          S.risk ? g(!0) : s(S.action, r);
        },
        children: o === S.action ? "处理中…" : S.label
      },
      S.action
    )) }) : null
  ] });
}
function kn({
  entries: t,
  confirmationMode: e,
  runtimeRestarting: n,
  loadCandidate: s,
  onAction: a
}) {
  const [r, o] = K(In), c = t.filter((d) => !r.has(De(d.operation)));
  function m(d) {
    const v = De(d);
    o((g) => {
      const I = new Set(g);
      return I.add(v), bn(I), I;
    });
  }
  return /* @__PURE__ */ E("section", { className: `reader-agent-operations${c.length ? " has-operations" : ""}`, "aria-label": "AI PDF 操作", children: [
    /* @__PURE__ */ E("div", { className: `reader-agent-mode${e === "green_light" ? " is-green" : ""}`, children: [
      /* @__PURE__ */ i(wt, { size: 13, "aria-hidden": !0 }),
      /* @__PURE__ */ i("span", { children: e === "green_light" ? "绿灯模式 · 自动执行并应用" : "需要确认 · 操作前等待授权" })
    ] }),
    n ? /* @__PURE__ */ E("div", { className: "reader-agent-restarting", role: "status", children: [
      /* @__PURE__ */ i(be, { className: "is-spinning", size: 13, "aria-hidden": !0 }),
      "正在重启 Agent，新请求暂不可用"
    ] }) : null,
    c.map((d) => /* @__PURE__ */ i(
      _n,
      {
        entry: d,
        mode: e,
        loadCandidate: s,
        onAction: a,
        onDismiss: m
      },
      d.operation.operation_id
    ))
  ] });
}
const An = (t) => t, Sn = Object.freeze([]), $n = Object.freeze({}), Fe = Object.freeze({}), xn = Object.freeze({
  entries: [],
  confirmationMode: "explicit",
  runtimeRestarting: !1,
  runtimeCredentialConfigured: !1,
  perform: async () => {
  },
  loadCandidate: async () => new Blob()
});
function Tn(t) {
  return t.content.filter((e) => e.type === "text").map((e) => e.text).join(`
`).trim();
}
function En(t, e, n) {
  var s, a, r, o;
  return ((s = t.status) == null ? void 0 : s.type) === "running" || n && e === t.id ? { type: "running" } : ((a = t.status) == null ? void 0 : a.type) === "incomplete" || ((r = t.status) == null ? void 0 : r.type) === "error" ? {
    type: "incomplete",
    reason: ((o = t.status) == null ? void 0 : o.reason) === "cancelled" ? "cancelled" : "error"
  } : { type: "complete", reason: "stop" };
}
function Pn({
  jobId: t = "",
  messages: e = Sn,
  citationsByMessageId: n = $n,
  progressByMessageId: s = Fe,
  contentByMessageId: a = Fe,
  streamingAssistantId: r = "",
  isRunning: o = !1,
  onSubmit: c,
  onRetry: m,
  onCancel: d,
  onJumpCitation: v,
  onBranchFromAnswer: g,
  branchBusy: I = !1,
  agentOperations: u = xn,
  assistantMode: p = "reading",
  onAssistantModeChange: T,
  selectionContext: x = null,
  onClearSelectionContext: S
}) {
  const [, B] = K(0);
  U(() => {
    const N = () => B((b) => b + 1);
    return window.addEventListener("focus", N), window.addEventListener("storage", N), document.addEventListener(Pe, N), () => {
      window.removeEventListener("focus", N), window.removeEventListener("storage", N), document.removeEventListener(Pe, N);
    };
  }, []);
  const R = !Pt() && !u.runtimeCredentialConfigured, C = X(() => e.map((N) => ({
    id: N.id,
    role: N.role,
    content: a[N.id] || N.content || "",
    ...N.role === "assistant" ? { status: En(N, r, o) } : {}
  })), [a, o, e, r]), F = G(async (N) => {
    const b = N ? Math.max(0, e.findIndex((f) => f.id === N) + 1) : 0, $ = e.slice(b).find((f) => f.role === "assistant");
    $ && await m($.id);
  }, [e, m]), l = G(async (N) => {
    const b = Tn(N);
    !b || o || I || u.runtimeRestarting || R || await c(b);
  }, [u.runtimeRestarting, I, o, R, c]), h = G(async () => {
    await d();
  }, [d]), M = X(() => ({
    messages: C,
    isRunning: o,
    isDisabled: I || u.runtimeRestarting || R,
    convertMessage: An,
    onNew: l,
    onReload: F,
    onCancel: h
  }), [
    u.runtimeRestarting,
    I,
    h,
    l,
    o,
    R,
    F,
    C
  ]), k = $t(M);
  return /* @__PURE__ */ i(xt, { runtime: k, children: /* @__PURE__ */ i(
    vn,
    {
      jobId: t,
      messages: e,
      citationsByMessageId: n,
      progressByMessageId: s,
      streamingAssistantId: r,
      isRunning: o,
      missingLlmKey: R,
      branchBusy: I,
      agentRequestBlocked: u.runtimeRestarting,
      assistantMode: p,
      onAssistantModeChange: T,
      selectionContext: x,
      onClearSelectionContext: S,
      agentOperationPanel: u.entries.length > 0 || u.runtimeRestarting ? /* @__PURE__ */ i(
        kn,
        {
          entries: u.entries,
          confirmationMode: u.confirmationMode,
          runtimeRestarting: u.runtimeRestarting,
          loadCandidate: u.loadCandidate,
          onAction: u.perform
        }
      ) : null,
      onJumpCitation: v,
      onBranchFromAnswer: g
    }
  ) });
}
function ge(t = 900, e = 0) {
  oe(t, { overlayDelayMs: e }), ae(t);
}
function On({
  sessions: t,
  activeId: e,
  busy: n = !1,
  disabled: s = !1,
  errorText: a = "",
  onSwitch: r,
  onNew: o,
  onDelete: c,
  onRename: m
}) {
  const d = t.length > 0, v = n || s, [g, I] = K(!1), [u, p] = K(""), [T, x] = K(""), S = L(null), B = ct();
  function R(f) {
    const _ = `${f || ""}`.match(/^fork-(\d+)-(.*)$/i);
    if (!_) return f;
    const P = _[2].trim();
    return P ? `${P} · 分支${_[1]}` : `分支${_[1]}`;
  }
  const C = L(!1), F = L(null), l = t.find((f) => f.id === e) || null, h = l ? l.messageCount ? R(l.title) : `${R(l.title)}（空）` : d ? "选择以往对话" : "新对话";
  U(() => {
    if (!g) {
      p("");
      return;
    }
    const f = (w) => {
      if (C.current) return;
      const y = S.current;
      y && (w.target instanceof Node && y.contains(w.target) || (I(!1), p("")));
    }, _ = (w) => {
      w.key === "Escape" && (I(!1), p(""));
    }, P = window.setTimeout(() => {
      document.addEventListener("pointerdown", f, !0);
    }, 0);
    return document.addEventListener("keydown", _), () => {
      window.clearTimeout(P), document.removeEventListener("pointerdown", f, !0), document.removeEventListener("keydown", _);
    };
  }, [g]), U(() => {
    if (!u) return;
    const f = F.current;
    f && (f.focus(), f.select());
  }, [u]);
  const M = (f) => {
    const _ = `${f || ""}`.trim();
    !_ || v || C.current || u || (C.current = !0, ge(1e3, 0), requestAnimationFrame(() => {
      I(!1), window.setTimeout(() => {
        (async () => {
          try {
            await r(_);
          } finally {
            ge(400, 0), C.current = !1;
          }
        })();
      }, 40);
    }));
  }, k = (f) => {
    v || (p(f.id), x(f.title || ""));
  }, N = () => {
    const f = u, _ = T;
    p(""), f && m(f, _);
  }, b = () => {
    p(""), x("");
  }, $ = (f) => {
    var w;
    if (v || C.current) return;
    const _ = f.title || "未命名对话";
    (w = globalThis.confirm) != null && w.call(globalThis, `确定删除对话「${_}」？此操作不可恢复。`) && (C.current = !0, ge(800, 0), (async () => {
      try {
        await c(f.id);
      } finally {
        C.current = !1;
      }
    })());
  };
  return /* @__PURE__ */ E(
    "div",
    {
      className: "aui-session-bar",
      "data-reader-ai-sessions": "",
      ref: S,
      onPointerDown: (f) => {
        f.stopPropagation();
      },
      onClick: (f) => {
        f.stopPropagation();
      },
      children: [
        /* @__PURE__ */ E("div", { className: "aui-session-row", children: [
          /* @__PURE__ */ E(
            "button",
            {
              type: "button",
              className: `aui-session-trigger${g ? " is-open" : ""}`,
              "aria-label": "切换对话窗口",
              "aria-haspopup": "listbox",
              "aria-expanded": g,
              "aria-controls": B,
              disabled: v || !d,
              title: h,
              onClick: () => {
                v || !d || I((f) => !f);
              },
              children: [
                /* @__PURE__ */ i("span", { className: "aui-session-trigger-label", children: h }),
                /* @__PURE__ */ i(Ue, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 })
              ]
            }
          ),
          /* @__PURE__ */ E(
            "button",
            {
              type: "button",
              className: "aui-session-btn",
              disabled: v,
              title: "新对话窗口",
              "aria-label": "新对话",
              onClick: () => {
                v || C.current || (C.current = !0, ge(800), I(!1), p(""), window.setTimeout(() => {
                  (async () => {
                    try {
                      await o();
                    } finally {
                      C.current = !1;
                    }
                  })();
                }, 40));
              },
              children: [
                n ? /* @__PURE__ */ i(be, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ i(Mt, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
                /* @__PURE__ */ i("span", { children: "新对话" })
              ]
            }
          )
        ] }),
        g && d ? /* @__PURE__ */ i(
          "ul",
          {
            id: B,
            className: "aui-session-list",
            role: "listbox",
            "aria-label": "以往对话",
            children: t.map((f) => {
              const _ = f.messageCount ? R(f.title) : `${R(f.title)}（空）`, P = f.id === e, w = u === f.id;
              return /* @__PURE__ */ i("li", { className: "aui-session-row-item", role: "presentation", children: w ? /* @__PURE__ */ E("div", { className: "aui-session-edit", children: [
                /* @__PURE__ */ i(
                  "input",
                  {
                    ref: F,
                    className: "aui-session-edit-input",
                    value: T,
                    maxLength: 80,
                    "aria-label": "对话标题",
                    disabled: v,
                    onChange: (y) => x(y.target.value),
                    onKeyDown: (y) => {
                      y.key === "Enter" ? (y.preventDefault(), N()) : y.key === "Escape" && (y.preventDefault(), b());
                    },
                    onClick: (y) => y.stopPropagation()
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": "保存标题",
                    title: "保存",
                    disabled: v || !T.trim(),
                    onClick: (y) => {
                      y.stopPropagation(), N();
                    },
                    children: /* @__PURE__ */ i(Ge, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": "取消重命名",
                    title: "取消",
                    disabled: v,
                    onClick: (y) => {
                      y.stopPropagation(), b();
                    },
                    children: /* @__PURE__ */ i(Ie, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }) : /* @__PURE__ */ E(we, { children: [
                /* @__PURE__ */ E(
                  "button",
                  {
                    type: "button",
                    role: "option",
                    "aria-selected": P,
                    className: `aui-session-item${P ? " is-active" : ""}`,
                    disabled: v,
                    title: _,
                    onPointerDown: (y) => {
                      y.stopPropagation(), !P && !v && ae(1e3);
                    },
                    onClick: (y) => {
                      if (y.preventDefault(), y.stopPropagation(), P) {
                        I(!1);
                        return;
                      }
                      M(f.id);
                    },
                    children: [
                      /* @__PURE__ */ i("span", { className: "aui-session-item-title", children: _ }),
                      P ? /* @__PURE__ */ i("span", { className: "aui-session-item-badge", children: "当前" }) : null
                    ]
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": `重命名 ${_}`,
                    title: "重命名",
                    disabled: v,
                    onClick: (y) => {
                      y.preventDefault(), y.stopPropagation(), k(f);
                    },
                    children: /* @__PURE__ */ i(Nt, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn is-danger",
                    "aria-label": `删除 ${_}`,
                    title: "删除",
                    disabled: v,
                    onClick: (y) => {
                      y.preventDefault(), y.stopPropagation(), $(f);
                    },
                    children: /* @__PURE__ */ i(_t, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
                  }
                )
              ] }) }, f.id);
            })
          }
        ) : null,
        a ? /* @__PURE__ */ i("div", { className: "aui-session-error", role: "alert", children: a }) : null
      ]
    }
  );
}
function st(t) {
  return ((t == null ? void 0 : t.parts) || []).filter((e) => e.type === "text").map((e) => e.text).join("").trim();
}
function Dn(t, e) {
  const n = `${e.question || ""}`.trim();
  if (n) return n;
  for (let s = t.length - 1; s >= 0; s -= 1) {
    const a = t[s];
    if (a.role !== "user") continue;
    const r = st(a);
    if (r) return r;
  }
  return "";
}
function Fn(t) {
  const e = Number(t == null ? void 0 : t.status) || 0, n = `${(t == null ? void 0 : t.message) || ""}`;
  return e === 502 || /\b502\b/.test(n);
}
class zn {
  constructor(e) {
    this.options = e;
  }
  async sendMessages({
    abortSignal: e,
    body: n,
    messages: s,
    trigger: a
  }) {
    var p, T, x, S;
    const r = n || {}, o = Dn(s, r);
    if (!o) throw new Error("请输入问题。");
    const c = r.assistantMode || ((T = (p = this.options).getAssistantMode) == null ? void 0 : T.call(p)) || "reading", m = r.scope || "document", d = r.context ? { ...r.context } : null, v = `${r.assistantMessageId || ""}`.trim() || `a-${Date.now().toString(36)}`, g = `${v}-text`, I = this.options.getRemoteAnswerer(), u = ((S = (x = this.options).getLocalAnswerer) == null ? void 0 : S.call(x)) || null;
    if (!I && !u)
      throw new Error("问答暂不可用：请确认已打开任务阅读器。");
    return new ReadableStream({
      start: (B) => {
        let R = !1, C = "", F = {
          citations: [],
          progress: a === "regenerate-message" ? "正在重新生成…" : "正在检索文档…",
          status: "running"
        };
        const l = (M) => {
          R || B.enqueue(M);
        }, h = (M) => {
          F = { ...F, ...M }, l({ type: "message-metadata", messageMetadata: F });
        };
        l({ type: "start", messageId: v, messageMetadata: F }), l({ type: "start-step" }), l({ type: "text-start", id: g }), (async () => {
          var M, k, N, b, $, f;
          try {
            if (await ((M = I == null ? void 0 : I.ensureLoaded) == null ? void 0 : M.call(I, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
            let _ = I || u, P = !1, w;
            try {
              w = await _.answer({
                question: o,
                assistantMode: c,
                scope: m,
                context: d,
                parentId: `${r.parentId || ""}`.trim(),
                regenerate: r.regenerate ?? a === "regenerate-message",
                userMessageId: `${r.userMessageId || ""}`.trim(),
                assistantMessageId: v,
                onAgentSessionEvent: (A) => {
                  var Y, J, ce;
                  const D = (Y = A == null ? void 0 : A.capabilities) == null ? void 0 : Y.document_operation_confirmation_mode;
                  (D === "explicit" || D === "green_light") && ((ce = (J = this.options).onConfirmationMode) == null || ce.call(J, D));
                },
                onAgentOperationEvent: (A) => {
                  var Y, J;
                  const D = `${(A == null ? void 0 : A.operation_id) || ""}`.trim();
                  D && ((J = (Y = this.options).onAgentOperationSignal) == null || J.call(Y, {
                    operationId: D,
                    conversationId: `${(A == null ? void 0 : A.conversation_id) || ""}`.trim() || void 0
                  }));
                },
                onAgentConfirmationRequiredEvent: (A) => {
                  var Y, J;
                  const D = `${(A == null ? void 0 : A.operation_id) || ""}`.trim();
                  D && ((J = (Y = this.options).onAgentOperationSignal) == null || J.call(Y, { operationId: D }));
                },
                onToolEvent: (A) => {
                  if (C || e != null && e.aborted) return;
                  const D = Bt(A);
                  D && h({ progress: D });
                },
                onProgressEvent: (A) => {
                  if (C || e != null && e.aborted) return;
                  const D = `${(A == null ? void 0 : A.message) || ""}`.trim();
                  D && h({ progress: D });
                },
                onAnswerDelta: (A, D) => {
                  !D || e != null && e.aborted || (C += D, F.progress && h({ progress: "" }), l({ type: "text-delta", id: g, delta: D }));
                },
                onCompress: (A) => {
                  if (C || e != null && e.aborted) return;
                  const D = Number(A == null ? void 0 : A.dropped_turns) || 0;
                  D && h({ progress: `已压缩 ${D} 轮早期对话` });
                },
                signal: e
              });
            } catch (A) {
              if (e != null && e.aborted || c === "operations" || !I || !u || !Fn(A)) throw A;
              if (P = !0, h({ progress: "在线服务暂不可用，改用本地检索…" }), await ((k = u.ensureLoaded) == null ? void 0 : k.call(u, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
              _ = u, w = await _.answer({
                question: o,
                assistantMode: c,
                scope: m,
                context: d,
                signal: e
              });
            }
            if (e != null && e.aborted) {
              h({ progress: "", status: "cancelled" }), l({ type: "abort", reason: "cancelled" });
              return;
            }
            const y = w == null ? void 0 : w.confirmationMode;
            (y === "explicit" || y === "green_light") && ((b = (N = this.options).onConfirmationMode) == null || b.call(N, y));
            const z = `${(w == null ? void 0 : w.conversationId) || ""}`.trim() || void 0, H = /* @__PURE__ */ new Set();
            for (const A of (w == null ? void 0 : w.operationRefs) || []) {
              const D = typeof A == "string" ? A : `${(A == null ? void 0 : A.operation_id) || ""}`;
              D.trim() && H.add(D.trim());
            }
            for (const A of (w == null ? void 0 : w.confirmationRequests) || []) {
              const D = `${(A == null ? void 0 : A.operation_id) || ""}`.trim();
              D && H.add(D);
            }
            for (const A of H)
              (f = ($ = this.options).onAgentOperationSignal) == null || f.call($, {
                operationId: A,
                conversationId: z,
                confirmationMode: y || void 0
              });
            const O = Ot(w == null ? void 0 : w.citations);
            let q = zt(
              `${(w == null ? void 0 : w.answer) || C || ""}`.trim() || "没有找到可用回答。",
              O
            );
            if (P && (q += `

_在线服务暂不可用，以上来自本地文档检索。_`), (w == null ? void 0 : w.persisted) === !1 && (q += `

_⚠️ 本轮回答未能写入历史记录（存储暂时不可用），刷新后可能丢失。_`), !C)
              l({ type: "text-delta", id: g, delta: q });
            else if (q.startsWith(C)) {
              const A = q.slice(C.length);
              A && l({ type: "text-delta", id: g, delta: A });
            }
            l({ type: "text-end", id: g }), h({
              citations: O,
              persisted: (w == null ? void 0 : w.persisted) !== !1,
              progress: "",
              status: "complete"
            }), l({ type: "finish-step" }), l({ type: "finish", finishReason: "stop", messageMetadata: F });
          } catch (_) {
            e != null && e.aborted ? (h({ progress: "", status: "cancelled" }), l({ type: "abort", reason: "cancelled" })) : (h({ progress: "", status: "error" }), l({
              type: "error",
              errorText: _ instanceof Error ? _.message : "生成回答失败，请重试。"
            }));
          } finally {
            R || (R = !0, B.close());
          }
        })();
      }
    });
  }
  async reconnectToStream() {
    return null;
  }
}
function qn(t) {
  return st(t);
}
function rt(t) {
  return t.map((e) => {
    var n, s;
    return {
      id: e.id,
      role: e.role,
      metadata: e.role === "assistant" ? {
        citations: e.citations || [],
        progress: e.progress || "",
        status: ((n = e.status) == null ? void 0 : n.type) === "running" ? "running" : ((s = e.status) == null ? void 0 : s.type) === "incomplete" ? e.status.reason === "cancelled" ? "cancelled" : "error" : "complete"
      } : void 0,
      parts: [{ type: "text", text: e.content || "" }]
    };
  });
}
function Bn(t) {
  const e = t.metadata || {}, n = e.status === "running", s = e.status === "cancelled" || e.status === "error";
  return {
    id: t.id,
    role: t.role,
    content: qn(t),
    ...t.role === "assistant" ? {
      citations: e.citations || [],
      progress: e.progress || "",
      status: n ? { type: "running" } : s ? {
        type: "incomplete",
        reason: e.status === "cancelled" ? "cancelled" : "error"
      } : { type: "complete", reason: "stop" }
    } : {}
  };
}
function Ln(t) {
  const e = L(t.remoteAnswerer), n = L(t.localAnswerer), s = L(t.onAgentOperationSignal), a = L(t.onConfirmationMode), r = L(t.assistantMode);
  e.current = t.remoteAnswerer, n.current = t.localAnswerer, s.current = t.onAgentOperationSignal, a.current = t.onConfirmationMode, r.current = t.assistantMode;
  const o = X(() => new Dt({
    id: `reader-${t.jobId || "idle"}`,
    transport: new zn({
      jobId: t.jobId,
      getRemoteAnswerer: () => e.current,
      getLocalAnswerer: () => n.current,
      getAssistantMode: () => r.current,
      onAgentOperationSignal: (c) => {
        var m;
        return (m = s.current) == null ? void 0 : m.call(s, c);
      },
      onConfirmationMode: (c) => {
        var m;
        return (m = a.current) == null ? void 0 : m.call(a, c);
      }
    })
  }), [t.jobId]);
  return U(() => {
    t.enabled || o.stop();
  }, [o, t.enabled]), U(() => () => {
    o.stop();
  }, [o]), Ft({ chat: o, experimental_throttle: 16 });
}
function jn(t) {
  for (let e = t.length - 1; e >= 0; e -= 1)
    if (t[e].role === "assistant") return t[e];
}
function Se(t, e) {
  return {
    version: 1,
    headId: e,
    items: t.map((n) => {
      var s;
      return {
        parentId: n.parentId,
        message: {
          id: n.message.id,
          role: n.message.role,
          content: n.message.content,
          ...n.message.progress ? { progress: n.message.progress } : {},
          ...(s = n.message.citations) != null && s.length ? { citations: n.message.citations } : {},
          ...n.message.status ? {
            status: {
              type: n.message.status.type,
              ...n.message.status.reason ? { reason: `${n.message.status.reason}` } : {}
            }
          } : {}
        }
      };
    })
  };
}
function at(t) {
  return {
    items: t.items.map((e) => ({
      parentId: e.parentId,
      message: {
        ...e.message,
        citations: e.message.citations || [],
        status: e.message.status
      }
    })),
    headId: t.headId
  };
}
function ie(t, e) {
  if (!t.length) return [];
  const n = new Map(t.map((c) => [c.message.id, c])), s = e && n.get(e) || t.at(-1);
  if (!s) return [];
  const a = [];
  let r = s;
  const o = /* @__PURE__ */ new Set();
  for (; r && !o.has(r.message.id); )
    o.add(r.message.id), a.push(r.message), r = r.parentId ? n.get(r.parentId) : void 0;
  return a.reverse();
}
function Kn(t, e) {
  var n;
  return e ? ((n = t.find((s) => s.message.id === e)) == null ? void 0 : n.message) ?? null : null;
}
function Wn(t, e) {
  const n = new Map(t.map((o) => [o.message.id, o]));
  let s = n.get(e);
  if (!s) return [];
  const a = [], r = /* @__PURE__ */ new Set();
  for (; s && !r.has(s.message.id); )
    r.add(s.message.id), a.push(s), s = s.parentId ? n.get(s.parentId) : void 0;
  return a.reverse();
}
function Un(t, e, n) {
  var v, g, I, u;
  const s = `${e || ""}`.trim();
  if (!s || !t.length) return [];
  let a = s;
  t.some((p) => p.message.id === a) || (n && t.some((p) => p.message.id === n) ? a = n : a = ((v = [...t].reverse().find((p) => p.message.role === "assistant")) == null ? void 0 : v.message.id) || "");
  let r = Wn(t, a);
  if (r.length >= 2 && ((g = r.at(-1)) == null ? void 0 : g.message.role) === "assistant") return r;
  r.length === 1 && ((I = r[0]) == null ? void 0 : I.message.role) === "user" && (r = []);
  const o = ie(t, n || a);
  let c = o.findIndex((p) => p.id === a);
  if (c < 0 && (c = o.length - 1), c < 0) return r;
  const m = new Map(t.map((p) => [p.message.id, p])), d = o.slice(0, c + 1).map((p) => m.get(p.id)).filter((p) => !!p);
  for (; d.length && ((u = d.at(-1)) == null ? void 0 : u.message.role) !== "assistant"; ) d.pop();
  return d.length ? d : r;
}
function ke(t) {
  return t.map((e) => ({
    parentId: e.parentId,
    message: {
      ...e.message,
      citations: e.message.citations || [],
      status: e.message.status
    }
  }));
}
const Hn = {
  stopStream: () => Promise.resolve(),
  clearMessages: () => {
  },
  showMessages: () => {
  }
};
function Gn(t) {
  var n;
  const e = {};
  for (const s of t) {
    const a = s.message;
    a.role === "assistant" && ((n = a.citations) != null && n.length) && (e[a.id] = a.citations);
  }
  return e;
}
function Vn(t) {
  const e = {};
  for (const n of t) {
    const s = n.message;
    s.role === "assistant" && s.progress && (e[s.id] = s.progress);
  }
  return e;
}
function Yn(t) {
  const e = {};
  for (const n of t) {
    const s = n.message;
    s.content && (e[s.id] = s.content);
  }
  return e;
}
function Jn(t, e, n) {
  var a;
  const s = e || ((a = n == null ? void 0 : n.getConversationId) == null ? void 0 : a.call(n)) || "";
  return (t || []).map((r) => ({
    ...Lt(r, { active: s }),
    active: r.conversation_id === s
  }));
}
function Qn(t) {
  const { setItems: e, setHeadId: n } = t;
  return {
    readItems: () => t.itemsRef.current,
    readHeadId: () => t.headIdRef.current,
    appendExchange: ({ parentId: s, userId: a, assistantId: r, question: o, progress: c }) => {
      e((m) => [
        ...m,
        { parentId: s, message: { id: a, role: "user", content: o } },
        {
          parentId: a,
          message: {
            id: r,
            role: "assistant",
            content: "",
            progress: c,
            status: { type: "running" },
            citations: []
          }
        }
      ]), n(r);
    },
    appendRetryTurn: ({ assistantId: s, branchParent: a }) => {
      e((r) => [
        ...r,
        {
          parentId: a,
          message: {
            id: s,
            role: "assistant",
            content: "",
            progress: "正在重新生成…",
            status: { type: "running" },
            citations: []
          }
        }
      ]), n(s);
    },
    markRunningCancelled: () => {
      e(
        (s) => s.map(
          (a) => {
            var r;
            return ((r = a.message.status) == null ? void 0 : r.type) === "running" ? {
              ...a,
              message: {
                ...a.message,
                status: { type: "incomplete", reason: "cancelled" },
                progress: "",
                content: a.message.content.trim() || "已取消"
              }
            } : a;
          }
        )
      );
    },
    markRunningAsError: (s) => {
      const a = `${s || ""}`.trim() || "生成回答失败，请重试。";
      e((r) => r.map((o) => {
        var c;
        return ((c = o.message.status) == null ? void 0 : c.type) === "running" ? {
          ...o,
          message: {
            ...o.message,
            content: o.message.content.trim() || a,
            progress: "",
            citations: [],
            status: { type: "incomplete", reason: "error" }
          }
        } : o;
      }));
    },
    mergeChatMirror: (s) => {
      s.size && e((a) => a.map((r) => {
        const o = s.get(r.message.id);
        return o ? { ...r, message: { ...r.message, ...o } } : r;
      }));
    }
  };
}
function Xn(t) {
  const {
    jobId: e,
    documentId: n,
    enabled: s,
    refreshSessions: a,
    applyConversationTree: r,
    remoteRef: o,
    streamRef: c,
    itemsRef: m,
    documentIdRef: d,
    lastJobRef: v,
    persistReadyRef: g,
    switchTokenRef: I,
    sessionListGenerationRef: u,
    activeConversationIdRef: p,
    setItems: T,
    setHeadId: x,
    setSessions: S,
    setActiveConversationId: B,
    setSessionBusy: R
  } = t;
  U(() => {
    const C = o.current;
    if (!e) {
      u.current += 1, I.current += 1, T([]), x(null), S([]), B(""), c.current.clearMessages(), p.current = "", v.current = "", d.current = "", g.current = !1;
      return;
    }
    const F = v.current !== e;
    if (F && (u.current += 1, I.current += 1, v.current = e, g.current = !1, T([]), x(null), c.current.clearMessages(), S([]), B(""), p.current = "", d.current = "", R(!1)), !s || !C) {
      u.current += 1;
      return;
    }
    let l = !1;
    return (async () => {
      var $, f, _, P;
      let h = `${n || d.current || ""}`.trim();
      if (!h) {
        try {
          h = `${await (($ = C.getDocumentId) == null ? void 0 : $.call(C)) || ""}`.trim();
        } catch {
          h = "";
        }
        if (l) return;
      }
      h && (d.current = h);
      let M = null;
      if (!l && h && (M = await a(h)), !(F || !m.current.length) || l) {
        l || (g.current = !0);
        return;
      }
      const N = jt({ jobId: e, documentId: h }) || `${((f = C.getConversationId) == null ? void 0 : f.call(C)) || ""}`.trim();
      if (N) {
        B(N), p.current = N, (_ = C.setConversationId) == null || _.call(C, N, h);
        try {
          const w = await ye(N);
          if (l) return;
          const y = ve(w.messages || []);
          if (y.length) {
            r(y, w.head_id), requestAnimationFrame(() => {
              l || (g.current = !0);
            });
            return;
          }
        } catch {
        }
      }
      if (!l && h)
        try {
          const w = M ?? await a(h);
          if (l || !w) return;
          const y = w[0];
          if (y != null && y.conversation_id) {
            const z = y.conversation_id;
            B(z), p.current = z, (P = C.setConversationId) == null || P.call(C, z, h);
            try {
              const H = await ye(z);
              if (l) return;
              r(
                ve(H.messages || []),
                H.head_id
              ), requestAnimationFrame(() => {
                l || (g.current = !0);
              });
              return;
            } catch {
            }
          }
        } catch {
        }
      if (l) return;
      const b = Je({ jobId: e, documentId: h }, N);
      if (b != null && b.items.length) {
        const w = at(b);
        T(w.items), x(w.headId), c.current.showMessages(ie(w.items, w.headId));
      } else
        T([]), x(null), c.current.clearMessages();
      requestAnimationFrame(() => {
        l || (g.current = !0);
      });
    })(), () => {
      l = !0, u.current += 1;
    };
  }, [e, n, s, a, r]);
}
function Zn(t) {
  const {
    jobId: e,
    documentId: n,
    items: s,
    headId: a,
    activeConversationId: r,
    documentIdRef: o,
    persistReadyRef: c
  } = t;
  U(() => {
    if (!e || !c.current) return;
    const m = r, d = { jobId: e, documentId: n || o.current }, v = window.setTimeout(() => {
      if (!s.length) {
        ue(d, m);
        return;
      }
      Ae(d, Se(s, a), m);
    }, 280);
    return () => window.clearTimeout(v);
  }, [e, n, s, a, r]);
}
function es(t) {
  const {
    jobId: e,
    documentId: n,
    sessionBusy: s,
    sessions: a,
    streamRef: r,
    remoteRef: o,
    itemsRef: c,
    headIdRef: m,
    activeConversationIdRef: d,
    documentIdRef: v,
    switchTokenRef: g,
    persistReadyRef: I,
    setSessionBusy: u,
    setSessionError: p,
    setActiveConversationId: T,
    setItems: x,
    setHeadId: S,
    setSessions: B,
    refreshSessions: R,
    applyConversationTree: C
  } = t, F = G(() => {
    var b, $;
    const N = `${(($ = (b = o.current) == null ? void 0 : b.getConversationId) == null ? void 0 : $.call(b)) || ""}`.trim();
    N && T(N);
  }, []), l = G(async () => {
    var b, $;
    if (s) return;
    await r.current.stopStream(), oe(900), ae(900), u(!0), p("");
    const N = ++g.current;
    try {
      if (await new Promise((P) => {
        window.setTimeout(P, 40);
      }), N !== g.current) return;
      const f = o.current, _ = v.current || `${await ((b = f == null ? void 0 : f.getDocumentId) == null ? void 0 : b.call(f)) || ""}`.trim();
      if (N !== g.current) return;
      v.current = _, ($ = f == null ? void 0 : f.clearConversationId) == null || $.call(f, _), T(""), d.current = "", x([]), S(null), r.current.clearMessages(), ue({ jobId: e, documentId: _ }), _ && await R(_, N);
    } catch (f) {
      console.warn("[reader-ai] new session failed", f), p("无法创建新对话，请重试。");
    } finally {
      N === g.current && u(!1);
    }
  }, [e, R, s]), h = G(async (N) => {
    var P, w, y, z, H;
    const b = `${N || ""}`.trim();
    if (!b)
      return p("无法分支：消息 id 无效。"), !1;
    if (s)
      return p("请稍候，当前有会话操作进行中。"), !1;
    await r.current.stopStream();
    const $ = Un(c.current, b, m.current);
    if (!$.length)
      return p("无法分支：找不到到此答案的对话路径。"), !1;
    if ($[$.length - 1].message.role !== "assistant")
      return p("只能从助手答案处开新对话。"), !1;
    u(!0), p("");
    const _ = ++g.current;
    try {
      if (await new Promise((W) => {
        window.setTimeout(W, 40);
      }), _ !== g.current) return !1;
      const O = o.current;
      let q = v.current || `${await ((P = O == null ? void 0 : O.getDocumentId) == null ? void 0 : P.call(O)) || ""}`.trim();
      if (_ !== g.current) return !1;
      if (v.current = q, !q)
        try {
          if (q = `${await ((w = O == null ? void 0 : O.getDocumentId) == null ? void 0 : w.call(O)) || ""}`.trim(), _ !== g.current) return !1;
          v.current = q;
        } catch {
          q = "";
        }
      if (!q)
        return p("无法分支：文档未就绪，请稍后重试。"), !1;
      const A = $.map((W, ne) => ({
        id: W.message.id,
        role: W.message.role,
        content: W.message.content,
        citations: W.message.citations,
        parentId: ne === 0 ? null : $[ne - 1].message.id
      })), D = d.current || ((y = O == null ? void 0 : O.getConversationId) == null ? void 0 : y.call(O)) || "", Y = (a || []).find((W) => W.conversation_id === D), J = A.find((W) => W.role === "user"), ce = `${(Y == null ? void 0 : Y.title) || ""}`.trim() || `${(J == null ? void 0 : J.content) || ""}`.replace(/\s+/g, " ").trim() || "未命名对话", Re = (a || []).map((W) => W.title || ""), le = Kt(ce, Re), te = await Wt({
        documentId: q,
        title: le,
        path: A
      });
      if (_ !== g.current) return !1;
      const j = ke(te.items), Q = ((z = j[j.length - 1]) == null ? void 0 : z.message.id) || null, V = te.conversation.conversation_id;
      if (!V || !j.length)
        throw new Error("fork returned empty conversation");
      return oe(600), ae(600), x(j), S(Q), r.current.showMessages(ie(j, Q)), T(V), d.current = V, (H = O == null ? void 0 : O.setConversationId) == null || H.call(O, V, q), B((W) => {
        const ne = {
          conversation_id: V,
          title: le,
          document_id: q,
          created_at: te.conversation.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: te.conversation.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
          message_count: j.length,
          head_id: Q || ""
        }, me = W.filter((de) => de.conversation_id !== V);
        return [ne, ...me];
      }), Ae(
        { jobId: e, documentId: q },
        Se(j, Q),
        V
      ), await R(q, _), !0;
    } catch (O) {
      return console.warn("[reader-ai] branch from answer failed", O), _ === g.current && p("分支失败：未能复制上文到新对话。请检查网络后重试。"), !1;
    } finally {
      _ === g.current && u(!1);
    }
  }, [e, R, s, a]), M = G(async (N) => {
    var f, _, P, w;
    const b = `${N || ""}`.trim();
    if (!b || s) return;
    await r.current.stopStream(), u(!0), p("");
    const $ = ++g.current;
    try {
      const y = o.current, z = v.current || `${await ((f = y == null ? void 0 : y.getDocumentId) == null ? void 0 : f.call(y)) || ""}`.trim();
      if ($ !== g.current) return;
      v.current = z;
      try {
        await Ut(b);
      } catch (q) {
        if ((Number(q == null ? void 0 : q.status) || 0) !== 404) throw q;
      }
      ue({ jobId: e, documentId: z }, b);
      const O = (d.current || ((_ = y == null ? void 0 : y.getConversationId) == null ? void 0 : _.call(y)) || "") === b;
      if (B((q) => q.filter((A) => A.conversation_id !== b)), O) {
        (P = y == null ? void 0 : y.clearConversationId) == null || P.call(y, z), T(""), d.current = "", x([]), S(null), r.current.clearMessages(), ue({ jobId: e, documentId: z });
        const q = z ? await R(z, $) : [];
        if ($ !== g.current || !q) return;
        const A = q[0];
        if (A != null && A.conversation_id) {
          const D = A.conversation_id;
          T(D), d.current = D;
          try {
            const Y = await ye(D);
            if ($ !== g.current) return;
            C(
              ve(Y.messages || []),
              Y.head_id
            ), (w = y == null ? void 0 : y.setConversationId) == null || w.call(y, D, z);
          } catch {
            x([]), S(null);
          }
        }
      } else z && await R(z, $);
    } catch (y) {
      console.warn("[reader-ai] delete session failed", y), p("删除对话失败，请重试。");
    } finally {
      $ === g.current && u(!1);
    }
  }, [C, e, R, s]), k = G(async (N, b) => {
    const $ = `${N || ""}`.trim(), f = `${b || ""}`.replace(/\s+/g, " ").trim();
    if (!$ || !f || s) return;
    u(!0), p("");
    const _ = ++g.current;
    try {
      const P = f.slice(0, 80);
      if (await Ht($, { title: P }), _ !== g.current) return;
      B(
        (y) => y.map(
          (z) => z.conversation_id === $ ? { ...z, title: P } : z
        )
      );
      const w = v.current;
      w && await R(w, _);
    } catch (P) {
      console.warn("[reader-ai] rename session failed", P), p("重命名失败，请重试。");
    } finally {
      _ === g.current && u(!1);
    }
  }, [R, s]);
  return {
    adoptRemoteConversationId: F,
    newSession: l,
    branchFromAnswer: h,
    removeSession: M,
    renameSession: k
  };
}
function ts(t) {
  var le;
  const {
    jobId: e,
    documentId: n = "",
    enabled: s,
    remoteAnswerer: a = null,
    stream: r = Hn
  } = t, [o, c] = K([]), [m, d] = K(null), [v, g] = K([]), [I, u] = K(""), [p, T] = K(!1), [x, S] = K(""), B = L(o), R = L(m), C = L(I), F = L(!1), l = L(""), h = L(""), M = L(0), k = L(0), N = L(r);
  N.current = r;
  const b = L(a);
  b.current = a, B.current = o, R.current = m, C.current = I;
  const $ = G(async (te = "", j) => {
    const Q = `${te || h.current || ""}`.trim(), V = ++k.current;
    if (!Q)
      return V === k.current && (j === void 0 || j === M.current) && g([]), [];
    try {
      const ne = (await Gt({ document_id: Q, limit: 50 })).conversations || [];
      return V === k.current && Q === `${h.current || ""}`.trim() && (j === void 0 || j === M.current) ? (g(ne), ne) : null;
    } catch {
      return null;
    }
  }, []), f = G((te, j) => {
    var W;
    const Q = ke(te), V = `${j || ""}`.trim() || ((W = Q[Q.length - 1]) == null ? void 0 : W.message.id) || null;
    c(Q), d(V), N.current.showMessages(ie(Q, V));
  }, []), _ = G(() => `${n || h.current || e}`.trim(), [n, e]);
  Xn({
    jobId: e,
    documentId: n,
    enabled: s,
    refreshSessions: $,
    applyConversationTree: f,
    remoteRef: b,
    streamRef: N,
    itemsRef: B,
    documentIdRef: h,
    lastJobRef: l,
    persistReadyRef: F,
    switchTokenRef: M,
    sessionListGenerationRef: k,
    activeConversationIdRef: C,
    setItems: c,
    setHeadId: d,
    setSessions: g,
    setActiveConversationId: u,
    setSessionBusy: T
  }), Zn({
    jobId: e,
    documentId: n,
    items: o,
    headId: m,
    activeConversationId: I,
    documentIdRef: h,
    persistReadyRef: F
  });
  const P = X(
    () => ie(o, m),
    [o, m]
  ), w = X(
    () => Gn(o),
    [o]
  ), y = X(
    () => Vn(o),
    [o]
  ), z = X(
    () => Yn(o),
    [o]
  ), H = X(() => Qn({ setItems: c, setHeadId: d, itemsRef: B, headIdRef: R }), []), {
    adoptRemoteConversationId: O,
    newSession: q,
    branchFromAnswer: A,
    removeSession: D,
    renameSession: Y
  } = es({
    jobId: e,
    documentId: n,
    sessionBusy: p,
    sessions: v,
    streamRef: N,
    remoteRef: b,
    itemsRef: B,
    headIdRef: R,
    activeConversationIdRef: C,
    documentIdRef: h,
    switchTokenRef: M,
    persistReadyRef: F,
    setSessionBusy: T,
    setSessionError: S,
    setActiveConversationId: u,
    setItems: c,
    setHeadId: d,
    setSessions: g,
    refreshSessions: $,
    applyConversationTree: f
  }), J = G(async (te) => {
    var W, ne, me, de, $e, xe, Te, Ee;
    const j = `${te || ""}`.trim(), Q = C.current || ((ne = (W = b.current) == null ? void 0 : W.getConversationId) == null ? void 0 : ne.call(W)) || "";
    if (!j || j === Q || p) return;
    await N.current.stopStream(), oe(1200), ae(1200), T(!0), S("");
    const V = ++M.current;
    F.current = !1, u(j), C.current = j, c([]), d(null), N.current.clearMessages();
    try {
      if (await new Promise((fe) => {
        window.setTimeout(fe, 80);
      }), V !== M.current) return;
      try {
        ($e = (de = (me = globalThis.document) == null ? void 0 : me.activeElement) == null ? void 0 : de.blur) == null || $e.call(de);
      } catch {
      }
      const Z = b.current, ee = h.current || `${await ((xe = Z == null ? void 0 : Z.getDocumentId) == null ? void 0 : xe.call(Z)) || ""}`.trim();
      if (V !== M.current) return;
      h.current = ee;
      const re = await ye(j);
      if (V !== M.current) return;
      oe(800), ae(800);
      const Ce = ve(re.messages || []);
      if (f(Ce, re.head_id), (Te = Z == null ? void 0 : Z.setConversationId) == null || Te.call(Z, j, ee), F.current = !0, Ce.length) {
        const fe = ke(Ce);
        Ae(
          { jobId: e, documentId: ee },
          Se(
            fe,
            `${re.head_id || ""}`.trim() || ((Ee = fe.at(-1)) == null ? void 0 : Ee.message.id) || null
          ),
          j
        );
      } else
        ue({ jobId: e, documentId: ee }, j);
      ee && await $(ee, V), oe(350), ae(350);
    } catch (Z) {
      if (console.warn("[reader-ai] switch session failed", Z), V === M.current) {
        S("加载该对话失败，请检查网络后重试。");
        const ee = Je(
          { jobId: e, documentId: n || h.current },
          j
        );
        if (ee != null && ee.items.length) {
          const re = at(ee);
          c(re.items), d(re.headId), N.current.showMessages(ie(re.items, re.headId));
        } else
          c([]), d(null);
        F.current = !0;
      }
    } finally {
      V === M.current && T(!1);
    }
  }, [
    f,
    e,
    n,
    $,
    p
  ]), ce = X(
    () => Jn(v, I, a),
    [v, I, a]
  ), Re = X(() => ({
    refreshSessions: $,
    adoptRemoteConversationId: O,
    newSession: q,
    switchSession: J,
    removeSession: D,
    renameSession: Y,
    branchFromAnswer: A
  }), [
    $,
    O,
    q,
    J,
    D,
    Y,
    A
  ]);
  return {
    items: o,
    headId: m,
    messages: P,
    citationsByMessageId: w,
    progressByMessageId: y,
    contentByMessageId: z,
    sessions: ce,
    activeConversationId: I || ((le = a == null ? void 0 : a.getConversationId) == null ? void 0 : le.call(a)) || "",
    sessionBusy: p,
    sessionError: x,
    resolveRequestScopeKey: _,
    tree: H,
    sessionCommands: Re
  };
}
const ns = "retainpdf.reader.ai.request.v1:", ss = Object.freeze({
  assistantMode: "reading",
  scope: "document",
  context: null
});
function it(t, e) {
  return `${ns}${`${t || ""}`.trim()}:${`${e || ""}`.trim()}`;
}
function rs(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return null;
  const e = t, n = e.assistantMode === "operations" ? "operations" : e.assistantMode === "reading" ? "reading" : null, s = e.scope === "selection" || e.scope === "page" || e.scope === "document" ? e.scope : null;
  if (!n || !s) return null;
  const a = e.context && typeof e.context == "object" && !Array.isArray(e.context) ? { ...e.context } : null;
  return { assistantMode: n, scope: s, context: a };
}
function ze(t, e, n) {
  var r;
  const s = `${t || ""}`.trim(), a = `${e || ""}`.trim();
  if (!(!s || !a))
    try {
      (r = globalThis.localStorage) == null || r.setItem(
        it(s, a),
        JSON.stringify(n)
      );
    } catch {
    }
}
function qe(t, e) {
  var a;
  const n = `${t || ""}`.trim(), s = `${e || ""}`.trim();
  if (!n || !s) return null;
  try {
    const r = (a = globalThis.localStorage) == null ? void 0 : a.getItem(it(n, s));
    return r ? rs(JSON.parse(r)) : null;
  } catch {
    return null;
  }
}
function as(t) {
  const e = `${t.scopeKey || ""}`.trim(), n = `${t.jobId || ""}`.trim(), s = `${t.assistantMessageId || ""}`.trim();
  return qe(e, s) || (e !== n ? qe(n, s) : null) || ss;
}
function is(t) {
  const { assistantMode: e, selectionContext: n } = t;
  return e === "operations" ? { assistantMode: e, scope: "document", context: null } : n ? { assistantMode: e, scope: "selection", context: { ...n } } : { assistantMode: e, scope: "document", context: null };
}
function os(t) {
  var F;
  const { jobId: e, assistantMode: n, selectionContext: s = null, tree: a, chat: r, getScopeKey: o } = t, c = L(a);
  c.current = a;
  const m = L(r);
  m.current = r;
  const d = L(n);
  d.current = n;
  const v = L(s);
  v.current = s;
  const g = L(o);
  g.current = o;
  const I = r.status, u = I === "submitted" || I === "streaming", p = L(u);
  p.current = u;
  const T = u ? `${((F = jn(r.messages)) == null ? void 0 : F.id) || ""}` : "", x = r.messages, S = r.error;
  U(() => {
    if (!x.length) return;
    const l = new Map(x.map((M) => [M.id, M])), h = /* @__PURE__ */ new Map();
    for (const [M, k] of l)
      h.set(M, Bn(k));
    c.current.mergeChatMirror(h);
  }, [x]), U(() => {
    !S || I !== "error" || c.current.markRunningAsError(S.message);
  }, [S, I]);
  const B = G(async (l) => {
    if (p.current) return;
    const h = `${l || ""}`.trim();
    if (!h) return;
    const M = c.current, k = m.current, N = d.current, b = v.current, $ = g.current(), f = M.readHeadId(), _ = Ne("u"), P = Ne("a"), w = is({
      assistantMode: N,
      selectionContext: (b == null ? void 0 : b.selectionType) === "text" ? {
        page: b.page,
        page_idx: Math.max(0, b.page - 1),
        pane: b.pane,
        kind: "text",
        block_id: "",
        quoteText: b.quote
      } : b ? {
        page: b.page,
        page_idx: Math.max(0, b.page - 1),
        pane: b.pane,
        kind: b.kind,
        block_id: b.selectionType === "region" ? b.region.itemId : "",
        quoteText: Ve(b.region, b.pane)
      } : null
    });
    ze($, P, w), M.appendExchange({
      parentId: f,
      userId: _,
      assistantId: P,
      question: h,
      progress: w.assistantMode === "operations" ? "正在规划 PDF 操作…" : "正在理解文档…"
    }), await k.sendUserMessage(
      { id: _, role: "user", parts: [{ type: "text", text: h }] },
      {
        body: {
          assistantMessageId: P,
          assistantMode: w.assistantMode,
          parentId: f,
          question: h,
          regenerate: !1,
          userMessageId: _,
          scope: w.scope,
          context: w.context
        }
      }
    );
  }, []), R = G(async (l) => {
    if (p.current) return;
    const h = c.current, M = m.current, k = h.readItems(), N = k.find(
      (H) => H.message.id === l && H.message.role === "assistant"
    ), b = (N == null ? void 0 : N.parentId) ?? null, $ = b ? Kn(k, b) : null;
    let f = "", _ = b;
    if (($ == null ? void 0 : $.role) === "user")
      f = $.content.trim();
    else {
      const H = ie(k, b ?? h.readHeadId());
      for (let O = H.length - 1; O >= 0; O -= 1)
        if (H[O].role === "user") {
          f = H[O].content.trim(), _ = H[O].id;
          break;
        }
    }
    if (!f) return;
    const P = Ne("a"), w = _ || b, y = g.current(), z = as({
      scopeKey: y,
      jobId: e,
      assistantMessageId: l
    });
    ze(y, P, z), h.appendRetryTurn({ assistantId: P, branchParent: w }), M.replaceVisible(rt(ie(k, l))), await M.regenerateFrom({
      messageId: l,
      body: {
        assistantMessageId: P,
        assistantMode: z.assistantMode,
        parentId: w,
        question: f,
        regenerate: !0,
        userMessageId: _ || "",
        scope: z.scope,
        context: z.context
      }
    });
  }, [e]), C = G(async () => {
    await m.current.stopStream(), c.current.markRunningCancelled();
  }, []);
  return {
    isRunning: u,
    streamingAssistantId: T,
    submitQuestion: B,
    retryAnswer: R,
    cancelAnswer: C
  };
}
const cs = "retainpdf.reader-agent-operation.action-key.v1:", ds = "reader-";
function Be(t, e) {
  return rn(t, e);
}
function ls(t) {
  return sn(t);
}
function us(t, e) {
  return nn(t, e);
}
function ps(t) {
  return an(t);
}
function ms(t) {
  return on(t);
}
function fs({
  conversationId: t,
  enabled: e,
  discovering: n,
  signal: s,
  confirmationModeHint: a,
  onDocumentCommitted: r
}) {
  const [o, c] = K({}), [m, d] = K("explicit"), [v, g] = K(!1), [I, u] = K(!1), p = L(/* @__PURE__ */ new Set()), T = L(/* @__PURE__ */ new Set()), x = L(/* @__PURE__ */ new Set()), S = G((l, h = !1) => {
    l != null && l.operation_id && c((M) => {
      const k = M[l.operation_id];
      return us(k == null ? void 0 : k.operation, l) ? {
        ...M,
        [l.operation_id]: {
          ...k,
          operation: l,
          pendingAction: void 0,
          error: void 0
        }
      } : !h || !(k != null && k.pendingAction) ? M : {
        ...M,
        [l.operation_id]: { ...k, pendingAction: void 0 }
      };
    });
  }, []), B = G(async (l, h = !1) => {
    const M = `${l || ""}`.trim(), k = `refresh:${M}`;
    if (!(!M || p.current.has(k))) {
      p.current.add(k);
      try {
        S(await Vt(M), h);
      } catch {
      } finally {
        p.current.delete(k);
      }
    }
  }, [S]), R = G(async () => {
    const l = `${t || ""}`.trim(), h = `recover:${l}`;
    if (!(!e || !l || p.current.has(h))) {
      p.current.add(h);
      try {
        const M = await Yt({ conversationId: l, limit: 50 });
        if (!x.current.has(l)) {
          for (const k of M.operations || [])
            k.status === "committed" && T.current.add(k.operation_id);
          x.current.add(l);
        }
        for (const k of M.operations || []) S(k);
      } catch {
      } finally {
        p.current.delete(h);
      }
    }
  }, [t, e, S]);
  U(() => {
    if (!e) return;
    let l = !1;
    const h = async () => {
      try {
        const k = await tn();
        if (l) return;
        d(k.agent_confirmation_mode || "explicit"), u(!!k.llm_api_key_configured), g(
          k.restart_required || k.restart_state === "pending" || k.active_revision !== k.configured_revision
        );
      } catch {
        l || (g(!1), u(!1));
      }
    };
    h();
    const M = window.setInterval(h, 3e3);
    return () => {
      l = !0, window.clearInterval(M);
    };
  }, [e]), U(() => {
    a && d(a);
  }, [a]), U(() => {
    s != null && s.confirmationMode && d(s.confirmationMode), s != null && s.operationId && B(s.operationId);
  }, [B, s]), U(() => {
    R();
  }, [R]), U(() => {
    n || R();
  }, [n, R]);
  const C = X(
    () => Object.values(o).filter((l) => !!t && l.operation.conversation_id === t).sort((l, h) => `${l.operation.created_at || ""}`.localeCompare(`${h.operation.created_at || ""}`)),
    [t, o]
  );
  U(() => {
    var l;
    for (const h of C) {
      const M = h.operation;
      M.status !== "committed" || T.current.has(M.operation_id) || (T.current.add(M.operation_id), r == null || r({
        documentId: M.document_id,
        revision: ((l = M.candidate) == null ? void 0 : l.version_id) || `${M.updated_at || ""}` || `${M.operation_id}:${ls(M)}`
      }));
    }
  }, [C, r]);
  const F = C.some((l) => Be(l.operation.status, m));
  return U(() => {
    if (!e || !t || !n && !F) return;
    const l = window.setInterval(() => {
      R();
      for (const h of C)
        Be(h.operation.status, m) && B(h.operation.operation_id);
    }, 1400);
    return () => window.clearInterval(l);
  }, [m, t, n, e, C, F, R, B]), U(() => {
    if (!e) return;
    const l = () => void R(), h = () => {
      document.visibilityState === "visible" && l();
    };
    return window.addEventListener("online", l), document.addEventListener("visibilitychange", h), () => {
      window.removeEventListener("online", l), document.removeEventListener("visibilitychange", h);
    };
  }, [e, R]), {
    entries: C,
    confirmationMode: m,
    runtimeRestarting: v,
    runtimeCredentialConfigured: I,
    setEntriesById: c,
    inFlightRef: p,
    upsert: S,
    refresh: B
  };
}
function hs() {
  try {
    return globalThis.sessionStorage;
  } catch {
    return;
  }
}
function ot() {
  return {
    storagePrefix: cs,
    keyPrefix: ds,
    storage: hs()
  };
}
function gs(t, e, n) {
  return cn(t, e, n, ot());
}
function Le(t, e, n) {
  dn(t, e, n, ot());
}
function ys({
  refresh: t,
  upsert: e,
  setEntriesById: n,
  inFlightRef: s
}) {
  const a = L(/* @__PURE__ */ new Map());
  return { perform: G(async (o, c, m = {}) => {
    const d = `${c.operation_id || ""}`.trim(), v = `action:${d}`;
    if (!d || s.current.has(v)) return;
    if (o === "retry" && c.status === "ambiguous" && m.acceptDuplicateRisk !== !0) {
      n((u) => ({
        ...u,
        [d]: {
          ...u[d],
          error: "请先确认重复执行风险，再重新执行操作。"
        }
      }));
      return;
    }
    const g = gs(d, o, a.current);
    s.current.add(v), n((u) => ({
      ...u,
      [d]: { ...u[d], pendingAction: o, error: void 0 }
    }));
    const I = {
      idempotency_key: g,
      expected_status: c.status,
      expected_attempt: c.current_attempt,
      expected_program_sha256: c.program_sha256 || ""
    };
    try {
      let u;
      o === "run" ? u = await Jt(d, I) : o === "cancel" ? u = await Qt(d, { ...I, reason: "user_rejected" }) : o === "commit" ? u = await Xt(d, I) : u = await Zt(d, m.acceptDuplicateRisk ? { ...I, accept_duplicate_risk: !0 } : I), Le(d, o, a.current), e(u, !0);
    } catch (u) {
      ps(u) === 409 ? (Le(d, o, a.current), await t(d, !0)) : n((p) => ({
        ...p,
        [d]: {
          ...p[d],
          pendingAction: void 0,
          error: ms(u)
        }
      }));
    } finally {
      s.current.delete(v);
    }
  }, [t, e]) };
}
function vs({
  conversationId: t,
  enabled: e,
  discovering: n,
  signal: s,
  confirmationModeHint: a,
  onDocumentCommitted: r
}) {
  const o = fs({
    conversationId: t,
    enabled: e,
    discovering: n,
    signal: s,
    confirmationModeHint: a,
    onDocumentCommitted: r
  }), { perform: c } = ys({
    refresh: o.refresh,
    upsert: o.upsert,
    setEntriesById: o.setEntriesById,
    inFlightRef: o.inFlightRef
  }), m = G((d) => en(d.operation_id), []);
  return {
    entries: o.entries,
    confirmationMode: o.confirmationMode,
    runtimeRestarting: o.runtimeRestarting,
    runtimeCredentialConfigured: o.runtimeCredentialConfigured,
    perform: c,
    loadCandidate: m
  };
}
function ws(t) {
  var M;
  const {
    jobId: e,
    documentId: n = "",
    sessionIdentity: s = "",
    enabled: a,
    selectionContext: r = null,
    onDocumentCommitted: o
  } = t, c = `${e}\0${n}\0${s}`, [m, d] = K("reading"), [v, g] = K(null), [I, u] = K();
  U(() => {
    d("reading"), g(null), u(void 0);
  }, [c]);
  const p = X(() => !a || !e ? null : kt({ jobId: e, documentId: n }), [n, a, e]), T = X(() => !a || !e ? null : qt({
    loadMarkdownPayload: At.loadMarkdownPayload
  }), [a, e]), x = Ln({
    jobId: e,
    enabled: a,
    remoteAnswerer: p,
    localAnswerer: T,
    assistantMode: m,
    onAgentOperationSignal: (k) => {
      g({ ...k, nonce: Date.now() + Math.random() });
    },
    onConfirmationMode: u
  }), S = X(() => ({
    messages: x.messages,
    status: x.status,
    error: x.error,
    sendUserMessage: (k, N) => x.sendMessage(
      k,
      N
    ),
    regenerateFrom: (k) => x.regenerate(
      k
    ),
    stopStream: () => x.stop(),
    replaceVisible: (k) => x.setMessages([...k])
  }), [x]), B = X(() => ({
    stopStream: () => S.stopStream(),
    clearMessages: () => S.replaceVisible([]),
    showMessages: (k) => S.replaceVisible(rt(k))
  }), [S]), R = ts({
    jobId: e,
    documentId: n,
    enabled: a,
    remoteAnswerer: p,
    stream: B
  }), C = os({
    jobId: e,
    assistantMode: m,
    selectionContext: r,
    tree: R.tree,
    chat: S,
    getScopeKey: () => R.resolveRequestScopeKey()
  }), F = R.activeConversationId || (v == null ? void 0 : v.conversationId) || `${((M = p == null ? void 0 : p.getConversationId) == null ? void 0 : M.call(p)) || ""}`.trim(), l = vs({
    conversationId: F,
    enabled: a,
    discovering: C.isRunning,
    signal: v,
    confirmationModeHint: I,
    onDocumentCommitted: o
  }), h = L(!1);
  return U(() => {
    h.current = !1;
  }, [e]), U(() => {
    h.current = !1;
  }, [c]), U(() => {
    h.current && !C.isRunning && (R.sessionCommands.refreshSessions(), R.sessionCommands.adoptRemoteConversationId()), h.current = C.isRunning;
  }, [R, C.isRunning]), {
    citationsByMessageId: R.citationsByMessageId,
    progressByMessageId: R.progressByMessageId,
    contentByMessageId: R.contentByMessageId,
    streamingAssistantId: C.streamingAssistantId,
    isRunning: C.isRunning,
    messages: R.messages,
    sessions: R.sessions,
    activeConversationId: R.activeConversationId,
    sessionBusy: R.sessionBusy,
    sessionError: R.sessionError,
    submitQuestion: C.submitQuestion,
    retryAnswer: C.retryAnswer,
    cancelAnswer: C.cancelAnswer,
    newSession: R.sessionCommands.newSession,
    switchSession: R.sessionCommands.switchSession,
    removeSession: R.sessionCommands.removeSession,
    renameSession: R.sessionCommands.renameSession,
    branchFromAnswer: R.sessionCommands.branchFromAnswer,
    agentOperations: l,
    assistantMode: m,
    setAssistantMode: d
  };
}
function Fs({
  open: t,
  jobId: e,
  documentId: n = "",
  sessionIdentity: s = "",
  onClose: a,
  onJumpCitation: r,
  onDocumentCommitted: o,
  layout: c = "floating",
  side: m = "right",
  selectionContext: d = null,
  onClearSelectionContext: v
}) {
  const g = t && !!e, {
    citationsByMessageId: I,
    progressByMessageId: u,
    contentByMessageId: p,
    streamingAssistantId: T,
    isRunning: x,
    sessions: S,
    activeConversationId: B,
    sessionBusy: R,
    sessionError: C,
    messages: F,
    submitQuestion: l,
    retryAnswer: h,
    cancelAnswer: M,
    newSession: k,
    switchSession: N,
    removeSession: b,
    renameSession: $,
    branchFromAnswer: f,
    agentOperations: _,
    assistantMode: P,
    setAssistantMode: w
  } = ws({
    jobId: e,
    documentId: n,
    sessionIdentity: s,
    enabled: g,
    selectionContext: d,
    onDocumentCommitted: o
  }), [y, z] = K(""), H = G(async (q) => {
    z(""), await f(q) && (z(
      "已保存新对话（fork-n-原名）：复制了到此答案的上文，原对话不变。顶部列表可切换。"
    ), window.setTimeout(() => z(""), 6e3));
  }, [f]), O = G((q) => {
    r(q);
  }, [r]);
  return /* @__PURE__ */ i(
    St,
    {
      id: "reader-ai-panel",
      open: t,
      title: "RetainPDF AI",
      titleIcon: /* @__PURE__ */ i(pe, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.ai-float.pos.v2",
      ariaLabel: "阅读问答",
      width: 420,
      placement: c === "workspace" ? "workspace" : c === "docked" ? "dock-right" : "floating",
      showHeader: c !== "workspace",
      className: `reader-float-ai is-${c}${c === "workspace" ? ` is-pane-${m}` : ""}${R ? " is-session-busy" : ""}`,
      onClose: a,
      children: e ? /* @__PURE__ */ E("div", { className: "reader-float-ai-body", children: [
        /* @__PURE__ */ i(
          On,
          {
            sessions: S,
            activeId: B,
            busy: R,
            errorText: C,
            onSwitch: N,
            onNew: k,
            onDelete: b,
            onRename: $
          }
        ),
        y ? /* @__PURE__ */ i("div", { className: "aui-session-banner", role: "status", children: y }) : null,
        /* @__PURE__ */ i("div", { className: "reader-float-ai-thread-wrap", "aria-busy": R || void 0, children: /* @__PURE__ */ i(
          Pn,
          {
            jobId: e,
            messages: F,
            citationsByMessageId: I,
            progressByMessageId: u,
            contentByMessageId: p,
            streamingAssistantId: T,
            isRunning: x,
            onSubmit: l,
            onRetry: h,
            onCancel: M,
            onJumpCitation: O,
            onBranchFromAnswer: H,
            branchBusy: R,
            agentOperations: _,
            assistantMode: P,
            onAssistantModeChange: w,
            selectionContext: d,
            onClearSelectionContext: v
          }
        ) })
      ] }) : /* @__PURE__ */ E("div", { className: "reader-float-ai-empty", children: [
        /* @__PURE__ */ i(pe, { size: 22, strokeWidth: 1.75, "aria-hidden": !0 }),
        /* @__PURE__ */ i("p", { children: "当前文档还没有可用于 AI 的解析产物" }),
        /* @__PURE__ */ i("span", { children: "请先完成 OCR 文档解析" })
      ] })
    }
  );
}
export {
  Fs as ReaderAiPanel
};
//# sourceMappingURL=ReaderAiPanel-CShbCWlw.js.map
