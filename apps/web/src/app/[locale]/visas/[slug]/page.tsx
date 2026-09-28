import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  GitCompare,
  Sparkles,
  XCircle,
} from "lucide-react";
import { LOCALES, getVisa, getVisaSlugs, type Locale } from "@tve/content";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Checklist } from "@/components/Checklist";
import { ClientMessages } from "@/components/ClientMessages";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { LastVerified, SourcesList } from "@/components/Sources";
import { TranslationNotice } from "@/components/TranslationNotice";
import { VisaCard } from "@/components/VisaCard";
import { ExpertHelpCta } from "@/components/ExpertHelpCta";
import { buildMetadata } from "@/lib/metadata";
import { formatNumber } from "@/lib/format";
import { resolveLocale } from "@/lib/page";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => getVisaSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const v = getVisa(slug, locale);
  if (!v) return {};
  return buildMetadata({
    locale,
    path: `visas/${slug}`,
    title: v.seoTitle,
    description: v.seoDescription,
    imageId: v.heroImage,
    absoluteTitle: true,
  });
}

export default async function VisaPage({ params }: Params) {
  const { slug } = await params;
  const locale: Locale = await resolveLocale(params);
  const v = getVisa(slug, locale);
  if (!v) notFound();
  const t = await getTranslations({ locale });
  const path = `visas/${slug}`;

  const facts: [string, string][] = [
    [
      t("visa.maxStay"),
      v.maxStayDays ? t("common.days", { count: v.maxStayDays }) : t("visa.noFixedLimit"),
    ],
    [
      t("visa.extendable"),
      v.extendable
        ? v.extensionDays
          ? t("visa.extendableYes", { days: t("common.days", { count: v.extensionDays }) })
          : t("visa.extendableYesNoDays")
        : t("visa.extendableNo"),
    ],
    [t("visa.entries"), t(`entries.${v.entries}`)],
    [t("visa.validity"), v.validity],
    [
      t("visa.fee"),
      (v.feeTHB === null
        ? t("common.varies")
        : v.feeTHB === 0
          ? t("common.free")
          : t("common.thb", { amount: formatNumber(locale, v.feeTHB) })) +
        (v.feeNote ? `. ${v.feeNote}` : ""),
    ],
    [t("visa.funds"), v.financialRequirement ?? t("common.none")],
    [t("visa.processing"), v.processingTime],
  ];
  const related = v.relatedVisas.map((s) => getVisa(s, locale)).filter((x) => x !== undefined);

  return (
    <>
      <PageHeader
        locale={locale}
        title={v.name}
        intro={v.summary}
        crumbs={[{ label: t("nav.visas"), href: "/visas" }, { label: v.shortName }]}
        path={path}
        imageId={v.heroImage}
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <LastVerified locale={locale} date={v.lastVerified} />
          <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
            {t(`categories.${v.category}`)}
          </span>
        </div>
        <TranslationNotice
          locale={locale}
          reviewStatus={v.reviewStatus}
          lastVerified={v.lastVerified}
          translatedFrom={v.translatedFrom}
          path={path}
        />
        {v.todo.length > 0 && (
          <p
            role="note"
            className="mt-4 flex gap-2 rounded-md border border-warning/40 bg-muted p-3 text-sm"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
            {t("visa.todoNotice")}
          </p>
        )}
      </PageHeader>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="glance">
            <h2 id="glance" className="text-2xl">
              {t("visa.atAGlance")}
            </h2>
            <dl className="card mt-4 divide-y divide-border">
              {facts.map(([k, val]) => (
                <div key={k} className="grid gap-1 p-4 sm:grid-cols-[12rem_1fr]">
                  <dt className="font-semibold text-muted-foreground">{k}</dt>
                  <dd>{val}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-muted-foreground">{v.extendableDetail}</p>
          </section>

          <section aria-labelledby="req">
            <h2 id="req" className="text-2xl">
              {t("visa.keyRequirements")}
            </h2>
            <ul className="mt-4 space-y-2">
              {v.keyRequirements.map((r) => (
                <li key={r} className="flex gap-2">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-success" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="docs" className="card p-5">
            <h2 id="docs" className="text-2xl">
              {t("visa.documents")}
            </h2>
            <div className="mt-2">
              <ClientMessages locale={locale} namespaces={["visa", "common"]}>
                <Checklist storageKey={`${slug}-${locale}`} items={v.documents} />
              </ClientMessages>
            </div>
          </section>

          <section aria-labelledby="apply">
            <h2 id="apply" className="text-2xl">
              {t("visa.howToApply")}
            </h2>
            <ol className="mt-4 space-y-4">
              {v.howToApply.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-on-primary"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{s.step}</h3>
                    <p className="text-muted-foreground">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "HowTo",
                name: `${t("visa.howToApply")}: ${v.shortName}`,
                inLanguage: locale,
                step: v.howToApply.map((s, i) => ({
                  "@type": "HowToStep",
                  position: i + 1,
                  name: s.step,
                  text: s.detail,
                })),
              }}
            />
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <section aria-labelledby="best" className="card p-5">
              <h2 id="best" className="text-xl">
                {t("visa.bestFor")}
              </h2>
              <ul className="mt-3 space-y-2">
                {v.bestFor.map((x) => (
                  <li key={x} className="flex gap-2">
                    <CheckCircle2
                      className="mt-1 size-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    {x}
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="not" className="card p-5">
              <h2 id="not" className="text-xl">
                {t("visa.notFor")}
              </h2>
              <ul className="mt-3 space-y-2">
                {v.notFor.map((x) => (
                  <li key={x} className="flex gap-2">
                    <XCircle className="mt-1 size-4 shrink-0 text-destructive" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section aria-labelledby="mistakes">
            <h2 id="mistakes" className="text-2xl">
              {t("visa.commonMistakes")}
            </h2>
            <ul className="mt-4 space-y-2">
              {v.commonMistakes.map((x) => (
                <li key={x} className="flex gap-2">
                  <AlertTriangle className="mt-1 size-5 shrink-0 text-warning" aria-hidden="true" />
                  {x}
                </li>
              ))}
            </ul>
          </section>

          <FaqList faqs={v.faqs} title={t("common.faqs")} />
          <SourcesList locale={locale} sources={v.officialSources} lastVerified={v.lastVerified} />
        </div>

        <aside className="no-print space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card space-y-2 p-5">
            <Link href={`/visa-finder`} className="btn btn-primary w-full">
              <Sparkles className="size-4" aria-hidden="true" />
              {t("visa.checkEligibility")}
            </Link>
            <Link
              href={`/compare?v=${slug}${v.relatedVisas[0] ? `,${v.relatedVisas[0]}` : ""}`}
              className="btn btn-secondary w-full"
            >
              <GitCompare className="size-4" aria-hidden="true" />
              {t("visa.compareWith")}
            </Link>
            {v.maxStayDays && (
              <Link href={`/stay-calculator?visa=${slug}`} className="btn btn-ghost w-full">
                <Calculator className="size-4" aria-hidden="true" />
                {t("visa.calculateStay")}
              </Link>
            )}
          </div>
          <ExpertHelpCta locale={locale} />
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="container-page pb-10">
          <h2 id="related" className="text-2xl">
            {t("common.relatedVisas")}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {await Promise.all(
              related.slice(0, 3).map(async (r) => (
                <li key={r.slug}>
                  <VisaCard visa={r} locale={locale} />
                </li>
              )),
            )}
          </ul>
        </section>
      )}

      {/* Sticky mobile CTA */}
      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 p-3 backdrop-blur lg:hidden">
        <Link href="/visa-finder" className="btn btn-primary w-full">
          {t("common.startFinder")} <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </>
  );
}
