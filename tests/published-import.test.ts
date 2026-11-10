import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import type { PrismaClient } from "@prisma/client";

import {
  P1_FLAGSHIP_DRAFT_SCHOLAR_SLUGS,
  P1_FLAGSHIP_DRAFT_THEORY_SLUGS,
  P1_FLAGSHIP_DRAFT_WORK_SLUG,
} from "../src/data/corpus/content-batches/2026-11-10-p1-flagship-drafts.ts";
import { seedCorpus, type SeedCorpus } from "../src/data/seed-content.ts";
import {
  FAN_247_ARCHIVED_CONCEPT_SLUGS,
  FAN_247_ARCHIVED_DISCIPLINE_SLUGS,
  FAN_247_ARCHIVED_FIELD_SLUGS,
  FAN_247_ARCHIVED_SCHOLAR_SLUGS,
  FAN_247_ARCHIVED_THEORY_SLUGS,
  FAN_247_ARCHIVED_TOPIC_SLUGS,
  FAN_247_ARCHIVED_WORK_SLUGS,
} from "../src/lib/fan247-visibility.ts";
import { applyPublishedImport } from "../src/lib/published-import-apply.ts";
import {
  formatPublishedImportCounts,
  planPublishedImport,
  redactConnectionSecrets,
  type PublishedImportPlan,
} from "../src/lib/published-import.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publishedAt = "2026-11-10T00:00:00.000Z";

const archivedSlugGroups = [
  ["discipline", FAN_247_ARCHIVED_DISCIPLINE_SLUGS],
  ["field", FAN_247_ARCHIVED_FIELD_SLUGS],
  ["theory", FAN_247_ARCHIVED_THEORY_SLUGS],
  ["work", FAN_247_ARCHIVED_WORK_SLUGS],
  ["concept", FAN_247_ARCHIVED_CONCEPT_SLUGS],
  ["scholar", FAN_247_ARCHIVED_SCHOLAR_SLUGS],
  ["topic", FAN_247_ARCHIVED_TOPIC_SLUGS],
] as const;

const namedArchivedSlugs = [
  "communities-of-practice",
  "life-course-theory",
  "etienne-wenger",
  "glen-h-elder-jr",
  "cop-wenger-1998",
  "lave-wenger-1991-situated-learning",
  "beijaard-meijer-verloop-2004-identity",
  "elder-1998-life-course",
  "multiple-streams-framework",
];

function planSlugs(plan: PublishedImportPlan): string[] {
  return [
    ...plan.disciplines,
    ...plan.fields,
    ...plan.theories,
    ...plan.works,
    ...plan.concepts,
    ...plan.scholars,
    ...plan.topics,
  ].map((record) => record.slug);
}

function relationSlugs(plan: PublishedImportPlan): string[] {
  return [
    ...plan.disciplineTheories.flatMap((relation) => [relation.disciplineSlug, relation.theorySlug]),
    ...plan.fieldTheories.flatMap((relation) => [relation.fieldSlug, relation.theorySlug]),
    ...plan.theoryWorks.flatMap((relation) => [relation.theorySlug, relation.workSlug]),
    ...plan.theoryConcepts.flatMap((relation) => [relation.theorySlug, relation.conceptSlug]),
    ...plan.theoryScholars.flatMap((relation) => [relation.theorySlug, relation.scholarSlug]),
    ...plan.topicTheories.flatMap((relation) => [relation.topicSlug, relation.theorySlug]),
    ...plan.genealogy.flatMap((edge) => [edge.sourceSlug, edge.targetSlug]),
    ...plan.verifications.map((record) => record.entitySlug),
  ];
}

test("published import selects only the eight flagship pages and their published links", () => {
  const plan = planPublishedImport(seedCorpus);

  assert.deepEqual(plan.counts, {
    disciplines: 0,
    fields: 0,
    theories: 4,
    works: 1,
    concepts: 0,
    scholars: 3,
    topics: 0,
    disciplineTheories: 0,
    fieldTheories: 0,
    theoryWorks: 1,
    theoryConcepts: 0,
    theoryScholars: 4,
    topicTheories: 0,
    genealogy: 0,
    verifications: 0,
  });
  assert.deepEqual(plan.theories.map((record) => record.slug), [...P1_FLAGSHIP_DRAFT_THEORY_SLUGS]);
  assert.deepEqual(plan.scholars.map((record) => record.slug), [...P1_FLAGSHIP_DRAFT_SCHOLAR_SLUGS]);
  assert.deepEqual(plan.works.map((record) => record.slug), [P1_FLAGSHIP_DRAFT_WORK_SLUG]);
  assert.deepEqual(plan.theoryWorks.map((relation) => [relation.theorySlug, relation.workSlug]), [
    ["teacher-professional-identity", P1_FLAGSHIP_DRAFT_WORK_SLUG],
  ]);
  assert.equal(plan.theoryScholars.length, 4);
  assert.ok(plan.theories.every((record) => record.status === "published"));
  assert.ok(plan.scholars.every((record) => record.status === "published"));
  assert.ok(plan.works.every((record) => record.status === "published"));

  const selected = new Set([...planSlugs(plan), ...relationSlugs(plan)]);
  const archived = new Set(archivedSlugGroups.flatMap(([, slugs]) => slugs));
  for (const slug of archived) assert.equal(selected.has(slug), false, slug);
  for (const slug of namedArchivedSlugs) assert.equal(selected.has(slug), false, slug);
  assert.equal(selected.has("john-w-kingdon"), false);
  assert.equal(selected.has("multiple-streams-framework"), false);

  const selectedByType = {
    discipline: plan.disciplines,
    field: plan.fields,
    theory: plan.theories,
    work: plan.works,
    concept: plan.concepts,
    scholar: plan.scholars,
    topic: plan.topics,
  };
  const corpusRecords = [
    ["discipline", seedCorpus.disciplines],
    ["field", seedCorpus.fields],
    ["theory", seedCorpus.theories],
    ["work", seedCorpus.works],
    ["concept", seedCorpus.concepts],
    ["scholar", seedCorpus.scholars],
    ["topic", seedCorpus.topics],
  ] as const;
  for (const [type, records] of corpusRecords) {
    for (const record of records) {
      const selected = record.status === "published"
        && selectedByType[type].some((item) => item.slug === record.slug);
      assert.equal(selected, record.status === "published", `${type} ${record.slug}`);
    }
  }

  const text = formatPublishedImportCounts(plan, "dry-run");
  assert.match(text, /^published-import dry-run\n/);
  assert.match(text, /^theories: 4$/m);
  assert.match(text, /^works: 1$/m);
  assert.match(text, /^scholars: 3$/m);
  assert.match(text, /^theoryScholars: 4$/m);
  assert.match(text, /^disciplines: 0$/m);
  assert.equal(/postgres(?:ql)?:\/\//i.test(text), false);
  assert.equal(/DATABASE_URL|DIRECT_URL/.test(text), false);
});

test("FAN-247 slugs stay excluded when marked published, and drafts are not imported", () => {
  const corpus = structuredClone(seedCorpus);
  for (const [type, slugs] of archivedSlugGroups) {
    const records = {
      discipline: corpus.disciplines,
      field: corpus.fields,
      theory: corpus.theories,
      work: corpus.works,
      concept: corpus.concepts,
      scholar: corpus.scholars,
      topic: corpus.topics,
    }[type];
    for (const slug of slugs) {
      const record = records.find((candidate) => candidate.slug === slug);
      assert.ok(record, `${type} ${slug}`);
      record.status = "published";
      record.publishedAt = publishedAt;
    }
  }
  const draftTheory = corpus.theories.find((record) => record.slug === "life-course-perspective");
  assert.ok(draftTheory);
  draftTheory.status = "draft";
  draftTheory.publishedAt = undefined;

  const discipline = {
    ...corpus.disciplines[0],
    slug: "published-import-fixture-discipline",
    status: "published" as const,
    publishedAt,
  };
  corpus.disciplines.push(discipline);
  corpus.disciplineTheories.push({
    disciplineSlug: discipline.slug,
    theorySlug: "teacher-professional-identity",
    relevance: "primary",
  });
  corpus.disciplineTheories.push({
    disciplineSlug: "education",
    theorySlug: "teacher-professional-identity",
    relevance: "primary",
  });

  const plan = planPublishedImport(corpus);
  const selected = new Set([...planSlugs(plan), ...relationSlugs(plan)]);
  for (const slug of archivedSlugGroups.flatMap(([, slugs]) => slugs)) {
    assert.equal(selected.has(slug), false, slug);
  }
  assert.equal(plan.theories.some((record) => record.slug === "life-course-perspective"), false);
  assert.equal(plan.disciplines.map((record) => record.slug).includes("published-import-fixture-discipline"), true);
  assert.deepEqual(
    plan.disciplineTheories.filter((relation) => relation.theorySlug === "teacher-professional-identity"),
    [{ disciplineSlug: discipline.slug, theorySlug: "teacher-professional-identity", relevance: "primary" }],
  );
  assert.equal(plan.theoryScholars.some((relation) => relation.theorySlug === "life-course-perspective"), false);
});

test("a published field whose discipline is not published is refused before a write", () => {
  const corpus = structuredClone(seedCorpus);
  corpus.fields.push({
    ...corpus.fields[0],
    slug: "published-import-fixture-field",
    disciplineSlug: "education",
    status: "published",
    publishedAt,
  });
  assert.throws(() => planPublishedImport(corpus), /published discipline \(education\)/);
});

test("connection strings are redacted from importer errors", () => {
  const secret = ["postgresql", "://", "app-user", ":", "secret-token", "@", "ep-example", ".eu-central-1.aws.", "neon.tech", "/db"].join("");
  const redacted = redactConnectionSecrets(`failed ${secret}`);
  assert.equal(redacted.includes("secret-token"), false);
  assert.equal(redacted.includes("app-user"), false);
  assert.equal(redacted.includes("ep-example"), false);
  assert.match(redacted, /\[redacted-database-url\]/);

  const host = ["ep-example", ".eu-central-1.aws.", "neon.tech:5432"].join("");
  const redactedHost = redactConnectionSecrets(`Can't reach database server at \`${host}\``);
  assert.equal(redactedHost.includes("ep-example"), false);
  assert.equal(redactedHost.includes("neon.tech"), false);
  assert.equal(
    redactConnectionSecrets("published-import dry-run\ntheories: 4"),
    "published-import dry-run\ntheories: 4",
  );
});

type UpsertCall = {
  model: string;
  action: string;
  args: { where: Record<string, unknown>; create: Record<string, unknown> };
};

interface FakeDelegate {
  upsert: (args: UpsertCall["args"]) => Promise<{ id: string }>;
  deleteMany: () => Promise<never>;
}

interface FakeImportDb {
  calls: UpsertCall[];
  ids: Map<string, string>;
  wasOpened: () => boolean;
  discipline: FakeDelegate;
  field: FakeDelegate;
  theory: FakeDelegate;
  work: FakeDelegate;
  concept: FakeDelegate;
  scholar: FakeDelegate;
  topic: FakeDelegate;
  disciplineTheory: FakeDelegate;
  fieldTheory: FakeDelegate;
  theoryWork: FakeDelegate;
  theoryConcept: FakeDelegate;
  theoryScholar: FakeDelegate;
  topicTheory: FakeDelegate;
  theoryGenealogy: FakeDelegate;
  verification: FakeDelegate;
  $transaction: (fn: (tx: FakeImportDb) => Promise<void>) => Promise<void>;
  $disconnect: () => Promise<void>;
}

function createFakeImportDb(): FakeImportDb {
  const calls: UpsertCall[] = [];
  const ids = new Map<string, string>();
  let sequence = 0;
  let opened = false;

  function idFor(model: string, key: string) {
    const mapKey = `${model}:${key}`;
    const existing = ids.get(mapKey);
    if (existing) return existing;
    const id = `${model}-${++sequence}`;
    ids.set(mapKey, id);
    return id;
  }

  function entity(model: string): FakeDelegate {
    return {
      upsert: async (args) => {
        const slug = args.where.slug;
        if (typeof slug !== "string") throw new Error(`upsert ${model} requires a slug`);
        calls.push({ model, action: "upsert", args });
        return { id: idFor(model, slug) };
      },
      deleteMany: async () => {
        throw new Error(`deleteMany ${model}`);
      },
    };
  }

  function relation(model: string): FakeDelegate {
    return {
      upsert: async (args) => {
        calls.push({ model, action: "upsert", args });
        return { id: idFor(model, JSON.stringify(args.where)) };
      },
      deleteMany: async () => {
        throw new Error(`deleteMany ${model}`);
      },
    };
  }

  const db: FakeImportDb = {
    calls,
    ids,
    wasOpened: () => opened,
    discipline: entity("discipline"),
    field: entity("field"),
    theory: entity("theory"),
    work: entity("work"),
    concept: entity("concept"),
    scholar: entity("scholar"),
    topic: entity("topic"),
    disciplineTheory: relation("disciplineTheory"),
    fieldTheory: relation("fieldTheory"),
    theoryWork: relation("theoryWork"),
    theoryConcept: relation("theoryConcept"),
    theoryScholar: relation("theoryScholar"),
    topicTheory: relation("topicTheory"),
    theoryGenealogy: relation("theoryGenealogy"),
    verification: relation("verification"),
    $transaction: async (fn) => {
      opened = true;
      await fn(db);
    },
    $disconnect: async () => undefined,
  };
  return db;
}

function fixtureCorpus(): SeedCorpus {
  const content = { en: { sources: [] } };
  const published = { status: "published" as const, publishedAt, content };
  return {
    disciplines: [{ slug: "fixture-discipline", titleEn: "Fixture", descriptionEn: "Fixture", overviewEn: "Fixture", ...published }],
    fields: [{ slug: "fixture-field", titleEn: "Fixture field", descriptionEn: "Fixture", disciplineSlug: "fixture-discipline", ...published }],
    theories: [
      { slug: "fixture-theory", primary: false, depth: "D1", titleEn: "Fixture theory", summaryEn: "Fixture", ...published },
      { slug: "fixture-draft-theory", primary: false, depth: "D1", titleEn: "Draft", summaryEn: "Draft", status: "draft", content },
      { slug: "communities-of-practice", primary: false, depth: "D1", titleEn: "Archived", summaryEn: "Archived", ...published },
    ],
    works: [
      { slug: "fixture-work", title: "Fixture work", authors: [{ name: "Fixture" }], year: 2004, publisher: "Fixture Press", doi: "10.0000/fixture", ...published },
      { slug: "cop-wenger-1998", title: "Archived work", authors: [{ name: "Archived" }], year: 1998, ...published },
    ],
    concepts: [{ slug: "fixture-concept", termEn: "Fixture", definitionEn: "Fixture", ...published }],
    scholars: [{ slug: "fixture-scholar", name: "Fixture Scholar", bioEn: "Fixture", ...published }],
    topics: [{ slug: "fixture-topic", questionEn: "Fixture?", ...published }],
    disciplineTheories: [{ disciplineSlug: "fixture-discipline", theorySlug: "fixture-theory", relevance: "primary" }],
    fieldTheories: [{ fieldSlug: "fixture-field", theorySlug: "fixture-theory" }],
    theoryWorks: [
      { theorySlug: "fixture-theory", workSlug: "fixture-work", relationship: "synthesis", sourceUrls: [], evidenceNotesEn: "Fixture" },
      { theorySlug: "fixture-theory", workSlug: "cop-wenger-1998", relationship: "synthesis", sourceUrls: [], evidenceNotesEn: "Archived" },
      { theorySlug: "fixture-draft-theory", workSlug: "fixture-work", relationship: "synthesis", sourceUrls: [], evidenceNotesEn: "Draft" },
    ],
    theoryConcepts: [{ theorySlug: "fixture-theory", conceptSlug: "fixture-concept", importance: "core" }],
    theoryScholars: [{ theorySlug: "fixture-theory", scholarSlug: "fixture-scholar", role: "key_contributor", sourceUrls: [], evidenceNotesEn: "Fixture" }],
    topicTheories: [{
      topicSlug: "fixture-topic",
      theorySlug: "fixture-theory",
      suitability: "medium",
      suitabilityNotesEn: "Fixture",
      recommendation: "supporting",
      sourceUrls: [],
      evidenceNotesEn: "Fixture",
    }],
    genealogy: [{
      id: "fixture-edge",
      sourceSlug: "fixture-theory",
      targetSlug: "fixture-theory",
      relationType: "integrated_with",
      descriptionEn: "Fixture",
      strength: 1,
    }],
    verifications: [{
      entitySlug: "fixture-theory",
      fieldPath: "content_jsonb.en.sources",
      level: "L1_verified",
      sources: [],
      notes: "Fixture",
      verifiedAt: publishedAt,
    }],
  } as unknown as SeedCorpus;
}

test("apply upserts the published plan twice without deleting or duplicating", async () => {
  const plan = planPublishedImport(fixtureCorpus());
  assert.equal(plan.theories.some((record) => record.slug === "communities-of-practice"), false);
  assert.equal(plan.theories.some((record) => record.slug === "fixture-draft-theory"), false);
  assert.equal(plan.works.some((record) => record.slug === "cop-wenger-1998"), false);
  assert.equal(plan.theoryWorks.some((relation) => relation.workSlug === "cop-wenger-1998"), false);
  assert.equal(plan.counts.theories, 1);
  assert.equal(plan.counts.works, 1);
  assert.equal(plan.counts.theoryWorks, 1);

  const db = createFakeImportDb();
  await applyPublishedImport(db as unknown as PrismaClient, plan);
  await applyPublishedImport(db as unknown as PrismaClient, plan);

  assert.equal(db.calls.every((call) => call.action === "upsert"), true);
  assert.equal(db.calls.length, 30);
  assert.equal(db.ids.size, 15);
  const fieldCall = db.calls.find((call) => call.model === "field");
  const disciplineId = db.ids.get("discipline:fixture-discipline");
  assert.equal(fieldCall?.args.create.disciplineId, disciplineId);
  assert.equal(fieldCall?.args.create.status, "published");
  assert.equal(db.calls.some((call) => JSON.stringify(call.args.where) === "{}"), false);
});

test("apply refuses an archived slug or an unpublished endpoint before opening a transaction", async () => {
  const plan = planPublishedImport(fixtureCorpus());
  const archivedPlan = structuredClone(plan);
  archivedPlan.theories.push({
    ...plan.theories[0],
    slug: "life-course-theory",
  });
  const archivedDb = createFakeImportDb();
  await assert.rejects(() => applyPublishedImport(archivedDb as unknown as PrismaClient, archivedPlan), /Refusing to write archived theory life-course-theory/);
  assert.equal(archivedDb.wasOpened(), false);

  const danglingPlan = structuredClone(plan);
  danglingPlan.theoryWorks.push({
    theorySlug: "fixture-theory",
    workSlug: "elder-1998-life-course",
    relationship: "synthesis",
    sourceUrls: [],
    evidenceNotesEn: "Archived",
  });
  const danglingDb = createFakeImportDb();
  await assert.rejects(() => applyPublishedImport(danglingDb as unknown as PrismaClient, danglingPlan), /elder-1998-life-course/);
  assert.equal(danglingDb.wasOpened(), false);
});

test("the importer script does not call seed or delete rows", () => {
  const sources = [
    "scripts/import-published.ts",
    "src/lib/published-import.ts",
    "src/lib/published-import-apply.ts",
  ].map((path) => readFileSync(join(root, path), "utf8")).join("\n");

  assert.equal(sources.includes("deleteMany"), false);
  assert.equal(sources.includes("truncate"), false);
  assert.equal(sources.includes("prisma/seed"), false);
  assert.equal(sources.includes("$executeRaw"), false);
  assert.equal(sources.includes("executeRawUnsafe"), false);
  assert.doesNotMatch(sources, /from\s+["'][^"']*seed\.ts["']/);
  assert.doesNotMatch(sources, /db:reset|migrate reset/);

  const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { scripts: Record<string, string> };
  assert.equal(packageJson.scripts["db:seed"], "npx prisma db seed");
  assert.match(packageJson.scripts["db:import-published"], /scripts\/import-published\.ts/);
  assert.doesNotMatch(packageJson.scripts["vercel-build"], /import-published|db:seed|db:reset/);
  assert.doesNotMatch(readFileSync(join(root, "scripts/vercel-build.mjs"), "utf8"), /import-published|db:seed|db:reset/);

  const note = readFileSync(join(root, "docs/published-import.md"), "utf8");
  assert.match(note, /--dry-run/);
  assert.match(note, /not `npm run db:seed`/);
  assert.match(note, /vercel-build/);
  assert.match(note, /AdSense/);
  assert.match(readFileSync(join(root, "docs/deploy-vercel.md"), "utf8"), /db:import-published/);
});

function runImporter(args: string[]) {
  const env = { ...process.env };
  delete env.DATABASE_URL;
  delete env.DIRECT_URL;
  return spawnSync(process.execPath, ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "--experimental-strip-types", "scripts/import-published.ts", ...args], {
    cwd: root,
    encoding: "utf8",
    env,
  });
}

function assertNoConnectionLeak(output: string) {
  if (/postgres(?:ql)?:\/\//i.test(output) || /neon\.tech|supabase\.co|DATABASE_URL\s*=|DIRECT_URL\s*=/i.test(output)) {
    assert.fail("importer output contained a connection string");
  }
}

test("dry-run prints counts and does not require a database", () => {
  const result = runImporter(["--dry-run"]);
  const output = `${result.stdout}${result.stderr}`;
  assertNoConnectionLeak(output);
  assert.equal(result.status, 0);
  assert.equal(result.stdout, `${formatPublishedImportCounts(planPublishedImport(seedCorpus), "dry-run")}\n`);
  assert.equal(result.stderr, "");
});

test("apply without DATABASE_URL stops before writing", () => {
  const result = runImporter([]);
  const output = `${result.stdout}${result.stderr}`;
  assertNoConnectionLeak(output);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /DATABASE_URL is required/);
  assert.doesNotMatch(result.stdout, /applied/);
});

test("unknown importer arguments are rejected", () => {
  const result = runImporter(["--apply-now"]);
  const output = `${result.stdout}${result.stderr}`;
  assertNoConnectionLeak(output);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown argument/);
});
