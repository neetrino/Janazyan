const ADMIN_LIST_CACHE_TTL_MS = 60_000;

type AdminListCacheEntry = {
  data: unknown;
  storedAt: number;
};

const memoryCache = new Map<string, AdminListCacheEntry>();
const inflightRequests = new Map<string, Promise<unknown>>();

function isFresh(entry: AdminListCacheEntry): boolean {
  return Date.now() - entry.storedAt < ADMIN_LIST_CACHE_TTL_MS;
}

export async function fetchAdminListCached<T>(
  key: string,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = memoryCache.get(key);
  if (cached && isFresh(cached)) {
    return cached.data as T;
  }

  const inflight = inflightRequests.get(key);
  if (inflight) {
    return inflight as Promise<T>;
  }

  const promise = fetcher()
    .then((data) => {
      memoryCache.set(key, { data, storedAt: Date.now() });
      inflightRequests.delete(key);
      return data;
    })
    .catch((error: unknown) => {
      inflightRequests.delete(key);
      throw error;
    });

  inflightRequests.set(key, promise);
  return promise;
}

export function invalidateAdminListCache(key?: string): void {
  if (key) {
    memoryCache.delete(key);
    inflightRequests.delete(key);
    return;
  }

  memoryCache.clear();
  inflightRequests.clear();
}

export function invalidateAdminProductsCache(): void {
  invalidateAdminResourceCache('products');
}

export function invalidateAdminResourceCache(resource: string): void {
  const prefix = `admin:${resource}:`;
  for (const cacheKey of memoryCache.keys()) {
    if (cacheKey.startsWith(prefix)) {
      memoryCache.delete(cacheKey);
    }
  }
  for (const cacheKey of inflightRequests.keys()) {
    if (cacheKey.startsWith(prefix)) {
      inflightRequests.delete(cacheKey);
    }
  }
}

export const ADMIN_LIST_CACHE_KEYS = {
  categories: 'admin:list:categories',
  brands: 'admin:list:brands',
  attributes: 'admin:list:attributes',
  blogPosts: 'admin:list:blog-posts',
  partnerStores: 'admin:list:partner-stores',
  faqCategories: 'admin:faq:categories',
  faqItems: 'admin:faq:items',
  settings: 'admin:settings:main',
  stats: 'admin:stats:v1',
  coupons: 'admin:list:coupons',
  delivery: 'admin:settings:delivery',
} as const;

export function buildAdminProductsCacheKey(params: Record<string, string>): string {
  return buildAdminPaginatedListCacheKey('products', params);
}

/** Stable cache key for paginated admin list endpoints (users, messages, orders, etc.). */
export function buildAdminPaginatedListCacheKey(
  resource: string,
  params: Record<string, string>,
): string {
  const query = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return `admin:${resource}:${query}`;
}
