import { jsxs as J, jsx as b } from "react/jsx-runtime";
import { useRef as H, useState as z, useEffect as ue } from "react";
import { Search as Ae, ChevronUp as Le, ChevronDown as Ce, ListTree as Ne, FileCode2 as Re } from "lucide-react";
import { d as he, b as fe, r as He } from "./ReaderApp-Ci3nCLCY.js";
import { e as me, m as Ie, a as we } from "./markdown-math-Cb17EyYs.js";
import { n as xe } from "./markdown-payload-kK3ewW_I.js";
import { R as Oe } from "./ReaderFloatShell-DTFWp_bv.js";
function ge(t, { minChars: c = 16384 } = {}) {
  if (!t) return null;
  let a = "", l = 0;
  const d = t.length;
  for (; l < d; ) {
    const o = t.indexOf(`
`, l), n = o === -1 ? d : o, w = t.slice(l, n).trim(), U = w.match(/^(`{3,}|~{3,})/);
    if (U) {
      const i = U[1][0];
      a ? a === i && (a = "") : a = i;
    }
    if (!a && w === "") {
      const i = o === -1 ? d : o + 1;
      if (i >= c)
        return { complete: t.slice(0, i), rest: t.slice(i) };
    }
    if (o === -1) break;
    l = o + 1;
  }
  return null;
}
let X = null;
function ke() {
  return X || (X = import("marked").catch((t) => {
    throw X = null, t;
  })), X;
}
function $e(t) {
  t.querySelectorAll("script, iframe, object, embed, style, link, meta, base, form, input, button, textarea, select").forEach((c) => c.remove()), t.querySelectorAll("*").forEach((c) => {
    for (const a of [...c.attributes])
      /^on/i.test(a.name) && c.removeAttribute(a.name);
  }), t.querySelectorAll("a[href]").forEach((c) => {
    const a = c;
    /^\s*javascript:/i.test(a.getAttribute("href") || "") && a.removeAttribute("href"), a.setAttribute("target", "_blank"), a.setAttribute("rel", "noopener noreferrer");
  });
}
function ee(t, c, a) {
  const l = t.ownerDocument.createElement("template");
  return l.innerHTML = c, $e(l.content), l.content.querySelectorAll("img[src]").forEach((d) => {
    const o = d.getAttribute("src") || "", n = He(a, o) || o;
    d.setAttribute("data-reader-md-src", n), d.setAttribute("loading", "lazy"), d.setAttribute("decoding", "async"), d.removeAttribute("src");
  }), t.replaceChildren(l.content), t.classList.remove("hidden"), [...t.querySelectorAll("img[data-reader-md-src]")];
}
function De(t, c = "http://localhost/") {
  var a;
  if (/^mock:\/\//i.test(t)) return !0;
  try {
    const l = ((a = globalThis.location) == null ? void 0 : a.href) || "http://localhost/", d = new URL(c, l), o = new URL(t, d);
    if (!/\/api\/v1\/jobs\/[^/]+\/markdown\/images\//.test(o.pathname)) return !1;
    if (!/^[a-z][a-z\d+.-]*:/i.test(t)) return !0;
    const n = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(o.hostname);
    return o.origin === d.origin || n;
  } catch {
    return !1;
  }
}
function ze(t) {
  return t.normalize("NFKC").trim().toLocaleLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-+|-+$/g, "") || "section";
}
function te(t, c = /* @__PURE__ */ new Map()) {
  return [...t.querySelectorAll("h1, h2, h3, h4, h5, h6")].flatMap((a) => {
    const l = (a.textContent || "").replace(/\s+/g, " ").trim();
    if (!l) return [];
    const d = ze(l), o = (c.get(d) || 0) + 1;
    c.set(d, o);
    const n = o === 1 ? `reader-md-${d}` : `reader-md-${d}-${o}`;
    return a.id = n, [{ id: n, level: Number(a.tagName.slice(1)), text: l }];
  });
}
const pe = "h1, h2, h3, h4, h5, h6, p, li, td, th, blockquote, pre";
function qe(t) {
  t.querySelectorAll(".reader-markdown-search-hit, .reader-markdown-search-hit-active").forEach((c) => {
    c.classList.remove("reader-markdown-search-hit", "reader-markdown-search-hit-active");
  });
}
function Be(t, c) {
  qe(t);
  const a = c.trim().toLocaleLowerCase();
  if (!a) return [];
  const d = [...t.querySelectorAll(pe)].filter((o) => [...o.children].some((n) => n.matches(pe)) ? !1 : (o.textContent || "").toLocaleLowerCase().includes(a));
  return d.forEach((o) => o.classList.add("reader-markdown-search-hit")), d;
}
function be(t, c) {
  let a = !1, l = 0, d = 0, o = 0;
  const n = [], S = [], w = /* @__PURE__ */ new Set(), U = (e, p) => {
    const u = e.ownerDocument.createElement("span");
    u.className = "reader-markdown-image-missing", u.textContent = p, u.title = e.getAttribute("data-reader-md-src") || "", e.replaceWith(u);
  };
  for (const e of t) {
    const p = e.getAttribute("data-reader-md-src") || "", u = e.ownerDocument.baseURI || "http://localhost/";
    De(p, c.protectedBaseUrl || u) ? S.push(e) : Pe(p, u) ? e.src = p : U(e, "[图片地址不可用]");
  }
  const i = () => {
    var e;
    return (e = c.onProgress) == null ? void 0 : e.call(c, { failed: o, loaded: d, total: S.length });
  }, q = () => {
    if (!a)
      for (; l < 4 && n.length > 0; ) {
        const e = n.shift();
        if (!(e != null && e.isConnected)) continue;
        l += 1;
        const p = e.getAttribute("data-reader-md-src") || "";
        c.fetchImage(p).then(async (u) => {
          if (!(u != null && u.ok)) throw new Error(`HTTP ${(u == null ? void 0 : u.status) || 0}`);
          const E = URL.createObjectURL(await u.blob());
          if (a || !e.isConnected) {
            try {
              URL.revokeObjectURL(E);
            } catch {
            }
            return;
          }
          c.onObjectUrl(E), e.src = E, d += 1;
        }).catch(() => {
          a || !e.isConnected || (o += 1, U(e, "[图片暂不可用]"));
        }).finally(() => {
          l -= 1, a || (i(), q());
        });
      }
  }, I = (e) => {
    a || w.has(e) || (w.add(e), n.push(e), q());
  }, O = globalThis.IntersectionObserver;
  let g = null;
  return O && S.length > 0 ? (g = new O((e) => {
    e.forEach((p) => {
      if (!p.isIntersecting) return;
      const u = p.target;
      g == null || g.unobserve(u), I(u);
    });
  }, { root: c.root || null, rootMargin: "600px 0px" }), S.forEach((e) => g == null ? void 0 : g.observe(e))) : S.forEach(I), i(), () => {
    a = !0, n.length = 0, g == null || g.disconnect();
  };
}
function Pe(t, c) {
  if (/^data:image\//i.test(t) || /^blob:/i.test(t)) return !0;
  try {
    const a = new URL(t, c);
    return a.protocol === "http:" || a.protocol === "https:";
  } catch {
    return !1;
  }
}
function Qe({
  open: t,
  jobId: c,
  sourceOnly: a,
  layout: l = "floating",
  side: d = "right",
  onClose: o
}) {
  var ce, oe;
  const n = H(null), [S, w] = z("尚未加载"), U = H([]), i = H(null), q = H([]), I = H(""), O = H(/* @__PURE__ */ new Map()), g = H([]), e = H(null), p = H(!1), [u, E] = z([]), [re, ye] = z(!1), [ne, Me] = z(""), [B, ve] = z(0), [W, ae] = z(-1), Y = () => {
    for (const r of U.current)
      try {
        URL.revokeObjectURL(r);
      } catch {
      }
    U.current = [];
  }, K = (r, h = !0) => {
    const y = q.current;
    if (y.forEach((_) => _.classList.remove("reader-markdown-search-hit-active")), y.length === 0) {
      ae(-1);
      return;
    }
    const A = (r + y.length) % y.length, C = y[A];
    C.classList.add("reader-markdown-search-hit-active"), ae(A), h && typeof C.scrollIntoView == "function" && C.scrollIntoView({ block: "center", behavior: "smooth" });
  }, V = (r, h = !1) => {
    var C;
    const y = `${r || ""}`.trim();
    if (p.current = y.length > 0, p.current && ((C = e.current) == null || C.call(e)), !n.current) return;
    const A = Be(n.current, r);
    q.current = A, ve(A.length), K(A.length > 0 ? 0 : -1, h);
  };
  return ue(() => () => {
    var r;
    (r = i.current) == null || r.call(i), Y();
  }, []), ue(() => {
    var C, _, se;
    if (!t) {
      (C = i.current) == null || C.call(i), i.current = null, Y(), E([]);
      return;
    }
    let r = !1;
    Y(), (_ = i.current) == null || _.call(i), i.current = null;
    for (const M of g.current) M();
    g.current = [], (se = e.current) == null || se.call(e), e.current = null, O.current = /* @__PURE__ */ new Map();
    const h = he;
    async function y() {
      var m, $, P, T;
      const M = c.startsWith("doc:");
      if (!c || M) {
        w(!c && a ? "源文档阅读不提供 Markdown 产物" : "该任务暂无 Markdown 产物"), n.current && (n.current.replaceChildren(), n.current.classList.add("hidden"));
        return;
      }
      w("正在加载 Markdown…"), (m = n.current) == null || m.replaceChildren(), ($ = n.current) == null || $.classList.add("hidden");
      try {
        if (typeof (h == null ? void 0 : h.loadMarkdownSource) == "function" && typeof (h == null ? void 0 : h.loadMarkdownRange) == "function") {
          const f = await h.loadMarkdownSource(c);
          if (r) return;
          if (f != null && f.rawUrl) {
            await A(f);
            return;
          }
        }
      } catch {
      }
      try {
        const f = await he.loadMarkdownPayload(c);
        if (r) return;
        const { content: j, imagesBaseUrl: N } = xe(f);
        if (!j.trim()) {
          w("该任务暂无 Markdown 产物"), (P = n.current) == null || P.replaceChildren(), (T = n.current) == null || T.classList.add("hidden");
          return;
        }
        const { marked: x } = await ke();
        if (r || !n.current) return;
        const { text: F, slots: k } = me(j), L = String(x.parse(F, { async: !1 })), Q = Ie(L, k);
        ee(n.current, Q, N), E(te(n.current)), V(I.current), w(k.length > 0 ? `正文已显示 · 正在渲染 ${k.length} 个公式…` : "");
        const Z = k.length > 0 ? await we(L, k) : L;
        if (r || !n.current) return;
        const s = ee(n.current, Z, N);
        E(te(n.current)), V(I.current), w("");
        const v = n.current.closest(".reader-notes-panel-body");
        i.current = be(s, {
          root: v,
          protectedBaseUrl: N || n.current.ownerDocument.baseURI,
          fetchImage: fe,
          onObjectUrl: (R) => U.current.push(R),
          onProgress: ({ failed: R }) => {
            !r && R > 0 && w(`正文已加载 · ${R} 张图片不可用`);
          }
        });
      } catch (f) {
        if (r) return;
        w(f instanceof Error ? f.message : "Markdown 加载失败");
      }
    }
    async function A(M) {
      const m = n.current;
      if (!m) return;
      const $ = 262144, P = 8192, T = `${M.imagesBaseUrl || ""}`, f = m.closest(".reader-notes-panel-body"), j = new TextDecoder();
      let N = 0, x = `${M.etag || ""}`, F = Number.isFinite(Number(M.totalBytes)) ? Number(M.totalBytes) : null, k = "", L = !1;
      const Q = async (s) => {
        const { marked: v } = await ke();
        if (r || !n.current) return;
        const { text: R, slots: le } = me(s), ie = String(v.parse(R, { async: !1 })), Se = le.length > 0 ? await we(ie, le) : ie;
        if (r || !n.current) return;
        const G = m.ownerDocument.createElement("section");
        G.className = "reader-markdown-chunk";
        const Ue = ee(G, Se, T);
        m.appendChild(G), m.classList.remove("hidden");
        const de = te(G, O.current);
        de.length && E((D) => [...D, ...de]);
        const Ee = be(Ue, {
          root: f,
          protectedBaseUrl: T || m.ownerDocument.baseURI,
          fetchImage: fe,
          onObjectUrl: (D) => U.current.push(D),
          onProgress: ({ failed: D }) => {
            !r && D > 0 && w(`正文已加载 · ${D} 张图片不可用`);
          }
        });
        g.current.push(Ee);
      }, Z = async () => {
        p.current || !f || r || m.scrollHeight <= f.clientHeight * 2 || await new Promise((s) => {
          const v = () => {
            (m.scrollHeight <= f.clientHeight * 2 || f.scrollTop + f.clientHeight >= m.scrollHeight - 800) && (f.removeEventListener("scroll", v), e.current = null, s());
          };
          e.current = () => {
            f.removeEventListener("scroll", v), s();
          }, f.addEventListener("scroll", v, { passive: !0 });
        });
      };
      try {
        for (; !L && !r; ) {
          const s = await h.loadMarkdownRange(
            M.rawUrl,
            N,
            N + $ - 1,
            x || void 0
          );
          if (r) return;
          if (s.status === 404) {
            w("该任务暂无 Markdown 产物"), m.replaceChildren(), m.classList.add("hidden");
            return;
          }
          if (s.status === 200)
            m.replaceChildren(), E([]), O.current = /* @__PURE__ */ new Map(), k = j.decode(s.bytes, { stream: !1 }), L = !0;
          else if (s.status === 206) {
            if (x && s.etag && s.etag !== x) {
              m.replaceChildren(), E([]), O.current = /* @__PURE__ */ new Map(), k = "", N = 0, L = !1, x = s.etag;
              continue;
            }
            !x && s.etag && (x = s.etag), s.totalBytes != null && (F = s.totalBytes);
            const R = s.rangeEnd != null ? s.rangeEnd + 1 : N + s.bytes.length;
            L = F != null ? R >= F : s.bytes.length < $, k += j.decode(s.bytes, { stream: !L }), N = R;
          } else
            throw new Error(`读取 Markdown 失败，请稍后重试。(${s.status})`);
          let v = ge(k, { minChars: P });
          for (; v && !r; ) {
            if (k = v.rest, await Q(v.complete), r) return;
            await Z(), v = ge(k, { minChars: P });
          }
          L && k.trim() && (await Q(k), k = "");
        }
        r || (w(""), I.current.trim() && V(I.current));
      } catch (s) {
        if (r) return;
        w(s instanceof Error ? s.message : "Markdown 加载失败");
      }
    }
    return y(), () => {
      var M, m;
      r = !0, (M = i.current) == null || M.call(i), i.current = null, (m = e.current) == null || m.call(e), e.current = null;
      for (const $ of g.current) $();
      g.current = [];
    };
  }, [t, c, a]), /* @__PURE__ */ J(
    Oe,
    {
      id: "reader-markdown-panel",
      open: t,
      title: "Markdown",
      subtitle: l === "docked" ? "识别与翻译产出 · PDF / Markdown 分栏" : "识别与翻译产出 · 拖动可移动",
      titleIcon: /* @__PURE__ */ b(Re, { size: 14, strokeWidth: 2.25, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.markdown-float.pos.v1",
      ariaLabel: "Markdown 预览",
      width: 420,
      placement: l === "workspace" ? "workspace" : l === "docked" ? "dock-right" : "floating",
      showHeader: l !== "workspace",
      className: l === "workspace" ? `is-pane-${d}` : void 0,
      onClose: o,
      toolbar: /* @__PURE__ */ b("span", { className: "reader-notes-count", children: S || "已加载" }),
      children: [
        /* @__PURE__ */ J("div", { className: "reader-markdown-nav", "aria-label": "Markdown 导航与搜索", children: [
          /* @__PURE__ */ J("label", { className: "reader-markdown-search", children: [
            /* @__PURE__ */ b(Ae, { size: 13, "aria-hidden": !0 }),
            /* @__PURE__ */ b(
              "input",
              {
                type: "search",
                value: ne,
                placeholder: "搜索正文",
                "aria-label": "搜索 Markdown 正文",
                onChange: (r) => {
                  const h = r.target.value;
                  I.current = h, Me(h), V(h, !1);
                },
                onKeyDown: (r) => {
                  r.key !== "Enter" || B === 0 || (r.preventDefault(), K(W + (r.shiftKey ? -1 : 1)));
                }
              }
            ),
            ne ? /* @__PURE__ */ b("span", { className: "reader-markdown-search-count", "aria-live": "polite", children: B > 0 ? `${W + 1}/${B}` : "0/0" }) : null,
            /* @__PURE__ */ b(
              "button",
              {
                type: "button",
                "aria-label": "上一个搜索结果",
                disabled: B === 0,
                onClick: () => K(W - 1),
                children: /* @__PURE__ */ b(Le, { size: 13, "aria-hidden": !0 })
              }
            ),
            /* @__PURE__ */ b(
              "button",
              {
                type: "button",
                "aria-label": "下一个搜索结果",
                disabled: B === 0,
                onClick: () => K(W + 1),
                children: /* @__PURE__ */ b(Ce, { size: 13, "aria-hidden": !0 })
              }
            )
          ] }),
          /* @__PURE__ */ J(
            "button",
            {
              type: "button",
              className: "reader-markdown-outline-toggle",
              "aria-expanded": re,
              disabled: u.length === 0,
              onClick: () => ye((r) => !r),
              children: [
                /* @__PURE__ */ b(Ne, { size: 13, "aria-hidden": !0 }),
                "目录",
                u.length > 0 ? ` ${u.length}` : ""
              ]
            }
          )
        ] }),
        re && u.length > 0 ? /* @__PURE__ */ b("nav", { className: "reader-markdown-outline", "aria-label": "Markdown 目录", children: u.map((r) => /* @__PURE__ */ b(
          "button",
          {
            type: "button",
            style: { "--reader-md-outline-level": r.level - 1 },
            onClick: () => {
              var y;
              const h = [...((y = n.current) == null ? void 0 : y.querySelectorAll("h1, h2, h3, h4, h5, h6")) || []].find((A) => A.id === r.id);
              h && typeof h.scrollIntoView == "function" && h.scrollIntoView({ block: "start", behavior: "smooth" });
            },
            children: r.text
          },
          r.id
        )) }) : null,
        S && !((oe = (ce = n.current) == null ? void 0 : ce.childNodes) != null && oe.length) ? /* @__PURE__ */ b("p", { className: "reader-notes-empty", children: S }) : null,
        /* @__PURE__ */ b(
          "article",
          {
            ref: n,
            id: "reader-markdown-content",
            className: "reader-markdown-content reader-float-markdown-content"
          }
        )
      ]
    }
  );
}
export {
  Qe as ReaderMarkdownPanel,
  te as buildMarkdownOutline,
  qe as clearMarkdownSearchHighlights,
  Be as findMarkdownSearchTargets,
  De as isProtectedMarkdownAssetUrl,
  be as startMarkdownImageLoading
};
//# sourceMappingURL=ReaderMarkdownPanel-Cf2_DzhL.js.map
