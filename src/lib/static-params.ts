import { getDb, isDatabaseUnavailableError } from "./db";

export async function publishedSlugs(model: "theory" | "scholar" | "work" | "topic" | "concept" | "discipline" | "field") {
  try {
    const db = getDb();
    const rows = model === "theory" ? await db.theory.findMany({ where: { status: "published" }, select: { slug: true } })
      : model === "scholar" ? await db.scholar.findMany({ where: { status: "published" }, select: { slug: true } })
      : model === "work" ? await db.work.findMany({ where: { status: "published" }, select: { slug: true } })
      : model === "topic" ? await db.topic.findMany({ where: { status: "published" }, select: { slug: true } })
      : model === "concept" ? await db.concept.findMany({ where: { status: "published" }, select: { slug: true } })
      : model === "discipline" ? await db.discipline.findMany({ where: { status: "published" }, select: { slug: true } })
      : await db.field.findMany({ where: { status: "published" }, select: { slug: true } });
    return rows.map(({ slug }) => ({ slug }));
  } catch (error) {
    if (isDatabaseUnavailableError(error)) return [];
    throw error;
  }
}
