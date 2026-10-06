// Values copied from Payload (as of 3.90.1). test/unit/payload-mirror.test.ts compares them with
// the installed Payload, so `pnpm test:payload <version>` fails when a release changes one.
import { toHex } from './color.js';
/**
 * Grey channel per --color-base-* step (@payloadcms/ui/dist/scss/colors.scss): the steps the dark
 * theme maps --theme-elevation-* onto (base-950/1000 are unused there).
 */ export const PAYLOAD_BASE_GREYS = {
    0: 255,
    50: 245,
    100: 235,
    150: 221,
    200: 208,
    250: 195,
    300: 181,
    350: 168,
    400: 154,
    450: 141,
    500: 128,
    550: 114,
    600: 101,
    650: 87,
    700: 74,
    750: 60,
    800: 47,
    850: 34,
    900: 20
};
/** The dark admin background when no palette is derived: --theme-elevation-0 → --color-base-900. */ export const PAYLOAD_DARK_BACKGROUND = toHex({
    b: PAYLOAD_BASE_GREYS[900],
    g: PAYLOAD_BASE_GREYS[900],
    r: PAYLOAD_BASE_GREYS[900]
});
/** --font-body (@payloadcms/next/dist/prod/styles.css). */ export const PAYLOAD_FONT_BODY = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
