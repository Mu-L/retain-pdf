import { jsxs as T, jsx as f, Fragment as tt } from "react/jsx-runtime";
import { useState as M, useEffect as U, useMemo as K, useCallback as N, useRef as _, useLayoutEffect as rt, memo as nt, forwardRef as Nt, useImperativeHandle as Tt, useId as ot, Suspense as Pt, lazy as ve } from "react";
import { getReaderAdapters as Y, requireAdapter as le } from "./adapters.js";
import { resolveReaderDownloadName as Et, resolveReaderDownloadUrls as At, createReaderServerFavoritesPort as It, READER_PROGRESS_COPY as te, trimString as be, READER_DOWNLOAD_ACTIONS as kt, disabledReason as Dt } from "./runtime/state.js";
import { d as Ft } from "./ask-answerer-zlx4r3po.js";
import "@retainpdf/api/conversations";
import { n as Je } from "./block-key-BTxcG28S.js";
import { toast as Ce, Toaster as Ot } from "sonner";
import { o as xt } from "./answer-enhance-C1inCPcI.js";
import { X as Ne, FileText as at, Languages as st, Columns2 as ct, StickyNote as it, Keyboard as _t, Sparkles as $t, FileCode2 as Lt, Bookmark as Ct, Download as Ut } from "lucide-react";
import { pdfjs as Bt, Page as Wt, Document as Ht } from "react-pdf";
const jt = (...e) => {
  var t, r;
  return ((r = (t = Y()) == null ? void 0 : t.isMockMode) == null ? void 0 : r.call(t, ...e)) ?? !1;
}, zt = "", qt = Object.freeze({
  progress: "retainpdf-reader-progress"
}), Oe = (e) => {
  var t, r;
  return ((r = (t = Y()) == null ? void 0 : t.resolveResourceUrl) == null ? void 0 : r.call(t, e)) ?? e;
}, Kt = (...e) => {
  var t, r;
  return ((r = (t = Y()) == null ? void 0 : t.fetchProtected) == null ? void 0 : r.call(t, ...e)) ?? fetch(...e);
}, Ue = (e = "") => {
  var t, r;
  return ((r = (t = Y()) == null ? void 0 : t.resolvePdfjsVendorUrl) == null ? void 0 : r.call(t, e)) ?? "";
}, Me = new Proxy({}, { get: (e, t) => (...r) => {
  var n, a, o;
  return (o = (a = (n = Y()) == null ? void 0 : n.defaultReaderDataPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...r);
} }), lt = new Proxy({}, { get: (e, t) => (...r) => {
  var n, a, o;
  return (o = (a = (n = Y()) == null ? void 0 : n.defaultReaderPageConfigPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...r);
} }), Jt = (...e) => {
  var t, r;
  return ((r = (t = Y()) == null ? void 0 : t.resolveReaderAnchor) == null ? void 0 : r.call(t, ...e)) ?? null;
}, Zt = () => {
  var e, t;
  return ((t = (e = Y()) == null ? void 0 : e.resolveReaderDocumentId) == null ? void 0 : t.call(e)) ?? "";
}, Yt = (...e) => {
  var t, r;
  return ((r = (t = Y()) == null ? void 0 : t.resolveReaderJobId) == null ? void 0 : r.call(t, ...e)) ?? "";
}, Xt = (...e) => {
  var t, r;
  return ((r = (t = Y()) == null ? void 0 : t.resolveReaderArtifactUrl) == null ? void 0 : r.call(t, ...e)) ?? "";
}, Gt = (...e) => {
  var t, r;
  return ((r = (t = Y()) == null ? void 0 : t.resolveReaderSourcePdf) == null ? void 0 : r.call(t, ...e)) ?? null;
}, Vt = (...e) => {
  var t, r;
  return ((r = (t = Y()) == null ? void 0 : t.resolveReaderTranslatedPdfUrl) == null ? void 0 : r.call(t, ...e)) ?? "";
}, Qt = (...e) => {
  var t, r;
  return ((r = (t = Y()) == null ? void 0 : t.resolveReaderDownloadName) == null ? void 0 : r.call(t, ...e)) ?? Et(...e);
}, er = (...e) => {
  var t, r;
  return ((r = (t = Y()) == null ? void 0 : t.resolveReaderDownloadUrls) == null ? void 0 : r.call(t, ...e)) ?? At(...e);
}, tr = (...e) => le("downloadProtectedResource")(...e), rr = (...e) => le("failDownloadToast")(...e), fo = (e, t) => le("resolveMarkdownAssetUrl")(e, t), mo = (e = {}) => {
  const t = Y();
  return Ft({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) || "/api/v1",
    ask: t == null ? void 0 : t.askDocumentAi,
    documentByJobId: t == null ? void 0 : t.fetchDocumentByJobId,
    ...e
  });
}, dt = "/api/v1", ho = (e = dt, t = {}) => {
  var r;
  return le("fetchFavorites")(
    ((r = Y()) == null ? void 0 : r.apiPrefix) ?? e,
    t
  );
};
function po(e = {}) {
  const t = Y();
  return It({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) ?? dt,
    documentByJobId: (...r) => le("fetchDocumentByJobId")(...r),
    submitFavorite: (...r) => le("createFavorite")(...r),
    loadFavorites: (...r) => le("fetchFavorites")(...r),
    removeFavorite: (...r) => le("deleteFavorite")(...r),
    ...e
  });
}
const nr = 2, re = /* @__PURE__ */ new Map();
function Be(e, t) {
  re.delete(e), re.set(e, t);
}
function or(e) {
  if (re.size < nr) return;
  const t = re.keys().next().value;
  t && re.delete(t);
}
function xe(e) {
  const t = `${e || ""}`.trim();
  if (!t || !re.has(t)) return null;
  const r = re.get(t);
  return Be(t, r), r;
}
async function ut(e, t = Kt, r = {}) {
  const n = `${e || ""}`.trim();
  if (!n)
    return null;
  if (re.has(n)) {
    const s = re.get(n);
    return Be(n, s), s;
  }
  const a = await t(n, { signal: r.signal });
  if (!a.ok) {
    const s = new Error(`读取 PDF 失败 (${a.status})`);
    throw s.status = a.status, s;
  }
  const o = await a.arrayBuffer(), c = { data: new Uint8Array(o) };
  return re.has(n) ? Be(n, c) : (or(), re.set(n, c)), c;
}
function ar(e = "", t = null) {
  const [r, n] = M(
    () => t || xe(e)
  ), [a, o] = M(
    () => !!`${e || ""}`.trim() && !t && !xe(e)
  ), [c, s] = M("");
  return U(() => {
    if (t) {
      n(t), o(!1), s("");
      return;
    }
    const l = `${e || ""}`.trim();
    if (!l) {
      n(null), o(!1), s("");
      return;
    }
    const i = xe(l);
    if (i) {
      n(i), o(!1), s("");
      return;
    }
    let m = !1;
    return o(!0), s(""), n(null), ut(l).then((u) => {
      m || (n(u), o(!1));
    }).catch((u) => {
      m || (n(null), o(!1), s((u == null ? void 0 : u.message) || String(u)));
    }), () => {
      m = !0;
    };
  }, [e, t]), { file: r, loading: a, error: c };
}
function me(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : null;
}
function ft(e) {
  const t = me(e);
  return t && "data" in t ? t.data : e;
}
function ge(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : null;
}
function Ze(e) {
  const t = me(e);
  if (!t || !Array.isArray(t.bbox) || t.bbox.length !== 4) return null;
  const r = t.bbox.map(Number);
  if (!r.every(Number.isFinite)) return null;
  const n = ge(t.page);
  if (n == null) return null;
  const [a, o, c, s] = r, l = Math.min(a, c), i = Math.min(o, s), m = Math.max(a, c), u = Math.max(o, s);
  if (m <= l || u <= i) return null;
  const h = `${t.unit || "pdf_point"}`.trim().toLowerCase();
  if (h !== "pdf_point" && h !== "pt") return null;
  const p = `${t.origin || "top_left"}`.trim().toLowerCase();
  return p !== "top_left" && p !== "bottom_left" ? null : {
    page: Math.floor(n),
    bbox: [l, i, m, u],
    unit: "pdf_point",
    origin: p,
    text: `${t.text || ""}`
  };
}
function sr(e) {
  const t = me(ft(e)), r = Array.isArray(t == null ? void 0 : t.items) ? t.items : [], n = [];
  for (const a of r) {
    const o = me(a), c = `${(o == null ? void 0 : o.item_id) || (o == null ? void 0 : o.itemId) || ""}`.trim(), s = Ze(o == null ? void 0 : o.source), l = Ze(o == null ? void 0 : o.translated);
    !c || !s || !l || n.push({
      itemId: c,
      source: s,
      translated: l,
      markdown: `${(o == null ? void 0 : o.markdown) || ""}`,
      regionType: `${(o == null ? void 0 : o.region_type) || (o == null ? void 0 : o.regionType) || ""}`,
      status: `${(o == null ? void 0 : o.status) || ""}`
    });
  }
  return n;
}
function Ye(e) {
  const t = me(e);
  if (!t) return null;
  const r = [];
  for (const a of Array.isArray(t.pages) ? t.pages : []) {
    const o = me(a), c = ge(o == null ? void 0 : o.page), s = ge(o == null ? void 0 : o.width), l = ge(o == null ? void 0 : o.height);
    c == null || s == null || l == null || r.push({ page: Math.floor(c), width: s, height: l });
  }
  if (!r.length) return null;
  const n = ge(t.page_count ?? t.pageCount);
  return {
    pageCount: n == null ? r.length : Math.floor(n),
    pages: r
  };
}
function cr(e) {
  const t = me(ft(e));
  return {
    source: Ye(t == null ? void 0 : t.source),
    translated: Ye(t == null ? void 0 : t.translated)
  };
}
function _e(e, t) {
  const r = Je(t);
  return r && e.find((n) => Je(n.itemId) === r) || null;
}
function We(e, t) {
  return t === "translated" ? e.translated : e.source;
}
function ir(e, t, r) {
  if (!e || !t) return null;
  const n = We(e, r), a = r === "translated" ? t.translated : t.source, o = a == null ? void 0 : a.pages.find((c) => c.page === n.page);
  return o ? { itemId: e.itemId, box: n, pageSize: o } : null;
}
function lr(e, t, r) {
  if (!e || t <= 0 || r <= 0) return null;
  const { box: n, pageSize: a } = e;
  if (a.width <= 0 || a.height <= 0) return null;
  const [o, c, s, l] = n.bbox, i = n.origin === "bottom_left" ? a.height - l : c, m = n.origin === "bottom_left" ? a.height - c : l, u = Math.max(0, Math.min(t, o / a.width * t)), h = Math.max(u, Math.min(t, s / a.width * t)), p = Math.max(0, Math.min(r, i / a.height * r)), b = Math.max(p, Math.min(r, m / a.height * r));
  return h <= u || b <= p ? null : { left: u, top: p, width: h - u, height: b - p };
}
function Xe(e) {
  document.body.classList.remove(
    "reader-mode-source",
    "reader-mode-translated",
    "reader-mode-compare"
  ), document.body.classList.add(`reader-mode-${e}`);
}
function dr(e, t = "") {
  const r = `${e || ""}`.trim(), n = `${t || ""}`.trim();
  return !!(!r || n && (r === n || r === `${n}.pdf`) || /^\d{8,14}-[0-9a-f]{4,}$/i.test(r));
}
function ur(e, t) {
  var n;
  const r = [
    e == null ? void 0 : e.title,
    e == null ? void 0 : e.display_name,
    e == null ? void 0 : e.source_file_name,
    (n = e == null ? void 0 : e.book_summary) == null ? void 0 : n.source_file_name
  ];
  for (const a of r) {
    const o = `${a || ""}`.trim();
    if (o && !dr(o, t))
      return o.replace(/\.pdf$/i, "");
  }
  return "";
}
function ie({
  percent: e,
  text: t,
  stage: r
}) {
  var n;
  try {
    (n = window.parent) == null || n.postMessage(
      {
        type: qt.progress,
        stage: r,
        percent: e,
        text: t
      },
      lt.messageTargetOrigin()
    );
  } catch {
  }
}
function Se(e, t, r, n = "progress") {
  e({
    loading: !0,
    percent: t,
    text: r,
    stage: n,
    failed: !1
  }), ie({ percent: t, text: r, stage: n });
}
function fr() {
  const [e, t] = M(() => {
    var D, L;
    return ((D = globalThis.location) == null ? void 0 : D.search) || ((L = globalThis.location) == null ? void 0 : L.href) || "";
  });
  U(() => {
    var B, X, se, ue;
    const D = () => {
      var Z, G;
      return t(((Z = globalThis.location) == null ? void 0 : Z.search) || ((G = globalThis.location) == null ? void 0 : G.href) || "");
    }, L = (X = (B = globalThis.history) == null ? void 0 : B.pushState) == null ? void 0 : X.bind(globalThis.history), j = (ue = (se = globalThis.history) == null ? void 0 : se.replaceState) == null ? void 0 : ue.bind(globalThis.history);
    let J = !1;
    if (L && j)
      try {
        const Z = (G) => function(...fe) {
          const he = G.apply(this, fe);
          return D(), globalThis.dispatchEvent(new Event("pushstate")), globalThis.dispatchEvent(new Event("replacestate")), globalThis.dispatchEvent(new Event("locationchange")), he;
        };
        globalThis.history.pushState = Z(L), globalThis.history.replaceState = Z(j), J = !0;
      } catch {
      }
    return window.addEventListener("popstate", D), window.addEventListener("hashchange", D), window.addEventListener("pushstate", D), window.addEventListener("replacestate", D), window.addEventListener("locationchange", D), () => {
      if (window.removeEventListener("popstate", D), window.removeEventListener("hashchange", D), window.removeEventListener("pushstate", D), window.removeEventListener("replacestate", D), window.removeEventListener("locationchange", D), J && L && j)
        try {
          globalThis.history.pushState = L, globalThis.history.replaceState = j;
        } catch {
        }
    };
  }, []);
  const r = K(() => Yt(lt), [e]), n = K(
    () => r ? "" : Zt(),
    [e, r]
  ), [a, o] = M({
    documentId: "",
    jobId: ""
  }), c = a.documentId === n ? a.jobId : "", s = r || c, l = !!n && !s, [i, m] = M(l ? "source" : "compare"), [u, h] = M(""), [p, b] = M(""), [w, S] = M(null), [x, A] = M(null), [I, E] = M(!1), [R, y] = M(""), [d, g] = M(null), [v, k] = M(null), [W, F] = M([]), [Q, ee] = M(() => ({
    source: null,
    translated: null
  })), [ne, H] = M({
    loading: !0,
    percent: 4,
    text: te.boot,
    stage: "progress",
    failed: !1
  }), de = N((D) => {
    l && D !== "source" || (m(D), Xe(D));
  }, [l]);
  U(() => (l && document.documentElement.classList.add("reader-source-only"), Xe(i), () => {
    document.documentElement.classList.remove("reader-source-only");
  }), [l, i]), U(() => {
    const D = new AbortController();
    let L = !1;
    async function j(B, X, se, ue) {
      if (!B || D.signal.aborted || L)
        return null;
      Se(H, se, X, "download");
      const Z = await ut(B, Me.fetchProtected, {
        signal: D.signal
      });
      return D.signal.aborted || L ? null : (Se(H, ue, X, "download"), Z);
    }
    async function J() {
      E(!1), S(null), A(null), F([]), ee({ source: null, translated: null }), Se(H, 8, te.metadata, "metadata");
      try {
        if (l) {
          let C = null;
          try {
            const V = await Me.fetchProtected(
              Oe(`/api/v1/documents/${encodeURIComponent(n)}`)
            );
            if (V != null && V.ok) {
              const oe = await V.json().catch(() => null), ae = (oe == null ? void 0 : oe.data) ?? oe, Fe = `${(ae == null ? void 0 : ae.active_job_id) || ""}`.trim();
              Fe && !Fe.startsWith("doc:") && (C = Fe);
            }
          } catch {
          }
          if (C && !L) {
            o({ documentId: n, jobId: C });
            return;
          }
          const $ = jt() ? zt : Oe(`/api/v1/documents/${encodeURIComponent(n)}/source.pdf`);
          if (L) return;
          h($), b(""), y(""), g(null), k(null);
          const q = await j($, "正在下载原文 PDF…", 30, 85);
          if (L) return;
          if (!q) {
            H({
              loading: !1,
              percent: 100,
              text: "源文件不可用：该文档没有可读取的源 PDF。",
              stage: "failed",
              failed: !0
            }), ie({ percent: 100, text: "源文件下载失败", stage: "failed" });
            return;
          }
          S(q), E(!0), H({
            loading: !1,
            percent: 100,
            text: te.ready,
            stage: "ready",
            failed: !1
          }), ie({ percent: 100, text: te.ready, stage: "ready" });
          return;
        }
        if (!s) {
          H({
            loading: !1,
            percent: 100,
            text: te.failed,
            stage: "failed",
            failed: !0
          }), ie({ percent: 100, text: te.failed, stage: "failed" });
          return;
        }
        const B = await Me.loadReaderPayload(s);
        if (L) return;
        const X = Gt(B.manifestPayload), se = Vt(B.jobPayload, B.manifestPayload), Z = (typeof X == "string" ? X : Xt(X)) || (n ? Oe(`/api/v1/documents/${encodeURIComponent(n)}/source.pdf`) : ""), G = se || "";
        if (h(Z || ""), b(G), y(ur(B.jobPayload, s)), g(B.jobPayload || null), k(B.manifestPayload || null), F(sr(B.regionsPayload)), ee(cr(B.readerMetadata)), !Z && !G) {
          H({
            loading: !1,
            percent: 100,
            text: te.failed,
            stage: "failed",
            failed: !0
          }), ie({ percent: 100, text: te.failed, stage: "failed" });
          return;
        }
        Se(H, 25, "正在下载 PDF…", "download");
        const fe = [];
        let he = null, Re = null;
        if (Z && fe.push(
          j(Z, "正在下载原文 PDF…", 30, 55).then((C) => {
            he = C;
          })
        ), G && fe.push(
          j(G, "正在下载译文 PDF…", 55, 85).then((C) => {
            Re = C;
          })
        ), await Promise.all(fe), L) return;
        if (!!Z && !he || !!G && !Re) {
          H({
            loading: !1,
            percent: 100,
            text: "PDF 下载失败，请重试",
            stage: "failed",
            failed: !0
          }), ie({ percent: 100, text: "PDF 下载失败", stage: "failed" });
          return;
        }
        S(he), A(Re), E(!0), H({
          loading: !1,
          percent: 100,
          text: te.ready,
          stage: "ready",
          failed: !1
        }), ie({ percent: 100, text: te.ready, stage: "ready" });
      } catch (B) {
        if (L || D.signal.aborted || (B == null ? void 0 : B.name) === "AbortError") return;
        const X = B instanceof Error ? B.message : te.failed;
        H({
          loading: !1,
          percent: 100,
          text: X,
          stage: "failed",
          failed: !0
        }), ie({ percent: 100, text: X, stage: "failed" });
      }
    }
    return J(), () => {
      L = !0, D.abort();
    };
  }, [s, n, l, e]);
  const O = K(
    () => ({
      fetchProtected: Me.fetchProtected,
      jobId: s,
      jobPayload: d,
      manifestPayload: v,
      sourceUrl: u,
      translatedUrl: p,
      sourceOnly: l
    }),
    [s, d, v, u, p, l]
  );
  return {
    jobId: s,
    documentId: n,
    sourceOnly: l,
    mode: i,
    setMode: de,
    sourceUrl: u,
    translatedUrl: p,
    sourceFile: w,
    translatedFile: x,
    assetsReady: I,
    boot: ne,
    title: R,
    regions: W,
    readerMetadata: Q,
    download: O
  };
}
const mt = 0.25, ht = 1, mr = 0.05, je = 0.5, hr = 16, pr = 8;
function Te(e) {
  return je;
}
function De(e) {
  return Number.isFinite(e) ? Math.min(ht, Math.max(mt, e)) : je;
}
function we(e, t) {
  const r = De(Number(e) + t * mr);
  return Math.round(r * 100) / 100;
}
function gr(e) {
  return Math.round(De(e) * 100);
}
function br(e) {
  const t = Number(e) || 0;
  return Math.max(160, Math.floor((t - 1) / 2));
}
function yr(e) {
  const r = (Number(e) || 0) - hr - pr;
  return Math.max(160, Math.floor(r));
}
function wr(e, t = je) {
  const r = De(t);
  return yr((Number(e) || 0) * r);
}
function vr(e, t) {
  if (!e || !Number.isFinite(t) || t <= 0 || Math.abs(t - 1) < 1e-3)
    return;
  const r = e.scrollLeft + e.clientWidth / 2, n = e.scrollTop + e.clientHeight / 2, a = Array.from(
    e.querySelectorAll("[data-reader-pane]")
  ).map((c) => ({
    pane: c,
    cx: c.scrollLeft + c.clientWidth / 2,
    hadOverflow: c.scrollWidth > c.clientWidth + 1
  })), o = () => {
    e.scrollLeft = Math.max(0, r * t - e.clientWidth / 2), e.scrollTop = Math.max(0, n * t - e.clientHeight / 2);
    for (const { pane: c, cx: s, hadOverflow: l } of a) {
      const i = Math.max(0, c.scrollWidth - c.clientWidth);
      if (i <= 0) {
        c.scrollLeft = 0;
        continue;
      }
      l ? c.scrollLeft = Math.min(
        i,
        Math.max(0, s * t - c.clientWidth / 2)
      ) : c.scrollLeft = i / 2;
    }
  };
  requestAnimationFrame(() => {
    requestAnimationFrame(o);
  });
}
const Pe = "data-reader-page", Rr = "data-reader-pane", Mr = "reader-scroll-shell", Sr = "reader-react-scroll-shell", ze = "reader-react-pdf-page-slot";
function Ee(e, t) {
  const r = e != null ? `[${Pe}="${e}"]` : `[${Pe}]`;
  return t ? `${r}[${Rr}="${t}"]` : r;
}
function Nr() {
  return `.${ze}[${Pe}]`;
}
function pt(e) {
  return Number(e.getAttribute(Pe));
}
const qe = 48;
function gt(e, t = qe) {
  return e.getBoundingClientRect().top + t;
}
function bt(e, t) {
  if (!e.length)
    return null;
  let r = null, n = -1 / 0;
  for (const l of e) {
    const i = l.getBoundingClientRect();
    i.height < 8 || i.width < 8 || i.top <= t + 1 && i.top >= n && (r = l, n = i.top);
  }
  if (!r && (r = e.find((i) => {
    const m = i.getBoundingClientRect();
    return m.height >= 8 && m.width >= 8;
  }) ?? e[0] ?? null, r)) {
    const i = [...e].reverse().find((m) => {
      const u = m.getBoundingClientRect();
      return u.height >= 8 && u.width >= 8;
    });
    i && i.getBoundingClientRect().bottom < t && (r = i);
  }
  if (!r)
    return null;
  const a = pt(r);
  if (!Number.isFinite(a) || a < 1)
    return null;
  const o = r.getBoundingClientRect(), c = o.height > 0 ? o.height : 1, s = Math.min(1, Math.max(0, (t - o.top) / c));
  return { el: r, page: a, fraction: s };
}
function $e(e, t, r = qe) {
  if (!e)
    return null;
  const n = Ee(void 0, t), a = Array.from(e.querySelectorAll(n));
  if (!a.length || e.getBoundingClientRect().height <= 0)
    return null;
  const c = gt(e, r), s = bt(a, c);
  return s ? { page: s.page, fraction: s.fraction } : null;
}
function Ke(e, t, r = "auto", n, a = qe) {
  if (!e || !t)
    return !1;
  const o = Math.max(1, Math.floor(Number(t.page) || 1)), c = Math.min(1, Math.max(0, Number(t.fraction) || 0));
  let s = null;
  if (n && (s = e.querySelector(Ee(o, n))), s || (s = e.querySelector(Ee(o))), !s)
    return !1;
  const l = e.getBoundingClientRect(), i = s.getBoundingClientRect();
  if (l.height <= 0 || i.height < 8 && s.offsetHeight < 8)
    return !1;
  const m = i.height > 0 ? i.height : s.offsetHeight, u = e.scrollTop + (i.top - l.top), h = Math.max(0, u + c * m - a);
  return r === "auto" ? e.scrollTop = h : e.scrollTo({ top: h, behavior: r }), !0;
}
function Tr(e, t, r = "smooth", n) {
  return Ke(
    e,
    { page: t, fraction: 0 },
    r,
    n
  );
}
function yt(e, t, r) {
  const n = (r == null ? void 0 : r.behavior) ?? "auto", a = (r == null ? void 0 : r.delaysMs) ?? [0, 32, 120, 280];
  let o = !1, c = !1;
  const s = [], l = () => {
    var m;
    if (o) return;
    Ke(
      e(),
      t,
      n,
      r == null ? void 0 : r.pane
    ) && !c && (c = !0, (m = r == null ? void 0 : r.onDone) == null || m.call(r));
  };
  for (const i of a)
    i <= 0 ? requestAnimationFrame(() => {
      requestAnimationFrame(l);
    }) : s.push(setTimeout(l, i));
  return () => {
    o = !0;
    for (const i of s)
      clearTimeout(i);
  };
}
function Pr(e, t, r) {
  return yt(
    e,
    { page: t, fraction: 0 },
    r
  );
}
function Ae(e, t) {
  if (!Number.isFinite(e))
    return 1;
  const r = Math.max(1, Math.floor(e));
  return !Number.isFinite(t) || t <= 0 ? r : Math.min(t, r);
}
function ce(e) {
  return {
    page: Math.max(1, Math.floor(Number(e.page) || 1)),
    fraction: Math.min(1, Math.max(0, Number(e.fraction) || 0))
  };
}
function Er(e) {
  if (!(e instanceof HTMLElement))
    return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function Ar(e) {
  const {
    mode: t,
    sourceOnly: r,
    setMode: n,
    userZoom: a,
    onZoomChange: o,
    currentPage: c,
    numPages: s,
    goToPage: l,
    enabled: i = !0
  } = e;
  U(() => {
    if (!i)
      return;
    const m = (u) => {
      if (u.defaultPrevented || u.metaKey || u.ctrlKey || u.altKey || Er(u.target))
        return;
      const h = u.key, p = h.length === 1 ? h.toLowerCase() : h;
      if (p === "1") {
        u.preventDefault(), n("source");
        return;
      }
      if (p === "2" && !r) {
        u.preventDefault(), n("translated");
        return;
      }
      if (p === "3" && !r) {
        u.preventDefault(), n("compare");
        return;
      }
      if (h === "+" || h === "=") {
        u.preventDefault(), o(we(a, 1));
        return;
      }
      if (h === "-" || h === "_") {
        u.preventDefault(), o(we(a, -1));
        return;
      }
      if (p === "0") {
        u.preventDefault(), o(Te());
        return;
      }
      if (!(s <= 0)) {
        if (p === "j" || h === "ArrowDown" || h === "PageDown") {
          u.preventDefault(), l(Ae(c + 1, s));
          return;
        }
        if (p === "k" || h === "ArrowUp" || h === "PageUp") {
          u.preventDefault(), l(Ae(c - 1, s));
          return;
        }
        if (h === "Home") {
          u.preventDefault(), l(1);
          return;
        }
        h === "End" && (u.preventDefault(), l(s));
      }
    };
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [
    i,
    t,
    r,
    n,
    a,
    o,
    c,
    s,
    l
  ]);
}
const Ir = 160, kr = 8, Dr = 960;
function Fr(e) {
  const t = _(null), [r, n] = M(null), [a, o] = M(Dr), c = _(e == null ? void 0 : e.onWidthChange);
  c.current = e == null ? void 0 : e.onWidthChange;
  const s = N((i) => {
    t.current = i, n(i);
  }, []);
  U(() => {
    const i = r;
    if (!i || typeof ResizeObserver > "u")
      return;
    const m = (h) => {
      !Number.isFinite(h) || h < Ir || o((p) => Math.abs(p - h) < kr ? p : h);
    }, u = new ResizeObserver((h) => {
      var p, b;
      m(((b = (p = h[0]) == null ? void 0 : p.contentRect) == null ? void 0 : b.width) ?? i.clientWidth);
    });
    return u.observe(i), m(i.clientWidth), () => u.disconnect();
  }, [r]), U(() => {
    var i;
    (i = c.current) == null || i.call(c, a);
  }, [a]);
  const l = br(a);
  return {
    shellRef: t,
    shellEl: r,
    shellWidth: a,
    compareColWidth: l,
    bindShell: s
  };
}
function Or(e) {
  const { mode: t, sourceOnly: r, assetsReady: n, hasSource: a, hasTranslated: o } = e, c = n && a, s = n && o && !r, l = t === "source" || t === "compare", i = !r && (t === "translated" || t === "compare");
  return {
    mountSource: c,
    mountTranslated: s,
    showSource: l,
    showTranslated: i,
    compareMode: t === "compare" && l && i && c && s,
    primaryPane: t === "translated" ? "translated" : "source"
  };
}
function xr(e, t) {
  const {
    mode: r,
    sourceOnly: n,
    assetsReady: a,
    sourceUrl: o,
    sourceFile: c,
    translatedFile: s
  } = e, [l, i] = M({ source: 0, translated: 0 }), [m, u] = M(0), h = Or({
    mode: r,
    sourceOnly: n,
    assetsReady: a,
    hasSource: !!c || !!o,
    hasTranslated: !!s
  }), { primaryPane: p } = h, b = N((y, d) => {
    i((g) => g[d] === y ? g : { ...g, [d]: y });
  }, []), w = _(null), S = N(() => {
    w.current && clearTimeout(w.current), w.current = setTimeout(() => {
      u((y) => y + 1);
    }, 60);
  }, []), x = K(
    () => Math.max(l.source, l.translated),
    [l]
  ), A = p === "translated" ? l.translated : l.source || l.translated, I = t == null ? void 0 : t.userZoom, E = t == null ? void 0 : t.shellWidth, R = `${m}-${I}-${r}-${l.source}-${l.translated}-${E}`;
  return {
    ...h,
    numPagesByPane: l,
    hudNumPages: x,
    primaryNumPages: A,
    metricsTick: m,
    onNumPages: b,
    onMetrics: S,
    rowSyncRevision: R
  };
}
function _r(e, t) {
  const [r, n] = M(() => Te()), a = _(r);
  a.current = r;
  const o = _(1), c = N((i) => {
    const m = De(i), u = a.current;
    Math.abs(m - u) < 5e-4 || (o.current = m / (u || 1), n(m));
  }, []), s = N((i) => {
    c(we(a.current, i));
  }, [c]), l = N((i) => {
    c(Te());
  }, [c]);
  return rt(() => {
    const i = o.current;
    Math.abs(i - 1) < 1e-3 || (o.current = 1, vr(t == null ? void 0 : t.current, i));
  }, [r, t]), { userZoom: r, onZoomChange: c, stepZoom: s, resetZoom: l };
}
function $r(e) {
  const { mode: t, setMode: r, beginModeSwitch: n } = e, a = _(t), o = _(r), c = _(n);
  return a.current = t, o.current = r, c.current = n, { setModeKeepingPage: N((l) => {
    l !== a.current && (c.current(), o.current(l));
  }, []) };
}
function wt(e) {
  const t = `${e.jobId || ""}`.trim(), r = `${e.documentId || ""}`.trim();
  return t ? `retainpdf.reader.notes.v1:job:${t}` : r ? `retainpdf.reader.notes.v1:doc:${r}` : "retainpdf.reader.notes.v1:anonymous";
}
function Lr() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function vt(e) {
  return [...e].sort((t, r) => t.page !== r.page ? t.page - r.page : `${t.createdAt}`.localeCompare(`${r.createdAt}`));
}
function Rt(e) {
  const t = [];
  for (const r of vt(e)) {
    const n = t[t.length - 1];
    n && n.page === r.page ? n.items.push(r) : t.push({ page: r.page, items: [r] });
  }
  return t;
}
function Cr(e, t) {
  const r = e ? `# ${e} · 批注` : "# 批注", n = Rt(t);
  if (!n.length)
    return `${r}

（暂无批注）
`;
  const a = [r, ""];
  for (const o of n) {
    a.push(`## 第 ${o.page} 页`, "");
    for (const c of o.items) {
      for (const s of c.quote.split(`
`))
        a.push(`> ${s}`);
      c.note && a.push("", `笔记：${c.note}`), a.push("");
    }
  }
  return a.join(`
`);
}
function Ur(e) {
  if (!e)
    return [];
  try {
    const t = JSON.parse(e);
    return Array.isArray(t) ? t.map((r) => ({
      id: `${(r == null ? void 0 : r.id) || ""}`.trim(),
      page: Math.max(1, Math.floor(Number(r == null ? void 0 : r.page) || 1)),
      pane: (r == null ? void 0 : r.pane) === "translated" ? "translated" : "source",
      quote: `${(r == null ? void 0 : r.quote) || ""}`.trim(),
      note: `${(r == null ? void 0 : r.note) || ""}`.trim(),
      createdAt: `${(r == null ? void 0 : r.createdAt) || ""}`.trim() || (/* @__PURE__ */ new Date()).toISOString()
    })).filter((r) => r.id && r.quote) : [];
  } catch {
    return [];
  }
}
function Ge(e) {
  if (typeof localStorage > "u")
    return [];
  try {
    return Ur(localStorage.getItem(wt(e)));
  } catch {
    return [];
  }
}
function Br(e, t) {
  if (!(typeof localStorage > "u"))
    try {
      localStorage.setItem(wt(e), JSON.stringify(t));
    } catch (r) {
      console.warn("[reader-notes] persist failed", r);
    }
}
function Wr(e, t = {}) {
  const r = K(
    () => ({
      jobId: `${e.jobId || ""}`.trim(),
      documentId: `${e.documentId || ""}`.trim()
    }),
    [e.jobId, e.documentId]
  ), [n, a] = M(() => Ge(r)), o = t.onAfterAdd;
  U(() => {
    a(Ge(r));
  }, [r.jobId, r.documentId]), U(() => {
    Br(r, n);
  }, [r, n]);
  const c = N((u) => {
    const h = `${u.quote || ""}`.trim();
    if (!h)
      return null;
    const p = {
      id: Lr(),
      page: Math.max(1, Math.floor(Number(u.page) || 1)),
      pane: u.pane === "translated" ? "translated" : "source",
      quote: h,
      note: `${u.note || ""}`.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return a((b) => vt([p, ...b])), o == null || o(), p;
  }, [o]), s = N((u, h) => {
    const p = `${h || ""}`.trim();
    a((b) => b.map((w) => w.id === u ? { ...w, note: p } : w));
  }, []), l = N((u) => {
    a((h) => h.filter((p) => p.id !== u));
  }, []), i = N(async (u = "") => {
    var p, b;
    const h = Cr(u, n);
    try {
      return await ((b = (p = navigator.clipboard) == null ? void 0 : p.writeText) == null ? void 0 : b.call(p, h)), !0;
    } catch (w) {
      return console.error("[reader-notes] copy failed", w), !1;
    }
  }, [n]), m = K(() => Rt(n), [n]);
  return {
    notes: n,
    groups: m,
    addFromQuote: c,
    updateNote: s,
    remove: l,
    exportMarkdown: i,
    count: n.length
  };
}
function Hr(e, t = !0) {
  const [r, n] = M(null), a = N(() => {
    var s, l;
    n(null);
    const c = (s = globalThis.getSelection) == null ? void 0 : s.call(globalThis);
    (l = c == null ? void 0 : c.removeAllRanges) == null || l.call(c);
  }, []), o = e.current ?? null;
  return U(() => {
    if (!t)
      return;
    const c = () => {
      var ne, H;
      const w = e.current, S = (ne = globalThis.getSelection) == null ? void 0 : ne.call(globalThis);
      if (!w || !S || S.isCollapsed || !S.rangeCount) {
        n(null);
        return;
      }
      const x = S.getRangeAt(0);
      if (!w.contains(x.commonAncestorContainer)) {
        n(null);
        return;
      }
      const A = `${S.toString() || ""}`.replace(/\s+/g, " ").trim();
      if (A.length < 2) {
        n(null);
        return;
      }
      let I = x.commonAncestorContainer;
      I.nodeType === Node.TEXT_NODE && (I = I.parentElement);
      const E = (H = I == null ? void 0 : I.closest) == null ? void 0 : H.call(
        I,
        "[data-reader-page]"
      );
      if (!E || !w.contains(E)) {
        n(null);
        return;
      }
      const R = Math.max(1, Math.floor(Number(E.getAttribute("data-reader-page")) || 1)), d = E.getAttribute("data-reader-pane") === "translated" ? "translated" : "source", g = x.getClientRects(), v = g[g.length - 1] || x.getBoundingClientRect();
      if (!v || v.width === 0 && v.height === 0) {
        n(null);
        return;
      }
      const k = typeof window < "u" ? window.innerWidth : 800, W = typeof window < "u" ? window.innerHeight : 600, F = 16, Q = Math.min(Math.max(F, v.left), k - F), ee = Math.min(Math.max(F, v.top), W - F);
      n({
        quote: A,
        page: R,
        pane: d,
        rect: {
          left: Q,
          top: ee,
          width: v.width,
          height: v.height
        }
      });
    }, s = () => {
      window.setTimeout(c, 0);
    }, l = () => {
      s();
    }, i = () => s(), m = () => s(), u = () => {
      s();
    }, h = (w) => {
      w.key === "Escape" && a();
    }, p = () => {
      n((w) => w && null);
    };
    document.addEventListener("mouseup", l), document.addEventListener("pointerup", i), document.addEventListener("touchend", m), document.addEventListener("selectionchange", u), document.addEventListener("keyup", h);
    const b = o ?? e.current;
    return b == null || b.addEventListener("scroll", p, { passive: !0 }), window.addEventListener("scroll", p, { passive: !0, capture: !0 }), () => {
      document.removeEventListener("mouseup", l), document.removeEventListener("pointerup", i), document.removeEventListener("touchend", m), document.removeEventListener("selectionchange", u), document.removeEventListener("keyup", h), b == null || b.removeEventListener("scroll", p), window.removeEventListener("scroll", p, !0);
    };
  }, [t, o, a]), { selection: r, clearSelection: a };
}
function jr() {
  const [e, t] = M(null), r = N((c) => {
    t(c);
  }, []), n = N((c = null) => {
    t((s) => !c || s === c ? null : s);
  }, []), a = N((c) => {
    t((s) => s === c ? null : c);
  }, []), o = N(
    (c) => e === c,
    [e]
  );
  return { active: e, open: r, close: n, toggle: a, isOpen: o };
}
function zr(e, t, r = !0, n = "", a) {
  const [o, c] = M(1);
  return U(() => {
    if (!r || t <= 0) {
      c(1);
      return;
    }
    const s = e.current;
    if (!s)
      return;
    let l = !1, i = null, m = 0;
    const u = Ee(void 0, a), h = () => {
      if (l) return;
      const w = Array.from(s.querySelectorAll(u));
      if (!w.length)
        return;
      const S = gt(s), x = bt(w, S);
      x && c(x.page);
    }, p = () => {
      l || (m && cancelAnimationFrame(m), m = requestAnimationFrame(() => {
        m = 0, h();
      }));
    }, b = () => {
      if (l) return;
      if (!Array.from(s.querySelectorAll(u)).length) {
        i = setTimeout(b, 120);
        return;
      }
      h(), s.addEventListener("scroll", p, { passive: !0 });
    };
    return b(), () => {
      l = !0, i && clearTimeout(i), m && cancelAnimationFrame(m), s.removeEventListener("scroll", p);
    };
  }, [e, t, r, n, a]), o;
}
function qr(e) {
  const t = e.querySelector(
    "canvas, .react-pdf__Page, .reader-react-pdf-page, .reader-react-pdf-page-placeholder"
  );
  if (t) {
    const a = t.getBoundingClientRect().height;
    if (Number.isFinite(a) && a > 0)
      return a;
  }
  const r = Number(e.getAttribute("data-natural-height"));
  if (Number.isFinite(r) && r > 0)
    return r;
  const n = e.getBoundingClientRect().height;
  return Number.isFinite(n) && n > 0 ? n : 0;
}
function Kr(e, t) {
  if (e.size !== t.size) return !1;
  for (const [r, n] of t)
    if (e.get(r) !== n) return !1;
  return !0;
}
function Jr(e, t, r = "", n) {
  const [a, o] = M(() => /* @__PURE__ */ new Map()), c = _(n);
  return c.current = n, rt(() => {
    if (!t) {
      o((A) => A.size === 0 ? A : /* @__PURE__ */ new Map());
      return;
    }
    let s = !1, l = 0, i = !1, m = !1;
    const u = () => {
      var R;
      if (s) return;
      const A = e.current;
      if (!A) return;
      const I = /* @__PURE__ */ new Map();
      A.querySelectorAll(Nr()).forEach((y) => {
        const d = pt(y);
        if (!Number.isFinite(d) || d < 1) return;
        const g = qr(y);
        if (g <= 0) return;
        const v = I.get(d) || { height: 0, count: 0 };
        v.height = Math.max(v.height, g), v.count += 1, I.set(d, v);
      });
      const E = /* @__PURE__ */ new Map();
      I.forEach((y, d) => {
        y.count >= 2 && y.height > 0 && E.set(d, Math.ceil(y.height));
      }), o((y) => Kr(y, E) ? y : E), i && !m && (m = !0, (R = c.current) == null || R.call(c));
    }, h = () => {
      cancelAnimationFrame(l), l = requestAnimationFrame(() => {
        requestAnimationFrame(u);
      });
    };
    h();
    const p = window.setTimeout(h, 100), b = window.setTimeout(() => {
      i = !0, h();
    }, 300), w = window.setTimeout(h, 700), S = e.current;
    let x = null;
    return S && typeof ResizeObserver < "u" && (x = new ResizeObserver(() => h()), x.observe(S)), () => {
      s = !0, cancelAnimationFrame(l), window.clearTimeout(p), window.clearTimeout(b), window.clearTimeout(w), x == null || x.disconnect();
    };
  }, [e, t, r]), a;
}
const Zr = [0, 48, 140, 320, 560], Yr = 700, Xr = [80, 200, 400], Gr = 500, Vr = 50;
function Qr(e, t) {
  const { primaryPane: r, mode: n, enabled: a = !0 } = t, o = _({ page: 1, fraction: 0 }), c = _(null), s = _(!1), l = _(n), i = _(null), m = _(null), u = _(null), h = _(r);
  h.current = r;
  const p = N(() => {
    var R;
    (R = i.current) == null || R.call(i), i.current = null, m.current != null && (clearTimeout(m.current), m.current = null);
  }, []), b = N((R) => {
    o.current = ce(R), c.current = null, u.current != null && clearTimeout(u.current), u.current = setTimeout(() => {
      u.current = null, s.current = !1;
    }, Vr);
  }, []);
  U(() => {
    if (!a)
      return;
    let R = !1, y = null, d = null, g = null;
    const v = () => {
      if (R) return;
      const k = e.current;
      if (!k) {
        g = setTimeout(v, 50);
        return;
      }
      y = k, d = () => {
        if (s.current)
          return;
        const W = $e(y, h.current);
        W && (o.current = W);
      }, y.addEventListener("scroll", d, { passive: !0 }), s.current || d();
    };
    return v(), () => {
      R = !0, g != null && clearTimeout(g), y && d && y.removeEventListener("scroll", d);
    };
  }, [a, n, r, e]), U(() => {
    if (l.current === n)
      return;
    if (l.current = n, !a) {
      s.current = !1, c.current = null, p();
      return;
    }
    const R = c.current ? ce(c.current) : ce(o.current);
    return s.current = !0, c.current = R, o.current = R, p(), i.current = yt(
      () => e.current,
      R,
      {
        behavior: "auto",
        pane: r,
        // 等页宽/行高同步后再钉；同一 locked 幂等，不会越滚越远
        delaysMs: Zr,
        onDone: () => b(R)
      }
    ), m.current = setTimeout(() => {
      m.current = null, b(R);
    }, Yr), () => {
      p();
    };
  }, [n, a, r, e, b, p]), U(() => () => {
    p(), u.current != null && (clearTimeout(u.current), u.current = null);
  }, [p]);
  const w = N(() => {
    const R = $e(
      e.current,
      h.current
    );
    return ce(R || o.current);
  }, [e]), S = N(() => {
    s.current = !0;
    const R = $e(
      e.current,
      h.current
    ), y = ce(R ?? o.current);
    return o.current = y, c.current = y, y;
  }, [e]), x = N((R, y) => {
    const d = Ae(R, y || 1), g = { page: d, fraction: 0 };
    o.current = g, s.current = !0, c.current = g, p();
    const v = h.current;
    Tr(e.current, d, "smooth", v), i.current = Pr(
      () => e.current,
      d,
      {
        behavior: "auto",
        pane: v,
        delaysMs: Xr,
        onDone: () => b(g)
      }
    ), m.current = setTimeout(() => {
      m.current = null, b(g);
    }, Gr);
  }, [e, b, p]), A = N(() => ce(o.current), []), I = N(() => s.current, []), E = N(() => {
    if (!s.current || !c.current)
      return;
    const R = ce(c.current);
    Ke(
      e.current,
      R,
      "auto",
      h.current
    );
  }, [e]);
  return {
    lockFromShell: w,
    beginModeSwitch: S,
    goToPage: x,
    getAnchor: A,
    isRestoring: I,
    repinIfRestoring: E
  };
}
function en(e, t) {
  if (!e) return null;
  if (e.blockId && t) {
    const a = t(e.blockId);
    if (a != null && Number.isFinite(a) && a >= 1)
      return Math.floor(a);
  }
  if (e.pageIdx === null || e.pageIdx === void 0) return null;
  const r = Number(e.pageIdx);
  if (!Number.isFinite(r)) return null;
  const n = Math.floor(r) + 1;
  return n >= 1 ? n : null;
}
const tn = [0, 80, 200, 400, 800];
function rn(e) {
  const { enabled: t, numPages: r, goToPage: n, resolveBlockPage: a, onAnchorApplied: o } = e, c = _(""), s = _(n);
  s.current = n;
  const l = _(a);
  l.current = a;
  const i = _(o);
  i.current = o, U(() => {
    var b;
    if (!t || !Number.isFinite(r) || r < 1)
      return;
    const m = Jt(), u = en(m, l.current), h = u == null ? `none:${(m == null ? void 0 : m.blockId) || ""}` : `p:${u}:b:${(m == null ? void 0 : m.blockId) || ""}`;
    if (c.current === h)
      return;
    if (u == null) {
      c.current = h;
      return;
    }
    c.current = h, m && ((b = i.current) == null || b.call(i, m, u));
    const p = [];
    for (const w of tn)
      p.push(
        setTimeout(() => {
          s.current(u);
        }, w)
      );
    return () => {
      for (const w of p) clearTimeout(w);
    };
  }, [t, r]);
}
function nn() {
  const e = fr(), t = jr(), { shellRef: r, shellEl: n, shellWidth: a, compareColWidth: o, bindShell: c } = Fr(), { userZoom: s, onZoomChange: l } = _r(e.mode, r), i = xr(
    {
      mode: e.mode,
      sourceOnly: e.sourceOnly,
      assetsReady: e.assetsReady,
      sourceUrl: e.sourceUrl,
      translatedUrl: e.translatedUrl,
      sourceFile: e.sourceFile,
      translatedFile: e.translatedFile
    },
    { userZoom: s, shellWidth: a }
  ), {
    beginModeSwitch: m,
    goToPage: u,
    repinIfRestoring: h
  } = Qr(r, {
    primaryPane: i.primaryPane,
    mode: e.mode,
    enabled: !e.boot.loading
  });
  U(() => {
    h();
  }, [a, h]);
  const p = Jr(
    r,
    i.compareMode,
    i.rowSyncRevision,
    h
  ), b = zr(
    r,
    i.primaryNumPages,
    !e.boot.loading,
    `${e.mode}-${s}-${i.metricsTick}`,
    i.primaryPane
  ), w = N((O) => {
    var L, j;
    const D = Math.max(
      Number(i.hudNumPages) || 0,
      Number(i.primaryNumPages) || 0,
      Number((L = i.numPagesByPane) == null ? void 0 : L.source) || 0,
      Number((j = i.numPagesByPane) == null ? void 0 : j.translated) || 0
    );
    u(O, D);
  }, [u, i.hudNumPages, i.primaryNumPages, i.numPagesByPane]), [S, x] = M(null), A = _(null), I = N((O) => {
    A.current && clearTimeout(A.current), x(O), O && (A.current = setTimeout(() => x(null), 6e3));
  }, []);
  U(() => () => {
    A.current && clearTimeout(A.current);
  }, []);
  const E = N((O) => {
    const D = _e(e.regions, O);
    return D ? We(D, i.primaryPane).page : null;
  }, [e.regions, i.primaryPane]), R = N((O) => {
    const D = typeof O == "object" && O ? `${O.block_id || ""}`.trim() : "", L = _e(e.regions, D);
    let j = L ? We(L, i.primaryPane).page : null;
    if (j == null) {
      const J = typeof O == "number" ? O : (O == null ? void 0 : O.page_idx) ?? (O == null ? void 0 : O.page);
      if (J != null && `${J}`.trim() !== "") {
        const B = Number(J);
        Number.isFinite(B) && B >= 0 && (j = Math.floor(B) + 1);
      }
    }
    j == null || j < 1 || (I(L), w(j));
  }, [I, w, i.primaryPane, e.regions]);
  rn({
    enabled: !e.boot.loading && !e.boot.failed && e.assetsReady,
    numPages: i.hudNumPages || 0,
    goToPage: w,
    resolveBlockPage: E,
    onAnchorApplied: (O) => {
      I(_e(e.regions, O.blockId));
    }
  });
  const { setModeKeepingPage: y } = $r({
    mode: e.mode,
    setMode: e.setMode,
    beginModeSwitch: m
  }), d = N(() => {
    t.open("notes");
  }, [t]), g = Wr(
    {
      jobId: e.jobId,
      documentId: e.documentId
    },
    { onAfterAdd: d }
  ), { selection: v, clearSelection: k } = Hr(
    r,
    !e.boot.loading && !e.boot.failed
  ), W = N((O) => {
    g.addFromQuote({
      page: O.page,
      pane: O.pane,
      quote: O.quote
    }), k();
  }, [g, k]), F = N((O) => {
    (O.pane === "translated" && e.mode === "source" || O.pane === "source" && e.mode === "translated") && (m(), e.setMode("compare")), w(O.page);
  }, [e, m, w]), Q = !e.boot.loading && !e.boot.failed;
  Ar({
    mode: e.mode,
    sourceOnly: e.sourceOnly,
    setMode: y,
    userZoom: s,
    onZoomChange: l,
    currentPage: b,
    numPages: i.hudNumPages,
    goToPage: w,
    enabled: Q
  });
  const ee = K(() => t, [t.active, t.open, t.close, t.toggle, t.isOpen]), ne = K(() => ({ bindShell: c, shellEl: n, shellWidth: a, compareColWidth: o, shellRef: r }), [c, n, a, o, r]), H = K(() => ({
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    sourceFile: e.sourceFile,
    translatedFile: e.translatedFile
  }), [e.sourceUrl, e.translatedUrl, e.sourceFile, e.translatedFile]), de = K(() => ({
    session: e,
    boot: e.boot,
    sourceOnly: e.sourceOnly,
    mode: e.mode,
    userZoom: s,
    onZoomChange: l,
    shell: ne,
    panes: i,
    sessionFiles: H,
    rowHeights: p,
    goToPage: w,
    activeRegion: S,
    jumpToAnchor: R,
    setModeKeepingPage: y,
    download: e.download,
    showHud: Q,
    tools: ee,
    notes: g,
    selection: v,
    clearSelection: k,
    addNoteFromSelection: W,
    jumpToNote: F,
    documentTitle: e.title || ""
  }), [e, ne, i, H, p, w, S, R, y, Q, ee, g, v, k, W, F, s, l]);
  return K(() => ({
    ...de,
    currentPage: b
  }), [de, b]);
}
const on = "retainpdf.home.return.v1", an = 7200 * 1e3;
function sn(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return !t || typeof t != "object" || typeof t.ts == "number" && Date.now() - t.ts > an ? null : {
      allowBack: !!t.allowBack,
      activeTab: `${t.activeTab || "library"}`,
      libraryScrollTop: Number(t.libraryScrollTop) || 0,
      panelScrollTop: Number(t.panelScrollTop) || 0,
      windowScrollY: Number(t.windowScrollY) || 0,
      ts: Number(t.ts) || Date.now()
    };
  } catch {
    return null;
  }
}
function cn() {
  if (typeof sessionStorage > "u") return null;
  try {
    return sn(sessionStorage.getItem(on));
  } catch {
    return null;
  }
}
const ln = "retainpdf:soft-reader-close";
function dn() {
  return new URL("./index.html", window.location.href).href;
}
function un() {
  if (typeof window > "u" || window.self === window.top) return !1;
  try {
    return window.parent.postMessage(
      { type: ln },
      window.location.origin
    ), !0;
  } catch {
    return !1;
  }
}
function fn() {
  if (typeof window > "u" || un())
    return;
  const e = cn();
  if (e != null && e.allowBack && window.history.length > 1) {
    window.history.back();
    return;
  }
  try {
    const t = document.referrer ? new URL(document.referrer) : null;
    if (t && t.origin === window.location.origin && !/reader\.html/i.test(t.pathname) && window.history.length > 1) {
      window.history.back();
      return;
    }
  } catch {
  }
  window.location.assign(dn());
}
function mn() {
  return /* @__PURE__ */ T(
    "button",
    {
      id: "reader-close-home-btn",
      type: "button",
      className: "reader-close-home-btn",
      "aria-label": "返回主页",
      title: "返回主页",
      onClick: fn,
      children: [
        /* @__PURE__ */ f(Ne, { className: "reader-close-home-icon", size: 18, strokeWidth: 2.25, "aria-hidden": !0 }),
        /* @__PURE__ */ f("span", { className: "reader-close-home-label", children: "关闭" })
      ]
    }
  );
}
let Ve = !1;
function hn() {
  Ve || (Bt.GlobalWorkerOptions.workerSrc = Ue("build/pdf.worker.mjs"), Ve = !0);
}
const Mt = 1.414, pn = "120% 0px", Ie = /* @__PURE__ */ new Map();
function gn(e, t, r) {
  let n = Ie.get(e);
  if (!n) {
    const a = /* @__PURE__ */ new Map();
    n = { observer: new IntersectionObserver(
      (c) => {
        for (const s of c) {
          const l = a.get(s.target);
          l && l(s.isIntersecting);
        }
      },
      { root: e, rootMargin: pn, threshold: 0 }
    ), elements: a }, Ie.set(e, n);
  }
  return n.elements.set(r, t), n.observer.observe(r), n;
}
function bn(e, t) {
  const r = Ie.get(e);
  r && (r.observer.unobserve(t), r.elements.delete(t), r.elements.size === 0 && (r.observer.disconnect(), Ie.delete(e)));
}
function yn({
  pageNumber: e,
  width: t,
  devicePixelRatio: r,
  scrollRoot: n,
  pane: a,
  syncedMinHeight: o = 0,
  onMetrics: c,
  cachedAspect: s,
  onAspectChange: l,
  sentinelRef: i,
  regionHighlight: m = null
}) {
  const u = _(null), [h, p] = M(!1), [b, w] = M(s ?? Mt);
  U(() => {
    s != null && Math.abs(s - b) >= 1e-3 && w(s);
  }, [s]);
  const S = _(i);
  S.current = i;
  const x = _((y) => {
    var d;
    u.current = y, (d = S.current) == null || d.call(S, y);
  }).current;
  U(() => {
    const y = u.current;
    if (!y) return;
    if (typeof IntersectionObserver > "u") {
      p(!0);
      return;
    }
    let d = null;
    return gn(n, (v) => {
      v ? (d && (clearTimeout(d), d = null), p(!0)) : (d && clearTimeout(d), d = setTimeout(() => {
        p(!1);
      }, 120));
    }, y), () => {
      d && clearTimeout(d), bn(n, y);
    };
  }, [n, e]);
  const A = Math.max(120, Math.floor(t * b)), I = Math.max(A, Math.ceil(o || 0)), E = lr(m, t, A), R = (y) => {
    w((d) => {
      if (Math.abs(d - y) < 1e-3) return d;
      const g = () => l == null ? void 0 : l(e, y);
      return typeof queueMicrotask < "u" ? queueMicrotask(g) : setTimeout(g, 0), y;
    });
  };
  return /* @__PURE__ */ T(
    "div",
    {
      ref: x,
      "data-reader-page": e,
      "data-reader-pane": a,
      "data-natural-height": A,
      className: ze,
      style: {
        width: t,
        height: I,
        minHeight: I
      },
      children: [
        h ? /* @__PURE__ */ f(
          Wt,
          {
            pageNumber: e,
            width: t,
            devicePixelRatio: r,
            renderTextLayer: !0,
            renderAnnotationLayer: !1,
            className: "reader-react-pdf-page",
            loading: /* @__PURE__ */ f(
              "div",
              {
                className: "reader-react-pdf-page-placeholder",
                style: { width: t, height: A }
              }
            ),
            onLoadSuccess: (y) => {
              try {
                const d = y.getViewport({ scale: 1 });
                if (d.width > 0) {
                  const g = d.height / d.width;
                  R(g);
                }
              } catch {
              }
              c == null || c();
            },
            onRenderSuccess: () => {
              c == null || c();
            }
          }
        ) : /* @__PURE__ */ f(
          "div",
          {
            className: "reader-react-pdf-page-placeholder",
            style: { width: t, height: A },
            "aria-hidden": !0
          }
        ),
        E ? /* @__PURE__ */ f(
          "div",
          {
            className: "reader-react-pdf-region-highlight",
            "data-reader-region-id": m == null ? void 0 : m.itemId,
            style: E,
            "aria-hidden": "true"
          }
        ) : null
      ]
    }
  );
}
const wn = nt(yn), Le = 5;
hn();
function vn() {
  const e = typeof window < "u" && window.devicePixelRatio || 1;
  return Math.max(1, Math.min(e, 2));
}
const Rn = Nt(
  function({
    pane: t,
    url: r = "",
    preloadedFile: n = null,
    userZoom: a = 1,
    visible: o = !0,
    emptyLabel: c = "暂无 PDF",
    scrollRoot: s = null,
    pageWidthOverride: l = null,
    rowHeights: i,
    onMetrics: m,
    onLoadSuccess: u,
    onLoadError: h,
    onNumPagesChange: p,
    activeRegion: b = null,
    readerMetadata: w = null
  }, S) {
    const { file: x, loading: A, error: I } = ar(r, n), [E, R] = M(0), [y, d] = M(""), [g, v] = M(null), [k, W] = M(480), F = _(null), Q = _(0), ee = K(() => vn(), []), ne = K(() => ({
      cMapUrl: Ue("cmaps/"),
      cMapPacked: !0,
      standardFontDataUrl: Ue("standard_fonts/")
    }), []);
    Tt(S, () => g, [g]), U(() => {
      const P = ($) => {
        !Number.isFinite($) || $ < 80 || Math.abs($ - Q.current) < 8 || (Q.current = $, W($));
      }, z = l && l >= 80 ? l : (s == null ? void 0 : s.clientWidth) || 0;
      if (P(z), !s || typeof ResizeObserver > "u" || l && l >= 80) return;
      const C = new ResizeObserver(($) => {
        var V, oe;
        const q = ((oe = (V = $[0]) == null ? void 0 : V.contentRect) == null ? void 0 : oe.width) ?? s.clientWidth;
        !Number.isFinite(q) || q < 80 || (F.current && clearTimeout(F.current), F.current = setTimeout(() => P(q), 80));
      });
      return C.observe(s), () => {
        C.disconnect(), F.current && clearTimeout(F.current);
      };
    }, [l, s, o]);
    const H = K(
      () => wr(k, a),
      [k, a]
    ), [de, O] = M(() => /* @__PURE__ */ new Map()), [D, L] = M(() => /* @__PURE__ */ new Set()), j = _(/* @__PURE__ */ new Map()), J = _(null), B = N((P, z) => {
      O((C) => {
        if (C.get(P) === z) return C;
        const $ = new Map(C);
        return $.set(P, z), $;
      });
    }, []), X = N((P, z) => {
      const C = j.current, $ = C.get(P);
      if ($ && J.current)
        try {
          J.current.unobserve($);
        } catch {
        }
      if (z) {
        if (C.set(P, z), J.current)
          try {
            J.current.observe(z);
          } catch {
          }
      } else
        C.delete(P);
    }, []);
    U(() => {
      if (!s || typeof IntersectionObserver > "u") return;
      const P = new IntersectionObserver(
        (z) => {
          L((C) => {
            const $ = new Set(C);
            let q = !1;
            for (const V of z) {
              const oe = V.target, ae = Number(oe.getAttribute("data-reader-page"));
              Number.isFinite(ae) && (V.isIntersecting ? $.has(ae) || ($.add(ae), q = !0) : $.has(ae) && ($.delete(ae), q = !0));
            }
            return q ? $ : C;
          });
        },
        { root: s, rootMargin: "0px", threshold: 0 }
      );
      J.current = P;
      for (const z of j.current.values())
        try {
          P.observe(z);
        } catch {
        }
      return () => {
        P.disconnect(), J.current === P && (J.current = null);
      };
    }, [s]), U(() => {
      L(/* @__PURE__ */ new Set()), O(/* @__PURE__ */ new Map()), j.current.clear();
    }, [r]);
    const se = N(
      ({ numPages: P }) => {
        R(P), d(""), p == null || p(P, t), u == null || u({ numPages: P, pane: t });
      },
      [u, p, t]
    ), ue = N(
      (P) => {
        const z = (P == null ? void 0 : P.message) || "PDF 解析失败";
        d(z), R(0), p == null || p(0, t), h == null || h(P, t);
      },
      [h, p, t]
    ), Z = K(
      () => E > 0 ? Array.from({ length: E }, (P, z) => z + 1) : [],
      [E]
    ), G = K(
      () => ir(b, w, t),
      [b, w, t]
    ), fe = K(() => {
      if (E === 0) return /* @__PURE__ */ new Set();
      if (!(!!s && typeof IntersectionObserver < "u" && o)) return new Set(Z);
      if (D.size === 0) {
        const C = Math.min(E, Le * 2 + 1);
        return new Set(Array.from({ length: C }, ($, q) => q + 1));
      }
      const z = /* @__PURE__ */ new Set();
      for (const C of D)
        for (let $ = -Le; $ <= Le; $++) {
          const q = C + $;
          q >= 1 && q <= E && z.add(q);
        }
      return z;
    }, [E, Z, s, o, D]);
    return /* @__PURE__ */ T(
      "section",
      {
        ref: v,
        className: `reader-panel reader-react-pdf-pane${o ? "" : " is-hidden"}`,
        "data-reader-pane": t,
        "data-reader-engine": "react-pdf",
        "data-reader-visible": o ? "true" : "false",
        "aria-hidden": o ? void 0 : !0,
        "aria-label": t === "source" ? "原文 PDF" : "译文 PDF",
        children: [
          (!r || !!I || !!y) && !A ? /* @__PURE__ */ f("div", { className: "reader-empty reader-react-pdf-empty", "data-reader-pdf-empty": t, children: r && (I || y) || c }) : null,
          A ? /* @__PURE__ */ f("div", { className: "reader-empty reader-react-pdf-loading", "data-reader-pdf-loading": t, children: "正在加载 PDF…" }) : null,
          x && !I ? /* @__PURE__ */ f("div", { className: "reader-viewer-wrap reader-react-pdf-wrap", children: /* @__PURE__ */ f(
            Ht,
            {
              file: x,
              loading: null,
              error: null,
              options: ne,
              onLoadSuccess: se,
              onLoadError: ue,
              className: "reader-react-pdf-document",
              children: Z.map((P) => {
                if (fe.has(P))
                  return /* @__PURE__ */ f(
                    wn,
                    {
                      pane: t,
                      pageNumber: P,
                      width: H,
                      devicePixelRatio: ee,
                      scrollRoot: s,
                      syncedMinHeight: (i == null ? void 0 : i.get(P)) || 0,
                      onMetrics: m,
                      cachedAspect: de.get(P),
                      onAspectChange: B,
                      sentinelRef: (V) => X(P, V),
                      regionHighlight: (G == null ? void 0 : G.box.page) === P ? G : null
                    },
                    `${t}-${P}`
                  );
                const C = de.get(P) ?? Mt, $ = Math.max(120, Math.floor(H * C)), q = Math.max($, Math.ceil((i == null ? void 0 : i.get(P)) || 0));
                return /* @__PURE__ */ f(
                  "div",
                  {
                    ref: (V) => X(P, V),
                    "data-reader-page": P,
                    "data-reader-pane": t,
                    "data-natural-height": $,
                    className: ze,
                    style: {
                      width: H,
                      height: q,
                      minHeight: q
                    },
                    children: /* @__PURE__ */ f(
                      "div",
                      {
                        className: "reader-react-pdf-page-placeholder",
                        style: { width: H, height: $ },
                        "aria-hidden": !0
                      }
                    )
                  },
                  `${t}-${P}`
                );
              })
            },
            r
          ) }) : null
        ]
      }
    );
  }
), Qe = nt(Rn);
function Mn({
  mode: e,
  compareMode: t,
  showSource: r,
  showTranslated: n,
  markdownSplit: a
}) {
  const o = a && e === "compare";
  return {
    mode: o ? "source" : e,
    compareMode: t && !a,
    showSource: o ? !0 : r,
    showTranslated: o ? !1 : n
  };
}
function Sn(e, t) {
  return t ? e * 2 : e;
}
function Nn(e) {
  const {
    mode: t,
    bindShell: r,
    shellEl: n,
    userZoom: a,
    compareMode: o,
    shellWidth: c,
    rowHeights: s,
    mountSource: l,
    mountTranslated: i,
    showSource: m,
    showTranslated: u,
    sourceOnly: h,
    sourceUrl: p,
    translatedUrl: b,
    sourceFile: w,
    translatedFile: S,
    onMetrics: x,
    onNumPagesChange: A,
    activeRegion: I,
    readerMetadata: E,
    markdownSplit: R = !1,
    assistantSplit: y = !1
  } = e, d = Mn({
    mode: t,
    compareMode: o,
    showSource: m,
    showTranslated: u,
    markdownSplit: R
  }), g = Sn(
    c,
    R || y
  );
  return /* @__PURE__ */ f(
    "div",
    {
      ref: r,
      id: Mr,
      className: Sr,
      "data-reader-scroll-shell": "true",
      children: /* @__PURE__ */ T(
        "main",
        {
          className: `reader-react-grid reader-mode-${d.mode}`,
          "data-reader-mode": R ? "markdown-split" : y ? "assistant-split" : t,
          children: [
            l ? /* @__PURE__ */ f(
              Qe,
              {
                pane: "source",
                url: p,
                preloadedFile: w,
                userZoom: a,
                visible: d.showSource,
                scrollRoot: n,
                pageWidthOverride: g,
                rowHeights: d.compareMode ? s : void 0,
                onMetrics: x,
                emptyLabel: h ? "源文件不可用：该文档没有可读取的源 PDF。" : "暂无原文 PDF",
                onNumPagesChange: A,
                activeRegion: I,
                readerMetadata: E
              }
            ) : null,
            i ? /* @__PURE__ */ f(
              Qe,
              {
                pane: "translated",
                url: b,
                preloadedFile: S,
                userZoom: a,
                visible: d.showTranslated,
                scrollRoot: n,
                pageWidthOverride: g,
                rowHeights: d.compareMode ? s : void 0,
                onMetrics: x,
                emptyLabel: "暂无译文 PDF",
                onNumPagesChange: A,
                activeRegion: I,
                readerMetadata: E
              }
            ) : null
          ]
        }
      )
    }
  );
}
const Tn = [
  { id: "source", label: "原文", Icon: at },
  { id: "translated", label: "译文", Icon: st },
  { id: "compare", label: "对照阅读", Icon: ct }
];
function Pn({
  mode: e,
  sourceOnly: t,
  onModeChange: r
}) {
  return /* @__PURE__ */ f("header", { className: "reader-topbar reader-react-topbar", children: /* @__PURE__ */ f("div", { className: "reader-tabs", role: "tablist", "aria-label": "阅读模式", children: Tn.map((n) => {
    if (t && n.id !== "source")
      return null;
    const a = e === n.id, { Icon: o } = n;
    return /* @__PURE__ */ T(
      "button",
      {
        type: "button",
        className: `reader-tab reader-tab-icon${a ? " is-active" : ""}`,
        role: "tab",
        "aria-selected": a,
        "aria-label": n.label,
        title: n.label,
        "data-reader-mode": n.id,
        onClick: () => r(n.id),
        children: [
          /* @__PURE__ */ f(o, { className: "reader-tab-lucide", size: 16, strokeWidth: 2.25, "aria-hidden": !0 }),
          /* @__PURE__ */ f("span", { className: "sr-only", children: n.label })
        ]
      },
      n.id
    );
  }) }) });
}
function En({
  loading: e,
  failed: t,
  text: r,
  percent: n
}) {
  return !e && !t ? null : /* @__PURE__ */ T(tt, { children: [
    e ? /* @__PURE__ */ f("div", { className: "reader-boot-loading", "data-reader-boot-loading": "true", children: /* @__PURE__ */ T("div", { className: "reader-boot-loading-card", children: [
      /* @__PURE__ */ f("div", { className: "reader-boot-loading-text", children: r }),
      /* @__PURE__ */ f("div", { className: "reader-boot-loading-track", children: /* @__PURE__ */ f(
        "span",
        {
          className: "reader-boot-loading-bar",
          style: { width: `${Math.max(0, Math.min(100, n))}%` }
        }
      ) })
    ] }) }) : null,
    t ? /* @__PURE__ */ f("div", { className: "reader-react-error", role: "alert", children: r }) : null
  ] });
}
function An(e, t = 42) {
  const r = `${e || ""}`.replace(/\s+/g, " ").trim();
  return r.length <= t ? r : `${r.slice(0, t).trim()}…`;
}
function In({
  selection: e,
  onAddNote: t,
  onDismiss: r
}) {
  if (!e)
    return null;
  const n = typeof window < "u" ? window.innerWidth : 800, a = typeof window < "u" ? window.innerHeight : 600, o = e.rect.left + e.rect.width / 2, c = 130, s = Math.min(Math.max(16 + c, o), n - 16 - c), l = e.rect.top > 72, i = l ? Math.max(12, e.rect.top - 8) : Math.min(a - 12, e.rect.top + e.rect.height + 8), m = l ? "above" : "below", u = e.pane === "translated" ? "译文" : "原文", h = An(e.quote);
  return /* @__PURE__ */ T(
    "div",
    {
      className: `reader-sel-pop reader-sel-pop--${m}`,
      style: { left: s, top: i },
      role: "toolbar",
      "aria-label": "选区操作",
      children: [
        /* @__PURE__ */ T("div", { className: "reader-sel-pop-card", children: [
          /* @__PURE__ */ T("div", { className: "reader-sel-pop-quote", title: e.quote, children: [
            /* @__PURE__ */ f("span", { className: "reader-sel-pop-mark", "aria-hidden": "true", children: "“" }),
            /* @__PURE__ */ f("span", { className: "reader-sel-pop-quote-text", children: h })
          ] }),
          /* @__PURE__ */ T("div", { className: "reader-sel-pop-meta", children: [
            /* @__PURE__ */ T("span", { className: "reader-sel-pop-chip", children: [
              "第 ",
              e.page,
              " 页"
            ] }),
            /* @__PURE__ */ f("span", { className: `reader-sel-pop-chip reader-sel-pop-chip--${e.pane}`, children: u })
          ] }),
          /* @__PURE__ */ T("div", { className: "reader-sel-pop-actions", children: [
            /* @__PURE__ */ T(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--primary",
                onClick: () => t(e),
                children: [
                  /* @__PURE__ */ f(it, { size: 15, strokeWidth: 2.25, "aria-hidden": !0 }),
                  /* @__PURE__ */ f("span", { children: "添加批注" })
                ]
              }
            ),
            /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--ghost",
                onClick: r,
                "aria-label": "取消选区",
                title: "取消",
                children: /* @__PURE__ */ f(Ne, { size: 15, strokeWidth: 2.5, "aria-hidden": !0 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ f("span", { className: "reader-sel-pop-caret", "aria-hidden": "true" })
      ]
    }
  );
}
const kn = [
  {
    title: "翻页",
    items: [
      { keys: "J · ↓ · PgDn", desc: "下一页" },
      { keys: "K · ↑ · PgUp", desc: "上一页" },
      { keys: "Home / End", desc: "首页 / 末页" },
      { keys: "点底栏页码", desc: "输入页码跳转" }
    ]
  },
  {
    title: "缩放",
    items: [
      { keys: "+ / −", desc: "放大 / 缩小" },
      { keys: "0", desc: "重置为模式默认" },
      { keys: "点百分比", desc: "重置为模式默认" }
    ]
  },
  {
    title: "模式",
    items: [
      { keys: "1", desc: "原文" },
      { keys: "2", desc: "译文" },
      { keys: "3", desc: "对照阅读" }
    ]
  }
];
function Dn(e) {
  if (!(e instanceof HTMLElement)) return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function Fn() {
  const [e, t] = M(!1), r = ot(), n = _(null);
  return U(() => {
    if (!e) return;
    const a = (c) => {
      const s = n.current;
      s && c.target instanceof Node && !s.contains(c.target) && t(!1);
    }, o = (c) => {
      c.key === "Escape" && (c.preventDefault(), t(!1));
    };
    return document.addEventListener("mousedown", a), window.addEventListener("keydown", o), () => {
      document.removeEventListener("mousedown", a), window.removeEventListener("keydown", o);
    };
  }, [e]), U(() => {
    const a = (o) => {
      if (o.defaultPrevented || o.metaKey || o.ctrlKey || o.altKey || Dn(o.target)) return;
      const c = o.key;
      if (c === "?" || c === "h" || c === "H" || c === "/") {
        if (c === "/" && !o.shiftKey)
          return;
        o.preventDefault(), t((s) => !s);
      }
    };
    return window.addEventListener("keydown", a), () => window.removeEventListener("keydown", a);
  }, []), /* @__PURE__ */ T("div", { className: "reader-react-shortcuts", ref: n, "data-reader-shortcuts": "", children: [
    /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        className: `reader-react-hud-btn reader-react-shortcuts-btn${e ? " is-active" : ""}`,
        "aria-label": "快捷键说明",
        "aria-expanded": e,
        "aria-controls": r,
        title: "快捷键（H 或 ?）",
        onClick: () => t((a) => !a),
        children: /* @__PURE__ */ f(_t, { className: "reader-react-shortcuts-icon", size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
      }
    ),
    e ? /* @__PURE__ */ T(
      "div",
      {
        id: r,
        className: "reader-react-shortcuts-panel",
        role: "dialog",
        "aria-label": "阅读器快捷键",
        children: [
          /* @__PURE__ */ T("div", { className: "reader-react-shortcuts-head", children: [
            /* @__PURE__ */ f("strong", { children: "快捷键" }),
            /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                className: "reader-react-shortcuts-close",
                "aria-label": "关闭",
                onClick: () => t(!1),
                children: "×"
              }
            )
          ] }),
          /* @__PURE__ */ f("div", { className: "reader-react-shortcuts-body", children: kn.map((a) => /* @__PURE__ */ T("section", { className: "reader-react-shortcuts-group", children: [
            /* @__PURE__ */ f("h3", { children: a.title }),
            /* @__PURE__ */ f("ul", { children: a.items.map((o) => /* @__PURE__ */ T("li", { children: [
              /* @__PURE__ */ f("kbd", { children: o.keys }),
              /* @__PURE__ */ f("span", { children: o.desc })
            ] }, `${a.title}-${o.keys}`)) })
          ] }, a.title)) }),
          /* @__PURE__ */ f("p", { className: "reader-react-shortcuts-foot", children: "在输入框内不会触发快捷键" })
        ]
      }
    ) : null
  ] });
}
const On = Object.freeze([
  {
    id: "notes",
    label: "批注",
    subIdle: "选中文字后添加",
    subOpen: "关闭悬浮窗",
    needsJob: !1
  },
  {
    id: "favorites",
    label: "摘录",
    subIdle: "本书云端收藏",
    subOpen: "关闭悬浮窗",
    needsJob: !1
  },
  {
    id: "markdown",
    label: "Markdown",
    subIdle: "识别 / 译文文本",
    subOpen: "关闭悬浮窗",
    needsJob: !0
  },
  {
    id: "ai",
    label: "AI 问答",
    subIdle: "基于文档提问",
    subOpen: "关闭悬浮窗",
    needsJob: !0
  }
]), xn = {
  notes: it,
  favorites: Ct,
  markdown: Lt,
  ai: $t
}, St = "retainpdf.reader.fab.pos.v1", ke = 52, pe = 12, _n = 6, $n = ["source", "sideBySide", "translated"], Ln = {
  source: at,
  sideBySide: ct,
  translated: st
}, Cn = {
  source: "原文",
  sideBySide: "对照",
  translated: "译文"
};
function ye(e, t) {
  const r = Math.max(pe, window.innerWidth - ke - pe), n = Math.max(pe, window.innerHeight - ke - pe);
  return {
    x: Math.min(r, Math.max(pe, e)),
    y: Math.min(n, Math.max(pe, t))
  };
}
function et() {
  return typeof window > "u" ? { x: 24, y: 120 } : ye(
    window.innerWidth - ke - 20,
    window.innerHeight - ke - 88
  );
}
function Un() {
  try {
    const e = localStorage.getItem(St);
    if (!e) return et();
    const t = JSON.parse(e);
    if (typeof t.x == "number" && typeof t.y == "number")
      return ye(t.x, t.y);
  } catch {
  }
  return et();
}
function Bn(e) {
  try {
    localStorage.setItem(St, JSON.stringify(e));
  } catch {
  }
}
function Wn(e) {
  if (e.sourceOnly || !e.jobId) {
    const t = be(e.sourceUrl), r = be(e.translatedUrl);
    return {
      source: t,
      translated: r,
      // sideBySide requires dedicated artifact; no fallback to source url
      sideBySide: ""
    };
  }
  return er({
    jobId: e.jobId,
    jobPayload: e.jobPayload,
    manifestPayload: e.manifestPayload
  });
}
function Hn({
  activeTool: e,
  notesCount: t,
  sourceOnly: r,
  onToggleTool: n,
  download: a
}) {
  const [o, c] = M(() => Un()), [s, l] = M(!1), [i, m] = M(() => /* @__PURE__ */ new Set()), u = _(null), h = _(null), p = ot(), b = K(() => Wn(a), [a]);
  U(() => {
    const d = () => c((g) => ye(g.x, g.y));
    return window.addEventListener("resize", d), () => window.removeEventListener("resize", d);
  }, []), U(() => {
    if (!s) return;
    const d = (v) => {
      const k = u.current;
      k && v.target instanceof Node && !k.contains(v.target) && l(!1);
    }, g = (v) => {
      v.key === "Escape" && (v.preventDefault(), l(!1));
    };
    return document.addEventListener("mousedown", d), window.addEventListener("keydown", g), () => {
      document.removeEventListener("mousedown", d), window.removeEventListener("keydown", g);
    };
  }, [s]);
  const w = N((d) => {
    n(d), l(!1);
  }, [n]), S = N(
    async (d) => {
      const g = be(b[d]);
      if (!(!g || i.has(d)))
        try {
          const v = a.jobId ? Qt(d, {
            jobId: a.jobId,
            jobPayload: a.jobPayload,
            manifestPayload: a.manifestPayload
          }) : `${a.sourceOnly ? "document" : "reader"}-${d}.pdf`;
          await tr(
            a.fetchProtected,
            g,
            v,
            v,
            null,
            (k) => m((W) => {
              const F = new Set(W);
              return k ? F.add(d) : F.delete(d), F;
            })
          );
        } catch (v) {
          const k = v instanceof Error ? v.message : "下载失败";
          rr(k), m((W) => {
            const F = new Set(W);
            return F.delete(d), F;
          });
        }
    },
    [b, i, a]
  ), x = (d) => {
    d.button === 0 && (d.currentTarget.setPointerCapture(d.pointerId), h.current = {
      pointerId: d.pointerId,
      startX: d.clientX,
      startY: d.clientY,
      originX: o.x,
      originY: o.y,
      moved: !1
    });
  }, A = (d) => {
    const g = h.current;
    if (!g || g.pointerId !== d.pointerId) return;
    const v = d.clientX - g.startX, k = d.clientY - g.startY;
    !g.moved && Math.hypot(v, k) < _n || (g.moved = !0, s && l(!1), c(ye(g.originX + v, g.originY + k)));
  }, I = (d) => {
    const g = h.current;
    if (!(!g || g.pointerId !== d.pointerId)) {
      h.current = null;
      try {
        d.currentTarget.releasePointerCapture(d.pointerId);
      } catch {
      }
      if (g.moved) {
        c((v) => {
          const k = ye(v.x, v.y);
          return Bn(k), k;
        });
        return;
      }
      l((v) => !v);
    }
  }, E = t > 0 ? t > 99 ? "99+" : String(t) : null, R = typeof window < "u" && o.y > window.innerHeight * 0.55, y = $n.filter((d) => !(a.sourceOnly && d !== "source"));
  return /* @__PURE__ */ T(
    "div",
    {
      ref: u,
      className: `reader-fab${s ? " is-open" : ""}${R ? " is-open-up" : ""}`,
      style: { left: o.x, top: o.y },
      "data-reader-fab": "",
      children: [
        s ? /* @__PURE__ */ T(
          "div",
          {
            id: p,
            className: "reader-fab-menu",
            role: "menu",
            "aria-label": "阅读工具",
            children: [
              /* @__PURE__ */ T("header", { className: "reader-fab-menu-head", children: [
                /* @__PURE__ */ T("div", { className: "reader-fab-menu-head-text", children: [
                  /* @__PURE__ */ f("strong", { children: "工具" }),
                  /* @__PURE__ */ f("span", { children: "拖动圆钮可移动" })
                ] }),
                /* @__PURE__ */ f(
                  "button",
                  {
                    type: "button",
                    className: "reader-fab-menu-close",
                    "aria-label": "关闭菜单",
                    onClick: () => l(!1),
                    children: /* @__PURE__ */ f(Ne, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }),
              On.map((d, g) => {
                const v = xn[d.id], k = e === d.id, W = d.needsJob && r;
                let F = k ? d.subOpen : d.subIdle;
                return d.id === "notes" && !k && t > 0 && (F = `${t} 条批注`), W && (F = "需打开任务阅读"), /* @__PURE__ */ T(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    className: `reader-fab-row${k ? " is-active" : ""}${W ? " is-disabled" : ""}`,
                    "aria-pressed": k,
                    disabled: W,
                    onClick: () => w(d.id),
                    style: { "--fab-i": g },
                    children: [
                      /* @__PURE__ */ f("span", { className: "reader-fab-row-icon", "aria-hidden": "true", children: /* @__PURE__ */ f(v, { size: 18, strokeWidth: 2 }) }),
                      /* @__PURE__ */ T("span", { className: "reader-fab-row-copy", children: [
                        /* @__PURE__ */ f("span", { className: "reader-fab-row-title", children: d.label }),
                        /* @__PURE__ */ f("span", { className: "reader-fab-row-sub", children: F })
                      ] }),
                      d.id === "notes" && E ? /* @__PURE__ */ f("span", { className: "reader-fab-row-badge", children: E }) : null
                    ]
                  },
                  d.id
                );
              }),
              /* @__PURE__ */ T("div", { className: "reader-fab-section", role: "group", "aria-label": "下载", children: [
                /* @__PURE__ */ T("div", { className: "reader-fab-section-head", children: [
                  /* @__PURE__ */ f(Ut, { size: 12, strokeWidth: 2.5, "aria-hidden": !0 }),
                  /* @__PURE__ */ f("span", { children: "下载 PDF" })
                ] }),
                /* @__PURE__ */ f("div", { className: "reader-fab-download-grid", children: y.map((d, g) => {
                  const v = kt[d], k = be(b[d]), W = i.has(d), F = !!k && !W, Q = F ? "" : Dt(d, b), ee = Ln[d];
                  return /* @__PURE__ */ T(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      id: `reader-fab-download-${d}`,
                      className: `reader-fab-chip${W ? " is-busy" : ""}${F ? "" : " is-disabled"}`,
                      disabled: !F,
                      title: F ? `下载${v.label}` : Q,
                      onClick: () => void S(d),
                      style: { "--fab-i": g },
                      children: [
                        /* @__PURE__ */ f("span", { className: "reader-fab-chip-icon", "aria-hidden": "true", children: /* @__PURE__ */ f(ee, { size: 16, strokeWidth: 2 }) }),
                        /* @__PURE__ */ f("span", { className: "reader-fab-chip-label", children: Cn[d] }),
                        /* @__PURE__ */ f("span", { className: "reader-fab-chip-state", children: W ? "…" : F ? "↓" : "—" })
                      ]
                    },
                    d
                  );
                }) }),
                y.every((d) => !be(b[d])) ? /* @__PURE__ */ f("p", { className: "reader-fab-empty", children: "产物尚未就绪" }) : null
              ] })
            ]
          }
        ) : null,
        /* @__PURE__ */ T(
          "button",
          {
            type: "button",
            className: `reader-fab-trigger${s ? " is-open" : ""}${e ? " has-notes" : ""}`,
            "aria-label": s ? "收起工具菜单" : "打开工具菜单",
            "aria-expanded": s,
            "aria-controls": s ? p : void 0,
            "aria-haspopup": "menu",
            onPointerDown: x,
            onPointerMove: A,
            onPointerUp: I,
            onPointerCancel: I,
            children: [
              /* @__PURE__ */ f("span", { className: "reader-fab-icon", "aria-hidden": "true", children: s ? /* @__PURE__ */ f(Ne, { size: 20, strokeWidth: 2.5 }) : /* @__PURE__ */ T("span", { className: "reader-fab-dots", children: [
                /* @__PURE__ */ f("i", {}),
                /* @__PURE__ */ f("i", {}),
                /* @__PURE__ */ f("i", {})
              ] }) }),
              !s && E ? /* @__PURE__ */ f("span", { className: "reader-fab-badge", "aria-hidden": "true", children: E }) : null
            ]
          }
        )
      ]
    }
  );
}
function jn({
  userZoom: e,
  onZoomChange: t,
  currentPage: r,
  numPages: n,
  onGoToPage: a,
  mode: o = "compare"
}) {
  const c = gr(e), s = e > mt + 1e-3, l = e < ht - 1e-3, i = Te(), m = "50%（半屏，对照铺满）", [u, h] = M(!1), [p, b] = M(`${r}`);
  U(() => {
    u || b(`${Math.min(Math.max(r, 1), Math.max(n, 1))}`);
  }, [r, n, u]);
  const w = () => {
    if (h(!1), !a || n <= 0)
      return;
    const S = Number(`${p}`.trim());
    a(Ae(S, n));
  };
  return /* @__PURE__ */ T("div", { className: "reader-react-hud", "data-reader-hud": "true", children: [
    /* @__PURE__ */ f("div", { className: "reader-react-hud-group", "aria-label": "页码", children: u ? /* @__PURE__ */ T(
      "form",
      {
        className: "reader-react-hud-page-form",
        onSubmit: (S) => {
          S.preventDefault(), w();
        },
        children: [
          /* @__PURE__ */ f(
            "input",
            {
              className: "reader-react-hud-page-input",
              type: "text",
              inputMode: "numeric",
              pattern: "[0-9]*",
              "aria-label": "跳转到页码",
              value: p,
              autoFocus: !0,
              onChange: (S) => b(S.target.value.replace(/[^\d]/g, "")),
              onBlur: w,
              onKeyDown: (S) => {
                S.key === "Escape" && (S.preventDefault(), h(!1), b(`${r}`));
              }
            }
          ),
          /* @__PURE__ */ T("span", { className: "reader-react-hud-page-suffix", children: [
            "/ ",
            n || "—"
          ] })
        ]
      }
    ) : /* @__PURE__ */ f(
      "button",
      {
        type: "button",
        className: "reader-react-hud-page reader-react-hud-page-btn",
        "aria-label": n > 0 ? `跳转页码，当前第 ${r} 页，共 ${n} 页` : "页码",
        title: n > 0 ? "点击输入页码跳转" : void 0,
        disabled: !a || n <= 0,
        onClick: () => {
          !a || n <= 0 || (b(`${r}`), h(!0));
        },
        children: n > 0 ? `${Math.min(r, n)} / ${n}` : "—"
      }
    ) }),
    /* @__PURE__ */ T("div", { className: "reader-react-hud-group", "aria-label": "缩放", children: [
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn",
          "aria-label": "缩小",
          disabled: !s,
          onClick: () => t(we(e, -1)),
          children: "−"
        }
      ),
      /* @__PURE__ */ T(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn reader-react-hud-zoom-label",
          "aria-label": `重置为${m}`,
          title: m,
          onClick: () => t(i),
          children: [
            c,
            "%"
          ]
        }
      ),
      /* @__PURE__ */ f(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn",
          "aria-label": "放大",
          disabled: !l,
          onClick: () => t(we(e, 1)),
          children: "+"
        }
      )
    ] }),
    /* @__PURE__ */ f("div", { className: "reader-react-hud-group reader-react-hud-help", "aria-label": "帮助", children: /* @__PURE__ */ f(Fn, {}) })
  ] });
}
const He = "download-toast";
function zn({
  title: e = "下载中",
  status: t = "正在准备...",
  meta: r = "等待响应...",
  percent: n = NaN,
  tone: a = "progress"
}) {
  const o = Number.isFinite(n) ? Math.max(4, Math.min(100, Number(n) || 0)) : 18;
  return /* @__PURE__ */ T("div", { className: "download-toast-card", "data-tone": a, "aria-live": "polite", children: [
    /* @__PURE__ */ T("div", { className: "download-toast-head", children: [
      /* @__PURE__ */ f("div", { id: "download-toast-title", className: "download-toast-title", children: e }),
      /* @__PURE__ */ f("div", { id: "download-toast-status", className: "download-toast-status", children: t })
    ] }),
    /* @__PURE__ */ f("div", { className: "download-toast-track", children: /* @__PURE__ */ f("span", { id: "download-toast-bar", className: "download-toast-bar", style: { width: `${o}%` } }) }),
    /* @__PURE__ */ f("div", { id: "download-toast-meta", className: "download-toast-meta", children: r })
  ] });
}
function qn(e = {}) {
  const {
    visible: t = !1,
    title: r = "下载中",
    status: n = "正在准备...",
    meta: a = "等待响应...",
    percent: o = NaN,
    tone: c = "progress"
  } = e;
  if (!t) {
    Ce.dismiss(He);
    return;
  }
  Ce.custom(
    () => /* @__PURE__ */ f(zn, { title: r, status: n, meta: a, percent: o, tone: c }),
    { id: He, duration: 1 / 0 }
  );
}
function Kn() {
  const e = N((t) => {
    t && (t.setState = qn, t.hide = () => Ce.dismiss(He));
  }, []);
  return /* @__PURE__ */ T(tt, { children: [
    /* @__PURE__ */ f(Ot, { position: "bottom-right" }),
    /* @__PURE__ */ f("download-toast", { style: { display: "none" }, "aria-hidden": "true", ref: e })
  ] });
}
const Jn = ve(() => import("./ReaderNotesPanel-QwL6XQP7.js").then((e) => ({ default: e.ReaderNotesPanel }))), Zn = ve(() => import("./ReaderFavoritesPanel-BOKMhv9l.js").then((e) => ({ default: e.ReaderFavoritesPanel }))), Yn = ve(() => import("./ReaderMarkdownPanel-CN0bpjks.js").then((e) => ({ default: e.ReaderMarkdownPanel }))), Xn = ve(() => import("./ReaderAiPanel-D1GRG7RE.js").then((e) => ({ default: e.ReaderAiPanel }))), Gn = ve(() => import("./ReaderAiSplitResizeHandle-D0nnNMs6.js").then((e) => ({ default: e.ReaderAiSplitResizeHandle })));
function Vn(e) {
  return e === "compare" ? "floating" : "docked";
}
function Qn() {
  const e = nn(), { boot: t, panes: r, shell: n, sessionFiles: a, notes: o, tools: c, session: s } = e, l = c.isOpen("markdown"), i = Vn(e.mode), m = c.isOpen("ai") && i === "docked", u = N(() => {
    c.close();
  }, [c]), h = N((p) => {
    xt() || e.jumpToAnchor(p);
  }, [e.jumpToAnchor]);
  return /* @__PURE__ */ T("div", { className: `reader-react-root${l ? " is-markdown-split" : ""}${m ? " is-ai-split" : ""}`, "data-reader-engine": "react-pdf", children: [
    /* @__PURE__ */ f(En, { loading: t.loading, failed: t.failed, text: t.text, percent: t.percent }),
    /* @__PURE__ */ f(mn, {}),
    /* @__PURE__ */ f(Pn, { mode: e.mode, sourceOnly: e.sourceOnly, onModeChange: e.setModeKeepingPage }),
    e.showHud ? /* @__PURE__ */ f(Hn, { activeTool: c.active, notesCount: o.count, sourceOnly: e.sourceOnly, onToggleTool: c.toggle, download: e.download }) : null,
    /* @__PURE__ */ f(Nn, { mode: e.mode, bindShell: n.bindShell, shellEl: n.shellEl, userZoom: e.userZoom, compareMode: r.compareMode, shellWidth: n.shellWidth, compareColWidth: n.compareColWidth, rowHeights: e.rowHeights, mountSource: r.mountSource, mountTranslated: r.mountTranslated, showSource: r.showSource, showTranslated: r.showTranslated, sourceOnly: e.sourceOnly, sourceUrl: a.sourceUrl, translatedUrl: a.translatedUrl, sourceFile: a.sourceFile, translatedFile: a.translatedFile, activeRegion: e.activeRegion, readerMetadata: s.readerMetadata, markdownSplit: l, assistantSplit: m, onMetrics: r.onMetrics, onNumPagesChange: r.onNumPages }),
    e.showHud ? /* @__PURE__ */ f(jn, { userZoom: e.userZoom, onZoomChange: e.onZoomChange, currentPage: e.currentPage, numPages: r.hudNumPages, mode: e.mode, onGoToPage: e.goToPage }) : null,
    /* @__PURE__ */ T(Pt, { fallback: null, children: [
      /* @__PURE__ */ f(Jn, { open: c.isOpen("notes"), groups: o.groups, count: o.count, onClose: u, onJump: e.jumpToNote, onUpdateNote: o.updateNote, onRemove: o.remove, onExport: () => o.exportMarkdown(e.documentTitle) }),
      /* @__PURE__ */ f(Zn, { open: c.isOpen("favorites"), jobId: s.jobId, documentId: s.documentId, onClose: u, onJumpPage: e.goToPage }),
      /* @__PURE__ */ f(Yn, { open: l, jobId: s.jobId, sourceOnly: e.sourceOnly, layout: "docked", onClose: u }),
      /* @__PURE__ */ f(Xn, { open: c.isOpen("ai"), jobId: s.jobId, layout: i, onClose: u, onJumpCitation: h }, s.jobId || "reader-ai-pending"),
      m ? /* @__PURE__ */ f(Gn, {}) : null
    ] }),
    /* @__PURE__ */ f(In, { selection: e.selection, onAddNote: e.addNoteFromSelection, onDismiss: e.clearSelection }),
    /* @__PURE__ */ f(Kn, {})
  ] });
}
function go() {
  return /* @__PURE__ */ f(Qn, {});
}
export {
  dt as A,
  go as R,
  Qn as a,
  Kt as b,
  po as c,
  Me as d,
  mo as e,
  ho as f,
  fo as r
};
//# sourceMappingURL=ReaderApp-BTWCGnBQ.js.map
