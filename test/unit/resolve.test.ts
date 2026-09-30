import { describe, expect, test } from 'vitest'

import type { Brand } from '../../src/types.js'

import { IDEASTIME, IDEASTIME_MARK_DATA_URI } from '../../src/ideastime.js'
import { ACCENT_FALLBACK, resolveBrand } from '../../src/resolve.js'

const example: Brand = {
  name: 'Example Co.',
  colors: { accent: '#4FD1C5', background: '#10231F' },
  logo: '/brand/example-logo.svg',
  mark: '/brand/example-mark.svg',
  ogImage: 'https://example.com/og.png',
  welcome: { dashboard: 'Manage your content.', login: 'Welcome back.' },
}

function resolve(input: Brand | undefined) {
  const warnings: string[] = []
  const brand = resolveBrand(input, (message) => {
    warnings.push(message)
  })
  return { brand, warnings }
}

describe('iDeasTime preset (no brand passed)', () => {
  test('resolves cleanly to the iDeasTime brand', () => {
    const { brand, warnings } = resolve(undefined)
    expect(warnings).toEqual([])
    expect(brand.name).toBe('iDeasTime')
    expect(brand.mark).toEqual({ kind: 'ideastime' })
    expect(brand.logo).toEqual({ kind: 'ideastime' })
    expect(brand.palette?.['--color-base-900']).toBe('#071a33')
    expect(brand.accent).toBe('#e3a24c')
    expect(brand.font?.family).toBe('Inter')
    expect(brand.ogImage).toBe(IDEASTIME.ogImage)
  })

  test('mark data URI is an SVG with both eye colours', () => {
    expect(IDEASTIME_MARK_DATA_URI.startsWith('data:image/svg+xml,')).toBe(true)
    const svg = decodeURIComponent(IDEASTIME_MARK_DATA_URI.slice('data:image/svg+xml,'.length))
    expect(svg).toContain(IDEASTIME.mark.left)
    expect(svg).toContain(IDEASTIME.mark.right)
  })
})

describe('client brand', () => {
  test('resolves a valid brand without warnings', () => {
    const { brand, warnings } = resolve(example)
    expect(warnings).toEqual([])
    expect(brand.mark).toEqual({ kind: 'image', src: '/brand/example-mark.svg' })
    expect(brand.logo).toEqual({ kind: 'image', src: '/brand/example-logo.svg' })
    expect(brand.accent).toBe('#4fd1c5')
    expect(brand.palette?.['--color-base-900']).toBe('#10231f')
    expect(brand.welcome).toEqual({ dashboard: 'Manage your content.', login: 'Welcome back.' })
  })

  test('without a logo, builds a mark + name lockup', () => {
    const { brand } = resolve({ ...example, logo: undefined })
    expect(brand.logo).toEqual({ kind: 'lockup', markSrc: '/brand/example-mark.svg' })
  })

  test('never falls back to iDeasTime assets for a client brand', () => {
    const { brand, warnings } = resolve({ ...example, logo: undefined, mark: 'mark.svg' })
    expect(brand.mark).toBeNull()
    expect(brand.logo).toBeNull()
    expect(warnings.some((w) => w.includes('brand.mark'))).toBe(true)
  })

  test('accepts short hex with whitespace and normalises it', () => {
    const { brand } = resolve({ ...example, colors: { accent: '  #FFF ', background: '#10231F' } })
    expect(brand.accent).toBe('#ffffff')
  })

  test('light background falls back to Payload grey with a warning', () => {
    const { brand, warnings } = resolve({ ...example, colors: { accent: '#4FD1C5', background: '#ffffff' } })
    expect(brand.palette).toBeNull()
    expect(warnings.some((w) => w.includes('too light'))).toBe(true)
  })

  test('low-contrast accent falls back', () => {
    const { brand, warnings } = resolve({ ...example, colors: { accent: '#333333', background: '#071A33' } })
    expect(brand.accent).toBe(ACCENT_FALLBACK)
    expect(warnings.some((w) => w.includes('contrast'))).toBe(true)
  })

  test('non-hex accent falls back', () => {
    const { brand, warnings } = resolve({ ...example, colors: { accent: 'rgb(1,2,3)' } })
    expect(brand.accent).toBe(ACCENT_FALLBACK)
    expect(warnings.some((w) => w.includes('brand.colors.accent'))).toBe(true)
  })

  test.each([
    [{ family: 'Inter;}</style>', href: 'https://fonts.googleapis.com/css2?family=Inter' }],
    [{ family: 'Inter', href: 'http://fonts.googleapis.com/css2?family=Inter' }],
  ])('rejects unsafe font %j', (font) => {
    const { brand, warnings } = resolve({ ...example, font })
    expect(brand.font).toBeNull()
    expect(warnings.some((w) => w.includes('brand.font'))).toBe(true)
  })

  test('rejects a relative ogImage', () => {
    const { brand, warnings } = resolve({ ...example, ogImage: '/brand/og.png' })
    expect(brand.ogImage).toBeNull()
    expect(warnings.some((w) => w.includes('https://'))).toBe(true)
  })

  test.each([
    [42],
    ['brand'],
    [null],
    [[]],
    [{ colors: 5 }],
    [{ name: 5, colors: { accent: {} }, font: 'x', mark: {}, welcome: 7 }],
  ])('never throws on garbage input %j', (input) => {
    const { brand } = resolve(input as unknown as Brand)
    expect(typeof brand.accent).toBe('string')
    expect(brand.mark?.kind).not.toBe('ideastime')
  })
})
