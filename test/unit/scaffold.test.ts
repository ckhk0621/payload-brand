import type { Config } from 'payload'

import { describe, expect, test } from 'vitest'

import { brandPlugin } from '../../src/index.js'

describe('scaffold', () => {
  test('brandPlugin returns a Payload plugin that yields a config', () => {
    const config = { collections: [] } as unknown as Config
    expect(brandPlugin()(config)).toBe(config)
  })
})
