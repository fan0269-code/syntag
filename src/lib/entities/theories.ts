import type { PrismaClient } from "@prisma/client";

import { getDb } from "../db.ts";
import { filterPublicGenealogyRelations, publicGenealogyRelationWhere } from "../genealogy-visibility.ts";

const published = "published";

export function getTheoryBySlug(slug: string) {
  return getTheoryBySlugForDb(getDb(), slug);
}

export async function getTheoryBySlugForDb(db: PrismaClient, slug: string) {
  const theory = await db.theory.findFirst({
    where: { slug, status: published },
    include: {
      scholars: { where: { scholar: { status: published } }, include: { scholar: true } },
      works: { where: { work: { status: published } }, include: { work: true } },
      concepts: { where: { concept: { status: published } }, include: { concept: true } },
      fields: { where: { field: { status: published, discipline: { status: published } } }, include: { field: { include: { discipline: true } } } },
      topics: { where: { topic: { status: published } }, include: { topic: true } },
      sourceRelations: {
        where: { ...publicGenealogyRelationWhere(), targetTheory: { status: published } },
        include: { targetTheory: true, keyScholar: true, keyWork: true },
      },
      targetRelations: {
        where: { ...publicGenealogyRelationWhere(), sourceTheory: { status: published } },
        include: { sourceTheory: true, keyScholar: true, keyWork: true },
      },
    },
  });

  if (!theory) return null;
  return {
    ...theory,
    sourceRelations: filterPublicGenealogyRelations(theory.sourceRelations),
    targetRelations: filterPublicGenealogyRelations(theory.targetRelations),
  };
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
