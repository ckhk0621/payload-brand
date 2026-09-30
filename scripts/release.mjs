// Cuts a release: clean build + checks, then commits dist/ with the version bump and tags vX.Y.Z.
// Pushing is outward-facing and left to a human. RELEASE_COMMIT_TRAILER adds a trailer line.
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')

function run(command, args) {
  execFileSync(command, args, { cwd: root, stdio: 'inherit' })
}

function read(command, args) {
  return execFileSync(command, args, { cwd: root, encoding: 'utf8' })
}

const version = process.argv[2]
if (!/^\d+\.\d+\.\d+$/.test(version ?? '')) {
  console.error('usage: pnpm release <major.minor.patch>')
  process.exit(1)
}
const dirty = read('git', ['status', '--porcelain'])
  .split('\n')
  .filter(Boolean)
  .filter((line) => !line.slice(3).startsWith('dist/'))
if (dirty.length > 0) {
  console.error(`release: working tree has changes outside dist/:\n${dirty.join('\n')}`)
  process.exit(1)
}
if (read('git', ['tag', '--list', `v${version}`]).trim()) {
  console.error(`release: tag v${version} already exists`)
  process.exit(1)
}

run('pnpm', ['build'])
run('node', ['scripts/verify-dist.mjs'])
run('pnpm', ['lint'])
run('pnpm', ['test:unit'])

const pkgPath = path.join(root, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
pkg.version = version
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

const trailer = process.env.RELEASE_COMMIT_TRAILER
run('git', ['add', '--', 'package.json', 'dist'])
run('git', ['commit', '-m', `release: v${version}`, ...(trailer ? ['-m', trailer] : [])])
run('git', ['tag', '-a', `v${version}`, '-m', `v${version}`])
console.log(`release: tagged v${version}. Push when ready: git push origin main --follow-tags`)
