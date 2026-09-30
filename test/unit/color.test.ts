import { describe, expect, test } from 'vitest'

import {
  contrastRatio,
  oklchToRgb,
  parseHex,
  relativeLuminance,
  rgbToOklch,
  toHex,
} from '../../src/color.js'

const white = { b: 255, g: 255, r: 255 }
const black = { b: 0, g: 0, r: 0 }

describe('parseHex', () => {
  test('parses #rrggbb in any case', () => {
    expect(parseHex('#071A33')).toEqual({ b: 51, g: 26, r: 7 })
    expect(parseHex('#071a33')).toEqual({ b: 51, g: 26, r: 7 })
  })

  test('parses #rgb and trims whitespace', () => {
    expect(parseHex('  #FFF ')).toEqual(white)
  })

  test.each([['rgb(1,2,3)'], ['navy'], ['#12345'], ['071A33'], [''], [42], [undefined], [null]])(
    'rejects %s',
    (input) => {
      expect(parseHex(input)).toBeNull()
    },
  )
})

describe('toHex', () => {
  test('formats lower-case #rrggbb', () => {
    expect(toHex({ b: 51, g: 26, r: 7 })).toBe('#071a33')
  })
})

describe('OKLCH round trip', () => {
  test.each([
    ['#071a33'],
    ['#e3a24c'],
    ['#7fa9dc'],
    ['#10231f'],
    ['#808080'],
    ['#ffffff'],
    ['#000000'],
    ['#4fd1c5'],
  ])('%s survives rgb -> oklch -> rgb unchanged', (hex) => {
    const rgb = parseHex(hex)!
    expect(toHex(oklchToRgb(rgbToOklch(rgb)))).toBe(hex)
  })

  test('iDeasTime dark section is a dark colour', () => {
    expect(rgbToOklch(parseHex('#071A33')!).L).toBeCloseTo(0.218, 2)
  })

  test('out-of-gamut colours are clamped to valid sRGB', () => {
    const rgb = oklchToRgb({ C: 0.4, h: 0, L: 0.7 })
    for (const channel of [rgb.r, rgb.g, rgb.b]) {
      expect(Number.isInteger(channel)).toBe(true)
      expect(channel).toBeGreaterThanOrEqual(0)
      expect(channel).toBeLessThanOrEqual(255)
    }
  })
})

describe('WCAG contrast', () => {
  test('white on black is 21:1', () => {
    expect(contrastRatio(white, black)).toBeCloseTo(21, 5)
    expect(contrastRatio(black, white)).toBeCloseTo(21, 5)
  })

  test('#767676 on white is the classic 4.54:1', () => {
    expect(contrastRatio({ b: 118, g: 118, r: 118 }, white)).toBeCloseTo(4.54, 2)
  })

  test('luminance of white is 1', () => {
    expect(relativeLuminance(white)).toBeCloseTo(1, 10)
  })
})
