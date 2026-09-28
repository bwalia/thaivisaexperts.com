import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LOCALES, getArticle, getArticleSlugs } from "@tve/content";
import { ArticleView } from "@/components/ArticleView";
import { buildMetadata } from "@/lib/metadata";
import { resolveLocale } from "@/lib/page";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => getArticleSlugs("guides").map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const g = getArticle("guides", slug, locale);
  if (!g) return {};
  return buildMetadata({
    locale,
    path: `guides/${slug}`,
    title: g.seoTitle,
    description: g.seoDescription,
    imageId: g.heroImage,
    absoluteTitle: true,
  });
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const g = getArticle("guides", slug, locale);
  if (!g) notFound();
  const t = await getTranslations({ locale, namespace: "nav" });
  return (
    <ArticleView
      article={g}
      locale={locale}
      path={`guides/${slug}`}
      crumbs={[{ label: t("guides"), href: "/guides" }, { label: g.title }]}
      toc
    />
  );
}
