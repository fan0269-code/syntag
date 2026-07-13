import { getDb } from "../db";

const published = "published";

export function getTheoryBySlug(slug: string) {
  return getDb().theory.findFirst({
    where: { slug, status: published },
    include: {
      scholars: { include: { scholar: true } },
      works: { include: { work: true } },
      concepts: { include: { concept: true } },
      fields: { include: { field: { include: { discipline: true } } } },
      topics: { include: { topic: true } },
      sourceRelations: {
        include: { targetTheory: true, keyScholar: true, keyWork: true },
      },
      targetRelations: {
        include: { sourceTheory: true, keyScholar: true, keyWork: true },
      },
    },
  });
}

export function getTheoriesByDiscipline(disciplineSlug: string) {
  return getDb().theory.findMany({
    where: {
      status: published,
      disciplines: {
        some: { discipline: { slug: disciplineSlug, status: published } },
      },
    },
    include: { scholars: { include: { scholar: true } } },
    orderBy: { titleEn: "asc" },
  });
}

export function getTheoriesByField(fieldSlug: string) {
  return getDb().theory.findMany({
    where: {
      status: published,
      fields: { some: { field: { slug: fieldSlug, status: published } } },
    },
    include: { scholars: { include: { scholar: true } } },
    orderBy: { titleEn: "asc" },
  });
}
