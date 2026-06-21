import type { ProductsCatalogCacheResponse } from '@/lib/cache/products-catalog-cache.types';
import { buildProductsCatalogCacheKey } from '@/lib/cache/products-catalog-cache.types';
import type { ParsedCatalogParams } from './catalog-search-params';

const CLIENT_CACHE_STORAGE_PREFIX = 'janazyan:catalog:';
const CLIENT_CACHE_TTL_MS = 5 * 60 * 1000;

type CatalogClientCacheEntry = {
  data: ProductsCatalogCacheResponse;
  storedAt: number;
};

const memoryCache = new Map<string, CatalogClientCacheEntry>();
const listeners = new Set<() => void>();

function notifyCatalogCacheListeners(): void {
  listeners.forEach((listener) => listener());
}

function isFresh(entry: CatalogClientCacheEntry): boolean {
  return Date.now() - entry.storedAt < CLIENT_CACHE_TTL_MS;
}

function readSessionEntry(key: string): CatalogClientCacheEntry | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(`${CLIENT_CACHE_STORAGE_PREFIX}${key}`);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CatalogClientCacheEntry;
    if (!parsed?.data || !isFresh(parsed)) {
      sessionStorage.removeItem(`${CLIENT_CACHE_STORAGE_PREFIX}${key}`);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeSessionEntry(key: string, entry: CatalogClientCacheEntry): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.setItem(`${CLIENT_CACHE_STORAGE_PREFIX}${key}`, JSON.stringify(entry));
  } catch {
    // Quota exceeded — ignore; in-memory cache still works for the session.
  }
}

/** Stable cache key aligned with Redis storefront catalog keys. */
export function buildCatalogClientCacheKey(
  parsed: Pick<ParsedCatalogParams, 'page' | 'perPage' | 'search' | 'category'>,
  lang: string,
): string {
  return buildProductsCatalogCacheKey({
    page: parsed.page,
    limit: parsed.perPage,
    lang,
    search: parsed.search,
    category: parsed.category,
  });
}

export function subscribeCatalogClientCache(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Synchronous read for instant paint (memory → sessionStorage). */
export function readCatalogClientCacheEntry(
  key: string,
): ProductsCatalogCacheResponse | null {
  const memoryEntry = memoryCache.get(key);
  if (memoryEntry && isFresh(memoryEntry)) {
    return memoryEntry.data;
  }

  const sessionEntry = readSessionEntry(key);
  if (!sessionEntry) {
    return null;
  }

  memoryCache.set(key, sessionEntry);
  return sessionEntry.data;
}

export function writeCatalogClientCache(
  key: string,
  data: ProductsCatalogCacheResponse,
): void {
  const entry: CatalogClientCacheEntry = { data, storedAt: Date.now() };
  memoryCache.set(key, entry);
  writeSessionEntry(key, entry);
  notifyCatalogCacheListeners();
}
