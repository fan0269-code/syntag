import assert from "node:assert/strict";
import test from "node:test";

import { DatabaseUnavailableError } from "../src/lib/db.ts";
import { resolveHomeGraph } from "../src/lib/home-graph.ts";

const contentGraph = { nodes: [{ id: "real" }], edges: [] };
const sampleGraph = { nodes: [{ id: "sample" }], edges: [] };

test("production never substitutes a sample graph when data is unavailable", async () => {
  const result = await resolveHomeGraph(
    async () => { throw new DatabaseUnavailableError(); },
    sampleGraph,
    false,
  );

  assert.deepEqual(result, { kind: "unavailable" });
});

test("development uses an explicitly marked demo graph only when data is unavailable", async () => {
  const result = await resolveHomeGraph(
    async () => { throw new DatabaseUnavailableError(); },
    sampleGraph,
    true,
  );

  assert.deepEqual(result, { kind: "demo", graph: sampleGraph });
});

test("a missing published home graph is not represented as a production demo", async () => {
  const result = await resolveHomeGraph(async () => null, sampleGraph, false);

  assert.deepEqual(result, { kind: "empty" });
});

test("a loaded graph is returned as published content", async () => {
  const result = await resolveHomeGraph(async () => contentGraph, sampleGraph, false);

  assert.deepEqual(result, { kind: "content", graph: contentGraph });
});
