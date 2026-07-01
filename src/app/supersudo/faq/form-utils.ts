import { FAQ_LOCALES } from '../../../features/faq/faq-locales';
import type { AdminFaqItem, FaqItemFormData } from './types';

export function createEmptyItemFormData(): FaqItemFormData {
  return {
    translations: FAQ_LOCALES.map((locale) => ({
      locale,
      question: '',
      answer: '',
    })),
    position: '0',
    published: 'draft',
  };
}

export function itemFormDataFromRow(item: AdminFaqItem): FaqItemFormData {
  const byLocale = new Map(item.translations.map((t) => [t.locale, t]));

  return {
    categoryId: item.categoryId,
    translations: FAQ_LOCALES.map((locale) => {
      const existing = byLocale.get(locale);
      return {
        locale,
        question: existing?.question ?? '',
        answer: existing?.answer ?? '',
      };
    }),
    position: String(item.position),
    published: item.published ? 'published' : 'draft',
  };
}

export function parseItemPayload(formData: FaqItemFormData, isEdit: boolean) {
  const position = Number.parseInt(formData.position, 10);
  return {
    ...(isEdit && formData.categoryId ? { categoryId: formData.categoryId } : {}),
    translations: formData.translations,
    position: Number.isFinite(position) ? position : 0,
    published: formData.published === 'published',
  };
}
