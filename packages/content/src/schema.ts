import { z } from "zod";

import { PURPOSES, VISA_CATEGORIES, type Locale } from "./locales";

export { LOCALES, DEFAULT_LOCALE, PURPOSES, VISA_CATEGORIES, type Locale } from "./locales";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

/** A string in every supported locale. */
export const LocalizedString = z.object({
  en: z.string().min(1),
  fr: z.string().min(1),
  nl: z.string().min(1),
  th: z.string().min(1),
});
export type LocalizedString = z.infer<typeof LocalizedString>;

export const VisaCategory = z.enum(VISA_CATEGORIES);
export type VisaCategory = z.infer<typeof VisaCategory>;

export const Purpose = z.enum(PURPOSES);
export type Purpose = z.infer<typeof Purpose>;

export const Source = z.object({
  label: LocalizedString,
  url: z.url(),
});
export type Source = z.infer<typeof Source>;

export const ReviewStatus = z.enum(["source", "machine", "reviewed"]);
export type ReviewStatus = z.infer<typeof ReviewStatus>;

/**
 * Language-neutral visa facts: `packages/content/visas/<slug>/facts.json`.
 * Change a number here and every language picks it up.
 * Use `null` when a value doesn't apply or is not yet verified (and add a TODO in `todo`).
 */
export const VisaFacts = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: VisaCategory,
  purposes: z.array(Purpose).min(1),
  /** Maximum stay per entry, in days. */
  maxStayDays: z.number().int().positive().nullable(),
  extendable: z.boolean(),
  /** Days added by one in-country extension, if any. */
  extensionDays: z.number().int().positive().nullable(),
  entries: z.enum(["single", "multiple", "n/a"]),
  /** How long the visa itself is valid, in months (null for exemption/on-arrival). */
  validityMonths: z.number().int().positive().nullable(),
  /** Government fee in Thai baht (null when it varies by embassy or is unverified). */
  feeTHB: z.number().nonnegative().nullable(),
  /** Minimum funds/savings/income in THB used by the Visa Finder (null = no fixed amount). */
  minFundsTHB: z.number().nonnegative().nullable(),
  /** Minimum applicant age (e.g. 50 for retirement), null if none. */
  minAge: z.number().int().positive().nullable(),
  /** May the holder work remotely for a foreign employer/clients? */
  remoteWorkAllowed: z.boolean(),
  /** May the holder work for a Thai employer (with a work permit)? */
  localWorkAllowed: z.boolean(),
  /**
   * Nationality eligibility: "all" = most nationalities may apply at an embassy/e-Visa,
   * "exempt-countries" = only nationalities on the exemption list, "voa-countries" = only VoA list.
   */
  eligibility: z.enum(["all", "exempt-countries", "voa-countries"]),
  /** Show on the home page "Most popular visas" list. */
  popular: z.boolean(),
  lastVerified: isoDate,
  heroImage: z.string(),
  officialSources: z.array(Source).min(1),
  relatedVisas: z.array(z.string()).default([]),
  /** Facts that could not be verified; mirrored in docs/CONTENT-TODO.md. */
  todo: z.array(z.string()).default([]),
});
export type VisaFacts = z.infer<typeof VisaFacts>;

export const Faq = z.object({ q: z.string().min(1), a: z.string().min(1) });
export type Faq = z.infer<typeof Faq>;

/** Localised visa text: `packages/content/visas/<slug>/<locale>.json`. */
export const VisaText = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  summary: z.string().min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  validity: z.string().min(1),
  extendableDetail: z.string().min(1),
  feeNote: z.string().nullable(),
  financialRequirement: z.string().nullable(),
  processingTime: z.string().min(1),
  keyRequirements: z.array(z.string().min(1)).min(1),
  documents: z.array(z.string().min(1)).min(1),
  howToApply: z.array(z.object({ step: z.string().min(1), detail: z.string().min(1) })).min(1),
  bestFor: z.array(z.string().min(1)).min(1),
  notFor: z.array(z.string().min(1)).min(1),
  commonMistakes: z.array(z.string().min(1)).min(1),
  faqs: z.array(Faq).min(1),
  /** English: equals facts.lastVerified. Translations: the English lastVerified they were translated from. */
  translatedFrom: isoDate,
  reviewStatus: ReviewStatus,
});
export type VisaText = z.infer<typeof VisaText>;

/** A full visa for one locale. */
export type Visa = VisaFacts & VisaText & { locale: Locale };

/** Language-neutral article metadata (guides and static pages): `<dir>/<slug>/meta.json`. */
export const ArticleMeta = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  lastVerified: isoDate,
  heroImage: z.string().nullable(),
  officialSources: z.array(Source).default([]),
  relatedVisas: z.array(z.string()).default([]),
  todo: z.array(z.string()).default([]),
});
export type ArticleMeta = z.infer<typeof ArticleMeta>;

export const ArticleSection = z.object({
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).default([]),
  list: z.array(z.string().min(1)).default([]),
  /** Ordered list = numbered steps. */
  ordered: z.boolean().default(false),
});
export type ArticleSection = z.infer<typeof ArticleSection>;

/** Localised article body: `<dir>/<slug>/<locale>.json`. */
export const ArticleText = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  sections: z.array(ArticleSection).min(1),
  faqs: z.array(Faq).default([]),
  translatedFrom: isoDate,
  reviewStatus: ReviewStatus,
});
export type ArticleText = z.infer<typeof ArticleText>;
export type Article = ArticleMeta & ArticleText & { locale: Locale };

export const ExemptionStatus = z.enum(["exempt", "voa", "visa-required"]);
/** Nationality rules: `packages/content/countries.json`. Names come from Intl.DisplayNames. */
export const Country = z.object({
  /** ISO 3166-1 alpha-2 */
  code: z.string().regex(/^[A-Z]{2}$/),
  status: ExemptionStatus,
  /** Days allowed on exemption / VoA (null for visa-required). */
  stayDays: z.number().int().positive().nullable(),
});
export type Country = z.infer<typeof Country>;
export const CountriesFile = z.object({
  lastVerified: isoDate,
  officialSources: z.array(Source).min(1),
  todo: z.array(z.string()).default([]),
  countries: z.array(Country).min(1),
});
export type CountriesFile = z.infer<typeof CountriesFile>;

export const ImageRef = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** Path under apps/web/public, e.g. "/images/home/bangkok-temple.webp" */
  src: z.string().startsWith("/images/"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: LocalizedString,
  credit: z.string().min(1),
  creditUrl: z.url(),
  sourceUrl: z.url(),
  licence: z.enum(["Unsplash License", "Pexels License", "Owner"]),
});
export type ImageRef = z.infer<typeof ImageRef>;

export const Announcement = z.object({
  id: z.string(),
  active: z.boolean(),
  date: isoDate,
  text: LocalizedString,
  href: z.string().nullable(),
});
export type Announcement = z.infer<typeof Announcement>;
