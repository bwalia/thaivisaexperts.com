import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LandingView } from "@/components/LandingView";
import { buildMetadata } from "@/lib/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "landing.nomads" });
  return buildMetadata({
    locale,
    path: "digital-nomads",
    title: t("metaTitle"),
    description: t("metaDescription"),
    imageId: "coworking-laptop",
    absoluteTitle: true,
  });
}

export default async function NomadsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "landing.nomads" });
  return (
    <LandingView
      locale={locale}
      path="digital-nomads"
      title={t("title")}
      intro={t("intro")}
      imageId="coworking-laptop"
      blocks={[]}
      listTitle={t("citiesTitle")}
      list={[t("chiangMai"), t("bangkok"), t("kohPhangan"), t("phuket")]}
      note={t("taxNote")}
      visas={["dtv", "ltr", "visa-exemption", "thailand-privilege"]}
      guide="digital-nomad-cities"
      finderQuery="purpose=remote-work&remote=yes"
    />
  );
}
