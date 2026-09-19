import { jsx as i, jsxs as E, Fragment as be } from "react/jsx-runtime";
import { useState as W, useRef as B, useEffect as U, useMemo as Q, useCallback as H, useId as pt } from "react";
import { Square as mt, ArrowUp as ft, Copy as ht, GitBranch as gt, RefreshCw as yt, Sigma as He, Table2 as wt, Image as It, Type as vt, X as Re, BookOpen as Ge, Sparkles as ge, Loader2 as Ce, FileText as Ae, ArrowDown as Ve, ListTree as bt, FlaskConical as Rt, ShieldCheck as Ct, Bot as Mt, ChevronUp as Nt, ChevronDown as Ye, TriangleAlert as Je, ExternalLink as _t, Check as Qe, Circle as kt, Plus as At, Pencil as St, Trash2 as $t } from "lucide-react";
import { g as me, h as fe, i as De, j as xt, d as Tt, b as Et } from "./ReaderApp-CCbPO1TU.js";
import { ThreadPrimitive as se, ComposerPrimitive as we, MessagePrimitive as Xe, ActionBarPrimitive as _e, useExternalStoreRuntime as Pt, AssistantRuntimeProvider as Ot } from "@assistant-ui/react";
import { A as Dt } from "./AiMarkdownAnswer-6TVFe9T9.js";
import { r as Ze } from "./reader-regions-DsePY7B_.js";
import { M as Ft, C as Fe, h as zt } from "./config-CgaWliJ_.js";
import { b as ue, n as oe, q as qt } from "./answer-enhance-D8zK9znw.js";
import { Chat as Bt, useChat as Lt } from "@ai-sdk/react";
import { s as jt, l as et, c as he, b as $e, a as Kt } from "./thread-branch-store-Jy9wH_F1.js";
import { describeToolEvent as Wt } from "@retainpdf/domain/ai";
import { toSessionSummary as Ut } from "@retainpdf/domain/session";
import { l as Ht } from "./ask-answerer-GNQdzitl.js";
import { getConversation as ze, messagesToBranchItems as ve, nextForkConversationTitle as Gt } from "@retainpdf/api/conversations";
import { c as ke } from "./ai-chat-ZSCffLDD.js";
import { agentOperationShouldReplace as Vt, agentOperationEventSeq as Yt, agentOperationShouldPoll as Jt, agentOperationErrorStatus as Qt, agentOperationErrorMessage as Xt, resolveAgentOperationActionKey as Zt, clearAgentOperationActionKey as en } from "@retainpdf/api/agent-operation-model";
function tt(t) {
  return t.content.filter((e) => e.type === "text").map((e) => e.text).join(`
`).trim();
}
function qe({ label: t }) {
  return /* @__PURE__ */ E("div", { className: "aui-thinking", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ i(Ce, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
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
  const m = tt(e);
  return /* @__PURE__ */ i(Xe.Root, { className: "aui-msg aui-msg-assistant", "data-role": "assistant", children: /* @__PURE__ */ E("div", { className: "aui-msg-stack", children: [
    a && s ? /* @__PURE__ */ i(qe, { label: s }) : null,
    a && !s && !m ? /* @__PURE__ */ i(qe, { label: "思考中…" }) : null,
    m ? /* @__PURE__ */ i("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ i(
      Dt,
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
                ue(1200, { overlayDelayMs: 0 }), oe(1200), await d(e.id);
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
          /* @__PURE__ */ i(ge, { size: 12, strokeWidth: 2.2, "aria-hidden": !0 }),
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
    /* @__PURE__ */ i(n === "formula" ? He : n === "table" ? wt : n === "figure" ? It : vt, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
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
  return /* @__PURE__ */ E(we.Root, { className: "aui-composer", "data-reader-ai-composer": "", children: [
    /* @__PURE__ */ E("div", { className: "aui-composer-shell", children: [
      n !== "operations" ? /* @__PURE__ */ i(sn, { selectionContext: a, onClear: r }) : null,
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
      /* @__PURE__ */ E("div", { className: "aui-composer-toolbar", children: [
        /* @__PURE__ */ i(rn, { mode: n, disabled: t || e, onChange: s }),
        /* @__PURE__ */ i("div", { className: "aui-composer-actions", children: t ? /* @__PURE__ */ i(we.Cancel, { className: "aui-send aui-send-stop", "aria-label": "停止生成", children: /* @__PURE__ */ i(mt, { size: 12, strokeWidth: 2.6, "aria-hidden": !0 }) }) : /* @__PURE__ */ i(we.Send, { className: "aui-send", "aria-label": "发送", children: /* @__PURE__ */ i(ft, { size: 16, strokeWidth: 2.5, "aria-hidden": !0 }) }) })
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
  agentRequestBlocked: m = !1,
  agentOperationPanel: c,
  onModeChange: I,
  onJumpCitation: w,
  onBranchFromAnswer: C
}) {
  const f = d || m;
  return /* @__PURE__ */ E(be, { children: [
    e ? /* @__PURE__ */ E("div", { className: "aui-empty", children: [
      /* @__PURE__ */ i("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ i("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ i(ge, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ i("h2", { className: "aui-empty-title", children: "想怎样处理 PDF？" }),
      /* @__PURE__ */ i("p", { className: "aui-empty-sub", children: "创建候选版本后由你预览和确认" }),
      /* @__PURE__ */ i("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: an.map((u) => {
        const T = u.icon;
        return /* @__PURE__ */ E(
          se.Suggestion,
          {
            prompt: u.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: f || o,
            children: [
              /* @__PURE__ */ i(T, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
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
        branchBusy: d,
        onJumpCitation: w,
        onBranchFromAnswer: C
      }
    ),
    c,
    /* @__PURE__ */ E(se.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !d ? /* @__PURE__ */ i(
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
          onModeChange: I,
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
  composerDisabled: m = !1,
  onModeChange: c,
  onJumpCitation: I,
  onBranchFromAnswer: w,
  selectionContext: C = null,
  onClearSelectionContext: f,
  footerExtra: u = null
}) {
  return /* @__PURE__ */ E(be, { children: [
    e ? /* @__PURE__ */ E("div", { className: "aui-empty", children: [
      /* @__PURE__ */ i("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ i("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ i(ge, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ i("h2", { className: "aui-empty-title", children: "一起读懂这篇文档" }),
      /* @__PURE__ */ i("p", { className: "aui-empty-sub", children: "总结、解释、检索与计算，不修改 PDF" }),
      /* @__PURE__ */ i("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: cn.map((T) => {
        const O = T.icon;
        return /* @__PURE__ */ E(
          se.Suggestion,
          {
            prompt: T.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: d || m || o,
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
        onJumpCitation: I,
        onBranchFromAnswer: w
      }
    ),
    u,
    /* @__PURE__ */ E(se.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !d ? /* @__PURE__ */ i(
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
          branchBusy: d || m,
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
  agentRequestBlocked: m = !1,
  agentOperationPanel: c,
  assistantMode: I = "reading",
  onAssistantModeChange: w,
  onJumpCitation: C,
  onBranchFromAnswer: f,
  selectionContext: u = null,
  onClearSelectionContext: T
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
              onModeChange: w,
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
              composerDisabled: m,
              onModeChange: w,
              onJumpCitation: C,
              onBranchFromAnswer: f,
              selectionContext: u,
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
  return t === "failed" || t === "ambiguous" ? Je : t === "cancelled" ? Re : t === "committed" || t === "result_ready" ? Qe : ["queued", "running", "validating"].includes(t) ? Ce : kt;
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
  const [n, s] = W(!1), [a, r] = W(""), [o, d] = W(""), m = B("");
  return U(() => {
    let c = !1;
    return d(""), e(t).then((I) => {
      if (c) return;
      const w = URL.createObjectURL(I);
      m.current && URL.revokeObjectURL(m.current), m.current = w, r(w);
    }).catch(() => {
      c || d("候选 PDF 加载失败，请重试。");
    }), () => {
      c = !0;
    };
  }, [e, t.operation_id, t.current_attempt]), U(() => () => {
    m.current && URL.revokeObjectURL(m.current);
  }, []), /* @__PURE__ */ E(be, { children: [
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
function wn({
  entry: t,
  mode: e,
  loadCandidate: n,
  onAction: s,
  onDismiss: a
}) {
  var O;
  const { operation: r, pendingAction: o, error: d } = t, [m, c] = W(!1), [I, w] = W(!1), C = r.events || [], f = fn(r.status), u = !!((r.status === "result_ready" || r.status === "committed") && r.candidate_available), T = un.has(r.status);
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
            children: /* @__PURE__ */ i(Re, { size: 13, "aria-hidden": !0 })
          }
        ) : null
      ] })
    ] }),
    (O = r.affected_pages) != null && O.length ? /* @__PURE__ */ E("p", { className: "reader-agent-operation-scope", children: [
      "影响页码：",
      r.affected_pages.join("、")
    ] }) : null,
    C.length ? /* @__PURE__ */ E("div", { className: "reader-agent-operation-details", children: [
      /* @__PURE__ */ E("button", { type: "button", onClick: () => c((_) => !_), children: [
        m ? /* @__PURE__ */ i(Nt, { size: 12, "aria-hidden": !0 }) : /* @__PURE__ */ i(Ye, { size: 12, "aria-hidden": !0 }),
        m ? "收起步骤" : `执行步骤 ${C.length}`
      ] }),
      m ? /* @__PURE__ */ i(gn, { events: C, mode: e }) : null
    ] }) : null,
    u ? /* @__PURE__ */ i(yn, { operation: r, loadCandidate: n }) : null,
    d ? /* @__PURE__ */ i("p", { className: "reader-agent-operation-error", role: "alert", children: d }) : null,
    I ? /* @__PURE__ */ E("div", { className: "reader-agent-operation-risk", role: "alertdialog", "aria-label": "确认重复执行风险", children: [
      /* @__PURE__ */ i(Je, { size: 14, "aria-hidden": !0 }),
      /* @__PURE__ */ i("p", { children: "上一次执行结果不确定，重试可能重复操作。确认接受风险后再继续。" }),
      /* @__PURE__ */ E("div", { children: [
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
function In({
  entries: t,
  confirmationMode: e,
  runtimeRestarting: n,
  loadCandidate: s,
  onAction: a
}) {
  const [r, o] = W(pn), d = t.filter((c) => !r.has(Be(c.operation)));
  function m(c) {
    const I = Be(c);
    o((w) => {
      const C = new Set(w);
      return C.add(I), mn(C), C;
    });
  }
  return /* @__PURE__ */ E("section", { className: `reader-agent-operations${d.length ? " has-operations" : ""}`, "aria-label": "AI PDF 操作", children: [
    /* @__PURE__ */ E("div", { className: `reader-agent-mode${e === "green_light" ? " is-green" : ""}`, children: [
      /* @__PURE__ */ i(Ct, { size: 13, "aria-hidden": !0 }),
      /* @__PURE__ */ i("span", { children: e === "green_light" ? "绿灯模式 · 自动执行并应用" : "需要确认 · 操作前等待授权" })
    ] }),
    n ? /* @__PURE__ */ E("div", { className: "reader-agent-restarting", role: "status", children: [
      /* @__PURE__ */ i(Ce, { className: "is-spinning", size: 13, "aria-hidden": !0 }),
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
const vn = (t) => t, bn = Object.freeze([]), Rn = Object.freeze({}), Le = Object.freeze({}), Cn = Object.freeze({
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
  onRetry: m,
  onCancel: c,
  onJumpCitation: I,
  onBranchFromAnswer: w,
  branchBusy: C = !1,
  agentOperations: f = Cn,
  assistantMode: u = "reading",
  onAssistantModeChange: T,
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
  const $ = !zt() && !f.runtimeCredentialConfigured, v = Q(() => e.map((p) => ({
    id: p.id,
    role: p.role,
    content: a[p.id] || p.content || "",
    ...p.role === "assistant" ? { status: Nn(p, r, o) } : {}
  })), [a, o, e, r]), P = H(async (p) => {
    const R = p ? Math.max(0, e.findIndex((h) => h.id === p) + 1) : 0, A = e.slice(R).find((h) => h.role === "assistant");
    A && await m(A.id);
  }, [e, m]), y = H(async (p) => {
    const R = Mn(p);
    !R || o || C || f.runtimeRestarting || $ || await d(R);
  }, [f.runtimeRestarting, C, o, $, d]), g = H(async () => {
    await c();
  }, [c]), b = Q(() => ({
    messages: v,
    isRunning: o,
    isDisabled: C || f.runtimeRestarting || $,
    convertMessage: vn,
    onNew: y,
    onReload: P,
    onCancel: g
  }), [
    f.runtimeRestarting,
    C,
    g,
    y,
    o,
    $,
    P,
    v
  ]), k = Pt(b);
  return /* @__PURE__ */ i(Ot, { runtime: k, children: /* @__PURE__ */ i(
    ln,
    {
      jobId: t,
      messages: e,
      citationsByMessageId: n,
      progressByMessageId: s,
      streamingAssistantId: r,
      isRunning: o,
      missingLlmKey: $,
      branchBusy: C,
      agentRequestBlocked: f.runtimeRestarting,
      assistantMode: u,
      onAssistantModeChange: T,
      selectionContext: O,
      onClearSelectionContext: _,
      agentOperationPanel: f.entries.length > 0 || f.runtimeRestarting ? /* @__PURE__ */ i(
        In,
        {
          entries: f.entries,
          confirmationMode: f.confirmationMode,
          runtimeRestarting: f.runtimeRestarting,
          loadCandidate: f.loadCandidate,
          onAction: f.perform
        }
      ) : null,
      onJumpCitation: I,
      onBranchFromAnswer: w
    }
  ) });
}
function Ie(t = 900, e = 0) {
  ue(t, { overlayDelayMs: e }), oe(t);
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
  const c = t.length > 0, I = n || s, [w, C] = W(!1), [f, u] = W(""), [T, O] = W(""), _ = B(null), z = pt();
  function $(h) {
    const N = `${h || ""}`.match(/^fork-(\d+)-(.*)$/i);
    if (!N) return h;
    const x = N[2].trim();
    return x ? `${x} · 分支${N[1]}` : `分支${N[1]}`;
  }
  const v = B(!1), P = B(null), y = t.find((h) => h.id === e) || null, g = y ? y.messageCount ? $(y.title) : `${$(y.title)}（空）` : c ? "选择以往对话" : "新对话";
  U(() => {
    if (!w) {
      u("");
      return;
    }
    const h = (S) => {
      if (v.current) return;
      const l = _.current;
      l && (S.target instanceof Node && l.contains(S.target) || (C(!1), u("")));
    }, N = (S) => {
      S.key === "Escape" && (C(!1), u(""));
    }, x = window.setTimeout(() => {
      document.addEventListener("pointerdown", h, !0);
    }, 0);
    return document.addEventListener("keydown", N), () => {
      window.clearTimeout(x), document.removeEventListener("pointerdown", h, !0), document.removeEventListener("keydown", N);
    };
  }, [w]), U(() => {
    if (!f) return;
    const h = P.current;
    h && (h.focus(), h.select());
  }, [f]);
  const b = (h) => {
    const N = `${h || ""}`.trim();
    !N || I || v.current || f || (v.current = !0, Ie(1e3, 0), requestAnimationFrame(() => {
      C(!1), window.setTimeout(() => {
        (async () => {
          try {
            await r(N);
          } finally {
            Ie(400, 0), v.current = !1;
          }
        })();
      }, 40);
    }));
  }, k = (h) => {
    I || (u(h.id), O(h.title || ""));
  }, p = () => {
    const h = f, N = T;
    u(""), h && m(h, N);
  }, R = () => {
    u(""), O("");
  }, A = (h) => {
    var S;
    if (I || v.current) return;
    const N = h.title || "未命名对话";
    (S = globalThis.confirm) != null && S.call(globalThis, `确定删除对话「${N}」？此操作不可恢复。`) && (v.current = !0, Ie(800, 0), (async () => {
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
              className: `aui-session-trigger${w ? " is-open" : ""}`,
              "aria-label": "切换对话窗口",
              "aria-haspopup": "listbox",
              "aria-expanded": w,
              "aria-controls": z,
              disabled: I || !c,
              title: g,
              onClick: () => {
                I || !c || C((h) => !h);
              },
              children: [
                /* @__PURE__ */ i("span", { className: "aui-session-trigger-label", children: g }),
                /* @__PURE__ */ i(Ye, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 })
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
                I || v.current || (v.current = !0, Ie(800), C(!1), u(""), window.setTimeout(() => {
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
                n ? /* @__PURE__ */ i(Ce, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ i(At, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
                /* @__PURE__ */ i("span", { children: "新对话" })
              ]
            }
          )
        ] }),
        w && c ? /* @__PURE__ */ i(
          "ul",
          {
            id: z,
            className: "aui-session-list",
            role: "listbox",
            "aria-label": "以往对话",
            children: t.map((h) => {
              const N = h.messageCount ? $(h.title) : `${$(h.title)}（空）`, x = h.id === e, S = f === h.id;
              return /* @__PURE__ */ i("li", { className: "aui-session-row-item", role: "presentation", children: S ? /* @__PURE__ */ E("div", { className: "aui-session-edit", children: [
                /* @__PURE__ */ i(
                  "input",
                  {
                    ref: P,
                    className: "aui-session-edit-input",
                    value: T,
                    maxLength: 80,
                    "aria-label": "对话标题",
                    disabled: I,
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
                    disabled: I || !T.trim(),
                    onClick: (l) => {
                      l.stopPropagation(), p();
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
                    disabled: I,
                    onClick: (l) => {
                      l.stopPropagation(), R();
                    },
                    children: /* @__PURE__ */ i(Re, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }) : /* @__PURE__ */ E(be, { children: [
                /* @__PURE__ */ E(
                  "button",
                  {
                    type: "button",
                    role: "option",
                    "aria-selected": x,
                    className: `aui-session-item${x ? " is-active" : ""}`,
                    disabled: I,
                    title: N,
                    onPointerDown: (l) => {
                      l.stopPropagation(), !x && !I && oe(1e3);
                    },
                    onClick: (l) => {
                      if (l.preventDefault(), l.stopPropagation(), x) {
                        C(!1);
                        return;
                      }
                      b(h.id);
                    },
                    children: [
                      /* @__PURE__ */ i("span", { className: "aui-session-item-title", children: N }),
                      x ? /* @__PURE__ */ i("span", { className: "aui-session-item-badge", children: "当前" }) : null
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
                    disabled: I,
                    onClick: (l) => {
                      l.preventDefault(), l.stopPropagation(), k(h);
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
                    disabled: I,
                    onClick: (l) => {
                      l.preventDefault(), l.stopPropagation(), A(h);
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
class $n {
  constructor(e) {
    this.options = e;
  }
  async sendMessages({
    abortSignal: e,
    body: n,
    messages: s,
    trigger: a
  }) {
    var O, _, z, $;
    const r = n || {}, o = An(s, r);
    if (!o) throw new Error("请输入问题。");
    const d = r.assistantMode || ((_ = (O = this.options).getAssistantMode) == null ? void 0 : _.call(O)) || "reading", m = r.scope || "document", c = r.context ? { ...r.context } : null, I = `${r.assistantMessageId || ""}`.trim() || `a-${Date.now().toString(36)}`, w = `${I}-text`, C = this.options.getRemoteAnswerer(), f = (($ = (z = this.options).getLocalAnswerer) == null ? void 0 : $.call(z)) || null;
    if (!C && !f)
      throw new Error("问答暂不可用：请确认已打开任务阅读器。");
    let u = !1;
    const T = /* @__PURE__ */ new Set();
    return new ReadableStream({
      cancel: () => {
        u = !0;
      },
      start: (v) => {
        let P = "", y = {
          citations: [],
          progress: a === "regenerate-message" ? "正在重新生成…" : "正在检索文档…",
          status: "running"
        };
        const g = (k) => {
          if (!u)
            try {
              v.enqueue(k);
            } catch {
              u = !0;
            }
        }, b = (k) => {
          y = { ...y, ...k }, g({ type: "message-metadata", messageMetadata: y });
        };
        g({ type: "start", messageId: I, messageMetadata: y }), g({ type: "start-step" }), g({ type: "text-start", id: w }), (async () => {
          var k, p, R, A, h, N;
          try {
            if (await ((k = C == null ? void 0 : C.ensureLoaded) == null ? void 0 : k.call(C, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
            let x = C || f, S = !1, l;
            try {
              l = await x.answer({
                question: o,
                assistantMode: d,
                scope: m,
                context: c,
                parentId: `${r.parentId || ""}`.trim(),
                regenerate: r.regenerate ?? a === "regenerate-message",
                userMessageId: `${r.userMessageId || ""}`.trim(),
                assistantMessageId: I,
                onAgentSessionEvent: (M) => {
                  var X, te, re;
                  const F = (X = M == null ? void 0 : M.capabilities) == null ? void 0 : X.document_operation_confirmation_mode;
                  (F === "explicit" || F === "green_light") && ((re = (te = this.options).onConfirmationMode) == null || re.call(te, F));
                },
                onAgentOperationEvent: (M) => {
                  var X, te;
                  const F = `${(M == null ? void 0 : M.operation_id) || ""}`.trim();
                  F && ((te = (X = this.options).onAgentOperationSignal) == null || te.call(X, {
                    operationId: F,
                    conversationId: `${(M == null ? void 0 : M.conversation_id) || ""}`.trim() || void 0
                  }));
                },
                onAgentConfirmationRequiredEvent: (M) => {
                  var ae, Z;
                  const F = `${(M == null ? void 0 : M.operation_id) || ""}`.trim();
                  if (!F) return;
                  const X = `${(M == null ? void 0 : M.action) || ""}`, te = `${(M == null ? void 0 : M.current_attempt) ?? ""}`, re = `${F}:${te}:${X}`;
                  T.has(re) || (T.add(re), (Z = (ae = this.options).onAgentOperationSignal) == null || Z.call(ae, { operationId: F }));
                },
                onToolEvent: (M) => {
                  if (P || e != null && e.aborted) return;
                  const F = Wt(M);
                  F && b({ progress: F });
                },
                onProgressEvent: (M) => {
                  if (P || e != null && e.aborted) return;
                  const F = `${(M == null ? void 0 : M.message) || ""}`.trim();
                  F && b({ progress: F });
                },
                onAnswerDelta: (M, F) => {
                  !F || e != null && e.aborted || (P += F, y.progress && b({ progress: "" }), g({ type: "text-delta", id: w, delta: F }));
                },
                onCompress: (M) => {
                  if (P || e != null && e.aborted) return;
                  const F = Number(M == null ? void 0 : M.dropped_turns) || 0;
                  F && b({ progress: `已压缩 ${F} 轮早期对话` });
                },
                signal: e
              });
            } catch (M) {
              if (e != null && e.aborted || d === "operations" || !C || !f || !Sn(M)) throw M;
              if (S = !0, b({ progress: "在线服务暂不可用，改用本地检索…" }), await ((p = f.ensureLoaded) == null ? void 0 : p.call(f, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
              x = f, l = await x.answer({
                question: o,
                assistantMode: d,
                scope: m,
                context: c,
                signal: e
              });
            }
            if (e != null && e.aborted) {
              b({ progress: "", status: "cancelled", statusText: "已取消" }), g({ type: "abort", reason: "cancelled" });
              return;
            }
            const q = l == null ? void 0 : l.confirmationMode;
            (q === "explicit" || q === "green_light") && ((A = (R = this.options).onConfirmationMode) == null || A.call(R, q));
            const G = `${(l == null ? void 0 : l.conversationId) || ""}`.trim() || void 0, D = /* @__PURE__ */ new Set();
            for (const M of (l == null ? void 0 : l.operationRefs) || []) {
              const F = typeof M == "string" ? M : `${(M == null ? void 0 : M.operation_id) || ""}`;
              F.trim() && D.add(F.trim());
            }
            for (const M of (l == null ? void 0 : l.confirmationRequests) || []) {
              const F = `${(M == null ? void 0 : M.operation_id) || ""}`.trim();
              F && D.add(F);
            }
            for (const M of D)
              (N = (h = this.options).onAgentOperationSignal) == null || N.call(h, {
                operationId: M,
                conversationId: G,
                confirmationMode: q || void 0
              });
            const L = qt(l == null ? void 0 : l.citations);
            let V = jt(
              `${(l == null ? void 0 : l.answer) || P || ""}`.trim() || "没有找到可用回答。",
              L
            );
            if (S && (V += `

_在线服务暂不可用，以上来自本地文档检索。_`), (l == null ? void 0 : l.persisted) === !1 && (V += `

_⚠️ 本轮回答未能写入历史记录（存储暂时不可用），刷新后可能丢失。_`), !P)
              g({ type: "text-delta", id: w, delta: V });
            else if (V.startsWith(P)) {
              const M = V.slice(P.length);
              M && g({ type: "text-delta", id: w, delta: M });
            }
            g({ type: "text-end", id: w }), b({
              citations: L,
              persisted: (l == null ? void 0 : l.persisted) !== !1,
              progress: "",
              status: "complete"
            }), g({ type: "finish-step" }), g({ type: "finish", finishReason: "stop", messageMetadata: y });
          } catch (x) {
            if (e != null && e.aborted)
              b({ progress: "", status: "cancelled", statusText: "已取消" }), g({ type: "abort", reason: "cancelled" });
            else {
              const S = x instanceof Error && x.message ? x.message : "生成回答失败，请重试。";
              b({ progress: "", status: "error", statusText: S }), g({ type: "error", errorText: S });
            }
          } finally {
            if (!u) {
              u = !0;
              try {
                v.close();
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
function xn(t) {
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
function Tn(t) {
  const e = t.metadata || {}, n = e.status === "running", s = e.status === "cancelled" || e.status === "error", a = xn(t), r = a.trim() || (s ? `${e.statusText || ""}`.trim() : "");
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
  const e = B(t.remoteAnswerer), n = B(t.localAnswerer), s = B(t.onAgentOperationSignal), a = B(t.onConfirmationMode), r = B(t.onStopped);
  r.current = t.onStopped;
  const o = B(t.assistantMode);
  e.current = t.remoteAnswerer, n.current = t.localAnswerer, s.current = t.onAgentOperationSignal, a.current = t.onConfirmationMode, o.current = t.assistantMode;
  const d = Q(() => new Bt({
    id: `reader-${t.jobId || "idle"}`,
    transport: new $n({
      jobId: t.jobId,
      getRemoteAnswerer: () => e.current,
      getLocalAnswerer: () => n.current,
      getAssistantMode: () => o.current,
      onAgentOperationSignal: (m) => {
        var c;
        return (c = s.current) == null ? void 0 : c.call(s, m);
      },
      onConfirmationMode: (m) => {
        var c;
        return (c = a.current) == null ? void 0 : c.call(a, m);
      }
    })
  }), [t.jobId]);
  return U(() => {
    t.enabled || d.stop().finally(() => {
      var m;
      return (m = r.current) == null ? void 0 : m.call(r);
    });
  }, [d, t.enabled]), U(() => () => {
    d.stop().finally(() => {
      var m;
      return (m = r.current) == null ? void 0 : m.call(r);
    });
  }, [d]), Lt({ chat: d, experimental_throttle: 16 });
}
function Pn(t) {
  for (let e = t.length - 1; e >= 0; e -= 1)
    if (t[e].role === "assistant") return t[e];
}
function xe(t, e) {
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
  var I, w, C, f;
  const s = `${e || ""}`.trim();
  if (!s || !t.length) return [];
  let a = s;
  t.some((u) => u.message.id === a) || (n && t.some((u) => u.message.id === n) ? a = n : a = ((I = [...t].reverse().find((u) => u.message.role === "assistant")) == null ? void 0 : I.message.id) || "");
  let r = Dn(t, a);
  if (r.length >= 2 && ((w = r.at(-1)) == null ? void 0 : w.message.role) === "assistant") return r;
  r.length === 1 && ((C = r[0]) == null ? void 0 : C.message.role) === "user" && (r = []);
  const o = ce(t, n || a);
  let d = o.findIndex((u) => u.id === a);
  if (d < 0 && (d = o.length - 1), d < 0) return r;
  const m = new Map(t.map((u) => [u.message.id, u])), c = o.slice(0, d + 1).map((u) => m.get(u.id)).filter((u) => !!u);
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
function Wn(t) {
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
    persistReadyRef: w,
    switchTokenRef: C,
    sessionListGenerationRef: f,
    activeConversationIdRef: u,
    setItems: T,
    setHeadId: O,
    setSessions: _,
    setActiveConversationId: z,
    setSessionBusy: $
  } = t;
  U(() => {
    const v = o.current;
    if (!e) {
      f.current += 1, C.current += 1, T([]), O(null), _([]), z(""), d.current.clearMessages(), u.current = "", I.current = "", c.current = "", w.current = !1;
      return;
    }
    const P = I.current !== e;
    if (P && (f.current += 1, C.current += 1, I.current = e, w.current = !1, T([]), O(null), d.current.clearMessages(), _([]), z(""), u.current = "", c.current = "", $(!1)), !s || !v) {
      f.current += 1;
      return;
    }
    let y = !1;
    return (async () => {
      var A, h, N, x;
      let g = `${n || c.current || ""}`.trim();
      if (!g) {
        try {
          g = `${await ((A = v.getDocumentId) == null ? void 0 : A.call(v)) || ""}`.trim();
        } catch {
          g = "";
        }
        if (y) return;
      }
      g && (c.current = g);
      let b = null;
      if (!y && g && (b = await a(g)), !(P || !m.current.length) || y) {
        y || (w.current = !0);
        return;
      }
      const p = Ht({ jobId: e, documentId: g }) || `${((h = v.getConversationId) == null ? void 0 : h.call(v)) || ""}`.trim();
      if (p) {
        z(p), u.current = p, (N = v.setConversationId) == null || N.call(v, p, g);
        try {
          const S = await ze(p);
          if (y) return;
          const l = ve(S.messages || []);
          if (l.length) {
            r(l, S.head_id), requestAnimationFrame(() => {
              y || (w.current = !0);
            });
            return;
          }
        } catch {
        }
      }
      if (!y && g)
        try {
          const S = b ?? await a(g);
          if (y || !S) return;
          const l = S[0];
          if (l != null && l.conversation_id) {
            const q = l.conversation_id;
            z(q), u.current = q, (x = v.setConversationId) == null || x.call(v, q, g);
            try {
              const G = await ze(q);
              if (y) return;
              r(
                ve(G.messages || []),
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
        const S = dt(R);
        T(S.items), O(S.headId), d.current.showMessages(ce(S.items, S.headId));
      } else
        T([]), O(null), d.current.clearMessages();
      requestAnimationFrame(() => {
        y || (w.current = !0);
      });
    })(), () => {
      y = !0, f.current += 1;
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
    const m = r, c = { jobId: e, documentId: n || o.current }, I = window.setTimeout(() => {
      if (!s.length) {
        he(c, m);
        return;
      }
      $e(c, xe(s, a), m);
    }, 280);
    return () => window.clearTimeout(I);
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
    headIdRef: m,
    activeConversationIdRef: c,
    documentIdRef: I,
    switchTokenRef: w,
    persistReadyRef: C,
    setSessionBusy: f,
    setSessionError: u,
    setActiveConversationId: T,
    setItems: O,
    setHeadId: _,
    setSessions: z,
    refreshSessions: $,
    applyConversationTree: v
  } = t, P = H(() => {
    var R, A;
    const p = `${((A = (R = o.current) == null ? void 0 : R.getConversationId) == null ? void 0 : A.call(R)) || ""}`.trim();
    p && T(p);
  }, []), y = H(async () => {
    var R, A;
    if (s) return;
    await r.current.stopStream(), ue(900), oe(900), f(!0), u("");
    const p = ++w.current;
    try {
      if (await new Promise((x) => {
        window.setTimeout(x, 40);
      }), p !== w.current) return;
      const h = o.current, N = I.current || `${await ((R = h == null ? void 0 : h.getDocumentId) == null ? void 0 : R.call(h)) || ""}`.trim();
      if (p !== w.current) return;
      I.current = N, (A = h == null ? void 0 : h.clearConversationId) == null || A.call(h, N), T(""), c.current = "", O([]), _(null), r.current.clearMessages(), he({ jobId: e, documentId: N }), N && await $(N, p);
    } catch (h) {
      console.warn("[reader-ai] new session failed", h), u("无法创建新对话，请重试。");
    } finally {
      p === w.current && f(!1);
    }
  }, [e, $, s]), g = H(async (p) => {
    var x, S, l, q, G;
    const R = `${p || ""}`.trim();
    if (!R)
      return u("无法分支：消息 id 无效。"), !1;
    if (s)
      return u("请稍候，当前有会话操作进行中。"), !1;
    await r.current.stopStream();
    const A = Fn(d.current, R, m.current);
    if (!A.length)
      return u("无法分支：找不到到此答案的对话路径。"), !1;
    if (A[A.length - 1].message.role !== "assistant")
      return u("只能从助手答案处开新对话。"), !1;
    f(!0), u("");
    const N = ++w.current;
    try {
      if (await new Promise((j) => {
        window.setTimeout(j, 40);
      }), N !== w.current) return !1;
      const D = o.current;
      let L = I.current || `${await ((x = D == null ? void 0 : D.getDocumentId) == null ? void 0 : x.call(D)) || ""}`.trim();
      if (N !== w.current) return !1;
      if (I.current = L, !L)
        try {
          if (L = `${await ((S = D == null ? void 0 : D.getDocumentId) == null ? void 0 : S.call(D)) || ""}`.trim(), N !== w.current) return !1;
          I.current = L;
        } catch {
          L = "";
        }
      if (!L)
        return u("无法分支：文档未就绪，请稍后重试。"), !1;
      const V = A.map((j, ie) => ({
        id: j.message.id,
        role: j.message.role,
        content: j.message.content,
        citations: j.message.citations,
        parentId: ie === 0 ? null : A[ie - 1].message.id
      })), M = c.current || ((l = D == null ? void 0 : D.getConversationId) == null ? void 0 : l.call(D)) || "", F = (a || []).find((j) => j.conversation_id === M), X = V.find((j) => j.role === "user"), te = `${(F == null ? void 0 : F.title) || ""}`.trim() || `${(X == null ? void 0 : X.content) || ""}`.replace(/\s+/g, " ").trim() || "未命名对话", re = (a || []).map((j) => j.title || ""), ae = Gt(te, re), Z = await me().forkFromPath({
        documentId: L,
        title: ae,
        path: V
      });
      if (N !== w.current) return !1;
      const K = Se(Z.items), J = ((q = K[K.length - 1]) == null ? void 0 : q.message.id) || null, Y = Z.conversation.conversation_id;
      if (!Y || !K.length)
        throw new Error("fork returned empty conversation");
      return ue(600), oe(600), O(K), _(J), r.current.showMessages(ce(K, J)), T(Y), c.current = Y, (G = D == null ? void 0 : D.setConversationId) == null || G.call(D, Y, L), z((j) => {
        const ie = {
          conversation_id: Y,
          title: ae,
          document_id: L,
          created_at: Z.conversation.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: Z.conversation.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
          message_count: K.length,
          head_id: J || ""
        }, de = j.filter((pe) => pe.conversation_id !== Y);
        return [ie, ...de];
      }), $e(
        { jobId: e, documentId: L },
        xe(K, J),
        Y
      ), await $(L, N), !0;
    } catch (D) {
      return console.warn("[reader-ai] branch from answer failed", D), N === w.current && u("分支失败：未能复制上文到新对话。请检查网络后重试。"), !1;
    } finally {
      N === w.current && f(!1);
    }
  }, [e, $, s, a]), b = H(async (p) => {
    var h, N, x, S;
    const R = `${p || ""}`.trim();
    if (!R || s) return;
    await r.current.stopStream(), f(!0), u("");
    const A = ++w.current;
    try {
      const l = o.current, q = I.current || `${await ((h = l == null ? void 0 : l.getDocumentId) == null ? void 0 : h.call(l)) || ""}`.trim();
      if (A !== w.current) return;
      I.current = q;
      try {
        await me().delete(R);
      } catch (L) {
        if ((Number(L == null ? void 0 : L.status) || 0) !== 404) throw L;
      }
      he({ jobId: e, documentId: q }, R);
      const D = (c.current || ((N = l == null ? void 0 : l.getConversationId) == null ? void 0 : N.call(l)) || "") === R;
      if (z((L) => L.filter((V) => V.conversation_id !== R)), D) {
        (x = l == null ? void 0 : l.clearConversationId) == null || x.call(l, q), T(""), c.current = "", O([]), _(null), r.current.clearMessages(), he({ jobId: e, documentId: q });
        const L = q ? await $(q, A) : [];
        if (A !== w.current || !L) return;
        const V = L[0];
        if (V != null && V.conversation_id) {
          const M = V.conversation_id;
          T(M), c.current = M;
          try {
            const F = await me().get(M);
            if (A !== w.current) return;
            v(
              ve(F.messages || []),
              F.head_id
            ), (S = l == null ? void 0 : l.setConversationId) == null || S.call(l, M, q);
          } catch {
            O([]), _(null);
          }
        }
      } else q && await $(q, A);
    } catch (l) {
      console.warn("[reader-ai] delete session failed", l), u("删除对话失败，请重试。");
    } finally {
      A === w.current && f(!1);
    }
  }, [v, e, $, s]), k = H(async (p, R) => {
    const A = `${p || ""}`.trim(), h = `${R || ""}`.replace(/\s+/g, " ").trim();
    if (!A || !h || s) return;
    f(!0), u("");
    const N = ++w.current;
    try {
      const x = h.slice(0, 80);
      if (await me().patch(A, { title: x }), N !== w.current) return;
      z(
        (l) => l.map(
          (q) => q.conversation_id === A ? { ...q, title: x } : q
        )
      );
      const S = I.current;
      S && await $(S, N);
    } catch (x) {
      console.warn("[reader-ai] rename session failed", x), u("重命名失败，请重试。");
    } finally {
      N === w.current && f(!1);
    }
  }, [$, s]);
  return {
    adoptRemoteConversationId: P,
    newSession: y,
    branchFromAnswer: g,
    removeSession: b,
    renameSession: k
  };
}
function Gn(t) {
  var ae;
  const {
    jobId: e,
    documentId: n = "",
    enabled: s,
    remoteAnswerer: a = null,
    stream: r = zn
  } = t, [o, d] = W([]), [m, c] = W(null), [I, w] = W([]), [C, f] = W(""), [u, T] = W(!1), [O, _] = W(""), z = B(o), $ = B(m), v = B(C), P = B(!1), y = B(""), g = B(""), b = B(0), k = B(0), p = B(r);
  p.current = r;
  const R = B(a);
  R.current = a, z.current = o, $.current = m, v.current = C;
  const A = H(async (Z = "", K) => {
    const J = `${Z || g.current || ""}`.trim(), Y = ++k.current;
    if (!J)
      return Y === k.current && (K === void 0 || K === b.current) && w([]), [];
    try {
      const j = me();
      if (!j) return null;
      const de = (await j.list({ document_id: J, limit: 50 })).conversations || [];
      return Y === k.current && J === `${g.current || ""}`.trim() && (K === void 0 || K === b.current) ? (w(de), de) : null;
    } catch {
      return null;
    }
  }, []), h = H((Z, K) => {
    var j;
    const J = Se(Z), Y = `${K || ""}`.trim() || ((j = J[J.length - 1]) == null ? void 0 : j.message.id) || null;
    d(J), c(Y), p.current.showMessages(ce(J, Y));
  }, []), N = H(() => `${n || g.current || e}`.trim(), [n, e]);
  Wn({
    jobId: e,
    documentId: n,
    enabled: s,
    refreshSessions: A,
    applyConversationTree: h,
    remoteRef: R,
    streamRef: p,
    itemsRef: z,
    documentIdRef: g,
    lastJobRef: y,
    persistReadyRef: P,
    switchTokenRef: b,
    sessionListGenerationRef: k,
    activeConversationIdRef: v,
    setItems: d,
    setHeadId: c,
    setSessions: w,
    setActiveConversationId: f,
    setSessionBusy: T
  }), Un({
    jobId: e,
    documentId: n,
    items: o,
    headId: m,
    activeConversationId: C,
    documentIdRef: g,
    persistReadyRef: P
  });
  const x = Q(
    () => ce(o, m),
    [o, m]
  ), S = Q(
    () => qn(o),
    [o]
  ), l = Q(
    () => Bn(o),
    [o]
  ), q = Q(
    () => Ln(o),
    [o]
  ), G = Q(() => Kn({ setItems: d, setHeadId: c, itemsRef: z, headIdRef: $ }), []), {
    adoptRemoteConversationId: D,
    newSession: L,
    branchFromAnswer: V,
    removeSession: M,
    renameSession: F
  } = Hn({
    jobId: e,
    documentId: n,
    sessionBusy: u,
    sessions: I,
    streamRef: p,
    remoteRef: R,
    itemsRef: z,
    headIdRef: $,
    activeConversationIdRef: v,
    documentIdRef: g,
    switchTokenRef: b,
    persistReadyRef: P,
    setSessionBusy: T,
    setSessionError: _,
    setActiveConversationId: f,
    setItems: d,
    setHeadId: c,
    setSessions: w,
    refreshSessions: A,
    applyConversationTree: h
  }), X = H(async (Z) => {
    var j, ie, de, pe, Te, Ee, Pe, Oe;
    const K = `${Z || ""}`.trim(), J = v.current || ((ie = (j = R.current) == null ? void 0 : j.getConversationId) == null ? void 0 : ie.call(j)) || "";
    if (!K || K === J || u) return;
    await p.current.stopStream(), ue(1200), oe(1200), T(!0), _("");
    const Y = ++b.current;
    P.current = !1, f(K), v.current = K, d([]), c(null), p.current.clearMessages();
    try {
      if (await new Promise((ye) => {
        window.setTimeout(ye, 80);
      }), Y !== b.current) return;
      try {
        (Te = (pe = (de = globalThis.document) == null ? void 0 : de.activeElement) == null ? void 0 : pe.blur) == null || Te.call(pe);
      } catch {
      }
      const ee = R.current, ne = g.current || `${await ((Ee = ee == null ? void 0 : ee.getDocumentId) == null ? void 0 : Ee.call(ee)) || ""}`.trim();
      if (Y !== b.current) return;
      g.current = ne;
      const le = me();
      if (!le) throw new Error("Reader conversations unavailable");
      const Me = await le.get(K);
      if (Y !== b.current) return;
      ue(800), oe(800);
      const Ne = ve(Me.messages || []);
      if (h(Ne, Me.head_id), (Pe = ee == null ? void 0 : ee.setConversationId) == null || Pe.call(ee, K, ne), P.current = !0, Ne.length) {
        const ye = Se(Ne);
        $e(
          { jobId: e, documentId: ne },
          xe(
            ye,
            `${Me.head_id || ""}`.trim() || ((Oe = ye.at(-1)) == null ? void 0 : Oe.message.id) || null
          ),
          K
        );
      } else
        he({ jobId: e, documentId: ne }, K);
      ne && await A(ne, Y), ue(350), oe(350);
    } catch (ee) {
      if (console.warn("[reader-ai] switch session failed", ee), Y === b.current) {
        _("加载该对话失败，请检查网络后重试。");
        const ne = et(
          { jobId: e, documentId: n || g.current },
          K
        );
        if (ne != null && ne.items.length) {
          const le = dt(ne);
          d(le.items), c(le.headId), p.current.showMessages(ce(le.items, le.headId));
        } else
          d([]), c(null);
        P.current = !0;
      }
    } finally {
      Y === b.current && T(!1);
    }
  }, [
    h,
    e,
    n,
    A,
    u
  ]), te = Q(
    () => jn(I, C, a),
    [I, C, a]
  ), re = Q(() => ({
    refreshSessions: A,
    adoptRemoteConversationId: D,
    newSession: L,
    switchSession: X,
    removeSession: M,
    renameSession: F,
    branchFromAnswer: V
  }), [
    A,
    D,
    L,
    X,
    M,
    F,
    V
  ]);
  return {
    items: o,
    headId: m,
    messages: x,
    citationsByMessageId: S,
    progressByMessageId: l,
    contentByMessageId: q,
    sessions: te,
    activeConversationId: C || ((ae = a == null ? void 0 : a.getConversationId) == null ? void 0 : ae.call(a)) || "",
    sessionBusy: u,
    sessionError: O,
    resolveRequestScopeKey: N,
    tree: G,
    sessionCommands: re
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
  const { jobId: e, assistantMode: n, selectionContext: s = null, tree: a, chat: r, getScopeKey: o } = t, d = B(a);
  d.current = a;
  const m = B(r);
  m.current = r;
  const c = B(n);
  c.current = n;
  const I = B(s);
  I.current = s;
  const w = B(o);
  w.current = o;
  const C = r.status, f = C === "submitted" || C === "streaming", u = B(f);
  u.current = f;
  const T = f ? `${((P = Pn(r.messages)) == null ? void 0 : P.id) || ""}` : "", O = r.messages, _ = r.error;
  U(() => {
    if (!O.length) return;
    const y = new Map(O.map((b) => [b.id, b])), g = /* @__PURE__ */ new Map();
    for (const [b, k] of y)
      g.set(b, Tn(k));
    d.current.mergeChatMirror(g);
  }, [O]), U(() => {
    !_ || C !== "error" || d.current.markRunningAsError(_.message);
  }, [_, C]);
  const z = H(async (y) => {
    if (u.current) return;
    const g = `${y || ""}`.trim();
    if (!g) return;
    const b = d.current, k = m.current, p = c.current, R = I.current, A = w.current(), h = b.readHeadId(), N = ke("u"), x = ke("a"), S = Xn({
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
    je(A, x, S), b.appendExchange({
      parentId: h,
      userId: N,
      assistantId: x,
      question: g,
      progress: S.assistantMode === "operations" ? "正在规划 PDF 操作…" : "正在理解文档…"
    }), await k.sendUserMessage(
      { id: N, role: "user", parts: [{ type: "text", text: g }] },
      {
        body: {
          assistantMessageId: x,
          assistantMode: S.assistantMode,
          parentId: h,
          question: g,
          regenerate: !1,
          userMessageId: N,
          scope: S.scope,
          context: S.context
        }
      }
    );
  }, []), $ = H(async (y) => {
    if (u.current) return;
    const g = d.current, b = m.current, k = g.readItems(), p = k.find(
      (G) => G.message.id === y && G.message.role === "assistant"
    ), R = (p == null ? void 0 : p.parentId) ?? null, A = R ? On(k, R) : null;
    let h = "", N = R;
    if ((A == null ? void 0 : A.role) === "user")
      h = A.content.trim();
    else {
      const G = ce(k, R ?? g.readHeadId());
      for (let D = G.length - 1; D >= 0; D -= 1)
        if (G[D].role === "user") {
          h = G[D].content.trim(), N = G[D].id;
          break;
        }
    }
    if (!h) return;
    const x = ke("a"), S = N || R, l = w.current(), q = Qn({
      scopeKey: l,
      jobId: e,
      assistantMessageId: y
    });
    je(l, x, q), g.appendRetryTurn({ assistantId: x, branchParent: S }), b.replaceVisible(ct(ce(k, y))), await b.regenerateFrom({
      messageId: y,
      body: {
        assistantMessageId: x,
        assistantMode: q.assistantMode,
        parentId: S,
        question: h,
        regenerate: !0,
        userMessageId: N || "",
        scope: q.scope,
        context: q.context
      }
    });
  }, [e]), v = H(async () => {
    await m.current.stopStream(), d.current.markRunningCancelled();
  }, []);
  return {
    isRunning: f,
    streamingAssistantId: T,
    submitQuestion: z,
    retryAnswer: $,
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
  const [o, d] = W({}), [m, c] = W("explicit"), [I, w] = W(!1), [C, f] = W(!1), u = B(/* @__PURE__ */ new Set()), T = B(/* @__PURE__ */ new Set()), O = B(/* @__PURE__ */ new Set()), _ = H((y, g = !1) => {
    y != null && y.operation_id && d((b) => {
      const k = b[y.operation_id];
      return rr(k == null ? void 0 : k.operation, y) ? {
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
  }, [_]), $ = H(async () => {
    const y = `${t || ""}`.trim(), g = `recover:${y}`;
    if (!(!e || !y || u.current.has(g))) {
      u.current.add(g);
      try {
        const b = fe();
        if (!b) return;
        const k = await b.list(y, {});
        if (!O.current.has(y)) {
          for (const p of k.operations || [])
            p.status === "committed" && T.current.add(p.operation_id);
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
        c(p.agent_confirmation_mode || "explicit"), f(!!p.llm_api_key_configured), w(
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
    a && c(a);
  }, [a]), U(() => {
    s != null && s.confirmationMode && c(s.confirmationMode), s != null && s.operationId && z(s.operationId);
  }, [z, s]), U(() => {
    $();
  }, [$]), U(() => {
    n || $();
  }, [n, $]);
  const v = Q(
    () => Object.values(o).filter((y) => !!t && y.operation.conversation_id === t).sort((y, g) => `${y.operation.created_at || ""}`.localeCompare(`${g.operation.created_at || ""}`)),
    [t, o]
  );
  U(() => {
    var y;
    for (const g of v) {
      const b = g.operation;
      b.status !== "committed" || T.current.has(b.operation_id) || (T.current.add(b.operation_id), r == null || r({
        documentId: b.document_id,
        revision: ((y = b.candidate) == null ? void 0 : y.version_id) || `${b.updated_at || ""}` || `${b.operation_id}:${nr(b)}`
      }));
    }
  }, [v, r]);
  const P = v.some((y) => We(y.operation.status, m));
  return U(() => {
    if (!e || !t || !n && !P) return;
    const y = window.setInterval(() => {
      $();
      for (const g of v)
        We(g.operation.status, m) && z(g.operation.operation_id);
    }, 1400);
    return () => window.clearInterval(y);
  }, [m, t, n, e, v, P, $, z]), U(() => {
    if (!e) return;
    const y = () => void $(), g = () => {
      document.visibilityState === "visible" && y();
    };
    return window.addEventListener("online", y), document.addEventListener("visibilitychange", g), () => {
      window.removeEventListener("online", y), document.removeEventListener("visibilitychange", g);
    };
  }, [e, $]), {
    entries: v,
    confirmationMode: m,
    runtimeRestarting: I,
    runtimeCredentialConfigured: C,
    setEntriesById: d,
    inFlightRef: u,
    upsert: _,
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
  const a = B(/* @__PURE__ */ new Map());
  return { perform: H(async (o, d, m = {}) => {
    const c = `${d.operation_id || ""}`.trim(), I = `action:${c}`;
    if (!c || s.current.has(I)) return;
    if (o === "retry" && d.status === "ambiguous" && m.acceptDuplicateRisk !== !0) {
      n((f) => ({
        ...f,
        [c]: {
          ...f[c],
          error: "请先确认重复执行风险，再重新执行操作。"
        }
      }));
      return;
    }
    const w = cr(c, o, a.current);
    s.current.add(I), n((f) => ({
      ...f,
      [c]: { ...f[c], pendingAction: o, error: void 0 }
    }));
    const C = {
      idempotency_key: w,
      expected_status: d.status,
      expected_attempt: d.current_attempt,
      expected_program_sha256: d.program_sha256 || ""
    };
    try {
      const f = fe();
      if (!f) throw new Error("Reader AI operations unavailable");
      let u;
      o === "run" ? u = await f.run(c, C) : o === "cancel" ? u = await f.cancel(c, { ...C, reason: "user_rejected" }) : o === "commit" ? u = await f.commit(c, C) : u = await f.retry(c, m.acceptDuplicateRisk ? { ...C, accept_duplicate_risk: !0 } : C), Ue(c, o, a.current), e(u, !0);
    } catch (f) {
      sr(f) === 409 ? (Ue(c, o, a.current), await t(c, !0)) : n((u) => ({
        ...u,
        [c]: {
          ...u[c],
          pendingAction: void 0,
          error: ar(f)
        }
      }));
    } finally {
      s.current.delete(I);
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
  }), m = H((c) => {
    var I;
    return ((I = fe()) == null ? void 0 : I.fetchCandidate(c.operation_id)) ?? Promise.reject(new Error("Reader AI operations unavailable"));
  }, []);
  return {
    entries: o.entries,
    confirmationMode: o.confirmationMode,
    runtimeRestarting: o.runtimeRestarting,
    runtimeCredentialConfigured: o.runtimeCredentialConfigured,
    perform: d,
    loadCandidate: m
  };
}
function ur(t) {
  var k;
  const {
    jobId: e,
    documentId: n = "",
    sessionIdentity: s = "",
    enabled: a,
    selectionContext: r = null,
    onDocumentCommitted: o
  } = t, d = `${e}\0${n}\0${s}`, [m, c] = W("reading"), [I, w] = W(null), [C, f] = W();
  U(() => {
    c("reading"), w(null), f(void 0);
  }, [d]);
  const u = Q(() => {
    var p;
    return !a || !e ? null : ((p = De()) == null ? void 0 : p.createRemoteAnswerer({ jobId: e, documentId: n })) ?? xt({ jobId: e, documentId: n });
  }, [n, a, e]), T = Q(() => {
    var p;
    return !a || !e ? null : ((p = De()) == null ? void 0 : p.createLocalAnswerer({ jobId: e })) ?? Kt({
      loadMarkdownPayload: Tt.loadMarkdownPayload
    });
  }, [a, e]), O = B(null), _ = En({
    jobId: e,
    enabled: a,
    remoteAnswerer: u,
    localAnswerer: T,
    assistantMode: m,
    onAgentOperationSignal: (p) => {
      w({ ...p, nonce: Date.now() + Math.random() });
    },
    onConfirmationMode: f,
    onStopped: () => {
      var p;
      return (p = O.current) == null ? void 0 : p.markRunningCancelled();
    }
  }), z = Q(() => ({
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
  }), [_]), $ = Q(() => ({
    stopStream: () => z.stopStream(),
    clearMessages: () => z.replaceVisible([]),
    showMessages: (p) => z.replaceVisible(ct(p))
  }), [z]), v = Gn({
    jobId: e,
    documentId: n,
    enabled: a,
    remoteAnswerer: u,
    stream: $
  });
  O.current = v.tree;
  const P = Zn({
    jobId: e,
    assistantMode: m,
    selectionContext: r,
    tree: v.tree,
    chat: z,
    getScopeKey: () => v.resolveRequestScopeKey()
  }), y = v.activeConversationId || (I == null ? void 0 : I.conversationId) || `${((k = u == null ? void 0 : u.getConversationId) == null ? void 0 : k.call(u)) || ""}`.trim(), g = lr({
    conversationId: y,
    enabled: a,
    discovering: P.isRunning,
    signal: I,
    confirmationModeHint: C,
    onDocumentCommitted: o
  }), b = B(!1);
  return U(() => {
    b.current = !1;
  }, [e]), U(() => {
    b.current = !1;
  }, [d]), U(() => {
    b.current && !P.isRunning && (v.sessionCommands.refreshSessions(), v.sessionCommands.adoptRemoteConversationId()), b.current = P.isRunning;
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
    agentOperations: g,
    assistantMode: m,
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
  side: m = "right",
  selectionContext: c = null,
  onClearSelectionContext: I
}) {
  const w = t && !!e, {
    citationsByMessageId: C,
    progressByMessageId: f,
    contentByMessageId: u,
    streamingAssistantId: T,
    isRunning: O,
    sessions: _,
    activeConversationId: z,
    sessionBusy: $,
    sessionError: v,
    messages: P,
    submitQuestion: y,
    retryAnswer: g,
    cancelAnswer: b,
    newSession: k,
    switchSession: p,
    removeSession: R,
    renameSession: A,
    branchFromAnswer: h,
    agentOperations: N,
    assistantMode: x,
    setAssistantMode: S
  } = ur({
    jobId: e,
    documentId: n,
    sessionIdentity: s,
    enabled: w,
    selectionContext: c,
    onDocumentCommitted: o
  }), [l, q] = W(""), G = H(async (L) => {
    q(""), await h(L) && (q(
      "已保存新对话（fork-n-原名）：复制了到此答案的上文，原对话不变。顶部列表可切换。"
    ), window.setTimeout(() => q(""), 6e3));
  }, [h]), D = H((L) => {
    r(L);
  }, [r]);
  return /* @__PURE__ */ i(
    Et,
    {
      id: "reader-ai-panel",
      open: t,
      title: "RetainPDF AI",
      titleIcon: /* @__PURE__ */ i(ge, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.ai-float.pos.v2",
      ariaLabel: "阅读问答",
      width: 420,
      placement: d === "workspace" ? "workspace" : d === "docked" ? "dock-right" : "floating",
      showHeader: d !== "workspace",
      className: `reader-float-ai is-${d}${d === "workspace" ? ` is-pane-${m}` : ""}${$ ? " is-session-busy" : ""}`,
      onClose: a,
      children: e ? /* @__PURE__ */ E("div", { className: "reader-float-ai-body", children: [
        /* @__PURE__ */ i(
          kn,
          {
            sessions: _,
            activeId: z,
            busy: $,
            errorText: v,
            onSwitch: p,
            onNew: k,
            onDelete: R,
            onRename: A
          }
        ),
        l ? /* @__PURE__ */ i("div", { className: "aui-session-banner", role: "status", children: l }) : null,
        /* @__PURE__ */ i("div", { className: "reader-float-ai-thread-wrap", "aria-busy": $ || void 0, children: /* @__PURE__ */ i(
          _n,
          {
            jobId: e,
            messages: P,
            citationsByMessageId: C,
            progressByMessageId: f,
            contentByMessageId: u,
            streamingAssistantId: T,
            isRunning: O,
            onSubmit: y,
            onRetry: g,
            onCancel: b,
            onJumpCitation: D,
            onBranchFromAnswer: G,
            branchBusy: $,
            agentOperations: N,
            assistantMode: x,
            onAssistantModeChange: S,
            selectionContext: c,
            onClearSelectionContext: I
          }
        ) })
      ] }) : /* @__PURE__ */ E("div", { className: "reader-float-ai-empty", children: [
        /* @__PURE__ */ i(ge, { size: 22, strokeWidth: 1.75, "aria-hidden": !0 }),
        /* @__PURE__ */ i("p", { children: "当前文档还没有可用于 AI 的解析产物" }),
        /* @__PURE__ */ i("span", { children: "请先完成 OCR 文档解析" })
      ] })
    }
  );
}
export {
  Sr as ReaderAiPanel
};
//# sourceMappingURL=ReaderAiPanel-CSfFNKAz.js.map
