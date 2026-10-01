// Release acceptance: installs a tagged payload-brand into a throwaway Payload app via git, exactly
// as client projects consume it (node_modules/dist, no tsconfig paths), and checks the admin is
// branded. Usage: pnpm test:consumer v1.0.0   (KEEP_CONSUMER=1 keeps the temp app for debugging)
import { chromium } from '@playwright/test'
import { execFileSync, spawn } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const tag = process.argv[2]
if (!/^v\d+\.\d+\.\d+$/.test(tag ?? '')) {
  console.error('usage: pnpm test:consumer v<major.minor.patch>')
  process.exit(1)
}
execFileSync('git', ['rev-parse', '--verify', `refs/tags/${tag}`], { cwd: root, stdio: 'ignore' })

const port = 3459
const base = `http://localhost:${port}`
const dir = mkdtempSync(path.join(tmpdir(), 'payload-brand-consumer-'))
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
const pick = (names) => Object.fromEntries(names.map((name) => [name, pkg.devDependencies[name]]))

writeFileSync(
  path.join(dir, 'package.json'),
  JSON.stringify(
    {
      dependencies: {
        '@ideastime/payload-brand': `git+file://${root}#${tag}`,
        ...pick([
          '@payloadcms/db-sqlite',
          '@payloadcms/next',
          '@payloadcms/richtext-lexical',
          '@payloadcms/ui',
          'graphql',
          'next',
          'payload',
          'react',
          'react-dom',
          'sharp',
        ]),
      },
      devDependencies: pick(['@types/node', '@types/react', '@types/react-dom', 'typescript']),
      name: 'payload-brand-consumer',
      pnpm: pkg.pnpm,
      private: true,
      type: 'module',
    },
    null,
    2,
  ),
)
cpSync(path.join(root, 'dev'), path.join(dir, 'dev'), {
  filter: (src) => !/[/\\](?:\.next|media)(?:[/\\]|$)|\.db/.test(src),
  recursive: true,
})
// The dev app imports the plugin from ../src; a consumer imports the installed package.
for (const file of ['payload.config.ts', 'brands.ts']) {
  const target = path.join(dir, 'dev', file)
  const source = readFileSync(target, 'utf8')
  const rewritten = source
    .replaceAll("'../src/index.js'", "'@ideastime/payload-brand'")
    .replaceAll("'../src/types.js'", "'@ideastime/payload-brand'")
  if (rewritten === source) {
    console.error(`consumer-check: dev/${file} has no ../src import to rewrite; the check would not test the package`)
    rmSync(dir, { force: true, recursive: true })
    process.exit(1)
  }
  writeFileSync(target, rewritten)
}
// The repo's dev tsconfig maps the package to ../src; a consumer must resolve node_modules.
writeFileSync(
  path.join(dir, 'dev', 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        allowJs: true,
        esModuleInterop: true,
        incremental: true,
        isolatedModules: true,
        jsx: 'preserve',
        lib: ['DOM', 'DOM.Iterable', 'ES2022'],
        // NodeNext like the repo: Turbopack maps './x.js' imports to './x.ts' only under it.
        module: 'NodeNext',
        moduleResolution: 'nodenext',
        noEmit: true,
        paths: { '@payload-config': ['./payload.config.ts'] },
        plugins: [{ name: 'next' }],
        resolveJsonModule: true,
        skipLibCheck: true,
        strict: false,
        target: 'ES2022',
      },
      exclude: ['node_modules'],
      include: ['**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    },
    null,
    2,
  ),
)

const env = {
  ...process.env,
  BRAND: 'demo',
  DATABASE_URL: 'file:./dev/consumer.db',
  PAYLOAD_CONFIG_PATH: './dev/payload.config.ts',
}
let server
let failed = false
try {
  execFileSync('pnpm', ['install'], { cwd: dir, stdio: 'inherit' })
  execFileSync('pnpm', ['exec', 'payload', 'generate:importmap'], { cwd: dir, env, stdio: 'inherit' })
  server = spawn('pnpm', ['exec', 'next', 'dev', 'dev', '--port', String(port)], {
    cwd: dir,
    detached: true,
    env,
    stdio: 'ignore',
  })
  const until = Date.now() + 180_000
  for (;;) {
    try {
      if ((await fetch(`${base}/admin`)).ok) {
        break
      }
    } catch {
      // not up yet
    }
    if (Date.now() > until) {
      throw new Error('consumer app did not start')
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(`${base}/admin/login`, { waitUntil: 'networkidle' })
  const result = {
    background: await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor),
    logo: await page.locator('.pb-logo').count(),
    signature: (await page.locator('.pb-login-footer').textContent()) ?? '',
    title: await page.title(),
  }
  await browser.close()
  console.log(`consumer-check: ${JSON.stringify(result)}`)
  failed = !(
    result.logo === 1 &&
    result.signature.includes('Crafted by iDeasTime') &&
    result.background === 'rgb(16, 35, 31)' &&
    result.title.endsWith('— iDeasTime Demo')
  )
} catch (error) {
  console.error(`consumer-check: ${error instanceof Error ? error.message : String(error)}`)
  failed = true
} finally {
  if (server) {
    try {
      process.kill(-server.pid, 'SIGTERM')
    } catch {
      // already gone
    }
  }
  if (process.env.KEEP_CONSUMER !== '1') {
    rmSync(dir, { force: true, recursive: true })
  } else {
    console.log(`consumer-check: kept ${dir}`)
  }
}
console.log(`consumer-check: ${failed ? 'FAILED' : 'PASSED'} for ${tag}`)
process.exit(failed ? 1 : 0)
