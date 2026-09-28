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

## Hard constraints

- **Not a government site.** Don't use Thai government crests, the Garuda emblem, or official-looking seals, and don't write copy that suggests an affiliation. Every page footer must say: *"thaivisaexperts.com is an independent information service and is not affiliated with the Royal Thai Government, Thai Immigration Bureau, or any embassy. Information is general guidance, not legal advice. Always confirm with official sources before you travel."*
- **Accuracy over completeness.** Visa rules change. Every visa page needs a visible **"Last verified: YYYY-MM-DD"** date and a **"Sources"** list linking to official pages (thaievisa.go.th, immigration.go.th, mfa.go.th, the relevant Royal Thai Embassy site, boi.go.th for LTR). If you can't verify a figure, mark it `TODO(verify)` in the content file. Never guess. Use web search to check current rules before writing content.
- **Content is data, not hard-coded JSX.** All visa information lives in structured content files (see "Architecture") so the future iPhone app can read the same source.
- **Free-licence images only** for now (see "Images"). Record the photographer credit and source URL for every image.
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
  summary: string              // 1–2 plain-English sentences
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

Also define a `Country` list with nationality-specific visa-exemption status, and an `ImageRef` type (`src`, `alt`, `credit`, `creditUrl`, `licence`).

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

```
/                         Home
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

## Design direction

- Warm, confident, and modern, not "government portal" and not backpacker-cheap. The mood should suggest tropical calm plus competent advice.
- Suggested palette: deep teal or indigo as the primary colour, warm saffron/gold as the accent (nodding to temple gold without copying official symbols), off-white sand background, and a full dark mode.
- Typography: a clean sans for UI (e.g. Inter or Plus Jakarta Sans) and optionally a characterful display face for headings. Load it via `next/font`.
- Home hero: a full-bleed Thailand photo, the headline "Find the right Thai visa in 60 seconds", a primary CTA to **Start Visa Finder**, and a secondary CTA to **Browse all visas**.
- Home sections: purpose tiles (Holiday · Muay Thai · Digital Nomad · Business · Retire · Study · Family) → "Most popular visas" cards (Exemption, DTV, TR, Non-B) → how it works (3 steps) → latest rule changes → FAQ teaser → newsletter signup placeholder.
- Mobile first. Use large tap targets, and add a sticky "Start Visa Finder" button on mobile visa pages.
- Use subtle motion only, and respect `prefers-reduced-motion`.

## Images

- Source images from **Unsplash** and **Pexels** only (free licences, commercial use allowed). Download them into `apps/web/public/images/<section>/` and optimise them with `next/image`.
- Keep `packages/content/images.json` as the single registry: `{ id, src, alt, credit, creditUrl, sourceUrl, licence }`. Pages reference images by `id` only, so the owner's own holiday photos can replace stock images later by editing one file.
- Needed images include: Bangkok skyline/temples, Chiang Mai old city, islands and beaches (Phi Phi, Krabi, Koh Samui), a Muay Thai training camp and ring, a co-working/laptop scene in Thailand, a business district (Sathorn/Silom), a Thai street food/cooking class, and airport arrivals.
- Add a `/credits` page generated from `images.json`.
- Also create `docs/IMAGES.md` explaining how to swap in the owner's photos (size, aspect ratio, naming convention, alt text).

## SEO

- Per-page metadata, Open Graph and Twitter images (generated with `next/og`), and canonical URLs.
- JSON-LD: `Organization`, `WebSite` with SearchAction, `FAQPage` on visa pages and the FAQ page, `BreadcrumbList`, and `HowTo` for application steps.
- `sitemap.xml` and `robots.txt` generated at build time.
- Keyword-oriented page titles, such as "DTV Visa Thailand 2026: Requirements, Fees & How to Apply".
- Clean URLs, internal linking between related visas and guides, and a descriptive 404 page.
- Leave i18n ready but English-only at launch: structure routes and content so `/th`, `/de`, `/ru`, `/zh` can be added later.

## Analytics, monetisation hooks (placeholders only)

- A privacy-friendly analytics slot (Plausible or Umami), switched on by an env var and off by default.
- A cookie banner only if a non-essential tracker is enabled.
- A placeholder component for a future "Get expert help" / consultation booking CTA and affiliate slots (insurance, co-working, Muay Thai camps). Render nothing unless the component is configured.

## Deliverables and order of work

1. Scaffold the monorepo, tooling, CI, and README (setup, scripts, deploy).
2. Build `packages/content` schemas and `packages/visa-logic` with tests **first**.
3. Research and write content for the visas in the launch table, with sources and `lastVerified`, using web search. Flag anything uncertain with `TODO(verify)` and list those items in `docs/CONTENT-TODO.md`.
4. Build the design tokens, layout, header/footer (with disclaimer), and home page.
5. Build the visa listing, visa detail, Visa Finder, compare, and stay calculator.
6. Build the guides, landing pages (Muay Thai, Digital Nomads, Business), FAQ, legal pages, and credits.
7. Add SEO, the sitemap, JSON-LD, and OG images.
8. Add Playwright tests for these journeys: complete the Visa Finder → land on the DTV page → tick checklist items → compare DTV vs TR.
9. Run Lighthouse on the home page, a visa detail page, and the Visa Finder. Fix anything below 95.
10. Write `docs/ARCHITECTURE.md`, covering how web and the future mobile app share `content`, `visa-logic`, and `ui-tokens`.

Commit in logical steps with clear messages. Don't push or deploy without asking.

## Definition of done

- `pnpm install && pnpm build && pnpm test && pnpm lint` all pass from a clean clone.
- Every visa page has sources, a last-verified date, and the disclaimer.
- No `TODO(verify)` items are hidden. All of them are listed in `docs/CONTENT-TODO.md`.
- Every image has a credit entry, and `/credits` renders.
- Mobile Lighthouse scores are 95+ on the three key pages.
