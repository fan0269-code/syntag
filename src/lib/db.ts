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

export function createPrismaClient(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) {
    return undefined;
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
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
