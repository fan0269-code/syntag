import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node --experimental-strip-types prisma/seed.ts",
  },
  datasource: {
    // CLI migrations need a direct connection. The Next.js runtime uses
    // DATABASE_URL (pooled on Vercel) through the driver adapter in src/lib/db.ts.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
