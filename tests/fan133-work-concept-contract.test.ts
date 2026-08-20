import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { join } from "node:path";
import { seedCorpus } from "./helpers/public-seed-corpus.ts";
import { FAN_133_U3_ARCHIVED_CONCEPT_SLUGS, FAN_133_U3_ARCHIVED_WORK_SLUGS } from "../src/lib/u3-visibility.ts";
import { validateSeedCorpus } from "../src/lib/content-validation.ts";

const root = join(import.meta.dirname, "..");
const claimPack = readFileSync(join(root, "docs/research/2026-08-14-FAN-121-work-concept-atomic-claim-pack.md"), "utf8");
const u3Pack = readFileSync(join(root, "docs/research/2026-08-14-FAN-133-u3-visibility-decision-rows.md"), "utf8");

function rowsStartingWith(source: string, prefix: string) {
  return source.split("\n").filter((line) => line.startsWith(prefix));
}

test("FAN-133 preserves the 479 claim contract and materializes 16 separate U3 rows", () => {
  const claimRows = rowsStartingWith(claimPack, "| `fan121:");
  const claimIds = claimRows.map((row) => row.match(/^\| `([^`]+)`/)?.[1]).filter(Boolean);
  assert.equal(claimRows.length, 479);
  assert.equal(new Set(claimIds).size, 479);
  assert.equal(rowsStartingWith(claimPack, "| ").filter((row) => row.includes("| ready_for_human_review |" )).length, 193);
  assert.equal(rowsStartingWith(claimPack, "| ").filter((row) => row.includes("| blocker_only_omission | lawful_substantive_locator_required |" )).length, 286);
  assert.match(claimPack, /\| PASS \| U3 decision rows \| 16\/16 stable independent rows; proposals only \|/);

  const u3Rows = rowsStartingWith(u3Pack, "| `fan133:u3:");
  const u3Ids = u3Rows.map((row) => row.match(/^\| `([^`]+)`/)?.[1]).filter(Boolean);
  assert.equal(u3Rows.length, 16);
  assert.equal(new Set(u3Ids).size, 16);
  for (const row of u3Rows) {
    assert.match(row, /status = "published"/);
    assert.match(row, /status = "archived"/);
    assert.match(row, /Proposal only; no hide or status change executed/);
    assert.match(row, /owner_decision=pending/);
    assert.match(row, /reviewer_identity=not_assigned/);
    assert.match(row, /separate pending gate/);
    assert.match(row, /\/(?:works|concepts)\//);
  }
});

test("FAN-124 applies only the 16 CEO-approved U3 archive rows", () => {
  const archivedWorks = seedCorpus.works.filter((record) => record.status === "archived");
  const archivedConcepts = seedCorpus.concepts.filter((record) => record.status === "archived");

  assert.deepEqual(archivedWorks.map((record) => record.slug), [...FAN_133_U3_ARCHIVED_WORK_SLUGS]);
  assert.deepEqual(archivedConcepts.map((record) => record.slug), [...FAN_133_U3_ARCHIVED_CONCEPT_SLUGS]);
  assert.equal(archivedWorks.length + archivedConcepts.length, 16);
  assert.ok([...archivedWorks, ...archivedConcepts].every((record) => record.publishedAt === undefined));
  assert.equal(validateSeedCorpus(seedCorpus).errors.length, 0);
});

test("FAN-124 removes archived U3 entities from public evidence links", () => {
  const pathwaySource = readFileSync(join(root, "src/components/content/PathwayContentSections.tsx"), "utf8");
  const conceptPageSource = readFileSync(join(root, "src/app/concepts/[slug]/page.tsx"), "utf8");

  assert.match(pathwaySource, /isFAN133U3Archived/);
  assert.match(pathwaySource, /content\.entry_points\.filter/);
  assert.match(conceptPageSource, /content\.related_works\.filter/);
  assert.match(conceptPageSource, /isFAN133U3Archived\("work", entry\.work_slug\)/);
});
