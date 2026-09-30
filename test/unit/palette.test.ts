import { describe, expect, test } from 'vitest'

import { contrastRatio, parseHex, relativeLuminance } from '../../src/color.js'
import { derivePalette, PALETTE_STEPS } from '../../src/palette.js'

function vars(background: string) {
  const result = derivePalette(background)
  if (!result.ok) {
    throw new Error(`expected ok, got: ${result.reason}`)
  }
  return result.vars
}

describe('derivePalette', () => {
  test('covers exactly the 19 dark-theme steps', () => {
    expect(PALETTE_STEPS).toHaveLength(19)
    expect(Object.keys(vars('#071A33')).sort()).toEqual(
      PALETTE_STEPS.map((step) => `--color-base-${step}`).sort(),
    )
  })

  test('base-900 is the background itself, base-0 is near-white', () => {
    const palette = vars('#071A33')
    expect(palette['--color-base-900']).toBe('#071a33')
    expect(palette['--color-base-0']).toBe('#fafafa')
  })

  test('gets darker at every step', () => {
    const palette = vars('#071A33')
    const lum = PALETTE_STEPS.map((s) => relativeLuminance(parseHex(palette[`--color-base-${s}`])!))
    for (let i = 1; i < lum.length; i++) {
      expect(lum[i]).toBeLessThan(lum[i - 1])
    }
  })

  test('text and primary-button pairs meet WCAG AA', () => {
    const palette = vars('#071A33')
    const c = (a: string, b: string) => contrastRatio(parseHex(palette[a])!, parseHex(palette[b])!)
    expect(c('--color-base-0', '--color-base-900')).toBeGreaterThanOrEqual(4.5)
    expect(c('--color-base-900', '--color-base-100')).toBeGreaterThanOrEqual(4.5)
  })

  test('works for a neutral grey and for a green-tinted dark', () => {
    expect(vars('#141414')['--color-base-0']).toBe('#fafafa')
    expect(vars('#10231F')['--color-base-900']).toBe('#10231f')
  })

  test('rejects a light background', () => {
    const result = derivePalette('#ffffff')
    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toMatch(/too light/)
  })

  test('rejects non-hex input', () => {
    const result = derivePalette('navy')
    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toMatch(/hex/)
  })

  test('rejects a palette that would fail contrast', () => {
    const result = derivePalette('#808080', { maxLightness: 1 })
    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toMatch(/contrast/)
  })
})
