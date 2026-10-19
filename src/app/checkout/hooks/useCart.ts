import { useState, useEffect, useCallback } from 'react';
import { fetchCart } from '../../../app/cart/cart-fetcher';
import type { Cart } from '../../../app/cart/types';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useTranslation } from '../../../lib/i18n-client';
import {
  readCartSnapshot,
  resolveCartCacheScope,
} from '../../../lib/cart/cart-snapshot-cache';
import { parseCartUpdatedDetail } from '../../../lib/cart/cart-events';

export function useCart(isLoggedIn: boolean) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const userId = user?.id;

  // Same first render on server and client. The snapshot lives in localStorage.
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCartData = useCallback(
    async (options?: { background?: boolean; forceFresh?: boolean }) => {
      const scope = resolveCartCacheScope(isLoggedIn, userId);
      if (!scope) {
        return;
      }

      if (!options?.background && readCartSnapshot(scope) === null) {
        setLoading(true);
      }

      try {
        const freshCart = await fetchCart(isLoggedIn, t, userId, {
          forceFresh: options?.forceFresh ?? false,
        });
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

    // Checkout must confirm server cart — stale optimistic snapshots block orders.
    void fetchCartData({ background: cached !== null, forceFresh: true });
  }, [fetchCartData, isLoggedIn, userId]);

  useEffect(() => {
    const handleCartUpdate = (event: Event) => {
      const scope = resolveCartCacheScope(isLoggedIn, userId);
      const snapshot = scope ? readCartSnapshot(scope) : null;

      if (snapshot) {
        setCart(snapshot);
        return;
      }

      if (parseCartUpdatedDetail(event)?.fromMutation) {
        setCart(null);
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [isLoggedIn, userId]);

  return { cart, loading, error, setError, setCart, fetchCart: fetchCartData };
}
