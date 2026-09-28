import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getImages } from "@tve/content";
import { ContentImage } from "@/components/ContentImage";
import { PageHeader } from "@/components/PageHeader";
import { buildMetadata } from "@/lib/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "credits" });
  return buildMetadata({
    locale,
    path: "credits",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

/** Generated from packages/content/images.json. */
export default async function CreditsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale });
  return (
    <>
      <PageHeader
        locale={locale}
        title={t("credits.title")}
        intro={t("credits.intro")}
        crumbs={[{ label: t("nav.credits") }]}
        path="credits"
      />
      <div className="container-page py-8">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {getImages().map((img) => (
            <li key={img.id} className="card overflow-hidden">
              <div className="relative aspect-[4/3]">
                <ContentImage
                  id={img.id}
                  locale={locale}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="p-4 text-sm">
                <p>
                  <a href={img.creditUrl} rel="noopener noreferrer" target="_blank">
                    {t("credits.by", { name: img.credit })}
                  </a>{" "}
                  <a href={img.sourceUrl} rel="noopener noreferrer" target="_blank">
                    {t("credits.on", {
                      source: img.licence.startsWith("Pexels")
                        ? "Pexels"
                        : img.licence.startsWith("Unsplash")
                          ? "Unsplash"
                          : "—",
                    })}
                  </a>
                </p>
                <p className="text-muted-foreground">
                  {t("credits.licence", { licence: img.licence })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
