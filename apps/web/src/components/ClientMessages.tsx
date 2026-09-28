import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, type Locale } from "@tve/content";

/** Namespaces used by client components on every page (header/footer). */
const BASE = ["language", "theme", "announcement"];

/**
 * Sends only the message namespaces that client components need, instead of the whole
 * catalogue, which keeps the HTML/RSC payload small (the Thai catalogue alone is ~40 KB).
 */
export function ClientMessages({
  locale,
  namespaces = [],
  children,
}: {
  locale: Locale;
  namespaces?: string[];
  children: ReactNode;
}) {
  const all = getMessages(locale);
  const messages = Object.fromEntries([...BASE, ...namespaces].map((ns) => [ns, all[ns]]));
  return (
    <NextIntlClientProvider locale={locale} messages={messages as Record<string, never>}>
      {children}
    </NextIntlClientProvider>
  );
}
