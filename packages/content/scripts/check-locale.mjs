// Check one locale's translation files against English before running the full tests:
//   node packages/content/scripts/check-locale.mjs <locale>
//   INLINE_EN=<inline-en.json> node packages/content/scripts/check-locale.mjs <locale> <inline-xx.json>
// Reports missing/extra keys, array length mismatches, changed {placeholders},
// ICU plural syntax errors and missing plural categories, and leftover English.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// The ICU parser ships with next-intl (not a direct dependency), so look in pnpm's store.
const require = createRequire(join(root, "../../node_modules/.pnpm/node_modules/x.js"));
let parse = null;
try {
  ({ parse } = require("@formatjs/icu-messageformat-parser"));
} catch {
  console.warn("warning: ICU parser not found; skipping plural checks");
}
const locale = process.argv[2];
const inlinePath = process.argv[3];
if (!locale) {
  console.error("usage: check-locale.mjs <locale> [inline.json]");
  process.exit(2);
}
const errors = [];
const warnings = [];
const files = [join("messages")].concat(
  ...["visas", "guides", "pages"].map((d) => readdirSync(join(root, d)).map((s) => join(d, s))),
);
const plural = new Intl.PluralRules(locale === "pa" ? "pa-Guru" : locale);
// Categories that whole numbers 0–1000 actually use (French "many" only applies to
// compact millions, so ICU's "other" fallback is fine there).
const required = new Set(Array.from({ length: 1001 }, (_, n) => plural.select(n)));

function placeholders(s) {
  return [...s.matchAll(/\{\s*([a-zA-Z0-9_]+)\s*[,}]/g)]
    .map((m) => m[1])
    .sort()
    .join(",");
}
function checkIcu(s, where) {
  if (!parse || !/[{}]/.test(s)) return;
  try {
    const ast = parse(s);
    const visit = (nodes) => {
      for (const n of nodes) {
        if (n.type === 6 /* plural */) {
          const have = new Set(Object.keys(n.options).filter((k) => !k.startsWith("=")));
          if (!have.has("other")) errors.push(`${where}: plural without "other"`);
          for (const c of required)
            if (!have.has(c)) errors.push(`${where}: plural missing "${c}" for ${locale}`);
        }
        if (n.options) for (const o of Object.values(n.options)) visit(o.value);
        if (n.children) visit(n.children);
      }
    };
    visit(ast);
  } catch (e) {
    errors.push(`${where}: ICU syntax error: ${e.message}`);
  }
}
function compare(en, tr, where) {
  if (Array.isArray(en)) {
    if (!Array.isArray(tr)) return errors.push(`${where}: expected array`);
    if (en.length !== tr.length)
      errors.push(`${where}: ${tr.length} items, English has ${en.length}`);
    en.forEach((v, i) => compare(v, tr[i], `${where}[${i}]`));
  } else if (en && typeof en === "object") {
    if (!tr || typeof tr !== "object") return errors.push(`${where}: expected object`);
    for (const k of Object.keys(en)) {
      if (!(k in tr)) errors.push(`${where}.${k}: missing`);
      else compare(en[k], tr[k], `${where}.${k}`);
    }
    for (const k of Object.keys(tr)) if (!(k in en)) errors.push(`${where}.${k}: not in English`);
  } else if (typeof en === "string") {
    if (typeof tr !== "string" || !tr.trim()) return errors.push(`${where}: empty`);
    if (placeholders(en) !== placeholders(tr))
      errors.push(`${where}: placeholders {${placeholders(tr)}} ≠ English {${placeholders(en)}}`);
    checkIcu(tr, where);
    const words = en.split(/\s+/).length;
    if (words >= 6 && tr === en && !/^https?:/.test(en))
      warnings.push(`${where}: identical to English (fine for proper nouns)`);
  }
}
let count = 0;
for (const f of files) {
  const enPath = f === "messages" ? join(root, "messages/en.json") : join(root, f, "en.json");
  const trPath =
    f === "messages" ? join(root, `messages/${locale}.json`) : join(root, f, `${locale}.json`);
  if (!existsSync(trPath)) {
    errors.push(`${trPath.replace(root + "/", "")}: missing file`);
    continue;
  }
  let en, tr;
  try {
    en = JSON.parse(readFileSync(enPath, "utf8"));
    tr = JSON.parse(readFileSync(trPath, "utf8"));
  } catch (e) {
    errors.push(`${trPath.replace(root + "/", "")}: invalid JSON: ${e.message}`);
    continue;
  }
  count++;
  const name = trPath.replace(root + "/", "");
  if (f !== "messages") {
    if (tr.translatedFrom !== en.translatedFrom)
      errors.push(`${name}: translatedFrom must be ${en.translatedFrom}`);
    if (tr.reviewStatus !== "machine") errors.push(`${name}: reviewStatus must be "machine"`);
    delete en.translatedFrom;
    delete en.reviewStatus;
    delete tr.translatedFrom;
    delete tr.reviewStatus;
  }
  compare(en, tr, name);
}
if (inlinePath) {
  const src = JSON.parse(readFileSync(process.env.INLINE_EN, "utf8"));
  const tr = JSON.parse(readFileSync(inlinePath, "utf8"));
  for (const k of Object.keys(src)) {
    if (typeof tr[k] !== "string" || !tr[k].trim()) errors.push(`inline ${k}: missing`);
  }
  for (const k of Object.keys(tr)) if (!(k in src)) errors.push(`inline ${k}: not in source`);
}
console.log(`${locale}: ${count} files checked, ${errors.length} problem(s)`);
for (const e of errors.slice(0, 80)) console.log("  " + e);
if (warnings.length)
  console.log(`${warnings.length} warning(s):\n  ` + warnings.slice(0, 40).join("\n  "));
process.exit(errors.length ? 1 : 0);
