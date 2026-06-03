'use client';

import { useState, useEffect } from 'react';
import { WISHLIST_KEY } from '../../lib/storageCounts';
import { removeWishlistItem as removeWishlistItemFromStore } from '../../lib/wishlist/wishlist-storage';
import {
  removeWishlistSnapshot,
  upsertWishlistSnapshot,
} from '../../lib/wishlist/wishlist-snapshot-cache';
import type { WishlistProductSnapshot } from '../../lib/wishlist/wishlist-types';

/**
 * Hook for managing wishlist state for a product
 * @param productId - The product ID to check/manage
 * @returns Object with wishlist state and toggle function
 */
export function useWishlist(productId: string) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const checkWishlist = () => {
      if (typeof window === 'undefined') return;
      try {
        const stored = localStorage.getItem(WISHLIST_KEY);
        const wishlist = stored ? JSON.parse(stored) : [];
        setIsInWishlist(wishlist.includes(productId));
      } catch {
        setIsInWishlist(false);
      }
    };

    checkWishlist();

    const handleWishlistUpdate = () => checkWishlist();
    window.addEventListener('wishlist-updated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, [productId]);

  const toggleWishlist = (snapshot?: WishlistProductSnapshot) => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      const wishlist: string[] = stored ? JSON.parse(stored) : [];

      if (isInWishlist) {
        removeWishlistItemFromStore(productId);
        setIsInWishlist(false);
      } else {
        wishlist.push(productId);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        if (snapshot) {
          upsertWishlistSnapshot(snapshot);
        }
        setIsInWishlist(true);
      }

      window.dispatchEvent(new Event('wishlist-updated'));
    } catch {
      // Silently fail — localStorage may be unavailable.
    }
  };

  return { isInWishlist, toggleWishlist };
}
