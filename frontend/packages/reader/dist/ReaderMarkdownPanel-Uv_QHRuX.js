import { jsxs as Z, jsx as C } from "react/jsx-runtime";
import { useRef as R, useState as z, useEffect as he } from "react";
import { Search as Ce, ChevronUp as Ae, ChevronDown as Ue, ListTree as Le, FileCode2 as Ne } from "lucide-react";
import { r as Re, d as fe, e as me, b as Ie } from "./ReaderApp-Ds9tRSBd.js";
import { e as we, m as Oe, a as ge } from "./markdown-math-Cb17EyYs.js";
import { n as Se } from "./markdown-payload-kK3ewW_I.js";
const ke = "h1, h2, h3, h4, h5, h6, p, li, td, th, blockquote, pre";
function De(e) {
  e.querySelectorAll(".reader-markdown-search-hit, .reader-markdown-search-hit-active").forEach((r) => {
    r.classList.remove("reader-markdown-search-hit", "reader-markdown-search-hit-active");
  });
}
function xe(e, r) {
  De(e);
  const n = r.trim().toLocaleLowerCase();
  if (!n) return [];
  const o = [...e.querySelectorAll(ke)].filter((t) => [...t.children].some((d) => d.matches(ke)) ? !1 : (t.textContent || "").toLocaleLowerCase().includes(n));
  return o.forEach((t) => t.classList.add("reader-markdown-search-hit")), o;
}
function He(e) {
  return e.normalize("NFKC").trim().toLocaleLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-+|-+$/g, "") || "section";
}
function ce(e, r = /* @__PURE__ */ new Map()) {
  return [...e.querySelectorAll("h1, h2, h3, h4, h5, h6")].flatMap((n) => {
    const s = (n.textContent || "").replace(/\s+/g, " ").trim();
    if (!s) return [];
    const o = He(s), t = (r.get(o) || 0) + 1;
    r.set(o, t);
    const d = t === 1 ? `reader-md-${o}` : `reader-md-${o}-${t}`;
    return n.id = d, [{ id: d, level: Number(n.tagName.slice(1)), text: s }];
  });
}
function Te(e, r = "http://localhost/") {
  var n;
  if (/^mock:\/\//i.test(e)) return !0;
  try {
    const s = ((n = globalThis.location) == null ? void 0 : n.href) || "http://localhost/", o = new URL(r, s), t = new URL(e, o);
    if (!/\/api\/v1\/jobs\/[^/]+\/markdown\/images\//.test(t.pathname)) return !1;
    if (!/^[a-z][a-z\d+.-]*:/i.test(e)) return !0;
    const d = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(t.hostname);
    return t.origin === o.origin || d;
  } catch {
    return !1;
  }
}
function $e(e, r) {
  if (/^data:image\//i.test(e) || /^blob:/i.test(e)) return !0;
  try {
    const n = new URL(e, r);
    return n.protocol === "http:" || n.protocol === "https:";
  } catch {
    return !1;
  }
}
function be(e, r) {
  let n = !1, s = 0, o = 0, t = 0;
  const d = [], h = [], I = /* @__PURE__ */ new Set(), w = (a, E) => {
    const l = a.ownerDocument.createElement("span");
    l.className = "reader-markdown-image-missing", l.textContent = E, l.title = a.getAttribute("data-reader-md-src") || "", a.replaceWith(l);
  };
  for (const a of e) {
    const E = a.getAttribute("data-reader-md-src") || "", l = a.ownerDocument.baseURI || "http://localhost/";
    Te(E, r.protectedBaseUrl || l) ? h.push(a) : $e(E, l) ? a.src = E : w(a, "[图片地址不可用]");
  }
  const U = () => {
    var a;
    return (a = r.onProgress) == null ? void 0 : a.call(r, { failed: t, loaded: o, total: h.length });
  }, g = () => {
    if (!n)
      for (; s < 4 && d.length > 0; ) {
        const a = d.shift();
        if (!(a != null && a.isConnected)) continue;
        s += 1;
        const E = a.getAttribute("data-reader-md-src") || "";
        r.fetchImage(E, r.signal ? { signal: r.signal } : void 0).then(async (l) => {
          if (!(l != null && l.ok)) throw new Error(`HTTP ${(l == null ? void 0 : l.status) || 0}`);
          const D = URL.createObjectURL(await l.blob());
          if (n || !a.isConnected) {
            try {
              URL.revokeObjectURL(D);
            } catch {
            }
            return;
          }
          r.onObjectUrl(D), a.src = D, o += 1;
        }).catch(() => {
          n || !a.isConnected || (t += 1, w(a, "[图片暂不可用]"));
        }).finally(() => {
          s -= 1, n || (U(), g());
        });
      }
  }, L = (a) => {
    n || I.has(a) || (I.add(a), d.push(a), g());
  }, N = globalThis.IntersectionObserver;
  let b = null;
  return N && h.length > 0 ? (b = new N((a) => {
    a.forEach((E) => {
      if (!E.isIntersecting) return;
      const l = E.target;
      b == null || b.unobserve(l), L(l);
    });
  }, { root: r.root || null, rootMargin: "600px 0px" }), h.forEach((a) => b == null ? void 0 : b.observe(a))) : h.forEach(L), U(), () => {
    n = !0, d.length = 0, b == null || b.disconnect();
  };
}
let se = null;
function pe() {
  return se || (se = import("marked").catch((e) => {
    throw se = null, e;
  })), se;
}
function qe(e) {
  e.querySelectorAll("script, iframe, object, embed, style, link, meta, base, form, input, button, textarea, select").forEach((r) => r.remove()), e.querySelectorAll("*").forEach((r) => {
    for (const n of [...r.attributes])
      /^on/i.test(n.name) && r.removeAttribute(n.name);
  }), e.querySelectorAll("a[href]").forEach((r) => {
    const n = r;
    /^\s*javascript:/i.test(n.getAttribute("href") || "") && n.removeAttribute("href"), n.setAttribute("target", "_blank"), n.setAttribute("rel", "noopener noreferrer");
  });
}
function ue(e, r, n) {
  const s = e.ownerDocument.createElement("template");
  return s.innerHTML = r, qe(s.content), s.content.querySelectorAll("img[src]").forEach((o) => {
    const t = o.getAttribute("src") || "", d = Re(n, t) || t;
    o.setAttribute("data-reader-md-src", d), o.setAttribute("loading", "lazy"), o.setAttribute("decoding", "async"), o.removeAttribute("src");
  }), e.replaceChildren(s.content), e.classList.remove("hidden"), [...e.querySelectorAll("img[data-reader-md-src]")];
}
function ze(e, r) {
  let n = r;
  for (; n < e.length; ) {
    const s = e.indexOf(`
`, n), o = s === -1 ? e.length : s, t = e.slice(n, o).trim();
    if (t !== "") return t;
    if (s === -1) return null;
    n = s + 1;
  }
  return null;
}
const Be = /^\s{0,3}\[[^\]]+\]:/;
function Me(e) {
  const r = e.match(/^(?:([-*+])|(\d+)([.)]))\s+/);
  return r ? r[1] ? `ul:${r[1]}` : `ol:${r[3]}` : null;
}
function Pe(e, r, n) {
  const s = ze(e, r);
  if (!s) return !1;
  if (Be.test(s)) return !0;
  const o = n ? Me(n) : null, t = Me(s);
  return o != null && o === t;
}
function ye(e, { minChars: r = 16384 } = {}) {
  if (!e) return null;
  let n = "", s = null, o = 0;
  const t = e.length;
  for (; o < t; ) {
    const d = e.indexOf(`
`, o), h = d === -1 ? t : d, w = e.slice(o, h).trim(), U = w.match(/^(`{3,}|~{3,})/);
    if (U) {
      const g = U[1][0];
      n ? n === g && (n = "") : n = g;
    }
    if (!n && w === "") {
      const g = d === -1 ? t : d + 1;
      if (g >= r && !Pe(e, g, s))
        return { complete: e.slice(0, g), rest: e.slice(g) };
    } else w !== "" && (s = w);
    if (d === -1) break;
    o = d + 1;
  }
  return null;
}
function _e({
  open: e,
  jobId: r,
  sourceOnly: n,
  searchQueryRef: s,
  reapplySearchRef: o
}) {
  const t = R(null), [d, h] = z("尚未加载"), I = R([]), w = R(null), U = R(/* @__PURE__ */ new Map()), g = R([]), L = R(null), N = R(!1), b = R(!1), a = R(null), [E, l] = z([]), [D, B] = z(!1), [P, V] = z(!1), Q = () => {
    for (const c of I.current)
      try {
        URL.revokeObjectURL(c);
      } catch {
      }
    I.current = [];
  }, X = () => {
    var c, A;
    (c = w.current) == null || c.call(w), w.current = null;
    for (const f of g.current) f();
    g.current = [], (A = L.current) == null || A.call(L), L.current = null, Q();
  }, ee = () => {
    const c = t.current;
    c && (U.current = /* @__PURE__ */ new Map(), l(ce(c, U.current)));
  }, te = () => {
    const c = a.current, A = t.current;
    if (!c || !A) return;
    const f = [...A.querySelectorAll("h1, h2, h3, h4, h5, h6")].find(($) => $.id === c);
    f && (a.current = null, typeof f.scrollIntoView == "function" && f.scrollIntoView({ block: "start", behavior: "smooth" }));
  };
  return he(() => () => {
    var c;
    (c = w.current) == null || c.call(w), Q();
  }, []), he(() => {
    if (!e) {
      X(), l([]), b.current = !1, B(!1);
      return;
    }
    let c = !1;
    X(), U.current = /* @__PURE__ */ new Map(), b.current = !1, B(!1), l([]), N.current = !1, a.current = null, V(!1);
    const A = new AbortController(), f = fe;
    async function $() {
      var k, i, M, y, m, v;
      const S = r.startsWith("doc:");
      if (!r || S) {
        h(!r && n ? "源文档阅读不提供 Markdown 产物" : "该任务暂无 Markdown 产物"), t.current && (t.current.replaceChildren(), t.current.classList.add("hidden"));
        return;
      }
      h("正在加载 Markdown…"), (k = t.current) == null || k.replaceChildren(), (i = t.current) == null || i.classList.add("hidden");
      try {
        if (typeof (f == null ? void 0 : f.loadMarkdownSource) == "function" && typeof (f == null ? void 0 : f.loadMarkdownRange) == "function") {
          const p = await f.loadMarkdownSource(r, A.signal);
          if (c) return;
          if (p != null && p.rawUrl) {
            await re(p);
            return;
          }
        }
      } catch {
      }
      try {
        const p = await fe.loadMarkdownPayload(r);
        if (c) return;
        const { content: x, imagesBaseUrl: _ } = Se(p);
        if (!x.trim()) {
          h("该任务暂无 Markdown 产物"), (M = t.current) == null || M.replaceChildren(), (y = t.current) == null || y.classList.add("hidden");
          return;
        }
        const { marked: O } = await pe();
        if (c || !t.current) return;
        const { text: q, slots: F } = we(x), G = String(O.parse(q, { async: !1 })), J = Oe(G, F);
        ue(t.current, J, _), l(ce(t.current)), (m = o.current) == null || m.call(o), h(F.length > 0 ? `正文已显示 · 正在渲染 ${F.length} 个公式…` : "");
        const ne = F.length > 0 ? await ge(G, F) : G;
        if (c || !t.current) return;
        const oe = ue(t.current, ne, _);
        l(ce(t.current)), b.current = !0, B(!0), (v = o.current) == null || v.call(o), h("");
        const le = t.current.closest(".reader-notes-panel-body");
        w.current = be(oe, {
          root: le,
          protectedBaseUrl: _ || t.current.ownerDocument.baseURI,
          fetchImage: me,
          signal: A.signal,
          onObjectUrl: (j) => I.current.push(j),
          onProgress: ({ failed: j }) => {
            !c && j > 0 && h(`正文已加载 · ${j} 张图片不可用`);
          }
        });
      } catch (p) {
        if (c) return;
        h(p instanceof Error ? p.message : "Markdown 加载失败");
      }
    }
    async function re(S) {
      var j;
      const k = t.current;
      if (!k) return;
      const i = 262144, M = 8192, y = `${S.imagesBaseUrl || ""}`, m = k.closest(".reader-notes-panel-body");
      let v = new TextDecoder(), p = 0, x = `${S.etag || ""}`, _ = Number.isFinite(Number(S.totalBytes)) ? Number(S.totalBytes) : null, O = "", q = !1;
      const F = 4, G = 4e3;
      let J = 0;
      const ne = () => {
        for (const u of g.current) u();
        g.current = [], Q(), U.current = /* @__PURE__ */ new Map(), l([]);
      }, oe = async (u) => {
        const { marked: H } = await pe();
        if (c || !t.current) return;
        const { text: T, slots: K } = we(u), Y = String(H.parse(T, { async: !1 })), ie = K.length > 0 ? await ge(Y, K) : Y;
        if (c || !t.current) return;
        const ae = k.ownerDocument.createElement("section");
        ae.className = "reader-markdown-chunk";
        const ve = ue(ae, ie, y);
        k.appendChild(ae), k.classList.remove("hidden");
        const de = ce(ae, U.current);
        de.length && l((W) => [...W, ...de]), te();
        const Ee = be(ve, {
          root: m,
          protectedBaseUrl: y || k.ownerDocument.baseURI,
          fetchImage: me,
          signal: A.signal,
          onObjectUrl: (W) => I.current.push(W),
          onProgress: ({ failed: W }) => {
            !c && W > 0 && h(`正文已加载 · ${W} 张图片不可用`);
          }
        });
        g.current.push(Ee);
      }, le = async () => {
        N.current || !m || c || k.scrollHeight <= m.clientHeight * 2 || (V(!0), h("已加载部分 · 滚动或点击继续加载"), await new Promise((u) => {
          let H = !1, T = null;
          const K = (ie) => {
            H || (H = !0, m.removeEventListener("scroll", Y), T && (clearTimeout(T), T = null), L.current = null, c || (V(!1), ie && (J = 0)), u());
          }, Y = () => {
            (k.scrollHeight <= m.clientHeight * 2 || m.scrollTop + m.clientHeight >= k.scrollHeight - 800) && K(!0);
          };
          L.current = () => K(!0), m.addEventListener("scroll", Y, { passive: !0 }), J < F && (J += 1, T = setTimeout(() => K(!1), G));
        }));
      };
      try {
        for (; !q && !c; ) {
          const u = await f.loadMarkdownRange(
            S.rawUrl,
            p,
            p + i - 1,
            x || void 0,
            A.signal
          );
          if (c) return;
          if (u.status === 404) {
            h("该任务暂无 Markdown 产物"), k.replaceChildren(), k.classList.add("hidden");
            return;
          }
          if (u.status === 200)
            k.replaceChildren(), ne(), v = new TextDecoder(), O = v.decode(u.bytes, { stream: !1 }), q = !0;
          else if (u.status === 206) {
            if (x && u.etag && u.etag !== x) {
              k.replaceChildren(), ne(), v = new TextDecoder(), O = "", p = 0, q = !1, x = u.etag;
              continue;
            }
            !x && u.etag && (x = u.etag), u.totalBytes != null && (_ = u.totalBytes);
            const T = u.rangeEnd != null ? u.rangeEnd + 1 : p + u.bytes.length;
            q = _ != null ? T >= _ : u.bytes.length < i, O += v.decode(u.bytes, { stream: !q }), p = T;
          } else
            throw new Error(`读取 Markdown 失败，请稍后重试。(${u.status})`);
          let H = ye(O, { minChars: M });
          for (; H && !c; ) {
            if (O = H.rest, await oe(H.complete), c) return;
            await le(), H = ye(O, { minChars: M });
          }
          q && O.trim() && (await oe(O), O = "");
        }
        c || (ee(), b.current = !0, B(!0), te(), h(""), s.current.trim() && ((j = o.current) == null || j.call(o)));
      } catch (u) {
        if (c || A.signal.aborted) return;
        h(u instanceof Error ? u.message : "Markdown 加载失败");
      }
    }
    return $(), () => {
      c = !0, A.abort(), X();
    };
  }, [e, r, n]), {
    contentRef: t,
    status: d,
    setStatus: h,
    outline: E,
    setOutline: l,
    outlineComplete: D,
    setOutlineComplete: B,
    outlineCompleteRef: b,
    pendingResume: P,
    rebuildOutline: ee,
    renderAllRef: N,
    pendingAnchorRef: a,
    resumeCleanupRef: L
  };
}
function Xe({
  open: e,
  jobId: r,
  sourceOnly: n,
  layout: s = "floating",
  side: o = "right",
  onClose: t
}) {
  var S, k;
  const d = R([]), h = R(""), I = R(() => {
  }), [w, U] = z(!1), [g, L] = z(""), [N, b] = z(0), [a, E] = z(-1), {
    contentRef: l,
    status: D,
    setStatus: B,
    outline: P,
    outlineComplete: V,
    setOutlineComplete: Q,
    outlineCompleteRef: X,
    pendingResume: ee,
    rebuildOutline: te,
    renderAllRef: c,
    pendingAnchorRef: A,
    resumeCleanupRef: f
  } = _e({
    open: e,
    jobId: r,
    sourceOnly: n,
    searchQueryRef: h,
    reapplySearchRef: I
  }), $ = (i, M = !0) => {
    const y = d.current;
    if (y.forEach((p) => p.classList.remove("reader-markdown-search-hit-active")), y.length === 0) {
      E(-1);
      return;
    }
    const m = (i + y.length) % y.length, v = y[m];
    v.classList.add("reader-markdown-search-hit-active"), E(m), M && typeof v.scrollIntoView == "function" && v.scrollIntoView({ block: "center", behavior: "smooth" });
  }, re = (i, M = !1) => {
    var v;
    const y = `${i || ""}`.trim();
    if (c.current = y.length > 0, c.current && ((v = f.current) == null || v.call(f)), !l.current) return;
    const m = xe(l.current, i);
    d.current = m, b(m.length), $(m.length > 0 ? 0 : -1, M);
  };
  return I.current = () => re(h.current), /* @__PURE__ */ Z(
    Ie,
    {
      id: "reader-markdown-panel",
      open: e,
      title: "Markdown",
      subtitle: s === "docked" ? "识别与翻译产出 · PDF / Markdown 分栏" : "识别与翻译产出 · 拖动可移动",
      titleIcon: /* @__PURE__ */ C(Ne, { size: 14, strokeWidth: 2.25, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.markdown-float.pos.v1",
      ariaLabel: "Markdown 预览",
      width: 420,
      placement: s === "workspace" ? "workspace" : s === "docked" ? "dock-right" : "floating",
      showHeader: s !== "workspace",
      className: s === "workspace" ? `is-pane-${o}` : void 0,
      onClose: t,
      toolbar: /* @__PURE__ */ C("span", { className: "reader-notes-count", children: D || "已加载" }),
      children: [
        /* @__PURE__ */ Z("div", { className: "reader-markdown-nav", "aria-label": "Markdown 导航与搜索", children: [
          /* @__PURE__ */ Z("label", { className: "reader-markdown-search", children: [
            /* @__PURE__ */ C(Ce, { size: 13, "aria-hidden": !0 }),
            /* @__PURE__ */ C(
              "input",
              {
                type: "search",
                value: g,
                placeholder: "搜索正文",
                "aria-label": "搜索 Markdown 正文",
                onChange: (i) => {
                  const M = i.target.value;
                  h.current = M, L(M), re(M, !1);
                },
                onKeyDown: (i) => {
                  i.key !== "Enter" || N === 0 || (i.preventDefault(), $(a + (i.shiftKey ? -1 : 1)));
                }
              }
            ),
            g ? /* @__PURE__ */ C("span", { className: "reader-markdown-search-count", "aria-live": "polite", children: N > 0 ? `${a + 1}/${N}` : "0/0" }) : null,
            /* @__PURE__ */ C(
              "button",
              {
                type: "button",
                "aria-label": "上一个搜索结果",
                disabled: N === 0,
                onClick: () => $(a - 1),
                children: /* @__PURE__ */ C(Ae, { size: 13, "aria-hidden": !0 })
              }
            ),
            /* @__PURE__ */ C(
              "button",
              {
                type: "button",
                "aria-label": "下一个搜索结果",
                disabled: N === 0,
                onClick: () => $(a + 1),
                children: /* @__PURE__ */ C(Ue, { size: 13, "aria-hidden": !0 })
              }
            )
          ] }),
          /* @__PURE__ */ Z(
            "button",
            {
              type: "button",
              className: "reader-markdown-outline-toggle",
              "aria-expanded": w,
              disabled: P.length === 0,
              onClick: () => {
                te(), Q(X.current), U((i) => !i);
              },
              children: [
                /* @__PURE__ */ C(Le, { size: 13, "aria-hidden": !0 }),
                "目录",
                P.length > 0 ? ` ${P.length}` : ""
              ]
            }
          ),
          ee ? /* @__PURE__ */ C(
            "button",
            {
              type: "button",
              className: "reader-markdown-resume",
              onClick: () => {
                var i;
                return (i = f.current) == null ? void 0 : i.call(f);
              },
              children: "继续加载"
            }
          ) : null
        ] }),
        w && P.length > 0 ? /* @__PURE__ */ Z("nav", { className: "reader-markdown-outline", "aria-label": "Markdown 目录", children: [
          V ? null : /* @__PURE__ */ C("p", { className: "reader-markdown-outline-note", children: "仅显示已加载内容，滚动可加载更多" }),
          P.map((i) => /* @__PURE__ */ C(
            "button",
            {
              type: "button",
              style: { "--reader-md-outline-level": i.level - 1 },
              onClick: () => {
                var y, m;
                const M = [...((y = l.current) == null ? void 0 : y.querySelectorAll("h1, h2, h3, h4, h5, h6")) || []].find((v) => v.id === i.id);
                if (M && typeof M.scrollIntoView == "function") {
                  M.scrollIntoView({ block: "start", behavior: "smooth" });
                  return;
                }
                A.current = i.id, c.current = !0, (m = f.current) == null || m.call(f), B("正在加载目标章节…");
              },
              children: i.text
            },
            i.id
          ))
        ] }) : null,
        D && !((k = (S = l.current) == null ? void 0 : S.childNodes) != null && k.length) ? /* @__PURE__ */ C("p", { className: "reader-notes-empty", children: D }) : null,
        /* @__PURE__ */ C(
          "article",
          {
            ref: l,
            id: "reader-markdown-content",
            className: "reader-markdown-content reader-float-markdown-content"
          }
        )
      ]
    }
  );
}
export {
  Xe as ReaderMarkdownPanel,
  ce as buildMarkdownOutline,
  De as clearMarkdownSearchHighlights,
  xe as findMarkdownSearchTargets,
  Te as isProtectedMarkdownAssetUrl,
  be as startMarkdownImageLoading
};
//# sourceMappingURL=ReaderMarkdownPanel-Uv_QHRuX.js.map
