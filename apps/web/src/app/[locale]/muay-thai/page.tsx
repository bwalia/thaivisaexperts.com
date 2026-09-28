import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LandingView } from "@/components/LandingView";
import { buildMetadata } from "@/lib/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "landing.muayThai" });
  return buildMetadata({
    locale,
    path: "muay-thai",
    title: t("metaTitle"),
    description: t("metaDescription"),
    imageId: "muay-thai-training",
    absoluteTitle: true,
  });
}

export default async function MuayThaiPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "landing.muayThai" });
  return (
    <LandingView
      locale={locale}
      path="muay-thai"
      title={t("title")}
      intro={t("intro")}
      imageId="muay-thai-training"
      blocks={[
        { title: t("shortTitle"), text: t("shortText") },
        { title: t("longTitle"), text: t("longText") },
      ]}
      listTitle={t("tipsTitle")}
      list={[t("tip1"), t("tip2"), t("tip3")]}
      visas={["dtv", "non-ed", "visa-exemption", "tourist-tr"]}
      guide="muay-thai-visa-guide"
      finderQuery="purpose=muay-thai"
    />
  );
}
