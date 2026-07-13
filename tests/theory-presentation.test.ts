import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { seedCorpus } from "../src/data/seed-content.ts";
import {
  buildTheoryPresentation,
  type TheorySectionKey,
} from "../src/lib/theory-presentation.ts";

const sharedSections: TheorySectionKey[] = [
  "origins",
  "core_concepts",
  "genealogy",
  "applicable_topics",
  "inapplicable_topics",
  "misuse_risks",
  "reading_path",
  "sources_and_verification",
];

const researchDesignSections: TheorySectionKey[] = [
  "analysis_dimensions",
  "data_collection",
  "chapter_structure",
  "fit_writing",
];

const d2DesignSections: TheorySectionKey[] = [
  "explanatory_mechanisms",
  "analysis_unit",
  "theory_comparisons",
  "boundary_conditions",
];

test("all twelve theory records produce presentable structured content without placeholders", () => {
  assert.equal(seedCorpus.theories.length, 12);

  for (const theory of seedCorpus.theories) {
    const presentation = buildTheoryPresentation(theory.content.en, theory.depth);

    assert.ok(presentation.summary, `${theory.slug} has a summary`);
    assert.ok(presentation.origins, `${theory.slug} has origins`);
    assert.ok(presentation.coreConcepts.length > 0, `${theory.slug} has concepts`);
    assert.ok(presentation.genealogy.length > 0, `${theory.slug} has genealogy`);
    assert.ok(presentation.applicableTopics.length > 0, `${theory.slug} has fit guidance`);
    assert.ok(presentation.inapplicableTopics.length > 0, `${theory.slug} has boundaries`);
    assert.ok(presentation.misuseRisks.length > 0, `${theory.slug} has misuse risks`);
    assert.ok(presentation.readingPath.length > 0, `${theory.slug} has a reading path`);
    assert.ok(presentation.sourceItems.some((item) => item.level === "L1_verified" && item.url), `${theory.slug} exposes its L1 source`);
    assert.deepEqual(
      new Set(presentation.sourceItems.map((item) => item.level)),
      new Set(["L1_verified", "L2_reviewed", "L3_pending"]),
      `${theory.slug} exposes L1, L2, and L3 records`,
    );
    assert.doesNotMatch(JSON.stringify(presentation), /being prepared|Verification pending/i);
  }
});

test("D1, D2, and D3 expose distinct depth-appropriate page sections", () => {
  for (const theory of seedCorpus.theories) {
    const presentation = buildTheoryPresentation(theory.content.en, theory.depth);
    assert.ok(sharedSections.every((section) => presentation.sectionKeys.includes(section)));

    if (theory.depth === "D1") {
      assert.equal(presentation.depthLabel, "D1 · Foundation");
      assert.ok(presentation.theoryNature, `${theory.slug} states its page scope and status`);
      assert.ok(presentation.sectionKeys.includes("theory_nature"));
      assert.ok(presentation.theoryNature?.sources.length, `${theory.slug} links evidence for its page status`);
      assert.ok(presentation.genealogy.every((entry) => entry.sources.length > 0), `${theory.slug} links evidence for its related-theory comparison`);
      assert.ok(researchDesignSections.every((section) => !presentation.sectionKeys.includes(section)));
      assert.ok(!presentation.sectionKeys.includes("depth_coverage"));
      continue;
    }

    assert.ok(researchDesignSections.every((section) => presentation.sectionKeys.includes(section)));
    assert.ok(presentation.analysisDimensions.length > 0);
    assert.ok(presentation.dataCollection.length > 0);
    assert.ok(presentation.chapterStructure.length > 0);
    assert.ok(presentation.fitWriting.length > 0);

    if (theory.depth === "D2") {
      assert.equal(presentation.depthLabel, "D2 · Research design");
      assert.ok(d2DesignSections.every((section) => presentation.sectionKeys.includes(section)));
      assert.ok(presentation.explanatoryMechanisms.length > 0);
      assert.ok(presentation.analysisUnit);
      assert.ok(presentation.theoryComparisons.length >= 2);
      assert.ok(presentation.boundaryConditions.length > 0);
      assert.ok(!presentation.sectionKeys.includes("depth_coverage"));
    } else {
      assert.equal(presentation.depthLabel, "D3 · Deep research");
      assert.ok(presentation.sectionKeys.includes("depth_coverage"));
      assert.ok(presentation.depthCoverage.length >= 5);
    }
  }
});

test("malformed verification records never become public verified badges", () => {
  const theory = seedCorpus.theories[0];
  const presentation = buildTheoryPresentation({
    ...theory.content.en,
    verification: [
      { claim: "Broken L1", evidence_level: "L1", source_id: "missing", status: "verified" },
      { claim: "Broken L2", evidence_level: "L2", status: "verified" },
      { claim: "Broken L3", evidence_level: "L3", status: "editorial" },
    ],
  }, theory.depth);

  assert.ok(presentation.sourceItems.every((item) => !item.text.startsWith("Broken")));
  assert.ok(presentation.sourceItems.every((item) => item.url));
});

test("D3 pages expose reading levels, item evidence, and every listed source", () => {
  for (const theory of seedCorpus.theories.filter((entry) => entry.depth === "D3")) {
    const presentation = buildTheoryPresentation(theory.content.en, theory.depth);
    const listedUrls = new Set(theory.content.en.sources?.map((source) => source.url));
    const publicUrls = new Set(presentation.sourceItems.flatMap((item) => item.url ? [item.url] : []));

    assert.deepEqual(publicUrls, listedUrls, `${theory.slug} exposes every listed source`);
    assert.ok(new Set(presentation.readingPath.map((entry) => entry.level)).size >= 3);
    for (const entries of [
      presentation.historicalDevelopment,
      presentation.keyScholars,
      presentation.adjacentTheories,
      presentation.criticisms,
    ]) {
      assert.ok(entries.every((entry) => entry.sources.length > 0), `${theory.slug} exposes item evidence`);
    }
  }
});

test("the public theory article is wired to every presentation block without placeholder copy", () => {
  const source = readFileSync("src/components/content/TheoryArticle.tsx", "utf8");

  assert.doesNotMatch(source, /being prepared|Verification pending/i);
  for (const field of [
    "depthLabel",
    "verificationSummary",
    "theoryNature",
    "explanatoryMechanisms",
    "analysisUnit",
    "theoryComparisons",
    "boundaryConditions",
    "coreQuestion",
    "historicalDevelopment",
    "keyScholars",
    "coreConcepts",
    "genealogy",
    "adjacentTheories",
    "applicableTopics",
    "inapplicableTopics",
    "misuseRisks",
    "criticisms",
    "analysisDimensions",
    "dataCollection",
    "chapterStructure",
    "fitWriting",
    "depthCoverage",
    "readingPath",
    "sourceItems",
  ]) {
    assert.match(source, new RegExp(`presentation\\.${field}\\b`), `TheoryArticle renders ${field}`);
  }
  assert.match(source, /<SourceBlock sources=\{presentation\.sourceItems\}/);
});

test("the public theory article exposes existing concept relationships as detail links", () => {
  const source = readFileSync("src/components/content/TheoryArticle.tsx", "utf8");

  assert.match(source, /heading="Related concepts"/);
  assert.match(source, /theory\.concepts\.map\(\(\{ concept \}\) => \(\{ label: concept\.termEn, href: `\/concepts\/\$\{concept\.slug\}` \}\)\)/);
});
