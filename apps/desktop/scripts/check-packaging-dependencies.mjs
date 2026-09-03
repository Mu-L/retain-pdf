import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const desktopPackage = require("../package.json");
const installedElectron = require("electron/package.json").version;
const dependencyElectron = desktopPackage.devDependencies?.electron;
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

console.log(`Electron packaging dependency verified: ${installedElectron}`);
