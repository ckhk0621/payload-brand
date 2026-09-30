// Colour maths for palette derivation.
// OKLab: Björn Ottosson, https://bottosson.github.io/posts/oklab/
// Contrast: WCAG 2.x relative luminance.
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
export function parseHex(input) {
    if (typeof input !== 'string') {
        return null;
    }
    const value = input.trim();
    if (!HEX.test(value)) {
        return null;
    }
    const digits = value.length === 4 ? [
        ...value.slice(1)
    ].map((c)=>c + c).join('') : value.slice(1);
    return {
        b: parseInt(digits.slice(4, 6), 16),
        g: parseInt(digits.slice(2, 4), 16),
        r: parseInt(digits.slice(0, 2), 16)
    };
}
export function toHex({ b, g, r }) {
    return '#' + [
        r,
        g,
        b
    ].map((c)=>c.toString(16).padStart(2, '0')).join('');
}
function toLinear(channel) {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
function fromLinear(c) {
    return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}
export function rgbToOklch(rgb) {
    const r = toLinear(rgb.r);
    const g = toLinear(rgb.g);
    const b = toLinear(rgb.b);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    return {
        C: Math.hypot(A, B),
        h: Math.atan2(B, A),
        L
    };
}
function oklchToLinear({ C, h, L }) {
    const A = C * Math.cos(h);
    const B = C * Math.sin(h);
    const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
    const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
    const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
    ];
}
const EPSILON = 1e-6;
function inGamut(channels) {
    return channels.every((c)=>c >= -EPSILON && c <= 1 + EPSILON);
}
/** Converts OKLCH to sRGB, reducing chroma until the colour fits the sRGB gamut. */ export function oklchToRgb(color) {
    let C = color.C;
    let linear = oklchToLinear({
        ...color,
        C
    });
    for(let i = 0; i < 40 && !inGamut(linear); i++){
        C *= 0.9;
        linear = oklchToLinear({
            ...color,
            C
        });
    }
    const [r, g, b] = linear.map((c)=>Math.round(fromLinear(Math.min(1, Math.max(0, c))) * 255));
    return {
        b,
        g,
        r
    };
}
function luminanceChannel(channel) {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
export function relativeLuminance({ b, g, r }) {
    return 0.2126 * luminanceChannel(r) + 0.7152 * luminanceChannel(g) + 0.0722 * luminanceChannel(b);
}
export function contrastRatio(a, b) {
    const [high, low] = [
        relativeLuminance(a),
        relativeLuminance(b)
    ].sort((x, y)=>y - x);
    return (high + 0.05) / (low + 0.05);
}
