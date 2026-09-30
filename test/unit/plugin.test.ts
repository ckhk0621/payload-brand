import type { Config } from 'payload'

import { afterEach, describe, expect, test, vi } from 'vitest'

import { brandPlugin } from '../../src/index.js'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('brandPlugin', () => {
  test('never throws: returns the incoming config untouched on unexpected errors', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const config = Object.defineProperty({}, 'admin', {
      get() {
        throw new Error('boom')
      },
    }) as Config
    expect(brandPlugin()(config)).toBe(config)
    expect(warn).toHaveBeenCalledWith('[payload-brand] unexpected error, admin left unbranded: boom')
  })

  test('prints each distinct warning once per process', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const bad = { name: 'X', colors: { accent: 'not-a-colour' }, mark: '/m.svg' }
    await brandPlugin(bad)({} as Config)
    await brandPlugin(bad)({} as Config)
    const accentWarnings = warn.mock.calls.filter(([m]) => String(m).includes('brand.colors.accent'))
    expect(accentWarnings).toHaveLength(1)
  })
})
