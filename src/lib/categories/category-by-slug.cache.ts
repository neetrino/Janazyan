import { unstable_cache } from 'next/cache';
import {
  findCategoryBySlug,
  findCategoryIdsBySlug,
} from '@/lib/services/products-find-query/category-utils';

const CATEGORY_BY_SLUG_REVALIDATE_SECONDS = 300;

export const getCachedCategoryBySlug = unstable_cache(
  async (slug: string, lang: string): Promise<{ id: string } | null> =>
    findCategoryBySlug(slug, lang),
  ['category-by-slug-v3'],
  { revalidate: CATEGORY_BY_SLUG_REVALIDATE_SECONDS, tags: ['categories'] },
);

export const getCachedCategoryIdsBySlug = unstable_cache(
  async (slug: string, lang: string): Promise<string[]> =>
    findCategoryIdsBySlug(slug, lang),
  ['category-ids-by-slug-v2'],
  { revalidate: CATEGORY_BY_SLUG_REVALIDATE_SECONDS, tags: ['categories'] },
);
