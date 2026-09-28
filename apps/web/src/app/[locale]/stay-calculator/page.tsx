import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getVisas } from "@tve/content";
import { PageHeader } from "@/components/PageHeader";
import { StayCalculator } from "@/components/StayCalculator";
import { ClientMessages } from "@/components/ClientMessages";
import { buildMetadata } from "@/lib/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "stay" });
  return buildMetadata({
    locale,
    path: "stay-calculator",
    title: t("metaTitle"),
    description: t("metaDescription"),
    absoluteTitle: true,
  });
}

export default async function StayCalculatorPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale });
  const visas = getVisas(locale)
    .filter((v) => v.maxStayDays !== null)
    .map((v) => ({
      slug: v.slug,
      name: v.shortName,
      maxStayDays: v.maxStayDays!,
      extensionDays: v.extendable ? v.extensionDays : null,
    }));
  return (
    <>
      <PageHeader
        locale={locale}
        title={t("stay.title")}
        intro={t("stay.intro")}
        crumbs={[{ label: t("nav.stayCalculator") }]}
        path="stay-calculator"
      />
      <div className="container-page py-8">
        <ClientMessages locale={locale} namespaces={["stay", "common"]}>
          <StayCalculator visas={visas} />
        </ClientMessages>
      </div>
    </>
  );
}
