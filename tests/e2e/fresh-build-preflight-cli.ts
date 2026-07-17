import freshBuildPreflight from "./fresh-build-preflight.ts";

freshBuildPreflight().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
