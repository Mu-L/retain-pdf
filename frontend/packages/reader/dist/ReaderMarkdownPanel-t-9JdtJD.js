import { jsxs as J, jsx as b } from "react/jsx-runtime";
import { useRef as S, useState as T, useEffect as ye } from "react";
import { Search as qe, ChevronUp as ze, ChevronDown as Be, ListTree as Pe, FileCode2 as _e } from "lucide-react";
import { b as Fe, d as Me, e as ve, r as je } from "./ReaderApp-D8gLVCsS.js";
import { e as Ee, m as Ke, a as Ue } from "./markdown-math-Cb17EyYs.js";
import { n as We } from "./markdown-payload-kK3ewW_I.js";
function Ve(t, r) {
  let n = r;
  for (; n < t.length; ) {
    const o = t.indexOf(`
`, n), l = o === -1 ? t.length : o, s = t.slice(n, l).trim();
    if (s !== "") return s;
    if (o === -1) return null;
    n = o + 1;
  }
  return null;
}
const Qe = /^\s{0,3}\[[^\]]+\]:/;
function Se(t) {
  const r = t.match(/^(?:([-*+])|(\d+)([.)]))\s+/);
  return r ? r[1] ? `ul:${r[1]}` : `ol:${r[3]}` : null;
}
function Xe(t, r, n) {
  const o = Ve(t, r);
  if (!o) return !1;
  if (Qe.test(o)) return !0;
  const l = n ? Se(n) : null, s = Se(o);
  return l != null && l === s;
}
function Ae(t, { minChars: r = 16384 } = {}) {
  if (!t) return null;
  let n = "", o = null, l = 0;
  const s = t.length;
  for (; l < s; ) {
    const a = t.indexOf(`
`, l), U = a === -1 ? s : a, E = t.slice(l, U).trim(), y = E.match(/^(`{3,}|~{3,})/);
    if (y) {
      const M = y[1][0];
      n ? n === M && (n = "") : n = M;
    }
    if (!n && E === "") {
      const M = a === -1 ? s : a + 1;
      if (M >= r && !Xe(t, M, o))
        return { complete: t.slice(0, M), rest: t.slice(M) };
    } else E !== "" && (o = E);
    if (a === -1) break;
    l = a + 1;
  }
  return null;
}
let ne = null;
function Ce() {
  return ne || (ne = import("marked").catch((t) => {
    throw ne = null, t;
  })), ne;
}
function Ge(t) {
  t.querySelectorAll("script, iframe, object, embed, style, link, meta, base, form, input, button, textarea, select").forEach((r) => r.remove()), t.querySelectorAll("*").forEach((r) => {
    for (const n of [...r.attributes])
      /^on/i.test(n.name) && r.removeAttribute(n.name);
  }), t.querySelectorAll("a[href]").forEach((r) => {
    const n = r;
    /^\s*javascript:/i.test(n.getAttribute("href") || "") && n.removeAttribute("href"), n.setAttribute("target", "_blank"), n.setAttribute("rel", "noopener noreferrer");
  });
}
function de(t, r, n) {
  const o = t.ownerDocument.createElement("template");
  return o.innerHTML = r, Ge(o.content), o.content.querySelectorAll("img[src]").forEach((l) => {
    const s = l.getAttribute("src") || "", a = je(n, s) || s;
    l.setAttribute("data-reader-md-src", a), l.setAttribute("loading", "lazy"), l.setAttribute("decoding", "async"), l.removeAttribute("src");
  }), t.replaceChildren(o.content), t.classList.remove("hidden"), [...t.querySelectorAll("img[data-reader-md-src]")];
}
function Je(t, r = "http://localhost/") {
  var n;
  if (/^mock:\/\//i.test(t)) return !0;
  try {
    const o = ((n = globalThis.location) == null ? void 0 : n.href) || "http://localhost/", l = new URL(r, o), s = new URL(t, l);
    if (!/\/api\/v1\/jobs\/[^/]+\/markdown\/images\//.test(s.pathname)) return !1;
    if (!/^[a-z][a-z\d+.-]*:/i.test(t)) return !0;
    const a = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(s.hostname);
    return s.origin === l.origin || a;
  } catch {
    return !1;
  }
}
function Ye(t) {
  return t.normalize("NFKC").trim().toLocaleLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-+|-+$/g, "") || "section";
}
function ae(t, r = /* @__PURE__ */ new Map()) {
  return [...t.querySelectorAll("h1, h2, h3, h4, h5, h6")].flatMap((n) => {
    const o = (n.textContent || "").replace(/\s+/g, " ").trim();
    if (!o) return [];
    const l = Ye(o), s = (r.get(l) || 0) + 1;
    r.set(l, s);
    const a = s === 1 ? `reader-md-${l}` : `reader-md-${l}-${s}`;
    return n.id = a, [{ id: a, level: Number(n.tagName.slice(1)), text: o }];
  });
}
const Le = "h1, h2, h3, h4, h5, h6, p, li, td, th, blockquote, pre";
function Ze(t) {
  t.querySelectorAll(".reader-markdown-search-hit, .reader-markdown-search-hit-active").forEach((r) => {
    r.classList.remove("reader-markdown-search-hit", "reader-markdown-search-hit-active");
  });
}
function et(t, r) {
  Ze(t);
  const n = r.trim().toLocaleLowerCase();
  if (!n) return [];
  const l = [...t.querySelectorAll(Le)].filter((s) => [...s.children].some((a) => a.matches(Le)) ? !1 : (s.textContent || "").toLocaleLowerCase().includes(n));
  return l.forEach((s) => s.classList.add("reader-markdown-search-hit")), l;
}
function Re(t, r) {
  let n = !1, o = 0, l = 0, s = 0;
  const a = [], U = [], m = /* @__PURE__ */ new Set(), E = (c, g) => {
    const d = c.ownerDocument.createElement("span");
    d.className = "reader-markdown-image-missing", d.textContent = g, d.title = c.getAttribute("data-reader-md-src") || "", c.replaceWith(d);
  };
  for (const c of t) {
    const g = c.getAttribute("data-reader-md-src") || "", d = c.ownerDocument.baseURI || "http://localhost/";
    Je(g, r.protectedBaseUrl || d) ? U.push(c) : tt(g, d) ? c.src = g : E(c, "[图片地址不可用]");
  }
  const y = () => {
    var c;
    return (c = r.onProgress) == null ? void 0 : c.call(r, { failed: s, loaded: l, total: U.length });
  }, M = () => {
    if (!n)
      for (; o < 4 && a.length > 0; ) {
        const c = a.shift();
        if (!(c != null && c.isConnected)) continue;
        o += 1;
        const g = c.getAttribute("data-reader-md-src") || "";
        r.fetchImage(g, r.signal ? { signal: r.signal } : void 0).then(async (d) => {
          if (!(d != null && d.ok)) throw new Error(`HTTP ${(d == null ? void 0 : d.status) || 0}`);
          const D = URL.createObjectURL(await d.blob());
          if (n || !c.isConnected) {
            try {
              URL.revokeObjectURL(D);
            } catch {
            }
            return;
          }
          r.onObjectUrl(D), c.src = D, l += 1;
        }).catch(() => {
          n || !c.isConnected || (s += 1, E(c, "[图片暂不可用]"));
        }).finally(() => {
          o -= 1, n || (y(), M());
        });
      }
  }, O = (c) => {
    n || m.has(c) || (m.add(c), a.push(c), M());
  }, x = globalThis.IntersectionObserver;
  let w = null;
  return x && U.length > 0 ? (w = new x((c) => {
    c.forEach((g) => {
      if (!g.isIntersecting) return;
      const d = g.target;
      w == null || w.unobserve(d), O(d);
    });
  }, { root: r.root || null, rootMargin: "600px 0px" }), U.forEach((c) => w == null ? void 0 : w.observe(c))) : U.forEach(O), y(), () => {
    n = !0, a.length = 0, w == null || w.disconnect();
  };
}
function tt(t, r) {
  if (/^data:image\//i.test(t) || /^blob:/i.test(t)) return !0;
  try {
    const n = new URL(t, r);
    return n.protocol === "http:" || n.protocol === "https:";
  } catch {
    return !1;
  }
}
function st({
  open: t,
  jobId: r,
  sourceOnly: n,
  layout: o = "floating",
  side: l = "right",
  onClose: s
}) {
  var ke, pe;
  const a = S(null), [U, m] = T("尚未加载"), E = S([]), y = S(null), M = S([]), O = S(""), x = S(/* @__PURE__ */ new Map()), w = S([]), c = S(null), g = S(!1), d = S(!1), D = S(null), [_, $] = T([]), [Ne, F] = T(!1), [he, Ie] = T(!1), [Oe, ce] = T(!1), [fe, xe] = T(""), [j, De] = T(0), [Y, me] = T(-1), oe = () => {
    for (const e of E.current)
      try {
        URL.revokeObjectURL(e);
      } catch {
      }
    E.current = [];
  }, le = () => {
    var e, h;
    (e = y.current) == null || e.call(y), y.current = null;
    for (const u of w.current) u();
    w.current = [], (h = c.current) == null || h.call(c), c.current = null, oe();
  }, we = () => {
    const e = a.current;
    e && (x.current = /* @__PURE__ */ new Map(), $(ae(e, x.current)));
  }, ge = () => {
    const e = D.current, h = a.current;
    if (!e || !h) return;
    const u = [...h.querySelectorAll("h1, h2, h3, h4, h5, h6")].find((v) => v.id === e);
    u && (D.current = null, typeof u.scrollIntoView == "function" && u.scrollIntoView({ block: "start", behavior: "smooth" }));
  }, Z = (e, h = !0) => {
    const u = M.current;
    if (u.forEach((L) => L.classList.remove("reader-markdown-search-hit-active")), u.length === 0) {
      me(-1);
      return;
    }
    const v = (e + u.length) % u.length, A = u[v];
    A.classList.add("reader-markdown-search-hit-active"), me(v), h && typeof A.scrollIntoView == "function" && A.scrollIntoView({ block: "center", behavior: "smooth" });
  }, ee = (e, h = !1) => {
    var A;
    const u = `${e || ""}`.trim();
    if (g.current = u.length > 0, g.current && ((A = c.current) == null || A.call(c)), !a.current) return;
    const v = et(a.current, e);
    M.current = v, De(v.length), Z(v.length > 0 ? 0 : -1, h);
  };
  return ye(() => () => {
    var e;
    (e = y.current) == null || e.call(y), oe();
  }, []), ye(() => {
    if (!t) {
      le(), $([]), d.current = !1, F(!1);
      return;
    }
    let e = !1;
    le(), x.current = /* @__PURE__ */ new Map(), d.current = !1, F(!1), $([]), g.current = !1, D.current = null, ce(!1);
    const h = new AbortController(), u = Me;
    async function v() {
      var k, K, W, V;
      const L = r.startsWith("doc:");
      if (!r || L) {
        m(!r && n ? "源文档阅读不提供 Markdown 产物" : "该任务暂无 Markdown 产物"), a.current && (a.current.replaceChildren(), a.current.classList.add("hidden"));
        return;
      }
      m("正在加载 Markdown…"), (k = a.current) == null || k.replaceChildren(), (K = a.current) == null || K.classList.add("hidden");
      try {
        if (typeof (u == null ? void 0 : u.loadMarkdownSource) == "function" && typeof (u == null ? void 0 : u.loadMarkdownRange) == "function") {
          const f = await u.loadMarkdownSource(r, h.signal);
          if (e) return;
          if (f != null && f.rawUrl) {
            await A(f);
            return;
          }
        }
      } catch {
      }
      try {
        const f = await Me.loadMarkdownPayload(r);
        if (e) return;
        const { content: q, imagesBaseUrl: R } = We(f);
        if (!q.trim()) {
          m("该任务暂无 Markdown 产物"), (W = a.current) == null || W.replaceChildren(), (V = a.current) == null || V.classList.add("hidden");
          return;
        }
        const { marked: H } = await Ce();
        if (e || !a.current) return;
        const { text: Q, slots: p } = Ee(q), C = String(H.parse(Q, { async: !1 })), se = Ke(C, p);
        de(a.current, se, R), $(ae(a.current)), ee(O.current), m(p.length > 0 ? `正文已显示 · 正在渲染 ${p.length} 个公式…` : "");
        const ie = p.length > 0 ? await Ue(C, p) : C;
        if (e || !a.current) return;
        const X = de(a.current, ie, R);
        $(ae(a.current)), d.current = !0, F(!0), ee(O.current), m("");
        const te = a.current.closest(".reader-notes-panel-body");
        y.current = Re(X, {
          root: te,
          protectedBaseUrl: R || a.current.ownerDocument.baseURI,
          fetchImage: ve,
          signal: h.signal,
          onObjectUrl: (z) => E.current.push(z),
          onProgress: ({ failed: z }) => {
            !e && z > 0 && m(`正文已加载 · ${z} 张图片不可用`);
          }
        });
      } catch (f) {
        if (e) return;
        m(f instanceof Error ? f.message : "Markdown 加载失败");
      }
    }
    async function A(L) {
      const k = a.current;
      if (!k) return;
      const K = 262144, W = 8192, V = `${L.imagesBaseUrl || ""}`, f = k.closest(".reader-notes-panel-body");
      let q = new TextDecoder(), R = 0, H = `${L.etag || ""}`, Q = Number.isFinite(Number(L.totalBytes)) ? Number(L.totalBytes) : null, p = "", C = !1;
      const se = 4, ie = 4e3;
      let X = 0;
      const te = () => {
        for (const i of w.current) i();
        w.current = [], oe(), x.current = /* @__PURE__ */ new Map(), $([]);
      }, z = async (i) => {
        const { marked: N } = await Ce();
        if (e || !a.current) return;
        const { text: I, slots: B } = Ee(i), G = String(N.parse(I, { async: !1 })), ue = B.length > 0 ? await Ue(G, B) : G;
        if (e || !a.current) return;
        const re = k.ownerDocument.createElement("section");
        re.className = "reader-markdown-chunk";
        const Te = de(re, ue, V);
        k.appendChild(re), k.classList.remove("hidden");
        const be = ae(re, x.current);
        be.length && $((P) => [...P, ...be]), ge();
        const $e = Re(Te, {
          root: f,
          protectedBaseUrl: V || k.ownerDocument.baseURI,
          fetchImage: ve,
          signal: h.signal,
          onObjectUrl: (P) => E.current.push(P),
          onProgress: ({ failed: P }) => {
            !e && P > 0 && m(`正文已加载 · ${P} 张图片不可用`);
          }
        });
        w.current.push($e);
      }, He = async () => {
        g.current || !f || e || k.scrollHeight <= f.clientHeight * 2 || (ce(!0), m("已加载部分 · 滚动或点击继续加载"), await new Promise((i) => {
          let N = !1, I = null;
          const B = (ue) => {
            N || (N = !0, f.removeEventListener("scroll", G), I && (clearTimeout(I), I = null), c.current = null, e || (ce(!1), ue && (X = 0)), i());
          }, G = () => {
            (k.scrollHeight <= f.clientHeight * 2 || f.scrollTop + f.clientHeight >= k.scrollHeight - 800) && B(!0);
          };
          c.current = () => B(!0), f.addEventListener("scroll", G, { passive: !0 }), X < se && (X += 1, I = setTimeout(() => B(!1), ie));
        }));
      };
      try {
        for (; !C && !e; ) {
          const i = await u.loadMarkdownRange(
            L.rawUrl,
            R,
            R + K - 1,
            H || void 0,
            h.signal
          );
          if (e) return;
          if (i.status === 404) {
            m("该任务暂无 Markdown 产物"), k.replaceChildren(), k.classList.add("hidden");
            return;
          }
          if (i.status === 200)
            k.replaceChildren(), te(), q = new TextDecoder(), p = q.decode(i.bytes, { stream: !1 }), C = !0;
          else if (i.status === 206) {
            if (H && i.etag && i.etag !== H) {
              k.replaceChildren(), te(), q = new TextDecoder(), p = "", R = 0, C = !1, H = i.etag;
              continue;
            }
            !H && i.etag && (H = i.etag), i.totalBytes != null && (Q = i.totalBytes);
            const I = i.rangeEnd != null ? i.rangeEnd + 1 : R + i.bytes.length;
            C = Q != null ? I >= Q : i.bytes.length < K, p += q.decode(i.bytes, { stream: !C }), R = I;
          } else
            throw new Error(`读取 Markdown 失败，请稍后重试。(${i.status})`);
          let N = Ae(p, { minChars: W });
          for (; N && !e; ) {
            if (p = N.rest, await z(N.complete), e) return;
            await He(), N = Ae(p, { minChars: W });
          }
          C && p.trim() && (await z(p), p = "");
        }
        e || (we(), d.current = !0, F(!0), ge(), m(""), O.current.trim() && ee(O.current));
      } catch (i) {
        if (e || h.signal.aborted) return;
        m(i instanceof Error ? i.message : "Markdown 加载失败");
      }
    }
    return v(), () => {
      e = !0, h.abort(), le();
    };
  }, [t, r, n]), /* @__PURE__ */ J(
    Fe,
    {
      id: "reader-markdown-panel",
      open: t,
      title: "Markdown",
      subtitle: o === "docked" ? "识别与翻译产出 · PDF / Markdown 分栏" : "识别与翻译产出 · 拖动可移动",
      titleIcon: /* @__PURE__ */ b(_e, { size: 14, strokeWidth: 2.25, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.markdown-float.pos.v1",
      ariaLabel: "Markdown 预览",
      width: 420,
      placement: o === "workspace" ? "workspace" : o === "docked" ? "dock-right" : "floating",
      showHeader: o !== "workspace",
      className: o === "workspace" ? `is-pane-${l}` : void 0,
      onClose: s,
      toolbar: /* @__PURE__ */ b("span", { className: "reader-notes-count", children: U || "已加载" }),
      children: [
        /* @__PURE__ */ J("div", { className: "reader-markdown-nav", "aria-label": "Markdown 导航与搜索", children: [
          /* @__PURE__ */ J("label", { className: "reader-markdown-search", children: [
            /* @__PURE__ */ b(qe, { size: 13, "aria-hidden": !0 }),
            /* @__PURE__ */ b(
              "input",
              {
                type: "search",
                value: fe,
                placeholder: "搜索正文",
                "aria-label": "搜索 Markdown 正文",
                onChange: (e) => {
                  const h = e.target.value;
                  O.current = h, xe(h), ee(h, !1);
                },
                onKeyDown: (e) => {
                  e.key !== "Enter" || j === 0 || (e.preventDefault(), Z(Y + (e.shiftKey ? -1 : 1)));
                }
              }
            ),
            fe ? /* @__PURE__ */ b("span", { className: "reader-markdown-search-count", "aria-live": "polite", children: j > 0 ? `${Y + 1}/${j}` : "0/0" }) : null,
            /* @__PURE__ */ b(
              "button",
              {
                type: "button",
                "aria-label": "上一个搜索结果",
                disabled: j === 0,
                onClick: () => Z(Y - 1),
                children: /* @__PURE__ */ b(ze, { size: 13, "aria-hidden": !0 })
              }
            ),
            /* @__PURE__ */ b(
              "button",
              {
                type: "button",
                "aria-label": "下一个搜索结果",
                disabled: j === 0,
                onClick: () => Z(Y + 1),
                children: /* @__PURE__ */ b(Be, { size: 13, "aria-hidden": !0 })
              }
            )
          ] }),
          /* @__PURE__ */ J(
            "button",
            {
              type: "button",
              className: "reader-markdown-outline-toggle",
              "aria-expanded": he,
              disabled: _.length === 0,
              onClick: () => {
                we(), F(d.current), Ie((e) => !e);
              },
              children: [
                /* @__PURE__ */ b(Pe, { size: 13, "aria-hidden": !0 }),
                "目录",
                _.length > 0 ? ` ${_.length}` : ""
              ]
            }
          ),
          Oe ? /* @__PURE__ */ b(
            "button",
            {
              type: "button",
              className: "reader-markdown-resume",
              onClick: () => {
                var e;
                return (e = c.current) == null ? void 0 : e.call(c);
              },
              children: "继续加载"
            }
          ) : null
        ] }),
        he && _.length > 0 ? /* @__PURE__ */ J("nav", { className: "reader-markdown-outline", "aria-label": "Markdown 目录", children: [
          Ne ? null : /* @__PURE__ */ b("p", { className: "reader-markdown-outline-note", children: "仅显示已加载内容，滚动可加载更多" }),
          _.map((e) => /* @__PURE__ */ b(
            "button",
            {
              type: "button",
              style: { "--reader-md-outline-level": e.level - 1 },
              onClick: () => {
                var u, v;
                const h = [...((u = a.current) == null ? void 0 : u.querySelectorAll("h1, h2, h3, h4, h5, h6")) || []].find((A) => A.id === e.id);
                if (h && typeof h.scrollIntoView == "function") {
                  h.scrollIntoView({ block: "start", behavior: "smooth" });
                  return;
                }
                D.current = e.id, g.current = !0, (v = c.current) == null || v.call(c), m("正在加载目标章节…");
              },
              children: e.text
            },
            e.id
          ))
        ] }) : null,
        U && !((pe = (ke = a.current) == null ? void 0 : ke.childNodes) != null && pe.length) ? /* @__PURE__ */ b("p", { className: "reader-notes-empty", children: U }) : null,
        /* @__PURE__ */ b(
          "article",
          {
            ref: a,
            id: "reader-markdown-content",
            className: "reader-markdown-content reader-float-markdown-content"
          }
        )
      ]
    }
  );
}
export {
  st as ReaderMarkdownPanel,
  ae as buildMarkdownOutline,
  Ze as clearMarkdownSearchHighlights,
  et as findMarkdownSearchTargets,
  Je as isProtectedMarkdownAssetUrl,
  Re as startMarkdownImageLoading
};
//# sourceMappingURL=ReaderMarkdownPanel-t-9JdtJD.js.map
