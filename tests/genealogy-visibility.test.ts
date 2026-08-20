import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  PUBLIC_GENEALOGY_RELATION_IDS,
  filterPublicGenealogyRelations,
  hasPublicGenealogyRelations,
  publicGenealogyRelationWhere,
} from "../src/lib/genealogy-visibility.ts";

test("temporary genealogy quarantine defaults to no public relation IDs", () => {
  assert.deepEqual(PUBLIC_GENEALOGY_RELATION_IDS, []);
  assert.deepEqual(publicGenealogyRelationWhere(), { id: { in: [] } });
  assert.equal(hasPublicGenealogyRelations(), false);
});

test("temporary genealogy quarantine filters every unapproved relation", () => {
  assert.deepEqual(filterPublicGenealogyRelations([
    { id: "life-course:teacher-life-history" },
    { id: "practice:structural" },
  ]), []);
});

test("theory pages keep quarantined genealogy prose out of the public surface", () => {
  const source = readFileSync("src/components/content/TheoryArticle.tsx", "utf8");

  assert.match(source, /const showPublicGenealogy = hasPublicGenealogyRelations\(\)/);
  assert.match(source, /Public genealogy relations are temporarily unavailable while evidence and human review are completed\./);
});
