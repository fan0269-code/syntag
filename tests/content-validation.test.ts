import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { seedCorpus } from "../src/data/seed-content.ts";
import { isConceptContent, isWorkContent } from "../src/data/templates/knowledge-entity-template.ts";
import { isScholarContent } from "../src/data/templates/scholar-template.ts";
import { requiredTheoryBlocks } from "../src/data/templates/theory-template.ts";
import { entityDetailHref } from "../src/lib/entity-routes.ts";
import { validateSeedCorpus } from "../src/lib/content-validation.ts";

test("the seed corpus satisfies the structural content contract", () => {
  const result = validateSeedCorpus(seedCorpus);

  assert.deepEqual(result.errors, []);
  assert.equal(seedCorpus.theories.filter((theory) => theory.primary).length, 12);
  assert.deepEqual(
    Object.fromEntries(
      ["D1", "D2", "D3"].map((depth) => [
        depth,
        seedCorpus.theories.filter((theory) => theory.depth === depth).length,
      ]),
    ),
    { D1: 6, D2: 4, D3: 2 },
  );
  for (const theory of seedCorpus.theories) {
    for (const block of requiredTheoryBlocks(theory.depth)) {
      const value = theory.content.en[block];
      assert.ok(Array.isArray(value) ? value.length > 0 : Boolean(value?.trim?.()), `${theory.slug} has ${block}`);
    }
  }
  const theorySlugs = new Set(seedCorpus.theories.map((theory) => theory.slug));
  assert.ok(seedCorpus.genealogy.every((edge) => edge.descriptionEn.trim().length > 0));
  assert.ok(seedCorpus.genealogy.every((edge) => theorySlugs.has(edge.sourceSlug) && theorySlugs.has(edge.targetSlug)));
  assert.ok(seedCorpus.theories.every((theory) => theory.content.en.genealogy.every((entry) => theorySlugs.has(entry.related_theory) && entry.description.trim().length > 0)));
  assert.ok(
    seedCorpus.verifications
      .filter((item) => item.level === "L1_verified")
      .every((item) => item.sources.length > 0 && item.sources.every((source) => source.startsWith("https://"))),
  );
});

test("the seed corpus includes published scholar and topic graph relations with evidence", () => {
  assert.ok(seedCorpus.scholars.some((scholar) => scholar.status === "published" && scholar.slug === "glen-h-elder-jr"));
  assert.ok(seedCorpus.topics.some((topic) => topic.status === "published" && topic.slug === "educational-transitions-over-time"));
  assert.ok(seedCorpus.theoryScholars.some((relation) => (
    relation.theorySlug === "life-course-theory"
    && relation.scholarSlug === "glen-h-elder-jr"
    && relation.role === "key_contributor"
    && relation.sourceUrls.length > 0
    && relation.evidenceNotesEn.trim().length > 0
  )));
  assert.ok(seedCorpus.topicTheories.some((relation) => (
    relation.topicSlug === "educational-transitions-over-time"
    && relation.theorySlug === "life-course-theory"
    && relation.suitability === "high"
    && relation.recommendation === "primary"
    && relation.suitabilityNotesEn.trim().length > 0
    && relation.sourceUrls.length > 0
  )));
  assert.equal(entityDetailHref("scholar", "glen-h-elder-jr"), "/scholars/glen-h-elder-jr");
  assert.equal(entityDetailHref("topic", "educational-transitions-over-time"), "/topics/educational-transitions-over-time");
});

test("the teacher life-history ethics source resolves to its publisher DOI record", () => {
  const source = seedCorpus.theories
    .find((theory) => theory.slug === "teacher-life-history-research")
    ?.content.en.sources.find((entry) => entry.id === "teacher-life-history-josselson-2007");

  assert.equal(source?.url, "https://doi.org/10.4135/9781452226552.n21");
  assert.match(source?.citation || "", /Josselson, R\. \(2007\)/);
});

test("three flagship checks retain genealogy, fit boundaries, paths, operationalization, and sources", () => {
  const slugs = ["life-course-theory", "teacher-identity-theory", "structuration-theory"];

  for (const slug of slugs) {
    const theory = seedCorpus.theories.find((entry) => entry.slug === slug);
    assert.ok(theory, `${slug} is included`);
    assert.ok(theory.content.en.genealogy.length > 0, `${slug} has a genealogy`);
    assert.ok(theory.content.en.applicable_topics.length > 0, `${slug} has fit guidance`);
    assert.ok(theory.content.en.inapplicable_topics.length > 0, `${slug} sets fit boundaries`);
    assert.ok(theory.content.en.reading_path?.length, `${slug} has a reading path`);
    assert.ok(theory.content.en.sources.length > 0, `${slug} has sources`);
    if (theory.depth !== "D1") {
      assert.ok(theory.content.en.data_collection?.length, `${slug} has operationalization`);
    }
  }
});

test("the two D3 flagships satisfy the C2 depth contract", () => {
  const d3Theories = seedCorpus.theories.filter((theory) => theory.depth === "D3");

  assert.deepEqual(d3Theories.map((theory) => theory.slug), [
    "life-course-theory",
    "teacher-identity-theory",
  ]);

  for (const theory of d3Theories) {
    const content = theory.content.en as typeof theory.content.en & Record<string, unknown>;
    const sourceHosts = new Set(content.sources?.map((source) => new URL(source.url).hostname));
    const verificationLevels = new Set(content.verification?.map((entry) => entry.evidence_level));
    const readingLevels = new Set(content.reading_path?.map((entry) => entry.level));

    assert.ok(typeof content.core_question === "string" && content.core_question.trim(), `${theory.slug} has a core question`);
    assert.ok(Array.isArray(content.historical_development) && content.historical_development.length >= 3, `${theory.slug} has development stages`);
    assert.ok(Array.isArray(content.key_scholars) && content.key_scholars.length >= 3, `${theory.slug} has key scholars and works`);
    assert.ok(content.core_concepts.length >= 4 && content.core_concepts.length <= 6, `${theory.slug} has 4-6 concepts`);
    assert.ok(Array.isArray(content.adjacent_theories) && content.adjacent_theories.length >= 2, `${theory.slug} compares adjacent theories`);
    assert.ok(content.applicable_topics.length >= 3, `${theory.slug} has multiple applicable questions`);
    assert.ok(content.inapplicable_topics.length >= 2, `${theory.slug} has multiple non-fit boundaries`);
    assert.ok(Array.isArray(content.criticisms) && content.criticisms.length >= 2, `${theory.slug} has criticisms and boundaries`);
    assert.ok(content.misuse_risks.length >= 3, `${theory.slug} has misuse risks`);
    assert.ok((content.analysis_dimensions?.length ?? 0) >= 4, `${theory.slug} has analysis dimensions`);
    assert.ok((content.data_collection?.length ?? 0) >= 3, `${theory.slug} distinguishes data materials`);
    assert.ok((content.chapter_structure?.length ?? 0) >= 4, `${theory.slug} covers dissertation chapters`);
    assert.ok((content.reading_path?.length ?? 0) >= 3, `${theory.slug} has a layered reading path`);
    assert.ok(readingLevels.size >= 3 && !readingLevels.has(undefined), `${theory.slug} names at least three reading levels`);
    assert.ok((content.sources?.length ?? 0) >= 4 && sourceHosts.size >= 3, `${theory.slug} has independent authoritative sources`);
    assert.deepEqual(verificationLevels, new Set(["L1", "L2", "L3"]), `${theory.slug} separates L1/L2/L3`);
  }

  assert.notDeepEqual(
    d3Theories[0].content.en.data_collection,
    d3Theories[1].content.en.data_collection,
    "the D3 pages do not reuse the same operationalization copy",
  );
});

test("the four D2 theories satisfy the C3 research-design contract", () => {
  const expected = [
    "structuration-theory",
    "communities-of-practice",
    "practice-theory-bourdieu",
    "social-capital-theory",
  ];
  const d2Theories = seedCorpus.theories.filter((theory) => theory.depth === "D2");

  assert.deepEqual(d2Theories.map((theory) => theory.slug), expected);
  for (const theory of d2Theories) {
    const content = theory.content.en as typeof theory.content.en & Record<string, unknown>;
    const sourceHosts = new Set(content.sources?.map((source) => new URL(source.url).hostname));
    const verificationLevels = new Set(content.verification?.map((entry) => entry.evidence_level));
    const readingLevels = new Set(content.reading_path?.map((entry) => entry.level));
    const comparisons = content.theory_comparisons as Array<{ role?: string }> | undefined;

    assert.ok(content.core_concepts.length >= 4 && content.core_concepts.length <= 6, `${theory.slug} has 4-6 concepts`);
    assert.ok(Array.isArray(content.explanatory_mechanisms) && content.explanatory_mechanisms.length >= 2, `${theory.slug} explains mechanisms`);
    assert.ok(typeof content.analysis_unit === "string" && content.analysis_unit.trim(), `${theory.slug} defines an analysis unit`);
    assert.ok(comparisons?.some((entry) => entry.role === "main_candidate"), `${theory.slug} compares a main candidate`);
    assert.ok(comparisons?.some((entry) => entry.role === "alternative"), `${theory.slug} compares an alternative`);
    assert.ok(Array.isArray(content.boundary_conditions) && content.boundary_conditions.length >= 2, `${theory.slug} states boundary conditions`);
    assert.ok(content.applicable_topics.length >= 3 && content.inapplicable_topics.length >= 2, `${theory.slug} supports fit decisions`);
    assert.ok((content.data_collection?.length ?? 0) >= 3 && (content.chapter_structure?.length ?? 0) >= 4, `${theory.slug} supports research design`);
    assert.ok(readingLevels.size >= 3 && !readingLevels.has(undefined), `${theory.slug} has three reading levels`);
    assert.ok((content.sources?.length ?? 0) >= 4 && sourceHosts.size >= 3, `${theory.slug} has independent sources`);
    assert.deepEqual(verificationLevels, new Set(["L1", "L2", "L3"]), `${theory.slug} separates evidence levels`);
  }

  assert.notDeepEqual(
    d2Theories.map((theory) => theory.content.en.data_collection),
    [d2Theories[0].content.en.data_collection, d2Theories[0].content.en.data_collection, d2Theories[0].content.en.data_collection, d2Theories[0].content.en.data_collection],
    "the D2 pages do not reuse a single data-collection template",
  );
});

test("the six D1 entries satisfy the C4 foundation-page contract", () => {
  const expected = [
    "teacher-professional-development-theory",
    "teacher-life-history-research",
    "educational-equity-theory",
    "institutional-theory",
    "street-level-bureaucracy",
    "multiple-streams-framework",
  ];
  const d1Theories = seedCorpus.theories.filter((theory) => theory.depth === "D1");

  assert.deepEqual(d1Theories.map((theory) => theory.slug), expected);
  for (const theory of d1Theories) {
    const content = theory.content.en as typeof theory.content.en & Record<string, unknown>;
    const sourceHosts = new Set(content.sources?.map((source) => new URL(source.url).hostname));
    const verificationLevels = new Set(content.verification?.map((entry) => entry.evidence_level));
    const nature = content.theory_nature as { kind?: string; explanation?: string; source_ids?: string[] } | undefined;
    const d2OrD3Relation = content.genealogy.find((entry) => {
      const related = seedCorpus.theories.find((candidate) => candidate.slug === entry.related_theory);
      return related?.depth === "D2" || related?.depth === "D3";
    });

    assert.ok(nature && typeof nature.kind === "string" && nature.kind.trim(), `${theory.slug} states its intellectual status`);
    assert.ok(nature && typeof nature.explanation === "string" && nature.explanation.trim(), `${theory.slug} explains that status`);
    assert.ok(nature && Array.isArray(nature.source_ids) && nature.source_ids.length > 0, `${theory.slug} sources that status`);
    assert.ok(content.core_concepts.length >= 3, `${theory.slug} has enough concepts for initial screening`);
    assert.ok(content.applicable_topics.length >= 2 && content.inapplicable_topics.length >= 2, `${theory.slug} has fit boundaries`);
    assert.ok(content.misuse_risks.length >= 3, `${theory.slug} identifies misuse risks`);
    assert.ok(content.reading_path?.length && content.reading_path.length >= 1, `${theory.slug} has a reading path`);
    assert.ok((content.sources?.length ?? 0) >= 2 && sourceHosts.size >= 2, `${theory.slug} has independent L1 sources`);
    assert.deepEqual(verificationLevels, new Set(["L1", "L2", "L3"]), `${theory.slug} separates evidence levels`);
    assert.ok(d2OrD3Relation, `${theory.slug} relates to an existing D2 or D3 page`);
  }
});

test("the C5 works and concepts layer is source-complete, linked, and deduplicated", () => {
  const workSlugs = new Set(seedCorpus.works.map((work) => work.slug));
  const conceptSlugs = new Set(seedCorpus.concepts.map((concept) => concept.slug));
  const theorySlugs = new Set(seedCorpus.theories.map((theory) => theory.slug));

  assert.equal(seedCorpus.works.length, 19, "the reviewed first batch publishes only the 19 source-complete work candidates");
  assert.ok(seedCorpus.concepts.length >= 20 && seedCorpus.concepts.length <= 24, "the first concept layer is deliberately deduplicated");
  assert.equal(workSlugs.size, seedCorpus.works.length, "work candidates have unique slugs");
  assert.equal(conceptSlugs.size, seedCorpus.concepts.length, "concept candidates have unique slugs");

  for (const work of seedCorpus.works) {
    assert.ok(work.title.trim() && work.authors.length > 0 && work.year > 0, `${work.slug} has a bibliographic record`);
    assert.ok(isWorkContent(work.content.en), `${work.slug} has the full work content contract`);
  }
  for (const concept of seedCorpus.concepts) {
    assert.ok(concept.termEn.trim() && concept.definitionEn.trim(), `${concept.slug} has a precise definition`);
    assert.ok(isConceptContent(concept.content.en), `${concept.slug} has the full concept content contract`);
    assert.ok(concept.content.en.related_works.every((entry) => workSlugs.has(entry.work_slug)), `${concept.slug} links reviewed works`);
    assert.ok(concept.content.en.theory_variations.every((entry) => theorySlugs.has(entry.theory_slug)), `${concept.slug} links published theories`);
  }

  const relatedWorkSlugs = new Set(seedCorpus.concepts.flatMap((concept) => concept.content.en.related_works.map((entry) => entry.work_slug)));
  assert.deepEqual(relatedWorkSlugs, workSlugs, "every published work has at least one non-duplicative concept relation");
  const relationalResourceAccess = seedCorpus.concepts.find((concept) => concept.slug === "relational-resource-access");
  assert.ok(relationalResourceAccess && isConceptContent(relationalResourceAccess.content.en));
  assert.deepEqual(new Set(relationalResourceAccess.content.en.theory_variations.map((entry) => entry.relationship)), new Set(["Coleman and Lin formulations", "Bourdieu tradition"]), "the shared social-capital concept distinguishes its traditions");
  assert.deepEqual(new Set(relationalResourceAccess.content.en.related_works.map((entry) => entry.relationship)), new Set(["Core source work", "Coleman formulation", "Bourdieu tradition source"]), "the shared social-capital concept retains source-work qualifiers");

  assert.ok(new Set(seedCorpus.theoryWorks.map((entry) => entry.theorySlug)).size === 12, "every existing theory has at least one reviewed work relationship");
  assert.deepEqual(new Set(seedCorpus.theoryWorks.map((entry) => entry.workSlug)), workSlugs, "every work has a theory relationship");
  assert.equal(new Set(seedCorpus.theoryWorks.map((entry) => `${entry.theorySlug}:${entry.workSlug}`)).size, seedCorpus.theoryWorks.length, "theory-work relationships are unique");
  assert.ok(seedCorpus.theoryWorks.every((entry) => theorySlugs.has(entry.theorySlug) && workSlugs.has(entry.workSlug) && entry.sourceUrls.length > 0 && entry.evidenceNotesEn.trim()), "theory-work relationships are evidenced");
  assert.ok(seedCorpus.theoryWorks.some((entry) => entry.workSlug === "practice-capital-1986" && entry.theorySlug === "social-capital-theory" && entry.relationship === "tradition_source"), "Bourdieu's social-capital relation retains its tradition qualifier");
  assert.ok(seedCorpus.theoryWorks.some((entry) => entry.workSlug === "unesco-2020-inclusion-education" && entry.relationship === "institutional_context_source"), "the UNESCO report remains an institutional context source");
  assert.ok(seedCorpus.theoryWorks.some((entry) => entry.workSlug === "equity-sen-1992" && entry.relationship === "normative_resource"), "Sen remains a normative resource rather than a sole equity definition");
  assert.ok(seedCorpus.theoryConcepts.length >= seedCorpus.concepts.length, "every concept has at least one published theory relationship");
  assert.ok(seedCorpus.theoryConcepts.every((entry) => theorySlugs.has(entry.theorySlug) && conceptSlugs.has(entry.conceptSlug)), "theory-concept relationships resolve");
});

test("C5 detail routes render their audited content rather than generic placeholders", () => {
  for (const route of ["../src/app/works/[slug]/page.tsx", "../src/app/concepts/[slug]/page.tsx"]) {
    const source = readFileSync(new URL(route, import.meta.url), "utf8");
    assert.match(source, /sourceItemsForEntity/, `${route} passes verified sources to the page`);
    assert.doesNotMatch(source, /being prepared|Verification pending/i, `${route} has no generic placeholder copy`);
  }
});

test("the four existing scholar pages satisfy the C6 evidence and attribution contract", () => {
  const expectedSlugs = ["glen-h-elder-jr", "geert-kelchtermans", "anthony-giddens", "pierre-bourdieu"];
  const theorySlugs = new Set(seedCorpus.theories.map((theory) => theory.slug));
  const workSlugs = new Set(seedCorpus.works.map((work) => work.slug));

  assert.deepEqual(seedCorpus.scholars.map((scholar) => scholar.slug), expectedSlugs);
  for (const scholar of seedCorpus.scholars) {
    assert.ok(isScholarContent(scholar.content.en), `${scholar.slug} has a complete scholar profile`);
    assert.ok(scholar.content.en.theory_relationships.every((entry) => theorySlugs.has(entry.theory_slug)), `${scholar.slug} only relates published theories`);
    assert.ok(scholar.content.en.representative_works.every((entry) => !entry.work_slug || workSlugs.has(entry.work_slug)), `${scholar.slug} only links reviewed works`);
    assert.ok(scholar.content.en.attribution_boundaries.length > 0, `${scholar.slug} states an attribution boundary`);
    assert.deepEqual(new Set(scholar.content.en.verification.map((entry) => entry.evidence_level)), new Set(["L1", "L2", "L3"]), `${scholar.slug} separates L1/L2/L3`);
  }

  const source = readFileSync(new URL("../src/app/scholars/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(source, /isScholarContent/);
  assert.match(source, /sourceItemsForEntity/);
  assert.doesNotMatch(source, /being prepared|Verification pending/i);
});

test("C7 topics, disciplines, and fields provide sourced theory-selection pathways", () => {
  const roles = new Set(["primary", "supporting", "not_recommended"]);
  assert.equal(seedCorpus.topics.length, 4);
  assert.equal(seedCorpus.disciplines.length, 2);
  assert.equal(seedCorpus.fields.length, 6);

  for (const item of [...seedCorpus.topics, ...seedCorpus.disciplines, ...seedCorpus.fields]) {
    const content = item.content.en;
    assert.ok(content.question_categories.length >= 3, `${item.slug} classifies research questions`);
    assert.ok(content.selection_path.length >= 3, `${item.slug} provides a selection path`);
    assert.deepEqual(new Set(content.theory_pathways.map((pathway) => pathway.role)), roles, `${item.slug} distinguishes primary, supporting, and non-primary routes`);
    assert.ok(content.theory_pathways.every((pathway) => pathway.source_ids.length > 0 && pathway.data_materials.trim() && pathway.analysis_unit.trim() && pathway.limitations.trim()), `${item.slug} compares evidence needs and boundaries`);
    assert.ok(content.sources.length > 0 && content.verification.some((entry) => entry.evidence_level === "L1"), `${item.slug} publishes source-backed verification`);
  }
  for (const item of [...seedCorpus.disciplines, ...seedCorpus.fields]) {
    assert.deepEqual(new Set(item.content.en.entry_points.map((entry) => entry.entity_type).filter((type) => ["topic", "theory", "scholar", "work", "concept"].includes(type))), new Set(["topic", "theory", "scholar", "work", "concept"]), `${item.slug} provides all required entity entry types`);
  }

  for (const route of ["../src/app/topics/[slug]/page.tsx", "../src/app/disciplines/[slug]/page.tsx", "../src/app/fields/[slug]/page.tsx"]) {
    const source = readFileSync(new URL(route, import.meta.url), "utf8");
    assert.match(source, /pathwayContentFromPayload/, `${route} rejects malformed pathway content`);
    assert.match(source, /sourceItemsForEntity/, `${route} displays pathway sources`);
    assert.match(source, /PathwayContentSections/, `${route} renders the theory-selection path`);
    assert.doesNotMatch(source, /being prepared|Verification pending/i, `${route} has no C7 placeholder copy`);
  }
});
