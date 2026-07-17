import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appRoutesUrl = new URL("../.next/app-path-routes-manifest.json", import.meta.url);
const prerenderManifestUrl = new URL("../.next/prerender-manifest.json", import.meta.url);
const robotsUrl = new URL("../.next/server/app/robots.txt.body", import.meta.url);
const sitemapUrl = new URL("../.next/server/app/sitemap.xml.body", import.meta.url);

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
  assert.ok(prerenderManifest.routes["/theories/life-course-theory"]);
  assert.ok(prerenderManifest.routes["/sitemap.xml"]);
  assert.ok(prerenderManifest.routes["/robots.txt"]);
  const entityDetailRouteCount = Object.keys(prerenderManifest.routes)
    .filter((route) => /^\/(concepts|disciplines|fields|scholars|theories|topics|works)\/.+/.test(route))
    .length;
  assert.equal(sitemap.match(/<loc>/g)?.length, 13 + entityDetailRouteCount);
  assert.match(sitemap, /<loc>https:\/\/syrtag\.com\/pricing<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/syrtag\.com\/theories\/life-course-theory<\/loc>/);
  assert.match(robots, /Disallow: \/api\//);
  assert.match(robots, /Sitemap: https:\/\/syrtag\.com\/sitemap\.xml/);
});
