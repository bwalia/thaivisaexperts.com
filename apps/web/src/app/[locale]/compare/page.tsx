import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getVisas } from "@tve/content";
import { PageHeader } from "@/components/PageHeader";
import { CompareTool } from "@/components/CompareTool";
import { ClientMessages } from "@/components/ClientMessages";
import { buildMetadata } from "@/lib/metadata";
import { displayFacts, type DisplayFacts } from "@/lib/visa-display";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "compare" });
  return buildMetadata({
    locale,
    path: "compare",
    title: t("metaTitle"),
    description: t("metaDescription"),
    absoluteTitle: true,
  });
}

export default async function ComparePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale });
  const visas = getVisas(locale).map((v) => ({
    slug: v.slug,
    name: v.shortName,
    facts: displayFacts(v, locale, t),
  }));
  const rows: { key: keyof DisplayFacts; label: string }[] = [
    { key: "category", label: t("compare.category") },
    { key: "maxStay", label: t("visa.maxStay") },
    { key: "extension", label: t("visa.extendable") },
    { key: "entries", label: t("visa.entries") },
    { key: "validity", label: t("visa.validity") },
    { key: "fee", label: t("visa.fee") },
    { key: "funds", label: t("visa.funds") },
    { key: "remoteWork", label: t("compare.remoteWork") },
    { key: "localWork", label: t("compare.localWork") },
    { key: "minAge", label: t("compare.minAge") },
    { key: "processing", label: t("visa.processing") },
  ];
  return (
    <>
      <PageHeader
        locale={locale}
        title={t("compare.title")}
        intro={t("compare.intro")}
        crumbs={[{ label: t("nav.compare") }]}
        path="compare"
      />
      <div className="container-page py-8">
        <ClientMessages locale={locale} namespaces={["compare", "common"]}>
          <CompareTool visas={visas} rows={rows} />
        </ClientMessages>
      </div>
    </>
  );
}
