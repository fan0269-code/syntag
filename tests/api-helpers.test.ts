import assert from "node:assert/strict";
import test from "node:test";

import { apiError, parseLimit, parseMode, parseSearchType } from "../src/lib/api.ts";
import { createPrismaClient } from "../src/lib/db.ts";

test("parseMode defaults to genealogy and rejects unknown modes", () => {
  assert.equal(parseMode(null), "genealogy");
  assert.equal(parseMode("scholars"), "scholars");
  assert.equal(parseMode("unknown"), null);
});

test("parseLimit clamps a requested limit to the API maximum", () => {
  assert.equal(parseLimit(null), 10);
  assert.equal(parseLimit("25"), 25);
  assert.equal(parseLimit("500"), 50);
  assert.equal(parseLimit("zero"), null);
});

test("parseSearchType covers all public searchable entity contracts", () => {
  assert.equal(parseSearchType(null), "all");
  assert.equal(parseSearchType("theory"), "theory");
  assert.equal(parseSearchType("scholar"), "scholar");
  assert.equal(parseSearchType("work"), "work");
  assert.equal(parseSearchType("topic"), "topic");
  assert.equal(parseSearchType("concept"), "concept");
  assert.equal(parseSearchType("field"), "field");
  assert.equal(parseSearchType("framework"), null);
});

test("apiError never includes implementation details in its JSON body", async () => {
  const response = apiError("DATABASE_ERROR", "Database unavailable", 503);

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    error: { code: "DATABASE_ERROR", message: "Database unavailable" },
  });
});

test("missing DATABASE_URL becomes a database-unavailable condition", () => {
  assert.equal(createPrismaClient(""), undefined);
});
