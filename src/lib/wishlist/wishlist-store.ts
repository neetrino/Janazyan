import { getWishlistIds } from './wishlist-storage';
import { resolveWishlistProductsFromSnapshot } from './wishlist-snapshot-cache';
import type { WishlistProductSnapshot } from './wishlist-types';

export type WishlistStoreSnapshot = {
  ids: string[];
  products: WishlistProductSnapshot[];
  pendingCount: number;
};

let cachedSnapshot: WishlistStoreSnapshot | null = null;
let cachedSnapshotKey = '';

function buildSnapshotKey(ids: string[], products: WishlistProductSnapshot[]): string {
  const productDigest = products
    .map((product) => `${product.id}:${product.price}:${product.title}:${product.image ?? ''}`)
    .join('|');
  return `${ids.join('|')}::${productDigest}`;
}

/**
 * Reads current wishlist ids and cached product snapshots from local storage.
 */
export function readWishlistStoreSnapshot(): WishlistStoreSnapshot {
  const ids = getWishlistIds();
  const products = resolveWishlistProductsFromSnapshot(ids);
  const snapshotKey = buildSnapshotKey(ids, products);

  if (cachedSnapshot && cachedSnapshotKey === snapshotKey) {
    return cachedSnapshot;
  }

  cachedSnapshotKey = snapshotKey;
  cachedSnapshot = {
    ids,
    products,
    pendingCount: Math.max(0, ids.length - products.length),
  };
  return cachedSnapshot;
}

/** Clears memoized store snapshot after writes. */
export function invalidateWishlistStoreSnapshot(): void {
  cachedSnapshot = null;
  cachedSnapshotKey = '';
}

export function getWishlistStoreServerSnapshot(): WishlistStoreSnapshot {
  return { ids: [], products: [], pendingCount: 0 };
}
