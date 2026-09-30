export type Labels = { greet: (who: null | string) => string; help: string }

const ZH: Labels = { greet: (who) => (who ? `您好，${who}` : '您好'), help: '需要協助？' }
const EN: Labels = { greet: (who) => (who ? `Hello, ${who}` : 'Hello'), help: 'Need help?' }

/** Payload passes i18n.language (e.g. 'en', 'zh', 'zh-TW'). */
export function labelsFor(language: unknown): Labels {
  return typeof language === 'string' && language.toLowerCase().startsWith('zh') ? ZH : EN
}
