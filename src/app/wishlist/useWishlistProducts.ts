'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { fetchWishlistProductsSafe } from '../../lib/wishlist/wishlist-fetcher';
import { isWishlistSnapshotFresh } from '../../lib/wishlist/wishlist-snapshot-cache';
import {
  getWishlistStoreServerSnapshot,
  readWishlistStoreSnapshot,
} from '../../lib/wishlist/wishlist-store';
import { subscribeWishlistStore } from '../../lib/wishlist/wishlist-store-events';

/**
 * Subscribes to local wishlist store and refreshes stale snapshots in the background.
 */
export function useWishlistProducts(): {
  ids: string[];
  products: ReturnType<typeof readWishlistStoreSnapshot>['products'];
  pendingCount: number;
  isEmpty: boolean;
  isRefreshing: boolean;
} {
  const store = useSyncExternalStore(
    subscribeWishlistStore,
    readWishlistStoreSnapshot,
    getWishlistStoreServerSnapshot,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const idsKey = store.ids.join(',');

  useEffect(() => {
    if (store.ids.length === 0) {
      return;
    }

    const isComplete = store.pendingCount === 0;
    const isFresh = isWishlistSnapshotFresh(store.ids);
    if (isComplete && isFresh) {
      return;
    }

    let cancelled = false;
    setIsRefreshing(isComplete);

    void fetchWishlistProductsSafe(store.ids).finally(() => {
      if (!cancelled) {
        setIsRefreshing(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [idsKey, store.pendingCount]);

  return {
    ids: store.ids,
    products: store.products,
    pendingCount: store.pendingCount,
    isEmpty: store.ids.length === 0,
    isRefreshing,
  };
}
