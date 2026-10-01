import type { Brand, BrandGraphic, BrandLogo, ResolvedBrand, Warn } from './types.js'

import { contrastRatio, parseHex, toHex } from './color.js'
import { IDEASTIME_BRAND } from './ideastime.js'
import { derivePalette } from './palette.js'

// Payload 3.90.1 --color-base-900: the dark background when no palette is derived.
const PAYLOAD_DARK_BACKGROUND = '#141414'
const MIN_ACCENT_CONTRAST = 3
const FONT_FAMILY = /^[\w -]{1,64}$/

export const ACCENT_FALLBACK = 'var(--color-base-0)'

export const UNBRANDED: ResolvedBrand = {
  name: null,
  accent: ACCENT_FALLBACK,
  font: null,
  logo: null,
  mark: null,
  ogImage: null,
  palette: null,
  welcome: { dashboard: null, login: null },
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function text(value: unknown): null | string {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
}

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false
  }
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function isAssetPath(value: unknown): value is string {
  return (
    isHttpsUrl(value) ||
    (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//'))
  )
}

/** Resolves a brand for the admin. Never throws; problems are reported through `warn`. */
export function resolveBrand(input: Brand | undefined, warn: Warn): ResolvedBrand {
  try {
    if (input === undefined) {
      return resolveFields(IDEASTIME_BRAND, warn, true)
    }
    if (!isObject(input)) {
      warn('brand must be an object; the admin is left unbranded')
      return UNBRANDED
    }
    return resolveFields(input, warn, false)
  } catch (error) {
    warn(
      `could not resolve the brand (${error instanceof Error ? error.message : String(error)}); the admin is left unbranded`,
    )
    return UNBRANDED
  }
}

function resolveFields(
  input: Record<string, unknown>,
  warn: Warn,
  isPreset: boolean,
): ResolvedBrand {
  const name = text(input.name)
  if (!name) {
    warn('brand.name must be a non-empty string')
  }

  let mark: BrandGraphic | null = null
  if (isPreset) {
    mark = { kind: 'ideastime' }
  } else if (isAssetPath(input.mark)) {
    mark = { kind: 'image', src: input.mark }
  } else {
    warn('brand.mark must be a path starting with "/" or an https:// URL')
  }

  let logo: BrandLogo | null = null
  if (isPreset) {
    logo = { kind: 'ideastime' }
  } else if (isAssetPath(input.logo)) {
    logo = { kind: 'image', src: input.logo }
  } else {
    if (input.logo !== undefined) {
      warn('brand.logo must be a path starting with "/" or an https:// URL')
    }
    if (mark?.kind === 'image') {
      logo = { kind: 'lockup', markSrc: mark.src }
    }
  }

  const colors = isObject(input.colors) ? input.colors : {}
  if (input.colors !== undefined && !isObject(input.colors)) {
    warn('brand.colors must be an object')
  }

  let palette: null | Record<string, string> = null
  if (colors.background !== undefined) {
    const result = derivePalette(colors.background)
    if (result.ok) {
      palette = result.vars
    } else {
      warn(result.reason)
    }
  }

  return {
    name,
    accent: resolveAccent(colors.accent, palette, warn),
    font: resolveFont(input.font, warn),
    logo,
    mark,
    ogImage: resolveOgImage(input.ogImage, warn),
    palette,
    welcome: resolveWelcome(input.welcome, warn),
  }
}

function resolveAccent(
  value: unknown,
  palette: null | Record<string, string>,
  warn: Warn,
): string {
  if (value === undefined) {
    return ACCENT_FALLBACK
  }
  const accent = parseHex(value)
  if (!accent) {
    warn('brand.colors.accent must be a #rgb or #rrggbb hex colour')
    return ACCENT_FALLBACK
  }
  const background = parseHex(palette?.['--color-base-900'] ?? PAYLOAD_DARK_BACKGROUND)
  if (background && contrastRatio(accent, background) < MIN_ACCENT_CONTRAST) {
    warn(`brand.colors.accent has contrast below ${MIN_ACCENT_CONTRAST}:1 against the admin background`)
    return ACCENT_FALLBACK
  }
  return toHex(accent)
}

function resolveFont(value: unknown, warn: Warn): ResolvedBrand['font'] {
  if (value === undefined) {
    return null
  }
  if (
    isObject(value) &&
    typeof value.family === 'string' &&
    FONT_FAMILY.test(value.family) &&
    isHttpsUrl(value.href)
  ) {
    return { family: value.family, href: value.href }
  }
  warn(
    'brand.font needs a plain family name (letters, digits, spaces, "-", "_") and an https:// stylesheet href',
  )
  return null
}

function resolveOgImage(value: unknown, warn: Warn): null | string {
  if (value === undefined) {
    return null
  }
  if (isHttpsUrl(value)) {
    return value
  }
  warn(
    'brand.ogImage must be an absolute https:// URL (Payload resolves relative paths against serverURL, which is often localhost)',
  )
  return null
}

function resolveWelcome(value: unknown, warn: Warn): ResolvedBrand['welcome'] {
  if (value === undefined) {
    return { dashboard: null, login: null }
  }
  if (!isObject(value)) {
    warn('brand.welcome must be an object')
    return { dashboard: null, login: null }
  }
  return { dashboard: text(value.dashboard), login: text(value.login) }
}
