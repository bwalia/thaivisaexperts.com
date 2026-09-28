# Architecture

```
apps/web  (Next.js, static export) ──┐
apps/mobile (Expo, prompt 02) ───────┼──> packages/content     JSON content + zod schemas + messages
                                     ├──> packages/visa-logic  pure TS: finder, stay calculator, URL state
                                     └──> packages/ui-tokens   colours, spacing, radii, type, motion
```

## Shared packages

The packages are consumed as TypeScript source: Next uses `transpilePackages`, and Metro/Expo can bundle TS directly. There's no build step.

### `@tve/content`

- **Data:** everything is JSON, so the iPhone app bundles the same files. Language-neutral facts (`facts.json`/`meta.json`) are kept separate from localised text (`<locale>.json`).
- **Registry:** `scripts/generate-registry.mjs` writes `src/generated/registry.ts`, a file of static imports. That means no `fs` at runtime, which works in both Next and Metro. It runs on `postinstall`, `pretest` and before web builds.
- **Imports:**
  - `@tve/content`: the loader API (`getVisa`, `getVisas`, `getArticle`, `getCountries`, `getImages`, `getMessages`, `isStale`). It parses with zod, so use it on the server or at build time only.
  - `@tve/content/locales`: zod-free constants (`LOCALES`, `PURPOSES`, …). **Client code must import constants from here**, because importing `@tve/content/schema` from a client component pulls about 90 KB of zod into the bundle.
  - `@tve/content/schema`: zod schemas and types (use `import type` from client code).
- **Guides as JSON, not MDX:** long-form guides are stored as structured JSON (`sections` with headings, paragraphs and lists) rather than the MDX the prompt suggested. React Native can render JSON directly, but MDX would need a separate renderer and would tie the content to the web.
- **Tests:** `test/content.test.ts` enforces that every visa, guide, page and message key exists in `en`, `fr`, `nl` and `th`, with matching list lengths. It also checks that `docs/CONTENT-TODO.md` and `docs/TRANSLATION-TODO.md` are current.

### `@tve/visa-logic`

- **Visa Finder:** `findVisas(input, { visas, countries })` is a pure, deterministic ranking. It returns reason and warning _codes_, which each UI localises (`finder.reasons.<code>`).
- **Stay calculator:** `calculateStay()` treats the arrival day as day 1 and adds 90-day report windows (15 days before to 7 days after the due date).
- **URL state:** `answersFromParams` / `answersToParams` keep wizard answers in the URL, so results are shareable. The mobile app can use them for deep links.

### `@tve/ui-tokens`

- **Source:** tokens come from `design-system/thai-visa-experts/MASTER.md`, with contrast fixes: sky blue is used only for fills, links use `primaryStrong`, and the CTA orange is darkened to `#C2410C`.
- **Contrast tests:** every text/background pair is checked for ≥4.5:1 contrast (≥3:1 for focus rings) in light and dark mode.
- **CSS:** `tokens.css` is generated for the web. The mobile app imports the TS objects.

## Web app (`apps/web`)

- **Static export:**
  - `output: "export"` with `trailingSlash`. Every locale and page is pre-rendered through `generateStaticParams` and `setRequestLocale`.
  - `/` is a tiny page that picks the language from a saved choice, then the browser language, then English.
  - Deploys to Vercel or Cloudflare Pages without code changes.
- **i18n:** next-intl with `localePrefix: "always"`.
  - Only the message namespaces a client component needs are sent to the browser (`ClientMessages`).
  - Server components use `getTranslations`.
- **Client state:** browser state (URL query and localStorage) is read through `useSyncExternalStore` (`src/lib/client-store.ts`).
  - The URL is the source of truth for the finder, filters, comparison, calculator and search.
  - localStorage is used only for per-browser conveniences: checklist ticks, theme, dismissed announcements and language choice.
- **Images:**
  - `scripts/prepare.mjs` generates WebP variants (480/828/1200/1920) and 1200×630 JPEG share images.
  - A custom `next/image` loader maps widths to those variants, since static export has no image server.
- **Fonts:** Noto Sans Thai (Latin + Thai) through `next/font`. Thai gets a taller line height and no letter-spacing.
- **Performance:**
  - Hero images use `fetchPriority="high"`.
  - The JS bundle excludes zod and content.
  - Mobile Lighthouse scores: home ~95, visa and finder pages ~96, with Accessibility, Best Practices and SEO at 100.

## Adding a language

1. Add the code to `LOCALES` in `packages/content/src/locales.ts`, and to `LocalizedString` in `schema.ts`.
2. Add `messages/<code>.json` and a `<code>.json` next to every `en.json`.
3. Add the language name and OG locale in `apps/web/src/lib/site.ts`, and the Intl tag in `src/lib/format.ts`.
4. `pnpm test` shows anything still missing.

## Adding the iPhone app (prompt 02)

Create `apps/mobile` as an Expo app with `@tve/content`, `@tve/visa-logic` and `@tve/ui-tokens` as `workspace:*` dependencies:

- **Messages:** reuse `getMessages(locale)` with an ICU-capable library, such as `use-intl`, which next-intl builds on.
- **Deep links:** map `/visa-finder?...` onto the app's finder screen using `answersFromParams`.
