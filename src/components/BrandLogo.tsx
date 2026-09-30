import type { ResolvedBrand } from '../types.js'
import type { BrandProps } from './props.js'

import { BrandStyle } from './BrandStyle.js'
import { IdeastimeMark } from './IdeastimeMark.js'

function LogoContent({ brand }: { brand: ResolvedBrand }) {
  const logo = brand.logo
  if (!logo) {
    return null
  }
  if (logo.kind === 'ideastime') {
    return (
      <>
        <IdeastimeMark className="pb-logo__mark" />
        <span className="pb-wordmark">
          iDeas<span className="pb-wordmark__accent">Time</span>
        </span>
      </>
    )
  }
  if (logo.kind === 'image') {
    return <img alt={brand.name ?? ''} className="pb-logo__img" src={logo.src} />
  }
  return (
    <>
      <img alt="" className="pb-logo__mark" src={logo.markSrc} />
      <span className="pb-wordmark">{brand.name}</span>
    </>
  )
}

/** admin.components.graphics.Logo — rendered on the login view. */
export function BrandLogo({ brand, css }: BrandProps) {
  return (
    <span aria-label={brand.name ?? undefined} className="pb-logo">
      <BrandStyle css={css} fontHref={brand.font?.href ?? null} />
      <LogoContent brand={brand} />
    </span>
  )
}
