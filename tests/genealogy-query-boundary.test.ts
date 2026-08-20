import assert from "node:assert/strict";
import test from "node:test";

import { getTheoryBySlugForDb } from "../src/lib/entities/theories.ts";
import { getInternalLinksForDb } from "../src/lib/internal-links.ts";

const unapprovedSourceRelation = {
  id: "life-course:teacher-identity",
  targetTheory: {
    id: "theory-identity",
    slug: "teacher-identity-theory",
    titleEn: "Teacher Identity Theory",
    status: "published",
  },
  keyScholar: null,
  keyWork: null,
};

const unapprovedTargetRelation = {
  id: "life-course:teacher-life-history",
  sourceTheory: {
    id: "theory-life-course",
    slug: "life-course-theory",
    titleEn: "Life Course Theory",
    status: "published",
  },
  keyScholar: null,
  keyWork: null,
};

test("theory detail query excludes genealogy relations outside the public allowlist", async () => {
  let query: Record<string, unknown> | undefined;
  const db = {
    theory: {
      findFirst: async (input: Record<string, unknown>) => {
        query = input;
        return {
          id: "theory-life-course",
          slug: "life-course-theory",
          status: "published",
          scholars: [],
          works: [],
          concepts: [],
          fields: [],
          topics: [],
          sourceRelations: [unapprovedSourceRelation],
          targetRelations: [unapprovedTargetRelation],
        };
      },
    },
  };

  const theory = await getTheoryBySlugForDb(db as never, "life-course-theory");

  assert.deepEqual(theory?.sourceRelations, []);
  assert.deepEqual(theory?.targetRelations, []);
  assert.deepEqual(
    (query?.include as { sourceRelations: { where: unknown } }).sourceRelations.where,
    { id: { in: [] }, targetTheory: { status: "published" } },
  );
  assert.deepEqual(
    (query?.include as { targetRelations: { where: unknown } }).targetRelations.where,
    { id: { in: [] }, sourceTheory: { status: "published" } },
  );
});

test("internal links omit genealogy relations returned outside the public allowlist", async () => {
  let query: Record<string, unknown> | undefined;
  const db = {
    theory: {
      findFirst: async (input: Record<string, unknown>) => {
        query = input;
        return {
          scholars: [],
          topics: [],
          sourceRelations: [unapprovedSourceRelation],
          targetRelations: [unapprovedTargetRelation],
        };
      },
    },
  };

  const links = await getInternalLinksForDb(db as never, "theory", "life-course-theory");

  assert.deepEqual(links, []);
  assert.deepEqual(
    (query?.include as { sourceRelations: { where: unknown } }).sourceRelations.where,
    { id: { in: [] }, targetTheory: { status: "published" } },
  );
  assert.deepEqual(
    (query?.include as { targetRelations: { where: unknown } }).targetRelations.where,
    { id: { in: [] }, sourceTheory: { status: "published" } },
  );
});
