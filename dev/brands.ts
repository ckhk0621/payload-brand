import type { Brand } from '../src/types.js'

// Fictional client brand used to exercise the client path. Keep it fictional: this repo is public.
export const exampleBrand: Brand = {
  colors: { accent: '#4FD1C5', background: '#10231F' },
  logo: '/brand/example-logo.svg',
  mark: '/brand/example-mark.svg',
  name: 'Example Co.',
  ogImage: 'https://example.com/og.png',
  welcome: {
    dashboard: 'Manage your Example Co. content here.',
    login: 'Welcome back to Example Co.',
  },
}
