import type { PrismaClient } from "@prisma/client";
import type { GraphMode } from "./api.ts";
import { getDb } from "./db.ts";
import { entityDetailHref, isEntityType } from "./entity-routes.ts";

const published = "published";

type VisualDiscipline = { slug: string; label: string };
type GraphDb = PrismaClient;

function truncate(value: string | null | undefined, maximum = 280) {
  if (!value) return "";
  return value.length > maximum ? `${value.slice(0, maximum - 1)}...` : value;
}

function strengthForSuitability(suitability: string) {
  return { high: 5, medium: 3, low: 1 }[suitability] ?? 1;
}

function theorySummary(theory: { summaryEn: string | null; contentJsonb?: unknown }) {
  return truncate(theory.summaryEn);
}

function conceptLabels(
  concepts: Array<{ concept: { termEn: string; status: string } }>,
) {
  return concepts
    .filter(({ concept }) => concept.status === published)
    .map(({ concept }) => concept.termEn)
    .slice(0, 6);
}

export async function getVisualDisciplines(): Promise<VisualDiscipline[]> {
  return getVisualDisciplinesForDb(getDb());
}

async function getVisualDisciplinesForDb(db: GraphDb): Promise<VisualDiscipline[]> {
  const disciplines = await db.discipline.findMany({
    where: {
      status: published,
      theories: {
        some: {
          theory: {
            status: published,
            OR: [
              { sourceRelations: { some: {} } },
              { targetRelations: { some: {} } },
              { scholars: { some: { scholar: { status: published } } } },
              { topics: { some: { topic: { status: published } } } },
            ],
          },
        },
      },
    },
    orderBy: { titleEn: "asc" },
  });

  return disciplines.map((discipline) => ({ slug: discipline.slug, label: discipline.titleEn }));
}

function articleHref(type: string, slug: string | null | undefined) {
  return slug && isEntityType(type) ? entityDetailHref(type, slug) : undefined;
}

export async function getGraphDataForDb(db: GraphDb, disciplineSlug: string, mode: GraphMode) {
  const [discipline, availableDisciplines] = await Promise.all([
    db.discipline.findFirst({ where: { slug: disciplineSlug, status: published } }),
    getVisualDisciplinesForDb(db),
  ]);
  if (!discipline || !availableDisciplines.some((entry) => entry.slug === discipline.slug)) return null;

  const theories = await db.theory.findMany({
    where: { status: published, disciplines: { some: { disciplineId: discipline.id } } },
    include: {
      concepts: { where: { concept: { status: published } }, include: { concept: true } },
      scholars: { where: { scholar: { status: published } }, include: { scholar: true } },
    },
    orderBy: { titleEn: "asc" },
    take: 199,
  });
  const theoryIds = theories.map((theory) => theory.id);
  const theoryNodes = theories.map((theory) => ({
    id: theory.id,
    type: "theory" as const,
    label: theory.titleEn,
    depth: theory.depth,
    data: {
      slug: theory.slug,
      summary: theorySummary(theory),
      scholarCount: theory.scholars.length,
      concepts: conceptLabels(theory.concepts),
      articleHref: articleHref("theory", theory.slug),
    },
  }));

  if (mode === "genealogy") {
    const relations = await db.theoryGenealogy.findMany({
      where: { sourceTheoryId: { in: theoryIds }, targetTheoryId: { in: theoryIds } },
      orderBy: { strength: "desc" },
    });
    const edges = relations.map((relation) => ({
      id: relation.id,
      source: relation.sourceTheoryId,
      target: relation.targetTheoryId,
      type: relation.relationType,
      label: truncate(relation.descriptionEn, 240) || relation.relationType.replaceAll("_", " "),
      strength: relation.strength,
    }));
    return {
      nodes: theoryNodes,
      edges,
      meta: {
        discipline: discipline.titleEn,
        mode,
        nodeCount: theoryNodes.length,
        edgeCount: edges.length,
        availableDisciplines,
        relationLabels: [...new Set(edges.map((edge) => edge.type.replaceAll("_", " ")))],
      },
    };
  }

  if (mode === "scholars") {
    const scholars = await db.scholar.findMany({
      where: { status: published, theories: { some: { theoryId: { in: theoryIds } } } },
      include: { theories: { where: { theoryId: { in: theoryIds } } } },
      orderBy: { name: "asc" },
      take: 199,
    });
    const scholarIds = scholars.map((scholar) => scholar.id);
    const relations = await db.scholarScholar.findMany({
      where: { sourceScholarId: { in: scholarIds }, targetScholarId: { in: scholarIds } },
    });
    const scholarNodes = scholars.map((scholar) => ({
      id: scholar.id,
      type: "scholar" as const,
      label: scholar.name,
      depth: scholar.theories.length > 1 ? "D2" : "D1",
      data: { slug: scholar.slug, summary: truncate(scholar.bioEn), theoryCount: scholar.theories.length, articleHref: articleHref("scholar", scholar.slug) },
    }));
    const theoryScholarEdges = scholars.flatMap((scholar) => scholar.theories.map((relation) => ({
      id: `${relation.theoryId}:${relation.scholarId}`,
      source: relation.theoryId,
      target: relation.scholarId,
      type: relation.role,
      label: relation.role.replaceAll("_", " "),
      strength: 3,
    })));
    const scholarEdges = relations.map((relation) => ({
      id: `${relation.sourceScholarId}:${relation.targetScholarId}`,
      source: relation.sourceScholarId,
      target: relation.targetScholarId,
      type: relation.relationship,
      label: truncate(relation.descriptionEn, 240) || relation.relationship.replaceAll("_", " "),
      strength: 3,
    }));
    const nodes = [...theoryNodes, ...scholarNodes];
    const edges = [...theoryScholarEdges, ...scholarEdges];
    const relationLabels = [...new Set(edges.map((edge) => edge.type.replaceAll("_", " ")))];
    return {
      nodes,
      edges,
      meta: {
        discipline: discipline.titleEn,
        mode,
        nodeCount: nodes.length,
        edgeCount: edges.length,
        availableDisciplines,
        relationLabels,
        emptyReason: relationLabels.length ? undefined : "No published scholar links are available for this discipline yet.",
      },
    };
  }

  const topics = await db.topic.findMany({
    where: { status: published, theories: { some: { theoryId: { in: theoryIds } } } },
    include: { theories: { where: { theoryId: { in: theoryIds } } } },
    orderBy: { questionEn: "asc" },
    take: 199,
  });
  const topicNodes = topics.map((topic) => ({
    id: topic.id,
    type: "topic" as const,
    label: topic.questionEn,
    depth: "D2",
    data: { slug: topic.slug, summary: "Research topic connected to published theory-fit guidance.", articleHref: articleHref("topic", topic.slug) },
  }));
  const nodes = [...theoryNodes, ...topicNodes];
  const edges = topics.flatMap((topic) => topic.theories.map((relation) => ({
    id: `${relation.topicId}:${relation.theoryId}`,
    source: relation.topicId,
    target: relation.theoryId,
    type: "suitability",
    label: truncate(relation.suitabilityNotesEn ?? relation.suitability) || relation.suitability,
    strength: strengthForSuitability(relation.suitability),
  })));
  const relationLabels = [...new Set(edges.map((edge) => edge.type.replaceAll("_", " ")))];
  return {
    nodes,
    edges,
    meta: {
      discipline: discipline.titleEn,
      mode,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      availableDisciplines,
      relationLabels,
      emptyReason: relationLabels.length ? undefined : "No published topic suitability links are available for this discipline yet.",
    },
  };
}

export async function getGraphData(disciplineSlug: string, mode: GraphMode) {
  return getGraphDataForDb(getDb(), disciplineSlug, mode);
}
