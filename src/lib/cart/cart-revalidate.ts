import { fetchCart } from '../../app/cart/cart-fetcher';
import type { Cart } from '../../app/cart/types';
import {
  bustCartInflight,
  bumpRevalidateGenerationForForce,
  claimRevalidateInflight,
  getRevalidateGeneration,
  getRevalidateInflight,
  releaseRevalidateInflight,
} from './cart-inflight';
import { hasPendingCartAdds } from './cart-pending-add';
import { dispatchCartUpdated } from './cart-events';
import {
  getCartMutationEpoch,
  isCartMutationEpochCurrent,
} from './cart-mutation';
import { resolveCartItemsCount } from './resolve-cart-items-count';
import {
  isCartSnapshotFresh,
  readCartSnapshot,
  resolveCartCacheScope,
  writeCartSnapshot,
} from './cart-snapshot-cache';

const REVALIDATE_DEBOUNCE_MS = 400;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/** Bust coalesced revalidate so the next fetch reflects recent cart mutations. */
export function invalidateCartRevalidateInflight(): void {
  bustCartInflight();
}

function dispatchCartSynced(cart: Cart | null): void {
  dispatchCartUpdated({
    itemsCount: resolveCartItemsCount(cart),
    skipRevalidate: true,
    fromSync: true,
  });
}

export interface CartRevalidateOptions {
  force?: boolean;
  /** Apply server response even if a mutation epoch bump occurred mid-flight. */
  confirmMutation?: boolean;
}

function buildCartLineSignature(cart: Cart | null): string {
  if (!cart?.items?.length) {
    return '';
  }

  return cart.items
    .map((item) => {
      const productId = item.variant.product.id;
      const variantId = item.variant.id;
      return `${productId}:${variantId}:${item.quantity}`;
    })
    .sort()
    .join('|');
}

async function runRevalidate(
  isLoggedIn: boolean,
  userId: string | null | undefined,
  t: (key: string) => string,
  options: CartRevalidateOptions,
): Promise<Cart | null> {
  const force = options.force ?? false;
  const confirmMutation = options.confirmMutation ?? false;
  const scope = resolveCartCacheScope(isLoggedIn, userId);

  if (scope && !force && isCartSnapshotFresh(scope)) {
    return readCartSnapshot(scope);
  }

  const existingInflight = getRevalidateInflight();
  if (existingInflight && !force) {
    return existingInflight as Promise<Cart | null>;
  }

  const mutationEpochAtStart = getCartMutationEpoch();
  const generation = force
    ? bumpRevalidateGenerationForForce()
    : getRevalidateGeneration();

  const promise = fetchCart(isLoggedIn, t, userId, {
    forceFresh: force,
    confirmMutation,
    mutationEpochAtStart: mutationEpochAtStart,
  }).then((cart) => {
    const epochStillCurrent = isCartMutationEpochCurrent(mutationEpochAtStart);
    const snapshot = scope ? readCartSnapshot(scope) : null;
    if (generation !== getRevalidateGeneration()) {
      return scope ? readCartSnapshot(scope) : cart;
    }
    if (!confirmMutation && !epochStillCurrent) {
      return scope ? readCartSnapshot(scope) : cart;
    }
    if (confirmMutation && scope && snapshot) {
      const snapshotSignature = buildCartLineSignature(snapshot);
      const serverSignature = buildCartLineSignature(cart);
      if (snapshotSignature !== serverSignature) {
        // Keep optimistic snapshot only while add requests are still in flight.
        if (
          resolveCartItemsCount(snapshot) > resolveCartItemsCount(cart) &&
          hasPendingCartAdds()
        ) {
          dispatchCartSynced(snapshot);
          return snapshot;
        }
      }
      writeCartSnapshot(scope, cart, { source: 'network' });
    }
    dispatchCartSynced(cart);
    return cart;
  });

  claimRevalidateInflight(generation, promise);
  void promise.finally(() => {
    releaseRevalidateInflight(generation);
  });

  return promise;
}

/**
 * Debounced background sync — coalesces rapid add-to-cart clicks.
 */
export function scheduleCartRevalidate(
  isLoggedIn: boolean,
  userId: string | null | undefined,
  t: (key: string) => string,
  options?: CartRevalidateOptions,
): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void runRevalidate(isLoggedIn, userId, t, options ?? {});
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
  void runRevalidate(isLoggedIn, userId, t, {});
}

/**
 * Confirms server state after a successful cart mutation API call.
 */
export function confirmCartMutation(
  isLoggedIn: boolean,
  userId: string | null | undefined,
  t: (key: string) => string,
): void {
  scheduleCartRevalidate(isLoggedIn, userId, t, {
    force: true,
    confirmMutation: true,
  });
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
  void runRevalidate(isLoggedIn, userId, t, {});
}
