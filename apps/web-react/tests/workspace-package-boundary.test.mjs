import test from "node:test";
import assert from "node:assert/strict";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const THIS_FILE = fileURLToPath(import.meta.url);
const APP_ROOT = resolve(dirname(THIS_FILE), "..");
const REPO_ROOT = resolve(APP_ROOT, "../..");
const PACKAGE_ROOTS = new Map([
  ["@retainpdf/api", "packages/api"],
  ["@retainpdf/contracts", "packages/schemas"],
  ["@retainpdf/domain", "packages/domain"],
  ["@retainpdf/reader", "packages/reader"],
  ["@retainpdf/ui", "packages/ui"],
]);
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);

function sourceFilesUnder(root) {
  const pending = [root];
  const files = [];
  while (pending.length > 0) {
    const current = pending.pop();
    const stat = statSync(current);
    if (stat.isDirectory()) {
      for (const entry of readdirSync(current)) pending.push(join(current, entry));
      continue;
    }
    const extension = current.slice(current.lastIndexOf("."));
    if (SOURCE_EXTENSIONS.has(extension)) files.push(current);
  }
  return files.sort();
}

function packageNameFor(specifier) {
  return [...PACKAGE_ROOTS.keys()].find(
    (packageName) => specifier === packageName || specifier.startsWith(`${packageName}/`),
  );
}

function exportTargets(value) {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object") return [];
  return Object.values(value).flatMap(exportTargets);
}

test("SPA consumes workspace packages only through declared public exports", () => {
  const appPackage = JSON.parse(readFileSync(join(APP_ROOT, "package.json"), "utf8"));
  const dependencies = { ...appPackage.dependencies, ...appPackage.devDependencies };
  const imports = new Set();

  for (const file of sourceFilesUnder(join(APP_ROOT, "src"))) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/["'](@retainpdf\/(?:api|contracts|domain|reader|ui)(?:\/[^"']*)?)["']/g)) {
      imports.add(match[1]);
    }
  }

  for (const specifier of [...imports].sort()) {
    const publicSpecifier = specifier.replace(/[?#].*$/, "");
    const packageName = packageNameFor(publicSpecifier);
    assert.ok(packageName, `unknown workspace package import: ${publicSpecifier}`);
    assert.ok(
      Object.hasOwn(dependencies, packageName),
      `${publicSpecifier} is imported but ${packageName} is not declared by apps/web-react`,
    );
    assert.doesNotMatch(
      publicSpecifier,
      /\/internal(?:\/|$)/,
      `${publicSpecifier} exposes package internals`,
    );

    const packageRoot = join(REPO_ROOT, PACKAGE_ROOTS.get(packageName));
    const packageJson = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));
    const suffix = publicSpecifier.slice(packageName.length);
    const exportName = suffix ? `.${suffix}` : ".";
    assert.ok(
      Object.hasOwn(packageJson.exports || {}, exportName),
      `${publicSpecifier} is not a declared ${packageName} export`,
    );
    for (const target of exportTargets(packageJson.exports[exportName])) {
      assert.ok(
        !target.startsWith("./src/"),
        `${publicSpecifier} exposes source target ${target}`,
      );
      assert.ok(
        existsSync(join(packageRoot, target)),
        `${publicSpecifier} target is missing after workspace preparation: ${target}`,
      );
    }
  }
});

test("SPA build and tests do not alias workspace packages back to source", () => {
  const configFiles = [
    join(APP_ROOT, "vite.config.ts"),
    join(APP_ROOT, "tsconfig.app.json"),
    ...sourceFilesUnder(join(APP_ROOT, "tests")).filter((file) => file !== THIS_FILE),
  ];
  const offenders = configFiles.flatMap((file) => {
    const source = readFileSync(file, "utf8");
    return /packages\/(?:api|domain|reader|ui)\/src|workspace-source-aliases/.test(source)
      ? [relative(APP_ROOT, file)]
      : [];
  });
  assert.deepEqual(offenders, []);

  const prepareScript = readFileSync(
    join(REPO_ROOT, "apps/web/scripts/build-workspace-packages.mjs"),
    "utf8",
  );
  for (const packageName of PACKAGE_ROOTS.keys()) {
    assert.match(prepareScript, new RegExp(packageName.replace("/", "\\/")));
  }
});
