import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { entityMetadata } from "../src/lib/seo.ts";

const read = (path: string) => readFileSync(path, "utf8");
const literalPattern = (wording: string) => new RegExp(wording.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

const approvedIdentity = "Syrtag is an independent research-navigation project.";
const approvedIdentityLimit = "Syrtag does not currently identify a registered entity or an individual operator on the public site.";
const approvedResponsibility = "Syrtag is responsible for the selection, organization, source presentation, editorial synthesis, and correction of content it publishes. It distinguishes source-backed facts from editorial synthesis and research guidance. Its content is an educational navigation resource, not peer review and not a substitute for primary-source reading, disciplinary supervision, or methodological review.";
const approvedContactLimit = "Syrtag does not currently publish or represent an email address or form as a monitored contact channel.";
const approvedCorrectionLimit = "Syrtag does not currently operate a public correction-intake channel. Do not submit personal or sensitive information. A correction route will be published only after a monitored channel and data-handling process are established.";
const approvedResponseLimit = "No response or resolution timeframe is currently promised.";

test("About and Editorial Policy publish the approved identity and responsibility facts", () => {
  const about = read("src/app/about/page.tsx");
  const editorialPolicy = read("src/app/editorial-policy/page.tsx");

  assert.match(about, literalPattern(approvedIdentity));
  assert.match(about, literalPattern(approvedIdentityLimit));
  assert.match(about, literalPattern(approvedResponsibility));
  assert.match(editorialPolicy, literalPattern(approvedIdentity));
  assert.match(editorialPolicy, literalPattern(approvedResponsibility));
  assert.match(editorialPolicy, literalPattern(approvedCorrectionLimit));
  assert.match(editorialPolicy, literalPattern(approvedResponseLimit));
});

test("Corrections is an accessible limitations route with exact approved wording", () => {
  const path = "src/app/corrections/page.tsx";

  assert.equal(existsSync(path), true);
  const corrections = read(path);
  assert.match(corrections, /title="Contact and corrections"/);
  assert.match(corrections, /title: "Contact and corrections"/);
  assert.match(corrections, /description: "Current contact and correction-intake limitations for the Syrtag independent research-navigation project\."/);
  assert.match(corrections, /path: "\/corrections"/);
  assert.match(corrections, /type: "website"/);
  for (const wording of [approvedContactLimit, approvedCorrectionLimit, approvedResponseLimit]) {
    assert.match(corrections, literalPattern(wording));
  }
  assert.doesNotMatch(corrections, /mailto:|<form|Organization|sameAs/);
});

test("Corrections metadata resolves to the approved canonical public route", () => {
  const metadata = entityMetadata({
    title: "Contact and corrections",
    description: "Current contact and correction-intake limitations for the Syrtag independent research-navigation project.",
    path: "/corrections",
    type: "website",
  });
  const openGraph = metadata.openGraph as { type?: string; url?: string | URL } | undefined;

  assert.equal(metadata.title, "Contact and corrections | Syrtag");
  assert.match(String(metadata.description), /Current contact and correction-intake limitations/);
  assert.equal(metadata.alternates?.canonical, "https://syrtag.com/corrections");
  assert.equal(openGraph?.url, "https://syrtag.com/corrections");
  assert.equal(openGraph?.type, "website");
});

test("Corrections is discoverable through the Footer and sitemap without stronger identity claims", () => {
  const footer = read("src/components/layout/Footer.tsx");
  const sitemap = read("src/app/sitemap.ts");

  assert.match(footer, /\["Contact and Corrections", "\/corrections"\]/);
  assert.match(sitemap, /absoluteUrl\("\/corrections"\)/);
  assert.doesNotMatch([footer, sitemap].join("\n"), /mailto:|research@syrtag\.com|sameAs|Organization/);
});
