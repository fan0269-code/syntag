import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export class DatabaseUnavailableError extends Error {
  constructor(message = "Database is not configured") {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

const connectionErrorCodes = new Set(["P1000", "P1001", "P1002", "P1008", "P1017", "P2010", "N/A"]);

function prismaErrorDetails(error: unknown) {
  if (typeof error !== "object" || error === null) return { name: undefined, code: undefined };
  const record = error as { name?: unknown; code?: unknown };
  return {
    name: typeof record.name === "string" ? record.name : undefined,
    code: typeof record.code === "string" ? record.code : undefined,
  };
}

export function isDatabaseUnavailableError(error: unknown) {
  return error instanceof DatabaseUnavailableError
    || error instanceof Prisma.PrismaClientInitializationError
    || error instanceof Prisma.PrismaClientUnknownRequestError
    || error instanceof Prisma.PrismaClientRustPanicError
    || (error instanceof Prisma.PrismaClientKnownRequestError && connectionErrorCodes.has(error.code))
    || (() => {
      const details = prismaErrorDetails(error);
      return details.name === "PrismaClientInitializationError"
        || details.name === "PrismaClientUnknownRequestError"
        || details.name === "PrismaClientRustPanicError"
        || (details.name === "PrismaClientKnownRequestError" && (details.code === undefined || connectionErrorCodes.has(details.code)));
    })();
}

type RuntimePoolConfig = {
  connectionString: string;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
  allowExitOnIdle?: boolean;
};

type PoolEnv = {
  VERCEL?: string;
  NEXT_PHASE?: string;
};

/** Next.js sets this on the build process and copies it into the static worker. */
const PRODUCTION_BUILD_PHASE = "phase-production-build";

/**
 * Default `experimental.staticGenerationMaxConcurrency` in Next.js 16.
 * One worker renders this many pages at once. Entity routes also run
 * `generateMetadata` and the page together, so a page can hold two clients.
 */
const BUILD_PAGE_CONCURRENCY = 8;

/** One connection per Vercel isolate. The production build is one long-lived worker, not an isolate. */
export function prismaPoolConfig(
  connectionString: string,
  env: PoolEnv = {
    VERCEL: process.env.VERCEL,
    NEXT_PHASE: process.env.NEXT_PHASE,
  },
): RuntimePoolConfig {
  // `pg` reports a full pool as "timeout exceeded when trying to connect".
  // That is the checkout queue, not a failed TCP handshake. Vercel sets
  // VERCEL=1 for `next build` as well as for serverless isolates. The static
  // worker prerenders several published pages at once, so the isolate cap
  // makes later checkouts wait out connectionTimeoutMillis and fail the export.
  if (env.VERCEL === "1" && env.NEXT_PHASE === PRODUCTION_BUILD_PHASE) {
    return {
      connectionString,
      max: BUILD_PAGE_CONCURRENCY * 2,
      idleTimeoutMillis: 60_000,
      connectionTimeoutMillis: 30_000,
      allowExitOnIdle: false,
    };
  }

  if (env.VERCEL === "1") {
    return {
      connectionString,
      max: 1,
      idleTimeoutMillis: 5_000,
      connectionTimeoutMillis: 10_000,
      allowExitOnIdle: true,
    };
  }

  return { connectionString };
}

export function createPrismaClient(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) {
    return undefined;
  }

  return new PrismaClient({
    adapter: new PrismaPg(prismaPoolConfig(connectionString)),
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && db) {
  globalForPrisma.prisma = db;
}

export function getDb(): PrismaClient {
  if (!db) throw new DatabaseUnavailableError();
  return db;
}
