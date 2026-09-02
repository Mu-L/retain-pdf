import { jsx as a, jsxs as S, Fragment as Ye } from "react/jsx-runtime";
import { useState as U, useRef as H, useEffect as Q, useMemo as ce, useCallback as V, useId as wt } from "react";
import { ArrowDown as Nt, Sparkles as Me, FileText as Se, BookOpen as Ve, ListTree as kt, FlaskConical as Ct, Copy as $t, GitBranch as Rt, RefreshCw as Mt, Square as St, ArrowUp as Tt, Loader2 as Te, ShieldCheck as Et, Bot as xt, X as Le, ChevronUp as Pt, ChevronDown as Je, TriangleAlert as Xe, ExternalLink as Dt, Check as Qe, Circle as Ot, Plus as Ft, Pencil as Lt, Trash2 as zt } from "lucide-react";
import { R as At } from "./ReaderFloatShell-BnwuViy6.js";
import { ThreadPrimitive as ge, MessagePrimitive as Ze, ActionBarPrimitive as Ee, ComposerPrimitive as Ne, useExternalStoreRuntime as Bt, AssistantRuntimeProvider as qt } from "@assistant-ui/react";
import { A as jt } from "./AiMarkdownAnswer-JudKAKDl.js";
import { j as he, p as le, t as Wt, o as Ut } from "./answer-enhance-C1inCPcI.js";
import { M as Kt, C as We, h as Gt } from "./config-CgaWliJ_.js";
import { e as Ht, d as Yt } from "./ReaderApp-CQBUP2oj.js";
import { Chat as Vt, useChat as Jt } from "@ai-sdk/react";
import { s as Xt, a as Qt, l as Zt, c as ye, b as xe } from "./thread-branch-store-CbVu8h7H.js";
import { getAgentOperation as en, listAgentOperations as tn, runAgentOperation as nn, cancelAgentOperation as an, commitAgentOperation as sn, retryAgentOperation as rn, fetchAgentOperationCandidate as on } from "@retainpdf/api/document-operations";
import { fetchAgentRuntimeConfig as cn } from "@retainpdf/api/agent-runtime-settings";
import { l as dn } from "./ask-answerer-CG3B68VS.js";
import { listConversations as Pe, getConversation as ke, messagesToBranchItems as Ce, nextForkConversationTitle as ln, forkConversationFromPath as un, deleteConversation as pn, patchConversation as fn } from "@retainpdf/api/conversations";
const mn = [
  { prompt: "用几句话总结这篇文献的核心内容。", label: "总结本文", icon: Ve },
  { prompt: "这篇文献的主要结论是什么？", label: "提炼主要结论", icon: kt },
  { prompt: "作者用了什么方法或模型？", label: "梳理方法与模型", icon: Ct },
  { prompt: "有哪些关键结果或数据？", label: "标出关键结果", icon: Me }
];
function et(n) {
  return n.content.filter((e) => e.type === "text").map((e) => e.text).join(`
`).trim();
}
function Ue({ label: n }) {
  return /* @__PURE__ */ S("div", { className: "aui-thinking", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ a(Te, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
    /* @__PURE__ */ a("span", { children: n || "思考中…" })
  ] });
}
function hn({ disabled: n, mode: e }) {
  const i = e === "operations";
  return /* @__PURE__ */ S("div", { className: "aui-empty", children: [
    /* @__PURE__ */ a("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ a("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ a(Me, { size: 21, strokeWidth: 1.9 }) }) }),
    /* @__PURE__ */ a("h2", { className: "aui-empty-title", children: i ? "想怎样处理 PDF？" : "想了解这篇文档的什么？" }),
    /* @__PURE__ */ a("p", { className: "aui-empty-sub", children: i ? "创建候选版本后由你预览和确认" : "根据当前文档内容回答，引用可以直接跳页" }),
    /* @__PURE__ */ a("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: (i ? [
      { prompt: "把第 1 页旋转 90 度。", label: "旋转页面", icon: Se },
      { prompt: "删除最后一页。", label: "删除页面", icon: Se }
    ] : mn).map((r) => {
      const l = r.icon;
      return /* @__PURE__ */ S(
        ge.Suggestion,
        {
          prompt: r.prompt,
          send: !0,
          type: "button",
          className: "aui-suggestion",
          disabled: n,
          children: [
            /* @__PURE__ */ a(l, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
            /* @__PURE__ */ a("span", { className: "aui-suggestion-label", children: r.label })
          ]
        },
        r.prompt
      );
    }) })
  ] });
}
function gn({ message: n }) {
  return /* @__PURE__ */ a(Ze.Root, { className: "aui-msg aui-msg-user", "data-role": "user", children: /* @__PURE__ */ a("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ a("div", { className: "aui-md-plain", children: et(n) }) }) });
}
function yn({
  jobId: n,
  message: e,
  citations: i,
  progress: r,
  streaming: l,
  branchBusy: s,
  onJumpCitation: p,
  onBranchFromAnswer: u
}) {
  const y = et(e);
  return /* @__PURE__ */ a(Ze.Root, { className: "aui-msg aui-msg-assistant", "data-role": "assistant", children: /* @__PURE__ */ S("div", { className: "aui-msg-stack", children: [
    l && r ? /* @__PURE__ */ a(Ue, { label: r }) : null,
    l && !r && !y ? /* @__PURE__ */ a(Ue, { label: "思考中…" }) : null,
    y ? /* @__PURE__ */ a("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ a(
      jt,
      {
        content: y,
        streaming: l,
        citations: i,
        jobId: n,
        className: "aui-md",
        streamingClassName: "aui-md-streaming",
        pendingClassName: "aui-md-pending",
        finalClassName: "aui-md-final",
        onJumpCitation: p
      }
    ) }) : null,
    /* @__PURE__ */ S(
      Ee.Root,
      {
        className: "aui-msg-actions",
        "data-reader-ai-actions": "",
        hideWhenRunning: !0,
        autohide: "not-last",
        children: [
          /* @__PURE__ */ a(Ee.Copy, { className: "aui-action-btn", "aria-label": "复制答案", title: "复制答案", children: /* @__PURE__ */ a($t, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }) }),
          u ? /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "aui-action-btn aui-action-btn-branch",
              "aria-label": "从这里开新对话",
              title: "从这里开新对话",
              disabled: s,
              onClick: async () => {
                he(1200, { overlayDelayMs: 0 }), le(1200), await u(e.id);
              },
              children: /* @__PURE__ */ a(Rt, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 })
            }
          ) : null,
          /* @__PURE__ */ a(Ee.Reload, { className: "aui-action-btn", "aria-label": "重新生成", title: "重新生成", children: /* @__PURE__ */ a(Mt, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 }) })
        ]
      }
    )
  ] }) });
}
function vn({
  isRunning: n,
  branchBusy: e,
  mode: i,
  onModeChange: r
}) {
  return /* @__PURE__ */ S(Ne.Root, { className: "aui-composer", "data-reader-ai-composer": "", children: [
    /* @__PURE__ */ S("div", { className: "aui-composer-shell", children: [
      /* @__PURE__ */ a(
        Ne.Input,
        {
          className: "aui-input",
          rows: 1,
          placeholder: i === "reading" ? "询问当前文档…" : "描述要执行的 PDF 操作…",
          "aria-label": i === "reading" ? "向当前文档提问" : "描述 PDF 操作",
          autoFocus: !0,
          enterKeyHint: "send",
          disabled: e,
          submitMode: "enter"
        }
      ),
      /* @__PURE__ */ S("div", { className: "aui-composer-toolbar", children: [
        /* @__PURE__ */ S("div", { className: "aui-assistant-mode", role: "group", "aria-label": "AI 能力模式", children: [
          /* @__PURE__ */ S(
            "button",
            {
              type: "button",
              className: i === "reading" ? "is-active" : "",
              "aria-pressed": i === "reading",
              disabled: n || e,
              onClick: () => r == null ? void 0 : r("reading"),
              children: [
                /* @__PURE__ */ a(Ve, { size: 12, strokeWidth: 2.2, "aria-hidden": !0 }),
                "阅读"
              ]
            }
          ),
          /* @__PURE__ */ S(
            "button",
            {
              type: "button",
              className: i === "operations" ? "is-active" : "",
              "aria-pressed": i === "operations",
              disabled: n || e,
              onClick: () => r == null ? void 0 : r("operations"),
              children: [
                /* @__PURE__ */ a(Se, { size: 12, strokeWidth: 2.2, "aria-hidden": !0 }),
                "PDF 操作"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ a("div", { className: "aui-composer-actions", children: n ? /* @__PURE__ */ a(Ne.Cancel, { className: "aui-send aui-send-stop", "aria-label": "停止生成", children: /* @__PURE__ */ a(St, { size: 12, strokeWidth: 2.6, "aria-hidden": !0 }) }) : /* @__PURE__ */ a(Ne.Send, { className: "aui-send", "aria-label": "发送", children: /* @__PURE__ */ a(Tt, { size: 16, strokeWidth: 2.5, "aria-hidden": !0 }) }) })
      ] })
    ] }),
    /* @__PURE__ */ a("p", { className: "aui-hint", children: "AI 可能会出错，请核对原文与引用" })
  ] });
}
function bn() {
  return /* @__PURE__ */ S("div", { className: "aui-composer aui-composer-locked", role: "alert", children: [
    /* @__PURE__ */ a("p", { className: "aui-llm-lock-msg", children: Kt }),
    /* @__PURE__ */ a("p", { className: "aui-hint", children: "请到首页「设置 → API 设置」填写模型 Key 后即可提问" })
  ] });
}
function In({
  jobId: n,
  messages: e,
  citationsByMessageId: i,
  progressByMessageId: r,
  streamingAssistantId: l,
  isRunning: s,
  missingLlmKey: p,
  branchBusy: u,
  agentRequestBlocked: y = !1,
  agentOperationPanel: m,
  assistantMode: v = "reading",
  onAssistantModeChange: $,
  onJumpCitation: k,
  onBranchFromAnswer: w
}) {
  const h = e.length === 0;
  return /* @__PURE__ */ a(
    ge.Root,
    {
      className: `aui-thread aui-thread-root${p ? " is-llm-locked" : ""}`,
      "data-chat-ui": "assistant-ui-official-thread",
      children: /* @__PURE__ */ a(
        ge.Viewport,
        {
          className: "aui-viewport",
          "data-slot": "aui_thread-viewport",
          "data-reader-ai-viewport": "true",
          turnAnchor: "top",
          autoScroll: !0,
          children: /* @__PURE__ */ S("div", { className: `aui-thread-inner${h ? " is-empty" : ""}`, children: [
            h ? /* @__PURE__ */ a(hn, { mode: v, disabled: u || y || p }) : null,
            /* @__PURE__ */ a("div", { className: "aui-message-group", "data-slot": "aui_message-group", children: /* @__PURE__ */ a(ge.Messages, { children: ({ message: _ }) => {
              var b;
              if (_.role === "user") return /* @__PURE__ */ a(gn, { message: _ });
              if (_.role !== "assistant") return null;
              const L = ((b = _.status) == null ? void 0 : b.type) === "running" || s && l === _.id;
              return /* @__PURE__ */ a(
                yn,
                {
                  jobId: n,
                  message: _,
                  citations: i[_.id] || [],
                  progress: r[_.id] || "",
                  streaming: L,
                  branchBusy: u,
                  onJumpCitation: k,
                  onBranchFromAnswer: w
                }
              );
            } }) }),
            m,
            /* @__PURE__ */ S(ge.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
              !h && !u ? /* @__PURE__ */ a(
                ge.ScrollToBottom,
                {
                  className: "aui-scroll-bottom-btn aui-scroll-bottom",
                  "aria-label": "滚到最新",
                  children: /* @__PURE__ */ a(Nt, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
                }
              ) : null,
              p ? /* @__PURE__ */ a(bn, {}) : /* @__PURE__ */ a(
                vn,
                {
                  isRunning: s,
                  branchBusy: u || y,
                  mode: v,
                  onModeChange: $
                }
              )
            ] })
          ] })
        }
      )
    }
  );
}
const tt = "retainpdf.reader-agent-operation.dismissed.v1", _n = /* @__PURE__ */ new Set(["failed", "cancelled"]);
function Ke(n) {
  return [
    `${n.operation_id || ""}`.trim(),
    Number(n.current_attempt) || 0,
    `${n.status || ""}`
  ].join(":");
}
function wn() {
  var n;
  try {
    const e = JSON.parse(((n = globalThis.localStorage) == null ? void 0 : n.getItem(tt)) || "[]");
    return new Set(Array.isArray(e) ? e.filter((i) => typeof i == "string") : []);
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function Nn(n) {
  var e;
  try {
    (e = globalThis.localStorage) == null || e.setItem(
      tt,
      JSON.stringify(Array.from(n).slice(-100))
    );
  } catch {
  }
}
function nt(n, e) {
  switch (n) {
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
      return `${n}`;
  }
}
function kn(n) {
  switch (n) {
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
function Cn(n) {
  return n === "failed" || n === "ambiguous" ? Xe : n === "cancelled" ? Le : n === "committed" || n === "result_ready" ? Qe : ["queued", "running", "validating"].includes(n) ? Te : Ot;
}
function $n({ events: n, mode: e }) {
  return /* @__PURE__ */ a("ol", { className: "reader-agent-operation-timeline", "aria-label": "PDF 操作步骤", children: n.map((i) => {
    const r = Cn(i.status), l = ["queued", "running", "validating"].includes(i.status);
    return /* @__PURE__ */ S("li", { children: [
      /* @__PURE__ */ a(r, { className: l ? "is-spinning" : "", size: 12, "aria-hidden": !0 }),
      /* @__PURE__ */ a("span", { children: i.summary || i.event || nt(i.status, e) }),
      /* @__PURE__ */ a("time", { children: i.ts ? new Date(i.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "" })
    ] }, `${i.attempt}:${i.seq}`);
  }) });
}
function Rn({
  operation: n,
  loadCandidate: e
}) {
  const [i, r] = U(!1), [l, s] = U(""), [p, u] = U(""), y = H("");
  return Q(() => {
    let m = !1;
    return u(""), e(n).then((v) => {
      if (m) return;
      const $ = URL.createObjectURL(v);
      y.current && URL.revokeObjectURL(y.current), y.current = $, s($);
    }).catch(() => {
      m || u("候选 PDF 加载失败，请重试。");
    }), () => {
      m = !0;
    };
  }, [e, n.operation_id, n.current_attempt]), Q(() => () => {
    y.current && URL.revokeObjectURL(y.current);
  }, []), /* @__PURE__ */ S(Ye, { children: [
    /* @__PURE__ */ S("div", { className: "reader-agent-operation-candidate", children: [
      /* @__PURE__ */ S("div", { children: [
        /* @__PURE__ */ a(Se, { size: 13, "aria-hidden": !0 }),
        /* @__PURE__ */ a("span", { children: "候选 PDF" })
      ] }),
      /* @__PURE__ */ a("button", { type: "button", disabled: !l, onClick: () => r((m) => !m), children: l ? i ? "收起" : "预览" : "加载中…" }),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: !l,
          "aria-label": "新窗口打开候选 PDF",
          onClick: () => window.open(l, "_blank", "noopener,noreferrer"),
          children: /* @__PURE__ */ a(Dt, { size: 12, "aria-hidden": !0 })
        }
      )
    ] }),
    i ? /* @__PURE__ */ a("iframe", { className: "reader-agent-operation-preview", src: l, title: "候选 PDF 预览" }) : null,
    p ? /* @__PURE__ */ a("p", { className: "reader-agent-operation-error", role: "alert", children: p }) : null
  ] });
}
function Mn({
  entry: n,
  mode: e,
  loadCandidate: i,
  onAction: r,
  onDismiss: l
}) {
  var L;
  const { operation: s, pendingAction: p, error: u } = n, [y, m] = U(!1), [v, $] = U(!1), k = s.events || [], w = kn(s.status), h = !!((s.status === "result_ready" || s.status === "committed") && s.candidate_available), _ = _n.has(s.status);
  return /* @__PURE__ */ S("article", { className: `reader-agent-operation-card is-${s.status}`, "data-operation-id": s.operation_id, children: [
    /* @__PURE__ */ S("header", { children: [
      /* @__PURE__ */ a("span", { className: "reader-agent-operation-icon", "aria-hidden": !0, children: /* @__PURE__ */ a(xt, { size: 15 }) }),
      /* @__PURE__ */ S("div", { className: "reader-agent-operation-title", children: [
        /* @__PURE__ */ a("span", { children: "PDF 操作" }),
        /* @__PURE__ */ a("strong", { children: s.intent_summary || "处理当前 PDF" })
      ] }),
      /* @__PURE__ */ S("div", { className: "reader-agent-operation-head-actions", children: [
        /* @__PURE__ */ a("span", { className: "reader-agent-operation-status", children: nt(s.status, e) }),
        _ ? /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "reader-agent-operation-dismiss",
            "aria-label": s.status === "failed" ? "隐藏这条失败提示" : "隐藏这条已取消提示",
            title: "隐藏",
            onClick: () => l(s),
            children: /* @__PURE__ */ a(Le, { size: 13, "aria-hidden": !0 })
          }
        ) : null
      ] })
    ] }),
    (L = s.affected_pages) != null && L.length ? /* @__PURE__ */ S("p", { className: "reader-agent-operation-scope", children: [
      "影响页码：",
      s.affected_pages.join("、")
    ] }) : null,
    k.length ? /* @__PURE__ */ S("div", { className: "reader-agent-operation-details", children: [
      /* @__PURE__ */ S("button", { type: "button", onClick: () => m((b) => !b), children: [
        y ? /* @__PURE__ */ a(Pt, { size: 12, "aria-hidden": !0 }) : /* @__PURE__ */ a(Je, { size: 12, "aria-hidden": !0 }),
        y ? "收起步骤" : `执行步骤 ${k.length}`
      ] }),
      y ? /* @__PURE__ */ a($n, { events: k, mode: e }) : null
    ] }) : null,
    h ? /* @__PURE__ */ a(Rn, { operation: s, loadCandidate: i }) : null,
    u ? /* @__PURE__ */ a("p", { className: "reader-agent-operation-error", role: "alert", children: u }) : null,
    v ? /* @__PURE__ */ S("div", { className: "reader-agent-operation-risk", role: "alertdialog", "aria-label": "确认重复执行风险", children: [
      /* @__PURE__ */ a(Xe, { size: 14, "aria-hidden": !0 }),
      /* @__PURE__ */ a("p", { children: "上一次执行结果不确定，重试可能重复操作。确认接受风险后再继续。" }),
      /* @__PURE__ */ S("div", { children: [
        /* @__PURE__ */ a("button", { type: "button", onClick: () => $(!1), disabled: !!p, children: "返回" }),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "is-danger",
            disabled: !!p,
            onClick: async () => {
              await r("retry", s, { acceptDuplicateRisk: !0 }), $(!1);
            },
            children: p === "retry" ? "处理中…" : "接受风险并重试"
          }
        )
      ] })
    ] }) : w.length ? /* @__PURE__ */ a("div", { className: "reader-agent-operation-actions", children: w.map((b) => /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: b.primary ? "is-primary" : b.danger ? "is-danger" : "",
        disabled: !!p,
        onClick: () => {
          b.risk ? $(!0) : r(b.action, s);
        },
        children: p === b.action ? "处理中…" : b.label
      },
      b.action
    )) }) : null
  ] });
}
function Sn({
  entries: n,
  confirmationMode: e,
  runtimeRestarting: i,
  loadCandidate: r,
  onAction: l
}) {
  const [s, p] = U(wn), u = n.filter((m) => !s.has(Ke(m.operation)));
  function y(m) {
    const v = Ke(m);
    p(($) => {
      const k = new Set($);
      return k.add(v), Nn(k), k;
    });
  }
  return /* @__PURE__ */ S("section", { className: `reader-agent-operations${u.length ? " has-operations" : ""}`, "aria-label": "AI PDF 操作", children: [
    /* @__PURE__ */ S("div", { className: `reader-agent-mode${e === "green_light" ? " is-green" : ""}`, children: [
      /* @__PURE__ */ a(Et, { size: 13, "aria-hidden": !0 }),
      /* @__PURE__ */ a("span", { children: e === "green_light" ? "绿灯模式 · 自动执行并应用" : "需要确认 · 操作前等待授权" })
    ] }),
    i ? /* @__PURE__ */ S("div", { className: "reader-agent-restarting", role: "status", children: [
      /* @__PURE__ */ a(Te, { className: "is-spinning", size: 13, "aria-hidden": !0 }),
      "正在重启 Agent，新请求暂不可用"
    ] }) : null,
    u.map((m) => /* @__PURE__ */ a(
      Mn,
      {
        entry: m,
        mode: e,
        loadCandidate: r,
        onAction: l,
        onDismiss: y
      },
      m.operation.operation_id
    ))
  ] });
}
const Tn = (n) => n, En = Object.freeze([]), xn = Object.freeze({}), Ge = Object.freeze({}), Pn = Object.freeze({
  entries: [],
  confirmationMode: "explicit",
  runtimeRestarting: !1,
  runtimeCredentialConfigured: !1,
  perform: async () => {
  },
  loadCandidate: async () => new Blob()
});
function Dn(n) {
  return n.content.filter((e) => e.type === "text").map((e) => e.text).join(`
`).trim();
}
function On(n, e, i) {
  var r, l, s, p;
  return ((r = n.status) == null ? void 0 : r.type) === "running" || i && e === n.id ? { type: "running" } : ((l = n.status) == null ? void 0 : l.type) === "incomplete" || ((s = n.status) == null ? void 0 : s.type) === "error" ? {
    type: "incomplete",
    reason: ((p = n.status) == null ? void 0 : p.reason) === "cancelled" ? "cancelled" : "error"
  } : { type: "complete", reason: "stop" };
}
function Fn({
  jobId: n = "",
  messages: e = En,
  citationsByMessageId: i = xn,
  progressByMessageId: r = Ge,
  contentByMessageId: l = Ge,
  streamingAssistantId: s = "",
  isRunning: p = !1,
  onSubmit: u,
  onRetry: y,
  onCancel: m,
  onJumpCitation: v,
  onBranchFromAnswer: $,
  branchBusy: k = !1,
  agentOperations: w = Pn,
  assistantMode: h = "reading",
  onAssistantModeChange: _
}) {
  const [, L] = U(0);
  Q(() => {
    const o = () => L((g) => g + 1);
    return window.addEventListener("focus", o), window.addEventListener("storage", o), document.addEventListener(We, o), () => {
      window.removeEventListener("focus", o), window.removeEventListener("storage", o), document.removeEventListener(We, o);
    };
  }, []);
  const b = !Gt() && !w.runtimeCredentialConfigured, B = ce(() => e.map((o) => ({
    id: o.id,
    role: o.role,
    content: l[o.id] || o.content || "",
    ...o.role === "assistant" ? { status: On(o, s, p) } : {}
  })), [l, p, e, s]), F = V(async (o) => {
    const g = o ? Math.max(0, e.findIndex((f) => f.id === o) + 1) : 0, M = e.slice(g).find((f) => f.role === "assistant");
    M && await y(M.id);
  }, [e, y]), D = V(async (o) => {
    const g = Dn(o);
    !g || p || k || w.runtimeRestarting || b || await u(g);
  }, [w.runtimeRestarting, k, p, b, u]), te = V(async () => {
    await m();
  }, [m]), X = ce(() => ({
    messages: B,
    isRunning: p,
    isDisabled: k || w.runtimeRestarting || b,
    convertMessage: Tn,
    onNew: D,
    onReload: F,
    onCancel: te
  }), [
    w.runtimeRestarting,
    k,
    te,
    D,
    p,
    b,
    F,
    B
  ]), ne = Bt(X);
  return /* @__PURE__ */ a(qt, { runtime: ne, children: /* @__PURE__ */ a(
    In,
    {
      jobId: n,
      messages: e,
      citationsByMessageId: i,
      progressByMessageId: r,
      streamingAssistantId: s,
      isRunning: p,
      missingLlmKey: b,
      branchBusy: k,
      agentRequestBlocked: w.runtimeRestarting,
      assistantMode: h,
      onAssistantModeChange: _,
      agentOperationPanel: h === "operations" || w.entries.length > 0 || w.runtimeRestarting ? /* @__PURE__ */ a(
        Sn,
        {
          entries: w.entries,
          confirmationMode: w.confirmationMode,
          runtimeRestarting: w.runtimeRestarting,
          loadCandidate: w.loadCandidate,
          onAction: w.perform
        }
      ) : null,
      onJumpCitation: v,
      onBranchFromAnswer: $
    }
  ) });
}
function $e(n = 900, e = 0) {
  he(n, { overlayDelayMs: e }), le(n);
}
function Ln({
  sessions: n,
  activeId: e,
  busy: i = !1,
  disabled: r = !1,
  errorText: l = "",
  onSwitch: s,
  onNew: p,
  onDelete: u,
  onRename: y
}) {
  const m = n.length > 0, v = i || r, [$, k] = U(!1), [w, h] = U(""), [_, L] = U(""), b = H(null), B = wt();
  function F(t) {
    const x = `${t || ""}`.match(/^fork-(\d+)-(.*)$/i);
    if (!x) return t;
    const q = x[2].trim();
    return q ? `${q} · 分支${x[1]}` : `分支${x[1]}`;
  }
  const D = H(!1), te = H(null), X = n.find((t) => t.id === e) || null, ne = X ? X.messageCount ? F(X.title) : `${F(X.title)}（空）` : m ? "选择以往对话" : "新对话";
  Q(() => {
    if (!$) {
      h("");
      return;
    }
    const t = (W) => {
      if (D.current) return;
      const R = b.current;
      R && (W.target instanceof Node && R.contains(W.target) || (k(!1), h("")));
    }, x = (W) => {
      W.key === "Escape" && (k(!1), h(""));
    }, q = window.setTimeout(() => {
      document.addEventListener("pointerdown", t, !0);
    }, 0);
    return document.addEventListener("keydown", x), () => {
      window.clearTimeout(q), document.removeEventListener("pointerdown", t, !0), document.removeEventListener("keydown", x);
    };
  }, [$]), Q(() => {
    if (!w) return;
    const t = te.current;
    t && (t.focus(), t.select());
  }, [w]);
  const o = (t) => {
    const x = `${t || ""}`.trim();
    !x || v || D.current || w || (D.current = !0, $e(1e3, 0), requestAnimationFrame(() => {
      k(!1), window.setTimeout(() => {
        (async () => {
          try {
            await s(x);
          } finally {
            $e(400, 0), D.current = !1;
          }
        })();
      }, 40);
    }));
  }, g = (t) => {
    v || (h(t.id), L(t.title || ""));
  }, M = () => {
    const t = w, x = _;
    h(""), t && y(t, x);
  }, f = () => {
    h(""), L("");
  }, j = (t) => {
    var W;
    if (v || D.current) return;
    const x = t.title || "未命名对话";
    (W = globalThis.confirm) != null && W.call(globalThis, `确定删除对话「${x}」？此操作不可恢复。`) && (D.current = !0, $e(800, 0), (async () => {
      try {
        await u(t.id);
      } finally {
        D.current = !1;
      }
    })());
  };
  return /* @__PURE__ */ S(
    "div",
    {
      className: "aui-session-bar",
      "data-reader-ai-sessions": "",
      ref: b,
      onPointerDown: (t) => {
        t.stopPropagation();
      },
      onClick: (t) => {
        t.stopPropagation();
      },
      children: [
        /* @__PURE__ */ S("div", { className: "aui-session-row", children: [
          /* @__PURE__ */ S(
            "button",
            {
              type: "button",
              className: `aui-session-trigger${$ ? " is-open" : ""}`,
              "aria-label": "切换对话窗口",
              "aria-haspopup": "listbox",
              "aria-expanded": $,
              "aria-controls": B,
              disabled: v || !m,
              title: ne,
              onClick: () => {
                v || !m || k((t) => !t);
              },
              children: [
                /* @__PURE__ */ a("span", { className: "aui-session-trigger-label", children: ne }),
                /* @__PURE__ */ a(Je, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 })
              ]
            }
          ),
          /* @__PURE__ */ S(
            "button",
            {
              type: "button",
              className: "aui-session-btn",
              disabled: v,
              title: "新对话窗口",
              "aria-label": "新对话",
              onClick: () => {
                v || D.current || (D.current = !0, $e(800), k(!1), h(""), window.setTimeout(() => {
                  (async () => {
                    try {
                      await p();
                    } finally {
                      D.current = !1;
                    }
                  })();
                }, 40));
              },
              children: [
                i ? /* @__PURE__ */ a(Te, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ a(Ft, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
                /* @__PURE__ */ a("span", { children: "新对话" })
              ]
            }
          )
        ] }),
        $ && m ? /* @__PURE__ */ a(
          "ul",
          {
            id: B,
            className: "aui-session-list",
            role: "listbox",
            "aria-label": "以往对话",
            children: n.map((t) => {
              const x = t.messageCount ? F(t.title) : `${F(t.title)}（空）`, q = t.id === e, W = w === t.id;
              return /* @__PURE__ */ a("li", { className: "aui-session-row-item", role: "presentation", children: W ? /* @__PURE__ */ S("div", { className: "aui-session-edit", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    ref: te,
                    className: "aui-session-edit-input",
                    value: _,
                    maxLength: 80,
                    "aria-label": "对话标题",
                    disabled: v,
                    onChange: (R) => L(R.target.value),
                    onKeyDown: (R) => {
                      R.key === "Enter" ? (R.preventDefault(), M()) : R.key === "Escape" && (R.preventDefault(), f());
                    },
                    onClick: (R) => R.stopPropagation()
                  }
                ),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": "保存标题",
                    title: "保存",
                    disabled: v || !_.trim(),
                    onClick: (R) => {
                      R.stopPropagation(), M();
                    },
                    children: /* @__PURE__ */ a(Qe, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                ),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": "取消重命名",
                    title: "取消",
                    disabled: v,
                    onClick: (R) => {
                      R.stopPropagation(), f();
                    },
                    children: /* @__PURE__ */ a(Le, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }) : /* @__PURE__ */ S(Ye, { children: [
                /* @__PURE__ */ S(
                  "button",
                  {
                    type: "button",
                    role: "option",
                    "aria-selected": q,
                    className: `aui-session-item${q ? " is-active" : ""}`,
                    disabled: v,
                    title: x,
                    onPointerDown: (R) => {
                      R.stopPropagation(), !q && !v && le(1e3);
                    },
                    onClick: (R) => {
                      if (R.preventDefault(), R.stopPropagation(), q) {
                        k(!1);
                        return;
                      }
                      o(t.id);
                    },
                    children: [
                      /* @__PURE__ */ a("span", { className: "aui-session-item-title", children: x }),
                      q ? /* @__PURE__ */ a("span", { className: "aui-session-item-badge", children: "当前" }) : null
                    ]
                  }
                ),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": `重命名 ${x}`,
                    title: "重命名",
                    disabled: v,
                    onClick: (R) => {
                      R.preventDefault(), R.stopPropagation(), g(t);
                    },
                    children: /* @__PURE__ */ a(Lt, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
                  }
                ),
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn is-danger",
                    "aria-label": `删除 ${x}`,
                    title: "删除",
                    disabled: v,
                    onClick: (R) => {
                      R.preventDefault(), R.stopPropagation(), j(t);
                    },
                    children: /* @__PURE__ */ a(zt, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
                  }
                )
              ] }) }, t.id);
            })
          }
        ) : null,
        l ? /* @__PURE__ */ a("div", { className: "aui-session-error", role: "alert", children: l }) : null
      ]
    }
  );
}
function De(n, e) {
  return {
    version: 1,
    headId: e,
    items: n.map((i) => {
      var r;
      return {
        parentId: i.parentId,
        message: {
          id: i.message.id,
          role: i.message.role,
          content: i.message.content,
          ...i.message.progress ? { progress: i.message.progress } : {},
          ...(r = i.message.citations) != null && r.length ? { citations: i.message.citations } : {},
          ...i.message.status ? {
            status: {
              type: i.message.status.type,
              ...i.message.status.reason ? { reason: `${i.message.status.reason}` } : {}
            }
          } : {}
        }
      };
    })
  };
}
function zn(n) {
  return {
    items: n.items.map((e) => ({
      parentId: e.parentId,
      message: {
        ...e.message,
        citations: e.message.citations || [],
        status: e.message.status
      }
    })),
    headId: n.headId
  };
}
function me(n, e) {
  if (!n.length) return [];
  const i = new Map(n.map((u) => [u.message.id, u])), r = e && i.get(e) || n.at(-1);
  if (!r) return [];
  const l = [];
  let s = r;
  const p = /* @__PURE__ */ new Set();
  for (; s && !p.has(s.message.id); )
    p.add(s.message.id), l.push(s.message), s = s.parentId ? i.get(s.parentId) : void 0;
  return l.reverse();
}
function An(n, e) {
  var i;
  return e ? ((i = n.find((r) => r.message.id === e)) == null ? void 0 : i.message) ?? null : null;
}
function Bn(n, e) {
  const i = new Map(n.map((p) => [p.message.id, p]));
  let r = i.get(e);
  if (!r) return [];
  const l = [], s = /* @__PURE__ */ new Set();
  for (; r && !s.has(r.message.id); )
    s.add(r.message.id), l.push(r), r = r.parentId ? i.get(r.parentId) : void 0;
  return l.reverse();
}
function qn(n, e, i) {
  var v, $, k, w;
  const r = `${e || ""}`.trim();
  if (!r || !n.length) return [];
  let l = r;
  n.some((h) => h.message.id === l) || (i && n.some((h) => h.message.id === i) ? l = i : l = ((v = [...n].reverse().find((h) => h.message.role === "assistant")) == null ? void 0 : v.message.id) || "");
  let s = Bn(n, l);
  if (s.length >= 2 && (($ = s.at(-1)) == null ? void 0 : $.message.role) === "assistant") return s;
  s.length === 1 && ((k = s[0]) == null ? void 0 : k.message.role) === "user" && (s = []);
  const p = me(n, i || l);
  let u = p.findIndex((h) => h.id === l);
  if (u < 0 && (u = p.length - 1), u < 0) return s;
  const y = new Map(n.map((h) => [h.message.id, h])), m = p.slice(0, u + 1).map((h) => y.get(h.id)).filter((h) => !!h);
  for (; m.length && ((w = m.at(-1)) == null ? void 0 : w.message.role) !== "assistant"; ) m.pop();
  return m.length ? m : s;
}
function Oe(n) {
  return n.map((e) => ({
    parentId: e.parentId,
    message: {
      ...e.message,
      citations: e.message.citations || [],
      status: e.message.status
    }
  }));
}
const jn = {
  search_markdown: "检索 Markdown",
  read_markdown_chunk: "阅读 Markdown 片段",
  list_documents: "确认文档信息",
  read_blocks: "阅读相关段落",
  search_favorites: "查找收藏",
  search_fulltext: "检索文档内容"
};
function Wn(n) {
  const e = typeof n == "string" ? n : n.tool || n.event || n.type || "";
  return jn[e] || (e ? `执行 ${e}` : "处理中");
}
function at(n) {
  return ((n == null ? void 0 : n.parts) || []).filter((e) => e.type === "text").map((e) => e.text).join("").trim();
}
function Un(n, e) {
  const i = `${e.question || ""}`.trim();
  if (i) return i;
  for (let r = n.length - 1; r >= 0; r -= 1) {
    const l = n[r];
    if (l.role !== "user") continue;
    const s = at(l);
    if (s) return s;
  }
  return "";
}
function Kn(n) {
  const e = Number(n == null ? void 0 : n.status) || 0, i = `${(n == null ? void 0 : n.message) || ""}`;
  return e === 502 || /\b502\b/.test(i);
}
class Gn {
  constructor(e) {
    this.options = e;
  }
  async sendMessages({
    abortSignal: e,
    body: i,
    messages: r,
    trigger: l
  }) {
    var $, k;
    const s = i || {}, p = Un(r, s);
    if (!p) throw new Error("请输入问题。");
    const u = `${s.assistantMessageId || ""}`.trim() || `a-${Date.now().toString(36)}`, y = `${u}-text`, m = this.options.getRemoteAnswerer(), v = ((k = ($ = this.options).getLocalAnswerer) == null ? void 0 : k.call($)) || null;
    if (!m && !v)
      throw new Error("问答暂不可用：请确认已打开任务阅读器。");
    return new ReadableStream({
      start: (w) => {
        let h = !1, _ = "", L = {
          citations: [],
          progress: l === "regenerate-message" ? "正在重新生成…" : "正在检索文档…",
          status: "running"
        };
        const b = (F) => {
          h || w.enqueue(F);
        }, B = (F) => {
          L = { ...L, ...F }, b({ type: "message-metadata", messageMetadata: L });
        };
        b({ type: "start", messageId: u, messageMetadata: L }), b({ type: "start-step" }), b({ type: "text-start", id: y }), (async () => {
          var F, D, te, X, ne, o, g, M;
          try {
            await ((F = m == null ? void 0 : m.ensureLoaded) == null ? void 0 : F.call(m, this.options.jobId));
            let f = m || v, j = !1, t;
            const x = ((te = (D = this.options).getAssistantMode) == null ? void 0 : te.call(D)) || "reading";
            try {
              t = await f.answer({
                question: p,
                assistantMode: x,
                scope: "document",
                parentId: `${s.parentId || ""}`.trim(),
                regenerate: s.regenerate ?? l === "regenerate-message",
                userMessageId: `${s.userMessageId || ""}`.trim(),
                assistantMessageId: u,
                onAgentSessionEvent: (N) => {
                  var Z, ae, be;
                  const T = (Z = N == null ? void 0 : N.capabilities) == null ? void 0 : Z.document_operation_confirmation_mode;
                  (T === "explicit" || T === "green_light") && ((be = (ae = this.options).onConfirmationMode) == null || be.call(ae, T));
                },
                onAgentOperationEvent: (N) => {
                  var Z, ae;
                  const T = `${(N == null ? void 0 : N.operation_id) || ""}`.trim();
                  T && ((ae = (Z = this.options).onAgentOperationSignal) == null || ae.call(Z, {
                    operationId: T,
                    conversationId: `${(N == null ? void 0 : N.conversation_id) || ""}`.trim() || void 0
                  }));
                },
                onAgentConfirmationRequiredEvent: (N) => {
                  var Z, ae;
                  const T = `${(N == null ? void 0 : N.operation_id) || ""}`.trim();
                  T && ((ae = (Z = this.options).onAgentOperationSignal) == null || ae.call(Z, { operationId: T }));
                },
                onToolEvent: (N) => {
                  if (_ || e != null && e.aborted) return;
                  const T = Wn(N);
                  T && B({ progress: T });
                },
                onAnswerDelta: (N, T) => {
                  !T || e != null && e.aborted || (_ += T, L.progress && B({ progress: "" }), b({ type: "text-delta", id: y, delta: T }));
                },
                onCompress: (N) => {
                  if (_ || e != null && e.aborted) return;
                  const T = Number(N == null ? void 0 : N.dropped_turns) || 0;
                  T && B({ progress: `已压缩 ${T} 轮早期对话` });
                },
                signal: e
              });
            } catch (N) {
              if (e != null && e.aborted || x !== "reading" || !m || !v || !Kn(N)) throw N;
              j = !0, B({ progress: "在线服务暂不可用，改用本地检索…" }), await ((X = v.ensureLoaded) == null ? void 0 : X.call(v, this.options.jobId)), f = v, t = await f.answer({ question: p, scope: "document", signal: e });
            }
            if (e != null && e.aborted) {
              B({ progress: "", status: "cancelled" }), b({ type: "abort", reason: "cancelled" });
              return;
            }
            const q = t == null ? void 0 : t.confirmationMode;
            (q === "explicit" || q === "green_light") && ((o = (ne = this.options).onConfirmationMode) == null || o.call(ne, q));
            const W = `${(t == null ? void 0 : t.conversationId) || ""}`.trim() || void 0, R = /* @__PURE__ */ new Set();
            for (const N of (t == null ? void 0 : t.operationRefs) || []) {
              const T = typeof N == "string" ? N : `${(N == null ? void 0 : N.operation_id) || ""}`;
              T.trim() && R.add(T.trim());
            }
            for (const N of (t == null ? void 0 : t.confirmationRequests) || []) {
              const T = `${(N == null ? void 0 : N.operation_id) || ""}`.trim();
              T && R.add(T);
            }
            for (const N of R)
              (M = (g = this.options).onAgentOperationSignal) == null || M.call(g, {
                operationId: N,
                conversationId: W,
                confirmationMode: q || void 0
              });
            const Y = Wt(t == null ? void 0 : t.citations);
            let z = Xt(
              `${(t == null ? void 0 : t.answer) || _ || ""}`.trim() || "没有找到可用回答。",
              Y
            );
            if (j && (z += `

_在线服务暂不可用，以上来自本地文档检索。_`), (t == null ? void 0 : t.persisted) === !1 && (z += `

_⚠️ 本轮回答未能写入历史记录（存储暂时不可用），刷新后可能丢失。_`), !_)
              b({ type: "text-delta", id: y, delta: z });
            else if (z.startsWith(_)) {
              const N = z.slice(_.length);
              N && b({ type: "text-delta", id: y, delta: N });
            }
            b({ type: "text-end", id: y }), B({
              citations: Y,
              persisted: (t == null ? void 0 : t.persisted) !== !1,
              progress: "",
              status: "complete"
            }), b({ type: "finish-step" }), b({ type: "finish", finishReason: "stop", messageMetadata: L });
          } catch (f) {
            e != null && e.aborted ? (B({ progress: "", status: "cancelled" }), b({ type: "abort", reason: "cancelled" })) : (B({ progress: "", status: "error" }), b({
              type: "error",
              errorText: f instanceof Error ? f.message : "生成回答失败，请重试。"
            }));
          } finally {
            h || (h = !0, w.close());
          }
        })();
      }
    });
  }
  async reconnectToStream() {
    return null;
  }
}
function Hn(n) {
  return at(n);
}
function Re(n) {
  return n.map((e) => {
    var i, r;
    return {
      id: e.id,
      role: e.role,
      metadata: e.role === "assistant" ? {
        citations: e.citations || [],
        progress: e.progress || "",
        status: ((i = e.status) == null ? void 0 : i.type) === "running" ? "running" : ((r = e.status) == null ? void 0 : r.type) === "incomplete" ? e.status.reason === "cancelled" ? "cancelled" : "error" : "complete"
      } : void 0,
      parts: [{ type: "text", text: e.content || "" }]
    };
  });
}
function Yn(n) {
  const e = n.metadata || {}, i = e.status === "running", r = e.status === "cancelled" || e.status === "error";
  return {
    id: n.id,
    role: n.role,
    content: Hn(n),
    ...n.role === "assistant" ? {
      citations: e.citations || [],
      progress: e.progress || "",
      status: i ? { type: "running" } : r ? {
        type: "incomplete",
        reason: e.status === "cancelled" ? "cancelled" : "error"
      } : { type: "complete", reason: "stop" }
    } : {}
  };
}
function Vn(n) {
  const e = H(n.remoteAnswerer), i = H(n.localAnswerer), r = H(n.onAgentOperationSignal), l = H(n.onConfirmationMode), s = H(n.assistantMode);
  e.current = n.remoteAnswerer, i.current = n.localAnswerer, r.current = n.onAgentOperationSignal, l.current = n.onConfirmationMode, s.current = n.assistantMode;
  const p = ce(() => new Vt({
    id: `reader-${n.jobId || "idle"}`,
    transport: new Gn({
      jobId: n.jobId,
      getRemoteAnswerer: () => e.current,
      getLocalAnswerer: () => i.current,
      getAssistantMode: () => s.current,
      onAgentOperationSignal: (u) => {
        var y;
        return (y = r.current) == null ? void 0 : y.call(r, u);
      },
      onConfirmationMode: (u) => {
        var y;
        return (y = l.current) == null ? void 0 : y.call(l, u);
      }
    })
  }), [n.jobId]);
  return Jt({ chat: p, experimental_throttle: 16 });
}
function Jn(n) {
  for (let e = n.length - 1; e >= 0; e -= 1)
    if (n[e].role === "assistant") return n[e];
}
const Xn = "retainpdf.reader-agent-operation.action-key.v1:", Qn = /* @__PURE__ */ new Set(["queued", "running", "validating"]), Zn = /* @__PURE__ */ new Set(["draft", "awaiting_confirmation", "result_ready"]);
function He(n, e) {
  return Qn.has(n) || e === "green_light" && Zn.has(n);
}
function ve(n) {
  return Number(n.latest_event_seq) || Math.max(0, ...(n.events || []).map((e) => Number(e.seq) || 0));
}
function ea(n, e) {
  return n ? e.current_attempt !== n.current_attempt ? e.current_attempt > n.current_attempt : ve(e) !== ve(n) ? ve(e) > ve(n) : `${e.updated_at || ""}` >= `${n.updated_at || ""}` : !0;
}
function ta(n, e) {
  var r, l;
  const i = ((l = (r = globalThis.crypto) == null ? void 0 : r.randomUUID) == null ? void 0 : l.call(r)) || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `reader-${e}-${n}-${i}`.slice(0, 128);
}
function na(n) {
  return Number(n == null ? void 0 : n.status) || 0;
}
function aa(n) {
  return n instanceof Error && n.message.trim() ? n.message.trim() : "操作请求失败，请重试。";
}
function ia({
  conversationId: n,
  enabled: e,
  discovering: i,
  signal: r,
  confirmationModeHint: l,
  onDocumentCommitted: s
}) {
  const [p, u] = U({}), [y, m] = U("explicit"), [v, $] = U(!1), [k, w] = U(!1), h = H(/* @__PURE__ */ new Set()), _ = H(/* @__PURE__ */ new Map()), L = H(/* @__PURE__ */ new Set()), b = V((o) => {
    o != null && o.operation_id && u((g) => {
      const M = g[o.operation_id];
      return ea(M == null ? void 0 : M.operation, o) ? {
        ...g,
        [o.operation_id]: {
          ...M,
          operation: o,
          pendingAction: void 0,
          error: void 0
        }
      } : g;
    });
  }, []), B = V(async (o) => {
    const g = `${o || ""}`.trim(), M = `refresh:${g}`;
    if (!(!g || h.current.has(M))) {
      h.current.add(M);
      try {
        b(await en(g));
      } catch {
      } finally {
        h.current.delete(M);
      }
    }
  }, [b]), F = V(async () => {
    const o = `${n || ""}`.trim(), g = `recover:${o}`;
    if (!(!e || !o || h.current.has(g))) {
      h.current.add(g);
      try {
        const M = await tn({ conversationId: o, limit: 50 });
        for (const f of M.operations || []) b(f);
      } catch {
      } finally {
        h.current.delete(g);
      }
    }
  }, [n, e, b]);
  Q(() => {
    if (!e) return;
    let o = !1;
    const g = async () => {
      try {
        const f = await cn();
        if (o) return;
        m(f.agent_confirmation_mode || "explicit"), w(!!f.llm_api_key_configured), $(
          f.restart_required || f.restart_state === "pending" || f.active_revision !== f.configured_revision
        );
      } catch {
        o || ($(!1), w(!1));
      }
    };
    g();
    const M = window.setInterval(g, 3e3);
    return () => {
      o = !0, window.clearInterval(M);
    };
  }, [e]), Q(() => {
    l && m(l);
  }, [l]), Q(() => {
    r != null && r.confirmationMode && m(r.confirmationMode), r != null && r.operationId && B(r.operationId);
  }, [B, r]), Q(() => {
    F();
  }, [F]), Q(() => {
    i || F();
  }, [i, F]);
  const D = ce(
    () => Object.values(p).filter((o) => !!n && o.operation.conversation_id === n).sort((o, g) => `${o.operation.created_at || ""}`.localeCompare(`${g.operation.created_at || ""}`)),
    [n, p]
  );
  Q(() => {
    var o;
    for (const g of D) {
      const M = g.operation;
      M.status !== "committed" || L.current.has(M.operation_id) || (L.current.add(M.operation_id), s == null || s({
        documentId: M.document_id,
        revision: ((o = M.candidate) == null ? void 0 : o.version_id) || `${M.updated_at || ""}` || `${M.operation_id}:${ve(M)}`
      }));
    }
  }, [D, s]);
  const te = D.some((o) => He(o.operation.status, y));
  Q(() => {
    if (!e || !n || !i && !te) return;
    const o = window.setInterval(() => {
      F();
      for (const g of D)
        He(g.operation.status, y) && B(g.operation.operation_id);
    }, 1400);
    return () => window.clearInterval(o);
  }, [y, n, i, e, D, te, F, B]), Q(() => {
    if (!e) return;
    const o = () => void F(), g = () => {
      document.visibilityState === "visible" && o();
    };
    return window.addEventListener("online", o), document.addEventListener("visibilitychange", g), () => {
      window.removeEventListener("online", o), document.removeEventListener("visibilitychange", g);
    };
  }, [e, F]);
  const X = V(async (o, g, M = {}) => {
    const f = `${g.operation_id || ""}`.trim(), j = `action:${f}`;
    if (!f || h.current.has(j)) return;
    if (o === "retry" && g.status === "ambiguous" && M.acceptDuplicateRisk !== !0) {
      u((Y) => ({
        ...Y,
        [f]: {
          ...Y[f],
          error: "请先确认重复执行风险，再重新执行操作。"
        }
      }));
      return;
    }
    const t = `${f}:${o}`, x = `${Xn}${t}`;
    let q = "";
    try {
      q = `${sessionStorage.getItem(x) || ""}`.trim();
    } catch {
    }
    const W = _.current.get(t) || q || ta(f, o);
    _.current.set(t, W);
    try {
      sessionStorage.setItem(x, W);
    } catch {
    }
    h.current.add(j), u((Y) => ({
      ...Y,
      [f]: { ...Y[f], pendingAction: o, error: void 0 }
    }));
    const R = {
      idempotency_key: W,
      expected_status: g.status,
      expected_attempt: g.current_attempt,
      expected_program_sha256: g.program_sha256 || ""
    };
    try {
      let Y;
      o === "run" ? Y = await nn(f, R) : o === "cancel" ? Y = await an(f, { ...R, reason: "user_rejected" }) : o === "commit" ? Y = await sn(f, R) : Y = await rn(f, M.acceptDuplicateRisk ? { ...R, accept_duplicate_risk: !0 } : R), _.current.delete(t);
      try {
        sessionStorage.removeItem(x);
      } catch {
      }
      b(Y);
    } catch (Y) {
      if (na(Y) === 409) {
        _.current.delete(t);
        try {
          sessionStorage.removeItem(x);
        } catch {
        }
        await B(f);
      } else
        u((z) => ({
          ...z,
          [f]: {
            ...z[f],
            pendingAction: void 0,
            error: aa(Y)
          }
        }));
    } finally {
      h.current.delete(j);
    }
  }, [B, b]), ne = V((o) => on(o.operation_id), []);
  return {
    entries: D,
    confirmationMode: y,
    runtimeRestarting: v,
    runtimeCredentialConfigured: k,
    perform: X,
    loadCandidate: ne
  };
}
function Fe(n) {
  return `${n}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function sa(n) {
  var Ae, Be, qe;
  const { jobId: e, enabled: i, onDocumentCommitted: r } = n, [l, s] = U([]), [p, u] = U(null), [y, m] = U([]), [v, $] = U(""), [k, w] = U(!1), [h, _] = U(""), [L, b] = U(null), [B, F] = U(), [D, te] = U("reading"), X = H(l), ne = H(p), o = H(v), g = H(!1), M = H(""), f = H(""), j = H(0);
  X.current = l, ne.current = p, o.current = v;
  const t = ce(() => !i || !e ? null : Ht({ jobId: e }), [i, e]), x = ce(() => !i || !e ? null : Qt({
    loadMarkdownPayload: Yt.loadMarkdownPayload
  }), [i, e]), {
    error: q,
    messages: W,
    regenerate: R,
    sendMessage: Y,
    setMessages: z,
    status: N,
    stop: T
  } = Vn({
    jobId: e,
    remoteAnswerer: t,
    localAnswerer: x,
    assistantMode: D,
    onAgentOperationSignal: (I) => {
      b({ ...I, nonce: Date.now() + Math.random() });
    },
    onConfirmationMode: F
  }), Z = N === "submitted" || N === "streaming", ae = H(Z);
  ae.current = Z;
  const be = v || (L == null ? void 0 : L.conversationId) || `${((Ae = t == null ? void 0 : t.getConversationId) == null ? void 0 : Ae.call(t)) || ""}`.trim(), it = ia({
    conversationId: be,
    enabled: i,
    discovering: Z,
    signal: L,
    confirmationModeHint: B,
    onDocumentCommitted: r
  }), se = V(async (I = "") => {
    const c = `${I || f.current || ""}`.trim();
    if (!c) {
      m([]);
      return;
    }
    try {
      const d = await Pe({ document_id: c, limit: 50 });
      m(d.conversations || []);
    } catch {
    }
  }, []), ue = V((I, c) => {
    var E;
    const d = Oe(I), C = `${c || ""}`.trim() || ((E = d[d.length - 1]) == null ? void 0 : E.message.id) || null;
    s(d), u(C), z(Re(me(d, C)));
  }, [z]);
  Q(() => {
    if (!e) {
      s([]), u(null), m([]), $(""), z([]), o.current = "", M.current = "", f.current = "", g.current = !1, b(null), F(void 0);
      return;
    }
    const I = M.current !== e;
    if (I && (M.current = e, te("reading"), g.current = !1, s([]), u(null), z([]), m([]), $(""), o.current = "", f.current = "", b(null)), !i || !t) return;
    let c = !1;
    return (async () => {
      var J, A, oe, O;
      let d = `${f.current || ""}`.trim();
      if (!d) {
        try {
          d = `${await ((J = t.getDocumentId) == null ? void 0 : J.call(t)) || ""}`.trim();
        } catch {
          d = "";
        }
        d && (f.current = d);
      }
      if (!c && d && await se(d), !(I || !X.current.length) || c) {
        c || (g.current = !0);
        return;
      }
      const E = dn({ jobId: e, documentId: d }) || `${((A = t.getConversationId) == null ? void 0 : A.call(t)) || ""}`.trim();
      if (E) {
        $(E), o.current = E, (oe = t.setConversationId) == null || oe.call(t, E, d);
        try {
          const P = await ke(E);
          if (c) return;
          const G = Ce(P.messages || []);
          if (G.length) {
            ue(G, P.head_id), requestAnimationFrame(() => {
              c || (g.current = !0);
            });
            return;
          }
        } catch {
        }
      }
      if (!c && d)
        try {
          const P = await Pe({ document_id: d, limit: 50 });
          if (c) return;
          const G = P.conversations || [];
          m(G);
          const ee = G[0];
          if (ee != null && ee.conversation_id) {
            const ie = ee.conversation_id;
            $(ie), o.current = ie, (O = t.setConversationId) == null || O.call(t, ie, d);
            try {
              const de = await ke(ie);
              if (c) return;
              ue(
                Ce(de.messages || []),
                de.head_id
              ), requestAnimationFrame(() => {
                c || (g.current = !0);
              });
              return;
            } catch {
            }
          }
        } catch {
        }
      if (c) return;
      const K = Zt(e, E);
      if (K != null && K.items.length) {
        const P = zn(K);
        s(P.items), u(P.headId), z(Re(me(P.items, P.headId)));
      } else
        s([]), u(null), z([]);
      requestAnimationFrame(() => {
        c || (g.current = !0);
      });
    })(), () => {
      c = !0;
    };
  }, [e, i, t, se, ue, z]), Q(() => {
    if (!e || !g.current) return;
    const I = v, c = window.setTimeout(() => {
      if (!l.length) {
        ye(e, I);
        return;
      }
      xe(e, De(l, p), I);
    }, 280);
    return () => window.clearTimeout(c);
  }, [e, l, p, v]);
  const st = ce(
    () => me(l, p),
    [l, p]
  ), rt = ce(() => {
    var c;
    const I = {};
    for (const d of l) {
      const C = d.message;
      C.role === "assistant" && ((c = C.citations) != null && c.length) && (I[C.id] = C.citations);
    }
    return I;
  }, [l]), ot = ce(() => {
    const I = {};
    for (const c of l) {
      const d = c.message;
      d.role === "assistant" && d.progress && (I[d.id] = d.progress);
    }
    return I;
  }, [l]), ct = ce(() => {
    const I = {};
    for (const c of l) {
      const d = c.message;
      d.content && (I[d.id] = d.content);
    }
    return I;
  }, [l]);
  Q(() => {
    if (!W.length) return;
    const I = new Map(W.map((c) => [c.id, c]));
    s((c) => c.map((d) => {
      const C = I.get(d.message.id);
      if (!C) return d;
      const E = Yn(C);
      return { ...d, message: { ...d.message, ...E } };
    }));
  }, [W]), Q(() => {
    !q || N !== "error" || s((I) => I.map((c) => {
      var d;
      return ((d = c.message.status) == null ? void 0 : d.type) === "running" ? {
        ...c,
        message: {
          ...c.message,
          content: c.message.content.trim() || q.message || "生成回答失败，请重试。",
          progress: "",
          citations: [],
          status: { type: "incomplete", reason: "error" }
        }
      } : c;
    }));
  }, [q, N]);
  const dt = Z ? `${((Be = Jn(W)) == null ? void 0 : Be.id) || ""}` : "", lt = V(async (I) => {
    if (ae.current) return;
    const c = `${I || ""}`.trim();
    if (!c) return;
    const d = ne.current, C = Fe("u"), E = Fe("a");
    s((K) => [
      ...K,
      { parentId: d, message: { id: C, role: "user", content: c } },
      {
        parentId: C,
        message: {
          id: E,
          role: "assistant",
          content: "",
          progress: D === "reading" ? "正在检索文档…" : "正在规划 PDF 操作…",
          status: { type: "running" },
          citations: []
        }
      }
    ]), u(E), await Y(
      {
        id: C,
        role: "user",
        parts: [{ type: "text", text: c }]
      },
      {
        body: {
          assistantMessageId: E,
          parentId: d,
          question: c,
          regenerate: !1,
          userMessageId: C
        }
      }
    );
  }, [D, Y]), ut = V(async (I) => {
    if (ae.current) return;
    const c = X.current, d = c.find(
      (O) => O.message.id === I && O.message.role === "assistant"
    ), C = (d == null ? void 0 : d.parentId) ?? null, E = C ? An(c, C) : null;
    let K = "", J = C;
    if ((E == null ? void 0 : E.role) === "user")
      K = E.content.trim();
    else {
      const O = me(c, C ?? ne.current);
      for (let P = O.length - 1; P >= 0; P -= 1)
        if (O[P].role === "user") {
          K = O[P].content.trim(), J = O[P].id;
          break;
        }
    }
    if (!K) return;
    const A = Fe("a"), oe = J || C;
    s((O) => [
      ...O,
      {
        parentId: oe,
        message: {
          id: A,
          role: "assistant",
          content: "",
          progress: "正在重新生成…",
          status: { type: "running" },
          citations: []
        }
      }
    ]), u(A), z(Re(me(c, I))), await R({
      messageId: I,
      body: {
        assistantMessageId: A,
        parentId: oe,
        question: K,
        regenerate: !0,
        userMessageId: J || ""
      }
    });
  }, [R, z]), pt = V(async () => {
    await T(), s(
      (I) => I.map(
        (c) => {
          var d;
          return ((d = c.message.status) == null ? void 0 : d.type) === "running" ? {
            ...c,
            message: {
              ...c.message,
              status: { type: "incomplete", reason: "cancelled" },
              progress: "",
              content: c.message.content.trim() || "已取消"
            }
          } : c;
        }
      )
    );
  }, [T]), ft = V(async () => {
    var c, d;
    if (k) return;
    ae.current && await T(), he(900), le(900), w(!0), _("");
    const I = ++j.current;
    try {
      if (await new Promise((E) => {
        window.setTimeout(E, 40);
      }), I !== j.current) return;
      const C = f.current || `${await ((c = t == null ? void 0 : t.getDocumentId) == null ? void 0 : c.call(t)) || ""}`.trim();
      f.current = C, (d = t == null ? void 0 : t.clearConversationId) == null || d.call(t, C), b(null), $(""), o.current = "", s([]), u(null), z([]), ye(e), C && await se(C);
    } catch (C) {
      console.warn("[reader-ai] new session failed", C), _("无法创建新对话，请重试。");
    } finally {
      I === j.current && w(!1);
    }
  }, [e, t, se, k, z, T]), mt = V(async (I) => {
    var E, K, J, A, oe, O, P;
    const c = `${I || ""}`.trim(), d = o.current || ((E = t == null ? void 0 : t.getConversationId) == null ? void 0 : E.call(t)) || "";
    if (!c || c === d || k) return;
    ae.current && await T(), he(1200), le(1200), w(!0), _("");
    const C = ++j.current;
    $(c), o.current = c, s([]), u(null), z([]);
    try {
      if (await new Promise((de) => {
        window.setTimeout(de, 80);
      }), C !== j.current) return;
      try {
        (A = (J = (K = globalThis.document) == null ? void 0 : K.activeElement) == null ? void 0 : J.blur) == null || A.call(J);
      } catch {
      }
      const G = f.current || `${await ((oe = t == null ? void 0 : t.getDocumentId) == null ? void 0 : oe.call(t)) || ""}`.trim();
      f.current = G;
      const ee = await ke(c);
      if (C !== j.current) return;
      he(800), le(800);
      const ie = Ce(ee.messages || []);
      if (ue(ie, ee.head_id), (O = t == null ? void 0 : t.setConversationId) == null || O.call(t, c, G), ie.length) {
        const de = Oe(ie);
        xe(
          e,
          De(
            de,
            `${ee.head_id || ""}`.trim() || ((P = de.at(-1)) == null ? void 0 : P.message.id) || null
          ),
          c
        );
      } else
        ye(e, c);
      G && await se(G), he(350), le(350);
    } catch (G) {
      console.warn("[reader-ai] switch session failed", G), C === j.current && (_("加载该对话失败，请检查网络后重试。"), s([]), u(null));
    } finally {
      C === j.current && w(!1);
    }
  }, [
    ue,
    e,
    t,
    se,
    k,
    z,
    T
  ]), ht = V(async (I) => {
    var E, K, J, A, oe;
    const c = `${I || ""}`.trim();
    if (!c)
      return _("无法分支：消息 id 无效。"), !1;
    if (k)
      return _("请稍候，当前有会话操作进行中。"), !1;
    ae.current && await T();
    const d = qn(X.current, c, ne.current);
    if (!d.length)
      return _("无法分支：找不到到此答案的对话路径。"), !1;
    if (d[d.length - 1].message.role !== "assistant")
      return _("只能从助手答案处开新对话。"), !1;
    w(!0), _("");
    try {
      await new Promise((re) => {
        window.setTimeout(re, 40);
      });
      let O = f.current || `${await ((E = t == null ? void 0 : t.getDocumentId) == null ? void 0 : E.call(t)) || ""}`.trim();
      if (f.current = O, !O)
        try {
          O = `${await ((K = t == null ? void 0 : t.getDocumentId) == null ? void 0 : K.call(t)) || ""}`.trim(), f.current = O;
        } catch {
          O = "";
        }
      if (!O)
        return _("无法分支：文档未就绪，请稍后重试。"), !1;
      const P = d.map((re, we) => ({
        id: re.message.id,
        role: re.message.role,
        content: re.message.content,
        citations: re.message.citations,
        parentId: we === 0 ? null : d[we - 1].message.id
      })), G = o.current || ((J = t == null ? void 0 : t.getConversationId) == null ? void 0 : J.call(t)) || "", ee = (y || []).find((re) => re.conversation_id === G), ie = P.find((re) => re.role === "user"), de = `${(ee == null ? void 0 : ee.title) || ""}`.trim() || `${(ie == null ? void 0 : ie.content) || ""}`.replace(/\s+/g, " ").trim() || "未命名对话", bt = (y || []).map((re) => re.title || ""), je = ln(de, bt), Ie = await un({
        documentId: O,
        title: je,
        path: P
      }), pe = Oe(Ie.items), _e = ((A = pe[pe.length - 1]) == null ? void 0 : A.message.id) || null, fe = Ie.conversation.conversation_id;
      if (!fe || !pe.length)
        throw new Error("fork returned empty conversation");
      return he(600), le(600), s(pe), u(_e), z(Re(me(pe, _e))), $(fe), o.current = fe, (oe = t == null ? void 0 : t.setConversationId) == null || oe.call(t, fe, O), m((re) => {
        const we = {
          conversation_id: fe,
          title: je,
          document_id: O,
          created_at: Ie.conversation.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: Ie.conversation.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
          message_count: pe.length,
          head_id: _e || ""
        }, It = re.filter((_t) => _t.conversation_id !== fe);
        return [we, ...It];
      }), xe(
        e,
        De(pe, _e),
        fe
      ), await se(O), !0;
    } catch (O) {
      return console.warn("[reader-ai] branch from answer failed", O), _("分支失败：未能复制上文到新对话。请检查网络后重试。"), !1;
    } finally {
      w(!1);
    }
  }, [e, t, se, k, y, z, T]), gt = V(async (I) => {
    var C, E, K, J;
    const c = `${I || ""}`.trim();
    if (!c || k) return;
    ae.current && await T(), w(!0), _("");
    const d = ++j.current;
    try {
      const A = f.current || `${await ((C = t == null ? void 0 : t.getDocumentId) == null ? void 0 : C.call(t)) || ""}`.trim();
      f.current = A;
      try {
        await pn(c);
      } catch (P) {
        if ((Number(P == null ? void 0 : P.status) || 0) !== 404) throw P;
      }
      ye(e, c);
      const O = (o.current || ((E = t == null ? void 0 : t.getConversationId) == null ? void 0 : E.call(t)) || "") === c;
      if (m((P) => P.filter((G) => G.conversation_id !== c)), O) {
        (K = t == null ? void 0 : t.clearConversationId) == null || K.call(t, A), $(""), o.current = "", s([]), u(null), z([]), ye(e);
        const P = A ? (await Pe({ document_id: A, limit: 50 }).catch(
          () => ({ conversations: [] })
        )).conversations || [] : [];
        if (d !== j.current) return;
        m(P);
        const G = P[0];
        if (G != null && G.conversation_id) {
          const ee = G.conversation_id;
          $(ee), o.current = ee;
          try {
            const ie = await ke(ee);
            if (d !== j.current) return;
            ue(
              Ce(ie.messages || []),
              ie.head_id
            ), (J = t == null ? void 0 : t.setConversationId) == null || J.call(t, ee, A);
          } catch {
            s([]), u(null);
          }
        }
      } else A && await se(A);
    } catch (A) {
      console.warn("[reader-ai] delete session failed", A), _("删除对话失败，请重试。");
    } finally {
      d === j.current && w(!1);
    }
  }, [ue, e, t, se, k, z, T]), yt = V(async (I, c) => {
    const d = `${I || ""}`.trim(), C = `${c || ""}`.replace(/\s+/g, " ").trim();
    if (!(!d || !C || k)) {
      w(!0), _("");
      try {
        const E = C.slice(0, 80);
        await fn(d, { title: E }), m(
          (J) => J.map(
            (A) => A.conversation_id === d ? { ...A, title: E } : A
          )
        );
        const K = f.current;
        K && await se(K);
      } catch (E) {
        console.warn("[reader-ai] rename session failed", E), _("重命名失败，请重试。");
      } finally {
        w(!1);
      }
    }
  }, [se, k]), ze = H(!1);
  Q(() => {
    var I;
    if (ze.current && !Z) {
      const c = f.current;
      c && se(c);
      const d = ((I = t == null ? void 0 : t.getConversationId) == null ? void 0 : I.call(t)) || "";
      d && $(d);
    }
    ze.current = Z;
  }, [Z, t, se]);
  const vt = ce(() => {
    var c;
    const I = v || ((c = t == null ? void 0 : t.getConversationId) == null ? void 0 : c.call(t)) || "";
    return (y || []).map((d) => ({
      id: d.conversation_id,
      title: `${d.title || ""}`.trim() || "未命名对话",
      updatedAt: d.updated_at || "",
      messageCount: Number(d.message_count) || 0,
      active: d.conversation_id === I
    }));
  }, [y, v, t]);
  return {
    citationsByMessageId: rt,
    progressByMessageId: ot,
    contentByMessageId: ct,
    streamingAssistantId: dt,
    isRunning: Z,
    messages: st,
    sessions: vt,
    activeConversationId: v || ((qe = t == null ? void 0 : t.getConversationId) == null ? void 0 : qe.call(t)) || "",
    sessionBusy: k,
    sessionError: h,
    submitQuestion: lt,
    retryAnswer: ut,
    cancelAnswer: pt,
    newSession: ft,
    switchSession: mt,
    removeSession: gt,
    renameSession: yt,
    branchFromAnswer: ht,
    agentOperations: it,
    assistantMode: D,
    setAssistantMode: te
  };
}
function _a({
  open: n,
  jobId: e,
  onClose: i,
  onJumpCitation: r,
  onDocumentCommitted: l,
  layout: s = "floating"
}) {
  const p = n && !!e, {
    citationsByMessageId: u,
    progressByMessageId: y,
    contentByMessageId: m,
    streamingAssistantId: v,
    isRunning: $,
    sessions: k,
    activeConversationId: w,
    sessionBusy: h,
    sessionError: _,
    messages: L,
    submitQuestion: b,
    retryAnswer: B,
    cancelAnswer: F,
    newSession: D,
    switchSession: te,
    removeSession: X,
    renameSession: ne,
    branchFromAnswer: o,
    agentOperations: g,
    assistantMode: M,
    setAssistantMode: f
  } = sa({
    jobId: e,
    enabled: p,
    onDocumentCommitted: l
  }), [j, t] = U(""), x = V(async (W) => {
    t(""), await o(W) && (t(
      "已保存新对话（fork-n-原名）：复制了到此答案的上文，原对话不变。顶部列表可切换。"
    ), window.setTimeout(() => t(""), 6e3));
  }, [o]), q = V((W) => {
    Ut() || r(W);
  }, [r]);
  return /* @__PURE__ */ a(
    At,
    {
      id: "reader-ai-panel",
      open: n,
      title: "RetainPDF AI",
      subtitle: "当前文档",
      titleIcon: /* @__PURE__ */ a(Me, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.ai-float.pos.v2",
      ariaLabel: "阅读问答",
      width: 420,
      placement: s === "docked" ? "dock-right" : "floating",
      className: `reader-float-ai is-${s}${h ? " is-session-busy" : ""}`,
      onClose: i,
      children: e ? /* @__PURE__ */ S("div", { className: "reader-float-ai-body", children: [
        /* @__PURE__ */ a(
          Ln,
          {
            sessions: k,
            activeId: w,
            busy: h,
            errorText: _,
            onSwitch: te,
            onNew: D,
            onDelete: X,
            onRename: ne
          }
        ),
        j ? /* @__PURE__ */ a("div", { className: "aui-session-banner", role: "status", children: j }) : null,
        /* @__PURE__ */ a("div", { className: "reader-float-ai-thread-wrap", "aria-busy": h || void 0, children: /* @__PURE__ */ a(
          Fn,
          {
            jobId: e,
            messages: L,
            citationsByMessageId: u,
            progressByMessageId: y,
            contentByMessageId: m,
            streamingAssistantId: v,
            isRunning: $,
            onSubmit: b,
            onRetry: B,
            onCancel: F,
            onJumpCitation: q,
            onBranchFromAnswer: x,
            branchBusy: h,
            agentOperations: g,
            assistantMode: M,
            onAssistantModeChange: f
          }
        ) })
      ] }) : /* @__PURE__ */ S("div", { className: "reader-float-ai-empty", children: [
        /* @__PURE__ */ a(Me, { size: 22, strokeWidth: 1.75, "aria-hidden": !0 }),
        /* @__PURE__ */ a("p", { children: "当前文档还没有可用于问答的 Markdown" }),
        /* @__PURE__ */ a("span", { children: "请先完成 OCR 文档解析" })
      ] })
    }
  );
}
export {
  _a as ReaderAiPanel
};
//# sourceMappingURL=ReaderAiPanel-DTKf7Nfz.js.map
