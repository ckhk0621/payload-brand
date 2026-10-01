import { IDEASTIME } from './ideastime.js';
// Payload 3.90.1 --font-body (@payloadcms/next/dist/prod/styles.css). Appended after the brand
// family so CJK text falls back to system fonts.
export const PAYLOAD_FONT_BODY_3_90_1 = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const COMPONENT_CSS = [
    // No percentage sizes here: Payload's login brand wrapper is a flex container, and a %
    // max-width on a shrink-to-fit child collapses the logo to 0px wide.
    '.pb-logo{display:inline-flex;align-items:center;gap:.75rem}',
    '.pb-logo__img{display:block;height:3rem;width:auto;max-width:20rem;object-fit:contain;object-position:left center}',
    '.pb-logo__mark{display:block;height:2rem;width:auto}',
    '.pb-wordmark{font-weight:800;letter-spacing:-.04em;font-size:1.75rem;line-height:1;color:var(--theme-elevation-1000)}',
    '.pb-wordmark__accent{color:var(--pb-wordmark-accent)}',
    // A square box inside Payload's 18px nav slot: wide marks scale down instead of spilling out.
    '.pb-icon{display:block;width:1.25rem;height:1.25rem;object-fit:contain}',
    '.pb-welcome{margin:0 0 1.5rem;color:var(--theme-elevation-800)}',
    '.pb-signature{display:flex;flex-direction:column;gap:.25rem;font-size:.75rem;line-height:1.4;color:var(--theme-elevation-500)}',
    '.pb-signature a{color:inherit;text-decoration:none}',
    '.pb-signature a:hover{color:var(--theme-elevation-1000)}',
    '.pb-signature__brand{color:var(--pb-wordmark-accent);font-weight:600}',
    '.pb-login-footer{margin-top:2rem}',
    '.pb-nav-footer{margin-top:auto;padding-top:1.5rem}',
    '.pb-dashboard-card{margin-bottom:2rem;padding:1.25rem 1.5rem;border:1px solid var(--theme-elevation-150);border-left:3px solid var(--pb-accent);border-radius:4px}',
    '.pb-dashboard-card__title{margin:0 0 .25rem;font-size:1.25rem}',
    '.pb-dashboard-card__text{margin:0 0 .75rem;color:var(--theme-elevation-800)}'
].join('');
/**
 * One stylesheet for the whole admin: palette + font as unlayered :root variables (these beat
 * Payload's @layer payload-default regardless of insertion order), then pb- component classes.
 */ export function buildThemeCss(brand) {
    const vars = Object.entries(brand.palette ?? {}).map(([name, value])=>`${name}:${value}`);
    if (brand.font) {
        vars.push(`--font-body:'${brand.font.family}', ${PAYLOAD_FONT_BODY_3_90_1}`);
    }
    vars.push(`--pb-accent:${brand.accent}`, `--pb-wordmark-accent:${IDEASTIME.wordmark.accent}`);
    // Inputs are validated upstream; still never emit anything that could close the <style> tag.
    return `:root{${vars.join(';')}}${COMPONENT_CSS}`.replaceAll('</', '<\\/');
}
