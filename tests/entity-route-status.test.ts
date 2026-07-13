import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const detailRoutes = [
  "concepts/[slug]/page.tsx",
  "disciplines/[slug]/page.tsx",
  "fields/[slug]/page.tsx",
  "scholars/[slug]/page.tsx",
  "theories/[slug]/page.tsx",
  "topics/[slug]/page.tsx",
  "works/[slug]/page.tsx",
];

test("entity detail routes reject unknown slugs before streaming", () => {
  for (const route of detailRoutes) {
    const source = readFileSync(resolve("src/app", route), "utf8");
    assert.match(source, /export const dynamicParams = false;/, route);
  }
});
