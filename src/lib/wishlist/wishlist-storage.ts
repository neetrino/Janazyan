import { WISHLIST_KEY } from '../storageCounts';
import { removeWishlistSnapshot } from './wishlist-snapshot-cache';
import { WISHLIST_STORE_EVENT } from './wishlist-store-events';

function emitWishlistStoreChange(notifyWishlistUpdated: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(WISHLIST_STORE_EVENT));
  if (notifyWishlistUpdated) {
    window.dispatchEvent(new Event('wishlist-updated'));
  }
}

/**
 * Reads wishlist product ids from localStorage in display order.
 */
export function getWishlistIds(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (value): value is string =>
        typeof value === 'string' &&
        value.trim().length > 0 &&
        value !== 'undefined' &&
        value !== 'null',
    );
  } catch {
    return [];
  }
}

/**
 * Persists wishlist ids and optionally notifies listeners.
 */
export function setWishlistIds(ids: string[], options?: { notify?: boolean }): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  emitWishlistStoreChange(options?.notify !== false);
}

/**
 * Removes one product from wishlist ids and snapshot cache.
 */
export function removeWishlistItem(productId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const ids = getWishlistIds().filter((id) => id !== productId);
  removeWishlistSnapshot(productId);
  setWishlistIds(ids);
}
