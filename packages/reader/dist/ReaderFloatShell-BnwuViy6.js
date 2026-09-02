import { jsxs as y, jsx as u } from "react/jsx-runtime";
import { useState as N, useRef as z, useEffect as P, useCallback as b } from "react";
import { GripHorizontal as H, X as L } from "lucide-react";
const c = 12, $ = 4;
function m(o, r, l) {
  if (typeof window > "u") return { x: o, y: r };
  const s = Math.min(l, window.innerWidth - c * 2), x = Math.max(c, window.innerWidth - s - c), p = Math.min(window.innerHeight * 0.9, 860), w = Math.max(c, window.innerHeight - p - c);
  return {
    x: Math.min(x, Math.max(c, o)),
    y: Math.min(w, Math.max(c, r))
  };
}
function X(o) {
  if (typeof window > "u") return { x: 24, y: 72 };
  const r = Math.min(o, window.innerWidth - c * 2);
  return m(window.innerWidth - r - 20, 72, o);
}
function C(o, r) {
  try {
    const l = localStorage.getItem(o);
    if (!l) return X(r);
    const s = JSON.parse(l);
    if (typeof s.x == "number" && typeof s.y == "number")
      return m(s.x, s.y, r);
  } catch {
  }
  return X(r);
}
function G(o, r) {
  try {
    localStorage.setItem(o, JSON.stringify(r));
  } catch {
  }
}
function J({
  id: o,
  open: r,
  title: l,
  subtitle: s = "拖动标题可移动",
  titleIcon: x,
  storageKey: p,
  ariaLabel: w,
  className: D = "",
  width: i = 360,
  placement: R = "floating",
  onClose: M,
  toolbar: k,
  children: S
}) {
  const a = R === "dock-right", [f, g] = N(() => C(p, i)), [W, I] = N(!1), h = z(null);
  P(() => {
    !r || a || g((e) => m(e.x, e.y, i));
  }, [a, r, i]), P(() => {
    if (!r || a) return;
    const e = () => g((n) => m(n.x, n.y, i));
    return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
  }, [a, r, i]), P(() => {
    if (!r) return;
    const e = (n) => {
      var d;
      if (n.key !== "Escape") return;
      const t = n.target;
      (d = t == null ? void 0 : t.closest) != null && d.call(t, "textarea, input, select, [contenteditable='true']") || (n.preventDefault(), M());
    };
    return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
  }, [r, M]);
  const Y = b((e) => {
    var n, t;
    a || e.button === 0 && ((t = (n = e.target) == null ? void 0 : n.closest) != null && t.call(n, "button") || (e.currentTarget.setPointerCapture(e.pointerId), h.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: f.x,
      originY: f.y,
      moved: !1
    }, I(!0)));
  }, [a, f.x, f.y]), v = b((e) => {
    const n = h.current;
    if (!n || n.pointerId !== e.pointerId) return;
    const t = e.clientX - n.startX, d = e.clientY - n.startY;
    !n.moved && Math.hypot(t, d) < $ || (n.moved = !0, g(m(n.originX + t, n.originY + d, i)));
  }, [i]), E = b((e) => {
    const n = h.current;
    if (!(!n || n.pointerId !== e.pointerId)) {
      h.current = null, I(!1);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
      }
      n.moved && g((t) => {
        const d = m(t.x, t.y, i);
        return G(p, d), d;
      });
    }
  }, [p, i]);
  return r ? /* @__PURE__ */ y(
    "aside",
    {
      id: o,
      className: `reader-notes-panel reader-notes-panel--${a ? "docked" : "float"}${a ? "" : " reader-floating-surface"}${W ? " is-dragging" : ""} ${D}`.trim(),
      style: a ? void 0 : { left: f.x, top: f.y, width: Math.min(i, typeof window < "u" ? window.innerWidth - 24 : i) },
      "aria-label": w,
      role: "dialog",
      "aria-modal": "false",
      children: [
        /* @__PURE__ */ y(
          "header",
          {
            className: "reader-notes-panel-head",
            onPointerDown: Y,
            onPointerMove: v,
            onPointerUp: E,
            onPointerCancel: E,
            children: [
              a ? null : /* @__PURE__ */ u("div", { className: "reader-notes-panel-drag", "aria-hidden": "true", children: /* @__PURE__ */ u(H, { size: 14, strokeWidth: 2.25 }) }),
              /* @__PURE__ */ y("div", { className: "reader-notes-panel-head-text", children: [
                /* @__PURE__ */ y("strong", { children: [
                  x,
                  l
                ] }),
                s ? /* @__PURE__ */ u("span", { children: s }) : null
              ] }),
              /* @__PURE__ */ u("button", { type: "button", className: "reader-notes-close reader-floating-close", "aria-label": `关闭${l}`, onClick: M, children: /* @__PURE__ */ u(L, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 }) })
            ]
          }
        ),
        k ? /* @__PURE__ */ u("div", { className: "reader-notes-panel-toolbar", children: k }) : null,
        /* @__PURE__ */ u("div", { className: "reader-notes-panel-body", children: S })
      ]
    }
  ) : null;
}
export {
  J as R
};
//# sourceMappingURL=ReaderFloatShell-BnwuViy6.js.map
