import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Noto_Sans_Thai } from "next/font/google";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAnnouncements, type Locale } from "@tve/content";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { ClientMessages } from "@/components/ClientMessages";
import { SITE_URL, absoluteUrl } from "@/lib/site";

// Noto Sans Thai includes Latin, so one family serves en/fr/nl/th (see design-system MASTER.md).
const noto = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-thai",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F0F9FF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1220" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("siteName"), template: `%s | ${t("siteName")}` },
    description: t("homeDescription"),
    applicationName: t("siteName"),
    icons: { icon: "/icon.svg" },
  };
}

// Applies the saved theme before first paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem("tve-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  const ta = await getTranslations({ locale, namespace: "a11y" });
  const announcement = getAnnouncements().find((a) => a.active);

  return (
    <html lang={locale} className={noto.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <ClientMessages locale={locale as Locale}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:shadow-lg"
          >
            {ta("skipToContent")}
          </a>
          {announcement && (
            <AnnouncementBar
              id={announcement.id}
              text={announcement.text[locale as Locale]}
              href={announcement.href}
            />
          )}
          <SiteHeader locale={locale as Locale} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter locale={locale as Locale} />
        </ClientMessages>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#org`,
                name: t("siteName"),
                url: SITE_URL,
                logo: `${SITE_URL}/icon.svg`,
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                name: t("siteName"),
                url: absoluteUrl(locale as Locale),
                inLanguage: locale,
                publisher: { "@id": `${SITE_URL}/#org` },
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${absoluteUrl(locale as Locale, "search")}?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
            ],
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
