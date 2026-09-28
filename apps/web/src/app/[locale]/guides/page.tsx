import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getArticles } from "@tve/content";
import { Link } from "@/i18n/navigation";
import { ContentImage } from "@/components/ContentImage";
import { PageHeader } from "@/components/PageHeader";
import { buildMetadata } from "@/lib/metadata";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "guides" });
  return buildMetadata({
    locale,
    path: "guides",
    title: t("metaTitle"),
    description: t("metaDescription"),
    absoluteTitle: true,
  });
}

export default async function GuidesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale });
  const guides = getArticles("guides", locale);
  return (
    <>
      <PageHeader
        locale={locale}
        title={t("guides.title")}
        intro={t("guides.intro")}
        crumbs={[{ label: t("nav.guides") }]}
        path="guides"
      />
      <div className="container-page py-8">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <li key={g.slug}>
              <article className="card card-link relative flex h-full flex-col overflow-hidden">
                {g.heroImage && (
                  <div className="relative aspect-[16/9]">
                    <ContentImage
                      id={g.heroImage}
                      locale={locale}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-xl">
                    <Link
                      href={`/guides/${g.slug}`}
                      className="text-foreground no-underline after:absolute after:inset-0 after:content-['']"
                    >
                      {g.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-muted-foreground">{g.summary}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
