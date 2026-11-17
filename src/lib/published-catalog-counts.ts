import { getDb, isDatabaseUnavailableError } from "@/lib/db";

export type PublishedCatalogCounts = {
  theories: number;
  scholars: number;
  works: number;
  topics: number;
  concepts: number;
  disciplines: number;
  fields: number;
};

export async function getPublishedCatalogCounts(): Promise<PublishedCatalogCounts | null> {
  try {
    const db = getDb();
    const published = { status: "published" } as const;
    const [theories, scholars, works, topics, concepts, disciplines, fields] = await Promise.all([
      db.theory.count({ where: published }),
      db.scholar.count({ where: published }),
      db.work.count({ where: published }),
      db.topic.count({ where: published }),
      db.concept.count({ where: published }),
      db.discipline.count({ where: published }),
      db.field.count({ where: published }),
    ]);
    return { theories, scholars, works, topics, concepts, disciplines, fields };
  } catch (error) {
    if (isDatabaseUnavailableError(error)) return null;
    throw error;
  }
}
