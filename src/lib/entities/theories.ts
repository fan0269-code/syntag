import { getDb } from "../db";

const published = "published";

export function getTheoryBySlug(slug: string) {
  return getDb().theory.findFirst({
    where: { slug, status: published },
    include: {
      scholars: { where: { scholar: { status: published } }, include: { scholar: true } },
      works: { where: { work: { status: published } }, include: { work: true } },
      concepts: { where: { concept: { status: published } }, include: { concept: true } },
      fields: { where: { field: { status: published, discipline: { status: published } } }, include: { field: { include: { discipline: true } } } },
      topics: { where: { topic: { status: published } }, include: { topic: true } },
      sourceRelations: {
        where: { targetTheory: { status: published } },
        include: { targetTheory: true, keyScholar: true, keyWork: true },
      },
      targetRelations: {
        where: { sourceTheory: { status: published } },
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
    include: { scholars: { where: { scholar: { status: published } }, include: { scholar: true } } },
    orderBy: { titleEn: "asc" },
  });
}

export function getTheoriesByField(fieldSlug: string) {
  return getDb().theory.findMany({
    where: {
      status: published,
      fields: { some: { field: { slug: fieldSlug, status: published } } },
    },
    include: { scholars: { where: { scholar: { status: published } }, include: { scholar: true } } },
    orderBy: { titleEn: "asc" },
  });
}
