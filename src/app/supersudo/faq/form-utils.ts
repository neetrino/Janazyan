import { FAQ_LOCALES } from '../../../features/faq/faq-locales';
import type {
  AdminFaqCategory,
  AdminFaqItem,
  FaqCategoryFormData,
  FaqItemFormData,
} from './types';

export function createEmptyCategoryFormData(): FaqCategoryFormData {
  return {
    translations: FAQ_LOCALES.map((locale) => ({ locale, title: '' })),
    position: '0',
    published: 'draft',
  };
}

export function categoryFormDataFromRow(category: AdminFaqCategory): FaqCategoryFormData {
  const byLocale = new Map(category.translations.map((t) => [t.locale, t]));

  return {
    translations: FAQ_LOCALES.map((locale) => {
      const existing = byLocale.get(locale);
      return { locale, title: existing?.title ?? '' };
    }),
    position: String(category.position),
    published: category.published ? 'published' : 'draft',
  };
}

export function parseCategoryPayload(formData: FaqCategoryFormData) {
  const position = Number.parseInt(formData.position, 10);
  return {
    translations: formData.translations,
    position: Number.isFinite(position) ? position : 0,
    published: formData.published === 'published',
  };
}

export function createEmptyItemFormData(categoryId = ''): FaqItemFormData {
  return {
    categoryId,
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

export function parseItemPayload(formData: FaqItemFormData) {
  const position = Number.parseInt(formData.position, 10);
  return {
    categoryId: formData.categoryId,
    translations: formData.translations,
    position: Number.isFinite(position) ? position : 0,
    published: formData.published === 'published',
  };
}
