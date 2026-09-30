import { describe, expect, test } from 'vitest'

import type { ResolvedBrand } from '../../src/types.js'

import { labelsFor } from '../../src/copy.js'
import { buildThemeCss } from '../../src/css.js'
import { resolveBrand, UNBRANDED } from '../../src/resolve.js'

const quiet = () => {}

describe('buildThemeCss', () => {
  test('preset: palette, font and accent on :root', () => {
    const css = buildThemeCss(resolveBrand(undefined, quiet))
    expect(css.startsWith(':root{')).toBe(true)
    expect(css).toContain('--color-base-900:#071a33')
    expect(css.match(/--color-base-\d+:/g)).toHaveLength(19)
    expect(css).toContain("--font-body:'Inter', -apple-system")
    expect(css).toContain('--pb-accent:#e3a24c')
    expect(css).toContain('.pb-signature{')
  })

  test('unbranded: no palette, no font, accent falls back', () => {
    const css = buildThemeCss(UNBRANDED)
    expect(css).not.toMatch(/--color-base-\d+:/)
    expect(css).not.toContain('--font-body')
    expect(css).toContain('--pb-accent:var(--color-base-0)')
  })

  test('never emits a closing tag, even from unvalidated input', () => {
    const hostile: ResolvedBrand = {
      ...UNBRANDED,
      font: { family: '</style><script>', href: 'https://example.com/x.css' },
    }
    expect(buildThemeCss(hostile)).not.toContain('</')
  })
})

describe('labelsFor', () => {
  test('Chinese for zh*, English otherwise', () => {
    expect(labelsFor('zh-TW').help).toBe('需要協助？')
    expect(labelsFor('zh').greet('Ann')).toBe('您好，Ann')
    expect(labelsFor('en').greet('Ann')).toBe('Hello, Ann')
    expect(labelsFor(undefined).greet(null)).toBe('Hello')
  })
})
