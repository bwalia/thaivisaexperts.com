# thaivisaexperts.com

An independent guide that helps travellers choose and apply for the right Thai visa, whether for a holiday, Muay Thai training, remote work (DTV), business, study, retirement or family. It's available in **English, French, Dutch and Thai**.

> Not a government website. The content is general guidance, not legal advice.

## What's inside

| Path                  | What it is                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------- |
| `apps/web`            | Next.js 16 (App Router) static site with next-intl and Tailwind CSS v4                       |
| `apps/mobile`         | Placeholder for the Expo iPhone app (prompt 02)                                              |
| `packages/content`    | Visa, guide and page content as JSON, validated by zod, plus UI messages in 4 languages      |
| `packages/visa-logic` | Pure TypeScript for the Visa Finder, stay calculator and URL state, shared by web and mobile |
| `packages/ui-tokens`  | Design tokens from `design-system/thai-visa-experts/MASTER.md` (ui-ux-pro-max)               |
| `design-system/`      | The generated design system (source of truth for visual decisions)                           |
| `docs/`               | Architecture, content authoring, images, and the generated TODO lists                        |

**Features:**

- **Visa Finder:** a 5–6 step wizard whose shareable results live in the URL.
- **Visa pages:** 12 visas, each with a printable document checklist, "last verified" dates and official sources.
- **Tools:** a comparison tool and a stay / 90-day-report calculator.
- **Other pages:** 9 guides, landing pages (Muay Thai, digital nomads, business), FAQ, legal pages and photo credits.
- **Search:** client-side, one index per language.
- **SEO:** hreflang, JSON-LD (Organization, WebSite, FAQPage, HowTo, BreadcrumbList), sitemap and Open Graph images.

## Getting started

Requires Node 22+ and pnpm (`corepack enable pnpm`).

```bash
pnpm install
pnpm dev              # http://localhost:3000 → /en/
```

| Command                                        | What it does                                                                                  |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `pnpm build`                                   | Static export to `apps/web/out` (also regenerates the content registry and responsive images) |
| `pnpm test`                                    | Unit tests (visa logic), content validation (all 4 locales), token contrast checks            |
| `pnpm test:e2e`                                | Playwright journeys against the built site (run `pnpm build` first)                           |
| `pnpm lint` / `pnpm typecheck` / `pnpm format` | Code quality                                                                                  |
| `pnpm --filter @tve/content check`             | Quick validation of English content while you write                                           |
| `pnpm --filter @tve/content todo`              | Regenerate `docs/CONTENT-TODO.md` and `docs/TRANSLATION-TODO.md`                              |
| `pnpm --filter @tve/ui-tokens build:css`       | Regenerate `tokens.css` after changing tokens                                                 |

**Missing translations fail the build and tests.** When you work on English content locally, set
`TVE_ALLOW_MISSING_TRANSLATIONS=1` to fall back to English until the translations exist.

## Updating content

Read `docs/CONTENT-AUTHORING.md`. In short:

1. Change facts (fees, days, funds) once in `packages/content/visas/<slug>/facts.json`, and update `lastVerified`.
2. Update the English text in `en.json` and set its `translatedFrom` to the new date.
3. Other languages then show a "the English version is newer" banner until they're re-translated.
4. Run `pnpm --filter @tve/content todo` and commit the regenerated TODO docs.
5. For a site-wide rule change, add an item to `packages/content/announcements.json`.

## Deploying

The site is a fully static export (`apps/web/out`), so it deploys unchanged to either host.

**Vercel**

- Import the repo and set **Root Directory** to `apps/web`. The framework preset is Next.js, and Vercel runs the `build` script (the `prebuild` step runs automatically).
- Install command: `pnpm install` (Vercel detects the pnpm workspace).
- Headers come from `apps/web/vercel.json`.

**Cloudflare Pages**

- Build command: `pnpm install --frozen-lockfile && pnpm build`
- Build output directory: `apps/web/out`
- Environment: `NODE_VERSION=24`
- Headers come from `apps/web/public/_headers`, and `404.html` is served automatically.

Optional build-time variables (contact form, analytics, site URL, expert-help CTA) are listed in `apps/web/.env.example`. Analytics is off by default and cookieless when enabled.

## Before launch

- **Unverified facts:** review `docs/CONTENT-TODO.md`. Every unverified fact is listed there, and the page shows a notice.
- **Translations:** have native speakers review everything in `docs/TRANSLATION-TODO.md`, starting with the disclaimer, privacy and terms pages. Then set `reviewStatus` to `"reviewed"`.
- **Operator details:** fill in the operator's legal name and address in the privacy and terms pages.
- **Photos:** replace the stock photos with your own (see `docs/IMAGES.md`).
