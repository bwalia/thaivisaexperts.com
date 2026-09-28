import { PURPOSES, type Purpose } from "@tve/content/schema";
import { FUNDS_BANDS, STAY_OPTIONS, type FinderInput, type FundsBandId, type StayOptionId } from "./finder";

/** Wizard answers as stored in the URL query string (shareable results). */
export interface FinderAnswers {
  nationality: string | null;
  purpose: Purpose | null;
  stay: StayOptionId | null;
  remote: boolean | null;
  funds: FundsBandId | null;
  age: number | null;
}

export const EMPTY_ANSWERS: FinderAnswers = {
  nationality: null,
  purpose: null,
  stay: null,
  remote: null,
  funds: null,
  age: null,
};

export function answersFromParams(params: URLSearchParams): FinderAnswers {
  const nat = params.get("nationality")?.toUpperCase() ?? null;
  const purpose = params.get("purpose");
  const stay = params.get("stay");
  const remote = params.get("remote");
  const funds = params.get("funds");
  const age = Number(params.get("age"));
  return {
    nationality: nat && /^[A-Z]{2}$/.test(nat) ? nat : null,
    purpose: PURPOSES.includes(purpose as Purpose) ? (purpose as Purpose) : null,
    stay: STAY_OPTIONS.some((s) => s.id === stay) ? (stay as StayOptionId) : null,
    remote: remote === "yes" ? true : remote === "no" ? false : null,
    funds: FUNDS_BANDS.some((b) => b.id === funds) ? (funds as FundsBandId) : null,
    age: Number.isInteger(age) && age >= 16 && age <= 110 ? age : null,
  };
}

export function answersToParams(a: FinderAnswers): URLSearchParams {
  const p = new URLSearchParams();
  if (a.nationality) p.set("nationality", a.nationality);
  if (a.purpose) p.set("purpose", a.purpose);
  if (a.stay) p.set("stay", a.stay);
  if (a.remote !== null) p.set("remote", a.remote ? "yes" : "no");
  if (a.funds) p.set("funds", a.funds);
  if (a.age !== null) p.set("age", String(a.age));
  return p;
}

/** Age is only asked when the purpose is retirement. */
export function needsAge(a: FinderAnswers): boolean {
  return a.purpose === "retire";
}

/** Complete answers → finder input, or null if a required answer is missing. */
export function toFinderInput(a: FinderAnswers): FinderInput | null {
  if (!a.purpose || !a.stay || a.remote === null) return null;
  if (needsAge(a) && a.age === null) return null;
  const stayDays = STAY_OPTIONS.find((s) => s.id === a.stay)!.days;
  return {
    nationality: a.nationality,
    purpose: a.purpose,
    stayDays,
    remoteWork: a.remote,
    funds: a.funds,
    age: a.age,
  };
}
