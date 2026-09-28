"use client";
// Static-export friendly next/image loader: maps a requested width to a pre-generated
// variant made by scripts/prepare.mjs (public/images/_w/<name>-<width>.webp).
export const IMAGE_WIDTHS = [480, 828, 1200, 1920];

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  if (!src.startsWith("/images/") || src.startsWith("/images/_w/")) return src;
  const w = IMAGE_WIDTHS.find((x) => x >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
  const name = src.slice("/images/".length).replace(/\.[^.]+$/, "");
  return `/images/_w/${name}-${w}.webp`;
}
