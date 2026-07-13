import { PrismaPg } from "@prisma/adapter-pg";
import prismaClientPackage from "@prisma/client";

import { seedCorpus } from "../src/data/seed-content.ts";
import { validateSeedCorpus } from "../src/lib/content-validation.ts";

const { PrismaClient } = prismaClientPackage;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to seed Syrtag");

const preflight = validateSeedCorpus(seedCorpus);
if (preflight.errors.length > 0) {
  throw new Error(`Seed validation failed:\n${preflight.errors.join("\n")}`);
}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
const publishedAt = new Date("2026-07-12T00:00:00.000Z");
const published = { status: "published", publishedAt };

function publication(record: { status: string; publishedAt: string }) {
  return {
    status: record.status,
    publishedAt: record.status === "published" ? new Date(record.publishedAt) : null,
  };
}

async function main() {
  const disciplineBySlug = new Map<string, string>();
  for (const record of seedCorpus.disciplines) {
    const item = await db.discipline.upsert({
      where: { slug: record.slug },
      update: { titleEn: record.titleEn, descriptionEn: record.descriptionEn, ...published },
      create: { slug: record.slug, titleEn: record.titleEn, descriptionEn: record.descriptionEn, ...published },
    });
    disciplineBySlug.set(record.slug, item.id);
  }

  const fieldBySlug = new Map<string, string>();
  for (const record of seedCorpus.fields) {
    const disciplineId = disciplineBySlug.get(record.disciplineSlug);
    if (!disciplineId) throw new Error(`Missing discipline for field ${record.slug}`);
    const item = await db.field.upsert({
      where: { slug: record.slug },
      update: { titleEn: record.titleEn, disciplineId, ...published },
      create: { slug: record.slug, titleEn: record.titleEn, disciplineId, ...published },
    });
    fieldBySlug.set(record.slug, item.id);
  }

  const theoryBySlug = new Map<string, string>();
  for (const record of seedCorpus.theories) {
    const contentJsonb = JSON.parse(JSON.stringify(record.content));
    const item = await db.theory.upsert({
      where: { slug: record.slug },
      update: {
        titleEn: record.titleEn,
        summaryEn: record.summaryEn,
        depth: record.depth,
        contentJsonb,
        ...published,
      },
      create: {
        slug: record.slug,
        titleEn: record.titleEn,
        summaryEn: record.summaryEn,
        depth: record.depth,
        contentJsonb,
        ...published,
      },
    });
    theoryBySlug.set(record.slug, item.id);
  }

  for (const relation of seedCorpus.disciplineTheories) {
    const disciplineId = disciplineBySlug.get(relation.disciplineSlug);
    const theoryId = theoryBySlug.get(relation.theorySlug);
    if (!disciplineId || !theoryId) throw new Error("Validated discipline relation could not be resolved");
    await db.disciplineTheory.upsert({
      where: { disciplineId_theoryId: { disciplineId, theoryId } },
      update: { relevance: relation.relevance },
      create: { disciplineId, theoryId, relevance: relation.relevance },
    });
  }

  for (const relation of seedCorpus.fieldTheories) {
    const fieldId = fieldBySlug.get(relation.fieldSlug);
    const theoryId = theoryBySlug.get(relation.theorySlug);
    if (!fieldId || !theoryId) throw new Error("Validated field relation could not be resolved");
    await db.fieldTheory.upsert({
      where: { fieldId_theoryId: { fieldId, theoryId } },
      update: { relevance: "primary" },
      create: { fieldId, theoryId, relevance: "primary" },
    });
  }

  for (const edge of seedCorpus.genealogy) {
    const sourceTheoryId = theoryBySlug.get(edge.sourceSlug);
    const targetTheoryId = theoryBySlug.get(edge.targetSlug);
    if (!sourceTheoryId || !targetTheoryId) throw new Error(`Validated genealogy edge ${edge.id} could not be resolved`);
    await db.theoryGenealogy.upsert({
      where: { id: edge.id },
      update: {
        sourceTheoryId,
        targetTheoryId,
        relationType: edge.relationType,
        descriptionEn: edge.descriptionEn,
        strength: edge.strength,
      },
      create: {
        id: edge.id,
        sourceTheoryId,
        targetTheoryId,
        relationType: edge.relationType,
        descriptionEn: edge.descriptionEn,
        strength: edge.strength,
      },
    });
  }

  const scholarBySlug = new Map<string, string>();
  for (const record of seedCorpus.scholars) {
    const item = await db.scholar.upsert({
      where: { slug: record.slug },
      update: {
        name: record.name,
        bioEn: record.bioEn,
        ...publication(record),
      },
      create: {
        slug: record.slug,
        name: record.name,
        bioEn: record.bioEn,
        ...publication(record),
      },
    });
    scholarBySlug.set(record.slug, item.id);
  }

  for (const relation of seedCorpus.theoryScholars) {
    const theoryId = theoryBySlug.get(relation.theorySlug);
    const scholarId = scholarBySlug.get(relation.scholarSlug);
    if (!theoryId || !scholarId) throw new Error("Validated theory-scholar relation could not be resolved");
    await db.theoryScholar.upsert({
      where: { theoryId_scholarId: { theoryId, scholarId } },
      update: { role: relation.role },
      create: { theoryId, scholarId, role: relation.role },
    });
  }

  const topicBySlug = new Map<string, string>();
  for (const record of seedCorpus.topics) {
    const item = await db.topic.upsert({
      where: { slug: record.slug },
      update: {
        questionEn: record.questionEn,
        ...publication(record),
      },
      create: {
        slug: record.slug,
        questionEn: record.questionEn,
        ...publication(record),
      },
    });
    topicBySlug.set(record.slug, item.id);
  }

  for (const relation of seedCorpus.topicTheories) {
    const topicId = topicBySlug.get(relation.topicSlug);
    const theoryId = theoryBySlug.get(relation.theorySlug);
    if (!topicId || !theoryId) throw new Error("Validated topic-theory relation could not be resolved");
    await db.topicTheory.upsert({
      where: { topicId_theoryId: { topicId, theoryId } },
      update: {
        suitability: relation.suitability,
        suitabilityNotesEn: relation.suitabilityNotesEn,
        recommendation: relation.recommendation,
      },
      create: {
        topicId,
        theoryId,
        suitability: relation.suitability,
        suitabilityNotesEn: relation.suitabilityNotesEn,
        recommendation: relation.recommendation,
      },
    });
  }

  for (const record of seedCorpus.verifications) {
    const entityId = theoryBySlug.get(record.entitySlug);
    if (!entityId) throw new Error(`Validated verification could not resolve ${record.entitySlug}`);
    await db.verification.upsert({
      where: {
        entityType_entityId_fieldPath: {
          entityType: "theory",
          entityId,
          fieldPath: record.fieldPath,
        },
      },
      update: {
        level: record.level,
        sources: record.sources,
        notes: record.notes,
        verifiedAt: record.level === "L1_verified" ? publishedAt : null,
      },
      create: {
        entityType: "theory",
        entityId,
        fieldPath: record.fieldPath,
        level: record.level,
        sources: record.sources,
        notes: record.notes,
        verifiedAt: record.level === "L1_verified" ? publishedAt : null,
      },
    });
  }
}

main()
  .then(() => console.log("Syrtag seed completed."))
  .finally(() => db.$disconnect());
