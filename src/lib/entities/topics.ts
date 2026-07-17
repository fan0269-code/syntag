import { getDb } from "../db";

const published = "published";

export function getTopicBySlug(slug: string) {
  return getDb().topic.findFirst({
    where: { slug, status: published },
    include: { theories: { where: { theory: { status: published } }, include: { theory: true } } },
  });
}

export function getTopicsByDiscipline(disciplineSlug: string) {
  return getDb().topic.findMany({
    where: {
      status: published,
      theories: {
        some: {
          theory: {
            status: published,
            disciplines: {
              some: { discipline: { slug: disciplineSlug, status: published } },
            },
          },
        },
      },
    },
    include: { theories: { where: { theory: { status: published } }, include: { theory: true } } },
    orderBy: { questionEn: "asc" },
  });
}

export function getTheoryComparison(topicSlug: string) {
  return getDb().topicTheory.findMany({
    where: { topic: { slug: topicSlug, status: published }, theory: { status: published } },
    include: { theory: { include: { scholars: { where: { scholar: { status: published } }, include: { scholar: true } } } }, topic: true },
    orderBy: { suitability: "asc" },
  });
}
