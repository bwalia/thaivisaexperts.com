import { defineRouting } from "next-intl/routing";
import { LOCALES, DEFAULT_LOCALE } from "@tve/content/locales";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
});
