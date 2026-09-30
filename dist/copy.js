const ZH = {
    greet: (who)=>who ? `您好，${who}` : '您好',
    help: '需要協助？'
};
const EN = {
    greet: (who)=>who ? `Hello, ${who}` : 'Hello',
    help: 'Need help?'
};
/** Payload passes i18n.language (e.g. 'en', 'zh', 'zh-TW'). */ export function labelsFor(language) {
    return typeof language === 'string' && language.toLowerCase().startsWith('zh') ? ZH : EN;
}
