import { existsSync } from "node:fs";
console.log("[ui] css placeholder — tokens/themes are in @retainpdf/ui/styles (future)");
if (!existsSync("./src/styles")) console.log("[ui] no styles yet");
