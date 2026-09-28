// Runs before dev/build: regenerates the content registry and responsive image variants.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const web = join(here, "..");
execFileSync("node", [join(web, "../../packages/content/scripts/generate-registry.mjs")], {
  stdio: "inherit",
});

// Must match IMAGE_WIDTHS in src/lib/image-loader.ts.
const WIDTHS = [480, 828, 1200, 1920];
const FORCE = process.env.TVE_REBUILD_IMAGES === "1";
const src = join(web, "public/images");
const out = join(src, "_w");
mkdirSync(out, { recursive: true });
let made = 0;
for (const file of readdirSync(src)) {
  if (!/\.(webp|jpe?g|png)$/i.test(file)) continue;
  const base = file.replace(/\.[^.]+$/, "");
  const input = join(src, file);
  const mtime = statSync(input).mtimeMs;
  for (const w of WIDTHS) {
    const target = join(out, `${base}-${w}.webp`);
    if (!FORCE && existsSync(target) && statSync(target).mtimeMs >= mtime) continue;
    // Smaller widths serve phones, where bytes matter most for LCP.
    await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: w <= 828 ? 55 : 68, effort: 6 })
      .toFile(target);
    made++;
  }
}
// 1200×630 JPEG share images (Open Graph / Twitter), since not every platform accepts WebP.
const og = join(src, "_og");
mkdirSync(og, { recursive: true });
for (const file of readdirSync(src)) {
  if (!/\.(webp|jpe?g|png)$/i.test(file)) continue;
  const input = join(src, file);
  const target = join(og, `${file.replace(/\.[^.]+$/, "")}.jpg`);
  if (existsSync(target) && statSync(target).mtimeMs >= statSync(input).mtimeMs) continue;
  await sharp(input)
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(target);
  made++;
}
console.log(`images: ${made} variant(s) generated`);
