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
  es: "Español",
  de: "Deutsch",
  pt: "Português",
  ru: "Русский",
  zh: "简体中文",
  ja: "日本語",
  ko: "한국어",
  hi: "हिन्दी",
  pa: "ਪੰਜਾਬੀ",
  ar: "العربية",
  ms: "Bahasa Melayu",
  vi: "Tiếng Việt",
};

export const OG_LOCALES: Record<Locale, string> = {
  en: "en_GB",
  fr: "fr_FR",
  nl: "nl_NL",
  th: "th_TH",
  es: "es_ES",
  de: "de_DE",
  pt: "pt_BR",
  ru: "ru_RU",
  zh: "zh_CN",
  ja: "ja_JP",
  ko: "ko_KR",
  hi: "hi_IN",
  pa: "pa_IN",
  ar: "ar_AR",
  ms: "ms_MY",
  vi: "vi_VN",
};

/** hreflang values (BCP 47). Chinese is Simplified, so tag the script. */
export const HREFLANG: Record<Locale, string> = {
  en: "en",
  fr: "fr",
  nl: "nl",
  th: "th",
  es: "es",
  de: "de",
  pt: "pt",
  ru: "ru",
  zh: "zh-Hans",
  ja: "ja",
  ko: "ko",
  hi: "hi",
  pa: "pa",
  ar: "ar",
  ms: "ms",
  vi: "vi",
};

/** Absolute URL for a locale-relative path ("/visas/dtv" → https://…/en/visas/dtv/). */
export function absoluteUrl(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/|\/$/g, "");
  return `${SITE_URL}/${locale}/${clean ? `${clean}/` : ""}`;
}
