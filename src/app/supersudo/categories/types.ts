import type { LocalizedText } from '@/lib/i18n/localized-text';

export interface Category {
  id: string;
  slug: string;
  title: string;
  parentId: string | null;
  position: number;
  requiresSizes?: boolean;
  imageUrl?: string | null;
  published?: boolean;
  translations?: Array<{ locale: string; title: string }>;
  children?: Category[];
}

export interface CategoryWithLevel extends Category {
  level: number;
}

export interface CategoryFormData {
  title: string;
  slug: string;
  translations: LocalizedText[];
  parentId: string;
  requiresSizes: boolean;
  subcategoryIds: string[];
  imageUrl: string;
  published: 'published' | 'draft';
}




