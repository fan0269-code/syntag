import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("home uses the shared frame and exposes two English task entrances", () => {
  const home = readFileSync("src/app/page.tsx", "utf8");
  const frame = readFileSync("src/components/common/PageFrame.tsx", "utf8");

  assert.match(home, /PageFrame/);
  assert.doesNotMatch(home, /components\/layout\/Header/);
  assert.match(home, /href="\/topics"/);
  assert.match(home, /Start with a research question/);
  assert.match(home, /href="#graph"/);
  assert.match(home, /Explore the theory graph/);
  assert.doesNotMatch(home, /[一-鿿]/u);
  assert.match(frame, /id="main-content"/);
});

test("shared navigation and footer expose English accessible landmarks", () => {
  const header = readFileSync("src/components/layout/Header.tsx", "utf8");
  const footer = readFileSync("src/components/layout/Footer.tsx", "utf8");
  const links = readFileSync("src/lib/static-internal-links.ts", "utf8");
  const styles = readFileSync("src/app/globals.css", "utf8");

  for (const label of ["Topics", "Theories", "Scholars", "Works", "Concepts", "Pricing"]) {
    assert.match(header, new RegExp(`"${label}"`));
  }
  assert.match(header, /aria-label="Syrtag home"/);
  assert.match(header, /aria-label="Primary navigation"/);
  assert.match(header, /aria-controls="mobile-primary-navigation"/);
  assert.match(header, /aria-label="Mobile primary navigation"/);
  assert.match(header, /Skip to main content/);
  assert.match(header, /Search Syrtag/);
  assert.match(links, /label: "About", href: "\/about"/);
  assert.match(footer, /aria-label="Explore Syrtag"/);
  assert.match(footer, /aria-label="Legal information"/);
  assert.match(styles, /\.skip-link:focus-visible/);
});
