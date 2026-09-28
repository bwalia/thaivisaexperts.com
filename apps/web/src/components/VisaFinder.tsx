"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Link2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { Country, Locale, Purpose, VisaFacts } from "@tve/content/schema";
import {
  EMPTY_ANSWERS,
  FUNDS_BANDS,
  STAY_OPTIONS,
  answersFromParams,
  answersToParams,
  findVisas,
  needsAge,
  toFinderInput,
  type FinderAnswers,
  type Reason,
} from "@tve/visa-logic";
import { Link } from "@/i18n/navigation";
import { intlLocale } from "@/lib/format";
import { replaceSearch, useSearchString } from "@/lib/client-store";

type StepId = "nationality" | "purpose" | "stay" | "remote" | "funds" | "age";

interface Props {
  visas: VisaFacts[];
  countries: Country[];
  countryNames: { code: string; name: string }[];
  visaText: Record<string, { name: string; summary: string }>;
  purposes: Purpose[];
}

export function VisaFinder({ visas, countries, countryNames, visaText, purposes }: Props) {
  const t = useTranslations("finder");
  const tp = useTranslations("purposes");
  const c = useTranslations("common");
  const locale = useLocale() as Locale;
  const nf = useMemo(() => new Intl.NumberFormat(intlLocale[locale]), [locale]);

  // Answers live in the URL so results can be shared or bookmarked.
  const search = useSearchString();
  const a = useMemo(() => answersFromParams(new URLSearchParams(search)), [search]);
  const [step, setStep] = useState(0);
  // "auto": show results when the URL already holds a complete set of answers (a shared link).
  const [view, setView] = useState<"auto" | "wizard" | "results">("auto");
  const complete = !!toFinderInput(a) && !!a.nationality && !!a.funds;
  const showResults = view === "results" || (view === "auto" && complete);
  const [error, setError] = useState(false);
  const [ageDraft, setAgeDraft] = useState<string | null>(null);
  const ageText = ageDraft ?? (a.age !== null ? String(a.age) : "");
  const [copied, setCopied] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const steps: StepId[] = [
    "nationality",
    "purpose",
    "stay",
    "remote",
    "funds",
    ...(needsAge(a) ? (["age"] as const) : []),
  ];
  const current = steps[Math.min(step, steps.length - 1)]!;

  // Move focus to the new step/results heading for keyboard and screen-reader users.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [step, showResults]);

  const answered = (id: StepId) =>
    id === "nationality"
      ? !!a.nationality
      : id === "purpose"
        ? !!a.purpose
        : id === "stay"
          ? !!a.stay
          : id === "remote"
            ? a.remote !== null
            : id === "funds"
              ? !!a.funds
              : a.age !== null;

  function next() {
    if (!answered(current)) {
      setError(true);
      return;
    }
    setError(false);
    if (step >= steps.length - 1) setView("results");
    else {
      setView("wizard");
      setStep(step + 1);
    }
  }

  function back() {
    setError(false);
    setStep(Math.max(0, step - 1));
  }

  function set(patch: Partial<FinderAnswers>) {
    setError(false);
    if (view === "auto") setView("wizard");
    replaceSearch(answersToParams({ ...a, ...patch }));
  }

  const results = useMemo(() => {
    const input = toFinderInput(a);
    return input ? findVisas(input, { visas, countries }) : [];
  }, [a, visas, countries]);

  const reasonText = (r: Reason) => {
    const values = Object.fromEntries(
      Object.entries(r.values ?? {}).map(([k, v]) => [
        k,
        typeof v === "number" && k !== "days" && k !== "age" ? nf.format(v) : v,
      ]),
    );
    return t(`reasons.${r.code}`, values);
  };

  if (showResults) {
    return (
      <section aria-labelledby="results-title">
        <h2 id="results-title" ref={heading} tabIndex={-1} className="text-2xl outline-none">
          {t("resultsTitle")}
        </h2>
        <p className="mt-2 text-muted-foreground">{t("resultsIntro")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setView("wizard");
              setStep(0);
            }}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("editAnswers")}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              } catch {
                /* clipboard unavailable */
              }
            }}
          >
            <Link2 className="size-4" aria-hidden="true" />
            {t("shareResults")}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              replaceSearch(answersToParams(EMPTY_ANSWERS));
              setAgeDraft(null);
              setView("wizard");
              setStep(0);
            }}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            {t("startOver")}
          </button>
          <span role="status" className="self-center text-sm font-medium text-success">
            {copied ? t("copied") : ""}
          </span>
        </div>

        {results.length === 0 ? (
          <p className="card mt-6 p-5">{t("noResults")}</p>
        ) : (
          <ol id="finder-results" className="mt-6 space-y-4">
            {results.map((r) => {
              const text = visaText[r.slug];
              return (
                <li
                  key={r.slug}
                  className={`card p-5 ${r.fit === "best" ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl">{text?.name ?? r.slug}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${r.fit === "best" ? "bg-primary text-on-primary" : "bg-muted text-foreground"}`}
                    >
                      {t(`fit.${r.fit}`)}
                    </span>
                  </div>
                  {text && <p className="mt-2 text-muted-foreground">{text.summary}</p>}
                  {r.reasons.length > 0 && (
                    <>
                      <h4 className="mt-4 text-sm font-semibold">{t("whyFits")}</h4>
                      <ul className="mt-1 space-y-1">
                        {r.reasons.map((x) => (
                          <li key={x.code} className="flex gap-2 text-sm">
                            <CheckCircle2
                              className="mt-0.5 size-4 shrink-0 text-success"
                              aria-hidden="true"
                            />
                            {reasonText(x)}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {r.warnings.length > 0 && (
                    <>
                      <h4 className="mt-3 text-sm font-semibold">{t("watchOut")}</h4>
                      <ul className="mt-1 space-y-1">
                        {r.warnings.map((x) => (
                          <li key={x.code} className="flex gap-2 text-sm">
                            <AlertTriangle
                              className="mt-0.5 size-4 shrink-0 text-warning"
                              aria-hidden="true"
                            />
                            {reasonText(x)}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <Link href={`/visas/${r.slug}`} className="btn btn-secondary mt-4">
                    {c("viewVisa")} <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    );
  }

  const errorId = "finder-error";
  const radioGroup = <T extends string>(
    name: string,
    options: { value: T; label: string }[],
    value: T | null,
    onChange: (v: T) => void,
  ) => (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {options.map((o) => (
        <label
          key={o.value}
          className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors ${value === o.value ? "border-primary-strong bg-muted" : "border-border bg-surface hover:bg-muted"}`}
        >
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="size-5 accent-[var(--tve-primary-strong)]"
            aria-describedby={error ? errorId : undefined}
          />
          <span className="font-medium">{o.label}</span>
        </label>
      ))}
    </div>
  );

  const questions: Record<StepId, { q: string; help?: string }> = {
    nationality: { q: t("nationalityQ"), help: t("nationalityHelp") },
    purpose: { q: t("purposeQ") },
    stay: { q: t("stayQ") },
    remote: { q: t("remoteQ"), help: t("remoteHelp") },
    funds: { q: t("fundsQ"), help: t("fundsHelp") },
    age: { q: t("ageQ"), help: t("ageHelp") },
  };
  const { q, help } = questions[current];

  return (
    <form
      className="card p-5 sm:p-8"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
    >
      <div className="flex items-center justify-between gap-4 text-sm font-medium text-muted-foreground">
        <span>{t("step", { current: step + 1, total: steps.length })}</span>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={t("progress")}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={step + 1}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <fieldset className="mt-6">
        <legend className="w-full">
          <h2 ref={heading} tabIndex={-1} className="text-2xl outline-none">
            {q}
          </h2>
          {help && <p className="mt-1 text-muted-foreground">{help}</p>}
        </legend>

        {current === "nationality" && (
          <div className="mt-4">
            <label htmlFor="nationality" className="block font-semibold">
              {t("nationalityPlaceholder")}
            </label>
            <select
              id="nationality"
              className="input mt-1"
              value={a.nationality ?? ""}
              onChange={(e) => set({ nationality: e.target.value || null })}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={error || undefined}
            >
              <option value="">{t("nationalityPlaceholder")}</option>
              {countryNames.map((cn) => (
                <option key={cn.code} value={cn.code}>
                  {cn.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {current === "purpose" &&
          radioGroup(
            "purpose",
            purposes.map((p) => ({ value: p, label: tp(p) })),
            a.purpose,
            (v) => set({ purpose: v, age: needsAge({ ...a, purpose: v }) ? a.age : null }),
          )}
        {current === "stay" &&
          radioGroup(
            "stay",
            STAY_OPTIONS.map((s) => ({ value: s.id, label: t(`stayOptions.${s.id}`) })),
            a.stay,
            (v) => set({ stay: v }),
          )}
        {current === "remote" &&
          radioGroup(
            "remote",
            [
              { value: "yes", label: c("yes") },
              { value: "no", label: c("no") },
            ],
            a.remote === null ? null : a.remote ? "yes" : "no",
            (v) => set({ remote: v === "yes" }),
          )}
        {current === "funds" &&
          radioGroup(
            "funds",
            FUNDS_BANDS.map((b) => ({ value: b.id, label: t(`fundsOptions.${b.id}`) })),
            a.funds,
            (v) => set({ funds: v }),
          )}
        {current === "age" && (
          <div className="mt-4 max-w-xs">
            <label htmlFor="age" className="block font-semibold">
              {t("ageLabel")}
            </label>
            <input
              id="age"
              className="input mt-1"
              inputMode="numeric"
              autoComplete="off"
              value={ageText}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={error || undefined}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 3);
                setAgeDraft(v);
                const n = Number(v);
                set({ age: v && n >= 16 && n <= 110 ? n : null });
              }}
            />
          </div>
        )}
      </fieldset>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-3 flex items-center gap-2 font-medium text-destructive"
        >
          <AlertTriangle className="size-4" aria-hidden="true" />
          {current === "age" ? t("ageError") : t("required")}
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={back}
          disabled={step === 0}
          aria-disabled={step === 0}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {c("back")}
        </button>
        <button type="submit" className="btn btn-primary">
          {step >= steps.length - 1 ? (
            <>
              <Sparkles className="size-4" aria-hidden="true" />
              {t("seeResults")}
            </>
          ) : (
            <>
              {c("next")} <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
