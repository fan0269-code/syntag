import assert from "node:assert/strict";
import test from "node:test";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { verifySeededDatabase } from "../src/lib/seed-verification.ts";

const connectionString = process.env.DATABASE_URL;

test("the local seed has the expected contracted corpus and fail-closed relations", { skip: !connectionString }, async () => {
  if (!connectionString) return;

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    const result = await verifySeededDatabase(db);

    assert.deepEqual(result.disciplineSlugs, []);
    assert.equal(result.publishedTheoryCount, 0);
    assert.equal(result.fieldCount, 0);
    assert.equal(result.disciplineTheoryCount, 15);
    assert.equal(result.fieldTheoryCount, 8);
    assert.equal(result.genealogyCount, 0);
    assert.equal(result.publishedScholarCount, 0);
    assert.equal(result.theoryScholarCount, 0);
    assert.equal(result.totalScholarCount, 10);
    assert.equal(result.totalTheoryScholarCount, 7);
    assert.equal(result.publishedTopicCount, 0);
    assert.equal(result.publishedWorkCount, 0);
    assert.equal(result.publishedConceptCount, 0);
    assert.equal(result.archivedFAN247.length, 58);
    assert.deepEqual(
      Object.fromEntries(
        ["discipline", "field", "theory", "work", "concept", "scholar", "topic"].map((entityType) => [
          entityType,
          result.archivedFAN247.filter((row) => row.entityType === entityType).length,
        ]),
      ),
      { discipline: 2, field: 6, theory: 12, work: 18, concept: 9, scholar: 7, topic: 4 },
    );
    assert.ok(result.archivedFAN247.every((row) => row.status === "archived" && row.publishedAt === null));
    assert.deepEqual(result.archivedU3Works, [
      { slug: "equity-sen-1992", status: "archived", publishedAt: null },
    ]);
    assert.deepEqual(result.archivedU3Concepts, [
      { slug: "duality-of-structure", status: "archived", publishedAt: null },
      { slug: "field", status: "archived", publishedAt: null },
      { slug: "habitus", status: "archived", publishedAt: null },
      { slug: "institutional-isomorphism", status: "archived", publishedAt: null },
      { slug: "mutual-engagement", status: "archived", publishedAt: null },
      { slug: "professional-learning", status: "archived", publishedAt: null },
      { slug: "recursive-practice", status: "archived", publishedAt: null },
      { slug: "rules-and-resources", status: "archived", publishedAt: null },
      { slug: "shared-repertoire", status: "archived", publishedAt: null },
      { slug: "symbolic-power", status: "archived", publishedAt: null },
      { slug: "teacher-professional-identity", status: "archived", publishedAt: null },
      { slug: "teacher-self-understanding", status: "archived", publishedAt: null },
      { slug: "trajectory", status: "archived", publishedAt: null },
      { slug: "transition", status: "archived", publishedAt: null },
      { slug: "turning-point", status: "archived", publishedAt: null },
    ]);
    assert.equal(result.topicTheoryCount, 0);
    assert.equal(result.totalTopicCount, 8);
    assert.equal(result.totalTopicTheoryCount, 24);
    assert.deepEqual(result.enrichmentTopicStatuses, [
      { slug: "access-to-educational-support-and-opportunity", status: "draft" },
      { slug: "communities-of-practice-in-teacher-learning", status: "draft" },
      { slug: "education-policy-implementation-frontline-discretion", status: "draft" },
      { slug: "teacher-professional-learning-and-change", status: "draft" },
    ]);
    assert.deepEqual(result.enrichmentScholarStatuses, [
      { slug: "etienne-wenger", status: "archived" },
      { slug: "jean-lave", status: "archived" },
      { slug: "john-w-kingdon", status: "draft" },
      { slug: "michael-lipsky", status: "archived" },
    ]);
    assert.deepEqual(result.secondScholarStatuses, [
      { slug: "christopher-day", status: "draft" },
      { slug: "ivor-f-goodson", status: "draft" },
    ]);
    assert.equal(
      await db.theoryScholar.count({
        where: {
          OR: [
            {
              theory: { slug: "multiple-streams-framework" },
              scholar: { slug: "john-w-kingdon" },
            },
            {
              theory: { slug: "teacher-life-history-research" },
              scholar: { slug: "ivor-f-goodson" },
            },
            {
              theory: { slug: "teacher-professional-development-theory" },
              scholar: { slug: "christopher-day" },
            },
          ],
        },
      }),
      0,
      "retired draft-scholar relations stay out of the canonical database graph",
    );
    assert.equal(result.legacySourceMetadataCount, 12);
    assert.equal(result.searchableTheoryCount, 0);
    assert.equal(result.searchableScholarCount, 0);
    assert.equal(result.searchableTopicCount, 0);
    assert.equal(result.identitySearchCount, 0);
    assert.equal(result.elderSearchCount, 0);
    assert.equal(result.transitionTopicSearchCount, 0);

    const lifeCourse = await db.theory.findUnique({
      where: { slug: "life-course-theory" },
      select: { id: true, contentJsonb: true },
    });
    assert.ok(lifeCourse, "the seeded Life Course theory exists");
    const lifeCourseContent = lifeCourse.contentJsonb as {
      en?: { sources?: Array<{ id?: string }> };
    };
    assert.deepEqual(
      lifeCourseContent.en?.sources?.slice(-3).map((source) => source.id),
      [
        "elder-1996-human-lives-changing-societies",
        "elder-2000-life-course-theory-encyclopedia",
        "elder-1999-children-of-the-great-depression-25th",
      ],
    );

    const sourceVerification = await db.verification.findUnique({
      where: {
        entityType_entityId_fieldPath: {
          entityType: "theory",
          entityId: lifeCourse.id,
          fieldPath: "content_jsonb.en.sources",
        },
      },
    });
    assert.equal(sourceVerification?.verifiedAt, null);

    const lifeCourseTopicRelation = await db.topicTheory.findFirst({
      where: {
        topic: { slug: "educational-transitions-over-time", status: "published" },
        theory: { slug: "life-course-theory", status: "published" },
      },
      select: {
        suitability: true,
        recommendation: true,
        suitabilityNotesEn: true,
        riskNotesEn: true,
      },
    });
    assert.equal(lifeCourseTopicRelation, null);
  } finally {
    await db.$disconnect();
  }
});
