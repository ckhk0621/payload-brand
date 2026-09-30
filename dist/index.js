import { applyBrand } from './apply.js';
export { IDEASTIME } from './ideastime.js';
const printed = new Set();
function warnOnce(message) {
    if (printed.has(message)) {
        return;
    }
    printed.add(message);
    // The plugin's only output channel: config-time warnings in the server log.
    // eslint-disable-next-line no-console
    console.warn(`[payload-brand] ${message}`);
}
/**
 * Brands the Payload admin. Call with no argument for the iDeasTime demo brand, or pass a
 * client `Brand`. Never throws: on any problem the admin falls back to Payload's defaults.
 */ export function brandPlugin(brand) {
    return (config)=>{
        try {
            return applyBrand(config, brand, warnOnce);
        } catch (error) {
            warnOnce(`unexpected error, admin left unbranded: ${error instanceof Error ? error.message : String(error)}`);
            return config;
        }
    };
}
