import { getDb } from "../db";

const published = "published";

export function getScholarBySlug(slug: string) {
  return getDb().scholar.findFirst({
    where: { slug, status: published },
    include: {
      theories: { where: { theory: { status: published } }, include: { theory: true } },
      sourceRelations: { where: { targetScholar: { status: published } }, include: { targetScholar: true } },
      targetRelations: { where: { sourceScholar: { status: published } }, include: { sourceScholar: true } },
    },
  });
}

export function getScholarsByTheory(theorySlug: string) {
  return getDb().scholar.findMany({
    where: {
      status: published,
      theories: { some: { theory: { slug: theorySlug, status: published } } },
    },
    include: { theories: { where: { theory: { status: published } }, include: { theory: true } } },
    orderBy: { name: "asc" },
  });
}
