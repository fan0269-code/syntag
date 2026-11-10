import type { Prisma, PrismaClient } from "@prisma/client";

import {
  buildTopicTheoryCreateData,
  buildTopicTheoryUpdateData,
} from "./content-validation.ts";
import {
  assertPublishedImportPlanAllowed,
  type PublishedImportPlan,
} from "./published-import.ts";

type PublishedImportWriter = Prisma.TransactionClient;

function jsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function publishedColumns(publishedAt: string) {
  return {
    status: "published",
    publishedAt: new Date(publishedAt),
  };
}

async function writePublishedImport(db: PublishedImportWriter, plan: PublishedImportPlan): Promise<void> {
  const disciplineBySlug = new Map<string, string>();
  for (const record of plan.disciplines) {
    const item = await db.discipline.upsert({
      where: { slug: record.slug },
      update: {
        titleEn: record.titleEn,
        descriptionEn: record.descriptionEn,
        overviewEn: record.overviewEn,
        contentJsonb: jsonValue(record.content),
        ...publishedColumns(record.publishedAt!),
      },
      create: {
        slug: record.slug,
        titleEn: record.titleEn,
        descriptionEn: record.descriptionEn,
        overviewEn: record.overviewEn,
        contentJsonb: jsonValue(record.content),
        ...publishedColumns(record.publishedAt!),
      },
    });
    disciplineBySlug.set(record.slug, item.id);
  }

  const fieldBySlug = new Map<string, string>();
  for (const record of plan.fields) {
    const disciplineId = disciplineBySlug.get(record.disciplineSlug);
    if (!disciplineId) throw new Error(`Missing published discipline for field ${record.slug}`);
    const item = await db.field.upsert({
      where: { slug: record.slug },
      update: {
        titleEn: record.titleEn,
        descriptionEn: record.descriptionEn,
        contentJsonb: jsonValue(record.content),
        disciplineId,
        ...publishedColumns(record.publishedAt!),
      },
      create: {
        slug: record.slug,
        titleEn: record.titleEn,
        descriptionEn: record.descriptionEn,
        contentJsonb: jsonValue(record.content),
        disciplineId,
        ...publishedColumns(record.publishedAt!),
      },
    });
    fieldBySlug.set(record.slug, item.id);
  }

  const theoryBySlug = new Map<string, string>();
  for (const record of plan.theories) {
    const item = await db.theory.upsert({
      where: { slug: record.slug },
      update: {
        titleEn: record.titleEn,
        summaryEn: record.summaryEn,
        depth: record.depth,
        contentJsonb: jsonValue(record.content),
        ...publishedColumns(record.publishedAt!),
      },
      create: {
        slug: record.slug,
        titleEn: record.titleEn,
        summaryEn: record.summaryEn,
        depth: record.depth,
        contentJsonb: jsonValue(record.content),
        ...publishedColumns(record.publishedAt!),
      },
    });
    theoryBySlug.set(record.slug, item.id);
  }

  const workBySlug = new Map<string, string>();
  for (const record of plan.works) {
    const item = await db.work.upsert({
      where: { slug: record.slug },
      update: {
        title: record.title,
        authors: jsonValue(record.authors),
        year: record.year,
        publisher: record.publisher ?? null,
        doi: record.doi ?? null,
        isbn: record.isbn ?? null,
        contentJsonb: jsonValue(record.content),
        ...publishedColumns(record.publishedAt!),
      },
      create: {
        slug: record.slug,
        title: record.title,
        authors: jsonValue(record.authors),
        year: record.year,
        publisher: record.publisher ?? null,
        doi: record.doi ?? null,
        isbn: record.isbn ?? null,
        contentJsonb: jsonValue(record.content),
        ...publishedColumns(record.publishedAt!),
      },
    });
    workBySlug.set(record.slug, item.id);
  }

  const conceptBySlug = new Map<string, string>();
  for (const record of plan.concepts) {
    const item = await db.concept.upsert({
      where: { slug: record.slug },
      update: {
        termEn: record.termEn,
        definitionEn: record.definitionEn,
        contentJsonb: jsonValue(record.content),
        ...publishedColumns(record.publishedAt!),
      },
      create: {
        slug: record.slug,
        termEn: record.termEn,
        definitionEn: record.definitionEn,
        contentJsonb: jsonValue(record.content),
        ...publishedColumns(record.publishedAt!),
      },
    });
    conceptBySlug.set(record.slug, item.id);
  }

  const scholarBySlug = new Map<string, string>();
  for (const record of plan.scholars) {
    const item = await db.scholar.upsert({
      where: { slug: record.slug },
      update: {
        name: record.name,
        bioEn: record.bioEn,
        contentJsonb: jsonValue(record.content),
        ...publishedColumns(record.publishedAt!),
      },
      create: {
        slug: record.slug,
        name: record.name,
        bioEn: record.bioEn,
        contentJsonb: jsonValue(record.content),
        ...publishedColumns(record.publishedAt!),
      },
    });
    scholarBySlug.set(record.slug, item.id);
  }

  const topicBySlug = new Map<string, string>();
  for (const record of plan.topics) {
    const item = await db.topic.upsert({
      where: { slug: record.slug },
      update: {
        questionEn: record.questionEn,
        contentJsonb: jsonValue(record.content),
        ...publishedColumns(record.publishedAt!),
      },
      create: {
        slug: record.slug,
        questionEn: record.questionEn,
        contentJsonb: jsonValue(record.content),
        ...publishedColumns(record.publishedAt!),
      },
    });
    topicBySlug.set(record.slug, item.id);
  }

  for (const relation of plan.disciplineTheories) {
    const disciplineId = disciplineBySlug.get(relation.disciplineSlug);
    const theoryId = theoryBySlug.get(relation.theorySlug);
    if (!disciplineId || !theoryId) throw new Error(`Missing published endpoint for discipline relation ${relation.disciplineSlug} -> ${relation.theorySlug}`);
    await db.disciplineTheory.upsert({
      where: { disciplineId_theoryId: { disciplineId, theoryId } },
      update: { relevance: relation.relevance },
      create: { disciplineId, theoryId, relevance: relation.relevance },
    });
  }

  for (const relation of plan.fieldTheories) {
    const fieldId = fieldBySlug.get(relation.fieldSlug);
    const theoryId = theoryBySlug.get(relation.theorySlug);
    if (!fieldId || !theoryId) throw new Error(`Missing published endpoint for field relation ${relation.fieldSlug} -> ${relation.theorySlug}`);
    await db.fieldTheory.upsert({
      where: { fieldId_theoryId: { fieldId, theoryId } },
      update: { relevance: "primary" },
      create: { fieldId, theoryId, relevance: "primary" },
    });
  }

  for (const relation of plan.theoryWorks) {
    const theoryId = theoryBySlug.get(relation.theorySlug);
    const workId = workBySlug.get(relation.workSlug);
    if (!theoryId || !workId) throw new Error(`Missing published endpoint for theory-work relation ${relation.theorySlug} -> ${relation.workSlug}`);
    await db.theoryWork.upsert({
      where: { theoryId_workId: { theoryId, workId } },
      update: { relationship: relation.relationship },
      create: { theoryId, workId, relationship: relation.relationship },
    });
  }

  for (const relation of plan.theoryConcepts) {
    const theoryId = theoryBySlug.get(relation.theorySlug);
    const conceptId = conceptBySlug.get(relation.conceptSlug);
    if (!theoryId || !conceptId) throw new Error(`Missing published endpoint for theory-concept relation ${relation.theorySlug} -> ${relation.conceptSlug}`);
    await db.theoryConcept.upsert({
      where: { theoryId_conceptId: { theoryId, conceptId } },
      update: { importance: relation.importance },
      create: { theoryId, conceptId, importance: relation.importance },
    });
  }

  for (const relation of plan.theoryScholars) {
    const theoryId = theoryBySlug.get(relation.theorySlug);
    const scholarId = scholarBySlug.get(relation.scholarSlug);
    if (!theoryId || !scholarId) throw new Error(`Missing published endpoint for theory-scholar relation ${relation.theorySlug} -> ${relation.scholarSlug}`);
    await db.theoryScholar.upsert({
      where: { theoryId_scholarId: { theoryId, scholarId } },
      update: { role: relation.role },
      create: { theoryId, scholarId, role: relation.role },
    });
  }

  const theorySourcesBySlug = new Map(plan.theories.map((theory) => [theory.slug, theory.content.en.sources] as const));
  for (const relation of plan.topicTheories) {
    const topicId = topicBySlug.get(relation.topicSlug);
    const theoryId = theoryBySlug.get(relation.theorySlug);
    if (!topicId || !theoryId) throw new Error(`Missing published endpoint for topic-theory relation ${relation.topicSlug} -> ${relation.theorySlug}`);
    const theorySources = theorySourcesBySlug.get(relation.theorySlug) ?? [];
    await db.topicTheory.upsert({
      where: { topicId_theoryId: { topicId, theoryId } },
      update: buildTopicTheoryUpdateData(relation, theorySources),
      create: {
        topicId,
        theoryId,
        ...buildTopicTheoryCreateData(relation, theorySources),
      },
    });
  }

  for (const edge of plan.genealogy) {
    const sourceTheoryId = theoryBySlug.get(edge.sourceSlug);
    const targetTheoryId = theoryBySlug.get(edge.targetSlug);
    if (!sourceTheoryId || !targetTheoryId) throw new Error(`Missing published endpoint for genealogy ${edge.sourceSlug} -> ${edge.targetSlug}`);
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

  for (const record of plan.verifications) {
    const entityId = theoryBySlug.get(record.entitySlug);
    if (!entityId) throw new Error(`Missing published theory for verification ${record.entitySlug}`);
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
        verifiedAt: record.verifiedAt ? new Date(record.verifiedAt) : null,
      },
      create: {
        entityType: "theory",
        entityId,
        fieldPath: record.fieldPath,
        level: record.level,
        sources: record.sources,
        notes: record.notes,
        verifiedAt: record.verifiedAt ? new Date(record.verifiedAt) : null,
      },
    });
  }
}

export async function applyPublishedImport(db: PrismaClient, plan: PublishedImportPlan): Promise<void> {
  assertPublishedImportPlanAllowed(plan);
  await db.$transaction(async (tx) => {
    await writePublishedImport(tx, plan);
  }, { maxWait: 10_000, timeout: 60_000 });
}
