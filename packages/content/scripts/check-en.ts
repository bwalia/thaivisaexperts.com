// Quick validator for authors: parses facts/meta + en.json for every visa, guide and page,
// plus countries.json and images.json. Run: pnpm --filter @tve/content check
import { z } from "zod";
import { ArticleMeta, ArticleText, CountriesFile, ImageRef, VisaFacts, VisaText } from "../src/schema";
import { countriesFile, guideFiles, imagesFile, pageFiles, visaFiles } from "../src/generated/registry";

let errors = 0;
function check(label: string, schema: z.ZodType, data: unknown) {
  if (data === undefined) {
    console.error(`✗ ${label}: file missing`);
    errors++;
    return;
  }
  const r = schema.safeParse(data);
  if (r.success) console.log(`✓ ${label}`);
  else {
    errors++;
    console.error(`✗ ${label}\n${z.prettifyError(r.error)}`);
  }
}
for (const [slug, e] of Object.entries(visaFiles)) {
  check(`visas/${slug}/facts.json`, VisaFacts, e.meta);
  check(`visas/${slug}/en.json`, VisaText, e.text.en);
}
for (const [kind, files] of [["guides", guideFiles], ["pages", pageFiles]] as const)
  for (const [slug, e] of Object.entries(files)) {
    check(`${kind}/${slug}/meta.json`, ArticleMeta, e.meta);
    check(`${kind}/${slug}/en.json`, ArticleText, e.text.en);
  }
if (countriesFile) check("countries.json", CountriesFile, countriesFile);
check("images.json", z.array(ImageRef), imagesFile);
if (errors) {
  console.error(`\n${errors} problem(s)`);
  process.exit(1);
}
