/** Dispatched when wishlist ids or cached product snapshots change. */
export const WISHLIST_STORE_EVENT = 'wishlist-store-updated';

/**
 * Subscribes to wishlist id and snapshot updates.
 */
export function subscribeWishlistStore(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleChange = () => onStoreChange();
  window.addEventListener('wishlist-updated', handleChange);
  window.addEventListener(WISHLIST_STORE_EVENT, handleChange);

  return () => {
    window.removeEventListener('wishlist-updated', handleChange);
    window.removeEventListener(WISHLIST_STORE_EVENT, handleChange);
  };
}
