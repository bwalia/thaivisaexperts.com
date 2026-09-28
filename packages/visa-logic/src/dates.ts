/** Date helpers on ISO `YYYY-MM-DD` strings, computed in UTC to avoid timezone drift. */

const DAY_MS = 86_400_000;

export function parseISODate(iso: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`Invalid date: ${iso}`);
  const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (new Date(t).toISOString().slice(0, 10) !== iso) throw new Error(`Invalid date: ${iso}`);
  return t;
}

export function formatISODate(t: number): string {
  return new Date(t).toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  return formatISODate(parseISODate(iso) + days * DAY_MS);
}

/** Whole days from `a` to `b` (b - a). */
export function daysBetween(a: string, b: string): number {
  return Math.round((parseISODate(b) - parseISODate(a)) / DAY_MS);
}
