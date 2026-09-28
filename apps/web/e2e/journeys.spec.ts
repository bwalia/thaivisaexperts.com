import { expect, test, type Page } from "@playwright/test";

const LOCALES = ["en", "fr", "nl", "th"] as const;

async function completeFinder(page: Page) {
  await page.selectOption("#nationality", "GB");
  await page.locator('button[type="submit"]').click();
  await page.check('input[name="purpose"][value="remote-work"]');
  await page.locator('button[type="submit"]').click();
  await page.check('input[name="stay"][value="up-to-180"]');
  await page.locator('button[type="submit"]').click();
  await page.check('input[name="remote"][value="yes"]');
  await page.locator('button[type="submit"]').click();
  await page.check('input[name="funds"][value="500k-800k"]');
  await page.locator('button[type="submit"]').click();
}

test("Visa Finder → DTV page → checklist → compare DTV vs TR", async ({ page }) => {
  await page.goto("/en/visa-finder/");
  await expect(page.getByText("Step 1 of 5")).toBeVisible();

  // Validation: can't continue without an answer.
  await page.locator('button[type="submit"]').click();
  await expect(page.locator("#finder-error")).toBeVisible();

  await completeFinder(page);
  const results = page.locator("#results-title");
  await expect(results).toBeVisible();
  await expect(page).toHaveURL(/purpose=remote-work/);

  const best = page.locator("#finder-results > li").first();
  await expect(best).toContainText("DTV");
  await expect(best).toContainText("Best match");
  await best.getByRole("link").click();

  await expect(page).toHaveURL(/\/en\/visas\/dtv\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Destination Thailand Visa");
  await expect(page.getByText(/Last verified/).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Official sources" })).toBeVisible();

  // Tick two checklist items; progress persists across reloads.
  const boxes = page.locator('section[aria-labelledby="docs"] input[type="checkbox"]');
  const total = await boxes.count();
  await boxes.nth(0).check();
  await boxes.nth(1).check();
  await expect(page.getByText(`2 of ${total} ready`)).toBeVisible();
  await page.reload();
  await expect(page.getByText(`2 of ${total} ready`)).toBeVisible();
  await expect(boxes.nth(1)).toBeChecked();

  // Compare DTV vs Tourist visa.
  await page.goto("/en/compare/?v=dtv,tourist-tr");
  await expect(page.locator("#cmp-0")).toHaveValue("dtv");
  await expect(page.locator("#cmp-1")).toHaveValue("tourist-tr");
  const view = page.locator("table:visible, ul.md\\:hidden:visible").first();
  await expect(view).toContainText("DTV");
  await expect(view).toContainText("10,000 THB");
});

for (const locale of LOCALES) {
  test(`Visa Finder recommends DTV for a remote worker (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/visa-finder/`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await completeFinder(page);
    await expect(page.locator("#results-title")).toBeVisible();
    await expect(page.locator("#finder-results > li").first().getByRole("link")).toHaveAttribute(
      "href",
      `/${locale}/visas/dtv/`,
    );
  });
}

test("shared results link opens straight to results", async ({ page }) => {
  await page.goto(
    "/en/visa-finder/?nationality=GB&purpose=holiday&stay=up-to-30&remote=no&funds=100k-500k",
  );
  await expect(page.locator("#results-title")).toBeVisible();
  await expect(page.locator("#finder-results > li").first()).toContainText("Visa exemption");
});

test("language switcher keeps the page and the wizard answers", async ({ page, isMobile }) => {
  const qs = "nationality=FR&purpose=muay-thai&stay=up-to-180&remote=no&funds=500k-800k";
  await page.goto(`/en/visa-finder/?${qs}`);
  await expect(page.locator("#results-title")).toBeVisible();
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.selectOption("#lang-switcher-mobile", "fr");
  } else {
    await page.selectOption("#lang-switcher", "fr");
  }
  await expect(page).toHaveURL(new RegExp(`/fr/visa-finder/?\\?${qs.replace(/[?&]/g, "\\$&")}`));
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator("#results-title")).toHaveText("Vos options de visa");
});

test("root picks the browser language", async ({ browser }) => {
  const ctx = await browser.newContext({ locale: "nl-NL" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/nl\/$/);
  await ctx.close();
});

test("every page has the independence disclaimer and a single h1", async ({ page }) => {
  for (const path of ["/en/", "/th/visas/non-o-family/", "/fr/guides/tdac/", "/nl/privacy/"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("footer")).toContainText(/thaivisaexperts\.com/);
  }
});

test("stay calculator counts the arrival day as day 1", async ({ page }) => {
  await page.goto("/en/stay-calculator/?visa=visa-exemption&arrival=2026-10-01");
  await expect(page.getByText("Last day without extension")).toBeVisible();
  await expect(page.locator("#stay-result").locator("..")).toContainText("30 October 2026");
  await expect(page.locator("#stay-result").locator("..")).toContainText("29 November 2026");
});
