import type { WishlistProductSnapshot } from './wishlist-types';
import { WISHLIST_STORE_EVENT } from './wishlist-store-events';

const SNAPSHOT_VERSION = 1;
const STORAGE_KEY = 'shop_wishlist_snapshots_v1';

/** How long cached card data is shown before a background refresh. */
export const WISHLIST_SNAPSHOT_MAX_AGE_MS = 5 * 60 * 1000;

type SnapshotEntry = WishlistProductSnapshot & { cachedAt: number };

interface WishlistSnapshotPayload {
  version: typeof SNAPSHOT_VERSION;
  products: Record<string, SnapshotEntry>;
}

let memoryProducts: Record<string, SnapshotEntry> | null = null;

function readPayload(): WishlistSnapshotPayload | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const payload = JSON.parse(raw) as WishlistSnapshotPayload;
    if (payload?.version !== SNAPSHOT_VERSION || typeof payload.products !== 'object') {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function getProductsMap(): Record<string, SnapshotEntry> {
  if (memoryProducts) {
    return memoryProducts;
  }

  const payload = readPayload();
  memoryProducts = payload?.products ?? {};
  return memoryProducts;
}

function persistProducts(products: Record<string, SnapshotEntry>): void {
  memoryProducts = products;

  if (typeof window === 'undefined') {
    return;
  }

  const payload: WishlistSnapshotPayload = {
    version: SNAPSHOT_VERSION,
    products,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(WISHLIST_STORE_EVENT));
    }
  } catch {
    // Quota — in-memory cache still helps until next full fetch.
  }
}

function isValidSnapshot(value: unknown): value is WishlistProductSnapshot {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const product = value as WishlistProductSnapshot;
  return (
    typeof product.id === 'string' &&
    typeof product.slug === 'string' &&
    typeof product.title === 'string' &&
    typeof product.price === 'number' &&
    typeof product.inStock === 'boolean'
  );
}

/**
 * Resolves cached products for the given ids, preserving wishlist order.
 */
export function resolveWishlistProductsFromSnapshot(
  ids: string[],
): WishlistProductSnapshot[] {
  if (ids.length === 0) {
    return [];
  }

  const products = getProductsMap();
  return ids
    .map((id) => products[id])
    .filter((entry): entry is SnapshotEntry => entry !== undefined)
    .map(({ cachedAt: _cachedAt, ...product }) => product);
}

/** True when every id has a snapshot younger than `maxAgeMs`. */
export function isWishlistSnapshotFresh(
  ids: string[],
  maxAgeMs: number = WISHLIST_SNAPSHOT_MAX_AGE_MS,
): boolean {
  if (ids.length === 0) {
    return true;
  }

  const products = getProductsMap();
  const now = Date.now();

  return ids.every((id) => {
    const entry = products[id];
    return entry !== undefined && now - entry.cachedAt < maxAgeMs;
  });
}

/** Stores or updates one product snapshot. */
export function upsertWishlistSnapshot(product: WishlistProductSnapshot): void {
  if (!isValidSnapshot(product)) {
    return;
  }

  const products = { ...getProductsMap() };
  products[product.id] = { ...product, cachedAt: Date.now() };
  persistProducts(products);
}

/** Removes one product from the snapshot cache. */
export function removeWishlistSnapshot(productId: string): void {
  const products = { ...getProductsMap() };
  if (!(productId in products)) {
    return;
  }

  delete products[productId];
  persistProducts(products);
}

/** Batch-writes snapshots after a successful API refresh. */
export function writeWishlistSnapshots(products: WishlistProductSnapshot[]): void {
  const next = { ...getProductsMap() };
  const cachedAt = Date.now();

  for (const product of products) {
    if (!isValidSnapshot(product)) {
      continue;
    }
    next[product.id] = { ...product, cachedAt };
  }

  persistProducts(next);
}

/** Drops snapshots that are no longer in the wishlist. */
export function pruneWishlistSnapshots(activeIds: string[]): void {
  const activeSet = new Set(activeIds);
  const products = { ...getProductsMap() };
  let changed = false;

  for (const id of Object.keys(products)) {
    if (!activeSet.has(id)) {
      delete products[id];
      changed = true;
    }
  }

  if (changed) {
    persistProducts(products);
  }
}
