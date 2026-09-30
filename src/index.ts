import type { Config, Plugin } from 'payload'

import type { Brand } from './types.js'

import { applyBrand } from './apply.js'

export { IDEASTIME } from './ideastime.js'
export type { Brand, ResolvedBrand } from './types.js'

const printed = new Set<string>()

function warnOnce(message: string): void {
  if (printed.has(message)) {
    return
  }
  printed.add(message)
  // The plugin's only output channel: config-time warnings in the server log.
  // eslint-disable-next-line no-console
  console.warn(`[payload-brand] ${message}`)
}

/**
 * Brands the Payload admin. Call with no argument for the iDeasTime demo brand, or pass a
 * client `Brand`. Never throws: on any problem the admin falls back to Payload's defaults.
 */
export function brandPlugin(brand?: Brand): Plugin {
  return (config: Config): Config => {
    try {
      return applyBrand(config, brand, warnOnce)
    } catch (error) {
      warnOnce(
        `unexpected error, admin left unbranded: ${error instanceof Error ? error.message : String(error)}`,
      )
      return config
    }
  }
}
