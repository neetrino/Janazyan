import type { FaqItemTranslationInput } from '../../../features/faq/faq-locales';

export type AdminFaqItem = {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  position: number;
  published: boolean;
  translations: FaqItemTranslationInput[];
};

export type FaqItemFormData = {
  categoryId?: string;
  translations: FaqItemTranslationInput[];
  position: string;
  published: 'published' | 'draft';
};
