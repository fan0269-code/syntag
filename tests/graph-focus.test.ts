import assert from "node:assert/strict";
import test from "node:test";

import { graphFocusHref, graphHasFocusTarget } from "../src/lib/graph-focus.ts";

const nodes = [
  { id: "theory-life-course", data: { slug: "life-course-theory" } },
  { id: "scholar-elder", data: { slug: "glen-elder" } },
];

test("graph focus can target either a node id or a canonical slug", () => {
  assert.equal(graphHasFocusTarget(nodes, "theory-life-course"), true);
  assert.equal(graphHasFocusTarget(nodes, "life-course-theory"), true);
});

test("graph focus misses clearly when the node is outside the current graph", () => {
  assert.equal(graphHasFocusTarget(nodes, "topic-educational-transitions"), false);
  assert.equal(graphHasFocusTarget(nodes, null), false);
});

test("graph focus links travel through URL parameters", () => {
  assert.equal(
    graphFocusHref({ discipline: "sociology", mode: "topics", nodeId: "topic-educational-transitions" }),
    "/?discipline=sociology&mode=topics&focus=topic-educational-transitions",
  );
});
