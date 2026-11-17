import assert from "node:assert/strict";
import test from "node:test";
import { AD_SCREEN_KINDS, GLOBAL_ADS_ENABLED, adSlotMayRender } from "../src/lib/ad-screen.ts";
import { seedCorpus } from "../src/data/seed-content.ts";

const BANNED_SLUGS = [
  ["scholar", "john-w-kingdon"],
  ["scholar", "jean-lave"],
  ["work", "cop-wenger-1998"],
  ["work", "lave-wenger-1991-situated-learning"],
  ["work", "elder-1998-life-course"],
] as const;

test("global advertising stays off and refused screens stay refused even if the switch were on", () => {
  assert.equal(GLOBAL_ADS_ENABLED, false);
  for (const screen of AD_SCREEN_KINDS) {
    assert.equal(adSlotMayRender({ screen, requested: true }), false, screen);
    assert.equal(adSlotMayRender({ screen, requested: true, globalEnabled: false }), false, screen);
  }
  for (const screen of AD_SCREEN_KINDS) {
    if (screen === "entity") continue;
    assert.equal(adSlotMayRender({ screen, requested: true, globalEnabled: true }), false, screen);
  }
  assert.equal(adSlotMayRender({ screen: "entity", requested: true, globalEnabled: true }), true);
  assert.equal(adSlotMayRender({ screen: "entity", requested: false, globalEnabled: true }), false);
});

test("five protected old slugs stay unpublished", () => {
  const byType = {
    scholar: seedCorpus.scholars,
    work: seedCorpus.works,
  };
  for (const [type, slug] of BANNED_SLUGS) {
    const record = byType[type].find((entry) => entry.slug === slug);
    assert.ok(record, slug);
    assert.notEqual(record.status, "published", slug);
  }
  const publishedSlugs = [
    ...seedCorpus.scholars.filter((entry) => entry.status === "published").map((entry) => entry.slug),
    ...seedCorpus.works.filter((entry) => entry.status === "published").map((entry) => entry.slug),
  ];
  for (const [, slug] of BANNED_SLUGS) {
    assert.equal(publishedSlugs.includes(slug), false, slug);
  }
});

test("published elder work does not treat an internal batch as a 1974 publisher", () => {
  const work = seedCorpus.works.find((entry) => entry.slug === "elder-children-of-the-great-depression");
  const text = JSON.stringify(work?.content.en);
  assert.doesNotMatch(text, /approved batch/i);
  assert.doesNotMatch(text, /University of Chicago Press is the 1974/);
  assert.match(text, /first-edition publisher/);
  assert.match(text, /1974/);
});
