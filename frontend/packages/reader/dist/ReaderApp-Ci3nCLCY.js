var fn = (e) => {
  throw TypeError(e);
};
var mn = (e, t, n) => t.has(e) || fn("Cannot " + n);
var Je = (e, t, n) => (mn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), pn = (e, t, n) => t.has(e) ? fn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), hn = (e, t, n, r) => (mn(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
import { jsxs as $, jsx as w, Fragment as tr } from "react/jsx-runtime";
import { useMemo as Y, useState as z, useEffect as B, useCallback as _, useRef as N, useLayoutEffect as Le, memo as Wt, forwardRef as Ur, useImperativeHandle as Ht, useSyncExternalStore as Wr, useId as Jt, createContext as Hr, useContext as Jr, Suspense as Kr, lazy as Kt } from "react";
import { getReaderAdapters as ne, requireAdapter as ve } from "./adapters.js";
import { resolveReaderDownloadName as qr, resolveReaderDownloadUrls as Vr, createReaderServerFavoritesPort as Gr, READER_PROGRESS_COPY as be, trimString as Ve, READER_DOWNLOAD_ACTIONS as Yr, disabledReason as Xr } from "./runtime/state.js";
import { d as Zr } from "./ask-answerer-GNQdzitl.js";
import "@retainpdf/api/conversations";
import { n as gn } from "./block-key-BTxcG28S.js";
import { fetchLiveTranslationLayout as Qr, LiveTranslationApiError as dt, streamLiveTranslationEvents as eo, fetchLiveTranslationPage as to } from "@retainpdf/api/live-translation";
import { toast as Lt, Toaster as no } from "sonner";
import { X as Ze, Radio as ro, FileText as nr, Columns2 as rr, Languages as or, FileCode2 as ar, Sparkles as qt, Sigma as oo, Table2 as ao, Type as io, Image as so, Check as co, Copy as lo, Keyboard as uo, Bookmark as fo, Download as mo } from "lucide-react";
import { pdfjs as po, Page as ho, Document as go } from "react-pdf";
import { e as bo, m as yo, a as vo } from "./markdown-math-Cb17EyYs.js";
const wo = (...e) => {
  var t, n;
  return ((n = (t = ne()) == null ? void 0 : t.isMockMode) == null ? void 0 : n.call(t, ...e)) ?? !1;
}, So = "", Io = Object.freeze({
  progress: "retainpdf-reader-progress"
}), st = (e) => {
  var t, n;
  return ((n = (t = ne()) == null ? void 0 : t.resolveResourceUrl) == null ? void 0 : n.call(t, e)) ?? e;
}, Ro = (...e) => {
  var t, n;
  return ((n = (t = ne()) == null ? void 0 : t.fetchProtected) == null ? void 0 : n.call(t, ...e)) ?? fetch(...e);
}, kt = (e = "") => {
  var t, n;
  return ((n = (t = ne()) == null ? void 0 : t.resolvePdfjsVendorUrl) == null ? void 0 : n.call(t, e)) ?? "";
}, Qe = new Proxy({}, { get: (e, t) => (...n) => {
  var r, a, o;
  return (o = (a = (r = ne()) == null ? void 0 : r.defaultReaderDataPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...n);
} }), ir = new Proxy({}, { get: (e, t) => (...n) => {
  var r, a, o;
  return (o = (a = (r = ne()) == null ? void 0 : r.defaultReaderPageConfigPort) == null ? void 0 : a[t]) == null ? void 0 : o.call(a, ...n);
} }), To = (...e) => {
  var t, n;
  return ((n = (t = ne()) == null ? void 0 : t.resolveReaderAnchor) == null ? void 0 : n.call(t, ...e)) ?? null;
}, xo = () => {
  var e, t;
  return ((t = (e = ne()) == null ? void 0 : e.resolveReaderDocumentId) == null ? void 0 : t.call(e)) ?? "";
}, Po = (...e) => {
  var t, n;
  return ((n = (t = ne()) == null ? void 0 : t.resolveReaderJobId) == null ? void 0 : n.call(t, ...e)) ?? "";
}, Mo = (...e) => {
  var t, n;
  return ((n = (t = ne()) == null ? void 0 : t.resolveReaderArtifactUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, Eo = (...e) => {
  var t, n;
  return ((n = (t = ne()) == null ? void 0 : t.resolveReaderSourcePdf) == null ? void 0 : n.call(t, ...e)) ?? null;
}, Ao = (...e) => {
  var t, n;
  return ((n = (t = ne()) == null ? void 0 : t.resolveReaderTranslatedPdfUrl) == null ? void 0 : n.call(t, ...e)) ?? "";
}, Lo = (...e) => {
  var t, n;
  return ((n = (t = ne()) == null ? void 0 : t.resolveReaderDownloadName) == null ? void 0 : n.call(t, ...e)) ?? qr(...e);
}, ko = (...e) => {
  var t, n;
  return ((n = (t = ne()) == null ? void 0 : t.resolveReaderDownloadUrls) == null ? void 0 : n.call(t, ...e)) ?? Vr(...e);
}, No = (...e) => ve("downloadProtectedResource")(...e), zo = (...e) => ve("failDownloadToast")(...e), Ic = (e, t) => ve("resolveMarkdownAssetUrl")(e, t), Rc = (e = {}) => {
  const t = ne();
  return Zr({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) || "/api/v1",
    ask: t == null ? void 0 : t.askDocumentAi,
    documentByJobId: t == null ? void 0 : t.fetchDocumentByJobId,
    ...e
  });
}, Vt = "/api/v1", Co = (...e) => ve("fetchDocumentByJobId")(...e), Tc = (e = Vt, t = {}) => {
  var n;
  return ve("fetchFavorites")(
    ((n = ne()) == null ? void 0 : n.apiPrefix) ?? e,
    t
  );
};
function xc(e = {}) {
  const t = ne();
  return Gr({
    apiPrefix: (t == null ? void 0 : t.apiPrefix) ?? Vt,
    documentByJobId: (...n) => ve("fetchDocumentByJobId")(...n),
    submitFavorite: (...n) => ve("createFavorite")(...n),
    loadFavorites: (...n) => ve("fetchFavorites")(...n),
    removeFavorite: (...n) => ve("deleteFavorite")(...n),
    ...e
  });
}
function _o() {
  const [e, t] = z(
    () => {
      var n, r;
      return ((n = globalThis.location) == null ? void 0 : n.search) || ((r = globalThis.location) == null ? void 0 : r.href) || "";
    }
  );
  return B(() => {
    var i, s, c, l;
    const n = () => {
      var d, u;
      return t(((d = globalThis.location) == null ? void 0 : d.search) || ((u = globalThis.location) == null ? void 0 : u.href) || "");
    }, r = (s = (i = globalThis.history) == null ? void 0 : i.pushState) == null ? void 0 : s.bind(globalThis.history), a = (l = (c = globalThis.history) == null ? void 0 : c.replaceState) == null ? void 0 : l.bind(globalThis.history);
    let o = !1;
    if (r && a)
      try {
        const d = (u) => function(...f) {
          const m = u.apply(this, f);
          return n(), globalThis.dispatchEvent(new Event("pushstate")), globalThis.dispatchEvent(new Event("replacestate")), globalThis.dispatchEvent(new Event("locationchange")), m;
        };
        globalThis.history.pushState = d(r), globalThis.history.replaceState = d(a), o = !0;
      } catch {
      }
    return window.addEventListener("popstate", n), window.addEventListener("hashchange", n), window.addEventListener("pushstate", n), window.addEventListener("replacestate", n), window.addEventListener("locationchange", n), () => {
      if (window.removeEventListener("popstate", n), window.removeEventListener("hashchange", n), window.removeEventListener("pushstate", n), window.removeEventListener("replacestate", n), window.removeEventListener("locationchange", n), o && r && a)
        try {
          globalThis.history.pushState = r, globalThis.history.replaceState = a;
        } catch {
        }
    };
  }, []), e;
}
function Do() {
  const e = _o(), t = Y(() => Po(ir), [e]), n = Y(() => xo(), [e]), r = t || n ? `job:${t}|document:${n}` : `location:${e}`;
  return { locationKey: e, jobId: t, routeDocumentId: n, sessionIdentity: r };
}
function $o(e) {
  const {
    routeDocumentId: t,
    jobId: n,
    sessionIdentity: r,
    sessionIdentityRef: a,
    documentIdRef: o,
    sessionJobIdRef: i,
    switchToSourceMode: s
  } = e, [c, l] = z({
    documentId: "",
    jobId: ""
  }), [d, u] = z({
    documentId: "",
    jobId: ""
  }), f = c.documentId === t ? c.jobId : "", m = d.documentId === t ? d.jobId : "", h = n || f, [g, S] = z({
    jobId: "",
    documentId: ""
  }), y = g.jobId === h ? g.documentId : "", b = t || y, R = !!t && !h, [v, p] = z(null), x = (v == null ? void 0 : v.sessionIdentity) === r && v.documentId === b ? v : null, T = R || !!x, M = _((A) => {
    const P = `${A.documentId || ""}`.trim();
    if (!P || o.current && o.current !== P) return;
    if (!o.current && i.current)
      S({
        jobId: i.current,
        documentId: P
      });
    else if (!o.current)
      return;
    const I = `${A.revision || ""}`.trim() || `${Date.now()}`;
    p({
      documentId: P,
      revision: I,
      sessionIdentity: a.current
    }), s();
  }, []);
  B(() => {
    p((A) => A && A.sessionIdentity !== r ? null : A);
  }, [r]);
  const E = _((A) => {
    switch (A.type) {
      case "resolved-document-job":
        l({ documentId: A.documentId, jobId: A.jobId });
        break;
      case "cleared-resolved-document-job":
        l({ documentId: "", jobId: "" });
        break;
      case "missing-document-job":
        u({ documentId: A.documentId, jobId: A.jobId });
        break;
      case "resolved-job-document":
        S((P) => P.jobId === A.jobId && P.documentId === A.documentId ? P : { jobId: A.jobId, documentId: A.documentId });
        break;
      case "committed-source":
        p({
          documentId: A.documentId,
          revision: A.revision,
          sessionIdentity: A.sessionIdentity
        });
        break;
    }
  }, []);
  return {
    resolvedDocumentJob: c,
    setResolvedDocumentJob: l,
    missingDocumentJob: d,
    setMissingDocumentJob: u,
    documentJobId: f,
    rejectedDocumentJobId: m,
    sessionJobId: h,
    resolvedJobDocument: g,
    setResolvedJobDocument: S,
    jobDocumentId: y,
    documentId: b,
    sourceOnly: R,
    committedDocumentSource: v,
    setCommittedDocumentSource: p,
    activeCommittedDocumentSource: x,
    sourceViewOnly: T,
    refreshCommittedDocument: M,
    applyIdentityEvent: E
  };
}
const Fo = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
function bn(e) {
  return `${(e == null ? void 0 : e.status) || ""}`.trim().toLowerCase();
}
function Oo(e) {
  var r, a, o, i;
  if (!e || typeof e != "object") return "";
  const t = e, n = [
    t.document_id,
    t.documentId,
    (r = t.document) == null ? void 0 : r.document_id,
    (a = t.book_summary) == null ? void 0 : a.document_id,
    (i = (o = t.request_payload) == null ? void 0 : o.source) == null ? void 0 : i.document_id
  ];
  for (const s of n) {
    const c = `${s || ""}`.trim();
    if (c) return c;
  }
  return "";
}
function yn(e, t) {
  const n = `/api/v1/documents/${encodeURIComponent(e)}/source.pdf`, r = `${t || ""}`.trim();
  return st(r ? `${n}?version=${encodeURIComponent(r)}` : n);
}
function jo(e, t = "") {
  const n = `${e || ""}`.trim(), r = `${t || ""}`.trim();
  return !!(!n || r && (n === r || n === `${r}.pdf`) || /^\d{8,14}-[0-9a-f]{4,}$/i.test(n));
}
function Bo(e, t) {
  var r;
  const n = [
    e == null ? void 0 : e.title,
    e == null ? void 0 : e.display_name,
    e == null ? void 0 : e.source_file_name,
    (r = e == null ? void 0 : e.book_summary) == null ? void 0 : r.source_file_name
  ];
  for (const a of n) {
    const o = `${a || ""}`.trim();
    if (o && !jo(o, t))
      return o.replace(/\.pdf$/i, "");
  }
  return "";
}
function Nt({
  percent: e,
  text: t,
  stage: n
}) {
  var r;
  try {
    (r = window.parent) == null || r.postMessage(
      {
        type: Io.progress,
        stage: n,
        percent: e,
        text: t
      },
      ir.messageTargetOrigin()
    );
  } catch {
  }
}
function ft(e, t, n, r = "progress") {
  e({
    loading: !0,
    percent: t,
    text: n,
    stage: r,
    failed: !1
  }), Nt({ percent: t, text: n, stage: r });
}
function Uo(e) {
  const {
    sessionJobId: t,
    sessionIdentity: n,
    sessionIdentityRef: r,
    sessionJobIdRef: a,
    sessionEpochRef: o,
    closingRef: i
  } = e, [s, c] = z(null), [l, d] = z(null), [u, f] = z(""), [m, h] = z(0), g = u === n ? s : null, S = u === n ? l : null, y = bn(g), b = Fo.has(y), R = _(() => {
    h((E) => E + 1);
  }, []), v = _((E) => {
    c(E.jobPayload), d(E.manifestPayload), f(E.sessionIdentity);
  }, []), p = _((E) => {
    c(null), d(null), f(E);
  }, []), x = N(""), T = N(""), M = _(async () => {
    const E = a.current;
    if (!E || x.current === E) return;
    const A = Qe.loadJobPayload;
    if (typeof A != "function") return;
    const P = o.current.value;
    x.current = E;
    try {
      const I = await A(E);
      if (i.current || o.current.value !== P || a.current !== E || !I || typeof I != "object")
        return;
      const L = bn(I);
      c(I), f(r.current), L === "succeeded" && T.current !== E && (T.current = E, h((C) => C + 1));
    } catch {
    } finally {
      x.current === E && (x.current = "");
    }
  }, []);
  return B(() => {
    if (!t || b || !g) return;
    const E = window.setInterval(() => {
      M();
    }, 1e3);
    return () => window.clearInterval(E);
  }, [b, M, g, t]), {
    jobPayload: s,
    setJobPayload: c,
    manifestPayload: l,
    setManifestPayload: d,
    payloadSessionIdentity: u,
    setPayloadSessionIdentity: f,
    scopedJobPayload: g,
    scopedManifestPayload: S,
    jobStatus: y,
    jobTerminal: b,
    jobRefreshRevision: m,
    refreshJobArtifacts: R,
    refreshJobStatus: M,
    publishPayload: v,
    clearPayload: p
  };
}
function zt(e) {
  document.body.classList.remove(
    "reader-mode-source",
    "reader-mode-translated",
    "reader-mode-compare"
  ), document.body.classList.add(`reader-mode-${e}`);
}
function Wo(e, t) {
  e(t), zt(t);
}
function Ho(e) {
  const [t, n] = z(e ? "source" : "compare"), r = _((o) => {
    e && o !== "source" || (n(o), zt(o));
  }, [e]), a = _((o) => {
    Wo(n, o);
  }, []);
  return B(() => (e && document.documentElement.classList.add("reader-source-only"), zt(t), () => {
    document.documentElement.classList.remove("reader-source-only");
  }), [e, t]), { mode: t, setMode: r, setModeState: n, switchSessionMode: a };
}
function Pe(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : null;
}
function sr(e) {
  const t = Pe(e);
  return t && "data" in t ? t.data : e;
}
function Ke(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : null;
}
function vn(e) {
  const t = Pe(e);
  if (!t || !Array.isArray(t.bbox) || t.bbox.length !== 4) return null;
  const n = t.bbox.map(Number);
  if (!n.every(Number.isFinite)) return null;
  const r = Ke(t.page);
  if (r == null) return null;
  const [a, o, i, s] = n, c = Math.min(a, i), l = Math.min(o, s), d = Math.max(a, i), u = Math.max(o, s);
  if (d <= c || u <= l) return null;
  const f = `${t.unit || "pdf_point"}`.trim().toLowerCase();
  if (f !== "pdf_point" && f !== "pt") return null;
  const m = `${t.origin || "top_left"}`.trim().toLowerCase();
  return m !== "top_left" && m !== "bottom_left" ? null : {
    page: Math.floor(r),
    bbox: [c, l, d, u],
    unit: "pdf_point",
    origin: m,
    text: `${t.text || ""}`
  };
}
function Jo(e) {
  const t = Pe(sr(e)), n = Array.isArray(t == null ? void 0 : t.items) ? t.items : [], r = [];
  for (const a of n) {
    const o = Pe(a), i = `${(o == null ? void 0 : o.item_id) || (o == null ? void 0 : o.itemId) || ""}`.trim(), s = vn(o == null ? void 0 : o.source), c = vn(o == null ? void 0 : o.translated);
    !i || !s || !c || r.push({
      itemId: i,
      source: s,
      translated: c,
      markdown: `${(o == null ? void 0 : o.markdown) || ""}`,
      regionType: `${(o == null ? void 0 : o.region_type) || (o == null ? void 0 : o.regionType) || ""}`,
      status: `${(o == null ? void 0 : o.status) || ""}`,
      assetIds: (Array.isArray(o == null ? void 0 : o.asset_ids) ? o.asset_ids : []).map((l) => `${l || ""}`.trim()).filter(Boolean),
      assetUrls: (Array.isArray(o == null ? void 0 : o.asset_urls) ? o.asset_urls : []).map((l) => `${l || ""}`.trim()).filter(Boolean)
    });
  }
  return r;
}
function Ko(e) {
  const t = `${e || ""}`.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return t.includes("formula") || t.includes("equation") ? "formula" : t.includes("table") ? "table" : t.includes("figure") || t.includes("image") || t.includes("chart") || t.includes("seal") ? "figure" : t.includes("text") || t.includes("title") || t.includes("paragraph") || t.includes("reference") || t.includes("caption") ? "text" : "region";
}
function Gt(e) {
  const t = Ko(e.regionType);
  if (t !== "region") return t;
  if (e.assetIds.length || e.assetUrls.length) return "figure";
  const n = `${e.markdown || e.source.text || e.translated.text || ""}`.trim();
  return /^<table(?:\s|>)/i.test(n) || /\n\s*\|?\s*:?-{3,}/.test(n) ? "table" : /^\$\$[\s\S]+\$\$$/.test(n) || /^\\\[[\s\S]+\\\]$/.test(n) || /^\\begin\{(?:equation|align|gather|multline)\*?\}/.test(n) ? "formula" : n ? "text" : t;
}
function cr(e) {
  const t = Gt(e);
  return t === "formula" || t === "table" || t === "figure";
}
function lr(e, t) {
  return `${mt(e, t).text || e.markdown || ""}`.trim();
}
function qo(e) {
  let t = `${e || ""}`.trim();
  if (!t) return "";
  const n = t.match(/^```(?:latex|tex|math)?\s*([\s\S]*?)\s*```$/i);
  n && (t = n[1].trim());
  const r = [
    ["$$", "$$"],
    ["\\[", "\\]"],
    ["\\(", "\\)"],
    ["$", "$"]
  ];
  for (const [a, o] of r)
    if (t.startsWith(a) && t.endsWith(o) && t.length > a.length + o.length)
      return t.slice(a.length, -o.length).trim();
  return t;
}
function wn(e) {
  const t = Pe(e);
  if (!t) return null;
  const n = [];
  for (const a of Array.isArray(t.pages) ? t.pages : []) {
    const o = Pe(a), i = Ke(o == null ? void 0 : o.page), s = Ke(o == null ? void 0 : o.width), c = Ke(o == null ? void 0 : o.height);
    i == null || s == null || c == null || n.push({ page: Math.floor(i), width: s, height: c });
  }
  if (!n.length) return null;
  const r = Ke(t.page_count ?? t.pageCount);
  return {
    pageCount: r == null ? n.length : Math.floor(r),
    pages: n
  };
}
function Vo(e) {
  const t = Pe(sr(e));
  return {
    source: wn(t == null ? void 0 : t.source),
    translated: wn(t == null ? void 0 : t.translated)
  };
}
function ct(e, t) {
  const n = gn(t);
  return n && e.find((r) => gn(r.itemId) === n) || null;
}
function lt(e) {
  return `${e || ""}`.normalize("NFKC").toLocaleLowerCase().replace(/[\p{P}\p{S}\s]+/gu, "").trim();
}
function Go(e) {
  const t = `${e || ""}`.trim();
  if (!t) return [];
  const n = t.split(/\n\s*\n/g).map(lt).filter(Boolean), r = t.split(">").map(lt).filter(Boolean), a = [...n.reverse(), ...r.reverse(), lt(t)];
  return [...new Set(a)].filter((o) => o.length >= 16);
}
function Yo(e, t) {
  if (!e || !t) return 0;
  if (e.includes(t)) return 1e4 + t.length;
  const n = Math.min(72, t.length);
  if (n < 24) return 0;
  const r = Math.min(32, Math.max(0, t.length - n));
  for (let a = 0; a <= r; a += 4) {
    const o = t.slice(a, a + n);
    if (o.length >= 24 && e.includes(o))
      return o.length * 100 - a;
  }
  return 0;
}
function Xo(e, t) {
  if (!t) return null;
  const n = ct(e, t.block_id);
  if (n) return n;
  const r = Go(t.snippet);
  if (!r.length) return null;
  const a = t.page_idx != null ? Number(t.page_idx) + 1 : t.page != null ? Number(t.page) : null, o = Number.isFinite(a) && Number(a) >= 1 ? e.filter((l) => l.source.page === Math.floor(Number(a)) || l.translated.page === Math.floor(Number(a))) : e;
  let i = null, s = 0, c = !1;
  for (const l of o) {
    const d = [l.source.text, l.translated.text, l.markdown].map(lt).filter(Boolean);
    let u = 0;
    for (const f of r)
      for (const m of d)
        u = Math.max(u, Yo(m, f));
    u > s ? (i = l, s = u, c = !1) : u > 0 && u === s && (c = !0);
  }
  return s > 0 && !c ? i : null;
}
function Sn(e) {
  let t = `${e || ""}`.trim().replace(/\\/g, "/");
  if (!t) return "";
  try {
    t = decodeURIComponent(new URL(t, "http://retainpdf.local/").pathname);
  } catch {
    try {
      t = decodeURIComponent(t);
    } catch {
    }
  }
  const n = "/markdown/images/", r = t.toLowerCase().indexOf(n);
  return r >= 0 && (t = t.slice(r + n.length)), t.replace(/^\.?\/?(?:images\/)?/i, "").replace(/\/{2,}/g, "/");
}
function Zo(e, t, n) {
  const r = Sn(t);
  if (!r) return null;
  const a = Number(n);
  return (Number.isFinite(a) && a >= 1 ? e.filter((i) => i.source.page === Math.floor(a)) : e).find((i) => [...i.assetUrls, ...i.assetIds].some((s) => {
    const c = Sn(s);
    return !!c && (c === r || r.endsWith(`/${c}`) || c.endsWith(`/${r}`));
  })) || null;
}
function mt(e, t) {
  return t === "translated" ? e.translated : e.source;
}
function In(e, t, n) {
  if (!e || !t) return null;
  const r = mt(e, n), a = n === "translated" ? t.translated : t.source || t.translated, o = a == null ? void 0 : a.pages.find((i) => i.page === r.page);
  return o ? { itemId: e.itemId, region: e, box: r, pageSize: o } : null;
}
function vt(e, t, n) {
  if (!e || t <= 0 || n <= 0) return null;
  const { box: r, pageSize: a } = e;
  if (a.width <= 0 || a.height <= 0) return null;
  const [o, i, s, c] = r.bbox, l = r.origin === "bottom_left" ? a.height - c : i, d = r.origin === "bottom_left" ? a.height - i : c, u = Math.max(0, Math.min(t, o / a.width * t)), f = Math.max(u, Math.min(t, s / a.width * t)), m = Math.max(0, Math.min(n, l / a.height * n)), h = Math.max(m, Math.min(n, d / a.height * n));
  return f <= u || h <= m ? null : { left: u, top: m, width: f - u, height: h - m };
}
function Rn(e) {
  return typeof e == "string" ? e.trim() : `${e ?? ""}`.trim();
}
function Qo(e) {
  const t = (e == null ? void 0 : e.data) ?? e, n = t && typeof t == "object" ? t : {};
  return {
    activeJobId: Rn(n.active_job_id),
    activeVersionId: Rn(n.active_version_id)
  };
}
function ea(e) {
  const { link: t, rejectedDocumentJobId: n, hasCommittedSource: r } = e, a = t.activeJobId && t.activeJobId !== n && !t.activeJobId.startsWith("doc:") ? t.activeJobId : "";
  return a ? { kind: "follow-active-job", jobId: a, activeVersionId: t.activeVersionId } : t.activeVersionId && !r ? { kind: "open-committed-source", documentId: "", revision: t.activeVersionId } : { kind: "open-source-url" };
}
function ta(e) {
  const {
    payloadDocumentId: t,
    linkedActiveJobId: n,
    linkedActiveVersionId: r,
    sessionJobId: a,
    hasCommittedSource: o
  } = e;
  return t && r && n === a && !o ? { kind: "restore-committed-source", documentId: t, revision: r } : { kind: "open-job-artifacts" };
}
function na(e) {
  return e.status === 404 && !e.jobId && !!e.routeDocumentId && !!e.documentJobId && e.sessionJobId === e.documentJobId;
}
function ra(e) {
  return e ? { data: e.data.slice() } : null;
}
const oa = 2, de = /* @__PURE__ */ new Map();
function Ct(e, t) {
  de.delete(e), de.set(e, t);
}
function aa(e) {
  if (de.size < oa) return;
  const t = de.keys().next().value;
  t && de.delete(t);
}
function St(e) {
  const t = `${e || ""}`.trim();
  if (!t || !de.has(t)) return null;
  const n = de.get(t);
  return Ct(t, n), n;
}
async function ur(e, t = Ro, n = {}) {
  const r = `${e || ""}`.trim();
  if (!r)
    return null;
  if (de.has(r)) {
    const s = de.get(r);
    return Ct(r, s), s;
  }
  const a = await t(r, { signal: n.signal });
  if (!a.ok) {
    const s = new Error(`读取 PDF 失败 (${a.status})`);
    throw s.status = a.status, s;
  }
  const o = await a.arrayBuffer(), i = { data: new Uint8Array(o) };
  return de.has(r) ? Ct(r, i) : (aa(), de.set(r, i)), i;
}
function ia(e = "", t = null) {
  const [n, r] = z(
    () => t || St(e)
  ), [a, o] = z(
    () => !!`${e || ""}`.trim() && !t && !St(e)
  ), [i, s] = z("");
  return B(() => {
    if (t) {
      r(t), o(!1), s("");
      return;
    }
    const c = `${e || ""}`.trim();
    if (!c) {
      r(null), o(!1), s("");
      return;
    }
    const l = St(c);
    if (l) {
      r(l), o(!1), s("");
      return;
    }
    let d = !1;
    return o(!0), s(""), r(null), ur(c).then((u) => {
      d || (r(u), o(!1));
    }).catch((u) => {
      d || (r(null), o(!1), s((u == null ? void 0 : u.message) || String(u)));
    }), () => {
      d = !0;
    };
  }, [e, t]), { file: n, loading: a, error: i };
}
function sa(e) {
  const { sessionEpochRef: t, closingRef: n, abort: r, sessionEpoch: a } = e;
  let o = !1;
  const i = () => r.signal.aborted || n.current || t.current.value !== a;
  return {
    signal: r.signal,
    isClosedOrStale: i,
    isInactive: () => o || i(),
    markFailed: () => {
      o = !0;
    }
  };
}
async function _t(e) {
  const { url: t, label: n, percentStart: r, percentEnd: a, fence: o, setBoot: i } = e;
  if (!t || o.isInactive())
    return null;
  ft(i, r, n, "download");
  const s = await ur(t, Qe.fetchProtected, {
    signal: o.signal
  });
  return o.isInactive() ? null : (ft(i, a, n, "download"), s);
}
async function ca(e) {
  const { sourceFinal: t, translatedFinal: n, fence: r, setBoot: a } = e;
  ft(a, 25, "正在下载 PDF…", "download");
  const o = [];
  let i = null, s = null;
  return t && o.push(
    _t({
      url: t,
      label: "正在下载原文 PDF…",
      percentStart: 30,
      percentEnd: 55,
      fence: r,
      setBoot: a
    }).then((d) => {
      i = d;
    })
  ), n && o.push(
    _t({
      url: n,
      label: "正在下载译文 PDF…",
      percentStart: 55,
      percentEnd: 85,
      fence: r,
      setBoot: a
    }).then((d) => {
      s = d;
    })
  ), await Promise.all(o), r.isInactive() ? { status: "inactive" } : !!t && !i || !!n && !s ? { status: "incomplete" } : { status: "downloaded", sourceBytes: i, translatedBytes: s };
}
function la(e) {
  const {
    sessionJobId: t,
    jobId: n,
    routeDocumentId: r,
    documentJobId: a,
    rejectedDocumentJobId: o,
    sourceOnly: i,
    locationKey: s,
    sessionIdentity: c,
    committedSource: l,
    applyIdentityEvent: d,
    publishPayload: u,
    clearPayload: f,
    switchSessionMode: m,
    jobRefreshRevision: h,
    sessionEpochRef: g,
    closingRef: S,
    activeLoadAbortRef: y
  } = e, [b, R] = z(""), [v, p] = z(""), [x, T] = z(null), [M, E] = z(null), [A, P] = z(!1), [I, L] = z(""), [C, D] = z([]), [U, k] = z(() => ({
    source: null,
    translated: null
  })), [F, W] = z({
    loading: !0,
    percent: 4,
    text: be.boot,
    stage: "progress",
    failed: !1
  });
  return B(() => {
    const H = new AbortController(), Q = g.current.value, X = sa({
      sessionEpochRef: g,
      closingRef: S,
      abort: H,
      sessionEpoch: Q
    });
    if (y.current = H, S.current)
      return H.abort(), () => {
        y.current === H && (y.current = null);
      };
    function ie(K, J) {
      X.markFailed(), W({
        loading: !1,
        percent: 100,
        text: K,
        stage: "failed",
        failed: !0
      }), Nt({ percent: 100, text: J, stage: "failed" });
    }
    function j() {
      P(!0), W({
        loading: !1,
        percent: 100,
        text: be.ready,
        stage: "ready",
        failed: !1
      }), Nt({ percent: 100, text: be.ready, stage: "ready" });
    }
    function re() {
      return l != null && l.documentId ? yn(
        l.documentId,
        l.revision
      ) : wo() ? So : st(`/api/v1/documents/${encodeURIComponent(r)}/source.pdf`);
    }
    async function ee() {
      let K = { activeJobId: "", activeVersionId: "" };
      try {
        const fe = await Qe.fetchProtected(
          st(`/api/v1/documents/${encodeURIComponent(r)}`)
        );
        if (fe != null && fe.ok) {
          const je = await fe.json().catch(() => null);
          K = Qo(je);
        }
      } catch {
      }
      const J = ea({
        link: K,
        rejectedDocumentJobId: o,
        hasCommittedSource: !!l
      });
      if (J.kind === "follow-active-job") {
        if (X.isInactive()) return;
        d({
          type: "resolved-document-job",
          documentId: r,
          jobId: J.jobId
        }), J.activeVersionId ? (l || d({
          type: "committed-source",
          documentId: r,
          revision: J.activeVersionId,
          sessionIdentity: c
        }), m("source")) : m("compare");
        return;
      }
      if (J.kind === "open-committed-source") {
        if (X.isInactive()) return;
        d({
          type: "committed-source",
          documentId: r,
          revision: J.revision,
          sessionIdentity: c
        }), m("source");
        return;
      }
      const te = re();
      if (X.isInactive()) return;
      R(te), p(""), L(""), f(c);
      const he = await _t({
        url: te,
        label: "正在下载原文 PDF…",
        percentStart: 30,
        percentEnd: 85,
        fence: X,
        setBoot: W
      });
      if (!X.isInactive()) {
        if (!he) {
          ie("源文件不可用：该文档没有可读取的源 PDF。", "源文件下载失败");
          return;
        }
        T(he), j();
      }
    }
    async function ce() {
      const K = await Qe.loadReaderPayload(t);
      if (X.isInactive()) return;
      let J = null;
      if (n && !r) {
        try {
          J = await Co(Vt, t);
        } catch {
        }
        if (X.isInactive()) return;
      }
      const te = Oo(K.jobPayload) || `${(J == null ? void 0 : J.document_id) || ""}`.trim();
      te && !r && d({
        type: "resolved-job-document",
        jobId: t,
        documentId: te
      });
      const he = ta({
        payloadDocumentId: te,
        linkedActiveJobId: `${(J == null ? void 0 : J.active_job_id) || ""}`.trim(),
        linkedActiveVersionId: `${(J == null ? void 0 : J.active_version_id) || ""}`.trim(),
        sessionJobId: t,
        hasCommittedSource: !!l
      });
      if (he.kind === "restore-committed-source") {
        if (X.isInactive()) return;
        d({
          type: "committed-source",
          documentId: he.documentId,
          revision: he.revision,
          sessionIdentity: c
        }), m("source");
        return;
      }
      const fe = Eo(K.manifestPayload), je = Ao(K.jobPayload, K.manifestPayload), Be = typeof fe == "string" ? fe : Mo(fe), Te = r || te, Ue = l != null && l.documentId ? yn(
        l.documentId,
        l.revision
      ) : Be || (Te ? st(`/api/v1/documents/${encodeURIComponent(Te)}/source.pdf`) : ""), We = l ? "" : je || "";
      if (R(Ue || ""), p(We), L(Bo(K.jobPayload, t)), u({
        jobPayload: K.jobPayload || null,
        manifestPayload: K.manifestPayload || null,
        sessionIdentity: c
      }), D(l ? [] : Jo(K.regionsPayload)), k(l ? { source: null, translated: null } : Vo(K.readerMetadata)), !Ue && !We) {
        ie(be.failed, be.failed);
        return;
      }
      const ze = await ca({
        sourceFinal: Ue || "",
        translatedFinal: We,
        fence: X,
        setBoot: W
      });
      if (ze.status !== "inactive") {
        if (ze.status === "incomplete") {
          ie("PDF 下载失败，请重试", "PDF 下载失败");
          return;
        }
        T(ze.sourceBytes), E(ze.translatedBytes), j();
      }
    }
    async function le() {
      P(!1), T(null), E(null), D([]), k({ source: null, translated: null }), ft(W, 8, be.metadata, "metadata");
      try {
        if (i) {
          await ee();
          return;
        }
        if (!t) {
          ie(be.failed, be.failed);
          return;
        }
        await ce();
      } catch (K) {
        if (X.isClosedOrStale() || (K == null ? void 0 : K.name) === "AbortError") return;
        X.markFailed();
        const J = Number(K == null ? void 0 : K.status);
        if (na({
          status: J,
          jobId: n,
          routeDocumentId: r,
          documentJobId: a,
          sessionJobId: t
        })) {
          d({ type: "missing-document-job", documentId: r, jobId: t }), d({ type: "cleared-resolved-document-job" }), m("source");
          return;
        }
        const te = K instanceof Error ? K.message : be.failed;
        ie(te, te);
      }
    }
    return le(), () => {
      H.abort(), y.current === H && (y.current = null);
    };
  }, [t, r, a, o, i, s, l, h, n, c, d, u, f, m]), {
    sourceUrl: b,
    translatedUrl: v,
    sourceFile: x,
    translatedFile: M,
    assetsReady: A,
    title: I,
    regions: C,
    readerMetadata: U,
    boot: F
  };
}
function ua() {
  const e = N(!1), t = N(null), { locationKey: n, jobId: r, routeDocumentId: a, sessionIdentity: o } = Do(), i = N({ identity: "", value: 0 });
  i.current.identity !== o && (i.current = {
    identity: o,
    value: i.current.value + 1
  }, e.current = !1);
  const s = N(o), c = N(""), l = N(""), d = N(() => {
  }), u = _(() => d.current(), []), f = $o({
    routeDocumentId: a,
    jobId: r,
    sessionIdentity: o,
    sessionIdentityRef: s,
    documentIdRef: c,
    sessionJobIdRef: l,
    switchToSourceMode: u
  }), {
    sessionJobId: m,
    documentId: h,
    sourceOnly: g,
    sourceViewOnly: S
  } = f, { mode: y, setMode: b, switchSessionMode: R } = Ho(S);
  d.current = () => {
    R("source");
  }, s.current = o, c.current = h, l.current = m;
  const v = Uo({
    sessionJobId: m,
    sessionIdentity: o,
    sessionIdentityRef: s,
    sessionJobIdRef: l,
    sessionEpochRef: i,
    closingRef: e
  }), {
    scopedJobPayload: p,
    scopedManifestPayload: x,
    jobStatus: T,
    jobTerminal: M,
    jobRefreshRevision: E,
    refreshJobArtifacts: A,
    refreshJobStatus: P
  } = v, I = la({
    sessionJobId: m,
    jobId: r,
    routeDocumentId: a,
    documentJobId: f.documentJobId,
    rejectedDocumentJobId: f.rejectedDocumentJobId,
    sourceOnly: g,
    locationKey: n,
    sessionIdentity: o,
    committedSource: f.activeCommittedDocumentSource,
    applyIdentityEvent: f.applyIdentityEvent,
    publishPayload: v.publishPayload,
    clearPayload: v.clearPayload,
    switchSessionMode: R,
    jobRefreshRevision: E,
    sessionEpochRef: i,
    closingRef: e,
    activeLoadAbortRef: t
  }), L = _(() => {
    var D;
    e.current = !0, (D = t.current) == null || D.abort();
  }, []), C = Y(
    () => ({
      fetchProtected: Qe.fetchProtected,
      jobId: m,
      jobPayload: p,
      manifestPayload: x,
      sourceUrl: I.sourceUrl,
      translatedUrl: I.translatedUrl,
      sourceOnly: S
    }),
    [m, p, x, I.sourceUrl, I.translatedUrl, S]
  );
  return {
    jobId: m,
    jobStatus: T,
    workflow: `${(p == null ? void 0 : p.workflow) || ""}`.trim().toLowerCase(),
    jobTerminal: M,
    documentId: h,
    sourceOnly: g,
    mode: y,
    setMode: b,
    sourceUrl: I.sourceUrl,
    translatedUrl: I.translatedUrl,
    sourceFile: I.sourceFile,
    translatedFile: I.translatedFile,
    assetsReady: I.assetsReady,
    boot: I.boot,
    title: I.title,
    regions: I.regions,
    readerMetadata: I.readerMetadata,
    download: C,
    refreshJobArtifacts: A,
    refreshJobStatus: P,
    refreshCommittedDocument: f.refreshCommittedDocument,
    prepareClose: L
  };
}
const dr = 0.25, fr = 1, da = 0.05, Yt = 0.5, fa = 16, ma = 8;
function Ge(e) {
  return Yt;
}
function wt(e) {
  return Number.isFinite(e) ? Math.min(fr, Math.max(dr, e)) : Yt;
}
function et(e, t) {
  const n = wt(Number(e) + t * da);
  return Math.round(n * 100) / 100;
}
function pa(e) {
  return Math.round(wt(e) * 100);
}
function ha(e) {
  const t = Number(e) || 0;
  return Math.max(160, Math.floor((t - 1) / 2));
}
function ga(e) {
  const n = (Number(e) || 0) - fa - ma;
  return Math.max(160, Math.floor(n));
}
function ba(e, t = Yt) {
  const n = wt(t);
  return ga((Number(e) || 0) * n);
}
function ya(e, t) {
  if (!e || !Number.isFinite(t) || t <= 0 || Math.abs(t - 1) < 1e-3)
    return;
  const n = e.scrollLeft + e.clientWidth / 2, r = e.scrollTop + e.clientHeight / 2, a = Array.from(
    e.querySelectorAll("[data-reader-pane]")
  ).map((i) => ({
    pane: i,
    cx: i.scrollLeft + i.clientWidth / 2,
    hadOverflow: i.scrollWidth > i.clientWidth + 1
  })), o = () => {
    e.scrollLeft = Math.max(0, n * t - e.clientWidth / 2), e.scrollTop = Math.max(0, r * t - e.clientHeight / 2);
    for (const { pane: i, cx: s, hadOverflow: c } of a) {
      const l = Math.max(0, i.scrollWidth - i.clientWidth);
      if (l <= 0) {
        i.scrollLeft = 0;
        continue;
      }
      c ? i.scrollLeft = Math.min(
        l,
        Math.max(0, s * t - i.clientWidth / 2)
      ) : i.scrollLeft = l / 2;
    }
  };
  requestAnimationFrame(() => {
    requestAnimationFrame(o);
  });
}
const pt = "data-reader-page", va = "data-reader-pane", wa = "reader-scroll-shell", Sa = "reader-react-scroll-shell", Xt = "reader-react-pdf-page-slot";
function ht(e, t) {
  const n = e != null ? `[${pt}="${e}"]` : `[${pt}]`;
  return t ? `${n}[${va}="${t}"]` : n;
}
function Ia() {
  return `.${Xt}[${pt}]`;
}
function mr(e) {
  return Number(e.getAttribute(pt));
}
const Zt = 48;
function pr(e, t = Zt) {
  return e.getBoundingClientRect().top + t;
}
function hr(e, t) {
  if (!e.length)
    return null;
  let n = null, r = -1 / 0;
  for (const c of e) {
    const l = c.getBoundingClientRect();
    l.height < 8 || l.width < 8 || l.top <= t + 1 && l.top >= r && (n = c, r = l.top);
  }
  if (!n && (n = e.find((l) => {
    const d = l.getBoundingClientRect();
    return d.height >= 8 && d.width >= 8;
  }) ?? e[0] ?? null, n)) {
    const l = [...e].reverse().find((d) => {
      const u = d.getBoundingClientRect();
      return u.height >= 8 && u.width >= 8;
    });
    l && l.getBoundingClientRect().bottom < t && (n = l);
  }
  if (!n)
    return null;
  const a = mr(n);
  if (!Number.isFinite(a) || a < 1)
    return null;
  const o = n.getBoundingClientRect(), i = o.height > 0 ? o.height : 1, s = Math.min(1, Math.max(0, (t - o.top) / i));
  return { el: n, page: a, fraction: s };
}
function It(e, t, n = Zt) {
  if (!e)
    return null;
  const r = ht(void 0, t), a = Array.from(e.querySelectorAll(r));
  if (!a.length || e.getBoundingClientRect().height <= 0)
    return null;
  const i = pr(e, n), s = hr(a, i);
  return s ? { page: s.page, fraction: s.fraction } : null;
}
function Qt(e, t, n = "auto", r, a = Zt) {
  if (!e || !t)
    return !1;
  const o = Math.max(1, Math.floor(Number(t.page) || 1)), i = Math.min(1, Math.max(0, Number(t.fraction) || 0));
  let s = null;
  if (r && (s = e.querySelector(ht(o, r))), s || (s = e.querySelector(ht(o))), !s)
    return !1;
  const c = e.getBoundingClientRect(), l = s.getBoundingClientRect();
  if (c.height <= 0 || l.height < 8 && s.offsetHeight < 8)
    return !1;
  const d = l.height > 0 ? l.height : s.offsetHeight, u = e.scrollTop + (l.top - c.top), f = Math.max(0, u + i * d - a);
  return n === "auto" ? e.scrollTop = f : e.scrollTo({ top: f, behavior: n }), !0;
}
function Ra(e, t, n = "smooth", r) {
  return Qt(
    e,
    { page: t, fraction: 0 },
    n,
    r
  );
}
function Dt(e, t, n) {
  const r = (n == null ? void 0 : n.behavior) ?? "auto", a = (n == null ? void 0 : n.delaysMs) ?? [0, 32, 120, 280];
  let o = !1, i = !1;
  const s = [], c = () => {
    var d;
    if (o) return;
    Qt(
      e(),
      t,
      r,
      n == null ? void 0 : n.pane
    ) && !i && (i = !0, (d = n == null ? void 0 : n.onDone) == null || d.call(n));
  };
  for (const l of a)
    l <= 0 ? requestAnimationFrame(() => {
      requestAnimationFrame(c);
    }) : s.push(setTimeout(c, l));
  return () => {
    o = !0;
    for (const l of s)
      clearTimeout(l);
  };
}
function Ta(e, t, n) {
  return Dt(
    e,
    { page: t, fraction: 0 },
    n
  );
}
function gt(e, t) {
  if (!Number.isFinite(e))
    return 1;
  const n = Math.max(1, Math.floor(e));
  return !Number.isFinite(t) || t <= 0 ? n : Math.min(t, n);
}
function ue(e) {
  return {
    page: Math.max(1, Math.floor(Number(e.page) || 1)),
    fraction: Math.min(1, Math.max(0, Number(e.fraction) || 0))
  };
}
function xa(e) {
  if (!(e instanceof HTMLElement))
    return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function Pa(e, t) {
  return e === "1" ? "source" : t ? null : e === "2" ? "compare" : e === "3" ? "translated" : null;
}
function Ma(e) {
  const {
    mode: t,
    sourceOnly: n,
    setMode: r,
    userZoom: a,
    onZoomChange: o,
    currentPage: i,
    numPages: s,
    goToPage: c,
    enabled: l = !0
  } = e;
  B(() => {
    if (!l)
      return;
    const d = (u) => {
      if (u.defaultPrevented || u.metaKey || u.ctrlKey || u.altKey || xa(u.target))
        return;
      const f = u.key, m = f.length === 1 ? f.toLowerCase() : f, h = Pa(m, n);
      if (h) {
        u.preventDefault(), r(h);
        return;
      }
      if (f === "+" || f === "=") {
        u.preventDefault(), o(et(a, 1));
        return;
      }
      if (f === "-" || f === "_") {
        u.preventDefault(), o(et(a, -1));
        return;
      }
      if (m === "0") {
        u.preventDefault(), o(Ge());
        return;
      }
      if (!(s <= 0)) {
        if (m === "j" || f === "ArrowDown" || f === "PageDown") {
          u.preventDefault(), c(gt(i + 1, s));
          return;
        }
        if (m === "k" || f === "ArrowUp" || f === "PageUp") {
          u.preventDefault(), c(gt(i - 1, s));
          return;
        }
        if (f === "Home") {
          u.preventDefault(), c(1);
          return;
        }
        f === "End" && (u.preventDefault(), c(s));
      }
    };
    return window.addEventListener("keydown", d), () => window.removeEventListener("keydown", d);
  }, [
    l,
    t,
    n,
    r,
    a,
    o,
    i,
    s,
    c
  ]);
}
const Ea = 160, Aa = 8, La = 960;
function ka(e) {
  const t = N(null), [n, r] = z(null), [a, o] = z(La), i = N(e == null ? void 0 : e.onWidthChange);
  i.current = e == null ? void 0 : e.onWidthChange;
  const s = _((l) => {
    t.current = l, r(l);
  }, []);
  B(() => {
    const l = n;
    if (!l || typeof ResizeObserver > "u")
      return;
    const d = (f) => {
      !Number.isFinite(f) || f < Ea || o((m) => Math.abs(m - f) < Aa ? m : f);
    }, u = new ResizeObserver((f) => {
      var m, h;
      d(((h = (m = f[0]) == null ? void 0 : m.contentRect) == null ? void 0 : h.width) ?? l.clientWidth);
    });
    return u.observe(l), d(l.clientWidth), () => u.disconnect();
  }, [n]), B(() => {
    var l;
    (l = i.current) == null || l.call(i, a);
  }, [a]);
  const c = ha(a);
  return {
    shellRef: t,
    shellEl: n,
    shellWidth: a,
    compareColWidth: c,
    bindShell: s
  };
}
function Na(e) {
  const { mode: t, sourceOnly: n, assetsReady: r, hasSource: a, hasTranslated: o } = e, i = r && a, s = r && o && !n, c = t === "source" || t === "compare", l = !n && (t === "translated" || t === "compare");
  return {
    mountSource: i,
    mountTranslated: s,
    showSource: c,
    showTranslated: l,
    compareMode: t === "compare" && c && l && i && s,
    primaryPane: t === "translated" ? "translated" : "source"
  };
}
function za(e, t) {
  const {
    mode: n,
    sourceOnly: r,
    assetsReady: a,
    sourceUrl: o,
    translatedUrl: i,
    sourceFile: s,
    translatedFile: c
  } = e, l = `${(t == null ? void 0 : t.identityKey) || ""}\0${o}\0${i}`, d = N(l);
  d.current = l;
  const [u, f] = z(() => ({
    identity: l,
    pages: { source: 0, translated: 0 }
  })), [m, h] = z(() => ({ identity: l, tick: 0 })), g = u.identity === l ? u.pages : { source: 0, translated: 0 }, S = m.identity === l ? m.tick : 0, y = Na({
    mode: n,
    sourceOnly: r,
    assetsReady: a,
    hasSource: !!s || !!o,
    hasTranslated: !!c
  }), { primaryPane: b } = y, R = _((P, I) => {
    d.current === l && f((L) => {
      const C = L.identity === l ? L.pages : { source: 0, translated: 0 };
      return C[I] === P && L.identity === l ? L : {
        identity: l,
        pages: { ...C, [I]: P }
      };
    });
  }, [l]), v = N(null), p = _(() => {
    v.current && clearTimeout(v.current);
    const P = l;
    v.current = setTimeout(() => {
      v.current = null, d.current === P && h((I) => ({
        identity: P,
        tick: I.identity === P ? I.tick + 1 : 1
      }));
    }, 60);
  }, [l]);
  B(() => (v.current && (clearTimeout(v.current), v.current = null), f((P) => P.identity === l && P.pages.source === 0 && P.pages.translated === 0 ? P : { identity: l, pages: { source: 0, translated: 0 } }), h((P) => P.identity === l && P.tick === 0 ? P : { identity: l, tick: 0 }), () => {
    v.current && (clearTimeout(v.current), v.current = null);
  }), [l]);
  const x = Y(
    () => Math.max(g.source, g.translated),
    [g]
  ), T = b === "translated" ? g.translated : g.source || g.translated, M = t == null ? void 0 : t.userZoom, E = t == null ? void 0 : t.shellWidth, A = `${l}-${S}-${M}-${n}-${g.source}-${g.translated}-${E}`;
  return {
    ...y,
    numPagesByPane: g,
    hudNumPages: x,
    primaryNumPages: T,
    metricsTick: S,
    onNumPages: R,
    onMetrics: p,
    rowSyncRevision: A
  };
}
const Ca = "retainpdf:reader:view:v1:", Tn = /* @__PURE__ */ new Set([
  "source",
  "translated",
  "markdown",
  "ai"
]);
function gr() {
  try {
    return typeof globalThis.localStorage > "u" ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}
function $t(e) {
  return `${e || ""}`.trim();
}
function _a({
  documentId: e,
  jobId: t
}) {
  const n = $t(e);
  if (n) return `document:${n}`;
  const r = $t(t);
  return r ? `job:${r}` : "";
}
function br(e) {
  const t = $t(e);
  return t ? `${Ca}${t}` : "";
}
function Da(e) {
  if (!e || typeof e != "object") return;
  const t = Math.floor(Number(e.page)), n = Number(e.fraction);
  if (!(!Number.isFinite(t) || t < 1 || !Number.isFinite(n)))
    return {
      page: t,
      fraction: Math.max(0, Math.min(1, n))
    };
}
function $a(e) {
  if (e === null) return null;
  if (!e || typeof e != "object") return;
  const t = `${e.left || ""}`, n = `${e.right || ""}`;
  if (!(!Tn.has(t) || !Tn.has(n) || t === n))
    return { left: t, right: n };
}
function Fa(e) {
  return e === null ? null : e === "markdown" || e === "ai" ? e : void 0;
}
function yr(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.schema !== "retainpdf_reader_view_v1") return null;
  const n = Da(t.anchor), r = Number(t.zoom), a = $a(t.splitLayout), o = Fa(t.assistantPanel);
  return {
    schema: "retainpdf_reader_view_v1",
    ...n ? { anchor: n } : {},
    ...Number.isFinite(r) ? { zoom: Math.max(0.25, Math.min(1, r)) } : {},
    ...a !== void 0 ? { splitLayout: a } : {},
    ...o !== void 0 ? { assistantPanel: o } : {},
    updatedAt: Number.isFinite(Number(t.updatedAt)) ? Number(t.updatedAt) : 0
  };
}
function Ie(e, t = gr()) {
  const n = br(e);
  if (!n || !t) return null;
  try {
    const r = t.getItem(n);
    return r ? yr(JSON.parse(r)) : null;
  } catch {
    return null;
  }
}
function en(e, t, n = gr()) {
  const r = br(e);
  if (!r || !n) return null;
  const a = Ie(e, n), o = yr({
    schema: "retainpdf_reader_view_v1",
    ...a || {},
    ...t,
    updatedAt: Date.now()
  });
  if (!o) return null;
  try {
    return n.setItem(r, JSON.stringify(o)), o;
  } catch {
    return null;
  }
}
function Oa(e, t, n = "") {
  const [r, a] = z(() => {
    var u;
    return ((u = Ie(n)) == null ? void 0 : u.zoom) ?? Ge();
  }), o = N(r), i = N(n);
  o.current = r;
  const s = N(1);
  B(() => {
    var f;
    if (i.current === n) return;
    i.current = n;
    const u = ((f = Ie(n)) == null ? void 0 : f.zoom) ?? Ge();
    s.current = 1, o.current = u, a(u);
  }, [e, n]);
  const c = _((u) => {
    const f = wt(u), m = o.current;
    Math.abs(f - m) < 5e-4 || (s.current = f / (m || 1), en(i.current, { zoom: f }), a(f));
  }, []), l = _((u) => {
    c(et(o.current, u));
  }, [c]), d = _((u) => {
    c(Ge());
  }, [c]);
  return Le(() => {
    const u = s.current;
    Math.abs(u - 1) < 1e-3 || (s.current = 1, ya(t == null ? void 0 : t.current, u));
  }, [r, t]), { userZoom: r, onZoomChange: c, stepZoom: l, resetZoom: d };
}
function ja(e, t = !0) {
  const [n, r] = z(null), a = _(() => {
    var s, c;
    r(null);
    const i = (s = globalThis.getSelection) == null ? void 0 : s.call(globalThis);
    (c = i == null ? void 0 : i.removeAllRanges) == null || c.call(i);
  }, []), o = e.current ?? null;
  return B(() => {
    if (!t)
      return;
    const i = () => {
      var D, U;
      const g = e.current, S = (D = globalThis.getSelection) == null ? void 0 : D.call(globalThis);
      if (!g || !S || S.isCollapsed || !S.rangeCount) {
        r(null);
        return;
      }
      const y = S.getRangeAt(0);
      if (!g.contains(y.commonAncestorContainer)) {
        r(null);
        return;
      }
      const b = `${S.toString() || ""}`.replace(/\s+/g, " ").trim();
      if (b.length < 2) {
        r(null);
        return;
      }
      let R = y.commonAncestorContainer;
      R.nodeType === Node.TEXT_NODE && (R = R.parentElement);
      const v = (U = R == null ? void 0 : R.closest) == null ? void 0 : U.call(
        R,
        "[data-reader-page]"
      );
      if (!v || !g.contains(v)) {
        r(null);
        return;
      }
      const p = Math.max(1, Math.floor(Number(v.getAttribute("data-reader-page")) || 1)), T = v.getAttribute("data-reader-pane") === "translated" ? "translated" : "source", M = y.getClientRects(), E = M[M.length - 1] || y.getBoundingClientRect();
      if (!E || E.width === 0 && E.height === 0) {
        r(null);
        return;
      }
      const A = typeof window < "u" ? window.innerWidth : 800, P = typeof window < "u" ? window.innerHeight : 600, I = 16, L = Math.min(Math.max(I, E.left), A - I), C = Math.min(Math.max(I, E.top), P - I);
      r({
        selectionType: "text",
        quote: b,
        page: p,
        pane: T,
        rect: {
          left: L,
          top: C,
          width: E.width,
          height: E.height
        }
      });
    }, s = () => {
      window.setTimeout(i, 0);
    }, c = () => {
      s();
    }, l = () => s(), d = () => s(), u = () => {
      s();
    }, f = (g) => {
      g.key === "Escape" && a();
    }, m = () => {
      r((g) => g && null);
    };
    document.addEventListener("mouseup", c), document.addEventListener("pointerup", l), document.addEventListener("touchend", d), document.addEventListener("selectionchange", u), document.addEventListener("keyup", f);
    const h = o ?? e.current;
    return h == null || h.addEventListener("scroll", m, { passive: !0 }), window.addEventListener("scroll", m, { passive: !0, capture: !0 }), () => {
      document.removeEventListener("mouseup", c), document.removeEventListener("pointerup", l), document.removeEventListener("touchend", d), document.removeEventListener("selectionchange", u), document.removeEventListener("keyup", f), h == null || h.removeEventListener("scroll", m), window.removeEventListener("scroll", m, !0);
    };
  }, [t, o, a]), { selection: n, clearSelection: a };
}
function Ba(e) {
  const { mode: t, setMode: n, beginModeSwitch: r } = e, a = N(t), o = N(n), i = N(r);
  return a.current = t, o.current = n, i.current = r, { setModeKeepingPage: _((c) => {
    c !== a.current && (i.current(), o.current(c));
  }, []) };
}
function Ua() {
  const [e, t] = z(null), n = _((i) => {
    t(i);
  }, []), r = _((i = null) => {
    t((s) => !i || s === i ? null : s);
  }, []), a = _((i) => {
    t((s) => s === i ? null : i);
  }, []), o = _(
    (i) => e === i,
    [e]
  );
  return { active: e, open: n, close: r, toggle: a, isOpen: o };
}
function Wa(e, t, n = !0, r = "", a) {
  const [o, i] = z(1);
  return B(() => {
    if (!n || t <= 0) {
      i(1);
      return;
    }
    const s = e.current;
    if (!s)
      return;
    let c = !1, l = null, d = 0;
    const u = ht(void 0, a), f = () => {
      if (c) return;
      const g = Array.from(s.querySelectorAll(u));
      if (!g.length)
        return;
      const S = pr(s), y = hr(g, S);
      y && i(y.page);
    }, m = () => {
      c || (d && cancelAnimationFrame(d), d = requestAnimationFrame(() => {
        d = 0, f();
      }));
    }, h = () => {
      if (c) return;
      if (!Array.from(s.querySelectorAll(u)).length) {
        l = setTimeout(h, 120);
        return;
      }
      f(), s.addEventListener("scroll", m, { passive: !0 });
    };
    return h(), () => {
      c = !0, l && clearTimeout(l), d && cancelAnimationFrame(d), s.removeEventListener("scroll", m);
    };
  }, [e, t, n, r, a]), o;
}
function Ha(e) {
  const t = e.querySelector(
    "canvas, .react-pdf__Page, .reader-react-pdf-page, .reader-react-pdf-page-placeholder"
  );
  if (t) {
    const a = t.getBoundingClientRect().height;
    if (Number.isFinite(a) && a > 0)
      return a;
  }
  const n = Number(e.getAttribute("data-natural-height"));
  if (Number.isFinite(n) && n > 0)
    return n;
  const r = e.getBoundingClientRect().height;
  return Number.isFinite(r) && r > 0 ? r : 0;
}
function Ja(e, t) {
  if (e.size !== t.size) return !1;
  for (const [n, r] of t)
    if (e.get(n) !== r) return !1;
  return !0;
}
function Ka(e, t, n = "", r) {
  const [a, o] = z(() => /* @__PURE__ */ new Map()), i = N(r);
  return i.current = r, Le(() => {
    if (!t) {
      o((b) => b.size === 0 ? b : /* @__PURE__ */ new Map());
      return;
    }
    let s = !1, c = 0, l = !1, d = !1;
    const u = () => {
      var p;
      if (s) return;
      const b = e.current;
      if (!b) return;
      const R = /* @__PURE__ */ new Map();
      b.querySelectorAll(Ia()).forEach((x) => {
        const T = mr(x);
        if (!Number.isFinite(T) || T < 1) return;
        const M = Ha(x);
        if (M <= 0) return;
        const E = R.get(T) || { height: 0, count: 0 };
        E.height = Math.max(E.height, M), E.count += 1, R.set(T, E);
      });
      const v = /* @__PURE__ */ new Map();
      R.forEach((x, T) => {
        x.count >= 2 && x.height > 0 && v.set(T, Math.ceil(x.height));
      }), o((x) => Ja(x, v) ? x : v), l && !d && (d = !0, (p = i.current) == null || p.call(i));
    }, f = () => {
      cancelAnimationFrame(c), c = requestAnimationFrame(() => {
        requestAnimationFrame(u);
      });
    };
    f();
    const m = window.setTimeout(f, 100), h = window.setTimeout(() => {
      l = !0, f();
    }, 300), g = window.setTimeout(f, 700), S = e.current;
    let y = null;
    return S && typeof ResizeObserver < "u" && (y = new ResizeObserver(() => f()), y.observe(S)), () => {
      s = !0, cancelAnimationFrame(c), window.clearTimeout(m), window.clearTimeout(h), window.clearTimeout(g), y == null || y.disconnect();
    };
  }, [e, t, n]), a;
}
const qa = [0, 48, 140, 320, 560], Va = 700, Ga = [80, 200, 400], Ya = 500, Xa = 50, Za = 180, xn = [0, 48, 140, 320, 700, 1200];
function Qa(e, t) {
  var P;
  const {
    primaryPane: n,
    mode: r,
    enabled: a = !0,
    persistenceKey: o = "",
    restoreReady: i = !0
  } = t, s = N(
    ((P = Ie(o)) == null ? void 0 : P.anchor) || { page: 1, fraction: 0 }
  ), c = N(null), l = N(!1), d = N(r), u = N(null), f = N(null), m = N(null), h = N(null), g = N(o), S = N(""), y = N(n);
  y.current = n;
  const b = _(() => {
    var I;
    (I = u.current) == null || I.call(u), u.current = null, f.current != null && (clearTimeout(f.current), f.current = null);
  }, []), R = _((I = !1) => {
    h.current != null && (clearTimeout(h.current), h.current = null);
    const L = () => {
      h.current = null, en(g.current, {
        anchor: ue(s.current)
      });
    };
    I ? L() : h.current = setTimeout(L, Za);
  }, []), v = _((I) => {
    s.current = ue(I), c.current = null, m.current != null && clearTimeout(m.current), m.current = setTimeout(() => {
      m.current = null, l.current = !1;
    }, Xa);
  }, []);
  B(() => {
    if (!a)
      return;
    let I = !1, L = null, C = null, D = null;
    const U = () => {
      if (I) return;
      const k = e.current;
      if (!k) {
        D = setTimeout(U, 50);
        return;
      }
      L = k, C = () => {
        if (l.current)
          return;
        const F = It(L, y.current);
        F && (s.current = F, R());
      }, L.addEventListener("scroll", C, { passive: !0 }), l.current || C();
    };
    return U(), () => {
      I = !0, D != null && clearTimeout(D), L && C && L.removeEventListener("scroll", C);
    };
  }, [a, r, n, e, R]), Le(() => {
    var L;
    if (g.current === o) return;
    R(!0), b(), m.current != null && (clearTimeout(m.current), m.current = null), g.current = o, S.current = "";
    const I = (L = Ie(o)) == null ? void 0 : L.anchor;
    s.current = I ? ue(I) : { page: 1, fraction: 0 }, c.current = null, l.current = !!o, d.current = r;
  }, [o, r, R, b]), B(() => {
    var L;
    if (!a || !i || !o || S.current === o) return;
    S.current = o;
    const I = ue(
      ((L = Ie(o)) == null ? void 0 : L.anchor) || { page: 1, fraction: 0 }
    );
    return s.current = I, c.current = I, l.current = !0, b(), u.current = Dt(
      () => e.current,
      I,
      {
        behavior: "auto",
        pane: y.current,
        delaysMs: xn,
        onDone: () => v(I)
      }
    ), f.current = setTimeout(() => {
      f.current = null, v(I);
    }, Math.max(...xn) + 160), () => b();
  }, [a, i, o, e, v, b]), B(() => {
    if (d.current === r)
      return;
    if (d.current = r, !a) {
      l.current = !1, c.current = null, b();
      return;
    }
    const I = c.current ? ue(c.current) : ue(s.current);
    return l.current = !0, c.current = I, s.current = I, b(), u.current = Dt(
      () => e.current,
      I,
      {
        behavior: "auto",
        pane: n,
        // 等页宽/行高同步后再钉；同一 locked 幂等，不会越滚越远
        delaysMs: qa,
        onDone: () => v(I)
      }
    ), f.current = setTimeout(() => {
      f.current = null, v(I);
    }, Va), () => {
      b();
    };
  }, [r, a, n, e, v, b]), B(() => () => {
    b(), m.current != null && (clearTimeout(m.current), m.current = null), R(!0);
  }, [b, R]);
  const p = _(() => {
    const I = It(
      e.current,
      y.current
    );
    return ue(I || s.current);
  }, [e]), x = _(() => {
    l.current = !0;
    const I = It(
      e.current,
      y.current
    ), L = ue(I ?? s.current);
    return s.current = L, c.current = L, R(), L;
  }, [e, R]), T = _((I, L, C) => {
    const D = C || y.current, U = gt(I, L || 1), k = { page: U, fraction: 0 };
    s.current = k, l.current = !0, c.current = k, R(), b(), Ra(e.current, U, "smooth", D), u.current = Ta(
      () => e.current,
      U,
      {
        behavior: "auto",
        pane: D,
        delaysMs: Ga,
        onDone: () => v(k)
      }
    ), f.current = setTimeout(() => {
      f.current = null, v(k);
    }, Ya);
  }, [e, v, b, R]), M = _(() => ue(s.current), []), E = _(() => l.current, []), A = _(() => {
    if (!l.current || !c.current)
      return;
    const I = ue(c.current);
    Qt(
      e.current,
      I,
      "auto",
      y.current
    );
  }, [e]);
  return {
    lockFromShell: p,
    beginModeSwitch: x,
    goToPage: T,
    getAnchor: M,
    isRestoring: E,
    repinIfRestoring: A
  };
}
function ei(e, t) {
  if (!e) return null;
  if (e.blockId && t) {
    const a = t(e.blockId);
    if (a != null && Number.isFinite(a) && a >= 1)
      return Math.floor(a);
  }
  if (e.pageIdx === null || e.pageIdx === void 0) return null;
  const n = Number(e.pageIdx);
  if (!Number.isFinite(n)) return null;
  const r = Math.floor(n) + 1;
  return r >= 1 ? r : null;
}
function ti(e, t, n) {
  const r = `${(n == null ? void 0 : n.jobId) || ""}`.trim(), a = `${(n == null ? void 0 : n.documentId) || ""}`.trim(), o = `j:${r}:d:${a}`;
  return t == null ? `${o}:none:${(e == null ? void 0 : e.blockId) || ""}` : `${o}:p:${t}:b:${(e == null ? void 0 : e.blockId) || ""}`;
}
const ni = [0, 80, 200, 400, 800];
function ri(e) {
  const { enabled: t, numPages: n, goToPage: r, resolveBlockPage: a, onAnchorApplied: o, jobId: i, documentId: s } = e, c = N(""), l = N(r);
  l.current = r;
  const d = N(a);
  d.current = a;
  const u = N(o);
  u.current = o, B(() => {
    var S;
    if (!t || !Number.isFinite(n) || n < 1)
      return;
    const f = To(), m = ei(f, d.current), h = ti(f, m, { jobId: i, documentId: s });
    if (c.current === h)
      return;
    if (m == null) {
      c.current = h;
      return;
    }
    c.current = h, f && ((S = u.current) == null || S.call(u, f, m));
    const g = [];
    for (const y of ni)
      g.push(
        setTimeout(() => {
          l.current(m);
        }, y)
      );
    return () => {
      for (const y of g) clearTimeout(y);
    };
  }, [t, n, i, s]);
}
const ot = {
  layoutByPage: /* @__PURE__ */ new Map(),
  pagesByPage: /* @__PURE__ */ new Map(),
  lastSeq: 0,
  connection: "idle",
  jobStatus: "",
  error: ""
};
function oi(e) {
  return new Map(((e == null ? void 0 : e.pages) || []).map((t) => [t.page_idx, t]));
}
function Pn(e, t) {
  return e.attempt !== t.attempt ? e.attempt < t.attempt ? -1 : 1 : e.generation !== t.generation ? e.generation < t.generation ? -1 : 1 : 0;
}
function vr(e, t, n) {
  if (n.page_idx !== t.page_idx) return "retry";
  const r = Pn(n, t);
  if (r < 0 || r === 0 && n.page_hash !== t.page_hash) return "retry";
  if (!e) return "accept";
  const a = Pn(n, e);
  return a < 0 ? "ignore" : a === 0 ? n.page_hash === e.pageHash ? "ignore" : "retry" : "accept";
}
function ai(e, t, n) {
  if (t.seq <= e.lastSeq) return e;
  const r = e.pagesByPage.get(t.page_idx), a = vr(r, t, n);
  if (a === "retry") return e;
  if (a === "ignore")
    return { ...e, lastSeq: t.seq, connection: "live", error: "" };
  const o = new Map(n.items.map((c) => [c.item_id, c])), i = new Map((r == null ? void 0 : r.changedAtSeqById) || []);
  for (const c of t.changed_item_ids)
    o.has(c) && i.set(c, t.seq);
  const s = new Map(e.pagesByPage);
  return s.set(t.page_idx, {
    attempt: n.attempt,
    generation: n.generation,
    pageHash: n.page_hash,
    itemsById: o,
    changedAtSeqById: i,
    lastEventSeq: t.seq
  }), {
    ...e,
    pagesByPage: s,
    lastSeq: t.seq,
    connection: "live",
    error: ""
  };
}
const Mn = [250, 500, 1e3, 2e3, 4e3], Rt = [80, 160, 320, 640, 1e3, 1500], En = [250, 500, 1e3, 2e3, 4e3, 5e3], ii = /* @__PURE__ */ new Set(["succeeded", "failed", "cancelled", "canceled"]);
function Ft(e, t) {
  return new Promise((n, r) => {
    if (t.aborted) {
      r(new DOMException("Aborted", "AbortError"));
      return;
    }
    const a = () => {
      clearTimeout(o), r(new DOMException("Aborted", "AbortError"));
    }, o = setTimeout(() => {
      t.removeEventListener("abort", a), n();
    }, e);
    t.addEventListener("abort", a, { once: !0 });
  });
}
function Tt(e, t) {
  if (e instanceof dt) {
    if (e.code === "LIVE_TRANSLATION_PAGE_NOT_COMMITTED")
      return "尚未收到可显示的页面译文";
    if (e.code === "LIVE_TRANSLATION_LAYOUT_NOT_READY")
      return "正在等待 OCR 版面数据";
  }
  return `${(e == null ? void 0 : e.message) || ""}`.trim() || t;
}
async function si(e, t, n, r) {
  let a = null;
  for (let o = 0; ; o += 1) {
    try {
      const s = await to(e, t.page_idx, { signal: r });
      if (vr(n.pagesByPage.get(t.page_idx), t, s) !== "retry")
        return s;
      a = new dt(
        "Authoritative page snapshot has not reached the event generation",
        409,
        "LIVE_TRANSLATION_SNAPSHOT_UNAVAILABLE"
      );
    } catch (s) {
      if ((s == null ? void 0 : s.name) === "AbortError") throw s;
      a = s;
      const c = s instanceof dt ? s.code : "";
      if (c && ![
        "LIVE_TRANSLATION_PAGE_NOT_COMMITTED",
        "LIVE_TRANSLATION_SNAPSHOT_UNAVAILABLE"
      ].includes(c)) throw s;
    }
    const i = Rt[Math.min(o, Rt.length - 1)];
    if (await Ft(i, r), o >= Rt.length + 2) throw a;
  }
}
function ci({
  jobId: e,
  jobStatus: t,
  enabled: n
}) {
  const [r, a] = z(ot), o = N(r), i = N("");
  o.current = r;
  const s = `${e || ""}`.trim(), c = `${t || ""}`.trim().toLowerCase(), l = ii.has(c) ? c : "";
  return B(() => {
    if (!n || !s) {
      i.current = "", o.current = ot, a(ot);
      return;
    }
    const d = i.current === s;
    i.current = s;
    const u = new AbortController();
    let f = !1;
    const m = {
      ...d ? o.current : ot,
      connection: l ? "terminal" : "connecting",
      jobStatus: c,
      error: ""
    };
    o.current = m, a(m);
    const h = (y) => {
      u.signal.aborted || a((b) => {
        const R = y(b);
        return o.current = R, R;
      });
    }, g = async () => {
      let y = 0;
      for (; !u.signal.aborted; )
        try {
          const b = await Qr(s, { signal: u.signal });
          f = !0, h((R) => ({
            ...R,
            layoutByPage: oi(b),
            jobStatus: c,
            error: ""
          }));
          return;
        } catch (b) {
          if ((b == null ? void 0 : b.name) === "AbortError") return;
          if (!(b instanceof dt && b.code === "LIVE_TRANSLATION_LAYOUT_NOT_READY")) {
            h((v) => ({
              ...v,
              connection: l ? "terminal" : "unavailable",
              jobStatus: c,
              error: Tt(b, "实时译文暂不可用")
            }));
            return;
          }
          if (l) {
            h((v) => ({
              ...v,
              connection: "terminal",
              jobStatus: c,
              error: ""
            }));
            return;
          }
          h((v) => ({
            ...v,
            connection: "connecting",
            jobStatus: c,
            error: Tt(b, "正在等待 OCR 版面数据")
          })), await Ft(Mn[Math.min(y, Mn.length - 1)], u.signal).catch(() => {
          }), y += 1;
        }
    };
    return (async () => {
      if (await g(), !f || u.signal.aborted) return;
      let y = 0;
      for (; !u.signal.aborted; ) {
        l || h((b) => ({
          ...b,
          connection: b.lastSeq > 0 ? "reconnecting" : "connecting",
          jobStatus: c,
          error: b.lastSeq > 0 ? b.error : ""
        }));
        try {
          await eo(s, {
            afterSeq: o.current.lastSeq,
            signal: u.signal,
            onEvent: async (b) => {
              if (b.seq <= o.current.lastSeq) return;
              const R = await si(
                s,
                b,
                o.current,
                u.signal
              );
              h((v) => {
                const p = ai(v, b, R);
                return l ? {
                  ...p,
                  connection: "terminal",
                  jobStatus: c
                } : {
                  ...p,
                  jobStatus: c
                };
              }), y = 0;
            }
          });
        } catch (b) {
          if ((b == null ? void 0 : b.name) === "AbortError" || u.signal.aborted) return;
          h((R) => ({
            ...R,
            connection: l ? "terminal" : "reconnecting",
            jobStatus: c,
            error: Tt(b, "实时译文连接已中断，正在重连")
          }));
        }
        if (u.signal.aborted) return;
        if (l) {
          h((b) => ({
            ...b,
            connection: "terminal",
            jobStatus: c
          }));
          return;
        }
        await Ft(En[Math.min(y, En.length - 1)], u.signal).catch(() => {
        }), y += 1;
      }
    })(), () => u.abort();
  }, [n, s, l]), r;
}
const li = 2e3;
function ui(e) {
  if (typeof e == "number") {
    const r = Number(e);
    return !Number.isFinite(r) || r < 0 ? null : Math.floor(r) + 1;
  }
  if (!e || typeof e != "object") return null;
  const t = e.page_idx;
  if (t != null && `${t}`.trim() !== "") {
    const r = Number(t);
    return !Number.isFinite(r) || r < 0 ? null : Math.floor(r) + 1;
  }
  const n = e.page;
  if (n != null && `${n}`.trim() !== "") {
    const r = Number(n);
    return !Number.isFinite(r) || r < 1 ? null : Math.floor(r);
  }
  return null;
}
const di = /* @__PURE__ */ new Set(["book", "translate"]);
function wr(e) {
  return !!(e.jobId && e.sourceUrl && di.has(e.workflow));
}
function fi(e) {
  return !!(wr(e) && !(e.jobStatus === "succeeded" && e.translatedUrl));
}
function mi() {
  const e = ua(), t = wr({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    workflow: e.workflow
  }), n = fi({
    jobId: e.jobId,
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    jobStatus: e.jobStatus,
    workflow: e.workflow
  }), r = ci({
    jobId: e.jobId,
    jobStatus: e.jobStatus,
    enabled: t
  }), a = Ua(), { shellRef: o, shellEl: i, shellWidth: s, compareColWidth: c, bindShell: l } = ka(), d = _a({
    documentId: e.documentId,
    jobId: e.jobId
  }), u = `${d}\0${e.jobId}\0${e.sourceUrl}\0${e.translatedUrl}`, { userZoom: f, onZoomChange: m } = Oa(e.mode, o, d), h = za(
    {
      mode: e.mode,
      sourceOnly: e.sourceOnly,
      assetsReady: e.assetsReady,
      sourceUrl: e.sourceUrl,
      translatedUrl: e.translatedUrl,
      sourceFile: e.sourceFile,
      translatedFile: e.translatedFile
    },
    { userZoom: f, shellWidth: s, identityKey: u }
  ), {
    beginModeSwitch: g,
    goToPage: S,
    repinIfRestoring: y
  } = Qa(o, {
    primaryPane: h.primaryPane,
    mode: e.mode,
    enabled: !e.boot.loading,
    persistenceKey: d,
    restoreReady: h.primaryNumPages > 0
  });
  B(() => {
    y();
  }, [s, y]);
  const b = Ka(
    o,
    h.compareMode,
    h.rowSyncRevision,
    y
  ), R = Wa(
    o,
    h.primaryNumPages,
    !e.boot.loading,
    `${e.mode}-${f}-${h.metricsTick}`,
    h.primaryPane
  ), v = _((j, re) => {
    var ce, le;
    const ee = Math.max(
      Number(h.hudNumPages) || 0,
      Number(h.primaryNumPages) || 0,
      Number((ce = h.numPagesByPane) == null ? void 0 : ce.source) || 0,
      Number((le = h.numPagesByPane) == null ? void 0 : le.translated) || 0
    );
    S(j, ee, re);
  }, [S, h.hudNumPages, h.primaryNumPages, h.numPagesByPane]), [p, x] = z(null), T = N(null), M = _((j) => {
    T.current && clearTimeout(T.current), x(j), j && (T.current = setTimeout(() => x(null), li));
  }, []);
  B(() => () => {
    T.current && clearTimeout(T.current);
  }, []);
  const E = _((j) => {
    const re = ct(e.regions, j);
    return re ? mt(re, h.primaryPane).page : null;
  }, [e.regions, h.primaryPane]), A = _((j, re) => {
    const ee = re || h.primaryPane, ce = typeof j == "object" && j ? `${j.block_id || ""}`.trim() : "", le = typeof j == "object" && j ? `${j.image_url || ""}`.trim() : "", K = typeof j == "object" && j ? j.page_idx != null ? Number(j.page_idx) + 1 : j.page != null ? Number(j.page) : null : typeof j == "number" ? j + 1 : null, J = Zo(e.regions, le, K) || ct(e.regions, ce) || (typeof j == "object" ? Xo(e.regions, j) : null);
    let te = J ? mt(J, ee).page : null;
    te == null && (te = ui(j)), !(te == null || te < 1) && (M(J), v(te, ee));
  }, [M, v, h.primaryPane, e.regions]);
  ri({
    enabled: !e.boot.loading && !e.boot.failed && e.assetsReady,
    numPages: h.hudNumPages || 0,
    goToPage: v,
    resolveBlockPage: E,
    jobId: e.jobId,
    documentId: e.documentId,
    onAnchorApplied: (j) => {
      M(ct(e.regions, j.blockId));
    }
  });
  const { setModeKeepingPage: P } = Ba({
    mode: e.mode,
    setMode: e.setMode,
    beginModeSwitch: g
  }), [I, L] = z(null), {
    selection: C,
    clearSelection: D
  } = ja(o, !e.boot.loading && !e.boot.failed), U = _(() => {
    L(null), D();
  }, [D]), k = _((j) => {
    D(), L(j);
  }, [D]);
  B(() => {
    C && L(null);
  }, [C]), B(() => {
    const j = o.current;
    if (!j) return;
    const re = () => L(null);
    return j.addEventListener("scroll", re, { passive: !0 }), () => j.removeEventListener("scroll", re);
  }, [i, o]);
  const F = C || I;
  B(() => {
    M(null), U();
  }, [u, M, U]);
  const W = !e.boot.loading && !e.boot.failed;
  Ma({
    mode: e.mode,
    sourceOnly: e.sourceOnly,
    setMode: P,
    userZoom: f,
    onZoomChange: m,
    currentPage: R,
    numPages: h.hudNumPages,
    goToPage: v,
    enabled: W
  });
  const H = Y(() => a, [a.active, a.open, a.close, a.toggle, a.isOpen]), Q = Y(() => ({ bindShell: l, shellEl: i, shellWidth: s, compareColWidth: c, shellRef: o }), [l, i, s, c, o]), X = Y(() => ({
    sourceUrl: e.sourceUrl,
    translatedUrl: e.translatedUrl,
    sourceFile: e.sourceFile,
    translatedFile: e.translatedFile
  }), [e.sourceUrl, e.translatedUrl, e.sourceFile, e.translatedFile]), ie = Y(() => ({
    session: e,
    boot: e.boot,
    sourceOnly: e.sourceOnly,
    mode: e.mode,
    userZoom: f,
    onZoomChange: m,
    shell: Q,
    panes: h,
    sessionFiles: X,
    rowHeights: b,
    goToPage: v,
    activeRegion: p,
    jumpToAnchor: A,
    setModeKeepingPage: P,
    download: e.download,
    showHud: W,
    tools: H,
    selection: F,
    clearSelection: U,
    selectRegion: k,
    documentTitle: e.title || "",
    viewStateKey: d,
    liveTranslation: r,
    liveTranslationAvailable: n
  }), [e, Q, h, X, b, v, p, A, P, W, H, F, U, k, f, m, d, r, n]);
  return Y(() => ({
    ...ie,
    currentPage: R
  }), [ie, R]);
}
const pi = "retainpdf:soft-reader-close";
function hi() {
  return new URL("./index.html", window.location.href).href;
}
function gi() {
  if (typeof window > "u" || window.self === window.top) return !1;
  try {
    return window.parent.postMessage(
      { type: pi },
      window.location.origin
    ), !0;
  } catch {
    return !1;
  }
}
function bi(e, t, n) {
  if (n <= 1 || !e) return !1;
  try {
    const r = new URL(t), a = new URL(e, r);
    return a.origin === r.origin && !/reader\.html$/i.test(a.pathname) && !/detail\.html$/i.test(a.pathname);
  } catch {
    return !1;
  }
}
function yi() {
  if (!(typeof window > "u") && !gi()) {
    if (bi(
      document.referrer,
      window.location.href,
      window.history.length
    )) {
      window.history.back();
      return;
    }
    window.location.assign(hi());
  }
}
function vi({ onBeforeClose: e } = {}) {
  return /* @__PURE__ */ $(
    "button",
    {
      id: "reader-close-home-btn",
      type: "button",
      className: "reader-close-home-btn",
      "aria-label": "返回主页",
      title: "返回主页",
      onClick: () => {
        e == null || e(), yi();
      },
      children: [
        /* @__PURE__ */ w(Ze, { className: "reader-close-home-icon", size: 18, strokeWidth: 2.25, "aria-hidden": !0 }),
        /* @__PURE__ */ w("span", { className: "reader-close-home-label", children: "关闭" })
      ]
    }
  );
}
let An = !1;
function wi() {
  if (An)
    return;
  const e = kt("build/pdf.worker.mjs");
  e && (po.GlobalWorkerOptions.workerSrc = e, An = !0);
}
const Si = {
  formula: "公式",
  table: "表格",
  figure: "图片",
  text: "文字",
  region: "区域"
};
function Ii({
  pane: e,
  width: t,
  height: n,
  regions: r,
  onSelect: a
}) {
  const o = r.flatMap((i) => {
    if (!cr(i.region)) return [];
    const s = vt(i, t, n);
    return s ? [{ highlight: i, rect: s }] : [];
  });
  return o.length ? /* @__PURE__ */ w("div", { className: "reader-structure-selection-layer", "aria-label": "PDF 结构选择层", children: o.map(({ highlight: i, rect: s }) => {
    const c = i.region, l = Gt(c), d = Si[l];
    return /* @__PURE__ */ $(
      "button",
      {
        type: "button",
        className: `reader-structure-selection-target is-${l}`,
        "data-reader-region-id": c.itemId,
        "data-reader-region-kind": l,
        style: s,
        "aria-label": `${d}区域，点击选择`,
        title: `${d} · 点击选择`,
        onClick: (u) => {
          u.stopPropagation();
          const f = u.currentTarget.getBoundingClientRect();
          a == null || a({
            selectionType: "region",
            region: c,
            kind: l,
            page: i.box.page,
            pane: e,
            rect: {
              left: f.left,
              top: f.top,
              width: f.width,
              height: f.height
            }
          });
        },
        children: [
          /* @__PURE__ */ w("span", { className: "reader-structure-selection-label", "aria-hidden": "true", children: d }),
          /* @__PURE__ */ w("span", { className: "sr-only", children: lr(c, e) })
        ]
      },
      c.itemId
    );
  }) }) : null;
}
function Ri(e, t, n) {
  return e.flatMap((r) => {
    if (Gt(r.region) !== "text") return [];
    const a = vt(r, t, n);
    return a ? [{ itemId: r.itemId, highlight: r, rect: a }] : [];
  });
}
function Ln(e, t, n) {
  let r = null, a = Number.POSITIVE_INFINITY;
  for (const o of e) {
    const { rect: i } = o;
    if (t < i.left || t > i.left + i.width || n < i.top || n > i.top + i.height)
      continue;
    const s = i.width * i.height;
    s < a && (r = o, a = s);
  }
  return r;
}
function Ti({ target: e }) {
  return e ? /* @__PURE__ */ w("div", { className: "reader-text-hover-layer", "aria-hidden": "true", children: /* @__PURE__ */ w(
    "div",
    {
      className: "reader-text-hover-frame",
      "data-reader-text-hover-id": e.itemId,
      style: e.rect,
      children: /* @__PURE__ */ w("span", { className: "reader-text-hover-label", children: "文字" })
    }
  ) }) : null;
}
function xi(e, t) {
  const n = e.page_idx + 1, r = {
    page: n,
    bbox: t.bbox,
    unit: "pdf_point",
    origin: "top_left",
    text: t.source_text
  }, a = {
    itemId: t.item_id,
    source: r,
    translated: r,
    markdown: t.source_text,
    regionType: t.kind,
    status: "live_translation",
    assetIds: [],
    assetUrls: []
  };
  return {
    itemId: t.item_id,
    region: a,
    box: r,
    pageSize: { page: n, width: e.width, height: e.height }
  };
}
function Pi(e, t, n, r) {
  if (!e || !t) return [];
  const a = [];
  for (const o of e.blocks) {
    const i = t.itemsById.get(o.item_id);
    if (!(i != null && i.translated_text)) continue;
    const s = vt(
      xi(e, o),
      n,
      r
    );
    s && a.push({
      itemId: o.item_id,
      translatedText: i.translated_text,
      status: i.status,
      kind: o.kind,
      sourceText: o.source_text,
      typography: o.typography,
      rect: s,
      changedAtSeq: t.changedAtSeqById.get(o.item_id) || 0,
      changedNow: t.changedAtSeqById.get(o.item_id) === t.lastEventSeq
    });
  }
  return a;
}
const Mi = '"Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", serif', kn = /* @__PURE__ */ new Map();
function Ei(e) {
  return `${e || ""}`.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function Ai(e) {
  const t = `${e || ""}`, { text: n, slots: r } = bo(t), a = Ei(n), o = yo(a, r);
  if (!r.length)
    return { fallbackHtml: o, richHtml: Promise.resolve(o), hasMath: !1 };
  let i = kn.get(t);
  return i || (i = vo(a, r), kn.set(t, i)), { fallbackHtml: o, richHtml: i, hasMath: !0 };
}
function xt(e) {
  return /title|heading|header|display_formula|equation/i.test(e);
}
function ye(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? t : void 0;
}
function Li(e, t) {
  const n = e.typography, r = ye(t) || 1, a = ye(n == null ? void 0 : n.font_size_pt), o = Math.max(1, `${e.sourceText || ""}`.split(/\n+/).length), i = e.rect.height / Math.max(1.28, o * 1.18), s = xt(e.kind) ? 24 : /caption|footnote|table/i.test(e.kind) ? 9.5 : 11, c = Math.max(5.5 * r, Math.min(i, s * r)), l = ye(n == null ? void 0 : n.fit_min_font_size_pt), d = ye(n == null ? void 0 : n.fit_max_font_size_pt), u = Math.max(3.5, (l || 5.5) * r), f = Math.max(
    u,
    d ? d * r : a ? a * r : c
  ), m = a ? a * r : c, h = ye(n == null ? void 0 : n.leading_em), g = [
    ye(n == null ? void 0 : n.padding_top_pt) || 0,
    ye(n == null ? void 0 : n.padding_right_pt) || 0,
    ye(n == null ? void 0 : n.padding_bottom_pt) || 0,
    ye(n == null ? void 0 : n.padding_left_pt) || 0
  ].map((S) => S * r);
  return {
    fontFamily: `${(n == null ? void 0 : n.font_family) || ""}`.trim() || Mi,
    fontSizePx: Math.max(u, Math.min(f, m)),
    minFontSizePx: u,
    maxFontSizePx: f,
    // Typst leading is the additional inter-line gap, unlike CSS line-height.
    lineHeight: h ? 1 + h : 1.3,
    fontWeight: (n == null ? void 0 : n.font_weight) || (xt(e.kind) ? 600 : 400),
    textAlign: (n == null ? void 0 : n.text_align) || (xt(e.kind) ? "center" : "justify"),
    padding: g,
    exact: !!a
  };
}
function ki({ item: e, pageScale: t }) {
  const n = N(null), r = Y(
    () => Ai(e.translatedText),
    [e.translatedText]
  ), [a, o] = z(r.fallbackHtml), i = Y(
    () => Li(e, t),
    [e, t]
  );
  B(() => {
    let u = !0;
    return o(r.fallbackHtml), r.hasMath && r.richHtml.then((f) => {
      u && o(f);
    }), () => {
      u = !1;
    };
  }, [r]), Le(() => {
    const u = n.current;
    if (!u) return;
    const [f, m, h, g] = i.padding, S = Math.max(1, e.rect.width - g - m), y = Math.max(1, e.rect.height - f - h);
    let b = i.minFontSizePx, R = i.maxFontSizePx, v = Math.min(i.fontSizePx, R);
    const p = (x) => (u.style.fontSize = `${x}px`, u.scrollWidth <= S + 0.5 && u.scrollHeight <= y + 0.5);
    if (p(v)) {
      if (!i.exact) {
        b = v;
        for (let x = 0; x < 6; x += 1) {
          const T = (b + R) / 2;
          p(T) ? (v = T, b = T) : R = T;
        }
      }
    } else {
      R = v, v = b;
      for (let x = 0; x < 8; x += 1) {
        const T = (b + R) / 2;
        p(T) ? (v = T, b = T) : R = T;
      }
    }
    u.style.fontSize = `${Math.max(i.minFontSizePx, v).toFixed(2)}px`;
  }, [a, e.rect.height, e.rect.width, i]);
  const [s, c, l, d] = i.padding;
  return /* @__PURE__ */ w(
    "div",
    {
      className: `reader-live-translation-item${e.changedNow ? " is-changed" : ""}`,
      "data-live-translation-item": e.itemId,
      "data-live-translation-kind": e.kind,
      "data-live-translation-status": e.status,
      "data-live-translation-typography": i.exact ? "typst" : "fitted",
      style: {
        ...e.rect,
        padding: `${s}px ${c}px ${l}px ${d}px`
      },
      children: /* @__PURE__ */ w(
        "div",
        {
          ref: n,
          className: "reader-live-translation-content",
          style: {
            fontFamily: i.fontFamily,
            fontSize: i.fontSizePx,
            fontWeight: i.fontWeight,
            lineHeight: i.lineHeight,
            textAlign: i.textAlign
          },
          dangerouslySetInnerHTML: { __html: a }
        }
      )
    }
  );
}
function Ni({
  layoutPage: e,
  pageState: t,
  width: n,
  height: r
}) {
  const a = Y(
    () => Pi(e, t, n, r),
    [r, e, t, n]
  );
  return a.length ? /* @__PURE__ */ w(
    "div",
    {
      className: "reader-live-translation-overlay",
      "data-live-translation-page": e == null ? void 0 : e.page_idx,
      "data-live-translation-generation": t == null ? void 0 : t.generation,
      "aria-hidden": "true",
      children: a.map((o) => /* @__PURE__ */ w(
        ki,
        {
          item: o,
          pageScale: e != null && e.width ? n / e.width : 1
        },
        `${o.itemId}:${o.changedAtSeq}`
      ))
    }
  ) : null;
}
const zi = Wt(Ni), Sr = 1.414, Ci = "120% 0px", bt = /* @__PURE__ */ new Map();
function _i(e, t, n) {
  let r = bt.get(e);
  if (!r) {
    const a = /* @__PURE__ */ new Map();
    r = { observer: new IntersectionObserver(
      (i) => {
        for (const s of i) {
          const c = a.get(s.target);
          c && c(s.isIntersecting);
        }
      },
      { root: e, rootMargin: Ci, threshold: 0 }
    ), elements: a }, bt.set(e, r);
  }
  return r.elements.set(n, t), r.observer.observe(n), r;
}
function Di(e, t) {
  const n = bt.get(e);
  n && (n.observer.unobserve(t), n.elements.delete(t), n.elements.size === 0 && (n.observer.disconnect(), bt.delete(e)));
}
function $i({
  pageNumber: e,
  width: t,
  devicePixelRatio: n,
  scrollRoot: r,
  pane: a,
  syncedMinHeight: o = 0,
  onMetrics: i,
  cachedAspect: s,
  onAspectChange: c,
  sentinelRef: l,
  regionHighlight: d = null,
  regionTargets: u = [],
  onSelectRegion: f,
  liveTranslationLayout: m,
  liveTranslationPage: h,
  showLiveTranslation: g = a === "source"
}) {
  const S = N(null), [y, b] = z(!1), [R, v] = z(s ?? Sr);
  B(() => {
    s != null && Math.abs(s - R) >= 1e-3 && v(s);
  }, [s]);
  const p = N(l);
  p.current = l;
  const x = N((k) => {
    var F;
    S.current = k, (F = p.current) == null || F.call(p, k);
  }).current;
  B(() => {
    const k = S.current;
    if (!k) return;
    if (typeof IntersectionObserver > "u") {
      b(!0);
      return;
    }
    let F = null;
    return _i(r, (H) => {
      H ? (F && (clearTimeout(F), F = null), b(!0)) : (F && clearTimeout(F), F = setTimeout(() => {
        b(!1);
      }, 120));
    }, k), () => {
      F && clearTimeout(F), Di(r, k);
    };
  }, [r, e]);
  const T = Math.max(120, Math.floor(t * R)), M = Math.max(T, Math.ceil(o || 0)), E = vt(d, t, T), A = Y(
    () => Ri(u, t, T),
    [T, u, t]
  ), [P, I] = z(null), L = Y(
    () => A.find((k) => k.itemId === P) || null,
    [P, A]
  ), C = (k) => {
    if (k.buttons !== 0) {
      I(null);
      return;
    }
    const F = k.currentTarget.getBoundingClientRect(), W = Ln(
      A,
      k.clientX - F.left,
      k.clientY - F.top
    ), H = (W == null ? void 0 : W.itemId) || null;
    I((Q) => Q === H ? Q : H);
  }, D = (k) => {
    var H, Q, X;
    if (!f || (Q = (H = k.target) == null ? void 0 : H.closest) != null && Q.call(H, ".reader-structure-selection-target") || `${((X = window.getSelection()) == null ? void 0 : X.toString()) || ""}`.trim()) return;
    const F = k.currentTarget.getBoundingClientRect(), W = Ln(
      A,
      k.clientX - F.left,
      k.clientY - F.top
    );
    W && f({
      selectionType: "region",
      region: W.highlight.region,
      kind: "text",
      page: W.highlight.box.page,
      pane: a === "translated" ? "translated" : "source",
      rect: {
        left: F.left + W.rect.left,
        top: F.top + W.rect.top,
        width: W.rect.width,
        height: W.rect.height
      }
    });
  }, U = (k) => {
    v((F) => {
      if (Math.abs(F - k) < 1e-3) return F;
      const W = () => c == null ? void 0 : c(e, k);
      return typeof queueMicrotask < "u" ? queueMicrotask(W) : setTimeout(W, 0), k;
    });
  };
  return /* @__PURE__ */ $(
    "div",
    {
      ref: x,
      "data-reader-page": e,
      "data-reader-pane": a,
      "data-natural-height": T,
      className: Xt,
      onPointerMoveCapture: C,
      onClick: D,
      onPointerLeave: () => I(null),
      style: {
        width: t,
        height: M,
        minHeight: M
      },
      children: [
        y ? /* @__PURE__ */ w(
          ho,
          {
            pageNumber: e,
            width: t,
            devicePixelRatio: n,
            renderTextLayer: !0,
            renderAnnotationLayer: !1,
            className: "reader-react-pdf-page",
            loading: /* @__PURE__ */ w(
              "div",
              {
                className: "reader-react-pdf-page-placeholder",
                style: { width: t, height: T }
              }
            ),
            onLoadSuccess: (k) => {
              try {
                const F = k.getViewport({ scale: 1 });
                if (F.width > 0) {
                  const W = F.height / F.width;
                  U(W);
                }
              } catch {
              }
              i == null || i();
            },
            onRenderSuccess: () => {
              i == null || i();
            }
          }
        ) : /* @__PURE__ */ w(
          "div",
          {
            className: "reader-react-pdf-page-placeholder",
            style: { width: t, height: T },
            "aria-hidden": !0
          }
        ),
        E ? /* @__PURE__ */ w(
          "div",
          {
            className: "reader-react-pdf-region-highlight",
            "data-reader-region-id": d == null ? void 0 : d.itemId,
            style: E,
            "aria-hidden": "true"
          }
        ) : null,
        y && g ? /* @__PURE__ */ w(
          zi,
          {
            layoutPage: m,
            pageState: h,
            width: t,
            height: T
          }
        ) : null,
        /* @__PURE__ */ w(Ti, { target: y ? L : null }),
        /* @__PURE__ */ w(
          Ii,
          {
            pane: a === "translated" ? "translated" : "source",
            width: t,
            height: T,
            regions: u,
            onSelect: f
          }
        )
      ]
    }
  );
}
const Fi = Wt($i), Pt = 5;
let Nn = 1;
const zn = /* @__PURE__ */ new WeakMap();
function Oi(e) {
  if (!e) return 0;
  const t = zn.get(e);
  if (t) return t;
  const n = Nn;
  return Nn += 1, zn.set(e, n), n;
}
function ji() {
  const e = typeof window < "u" && window.devicePixelRatio || 1;
  return Math.max(1, Math.min(e, 2));
}
const Bi = Ur(
  function({
    pane: t,
    url: n = "",
    preloadedFile: r = null,
    userZoom: a = 1,
    visible: o = !0,
    emptyLabel: i = "暂无 PDF",
    scrollRoot: s = null,
    pageWidthOverride: c = null,
    rowHeights: l,
    onMetrics: d,
    onLoadSuccess: u,
    onLoadError: f,
    onNumPagesChange: m,
    activeRegion: h = null,
    regions: g = [],
    readerMetadata: S = null,
    onSelectRegion: y,
    liveTranslation: b,
    showLiveTranslation: R = t === "source",
    liveTranslationPendingLabel: v = ""
  }, p) {
    wi();
    const { file: x, loading: T, error: M } = ia(n, r), E = `${n}\0${Oi(x)}`, A = N(E);
    A.current = E;
    const P = Y(
      () => ra(x),
      [x, n]
    ), [I, L] = z(0), [C, D] = z(""), [U, k] = z(null), [F, W] = z(480), H = N(null), Q = N(0), X = Y(() => ji(), []), ie = Y(() => ({
      cMapUrl: kt("cmaps/"),
      cMapPacked: !0,
      standardFontDataUrl: kt("standard_fonts/")
    }), []);
    Ht(p, () => U, [U]), B(() => {
      const O = (q) => {
        !Number.isFinite(q) || q < 80 || Math.abs(q - Q.current) < 8 || (Q.current = q, W(q));
      }, Z = c && c >= 80 ? c : (s == null ? void 0 : s.clientWidth) || 0;
      if (O(Z), !s || typeof ResizeObserver > "u" || c && c >= 80) return;
      const G = new ResizeObserver((q) => {
        var ge, rt;
        const oe = ((rt = (ge = q[0]) == null ? void 0 : ge.contentRect) == null ? void 0 : rt.width) ?? s.clientWidth;
        !Number.isFinite(oe) || oe < 80 || (H.current && clearTimeout(H.current), H.current = setTimeout(() => O(oe), 80));
      });
      return G.observe(s), () => {
        G.disconnect(), H.current && clearTimeout(H.current);
      };
    }, [c, s, o]);
    const j = Y(
      () => ba(F, a),
      [F, a]
    ), [re, ee] = z(() => /* @__PURE__ */ new Map()), [ce, le] = z(() => /* @__PURE__ */ new Set()), K = N(/* @__PURE__ */ new Map()), J = N(null), te = _((O, Z) => {
      ee((G) => {
        if (G.get(O) === Z) return G;
        const q = new Map(G);
        return q.set(O, Z), q;
      });
    }, []), he = _((O, Z) => {
      const G = K.current, q = G.get(O);
      if (q && J.current)
        try {
          J.current.unobserve(q);
        } catch {
        }
      if (Z) {
        if (G.set(O, Z), J.current)
          try {
            J.current.observe(Z);
          } catch {
          }
      } else
        G.delete(O);
    }, []);
    B(() => {
      if (!s || typeof IntersectionObserver > "u") return;
      const O = new IntersectionObserver(
        (Z) => {
          le((G) => {
            const q = new Set(G);
            let oe = !1;
            for (const ge of Z) {
              const rt = ge.target, He = Number(rt.getAttribute("data-reader-page"));
              Number.isFinite(He) && (ge.isIntersecting ? q.has(He) || (q.add(He), oe = !0) : q.has(He) && (q.delete(He), oe = !0));
            }
            return oe ? q : G;
          });
        },
        { root: s, rootMargin: "0px", threshold: 0 }
      );
      J.current = O;
      for (const Z of K.current.values())
        try {
          O.observe(Z);
        } catch {
        }
      return () => {
        O.disconnect(), J.current === O && (J.current = null);
      };
    }, [s]), Le(() => {
      L(0), D(""), le(/* @__PURE__ */ new Set()), ee(/* @__PURE__ */ new Map()), K.current.clear(), m == null || m(0, t);
    }, [E, m, t]);
    const fe = _(
      ({ numPages: O }) => {
        A.current === E && (L(O), D(""), m == null || m(O, t), u == null || u({ numPages: O, pane: t }));
      },
      [E, u, m, t]
    ), je = _(
      (O) => {
        if (A.current !== E) return;
        const Z = (O == null ? void 0 : O.message) || "PDF 解析失败";
        D(Z), L(0), m == null || m(0, t), f == null || f(O, t);
      },
      [E, f, m, t]
    ), Be = Y(
      () => I > 0 ? Array.from({ length: I }, (O, Z) => Z + 1) : [],
      [I]
    ), Te = Y(
      () => In(h, S, t),
      [h, S, t]
    ), Ue = Y(() => {
      const O = /* @__PURE__ */ new Map();
      for (const Z of g) {
        const G = In(Z, S, t);
        if (!G) continue;
        const q = O.get(G.box.page) || [];
        q.push(G), O.set(G.box.page, q);
      }
      return O;
    }, [t, S, g]), We = Y(() => {
      if (I === 0) return /* @__PURE__ */ new Set();
      if (!(!!s && typeof IntersectionObserver < "u" && o)) return new Set(Be);
      if (ce.size === 0) {
        const G = Math.min(I, Pt * 2 + 1);
        return new Set(Array.from({ length: G }, (q, oe) => oe + 1));
      }
      const Z = /* @__PURE__ */ new Set();
      for (const G of ce)
        for (let q = -Pt; q <= Pt; q++) {
          const oe = G + q;
          oe >= 1 && oe <= I && Z.add(oe);
        }
      return Z;
    }, [I, Be, s, o, ce]), ze = !n || !!M || !!C, Br = n && (M || C) || i;
    return /* @__PURE__ */ $(
      "section",
      {
        ref: k,
        className: `reader-panel reader-react-pdf-pane${o ? "" : " is-hidden"}`,
        "data-reader-pane": t,
        "data-reader-engine": "react-pdf",
        "data-reader-visible": o ? "true" : "false",
        "data-live-translation-status": (b == null ? void 0 : b.jobStatus) || void 0,
        "aria-hidden": o ? void 0 : !0,
        "aria-label": t === "source" ? "原文 PDF" : "译文 PDF",
        children: [
          v ? /* @__PURE__ */ $("div", { className: "reader-live-translation-waiting", role: "status", children: [
            /* @__PURE__ */ w("span", { className: "reader-live-translation-waiting-dot", "aria-hidden": "true" }),
            /* @__PURE__ */ w("span", { children: v })
          ] }) : null,
          ze && !T ? /* @__PURE__ */ w("div", { className: "reader-empty reader-react-pdf-empty", "data-reader-pdf-empty": t, children: Br }) : null,
          T ? /* @__PURE__ */ w("div", { className: "reader-empty reader-react-pdf-loading", "data-reader-pdf-loading": t, children: "正在加载 PDF…" }) : null,
          P && !M ? /* @__PURE__ */ w("div", { className: "reader-viewer-wrap reader-react-pdf-wrap", children: /* @__PURE__ */ w(
            go,
            {
              file: P,
              loading: null,
              error: null,
              options: ie,
              onLoadSuccess: fe,
              onLoadError: je,
              className: "reader-react-pdf-document",
              children: Be.map((O) => {
                if (We.has(O))
                  return /* @__PURE__ */ w(
                    Fi,
                    {
                      pane: t,
                      pageNumber: O,
                      width: j,
                      devicePixelRatio: X,
                      scrollRoot: s,
                      syncedMinHeight: (l == null ? void 0 : l.get(O)) || 0,
                      onMetrics: d,
                      cachedAspect: re.get(O),
                      onAspectChange: te,
                      sentinelRef: (ge) => he(O, ge),
                      regionHighlight: (Te == null ? void 0 : Te.box.page) === O ? Te : null,
                      regionTargets: Ue.get(O),
                      onSelectRegion: y,
                      liveTranslationLayout: b == null ? void 0 : b.layoutByPage.get(O - 1),
                      liveTranslationPage: b == null ? void 0 : b.pagesByPage.get(O - 1),
                      showLiveTranslation: R
                    },
                    `${t}-${O}`
                  );
                const G = re.get(O) ?? Sr, q = Math.max(120, Math.floor(j * G)), oe = Math.max(q, Math.ceil((l == null ? void 0 : l.get(O)) || 0));
                return /* @__PURE__ */ w(
                  "div",
                  {
                    ref: (ge) => he(O, ge),
                    "data-reader-page": O,
                    "data-reader-pane": t,
                    "data-natural-height": q,
                    className: Xt,
                    style: {
                      width: j,
                      height: oe,
                      minHeight: oe
                    },
                    children: /* @__PURE__ */ w(
                      "div",
                      {
                        className: "reader-react-pdf-page-placeholder",
                        style: { width: j, height: q },
                        "aria-hidden": !0
                      }
                    )
                  },
                  `${t}-${O}`
                );
              })
            },
            E
          ) }) : null
        ]
      }
    );
  }
), Cn = Wt(Bi);
function Ui({
  mode: e,
  compareMode: t,
  showSource: n,
  showTranslated: r,
  markdownSplit: a,
  liveTranslationPair: o = !1
}) {
  if (o)
    return {
      mode: "compare",
      compareMode: !0,
      showSource: !0,
      showTranslated: !0
    };
  const i = a && e === "compare";
  return {
    mode: i ? "source" : e,
    compareMode: t && !a,
    showSource: i ? !0 : n,
    showTranslated: i ? !1 : r
  };
}
function Wi(e, t, n = e * 2) {
  return t ? Math.min(e * 2, n) : e;
}
function Hi(e) {
  return e ? e.connection === "terminal" && e.jobStatus === "failed" ? e.pagesByPage.size > 0 ? `翻译已暂停，已保留 ${e.pagesByPage.size} 页译文` : "翻译已暂停，原始 PDF 仍可阅读" : e.connection === "terminal" && ["cancelled", "canceled"].includes(e.jobStatus) ? e.pagesByPage.size > 0 ? `翻译已取消，已保留 ${e.pagesByPage.size} 页译文` : "翻译已取消，原始 PDF 仍可阅读" : e.pagesByPage.size > 0 ? "" : e.connection === "unavailable" ? e.error || "实时译文暂不可用，原始 PDF 仍可阅读" : e.error ? e.error : e.layoutByPage.size === 0 ? "正在完成 OCR，译文将在这里逐页出现" : "版面已就绪，正在等待首个译文页面" : "";
}
function Ji(e) {
  const {
    mode: t,
    bindShell: n,
    shellEl: r,
    userZoom: a,
    compareMode: o,
    shellWidth: i,
    rowHeights: s,
    mountSource: c,
    mountTranslated: l,
    showSource: d,
    showTranslated: u,
    sourceOnly: f,
    sourceUrl: m,
    translatedUrl: h,
    sourceFile: g,
    translatedFile: S,
    onMetrics: y,
    onNumPagesChange: b,
    activeRegion: R,
    regions: v = [],
    readerMetadata: p,
    onSelectRegion: x,
    markdownSplit: T = !1,
    assistantSplit: M = !1,
    reversePanes: E = !1,
    liveTranslation: A,
    liveTranslationPair: P = !1
  } = e, I = Ui({
    mode: t,
    compareMode: o,
    showSource: d,
    showTranslated: u,
    markdownSplit: T,
    liveTranslationPair: P
  }), L = Wi(
    i,
    T || M,
    typeof document > "u" ? i * 2 : document.documentElement.clientWidth
  );
  return /* @__PURE__ */ w(
    "div",
    {
      ref: n,
      id: wa,
      className: Sa,
      "data-reader-scroll-shell": "true",
      "data-reader-region-count": v.length,
      "data-reader-structured-region-count": v.filter(cr).length,
      "data-reader-metadata-ready": p ? "true" : "false",
      children: /* @__PURE__ */ $(
        "main",
        {
          className: `reader-react-grid reader-mode-${I.mode}${E ? " is-reversed" : ""}`,
          "data-reader-mode": T ? "markdown-split" : M ? "assistant-split" : t,
          children: [
            c ? /* @__PURE__ */ w(
              Cn,
              {
                pane: "source",
                url: m,
                preloadedFile: g,
                userZoom: a,
                visible: I.showSource,
                scrollRoot: r,
                pageWidthOverride: L,
                rowHeights: I.compareMode ? s : void 0,
                onMetrics: y,
                emptyLabel: f ? "源文件不可用：该文档没有可读取的源 PDF。" : "暂无原文 PDF",
                onNumPagesChange: b,
                activeRegion: R,
                regions: v,
                readerMetadata: p,
                onSelectRegion: x,
                liveTranslation: P ? void 0 : A,
                showLiveTranslation: !P
              }
            ) : null,
            l || P ? /* @__PURE__ */ w(
              Cn,
              {
                pane: "translated",
                url: P ? m : h,
                preloadedFile: P ? g : S,
                userZoom: a,
                visible: I.showTranslated,
                scrollRoot: r,
                pageWidthOverride: L,
                rowHeights: I.compareMode ? s : void 0,
                onMetrics: y,
                emptyLabel: "暂无译文 PDF",
                onNumPagesChange: b,
                activeRegion: R,
                regions: v,
                readerMetadata: p,
                onSelectRegion: x,
                liveTranslation: P ? A : void 0,
                showLiveTranslation: P,
                liveTranslationPendingLabel: P ? Hi(A) : ""
              }
            ) : null
          ]
        }
      )
    }
  );
}
const Ki = [
  { id: "source", label: "源文件", Icon: nr },
  { id: "compare", label: "对照", Icon: rr },
  { id: "translated", label: "翻译文件", Icon: or }
];
function qi(e) {
  return e.connection === "live" ? `实时译文 · ${e.pagesByPage.size} 页` : e.connection === "reconnecting" ? "实时译文 · 重连中" : e.connection === "unavailable" ? "实时译文 · 不可用" : e.connection === "terminal" ? e.jobStatus === "failed" ? "实时译文 · 已暂停" : e.jobStatus === "cancelled" || e.jobStatus === "canceled" ? "实时译文 · 已取消" : e.jobStatus === "succeeded" ? "实时译文 · 已完成" : "实时译文 · 已结束" : e.error || "实时译文 · 连接中";
}
function Vi(e) {
  return e.id === "translated" ? e.sourceOnly : e.id === "compare" ? !e.documentReady || e.sourceOnly && !e.liveTranslationAvailable : !1;
}
function Gi({
  mode: e,
  documentReady: t,
  sourceOnly: n = !1,
  onModeChange: r,
  liveTranslation: a = null
}) {
  const o = a ? qi(a.state) : "";
  return /* @__PURE__ */ $("header", { className: "reader-workspace-bar", children: [
    a ? /* @__PURE__ */ $(
      "button",
      {
        type: "button",
        className: `reader-live-translation-toggle is-${a.state.connection}${a.visible ? " is-active" : ""}`,
        "aria-pressed": a.visible,
        "aria-label": a.visible ? "隐藏实时译文" : "显示实时译文",
        title: a.state.error || o,
        onClick: a.onToggle,
        children: [
          /* @__PURE__ */ w(ro, { size: 14, strokeWidth: 2.2, "aria-hidden": !0 }),
          /* @__PURE__ */ w("span", { className: "reader-live-translation-toggle-label", children: o })
        ]
      }
    ) : null,
    /* @__PURE__ */ w("div", { className: "reader-workspace-tabs", role: "tablist", "aria-label": "阅读工作区", children: Ki.map(({ id: i, label: s, Icon: c }) => {
      const l = e === i, d = Vi({
        id: i,
        documentReady: t,
        sourceOnly: n,
        liveTranslationAvailable: !!a
      });
      return /* @__PURE__ */ $(
        "button",
        {
          type: "button",
          className: `reader-workspace-tab${l ? " is-active" : ""}`,
          role: "tab",
          "aria-selected": l,
          "aria-label": s,
          title: d ? `${s} 需要文档任务` : s,
          disabled: d,
          onClick: () => r(i),
          children: [
            /* @__PURE__ */ w(c, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
            /* @__PURE__ */ w("span", { className: "reader-workspace-tab-label", children: s })
          ]
        },
        i
      );
    }) })
  ] });
}
const _n = [
  { id: "markdown", label: "Markdown", Icon: ar },
  { id: "ai", label: "AI 问答", Icon: qt }
];
function Yi({
  active: e,
  onSelect: t,
  onClose: n
}) {
  return e ? /* @__PURE__ */ $("header", { className: "reader-assistant-dock-header", children: [
    /* @__PURE__ */ w("div", { className: "reader-assistant-dock-tabs", role: "tablist", "aria-label": "阅读辅助面板", children: _n.map(({ id: r, label: a, Icon: o }) => {
      const i = e === r;
      return /* @__PURE__ */ $(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": i,
          className: `reader-assistant-dock-tab${i ? " is-active" : ""}`,
          onClick: () => t(r),
          children: [
            /* @__PURE__ */ w(o, { size: 15, strokeWidth: 2.15, "aria-hidden": !0 }),
            /* @__PURE__ */ w("span", { children: a })
          ]
        },
        r
      );
    }) }),
    /* @__PURE__ */ w(
      "button",
      {
        type: "button",
        className: "reader-assistant-dock-close",
        "aria-label": "关闭阅读辅助面板",
        title: "关闭辅助面板",
        onClick: n,
        children: /* @__PURE__ */ w(Ze, { size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
      }
    )
  ] }) : /* @__PURE__ */ w("nav", { className: "reader-assistant-rail", "aria-label": "阅读辅助工具", children: _n.map(({ id: r, label: a, Icon: o }) => /* @__PURE__ */ $(
    "button",
    {
      type: "button",
      className: "reader-assistant-rail-button",
      "aria-label": `打开${a}`,
      title: a,
      onClick: () => t(r),
      children: [
        /* @__PURE__ */ w(o, { size: 18, strokeWidth: 2, "aria-hidden": !0 }),
        /* @__PURE__ */ w("span", { children: a === "AI 问答" ? "AI" : "MD" })
      ]
    },
    r
  )) });
}
function Xi(e, t) {
  const n = getComputedStyle(e), r = parseFloat(n.fontSize);
  return t * r;
}
function Zi(e, t) {
  const n = getComputedStyle(e.ownerDocument.documentElement), r = parseFloat(n.fontSize);
  return t * r;
}
function Qi(e) {
  return e / 100 * window.innerHeight;
}
function es(e) {
  return e / 100 * window.innerWidth;
}
function ts(e) {
  switch (typeof e) {
    case "number":
      return [e, "px"];
    case "string": {
      const t = parseFloat(e);
      return e.endsWith("%") ? [t, "%"] : e.endsWith("px") ? [t, "px"] : e.endsWith("rem") ? [t, "rem"] : e.endsWith("em") ? [t, "em"] : e.endsWith("vh") ? [t, "vh"] : e.endsWith("vw") ? [t, "vw"] : [t, "%"];
    }
  }
}
function qe({
  groupSize: e,
  panelElement: t,
  styleProp: n
}) {
  let r;
  const [a, o] = ts(n);
  switch (o) {
    case "%": {
      r = a / 100 * e;
      break;
    }
    case "px": {
      r = a;
      break;
    }
    case "rem": {
      r = Zi(t, a);
      break;
    }
    case "em": {
      r = Xi(t, a);
      break;
    }
    case "vh": {
      r = Qi(a);
      break;
    }
    case "vw": {
      r = es(a);
      break;
    }
  }
  return r;
}
function se(e) {
  return parseFloat(e.toFixed(3));
}
function Oe({
  group: e
}) {
  const { orientation: t, panels: n } = e;
  return n.reduce((r, a) => (r += t === "horizontal" ? a.element.offsetWidth : a.element.offsetHeight, r), 0);
}
function Ot(e) {
  const { panels: t } = e, n = Oe({ group: e });
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
    const { element: a, panelConstraints: o } = r;
    let i = 0;
    if (o.collapsedSize !== void 0) {
      const d = qe({
        groupSize: n,
        panelElement: a,
        styleProp: o.collapsedSize
      });
      i = se(d / n * 100);
    }
    let s;
    if (o.defaultSize !== void 0) {
      const d = qe({
        groupSize: n,
        panelElement: a,
        styleProp: o.defaultSize
      });
      s = se(d / n * 100);
    }
    let c = 0;
    if (o.minSize !== void 0) {
      const d = qe({
        groupSize: n,
        panelElement: a,
        styleProp: o.minSize
      });
      c = se(d / n * 100);
    }
    let l = 100;
    if (o.maxSize !== void 0) {
      const d = qe({
        groupSize: n,
        panelElement: a,
        styleProp: o.maxSize
      });
      l = se(d / n * 100);
    }
    return {
      groupResizeBehavior: o.groupResizeBehavior,
      collapsedSize: i,
      collapsible: o.collapsible === !0,
      defaultSize: s,
      disabled: o.disabled,
      minSize: c,
      maxSize: l,
      panelId: r.id
    };
  });
}
function V(e, t = "Assertion error") {
  if (!e)
    throw Error(t);
}
function jt(e, t) {
  return Array.from(t).sort(
    e === "horizontal" ? ns : rs
  );
}
function ns(e, t) {
  const n = e.element.offsetLeft - t.element.offsetLeft;
  return n !== 0 ? n : e.element.offsetWidth - t.element.offsetWidth;
}
function rs(e, t) {
  const n = e.element.offsetTop - t.element.offsetTop;
  return n !== 0 ? n : e.element.offsetHeight - t.element.offsetHeight;
}
function Ir(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.ELEMENT_NODE;
}
function Rr(e, t) {
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
function os({
  orientation: e,
  rects: t,
  targetRect: n
}) {
  const r = {
    x: n.x + n.width / 2,
    y: n.y + n.height / 2
  };
  let a, o = Number.MAX_VALUE;
  for (const i of t) {
    const { x: s, y: c } = Rr(r, i), l = e === "horizontal" ? s : c;
    l < o && (o = l, a = i);
  }
  return V(a, "No rect found"), a;
}
let at;
function as() {
  return at === void 0 && (typeof matchMedia == "function" ? at = !!matchMedia("(pointer:coarse)").matches : at = !1), at;
}
function Tr(e) {
  const { element: t, orientation: n, panels: r, separators: a } = e, o = jt(
    n,
    Array.from(t.children).filter(Ir).map((h) => ({ element: h }))
  ).map(({ element: h }) => h), i = [];
  let s = !1, c = !1, l = -1, d = -1, u = 0, f, m = [];
  {
    let h = -1;
    for (const g of o)
      g.hasAttribute("data-panel") && (h++, g.hasAttribute("data-disabled") || (u++, l === -1 && (l = h), d = h));
  }
  if (u > 1) {
    let h = -1;
    for (const g of o)
      if (g.hasAttribute("data-panel")) {
        h++;
        const S = r.find(
          (y) => y.element === g
        );
        if (S) {
          if (f) {
            const y = f.element.getBoundingClientRect(), b = g.getBoundingClientRect();
            let R;
            if (c) {
              const v = n === "horizontal" ? new DOMRect(
                y.right,
                y.top,
                0,
                y.height
              ) : new DOMRect(
                y.left,
                y.bottom,
                y.width,
                0
              ), p = n === "horizontal" ? new DOMRect(b.left, b.top, 0, b.height) : new DOMRect(b.left, b.top, b.width, 0);
              switch (m.length) {
                case 0: {
                  R = [
                    v,
                    p
                  ];
                  break;
                }
                case 1: {
                  const x = m[0], T = os({
                    orientation: n,
                    rects: [y, b],
                    targetRect: x.element.getBoundingClientRect()
                  });
                  R = [
                    x,
                    T === y ? p : v
                  ];
                  break;
                }
                default: {
                  R = m;
                  break;
                }
              }
            } else
              m.length ? R = m : R = [
                n === "horizontal" ? new DOMRect(
                  y.right,
                  b.top,
                  b.left - y.right,
                  b.height
                ) : new DOMRect(
                  b.left,
                  y.bottom,
                  b.width,
                  b.top - y.bottom
                )
              ];
            for (const v of R) {
              let p = "width" in v ? v : v.element.getBoundingClientRect();
              const x = as() ? e.resizeTargetMinimumSize.coarse : e.resizeTargetMinimumSize.fine;
              if (p.width < x) {
                const M = x - p.width;
                p = new DOMRect(
                  p.x - M / 2,
                  p.y,
                  p.width + M,
                  p.height
                );
              }
              if (p.height < x) {
                const M = x - p.height;
                p = new DOMRect(
                  p.x,
                  p.y - M / 2,
                  p.width,
                  p.height + M
                );
              }
              const T = h <= l || h > d;
              !s && !T && i.push({
                group: e,
                groupSize: Oe({ group: e }),
                panels: [f, S],
                separator: "width" in v ? void 0 : v,
                rect: p
              }), s = !1;
            }
          }
          c = !1, f = S, m = [];
        }
      } else if (g.hasAttribute("data-separator")) {
        g.ariaDisabled !== null && (s = !0);
        const S = a.find(
          (y) => y.element === g
        );
        S ? m.push(S) : (f = void 0, m = []);
      } else
        c = !0;
  }
  return i;
}
var Se;
class xr {
  constructor() {
    pn(this, Se, {});
  }
  addListener(t, n) {
    const r = Je(this, Se)[t];
    return r === void 0 ? Je(this, Se)[t] = [n] : r.includes(n) || r.push(n), () => {
      this.removeListener(t, n);
    };
  }
  emit(t, n) {
    const r = Je(this, Se)[t];
    if (r !== void 0)
      if (r.length === 1)
        r[0].call(null, n);
      else {
        let a = !1, o = null;
        const i = Array.from(r);
        for (let s = 0; s < i.length; s++) {
          const c = i[s];
          try {
            c.call(null, n);
          } catch (l) {
            o === null && (a = !0, o = l);
          }
        }
        if (a)
          throw o;
      }
  }
  removeAllListeners() {
    hn(this, Se, {});
  }
  removeListener(t, n) {
    const r = Je(this, Se)[t];
    if (r !== void 0) {
      const a = r.indexOf(n);
      a >= 0 && r.splice(a, 1);
    }
  }
}
Se = new WeakMap();
let $e = {
  cursorFlags: 0,
  state: "inactive"
};
const tn = new xr();
function Me() {
  return $e;
}
function is(e) {
  return tn.addListener("change", e);
}
function ss(e) {
  const t = $e, n = { ...$e };
  n.cursorFlags = e, $e = n, tn.emit("change", {
    prev: t,
    next: n
  });
}
function Fe(e) {
  const t = $e;
  $e = e, tn.emit("change", {
    prev: t,
    next: e
  });
}
const cs = (e) => e, Mt = () => {
}, Pr = 1, Mr = 2, Er = 4, Ar = 8, Dn = 3, $n = 12;
let it;
function Fn() {
  return it === void 0 && (it = !1, typeof window < "u" && (window.navigator.userAgent.includes("Chrome") || window.navigator.userAgent.includes("Firefox")) && (it = !0)), it;
}
function ls({
  cursorFlags: e,
  groups: t,
  state: n
}) {
  let r = 0, a = 0;
  switch (n) {
    case "active":
    case "hover":
      t.forEach((o) => {
        if (!o.mutableState.disableCursor)
          switch (o.orientation) {
            case "horizontal": {
              r++;
              break;
            }
            case "vertical": {
              a++;
              break;
            }
          }
      });
  }
  if (!(r === 0 && a === 0)) {
    switch (n) {
      case "active": {
        if (e && Fn()) {
          const o = (e & Pr) !== 0, i = (e & Mr) !== 0, s = (e & Er) !== 0, c = (e & Ar) !== 0;
          if (o)
            return s ? "se-resize" : c ? "ne-resize" : "e-resize";
          if (i)
            return s ? "sw-resize" : c ? "nw-resize" : "w-resize";
          if (s)
            return "s-resize";
          if (c)
            return "n-resize";
        }
        break;
      }
    }
    return Fn() ? r > 0 && a > 0 ? "move" : r > 0 ? "ew-resize" : "ns-resize" : r > 0 && a > 0 ? "grab" : r > 0 ? "col-resize" : "row-resize";
  }
}
const On = /* @__PURE__ */ new WeakMap();
function nn(e) {
  if (e.defaultView === null || e.defaultView === void 0)
    return;
  let { prevStyle: t, styleSheet: n } = On.get(e) ?? {};
  n === void 0 && (n = new e.defaultView.CSSStyleSheet(), e.adoptedStyleSheets && (Object.isExtensible(e.adoptedStyleSheets) ? e.adoptedStyleSheets.push(n) : e.adoptedStyleSheets = [
    ...e.adoptedStyleSheets,
    n
  ]));
  const r = Me();
  switch (r.state) {
    case "active":
    case "hover": {
      const a = ls({
        cursorFlags: r.cursorFlags,
        groups: r.hitRegions.map((i) => i.group),
        state: r.state
      }), o = `*, *:hover {cursor: ${a} !important; }`;
      if (t === o)
        return;
      t = o, a ? n.cssRules.length === 0 ? n.insertRule(o) : n.replaceSync(o) : n.cssRules.length === 1 && n.deleteRule(0);
      break;
    }
    case "inactive": {
      t = void 0, n.cssRules.length === 1 && n.deleteRule(0);
      break;
    }
  }
  On.set(e, {
    prevStyle: t,
    styleSheet: n
  });
}
let pe = /* @__PURE__ */ new Map();
const Lr = new xr();
function us(e) {
  pe = new Map(pe), pe.delete(e);
}
function jn(e, t) {
  for (const [n] of pe)
    if (n.id === e)
      return n;
}
function Re(e, t) {
  for (const [n, r] of pe)
    if (n.id === e)
      return r;
  if (t)
    throw Error(`Could not find data for Group with id ${e}`);
}
function ke() {
  return pe;
}
function rn(e, t) {
  return Lr.addListener("groupChange", (n) => {
    n.group.id === e && t(n);
  });
}
function we(e, t, n) {
  const r = pe.get(e);
  pe = new Map(pe), pe.set(e, t), Lr.emit("groupChange", {
    group: e,
    isUserInteraction: (n == null ? void 0 : n.isUserInteraction) === !0,
    prev: r,
    next: t
  });
}
function kr(e) {
  const t = Me();
  let n = !1;
  switch (t.state) {
    case "active":
      Fe({
        cursorFlags: 0,
        state: "inactive"
      }), t.hitRegions.length > 0 && (nn(e), n = !0, t.hitRegions.forEach((r) => {
        const a = Re(r.group.id, !0);
        we(r.group, a, {
          isUserInteraction: !0
        });
      }));
  }
  return n;
}
function Bn(e) {
  e.defaultPrevented || kr(e.currentTarget);
}
function ds(e, t, n) {
  let r, a = {
    x: 1 / 0,
    y: 1 / 0
  };
  for (const o of t) {
    const i = Rr(n, o.rect);
    switch (e) {
      case "horizontal": {
        i.x <= a.x && (r = o, a = i);
        break;
      }
      case "vertical": {
        i.y <= a.y && (r = o, a = i);
        break;
      }
    }
  }
  return r ? {
    distance: a,
    hitRegion: r
  } : void 0;
}
function fs(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
function ms(e, t) {
  if (e === t) throw new Error("Cannot compare node with itself");
  const n = {
    a: Hn(e),
    b: Hn(t)
  };
  let r;
  for (; n.a.at(-1) === n.b.at(-1); )
    r = n.a.pop(), n.b.pop();
  V(
    r,
    "Stacking order can only be calculated for elements with a common ancestor"
  );
  const a = {
    a: Wn(Un(n.a)),
    b: Wn(Un(n.b))
  };
  if (a.a === a.b) {
    const o = r.childNodes, i = {
      a: n.a.at(-1),
      b: n.b.at(-1)
    };
    let s = o.length;
    for (; s--; ) {
      const c = o[s];
      if (c === i.a) return 1;
      if (c === i.b) return -1;
    }
  }
  return Math.sign(a.a - a.b);
}
const ps = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;
function hs(e) {
  const t = getComputedStyle(Nr(e) ?? e).display;
  return t === "flex" || t === "inline-flex";
}
function gs(e) {
  const t = getComputedStyle(e);
  return !!(t.position === "fixed" || t.zIndex !== "auto" && (t.position !== "static" || hs(e)) || +t.opacity < 1 || "transform" in t && t.transform !== "none" || "webkitTransform" in t && t.webkitTransform !== "none" || "mixBlendMode" in t && t.mixBlendMode !== "normal" || "filter" in t && t.filter !== "none" || "webkitFilter" in t && t.webkitFilter !== "none" || "isolation" in t && t.isolation === "isolate" || ps.test(t.willChange) || t.webkitOverflowScrolling === "touch");
}
function Un(e) {
  let t = e.length;
  for (; t--; ) {
    const n = e[t];
    if (V(n, "Missing node"), gs(n)) return n;
  }
  return null;
}
function Wn(e) {
  return e && Number(getComputedStyle(e).zIndex) || 0;
}
function Hn(e) {
  const t = [];
  for (; e; )
    t.push(e), e = Nr(e);
  return t;
}
function Nr(e) {
  const { parentNode: t } = e;
  return fs(t) ? t.host : t;
}
function bs(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function ys({
  groupElement: e,
  hitRegion: t,
  pointerEventTarget: n
}) {
  if (!Ir(n) || n.contains(e) || e.contains(n))
    return !0;
  if (ms(n, e) > 0) {
    let r = n;
    for (; r; ) {
      if (r.contains(e))
        return !0;
      if (bs(r.getBoundingClientRect(), t))
        return !1;
      r = r.parentElement;
    }
  }
  return !0;
}
function on(e, t) {
  const n = [];
  return t.forEach((r, a) => {
    if (a.disabled)
      return;
    const o = Tr(a), i = ds(a.orientation, o, {
      x: e.clientX,
      y: e.clientY
    });
    i && i.distance.x <= 0 && i.distance.y <= 0 && ys({
      groupElement: a.element,
      hitRegion: i.hitRegion.rect,
      pointerEventTarget: e.target
    }) && n.push(i.hitRegion);
  }), n;
}
function vs(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n] != t[n])
      return !1;
  return !0;
}
function ae(e, t, n = 0) {
  return Math.abs(se(e) - se(t)) <= n;
}
function me(e, t) {
  return ae(e, t) ? 0 : e > t ? 1 : -1;
}
function De({
  overrideDisabledPanels: e,
  panelConstraints: t,
  prevSize: n,
  size: r
}) {
  const {
    collapsedSize: a = 0,
    collapsible: o,
    disabled: i,
    maxSize: s = 100,
    minSize: c = 0
  } = t;
  if (i && !e)
    return n;
  if (me(r, c) < 0)
    if (o) {
      const l = (a + c) / 2;
      me(r, l) < 0 ? r = a : r = c;
    } else
      r = c;
  return r = Math.min(s, r), r = se(r), r;
}
function tt({
  delta: e,
  initialLayout: t,
  panelConstraints: n,
  pivotIndices: r,
  prevLayout: a,
  trigger: o
}) {
  if (ae(e, 0))
    return t;
  const i = o === "imperative-api", s = Object.values(t), c = Object.values(a), l = [...s], [d, u] = r;
  V(d != null, "Invalid first pivot index"), V(u != null, "Invalid second pivot index");
  let f = 0;
  switch (o) {
    case "keyboard": {
      {
        const g = e < 0 ? u : d, S = n[g];
        V(
          S,
          `Panel constraints not found for index ${g}`
        );
        const {
          collapsedSize: y = 0,
          collapsible: b,
          minSize: R = 0
        } = S;
        if (b) {
          const v = s[g];
          if (V(
            v != null,
            `Previous layout not found for panel index ${g}`
          ), ae(v, y)) {
            const p = R - v;
            me(p, Math.abs(e)) > 0 && (e = e < 0 ? 0 - p : p);
          }
        }
      }
      {
        const g = e < 0 ? d : u, S = n[g];
        V(
          S,
          `No panel constraints found for index ${g}`
        );
        const {
          collapsedSize: y = 0,
          collapsible: b,
          minSize: R = 0
        } = S;
        if (b) {
          const v = s[g];
          if (V(
            v != null,
            `Previous layout not found for panel index ${g}`
          ), ae(v, R)) {
            const p = v - y;
            me(p, Math.abs(e)) > 0 && (e = e < 0 ? 0 - p : p);
          }
        }
      }
      break;
    }
    default: {
      const g = e < 0 ? u : d, S = n[g];
      V(
        S,
        `Panel constraints not found for index ${g}`
      );
      const y = s[g], { collapsible: b, collapsedSize: R, minSize: v } = S;
      if (b && me(y, v) < 0)
        if (e > 0) {
          const p = v - R, x = p / 2, T = y + e;
          me(T, v) < 0 && (e = me(e, x) <= 0 ? 0 : p);
        } else {
          const p = v - R, x = 100 - p / 2, T = y - e;
          me(T, v) < 0 && (e = me(100 + e, x) > 0 ? 0 : -p);
        }
      break;
    }
  }
  {
    const g = e < 0 ? 1 : -1;
    let S = e < 0 ? u : d, y = 0;
    for (; ; ) {
      const R = s[S];
      V(
        R != null,
        `Previous layout not found for panel index ${S}`
      );
      const v = De({
        overrideDisabledPanels: i,
        panelConstraints: n[S],
        prevSize: R,
        size: 100
      }) - R;
      if (y += v, S += g, S < 0 || S >= n.length)
        break;
    }
    const b = Math.min(Math.abs(e), Math.abs(y));
    e = e < 0 ? 0 - b : b;
  }
  {
    let g = e < 0 ? d : u;
    for (; g >= 0 && g < n.length; ) {
      const S = Math.abs(e) - Math.abs(f), y = s[g];
      V(
        y != null,
        `Previous layout not found for panel index ${g}`
      );
      const b = y - S, R = De({
        overrideDisabledPanels: i,
        panelConstraints: n[g],
        prevSize: y,
        size: b
      });
      if (!ae(y, R) && (f += y - R, l[g] = R, f.toFixed(3).localeCompare(Math.abs(e).toFixed(3), void 0, {
        numeric: !0
      }) >= 0))
        break;
      e < 0 ? g-- : g++;
    }
  }
  if (vs(c, l))
    return a;
  {
    const g = e < 0 ? u : d, S = s[g];
    V(
      S != null,
      `Previous layout not found for panel index ${g}`
    );
    const y = S + f, b = De({
      overrideDisabledPanels: i,
      panelConstraints: n[g],
      prevSize: S,
      size: y
    });
    if (l[g] = b, !ae(b, y)) {
      let R = y - b, v = e < 0 ? u : d;
      for (; v >= 0 && v < n.length; ) {
        const p = l[v];
        V(
          p != null,
          `Previous layout not found for panel index ${v}`
        );
        const x = p + R, T = De({
          overrideDisabledPanels: i,
          panelConstraints: n[v],
          prevSize: p,
          size: x
        });
        if (ae(p, T) || (R -= T - p, l[v] = T), ae(R, 0))
          break;
        e > 0 ? v-- : v++;
      }
    }
  }
  const m = Object.values(l).reduce(
    (g, S) => S + g,
    0
  );
  if (!ae(m, 100, 0.1))
    return a;
  const h = Object.keys(a);
  return l.reduce((g, S, y) => (g[h[y]] = S, g), {});
}
function Ee(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (t[n] === void 0 || me(e[n], t[n]) !== 0)
      return !1;
  return !0;
}
function Ae({
  layout: e,
  panelConstraints: t
}) {
  const n = Object.values(e), r = [...n], a = r.reduce(
    (s, c) => s + c,
    0
  );
  if (r.length !== t.length)
    throw Error(
      `Invalid ${t.length} panel layout: ${r.map((s) => `${s}%`).join(", ")}`
    );
  if (!ae(a, 100) && r.length > 0)
    for (let s = 0; s < t.length; s++) {
      const c = r[s];
      V(c != null, `No layout data found for index ${s}`);
      const l = 100 / a * c;
      r[s] = l;
    }
  let o = 0;
  for (let s = 0; s < t.length; s++) {
    const c = n[s];
    V(c != null, `No layout data found for index ${s}`);
    const l = r[s];
    V(l != null, `No layout data found for index ${s}`);
    const d = De({
      overrideDisabledPanels: !0,
      panelConstraints: t[s],
      prevSize: c,
      size: l
    });
    l != d && (o += l - d, r[s] = d);
  }
  if (!ae(o, 0))
    for (let s = 0; s < t.length; s++) {
      const c = r[s];
      V(c != null, `No layout data found for index ${s}`);
      const l = c + o, d = De({
        overrideDisabledPanels: !0,
        panelConstraints: t[s],
        prevSize: c,
        size: l
      });
      if (c !== d && (o -= d - c, r[s] = d, ae(o, 0)))
        break;
    }
  const i = Object.keys(e);
  return r.reduce((s, c, l) => (s[i[l]] = c, s), {});
}
function zr({
  groupId: e,
  panelId: t
}) {
  const n = () => {
    const c = ke();
    for (const [
      l,
      {
        defaultLayoutDeferred: d,
        derivedPanelConstraints: u,
        layout: f,
        groupSize: m,
        separatorToPanels: h
      }
    ] of c)
      if (l.id === e)
        return {
          defaultLayoutDeferred: d,
          derivedPanelConstraints: u,
          group: l,
          groupSize: m,
          layout: f,
          separatorToPanels: h
        };
    throw Error(`Group ${e} not found`);
  }, r = () => {
    const c = n().derivedPanelConstraints.find(
      (l) => l.panelId === t
    );
    if (c !== void 0)
      return c;
    throw Error(`Panel constraints not found for Panel ${t}`);
  }, a = () => {
    const c = n().group.panels.find((l) => l.id === t);
    if (c !== void 0)
      return c;
    throw Error(`Layout not found for Panel ${t}`);
  }, o = () => {
    const c = n().layout[t];
    if (c !== void 0)
      return c;
    throw Error(`Layout not found for Panel ${t}`);
  }, i = ({
    nextSize: c,
    panels: l,
    prevLayout: d,
    derivedPanelConstraints: u
  }) => {
    const f = o(), m = l.findIndex((S) => S.id === t), h = m === 0, g = m === l.length - 1;
    if (g && c < f && (h || l.slice(0, m).every((S, y) => {
      const b = u[y];
      return (b == null ? void 0 : b.collapsible) && ae(b.collapsedSize, d[b.panelId]);
    }))) {
      const S = l.slice(0, m).reduce((y, b) => y + d[b.id], 0);
      return {
        ...d,
        [t]: se(100 - S)
      };
    }
    return tt({
      delta: g ? f - c : c - f,
      initialLayout: d,
      panelConstraints: u,
      pivotIndices: g ? [m - 1, m] : [m, m + 1],
      prevLayout: d,
      trigger: "imperative-api"
    });
  }, s = (c) => {
    const l = o();
    if (c === l)
      return;
    const {
      defaultLayoutDeferred: d,
      derivedPanelConstraints: u,
      group: f,
      groupSize: m,
      layout: h,
      separatorToPanels: g
    } = n(), S = i({
      nextSize: c,
      panels: f.panels,
      prevLayout: h,
      derivedPanelConstraints: u
    }), y = Ae({
      layout: S,
      panelConstraints: u
    });
    Ee(h, y) || we(f, {
      defaultLayoutDeferred: d,
      derivedPanelConstraints: u,
      groupSize: m,
      layout: y,
      separatorToPanels: g
    });
  };
  return {
    collapse: () => {
      const { collapsible: c, collapsedSize: l } = r(), { mutableValues: d } = a(), u = o();
      c && u !== l && (d.expandToSize = u, s(l));
    },
    expand: () => {
      const { collapsible: c, collapsedSize: l, minSize: d } = r(), { mutableValues: u } = a(), f = o();
      if (c && f === l) {
        let m = u.expandToSize ?? d;
        m === 0 && (m = 1), s(m);
      }
    },
    getSize: () => {
      const { group: c } = n(), l = o(), { element: d } = a(), u = c.orientation === "horizontal" ? d.offsetWidth : d.offsetHeight;
      return {
        asPercentage: l,
        inPixels: u
      };
    },
    isCollapsed: () => {
      const { collapsible: c, collapsedSize: l } = r(), d = o();
      return c && ae(l, d);
    },
    resize: (c) => {
      const { group: l } = n(), { element: d } = a(), u = Oe({ group: l }), f = qe({
        groupSize: u,
        panelElement: d,
        styleProp: c
      }), m = se(f / u * 100);
      s(m);
    }
  };
}
function Jn(e) {
  if (e.defaultPrevented)
    return;
  const t = ke();
  on(e, t).forEach((n) => {
    if (n.separator && !n.separator.disableDoubleClick) {
      const r = n.panels.find(
        (a) => a.panelConstraints.defaultSize !== void 0
      );
      if (r) {
        const a = r.panelConstraints.defaultSize, o = zr({
          groupId: n.group.id,
          panelId: r.id
        });
        o && a !== void 0 && (o.resize(a), e.preventDefault());
      }
    }
  });
}
function ut(e) {
  const t = ke();
  for (const [n] of t)
    if (n.separators.some(
      (r) => r.element === e
    ))
      return n;
  throw Error("Could not find parent Group for separator element");
}
function Cr({
  groupId: e
}) {
  const t = () => {
    const n = ke();
    for (const [r, a] of n)
      if (r.id === e)
        return { group: r, ...a };
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
        derivedPanelConstraints: a,
        group: o,
        groupSize: i,
        layout: s,
        separatorToPanels: c
      } = t(), l = Ae({
        layout: n,
        panelConstraints: a
      });
      return r ? s : (Ee(s, l) || we(o, {
        defaultLayoutDeferred: r,
        derivedPanelConstraints: a,
        groupSize: i,
        layout: l,
        separatorToPanels: c
      }), l);
    }
  };
}
function xe(e, t) {
  const n = ut(e), r = Re(n.id, !0), a = n.separators.find(
    (d) => d.element === e
  );
  V(a, "Matching separator not found");
  const o = r.separatorToPanels.get(a);
  V(o, "Matching panels not found");
  const i = o.map((d) => n.panels.indexOf(d)), s = Cr({ groupId: n.id }).getLayout(), c = tt({
    delta: t,
    initialLayout: s,
    panelConstraints: r.derivedPanelConstraints,
    pivotIndices: i,
    prevLayout: s,
    trigger: "keyboard"
  }), l = Ae({
    layout: c,
    panelConstraints: r.derivedPanelConstraints
  });
  Ee(s, l) || we(
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
function Kn(e) {
  if (e.defaultPrevented)
    return;
  const t = e.currentTarget, n = ut(t);
  if (!n.disabled)
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault(), n.orientation === "vertical" && xe(t, 5);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault(), n.orientation === "horizontal" && xe(t, -5);
        break;
      }
      case "ArrowRight": {
        e.preventDefault(), n.orientation === "horizontal" && xe(t, 5);
        break;
      }
      case "ArrowUp": {
        e.preventDefault(), n.orientation === "vertical" && xe(t, -5);
        break;
      }
      case "End": {
        e.preventDefault(), xe(t, 100);
        break;
      }
      case "Enter": {
        e.preventDefault();
        const r = ut(t), a = Re(r.id, !0), { derivedPanelConstraints: o, layout: i, separatorToPanels: s } = a, c = r.separators.find(
          (f) => f.element === t
        );
        V(c, "Matching separator not found");
        const l = s.get(c);
        V(l, "Matching panels not found");
        const d = l[0], u = o.find(
          (f) => f.panelId === d.id
        );
        if (V(u, "Panel metadata not found"), u.collapsible) {
          const f = i[d.id], m = u.collapsedSize === f ? r.mutableState.expandedPanelSizes[d.id] ?? u.minSize : u.collapsedSize;
          xe(t, m - f);
        }
        break;
      }
      case "F6": {
        e.preventDefault();
        const r = ut(t).separators.map(
          (i) => i.element
        ), a = Array.from(r).findIndex(
          (i) => i === e.currentTarget
        );
        V(a !== null, "Index not found");
        const o = e.shiftKey ? a > 0 ? a - 1 : r.length - 1 : a + 1 < r.length ? a + 1 : 0;
        r[o].focus({
          preventScroll: !0
        });
        break;
      }
      case "Home": {
        e.preventDefault(), xe(t, -100);
        break;
      }
    }
}
function qn(e) {
  if (e.defaultPrevented || e.pointerType === "mouse" && e.button > 0)
    return;
  const t = ke(), n = on(e, t), r = /* @__PURE__ */ new Map();
  let a = !1;
  n.forEach((o) => {
    o.separator && (a || (a = !0, o.separator.element.focus({
      // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#browser_compatibility
      focusVisible: !1,
      preventScroll: !0
    })));
    const i = t.get(o.group);
    i && r.set(o.group, i.layout);
  }), Fe({
    cursorFlags: 0,
    hitRegions: n,
    initialLayoutMap: r,
    pointerDownAtPoint: { x: e.clientX, y: e.clientY },
    state: "active"
  }), n.length && e.preventDefault();
}
function _r({
  document: e,
  event: t,
  hitRegions: n,
  initialLayoutMap: r,
  mountedGroups: a,
  pointerDownAtPoint: o,
  prevCursorFlags: i
}) {
  let s = 0;
  n.forEach((l) => {
    const { group: d, groupSize: u } = l, { orientation: f, panels: m } = d, { disableCursor: h } = d.mutableState;
    let g = 0;
    o ? f === "horizontal" ? g = (t.clientX - o.x) / u * 100 : g = (t.clientY - o.y) / u * 100 : f === "horizontal" ? g = t.clientX < 0 ? -100 : 100 : g = t.clientY < 0 ? -100 : 100;
    const S = r.get(d), y = a.get(d);
    if (!S || !y)
      return;
    const {
      defaultLayoutDeferred: b,
      derivedPanelConstraints: R,
      groupSize: v,
      layout: p,
      separatorToPanels: x
    } = y;
    if (R && p && x) {
      const T = tt({
        delta: g,
        initialLayout: S,
        panelConstraints: R,
        pivotIndices: l.panels.map((M) => m.indexOf(M)),
        prevLayout: p,
        trigger: "mouse-or-touch"
      });
      if (Ee(T, p)) {
        if (g !== 0 && !h)
          switch (f) {
            case "horizontal": {
              s |= g < 0 ? Pr : Mr;
              break;
            }
            case "vertical": {
              s |= g < 0 ? Er : Ar;
              break;
            }
          }
      } else
        we(l.group, {
          defaultLayoutDeferred: b,
          derivedPanelConstraints: R,
          groupSize: v,
          layout: T,
          separatorToPanels: x
        });
    }
  });
  let c = 0;
  t.movementX === 0 ? c |= i & Dn : c |= s & Dn, t.movementY === 0 ? c |= i & $n : c |= s & $n, ss(c), nn(e);
}
function Vn(e) {
  const t = ke(), n = Me();
  switch (n.state) {
    case "active":
      _r({
        document: e.currentTarget,
        event: e,
        hitRegions: n.hitRegions,
        initialLayoutMap: n.initialLayoutMap,
        mountedGroups: t,
        prevCursorFlags: n.cursorFlags
      });
  }
}
function Gn(e) {
  var r, a;
  if (e.defaultPrevented)
    return;
  const t = Me(), n = ke();
  switch (t.state) {
    case "active": {
      if (
        // Skip this check for "pointerleave" events, else Firefox triggers a false positive (see #514)
        e.buttons === 0
      ) {
        Fe({
          cursorFlags: 0,
          state: "inactive"
        }), t.hitRegions.forEach((o) => {
          const i = Re(o.group.id, !0);
          we(o.group, i, {
            isUserInteraction: !0
          });
        });
        return;
      }
      for (const o of t.hitRegions)
        if (o.separator) {
          const { element: i } = o.separator;
          (r = i.hasPointerCapture) != null && r.call(i, e.pointerId) || ((a = i.setPointerCapture) == null || a.call(i, e.pointerId));
        }
      _r({
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
      const o = on(e, n);
      o.length === 0 ? t.state !== "inactive" && Fe({
        cursorFlags: 0,
        state: "inactive"
      }) : Fe({
        cursorFlags: 0,
        hitRegions: o,
        state: "hover"
      }), nn(e.currentTarget);
      break;
    }
  }
}
function Yn(e) {
  if (e.relatedTarget instanceof HTMLIFrameElement)
    switch (Me().state) {
      case "hover":
        Fe({
          cursorFlags: 0,
          state: "inactive"
        });
    }
}
function Xn(e) {
  e.defaultPrevented || e.pointerType === "mouse" && e.button > 0 || kr(e.currentTarget) && e.preventDefault();
}
function Zn(e) {
  let t = 0, n = 0;
  const r = {};
  for (const o of e)
    if (o.defaultSize !== void 0) {
      t++;
      const i = se(o.defaultSize);
      n += i, r[o.panelId] = i;
    } else
      r[o.panelId] = void 0;
  const a = e.length - t;
  if (a !== 0) {
    const o = se((100 - n) / a);
    for (const i of e)
      i.defaultSize === void 0 && (r[i.panelId] = o);
  }
  return r;
}
function ws(e, t, n) {
  if (!n[0])
    return;
  const r = e.panels.find((c) => c.element === t);
  if (!r || !r.onResize)
    return;
  const a = Oe({ group: e }), o = e.orientation === "horizontal" ? r.element.offsetWidth : r.element.offsetHeight, i = r.mutableValues.prevSize, s = {
    asPercentage: se(o / a * 100),
    inPixels: o
  };
  r.mutableValues.prevSize = s, r.onResize(s, r.id, i);
}
function Ss(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return !1;
  for (const n in e)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
function Is({
  group: e,
  nextGroupSize: t,
  prevGroupSize: n,
  prevLayout: r
}) {
  if (n <= 0 || t <= 0 || n === t)
    return r;
  let a = 0, o = 0, i = !1;
  const s = /* @__PURE__ */ new Map(), c = [];
  for (const u of e.panels) {
    const f = r[u.id] ?? 0;
    switch (u.panelConstraints.groupResizeBehavior) {
      case "preserve-pixel-size": {
        i = !0;
        const m = f / 100 * n, h = se(
          m / t * 100
        );
        s.set(u.id, h), a += h;
        break;
      }
      case "preserve-relative-size":
      default: {
        c.push(u.id), o += f;
        break;
      }
    }
  }
  if (!i || c.length === 0)
    return r;
  const l = 100 - a, d = { ...r };
  if (s.forEach((u, f) => {
    d[f] = u;
  }), o > 0)
    for (const u of c) {
      const f = r[u] ?? 0;
      d[u] = se(
        f / o * l
      );
    }
  else {
    const u = se(
      l / c.length
    );
    for (const f of c)
      d[f] = u;
  }
  return d;
}
function Rs(e, t) {
  const n = e.map((a) => a.id), r = Object.keys(t);
  if (n.length !== r.length)
    return !1;
  for (const a of n)
    if (!r.includes(a))
      return !1;
  return !0;
}
const Ce = /* @__PURE__ */ new Map();
function Ts(e) {
  let t = !0;
  V(
    e.element.ownerDocument.defaultView,
    "Cannot register an unmounted Group"
  );
  const n = e.element.ownerDocument.defaultView.ResizeObserver, r = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = new n((h) => {
    for (const g of h) {
      const { borderBoxSize: S, target: y } = g;
      if (y === e.element) {
        if (t) {
          const b = Oe({ group: e });
          if (b === 0)
            return;
          const R = Re(e.id);
          if (!R)
            return;
          const v = Ot(e), p = R.defaultLayoutDeferred ? Zn(v) : R.layout, x = Is({
            group: e,
            nextGroupSize: b,
            prevGroupSize: R.groupSize,
            prevLayout: p
          }), T = Ae({
            layout: x,
            panelConstraints: v
          });
          if (!R.defaultLayoutDeferred && Ee(R.layout, T) && Ss(
            R.derivedPanelConstraints,
            v
          ) && R.groupSize === b)
            return;
          we(e, {
            defaultLayoutDeferred: !1,
            derivedPanelConstraints: v,
            groupSize: b,
            layout: T,
            separatorToPanels: R.separatorToPanels
          });
        }
      } else
        ws(e, y, S);
    }
  });
  o.observe(e.element), e.panels.forEach((h) => {
    V(
      !r.has(h.id),
      `Panel ids must be unique; id "${h.id}" was used more than once`
    ), r.add(h.id), h.onResize && o.observe(h.element);
  });
  const i = Oe({ group: e }), s = Ot(e), c = e.panels.map(({ id: h }) => h).join(",");
  let l = e.mutableState.defaultLayout;
  l && (Rs(e.panels, l) || (l = void 0));
  const d = e.mutableState.layouts[c] ?? l ?? Zn(s), u = Ae({
    layout: d,
    panelConstraints: s
  }), f = e.element.ownerDocument;
  Ce.set(
    f,
    (Ce.get(f) ?? 0) + 1
  );
  const m = /* @__PURE__ */ new Map();
  return Tr(e).forEach((h) => {
    h.separator && m.set(h.separator, h.panels);
  }), we(e, {
    defaultLayoutDeferred: i === 0,
    derivedPanelConstraints: s,
    groupSize: i,
    layout: u,
    separatorToPanels: m
  }), e.separators.forEach((h) => {
    V(
      !a.has(h.id),
      `Separator ids must be unique; id "${h.id}" was used more than once`
    ), a.add(h.id), h.element.addEventListener("keydown", Kn);
  }), Ce.get(f) === 1 && (f.addEventListener("contextmenu", Bn, !0), f.addEventListener("dblclick", Jn, !0), f.addEventListener("pointerdown", qn, !0), f.addEventListener("pointerleave", Vn), f.addEventListener("pointermove", Gn), f.addEventListener("pointerout", Yn), f.addEventListener("pointerup", Xn, !0)), function() {
    t = !1, Ce.set(
      f,
      Math.max(0, (Ce.get(f) ?? 0) - 1)
    ), us(e), e.separators.forEach((h) => {
      h.element.removeEventListener("keydown", Kn);
    }), Ce.get(f) || (f.removeEventListener(
      "contextmenu",
      Bn,
      !0
    ), f.removeEventListener(
      "dblclick",
      Jn,
      !0
    ), f.removeEventListener(
      "pointerdown",
      qn,
      !0
    ), f.removeEventListener("pointerleave", Vn), f.removeEventListener("pointermove", Gn), f.removeEventListener("pointerout", Yn), f.removeEventListener("pointerup", Xn, !0)), o.disconnect();
  };
}
function xs() {
  const [e, t] = z({}), n = _(() => t({}), []);
  return [e, n];
}
function an(e) {
  const t = Jt();
  return `${e ?? t}`;
}
const Ne = typeof window < "u" ? Le : B;
function Ye(e) {
  const t = N(e);
  return Ne(() => {
    t.current = e;
  }, [e]), _(
    (...n) => {
      var r;
      return (r = t.current) == null ? void 0 : r.call(t, ...n);
    },
    [t]
  );
}
function sn(...e) {
  return Ye((t) => {
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
function cn(e) {
  const t = N({ ...e });
  return Ne(() => {
    for (const n in e)
      t.current[n] = e[n];
  }, [e]), t.current;
}
const Dr = Hr(null);
function Ps(e, t) {
  const n = N({
    getLayout: () => ({}),
    setLayout: cs
  });
  Ht(t, () => n.current, []), Ne(() => {
    Object.assign(
      n.current,
      Cr({ groupId: e })
    );
  });
}
function $r({
  children: e,
  className: t,
  defaultLayout: n,
  disableCursor: r,
  disabled: a,
  elementRef: o,
  groupRef: i,
  id: s,
  onLayoutChange: c,
  onLayoutChanged: l,
  orientation: d = "horizontal",
  resizeTargetMinimumSize: u = {
    coarse: 20,
    fine: 10
  },
  style: f,
  ...m
}) {
  const h = N({
    onLayoutChange: {},
    onLayoutChanged: {}
  }), g = Ye((P) => {
    Ee(h.current.onLayoutChange, P) || (h.current.onLayoutChange = P, c == null || c(P));
  }), S = Ye(
    (P, I) => {
      Ee(h.current.onLayoutChanged, P) || (h.current.onLayoutChanged = P, l == null || l(P, { isUserInteraction: I }));
    }
  ), y = an(s), b = N(null), [R, v] = xs(), p = N({
    lastExpandedPanelSizes: {},
    layouts: {},
    panels: [],
    resizeTargetMinimumSize: u,
    separators: []
  }), x = sn(b, o);
  Ps(y, i);
  const T = Ye(
    (P, I) => {
      const L = Me(), C = jn(P), D = Re(P);
      if (D) {
        let U = !1;
        switch (L.state) {
          case "active": {
            U = L.hitRegions.some(
              (k) => k.group === C
            );
            break;
          }
        }
        return {
          flexGrow: D.layout[I] ?? 1,
          pointerEvents: U ? "none" : void 0
        };
      }
      if (n != null && n[I])
        return {
          flexGrow: n == null ? void 0 : n[I]
        };
    }
  ), M = cn({
    defaultLayout: n,
    disableCursor: r
  }), E = Y(
    () => ({
      get disableCursor() {
        return !!M.disableCursor;
      },
      getPanelStyles: T,
      id: y,
      orientation: d,
      registerPanel: (P) => {
        const I = p.current;
        return I.panels = jt(d, [
          ...I.panels,
          P
        ]), v(), () => {
          I.panels = I.panels.filter(
            (L) => L !== P
          ), v();
        };
      },
      registerSeparator: (P) => {
        const I = p.current;
        return I.separators = jt(d, [
          ...I.separators,
          P
        ]), v(), () => {
          I.separators = I.separators.filter(
            (L) => L !== P
          ), v();
        };
      },
      updatePanelProps: (P, { disabled: I }) => {
        const L = p.current.panels.find(
          (U) => U.id === P
        );
        L && (L.panelConstraints.disabled = I);
        const C = jn(y), D = Re(y);
        C && D && we(C, {
          ...D,
          derivedPanelConstraints: Ot(C)
        });
      },
      updateSeparatorProps: (P, {
        disabled: I,
        disableDoubleClick: L
      }) => {
        const C = p.current.separators.find(
          (D) => D.id === P
        );
        C && (C.disabled = I, C.disableDoubleClick = L);
      }
    }),
    [T, y, v, d, M]
  ), A = N(null);
  return Ne(() => {
    const P = b.current;
    if (P === null)
      return;
    const I = p.current;
    let L;
    if (M.defaultLayout !== void 0 && Object.keys(M.defaultLayout).length === I.panels.length) {
      L = {};
      for (const H of I.panels) {
        const Q = M.defaultLayout[H.id];
        Q !== void 0 && (L[H.id] = Q);
      }
    }
    const C = {
      disabled: !!a,
      element: P,
      id: y,
      mutableState: {
        defaultLayout: L,
        disableCursor: !!M.disableCursor,
        expandedPanelSizes: p.current.lastExpandedPanelSizes,
        layouts: p.current.layouts
      },
      orientation: d,
      panels: I.panels,
      resizeTargetMinimumSize: I.resizeTargetMinimumSize,
      separators: I.separators
    };
    A.current = C;
    const D = Ts(C), { defaultLayoutDeferred: U, derivedPanelConstraints: k, layout: F } = Re(C.id, !0);
    !U && k.length > 0 && (g(F), S(F, !1));
    const W = rn(y, (H) => {
      const { defaultLayoutDeferred: Q, derivedPanelConstraints: X, layout: ie } = H.next;
      if (Q || X.length === 0)
        return;
      const j = C.panels.map(({ id: ee }) => ee).join(",");
      C.mutableState.layouts[j] = ie, X.forEach((ee) => {
        if (ee.collapsible) {
          const { layout: ce } = H.prev ?? {};
          if (ce) {
            const le = ae(
              ee.collapsedSize,
              ie[ee.panelId]
            ), K = ae(
              ee.collapsedSize,
              ce[ee.panelId]
            );
            le && !K && (C.mutableState.expandedPanelSizes[ee.panelId] = ce[ee.panelId]);
          }
        }
      });
      const re = Me().state !== "active";
      g(ie), re && S(ie, H.isUserInteraction);
    });
    return () => {
      A.current = null, D(), W();
    };
  }, [
    a,
    y,
    S,
    g,
    d,
    R,
    M
  ]), B(() => {
    const P = A.current;
    P && (P.mutableState.defaultLayout = n, P.mutableState.disableCursor = !!r);
  }), /* @__PURE__ */ w(Dr.Provider, { value: E, children: /* @__PURE__ */ w(
    "div",
    {
      ...m,
      className: t,
      "data-group": !0,
      "data-testid": y,
      id: y,
      ref: x,
      style: {
        height: "100%",
        width: "100%",
        overflow: "hidden",
        ...f,
        display: "flex",
        flexDirection: d === "horizontal" ? "row" : "column",
        flexWrap: "nowrap",
        // Inform the browser that the library is handling touch events for this element
        // but still allow users to scroll content within panels in the non-resizing direction
        // NOTE This is not an inherited style
        // See github.com/bvaughn/react-resizable-panels/issues/662
        touchAction: d === "horizontal" ? "pan-y" : "pan-x"
      },
      children: e
    }
  ) });
}
$r.displayName = "Group";
function ln() {
  const e = Jr(Dr);
  return V(
    e,
    "Group Context not found; did you render a Panel or Separator outside of a Group?"
  ), e;
}
function Ms(e, t) {
  const { id: n } = ln(), r = N({
    collapse: Mt,
    expand: Mt,
    getSize: () => ({
      asPercentage: 0,
      inPixels: 0
    }),
    isCollapsed: () => !1,
    resize: Mt
  });
  Ht(t, () => r.current, []), Ne(() => {
    Object.assign(
      r.current,
      zr({ groupId: n, panelId: e })
    );
  });
}
function Bt({
  children: e,
  className: t,
  collapsedSize: n = "0%",
  collapsible: r = !1,
  defaultSize: a,
  disabled: o,
  elementRef: i,
  groupResizeBehavior: s = "preserve-relative-size",
  id: c,
  maxSize: l = "100%",
  minSize: d = "0%",
  onResize: u,
  panelRef: f,
  style: m,
  ...h
}) {
  const g = !!c, S = an(c), y = cn({
    disabled: o
  }), b = N(null), R = sn(b, i), {
    getPanelStyles: v,
    id: p,
    orientation: x,
    registerPanel: T,
    updatePanelProps: M
  } = ln(), E = u !== null, A = Ye(
    (C, D, U) => {
      u == null || u(C, c, U);
    }
  );
  Ne(() => {
    const C = b.current;
    if (C !== null) {
      const D = {
        element: C,
        id: S,
        idIsStable: g,
        mutableValues: {
          expandToSize: void 0,
          prevSize: void 0
        },
        onResize: E ? A : void 0,
        panelConstraints: {
          groupResizeBehavior: s,
          collapsedSize: n,
          collapsible: r,
          defaultSize: a,
          disabled: y.disabled,
          maxSize: l,
          minSize: d
        }
      };
      return T(D);
    }
  }, [
    s,
    n,
    r,
    a,
    E,
    S,
    g,
    l,
    d,
    A,
    T,
    y
  ]), B(() => {
    M(S, { disabled: o });
  }, [o, S, M]), Ms(S, f);
  const P = () => {
    const C = v(p, S);
    if (C)
      return JSON.stringify(C);
  }, I = Wr(
    (C) => rn(p, C),
    P,
    P
  );
  let L;
  return I ? L = JSON.parse(I) : a !== void 0 ? L = {
    flexGrow: void 0,
    flexShrink: void 0,
    flexBasis: a
  } : L = { flexGrow: 1 }, /* @__PURE__ */ w(
    "div",
    {
      ...h,
      "data-disabled": o || void 0,
      "data-panel": !0,
      "data-testid": S,
      id: S,
      ref: R,
      style: {
        ...Es,
        display: "flex",
        flexBasis: 0,
        flexShrink: 1,
        overflow: "visible",
        ...L
      },
      children: /* @__PURE__ */ w(
        "div",
        {
          className: t,
          style: {
            maxHeight: "100%",
            maxWidth: "100%",
            flexGrow: 1,
            overflow: "auto",
            ...m,
            // Inform the browser that the library is handling touch events for this element
            // but still allow users to scroll content within panels in the non-resizing direction
            // NOTE This is not an inherited style
            // See github.com/bvaughn/react-resizable-panels/issues/662
            touchAction: x === "horizontal" ? "pan-y" : "pan-x"
          },
          children: e
        }
      )
    }
  );
}
Bt.displayName = "Panel";
const Es = {
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
function As({
  layout: e,
  panelConstraints: t,
  panelId: n,
  panelIndex: r
}) {
  let a, o;
  const i = e[n], s = t.find(
    (c) => c.panelId === n
  );
  if (s) {
    const c = s.maxSize, l = s.collapsible ? s.collapsedSize : s.minSize, d = [r, r + 1];
    o = Ae({
      layout: tt({
        delta: l - i,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: d,
        prevLayout: e
      }),
      panelConstraints: t
    })[n], a = Ae({
      layout: tt({
        delta: c - i,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: d,
        prevLayout: e
      }),
      panelConstraints: t
    })[n];
  }
  return {
    valueControls: n,
    valueMax: a,
    valueMin: o,
    valueNow: i
  };
}
function Fr({
  children: e,
  className: t,
  disabled: n,
  disableDoubleClick: r,
  elementRef: a,
  id: o,
  style: i,
  ...s
}) {
  const c = an(o), l = cn({
    disabled: n,
    disableDoubleClick: r
  }), [d, u] = z({}), [f, m] = z("inactive"), [h, g] = z(!1), S = N(null), y = sn(S, a), {
    disableCursor: b,
    id: R,
    orientation: v,
    registerSeparator: p,
    updateSeparatorProps: x
  } = ln(), T = v === "horizontal" ? "vertical" : "horizontal";
  Ne(() => {
    const A = S.current;
    if (A !== null) {
      const P = {
        disabled: l.disabled,
        disableDoubleClick: l.disableDoubleClick,
        element: A,
        id: c
      }, I = p(P), L = is(
        (D) => {
          m(
            D.next.state !== "inactive" && D.next.hitRegions.some(
              (U) => U.separator === P
            ) ? D.next.state : "inactive"
          );
        }
      ), C = rn(
        R,
        (D) => {
          const { derivedPanelConstraints: U, layout: k, separatorToPanels: F } = D.next, W = F.get(P);
          if (W) {
            const H = W[0], Q = W.indexOf(H);
            u(
              As({
                layout: k,
                panelConstraints: U,
                panelId: H.id,
                panelIndex: Q
              })
            );
          }
        }
      );
      return () => {
        L(), C(), I();
      };
    }
  }, [R, c, p, l]), B(() => {
    x(c, { disabled: n, disableDoubleClick: r });
  }, [n, r, c, x]);
  let M;
  n && !b && (M = "not-allowed");
  let E;
  if (n)
    E = "disabled";
  else
    switch (f) {
      case "active": {
        E = "active";
        break;
      }
      default:
        h ? E = "focus" : E = f;
    }
  return /* @__PURE__ */ w(
    "div",
    {
      ...s,
      "aria-controls": d.valueControls,
      "aria-disabled": n || void 0,
      "aria-orientation": T,
      "aria-valuemax": d.valueMax,
      "aria-valuemin": d.valueMin,
      "aria-valuenow": d.valueNow,
      children: e,
      className: t,
      "data-separator": E,
      "data-testid": c,
      id: c,
      onBlur: () => g(!1),
      onFocus: () => g(!0),
      ref: y,
      role: "separator",
      style: {
        flexBasis: "auto",
        cursor: M,
        ...i,
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
Fr.displayName = "Separator";
const un = "reader-document", nt = "reader-assistant", Or = "retainpdf.reader.ai-split-layout.v1", Ls = 30, ks = 65, Ns = {
  [un]: 50,
  [nt]: 50
};
function dn(e) {
  const t = Number(e == null ? void 0 : e[nt]), n = Number.isFinite(t) ? Math.min(ks, Math.max(Ls, t)) : 50;
  return {
    [un]: 100 - n,
    [nt]: n
  };
}
function zs() {
  try {
    const e = JSON.parse(localStorage.getItem(Or) || "null");
    return dn(e);
  } catch {
    return Ns;
  }
}
function Cs(e) {
  try {
    localStorage.setItem(Or, JSON.stringify(dn(e)));
  } catch {
  }
}
function Et(e, t) {
  const n = e == null ? void 0 : e.closest(".reader-react-root");
  if (!n) return;
  const r = dn(t);
  n.style.setProperty(
    "--reader-ai-split-width",
    `${r[nt]}vw`
  );
}
function _s() {
  const e = N(null), [t] = z(zs);
  Le(() => {
    const a = e.current;
    return Et(a, t), () => {
      var o;
      (o = a == null ? void 0 : a.closest(".reader-react-root")) == null || o.style.removeProperty("--reader-ai-split-width");
    };
  }, [t]);
  const n = _((a) => {
    Et(e.current, a);
  }, []), r = _((a, o) => {
    Et(e.current, a), o.isUserInteraction && Cs(a);
  }, []);
  return /* @__PURE__ */ $(
    $r,
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
        /* @__PURE__ */ w(
          Bt,
          {
            id: un,
            defaultSize: "50%",
            minSize: "35%",
            maxSize: "70%"
          }
        ),
        /* @__PURE__ */ w(
          Fr,
          {
            id: "reader-ai-split-separator",
            className: "reader-ai-split-separator",
            "aria-label": "调整文档与 AI 问答宽度",
            children: /* @__PURE__ */ w("span", { "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ w(
          Bt,
          {
            id: nt,
            defaultSize: "50%",
            minSize: "30%",
            maxSize: "65%"
          }
        )
      ]
    }
  );
}
function Ds({
  loading: e,
  failed: t,
  text: n,
  percent: r
}) {
  return !e && !t ? null : /* @__PURE__ */ $(tr, { children: [
    e ? /* @__PURE__ */ w("div", { className: "reader-boot-loading", "data-reader-boot-loading": "true", children: /* @__PURE__ */ $("div", { className: "reader-boot-loading-card", children: [
      /* @__PURE__ */ w("div", { className: "reader-boot-loading-text", children: n }),
      /* @__PURE__ */ w("div", { className: "reader-boot-loading-track", children: /* @__PURE__ */ w(
        "span",
        {
          className: "reader-boot-loading-bar",
          style: { width: `${Math.max(0, Math.min(100, r))}%` }
        }
      ) })
    ] }) }) : null,
    t ? /* @__PURE__ */ w("div", { className: "reader-react-error", role: "alert", children: n }) : null
  ] });
}
async function $s(e) {
  var a;
  const t = `${e || ""}`;
  if (!t) throw new Error("empty selection");
  try {
    if ((a = navigator.clipboard) != null && a.writeText) {
      await navigator.clipboard.writeText(t);
      return;
    }
  } catch {
  }
  const n = document.createElement("textarea");
  n.value = t, n.setAttribute("readonly", ""), n.style.position = "fixed", n.style.opacity = "0", document.body.appendChild(n), n.select();
  const r = document.execCommand("copy");
  if (n.remove(), !r) throw new Error("copy failed");
}
function Fs({
  selection: e,
  onDismiss: t,
  onAskAi: n
}) {
  const [r, a] = z(!1), o = e ? e.selectionType === "text" ? `${e.pane}:${e.page}:${e.quote}` : `${e.region.itemId}:${e.pane}` : "";
  if (B(() => a(!1), [o]), !e)
    return null;
  const i = typeof window < "u" ? window.innerWidth : 800, s = typeof window < "u" ? window.innerHeight : 600, c = e.rect.left + e.rect.width / 2, l = 120, d = Math.min(Math.max(16 + l, c), i - 16 - l), u = e.rect.top > 72, f = u ? Math.max(12, e.rect.top - 8) : Math.min(s - 12, e.rect.top + e.rect.height + 8), m = u ? "above" : "below", h = e.pane === "translated" ? "译文" : "原文", g = e.selectionType === "text" ? "text" : e.kind, S = e.selectionType === "text" ? e.quote : lr(e.region, e.pane), y = g === "formula" ? "公式" : g === "table" ? "表格" : g === "figure" ? "图片" : g === "text" ? "文字" : "区域", b = g === "formula" ? qo(S) : S, R = g === "formula" ? oo : g === "table" ? ao : g === "text" ? io : so;
  return /* @__PURE__ */ $(
    "div",
    {
      className: `reader-sel-pop reader-sel-pop--${m} reader-sel-pop--region`,
      style: { left: d, top: f },
      role: "toolbar",
      "aria-label": "选区操作",
      onPointerDown: (v) => {
        v.preventDefault();
      },
      children: [
        /* @__PURE__ */ $("div", { className: "reader-sel-pop-card reader-floating-surface", children: [
          /* @__PURE__ */ $("div", { className: "reader-sel-pop-context", children: [
            /* @__PURE__ */ w(R, { size: 15, strokeWidth: 2.1, "aria-hidden": !0 }),
            /* @__PURE__ */ w("span", { children: y }),
            /* @__PURE__ */ w("span", { className: "reader-sel-pop-context-divider", "aria-hidden": !0, children: "·" }),
            /* @__PURE__ */ w("span", { children: h }),
            /* @__PURE__ */ w("span", { className: "reader-sel-pop-context-divider", "aria-hidden": !0, children: "·" }),
            /* @__PURE__ */ $("span", { children: [
              e.page,
              " 页"
            ] })
          ] }),
          /* @__PURE__ */ $("div", { className: "reader-sel-pop-actions", children: [
            b ? /* @__PURE__ */ $(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--primary",
                onClick: async () => {
                  try {
                    await $s(b), a(!0), window.setTimeout(() => a(!1), 1400);
                  } catch (v) {
                    console.warn("[reader-selection] copy failed", v);
                  }
                },
                children: [
                  r ? /* @__PURE__ */ w(co, { size: 15, strokeWidth: 2.4, "aria-hidden": !0 }) : /* @__PURE__ */ w(lo, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ w("span", { children: r ? "已复制" : g === "formula" ? "复制 LaTeX" : "复制" })
                ]
              }
            ) : /* @__PURE__ */ w("span", { className: "reader-sel-pop-selection-hint", children: "已选择图片" }),
            n ? /* @__PURE__ */ $(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--secondary",
                onClick: () => n(e),
                children: [
                  /* @__PURE__ */ w(qt, { size: 15, strokeWidth: 2.2, "aria-hidden": !0 }),
                  /* @__PURE__ */ w("span", { children: "问 AI" })
                ]
              }
            ) : null,
            /* @__PURE__ */ w(
              "button",
              {
                type: "button",
                className: "reader-sel-pop-btn reader-sel-pop-btn--ghost",
                onClick: t,
                "aria-label": "取消选区",
                title: "取消",
                children: /* @__PURE__ */ w(Ze, { size: 15, strokeWidth: 2.5, "aria-hidden": !0 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ w("span", { className: "reader-sel-pop-caret", "aria-hidden": "true" })
      ]
    }
  );
}
const Os = [
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
function js(e) {
  if (!(e instanceof HTMLElement)) return !1;
  const t = e.tagName;
  return t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || e.isContentEditable ? !0 : !!e.closest("input, textarea, select, [contenteditable='true']");
}
function Bs() {
  const [e, t] = z(!1), n = Jt(), r = N(null);
  return B(() => {
    if (!e) return;
    const a = (i) => {
      const s = r.current;
      s && i.target instanceof Node && !s.contains(i.target) && t(!1);
    }, o = (i) => {
      i.key === "Escape" && (i.preventDefault(), t(!1));
    };
    return document.addEventListener("mousedown", a), window.addEventListener("keydown", o), () => {
      document.removeEventListener("mousedown", a), window.removeEventListener("keydown", o);
    };
  }, [e]), B(() => {
    const a = (o) => {
      if (o.defaultPrevented || o.metaKey || o.ctrlKey || o.altKey || js(o.target)) return;
      const i = o.key;
      if (i === "?" || i === "h" || i === "H" || i === "/") {
        if (i === "/" && !o.shiftKey)
          return;
        o.preventDefault(), t((s) => !s);
      }
    };
    return window.addEventListener("keydown", a), () => window.removeEventListener("keydown", a);
  }, []), /* @__PURE__ */ $("div", { className: "reader-react-shortcuts", ref: r, "data-reader-shortcuts": "", children: [
    /* @__PURE__ */ w(
      "button",
      {
        type: "button",
        className: `reader-react-hud-btn reader-react-shortcuts-btn${e ? " is-active" : ""}`,
        "aria-label": "快捷键说明",
        "aria-expanded": e,
        "aria-controls": n,
        title: "快捷键（H 或 ?）",
        onClick: () => t((a) => !a),
        children: /* @__PURE__ */ w(uo, { className: "reader-react-shortcuts-icon", size: 16, strokeWidth: 2.25, "aria-hidden": !0 })
      }
    ),
    e ? /* @__PURE__ */ $(
      "div",
      {
        id: n,
        className: "reader-react-shortcuts-panel reader-floating-surface",
        role: "dialog",
        "aria-label": "阅读器快捷键",
        children: [
          /* @__PURE__ */ $("div", { className: "reader-react-shortcuts-head", children: [
            /* @__PURE__ */ w("strong", { children: "快捷键" }),
            /* @__PURE__ */ w(
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
          /* @__PURE__ */ w("div", { className: "reader-react-shortcuts-body", children: Os.map((a) => /* @__PURE__ */ $("section", { className: "reader-react-shortcuts-group", children: [
            /* @__PURE__ */ w("h3", { children: a.title }),
            /* @__PURE__ */ w("ul", { children: a.items.map((o) => /* @__PURE__ */ $("li", { children: [
              /* @__PURE__ */ w("kbd", { children: o.keys }),
              /* @__PURE__ */ w("span", { children: o.desc })
            ] }, `${a.title}-${o.keys}`)) })
          ] }, a.title)) }),
          /* @__PURE__ */ w("p", { className: "reader-react-shortcuts-foot", children: "在输入框内不会触发快捷键" })
        ]
      }
    ) : null
  ] });
}
const Us = Object.freeze([
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
]), Ws = {
  favorites: fo,
  markdown: ar,
  ai: qt
}, jr = "retainpdf.reader.fab.pos.v1", yt = 52, _e = 12, Hs = 6, Js = ["source", "sideBySide", "translated"], Ks = {
  source: nr,
  sideBySide: rr,
  translated: or
}, qs = {
  source: "原文",
  sideBySide: "对照",
  translated: "译文"
}, Vs = Us.filter((e) => e.id === "favorites");
function Xe(e, t) {
  const n = Math.max(_e, window.innerWidth - yt - _e), r = Math.max(_e, window.innerHeight - yt - _e);
  return {
    x: Math.min(n, Math.max(_e, e)),
    y: Math.min(r, Math.max(_e, t))
  };
}
function Qn() {
  return typeof window > "u" ? { x: 24, y: 120 } : Xe(
    window.innerWidth - yt - 20,
    window.innerHeight - yt - 88
  );
}
function Gs() {
  try {
    const e = localStorage.getItem(jr);
    if (!e) return Qn();
    const t = JSON.parse(e);
    if (typeof t.x == "number" && typeof t.y == "number")
      return Xe(t.x, t.y);
  } catch {
  }
  return Qn();
}
function Ys(e) {
  try {
    localStorage.setItem(jr, JSON.stringify(e));
  } catch {
  }
}
function Xs(e) {
  if (e.sourceOnly || !e.jobId) {
    const t = Ve(e.sourceUrl), n = Ve(e.translatedUrl);
    return {
      source: t,
      translated: n,
      // sideBySide requires dedicated artifact; no fallback to source url
      sideBySide: ""
    };
  }
  return ko({
    jobId: e.jobId,
    jobPayload: e.jobPayload,
    manifestPayload: e.manifestPayload
  });
}
function Zs({
  activeTool: e,
  sourceOnly: t,
  onToggleTool: n,
  download: r
}) {
  const [a, o] = z(() => Gs()), [i, s] = z(!1), [c, l] = z(() => /* @__PURE__ */ new Set()), d = N(null), u = N(null), f = Jt(), m = Y(() => Xs(r), [r]);
  B(() => {
    const p = () => o((x) => Xe(x.x, x.y));
    return window.addEventListener("resize", p), () => window.removeEventListener("resize", p);
  }, []), B(() => {
    if (!i) return;
    const p = (T) => {
      const M = d.current;
      M && T.target instanceof Node && !M.contains(T.target) && s(!1);
    }, x = (T) => {
      T.key === "Escape" && (T.preventDefault(), s(!1));
    };
    return document.addEventListener("mousedown", p), window.addEventListener("keydown", x), () => {
      document.removeEventListener("mousedown", p), window.removeEventListener("keydown", x);
    };
  }, [i]);
  const h = _((p) => {
    n(p), s(!1);
  }, [n]), g = _(
    async (p) => {
      const x = Ve(m[p]);
      if (!(!x || c.has(p)))
        try {
          const T = r.jobId ? Lo(p, {
            jobId: r.jobId,
            jobPayload: r.jobPayload,
            manifestPayload: r.manifestPayload
          }) : `${r.sourceOnly ? "document" : "reader"}-${p}.pdf`;
          await No(
            r.fetchProtected,
            x,
            T,
            T,
            null,
            (M) => l((E) => {
              const A = new Set(E);
              return M ? A.add(p) : A.delete(p), A;
            })
          );
        } catch (T) {
          const M = T instanceof Error ? T.message : "下载失败";
          zo(M), l((E) => {
            const A = new Set(E);
            return A.delete(p), A;
          });
        }
    },
    [m, c, r]
  ), S = (p) => {
    p.button === 0 && (p.currentTarget.setPointerCapture(p.pointerId), u.current = {
      pointerId: p.pointerId,
      startX: p.clientX,
      startY: p.clientY,
      originX: a.x,
      originY: a.y,
      moved: !1
    });
  }, y = (p) => {
    const x = u.current;
    if (!x || x.pointerId !== p.pointerId) return;
    const T = p.clientX - x.startX, M = p.clientY - x.startY;
    !x.moved && Math.hypot(T, M) < Hs || (x.moved = !0, i && s(!1), o(Xe(x.originX + T, x.originY + M)));
  }, b = (p) => {
    const x = u.current;
    if (!(!x || x.pointerId !== p.pointerId)) {
      u.current = null;
      try {
        p.currentTarget.releasePointerCapture(p.pointerId);
      } catch {
      }
      if (x.moved) {
        o((T) => {
          const M = Xe(T.x, T.y);
          return Ys(M), M;
        });
        return;
      }
      s((T) => !T);
    }
  }, R = typeof window < "u" && a.y > window.innerHeight * 0.55, v = Js.filter((p) => !(r.sourceOnly && p !== "source"));
  return /* @__PURE__ */ $(
    "div",
    {
      ref: d,
      className: `reader-fab${i ? " is-open" : ""}${R ? " is-open-up" : ""}`,
      style: { left: a.x, top: a.y },
      "data-reader-fab": "",
      children: [
        i ? /* @__PURE__ */ $(
          "div",
          {
            id: f,
            className: "reader-fab-menu reader-floating-surface",
            role: "menu",
            "aria-label": "阅读工具",
            children: [
              /* @__PURE__ */ $("header", { className: "reader-fab-menu-head", children: [
                /* @__PURE__ */ $("div", { className: "reader-fab-menu-head-text", children: [
                  /* @__PURE__ */ w("strong", { children: "工具" }),
                  /* @__PURE__ */ w("span", { children: "拖动圆钮可移动" })
                ] }),
                /* @__PURE__ */ w(
                  "button",
                  {
                    type: "button",
                    className: "reader-fab-menu-close reader-floating-close",
                    "aria-label": "关闭菜单",
                    onClick: () => s(!1),
                    children: /* @__PURE__ */ w(Ze, { size: 14, strokeWidth: 2.5, "aria-hidden": !0 })
                  }
                )
              ] }),
              Vs.map((p, x) => {
                const T = Ws[p.id], M = e === p.id, E = p.needsJob && t;
                let A = M ? p.subOpen : p.subIdle;
                return E && (A = "需打开任务阅读"), /* @__PURE__ */ $(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    className: `reader-fab-row${M ? " is-active" : ""}${E ? " is-disabled" : ""}`,
                    "aria-pressed": M,
                    disabled: E,
                    onClick: () => h(p.id),
                    style: { "--fab-i": x },
                    children: [
                      /* @__PURE__ */ w("span", { className: "reader-fab-row-icon", "aria-hidden": "true", children: /* @__PURE__ */ w(T, { size: 18, strokeWidth: 2 }) }),
                      /* @__PURE__ */ $("span", { className: "reader-fab-row-copy", children: [
                        /* @__PURE__ */ w("span", { className: "reader-fab-row-title", children: p.label }),
                        /* @__PURE__ */ w("span", { className: "reader-fab-row-sub", children: A })
                      ] })
                    ]
                  },
                  p.id
                );
              }),
              /* @__PURE__ */ $("div", { className: "reader-fab-section", role: "group", "aria-label": "下载", children: [
                /* @__PURE__ */ $("div", { className: "reader-fab-section-head", children: [
                  /* @__PURE__ */ w(mo, { size: 12, strokeWidth: 2.5, "aria-hidden": !0 }),
                  /* @__PURE__ */ w("span", { children: "下载 PDF" })
                ] }),
                /* @__PURE__ */ w("div", { className: "reader-fab-download-grid", children: v.map((p, x) => {
                  const T = Yr[p], M = Ve(m[p]), E = c.has(p), A = !!M && !E, P = A ? "" : Xr(p, m), I = Ks[p];
                  return /* @__PURE__ */ $(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      id: `reader-fab-download-${p}`,
                      className: `reader-fab-chip${E ? " is-busy" : ""}${A ? "" : " is-disabled"}`,
                      disabled: !A,
                      title: A ? `下载${T.label}` : P,
                      onClick: () => void g(p),
                      style: { "--fab-i": x },
                      children: [
                        /* @__PURE__ */ w("span", { className: "reader-fab-chip-icon", "aria-hidden": "true", children: /* @__PURE__ */ w(I, { size: 16, strokeWidth: 2 }) }),
                        /* @__PURE__ */ w("span", { className: "reader-fab-chip-label", children: qs[p] }),
                        /* @__PURE__ */ w("span", { className: "reader-fab-chip-state", children: E ? "…" : A ? "↓" : "—" })
                      ]
                    },
                    p
                  );
                }) }),
                v.every((p) => !Ve(m[p])) ? /* @__PURE__ */ w("p", { className: "reader-fab-empty", children: "产物尚未就绪" }) : null
              ] })
            ]
          }
        ) : null,
        /* @__PURE__ */ w(
          "button",
          {
            type: "button",
            className: `reader-fab-trigger${i ? " is-open" : ""}${e ? " has-active-tool" : ""}`,
            "aria-label": i ? "收起工具菜单" : "打开工具菜单",
            "aria-expanded": i,
            "aria-controls": i ? f : void 0,
            "aria-haspopup": "menu",
            onPointerDown: S,
            onPointerMove: y,
            onPointerUp: b,
            onPointerCancel: b,
            children: /* @__PURE__ */ w("span", { className: "reader-fab-icon", "aria-hidden": "true", children: i ? /* @__PURE__ */ w(Ze, { size: 20, strokeWidth: 2.5 }) : /* @__PURE__ */ $("span", { className: "reader-fab-dots", children: [
              /* @__PURE__ */ w("i", {}),
              /* @__PURE__ */ w("i", {}),
              /* @__PURE__ */ w("i", {})
            ] }) })
          }
        )
      ]
    }
  );
}
function Qs({
  userZoom: e,
  onZoomChange: t,
  currentPage: n,
  numPages: r,
  onGoToPage: a,
  mode: o = "compare",
  modeControls: i
}) {
  const s = pa(e), c = e > dr + 1e-3, l = e < fr - 1e-3, d = Ge(), u = "50%（半屏，对照铺满）", [f, m] = z(!1), [h, g] = z(`${n}`);
  B(() => {
    f || g(`${Math.min(Math.max(n, 1), Math.max(r, 1))}`);
  }, [n, r, f]);
  const S = () => {
    if (m(!1), !a || r <= 0)
      return;
    const y = Number(`${h}`.trim());
    a(gt(y, r));
  };
  return /* @__PURE__ */ $("div", { className: "reader-react-hud", "data-reader-hud": "true", children: [
    i ? /* @__PURE__ */ w("div", { className: "reader-react-hud-group reader-react-hud-modes", children: i }) : null,
    /* @__PURE__ */ w("div", { className: "reader-react-hud-group", "aria-label": "页码", children: f ? /* @__PURE__ */ $(
      "form",
      {
        className: "reader-react-hud-page-form",
        onSubmit: (y) => {
          y.preventDefault(), S();
        },
        children: [
          /* @__PURE__ */ w(
            "input",
            {
              className: "reader-react-hud-page-input",
              type: "text",
              inputMode: "numeric",
              pattern: "[0-9]*",
              "aria-label": "跳转到页码",
              value: h,
              autoFocus: !0,
              onChange: (y) => g(y.target.value.replace(/[^\d]/g, "")),
              onBlur: S,
              onKeyDown: (y) => {
                y.key === "Escape" && (y.preventDefault(), m(!1), g(`${n}`));
              }
            }
          ),
          /* @__PURE__ */ $("span", { className: "reader-react-hud-page-suffix", children: [
            "/ ",
            r || "—"
          ] })
        ]
      }
    ) : /* @__PURE__ */ w(
      "button",
      {
        type: "button",
        className: "reader-react-hud-page reader-react-hud-page-btn",
        "aria-label": r > 0 ? `跳转页码，当前第 ${n} 页，共 ${r} 页` : "页码",
        title: r > 0 ? "点击输入页码跳转" : void 0,
        disabled: !a || r <= 0,
        onClick: () => {
          !a || r <= 0 || (g(`${n}`), m(!0));
        },
        children: r > 0 ? `${Math.min(n, r)} / ${r}` : "—"
      }
    ) }),
    /* @__PURE__ */ $("div", { className: "reader-react-hud-group", "aria-label": "缩放", children: [
      /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn",
          "aria-label": "缩小",
          disabled: !c,
          onClick: () => t(et(e, -1)),
          children: "−"
        }
      ),
      /* @__PURE__ */ $(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn reader-react-hud-zoom-label",
          "aria-label": `重置为${u}`,
          title: u,
          onClick: () => t(d),
          children: [
            s,
            "%"
          ]
        }
      ),
      /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          className: "reader-react-hud-btn",
          "aria-label": "放大",
          disabled: !l,
          onClick: () => t(et(e, 1)),
          children: "+"
        }
      )
    ] }),
    /* @__PURE__ */ w("div", { className: "reader-react-hud-group reader-react-hud-help", "aria-label": "帮助", children: /* @__PURE__ */ w(Bs, {}) })
  ] });
}
const Ut = "download-toast";
function ec({
  title: e = "下载中",
  status: t = "正在准备...",
  meta: n = "等待响应...",
  percent: r = NaN,
  tone: a = "progress"
}) {
  const o = Number.isFinite(r) ? Math.max(4, Math.min(100, Number(r) || 0)) : 18;
  return /* @__PURE__ */ $("div", { className: "download-toast-card reader-floating-surface", "data-tone": a, "aria-live": "polite", children: [
    /* @__PURE__ */ $("div", { className: "download-toast-head", children: [
      /* @__PURE__ */ w("div", { id: "download-toast-title", className: "download-toast-title", children: e }),
      /* @__PURE__ */ w("div", { id: "download-toast-status", className: "download-toast-status", children: t })
    ] }),
    /* @__PURE__ */ w("div", { className: "download-toast-track", children: /* @__PURE__ */ w("span", { id: "download-toast-bar", className: "download-toast-bar", style: { width: `${o}%` } }) }),
    /* @__PURE__ */ w("div", { id: "download-toast-meta", className: "download-toast-meta", children: n })
  ] });
}
function tc(e = {}) {
  const {
    visible: t = !1,
    title: n = "下载中",
    status: r = "正在准备...",
    meta: a = "等待响应...",
    percent: o = NaN,
    tone: i = "progress"
  } = e;
  if (!t) {
    Lt.dismiss(Ut);
    return;
  }
  Lt.custom(
    () => /* @__PURE__ */ w(ec, { title: n, status: r, meta: a, percent: o, tone: i }),
    { id: Ut, duration: 1 / 0 }
  );
}
function nc() {
  const e = _((t) => {
    t && (t.setState = tc, t.hide = () => Lt.dismiss(Ut));
  }, []);
  return /* @__PURE__ */ $(tr, { children: [
    /* @__PURE__ */ w(no, { position: "bottom-right" }),
    /* @__PURE__ */ w("download-toast", { style: { display: "none" }, "aria-hidden": "true", ref: e })
  ] });
}
const rc = Kt(() => import("./ReaderFavoritesPanel-CYRiRcr2.js").then((e) => ({ default: e.ReaderFavoritesPanel }))), oc = Kt(() => import("./ReaderMarkdownPanel-Cf2_DzhL.js").then((e) => ({ default: e.ReaderMarkdownPanel }))), ac = Kt(() => import("./ReaderAiPanel-CV2d0Jzz.js").then((e) => ({ default: e.ReaderAiPanel })));
function At(e) {
  const t = N(!1);
  return e && (t.current = !0), t.current;
}
function ic(e) {
  return "workspace";
}
function sc(e, t) {
  return t !== null && e === "compare" ? "source" : e;
}
function er(e, t) {
  var n, r, a, o;
  return e === "compare" ? null : (t == null ? void 0 : t.assistantPanel) === "markdown" || (t == null ? void 0 : t.assistantPanel) === "ai" ? t.assistantPanel : ((n = t == null ? void 0 : t.splitLayout) == null ? void 0 : n.left) === "ai" || ((r = t == null ? void 0 : t.splitLayout) == null ? void 0 : r.right) === "ai" ? "ai" : ((a = t == null ? void 0 : t.splitLayout) == null ? void 0 : a.left) === "markdown" || ((o = t == null ? void 0 : t.splitLayout) == null ? void 0 : o.right) === "markdown" ? "markdown" : null;
}
function cc() {
  const e = mi(), { boot: t, panes: n, shell: r, sessionFiles: a, tools: o, session: i } = e, s = e.sourceOnly || !a.translatedUrl, [c, l] = z(() => er(e.mode, Ie(e.viewStateKey))), [d, u] = z(null), [f, m] = z(null), [h, g] = z(!0), S = N(e.viewStateKey);
  B(() => {
    m(null), g(!0);
  }, [e.viewStateKey]), B(() => {
    if (!t.loading) {
      if (S.current !== e.viewStateKey) {
        S.current = e.viewStateKey;
        const k = Ie(e.viewStateKey);
        l(er(e.mode, k)), u(null);
        return;
      }
      en(e.viewStateKey, { assistantPanel: c, splitLayout: null });
    }
  }, [c, t.loading, e.mode, e.viewStateKey]);
  const y = c || (e.mode === "compare" ? "compare" : "reading"), b = c !== null, R = At(o.isOpen("favorites")), v = At(c === "markdown"), p = At(c === "ai"), x = d || sc(e.mode, c), T = !!(e.liveTranslationAvailable && h && !b), M = T ? "compare" : x, E = _(() => {
    o.close();
  }, [o]), A = _(() => {
    l(null), u(null), m(null);
  }, []), P = _((k) => {
    const F = M === "translated" ? "translated" : "source";
    e.jumpToAnchor(k, F);
  }, [e.jumpToAnchor, M]), I = _((k) => {
    i.refreshCommittedDocument(k);
  }, [i.refreshCommittedDocument]), L = _((k) => {
    o.close(), u(null), k === "compare" && e.liveTranslationAvailable ? g(!0) : k !== "compare" && g(!1), e.setModeKeepingPage(k);
  }, [e.liveTranslationAvailable, e.setModeKeepingPage, o]), C = _((k) => {
    l(k), k !== "ai" && m(null);
  }, []), D = _((k) => {
    const F = k.pane === "translated" && !s ? "translated" : "source";
    m(k), l("ai"), u(F), e.clearSelection();
  }, [e.clearSelection, s]), U = [
    "reader-react-root",
    `is-workspace-${y}`,
    b ? "is-assistant-open" : "",
    T ? "is-live-translation-pair" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ $("div", { className: U, "data-reader-engine": "react-pdf", "data-reader-workspace": y, children: [
    /* @__PURE__ */ w(Ds, { loading: t.loading, failed: t.failed, text: t.text, percent: t.percent }),
    /* @__PURE__ */ w(vi, { onBeforeClose: i.prepareClose }),
    /* @__PURE__ */ w(
      Gi,
      {
        mode: M,
        documentReady: !!i.jobId,
        sourceOnly: s,
        onModeChange: L,
        liveTranslation: e.liveTranslationAvailable ? {
          visible: h,
          state: e.liveTranslation,
          onToggle: () => g((k) => !k)
        } : null
      }
    ),
    /* @__PURE__ */ w(Yi, { active: c, onSelect: C, onClose: A }),
    b ? /* @__PURE__ */ w(_s, {}) : null,
    e.showHud ? /* @__PURE__ */ w(Zs, { activeTool: o.active, sourceOnly: e.sourceOnly, onToggleTool: o.toggle, download: e.download }) : null,
    /* @__PURE__ */ w(Ji, { mode: M, bindShell: r.bindShell, shellEl: r.shellEl, userZoom: e.userZoom, compareMode: M === "compare", shellWidth: r.shellWidth, compareColWidth: r.compareColWidth, rowHeights: e.rowHeights, mountSource: n.mountSource, mountTranslated: n.mountTranslated, showSource: T || M !== "translated", showTranslated: T || M === "translated" || M === "compare", sourceOnly: s, sourceUrl: a.sourceUrl, translatedUrl: a.translatedUrl, sourceFile: a.sourceFile, translatedFile: a.translatedFile, activeRegion: e.activeRegion, regions: i.regions, readerMetadata: i.readerMetadata, onSelectRegion: e.selectRegion, markdownSplit: c === "markdown", assistantSplit: b, onMetrics: n.onMetrics, onNumPagesChange: n.onNumPages, liveTranslation: h ? e.liveTranslation : void 0, liveTranslationPair: T }),
    e.showHud ? /* @__PURE__ */ w(
      Qs,
      {
        userZoom: e.userZoom,
        onZoomChange: e.onZoomChange,
        currentPage: e.currentPage,
        numPages: n.hudNumPages,
        mode: M,
        onGoToPage: e.goToPage,
        modeControls: null
      }
    ) : null,
    /* @__PURE__ */ $(Kr, { fallback: null, children: [
      R ? /* @__PURE__ */ w(rc, { open: o.isOpen("favorites"), jobId: i.jobId, documentId: i.documentId, onClose: E, onJumpPage: e.goToPage }) : null,
      v ? /* @__PURE__ */ w(oc, { open: c === "markdown", jobId: i.jobId, sourceOnly: e.sourceOnly, layout: "workspace", side: "right", onClose: A }) : null,
      p ? /* @__PURE__ */ w(ac, { open: c === "ai", jobId: i.jobId, documentId: i.documentId, layout: ic(e.mode), side: "right", selectionContext: f, onClearSelectionContext: () => m(null), onClose: A, onJumpCitation: P, onDocumentCommitted: I }, i.documentId || i.jobId || "reader-ai-pending") : null
    ] }),
    /* @__PURE__ */ w(Fs, { selection: e.selection, onDismiss: e.clearSelection, onAskAi: D }),
    /* @__PURE__ */ w(nc, {})
  ] });
}
function Pc() {
  return /* @__PURE__ */ w(cc, {});
}
export {
  Vt as A,
  Pc as R,
  cc as a,
  Ro as b,
  xc as c,
  Qe as d,
  lr as e,
  Tc as f,
  Rc as g,
  Ic as r
};
//# sourceMappingURL=ReaderApp-Ci3nCLCY.js.map
