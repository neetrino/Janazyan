import { unstable_cache } from 'next/cache';
import { categoriesNavStripService } from '../services/categories-nav-strip.service';
import type { CategoryTreeNode } from './category-tree';

const NAV_STRIP_REVALIDATE_SECONDS = 300;

export const getCategoryNavStripCached = unstable_cache(
  async (lang: string): Promise<CategoryTreeNode[]> =>
    categoriesNavStripService.getStrip(lang),
  ['storefront-categories-nav-strip-v1'],
  { revalidate: NAV_STRIP_REVALIDATE_SECONDS }
);
