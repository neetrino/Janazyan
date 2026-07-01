import type { LanguageCode } from '../../lib/language';

/** Locales supported for FAQ translations in admin (hy, ru, en). */
export const FAQ_LOCALES = ['hy', 'ru', 'en'] as const satisfies readonly LanguageCode[];

export type FaqLocale = (typeof FAQ_LOCALES)[number];

export type FaqCategoryTranslationInput = {
  locale: FaqLocale;
  title: string;
};

export type FaqItemTranslationInput = {
  locale: FaqLocale;
  question: string;
  answer: string;
};
