import type { ResolvedBrand } from '../types.js'

/**
 * serverProps set by the plugin. Optional on purpose: if a Payload release stopped passing them,
 * components must render nothing rather than throw and take the whole view down.
 */
export type BrandProps = { brand?: ResolvedBrand; css?: string }

/** The subset of Payload's default server props these components read. */
export type ViewerProps = {
  i18n?: { language?: string }
  user?: { email?: unknown; name?: unknown } | null
}
