import type { LanguageCode } from '../../lib/language';

/** Locales supported for blog post translations in admin. */
export const BLOG_LOCALES = ['hy', 'ru', 'en'] as const satisfies readonly LanguageCode[];

export type BlogLocale = (typeof BLOG_LOCALES)[number];

export type BlogTranslationInput = {
  locale: BlogLocale;
  title: string;
  contentHtml: string;
  excerpt?: string;
};
