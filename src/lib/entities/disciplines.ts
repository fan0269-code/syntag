import { getDb } from "../db";

const published = "published";

export function getDisciplineBySlug(slug: string) {
  return getDb().discipline.findFirst({
    where: { slug, status: published },
    include: {
      fields: { where: { status: published } },
      theories: { where: { theory: { status: published } }, include: { theory: true } },
    },
  });
}

export function getAllDisciplines() {
  return getDb().discipline.findMany({
    where: { status: published },
    include: { fields: { where: { status: published } } },
    orderBy: { titleEn: "asc" },
  });
}

export function getFieldBySlug(slug: string) {
  return getDb().field.findFirst({
    where: { slug, status: published },
    include: { discipline: true, theories: { where: { theory: { status: published } }, include: { theory: true } } },
  });
}
