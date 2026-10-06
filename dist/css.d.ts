import type { ResolvedBrand } from './types.js';
/**
 * One stylesheet for the whole admin: palette + font as unlayered :root variables (these beat
 * Payload's @layer payload-default regardless of insertion order), then pb- component classes.
 */
export declare function buildThemeCss(brand: ResolvedBrand): string;
