import { jsxs as P, jsx as h, Fragment as lt } from "react/jsx-runtime";
import { useState as N, useEffect as U, useRef as k, useMemo as q, useCallback as S, useLayoutEffect as dt, memo as ut, forwardRef as Ft, useImperativeHandle as Ot, useId as ft, Suspense as xt, lazy as Re } from "react";
import { getReaderAdapters as K, requireAdapter as ue } from "./adapters.js";
import { resolveReaderDownloadName as $t, resolveReaderDownloadUrls as _t, createReaderServerFavoritesPort as Lt, READER_PROGRESS_COPY as re, trimString as ye, READER_DOWNLOAD_ACTIONS as Ct, disabledReason as Ut } from "./runtime/state.js";
import { d as Bt } from "./ask-answerer-CG3B68VS.js";
import "@retainpdf/api/conversations";
import { n as tt } from "./block-key-BTxcG28S.js";
import { toast as je, Toaster as Wt } from "sonner";
import { o as Ht } from "./answer-enhance-C1inCPcI.js";
import { X as Ae, FileText as mt, Columns2 as ht, Languages as pt, StickyNote as gt, Keyboard as zt, Sparkles as jt, FileCode2 as qt, Bookmark as Kt, Download as Jt } from "lucide-react";
import { pdfjs as Zt, Page as Yt, Document as Xt } from "react-pdf";
const Gt = (...e) => {
  var t, r;
  return ((r = (t = K()) == null ? void 0 : t.isMockMode) == null ? void 0 : r.call(t, ...e)) ?? !1;
}, Vt = "", Qt = Object.freeze({
  progress: "retainpdf-reader-progress"
}), Ee = (e) => {
  var t, r;
  return ((r = (t = K()) == null ? void 0 : t.resolveResourceUrl) == null ? void 0 : r.call(t, e)) ?? e;
}, er = (...e) => {
  var t, r;
  return ((r = (t = K()) == null ? void 0 : t.fetchProtected) == null ? void 0 : r.call(t, ...e)) ?? fetch(...e);
}, qe = (e = "") => {
  var t, r;
  return ((r = (t = K()) == null ? void 0 : t.resolvePdfjsVendorUrl) == null ? void 0 : r.call(t, e)) ?? "";
}, Te = new Proxy({}, { get: (e, t) => (...r) => {
  var n, a, o;
  return (o = (a = (n = K()) == null ? void 0 : n.defaultReaderDataPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...r);
} }), bt = new Proxy({}, { get: (e, t) => (...r) => {
  var n, a, o;
  return (o = (a = (n = K()) == null ? void 0 : n.defaultReaderPageConfigPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...r);
} }), tr = (...e) => {
  var t, r;
  return ((r = (t = K()) == null ? void 0 : t.resolveReaderAnchor) == null ? void 0 : r.call(t, ...e)) ?? null;
}, rr = () => {
  var e, t;
  return ((t = (e = K()) == null ? void 0 : e.resolveReaderDocumentId) == null ? void 0 : t.call(e)) ?? "";
}, nr = (...e) => {
  var t, r;
  return ((r = (t = K()) == null ? void 0 : t.resolveReaderJobId) == null ? void 0 : r.call(t, ...e)) ?? "";
}, or = (...e) => {
  var t, r;
  return ((r = (t = K()) == null ? void 0 : t.resolveReaderArtifactUrl) == null ? void 0 : r.call(t, ...e)) ?? "";
}, ar = (...e) => {
  var t, r;
  return ((r = (t = K()) == null ? void 0 : t.resolveReaderSourcePdf) == null ? void 0 : r.call(t, ...e)) ?? null;
}, sr = (...e) => {
  var t, r;
  return ((r = (t = K()) == null ? void 0 : t.resolveReaderTranslatedPdfUrl) == null ? void 0 : r.call(t, ...e)) ?? "";
}, cr = (...e) => {
  var t, r;
  return ((r = (t = K()) == null ? void 0 : t.resolveReaderDownloadName) == null ? void 0 : r.call(t, ...e)) ?? $t(...e);
}, ir = (...e) => {
  var t, r;
  return ((r = (t = K()) == null ? void 0 : t.resolveReaderDownloadUrls) == null ? void 0 : r.call(t, ...e)) ?? _t(...e);
}, lr = (...e) => ue("downloadProtectedResource")(...e), dr = (...e) => ue("failDownloadToast")(...e), So = (e, t) => ue("resolveMarkdownAssetUrl")(e, t), No = (e = {}) => {
  const t = K();
  return Bt({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) || "/api/v1",
    ask: t == null ? void 0 : t.askDocumentAi,
    documentByJobId: t == null ? void 0 : t.fetchDocumentByJobId,
    ...e
  });
}, yt = "/api/v1", To = (e = yt, t = {}) => {
  var r;
  return ue("fetchFavorites")(
    ((r = K()) == null ? void 0 : r.apiPrefix) ?? e,
    t
  );
};
function Po(e = {}) {
  const t = K();
  return Lt({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) ?? yt,
    documentByJobId: (...r) => ue("fetchDocumentByJobId")(...r),
    submitFavorite: (...r) => ue("createFavorite")(...r),
    loadFavorites: (...r) => ue("fetchFavorites")(...r),
    removeFavorite: (...r) => ue("deleteFavorite")(...r),
    ...e
  });
}
function ur(e) {
  return e ? { data: e.data.slice() } : null;
}
const fr = 2, ne = /* @__PURE__ */ new Map();
function Ke(e, t) {
  ne.delete(e), ne.set(e, t);
}
function mr(e) {
  if (ne.size < fr) return;
  const t = ne.keys().next().value;
  t && ne.delete(t);
}
function Ue(e) {
  const t = `${e || ""}`.trim();
  if (!t || !ne.has(t)) return null;
  const r = ne.get(t);
  return Ke(t, r), r;
}
async function wt(e, t = er, r = {}) {
  const n = `${e || ""}`.trim();
  if (!n)
    return null;
  if (ne.has(n)) {
    const c = ne.get(n);
    return Ke(n, c), c;
  }
  const a = await t(n, { signal: r.signal });
  if (!a.ok) {
    const c = new Error(`读取 PDF 失败 (${a.status})`);
    throw c.status = a.status, c;
  }
  const o = await a.arrayBuffer(), s = { data: new Uint8Array(o) };
  return ne.has(n) ? Ke(n, s) : (mr(), ne.set(n, s)), s;
}
function hr(e = "", t = null) {
  const [r, n] = N(
    () => t || Ue(e)
  ), [a, o] = N(
    () => !!`${e || ""}`.trim() && !t && !Ue(e)
  ), [s, c] = N("");
  return U(() => {
    if (t) {
      n(t), o(!1), c("");
      return;
    }
    const d = `${e || ""}`.trim();
    if (!d) {
      n(null), o(!1), c("");
      return;
    }
    const i = Ue(d);
    if (i) {
      n(i), o(!1), c("");
      return;
    }
    let f = !1;
    return o(!0), c(""), n(null), wt(d).then((l) => {
      f || (n(l), o(!1));
    }).catch((l) => {
      f || (n(null), o(!1), c((l == null ? void 0 : l.message) || String(l)));
    }), () => {
      f = !0;
    };
  }, [e, t]), { file: r, loading: a, error: s };
}
function me(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : null;
}
function vt(e) {
  const t = me(e);
  return t && "data" in t ? t.data : e;
}
function be(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : null;
}
function rt(e) {
  const t = me(e);
  if (!t || !Array.isArray(t.bbox) || t.bbox.length !== 4) return null;
  const r = t.bbox.map(Number);
  if (!r.every(Number.isFinite)) return null;
  const n = be(t.page);
  if (n == null) return null;
  const [a, o, s, c] = r, d = Math.min(a, s), i = Math.min(o, c), f = Math.max(a, s), l = Math.max(o, c);
  if (f <= d || l <= i) return null;
  const m = `${t.unit || "pdf_point"}`.trim().toLowerCase();
  if (m !== "pdf_point" && m !== "pt") return null;
  const p = `${t.origin || "top_left"}`.trim().toLowerCase();
  return p !== "top_left" && p !== "bottom_left" ? null : {
    page: Math.floor(n),
    bbox: [d, i, f, l],
    unit: "pdf_point",
    origin: p,
    text: `${t.text || ""}`
  };
}
function pr(e) {
  const t = me(vt(e)), r = Array.isArray(t == null ? void 0 : t.items) ? t.items : [], n = [];
  for (const a of r) {
    const o = me(a), s = `${(o == null ? void 0 : o.item_id) || (o == null ? void 0 : o.itemId) || ""}`.trim(), c = rt(o == null ? void 0 : o.source), d = rt(o == null ? void 0 : o.translated);
    !s || !c || !d || n.push({
      itemId: s,
      source: c,
      translated: d,
      markdown: `${(o == null ? void 0 : o.markdown) || ""}`,
      regionType: `${(o == null ? void 0 : o.region_type) || (o == null ? void 0 : o.regionType) || ""}`,
      status: `${(o == null ? void 0 : o.status) || ""}`
    });
  }
  return n;
}
function nt(e) {
  const t = me(e);
  if (!t) return null;
  const r = [];
  for (const a of Array.isArray(t.pages) ? t.pages : []) {
    const o = me(a), s = be(o == null ? void 0 : o.page), c = be(o == null ? void 0 : o.width), d = be(o == null ? void 0 : o.height);
    s == null || c == null || d == null || r.push({ page: Math.floor(s), width: c, height: d });
  }
  if (!r.length) return null;
  const n = be(t.page_count ?? t.pageCount);
  return {
    pageCount: n == null ? r.length : Math.floor(n),
    pages: r
  };
}
function gr(e) {
  const t = me(vt(e));
  return {
    source: nt(t == null ? void 0 : t.source),
    translated: nt(t == null ? void 0 : t.translated)
  };
}
function Be(e, t) {
  const r = tt(t);
  return r && e.find((n) => tt(n.itemId) === r) || null;
}
function Je(e, t) {
  return t === "translated" ? e.translated : e.source;
}
function br(e, t, r) {
  if (!e || !t) return null;
  const n = Je(e, r), a = r === "translated" ? t.translated : t.source, o = a == null ? void 0 : a.pages.find((s) => s.page === n.page);
  return o ? { itemId: e.itemId, box: n, pageSize: o } : null;
}
function yr(e, t, r) {
  if (!e || t <= 0 || r <= 0) return null;
  const { box: n, pageSize: a } = e;
  if (a.width <= 0 || a.height <= 0) return null;
  const [o, s, c, d] = n.bbox, i = n.origin === "bottom_left" ? a.height - d : s, f = n.origin === "bottom_left" ? a.height - s : d, l = Math.max(0, Math.min(t, o / a.width * t)), m = Math.max(l, Math.min(t, c / a.width * t)), p = Math.max(0, Math.min(r, i / a.height * r)), g = Math.max(p, Math.min(r, f / a.height * r));
  return m <= l || g <= p ? null : { left: l, top: p, width: m - l, height: g - p };
}
function ot(e, t) {
  const r = `/api/v1/documents/${encodeURIComponent(e)}/source.pdf`, n = `${t || ""}`.trim();
  return Ee(n ? `${r}?version=${encodeURIComponent(n)}` : r);
}
function We(e) {
  document.body.classList.remove(
    "reader-mode-source",
    "reader-mode-translated",
    "reader-mode-compare"
  ), document.body.classList.add(`reader-mode-${e}`);
}
function wr(e, t = "") {
  const r = `${e || ""}`.trim(), n = `${t || ""}`.trim();
  return !!(!r || n && (r === n || r === `${n}.pdf`) || /^\d{8,14}-[0-9a-f]{4,}$/i.test(r));
}
function vr(e, t) {
  var n;
  const r = [
    e == null ? void 0 : e.title,
    e == null ? void 0 : e.display_name,
    e == null ? void 0 : e.source_file_name,
    (n = e == null ? void 0 : e.book_summary) == null ? void 0 : n.source_file_name
  ];
  for (const a of r) {
    const o = `${a || ""}`.trim();
    if (o && !wr(o, t))
      return o.replace(/\.pdf$/i, "");
  }
  return "";
}
function de({
  percent: e,
  text: t,
  stage: r
}) {
  var n;
  try {
    (n = window.parent) == null || n.postMessage(
      {
        type: Qt.progress,
        stage: r,
        percent: e,
        text: t
      },
      bt.messageTargetOrigin()
    );
  } catch {
  }
}
function Pe(e, t, r, n = "progress") {
  e({
    loading: !0,
    percent: t,
    text: r,
    stage: n,
    failed: !1
  }), de({ percent: t, text: r, stage: n });
}
function Rr() {
  const e = k(!1), t = k(null), [r, n] = N(() => {
    var D, Z;
    return ((D = globalThis.location) == null ? void 0 : D.search) || ((Z = globalThis.location) == null ? void 0 : Z.href) || "";
  });
  U(() => {
    var he, z, X, M;
    const D = () => {
      var L, $;
      return n(((L = globalThis.location) == null ? void 0 : L.search) || (($ = globalThis.location) == null ? void 0 : $.href) || "");
    }, Z = (z = (he = globalThis.history) == null ? void 0 : he.pushState) == null ? void 0 : z.bind(globalThis.history), j = (M = (X = globalThis.history) == null ? void 0 : X.replaceState) == null ? void 0 : M.bind(globalThis.history);
    let te = !1;
    if (Z && j)
      try {
        const L = ($) => function(...I) {
          const H = $.apply(this, I);
          return D(), globalThis.dispatchEvent(new Event("pushstate")), globalThis.dispatchEvent(new Event("replacestate")), globalThis.dispatchEvent(new Event("locationchange")), H;
        };
        globalThis.history.pushState = L(Z), globalThis.history.replaceState = L(j), te = !0;
      } catch {
      }
    return window.addEventListener("popstate", D), window.addEventListener("hashchange", D), window.addEventListener("pushstate", D), window.addEventListener("replacestate", D), window.addEventListener("locationchange", D), () => {
      if (window.removeEventListener("popstate", D), window.removeEventListener("hashchange", D), window.removeEventListener("pushstate", D), window.removeEventListener("replacestate", D), window.removeEventListener("locationchange", D), te && Z && j)
        try {
          globalThis.history.pushState = Z, globalThis.history.replaceState = j;
        } catch {
        }
    };
  }, []);
  const a = q(() => nr(bt), [r]), o = q(
    () => a ? "" : rr(),
    [r, a]
  ), [s, c] = N({
    documentId: "",
    jobId: ""
  }), d = s.documentId === o ? s.jobId : "", i = a || d, f = !!o && !i, [l, m] = N(null), p = f || !!(l != null && l.documentId), [g, y] = N(p ? "source" : "compare"), [T, F] = N(""), [E, A] = N(""), [_, R] = N(null), [w, u] = N(null), [b, v] = N(!1), [O, B] = N(""), [C, J] = N(null), [V, oe] = N(null), [ce, ae] = N([]), [x, Q] = N(() => ({
    source: null,
    translated: null
  })), [ee, W] = N({
    loading: !0,
    percent: 4,
    text: re.boot,
    stage: "progress",
    failed: !1
  }), se = S((D) => {
    p && D !== "source" || (y(D), We(D));
  }, [p]), Y = S((D) => {
    const Z = `${D.documentId || ""}`.trim();
    if (!Z) return;
    const j = `${D.revision || ""}`.trim() || `${Date.now()}`;
    m({
      documentId: Z,
      revision: j
    }), y("source"), We("source");
  }, []), _e = S(() => {
    var D;
    e.current = !0, (D = t.current) == null || D.abort();
  }, []);
  U(() => (p && document.documentElement.classList.add("reader-source-only"), We(g), () => {
    document.documentElement.classList.remove("reader-source-only");
  }), [p, g]), U(() => {
    const D = new AbortController();
    let Z = !1;
    t.current = D;
    const j = () => Z || e.current || D.signal.aborted;
    if (e.current)
      return D.abort(), () => {
        Z = !0, t.current === D && (t.current = null);
      };
    async function te(z, X, M, L) {
      if (!z || j())
        return null;
      Pe(W, M, X, "download");
      const $ = await wt(z, Te.fetchProtected, {
        signal: D.signal
      });
      return j() ? null : (Pe(W, L, X, "download"), $);
    }
    async function he() {
      v(!1), R(null), u(null), ae([]), Q({ source: null, translated: null }), Pe(W, 8, re.metadata, "metadata");
      try {
        if (f) {
          let fe = null;
          try {
            const Se = await Te.fetchProtected(
              Ee(`/api/v1/documents/${encodeURIComponent(o)}`)
            );
            if (Se != null && Se.ok) {
              const Ne = await Se.json().catch(() => null), Le = (Ne == null ? void 0 : Ne.data) ?? Ne, Ce = `${(Le == null ? void 0 : Le.active_job_id) || ""}`.trim();
              Ce && !Ce.startsWith("doc:") && (fe = Ce);
            }
          } catch {
          }
          if (fe && !j()) {
            c({ documentId: o, jobId: fe });
            return;
          }
          const Qe = l != null && l.documentId ? ot(
            l.documentId,
            l.revision
          ) : Gt() ? Vt : Ee(`/api/v1/documents/${encodeURIComponent(o)}/source.pdf`);
          if (j()) return;
          F(Qe), A(""), B(""), J(null), oe(null);
          const et = await te(Qe, "正在下载原文 PDF…", 30, 85);
          if (j()) return;
          if (!et) {
            W({
              loading: !1,
              percent: 100,
              text: "源文件不可用：该文档没有可读取的源 PDF。",
              stage: "failed",
              failed: !0
            }), de({ percent: 100, text: "源文件下载失败", stage: "failed" });
            return;
          }
          R(et), v(!0), W({
            loading: !1,
            percent: 100,
            text: re.ready,
            stage: "ready",
            failed: !1
          }), de({ percent: 100, text: re.ready, stage: "ready" });
          return;
        }
        if (!i) {
          W({
            loading: !1,
            percent: 100,
            text: re.failed,
            stage: "failed",
            failed: !0
          }), de({ percent: 100, text: re.failed, stage: "failed" });
          return;
        }
        const z = await Te.loadReaderPayload(i);
        if (j()) return;
        const X = ar(z.manifestPayload), M = sr(z.jobPayload, z.manifestPayload), L = typeof X == "string" ? X : or(X), $ = l != null && l.documentId ? ot(
          l.documentId,
          l.revision
        ) : L || (o ? Ee(`/api/v1/documents/${encodeURIComponent(o)}/source.pdf`) : ""), I = l ? "" : M || "";
        if (F($ || ""), A(I), B(vr(z.jobPayload, i)), J(z.jobPayload || null), oe(z.manifestPayload || null), ae(l ? [] : pr(z.regionsPayload)), Q(l ? { source: null, translated: null } : gr(z.readerMetadata)), !$ && !I) {
          W({
            loading: !1,
            percent: 100,
            text: re.failed,
            stage: "failed",
            failed: !0
          }), de({ percent: 100, text: re.failed, stage: "failed" });
          return;
        }
        Pe(W, 25, "正在下载 PDF…", "download");
        const H = [];
        let G = null, ie = null;
        if ($ && H.push(
          te($, "正在下载原文 PDF…", 30, 55).then((fe) => {
            G = fe;
          })
        ), I && H.push(
          te(I, "正在下载译文 PDF…", 55, 85).then((fe) => {
            ie = fe;
          })
        ), await Promise.all(H), j()) return;
        if (!!$ && !G || !!I && !ie) {
          W({
            loading: !1,
            percent: 100,
            text: "PDF 下载失败，请重试",
            stage: "failed",
            failed: !0
          }), de({ percent: 100, text: "PDF 下载失败", stage: "failed" });
          return;
        }
        R(G), u(ie), v(!0), W({
          loading: !1,
          percent: 100,
          text: re.ready,
          stage: "ready",
          failed: !1
        }), de({ percent: 100, text: re.ready, stage: "ready" });
      } catch (z) {
        if (j() || (z == null ? void 0 : z.name) === "AbortError") return;
        const X = z instanceof Error ? z.message : re.failed;
        W({
          loading: !1,
          percent: 100,
          text: X,
          stage: "failed",
          failed: !0
        }), de({ percent: 100, text: X, stage: "failed" });
      }
    }
    return he(), () => {
      Z = !0, D.abort(), t.current === D && (t.current = null);
    };
  }, [i, o, f, r, l]);
  const Me = q(
    () => ({
      fetchProtected: Te.fetchProtected,
      jobId: i,
      jobPayload: C,
      manifestPayload: V,
      sourceUrl: T,
      translatedUrl: E,
      sourceOnly: p
    }),
    [i, C, V, T, E, p]
  );
  return {
    jobId: i,
    documentId: o,
    sourceOnly: f,
    mode: g,
    setMode: se,
    sourceUrl: T,
    translatedUrl: E,
    sourceFile: _,
    translatedFile: w,
    assetsReady: b,
    boot: ee,
    title: O,
    regions: ce,
    readerMetadata: x,
    download: Me,
    refreshCommittedDocument: Y,
    prepareClose: _e
  };
}
const Rt = 0.25, Mt = 1, Mr = 0.05, Ye = 0.5, Sr = 16, Nr = 8;
function Ie(e) {
  return Ye;
}
function $e(e) {
  return Number.isFinite(e) ? Math.min(Mt, Math.max(Rt, e)) : Ye;
}
function ve(e, t) {
  const r = $e(Number(e) + t * Mr);
  return Math.round(r * 100) / 100;
}
function Tr(e) {
  return Math.round($e(e) * 100);
}
function Pr(e) {
  const t = Number(e) || 0;
  return Math.max(160, Math.floor((t - 1) / 2));
}
function Er(e) {
  const r = (Number(e) || 0) - Sr - Nr;
  return Math.max(160, Math.floor(r));
}
function Ar(e, t = Ye) {
  const r = $e(t);
  return Er((Number(e) || 0) * r);
}
function Ir(e, t) {
  if (!e || !Number.isFinite(t) || t <= 0 || Math.abs(t - 1) < 1e-3)
    return;
  const r = e.scrollLeft + e.clientWidth / 2, n = e.scrollTop + e.clientHeight / 2, a = Array.from(
    e.querySelectorAll("[data-reader-pane]")
  ).map((s) => ({
    pane: s,
    cx: s.scrollLeft + s.clientWidth / 2,
    hadOverflow: s.scrollWidth > s.clientWidth + 1
  })), o = () => {
    e.scrollLeft = Math.max(0, r * t - e.clientWidth / 2), e.scrollTop = Math.max(0, n * t - e.clientHeight / 2);
    for (const { pane: s, cx: c, hadOverflow: d } of a) {
      const i = Math.max(0, s.scrollWidth - s.clientWidth);
      if (i <= 0) {
        s.scrollLeft = 0;
        continue;
      }
      d ? s.scrollLeft = Math.min(
        i,
        Math.max(0, c * t - s.clientWidth / 2)
      ) : s.scrollLeft = i / 2;
    }
  };
  requestAnimationFrame(() => {
    requestAnimationFrame(o);
  });
}
const De = "data-reader-page", Dr = "data-reader-pane", kr = "reader-scroll-shell", Fr = "reader-react-scroll-shell", Xe = "reader-react-pdf-page-slot";
function ke(e, t) {
  const r = e != null ? `[${De}="${e}"]` : `[${De}]`;
  return t ? `${r}[${Dr}="${t}"]` : r;
}
function Or() {
  return `.${Xe}[${De}]`;
}
function St(e) {
  return Number(e.getAttribute(De));
}
const Ge = 48;
function Nt(e, t = Ge) {
  return e.getBoundingClientRect().top + t;
}
function Tt(e, t) {
  if (!e.length)
    return null;
  let r = null, n = -1 / 0;
  for (const d of e) {
    const i = d.getBoundingClientRect();
    i.height < 8 || i.width < 8 || i.top <= t + 1 && i.top >= n && (r = d, n = i.top);
  }
  if (!r && (r = e.find((i) => {
    const f = i.getBoundingClientRect();
    return f.height >= 8 && f.width >= 8;
  }) ?? e[0] ?? null, r)) {
    const i = [...e].reverse().find((f) => {
      const l = f.getBoundingClientRect();
      return l.height >= 8 && l.width >= 8;
    });
    i && i.getBoundingClientRect().bottom < t && (r = i);
  }
  if (!r)
    return null;
  const a = St(r);
  if (!Number.isFinite(a) || a < 1)
    return null;
  const o = r.getBoundingClientRect(), s = o.height > 0 ? o.height : 1, c = Math.min(1, Math.max(0, (t - o.top) / s));
  return { el: r, page: a, fraction: c };
}
function He(e, t, r = Ge) {
  if (!e)
    return null;
  const n = ke(void 0, t), a = Array.from(e.querySelectorAll(n));
  if (!a.length || e.getBoundingClientRect().height <= 0)
    return null;
  const s = Nt(e, r), c = Tt(a, s);
  return c ? { page: c.page, fraction: c.fraction } : null;
}
function Ve(e, t, r = "auto", n, a = Ge) {
  if (!e || !t)
    return !1;
  const o = Math.max(1, Math.floor(Number(t.page) || 1)), s = Math.min(1, Math.max(0, Number(t.fraction) || 0));
  let c = null;
  if (n && (c = e.querySelector(ke(o, n))), c || (c = e.querySelector(ke(o))), !c)
    return !1;
  const d = e.getBoundingClientRect(), i = c.getBoundingClientRect();
  if (d.height <= 0 || i.height < 8 && c.offsetHeight < 8)
    return !1;
  const f = i.height > 0 ? i.height : c.offsetHeight, l = e.scrollTop + (i.top - d.top), m = Math.max(0, l + s * f - a);
  return r === "auto" ? e.scrollTop = m : e.scrollTo({ top: m, behavior: r }), !0;
}
function xr(e, t, r = "smooth", n) {
  return Ve(
    e,
    { page: t, fraction: 0 },
    r,
    n
  );
}
function Pt(e, t, r) {
  const n = (r == null ? void 0 : r.behavior) ?? "auto", a = (r == null ? void 0 : r.delaysMs) ?? [0, 32, 120, 280];
  let o = !1, s = !1;
  const c = [], d = () => {
    var f;
    if (o) return;
    Ve(
      e(),
      t,
      n,
      r == null ? void 0 : r.pane
    ) && !s && (s = !0, (f = r == null ? void 0 : r.onDone) == null || f.call(r));
  };
  for (const i of a)
    i <= 0 ? requestAnimationFrame(() => {
      requestAnimationFrame(d);
    }) : c.push(setTimeout(d, i));
  return () => {
    o = !0;
    for (const i of c)
      clearTimeout(i);
  };
}
function $r(e, t, r) {
  return Pt(
    e,
    { page: t, fraction: 0 },
    r
  );
}
function Fe(e, t) {
  if (!Number.isFinite(e))
    return 1;
  const r = Math.max(1, Math.floor(e));
  return !Number.isFinite(t) || t <= 0 ? r : Math.min(t, r);
}
function le(e) {
  return {
    page: Math.max(1, Math.floor(Number(e.page) || 1)),
    fraction: Math.min(1, Math.max(0, Number(e.fraction) || 0))
  };
}
function _r(e) {
  if (!(e instanceof HTMLElement))
    return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function Lr(e, t) {
  return e === "1" ? "source" : t ? null : e === "2" ? "compare" : e === "3" ? "translated" : null;
}
function Cr(e) {
  const {
    mode: t,
    sourceOnly: r,
    setMode: n,
    userZoom: a,
    onZoomChange: o,
    currentPage: s,
    numPages: c,
    goToPage: d,
    enabled: i = !0
  } = e;
  U(() => {
    if (!i)
      return;
    const f = (l) => {
      if (l.defaultPrevented || l.metaKey || l.ctrlKey || l.altKey || _r(l.target))
        return;
      const m = l.key, p = m.length === 1 ? m.toLowerCase() : m, g = Lr(p, r);
      if (g) {
        l.preventDefault(), n(g);
        return;
      }
      if (m === "+" || m === "=") {
        l.preventDefault(), o(ve(a, 1));
        return;
      }
      if (m === "-" || m === "_") {
        l.preventDefault(), o(ve(a, -1));
        return;
      }
      if (p === "0") {
        l.preventDefault(), o(Ie());
        return;
      }
      if (!(c <= 0)) {
        if (p === "j" || m === "ArrowDown" || m === "PageDown") {
          l.preventDefault(), d(Fe(s + 1, c));
          return;
        }
        if (p === "k" || m === "ArrowUp" || m === "PageUp") {
          l.preventDefault(), d(Fe(s - 1, c));
          return;
        }
        if (m === "Home") {
          l.preventDefault(), d(1);
          return;
        }
        m === "End" && (l.preventDefault(), d(c));
      }
    };
    return window.addEventListener("keydown", f), () => window.removeEventListener("keydown", f);
  }, [
    i,
    t,
    r,
    n,
    a,
    o,
    s,
    c,
    d
  ]);
}
const Ur = 160, Br = 8, Wr = 960;
function Hr(e) {
  const t = k(null), [r, n] = N(null), [a, o] = N(Wr), s = k(e == null ? void 0 : e.onWidthChange);
  s.current = e == null ? void 0 : e.onWidthChange;
  const c = S((i) => {
    t.current = i, n(i);
  }, []);
  U(() => {
    const i = r;
    if (!i || typeof ResizeObserver > "u")
      return;
    const f = (m) => {
      !Number.isFinite(m) || m < Ur || o((p) => Math.abs(p - m) < Br ? p : m);
    }, l = new ResizeObserver((m) => {
      var p, g;
      f(((g = (p = m[0]) == null ? void 0 : p.contentRect) == null ? void 0 : g.width) ?? i.clientWidth);
    });
    return l.observe(i), f(i.clientWidth), () => l.disconnect();
  }, [r]), U(() => {
    var i;
    (i = s.current) == null || i.call(s, a);
  }, [a]);
  const d = Pr(a);
  return {
    shellRef: t,
    shellEl: r,
    shellWidth: a,
    compareColWidth: d,
    bindShell: c
  };
}
function zr(e) {
  const { mode: t, sourceOnly: r, assetsReady: n, hasSource: a, hasTranslated: o } = e, s = n && a, c = n && o && !r, d = t === "source" || t === "compare", i = !r && (t === "translated" || t === "compare");
  return {
    mountSource: s,
    mountTranslated: c,
    showSource: d,
    showTranslated: i,
    compareMode: t === "compare" && d && i && s && c,
    primaryPane: t === "translated" ? "translated" : "source"
  };
}
function jr(e, t) {
  const {
    mode: r,
    sourceOnly: n,
    assetsReady: a,
    sourceUrl: o,
    sourceFile: s,
    translatedFile: c
  } = e, [d, i] = N({ source: 0, translated: 0 }), [f, l] = N(0), m = zr({
    mode: r,
    sourceOnly: n,
    assetsReady: a,
    hasSource: !!s || !!o,
    hasTranslated: !!c
  }), { primaryPane: p } = m, g = S((w, u) => {
    i((b) => b[u] === w ? b : { ...b, [u]: w });
  }, []), y = k(null), T = S(() => {
    y.current && clearTimeout(y.current), y.current = setTimeout(() => {
      l((w) => w + 1);
    }, 60);
  }, []), F = q(
    () => Math.max(d.source, d.translated),
    [d]
  ), E = p === "translated" ? d.translated : d.source || d.translated, A = t == null ? void 0 : t.userZoom, _ = t == null ? void 0 : t.shellWidth, R = `${f}-${A}-${r}-${d.source}-${d.translated}-${_}`;
  return {
    ...m,
    numPagesByPane: d,
    hudNumPages: F,
    primaryNumPages: E,
    metricsTick: f,
    onNumPages: g,
    onMetrics: T,
    rowSyncRevision: R
  };
}
function qr(e, t) {
  const [r, n] = N(() => Ie()), a = k(r);
  a.current = r;
  const o = k(1), s = S((i) => {
    const f = $e(i), l = a.current;
    Math.abs(f - l) < 5e-4 || (o.current = f / (l || 1), n(f));
  }, []), c = S((i) => {
    s(ve(a.current, i));
  }, [s]), d = S((i) => {
    s(Ie());
  }, [s]);
  return dt(() => {
    const i = o.current;
    Math.abs(i - 1) < 1e-3 || (o.current = 1, Ir(t == null ? void 0 : t.current, i));
  }, [r, t]), { userZoom: r, onZoomChange: s, stepZoom: c, resetZoom: d };
}
function Kr(e) {
  const { mode: t, setMode: r, beginModeSwitch: n } = e, a = k(t), o = k(r), s = k(n);
  return a.current = t, o.current = r, s.current = n, { setModeKeepingPage: S((d) => {
    d !== a.current && (s.current(), o.current(d));
  }, []) };
}
function Et(e) {
  const t = `${e.jobId || ""}`.trim(), r = `${e.documentId || ""}`.trim();
  return t ? `retainpdf.reader.notes.v1:job:${t}` : r ? `retainpdf.reader.notes.v1:doc:${r}` : "retainpdf.reader.notes.v1:anonymous";
}
function Jr() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function At(e) {
  return [...e].sort((t, r) => t.page !== r.page ? t.page - r.page : `${t.createdAt}`.localeCompare(`${r.createdAt}`));
}
function It(e) {
  const t = [];
  for (const r of At(e)) {
    const n = t[t.length - 1];
    n && n.page === r.page ? n.items.push(r) : t.push({ page: r.page, items: [r] });
  }
  return t;
}
function Zr(e, t) {
  const r = e ? `# ${e} · 批注` : "# 批注", n = It(t);
  if (!n.length)
    return `${r}

（暂无批注）
`;
  const a = [r, ""];
  for (const o of n) {
    a.push(`## 第 ${o.page} 页`, "");
    for (const s of o.items) {
      for (const c of s.quote.split(`
`))
        a.push(`> ${c}`);
      s.note && a.push("", `笔记：${s.note}`), a.push("");
    }
  }
  return a.join(`
`);
}
function Yr(e) {
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
function at(e) {
  if (typeof localStorage > "u")
    return [];
  try {
    return Yr(localStorage.getItem(Et(e)));
  } catch {
    return [];
  }
}
function Xr(e, t) {
  if (!(typeof localStorage > "u"))
    try {
      localStorage.setItem(Et(e), JSON.stringify(t));
    } catch (r) {
      console.warn("[reader-notes] persist failed", r);
    }
}
function Gr(e, t = {}) {
  const r = q(
    () => ({
      jobId: `${e.jobId || ""}`.trim(),
      documentId: `${e.documentId || ""}`.trim()
    }),
    [e.jobId, e.documentId]
  ), [n, a] = N(() => at(r)), o = t.onAfterAdd;
  U(() => {
    a(at(r));
  }, [r.jobId, r.documentId]), U(() => {
    Xr(r, n);
  }, [r, n]);
  const s = S((l) => {
    const m = `${l.quote || ""}`.trim();
    if (!m)
      return null;
    const p = {
      id: Jr(),
      page: Math.max(1, Math.floor(Number(l.page) || 1)),
      pane: l.pane === "translated" ? "translated" : "source",
      quote: m,
      note: `${l.note || ""}`.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return a((g) => At([p, ...g])), o == null || o(), p;
  }, [o]), c = S((l, m) => {
    const p = `${m || ""}`.trim();
    a((g) => g.map((y) => y.id === l ? { ...y, note: p } : y));
  }, []), d = S((l) => {
    a((m) => m.filter((p) => p.id !== l));
  }, []), i = S(async (l = "") => {
    var p, g;
    const m = Zr(l, n);
    try {
      return await ((g = (p = navigator.clipboard) == null ? void 0 : p.writeText) == null ? void 0 : g.call(p, m)), !0;
    } catch (y) {
      return console.error("[reader-notes] copy failed", y), !1;
    }
  }, [n]), f = q(() => It(n), [n]);
  return {
    notes: n,
    groups: f,
    addFromQuote: s,
    updateNote: c,
    remove: d,
    exportMarkdown: i,
    count: n.length
  };
}
function Vr(e, t = !0) {
  const [r, n] = N(null), a = S(() => {
    var c, d;
    n(null);
    const s = (c = globalThis.getSelection) == null ? void 0 : c.call(globalThis);
    (d = s == null ? void 0 : s.removeAllRanges) == null || d.call(s);
  }, []), o = e.current ?? null;
  return U(() => {
    if (!t)
      return;
    const s = () => {
      var oe, ce;
      const y = e.current, T = (oe = globalThis.getSelection) == null ? void 0 : oe.call(globalThis);
      if (!y || !T || T.isCollapsed || !T.rangeCount) {
        n(null);
        return;
      }
      const F = T.getRangeAt(0);
      if (!y.contains(F.commonAncestorContainer)) {
        n(null);
        return;
      }
      const E = `${T.toString() || ""}`.replace(/\s+/g, " ").trim();
      if (E.length < 2) {
        n(null);
        return;
      }
      let A = F.commonAncestorContainer;
      A.nodeType === Node.TEXT_NODE && (A = A.parentElement);
      const _ = (ce = A == null ? void 0 : A.closest) == null ? void 0 : ce.call(
        A,
        "[data-reader-page]"
      );
      if (!_ || !y.contains(_)) {
        n(null);
        return;
      }
      const R = Math.max(1, Math.floor(Number(_.getAttribute("data-reader-page")) || 1)), u = _.getAttribute("data-reader-pane") === "translated" ? "translated" : "source", b = F.getClientRects(), v = b[b.length - 1] || F.getBoundingClientRect();
      if (!v || v.width === 0 && v.height === 0) {
        n(null);
        return;
      }
      const O = typeof window < "u" ? window.innerWidth : 800, B = typeof window < "u" ? window.innerHeight : 600, C = 16, J = Math.min(Math.max(C, v.left), O - C), V = Math.min(Math.max(C, v.top), B - C);
      n({
        quote: E,
        page: R,
        pane: u,
        rect: {
          left: J,
          top: V,
          width: v.width,
          height: v.height
        }
      });
    }, c = () => {
      window.setTimeout(s, 0);
    }, d = () => {
      c();
    }, i = () => c(), f = () => c(), l = () => {
      c();
    }, m = (y) => {
      y.key === "Escape" && a();
    }, p = () => {
      n((y) => y && null);
    };
    document.addEventListener("mouseup", d), document.addEventListener("pointerup", i), document.addEventListener("touchend", f), document.addEventListener("selectionchange", l), document.addEventListener("keyup", m);
    const g = o ?? e.current;
    return g == null || g.addEventListener("scroll", p, { passive: !0 }), window.addEventListener("scroll", p, { passive: !0, capture: !0 }), () => {
      document.removeEventListener("mouseup", d), document.removeEventListener("pointerup", i), document.removeEventListener("touchend", f), document.removeEventListener("selectionchange", l), document.removeEventListener("keyup", m), g == null || g.removeEventListener("scroll", p), window.removeEventListener("scroll", p, !0);
    };
  }, [t, o, a]), { selection: r, clearSelection: a };
}
function Qr() {
  const [e, t] = N(null), r = S((s) => {
    t(s);
  }, []), n = S((s = null) => {
    t((c) => !s || c === s ? null : c);
  }, []), a = S((s) => {
    t((c) => c === s ? null : s);
  }, []), o = S(
    (s) => e === s,
    [e]
  );
  return { active: e, open: r, close: n, toggle: a, isOpen: o };
}
function en(e, t, r = !0, n = "", a) {
  const [o, s] = N(1);
  return U(() => {
    if (!r || t <= 0) {
      s(1);
      return;
    }
    const c = e.current;
    if (!c)
      return;
    let d = !1, i = null, f = 0;
    const l = ke(void 0, a), m = () => {
      if (d) return;
      const y = Array.from(c.querySelectorAll(l));
      if (!y.length)
        return;
      const T = Nt(c), F = Tt(y, T);
      F && s(F.page);
    }, p = () => {
      d || (f && cancelAnimationFrame(f), f = requestAnimationFrame(() => {
        f = 0, m();
      }));
    }, g = () => {
      if (d) return;
      if (!Array.from(c.querySelectorAll(l)).length) {
        i = setTimeout(g, 120);
        return;
      }
      m(), c.addEventListener("scroll", p, { passive: !0 });
    };
    return g(), () => {
      d = !0, i && clearTimeout(i), f && cancelAnimationFrame(f), c.removeEventListener("scroll", p);
    };
  }, [e, t, r, n, a]), o;
}
function tn(e) {
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
function rn(e, t) {
  if (e.size !== t.size) return !1;
  for (const [r, n] of t)
    if (e.get(r) !== n) return !1;
  return !0;
}
function nn(e, t, r = "", n) {
  const [a, o] = N(() => /* @__PURE__ */ new Map()), s = k(n);
  return s.current = n, dt(() => {
    if (!t) {
      o((E) => E.size === 0 ? E : /* @__PURE__ */ new Map());
      return;
    }
    let c = !1, d = 0, i = !1, f = !1;
    const l = () => {
      var R;
      if (c) return;
      const E = e.current;
      if (!E) return;
      const A = /* @__PURE__ */ new Map();
      E.querySelectorAll(Or()).forEach((w) => {
        const u = St(w);
        if (!Number.isFinite(u) || u < 1) return;
        const b = tn(w);
        if (b <= 0) return;
        const v = A.get(u) || { height: 0, count: 0 };
        v.height = Math.max(v.height, b), v.count += 1, A.set(u, v);
      });
      const _ = /* @__PURE__ */ new Map();
      A.forEach((w, u) => {
        w.count >= 2 && w.height > 0 && _.set(u, Math.ceil(w.height));
      }), o((w) => rn(w, _) ? w : _), i && !f && (f = !0, (R = s.current) == null || R.call(s));
    }, m = () => {
      cancelAnimationFrame(d), d = requestAnimationFrame(() => {
        requestAnimationFrame(l);
      });
    };
    m();
    const p = window.setTimeout(m, 100), g = window.setTimeout(() => {
      i = !0, m();
    }, 300), y = window.setTimeout(m, 700), T = e.current;
    let F = null;
    return T && typeof ResizeObserver < "u" && (F = new ResizeObserver(() => m()), F.observe(T)), () => {
      c = !0, cancelAnimationFrame(d), window.clearTimeout(p), window.clearTimeout(g), window.clearTimeout(y), F == null || F.disconnect();
    };
  }, [e, t, r]), a;
}
const on = [0, 48, 140, 320, 560], an = 700, sn = [80, 200, 400], cn = 500, ln = 50;
function dn(e, t) {
  const { primaryPane: r, mode: n, enabled: a = !0 } = t, o = k({ page: 1, fraction: 0 }), s = k(null), c = k(!1), d = k(n), i = k(null), f = k(null), l = k(null), m = k(r);
  m.current = r;
  const p = S(() => {
    var R;
    (R = i.current) == null || R.call(i), i.current = null, f.current != null && (clearTimeout(f.current), f.current = null);
  }, []), g = S((R) => {
    o.current = le(R), s.current = null, l.current != null && clearTimeout(l.current), l.current = setTimeout(() => {
      l.current = null, c.current = !1;
    }, ln);
  }, []);
  U(() => {
    if (!a)
      return;
    let R = !1, w = null, u = null, b = null;
    const v = () => {
      if (R) return;
      const O = e.current;
      if (!O) {
        b = setTimeout(v, 50);
        return;
      }
      w = O, u = () => {
        if (c.current)
          return;
        const B = He(w, m.current);
        B && (o.current = B);
      }, w.addEventListener("scroll", u, { passive: !0 }), c.current || u();
    };
    return v(), () => {
      R = !0, b != null && clearTimeout(b), w && u && w.removeEventListener("scroll", u);
    };
  }, [a, n, r, e]), U(() => {
    if (d.current === n)
      return;
    if (d.current = n, !a) {
      c.current = !1, s.current = null, p();
      return;
    }
    const R = s.current ? le(s.current) : le(o.current);
    return c.current = !0, s.current = R, o.current = R, p(), i.current = Pt(
      () => e.current,
      R,
      {
        behavior: "auto",
        pane: r,
        // 等页宽/行高同步后再钉；同一 locked 幂等，不会越滚越远
        delaysMs: on,
        onDone: () => g(R)
      }
    ), f.current = setTimeout(() => {
      f.current = null, g(R);
    }, an), () => {
      p();
    };
  }, [n, a, r, e, g, p]), U(() => () => {
    p(), l.current != null && (clearTimeout(l.current), l.current = null);
  }, [p]);
  const y = S(() => {
    const R = He(
      e.current,
      m.current
    );
    return le(R || o.current);
  }, [e]), T = S(() => {
    c.current = !0;
    const R = He(
      e.current,
      m.current
    ), w = le(R ?? o.current);
    return o.current = w, s.current = w, w;
  }, [e]), F = S((R, w) => {
    const u = Fe(R, w || 1), b = { page: u, fraction: 0 };
    o.current = b, c.current = !0, s.current = b, p();
    const v = m.current;
    xr(e.current, u, "smooth", v), i.current = $r(
      () => e.current,
      u,
      {
        behavior: "auto",
        pane: v,
        delaysMs: sn,
        onDone: () => g(b)
      }
    ), f.current = setTimeout(() => {
      f.current = null, g(b);
    }, cn);
  }, [e, g, p]), E = S(() => le(o.current), []), A = S(() => c.current, []), _ = S(() => {
    if (!c.current || !s.current)
      return;
    const R = le(s.current);
    Ve(
      e.current,
      R,
      "auto",
      m.current
    );
  }, [e]);
  return {
    lockFromShell: y,
    beginModeSwitch: T,
    goToPage: F,
    getAnchor: E,
    isRestoring: A,
    repinIfRestoring: _
  };
}
function un(e, t) {
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
const fn = [0, 80, 200, 400, 800];
function mn(e) {
  const { enabled: t, numPages: r, goToPage: n, resolveBlockPage: a, onAnchorApplied: o } = e, s = k(""), c = k(n);
  c.current = n;
  const d = k(a);
  d.current = a;
  const i = k(o);
  i.current = o, U(() => {
    var g;
    if (!t || !Number.isFinite(r) || r < 1)
      return;
    const f = tr(), l = un(f, d.current), m = l == null ? `none:${(f == null ? void 0 : f.blockId) || ""}` : `p:${l}:b:${(f == null ? void 0 : f.blockId) || ""}`;
    if (s.current === m)
      return;
    if (l == null) {
      s.current = m;
      return;
    }
    s.current = m, f && ((g = i.current) == null || g.call(i, f, l));
    const p = [];
    for (const y of fn)
      p.push(
        setTimeout(() => {
          c.current(l);
        }, y)
      );
    return () => {
      for (const y of p) clearTimeout(y);
    };
  }, [t, r]);
}
function hn() {
  const e = Rr(), t = Qr(), { shellRef: r, shellEl: n, shellWidth: a, compareColWidth: o, bindShell: s } = Hr(), { userZoom: c, onZoomChange: d } = qr(e.mode, r), i = jr(
    {
      mode: e.mode,
      sourceOnly: e.sourceOnly,
      assetsReady: e.assetsReady,
      sourceUrl: e.sourceUrl,
      translatedUrl: e.translatedUrl,
      sourceFile: e.sourceFile,
      translatedFile: e.translatedFile
    },
    { userZoom: c, shellWidth: a }
  ), {
    beginModeSwitch: f,
    goToPage: l,
    repinIfRestoring: m
  } = dn(r, {
    primaryPane: i.primaryPane,
    mode: e.mode,
    enabled: !e.boot.loading
  });
  U(() => {
    m();
  }, [a, m]);
  const p = nn(
    r,
    i.compareMode,
    i.rowSyncRevision,
    m
  ), g = en(
    r,
    i.primaryNumPages,
    !e.boot.loading,
    `${e.mode}-${c}-${i.metricsTick}`,
    i.primaryPane
  ), y = S((x) => {
    var ee, W;
    const Q = Math.max(
      Number(i.hudNumPages) || 0,
      Number(i.primaryNumPages) || 0,
      Number((ee = i.numPagesByPane) == null ? void 0 : ee.source) || 0,
      Number((W = i.numPagesByPane) == null ? void 0 : W.translated) || 0
    );
    l(x, Q);
  }, [l, i.hudNumPages, i.primaryNumPages, i.numPagesByPane]), [T, F] = N(null), E = k(null), A = S((x) => {
    E.current && clearTimeout(E.current), F(x), x && (E.current = setTimeout(() => F(null), 6e3));
  }, []);
  U(() => () => {
    E.current && clearTimeout(E.current);
  }, []);
  const _ = S((x) => {
    const Q = Be(e.regions, x);
    return Q ? Je(Q, i.primaryPane).page : null;
  }, [e.regions, i.primaryPane]), R = S((x) => {
    const Q = typeof x == "object" && x ? `${x.block_id || ""}`.trim() : "", ee = Be(e.regions, Q);
    let W = ee ? Je(ee, i.primaryPane).page : null;
    if (W == null) {
      const se = typeof x == "number" ? x : (x == null ? void 0 : x.page_idx) ?? (x == null ? void 0 : x.page);
      if (se != null && `${se}`.trim() !== "") {
        const Y = Number(se);
        Number.isFinite(Y) && Y >= 0 && (W = Math.floor(Y) + 1);
      }
    }
    W == null || W < 1 || (A(ee), y(W));
  }, [A, y, i.primaryPane, e.regions]);
  mn({
    enabled: !e.boot.loading && !e.boot.failed && e.assetsReady,
    numPages: i.hudNumPages || 0,
    goToPage: y,
    resolveBlockPage: _,
    onAnchorApplied: (x) => {
      A(Be(e.regions, x.blockId));
    }
  });
  const { setModeKeepingPage: w } = Kr({
    mode: e.mode,
    setMode: e.setMode,
    beginModeSwitch: f
  }), u = S(() => {
    t.open("notes");
  }, [t]), b = Gr(
    {
      jobId: e.jobId,
      documentId: e.documentId
    },
    { onAfterAdd: u }
  ), { selection: v, clearSelection: O } = Vr(
    r,
    !e.boot.loading && !e.boot.failed
  ), B = S((x) => {
    b.addFromQuote({
      page: x.page,
      pane: x.pane,
      quote: x.quote
    }), O();
  }, [b, O]), C = S((x) => {
    (x.pane === "translated" && e.mode === "source" || x.pane === "source" && e.mode === "translated") && (f(), e.setMode("compare")), y(x.page);
  }, [e, f, y]), J = !e.boot.loading && !e.boot.failed;
  Cr({
    mode: e.mode,
    sourceOnly: e.sourceOnly,
    setMode: w,
    userZoom: c,
    onZoomChange: d,
    currentPage: g,
    numPages: i.hudNumPages,
    goToPage: y,
    enabled: J
  });
  const V = q(() => t, [t.active, t.open, t.close, t.toggle, t.isOpen]), oe = q(() => ({ bindShell: s, shellEl: n, shellWidth: a, compareColWidth: o, shellRef: r }), [s, n, a, o, r]), ce = q(() => ({
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    sourceFile: e.sourceFile,
    translatedFile: e.translatedFile
  }), [e.sourceUrl, e.translatedUrl, e.sourceFile, e.translatedFile]), ae = q(() => ({
    session: e,
    boot: e.boot,
    sourceOnly: e.sourceOnly,
    mode: e.mode,
    userZoom: c,
    onZoomChange: d,
    shell: oe,
    panes: i,
    sessionFiles: ce,
    rowHeights: p,
    goToPage: y,
    activeRegion: T,
    jumpToAnchor: R,
    setModeKeepingPage: w,
    download: e.download,
    showHud: J,
    tools: V,
    notes: b,
    selection: v,
    clearSelection: O,
    addNoteFromSelection: B,
    jumpToNote: C,
    documentTitle: e.title || ""
  }), [e, oe, i, ce, p, y, T, R, w, J, V, b, v, O, B, C, c, d]);
  return q(() => ({
    ...ae,
    currentPage: g
  }), [ae, g]);
}
const pn = "retainpdf.home.return.v1", gn = 7200 * 1e3;
function bn(e) {
  if (!e) return null;
  try {
    const t = JSON.parse(e);
    return !t || typeof t != "object" || typeof t.ts == "number" && Date.now() - t.ts > gn ? null : {
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
function yn() {
  if (typeof sessionStorage > "u") return null;
  try {
    return bn(sessionStorage.getItem(pn));
  } catch {
    return null;
  }
}
const wn = "retainpdf:soft-reader-close";
function vn() {
  return new URL("./index.html", window.location.href).href;
}
function Rn() {
  if (typeof window > "u" || window.self === window.top) return !1;
  try {
    return window.parent.postMessage(
      { type: wn },
      window.location.origin
    ), !0;
  } catch {
    return !1;
  }
}
function Mn() {
  if (typeof window > "u" || Rn())
    return;
  const e = yn();
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
  window.location.assign(vn());
}
function Sn({ onBeforeClose: e } = {}) {
  return /* @__PURE__ */ P(
    "button",
    {
      id: "reader-close-home-btn",
      type: "button",
      className: "reader-close-home-btn",
      "aria-label": "返回主页",
      title: "返回主页",
      onClick: () => {
        e == null || e(), Mn();
      },
      children: [
        /* @__PURE__ */ h(Ae, { className: "reader-close-home-icon", size: 18, strokeWidth: 2.25, "aria-hidden": !0 }),
        /* @__PURE__ */ h("span", { className: "reader-close-home-label", children: "关闭" })
      ]
    }
  );
}
let st = !1;
function Nn() {
  st || (Zt.GlobalWorkerOptions.workerSrc = qe("build/pdf.worker.mjs"), st = !0);
}
const Dt = 1.414, Tn = "120% 0px", Oe = /* @__PURE__ */ new Map();
function Pn(e, t, r) {
  let n = Oe.get(e);
  if (!n) {
    const a = /* @__PURE__ */ new Map();
    n = { observer: new IntersectionObserver(
      (s) => {
        for (const c of s) {
          const d = a.get(c.target);
          d && d(c.isIntersecting);
        }
      },
      { root: e, rootMargin: Tn, threshold: 0 }
    ), elements: a }, Oe.set(e, n);
  }
  return n.elements.set(r, t), n.observer.observe(r), n;
}
function En(e, t) {
  const r = Oe.get(e);
  r && (r.observer.unobserve(t), r.elements.delete(t), r.elements.size === 0 && (r.observer.disconnect(), Oe.delete(e)));
}
function An({
  pageNumber: e,
  width: t,
  devicePixelRatio: r,
  scrollRoot: n,
  pane: a,
  syncedMinHeight: o = 0,
  onMetrics: s,
  cachedAspect: c,
  onAspectChange: d,
  sentinelRef: i,
  regionHighlight: f = null
}) {
  const l = k(null), [m, p] = N(!1), [g, y] = N(c ?? Dt);
  U(() => {
    c != null && Math.abs(c - g) >= 1e-3 && y(c);
  }, [c]);
  const T = k(i);
  T.current = i;
  const F = k((w) => {
    var u;
    l.current = w, (u = T.current) == null || u.call(T, w);
  }).current;
  U(() => {
    const w = l.current;
    if (!w) return;
    if (typeof IntersectionObserver > "u") {
      p(!0);
      return;
    }
    let u = null;
    return Pn(n, (v) => {
      v ? (u && (clearTimeout(u), u = null), p(!0)) : (u && clearTimeout(u), u = setTimeout(() => {
        p(!1);
      }, 120));
    }, w), () => {
      u && clearTimeout(u), En(n, w);
    };
  }, [n, e]);
  const E = Math.max(120, Math.floor(t * g)), A = Math.max(E, Math.ceil(o || 0)), _ = yr(f, t, E), R = (w) => {
    y((u) => {
      if (Math.abs(u - w) < 1e-3) return u;
      const b = () => d == null ? void 0 : d(e, w);
      return typeof queueMicrotask < "u" ? queueMicrotask(b) : setTimeout(b, 0), w;
    });
  };
  return /* @__PURE__ */ P(
    "div",
    {
      ref: F,
      "data-reader-page": e,
      "data-reader-pane": a,
      "data-natural-height": E,
      className: Xe,
      style: {
        width: t,
        height: A,
        minHeight: A
      },
      children: [
        m ? /* @__PURE__ */ h(
          Yt,
          {
            pageNumber: e,
            width: t,
            devicePixelRatio: r,
            renderTextLayer: !0,
            renderAnnotationLayer: !1,
            className: "reader-react-pdf-page",
            loading: /* @__PURE__ */ h(
              "div",
              {
                className: "reader-react-pdf-page-placeholder",
                style: { width: t, height: E }
              }
            ),
            onLoadSuccess: (w) => {
              try {
                const u = w.getViewport({ scale: 1 });
                if (u.width > 0) {
                  const b = u.height / u.width;
                  R(b);
                }
              } catch {
              }
              s == null || s();
            },
            onRenderSuccess: () => {
              s == null || s();
            }
          }
        ) : /* @__PURE__ */ h(
          "div",
          {
            className: "reader-react-pdf-page-placeholder",
            style: { width: t, height: E },
            "aria-hidden": !0
          }
        ),
        _ ? /* @__PURE__ */ h(
          "div",
          {
            className: "reader-react-pdf-region-highlight",
            "data-reader-region-id": f == null ? void 0 : f.itemId,
            style: _,
            "aria-hidden": "true"
          }
        ) : null
      ]
    }
  );
}
const In = ut(An), ze = 5;
Nn();
function Dn() {
  const e = typeof window < "u" && window.devicePixelRatio || 1;
  return Math.max(1, Math.min(e, 2));
}
const kn = Ft(
  function({
    pane: t,
    url: r = "",
    preloadedFile: n = null,
    userZoom: a = 1,
    visible: o = !0,
    emptyLabel: s = "暂无 PDF",
    scrollRoot: c = null,
    pageWidthOverride: d = null,
    rowHeights: i,
    onMetrics: f,
    onLoadSuccess: l,
    onLoadError: m,
    onNumPagesChange: p,
    activeRegion: g = null,
    readerMetadata: y = null
  }, T) {
    const { file: F, loading: E, error: A } = hr(r, n), _ = q(
      () => ur(F),
      [F, r]
    ), [R, w] = N(0), [u, b] = N(""), [v, O] = N(null), [B, C] = N(480), J = k(null), V = k(0), oe = q(() => Dn(), []), ce = q(() => ({
      cMapUrl: qe("cmaps/"),
      cMapPacked: !0,
      standardFontDataUrl: qe("standard_fonts/")
    }), []);
    Ot(T, () => v, [v]), U(() => {
      const M = (I) => {
        !Number.isFinite(I) || I < 80 || Math.abs(I - V.current) < 8 || (V.current = I, C(I));
      }, L = d && d >= 80 ? d : (c == null ? void 0 : c.clientWidth) || 0;
      if (M(L), !c || typeof ResizeObserver > "u" || d && d >= 80) return;
      const $ = new ResizeObserver((I) => {
        var G, ie;
        const H = ((ie = (G = I[0]) == null ? void 0 : G.contentRect) == null ? void 0 : ie.width) ?? c.clientWidth;
        !Number.isFinite(H) || H < 80 || (J.current && clearTimeout(J.current), J.current = setTimeout(() => M(H), 80));
      });
      return $.observe(c), () => {
        $.disconnect(), J.current && clearTimeout(J.current);
      };
    }, [d, c, o]);
    const ae = q(
      () => Ar(B, a),
      [B, a]
    ), [x, Q] = N(() => /* @__PURE__ */ new Map()), [ee, W] = N(() => /* @__PURE__ */ new Set()), se = k(/* @__PURE__ */ new Map()), Y = k(null), _e = S((M, L) => {
      Q(($) => {
        if ($.get(M) === L) return $;
        const I = new Map($);
        return I.set(M, L), I;
      });
    }, []), Me = S((M, L) => {
      const $ = se.current, I = $.get(M);
      if (I && Y.current)
        try {
          Y.current.unobserve(I);
        } catch {
        }
      if (L) {
        if ($.set(M, L), Y.current)
          try {
            Y.current.observe(L);
          } catch {
          }
      } else
        $.delete(M);
    }, []);
    U(() => {
      if (!c || typeof IntersectionObserver > "u") return;
      const M = new IntersectionObserver(
        (L) => {
          W(($) => {
            const I = new Set($);
            let H = !1;
            for (const G of L) {
              const ie = G.target, pe = Number(ie.getAttribute("data-reader-page"));
              Number.isFinite(pe) && (G.isIntersecting ? I.has(pe) || (I.add(pe), H = !0) : I.has(pe) && (I.delete(pe), H = !0));
            }
            return H ? I : $;
          });
        },
        { root: c, rootMargin: "0px", threshold: 0 }
      );
      Y.current = M;
      for (const L of se.current.values())
        try {
          M.observe(L);
        } catch {
        }
      return () => {
        M.disconnect(), Y.current === M && (Y.current = null);
      };
    }, [c]), U(() => {
      W(/* @__PURE__ */ new Set()), Q(/* @__PURE__ */ new Map()), se.current.clear();
    }, [r]);
    const D = S(
      ({ numPages: M }) => {
        w(M), b(""), p == null || p(M, t), l == null || l({ numPages: M, pane: t });
      },
      [l, p, t]
    ), Z = S(
      (M) => {
        const L = (M == null ? void 0 : M.message) || "PDF 解析失败";
        b(L), w(0), p == null || p(0, t), m == null || m(M, t);
      },
      [m, p, t]
    ), j = q(
      () => R > 0 ? Array.from({ length: R }, (M, L) => L + 1) : [],
      [R]
    ), te = q(
      () => br(g, y, t),
      [g, y, t]
    ), he = q(() => {
      if (R === 0) return /* @__PURE__ */ new Set();
      if (!(!!c && typeof IntersectionObserver < "u" && o)) return new Set(j);
      if (ee.size === 0) {
        const $ = Math.min(R, ze * 2 + 1);
        return new Set(Array.from({ length: $ }, (I, H) => H + 1));
      }
      const L = /* @__PURE__ */ new Set();
      for (const $ of ee)
        for (let I = -ze; I <= ze; I++) {
          const H = $ + I;
          H >= 1 && H <= R && L.add(H);
        }
      return L;
    }, [R, j, c, o, ee]);
    return /* @__PURE__ */ P(
      "section",
      {
        ref: O,
        className: `reader-panel reader-react-pdf-pane${o ? "" : " is-hidden"}`,
        "data-reader-pane": t,
        "data-reader-engine": "react-pdf",
        "data-reader-visible": o ? "true" : "false",
        "aria-hidden": o ? void 0 : !0,
        "aria-label": t === "source" ? "原文 PDF" : "译文 PDF",
        children: [
          (!r || !!A || !!u) && !E ? /* @__PURE__ */ h("div", { className: "reader-empty reader-react-pdf-empty", "data-reader-pdf-empty": t, children: r && (A || u) || s }) : null,
          E ? /* @__PURE__ */ h("div", { className: "reader-empty reader-react-pdf-loading", "data-reader-pdf-loading": t, children: "正在加载 PDF…" }) : null,
          _ && !A ? /* @__PURE__ */ h("div", { className: "reader-viewer-wrap reader-react-pdf-wrap", children: /* @__PURE__ */ h(
            Xt,
            {
              file: _,
              loading: null,
              error: null,
              options: ce,
              onLoadSuccess: D,
              onLoadError: Z,
              className: "reader-react-pdf-document",
              children: j.map((M) => {
                if (he.has(M))
                  return /* @__PURE__ */ h(
                    In,
                    {
                      pane: t,
                      pageNumber: M,
                      width: ae,
                      devicePixelRatio: oe,
                      scrollRoot: c,
                      syncedMinHeight: (i == null ? void 0 : i.get(M)) || 0,
                      onMetrics: f,
                      cachedAspect: x.get(M),
                      onAspectChange: _e,
                      sentinelRef: (G) => Me(M, G),
                      regionHighlight: (te == null ? void 0 : te.box.page) === M ? te : null
                    },
                    `${t}-${M}`
                  );
                const $ = x.get(M) ?? Dt, I = Math.max(120, Math.floor(ae * $)), H = Math.max(I, Math.ceil((i == null ? void 0 : i.get(M)) || 0));
                return /* @__PURE__ */ h(
                  "div",
                  {
                    ref: (G) => Me(M, G),
                    "data-reader-page": M,
                    "data-reader-pane": t,
                    "data-natural-height": I,
                    className: Xe,
                    style: {
                      width: ae,
                      height: H,
                      minHeight: H
                    },
                    children: /* @__PURE__ */ h(
                      "div",
                      {
                        className: "reader-react-pdf-page-placeholder",
                        style: { width: ae, height: I },
                        "aria-hidden": !0
                      }
                    )
                  },
                  `${t}-${M}`
                );
              })
            },
            r
          ) }) : null
        ]
      }
    );
  }
), ct = ut(kn);
function Fn({
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
function On(e, t) {
  return t ? e * 2 : e;
}
function xn(e) {
  const {
    mode: t,
    bindShell: r,
    shellEl: n,
    userZoom: a,
    compareMode: o,
    shellWidth: s,
    rowHeights: c,
    mountSource: d,
    mountTranslated: i,
    showSource: f,
    showTranslated: l,
    sourceOnly: m,
    sourceUrl: p,
    translatedUrl: g,
    sourceFile: y,
    translatedFile: T,
    onMetrics: F,
    onNumPagesChange: E,
    activeRegion: A,
    readerMetadata: _,
    markdownSplit: R = !1,
    assistantSplit: w = !1
  } = e, u = Fn({
    mode: t,
    compareMode: o,
    showSource: f,
    showTranslated: l,
    markdownSplit: R
  }), b = On(
    s,
    R || w
  );
  return /* @__PURE__ */ h(
    "div",
    {
      ref: r,
      id: kr,
      className: Fr,
      "data-reader-scroll-shell": "true",
      children: /* @__PURE__ */ P(
        "main",
        {
          className: `reader-react-grid reader-mode-${u.mode}`,
          "data-reader-mode": R ? "markdown-split" : w ? "assistant-split" : t,
          children: [
            d ? /* @__PURE__ */ h(
              ct,
              {
                pane: "source",
                url: p,
                preloadedFile: y,
                userZoom: a,
                visible: u.showSource,
                scrollRoot: n,
                pageWidthOverride: b,
                rowHeights: u.compareMode ? c : void 0,
                onMetrics: F,
                emptyLabel: m ? "源文件不可用：该文档没有可读取的源 PDF。" : "暂无原文 PDF",
                onNumPagesChange: E,
                activeRegion: A,
                readerMetadata: _
              }
            ) : null,
            i ? /* @__PURE__ */ h(
              ct,
              {
                pane: "translated",
                url: g,
                preloadedFile: T,
                userZoom: a,
                visible: u.showTranslated,
                scrollRoot: n,
                pageWidthOverride: b,
                rowHeights: u.compareMode ? c : void 0,
                onMetrics: F,
                emptyLabel: "暂无译文 PDF",
                onNumPagesChange: E,
                activeRegion: A,
                readerMetadata: _
              }
            ) : null
          ]
        }
      )
    }
  );
}
const $n = [
  { id: "source", label: "源文件", Icon: mt },
  { id: "compare", label: "对照", Icon: ht },
  { id: "translated", label: "翻译文件", Icon: pt }
];
function _n({
  mode: e,
  sourceOnly: t,
  onModeChange: r
}) {
  return /* @__PURE__ */ h(
    "header",
    {
      className: `reader-topbar reader-react-topbar${t ? " is-source-only" : ""}`,
      children: /* @__PURE__ */ h("div", { className: "reader-tabs", role: "tablist", "aria-label": "阅读模式", children: $n.map((n) => {
        if (t && n.id !== "source")
          return null;
        const a = e === n.id, { Icon: o } = n;
        return /* @__PURE__ */ P(
          "button",
          {
            type: "button",
            className: `reader-tab reader-tab-mode${a ? " is-active" : ""}`,
            role: "tab",
            "aria-selected": a,
            "aria-label": n.label,
            title: n.label,
            "data-reader-mode": n.id,
            onClick: () => r(n.id),
            children: [
              /* @__PURE__ */ h(o, { className: "reader-tab-lucide", size: 16, strokeWidth: 2.25, "aria-hidden": !0 }),
              /* @__PURE__ */ h("span", { className: "reader-tab-label", children: n.label })
            ]
          },
          n.id
        );
      }) })
    }
  );
}
function Ln({
  loading: e,
  failed: t,
  text: r,
  percent: n
}) {
  return !e && !t ? null : /* @__PURE__ */ P(lt, { children: [
    e ? /* @__PURE__ */ h("div", { className: "reader-boot-loading", "data-reader-boot-loading": "true", children: /* @__PURE__ */ P("div", { className: "reader-boot-loading-card", children: [
      /* @__PURE__ */ h("div", { className: "reader-boot-loading-text", children: r }),
      /* @__PURE__ */ h("div", { className: "reader-boot-loading-track", children: /* @__PURE__ */ h(
        "span",
        {
          className: "reader-boot-loading-bar",
          style: { width: `${Math.max(0, Math.min(100, n))}%` }
        }
      ) })
    ] }) }) : null,
    t ? /* @__PURE__ */ h("div", { className: "reader-react-error", role: "alert", children: r }) : null
  ] });
}
function Cn(e, t = 42) {
  const r = `${e || ""}`.replace(/\s+/g, " ").trim();
  return r.length <= t ? r : `${r.slice(0, t).trim()}…`;
}
function Un({
  selection: e,
  onAddNote: t,
  onDismiss: r
}) {
  if (!e)
    return null;
  const n = typeof window < "u" ? window.innerWidth : 800, a = typeof window < "u" ? window.innerHeight : 600, o = e.rect.left + e.rect.width / 2, s = 130, c = Math.min(Math.max(16 + s, o), n - 16 - s), d = e.rect.top > 72, i = d ? Math.max(12, e.rect.top - 8) : Math.min(a - 12, e.rect.top + e.rect.height + 8), f = d ? "above" : "below", l = e.pane === "translated" ? "译文" : "原文", m = Cn(e.quote);
  return /* @__PURE__ */ P(
    "div",
    {
      className: `reader-sel-pop reader-sel-pop--${f}`,
      style: { left: c, top: i },
      role: "toolbar",
      "aria-label": "选区操作",
      children: [
        /* @__PURE__ */ P("div", { className: "reader-sel-pop-card reader-floating-surface", children: [
          /* @__PURE__ */ P("div", { className: "reader-sel-pop-quote", title: e.quote, children: [
            /* @__PURE__ */ h("span", { className: "reader-sel-pop-mark", "aria-hidden": "true", children: "“" }),
            /* @__PURE__ */ h("span", { className: "reader-sel-pop-quote-text", children: m })
          ] }),
          /* @__PURE__ */ P("div", { className: "reader-sel-pop-meta", children: [
            /* @__PURE__ */ P("span", { className: "reader-sel-pop-chip", children: [
              "第 ",
              e.page,
              " 页"
            ] }),
            /* @__PURE__ */ h("span", { className: `reader-sel-pop-chip reader-sel-pop-chip--${e.pane}`, children: l })
          ] }),
          /* @__PURE__ */ P("div", { className: "reader-sel-pop-actions", children: [
            /* @__PURE__ */ P(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--primary",
                onClick: () => t(e),
                children: [
                  /* @__PURE__ */ h(gt, { size: 15, strokeWidth: 2.25, "aria-hidden": !0 }),
                  /* @__PURE__ */ h("span", { children: "添加批注" })
                ]
              }
            ),
            /* @__PURE__ */ h(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--ghost",
                onClick: r,
                "aria-label": "取消选区",
                title: "取消",
                children: /* @__PURE__ */ h(Ae, { size: 15, strokeWidth: 2.5, "aria-hidden": !0 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ h("span", { className: "reader-sel-pop-caret", "aria-hidden": "true" })
      ]
    }
  );
}
const Bn = [
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
      { keys: "1", desc: "源文件" },
      { keys: "2", desc: "对照" },
      { keys: "3", desc: "翻译文件" }
    ]
  }
];
function Wn(e) {
  if (!(e instanceof HTMLElement)) return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function Hn() {
  const [e, t] = N(!1), r = ft(), n = k(null);
  return U(() => {
    if (!e) return;
    const a = (s) => {
      const c = n.current;
      c && s.target instanceof Node && !c.contains(s.target) && t(!1);
    }, o = (s) => {
      s.key === "Escape" && (s.preventDefault(), t(!1));
    };
    return document.addEventListener("mousedown", a), window.addEventListener("keydown", o), () => {
      document.removeEventListener("mousedown", a), window.removeEventListener("keydown", o);
    };
  }, [e]), U(() => {
    const a = (o) => {
      if (o.defaultPrevented || o.metaKey || o.ctrlKey || o.altKey || Wn(o.target)) return;
      const s = o.key;
      if (s === "?" || s === "h" || s === "H" || s === "/") {
        if (s === "/" && !o.shiftKey)
          return;
        o.preventDefault(), t((c) => !c);
      }
    };
    return window.addEventListener("keydown", a), () => window.removeEventListener("keydown", a);
  }, []), /* @__PURE__ */ P("div", { className: "reader-react-shortcuts", ref: n, "data-reader-shortcuts": "", children: [
    /* @__PURE__ */ h(
      "button",
      {
        type: "button",
        className: `reader-react-hud-btn reader-react-shortcuts-btn${e ? " is-active" : ""}`,
        "aria-label": "快捷键说明",
        "aria-expanded": e,
        "aria-controls": r,
        title: "快捷键（H 或 ?）",
        onClick: () => t((a) => !a),
        children: /* @__PURE__ */ h(zt, { className: "reader-react-shortcuts-icon", size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
      }
    ),
    e ? /* @__PURE__ */ P(
      "div",
      {
        id: r,
        className: "reader-react-shortcuts-panel reader-floating-surface",
        role: "dialog",
        "aria-label": "阅读器快捷键",
        children: [
          /* @__PURE__ */ P("div", { className: "reader-react-shortcuts-head", children: [
            /* @__PURE__ */ h("strong", { children: "快捷键" }),
            /* @__PURE__ */ h(
              "button",
              {
                type: "button",
                className: "reader-react-shortcuts-close reader-floating-close",
                "aria-label": "关闭",
                onClick: () => t(!1),
                children: "×"
              }
            )
          ] }),
          /* @__PURE__ */ h("div", { className: "reader-react-shortcuts-body", children: Bn.map((a) => /* @__PURE__ */ P("section", { className: "reader-react-shortcuts-group", children: [
            /* @__PURE__ */ h("h3", { children: a.title }),
            /* @__PURE__ */ h("ul", { children: a.items.map((o) => /* @__PURE__ */ P("li", { children: [
              /* @__PURE__ */ h("kbd", { children: o.keys }),
              /* @__PURE__ */ h("span", { children: o.desc })
            ] }, `${a.title}-${o.keys}`)) })
          ] }, a.title)) }),
          /* @__PURE__ */ h("p", { className: "reader-react-shortcuts-foot", children: "在输入框内不会触发快捷键" })
        ]
      }
    ) : null
  ] });
}
const zn = Object.freeze([
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
]), jn = {
  notes: gt,
  favorites: Kt,
  markdown: qt,
  ai: jt
}, kt = "retainpdf.reader.fab.pos.v1", xe = 52, ge = 12, qn = 6, Kn = ["source", "sideBySide", "translated"], Jn = {
  source: mt,
  sideBySide: ht,
  translated: pt
}, Zn = {
  source: "原文",
  sideBySide: "对照",
  translated: "译文"
};
function we(e, t) {
  const r = Math.max(ge, window.innerWidth - xe - ge), n = Math.max(ge, window.innerHeight - xe - ge);
  return {
    x: Math.min(r, Math.max(ge, e)),
    y: Math.min(n, Math.max(ge, t))
  };
}
function it() {
  return typeof window > "u" ? { x: 24, y: 120 } : we(
    window.innerWidth - xe - 20,
    window.innerHeight - xe - 88
  );
}
function Yn() {
  try {
    const e = localStorage.getItem(kt);
    if (!e) return it();
    const t = JSON.parse(e);
    if (typeof t.x == "number" && typeof t.y == "number")
      return we(t.x, t.y);
  } catch {
  }
  return it();
}
function Xn(e) {
  try {
    localStorage.setItem(kt, JSON.stringify(e));
  } catch {
  }
}
function Gn(e) {
  if (e.sourceOnly || !e.jobId) {
    const t = ye(e.sourceUrl), r = ye(e.translatedUrl);
    return {
      source: t,
      translated: r,
      // sideBySide requires dedicated artifact; no fallback to source url
      sideBySide: ""
    };
  }
  return ir({
    jobId: e.jobId,
    jobPayload: e.jobPayload,
    manifestPayload: e.manifestPayload
  });
}
function Vn({
  activeTool: e,
  notesCount: t,
  sourceOnly: r,
  onToggleTool: n,
  download: a
}) {
  const [o, s] = N(() => Yn()), [c, d] = N(!1), [i, f] = N(() => /* @__PURE__ */ new Set()), l = k(null), m = k(null), p = ft(), g = q(() => Gn(a), [a]);
  U(() => {
    const u = () => s((b) => we(b.x, b.y));
    return window.addEventListener("resize", u), () => window.removeEventListener("resize", u);
  }, []), U(() => {
    if (!c) return;
    const u = (v) => {
      const O = l.current;
      O && v.target instanceof Node && !O.contains(v.target) && d(!1);
    }, b = (v) => {
      v.key === "Escape" && (v.preventDefault(), d(!1));
    };
    return document.addEventListener("mousedown", u), window.addEventListener("keydown", b), () => {
      document.removeEventListener("mousedown", u), window.removeEventListener("keydown", b);
    };
  }, [c]);
  const y = S((u) => {
    n(u), d(!1);
  }, [n]), T = S(
    async (u) => {
      const b = ye(g[u]);
      if (!(!b || i.has(u)))
        try {
          const v = a.jobId ? cr(u, {
            jobId: a.jobId,
            jobPayload: a.jobPayload,
            manifestPayload: a.manifestPayload
          }) : `${a.sourceOnly ? "document" : "reader"}-${u}.pdf`;
          await lr(
            a.fetchProtected,
            b,
            v,
            v,
            null,
            (O) => f((B) => {
              const C = new Set(B);
              return O ? C.add(u) : C.delete(u), C;
            })
          );
        } catch (v) {
          const O = v instanceof Error ? v.message : "下载失败";
          dr(O), f((B) => {
            const C = new Set(B);
            return C.delete(u), C;
          });
        }
    },
    [g, i, a]
  ), F = (u) => {
    u.button === 0 && (u.currentTarget.setPointerCapture(u.pointerId), m.current = {
      pointerId: u.pointerId,
      startX: u.clientX,
      startY: u.clientY,
      originX: o.x,
      originY: o.y,
      moved: !1
    });
  }, E = (u) => {
    const b = m.current;
    if (!b || b.pointerId !== u.pointerId) return;
    const v = u.clientX - b.startX, O = u.clientY - b.startY;
    !b.moved && Math.hypot(v, O) < qn || (b.moved = !0, c && d(!1), s(we(b.originX + v, b.originY + O)));
  }, A = (u) => {
    const b = m.current;
    if (!(!b || b.pointerId !== u.pointerId)) {
      m.current = null;
      try {
        u.currentTarget.releasePointerCapture(u.pointerId);
      } catch {
      }
      if (b.moved) {
        s((v) => {
          const O = we(v.x, v.y);
          return Xn(O), O;
        });
        return;
      }
      d((v) => !v);
    }
  }, _ = t > 0 ? t > 99 ? "99+" : String(t) : null, R = typeof window < "u" && o.y > window.innerHeight * 0.55, w = Kn.filter((u) => !(a.sourceOnly && u !== "source"));
  return /* @__PURE__ */ P(
    "div",
    {
      ref: l,
      className: `reader-fab${c ? " is-open" : ""}${R ? " is-open-up" : ""}`,
      style: { left: o.x, top: o.y },
      "data-reader-fab": "",
      children: [
        c ? /* @__PURE__ */ P(
          "div",
          {
            id: p,
            className: "reader-fab-menu reader-floating-surface",
            role: "menu",
            "aria-label": "阅读工具",
            children: [
              /* @__PURE__ */ P("header", { className: "reader-fab-menu-head", children: [
                /* @__PURE__ */ P("div", { className: "reader-fab-menu-head-text", children: [
                  /* @__PURE__ */ h("strong", { children: "工具" }),
                  /* @__PURE__ */ h("span", { children: "拖动圆钮可移动" })
                ] }),
                /* @__PURE__ */ h(
                  "button",
                  {
                    type: "button",
                    className: "reader-fab-menu-close reader-floating-close",
                    "aria-label": "关闭菜单",
                    onClick: () => d(!1),
                    children: /* @__PURE__ */ h(Ae, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }),
              zn.map((u, b) => {
                const v = jn[u.id], O = e === u.id, B = u.needsJob && r;
                let C = O ? u.subOpen : u.subIdle;
                return u.id === "notes" && !O && t > 0 && (C = `${t} 条批注`), B && (C = "需打开任务阅读"), /* @__PURE__ */ P(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    className: `reader-fab-row${O ? " is-active" : ""}${B ? " is-disabled" : ""}`,
                    "aria-pressed": O,
                    disabled: B,
                    onClick: () => y(u.id),
                    style: { "--fab-i": b },
                    children: [
                      /* @__PURE__ */ h("span", { className: "reader-fab-row-icon", "aria-hidden": "true", children: /* @__PURE__ */ h(v, { size: 18, strokeWidth: 2 }) }),
                      /* @__PURE__ */ P("span", { className: "reader-fab-row-copy", children: [
                        /* @__PURE__ */ h("span", { className: "reader-fab-row-title", children: u.label }),
                        /* @__PURE__ */ h("span", { className: "reader-fab-row-sub", children: C })
                      ] }),
                      u.id === "notes" && _ ? /* @__PURE__ */ h("span", { className: "reader-fab-row-badge", children: _ }) : null
                    ]
                  },
                  u.id
                );
              }),
              /* @__PURE__ */ P("div", { className: "reader-fab-section", role: "group", "aria-label": "下载", children: [
                /* @__PURE__ */ P("div", { className: "reader-fab-section-head", children: [
                  /* @__PURE__ */ h(Jt, { size: 12, strokeWidth: 2.5, "aria-hidden": !0 }),
                  /* @__PURE__ */ h("span", { children: "下载 PDF" })
                ] }),
                /* @__PURE__ */ h("div", { className: "reader-fab-download-grid", children: w.map((u, b) => {
                  const v = Ct[u], O = ye(g[u]), B = i.has(u), C = !!O && !B, J = C ? "" : Ut(u, g), V = Jn[u];
                  return /* @__PURE__ */ P(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      id: `reader-fab-download-${u}`,
                      className: `reader-fab-chip${B ? " is-busy" : ""}${C ? "" : " is-disabled"}`,
                      disabled: !C,
                      title: C ? `下载${v.label}` : J,
                      onClick: () => void T(u),
                      style: { "--fab-i": b },
                      children: [
                        /* @__PURE__ */ h("span", { className: "reader-fab-chip-icon", "aria-hidden": "true", children: /* @__PURE__ */ h(V, { size: 16, strokeWidth: 2 }) }),
                        /* @__PURE__ */ h("span", { className: "reader-fab-chip-label", children: Zn[u] }),
                        /* @__PURE__ */ h("span", { className: "reader-fab-chip-state", children: B ? "…" : C ? "↓" : "—" })
                      ]
                    },
                    u
                  );
                }) }),
                w.every((u) => !ye(g[u])) ? /* @__PURE__ */ h("p", { className: "reader-fab-empty", children: "产物尚未就绪" }) : null
              ] })
            ]
          }
        ) : null,
        /* @__PURE__ */ P(
          "button",
          {
            type: "button",
            className: `reader-fab-trigger${c ? " is-open" : ""}${e ? " has-notes" : ""}`,
            "aria-label": c ? "收起工具菜单" : "打开工具菜单",
            "aria-expanded": c,
            "aria-controls": c ? p : void 0,
            "aria-haspopup": "menu",
            onPointerDown: F,
            onPointerMove: E,
            onPointerUp: A,
            onPointerCancel: A,
            children: [
              /* @__PURE__ */ h("span", { className: "reader-fab-icon", "aria-hidden": "true", children: c ? /* @__PURE__ */ h(Ae, { size: 20, strokeWidth: 2.5 }) : /* @__PURE__ */ P("span", { className: "reader-fab-dots", children: [
                /* @__PURE__ */ h("i", {}),
                /* @__PURE__ */ h("i", {}),
                /* @__PURE__ */ h("i", {})
              ] }) }),
              !c && _ ? /* @__PURE__ */ h("span", { className: "reader-fab-badge", "aria-hidden": "true", children: _ }) : null
            ]
          }
        )
      ]
    }
  );
}
function Qn({
  userZoom: e,
  onZoomChange: t,
  currentPage: r,
  numPages: n,
  onGoToPage: a,
  mode: o = "compare"
}) {
  const s = Tr(e), c = e > Rt + 1e-3, d = e < Mt - 1e-3, i = Ie(), f = "50%（半屏，对照铺满）", [l, m] = N(!1), [p, g] = N(`${r}`);
  U(() => {
    l || g(`${Math.min(Math.max(r, 1), Math.max(n, 1))}`);
  }, [r, n, l]);
  const y = () => {
    if (m(!1), !a || n <= 0)
      return;
    const T = Number(`${p}`.trim());
    a(Fe(T, n));
  };
  return /* @__PURE__ */ P("div", { className: "reader-react-hud", "data-reader-hud": "true", children: [
    /* @__PURE__ */ h("div", { className: "reader-react-hud-group", "aria-label": "页码", children: l ? /* @__PURE__ */ P(
      "form",
      {
        className: "reader-react-hud-page-form",
        onSubmit: (T) => {
          T.preventDefault(), y();
        },
        children: [
          /* @__PURE__ */ h(
            "input",
            {
              className: "reader-react-hud-page-input",
              type: "text",
              inputMode: "numeric",
              pattern: "[0-9]*",
              "aria-label": "跳转到页码",
              value: p,
              autoFocus: !0,
              onChange: (T) => g(T.target.value.replace(/[^\d]/g, "")),
              onBlur: y,
              onKeyDown: (T) => {
                T.key === "Escape" && (T.preventDefault(), m(!1), g(`${r}`));
              }
            }
          ),
          /* @__PURE__ */ P("span", { className: "reader-react-hud-page-suffix", children: [
            "/ ",
            n || "—"
          ] })
        ]
      }
    ) : /* @__PURE__ */ h(
      "button",
      {
        type: "button",
        className: "reader-react-hud-page reader-react-hud-page-btn",
        "aria-label": n > 0 ? `跳转页码，当前第 ${r} 页，共 ${n} 页` : "页码",
        title: n > 0 ? "点击输入页码跳转" : void 0,
        disabled: !a || n <= 0,
        onClick: () => {
          !a || n <= 0 || (g(`${r}`), m(!0));
        },
        children: n > 0 ? `${Math.min(r, n)} / ${n}` : "—"
      }
    ) }),
    /* @__PURE__ */ P("div", { className: "reader-react-hud-group", "aria-label": "缩放", children: [
      /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn",
          "aria-label": "缩小",
          disabled: !c,
          onClick: () => t(ve(e, -1)),
          children: "−"
        }
      ),
      /* @__PURE__ */ P(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn reader-react-hud-zoom-label",
          "aria-label": `重置为${f}`,
          title: f,
          onClick: () => t(i),
          children: [
            s,
            "%"
          ]
        }
      ),
      /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn",
          "aria-label": "放大",
          disabled: !d,
          onClick: () => t(ve(e, 1)),
          children: "+"
        }
      )
    ] }),
    /* @__PURE__ */ h("div", { className: "reader-react-hud-group reader-react-hud-help", "aria-label": "帮助", children: /* @__PURE__ */ h(Hn, {}) })
  ] });
}
const Ze = "download-toast";
function eo({
  title: e = "下载中",
  status: t = "正在准备...",
  meta: r = "等待响应...",
  percent: n = NaN,
  tone: a = "progress"
}) {
  const o = Number.isFinite(n) ? Math.max(4, Math.min(100, Number(n) || 0)) : 18;
  return /* @__PURE__ */ P("div", { className: "download-toast-card reader-floating-surface", "data-tone": a, "aria-live": "polite", children: [
    /* @__PURE__ */ P("div", { className: "download-toast-head", children: [
      /* @__PURE__ */ h("div", { id: "download-toast-title", className: "download-toast-title", children: e }),
      /* @__PURE__ */ h("div", { id: "download-toast-status", className: "download-toast-status", children: t })
    ] }),
    /* @__PURE__ */ h("div", { className: "download-toast-track", children: /* @__PURE__ */ h("span", { id: "download-toast-bar", className: "download-toast-bar", style: { width: `${o}%` } }) }),
    /* @__PURE__ */ h("div", { id: "download-toast-meta", className: "download-toast-meta", children: r })
  ] });
}
function to(e = {}) {
  const {
    visible: t = !1,
    title: r = "下载中",
    status: n = "正在准备...",
    meta: a = "等待响应...",
    percent: o = NaN,
    tone: s = "progress"
  } = e;
  if (!t) {
    je.dismiss(Ze);
    return;
  }
  je.custom(
    () => /* @__PURE__ */ h(eo, { title: r, status: n, meta: a, percent: o, tone: s }),
    { id: Ze, duration: 1 / 0 }
  );
}
function ro() {
  const e = S((t) => {
    t && (t.setState = to, t.hide = () => je.dismiss(Ze));
  }, []);
  return /* @__PURE__ */ P(lt, { children: [
    /* @__PURE__ */ h(Wt, { position: "bottom-right" }),
    /* @__PURE__ */ h("download-toast", { style: { display: "none" }, "aria-hidden": "true", ref: e })
  ] });
}
const no = Re(() => import("./ReaderNotesPanel-DF9creCf.js").then((e) => ({ default: e.ReaderNotesPanel }))), oo = Re(() => import("./ReaderFavoritesPanel-DMvTkqN2.js").then((e) => ({ default: e.ReaderFavoritesPanel }))), ao = Re(() => import("./ReaderMarkdownPanel-CQlbOV0e.js").then((e) => ({ default: e.ReaderMarkdownPanel }))), so = Re(() => import("./ReaderAiPanel-DTKf7Nfz.js").then((e) => ({ default: e.ReaderAiPanel }))), co = Re(() => import("./ReaderAiSplitResizeHandle-D0nnNMs6.js").then((e) => ({ default: e.ReaderAiSplitResizeHandle })));
function io(e) {
  return e === "compare" ? "floating" : "docked";
}
function lo() {
  const e = hn(), { boot: t, panes: r, shell: n, sessionFiles: a, notes: o, tools: s, session: c } = e, d = s.isOpen("markdown"), i = io(e.mode), f = s.isOpen("ai") && i === "docked", l = e.sourceOnly || !a.translatedUrl, m = S(() => {
    s.close();
  }, [s]), p = S((y) => {
    Ht() || e.jumpToAnchor(y);
  }, [e.jumpToAnchor]), g = S((y) => {
    c.refreshCommittedDocument(y);
  }, [c.refreshCommittedDocument]);
  return /* @__PURE__ */ P("div", { className: `reader-react-root${d ? " is-markdown-split" : ""}${f ? " is-ai-split" : ""}`, "data-reader-engine": "react-pdf", children: [
    /* @__PURE__ */ h(Ln, { loading: t.loading, failed: t.failed, text: t.text, percent: t.percent }),
    /* @__PURE__ */ h(Sn, { onBeforeClose: c.prepareClose }),
    /* @__PURE__ */ h(_n, { mode: e.mode, sourceOnly: l, onModeChange: e.setModeKeepingPage }),
    e.showHud ? /* @__PURE__ */ h(Vn, { activeTool: s.active, notesCount: o.count, sourceOnly: e.sourceOnly, onToggleTool: s.toggle, download: e.download }) : null,
    /* @__PURE__ */ h(xn, { mode: e.mode, bindShell: n.bindShell, shellEl: n.shellEl, userZoom: e.userZoom, compareMode: r.compareMode, shellWidth: n.shellWidth, compareColWidth: n.compareColWidth, rowHeights: e.rowHeights, mountSource: r.mountSource, mountTranslated: r.mountTranslated, showSource: r.showSource, showTranslated: r.showTranslated, sourceOnly: l, sourceUrl: a.sourceUrl, translatedUrl: a.translatedUrl, sourceFile: a.sourceFile, translatedFile: a.translatedFile, activeRegion: e.activeRegion, readerMetadata: c.readerMetadata, markdownSplit: d, assistantSplit: f, onMetrics: r.onMetrics, onNumPagesChange: r.onNumPages }),
    e.showHud ? /* @__PURE__ */ h(Qn, { userZoom: e.userZoom, onZoomChange: e.onZoomChange, currentPage: e.currentPage, numPages: r.hudNumPages, mode: e.mode, onGoToPage: e.goToPage }) : null,
    /* @__PURE__ */ P(xt, { fallback: null, children: [
      /* @__PURE__ */ h(no, { open: s.isOpen("notes"), groups: o.groups, count: o.count, onClose: m, onJump: e.jumpToNote, onUpdateNote: o.updateNote, onRemove: o.remove, onExport: () => o.exportMarkdown(e.documentTitle) }),
      /* @__PURE__ */ h(oo, { open: s.isOpen("favorites"), jobId: c.jobId, documentId: c.documentId, onClose: m, onJumpPage: e.goToPage }),
      /* @__PURE__ */ h(ao, { open: d, jobId: c.jobId, sourceOnly: e.sourceOnly, layout: "docked", onClose: m }),
      /* @__PURE__ */ h(so, { open: s.isOpen("ai"), jobId: c.jobId, layout: i, onClose: m, onJumpCitation: p, onDocumentCommitted: g }, c.jobId || "reader-ai-pending"),
      f ? /* @__PURE__ */ h(co, {}) : null
    ] }),
    /* @__PURE__ */ h(Un, { selection: e.selection, onAddNote: e.addNoteFromSelection, onDismiss: e.clearSelection }),
    /* @__PURE__ */ h(ro, {})
  ] });
}
function Eo() {
  return /* @__PURE__ */ h(lo, {});
}
export {
  yt as A,
  Eo as R,
  lo as a,
  er as b,
  Po as c,
  Te as d,
  No as e,
  To as f,
  So as r
};
//# sourceMappingURL=ReaderApp-CQBUP2oj.js.map
