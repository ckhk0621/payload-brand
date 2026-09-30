import type { BrandProps, ViewerProps } from './props.js'

import { BrandStyle } from './BrandStyle.js'
import { Signature } from './Signature.js'

/** admin.components.afterNavLinks — carries the theme on every authenticated view. */
export function NavFooter({ brand, css, i18n }: BrandProps & ViewerProps) {
  if (!brand || css === undefined) {
    return null
  }
  return (
    <div className="pb-nav-footer">
      <BrandStyle css={css} fontHref={brand.font?.href ?? null} />
      <Signature language={i18n?.language} />
    </div>
  )
}
