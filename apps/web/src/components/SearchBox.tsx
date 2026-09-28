"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { replaceSearch, useSearchString } from "@/lib/client-store";

export interface SearchItem {
  href: string;
  type: "visa" | "guide";
  title: string;
  summary: string;
  /** Extra searchable text (headings, FAQ questions). */
  text: string;
}

/** Lowercase and strip accents so "demarche" matches "démarche". Thai is matched as-is (no word spaces). */
function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Client-side search over a per-locale index built at build time. */
export function SearchBox({ items }: { items: SearchItem[] }) {
  const t = useTranslations("search");
  const q = new URLSearchParams(useSearchString()).get("q") ?? "";

  const index = useMemo(
    () =>
      items.map((i) => ({
        i,
        title: normalize(i.title),
        body: normalize(`${i.summary} ${i.text}`),
      })),
    [items],
  );
  const terms = normalize(q).split(/\s+/).filter(Boolean);
  const active = q.trim().length >= 2;
  const results = active
    ? index
        .map(({ i, title, body }) => {
          let score = 0;
          for (const term of terms) {
            if (title.includes(term)) score += 10;
            else if (body.includes(term)) score += 1;
            else return null;
          }
          return { i, score };
        })
        .filter((x): x is { i: SearchItem; score: number } => x !== null)
        .sort((a, b) => b.score - a.score)
    : [];

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative max-w-xl">
        <label htmlFor="q" className="block font-semibold">
          {t("label")}
        </label>
        <Search
          className="pointer-events-none absolute bottom-3 left-3 size-5 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="q"
          type="search"
          className="input mt-1 !pl-10"
          placeholder={t("placeholder")}
          value={q}
          autoFocus
          onChange={(e) =>
            replaceSearch(e.target.value ? new URLSearchParams({ q: e.target.value }) : "")
          }
        />
      </form>
      <p role="status" className="mt-4 text-sm font-medium text-muted-foreground">
        {active ? t("results", { count: results.length }) : t("typeToSearch")}
      </p>
      <ul className="mt-4 space-y-3">
        {results.map(({ i }) => (
          <li key={i.href} className="card card-link relative p-4">
            <p className="text-xs font-semibold text-primary-strong">
              {i.type === "visa" ? t("visa") : t("guide")}
            </p>
            <h2 className="text-lg">
              <Link
                href={i.href}
                className="text-foreground no-underline after:absolute after:inset-0 after:content-['']"
              >
                {i.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{i.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
