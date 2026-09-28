import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PURPOSES, getAllVisaFacts, getCountries, getVisas } from "@tve/content";
import { PageHeader } from "@/components/PageHeader";
import { VisaFinder } from "@/components/VisaFinder";
import { ClientMessages } from "@/components/ClientMessages";
import { buildMetadata } from "@/lib/metadata";
import { countryName } from "@/lib/format";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "finder" });
  return buildMetadata({
    locale,
    path: "visa-finder",
    title: t("metaTitle"),
    description: t("metaDescription"),
    absoluteTitle: true,
  });
}

export default async function VisaFinderPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "finder" });
  const { countries } = getCountries();
  const collator = new Intl.Collator(locale);
  const countryNames = countries
    .map((c) => ({ code: c.code, name: countryName(locale, c.code) }))
    .sort((x, y) => collator.compare(x.name, y.name));
  const visaText = Object.fromEntries(
    getVisas(locale).map((v) => [v.slug, { name: v.name, summary: v.summary }]),
  );
  // Purposes shown in the wizard (invest is covered by LTR/Privilege under other purposes).
  const purposes = PURPOSES.filter((p) => p !== "invest");

  return (
    <>
      <PageHeader
        locale={locale}
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title") }]}
        path="visa-finder"
      />
      <div className="container-page max-w-3xl py-8">
        <ClientMessages locale={locale} namespaces={["finder", "purposes", "common"]}>
          <VisaFinder
            visas={getAllVisaFacts()}
            countries={countries}
            countryNames={countryNames}
            visaText={visaText}
            purposes={purposes}
          />
        </ClientMessages>
      </div>
    </>
  );
}
