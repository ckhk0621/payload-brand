import type { Config } from 'payload'

import { describe, expect, test } from 'vitest'

import type { Brand, ResolvedBrand } from '../../src/types.js'

import { applyBrand } from '../../src/apply.js'
import { IDEASTIME } from '../../src/ideastime.js'

type Registered = { path: string; serverProps: { brand: ResolvedBrand; css: string } }

const demo: Brand = {
  name: 'iDeasTime Demo',
  colors: { accent: '#4FD1C5', background: '#10231F' },
  logo: '/brand/demo-logo.svg',
  mark: '/brand/demo-mark.png',
  ogImage: 'https://example.com/og.png',
}

function run(config: Partial<Config>, brand?: Brand) {
  const warnings: string[] = []
  const out = applyBrand(config as Config, brand, (message) => {
    warnings.push(message)
  })
  return { out, warnings }
}

const paths = (list: unknown) =>
  (list as Array<{ path: string } | string>).map((c) => (typeof c === 'string' ? c : c.path))

describe('applyBrand with the iDeasTime preset', () => {
  const { out, warnings } = run({})
  const components = out.admin!.components!

  test('locks the dark theme', () => {
    expect(out.admin!.theme).toBe('dark')
  })

  test('registers every slot with serverProps', () => {
    const logo = components.graphics!.Logo as Registered
    expect(logo.path).toBe('@ideastime/payload-brand/rsc#BrandLogo')
    expect(logo.serverProps.brand.name).toBe('iDeasTime')
    expect(logo.serverProps.css).toContain('--color-base-900:#071a33')
    expect((components.graphics!.Icon as Registered).path).toBe('@ideastime/payload-brand/rsc#BrandIcon')
    expect(paths(components.beforeLogin)).toEqual(['@ideastime/payload-brand/rsc#LoginWelcome'])
    expect(paths(components.afterLogin)).toEqual(['@ideastime/payload-brand/rsc#LoginFooter'])
    expect(paths(components.afterNavLinks)).toEqual(['@ideastime/payload-brand/rsc#NavFooter'])
    expect(paths(components.beforeDashboard)).toEqual(['@ideastime/payload-brand/rsc#DashboardWelcome'])
  })

  test('never registers providers', () => {
    expect(components.providers).toBeUndefined()
  })

  test('sets title suffix, svg data-URI favicon and preview image', () => {
    const meta = out.admin!.meta!
    expect(meta.titleSuffix).toBe(' — iDeasTime')
    const icons = meta.icons as Array<{ type?: string; url: string }>
    expect(icons[0].url.startsWith('data:image/svg+xml,')).toBe(true)
    expect(icons[0].type).toBe('image/svg+xml')
    expect(meta.openGraph).toEqual({
      description: 'iDeasTime admin',
      images: [{ url: IDEASTIME.ogImage }],
      siteName: 'iDeasTime',
      title: 'iDeasTime',
    })
    // Payload's dynamic /api/og draws graphics.Icon with a relative <img>, which its renderer rejects.
    expect(meta.defaultOGImageType).toBe('off')
  })

  test('emits no warnings', () => {
    expect(warnings).toEqual([])
  })
})

describe('merge rules', () => {
  test('appends after project components in the same slot', () => {
    const { out } = run({ admin: { components: { beforeDashboard: ['/components/Sync#Sync'] } } })
    expect(paths(out.admin!.components!.beforeDashboard)).toEqual([
      '/components/Sync#Sync',
      '@ideastime/payload-brand/rsc#DashboardWelcome',
    ])
  })

  test('keeps a project Logo, theme and title suffix, with warnings', () => {
    const { out, warnings } = run({
      admin: {
        components: { graphics: { Logo: '/components/MyLogo#MyLogo' } },
        meta: { titleSuffix: ' - Mine' },
        theme: 'light',
      },
    })
    expect(out.admin!.components!.graphics!.Logo).toBe('/components/MyLogo#MyLogo')
    expect(out.admin!.theme).toBe('light')
    expect(out.admin!.meta!.titleSuffix).toBe(' - Mine')
    expect(warnings.some((w) => w.includes('graphics.Logo'))).toBe(true)
    expect(warnings.some((w) => w.includes('admin.theme'))).toBe(true)
    expect(warnings.some((w) => w.includes('titleSuffix'))).toBe(true)
  })

  test('does not mutate the incoming config', () => {
    const incoming = { admin: { components: { afterNavLinks: ['/x#X'] } } }
    const before = JSON.stringify(incoming)
    run(incoming)
    expect(JSON.stringify(incoming)).toBe(before)
  })
})

describe('client brand', () => {
  test('png mark becomes a png favicon', () => {
    const { out } = run({}, demo)
    const icons = out.admin!.meta!.icons as Array<{ type?: string; url: string }>
    expect(icons).toEqual([{ type: 'image/png', rel: 'icon', url: '/brand/demo-mark.png' }])
  })

  test('without a valid mark or logo, graphics stay Payload defaults', () => {
    const { out } = run({}, { ...demo, logo: undefined, mark: 'nope' })
    expect(out.admin!.components!.graphics!.Logo).toBeUndefined()
    expect(out.admin!.components!.graphics!.Icon).toBeUndefined()
    expect(out.admin!.meta!.icons).toBeUndefined()
  })

  test('relative ogImage: no preview image, warning, but still branded preview text', () => {
    const { out, warnings } = run({}, { ...demo, ogImage: '/brand/og.png' })
    expect(out.admin!.meta!.openGraph).toEqual({
      description: 'iDeasTime Demo admin',
      siteName: 'iDeasTime Demo',
      title: 'iDeasTime Demo',
    })
    expect(out.admin!.meta!.defaultOGImageType).toBe('off')
    expect(warnings.some((w) => w.includes('ogImage'))).toBe(true)
  })

  test('without ogImage, Payload\'s dynamic preview image is turned off', () => {
    const { out } = run({}, { ...demo, ogImage: undefined })
    expect(out.admin!.meta!.defaultOGImageType).toBe('off')
    expect(out.admin!.meta!.openGraph).not.toHaveProperty('images')
  })

  test('keeps a project-set defaultOGImageType', () => {
    const { out } = run({ admin: { meta: { defaultOGImageType: 'dynamic' } } }, demo)
    expect(out.admin!.meta!.defaultOGImageType).toBe('dynamic')
  })
})
