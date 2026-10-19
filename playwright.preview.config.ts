import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'learning.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4300/ParleItaliano/',
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
      : {},
  },
  projects: [{ name: 'static-chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build:preview && node scripts/serve-preview.mjs --port 4300',
    url: 'http://127.0.0.1:4300/ParleItaliano/',
    reuseExistingServer: false,
    timeout: 180000,
    env: { NEXT_PUBLIC_BASE_PATH: '/ParleItaliano', NEXT_TELEMETRY_DISABLED: '1' },
  },
});
