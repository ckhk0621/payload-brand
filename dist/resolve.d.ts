import type { Brand, ResolvedBrand, Warn } from './types.js';
export declare const ACCENT_FALLBACK = "var(--color-base-0)";
export declare const UNBRANDED: ResolvedBrand;
/** Resolves a brand for the admin. Never throws; problems are reported through `warn`. */
export declare function resolveBrand(input: Brand | undefined, warn: Warn): ResolvedBrand;
