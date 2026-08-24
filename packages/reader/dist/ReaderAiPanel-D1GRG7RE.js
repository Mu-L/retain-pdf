import { jsx as i, jsxs as W, Fragment as ee } from "react/jsx-runtime";
import { useState as A, useEffect as nt, useMemo as tt, useCallback as Q, useRef as X, useId as ne } from "react";
import { ArrowDown as se, Sparkles as It, BookOpen as St, ListTree as ae, FlaskConical as ie, Copy as re, GitBranch as oe, RefreshCw as ce, Square as de, ArrowUp as le, Loader2 as Dt, ChevronDown as ue, Plus as fe, Check as pe, X as me, Pencil as he, Trash2 as ge } from "lucide-react";
import { R as ye } from "./ReaderFloatShell-BLGUpWw5.js";
import { ThreadPrimitive as dt, MessagePrimitive as Lt, ActionBarPrimitive as bt, ComposerPrimitive as mt, useExternalStoreRuntime as ve, AssistantRuntimeProvider as Ie } from "@assistant-ui/react";
import { A as be } from "./AiMarkdownAnswer-JudKAKDl.js";
import { j as ct, p as st, t as we, o as ke } from "./answer-enhance-C1inCPcI.js";
import { M as Ne, C as Et, h as Ce } from "./config-CgaWliJ_.js";
import { e as Me, d as Te } from "./ReaderApp-BTWCGnBQ.js";
import { Chat as _e, useChat as $e } from "@ai-sdk/react";
import { s as xe, a as Ee, l as Re, c as lt, b as wt } from "./thread-branch-store-BGGAKERc.js";
import { l as Pe } from "./ask-answerer-zlx4r3po.js";
import { listConversations as kt, getConversation as ht, messagesToBranchItems as gt, nextForkConversationTitle as Se, forkConversationFromPath as De, deleteConversation as Le, patchConversation as ze } from "@retainpdf/api/conversations";
const Fe = [
  { prompt: "用几句话总结这篇文献的核心内容。", label: "总结本文", icon: St },
  { prompt: "这篇文献的主要结论是什么？", label: "提炼主要结论", icon: ae },
  { prompt: "作者用了什么方法或模型？", label: "梳理方法与模型", icon: ie },
  { prompt: "有哪些关键结果或数据？", label: "标出关键结果", icon: It }
];
function zt(n) {
  return n.content.filter((t) => t.type === "text").map((t) => t.text).join(`
`).trim();
}
function Rt({ label: n }) {
  return /* @__PURE__ */ W("div", { className: "aui-thinking", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ i(Dt, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
    /* @__PURE__ */ i("span", { children: n || "思考中…" })
  ] });
}
function We({ disabled: n }) {
  return /* @__PURE__ */ W("div", { className: "aui-empty", children: [
    /* @__PURE__ */ i("div", { className: "aui-empty-mascot", "aria-hidden": !0, children: /* @__PURE__ */ i("span", { className: "aui-empty-mascot-face", children: /* @__PURE__ */ i(It, { size: 21, strokeWidth: 1.9 }) }) }),
    /* @__PURE__ */ i("h2", { className: "aui-empty-title", children: "有什么可以帮你？" }),
    /* @__PURE__ */ i("p", { className: "aui-empty-sub", children: "仅根据当前文档的 Markdown 回答，引用可以直接跳页" }),
    /* @__PURE__ */ i("div", { className: "aui-suggestions", role: "group", "aria-label": "推荐问题", children: Fe.map((t) => {
      const r = t.icon;
      return /* @__PURE__ */ W(
        dt.Suggestion,
        {
          prompt: t.prompt,
          send: !0,
          type: "button",
          className: "aui-suggestion",
          disabled: n,
          children: [
            /* @__PURE__ */ i(r, { size: 14, strokeWidth: 2, "aria-hidden": !0, className: "aui-suggestion-icon" }),
            /* @__PURE__ */ i("span", { className: "aui-suggestion-label", children: t.label })
          ]
        },
        t.prompt
      );
    }) })
  ] });
}
function Be({ message: n }) {
  return /* @__PURE__ */ i(Lt.Root, { className: "aui-msg aui-msg-user", "data-role": "user", children: /* @__PURE__ */ i("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ i("div", { className: "aui-md-plain", children: zt(n) }) }) });
}
function qe({
  jobId: n,
  message: t,
  citations: r,
  progress: o,
  streaming: c,
  branchBusy: d,
  onJumpCitation: u,
  onBranchFromAnswer: C
}) {
  const T = zt(t);
  return /* @__PURE__ */ i(Lt.Root, { className: "aui-msg aui-msg-assistant", "data-role": "assistant", children: /* @__PURE__ */ W("div", { className: "aui-msg-stack", children: [
    c && o ? /* @__PURE__ */ i(Rt, { label: o }) : null,
    c && !o && !T ? /* @__PURE__ */ i(Rt, { label: "思考中…" }) : null,
    T ? /* @__PURE__ */ i("div", { className: "aui-msg-bubble", children: /* @__PURE__ */ i(
      be,
      {
        content: T,
        streaming: c,
        citations: r,
        jobId: n,
        className: "aui-md",
        streamingClassName: "aui-md-streaming",
        pendingClassName: "aui-md-pending",
        finalClassName: "aui-md-final",
        onJumpCitation: u
      }
    ) }) : null,
    /* @__PURE__ */ W(
      bt.Root,
      {
        className: "aui-msg-actions",
        "data-reader-ai-actions": "",
        hideWhenRunning: !0,
        autohide: "not-last",
        children: [
          /* @__PURE__ */ i(bt.Copy, { className: "aui-action-btn", "aria-label": "复制答案", title: "复制答案", children: /* @__PURE__ */ i(re, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }) }),
          C ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "aui-action-btn aui-action-btn-branch",
              "aria-label": "从这里开新对话",
              title: "从这里开新对话",
              disabled: d,
              onClick: async () => {
                ct(1200, { overlayDelayMs: 0 }), st(1200), await C(t.id);
              },
              children: /* @__PURE__ */ i(oe, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 })
            }
          ) : null,
          /* @__PURE__ */ i(bt.Reload, { className: "aui-action-btn", "aria-label": "重新生成", title: "重新生成", children: /* @__PURE__ */ i(ce, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 }) })
        ]
      }
    )
  ] }) });
}
function je({ isRunning: n, branchBusy: t }) {
  return /* @__PURE__ */ W(mt.Root, { className: "aui-composer", "data-reader-ai-composer": "", children: [
    /* @__PURE__ */ W("div", { className: "aui-composer-shell", children: [
      /* @__PURE__ */ i(
        mt.Input,
        {
          className: "aui-input",
          rows: 1,
          placeholder: "询问当前文档…",
          "aria-label": "向当前文档提问",
          autoFocus: !0,
          enterKeyHint: "send",
          disabled: t,
          submitMode: "enter"
        }
      ),
      /* @__PURE__ */ W("div", { className: "aui-composer-toolbar", children: [
        /* @__PURE__ */ W("span", { className: "aui-composer-chip", title: "检索范围", children: [
          /* @__PURE__ */ i(St, { size: 12, strokeWidth: 2.2, "aria-hidden": !0 }),
          "当前文档"
        ] }),
        /* @__PURE__ */ i("div", { className: "aui-composer-actions", children: n ? /* @__PURE__ */ i(mt.Cancel, { className: "aui-send aui-send-stop", "aria-label": "停止生成", children: /* @__PURE__ */ i(de, { size: 12, strokeWidth: 2.6, "aria-hidden": !0 }) }) : /* @__PURE__ */ i(mt.Send, { className: "aui-send", "aria-label": "发送", children: /* @__PURE__ */ i(le, { size: 16, strokeWidth: 2.5, "aria-hidden": !0 }) }) })
      ] })
    ] }),
    /* @__PURE__ */ i("p", { className: "aui-hint", children: "AI 可能会出错，请核对原文与引用" })
  ] });
}
function Oe() {
  return /* @__PURE__ */ W("div", { className: "aui-composer aui-composer-locked", role: "alert", children: [
    /* @__PURE__ */ i("p", { className: "aui-llm-lock-msg", children: Ne }),
    /* @__PURE__ */ i("p", { className: "aui-hint", children: "请到首页「设置 → API 设置」填写模型 Key 后即可提问" })
  ] });
}
function Ge({
  jobId: n,
  messages: t,
  citationsByMessageId: r,
  progressByMessageId: o,
  streamingAssistantId: c,
  isRunning: d,
  missingLlmKey: u,
  branchBusy: C,
  onJumpCitation: T,
  onBranchFromAnswer: w
}) {
  const p = t.length === 0;
  return /* @__PURE__ */ i(
    dt.Root,
    {
      className: `aui-thread aui-thread-root${u ? " is-llm-locked" : ""}`,
      "data-chat-ui": "assistant-ui-official-thread",
      children: /* @__PURE__ */ i(
        dt.Viewport,
        {
          className: "aui-viewport",
          "data-slot": "aui_thread-viewport",
          "data-reader-ai-viewport": "true",
          turnAnchor: "top",
          autoScroll: !0,
          children: /* @__PURE__ */ W("div", { className: `aui-thread-inner${p ? " is-empty" : ""}`, children: [
            p ? /* @__PURE__ */ i(We, { disabled: C || u }) : null,
            /* @__PURE__ */ i("div", { className: "aui-message-group", "data-slot": "aui_message-group", children: /* @__PURE__ */ i(dt.Messages, { children: ({ message: v }) => {
              var P;
              if (v.role === "user") return /* @__PURE__ */ i(Be, { message: v });
              if (v.role !== "assistant") return null;
              const N = ((P = v.status) == null ? void 0 : P.type) === "running" || d && c === v.id;
              return /* @__PURE__ */ i(
                qe,
                {
                  jobId: n,
                  message: v,
                  citations: r[v.id] || [],
                  progress: o[v.id] || "",
                  streaming: N,
                  branchBusy: C,
                  onJumpCitation: T,
                  onBranchFromAnswer: w
                }
              );
            } }) }),
            /* @__PURE__ */ W(dt.ViewportFooter, { className: "aui-thread-viewport-footer", children: [
              !p && !C ? /* @__PURE__ */ i(
                dt.ScrollToBottom,
                {
                  className: "aui-scroll-bottom-btn aui-scroll-bottom",
                  "aria-label": "滚到最新",
                  children: /* @__PURE__ */ i(se, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
                }
              ) : null,
              u ? /* @__PURE__ */ i(Oe, {}) : /* @__PURE__ */ i(je, { isRunning: d, branchBusy: C })
            ] })
          ] })
        }
      )
    }
  );
}
const He = (n) => n, Ke = Object.freeze([]), Ye = Object.freeze({}), Pt = Object.freeze({});
function Ve(n) {
  return n.content.filter((t) => t.type === "text").map((t) => t.text).join(`
`).trim();
}
function Je(n, t, r) {
  var o, c, d, u;
  return ((o = n.status) == null ? void 0 : o.type) === "running" || r && t === n.id ? { type: "running" } : ((c = n.status) == null ? void 0 : c.type) === "incomplete" || ((d = n.status) == null ? void 0 : d.type) === "error" ? {
    type: "incomplete",
    reason: ((u = n.status) == null ? void 0 : u.reason) === "cancelled" ? "cancelled" : "error"
  } : { type: "complete", reason: "stop" };
}
function Qe({
  jobId: n = "",
  messages: t = Ke,
  citationsByMessageId: r = Ye,
  progressByMessageId: o = Pt,
  contentByMessageId: c = Pt,
  streamingAssistantId: d = "",
  isRunning: u = !1,
  onSubmit: C,
  onRetry: T,
  onCancel: w,
  onJumpCitation: p,
  onBranchFromAnswer: v,
  branchBusy: N = !1
}) {
  const [, P] = A(0);
  nt(() => {
    const h = () => P((e) => e + 1);
    return window.addEventListener("focus", h), window.addEventListener("storage", h), document.addEventListener(Et, h), () => {
      window.removeEventListener("focus", h), window.removeEventListener("storage", h), document.removeEventListener(Et, h);
    };
  }, []);
  const l = !Ce(), z = tt(() => t.map((h) => ({
    id: h.id,
    role: h.role,
    content: c[h.id] || h.content || "",
    ...h.role === "assistant" ? { status: Je(h, d, u) } : {}
  })), [c, u, t, d]), B = Q(async (h) => {
    const e = h ? Math.max(0, t.findIndex((V) => V.id === h) + 1) : 0, E = t.slice(e).find((V) => V.role === "assistant");
    E && await T(E.id);
  }, [t, T]), b = Q(async (h) => {
    const e = Ve(h);
    !e || u || N || l || await C(e);
  }, [N, u, l, C]), R = Q(async () => {
    await w();
  }, [w]), q = tt(() => ({
    messages: z,
    isRunning: u,
    isDisabled: N || l,
    convertMessage: He,
    onNew: b,
    onReload: B,
    onCancel: R
  }), [
    N,
    R,
    b,
    u,
    l,
    B,
    z
  ]), k = ve(q);
  return /* @__PURE__ */ i(Ie, { runtime: k, children: /* @__PURE__ */ i(
    Ge,
    {
      jobId: n,
      messages: t,
      citationsByMessageId: r,
      progressByMessageId: o,
      streamingAssistantId: d,
      isRunning: u,
      missingLlmKey: l,
      branchBusy: N,
      onJumpCitation: p,
      onBranchFromAnswer: v
    }
  ) });
}
function yt(n = 900, t = 0) {
  ct(n, { overlayDelayMs: t }), st(n);
}
function Ue({
  sessions: n,
  activeId: t,
  busy: r = !1,
  disabled: o = !1,
  errorText: c = "",
  onSwitch: d,
  onNew: u,
  onDelete: C,
  onRename: T
}) {
  const w = n.length > 0, p = r || o, [v, N] = A(!1), [P, l] = A(""), [z, B] = A(""), b = X(null), R = ne();
  function q(m) {
    const _ = `${m || ""}`.match(/^fork-(\d+)-(.*)$/i);
    if (!_) return m;
    const j = _[2].trim();
    return j ? `${j} · 分支${_[1]}` : `分支${_[1]}`;
  }
  const k = X(!1), h = X(null), e = n.find((m) => m.id === t) || null, E = e ? e.messageCount ? q(e.title) : `${q(e.title)}（空）` : w ? "选择以往对话" : "新对话";
  nt(() => {
    if (!v) {
      l("");
      return;
    }
    const m = (H) => {
      if (k.current) return;
      const g = b.current;
      g && (H.target instanceof Node && g.contains(H.target) || (N(!1), l("")));
    }, _ = (H) => {
      H.key === "Escape" && (N(!1), l(""));
    }, j = window.setTimeout(() => {
      document.addEventListener("pointerdown", m, !0);
    }, 0);
    return document.addEventListener("keydown", _), () => {
      window.clearTimeout(j), document.removeEventListener("pointerdown", m, !0), document.removeEventListener("keydown", _);
    };
  }, [v]), nt(() => {
    if (!P) return;
    const m = h.current;
    m && (m.focus(), m.select());
  }, [P]);
  const V = (m) => {
    const _ = `${m || ""}`.trim();
    !_ || p || k.current || P || (k.current = !0, yt(1e3, 0), requestAnimationFrame(() => {
      N(!1), window.setTimeout(() => {
        (async () => {
          try {
            await d(_);
          } finally {
            yt(400, 0), k.current = !1;
          }
        })();
      }, 40);
    }));
  }, Y = (m) => {
    p || (l(m.id), B(m.title || ""));
  }, F = () => {
    const m = P, _ = z;
    l(""), m && T(m, _);
  }, G = () => {
    l(""), B("");
  }, S = (m) => {
    var H;
    if (p || k.current) return;
    const _ = m.title || "未命名对话";
    (H = globalThis.confirm) != null && H.call(globalThis, `确定删除对话「${_}」？此操作不可恢复。`) && (k.current = !0, yt(800, 0), (async () => {
      try {
        await C(m.id);
      } finally {
        k.current = !1;
      }
    })());
  };
  return /* @__PURE__ */ W(
    "div",
    {
      className: "aui-session-bar",
      "data-reader-ai-sessions": "",
      ref: b,
      onPointerDown: (m) => {
        m.stopPropagation();
      },
      onClick: (m) => {
        m.stopPropagation();
      },
      children: [
        /* @__PURE__ */ W("div", { className: "aui-session-row", children: [
          /* @__PURE__ */ W(
            "button",
            {
              type: "button",
              className: `aui-session-trigger${v ? " is-open" : ""}`,
              "aria-label": "切换对话窗口",
              "aria-haspopup": "listbox",
              "aria-expanded": v,
              "aria-controls": R,
              disabled: p || !w,
              title: E,
              onClick: () => {
                p || !w || N((m) => !m);
              },
              children: [
                /* @__PURE__ */ i("span", { className: "aui-session-trigger-label", children: E }),
                /* @__PURE__ */ i(ue, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 })
              ]
            }
          ),
          /* @__PURE__ */ W(
            "button",
            {
              type: "button",
              className: "aui-session-btn",
              disabled: p,
              title: "新对话窗口",
              "aria-label": "新对话",
              onClick: () => {
                p || k.current || (k.current = !0, yt(800), N(!1), l(""), window.setTimeout(() => {
                  (async () => {
                    try {
                      await u();
                    } finally {
                      k.current = !1;
                    }
                  })();
                }, 40));
              },
              children: [
                r ? /* @__PURE__ */ i(Dt, { className: "aui-spin", size: 14, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ i(fe, { size: 14, strokeWidth: 2.4, "aria-hidden": !0 }),
                /* @__PURE__ */ i("span", { children: "新对话" })
              ]
            }
          )
        ] }),
        v && w ? /* @__PURE__ */ i(
          "ul",
          {
            id: R,
            className: "aui-session-list",
            role: "listbox",
            "aria-label": "以往对话",
            children: n.map((m) => {
              const _ = m.messageCount ? q(m.title) : `${q(m.title)}（空）`, j = m.id === t, H = P === m.id;
              return /* @__PURE__ */ i("li", { className: "aui-session-row-item", role: "presentation", children: H ? /* @__PURE__ */ W("div", { className: "aui-session-edit", children: [
                /* @__PURE__ */ i(
                  "input",
                  {
                    ref: h,
                    className: "aui-session-edit-input",
                    value: z,
                    maxLength: 80,
                    "aria-label": "对话标题",
                    disabled: p,
                    onChange: (g) => B(g.target.value),
                    onKeyDown: (g) => {
                      g.key === "Enter" ? (g.preventDefault(), F()) : g.key === "Escape" && (g.preventDefault(), G());
                    },
                    onClick: (g) => g.stopPropagation()
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": "保存标题",
                    title: "保存",
                    disabled: p || !z.trim(),
                    onClick: (g) => {
                      g.stopPropagation(), F();
                    },
                    children: /* @__PURE__ */ i(pe, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn",
                    "aria-label": "取消重命名",
                    title: "取消",
                    disabled: p,
                    onClick: (g) => {
                      g.stopPropagation(), G();
                    },
                    children: /* @__PURE__ */ i(me, { size: 13, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }) : /* @__PURE__ */ W(ee, { children: [
                /* @__PURE__ */ W(
                  "button",
                  {
                    type: "button",
                    role: "option",
                    "aria-selected": j,
                    className: `aui-session-item${j ? " is-active" : ""}`,
                    disabled: p,
                    title: _,
                    onPointerDown: (g) => {
                      g.stopPropagation(), !j && !p && st(1e3);
                    },
                    onClick: (g) => {
                      if (g.preventDefault(), g.stopPropagation(), j) {
                        N(!1);
                        return;
                      }
                      V(m.id);
                    },
                    children: [
                      /* @__PURE__ */ i("span", { className: "aui-session-item-title", children: _ }),
                      j ? /* @__PURE__ */ i("span", { className: "aui-session-item-badge", children: "当前" }) : null
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
                    disabled: p,
                    onClick: (g) => {
                      g.preventDefault(), g.stopPropagation(), Y(m);
                    },
                    children: /* @__PURE__ */ i(he, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    className: "aui-session-icon-btn is-danger",
                    "aria-label": `删除 ${_}`,
                    title: "删除",
                    disabled: p,
                    onClick: (g) => {
                      g.preventDefault(), g.stopPropagation(), S(m);
                    },
                    children: /* @__PURE__ */ i(ge, { size: 13, strokeWidth: 2.4, "aria-hidden": !0 })
                  }
                )
              ] }) }, m.id);
            })
          }
        ) : null,
        c ? /* @__PURE__ */ i("div", { className: "aui-session-error", role: "alert", children: c }) : null
      ]
    }
  );
}
function Nt(n, t) {
  return {
    version: 1,
    headId: t,
    items: n.map((r) => {
      var o;
      return {
        parentId: r.parentId,
        message: {
          id: r.message.id,
          role: r.message.role,
          content: r.message.content,
          ...r.message.progress ? { progress: r.message.progress } : {},
          ...(o = r.message.citations) != null && o.length ? { citations: r.message.citations } : {},
          ...r.message.status ? {
            status: {
              type: r.message.status.type,
              ...r.message.status.reason ? { reason: `${r.message.status.reason}` } : {}
            }
          } : {}
        }
      };
    })
  };
}
function Xe(n) {
  return {
    items: n.items.map((t) => ({
      parentId: t.parentId,
      message: {
        ...t.message,
        citations: t.message.citations || [],
        status: t.message.status
      }
    })),
    headId: n.headId
  };
}
function ot(n, t) {
  if (!n.length) return [];
  const r = new Map(n.map((C) => [C.message.id, C])), o = t && r.get(t) || n.at(-1);
  if (!o) return [];
  const c = [];
  let d = o;
  const u = /* @__PURE__ */ new Set();
  for (; d && !u.has(d.message.id); )
    u.add(d.message.id), c.push(d.message), d = d.parentId ? r.get(d.parentId) : void 0;
  return c.reverse();
}
function Ze(n, t) {
  var r;
  return t ? ((r = n.find((o) => o.message.id === t)) == null ? void 0 : r.message) ?? null : null;
}
function Ae(n, t) {
  const r = new Map(n.map((u) => [u.message.id, u]));
  let o = r.get(t);
  if (!o) return [];
  const c = [], d = /* @__PURE__ */ new Set();
  for (; o && !d.has(o.message.id); )
    d.add(o.message.id), c.push(o), o = o.parentId ? r.get(o.parentId) : void 0;
  return c.reverse();
}
function tn(n, t, r) {
  var p, v, N, P;
  const o = `${t || ""}`.trim();
  if (!o || !n.length) return [];
  let c = o;
  n.some((l) => l.message.id === c) || (r && n.some((l) => l.message.id === r) ? c = r : c = ((p = [...n].reverse().find((l) => l.message.role === "assistant")) == null ? void 0 : p.message.id) || "");
  let d = Ae(n, c);
  if (d.length >= 2 && ((v = d.at(-1)) == null ? void 0 : v.message.role) === "assistant") return d;
  d.length === 1 && ((N = d[0]) == null ? void 0 : N.message.role) === "user" && (d = []);
  const u = ot(n, r || c);
  let C = u.findIndex((l) => l.id === c);
  if (C < 0 && (C = u.length - 1), C < 0) return d;
  const T = new Map(n.map((l) => [l.message.id, l])), w = u.slice(0, C + 1).map((l) => T.get(l.id)).filter((l) => !!l);
  for (; w.length && ((P = w.at(-1)) == null ? void 0 : P.message.role) !== "assistant"; ) w.pop();
  return w.length ? w : d;
}
function Ct(n) {
  return n.map((t) => ({
    parentId: t.parentId,
    message: {
      ...t.message,
      citations: t.message.citations || [],
      status: t.message.status
    }
  }));
}
const en = {
  search_markdown: "检索 Markdown",
  read_markdown_chunk: "阅读 Markdown 片段",
  list_documents: "确认文档信息",
  read_blocks: "阅读相关段落",
  search_favorites: "查找收藏",
  search_fulltext: "检索文档内容"
};
function nn(n) {
  const t = typeof n == "string" ? n : n.tool || n.event || n.type || "";
  return en[t] || (t ? `执行 ${t}` : "处理中");
}
function Ft(n) {
  return ((n == null ? void 0 : n.parts) || []).filter((t) => t.type === "text").map((t) => t.text).join("").trim();
}
function sn(n, t) {
  const r = `${t.question || ""}`.trim();
  if (r) return r;
  for (let o = n.length - 1; o >= 0; o -= 1) {
    const c = n[o];
    if (c.role !== "user") continue;
    const d = Ft(c);
    if (d) return d;
  }
  return "";
}
function an(n) {
  const t = Number(n == null ? void 0 : n.status) || 0, r = `${(n == null ? void 0 : n.message) || ""}`;
  return t === 502 || /\b502\b/.test(r);
}
class rn {
  constructor(t) {
    this.options = t;
  }
  async sendMessages({
    abortSignal: t,
    body: r,
    messages: o,
    trigger: c
  }) {
    var v, N;
    const d = r || {}, u = sn(o, d);
    if (!u) throw new Error("请输入问题。");
    const C = `${d.assistantMessageId || ""}`.trim() || `a-${Date.now().toString(36)}`, T = `${C}-text`, w = this.options.getRemoteAnswerer(), p = ((N = (v = this.options).getLocalAnswerer) == null ? void 0 : N.call(v)) || null;
    if (!w && !p)
      throw new Error("问答暂不可用：请确认已打开任务阅读器。");
    return new ReadableStream({
      start: (P) => {
        let l = !1, z = "", B = {
          citations: [],
          progress: c === "regenerate-message" ? "正在重新生成…" : "正在检索文档…",
          status: "running"
        };
        const b = (q) => {
          l || P.enqueue(q);
        }, R = (q) => {
          B = { ...B, ...q }, b({ type: "message-metadata", messageMetadata: B });
        };
        b({ type: "start", messageId: C, messageMetadata: B }), b({ type: "start-step" }), b({ type: "text-start", id: T }), (async () => {
          var q, k;
          try {
            await ((q = w == null ? void 0 : w.ensureLoaded) == null ? void 0 : q.call(w, this.options.jobId));
            let h = w || p, e = !1, E;
            try {
              E = await h.answer({
                question: u,
                scope: "document",
                parentId: `${d.parentId || ""}`.trim(),
                regenerate: d.regenerate ?? c === "regenerate-message",
                userMessageId: `${d.userMessageId || ""}`.trim(),
                assistantMessageId: C,
                onToolEvent: (F) => {
                  if (z || t != null && t.aborted) return;
                  const G = nn(F);
                  G && R({ progress: G });
                },
                onAnswerDelta: (F, G) => {
                  !G || t != null && t.aborted || (z += G, B.progress && R({ progress: "" }), b({ type: "text-delta", id: T, delta: G }));
                },
                onCompress: (F) => {
                  if (z || t != null && t.aborted) return;
                  const G = Number(F == null ? void 0 : F.dropped_turns) || 0;
                  G && R({ progress: `已压缩 ${G} 轮早期对话` });
                },
                signal: t
              });
            } catch (F) {
              if (t != null && t.aborted || !w || !p || !an(F)) throw F;
              e = !0, R({ progress: "在线服务暂不可用，改用本地检索…" }), await ((k = p.ensureLoaded) == null ? void 0 : k.call(p, this.options.jobId)), h = p, E = await h.answer({ question: u, scope: "document", signal: t });
            }
            if (t != null && t.aborted) {
              R({ progress: "", status: "cancelled" }), b({ type: "abort", reason: "cancelled" });
              return;
            }
            const V = we(E == null ? void 0 : E.citations);
            let Y = xe(
              `${(E == null ? void 0 : E.answer) || z || ""}`.trim() || "没有找到可用回答。",
              V
            );
            if (e && (Y += `

_在线服务暂不可用，以上来自本地文档检索。_`), (E == null ? void 0 : E.persisted) === !1 && (Y += `

_⚠️ 本轮回答未能写入历史记录（存储暂时不可用），刷新后可能丢失。_`), !z)
              b({ type: "text-delta", id: T, delta: Y });
            else if (Y.startsWith(z)) {
              const F = Y.slice(z.length);
              F && b({ type: "text-delta", id: T, delta: F });
            }
            b({ type: "text-end", id: T }), R({
              citations: V,
              persisted: (E == null ? void 0 : E.persisted) !== !1,
              progress: "",
              status: "complete"
            }), b({ type: "finish-step" }), b({ type: "finish", finishReason: "stop", messageMetadata: B });
          } catch (h) {
            t != null && t.aborted ? (R({ progress: "", status: "cancelled" }), b({ type: "abort", reason: "cancelled" })) : (R({ progress: "", status: "error" }), b({
              type: "error",
              errorText: h instanceof Error ? h.message : "生成回答失败，请重试。"
            }));
          } finally {
            l || (l = !0, P.close());
          }
        })();
      }
    });
  }
  async reconnectToStream() {
    return null;
  }
}
function on(n) {
  return Ft(n);
}
function vt(n) {
  return n.map((t) => {
    var r, o;
    return {
      id: t.id,
      role: t.role,
      metadata: t.role === "assistant" ? {
        citations: t.citations || [],
        progress: t.progress || "",
        status: ((r = t.status) == null ? void 0 : r.type) === "running" ? "running" : ((o = t.status) == null ? void 0 : o.type) === "incomplete" ? t.status.reason === "cancelled" ? "cancelled" : "error" : "complete"
      } : void 0,
      parts: [{ type: "text", text: t.content || "" }]
    };
  });
}
function cn(n) {
  const t = n.metadata || {}, r = t.status === "running", o = t.status === "cancelled" || t.status === "error";
  return {
    id: n.id,
    role: n.role,
    content: on(n),
    ...n.role === "assistant" ? {
      citations: t.citations || [],
      progress: t.progress || "",
      status: r ? { type: "running" } : o ? {
        type: "incomplete",
        reason: t.status === "cancelled" ? "cancelled" : "error"
      } : { type: "complete", reason: "stop" }
    } : {}
  };
}
function dn(n) {
  const t = X(n.remoteAnswerer), r = X(n.localAnswerer);
  t.current = n.remoteAnswerer, r.current = n.localAnswerer;
  const o = tt(() => new _e({
    id: `reader-${n.jobId || "idle"}`,
    transport: new rn({
      jobId: n.jobId,
      getRemoteAnswerer: () => t.current,
      getLocalAnswerer: () => r.current
    })
  }), [n.jobId]);
  return $e({ chat: o, experimental_throttle: 16 });
}
function ln(n) {
  for (let t = n.length - 1; t >= 0; t -= 1)
    if (n[t].role === "assistant") return n[t];
}
function Mt(n) {
  return `${n}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function un(n) {
  var _t, $t;
  const { jobId: t, enabled: r } = n, [o, c] = A([]), [d, u] = A(null), [C, T] = A([]), [w, p] = A(""), [v, N] = A(!1), [P, l] = A(""), z = X(o), B = X(d), b = X(w), R = X(!1), q = X(""), k = X(""), h = X(0);
  z.current = o, B.current = d, b.current = w;
  const e = tt(() => !r || !t ? null : Me({ jobId: t }), [r, t]), E = tt(() => !r || !t ? null : Ee({
    loadMarkdownPayload: Te.loadMarkdownPayload
  }), [r, t]), {
    error: V,
    messages: Y,
    regenerate: F,
    sendMessage: G,
    setMessages: S,
    status: m,
    stop: _
  } = dn({ jobId: t, remoteAnswerer: e, localAnswerer: E }), j = m === "submitted" || m === "streaming", H = X(j);
  H.current = j;
  const g = Q(async (f = "") => {
    const s = `${f || k.current || ""}`.trim();
    if (!s) {
      T([]);
      return;
    }
    try {
      const a = await kt({ document_id: s, limit: 50 });
      T(a.conversations || []);
    } catch {
    }
  }, []), at = Q((f, s) => {
    var I;
    const a = Ct(f), y = `${s || ""}`.trim() || ((I = a[a.length - 1]) == null ? void 0 : I.message.id) || null;
    c(a), u(y), S(vt(ot(a, y)));
  }, [S]);
  nt(() => {
    if (!t) {
      c([]), u(null), T([]), p(""), S([]), b.current = "", q.current = "", k.current = "", R.current = !1;
      return;
    }
    const f = q.current !== t;
    if (f && (q.current = t, R.current = !1, c([]), u(null), S([]), T([]), p(""), b.current = "", k.current = ""), !r || !e) return;
    let s = !1;
    return (async () => {
      var O, x, Z, $;
      let a = `${k.current || ""}`.trim();
      if (!a) {
        try {
          a = `${await ((O = e.getDocumentId) == null ? void 0 : O.call(e)) || ""}`.trim();
        } catch {
          a = "";
        }
        a && (k.current = a);
      }
      if (!s && a && await g(a), !(f || !z.current.length) || s) {
        s || (R.current = !0);
        return;
      }
      const I = Pe({ jobId: t, documentId: a }) || `${((x = e.getConversationId) == null ? void 0 : x.call(e)) || ""}`.trim();
      if (I) {
        p(I), b.current = I, (Z = e.setConversationId) == null || Z.call(e, I, a);
        try {
          const M = await ht(I);
          if (s) return;
          const L = gt(M.messages || []);
          if (L.length) {
            at(L, M.head_id), requestAnimationFrame(() => {
              s || (R.current = !0);
            });
            return;
          }
        } catch {
        }
      }
      if (!s && a)
        try {
          const M = await kt({ document_id: a, limit: 50 });
          if (s) return;
          const L = M.conversations || [];
          T(L);
          const K = L[0];
          if (K != null && K.conversation_id) {
            const J = K.conversation_id;
            p(J), b.current = J, ($ = e.setConversationId) == null || $.call(e, J, a);
            try {
              const et = await ht(J);
              if (s) return;
              at(
                gt(et.messages || []),
                et.head_id
              ), requestAnimationFrame(() => {
                s || (R.current = !0);
              });
              return;
            } catch {
            }
          }
        } catch {
        }
      if (s) return;
      const D = Re(t, I);
      if (D != null && D.items.length) {
        const M = Xe(D);
        c(M.items), u(M.headId), S(vt(ot(M.items, M.headId)));
      } else
        c([]), u(null), S([]);
      requestAnimationFrame(() => {
        s || (R.current = !0);
      });
    })(), () => {
      s = !0;
    };
  }, [t, r, e, g, at, S]), nt(() => {
    if (!t || !R.current) return;
    const f = w, s = window.setTimeout(() => {
      if (!o.length) {
        lt(t, f);
        return;
      }
      wt(t, Nt(o, d), f);
    }, 280);
    return () => window.clearTimeout(s);
  }, [t, o, d, w]);
  const Wt = tt(
    () => ot(o, d),
    [o, d]
  ), Bt = tt(() => {
    var s;
    const f = {};
    for (const a of o) {
      const y = a.message;
      y.role === "assistant" && ((s = y.citations) != null && s.length) && (f[y.id] = y.citations);
    }
    return f;
  }, [o]), qt = tt(() => {
    const f = {};
    for (const s of o) {
      const a = s.message;
      a.role === "assistant" && a.progress && (f[a.id] = a.progress);
    }
    return f;
  }, [o]), jt = tt(() => {
    const f = {};
    for (const s of o) {
      const a = s.message;
      a.content && (f[a.id] = a.content);
    }
    return f;
  }, [o]);
  nt(() => {
    if (!Y.length) return;
    const f = new Map(Y.map((s) => [s.id, s]));
    c((s) => s.map((a) => {
      const y = f.get(a.message.id);
      if (!y) return a;
      const I = cn(y);
      return { ...a, message: { ...a.message, ...I } };
    }));
  }, [Y]), nt(() => {
    !V || m !== "error" || c((f) => f.map((s) => {
      var a;
      return ((a = s.message.status) == null ? void 0 : a.type) === "running" ? {
        ...s,
        message: {
          ...s.message,
          content: s.message.content.trim() || V.message || "生成回答失败，请重试。",
          progress: "",
          citations: [],
          status: { type: "incomplete", reason: "error" }
        }
      } : s;
    }));
  }, [V, m]);
  const Ot = j ? `${((_t = ln(Y)) == null ? void 0 : _t.id) || ""}` : "", Gt = Q(async (f) => {
    if (H.current) return;
    const s = `${f || ""}`.trim();
    if (!s) return;
    const a = B.current, y = Mt("u"), I = Mt("a");
    c((D) => [
      ...D,
      { parentId: a, message: { id: y, role: "user", content: s } },
      {
        parentId: y,
        message: {
          id: I,
          role: "assistant",
          content: "",
          progress: "正在检索文档…",
          status: { type: "running" },
          citations: []
        }
      }
    ]), u(I), await G(
      {
        id: y,
        role: "user",
        parts: [{ type: "text", text: s }]
      },
      {
        body: {
          assistantMessageId: I,
          parentId: a,
          question: s,
          regenerate: !1,
          userMessageId: y
        }
      }
    );
  }, [G]), Ht = Q(async (f) => {
    if (H.current) return;
    const s = z.current, a = s.find(
      ($) => $.message.id === f && $.message.role === "assistant"
    ), y = (a == null ? void 0 : a.parentId) ?? null, I = y ? Ze(s, y) : null;
    let D = "", O = y;
    if ((I == null ? void 0 : I.role) === "user")
      D = I.content.trim();
    else {
      const $ = ot(s, y ?? B.current);
      for (let M = $.length - 1; M >= 0; M -= 1)
        if ($[M].role === "user") {
          D = $[M].content.trim(), O = $[M].id;
          break;
        }
    }
    if (!D) return;
    const x = Mt("a"), Z = O || y;
    c(($) => [
      ...$,
      {
        parentId: Z,
        message: {
          id: x,
          role: "assistant",
          content: "",
          progress: "正在重新生成…",
          status: { type: "running" },
          citations: []
        }
      }
    ]), u(x), S(vt(ot(s, f))), await F({
      messageId: f,
      body: {
        assistantMessageId: x,
        parentId: Z,
        question: D,
        regenerate: !0,
        userMessageId: O || ""
      }
    });
  }, [F, S]), Kt = Q(async () => {
    await _(), c(
      (f) => f.map(
        (s) => {
          var a;
          return ((a = s.message.status) == null ? void 0 : a.type) === "running" ? {
            ...s,
            message: {
              ...s.message,
              status: { type: "incomplete", reason: "cancelled" },
              progress: "",
              content: s.message.content.trim() || "已取消"
            }
          } : s;
        }
      )
    );
  }, [_]), Yt = Q(async () => {
    var s, a;
    if (v) return;
    H.current && await _(), ct(900), st(900), N(!0), l("");
    const f = ++h.current;
    try {
      if (await new Promise((I) => {
        window.setTimeout(I, 40);
      }), f !== h.current) return;
      const y = k.current || `${await ((s = e == null ? void 0 : e.getDocumentId) == null ? void 0 : s.call(e)) || ""}`.trim();
      k.current = y, (a = e == null ? void 0 : e.clearConversationId) == null || a.call(e, y), p(""), b.current = "", c([]), u(null), S([]), lt(t), y && await g(y);
    } catch (y) {
      console.warn("[reader-ai] new session failed", y), l("无法创建新对话，请重试。");
    } finally {
      f === h.current && N(!1);
    }
  }, [t, e, g, v, S, _]), Vt = Q(async (f) => {
    var I, D, O, x, Z, $, M;
    const s = `${f || ""}`.trim(), a = b.current || ((I = e == null ? void 0 : e.getConversationId) == null ? void 0 : I.call(e)) || "";
    if (!s || s === a || v) return;
    H.current && await _(), ct(1200), st(1200), N(!0), l("");
    const y = ++h.current;
    p(s), b.current = s, c([]), u(null), S([]);
    try {
      if (await new Promise((et) => {
        window.setTimeout(et, 80);
      }), y !== h.current) return;
      try {
        (x = (O = (D = globalThis.document) == null ? void 0 : D.activeElement) == null ? void 0 : O.blur) == null || x.call(O);
      } catch {
      }
      const L = k.current || `${await ((Z = e == null ? void 0 : e.getDocumentId) == null ? void 0 : Z.call(e)) || ""}`.trim();
      k.current = L;
      const K = await ht(s);
      if (y !== h.current) return;
      ct(800), st(800);
      const J = gt(K.messages || []);
      if (at(J, K.head_id), ($ = e == null ? void 0 : e.setConversationId) == null || $.call(e, s, L), J.length) {
        const et = Ct(J);
        wt(
          t,
          Nt(
            et,
            `${K.head_id || ""}`.trim() || ((M = et.at(-1)) == null ? void 0 : M.message.id) || null
          ),
          s
        );
      } else
        lt(t, s);
      L && await g(L), ct(350), st(350);
    } catch (L) {
      console.warn("[reader-ai] switch session failed", L), y === h.current && (l("加载该对话失败，请检查网络后重试。"), c([]), u(null));
    } finally {
      y === h.current && N(!1);
    }
  }, [
    at,
    t,
    e,
    g,
    v,
    S,
    _
  ]), Jt = Q(async (f) => {
    var I, D, O, x, Z;
    const s = `${f || ""}`.trim();
    if (!s)
      return l("无法分支：消息 id 无效。"), !1;
    if (v)
      return l("请稍候，当前有会话操作进行中。"), !1;
    H.current && await _();
    const a = tn(z.current, s, B.current);
    if (!a.length)
      return l("无法分支：找不到到此答案的对话路径。"), !1;
    if (a[a.length - 1].message.role !== "assistant")
      return l("只能从助手答案处开新对话。"), !1;
    N(!0), l("");
    try {
      await new Promise((U) => {
        window.setTimeout(U, 40);
      });
      let $ = k.current || `${await ((I = e == null ? void 0 : e.getDocumentId) == null ? void 0 : I.call(e)) || ""}`.trim();
      if (k.current = $, !$)
        try {
          $ = `${await ((D = e == null ? void 0 : e.getDocumentId) == null ? void 0 : D.call(e)) || ""}`.trim(), k.current = $;
        } catch {
          $ = "";
        }
      if (!$)
        return l("无法分支：文档未就绪，请稍后重试。"), !1;
      const M = a.map((U, pt) => ({
        id: U.message.id,
        role: U.message.role,
        content: U.message.content,
        citations: U.message.citations,
        parentId: pt === 0 ? null : a[pt - 1].message.id
      })), L = b.current || ((O = e == null ? void 0 : e.getConversationId) == null ? void 0 : O.call(e)) || "", K = (C || []).find((U) => U.conversation_id === L), J = M.find((U) => U.role === "user"), et = `${(K == null ? void 0 : K.title) || ""}`.trim() || `${(J == null ? void 0 : J.content) || ""}`.replace(/\s+/g, " ").trim() || "未命名对话", Zt = (C || []).map((U) => U.title || ""), xt = Se(et, Zt), ut = await De({
        documentId: $,
        title: xt,
        path: M
      }), it = Ct(ut.items), ft = ((x = it[it.length - 1]) == null ? void 0 : x.message.id) || null, rt = ut.conversation.conversation_id;
      if (!rt || !it.length)
        throw new Error("fork returned empty conversation");
      return ct(600), st(600), c(it), u(ft), S(vt(ot(it, ft))), p(rt), b.current = rt, (Z = e == null ? void 0 : e.setConversationId) == null || Z.call(e, rt, $), T((U) => {
        const pt = {
          conversation_id: rt,
          title: xt,
          document_id: $,
          created_at: ut.conversation.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: ut.conversation.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
          message_count: it.length,
          head_id: ft || ""
        }, At = U.filter((te) => te.conversation_id !== rt);
        return [pt, ...At];
      }), wt(
        t,
        Nt(it, ft),
        rt
      ), await g($), !0;
    } catch ($) {
      return console.warn("[reader-ai] branch from answer failed", $), l("分支失败：未能复制上文到新对话。请检查网络后重试。"), !1;
    } finally {
      N(!1);
    }
  }, [t, e, g, v, C, S, _]), Qt = Q(async (f) => {
    var y, I, D, O;
    const s = `${f || ""}`.trim();
    if (!s || v) return;
    H.current && await _(), N(!0), l("");
    const a = ++h.current;
    try {
      const x = k.current || `${await ((y = e == null ? void 0 : e.getDocumentId) == null ? void 0 : y.call(e)) || ""}`.trim();
      k.current = x;
      try {
        await Le(s);
      } catch (M) {
        if ((Number(M == null ? void 0 : M.status) || 0) !== 404) throw M;
      }
      lt(t, s);
      const $ = (b.current || ((I = e == null ? void 0 : e.getConversationId) == null ? void 0 : I.call(e)) || "") === s;
      if (T((M) => M.filter((L) => L.conversation_id !== s)), $) {
        (D = e == null ? void 0 : e.clearConversationId) == null || D.call(e, x), p(""), b.current = "", c([]), u(null), S([]), lt(t);
        const M = x ? (await kt({ document_id: x, limit: 50 }).catch(
          () => ({ conversations: [] })
        )).conversations || [] : [];
        if (a !== h.current) return;
        T(M);
        const L = M[0];
        if (L != null && L.conversation_id) {
          const K = L.conversation_id;
          p(K), b.current = K;
          try {
            const J = await ht(K);
            if (a !== h.current) return;
            at(
              gt(J.messages || []),
              J.head_id
            ), (O = e == null ? void 0 : e.setConversationId) == null || O.call(e, K, x);
          } catch {
            c([]), u(null);
          }
        }
      } else x && await g(x);
    } catch (x) {
      console.warn("[reader-ai] delete session failed", x), l("删除对话失败，请重试。");
    } finally {
      a === h.current && N(!1);
    }
  }, [at, t, e, g, v, S, _]), Ut = Q(async (f, s) => {
    const a = `${f || ""}`.trim(), y = `${s || ""}`.replace(/\s+/g, " ").trim();
    if (!(!a || !y || v)) {
      N(!0), l("");
      try {
        const I = y.slice(0, 80);
        await ze(a, { title: I }), T(
          (O) => O.map(
            (x) => x.conversation_id === a ? { ...x, title: I } : x
          )
        );
        const D = k.current;
        D && await g(D);
      } catch (I) {
        console.warn("[reader-ai] rename session failed", I), l("重命名失败，请重试。");
      } finally {
        N(!1);
      }
    }
  }, [g, v]), Tt = X(!1);
  nt(() => {
    var f;
    if (Tt.current && !j) {
      const s = k.current;
      s && g(s);
      const a = ((f = e == null ? void 0 : e.getConversationId) == null ? void 0 : f.call(e)) || "";
      a && p(a);
    }
    Tt.current = j;
  }, [j, e, g]);
  const Xt = tt(() => {
    var s;
    const f = w || ((s = e == null ? void 0 : e.getConversationId) == null ? void 0 : s.call(e)) || "";
    return (C || []).map((a) => ({
      id: a.conversation_id,
      title: `${a.title || ""}`.trim() || "未命名对话",
      updatedAt: a.updated_at || "",
      messageCount: Number(a.message_count) || 0,
      active: a.conversation_id === f
    }));
  }, [C, w, e]);
  return {
    citationsByMessageId: Bt,
    progressByMessageId: qt,
    contentByMessageId: jt,
    streamingAssistantId: Ot,
    isRunning: j,
    messages: Wt,
    sessions: Xt,
    activeConversationId: w || (($t = e == null ? void 0 : e.getConversationId) == null ? void 0 : $t.call(e)) || "",
    sessionBusy: v,
    sessionError: P,
    submitQuestion: Gt,
    retryAnswer: Ht,
    cancelAnswer: Kt,
    newSession: Yt,
    switchSession: Vt,
    removeSession: Qt,
    renameSession: Ut,
    branchFromAnswer: Jt
  };
}
function Mn({
  open: n,
  jobId: t,
  onClose: r,
  onJumpCitation: o,
  layout: c = "floating"
}) {
  const d = n && !!t, {
    citationsByMessageId: u,
    progressByMessageId: C,
    contentByMessageId: T,
    streamingAssistantId: w,
    isRunning: p,
    sessions: v,
    activeConversationId: N,
    sessionBusy: P,
    sessionError: l,
    messages: z,
    submitQuestion: B,
    retryAnswer: b,
    cancelAnswer: R,
    newSession: q,
    switchSession: k,
    removeSession: h,
    renameSession: e,
    branchFromAnswer: E
  } = un({
    jobId: t,
    enabled: d
  }), [V, Y] = A(""), F = Q(async (S) => {
    Y(""), await E(S) && (Y(
      "已保存新对话（fork-n-原名）：复制了到此答案的上文，原对话不变。顶部列表可切换。"
    ), window.setTimeout(() => Y(""), 6e3));
  }, [E]), G = Q((S) => {
    ke() || o(S);
  }, [o]);
  return /* @__PURE__ */ i(
    ye,
    {
      id: "reader-ai-panel",
      open: n,
      title: "RetainPDF AI",
      subtitle: "当前文档",
      titleIcon: /* @__PURE__ */ i(It, { size: 14, strokeWidth: 2.1, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.ai-float.pos.v2",
      ariaLabel: "阅读问答",
      width: 420,
      placement: c === "docked" ? "dock-right" : "floating",
      className: `reader-float-ai is-${c}${P ? " is-session-busy" : ""}`,
      onClose: r,
      children: t ? /* @__PURE__ */ W("div", { className: "reader-float-ai-body", children: [
        /* @__PURE__ */ i(
          Ue,
          {
            sessions: v,
            activeId: N,
            busy: P,
            errorText: l,
            onSwitch: k,
            onNew: q,
            onDelete: h,
            onRename: e
          }
        ),
        V ? /* @__PURE__ */ i("div", { className: "aui-session-banner", role: "status", children: V }) : null,
        /* @__PURE__ */ i("div", { className: "reader-float-ai-thread-wrap", "aria-busy": P || void 0, children: /* @__PURE__ */ i(
          Qe,
          {
            jobId: t,
            messages: z,
            citationsByMessageId: u,
            progressByMessageId: C,
            contentByMessageId: T,
            streamingAssistantId: w,
            isRunning: p,
            onSubmit: B,
            onRetry: b,
            onCancel: R,
            onJumpCitation: G,
            onBranchFromAnswer: F,
            branchBusy: P
          }
        ) })
      ] }) : /* @__PURE__ */ W("div", { className: "reader-float-ai-empty", children: [
        /* @__PURE__ */ i(It, { size: 22, strokeWidth: 1.75, "aria-hidden": !0 }),
        /* @__PURE__ */ i("p", { children: "当前文档还没有可用于问答的 Markdown" }),
        /* @__PURE__ */ i("span", { children: "请先完成 OCR 文档解析" })
      ] })
    }
  );
}
export {
  Mn as ReaderAiPanel
};
//# sourceMappingURL=ReaderAiPanel-D1GRG7RE.js.map
