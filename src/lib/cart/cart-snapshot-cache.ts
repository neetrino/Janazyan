import type { Cart } from '../../app/cart/types';

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
 */
export function writeCartSnapshot(scope: CartCacheScope, cart: Cart | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!cart || cart.items.length === 0) {
    clearCartSnapshot(scope);
    return;
  }

  memorySnapshot = { scope, cart };

  const payload: CartSnapshotPayload = {
    version: SNAPSHOT_VERSION,
    scope,
    cart,
    cachedAt: Date.now(),
  };

  try {
    localStorage.setItem(storageKeyForScope(scope), JSON.stringify(payload));
  } catch {
    // Quota — in-memory snapshot still helps until next full fetch.
  }
}

/** Removes persisted snapshot for one scope (empty cart). */
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
