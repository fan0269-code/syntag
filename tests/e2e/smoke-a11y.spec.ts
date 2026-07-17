import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { expectNoHorizontalScroll, useViewport, viewportCases } from "./viewport-helper";

type RouteCase = {
  readonly name: string;
  readonly path: string;
  readonly h1: RegExp;
  readonly dataDependent?: boolean;
  readonly primaryAction?: {
    readonly role: "button" | "link";
    readonly name: RegExp;
  };
  readonly assertPage?: (page: Page) => Promise<void>;
};

const unavailableHeading = /Data temporarily unavailable|The knowledge graph is not published yet|Search is temporarily unavailable|The graph is temporarily unavailable|No published .+ graph yet/i;
const routeCases: readonly RouteCase[] = [
  {
    name: "home",
    path: "/",
    h1: /Make a defensible theory choice|Data temporarily unavailable|The knowledge graph is not published yet/i,
    dataDependent: true,
    primaryAction: { role: "link", name: /Start with a research question/i },
  },
  {
    name: "search",
    path: "/search?q=teacher%20identity",
    h1: /Results for “teacher identity”|Search is temporarily unavailable/i,
    dataDependent: true,
    primaryAction: { role: "button", name: /^Search$/i },
    assertPage: async (page) => {
      const searchInput = page.getByLabel(/Search published Syrtag content/i);

      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveValue("teacher identity");
    },
  },
  {
    name: "pricing",
    path: "/pricing",
    h1: /^Pricing$/i,
    primaryAction: { role: "link", name: /Search Syrtag|搜索图谱/i },
  },
  {
    name: "theories index",
    path: "/theories",
    h1: /Theories|Data temporarily unavailable/i,
    dataDependent: true,
    primaryAction: { role: "link", name: /Browse theories|Syrtag(?: home)?/i },
  },
];

async function expectSharedLandmarks(page: Page) {
  await expect(page.locator("header a[href='/']").first()).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("navigation").first()).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
}

async function expectNoDemoData(page: Page) {
  await expect(page.getByText(/Demo graph: local development sample data only/i)).toHaveCount(0);
}

async function hasUnavailableState(page: Page) {
  const status = page.getByRole("status").filter({ hasText: unavailableHeading });
  const heading = page.getByRole("heading", { level: 1, name: unavailableHeading });

  if ((await status.count()) > 0) {
    await expect(status.first()).toBeVisible();
    return true;
  }

  if ((await heading.count()) > 0) {
    await expect(heading.first()).toBeVisible();
    return true;
  }

  return false;
}

async function expectUnavailableState(page: Page) {
  await expect(page.getByRole("heading", { name: unavailableHeading }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Return to the knowledge graph|Browse research topics|Browse theories/i }).first()).toBeVisible();
}

async function expectPrimaryAction(page: Page, route: RouteCase, unavailable: boolean) {
  if (unavailable) {
    await expectUnavailableState(page);
    return;
  }

  if (!route.primaryAction) return;

  await expect(page.getByRole(route.primaryAction.role, { name: route.primaryAction.name }).first()).toBeVisible();
}

async function expectNoSeriousA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const seriousOrCritical = results.violations
    .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
    .map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      targets: violation.nodes.flatMap((node) => node.target).slice(0, 5),
    }));

  expect(seriousOrCritical).toEqual([]);
}

async function gotoHomeOrUnavailable(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectNoDemoData(page);

  if (await hasUnavailableState(page)) {
    await expectUnavailableState(page);
    return "unavailable" as const;
  }

  await expect(page.getByRole("heading", { level: 1, name: /Make a defensible theory choice/i })).toBeVisible();
  return "ready" as const;
}

for (const viewport of viewportCases) {
  test.describe(`viewport ${viewport.name} ${viewport.width}x${viewport.height}`, () => {
    for (const route of routeCases) {
      test(`${route.name} smoke and serious/critical a11y`, async ({ page }) => {
        await useViewport(page, viewport);
        await page.goto(route.path, { waitUntil: "domcontentloaded" });

        await expectSharedLandmarks(page);
        await expectNoDemoData(page);
        await expect(page.getByRole("heading", { level: 1, name: route.h1 })).toBeVisible();

        const unavailable = route.dataDependent ? await hasUnavailableState(page) : false;

        await expectPrimaryAction(page, route, unavailable);
        await route.assertPage?.(page);
        await expectNoHorizontalScroll(page);
        await expectNoSeriousA11yViolations(page);
      });
    }
  });
}

test("life course detail keeps TOC and layout stable at the 769px boundary", async ({ page }) => {
  await page.setViewportSize({ width: 769, height: 900 });
  await page.goto("/theories/life-course-theory", { waitUntil: "domcontentloaded" });

  if (await hasUnavailableState(page)) {
    await expectUnavailableState(page);
    await expectNoHorizontalScroll(page);
    return;
  }

  await expect(page.getByRole("heading", { level: 1, name: /Life Course Theory/i })).toBeVisible();
  await expect(page.getByRole("navigation", { name: /On this page/i })).toBeVisible();
  await expectNoHorizontalScroll(page);
});

test("home inline search submits to the search route", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });

  if ((await gotoHomeOrUnavailable(page)) === "unavailable") return;

  await page.getByLabel(/Search for a theory, scholar, concept, or research topic/i).fill("teacher identity");
  await Promise.all([
    page.waitForURL(/\/search\?q=teacher\+identity|\/search\?q=teacher%20identity/),
    page.getByRole("button", { name: /^Search$/i }).click(),
  ]);
  await expect(page.getByRole("heading", { level: 1, name: /Results for “teacher identity”/i })).toBeVisible();
});

test("home graph mode controls and node detail workflow are keyboard recoverable", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });

  if ((await gotoHomeOrUnavailable(page)) === "unavailable") return;

  await expect(page.getByRole("region", { name: /Research theory knowledge graph/i })).toBeVisible();
  const modeControls = page.locator(".graph-workspace .graph-modes");
  const genealogy = modeControls.getByRole("button", { name: "Genealogy" });
  const scholars = modeControls.getByRole("button", { name: "Scholars" });
  const topics = modeControls.getByRole("button", { name: "Topics" });

  await expect(genealogy).toHaveAttribute("aria-pressed", "true");
  await expect(scholars).toHaveAttribute("aria-pressed", "false");
  await expect(topics).toHaveAttribute("aria-pressed", "false");

  await topics.click();
  await expect(topics).toHaveAttribute("aria-pressed", "true");
  await scholars.click();
  await expect(scholars).toHaveAttribute("aria-pressed", "true");
  await genealogy.click();
  await expect(genealogy).toHaveAttribute("aria-pressed", "true");

  const canvas = page.getByRole("img", { name: /Interactive research theory graph/i });
  const firstNode = page.getByRole("group", { name: /Available graph nodes/i }).getByRole("button").first();

  await expect(canvas).toBeVisible();
  await expect(firstNode).toBeVisible();
  await firstNode.click();
  await expect(firstNode).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("complementary", { name: /Selected node details:/i })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("complementary", { name: /Selected node details/i })).toBeHidden();
  await expect(canvas).toBeFocused();
});

async function getGraphDrawCount(page: Page) {
  return page.evaluate(() => (
    window as Window & { __syrtagGraphDrawCount?: number }
  ).__syrtagGraphDrawCount ?? 0);
}

test("reduced motion prevents sustained graph canvas RAF while preserving node details", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const win = window as Window & {
      __syrtagGraphClearRectPatched?: boolean;
      __syrtagGraphDrawCount?: number;
    };

    if (win.__syrtagGraphClearRectPatched) return;

    const originalClearRect = CanvasRenderingContext2D.prototype.clearRect;

    win.__syrtagGraphDrawCount = 0;
    win.__syrtagGraphClearRectPatched = true;
    CanvasRenderingContext2D.prototype.clearRect = function clearRect(
      this: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
    ) {
      if (this.canvas.getAttribute("aria-label") === "Interactive research theory graph") {
        win.__syrtagGraphDrawCount = (win.__syrtagGraphDrawCount ?? 0) + 1;
      }

      return originalClearRect.call(this, x, y, w, h);
    };
  });

  if ((await gotoHomeOrUnavailable(page)) === "unavailable") {
    await expectNoHorizontalScroll(page);
    return;
  }

  const canvas = page.getByRole("img", { name: /Interactive research theory graph/i });
  const firstNode = page.getByRole("group", { name: /Available graph nodes/i }).getByRole("button").first();

  await expect(canvas).toBeVisible();
  await expect(firstNode).toBeVisible();
  await page.waitForFunction(() => (
    window as Window & { __syrtagGraphDrawCount?: number }
  ).__syrtagGraphDrawCount && (
    window as Window & { __syrtagGraphDrawCount?: number }
  ).__syrtagGraphDrawCount! > 0);

  await firstNode.click();
  await expect(firstNode).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("complementary", { name: /Selected node details:/i })).toBeVisible();
  await page.waitForTimeout(100);

  const stableDrawCount = await getGraphDrawCount(page);

  await page.waitForTimeout(500);
  await expect(page.getByRole("complementary", { name: /Selected node details:/i })).toBeVisible();
  expect(stableDrawCount).toBeGreaterThan(0);
  expect(await getGraphDrawCount(page)).toBe(stableDrawCount);

  const runningAnimations = await page.evaluate(() => {
    const animations = [
      ...document.getAnimations(),
      ...Array.from(document.querySelectorAll("*")).flatMap((element) => element.getAnimations()),
    ];

    return animations
      .filter((animation) => animation.playState === "running")
      .map((animation) => animation.effect?.constructor.name ?? "unknown");
  });

  expect(runningAnimations).toEqual([]);
});
