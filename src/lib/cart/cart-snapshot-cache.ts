import type { Cart } from '../../app/cart/types';
import { createEmptyCart, isCartEmpty } from './cart-empty';
import { markCartMutation } from './cart-mutation';

/** Isolates cached cart UI per guest session or authenticated user. */
export type CartCacheScope = 'guest' | `user:${string}`;

const SNAPSHOT_VERSION = 1;
const STORAGE_KEY_PREFIX = 'shop_cart_snapshot_v1_';

/** How long a snapshot is trusted without a network refresh. */
export const CART_SNAPSHOT_MAX_AGE_MS = 5 * 60 * 1000;

interface CartSnapshotPayload {
  version: typeof SNAPSHOT_VERSION;
  scope: CartCacheScope;
  cart: Cart;
  cachedAt: number;
}

let memorySnapshot: { scope: CartCacheScope; cart: Cart } | null = null;

export type CartSnapshotSource = 'client' | 'network';

function storageKeyForScope(scope: CartCacheScope): string {
  return `${STORAGE_KEY_PREFIX}${scope}`;
}

/**
 * Resolves which local snapshot bucket applies for the current auth state.
 * Returns null for logged-in users before `user.id` is known (never read another scope).
 */
export function resolveCartCacheScope(
  isLoggedIn: boolean,
  userId: string | null | undefined,
): CartCacheScope | null {
  if (isLoggedIn) {
    if (!userId || userId.trim() === '') {
      return null;
    }
    return `user:${userId}`;
  }
  return 'guest';
}

function isValidCart(cart: unknown): cart is Cart {
  if (!cart || typeof cart !== 'object') {
    return false;
  }
  const value = cart as Cart;
  return (
    typeof value.id === 'string' &&
    Array.isArray(value.items) &&
    typeof value.itemsCount === 'number' &&
    value.totals !== null &&
    typeof value.totals === 'object'
  );
}

function normalizeSnapshotCart(scope: CartCacheScope, cart: Cart | null): Cart {
  if (cart && !isCartEmpty(cart)) {
    return cart;
  }
  return createEmptyCart(scope, cart?.id);
}

/** Unix ms when the snapshot was written, or null if missing. */
export function readCartSnapshotCachedAt(scope: CartCacheScope): number | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = localStorage.getItem(storageKeyForScope(scope));
    if (!raw) {
      return null;
    }
    const payload = JSON.parse(raw) as CartSnapshotPayload;
    if (payload?.version !== SNAPSHOT_VERSION || payload.scope !== scope) {
      return null;
    }
    return typeof payload.cachedAt === 'number' ? payload.cachedAt : null;
  } catch {
    return null;
  }
}

/** True when snapshot exists and is younger than `maxAgeMs`. */
export function isCartSnapshotFresh(
  scope: CartCacheScope,
  maxAgeMs: number = CART_SNAPSHOT_MAX_AGE_MS,
): boolean {
  const cachedAt = readCartSnapshotCachedAt(scope);
  if (cachedAt === null) {
    return false;
  }
  return Date.now() - cachedAt < maxAgeMs;
}

/**
 * Reads a cached full cart for the given scope only (guest vs specific user).
 * Returns null only when no snapshot exists — empty carts are valid tombstones.
 */
export function readCartSnapshot(scope: CartCacheScope): Cart | null {
  if (memorySnapshot?.scope === scope) {
    return memorySnapshot.cart;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = localStorage.getItem(storageKeyForScope(scope));
    if (!raw) {
      return null;
    }

    const payload = JSON.parse(raw) as CartSnapshotPayload;
    if (
      payload?.version !== SNAPSHOT_VERSION ||
      payload.scope !== scope ||
      !isValidCart(payload.cart)
    ) {
      localStorage.removeItem(storageKeyForScope(scope));
      return null;
    }

    memorySnapshot = { scope, cart: payload.cart };
    return payload.cart;
  } catch {
    return null;
  }
}

/**
 * Persists a full cart snapshot for instant drawer / badge display.
 * Client writes bump the mutation epoch; network writes do not.
 */
export function writeCartSnapshot(
  scope: CartCacheScope,
  cart: Cart | null,
  options?: { source?: CartSnapshotSource },
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const source = options?.source ?? 'client';
  if (source === 'client') {
    markCartMutation();
  }

  const normalized = normalizeSnapshotCart(scope, cart);
  memorySnapshot = { scope, cart: normalized };

  const payload: CartSnapshotPayload = {
    version: SNAPSHOT_VERSION,
    scope,
    cart: normalized,
    cachedAt: Date.now(),
  };

  try {
    localStorage.setItem(storageKeyForScope(scope), JSON.stringify(payload));
  } catch {
    // Quota — in-memory snapshot still helps until next full fetch.
  }
}

/** Removes persisted snapshot for one scope. Prefer empty tombstone via `writeCartSnapshot`. */
export function clearCartSnapshot(scope: CartCacheScope): void {
  if (memorySnapshot?.scope === scope) {
    memorySnapshot = null;
  }
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(storageKeyForScope(scope));
}

/** Clears in-memory snapshot on auth switch (localStorage keys stay per-user). */
export function clearCartSnapshotMemory(): void {
  memorySnapshot = null;
}

/**
 * Replaces optimistic line id with the persisted cart item id after add-to-cart.
 */
export function patchCartLineIdInSnapshot(
  scope: CartCacheScope,
  productId: string,
  variantId: string,
  realItemId: string,
): void {
  const cart = readCartSnapshot(scope);
  if (!cart || isCartEmpty(cart)) {
    return;
  }

  const items = cart.items.map((item) => {
    if (
      item.variant.product.id === productId &&
      item.variant.id === variantId
    ) {
      return { ...item, id: realItemId };
    }
    return item;
  });

  writeCartSnapshot(scope, { ...cart, items });
}

/**
 * Writes snapshot after optimistic cart mutations in the drawer.
 */
export function persistCartSnapshotFromAuth(
  cart: Cart,
  isLoggedIn: boolean,
  userId: string | null | undefined,
): void {
  const scope = resolveCartCacheScope(isLoggedIn, userId);
  if (!scope) {
    return;
  }
  writeCartSnapshot(scope, cart);
}

if (typeof window !== 'undefined') {
  window.addEventListener('auth-updated', () => {
    clearCartSnapshotMemory();
  });
}
