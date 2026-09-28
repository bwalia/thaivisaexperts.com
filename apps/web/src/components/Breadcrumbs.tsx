import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import type { Locale } from "@tve/content";
import { Link } from "@/i18n/navigation";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "./JsonLd";

export interface Crumb {
  label: string;
  /** Locale-relative path; omit for the current page. */
  href?: string;
}

export async function Breadcrumbs({
  locale,
  items,
  path,
}: {
  locale: Locale;
  items: Crumb[];
  path: string;
}) {
  const t = await getTranslations({ locale, namespace: "a11y" });
  const n = await getTranslations({ locale, namespace: "nav" });
  const all: Crumb[] = [{ label: n("home"), href: "/" }, ...items];
  return (
    <>
      <nav aria-label={t("breadcrumb")} className="text-sm">
        <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
          {all.map((c, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5" aria-hidden="true" />}
              {c.href ? (
                <Link href={c.href} className="text-muted-foreground hover:text-primary-strong">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-foreground">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            item: absoluteUrl(locale, c.href ?? path),
          })),
        }}
      />
    </>
  );
}
