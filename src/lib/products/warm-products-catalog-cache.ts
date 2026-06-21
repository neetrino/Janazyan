import type { LanguageCode } from '@/lib/language';
import { fetchProductsCatalog, PRODUCTS_CATALOG_REVALIDATE_SECONDS } from './products-catalog-cache';
import { DEFAULT_CATALOG_PAGE_SIZE } from './catalog-page.constants';

/**
 * Preloads the default storefront catalog into Next.js + Redis caches.
 * Safe to call from `after()` or client warm endpoints — idempotent.
 */
export async function warmDefaultProductsCatalogCache(
  lang: LanguageCode,
): Promise<void> {
  await fetchProductsCatalog(1, DEFAULT_CATALOG_PAGE_SIZE, lang);
}

export { PRODUCTS_CATALOG_REVALIDATE_SECONDS };
