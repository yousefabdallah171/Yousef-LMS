import { defineConfig, devices } from '@playwright/test'

const frontendBaseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173'
const apiBaseURL = process.env.PLAYWRIGHT_API_URL ?? 'http://localhost:3000'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  workers: 2,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  reporter: 'list',
  metadata: {
    apiBaseURL,
  },
  use: {
    baseURL: frontendBaseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
