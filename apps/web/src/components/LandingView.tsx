import { getTranslations } from "next-intl/server";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { getVisa, type Locale } from "@tve/content";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "./PageHeader";
import { VisaCard } from "./VisaCard";

interface Props {
  locale: Locale;
  path: string;
  title: string;
  intro: string;
  imageId: string;
  blocks: { title: string; text: string }[];
  listTitle?: string;
  list?: string[];
  note?: string;
  visas: string[];
  guide?: string;
  finderQuery: string;
}

/** Audience landing page (Muay Thai, digital nomads, business). */
export async function LandingView({
  locale,
  path,
  title,
  intro,
  imageId,
  blocks,
  listTitle,
  list,
  note,
  visas,
  guide,
  finderQuery,
}: Props) {
  const t = await getTranslations({ locale });
  const cards = visas.map((s) => getVisa(s, locale)).filter((v) => v !== undefined);
  return (
    <>
      <PageHeader
        locale={locale}
        title={title}
        intro={intro}
        crumbs={[{ label: title }]}
        path={path}
        imageId={imageId}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/visa-finder?${finderQuery}`} className="btn btn-primary">
            <Sparkles className="size-4" aria-hidden="true" />
            {t("common.startFinder")}
          </Link>
          {guide && (
            <Link href={`/guides/${guide}`} className="btn btn-secondary">
              {t("landing.readGuide")}
            </Link>
          )}
        </div>
      </PageHeader>
      <div className="container-page space-y-12 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {blocks.map((b) => (
            <section key={b.title} className="card p-5">
              <h2 className="text-xl">{b.title}</h2>
              <p className="mt-2 text-muted-foreground">{b.text}</p>
            </section>
          ))}
        </div>
        {list && listTitle && (
          <section aria-labelledby="list">
            <h2 id="list" className="text-2xl">
              {listTitle}
            </h2>
            <ul className="mt-4 space-y-2">
              {list.map((x) => (
                <li key={x} className="flex gap-2">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-success" aria-hidden="true" />
                  {x}
                </li>
              ))}
            </ul>
          </section>
        )}
        {note && <p className="card border-warning/40 p-4">{note}</p>}
        <section aria-labelledby="recommended">
          <h2 id="recommended" className="text-2xl">
            {t("landing.recommended")}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {await Promise.all(
              cards.map(async (v) => (
                <li key={v.slug}>
                  <VisaCard visa={v} locale={locale} />
                </li>
              )),
            )}
          </ul>
          <Link
            href="/compare"
            className="mt-4 inline-flex min-h-11 items-center gap-1 font-semibold"
          >
            {t("nav.compare")} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </>
  );
}
