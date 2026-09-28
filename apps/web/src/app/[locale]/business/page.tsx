import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LandingView } from "@/components/LandingView";
import { buildMetadata } from "@/lib/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "landing.business" });
  return buildMetadata({
    locale,
    path: "business",
    title: t("metaTitle"),
    description: t("metaDescription"),
    imageId: "business-district",
    absoluteTitle: true,
  });
}

export default async function BusinessPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "landing.business" });
  return (
    <LandingView
      locale={locale}
      path="business"
      title={t("title")}
      intro={t("intro")}
      imageId="business-district"
      blocks={[
        { title: t("meetingsTitle"), text: t("meetingsText") },
        { title: t("workTitle"), text: t("workText") },
        { title: t("talentTitle"), text: t("talentText") },
      ]}
      visas={["non-b-business", "ltr", "smart", "dtv"]}
      finderQuery="purpose=business-meeting"
    />
  );
}
