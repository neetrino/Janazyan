'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { type LanguageCode } from '../../lib/language';
import { fetchProductRelatedClient } from '../../lib/products/fetch-product-related-client';
import { logger } from '@/lib/utils/logger';
import type { RelatedCardPayload } from '@/lib/services/products-slug/product-related-transform';

interface UseRelatedProductsProps {
  categorySlug?: string;
  currentProductId: string;
  language: LanguageCode;
  productSlug?: string;
  /** When defined (including `[]`), SSR already resolved related — skip client fetch for matching language. */
  initialRelated?: RelatedCardPayload[];
  initialLanguage?: LanguageCode;
}

function filterRelatedProducts(
  items: RelatedCardPayload[],
  currentProductId: string,
): RelatedCardPayload[] {
  return items.filter((product) => product.id !== currentProductId).slice(0, 10);
}

/**
 * Hook for fetching related products.
 * PDP path uses SSR seed + in-flight dedup so Strict Mode / remounts share one request.
 */
export function useRelatedProducts({
  categorySlug,
  currentProductId,
  language,
  productSlug,
  initialRelated,
  initialLanguage,
}: UseRelatedProductsProps) {
  const [products, setProducts] = useState<RelatedCardPayload[]>(() =>
    initialRelated !== undefined
      ? filterRelatedProducts(initialRelated, currentProductId)
      : [],
  );
  const [loading, setLoading] = useState(initialRelated === undefined);

  useEffect(() => {
    if (
      initialRelated !== undefined &&
      initialLanguage &&
      language === initialLanguage
    ) {
      setProducts(filterRelatedProducts(initialRelated, currentProductId));
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);

        if (productSlug) {
          const response = await fetchProductRelatedClient(productSlug, language);
          if (cancelled) {
            return;
          }
          setProducts(filterRelatedProducts(response.data, currentProductId));
          return;
        }

        const params: Record<string, string> = {
          limit: '30',
          lang: language,
        };

        if (categorySlug) {
          params.category = categorySlug;
          logger.debug('[RelatedProducts] Fetching related products for category:', categorySlug);
        } else {
          logger.debug('[RelatedProducts] No categorySlug, fetching all products');
        }

        const response = await apiClient.get<{
          data: RelatedCardPayload[];
          meta: { total: number };
        }>('/api/v1/products', { params });

        if (cancelled) {
          return;
        }

        logger.debug('[RelatedProducts] Received products:', response.data.length);
        setProducts(filterRelatedProducts(response.data, currentProductId));
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }
        logger.warn('[RelatedProducts] Error fetching related products', {
          error: error instanceof Error ? error.message : String(error),
        });
        setProducts([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchRelatedProducts();

    return () => {
      cancelled = true;
    };
  }, [
    categorySlug,
    currentProductId,
    initialLanguage,
    initialRelated,
    language,
    productSlug,
  ]);

  return { products, loading };
}
