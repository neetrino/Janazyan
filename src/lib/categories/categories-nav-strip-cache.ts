import { unstable_cache } from 'next/cache';
import { getCategoryNavStripFromRedisOrDb } from '@/lib/cache/categories-nav-strip-redis-cache';
import type { CategoryTreeNode } from './category-tree';

const NAV_STRIP_REVALIDATE_SECONDS = 300;

export const getCategoryNavStripCached = unstable_cache(
  async (lang: string): Promise<CategoryTreeNode[]> =>
    getCategoryNavStripFromRedisOrDb(lang),
  ['storefront-categories-nav-strip-v2'],
  { revalidate: NAV_STRIP_REVALIDATE_SECONDS, tags: ['categories'] },
);
