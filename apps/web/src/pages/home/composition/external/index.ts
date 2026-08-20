// composition/external/index — re-export all sub-barrels for backward compat
// Keep external.ts as `export * from "./external/index.js"`; consumers can also import specific sub-barrel.

export * from "./config.js";
export * from "./state.js";
export * from "./job.js";
export * from "./api.js";
export * from "./features.js";
export * from "./shared.js";
