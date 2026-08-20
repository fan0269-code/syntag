import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { watchBrowserHealth } from "./browser-health";
import { expectNoHorizontalScroll, useViewport } from "./viewport-helper";

const mobile375 = { name: "mobile-375", width: 375, height: 812 } as const;

const topicCases = [
  {
    slug: "teacher-professional-learning-and-change",
    question: "How do teachers' professional learning experiences lead to changes in practice?",
    searchPhrase: "professional learning experiences",
  },
  {
    slug: "education-policy-implementation-frontline-discretion",
    question: "How do frontline educators and administrators exercise discretion when implementing education policy?",
    searchPhrase: "frontline educators and administrators",
  },
  {
    slug: "access-to-educational-support-and-opportunity",
    question: "How do students gain or lose access to educational support and opportunity?",
    searchPhrase: "gain or lose access",
  },
  {
    slug: "communities-of-practice-in-teacher-learning",
    question: "When is Communities of Practice a good fit for studying teacher learning?",
    searchPhrase: "studying teacher learning",
  },
] as const;

const archivedScholarCases = [
  { slug: "jean-lave", name: "Jean Lave" },
  { slug: "etienne-wenger", name: "Etienne Wenger" },
  { slug: "michael-lipsky", name: "Michael Lipsky" },
] as const;

const searchCases: ReadonlyArray<{
  query: string;
  slug: string;
}> = [
  {
    query: "Jean Lave",
    slug: "jean-lave",
  },
  {
    query: "Etienne Wenger",
    slug: "etienne-wenger",
  },
  {
    query: "frontline discretion",
    slug: "michael-lipsky",
  },
];

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

async function expectNoDraftKingdon(page: Page) {
  await expect(page.getByText(/John W\. Kingdon/i)).toHaveCount(0);
  await expect(page.locator("a[href*='john-w-kingdon']")).toHaveCount(0);
}

for (const topic of topicCases) {
  test(`draft topic ${topic.slug} is isolated from every public surface`, async ({ page, request, baseURL }) => {
    const assertBrowserHealth = watchBrowserHealth(page, baseURL);

    await page.goto("/topics", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1, name: "Topics" })).toBeVisible();
    await expect(page.locator(`a[href="/topics/${topic.slug}"]`)).toHaveCount(0);
    await expect(page.getByText(topic.question, { exact: true })).toHaveCount(0);
    await page.waitForLoadState("networkidle");

    await page.goto(`/search?q=${encodeURIComponent(topic.searchPhrase)}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1, name: /Results for/i })).toContainText(topic.searchPhrase);
    await expect(page.getByRole("heading", { level: 1, name: "Search is temporarily unavailable" })).toHaveCount(0);
    await expect(page.locator(`a[href="/topics/${topic.slug}"]`)).toHaveCount(0);
    await expect(page.getByRole("link", { name: topic.question, exact: true })).toHaveCount(0);
    await page.waitForLoadState("networkidle");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    await expect(await sitemap.text()).not.toContain(`/topics/${topic.slug}`);
    assertBrowserHealth();

    const detailResponse = await page.goto(`/topics/${topic.slug}`, { waitUntil: "domcontentloaded" });
    expect(detailResponse?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: /That entry is not available/i })).toBeVisible();
  });
}

test("archived scholar profiles stay outside every public detail route", async ({ page }) => {
  for (const scholar of archivedScholarCases) {
    const response = await page.goto(`/scholars/${scholar.slug}`, { waitUntil: "domcontentloaded" });

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: /That entry is not available/i })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: scholar.name })).toHaveCount(0);
  }
});

test("archived topic keeps relation and pathway wording off the public surface", async ({ page }) => {
  const response = await page.goto("/topics/educational-transitions-over-time", { waitUntil: "domcontentloaded" });

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: /That entry is not available/i })).toBeVisible();
  await expect(page.getByText("Published topic-theory relations", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Pending human review", { exact: true })).toHaveCount(0);
});

test("representative archived scholar returns an accessible 404 at 375px", async ({ page }) => {
  await useViewport(page, mobile375);

  const response = await page.goto("/scholars/jean-lave", { waitUntil: "domcontentloaded" });

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: /That entry is not available/i })).toBeVisible();
  await expectNoSeriousOrCriticalA11yViolations(page);
  await expectNoHorizontalScroll(page);
});

test("draft Kingdon scholar is absent from public index, search, sitemap, and detail route", async ({ page, request, baseURL }) => {
  const assertBrowserHealth = watchBrowserHealth(page, baseURL);

  await page.goto("/scholars", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Scholars" })).toBeVisible();
  await expectNoDraftKingdon(page);
  await page.waitForLoadState("networkidle");

  await page.goto("/search?q=kingdon", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: /Results for “kingdon”/i })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Search is temporarily unavailable" })).toHaveCount(0);
  await expectNoDraftKingdon(page);
  await page.waitForLoadState("networkidle");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  await expect(await sitemap.text()).not.toContain("/scholars/john-w-kingdon");
  assertBrowserHealth();

  const detailResponse = await page.goto("/scholars/john-w-kingdon", { waitUntil: "domcontentloaded" });
  expect(detailResponse?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: /That entry is not available/i })).toBeVisible();
});

for (const searchCase of searchCases) {
  test(`search query "${searchCase.query}" does not expose archived scholar content`, async ({ page, baseURL }) => {
    const assertBrowserHealth = watchBrowserHealth(page, baseURL);

    await page.goto(`/search?q=${encodeURIComponent(searchCase.query)}`, { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: new RegExp(`Results for .${searchCase.query}.`, "i") })).toBeVisible();
    const scholarResult = page.locator(`a[href="/scholars/${searchCase.slug}"]`);
    await expect(scholarResult).toHaveCount(0);
    await expectNoDraftKingdon(page);
    await page.waitForLoadState("networkidle");
    assertBrowserHealth();
  });
}

test("home fails closed when no entity graph is published", async ({ page, baseURL }) => {
  const assertBrowserHealth = watchBrowserHealth(page, baseURL);

  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "The knowledge graph is not published yet" })).toBeVisible();
  await expect(page.getByRole("region", { name: /Research theory knowledge graph/i })).toHaveCount(0);
  for (const topic of topicCases) {
    await expect(page.getByText(topic.question, { exact: true })).toHaveCount(0);
  }
  assertBrowserHealth();
});
