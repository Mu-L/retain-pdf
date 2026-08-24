import { jsx as e, jsxs as a, Fragment as N } from "react/jsx-runtime";
import { useState as p, useEffect as f } from "react";
import { StickyNote as b } from "lucide-react";
import { R as k } from "./ReaderFloatShell-BLGUpWw5.js";
function y({
  note: t,
  onJump: c,
  onUpdateNote: s,
  onRemove: m
}) {
  const [n, r] = p(!1), [o, i] = p(t.note);
  return f(() => {
    n || i(t.note);
  }, [t.note, n]), /* @__PURE__ */ a("article", { className: "reader-notes-item", children: [
    /* @__PURE__ */ a("div", { className: "reader-notes-item-top", children: [
      /* @__PURE__ */ e("span", { className: "reader-notes-kind", children: t.pane === "translated" ? "译文" : "原文" }),
      /* @__PURE__ */ a("div", { className: "reader-notes-item-actions", children: [
        /* @__PURE__ */ e("button", { type: "button", className: "reader-notes-link", onClick: () => c(t), children: "定位" }),
        /* @__PURE__ */ e("button", { type: "button", className: "reader-notes-danger", onClick: () => m(t.id), children: "删除" })
      ] })
    ] }),
    /* @__PURE__ */ e("p", { className: "reader-notes-quote", children: t.quote }),
    n ? /* @__PURE__ */ a("div", { className: "reader-notes-editor", children: [
      /* @__PURE__ */ e(
        "textarea",
        {
          className: "reader-notes-textarea",
          value: o,
          placeholder: "写点想法…",
          rows: 3,
          onChange: (l) => i(l.target.value)
        }
      ),
      /* @__PURE__ */ a("div", { className: "reader-notes-editor-actions", children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "reader-notes-primary",
            onClick: () => {
              s(t.id, o), r(!1);
            },
            children: "保存"
          }
        ),
        /* @__PURE__ */ e("button", { type: "button", className: "reader-notes-link", onClick: () => r(!1), children: "取消" })
      ] })
    ] }) : t.note ? /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        className: "reader-notes-note",
        onClick: () => r(!0),
        title: "点击编辑",
        children: t.note
      }
    ) : /* @__PURE__ */ e("button", { type: "button", className: "reader-notes-add-note", onClick: () => r(!0), children: "添加笔记" })
  ] });
}
function w({
  open: t,
  groups: c,
  count: s,
  onClose: m,
  onJump: n,
  onUpdateNote: r,
  onRemove: o,
  onExport: i
}) {
  const [l, u] = p(!1);
  return /* @__PURE__ */ e(
    k,
    {
      id: "reader-notes-panel",
      open: t,
      title: "批注",
      subtitle: "选中 PDF 文字后可添加 · 本地保存",
      titleIcon: /* @__PURE__ */ e(b, { size: 14, strokeWidth: 2.25, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.notes-float.pos.v1",
      ariaLabel: "批注",
      onClose: m,
      toolbar: /* @__PURE__ */ a(N, { children: [
        /* @__PURE__ */ a("span", { className: "reader-notes-count", children: [
          s,
          " 条"
        ] }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: "reader-notes-export",
            disabled: l || s === 0,
            onClick: async () => {
              await i() && (u(!0), window.setTimeout(() => u(!1), 1800));
            },
            children: l ? "已复制" : "导出 Markdown"
          }
        )
      ] }),
      children: s === 0 ? /* @__PURE__ */ e("p", { className: "reader-notes-empty", children: "暂无批注。在 PDF 上拖选文字，点「添加批注」。" }) : c.map((d) => /* @__PURE__ */ a("section", { className: "reader-notes-group", children: [
        /* @__PURE__ */ a("h3", { className: "reader-notes-group-title", children: [
          "第 ",
          d.page,
          " 页"
        ] }),
        d.items.map((h) => /* @__PURE__ */ e(
          y,
          {
            note: h,
            onJump: n,
            onUpdateNote: r,
            onRemove: o
          },
          h.id
        ))
      ] }, d.page))
    }
  );
}
export {
  w as ReaderNotesPanel
};
//# sourceMappingURL=ReaderNotesPanel-QwL6XQP7.js.map
