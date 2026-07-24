import type { Cart } from '../../app/cart/types';

/**
 * Total units in cart — prefers summing line quantities (drawer truth)
 * over a possibly stale `itemsCount` field.
 */
export function resolveCartItemsCount(cart: Cart | null | undefined): number {
  if (!cart) {
    return 0;
  }

  if (cart.items.length > 0) {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  if (typeof cart.itemsCount === 'number' && cart.itemsCount >= 0) {
    return cart.itemsCount;
  }

  return 0;
}
