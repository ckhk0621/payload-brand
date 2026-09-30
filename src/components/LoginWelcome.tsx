import type { BrandProps } from './props.js'

/** admin.components.beforeLogin — always registered so the importMap does not depend on brand content. */
export function LoginWelcome({ brand }: BrandProps) {
  return brand?.welcome.login ? <p className="pb-welcome">{brand.welcome.login}</p> : null
}
