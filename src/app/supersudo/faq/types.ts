import type {
  FaqCategoryTranslationInput,
  FaqItemTranslationInput,
} from '../../../features/faq/faq-locales';

export type AdminFaqCategory = {
  id: string;
  slug: string;
  title: string;
  position: number;
  published: boolean;
  translations: FaqCategoryTranslationInput[];
};

export type AdminFaqItem = {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  position: number;
  published: boolean;
  translations: FaqItemTranslationInput[];
};

export type FaqCategoryFormData = {
  translations: FaqCategoryTranslationInput[];
  position: string;
  published: 'published' | 'draft';
};

export type FaqItemFormData = {
  categoryId: string;
  translations: FaqItemTranslationInput[];
  position: string;
  published: 'published' | 'draft';
};
