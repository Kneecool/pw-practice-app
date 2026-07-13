import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the PW Practice App (ngx-admin).
 *
 * The dev server (`ng serve`) is started automatically on port 4200 before the
 * suite runs and reused if it is already up, so `npx playwright test` is enough
 * to run everything from a clean checkout.
 */
/**
 * Point the suite at an already-running dev server by setting PW_BASE_URL
 * (e.g. `PW_BASE_URL=http://localhost:4401`). When unset, Playwright starts
 * `ng serve` on port 4200 itself.
 */
const externalBaseURL = process.env.PW_BASE_URL;
const baseURL = externalBaseURL || 'http://localhost:4200';

export default defineConfig({
  testDir: './tests',
  /* Nebular animations + Angular dev-mode make actions a touch slow. */
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    /* Watchtower's Patrol runner sets PLAYWRIGHT_JSON_OUTPUT_NAME so it can
     * consume the JSON results post-run; fall back to a local file otherwise. */
    ['json', { outputFile: process.env.PLAYWRIGHT_JSON_OUTPUT_NAME ?? 'test-results.json' }],
  ],

  use: {
    baseURL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Auto-start the Angular dev server unless an external one was provided. */
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'npm start',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
