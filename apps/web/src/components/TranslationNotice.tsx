import { getTranslations } from "next-intl/server";
import { Info } from "lucide-react";
import { isStale, type Locale, type ReviewStatus } from "@tve/content";
import { Link } from "@/i18n/navigation";

interface Props {
  locale: Locale;
  reviewStatus: ReviewStatus;
  lastVerified: string;
  translatedFrom: string;
  /** Locale-relative path of this page, for the "read in English" link. */
  path: string;
}

/** Shows a note on machine-translated pages, and a banner when the English source is newer. */
export async function TranslationNotice({
  locale,
  reviewStatus,
  lastVerified,
  translatedFrom,
  path,
}: Props) {
  if (locale === "en") return null;
  const stale = isStale({ locale, lastVerified, translatedFrom });
  if (reviewStatus !== "machine" && !stale) return null;
  const t = await getTranslations({ locale, namespace: "common" });
  return (
    <div
      role="note"
      className="mt-4 flex gap-2 rounded-md border border-border bg-muted p-3 text-sm text-foreground"
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        {stale ? t("staleTranslation") : t("machineTranslated")}{" "}
        <Link href={path} locale="en" lang="en" className="font-medium">
          {t("readInEnglish")}
        </Link>
      </p>
    </div>
  );
}
