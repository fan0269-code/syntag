import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (path: string) => readFileSync(path, "utf8");

const theoryArticleSource = () => readSource("src/components/content/TheoryArticle.tsx");
const staticPageSource = () => readSource("src/components/content/StaticPage.tsx");
const adSlotSource = () => readSource("src/components/common/AdSlot.tsx");
const clientAdSlotSource = () => readSource("src/components/common/ClientAdSlot.tsx");
const pricingSource = () => readSource("src/app/pricing/page.tsx");

test("theory guide hero separates guide depth reading time and page-level source status", () => {
  const source = theoryArticleSource();

  assert.match(source, /Theory guide/);
  assert.match(source, /presentation\.depthLabel/);
  assert.match(source, /readingTime\(theory\.summaryEn, presentation\.summary\)/);
  assert.match(source, /<VerificationBadge level="L3_pending" scope="page"/);
  assert.doesNotMatch(source, /<VerificationBadge level=\{presentation\.sourceItems\[0\]\?\.level/);
  assert.match(source, /This guide lists registered sources and editorial synthesis/);
});

test("theory relationships retain sourced genealogy and offer one neutral browse-more entry", () => {
  const source = theoryArticleSource();

  assert.match(source, /<h2>3\. Theoretical Genealogy<\/h2>/);
  assert.match(source, /EvidenceLinks sources=\{entry\.sources\}/);
  assert.match(source, /new Map\(/);
  assert.match(source, /internalLinks\.filter\(\(\{ href \}\) => href\.startsWith\("\/theories\/"\)\)/);
  assert.match(source, /heading="Browse related theories"/);
  assert.doesNotMatch(source, /heading="Related theories"/);
  assert.doesNotMatch(source, /rel-type--connected/);
});

test("theory section titles use researcher-facing wording instead of depth implementation labels", () => {
  const source = theoryArticleSource();

  assert.match(source, /Theory scope for your study/);
  assert.match(source, /How the theory explains the phenomenon/);
  assert.match(source, /Selecting and comparing theoretical lenses/);
  assert.match(source, /What this guide covers in depth/);
  assert.doesNotMatch(source, /<h2>D[123] /);
});

test("disabled Phase 1 ad slots render no reserved space while retaining an enable seam", () => {
  const adSource = adSlotSource();
  const clientSource = clientAdSlotSource();

  assert.match(adSource, /enabled = false/);
  assert.match(adSource, /if \(!enabled\) return null;/);
  assert.match(adSource, /minHeight: heights\[placement\]/);
  assert.match(clientSource, /enabled = false/);
  assert.match(clientSource, /<AdSlot placement=\{placement\} enabled=\{enabled\} \/>/);
  assert.doesNotMatch(clientSource, /useEffect/);
  assert.doesNotMatch(clientSource, /adsbygoogle|cookie/i);
});

test("StaticPage supports an optional hierarchy and Pricing describes only current and planned access", () => {
  const staticSource = staticPageSource();
  const priceSource = pricingSource();

  assert.match(staticSource, /eyebrow\?: string/);
  assert.match(staticSource, /description\?: string/);
  assert.match(staticSource, /lede\?: string/);
  assert.match(staticSource, /static-page__eyebrow/);
  assert.match(staticSource, /static-page__description/);
  assert.match(staticSource, /static-page__lede/);
  assert.match(priceSource, /eyebrow="Access and roadmap"/);
  assert.match(priceSource, /availability: "Available now"/);
  assert.match(priceSource, /availability: "Planned — not available"/);
  assert.match(priceSource, /No purchase or subscription is available today\./);
  assert.doesNotMatch(priceSource, /Phase 2\/3 功能上线后/);
  assert.doesNotMatch(priceSource, /Monthly subscription|monthly or annual|academic pricing/i);
});
