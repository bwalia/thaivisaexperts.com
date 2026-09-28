import { getTranslations } from "next-intl/server";
import { ArrowRight, CalendarDays, Wallet } from "lucide-react";
import type { Locale, Visa } from "@tve/content";
import { Link } from "@/i18n/navigation";
import { formatNumber } from "@/lib/format";

export async function VisaCard({
  visa,
  locale,
  headingLevel = 3,
}: {
  visa: Visa;
  locale: Locale;
  headingLevel?: 2 | 3;
}) {
  const t = await getTranslations({ locale });
  const H = `h${headingLevel}` as const;
  const stay = visa.maxStayDays
    ? t("common.days", { count: visa.maxStayDays })
    : t("visa.noFixedLimit");
  const fee =
    visa.feeTHB === null
      ? t("common.varies")
      : visa.feeTHB === 0
        ? t("common.free")
        : t("common.thb", { amount: formatNumber(locale, visa.feeTHB) });
  return (
    <article className="card card-link relative flex h-full flex-col p-5">
      <p className="text-xs font-semibold text-primary-strong">
        {t(`categories.${visa.category}`)}
      </p>
      <H className="mt-1 text-xl">
        <Link
          href={`/visas/${visa.slug}`}
          className="text-foreground no-underline after:absolute after:inset-0 after:content-['']"
        >
          {visa.shortName}
        </Link>
      </H>
      <p className="mt-2 flex-1 text-muted-foreground line-clamp-4">{visa.summary}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="flex items-center gap-1 text-muted-foreground">
            <CalendarDays className="size-4" aria-hidden="true" />
            {t("visa.maxStay")}
          </dt>
          <dd className="font-semibold">{stay}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-muted-foreground">
            <Wallet className="size-4" aria-hidden="true" />
            {t("visa.fee")}
          </dt>
          <dd className="font-semibold">{fee}</dd>
        </div>
      </dl>
      <span
        className="mt-4 inline-flex items-center gap-1 font-semibold text-primary-strong"
        aria-hidden="true"
      >
        {t("common.viewVisa")} <ArrowRight className="size-4" />
      </span>
    </article>
  );
}
