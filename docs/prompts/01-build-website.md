# Prompt 01 — Build the thaivisaexperts.com website

> Paste everything below the line into Claude Code, run from the repo root.
> A later prompt (02) will add the iPhone app, so this one sets up a structure the app can reuse.

---

## Role and goal

You are building **thaivisaexperts.com**, an independent guide that helps foreign travellers ("punters") choose and apply for the right Thai visa. It covers short holidays, Muay Thai training camps, business trips, and long stays such as the **DTV (Destination Thailand Visa)** for digital nomads.

Visitors should be able to answer three questions within about 60 seconds:
1. **Which visa fits me?** (nationality, purpose, length of stay)
2. **What do I need?** (documents, proof of funds, fees, processing time)
3. **How do I apply?** (step by step, with official links)

The site must look trustworthy, load fast on mobile, and be easy to update when Thai immigration rules change, which happens often.

The site launches in **four languages: English (`en`, default), French (`fr`), Dutch (`nl`) and Thai (`th`)**.

## Hard constraints

- **Not a government site.** Don't use Thai government crests, the Garuda emblem, or official-looking seals, and don't write copy that suggests an affiliation. Every page footer must say: *"thaivisaexperts.com is an independent information service and is not affiliated with the Royal Thai Government, Thai Immigration Bureau, or any embassy. Information is general guidance, not legal advice. Always confirm with official sources before you travel."*
- **Accuracy over completeness.** Visa rules change. Every visa page needs a visible **"Last verified: YYYY-MM-DD"** date and a **"Sources"** list linking to official pages (thaievisa.go.th, immigration.go.th, mfa.go.th, the relevant Royal Thai Embassy site, boi.go.th for LTR). If you can't verify a figure, mark it `TODO(verify)` in the content file. Never guess. Use web search to check current rules before writing content.
- **Content is data, not hard-coded JSX.** All visa information lives in structured content files (see "Architecture") so the future iPhone app can read the same source.
- **Free-licence images only** for now (see "Images"). Record the photographer credit and source URL for every image.
- **Four languages from day one:** every page, UI string, visa entry, guide, wizard question, error message, metadata field and the legal disclaimer must exist in `en`, `fr`, `nl` and `th`. English is the source of truth. The build must fail if any locale is missing a key or a content entry (see "Internationalisation").
- **Accessibility:** WCAG 2.2 AA, semantic HTML, keyboard navigable, alt text on every image, and a colour contrast ratio of at least 4.5:1.
- **Performance:** Lighthouse score of 95+ for Performance, Accessibility, Best Practices, and SEO on mobile. Static generation wherever possible.

## Tech stack

Use a **pnpm + Turborepo monorepo** so the iPhone app can join later without restructuring:

```
/apps/web            Next.js (latest stable, App Router, TypeScript, static export where possible)
/apps/mobile         (empty placeholder; the Expo / React Native app comes in prompt 02)
/packages/content    Visa data: typed schemas (zod) + MDX/JSON content, shared by web and mobile
/packages/visa-logic Pure TS functions for the eligibility wizard, unit tested, shared by web and mobile
/packages/ui-tokens  Colours, spacing, and typography tokens shared by web and mobile
```

- Styling: Tailwind CSS, with tokens imported from `packages/ui-tokens`.
- i18n: `next-intl` (App Router, locale-prefixed routes). UI strings live in `packages/content/messages/{en,fr,nl,th}.json` so the mobile app can reuse them.
- Content: MDX for long-form guides and JSON/TS objects validated by zod for structured visa facts.
- Testing: Vitest for `visa-logic` and `content` schema validation, and Playwright for key user journeys.
- Linting: ESLint + Prettier + `tsc --noEmit` in CI.
- CI: a GitHub Actions workflow that runs lint, typecheck, tests, and build on every PR.
- Hosting: deployable to Vercel or Cloudflare Pages with no code changes. Document both in the README.

## Content model (`packages/content`)

Define a zod schema `Visa` with at least these fields:

```ts
{
  slug: string                 // "dtv", "tourist-tr", "visa-exemption", ...
  name: string                 // "Destination Thailand Visa (DTV)"
  shortName: string
  category: "short-stay" | "long-stay" | "work-business" | "study-training" | "retirement" | "family"
  purposes: Purpose[]          // "holiday" | "muay-thai" | "remote-work" | "business-meeting" | "work" | "study" | "retire" | "family" | "wellness" | "cooking-course" ...
  summary: string              // 1–2 plain-language sentences
  maxStayDays: number | null
  extendable: { possible: boolean; detail: string }
  entries: "single" | "multiple" | "n/a"
  validity: string             // e.g. "5 years"
  feeTHB: number | null
  financialRequirement: string | null
  keyRequirements: string[]
  documents: string[]
  howToApply: { step: string; detail: string }[]
  processingTime: string
  bestFor: string[]
  notFor: string[]
  commonMistakes: string[]
  faqs: { q: string; a: string }[]
  officialSources: { label: string; url: string }[]
  lastVerified: string         // ISO date
  heroImage: ImageRef
}
```

Store one file per visa per locale: `packages/content/visas/<slug>/{en,fr,nl,th}.mdx` (or `.json`). Language-neutral facts (`maxStayDays`, `feeTHB`, `entries`, `lastVerified`, `officialSources` URLs, `heroImage`) live once in `packages/content/visas/<slug>/facts.json`, so a fee change is made in one place and every language picks it up. Localised files hold only the text fields and a `translatedFrom` field (the English `lastVerified` date they were translated from).

Also define a `Country` list (country names localised in all four languages) with nationality-specific visa-exemption status, and an `ImageRef` type (`src`, `alt`, `credit`, `creditUrl`, `licence`).

### Visas to cover at launch (verify each one against official sources first)

| Slug | Visa | Main audience |
|---|---|---|
| `visa-exemption` | Visa exemption on arrival (check the current length of stay and eligible countries; this has changed recently) | Holidaymakers |
| `visa-on-arrival` | Visa on Arrival (VoA) | Holidaymakers from VoA countries |
| `tourist-tr` | Tourist Visa (TR), single and multiple entry | Longer holidays |
| `dtv` | Destination Thailand Visa: digital nomads, remote workers, and "soft power" activities (Muay Thai, Thai cooking, Thai massage, etc.) | Nomads, **Muay Thai students** |
| `non-b-business` | Non-Immigrant B (business/work) + work permit overview | Business, employment |
| `non-ed` | Non-Immigrant ED (education, including Muay Thai schools that sponsor ED visas) | Students, long-term Muay Thai |
| `non-o-retirement` / `non-oa` | Retirement visas | Retirees |
| `non-o-family` | Marriage / family visa | Thai spouse or family |
| `ltr` | Long-Term Resident visa (BOI) | Wealthy / high-skilled professionals |
| `thailand-privilege` | Thailand Privilege (formerly Elite) membership visa | Long-stay, premium |
| `smart` | SMART visa | Tech and talent |

Also cover these related topics as guides rather than visa pages: **TDAC (Thailand Digital Arrival Card)**, **90-day reporting**, **TM30**, **re-entry permits**, **visa extensions at immigration offices**, **overstay penalties**, and **the Thai e-Visa portal walkthrough**.

## Site map

Every route is prefixed with the locale: `/en/...`, `/fr/...`, `/nl/...`, `/th/...`. `/` detects the browser language (`Accept-Language`) and redirects, falling back to `/en`. Slugs stay in English across all locales (e.g. `/fr/visas/dtv`) so links and the mobile app stay simple.

```
/[locale]                 Home
/visa-finder              Interactive eligibility wizard (the core feature)
/visas                    All visas, filterable by purpose / stay length / budget
/visas/[slug]             Visa detail page
/compare                  Side-by-side comparison of 2–3 visas
/guides                   Guides index
/guides/[slug]            Guides (TDAC, 90-day report, e-Visa walkthrough, Muay Thai camp + visa guide, digital nomad cities, ...)
/muay-thai                Landing page: visas for training in Thailand (DTV vs ED vs tourist), camp tips
/digital-nomads           Landing page: DTV deep dive, nomad hubs (Chiang Mai, Bangkok, Koh Phangan, Phuket)
/business                 Landing page: Non-B, work permit, LTR, SMART
/faq
/about                    Who we are, editorial policy, how we verify information
/contact                  Contact form (static-friendly: Formspree or a Next route handler with a pluggable provider)
/privacy, /terms, /disclaimer
```

## Key features

1. **Visa Finder wizard** (`/visa-finder`) with 4–6 steps: nationality → purpose → planned stay length → working remotely for a foreign employer? → funds available (bands) → age (only if retirement is relevant). The output is a ranked list of suitable visas with a one-line reason for each and a link to the detail page. The logic lives in `packages/visa-logic` as pure, unit-tested functions with no UI imports. Wizard state is kept in the URL query string so results can be shared.
2. **Document checklist** on each visa page: interactive checkboxes saved in `localStorage` (wrap in try/catch), plus a "Print / Save as PDF" print stylesheet.
3. **Compare** tool, with a table view on desktop and stacked cards on mobile.
4. **Stay calculator:** enter an arrival date and a visa, and see the last legal day to stay (including extension options) and 90-day report dates. The logic goes in `visa-logic`, with tests.
5. **"Rules changed" banner:** a small content-driven announcement bar for major changes (e.g. a change in the visa-exemption length).
6. **Search** across visas and guides, done client-side at build time (e.g. Pagefind or FlexSearch).

## Internationalisation

- **Locales:** `en` (default and source of truth), `fr`, `nl`, `th`. Add a language switcher in the header and footer that keeps the user on the same page and preserves wizard query parameters. Label each language in its own language ("English", "Français", "Nederlands", "ไทย"); don't use flags. Remember the choice in a cookie.
- **Translation workflow:** write English first, then translate into French, Dutch and Thai. Keep immigration terms precise: use the official names of visas and offices, and add the official Thai term in brackets where it helps. Don't translate proper nouns such as "Destination Thailand Visa" or "TDAC"; explain them instead.
- **Human review flag:** every translated file has `reviewStatus: "machine" | "reviewed"`. Pages with `machine` status show a small note, in the page's language: "This page was translated automatically and is awaiting review. The English version is authoritative." List all unreviewed files in `docs/TRANSLATION-TODO.md`. The disclaimer, privacy, terms and disclaimer pages in `fr`, `nl` and `th` must be reviewed by a native speaker before launch.
- **Stale translations:** if the English `lastVerified` is newer than a translation's `translatedFrom`, show a banner on that page ("The English version of this page was updated more recently") with a link to the English page, and list the page in `docs/TRANSLATION-TODO.md`.
- **Missing-content check:** a Vitest test fails if any locale is missing a message key, a visa, a guide, or a required field. Run it in CI.
- **Formatting:** use `Intl` for dates, numbers and currency (THB) per locale. Thai pages use Gregorian dates, with the Buddhist Era year alongside where helpful (e.g. "2026 (พ.ศ. 2569)"), since Thai immigration forms use it.
- **Thai typography:** Thai has no spaces between words and has tone marks and vowels above and below the line. Use a line height of at least 1.6 for Thai body text, avoid `text-transform` and letter-spacing on Thai, and check that marks aren't clipped in buttons, badges and headings with tight line heights.
- **Layout robustness:** French and Dutch text runs 20–30% longer than English. Test every component (buttons, nav, cards, comparison table, wizard) in the longest locale, and make sure nothing overflows at 360px width.
- **Search:** build a separate search index per locale.
- **Images:** alt text is localised too, so `images.json` stores `alt` as `{ en, fr, nl, th }`.
- **Audience notes for copy:** many French and Dutch readers are holidaymakers, Muay Thai students and retirees from France, Belgium, the Netherlands and Switzerland, so name the relevant Royal Thai Embassies (Paris, Brussels, The Hague, Bern) in how-to-apply steps. The Thai version also serves Thai partners, employers and family members helping a foreigner apply, so write it for that reader (e.g. "documents your foreign spouse needs").

## Design direction

Use the **ui-ux-pro-max** skill (https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) for every design decision. If it isn't installed, install it by following that repo's README before starting.

- **Design system source of truth:** `design-system/thai-visa-experts/MASTER.md`, generated by the skill: Travel/Tourism Agency category, "Soft UI Evolution" style, "Storytelling-Driven + Hero" page pattern, sky blue + adventure orange palette, Noto Sans Thai type, a standard spacing scale and subtle motion. Read it before building any page. For page-specific rules, create `design-system/thai-visa-experts/pages/<page>.md` with the skill's `--page` option (at least `visa-finder`, `visa-detail` and `compare`). Page files override MASTER.md.
- **Translate MASTER.md into code:** put its colours, spacing, radii and shadows into `packages/ui-tokens` as semantic tokens (`primary`, `on-primary`, `accent`, `background`, `foreground`, `muted`, `border`, `destructive`, `ring`) and use only those in components. Don't write raw hex values in components.
- **Adjustments to the generated system:**
  - Sky blue `#0EA5E9` fails 4.5:1 contrast as text on the light background. Use it for fills and large surfaces only, and use a darker shade (e.g. `#0369A1`) for links and small text. Check every token pair.
  - Add a full dark mode with its own contrast-checked token values.
  - Noto Sans Thai covers Latin and Thai, so use it for all four languages via `next/font` for consistent weight and rhythm. Optionally pair it with a Latin display face for headings in `en`/`fr`/`nl`, but only if the skill's typography search supports that pairing.
  - The skill's "Scroll Reveal" motion snippet uses GSAP. Prefer CSS transitions or a small IntersectionObserver instead of adding GSAP for the website, and never hide SEO content by default.
- **Honour the skill's anti-patterns:** no generic stock photos (choose Thailand-specific images) and no complex booking-style flows. The Visa Finder should feel like a short, friendly questionnaire.
- **Skill UX rules to apply:** Visa Finder shows "Step X of N" with a progress bar, visible labels, errors next to the field, and a back button that keeps answers. On mobile, the comparison table becomes stacked cards (or scrolls horizontally inside an `overflow-x-auto` wrapper). Touch targets are at least 44×44px, icons are Lucide/Heroicons SVGs (no emoji), image space is reserved so CLS stays below 0.1, and `prefers-reduced-motion` is respected.
- **Trust signals:** the "Last verified" date, the sources list, the disclaimer, an "About our editorial process" link, and a clear note that the site isn't a government service. Place them visibly, not only in the footer.
- The tone should be warm, confident and modern, not a "government portal" and not backpacker-cheap.
- Before each page is done, run through the skill's pre-delivery checklist (in MASTER.md and the skill's `references/`).
- Home hero: a full-bleed Thailand photo, the headline "Find the right Thai visa in 60 seconds" (localised), a primary CTA to **Start Visa Finder**, and a secondary CTA to **Browse all visas**.
- Home sections: purpose tiles (Holiday · Muay Thai · Digital Nomad · Business · Retire · Study · Family) → "Most popular visas" cards (Exemption, DTV, TR, Non-B) → how it works (3 steps) → latest rule changes → FAQ teaser → newsletter signup placeholder.
- Mobile first. Use large tap targets, and add a sticky "Start Visa Finder" button on mobile visa pages.

## Images

- Source images from **Unsplash** and **Pexels** only (free licences, commercial use allowed). Download them into `apps/web/public/images/<section>/` and optimise them with `next/image`.
- Keep `packages/content/images.json` as the single registry: `{ id, src, alt, credit, creditUrl, sourceUrl, licence }`. Pages reference images by `id` only, so the owner's own holiday photos can replace stock images later by editing one file.
- Needed images include: Bangkok skyline/temples, Chiang Mai old city, islands and beaches (Phi Phi, Krabi, Koh Samui), a Muay Thai training camp and ring, a co-working/laptop scene in Thailand, a business district (Sathorn/Silom), a Thai street food/cooking class, and airport arrivals.
- Add a `/credits` page generated from `images.json`.
- Also create `docs/IMAGES.md` explaining how to swap in the owner's photos (size, aspect ratio, naming convention, alt text).

## SEO

- Per-page metadata, Open Graph and Twitter images (generated with `next/og`), and canonical URLs.
- JSON-LD: `Organization`, `WebSite` with SearchAction, `FAQPage` on visa pages and the FAQ page, `BreadcrumbList`, and `HowTo` for application steps.
- `sitemap.xml` (listing all four locales for each URL) and `robots.txt` generated at build time.
- `hreflang` alternate links for `en`, `fr`, `nl` and `th`, plus `x-default`, on every page. Set `<html lang>` per locale, along with `og:locale` and `og:locale:alternate`.
- Page titles are written natively for each language, not translated word for word, e.g. "DTV Visa Thailand 2026: Requirements, Fees & How to Apply" / "Visa DTV Thaïlande 2026 : conditions, frais et démarches" / "DTV-visum Thailand 2026: voorwaarden, kosten en aanvraag" / "วีซ่า DTV 2026: คุณสมบัติ ค่าธรรมเนียม และวิธีสมัคร".
- Clean URLs, internal linking between related visas and guides, and a descriptive 404 page.
- Adding another language later (e.g. `de`, `ru`, `zh`) should only need a new messages file, new content files and one line of config.

## Analytics, monetisation hooks (placeholders only)

- A privacy-friendly analytics slot (Plausible or Umami), switched on by an env var and off by default.
- A cookie banner only if a non-essential tracker is enabled.
- A placeholder component for a future "Get expert help" / consultation booking CTA and affiliate slots (insurance, co-working, Muay Thai camps). Render nothing unless the component is configured.

## Deliverables and order of work

1. Scaffold the monorepo, tooling, CI, and README (setup, scripts, deploy).
2. Build `packages/content` schemas and `packages/visa-logic` with tests **first**.
3. Research and write the English content for the visas in the launch table, with sources and `lastVerified`, using web search. Flag anything uncertain with `TODO(verify)` and list those items in `docs/CONTENT-TODO.md`.
4. Set up `next-intl`, locale routing, the language switcher and the missing-translation test. Translate UI strings and content into French, Dutch and Thai, mark each file `reviewStatus: "machine"`, and list them in `docs/TRANSLATION-TODO.md`.
5. Read `design-system/thai-visa-experts/MASTER.md`, generate the page overrides with ui-ux-pro-max, then build the design tokens, layout, header/footer (with disclaimer and language switcher), and home page.
6. Build the visa listing, visa detail, Visa Finder, compare, and stay calculator.
7. Build the guides, landing pages (Muay Thai, Digital Nomads, Business), FAQ, legal pages, and credits.
8. Add SEO, the sitemap, JSON-LD, and OG images.
9. Add Playwright tests for these journeys: complete the Visa Finder → land on the DTV page → tick checklist items → compare DTV vs TR. Run the Visa Finder journey in all four locales, and check that the language switcher keeps the current page and wizard answers.
10. Run Lighthouse on the home page, a visa detail page, and the Visa Finder, in `en` and `th`. Fix anything below 95. Then run the ui-ux-pro-max pre-delivery checklist on every page.
11. Write `docs/ARCHITECTURE.md`, covering how web and the future mobile app share `content`, `visa-logic`, and `ui-tokens`.

Commit in logical steps with clear messages. Don't push or deploy without asking.

## Definition of done

- `pnpm install && pnpm build && pnpm test && pnpm lint` all pass from a clean clone.
- Every page exists in `en`, `fr`, `nl` and `th`, the missing-translation test passes, and `hreflang` tags are correct.
- Thai pages render correctly on iPhone Safari and Android Chrome, with no clipped tone marks and no overflowing headings.
- Every visa page has sources, a last-verified date, and the disclaimer, in the page's language.
- Every machine-translated file is listed in `docs/TRANSLATION-TODO.md`.
- Components use only `ui-tokens` values that match `design-system/thai-visa-experts/MASTER.md` (plus the adjustments above), and every token pair passes contrast checks in light and dark mode.
- No `TODO(verify)` items are hidden. All of them are listed in `docs/CONTENT-TODO.md`.
- Every image has a credit entry, and `/credits` renders.
- Mobile Lighthouse scores are 95+ on the three key pages, in `en` and `th`.
