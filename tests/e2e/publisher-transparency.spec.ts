import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("publisher identity, editorial method, and correction limitations are publicly discoverable", async ({ page }) => {
  await page.goto("/about", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "About Syrtag" })).toBeVisible();
  await expect(page.getByText("Syrtag is an independent research-navigation project.", { exact: true })).toBeVisible();
  const correctionsLink = page.getByRole("contentinfo").getByRole("link", { name: "Contact and Corrections" });
  await expect(correctionsLink).toBeVisible();
  await correctionsLink.click();

  await expect(page).toHaveURL(/\/corrections$/);
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", "https://syrtag.com/corrections");
  await expect(page.getByRole("heading", { level: 1, name: "Contact and corrections" })).toBeVisible();
  await expect(page.getByText("Syrtag does not currently operate a public correction-intake channel. Do not submit personal or sensitive information. A correction route will be published only after a monitored channel and data-handling process are established.", { exact: true })).toBeVisible();
  await expect(page.getByText("No response or resolution timeframe is currently promised.", { exact: true })).toBeVisible();
  await expect(page.locator("form, a[href^='mailto:']")).toHaveCount(0);

  const results = await new AxeBuilder({ page }).analyze();
  const seriousOrCritical = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(seriousOrCritical).toEqual([]);
});
