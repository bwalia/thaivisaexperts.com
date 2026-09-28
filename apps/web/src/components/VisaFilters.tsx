"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { replaceSearch, useSearchString } from "@/lib/client-store";

export interface FilterItem {
  slug: string;
  purposes: string[];
  stay: "short" | "medium" | "long";
  budget: "none" | "under1m" | "any";
}

type Filters = { purpose: string; stay: string; budget: string };
const EMPTY: Filters = { purpose: "", stay: "", budget: "" };

function filtersFrom(search: string): Filters {
  const p = new URLSearchParams(search);
  return {
    purpose: p.get("purpose") ?? "",
    stay: p.get("stay") ?? "",
    budget: p.get("budget") ?? "",
  };
}

/** Filters server-rendered visa cards. Filter state lives in the URL so it can be shared. */
export function VisaFilters({
  items,
  cards,
  purposes,
}: {
  items: FilterItem[];
  cards: ReactNode[];
  purposes: { id: string; label: string }[];
}) {
  const t = useTranslations("visas");
  const f = filtersFrom(useSearchString());

  function update(next: Filters) {
    const p = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => v && p.set(k, v));
    replaceSearch(p);
  }

  const matches = (i: FilterItem) =>
    (!f.purpose || i.purposes.includes(f.purpose)) &&
    (!f.stay || i.stay === f.stay) &&
    (!f.budget ||
      (f.budget === "none"
        ? i.budget === "none"
        : f.budget === "under1m"
          ? i.budget !== "any"
          : true));
  const visible = items.map(matches);
  const count = visible.filter(Boolean).length;

  const select = (id: keyof Filters, label: string, options: [string, string][]) => (
    <div>
      <label htmlFor={`f-${id}`} className="block text-sm font-semibold">
        {label}
      </label>
      <select
        id={`f-${id}`}
        className="input mt-1"
        value={f[id]}
        onChange={(e) => update({ ...f, [id]: e.target.value })}
      >
        <option value="">{t("filterAll")}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <form
        className="card grid gap-4 p-4 sm:grid-cols-3"
        onSubmit={(e) => e.preventDefault()}
        aria-label={t("title")}
      >
        {select(
          "purpose",
          t("filterPurpose"),
          purposes.map((p) => [p.id, p.label]),
        )}
        {select("stay", t("filterStay"), [
          ["short", t("stayShort")],
          ["medium", t("stayMedium")],
          ["long", t("stayLong")],
        ])}
        {select("budget", t("filterBudget"), [
          ["none", t("budgetNone")],
          ["under1m", t("budgetUnder1m")],
        ])}
      </form>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p role="status" className="font-semibold">
          {t("resultsCount", { count })}
        </p>
        {(f.purpose || f.stay || f.budget) && (
          <button type="button" className="btn btn-ghost" onClick={() => update(EMPTY)}>
            {t("clearFilters")}
          </button>
        )}
      </div>
      {count === 0 && <p className="mt-6 text-muted-foreground">{t("noMatches")}</p>}
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <li key={items[i]!.slug} hidden={!visible[i]}>
            {card}
          </li>
        ))}
      </ul>
    </>
  );
}
