'use client';

import { useCallback, useEffect, useState } from 'react';
import { getWishlistCount } from '../../lib/storageCounts';
import { formatCartBadgeCount } from './useCartItemCount';

/**
 * Live wishlist item count for header badges; listens to `wishlist-updated`.
 */
export function useWishlistItemCount(): number {
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    setCount(getWishlistCount());
  }, []);

  useEffect(() => {
    refresh();
    const handleWishlistUpdated = () => {
      refresh();
    };
    window.addEventListener('wishlist-updated', handleWishlistUpdated);
    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdated);
    };
  }, [refresh]);

  return count;
}

/** Badge label capped for small UI slots (same rules as cart). */
export function formatWishlistBadgeCount(count: number): string {
  return formatCartBadgeCount(count);
}
