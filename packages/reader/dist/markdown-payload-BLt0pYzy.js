function o(t) {
  return t && typeof t == "object" && t.data && typeof t.data == "object" && !Array.isArray(t.data) ? t.data : t;
}
function i(t) {
  const a = o(t) || {}, n = `${a.content_with_absolute_image_urls || a.content || a.markdown || ""}`;
  return {
    payload: a,
    content: n,
    imagesBaseUrl: `${a.images_base_url || a.images_base_path || ""}`.trim(),
    ready: a.ready !== !1 && !!n.trim()
  };
}
function r(t) {
  return !!i(t).content.trim();
}
async function c(t, a) {
  let n = null;
  try {
    if (n = await t(), r(n))
      return n;
  } catch {
  }
  const e = await a();
  return r(e) ? e : n ?? e;
}
export {
  r as h,
  c as l,
  i as n
};
//# sourceMappingURL=markdown-payload-BLt0pYzy.js.map
