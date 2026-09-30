import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../src')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    return statSync(full).isDirectory() ? sourceFiles(full) : [full]
  })
}

// Match real imports/directives only: comments may cite Payload paths such as
// @payloadcms/ui/dist/scss/colors.scss as sources.
const rules: Array<[string, RegExp]> = [
  ['imports @payloadcms/ui', /(?:from\s+|import\s*\(\s*)['"]@payloadcms\/ui['"/]/],
  ['declares a client component', /^\s*['"]use client['"]/m],
]

describe('source guards', () => {
  const files = sourceFiles(srcDir)

  test('scans the real source tree', () => {
    expect(files.some((f) => f.endsWith(path.join('components', 'BrandLogo.tsx')))).toBe(true)
  })

  test.each(rules)('no source file %s', (_label, pattern) => {
    const offenders = files.filter((f) => pattern.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  test('the patterns would catch a violation', () => {
    expect(rules[0][1].test("import { Button } from '@payloadcms/ui'")).toBe(true)
    expect(rules[1][1].test("'use client'\nexport const X = 1")).toBe(true)
  })
})
