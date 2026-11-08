import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import test from "node:test";

import { prismaPoolConfig } from "../src/lib/db.ts";

const read = (path: string) => readFileSync(path, "utf8");

function workflowFiles(directory = ".github/workflows"): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const path = `${directory}/${entry}`;
    if (statSync(path).isDirectory()) return workflowFiles(path);
    return /\.ya?ml$/.test(entry) ? [path] : [];
  });
}

test("GitHub Actions no longer SSHes to the self-hosted origin", () => {
  const files = workflowFiles();
  assert.equal(existsSync(".github/workflows/deploy-production.yml"), false);
  assert.equal(files.length, 0, `unexpected workflows: ${files.join(", ")}`);
  const combined = files.map(read).join("\n");
  assert.doesNotMatch(combined, /\bssh\b|\bscp\b|SYRTAG_DEPLOY_|\/var\/www\/syrtag\.com/);
});

test("retired host scripts refuse to run and are not the Vercel path", () => {
  const deploy = read("ops/deploy-production.sh");
  const rollback = read("ops/rollback-production.sh");

  for (const script of [deploy, rollback]) {
    assert.match(script, /SYRTAG_ALLOW_SELF_HOST_DEPLOY/);
    assert.match(script, /docs\/deploy-vercel\.md/);
    assert.match(script, /exit 1/);
  }

  assert.doesNotMatch(read("package.json"), /deploy-production\.sh|rollback-production\.sh/);
  assert.doesNotMatch(read("vercel.json"), /ssh|scp|deploy-production\.sh/);
});

test("Vercel build generates the Prisma client and does not seed or reset", () => {
  const packageJson = JSON.parse(read("package.json")) as {
    engines: { node: string };
    scripts: Record<string, string>;
  };
  const vercelBuild = read("scripts/vercel-build.mjs");
  const vercelConfig = JSON.parse(read("vercel.json")) as {
    framework: string;
    buildCommand: string;
    redirects: Array<{ source: string; destination: string; has: Array<{ value: string }> }>;
  };
  const nextConfig = read("next.config.ts");

  assert.equal(packageJson.engines.node, "22.x");
  assert.match(read(".node-version"), /^22\s*$/);
  assert.match(packageJson.scripts.build, /prisma generate && next build/);
  assert.equal(packageJson.scripts["vercel-build"], "node scripts/vercel-build.mjs && next build");
  assert.equal(packageJson.scripts["db:migrate:deploy"], "prisma migrate deploy");
  assert.match(packageJson.scripts["db:migrate"], /prisma migrate dev/);
  assert.match(vercelBuild, /generate/);
  assert.match(vercelBuild, /migrate", "deploy"/);
  assert.match(vercelBuild, /does not seed/);
  assert.doesNotMatch(vercelBuild, /db:seed|migrate reset|migrate dev|db push/);
  assert.equal(vercelConfig.framework, "nextjs");
  assert.equal(vercelConfig.buildCommand, "npm run vercel-build");
  assert.ok(vercelConfig.redirects.some((redirect) =>
    redirect.has.some((condition) => condition.value === "www.syrtag.com")
    && redirect.destination.startsWith("https://syrtag.com"),
  ));
  assert.match(nextConfig, /@prisma\/adapter-pg/);
  assert.doesNotMatch(nextConfig, /output:\s*["'](?:export|standalone)["']/);
  assert.match(read("prisma.config.ts"), /DIRECT_URL \|\| process\.env\.DATABASE_URL/);
});

test("serverless Prisma pool uses one connection on Vercel", () => {
  assert.deepEqual(prismaPoolConfig("postgresql://example", { VERCEL: "1" }), {
    connectionString: "postgresql://example",
    max: 1,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true,
  });
  assert.deepEqual(prismaPoolConfig("postgresql://example", {}), {
    connectionString: "postgresql://example",
  });
});

test("cutover docs name the operator steps and keep ads and seed closed", () => {
  const doc = read("docs/deploy-vercel.md");
  const example = read(".env.example");
  const readme = read("README.md");

  for (const required of [
    "DATABASE_URL",
    "DIRECT_URL",
    "NEXT_PUBLIC_SITE_URL",
    "https://syrtag.com",
    "prisma migrate deploy",
    "db:reset",
    "AdSense",
    "published",
    "Cloudflare",
    "www.syrtag.com",
  ]) {
    assert.match(doc, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(doc, /does not seed|do not seed|does not run `npm run db:seed`/i);
  assert.match(example, /NEXT_PUBLIC_SITE_URL="https:\/\/syrtag\.com"/);
  assert.doesNotMatch(example, /postgres(ql)?:\/\/[^"\n]*@(?:ep-|aws-|neon\.tech|supabase\.co)/i);
  assert.match(readme, /docs\/deploy-vercel\.md/);
  assert.match(readme, /Advertising is off/);
  assert.match(doc, /Advertising stays off/);
  assert.doesNotMatch(doc, /ca-pub-\d|adsbygoogle\.js/);
});
