import type { Visa, Locale } from "@tve/content";
import type { getTranslations } from "next-intl/server";
import { formatNumber } from "./format";

type T = Awaited<ReturnType<typeof getTranslations>>;

/** Human-readable facts for a visa, shared by the compare tool and cards. */
export function displayFacts(v: Visa, locale: Locale, t: T) {
  return {
    category: t(`categories.${v.category}`),
    maxStay: v.maxStayDays ? t("common.days", { count: v.maxStayDays }) : t("visa.noFixedLimit"),
    extension: v.extendable
      ? v.extensionDays
        ? t("visa.extendableYes", { days: t("common.days", { count: v.extensionDays }) })
        : t("visa.extendableYesNoDays")
      : t("visa.extendableNo"),
    entries: t(`entries.${v.entries}`),
    validity: v.validity,
    fee:
      v.feeTHB === null
        ? t("common.varies")
        : v.feeTHB === 0
          ? t("common.free")
          : t("common.thb", { amount: formatNumber(locale, v.feeTHB) }),
    funds: v.financialRequirement ?? t("common.none"),
    remoteWork: v.remoteWorkAllowed ? t("common.yes") : t("common.no"),
    localWork: v.localWorkAllowed ? t("common.yes") : t("common.no"),
    minAge: v.minAge ? String(v.minAge) : t("common.none"),
    processing: v.processingTime,
  };
}
export type DisplayFacts = ReturnType<typeof displayFacts>;
