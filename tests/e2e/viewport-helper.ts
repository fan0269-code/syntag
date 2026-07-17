import { expect, type Page } from "@playwright/test";

export type ViewportCase = {
  readonly name: string;
  readonly width: number;
  readonly height: number;
};

export const viewportCases = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "small-desktop-1024", width: 1024, height: 900 },
  { name: "desktop-1440", width: 1440, height: 1000 },
] as const satisfies readonly ViewportCase[];

export async function useViewport(page: Page, viewport: ViewportCase) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
}

export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => {
    const documentWidth = document.documentElement.scrollWidth;
    const viewportWidth = document.documentElement.clientWidth;

    return Math.max(0, documentWidth - viewportWidth);
  });

  expect(overflow).toBeLessThanOrEqual(1);
}
