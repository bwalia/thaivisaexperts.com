"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertTriangle, CalendarClock } from "lucide-react";
import { calculateStay, parseISODate } from "@tve/visa-logic";
import type { Locale } from "@tve/content/schema";
import { intlLocale } from "@/lib/format";
import { replaceSearch, useIsClient, useSearchString } from "@/lib/client-store";

export interface StayVisa {
  slug: string;
  name: string;
  maxStayDays: number;
  extensionDays: number | null;
}

function todayISO() {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
}

export function StayCalculator({ visas }: { visas: StayVisa[] }) {
  const t = useTranslations("stay");
  const c = useTranslations("common");
  const locale = useLocale() as Locale;
  // Visa and arrival date live in the URL (shareable); days default to the visa's limit until edited.
  const params = new URLSearchParams(useSearchString());
  const isClient = useIsClient();
  const visa = visas.find((x) => x.slug === params.get("visa")) ?? visas[0];
  const slug = visa?.slug ?? "";
  const arrival = params.get("arrival") ?? (isClient ? todayISO() : "");
  const [daysDraft, setDaysDraft] = useState<{ slug: string; value: string } | null>(null);
  const days =
    daysDraft && daysDraft.slug === slug ? daysDraft.value : String(visa?.maxStayDays ?? 30);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(window.location.search);
    next.set(key, value);
    replaceSearch(next);
  }
  const fmt = useMemo(() => {
    const df = new Intl.DateTimeFormat(
      locale === "th" ? "th-TH-u-ca-gregory" : intlLocale[locale],
      {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      },
    );
    return (iso: string) => {
      const d = new Date(`${iso}T00:00:00Z`);
      const s = df.format(d);
      return locale === "th" ? `${s} (พ.ศ. ${d.getUTCFullYear() + 543})` : s;
    };
  }, [locale]);

  let valid = true;
  try {
    parseISODate(arrival);
  } catch {
    valid = false;
  }
  const n = Number(days);
  const result =
    valid && visa && Number.isInteger(n) && n > 0 && n <= 3650
      ? calculateStay({ arrival, maxStayDays: n, extensionDays: visa.extensionDays })
      : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <form className="card space-y-4 p-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="arrival" className="block font-semibold">
            {t("arrival")}
          </label>
          <input
            id="arrival"
            type="date"
            className="input mt-1"
            value={arrival}
            onChange={(e) => setParam("arrival", e.target.value)}
            aria-invalid={!valid || undefined}
            aria-describedby={!valid ? "arrival-error" : undefined}
          />
          {!valid && arrival !== "" && (
            <p id="arrival-error" className="mt-1 text-sm font-medium text-destructive">
              {t("invalidDate")}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="visa" className="block font-semibold">
            {t("visa")}
          </label>
          <select
            id="visa"
            className="input mt-1"
            value={slug}
            onChange={(e) => {
              setDaysDraft(null);
              setParam("visa", e.target.value);
            }}
          >
            {visas.map((v) => (
              <option key={v.slug} value={v.slug}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="days" className="block font-semibold">
            {t("customDays")}
          </label>
          <input
            id="days"
            className="input mt-1"
            inputMode="numeric"
            value={days}
            onChange={(e) =>
              setDaysDraft({ slug, value: e.target.value.replace(/\D/g, "").slice(0, 4) })
            }
            aria-describedby="days-help"
          />
          <p id="days-help" className="mt-1 text-sm text-muted-foreground">
            {t("useStamp")}
          </p>
        </div>
      </form>

      <section aria-labelledby="stay-result" aria-live="polite" className="card p-5">
        <h2 id="stay-result" className="flex items-center gap-2 text-xl">
          <CalendarClock className="size-5 text-primary-strong" aria-hidden="true" />
          {t("result")}
        </h2>
        {result ? (
          <>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-muted p-4">
                <dt className="text-sm text-muted-foreground">{t("lastDay")}</dt>
                <dd className="mt-1 text-lg font-bold">{fmt(result.lastDay)}</dd>
                <dd className="text-sm text-muted-foreground">
                  {t("totalDays")}: {c("days", { count: result.totalDays })}
                </dd>
              </div>
              {result.lastDayWithExtension && (
                <div className="rounded-lg bg-muted p-4">
                  <dt className="text-sm text-muted-foreground">{t("lastDayExt")}</dt>
                  <dd className="mt-1 text-lg font-bold">{fmt(result.lastDayWithExtension)}</dd>
                  <dd className="text-sm text-muted-foreground">
                    {t("totalDays")}: {c("days", { count: result.totalDaysWithExtension ?? 0 })}
                  </dd>
                </div>
              )}
            </dl>
            <h3 className="mt-6 font-semibold">{t("reports")}</h3>
            {result.ninetyDayReports.length === 0 ? (
              <p className="mt-1 text-muted-foreground">{t("noReports")}</p>
            ) : (
              <ol className="mt-2 space-y-2">
                {result.ninetyDayReports.map((r) => (
                  <li key={r.due} className="rounded-md border border-border p-3">
                    <p className="font-semibold">{t("reportDue", { date: fmt(r.due) })}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("reportWindow", { from: fmt(r.windowOpens), to: fmt(r.windowCloses) })}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </>
        ) : (
          <p className="mt-4 text-muted-foreground">{t("invalidDate")}</p>
        )}
        <p className="mt-6 flex gap-2 rounded-md border border-warning/40 p-3 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
          {t("warning")}
        </p>
      </section>
    </div>
  );
}
