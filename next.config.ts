import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the driver adapter and its client external so the Vercel Node
  // function loads the generated Prisma client instead of bundling it.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
