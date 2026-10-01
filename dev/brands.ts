import type { Brand } from '../src/types.js'

// Second brand used to exercise the client path (brandPlugin(brand)). Its name must stay distinct
// from the preset's 'iDeasTime', or tests cannot tell a client brand from a silent preset fallback.
export const demoBrand: Brand = {
  colors: { accent: '#4FD1C5', background: '#10231F' },
  logo: '/brand/demo-logo.svg',
  mark: '/brand/demo-mark.svg',
  name: 'iDeasTime Demo',
  ogImage: 'https://example.com/og.png',
  welcome: {
    dashboard: 'Manage your iDeasTime Demo content here.',
    login: 'Welcome back to iDeasTime Demo.',
  },
}
