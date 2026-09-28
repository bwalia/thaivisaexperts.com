import type { Locale } from "@tve/content";

/** BCP 47 tags used for Intl formatting (en → British English, matching the site copy). */
export const intlLocale: Record<Locale, string> = {
  en: "en-GB",
  fr: "fr-FR",
  nl: "nl-NL",
  th: "th-TH",
};

export function formatNumber(locale: Locale, n: number): string {
  return new Intl.NumberFormat(intlLocale[locale]).format(n);
}

/**
 * Human date. Thai uses the Gregorian calendar with the Buddhist Era year alongside,
 * e.g. "28 ก.ย. 2026 (พ.ศ. 2569)", because Thai immigration forms use B.E.
 */
export function formatDate(locale: Locale, iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  };
  if (locale === "th") {
    const greg = new Intl.DateTimeFormat("th-TH-u-ca-gregory", opts).format(d);
    return `${greg} (พ.ศ. ${d.getUTCFullYear() + 543})`;
  }
  return new Intl.DateTimeFormat(intlLocale[locale], opts).format(d);
}

export function countryName(locale: Locale, code: string): string {
  try {
    return new Intl.DisplayNames([intlLocale[locale]], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
