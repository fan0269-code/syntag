import { PrismaPg } from "@prisma/adapter-pg";
import prismaClientPackage from "@prisma/client";

import { seedCorpus, type PublicationStatus } from "../src/data/seed-content.ts";
import { validateSeedCorpus } from "../src/lib/content-validation.ts";

const { PrismaClient } = prismaClientPackage;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to seed Syrtag");

const preflight = validateSeedCorpus(seedCorpus);
if (preflight.errors.length > 0) {
  throw new Error(`Seed validation failed:\n${preflight.errors.join("\n")}`);
}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

function publication(record: { status: PublicationStatus; publishedAt?: string }) {
  if (record.status === "published" && !record.publishedAt) throw new Error("Published content requires publishedAt");
  return {
    status: record.status,
    publishedAt: record.status === "published" ? new Date(record.publishedAt!) : null,
  };
}

async function main() {
  const disciplineBySlug = new Map<string, string>();
  for (const record of seedCorpus.disciplines) {
    const item = await db.discipline.upsert({
      where: { slug: record.slug },
      update: { titleEn: record.titleEn, descriptionEn: record.descriptionEn, overviewEn: record.overviewEn, contentJsonb: JSON.parse(JSON.stringify(record.content)), ...publication(record) },
      create: { slug: record.slug, titleEn: record.titleEn, descriptionEn: record.descriptionEn, overviewEn: record.overviewEn, contentJsonb: JSON.parse(JSON.stringify(record.content)), ...publication(record) },
    });
    disciplineBySlug.set(record.slug, item.id);
  }

  const fieldBySlug = new Map<string, string>();
  for (const record of seedCorpus.fields) {
    const disciplineId = disciplineBySlug.get(record.disciplineSlug);
    if (!disciplineId) throw new Error(`Missing discipline for field ${record.slug}`);
    const item = await db.field.upsert({
      where: { slug: record.slug },
      update: { titleEn: record.titleEn, descriptionEn: record.descriptionEn, contentJsonb: JSON.parse(JSON.stringify(record.content)), disciplineId, ...publication(record) },
      create: { slug: record.slug, titleEn: record.titleEn, descriptionEn: record.descriptionEn, contentJsonb: JSON.parse(JSON.stringify(record.content)), disciplineId, ...publication(record) },
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
        ...publication(record),
      },
      create: {
        slug: record.slug,
        titleEn: record.titleEn,
        summaryEn: record.summaryEn,
        depth: record.depth,
        contentJsonb,
        ...publication(record),
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

  const workBySlug = new Map<string, string>();
  for (const record of seedCorpus.works) {
    const item = await db.work.upsert({
      where: { slug: record.slug },
      update: {
        title: record.title,
        authors: JSON.parse(JSON.stringify(record.authors)),
        year: record.year,
        publisher: record.publisher ?? null,
        doi: record.doi ?? null,
        isbn: record.isbn ?? null,
        contentJsonb: JSON.parse(JSON.stringify(record.content)),
        ...publication(record),
      },
      create: {
        slug: record.slug,
        title: record.title,
        authors: JSON.parse(JSON.stringify(record.authors)),
        year: record.year,
        publisher: record.publisher ?? null,
        doi: record.doi ?? null,
        isbn: record.isbn ?? null,
        contentJsonb: JSON.parse(JSON.stringify(record.content)),
        ...publication(record),
      },
    });
    workBySlug.set(record.slug, item.id);
  }

  for (const relation of seedCorpus.theoryWorks) {
    const theoryId = theoryBySlug.get(relation.theorySlug);
    const workId = workBySlug.get(relation.workSlug);
    if (!theoryId || !workId) throw new Error("Validated theory-work relation could not be resolved");
    await db.theoryWork.upsert({
      where: { theoryId_workId: { theoryId, workId } },
      update: { relationship: relation.relationship },
      create: { theoryId, workId, relationship: relation.relationship },
    });
  }

  const conceptBySlug = new Map<string, string>();
  for (const record of seedCorpus.concepts) {
    const item = await db.concept.upsert({
      where: { slug: record.slug },
      update: {
        termEn: record.termEn,
        definitionEn: record.definitionEn,
        contentJsonb: JSON.parse(JSON.stringify(record.content)),
        ...publication(record),
      },
      create: {
        slug: record.slug,
        termEn: record.termEn,
        definitionEn: record.definitionEn,
        contentJsonb: JSON.parse(JSON.stringify(record.content)),
        ...publication(record),
      },
    });
    conceptBySlug.set(record.slug, item.id);
  }

  for (const relation of seedCorpus.theoryConcepts) {
    const theoryId = theoryBySlug.get(relation.theorySlug);
    const conceptId = conceptBySlug.get(relation.conceptSlug);
    if (!theoryId || !conceptId) throw new Error("Validated theory-concept relation could not be resolved");
    await db.theoryConcept.upsert({
      where: { theoryId_conceptId: { theoryId, conceptId } },
      update: { importance: relation.importance },
      create: { theoryId, conceptId, importance: relation.importance },
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
        contentJsonb: JSON.parse(JSON.stringify(record.content)),
        ...publication(record),
      },
      create: {
        slug: record.slug,
        name: record.name,
        bioEn: record.bioEn,
        contentJsonb: JSON.parse(JSON.stringify(record.content)),
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
        contentJsonb: JSON.parse(JSON.stringify(record.content)),
        ...publication(record),
      },
      create: {
        slug: record.slug,
        questionEn: record.questionEn,
        contentJsonb: JSON.parse(JSON.stringify(record.content)),
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
        verifiedAt: record.level === "L1_verified" ? new Date(record.verifiedAt) : null,
      },
      create: {
        entityType: "theory",
        entityId,
        fieldPath: record.fieldPath,
        level: record.level,
        sources: record.sources,
        notes: record.notes,
        verifiedAt: record.level === "L1_verified" ? new Date(record.verifiedAt) : null,
      },
    });
  }
}

main()
  .then(() => console.log("Syrtag seed completed."))
  .finally(() => db.$disconnect());
