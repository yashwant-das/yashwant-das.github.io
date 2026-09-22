import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Node, not `python3 -m http.server`: the latter reset connections under the
    // concurrency of parallel workers (net::ERR_CONNECTION_RESET), which made the
    // suite fail 5-6 random tests per run. See scripts/serve.mjs.
    command: 'node scripts/serve.mjs 8000',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
  },
});
