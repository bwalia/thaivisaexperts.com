import { getTranslations } from "next-intl/server";
import { ShieldCheck } from "lucide-react";
import type { Locale } from "@tve/content";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const n = await getTranslations({ locale, namespace: "nav" });
  const a = await getTranslations({ locale, namespace: "a11y" });

  const groups = [
    {
      title: t("explore"),
      links: [
        ["/visa-finder", n("visaFinder")],
        ["/visas", n("visas")],
        ["/compare", n("compare")],
        ["/stay-calculator", n("stayCalculator")],
        ["/guides", n("guides")],
      ],
    },
    {
      title: t("audiences"),
      links: [
        ["/muay-thai", n("muayThai")],
        ["/digital-nomads", n("digitalNomads")],
        ["/business", n("business")],
        ["/faq", n("faq")],
      ],
    },
    {
      title: t("company"),
      links: [
        ["/about", n("about")],
        ["/contact", n("contact")],
        ["/privacy", n("privacy")],
        ["/terms", n("terms")],
        ["/disclaimer", n("disclaimer")],
        ["/credits", n("credits")],
      ],
    },
  ] as const;

  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="container-page py-10">
        <nav aria-label={a("footerNav")} className="grid gap-8 sm:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="text-sm font-semibold text-foreground">{g.title}</h2>
              <ul className="mt-3 space-y-1">
                {g.links.map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="inline-flex min-h-11 items-center text-sm text-muted-foreground no-underline hover:text-primary-strong hover:underline sm:min-h-8"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6">
          <p className="flex items-start gap-2 text-sm font-medium text-foreground">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
            {t("notGovernment")}
          </p>
          <p className="max-w-3xl text-sm text-muted-foreground">{t("disclaimer")}</p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
            <LanguageSwitcher id="lang-switcher-footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
