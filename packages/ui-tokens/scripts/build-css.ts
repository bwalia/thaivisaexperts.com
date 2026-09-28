// Writes tokens.css (CSS custom properties) from src/index.ts. Run: pnpm --filter @tve/ui-tokens build:css
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { renderCss } from "../src/css";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "tokens.css");
writeFileSync(out, renderCss());
console.log(`wrote ${out}`);
