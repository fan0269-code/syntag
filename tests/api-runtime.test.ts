import assert from "node:assert/strict";
import test from "node:test";

import { Prisma } from "@prisma/client";
import { createGraphGet, createSearchGet } from "../src/lib/api-runtime.ts";
import { DatabaseUnavailableError } from "../src/lib/db.ts";

async function responseBody(response: Response) {
  return response.json() as Promise<{ error: { code: string; message: string } }>;
}

test("graph rejects an unknown mode with a non-cacheable 400 response", async () => {
  const get = createGraphGet(async () => null);

  const response = await get(new Request("https://syrtag.test/api/graph?discipline=education&mode=unknown"));

  assert.equal(response.status, 400);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await responseBody(response), {
    error: { code: "INVALID_PARAM", message: "mode must be genealogy, scholars, or topics" },
  });
});

test("graph returns 404 when a published discipline is not found", async () => {
  const get = createGraphGet(async () => null);

  const response = await get(new Request("https://syrtag.test/api/graph?discipline=unknown"));

  assert.equal(response.status, 404);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await responseBody(response), {
    error: { code: "NOT_FOUND", message: "Discipline 'unknown' not found" },
  });
});

test("graph exposes database unavailability as a recoverable 503 response", async () => {
  const get = createGraphGet(async () => { throw new DatabaseUnavailableError(); });

  const response = await get(new Request("https://syrtag.test/api/graph?discipline=education"));

  assert.equal(response.status, 503);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await responseBody(response), {
    error: { code: "DATABASE_ERROR", message: "Data temporarily unavailable. Try again later." },
  });
});

test("graph only applies its public cache policy to successful content", async () => {
  const graph = { nodes: [{ id: "theory-1" }], edges: [], meta: { discipline: "Education" } };
  const get = createGraphGet(async () => graph);

  const response = await get(new Request("https://syrtag.test/api/graph?discipline=education"));

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "public, max-age=86400, stale-while-revalidate=3600");
  assert.deepEqual(await response.json(), graph);
});

test("graph keeps unexpected failures generic and non-cacheable", async () => {
  const get = createGraphGet(
    async () => { throw new Error("connection details must not reach the client"); },
    () => undefined,
  );

  const response = await get(new Request("https://syrtag.test/api/graph?discipline=education"));

  assert.equal(response.status, 500);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await responseBody(response), {
    error: { code: "INTERNAL_ERROR", message: "Unable to load graph data. Please try again." },
  });
});

test("search rejects an empty query with a non-cacheable 400 response", async () => {
  const get = createSearchGet(async () => ({}));

  const response = await get(new Request("https://syrtag.test/api/search?q=%20%20"));

  assert.equal(response.status, 400);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await responseBody(response), {
    error: { code: "INVALID_PARAM", message: "The q parameter is required" },
  });
});

test("search accepts concept and field as public searchable entity types", async () => {
  const seenTypes: string[] = [];
  const get = createSearchGet(async (_query, type) => {
    seenTypes.push(type);
    return { results: {} };
  });

  assert.equal((await get(new Request("https://syrtag.test/api/search?q=identity&type=concept"))).status, 200);
  assert.equal((await get(new Request("https://syrtag.test/api/search?q=identity&type=field"))).status, 200);
  assert.deepEqual(seenTypes, ["concept", "field"]);
});

test("search rejects unknown entity types with the current contract message", async () => {
  const get = createSearchGet(async () => ({}));

  const response = await get(new Request("https://syrtag.test/api/search?q=identity&type=framework"));

  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), {
    error: { code: "INVALID_PARAM", message: "type must be all, theory, scholar, work, topic, concept, or field" },
  });
});

test("search exposes database unavailability as a recoverable 503 response", async () => {
  const get = createSearchGet(async () => { throw new DatabaseUnavailableError(); });

  const response = await get(new Request("https://syrtag.test/api/search?q=identity"));

  assert.equal(response.status, 503);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await responseBody(response), {
    error: { code: "DATABASE_ERROR", message: "Data temporarily unavailable. Try again later." },
  });
});

test("search maps Prisma raw-query connection failures to a recoverable 503 response", async () => {
  const get = createSearchGet(async () => {
    throw new Prisma.PrismaClientUnknownRequestError("database connection lost", { clientVersion: "test" });
  });

  const response = await get(new Request("https://syrtag.test/api/search?q=identity"));

  assert.equal(response.status, 503);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await responseBody(response), {
    error: { code: "DATABASE_ERROR", message: "Data temporarily unavailable. Try again later." },
  });
});

test("search maps adapter connection failures without a Prisma P-code to a recoverable 503 response", async () => {
  const get = createSearchGet(async () => {
    throw new Prisma.PrismaClientKnownRequestError("database server unreachable", { code: "N/A", clientVersion: "test" });
  });

  const response = await get(new Request("https://syrtag.test/api/search?q=identity"));

  assert.equal(response.status, 503);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await responseBody(response), {
    error: { code: "DATABASE_ERROR", message: "Data temporarily unavailable. Try again later." },
  });
});

test("search classifies cross-module Prisma connection errors without relying on instanceof", async () => {
  const get = createSearchGet(async () => {
    const error = Object.assign(new Error("database server unreachable"), {
      name: "PrismaClientKnownRequestError",
      code: "N/A",
    });
    throw error;
  });

  const response = await get(new Request("https://syrtag.test/api/search?q=identity"));

  assert.equal(response.status, 503);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await responseBody(response), {
    error: { code: "DATABASE_ERROR", message: "Data temporarily unavailable. Try again later." },
  });
});

test("search treats an adapter Prisma connection error with hidden code as unavailable", async () => {
  const get = createSearchGet(async () => {
    const error = Object.assign(new Error("database server unreachable"), {
      name: "PrismaClientKnownRequestError",
    });
    throw error;
  });

  const response = await get(new Request("https://syrtag.test/api/search?q=identity"));

  assert.equal(response.status, 503);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await responseBody(response), {
    error: { code: "DATABASE_ERROR", message: "Data temporarily unavailable. Try again later." },
  });
});

test("search maps Prisma raw-query P2010 connection failures to a recoverable 503 response", async () => {
  const get = createSearchGet(async () => {
    throw new Prisma.PrismaClientKnownRequestError("raw query failed", { code: "P2010", clientVersion: "test" });
  });

  const response = await get(new Request("https://syrtag.test/api/search?q=identity"));

  assert.equal(response.status, 503);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await responseBody(response), {
    error: { code: "DATABASE_ERROR", message: "Data temporarily unavailable. Try again later." },
  });
});
