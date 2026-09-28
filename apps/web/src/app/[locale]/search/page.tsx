import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getArticles, getVisas } from "@tve/content";
import { PageHeader } from "@/components/PageHeader";
import { SearchBox, type SearchItem } from "@/components/SearchBox";
import { ClientMessages } from "@/components/ClientMessages";
import { buildMetadata } from "@/lib/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "search" });
  return {
    ...buildMetadata({
      locale,
      path: "search",
      title: t("metaTitle"),
      description: t("metaDescription"),
      absoluteTitle: true,
    }),
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale });
  // Per-locale index, built at build time and shipped with the page.
  const items: SearchItem[] = [
    ...getVisas(locale).map((v) => ({
      href: `/visas/${v.slug}`,
      type: "visa" as const,
      title: v.name,
      summary: v.summary,
      text: [v.shortName, v.slug, ...v.bestFor, ...v.faqs.map((f) => f.q)].join(" "),
    })),
    ...getArticles("guides", locale).map((g) => ({
      href: `/guides/${g.slug}`,
      type: "guide" as const,
      title: g.title,
      summary: g.summary,
      text: [g.slug, ...g.sections.map((s) => s.heading), ...g.faqs.map((f) => f.q)].join(" "),
    })),
  ];
  return (
    <>
      <PageHeader
        locale={locale}
        title={t("search.title")}
        crumbs={[{ label: t("nav.search") }]}
        path="search"
      />
      <div className="container-page py-8">
        <ClientMessages locale={locale} namespaces={["search"]}>
          <SearchBox items={items} />
        </ClientMessages>
      </div>
    </>
  );
}
