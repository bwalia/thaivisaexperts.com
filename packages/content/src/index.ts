import { z } from "zod";
import {
  Announcement,
  ArticleMeta,
  ArticleText,
  CountriesFile,
  DEFAULT_LOCALE,
  ImageRef,
  LOCALES,
  VisaFacts,
  VisaText,
  type Article,
  type Locale,
  type Visa,
} from "./schema";
import {
  announcementsFile,
  countriesFile,
  guideFiles,
  imagesFile,
  messageFiles,
  pageFiles,
  visaFiles,
} from "./generated/registry";

export * from "./schema";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Only for local work-in-progress: TVE_ALLOW_MISSING_TRANSLATIONS=1 falls back to English. */
const allowMissing =
  typeof process !== "undefined" && process.env?.TVE_ALLOW_MISSING_TRANSLATIONS === "1";

function textFor(entry: { text: Partial<Record<string, unknown>> }, locale: Locale, what: string) {
  const text = entry.text[locale] ?? (allowMissing ? entry.text[DEFAULT_LOCALE] : undefined);
  if (!text) throw new Error(`Missing ${locale} translation for ${what}`);
  return text;
}

// ---------- Visas ----------

const facts = Object.fromEntries(
  Object.entries(visaFiles).map(([slug, e]) => [slug, VisaFacts.parse(e.meta)]),
) as Record<string, VisaFacts>;

export function getVisaSlugs(): string[] {
  return Object.keys(facts);
}

export function getAllVisaFacts(): VisaFacts[] {
  return Object.values(facts);
}

export function getVisa(slug: string, locale: Locale): Visa | undefined {
  const f = facts[slug];
  const entry = visaFiles[slug];
  if (!f || !entry) return undefined;
  return { ...f, ...VisaText.parse(textFor(entry, locale, `visa "${slug}"`)), locale };
}

export function getVisas(locale: Locale): Visa[] {
  return getVisaSlugs().map((s) => getVisa(s, locale)!);
}

// ---------- Articles (guides + static pages) ----------

type Kind = "guides" | "pages";
const articleFiles = { guides: guideFiles, pages: pageFiles };

export function getArticleSlugs(kind: Kind): string[] {
  return Object.keys(articleFiles[kind]);
}

export function getArticle(kind: Kind, slug: string, locale: Locale): Article | undefined {
  const entry = articleFiles[kind][slug];
  if (!entry) return undefined;
  const meta = ArticleMeta.parse(entry.meta);
  return { ...meta, ...ArticleText.parse(textFor(entry, locale, `${kind} "${slug}"`)), locale };
}

export function getArticles(kind: Kind, locale: Locale): Article[] {
  return getArticleSlugs(kind).map((s) => getArticle(kind, s, locale)!);
}

// ---------- Countries, images, announcements, messages ----------

export function getCountries(): CountriesFile {
  return CountriesFile.parse(countriesFile);
}

const images = z.array(ImageRef).parse(imagesFile ?? []);
const imageMap = new Map(images.map((i) => [i.id, i]));

export function getImages(): ImageRef[] {
  return images;
}

export function getImage(id: string | null | undefined): ImageRef | undefined {
  return id ? imageMap.get(id) : undefined;
}

export function getAnnouncements(): Announcement[] {
  return z.array(Announcement).parse(announcementsFile ?? []);
}

export type Messages = Record<string, unknown>;

export function getMessages(locale: Locale): Messages {
  const m = messageFiles[locale] ?? messageFiles[DEFAULT_LOCALE];
  if (!m) throw new Error(`Missing messages for ${locale}`);
  return m as Messages;
}

/** Translation is stale when English was re-verified after the translation was made. */
export function isStale(item: { lastVerified: string; translatedFrom: string; locale: Locale }) {
  return item.locale !== DEFAULT_LOCALE && item.translatedFrom < item.lastVerified;
}
