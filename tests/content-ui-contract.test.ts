import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { sourceItemsForEntity } from "../src/lib/knowledge-entity-presentation.ts";

const articleTocSource = () => readFileSync("src/components/content/ArticleToc.tsx", "utf8");
const entityArticleSource = () => readFileSync("src/components/content/EntityArticle.tsx", "utf8");
const sourceBlockSource = () => readFileSync("src/components/common/SourceBlock.tsx", "utf8");
const verificationBadgeSource = () => readFileSync("src/components/common/VerificationBadge.tsx", "utf8");

test("ArticleToc exposes one responsive navigation tree with mobile trigger and current-section contract", () => {
  const source = articleTocSource();

  assert.match(source, /export function ArticleTocMarkup/);
  assert.match(source, /article-toc--responsive/);
  assert.match(source, /article-toc__trigger/);
  assert.match(source, /aria-controls="article-toc-list"/);
  assert.match(source, /article-toc__current/);
  assert.match(source, /data-current-section/);
  assert.doesNotMatch(source, /<div>\{links\}<\/div>\s*<details>[\s\S]*<div>\{links\}<\/div>/, "TOC must not duplicate the same links into desktop and mobile trees");
});

test("EntityArticle describes page-level source semantics without promoting the first source badge to whole-page verification", () => {
  const source = entityArticleSource();

  assert.match(source, /Sources listed · editorial synthesis · claim-level review pending/);
  assert.match(source, /page-level-source-note/);
  assert.match(source, /This page lists registered sources and editorial synthesis/);
  assert.doesNotMatch(source, /<VerificationBadge level=\{sourceItems\[0\]\?\.level/, "hero must not use sourceItems[0] as a whole-page verification badge");
});

test("SourceBlock states that sources are page registrations, not claim-by-claim verification", () => {
  const source = sourceBlockSource();

  assert.match(source, /Page source register/);
  assert.match(source, /These sources are registered for this page/);
  assert.match(source, /not a claim-by-claim verification database/);
  assert.match(source, /data-source-scope="page-source-register"/);
  assert.match(source, /source-block__meta/);
  assert.match(source, /data-source-type=\{source\.type \?\? "not-recorded"\}/);
  assert.match(source, /data-source-date=\{source\.date \?\? "not-recorded"\}/);
  assert.match(source, /safeSourceUrl\(source\.url\)/);
  assert.match(source, /rel="noopener noreferrer"/);
  assert.match(source, /key=\{`\$\{source\.text\}-\$\{source\.level\}-\$\{source\.url \?\? "no-url"\}-\$\{source\.type \?\? "no-type"\}-\$\{source\.date \?\? "no-date"\}`\}/);
});

test("VerificationBadge keeps existing levels while exposing scope and accessible explanatory text", () => {
  const source = verificationBadgeSource();

  assert.match(source, /type VerificationLevel = "L1_verified" \| "L2_reviewed" \| "L3_pending"/);
  assert.match(source, /scope\?: VerificationScope/);
  assert.match(source, /data-verification-scope=\{scope\}/);
  assert.doesNotMatch(source, /aria-label=\{accessibleLabel\}/);
  assert.doesNotMatch(source, /accessibleLabel/);
  assert.doesNotMatch(source, /verification-badge__a11y/);
  assert.doesNotMatch(source, /aria-hidden="true">\{levelLabels\[level\]\}/);
  assert.match(source, /verification-badge__level/);
  assert.match(source, /verification-badge__text/);
  assert.match(source, /verification-badge__explanation/);
});

test("legacy L1 source metadata keeps its link but does not display claim-level Source verified", () => {
  const items = sourceItemsForEntity({
    sources: [{
      id: "legacy-source",
      citation: "Legacy source record.",
      url: "https://example.edu/legacy-source",
      source_kind: "university",
      evidence_level: "L1",
      supports: ["A bounded source record"],
    }],
    verification: [{
      claim: "A legacy L1 source record is listed without claim-level approval.",
      evidence_level: "L1",
      source_id: "legacy-source",
      status: "verified",
    }],
  });

  assert.deepEqual(items, [{
    text: "A legacy L1 source record is listed without claim-level approval. — Legacy source record.",
    level: "L3_pending",
    url: "https://example.edu/legacy-source",
  }]);
});
