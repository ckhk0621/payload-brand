import type { BrandProps, ViewerProps } from './props.js'

import { labelsFor } from '../copy.js'
import { Signature } from './Signature.js'

function displayName(user: ViewerProps['user']): null | string {
  if (typeof user?.name === 'string' && user.name.trim() !== '') {
    return user.name.trim()
  }
  return typeof user?.email === 'string' ? user.email : null
}

/** admin.components.beforeDashboard — appended after any project components. */
export function DashboardWelcome({ brand, i18n, user }: BrandProps & ViewerProps) {
  const labels = labelsFor(i18n?.language)
  return (
    <section className="pb-dashboard-card">
      <h2 className="pb-dashboard-card__title">{labels.greet(displayName(user))}</h2>
      {brand.welcome.dashboard ? (
        <p className="pb-dashboard-card__text">{brand.welcome.dashboard}</p>
      ) : null}
      <Signature language={i18n?.language} showCredit={false} />
    </section>
  )
}
