export type Brand = {
  /** Omit to keep Payload's own dark mode. */
  colors?: {
    /** Hex colour used only by payload-brand components (card border). Omit for Payload's white. */
    accent?: string
    /** Dark hex colour; tints Payload's neutral palette. Omit to keep Payload's grey. */
    background?: string
  }
  font?: { family: string; href: string }
  /** Full logo for dark backgrounds: a path starting with "/" or an https:// URL. */
  logo?: string
  /** Mark for dark backgrounds, ideally square (wider ones shrink to fit the nav icon): a path
   * starting with "/" or an https:// URL. */
  mark: string
  name: string
  /** Absolute https:// URL of a raster image for link previews. */
  ogImage?: string
  welcome?: { dashboard?: string; login?: string }
}

export type BrandGraphic = { kind: 'ideastime' } | { kind: 'image'; src: string }
export type BrandLogo = { kind: 'lockup'; markSrc: string } | BrandGraphic

export type ResolvedBrand = {
  accent: string
  font: { family: string; href: string } | null
  logo: BrandLogo | null
  mark: BrandGraphic | null
  name: null | string
  ogImage: null | string
  palette: null | Record<string, string>
  welcome: { dashboard: null | string; login: null | string }
}

export type Warn = (message: string) => void
