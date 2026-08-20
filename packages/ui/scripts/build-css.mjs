import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
console.log("[ui] css placeholder — tokens/themes are in @retainpdf/ui/styles (future)");
if (!existsSync("./src/styles")) console.log("[ui] no styles yet");
// Ensure dist/ui.css exists so package export "./styles.css" resolves (tokens migrate later)
const dist = join(process.cwd(), "dist");
mkdirSync(dist, { recursive: true });
const out = join(dist, "ui.css");
if (!existsSync(out)) {
  writeFileSync(out, "/* @retainpdf/ui — placeholder, tokens are re-exported from apps/web/src/styles/tokens.css */\n", "utf8");
  console.log("[ui] wrote placeholder dist/ui.css");
}
