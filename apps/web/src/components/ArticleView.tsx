import { getTranslations } from "next-intl/server";
import { getVisa, type Article, type Locale } from "@tve/content";
import { ArticleBody, sectionId } from "./ArticleBody";
import type { Crumb } from "./Breadcrumbs";
import { FaqList } from "./FaqList";
import { PageHeader } from "./PageHeader";
import { LastVerified, SourcesList } from "./Sources";
import { TranslationNotice } from "./TranslationNotice";
import { VisaCard } from "./VisaCard";

interface Props {
  article: Article;
  locale: Locale;
  path: string;
  crumbs: Crumb[];
  /** Show the "on this page" table of contents (guides). */
  toc?: boolean;
}

/** Shared layout for guides and static pages (about, FAQ, privacy, terms, disclaimer). */
export async function ArticleView({ article, locale, path, crumbs, toc = false }: Props) {
  const t = await getTranslations({ locale, namespace: "common" });
  const related = article.relatedVisas
    .map((s) => getVisa(s, locale))
    .filter((v) => v !== undefined);
  const showToc = toc && article.sections.length > 2;

  return (
    <>
      <PageHeader
        locale={locale}
        title={article.title}
        intro={article.summary}
        crumbs={crumbs}
        path={path}
        imageId={article.heroImage}
      >
        <div className="mt-4">
          <LastVerified locale={locale} date={article.lastVerified} />
        </div>
        <TranslationNotice
          locale={locale}
          reviewStatus={article.reviewStatus}
          lastVerified={article.lastVerified}
          translatedFrom={article.translatedFrom}
          path={path}
        />
      </PageHeader>
      <div
        className={`container-page grid gap-10 py-10 ${showToc ? "lg:grid-cols-[1fr_16rem]" : ""}`}
      >
        <div className="min-w-0 space-y-12">
          <ArticleBody sections={article.sections} />
          <FaqList faqs={article.faqs} title={t("faqs")} />
          <SourcesList
            locale={locale}
            sources={article.officialSources}
            lastVerified={article.lastVerified}
          />
        </div>
        {showToc && (
          <nav
            aria-labelledby="toc"
            className="order-first lg:order-none lg:sticky lg:top-24 lg:self-start"
          >
            <h2 id="toc" className="text-sm font-semibold text-muted-foreground">
              {t("onThisPage")}
            </h2>
            <ol className="mt-2 space-y-1 border-l-2 border-border pl-3 text-sm">
              {article.sections.map((s, i) => (
                <li key={i}>
                  <a
                    href={`#${sectionId(i)}`}
                    className="inline-flex min-h-8 items-center text-muted-foreground hover:text-primary-strong"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
      {related.length > 0 && (
        <section aria-labelledby="related" className="container-page pb-10">
          <h2 id="related" className="text-2xl">
            {t("relatedVisas")}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {await Promise.all(
              related.map(async (v) => (
                <li key={v.slug}>
                  <VisaCard visa={v} locale={locale} />
                </li>
              )),
            )}
          </ul>
        </section>
      )}
    </>
  );
}
