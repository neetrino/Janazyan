import { apiClient } from '../../lib/api-client';
import { logger } from '../../lib/utils/logger';
import { getStoredLanguage } from '../../lib/language';
import { isCartEmpty } from '../../lib/cart/cart-empty';
import {
  getCartMutationEpoch,
  isCartMutationEpochCurrent,
} from '../../lib/cart/cart-mutation';
import {
  bumpLoggedInCartFetchGenerationForForce,
  claimLoggedInCartInflight,
  getLoggedInCartFetchGeneration,
  getLoggedInCartInflight,
  releaseLoggedInCartInflight,
} from '../../lib/cart/cart-inflight';
import {
  readCartSnapshot,
  readCartSnapshotCachedAt,
  resolveCartCacheScope,
  writeCartSnapshot,
} from '../../lib/cart/cart-snapshot-cache';
import { createSyntheticCartItemId } from '../../lib/cart/cart-item-id';
import type { Cart, CartItem } from './types';
import { CART_KEY } from './constants';

/**
 * Product data from API
 */
interface ProductData {
  id: string;
  slug: string;
  translations?: Array<{ title: string; locale: string }>;
  media?: Array<{ url?: string; src?: string } | string>;
  variants?: Array<{
    _id: string;
    id: string;
    sku: string;
    price: number;
    originalPrice?: number | null;
    stock?: number;
  }>;
}

/**
 * Guest cart item
 */
interface GuestCartItem {
  productId: string;
  productSlug?: string;
  variantId: string;
  quantity: number;
  price?: number;
}

interface GuestCartBatchResponse {
  cart: Cart | null;
  normalizedItems: GuestCartItem[];
}

/**
 * Fetch guest cart items with product details
 */
async function fetchGuestCartItems(
  guestCart: GuestCartItem[],
  t: (key: string) => string
): Promise<Array<{ item: CartItem | null; shouldRemove: boolean }>> {
  return Promise.all(
    guestCart.map(async (item, index) => {
      try {
        // If productSlug is missing, product cannot be fetched (API expects slug)
        if (!item.productSlug) {
          logger.warn(`Product ${item.productId} does not have slug, removing from cart`);
          return { item: null, shouldRemove: true };
        }

        // Get product data by slug
        const productData = await apiClient.get<ProductData>(`/api/v1/products/${item.productSlug}`);

        const variant = productData.variants?.find(v => 
          (v._id?.toString() || v.id) === item.variantId
        ) || productData.variants?.[0];

        if (!variant) {
          logger.warn(`Variant ${item.variantId} not found for product ${item.productId}`);
          return { item: null, shouldRemove: true };
        }

        const translation = productData.translations?.[0];
        const imageUrl = productData.media?.[0] 
          ? (typeof productData.media[0] === 'string' 
              ? productData.media[0] 
              : productData.media[0].url || productData.media[0].src)
          : null;

        return {
          item: {
            id: createSyntheticCartItemId(item.productId, item.variantId, index),
            variant: {
              id: variant._id?.toString() || variant.id,
              sku: variant.sku || '',
              stock: variant.stock !== undefined ? variant.stock : undefined,
              product: {
                id: productData.id,
                title: translation?.title || t('common.messages.product'),
                slug: productData.slug,
                image: imageUrl,
              },
            },
            quantity: item.quantity,
            price: variant.price,
            originalPrice: variant.originalPrice || null,
            total: variant.price * item.quantity,
          },
          shouldRemove: false,
        };
      } catch (error: unknown) {
        // If product not found (404), remove it from localStorage
        const errorObj = error as { status?: number; statusCode?: number };
        if (errorObj?.status === 404 || errorObj?.statusCode === 404) {
          logger.warn(`Product ${item.productId} not found (404), removing from cart`);
          return { item: null, shouldRemove: true };
        }
        logger.error(`Error fetching product ${item.productId}`, { error });
        return { item: null, shouldRemove: false };
      }
    })
  );
}

/**
 * Build cart from valid items
 */
function buildCartFromItems(validItems: CartItem[]): Cart {
  const subtotal = validItems.reduce((sum, item) => sum + item.total, 0);
  const itemsCount = validItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: 'guest-cart',
    items: validItems,
    totals: {
      subtotal,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: subtotal,
      currency: 'USD',
    },
    itemsCount,
  };
}

/**
 * Fetch guest cart
 */
export async function fetchGuestCart(
  t: (key: string) => string
): Promise<Cart | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(CART_KEY);
    const guestCart: GuestCartItem[] = stored ? JSON.parse(stored) : [];
    
    if (guestCart.length === 0) {
      return null;
    }

    try {
      const batch = await apiClient.post<GuestCartBatchResponse>('/api/v1/cart/guest', {
        items: guestCart,
        lang: getStoredLanguage(),
      });

      const normalized = Array.isArray(batch.normalizedItems) ? batch.normalizedItems : [];
      const needsSync =
        normalized.length !== guestCart.length ||
        JSON.stringify(normalized) !== JSON.stringify(guestCart);

      if (needsSync) {
        localStorage.setItem(CART_KEY, JSON.stringify(normalized));
      }

      return batch.cart;
    } catch (batchError: unknown) {
      logger.warn('[CART] Guest batch fetch failed, using fallback', { error: batchError });
    }

    // Get product details from API
    const itemsWithDetails = await fetchGuestCartItems(guestCart, t);

    // Remove items that were not found
    const itemsToRemove = itemsWithDetails
      .map((result, index) => result.shouldRemove ? index : -1)
      .filter(index => index !== -1);
    
    if (itemsToRemove.length > 0) {
      const updatedCart = guestCart.filter((_, index) => !itemsToRemove.includes(index));
      localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    }

    const validItems = itemsWithDetails
      .map(result => result.item)
      .filter((item): item is CartItem => item !== null);
    
    if (validItems.length === 0) {
      return null;
    }

    return buildCartFromItems(validItems);
  } catch (error: unknown) {
    logger.error('Error loading guest cart', { error });
    return null;
  }
}

/**
 * Fetch logged-in user cart
 */
export async function fetchLoggedInCart(forceFresh = false): Promise<Cart | null> {
  const generation = forceFresh
    ? bumpLoggedInCartFetchGenerationForForce()
    : getLoggedInCartFetchGeneration();

  const existingInflight = getLoggedInCartInflight();
  if (existingInflight && !forceFresh) {
    return existingInflight as Promise<Cart | null>;
  }

  const promise = (async () => {
    try {
      const response = await apiClient.get<{ cart: Cart }>('/api/v1/cart');
      if (generation !== getLoggedInCartFetchGeneration()) {
        return null;
      }
      return response.cart;
    } catch (error: unknown) {
      logger.error('Error fetching cart', { error });
      return null;
    }
  })();

  claimLoggedInCartInflight(generation, promise);
  void promise.finally(() => {
    releaseLoggedInCartInflight(generation);
  });

  return promise;
}

function shouldApplyNetworkCart(
  scope: ReturnType<typeof resolveCartCacheScope>,
  fetchStartedAt: number,
  mutationEpochAtStart: number,
): boolean {
  if (!scope) {
    return false;
  }
  if (!isCartMutationEpochCurrent(mutationEpochAtStart)) {
    return false;
  }
  const snapshotCachedAt = readCartSnapshotCachedAt(scope);
  return snapshotCachedAt === null || snapshotCachedAt <= fetchStartedAt;
}

function persistFetchedCart(
  isLoggedIn: boolean,
  userId: string | null | undefined,
  cart: Cart | null,
  fetchStartedAt: number,
  mutationEpochAtStart: number,
  confirmMutation: boolean,
): void {
  const scope = resolveCartCacheScope(isLoggedIn, userId);
  if (!scope) {
    return;
  }

  if (!shouldApplyNetworkCart(scope, fetchStartedAt, mutationEpochAtStart)) {
    return;
  }

  writeCartSnapshot(scope, cart, { source: 'network' });
}

export interface FetchCartOptions {
  forceFresh?: boolean;
  confirmMutation?: boolean;
  mutationEpochAtStart?: number;
}

/**
 * Fetch cart (guest or logged-in) and refresh the scope-local snapshot cache.
 */
export async function fetchCart(
  isLoggedIn: boolean,
  t: (key: string) => string,
  userId?: string | null,
  options?: FetchCartOptions,
): Promise<Cart | null> {
  const scope = resolveCartCacheScope(isLoggedIn, userId ?? null);
  const fetchStartedAt = Date.now();
  const mutationEpochAtStart = options?.mutationEpochAtStart ?? getCartMutationEpoch();
  const confirmMutation = options?.confirmMutation ?? false;

  const cart = !isLoggedIn
    ? await fetchGuestCart(t)
    : await fetchLoggedInCart(options?.forceFresh ?? false);

  if (confirmMutation) {
    return cart;
  }

  if (!shouldApplyNetworkCart(scope, fetchStartedAt, mutationEpochAtStart)) {
    return scope ? readCartSnapshot(scope) : cart;
  }

  persistFetchedCart(
    isLoggedIn,
    userId ?? null,
    cart,
    fetchStartedAt,
    mutationEpochAtStart,
    confirmMutation,
  );

  if (cart === null || isCartEmpty(cart)) {
    return scope ? readCartSnapshot(scope) : cart;
  }

  return cart;
}


