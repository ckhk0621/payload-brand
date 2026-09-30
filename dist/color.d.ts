export type Rgb = {
    b: number;
    g: number;
    r: number;
};
export type Oklch = {
    C: number;
    h: number;
    L: number;
};
export declare function parseHex(input: unknown): null | Rgb;
export declare function toHex({ b, g, r }: Rgb): string;
export declare function rgbToOklch(rgb: Rgb): Oklch;
/** Converts OKLCH to sRGB, reducing chroma until the colour fits the sRGB gamut. */
export declare function oklchToRgb(color: Oklch): Rgb;
export declare function relativeLuminance({ b, g, r }: Rgb): number;
export declare function contrastRatio(a: Rgb, b: Rgb): number;
