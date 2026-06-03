import { loadTranslation } from '../../lib/i18n';
import type { LanguageCode } from '../../lib/language';
import type { FaqPageCopy } from './types';

/** Page chrome (title, CTA) from locale files. */
export function loadFaqPageCopy(lang: LanguageCode): FaqPageCopy {
  const data = loadTranslation(lang, 'faq') as FaqPageCopy | null;
  return {
    title: data?.title ?? '',
    description: data?.description ?? '',
    stillHaveQuestions: {
      title: data?.stillHaveQuestions?.title ?? '',
      description: data?.stillHaveQuestions?.description ?? '',
      contactUs: data?.stillHaveQuestions?.contactUs ?? '',
      getSupport: data?.stillHaveQuestions?.getSupport ?? '',
    },
  };
}
