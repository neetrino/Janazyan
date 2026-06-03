import { useState, useEffect, useCallback } from 'react';
import { fetchCart } from '../../../app/cart/cart-fetcher';
import type { Cart } from '../../../app/cart/types';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useTranslation } from '../../../lib/i18n-client';
import {
  isCartSnapshotFresh,
  readCartSnapshot,
  resolveCartCacheScope,
} from '../../../lib/cart/cart-snapshot-cache';

function readInitialCart(
  isLoggedIn: boolean,
  userId: string | null | undefined,
): Cart | null {
  const scope = resolveCartCacheScope(isLoggedIn, userId);
  return scope ? readCartSnapshot(scope) : null;
}

function shouldShowLoading(
  isLoggedIn: boolean,
  userId: string | null | undefined,
): boolean {
  const scope = resolveCartCacheScope(isLoggedIn, userId);
  if (!scope) {
    return true;
  }
  return readCartSnapshot(scope) === null;
}

export function useCart(isLoggedIn: boolean) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const userId = user?.id;

  const [cart, setCart] = useState<Cart | null>(() => readInitialCart(isLoggedIn, userId));
  const [loading, setLoading] = useState(() => shouldShowLoading(isLoggedIn, userId));
  const [error, setError] = useState<string | null>(null);

  const fetchCartData = useCallback(
    async (options?: { background?: boolean }) => {
      const scope = resolveCartCacheScope(isLoggedIn, userId);
      if (!scope) {
        return;
      }

      if (!options?.background && readCartSnapshot(scope) === null) {
        setLoading(true);
      }

      try {
        const freshCart = await fetchCart(isLoggedIn, t, userId);
        setCart(freshCart);
        setError(null);
      } catch {
        setError(t('checkout.errors.failedToLoadCart'));
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn, t, userId],
  );

  useEffect(() => {
    const scope = resolveCartCacheScope(isLoggedIn, userId);
    if (!scope) {
      return;
    }

    const cached = readCartSnapshot(scope);
    if (cached) {
      setCart(cached);
      setLoading(false);
    }

    if (!cached || !isCartSnapshotFresh(scope)) {
      void fetchCartData({ background: cached !== null });
    }
  }, [fetchCartData, isLoggedIn, userId]);

  return { cart, loading, error, setError, fetchCart: fetchCartData };
}
