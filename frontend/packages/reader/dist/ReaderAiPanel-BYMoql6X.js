import { jsx as i, jsxs as x, Fragment as be } from "react/jsx-runtime";
import { useState as W, useRef as B, useEffect as U, useMemo as J, useCallback as H, useId as pt } from "react";
import { Square as mt, ArrowUp as ft, Copy as ht, GitBranch as gt, RefreshCw as yt, Sigma as He, Table2 as wt, Image as vt, Type as It, X as Re, BookOpen as Ge, Sparkles as ge, Loader2 as Ce, FileText as Se, ArrowDown as Ve, Quote as bt, ListTree as Rt, FlaskConical as Ct, ShieldCheck as Nt, Bot as Mt, ChevronUp as _t, ChevronDown as Ye, TriangleAlert as Qe, ExternalLink as kt, Check as Je, Circle as St, Plus as At, Pencil as Tt, Trash2 as $t } from "lucide-react";
import { g as me, h as fe, i as De, j as xt, d as Et, b as Pt } from "./ReaderApp-DmpnN2it.js";
import { ThreadPrimitive as se, ComposerPrimitive as we, MessagePrimitive as Xe, ActionBarPrimitive as _e, useAui as Ot, SelectionToolbarPrimitive as Dt, useExternalStoreRuntime as Ft, AssistantRuntimeProvider as zt } from "@assistant-ui/react";
import { A as qt } from "./AiMarkdownAnswer-BKvhvx2o.js";
import { r as Ze } from "./reader-regions-DsePY7B_.js";
import { M as Bt, C as Fe, h as Lt } from "./config-CgaWliJ_.js";
import { b as ue, n as oe, q as jt } from "./answer-enhance-D8zK9znw.js";
import { b as Kt, m as Wt, s as Ut, l as et, c as he, d as Te, a as Ht } from "./answer-quote-Div0HO_p.js";
import { Chat as Gt, useChat as Vt } from "@ai-sdk/react";
import { describeToolEvent as Yt } from "@retainpdf/domain/ai";
import { toSessionSummary as Qt } from "@retainpdf/domain/session";
import { l as Jt } from "./ask-answerer-GNQdzitl.js";
import { getConversation as ze, messagesToBranchItems as Ie, nextForkConversationTitle as Xt } from "@retainpdf/api/conversations";
import { c as ke } from "./ai-chat-ZSCffLDD.js";
import { agentOperationShouldReplace as Zt, agentOperationEventSeq as en, agentOperationShouldPoll as tn, agentOperationErrorStatus as nn, agentOperationErrorMessage as rn, resolveAgentOperationActionKey as sn, clearAgentOperationActionKey as an } from "@retainpdf/api/agent-operation-model";
function tt(t) {
  return t.content.filter((e) => e.type === "text").map((e) => e.text).join(`
`).trim();
}
function qe({ label: t }) {
  return /* @__PURE__ */ x("div", { className: "aui-thinking", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ i(Ce, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
    /* @__PURE__ */ i("span", { children: t || "思考中…" })
  ] });
}
function on({ message: t }) {
  return /* @__PURE__ */ i(Xe.Root, { className: "aui-msg aui-msg-user", "data-role": "user", children: /* @__PURE__ */ i("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ i("div", { className: "aui-md-plain", children: tt(t) }) }) });
}
function cn({
  jobId: t,
  message: e,
  citations: n,
  progress: s,
  streaming: a,
  branchBusy: r,
  onJumpCitation: o,
  onBranchFromAnswer: c
}) {
  const m = tt(e);
  return /* @__PURE__ */ i(Xe.Root, { className: "aui-msg aui-msg-assistant", "data-role": "assistant", children: /* @__PURE__ */ x("div", { className: "aui-msg-stack", children: [
    a && s ? /* @__PURE__ */ i(qe, { label: s }) : null,
    a && !s && !m ? /* @__PURE__ */ i(qe, { label: "思考中…" }) : null,
    m ? /* @__PURE__ */ i("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ i(
      qt,
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
    /* @__PURE__ */ x(
      _e.Root,
      {
        className: "aui-msg-actions",
        "data-reader-ai-actions": "",
        hideWhenRunning: !0,
        autohide: "not-last",
        children: [
          /* @__PURE__ */ i(_e.Copy, { className: "aui-action-btn", "aria-label": "复制答案", title: "复制答案", children: /* @__PURE__ */ i(ht, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }) }),
          c ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "aui-action-btn aui-action-btn-branch",
              "aria-label": "从这里开新对话",
              title: "从这里开新对话",
              disabled: r,
              onClick: async () => {
                ue(1200, { overlayDelayMs: 0 }), oe(1200), await c(e.id);
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
  onBranchFromAnswer: c
}) {
  return /* @__PURE__ */ i("div", { className: "aui-message-group", "data-slot": "aui_message-group", children: /* @__PURE__ */ i(se.Messages, { children: ({ message: m }) => {
    var v;
    if (m.role === "user") return /* @__PURE__ */ i(on, { message: m });
    if (m.role !== "assistant") return null;
    const d = ((v = m.status) == null ? void 0 : v.type) === "running" || a && s === m.id;
    return /* @__PURE__ */ i(
      cn,
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
function dn({
  mode: t,
  disabled: e,
  onChange: n
}) {
  return /* @__PURE__ */ x("div", { className: "aui-assistant-mode", role: "group", "aria-label": "AI 模式", children: [
    /* @__PURE__ */ x(
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
    /* @__PURE__ */ x(
      "button",
      {
        type: "button",
        className: t === "operations" ? "is-active" : "",
        "aria-pressed": t === "operations",
        disabled: e,
        onClick: () => n == null ? void 0 : n("operations"),
        children: [
          /* @__PURE__ */ i(ge, { size: 12, strokeWidth: 2.2, "aria-hidden": !0 }),
          /* @__PURE__ */ i("span", { children: "PDF Agent" })
        ]
      }
    )
  ] });
}
function ln({
  selectionContext: t,
  onClear: e
}) {
  if (!t) return null;
  const n = t.selectionType === "text" ? "text" : t.kind, s = t.selectionType === "text" ? t.quote : Ze(t.region, t.pane), a = n === "formula" ? "公式" : n === "table" ? "表格" : n === "figure" ? "图片" : "文字";
  return /* @__PURE__ */ x("div", { className: "aui-selection-context", "data-reader-ai-selection-context": "", children: [
    /* @__PURE__ */ i(n === "formula" ? He : n === "table" ? wt : n === "figure" ? vt : It, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
    /* @__PURE__ */ x("span", { className: "aui-selection-context-meta", children: [
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
        children: /* @__PURE__ */ i(Re, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
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
  return /* @__PURE__ */ x(we.Root, { className: "aui-composer", "data-reader-ai-composer": "", children: [
    /* @__PURE__ */ x("div", { className: "aui-composer-shell", children: [
      n !== "operations" ? /* @__PURE__ */ i(ln, { selectionContext: a, onClear: r }) : null,
      /* @__PURE__ */ i(
        we.Input,
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
      /* @__PURE__ */ x("div", { className: "aui-composer-toolbar", children: [
        /* @__PURE__ */ i(dn, { mode: n, disabled: t || e, onChange: s }),
        /* @__PURE__ */ i("div", { className: "aui-composer-actions", children: t ? /* @__PURE__ */ i(we.Cancel, { className: "aui-send aui-send-stop", "aria-label": "停止生成", children: /* @__PURE__ */ i(mt, { size: 12, strokeWidth: 2.6, "aria-hidden": !0 }) }) : /* @__PURE__ */ i(we.Send, { className: "aui-send", "aria-label": "发送", children: /* @__PURE__ */ i(ft, { size: 16, strokeWidth: 2.5, "aria-hidden": !0 }) }) })
      ] })
    ] }),
    /* @__PURE__ */ i("p", { className: "aui-hint", children: "AI 可能会出错，请核对原文与引用" })
  ] });
}
function st() {
  return /* @__PURE__ */ x("div", { className: "aui-composer aui-composer-locked", role: "alert", children: [
    /* @__PURE__ */ i("p", { className: "aui-llm-lock-msg", children: Bt }),
    /* @__PURE__ */ i("p", { className: "aui-hint", children: "请到首页「设置 → API 设置」填写模型 Key 后即可提问" })
  ] });
}
const un = [
  { prompt: "把第 1 页旋转 90 度。", label: "旋转页面", icon: Se },
  { prompt: "删除最后一页。", label: "删除页面", icon: Se }
];
function pn({
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
  onJumpCitation: w,
  onBranchFromAnswer: C
}) {
  const f = c || m;
  return /* @__PURE__ */ x(be, { children: [
    e ? /* @__PURE__ */ x("div", { className: "aui-empty", children: [
      /* @__PURE__ */ i("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ i("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ i(ge, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ i("h2", { className: "aui-empty-title", children: "想怎样处理 PDF？" }),
      /* @__PURE__ */ i("p", { className: "aui-empty-sub", children: "创建候选版本后由你预览和确认" }),
      /* @__PURE__ */ i("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: un.map((u) => {
        const E = u.icon;
        return /* @__PURE__ */ x(
          se.Suggestion,
          {
            prompt: u.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: f || o,
            children: [
              /* @__PURE__ */ i(E, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
              /* @__PURE__ */ i("span", { className: "aui-suggestion-label", children: u.label })
            ]
          },
          u.prompt
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
        branchBusy: c,
        onJumpCitation: w,
        onBranchFromAnswer: C
      }
    ),
    d,
    /* @__PURE__ */ x(se.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !c ? /* @__PURE__ */ i(
        se.ScrollToBottom,
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
          onModeChange: v,
          selectionContext: null,
          onClearSelectionContext: void 0
        }
      )
    ] })
  ] });
}
function mn() {
  const t = Ot(), e = (n) => {
    var o, c, m;
    n.preventDefault();
    const s = `${((o = globalThis.getSelection) == null ? void 0 : o.call(globalThis)) || ""}`.trim();
    if (!s) return;
    const a = Kt(s);
    if (!a) return;
    const r = t.thread.composer();
    r.setText(Wt(r.getState().text || "", a));
    try {
      (m = (c = globalThis.getSelection) == null ? void 0 : c.call(globalThis)) == null || m.removeAllRanges();
    } catch {
    }
  };
  return /* @__PURE__ */ i(Dt.Root, { className: "reader-ai-selection-toolbar", children: /* @__PURE__ */ x(
    "button",
    {
      type: "button",
      className: "reader-ai-selection-quote",
      onPointerDown: e,
      title: "引用这段话继续提问",
      children: [
        /* @__PURE__ */ i(bt, { size: 12, strokeWidth: 2.4, "aria-hidden": !0 }),
        /* @__PURE__ */ i("span", { children: "引用" })
      ]
    }
  ) });
}
const fn = [
  { prompt: "用几句话总结这篇文献的核心内容。", label: "总结本文", icon: Ge },
  { prompt: "这篇文献的主要结论是什么？", label: "提炼主要结论", icon: Rt },
  { prompt: "作者用了什么方法或模型？", label: "梳理方法与模型", icon: Ct },
  { prompt: "解释文中的关键公式。", label: "解释关键公式", icon: He }
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
  composerDisabled: m = !1,
  onModeChange: d,
  onJumpCitation: v,
  onBranchFromAnswer: w,
  selectionContext: C = null,
  onClearSelectionContext: f,
  footerExtra: u = null
}) {
  return /* @__PURE__ */ x(be, { children: [
    e ? /* @__PURE__ */ x("div", { className: "aui-empty", children: [
      /* @__PURE__ */ i("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ i("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ i(ge, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ i("h2", { className: "aui-empty-title", children: "一起读懂这篇文档" }),
      /* @__PURE__ */ i("p", { className: "aui-empty-sub", children: "总结、解释、检索与计算，不修改 PDF" }),
      /* @__PURE__ */ i("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: fn.map((E) => {
        const O = E.icon;
        return /* @__PURE__ */ x(
          se.Suggestion,
          {
            prompt: E.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: c || m || o,
            children: [
              /* @__PURE__ */ i(O, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
              /* @__PURE__ */ i("span", { className: "aui-suggestion-label", children: E.label })
            ]
          },
          E.prompt
        );
      }) })
    ] }) : null,
    /* @__PURE__ */ i(mn, {}),
    /* @__PURE__ */ i(
      nt,
      {
        jobId: t,
        citationsByMessageId: n,
        progressByMessageId: s,
        streamingAssistantId: a,
        isRunning: r,
        branchBusy: c,
        onJumpCitation: v,
        onBranchFromAnswer: w
      }
    ),
    u,
    /* @__PURE__ */ x(se.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !c ? /* @__PURE__ */ i(
        se.ScrollToBottom,
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
          branchBusy: c || m,
          mode: "reading",
          onModeChange: d,
          selectionContext: C,
          onClearSelectionContext: f
        }
      )
    ] })
  ] });
}
function gn({
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
  onAssistantModeChange: w,
  onJumpCitation: C,
  onBranchFromAnswer: f,
  selectionContext: u = null,
  onClearSelectionContext: E
}) {
  const O = e.length === 0, _ = v === "operations";
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
            pn,
            {
              jobId: t,
              empty: O,
              citationsByMessageId: n,
              progressByMessageId: s,
              streamingAssistantId: a,
              isRunning: r,
              missingLlmKey: o,
              branchBusy: c,
              agentRequestBlocked: m,
              agentOperationPanel: d,
              onModeChange: w,
              onJumpCitation: C,
              onBranchFromAnswer: f
            }
          ) : /* @__PURE__ */ i(
            hn,
            {
              jobId: t,
              empty: O,
              citationsByMessageId: n,
              progressByMessageId: s,
              streamingAssistantId: a,
              isRunning: r,
              missingLlmKey: o,
              branchBusy: c,
              composerDisabled: m,
              onModeChange: w,
              onJumpCitation: C,
              onBranchFromAnswer: f,
              selectionContext: u,
              onClearSelectionContext: E
            }
          ) })
        }
      )
    }
  );
}
const at = "retainpdf.reader-agent-operation.dismissed.v1", yn = /* @__PURE__ */ new Set(["failed", "cancelled"]);
function Be(t) {
  return [
    `${t.operation_id || ""}`.trim(),
    Number(t.current_attempt) || 0,
    `${t.status || ""}`
  ].join(":");
}
function wn() {
  var t;
  try {
    const e = JSON.parse(((t = globalThis.localStorage) == null ? void 0 : t.getItem(at)) || "[]");
    return new Set(Array.isArray(e) ? e.filter((n) => typeof n == "string") : []);
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function vn(t) {
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
function In(t) {
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
function bn(t) {
  return t === "failed" || t === "ambiguous" ? Qe : t === "cancelled" ? Re : t === "committed" || t === "result_ready" ? Je : ["queued", "running", "validating"].includes(t) ? Ce : St;
}
function Rn({ events: t, mode: e }) {
  return /* @__PURE__ */ i("ol", { className: "reader-agent-operation-timeline", "aria-label": "PDF 操作步骤", children: t.map((n) => {
    const s = bn(n.status), a = ["queued", "running", "validating"].includes(n.status);
    return /* @__PURE__ */ x("li", { children: [
      /* @__PURE__ */ i(s, { className: a ? "is-spinning" : "", size: 12, "aria-hidden": !0 }),
      /* @__PURE__ */ i("span", { children: n.summary || n.event || it(n.status, e) }),
      /* @__PURE__ */ i("time", { children: n.ts ? new Date(n.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "" })
    ] }, `${n.attempt}:${n.seq}`);
  }) });
}
function Cn({
  operation: t,
  loadCandidate: e
}) {
  const [n, s] = W(!1), [a, r] = W(""), [o, c] = W(""), m = B("");
  return U(() => {
    let d = !1;
    return c(""), e(t).then((v) => {
      if (d) return;
      const w = URL.createObjectURL(v);
      m.current && URL.revokeObjectURL(m.current), m.current = w, r(w);
    }).catch(() => {
      d || c("候选 PDF 加载失败，请重试。");
    }), () => {
      d = !0;
    };
  }, [e, t.operation_id, t.current_attempt]), U(() => () => {
    m.current && URL.revokeObjectURL(m.current);
  }, []), /* @__PURE__ */ x(be, { children: [
    /* @__PURE__ */ x("div", { className: "reader-agent-operation-candidate", children: [
      /* @__PURE__ */ x("div", { children: [
        /* @__PURE__ */ i(Se, { size: 13, "aria-hidden": !0 }),
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
          children: /* @__PURE__ */ i(kt, { size: 12, "aria-hidden": !0 })
        }
      )
    ] }),
    n ? /* @__PURE__ */ i("iframe", { className: "reader-agent-operation-preview", src: a, title: "候选 PDF 预览" }) : null,
    o ? /* @__PURE__ */ i("p", { className: "reader-agent-operation-error", role: "alert", children: o }) : null
  ] });
}
function Nn({
  entry: t,
  mode: e,
  loadCandidate: n,
  onAction: s,
  onDismiss: a
}) {
  var O;
  const { operation: r, pendingAction: o, error: c } = t, [m, d] = W(!1), [v, w] = W(!1), C = r.events || [], f = In(r.status), u = !!((r.status === "result_ready" || r.status === "committed") && r.candidate_available), E = yn.has(r.status);
  return /* @__PURE__ */ x("article", { className: `reader-agent-operation-card is-${r.status}`, "data-operation-id": r.operation_id, children: [
    /* @__PURE__ */ x("header", { children: [
      /* @__PURE__ */ i("span", { className: "reader-agent-operation-icon", "aria-hidden": !0, children: /* @__PURE__ */ i(Mt, { size: 15 }) }),
      /* @__PURE__ */ x("div", { className: "reader-agent-operation-title", children: [
        /* @__PURE__ */ i("span", { children: "PDF 操作" }),
        /* @__PURE__ */ i("strong", { children: r.intent_summary || "处理当前 PDF" })
      ] }),
      /* @__PURE__ */ x("div", { className: "reader-agent-operation-head-actions", children: [
        /* @__PURE__ */ i("span", { className: "reader-agent-operation-status", children: it(r.status, e) }),
        E ? /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "reader-agent-operation-dismiss",
            "aria-label": r.status === "failed" ? "隐藏这条失败提示" : "隐藏这条已取消提示",
            title: "隐藏",
            onClick: () => a(r),
            children: /* @__PURE__ */ i(Re, { size: 13, "aria-hidden": !0 })
          }
        ) : null
      ] })
    ] }),
    (O = r.affected_pages) != null && O.length ? /* @__PURE__ */ x("p", { className: "reader-agent-operation-scope", children: [
      "影响页码：",
      r.affected_pages.join("、")
    ] }) : null,
    C.length ? /* @__PURE__ */ x("div", { className: "reader-agent-operation-details", children: [
      /* @__PURE__ */ x("button", { type: "button", onClick: () => d((_) => !_), children: [
        m ? /* @__PURE__ */ i(_t, { size: 12, "aria-hidden": !0 }) : /* @__PURE__ */ i(Ye, { size: 12, "aria-hidden": !0 }),
        m ? "收起步骤" : `执行步骤 ${C.length}`
      ] }),
      m ? /* @__PURE__ */ i(Rn, { events: C, mode: e }) : null
    ] }) : null,
    u ? /* @__PURE__ */ i(Cn, { operation: r, loadCandidate: n }) : null,
    c ? /* @__PURE__ */ i("p", { className: "reader-agent-operation-error", role: "alert", children: c }) : null,
    v ? /* @__PURE__ */ x("div", { className: "reader-agent-operation-risk", role: "alertdialog", "aria-label": "确认重复执行风险", children: [
      /* @__PURE__ */ i(Qe, { size: 14, "aria-hidden": !0 }),
      /* @__PURE__ */ i("p", { children: "上一次执行结果不确定，重试可能重复操作。确认接受风险后再继续。" }),
      /* @__PURE__ */ x("div", { children: [
        /* @__PURE__ */ i("button", { type: "button", onClick: () => w(!1), disabled: !!o, children: "返回" }),
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "is-danger",
            disabled: !!o,
            onClick: async () => {
              await s("retry", r, { acceptDuplicateRisk: !0 }), w(!1);
            },
            children: o === "retry" ? "处理中…" : "接受风险并重试"
          }
        )
      ] })
    ] }) : f.length ? /* @__PURE__ */ i("div", { className: "reader-agent-operation-actions", children: f.map((_) => /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: _.primary ? "is-primary" : _.danger ? "is-danger" : "",
        disabled: !!o,
        onClick: () => {
          _.risk ? w(!0) : s(_.action, r);
        },
        children: o === _.action ? "处理中…" : _.label
      },
      _.action
    )) }) : null
  ] });
}
function Mn({
  entries: t,
  confirmationMode: e,
  runtimeRestarting: n,
  loadCandidate: s,
  onAction: a
}) {
  const [r, o] = W(wn), c = t.filter((d) => !r.has(Be(d.operation)));
  function m(d) {
    const v = Be(d);
    o((w) => {
      const C = new Set(w);
      return C.add(v), vn(C), C;
    });
  }
  return /* @__PURE__ */ x("section", { className: `reader-agent-operations${c.length ? " has-operations" : ""}`, "aria-label": "AI PDF 操作", children: [
    /* @__PURE__ */ x("div", { className: `reader-agent-mode${e === "green_light" ? " is-green" : ""}`, children: [
      /* @__PURE__ */ i(Nt, { size: 13, "aria-hidden": !0 }),
      /* @__PURE__ */ i("span", { children: e === "green_light" ? "绿灯模式 · 自动执行并应用" : "需要确认 · 操作前等待授权" })
    ] }),
    n ? /* @__PURE__ */ x("div", { className: "reader-agent-restarting", role: "status", children: [
      /* @__PURE__ */ i(Ce, { className: "is-spinning", size: 13, "aria-hidden": !0 }),
      "正在重启 Agent，新请求暂不可用"
    ] }) : null,
    c.map((d) => /* @__PURE__ */ i(
      Nn,
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
const _n = (t) => t, kn = Object.freeze([]), Sn = Object.freeze({}), Le = Object.freeze({}), An = Object.freeze({
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
function $n(t, e, n) {
  var s, a, r, o;
  return ((s = t.status) == null ? void 0 : s.type) === "running" || n && e === t.id ? { type: "running" } : ((a = t.status) == null ? void 0 : a.type) === "incomplete" || ((r = t.status) == null ? void 0 : r.type) === "error" ? {
    type: "incomplete",
    reason: ((o = t.status) == null ? void 0 : o.reason) === "cancelled" ? "cancelled" : "error"
  } : { type: "complete", reason: "stop" };
}
function xn({
  jobId: t = "",
  messages: e = kn,
  citationsByMessageId: n = Sn,
  progressByMessageId: s = Le,
  contentByMessageId: a = Le,
  streamingAssistantId: r = "",
  isRunning: o = !1,
  onSubmit: c,
  onRetry: m,
  onCancel: d,
  onJumpCitation: v,
  onBranchFromAnswer: w,
  branchBusy: C = !1,
  agentOperations: f = An,
  assistantMode: u = "reading",
  onAssistantModeChange: E,
  selectionContext: O = null,
  onClearSelectionContext: _
}) {
  const [, z] = W(0);
  U(() => {
    const p = () => z((R) => R + 1);
    return window.addEventListener("focus", p), window.addEventListener("storage", p), document.addEventListener(Fe, p), () => {
      window.removeEventListener("focus", p), window.removeEventListener("storage", p), document.removeEventListener(Fe, p);
    };
  }, []);
  const T = !Lt() && !f.runtimeCredentialConfigured, I = J(() => e.map((p) => ({
    id: p.id,
    role: p.role,
    content: a[p.id] || p.content || "",
    ...p.role === "assistant" ? { status: $n(p, r, o) } : {}
  })), [a, o, e, r]), P = H(async (p) => {
    const R = p ? Math.max(0, e.findIndex((h) => h.id === p) + 1) : 0, S = e.slice(R).find((h) => h.role === "assistant");
    S && await m(S.id);
  }, [e, m]), y = H(async (p) => {
    const R = Tn(p);
    !R || o || C || f.runtimeRestarting || T || await c(R);
  }, [f.runtimeRestarting, C, o, T, c]), g = H(async () => {
    await d();
  }, [d]), b = J(() => ({
    messages: I,
    isRunning: o,
    isDisabled: C || f.runtimeRestarting || T,
    convertMessage: _n,
    onNew: y,
    onReload: P,
    onCancel: g
  }), [
    f.runtimeRestarting,
    C,
    g,
    y,
    o,
    T,
    P,
    I
  ]), k = Ft(b);
  return /* @__PURE__ */ i(zt, { runtime: k, children: /* @__PURE__ */ i(
    gn,
    {
      jobId: t,
      messages: e,
      citationsByMessageId: n,
      progressByMessageId: s,
      streamingAssistantId: r,
      isRunning: o,
      missingLlmKey: T,
      branchBusy: C,
      agentRequestBlocked: f.runtimeRestarting,
      assistantMode: u,
      onAssistantModeChange: E,
      selectionContext: O,
      onClearSelectionContext: _,
      agentOperationPanel: f.entries.length > 0 || f.runtimeRestarting ? /* @__PURE__ */ i(
        Mn,
        {
          entries: f.entries,
          confirmationMode: f.confirmationMode,
          runtimeRestarting: f.runtimeRestarting,
          loadCandidate: f.loadCandidate,
          onAction: f.perform
        }
      ) : null,
      onJumpCitation: v,
      onBranchFromAnswer: w
    }
  ) });
}
function ve(t = 900, e = 0) {
  ue(t, { overlayDelayMs: e }), oe(t);
}
function En({
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
  const d = t.length > 0, v = n || s, [w, C] = W(!1), [f, u] = W(""), [E, O] = W(""), _ = B(null), z = pt();
  function T(h) {
    const M = `${h || ""}`.match(/^fork-(\d+)-(.*)$/i);
    if (!M) return h;
    const $ = M[2].trim();
    return $ ? `${$} · 分支${M[1]}` : `分支${M[1]}`;
  }
  const I = B(!1), P = B(null), y = t.find((h) => h.id === e) || null, g = y ? y.messageCount ? T(y.title) : `${T(y.title)}（空）` : d ? "选择以往对话" : "新对话";
  U(() => {
    if (!w) {
      u("");
      return;
    }
    const h = (A) => {
      if (I.current) return;
      const l = _.current;
      l && (A.target instanceof Node && l.contains(A.target) || (C(!1), u("")));
    }, M = (A) => {
      A.key === "Escape" && (C(!1), u(""));
    }, $ = window.setTimeout(() => {
      document.addEventListener("pointerdown", h, !0);
    }, 0);
    return document.addEventListener("keydown", M), () => {
      window.clearTimeout($), document.removeEventListener("pointerdown", h, !0), document.removeEventListener("keydown", M);
    };
  }, [w]), U(() => {
    if (!f) return;
    const h = P.current;
    h && (h.focus(), h.select());
  }, [f]);
  const b = (h) => {
    const M = `${h || ""}`.trim();
    !M || v || I.current || f || (I.current = !0, ve(1e3, 0), requestAnimationFrame(() => {
      C(!1), window.setTimeout(() => {
        (async () => {
          try {
            await r(M);
          } finally {
            ve(400, 0), I.current = !1;
          }
        })();
      }, 40);
    }));
  }, k = (h) => {
    v || (u(h.id), O(h.title || ""));
  }, p = () => {
    const h = f, M = E;
    u(""), h && m(h, M);
  }, R = () => {
    u(""), O("");
  }, S = (h) => {
    var A;
    if (v || I.current) return;
    const M = h.title || "未命名对话";
    (A = globalThis.confirm) != null && A.call(globalThis, `确定删除对话「${M}」？此操作不可恢复。`) && (I.current = !0, ve(800, 0), (async () => {
      try {
        await c(h.id);
      } finally {
        I.current = !1;
      }
    })());
  };
  return /* @__PURE__ */ x(
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
        /* @__PURE__ */ x("div", { className: "aui-session-row", children: [
          /* @__PURE__ */ x(
            "button",
            {
              type: "button",
              className: `aui-session-trigger${w ? " is-open" : ""}`,
              "aria-label": "切换对话窗口",
              "aria-haspopup": "listbox",
              "aria-expanded": w,
              "aria-controls": z,
              disabled: v || !d,
              title: g,
              onClick: () => {
                v || !d || C((h) => !h);
              },
              children: [
                /* @__PURE__ */ i("span", { className: "aui-session-trigger-label", children: g }),
                /* @__PURE__ */ i(Ye, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 })
              ]
            }
          ),
          /* @__PURE__ */ x(
            "button",
            {
              type: "button",
              className: "aui-session-btn",
              disabled: v,
              title: "新对话窗口",
              "aria-label": "新对话",
              onClick: () => {
                v || I.current || (I.current = !0, ve(800), C(!1), u(""), window.setTimeout(() => {
                  (async () => {
                    try {
                      await o();
                    } finally {
                      I.current = !1;
                    }
                  })();
                }, 40));
              },
              children: [
                n ? /* @__PURE__ */ i(Ce, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ i(At, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
                /* @__PURE__ */ i("span", { children: "新对话" })
              ]
            }
          )
        ] }),
        w && d ? /* @__PURE__ */ i(
          "ul",
          {
            id: z,
            className: "aui-session-list",
            role: "listbox",
            "aria-label": "以往对话",
            children: t.map((h) => {
              const M = h.messageCount ? T(h.title) : `${T(h.title)}（空）`, $ = h.id === e, A = f === h.id;
              return /* @__PURE__ */ i("li", { className: "aui-session-row-item", role: "presentation", children: A ? /* @__PURE__ */ x("div", { className: "aui-session-edit", children: [
                /* @__PURE__ */ i(
                  "input",
                  {
                    ref: P,
                    className: "aui-session-edit-input",
                    value: E,
                    maxLength: 80,
                    "aria-label": "对话标题",
                    disabled: v,
                    onChange: (l) => O(l.target.value),
                    onKeyDown: (l) => {
                      l.key === "Enter" ? (l.preventDefault(), p()) : l.key === "Escape" && (l.preventDefault(), R());
                    },
                    onClick: (l) => l.stopPropagation()
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": "保存标题",
                    title: "保存",
                    disabled: v || !E.trim(),
                    onClick: (l) => {
                      l.stopPropagation(), p();
                    },
                    children: /* @__PURE__ */ i(Je, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
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
                    onClick: (l) => {
                      l.stopPropagation(), R();
                    },
                    children: /* @__PURE__ */ i(Re, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }) : /* @__PURE__ */ x(be, { children: [
                /* @__PURE__ */ x(
                  "button",
                  {
                    type: "button",
                    role: "option",
                    "aria-selected": $,
                    className: `aui-session-item${$ ? " is-active" : ""}`,
                    disabled: v,
                    title: M,
                    onPointerDown: (l) => {
                      l.stopPropagation(), !$ && !v && oe(1e3);
                    },
                    onClick: (l) => {
                      if (l.preventDefault(), l.stopPropagation(), $) {
                        C(!1);
                        return;
                      }
                      b(h.id);
                    },
                    children: [
                      /* @__PURE__ */ i("span", { className: "aui-session-item-title", children: M }),
                      $ ? /* @__PURE__ */ i("span", { className: "aui-session-item-badge", children: "当前" }) : null
                    ]
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": `重命名 ${M}`,
                    title: "重命名",
                    disabled: v,
                    onClick: (l) => {
                      l.preventDefault(), l.stopPropagation(), k(h);
                    },
                    children: /* @__PURE__ */ i(Tt, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn is-danger",
                    "aria-label": `删除 ${M}`,
                    title: "删除",
                    disabled: v,
                    onClick: (l) => {
                      l.preventDefault(), l.stopPropagation(), S(h);
                    },
                    children: /* @__PURE__ */ i($t, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
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
function Pn(t, e) {
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
function On(t) {
  const e = Number(t == null ? void 0 : t.status) || 0, n = `${(t == null ? void 0 : t.message) || ""}`;
  return e === 502 || /\b502\b/.test(n);
}
class Dn {
  constructor(e) {
    this.options = e;
  }
  async sendMessages({
    abortSignal: e,
    body: n,
    messages: s,
    trigger: a
  }) {
    var O, _, z, T;
    const r = n || {}, o = Pn(s, r);
    if (!o) throw new Error("请输入问题。");
    const c = r.assistantMode || ((_ = (O = this.options).getAssistantMode) == null ? void 0 : _.call(O)) || "reading", m = r.scope || "document", d = r.context ? { ...r.context } : null, v = `${r.assistantMessageId || ""}`.trim() || `a-${Date.now().toString(36)}`, w = `${v}-text`, C = this.options.getRemoteAnswerer(), f = ((T = (z = this.options).getLocalAnswerer) == null ? void 0 : T.call(z)) || null;
    if (!C && !f)
      throw new Error("问答暂不可用：请确认已打开任务阅读器。");
    let u = !1;
    const E = /* @__PURE__ */ new Set();
    return new ReadableStream({
      cancel: () => {
        u = !0;
      },
      start: (I) => {
        let P = "", y = {
          citations: [],
          progress: a === "regenerate-message" ? "正在重新生成…" : "正在检索文档…",
          status: "running"
        };
        const g = (k) => {
          if (!u)
            try {
              I.enqueue(k);
            } catch {
              u = !0;
            }
        }, b = (k) => {
          y = { ...y, ...k }, g({ type: "message-metadata", messageMetadata: y });
        };
        g({ type: "start", messageId: v, messageMetadata: y }), g({ type: "start-step" }), g({ type: "text-start", id: w }), (async () => {
          var k, p, R, S, h, M;
          try {
            if (await ((k = C == null ? void 0 : C.ensureLoaded) == null ? void 0 : k.call(C, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
            let $ = C || f, A = !1, l;
            try {
              l = await $.answer({
                question: o,
                assistantMode: c,
                scope: m,
                context: d,
                parentId: `${r.parentId || ""}`.trim(),
                regenerate: r.regenerate ?? a === "regenerate-message",
                userMessageId: `${r.userMessageId || ""}`.trim(),
                assistantMessageId: v,
                onAgentSessionEvent: (N) => {
                  var X, te, re;
                  const F = (X = N == null ? void 0 : N.capabilities) == null ? void 0 : X.document_operation_confirmation_mode;
                  (F === "explicit" || F === "green_light") && ((re = (te = this.options).onConfirmationMode) == null || re.call(te, F));
                },
                onAgentOperationEvent: (N) => {
                  var X, te;
                  const F = `${(N == null ? void 0 : N.operation_id) || ""}`.trim();
                  F && ((te = (X = this.options).onAgentOperationSignal) == null || te.call(X, {
                    operationId: F,
                    conversationId: `${(N == null ? void 0 : N.conversation_id) || ""}`.trim() || void 0
                  }));
                },
                onAgentConfirmationRequiredEvent: (N) => {
                  var ae, Z;
                  const F = `${(N == null ? void 0 : N.operation_id) || ""}`.trim();
                  if (!F) return;
                  const X = `${(N == null ? void 0 : N.action) || ""}`, te = `${(N == null ? void 0 : N.current_attempt) ?? ""}`, re = `${F}:${te}:${X}`;
                  E.has(re) || (E.add(re), (Z = (ae = this.options).onAgentOperationSignal) == null || Z.call(ae, { operationId: F }));
                },
                onToolEvent: (N) => {
                  if (P || e != null && e.aborted) return;
                  const F = Yt(N);
                  F && b({ progress: F });
                },
                onProgressEvent: (N) => {
                  if (P || e != null && e.aborted) return;
                  const F = `${(N == null ? void 0 : N.message) || ""}`.trim();
                  F && b({ progress: F });
                },
                onAnswerDelta: (N, F) => {
                  !F || e != null && e.aborted || (P += F, y.progress && b({ progress: "" }), g({ type: "text-delta", id: w, delta: F }));
                },
                onCompress: (N) => {
                  if (P || e != null && e.aborted) return;
                  const F = Number(N == null ? void 0 : N.dropped_turns) || 0;
                  F && b({ progress: `已压缩 ${F} 轮早期对话` });
                },
                signal: e
              });
            } catch (N) {
              if (e != null && e.aborted || c === "operations" || !C || !f || !On(N)) throw N;
              if (A = !0, b({ progress: "在线服务暂不可用，改用本地检索…" }), await ((p = f.ensureLoaded) == null ? void 0 : p.call(f, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
              $ = f, l = await $.answer({
                question: o,
                assistantMode: c,
                scope: m,
                context: d,
                signal: e
              });
            }
            if (e != null && e.aborted) {
              b({ progress: "", status: "cancelled", statusText: "已取消" }), g({ type: "abort", reason: "cancelled" });
              return;
            }
            const q = l == null ? void 0 : l.confirmationMode;
            (q === "explicit" || q === "green_light") && ((S = (R = this.options).onConfirmationMode) == null || S.call(R, q));
            const G = `${(l == null ? void 0 : l.conversationId) || ""}`.trim() || void 0, D = /* @__PURE__ */ new Set();
            for (const N of (l == null ? void 0 : l.operationRefs) || []) {
              const F = typeof N == "string" ? N : `${(N == null ? void 0 : N.operation_id) || ""}`;
              F.trim() && D.add(F.trim());
            }
            for (const N of (l == null ? void 0 : l.confirmationRequests) || []) {
              const F = `${(N == null ? void 0 : N.operation_id) || ""}`.trim();
              F && D.add(F);
            }
            for (const N of D)
              (M = (h = this.options).onAgentOperationSignal) == null || M.call(h, {
                operationId: N,
                conversationId: G,
                confirmationMode: q || void 0
              });
            const L = jt(l == null ? void 0 : l.citations);
            let V = Ut(
              `${(l == null ? void 0 : l.answer) || P || ""}`.trim() || "没有找到可用回答。",
              L
            );
            if (A && (V += `

_在线服务暂不可用，以上来自本地文档检索。_`), (l == null ? void 0 : l.persisted) === !1 && (V += `

_⚠️ 本轮回答未能写入历史记录（存储暂时不可用），刷新后可能丢失。_`), !P)
              g({ type: "text-delta", id: w, delta: V });
            else if (V.startsWith(P)) {
              const N = V.slice(P.length);
              N && g({ type: "text-delta", id: w, delta: N });
            }
            g({ type: "text-end", id: w }), b({
              citations: L,
              persisted: (l == null ? void 0 : l.persisted) !== !1,
              progress: "",
              status: "complete"
            }), g({ type: "finish-step" }), g({ type: "finish", finishReason: "stop", messageMetadata: y });
          } catch ($) {
            if (e != null && e.aborted)
              b({ progress: "", status: "cancelled", statusText: "已取消" }), g({ type: "abort", reason: "cancelled" });
            else {
              const A = $ instanceof Error && $.message ? $.message : "生成回答失败，请重试。";
              b({ progress: "", status: "error", statusText: A }), g({ type: "error", errorText: A });
            }
          } finally {
            if (!u) {
              u = !0;
              try {
                I.close();
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
function Fn(t) {
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
function zn(t) {
  const e = t.metadata || {}, n = e.status === "running", s = e.status === "cancelled" || e.status === "error", a = Fn(t), r = a.trim() || (s ? `${e.statusText || ""}`.trim() : "");
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
function qn(t) {
  const e = B(t.remoteAnswerer), n = B(t.localAnswerer), s = B(t.onAgentOperationSignal), a = B(t.onConfirmationMode), r = B(t.onStopped);
  r.current = t.onStopped;
  const o = B(t.assistantMode);
  e.current = t.remoteAnswerer, n.current = t.localAnswerer, s.current = t.onAgentOperationSignal, a.current = t.onConfirmationMode, o.current = t.assistantMode;
  const c = J(() => new Gt({
    id: `reader-${t.jobId || "idle"}`,
    transport: new Dn({
      jobId: t.jobId,
      getRemoteAnswerer: () => e.current,
      getLocalAnswerer: () => n.current,
      getAssistantMode: () => o.current,
      onAgentOperationSignal: (m) => {
        var d;
        return (d = s.current) == null ? void 0 : d.call(s, m);
      },
      onConfirmationMode: (m) => {
        var d;
        return (d = a.current) == null ? void 0 : d.call(a, m);
      }
    })
  }), [t.jobId]);
  return U(() => {
    t.enabled || c.stop().finally(() => {
      var m;
      return (m = r.current) == null ? void 0 : m.call(r);
    });
  }, [c, t.enabled]), U(() => () => {
    c.stop().finally(() => {
      var m;
      return (m = r.current) == null ? void 0 : m.call(r);
    });
  }, [c]), Vt({ chat: c, experimental_throttle: 16 });
}
function Bn(t) {
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
function ce(t, e) {
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
function Ln(t, e) {
  var n;
  return e ? ((n = t.find((s) => s.message.id === e)) == null ? void 0 : n.message) ?? null : null;
}
function jn(t, e) {
  const n = new Map(t.map((o) => [o.message.id, o]));
  let s = n.get(e);
  if (!s) return [];
  const a = [], r = /* @__PURE__ */ new Set();
  for (; s && !r.has(s.message.id); )
    r.add(s.message.id), a.push(s), s = s.parentId ? n.get(s.parentId) : void 0;
  return a.reverse();
}
function Kn(t, e, n) {
  var v, w, C, f;
  const s = `${e || ""}`.trim();
  if (!s || !t.length) return [];
  let a = s;
  t.some((u) => u.message.id === a) || (n && t.some((u) => u.message.id === n) ? a = n : a = ((v = [...t].reverse().find((u) => u.message.role === "assistant")) == null ? void 0 : v.message.id) || "");
  let r = jn(t, a);
  if (r.length >= 2 && ((w = r.at(-1)) == null ? void 0 : w.message.role) === "assistant") return r;
  r.length === 1 && ((C = r[0]) == null ? void 0 : C.message.role) === "user" && (r = []);
  const o = ce(t, n || a);
  let c = o.findIndex((u) => u.id === a);
  if (c < 0 && (c = o.length - 1), c < 0) return r;
  const m = new Map(t.map((u) => [u.message.id, u])), d = o.slice(0, c + 1).map((u) => m.get(u.id)).filter((u) => !!u);
  for (; d.length && ((f = d.at(-1)) == null ? void 0 : f.message.role) !== "assistant"; ) d.pop();
  return d.length ? d : r;
}
function Ae(t) {
  return t.map((e) => ({
    parentId: e.parentId,
    message: {
      ...e.message,
      citations: e.message.citations || [],
      status: e.message.status
    }
  }));
}
const Wn = {
  stopStream: () => Promise.resolve(),
  clearMessages: () => {
  },
  showMessages: () => {
  }
};
function Un(t) {
  var n;
  const e = {};
  for (const s of t) {
    const a = s.message;
    a.role === "assistant" && ((n = a.citations) != null && n.length) && (e[a.id] = a.citations);
  }
  return e;
}
function Hn(t) {
  const e = {};
  for (const n of t) {
    const s = n.message;
    s.role === "assistant" && s.progress && (e[s.id] = s.progress);
  }
  return e;
}
function Gn(t) {
  const e = {};
  for (const n of t) {
    const s = n.message;
    s.content && (e[s.id] = s.content);
  }
  return e;
}
function Vn(t, e, n) {
  var a;
  const s = e || ((a = n == null ? void 0 : n.getConversationId) == null ? void 0 : a.call(n)) || "";
  return (t || []).map((r) => ({
    ...Qt(r, { active: s }),
    active: r.conversation_id === s
  }));
}
function Yn(t) {
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
function Qn(t) {
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
    persistReadyRef: w,
    switchTokenRef: C,
    sessionListGenerationRef: f,
    activeConversationIdRef: u,
    setItems: E,
    setHeadId: O,
    setSessions: _,
    setActiveConversationId: z,
    setSessionBusy: T
  } = t;
  U(() => {
    const I = o.current;
    if (!e) {
      f.current += 1, C.current += 1, E([]), O(null), _([]), z(""), c.current.clearMessages(), u.current = "", v.current = "", d.current = "", w.current = !1;
      return;
    }
    const P = v.current !== e;
    if (P && (f.current += 1, C.current += 1, v.current = e, w.current = !1, E([]), O(null), c.current.clearMessages(), _([]), z(""), u.current = "", d.current = "", T(!1)), !s || !I) {
      f.current += 1;
      return;
    }
    let y = !1;
    return (async () => {
      var S, h, M, $;
      let g = `${n || d.current || ""}`.trim();
      if (!g) {
        try {
          g = `${await ((S = I.getDocumentId) == null ? void 0 : S.call(I)) || ""}`.trim();
        } catch {
          g = "";
        }
        if (y) return;
      }
      g && (d.current = g);
      let b = null;
      if (!y && g && (b = await a(g)), !(P || !m.current.length) || y) {
        y || (w.current = !0);
        return;
      }
      const p = Jt({ jobId: e, documentId: g }) || `${((h = I.getConversationId) == null ? void 0 : h.call(I)) || ""}`.trim();
      if (p) {
        z(p), u.current = p, (M = I.setConversationId) == null || M.call(I, p, g);
        try {
          const A = await ze(p);
          if (y) return;
          const l = Ie(A.messages || []);
          if (l.length) {
            r(l, A.head_id), requestAnimationFrame(() => {
              y || (w.current = !0);
            });
            return;
          }
        } catch {
        }
      }
      if (!y && g)
        try {
          const A = b ?? await a(g);
          if (y || !A) return;
          const l = A[0];
          if (l != null && l.conversation_id) {
            const q = l.conversation_id;
            z(q), u.current = q, ($ = I.setConversationId) == null || $.call(I, q, g);
            try {
              const G = await ze(q);
              if (y) return;
              r(
                Ie(G.messages || []),
                G.head_id
              ), requestAnimationFrame(() => {
                y || (w.current = !0);
              });
              return;
            } catch {
            }
          }
        } catch {
        }
      if (y) return;
      const R = et({ jobId: e, documentId: g }, p);
      if (R != null && R.items.length) {
        const A = dt(R);
        E(A.items), O(A.headId), c.current.showMessages(ce(A.items, A.headId));
      } else
        E([]), O(null), c.current.clearMessages();
      requestAnimationFrame(() => {
        y || (w.current = !0);
      });
    })(), () => {
      y = !0, f.current += 1;
    };
  }, [e, n, s, a, r]);
}
function Jn(t) {
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
        he(d, m);
        return;
      }
      Te(d, $e(s, a), m);
    }, 280);
    return () => window.clearTimeout(v);
  }, [e, n, s, a, r]);
}
function Xn(t) {
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
    switchTokenRef: w,
    persistReadyRef: C,
    setSessionBusy: f,
    setSessionError: u,
    setActiveConversationId: E,
    setItems: O,
    setHeadId: _,
    setSessions: z,
    refreshSessions: T,
    applyConversationTree: I
  } = t, P = H(() => {
    var R, S;
    const p = `${((S = (R = o.current) == null ? void 0 : R.getConversationId) == null ? void 0 : S.call(R)) || ""}`.trim();
    p && E(p);
  }, []), y = H(async () => {
    var R, S;
    if (s) return;
    await r.current.stopStream(), ue(900), oe(900), f(!0), u("");
    const p = ++w.current;
    try {
      if (await new Promise(($) => {
        window.setTimeout($, 40);
      }), p !== w.current) return;
      const h = o.current, M = v.current || `${await ((R = h == null ? void 0 : h.getDocumentId) == null ? void 0 : R.call(h)) || ""}`.trim();
      if (p !== w.current) return;
      v.current = M, (S = h == null ? void 0 : h.clearConversationId) == null || S.call(h, M), E(""), d.current = "", O([]), _(null), r.current.clearMessages(), he({ jobId: e, documentId: M }), M && await T(M, p);
    } catch (h) {
      console.warn("[reader-ai] new session failed", h), u("无法创建新对话，请重试。");
    } finally {
      p === w.current && f(!1);
    }
  }, [e, T, s]), g = H(async (p) => {
    var $, A, l, q, G;
    const R = `${p || ""}`.trim();
    if (!R)
      return u("无法分支：消息 id 无效。"), !1;
    if (s)
      return u("请稍候，当前有会话操作进行中。"), !1;
    await r.current.stopStream();
    const S = Kn(c.current, R, m.current);
    if (!S.length)
      return u("无法分支：找不到到此答案的对话路径。"), !1;
    if (S[S.length - 1].message.role !== "assistant")
      return u("只能从助手答案处开新对话。"), !1;
    f(!0), u("");
    const M = ++w.current;
    try {
      if (await new Promise((j) => {
        window.setTimeout(j, 40);
      }), M !== w.current) return !1;
      const D = o.current;
      let L = v.current || `${await (($ = D == null ? void 0 : D.getDocumentId) == null ? void 0 : $.call(D)) || ""}`.trim();
      if (M !== w.current) return !1;
      if (v.current = L, !L)
        try {
          if (L = `${await ((A = D == null ? void 0 : D.getDocumentId) == null ? void 0 : A.call(D)) || ""}`.trim(), M !== w.current) return !1;
          v.current = L;
        } catch {
          L = "";
        }
      if (!L)
        return u("无法分支：文档未就绪，请稍后重试。"), !1;
      const V = S.map((j, ie) => ({
        id: j.message.id,
        role: j.message.role,
        content: j.message.content,
        citations: j.message.citations,
        parentId: ie === 0 ? null : S[ie - 1].message.id
      })), N = d.current || ((l = D == null ? void 0 : D.getConversationId) == null ? void 0 : l.call(D)) || "", F = (a || []).find((j) => j.conversation_id === N), X = V.find((j) => j.role === "user"), te = `${(F == null ? void 0 : F.title) || ""}`.trim() || `${(X == null ? void 0 : X.content) || ""}`.replace(/\s+/g, " ").trim() || "未命名对话", re = (a || []).map((j) => j.title || ""), ae = Xt(te, re), Z = await me().forkFromPath({
        documentId: L,
        title: ae,
        path: V
      });
      if (M !== w.current) return !1;
      const K = Ae(Z.items), Q = ((q = K[K.length - 1]) == null ? void 0 : q.message.id) || null, Y = Z.conversation.conversation_id;
      if (!Y || !K.length)
        throw new Error("fork returned empty conversation");
      return ue(600), oe(600), O(K), _(Q), r.current.showMessages(ce(K, Q)), E(Y), d.current = Y, (G = D == null ? void 0 : D.setConversationId) == null || G.call(D, Y, L), z((j) => {
        const ie = {
          conversation_id: Y,
          title: ae,
          document_id: L,
          created_at: Z.conversation.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: Z.conversation.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
          message_count: K.length,
          head_id: Q || ""
        }, de = j.filter((pe) => pe.conversation_id !== Y);
        return [ie, ...de];
      }), Te(
        { jobId: e, documentId: L },
        $e(K, Q),
        Y
      ), await T(L, M), !0;
    } catch (D) {
      return console.warn("[reader-ai] branch from answer failed", D), M === w.current && u("分支失败：未能复制上文到新对话。请检查网络后重试。"), !1;
    } finally {
      M === w.current && f(!1);
    }
  }, [e, T, s, a]), b = H(async (p) => {
    var h, M, $, A;
    const R = `${p || ""}`.trim();
    if (!R || s) return;
    await r.current.stopStream(), f(!0), u("");
    const S = ++w.current;
    try {
      const l = o.current, q = v.current || `${await ((h = l == null ? void 0 : l.getDocumentId) == null ? void 0 : h.call(l)) || ""}`.trim();
      if (S !== w.current) return;
      v.current = q;
      try {
        await me().delete(R);
      } catch (L) {
        if ((Number(L == null ? void 0 : L.status) || 0) !== 404) throw L;
      }
      he({ jobId: e, documentId: q }, R);
      const D = (d.current || ((M = l == null ? void 0 : l.getConversationId) == null ? void 0 : M.call(l)) || "") === R;
      if (z((L) => L.filter((V) => V.conversation_id !== R)), D) {
        ($ = l == null ? void 0 : l.clearConversationId) == null || $.call(l, q), E(""), d.current = "", O([]), _(null), r.current.clearMessages(), he({ jobId: e, documentId: q });
        const L = q ? await T(q, S) : [];
        if (S !== w.current || !L) return;
        const V = L[0];
        if (V != null && V.conversation_id) {
          const N = V.conversation_id;
          E(N), d.current = N;
          try {
            const F = await me().get(N);
            if (S !== w.current) return;
            I(
              Ie(F.messages || []),
              F.head_id
            ), (A = l == null ? void 0 : l.setConversationId) == null || A.call(l, N, q);
          } catch {
            O([]), _(null);
          }
        }
      } else q && await T(q, S);
    } catch (l) {
      console.warn("[reader-ai] delete session failed", l), u("删除对话失败，请重试。");
    } finally {
      S === w.current && f(!1);
    }
  }, [I, e, T, s]), k = H(async (p, R) => {
    const S = `${p || ""}`.trim(), h = `${R || ""}`.replace(/\s+/g, " ").trim();
    if (!S || !h || s) return;
    f(!0), u("");
    const M = ++w.current;
    try {
      const $ = h.slice(0, 80);
      if (await me().patch(S, { title: $ }), M !== w.current) return;
      z(
        (l) => l.map(
          (q) => q.conversation_id === S ? { ...q, title: $ } : q
        )
      );
      const A = v.current;
      A && await T(A, M);
    } catch ($) {
      console.warn("[reader-ai] rename session failed", $), u("重命名失败，请重试。");
    } finally {
      M === w.current && f(!1);
    }
  }, [T, s]);
  return {
    adoptRemoteConversationId: P,
    newSession: y,
    branchFromAnswer: g,
    removeSession: b,
    renameSession: k
  };
}
function Zn(t) {
  var ae;
  const {
    jobId: e,
    documentId: n = "",
    enabled: s,
    remoteAnswerer: a = null,
    stream: r = Wn
  } = t, [o, c] = W([]), [m, d] = W(null), [v, w] = W([]), [C, f] = W(""), [u, E] = W(!1), [O, _] = W(""), z = B(o), T = B(m), I = B(C), P = B(!1), y = B(""), g = B(""), b = B(0), k = B(0), p = B(r);
  p.current = r;
  const R = B(a);
  R.current = a, z.current = o, T.current = m, I.current = C;
  const S = H(async (Z = "", K) => {
    const Q = `${Z || g.current || ""}`.trim(), Y = ++k.current;
    if (!Q)
      return Y === k.current && (K === void 0 || K === b.current) && w([]), [];
    try {
      const j = me();
      if (!j) return null;
      const de = (await j.list({ document_id: Q, limit: 50 })).conversations || [];
      return Y === k.current && Q === `${g.current || ""}`.trim() && (K === void 0 || K === b.current) ? (w(de), de) : null;
    } catch {
      return null;
    }
  }, []), h = H((Z, K) => {
    var j;
    const Q = Ae(Z), Y = `${K || ""}`.trim() || ((j = Q[Q.length - 1]) == null ? void 0 : j.message.id) || null;
    c(Q), d(Y), p.current.showMessages(ce(Q, Y));
  }, []), M = H(() => `${n || g.current || e}`.trim(), [n, e]);
  Qn({
    jobId: e,
    documentId: n,
    enabled: s,
    refreshSessions: S,
    applyConversationTree: h,
    remoteRef: R,
    streamRef: p,
    itemsRef: z,
    documentIdRef: g,
    lastJobRef: y,
    persistReadyRef: P,
    switchTokenRef: b,
    sessionListGenerationRef: k,
    activeConversationIdRef: I,
    setItems: c,
    setHeadId: d,
    setSessions: w,
    setActiveConversationId: f,
    setSessionBusy: E
  }), Jn({
    jobId: e,
    documentId: n,
    items: o,
    headId: m,
    activeConversationId: C,
    documentIdRef: g,
    persistReadyRef: P
  });
  const $ = J(
    () => ce(o, m),
    [o, m]
  ), A = J(
    () => Un(o),
    [o]
  ), l = J(
    () => Hn(o),
    [o]
  ), q = J(
    () => Gn(o),
    [o]
  ), G = J(() => Yn({ setItems: c, setHeadId: d, itemsRef: z, headIdRef: T }), []), {
    adoptRemoteConversationId: D,
    newSession: L,
    branchFromAnswer: V,
    removeSession: N,
    renameSession: F
  } = Xn({
    jobId: e,
    documentId: n,
    sessionBusy: u,
    sessions: v,
    streamRef: p,
    remoteRef: R,
    itemsRef: z,
    headIdRef: T,
    activeConversationIdRef: I,
    documentIdRef: g,
    switchTokenRef: b,
    persistReadyRef: P,
    setSessionBusy: E,
    setSessionError: _,
    setActiveConversationId: f,
    setItems: c,
    setHeadId: d,
    setSessions: w,
    refreshSessions: S,
    applyConversationTree: h
  }), X = H(async (Z) => {
    var j, ie, de, pe, xe, Ee, Pe, Oe;
    const K = `${Z || ""}`.trim(), Q = I.current || ((ie = (j = R.current) == null ? void 0 : j.getConversationId) == null ? void 0 : ie.call(j)) || "";
    if (!K || K === Q || u) return;
    await p.current.stopStream(), ue(1200), oe(1200), E(!0), _("");
    const Y = ++b.current;
    P.current = !1, f(K), I.current = K, c([]), d(null), p.current.clearMessages();
    try {
      if (await new Promise((ye) => {
        window.setTimeout(ye, 80);
      }), Y !== b.current) return;
      try {
        (xe = (pe = (de = globalThis.document) == null ? void 0 : de.activeElement) == null ? void 0 : pe.blur) == null || xe.call(pe);
      } catch {
      }
      const ee = R.current, ne = g.current || `${await ((Ee = ee == null ? void 0 : ee.getDocumentId) == null ? void 0 : Ee.call(ee)) || ""}`.trim();
      if (Y !== b.current) return;
      g.current = ne;
      const le = me();
      if (!le) throw new Error("Reader conversations unavailable");
      const Ne = await le.get(K);
      if (Y !== b.current) return;
      ue(800), oe(800);
      const Me = Ie(Ne.messages || []);
      if (h(Me, Ne.head_id), (Pe = ee == null ? void 0 : ee.setConversationId) == null || Pe.call(ee, K, ne), P.current = !0, Me.length) {
        const ye = Ae(Me);
        Te(
          { jobId: e, documentId: ne },
          $e(
            ye,
            `${Ne.head_id || ""}`.trim() || ((Oe = ye.at(-1)) == null ? void 0 : Oe.message.id) || null
          ),
          K
        );
      } else
        he({ jobId: e, documentId: ne }, K);
      ne && await S(ne, Y), ue(350), oe(350);
    } catch (ee) {
      if (console.warn("[reader-ai] switch session failed", ee), Y === b.current) {
        _("加载该对话失败，请检查网络后重试。");
        const ne = et(
          { jobId: e, documentId: n || g.current },
          K
        );
        if (ne != null && ne.items.length) {
          const le = dt(ne);
          c(le.items), d(le.headId), p.current.showMessages(ce(le.items, le.headId));
        } else
          c([]), d(null);
        P.current = !0;
      }
    } finally {
      Y === b.current && E(!1);
    }
  }, [
    h,
    e,
    n,
    S,
    u
  ]), te = J(
    () => Vn(v, C, a),
    [v, C, a]
  ), re = J(() => ({
    refreshSessions: S,
    adoptRemoteConversationId: D,
    newSession: L,
    switchSession: X,
    removeSession: N,
    renameSession: F,
    branchFromAnswer: V
  }), [
    S,
    D,
    L,
    X,
    N,
    F,
    V
  ]);
  return {
    items: o,
    headId: m,
    messages: $,
    citationsByMessageId: A,
    progressByMessageId: l,
    contentByMessageId: q,
    sessions: te,
    activeConversationId: C || ((ae = a == null ? void 0 : a.getConversationId) == null ? void 0 : ae.call(a)) || "",
    sessionBusy: u,
    sessionError: O,
    resolveRequestScopeKey: M,
    tree: G,
    sessionCommands: re
  };
}
const er = "retainpdf.reader.ai.request.v1:", tr = Object.freeze({
  assistantMode: "reading",
  scope: "document",
  context: null
});
function lt(t, e) {
  return `${er}${`${t || ""}`.trim()}:${`${e || ""}`.trim()}`;
}
function nr(t) {
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
    return r ? nr(JSON.parse(r)) : null;
  } catch {
    return null;
  }
}
function rr(t) {
  const e = `${t.scopeKey || ""}`.trim(), n = `${t.jobId || ""}`.trim(), s = `${t.assistantMessageId || ""}`.trim();
  return Ke(e, s) || (e !== n ? Ke(n, s) : null) || tr;
}
function sr(t) {
  const { assistantMode: e, selectionContext: n } = t;
  return e === "operations" ? { assistantMode: e, scope: "document", context: null } : n ? { assistantMode: e, scope: "selection", context: { ...n } } : { assistantMode: e, scope: "document", context: null };
}
function ar(t) {
  var P;
  const { jobId: e, assistantMode: n, selectionContext: s = null, tree: a, chat: r, getScopeKey: o } = t, c = B(a);
  c.current = a;
  const m = B(r);
  m.current = r;
  const d = B(n);
  d.current = n;
  const v = B(s);
  v.current = s;
  const w = B(o);
  w.current = o;
  const C = r.status, f = C === "submitted" || C === "streaming", u = B(f);
  u.current = f;
  const E = f ? `${((P = Bn(r.messages)) == null ? void 0 : P.id) || ""}` : "", O = r.messages, _ = r.error;
  U(() => {
    if (!O.length) return;
    const y = new Map(O.map((b) => [b.id, b])), g = /* @__PURE__ */ new Map();
    for (const [b, k] of y)
      g.set(b, zn(k));
    c.current.mergeChatMirror(g);
  }, [O]), U(() => {
    !_ || C !== "error" || c.current.markRunningAsError(_.message);
  }, [_, C]);
  const z = H(async (y) => {
    if (u.current) return;
    const g = `${y || ""}`.trim();
    if (!g) return;
    const b = c.current, k = m.current, p = d.current, R = v.current, S = w.current(), h = b.readHeadId(), M = ke("u"), $ = ke("a"), A = sr({
      assistantMode: p,
      selectionContext: (R == null ? void 0 : R.selectionType) === "text" ? {
        page: R.page,
        page_idx: Math.max(0, R.page - 1),
        pane: R.pane,
        kind: "text",
        block_id: "",
        quoteText: R.quote
      } : R ? {
        page: R.page,
        page_idx: Math.max(0, R.page - 1),
        pane: R.pane,
        kind: R.kind,
        block_id: R.selectionType === "region" ? R.region.itemId : "",
        quoteText: Ze(R.region, R.pane)
      } : null
    });
    je(S, $, A), b.appendExchange({
      parentId: h,
      userId: M,
      assistantId: $,
      question: g,
      progress: A.assistantMode === "operations" ? "正在规划 PDF 操作…" : "正在理解文档…"
    }), await k.sendUserMessage(
      { id: M, role: "user", parts: [{ type: "text", text: g }] },
      {
        body: {
          assistantMessageId: $,
          assistantMode: A.assistantMode,
          parentId: h,
          question: g,
          regenerate: !1,
          userMessageId: M,
          scope: A.scope,
          context: A.context
        }
      }
    );
  }, []), T = H(async (y) => {
    if (u.current) return;
    const g = c.current, b = m.current, k = g.readItems(), p = k.find(
      (G) => G.message.id === y && G.message.role === "assistant"
    ), R = (p == null ? void 0 : p.parentId) ?? null, S = R ? Ln(k, R) : null;
    let h = "", M = R;
    if ((S == null ? void 0 : S.role) === "user")
      h = S.content.trim();
    else {
      const G = ce(k, R ?? g.readHeadId());
      for (let D = G.length - 1; D >= 0; D -= 1)
        if (G[D].role === "user") {
          h = G[D].content.trim(), M = G[D].id;
          break;
        }
    }
    if (!h) return;
    const $ = ke("a"), A = M || R, l = w.current(), q = rr({
      scopeKey: l,
      jobId: e,
      assistantMessageId: y
    });
    je(l, $, q), g.appendRetryTurn({ assistantId: $, branchParent: A }), b.replaceVisible(ct(ce(k, y))), await b.regenerateFrom({
      messageId: y,
      body: {
        assistantMessageId: $,
        assistantMode: q.assistantMode,
        parentId: A,
        question: h,
        regenerate: !0,
        userMessageId: M || "",
        scope: q.scope,
        context: q.context
      }
    });
  }, [e]), I = H(async () => {
    await m.current.stopStream(), c.current.markRunningCancelled();
  }, []);
  return {
    isRunning: f,
    streamingAssistantId: E,
    submitQuestion: z,
    retryAnswer: T,
    cancelAnswer: I
  };
}
const ir = "retainpdf.reader-agent-operation.action-key.v1:", or = "reader-";
function We(t, e) {
  return tn(t, e);
}
function cr(t) {
  return en(t);
}
function dr(t, e) {
  return Zt(t, e);
}
function lr(t) {
  return nn(t);
}
function ur(t) {
  return rn(t);
}
function pr({
  conversationId: t,
  enabled: e,
  discovering: n,
  signal: s,
  confirmationModeHint: a,
  onDocumentCommitted: r
}) {
  const [o, c] = W({}), [m, d] = W("explicit"), [v, w] = W(!1), [C, f] = W(!1), u = B(/* @__PURE__ */ new Set()), E = B(/* @__PURE__ */ new Set()), O = B(/* @__PURE__ */ new Set()), _ = H((y, g = !1) => {
    y != null && y.operation_id && c((b) => {
      const k = b[y.operation_id];
      return dr(k == null ? void 0 : k.operation, y) ? {
        ...b,
        [y.operation_id]: {
          ...k,
          operation: y,
          pendingAction: void 0,
          error: void 0
        }
      } : !g || !(k != null && k.pendingAction) ? b : {
        ...b,
        [y.operation_id]: { ...k, pendingAction: void 0 }
      };
    });
  }, []), z = H(async (y, g = !1) => {
    const b = `${y || ""}`.trim(), k = `refresh:${b}`;
    if (!(!b || u.current.has(k))) {
      u.current.add(k);
      try {
        const p = fe();
        if (!p) return;
        _(await p.get(b), g);
      } catch {
      } finally {
        u.current.delete(k);
      }
    }
  }, [_]), T = H(async () => {
    const y = `${t || ""}`.trim(), g = `recover:${y}`;
    if (!(!e || !y || u.current.has(g))) {
      u.current.add(g);
      try {
        const b = fe();
        if (!b) return;
        const k = await b.list(y, {});
        if (!O.current.has(y)) {
          for (const p of k.operations || [])
            p.status === "committed" && E.current.add(p.operation_id);
          O.current.add(y);
        }
        for (const p of k.operations || []) _(p);
      } catch {
      } finally {
        u.current.delete(g);
      }
    }
  }, [t, e, _]);
  U(() => {
    if (!e) return;
    let y = !1;
    const g = async () => {
      try {
        const k = fe();
        if (!k) return;
        const p = await k.fetchRuntimeConfig();
        if (y) return;
        d(p.agent_confirmation_mode || "explicit"), f(!!p.llm_api_key_configured), w(
          p.restart_required || p.restart_state === "pending" || p.active_revision !== p.configured_revision
        );
      } catch {
        y || (w(!1), f(!1));
      }
    };
    g();
    const b = window.setInterval(g, 3e3);
    return () => {
      y = !0, window.clearInterval(b);
    };
  }, [e]), U(() => {
    a && d(a);
  }, [a]), U(() => {
    s != null && s.confirmationMode && d(s.confirmationMode), s != null && s.operationId && z(s.operationId);
  }, [z, s]), U(() => {
    T();
  }, [T]), U(() => {
    n || T();
  }, [n, T]);
  const I = J(
    () => Object.values(o).filter((y) => !!t && y.operation.conversation_id === t).sort((y, g) => `${y.operation.created_at || ""}`.localeCompare(`${g.operation.created_at || ""}`)),
    [t, o]
  );
  U(() => {
    var y;
    for (const g of I) {
      const b = g.operation;
      b.status !== "committed" || E.current.has(b.operation_id) || (E.current.add(b.operation_id), r == null || r({
        documentId: b.document_id,
        revision: ((y = b.candidate) == null ? void 0 : y.version_id) || `${b.updated_at || ""}` || `${b.operation_id}:${cr(b)}`
      }));
    }
  }, [I, r]);
  const P = I.some((y) => We(y.operation.status, m));
  return U(() => {
    if (!e || !t || !n && !P) return;
    const y = window.setInterval(() => {
      T();
      for (const g of I)
        We(g.operation.status, m) && z(g.operation.operation_id);
    }, 1400);
    return () => window.clearInterval(y);
  }, [m, t, n, e, I, P, T, z]), U(() => {
    if (!e) return;
    const y = () => void T(), g = () => {
      document.visibilityState === "visible" && y();
    };
    return window.addEventListener("online", y), document.addEventListener("visibilitychange", g), () => {
      window.removeEventListener("online", y), document.removeEventListener("visibilitychange", g);
    };
  }, [e, T]), {
    entries: I,
    confirmationMode: m,
    runtimeRestarting: v,
    runtimeCredentialConfigured: C,
    setEntriesById: c,
    inFlightRef: u,
    upsert: _,
    refresh: z
  };
}
function mr() {
  try {
    return globalThis.sessionStorage;
  } catch {
    return;
  }
}
function ut() {
  return {
    storagePrefix: ir,
    keyPrefix: or,
    storage: mr()
  };
}
function fr(t, e, n) {
  return sn(t, e, n, ut());
}
function Ue(t, e, n) {
  an(t, e, n, ut());
}
function hr({
  refresh: t,
  upsert: e,
  setEntriesById: n,
  inFlightRef: s
}) {
  const a = B(/* @__PURE__ */ new Map());
  return { perform: H(async (o, c, m = {}) => {
    const d = `${c.operation_id || ""}`.trim(), v = `action:${d}`;
    if (!d || s.current.has(v)) return;
    if (o === "retry" && c.status === "ambiguous" && m.acceptDuplicateRisk !== !0) {
      n((f) => ({
        ...f,
        [d]: {
          ...f[d],
          error: "请先确认重复执行风险，再重新执行操作。"
        }
      }));
      return;
    }
    const w = fr(d, o, a.current);
    s.current.add(v), n((f) => ({
      ...f,
      [d]: { ...f[d], pendingAction: o, error: void 0 }
    }));
    const C = {
      idempotency_key: w,
      expected_status: c.status,
      expected_attempt: c.current_attempt,
      expected_program_sha256: c.program_sha256 || ""
    };
    try {
      const f = fe();
      if (!f) throw new Error("Reader AI operations unavailable");
      let u;
      o === "run" ? u = await f.run(d, C) : o === "cancel" ? u = await f.cancel(d, { ...C, reason: "user_rejected" }) : o === "commit" ? u = await f.commit(d, C) : u = await f.retry(d, m.acceptDuplicateRisk ? { ...C, accept_duplicate_risk: !0 } : C), Ue(d, o, a.current), e(u, !0);
    } catch (f) {
      lr(f) === 409 ? (Ue(d, o, a.current), await t(d, !0)) : n((u) => ({
        ...u,
        [d]: {
          ...u[d],
          pendingAction: void 0,
          error: ur(f)
        }
      }));
    } finally {
      s.current.delete(v);
    }
  }, [t, e]) };
}
function gr({
  conversationId: t,
  enabled: e,
  discovering: n,
  signal: s,
  confirmationModeHint: a,
  onDocumentCommitted: r
}) {
  const o = pr({
    conversationId: t,
    enabled: e,
    discovering: n,
    signal: s,
    confirmationModeHint: a,
    onDocumentCommitted: r
  }), { perform: c } = hr({
    refresh: o.refresh,
    upsert: o.upsert,
    setEntriesById: o.setEntriesById,
    inFlightRef: o.inFlightRef
  }), m = H((d) => {
    var v;
    return ((v = fe()) == null ? void 0 : v.fetchCandidate(d.operation_id)) ?? Promise.reject(new Error("Reader AI operations unavailable"));
  }, []);
  return {
    entries: o.entries,
    confirmationMode: o.confirmationMode,
    runtimeRestarting: o.runtimeRestarting,
    runtimeCredentialConfigured: o.runtimeCredentialConfigured,
    perform: c,
    loadCandidate: m
  };
}
function yr(t) {
  var k;
  const {
    jobId: e,
    documentId: n = "",
    sessionIdentity: s = "",
    enabled: a,
    selectionContext: r = null,
    onDocumentCommitted: o
  } = t, c = `${e}\0${n}\0${s}`, [m, d] = W("reading"), [v, w] = W(null), [C, f] = W();
  U(() => {
    d("reading"), w(null), f(void 0);
  }, [c]);
  const u = J(() => {
    var p;
    return !a || !e ? null : ((p = De()) == null ? void 0 : p.createRemoteAnswerer({ jobId: e, documentId: n })) ?? xt({ jobId: e, documentId: n });
  }, [n, a, e]), E = J(() => {
    var p;
    return !a || !e ? null : ((p = De()) == null ? void 0 : p.createLocalAnswerer({ jobId: e })) ?? Ht({
      loadMarkdownPayload: Et.loadMarkdownPayload
    });
  }, [a, e]), O = B(null), _ = qn({
    jobId: e,
    enabled: a,
    remoteAnswerer: u,
    localAnswerer: E,
    assistantMode: m,
    onAgentOperationSignal: (p) => {
      w({ ...p, nonce: Date.now() + Math.random() });
    },
    onConfirmationMode: f,
    onStopped: () => {
      var p;
      return (p = O.current) == null ? void 0 : p.markRunningCancelled();
    }
  }), z = J(() => ({
    messages: _.messages,
    status: _.status,
    error: _.error,
    sendUserMessage: (p, R) => _.sendMessage(
      p,
      R
    ),
    regenerateFrom: (p) => _.regenerate(
      p
    ),
    stopStream: () => _.stop(),
    replaceVisible: (p) => _.setMessages([...p])
  }), [_]), T = J(() => ({
    stopStream: () => z.stopStream(),
    clearMessages: () => z.replaceVisible([]),
    showMessages: (p) => z.replaceVisible(ct(p))
  }), [z]), I = Zn({
    jobId: e,
    documentId: n,
    enabled: a,
    remoteAnswerer: u,
    stream: T
  });
  O.current = I.tree;
  const P = ar({
    jobId: e,
    assistantMode: m,
    selectionContext: r,
    tree: I.tree,
    chat: z,
    getScopeKey: () => I.resolveRequestScopeKey()
  }), y = I.activeConversationId || (v == null ? void 0 : v.conversationId) || `${((k = u == null ? void 0 : u.getConversationId) == null ? void 0 : k.call(u)) || ""}`.trim(), g = gr({
    conversationId: y,
    enabled: a,
    discovering: P.isRunning,
    signal: v,
    confirmationModeHint: C,
    onDocumentCommitted: o
  }), b = B(!1);
  return U(() => {
    b.current = !1;
  }, [e]), U(() => {
    b.current = !1;
  }, [c]), U(() => {
    b.current && !P.isRunning && (I.sessionCommands.refreshSessions(), I.sessionCommands.adoptRemoteConversationId()), b.current = P.isRunning;
  }, [I, P.isRunning]), {
    citationsByMessageId: I.citationsByMessageId,
    progressByMessageId: I.progressByMessageId,
    contentByMessageId: I.contentByMessageId,
    streamingAssistantId: P.streamingAssistantId,
    isRunning: P.isRunning,
    messages: I.messages,
    sessions: I.sessions,
    activeConversationId: I.activeConversationId,
    sessionBusy: I.sessionBusy,
    sessionError: I.sessionError,
    submitQuestion: P.submitQuestion,
    retryAnswer: P.retryAnswer,
    cancelAnswer: P.cancelAnswer,
    newSession: I.sessionCommands.newSession,
    switchSession: I.sessionCommands.switchSession,
    removeSession: I.sessionCommands.removeSession,
    renameSession: I.sessionCommands.renameSession,
    branchFromAnswer: I.sessionCommands.branchFromAnswer,
    agentOperations: g,
    assistantMode: m,
    setAssistantMode: d
  };
}
function Or({
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
  const w = t && !!e, {
    citationsByMessageId: C,
    progressByMessageId: f,
    contentByMessageId: u,
    streamingAssistantId: E,
    isRunning: O,
    sessions: _,
    activeConversationId: z,
    sessionBusy: T,
    sessionError: I,
    messages: P,
    submitQuestion: y,
    retryAnswer: g,
    cancelAnswer: b,
    newSession: k,
    switchSession: p,
    removeSession: R,
    renameSession: S,
    branchFromAnswer: h,
    agentOperations: M,
    assistantMode: $,
    setAssistantMode: A
  } = yr({
    jobId: e,
    documentId: n,
    sessionIdentity: s,
    enabled: w,
    selectionContext: d,
    onDocumentCommitted: o
  }), [l, q] = W(""), G = H(async (L) => {
    q(""), await h(L) && (q(
      "已保存新对话（fork-n-原名）：复制了到此答案的上文，原对话不变。顶部列表可切换。"
    ), window.setTimeout(() => q(""), 6e3));
  }, [h]), D = H((L) => {
    r(L);
  }, [r]);
  return /* @__PURE__ */ i(
    Pt,
    {
      id: "reader-ai-panel",
      open: t,
      title: "RetainPDF AI",
      titleIcon: /* @__PURE__ */ i(ge, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.ai-float.pos.v2",
      ariaLabel: "阅读问答",
      width: 420,
      placement: c === "workspace" ? "workspace" : c === "docked" ? "dock-right" : "floating",
      showHeader: c !== "workspace",
      className: `reader-float-ai is-${c}${c === "workspace" ? ` is-pane-${m}` : ""}${T ? " is-session-busy" : ""}`,
      onClose: a,
      children: e ? /* @__PURE__ */ x("div", { className: "reader-float-ai-body", children: [
        /* @__PURE__ */ i(
          En,
          {
            sessions: _,
            activeId: z,
            busy: T,
            errorText: I,
            onSwitch: p,
            onNew: k,
            onDelete: R,
            onRename: S
          }
        ),
        l ? /* @__PURE__ */ i("div", { className: "aui-session-banner", role: "status", children: l }) : null,
        /* @__PURE__ */ i("div", { className: "reader-float-ai-thread-wrap", "aria-busy": T || void 0, children: /* @__PURE__ */ i(
          xn,
          {
            jobId: e,
            messages: P,
            citationsByMessageId: C,
            progressByMessageId: f,
            contentByMessageId: u,
            streamingAssistantId: E,
            isRunning: O,
            onSubmit: y,
            onRetry: g,
            onCancel: b,
            onJumpCitation: D,
            onBranchFromAnswer: G,
            branchBusy: T,
            agentOperations: M,
            assistantMode: $,
            onAssistantModeChange: A,
            selectionContext: d,
            onClearSelectionContext: v
          }
        ) })
      ] }) : /* @__PURE__ */ x("div", { className: "reader-float-ai-empty", children: [
        /* @__PURE__ */ i(ge, { size: 22, strokeWidth: 1.75, "aria-hidden": !0 }),
        /* @__PURE__ */ i("p", { children: "当前文档还没有可用于 AI 的解析产物" }),
        /* @__PURE__ */ i("span", { children: "请先完成 OCR 文档解析" })
      ] })
    }
  );
}
export {
  Or as ReaderAiPanel
};
//# sourceMappingURL=ReaderAiPanel-BYMoql6X.js.map
