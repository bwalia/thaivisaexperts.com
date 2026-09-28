"use client";

import { useTranslations } from "next-intl";
import { Monitor, Moon, Sun } from "lucide-react";
import { setStoredValue, useStoredValue } from "@/lib/client-store";

type Theme = "system" | "light" | "dark";
const ORDER: Theme[] = ["system", "light", "dark"];

/** Cycles system → light → dark. The choice is a per-browser convenience in localStorage. */
export function ThemeToggle() {
  const t = useTranslations("theme");
  const saved = useStoredValue("tve-theme");
  const theme: Theme = saved === "light" || saved === "dark" ? saved : "system";

  function cycle() {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]!;
    const root = document.documentElement;
    if (next === "system") delete root.dataset.theme;
    else root.dataset.theme = next;
    setStoredValue("tve-theme", next === "system" ? null : next);
  }

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  return (
    <button
      type="button"
      onClick={cycle}
      className="btn btn-ghost !px-2"
      aria-label={`${t("label")}: ${t(theme)}`}
      title={t(theme)}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
