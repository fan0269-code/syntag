import { Prisma, type PrismaClient } from "@prisma/client";

export interface SeedVerificationResult {
  disciplineSlugs: string[];
  publishedTheoryCount: number;
  fieldCount: number;
  disciplineTheoryCount: number;
  fieldTheoryCount: number;
  genealogyCount: number;
  publishedScholarCount: number;
  theoryScholarCount: number;
  publishedTopicCount: number;
  topicTheoryCount: number;
  l1VerificationCount: number;
  searchableTheoryCount: number;
  searchableScholarCount: number;
  searchableTopicCount: number;
  identitySearchCount: number;
  elderSearchCount: number;
  transitionTopicSearchCount: number;
}

type CountRow = { count: bigint | number };

function countValue(rows: CountRow[]): number {
  return Number(rows[0]?.count ?? 0);
}

export async function verifySeededDatabase(db: PrismaClient): Promise<SeedVerificationResult> {
  const [
    disciplines,
    publishedTheoryCount,
    fieldCount,
    disciplineTheoryCount,
    fieldTheoryCount,
    genealogyCount,
    publishedScholarCount,
    theoryScholarCount,
    publishedTopicCount,
    topicTheoryCount,
    l1Rows,
    searchableTheoryRows,
    searchableScholarRows,
    searchableTopicRows,
    identityRows,
    elderRows,
    transitionTopicRows,
  ] = await Promise.all([
    db.discipline.findMany({
      where: { status: "published" },
      orderBy: { slug: "asc" },
      select: { slug: true },
    }),
    db.theory.count({ where: { status: "published" } }),
    db.field.count({ where: { status: "published" } }),
    db.disciplineTheory.count(),
    db.fieldTheory.count(),
    db.theoryGenealogy.count({
      where: {
        sourceTheory: { status: "published" },
        targetTheory: { status: "published" },
      },
    }),
    db.scholar.count({ where: { status: "published" } }),
    db.theoryScholar.count({
      where: {
        theory: { status: "published" },
        scholar: { status: "published" },
      },
    }),
    db.topic.count({ where: { status: "published" } }),
    db.topicTheory.count({
      where: {
        topic: { status: "published" },
        theory: { status: "published" },
      },
    }),
    db.$queryRaw<CountRow[]>(Prisma.sql`
      SELECT COUNT(*) AS count
      FROM "verifications"
      WHERE "level" = 'L1_verified' AND jsonb_array_length("sources") > 0
    `),
    db.$queryRaw<CountRow[]>(Prisma.sql`
      SELECT COUNT(*) AS count
      FROM "theories"
      WHERE "status" = 'published' AND "search_vector_en" <> ''::tsvector
    `),
    db.$queryRaw<CountRow[]>(Prisma.sql`
      SELECT COUNT(*) AS count
      FROM "scholars"
      WHERE "status" = 'published' AND "search_vector_en" <> ''::tsvector
    `),
    db.$queryRaw<CountRow[]>(Prisma.sql`
      SELECT COUNT(*) AS count
      FROM "topics"
      WHERE "status" = 'published' AND "search_vector_en" <> ''::tsvector
    `),
    db.$queryRaw<CountRow[]>(Prisma.sql`
      SELECT COUNT(*) AS count
      FROM "theories"
      WHERE "status" = 'published'
        AND "search_vector_en" @@ plainto_tsquery('english', 'identity')
    `),
    db.$queryRaw<CountRow[]>(Prisma.sql`
      SELECT COUNT(*) AS count
      FROM "scholars"
      WHERE "status" = 'published'
        AND "search_vector_en" @@ plainto_tsquery('english', 'Elder')
    `),
    db.$queryRaw<CountRow[]>(Prisma.sql`
      SELECT COUNT(*) AS count
      FROM "topics"
      WHERE "status" = 'published'
        AND "search_vector_en" @@ plainto_tsquery('english', 'transitions')
    `),
  ]);

  return {
    disciplineSlugs: disciplines.map((discipline) => discipline.slug),
    publishedTheoryCount,
    fieldCount,
    disciplineTheoryCount,
    fieldTheoryCount,
    genealogyCount,
    publishedScholarCount,
    theoryScholarCount,
    publishedTopicCount,
    topicTheoryCount,
    l1VerificationCount: countValue(l1Rows),
    searchableTheoryCount: countValue(searchableTheoryRows),
    searchableScholarCount: countValue(searchableScholarRows),
    searchableTopicCount: countValue(searchableTopicRows),
    identitySearchCount: countValue(identityRows),
    elderSearchCount: countValue(elderRows),
    transitionTopicSearchCount: countValue(transitionTopicRows),
  };
}
