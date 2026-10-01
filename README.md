# @ideastime/payload-brand

Admin branding for Payload CMS 3 by [iDeasTime](https://www.ideastime.ltd): a dark admin tinted to
the brand, logo and favicon, a welcome card, and a "Crafted by iDeasTime" signature with support
contacts. With no brand passed it shows the iDeasTime brand itself.

It only uses documented Payload APIs (`admin.components` slots, `admin.meta`, `admin.theme`, CSS
variables). It never registers `admin.components.providers` and never throws: if anything is
wrong, that part of the admin falls back to Payload's defaults.

Tested with Payload 3.90.1 and 3.90.2 on Next 16.3.6.

## Install

1. `pnpm add github:ckhk0621/payload-brand#semver:^1.0.0`
2. Put dark-background versions of the mark (and optionally the full logo) in `public/brand/`, then
   create `src/brand.ts`:

   ```ts
   import type { Brand } from '@ideastime/payload-brand'

   export const brand: Brand = {
     name: 'iDeasTime Demo',
     mark: '/brand/mark.svg',
     logo: '/brand/logo.svg',
     colors: { accent: '#4FD1C5', background: '#10231F' },
     ogImage: 'https://example.com/og.png',
     welcome: { login: 'Welcome back', dashboard: 'Manage your content here.' },
   }
   ```

3. Add the plugin: `plugins: [brandPlugin(brand)]` (or `brandPlugin()` for the iDeasTime brand itself).
4. Run `pnpm payload generate:importmap`. Projects using R2/S3 storage must run it with their
   storage env loaded, or the storage upload handler drops out of the importMap.

**Re-run step 4 after every change to `brand.ts` and every upgrade of this package.** A component
missing from the importMap does not error: it silently disappears.

## Brand fields

| Field | Rule |
|---|---|
| `name` | Title suffix, logo alt text |
| `mark` | Square mark for dark backgrounds; path starting with `/` or an `https://` URL |
| `logo` | Optional full logo; without it the login shows mark + name |
| `colors.background` | Optional dark hex; tints the whole admin. Too light → Payload grey |
| `colors.accent` | Hex; used only by this package's components. Needs 3:1 against the background |
| `font` | Optional `{ family, href }`; plain family name, `https://` stylesheet |
| `ogImage` | Optional **absolute** `https://` URL (Payload resolves relative paths against `serverURL`). Without it, link previews show the brand name but no image: Payload's generated `/api/og` image is turned off because it cannot draw a relative-path mark |
| `welcome` | Optional login and dashboard text |

## Known limitations

- The forgot-password and create-first-user views render none of the slots, so they keep Payload's
  grey (dark) look; only the title suffix and favicon apply there.
- Primary buttons keep Payload's design (light button on dark background), tinted by the palette.
- The login logo is shown 3rem high (up to 20rem wide); very wide logos are letterboxed.
- Do not also override `--color-base-*` in your own `custom.scss`: both are unlayered and the last
  one loaded wins.

## Before upgrading Payload in a client project

Run the upgrade gate in this repo against the target version:

```bash
pnpm test:payload 3.91.0
```

It installs that version into the dev app, runs unit tests, the e2e smoke for both brands and the
fail-soft check, then restores the repo. A weekly CI run does the same against npm `latest`, but
GitHub disables scheduled workflows after 60 days of inactivity, so do not rely on it alone.

## Development

```bash
pnpm install
pnpm dev                  # dev app on :3000 (BRAND=demo for the iDeasTime Demo client brand)
pnpm test:unit
pnpm test:e2e             # both brands
pnpm test:failsoft        # admin survives a missing component
pnpm lint
```

`dist/` is committed and only updated by `pnpm release <x.y.z>`, which builds, checks, commits
`dist/` with the version bump and tags. Consumers install tags, not `main`.

This repository is public: no client names or internal details in code, fixtures or commits.
iDeasTime values in `src/ideastime.ts` mirror the official site; update both together.
