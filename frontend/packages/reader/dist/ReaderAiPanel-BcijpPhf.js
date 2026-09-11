import { jsx as i, jsxs as E, Fragment as ve } from "react/jsx-runtime";
import { useState as K, useRef as L, useEffect as H, useMemo as X, useCallback as G, useId as dt } from "react";
import { Square as lt, ArrowUp as ut, Copy as mt, GitBranch as pt, RefreshCw as ft, Sigma as Ke, Table2 as ht, Image as gt, Type as yt, X as be, BookOpen as We, Sparkles as pe, Loader2 as Re, FileText as ke, ArrowDown as Ue, ListTree as wt, FlaskConical as It, ShieldCheck as vt, Bot as bt, ChevronUp as Rt, ChevronDown as He, TriangleAlert as Ge, ExternalLink as _t, Check as Ve, Circle as Ct, Plus as Nt, Pencil as Mt, Trash2 as kt } from "lucide-react";
import { g as Ye, h as St, d as At, b as $t } from "./ReaderApp-kTlxBzs5.js";
import { ThreadPrimitive as se, ComposerPrimitive as ge, MessagePrimitive as Je, ActionBarPrimitive as Ne, useExternalStoreRuntime as Tt, AssistantRuntimeProvider as Et } from "@assistant-ui/react";
import { A as xt } from "./AiMarkdownAnswer-DET_KlrE.js";
import { M as Pt, C as Oe, h as Ot } from "./config-CgaWliJ_.js";
import { k as oe, q as ae, v as Dt } from "./answer-enhance-W8TBaAUL.js";
import { Chat as Ft, useChat as qt } from "@ai-sdk/react";
import { s as zt, l as Qe, c as me, b as Ae, a as Bt } from "./thread-branch-store-Jy9wH_F1.js";
import { l as Lt } from "./ask-answerer-GNQdzitl.js";
import { getConversation as we, messagesToBranchItems as Ie, nextForkConversationTitle as jt, forkConversationFromPath as Kt, deleteConversation as Wt, patchConversation as Ut, listConversations as Ht } from "@retainpdf/api/conversations";
import { getAgentOperation as Gt, listAgentOperations as Vt, runAgentOperation as Yt, cancelAgentOperation as Jt, commitAgentOperation as Qt, retryAgentOperation as Xt, fetchAgentOperationCandidate as Zt } from "@retainpdf/api/document-operations";
import { fetchAgentRuntimeConfig as en } from "@retainpdf/api/agent-runtime-settings";
function Xe(t) {
  return t.content.filter((e) => e.type === "text").map((e) => e.text).join(`
`).trim();
}
function De({ label: t }) {
  return /* @__PURE__ */ E("div", { className: "aui-thinking", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ i(Re, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
    /* @__PURE__ */ i("span", { children: t || "思考中…" })
  ] });
}
function tn({ message: t }) {
  return /* @__PURE__ */ i(Je.Root, { className: "aui-msg aui-msg-user", "data-role": "user", children: /* @__PURE__ */ i("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ i("div", { className: "aui-md-plain", children: Xe(t) }) }) });
}
function nn({
  jobId: t,
  message: e,
  citations: n,
  progress: s,
  streaming: a,
  branchBusy: r,
  onJumpCitation: o,
  onBranchFromAnswer: d
}) {
  const m = Xe(e);
  return /* @__PURE__ */ i(Je.Root, { className: "aui-msg aui-msg-assistant", "data-role": "assistant", children: /* @__PURE__ */ E("div", { className: "aui-msg-stack", children: [
    a && s ? /* @__PURE__ */ i(De, { label: s }) : null,
    a && !s && !m ? /* @__PURE__ */ i(De, { label: "思考中…" }) : null,
    m ? /* @__PURE__ */ i("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ i(
      xt,
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
      Ne.Root,
      {
        className: "aui-msg-actions",
        "data-reader-ai-actions": "",
        hideWhenRunning: !0,
        autohide: "not-last",
        children: [
          /* @__PURE__ */ i(Ne.Copy, { className: "aui-action-btn", "aria-label": "复制答案", title: "复制答案", children: /* @__PURE__ */ i(mt, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }) }),
          d ? /* @__PURE__ */ i(
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
              children: /* @__PURE__ */ i(pt, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 })
            }
          ) : null,
          /* @__PURE__ */ i(Ne.Reload, { className: "aui-action-btn", "aria-label": "重新生成", title: "重新生成", children: /* @__PURE__ */ i(ft, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 }) })
        ]
      }
    )
  ] }) });
}
function Ze({
  jobId: t,
  citationsByMessageId: e,
  progressByMessageId: n,
  streamingAssistantId: s,
  isRunning: a,
  branchBusy: r,
  onJumpCitation: o,
  onBranchFromAnswer: d
}) {
  return /* @__PURE__ */ i("div", { className: "aui-message-group", "data-slot": "aui_message-group", children: /* @__PURE__ */ i(se.Messages, { children: ({ message: m }) => {
    var I;
    if (m.role === "user") return /* @__PURE__ */ i(tn, { message: m });
    if (m.role !== "assistant") return null;
    const c = ((I = m.status) == null ? void 0 : I.type) === "running" || a && s === m.id;
    return /* @__PURE__ */ i(
      nn,
      {
        jobId: t,
        message: m,
        citations: e[m.id] || [],
        progress: n[m.id] || "",
        streaming: c,
        branchBusy: r,
        onJumpCitation: o,
        onBranchFromAnswer: d
      }
    );
  } }) });
}
function sn({
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
          /* @__PURE__ */ i(We, { size: 12, strokeWidth: 2.2, "aria-hidden": !0 }),
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
function rn({
  selectionContext: t,
  onClear: e
}) {
  if (!t) return null;
  const n = t.selectionType === "text" ? "text" : t.kind, s = t.selectionType === "text" ? t.quote : Ye(t.region, t.pane), a = n === "formula" ? "公式" : n === "table" ? "表格" : n === "figure" ? "图片" : "文字";
  return /* @__PURE__ */ E("div", { className: "aui-selection-context", "data-reader-ai-selection-context": "", children: [
    /* @__PURE__ */ i(n === "formula" ? Ke : n === "table" ? ht : n === "figure" ? gt : yt, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
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
        children: /* @__PURE__ */ i(be, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
      }
    )
  ] });
}
function et({
  isRunning: t,
  branchBusy: e,
  mode: n,
  onModeChange: s,
  selectionContext: a,
  onClearSelectionContext: r
}) {
  return /* @__PURE__ */ E(ge.Root, { className: "aui-composer", "data-reader-ai-composer": "", children: [
    /* @__PURE__ */ E("div", { className: "aui-composer-shell", children: [
      n !== "operations" ? /* @__PURE__ */ i(rn, { selectionContext: a, onClear: r }) : null,
      /* @__PURE__ */ i(
        ge.Input,
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
        /* @__PURE__ */ i(sn, { mode: n, disabled: t || e, onChange: s }),
        /* @__PURE__ */ i("div", { className: "aui-composer-actions", children: t ? /* @__PURE__ */ i(ge.Cancel, { className: "aui-send aui-send-stop", "aria-label": "停止生成", children: /* @__PURE__ */ i(lt, { size: 12, strokeWidth: 2.6, "aria-hidden": !0 }) }) : /* @__PURE__ */ i(ge.Send, { className: "aui-send", "aria-label": "发送", children: /* @__PURE__ */ i(ut, { size: 16, strokeWidth: 2.5, "aria-hidden": !0 }) }) })
      ] })
    ] }),
    /* @__PURE__ */ i("p", { className: "aui-hint", children: "AI 可能会出错，请核对原文与引用" })
  ] });
}
function tt() {
  return /* @__PURE__ */ E("div", { className: "aui-composer aui-composer-locked", role: "alert", children: [
    /* @__PURE__ */ i("p", { className: "aui-llm-lock-msg", children: Pt }),
    /* @__PURE__ */ i("p", { className: "aui-hint", children: "请到首页「设置 → API 设置」填写模型 Key 后即可提问" })
  ] });
}
const an = [
  { prompt: "把第 1 页旋转 90 度。", label: "旋转页面", icon: ke },
  { prompt: "删除最后一页。", label: "删除页面", icon: ke }
];
function on({
  jobId: t,
  empty: e,
  citationsByMessageId: n,
  progressByMessageId: s,
  streamingAssistantId: a,
  isRunning: r,
  missingLlmKey: o,
  branchBusy: d,
  agentRequestBlocked: m = !1,
  agentOperationPanel: c,
  onModeChange: I,
  onJumpCitation: g,
  onBranchFromAnswer: w
}) {
  const p = d || m;
  return /* @__PURE__ */ E(ve, { children: [
    e ? /* @__PURE__ */ E("div", { className: "aui-empty", children: [
      /* @__PURE__ */ i("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ i("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ i(pe, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ i("h2", { className: "aui-empty-title", children: "想怎样处理 PDF？" }),
      /* @__PURE__ */ i("p", { className: "aui-empty-sub", children: "创建候选版本后由你预览和确认" }),
      /* @__PURE__ */ i("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: an.map((u) => {
        const $ = u.icon;
        return /* @__PURE__ */ E(
          se.Suggestion,
          {
            prompt: u.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: p || o,
            children: [
              /* @__PURE__ */ i($, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
              /* @__PURE__ */ i("span", { className: "aui-suggestion-label", children: u.label })
            ]
          },
          u.prompt
        );
      }) })
    ] }) : null,
    /* @__PURE__ */ i(
      Ze,
      {
        jobId: t,
        citationsByMessageId: n,
        progressByMessageId: s,
        streamingAssistantId: a,
        isRunning: r,
        branchBusy: d,
        onJumpCitation: g,
        onBranchFromAnswer: w
      }
    ),
    c,
    /* @__PURE__ */ E(se.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !d ? /* @__PURE__ */ i(
        se.ScrollToBottom,
        {
          className: "aui-scroll-bottom-btn aui-scroll-bottom",
          "aria-label": "滚到最新",
          children: /* @__PURE__ */ i(Ue, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
        }
      ) : null,
      o ? /* @__PURE__ */ i(tt, {}) : /* @__PURE__ */ i(
        et,
        {
          isRunning: r,
          branchBusy: p,
          mode: "operations",
          onModeChange: I,
          selectionContext: null,
          onClearSelectionContext: void 0
        }
      )
    ] })
  ] });
}
const cn = [
  { prompt: "用几句话总结这篇文献的核心内容。", label: "总结本文", icon: We },
  { prompt: "这篇文献的主要结论是什么？", label: "提炼主要结论", icon: wt },
  { prompt: "作者用了什么方法或模型？", label: "梳理方法与模型", icon: It },
  { prompt: "解释文中的关键公式。", label: "解释关键公式", icon: Ke }
];
function dn({
  jobId: t,
  empty: e,
  citationsByMessageId: n,
  progressByMessageId: s,
  streamingAssistantId: a,
  isRunning: r,
  missingLlmKey: o,
  branchBusy: d,
  composerDisabled: m = !1,
  onModeChange: c,
  onJumpCitation: I,
  onBranchFromAnswer: g,
  selectionContext: w = null,
  onClearSelectionContext: p,
  footerExtra: u = null
}) {
  return /* @__PURE__ */ E(ve, { children: [
    e ? /* @__PURE__ */ E("div", { className: "aui-empty", children: [
      /* @__PURE__ */ i("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ i("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ i(pe, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ i("h2", { className: "aui-empty-title", children: "一起读懂这篇文档" }),
      /* @__PURE__ */ i("p", { className: "aui-empty-sub", children: "总结、解释、检索与计算，不修改 PDF" }),
      /* @__PURE__ */ i("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: cn.map(($) => {
        const O = $.icon;
        return /* @__PURE__ */ E(
          se.Suggestion,
          {
            prompt: $.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: d || m || o,
            children: [
              /* @__PURE__ */ i(O, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
              /* @__PURE__ */ i("span", { className: "aui-suggestion-label", children: $.label })
            ]
          },
          $.prompt
        );
      }) })
    ] }) : null,
    /* @__PURE__ */ i(
      Ze,
      {
        jobId: t,
        citationsByMessageId: n,
        progressByMessageId: s,
        streamingAssistantId: a,
        isRunning: r,
        branchBusy: d,
        onJumpCitation: I,
        onBranchFromAnswer: g
      }
    ),
    u,
    /* @__PURE__ */ E(se.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !d ? /* @__PURE__ */ i(
        se.ScrollToBottom,
        {
          className: "aui-scroll-bottom-btn aui-scroll-bottom",
          "aria-label": "滚到最新",
          children: /* @__PURE__ */ i(Ue, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
        }
      ) : null,
      o ? /* @__PURE__ */ i(tt, {}) : /* @__PURE__ */ i(
        et,
        {
          isRunning: r,
          branchBusy: d || m,
          mode: "reading",
          onModeChange: c,
          selectionContext: w,
          onClearSelectionContext: p
        }
      )
    ] })
  ] });
}
function ln({
  jobId: t,
  messages: e,
  citationsByMessageId: n,
  progressByMessageId: s,
  streamingAssistantId: a,
  isRunning: r,
  missingLlmKey: o,
  branchBusy: d,
  agentRequestBlocked: m = !1,
  agentOperationPanel: c,
  assistantMode: I = "reading",
  onAssistantModeChange: g,
  onJumpCitation: w,
  onBranchFromAnswer: p,
  selectionContext: u = null,
  onClearSelectionContext: $
}) {
  const O = e.length === 0, _ = I === "operations";
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
          children: /* @__PURE__ */ i("div", { className: `aui-thread-inner${O ? " is-empty" : ""}`, children: _ ? /* @__PURE__ */ i(
            on,
            {
              jobId: t,
              empty: O,
              citationsByMessageId: n,
              progressByMessageId: s,
              streamingAssistantId: a,
              isRunning: r,
              missingLlmKey: o,
              branchBusy: d,
              agentRequestBlocked: m,
              agentOperationPanel: c,
              onModeChange: g,
              onJumpCitation: w,
              onBranchFromAnswer: p
            }
          ) : /* @__PURE__ */ i(
            dn,
            {
              jobId: t,
              empty: O,
              citationsByMessageId: n,
              progressByMessageId: s,
              streamingAssistantId: a,
              isRunning: r,
              missingLlmKey: o,
              branchBusy: d,
              composerDisabled: m,
              onModeChange: g,
              onJumpCitation: w,
              onBranchFromAnswer: p,
              selectionContext: u,
              onClearSelectionContext: $
            }
          ) })
        }
      )
    }
  );
}
const nt = "retainpdf.reader-agent-operation.dismissed.v1", un = /* @__PURE__ */ new Set(["failed", "cancelled"]);
function Fe(t) {
  return [
    `${t.operation_id || ""}`.trim(),
    Number(t.current_attempt) || 0,
    `${t.status || ""}`
  ].join(":");
}
function mn() {
  var t;
  try {
    const e = JSON.parse(((t = globalThis.localStorage) == null ? void 0 : t.getItem(nt)) || "[]");
    return new Set(Array.isArray(e) ? e.filter((n) => typeof n == "string") : []);
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function pn(t) {
  var e;
  try {
    (e = globalThis.localStorage) == null || e.setItem(
      nt,
      JSON.stringify(Array.from(t).slice(-100))
    );
  } catch {
  }
}
function st(t, e) {
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
function fn(t) {
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
function hn(t) {
  return t === "failed" || t === "ambiguous" ? Ge : t === "cancelled" ? be : t === "committed" || t === "result_ready" ? Ve : ["queued", "running", "validating"].includes(t) ? Re : Ct;
}
function gn({ events: t, mode: e }) {
  return /* @__PURE__ */ i("ol", { className: "reader-agent-operation-timeline", "aria-label": "PDF 操作步骤", children: t.map((n) => {
    const s = hn(n.status), a = ["queued", "running", "validating"].includes(n.status);
    return /* @__PURE__ */ E("li", { children: [
      /* @__PURE__ */ i(s, { className: a ? "is-spinning" : "", size: 12, "aria-hidden": !0 }),
      /* @__PURE__ */ i("span", { children: n.summary || n.event || st(n.status, e) }),
      /* @__PURE__ */ i("time", { children: n.ts ? new Date(n.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "" })
    ] }, `${n.attempt}:${n.seq}`);
  }) });
}
function yn({
  operation: t,
  loadCandidate: e
}) {
  const [n, s] = K(!1), [a, r] = K(""), [o, d] = K(""), m = L("");
  return H(() => {
    let c = !1;
    return d(""), e(t).then((I) => {
      if (c) return;
      const g = URL.createObjectURL(I);
      m.current && URL.revokeObjectURL(m.current), m.current = g, r(g);
    }).catch(() => {
      c || d("候选 PDF 加载失败，请重试。");
    }), () => {
      c = !0;
    };
  }, [e, t.operation_id, t.current_attempt]), H(() => () => {
    m.current && URL.revokeObjectURL(m.current);
  }, []), /* @__PURE__ */ E(ve, { children: [
    /* @__PURE__ */ E("div", { className: "reader-agent-operation-candidate", children: [
      /* @__PURE__ */ E("div", { children: [
        /* @__PURE__ */ i(ke, { size: 13, "aria-hidden": !0 }),
        /* @__PURE__ */ i("span", { children: "候选 PDF" })
      ] }),
      /* @__PURE__ */ i("button", { type: "button", disabled: !a, onClick: () => s((c) => !c), children: a ? n ? "收起" : "预览" : "加载中…" }),
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          disabled: !a,
          "aria-label": "新窗口打开候选 PDF",
          onClick: () => window.open(a, "_blank", "noopener,noreferrer"),
          children: /* @__PURE__ */ i(_t, { size: 12, "aria-hidden": !0 })
        }
      )
    ] }),
    n ? /* @__PURE__ */ i("iframe", { className: "reader-agent-operation-preview", src: a, title: "候选 PDF 预览" }) : null,
    o ? /* @__PURE__ */ i("p", { className: "reader-agent-operation-error", role: "alert", children: o }) : null
  ] });
}
function wn({
  entry: t,
  mode: e,
  loadCandidate: n,
  onAction: s,
  onDismiss: a
}) {
  var O;
  const { operation: r, pendingAction: o, error: d } = t, [m, c] = K(!1), [I, g] = K(!1), w = r.events || [], p = fn(r.status), u = !!((r.status === "result_ready" || r.status === "committed") && r.candidate_available), $ = un.has(r.status);
  return /* @__PURE__ */ E("article", { className: `reader-agent-operation-card is-${r.status}`, "data-operation-id": r.operation_id, children: [
    /* @__PURE__ */ E("header", { children: [
      /* @__PURE__ */ i("span", { className: "reader-agent-operation-icon", "aria-hidden": !0, children: /* @__PURE__ */ i(bt, { size: 15 }) }),
      /* @__PURE__ */ E("div", { className: "reader-agent-operation-title", children: [
        /* @__PURE__ */ i("span", { children: "PDF 操作" }),
        /* @__PURE__ */ i("strong", { children: r.intent_summary || "处理当前 PDF" })
      ] }),
      /* @__PURE__ */ E("div", { className: "reader-agent-operation-head-actions", children: [
        /* @__PURE__ */ i("span", { className: "reader-agent-operation-status", children: st(r.status, e) }),
        $ ? /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "reader-agent-operation-dismiss",
            "aria-label": r.status === "failed" ? "隐藏这条失败提示" : "隐藏这条已取消提示",
            title: "隐藏",
            onClick: () => a(r),
            children: /* @__PURE__ */ i(be, { size: 13, "aria-hidden": !0 })
          }
        ) : null
      ] })
    ] }),
    (O = r.affected_pages) != null && O.length ? /* @__PURE__ */ E("p", { className: "reader-agent-operation-scope", children: [
      "影响页码：",
      r.affected_pages.join("、")
    ] }) : null,
    w.length ? /* @__PURE__ */ E("div", { className: "reader-agent-operation-details", children: [
      /* @__PURE__ */ E("button", { type: "button", onClick: () => c((_) => !_), children: [
        m ? /* @__PURE__ */ i(Rt, { size: 12, "aria-hidden": !0 }) : /* @__PURE__ */ i(He, { size: 12, "aria-hidden": !0 }),
        m ? "收起步骤" : `执行步骤 ${w.length}`
      ] }),
      m ? /* @__PURE__ */ i(gn, { events: w, mode: e }) : null
    ] }) : null,
    u ? /* @__PURE__ */ i(yn, { operation: r, loadCandidate: n }) : null,
    d ? /* @__PURE__ */ i("p", { className: "reader-agent-operation-error", role: "alert", children: d }) : null,
    I ? /* @__PURE__ */ E("div", { className: "reader-agent-operation-risk", role: "alertdialog", "aria-label": "确认重复执行风险", children: [
      /* @__PURE__ */ i(Ge, { size: 14, "aria-hidden": !0 }),
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
    ] }) : p.length ? /* @__PURE__ */ i("div", { className: "reader-agent-operation-actions", children: p.map((_) => /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: _.primary ? "is-primary" : _.danger ? "is-danger" : "",
        disabled: !!o,
        onClick: () => {
          _.risk ? g(!0) : s(_.action, r);
        },
        children: o === _.action ? "处理中…" : _.label
      },
      _.action
    )) }) : null
  ] });
}
function In({
  entries: t,
  confirmationMode: e,
  runtimeRestarting: n,
  loadCandidate: s,
  onAction: a
}) {
  const [r, o] = K(mn), d = t.filter((c) => !r.has(Fe(c.operation)));
  function m(c) {
    const I = Fe(c);
    o((g) => {
      const w = new Set(g);
      return w.add(I), pn(w), w;
    });
  }
  return /* @__PURE__ */ E("section", { className: `reader-agent-operations${d.length ? " has-operations" : ""}`, "aria-label": "AI PDF 操作", children: [
    /* @__PURE__ */ E("div", { className: `reader-agent-mode${e === "green_light" ? " is-green" : ""}`, children: [
      /* @__PURE__ */ i(vt, { size: 13, "aria-hidden": !0 }),
      /* @__PURE__ */ i("span", { children: e === "green_light" ? "绿灯模式 · 自动执行并应用" : "需要确认 · 操作前等待授权" })
    ] }),
    n ? /* @__PURE__ */ E("div", { className: "reader-agent-restarting", role: "status", children: [
      /* @__PURE__ */ i(Re, { className: "is-spinning", size: 13, "aria-hidden": !0 }),
      "正在重启 Agent，新请求暂不可用"
    ] }) : null,
    d.map((c) => /* @__PURE__ */ i(
      wn,
      {
        entry: c,
        mode: e,
        loadCandidate: s,
        onAction: a,
        onDismiss: m
      },
      c.operation.operation_id
    ))
  ] });
}
const vn = (t) => t, bn = Object.freeze([]), Rn = Object.freeze({}), qe = Object.freeze({}), _n = Object.freeze({
  entries: [],
  confirmationMode: "explicit",
  runtimeRestarting: !1,
  runtimeCredentialConfigured: !1,
  perform: async () => {
  },
  loadCandidate: async () => new Blob()
});
function Cn(t) {
  return t.content.filter((e) => e.type === "text").map((e) => e.text).join(`
`).trim();
}
function Nn(t, e, n) {
  var s, a, r, o;
  return ((s = t.status) == null ? void 0 : s.type) === "running" || n && e === t.id ? { type: "running" } : ((a = t.status) == null ? void 0 : a.type) === "incomplete" || ((r = t.status) == null ? void 0 : r.type) === "error" ? {
    type: "incomplete",
    reason: ((o = t.status) == null ? void 0 : o.reason) === "cancelled" ? "cancelled" : "error"
  } : { type: "complete", reason: "stop" };
}
function Mn({
  jobId: t = "",
  messages: e = bn,
  citationsByMessageId: n = Rn,
  progressByMessageId: s = qe,
  contentByMessageId: a = qe,
  streamingAssistantId: r = "",
  isRunning: o = !1,
  onSubmit: d,
  onRetry: m,
  onCancel: c,
  onJumpCitation: I,
  onBranchFromAnswer: g,
  branchBusy: w = !1,
  agentOperations: p = _n,
  assistantMode: u = "reading",
  onAssistantModeChange: $,
  selectionContext: O = null,
  onClearSelectionContext: _
}) {
  const [, x] = K(0);
  H(() => {
    const N = () => x((b) => b + 1);
    return window.addEventListener("focus", N), window.addEventListener("storage", N), document.addEventListener(Oe, N), () => {
      window.removeEventListener("focus", N), window.removeEventListener("storage", N), document.removeEventListener(Oe, N);
    };
  }, []);
  const T = !Ot() && !p.runtimeCredentialConfigured, M = X(() => e.map((N) => ({
    id: N.id,
    role: N.role,
    content: a[N.id] || N.content || "",
    ...N.role === "assistant" ? { status: Nn(N, r, o) } : {}
  })), [a, o, e, r]), q = G(async (N) => {
    const b = N ? Math.max(0, e.findIndex((h) => h.id === N) + 1) : 0, A = e.slice(b).find((h) => h.role === "assistant");
    A && await m(A.id);
  }, [e, m]), l = G(async (N) => {
    const b = Cn(N);
    !b || o || w || p.runtimeRestarting || T || await d(b);
  }, [p.runtimeRestarting, w, o, T, d]), f = G(async () => {
    await c();
  }, [c]), R = X(() => ({
    messages: M,
    isRunning: o,
    isDisabled: w || p.runtimeRestarting || T,
    convertMessage: vn,
    onNew: l,
    onReload: q,
    onCancel: f
  }), [
    p.runtimeRestarting,
    w,
    f,
    l,
    o,
    T,
    q,
    M
  ]), S = Tt(R);
  return /* @__PURE__ */ i(Et, { runtime: S, children: /* @__PURE__ */ i(
    ln,
    {
      jobId: t,
      messages: e,
      citationsByMessageId: n,
      progressByMessageId: s,
      streamingAssistantId: r,
      isRunning: o,
      missingLlmKey: T,
      branchBusy: w,
      agentRequestBlocked: p.runtimeRestarting,
      assistantMode: u,
      onAssistantModeChange: $,
      selectionContext: O,
      onClearSelectionContext: _,
      agentOperationPanel: p.entries.length > 0 || p.runtimeRestarting ? /* @__PURE__ */ i(
        In,
        {
          entries: p.entries,
          confirmationMode: p.confirmationMode,
          runtimeRestarting: p.runtimeRestarting,
          loadCandidate: p.loadCandidate,
          onAction: p.perform
        }
      ) : null,
      onJumpCitation: I,
      onBranchFromAnswer: g
    }
  ) });
}
function ye(t = 900, e = 0) {
  oe(t, { overlayDelayMs: e }), ae(t);
}
function kn({
  sessions: t,
  activeId: e,
  busy: n = !1,
  disabled: s = !1,
  errorText: a = "",
  onSwitch: r,
  onNew: o,
  onDelete: d,
  onRename: m
}) {
  const c = t.length > 0, I = n || s, [g, w] = K(!1), [p, u] = K(""), [$, O] = K(""), _ = L(null), x = dt();
  function T(h) {
    const C = `${h || ""}`.match(/^fork-(\d+)-(.*)$/i);
    if (!C) return h;
    const P = C[2].trim();
    return P ? `${P} · 分支${C[1]}` : `分支${C[1]}`;
  }
  const M = L(!1), q = L(null), l = t.find((h) => h.id === e) || null, f = l ? l.messageCount ? T(l.title) : `${T(l.title)}（空）` : c ? "选择以往对话" : "新对话";
  H(() => {
    if (!g) {
      u("");
      return;
    }
    const h = (v) => {
      if (M.current) return;
      const y = _.current;
      y && (v.target instanceof Node && y.contains(v.target) || (w(!1), u("")));
    }, C = (v) => {
      v.key === "Escape" && (w(!1), u(""));
    }, P = window.setTimeout(() => {
      document.addEventListener("pointerdown", h, !0);
    }, 0);
    return document.addEventListener("keydown", C), () => {
      window.clearTimeout(P), document.removeEventListener("pointerdown", h, !0), document.removeEventListener("keydown", C);
    };
  }, [g]), H(() => {
    if (!p) return;
    const h = q.current;
    h && (h.focus(), h.select());
  }, [p]);
  const R = (h) => {
    const C = `${h || ""}`.trim();
    !C || I || M.current || p || (M.current = !0, ye(1e3, 0), requestAnimationFrame(() => {
      w(!1), window.setTimeout(() => {
        (async () => {
          try {
            await r(C);
          } finally {
            ye(400, 0), M.current = !1;
          }
        })();
      }, 40);
    }));
  }, S = (h) => {
    I || (u(h.id), O(h.title || ""));
  }, N = () => {
    const h = p, C = $;
    u(""), h && m(h, C);
  }, b = () => {
    u(""), O("");
  }, A = (h) => {
    var v;
    if (I || M.current) return;
    const C = h.title || "未命名对话";
    (v = globalThis.confirm) != null && v.call(globalThis, `确定删除对话「${C}」？此操作不可恢复。`) && (M.current = !0, ye(800, 0), (async () => {
      try {
        await d(h.id);
      } finally {
        M.current = !1;
      }
    })());
  };
  return /* @__PURE__ */ E(
    "div",
    {
      className: "aui-session-bar",
      "data-reader-ai-sessions": "",
      ref: _,
      onPointerDown: (h) => {
        h.stopPropagation();
      },
      onClick: (h) => {
        h.stopPropagation();
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
              "aria-controls": x,
              disabled: I || !c,
              title: f,
              onClick: () => {
                I || !c || w((h) => !h);
              },
              children: [
                /* @__PURE__ */ i("span", { className: "aui-session-trigger-label", children: f }),
                /* @__PURE__ */ i(He, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 })
              ]
            }
          ),
          /* @__PURE__ */ E(
            "button",
            {
              type: "button",
              className: "aui-session-btn",
              disabled: I,
              title: "新对话窗口",
              "aria-label": "新对话",
              onClick: () => {
                I || M.current || (M.current = !0, ye(800), w(!1), u(""), window.setTimeout(() => {
                  (async () => {
                    try {
                      await o();
                    } finally {
                      M.current = !1;
                    }
                  })();
                }, 40));
              },
              children: [
                n ? /* @__PURE__ */ i(Re, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ i(Nt, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
                /* @__PURE__ */ i("span", { children: "新对话" })
              ]
            }
          )
        ] }),
        g && c ? /* @__PURE__ */ i(
          "ul",
          {
            id: x,
            className: "aui-session-list",
            role: "listbox",
            "aria-label": "以往对话",
            children: t.map((h) => {
              const C = h.messageCount ? T(h.title) : `${T(h.title)}（空）`, P = h.id === e, v = p === h.id;
              return /* @__PURE__ */ i("li", { className: "aui-session-row-item", role: "presentation", children: v ? /* @__PURE__ */ E("div", { className: "aui-session-edit", children: [
                /* @__PURE__ */ i(
                  "input",
                  {
                    ref: q,
                    className: "aui-session-edit-input",
                    value: $,
                    maxLength: 80,
                    "aria-label": "对话标题",
                    disabled: I,
                    onChange: (y) => O(y.target.value),
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
                    disabled: I || !$.trim(),
                    onClick: (y) => {
                      y.stopPropagation(), N();
                    },
                    children: /* @__PURE__ */ i(Ve, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": "取消重命名",
                    title: "取消",
                    disabled: I,
                    onClick: (y) => {
                      y.stopPropagation(), b();
                    },
                    children: /* @__PURE__ */ i(be, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }) : /* @__PURE__ */ E(ve, { children: [
                /* @__PURE__ */ E(
                  "button",
                  {
                    type: "button",
                    role: "option",
                    "aria-selected": P,
                    className: `aui-session-item${P ? " is-active" : ""}`,
                    disabled: I,
                    title: C,
                    onPointerDown: (y) => {
                      y.stopPropagation(), !P && !I && ae(1e3);
                    },
                    onClick: (y) => {
                      if (y.preventDefault(), y.stopPropagation(), P) {
                        w(!1);
                        return;
                      }
                      R(h.id);
                    },
                    children: [
                      /* @__PURE__ */ i("span", { className: "aui-session-item-title", children: C }),
                      P ? /* @__PURE__ */ i("span", { className: "aui-session-item-badge", children: "当前" }) : null
                    ]
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": `重命名 ${C}`,
                    title: "重命名",
                    disabled: I,
                    onClick: (y) => {
                      y.preventDefault(), y.stopPropagation(), S(h);
                    },
                    children: /* @__PURE__ */ i(Mt, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn is-danger",
                    "aria-label": `删除 ${C}`,
                    title: "删除",
                    disabled: I,
                    onClick: (y) => {
                      y.preventDefault(), y.stopPropagation(), A(h);
                    },
                    children: /* @__PURE__ */ i(kt, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
                  }
                )
              ] }) }, h.id);
            })
          }
        ) : null,
        a ? /* @__PURE__ */ i("div", { className: "aui-session-error", role: "alert", children: a }) : null
      ]
    }
  );
}
const Sn = {
  search_markdown: "检索 Markdown",
  read_markdown_chunk: "阅读 Markdown 片段",
  list_documents: "确认文档信息",
  read_blocks: "阅读相关段落",
  search_favorites: "查找收藏",
  search_fulltext: "检索文档内容"
};
function An(t) {
  const e = typeof t == "string" ? t : (t == null ? void 0 : t.tool) || (t == null ? void 0 : t.event) || (t == null ? void 0 : t.type) || "";
  return Sn[e] || (e ? `执行 ${e}` : "处理中");
}
function rt(t) {
  return ((t == null ? void 0 : t.parts) || []).filter((e) => e.type === "text").map((e) => e.text).join("").trim();
}
function $n(t, e) {
  const n = `${e.question || ""}`.trim();
  if (n) return n;
  for (let s = t.length - 1; s >= 0; s -= 1) {
    const a = t[s];
    if (a.role !== "user") continue;
    const r = rt(a);
    if (r) return r;
  }
  return "";
}
function Tn(t) {
  const e = Number(t == null ? void 0 : t.status) || 0, n = `${(t == null ? void 0 : t.message) || ""}`;
  return e === 502 || /\b502\b/.test(n);
}
class En {
  constructor(e) {
    this.options = e;
  }
  async sendMessages({
    abortSignal: e,
    body: n,
    messages: s,
    trigger: a
  }) {
    var u, $, O, _;
    const r = n || {}, o = $n(s, r);
    if (!o) throw new Error("请输入问题。");
    const d = r.assistantMode || (($ = (u = this.options).getAssistantMode) == null ? void 0 : $.call(u)) || "reading", m = r.scope || "document", c = r.context ? { ...r.context } : null, I = `${r.assistantMessageId || ""}`.trim() || `a-${Date.now().toString(36)}`, g = `${I}-text`, w = this.options.getRemoteAnswerer(), p = ((_ = (O = this.options).getLocalAnswerer) == null ? void 0 : _.call(O)) || null;
    if (!w && !p)
      throw new Error("问答暂不可用：请确认已打开任务阅读器。");
    return new ReadableStream({
      start: (x) => {
        let T = !1, M = "", q = {
          citations: [],
          progress: a === "regenerate-message" ? "正在重新生成…" : "正在检索文档…",
          status: "running"
        };
        const l = (R) => {
          T || x.enqueue(R);
        }, f = (R) => {
          q = { ...q, ...R }, l({ type: "message-metadata", messageMetadata: q });
        };
        l({ type: "start", messageId: I, messageMetadata: q }), l({ type: "start-step" }), l({ type: "text-start", id: g }), (async () => {
          var R, S, N, b, A, h;
          try {
            if (await ((R = w == null ? void 0 : w.ensureLoaded) == null ? void 0 : R.call(w, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
            let C = w || p, P = !1, v;
            try {
              v = await C.answer({
                question: o,
                assistantMode: d,
                scope: m,
                context: c,
                parentId: `${r.parentId || ""}`.trim(),
                regenerate: r.regenerate ?? a === "regenerate-message",
                userMessageId: `${r.userMessageId || ""}`.trim(),
                assistantMessageId: I,
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
                  if (M || e != null && e.aborted) return;
                  const F = An(k);
                  F && f({ progress: F });
                },
                onProgressEvent: (k) => {
                  if (M || e != null && e.aborted) return;
                  const F = `${(k == null ? void 0 : k.message) || ""}`.trim();
                  F && f({ progress: F });
                },
                onAnswerDelta: (k, F) => {
                  !F || e != null && e.aborted || (M += F, q.progress && f({ progress: "" }), l({ type: "text-delta", id: g, delta: F }));
                },
                onCompress: (k) => {
                  if (M || e != null && e.aborted) return;
                  const F = Number(k == null ? void 0 : k.dropped_turns) || 0;
                  F && f({ progress: `已压缩 ${F} 轮早期对话` });
                },
                signal: e
              });
            } catch (k) {
              if (e != null && e.aborted || d === "operations" || !w || !p || !Tn(k)) throw k;
              if (P = !0, f({ progress: "在线服务暂不可用，改用本地检索…" }), await ((S = p.ensureLoaded) == null ? void 0 : S.call(p, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
              C = p, v = await C.answer({
                question: o,
                assistantMode: d,
                scope: m,
                context: c,
                signal: e
              });
            }
            if (e != null && e.aborted) {
              f({ progress: "", status: "cancelled" }), l({ type: "abort", reason: "cancelled" });
              return;
            }
            const y = v == null ? void 0 : v.confirmationMode;
            (y === "explicit" || y === "green_light") && ((b = (N = this.options).onConfirmationMode) == null || b.call(N, y));
            const z = `${(v == null ? void 0 : v.conversationId) || ""}`.trim() || void 0, U = /* @__PURE__ */ new Set();
            for (const k of (v == null ? void 0 : v.operationRefs) || []) {
              const F = typeof k == "string" ? k : `${(k == null ? void 0 : k.operation_id) || ""}`;
              F.trim() && U.add(F.trim());
            }
            for (const k of (v == null ? void 0 : v.confirmationRequests) || []) {
              const F = `${(k == null ? void 0 : k.operation_id) || ""}`.trim();
              F && U.add(F);
            }
            for (const k of U)
              (h = (A = this.options).onAgentOperationSignal) == null || h.call(A, {
                operationId: k,
                conversationId: z,
                confirmationMode: y || void 0
              });
            const D = Dt(v == null ? void 0 : v.citations);
            let B = zt(
              `${(v == null ? void 0 : v.answer) || M || ""}`.trim() || "没有找到可用回答。",
              D
            );
            if (P && (B += `

_在线服务暂不可用，以上来自本地文档检索。_`), (v == null ? void 0 : v.persisted) === !1 && (B += `

_⚠️ 本轮回答未能写入历史记录（存储暂时不可用），刷新后可能丢失。_`), !M)
              l({ type: "text-delta", id: g, delta: B });
            else if (B.startsWith(M)) {
              const k = B.slice(M.length);
              k && l({ type: "text-delta", id: g, delta: k });
            }
            l({ type: "text-end", id: g }), f({
              citations: D,
              persisted: (v == null ? void 0 : v.persisted) !== !1,
              progress: "",
              status: "complete"
            }), l({ type: "finish-step" }), l({ type: "finish", finishReason: "stop", messageMetadata: q });
          } catch (C) {
            e != null && e.aborted ? (f({ progress: "", status: "cancelled" }), l({ type: "abort", reason: "cancelled" })) : (f({ progress: "", status: "error" }), l({
              type: "error",
              errorText: C instanceof Error ? C.message : "生成回答失败，请重试。"
            }));
          } finally {
            T || (T = !0, x.close());
          }
        })();
      }
    });
  }
  async reconnectToStream() {
    return null;
  }
}
function xn(t) {
  return rt(t);
}
function at(t) {
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
function Pn(t) {
  const e = t.metadata || {}, n = e.status === "running", s = e.status === "cancelled" || e.status === "error";
  return {
    id: t.id,
    role: t.role,
    content: xn(t),
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
function On(t) {
  const e = L(t.remoteAnswerer), n = L(t.localAnswerer), s = L(t.onAgentOperationSignal), a = L(t.onConfirmationMode), r = L(t.assistantMode);
  e.current = t.remoteAnswerer, n.current = t.localAnswerer, s.current = t.onAgentOperationSignal, a.current = t.onConfirmationMode, r.current = t.assistantMode;
  const o = X(() => new Ft({
    id: `reader-${t.jobId || "idle"}`,
    transport: new En({
      jobId: t.jobId,
      getRemoteAnswerer: () => e.current,
      getLocalAnswerer: () => n.current,
      getAssistantMode: () => r.current,
      onAgentOperationSignal: (d) => {
        var m;
        return (m = s.current) == null ? void 0 : m.call(s, d);
      },
      onConfirmationMode: (d) => {
        var m;
        return (m = a.current) == null ? void 0 : m.call(a, d);
      }
    })
  }), [t.jobId]);
  return H(() => {
    t.enabled || o.stop();
  }, [o, t.enabled]), H(() => () => {
    o.stop();
  }, [o]), qt({ chat: o, experimental_throttle: 16 });
}
function Dn(t) {
  for (let e = t.length - 1; e >= 0; e -= 1)
    if (t[e].role === "assistant") return t[e];
}
function $e(t, e) {
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
function it(t) {
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
  const a = [];
  let r = s;
  const o = /* @__PURE__ */ new Set();
  for (; r && !o.has(r.message.id); )
    o.add(r.message.id), a.push(r.message), r = r.parentId ? n.get(r.parentId) : void 0;
  return a.reverse();
}
function Fn(t, e) {
  var n;
  return e ? ((n = t.find((s) => s.message.id === e)) == null ? void 0 : n.message) ?? null : null;
}
function qn(t, e) {
  const n = new Map(t.map((o) => [o.message.id, o]));
  let s = n.get(e);
  if (!s) return [];
  const a = [], r = /* @__PURE__ */ new Set();
  for (; s && !r.has(s.message.id); )
    r.add(s.message.id), a.push(s), s = s.parentId ? n.get(s.parentId) : void 0;
  return a.reverse();
}
function zn(t, e, n) {
  var I, g, w, p;
  const s = `${e || ""}`.trim();
  if (!s || !t.length) return [];
  let a = s;
  t.some((u) => u.message.id === a) || (n && t.some((u) => u.message.id === n) ? a = n : a = ((I = [...t].reverse().find((u) => u.message.role === "assistant")) == null ? void 0 : I.message.id) || "");
  let r = qn(t, a);
  if (r.length >= 2 && ((g = r.at(-1)) == null ? void 0 : g.message.role) === "assistant") return r;
  r.length === 1 && ((w = r[0]) == null ? void 0 : w.message.role) === "user" && (r = []);
  const o = ie(t, n || a);
  let d = o.findIndex((u) => u.id === a);
  if (d < 0 && (d = o.length - 1), d < 0) return r;
  const m = new Map(t.map((u) => [u.message.id, u])), c = o.slice(0, d + 1).map((u) => m.get(u.id)).filter((u) => !!u);
  for (; c.length && ((p = c.at(-1)) == null ? void 0 : p.message.role) !== "assistant"; ) c.pop();
  return c.length ? c : r;
}
function Se(t) {
  return t.map((e) => ({
    parentId: e.parentId,
    message: {
      ...e.message,
      citations: e.message.citations || [],
      status: e.message.status
    }
  }));
}
const Bn = {
  stopStream: () => Promise.resolve(),
  clearMessages: () => {
  },
  showMessages: () => {
  }
};
function Ln(t) {
  var n;
  const e = {};
  for (const s of t) {
    const a = s.message;
    a.role === "assistant" && ((n = a.citations) != null && n.length) && (e[a.id] = a.citations);
  }
  return e;
}
function jn(t) {
  const e = {};
  for (const n of t) {
    const s = n.message;
    s.role === "assistant" && s.progress && (e[s.id] = s.progress);
  }
  return e;
}
function Kn(t) {
  const e = {};
  for (const n of t) {
    const s = n.message;
    s.content && (e[s.id] = s.content);
  }
  return e;
}
function Wn(t, e, n) {
  var a;
  const s = e || ((a = n == null ? void 0 : n.getConversationId) == null ? void 0 : a.call(n)) || "";
  return (t || []).map((r) => ({
    id: r.conversation_id,
    title: `${r.title || ""}`.trim() || "未命名对话",
    updatedAt: r.updated_at || "",
    messageCount: Number(r.message_count) || 0,
    active: r.conversation_id === s
  }));
}
function Un(t) {
  const { setItems: e, setHeadId: n } = t;
  return {
    readItems: () => t.itemsRef.current,
    readHeadId: () => t.headIdRef.current,
    appendExchange: ({ parentId: s, userId: a, assistantId: r, question: o, progress: d }) => {
      e((m) => [
        ...m,
        { parentId: s, message: { id: a, role: "user", content: o } },
        {
          parentId: a,
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
        var d;
        return ((d = o.message.status) == null ? void 0 : d.type) === "running" ? {
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
function Hn(t) {
  const {
    jobId: e,
    documentId: n,
    enabled: s,
    refreshSessions: a,
    applyConversationTree: r,
    remoteRef: o,
    streamRef: d,
    itemsRef: m,
    documentIdRef: c,
    lastJobRef: I,
    persistReadyRef: g,
    switchTokenRef: w,
    sessionListGenerationRef: p,
    activeConversationIdRef: u,
    setItems: $,
    setHeadId: O,
    setSessions: _,
    setActiveConversationId: x,
    setSessionBusy: T
  } = t;
  H(() => {
    const M = o.current;
    if (!e) {
      p.current += 1, w.current += 1, $([]), O(null), _([]), x(""), d.current.clearMessages(), u.current = "", I.current = "", c.current = "", g.current = !1;
      return;
    }
    const q = I.current !== e;
    if (q && (p.current += 1, w.current += 1, I.current = e, g.current = !1, $([]), O(null), d.current.clearMessages(), _([]), x(""), u.current = "", c.current = "", T(!1)), !s || !M) {
      p.current += 1;
      return;
    }
    let l = !1;
    return (async () => {
      var A, h, C, P;
      let f = `${n || c.current || ""}`.trim();
      if (!f) {
        try {
          f = `${await ((A = M.getDocumentId) == null ? void 0 : A.call(M)) || ""}`.trim();
        } catch {
          f = "";
        }
        if (l) return;
      }
      f && (c.current = f);
      let R = null;
      if (!l && f && (R = await a(f)), !(q || !m.current.length) || l) {
        l || (g.current = !0);
        return;
      }
      const N = Lt({ jobId: e, documentId: f }) || `${((h = M.getConversationId) == null ? void 0 : h.call(M)) || ""}`.trim();
      if (N) {
        x(N), u.current = N, (C = M.setConversationId) == null || C.call(M, N, f);
        try {
          const v = await we(N);
          if (l) return;
          const y = Ie(v.messages || []);
          if (y.length) {
            r(y, v.head_id), requestAnimationFrame(() => {
              l || (g.current = !0);
            });
            return;
          }
        } catch {
        }
      }
      if (!l && f)
        try {
          const v = R ?? await a(f);
          if (l || !v) return;
          const y = v[0];
          if (y != null && y.conversation_id) {
            const z = y.conversation_id;
            x(z), u.current = z, (P = M.setConversationId) == null || P.call(M, z, f);
            try {
              const U = await we(z);
              if (l) return;
              r(
                Ie(U.messages || []),
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
      const b = Qe({ jobId: e, documentId: f }, N);
      if (b != null && b.items.length) {
        const v = it(b);
        $(v.items), O(v.headId), d.current.showMessages(ie(v.items, v.headId));
      } else
        $([]), O(null), d.current.clearMessages();
      requestAnimationFrame(() => {
        l || (g.current = !0);
      });
    })(), () => {
      l = !0, p.current += 1;
    };
  }, [e, n, s, a, r]);
}
function Gn(t) {
  const {
    jobId: e,
    documentId: n,
    items: s,
    headId: a,
    activeConversationId: r,
    documentIdRef: o,
    persistReadyRef: d
  } = t;
  H(() => {
    if (!e || !d.current) return;
    const m = r, c = { jobId: e, documentId: n || o.current }, I = window.setTimeout(() => {
      if (!s.length) {
        me(c, m);
        return;
      }
      Ae(c, $e(s, a), m);
    }, 280);
    return () => window.clearTimeout(I);
  }, [e, n, s, a, r]);
}
function Vn(t) {
  const {
    jobId: e,
    documentId: n,
    sessionBusy: s,
    sessions: a,
    streamRef: r,
    remoteRef: o,
    itemsRef: d,
    headIdRef: m,
    activeConversationIdRef: c,
    documentIdRef: I,
    switchTokenRef: g,
    persistReadyRef: w,
    setSessionBusy: p,
    setSessionError: u,
    setActiveConversationId: $,
    setItems: O,
    setHeadId: _,
    setSessions: x,
    refreshSessions: T,
    applyConversationTree: M
  } = t, q = G(() => {
    var b, A;
    const N = `${((A = (b = o.current) == null ? void 0 : b.getConversationId) == null ? void 0 : A.call(b)) || ""}`.trim();
    N && $(N);
  }, []), l = G(async () => {
    var b, A;
    if (s) return;
    await r.current.stopStream(), oe(900), ae(900), p(!0), u("");
    const N = ++g.current;
    try {
      if (await new Promise((P) => {
        window.setTimeout(P, 40);
      }), N !== g.current) return;
      const h = o.current, C = I.current || `${await ((b = h == null ? void 0 : h.getDocumentId) == null ? void 0 : b.call(h)) || ""}`.trim();
      if (N !== g.current) return;
      I.current = C, (A = h == null ? void 0 : h.clearConversationId) == null || A.call(h, C), $(""), c.current = "", O([]), _(null), r.current.clearMessages(), me({ jobId: e, documentId: C }), C && await T(C, N);
    } catch (h) {
      console.warn("[reader-ai] new session failed", h), u("无法创建新对话，请重试。");
    } finally {
      N === g.current && p(!1);
    }
  }, [e, T, s]), f = G(async (N) => {
    var P, v, y, z, U;
    const b = `${N || ""}`.trim();
    if (!b)
      return u("无法分支：消息 id 无效。"), !1;
    if (s)
      return u("请稍候，当前有会话操作进行中。"), !1;
    await r.current.stopStream();
    const A = zn(d.current, b, m.current);
    if (!A.length)
      return u("无法分支：找不到到此答案的对话路径。"), !1;
    if (A[A.length - 1].message.role !== "assistant")
      return u("只能从助手答案处开新对话。"), !1;
    p(!0), u("");
    const C = ++g.current;
    try {
      if (await new Promise((W) => {
        window.setTimeout(W, 40);
      }), C !== g.current) return !1;
      const D = o.current;
      let B = I.current || `${await ((P = D == null ? void 0 : D.getDocumentId) == null ? void 0 : P.call(D)) || ""}`.trim();
      if (C !== g.current) return !1;
      if (I.current = B, !B)
        try {
          if (B = `${await ((v = D == null ? void 0 : D.getDocumentId) == null ? void 0 : v.call(D)) || ""}`.trim(), C !== g.current) return !1;
          I.current = B;
        } catch {
          B = "";
        }
      if (!B)
        return u("无法分支：文档未就绪，请稍后重试。"), !1;
      const k = A.map((W, ne) => ({
        id: W.message.id,
        role: W.message.role,
        content: W.message.content,
        citations: W.message.citations,
        parentId: ne === 0 ? null : A[ne - 1].message.id
      })), F = c.current || ((y = D == null ? void 0 : D.getConversationId) == null ? void 0 : y.call(D)) || "", Y = (a || []).find((W) => W.conversation_id === F), J = k.find((W) => W.role === "user"), ce = `${(Y == null ? void 0 : Y.title) || ""}`.trim() || `${(J == null ? void 0 : J.content) || ""}`.replace(/\s+/g, " ").trim() || "未命名对话", _e = (a || []).map((W) => W.title || ""), le = jt(ce, _e), te = await Kt({
        documentId: B,
        title: le,
        path: k
      });
      if (C !== g.current) return !1;
      const j = Se(te.items), Q = ((z = j[j.length - 1]) == null ? void 0 : z.message.id) || null, V = te.conversation.conversation_id;
      if (!V || !j.length)
        throw new Error("fork returned empty conversation");
      return oe(600), ae(600), O(j), _(Q), r.current.showMessages(ie(j, Q)), $(V), c.current = V, (U = D == null ? void 0 : D.setConversationId) == null || U.call(D, V, B), x((W) => {
        const ne = {
          conversation_id: V,
          title: le,
          document_id: B,
          created_at: te.conversation.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: te.conversation.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
          message_count: j.length,
          head_id: Q || ""
        }, fe = W.filter((de) => de.conversation_id !== V);
        return [ne, ...fe];
      }), Ae(
        { jobId: e, documentId: B },
        $e(j, Q),
        V
      ), await T(B, C), !0;
    } catch (D) {
      return console.warn("[reader-ai] branch from answer failed", D), C === g.current && u("分支失败：未能复制上文到新对话。请检查网络后重试。"), !1;
    } finally {
      C === g.current && p(!1);
    }
  }, [e, T, s, a]), R = G(async (N) => {
    var h, C, P, v;
    const b = `${N || ""}`.trim();
    if (!b || s) return;
    await r.current.stopStream(), p(!0), u("");
    const A = ++g.current;
    try {
      const y = o.current, z = I.current || `${await ((h = y == null ? void 0 : y.getDocumentId) == null ? void 0 : h.call(y)) || ""}`.trim();
      if (A !== g.current) return;
      I.current = z;
      try {
        await Wt(b);
      } catch (B) {
        if ((Number(B == null ? void 0 : B.status) || 0) !== 404) throw B;
      }
      me({ jobId: e, documentId: z }, b);
      const D = (c.current || ((C = y == null ? void 0 : y.getConversationId) == null ? void 0 : C.call(y)) || "") === b;
      if (x((B) => B.filter((k) => k.conversation_id !== b)), D) {
        (P = y == null ? void 0 : y.clearConversationId) == null || P.call(y, z), $(""), c.current = "", O([]), _(null), r.current.clearMessages(), me({ jobId: e, documentId: z });
        const B = z ? await T(z, A) : [];
        if (A !== g.current || !B) return;
        const k = B[0];
        if (k != null && k.conversation_id) {
          const F = k.conversation_id;
          $(F), c.current = F;
          try {
            const Y = await we(F);
            if (A !== g.current) return;
            M(
              Ie(Y.messages || []),
              Y.head_id
            ), (v = y == null ? void 0 : y.setConversationId) == null || v.call(y, F, z);
          } catch {
            O([]), _(null);
          }
        }
      } else z && await T(z, A);
    } catch (y) {
      console.warn("[reader-ai] delete session failed", y), u("删除对话失败，请重试。");
    } finally {
      A === g.current && p(!1);
    }
  }, [M, e, T, s]), S = G(async (N, b) => {
    const A = `${N || ""}`.trim(), h = `${b || ""}`.replace(/\s+/g, " ").trim();
    if (!A || !h || s) return;
    p(!0), u("");
    const C = ++g.current;
    try {
      const P = h.slice(0, 80);
      if (await Ut(A, { title: P }), C !== g.current) return;
      x(
        (y) => y.map(
          (z) => z.conversation_id === A ? { ...z, title: P } : z
        )
      );
      const v = I.current;
      v && await T(v, C);
    } catch (P) {
      console.warn("[reader-ai] rename session failed", P), u("重命名失败，请重试。");
    } finally {
      C === g.current && p(!1);
    }
  }, [T, s]);
  return {
    adoptRemoteConversationId: q,
    newSession: l,
    branchFromAnswer: f,
    removeSession: R,
    renameSession: S
  };
}
function Yn(t) {
  var le;
  const {
    jobId: e,
    documentId: n = "",
    enabled: s,
    remoteAnswerer: a = null,
    stream: r = Bn
  } = t, [o, d] = K([]), [m, c] = K(null), [I, g] = K([]), [w, p] = K(""), [u, $] = K(!1), [O, _] = K(""), x = L(o), T = L(m), M = L(w), q = L(!1), l = L(""), f = L(""), R = L(0), S = L(0), N = L(r);
  N.current = r;
  const b = L(a);
  b.current = a, x.current = o, T.current = m, M.current = w;
  const A = G(async (te = "", j) => {
    const Q = `${te || f.current || ""}`.trim(), V = ++S.current;
    if (!Q)
      return V === S.current && (j === void 0 || j === R.current) && g([]), [];
    try {
      const ne = (await Ht({ document_id: Q, limit: 50 })).conversations || [];
      return V === S.current && Q === `${f.current || ""}`.trim() && (j === void 0 || j === R.current) ? (g(ne), ne) : null;
    } catch {
      return null;
    }
  }, []), h = G((te, j) => {
    var W;
    const Q = Se(te), V = `${j || ""}`.trim() || ((W = Q[Q.length - 1]) == null ? void 0 : W.message.id) || null;
    d(Q), c(V), N.current.showMessages(ie(Q, V));
  }, []), C = G(() => `${n || f.current || e}`.trim(), [n, e]);
  Hn({
    jobId: e,
    documentId: n,
    enabled: s,
    refreshSessions: A,
    applyConversationTree: h,
    remoteRef: b,
    streamRef: N,
    itemsRef: x,
    documentIdRef: f,
    lastJobRef: l,
    persistReadyRef: q,
    switchTokenRef: R,
    sessionListGenerationRef: S,
    activeConversationIdRef: M,
    setItems: d,
    setHeadId: c,
    setSessions: g,
    setActiveConversationId: p,
    setSessionBusy: $
  }), Gn({
    jobId: e,
    documentId: n,
    items: o,
    headId: m,
    activeConversationId: w,
    documentIdRef: f,
    persistReadyRef: q
  });
  const P = X(
    () => ie(o, m),
    [o, m]
  ), v = X(
    () => Ln(o),
    [o]
  ), y = X(
    () => jn(o),
    [o]
  ), z = X(
    () => Kn(o),
    [o]
  ), U = X(() => Un({ setItems: d, setHeadId: c, itemsRef: x, headIdRef: T }), []), {
    adoptRemoteConversationId: D,
    newSession: B,
    branchFromAnswer: k,
    removeSession: F,
    renameSession: Y
  } = Vn({
    jobId: e,
    documentId: n,
    sessionBusy: u,
    sessions: I,
    streamRef: N,
    remoteRef: b,
    itemsRef: x,
    headIdRef: T,
    activeConversationIdRef: M,
    documentIdRef: f,
    switchTokenRef: R,
    persistReadyRef: q,
    setSessionBusy: $,
    setSessionError: _,
    setActiveConversationId: p,
    setItems: d,
    setHeadId: c,
    setSessions: g,
    refreshSessions: A,
    applyConversationTree: h
  }), J = G(async (te) => {
    var W, ne, fe, de, Te, Ee, xe, Pe;
    const j = `${te || ""}`.trim(), Q = M.current || ((ne = (W = b.current) == null ? void 0 : W.getConversationId) == null ? void 0 : ne.call(W)) || "";
    if (!j || j === Q || u) return;
    await N.current.stopStream(), oe(1200), ae(1200), $(!0), _("");
    const V = ++R.current;
    q.current = !1, p(j), M.current = j, d([]), c(null), N.current.clearMessages();
    try {
      if (await new Promise((he) => {
        window.setTimeout(he, 80);
      }), V !== R.current) return;
      try {
        (Te = (de = (fe = globalThis.document) == null ? void 0 : fe.activeElement) == null ? void 0 : de.blur) == null || Te.call(de);
      } catch {
      }
      const Z = b.current, ee = f.current || `${await ((Ee = Z == null ? void 0 : Z.getDocumentId) == null ? void 0 : Ee.call(Z)) || ""}`.trim();
      if (V !== R.current) return;
      f.current = ee;
      const re = await we(j);
      if (V !== R.current) return;
      oe(800), ae(800);
      const Ce = Ie(re.messages || []);
      if (h(Ce, re.head_id), (xe = Z == null ? void 0 : Z.setConversationId) == null || xe.call(Z, j, ee), q.current = !0, Ce.length) {
        const he = Se(Ce);
        Ae(
          { jobId: e, documentId: ee },
          $e(
            he,
            `${re.head_id || ""}`.trim() || ((Pe = he.at(-1)) == null ? void 0 : Pe.message.id) || null
          ),
          j
        );
      } else
        me({ jobId: e, documentId: ee }, j);
      ee && await A(ee, V), oe(350), ae(350);
    } catch (Z) {
      if (console.warn("[reader-ai] switch session failed", Z), V === R.current) {
        _("加载该对话失败，请检查网络后重试。");
        const ee = Qe(
          { jobId: e, documentId: n || f.current },
          j
        );
        if (ee != null && ee.items.length) {
          const re = it(ee);
          d(re.items), c(re.headId), N.current.showMessages(ie(re.items, re.headId));
        } else
          d([]), c(null);
        q.current = !0;
      }
    } finally {
      V === R.current && $(!1);
    }
  }, [
    h,
    e,
    n,
    A,
    u
  ]), ce = X(
    () => Wn(I, w, a),
    [I, w, a]
  ), _e = X(() => ({
    refreshSessions: A,
    adoptRemoteConversationId: D,
    newSession: B,
    switchSession: J,
    removeSession: F,
    renameSession: Y,
    branchFromAnswer: k
  }), [
    A,
    D,
    B,
    J,
    F,
    Y,
    k
  ]);
  return {
    items: o,
    headId: m,
    messages: P,
    citationsByMessageId: v,
    progressByMessageId: y,
    contentByMessageId: z,
    sessions: ce,
    activeConversationId: w || ((le = a == null ? void 0 : a.getConversationId) == null ? void 0 : le.call(a)) || "",
    sessionBusy: u,
    sessionError: O,
    resolveRequestScopeKey: C,
    tree: U,
    sessionCommands: _e
  };
}
const Jn = "retainpdf.reader.ai.request.v1:", Qn = Object.freeze({
  assistantMode: "reading",
  scope: "document",
  context: null
});
function ot(t, e) {
  return `${Jn}${`${t || ""}`.trim()}:${`${e || ""}`.trim()}`;
}
function Xn(t) {
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
        ot(s, a),
        JSON.stringify(n)
      );
    } catch {
    }
}
function Be(t, e) {
  var a;
  const n = `${t || ""}`.trim(), s = `${e || ""}`.trim();
  if (!n || !s) return null;
  try {
    const r = (a = globalThis.localStorage) == null ? void 0 : a.getItem(ot(n, s));
    return r ? Xn(JSON.parse(r)) : null;
  } catch {
    return null;
  }
}
function Zn(t) {
  const e = `${t.scopeKey || ""}`.trim(), n = `${t.jobId || ""}`.trim(), s = `${t.assistantMessageId || ""}`.trim();
  return Be(e, s) || (e !== n ? Be(n, s) : null) || Qn;
}
function es(t) {
  const { assistantMode: e, selectionContext: n } = t;
  return e === "operations" ? { assistantMode: e, scope: "document", context: null } : n ? { assistantMode: e, scope: "selection", context: { ...n } } : { assistantMode: e, scope: "document", context: null };
}
function Me(t) {
  return `${t}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function ts(t) {
  var q;
  const { jobId: e, assistantMode: n, selectionContext: s = null, tree: a, chat: r, getScopeKey: o } = t, d = L(a);
  d.current = a;
  const m = L(r);
  m.current = r;
  const c = L(n);
  c.current = n;
  const I = L(s);
  I.current = s;
  const g = L(o);
  g.current = o;
  const w = r.status, p = w === "submitted" || w === "streaming", u = L(p);
  u.current = p;
  const $ = p ? `${((q = Dn(r.messages)) == null ? void 0 : q.id) || ""}` : "", O = r.messages, _ = r.error;
  H(() => {
    if (!O.length) return;
    const l = new Map(O.map((R) => [R.id, R])), f = /* @__PURE__ */ new Map();
    for (const [R, S] of l)
      f.set(R, Pn(S));
    d.current.mergeChatMirror(f);
  }, [O]), H(() => {
    !_ || w !== "error" || d.current.markRunningAsError(_.message);
  }, [_, w]);
  const x = G(async (l) => {
    if (u.current) return;
    const f = `${l || ""}`.trim();
    if (!f) return;
    const R = d.current, S = m.current, N = c.current, b = I.current, A = g.current(), h = R.readHeadId(), C = Me("u"), P = Me("a"), v = es({
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
        quoteText: Ye(b.region, b.pane)
      } : null
    });
    ze(A, P, v), R.appendExchange({
      parentId: h,
      userId: C,
      assistantId: P,
      question: f,
      progress: v.assistantMode === "operations" ? "正在规划 PDF 操作…" : "正在理解文档…"
    }), await S.sendUserMessage(
      { id: C, role: "user", parts: [{ type: "text", text: f }] },
      {
        body: {
          assistantMessageId: P,
          assistantMode: v.assistantMode,
          parentId: h,
          question: f,
          regenerate: !1,
          userMessageId: C,
          scope: v.scope,
          context: v.context
        }
      }
    );
  }, []), T = G(async (l) => {
    if (u.current) return;
    const f = d.current, R = m.current, S = f.readItems(), N = S.find(
      (U) => U.message.id === l && U.message.role === "assistant"
    ), b = (N == null ? void 0 : N.parentId) ?? null, A = b ? Fn(S, b) : null;
    let h = "", C = b;
    if ((A == null ? void 0 : A.role) === "user")
      h = A.content.trim();
    else {
      const U = ie(S, b ?? f.readHeadId());
      for (let D = U.length - 1; D >= 0; D -= 1)
        if (U[D].role === "user") {
          h = U[D].content.trim(), C = U[D].id;
          break;
        }
    }
    if (!h) return;
    const P = Me("a"), v = C || b, y = g.current(), z = Zn({
      scopeKey: y,
      jobId: e,
      assistantMessageId: l
    });
    ze(y, P, z), f.appendRetryTurn({ assistantId: P, branchParent: v }), R.replaceVisible(at(ie(S, l))), await R.regenerateFrom({
      messageId: l,
      body: {
        assistantMessageId: P,
        assistantMode: z.assistantMode,
        parentId: v,
        question: h,
        regenerate: !0,
        userMessageId: C || "",
        scope: z.scope,
        context: z.context
      }
    });
  }, [e]), M = G(async () => {
    await m.current.stopStream(), d.current.markRunningCancelled();
  }, []);
  return {
    isRunning: p,
    streamingAssistantId: $,
    submitQuestion: x,
    retryAnswer: T,
    cancelAnswer: M
  };
}
const ns = "retainpdf.reader-agent-operation.action-key.v1:", ss = /* @__PURE__ */ new Set(["queued", "running", "validating"]), rs = /* @__PURE__ */ new Set(["draft", "awaiting_confirmation", "result_ready"]);
function Le(t, e) {
  return ss.has(t) || e === "green_light" && rs.has(t);
}
function ue(t) {
  return Number(t.latest_event_seq) || Math.max(0, ...(t.events || []).map((e) => Number(e.seq) || 0));
}
function as(t, e) {
  return t ? e.current_attempt !== t.current_attempt ? e.current_attempt > t.current_attempt : ue(e) !== ue(t) ? ue(e) > ue(t) : `${e.updated_at || ""}` > `${t.updated_at || ""}` : !0;
}
function is(t, e) {
  var s, a;
  const n = ((a = (s = globalThis.crypto) == null ? void 0 : s.randomUUID) == null ? void 0 : a.call(s)) || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `reader-${e}-${t}-${n}`.slice(0, 128);
}
function os(t) {
  return Number(t == null ? void 0 : t.status) || 0;
}
function cs(t) {
  return t instanceof Error && t.message.trim() ? t.message.trim() : "操作请求失败，请重试。";
}
function ds({
  conversationId: t,
  enabled: e,
  discovering: n,
  signal: s,
  confirmationModeHint: a,
  onDocumentCommitted: r
}) {
  const [o, d] = K({}), [m, c] = K("explicit"), [I, g] = K(!1), [w, p] = K(!1), u = L(/* @__PURE__ */ new Set()), $ = L(/* @__PURE__ */ new Set()), O = L(/* @__PURE__ */ new Set()), _ = G((l, f = !1) => {
    l != null && l.operation_id && d((R) => {
      const S = R[l.operation_id];
      return as(S == null ? void 0 : S.operation, l) ? {
        ...R,
        [l.operation_id]: {
          ...S,
          operation: l,
          pendingAction: void 0,
          error: void 0
        }
      } : !f || !(S != null && S.pendingAction) ? R : {
        ...R,
        [l.operation_id]: { ...S, pendingAction: void 0 }
      };
    });
  }, []), x = G(async (l, f = !1) => {
    const R = `${l || ""}`.trim(), S = `refresh:${R}`;
    if (!(!R || u.current.has(S))) {
      u.current.add(S);
      try {
        _(await Gt(R), f);
      } catch {
      } finally {
        u.current.delete(S);
      }
    }
  }, [_]), T = G(async () => {
    const l = `${t || ""}`.trim(), f = `recover:${l}`;
    if (!(!e || !l || u.current.has(f))) {
      u.current.add(f);
      try {
        const R = await Vt({ conversationId: l, limit: 50 });
        if (!O.current.has(l)) {
          for (const S of R.operations || [])
            S.status === "committed" && $.current.add(S.operation_id);
          O.current.add(l);
        }
        for (const S of R.operations || []) _(S);
      } catch {
      } finally {
        u.current.delete(f);
      }
    }
  }, [t, e, _]);
  H(() => {
    if (!e) return;
    let l = !1;
    const f = async () => {
      try {
        const S = await en();
        if (l) return;
        c(S.agent_confirmation_mode || "explicit"), p(!!S.llm_api_key_configured), g(
          S.restart_required || S.restart_state === "pending" || S.active_revision !== S.configured_revision
        );
      } catch {
        l || (g(!1), p(!1));
      }
    };
    f();
    const R = window.setInterval(f, 3e3);
    return () => {
      l = !0, window.clearInterval(R);
    };
  }, [e]), H(() => {
    a && c(a);
  }, [a]), H(() => {
    s != null && s.confirmationMode && c(s.confirmationMode), s != null && s.operationId && x(s.operationId);
  }, [x, s]), H(() => {
    T();
  }, [T]), H(() => {
    n || T();
  }, [n, T]);
  const M = X(
    () => Object.values(o).filter((l) => !!t && l.operation.conversation_id === t).sort((l, f) => `${l.operation.created_at || ""}`.localeCompare(`${f.operation.created_at || ""}`)),
    [t, o]
  );
  H(() => {
    var l;
    for (const f of M) {
      const R = f.operation;
      R.status !== "committed" || $.current.has(R.operation_id) || ($.current.add(R.operation_id), r == null || r({
        documentId: R.document_id,
        revision: ((l = R.candidate) == null ? void 0 : l.version_id) || `${R.updated_at || ""}` || `${R.operation_id}:${ue(R)}`
      }));
    }
  }, [M, r]);
  const q = M.some((l) => Le(l.operation.status, m));
  return H(() => {
    if (!e || !t || !n && !q) return;
    const l = window.setInterval(() => {
      T();
      for (const f of M)
        Le(f.operation.status, m) && x(f.operation.operation_id);
    }, 1400);
    return () => window.clearInterval(l);
  }, [m, t, n, e, M, q, T, x]), H(() => {
    if (!e) return;
    const l = () => void T(), f = () => {
      document.visibilityState === "visible" && l();
    };
    return window.addEventListener("online", l), document.addEventListener("visibilitychange", f), () => {
      window.removeEventListener("online", l), document.removeEventListener("visibilitychange", f);
    };
  }, [e, T]), {
    entries: M,
    confirmationMode: m,
    runtimeRestarting: I,
    runtimeCredentialConfigured: w,
    setEntriesById: d,
    inFlightRef: u,
    upsert: _,
    refresh: x
  };
}
function ct(t, e) {
  return `${ns}${t}:${e}`;
}
function ls(t, e, n) {
  const s = `${t}:${e}`, a = ct(t, e);
  let r = "";
  try {
    r = `${sessionStorage.getItem(a) || ""}`.trim();
  } catch {
  }
  const o = n.get(s) || r || is(t, e);
  n.set(s, o);
  try {
    sessionStorage.setItem(a, o);
  } catch {
  }
  return o;
}
function je(t, e, n) {
  n.delete(`${t}:${e}`);
  try {
    sessionStorage.removeItem(ct(t, e));
  } catch {
  }
}
function us({
  refresh: t,
  upsert: e,
  setEntriesById: n,
  inFlightRef: s
}) {
  const a = L(/* @__PURE__ */ new Map());
  return { perform: G(async (o, d, m = {}) => {
    const c = `${d.operation_id || ""}`.trim(), I = `action:${c}`;
    if (!c || s.current.has(I)) return;
    if (o === "retry" && d.status === "ambiguous" && m.acceptDuplicateRisk !== !0) {
      n((p) => ({
        ...p,
        [c]: {
          ...p[c],
          error: "请先确认重复执行风险，再重新执行操作。"
        }
      }));
      return;
    }
    const g = ls(c, o, a.current);
    s.current.add(I), n((p) => ({
      ...p,
      [c]: { ...p[c], pendingAction: o, error: void 0 }
    }));
    const w = {
      idempotency_key: g,
      expected_status: d.status,
      expected_attempt: d.current_attempt,
      expected_program_sha256: d.program_sha256 || ""
    };
    try {
      let p;
      o === "run" ? p = await Yt(c, w) : o === "cancel" ? p = await Jt(c, { ...w, reason: "user_rejected" }) : o === "commit" ? p = await Qt(c, w) : p = await Xt(c, m.acceptDuplicateRisk ? { ...w, accept_duplicate_risk: !0 } : w), je(c, o, a.current), e(p, !0);
    } catch (p) {
      os(p) === 409 ? (je(c, o, a.current), await t(c, !0)) : n((u) => ({
        ...u,
        [c]: {
          ...u[c],
          pendingAction: void 0,
          error: cs(p)
        }
      }));
    } finally {
      s.current.delete(I);
    }
  }, [t, e]) };
}
function ms({
  conversationId: t,
  enabled: e,
  discovering: n,
  signal: s,
  confirmationModeHint: a,
  onDocumentCommitted: r
}) {
  const o = ds({
    conversationId: t,
    enabled: e,
    discovering: n,
    signal: s,
    confirmationModeHint: a,
    onDocumentCommitted: r
  }), { perform: d } = us({
    refresh: o.refresh,
    upsert: o.upsert,
    setEntriesById: o.setEntriesById,
    inFlightRef: o.inFlightRef
  }), m = G((c) => Zt(c.operation_id), []);
  return {
    entries: o.entries,
    confirmationMode: o.confirmationMode,
    runtimeRestarting: o.runtimeRestarting,
    runtimeCredentialConfigured: o.runtimeCredentialConfigured,
    perform: d,
    loadCandidate: m
  };
}
function ps(t) {
  var l;
  const { jobId: e, documentId: n = "", enabled: s, selectionContext: a = null, onDocumentCommitted: r } = t, [o, d] = K("reading"), [m, c] = K(null), [I, g] = K();
  H(() => {
    d("reading"), c(null), g(void 0);
  }, [e]);
  const w = X(() => !s || !e ? null : St({ jobId: e, documentId: n }), [n, s, e]), p = X(() => !s || !e ? null : Bt({
    loadMarkdownPayload: At.loadMarkdownPayload
  }), [s, e]), u = On({
    jobId: e,
    enabled: s,
    remoteAnswerer: w,
    localAnswerer: p,
    assistantMode: o,
    onAgentOperationSignal: (f) => {
      c({ ...f, nonce: Date.now() + Math.random() });
    },
    onConfirmationMode: g
  }), $ = X(() => ({
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
    stopStream: () => $.stopStream(),
    clearMessages: () => $.replaceVisible([]),
    showMessages: (f) => $.replaceVisible(at(f))
  }), [$]), _ = Yn({
    jobId: e,
    documentId: n,
    enabled: s,
    remoteAnswerer: w,
    stream: O
  }), x = ts({
    jobId: e,
    assistantMode: o,
    selectionContext: a,
    tree: _.tree,
    chat: $,
    getScopeKey: () => _.resolveRequestScopeKey()
  }), T = _.activeConversationId || (m == null ? void 0 : m.conversationId) || `${((l = w == null ? void 0 : w.getConversationId) == null ? void 0 : l.call(w)) || ""}`.trim(), M = ms({
    conversationId: T,
    enabled: s,
    discovering: x.isRunning,
    signal: m,
    confirmationModeHint: I,
    onDocumentCommitted: r
  }), q = L(!1);
  return H(() => {
    q.current = !1;
  }, [e]), H(() => {
    q.current && !x.isRunning && (_.sessionCommands.refreshSessions(), _.sessionCommands.adoptRemoteConversationId()), q.current = x.isRunning;
  }, [_, x.isRunning]), {
    citationsByMessageId: _.citationsByMessageId,
    progressByMessageId: _.progressByMessageId,
    contentByMessageId: _.contentByMessageId,
    streamingAssistantId: x.streamingAssistantId,
    isRunning: x.isRunning,
    messages: _.messages,
    sessions: _.sessions,
    activeConversationId: _.activeConversationId,
    sessionBusy: _.sessionBusy,
    sessionError: _.sessionError,
    submitQuestion: x.submitQuestion,
    retryAnswer: x.retryAnswer,
    cancelAnswer: x.cancelAnswer,
    newSession: _.sessionCommands.newSession,
    switchSession: _.sessionCommands.switchSession,
    removeSession: _.sessionCommands.removeSession,
    renameSession: _.sessionCommands.renameSession,
    branchFromAnswer: _.sessionCommands.branchFromAnswer,
    agentOperations: M,
    assistantMode: o,
    setAssistantMode: d
  };
}
function Ss({
  open: t,
  jobId: e,
  documentId: n = "",
  onClose: s,
  onJumpCitation: a,
  onDocumentCommitted: r,
  layout: o = "floating",
  side: d = "right",
  selectionContext: m = null,
  onClearSelectionContext: c
}) {
  const I = t && !!e, {
    citationsByMessageId: g,
    progressByMessageId: w,
    contentByMessageId: p,
    streamingAssistantId: u,
    isRunning: $,
    sessions: O,
    activeConversationId: _,
    sessionBusy: x,
    sessionError: T,
    messages: M,
    submitQuestion: q,
    retryAnswer: l,
    cancelAnswer: f,
    newSession: R,
    switchSession: S,
    removeSession: N,
    renameSession: b,
    branchFromAnswer: A,
    agentOperations: h,
    assistantMode: C,
    setAssistantMode: P
  } = ps({
    jobId: e,
    documentId: n,
    enabled: I,
    selectionContext: m,
    onDocumentCommitted: r
  }), [v, y] = K(""), z = G(async (D) => {
    y(""), await A(D) && (y(
      "已保存新对话（fork-n-原名）：复制了到此答案的上文，原对话不变。顶部列表可切换。"
    ), window.setTimeout(() => y(""), 6e3));
  }, [A]), U = G((D) => {
    a(D);
  }, [a]);
  return /* @__PURE__ */ i(
    $t,
    {
      id: "reader-ai-panel",
      open: t,
      title: "RetainPDF AI",
      titleIcon: /* @__PURE__ */ i(pe, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.ai-float.pos.v2",
      ariaLabel: "阅读问答",
      width: 420,
      placement: o === "workspace" ? "workspace" : o === "docked" ? "dock-right" : "floating",
      showHeader: o !== "workspace",
      className: `reader-float-ai is-${o}${o === "workspace" ? ` is-pane-${d}` : ""}${x ? " is-session-busy" : ""}`,
      onClose: s,
      children: e ? /* @__PURE__ */ E("div", { className: "reader-float-ai-body", children: [
        /* @__PURE__ */ i(
          kn,
          {
            sessions: O,
            activeId: _,
            busy: x,
            errorText: T,
            onSwitch: S,
            onNew: R,
            onDelete: N,
            onRename: b
          }
        ),
        v ? /* @__PURE__ */ i("div", { className: "aui-session-banner", role: "status", children: v }) : null,
        /* @__PURE__ */ i("div", { className: "reader-float-ai-thread-wrap", "aria-busy": x || void 0, children: /* @__PURE__ */ i(
          Mn,
          {
            jobId: e,
            messages: M,
            citationsByMessageId: g,
            progressByMessageId: w,
            contentByMessageId: p,
            streamingAssistantId: u,
            isRunning: $,
            onSubmit: q,
            onRetry: l,
            onCancel: f,
            onJumpCitation: U,
            onBranchFromAnswer: z,
            branchBusy: x,
            agentOperations: h,
            assistantMode: C,
            onAssistantModeChange: P,
            selectionContext: m,
            onClearSelectionContext: c
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
  Ss as ReaderAiPanel
};
//# sourceMappingURL=ReaderAiPanel-BcijpPhf.js.map
