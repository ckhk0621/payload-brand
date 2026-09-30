// Proves the fail-soft claim: with every payload-brand entry removed from the importMap, the admin
// still renders its login form (components vanish silently; nothing blanks the page).
// `--no-strip` skips the removal and must FAIL, which proves this check can detect branding.
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import { copyFileSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const importMap = path.join(root, 'dev', 'app', '(payload)', 'admin', 'importMap.js')
const backup = `${importMap}.failsoft-backup`
const port = 3458
const base = `http://localhost:${port}`
const strip = !process.argv.includes('--no-strip')

async function waitFor(url, timeoutMs) {
  const until = Date.now() + timeoutMs
  while (Date.now() < until) {
    try {
      if ((await fetch(url)).ok) {
        return
      }
    } catch {
      // server not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  throw new Error(`timed out waiting for ${url}`)
}

const original = readFileSync(importMap, 'utf8')
const lines = original.split('\n')
const kept = lines.filter((line) => !line.includes('"@ideastime/payload-brand/rsc#'))
const removed = lines.length - kept.length
if (removed === 0) {
  console.error('failsoft-check: no payload-brand entries in the importMap; run pnpm generate:importmap first')
  process.exit(1)
}
copyFileSync(importMap, backup)
if (strip) {
  writeFileSync(importMap, kept.join('\n'))
}

const server = spawn('pnpm', ['dev', '--port', String(port)], {
  cwd: root,
  detached: true,
  env: { ...process.env, BRAND: 'ideastime', DATABASE_URL: 'file:./dev/e2e-failsoft.db' },
  stdio: 'ignore',
})
let failed = false
try {
  await waitFor(`${base}/admin`, 180_000)
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(`${base}/admin/login`, { waitUntil: 'networkidle' })
  const formVisible = await page.locator('#field-email').isVisible()
  const brandElements = await page.locator('.pb-logo, .pb-login-footer').count()
  await browser.close()
  console.log(
    `failsoft-check: ${strip ? `removed ${removed}` : 'kept all'} importMap entries; login form visible=${formVisible}; payload-brand elements=${brandElements}`,
  )
  failed = !formVisible || brandElements !== 0
} catch (error) {
  console.error(`failsoft-check: ${error instanceof Error ? error.message : String(error)}`)
  failed = true
} finally {
  try {
    process.kill(-server.pid, 'SIGTERM')
  } catch {
    // already gone
  }
  copyFileSync(backup, importMap)
  rmSync(backup)
}
console.log(failed ? 'failsoft-check: FAILED' : 'failsoft-check: PASSED')
process.exit(failed ? 1 : 0)
