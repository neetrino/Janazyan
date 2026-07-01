'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Cart } from '../../app/cart/types';
import { useAuth } from '../../lib/auth/AuthContext';
import {
  readCartSnapshot,
  resolveCartCacheScope,
} from '../../lib/cart/cart-snapshot-cache';
import { isCartSnapshotFresh } from '../../lib/cart/cart-snapshot-cache';
import { parseCartUpdatedDetail } from '../../lib/cart/cart-events';
import { getGuestCartItemCount } from '../../lib/storageCounts';
import { fetchLoggedInCart } from '../../app/cart/cart-fetcher';

const CART_COUNT_CAP = 99;

function resolveItemsCount(cart: Cart | null | undefined): number {
  if (!cart) {
    return 0;
  }
  if (typeof cart.itemsCount === 'number' && cart.itemsCount >= 0) {
    return cart.itemsCount;
  }
  if (!cart.items?.length) {
    return 0;
  }
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Live cart line-item count for header badges; listens to `cart-updated` and `auth-updated`.
 */
export function useCartItemCount(): number {
  const { isLoggedIn, user } = useAuth();
  const [count, setCount] = useState(0);

  const applyCachedCount = useCallback(() => {
    const scope = resolveCartCacheScope(isLoggedIn, user?.id);
    if (!scope) {
      return;
    }
    const cached = readCartSnapshot(scope);
    if (cached) {
      setCount(resolveItemsCount(cached));
      return;
    }
    setCount(0);
  }, [isLoggedIn, user?.id]);

  const refreshGuest = useCallback(() => {
    const scope = resolveCartCacheScope(false, null);
    const cached = scope ? readCartSnapshot(scope) : null;
    if (cached) {
      setCount(resolveItemsCount(cached));
      return;
    }
    setCount(getGuestCartItemCount());
  }, []);

  const refreshLoggedIn = useCallback(async (skipNetworkIfFresh = false) => {
    const scope = resolveCartCacheScope(true, user?.id);
    if (skipNetworkIfFresh && scope && isCartSnapshotFresh(scope)) {
      applyCachedCount();
      return;
    }

    try {
      const cart = await fetchLoggedInCart();
      const snapshot = scope ? readCartSnapshot(scope) : null;
      if (snapshot) {
        setCount(resolveItemsCount(snapshot));
        return;
      }
      setCount(resolveItemsCount(cart));
    } catch {
      if (!scope || !readCartSnapshot(scope)) {
        setCount(0);
      }
    }
  }, [user?.id, applyCachedCount]);

  const refresh = useCallback(() => {
    applyCachedCount();
    if (isLoggedIn) {
      const scope = resolveCartCacheScope(true, user?.id);
      void refreshLoggedIn(Boolean(scope && isCartSnapshotFresh(scope)));
      return;
    }
    refreshGuest();
  }, [isLoggedIn, applyCachedCount, refreshGuest, refreshLoggedIn, user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handleCartUpdated = (event: Event) => {
      const detail = parseCartUpdatedDetail(event);
      if (typeof detail?.itemsCount === 'number') {
        setCount(detail.itemsCount);
        return;
      }
      if (detail?.fromMutation || detail?.fromSync || detail?.skipRevalidate) {
        if (typeof detail.itemsCount === 'number') {
          setCount(detail.itemsCount);
        } else {
          applyCachedCount();
        }
        return;
      }
      refresh();
    };

    const handleAuthUpdated = () => {
      refresh();
    };

    window.addEventListener('cart-updated', handleCartUpdated);
    window.addEventListener('auth-updated', handleAuthUpdated);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdated);
      window.removeEventListener('auth-updated', handleAuthUpdated);
    };
  }, [refresh]);

  return count;
}

/** Badge label capped for small UI slots. */
export function formatCartBadgeCount(count: number): string {
  if (count > CART_COUNT_CAP) {
    return `${CART_COUNT_CAP}+`;
  }
  return String(count);
}
