import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { DatabaseUnavailableError } from "../src/lib/db.ts";
import {
  catalogVisibleCopy,
  type HomeCatalogItem,
  type HomeCatalogLists,
} from "../src/lib/home-catalog.ts";
import { loadHomePageState } from "../src/lib/home-page-state.ts";

const emptyGraphCopy = /The knowledge graph is not published yet|No published graph is available yet/;

const sampleGraph = { nodes: [{ id: "sample" }], edges: [] };
const contentGraph = { nodes: [{ id: "real" }], edges: [] };

function item(slug: string, title: string, summary = "Published record."): HomeCatalogItem {
  return { slug, title, summary, tags: ["Published"] };
}

const publishedCatalog: HomeCatalogLists = {
  theories: [
    item("teacher-professional-identity", "Teacher professional identity"),
    item("communities-of-practice-1998", "Communities of practice"),
    item("situated-learning-legitimate-peripheral-participation", "Situated learning"),
    item("life-course-perspective", "Life course perspective"),
  ],
  scholars: [
    item("douwe-beijaard", "Douwe Beijaard"),
    item("etienne-wenger-flagship", "Etienne Wenger"),
    item("glen-h-elder-jr-flagship", "Glen H. Elder, Jr."),
  ],
  works: [
    item("beijaard-meijer-verloop-2004-reconsidering", "Reconsidering research on teachers' professional identity"),
  ],
};

const publishedHrefs = [
  "/theories/teacher-professional-identity",
  "/theories/communities-of-practice-1998",
  "/theories/situated-learning-legitimate-peripheral-participation",
  "/theories/life-course-perspective",
  "/scholars/douwe-beijaard",
  "/scholars/etienne-wenger-flagship",
  "/scholars/glen-h-elder-jr-flagship",
  "/works/beijaard-meijer-verloop-2004-reconsidering",
];

function loaders(catalog: HomeCatalogLists) {
  return {
    loadTheories: async () => catalog.theories,
    loadScholars: async () => catalog.scholars,
    loadWorks: async () => catalog.works,
  };
}

test("homepage lists published theories, scholars, and works when the discipline graph is empty", async () => {
  const surface = await loadHomePageState({
    loadGraph: async () => null,
    ...loaders(publishedCatalog),
    sampleGraph,
    allowDemo: false,
  });

  assert.equal(surface.kind, "catalog");
  if (surface.kind !== "catalog") return;

  const visible = catalogVisibleCopy(surface.catalog);
  assert.match(visible, /Published theories, scholars, and works/);
  assert.doesNotMatch(visible, emptyGraphCopy);
  for (const href of publishedHrefs) assert.match(visible, new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(visible, /\/theories/);
  assert.match(visible, /\/scholars/);
  assert.match(visible, /\/works/);
  assert.doesNotMatch(visible, /\/disciplines\/|\/fields\/|\/topics\/|\/concepts\//);
});

test("homepage catalog follows whatever theories, scholars, and works are published", async () => {
  const surface = await loadHomePageState({
    loadGraph: async () => null,
    ...loaders({
      theories: [item("another-published-theory", "Another published theory")],
      scholars: [],
      works: [item("another-published-work", "Another published work")],
    }),
    sampleGraph,
    allowDemo: false,
  });

  assert.equal(surface.kind, "catalog");
  if (surface.kind !== "catalog") return;

  const visible = catalogVisibleCopy(surface.catalog);
  assert.match(visible, /Published theories and works/);
  assert.match(visible, /\/theories\/another-published-theory/);
  assert.match(visible, /\/works\/another-published-work/);
  assert.doesNotMatch(visible, /Scholars/);
  assert.doesNotMatch(visible, /teacher-professional-identity|douwe-beijaard/);
  assert.doesNotMatch(visible, emptyGraphCopy);
});

test("empty-graph copy stays away when only theories are published and the other graph layers are empty", async () => {
  const surface = await loadHomePageState({
    loadGraph: async () => null,
    ...loaders({
      theories: [item("teacher-professional-identity", "Teacher professional identity")],
      scholars: [],
      works: [],
    }),
    sampleGraph,
    allowDemo: true,
  });

  assert.equal(surface.kind, "catalog");
  if (surface.kind !== "catalog") return;
  assert.equal(catalogVisibleCopy(surface.catalog).includes("The knowledge graph is not published yet"), false);
  assert.match(catalogVisibleCopy(surface.catalog), /Published theories\n/);
  assert.doesNotMatch(catalogVisibleCopy(surface.catalog), /Published theories, scholars/);
});

test("an empty theory, scholar, and work catalog keeps the honest empty state", async () => {
  const surface = await loadHomePageState({
    loadGraph: async () => null,
    ...loaders({ theories: [], scholars: [], works: [] }),
    sampleGraph,
    allowDemo: false,
  });

  assert.deepEqual(surface, { kind: "empty" });
});

test("a database outage stays unavailable instead of claiming the catalog is empty or published", async () => {
  const surface = await loadHomePageState({
    loadGraph: async () => { throw new DatabaseUnavailableError(); },
    loadTheories: async () => { throw new DatabaseUnavailableError(); },
    loadScholars: async () => { throw new DatabaseUnavailableError(); },
    loadWorks: async () => { throw new DatabaseUnavailableError(); },
    sampleGraph,
    allowDemo: false,
  });

  assert.deepEqual(surface, { kind: "unavailable" });
});

test("development demo does not replace published theories, scholars, or works", async () => {
  const surface = await loadHomePageState({
    loadGraph: async () => null,
    ...loaders(publishedCatalog),
    sampleGraph,
    allowDemo: true,
  });

  assert.equal(surface.kind, "catalog");
});

test("development still uses the demo graph when nothing is published and the database is down", async () => {
  const surface = await loadHomePageState({
    loadGraph: async () => { throw new DatabaseUnavailableError(); },
    loadTheories: async () => { throw new DatabaseUnavailableError(); },
    loadScholars: async () => { throw new DatabaseUnavailableError(); },
    loadWorks: async () => { throw new DatabaseUnavailableError(); },
    sampleGraph,
    allowDemo: true,
  });

  assert.deepEqual(surface, { kind: "demo", graph: sampleGraph });
});

test("a loaded discipline graph remains available and still carries published catalog links", async () => {
  const surface = await loadHomePageState({
    loadGraph: async () => contentGraph,
    ...loaders(publishedCatalog),
    sampleGraph,
    allowDemo: false,
  });

  assert.equal(surface.kind, "graph");
  if (surface.kind !== "graph") return;
  assert.equal(surface.graph, contentGraph);
  assert.match(catalogVisibleCopy(surface.catalog), /\/scholars\/douwe-beijaard/);
  assert.doesNotMatch(catalogVisibleCopy(surface.catalog), emptyGraphCopy);
});

test("homepage source lists published indexes and does not hardcode the current eight slugs", () => {
  const home = readFileSync("src/app/page.tsx", "utf8");
  const catalog = readFileSync("src/components/home/HomeCatalogExperience.tsx", "utf8");
  const lists = readFileSync("src/components/home/HomePublishedLists.tsx", "utf8");
  const copy = readFileSync("src/lib/home-catalog.ts", "utf8");

  assert.match(home, /getPublishedIndex\("theory"\)/);
  assert.match(home, /getPublishedIndex\("scholar"\)/);
  assert.match(home, /getPublishedIndex\("work"\)/);
  assert.match(home, /surface\.kind === "catalog"/);
  assert.match(home, /<HomeCatalogExperience catalog=\{surface\.catalog\} \/>/);
  assert.match(home, /<HomePublishedLists catalog=\{surface\.catalog\} \/>/);
  assert.doesNotMatch(home, /getPublishedIndex\("(discipline|field|topic|concept)"\)/);
  assert.doesNotMatch([home, catalog, lists, copy].join("\n"), /teacher-professional-identity|douwe-beijaard|beijaard-meijer-verloop/);
  assert.doesNotMatch([catalog, lists, copy].join("\n"), emptyGraphCopy);
  assert.match(home, /The knowledge graph is not published yet/);
  assert.match(home, /No published graph is available yet/);
});
