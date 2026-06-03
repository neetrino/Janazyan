'use client';

import { useCallback, useState } from 'react';
import { apiClient } from '../../lib/api-client';
import { ApiError } from '../../lib/api-client/types';
import { isQuietCartStockValidationError } from '../../lib/api-client/error-handler';
import { CART_KEY } from '../cart/constants';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';
import { applyOptimisticAddToSnapshot } from '../../lib/cart/cart-optimistic';
import { resolveCartCacheScope } from '../../lib/cart/cart-snapshot-cache';
import { scheduleCartRevalidate } from '../../lib/cart/cart-revalidate';
import { openCartDrawer } from '../../lib/cart-drawer-events';
import { playCartFlyAnimation } from '../../lib/cart-fly-animation';
import { logger } from '../../lib/utils/logger';
import type { WishlistProductSnapshot } from '../../lib/wishlist/wishlist-types';

type ProductDetails = {
  variants?: Array<{ id: string; price: number; stock: number }>;
};

/**
 * Shared add-to-cart actions for the wishlist page (one hook for the whole grid).
 */
export function useWishlistCartActions() {
  const { isLoggedIn, user } = useAuth();
  const { t } = useTranslation();
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const addToCart = useCallback(
    async (product: WishlistProductSnapshot) => {
      if (!product.inStock || addingProductId) {
        return;
      }

      playCartFlyAnimation({ imageUrl: product.image });

      const scope = resolveCartCacheScope(isLoggedIn, user?.id);
      setAddingProductId(product.id);

      try {
        let variantId = product.defaultVariantId ?? null;
        let variantPrice = product.price;

        if (!variantId) {
          const productDetails = await apiClient.get<ProductDetails>(
            `/api/v1/products/${encodeURIComponent(product.slug.trim())}`,
          );
          const firstVariant = productDetails.variants?.[0];
          if (!firstVariant) {
            alert(t('common.alerts.noVariantsAvailable'));
            return;
          }
          variantId = firstVariant.id;
          variantPrice = firstVariant.price;
        }

        const optimisticLine = {
          productId: product.id,
          productSlug: product.slug,
          variantId,
          quantityToAdd: 1,
          price: variantPrice,
          productTitle: product.title,
          productImage: product.image,
        };

        if (!isLoggedIn) {
          const stored = localStorage.getItem(CART_KEY);
          const cart: Array<{
            productId: string;
            productSlug: string;
            variantId?: string;
            quantity: number;
            price?: number;
          }> = stored ? JSON.parse(stored) : [];

          const existingItem = cart.find(
            (item) => item.productId === product.id && item.variantId === variantId,
          );

          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            cart.push({
              productId: product.id,
              productSlug: product.slug,
              variantId,
              quantity: 1,
              price: variantPrice,
            });
          }

          localStorage.setItem(CART_KEY, JSON.stringify(cart));
          if (scope) {
            const cartSnapshot = applyOptimisticAddToSnapshot(scope, optimisticLine, 'guest-cart');
            window.dispatchEvent(
              new CustomEvent('cart-updated', {
                detail: { itemsCount: cartSnapshot.itemsCount, skipRevalidate: true },
              }),
            );
          }
          openCartDrawer();
          scheduleCartRevalidate(false, null, t, { force: true });
          return;
        }

        if (scope) {
          applyOptimisticAddToSnapshot(
            scope,
            optimisticLine,
            `user-cart-${user?.id ?? 'pending'}`,
          );
          openCartDrawer();
        }

        await apiClient.post('/api/v1/cart/items', {
          productId: product.id,
          variantId,
          quantity: 1,
        });
        scheduleCartRevalidate(true, user?.id ?? null, t, { force: true });
      } catch (error: unknown) {
        if (error instanceof ApiError && isQuietCartStockValidationError(error.status, error.data)) {
          alert(t('common.alerts.noMoreStockAvailable'));
          scheduleCartRevalidate(true, user?.id ?? null, t, { force: true });
          return;
        }

        logger.error('[Wishlist] Error adding to cart', { error });
        alert(t('common.alerts.failedToAddToCart'));
        scheduleCartRevalidate(true, user?.id ?? null, t, { force: true });
      } finally {
        setAddingProductId(null);
      }
    },
    [addingProductId, isLoggedIn, t, user?.id],
  );

  return { addToCart, addingProductId };
}
