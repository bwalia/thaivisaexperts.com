// Extract / merge the short localized strings that live inside shared JSON files
// (image alt text, source labels, country names, announcements):
//   node inline-strings.mjs extract <out.json>          → { "<file>#<pointer>": "<English>" }
//   node inline-strings.mjs merge <locale> <in.json>    → writes that locale into every string
// Translators work on one flat file per locale, so parallel translations never edit
// the same content file.
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = ["images.json", "countries.json", "announcements.json"];
for (const dir of ["visas", "guides", "pages"]) {
  for (const slug of readdirSync(join(root, dir))) {
    for (const name of ["facts.json", "meta.json"]) {
      if (existsSync(join(root, dir, slug, name))) files.push(join(dir, slug, name));
    }
  }
}

const isLocalized = (v) =>
  v && typeof v === "object" && !Array.isArray(v) && typeof v.en === "string" && "fr" in v;

function walk(node, pointer, visit) {
  if (isLocalized(node)) return visit(node, pointer);
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) walk(v, `${pointer}/${k}`, visit);
  }
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === "extract") {
  const out = {};
  for (const f of files) {
    const data = JSON.parse(readFileSync(join(root, f), "utf8"));
    walk(data, "", (node, ptr) => (out[`${f}#${ptr}`] = node.en));
  }
  writeFileSync(a, JSON.stringify(out, null, 2) + "\n");
  console.log(`${Object.keys(out).length} strings from ${files.length} files → ${a}`);
} else if (cmd === "merge") {
  const locale = a;
  const tr = JSON.parse(readFileSync(b, "utf8"));
  let n = 0;
  const missing = [];
  for (const f of files) {
    const path = join(root, f);
    const data = JSON.parse(readFileSync(path, "utf8"));
    walk(data, "", (node, ptr) => {
      const v = tr[`${f}#${ptr}`];
      if (typeof v === "string" && v.trim()) {
        node[locale] = v;
        n++;
      } else missing.push(`${f}#${ptr}`);
    });
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  }
  console.log(`${locale}: merged ${n}, missing ${missing.length}`);
  if (missing.length) {
    console.log(missing.slice(0, 20).join("\n"));
    process.exit(1);
  }
} else {
  console.error("usage: extract <out> | merge <locale> <in>");
  process.exit(2);
}
