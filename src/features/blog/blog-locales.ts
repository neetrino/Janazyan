import { LANGUAGES } from '../../lib/language';

/** Locales supported for blog post translations in admin. */
export const BLOG_LOCALES = Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>;

export type BlogLocale = (typeof BLOG_LOCALES)[number];

export type BlogTranslationInput = {
  locale: BlogLocale;
  title: string;
  contentHtml: string;
  excerpt?: string;
};
