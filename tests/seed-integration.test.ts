import assert from "node:assert/strict";
import test from "node:test";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { verifySeededDatabase } from "../src/lib/seed-verification.ts";

const connectionString = process.env.DATABASE_URL;

test("the local seed has the expected published corpus and queryable relations", { skip: !connectionString }, async () => {
  if (!connectionString) return;

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    const result = await verifySeededDatabase(db);

    assert.deepEqual(result.disciplineSlugs, ["education", "sociology"]);
    assert.equal(result.publishedTheoryCount, 12);
    assert.equal(result.fieldCount, 6);
    assert.equal(result.disciplineTheoryCount, 15);
    assert.equal(result.fieldTheoryCount, 8);
    assert.equal(result.genealogyCount, 8);
    assert.equal(result.publishedScholarCount, 7);
    assert.equal(result.theoryScholarCount, 7);
    assert.equal(result.totalScholarCount, 10);
    assert.equal(result.totalTheoryScholarCount, 10);
    assert.equal(result.publishedTopicCount, 4);
    assert.equal(result.topicTheoryCount, 12);
    assert.equal(result.totalTopicCount, 8);
    assert.equal(result.totalTopicTheoryCount, 24);
    assert.deepEqual(result.enrichmentTopicStatuses, [
      { slug: "access-to-educational-support-and-opportunity", status: "draft" },
      { slug: "communities-of-practice-in-teacher-learning", status: "draft" },
      { slug: "education-policy-implementation-frontline-discretion", status: "draft" },
      { slug: "teacher-professional-learning-and-change", status: "draft" },
    ]);
    assert.deepEqual(result.enrichmentScholarStatuses, [
      { slug: "etienne-wenger", status: "published" },
      { slug: "jean-lave", status: "published" },
      { slug: "john-w-kingdon", status: "draft" },
      { slug: "michael-lipsky", status: "published" },
    ]);
    assert.deepEqual(result.secondScholarStatuses, [
      { slug: "christopher-day", status: "draft" },
      { slug: "ivor-f-goodson", status: "draft" },
    ]);
    assert.equal(result.l1VerificationCount, 12);
    assert.equal(result.searchableTheoryCount, 12);
    assert.equal(result.searchableScholarCount, 7);
    assert.equal(result.searchableTopicCount, 4);
    assert.ok(result.identitySearchCount > 0);
    assert.ok(result.elderSearchCount > 0);
    assert.ok(result.transitionTopicSearchCount > 0);
  } finally {
    await db.$disconnect();
  }
});
