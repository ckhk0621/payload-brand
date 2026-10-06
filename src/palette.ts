import type { Rgb } from './color.js'

import { contrastRatio, oklchToRgb, parseHex, rgbToOklch, toHex } from './color.js'
import { PAYLOAD_BASE_GREYS } from './payload-mirror.js'

// Only Payload's lightness curve is reused, so the derived palette keeps its contrast relationships.
export const PALETTE_STEPS: readonly number[] = Object.keys(PAYLOAD_BASE_GREYS)
  .map(Number)
  .sort((a, b) => a - b)

export const MAX_BACKGROUND_LIGHTNESS = 0.35
const TOP_LIGHTNESS = 0.985
const MIN_CONTRAST = 4.5

export type PaletteResult = { ok: false; reason: string } | { ok: true; vars: Record<string, string> }

function referenceLightness(step: number): number {
  const v = PAYLOAD_BASE_GREYS[step]
  return rgbToOklch({ b: v, g: v, r: v }).L
}

export function derivePalette(
  background: unknown,
  { maxLightness = MAX_BACKGROUND_LIGHTNESS }: { maxLightness?: number } = {},
): PaletteResult {
  const rgb = parseHex(background)
  if (!rgb) {
    return { ok: false, reason: 'brand.colors.background must be a #rgb or #rrggbb hex colour' }
  }
  const bg = rgbToOklch(rgb)
  if (bg.L > maxLightness) {
    return {
      ok: false,
      reason: `brand.colors.background is too light for the dark admin theme (OKLCH L ${bg.L.toFixed(2)} > ${maxLightness})`,
    }
  }

  const low = referenceLightness(900)
  const high = referenceLightness(0)
  const colours = new Map<number, Rgb>()
  for (const step of PALETTE_STEPS) {
    if (step === 900) {
      colours.set(step, rgb)
      continue
    }
    const t = (referenceLightness(step) - low) / (high - low)
    colours.set(
      step,
      oklchToRgb({ C: bg.C * (1 - t), h: bg.h, L: bg.L + t * (TOP_LIGHTNESS - bg.L) }),
    )
  }

  const text = contrastRatio(colours.get(0)!, colours.get(900)!)
  const button = contrastRatio(colours.get(900)!, colours.get(100)!)
  if (text < MIN_CONTRAST || button < MIN_CONTRAST) {
    return {
      ok: false,
      reason: `derived palette fails WCAG AA contrast (text ${text.toFixed(2)}:1, button ${button.toFixed(2)}:1; need ${MIN_CONTRAST}:1)`,
    }
  }

  return {
    ok: true,
    vars: Object.fromEntries(
      PALETTE_STEPS.map((step) => [`--color-base-${step}`, toHex(colours.get(step)!)]),
    ),
  }
}
