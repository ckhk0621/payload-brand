import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'

import { parseHex } from '../../src/color.js'
import {
  PAYLOAD_BASE_GREYS,
  PAYLOAD_DARK_BACKGROUND,
  PAYLOAD_FONT_BODY,
} from '../../src/payload-mirror.js'

// Reads the Payload that is installed, not the one the mirror was copied from, so
// `pnpm test:payload <version>` fails here when a release changes a value payload-brand relies on.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

function installed(file: string): string {
  return readFileSync(path.join(root, 'node_modules', file), 'utf8')
}

const colors = installed('@payloadcms/ui/dist/scss/colors.scss')
const darkTheme = colors.slice(colors.indexOf("html[data-theme='dark']"))

describe('Payload mirror matches the installed Payload', () => {
  test('neutral palette steps', () => {
    const actual = Object.fromEntries(
      [...colors.matchAll(/--color-base-(\d+):\s*([^;\s][^;]*);/g)].map(([, step, value]) => [
        Number(step),
        value.trim(),
      ]),
    )
    const steps = Object.keys(PAYLOAD_BASE_GREYS).map(Number)
    const grey = (v: number) => `rgb(${v}, ${v}, ${v})`
    expect(Object.fromEntries(steps.map((step) => [step, actual[step]]))).toEqual(
      Object.fromEntries(steps.map((step) => [step, grey(PAYLOAD_BASE_GREYS[step])])),
    )
  })

  test('dark admin background is --color-base-900', () => {
    expect(darkTheme).toMatch(/^html\[data-theme='dark'\]/)
    expect(darkTheme.match(/--theme-elevation-0:\s*([^;\s][^;]*);/)?.[1]).toBe('var(--color-base-900)')
    const grey = PAYLOAD_BASE_GREYS[900]
    expect(parseHex(PAYLOAD_DARK_BACKGROUND)).toEqual({ b: grey, g: grey, r: grey })
  })

  test('--font-body', () => {
    const css = installed('@payloadcms/next/dist/prod/styles.css')
    expect(css.match(/--font-body:\s*([^;}]+)/)?.[1].trim()).toBe(PAYLOAD_FONT_BODY)
  })
})
