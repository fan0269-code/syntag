import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

const trustSurfaces = [
  "src/app/about/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/editorial-policy/page.tsx",
  "src/app/corrections/page.tsx",
  "src/app/pricing/page.tsx",
  "src/components/content/SiteReadingGuide.tsx",
  "src/components/layout/Footer.tsx",
  "README.md",
] as const;

test("advertising-off claims agree across trust surfaces and code signals", () => {
  const about = read("src/app/about/page.tsx");
  const privacy = read("src/app/privacy/page.tsx");
  const terms = read("src/app/terms/page.tsx");
  const guide = read("src/components/content/SiteReadingGuide.tsx");
  const footer = read("src/components/layout/Footer.tsx");
  const layout = read("src/app/layout.tsx");
  const pricing = read("src/app/pricing/page.tsx");

  for (const path of [
    "src/app/about/page.tsx",
    "src/app/privacy/page.tsx",
    "src/app/terms/page.tsx",
    "src/components/content/SiteReadingGuide.tsx",
    "src/components/layout/Footer.tsx",
    "src/app/pricing/page.tsx",
  ]) {
    assert.match(
      read(path),
      /Advertising is off|has not enabled advertising|does not currently serve advertisements|Advertising, email, and tracking cookies are not enabled/,
    );
  }

  assert.match(about, /does not load an advertising script/);
  assert.match(about, /does not publish an ads\.txt publisher authorization/);
  assert.match(about, /google-adsense-account metadata tag/);
  assert.match(privacy, /about<\/Link> page repeats the same advertising-off boundary/);
  assert.match(terms, /privacy page<\/Link> and the <Link href="\/about">about page/);
  assert.match(guide, /about and privacy pages state the same advertising boundary/);
  assert.match(footer, /Advertising is off/);
  assert.match(pricing, /Advertising is off/);
  assert.equal(existsSync("public/ads.txt"), false);
  assert.doesNotMatch(layout, /google-adsense-account|ca-pub-/);
});

test("publication-empty claims agree and pricing does not invent a filled catalog", () => {
  const about = read("src/app/about/page.tsx");
  const pricing = read("src/app/pricing/page.tsx");
  const guide = read("src/components/content/SiteReadingGuide.tsx");
  const terms = read("src/app/terms/page.tsx");
  const framework = read("src/app/framework-builder/page.tsx");
  const home = read("src/app/page.tsx");

  assert.match(about, /The entity catalog is empty until records are published/);
  assert.match(about, /Flagship theory, scholar, work, and topic pages are not currently published/);
  assert.doesNotMatch(about, /from this change/);
  assert.match(guide, /current authored corpus keeps entity records in draft or archived state/);
  assert.match(home, /The knowledge graph is not published yet/);
  assert.match(pricing, /not a promise that entity pages already exist/);
  assert.match(terms, /when records are published, a graph/);
  assert.match(framework, /when records are published, a graph/);
  assert.doesNotMatch(framework, /Phase 1 focuses on an open theory graph|begin from a research topic or theory in the graph/);
});

test("identity, contact, and scope claims stay honest across trust pages", () => {
  const about = read("src/app/about/page.tsx");
  const editorial = read("src/app/editorial-policy/page.tsx");
  const corrections = read("src/app/corrections/page.tsx");
  const guide = read("src/components/content/SiteReadingGuide.tsx");
  const readme = read("README.md");

  assert.match(about, /Syrtag is an independent research-navigation project\./);
  assert.match(editorial, /Syrtag is an independent research-navigation project\./);
  assert.match(about, /does not currently identify a registered entity or an individual operator/);
  assert.match(about, /Not published\./);
  assert.match(corrections, /Not published and not monitored/);
  assert.match(corrections, /does not currently operate a public correction-intake channel/);
  assert.match(editorial, /does not currently operate a public correction-intake channel/);
  assert.match(about, /intended public scope is education and sociology/);
  assert.match(editorial, /intended public scope is education and sociology/);
  assert.match(guide, /education and sociology/);
  assert.doesNotMatch(readme, /TODO_OWNER_/);
  assert.doesNotMatch([about, editorial, corrections].join("\n"), /mailto:|<form|Inc\.|Ltd\.|LLC|TODO_OWNER_/);
});

test("trust surfaces avoid AdSense-ready or production-healthy claims", () => {
  const bundle = trustSurfaces.map(read).join("\n");
  assert.doesNotMatch(bundle, /AdSense-ready|AdSense approved|create-next-app|Deploy on Vercel/i);
  assert.doesNotMatch(bundle, /(?<!does not claim that )production is healthy/i);
  assert.match(read("README.md"), /Advertising is off/);
  assert.match(read("README.md"), /does not claim that production is healthy/);
});
