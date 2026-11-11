import assert from "node:assert/strict";
import test from "node:test";

import { seedCorpus } from "../src/data/seed-content.ts";
import {
  CLUSTER_SCHOLAR_SLUG,
  CLUSTER_THEORY_SLUG,
  CLUSTER_VERIFIED_AT,
  CLUSTER_WORK_SLUGS,
} from "../src/data/corpus/content-batches/2026-11-11-cluster-deepening.ts";
import { isClosedClaimLedger } from "../src/lib/claim-ledger.ts";
import { publishedIndexIntro } from "../src/lib/published-index-intro.ts";
import {
  FAN_247_ARCHIVED_SCHOLAR_SLUGS,
  FAN_247_ARCHIVED_THEORY_SLUGS,
  FAN_247_ARCHIVED_WORK_SLUGS,
} from "../src/lib/fan247-visibility.ts";

const forbiddenSlugs = [
  "cop-wenger-1998",
  "lave-wenger-1991-situated-learning",
  "elder-1998-life-course",
  "beijaard-meijer-verloop-2004-identity",
  "jean-lave",
  "etienne-wenger",
  "glen-h-elder-jr",
  "streams-coupling-policy-window",
] as const;

test("the 2026-11-11 cluster publishes new slugs and leaves archived slugs archived", () => {
  for (const slug of CLUSTER_WORK_SLUGS) {
    const work = seedCorpus.works.find((entry) => entry.slug === slug);
    assert.equal(work?.status, "published", slug);
    assert.ok(isClosedClaimLedger(work?.content.en.verification), slug);
  }
  const theory = seedCorpus.theories.find((entry) => entry.slug === CLUSTER_THEORY_SLUG);
  const scholar = seedCorpus.scholars.find((entry) => entry.slug === CLUSTER_SCHOLAR_SLUG);
  assert.equal(theory?.status, "published");
  assert.equal(scholar?.status, "published");
  assert.equal(seedCorpus.scholars.find((entry) => entry.slug === "john-w-kingdon")?.status, "draft");
  assert.equal(seedCorpus.theories.find((entry) => entry.slug === "multiple-streams-framework")?.status, "archived");
  assert.ok(isClosedClaimLedger(theory?.content.en.verification));
  assert.ok(isClosedClaimLedger(scholar?.content.en.verification));

  for (const slug of forbiddenSlugs) {
    const records = [
      ...seedCorpus.theories,
      ...seedCorpus.works,
      ...seedCorpus.scholars,
      ...seedCorpus.concepts,
    ];
    const matches = records.filter((entry) => entry.slug === slug);
    assert.ok(matches.length <= 1, slug);
    assert.ok(matches.every((entry) => entry.status === "archived"), slug);
  }
  assert.ok(FAN_247_ARCHIVED_WORK_SLUGS.includes("cop-wenger-1998"));
  assert.ok(FAN_247_ARCHIVED_SCHOLAR_SLUGS.includes("jean-lave"));
  assert.ok(FAN_247_ARCHIVED_THEORY_SLUGS.includes("multiple-streams-framework"));
  assert.equal((FAN_247_ARCHIVED_SCHOLAR_SLUGS as readonly string[]).includes(CLUSTER_SCHOLAR_SLUG), false);
});

test("multiple streams cites the Pearson catalog and EPAA 771, not article 757", () => {
  const theory = seedCorpus.theories.find((entry) => entry.slug === CLUSTER_THEORY_SLUG);
  const serialized = JSON.stringify(theory);
  assert.match(serialized, /9781292053875/);
  assert.match(serialized, /epaa\.asu\.edu\/index\.php\/epaa\/article\/view\/771/);
  assert.match(serialized, /10\.14507\/epaa\.v18n15\.2010/);
  assert.equal(serialized.includes("/article/view/757"), false);
  assert.match(serialized, /McCombs/);
  assert.match(serialized, /not an education monograph|U\.S\. federal/);
  assert.equal(serialized.includes("john-w-kingdon"), false);
  assert.ok(theory?.content.en.verification?.every((entry) => entry.verifiedAt === CLUSTER_VERIFIED_AT));
  assert.ok(theory?.content.en.verification?.filter((entry) => entry.evidence_level === "L2").every((entry) => entry.contentNature === "editorial_synthesis"));
});

test("Jean Lave keeps the affiliation conflict and does not invent a CV", () => {
  const scholar = seedCorpus.scholars.find((entry) => entry.slug === CLUSTER_SCHOLAR_SLUG);
  const serialized = JSON.stringify(scholar);
  assert.match(serialized, /Department: Education/);
  assert.match(serialized, /Department of Geography/);
  assert.match(serialized, /side by side|Side-by-side/);
  assert.equal(serialized.includes("vcresearch.berkeley.edu"), false);
  assert.equal(serialized.includes("orcid.org"), false);
  assert.match(serialized, /empty ORCID/);
  assert.match(serialized, /lave-and-wenger-1991-situated-learning/);
  assert.equal(serialized.includes("lave-wenger-1991-situated-learning"), false);
  assert.match(scholar?.content.en.representative_works[0]?.work_slug ?? "", /^lave-and-wenger-1991-situated-learning$/);
});

test("Children of the Great Depression keeps 1974, 1999, and 2018 apart", () => {
  const work = seedCorpus.works.find((entry) => entry.slug === "elder-children-of-the-great-depression");
  assert.equal(work?.year, 1974);
  assert.match(work?.publisher ?? "", /University of Chicago Press/);
  assert.equal(work?.doi, "10.4324/9780429501739");
  const serialized = JSON.stringify(work);
  assert.match(serialized, /1999/);
  assert.match(serialized, /2018/);
  assert.match(serialized, /does not display a 1974 Chicago title page/);
  assert.equal(serialized.includes("In this highly acclaimed work first published in 1974"), false);
});

test("index intros name only the records supplied at render time", () => {
  assert.match(
    publishedIndexIntro("theories", [], "Lists only published records and may be empty."),
    /may be empty/,
  );
  const intro = publishedIndexIntro("works", [
    { title: "Reconsidering research on teachers' professional identity" },
  ], "Lists only published research works and may be empty.");
  assert.match(intro, /1 published work/);
  assert.match(intro, /Reconsidering research on teachers' professional identity/);
  assert.equal(intro.includes("multiple streams"), false);
  assert.equal(intro.includes("74 published"), false);
  assert.doesNotMatch(intro, /AdSense|adsense/i);
});
