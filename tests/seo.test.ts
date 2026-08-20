import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  generateHomeMeta,
  generateTheoryMeta,
  generateWorkMeta,
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

test("work metadata stays type-neutral and work pages do not claim Book schema", () => {
  const metadata = generateWorkMeta({
    title: "A Research Work",
    publisher: "Example Publisher",
    slug: "a-research-work",
  });
  const source = readFileSync("src/app/works/[slug]/page.tsx", "utf8");

  assert.match(String(metadata.title), /Research Work Guide/);
  assert.doesNotMatch(String(metadata.title), /Foundational|Book/i);
  assert.match(String(metadata.description), /research work guide/i);
  assert.doesNotMatch(source, /JsonLdBook|components\/seo\/JsonLdBook/);
  assert.match(source, /kind="Research work"/);
});

test("work detail, index, fallback, SEO, and graph copy stay research-work neutral", () => {
  const detailSource = readFileSync("src/app/works/[slug]/page.tsx", "utf8");
  const indexSource = readFileSync("src/app/works/page.tsx", "utf8");
  const indexDataSource = readFileSync("src/lib/entities/indexes.ts", "utf8");
  const graphSource = readFileSync("src/components/seo/JsonLdGraph.tsx", "utf8");

  assert.doesNotMatch(detailSource, /JsonLdBook|components\/seo\/JsonLdBook/);
  assert.match(detailSource, /kind="Research work"/);
  assert.match(indexSource, /published research works/);
  assert.match(indexDataSource, /publisher \|\| "Published research work\."/);
  assert.match(indexDataSource, /\["Research work"\]/);
  assert.match(graphSource, /research works/);
});
