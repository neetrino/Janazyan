import { useEffect, useState } from 'react';
import type { LanguageCode } from '@/lib/language';
import { fetchProductVisualClient } from '@/lib/products/fetch-product-visual-client';
import { logger } from '@/lib/utils/logger';

/**
 * Loads gallery URLs after RSC stripped embedded data-URI blobs from the payload.
 */
export function useProductGalleryHydration(
  slug: string,
  language: LanguageCode,
  enabled: boolean,
): string[] | null {
  const [galleryUrls, setGalleryUrls] = useState<string[] | null>(null);

  useEffect(() => {
    if (!enabled || !slug) {
      setGalleryUrls(null);
      return;
    }

    let cancelled = false;

    void fetchProductVisualClient(slug, language)
      .then((payload) => {
        if (cancelled) {
          return;
        }
        setGalleryUrls(payload?.galleryImages ?? []);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }
        logger.warn('Product gallery hydration failed', {
          slug,
          error: error instanceof Error ? error.message : String(error),
        });
        setGalleryUrls([]);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, slug, language]);

  return galleryUrls;
}
