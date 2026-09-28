"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Printer } from "lucide-react";
import { setStoredValue, useStoredValue } from "@/lib/client-store";

function parseTicks(raw: string | null, length: number): boolean[] {
  try {
    const saved: unknown = JSON.parse(raw ?? "null");
    if (Array.isArray(saved) && saved.length === length) return saved.map(Boolean);
  } catch {
    /* corrupt value */
  }
  return Array.from({ length }, () => false);
}

/** Document checklist. Ticks are a per-browser convenience in localStorage (never sent anywhere). */
export function Checklist({ storageKey, items }: { storageKey: string; items: string[] }) {
  const t = useTranslations("visa");
  const c = useTranslations("common");
  const id = useId();
  const key = `tve-checklist-${storageKey}`;
  const done = parseTicks(useStoredValue(key), items.length);
  const save = (next: boolean[]) => setStoredValue(key, JSON.stringify(next));

  const count = done.filter(Boolean).length;
  return (
    <div>
      <p className="text-sm text-muted-foreground">{t("documentsHelp")}</p>
      <div className="mt-3 flex items-center gap-3">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-valuenow={count}
          aria-label={t("documentsProgress", { done: count, total: items.length })}
        >
          <div
            className="h-full bg-success transition-[width]"
            style={{ width: `${(count / items.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-semibold" aria-live="polite">
          {t("documentsProgress", { done: count, total: items.length })}
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <label
              htmlFor={`${id}-${i}`}
              className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted"
            >
              <input
                id={`${id}-${i}`}
                type="checkbox"
                className="mt-1 size-5 shrink-0 accent-[var(--tve-success)]"
                checked={done[i] ?? false}
                onChange={(e) => save(done.map((d, j) => (j === i ? e.target.checked : d)))}
              />
              <span className={done[i] ? "text-muted-foreground line-through" : ""}>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="no-print mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
          <Printer className="size-4" aria-hidden="true" />
          {c("print")}
        </button>
        {count > 0 && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => save(items.map(() => false))}
          >
            {t("resetChecklist")}
          </button>
        )}
      </div>
    </div>
  );
}
