// Rebuilds src/ into a temp dir and fails if the result differs from the committed dist/.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const bin = (name) => path.join(root, 'node_modules', '.bin', name)

function walk(dir, base = dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    return statSync(full).isDirectory() ? walk(full, base) : [path.relative(base, full)]
  })
}

if (!existsSync(dist)) {
  console.error('verify-dist: dist/ is missing; cut a release with pnpm release <version>')
  process.exit(1)
}

const tmp = mkdtempSync(path.join(tmpdir(), 'verify-dist-'))
try {
  execFileSync(
    bin('tsc'),
    ['--outDir', tmp, '--rootDir', './src', '--tsBuildInfoFile', path.join(tmp, '.tsbuildinfo')],
    { cwd: root, stdio: 'inherit' },
  )
  execFileSync(bin('swc'), ['./src', '-d', tmp, '--config-file', '.swcrc', '--strip-leading-paths'], {
    cwd: root,
    stdio: 'ignore',
  })
  const fresh = walk(tmp).filter((f) => f !== '.tsbuildinfo')
  const committed = walk(dist)
  const problems = []
  for (const file of new Set([...fresh, ...committed])) {
    if (!fresh.includes(file)) {
      problems.push(`stale file in dist/: ${file}`)
    } else if (!committed.includes(file)) {
      problems.push(`missing from dist/: ${file}`)
    } else if (!readFileSync(path.join(tmp, file)).equals(readFileSync(path.join(dist, file)))) {
      problems.push(`differs: ${file}`)
    }
  }
  console.log(`verify-dist: compared ${fresh.length} built files against dist/`)
  if (problems.length > 0) {
    console.error(problems.join('\n'))
    process.exit(1)
  }
  console.log('verify-dist: dist/ matches src/')
} finally {
  rmSync(tmp, { force: true, recursive: true })
}
