import { CART_KEY } from '../../app/cart/constants';
import { dispatchCartUpdated } from './cart-events';
import { resolveCartCacheScope, writeCartSnapshot } from './cart-snapshot-cache';

const ORDER_SUCCESS_STORAGE_KEY = 'shop_order_success_clear_cart';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function markOrderCartClearOnSuccess(orderNumber: string): void {
  if (!isBrowser()) {
    return;
  }
  sessionStorage.setItem(ORDER_SUCCESS_STORAGE_KEY, orderNumber);
}

export function shouldClearCartOnOrderPage(
  orderNumber: string,
  paymentStatus: string | null,
): boolean {
  if (!isBrowser()) {
    return false;
  }

  const markedOrderNumber = sessionStorage.getItem(ORDER_SUCCESS_STORAGE_KEY);
  if (markedOrderNumber === orderNumber) {
    sessionStorage.removeItem(ORDER_SUCCESS_STORAGE_KEY);
    return true;
  }

  return paymentStatus === 'paid';
}

export function clearCartAfterOrderSuccess(
  isLoggedIn: boolean,
  userId: string | null | undefined,
): void {
  if (!isBrowser()) {
    return;
  }

  if (!isLoggedIn) {
    localStorage.removeItem(CART_KEY);
  }

  const scope = resolveCartCacheScope(isLoggedIn, userId);
  if (!scope) {
    return;
  }

  writeCartSnapshot(scope, null);
  dispatchCartUpdated({ itemsCount: 0, fromMutation: true });
}
