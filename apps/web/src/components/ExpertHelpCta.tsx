import { getTranslations } from "next-intl/server";
import type { Locale } from "@tve/content";

/**
 * Placeholder for a future "Get expert help" / consultation CTA.
 * Renders nothing unless NEXT_PUBLIC_EXPERT_HELP_URL is set at build time.
 */
export async function ExpertHelpCta({ locale }: { locale: Locale }) {
  const url = process.env.NEXT_PUBLIC_EXPERT_HELP_URL;
  if (!url) return null;
  const t = await getTranslations({ locale, namespace: "cta" });
  return (
    <aside className="card p-5">
      <h2 className="text-lg">{t("expertHelp")}</h2>
      <p className="mt-1 text-muted-foreground">{t("expertHelpText")}</p>
      <a href={url} className="btn btn-secondary mt-3" rel="noopener sponsored">
        {t("expertHelp")}
      </a>
    </aside>
  );
}
