import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  Laptop,
  ListChecks,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
  Sun,
  Swords,
  Umbrella,
} from "lucide-react";
import { getAnnouncements, getArticle, getVisas } from "@tve/content";
import { Link } from "@/i18n/navigation";
import { ContentImage } from "@/components/ContentImage";
import { VisaCard } from "@/components/VisaCard";
import { FaqList } from "@/components/FaqList";
import { buildMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/format";
import { resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    path: "",
    title: t("homeTitle"),
    description: t("homeDescription"),
    imageId: "phi-phi-beach",
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "home" });
  const c = await getTranslations({ locale, namespace: "common" });
  const popular = getVisas(locale)
    .filter((v) => v.popular)
    .slice(0, 4);
  const faqs = getArticle("pages", "faq", locale)?.faqs.slice(0, 4) ?? [];
  const changes = getAnnouncements().slice(0, 3);

  const purposes = [
    {
      href: "/visa-finder?purpose=holiday",
      icon: Sun,
      title: t("purposeHoliday"),
      text: t("purposeHolidayText"),
    },
    {
      href: "/muay-thai",
      icon: Swords,
      title: t("purposeMuayThai"),
      text: t("purposeMuayThaiText"),
    },
    {
      href: "/digital-nomads",
      icon: Laptop,
      title: t("purposeNomad"),
      text: t("purposeNomadText"),
    },
    {
      href: "/business",
      icon: Briefcase,
      title: t("purposeBusiness"),
      text: t("purposeBusinessText"),
    },
    {
      href: "/visa-finder?purpose=retire",
      icon: Umbrella,
      title: t("purposeRetire"),
      text: t("purposeRetireText"),
    },
    {
      href: "/visa-finder?purpose=study",
      icon: GraduationCap,
      title: t("purposeStudy"),
      text: t("purposeStudyText"),
    },
    {
      href: "/visa-finder?purpose=family",
      icon: HeartHandshake,
      title: t("purposeFamily"),
      text: t("purposeFamilyText"),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <ContentImage id="phi-phi-beach" locale={locale} fill priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/85 via-[#0B1220]/65 to-[#0B1220]/25" />
        </div>
        <div className="container-page py-20 sm:py-28 lg:py-32">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur">
            <ShieldCheck className="size-4" aria-hidden="true" />
            {c("independentBadge")}
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl text-white sm:text-5xl">{t("heroTitle")}</h1>
          <p className="mt-5 max-w-xl text-lg text-white/90">{t("heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/visa-finder" className="btn btn-primary text-lg">
              <Sparkles className="size-5" aria-hidden="true" />
              {c("startFinder")}
            </Link>
            <Link href="/visas" className="btn border-2 border-white text-white hover:bg-white/10">
              {c("browseVisas")}
            </Link>
          </div>
        </div>
      </section>

      {/* Purpose tiles */}
      <section aria-labelledby="purpose" className="container-page py-14">
        <h2 id="purpose" className="text-3xl">
          {t("purposeTitle")}
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {purposes.map(({ href, icon: Icon, title, text }) => (
            <li key={href}>
              <Link
                href={href}
                className="card card-link flex h-full min-h-28 flex-col gap-2 p-4 text-foreground no-underline"
              >
                <Icon className="size-7 text-primary-strong" aria-hidden="true" />
                <span className="font-semibold">{title}</span>
                <span className="text-sm text-muted-foreground">{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Popular visas */}
      <section aria-labelledby="popular" className="bg-surface py-14">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="popular" className="text-3xl">
                {t("popularTitle")}
              </h2>
              <p className="mt-2 text-muted-foreground">{t("popularText")}</p>
            </div>
            <Link href="/visas" className="inline-flex min-h-11 items-center gap-1 font-semibold">
              {c("browseVisas")} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((v) => (
              <li key={v.slug}>
                <VisaCard visa={v} locale={locale} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how" className="container-page py-14">
        <h2 id="how" className="text-3xl">
          {t("howTitle")}
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            [MessageCircleQuestion, t("how1Title"), t("how1Text")],
            [Sparkles, t("how2Title"), t("how2Text")],
            [ListChecks, t("how3Title"), t("how3Text")],
          ].map(([Icon, title, text], i) => {
            const I = Icon as typeof Sparkles;
            return (
              <li key={i} className="card flex gap-4 p-5">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary font-bold"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="flex items-center gap-2 text-lg">
                    <I className="size-5 text-primary-strong" aria-hidden="true" />
                    {title as string}
                  </h3>
                  <p className="mt-1 text-muted-foreground">{text as string}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-8">
          <Link href="/visa-finder" className="btn btn-primary">
            {c("startFinder")}
          </Link>
        </div>
      </section>

      {/* Rule changes + trust */}
      <section className="bg-surface py-14">
        <div className="container-page grid gap-8 md:grid-cols-2">
          {changes.length > 0 && (
            <div>
              <h2 className="text-2xl">{t("changesTitle")}</h2>
              <ul className="mt-4 space-y-3">
                {changes.map((a) => (
                  <li key={a.id} className="card p-4">
                    <time dateTime={a.date} className="text-sm text-muted-foreground">
                      {formatDate(locale, a.date)}
                    </time>
                    <p className="mt-1 font-medium">
                      {a.href ? <Link href={a.href}>{a.text[locale]}</Link> : a.text[locale]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h2 className="text-2xl">{t("trustTitle")}</h2>
            <ul className="mt-4 space-y-3">
              {[t("trust1"), t("trust2"), t("trust3")].map((x) => (
                <li key={x} className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-4 inline-flex min-h-11 items-center">
              {c("editorialLink")}
            </Link>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <div className="container-page py-14">
          <FaqList faqs={faqs} title={t("faqTitle")} jsonLd={false} />
          <Link href="/faq" className="mt-4 inline-flex min-h-11 items-center gap-1 font-semibold">
            {t("faqMore")} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </>
  );
}
