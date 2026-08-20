import { Prisma, type PrismaClient } from "@prisma/client";
import {
  FAN_247_ARCHIVED_CONCEPT_SLUGS,
  FAN_247_ARCHIVED_DISCIPLINE_SLUGS,
  FAN_247_ARCHIVED_FIELD_SLUGS,
  FAN_247_ARCHIVED_SCHOLAR_SLUGS,
  FAN_247_ARCHIVED_THEORY_SLUGS,
  FAN_247_ARCHIVED_TOPIC_SLUGS,
  FAN_247_ARCHIVED_WORK_SLUGS,
} from "./fan247-visibility.ts";
import { FAN_133_U3_ARCHIVED_CONCEPT_SLUGS, FAN_133_U3_ARCHIVED_WORK_SLUGS } from "./u3-visibility.ts";

export interface SeedPublicationSnapshot {
  slug: string;
  status: string;
  publishedAt: Date | null;
}

export interface FAN247ArchivedPublicationSnapshot extends SeedPublicationSnapshot {
  entityType: "discipline" | "field" | "theory" | "work" | "concept" | "scholar" | "topic";
}

export interface SeedVerificationResult {
  disciplineSlugs: string[];
  publishedTheoryCount: number;
  fieldCount: number;
  disciplineTheoryCount: number;
  fieldTheoryCount: number;
  genealogyCount: number;
  publishedScholarCount: number;
  theoryScholarCount: number;
  totalScholarCount: number;
  totalTheoryScholarCount: number;
  publishedTopicCount: number;
  publishedWorkCount: number;
  publishedConceptCount: number;
  archivedFAN247: FAN247ArchivedPublicationSnapshot[];
  archivedU3Works: SeedPublicationSnapshot[];
  archivedU3Concepts: SeedPublicationSnapshot[];
  topicTheoryCount: number;
  totalTopicCount: number;
  totalTopicTheoryCount: number;
  enrichmentTopicStatuses: Array<{ slug: string; status: string }>;
  enrichmentScholarStatuses: Array<{ slug: string; status: string }>;
  secondScholarStatuses: Array<{ slug: string; status: string }>;
  legacySourceMetadataCount: number;
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
    totalScholarCount,
    totalTheoryScholarCount,
    publishedTopicCount,
    publishedWorkCount,
    publishedConceptCount,
    archivedFAN247Disciplines,
    archivedFAN247Fields,
    archivedFAN247Theories,
    archivedFAN247Works,
    archivedFAN247Concepts,
    archivedFAN247Scholars,
    archivedFAN247Topics,
    archivedU3Works,
    archivedU3Concepts,
    topicTheoryCount,
    totalTopicCount,
    totalTopicTheoryCount,
    enrichmentTopicStatuses,
    enrichmentScholarStatuses,
    secondScholarStatuses,
    legacySourceMetadataRows,
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
    db.scholar.count(),
    db.theoryScholar.count(),
    db.topic.count({ where: { status: "published" } }),
    db.work.count({ where: { status: "published" } }),
    db.concept.count({ where: { status: "published" } }),
    db.discipline.findMany({ where: { slug: { in: [...FAN_247_ARCHIVED_DISCIPLINE_SLUGS] } }, orderBy: { slug: "asc" }, select: { slug: true, status: true, publishedAt: true } }),
    db.field.findMany({ where: { slug: { in: [...FAN_247_ARCHIVED_FIELD_SLUGS] } }, orderBy: { slug: "asc" }, select: { slug: true, status: true, publishedAt: true } }),
    db.theory.findMany({ where: { slug: { in: [...FAN_247_ARCHIVED_THEORY_SLUGS] } }, orderBy: { slug: "asc" }, select: { slug: true, status: true, publishedAt: true } }),
    db.work.findMany({ where: { slug: { in: [...FAN_247_ARCHIVED_WORK_SLUGS] } }, orderBy: { slug: "asc" }, select: { slug: true, status: true, publishedAt: true } }),
    db.concept.findMany({ where: { slug: { in: [...FAN_247_ARCHIVED_CONCEPT_SLUGS] } }, orderBy: { slug: "asc" }, select: { slug: true, status: true, publishedAt: true } }),
    db.scholar.findMany({ where: { slug: { in: [...FAN_247_ARCHIVED_SCHOLAR_SLUGS] } }, orderBy: { slug: "asc" }, select: { slug: true, status: true, publishedAt: true } }),
    db.topic.findMany({ where: { slug: { in: [...FAN_247_ARCHIVED_TOPIC_SLUGS] } }, orderBy: { slug: "asc" }, select: { slug: true, status: true, publishedAt: true } }),
    db.work.findMany({
      where: { slug: { in: [...FAN_133_U3_ARCHIVED_WORK_SLUGS] } },
      orderBy: { slug: "asc" },
      select: { slug: true, status: true, publishedAt: true },
    }),
    db.concept.findMany({
      where: { slug: { in: [...FAN_133_U3_ARCHIVED_CONCEPT_SLUGS] } },
      orderBy: { slug: "asc" },
      select: { slug: true, status: true, publishedAt: true },
    }),
    db.topicTheory.count({
      where: {
        topic: { status: "published" },
        theory: { status: "published" },
      },
    }),
    db.topic.count(),
    db.topicTheory.count(),
    db.topic.findMany({
      where: {
        slug: {
          in: [
            "access-to-educational-support-and-opportunity",
            "communities-of-practice-in-teacher-learning",
            "education-policy-implementation-frontline-discretion",
            "teacher-professional-learning-and-change",
          ],
        },
      },
      orderBy: { slug: "asc" },
      select: { slug: true, status: true },
    }),
    db.scholar.findMany({
      where: {
        slug: {
          in: ["etienne-wenger", "jean-lave", "john-w-kingdon", "michael-lipsky"],
        },
      },
      orderBy: { slug: "asc" },
      select: { slug: true, status: true },
    }),
    db.scholar.findMany({
      where: {
        slug: {
          in: ["christopher-day", "ivor-f-goodson"],
        },
      },
      orderBy: { slug: "asc" },
      select: { slug: true, status: true },
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
    totalScholarCount,
    totalTheoryScholarCount,
    publishedTopicCount,
    publishedWorkCount,
    publishedConceptCount,
    archivedFAN247: [
      ...archivedFAN247Disciplines.map((row) => ({ entityType: "discipline" as const, ...row })),
      ...archivedFAN247Fields.map((row) => ({ entityType: "field" as const, ...row })),
      ...archivedFAN247Theories.map((row) => ({ entityType: "theory" as const, ...row })),
      ...archivedFAN247Works.map((row) => ({ entityType: "work" as const, ...row })),
      ...archivedFAN247Concepts.map((row) => ({ entityType: "concept" as const, ...row })),
      ...archivedFAN247Scholars.map((row) => ({ entityType: "scholar" as const, ...row })),
      ...archivedFAN247Topics.map((row) => ({ entityType: "topic" as const, ...row })),
    ].sort((left, right) => left.entityType.localeCompare(right.entityType) || left.slug.localeCompare(right.slug)),
    archivedU3Works,
    archivedU3Concepts,
    topicTheoryCount,
    totalTopicCount,
    totalTopicTheoryCount,
    enrichmentTopicStatuses,
    enrichmentScholarStatuses,
    secondScholarStatuses,
    legacySourceMetadataCount: countValue(legacySourceMetadataRows),
    searchableTheoryCount: countValue(searchableTheoryRows),
    searchableScholarCount: countValue(searchableScholarRows),
    searchableTopicCount: countValue(searchableTopicRows),
    identitySearchCount: countValue(identityRows),
    elderSearchCount: countValue(elderRows),
    transitionTopicSearchCount: countValue(transitionTopicRows),
  };
}
