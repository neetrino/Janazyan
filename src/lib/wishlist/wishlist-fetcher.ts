import { apiClient } from '../api-client';
import { getStoredLanguage } from '../language';
import { logger } from '../utils/logger';
import { setWishlistIds } from './wishlist-storage';
import type { WishlistProductSnapshot } from './wishlist-types';
import {
  resolveWishlistProductsFromSnapshot,
  writeWishlistSnapshots,
} from './wishlist-snapshot-cache';

type ProductsApiResponse = {
  data: WishlistProductSnapshot[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

/**
 * Loads wishlist products from the API in wishlist order.
 */
export async function fetchWishlistProducts(
  idsToLoad: string[],
): Promise<WishlistProductSnapshot[]> {
  if (idsToLoad.length === 0) {
    return [];
  }

  const languagePreference = getStoredLanguage();
  const response = await apiClient.get<ProductsApiResponse>('/api/v1/products', {
    params: {
      ids: idsToLoad.join(','),
      limit: String(idsToLoad.length),
      lang: languagePreference,
    },
  });

  const productById = new Map(response.data.map((product) => [product.id, product]));
  const wishlistProducts = idsToLoad
    .map((id) => productById.get(id))
    .filter((product): product is WishlistProductSnapshot => product !== undefined);

  writeWishlistSnapshots(wishlistProducts);

  const normalizedIds = wishlistProducts.map((product) => product.id);
  if (normalizedIds.length !== idsToLoad.length) {
    setWishlistIds(normalizedIds, { notify: false });
  }

  return wishlistProducts;
}

/**
 * Fetches wishlist products and logs failures without throwing.
 */
export async function fetchWishlistProductsSafe(
  idsToLoad: string[],
): Promise<WishlistProductSnapshot[]> {
  try {
    return await fetchWishlistProducts(idsToLoad);
  } catch (error) {
    logger.error('[Wishlist] Error fetching wishlist products', { error });
    return resolveFallbackProducts(idsToLoad);
  }
}

function resolveFallbackProducts(idsToLoad: string[]): WishlistProductSnapshot[] {
  return resolveWishlistProductsFromSnapshot(idsToLoad);
}
