'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Cart } from '../../app/cart/types';
import { useAuth } from '../../lib/auth/AuthContext';
import {
  clearCartSnapshot,
  readCartSnapshot,
  resolveCartCacheScope,
  writeCartSnapshot,
} from '../../lib/cart/cart-snapshot-cache';
import { isCartSnapshotFresh } from '../../lib/cart/cart-snapshot-cache';
import { getGuestCartItemCount } from '../../lib/storageCounts';
import { fetchLoggedInCart } from '../../app/cart/cart-fetcher';

const CART_COUNT_CAP = 99;

type CartUpdatedDetail = {
  itemsCount?: number;
  total?: number;
  optimisticAdd?: { quantity: number; price: number };
  skipRevalidate?: boolean;
};

function parseCartUpdatedDetail(event: Event): CartUpdatedDetail | null {
  if (!(event instanceof CustomEvent)) {
    return null;
  }
  const detail = event.detail;
  if (!detail || typeof detail !== 'object') {
    return null;
  }
  return detail as CartUpdatedDetail;
}

function resolveItemsCount(cart: Cart | null | undefined): number {
  if (!cart?.items?.length) {
    return 0;
  }
  if (typeof cart.itemsCount === 'number' && cart.itemsCount >= 0) {
    return cart.itemsCount;
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
    }
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
      setCount(resolveItemsCount(cart));
      if (scope) {
        if (cart) {
          writeCartSnapshot(scope, cart);
        } else {
          clearCartSnapshot(scope);
        }
      }
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
      if (detail?.optimisticAdd && detail.optimisticAdd.quantity > 0) {
        setCount((prev) => prev + detail.optimisticAdd!.quantity);
        return;
      }
      if (detail?.skipRevalidate) {
        applyCachedCount();
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
