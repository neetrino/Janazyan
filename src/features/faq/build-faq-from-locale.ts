import { loadTranslation } from '../../lib/i18n';
import type { LanguageCode } from '../../lib/language';
import type { FaqSection } from './types';

type LocaleFaqCategory = {
  title?: string;
  questions?: Record<string, { q?: string; a?: string }>;
};

type LocaleFaqFile = {
  categories?: Record<string, LocaleFaqCategory>;
};

/** Legacy static fallback from translation JSON when DB has no published FAQ. */
export function buildFaqFromLocale(lang: LanguageCode): FaqSection[] {
  const faqData = loadTranslation(lang, 'faq') as LocaleFaqFile | null;
  const categories = faqData?.categories ?? {};

  return Object.entries(categories).map(([categoryKey, category]) => {
    const questions = Object.entries(category.questions ?? {}).map(([questionKey, entry]) => ({
      id: `${categoryKey}-${questionKey}`,
      question: entry.q ?? '',
      answer: entry.a ?? '',
    }));

    return {
      id: categoryKey,
      title: category.title ?? '',
      questions: questions.filter((q) => q.question.trim() && q.answer.trim()),
    };
  });
}
