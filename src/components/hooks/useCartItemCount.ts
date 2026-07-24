'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import {
  readCartSnapshot,
  resolveCartCacheScope,
} from '../../lib/cart/cart-snapshot-cache';
import { isCartSnapshotFresh } from '../../lib/cart/cart-snapshot-cache';
import { parseCartUpdatedDetail } from '../../lib/cart/cart-events';
import { resolveCartItemsCount } from '../../lib/cart/resolve-cart-items-count';
import { getGuestCartItemCount } from '../../lib/storageCounts';
import { fetchLoggedInCart } from '../../app/cart/cart-fetcher';

const CART_COUNT_CAP = 99;

/**
 * Live cart line-item count for header badges; listens to `cart-updated` and `auth-updated`.
 * Uses the same snapshot source as CartDrawer so badge and drawer stay in sync.
 */
export function useCartItemCount(): number {
  const { isLoggedIn, user } = useAuth();
  const [count, setCount] = useState(0);

  /** @returns true when a snapshot existed and count was applied from it */
  const applyCachedCount = useCallback((): boolean => {
    const scope = resolveCartCacheScope(isLoggedIn, user?.id);
    if (!scope) {
      return false;
    }
    const cached = readCartSnapshot(scope);
    if (!cached) {
      return false;
    }
    setCount(resolveCartItemsCount(cached));
    return true;
  }, [isLoggedIn, user?.id]);

  const refreshGuest = useCallback(() => {
    if (applyCachedCount()) {
      return;
    }
    setCount(getGuestCartItemCount());
  }, [applyCachedCount]);

  const refreshLoggedIn = useCallback(async (skipNetworkIfFresh = false) => {
    const scope = resolveCartCacheScope(true, user?.id);
    if (skipNetworkIfFresh && scope && isCartSnapshotFresh(scope)) {
      if (!applyCachedCount()) {
        setCount(0);
      }
      return;
    }

    try {
      const cart = await fetchLoggedInCart();
      if (applyCachedCount()) {
        return;
      }
      setCount(resolveCartItemsCount(cart));
    } catch {
      if (!applyCachedCount()) {
        setCount(0);
      }
    }
  }, [user?.id, applyCachedCount]);

  const refresh = useCallback(() => {
    if (isLoggedIn) {
      const scope = resolveCartCacheScope(true, user?.id);
      if (!applyCachedCount()) {
        setCount(0);
      }
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
      // Same source as CartDrawer — never apply event itemsCount over a live snapshot.
      if (applyCachedCount()) {
        return;
      }
      if (typeof detail?.itemsCount === 'number') {
        setCount(detail.itemsCount);
        return;
      }
      if (detail?.fromMutation || detail?.fromSync || detail?.skipRevalidate) {
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
  }, [refresh, applyCachedCount]);

  return count;
}

/** Badge label capped for small UI slots. */
export function formatCartBadgeCount(count: number): string {
  if (count > CART_COUNT_CAP) {
    return `${CART_COUNT_CAP}+`;
  }
  return String(count);
}
