'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { getStoredLanguage } from '../../../lib/language';
import type { CategoryNavPreviewProduct } from '@/lib/services/categories-navigation-previews.service';
import { logger } from '@/lib/utils/logger';

interface PreviewsResponse {
  data: Record<string, CategoryNavPreviewProduct | null>;
}

/**
 * Optional preview images per category slot (skipped on /products for faster first paint).
 */
export function useCategoryProducts(skipPreviews = false) {
  const [categoryProducts, setCategoryProducts] = useState<
    Record<string, CategoryNavPreviewProduct | null>
  >({});
  const [loading, setLoading] = useState(!skipPreviews);

  useEffect(() => {
    if (skipPreviews) {
      setLoading(false);
      return;
    }

    const fetchPreviews = async () => {
      try {
        setLoading(true);
        const language = getStoredLanguage();
        const response = await apiClient.get<PreviewsResponse>(
          '/api/v1/categories/navigation-previews',
          { params: { lang: language } }
        );
        setCategoryProducts(response.data ?? {});
      } catch (err) {
        logger.error('[CategoryNavigation] Failed to load navigation previews', err);
        setCategoryProducts({});
      } finally {
        setLoading(false);
      }
    };

    void fetchPreviews();

    const onLang = () => void fetchPreviews();
    window.addEventListener('language-updated', onLang);
    return () => window.removeEventListener('language-updated', onLang);
  }, [skipPreviews]);

  return { categoryProducts, loading };
}
