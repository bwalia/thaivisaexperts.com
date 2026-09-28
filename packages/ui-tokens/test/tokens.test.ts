import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { colors, contrastPairs, contrastRatio } from "../src";
import { renderCss } from "../src/css";

describe("contrast", () => {
  for (const mode of ["light", "dark"] as const) {
    for (const [fg, bg, min] of contrastPairs) {
      it(`${mode}: ${fg} on ${bg} ≥ ${min}:1`, () => {
        const ratio = contrastRatio(colors[mode][fg], colors[mode][bg]);
        expect(ratio, `${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min);
      });
    }
  }
  it("computes known ratios", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
  });
});

describe("tokens.css", () => {
  it("is up to date (run pnpm --filter @tve/ui-tokens build:css)", () => {
    const css = readFileSync(join(__dirname, "..", "tokens.css"), "utf8");
    expect(css).toBe(renderCss());
  });
});
