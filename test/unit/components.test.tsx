import type { ReactElement } from 'react'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'

import type { BrandProps } from '../../src/components/props.js'
import type { Brand } from '../../src/types.js'

import { BrandIcon } from '../../src/components/BrandIcon.js'
import { BrandLogo } from '../../src/components/BrandLogo.js'
import { DashboardWelcome } from '../../src/components/DashboardWelcome.js'
import { LoginFooter } from '../../src/components/LoginFooter.js'
import { LoginWelcome } from '../../src/components/LoginWelcome.js'
import { NavFooter } from '../../src/components/NavFooter.js'
import { buildThemeCss } from '../../src/css.js'
import { resolveBrand } from '../../src/resolve.js'

const quiet = () => {}
const html = (element: ReactElement) => renderToStaticMarkup(element)

const example: Brand = {
  name: 'Example Co.',
  colors: { accent: '#4FD1C5', background: '#10231F' },
  logo: '/brand/example-logo.svg',
  mark: '/brand/example-mark.svg',
  welcome: { dashboard: 'Manage your content.', login: 'Welcome back.' },
}
const preset = resolveBrand(undefined, quiet)
const client = resolveBrand(example, quiet)
const presetCss = buildThemeCss(preset)
const clientCss = buildThemeCss(client)

describe('BrandLogo', () => {
  test('preset renders the mark, the iDeas|Time wordmark and the theme style', () => {
    const out = html(<BrandLogo brand={preset} css={presetCss} />)
    expect(out).toContain('<svg')
    expect(out).toContain('iDeas<span class="pb-wordmark__accent">Time</span>')
    expect(out).toContain('data-href="payload-brand-theme"')
    expect(out).toContain('fonts.googleapis.com/css2?family=Inter')
  })

  test('client logo image', () => {
    const out = html(<BrandLogo brand={client} css={clientCss} />)
    expect(out).toContain('src="/brand/example-logo.svg"')
    expect(out).toContain('alt="Example Co."')
  })

  test('lockup when the client has no logo', () => {
    const lockup = resolveBrand({ ...example, logo: undefined }, quiet)
    const out = html(<BrandLogo brand={lockup} css={buildThemeCss(lockup)} />)
    expect(out).toContain('src="/brand/example-mark.svg"')
    expect(out).toContain('>Example Co.</span>')
  })
})

describe('BrandIcon', () => {
  test('preset svg, client image, nothing when unbranded', () => {
    expect(html(<BrandIcon brand={preset} css={presetCss} />)).toContain('<svg')
    expect(html(<BrandIcon brand={client} css={clientCss} />)).toContain('src="/brand/example-mark.svg"')
    const unbranded = resolveBrand(42 as unknown as Brand, quiet)
    expect(html(<BrandIcon brand={unbranded} css="" />)).toBe('')
  })
})

describe('signature blocks', () => {
  test('login footer: credit, support contacts and theme style', () => {
    const out = html(<LoginFooter brand={client} css={clientCss} i18n={{ language: 'en' }} />)
    expect(out).toContain('Crafted by')
    expect(out).toContain('href="https://www.ideastime.ltd"')
    expect(out).toContain('Need help?')
    expect(out).toContain('href="mailto:cklam@ideastime.ltd"')
    expect(out).toContain('href="https://wa.me/85263295926"')
    expect(out).toContain('WhatsApp +852 6329 5926')
    expect(out).toContain('data-href="payload-brand-theme"')
  })

  test('login footer in Chinese', () => {
    expect(html(<LoginFooter brand={client} css={clientCss} i18n={{ language: 'zh-TW' }} />)).toContain(
      '需要協助？',
    )
  })

  test('nav footer carries the credit and the theme style', () => {
    const out = html(<NavFooter brand={client} css={clientCss} />)
    expect(out).toContain('pb-nav-footer')
    expect(out).toContain('Crafted by')
    expect(out).toContain('data-href="payload-brand-theme"')
  })
})

describe('welcome', () => {
  test('login welcome renders only when configured, escaped', () => {
    expect(html(<LoginWelcome brand={preset} css={presetCss} />)).toBe('')
    expect(html(<LoginWelcome brand={client} css={clientCss} />)).toBe(
      '<p class="pb-welcome">Welcome back.</p>',
    )
    const hostile = resolveBrand({ ...example, welcome: { login: '<script>x</script>' } }, quiet)
    const out = html(<LoginWelcome brand={hostile} css="" />)
    expect(out).toContain('&lt;script&gt;')
    expect(out).not.toContain('<script>')
  })

  test('dashboard card greets by name, else email; support without the credit line', () => {
    const byEmail = html(
      <DashboardWelcome brand={client} css={clientCss} i18n={{ language: 'en' }} user={{ email: 'dev@example.com' }} />,
    )
    expect(byEmail).toContain('Hello, dev@example.com')
    expect(byEmail).toContain('Manage your content.')
    expect(byEmail).toContain('mailto:cklam@ideastime.ltd')
    expect(byEmail).not.toContain('Crafted by')
    expect(
      html(<DashboardWelcome brand={client} css={clientCss} user={{ name: 'Ann', email: 'a@example.com' }} />),
    ).toContain('Hello, Ann')
    expect(
      html(
        <DashboardWelcome brand={client} css={clientCss} i18n={{ language: 'zh' }} user={{ email: 'dev@example.com' }} />,
      ),
    ).toContain('您好，dev@example.com')
  })
})

describe('missing serverProps (a future Payload that stops passing them)', () => {
  const none = {} as BrandProps
  test.each([
    ['BrandIcon', BrandIcon],
    ['BrandLogo', BrandLogo],
    ['DashboardWelcome', DashboardWelcome],
    ['LoginFooter', LoginFooter],
    ['LoginWelcome', LoginWelcome],
    ['NavFooter', NavFooter],
  ])('%s renders nothing instead of throwing', (_name, Component) => {
    expect(html(<Component {...none} />)).toBe('')
  })
})
