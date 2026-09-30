export declare const PALETTE_STEPS: readonly number[];
export declare const MAX_BACKGROUND_LIGHTNESS = 0.35;
export type PaletteResult = {
    ok: false;
    reason: string;
} | {
    ok: true;
    vars: Record<string, string>;
};
export declare function derivePalette(background: unknown, { maxLightness }?: {
    maxLightness?: number;
}): PaletteResult;
