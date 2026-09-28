import { describe, expect, it } from "vitest";
import { addDays, calculateStay, daysBetween, lastDayOfStay, ninetyDayReports } from "../src";

describe("dates", () => {
  it("adds days across month and leap-year boundaries", () => {
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2027-02-28", 1)).toBe("2027-03-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
  it("rejects invalid dates", () => {
    expect(() => addDays("2026-02-30", 1)).toThrow();
    expect(() => addDays("28/09/2026", 1)).toThrow();
  });
  it("counts days between", () => expect(daysBetween("2026-01-01", "2026-03-01")).toBe(59));
});

describe("lastDayOfStay", () => {
  it("counts the arrival day as day 1", () => {
    expect(lastDayOfStay("2026-01-01", 1)).toBe("2026-01-01");
    expect(lastDayOfStay("2026-01-01", 30)).toBe("2026-01-30");
    expect(lastDayOfStay("2026-01-01", 60)).toBe("2026-03-01");
  });
  it("rejects non-positive stays", () => expect(() => lastDayOfStay("2026-01-01", 0)).toThrow());
});

describe("ninetyDayReports", () => {
  it("is empty for stays of 90 days or fewer", () => {
    expect(ninetyDayReports("2026-01-01", lastDayOfStay("2026-01-01", 90))).toEqual([]);
  });
  it("lists each report with its filing window", () => {
    const r = ninetyDayReports("2026-01-01", lastDayOfStay("2026-01-01", 365));
    expect(r.map((x) => x.due)).toEqual(["2026-04-01", "2026-06-30", "2026-09-28", "2026-12-27"]);
    expect(r[0]).toEqual({
      due: "2026-04-01",
      windowOpens: "2026-03-17",
      windowCloses: "2026-04-08",
    });
  });
});

describe("calculateStay", () => {
  it("handles an extendable 60-day stay", () => {
    const r = calculateStay({ arrival: "2026-10-01", maxStayDays: 60, extensionDays: 30 });
    expect(r.lastDay).toBe("2026-11-29");
    expect(r.lastDayWithExtension).toBe("2026-12-29");
    expect(r.totalDaysWithExtension).toBe(90);
    expect(r.ninetyDayReports).toEqual([]);
  });
  it("handles a non-extendable stay", () => {
    const r = calculateStay({ arrival: "2026-10-01", maxStayDays: 15, extensionDays: null });
    expect(r.lastDay).toBe("2026-10-15");
    expect(r.lastDayWithExtension).toBeNull();
  });
  it("adds 90-day reports for a DTV stay with extension", () => {
    const r = calculateStay({ arrival: "2026-10-01", maxStayDays: 180, extensionDays: 180 });
    expect(r.ninetyDayReports).toHaveLength(3);
  });
});
