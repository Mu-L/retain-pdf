import { jsx as a, jsxs as $, Fragment as we } from "react/jsx-runtime";
import { useState as K, useRef as L, useEffect as H, useMemo as X, useCallback as G, useId as ct } from "react";
import { Square as dt, ArrowUp as lt, Copy as ut, GitBranch as pt, RefreshCw as mt, Sigma as je, Table2 as ft, Image as ht, Type as gt, X as Ie, BookOpen as Ke, Sparkles as pe, Loader2 as be, FileText as _e, ArrowDown as We, ListTree as yt, FlaskConical as vt, ShieldCheck as wt, Bot as It, ChevronUp as bt, ChevronDown as Ue, TriangleAlert as He, ExternalLink as Rt, Check as Ge, Circle as Ct, Plus as Mt, Pencil as Nt, Trash2 as _t } from "lucide-react";
import { g as Ve, h as kt, d as At, b as St } from "./ReaderApp-DkbEbl1d.js";
import { ThreadPrimitive as se, ComposerPrimitive as he, MessagePrimitive as Ye, ActionBarPrimitive as Me, useExternalStoreRuntime as xt, AssistantRuntimeProvider as Tt } from "@assistant-ui/react";
import { A as $t } from "./AiMarkdownAnswer-DET_KlrE.js";
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
  return /* @__PURE__ */ $("div", { className: "aui-thinking", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ a(be, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
    /* @__PURE__ */ a("span", { children: t || "思考中…" })
  ] });
}
function ln({ message: t }) {
  return /* @__PURE__ */ a(Ye.Root, { className: "aui-msg aui-msg-user", "data-role": "user", children: /* @__PURE__ */ a("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ a("div", { className: "aui-md-plain", children: Qe(t) }) }) });
}
function un({
  jobId: t,
  message: e,
  citations: n,
  progress: s,
  streaming: i,
  branchBusy: r,
  onJumpCitation: o,
  onBranchFromAnswer: d
}) {
  const p = Qe(e);
  return /* @__PURE__ */ a(Ye.Root, { className: "aui-msg aui-msg-assistant", "data-role": "assistant", children: /* @__PURE__ */ $("div", { className: "aui-msg-stack", children: [
    i && s ? /* @__PURE__ */ a(Oe, { label: s }) : null,
    i && !s && !p ? /* @__PURE__ */ a(Oe, { label: "思考中…" }) : null,
    p ? /* @__PURE__ */ a("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ a(
      $t,
      {
        content: p,
        streaming: i,
        citations: n,
        jobId: t,
        className: "aui-md",
        streamingClassName: "aui-md-streaming",
        pendingClassName: "aui-md-pending",
        finalClassName: "aui-md-final",
        onJumpCitation: o
      }
    ) }) : null,
    /* @__PURE__ */ $(
      Me.Root,
      {
        className: "aui-msg-actions",
        "data-reader-ai-actions": "",
        hideWhenRunning: !0,
        autohide: "not-last",
        children: [
          /* @__PURE__ */ a(Me.Copy, { className: "aui-action-btn", "aria-label": "复制答案", title: "复制答案", children: /* @__PURE__ */ a(ut, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }) }),
          d ? /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "aui-action-btn aui-action-btn-branch",
              "aria-label": "从这里开新对话",
              title: "从这里开新对话",
              disabled: r,
              onClick: async () => {
                oe(1200, { overlayDelayMs: 0 }), ae(1200), await d(e.id);
              },
              children: /* @__PURE__ */ a(pt, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 })
            }
          ) : null,
          /* @__PURE__ */ a(Me.Reload, { className: "aui-action-btn", "aria-label": "重新生成", title: "重新生成", children: /* @__PURE__ */ a(mt, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 }) })
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
  isRunning: i,
  branchBusy: r,
  onJumpCitation: o,
  onBranchFromAnswer: d
}) {
  return /* @__PURE__ */ a("div", { className: "aui-message-group", "data-slot": "aui_message-group", children: /* @__PURE__ */ a(se.Messages, { children: ({ message: p }) => {
    var w;
    if (p.role === "user") return /* @__PURE__ */ a(ln, { message: p });
    if (p.role !== "assistant") return null;
    const c = ((w = p.status) == null ? void 0 : w.type) === "running" || i && s === p.id;
    return /* @__PURE__ */ a(
      un,
      {
        jobId: t,
        message: p,
        citations: e[p.id] || [],
        progress: n[p.id] || "",
        streaming: c,
        branchBusy: r,
        onJumpCitation: o,
        onBranchFromAnswer: d
      }
    );
  } }) });
}
function pn({
  mode: t,
  disabled: e,
  onChange: n
}) {
  return /* @__PURE__ */ $("div", { className: "aui-assistant-mode", role: "group", "aria-label": "AI 模式", children: [
    /* @__PURE__ */ $(
      "button",
      {
        type: "button",
        className: t !== "operations" ? "is-active" : "",
        "aria-pressed": t !== "operations",
        disabled: e,
        onClick: () => n == null ? void 0 : n("reading"),
        children: [
          /* @__PURE__ */ a(Ke, { size: 12, strokeWidth: 2.2, "aria-hidden": !0 }),
          /* @__PURE__ */ a("span", { children: "阅读问答" })
        ]
      }
    ),
    /* @__PURE__ */ $(
      "button",
      {
        type: "button",
        className: t === "operations" ? "is-active" : "",
        "aria-pressed": t === "operations",
        disabled: e,
        onClick: () => n == null ? void 0 : n("operations"),
        children: [
          /* @__PURE__ */ a(pe, { size: 12, strokeWidth: 2.2, "aria-hidden": !0 }),
          /* @__PURE__ */ a("span", { children: "PDF Agent" })
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
  const n = t.selectionType === "text" ? "text" : t.kind, s = t.selectionType === "text" ? t.quote : Ve(t.region, t.pane), i = n === "formula" ? "公式" : n === "table" ? "表格" : n === "figure" ? "图片" : "文字";
  return /* @__PURE__ */ $("div", { className: "aui-selection-context", "data-reader-ai-selection-context": "", children: [
    /* @__PURE__ */ a(n === "formula" ? je : n === "table" ? ft : n === "figure" ? ht : gt, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
    /* @__PURE__ */ $("span", { className: "aui-selection-context-meta", children: [
      t.pane === "translated" ? "译文" : "原文",
      " · ",
      t.page,
      " 页 · ",
      i
    ] }),
    /* @__PURE__ */ a("span", { className: "aui-selection-context-text", children: s || "已选择此区域" }),
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "aui-selection-context-remove",
        "aria-label": "移除选区上下文",
        title: "移除选区",
        onClick: e,
        children: /* @__PURE__ */ a(Ie, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
      }
    )
  ] });
}
function Ze({
  isRunning: t,
  branchBusy: e,
  mode: n,
  onModeChange: s,
  selectionContext: i,
  onClearSelectionContext: r
}) {
  return /* @__PURE__ */ $(he.Root, { className: "aui-composer", "data-reader-ai-composer": "", children: [
    /* @__PURE__ */ $("div", { className: "aui-composer-shell", children: [
      n !== "operations" ? /* @__PURE__ */ a(mn, { selectionContext: i, onClear: r }) : null,
      /* @__PURE__ */ a(
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
      /* @__PURE__ */ $("div", { className: "aui-composer-toolbar", children: [
        /* @__PURE__ */ a(pn, { mode: n, disabled: t || e, onChange: s }),
        /* @__PURE__ */ a("div", { className: "aui-composer-actions", children: t ? /* @__PURE__ */ a(he.Cancel, { className: "aui-send aui-send-stop", "aria-label": "停止生成", children: /* @__PURE__ */ a(dt, { size: 12, strokeWidth: 2.6, "aria-hidden": !0 }) }) : /* @__PURE__ */ a(he.Send, { className: "aui-send", "aria-label": "发送", children: /* @__PURE__ */ a(lt, { size: 16, strokeWidth: 2.5, "aria-hidden": !0 }) }) })
      ] })
    ] }),
    /* @__PURE__ */ a("p", { className: "aui-hint", children: "AI 可能会出错，请核对原文与引用" })
  ] });
}
function et() {
  return /* @__PURE__ */ $("div", { className: "aui-composer aui-composer-locked", role: "alert", children: [
    /* @__PURE__ */ a("p", { className: "aui-llm-lock-msg", children: Et }),
    /* @__PURE__ */ a("p", { className: "aui-hint", children: "请到首页「设置 → API 设置」填写模型 Key 后即可提问" })
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
  streamingAssistantId: i,
  isRunning: r,
  missingLlmKey: o,
  branchBusy: d,
  agentRequestBlocked: p = !1,
  agentOperationPanel: c,
  onModeChange: w,
  onJumpCitation: g,
  onBranchFromAnswer: v
}) {
  const m = d || p;
  return /* @__PURE__ */ $(we, { children: [
    e ? /* @__PURE__ */ $("div", { className: "aui-empty", children: [
      /* @__PURE__ */ a("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ a("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ a(pe, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ a("h2", { className: "aui-empty-title", children: "想怎样处理 PDF？" }),
      /* @__PURE__ */ a("p", { className: "aui-empty-sub", children: "创建候选版本后由你预览和确认" }),
      /* @__PURE__ */ a("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: fn.map((u) => {
        const x = u.icon;
        return /* @__PURE__ */ $(
          se.Suggestion,
          {
            prompt: u.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: m || o,
            children: [
              /* @__PURE__ */ a(x, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
              /* @__PURE__ */ a("span", { className: "aui-suggestion-label", children: u.label })
            ]
          },
          u.prompt
        );
      }) })
    ] }) : null,
    /* @__PURE__ */ a(
      Xe,
      {
        jobId: t,
        citationsByMessageId: n,
        progressByMessageId: s,
        streamingAssistantId: i,
        isRunning: r,
        branchBusy: d,
        onJumpCitation: g,
        onBranchFromAnswer: v
      }
    ),
    c,
    /* @__PURE__ */ $(se.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !d ? /* @__PURE__ */ a(
        se.ScrollToBottom,
        {
          className: "aui-scroll-bottom-btn aui-scroll-bottom",
          "aria-label": "滚到最新",
          children: /* @__PURE__ */ a(We, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
        }
      ) : null,
      o ? /* @__PURE__ */ a(et, {}) : /* @__PURE__ */ a(
        Ze,
        {
          isRunning: r,
          branchBusy: m,
          mode: "operations",
          onModeChange: w,
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
  streamingAssistantId: i,
  isRunning: r,
  missingLlmKey: o,
  branchBusy: d,
  composerDisabled: p = !1,
  onModeChange: c,
  onJumpCitation: w,
  onBranchFromAnswer: g,
  selectionContext: v = null,
  onClearSelectionContext: m,
  footerExtra: u = null
}) {
  return /* @__PURE__ */ $(we, { children: [
    e ? /* @__PURE__ */ $("div", { className: "aui-empty", children: [
      /* @__PURE__ */ a("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ a("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ a(pe, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ a("h2", { className: "aui-empty-title", children: "一起读懂这篇文档" }),
      /* @__PURE__ */ a("p", { className: "aui-empty-sub", children: "总结、解释、检索与计算，不修改 PDF" }),
      /* @__PURE__ */ a("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: gn.map((x) => {
        const O = x.icon;
        return /* @__PURE__ */ $(
          se.Suggestion,
          {
            prompt: x.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: d || p || o,
            children: [
              /* @__PURE__ */ a(O, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
              /* @__PURE__ */ a("span", { className: "aui-suggestion-label", children: x.label })
            ]
          },
          x.prompt
        );
      }) })
    ] }) : null,
    /* @__PURE__ */ a(
      Xe,
      {
        jobId: t,
        citationsByMessageId: n,
        progressByMessageId: s,
        streamingAssistantId: i,
        isRunning: r,
        branchBusy: d,
        onJumpCitation: w,
        onBranchFromAnswer: g
      }
    ),
    u,
    /* @__PURE__ */ $(se.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !d ? /* @__PURE__ */ a(
        se.ScrollToBottom,
        {
          className: "aui-scroll-bottom-btn aui-scroll-bottom",
          "aria-label": "滚到最新",
          children: /* @__PURE__ */ a(We, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
        }
      ) : null,
      o ? /* @__PURE__ */ a(et, {}) : /* @__PURE__ */ a(
        Ze,
        {
          isRunning: r,
          branchBusy: d || p,
          mode: "reading",
          onModeChange: c,
          selectionContext: v,
          onClearSelectionContext: m
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
  streamingAssistantId: i,
  isRunning: r,
  missingLlmKey: o,
  branchBusy: d,
  agentRequestBlocked: p = !1,
  agentOperationPanel: c,
  assistantMode: w = "reading",
  onAssistantModeChange: g,
  onJumpCitation: v,
  onBranchFromAnswer: m,
  selectionContext: u = null,
  onClearSelectionContext: x
}) {
  const O = e.length === 0, C = w === "operations";
  return /* @__PURE__ */ a(
    se.Root,
    {
      className: `aui-thread aui-thread-root${o ? " is-llm-locked" : ""}`,
      "data-chat-ui": "assistant-ui-official-thread",
      children: /* @__PURE__ */ a(
        se.Viewport,
        {
          className: "aui-viewport",
          "data-slot": "aui_thread-viewport",
          "data-reader-ai-viewport": "true",
          turnAnchor: "top",
          autoScroll: !0,
          children: /* @__PURE__ */ a("div", { className: `aui-thread-inner${O ? " is-empty" : ""}`, children: C ? /* @__PURE__ */ a(
            hn,
            {
              jobId: t,
              empty: O,
              citationsByMessageId: n,
              progressByMessageId: s,
              streamingAssistantId: i,
              isRunning: r,
              missingLlmKey: o,
              branchBusy: d,
              agentRequestBlocked: p,
              agentOperationPanel: c,
              onModeChange: g,
              onJumpCitation: v,
              onBranchFromAnswer: m
            }
          ) : /* @__PURE__ */ a(
            yn,
            {
              jobId: t,
              empty: O,
              citationsByMessageId: n,
              progressByMessageId: s,
              streamingAssistantId: i,
              isRunning: r,
              missingLlmKey: o,
              branchBusy: d,
              composerDisabled: p,
              onModeChange: g,
              onJumpCitation: v,
              onBranchFromAnswer: m,
              selectionContext: u,
              onClearSelectionContext: x
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
  return /* @__PURE__ */ a("ol", { className: "reader-agent-operation-timeline", "aria-label": "PDF 操作步骤", children: t.map((n) => {
    const s = Cn(n.status), i = ["queued", "running", "validating"].includes(n.status);
    return /* @__PURE__ */ $("li", { children: [
      /* @__PURE__ */ a(s, { className: i ? "is-spinning" : "", size: 12, "aria-hidden": !0 }),
      /* @__PURE__ */ a("span", { children: n.summary || n.event || nt(n.status, e) }),
      /* @__PURE__ */ a("time", { children: n.ts ? new Date(n.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "" })
    ] }, `${n.attempt}:${n.seq}`);
  }) });
}
function Nn({
  operation: t,
  loadCandidate: e
}) {
  const [n, s] = K(!1), [i, r] = K(""), [o, d] = K(""), p = L("");
  return H(() => {
    let c = !1;
    return d(""), e(t).then((w) => {
      if (c) return;
      const g = URL.createObjectURL(w);
      p.current && URL.revokeObjectURL(p.current), p.current = g, r(g);
    }).catch(() => {
      c || d("候选 PDF 加载失败，请重试。");
    }), () => {
      c = !0;
    };
  }, [e, t.operation_id, t.current_attempt]), H(() => () => {
    p.current && URL.revokeObjectURL(p.current);
  }, []), /* @__PURE__ */ $(we, { children: [
    /* @__PURE__ */ $("div", { className: "reader-agent-operation-candidate", children: [
      /* @__PURE__ */ $("div", { children: [
        /* @__PURE__ */ a(_e, { size: 13, "aria-hidden": !0 }),
        /* @__PURE__ */ a("span", { children: "候选 PDF" })
      ] }),
      /* @__PURE__ */ a("button", { type: "button", disabled: !i, onClick: () => s((c) => !c), children: i ? n ? "收起" : "预览" : "加载中…" }),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: !i,
          "aria-label": "新窗口打开候选 PDF",
          onClick: () => window.open(i, "_blank", "noopener,noreferrer"),
          children: /* @__PURE__ */ a(Rt, { size: 12, "aria-hidden": !0 })
        }
      )
    ] }),
    n ? /* @__PURE__ */ a("iframe", { className: "reader-agent-operation-preview", src: i, title: "候选 PDF 预览" }) : null,
    o ? /* @__PURE__ */ a("p", { className: "reader-agent-operation-error", role: "alert", children: o }) : null
  ] });
}
function _n({
  entry: t,
  mode: e,
  loadCandidate: n,
  onAction: s,
  onDismiss: i
}) {
  var O;
  const { operation: r, pendingAction: o, error: d } = t, [p, c] = K(!1), [w, g] = K(!1), v = r.events || [], m = Rn(r.status), u = !!((r.status === "result_ready" || r.status === "committed") && r.candidate_available), x = wn.has(r.status);
  return /* @__PURE__ */ $("article", { className: `reader-agent-operation-card is-${r.status}`, "data-operation-id": r.operation_id, children: [
    /* @__PURE__ */ $("header", { children: [
      /* @__PURE__ */ a("span", { className: "reader-agent-operation-icon", "aria-hidden": !0, children: /* @__PURE__ */ a(It, { size: 15 }) }),
      /* @__PURE__ */ $("div", { className: "reader-agent-operation-title", children: [
        /* @__PURE__ */ a("span", { children: "PDF 操作" }),
        /* @__PURE__ */ a("strong", { children: r.intent_summary || "处理当前 PDF" })
      ] }),
      /* @__PURE__ */ $("div", { className: "reader-agent-operation-head-actions", children: [
        /* @__PURE__ */ a("span", { className: "reader-agent-operation-status", children: nt(r.status, e) }),
        x ? /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "reader-agent-operation-dismiss",
            "aria-label": r.status === "failed" ? "隐藏这条失败提示" : "隐藏这条已取消提示",
            title: "隐藏",
            onClick: () => i(r),
            children: /* @__PURE__ */ a(Ie, { size: 13, "aria-hidden": !0 })
          }
        ) : null
      ] })
    ] }),
    (O = r.affected_pages) != null && O.length ? /* @__PURE__ */ $("p", { className: "reader-agent-operation-scope", children: [
      "影响页码：",
      r.affected_pages.join("、")
    ] }) : null,
    v.length ? /* @__PURE__ */ $("div", { className: "reader-agent-operation-details", children: [
      /* @__PURE__ */ $("button", { type: "button", onClick: () => c((C) => !C), children: [
        p ? /* @__PURE__ */ a(bt, { size: 12, "aria-hidden": !0 }) : /* @__PURE__ */ a(Ue, { size: 12, "aria-hidden": !0 }),
        p ? "收起步骤" : `执行步骤 ${v.length}`
      ] }),
      p ? /* @__PURE__ */ a(Mn, { events: v, mode: e }) : null
    ] }) : null,
    u ? /* @__PURE__ */ a(Nn, { operation: r, loadCandidate: n }) : null,
    d ? /* @__PURE__ */ a("p", { className: "reader-agent-operation-error", role: "alert", children: d }) : null,
    w ? /* @__PURE__ */ $("div", { className: "reader-agent-operation-risk", role: "alertdialog", "aria-label": "确认重复执行风险", children: [
      /* @__PURE__ */ a(He, { size: 14, "aria-hidden": !0 }),
      /* @__PURE__ */ a("p", { children: "上一次执行结果不确定，重试可能重复操作。确认接受风险后再继续。" }),
      /* @__PURE__ */ $("div", { children: [
        /* @__PURE__ */ a("button", { type: "button", onClick: () => g(!1), disabled: !!o, children: "返回" }),
        /* @__PURE__ */ a(
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
    ] }) : m.length ? /* @__PURE__ */ a("div", { className: "reader-agent-operation-actions", children: m.map((C) => /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: C.primary ? "is-primary" : C.danger ? "is-danger" : "",
        disabled: !!o,
        onClick: () => {
          C.risk ? g(!0) : s(C.action, r);
        },
        children: o === C.action ? "处理中…" : C.label
      },
      C.action
    )) }) : null
  ] });
}
function kn({
  entries: t,
  confirmationMode: e,
  runtimeRestarting: n,
  loadCandidate: s,
  onAction: i
}) {
  const [r, o] = K(In), d = t.filter((c) => !r.has(De(c.operation)));
  function p(c) {
    const w = De(c);
    o((g) => {
      const v = new Set(g);
      return v.add(w), bn(v), v;
    });
  }
  return /* @__PURE__ */ $("section", { className: `reader-agent-operations${d.length ? " has-operations" : ""}`, "aria-label": "AI PDF 操作", children: [
    /* @__PURE__ */ $("div", { className: `reader-agent-mode${e === "green_light" ? " is-green" : ""}`, children: [
      /* @__PURE__ */ a(wt, { size: 13, "aria-hidden": !0 }),
      /* @__PURE__ */ a("span", { children: e === "green_light" ? "绿灯模式 · 自动执行并应用" : "需要确认 · 操作前等待授权" })
    ] }),
    n ? /* @__PURE__ */ $("div", { className: "reader-agent-restarting", role: "status", children: [
      /* @__PURE__ */ a(be, { className: "is-spinning", size: 13, "aria-hidden": !0 }),
      "正在重启 Agent，新请求暂不可用"
    ] }) : null,
    d.map((c) => /* @__PURE__ */ a(
      _n,
      {
        entry: c,
        mode: e,
        loadCandidate: s,
        onAction: i,
        onDismiss: p
      },
      c.operation.operation_id
    ))
  ] });
}
const An = (t) => t, Sn = Object.freeze([]), xn = Object.freeze({}), Fe = Object.freeze({}), Tn = Object.freeze({
  entries: [],
  confirmationMode: "explicit",
  runtimeRestarting: !1,
  runtimeCredentialConfigured: !1,
  perform: async () => {
  },
  loadCandidate: async () => new Blob()
});
function $n(t) {
  return t.content.filter((e) => e.type === "text").map((e) => e.text).join(`
`).trim();
}
function En(t, e, n) {
  var s, i, r, o;
  return ((s = t.status) == null ? void 0 : s.type) === "running" || n && e === t.id ? { type: "running" } : ((i = t.status) == null ? void 0 : i.type) === "incomplete" || ((r = t.status) == null ? void 0 : r.type) === "error" ? {
    type: "incomplete",
    reason: ((o = t.status) == null ? void 0 : o.reason) === "cancelled" ? "cancelled" : "error"
  } : { type: "complete", reason: "stop" };
}
function Pn({
  jobId: t = "",
  messages: e = Sn,
  citationsByMessageId: n = xn,
  progressByMessageId: s = Fe,
  contentByMessageId: i = Fe,
  streamingAssistantId: r = "",
  isRunning: o = !1,
  onSubmit: d,
  onRetry: p,
  onCancel: c,
  onJumpCitation: w,
  onBranchFromAnswer: g,
  branchBusy: v = !1,
  agentOperations: m = Tn,
  assistantMode: u = "reading",
  onAssistantModeChange: x,
  selectionContext: O = null,
  onClearSelectionContext: C
}) {
  const [, E] = K(0);
  H(() => {
    const N = () => E((b) => b + 1);
    return window.addEventListener("focus", N), window.addEventListener("storage", N), document.addEventListener(Pe, N), () => {
      window.removeEventListener("focus", N), window.removeEventListener("storage", N), document.removeEventListener(Pe, N);
    };
  }, []);
  const T = !Pt() && !m.runtimeCredentialConfigured, _ = X(() => e.map((N) => ({
    id: N.id,
    role: N.role,
    content: i[N.id] || N.content || "",
    ...N.role === "assistant" ? { status: En(N, r, o) } : {}
  })), [i, o, e, r]), z = G(async (N) => {
    const b = N ? Math.max(0, e.findIndex((h) => h.id === N) + 1) : 0, S = e.slice(b).find((h) => h.role === "assistant");
    S && await p(S.id);
  }, [e, p]), l = G(async (N) => {
    const b = $n(N);
    !b || o || v || m.runtimeRestarting || T || await d(b);
  }, [m.runtimeRestarting, v, o, T, d]), f = G(async () => {
    await c();
  }, [c]), R = X(() => ({
    messages: _,
    isRunning: o,
    isDisabled: v || m.runtimeRestarting || T,
    convertMessage: An,
    onNew: l,
    onReload: z,
    onCancel: f
  }), [
    m.runtimeRestarting,
    v,
    f,
    l,
    o,
    T,
    z,
    _
  ]), A = xt(R);
  return /* @__PURE__ */ a(Tt, { runtime: A, children: /* @__PURE__ */ a(
    vn,
    {
      jobId: t,
      messages: e,
      citationsByMessageId: n,
      progressByMessageId: s,
      streamingAssistantId: r,
      isRunning: o,
      missingLlmKey: T,
      branchBusy: v,
      agentRequestBlocked: m.runtimeRestarting,
      assistantMode: u,
      onAssistantModeChange: x,
      selectionContext: O,
      onClearSelectionContext: C,
      agentOperationPanel: m.entries.length > 0 || m.runtimeRestarting ? /* @__PURE__ */ a(
        kn,
        {
          entries: m.entries,
          confirmationMode: m.confirmationMode,
          runtimeRestarting: m.runtimeRestarting,
          loadCandidate: m.loadCandidate,
          onAction: m.perform
        }
      ) : null,
      onJumpCitation: w,
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
  errorText: i = "",
  onSwitch: r,
  onNew: o,
  onDelete: d,
  onRename: p
}) {
  const c = t.length > 0, w = n || s, [g, v] = K(!1), [m, u] = K(""), [x, O] = K(""), C = L(null), E = ct();
  function T(h) {
    const M = `${h || ""}`.match(/^fork-(\d+)-(.*)$/i);
    if (!M) return h;
    const P = M[2].trim();
    return P ? `${P} · 分支${M[1]}` : `分支${M[1]}`;
  }
  const _ = L(!1), z = L(null), l = t.find((h) => h.id === e) || null, f = l ? l.messageCount ? T(l.title) : `${T(l.title)}（空）` : c ? "选择以往对话" : "新对话";
  H(() => {
    if (!g) {
      u("");
      return;
    }
    const h = (I) => {
      if (_.current) return;
      const y = C.current;
      y && (I.target instanceof Node && y.contains(I.target) || (v(!1), u("")));
    }, M = (I) => {
      I.key === "Escape" && (v(!1), u(""));
    }, P = window.setTimeout(() => {
      document.addEventListener("pointerdown", h, !0);
    }, 0);
    return document.addEventListener("keydown", M), () => {
      window.clearTimeout(P), document.removeEventListener("pointerdown", h, !0), document.removeEventListener("keydown", M);
    };
  }, [g]), H(() => {
    if (!m) return;
    const h = z.current;
    h && (h.focus(), h.select());
  }, [m]);
  const R = (h) => {
    const M = `${h || ""}`.trim();
    !M || w || _.current || m || (_.current = !0, ge(1e3, 0), requestAnimationFrame(() => {
      v(!1), window.setTimeout(() => {
        (async () => {
          try {
            await r(M);
          } finally {
            ge(400, 0), _.current = !1;
          }
        })();
      }, 40);
    }));
  }, A = (h) => {
    w || (u(h.id), O(h.title || ""));
  }, N = () => {
    const h = m, M = x;
    u(""), h && p(h, M);
  }, b = () => {
    u(""), O("");
  }, S = (h) => {
    var I;
    if (w || _.current) return;
    const M = h.title || "未命名对话";
    (I = globalThis.confirm) != null && I.call(globalThis, `确定删除对话「${M}」？此操作不可恢复。`) && (_.current = !0, ge(800, 0), (async () => {
      try {
        await d(h.id);
      } finally {
        _.current = !1;
      }
    })());
  };
  return /* @__PURE__ */ $(
    "div",
    {
      className: "aui-session-bar",
      "data-reader-ai-sessions": "",
      ref: C,
      onPointerDown: (h) => {
        h.stopPropagation();
      },
      onClick: (h) => {
        h.stopPropagation();
      },
      children: [
        /* @__PURE__ */ $("div", { className: "aui-session-row", children: [
          /* @__PURE__ */ $(
            "button",
            {
              type: "button",
              className: `aui-session-trigger${g ? " is-open" : ""}`,
              "aria-label": "切换对话窗口",
              "aria-haspopup": "listbox",
              "aria-expanded": g,
              "aria-controls": E,
              disabled: w || !c,
              title: f,
              onClick: () => {
                w || !c || v((h) => !h);
              },
              children: [
                /* @__PURE__ */ a("span", { className: "aui-session-trigger-label", children: f }),
                /* @__PURE__ */ a(Ue, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 })
              ]
            }
          ),
          /* @__PURE__ */ $(
            "button",
            {
              type: "button",
              className: "aui-session-btn",
              disabled: w,
              title: "新对话窗口",
              "aria-label": "新对话",
              onClick: () => {
                w || _.current || (_.current = !0, ge(800), v(!1), u(""), window.setTimeout(() => {
                  (async () => {
                    try {
                      await o();
                    } finally {
                      _.current = !1;
                    }
                  })();
                }, 40));
              },
              children: [
                n ? /* @__PURE__ */ a(be, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ a(Mt, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
                /* @__PURE__ */ a("span", { children: "新对话" })
              ]
            }
          )
        ] }),
        g && c ? /* @__PURE__ */ a(
          "ul",
          {
            id: E,
            className: "aui-session-list",
            role: "listbox",
            "aria-label": "以往对话",
            children: t.map((h) => {
              const M = h.messageCount ? T(h.title) : `${T(h.title)}（空）`, P = h.id === e, I = m === h.id;
              return /* @__PURE__ */ a("li", { className: "aui-session-row-item", role: "presentation", children: I ? /* @__PURE__ */ $("div", { className: "aui-session-edit", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    ref: z,
                    className: "aui-session-edit-input",
                    value: x,
                    maxLength: 80,
                    "aria-label": "对话标题",
                    disabled: w,
                    onChange: (y) => O(y.target.value),
                    onKeyDown: (y) => {
                      y.key === "Enter" ? (y.preventDefault(), N()) : y.key === "Escape" && (y.preventDefault(), b());
                    },
                    onClick: (y) => y.stopPropagation()
                  }
                ),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": "保存标题",
                    title: "保存",
                    disabled: w || !x.trim(),
                    onClick: (y) => {
                      y.stopPropagation(), N();
                    },
                    children: /* @__PURE__ */ a(Ge, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                ),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": "取消重命名",
                    title: "取消",
                    disabled: w,
                    onClick: (y) => {
                      y.stopPropagation(), b();
                    },
                    children: /* @__PURE__ */ a(Ie, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }) : /* @__PURE__ */ $(we, { children: [
                /* @__PURE__ */ $(
                  "button",
                  {
                    type: "button",
                    role: "option",
                    "aria-selected": P,
                    className: `aui-session-item${P ? " is-active" : ""}`,
                    disabled: w,
                    title: M,
                    onPointerDown: (y) => {
                      y.stopPropagation(), !P && !w && ae(1e3);
                    },
                    onClick: (y) => {
                      if (y.preventDefault(), y.stopPropagation(), P) {
                        v(!1);
                        return;
                      }
                      R(h.id);
                    },
                    children: [
                      /* @__PURE__ */ a("span", { className: "aui-session-item-title", children: M }),
                      P ? /* @__PURE__ */ a("span", { className: "aui-session-item-badge", children: "当前" }) : null
                    ]
                  }
                ),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": `重命名 ${M}`,
                    title: "重命名",
                    disabled: w,
                    onClick: (y) => {
                      y.preventDefault(), y.stopPropagation(), A(h);
                    },
                    children: /* @__PURE__ */ a(Nt, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
                  }
                ),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn is-danger",
                    "aria-label": `删除 ${M}`,
                    title: "删除",
                    disabled: w,
                    onClick: (y) => {
                      y.preventDefault(), y.stopPropagation(), S(h);
                    },
                    children: /* @__PURE__ */ a(_t, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
                  }
                )
              ] }) }, h.id);
            })
          }
        ) : null,
        i ? /* @__PURE__ */ a("div", { className: "aui-session-error", role: "alert", children: i }) : null
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
    const i = t[s];
    if (i.role !== "user") continue;
    const r = st(i);
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
    trigger: i
  }) {
    var u, x, O, C;
    const r = n || {}, o = Dn(s, r);
    if (!o) throw new Error("请输入问题。");
    const d = r.assistantMode || ((x = (u = this.options).getAssistantMode) == null ? void 0 : x.call(u)) || "reading", p = r.scope || "document", c = r.context ? { ...r.context } : null, w = `${r.assistantMessageId || ""}`.trim() || `a-${Date.now().toString(36)}`, g = `${w}-text`, v = this.options.getRemoteAnswerer(), m = ((C = (O = this.options).getLocalAnswerer) == null ? void 0 : C.call(O)) || null;
    if (!v && !m)
      throw new Error("问答暂不可用：请确认已打开任务阅读器。");
    return new ReadableStream({
      start: (E) => {
        let T = !1, _ = "", z = {
          citations: [],
          progress: i === "regenerate-message" ? "正在重新生成…" : "正在检索文档…",
          status: "running"
        };
        const l = (R) => {
          T || E.enqueue(R);
        }, f = (R) => {
          z = { ...z, ...R }, l({ type: "message-metadata", messageMetadata: z });
        };
        l({ type: "start", messageId: w, messageMetadata: z }), l({ type: "start-step" }), l({ type: "text-start", id: g }), (async () => {
          var R, A, N, b, S, h;
          try {
            if (await ((R = v == null ? void 0 : v.ensureLoaded) == null ? void 0 : R.call(v, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
            let M = v || m, P = !1, I;
            try {
              I = await M.answer({
                question: o,
                assistantMode: d,
                scope: p,
                context: c,
                parentId: `${r.parentId || ""}`.trim(),
                regenerate: r.regenerate ?? i === "regenerate-message",
                userMessageId: `${r.userMessageId || ""}`.trim(),
                assistantMessageId: w,
                onAgentSessionEvent: (k) => {
                  var Y, J, ce;
                  const F = (Y = k == null ? void 0 : k.capabilities) == null ? void 0 : Y.document_operation_confirmation_mode;
                  (F === "explicit" || F === "green_light") && ((ce = (J = this.options).onConfirmationMode) == null || ce.call(J, F));
                },
                onAgentOperationEvent: (k) => {
                  var Y, J;
                  const F = `${(k == null ? void 0 : k.operation_id) || ""}`.trim();
                  F && ((J = (Y = this.options).onAgentOperationSignal) == null || J.call(Y, {
                    operationId: F,
                    conversationId: `${(k == null ? void 0 : k.conversation_id) || ""}`.trim() || void 0
                  }));
                },
                onAgentConfirmationRequiredEvent: (k) => {
                  var Y, J;
                  const F = `${(k == null ? void 0 : k.operation_id) || ""}`.trim();
                  F && ((J = (Y = this.options).onAgentOperationSignal) == null || J.call(Y, { operationId: F }));
                },
                onToolEvent: (k) => {
                  if (_ || e != null && e.aborted) return;
                  const F = Bt(k);
                  F && f({ progress: F });
                },
                onProgressEvent: (k) => {
                  if (_ || e != null && e.aborted) return;
                  const F = `${(k == null ? void 0 : k.message) || ""}`.trim();
                  F && f({ progress: F });
                },
                onAnswerDelta: (k, F) => {
                  !F || e != null && e.aborted || (_ += F, z.progress && f({ progress: "" }), l({ type: "text-delta", id: g, delta: F }));
                },
                onCompress: (k) => {
                  if (_ || e != null && e.aborted) return;
                  const F = Number(k == null ? void 0 : k.dropped_turns) || 0;
                  F && f({ progress: `已压缩 ${F} 轮早期对话` });
                },
                signal: e
              });
            } catch (k) {
              if (e != null && e.aborted || d === "operations" || !v || !m || !Fn(k)) throw k;
              if (P = !0, f({ progress: "在线服务暂不可用，改用本地检索…" }), await ((A = m.ensureLoaded) == null ? void 0 : A.call(m, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
              M = m, I = await M.answer({
                question: o,
                assistantMode: d,
                scope: p,
                context: c,
                signal: e
              });
            }
            if (e != null && e.aborted) {
              f({ progress: "", status: "cancelled" }), l({ type: "abort", reason: "cancelled" });
              return;
            }
            const y = I == null ? void 0 : I.confirmationMode;
            (y === "explicit" || y === "green_light") && ((b = (N = this.options).onConfirmationMode) == null || b.call(N, y));
            const q = `${(I == null ? void 0 : I.conversationId) || ""}`.trim() || void 0, U = /* @__PURE__ */ new Set();
            for (const k of (I == null ? void 0 : I.operationRefs) || []) {
              const F = typeof k == "string" ? k : `${(k == null ? void 0 : k.operation_id) || ""}`;
              F.trim() && U.add(F.trim());
            }
            for (const k of (I == null ? void 0 : I.confirmationRequests) || []) {
              const F = `${(k == null ? void 0 : k.operation_id) || ""}`.trim();
              F && U.add(F);
            }
            for (const k of U)
              (h = (S = this.options).onAgentOperationSignal) == null || h.call(S, {
                operationId: k,
                conversationId: q,
                confirmationMode: y || void 0
              });
            const D = Ot(I == null ? void 0 : I.citations);
            let B = zt(
              `${(I == null ? void 0 : I.answer) || _ || ""}`.trim() || "没有找到可用回答。",
              D
            );
            if (P && (B += `

_在线服务暂不可用，以上来自本地文档检索。_`), (I == null ? void 0 : I.persisted) === !1 && (B += `

_⚠️ 本轮回答未能写入历史记录（存储暂时不可用），刷新后可能丢失。_`), !_)
              l({ type: "text-delta", id: g, delta: B });
            else if (B.startsWith(_)) {
              const k = B.slice(_.length);
              k && l({ type: "text-delta", id: g, delta: k });
            }
            l({ type: "text-end", id: g }), f({
              citations: D,
              persisted: (I == null ? void 0 : I.persisted) !== !1,
              progress: "",
              status: "complete"
            }), l({ type: "finish-step" }), l({ type: "finish", finishReason: "stop", messageMetadata: z });
          } catch (M) {
            e != null && e.aborted ? (f({ progress: "", status: "cancelled" }), l({ type: "abort", reason: "cancelled" })) : (f({ progress: "", status: "error" }), l({
              type: "error",
              errorText: M instanceof Error ? M.message : "生成回答失败，请重试。"
            }));
          } finally {
            T || (T = !0, E.close());
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
  const e = L(t.remoteAnswerer), n = L(t.localAnswerer), s = L(t.onAgentOperationSignal), i = L(t.onConfirmationMode), r = L(t.assistantMode);
  e.current = t.remoteAnswerer, n.current = t.localAnswerer, s.current = t.onAgentOperationSignal, i.current = t.onConfirmationMode, r.current = t.assistantMode;
  const o = X(() => new Dt({
    id: `reader-${t.jobId || "idle"}`,
    transport: new zn({
      jobId: t.jobId,
      getRemoteAnswerer: () => e.current,
      getLocalAnswerer: () => n.current,
      getAssistantMode: () => r.current,
      onAgentOperationSignal: (d) => {
        var p;
        return (p = s.current) == null ? void 0 : p.call(s, d);
      },
      onConfirmationMode: (d) => {
        var p;
        return (p = i.current) == null ? void 0 : p.call(i, d);
      }
    })
  }), [t.jobId]);
  return H(() => {
    t.enabled || o.stop();
  }, [o, t.enabled]), H(() => () => {
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
  const n = new Map(t.map((d) => [d.message.id, d])), s = e && n.get(e) || t.at(-1);
  if (!s) return [];
  const i = [];
  let r = s;
  const o = /* @__PURE__ */ new Set();
  for (; r && !o.has(r.message.id); )
    o.add(r.message.id), i.push(r.message), r = r.parentId ? n.get(r.parentId) : void 0;
  return i.reverse();
}
function Kn(t, e) {
  var n;
  return e ? ((n = t.find((s) => s.message.id === e)) == null ? void 0 : n.message) ?? null : null;
}
function Wn(t, e) {
  const n = new Map(t.map((o) => [o.message.id, o]));
  let s = n.get(e);
  if (!s) return [];
  const i = [], r = /* @__PURE__ */ new Set();
  for (; s && !r.has(s.message.id); )
    r.add(s.message.id), i.push(s), s = s.parentId ? n.get(s.parentId) : void 0;
  return i.reverse();
}
function Un(t, e, n) {
  var w, g, v, m;
  const s = `${e || ""}`.trim();
  if (!s || !t.length) return [];
  let i = s;
  t.some((u) => u.message.id === i) || (n && t.some((u) => u.message.id === n) ? i = n : i = ((w = [...t].reverse().find((u) => u.message.role === "assistant")) == null ? void 0 : w.message.id) || "");
  let r = Wn(t, i);
  if (r.length >= 2 && ((g = r.at(-1)) == null ? void 0 : g.message.role) === "assistant") return r;
  r.length === 1 && ((v = r[0]) == null ? void 0 : v.message.role) === "user" && (r = []);
  const o = ie(t, n || i);
  let d = o.findIndex((u) => u.id === i);
  if (d < 0 && (d = o.length - 1), d < 0) return r;
  const p = new Map(t.map((u) => [u.message.id, u])), c = o.slice(0, d + 1).map((u) => p.get(u.id)).filter((u) => !!u);
  for (; c.length && ((m = c.at(-1)) == null ? void 0 : m.message.role) !== "assistant"; ) c.pop();
  return c.length ? c : r;
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
    const i = s.message;
    i.role === "assistant" && ((n = i.citations) != null && n.length) && (e[i.id] = i.citations);
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
  var i;
  const s = e || ((i = n == null ? void 0 : n.getConversationId) == null ? void 0 : i.call(n)) || "";
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
    appendExchange: ({ parentId: s, userId: i, assistantId: r, question: o, progress: d }) => {
      e((p) => [
        ...p,
        { parentId: s, message: { id: i, role: "user", content: o } },
        {
          parentId: i,
          message: {
            id: r,
            role: "assistant",
            content: "",
            progress: d,
            status: { type: "running" },
            citations: []
          }
        }
      ]), n(r);
    },
    appendRetryTurn: ({ assistantId: s, branchParent: i }) => {
      e((r) => [
        ...r,
        {
          parentId: i,
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
          (i) => {
            var r;
            return ((r = i.message.status) == null ? void 0 : r.type) === "running" ? {
              ...i,
              message: {
                ...i.message,
                status: { type: "incomplete", reason: "cancelled" },
                progress: "",
                content: i.message.content.trim() || "已取消"
              }
            } : i;
          }
        )
      );
    },
    markRunningAsError: (s) => {
      const i = `${s || ""}`.trim() || "生成回答失败，请重试。";
      e((r) => r.map((o) => {
        var d;
        return ((d = o.message.status) == null ? void 0 : d.type) === "running" ? {
          ...o,
          message: {
            ...o.message,
            content: o.message.content.trim() || i,
            progress: "",
            citations: [],
            status: { type: "incomplete", reason: "error" }
          }
        } : o;
      }));
    },
    mergeChatMirror: (s) => {
      s.size && e((i) => i.map((r) => {
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
    refreshSessions: i,
    applyConversationTree: r,
    remoteRef: o,
    streamRef: d,
    itemsRef: p,
    documentIdRef: c,
    lastJobRef: w,
    persistReadyRef: g,
    switchTokenRef: v,
    sessionListGenerationRef: m,
    activeConversationIdRef: u,
    setItems: x,
    setHeadId: O,
    setSessions: C,
    setActiveConversationId: E,
    setSessionBusy: T
  } = t;
  H(() => {
    const _ = o.current;
    if (!e) {
      m.current += 1, v.current += 1, x([]), O(null), C([]), E(""), d.current.clearMessages(), u.current = "", w.current = "", c.current = "", g.current = !1;
      return;
    }
    const z = w.current !== e;
    if (z && (m.current += 1, v.current += 1, w.current = e, g.current = !1, x([]), O(null), d.current.clearMessages(), C([]), E(""), u.current = "", c.current = "", T(!1)), !s || !_) {
      m.current += 1;
      return;
    }
    let l = !1;
    return (async () => {
      var S, h, M, P;
      let f = `${n || c.current || ""}`.trim();
      if (!f) {
        try {
          f = `${await ((S = _.getDocumentId) == null ? void 0 : S.call(_)) || ""}`.trim();
        } catch {
          f = "";
        }
        if (l) return;
      }
      f && (c.current = f);
      let R = null;
      if (!l && f && (R = await i(f)), !(z || !p.current.length) || l) {
        l || (g.current = !0);
        return;
      }
      const N = jt({ jobId: e, documentId: f }) || `${((h = _.getConversationId) == null ? void 0 : h.call(_)) || ""}`.trim();
      if (N) {
        E(N), u.current = N, (M = _.setConversationId) == null || M.call(_, N, f);
        try {
          const I = await ye(N);
          if (l) return;
          const y = ve(I.messages || []);
          if (y.length) {
            r(y, I.head_id), requestAnimationFrame(() => {
              l || (g.current = !0);
            });
            return;
          }
        } catch {
        }
      }
      if (!l && f)
        try {
          const I = R ?? await i(f);
          if (l || !I) return;
          const y = I[0];
          if (y != null && y.conversation_id) {
            const q = y.conversation_id;
            E(q), u.current = q, (P = _.setConversationId) == null || P.call(_, q, f);
            try {
              const U = await ye(q);
              if (l) return;
              r(
                ve(U.messages || []),
                U.head_id
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
      const b = Je({ jobId: e, documentId: f }, N);
      if (b != null && b.items.length) {
        const I = at(b);
        x(I.items), O(I.headId), d.current.showMessages(ie(I.items, I.headId));
      } else
        x([]), O(null), d.current.clearMessages();
      requestAnimationFrame(() => {
        l || (g.current = !0);
      });
    })(), () => {
      l = !0, m.current += 1;
    };
  }, [e, n, s, i, r]);
}
function Zn(t) {
  const {
    jobId: e,
    documentId: n,
    items: s,
    headId: i,
    activeConversationId: r,
    documentIdRef: o,
    persistReadyRef: d
  } = t;
  H(() => {
    if (!e || !d.current) return;
    const p = r, c = { jobId: e, documentId: n || o.current }, w = window.setTimeout(() => {
      if (!s.length) {
        ue(c, p);
        return;
      }
      Ae(c, Se(s, i), p);
    }, 280);
    return () => window.clearTimeout(w);
  }, [e, n, s, i, r]);
}
function es(t) {
  const {
    jobId: e,
    documentId: n,
    sessionBusy: s,
    sessions: i,
    streamRef: r,
    remoteRef: o,
    itemsRef: d,
    headIdRef: p,
    activeConversationIdRef: c,
    documentIdRef: w,
    switchTokenRef: g,
    persistReadyRef: v,
    setSessionBusy: m,
    setSessionError: u,
    setActiveConversationId: x,
    setItems: O,
    setHeadId: C,
    setSessions: E,
    refreshSessions: T,
    applyConversationTree: _
  } = t, z = G(() => {
    var b, S;
    const N = `${((S = (b = o.current) == null ? void 0 : b.getConversationId) == null ? void 0 : S.call(b)) || ""}`.trim();
    N && x(N);
  }, []), l = G(async () => {
    var b, S;
    if (s) return;
    await r.current.stopStream(), oe(900), ae(900), m(!0), u("");
    const N = ++g.current;
    try {
      if (await new Promise((P) => {
        window.setTimeout(P, 40);
      }), N !== g.current) return;
      const h = o.current, M = w.current || `${await ((b = h == null ? void 0 : h.getDocumentId) == null ? void 0 : b.call(h)) || ""}`.trim();
      if (N !== g.current) return;
      w.current = M, (S = h == null ? void 0 : h.clearConversationId) == null || S.call(h, M), x(""), c.current = "", O([]), C(null), r.current.clearMessages(), ue({ jobId: e, documentId: M }), M && await T(M, N);
    } catch (h) {
      console.warn("[reader-ai] new session failed", h), u("无法创建新对话，请重试。");
    } finally {
      N === g.current && m(!1);
    }
  }, [e, T, s]), f = G(async (N) => {
    var P, I, y, q, U;
    const b = `${N || ""}`.trim();
    if (!b)
      return u("无法分支：消息 id 无效。"), !1;
    if (s)
      return u("请稍候，当前有会话操作进行中。"), !1;
    await r.current.stopStream();
    const S = Un(d.current, b, p.current);
    if (!S.length)
      return u("无法分支：找不到到此答案的对话路径。"), !1;
    if (S[S.length - 1].message.role !== "assistant")
      return u("只能从助手答案处开新对话。"), !1;
    m(!0), u("");
    const M = ++g.current;
    try {
      if (await new Promise((W) => {
        window.setTimeout(W, 40);
      }), M !== g.current) return !1;
      const D = o.current;
      let B = w.current || `${await ((P = D == null ? void 0 : D.getDocumentId) == null ? void 0 : P.call(D)) || ""}`.trim();
      if (M !== g.current) return !1;
      if (w.current = B, !B)
        try {
          if (B = `${await ((I = D == null ? void 0 : D.getDocumentId) == null ? void 0 : I.call(D)) || ""}`.trim(), M !== g.current) return !1;
          w.current = B;
        } catch {
          B = "";
        }
      if (!B)
        return u("无法分支：文档未就绪，请稍后重试。"), !1;
      const k = S.map((W, ne) => ({
        id: W.message.id,
        role: W.message.role,
        content: W.message.content,
        citations: W.message.citations,
        parentId: ne === 0 ? null : S[ne - 1].message.id
      })), F = c.current || ((y = D == null ? void 0 : D.getConversationId) == null ? void 0 : y.call(D)) || "", Y = (i || []).find((W) => W.conversation_id === F), J = k.find((W) => W.role === "user"), ce = `${(Y == null ? void 0 : Y.title) || ""}`.trim() || `${(J == null ? void 0 : J.content) || ""}`.replace(/\s+/g, " ").trim() || "未命名对话", Re = (i || []).map((W) => W.title || ""), le = Kt(ce, Re), te = await Wt({
        documentId: B,
        title: le,
        path: k
      });
      if (M !== g.current) return !1;
      const j = ke(te.items), Q = ((q = j[j.length - 1]) == null ? void 0 : q.message.id) || null, V = te.conversation.conversation_id;
      if (!V || !j.length)
        throw new Error("fork returned empty conversation");
      return oe(600), ae(600), O(j), C(Q), r.current.showMessages(ie(j, Q)), x(V), c.current = V, (U = D == null ? void 0 : D.setConversationId) == null || U.call(D, V, B), E((W) => {
        const ne = {
          conversation_id: V,
          title: le,
          document_id: B,
          created_at: te.conversation.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: te.conversation.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
          message_count: j.length,
          head_id: Q || ""
        }, me = W.filter((de) => de.conversation_id !== V);
        return [ne, ...me];
      }), Ae(
        { jobId: e, documentId: B },
        Se(j, Q),
        V
      ), await T(B, M), !0;
    } catch (D) {
      return console.warn("[reader-ai] branch from answer failed", D), M === g.current && u("分支失败：未能复制上文到新对话。请检查网络后重试。"), !1;
    } finally {
      M === g.current && m(!1);
    }
  }, [e, T, s, i]), R = G(async (N) => {
    var h, M, P, I;
    const b = `${N || ""}`.trim();
    if (!b || s) return;
    await r.current.stopStream(), m(!0), u("");
    const S = ++g.current;
    try {
      const y = o.current, q = w.current || `${await ((h = y == null ? void 0 : y.getDocumentId) == null ? void 0 : h.call(y)) || ""}`.trim();
      if (S !== g.current) return;
      w.current = q;
      try {
        await Ut(b);
      } catch (B) {
        if ((Number(B == null ? void 0 : B.status) || 0) !== 404) throw B;
      }
      ue({ jobId: e, documentId: q }, b);
      const D = (c.current || ((M = y == null ? void 0 : y.getConversationId) == null ? void 0 : M.call(y)) || "") === b;
      if (E((B) => B.filter((k) => k.conversation_id !== b)), D) {
        (P = y == null ? void 0 : y.clearConversationId) == null || P.call(y, q), x(""), c.current = "", O([]), C(null), r.current.clearMessages(), ue({ jobId: e, documentId: q });
        const B = q ? await T(q, S) : [];
        if (S !== g.current || !B) return;
        const k = B[0];
        if (k != null && k.conversation_id) {
          const F = k.conversation_id;
          x(F), c.current = F;
          try {
            const Y = await ye(F);
            if (S !== g.current) return;
            _(
              ve(Y.messages || []),
              Y.head_id
            ), (I = y == null ? void 0 : y.setConversationId) == null || I.call(y, F, q);
          } catch {
            O([]), C(null);
          }
        }
      } else q && await T(q, S);
    } catch (y) {
      console.warn("[reader-ai] delete session failed", y), u("删除对话失败，请重试。");
    } finally {
      S === g.current && m(!1);
    }
  }, [_, e, T, s]), A = G(async (N, b) => {
    const S = `${N || ""}`.trim(), h = `${b || ""}`.replace(/\s+/g, " ").trim();
    if (!S || !h || s) return;
    m(!0), u("");
    const M = ++g.current;
    try {
      const P = h.slice(0, 80);
      if (await Ht(S, { title: P }), M !== g.current) return;
      E(
        (y) => y.map(
          (q) => q.conversation_id === S ? { ...q, title: P } : q
        )
      );
      const I = w.current;
      I && await T(I, M);
    } catch (P) {
      console.warn("[reader-ai] rename session failed", P), u("重命名失败，请重试。");
    } finally {
      M === g.current && m(!1);
    }
  }, [T, s]);
  return {
    adoptRemoteConversationId: z,
    newSession: l,
    branchFromAnswer: f,
    removeSession: R,
    renameSession: A
  };
}
function ts(t) {
  var le;
  const {
    jobId: e,
    documentId: n = "",
    enabled: s,
    remoteAnswerer: i = null,
    stream: r = Hn
  } = t, [o, d] = K([]), [p, c] = K(null), [w, g] = K([]), [v, m] = K(""), [u, x] = K(!1), [O, C] = K(""), E = L(o), T = L(p), _ = L(v), z = L(!1), l = L(""), f = L(""), R = L(0), A = L(0), N = L(r);
  N.current = r;
  const b = L(i);
  b.current = i, E.current = o, T.current = p, _.current = v;
  const S = G(async (te = "", j) => {
    const Q = `${te || f.current || ""}`.trim(), V = ++A.current;
    if (!Q)
      return V === A.current && (j === void 0 || j === R.current) && g([]), [];
    try {
      const ne = (await Gt({ document_id: Q, limit: 50 })).conversations || [];
      return V === A.current && Q === `${f.current || ""}`.trim() && (j === void 0 || j === R.current) ? (g(ne), ne) : null;
    } catch {
      return null;
    }
  }, []), h = G((te, j) => {
    var W;
    const Q = ke(te), V = `${j || ""}`.trim() || ((W = Q[Q.length - 1]) == null ? void 0 : W.message.id) || null;
    d(Q), c(V), N.current.showMessages(ie(Q, V));
  }, []), M = G(() => `${n || f.current || e}`.trim(), [n, e]);
  Xn({
    jobId: e,
    documentId: n,
    enabled: s,
    refreshSessions: S,
    applyConversationTree: h,
    remoteRef: b,
    streamRef: N,
    itemsRef: E,
    documentIdRef: f,
    lastJobRef: l,
    persistReadyRef: z,
    switchTokenRef: R,
    sessionListGenerationRef: A,
    activeConversationIdRef: _,
    setItems: d,
    setHeadId: c,
    setSessions: g,
    setActiveConversationId: m,
    setSessionBusy: x
  }), Zn({
    jobId: e,
    documentId: n,
    items: o,
    headId: p,
    activeConversationId: v,
    documentIdRef: f,
    persistReadyRef: z
  });
  const P = X(
    () => ie(o, p),
    [o, p]
  ), I = X(
    () => Gn(o),
    [o]
  ), y = X(
    () => Vn(o),
    [o]
  ), q = X(
    () => Yn(o),
    [o]
  ), U = X(() => Qn({ setItems: d, setHeadId: c, itemsRef: E, headIdRef: T }), []), {
    adoptRemoteConversationId: D,
    newSession: B,
    branchFromAnswer: k,
    removeSession: F,
    renameSession: Y
  } = es({
    jobId: e,
    documentId: n,
    sessionBusy: u,
    sessions: w,
    streamRef: N,
    remoteRef: b,
    itemsRef: E,
    headIdRef: T,
    activeConversationIdRef: _,
    documentIdRef: f,
    switchTokenRef: R,
    persistReadyRef: z,
    setSessionBusy: x,
    setSessionError: C,
    setActiveConversationId: m,
    setItems: d,
    setHeadId: c,
    setSessions: g,
    refreshSessions: S,
    applyConversationTree: h
  }), J = G(async (te) => {
    var W, ne, me, de, xe, Te, $e, Ee;
    const j = `${te || ""}`.trim(), Q = _.current || ((ne = (W = b.current) == null ? void 0 : W.getConversationId) == null ? void 0 : ne.call(W)) || "";
    if (!j || j === Q || u) return;
    await N.current.stopStream(), oe(1200), ae(1200), x(!0), C("");
    const V = ++R.current;
    z.current = !1, m(j), _.current = j, d([]), c(null), N.current.clearMessages();
    try {
      if (await new Promise((fe) => {
        window.setTimeout(fe, 80);
      }), V !== R.current) return;
      try {
        (xe = (de = (me = globalThis.document) == null ? void 0 : me.activeElement) == null ? void 0 : de.blur) == null || xe.call(de);
      } catch {
      }
      const Z = b.current, ee = f.current || `${await ((Te = Z == null ? void 0 : Z.getDocumentId) == null ? void 0 : Te.call(Z)) || ""}`.trim();
      if (V !== R.current) return;
      f.current = ee;
      const re = await ye(j);
      if (V !== R.current) return;
      oe(800), ae(800);
      const Ce = ve(re.messages || []);
      if (h(Ce, re.head_id), ($e = Z == null ? void 0 : Z.setConversationId) == null || $e.call(Z, j, ee), z.current = !0, Ce.length) {
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
      ee && await S(ee, V), oe(350), ae(350);
    } catch (Z) {
      if (console.warn("[reader-ai] switch session failed", Z), V === R.current) {
        C("加载该对话失败，请检查网络后重试。");
        const ee = Je(
          { jobId: e, documentId: n || f.current },
          j
        );
        if (ee != null && ee.items.length) {
          const re = at(ee);
          d(re.items), c(re.headId), N.current.showMessages(ie(re.items, re.headId));
        } else
          d([]), c(null);
        z.current = !0;
      }
    } finally {
      V === R.current && x(!1);
    }
  }, [
    h,
    e,
    n,
    S,
    u
  ]), ce = X(
    () => Jn(w, v, i),
    [w, v, i]
  ), Re = X(() => ({
    refreshSessions: S,
    adoptRemoteConversationId: D,
    newSession: B,
    switchSession: J,
    removeSession: F,
    renameSession: Y,
    branchFromAnswer: k
  }), [
    S,
    D,
    B,
    J,
    F,
    Y,
    k
  ]);
  return {
    items: o,
    headId: p,
    messages: P,
    citationsByMessageId: I,
    progressByMessageId: y,
    contentByMessageId: q,
    sessions: ce,
    activeConversationId: v || ((le = i == null ? void 0 : i.getConversationId) == null ? void 0 : le.call(i)) || "",
    sessionBusy: u,
    sessionError: O,
    resolveRequestScopeKey: M,
    tree: U,
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
  const i = e.context && typeof e.context == "object" && !Array.isArray(e.context) ? { ...e.context } : null;
  return { assistantMode: n, scope: s, context: i };
}
function ze(t, e, n) {
  var r;
  const s = `${t || ""}`.trim(), i = `${e || ""}`.trim();
  if (!(!s || !i))
    try {
      (r = globalThis.localStorage) == null || r.setItem(
        it(s, i),
        JSON.stringify(n)
      );
    } catch {
    }
}
function qe(t, e) {
  var i;
  const n = `${t || ""}`.trim(), s = `${e || ""}`.trim();
  if (!n || !s) return null;
  try {
    const r = (i = globalThis.localStorage) == null ? void 0 : i.getItem(it(n, s));
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
  var z;
  const { jobId: e, assistantMode: n, selectionContext: s = null, tree: i, chat: r, getScopeKey: o } = t, d = L(i);
  d.current = i;
  const p = L(r);
  p.current = r;
  const c = L(n);
  c.current = n;
  const w = L(s);
  w.current = s;
  const g = L(o);
  g.current = o;
  const v = r.status, m = v === "submitted" || v === "streaming", u = L(m);
  u.current = m;
  const x = m ? `${((z = jn(r.messages)) == null ? void 0 : z.id) || ""}` : "", O = r.messages, C = r.error;
  H(() => {
    if (!O.length) return;
    const l = new Map(O.map((R) => [R.id, R])), f = /* @__PURE__ */ new Map();
    for (const [R, A] of l)
      f.set(R, Bn(A));
    d.current.mergeChatMirror(f);
  }, [O]), H(() => {
    !C || v !== "error" || d.current.markRunningAsError(C.message);
  }, [C, v]);
  const E = G(async (l) => {
    if (u.current) return;
    const f = `${l || ""}`.trim();
    if (!f) return;
    const R = d.current, A = p.current, N = c.current, b = w.current, S = g.current(), h = R.readHeadId(), M = Ne("u"), P = Ne("a"), I = is({
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
    ze(S, P, I), R.appendExchange({
      parentId: h,
      userId: M,
      assistantId: P,
      question: f,
      progress: I.assistantMode === "operations" ? "正在规划 PDF 操作…" : "正在理解文档…"
    }), await A.sendUserMessage(
      { id: M, role: "user", parts: [{ type: "text", text: f }] },
      {
        body: {
          assistantMessageId: P,
          assistantMode: I.assistantMode,
          parentId: h,
          question: f,
          regenerate: !1,
          userMessageId: M,
          scope: I.scope,
          context: I.context
        }
      }
    );
  }, []), T = G(async (l) => {
    if (u.current) return;
    const f = d.current, R = p.current, A = f.readItems(), N = A.find(
      (U) => U.message.id === l && U.message.role === "assistant"
    ), b = (N == null ? void 0 : N.parentId) ?? null, S = b ? Kn(A, b) : null;
    let h = "", M = b;
    if ((S == null ? void 0 : S.role) === "user")
      h = S.content.trim();
    else {
      const U = ie(A, b ?? f.readHeadId());
      for (let D = U.length - 1; D >= 0; D -= 1)
        if (U[D].role === "user") {
          h = U[D].content.trim(), M = U[D].id;
          break;
        }
    }
    if (!h) return;
    const P = Ne("a"), I = M || b, y = g.current(), q = as({
      scopeKey: y,
      jobId: e,
      assistantMessageId: l
    });
    ze(y, P, q), f.appendRetryTurn({ assistantId: P, branchParent: I }), R.replaceVisible(rt(ie(A, l))), await R.regenerateFrom({
      messageId: l,
      body: {
        assistantMessageId: P,
        assistantMode: q.assistantMode,
        parentId: I,
        question: h,
        regenerate: !0,
        userMessageId: M || "",
        scope: q.scope,
        context: q.context
      }
    });
  }, [e]), _ = G(async () => {
    await p.current.stopStream(), d.current.markRunningCancelled();
  }, []);
  return {
    isRunning: m,
    streamingAssistantId: x,
    submitQuestion: E,
    retryAnswer: T,
    cancelAnswer: _
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
  confirmationModeHint: i,
  onDocumentCommitted: r
}) {
  const [o, d] = K({}), [p, c] = K("explicit"), [w, g] = K(!1), [v, m] = K(!1), u = L(/* @__PURE__ */ new Set()), x = L(/* @__PURE__ */ new Set()), O = L(/* @__PURE__ */ new Set()), C = G((l, f = !1) => {
    l != null && l.operation_id && d((R) => {
      const A = R[l.operation_id];
      return us(A == null ? void 0 : A.operation, l) ? {
        ...R,
        [l.operation_id]: {
          ...A,
          operation: l,
          pendingAction: void 0,
          error: void 0
        }
      } : !f || !(A != null && A.pendingAction) ? R : {
        ...R,
        [l.operation_id]: { ...A, pendingAction: void 0 }
      };
    });
  }, []), E = G(async (l, f = !1) => {
    const R = `${l || ""}`.trim(), A = `refresh:${R}`;
    if (!(!R || u.current.has(A))) {
      u.current.add(A);
      try {
        C(await Vt(R), f);
      } catch {
      } finally {
        u.current.delete(A);
      }
    }
  }, [C]), T = G(async () => {
    const l = `${t || ""}`.trim(), f = `recover:${l}`;
    if (!(!e || !l || u.current.has(f))) {
      u.current.add(f);
      try {
        const R = await Yt({ conversationId: l, limit: 50 });
        if (!O.current.has(l)) {
          for (const A of R.operations || [])
            A.status === "committed" && x.current.add(A.operation_id);
          O.current.add(l);
        }
        for (const A of R.operations || []) C(A);
      } catch {
      } finally {
        u.current.delete(f);
      }
    }
  }, [t, e, C]);
  H(() => {
    if (!e) return;
    let l = !1;
    const f = async () => {
      try {
        const A = await tn();
        if (l) return;
        c(A.agent_confirmation_mode || "explicit"), m(!!A.llm_api_key_configured), g(
          A.restart_required || A.restart_state === "pending" || A.active_revision !== A.configured_revision
        );
      } catch {
        l || (g(!1), m(!1));
      }
    };
    f();
    const R = window.setInterval(f, 3e3);
    return () => {
      l = !0, window.clearInterval(R);
    };
  }, [e]), H(() => {
    i && c(i);
  }, [i]), H(() => {
    s != null && s.confirmationMode && c(s.confirmationMode), s != null && s.operationId && E(s.operationId);
  }, [E, s]), H(() => {
    T();
  }, [T]), H(() => {
    n || T();
  }, [n, T]);
  const _ = X(
    () => Object.values(o).filter((l) => !!t && l.operation.conversation_id === t).sort((l, f) => `${l.operation.created_at || ""}`.localeCompare(`${f.operation.created_at || ""}`)),
    [t, o]
  );
  H(() => {
    var l;
    for (const f of _) {
      const R = f.operation;
      R.status !== "committed" || x.current.has(R.operation_id) || (x.current.add(R.operation_id), r == null || r({
        documentId: R.document_id,
        revision: ((l = R.candidate) == null ? void 0 : l.version_id) || `${R.updated_at || ""}` || `${R.operation_id}:${ls(R)}`
      }));
    }
  }, [_, r]);
  const z = _.some((l) => Be(l.operation.status, p));
  return H(() => {
    if (!e || !t || !n && !z) return;
    const l = window.setInterval(() => {
      T();
      for (const f of _)
        Be(f.operation.status, p) && E(f.operation.operation_id);
    }, 1400);
    return () => window.clearInterval(l);
  }, [p, t, n, e, _, z, T, E]), H(() => {
    if (!e) return;
    const l = () => void T(), f = () => {
      document.visibilityState === "visible" && l();
    };
    return window.addEventListener("online", l), document.addEventListener("visibilitychange", f), () => {
      window.removeEventListener("online", l), document.removeEventListener("visibilitychange", f);
    };
  }, [e, T]), {
    entries: _,
    confirmationMode: p,
    runtimeRestarting: w,
    runtimeCredentialConfigured: v,
    setEntriesById: d,
    inFlightRef: u,
    upsert: C,
    refresh: E
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
  const i = L(/* @__PURE__ */ new Map());
  return { perform: G(async (o, d, p = {}) => {
    const c = `${d.operation_id || ""}`.trim(), w = `action:${c}`;
    if (!c || s.current.has(w)) return;
    if (o === "retry" && d.status === "ambiguous" && p.acceptDuplicateRisk !== !0) {
      n((m) => ({
        ...m,
        [c]: {
          ...m[c],
          error: "请先确认重复执行风险，再重新执行操作。"
        }
      }));
      return;
    }
    const g = gs(c, o, i.current);
    s.current.add(w), n((m) => ({
      ...m,
      [c]: { ...m[c], pendingAction: o, error: void 0 }
    }));
    const v = {
      idempotency_key: g,
      expected_status: d.status,
      expected_attempt: d.current_attempt,
      expected_program_sha256: d.program_sha256 || ""
    };
    try {
      let m;
      o === "run" ? m = await Jt(c, v) : o === "cancel" ? m = await Qt(c, { ...v, reason: "user_rejected" }) : o === "commit" ? m = await Xt(c, v) : m = await Zt(c, p.acceptDuplicateRisk ? { ...v, accept_duplicate_risk: !0 } : v), Le(c, o, i.current), e(m, !0);
    } catch (m) {
      ps(m) === 409 ? (Le(c, o, i.current), await t(c, !0)) : n((u) => ({
        ...u,
        [c]: {
          ...u[c],
          pendingAction: void 0,
          error: ms(m)
        }
      }));
    } finally {
      s.current.delete(w);
    }
  }, [t, e]) };
}
function vs({
  conversationId: t,
  enabled: e,
  discovering: n,
  signal: s,
  confirmationModeHint: i,
  onDocumentCommitted: r
}) {
  const o = fs({
    conversationId: t,
    enabled: e,
    discovering: n,
    signal: s,
    confirmationModeHint: i,
    onDocumentCommitted: r
  }), { perform: d } = ys({
    refresh: o.refresh,
    upsert: o.upsert,
    setEntriesById: o.setEntriesById,
    inFlightRef: o.inFlightRef
  }), p = G((c) => en(c.operation_id), []);
  return {
    entries: o.entries,
    confirmationMode: o.confirmationMode,
    runtimeRestarting: o.runtimeRestarting,
    runtimeCredentialConfigured: o.runtimeCredentialConfigured,
    perform: d,
    loadCandidate: p
  };
}
function ws(t) {
  var l;
  const { jobId: e, documentId: n = "", enabled: s, selectionContext: i = null, onDocumentCommitted: r } = t, [o, d] = K("reading"), [p, c] = K(null), [w, g] = K();
  H(() => {
    d("reading"), c(null), g(void 0);
  }, [e]);
  const v = X(() => !s || !e ? null : kt({ jobId: e, documentId: n }), [n, s, e]), m = X(() => !s || !e ? null : qt({
    loadMarkdownPayload: At.loadMarkdownPayload
  }), [s, e]), u = Ln({
    jobId: e,
    enabled: s,
    remoteAnswerer: v,
    localAnswerer: m,
    assistantMode: o,
    onAgentOperationSignal: (f) => {
      c({ ...f, nonce: Date.now() + Math.random() });
    },
    onConfirmationMode: g
  }), x = X(() => ({
    messages: u.messages,
    status: u.status,
    error: u.error,
    sendUserMessage: (f, R) => u.sendMessage(
      f,
      R
    ),
    regenerateFrom: (f) => u.regenerate(
      f
    ),
    stopStream: () => u.stop(),
    replaceVisible: (f) => u.setMessages([...f])
  }), [u]), O = X(() => ({
    stopStream: () => x.stopStream(),
    clearMessages: () => x.replaceVisible([]),
    showMessages: (f) => x.replaceVisible(rt(f))
  }), [x]), C = ts({
    jobId: e,
    documentId: n,
    enabled: s,
    remoteAnswerer: v,
    stream: O
  }), E = os({
    jobId: e,
    assistantMode: o,
    selectionContext: i,
    tree: C.tree,
    chat: x,
    getScopeKey: () => C.resolveRequestScopeKey()
  }), T = C.activeConversationId || (p == null ? void 0 : p.conversationId) || `${((l = v == null ? void 0 : v.getConversationId) == null ? void 0 : l.call(v)) || ""}`.trim(), _ = vs({
    conversationId: T,
    enabled: s,
    discovering: E.isRunning,
    signal: p,
    confirmationModeHint: w,
    onDocumentCommitted: r
  }), z = L(!1);
  return H(() => {
    z.current = !1;
  }, [e]), H(() => {
    z.current && !E.isRunning && (C.sessionCommands.refreshSessions(), C.sessionCommands.adoptRemoteConversationId()), z.current = E.isRunning;
  }, [C, E.isRunning]), {
    citationsByMessageId: C.citationsByMessageId,
    progressByMessageId: C.progressByMessageId,
    contentByMessageId: C.contentByMessageId,
    streamingAssistantId: E.streamingAssistantId,
    isRunning: E.isRunning,
    messages: C.messages,
    sessions: C.sessions,
    activeConversationId: C.activeConversationId,
    sessionBusy: C.sessionBusy,
    sessionError: C.sessionError,
    submitQuestion: E.submitQuestion,
    retryAnswer: E.retryAnswer,
    cancelAnswer: E.cancelAnswer,
    newSession: C.sessionCommands.newSession,
    switchSession: C.sessionCommands.switchSession,
    removeSession: C.sessionCommands.removeSession,
    renameSession: C.sessionCommands.renameSession,
    branchFromAnswer: C.sessionCommands.branchFromAnswer,
    agentOperations: _,
    assistantMode: o,
    setAssistantMode: d
  };
}
function Fs({
  open: t,
  jobId: e,
  documentId: n = "",
  onClose: s,
  onJumpCitation: i,
  onDocumentCommitted: r,
  layout: o = "floating",
  side: d = "right",
  selectionContext: p = null,
  onClearSelectionContext: c
}) {
  const w = t && !!e, {
    citationsByMessageId: g,
    progressByMessageId: v,
    contentByMessageId: m,
    streamingAssistantId: u,
    isRunning: x,
    sessions: O,
    activeConversationId: C,
    sessionBusy: E,
    sessionError: T,
    messages: _,
    submitQuestion: z,
    retryAnswer: l,
    cancelAnswer: f,
    newSession: R,
    switchSession: A,
    removeSession: N,
    renameSession: b,
    branchFromAnswer: S,
    agentOperations: h,
    assistantMode: M,
    setAssistantMode: P
  } = ws({
    jobId: e,
    documentId: n,
    enabled: w,
    selectionContext: p,
    onDocumentCommitted: r
  }), [I, y] = K(""), q = G(async (D) => {
    y(""), await S(D) && (y(
      "已保存新对话（fork-n-原名）：复制了到此答案的上文，原对话不变。顶部列表可切换。"
    ), window.setTimeout(() => y(""), 6e3));
  }, [S]), U = G((D) => {
    i(D);
  }, [i]);
  return /* @__PURE__ */ a(
    St,
    {
      id: "reader-ai-panel",
      open: t,
      title: "RetainPDF AI",
      titleIcon: /* @__PURE__ */ a(pe, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.ai-float.pos.v2",
      ariaLabel: "阅读问答",
      width: 420,
      placement: o === "workspace" ? "workspace" : o === "docked" ? "dock-right" : "floating",
      showHeader: o !== "workspace",
      className: `reader-float-ai is-${o}${o === "workspace" ? ` is-pane-${d}` : ""}${E ? " is-session-busy" : ""}`,
      onClose: s,
      children: e ? /* @__PURE__ */ $("div", { className: "reader-float-ai-body", children: [
        /* @__PURE__ */ a(
          On,
          {
            sessions: O,
            activeId: C,
            busy: E,
            errorText: T,
            onSwitch: A,
            onNew: R,
            onDelete: N,
            onRename: b
          }
        ),
        I ? /* @__PURE__ */ a("div", { className: "aui-session-banner", role: "status", children: I }) : null,
        /* @__PURE__ */ a("div", { className: "reader-float-ai-thread-wrap", "aria-busy": E || void 0, children: /* @__PURE__ */ a(
          Pn,
          {
            jobId: e,
            messages: _,
            citationsByMessageId: g,
            progressByMessageId: v,
            contentByMessageId: m,
            streamingAssistantId: u,
            isRunning: x,
            onSubmit: z,
            onRetry: l,
            onCancel: f,
            onJumpCitation: U,
            onBranchFromAnswer: q,
            branchBusy: E,
            agentOperations: h,
            assistantMode: M,
            onAssistantModeChange: P,
            selectionContext: p,
            onClearSelectionContext: c
          }
        ) })
      ] }) : /* @__PURE__ */ $("div", { className: "reader-float-ai-empty", children: [
        /* @__PURE__ */ a(pe, { size: 22, strokeWidth: 1.75, "aria-hidden": !0 }),
        /* @__PURE__ */ a("p", { children: "当前文档还没有可用于 AI 的解析产物" }),
        /* @__PURE__ */ a("span", { children: "请先完成 OCR 文档解析" })
      ] })
    }
  );
}
export {
  Fs as ReaderAiPanel
};
//# sourceMappingURL=ReaderAiPanel-zWt9EqTm.js.map
