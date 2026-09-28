"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface Props {
  items: { href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
  navLabel: string;
}

export function MobileMenu({ items, openLabel, closeLabel, navLabel }: Props) {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean | ((o: boolean) => boolean)) =>
    setOpenOn((typeof value === "function" ? value(open) : value) ? pathname : null);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={button}
        type="button"
        className="btn btn-ghost !px-2"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <Menu className="size-6" aria-hidden="true" />
        )}
      </button>
      <nav
        id={id}
        aria-label={navLabel}
        hidden={!open}
        className="absolute inset-x-0 top-16 border-b border-border bg-surface shadow-lg"
      >
        <ul className="container-page grid gap-1 py-3">
          {items.map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                className="flex min-h-12 items-center rounded-md px-3 font-medium text-foreground no-underline hover:bg-muted"
              >
                {i.label}
              </Link>
            </li>
          ))}
          <li className="px-3 pt-2 sm:hidden">
            <LanguageSwitcher id="lang-switcher-mobile" />
          </li>
        </ul>
      </nav>
    </div>
  );
}
