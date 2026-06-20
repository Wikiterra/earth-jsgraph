import { defineConfig } from "@playwright/test";

// Characterization harness: boots each app's Vite dev server on a fixed port and
// snapshots the math-engine output. This is the Phase 2 safety net — run with
// `--update-snapshots` to (re)generate baselines, plain to verify against them.

const EDC_PORT = 5301;
const FED_PORT = 5302;

export default defineConfig({
  testDir: "tools/characterization",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    headless: true,
    viewport: { width: 1280, height: 900 },
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: [
    {
      command: `pnpm --filter earth-drop-calc exec vite --port ${EDC_PORT} --strictPort`,
      port: EDC_PORT,
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: `pnpm --filter fed-wabis-v2 exec vite --port ${FED_PORT} --strictPort`,
      port: FED_PORT,
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
});
