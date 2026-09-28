/**
 * Design tokens for web and mobile, from design-system/thai-visa-experts/MASTER.md
 * (ui-ux-pro-max: Travel/Tourism, Soft UI Evolution, sky blue + adventure orange),
 * with the contrast adjustments from docs/prompts/01-build-website.md:
 * sky blue is used for fills only; links/small text use `primaryStrong`; the CTA orange is darkened
 * from #EA580C to #C2410C so white button text passes 4.5:1. Every text pair is checked in test/.
 */

export const colors = {
  light: {
    background: "#F0F9FF",
    surface: "#FFFFFF",
    foreground: "#0C4A6E",
    muted: "#E8F2F8",
    mutedForeground: "#475569",
    border: "#BAE6FD",
    primary: "#0EA5E9",
    onPrimary: "#0F172A",
    primaryStrong: "#0369A1",
    secondary: "#38BDF8",
    accent: "#C2410C",
    onAccent: "#FFFFFF",
    success: "#047857",
    warning: "#B45309",
    destructive: "#DC2626",
    onDestructive: "#FFFFFF",
    ring: "#0369A1",
  },
  dark: {
    background: "#0B1220",
    surface: "#111A2E",
    foreground: "#E2E8F0",
    muted: "#1E293B",
    mutedForeground: "#A3B1C6",
    border: "#1E3A5F",
    primary: "#38BDF8",
    onPrimary: "#0B1220",
    primaryStrong: "#7DD3FC",
    secondary: "#0EA5E9",
    accent: "#FB923C",
    onAccent: "#0B1220",
    success: "#34D399",
    warning: "#FBBF24",
    destructive: "#F87171",
    onDestructive: "#0B1220",
    ring: "#7DD3FC",
  },
} as const;

export type ColorToken = keyof typeof colors.light;

/** Density 4/10 — standard scale (px). */
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, "2xl": 48, "3xl": 64 } as const;

export const radius = { sm: 6, md: 8, lg: 12, xl: 16, full: 9999 } as const;

export const shadow = {
  sm: "0 1px 2px rgba(12,74,110,0.06)",
  md: "0 4px 12px rgba(12,74,110,0.08)",
  lg: "0 10px 24px rgba(12,74,110,0.10)",
  xl: "0 20px 40px rgba(12,74,110,0.14)",
} as const;

export const typography = {
  /** Noto Sans Thai covers Latin and Thai, so one family serves en/fr/nl/th. */
  fontFamily: "Noto Sans Thai",
  weights: [400, 500, 600, 700] as const,
  baseSize: 16,
  lineHeight: { body: 1.6, bodyThai: 1.75, heading: 1.25, headingThai: 1.45 },
  scale: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30, "4xl": 36, "5xl": 48 },
} as const;

export const motion = {
  /** Subtle motion (dial 3/10). Respect prefers-reduced-motion. */
  durationFast: 150,
  duration: 200,
  durationSlow: 300,
  easing: "cubic-bezier(0.2, 0, 0, 1)",
} as const;

/** Minimum touch target (px). */
export const touchTarget = 44;

// ---------- Contrast ----------

function luminance(hex: string): number {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(n.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two hex colours. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Text/background pairs used in the UI, with the minimum ratio each must meet. */
export const contrastPairs: [fg: ColorToken, bg: ColorToken, min: number][] = [
  ["foreground", "background", 4.5],
  ["foreground", "surface", 4.5],
  ["foreground", "muted", 4.5],
  ["mutedForeground", "background", 4.5],
  ["mutedForeground", "surface", 4.5],
  ["mutedForeground", "muted", 4.5],
  ["primaryStrong", "background", 4.5],
  ["primaryStrong", "surface", 4.5],
  ["onPrimary", "primary", 4.5],
  ["onAccent", "accent", 4.5],
  ["onDestructive", "destructive", 4.5],
  ["success", "surface", 4.5],
  ["warning", "surface", 4.5],
  ["destructive", "surface", 4.5],
  ["ring", "background", 3],
  ["ring", "surface", 3],
];
