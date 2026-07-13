import { readJsonCache, writeJsonCache, deleteJsonCacheKey } from '@/lib/cache/storefront-cache-io';
import { dedupeInFlight } from '@/lib/cache/in-flight-dedup';
import { logger } from '@/lib/utils/logger';

export const ADMIN_LIST_SERVER_CACHE_TTL_SECONDS = 60;

export const ADMIN_LIST_SERVER_CACHE_KEYS = {
  attributes: 'admin:list:attributes:v1',
  blogPosts: 'admin:list:blog-posts:v1',
  partnerStores: 'admin:list:partner-stores:v2',
  brands: 'admin:list:brands:v1',
  categories: 'admin:list:categories:v1',
} as const;

export async function loadAdminListServerCached<T>(
  cacheKey: string,
  loader: () => Promise<T>,
): Promise<T> {
  const cached = await readJsonCache<T>(cacheKey);
  if (cached) {
    logger.debug('[ADMIN LIST CACHE] hit', { cacheKey });
    return cached;
  }

  logger.debug('[ADMIN LIST CACHE] miss', { cacheKey });

  return dedupeInFlight(`admin-list-server:${cacheKey}`, async () => {
    const cachedAfterLock = await readJsonCache<T>(cacheKey);
    if (cachedAfterLock) {
      return cachedAfterLock;
    }

    const data = await loader();
    await writeJsonCache(cacheKey, ADMIN_LIST_SERVER_CACHE_TTL_SECONDS, data);
    return data;
  });
}

export async function invalidateAdminListServerCache(cacheKey: string): Promise<void> {
  await deleteJsonCacheKey(cacheKey);
}
