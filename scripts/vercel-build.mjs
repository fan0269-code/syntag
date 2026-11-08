import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const prismaBin = existsSync("node_modules/.bin/prisma")
  ? "node_modules/.bin/prisma"
  : "prisma";

function run(args) {
  const result = spawnSync(prismaBin, args, {
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(["generate"]);

const migrateFlag = process.env.PRISMA_MIGRATE_ON_BUILD;
if (migrateFlag === undefined || migrateFlag === "" || migrateFlag === "0") {
  console.log("Skipping prisma migrate deploy. Set PRISMA_MIGRATE_ON_BUILD=1 on Vercel Production after the database exists.");
} else if (migrateFlag !== "1") {
  console.error("PRISMA_MIGRATE_ON_BUILD must be unset, 0, or 1.");
  process.exit(1);
} else if (!process.env.DIRECT_URL && !process.env.DATABASE_URL) {
  console.error("PRISMA_MIGRATE_ON_BUILD=1 requires DIRECT_URL or DATABASE_URL. No migration was applied.");
  process.exit(1);
} else {
  if (!process.env.DIRECT_URL) {
    console.warn("DIRECT_URL is unset. migrate deploy will use DATABASE_URL. That URL must be a direct Postgres connection, not a transaction pooler.");
  }
  console.log("Running prisma migrate deploy. This build does not seed and does not reset the database.");
  run(["migrate", "deploy"]);
}
