'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../lib/api-client';
import type { Review } from '../utils';
import { logger } from "@/lib/utils/logger";

interface UseReviewsOptions {
  productId?: string;
  productSlug?: string;
  initialReviews?: Review[];
  onReviewsChange?: (reviews: Review[]) => void;
}

/**
 * Hook for fetching and managing reviews.
 * Skips initial fetch when `initialReviews` is provided (SSR path).
 */
export function useReviews({
  productId,
  productSlug,
  initialReviews,
  onReviewsChange,
}: UseReviewsOptions) {
  const hasInitialPayload = initialReviews !== undefined;
  const [reviews, setReviewsState] = useState<Review[]>(initialReviews ?? []);
  const [loading, setLoading] = useState(!hasInitialPayload);

  const setReviews = useCallback(
    (next: Review[] | ((prev: Review[]) => Review[])) => {
      setReviewsState((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        onReviewsChange?.(resolved);
        return resolved;
      });
    },
    [onReviewsChange],
  );

  const loadReviews = useCallback(async () => {
    try {
      const identifier = productSlug || productId;
      if (!identifier) {
        setReviews([]);
        setLoading(false);
        return;
      }

      logger.debug('📝 [PRODUCT REVIEWS] Loading reviews for product:', identifier);
      setLoading(true);
      const data = await apiClient.get<Review[]>(`/api/v1/products/${identifier}/reviews`);
      logger.debug('✅ [PRODUCT REVIEWS] Reviews loaded:', data?.length || 0);
      setReviews(data || []);
    } catch (error: unknown) {
      const err = error as { status?: number };
      if (err.status !== 404) {
        logger.warn('[PRODUCT REVIEWS] Error loading reviews', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId, productSlug, setReviews]);

  useEffect(() => {
    if (hasInitialPayload) {
      return;
    }
    void loadReviews();
  }, [hasInitialPayload, loadReviews]);

  useEffect(() => {
    const handleReviewUpdate = () => {
      void loadReviews();
    };
    window.addEventListener('review-updated', handleReviewUpdate);
    return () => window.removeEventListener('review-updated', handleReviewUpdate);
  }, [loadReviews]);

  return {
    reviews,
    loading,
    setReviews,
    loadReviews,
  };
}
