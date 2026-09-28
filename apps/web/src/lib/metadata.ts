import type { Metadata } from "next";
import { LOCALES, getImage, type Locale } from "@tve/content";
import { OG_LOCALES, SITE_URL, absoluteUrl } from "./site";

interface Input {
  locale: Locale;
  /** Locale-relative path, e.g. "visas/dtv". "" for home. */
  path: string;
  title: string;
  description: string;
  imageId?: string | null;
  /** Use the title as-is instead of appending the site name. */
  absoluteTitle?: boolean;
}

/** Canonical + hreflang alternates (all locales + x-default) + Open Graph for every page. */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  imageId,
  absoluteTitle,
}: Input): Metadata {
  const languages: Record<string, string> = Object.fromEntries(
    LOCALES.map((l) => [l, absoluteUrl(l, path)]),
  );
  languages["x-default"] = absoluteUrl("en", path);
  const image = getImage(imageId);
  const og = image ?? getImage("phi-phi-beach");
  const ogImage = og
    ? `${SITE_URL}/images/_og/${og.src.slice("/images/".length).replace(/\.[^.]+$/, "")}.jpg`
    : undefined;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: absoluteUrl(locale, path), languages },
    openGraph: {
      type: "website",
      siteName: "Thai Visa Experts",
      title,
      description,
      url: absoluteUrl(locale, path),
      locale: OG_LOCALES[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1200, height: 630, alt: og!.alt[locale] }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
