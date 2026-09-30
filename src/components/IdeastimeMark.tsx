import { IDEASTIME } from '../ideastime.js'

/** Dark-variant iDeasTime "eyes" mark (official-site-2027/components/brand/Logo.tsx). */
export function IdeastimeMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} role="presentation" viewBox="0 0 100 56">
      <rect fill={IDEASTIME.mark.left} height="56" rx="14" width="42" x="0" y="0" />
      <rect fill={IDEASTIME.mark.right} height="56" rx="14" width="42" x="58" y="0" />
    </svg>
  )
}
