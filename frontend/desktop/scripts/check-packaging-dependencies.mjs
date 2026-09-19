import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const desktopPackage = require("../package.json");
const installedElectron = require("electron/package.json").version;
const installedElectronBuilder = require("electron-builder/package.json").version;
const dependencyElectron = desktopPackage.devDependencies?.electron;
const dependencyElectronBuilder = desktopPackage.devDependencies?.["electron-builder"];
const configuredElectron = desktopPackage.build?.electronVersion;

if (!/^\d+\.\d+\.\d+$/.test(dependencyElectron || "")) {
  throw new Error(
    `Electron must use an exact version for reproducible workspace packaging; received ${dependencyElectron || "<missing>"}`,
  );
}

if (configuredElectron !== dependencyElectron) {
  throw new Error(
    `build.electronVersion (${configuredElectron || "<missing>"}) must match devDependencies.electron (${dependencyElectron})`,
  );
}

if (installedElectron !== dependencyElectron) {
  throw new Error(
    `Installed Electron (${installedElectron}) does not match the packaging version (${dependencyElectron})`,
  );
}

if (!/^\d+\.\d+\.\d+$/.test(dependencyElectronBuilder || "")) {
  throw new Error(
    `electron-builder must use an exact version; received ${dependencyElectronBuilder || "<missing>"}`,
  );
}

if (installedElectronBuilder !== dependencyElectronBuilder) {
  throw new Error(
    `Installed electron-builder (${installedElectronBuilder}) does not match the packaging version (${dependencyElectronBuilder})`,
  );
}

if (desktopPackage.build?.npmRebuild !== false) {
  throw new Error("build.npmRebuild must remain false while the desktop workspace has no Node runtime dependencies");
}

const runtimeDependencyNames = [
  ...Object.keys(desktopPackage.dependencies || {}),
  ...Object.keys(desktopPackage.optionalDependencies || {}),
];
if (runtimeDependencyNames.length > 0) {
  throw new Error(
    `Desktop Node runtime dependencies require a staged rebuild strategy before npmRebuild can be enabled: ${runtimeDependencyNames.join(", ")}`,
  );
}

// electron-builder 26 把 `app-builder-bin` 和 `7zip-bin` 都从依赖树里去掉了（25.x 还
// 有），所以这里不再校验那个可执行文件存不存在——它已经不由 npm 依赖提供。改成校验
// 打包入口本身能被解析到，这是这个脚本真正要保证的事:工具链装齐了、版本对得上。
const builderEntry = require.resolve("electron-builder");
fs.accessSync(builderEntry, fs.constants.R_OK);

console.log(
  `Desktop packaging dependencies verified: electron=${installedElectron}, electron-builder=${installedElectronBuilder}, entry=${builderEntry}`,
);
