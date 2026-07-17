import { getDb } from "../db";

const published = "published";

export function getWorkBySlug(slug: string) {
  return getDb().work.findFirst({
    where: { slug, status: published },
    include: { theories: { where: { theory: { status: published } }, include: { theory: true } } },
  });
}

export function getWorksByTheory(theorySlug: string) {
  return getDb().work.findMany({
    where: {
      status: published,
      theories: { some: { theory: { slug: theorySlug, status: published } } },
    },
    include: { theories: { where: { theory: { status: published } }, include: { theory: true } } },
    orderBy: [{ year: "desc" }, { title: "asc" }],
  });
}
