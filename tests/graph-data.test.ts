import assert from "node:assert/strict";
import test from "node:test";

import { getGraphDataForDb } from "../src/lib/graph-data.ts";

const education = { id: "discipline-education", slug: "education", titleEn: "Education" };
const sociology = { id: "discipline-sociology", slug: "sociology", titleEn: "Sociology" };
const theories = [
  {
    id: "theory-life-course",
    slug: "life-course-theory",
    titleEn: "Life Course Theory",
    summaryEn: "Biographies unfold through time and linked lives.",
    depth: "D3",
    scholars: [{ scholarId: "scholar-elder" }],
    concepts: [{ concept: { termEn: "Linked lives", status: "published" } }],
  },
  {
    id: "theory-identity",
    slug: "teacher-identity-theory",
    titleEn: "Teacher Identity Theory",
    summaryEn: "Teachers negotiate professional selves.",
    depth: "D3",
    scholars: [{ scholarId: "scholar-kelchtermans" }],
    concepts: [{ concept: { termEn: "Professional self-understanding", status: "published" } }],
  },
];

function fakeDb() {
  return {
    discipline: {
      findMany: async () => [education, sociology],
      findFirst: async ({ where }: { where: { slug: string } }) => (where.slug === "education" ? education : null),
    },
    theory: {
      findMany: async () => theories,
    },
    theoryGenealogy: {
      findMany: async () => [{
        id: "genealogy-1",
        sourceTheoryId: "theory-life-course",
        targetTheoryId: "theory-identity",
        relationType: "extended_by",
        descriptionEn: "Life-course analysis informs teacher identity work.",
        strength: 4,
      }],
    },
    scholar: {
      findMany: async () => [{
        id: "scholar-elder",
        slug: "glen-elder",
        name: "Glen H. Elder Jr.",
        bioEn: "Life-course researcher.",
        theories: [{ theoryId: "theory-life-course", scholarId: "scholar-elder", role: "founder" }],
      }],
    },
    scholarScholar: {
      findMany: async () => [],
    },
    topic: {
      findMany: async () => [{
        id: "topic-transitions",
        slug: "educational-transitions",
        questionEn: "How do educational transitions unfold over time?",
        theories: [{
          topicId: "topic-transitions",
          theoryId: "theory-life-course",
          suitability: "high",
          suitabilityNotesEn: "Strong fit for timing and transitions.",
        }],
      }],
    },
  };
}

test("graph data exposes only published disciplines with visual data", async () => {
  const graph = await getGraphDataForDb(fakeDb() as never, "education", "genealogy");

  assert.deepEqual(graph?.meta.availableDisciplines, [
    { slug: "education", label: "Education" },
    { slug: "sociology", label: "Sociology" },
  ]);
});

test("genealogy mode uses real theory nodes, relation labels, concepts, and canonical links", async () => {
  const graph = await getGraphDataForDb(fakeDb() as never, "education", "genealogy");

  assert.equal(graph?.meta.mode, "genealogy");
  assert.equal(graph?.meta.nodeCount, 2);
  assert.equal(graph?.edges[0].label, "Life-course analysis informs teacher identity work.");
  assert.equal(graph?.nodes[0].data?.articleHref, "/theories/life-course-theory");
  assert.deepEqual(graph?.nodes[0].data?.concepts, ["Linked lives"]);
});

test("scholars mode uses theory-scholar relations instead of reusing the genealogy graph", async () => {
  const graph = await getGraphDataForDb(fakeDb() as never, "education", "scholars");
  const scholar = graph?.nodes.find((node) => node.type === "scholar");

  assert.equal(graph?.meta.mode, "scholars");
  assert.ok(graph?.nodes.some((node) => node.type === "theory"));
  assert.equal(scholar?.data?.articleHref, "/scholars/glen-elder");
  assert.deepEqual(graph?.edges[0], {
    id: "theory-life-course:scholar-elder",
    source: "theory-life-course",
    target: "scholar-elder",
    type: "founder",
    label: "founder",
    strength: 3,
  });
});

test("topics mode uses topic-theory suitability relations and topic canonical links", async () => {
  const graph = await getGraphDataForDb(fakeDb() as never, "education", "topics");
  const topic = graph?.nodes.find((node) => node.type === "topic");

  assert.equal(graph?.meta.mode, "topics");
  assert.equal(topic?.data?.articleHref, "/topics/educational-transitions");
  assert.equal(graph?.edges[0].type, "suitability");
  assert.equal(graph?.edges[0].label, "Strong fit for timing and transitions.");
});

test("an unpublished discipline remains a missing graph instead of an empty clickable option", async () => {
  const graph = await getGraphDataForDb(fakeDb() as never, "psychology", "genealogy");

  assert.equal(graph, null);
});
