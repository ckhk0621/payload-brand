import { expect, type Page, test } from '@playwright/test'

const BRAND = process.env.BRAND === 'demo' ? 'demo' : 'ideastime'
const expected = {
  demo: {
    name: 'iDeasTime Demo',
    // No brand background: Payload 3.90.1's stock dark --color-base-900 (#141414).
    background: 'rgb(20, 20, 20)',
    icon: '/brand/demo-mark.svg',
    ogImage: 'https://example.com/og.png',
    tinted: false,
    welcomeLogin: 'Welcome back to iDeasTime Demo.',
  },
  ideastime: {
    name: 'iDeasTime',
    background: 'rgb(7, 26, 51)',
    icon: null,
    ogImage: 'https://www.ideastime.ltd/images/og-default.jpg',
    tinted: true,
    welcomeLogin: null,
  },
}[BRAND]
const devUser = { email: 'dev@example.com', password: 'dev-password-123' }
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const titleSuffix = new RegExp(`\\S — ${escapeRegExp(expected.name)}$`)

// toHaveTitle reads document.title, which collapses whitespace; the raw <title> text does not.
async function expectTitleSuffix(page: Page) {
  await expect(page).toHaveTitle(titleSuffix)
  expect(await page.locator('head > title').textContent()).toMatch(titleSuffix)
}

function rootBackground(page: Page) {
  return page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor)
}

async function login(page: Page) {
  await page.goto('/admin/login')
  await page.fill('#field-email', devUser.email)
  await page.fill('#field-password', devUser.password)
  await page.click('.form-submit button')
  await page.waitForURL(/\/admin\/?$/)
}

test('login page carries the brand', async ({ page }) => {
  await page.goto('/admin/login')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expectTitleSuffix(page)
  await expect(page.locator('.pb-logo')).toBeVisible()
  const footer = page.locator('.pb-login-footer')
  await expect(footer).toContainText('Crafted by iDeasTime')
  await expect(footer.locator('a[href^="https://wa.me/"]')).toBeVisible()
  await expect(footer.locator('a[href^="mailto:"]')).toBeVisible()
  expect(await rootBackground(page)).toBe(expected.background)
  const theme = page.locator('head style[data-href="payload-brand-theme"]')
  await expect(theme).toHaveCount(1)
  // Only a brand with a background may define Payload's palette variables (a var() reference,
  // like the neutral accent fallback, is not an override).
  expect(/--color-base-\d+:/.test((await theme.textContent()) ?? '')).toBe(expected.tinted)
  if (expected.welcomeLogin) {
    await expect(page.locator('.pb-welcome')).toHaveText(expected.welcomeLogin)
    const loaded = await page
      .locator('.pb-logo img')
      .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)
    expect(loaded).toBe(true)
  } else {
    await expect(page.locator('.pb-welcome')).toHaveCount(0)
  }
})

test('favicon and link preview point at the brand', async ({ page }) => {
  await page.goto('/admin/login')
  const icon = await page.locator('head link[rel="icon"]').first().getAttribute('href')
  if (expected.icon) {
    expect(icon).toBe(expected.icon)
  } else {
    expect(icon).toMatch(/^data:image\/svg\+xml,/)
  }
  await expect(page.locator('head meta[property="og:image"]').first()).toHaveAttribute(
    'content',
    expected.ogImage,
  )
  // Previews must not fall back to Payload's defaults ("Payload App").
  await expect(page.locator('head meta[property="og:site_name"]')).toHaveAttribute(
    'content',
    expected.name,
  )
  await expect(page.locator('head meta[property="og:image"]')).toHaveCount(1)
})

test('dashboard greets the user and the nav carries the signature', async ({ page }) => {
  await login(page)
  await expect(page.locator('.pb-dashboard-card')).toContainText(`Hello, ${devUser.email}`)
  await expect(page.locator('.pb-nav-footer')).toContainText('Crafted by iDeasTime')
  expect(await rootBackground(page)).toBe(expected.background)
})

test('nav icon fits inside its slot whatever the mark proportions', async ({ page }) => {
  await login(page)
  // Payload's slot is 18px on desktop and 16px on phones; a wider icon spills out of it (R10).
  for (const viewport of [{ height: 900, width: 1440 }, { height: 844, width: 390 }]) {
    await page.setViewportSize(viewport)
    const slot = page.locator('.step-nav__home')
    const icon = slot.locator('.pb-icon')
    await expect(icon).toBeVisible()
    const slotBox = (await slot.boundingBox())!
    const iconBox = (await icon.boundingBox())!
    expect(iconBox.x).toBeGreaterThanOrEqual(slotBox.x - 0.5)
    expect(iconBox.y).toBeGreaterThanOrEqual(slotBox.y - 0.5)
    expect(iconBox.x + iconBox.width).toBeLessThanOrEqual(slotBox.x + slotBox.width + 0.5)
    expect(iconBox.y + iconBox.height).toBeLessThanOrEqual(slotBox.y + slotBox.height + 0.5)
  }
})

test('collection and account views keep the theme', async ({ page }) => {
  await login(page)
  for (const path of ['/admin/collections/posts', '/admin/collections/posts/create', '/admin/account']) {
    await page.goto(path)
    await expect(page.locator('.pb-nav-footer')).toBeAttached()
    expect(await rootBackground(page)).toBe(expected.background)
  }
})

test('forgot-password page renders with the title suffix (known limitation: not themed)', async ({
  page,
}) => {
  await page.goto('/admin/forgot')
  await expect(page.locator('#field-email')).toBeVisible()
  await expectTitleSuffix(page)
})
