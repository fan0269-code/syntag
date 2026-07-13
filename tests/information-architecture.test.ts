import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import {
  ENTITY_INDEXES,
  canonicalEntityIndexHref,
  entityDetailHref,
  entityIndexHref,
  INDEX_LIMIT,
} from "../src/lib/entity-routes.ts";

test("canonical entity routes use real index and detail paths", () => {
  assert.equal(entityIndexHref("theory"), "/theories");
  assert.equal(entityDetailHref("scholar", "glen-elder"), "/scholars/glen-elder");
  assert.deepEqual(ENTITY_INDEXES.map(({ href }) => href), [
    "/disciplines",
    "/fields",
    "/theories",
    "/scholars",
    "/works",
    "/topics",
    "/concepts",
  ]);
});

test("every published entity type has a bounded public index route", () => {
  assert.equal(INDEX_LIMIT, 50);
  for (const { href } of ENTITY_INDEXES) {
    assert.equal(existsSync(`src/app${href}/page.tsx`), true, href);
  }
});

test("public navigation and recovery paths avoid search shortcuts and planned features", () => {
  const header = readFileSync("src/components/layout/Header.tsx", "utf8");
  const footer = readFileSync("src/components/layout/Footer.tsx", "utf8");
  const notFound = readFileSync("src/app/not-found.tsx", "utf8");

  assert.doesNotMatch(header, /framework-builder|\/search\?q=/);
  assert.doesNotMatch(footer, /framework-builder/);
  assert.match(notFound, /\/theories/);
  assert.match(notFound, /\/disciplines/);
});

test("legacy entity search breadcrumbs resolve to canonical index routes", () => {
  assert.equal(canonicalEntityIndexHref("/search?q=scholar"), "/scholars");
  assert.equal(canonicalEntityIndexHref("/search?q=research"), "/topics");
});
