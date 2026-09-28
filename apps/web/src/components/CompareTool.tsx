"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { DisplayFacts } from "@/lib/visa-display";
import { replaceSearch, useIsClient, useSearchString } from "@/lib/client-store";

export interface CompareVisa {
  slug: string;
  name: string;
  facts: DisplayFacts;
}

const MAX = 3;

export function CompareTool({
  visas,
  rows,
}: {
  visas: CompareVisa[];
  rows: { key: keyof DisplayFacts; label: string }[];
}) {
  const t = useTranslations("compare");
  const c = useTranslations("common");
  const search = useSearchString();
  const isClient = useIsClient();
  const param = new URLSearchParams(search).get("v");
  const fromUrl = [
    ...new Set((param ?? "").split(",").filter((s) => visas.some((x) => x.slug === s))),
  ].slice(0, MAX);
  // No selection in the URL yet → start with the first two visas (after hydration, so shared links win).
  const selected = param !== null || !isClient ? fromUrl : visas.slice(0, 2).map((x) => x.slug);

  function update(next: string[]) {
    replaceSearch(`v=${next.join(",")}`);
  }

  const chosen = selected.map((s) => visas.find((v) => v.slug === s)!).filter(Boolean);
  const slots = Array.from({ length: MAX }, (_, i) => selected[i] ?? "");

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {slots.map((slug, i) => (
          <div key={i}>
            <label htmlFor={`cmp-${i}`} className="block text-sm font-semibold">
              {t("choose", { n: i + 1 })}
            </label>
            <div className="mt-1 flex gap-1">
              <select
                id={`cmp-${i}`}
                className="input"
                value={slug}
                onChange={(e) => {
                  const next = [...selected];
                  if (e.target.value) next[i] = e.target.value;
                  else next.splice(i, 1);
                  update([...new Set(next.filter(Boolean))]);
                }}
              >
                <option value="">{t("chooseNone")}</option>
                {visas.map((v) => (
                  <option
                    key={v.slug}
                    value={v.slug}
                    disabled={selected.includes(v.slug) && v.slug !== slug}
                  >
                    {v.name}
                  </option>
                ))}
              </select>
              {slug && (
                <button
                  type="button"
                  className="btn btn-ghost !px-2.5"
                  aria-label={`${t("remove")}: ${visas.find((v) => v.slug === slug)?.name}`}
                  onClick={() => update(selected.filter((s) => s !== slug))}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {chosen.length < 2 ? (
        <p className="card mt-6 p-5 text-muted-foreground">{t("pickAtLeastTwo")}</p>
      ) : (
        <>
          {/* Desktop: table */}
          <div className="mt-6 hidden overflow-x-auto md:block">
            <table className="card w-full border-collapse text-left">
              <caption className="sr-only">{t("title")}</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="p-4 text-sm text-muted-foreground">
                    {t("row")}
                  </th>
                  {chosen.map((v) => (
                    <th key={v.slug} scope="col" className="p-4">
                      <Link href={`/visas/${v.slug}`}>{v.name}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} className="border-b border-border last:border-0 align-top">
                    <th scope="row" className="p-4 font-semibold text-muted-foreground">
                      {r.label}
                    </th>
                    {chosen.map((v) => (
                      <td key={v.slug} className="p-4">
                        {v.facts[r.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile: stacked cards */}
          <ul className="mt-6 space-y-4 md:hidden">
            {chosen.map((v) => (
              <li key={v.slug} className="card p-4">
                <h2 className="text-lg">
                  <Link href={`/visas/${v.slug}`}>{v.name}</Link>
                </h2>
                <dl className="mt-3 divide-y divide-border">
                  {rows.map((r) => (
                    <div key={r.key} className="grid grid-cols-2 gap-2 py-2 text-sm">
                      <dt className="font-semibold text-muted-foreground">{r.label}</dt>
                      <dd>{v.facts[r.key]}</dd>
                    </div>
                  ))}
                </dl>
                <Link href={`/visas/${v.slug}`} className="btn btn-secondary mt-3 w-full">
                  {c("viewVisa")}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
