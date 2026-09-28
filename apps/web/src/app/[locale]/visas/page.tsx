import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PURPOSES, getVisas, type Visa } from "@tve/content";
import { PageHeader } from "@/components/PageHeader";
import { VisaCard } from "@/components/VisaCard";
import { VisaFilters, type FilterItem } from "@/components/VisaFilters";
import { ClientMessages } from "@/components/ClientMessages";
import { buildMetadata } from "@/lib/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "visas" });
  return buildMetadata({
    locale,
    path: "visas",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

function stayBucket(v: Visa): FilterItem["stay"] {
  const total = v.maxStayDays === null ? Infinity : v.maxStayDays + (v.extensionDays ?? 0);
  if (total <= 90) return "short";
  if (total <= 365 && (v.validityMonths ?? 0) <= 12) return "medium";
  return "long";
}

function budgetBucket(v: Visa): FilterItem["budget"] {
  if (!v.minFundsTHB) return "none";
  return v.minFundsTHB < 1_000_000 ? "under1m" : "any";
}

export default async function VisasPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale });
  const visas = getVisas(locale);
  const items = visas.map((v) => ({
    slug: v.slug,
    purposes: v.purposes,
    stay: stayBucket(v),
    budget: budgetBucket(v),
  }));
  const cards = await Promise.all(visas.map((v) => VisaCard({ visa: v, locale, headingLevel: 2 })));

  return (
    <>
      <PageHeader
        locale={locale}
        title={t("visas.title")}
        intro={t("visas.intro")}
        crumbs={[{ label: t("nav.visas") }]}
        path="visas"
      />
      <div className="container-page py-8">
        <ClientMessages locale={locale} namespaces={["visas"]}>
          <VisaFilters
            items={items}
            cards={cards}
            purposes={PURPOSES.map((p) => ({ id: p, label: t(`purposes.${p}`) }))}
          />
        </ClientMessages>
      </div>
    </>
  );
}
