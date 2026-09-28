import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@tve/content";
import { routing } from "@/i18n/routing";

export type LocaleParams = { params: Promise<{ locale: string }> };

/** Validates the locale param and enables static rendering for it. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}
