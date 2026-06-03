/** Dispatched to open the storefront cart drawer from the right. */
export const CART_DRAWER_OPEN_EVENT = 'cart-drawer-open';

/** Dispatched to close the storefront cart drawer. */
export const CART_DRAWER_CLOSE_EVENT = 'cart-drawer-close';

/** Opens the cart drawer (client-only). */
export function openCartDrawer(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new CustomEvent(CART_DRAWER_OPEN_EVENT));
}

/** Closes the cart drawer (client-only). */
export function closeCartDrawer(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new CustomEvent(CART_DRAWER_CLOSE_EVENT));
}
