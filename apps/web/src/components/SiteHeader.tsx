import { getTranslations } from "next-intl/server";
import { Search } from "lucide-react";
import type { Locale } from "@tve/content";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

export const NAV_ITEMS = [
  { href: "/visa-finder", key: "visaFinder" },
  { href: "/visas", key: "visas" },
  { href: "/muay-thai", key: "muayThai" },
  { href: "/digital-nomads", key: "digitalNomads" },
  { href: "/business", key: "business" },
  { href: "/guides", key: "guides" },
  { href: "/faq", key: "faq" },
] as const;

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const ta = await getTranslations({ locale, namespace: "a11y" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const items = NAV_ITEMS.map((i) => ({ href: i.href, label: t(i.key) }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <div className="container-page flex h-16 items-center gap-2">
        <Link href="/" className="mr-auto rounded-md no-underline" aria-label={tm("siteName")}>
          <Logo name={tm("siteName")} />
        </Link>
        <nav aria-label={ta("mainNav")} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {items.map((i) => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  className="inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-2.5 text-sm font-medium text-foreground no-underline hover:bg-muted"
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/search"
          className="btn btn-ghost !px-2"
          aria-label={t("search")}
          title={t("search")}
        >
          <Search className="size-5" aria-hidden="true" />
        </Link>
        <div className="hidden sm:flex">
          <LanguageSwitcher />
        </div>
        <ThemeToggle />
        <MobileMenu
          items={items}
          openLabel={ta("openMenu")}
          closeLabel={ta("closeMenu")}
          navLabel={ta("mainNav")}
        />
      </div>
    </header>
  );
}
