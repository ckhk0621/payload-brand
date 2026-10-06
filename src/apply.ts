import type { Config } from 'payload'

import type { Brand, ResolvedBrand, Warn } from './types.js'

import { buildThemeCss } from './css.js'
import { IDEASTIME_MARK_DATA_URI } from './ideastime.js'
import { resolveBrand } from './resolve.js'

export const COMPONENT_PREFIX = '@ideastime/payload-brand/rsc#'

function faviconOf(brand: ResolvedBrand): null | string {
  if (!brand.mark) {
    return null
  }
  return brand.mark.kind === 'ideastime' ? IDEASTIME_MARK_DATA_URI : brand.mark.src
}

function iconType(url: string): string | undefined {
  if (url.startsWith('data:image/svg+xml') || /\.svg(?:\?|$)/i.test(url)) {
    return 'image/svg+xml'
  }
  if (/\.png(?:\?|$)/i.test(url)) {
    return 'image/png'
  }
  if (/\.ico(?:\?|$)/i.test(url)) {
    return 'image/x-icon'
  }
  return undefined
}

/** Pure config transform. Project-set values always win; conflicts are reported via `warn`. */
export function applyBrand(config: Config, input: Brand | undefined, warn: Warn): Config {
  const brand = resolveBrand(input, warn)
  const css = buildThemeCss(brand)
  // Return type inferred on purpose: graphics slots take CustomComponent, whose serverProps
  // accept any object but not PayloadComponent's generic Record.
  const component = (name: string) => ({
    path: COMPONENT_PREFIX + name,
    serverProps: { brand, css },
  })

  const admin = { ...config.admin }
  const components = { ...admin.components }
  const graphics = { ...components.graphics }
  const meta = { ...admin.meta }

  if (admin.theme === undefined) {
    admin.theme = 'dark'
  } else if (admin.theme !== 'dark') {
    warn(`admin.theme is '${admin.theme}' in the project config; keeping it (payload-brand targets 'dark')`)
  }

  if (brand.logo) {
    if (graphics.Logo) {
      warn('admin.components.graphics.Logo is set by the project; keeping it')
    } else {
      graphics.Logo = component('BrandLogo')
    }
  }
  if (brand.mark) {
    if (graphics.Icon) {
      warn('admin.components.graphics.Icon is set by the project; keeping it')
    } else {
      graphics.Icon = component('BrandIcon')
    }
  }
  components.graphics = graphics
  components.beforeLogin = [...(components.beforeLogin ?? []), component('LoginWelcome')]
  components.afterLogin = [...(components.afterLogin ?? []), component('LoginFooter')]
  components.afterNavLinks = [...(components.afterNavLinks ?? []), component('NavFooter')]
  components.beforeDashboard = [...(components.beforeDashboard ?? []), component('DashboardWelcome')]
  admin.components = components

  if (brand.name) {
    if (meta.titleSuffix !== undefined) {
      warn('admin.meta.titleSuffix is set by the project; keeping it')
    } else {
      // No leading space: Payload joins the suffix with one of its own.
      meta.titleSuffix = `— ${brand.name}`
    }
  }
  const favicon = faviconOf(brand)
  if (favicon) {
    if (meta.icons !== undefined) {
      warn('admin.meta.icons is set by the project; keeping it')
    } else {
      const type = iconType(favicon)
      meta.icons = [{ rel: 'icon', url: favicon, ...(type ? { type } : {}) }]
    }
  }
  if (meta.defaultOGImageType === undefined) {
    // Payload's dynamic /api/og image draws graphics.Icon; a client mark is a relative <img src>,
    // which its image renderer rejects. Previews use brand.ogImage or no image instead.
    meta.defaultOGImageType = 'off'
  }
  if (brand.name || brand.ogImage) {
    if (meta.openGraph !== undefined) {
      warn('admin.meta.openGraph is set by the project; keeping it')
    } else {
      // Without siteName/description, previews keep Payload's defaults ("Payload App").
      meta.openGraph = {
        ...(brand.name
          ? { description: `${brand.name} admin`, siteName: brand.name, title: brand.name }
          : {}),
        ...(brand.ogImage ? { images: [{ url: brand.ogImage }] } : {}),
      }
    }
  }
  admin.meta = meta

  return { ...config, admin }
}
