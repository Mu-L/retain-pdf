// @retainpdf/reader — 纯版 ReaderApp（仅 react-pdf，不含 legacy 静态分支）
// 从 apps/web/src/pages/reader/ReaderApp.tsx 提炼：保留 resolveReaderEngine 判断，
// legacy 分支改为动态 import，确保 standalone 主包不含 legacy 代码。

import { useMemo, lazy, Suspense } from "react";
import { ReaderAppReactPdf } from "./ReaderAppReactPdf.jsx";

function resolveReaderEngine(search = globalThis.location?.search || ""): "legacy" | "react-pdf" {
  const engine = new URLSearchParams(search).get("engine")?.trim().toLowerCase() || "";
  if (engine === "legacy" || engine === "classic") {
    return "legacy";
  }
  return "react-pdf";
}

// legacy 按需拆包：主包不含 legacy，仅 ?engine=legacy 时动态加载独立 chunk
const ReaderAppLegacy = lazy(() => import("./legacy/ReaderAppLegacy.jsx"));

export function ReaderApp() {
  const engine = useMemo(() => resolveReaderEngine(), []);
  if (engine === "legacy") {
    return (
      <Suspense fallback={<ReaderAppReactPdf />}>
        <ReaderAppLegacy />
      </Suspense>
    );
  }
  return <ReaderAppReactPdf />;
}

export default ReaderApp;
