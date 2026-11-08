import assert from "node:assert/strict";
import test from "node:test";

import { seedCorpus } from "../src/data/seed-content.ts";
import { isFAN247Archived } from "../src/lib/fan247-visibility.ts";

const lifeCourse = seedCorpus.theories.find((theory) => theory.slug === "life-course-theory");
const elderWork = seedCorpus.works.find((work) => work.slug === "elder-1998-life-course");
const elderScholar = seedCorpus.scholars.find((scholar) => scholar.slug === "glen-h-elder-jr");
const transitionsTopic = seedCorpus.topics.find((topic) => topic.slug === "educational-transitions-over-time");

test("F0 Life Course cluster stays FAN-247 archived until human U3 release", () => {
  assert.ok(lifeCourse);
  assert.ok(elderWork);
  assert.ok(elderScholar);
  assert.ok(transitionsTopic);

  for (const [type, slug] of [
    ["theory", "life-course-theory"],
    ["work", "elder-1998-life-course"],
    ["scholar", "glen-h-elder-jr"],
    ["topic", "educational-transitions-over-time"],
  ] as const) {
    assert.equal(isFAN247Archived(type, slug), true, `${slug} remains on the FAN-247 archive list`);
  }

  assert.equal(lifeCourse.status, "archived");
  assert.equal(elderWork.status, "archived");
  assert.equal(elderScholar.status, "archived");
  assert.equal(transitionsTopic.status, "archived");
  assert.equal(seedCorpus.theories.filter((theory) => theory.status === "published").length, 0);
});

test("F0 narrowed Life Course page omits blocker-only principle and Mayer/Alwin inventory", () => {
  assert.ok(lifeCourse);
  const content = lifeCourse.content.en;
  assert.ok(content.sources);
  assert.ok(content.key_scholars);
  assert.ok(content.verification);
  const text = JSON.stringify(content);
  const sourceIds = content.sources.map((source) => source.id);
  const scholarNames = content.key_scholars.map((entry) => entry.name);
  const conceptNames = content.core_concepts.map((entry) => entry.name);

  assert.ok(!sourceIds.includes("mayer-2009-new-directions"));
  assert.ok(!sourceIds.includes("alwin-2012-life-course-concepts"));
  assert.ok(!scholarNames.some((name) => /Mayer|Alwin/i.test(name)));
  assert.ok(!conceptNames.includes("Linked lives"));
  assert.ok(!conceptNames.includes("Time and place"));
  assert.ok(!/articulated life-span development, time and place, timing, linked lives, and agency/i.test(text));
  assert.ok(
    content.misuse_risks.some((risk) => /five-principle inventories/i.test(risk)),
    "misuse risks still warn against importing unverified five-principle inventories",
  );
  assert.ok(conceptNames.includes("Historical context of lives"));
  assert.ok(conceptNames.includes("Pathway variability"));
  assert.ok(
    content.verification.some(
      (entry) =>
        entry.evidence_level === "L1"
        && entry.source_id === "elder-1998-life-course"
        && entry.verifiedAt === "2026-11-08T00:00:00.000Z",
    ),
  );
});

test("F0 topic pathway keeps risk review pending and avoids unpublished concept entry dependence", () => {
  assert.ok(transitionsTopic);
  const entryTypes = new Set(transitionsTopic.content.en.entry_points.map((entry) => entry.entity_type));
  assert.ok(entryTypes.has("theory"));
  assert.ok(entryTypes.has("work"));
  assert.ok(entryTypes.has("scholar"));
  assert.ok(!entryTypes.has("concept"));

  const primaryRelation = seedCorpus.topicTheories.find(
    (relation) =>
      relation.topicSlug === "educational-transitions-over-time"
      && relation.theorySlug === "life-course-theory",
  );
  assert.ok(primaryRelation);
  assert.equal(primaryRelation.riskReview?.reviewDecision, "pending_review");
  assert.equal(primaryRelation.riskNotesEn, undefined);
});
