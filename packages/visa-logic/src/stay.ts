import { addDays, daysBetween } from "./dates";

export interface StayInput {
  /** Arrival date, YYYY-MM-DD. The arrival day counts as day 1 of the stay. */
  arrival: string;
  /** Permitted stay per entry, in days. */
  maxStayDays: number;
  /** Days added by one extension at an immigration office, or null if not extendable. */
  extensionDays: number | null;
}

export interface NinetyDayReport {
  /** Report due date (day 90 of each continuous 90-day period). */
  due: string;
  /** Earliest date the report can be filed (15 days before due). */
  windowOpens: string;
  /** Latest date before a fine applies (7 days after due). */
  windowCloses: string;
}

export interface StayResult {
  /** Last day you may legally remain in Thailand without an extension. */
  lastDay: string;
  /** Last legal day if you get one extension, or null if not extendable. */
  lastDayWithExtension: string | null;
  totalDays: number;
  totalDaysWithExtension: number | null;
  /** 90-day address reports needed during the (extended) stay. */
  ninetyDayReports: NinetyDayReport[];
}

/**
 * Thai immigration counts the arrival day as day 1, so a 60-day stay starting
 * 1 January ends on 1 March (non-leap year): arrival + (days - 1).
 */
export function lastDayOfStay(arrival: string, days: number): string {
  if (!Number.isInteger(days) || days < 1) throw new Error("days must be a positive integer");
  return addDays(arrival, days - 1);
}

/**
 * Foreigners staying longer than 90 consecutive days must report their address every 90 days.
 * The report can be filed from 15 days before to 7 days after the due date.
 */
export function ninetyDayReports(arrival: string, lastDay: string): NinetyDayReport[] {
  const reports: NinetyDayReport[] = [];
  for (let n = 1; ; n++) {
    const due = addDays(arrival, 90 * n);
    if (daysBetween(due, lastDay) < 0) break;
    reports.push({ due, windowOpens: addDays(due, -15), windowCloses: addDays(due, 7) });
  }
  return reports;
}

export function calculateStay(input: StayInput): StayResult {
  const lastDay = lastDayOfStay(input.arrival, input.maxStayDays);
  const totalWithExt = input.extensionDays ? input.maxStayDays + input.extensionDays : null;
  const lastDayWithExtension = totalWithExt ? lastDayOfStay(input.arrival, totalWithExt) : null;
  return {
    lastDay,
    lastDayWithExtension,
    totalDays: input.maxStayDays,
    totalDaysWithExtension: totalWithExt,
    ninetyDayReports: ninetyDayReports(input.arrival, lastDayWithExtension ?? lastDay),
  };
}
