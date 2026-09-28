# Content authoring guide

All site content lives in `packages/content` as JSON, validated by zod schemas in
`packages/content/src/schema.ts`. The website and the future iPhone app read the same files.

## Layout

```
packages/content/
  visas/<slug>/facts.json        language-neutral facts (numbers, sources, dates)   -> VisaFacts
  visas/<slug>/{en,fr,nl,th}.json localised text                                   -> VisaText
  guides/<slug>/meta.json        language-neutral guide metadata                    -> ArticleMeta
  guides/<slug>/{en,fr,nl,th}.json localised guide body                            -> ArticleText
  pages/<slug>/...               same shape as guides (about, faq, privacy, terms, disclaimer)
  countries.json                 nationality exemption / VoA rules                  -> CountriesFile
  images.json                    image registry (credits, localised alt text)       -> ImageRef[]
  announcements.json             "rules changed" banner items                       -> Announcement[]
  messages/{en,fr,nl,th}.json    UI strings (next-intl format)
```

Validate English content with `pnpm --filter @tve/content check`, and everything
(including translations) with `pnpm --filter @tve/content test`.

## Accuracy rules

- **Never guess.** Check every number (fees, days, funds, ages) against an official source:
  thaievisa.go.th, immigration.go.th, mfa.go.th / consular.mfa.go.th, Royal Thai Embassy sites,
  boi.go.th / ltr.boi.go.th, smart-visa.boi.go.th, thailandprivilege.co.th, tdac.immigration.go.th.
  Reputable secondary sources can help you find the official page, but cite the official one.
- If a number can't be confirmed, set it to `null` in `facts.json`, write the text around it
  ("check with your embassy") and add a line to `todo` starting with `TODO(verify):`.
- Where rules differ by embassy (fees, bank-statement periods), say so plainly.
- `lastVerified` is the date you checked (today). In `en.json`, `translatedFrom` equals `lastVerified`
  and `reviewStatus` is `"source"`.
- Translations set `translatedFrom` to the English `lastVerified` they were based on and
  `reviewStatus` to `"machine"` until a native speaker reviews them.
- Keep list lengths (`howToApply`, `documents`, `faqs`, article `sections`) identical across locales.

## Voice

- Plain, friendly, confident, second person ("you"). Short sentences. No hype, no emoji.
- Explain jargon once (e.g. "TM30 — the address notification your landlord files").
- Never imply we are the government or can guarantee an outcome.
- Write for the reader of that page: holidaymakers, Muay Thai students, digital nomads,
  business travellers, retirees, families.

## Translation notes

- Keep official proper nouns in English: "Destination Thailand Visa (DTV)", "TDAC", "Non-Immigrant B",
  "LTR", "SMART", "Thailand Privilege". Explain them in the target language.
- French: use "vous". Dutch: use "je/jij" (informal, standard for travel sites). Thai: polite, neutral register,
  no ครับ/ค่ะ particles in body text.
- Write natural SEO titles in each language rather than word-for-word translations.
- Numbers, fees and dates are not translated here; they come from `facts.json`. In text, use
  the local number format (e.g. "10 000 THB" in French, "10.000 THB" in Dutch, "10,000 บาท" in Thai).

## Image ids

Reference images by id only. Available ids (see `images.json`):

`bangkok-temple`, `bangkok-skyline`, `chiang-mai-old-city`, `phi-phi-beach`, `krabi-longtail`,
`koh-samui-beach`, `muay-thai-training`, `muay-thai-ring`, `coworking-laptop`, `business-district`,
`street-food`, `cooking-class`, `airport-arrivals`, `passport-documents`, `retirement-beach`,
`family-thailand`, `university-campus`, `thai-massage`.

To swap in your own photos, see `docs/IMAGES.md`.

## TODO lists

`docs/CONTENT-TODO.md` and `docs/TRANSLATION-TODO.md` are generated from the content files
(`todo` arrays, `reviewStatus`, `translatedFrom`). Regenerate them with `pnpm --filter @tve/content todo`.
CI fails if they are out of date.
