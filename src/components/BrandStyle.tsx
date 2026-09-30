export const THEME_STYLE_HREF = 'payload-brand-theme'

/** React 19 hoists both elements into <head> and dedupes them by href. */
export function BrandStyle({ css, fontHref }: { css: string; fontHref: null | string }) {
  return (
    <>
      {fontHref ? <link href={fontHref} precedence="default" rel="stylesheet" /> : null}
      <style href={THEME_STYLE_HREF} precedence="default">
        {css}
      </style>
    </>
  )
}
