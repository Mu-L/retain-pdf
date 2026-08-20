// node --test 的 .jsx/.ts/.tsx 转换钩子:esbuild 即时编译
//
// resolve:
// - "@/..." → <frontend>/src/...
// - 显式 .js/.jsx 导入映射到同名 .ts/.tsx（TS 迁移兼容）
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transform } from "esbuild";

const SRC_ROOT = new URL("../../src/", import.meta.url);
const RESOLVE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

function tryResolveFile(basePath) {
  if (existsSync(basePath) && !basePath.endsWith("/")) {
    return basePath;
  }
  return null;
}

function resolveWithTsFallback(filePath) {
  const ext = extname(filePath);
  const stem = ext ? filePath.slice(0, -ext.length) : filePath;
  const order = {
    ".js": [".ts", ".tsx", ".js"],
    ".jsx": [".tsx", ".jsx"],
    ".mjs": [".mts", ".mjs"],
    ".ts": [".ts", ".tsx"],
    ".tsx": [".tsx"],
    "": RESOLVE_EXTENSIONS,
  }[ext] || RESOLVE_EXTENSIONS;

  for (const candidateExt of order) {
    const hit = tryResolveFile(`${stem}${candidateExt}`);
    if (hit) return hit;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  // @retainpdf/* alias → packages/*
  if (specifier.startsWith("@retainpdf/")) {
    const sub = specifier.slice("@retainpdf/".length);
    const pkg = sub.split("/")[0];
    const rest = sub.slice(pkg.length).replace(/^\//, "");
    const base = rest ? `../../../../packages/${pkg}/src/${rest}` : `../../../../packages/${pkg}/src/index.ts`;
    const basePath = fileURLToPath(new URL(base, import.meta.url));
    const hit = resolveWithTsFallback(basePath);
    if (hit) {
      return { url: pathToFileURL(hit).href, shortCircuit: true };
    }
    // fallback to package root (for @retainpdf/reader bare)
    if (!rest) {
      const pkgRoot = fileURLToPath(new URL(`../../../../packages/${pkg}/src/index.ts`, import.meta.url));
      const hit2 = resolveWithTsFallback(pkgRoot);
      if (hit2) return { url: pathToFileURL(hit2).href, shortCircuit: true };
    }
  }
  // @/ alias
  if (specifier.startsWith("@/")) {
    const basePath = fileURLToPath(new URL(specifier.slice(2), SRC_ROOT));
    const hit = resolveWithTsFallback(basePath);
    if (hit) {
      return { url: pathToFileURL(hit).href, shortCircuit: true };
    }
  }

  // relative / absolute .js|.jsx → prefer .ts|.tsx
  if (
    (specifier.startsWith("./") || specifier.startsWith("../") || specifier.startsWith("/"))
    && /\.(jsx?|mjs)$/.test(specifier)
  ) {
    const parent = context.parentURL
      ? dirname(fileURLToPath(context.parentURL))
      : process.cwd();
    const abs = specifier.startsWith("/")
      ? specifier
      : join(parent, specifier);
    const hit = resolveWithTsFallback(abs);
    if (hit) {
      return { url: pathToFileURL(hit).href, shortCircuit: true };
    }
  }

  // Bare specifiers imported from packages/ui/* should resolve via apps/web/node_modules
  // (e.g. sonner, lucide-react, radix-ui, class-variance-authority need web's deps;
  //  transitive deps like react-remove-scroll inside packages/ui/node_modules also need fallback)
  if (
    context.parentURL &&
    context.parentURL.includes("/packages/ui/")
  ) {
    try {
      const webParent = new URL("../../package.json", import.meta.url).href;
      return await nextResolve(specifier, { ...context, parentURL: webParent });
    } catch {}
  }

  return nextResolve(specifier, context);
}

function loaderForUrl(url) {
  if (url.endsWith(".tsx")) return "tsx";
  if (url.endsWith(".ts")) return "ts";
  if (url.endsWith(".jsx")) return "jsx";
  return null;
}

export async function load(url, context, nextLoad) {
  const loader = loaderForUrl(url);
  if (!loader) {
    return nextLoad(url, context);
  }
  const source = await readFile(new URL(url), "utf8");
  const { code } = await transform(source, {
    loader,
    jsx: "automatic",
    format: "esm",
    sourcefile: url,
  });
  return { format: "module", source: code, shortCircuit: true };
}
