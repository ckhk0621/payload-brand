import type { Plugin } from 'payload';
import type { Brand } from './types.js';
export { IDEASTIME } from './ideastime.js';
export type { Brand, ResolvedBrand } from './types.js';
/**
 * Brands the Payload admin. Call with no argument for the iDeasTime demo brand, or pass a
 * client `Brand`. Never throws: on any problem the admin falls back to Payload's defaults.
 */
export declare function brandPlugin(brand?: Brand): Plugin;
