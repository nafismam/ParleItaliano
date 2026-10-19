import { randomUUID } from 'node:crypto';
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3100',
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
      : {},
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  ...(process.env.E2E_BASE_URL
    ? {}
    : {
        webServer: {
          command: 'npm run build && npm run start --workspace=@parle/web -- --port 3100',
          url: 'http://localhost:3100/api/health',
          reuseExistingServer: false,
          timeout: 180000,
          env: {
            NEXT_TELEMETRY_DISABLED: '1',
            APP_ORIGIN: 'http://localhost:3100',
            AUTH_URL: 'http://localhost:3100',
            RATE_LIMIT_NAMESPACE: `e2e-${randomUUID()}`,
          },
        },
      }),
});
