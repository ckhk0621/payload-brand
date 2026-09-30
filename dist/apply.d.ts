import type { Config } from 'payload';
import type { Brand, Warn } from './types.js';
export declare const COMPONENT_PREFIX = "@ideastime/payload-brand/rsc#";
/** Pure config transform. Project-set values always win; conflicts are reported via `warn`. */
export declare function applyBrand(config: Config, input: Brand | undefined, warn: Warn): Config;
