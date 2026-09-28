"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { LOCALES, type Locale } from "@tve/content/locales";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_NAMES } from "@/lib/site";

/**
 * Switches language on the same page, keeping query parameters (e.g. Visa Finder answers).
 * Uses a native <select> for accessibility; languages are named in their own language, no flags.
 */
export function LanguageSwitcher({ id = "lang-switcher" }: { id?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("language");

  function change(next: Locale) {
    try {
      localStorage.setItem("tve-locale", next);
    } catch {
      /* storage unavailable */
    }
    // Same page in the new language; keep the query (e.g. Visa Finder answers).
    router.replace(`${pathname}${window.location.search}`, { locale: next });
  }

  return (
    <div className="relative flex items-center">
      <label htmlFor={id} className="sr-only">
        {t("switchTo")}
      </label>
      <Languages
        className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground"
        aria-hidden="true"
      />
      <select
        id={id}
        value={locale}
        onChange={(e) => change(e.target.value as Locale)}
        className="min-h-11 cursor-pointer appearance-none rounded-md border border-border bg-surface py-1 pl-8 pr-3 text-sm font-medium text-foreground hover:bg-muted"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} lang={l}>
            {LOCALE_NAMES[l]}
          </option>
        ))}
      </select>
    </div>
  );
}
