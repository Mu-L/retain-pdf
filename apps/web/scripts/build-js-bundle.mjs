import { build, context } from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");
const outdir = path.join(frontendRoot, "dist");

// --watch: esbuild context 增量重建(开发态:sourcemap 开、minify 关)
const watchMode = process.argv.includes("--watch");

// 导入路径仍写 .js/.jsx（兼容存量 import），解析时映射到 .ts/.tsx。
// TypeScript bundler 约定：import "./foo.js" 可对应 foo.ts。
function jsToTsResolvePlugin() {
  const map = new Map([
    [".js", [".ts", ".tsx", ".js"]],
    [".jsx", [".tsx", ".jsx"]],
    [".mjs", [".mts", ".mjs"]],
  ]);
  return {
    name: "js-to-ts-resolve",
    setup(buildApi) {
      buildApi.onResolve({ filter: /\.(jsx?|mjs)$/ }, (args) => {
        if (args.namespace !== "file" && args.namespace !== "") return;
        if (args.path.startsWith("http") || args.path.startsWith("data:")) return;
        const candidates = map.get(path.extname(args.path));
        if (!candidates) return;

        let dir = args.resolveDir;
        if (args.importer) {
          dir = path.dirname(args.importer);
        }
        const absBase = path.isAbsolute(args.path)
          ? args.path
          : path.join(dir, args.path);
        const withoutExt = absBase.replace(/\.(jsx?|mjs)$/, "");
        for (const ext of candidates) {
          const candidate = `${withoutExt}${ext}`;
          if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
            return { path: candidate };
          }
        }
        return undefined;
      });
    },
  };
}

// 三页 MPA 各自打包的入口表——home/detail/reader 均已切换到 React 新世界
const PAGE_BUNDLES = [
  {
    name: "home",
    entry: path.join(frontendRoot, "src/pages/home/entry.tsx"),
    outfile: path.join(outdir, "app.bundle.js"),
  },
  {
    name: "detail",
    entry: path.join(frontendRoot, "src/pages/detail/entry.tsx"),
    outfile: path.join(outdir, "detail.bundle.js"),
  },
  {
    name: "reader",
    entry: path.join(frontendRoot, "src/pages/reader/entry.tsx"),
    outfile: path.join(outdir, "reader.bundle.js"),
  },
];

// mathjax-full/js/components/version.js 在未定义 PACKAGE_VERSION 时会
// eval('require') 读 package.json —— 浏览器 ESM 里直接炸，导致全部公式回退。
function resolveMathJaxPackageVersion() {
  try {
    const pkgPath = path.join(
      frontendRoot,
      "node_modules/mathjax-full/package.json",
    );
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    return typeof pkg.version === "string" ? pkg.version : "3.2.1";
  } catch {
    return "3.2.1";
  }
}

function bundleOptions({ entry, outfile }) {
  return {
    entryPoints: [entry],
    outfile,
    bundle: true,
    format: "esm",
    platform: "browser",
    target: ["es2022"],
    // Markstream 的图表/增强代码块运行时是 optional peers。本产品当前只启用
    // KaTeX + plain <pre>，未安装的可选模块保持动态 external，不能为了让
    // esbuild 解析成功而把 Mermaid/D2/Infographic 整套塞进基础包。
    external: [
      "@antv/infographic",
      "@terrastruct/d2",
      "mermaid",
      "stream-diffs",
    ],
    jsx: "automatic",
    alias: {
      "@": path.join(frontendRoot, "src"),
    },
    // Workspace package peers resolve through the host's installed dependency tree.
    nodePaths: [path.join(frontendRoot, "node_modules")],
    // Reader 与其它 workspace 包一样只通过 package.json exports 消费；
    // 禁止在宿主构建里维护第二份 subpath→源码路径映射。
    plugins: [jsToTsResolvePlugin()],
    define: {
      PACKAGE_VERSION: JSON.stringify(resolveMathJaxPackageVersion()),
    },
    loader: {
      ".html": "text",
      ".ts": "ts",
      ".tsx": "tsx",
    },
    minify: !watchMode,
    sourcemap: watchMode ? "inline" : false,
    logLevel: "info",
    legalComments: "none",
  };
}

// 只清 JS 产物，保留 dist/css/（build:css 独立写入；整目录 rm 会把主页样式弄没）
fs.mkdirSync(outdir, { recursive: true });
for (const page of PAGE_BUNDLES) {
  try {
    fs.rmSync(page.outfile, { force: true });
  } catch {
    // ignore
  }
}

if (watchMode) {
  const contexts = await Promise.all(
    PAGE_BUNDLES.map((page) => context(bundleOptions(page))),
  );
  await Promise.all(contexts.map((ctx) => ctx.watch()));
  console.log(`[watch] 监听中:${PAGE_BUNDLES.map((p) => p.name).join(", ")}(Ctrl+C 退出)`);
} else {
  for (const page of PAGE_BUNDLES) {
    await build(bundleOptions(page));
  }
}
