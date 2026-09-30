import { labelsFor } from '../copy.js'
import { IDEASTIME } from '../ideastime.js'

export function Signature({ language, showCredit = true }: { language?: string; showCredit?: boolean }) {
  const labels = labelsFor(language)
  const { email, phoneDisplay, whatsapp } = IDEASTIME.contact
  return (
    <div className="pb-signature">
      {showCredit ? (
        <a href={IDEASTIME.siteUrl} rel="noopener" target="_blank">
          Crafted by <span className="pb-signature__brand">iDeasTime</span>
        </a>
      ) : null}
      <span>{labels.help}</span>
      <a href={`mailto:${email}`}>{email}</a>
      <a href={`https://wa.me/${whatsapp}`} rel="noopener" target="_blank">
        WhatsApp {phoneDisplay}
      </a>
    </div>
  )
}
