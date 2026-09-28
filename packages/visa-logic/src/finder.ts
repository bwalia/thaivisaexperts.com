import type { Country, Purpose, VisaFacts } from "@tve/content/schema";

/** Funds bands offered by the Visa Finder, in THB. `max: null` = no upper bound. */
export const FUNDS_BANDS = [
  { id: "under-100k", min: 0, max: 99_999 },
  { id: "100k-500k", min: 100_000, max: 499_999 },
  { id: "500k-800k", min: 500_000, max: 799_999 },
  { id: "800k-3m", min: 800_000, max: 2_999_999 },
  { id: "3m-plus", min: 3_000_000, max: null },
] as const;
export type FundsBandId = (typeof FUNDS_BANDS)[number]["id"];

export const STAY_OPTIONS = [
  { id: "up-to-30", days: 30 },
  { id: "up-to-60", days: 60 },
  { id: "up-to-90", days: 90 },
  { id: "up-to-180", days: 180 },
  { id: "up-to-365", days: 365 },
  { id: "over-1-year", days: 730 },
] as const;
export type StayOptionId = (typeof STAY_OPTIONS)[number]["id"];

export interface FinderInput {
  /** ISO 3166-1 alpha-2 nationality, or null if unknown. */
  nationality: string | null;
  purpose: Purpose;
  /** Planned stay in days. */
  stayDays: number;
  /** Working remotely for a foreign employer or clients while in Thailand. */
  remoteWork: boolean;
  funds: FundsBandId | null;
  age: number | null;
}

/** Reason/warning codes are localised by the UI (messages `finder.reasons.<code>`). */
export type ReasonCode =
  | "purposeMatch"
  | "shortStayCovers"
  | "stayCovered"
  | "stayNeedsExtension"
  | "stayNeedsReentry"
  | "exemptNationality"
  | "voaNationality"
  | "remoteWorkAllowed"
  | "localWorkAllowed"
  | "fundsBorderline"
  | "checkNationality"
  | "checkAge"
  | "remoteWorkGrey"
  | "simplest"
  | "premiumCost";

export interface Reason {
  code: ReasonCode;
  values?: Record<string, string | number>;
}

export interface FinderResult {
  slug: string;
  score: number;
  fit: "best" | "good" | "possible";
  reasons: Reason[];
  warnings: Reason[];
}

export interface FinderData {
  visas: VisaFacts[];
  countries: Country[];
}

/**
 * Purposes a short-stay visa can cover for a short trip even if not its headline purpose.
 * Business meetings are excluded: since 15 Sep 2026 visa-free entry is for tourism only.
 */
const SHORT_STAY_PURPOSES: Purpose[] = ["holiday", "muay-thai", "wellness", "cooking-course"];

type Evaluation = { score: number; reasons: Reason[]; warnings: Reason[] } | null;

function evaluate(v: VisaFacts, input: FinderInput, country: Country | undefined): Evaluation {
  const reasons: Reason[] = [];
  const warnings: Reason[] = [];
  let score = 0;

  // Nationality-restricted schemes.
  if (v.eligibility !== "all") {
    const needed = v.eligibility === "exempt-countries" ? "exempt" : "voa";
    if (!input.nationality) warnings.push({ code: "checkNationality" });
    else if (country?.status !== needed) return null;
    else {
      reasons.push({
        code: needed === "exempt" ? "exemptNationality" : "voaNationality",
        values: { days: country.stayDays ?? v.maxStayDays ?? 0 },
      });
      score += 10;
    }
  }

  // Age.
  if (v.minAge) {
    if (input.age === null) warnings.push({ code: "checkAge", values: { age: v.minAge } });
    else if (input.age < v.minAge) return null;
  }

  // Funds.
  if (v.minFundsTHB && input.funds) {
    const band = FUNDS_BANDS.find((b) => b.id === input.funds)!;
    if (band.max !== null && band.max < v.minFundsTHB) return null;
    if (band.min < v.minFundsTHB)
      warnings.push({ code: "fundsBorderline", values: { amount: v.minFundsTHB } });
  }

  // Purpose.
  if (v.purposes.includes(input.purpose)) {
    reasons.push({ code: "purposeMatch" });
    score += 50;
  } else if (v.category === "short-stay" && SHORT_STAY_PURPOSES.includes(input.purpose)) {
    reasons.push({ code: "shortStayCovers" });
    score += 25;
  } else return null;

  if (input.purpose === "work") {
    if (!v.localWorkAllowed) return null;
    reasons.push({ code: "localWorkAllowed" });
  }

  // Remote work.
  if (input.remoteWork) {
    if (v.remoteWorkAllowed) {
      reasons.push({ code: "remoteWorkAllowed" });
      score += 20;
    } else if (v.category === "short-stay" && input.stayDays <= 30) {
      warnings.push({ code: "remoteWorkGrey" });
      score -= 10;
    } else return null;
  }

  // Length of stay. Nationality-specific stay beats the visa default for exemption/VoA.
  const perEntry = v.eligibility !== "all" && country?.stayDays ? country.stayDays : v.maxStayDays;
  if (perEntry === null) {
    score += 20; // long-validity visa without a fixed per-entry limit
  } else if (input.stayDays <= perEntry) {
    reasons.push({ code: "stayCovered", values: { days: perEntry } });
    score += 30;
  } else if (v.extendable && v.extensionDays && input.stayDays <= perEntry + v.extensionDays) {
    warnings.push({ code: "stayNeedsExtension", values: { days: v.extensionDays } });
    // Long-stay visas are designed to be extended in Thailand; short-stay ones less so.
    score += v.category === "short-stay" ? 15 : 25;
  } else if (
    v.entries === "multiple" &&
    v.validityMonths !== null &&
    input.stayDays <= v.validityMonths * 30
  ) {
    warnings.push({ code: "stayNeedsReentry", values: { days: perEntry } });
    score += 5;
  } else return null;

  // Prefer the simplest option for short trips; don't push premium visas for short stays.
  if (v.category === "short-stay" && v.feeTHB === 0) {
    reasons.push({ code: "simplest" });
    score += 10;
  }
  if (v.feeTHB !== null && v.feeTHB >= 100_000) {
    if (input.stayDays < 180) score -= 40;
    else if (input.funds !== "3m-plus") score -= 15;
    warnings.push({ code: "premiumCost", values: { fee: v.feeTHB } });
  }

  return { score, reasons, warnings };
}

/** Rank visas for a traveller. Pure: pass the data in, get sorted results out. */
export function findVisas(input: FinderInput, data: FinderData): FinderResult[] {
  const country = input.nationality
    ? data.countries.find((c) => c.code === input.nationality)
    : undefined;
  const results: FinderResult[] = [];
  for (const v of data.visas) {
    const e = evaluate(v, input, country);
    if (!e) continue;
    results.push({
      slug: v.slug,
      score: e.score,
      fit: "possible",
      reasons: e.reasons,
      warnings: e.warnings,
    });
  }
  results.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));
  results.forEach((r, i) => {
    r.fit = i === 0 ? "best" : r.score >= 60 ? "good" : "possible";
  });
  return results;
}
