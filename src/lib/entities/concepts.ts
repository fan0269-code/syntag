import { getDb } from "../db";

export function getConceptBySlug(slug: string) {
  return getDb().concept.findFirst({
    where: { slug, status: "published" },
    include: { theories: { include: { theory: true } } },
  });
}
