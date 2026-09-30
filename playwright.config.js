import { defineConfig, devices } from '@playwright/test'

const brand = process.env.BRAND === 'example' ? 'example' : 'ideastime'
const port = 3456

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: false,
  projects: [{ name: brand, use: { ...devices['Desktop Chrome'] } }],
  reporter: [['list']],
  retries: process.env.CI ? 1 : 0,
  testDir: './test/e2e',
  testMatch: '**/*.e2e.ts',
  use: { baseURL: `http://localhost:${port}`, trace: 'retain-on-failure' },
  webServer: {
    command: `pnpm dev --port ${port}`,
    env: { ...process.env, BRAND: brand, DATABASE_URL: `file:./dev/e2e-${brand}.db` },
    // Never attach to an already-running server: it may serve the other brand or a stale build.
    reuseExistingServer: false,
    timeout: 180_000,
    url: `http://localhost:${port}/admin`,
  },
  workers: 1,
})
