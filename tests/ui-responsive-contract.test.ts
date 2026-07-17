import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const cssFiles = [
  "src/app/globals.css",
  "src/app/styles/shell.css",
  "src/app/styles/search.css",
  "src/app/styles/graph.css",
  "src/app/styles/content.css",
];
const styles = cssFiles.map((file) => readFileSync(file, "utf8")).join("\n");
const layout = readFileSync("src/app/layout.tsx", "utf8");

test("responsive CSS defines the entity card grid across mobile, tablet, and desktop", () => {
  assert.match(styles, /\.entity-card-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(styles, /@media\s*\(min-width:\s*769px\)\s*\{[\s\S]*?\.entity-card-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(styles, /@media\s*\(min-width:\s*1024px\)\s*\{[\s\S]*?\.entity-card-grid\s*\{[\s\S]*?auto-fit/);
});

test("primary search and graph controls use the shared 44px control height", () => {
  assert.match(styles, /\.search-box__inline-form input,[\s\S]*?\.search-box__inline-form button\s*\{[\s\S]*?min-height:\s*var\(--control-height\)/);
  assert.match(styles, /\.graph-tabs select,[\s\S]*?\.graph-modes button\s*\{[\s\S]*?min-height:\s*var\(--control-height\)/);
  assert.match(styles, /\.theory-detail__close\s*\{[\s\S]*?(?:height|min-height):\s*var\(--control-height\)/);
});

test("TOC uses a responsive rail without float or negative margin positioning", () => {
  const tocStyles = styles.match(/\.article-toc\s*\{[\s\S]*?\}/)?.[0] ?? "";

  assert.doesNotMatch(tocStyles, /float\s*:/);
  assert.doesNotMatch(tocStyles, /margin-left\s*:/);
  assert.match(styles, /@media\s*\(min-width:\s*1200px\)\s*\{[\s\S]*?\.article-toc\s*\{[\s\S]*?position:\s*sticky/);
  assert.match(styles, /@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\.article-toc__details\s*\{[\s\S]*?position:\s*sticky/);
});

test("new search, graph, source, static, and reduced-motion contracts are styled", () => {
  for (const selector of [
    ".search-box__inline-form",
    ".search-page__form",
    ".search-page__recovery-links",
    ".graph-canvas__instructions",
    ".graph-canvas__selection-status",
    ".graph-canvas__node-picker",
    ".theory-detail__relationships",
    ".source-block__intro",
    ".source-block__entry",
    ".source-block__meta",
    ".page-level-source-note",
    ".static-page__hero",
    ".static-page__eyebrow",
    ".entity-page__eyebrow",
  ]) {
    assert.ok(styles.includes(selector), `Missing ${selector} CSS`);
  }

  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.graph-canvas__state--loading span,[\s\S]*?\.route-loading span\s*\{[\s\S]*?animation:\s*none/);
});

test("layout imports global styles in their cascade order", () => {
  assert.match(layout, /import "\.\/globals\.css";[\s\S]*?import "\.\/styles\/shell\.css";[\s\S]*?import "\.\/styles\/search\.css";[\s\S]*?import "\.\/styles\/graph\.css";[\s\S]*?import "\.\/styles\/content\.css";/);
});
