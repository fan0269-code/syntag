import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("detail DTO queries exclude non-published nested entities", () => {
  const theories = read("src/lib/entities/theories.ts");
  for (const relation of ["scholar", "work", "concept", "field", "topic", "targetTheory", "sourceTheory"]) {
    assert.match(theories, new RegExp(`${relation}: \\{ status: published`));
  }
  assert.match(read("src/lib/entities/works.ts"), /theory: \{ status: published \}/);
  assert.match(read("src/lib/entities/concepts.ts"), /theory: \{ status: "published" \}/);
  assert.match(read("src/lib/entities/scholars.ts"), /targetScholar: \{ status: published \}/);
  assert.match(read("src/lib/entities/topics.ts"), /theory: \{ status: published \}/);
});

test("graph, internal links, static params, sitemap, and search keep published-only boundaries", () => {
  assert.match(read("src/lib/graph-data.ts"), /concept: \{ status: published \}/);
  assert.match(read("src/lib/internal-links.ts"), /targetTheory: \{ status: published \}/);
  assert.match(read("src/lib/static-params.ts"), /where: \{ status: "published" \}/);
  assert.match(read("src/app/sitemap.ts"), /where: \{ status: published \}/);
  assert.match(read("src/lib/search.ts"), /status = 'published'/);
});
