import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const checkedSources = [
  "src",
  "package.json",
  "package-lock.json",
] as const;

async function pathExists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function latestMtimeMs(filePath: string): Promise<number> {
  const entry = await stat(filePath);

  if (!entry.isDirectory()) return entry.mtimeMs;

  const children = await readdir(filePath, { withFileTypes: true });
  const childTimes = await Promise.all(
    children.map((child) => latestMtimeMs(path.join(filePath, child.name))),
  );

  return Math.max(entry.mtimeMs, ...childTimes);
}

export default async function freshBuildPreflight() {
  const root = process.cwd();
  const buildIdPath = path.join(root, ".next", "BUILD_ID");

  if (!(await pathExists(buildIdPath))) {
    throw new Error(
      "Playwright E2E requires an existing production build: .next/BUILD_ID was not found. Run db:migrate, db:seed, then npm run build explicitly before npm run test:e2e.",
    );
  }

  const buildTime = await latestMtimeMs(buildIdPath);
  const sourceTimes = await Promise.all(
    checkedSources.map(async (source) => ({
      source,
      mtimeMs: await latestMtimeMs(path.join(root, source)),
    })),
  );
  const newestSource = sourceTimes.reduce((newest, current) => (
    current.mtimeMs > newest.mtimeMs ? current : newest
  ));

  if (newestSource.mtimeMs > buildTime + 1) {
    throw new Error(
      `Playwright E2E requires a fresh production build. .next/BUILD_ID is older than ${newestSource.source}. Run db:migrate, db:seed, then npm run build explicitly; test:e2e will not run build or database commands implicitly.`,
    );
  }
}
