import { describe, expect, it } from "vitest";
import {
  answersFromParams,
  answersToParams,
  findVisas,
  toFinderInput,
  type FinderInput,
} from "../src";
import { countries, visas } from "./fixtures";

const data = { visas, countries };
const input = (over: Partial<FinderInput>): FinderInput => ({
  nationality: "GB",
  purpose: "holiday",
  stayDays: 30,
  remoteWork: false,
  funds: null,
  age: null,
  ...over,
});
const slugs = (i: FinderInput) => findVisas(i, data).map((r) => r.slug);

describe("findVisas", () => {
  it("recommends visa exemption first for a short holiday from an exempt country", () => {
    const r = findVisas(input({}), data);
    expect(r[0]?.slug).toBe("visa-exemption");
    expect(r[0]?.fit).toBe("best");
    expect(r[0]?.reasons.map((x) => x.code)).toContain("exemptNationality");
  });

  it("excludes exemption for visa-required nationalities and suggests TR", () => {
    const s = slugs(input({ nationality: "NG" }));
    expect(s).not.toContain("visa-exemption");
    expect(s[0]).toBe("tourist-tr");
  });

  it("warns instead of excluding when nationality is unknown", () => {
    const r = findVisas(input({ nationality: null }), data);
    const ex = r.find((x) => x.slug === "visa-exemption");
    expect(ex?.warnings.map((w) => w.code)).toContain("checkNationality");
  });

  it("uses the extension when the stay exceeds the per-entry limit", () => {
    const r = findVisas(input({ stayDays: 90 }), data);
    const ex = r.find((x) => x.slug === "visa-exemption");
    expect(ex?.warnings.map((w) => w.code)).toContain("stayNeedsExtension");
  });

  it("drops short-stay visas for long stays", () => {
    const s = slugs(input({ stayDays: 180 }));
    expect(s).not.toContain("visa-exemption");
    expect(s).not.toContain("tourist-tr");
  });

  it("recommends DTV for a 6-month remote-work stay with enough funds", () => {
    const s = slugs(
      input({ purpose: "remote-work", stayDays: 180, remoteWork: true, funds: "500k-800k" }),
    );
    expect(s[0]).toBe("dtv");
  });

  it("excludes DTV when funds are below the minimum", () => {
    const s = slugs(
      input({ purpose: "remote-work", stayDays: 180, remoteWork: true, funds: "under-100k" }),
    );
    expect(s).not.toContain("dtv");
  });

  it("offers DTV and ED for long Muay Thai training", () => {
    const s = slugs(input({ purpose: "muay-thai", stayDays: 180, funds: "500k-800k" }));
    expect(s).toContain("dtv");
    expect(s).toContain("non-ed");
  });

  it("lets a short Muay Thai camp use visa exemption", () => {
    expect(slugs(input({ purpose: "muay-thai", stayDays: 30 }))).toContain("visa-exemption");
  });

  it("requires the minimum age for retirement", () => {
    expect(
      slugs(input({ purpose: "retire", stayDays: 365, age: 45, funds: "800k-3m" })),
    ).not.toContain("non-o-retirement");
    expect(slugs(input({ purpose: "retire", stayDays: 365, age: 60, funds: "800k-3m" }))[0]).toBe(
      "non-o-retirement",
    );
  });

  it("only returns work-permit visas for local employment", () => {
    expect(slugs(input({ purpose: "work", stayDays: 365 }))).toEqual(["non-b-business"]);
  });

  it("flags remote work on a short exemption stay as a grey area", () => {
    const r = findVisas(input({ remoteWork: true, stayDays: 30 }), data);
    const ex = r.find((x) => x.slug === "visa-exemption");
    expect(ex?.warnings.map((w) => w.code)).toContain("remoteWorkGrey");
  });

  it("does not push premium membership visas for short holidays", () => {
    const s = slugs(input({ stayDays: 30 }));
    expect(s.indexOf("thailand-privilege")).toBeGreaterThan(s.indexOf("tourist-tr"));
  });
});

describe("query string round-trip", () => {
  it("parses and serialises answers", () => {
    const p = new URLSearchParams(
      "nationality=gb&purpose=muay-thai&stay=up-to-180&remote=no&funds=500k-800k",
    );
    const a = answersFromParams(p);
    expect(a).toEqual({
      nationality: "GB",
      purpose: "muay-thai",
      stay: "up-to-180",
      remote: false,
      funds: "500k-800k",
      age: null,
    });
    expect(answersFromParams(answersToParams(a))).toEqual(a);
  });
  it("ignores invalid values", () => {
    const a = answersFromParams(
      new URLSearchParams("nationality=GBR&purpose=spy&stay=forever&age=5"),
    );
    expect(a).toEqual({
      nationality: null,
      purpose: null,
      stay: null,
      remote: null,
      funds: null,
      age: null,
    });
  });
  it("requires age only for retirement", () => {
    const base = {
      nationality: "GB",
      purpose: "retire",
      stay: "up-to-365",
      remote: false,
      funds: null,
      age: null,
    } as const;
    expect(toFinderInput(base)).toBeNull();
    expect(toFinderInput({ ...base, age: 55 })?.stayDays).toBe(365);
    expect(toFinderInput({ ...base, purpose: "holiday" })).not.toBeNull();
  });
});
