import { fetchCart } from '../../app/cart/cart-fetcher';
import type { Cart } from '../../app/cart/types';
import {
  isCartSnapshotFresh,
  readCartSnapshot,
  resolveCartCacheScope,
} from './cart-snapshot-cache';

const REVALIDATE_DEBOUNCE_MS = 400;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let inflight: Promise<Cart | null> | null = null;

function dispatchCartSynced(cart: Cart | null): void {
  const itemsCount =
    cart?.itemsCount ??
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ??
    0;

  window.dispatchEvent(
    new CustomEvent('cart-updated', {
      detail: { itemsCount, skipRevalidate: true, fromSync: true },
    }),
  );
}

async function runRevalidate(
  isLoggedIn: boolean,
  userId: string | null | undefined,
  t: (key: string) => string,
  force: boolean,
): Promise<Cart | null> {
  const scope = resolveCartCacheScope(isLoggedIn, userId);
  if (scope && !force && isCartSnapshotFresh(scope)) {
    return readCartSnapshot(scope);
  }

  if (inflight) {
    return inflight;
  }

  inflight = fetchCart(isLoggedIn, t, userId)
    .then((cart) => {
      dispatchCartSynced(cart);
      return cart;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/**
 * Debounced background sync — coalesces rapid add-to-cart clicks.
 */
export function scheduleCartRevalidate(
  isLoggedIn: boolean,
  userId: string | null | undefined,
  t: (key: string) => string,
  options?: { force?: boolean },
): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void runRevalidate(isLoggedIn, userId, t, options?.force ?? false);
  }, REVALIDATE_DEBOUNCE_MS);
}

/**
 * Immediate revalidate only when cache is missing or stale.
 */
export function revalidateCartIfStale(
  isLoggedIn: boolean,
  userId: string | null | undefined,
  t: (key: string) => string,
): void {
  const scope = resolveCartCacheScope(isLoggedIn, userId);
  if (scope && isCartSnapshotFresh(scope)) {
    return;
  }
  void runRevalidate(isLoggedIn, userId, t, false);
}

/**
 * Warms snapshot on app load (non-blocking).
 */
export function prefetchCartSnapshot(
  isLoggedIn: boolean,
  userId: string | null | undefined,
  t: (key: string) => string,
): void {
  const scope = resolveCartCacheScope(isLoggedIn, userId);
  if (!scope || readCartSnapshot(scope)) {
    return;
  }
  void runRevalidate(isLoggedIn, userId, t, false);
}
