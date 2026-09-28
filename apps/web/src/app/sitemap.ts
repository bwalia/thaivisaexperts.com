import type { MetadataRoute } from "next";
import { LOCALES, getArticleSlugs, getVisa, getVisaSlugs, getArticle } from "@tve/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const STATIC_PATHS = [
  "",
  "visa-finder",
  "visas",
  "compare",
  "stay-calculator",
  "guides",
  "muay-thai",
  "digital-nomads",
  "business",
  "contact",
  "credits",
];

/** Every page in every locale, each with hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: { path: string; lastModified?: string }[] = [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...getVisaSlugs().map((s) => ({
      path: `visas/${s}`,
      lastModified: getVisa(s, "en")!.lastVerified,
    })),
    ...getArticleSlugs("guides").map((s) => ({
      path: `guides/${s}`,
      lastModified: getArticle("guides", s, "en")!.lastVerified,
    })),
    ...getArticleSlugs("pages").map((s) => ({
      path: s,
      lastModified: getArticle("pages", s, "en")!.lastVerified,
    })),
  ];
  return entries.flatMap(({ path, lastModified }) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(locale, path),
      lastModified,
      alternates: {
        languages: {
          ...Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(l, path)])),
          "x-default": absoluteUrl("en", path),
        },
      },
    })),
  );
}
