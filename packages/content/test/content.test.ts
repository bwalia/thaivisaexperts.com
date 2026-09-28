import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  ArticleMeta,
  ArticleText,
  CountriesFile,
  ImageRef,
  LOCALES,
  VisaFacts,
  VisaText,
} from "../src/schema";
import {
  countriesFile,
  guideFiles,
  imagesFile,
  messageFiles,
  pageFiles,
  visaFiles,
} from "../src/generated/registry";

function keyPaths(obj: unknown, prefix = ""): string[] {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    return Object.entries(obj).flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

const images = z.array(ImageRef).parse(imagesFile ?? []);
const imageIds = new Set(images.map((i) => i.id));

describe("visas", () => {
  const slugs = Object.keys(visaFiles);
  it("has visas", () => expect(slugs.length).toBeGreaterThan(0));
  for (const slug of slugs) {
    const entry = visaFiles[slug]!;
    describe(slug, () => {
      const facts = VisaFacts.parse(entry.meta);
      it("slug matches folder", () => expect(facts.slug).toBe(slug));
      it("hero image exists in images.json", () => expect(imageIds).toContain(facts.heroImage));
      it("related visas exist", () =>
        facts.relatedVisas.forEach((r) => expect(slugs).toContain(r)));
      for (const locale of LOCALES) {
        it(`has valid ${locale} text`, () => {
          expect(entry.text[locale], `missing ${slug}/${locale}.json`).toBeDefined();
          const text = VisaText.parse(entry.text[locale]);
          if (locale === "en") {
            expect(text.reviewStatus).toBe("source");
            expect(text.translatedFrom).toBe(facts.lastVerified);
          }
        });
      }
      it("steps and lists line up across locales", () => {
        const en = VisaText.parse(entry.text.en);
        for (const locale of LOCALES) {
          const t = VisaText.parse(entry.text[locale]);
          expect(t.howToApply.length, `${slug}/${locale} howToApply`).toBe(en.howToApply.length);
          expect(t.documents.length, `${slug}/${locale} documents`).toBe(en.documents.length);
          expect(t.faqs.length, `${slug}/${locale} faqs`).toBe(en.faqs.length);
        }
      });
    });
  }
});

for (const [kind, files] of [
  ["guides", guideFiles],
  ["pages", pageFiles],
] as const) {
  describe(kind, () => {
    for (const [slug, entry] of Object.entries(files)) {
      const meta = ArticleMeta.parse(entry.meta);
      it(`${slug}: slug matches folder`, () => expect(meta.slug).toBe(slug));
      if (meta.heroImage)
        it(`${slug}: hero image exists`, () => expect(imageIds).toContain(meta.heroImage));
      for (const locale of LOCALES) {
        it(`${slug}: has valid ${locale} text`, () => {
          expect(entry.text[locale], `missing ${kind}/${slug}/${locale}.json`).toBeDefined();
          const t = ArticleText.parse(entry.text[locale]);
          const en = ArticleText.parse(entry.text.en);
          expect(t.sections.length).toBe(en.sections.length);
        });
      }
    }
  });
}

describe("countries", () => {
  it("parses", () => {
    const c = CountriesFile.parse(countriesFile);
    const codes = c.countries.map((x) => x.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe("messages", () => {
  const enKeys = keyPaths(messageFiles.en).sort();
  it("has English messages", () => expect(enKeys.length).toBeGreaterThan(0));
  for (const locale of LOCALES) {
    it(`${locale} has exactly the English keys`, () => {
      expect(messageFiles[locale], `missing messages/${locale}.json`).toBeDefined();
      expect(keyPaths(messageFiles[locale]).sort()).toEqual(enKeys);
    });
  }
});

describe("images", () => {
  it("ids are unique", () => expect(imageIds.size).toBe(images.length));
});

describe("todo docs", () => {
  it("docs/CONTENT-TODO.md and docs/TRANSLATION-TODO.md are up to date (run pnpm --filter @tve/content todo)", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    // @ts-expect-error — plain JS module
    const { buildDocs } = await import("../scripts/todo-docs.mjs");
    const d = buildDocs();
    const docs = join(__dirname, "../../../docs");
    expect(readFileSync(join(docs, "CONTENT-TODO.md"), "utf8")).toBe(d.content);
    expect(readFileSync(join(docs, "TRANSLATION-TODO.md"), "utf8")).toBe(d.translation);
  });
});
