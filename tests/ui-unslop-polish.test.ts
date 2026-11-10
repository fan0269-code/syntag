import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = [
  "src/app/globals.css",
  "src/app/styles/shell.css",
  "src/app/styles/search.css",
  "src/app/styles/graph.css",
  "src/app/styles/content.css",
].map((file) => readFileSync(file, "utf8")).join("\n");

test("paper surfaces replace glass washes, blur, and glowing chrome", () => {
  assert.doesNotMatch(css, /radial-gradient\(circle at 76%/);
  assert.doesNotMatch(css, /backdrop-filter/);
  assert.doesNotMatch(css, /home-graph-shell::before/);
  assert.match(css, /--radius-card:\s*16px/);
  assert.match(css, /--radius-tag:\s*6px/);
  assert.match(css, /\.site-header \{[\s\S]*?background:\s*var\(--bg-page\)/);
  assert.match(css, /\.site-header__logo::after \{[\s\S]*?height:\s*6px/);
  assert.doesNotMatch(css, /box-shadow:\s*0 0 0 7px/);
  assert.doesNotMatch(css, /translateY\(-4px\)|translateX\(3px\)/);
});

test("header browse menu keeps entity indexes without a pricing CTA", () => {
  const header = readFileSync("src/components/layout/Header.tsx", "utf8");
  const footer = readFileSync("src/components/layout/Footer.tsx", "utf8");

  assert.match(header, /site-header__browse/);
  assert.match(header, /ENTITY_INDEXES/);
  assert.match(header, /site-header__search-link/);
  assert.doesNotMatch(header, /header-action/);
  assert.doesNotMatch(header, /\/pricing/);
  assert.match(footer, /STATIC_INTERNAL_LINKS/);
});

test("graph drawing is a paper SVG stage with a canvas hit target", () => {
  const canvas = readFileSync("src/components/graph/GraphCanvas.tsx", "utf8");

  assert.match(canvas, /className="graph-canvas__drawing"/);
  assert.match(canvas, /<svg className="graph-canvas__drawing"/);
  assert.match(css, /\.graph-canvas__drawing/);
  assert.match(css, /\.graph-canvas__stage \{[\s\S]*?background:\s*var\(--bg-surface\)/);
});

test("empty and unavailable states share a left-aligned reading column", () => {
  const unavailable = readFileSync("src/components/common/DataUnavailableState.tsx", "utf8");
  const notFound = readFileSync("src/app/not-found.tsx", "utf8");
  const errorPage = readFileSync("src/app/error.tsx", "utf8");
  const home = readFileSync("src/app/page.tsx", "utf8");

  assert.match(unavailable, /route-notice/);
  assert.match(notFound, /route-notice/);
  assert.match(errorPage, /route-notice/);
  assert.match(home, /SiteReadingGuide mode=\{state\.kind\}/);
  assert.doesNotMatch(home, /home-hero__meta/);
  assert.match(css, /\.route-notice[\s\S]*?text-align:\s*left/);
});
