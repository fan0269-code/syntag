import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { watchBrowserHealth } from "./browser-health";
import { expectNoHorizontalScroll, useViewport } from "./viewport-helper";

const mobile375 = { name: "mobile-375", width: 375, height: 812 } as const;

const draftScholarCases = [
  { slug: "ivor-f-goodson", name: "Ivor F. Goodson", query: "Ivor Goodson" },
  { slug: "christopher-day", name: "Christopher Day", query: "Christopher Day" },
] as const;

const existingDraftTopicSlugs = [
  "teacher-professional-learning-and-change",
  "education-policy-implementation-frontline-discretion",
  "access-to-educational-support-and-opportunity",
  "communities-of-practice-in-teacher-learning",
] as const;

async function expectNoSeriousOrCriticalA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const seriousOrCritical = results.violations
    .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
    .map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      targets: violation.nodes.flatMap((node) => node.target).slice(0, 5),
    }));

  expect(seriousOrCritical).toEqual([]);
}

for (const scholar of draftScholarCases) {
  test(`draft scholar ${scholar.slug} is isolated from every public surface`, async ({ page, request, baseURL }) => {
    const assertBrowserHealth = watchBrowserHealth(page, baseURL);

    await page.goto("/scholars", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1, name: "Scholars" })).toBeVisible();
    await expect(page.locator(`a[href="/scholars/${scholar.slug}"]`)).toHaveCount(0);
    await expect(page.getByText(scholar.name, { exact: true })).toHaveCount(0);
    await page.waitForLoadState("networkidle");

    await page.goto(`/search?q=${encodeURIComponent(scholar.query)}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1, name: /Results for/i })).toContainText(scholar.query);
    await expect(page.getByRole("heading", { level: 1, name: "Search is temporarily unavailable" })).toHaveCount(0);
    await expect(page.locator(`a[href="/scholars/${scholar.slug}"]`)).toHaveCount(0);
    await expect(page.getByText(scholar.name, { exact: true })).toHaveCount(0);
    await page.waitForLoadState("networkidle");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    await expect(await sitemap.text()).not.toContain(`/scholars/${scholar.slug}`);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("region", { name: /Research theory knowledge graph/i })).toBeVisible();
    await page.waitForLoadState("networkidle");
    const scholarsMode = page.locator(".graph-workspace .graph-modes").getByRole("button", { name: "Scholars" });
    await Promise.all([
      page.waitForResponse((response) => response.url().includes("/api/graph") && response.url().includes("mode=scholars") && response.status() === 200),
      scholarsMode.click(),
    ]);
    await expect(scholarsMode).toHaveAttribute("aria-pressed", "true");
    const accessibleNodeList = page.getByRole("group", { name: /Available graph nodes/i });
    await expect(accessibleNodeList).toBeVisible();
    await expect(accessibleNodeList.getByRole("button").first()).toBeVisible();
    await expect(accessibleNodeList.getByRole("button", { name: scholar.name, exact: true })).toHaveCount(0);
    await page.waitForLoadState("networkidle");
    assertBrowserHealth();

    const detailResponse = await page.goto(`/scholars/${scholar.slug}`, { waitUntil: "domcontentloaded" });
    expect(detailResponse?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: /That entry is not available/i })).toBeVisible();
  });
}

test("published Jean Lave remains visible while Kingdon remains draft", async ({ page, request, baseURL }) => {
  const assertBrowserHealth = watchBrowserHealth(page, baseURL);

  await page.goto("/scholars", { waitUntil: "domcontentloaded" });
  await expect(page.locator('a[href="/scholars/jean-lave"]')).toBeVisible();
  await expect(page.getByText("Jean Lave", { exact: true })).toBeVisible();
  await expect(page.locator('a[href="/scholars/john-w-kingdon"]')).toHaveCount(0);
  await expect(page.getByText(/John W\. Kingdon/i)).toHaveCount(0);
  await page.waitForLoadState("networkidle");

  await page.goto("/search?q=kingdon", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: /Results for “kingdon”/i })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Search is temporarily unavailable" })).toHaveCount(0);
  await expect(page.locator('a[href="/scholars/john-w-kingdon"]')).toHaveCount(0);
  await page.waitForLoadState("networkidle");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  await expect(await sitemap.text()).not.toContain("/scholars/john-w-kingdon");
  assertBrowserHealth();

  const detailResponse = await page.goto("/scholars/john-w-kingdon", { waitUntil: "domcontentloaded" });
  expect(detailResponse?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: /That entry is not available/i })).toBeVisible();
});

test("all four 2026-07-18 topics remain draft", async ({ page, request, baseURL }) => {
  const assertBrowserHealth = watchBrowserHealth(page, baseURL);

  await page.goto("/topics", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Topics" })).toBeVisible();
  for (const slug of existingDraftTopicSlugs) {
    await expect(page.locator(`a[href="/topics/${slug}"]`)).toHaveCount(0);
  }
  await page.waitForLoadState("networkidle");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  for (const slug of existingDraftTopicSlugs) {
    expect(sitemapText).not.toContain(`/topics/${slug}`);
  }
  assertBrowserHealth();

  for (const slug of existingDraftTopicSlugs) {
    const detailResponse = await page.goto(`/topics/${slug}`, { waitUntil: "domcontentloaded" });
    expect(detailResponse?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: /That entry is not available/i })).toBeVisible();
  }
});

test("scholars index has no serious a11y or 375px overflow failures", async ({ page, baseURL }) => {
  const assertBrowserHealth = watchBrowserHealth(page, baseURL);
  await useViewport(page, mobile375);

  await page.goto("/scholars", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "Scholars" })).toBeVisible();
  await page.waitForLoadState("networkidle");
  await expectNoSeriousOrCriticalA11yViolations(page);
  await expectNoHorizontalScroll(page);
  assertBrowserHealth();
});
