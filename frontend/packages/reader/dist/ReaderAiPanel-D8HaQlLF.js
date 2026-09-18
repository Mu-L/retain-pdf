import { jsx as i, jsxs as T, Fragment as Ie } from "react/jsx-runtime";
import { useState as W, useRef as L, useEffect as U, useMemo as X, useCallback as G, useId as pt } from "react";
import { Square as mt, ArrowUp as ft, Copy as ht, GitBranch as gt, RefreshCw as yt, Sigma as He, Table2 as vt, Image as wt, Type as It, X as be, BookOpen as Ge, Sparkles as he, Loader2 as Re, FileText as Ae, ArrowDown as Ve, ListTree as bt, FlaskConical as Rt, ShieldCheck as Ct, Bot as Mt, ChevronUp as Nt, ChevronDown as Ye, TriangleAlert as Je, ExternalLink as _t, Check as Qe, Circle as kt, Plus as At, Pencil as St, Trash2 as $t } from "lucide-react";
import { g as ue, h as me, i as De, j as Et, d as xt, b as Tt } from "./ReaderApp-iOOXGzME.js";
import { ThreadPrimitive as ne, ComposerPrimitive as ye, MessagePrimitive as Xe, ActionBarPrimitive as _e, useExternalStoreRuntime as Pt, AssistantRuntimeProvider as Ot } from "@assistant-ui/react";
import { A as Dt } from "./AiMarkdownAnswer-DET_KlrE.js";
import { r as Ze } from "./reader-regions-DsePY7B_.js";
import { M as Ft, C as Fe, h as zt } from "./config-CgaWliJ_.js";
import { k as ce, q as se, v as qt } from "./answer-enhance-W8TBaAUL.js";
import { Chat as Bt, useChat as Lt } from "@ai-sdk/react";
import { s as jt, l as et, c as fe, b as $e, a as Kt } from "./thread-branch-store-Jy9wH_F1.js";
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
  return /* @__PURE__ */ T("div", { className: "aui-thinking", role: "status", "aria-live": "polite", children: [
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
  progress: r,
  streaming: a,
  branchBusy: s,
  onJumpCitation: o,
  onBranchFromAnswer: c
}) {
  const m = tt(e);
  return /* @__PURE__ */ i(Xe.Root, { className: "aui-msg aui-msg-assistant", "data-role": "assistant", children: /* @__PURE__ */ T("div", { className: "aui-msg-stack", children: [
    a && r ? /* @__PURE__ */ i(qe, { label: r }) : null,
    a && !r && !m ? /* @__PURE__ */ i(qe, { label: "思考中…" }) : null,
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
    /* @__PURE__ */ T(
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
              disabled: s,
              onClick: async () => {
                ce(1200, { overlayDelayMs: 0 }), se(1200), await c(e.id);
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
  streamingAssistantId: r,
  isRunning: a,
  branchBusy: s,
  onJumpCitation: o,
  onBranchFromAnswer: c
}) {
  return /* @__PURE__ */ i("div", { className: "aui-message-group", "data-slot": "aui_message-group", children: /* @__PURE__ */ i(ne.Messages, { children: ({ message: m }) => {
    var v;
    if (m.role === "user") return /* @__PURE__ */ i(tn, { message: m });
    if (m.role !== "assistant") return null;
    const d = ((v = m.status) == null ? void 0 : v.type) === "running" || a && r === m.id;
    return /* @__PURE__ */ i(
      nn,
      {
        jobId: t,
        message: m,
        citations: e[m.id] || [],
        progress: n[m.id] || "",
        streaming: d,
        branchBusy: s,
        onJumpCitation: o,
        onBranchFromAnswer: c
      }
    );
  } }) });
}
function rn({
  mode: t,
  disabled: e,
  onChange: n
}) {
  return /* @__PURE__ */ T("div", { className: "aui-assistant-mode", role: "group", "aria-label": "AI 模式", children: [
    /* @__PURE__ */ T(
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
    /* @__PURE__ */ T(
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
  const n = t.selectionType === "text" ? "text" : t.kind, r = t.selectionType === "text" ? t.quote : Ze(t.region, t.pane), a = n === "formula" ? "公式" : n === "table" ? "表格" : n === "figure" ? "图片" : "文字";
  return /* @__PURE__ */ T("div", { className: "aui-selection-context", "data-reader-ai-selection-context": "", children: [
    /* @__PURE__ */ i(n === "formula" ? He : n === "table" ? vt : n === "figure" ? wt : It, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
    /* @__PURE__ */ T("span", { className: "aui-selection-context-meta", children: [
      t.pane === "translated" ? "译文" : "原文",
      " · ",
      t.page,
      " 页 · ",
      a
    ] }),
    /* @__PURE__ */ i("span", { className: "aui-selection-context-text", children: r || "已选择此区域" }),
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
  onModeChange: r,
  selectionContext: a,
  onClearSelectionContext: s
}) {
  return /* @__PURE__ */ T(ye.Root, { className: "aui-composer", "data-reader-ai-composer": "", children: [
    /* @__PURE__ */ T("div", { className: "aui-composer-shell", children: [
      n !== "operations" ? /* @__PURE__ */ i(sn, { selectionContext: a, onClear: s }) : null,
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
      /* @__PURE__ */ T("div", { className: "aui-composer-toolbar", children: [
        /* @__PURE__ */ i(rn, { mode: n, disabled: t || e, onChange: r }),
        /* @__PURE__ */ i("div", { className: "aui-composer-actions", children: t ? /* @__PURE__ */ i(ye.Cancel, { className: "aui-send aui-send-stop", "aria-label": "停止生成", children: /* @__PURE__ */ i(mt, { size: 12, strokeWidth: 2.6, "aria-hidden": !0 }) }) : /* @__PURE__ */ i(ye.Send, { className: "aui-send", "aria-label": "发送", children: /* @__PURE__ */ i(ft, { size: 16, strokeWidth: 2.5, "aria-hidden": !0 }) }) })
      ] })
    ] }),
    /* @__PURE__ */ i("p", { className: "aui-hint", children: "AI 可能会出错，请核对原文与引用" })
  ] });
}
function st() {
  return /* @__PURE__ */ T("div", { className: "aui-composer aui-composer-locked", role: "alert", children: [
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
  progressByMessageId: r,
  streamingAssistantId: a,
  isRunning: s,
  missingLlmKey: o,
  branchBusy: c,
  agentRequestBlocked: m = !1,
  agentOperationPanel: d,
  onModeChange: v,
  onJumpCitation: g,
  onBranchFromAnswer: b
}) {
  const p = c || m;
  return /* @__PURE__ */ T(Ie, { children: [
    e ? /* @__PURE__ */ T("div", { className: "aui-empty", children: [
      /* @__PURE__ */ i("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ i("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ i(he, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ i("h2", { className: "aui-empty-title", children: "想怎样处理 PDF？" }),
      /* @__PURE__ */ i("p", { className: "aui-empty-sub", children: "创建候选版本后由你预览和确认" }),
      /* @__PURE__ */ i("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: an.map((l) => {
        const x = l.icon;
        return /* @__PURE__ */ T(
          ne.Suggestion,
          {
            prompt: l.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: p || o,
            children: [
              /* @__PURE__ */ i(x, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
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
        progressByMessageId: r,
        streamingAssistantId: a,
        isRunning: s,
        branchBusy: c,
        onJumpCitation: g,
        onBranchFromAnswer: b
      }
    ),
    d,
    /* @__PURE__ */ T(ne.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !c ? /* @__PURE__ */ i(
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
          isRunning: s,
          branchBusy: p,
          mode: "operations",
          onModeChange: v,
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
  progressByMessageId: r,
  streamingAssistantId: a,
  isRunning: s,
  missingLlmKey: o,
  branchBusy: c,
  composerDisabled: m = !1,
  onModeChange: d,
  onJumpCitation: v,
  onBranchFromAnswer: g,
  selectionContext: b = null,
  onClearSelectionContext: p,
  footerExtra: l = null
}) {
  return /* @__PURE__ */ T(Ie, { children: [
    e ? /* @__PURE__ */ T("div", { className: "aui-empty", children: [
      /* @__PURE__ */ i("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ i("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ i(he, { size: 21, strokeWidth: 1.9 }) }) }),
      /* @__PURE__ */ i("h2", { className: "aui-empty-title", children: "一起读懂这篇文档" }),
      /* @__PURE__ */ i("p", { className: "aui-empty-sub", children: "总结、解释、检索与计算，不修改 PDF" }),
      /* @__PURE__ */ i("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: cn.map((x) => {
        const E = x.icon;
        return /* @__PURE__ */ T(
          ne.Suggestion,
          {
            prompt: x.prompt,
            send: !0,
            type: "button",
            className: "aui-suggestion",
            disabled: c || m || o,
            children: [
              /* @__PURE__ */ i(E, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
              /* @__PURE__ */ i("span", { className: "aui-suggestion-label", children: x.label })
            ]
          },
          x.prompt
        );
      }) })
    ] }) : null,
    /* @__PURE__ */ i(
      nt,
      {
        jobId: t,
        citationsByMessageId: n,
        progressByMessageId: r,
        streamingAssistantId: a,
        isRunning: s,
        branchBusy: c,
        onJumpCitation: v,
        onBranchFromAnswer: g
      }
    ),
    l,
    /* @__PURE__ */ T(ne.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
      !e && !c ? /* @__PURE__ */ i(
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
          isRunning: s,
          branchBusy: c || m,
          mode: "reading",
          onModeChange: d,
          selectionContext: b,
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
  progressByMessageId: r,
  streamingAssistantId: a,
  isRunning: s,
  missingLlmKey: o,
  branchBusy: c,
  agentRequestBlocked: m = !1,
  agentOperationPanel: d,
  assistantMode: v = "reading",
  onAssistantModeChange: g,
  onJumpCitation: b,
  onBranchFromAnswer: p,
  selectionContext: l = null,
  onClearSelectionContext: x
}) {
  const E = e.length === 0, S = v === "operations";
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
          children: /* @__PURE__ */ i("div", { className: `aui-thread-inner${E ? " is-empty" : ""}`, children: S ? /* @__PURE__ */ i(
            on,
            {
              jobId: t,
              empty: E,
              citationsByMessageId: n,
              progressByMessageId: r,
              streamingAssistantId: a,
              isRunning: s,
              missingLlmKey: o,
              branchBusy: c,
              agentRequestBlocked: m,
              agentOperationPanel: d,
              onModeChange: g,
              onJumpCitation: b,
              onBranchFromAnswer: p
            }
          ) : /* @__PURE__ */ i(
            dn,
            {
              jobId: t,
              empty: E,
              citationsByMessageId: n,
              progressByMessageId: r,
              streamingAssistantId: a,
              isRunning: s,
              missingLlmKey: o,
              branchBusy: c,
              composerDisabled: m,
              onModeChange: g,
              onJumpCitation: b,
              onBranchFromAnswer: p,
              selectionContext: l,
              onClearSelectionContext: x
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
    const r = hn(n.status), a = ["queued", "running", "validating"].includes(n.status);
    return /* @__PURE__ */ T("li", { children: [
      /* @__PURE__ */ i(r, { className: a ? "is-spinning" : "", size: 12, "aria-hidden": !0 }),
      /* @__PURE__ */ i("span", { children: n.summary || n.event || it(n.status, e) }),
      /* @__PURE__ */ i("time", { children: n.ts ? new Date(n.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "" })
    ] }, `${n.attempt}:${n.seq}`);
  }) });
}
function yn({
  operation: t,
  loadCandidate: e
}) {
  const [n, r] = W(!1), [a, s] = W(""), [o, c] = W(""), m = L("");
  return U(() => {
    let d = !1;
    return c(""), e(t).then((v) => {
      if (d) return;
      const g = URL.createObjectURL(v);
      m.current && URL.revokeObjectURL(m.current), m.current = g, s(g);
    }).catch(() => {
      d || c("候选 PDF 加载失败，请重试。");
    }), () => {
      d = !0;
    };
  }, [e, t.operation_id, t.current_attempt]), U(() => () => {
    m.current && URL.revokeObjectURL(m.current);
  }, []), /* @__PURE__ */ T(Ie, { children: [
    /* @__PURE__ */ T("div", { className: "reader-agent-operation-candidate", children: [
      /* @__PURE__ */ T("div", { children: [
        /* @__PURE__ */ i(Ae, { size: 13, "aria-hidden": !0 }),
        /* @__PURE__ */ i("span", { children: "候选 PDF" })
      ] }),
      /* @__PURE__ */ i("button", { type: "button", disabled: !a, onClick: () => r((d) => !d), children: a ? n ? "收起" : "预览" : "加载中…" }),
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
  onAction: r,
  onDismiss: a
}) {
  var E;
  const { operation: s, pendingAction: o, error: c } = t, [m, d] = W(!1), [v, g] = W(!1), b = s.events || [], p = fn(s.status), l = !!((s.status === "result_ready" || s.status === "committed") && s.candidate_available), x = un.has(s.status);
  return /* @__PURE__ */ T("article", { className: `reader-agent-operation-card is-${s.status}`, "data-operation-id": s.operation_id, children: [
    /* @__PURE__ */ T("header", { children: [
      /* @__PURE__ */ i("span", { className: "reader-agent-operation-icon", "aria-hidden": !0, children: /* @__PURE__ */ i(Mt, { size: 15 }) }),
      /* @__PURE__ */ T("div", { className: "reader-agent-operation-title", children: [
        /* @__PURE__ */ i("span", { children: "PDF 操作" }),
        /* @__PURE__ */ i("strong", { children: s.intent_summary || "处理当前 PDF" })
      ] }),
      /* @__PURE__ */ T("div", { className: "reader-agent-operation-head-actions", children: [
        /* @__PURE__ */ i("span", { className: "reader-agent-operation-status", children: it(s.status, e) }),
        x ? /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "reader-agent-operation-dismiss",
            "aria-label": s.status === "failed" ? "隐藏这条失败提示" : "隐藏这条已取消提示",
            title: "隐藏",
            onClick: () => a(s),
            children: /* @__PURE__ */ i(be, { size: 13, "aria-hidden": !0 })
          }
        ) : null
      ] })
    ] }),
    (E = s.affected_pages) != null && E.length ? /* @__PURE__ */ T("p", { className: "reader-agent-operation-scope", children: [
      "影响页码：",
      s.affected_pages.join("、")
    ] }) : null,
    b.length ? /* @__PURE__ */ T("div", { className: "reader-agent-operation-details", children: [
      /* @__PURE__ */ T("button", { type: "button", onClick: () => d((S) => !S), children: [
        m ? /* @__PURE__ */ i(Nt, { size: 12, "aria-hidden": !0 }) : /* @__PURE__ */ i(Ye, { size: 12, "aria-hidden": !0 }),
        m ? "收起步骤" : `执行步骤 ${b.length}`
      ] }),
      m ? /* @__PURE__ */ i(gn, { events: b, mode: e }) : null
    ] }) : null,
    l ? /* @__PURE__ */ i(yn, { operation: s, loadCandidate: n }) : null,
    c ? /* @__PURE__ */ i("p", { className: "reader-agent-operation-error", role: "alert", children: c }) : null,
    v ? /* @__PURE__ */ T("div", { className: "reader-agent-operation-risk", role: "alertdialog", "aria-label": "确认重复执行风险", children: [
      /* @__PURE__ */ i(Je, { size: 14, "aria-hidden": !0 }),
      /* @__PURE__ */ i("p", { children: "上一次执行结果不确定，重试可能重复操作。确认接受风险后再继续。" }),
      /* @__PURE__ */ T("div", { children: [
        /* @__PURE__ */ i("button", { type: "button", onClick: () => g(!1), disabled: !!o, children: "返回" }),
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "is-danger",
            disabled: !!o,
            onClick: async () => {
              await r("retry", s, { acceptDuplicateRisk: !0 }), g(!1);
            },
            children: o === "retry" ? "处理中…" : "接受风险并重试"
          }
        )
      ] })
    ] }) : p.length ? /* @__PURE__ */ i("div", { className: "reader-agent-operation-actions", children: p.map((S) => /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: S.primary ? "is-primary" : S.danger ? "is-danger" : "",
        disabled: !!o,
        onClick: () => {
          S.risk ? g(!0) : r(S.action, s);
        },
        children: o === S.action ? "处理中…" : S.label
      },
      S.action
    )) }) : null
  ] });
}
function wn({
  entries: t,
  confirmationMode: e,
  runtimeRestarting: n,
  loadCandidate: r,
  onAction: a
}) {
  const [s, o] = W(pn), c = t.filter((d) => !s.has(Be(d.operation)));
  function m(d) {
    const v = Be(d);
    o((g) => {
      const b = new Set(g);
      return b.add(v), mn(b), b;
    });
  }
  return /* @__PURE__ */ T("section", { className: `reader-agent-operations${c.length ? " has-operations" : ""}`, "aria-label": "AI PDF 操作", children: [
    /* @__PURE__ */ T("div", { className: `reader-agent-mode${e === "green_light" ? " is-green" : ""}`, children: [
      /* @__PURE__ */ i(Ct, { size: 13, "aria-hidden": !0 }),
      /* @__PURE__ */ i("span", { children: e === "green_light" ? "绿灯模式 · 自动执行并应用" : "需要确认 · 操作前等待授权" })
    ] }),
    n ? /* @__PURE__ */ T("div", { className: "reader-agent-restarting", role: "status", children: [
      /* @__PURE__ */ i(Re, { className: "is-spinning", size: 13, "aria-hidden": !0 }),
      "正在重启 Agent，新请求暂不可用"
    ] }) : null,
    c.map((d) => /* @__PURE__ */ i(
      vn,
      {
        entry: d,
        mode: e,
        loadCandidate: r,
        onAction: a,
        onDismiss: m
      },
      d.operation.operation_id
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
  var r, a, s, o;
  return ((r = t.status) == null ? void 0 : r.type) === "running" || n && e === t.id ? { type: "running" } : ((a = t.status) == null ? void 0 : a.type) === "incomplete" || ((s = t.status) == null ? void 0 : s.type) === "error" ? {
    type: "incomplete",
    reason: ((o = t.status) == null ? void 0 : o.reason) === "cancelled" ? "cancelled" : "error"
  } : { type: "complete", reason: "stop" };
}
function _n({
  jobId: t = "",
  messages: e = bn,
  citationsByMessageId: n = Rn,
  progressByMessageId: r = Le,
  contentByMessageId: a = Le,
  streamingAssistantId: s = "",
  isRunning: o = !1,
  onSubmit: c,
  onRetry: m,
  onCancel: d,
  onJumpCitation: v,
  onBranchFromAnswer: g,
  branchBusy: b = !1,
  agentOperations: p = Cn,
  assistantMode: l = "reading",
  onAssistantModeChange: x,
  selectionContext: E = null,
  onClearSelectionContext: S
}) {
  const [, B] = W(0);
  U(() => {
    const y = () => B((R) => R + 1);
    return window.addEventListener("focus", y), window.addEventListener("storage", y), document.addEventListener(Fe, y), () => {
      window.removeEventListener("focus", y), window.removeEventListener("storage", y), document.removeEventListener(Fe, y);
    };
  }, []);
  const C = !zt() && !p.runtimeCredentialConfigured, M = X(() => e.map((y) => ({
    id: y.id,
    role: y.role,
    content: a[y.id] || y.content || "",
    ...y.role === "assistant" ? { status: Nn(y, s, o) } : {}
  })), [a, o, e, s]), F = G(async (y) => {
    const R = y ? Math.max(0, e.findIndex((f) => f.id === y) + 1) : 0, $ = e.slice(R).find((f) => f.role === "assistant");
    $ && await m($.id);
  }, [e, m]), u = G(async (y) => {
    const R = Mn(y);
    !R || o || b || p.runtimeRestarting || C || await c(R);
  }, [p.runtimeRestarting, b, o, C, c]), h = G(async () => {
    await d();
  }, [d]), N = X(() => ({
    messages: M,
    isRunning: o,
    isDisabled: b || p.runtimeRestarting || C,
    convertMessage: In,
    onNew: u,
    onReload: F,
    onCancel: h
  }), [
    p.runtimeRestarting,
    b,
    h,
    u,
    o,
    C,
    F,
    M
  ]), k = Pt(N);
  return /* @__PURE__ */ i(Ot, { runtime: k, children: /* @__PURE__ */ i(
    ln,
    {
      jobId: t,
      messages: e,
      citationsByMessageId: n,
      progressByMessageId: r,
      streamingAssistantId: s,
      isRunning: o,
      missingLlmKey: C,
      branchBusy: b,
      agentRequestBlocked: p.runtimeRestarting,
      assistantMode: l,
      onAssistantModeChange: x,
      selectionContext: E,
      onClearSelectionContext: S,
      agentOperationPanel: p.entries.length > 0 || p.runtimeRestarting ? /* @__PURE__ */ i(
        wn,
        {
          entries: p.entries,
          confirmationMode: p.confirmationMode,
          runtimeRestarting: p.runtimeRestarting,
          loadCandidate: p.loadCandidate,
          onAction: p.perform
        }
      ) : null,
      onJumpCitation: v,
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
  disabled: r = !1,
  errorText: a = "",
  onSwitch: s,
  onNew: o,
  onDelete: c,
  onRename: m
}) {
  const d = t.length > 0, v = n || r, [g, b] = W(!1), [p, l] = W(""), [x, E] = W(""), S = L(null), B = pt();
  function C(f) {
    const _ = `${f || ""}`.match(/^fork-(\d+)-(.*)$/i);
    if (!_) return f;
    const P = _[2].trim();
    return P ? `${P} · 分支${_[1]}` : `分支${_[1]}`;
  }
  const M = L(!1), F = L(null), u = t.find((f) => f.id === e) || null, h = u ? u.messageCount ? C(u.title) : `${C(u.title)}（空）` : d ? "选择以往对话" : "新对话";
  U(() => {
    if (!g) {
      l("");
      return;
    }
    const f = (I) => {
      if (M.current) return;
      const w = S.current;
      w && (I.target instanceof Node && w.contains(I.target) || (b(!1), l("")));
    }, _ = (I) => {
      I.key === "Escape" && (b(!1), l(""));
    }, P = window.setTimeout(() => {
      document.addEventListener("pointerdown", f, !0);
    }, 0);
    return document.addEventListener("keydown", _), () => {
      window.clearTimeout(P), document.removeEventListener("pointerdown", f, !0), document.removeEventListener("keydown", _);
    };
  }, [g]), U(() => {
    if (!p) return;
    const f = F.current;
    f && (f.focus(), f.select());
  }, [p]);
  const N = (f) => {
    const _ = `${f || ""}`.trim();
    !_ || v || M.current || p || (M.current = !0, ve(1e3, 0), requestAnimationFrame(() => {
      b(!1), window.setTimeout(() => {
        (async () => {
          try {
            await s(_);
          } finally {
            ve(400, 0), M.current = !1;
          }
        })();
      }, 40);
    }));
  }, k = (f) => {
    v || (l(f.id), E(f.title || ""));
  }, y = () => {
    const f = p, _ = x;
    l(""), f && m(f, _);
  }, R = () => {
    l(""), E("");
  }, $ = (f) => {
    var I;
    if (v || M.current) return;
    const _ = f.title || "未命名对话";
    (I = globalThis.confirm) != null && I.call(globalThis, `确定删除对话「${_}」？此操作不可恢复。`) && (M.current = !0, ve(800, 0), (async () => {
      try {
        await c(f.id);
      } finally {
        M.current = !1;
      }
    })());
  };
  return /* @__PURE__ */ T(
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
        /* @__PURE__ */ T("div", { className: "aui-session-row", children: [
          /* @__PURE__ */ T(
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
                v || !d || b((f) => !f);
              },
              children: [
                /* @__PURE__ */ i("span", { className: "aui-session-trigger-label", children: h }),
                /* @__PURE__ */ i(Ye, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 })
              ]
            }
          ),
          /* @__PURE__ */ T(
            "button",
            {
              type: "button",
              className: "aui-session-btn",
              disabled: v,
              title: "新对话窗口",
              "aria-label": "新对话",
              onClick: () => {
                v || M.current || (M.current = !0, ve(800), b(!1), l(""), window.setTimeout(() => {
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
                n ? /* @__PURE__ */ i(Re, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ i(At, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
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
              const _ = f.messageCount ? C(f.title) : `${C(f.title)}（空）`, P = f.id === e, I = p === f.id;
              return /* @__PURE__ */ i("li", { className: "aui-session-row-item", role: "presentation", children: I ? /* @__PURE__ */ T("div", { className: "aui-session-edit", children: [
                /* @__PURE__ */ i(
                  "input",
                  {
                    ref: F,
                    className: "aui-session-edit-input",
                    value: x,
                    maxLength: 80,
                    "aria-label": "对话标题",
                    disabled: v,
                    onChange: (w) => E(w.target.value),
                    onKeyDown: (w) => {
                      w.key === "Enter" ? (w.preventDefault(), y()) : w.key === "Escape" && (w.preventDefault(), R());
                    },
                    onClick: (w) => w.stopPropagation()
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": "保存标题",
                    title: "保存",
                    disabled: v || !x.trim(),
                    onClick: (w) => {
                      w.stopPropagation(), y();
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
                    disabled: v,
                    onClick: (w) => {
                      w.stopPropagation(), R();
                    },
                    children: /* @__PURE__ */ i(be, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }) : /* @__PURE__ */ T(Ie, { children: [
                /* @__PURE__ */ T(
                  "button",
                  {
                    type: "button",
                    role: "option",
                    "aria-selected": P,
                    className: `aui-session-item${P ? " is-active" : ""}`,
                    disabled: v,
                    title: _,
                    onPointerDown: (w) => {
                      w.stopPropagation(), !P && !v && se(1e3);
                    },
                    onClick: (w) => {
                      if (w.preventDefault(), w.stopPropagation(), P) {
                        b(!1);
                        return;
                      }
                      N(f.id);
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
                    onClick: (w) => {
                      w.preventDefault(), w.stopPropagation(), k(f);
                    },
                    children: /* @__PURE__ */ i(St, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
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
                    onClick: (w) => {
                      w.preventDefault(), w.stopPropagation(), $(f);
                    },
                    children: /* @__PURE__ */ i($t, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
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
function ot(t) {
  return ((t == null ? void 0 : t.parts) || []).filter((e) => e.type === "text").map((e) => e.text).join("").trim();
}
function An(t, e) {
  const n = `${e.question || ""}`.trim();
  if (n) return n;
  for (let r = t.length - 1; r >= 0; r -= 1) {
    const a = t[r];
    if (a.role !== "user") continue;
    const s = ot(a);
    if (s) return s;
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
    messages: r,
    trigger: a
  }) {
    var l, x, E, S;
    const s = n || {}, o = An(r, s);
    if (!o) throw new Error("请输入问题。");
    const c = s.assistantMode || ((x = (l = this.options).getAssistantMode) == null ? void 0 : x.call(l)) || "reading", m = s.scope || "document", d = s.context ? { ...s.context } : null, v = `${s.assistantMessageId || ""}`.trim() || `a-${Date.now().toString(36)}`, g = `${v}-text`, b = this.options.getRemoteAnswerer(), p = ((S = (E = this.options).getLocalAnswerer) == null ? void 0 : S.call(E)) || null;
    if (!b && !p)
      throw new Error("问答暂不可用：请确认已打开任务阅读器。");
    return new ReadableStream({
      start: (B) => {
        let C = !1, M = "", F = {
          citations: [],
          progress: a === "regenerate-message" ? "正在重新生成…" : "正在检索文档…",
          status: "running"
        };
        const u = (N) => {
          C || B.enqueue(N);
        }, h = (N) => {
          F = { ...F, ...N }, u({ type: "message-metadata", messageMetadata: F });
        };
        u({ type: "start", messageId: v, messageMetadata: F }), u({ type: "start-step" }), u({ type: "text-start", id: g }), (async () => {
          var N, k, y, R, $, f;
          try {
            if (await ((N = b == null ? void 0 : b.ensureLoaded) == null ? void 0 : N.call(b, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
            let _ = b || p, P = !1, I;
            try {
              I = await _.answer({
                question: o,
                assistantMode: c,
                scope: m,
                context: d,
                parentId: `${s.parentId || ""}`.trim(),
                regenerate: s.regenerate ?? a === "regenerate-message",
                userMessageId: `${s.userMessageId || ""}`.trim(),
                assistantMessageId: v,
                onAgentSessionEvent: (A) => {
                  var Y, J, de;
                  const D = (Y = A == null ? void 0 : A.capabilities) == null ? void 0 : Y.document_operation_confirmation_mode;
                  (D === "explicit" || D === "green_light") && ((de = (J = this.options).onConfirmationMode) == null || de.call(J, D));
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
                  if (M || e != null && e.aborted) return;
                  const D = Wt(A);
                  D && h({ progress: D });
                },
                onProgressEvent: (A) => {
                  if (M || e != null && e.aborted) return;
                  const D = `${(A == null ? void 0 : A.message) || ""}`.trim();
                  D && h({ progress: D });
                },
                onAnswerDelta: (A, D) => {
                  !D || e != null && e.aborted || (M += D, F.progress && h({ progress: "" }), u({ type: "text-delta", id: g, delta: D }));
                },
                onCompress: (A) => {
                  if (M || e != null && e.aborted) return;
                  const D = Number(A == null ? void 0 : A.dropped_turns) || 0;
                  D && h({ progress: `已压缩 ${D} 轮早期对话` });
                },
                signal: e
              });
            } catch (A) {
              if (e != null && e.aborted || c === "operations" || !b || !p || !Sn(A)) throw A;
              if (P = !0, h({ progress: "在线服务暂不可用，改用本地检索…" }), await ((k = p.ensureLoaded) == null ? void 0 : k.call(p, this.options.jobId)), e != null && e.aborted) throw new Error("aborted");
              _ = p, I = await _.answer({
                question: o,
                assistantMode: c,
                scope: m,
                context: d,
                signal: e
              });
            }
            if (e != null && e.aborted) {
              h({ progress: "", status: "cancelled" }), u({ type: "abort", reason: "cancelled" });
              return;
            }
            const w = I == null ? void 0 : I.confirmationMode;
            (w === "explicit" || w === "green_light") && ((R = (y = this.options).onConfirmationMode) == null || R.call(y, w));
            const z = `${(I == null ? void 0 : I.conversationId) || ""}`.trim() || void 0, H = /* @__PURE__ */ new Set();
            for (const A of (I == null ? void 0 : I.operationRefs) || []) {
              const D = typeof A == "string" ? A : `${(A == null ? void 0 : A.operation_id) || ""}`;
              D.trim() && H.add(D.trim());
            }
            for (const A of (I == null ? void 0 : I.confirmationRequests) || []) {
              const D = `${(A == null ? void 0 : A.operation_id) || ""}`.trim();
              D && H.add(D);
            }
            for (const A of H)
              (f = ($ = this.options).onAgentOperationSignal) == null || f.call($, {
                operationId: A,
                conversationId: z,
                confirmationMode: w || void 0
              });
            const O = qt(I == null ? void 0 : I.citations);
            let q = jt(
              `${(I == null ? void 0 : I.answer) || M || ""}`.trim() || "没有找到可用回答。",
              O
            );
            if (P && (q += `

_在线服务暂不可用，以上来自本地文档检索。_`), (I == null ? void 0 : I.persisted) === !1 && (q += `

_⚠️ 本轮回答未能写入历史记录（存储暂时不可用），刷新后可能丢失。_`), !M)
              u({ type: "text-delta", id: g, delta: q });
            else if (q.startsWith(M)) {
              const A = q.slice(M.length);
              A && u({ type: "text-delta", id: g, delta: A });
            }
            u({ type: "text-end", id: g }), h({
              citations: O,
              persisted: (I == null ? void 0 : I.persisted) !== !1,
              progress: "",
              status: "complete"
            }), u({ type: "finish-step" }), u({ type: "finish", finishReason: "stop", messageMetadata: F });
          } catch (_) {
            e != null && e.aborted ? (h({ progress: "", status: "cancelled" }), u({ type: "abort", reason: "cancelled" })) : (h({ progress: "", status: "error" }), u({
              type: "error",
              errorText: _ instanceof Error ? _.message : "生成回答失败，请重试。"
            }));
          } finally {
            C || (C = !0, B.close());
          }
        })();
      }
    });
  }
  async reconnectToStream() {
    return null;
  }
}
function En(t) {
  return ot(t);
}
function ct(t) {
  return t.map((e) => {
    var n, r;
    return {
      id: e.id,
      role: e.role,
      metadata: e.role === "assistant" ? {
        citations: e.citations || [],
        progress: e.progress || "",
        status: ((n = e.status) == null ? void 0 : n.type) === "running" ? "running" : ((r = e.status) == null ? void 0 : r.type) === "incomplete" ? e.status.reason === "cancelled" ? "cancelled" : "error" : "complete"
      } : void 0,
      parts: [{ type: "text", text: e.content || "" }]
    };
  });
}
function xn(t) {
  const e = t.metadata || {}, n = e.status === "running", r = e.status === "cancelled" || e.status === "error";
  return {
    id: t.id,
    role: t.role,
    content: En(t),
    ...t.role === "assistant" ? {
      citations: e.citations || [],
      progress: e.progress || "",
      status: n ? { type: "running" } : r ? {
        type: "incomplete",
        reason: e.status === "cancelled" ? "cancelled" : "error"
      } : { type: "complete", reason: "stop" }
    } : {}
  };
}
function Tn(t) {
  const e = L(t.remoteAnswerer), n = L(t.localAnswerer), r = L(t.onAgentOperationSignal), a = L(t.onConfirmationMode), s = L(t.assistantMode);
  e.current = t.remoteAnswerer, n.current = t.localAnswerer, r.current = t.onAgentOperationSignal, a.current = t.onConfirmationMode, s.current = t.assistantMode;
  const o = X(() => new Bt({
    id: `reader-${t.jobId || "idle"}`,
    transport: new $n({
      jobId: t.jobId,
      getRemoteAnswerer: () => e.current,
      getLocalAnswerer: () => n.current,
      getAssistantMode: () => s.current,
      onAgentOperationSignal: (c) => {
        var m;
        return (m = r.current) == null ? void 0 : m.call(r, c);
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
  }, [o]), Lt({ chat: o, experimental_throttle: 16 });
}
function Pn(t) {
  for (let e = t.length - 1; e >= 0; e -= 1)
    if (t[e].role === "assistant") return t[e];
}
function Ee(t, e) {
  return {
    version: 1,
    headId: e,
    items: t.map((n) => {
      var r;
      return {
        parentId: n.parentId,
        message: {
          id: n.message.id,
          role: n.message.role,
          content: n.message.content,
          ...n.message.progress ? { progress: n.message.progress } : {},
          ...(r = n.message.citations) != null && r.length ? { citations: n.message.citations } : {},
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
  const n = new Map(t.map((c) => [c.message.id, c])), r = e && n.get(e) || t.at(-1);
  if (!r) return [];
  const a = [];
  let s = r;
  const o = /* @__PURE__ */ new Set();
  for (; s && !o.has(s.message.id); )
    o.add(s.message.id), a.push(s.message), s = s.parentId ? n.get(s.parentId) : void 0;
  return a.reverse();
}
function On(t, e) {
  var n;
  return e ? ((n = t.find((r) => r.message.id === e)) == null ? void 0 : n.message) ?? null : null;
}
function Dn(t, e) {
  const n = new Map(t.map((o) => [o.message.id, o]));
  let r = n.get(e);
  if (!r) return [];
  const a = [], s = /* @__PURE__ */ new Set();
  for (; r && !s.has(r.message.id); )
    s.add(r.message.id), a.push(r), r = r.parentId ? n.get(r.parentId) : void 0;
  return a.reverse();
}
function Fn(t, e, n) {
  var v, g, b, p;
  const r = `${e || ""}`.trim();
  if (!r || !t.length) return [];
  let a = r;
  t.some((l) => l.message.id === a) || (n && t.some((l) => l.message.id === n) ? a = n : a = ((v = [...t].reverse().find((l) => l.message.role === "assistant")) == null ? void 0 : v.message.id) || "");
  let s = Dn(t, a);
  if (s.length >= 2 && ((g = s.at(-1)) == null ? void 0 : g.message.role) === "assistant") return s;
  s.length === 1 && ((b = s[0]) == null ? void 0 : b.message.role) === "user" && (s = []);
  const o = ae(t, n || a);
  let c = o.findIndex((l) => l.id === a);
  if (c < 0 && (c = o.length - 1), c < 0) return s;
  const m = new Map(t.map((l) => [l.message.id, l])), d = o.slice(0, c + 1).map((l) => m.get(l.id)).filter((l) => !!l);
  for (; d.length && ((p = d.at(-1)) == null ? void 0 : p.message.role) !== "assistant"; ) d.pop();
  return d.length ? d : s;
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
  for (const r of t) {
    const a = r.message;
    a.role === "assistant" && ((n = a.citations) != null && n.length) && (e[a.id] = a.citations);
  }
  return e;
}
function Bn(t) {
  const e = {};
  for (const n of t) {
    const r = n.message;
    r.role === "assistant" && r.progress && (e[r.id] = r.progress);
  }
  return e;
}
function Ln(t) {
  const e = {};
  for (const n of t) {
    const r = n.message;
    r.content && (e[r.id] = r.content);
  }
  return e;
}
function jn(t, e, n) {
  var a;
  const r = e || ((a = n == null ? void 0 : n.getConversationId) == null ? void 0 : a.call(n)) || "";
  return (t || []).map((s) => ({
    ...Ut(s, { active: r }),
    active: s.conversation_id === r
  }));
}
function Kn(t) {
  const { setItems: e, setHeadId: n } = t;
  return {
    readItems: () => t.itemsRef.current,
    readHeadId: () => t.headIdRef.current,
    appendExchange: ({ parentId: r, userId: a, assistantId: s, question: o, progress: c }) => {
      e((m) => [
        ...m,
        { parentId: r, message: { id: a, role: "user", content: o } },
        {
          parentId: a,
          message: {
            id: s,
            role: "assistant",
            content: "",
            progress: c,
            status: { type: "running" },
            citations: []
          }
        }
      ]), n(s);
    },
    appendRetryTurn: ({ assistantId: r, branchParent: a }) => {
      e((s) => [
        ...s,
        {
          parentId: a,
          message: {
            id: r,
            role: "assistant",
            content: "",
            progress: "正在重新生成…",
            status: { type: "running" },
            citations: []
          }
        }
      ]), n(r);
    },
    markRunningCancelled: () => {
      e(
        (r) => r.map(
          (a) => {
            var s;
            return ((s = a.message.status) == null ? void 0 : s.type) === "running" ? {
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
    markRunningAsError: (r) => {
      const a = `${r || ""}`.trim() || "生成回答失败，请重试。";
      e((s) => s.map((o) => {
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
    mergeChatMirror: (r) => {
      r.size && e((a) => a.map((s) => {
        const o = r.get(s.message.id);
        return o ? { ...s, message: { ...s.message, ...o } } : s;
      }));
    }
  };
}
function Wn(t) {
  const {
    jobId: e,
    documentId: n,
    enabled: r,
    refreshSessions: a,
    applyConversationTree: s,
    remoteRef: o,
    streamRef: c,
    itemsRef: m,
    documentIdRef: d,
    lastJobRef: v,
    persistReadyRef: g,
    switchTokenRef: b,
    sessionListGenerationRef: p,
    activeConversationIdRef: l,
    setItems: x,
    setHeadId: E,
    setSessions: S,
    setActiveConversationId: B,
    setSessionBusy: C
  } = t;
  U(() => {
    const M = o.current;
    if (!e) {
      p.current += 1, b.current += 1, x([]), E(null), S([]), B(""), c.current.clearMessages(), l.current = "", v.current = "", d.current = "", g.current = !1;
      return;
    }
    const F = v.current !== e;
    if (F && (p.current += 1, b.current += 1, v.current = e, g.current = !1, x([]), E(null), c.current.clearMessages(), S([]), B(""), l.current = "", d.current = "", C(!1)), !r || !M) {
      p.current += 1;
      return;
    }
    let u = !1;
    return (async () => {
      var $, f, _, P;
      let h = `${n || d.current || ""}`.trim();
      if (!h) {
        try {
          h = `${await (($ = M.getDocumentId) == null ? void 0 : $.call(M)) || ""}`.trim();
        } catch {
          h = "";
        }
        if (u) return;
      }
      h && (d.current = h);
      let N = null;
      if (!u && h && (N = await a(h)), !(F || !m.current.length) || u) {
        u || (g.current = !0);
        return;
      }
      const y = Ht({ jobId: e, documentId: h }) || `${((f = M.getConversationId) == null ? void 0 : f.call(M)) || ""}`.trim();
      if (y) {
        B(y), l.current = y, (_ = M.setConversationId) == null || _.call(M, y, h);
        try {
          const I = await ze(y);
          if (u) return;
          const w = we(I.messages || []);
          if (w.length) {
            s(w, I.head_id), requestAnimationFrame(() => {
              u || (g.current = !0);
            });
            return;
          }
        } catch {
        }
      }
      if (!u && h)
        try {
          const I = N ?? await a(h);
          if (u || !I) return;
          const w = I[0];
          if (w != null && w.conversation_id) {
            const z = w.conversation_id;
            B(z), l.current = z, (P = M.setConversationId) == null || P.call(M, z, h);
            try {
              const H = await ze(z);
              if (u) return;
              s(
                we(H.messages || []),
                H.head_id
              ), requestAnimationFrame(() => {
                u || (g.current = !0);
              });
              return;
            } catch {
            }
          }
        } catch {
        }
      if (u) return;
      const R = et({ jobId: e, documentId: h }, y);
      if (R != null && R.items.length) {
        const I = dt(R);
        x(I.items), E(I.headId), c.current.showMessages(ae(I.items, I.headId));
      } else
        x([]), E(null), c.current.clearMessages();
      requestAnimationFrame(() => {
        u || (g.current = !0);
      });
    })(), () => {
      u = !0, p.current += 1;
    };
  }, [e, n, r, a, s]);
}
function Un(t) {
  const {
    jobId: e,
    documentId: n,
    items: r,
    headId: a,
    activeConversationId: s,
    documentIdRef: o,
    persistReadyRef: c
  } = t;
  U(() => {
    if (!e || !c.current) return;
    const m = s, d = { jobId: e, documentId: n || o.current }, v = window.setTimeout(() => {
      if (!r.length) {
        fe(d, m);
        return;
      }
      $e(d, Ee(r, a), m);
    }, 280);
    return () => window.clearTimeout(v);
  }, [e, n, r, a, s]);
}
function Hn(t) {
  const {
    jobId: e,
    documentId: n,
    sessionBusy: r,
    sessions: a,
    streamRef: s,
    remoteRef: o,
    itemsRef: c,
    headIdRef: m,
    activeConversationIdRef: d,
    documentIdRef: v,
    switchTokenRef: g,
    persistReadyRef: b,
    setSessionBusy: p,
    setSessionError: l,
    setActiveConversationId: x,
    setItems: E,
    setHeadId: S,
    setSessions: B,
    refreshSessions: C,
    applyConversationTree: M
  } = t, F = G(() => {
    var R, $;
    const y = `${(($ = (R = o.current) == null ? void 0 : R.getConversationId) == null ? void 0 : $.call(R)) || ""}`.trim();
    y && x(y);
  }, []), u = G(async () => {
    var R, $;
    if (r) return;
    await s.current.stopStream(), ce(900), se(900), p(!0), l("");
    const y = ++g.current;
    try {
      if (await new Promise((P) => {
        window.setTimeout(P, 40);
      }), y !== g.current) return;
      const f = o.current, _ = v.current || `${await ((R = f == null ? void 0 : f.getDocumentId) == null ? void 0 : R.call(f)) || ""}`.trim();
      if (y !== g.current) return;
      v.current = _, ($ = f == null ? void 0 : f.clearConversationId) == null || $.call(f, _), x(""), d.current = "", E([]), S(null), s.current.clearMessages(), fe({ jobId: e, documentId: _ }), _ && await C(_, y);
    } catch (f) {
      console.warn("[reader-ai] new session failed", f), l("无法创建新对话，请重试。");
    } finally {
      y === g.current && p(!1);
    }
  }, [e, C, r]), h = G(async (y) => {
    var P, I, w, z, H;
    const R = `${y || ""}`.trim();
    if (!R)
      return l("无法分支：消息 id 无效。"), !1;
    if (r)
      return l("请稍候，当前有会话操作进行中。"), !1;
    await s.current.stopStream();
    const $ = Fn(c.current, R, m.current);
    if (!$.length)
      return l("无法分支：找不到到此答案的对话路径。"), !1;
    if ($[$.length - 1].message.role !== "assistant")
      return l("只能从助手答案处开新对话。"), !1;
    p(!0), l("");
    const _ = ++g.current;
    try {
      if (await new Promise((j) => {
        window.setTimeout(j, 40);
      }), _ !== g.current) return !1;
      const O = o.current;
      let q = v.current || `${await ((P = O == null ? void 0 : O.getDocumentId) == null ? void 0 : P.call(O)) || ""}`.trim();
      if (_ !== g.current) return !1;
      if (v.current = q, !q)
        try {
          if (q = `${await ((I = O == null ? void 0 : O.getDocumentId) == null ? void 0 : I.call(O)) || ""}`.trim(), _ !== g.current) return !1;
          v.current = q;
        } catch {
          q = "";
        }
      if (!q)
        return l("无法分支：文档未就绪，请稍后重试。"), !1;
      const A = $.map((j, re) => ({
        id: j.message.id,
        role: j.message.role,
        content: j.message.content,
        citations: j.message.citations,
        parentId: re === 0 ? null : $[re - 1].message.id
      })), D = d.current || ((w = O == null ? void 0 : O.getConversationId) == null ? void 0 : w.call(O)) || "", Y = (a || []).find((j) => j.conversation_id === D), J = A.find((j) => j.role === "user"), de = `${(Y == null ? void 0 : Y.title) || ""}`.trim() || `${(J == null ? void 0 : J.content) || ""}`.replace(/\s+/g, " ").trim() || "未命名对话", Ce = (a || []).map((j) => j.title || ""), pe = Gt(de, Ce), te = await ue().forkFromPath({
        documentId: q,
        title: pe,
        path: A
      });
      if (_ !== g.current) return !1;
      const K = Se(te.items), Q = ((z = K[K.length - 1]) == null ? void 0 : z.message.id) || null, V = te.conversation.conversation_id;
      if (!V || !K.length)
        throw new Error("fork returned empty conversation");
      return ce(600), se(600), E(K), S(Q), s.current.showMessages(ae(K, Q)), x(V), d.current = V, (H = O == null ? void 0 : O.setConversationId) == null || H.call(O, V, q), B((j) => {
        const re = {
          conversation_id: V,
          title: pe,
          document_id: q,
          created_at: te.conversation.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: te.conversation.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
          message_count: K.length,
          head_id: Q || ""
        }, ie = j.filter((le) => le.conversation_id !== V);
        return [re, ...ie];
      }), $e(
        { jobId: e, documentId: q },
        Ee(K, Q),
        V
      ), await C(q, _), !0;
    } catch (O) {
      return console.warn("[reader-ai] branch from answer failed", O), _ === g.current && l("分支失败：未能复制上文到新对话。请检查网络后重试。"), !1;
    } finally {
      _ === g.current && p(!1);
    }
  }, [e, C, r, a]), N = G(async (y) => {
    var f, _, P, I;
    const R = `${y || ""}`.trim();
    if (!R || r) return;
    await s.current.stopStream(), p(!0), l("");
    const $ = ++g.current;
    try {
      const w = o.current, z = v.current || `${await ((f = w == null ? void 0 : w.getDocumentId) == null ? void 0 : f.call(w)) || ""}`.trim();
      if ($ !== g.current) return;
      v.current = z;
      try {
        await ue().delete(R);
      } catch (q) {
        if ((Number(q == null ? void 0 : q.status) || 0) !== 404) throw q;
      }
      fe({ jobId: e, documentId: z }, R);
      const O = (d.current || ((_ = w == null ? void 0 : w.getConversationId) == null ? void 0 : _.call(w)) || "") === R;
      if (B((q) => q.filter((A) => A.conversation_id !== R)), O) {
        (P = w == null ? void 0 : w.clearConversationId) == null || P.call(w, z), x(""), d.current = "", E([]), S(null), s.current.clearMessages(), fe({ jobId: e, documentId: z });
        const q = z ? await C(z, $) : [];
        if ($ !== g.current || !q) return;
        const A = q[0];
        if (A != null && A.conversation_id) {
          const D = A.conversation_id;
          x(D), d.current = D;
          try {
            const Y = await ue().get(D);
            if ($ !== g.current) return;
            M(
              we(Y.messages || []),
              Y.head_id
            ), (I = w == null ? void 0 : w.setConversationId) == null || I.call(w, D, z);
          } catch {
            E([]), S(null);
          }
        }
      } else z && await C(z, $);
    } catch (w) {
      console.warn("[reader-ai] delete session failed", w), l("删除对话失败，请重试。");
    } finally {
      $ === g.current && p(!1);
    }
  }, [M, e, C, r]), k = G(async (y, R) => {
    const $ = `${y || ""}`.trim(), f = `${R || ""}`.replace(/\s+/g, " ").trim();
    if (!$ || !f || r) return;
    p(!0), l("");
    const _ = ++g.current;
    try {
      const P = f.slice(0, 80);
      if (await ue().patch($, { title: P }), _ !== g.current) return;
      B(
        (w) => w.map(
          (z) => z.conversation_id === $ ? { ...z, title: P } : z
        )
      );
      const I = v.current;
      I && await C(I, _);
    } catch (P) {
      console.warn("[reader-ai] rename session failed", P), l("重命名失败，请重试。");
    } finally {
      _ === g.current && p(!1);
    }
  }, [C, r]);
  return {
    adoptRemoteConversationId: F,
    newSession: u,
    branchFromAnswer: h,
    removeSession: N,
    renameSession: k
  };
}
function Gn(t) {
  var pe;
  const {
    jobId: e,
    documentId: n = "",
    enabled: r,
    remoteAnswerer: a = null,
    stream: s = zn
  } = t, [o, c] = W([]), [m, d] = W(null), [v, g] = W([]), [b, p] = W(""), [l, x] = W(!1), [E, S] = W(""), B = L(o), C = L(m), M = L(b), F = L(!1), u = L(""), h = L(""), N = L(0), k = L(0), y = L(s);
  y.current = s;
  const R = L(a);
  R.current = a, B.current = o, C.current = m, M.current = b;
  const $ = G(async (te = "", K) => {
    const Q = `${te || h.current || ""}`.trim(), V = ++k.current;
    if (!Q)
      return V === k.current && (K === void 0 || K === N.current) && g([]), [];
    try {
      const j = ue();
      if (!j) return null;
      const ie = (await j.list({ document_id: Q, limit: 50 })).conversations || [];
      return V === k.current && Q === `${h.current || ""}`.trim() && (K === void 0 || K === N.current) ? (g(ie), ie) : null;
    } catch {
      return null;
    }
  }, []), f = G((te, K) => {
    var j;
    const Q = Se(te), V = `${K || ""}`.trim() || ((j = Q[Q.length - 1]) == null ? void 0 : j.message.id) || null;
    c(Q), d(V), y.current.showMessages(ae(Q, V));
  }, []), _ = G(() => `${n || h.current || e}`.trim(), [n, e]);
  Wn({
    jobId: e,
    documentId: n,
    enabled: r,
    refreshSessions: $,
    applyConversationTree: f,
    remoteRef: R,
    streamRef: y,
    itemsRef: B,
    documentIdRef: h,
    lastJobRef: u,
    persistReadyRef: F,
    switchTokenRef: N,
    sessionListGenerationRef: k,
    activeConversationIdRef: M,
    setItems: c,
    setHeadId: d,
    setSessions: g,
    setActiveConversationId: p,
    setSessionBusy: x
  }), Un({
    jobId: e,
    documentId: n,
    items: o,
    headId: m,
    activeConversationId: b,
    documentIdRef: h,
    persistReadyRef: F
  });
  const P = X(
    () => ae(o, m),
    [o, m]
  ), I = X(
    () => qn(o),
    [o]
  ), w = X(
    () => Bn(o),
    [o]
  ), z = X(
    () => Ln(o),
    [o]
  ), H = X(() => Kn({ setItems: c, setHeadId: d, itemsRef: B, headIdRef: C }), []), {
    adoptRemoteConversationId: O,
    newSession: q,
    branchFromAnswer: A,
    removeSession: D,
    renameSession: Y
  } = Hn({
    jobId: e,
    documentId: n,
    sessionBusy: l,
    sessions: v,
    streamRef: y,
    remoteRef: R,
    itemsRef: B,
    headIdRef: C,
    activeConversationIdRef: M,
    documentIdRef: h,
    switchTokenRef: N,
    persistReadyRef: F,
    setSessionBusy: x,
    setSessionError: S,
    setActiveConversationId: p,
    setItems: c,
    setHeadId: d,
    setSessions: g,
    refreshSessions: $,
    applyConversationTree: f
  }), J = G(async (te) => {
    var j, re, ie, le, xe, Te, Pe, Oe;
    const K = `${te || ""}`.trim(), Q = M.current || ((re = (j = R.current) == null ? void 0 : j.getConversationId) == null ? void 0 : re.call(j)) || "";
    if (!K || K === Q || l) return;
    await y.current.stopStream(), ce(1200), se(1200), x(!0), S("");
    const V = ++N.current;
    F.current = !1, p(K), M.current = K, c([]), d(null), y.current.clearMessages();
    try {
      if (await new Promise((ge) => {
        window.setTimeout(ge, 80);
      }), V !== N.current) return;
      try {
        (xe = (le = (ie = globalThis.document) == null ? void 0 : ie.activeElement) == null ? void 0 : le.blur) == null || xe.call(le);
      } catch {
      }
      const Z = R.current, ee = h.current || `${await ((Te = Z == null ? void 0 : Z.getDocumentId) == null ? void 0 : Te.call(Z)) || ""}`.trim();
      if (V !== N.current) return;
      h.current = ee;
      const oe = ue();
      if (!oe) throw new Error("Reader conversations unavailable");
      const Me = await oe.get(K);
      if (V !== N.current) return;
      ce(800), se(800);
      const Ne = we(Me.messages || []);
      if (f(Ne, Me.head_id), (Pe = Z == null ? void 0 : Z.setConversationId) == null || Pe.call(Z, K, ee), F.current = !0, Ne.length) {
        const ge = Se(Ne);
        $e(
          { jobId: e, documentId: ee },
          Ee(
            ge,
            `${Me.head_id || ""}`.trim() || ((Oe = ge.at(-1)) == null ? void 0 : Oe.message.id) || null
          ),
          K
        );
      } else
        fe({ jobId: e, documentId: ee }, K);
      ee && await $(ee, V), ce(350), se(350);
    } catch (Z) {
      if (console.warn("[reader-ai] switch session failed", Z), V === N.current) {
        S("加载该对话失败，请检查网络后重试。");
        const ee = et(
          { jobId: e, documentId: n || h.current },
          K
        );
        if (ee != null && ee.items.length) {
          const oe = dt(ee);
          c(oe.items), d(oe.headId), y.current.showMessages(ae(oe.items, oe.headId));
        } else
          c([]), d(null);
        F.current = !0;
      }
    } finally {
      V === N.current && x(!1);
    }
  }, [
    f,
    e,
    n,
    $,
    l
  ]), de = X(
    () => jn(v, b, a),
    [v, b, a]
  ), Ce = X(() => ({
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
    citationsByMessageId: I,
    progressByMessageId: w,
    contentByMessageId: z,
    sessions: de,
    activeConversationId: b || ((pe = a == null ? void 0 : a.getConversationId) == null ? void 0 : pe.call(a)) || "",
    sessionBusy: l,
    sessionError: E,
    resolveRequestScopeKey: _,
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
  const e = t, n = e.assistantMode === "operations" ? "operations" : e.assistantMode === "reading" ? "reading" : null, r = e.scope === "selection" || e.scope === "page" || e.scope === "document" ? e.scope : null;
  if (!n || !r) return null;
  const a = e.context && typeof e.context == "object" && !Array.isArray(e.context) ? { ...e.context } : null;
  return { assistantMode: n, scope: r, context: a };
}
function je(t, e, n) {
  var s;
  const r = `${t || ""}`.trim(), a = `${e || ""}`.trim();
  if (!(!r || !a))
    try {
      (s = globalThis.localStorage) == null || s.setItem(
        lt(r, a),
        JSON.stringify(n)
      );
    } catch {
    }
}
function Ke(t, e) {
  var a;
  const n = `${t || ""}`.trim(), r = `${e || ""}`.trim();
  if (!n || !r) return null;
  try {
    const s = (a = globalThis.localStorage) == null ? void 0 : a.getItem(lt(n, r));
    return s ? Jn(JSON.parse(s)) : null;
  } catch {
    return null;
  }
}
function Qn(t) {
  const e = `${t.scopeKey || ""}`.trim(), n = `${t.jobId || ""}`.trim(), r = `${t.assistantMessageId || ""}`.trim();
  return Ke(e, r) || (e !== n ? Ke(n, r) : null) || Yn;
}
function Xn(t) {
  const { assistantMode: e, selectionContext: n } = t;
  return e === "operations" ? { assistantMode: e, scope: "document", context: null } : n ? { assistantMode: e, scope: "selection", context: { ...n } } : { assistantMode: e, scope: "document", context: null };
}
function Zn(t) {
  var F;
  const { jobId: e, assistantMode: n, selectionContext: r = null, tree: a, chat: s, getScopeKey: o } = t, c = L(a);
  c.current = a;
  const m = L(s);
  m.current = s;
  const d = L(n);
  d.current = n;
  const v = L(r);
  v.current = r;
  const g = L(o);
  g.current = o;
  const b = s.status, p = b === "submitted" || b === "streaming", l = L(p);
  l.current = p;
  const x = p ? `${((F = Pn(s.messages)) == null ? void 0 : F.id) || ""}` : "", E = s.messages, S = s.error;
  U(() => {
    if (!E.length) return;
    const u = new Map(E.map((N) => [N.id, N])), h = /* @__PURE__ */ new Map();
    for (const [N, k] of u)
      h.set(N, xn(k));
    c.current.mergeChatMirror(h);
  }, [E]), U(() => {
    !S || b !== "error" || c.current.markRunningAsError(S.message);
  }, [S, b]);
  const B = G(async (u) => {
    if (l.current) return;
    const h = `${u || ""}`.trim();
    if (!h) return;
    const N = c.current, k = m.current, y = d.current, R = v.current, $ = g.current(), f = N.readHeadId(), _ = ke("u"), P = ke("a"), I = Xn({
      assistantMode: y,
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
    je($, P, I), N.appendExchange({
      parentId: f,
      userId: _,
      assistantId: P,
      question: h,
      progress: I.assistantMode === "operations" ? "正在规划 PDF 操作…" : "正在理解文档…"
    }), await k.sendUserMessage(
      { id: _, role: "user", parts: [{ type: "text", text: h }] },
      {
        body: {
          assistantMessageId: P,
          assistantMode: I.assistantMode,
          parentId: f,
          question: h,
          regenerate: !1,
          userMessageId: _,
          scope: I.scope,
          context: I.context
        }
      }
    );
  }, []), C = G(async (u) => {
    if (l.current) return;
    const h = c.current, N = m.current, k = h.readItems(), y = k.find(
      (H) => H.message.id === u && H.message.role === "assistant"
    ), R = (y == null ? void 0 : y.parentId) ?? null, $ = R ? On(k, R) : null;
    let f = "", _ = R;
    if (($ == null ? void 0 : $.role) === "user")
      f = $.content.trim();
    else {
      const H = ae(k, R ?? h.readHeadId());
      for (let O = H.length - 1; O >= 0; O -= 1)
        if (H[O].role === "user") {
          f = H[O].content.trim(), _ = H[O].id;
          break;
        }
    }
    if (!f) return;
    const P = ke("a"), I = _ || R, w = g.current(), z = Qn({
      scopeKey: w,
      jobId: e,
      assistantMessageId: u
    });
    je(w, P, z), h.appendRetryTurn({ assistantId: P, branchParent: I }), N.replaceVisible(ct(ae(k, u))), await N.regenerateFrom({
      messageId: u,
      body: {
        assistantMessageId: P,
        assistantMode: z.assistantMode,
        parentId: I,
        question: f,
        regenerate: !0,
        userMessageId: _ || "",
        scope: z.scope,
        context: z.context
      }
    });
  }, [e]), M = G(async () => {
    await m.current.stopStream(), c.current.markRunningCancelled();
  }, []);
  return {
    isRunning: p,
    streamingAssistantId: x,
    submitQuestion: B,
    retryAnswer: C,
    cancelAnswer: M
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
  signal: r,
  confirmationModeHint: a,
  onDocumentCommitted: s
}) {
  const [o, c] = W({}), [m, d] = W("explicit"), [v, g] = W(!1), [b, p] = W(!1), l = L(/* @__PURE__ */ new Set()), x = L(/* @__PURE__ */ new Set()), E = L(/* @__PURE__ */ new Set()), S = G((u, h = !1) => {
    u != null && u.operation_id && c((N) => {
      const k = N[u.operation_id];
      return rr(k == null ? void 0 : k.operation, u) ? {
        ...N,
        [u.operation_id]: {
          ...k,
          operation: u,
          pendingAction: void 0,
          error: void 0
        }
      } : !h || !(k != null && k.pendingAction) ? N : {
        ...N,
        [u.operation_id]: { ...k, pendingAction: void 0 }
      };
    });
  }, []), B = G(async (u, h = !1) => {
    const N = `${u || ""}`.trim(), k = `refresh:${N}`;
    if (!(!N || l.current.has(k))) {
      l.current.add(k);
      try {
        const y = me();
        if (!y) return;
        S(await y.get(N), h);
      } catch {
      } finally {
        l.current.delete(k);
      }
    }
  }, [S]), C = G(async () => {
    const u = `${t || ""}`.trim(), h = `recover:${u}`;
    if (!(!e || !u || l.current.has(h))) {
      l.current.add(h);
      try {
        const N = me();
        if (!N) return;
        const k = await N.list(u, {});
        if (!E.current.has(u)) {
          for (const y of k.operations || [])
            y.status === "committed" && x.current.add(y.operation_id);
          E.current.add(u);
        }
        for (const y of k.operations || []) S(y);
      } catch {
      } finally {
        l.current.delete(h);
      }
    }
  }, [t, e, S]);
  U(() => {
    if (!e) return;
    let u = !1;
    const h = async () => {
      try {
        const k = me();
        if (!k) return;
        const y = await k.fetchRuntimeConfig();
        if (u) return;
        d(y.agent_confirmation_mode || "explicit"), p(!!y.llm_api_key_configured), g(
          y.restart_required || y.restart_state === "pending" || y.active_revision !== y.configured_revision
        );
      } catch {
        u || (g(!1), p(!1));
      }
    };
    h();
    const N = window.setInterval(h, 3e3);
    return () => {
      u = !0, window.clearInterval(N);
    };
  }, [e]), U(() => {
    a && d(a);
  }, [a]), U(() => {
    r != null && r.confirmationMode && d(r.confirmationMode), r != null && r.operationId && B(r.operationId);
  }, [B, r]), U(() => {
    C();
  }, [C]), U(() => {
    n || C();
  }, [n, C]);
  const M = X(
    () => Object.values(o).filter((u) => !!t && u.operation.conversation_id === t).sort((u, h) => `${u.operation.created_at || ""}`.localeCompare(`${h.operation.created_at || ""}`)),
    [t, o]
  );
  U(() => {
    var u;
    for (const h of M) {
      const N = h.operation;
      N.status !== "committed" || x.current.has(N.operation_id) || (x.current.add(N.operation_id), s == null || s({
        documentId: N.document_id,
        revision: ((u = N.candidate) == null ? void 0 : u.version_id) || `${N.updated_at || ""}` || `${N.operation_id}:${nr(N)}`
      }));
    }
  }, [M, s]);
  const F = M.some((u) => We(u.operation.status, m));
  return U(() => {
    if (!e || !t || !n && !F) return;
    const u = window.setInterval(() => {
      C();
      for (const h of M)
        We(h.operation.status, m) && B(h.operation.operation_id);
    }, 1400);
    return () => window.clearInterval(u);
  }, [m, t, n, e, M, F, C, B]), U(() => {
    if (!e) return;
    const u = () => void C(), h = () => {
      document.visibilityState === "visible" && u();
    };
    return window.addEventListener("online", u), document.addEventListener("visibilitychange", h), () => {
      window.removeEventListener("online", u), document.removeEventListener("visibilitychange", h);
    };
  }, [e, C]), {
    entries: M,
    confirmationMode: m,
    runtimeRestarting: v,
    runtimeCredentialConfigured: b,
    setEntriesById: c,
    inFlightRef: l,
    upsert: S,
    refresh: B
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
  inFlightRef: r
}) {
  const a = L(/* @__PURE__ */ new Map());
  return { perform: G(async (o, c, m = {}) => {
    const d = `${c.operation_id || ""}`.trim(), v = `action:${d}`;
    if (!d || r.current.has(v)) return;
    if (o === "retry" && c.status === "ambiguous" && m.acceptDuplicateRisk !== !0) {
      n((p) => ({
        ...p,
        [d]: {
          ...p[d],
          error: "请先确认重复执行风险，再重新执行操作。"
        }
      }));
      return;
    }
    const g = cr(d, o, a.current);
    r.current.add(v), n((p) => ({
      ...p,
      [d]: { ...p[d], pendingAction: o, error: void 0 }
    }));
    const b = {
      idempotency_key: g,
      expected_status: c.status,
      expected_attempt: c.current_attempt,
      expected_program_sha256: c.program_sha256 || ""
    };
    try {
      const p = me();
      if (!p) throw new Error("Reader AI operations unavailable");
      let l;
      o === "run" ? l = await p.run(d, b) : o === "cancel" ? l = await p.cancel(d, { ...b, reason: "user_rejected" }) : o === "commit" ? l = await p.commit(d, b) : l = await p.retry(d, m.acceptDuplicateRisk ? { ...b, accept_duplicate_risk: !0 } : b), Ue(d, o, a.current), e(l, !0);
    } catch (p) {
      sr(p) === 409 ? (Ue(d, o, a.current), await t(d, !0)) : n((l) => ({
        ...l,
        [d]: {
          ...l[d],
          pendingAction: void 0,
          error: ar(p)
        }
      }));
    } finally {
      r.current.delete(v);
    }
  }, [t, e]) };
}
function lr({
  conversationId: t,
  enabled: e,
  discovering: n,
  signal: r,
  confirmationModeHint: a,
  onDocumentCommitted: s
}) {
  const o = ir({
    conversationId: t,
    enabled: e,
    discovering: n,
    signal: r,
    confirmationModeHint: a,
    onDocumentCommitted: s
  }), { perform: c } = dr({
    refresh: o.refresh,
    upsert: o.upsert,
    setEntriesById: o.setEntriesById,
    inFlightRef: o.inFlightRef
  }), m = G((d) => {
    var v;
    return ((v = me()) == null ? void 0 : v.fetchCandidate(d.operation_id)) ?? Promise.reject(new Error("Reader AI operations unavailable"));
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
function ur(t) {
  var N;
  const {
    jobId: e,
    documentId: n = "",
    sessionIdentity: r = "",
    enabled: a,
    selectionContext: s = null,
    onDocumentCommitted: o
  } = t, c = `${e}\0${n}\0${r}`, [m, d] = W("reading"), [v, g] = W(null), [b, p] = W();
  U(() => {
    d("reading"), g(null), p(void 0);
  }, [c]);
  const l = X(() => {
    var k;
    return !a || !e ? null : ((k = De()) == null ? void 0 : k.createRemoteAnswerer({ jobId: e, documentId: n })) ?? Et({ jobId: e, documentId: n });
  }, [n, a, e]), x = X(() => {
    var k;
    return !a || !e ? null : ((k = De()) == null ? void 0 : k.createLocalAnswerer({ jobId: e })) ?? Kt({
      loadMarkdownPayload: xt.loadMarkdownPayload
    });
  }, [a, e]), E = Tn({
    jobId: e,
    enabled: a,
    remoteAnswerer: l,
    localAnswerer: x,
    assistantMode: m,
    onAgentOperationSignal: (k) => {
      g({ ...k, nonce: Date.now() + Math.random() });
    },
    onConfirmationMode: p
  }), S = X(() => ({
    messages: E.messages,
    status: E.status,
    error: E.error,
    sendUserMessage: (k, y) => E.sendMessage(
      k,
      y
    ),
    regenerateFrom: (k) => E.regenerate(
      k
    ),
    stopStream: () => E.stop(),
    replaceVisible: (k) => E.setMessages([...k])
  }), [E]), B = X(() => ({
    stopStream: () => S.stopStream(),
    clearMessages: () => S.replaceVisible([]),
    showMessages: (k) => S.replaceVisible(ct(k))
  }), [S]), C = Gn({
    jobId: e,
    documentId: n,
    enabled: a,
    remoteAnswerer: l,
    stream: B
  }), M = Zn({
    jobId: e,
    assistantMode: m,
    selectionContext: s,
    tree: C.tree,
    chat: S,
    getScopeKey: () => C.resolveRequestScopeKey()
  }), F = C.activeConversationId || (v == null ? void 0 : v.conversationId) || `${((N = l == null ? void 0 : l.getConversationId) == null ? void 0 : N.call(l)) || ""}`.trim(), u = lr({
    conversationId: F,
    enabled: a,
    discovering: M.isRunning,
    signal: v,
    confirmationModeHint: b,
    onDocumentCommitted: o
  }), h = L(!1);
  return U(() => {
    h.current = !1;
  }, [e]), U(() => {
    h.current = !1;
  }, [c]), U(() => {
    h.current && !M.isRunning && (C.sessionCommands.refreshSessions(), C.sessionCommands.adoptRemoteConversationId()), h.current = M.isRunning;
  }, [C, M.isRunning]), {
    citationsByMessageId: C.citationsByMessageId,
    progressByMessageId: C.progressByMessageId,
    contentByMessageId: C.contentByMessageId,
    streamingAssistantId: M.streamingAssistantId,
    isRunning: M.isRunning,
    messages: C.messages,
    sessions: C.sessions,
    activeConversationId: C.activeConversationId,
    sessionBusy: C.sessionBusy,
    sessionError: C.sessionError,
    submitQuestion: M.submitQuestion,
    retryAnswer: M.retryAnswer,
    cancelAnswer: M.cancelAnswer,
    newSession: C.sessionCommands.newSession,
    switchSession: C.sessionCommands.switchSession,
    removeSession: C.sessionCommands.removeSession,
    renameSession: C.sessionCommands.renameSession,
    branchFromAnswer: C.sessionCommands.branchFromAnswer,
    agentOperations: u,
    assistantMode: m,
    setAssistantMode: d
  };
}
function Sr({
  open: t,
  jobId: e,
  documentId: n = "",
  sessionIdentity: r = "",
  onClose: a,
  onJumpCitation: s,
  onDocumentCommitted: o,
  layout: c = "floating",
  side: m = "right",
  selectionContext: d = null,
  onClearSelectionContext: v
}) {
  const g = t && !!e, {
    citationsByMessageId: b,
    progressByMessageId: p,
    contentByMessageId: l,
    streamingAssistantId: x,
    isRunning: E,
    sessions: S,
    activeConversationId: B,
    sessionBusy: C,
    sessionError: M,
    messages: F,
    submitQuestion: u,
    retryAnswer: h,
    cancelAnswer: N,
    newSession: k,
    switchSession: y,
    removeSession: R,
    renameSession: $,
    branchFromAnswer: f,
    agentOperations: _,
    assistantMode: P,
    setAssistantMode: I
  } = ur({
    jobId: e,
    documentId: n,
    sessionIdentity: r,
    enabled: g,
    selectionContext: d,
    onDocumentCommitted: o
  }), [w, z] = W(""), H = G(async (q) => {
    z(""), await f(q) && (z(
      "已保存新对话（fork-n-原名）：复制了到此答案的上文，原对话不变。顶部列表可切换。"
    ), window.setTimeout(() => z(""), 6e3));
  }, [f]), O = G((q) => {
    s(q);
  }, [s]);
  return /* @__PURE__ */ i(
    Tt,
    {
      id: "reader-ai-panel",
      open: t,
      title: "RetainPDF AI",
      titleIcon: /* @__PURE__ */ i(he, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.ai-float.pos.v2",
      ariaLabel: "阅读问答",
      width: 420,
      placement: c === "workspace" ? "workspace" : c === "docked" ? "dock-right" : "floating",
      showHeader: c !== "workspace",
      className: `reader-float-ai is-${c}${c === "workspace" ? ` is-pane-${m}` : ""}${C ? " is-session-busy" : ""}`,
      onClose: a,
      children: e ? /* @__PURE__ */ T("div", { className: "reader-float-ai-body", children: [
        /* @__PURE__ */ i(
          kn,
          {
            sessions: S,
            activeId: B,
            busy: C,
            errorText: M,
            onSwitch: y,
            onNew: k,
            onDelete: R,
            onRename: $
          }
        ),
        w ? /* @__PURE__ */ i("div", { className: "aui-session-banner", role: "status", children: w }) : null,
        /* @__PURE__ */ i("div", { className: "reader-float-ai-thread-wrap", "aria-busy": C || void 0, children: /* @__PURE__ */ i(
          _n,
          {
            jobId: e,
            messages: F,
            citationsByMessageId: b,
            progressByMessageId: p,
            contentByMessageId: l,
            streamingAssistantId: x,
            isRunning: E,
            onSubmit: u,
            onRetry: h,
            onCancel: N,
            onJumpCitation: O,
            onBranchFromAnswer: H,
            branchBusy: C,
            agentOperations: _,
            assistantMode: P,
            onAssistantModeChange: I,
            selectionContext: d,
            onClearSelectionContext: v
          }
        ) })
      ] }) : /* @__PURE__ */ T("div", { className: "reader-float-ai-empty", children: [
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
//# sourceMappingURL=ReaderAiPanel-D8HaQlLF.js.map
