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
    assert.equal(result.publishedScholarCount, 4);
    assert.equal(result.theoryScholarCount, 4);
    assert.equal(result.publishedTopicCount, 4);
    assert.equal(result.topicTheoryCount, 4);
    assert.equal(result.l1VerificationCount, 12);
    assert.equal(result.searchableTheoryCount, 12);
    assert.equal(result.searchableScholarCount, 4);
    assert.equal(result.searchableTopicCount, 4);
    assert.ok(result.identitySearchCount > 0);
    assert.ok(result.elderSearchCount > 0);
    assert.ok(result.transitionTopicSearchCount > 0);
  } finally {
    await db.$disconnect();
  }
});
