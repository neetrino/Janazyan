import type { Cart } from '../../app/cart/types';
import type { CartCacheScope } from './cart-snapshot-cache';

const EMPTY_CART_TOTALS: Cart['totals'] = {
  subtotal: 0,
  discount: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  currency: 'USD',
};

/** Resolves a stable cart id for an empty snapshot tombstone. */
export function resolveEmptyCartId(
  scope: CartCacheScope,
  preferredId?: string,
): string {
  if (preferredId && preferredId.trim()) {
    return preferredId;
  }
  if (scope === 'guest') {
    return 'guest-cart';
  }
  return `user-cart-${scope.slice('user:'.length)}`;
}

/** Empty cart shell — persisted as a tombstone so stale fetches cannot revive lines. */
export function createEmptyCart(scope: CartCacheScope, preferredId?: string): Cart {
  return {
    id: resolveEmptyCartId(scope, preferredId),
    items: [],
    itemsCount: 0,
    totals: { ...EMPTY_CART_TOTALS },
  };
}

/** True when the cart has no line items. */
export function isCartEmpty(cart: Cart | null | undefined): boolean {
  return !cart?.items?.length;
}
