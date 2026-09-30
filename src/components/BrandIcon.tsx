import type { BrandProps } from './props.js'

import { IdeastimeMark } from './IdeastimeMark.js'

/** admin.components.graphics.Icon — rendered in the app header on authenticated views. */
export function BrandIcon({ brand }: BrandProps) {
  const mark = brand.mark
  if (!mark) {
    return null
  }
  if (mark.kind === 'ideastime') {
    return <IdeastimeMark className="pb-icon" />
  }
  return <img alt="" className="pb-icon" src={mark.src} />
}
