export const baseUrl = import.meta.env.BASE_URL.replace(/\/?$/, '/');
export function languageBase(lang: 'en' | 'es') { return baseUrl + (lang === 'es' ? 'es/' : ''); }
export function localHref(href: string, lang: 'en' | 'es' = 'en') { return href.startsWith('/') ? languageBase(lang) + href.slice(1) : href; }
