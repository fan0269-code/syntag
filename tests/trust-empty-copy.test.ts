import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { entityMetadata, generateHomeMeta } from "../src/lib/seo.ts";

const read = (path: string) => readFileSync(path, "utf8");

const indexPages = [
  ["theories", "src/app/theories/page.tsx"],
  ["scholars", "src/app/scholars/page.tsx"],
  ["works", "src/app/works/page.tsx"],
  ["topics", "src/app/topics/page.tsx"],
  ["concepts", "src/app/concepts/page.tsx"],
  ["disciplines", "src/app/disciplines/page.tsx"],
  ["fields", "src/app/fields/page.tsx"],
] as const;

const forbiddenCatalogClaims = /74 published|all disciplines|ready for ads|AdSense application|adsense/i;

test("home metadata matches the empty catalog and keeps advertising off", () => {
  const metadata = generateHomeMeta();
  const description = String(metadata.description);

  assert.match(String(metadata.title), /Doctoral theory navigation \(education & sociology\)/);
  assert.match(description, /education and sociology/i);
  assert.match(description, /Public pages appear only when published/);
  assert.match(description, /catalog may be empty/);
  assert.match(description, /Advertising is off/);
  assert.ok(description.length <= 160);
  assert.doesNotMatch(description, forbiddenCatalogClaims);
});

test("empty home states the product, the scope, why it is empty, and the next pages", () => {
  const home = read("src/app/page.tsx");

  assert.match(home, /The knowledge graph is not published yet/);
  assert.match(home, /source-aware map for doctoral research in education and sociology/);
  assert.match(home, /not a journal or a writing service/);
  assert.match(home, /No published graph is available yet\. Syrtag only shows records with status published after source-backed human review\./);
  assert.match(home, /An empty catalog means drafts, archived seed, and local demo data are withheld\. It does not mean the literature does not exist\./);
  assert.match(home, /While the public graph is empty, read <Link href="\/about">About<\/Link> and <Link href="\/editorial-policy">Editorial policy<\/Link>/);
  assert.match(home, /may be empty/);
  assert.doesNotMatch(home, forbiddenCatalogClaims);
  assert.doesNotMatch(home, /TODO_OWNER_|TODO_SOURCE/);
});

test("About leaves publisher slots unfinished and states the publication boundary", () => {
  const about = read("src/app/about/page.tsx");
  const metadata = entityMetadata({
    title: "About Syrtag — What we publish and what we don't | Syrtag",
    description: "Education and sociology only. Pages appear only when published, and advertising is off. Operator identity stays unpublished until the owner fills it.",
    path: "/about",
    type: "website",
  });

  assert.match(about, /Syrtag is not a journal, a writing service/);
  assert.match(about, /education and sociology only/);
  assert.match(about, /The entity catalog is empty until records are published/);
  assert.match(about, /<dd>Not published\.<\/dd>/);
  assert.match(about, /stay unfinished until the owner fills them/);
  assert.match(String(metadata.description), /advertising is off/);
  assert.ok((metadata.description?.length ?? 0) <= 160);
  assert.doesNotMatch(about, /TODO_OWNER_|TODO_SOURCE|Lin Wen|mailto:|Inc\.|Ltd\.|LLC/);
  assert.doesNotMatch(about, forbiddenCatalogClaims);
});

test("editorial policy keeps quotable source, synthesis, and limited-review rules", () => {
  const editorial = read("src/app/editorial-policy/page.tsx");
  const metadata = entityMetadata({
    title: "Editorial policy — Sources, synthesis, and review status | Syrtag",
    description: "Substantive claims need a source and a verification date. Editorial synthesis is not peer review. Incomplete evidence is labeled limited review.",
    path: "/editorial-policy",
    type: "website",
  });

  assert.match(editorial, /A substantive claim needs a source URL, a source type, and a verification date\./);
  assert.match(editorial, /Editorial synthesis is not a peer-reviewed conclusion\./);
  assert.match(editorial, /limited-review label/);
  assert.match(editorial, /does not claim to operate a peer-review committee/);
  assert.match(editorial, /paraphrase with the primary sources/);
  assert.match(editorial, /not a verbatim copy of a copyrighted abstract/);
  assert.match(String(metadata.description), /not peer review/);
  assert.match(String(metadata.description), /limited review/);
  assert.ok((metadata.description?.length ?? 0) <= 160);
  assert.doesNotMatch(editorial, forbiddenCatalogClaims);
});

test("privacy and terms state the ads-off and not-advice boundaries", () => {
  const privacy = read("src/app/privacy/page.tsx");
  const terms = read("src/app/terms/page.tsx");
  const privacyMeta = entityMetadata({
    title: "Privacy — No ads or tracking cookies enabled | Syrtag",
    description: "No third-party behavioural ads or tracking cookies are enabled. Advertising technology is off. This page will be updated before that changes.",
    path: "/privacy",
    type: "website",
  });

  assert.match(privacy, /No third-party behavioural ads or tracking cookies are enabled today\./);
  assert.match(privacy, /This page will be updated before that changes\./);
  assert.match(privacy, /has not enabled advertising technology, email services, or tracking cookies/);
  assert.match(String(privacyMeta.title), /No ads or tracking cookies enabled/);
  assert.ok((privacyMeta.description?.length ?? 0) <= 160);
  assert.match(terms, /educational navigation only/i);
  assert.match(terms, /not supervision, peer review, or professional advice/i);
  assert.match(terms, /primary sources/i);
  assert.doesNotMatch([privacy, terms].join("\n"), /ca-pub-|adsbygoogle|ready for an ad/i);
});

test("corrections refuses an unpublished intake instead of collecting sensitive data", () => {
  const corrections = read("src/app/corrections/page.tsx");

  assert.match(corrections, /does not currently operate a public correction-intake channel/);
  assert.match(corrections, /The correction intake is unpublished\./);
  assert.match(corrections, /Do not send personal or sensitive data to an unpublished intake\./);
  assert.doesNotMatch(corrections, /mailto:|<form|TODO_OWNER_|TODO_SOURCE|@syrtag\.com/);
});

test("catalog indexes share one empty pattern and do not invent cards", () => {
  const index = read("src/components/content/EntityIndexPage.tsx");

  assert.match(index, /No published \{title\.toLowerCase\(\)\} yet\./);
  assert.match(index, /Indexes list only published records and may be empty\./);
  assert.match(index, /<Link href="\/about">About<\/Link>/);
  assert.match(index, /<Link href="\/editorial-policy">Editorial policy<\/Link>/);
  assert.match(index, /\{items\.length \?/);
  assert.doesNotMatch(index, /placeholder|sample card|coming soon/i);

  for (const [label, path] of indexPages) {
    const source = read(path);
    assert.match(source, /may be empty/);
    assert.match(source, /EntityIndexPage/);
    assert.match(source, new RegExp(`title="${label[0].toUpperCase()}${label.slice(1)}"`));
    assert.doesNotMatch(source, forbiddenCatalogClaims);
  }
});
