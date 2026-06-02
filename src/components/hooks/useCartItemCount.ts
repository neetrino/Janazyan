'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../../lib/api-client';
import type { Cart } from '../../app/cart/types';
import { useAuth } from '../../lib/auth/AuthContext';
import { getGuestCartItemCount } from '../../lib/storageCounts';

const CART_COUNT_CAP = 99;

type CartUpdatedDetail = {
  itemsCount?: number;
  total?: number;
  optimisticAdd?: { quantity: number; price: number };
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
  const { isLoggedIn } = useAuth();
  const [count, setCount] = useState(0);

  const refreshGuest = useCallback(() => {
    setCount(getGuestCartItemCount());
  }, []);

  const refreshLoggedIn = useCallback(async () => {
    try {
      const response = await apiClient.get<{ cart: Cart | null }>('/api/v1/cart');
      setCount(resolveItemsCount(response.cart));
    } catch {
      setCount(0);
    }
  }, []);

  const refresh = useCallback(() => {
    if (isLoggedIn) {
      void refreshLoggedIn();
      return;
    }
    refreshGuest();
  }, [isLoggedIn, refreshGuest, refreshLoggedIn]);

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
