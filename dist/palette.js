import { contrastRatio, oklchToRgb, parseHex, rgbToOklch, toHex } from './color.js';
// Payload 3.90.1 neutral palette, grey channel value per step
// (@payloadcms/ui/dist/scss/colors.scss). Only its lightness curve is reused, so the derived
// palette keeps Payload's own contrast relationships. Re-check when Payload changes it.
const PAYLOAD_BASE_3_90_1 = {
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
// Steps the dark theme maps --theme-elevation-* onto (base-950/1000 are unused there).
export const PALETTE_STEPS = Object.keys(PAYLOAD_BASE_3_90_1).map(Number).sort((a, b)=>a - b);
export const MAX_BACKGROUND_LIGHTNESS = 0.35;
const TOP_LIGHTNESS = 0.985;
const MIN_CONTRAST = 4.5;
function referenceLightness(step) {
    const v = PAYLOAD_BASE_3_90_1[step];
    return rgbToOklch({
        b: v,
        g: v,
        r: v
    }).L;
}
export function derivePalette(background, { maxLightness = MAX_BACKGROUND_LIGHTNESS } = {}) {
    const rgb = parseHex(background);
    if (!rgb) {
        return {
            ok: false,
            reason: 'brand.colors.background must be a #rgb or #rrggbb hex colour'
        };
    }
    const bg = rgbToOklch(rgb);
    if (bg.L > maxLightness) {
        return {
            ok: false,
            reason: `brand.colors.background is too light for the dark admin theme (OKLCH L ${bg.L.toFixed(2)} > ${maxLightness})`
        };
    }
    const low = referenceLightness(900);
    const high = referenceLightness(0);
    const colours = new Map();
    for (const step of PALETTE_STEPS){
        if (step === 900) {
            colours.set(step, rgb);
            continue;
        }
        const t = (referenceLightness(step) - low) / (high - low);
        colours.set(step, oklchToRgb({
            C: bg.C * (1 - t),
            h: bg.h,
            L: bg.L + t * (TOP_LIGHTNESS - bg.L)
        }));
    }
    const text = contrastRatio(colours.get(0), colours.get(900));
    const button = contrastRatio(colours.get(900), colours.get(100));
    if (text < MIN_CONTRAST || button < MIN_CONTRAST) {
        return {
            ok: false,
            reason: `derived palette fails WCAG AA contrast (text ${text.toFixed(2)}:1, button ${button.toFixed(2)}:1; need ${MIN_CONTRAST}:1)`
        };
    }
    return {
        ok: true,
        vars: Object.fromEntries(PALETTE_STEPS.map((step)=>[
                `--color-base-${step}`,
                toHex(colours.get(step))
            ]))
    };
}
