import assert from "node:assert/strict";
import test from "node:test";

import { seedCorpus } from "../src/data/seed-content.ts";
import {
  CLUSTER_SCHOLAR_SLUG,
  CLUSTER_THEORY_SLUG,
  AAAS_KINGDON_PERSON_VERIFIED_AT,
  CLUSTER_VERIFIED_AT,
  CLUSTER_WORK_SLUGS,
  EPAA_771_FULLTEXT_VERIFIED_AT,
  KINGDON_SCHOLAR_SLUG,
  KINGDON_WORK_SLUG,
} from "../src/data/corpus/content-batches/2026-11-11-cluster-deepening.ts";
import { THEORY_READING_ROUTES } from "../src/lib/published-reading-routes.ts";
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
  assert.match(serialized, /No McCombs source was opened/);
  assert.match(serialized, /not an education monograph|U\.S\. federal/);
  assert.match(serialized, /applicability may depend on the issue being examined/);
  assert.equal(serialized.includes("does not travel to a state unchanged"), false);
  assert.match(serialized, /kingdon-agendas-alternatives-and-public-policies/);
  assert.match(serialized, /john-w-kingdon-flagship/);
  assert.equal(/john-w-kingdon(?!-flagship)/.test(serialized), false);
  const applicability = theory?.content.en.verification?.find((entry) => entry.claimId === "c11-msa-state-applicability");
  assert.equal(applicability?.verifiedAt, EPAA_771_FULLTEXT_VERIFIED_AT);
  assert.equal(applicability?.evidence_level === "L1" ? applicability.source_id : undefined, "c11-young-shepley-song-2010-epaa");
  const fullTextClaimIds = new Set(["c11-msa-epaa", "c11-msa-crossref", "c11-msa-state-applicability"]);
  for (const entry of theory?.content.en.verification ?? []) {
    const expected = fullTextClaimIds.has(entry.claimId ?? "") ? EPAA_771_FULLTEXT_VERIFIED_AT : CLUSTER_VERIFIED_AT;
    assert.equal(entry.verifiedAt, expected, entry.claimId);
  }
  assert.match(serialized, /2026-11-21/);
  assert.match(serialized, /23 pages/);
  assert.match(serialized, /article\/download\/771\/842/);
  assert.match(serialized, /interviews in California, Michigan, and Texas/);
  assert.match(serialized, /The education application is the EPAA article at view 771/);
  assert.match(serialized, /Pearson catalog alone does not support that application/);
  assert.doesNotMatch(serialized, /not reread|did not reopen|was not reread/i);
  assert.doesNotMatch(serialized, /education application is not supported by the EPAA article/i);
  assert.equal(serialized.includes("/article/view/757"), false);
  const route = THEORY_READING_ROUTES.find((entry) => entry.slug === CLUSTER_THEORY_SLUG);
  assert.match(route?.prompt ?? "", /2026-11-21/);
  assert.doesNotMatch(route?.prompt ?? "", /not reread|did not reopen/i);
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
  assert.match(work?.publisher ?? "", /not verified/);
  assert.doesNotMatch(work?.publisher ?? "", /University of Chicago Press/);
  assert.equal(work?.doi, "10.4324/9780429501739");
  const serialized = JSON.stringify(work);
  assert.match(serialized, /1999/);
  assert.match(serialized, /2018/);
  assert.match(serialized, /first-edition publisher/);
  assert.doesNotMatch(serialized, /approved batch/);
  assert.equal(serialized.includes("In this highly acclaimed work first published in 1974"), false);
});

test("Kingdon work and scholar pages keep edition layers, access limits, and the draft slug unpublished", () => {
  const work = seedCorpus.works.find((entry) => entry.slug === KINGDON_WORK_SLUG);
  const scholar = seedCorpus.scholars.find((entry) => entry.slug === KINGDON_SCHOLAR_SLUG);
  assert.equal(work?.status, "published");
  assert.equal(scholar?.status, "published");
  assert.equal(work?.year, 1984);
  assert.equal(work?.doi, undefined);
  assert.equal(work?.isbn, undefined);
  assert.equal(seedCorpus.scholars.find((entry) => entry.slug === "john-w-kingdon")?.status, "draft");
  const workText = JSON.stringify(work);
  const scholarText = JSON.stringify(scholar);
  assert.match(workText, /1995/);
  assert.match(workText, /2011/);
  assert.match(workText, /3 October 2013/);
  assert.match(workText, /2014/);
  assert.match(workText, /9781292053875/);
  assert.match(workText, /not an education monograph|not an education-policy theory page/);
  assert.match(workText, /WebFetch/);
  assert.match(workText, /HTTP 403/);
  assert.match(workText, /Little, Brown/);
  assert.equal(workText.includes("curl succeeded"), false);
  assert.equal(workText.includes("10.978.129205"), false);
  assert.match(scholarText, /A5063257234/);
  assert.equal(scholarText.includes("A5010328750"), false);
  assert.equal(scholarText.includes("Mario Riverol"), false);
  assert.match(scholarText, /empty ORCID/);
  assert.equal(scholarText.includes("orcid.org"), false);
  assert.match(scholarText, /Center for Advanced Behavioral Studies at Stanford/);
  assert.match(scholarText, /Center for Advanced Study in Behavioral Sciences/);
  assert.match(scholarText, /WebFetch/);
  assert.match(scholarText, /HTTP 403/);
  assert.equal(scholarText.includes("curl succeeded"), false);
  assert.doesNotMatch(scholarText, /ordinary access (now )?works/i);
  assert.match(scholarText, /https:\/\/www\.amacad\.org\/person\/john-wells-kingdon/);
  assert.match(scholarText, /Elected 1991/);
  assert.match(scholarText, /Political scientist; Educator/);
  assert.match(scholarText, /Area Social and Behavioral Sciences/);
  assert.match(scholarText, /Specialty Political Science/);
  assert.match(scholarText, /Just a moment/);
  assert.match(scholarText, /2026-11-21 and 2026-11-22, when WebFetch timed out/);
  assert.doesNotMatch(scholarText, /Academy person page was not opened/);
  assert.doesNotMatch(scholarText, /unopened Academy/);
  assert.match(scholarText, /not a verified 1984 first-edition title-page record/);
  assert.match(scholarText, /heading does not override the body/);
  assert.match(scholarText, /not combined into a single title/);
  assert.match(scholarText, /https:\/\/www\.gf\.org\/fellows\/john-w-kingdon\//);
  assert.match(scholarText, /No awards page and no Brookings page were opened/);
  assert.doesNotMatch(scholarText, /\/scholars\/john-w-kingdon(?!-flagship)/);
  const scholarWithoutFellowsUrl = scholarText.replaceAll("https://www.gf.org/fellows/john-w-kingdon/", "");
  assert.equal(/john-w-kingdon(?!-flagship)/.test(scholarWithoutFellowsUrl), false);
  const aaasClaim = scholar?.content.en.verification?.find((entry) => entry.claimId === "c11-kingdon-aaas-person");
  assert.equal(aaasClaim?.evidence_level, "L1");
  assert.equal(aaasClaim?.verifiedAt, AAAS_KINGDON_PERSON_VERIFIED_AT);
  assert.equal(aaasClaim?.evidence_level === "L1" ? aaasClaim.source_id : undefined, "c11-kingdon-aaas-person");
  const nameLimit = scholar?.content.en.verification?.find((entry) => entry.claimId === "c11-kingdon-name-limit");
  assert.equal(nameLimit?.evidence_level, "L2");
  assert.equal(nameLimit?.verifiedAt, AAAS_KINGDON_PERSON_VERIFIED_AT);
  assert.match(nameLimit?.claim ?? "", /two Stanford names unresolved/);
  assert.match(nameLimit?.claim ?? "", /invented ORCID/);
  assert.match(nameLimit?.claim ?? "", /unopened award or Brookings pages/);
  assert.doesNotMatch(nameLimit?.claim ?? "", /unopened Academy/);
  for (const entry of scholar?.content.en.verification ?? []) {
    if (entry.claimId === "c11-kingdon-aaas-person" || entry.claimId === "c11-kingdon-name-limit") continue;
    assert.equal(entry.verifiedAt, CLUSTER_VERIFIED_AT, entry.claimId);
  }
  assert.match(scholarText, /multiple-streams-education-policy/);
  assert.match(scholarText, new RegExp(KINGDON_WORK_SLUG));
  assert.equal(/john-w-kingdon(?!-flagship)/.test(workText), false);
  assert.equal(workText.includes("/article/view/757"), false);
  assert.equal(scholarText.includes("/article/view/757"), false);
  assert.match(workText, /2026-11-21/);
  assert.match(workText, /article\/download\/771\/842/);
  assert.match(scholarText, /2026-11-21/);
  assert.match(scholarText, /article\/download\/771\/842/);
  assert.doesNotMatch(workText, /not reread|did not reopen/i);
  assert.doesNotMatch(scholarText, /not reread|did not reopen/i);
  assert.match(work?.publisher ?? "", /1984 first-edition imprint not settled/);
  assert.doesNotMatch(`${workText} ${scholarText}`, /colophon has been obtained|first-edition title page was obtained/i);
  assert.ok(seedCorpus.theoryWorks.some((relation) => relation.theorySlug === CLUSTER_THEORY_SLUG && relation.workSlug === KINGDON_WORK_SLUG));
  assert.ok(seedCorpus.theoryScholars.some((relation) => relation.theorySlug === CLUSTER_THEORY_SLUG && relation.scholarSlug === KINGDON_SCHOLAR_SLUG));
  assert.equal(seedCorpus.concepts.some((entry) => entry.slug === KINGDON_WORK_SLUG || entry.slug === KINGDON_SCHOLAR_SLUG), false);
  assert.equal(seedCorpus.disciplines.some((entry) => entry.slug === KINGDON_WORK_SLUG), false);
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
  const theoryIntro = publishedIndexIntro("theories", [
    { title: "Multiple streams in education policy" },
  ], "Lists only published records and may be empty.");
  const scholarIntro = publishedIndexIntro("scholars", [
    { title: "John W. Kingdon" },
  ], "Lists only published records and may be empty.");
  const workIntro = publishedIndexIntro("works", [
    { title: "Agendas, Alternatives, and Public Policies" },
  ], "Lists only published research works and may be empty.");
  assert.match(theoryIntro, /Multiple streams in education policy/);
  assert.match(scholarIntro, /John W\. Kingdon/);
  assert.match(workIntro, /Agendas, Alternatives, and Public Policies/);
  assert.match(theoryIntro, /returned for this render/);
  assert.doesNotMatch(`${theoryIntro} ${scholarIntro} ${workIntro}`, /already live|on production|AdSense/i);
});
