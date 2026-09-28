import { colors, motion, radius, shadow, space } from "./index";

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function colorVars(mode: keyof typeof colors, indent: string) {
  return Object.entries(colors[mode])
    .map(([k, v]) => `${indent}--tve-${kebab(k)}: ${v};`)
    .join("\n");
}

/** CSS custom properties; dark mode follows the OS unless data-theme="light" is set. */
export function renderCss(): string {
  const scale = [
    ...Object.entries(space).map(([k, v]) => `  --tve-space-${k}: ${v / 16}rem;`),
    ...Object.entries(radius).map(
      ([k, v]) => `  --tve-radius-${k}: ${v === 9999 ? "9999px" : `${v / 16}rem`};`,
    ),
    ...Object.entries(shadow).map(([k, v]) => `  --tve-shadow-${k}: ${v};`),
    `  --tve-duration-fast: ${motion.durationFast}ms;`,
    `  --tve-duration: ${motion.duration}ms;`,
    `  --tve-duration-slow: ${motion.durationSlow}ms;`,
    `  --tve-easing: ${motion.easing};`,
  ].join("\n");
  return `/* AUTO-GENERATED from packages/ui-tokens/src/index.ts. Run \`pnpm --filter @tve/ui-tokens build:css\`. */
:root {
  color-scheme: light;
${colorVars("light", "  ")}
${scale}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
${colorVars("dark", "    ")}
  }
}

:root[data-theme="dark"] {
  color-scheme: dark;
${colorVars("dark", "  ")}
}
`;
}
