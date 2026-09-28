import type { Locale } from "@tve/content";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://thaivisaexperts.com").replace(
  /\/$/,
  "",
);
export const CONTACT_EMAIL = "hello@thaivisaexperts.com";

/** Language names in their own language — never flags. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  nl: "Nederlands",
  th: "ไทย",
};

export const OG_LOCALES: Record<Locale, string> = {
  en: "en_GB",
  fr: "fr_FR",
  nl: "nl_NL",
  th: "th_TH",
};

/** Absolute URL for a locale-relative path ("/visas/dtv" → https://…/en/visas/dtv/). */
export function absoluteUrl(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/|\/$/g, "");
  return `${SITE_URL}/${locale}/${clean ? `${clean}/` : ""}`;
}
