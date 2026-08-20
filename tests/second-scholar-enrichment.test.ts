import assert from "node:assert/strict";
import test from "node:test";
import { seedCorpus } from "./helpers/public-seed-corpus.ts";
import { isScholarContent } from "../src/data/templates/scholar-template.ts";

const draftScholarCases = [
  {
    slug: "ivor-f-goodson",
    name: "Ivor F. Goodson",
    theorySlug: "teacher-life-history-research",
    workSlug: "goodson-2013-narrative-theory",
    identitySourceId: "goodson-brighton-2018-profile",
    relationSourceId: "goodson-2013-narrative-theory",
    collaborationSourceId: "teacher-life-history-goodson-sikes-2001",
  },
  {
    slug: "christopher-day",
    name: "Christopher Day",
    theorySlug: "teacher-professional-development-theory",
    workSlug: "day-1999-developing-teachers",
    identitySourceId: "day-nottingham-profile",
    relationSourceId: "day-1999-developing-teachers",
    collaborationSourceId: "teacher-development-day-etal-2006",
  },
] as const;

test("the second scholar enrichment adds bounded draft-only profiles", () => {
  for (const entry of draftScholarCases) {
    const scholar = seedCorpus.scholars.find((candidate) => candidate.slug === entry.slug);

    assert.ok(scholar, `${entry.slug} exists`);
    assert.equal(scholar.status, "draft");
    assert.equal(scholar.publishedAt, undefined);
    assert.ok(isScholarContent(scholar.content.en));
    assert.equal(scholar.name, entry.name);
    assert.ok(scholar.content.en.sources.some((source) => source.id === entry.identitySourceId));
    assert.ok(scholar.content.en.representative_works.some((work) => work.work_slug === entry.workSlug));
    assert.deepEqual(
      scholar.content.en.theory_relationships.map((relation) => relation.theory_slug),
      [entry.theorySlug],
    );
    const contentTheoryRelationship = scholar.content.en.theory_relationships[0];
    assert.ok(contentTheoryRelationship.source_ids.includes(entry.relationSourceId));
    assert.ok(scholar.content.en.scholarly_relations.some((relation) => relation.source_ids.includes(entry.collaborationSourceId)));
    assert.ok(scholar.content.en.attribution_boundaries.length >= 2);
    assert.doesNotMatch(JSON.stringify(scholar.content.en), /sole founder|father of|founded the theory/i);

    const canonicalRelation = seedCorpus.theoryScholars.find(
      (candidate) => candidate.scholarSlug === entry.slug && candidate.theorySlug === entry.theorySlug,
    );

    assert.equal(
      canonicalRelation,
      undefined,
      `${entry.slug} stays in draft authoring content without a canonical TheoryScholar relation`,
    );
  }

  assert.equal(seedCorpus.scholars.filter((scholar) => scholar.status === "published").length, 7);
  assert.equal(seedCorpus.theoryScholars.filter((relation) => {
    const scholar = seedCorpus.scholars.find((candidate) => candidate.slug === relation.scholarSlug);
    const theory = seedCorpus.theories.find((candidate) => candidate.slug === relation.theorySlug);
    return scholar?.status === "published" && theory?.status === "published";
  }).length, 7);
});
