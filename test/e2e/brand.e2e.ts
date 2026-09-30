import { expect, type Page, test } from '@playwright/test'

const BRAND = process.env.BRAND === 'example' ? 'example' : 'ideastime'
const expected = {
  example: {
    name: 'Example Co.',
    background: 'rgb(16, 35, 31)',
    icon: '/brand/example-mark.svg',
    ogImage: 'https://example.com/og.png',
    welcomeLogin: 'Welcome back to Example Co.',
  },
  ideastime: {
    name: 'iDeasTime',
    background: 'rgb(7, 26, 51)',
    icon: null,
    ogImage: 'https://www.ideastime.ltd/images/og-default.jpg',
    welcomeLogin: null,
  },
}[BRAND]
const devUser = { email: 'dev@example.com', password: 'dev-password-123' }
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const titleSuffix = new RegExp(`— ${escapeRegExp(expected.name)}$`)

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
  await expect(page).toHaveTitle(titleSuffix)
  await expect(page.locator('.pb-logo')).toBeVisible()
  const footer = page.locator('.pb-login-footer')
  await expect(footer).toContainText('Crafted by iDeasTime')
  await expect(footer.locator('a[href^="https://wa.me/"]')).toBeVisible()
  await expect(footer.locator('a[href^="mailto:"]')).toBeVisible()
  expect(await rootBackground(page)).toBe(expected.background)
  await expect(page.locator('head style[data-href="payload-brand-theme"]')).toHaveCount(1)
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
})

test('dashboard greets the user and the nav carries the signature', async ({ page }) => {
  await login(page)
  await expect(page.locator('.pb-dashboard-card')).toContainText(`Hello, ${devUser.email}`)
  await expect(page.locator('.pb-nav-footer')).toContainText('Crafted by iDeasTime')
  expect(await rootBackground(page)).toBe(expected.background)
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
  await expect(page).toHaveTitle(titleSuffix)
})
