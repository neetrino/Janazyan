import { db } from '@white-shop/db';
import type { FaqSection } from '@/features/faq/types';
import { DEFAULT_LANGUAGE } from '@/lib/language';

function pickTranslation<T extends { locale: string }>(
  translations: T[],
  locale: string,
): T | undefined {
  return (
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === DEFAULT_LANGUAGE) ??
    translations[0]
  );
}

/**
 * Published FAQ sections with questions for the public /faq page.
 */
export async function getPublishedFaq(locale: string): Promise<FaqSection[]> {
  const localeFilter = { locale: { in: [locale, DEFAULT_LANGUAGE] } };

  const categories = await db.faqCategory.findMany({
    where: { published: true, deletedAt: null },
    select: {
      id: true,
      translations: { where: localeFilter },
      items: {
        where: { published: true, deletedAt: null },
        select: {
          id: true,
          translations: { where: localeFilter },
        },
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      },
    },
    orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
  });

  return categories
    .map((category) => {
      const categoryTr = pickTranslation(category.translations, locale);
      const title = categoryTr?.title?.trim() ?? '';
      if (!title) {
        return null;
      }

      const questions = category.items
        .map((item) => {
          const itemTr = pickTranslation(item.translations, locale);
          const question = itemTr?.question?.trim() ?? '';
          const answer = itemTr?.answer?.trim() ?? '';
          if (!question || !answer) {
            return null;
          }
          return { id: item.id, question, answer };
        })
        .filter((q): q is NonNullable<typeof q> => q !== null);

      if (!questions.length) {
        return null;
      }

      return { id: category.id, title, questions };
    })
    .filter((section): section is FaqSection => section !== null);
}
