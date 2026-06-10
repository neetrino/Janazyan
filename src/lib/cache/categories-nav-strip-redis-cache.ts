import { isDatabaseConnectionUrlConfigured } from '@white-shop/db/env';
import type { CategoryTreeNode } from '@/lib/categories/category-tree';
import { categoriesNavStripService } from '@/lib/services/categories-nav-strip.service';
import {
  readJsonCache,
  STOREFRONT_CACHE_KEYS,
  STOREFRONT_CACHE_TTL,
  writeJsonCache,
} from './storefront-cache';

export async function getCategoryNavStripFromRedisOrDb(
  lang: string,
): Promise<CategoryTreeNode[]> {
  const key = STOREFRONT_CACHE_KEYS.categoriesNavStrip(lang);
  const cached = await readJsonCache<CategoryTreeNode[]>(key);
  if (cached) {
    return cached;
  }

  if (!isDatabaseConnectionUrlConfigured()) {
    return [];
  }

  const data = await categoriesNavStripService.getStrip(lang);
  await writeJsonCache(key, STOREFRONT_CACHE_TTL.categoriesNavStrip, data);
  return data;
}
