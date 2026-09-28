import { getTranslations } from "next-intl/server";
import { CalendarCheck, ExternalLink } from "lucide-react";
import type { Locale, Source } from "@tve/content";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/format";

export async function LastVerified({ locale, date }: { locale: Locale; date: string }) {
  const t = await getTranslations({ locale, namespace: "common" });
  return (
    <p className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
      <CalendarCheck className="size-4 text-success" aria-hidden="true" />
      <time dateTime={date}>{t("lastVerified", { date: formatDate(locale, date) })}</time>
    </p>
  );
}

export async function SourcesList({
  locale,
  sources,
  lastVerified,
}: {
  locale: Locale;
  sources: Source[];
  lastVerified: string;
}) {
  if (!sources.length) return null;
  const t = await getTranslations({ locale, namespace: "common" });
  const a = await getTranslations({ locale, namespace: "a11y" });
  return (
    <section aria-labelledby="sources" className="card p-5">
      <h2 id="sources" className="text-lg">
        {t("sources")}
      </h2>
      <ul className="mt-3 space-y-2">
        {sources.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1.5 break-words"
            >
              <ExternalLink className="mt-1 size-4 shrink-0" aria-hidden="true" />
              <span>
                {s.label[locale]} <span className="sr-only">{a("opensInNewTab")}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <LastVerified locale={locale} date={lastVerified} />
        <Link href="/about" className="text-sm">
          {t("editorialLink")}
        </Link>
      </div>
    </section>
  );
}
