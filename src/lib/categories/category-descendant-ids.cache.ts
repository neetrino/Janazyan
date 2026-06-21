import { unstable_cache } from 'next/cache';
import { getAllChildCategoryIds } from '@/lib/services/products-find-query/category-utils';

const CATEGORY_DESCENDANTS_REVALIDATE_SECONDS = 300;

export const getCachedCategoryDescendantIds = unstable_cache(
  async (parentId: string): Promise<string[]> => getAllChildCategoryIds(parentId),
  ['category-descendant-ids-v1'],
  { revalidate: CATEGORY_DESCENDANTS_REVALIDATE_SECONDS, tags: ['categories'] },
);
