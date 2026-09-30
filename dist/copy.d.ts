export type Labels = {
    greet: (who: null | string) => string;
    help: string;
};
/** Payload passes i18n.language (e.g. 'en', 'zh', 'zh-TW'). */
export declare function labelsFor(language: unknown): Labels;
