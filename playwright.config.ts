import { defineConfig, devices } from "@playwright/test";

const artifactRoot = "node_modules/.cache/syrtag-playwright";

function parsePlaywrightPort(value = "3000") {
  if (!/^[1-9]\d{0,4}$/.test(value)) {
    throw new Error("Invalid PLAYWRIGHT_PORT: expected a decimal port from 1 to 65535.");
  }

  const port = Number(value);

  if (port > 65_535) {
    throw new Error("Invalid PLAYWRIGHT_PORT: expected a decimal port from 1 to 65535.");
  }

  return String(port);
}

const playwrightPort = parsePlaywrightPort(process.env.PLAYWRIGHT_PORT);
const playwrightBaseUrl = `http://127.0.0.1:${playwrightPort}`;

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "*.spec.ts",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: `${artifactRoot}/html-report`, open: "never" }],
    ["junit", { outputFile: `${artifactRoot}/junit/results.xml` }],
  ],
  outputDir: `${artifactRoot}/test-results`,
  globalSetup: "./tests/e2e/fresh-build-preflight.ts",
  use: {
    baseURL: playwrightBaseUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: `node --experimental-strip-types tests/e2e/fresh-build-preflight-cli.ts && npm run start -- --hostname 127.0.0.1 --port ${playwrightPort}`,
    url: playwrightBaseUrl,
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === "1",
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
