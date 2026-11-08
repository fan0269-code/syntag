import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("advertising stays off and public ownership signals are absent", () => {
  const layout = read("src/app/layout.tsx");
  const privacy = read("src/app/privacy/page.tsx");
  const adSlot = read("src/components/common/AdSlot.tsx");
  const clientAdSlot = read("src/components/common/ClientAdSlot.tsx");
  const contentBlocks = read("src/components/content/ContentBlocks.tsx");

  assert.equal(existsSync("public/ads.txt"), false);
  assert.doesNotMatch(layout, /google-adsense-account|ca-pub-|pub-/);
  assert.doesNotMatch(privacy, /ca-pub-|pub-\d/);
  assert.match(privacy, /has not enabled advertising technology, email services, or tracking cookies/);
  assert.match(privacy, /does not publish an ads\.txt publisher authorization/);
  assert.match(privacy, /does not publish a google-adsense-account metadata tag/);
  assert.match(adSlot, /enabled = false/);
  assert.match(adSlot, /if \(!enabled\) return null;/);
  assert.match(clientAdSlot, /enabled = false/);
  assert.match(contentBlocks, /<ClientAdSlot placement=\{placement\} \/>/);
  assert.doesNotMatch([layout, privacy, adSlot, clientAdSlot, contentBlocks].join("\n"), /adsbygoogle|googlesyndication/);
});

test("home, indexes, and the product README describe the ads-off publication boundary", () => {
  const home = read("src/app/page.tsx");
  const guide = read("src/components/content/SiteReadingGuide.tsx");
  const index = read("src/components/content/EntityIndexPage.tsx");
  const readme = read("README.md");
  const header = read("src/components/layout/Header.tsx");

  assert.match(home, /The knowledge graph is not published yet/);
  assert.match(home, /Data temporarily unavailable/);
  assert.match(home, /<SiteReadingGuide mode=\{state\.kind\} \/>/);
  assert.match(guide, /not published scholarship/);
  assert.match(guide, /education and sociology/);
  assert.match(guide, /Advertising is off/);
  assert.match(index, /No published \{title\.toLowerCase\(\)\} yet\./);
  assert.match(index, /not published scholarship/);
  assert.match(header, /\["About", "\/about"\]/);
  assert.match(readme, /AGENTS\.md/);
  assert.match(readme, /Advertising is off/);
  assert.doesNotMatch(readme, /create-next-app|Deploy on Vercel/);
  assert.doesNotMatch(home, /[一-鿿]/u);
  assert.doesNotMatch([home, guide, index, readme].join("\n"), /adsbygoogle|ca-pub-/);
});
