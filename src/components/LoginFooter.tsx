import type { BrandProps, ViewerProps } from './props.js'

import { BrandStyle } from './BrandStyle.js'
import { Signature } from './Signature.js'

/** admin.components.afterLogin — also carries the theme so login stays branded under a project Logo. */
export function LoginFooter({ brand, css, i18n }: BrandProps & ViewerProps) {
  if (!brand || css === undefined) {
    return null
  }
  return (
    <div className="pb-login-footer">
      <BrandStyle css={css} fontHref={brand.font?.href ?? null} />
      <Signature language={i18n?.language} />
    </div>
  )
}
