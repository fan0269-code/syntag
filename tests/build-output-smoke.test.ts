import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { seedCorpus } from "../src/data/seed-content.ts";
import { FAN_133_U3_ARCHIVED_CONCEPT_SLUGS, FAN_133_U3_ARCHIVED_WORK_SLUGS } from "../src/lib/u3-visibility.ts";

const appRoutesUrl = new URL("../.next/app-path-routes-manifest.json", import.meta.url);
const prerenderManifestUrl = new URL("../.next/prerender-manifest.json", import.meta.url);
const homeUrl = new URL("../.next/server/app/index.html", import.meta.url);
const robotsUrl = new URL("../.next/server/app/robots.txt.body", import.meta.url);
const sitemapUrl = new URL("../.next/server/app/sitemap.xml.body", import.meta.url);
const adsTxtUrl = new URL("../public/ads.txt", import.meta.url);

test("production build contains core public route artifacts", {
  skip: process.env.BUILD_OUTPUT_SMOKE_REQUIRED !== "1" && "runs after next build via npm run build",
}, async () => {
  const appRoutes = JSON.parse(await readFile(appRoutesUrl, "utf8")) as Record<string, string>;
  const prerenderManifest = JSON.parse(await readFile(prerenderManifestUrl, "utf8")) as {
    routes: Record<string, unknown>;
  };
  const robots = await readFile(robotsUrl, "utf8");
  const sitemap = await readFile(sitemapUrl, "utf8");

  assert.equal(appRoutes["/page"], "/");
  assert.equal(appRoutes["/search/page"], "/search");
  assert.equal(appRoutes["/pricing/page"], "/pricing");
  assert.equal(appRoutes["/theories/[slug]/page"], "/theories/[slug]");
  assert.equal(prerenderManifest.routes["/theories/life-course-theory"], undefined);
  assert.ok(prerenderManifest.routes["/sitemap.xml"]);
  assert.ok(prerenderManifest.routes["/robots.txt"]);
  const emptyDiscoveryTypes = ["disciplines", "fields", "topics", "concepts"] as const;
  for (const type of emptyDiscoveryTypes) {
    const routes = Object.keys(prerenderManifest.routes).filter((route) => route.startsWith(`/${type}/`));
    assert.equal(routes.length, 0, `${type} stays out of the prerendered catalog`);
  }
  const catalogTypes = [
    ["theories", seedCorpus.theories],
    ["scholars", seedCorpus.scholars],
    ["works", seedCorpus.works],
  ] as const;
  let entityDetailRouteCount = 0;
  for (const [type, records] of catalogTypes) {
    const allowed = new Set(records.filter((record) => record.status === "published").map((record) => `/${type}/${record.slug}`));
    const routes = Object.keys(prerenderManifest.routes).filter((route) => route.startsWith(`/${type}/`));
    assert.ok(routes.length === 0 || routes.length === allowed.size, `${type} prerender count is empty-shell or the published set`);
    for (const route of routes) assert.equal(allowed.has(route), true, route);
    entityDetailRouteCount += routes.length;
  }
  assert.equal(sitemap.match(/<loc>/g)?.length, 9 + entityDetailRouteCount);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/syrtag\.com\/pricing<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/syrtag\.com\/topics<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/syrtag\.com\/concepts<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/syrtag\.com\/disciplines<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/syrtag\.com\/fields<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/syrtag\.com\/search<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/syrtag\.com\/corrections<\/loc>/);
  const entityCollections: ReadonlyArray<readonly [string, ReadonlyArray<{ slug: string; status: string }>]> = [
    ["disciplines", seedCorpus.disciplines],
    ["fields", seedCorpus.fields],
    ["theories", seedCorpus.theories],
    ["topics", seedCorpus.topics],
    ["scholars", seedCorpus.scholars],
    ["works", seedCorpus.works],
    ["concepts", seedCorpus.concepts],
  ] as const;
  const corpusRecords = entityCollections.flatMap(([, records]) => records);
  const statusCounts = corpusRecords.reduce<Record<string, number>>((counts, record) => {
    counts[record.status] = (counts[record.status] ?? 0) + 1;
    return counts;
  }, {});
  assert.deepEqual(statusCounts, { published: 15, draft: 7, archived: 74 });
  const nonPublicRoutes = entityCollections.flatMap(([type, records]) => records
    .filter((record) => record.status !== "published")
    .map((record) => `/${type}/${record.slug}`));
  for (const route of nonPublicRoutes) {
    assert.equal(prerenderManifest.routes[route], undefined, `non-public route absent from build: ${route}`);
    assert.doesNotMatch(sitemap, new RegExp(`<loc>https://syrtag\\.com${route}</loc>`));
  }
  for (const route of [
    ...FAN_133_U3_ARCHIVED_WORK_SLUGS.map((slug) => `/works/${slug}`),
    ...FAN_133_U3_ARCHIVED_CONCEPT_SLUGS.map((slug) => `/concepts/${slug}`),
  ]) {
    assert.equal(prerenderManifest.routes[route], undefined, `U3 route absent from build: ${route}`);
    assert.doesNotMatch(sitemap, new RegExp(`<loc>https://syrtag\\.com${route}</loc>`));
  }
  assert.match(robots, /Disallow: \/api\//);
  assert.match(robots, /Sitemap: https:\/\/syrtag\.com\/sitemap\.xml/);
});

test("production build does not expose AdSense ownership signals while ads are off", {
  skip: process.env.BUILD_OUTPUT_SMOKE_REQUIRED !== "1" && "runs after next build via npm run build",
}, async () => {
  const home = await readFile(homeUrl, "utf8");

  assert.doesNotMatch(home, /google-adsense-account|ca-pub-|adsbygoogle|googlesyndication/);
  assert.equal(existsSync(adsTxtUrl), false);
});
