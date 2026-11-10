import { PrismaPg } from "@prisma/adapter-pg";
import prismaClientPackage from "@prisma/client";

import { seedCorpus } from "../src/data/seed-content.ts";
import { validateSeedCorpus } from "../src/lib/content-validation.ts";
import { applyPublishedImport } from "../src/lib/published-import-apply.ts";
import {
  formatPublishedImportCounts,
  planPublishedImport,
  redactConnectionSecrets,
} from "../src/lib/published-import.ts";

const { PrismaClient } = prismaClientPackage;

function errorText(error: unknown): string {
  if (error instanceof Error) {
    const record = error as Error & { code?: unknown };
    const code = typeof record.code === "string" ? ` ${record.code}` : "";
    return `${record.name}${code}: ${record.message}`;
  }
  return "Published import failed.";
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--dry-run")) {
    throw new Error("Unknown argument. Use --dry-run, or pass no arguments to apply.");
  }

  const validation = validateSeedCorpus(seedCorpus);
  if (validation.errors.length > 0) {
    throw new Error(`Published import validation failed.\n${validation.errors.join("\n")}`);
  }

  const plan = planPublishedImport(seedCorpus);
  if (args.includes("--dry-run")) {
    console.log(formatPublishedImportCounts(plan, "dry-run"));
    return;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to import published records. Dry-run does not need it.");
  }

  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString, max: 1 }),
    log: [],
  });
  try {
    await applyPublishedImport(db, plan);
    console.log(formatPublishedImportCounts(plan, "applied"));
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(redactConnectionSecrets(errorText(error)));
  process.exit(1);
});
