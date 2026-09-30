import type { ResolvedBrand } from '../types.js';
/** serverProps set by the plugin. */
export type BrandProps = {
    brand: ResolvedBrand;
    css: string;
};
/** The subset of Payload's default server props these components read. */
export type ViewerProps = {
    i18n?: {
        language?: string;
    };
    user?: {
        email?: unknown;
        name?: unknown;
    } | null;
};
