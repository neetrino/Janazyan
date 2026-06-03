import { LANGUAGES } from '../../lib/language';

/** Locales supported for FAQ translations in admin. */
export const FAQ_LOCALES = Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>;

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
