/**
 * Plain constants with no zod dependency, safe to import from client bundles
 * (web client components, mobile app). schema.ts builds its enums from these.
 */

/** Supported locales. English is the source of truth. */
export const LOCALES = ["en", "fr", "nl", "th"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const VISA_CATEGORIES = [
  "short-stay",
  "long-stay",
  "work-business",
  "study-training",
  "retirement",
  "family",
] as const;
export type VisaCategory = (typeof VISA_CATEGORIES)[number];

export const PURPOSES = [
  "holiday",
  "muay-thai",
  "remote-work",
  "business-meeting",
  "work",
  "study",
  "retire",
  "family",
  "wellness",
  "cooking-course",
  "invest",
] as const;
export type Purpose = (typeof PURPOSES)[number];
