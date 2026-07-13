import assert from "node:assert/strict";
import test from "node:test";

import {
  generateHomeMeta,
  generateTheoryMeta,
  ogImageUrl,
} from "../src/lib/seo.ts";

test("theory metadata has a canonical URL, social image, and crawler directives", () => {
  const metadata = generateTheoryMeta({
    titleEn: "Life Course Theory",
    summaryEn: "A framework for examining how historical time, social ties, and life transitions shape development.",
    slug: "life-course-theory",
  });

  assert.match(String(metadata.title), /Life Course Theory/);
  assert.ok((metadata.description?.length ?? 0) >= 150);
  assert.ok((metadata.description?.length ?? 0) <= 160);
  assert.equal(metadata.alternates?.canonical, "https://syntag.app/theories/life-course-theory");
  assert.equal(metadata.openGraph?.images?.[0]?.width, 1200);
  assert.equal(metadata.openGraph?.images?.[0]?.height, 630);
  assert.equal(metadata.twitter?.card, "summary_large_image");
  assert.equal(metadata.robots?.index, true);
  assert.equal(metadata.robots?.follow, true);
});

test("home metadata and OG URLs resolve to Syntag's production domain", () => {
  const metadata = generateHomeMeta();
  assert.equal(metadata.alternates?.canonical, "https://syntag.app/");
  assert.match(ogImageUrl("Life Course Theory", "Research guide"), /^https:\/\/syntag\.app\/api\/og\?/);
});
