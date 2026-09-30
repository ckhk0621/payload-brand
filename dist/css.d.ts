import type { ResolvedBrand } from './types.js';
export declare const PAYLOAD_FONT_BODY_3_90_1 = "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif";
/**
 * One stylesheet for the whole admin: palette + font as unlayered :root variables (these beat
 * Payload's @layer payload-default regardless of insertion order), then pb- component classes.
 */
export declare function buildThemeCss(brand: ResolvedBrand): string;
