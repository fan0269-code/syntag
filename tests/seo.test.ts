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
  const openGraphImages = Array.isArray(metadata.openGraph?.images)
    ? metadata.openGraph.images
    : metadata.openGraph?.images ? [metadata.openGraph.images] : [];
  const socialImage = typeof openGraphImages[0] === "object" && !(openGraphImages[0] instanceof URL)
    ? openGraphImages[0]
    : undefined;
  const twitter = typeof metadata.twitter === "object"
    ? metadata.twitter as Record<string, unknown>
    : undefined;
  const robots = typeof metadata.robots === "object" ? metadata.robots : undefined;

  assert.match(String(metadata.title), /Life Course Theory/);
  assert.ok((metadata.description?.length ?? 0) >= 150);
  assert.ok((metadata.description?.length ?? 0) <= 160);
  assert.equal(metadata.alternates?.canonical, "https://syrtag.com/theories/life-course-theory");
  assert.equal(socialImage?.width, 1200);
  assert.equal(socialImage?.height, 630);
  assert.equal(twitter?.card, "summary_large_image");
  assert.equal(robots?.index, true);
  assert.equal(robots?.follow, true);
});

test("home metadata and OG URLs resolve to Syrtag's production domain", () => {
  const metadata = generateHomeMeta();
  assert.equal(metadata.alternates?.canonical, "https://syrtag.com/");
  assert.match(ogImageUrl("Life Course Theory", "Research guide"), /^https:\/\/syrtag\.com\/api\/og\?/);
});
