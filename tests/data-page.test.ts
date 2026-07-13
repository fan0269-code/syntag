import assert from "node:assert/strict";
import test from "node:test";

import { DatabaseUnavailableError } from "../src/lib/db.ts";
import { DATA_UNAVAILABLE, loadDataPage } from "../src/lib/data-page.ts";

test("data pages receive an explicit unavailable state when the database cannot be reached", async () => {
  const result = await loadDataPage(async () => { throw new DatabaseUnavailableError(); });

  assert.equal(result, DATA_UNAVAILABLE);
});

test("data pages preserve a missing entity as a distinct null result", async () => {
  const result = await loadDataPage(async () => null);

  assert.equal(result, null);
});

test("data pages rethrow unexpected failures for the generic server error boundary", async () => {
  await assert.rejects(
    () => loadDataPage(async () => { throw new Error("unexpected"); }),
    /unexpected/,
  );
});
