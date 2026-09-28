import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getArticle } from "@tve/content";
import { ArticleView } from "@/components/ArticleView";
import { buildMetadata } from "./metadata";
import { resolveLocale, type LocaleParams } from "./page";

/** Builds a static content page (packages/content/pages/<slug>) with metadata. */
export function articlePage(slug: string) {
  async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
    const locale = await resolveLocale(params);
    const a = getArticle("pages", slug, locale);
    if (!a) return {};
    return buildMetadata({
      locale,
      path: slug,
      title: a.seoTitle,
      description: a.seoDescription,
      imageId: a.heroImage,
      absoluteTitle: true,
    });
  }
  async function Page({ params }: LocaleParams) {
    const locale = await resolveLocale(params);
    const a = getArticle("pages", slug, locale);
    if (!a) notFound();
    const t = await getTranslations({ locale, namespace: "nav" });
    const label = t.has(slug) ? t(slug as "about") : a.title;
    return <ArticleView article={a} locale={locale} path={slug} crumbs={[{ label }]} />;
  }
  return { generateMetadata, Page };
}
