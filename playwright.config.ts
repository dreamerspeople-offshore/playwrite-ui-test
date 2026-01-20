import { defineConfig, devices } from '@playwright/test';
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  testDir: "./tests", // or './tests' — wherever you chose
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html", // or 'list', 'dot', 'github'

  use: {
    baseURL: process.env.UI_BASE_URL, // ← very important for Angular
    trace: "on-first-retry", // or 'on', 'retain-on-failure'
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  // Crucial: start Angular dev server automatically
  webServer: {
    command: "ng serve --port 4200",
    port: 4200,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // You can add more later:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari'] } },
  ],
});
