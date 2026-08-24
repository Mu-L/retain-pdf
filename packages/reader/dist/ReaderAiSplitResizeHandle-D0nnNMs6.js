var Ae = (e) => {
  throw TypeError(e);
};
var Oe = (e, t, n) => t.has(e) || Ae("Cannot " + n);
var ae = (e, t, n) => (Oe(e, t, "read from private field"), n ? n.call(e) : t.get(e)), Fe = (e, t, n) => t.has(e) ? Ae("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Ge = (e, t, n, r) => (Oe(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
import { jsx as $, jsxs as Lt } from "react/jsx-runtime";
import { useRef as N, useMemo as Et, useEffect as me, useSyncExternalStore as Mt, useState as se, useCallback as ve, useId as kt, useImperativeHandle as nt, useLayoutEffect as rt, createContext as Rt, useContext as Dt } from "react";
function It(e, t) {
  const n = getComputedStyle(e), r = parseFloat(n.fontSize);
  return t * r;
}
function Tt(e, t) {
  const n = getComputedStyle(e.ownerDocument.documentElement), r = parseFloat(n.fontSize);
  return t * r;
}
function Nt(e) {
  return e / 100 * window.innerHeight;
}
function At(e) {
  return e / 100 * window.innerWidth;
}
function Ot(e) {
  switch (typeof e) {
    case "number":
      return [e, "px"];
    case "string": {
      const t = parseFloat(e);
      return e.endsWith("%") ? [t, "%"] : e.endsWith("px") ? [t, "px"] : e.endsWith("rem") ? [t, "rem"] : e.endsWith("em") ? [t, "em"] : e.endsWith("vh") ? [t, "vh"] : e.endsWith("vw") ? [t, "vw"] : [t, "%"];
    }
  }
}
function ie({
  groupSize: e,
  panelElement: t,
  styleProp: n
}) {
  let r;
  const [o, a] = Ot(n);
  switch (a) {
    case "%": {
      r = o / 100 * e;
      break;
    }
    case "px": {
      r = o;
      break;
    }
    case "rem": {
      r = Tt(t, o);
      break;
    }
    case "em": {
      r = It(t, o);
      break;
    }
    case "vh": {
      r = Nt(o);
      break;
    }
    case "vw": {
      r = At(o);
      break;
    }
  }
  return r;
}
function I(e) {
  return parseFloat(e.toFixed(3));
}
function ne({
  group: e
}) {
  const { orientation: t, panels: n } = e;
  return n.reduce((r, o) => (r += t === "horizontal" ? o.element.offsetWidth : o.element.offsetHeight, r), 0);
}
function ze(e) {
  const { panels: t } = e, n = ne({ group: e });
  return n === 0 ? t.map((r) => ({
    groupResizeBehavior: r.panelConstraints.groupResizeBehavior,
    collapsedSize: 0,
    collapsible: r.panelConstraints.collapsible === !0,
    defaultSize: void 0,
    disabled: r.panelConstraints.disabled,
    minSize: 0,
    maxSize: 100,
    panelId: r.id
  })) : t.map((r) => {
    const { element: o, panelConstraints: a } = r;
    let u = 0;
    if (a.collapsedSize !== void 0) {
      const c = ie({
        groupSize: n,
        panelElement: o,
        styleProp: a.collapsedSize
      });
      u = I(c / n * 100);
    }
    let s;
    if (a.defaultSize !== void 0) {
      const c = ie({
        groupSize: n,
        panelElement: o,
        styleProp: a.defaultSize
      });
      s = I(c / n * 100);
    }
    let i = 0;
    if (a.minSize !== void 0) {
      const c = ie({
        groupSize: n,
        panelElement: o,
        styleProp: a.minSize
      });
      i = I(c / n * 100);
    }
    let l = 100;
    if (a.maxSize !== void 0) {
      const c = ie({
        groupSize: n,
        panelElement: o,
        styleProp: a.maxSize
      });
      l = I(c / n * 100);
    }
    return {
      groupResizeBehavior: a.groupResizeBehavior,
      collapsedSize: u,
      collapsible: a.collapsible === !0,
      defaultSize: s,
      disabled: a.disabled,
      minSize: i,
      maxSize: l,
      panelId: r.id
    };
  });
}
function P(e, t = "Assertion error") {
  if (!e)
    throw Error(t);
}
function we(e, t) {
  return Array.from(t).sort(
    e === "horizontal" ? Ft : Gt
  );
}
function Ft(e, t) {
  const n = e.element.offsetLeft - t.element.offsetLeft;
  return n !== 0 ? n : e.element.offsetWidth - t.element.offsetWidth;
}
function Gt(e, t) {
  const n = e.element.offsetTop - t.element.offsetTop;
  return n !== 0 ? n : e.element.offsetHeight - t.element.offsetHeight;
}
function ot(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.ELEMENT_NODE;
}
function at(e, t) {
  return {
    x: e.x >= t.left && e.x <= t.right ? 0 : Math.min(
      Math.abs(e.x - t.left),
      Math.abs(e.x - t.right)
    ),
    y: e.y >= t.top && e.y <= t.bottom ? 0 : Math.min(
      Math.abs(e.y - t.top),
      Math.abs(e.y - t.bottom)
    )
  };
}
function jt({
  orientation: e,
  rects: t,
  targetRect: n
}) {
  const r = {
    x: n.x + n.width / 2,
    y: n.y + n.height / 2
  };
  let o, a = Number.MAX_VALUE;
  for (const u of t) {
    const { x: s, y: i } = at(r, u), l = e === "horizontal" ? s : i;
    l < a && (a = l, o = u);
  }
  return P(o, "No rect found"), o;
}
let pe;
function Bt() {
  return pe === void 0 && (typeof matchMedia == "function" ? pe = !!matchMedia("(pointer:coarse)").matches : pe = !1), pe;
}
function it(e) {
  const { element: t, orientation: n, panels: r, separators: o } = e, a = we(
    n,
    Array.from(t.children).filter(ot).map((m) => ({ element: m }))
  ).map(({ element: m }) => m), u = [];
  let s = !1, i = !1, l = -1, c = -1, h = 0, d, z = [];
  {
    let m = -1;
    for (const f of a)
      f.hasAttribute("data-panel") && (m++, f.hasAttribute("data-disabled") || (h++, l === -1 && (l = m), c = m));
  }
  if (h > 1) {
    let m = -1;
    for (const f of a)
      if (f.hasAttribute("data-panel")) {
        m++;
        const g = r.find(
          (p) => p.element === f
        );
        if (g) {
          if (d) {
            const p = d.element.getBoundingClientRect(), y = f.getBoundingClientRect();
            let S;
            if (i) {
              const b = n === "horizontal" ? new DOMRect(
                p.right,
                p.top,
                0,
                p.height
              ) : new DOMRect(
                p.left,
                p.bottom,
                p.width,
                0
              ), v = n === "horizontal" ? new DOMRect(y.left, y.top, 0, y.height) : new DOMRect(y.left, y.top, y.width, 0);
              switch (z.length) {
                case 0: {
                  S = [
                    b,
                    v
                  ];
                  break;
                }
                case 1: {
                  const L = z[0], E = jt({
                    orientation: n,
                    rects: [p, y],
                    targetRect: L.element.getBoundingClientRect()
                  });
                  S = [
                    L,
                    E === p ? v : b
                  ];
                  break;
                }
                default: {
                  S = z;
                  break;
                }
              }
            } else
              z.length ? S = z : S = [
                n === "horizontal" ? new DOMRect(
                  p.right,
                  y.top,
                  y.left - p.right,
                  y.height
                ) : new DOMRect(
                  y.left,
                  p.bottom,
                  y.width,
                  y.top - p.bottom
                )
              ];
            for (const b of S) {
              let v = "width" in b ? b : b.element.getBoundingClientRect();
              const L = Bt() ? e.resizeTargetMinimumSize.coarse : e.resizeTargetMinimumSize.fine;
              if (v.width < L) {
                const k = L - v.width;
                v = new DOMRect(
                  v.x - k / 2,
                  v.y,
                  v.width + k,
                  v.height
                );
              }
              if (v.height < L) {
                const k = L - v.height;
                v = new DOMRect(
                  v.x,
                  v.y - k / 2,
                  v.width,
                  v.height + k
                );
              }
              const E = m <= l || m > c;
              !s && !E && u.push({
                group: e,
                groupSize: ne({ group: e }),
                panels: [d, g],
                separator: "width" in b ? void 0 : b,
                rect: v
              }), s = !1;
            }
          }
          i = !1, d = g, z = [];
        }
      } else if (f.hasAttribute("data-separator")) {
        f.ariaDisabled !== null && (s = !0);
        const g = o.find(
          (p) => p.element === f
        );
        g ? z.push(g) : (d = void 0, z = []);
      } else
        i = !0;
  }
  return u;
}
var U;
class st {
  constructor() {
    Fe(this, U, {});
  }
  addListener(t, n) {
    const r = ae(this, U)[t];
    return r === void 0 ? ae(this, U)[t] = [n] : r.includes(n) || r.push(n), () => {
      this.removeListener(t, n);
    };
  }
  emit(t, n) {
    const r = ae(this, U)[t];
    if (r !== void 0)
      if (r.length === 1)
        r[0].call(null, n);
      else {
        let o = !1, a = null;
        const u = Array.from(r);
        for (let s = 0; s < u.length; s++) {
          const i = u[s];
          try {
            i.call(null, n);
          } catch (l) {
            a === null && (o = !0, a = l);
          }
        }
        if (o)
          throw a;
      }
  }
  removeAllListeners() {
    Ge(this, U, {});
  }
  removeListener(t, n) {
    const r = ae(this, U)[t];
    if (r !== void 0) {
      const o = r.indexOf(n);
      o >= 0 && r.splice(o, 1);
    }
  }
}
U = new WeakMap();
let ee = {
  cursorFlags: 0,
  state: "inactive"
};
const Ce = new st();
function _() {
  return ee;
}
function $t(e) {
  return Ce.addListener("change", e);
}
function Wt(e) {
  const t = ee, n = { ...ee };
  n.cursorFlags = e, ee = n, Ce.emit("change", {
    prev: t,
    next: n
  });
}
function te(e) {
  const t = ee;
  ee = e, Ce.emit("change", {
    prev: t,
    next: e
  });
}
const Ut = (e) => e, be = () => {
}, lt = 1, ut = 2, ct = 4, dt = 8, je = 3, Be = 12;
let he;
function $e() {
  return he === void 0 && (he = !1, typeof window < "u" && (window.navigator.userAgent.includes("Chrome") || window.navigator.userAgent.includes("Firefox")) && (he = !0)), he;
}
function Ht({
  cursorFlags: e,
  groups: t,
  state: n
}) {
  let r = 0, o = 0;
  switch (n) {
    case "active":
    case "hover":
      t.forEach((a) => {
        if (!a.mutableState.disableCursor)
          switch (a.orientation) {
            case "horizontal": {
              r++;
              break;
            }
            case "vertical": {
              o++;
              break;
            }
          }
      });
  }
  if (!(r === 0 && o === 0)) {
    switch (n) {
      case "active": {
        if (e && $e()) {
          const a = (e & lt) !== 0, u = (e & ut) !== 0, s = (e & ct) !== 0, i = (e & dt) !== 0;
          if (a)
            return s ? "se-resize" : i ? "ne-resize" : "e-resize";
          if (u)
            return s ? "sw-resize" : i ? "nw-resize" : "w-resize";
          if (s)
            return "s-resize";
          if (i)
            return "n-resize";
        }
        break;
      }
    }
    return $e() ? r > 0 && o > 0 ? "move" : r > 0 ? "ew-resize" : "ns-resize" : r > 0 && o > 0 ? "grab" : r > 0 ? "col-resize" : "row-resize";
  }
}
const We = /* @__PURE__ */ new WeakMap();
function Pe(e) {
  if (e.defaultView === null || e.defaultView === void 0)
    return;
  let { prevStyle: t, styleSheet: n } = We.get(e) ?? {};
  n === void 0 && (n = new e.defaultView.CSSStyleSheet(), e.adoptedStyleSheets && (Object.isExtensible(e.adoptedStyleSheets) ? e.adoptedStyleSheets.push(n) : e.adoptedStyleSheets = [
    ...e.adoptedStyleSheets,
    n
  ]));
  const r = _();
  switch (r.state) {
    case "active":
    case "hover": {
      const o = Ht({
        cursorFlags: r.cursorFlags,
        groups: r.hitRegions.map((u) => u.group),
        state: r.state
      }), a = `*, *:hover {cursor: ${o} !important; }`;
      if (t === a)
        return;
      t = a, o ? n.cssRules.length === 0 ? n.insertRule(a) : n.replaceSync(a) : n.cssRules.length === 1 && n.deleteRule(0);
      break;
    }
    case "inactive": {
      t = void 0, n.cssRules.length === 1 && n.deleteRule(0);
      break;
    }
  }
  We.set(e, {
    prevStyle: t,
    styleSheet: n
  });
}
let F = /* @__PURE__ */ new Map();
const ft = new st();
function Vt(e) {
  F = new Map(F), F.delete(e);
}
function Ue(e, t) {
  for (const [n] of F)
    if (n.id === e)
      return n;
}
function H(e, t) {
  for (const [n, r] of F)
    if (n.id === e)
      return r;
  if (t)
    throw Error(`Could not find data for Group with id ${e}`);
}
function J() {
  return F;
}
function Le(e, t) {
  return ft.addListener("groupChange", (n) => {
    n.group.id === e && t(n);
  });
}
function W(e, t, n) {
  const r = F.get(e);
  F = new Map(F), F.set(e, t), ft.emit("groupChange", {
    group: e,
    isUserInteraction: (n == null ? void 0 : n.isUserInteraction) === !0,
    prev: r,
    next: t
  });
}
function pt(e) {
  const t = _();
  let n = !1;
  switch (t.state) {
    case "active":
      te({
        cursorFlags: 0,
        state: "inactive"
      }), t.hitRegions.length > 0 && (Pe(e), n = !0, t.hitRegions.forEach((r) => {
        const o = H(r.group.id, !0);
        W(r.group, o, {
          isUserInteraction: !0
        });
      }));
  }
  return n;
}
function He(e) {
  e.defaultPrevented || pt(e.currentTarget);
}
function _t(e, t, n) {
  let r, o = {
    x: 1 / 0,
    y: 1 / 0
  };
  for (const a of t) {
    const u = at(n, a.rect);
    switch (e) {
      case "horizontal": {
        u.x <= o.x && (r = a, o = u);
        break;
      }
      case "vertical": {
        u.y <= o.y && (r = a, o = u);
        break;
      }
    }
  }
  return r ? {
    distance: o,
    hitRegion: r
  } : void 0;
}
function Yt(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
function Xt(e, t) {
  if (e === t) throw new Error("Cannot compare node with itself");
  const n = {
    a: Ye(e),
    b: Ye(t)
  };
  let r;
  for (; n.a.at(-1) === n.b.at(-1); )
    r = n.a.pop(), n.b.pop();
  P(
    r,
    "Stacking order can only be calculated for elements with a common ancestor"
  );
  const o = {
    a: _e(Ve(n.a)),
    b: _e(Ve(n.b))
  };
  if (o.a === o.b) {
    const a = r.childNodes, u = {
      a: n.a.at(-1),
      b: n.b.at(-1)
    };
    let s = a.length;
    for (; s--; ) {
      const i = a[s];
      if (i === u.a) return 1;
      if (i === u.b) return -1;
    }
  }
  return Math.sign(o.a - o.b);
}
const Jt = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;
function Kt(e) {
  const t = getComputedStyle(ht(e) ?? e).display;
  return t === "flex" || t === "inline-flex";
}
function qt(e) {
  const t = getComputedStyle(e);
  return !!(t.position === "fixed" || t.zIndex !== "auto" && (t.position !== "static" || Kt(e)) || +t.opacity < 1 || "transform" in t && t.transform !== "none" || "webkitTransform" in t && t.webkitTransform !== "none" || "mixBlendMode" in t && t.mixBlendMode !== "normal" || "filter" in t && t.filter !== "none" || "webkitFilter" in t && t.webkitFilter !== "none" || "isolation" in t && t.isolation === "isolate" || Jt.test(t.willChange) || t.webkitOverflowScrolling === "touch");
}
function Ve(e) {
  let t = e.length;
  for (; t--; ) {
    const n = e[t];
    if (P(n, "Missing node"), qt(n)) return n;
  }
  return null;
}
function _e(e) {
  return e && Number(getComputedStyle(e).zIndex) || 0;
}
function Ye(e) {
  const t = [];
  for (; e; )
    t.push(e), e = ht(e);
  return t;
}
function ht(e) {
  const { parentNode: t } = e;
  return Yt(t) ? t.host : t;
}
function Zt(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function Qt({
  groupElement: e,
  hitRegion: t,
  pointerEventTarget: n
}) {
  if (!ot(n) || n.contains(e) || e.contains(n))
    return !0;
  if (Xt(n, e) > 0) {
    let r = n;
    for (; r; ) {
      if (r.contains(e))
        return !0;
      if (Zt(r.getBoundingClientRect(), t))
        return !1;
      r = r.parentElement;
    }
  }
  return !0;
}
function Ee(e, t) {
  const n = [];
  return t.forEach((r, o) => {
    if (o.disabled)
      return;
    const a = it(o), u = _t(o.orientation, a, {
      x: e.clientX,
      y: e.clientY
    });
    u && u.distance.x <= 0 && u.distance.y <= 0 && Qt({
      groupElement: o.element,
      hitRegion: u.hitRegion.rect,
      pointerEventTarget: e.target
    }) && n.push(u.hitRegion);
  }), n;
}
function en(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n] != t[n])
      return !1;
  return !0;
}
function D(e, t, n = 0) {
  return Math.abs(I(e) - I(t)) <= n;
}
function O(e, t) {
  return D(e, t) ? 0 : e > t ? 1 : -1;
}
function Q({
  overrideDisabledPanels: e,
  panelConstraints: t,
  prevSize: n,
  size: r
}) {
  const {
    collapsedSize: o = 0,
    collapsible: a,
    disabled: u,
    maxSize: s = 100,
    minSize: i = 0
  } = t;
  if (u && !e)
    return n;
  if (O(r, i) < 0)
    if (a) {
      const l = (o + i) / 2;
      O(r, l) < 0 ? r = o : r = i;
    } else
      r = i;
  return r = Math.min(s, r), r = I(r), r;
}
function ue({
  delta: e,
  initialLayout: t,
  panelConstraints: n,
  pivotIndices: r,
  prevLayout: o,
  trigger: a
}) {
  if (D(e, 0))
    return t;
  const u = a === "imperative-api", s = Object.values(t), i = Object.values(o), l = [...s], [c, h] = r;
  P(c != null, "Invalid first pivot index"), P(h != null, "Invalid second pivot index");
  let d = 0;
  switch (a) {
    case "keyboard": {
      {
        const f = e < 0 ? h : c, g = n[f];
        P(
          g,
          `Panel constraints not found for index ${f}`
        );
        const {
          collapsedSize: p = 0,
          collapsible: y,
          minSize: S = 0
        } = g;
        if (y) {
          const b = s[f];
          if (P(
            b != null,
            `Previous layout not found for panel index ${f}`
          ), D(b, p)) {
            const v = S - b;
            O(v, Math.abs(e)) > 0 && (e = e < 0 ? 0 - v : v);
          }
        }
      }
      {
        const f = e < 0 ? c : h, g = n[f];
        P(
          g,
          `No panel constraints found for index ${f}`
        );
        const {
          collapsedSize: p = 0,
          collapsible: y,
          minSize: S = 0
        } = g;
        if (y) {
          const b = s[f];
          if (P(
            b != null,
            `Previous layout not found for panel index ${f}`
          ), D(b, S)) {
            const v = b - p;
            O(v, Math.abs(e)) > 0 && (e = e < 0 ? 0 - v : v);
          }
        }
      }
      break;
    }
    default: {
      const f = e < 0 ? h : c, g = n[f];
      P(
        g,
        `Panel constraints not found for index ${f}`
      );
      const p = s[f], { collapsible: y, collapsedSize: S, minSize: b } = g;
      if (y && O(p, b) < 0)
        if (e > 0) {
          const v = b - S, L = v / 2, E = p + e;
          O(E, b) < 0 && (e = O(e, L) <= 0 ? 0 : v);
        } else {
          const v = b - S, L = 100 - v / 2, E = p - e;
          O(E, b) < 0 && (e = O(100 + e, L) > 0 ? 0 : -v);
        }
      break;
    }
  }
  {
    const f = e < 0 ? 1 : -1;
    let g = e < 0 ? h : c, p = 0;
    for (; ; ) {
      const S = s[g];
      P(
        S != null,
        `Previous layout not found for panel index ${g}`
      );
      const b = Q({
        overrideDisabledPanels: u,
        panelConstraints: n[g],
        prevSize: S,
        size: 100
      }) - S;
      if (p += b, g += f, g < 0 || g >= n.length)
        break;
    }
    const y = Math.min(Math.abs(e), Math.abs(p));
    e = e < 0 ? 0 - y : y;
  }
  {
    let f = e < 0 ? c : h;
    for (; f >= 0 && f < n.length; ) {
      const g = Math.abs(e) - Math.abs(d), p = s[f];
      P(
        p != null,
        `Previous layout not found for panel index ${f}`
      );
      const y = p - g, S = Q({
        overrideDisabledPanels: u,
        panelConstraints: n[f],
        prevSize: p,
        size: y
      });
      if (!D(p, S) && (d += p - S, l[f] = S, d.toFixed(3).localeCompare(Math.abs(e).toFixed(3), void 0, {
        numeric: !0
      }) >= 0))
        break;
      e < 0 ? f-- : f++;
    }
  }
  if (en(i, l))
    return o;
  {
    const f = e < 0 ? h : c, g = s[f];
    P(
      g != null,
      `Previous layout not found for panel index ${f}`
    );
    const p = g + d, y = Q({
      overrideDisabledPanels: u,
      panelConstraints: n[f],
      prevSize: g,
      size: p
    });
    if (l[f] = y, !D(y, p)) {
      let S = p - y, b = e < 0 ? h : c;
      for (; b >= 0 && b < n.length; ) {
        const v = l[b];
        P(
          v != null,
          `Previous layout not found for panel index ${b}`
        );
        const L = v + S, E = Q({
          overrideDisabledPanels: u,
          panelConstraints: n[b],
          prevSize: v,
          size: L
        });
        if (D(v, E) || (S -= E - v, l[b] = E), D(S, 0))
          break;
        e > 0 ? b-- : b++;
      }
    }
  }
  const z = Object.values(l).reduce(
    (f, g) => g + f,
    0
  );
  if (!D(z, 100, 0.1))
    return o;
  const m = Object.keys(o);
  return l.reduce((f, g, p) => (f[m[p]] = g, f), {});
}
function Y(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (t[n] === void 0 || O(e[n], t[n]) !== 0)
      return !1;
  return !0;
}
function X({
  layout: e,
  panelConstraints: t
}) {
  const n = Object.values(e), r = [...n], o = r.reduce(
    (s, i) => s + i,
    0
  );
  if (r.length !== t.length)
    throw Error(
      `Invalid ${t.length} panel layout: ${r.map((s) => `${s}%`).join(", ")}`
    );
  if (!D(o, 100) && r.length > 0)
    for (let s = 0; s < t.length; s++) {
      const i = r[s];
      P(i != null, `No layout data found for index ${s}`);
      const l = 100 / o * i;
      r[s] = l;
    }
  let a = 0;
  for (let s = 0; s < t.length; s++) {
    const i = n[s];
    P(i != null, `No layout data found for index ${s}`);
    const l = r[s];
    P(l != null, `No layout data found for index ${s}`);
    const c = Q({
      overrideDisabledPanels: !0,
      panelConstraints: t[s],
      prevSize: i,
      size: l
    });
    l != c && (a += l - c, r[s] = c);
  }
  if (!D(a, 0))
    for (let s = 0; s < t.length; s++) {
      const i = r[s];
      P(i != null, `No layout data found for index ${s}`);
      const l = i + a, c = Q({
        overrideDisabledPanels: !0,
        panelConstraints: t[s],
        prevSize: i,
        size: l
      });
      if (i !== c && (a -= c - i, r[s] = c, D(a, 0)))
        break;
    }
  const u = Object.keys(e);
  return r.reduce((s, i, l) => (s[u[l]] = i, s), {});
}
function gt({
  groupId: e,
  panelId: t
}) {
  const n = () => {
    const i = J();
    for (const [
      l,
      {
        defaultLayoutDeferred: c,
        derivedPanelConstraints: h,
        layout: d,
        groupSize: z,
        separatorToPanels: m
      }
    ] of i)
      if (l.id === e)
        return {
          defaultLayoutDeferred: c,
          derivedPanelConstraints: h,
          group: l,
          groupSize: z,
          layout: d,
          separatorToPanels: m
        };
    throw Error(`Group ${e} not found`);
  }, r = () => {
    const i = n().derivedPanelConstraints.find(
      (l) => l.panelId === t
    );
    if (i !== void 0)
      return i;
    throw Error(`Panel constraints not found for Panel ${t}`);
  }, o = () => {
    const i = n().group.panels.find((l) => l.id === t);
    if (i !== void 0)
      return i;
    throw Error(`Layout not found for Panel ${t}`);
  }, a = () => {
    const i = n().layout[t];
    if (i !== void 0)
      return i;
    throw Error(`Layout not found for Panel ${t}`);
  }, u = ({
    nextSize: i,
    panels: l,
    prevLayout: c,
    derivedPanelConstraints: h
  }) => {
    const d = a(), z = l.findIndex((g) => g.id === t), m = z === 0, f = z === l.length - 1;
    if (f && i < d && (m || l.slice(0, z).every((g, p) => {
      const y = h[p];
      return (y == null ? void 0 : y.collapsible) && D(y.collapsedSize, c[y.panelId]);
    }))) {
      const g = l.slice(0, z).reduce((p, y) => p + c[y.id], 0);
      return {
        ...c,
        [t]: I(100 - g)
      };
    }
    return ue({
      delta: f ? d - i : i - d,
      initialLayout: c,
      panelConstraints: h,
      pivotIndices: f ? [z - 1, z] : [z, z + 1],
      prevLayout: c,
      trigger: "imperative-api"
    });
  }, s = (i) => {
    const l = a();
    if (i === l)
      return;
    const {
      defaultLayoutDeferred: c,
      derivedPanelConstraints: h,
      group: d,
      groupSize: z,
      layout: m,
      separatorToPanels: f
    } = n(), g = u({
      nextSize: i,
      panels: d.panels,
      prevLayout: m,
      derivedPanelConstraints: h
    }), p = X({
      layout: g,
      panelConstraints: h
    });
    Y(m, p) || W(d, {
      defaultLayoutDeferred: c,
      derivedPanelConstraints: h,
      groupSize: z,
      layout: p,
      separatorToPanels: f
    });
  };
  return {
    collapse: () => {
      const { collapsible: i, collapsedSize: l } = r(), { mutableValues: c } = o(), h = a();
      i && h !== l && (c.expandToSize = h, s(l));
    },
    expand: () => {
      const { collapsible: i, collapsedSize: l, minSize: c } = r(), { mutableValues: h } = o(), d = a();
      if (i && d === l) {
        let z = h.expandToSize ?? c;
        z === 0 && (z = 1), s(z);
      }
    },
    getSize: () => {
      const { group: i } = n(), l = a(), { element: c } = o(), h = i.orientation === "horizontal" ? c.offsetWidth : c.offsetHeight;
      return {
        asPercentage: l,
        inPixels: h
      };
    },
    isCollapsed: () => {
      const { collapsible: i, collapsedSize: l } = r(), c = a();
      return i && D(l, c);
    },
    resize: (i) => {
      const { group: l } = n(), { element: c } = o(), h = ne({ group: l }), d = ie({
        groupSize: h,
        panelElement: c,
        styleProp: i
      }), z = I(d / h * 100);
      s(z);
    }
  };
}
function Xe(e) {
  if (e.defaultPrevented)
    return;
  const t = J();
  Ee(e, t).forEach((n) => {
    if (n.separator && !n.separator.disableDoubleClick) {
      const r = n.panels.find(
        (o) => o.panelConstraints.defaultSize !== void 0
      );
      if (r) {
        const o = r.panelConstraints.defaultSize, a = gt({
          groupId: n.group.id,
          panelId: r.id
        });
        a && o !== void 0 && (a.resize(o), e.preventDefault());
      }
    }
  });
}
function ge(e) {
  const t = J();
  for (const [n] of t)
    if (n.separators.some(
      (r) => r.element === e
    ))
      return n;
  throw Error("Could not find parent Group for separator element");
}
function vt({
  groupId: e
}) {
  const t = () => {
    const n = J();
    for (const [r, o] of n)
      if (r.id === e)
        return { group: r, ...o };
    throw Error(`Could not find Group with id "${e}"`);
  };
  return {
    getLayout() {
      const { defaultLayoutDeferred: n, layout: r } = t();
      return n ? {} : r;
    },
    setLayout(n) {
      const {
        defaultLayoutDeferred: r,
        derivedPanelConstraints: o,
        group: a,
        groupSize: u,
        layout: s,
        separatorToPanels: i
      } = t(), l = X({
        layout: n,
        panelConstraints: o
      });
      return r ? s : (Y(s, l) || W(a, {
        defaultLayoutDeferred: r,
        derivedPanelConstraints: o,
        groupSize: u,
        layout: l,
        separatorToPanels: i
      }), l);
    }
  };
}
function V(e, t) {
  const n = ge(e), r = H(n.id, !0), o = n.separators.find(
    (c) => c.element === e
  );
  P(o, "Matching separator not found");
  const a = r.separatorToPanels.get(o);
  P(a, "Matching panels not found");
  const u = a.map((c) => n.panels.indexOf(c)), s = vt({ groupId: n.id }).getLayout(), i = ue({
    delta: t,
    initialLayout: s,
    panelConstraints: r.derivedPanelConstraints,
    pivotIndices: u,
    prevLayout: s,
    trigger: "keyboard"
  }), l = X({
    layout: i,
    panelConstraints: r.derivedPanelConstraints
  });
  Y(s, l) || W(
    n,
    {
      defaultLayoutDeferred: r.defaultLayoutDeferred,
      derivedPanelConstraints: r.derivedPanelConstraints,
      groupSize: r.groupSize,
      layout: l,
      separatorToPanels: r.separatorToPanels
    },
    // Keyboard resizes (arrow keys, Home/End, Enter collapse/expand) originate
    // from a real DOM event on the separator, so they are user interactions
    // just like pointer drags. This function is only reached from
    // onDocumentKeyDown. See #716.
    { isUserInteraction: !0 }
  );
}
function Je(e) {
  if (e.defaultPrevented)
    return;
  const t = e.currentTarget, n = ge(t);
  if (!n.disabled)
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault(), n.orientation === "vertical" && V(t, 5);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault(), n.orientation === "horizontal" && V(t, -5);
        break;
      }
      case "ArrowRight": {
        e.preventDefault(), n.orientation === "horizontal" && V(t, 5);
        break;
      }
      case "ArrowUp": {
        e.preventDefault(), n.orientation === "vertical" && V(t, -5);
        break;
      }
      case "End": {
        e.preventDefault(), V(t, 100);
        break;
      }
      case "Enter": {
        e.preventDefault();
        const r = ge(t), o = H(r.id, !0), { derivedPanelConstraints: a, layout: u, separatorToPanels: s } = o, i = r.separators.find(
          (d) => d.element === t
        );
        P(i, "Matching separator not found");
        const l = s.get(i);
        P(l, "Matching panels not found");
        const c = l[0], h = a.find(
          (d) => d.panelId === c.id
        );
        if (P(h, "Panel metadata not found"), h.collapsible) {
          const d = u[c.id], z = h.collapsedSize === d ? r.mutableState.expandedPanelSizes[c.id] ?? h.minSize : h.collapsedSize;
          V(t, z - d);
        }
        break;
      }
      case "F6": {
        e.preventDefault();
        const r = ge(t).separators.map(
          (u) => u.element
        ), o = Array.from(r).findIndex(
          (u) => u === e.currentTarget
        );
        P(o !== null, "Index not found");
        const a = e.shiftKey ? o > 0 ? o - 1 : r.length - 1 : o + 1 < r.length ? o + 1 : 0;
        r[a].focus({
          preventScroll: !0
        });
        break;
      }
      case "Home": {
        e.preventDefault(), V(t, -100);
        break;
      }
    }
}
function Ke(e) {
  if (e.defaultPrevented || e.pointerType === "mouse" && e.button > 0)
    return;
  const t = J(), n = Ee(e, t), r = /* @__PURE__ */ new Map();
  let o = !1;
  n.forEach((a) => {
    a.separator && (o || (o = !0, a.separator.element.focus({
      // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#browser_compatibility
      focusVisible: !1,
      preventScroll: !0
    })));
    const u = t.get(a.group);
    u && r.set(a.group, u.layout);
  }), te({
    cursorFlags: 0,
    hitRegions: n,
    initialLayoutMap: r,
    pointerDownAtPoint: { x: e.clientX, y: e.clientY },
    state: "active"
  }), n.length && e.preventDefault();
}
function mt({
  document: e,
  event: t,
  hitRegions: n,
  initialLayoutMap: r,
  mountedGroups: o,
  pointerDownAtPoint: a,
  prevCursorFlags: u
}) {
  let s = 0;
  n.forEach((l) => {
    const { group: c, groupSize: h } = l, { orientation: d, panels: z } = c, { disableCursor: m } = c.mutableState;
    let f = 0;
    a ? d === "horizontal" ? f = (t.clientX - a.x) / h * 100 : f = (t.clientY - a.y) / h * 100 : d === "horizontal" ? f = t.clientX < 0 ? -100 : 100 : f = t.clientY < 0 ? -100 : 100;
    const g = r.get(c), p = o.get(c);
    if (!g || !p)
      return;
    const {
      defaultLayoutDeferred: y,
      derivedPanelConstraints: S,
      groupSize: b,
      layout: v,
      separatorToPanels: L
    } = p;
    if (S && v && L) {
      const E = ue({
        delta: f,
        initialLayout: g,
        panelConstraints: S,
        pivotIndices: l.panels.map((k) => z.indexOf(k)),
        prevLayout: v,
        trigger: "mouse-or-touch"
      });
      if (Y(E, v)) {
        if (f !== 0 && !m)
          switch (d) {
            case "horizontal": {
              s |= f < 0 ? lt : ut;
              break;
            }
            case "vertical": {
              s |= f < 0 ? ct : dt;
              break;
            }
          }
      } else
        W(l.group, {
          defaultLayoutDeferred: y,
          derivedPanelConstraints: S,
          groupSize: b,
          layout: E,
          separatorToPanels: L
        });
    }
  });
  let i = 0;
  t.movementX === 0 ? i |= u & je : i |= s & je, t.movementY === 0 ? i |= u & Be : i |= s & Be, Wt(i), Pe(e);
}
function qe(e) {
  const t = J(), n = _();
  switch (n.state) {
    case "active":
      mt({
        document: e.currentTarget,
        event: e,
        hitRegions: n.hitRegions,
        initialLayoutMap: n.initialLayoutMap,
        mountedGroups: t,
        prevCursorFlags: n.cursorFlags
      });
  }
}
function Ze(e) {
  var r, o;
  if (e.defaultPrevented)
    return;
  const t = _(), n = J();
  switch (t.state) {
    case "active": {
      if (
        // Skip this check for "pointerleave" events, else Firefox triggers a false positive (see #514)
        e.buttons === 0
      ) {
        te({
          cursorFlags: 0,
          state: "inactive"
        }), t.hitRegions.forEach((a) => {
          const u = H(a.group.id, !0);
          W(a.group, u, {
            isUserInteraction: !0
          });
        });
        return;
      }
      for (const a of t.hitRegions)
        if (a.separator) {
          const { element: u } = a.separator;
          (r = u.hasPointerCapture) != null && r.call(u, e.pointerId) || ((o = u.setPointerCapture) == null || o.call(u, e.pointerId));
        }
      mt({
        document: e.currentTarget,
        event: e,
        hitRegions: t.hitRegions,
        initialLayoutMap: t.initialLayoutMap,
        mountedGroups: n,
        pointerDownAtPoint: t.pointerDownAtPoint,
        prevCursorFlags: t.cursorFlags
      });
      break;
    }
    default: {
      const a = Ee(e, n);
      a.length === 0 ? t.state !== "inactive" && te({
        cursorFlags: 0,
        state: "inactive"
      }) : te({
        cursorFlags: 0,
        hitRegions: a,
        state: "hover"
      }), Pe(e.currentTarget);
      break;
    }
  }
}
function Qe(e) {
  if (e.relatedTarget instanceof HTMLIFrameElement)
    switch (_().state) {
      case "hover":
        te({
          cursorFlags: 0,
          state: "inactive"
        });
    }
}
function et(e) {
  e.defaultPrevented || e.pointerType === "mouse" && e.button > 0 || pt(e.currentTarget) && e.preventDefault();
}
function tt(e) {
  let t = 0, n = 0;
  const r = {};
  for (const a of e)
    if (a.defaultSize !== void 0) {
      t++;
      const u = I(a.defaultSize);
      n += u, r[a.panelId] = u;
    } else
      r[a.panelId] = void 0;
  const o = e.length - t;
  if (o !== 0) {
    const a = I((100 - n) / o);
    for (const u of e)
      u.defaultSize === void 0 && (r[u.panelId] = a);
  }
  return r;
}
function tn(e, t, n) {
  if (!n[0])
    return;
  const r = e.panels.find((i) => i.element === t);
  if (!r || !r.onResize)
    return;
  const o = ne({ group: e }), a = e.orientation === "horizontal" ? r.element.offsetWidth : r.element.offsetHeight, u = r.mutableValues.prevSize, s = {
    asPercentage: I(a / o * 100),
    inPixels: a
  };
  r.mutableValues.prevSize = s, r.onResize(s, r.id, u);
}
function nn(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
function rn({
  group: e,
  nextGroupSize: t,
  prevGroupSize: n,
  prevLayout: r
}) {
  if (n <= 0 || t <= 0 || n === t)
    return r;
  let o = 0, a = 0, u = !1;
  const s = /* @__PURE__ */ new Map(), i = [];
  for (const h of e.panels) {
    const d = r[h.id] ?? 0;
    switch (h.panelConstraints.groupResizeBehavior) {
      case "preserve-pixel-size": {
        u = !0;
        const z = d / 100 * n, m = I(
          z / t * 100
        );
        s.set(h.id, m), o += m;
        break;
      }
      case "preserve-relative-size":
      default: {
        i.push(h.id), a += d;
        break;
      }
    }
  }
  if (!u || i.length === 0)
    return r;
  const l = 100 - o, c = { ...r };
  if (s.forEach((h, d) => {
    c[d] = h;
  }), a > 0)
    for (const h of i) {
      const d = r[h] ?? 0;
      c[h] = I(
        d / a * l
      );
    }
  else {
    const h = I(
      l / i.length
    );
    for (const d of i)
      c[d] = h;
  }
  return c;
}
function on(e, t) {
  const n = e.map((o) => o.id), r = Object.keys(t);
  if (n.length !== r.length)
    return !1;
  for (const o of n)
    if (!r.includes(o))
      return !1;
  return !0;
}
const Z = /* @__PURE__ */ new Map();
function an(e) {
  let t = !0;
  P(
    e.element.ownerDocument.defaultView,
    "Cannot register an unmounted Group"
  );
  const n = e.element.ownerDocument.defaultView.ResizeObserver, r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), a = new n((m) => {
    for (const f of m) {
      const { borderBoxSize: g, target: p } = f;
      if (p === e.element) {
        if (t) {
          const y = ne({ group: e });
          if (y === 0)
            return;
          const S = H(e.id);
          if (!S)
            return;
          const b = ze(e), v = S.defaultLayoutDeferred ? tt(b) : S.layout, L = rn({
            group: e,
            nextGroupSize: y,
            prevGroupSize: S.groupSize,
            prevLayout: v
          }), E = X({
            layout: L,
            panelConstraints: b
          });
          if (!S.defaultLayoutDeferred && Y(S.layout, E) && nn(
            S.derivedPanelConstraints,
            b
          ) && S.groupSize === y)
            return;
          W(e, {
            defaultLayoutDeferred: !1,
            derivedPanelConstraints: b,
            groupSize: y,
            layout: E,
            separatorToPanels: S.separatorToPanels
          });
        }
      } else
        tn(e, p, g);
    }
  });
  a.observe(e.element), e.panels.forEach((m) => {
    P(
      !r.has(m.id),
      `Panel ids must be unique; id "${m.id}" was used more than once`
    ), r.add(m.id), m.onResize && a.observe(m.element);
  });
  const u = ne({ group: e }), s = ze(e), i = e.panels.map(({ id: m }) => m).join(",");
  let l = e.mutableState.defaultLayout;
  l && (on(e.panels, l) || (l = void 0));
  const c = e.mutableState.layouts[i] ?? l ?? tt(s), h = X({
    layout: c,
    panelConstraints: s
  }), d = e.element.ownerDocument;
  Z.set(
    d,
    (Z.get(d) ?? 0) + 1
  );
  const z = /* @__PURE__ */ new Map();
  return it(e).forEach((m) => {
    m.separator && z.set(m.separator, m.panels);
  }), W(e, {
    defaultLayoutDeferred: u === 0,
    derivedPanelConstraints: s,
    groupSize: u,
    layout: h,
    separatorToPanels: z
  }), e.separators.forEach((m) => {
    P(
      !o.has(m.id),
      `Separator ids must be unique; id "${m.id}" was used more than once`
    ), o.add(m.id), m.element.addEventListener("keydown", Je);
  }), Z.get(d) === 1 && (d.addEventListener("contextmenu", He, !0), d.addEventListener("dblclick", Xe, !0), d.addEventListener("pointerdown", Ke, !0), d.addEventListener("pointerleave", qe), d.addEventListener("pointermove", Ze), d.addEventListener("pointerout", Qe), d.addEventListener("pointerup", et, !0)), function() {
    t = !1, Z.set(
      d,
      Math.max(0, (Z.get(d) ?? 0) - 1)
    ), Vt(e), e.separators.forEach((m) => {
      m.element.removeEventListener("keydown", Je);
    }), Z.get(d) || (d.removeEventListener(
      "contextmenu",
      He,
      !0
    ), d.removeEventListener(
      "dblclick",
      Xe,
      !0
    ), d.removeEventListener(
      "pointerdown",
      Ke,
      !0
    ), d.removeEventListener("pointerleave", qe), d.removeEventListener("pointermove", Ze), d.removeEventListener("pointerout", Qe), d.removeEventListener("pointerup", et, !0)), a.disconnect();
  };
}
function sn() {
  const [e, t] = se({}), n = ve(() => t({}), []);
  return [e, n];
}
function Me(e) {
  const t = kt();
  return `${e ?? t}`;
}
const K = typeof window < "u" ? rt : me;
function le(e) {
  const t = N(e);
  return K(() => {
    t.current = e;
  }, [e]), ve(
    (...n) => {
      var r;
      return (r = t.current) == null ? void 0 : r.call(t, ...n);
    },
    [t]
  );
}
function ke(...e) {
  return le((t) => {
    e.forEach((n) => {
      if (n)
        switch (typeof n) {
          case "function": {
            n(t);
            break;
          }
          case "object": {
            n.current = t;
            break;
          }
        }
    });
  });
}
function Re(e) {
  const t = N({ ...e });
  return K(() => {
    for (const n in e)
      t.current[n] = e[n];
  }, [e]), t.current;
}
const yt = Rt(null);
function ln(e, t) {
  const n = N({
    getLayout: () => ({}),
    setLayout: Ut
  });
  nt(t, () => n.current, []), K(() => {
    Object.assign(
      n.current,
      vt({ groupId: e })
    );
  });
}
function bt({
  children: e,
  className: t,
  defaultLayout: n,
  disableCursor: r,
  disabled: o,
  elementRef: a,
  groupRef: u,
  id: s,
  onLayoutChange: i,
  onLayoutChanged: l,
  orientation: c = "horizontal",
  resizeTargetMinimumSize: h = {
    coarse: 20,
    fine: 10
  },
  style: d,
  ...z
}) {
  const m = N({
    onLayoutChange: {},
    onLayoutChanged: {}
  }), f = le((w) => {
    Y(m.current.onLayoutChange, w) || (m.current.onLayoutChange = w, i == null || i(w));
  }), g = le(
    (w, x) => {
      Y(m.current.onLayoutChanged, w) || (m.current.onLayoutChanged = w, l == null || l(w, { isUserInteraction: x }));
    }
  ), p = Me(s), y = N(null), [S, b] = sn(), v = N({
    lastExpandedPanelSizes: {},
    layouts: {},
    panels: [],
    resizeTargetMinimumSize: h,
    separators: []
  }), L = ke(y, a);
  ln(p, u);
  const E = le(
    (w, x) => {
      const M = _(), C = Ue(w), R = H(w);
      if (R) {
        let T = !1;
        switch (M.state) {
          case "active": {
            T = M.hitRegions.some(
              (re) => re.group === C
            );
            break;
          }
        }
        return {
          flexGrow: R.layout[x] ?? 1,
          pointerEvents: T ? "none" : void 0
        };
      }
      if (n != null && n[x])
        return {
          flexGrow: n == null ? void 0 : n[x]
        };
    }
  ), k = Re({
    defaultLayout: n,
    disableCursor: r
  }), A = Et(
    () => ({
      get disableCursor() {
        return !!k.disableCursor;
      },
      getPanelStyles: E,
      id: p,
      orientation: c,
      registerPanel: (w) => {
        const x = v.current;
        return x.panels = we(c, [
          ...x.panels,
          w
        ]), b(), () => {
          x.panels = x.panels.filter(
            (M) => M !== w
          ), b();
        };
      },
      registerSeparator: (w) => {
        const x = v.current;
        return x.separators = we(c, [
          ...x.separators,
          w
        ]), b(), () => {
          x.separators = x.separators.filter(
            (M) => M !== w
          ), b();
        };
      },
      updatePanelProps: (w, { disabled: x }) => {
        const M = v.current.panels.find(
          (T) => T.id === w
        );
        M && (M.panelConstraints.disabled = x);
        const C = Ue(p), R = H(p);
        C && R && W(C, {
          ...R,
          derivedPanelConstraints: ze(C)
        });
      },
      updateSeparatorProps: (w, {
        disabled: x,
        disableDoubleClick: M
      }) => {
        const C = v.current.separators.find(
          (R) => R.id === w
        );
        C && (C.disabled = x, C.disableDoubleClick = M);
      }
    }),
    [E, p, b, c, k]
  ), G = N(null);
  return K(() => {
    const w = y.current;
    if (w === null)
      return;
    const x = v.current;
    let M;
    if (k.defaultLayout !== void 0 && Object.keys(k.defaultLayout).length === x.panels.length) {
      M = {};
      for (const j of x.panels) {
        const q = k.defaultLayout[j.id];
        q !== void 0 && (M[j.id] = q);
      }
    }
    const C = {
      disabled: !!o,
      element: w,
      id: p,
      mutableState: {
        defaultLayout: M,
        disableCursor: !!k.disableCursor,
        expandedPanelSizes: v.current.lastExpandedPanelSizes,
        layouts: v.current.layouts
      },
      orientation: c,
      panels: x.panels,
      resizeTargetMinimumSize: x.resizeTargetMinimumSize,
      separators: x.separators
    };
    G.current = C;
    const R = an(C), { defaultLayoutDeferred: T, derivedPanelConstraints: re, layout: de } = H(C.id, !0);
    !T && re.length > 0 && (f(de), g(de, !1));
    const oe = Le(p, (j) => {
      const { defaultLayoutDeferred: q, derivedPanelConstraints: Ne, layout: fe } = j.next;
      if (q || Ne.length === 0)
        return;
      const wt = C.panels.map(({ id: B }) => B).join(",");
      C.mutableState.layouts[wt] = fe, Ne.forEach((B) => {
        if (B.collapsible) {
          const { layout: ye } = j.prev ?? {};
          if (ye) {
            const Ct = D(
              B.collapsedSize,
              fe[B.panelId]
            ), Pt = D(
              B.collapsedSize,
              ye[B.panelId]
            );
            Ct && !Pt && (C.mutableState.expandedPanelSizes[B.panelId] = ye[B.panelId]);
          }
        }
      });
      const xt = _().state !== "active";
      f(fe), xt && g(fe, j.isUserInteraction);
    });
    return () => {
      G.current = null, R(), oe();
    };
  }, [
    o,
    p,
    g,
    f,
    c,
    S,
    k
  ]), me(() => {
    const w = G.current;
    w && (w.mutableState.defaultLayout = n, w.mutableState.disableCursor = !!r);
  }), /* @__PURE__ */ $(yt.Provider, { value: A, children: /* @__PURE__ */ $(
    "div",
    {
      ...z,
      className: t,
      "data-group": !0,
      "data-testid": p,
      id: p,
      ref: L,
      style: {
        height: "100%",
        width: "100%",
        overflow: "hidden",
        ...d,
        display: "flex",
        flexDirection: c === "horizontal" ? "row" : "column",
        flexWrap: "nowrap",
        // Inform the browser that the library is handling touch events for this element
        // but still allow users to scroll content within panels in the non-resizing direction
        // NOTE This is not an inherited style
        // See github.com/bvaughn/react-resizable-panels/issues/662
        touchAction: c === "horizontal" ? "pan-y" : "pan-x"
      },
      children: e
    }
  ) });
}
bt.displayName = "Group";
function De() {
  const e = Dt(yt);
  return P(
    e,
    "Group Context not found; did you render a Panel or Separator outside of a Group?"
  ), e;
}
function un(e, t) {
  const { id: n } = De(), r = N({
    collapse: be,
    expand: be,
    getSize: () => ({
      asPercentage: 0,
      inPixels: 0
    }),
    isCollapsed: () => !1,
    resize: be
  });
  nt(t, () => r.current, []), K(() => {
    Object.assign(
      r.current,
      gt({ groupId: n, panelId: e })
    );
  });
}
function xe({
  children: e,
  className: t,
  collapsedSize: n = "0%",
  collapsible: r = !1,
  defaultSize: o,
  disabled: a,
  elementRef: u,
  groupResizeBehavior: s = "preserve-relative-size",
  id: i,
  maxSize: l = "100%",
  minSize: c = "0%",
  onResize: h,
  panelRef: d,
  style: z,
  ...m
}) {
  const f = !!i, g = Me(i), p = Re({
    disabled: a
  }), y = N(null), S = ke(y, u), {
    getPanelStyles: b,
    id: v,
    orientation: L,
    registerPanel: E,
    updatePanelProps: k
  } = De(), A = h !== null, G = le(
    (C, R, T) => {
      h == null || h(C, i, T);
    }
  );
  K(() => {
    const C = y.current;
    if (C !== null) {
      const R = {
        element: C,
        id: g,
        idIsStable: f,
        mutableValues: {
          expandToSize: void 0,
          prevSize: void 0
        },
        onResize: A ? G : void 0,
        panelConstraints: {
          groupResizeBehavior: s,
          collapsedSize: n,
          collapsible: r,
          defaultSize: o,
          disabled: p.disabled,
          maxSize: l,
          minSize: c
        }
      };
      return E(R);
    }
  }, [
    s,
    n,
    r,
    o,
    A,
    g,
    f,
    l,
    c,
    G,
    E,
    p
  ]), me(() => {
    k(g, { disabled: a });
  }, [a, g, k]), un(g, d);
  const w = () => {
    const C = b(v, g);
    if (C)
      return JSON.stringify(C);
  }, x = Mt(
    (C) => Le(v, C),
    w,
    w
  );
  let M;
  return x ? M = JSON.parse(x) : o !== void 0 ? M = {
    flexGrow: void 0,
    flexShrink: void 0,
    flexBasis: o
  } : M = { flexGrow: 1 }, /* @__PURE__ */ $(
    "div",
    {
      ...m,
      "data-disabled": a || void 0,
      "data-panel": !0,
      "data-testid": g,
      id: g,
      ref: S,
      style: {
        ...cn,
        display: "flex",
        flexBasis: 0,
        flexShrink: 1,
        overflow: "visible",
        ...M
      },
      children: /* @__PURE__ */ $(
        "div",
        {
          className: t,
          style: {
            maxHeight: "100%",
            maxWidth: "100%",
            flexGrow: 1,
            overflow: "auto",
            ...z,
            // Inform the browser that the library is handling touch events for this element
            // but still allow users to scroll content within panels in the non-resizing direction
            // NOTE This is not an inherited style
            // See github.com/bvaughn/react-resizable-panels/issues/662
            touchAction: L === "horizontal" ? "pan-y" : "pan-x"
          },
          children: e
        }
      )
    }
  );
}
xe.displayName = "Panel";
const cn = {
  minHeight: 0,
  maxHeight: "100%",
  height: "auto",
  minWidth: 0,
  maxWidth: "100%",
  width: "auto",
  border: "none",
  borderWidth: 0,
  padding: 0,
  margin: 0
};
function dn({
  layout: e,
  panelConstraints: t,
  panelId: n,
  panelIndex: r
}) {
  let o, a;
  const u = e[n], s = t.find(
    (i) => i.panelId === n
  );
  if (s) {
    const i = s.maxSize, l = s.collapsible ? s.collapsedSize : s.minSize, c = [r, r + 1];
    a = X({
      layout: ue({
        delta: l - u,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: c,
        prevLayout: e
      }),
      panelConstraints: t
    })[n], o = X({
      layout: ue({
        delta: i - u,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: c,
        prevLayout: e
      }),
      panelConstraints: t
    })[n];
  }
  return {
    valueControls: n,
    valueMax: o,
    valueMin: a,
    valueNow: u
  };
}
function St({
  children: e,
  className: t,
  disabled: n,
  disableDoubleClick: r,
  elementRef: o,
  id: a,
  style: u,
  ...s
}) {
  const i = Me(a), l = Re({
    disabled: n,
    disableDoubleClick: r
  }), [c, h] = se({}), [d, z] = se("inactive"), [m, f] = se(!1), g = N(null), p = ke(g, o), {
    disableCursor: y,
    id: S,
    orientation: b,
    registerSeparator: v,
    updateSeparatorProps: L
  } = De(), E = b === "horizontal" ? "vertical" : "horizontal";
  K(() => {
    const G = g.current;
    if (G !== null) {
      const w = {
        disabled: l.disabled,
        disableDoubleClick: l.disableDoubleClick,
        element: G,
        id: i
      }, x = v(w), M = $t(
        (R) => {
          z(
            R.next.state !== "inactive" && R.next.hitRegions.some(
              (T) => T.separator === w
            ) ? R.next.state : "inactive"
          );
        }
      ), C = Le(
        S,
        (R) => {
          const { derivedPanelConstraints: T, layout: re, separatorToPanels: de } = R.next, oe = de.get(w);
          if (oe) {
            const j = oe[0], q = oe.indexOf(j);
            h(
              dn({
                layout: re,
                panelConstraints: T,
                panelId: j.id,
                panelIndex: q
              })
            );
          }
        }
      );
      return () => {
        M(), C(), x();
      };
    }
  }, [S, i, v, l]), me(() => {
    L(i, { disabled: n, disableDoubleClick: r });
  }, [n, r, i, L]);
  let k;
  n && !y && (k = "not-allowed");
  let A;
  if (n)
    A = "disabled";
  else
    switch (d) {
      case "active": {
        A = "active";
        break;
      }
      default:
        m ? A = "focus" : A = d;
    }
  return /* @__PURE__ */ $(
    "div",
    {
      ...s,
      "aria-controls": c.valueControls,
      "aria-disabled": n || void 0,
      "aria-orientation": E,
      "aria-valuemax": c.valueMax,
      "aria-valuemin": c.valueMin,
      "aria-valuenow": c.valueNow,
      children: e,
      className: t,
      "data-separator": A,
      "data-testid": i,
      id: i,
      onBlur: () => f(!1),
      onFocus: () => f(!0),
      ref: p,
      role: "separator",
      style: {
        flexBasis: "auto",
        cursor: k,
        ...u,
        flexGrow: 0,
        flexShrink: 0,
        // Inform the browser that the library is handling touch events for this element
        // See github.com/bvaughn/react-resizable-panels/issues/662
        touchAction: "none"
      },
      tabIndex: n ? void 0 : 0
    }
  );
}
St.displayName = "Separator";
const Ie = "reader-document", ce = "reader-assistant", zt = "retainpdf.reader.ai-split-layout.v1", fn = 30, pn = 65, hn = {
  [Ie]: 50,
  [ce]: 50
};
function Te(e) {
  const t = Number(e == null ? void 0 : e[ce]), n = Number.isFinite(t) ? Math.min(pn, Math.max(fn, t)) : 50;
  return {
    [Ie]: 100 - n,
    [ce]: n
  };
}
function gn() {
  try {
    const e = JSON.parse(localStorage.getItem(zt) || "null");
    return Te(e);
  } catch {
    return hn;
  }
}
function vn(e) {
  try {
    localStorage.setItem(zt, JSON.stringify(Te(e)));
  } catch {
  }
}
function Se(e, t) {
  const n = e == null ? void 0 : e.closest(".reader-react-root");
  if (!n) return;
  const r = Te(t);
  n.style.setProperty(
    "--reader-ai-split-width",
    `${r[ce]}vw`
  );
}
function Sn() {
  const e = N(null), [t] = se(gn);
  rt(() => {
    const o = e.current;
    return Se(o, t), () => {
      var a;
      (a = o == null ? void 0 : o.closest(".reader-react-root")) == null || a.style.removeProperty("--reader-ai-split-width");
    };
  }, [t]);
  const n = ve((o) => {
    Se(e.current, o);
  }, []), r = ve((o, a) => {
    Se(e.current, o), a.isUserInteraction && vn(o);
  }, []);
  return /* @__PURE__ */ Lt(
    bt,
    {
      id: "reader-ai-split",
      className: "reader-ai-split-resizer",
      elementRef: e,
      orientation: "horizontal",
      defaultLayout: t,
      onLayoutChange: n,
      onLayoutChanged: r,
      resizeTargetMinimumSize: { fine: 12, coarse: 28 },
      children: [
        /* @__PURE__ */ $(
          xe,
          {
            id: Ie,
            defaultSize: "50%",
            minSize: "35%",
            maxSize: "70%"
          }
        ),
        /* @__PURE__ */ $(
          St,
          {
            id: "reader-ai-split-separator",
            className: "reader-ai-split-separator",
            "aria-label": "调整文档与 AI 问答宽度",
            children: /* @__PURE__ */ $("span", { "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ $(
          xe,
          {
            id: ce,
            defaultSize: "50%",
            minSize: "30%",
            maxSize: "65%"
          }
        )
      ]
    }
  );
}
export {
  Sn as ReaderAiSplitResizeHandle,
  Te as normalizeReaderAiSplitLayout
};
//# sourceMappingURL=ReaderAiSplitResizeHandle-D0nnNMs6.js.map
