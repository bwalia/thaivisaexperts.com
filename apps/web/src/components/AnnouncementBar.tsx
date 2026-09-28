"use client";

import { useTranslations } from "next-intl";
import { Megaphone, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { setStoredValue, useStoredValue } from "@/lib/client-store";

/** Content-driven "rules changed" bar (packages/content/announcements.json). Dismissal is remembered per browser. */
export function AnnouncementBar({
  id,
  text,
  href,
}: {
  id: string;
  text: string;
  href: string | null;
}) {
  const t = useTranslations("announcement");
  const dismissed = useStoredValue(`tve-ann-${id}`) === "1";
  if (dismissed) return null;
  const body = (
    <>
      <span className="font-semibold">{t("label")}:</span> {text}
    </>
  );
  return (
    <div role="region" aria-label={t("label")} className="bg-foreground text-background">
      <div className="container-page flex items-center gap-3 py-2 text-sm">
        <Megaphone className="size-4 shrink-0" aria-hidden="true" />
        <p className="flex-1">
          {href ? (
            <Link href={href} className="text-background underline">
              {body}
            </Link>
          ) : (
            body
          )}
        </p>
        <button
          type="button"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md hover:bg-white/10"
          aria-label={t("dismiss")}
          onClick={() => setStoredValue(`tve-ann-${id}`, "1")}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
