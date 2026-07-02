'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredLanguage, type LanguageCode } from '../../lib/language';
import { shouldRunStorefrontPrefetch } from '../../lib/nav/should-run-storefront-prefetch';
import { prefetchDefaultStorefrontCatalog } from '../../lib/products/prefetch-storefront-catalog';

function warmStorefrontCatalog(router: ReturnType<typeof useRouter>): void {
  router.prefetch('/products');

  const lang = (getStoredLanguage() ?? 'hy') as LanguageCode;
  void prefetchDefaultStorefrontCatalog(lang);
}

/**
 * Prefetches /products RSC shell and hydrates client catalog cache after first paint.
 * Skipped on admin routes to avoid redundant API traffic during panel navigation.
 */
export function useProductsCatalogPrefetch(): void {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldRunStorefrontPrefetch(pathname)) {
      return;
    }

    warmStorefrontCatalog(router);
  }, [pathname, router]);

  useEffect(() => {
    const handleLanguageUpdate = (): void => {
      if (!shouldRunStorefrontPrefetch(window.location.pathname)) {
        return;
      }

      const lang = (getStoredLanguage() ?? 'hy') as LanguageCode;
      void prefetchDefaultStorefrontCatalog(lang, { force: true });
    };

    window.addEventListener('language-updated', handleLanguageUpdate);
    return () => {
      window.removeEventListener('language-updated', handleLanguageUpdate);
    };
  }, []);
}
