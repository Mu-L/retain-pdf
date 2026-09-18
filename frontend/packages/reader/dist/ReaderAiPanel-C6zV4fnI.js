import { jsx as i, jsxs as E, Fragment as Ie } from "react/jsx-runtime";
import { useState as W, useRef as L, useEffect as U, useMemo as X, useCallback as G, useId as pt } from "react";
import { Square as mt, ArrowUp as ft, Copy as ht, GitBranch as gt, RefreshCw as yt, Sigma as He, Table2 as vt, Image as wt, Type as It, X as be, BookOpen as Ge, Sparkles as he, Loader2 as Re, FileText as Ae, ArrowDown as Ve, ListTree as bt, FlaskConical as Rt, ShieldCheck as Ct, Bot as Mt, ChevronUp as Nt, ChevronDown as Ye, TriangleAlert as Je, ExternalLink as _t, Check as Qe, Circle as kt, Plus as At, Pencil as St, Trash2 as xt } from "lucide-react";
import { g as ue, h as me, i as De, j as Tt, d as $t, b as Et } from "./ReaderApp-CE97KUcL.js";
import { ThreadPrimitive as ne, ComposerPrimitive as ye, MessagePrimitive as Xe, ActionBarPrimitive as _e, useExternalStoreRuntime as Pt, AssistantRuntimeProvider as Ot } from "@assistant-ui/react";
import { A as Dt } from "./AiMarkdownAnswer-Dt0lNQUc.js";
import { r as Ze } from "./reader-regions-DsePY7B_.js";
import { M as Ft, C as Fe, h as zt } from "./config-CgaWliJ_.js";
import { l as ce, t as se, w as qt } from "./answer-enhance-Cm_PuAj9.js";
import { Chat as Bt, useChat as Lt } from "@ai-sdk/react";
import { s as jt, l as et, c as fe, b as xe, a as Kt } from "./thread-branch-store-Jy9wH_F1.js";
import { describeToolEvent as Wt } from "@retainpdf/domain/ai";
import { toSessionSummary as Ut } from "@retainpdf/domain/session";
import { l as Ht } from "./ask-answerer-GNQdzitl.js";
import { getConversation as ze, messagesToBranchItems as we, nextForkConversationTitle as Gt } from "@retainpdf/api/conversations";
import { c as ke } from "./ai-chat-ZSCffLDD.js";
import { agentOperationShouldReplace as Vt, agentOperationEventSeq as Yt, agentOperationShouldPoll as Jt, agentOperationErrorStatus as Qt, agentOperationErrorMessage as Xt, resolveAgentOperationActionKey as Zt, clearAgentOperationActionKey as en } from "@retainpdf/api/agent-operation-model";
function tt(t) {
  return t.content.filter((e) => e.type === "text").map((e) => e.text).join(`
`).trim();
}
function qe({ label: t }) {
  return /* @__PURE__ */ E("div", { className: "aui-thinking", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ i(Re, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
    /* @__PURE__ */ i("span", { children: t || "思考中…" })
  ] });
}
function tn({ message: t }) {
  return /* @__PURE__ */ i(Xe.Root, { className: "aui-msg aui-msg-user", "data-role": "user", children: /* @__PURE__ */ i("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ i("div", { className: "aui-md-plain", children: tt(t) }) }) });
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
  const p = tt(e);
  return /* @__PURE__ */ i(Xe.Root, { className: "aui-msg aui-msg-assistant", "data-role": "assistant", children: /* @__PURE__ */ E("div", { className: "aui-msg-stack", children: [
    a && s ? /* @__PURE__ */ i(qe, { label: s }) : null,
    a && !s && !p ? /* @__PURE__ */ i(qe, { label: "思考中…" }) : null,
    p ? /* @__PURE__ */ i("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ i(
      Dt,
      {
        content: p,
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
      _e.Root,
      {
        className: "aui-msg-actions",
        "data-reader-ai-actions": "",
        hideWhenRunning: !0,
        autohide: "not-last",
        children: [
          /* @__PURE__ */ i(_e.Copy, { className: "aui-action-btn", "aria-label": "复制答案", title: "复制答案", children: /* @__PURE__ */ i(ht, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }) }),
          d ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "aui-action-btn aui-action-btn-branch",
              "aria-label": "从这里开新对话",
              title: "从这里开新对话",
              disabled: r,
              onClick: async () => {
                ce(1200, { overlayDelayMs: 0 }), se(1200), await d(e.id);
              },
              children: /* @__PURE__ */ i(gt, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 })
            }
          ) : null,
          /* @__PURE__ */ i(_e.Reload, { className: "aui-action-btn", "aria-label": "重新生成", title: "重新生成", children: /* @__PURE__ */ i(yt, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 }) })
        ]
      }
    )
  ] }) });
}
function nt({
  jobId: t,
  citationsByMessageId: e,
  progressByMessageId: n,
  streamingAssistantId: s,
  isRunning: a,
  branchBusy: r,
  onJumpCitation: o,
  onBranchFromAnswer: d
}) {
  return /* @__PURE__ */ i("div", { className: "aui-message-group", "data-slot": "aui_message-group", children: /* @__PURE__ */ i(ne.Messages, { children: ({ message: p }) => {
    var w;
    if (p.role === "user") return /* @__PURE__ */ i(tn, { message: p });
    if (p.role !== "assistant") return null;
    const c = ((w = p.status) == null ? void 0 : w.type) === "running" || a && s === p.id;
    return /* @__PURE__ */ i(
      nn,
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
function rn({
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
          /* @__PURE__ */ i(Ge, { size: 12, strokeWidth: 2.2, "aria-hidden": !0 }),
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
          /* @__PURE__ */ i(he, { size: 12, strokeWidth: 2.2, "aria-hidden": !0 }),
          /* @__PURE__ */ i("span", { children: "PDF Agent" })
        ]
      }
    )
  ] });
}
function sn({
  selectionContext: t,
  onClear: e
}) {
  if (!t) return null;
  const n = t.selectionType === "text" ? "text" : t.kind, s = t.selectionType === "text" ? t.quote : Ze(t.region, t.pane), a = n === "formula" ? "公式" : n === "table" ? "表格" : n === "figure" ? "图片" : "文字";
  return /* @__PURE__ */ E("div", { className: "aui-selection-context", "data-reader-ai-selection-context": "", children: [
    /* @__PURE__ */ i(n === "formula" ? He : n === "table" ? vt : n === "figure" ? wt : It, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
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
function rt({
  isRunning: t,
  branchBusy: e,
  mode: n,
  onModeChange: s,
  selectionContext: a,
  onClearSelectionContext: r
}) {
  return /* @__PURE__ */ E(ye.Root, { className: "aui-composer", "data-reader-ai-composer": "", children: [
    /* @__PURE__ */ E("div", { className: "aui-composer-shell", children: [
      n !== "operations" ? /* @__PURE__ */ i(sn, { selectionContext: a, onClear: r }) : null,
      /* @__PURE__ */ i(
        ye.Input,
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
        /* @__PURE__ */ i(rn, { mode: n, disabled: t || e, onChange: s }),
        /* @__PURE__ */ i("div", { className: "aui-composer-actions", children: t ? /* @__PURE__ */ i(ye.Cancel, { className: "aui-send aui-send-stop", "aria-label": "停止生成", children: /* @__PURE__ */ i(mt, { size: 12, strokeWidth: 2.6, "aria-hidden": !0 }) }) : /* @__PURE__ */ i(ye.Send, { className: "aui-send", "aria-label": "发送", children: /* @__PURE__ */ i(ft, { size: 16, strokeWidth: 2.5, "aria-hidden": !0 }) }) })
      ] })
    ] }),
    /* @__PURE__ */ i("p", { className: "aui-hint", children: "AI 可能会出错，请核对原文与引用" })
  ] });
}
function st() {
  return /* @__PURE__ */ E("div", { className: "aui-composer aui-composer-locked", role: "alert", children: [
    /* @__PURE__ */ i("p", { className: "aui-llm-lock-msg", children: Ft }),
    /* @__PURE__ */ i("p", { className: "aui-hint", children: "请到首页「设置 → API 设置」填写模型 Key 后即可提问" })
  ] });
}
const an = [
  { prompt: "把第 1 页旋转 90 度。", label: "旋转页面", icon: Ae },
  { prompt: "删除最后一页。", label: "删除页面", icon: Ae }
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
  agentRequestBlocked: p = !1,
  agentOperationPanel: c,
  onModeChange: w,
  onJumpCitation: g,
  onBranchFromAnswer: C
}) {
  const f = d || p;
  return /* @__PURE__ */ E(Ie, { children: [
    e ? /* @__PURE__ */ E("div", { className: "aui-empty", children: [
      /* @__PURE__ */ i("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ i("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ i(he, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ i("h2", { className: "aui-empty-title", children: "想怎样处理 PDF？" }),
      /* @__PURE__ */ i("p", { className: "aui-empty-sub", children: "创建候选版本后由你预览和确认" }),
      /* @__PURE__ */ i("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: an.map((l) => {
        const T = l.icon;
        return /* @__PURE__ */ E(
          ne.Suggestion,
          {
            prompt: l.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: f || o,
            children: [
              /* @__PURE__ */ i(T, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
              /* @__PURE__ */ i("span", { className: "aui-suggestion-label", children: l.label })
            ]
          },
          l.prompt
        );
      }) })
    ] }) : null,
    /* @__PURE__ */ i(
      nt,
      {
        jobId: t,
        citationsByMessageId: n,
        progressByMessageId: s,
        streamingAssistantId: a,
        isRunning: r,
        branchBusy: d,
        onJumpCitation: g,
        onBranchFromAnswer: C
      }
    ),
    c,
    /* @__PURE__ */ E(ne.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !d ? /* @__PURE__ */ i(
        ne.ScrollToBottom,
        {
          className: "aui-scroll-bottom-btn aui-scroll-bottom",
          "aria-label": "滚到最新",
          children: /* @__PURE__ */ i(Ve, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
        }
      ) : null,
      o ? /* @__PURE__ */ i(st, {}) : /* @__PURE__ */ i(
        rt,
        {
          isRunning: r,
          branchBusy: f,
          mode: "operations",
          onModeChange: w,
          selectionContext: null,
          onClearSelectionContext: void 0
        }
      )
    ] })
  ] });
}
const cn = [
  { prompt: "用几句话总结这篇文献的核心内容。", label: "总结本文", icon: Ge },
  { prompt: "这篇文献的主要结论是什么？", label: "提炼主要结论", icon: bt },
  { prompt: "作者用了什么方法或模型？", label: "梳理方法与模型", icon: Rt },
  { prompt: "解释文中的关键公式。", label: "解释关键公式", icon: He }
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
  composerDisabled: p = !1,
  onModeChange: c,
  onJumpCitation: w,
  onBranchFromAnswer: g,
  selectionContext: C = null,
  onClearSelectionContext: f,
  footerExtra: l = null
}) {
  return /* @__PURE__ */ E(Ie, { children: [
    e ? /* @__PURE__ */ E("div", { className: "aui-empty", children: [
      /* @__PURE__ */ i("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ i("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ i(he, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ i("h2", { className: "aui-empty-title", children: "一起读懂这篇文档" }),
      /* @__PURE__ */ i("p", { className: "aui-empty-sub", children: "总结、解释、检索与计算，不修改 PDF" }),
      /* @__PURE__ */ i("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: cn.map((T) => {
        const O = T.icon;
        return /* @__PURE__ */ E(
          ne.Suggestion,
          {
            prompt: T.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: d || p || o,
            children: [
              /* @__PURE__ */ i(O, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
              /* @__PURE__ */ i("span", { className: "aui-suggestion-label", children: T.label })
            ]
          },
          T.prompt
        );
      }) })
    ] }) : null,
    /* @__PURE__ */ i(
      nt,
      {
        jobId: t,
        citationsByMessageId: n,
        progressByMessageId: s,
        streamingAssistantId: a,
        isRunning: r,
        branchBusy: d,
        onJumpCitation: w,
        onBranchFromAnswer: g
      }
    ),
    l,
    /* @__PURE__ */ E(ne.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !d ? /* @__PURE__ */ i(
        ne.ScrollToBottom,
        {
          className: "aui-scroll-bottom-btn aui-scroll-bottom",
          "aria-label": "滚到最新",
          children: /* @__PURE__ */ i(Ve, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
        }
      ) : null,
      o ? /* @__PURE__ */ i(st, {}) : /* @__PURE__ */ i(
        rt,
        {
          isRunning: r,
          branchBusy: d || p,
          mode: "reading",
          onModeChange: c,
          selectionContext: C,
          onClearSelectionContext: f
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
  agentRequestBlocked: p = !1,
  agentOperationPanel: c,
  assistantMode: w = "reading",
  onAssistantModeChange: g,
  onJumpCitation: C,
  onBranchFromAnswer: f,
  selectionContext: l = null,
  onClearSelectionContext: T
}) {
  const O = e.length === 0, k = w === "operations";
  return /* @__PURE__ */ i(
    ne.Root,
    {
      className: `aui-thread aui-thread-root${o ? " is-llm-locked" : ""}`,
      "data-chat-ui": "assistant-ui-official-thread",
      children: /* @__PURE__ */ i(
        ne.Viewport,
        {
          className: "aui-viewport",
          "data-slot": "aui_thread-viewport",
          "data-reader-ai-viewport": "true",
          turnAnchor: "top",
          autoScroll: !0,
          children: /* @__PURE__ */ i("div", { className: `aui-thread-inner${O ? " is-empty" : ""}`, children: k ? /* @__PURE__ */ i(
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
              agentRequestBlocked: p,
              agentOperationPanel: c,
              onModeChange: g,
              onJumpCitation: C,
              onBranchFromAnswer: f
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
              composerDisabled: p,
              onModeChange: g,
              onJumpCitation: C,
              onBranchFromAnswer: f,
              selectionContext: l,
              onClearSelectionContext: T
            }
          ) })
        }
      )
    }
  );
}
const at = "retainpdf.reader-agent-operation.dismissed.v1", un = /* @__PURE__ */ new Set(["failed", "cancelled"]);
function Be(t) {
  return [
    `${t.operation_id || ""}`.trim(),
    Number(t.current_attempt) || 0,
    `${t.status || ""}`
  ].join(":");
}
function pn() {
  var t;
  try {
    const e = JSON.parse(((t = globalThis.localStorage) == null ? void 0 : t.getItem(at)) || "[]");
    return new Set(Array.isArray(e) ? e.filter((n) => typeof n == "string") : []);
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function mn(t) {
  var e;
  try {
    (e = globalThis.localStorage) == null || e.setItem(
      at,
      JSON.stringify(Array.from(t).slice(-100))
    );
  } catch {
  }
}
function it(t, e) {
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
  return t === "failed" || t === "ambiguous" ? Je : t === "cancelled" ? be : t === "committed" || t === "result_ready" ? Qe : ["queued", "running", "validating"].includes(t) ? Re : kt;
}
function gn({ events: t, mode: e }) {
  return /* @__PURE__ */ i("ol", { className: "reader-agent-operation-timeline", "aria-label": "PDF 操作步骤", children: t.map((n) => {
    const s = hn(n.status), a = ["queued", "running", "validating"].includes(n.status);
    return /* @__PURE__ */ E("li", { children: [
      /* @__PURE__ */ i(s, { className: a ? "is-spinning" : "", size: 12, "aria-hidden": !0 }),
      /* @__PURE__ */ i("span", { children: n.summary || n.event || it(n.status, e) }),
      /* @__PURE__ */ i("time", { children: n.ts ? new Date(n.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "" })
    ] }, `${n.attempt}:${n.seq}`);
  }) });
}
function yn({
  operation: t,
  loadCandidate: e
}) {
  const [n, s] = W(!1), [a, r] = W(""), [o, d] = W(""), p = L("");
  return U(() => {
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
  }, [e, t.operation_id, t.current_attempt]), U(() => () => {
    p.current && URL.revokeObjectURL(p.current);
  }, []), /* @__PURE__ */ E(Ie, { children: [
    /* @__PURE__ */ E("div", { className: "reader-agent-operation-candidate", children: [
      /* @__PURE__ */ E("div", { children: [
        /* @__PURE__ */ i(Ae, { size: 13, "aria-hidden": !0 }),
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
function vn({
  entry: t,
  mode: e,
  loadCandidate: n,
  onAction: s,
  onDismiss: a
}) {
  var O;
  const { operation: r, pendingAction: o, error: d } = t, [p, c] = W(!1), [w, g] = W(!1), C = r.events || [], f = fn(r.status), l = !!((r.status === "result_ready" || r.status === "committed") && r.candidate_available), T = un.has(r.status);
  return /* @__PURE__ */ E("article", { className: `reader-agent-operation-card is-${r.status}`, "data-operation-id": r.operation_id, children: [
    /* @__PURE__ */ E("header", { children: [
      /* @__PURE__ */ i("span", { className: "reader-agent-operation-icon", "aria-hidden": !0, children: /* @__PURE__ */ i(Mt, { size: 15 }) }),
      /* @__PURE__ */ E("div", { className: "reader-agent-operation-title", children: [
        /* @__PURE__ */ i("span", { children: "PDF 操作" }),
        /* @__PURE__ */ i("strong", { children: r.intent_summary || "处理当前 PDF" })
      ] }),
      /* @__PURE__ */ E("div", { className: "reader-agent-operation-head-actions", children: [
        /* @__PURE__ */ i("span", { className: "reader-agent-operation-status", children: it(r.status, e) }),
        T ? /* @__PURE__ */ i(
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
    C.length ? /* @__PURE__ */ E("div", { className: "reader-agent-operation-details", children: [
      /* @__PURE__ */ E("button", { type: "button", onClick: () => c((k) => !k), children: [
        p ? /* @__PURE__ */ i(Nt, { size: 12, "aria-hidden": !0 }) : /* @__PURE__ */ i(Ye, { size: 12, "aria-hidden": !0 }),
        p ? "收起步骤" : `执行步骤 ${C.length}`
      ] }),
      p ? /* @__PURE__ */ i(gn, { events: C, mode: e }) : null
    ] }) : null,
    l ? /* @__PURE__ */ i(yn, { operation: r, loadCandidate: n }) : null,
    d ? /* @__PURE__ */ i("p", { className: "reader-agent-operation-error", role: "alert", children: d }) : null,
    w ? /* @__PURE__ */ E("div", { className: "reader-agent-operation-risk", role: "alertdialog", "aria-label": "确认重复执行风险", children: [
      /* @__PURE__ */ i(Je, { size: 14, "aria-hidden": !0 }),
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
    ] }) : f.length ? /* @__PURE__ */ i("div", { className: "reader-agent-operation-actions", children: f.map((k) => /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: k.primary ? "is-primary" : k.danger ? "is-danger" : "",
        disabled: !!o,
        onClick: () => {
          k.risk ? g(!0) : s(k.action, r);
        },
        children: o === k.action ? "处理中…" : k.label
      },
      k.action
    )) }) : null
  ] });
}
function wn({
  entries: t,
  confirmationMode: e,
  runtimeRestarting: n,
  loadCandidate: s,
  onAction: a
}) {
  const [r, o] = W(pn), d = t.filter((c) => !r.has(Be(c.operation)));
  function p(c) {
    const w = Be(c);
    o((g) => {
      const C = new Set(g);
      return C.add(w), mn(C), C;
    });
  }
  return /* @__PURE__ */ E("section", { className: `reader-agent-operations${d.length ? " has-operations" : ""}`, "aria-label": "AI PDF 操作", children: [
    /* @__PURE__ */ E("div", { className: `reader-agent-mode${e === "green_light" ? " is-green" : ""}`, children: [
      /* @__PURE__ */ i(Ct, { size: 13, "aria-hidden": !0 }),
      /* @__PURE__ */ i("span", { children: e === "green_light" ? "绿灯模式 · 自动执行并应用" : "需要确认 · 操作前等待授权" })
    ] }),
    n ? /* @__PURE__ */ E("div", { className: "reader-agent-restarting", role: "status", children: [
      /* @__PURE__ */ i(Re, { className: "is-spinning", size: 13, "aria-hidden": !0 }),
      "正在重启 Agent，新请求暂不可用"
    ] }) : null,
    d.map((c) => /* @__PURE__ */ i(
      vn,
      {
        entry: c,
        mode: e,
        loadCandidate: s,
        onAction: a,
        onDismiss: p
      },
      c.operation.operation_id
    ))
  ] });
}
const In = (t) => t, bn = Object.freeze([]), Rn = Object.freeze({}), Le = Object.freeze({}), Cn = Object.freeze({
  entries: [],
  confirmationMode: "explicit",
  runtimeRestarting: !1,
  runtimeCredentialConfigured: !1,
  perform: async () => {
  },
  loadCandidate: async () => new Blob()
});
function Mn(t) {
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
function _n({
  jobId: t = "",
  messages: e = bn,
  citationsByMessageId: n = Rn,
  progressByMessageId: s = Le,
  contentByMessageId: a = Le,
  streamingAssistantId: r = "",
  isRunning: o = !1,
  onSubmit: d,
  onRetry: p,
  onCancel: c,
  onJumpCitation: w,
  onBranchFromAnswer: g,
  branchBusy: C = !1,
  agentOperations: f = Cn,
  assistantMode: l = "reading",
  onAssistantModeChange: T,
  selectionContext: O = null,
  onClearSelectionContext: k
}) {
  const [, z] = W(0);
  U(() => {
    const u = () => z((b) => b + 1);
    return window.addEventListener("focus", u), window.addEventListener("storage", u), document.addEventListener(Fe, u), () => {
      window.removeEventListener("focus", u), window.removeEventListener("storage", u), document.removeEventListener(Fe, u);
    };
  }, []);
  const S = !zt() && !f.runtimeCredentialConfigured, v = X(() => e.map((u) => ({
    id: u.id,
    role: u.role,
    content: a[u.id] || u.content || "",
    ...u.role === "assistant" ? { status: Nn(u, r, o) } : {}
  })), [a, o, e, r]), P = G(async (u) => {
    const b = u ? Math.max(0, e.findIndex((h) => h.id === u) + 1) : 0, A = e.slice(b).find((h) => h.role === "assistant");
    A && await p(A.id);
  }, [e, p]), m = G(async (u) => {
    const b = Mn(u);
    !b || o || C || f.runtimeRestarting || S || await d(b);
  }, [f.runtimeRestarting, C, o, S, d]), y = G(async () => {
    await c();
  }, [c]), M = X(() => ({
    messages: v,
    isRunning: o,
    isDisabled: C || f.runtimeRestarting || S,
    convertMessage: In,
    onNew: m,
    onReload: P,
    onCancel: y
  }), [
    f.runtimeRestarting,
    C,
    y,
    m,
    o,
    S,
    P,
    v
  ]), x = Pt(M);
  return /* @__PURE__ */ i(Ot, { runtime: x, children: /* @__PURE__ */ i(
    ln,
    {
      jobId: t,
      messages: e,
      citationsByMessageId: n,
      progressByMessageId: s,
      streamingAssistantId: r,
      isRunning: o,
      missingLlmKey: S,
      branchBusy: C,
      agentRequestBlocked: f.runtimeRestarting,
      assistantMode: l,
      onAssistantModeChange: T,
      selectionContext: O,
      onClearSelectionContext: k,
      agentOperationPanel: f.entries.length > 0 || f.runtimeRestarting ? /* @__PURE__ */ i(
        wn,
        {
          entries: f.entries,
          confirmationMode: f.confirmationMode,
          runtimeRestarting: f.runtimeRestarting,
          loadCandidate: f.loadCandidate,
          onAction: f.perform
        }
      ) : null,
      onJumpCitation: w,
      onBranchFromAnswer: g
    }
  ) });
}
function ve(t = 900, e = 0) {
  ce(t, { overlayDelayMs: e }), se(t);
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
  onRename: p
}) {
  const c = t.length > 0, w = n || s, [g, C] = W(!1), [f, l] = W(""), [T, O] = W(""), k = L(null), z = pt();
  function S(h) {
    const N = `${h || ""}`.match(/^fork-(\d+)-(.*)$/i);
    if (!N) return h;
    const $ = N[2].trim();
    return $ ? `${$} · 分支${N[1]}` : `分支${N[1]}`;
  }
  const v = L(!1), P = L(null), m = t.find((h) => h.id === e) || null, y = m ? m.messageCount ? S(m.title) : `${S(m.title)}（空）` : c ? "选择以往对话" : "新对话";
  U(() => {
    if (!g) {
      l("");
      return;
    }
    const h = (R) => {
      if (v.current) return;
      const I = k.current;
      I && (R.target instanceof Node && I.contains(R.target) || (C(!1), l("")));
    }, N = (R) => {
      R.key === "Escape" && (C(!1), l(""));
    }, $ = window.setTimeout(() => {
      document.addEventListener("pointerdown", h, !0);
    }, 0);
    return document.addEventListener("keydown", N), () => {
      window.clearTimeout($), document.removeEventListener("pointerdown", h, !0), document.removeEventListener("keydown", N);
    };
  }, [g]), U(() => {
    if (!f) return;
    const h = P.current;
    h && (h.focus(), h.select());
  }, [f]);
  const M = (h) => {
    const N = `${h || ""}`.trim();
    !N || w || v.current || f || (v.current = !0, ve(1e3, 0), requestAnimationFrame(() => {
      C(!1), window.setTimeout(() => {
        (async () => {
          try {
            await r(N);
          } finally {
            ve(400, 0), v.current = !1;
          }
        })();
      }, 40);
    }));
  }, x = (h) => {
    w || (l(h.id), O(h.title || ""));
  }, u = () => {
    const h = f, N = T;
    l(""), h && p(h, N);
  }, b = () => {
    l(""), O("");
  }, A = (h) => {
    var R;
    if (w || v.current) return;
    const N = h.title || "未命名对话";
    (R = globalThis.confirm) != null && R.call(globalThis, `确定删除对话「${N}」？此操作不可恢复。`) && (v.current = !0, ve(800, 0), (async () => {
      try {
        await d(h.id);
      } finally {
        v.current = !1;
      }
    })());
  };
  return /* @__PURE__ */ E(
    "div",
    {
      className: "aui-session-bar",
      "data-reader-ai-sessions": "",
      ref: k,
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
              "aria-controls": z,
              disabled: w || !c,
              title: y,
              onClick: () => {
                w || !c || C((h) => !h);
              },
              children: [
                /* @__PURE__ */ i("span", { className: "aui-session-trigger-label", children: y }),
                /* @__PURE__ */ i(Ye, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 })
              ]
            }
          ),
          /* @__PURE__ */ E(
            "button",
            {
              type: "button",
              className: "aui-session-btn",
              disabled: w,
              title: "新对话窗口",
              "aria-label": "新对话",
              onClick: () => {
                w || v.current || (v.current = !0, ve(800), C(!1), l(""), window.setTimeout(() => {
                  (async () => {
                    try {
                      await o();
                    } finally {
                      v.current = !1;
                    }
                  })();
                }, 40));
              },
              children: [
                n ? /* @__PURE__ */ i(Re, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ i(At, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
                /* @__PURE__ */ i("span", { children: "新对话" })
              ]
            }
          )
        ] }),
        g && c ? /* @__PURE__ */ i(
          "ul",
          {
            id: z,
            className: "aui-session-list",
            role: "listbox",
            "aria-label": "以往对话",
            children: t.map((h) => {
              const N = h.messageCount ? S(h.title) : `${S(h.title)}（空）`, $ = h.id === e, R = f === h.id;
              return /* @__PURE__ */ i("li", { className: "aui-session-row-item", role: "presentation", children: R ? /* @__PURE__ */ E("div", { className: "aui-session-edit", children: [
                /* @__PURE__ */ i(
                  "input",
                  {
                    ref: P,
                    className: "aui-session-edit-input",
                    value: T,
                    maxLength: 80,
                    "aria-label": "对话标题",
                    disabled: w,
                    onChange: (I) => O(I.target.value),
                    onKeyDown: (I) => {
                      I.key === "Enter" ? (I.preventDefault(), u()) : I.key === "Escape" && (I.preventDefault(), b());
                    },
                    onClick: (I) => I.stopPropagation()
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": "保存标题",
                    title: "保存",
                    disabled: w || !T.trim(),
                    onClick: (I) => {
                      I.stopPropagation(), u();
                    },
                    children: /* @__PURE__ */ i(Qe, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": "取消重命名",
                    title: "取消",
                    disabled: w,
                    onClick: (I) => {
                      I.stopPropagation(), b();
                    },
                    children: /* @__PURE__ */ i(be, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }) : /* @__PURE__ */ E(Ie, { children: [
                /* @__PURE__ */ E(
                  "button",
                  {
                    type: "button",
                    role: "option",
                    "aria-selected": $,
                    className: `aui-session-item${$ ? " is-active" : ""}`,
                    disabled: w,
                    title: N,
                    onPointerDown: (I) => {
                      I.stopPropagation(), !$ && !w && se(1e3);
                    },
                    onClick: (I) => {
                      if (I.preventDefault(), I.stopPropagation(), $) {
                        C(!1);
                        return;
                      }
                      M(h.id);
                    },
                    children: [
                      /* @__PURE__ */ i("span", { className: "aui-session-item-title", children: N }),
                      $ ? /* @__PURE__ */ i("span", { className: "aui-session-item-badge", children: "当前" }) : null
                    ]
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": `重命名 ${N}`,
                    title: "重命名",
                    disabled: w,
                    onClick: (I) => {
                      I.preventDefault(), I.stopPropagation(), x(h);
                    },
                    children: /* @__PURE__ */ i(St, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn is-danger",
                    "aria-label": `删除 ${N}`,
                    title: "删除",
                    disabled: w,
                    onClick: (I) => {
                      I.preventDefault(), I.stopPropagation(), A(h);
                    },
                    children: /* @__PURE__ */ i(xt, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
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
function ot(t) {
  return ((t == null ? void 0 : t.parts) || []).filter((e) => e.type === "text").map((e) => e.text).join("").trim();
}
function An(t, e) {
  const n = `${e.question || ""}`.trim();
  if (n) return n;
  for (let s = t.length - 1; s >= 0; s -= 1) {
    const a = t[s];
    if (a.role !== "user") continue;
    const r = ot(a);
    if (r) return r;
  }
  return "";
}
function Sn(t) {
  const e = Number(t == null ? void 0 : t.status) || 0, n = `${(t == null ? void 0 : t.message) || ""}`;
  return e === 502 || /\b502\b/.test(n);
}
class xn {
  constructor(e) {
    this.options = e;
  }
  async sendMessages({
    abortSignal: e,
    body: n,
    messages: s,
    trigger: a
  }) {
    var T, O, k, z;
    const r = n || {}, o = An(s, r);
    if (!o) throw new Error("请输入问题。");
    const d = r.assistantMode || ((O = (T = this.options).getAssistantMode) == null ? void 0 : O.call(T)) || "reading", p = r.scope || "document", c = r.context ? { ...r.context } : null, w = `${r.assistantMessageId || ""}`.trim() || `a-${Date.now().toString(36)}`, g = `${w}-text`, C = this.options.getRemoteAnswerer(), f = ((z = (k = this.options).getLocalAnswerer) == null ? void 0 : z.call(k)) || null;
    if (!C && !f)
      throw new Error("问答暂不可用：请确认已打开任务阅读器。");
    let l = !1;
    return new ReadableStream({
      cancel: () => {
        l = !0;
      },
      start: (S) => {
        let v = "", P = {
          citations: [],
          progress: a === "regenerate-message" ? "正在重新生成…" : "正在检索文档…",
          status: "running"
        };
        const m = (M) => {
          if (!l)
            try {
              S.enqueue(M);
            } catch {
              l = !0;
            }
        }, y = (M) => {
          P = { ...P, ...M }, m({ type: "message-metadata", messageMetadata: P });
        };
        m({ type: "start", messageId: w, messageMetadata: P }), m({ type: "start-step" }), m({ type: "text-start", id: g }), (async () => {
          var M, x, u, b, A, h;
          try {
            if (await ((M = C == null ? void 0 : C.ensureLoaded) == null ? void 0 : M.call(C, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
            let N = C || f, $ = !1, R;
            try {
              R = await N.answer({
                question: o,
                assistantMode: d,
                scope: p,
                context: c,
                parentId: `${r.parentId || ""}`.trim(),
                regenerate: r.regenerate ?? a === "regenerate-message",
                userMessageId: `${r.userMessageId || ""}`.trim(),
                assistantMessageId: w,
                onAgentSessionEvent: (_) => {
                  var Y, J, de;
                  const F = (Y = _ == null ? void 0 : _.capabilities) == null ? void 0 : Y.document_operation_confirmation_mode;
                  (F === "explicit" || F === "green_light") && ((de = (J = this.options).onConfirmationMode) == null || de.call(J, F));
                },
                onAgentOperationEvent: (_) => {
                  var Y, J;
                  const F = `${(_ == null ? void 0 : _.operation_id) || ""}`.trim();
                  F && ((J = (Y = this.options).onAgentOperationSignal) == null || J.call(Y, {
                    operationId: F,
                    conversationId: `${(_ == null ? void 0 : _.conversation_id) || ""}`.trim() || void 0
                  }));
                },
                onAgentConfirmationRequiredEvent: (_) => {
                  var Y, J;
                  const F = `${(_ == null ? void 0 : _.operation_id) || ""}`.trim();
                  F && ((J = (Y = this.options).onAgentOperationSignal) == null || J.call(Y, { operationId: F }));
                },
                onToolEvent: (_) => {
                  if (v || e != null && e.aborted) return;
                  const F = Wt(_);
                  F && y({ progress: F });
                },
                onProgressEvent: (_) => {
                  if (v || e != null && e.aborted) return;
                  const F = `${(_ == null ? void 0 : _.message) || ""}`.trim();
                  F && y({ progress: F });
                },
                onAnswerDelta: (_, F) => {
                  !F || e != null && e.aborted || (v += F, P.progress && y({ progress: "" }), m({ type: "text-delta", id: g, delta: F }));
                },
                onCompress: (_) => {
                  if (v || e != null && e.aborted) return;
                  const F = Number(_ == null ? void 0 : _.dropped_turns) || 0;
                  F && y({ progress: `已压缩 ${F} 轮早期对话` });
                },
                signal: e
              });
            } catch (_) {
              if (e != null && e.aborted || d === "operations" || !C || !f || !Sn(_)) throw _;
              if ($ = !0, y({ progress: "在线服务暂不可用，改用本地检索…" }), await ((x = f.ensureLoaded) == null ? void 0 : x.call(f, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
              N = f, R = await N.answer({
                question: o,
                assistantMode: d,
                scope: p,
                context: c,
                signal: e
              });
            }
            if (e != null && e.aborted) {
              y({ progress: "", status: "cancelled", statusText: "已取消" }), m({ type: "abort", reason: "cancelled" });
              return;
            }
            const I = R == null ? void 0 : R.confirmationMode;
            (I === "explicit" || I === "green_light") && ((b = (u = this.options).onConfirmationMode) == null || b.call(u, I));
            const q = `${(R == null ? void 0 : R.conversationId) || ""}`.trim() || void 0, H = /* @__PURE__ */ new Set();
            for (const _ of (R == null ? void 0 : R.operationRefs) || []) {
              const F = typeof _ == "string" ? _ : `${(_ == null ? void 0 : _.operation_id) || ""}`;
              F.trim() && H.add(F.trim());
            }
            for (const _ of (R == null ? void 0 : R.confirmationRequests) || []) {
              const F = `${(_ == null ? void 0 : _.operation_id) || ""}`.trim();
              F && H.add(F);
            }
            for (const _ of H)
              (h = (A = this.options).onAgentOperationSignal) == null || h.call(A, {
                operationId: _,
                conversationId: q,
                confirmationMode: I || void 0
              });
            const D = qt(R == null ? void 0 : R.citations);
            let B = jt(
              `${(R == null ? void 0 : R.answer) || v || ""}`.trim() || "没有找到可用回答。",
              D
            );
            if ($ && (B += `

_在线服务暂不可用，以上来自本地文档检索。_`), (R == null ? void 0 : R.persisted) === !1 && (B += `

_⚠️ 本轮回答未能写入历史记录（存储暂时不可用），刷新后可能丢失。_`), !v)
              m({ type: "text-delta", id: g, delta: B });
            else if (B.startsWith(v)) {
              const _ = B.slice(v.length);
              _ && m({ type: "text-delta", id: g, delta: _ });
            }
            m({ type: "text-end", id: g }), y({
              citations: D,
              persisted: (R == null ? void 0 : R.persisted) !== !1,
              progress: "",
              status: "complete"
            }), m({ type: "finish-step" }), m({ type: "finish", finishReason: "stop", messageMetadata: P });
          } catch (N) {
            if (e != null && e.aborted)
              y({ progress: "", status: "cancelled", statusText: "已取消" }), m({ type: "abort", reason: "cancelled" });
            else {
              const $ = N instanceof Error && N.message ? N.message : "生成回答失败，请重试。";
              y({ progress: "", status: "error", statusText: $ }), m({ type: "error", errorText: $ });
            }
          } finally {
            if (!l) {
              l = !0;
              try {
                S.close();
              } catch {
              }
            }
          }
        })();
      }
    });
  }
  async reconnectToStream() {
    return null;
  }
}
function Tn(t) {
  return ot(t);
}
function ct(t) {
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
function $n(t) {
  const e = t.metadata || {}, n = e.status === "running", s = e.status === "cancelled" || e.status === "error", a = Tn(t), r = a.trim() || (s ? `${e.statusText || ""}`.trim() : "");
  return {
    id: t.id,
    role: t.role,
    content: t.role === "assistant" ? r : a,
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
function En(t) {
  const e = L(t.remoteAnswerer), n = L(t.localAnswerer), s = L(t.onAgentOperationSignal), a = L(t.onConfirmationMode), r = L(t.onStopped);
  r.current = t.onStopped;
  const o = L(t.assistantMode);
  e.current = t.remoteAnswerer, n.current = t.localAnswerer, s.current = t.onAgentOperationSignal, a.current = t.onConfirmationMode, o.current = t.assistantMode;
  const d = X(() => new Bt({
    id: `reader-${t.jobId || "idle"}`,
    transport: new xn({
      jobId: t.jobId,
      getRemoteAnswerer: () => e.current,
      getLocalAnswerer: () => n.current,
      getAssistantMode: () => o.current,
      onAgentOperationSignal: (p) => {
        var c;
        return (c = s.current) == null ? void 0 : c.call(s, p);
      },
      onConfirmationMode: (p) => {
        var c;
        return (c = a.current) == null ? void 0 : c.call(a, p);
      }
    })
  }), [t.jobId]);
  return U(() => {
    t.enabled || d.stop().finally(() => {
      var p;
      return (p = r.current) == null ? void 0 : p.call(r);
    });
  }, [d, t.enabled]), U(() => () => {
    d.stop().finally(() => {
      var p;
      return (p = r.current) == null ? void 0 : p.call(r);
    });
  }, [d]), Lt({ chat: d, experimental_throttle: 16 });
}
function Pn(t) {
  for (let e = t.length - 1; e >= 0; e -= 1)
    if (t[e].role === "assistant") return t[e];
}
function Te(t, e) {
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
function dt(t) {
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
function ae(t, e) {
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
function On(t, e) {
  var n;
  return e ? ((n = t.find((s) => s.message.id === e)) == null ? void 0 : n.message) ?? null : null;
}
function Dn(t, e) {
  const n = new Map(t.map((o) => [o.message.id, o]));
  let s = n.get(e);
  if (!s) return [];
  const a = [], r = /* @__PURE__ */ new Set();
  for (; s && !r.has(s.message.id); )
    r.add(s.message.id), a.push(s), s = s.parentId ? n.get(s.parentId) : void 0;
  return a.reverse();
}
function Fn(t, e, n) {
  var w, g, C, f;
  const s = `${e || ""}`.trim();
  if (!s || !t.length) return [];
  let a = s;
  t.some((l) => l.message.id === a) || (n && t.some((l) => l.message.id === n) ? a = n : a = ((w = [...t].reverse().find((l) => l.message.role === "assistant")) == null ? void 0 : w.message.id) || "");
  let r = Dn(t, a);
  if (r.length >= 2 && ((g = r.at(-1)) == null ? void 0 : g.message.role) === "assistant") return r;
  r.length === 1 && ((C = r[0]) == null ? void 0 : C.message.role) === "user" && (r = []);
  const o = ae(t, n || a);
  let d = o.findIndex((l) => l.id === a);
  if (d < 0 && (d = o.length - 1), d < 0) return r;
  const p = new Map(t.map((l) => [l.message.id, l])), c = o.slice(0, d + 1).map((l) => p.get(l.id)).filter((l) => !!l);
  for (; c.length && ((f = c.at(-1)) == null ? void 0 : f.message.role) !== "assistant"; ) c.pop();
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
const zn = {
  stopStream: () => Promise.resolve(),
  clearMessages: () => {
  },
  showMessages: () => {
  }
};
function qn(t) {
  var n;
  const e = {};
  for (const s of t) {
    const a = s.message;
    a.role === "assistant" && ((n = a.citations) != null && n.length) && (e[a.id] = a.citations);
  }
  return e;
}
function Bn(t) {
  const e = {};
  for (const n of t) {
    const s = n.message;
    s.role === "assistant" && s.progress && (e[s.id] = s.progress);
  }
  return e;
}
function Ln(t) {
  const e = {};
  for (const n of t) {
    const s = n.message;
    s.content && (e[s.id] = s.content);
  }
  return e;
}
function jn(t, e, n) {
  var a;
  const s = e || ((a = n == null ? void 0 : n.getConversationId) == null ? void 0 : a.call(n)) || "";
  return (t || []).map((r) => ({
    ...Ut(r, { active: s }),
    active: r.conversation_id === s
  }));
}
function Kn(t) {
  const { setItems: e, setHeadId: n } = t;
  return {
    readItems: () => t.itemsRef.current,
    readHeadId: () => t.headIdRef.current,
    appendExchange: ({ parentId: s, userId: a, assistantId: r, question: o, progress: d }) => {
      e((p) => [
        ...p,
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
function Wn(t) {
  const {
    jobId: e,
    documentId: n,
    enabled: s,
    refreshSessions: a,
    applyConversationTree: r,
    remoteRef: o,
    streamRef: d,
    itemsRef: p,
    documentIdRef: c,
    lastJobRef: w,
    persistReadyRef: g,
    switchTokenRef: C,
    sessionListGenerationRef: f,
    activeConversationIdRef: l,
    setItems: T,
    setHeadId: O,
    setSessions: k,
    setActiveConversationId: z,
    setSessionBusy: S
  } = t;
  U(() => {
    const v = o.current;
    if (!e) {
      f.current += 1, C.current += 1, T([]), O(null), k([]), z(""), d.current.clearMessages(), l.current = "", w.current = "", c.current = "", g.current = !1;
      return;
    }
    const P = w.current !== e;
    if (P && (f.current += 1, C.current += 1, w.current = e, g.current = !1, T([]), O(null), d.current.clearMessages(), k([]), z(""), l.current = "", c.current = "", S(!1)), !s || !v) {
      f.current += 1;
      return;
    }
    let m = !1;
    return (async () => {
      var A, h, N, $;
      let y = `${n || c.current || ""}`.trim();
      if (!y) {
        try {
          y = `${await ((A = v.getDocumentId) == null ? void 0 : A.call(v)) || ""}`.trim();
        } catch {
          y = "";
        }
        if (m) return;
      }
      y && (c.current = y);
      let M = null;
      if (!m && y && (M = await a(y)), !(P || !p.current.length) || m) {
        m || (g.current = !0);
        return;
      }
      const u = Ht({ jobId: e, documentId: y }) || `${((h = v.getConversationId) == null ? void 0 : h.call(v)) || ""}`.trim();
      if (u) {
        z(u), l.current = u, (N = v.setConversationId) == null || N.call(v, u, y);
        try {
          const R = await ze(u);
          if (m) return;
          const I = we(R.messages || []);
          if (I.length) {
            r(I, R.head_id), requestAnimationFrame(() => {
              m || (g.current = !0);
            });
            return;
          }
        } catch {
        }
      }
      if (!m && y)
        try {
          const R = M ?? await a(y);
          if (m || !R) return;
          const I = R[0];
          if (I != null && I.conversation_id) {
            const q = I.conversation_id;
            z(q), l.current = q, ($ = v.setConversationId) == null || $.call(v, q, y);
            try {
              const H = await ze(q);
              if (m) return;
              r(
                we(H.messages || []),
                H.head_id
              ), requestAnimationFrame(() => {
                m || (g.current = !0);
              });
              return;
            } catch {
            }
          }
        } catch {
        }
      if (m) return;
      const b = et({ jobId: e, documentId: y }, u);
      if (b != null && b.items.length) {
        const R = dt(b);
        T(R.items), O(R.headId), d.current.showMessages(ae(R.items, R.headId));
      } else
        T([]), O(null), d.current.clearMessages();
      requestAnimationFrame(() => {
        m || (g.current = !0);
      });
    })(), () => {
      m = !0, f.current += 1;
    };
  }, [e, n, s, a, r]);
}
function Un(t) {
  const {
    jobId: e,
    documentId: n,
    items: s,
    headId: a,
    activeConversationId: r,
    documentIdRef: o,
    persistReadyRef: d
  } = t;
  U(() => {
    if (!e || !d.current) return;
    const p = r, c = { jobId: e, documentId: n || o.current }, w = window.setTimeout(() => {
      if (!s.length) {
        fe(c, p);
        return;
      }
      xe(c, Te(s, a), p);
    }, 280);
    return () => window.clearTimeout(w);
  }, [e, n, s, a, r]);
}
function Hn(t) {
  const {
    jobId: e,
    documentId: n,
    sessionBusy: s,
    sessions: a,
    streamRef: r,
    remoteRef: o,
    itemsRef: d,
    headIdRef: p,
    activeConversationIdRef: c,
    documentIdRef: w,
    switchTokenRef: g,
    persistReadyRef: C,
    setSessionBusy: f,
    setSessionError: l,
    setActiveConversationId: T,
    setItems: O,
    setHeadId: k,
    setSessions: z,
    refreshSessions: S,
    applyConversationTree: v
  } = t, P = G(() => {
    var b, A;
    const u = `${((A = (b = o.current) == null ? void 0 : b.getConversationId) == null ? void 0 : A.call(b)) || ""}`.trim();
    u && T(u);
  }, []), m = G(async () => {
    var b, A;
    if (s) return;
    await r.current.stopStream(), ce(900), se(900), f(!0), l("");
    const u = ++g.current;
    try {
      if (await new Promise(($) => {
        window.setTimeout($, 40);
      }), u !== g.current) return;
      const h = o.current, N = w.current || `${await ((b = h == null ? void 0 : h.getDocumentId) == null ? void 0 : b.call(h)) || ""}`.trim();
      if (u !== g.current) return;
      w.current = N, (A = h == null ? void 0 : h.clearConversationId) == null || A.call(h, N), T(""), c.current = "", O([]), k(null), r.current.clearMessages(), fe({ jobId: e, documentId: N }), N && await S(N, u);
    } catch (h) {
      console.warn("[reader-ai] new session failed", h), l("无法创建新对话，请重试。");
    } finally {
      u === g.current && f(!1);
    }
  }, [e, S, s]), y = G(async (u) => {
    var $, R, I, q, H;
    const b = `${u || ""}`.trim();
    if (!b)
      return l("无法分支：消息 id 无效。"), !1;
    if (s)
      return l("请稍候，当前有会话操作进行中。"), !1;
    await r.current.stopStream();
    const A = Fn(d.current, b, p.current);
    if (!A.length)
      return l("无法分支：找不到到此答案的对话路径。"), !1;
    if (A[A.length - 1].message.role !== "assistant")
      return l("只能从助手答案处开新对话。"), !1;
    f(!0), l("");
    const N = ++g.current;
    try {
      if (await new Promise((j) => {
        window.setTimeout(j, 40);
      }), N !== g.current) return !1;
      const D = o.current;
      let B = w.current || `${await (($ = D == null ? void 0 : D.getDocumentId) == null ? void 0 : $.call(D)) || ""}`.trim();
      if (N !== g.current) return !1;
      if (w.current = B, !B)
        try {
          if (B = `${await ((R = D == null ? void 0 : D.getDocumentId) == null ? void 0 : R.call(D)) || ""}`.trim(), N !== g.current) return !1;
          w.current = B;
        } catch {
          B = "";
        }
      if (!B)
        return l("无法分支：文档未就绪，请稍后重试。"), !1;
      const _ = A.map((j, re) => ({
        id: j.message.id,
        role: j.message.role,
        content: j.message.content,
        citations: j.message.citations,
        parentId: re === 0 ? null : A[re - 1].message.id
      })), F = c.current || ((I = D == null ? void 0 : D.getConversationId) == null ? void 0 : I.call(D)) || "", Y = (a || []).find((j) => j.conversation_id === F), J = _.find((j) => j.role === "user"), de = `${(Y == null ? void 0 : Y.title) || ""}`.trim() || `${(J == null ? void 0 : J.content) || ""}`.replace(/\s+/g, " ").trim() || "未命名对话", Ce = (a || []).map((j) => j.title || ""), pe = Gt(de, Ce), te = await ue().forkFromPath({
        documentId: B,
        title: pe,
        path: _
      });
      if (N !== g.current) return !1;
      const K = Se(te.items), Q = ((q = K[K.length - 1]) == null ? void 0 : q.message.id) || null, V = te.conversation.conversation_id;
      if (!V || !K.length)
        throw new Error("fork returned empty conversation");
      return ce(600), se(600), O(K), k(Q), r.current.showMessages(ae(K, Q)), T(V), c.current = V, (H = D == null ? void 0 : D.setConversationId) == null || H.call(D, V, B), z((j) => {
        const re = {
          conversation_id: V,
          title: pe,
          document_id: B,
          created_at: te.conversation.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: te.conversation.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
          message_count: K.length,
          head_id: Q || ""
        }, ie = j.filter((le) => le.conversation_id !== V);
        return [re, ...ie];
      }), xe(
        { jobId: e, documentId: B },
        Te(K, Q),
        V
      ), await S(B, N), !0;
    } catch (D) {
      return console.warn("[reader-ai] branch from answer failed", D), N === g.current && l("分支失败：未能复制上文到新对话。请检查网络后重试。"), !1;
    } finally {
      N === g.current && f(!1);
    }
  }, [e, S, s, a]), M = G(async (u) => {
    var h, N, $, R;
    const b = `${u || ""}`.trim();
    if (!b || s) return;
    await r.current.stopStream(), f(!0), l("");
    const A = ++g.current;
    try {
      const I = o.current, q = w.current || `${await ((h = I == null ? void 0 : I.getDocumentId) == null ? void 0 : h.call(I)) || ""}`.trim();
      if (A !== g.current) return;
      w.current = q;
      try {
        await ue().delete(b);
      } catch (B) {
        if ((Number(B == null ? void 0 : B.status) || 0) !== 404) throw B;
      }
      fe({ jobId: e, documentId: q }, b);
      const D = (c.current || ((N = I == null ? void 0 : I.getConversationId) == null ? void 0 : N.call(I)) || "") === b;
      if (z((B) => B.filter((_) => _.conversation_id !== b)), D) {
        ($ = I == null ? void 0 : I.clearConversationId) == null || $.call(I, q), T(""), c.current = "", O([]), k(null), r.current.clearMessages(), fe({ jobId: e, documentId: q });
        const B = q ? await S(q, A) : [];
        if (A !== g.current || !B) return;
        const _ = B[0];
        if (_ != null && _.conversation_id) {
          const F = _.conversation_id;
          T(F), c.current = F;
          try {
            const Y = await ue().get(F);
            if (A !== g.current) return;
            v(
              we(Y.messages || []),
              Y.head_id
            ), (R = I == null ? void 0 : I.setConversationId) == null || R.call(I, F, q);
          } catch {
            O([]), k(null);
          }
        }
      } else q && await S(q, A);
    } catch (I) {
      console.warn("[reader-ai] delete session failed", I), l("删除对话失败，请重试。");
    } finally {
      A === g.current && f(!1);
    }
  }, [v, e, S, s]), x = G(async (u, b) => {
    const A = `${u || ""}`.trim(), h = `${b || ""}`.replace(/\s+/g, " ").trim();
    if (!A || !h || s) return;
    f(!0), l("");
    const N = ++g.current;
    try {
      const $ = h.slice(0, 80);
      if (await ue().patch(A, { title: $ }), N !== g.current) return;
      z(
        (I) => I.map(
          (q) => q.conversation_id === A ? { ...q, title: $ } : q
        )
      );
      const R = w.current;
      R && await S(R, N);
    } catch ($) {
      console.warn("[reader-ai] rename session failed", $), l("重命名失败，请重试。");
    } finally {
      N === g.current && f(!1);
    }
  }, [S, s]);
  return {
    adoptRemoteConversationId: P,
    newSession: m,
    branchFromAnswer: y,
    removeSession: M,
    renameSession: x
  };
}
function Gn(t) {
  var pe;
  const {
    jobId: e,
    documentId: n = "",
    enabled: s,
    remoteAnswerer: a = null,
    stream: r = zn
  } = t, [o, d] = W([]), [p, c] = W(null), [w, g] = W([]), [C, f] = W(""), [l, T] = W(!1), [O, k] = W(""), z = L(o), S = L(p), v = L(C), P = L(!1), m = L(""), y = L(""), M = L(0), x = L(0), u = L(r);
  u.current = r;
  const b = L(a);
  b.current = a, z.current = o, S.current = p, v.current = C;
  const A = G(async (te = "", K) => {
    const Q = `${te || y.current || ""}`.trim(), V = ++x.current;
    if (!Q)
      return V === x.current && (K === void 0 || K === M.current) && g([]), [];
    try {
      const j = ue();
      if (!j) return null;
      const ie = (await j.list({ document_id: Q, limit: 50 })).conversations || [];
      return V === x.current && Q === `${y.current || ""}`.trim() && (K === void 0 || K === M.current) ? (g(ie), ie) : null;
    } catch {
      return null;
    }
  }, []), h = G((te, K) => {
    var j;
    const Q = Se(te), V = `${K || ""}`.trim() || ((j = Q[Q.length - 1]) == null ? void 0 : j.message.id) || null;
    d(Q), c(V), u.current.showMessages(ae(Q, V));
  }, []), N = G(() => `${n || y.current || e}`.trim(), [n, e]);
  Wn({
    jobId: e,
    documentId: n,
    enabled: s,
    refreshSessions: A,
    applyConversationTree: h,
    remoteRef: b,
    streamRef: u,
    itemsRef: z,
    documentIdRef: y,
    lastJobRef: m,
    persistReadyRef: P,
    switchTokenRef: M,
    sessionListGenerationRef: x,
    activeConversationIdRef: v,
    setItems: d,
    setHeadId: c,
    setSessions: g,
    setActiveConversationId: f,
    setSessionBusy: T
  }), Un({
    jobId: e,
    documentId: n,
    items: o,
    headId: p,
    activeConversationId: C,
    documentIdRef: y,
    persistReadyRef: P
  });
  const $ = X(
    () => ae(o, p),
    [o, p]
  ), R = X(
    () => qn(o),
    [o]
  ), I = X(
    () => Bn(o),
    [o]
  ), q = X(
    () => Ln(o),
    [o]
  ), H = X(() => Kn({ setItems: d, setHeadId: c, itemsRef: z, headIdRef: S }), []), {
    adoptRemoteConversationId: D,
    newSession: B,
    branchFromAnswer: _,
    removeSession: F,
    renameSession: Y
  } = Hn({
    jobId: e,
    documentId: n,
    sessionBusy: l,
    sessions: w,
    streamRef: u,
    remoteRef: b,
    itemsRef: z,
    headIdRef: S,
    activeConversationIdRef: v,
    documentIdRef: y,
    switchTokenRef: M,
    persistReadyRef: P,
    setSessionBusy: T,
    setSessionError: k,
    setActiveConversationId: f,
    setItems: d,
    setHeadId: c,
    setSessions: g,
    refreshSessions: A,
    applyConversationTree: h
  }), J = G(async (te) => {
    var j, re, ie, le, $e, Ee, Pe, Oe;
    const K = `${te || ""}`.trim(), Q = v.current || ((re = (j = b.current) == null ? void 0 : j.getConversationId) == null ? void 0 : re.call(j)) || "";
    if (!K || K === Q || l) return;
    await u.current.stopStream(), ce(1200), se(1200), T(!0), k("");
    const V = ++M.current;
    P.current = !1, f(K), v.current = K, d([]), c(null), u.current.clearMessages();
    try {
      if (await new Promise((ge) => {
        window.setTimeout(ge, 80);
      }), V !== M.current) return;
      try {
        ($e = (le = (ie = globalThis.document) == null ? void 0 : ie.activeElement) == null ? void 0 : le.blur) == null || $e.call(le);
      } catch {
      }
      const Z = b.current, ee = y.current || `${await ((Ee = Z == null ? void 0 : Z.getDocumentId) == null ? void 0 : Ee.call(Z)) || ""}`.trim();
      if (V !== M.current) return;
      y.current = ee;
      const oe = ue();
      if (!oe) throw new Error("Reader conversations unavailable");
      const Me = await oe.get(K);
      if (V !== M.current) return;
      ce(800), se(800);
      const Ne = we(Me.messages || []);
      if (h(Ne, Me.head_id), (Pe = Z == null ? void 0 : Z.setConversationId) == null || Pe.call(Z, K, ee), P.current = !0, Ne.length) {
        const ge = Se(Ne);
        xe(
          { jobId: e, documentId: ee },
          Te(
            ge,
            `${Me.head_id || ""}`.trim() || ((Oe = ge.at(-1)) == null ? void 0 : Oe.message.id) || null
          ),
          K
        );
      } else
        fe({ jobId: e, documentId: ee }, K);
      ee && await A(ee, V), ce(350), se(350);
    } catch (Z) {
      if (console.warn("[reader-ai] switch session failed", Z), V === M.current) {
        k("加载该对话失败，请检查网络后重试。");
        const ee = et(
          { jobId: e, documentId: n || y.current },
          K
        );
        if (ee != null && ee.items.length) {
          const oe = dt(ee);
          d(oe.items), c(oe.headId), u.current.showMessages(ae(oe.items, oe.headId));
        } else
          d([]), c(null);
        P.current = !0;
      }
    } finally {
      V === M.current && T(!1);
    }
  }, [
    h,
    e,
    n,
    A,
    l
  ]), de = X(
    () => jn(w, C, a),
    [w, C, a]
  ), Ce = X(() => ({
    refreshSessions: A,
    adoptRemoteConversationId: D,
    newSession: B,
    switchSession: J,
    removeSession: F,
    renameSession: Y,
    branchFromAnswer: _
  }), [
    A,
    D,
    B,
    J,
    F,
    Y,
    _
  ]);
  return {
    items: o,
    headId: p,
    messages: $,
    citationsByMessageId: R,
    progressByMessageId: I,
    contentByMessageId: q,
    sessions: de,
    activeConversationId: C || ((pe = a == null ? void 0 : a.getConversationId) == null ? void 0 : pe.call(a)) || "",
    sessionBusy: l,
    sessionError: O,
    resolveRequestScopeKey: N,
    tree: H,
    sessionCommands: Ce
  };
}
const Vn = "retainpdf.reader.ai.request.v1:", Yn = Object.freeze({
  assistantMode: "reading",
  scope: "document",
  context: null
});
function lt(t, e) {
  return `${Vn}${`${t || ""}`.trim()}:${`${e || ""}`.trim()}`;
}
function Jn(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return null;
  const e = t, n = e.assistantMode === "operations" ? "operations" : e.assistantMode === "reading" ? "reading" : null, s = e.scope === "selection" || e.scope === "page" || e.scope === "document" ? e.scope : null;
  if (!n || !s) return null;
  const a = e.context && typeof e.context == "object" && !Array.isArray(e.context) ? { ...e.context } : null;
  return { assistantMode: n, scope: s, context: a };
}
function je(t, e, n) {
  var r;
  const s = `${t || ""}`.trim(), a = `${e || ""}`.trim();
  if (!(!s || !a))
    try {
      (r = globalThis.localStorage) == null || r.setItem(
        lt(s, a),
        JSON.stringify(n)
      );
    } catch {
    }
}
function Ke(t, e) {
  var a;
  const n = `${t || ""}`.trim(), s = `${e || ""}`.trim();
  if (!n || !s) return null;
  try {
    const r = (a = globalThis.localStorage) == null ? void 0 : a.getItem(lt(n, s));
    return r ? Jn(JSON.parse(r)) : null;
  } catch {
    return null;
  }
}
function Qn(t) {
  const e = `${t.scopeKey || ""}`.trim(), n = `${t.jobId || ""}`.trim(), s = `${t.assistantMessageId || ""}`.trim();
  return Ke(e, s) || (e !== n ? Ke(n, s) : null) || Yn;
}
function Xn(t) {
  const { assistantMode: e, selectionContext: n } = t;
  return e === "operations" ? { assistantMode: e, scope: "document", context: null } : n ? { assistantMode: e, scope: "selection", context: { ...n } } : { assistantMode: e, scope: "document", context: null };
}
function Zn(t) {
  var P;
  const { jobId: e, assistantMode: n, selectionContext: s = null, tree: a, chat: r, getScopeKey: o } = t, d = L(a);
  d.current = a;
  const p = L(r);
  p.current = r;
  const c = L(n);
  c.current = n;
  const w = L(s);
  w.current = s;
  const g = L(o);
  g.current = o;
  const C = r.status, f = C === "submitted" || C === "streaming", l = L(f);
  l.current = f;
  const T = f ? `${((P = Pn(r.messages)) == null ? void 0 : P.id) || ""}` : "", O = r.messages, k = r.error;
  U(() => {
    if (!O.length) return;
    const m = new Map(O.map((M) => [M.id, M])), y = /* @__PURE__ */ new Map();
    for (const [M, x] of m)
      y.set(M, $n(x));
    d.current.mergeChatMirror(y);
  }, [O]), U(() => {
    !k || C !== "error" || d.current.markRunningAsError(k.message);
  }, [k, C]);
  const z = G(async (m) => {
    if (l.current) return;
    const y = `${m || ""}`.trim();
    if (!y) return;
    const M = d.current, x = p.current, u = c.current, b = w.current, A = g.current(), h = M.readHeadId(), N = ke("u"), $ = ke("a"), R = Xn({
      assistantMode: u,
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
        quoteText: Ze(b.region, b.pane)
      } : null
    });
    je(A, $, R), M.appendExchange({
      parentId: h,
      userId: N,
      assistantId: $,
      question: y,
      progress: R.assistantMode === "operations" ? "正在规划 PDF 操作…" : "正在理解文档…"
    }), await x.sendUserMessage(
      { id: N, role: "user", parts: [{ type: "text", text: y }] },
      {
        body: {
          assistantMessageId: $,
          assistantMode: R.assistantMode,
          parentId: h,
          question: y,
          regenerate: !1,
          userMessageId: N,
          scope: R.scope,
          context: R.context
        }
      }
    );
  }, []), S = G(async (m) => {
    if (l.current) return;
    const y = d.current, M = p.current, x = y.readItems(), u = x.find(
      (H) => H.message.id === m && H.message.role === "assistant"
    ), b = (u == null ? void 0 : u.parentId) ?? null, A = b ? On(x, b) : null;
    let h = "", N = b;
    if ((A == null ? void 0 : A.role) === "user")
      h = A.content.trim();
    else {
      const H = ae(x, b ?? y.readHeadId());
      for (let D = H.length - 1; D >= 0; D -= 1)
        if (H[D].role === "user") {
          h = H[D].content.trim(), N = H[D].id;
          break;
        }
    }
    if (!h) return;
    const $ = ke("a"), R = N || b, I = g.current(), q = Qn({
      scopeKey: I,
      jobId: e,
      assistantMessageId: m
    });
    je(I, $, q), y.appendRetryTurn({ assistantId: $, branchParent: R }), M.replaceVisible(ct(ae(x, m))), await M.regenerateFrom({
      messageId: m,
      body: {
        assistantMessageId: $,
        assistantMode: q.assistantMode,
        parentId: R,
        question: h,
        regenerate: !0,
        userMessageId: N || "",
        scope: q.scope,
        context: q.context
      }
    });
  }, [e]), v = G(async () => {
    await p.current.stopStream(), d.current.markRunningCancelled();
  }, []);
  return {
    isRunning: f,
    streamingAssistantId: T,
    submitQuestion: z,
    retryAnswer: S,
    cancelAnswer: v
  };
}
const er = "retainpdf.reader-agent-operation.action-key.v1:", tr = "reader-";
function We(t, e) {
  return Jt(t, e);
}
function nr(t) {
  return Yt(t);
}
function rr(t, e) {
  return Vt(t, e);
}
function sr(t) {
  return Qt(t);
}
function ar(t) {
  return Xt(t);
}
function ir({
  conversationId: t,
  enabled: e,
  discovering: n,
  signal: s,
  confirmationModeHint: a,
  onDocumentCommitted: r
}) {
  const [o, d] = W({}), [p, c] = W("explicit"), [w, g] = W(!1), [C, f] = W(!1), l = L(/* @__PURE__ */ new Set()), T = L(/* @__PURE__ */ new Set()), O = L(/* @__PURE__ */ new Set()), k = G((m, y = !1) => {
    m != null && m.operation_id && d((M) => {
      const x = M[m.operation_id];
      return rr(x == null ? void 0 : x.operation, m) ? {
        ...M,
        [m.operation_id]: {
          ...x,
          operation: m,
          pendingAction: void 0,
          error: void 0
        }
      } : !y || !(x != null && x.pendingAction) ? M : {
        ...M,
        [m.operation_id]: { ...x, pendingAction: void 0 }
      };
    });
  }, []), z = G(async (m, y = !1) => {
    const M = `${m || ""}`.trim(), x = `refresh:${M}`;
    if (!(!M || l.current.has(x))) {
      l.current.add(x);
      try {
        const u = me();
        if (!u) return;
        k(await u.get(M), y);
      } catch {
      } finally {
        l.current.delete(x);
      }
    }
  }, [k]), S = G(async () => {
    const m = `${t || ""}`.trim(), y = `recover:${m}`;
    if (!(!e || !m || l.current.has(y))) {
      l.current.add(y);
      try {
        const M = me();
        if (!M) return;
        const x = await M.list(m, {});
        if (!O.current.has(m)) {
          for (const u of x.operations || [])
            u.status === "committed" && T.current.add(u.operation_id);
          O.current.add(m);
        }
        for (const u of x.operations || []) k(u);
      } catch {
      } finally {
        l.current.delete(y);
      }
    }
  }, [t, e, k]);
  U(() => {
    if (!e) return;
    let m = !1;
    const y = async () => {
      try {
        const x = me();
        if (!x) return;
        const u = await x.fetchRuntimeConfig();
        if (m) return;
        c(u.agent_confirmation_mode || "explicit"), f(!!u.llm_api_key_configured), g(
          u.restart_required || u.restart_state === "pending" || u.active_revision !== u.configured_revision
        );
      } catch {
        m || (g(!1), f(!1));
      }
    };
    y();
    const M = window.setInterval(y, 3e3);
    return () => {
      m = !0, window.clearInterval(M);
    };
  }, [e]), U(() => {
    a && c(a);
  }, [a]), U(() => {
    s != null && s.confirmationMode && c(s.confirmationMode), s != null && s.operationId && z(s.operationId);
  }, [z, s]), U(() => {
    S();
  }, [S]), U(() => {
    n || S();
  }, [n, S]);
  const v = X(
    () => Object.values(o).filter((m) => !!t && m.operation.conversation_id === t).sort((m, y) => `${m.operation.created_at || ""}`.localeCompare(`${y.operation.created_at || ""}`)),
    [t, o]
  );
  U(() => {
    var m;
    for (const y of v) {
      const M = y.operation;
      M.status !== "committed" || T.current.has(M.operation_id) || (T.current.add(M.operation_id), r == null || r({
        documentId: M.document_id,
        revision: ((m = M.candidate) == null ? void 0 : m.version_id) || `${M.updated_at || ""}` || `${M.operation_id}:${nr(M)}`
      }));
    }
  }, [v, r]);
  const P = v.some((m) => We(m.operation.status, p));
  return U(() => {
    if (!e || !t || !n && !P) return;
    const m = window.setInterval(() => {
      S();
      for (const y of v)
        We(y.operation.status, p) && z(y.operation.operation_id);
    }, 1400);
    return () => window.clearInterval(m);
  }, [p, t, n, e, v, P, S, z]), U(() => {
    if (!e) return;
    const m = () => void S(), y = () => {
      document.visibilityState === "visible" && m();
    };
    return window.addEventListener("online", m), document.addEventListener("visibilitychange", y), () => {
      window.removeEventListener("online", m), document.removeEventListener("visibilitychange", y);
    };
  }, [e, S]), {
    entries: v,
    confirmationMode: p,
    runtimeRestarting: w,
    runtimeCredentialConfigured: C,
    setEntriesById: d,
    inFlightRef: l,
    upsert: k,
    refresh: z
  };
}
function or() {
  try {
    return globalThis.sessionStorage;
  } catch {
    return;
  }
}
function ut() {
  return {
    storagePrefix: er,
    keyPrefix: tr,
    storage: or()
  };
}
function cr(t, e, n) {
  return Zt(t, e, n, ut());
}
function Ue(t, e, n) {
  en(t, e, n, ut());
}
function dr({
  refresh: t,
  upsert: e,
  setEntriesById: n,
  inFlightRef: s
}) {
  const a = L(/* @__PURE__ */ new Map());
  return { perform: G(async (o, d, p = {}) => {
    const c = `${d.operation_id || ""}`.trim(), w = `action:${c}`;
    if (!c || s.current.has(w)) return;
    if (o === "retry" && d.status === "ambiguous" && p.acceptDuplicateRisk !== !0) {
      n((f) => ({
        ...f,
        [c]: {
          ...f[c],
          error: "请先确认重复执行风险，再重新执行操作。"
        }
      }));
      return;
    }
    const g = cr(c, o, a.current);
    s.current.add(w), n((f) => ({
      ...f,
      [c]: { ...f[c], pendingAction: o, error: void 0 }
    }));
    const C = {
      idempotency_key: g,
      expected_status: d.status,
      expected_attempt: d.current_attempt,
      expected_program_sha256: d.program_sha256 || ""
    };
    try {
      const f = me();
      if (!f) throw new Error("Reader AI operations unavailable");
      let l;
      o === "run" ? l = await f.run(c, C) : o === "cancel" ? l = await f.cancel(c, { ...C, reason: "user_rejected" }) : o === "commit" ? l = await f.commit(c, C) : l = await f.retry(c, p.acceptDuplicateRisk ? { ...C, accept_duplicate_risk: !0 } : C), Ue(c, o, a.current), e(l, !0);
    } catch (f) {
      sr(f) === 409 ? (Ue(c, o, a.current), await t(c, !0)) : n((l) => ({
        ...l,
        [c]: {
          ...l[c],
          pendingAction: void 0,
          error: ar(f)
        }
      }));
    } finally {
      s.current.delete(w);
    }
  }, [t, e]) };
}
function lr({
  conversationId: t,
  enabled: e,
  discovering: n,
  signal: s,
  confirmationModeHint: a,
  onDocumentCommitted: r
}) {
  const o = ir({
    conversationId: t,
    enabled: e,
    discovering: n,
    signal: s,
    confirmationModeHint: a,
    onDocumentCommitted: r
  }), { perform: d } = dr({
    refresh: o.refresh,
    upsert: o.upsert,
    setEntriesById: o.setEntriesById,
    inFlightRef: o.inFlightRef
  }), p = G((c) => {
    var w;
    return ((w = me()) == null ? void 0 : w.fetchCandidate(c.operation_id)) ?? Promise.reject(new Error("Reader AI operations unavailable"));
  }, []);
  return {
    entries: o.entries,
    confirmationMode: o.confirmationMode,
    runtimeRestarting: o.runtimeRestarting,
    runtimeCredentialConfigured: o.runtimeCredentialConfigured,
    perform: d,
    loadCandidate: p
  };
}
function ur(t) {
  var x;
  const {
    jobId: e,
    documentId: n = "",
    sessionIdentity: s = "",
    enabled: a,
    selectionContext: r = null,
    onDocumentCommitted: o
  } = t, d = `${e}\0${n}\0${s}`, [p, c] = W("reading"), [w, g] = W(null), [C, f] = W();
  U(() => {
    c("reading"), g(null), f(void 0);
  }, [d]);
  const l = X(() => {
    var u;
    return !a || !e ? null : ((u = De()) == null ? void 0 : u.createRemoteAnswerer({ jobId: e, documentId: n })) ?? Tt({ jobId: e, documentId: n });
  }, [n, a, e]), T = X(() => {
    var u;
    return !a || !e ? null : ((u = De()) == null ? void 0 : u.createLocalAnswerer({ jobId: e })) ?? Kt({
      loadMarkdownPayload: $t.loadMarkdownPayload
    });
  }, [a, e]), O = L(null), k = En({
    jobId: e,
    enabled: a,
    remoteAnswerer: l,
    localAnswerer: T,
    assistantMode: p,
    onAgentOperationSignal: (u) => {
      g({ ...u, nonce: Date.now() + Math.random() });
    },
    onConfirmationMode: f,
    onStopped: () => {
      var u;
      return (u = O.current) == null ? void 0 : u.markRunningCancelled();
    }
  }), z = X(() => ({
    messages: k.messages,
    status: k.status,
    error: k.error,
    sendUserMessage: (u, b) => k.sendMessage(
      u,
      b
    ),
    regenerateFrom: (u) => k.regenerate(
      u
    ),
    stopStream: () => k.stop(),
    replaceVisible: (u) => k.setMessages([...u])
  }), [k]), S = X(() => ({
    stopStream: () => z.stopStream(),
    clearMessages: () => z.replaceVisible([]),
    showMessages: (u) => z.replaceVisible(ct(u))
  }), [z]), v = Gn({
    jobId: e,
    documentId: n,
    enabled: a,
    remoteAnswerer: l,
    stream: S
  });
  O.current = v.tree;
  const P = Zn({
    jobId: e,
    assistantMode: p,
    selectionContext: r,
    tree: v.tree,
    chat: z,
    getScopeKey: () => v.resolveRequestScopeKey()
  }), m = v.activeConversationId || (w == null ? void 0 : w.conversationId) || `${((x = l == null ? void 0 : l.getConversationId) == null ? void 0 : x.call(l)) || ""}`.trim(), y = lr({
    conversationId: m,
    enabled: a,
    discovering: P.isRunning,
    signal: w,
    confirmationModeHint: C,
    onDocumentCommitted: o
  }), M = L(!1);
  return U(() => {
    M.current = !1;
  }, [e]), U(() => {
    M.current = !1;
  }, [d]), U(() => {
    M.current && !P.isRunning && (v.sessionCommands.refreshSessions(), v.sessionCommands.adoptRemoteConversationId()), M.current = P.isRunning;
  }, [v, P.isRunning]), {
    citationsByMessageId: v.citationsByMessageId,
    progressByMessageId: v.progressByMessageId,
    contentByMessageId: v.contentByMessageId,
    streamingAssistantId: P.streamingAssistantId,
    isRunning: P.isRunning,
    messages: v.messages,
    sessions: v.sessions,
    activeConversationId: v.activeConversationId,
    sessionBusy: v.sessionBusy,
    sessionError: v.sessionError,
    submitQuestion: P.submitQuestion,
    retryAnswer: P.retryAnswer,
    cancelAnswer: P.cancelAnswer,
    newSession: v.sessionCommands.newSession,
    switchSession: v.sessionCommands.switchSession,
    removeSession: v.sessionCommands.removeSession,
    renameSession: v.sessionCommands.renameSession,
    branchFromAnswer: v.sessionCommands.branchFromAnswer,
    agentOperations: y,
    assistantMode: p,
    setAssistantMode: c
  };
}
function Sr({
  open: t,
  jobId: e,
  documentId: n = "",
  sessionIdentity: s = "",
  onClose: a,
  onJumpCitation: r,
  onDocumentCommitted: o,
  layout: d = "floating",
  side: p = "right",
  selectionContext: c = null,
  onClearSelectionContext: w
}) {
  const g = t && !!e, {
    citationsByMessageId: C,
    progressByMessageId: f,
    contentByMessageId: l,
    streamingAssistantId: T,
    isRunning: O,
    sessions: k,
    activeConversationId: z,
    sessionBusy: S,
    sessionError: v,
    messages: P,
    submitQuestion: m,
    retryAnswer: y,
    cancelAnswer: M,
    newSession: x,
    switchSession: u,
    removeSession: b,
    renameSession: A,
    branchFromAnswer: h,
    agentOperations: N,
    assistantMode: $,
    setAssistantMode: R
  } = ur({
    jobId: e,
    documentId: n,
    sessionIdentity: s,
    enabled: g,
    selectionContext: c,
    onDocumentCommitted: o
  }), [I, q] = W(""), H = G(async (B) => {
    q(""), await h(B) && (q(
      "已保存新对话（fork-n-原名）：复制了到此答案的上文，原对话不变。顶部列表可切换。"
    ), window.setTimeout(() => q(""), 6e3));
  }, [h]), D = G((B) => {
    r(B);
  }, [r]);
  return /* @__PURE__ */ i(
    Et,
    {
      id: "reader-ai-panel",
      open: t,
      title: "RetainPDF AI",
      titleIcon: /* @__PURE__ */ i(he, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.ai-float.pos.v2",
      ariaLabel: "阅读问答",
      width: 420,
      placement: d === "workspace" ? "workspace" : d === "docked" ? "dock-right" : "floating",
      showHeader: d !== "workspace",
      className: `reader-float-ai is-${d}${d === "workspace" ? ` is-pane-${p}` : ""}${S ? " is-session-busy" : ""}`,
      onClose: a,
      children: e ? /* @__PURE__ */ E("div", { className: "reader-float-ai-body", children: [
        /* @__PURE__ */ i(
          kn,
          {
            sessions: k,
            activeId: z,
            busy: S,
            errorText: v,
            onSwitch: u,
            onNew: x,
            onDelete: b,
            onRename: A
          }
        ),
        I ? /* @__PURE__ */ i("div", { className: "aui-session-banner", role: "status", children: I }) : null,
        /* @__PURE__ */ i("div", { className: "reader-float-ai-thread-wrap", "aria-busy": S || void 0, children: /* @__PURE__ */ i(
          _n,
          {
            jobId: e,
            messages: P,
            citationsByMessageId: C,
            progressByMessageId: f,
            contentByMessageId: l,
            streamingAssistantId: T,
            isRunning: O,
            onSubmit: m,
            onRetry: y,
            onCancel: M,
            onJumpCitation: D,
            onBranchFromAnswer: H,
            branchBusy: S,
            agentOperations: N,
            assistantMode: $,
            onAssistantModeChange: R,
            selectionContext: c,
            onClearSelectionContext: w
          }
        ) })
      ] }) : /* @__PURE__ */ E("div", { className: "reader-float-ai-empty", children: [
        /* @__PURE__ */ i(he, { size: 22, strokeWidth: 1.75, "aria-hidden": !0 }),
        /* @__PURE__ */ i("p", { children: "当前文档还没有可用于 AI 的解析产物" }),
        /* @__PURE__ */ i("span", { children: "请先完成 OCR 文档解析" })
      ] })
    }
  );
}
export {
  Sr as ReaderAiPanel
};
//# sourceMappingURL=ReaderAiPanel-C6zV4fnI.js.map
