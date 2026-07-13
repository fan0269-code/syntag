import { getDb } from "../db";

const published = "published";

export function getScholarBySlug(slug: string) {
  return getDb().scholar.findFirst({
    where: { slug, status: published },
    include: {
      theories: { include: { theory: true } },
      sourceRelations: { include: { targetScholar: true } },
      targetRelations: { include: { sourceScholar: true } },
    },
  });
}

export function getScholarsByTheory(theorySlug: string) {
  return getDb().scholar.findMany({
    where: {
      status: published,
      theories: { some: { theory: { slug: theorySlug, status: published } } },
    },
    include: { theories: { include: { theory: true } } },
    orderBy: { name: "asc" },
  });
}
