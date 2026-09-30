// Upgrade gate: runs unit, e2e and fail-soft checks against a given Payload version, then restores
// package.json, the lockfile and the importMap. Usage: pnpm test:payload <version|latest>
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const guarded = ['package.json', 'pnpm-lock.yaml', 'dev/app/(payload)/admin/importMap.js']

function run(command, args) {
  execFileSync(command, args, { cwd: root, stdio: 'inherit' })
}

function read(command, args) {
  return execFileSync(command, args, { cwd: root, encoding: 'utf8' }).trim()
}

const requested = process.argv[2]
if (!requested) {
  console.error('usage: pnpm test:payload <version|latest>')
  process.exit(1)
}
try {
  run('git', ['diff', '--quiet', '--', ...guarded])
} catch {
  console.error(`test:payload: commit or discard changes to ${guarded.join(', ')} first`)
  process.exit(1)
}

const version = read('npm', ['view', `payload@${requested}`, 'version']).split('\n').pop()
const nextRange = read('npm', ['view', `@payloadcms/next@${version}`, 'peerDependencies.next'])
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
const payloadPackages = Object.keys(pkg.devDependencies).filter(
  (name) => name === 'payload' || (name.startsWith('@payloadcms/') && name !== '@payloadcms/eslint-config'),
)
console.log(`test:payload: payload ${version}, next ${nextRange}`)

let failed = false
try {
  run('pnpm', ['add', '-D', ...payloadPackages.map((name) => `${name}@${version}`), `next@${nextRange}`])
  run('pnpm', ['generate:importmap'])
  run('pnpm', ['test:unit'])
  run('pnpm', ['test:e2e'])
  run('pnpm', ['test:failsoft'])
} catch {
  failed = true
} finally {
  run('git', ['checkout', '--', ...guarded])
  run('pnpm', ['install', '--frozen-lockfile'])
}
console.log(`test:payload: ${failed ? 'FAILED' : 'PASSED'} against payload ${version}`)
process.exit(failed ? 1 : 0)
