'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../lib/api-client';
import { ApiError } from '../../lib/api-client/types';
import { isQuietCartStockValidationError } from '../../lib/api-client/error-handler';
import { logger } from '../../lib/utils/logger';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTranslation } from '../../lib/i18n-client';
import { CART_KEY } from '../../app/cart/constants';
import { applyOptimisticAddToSnapshot } from '../../lib/cart/cart-optimistic';
import {
  patchCartLineIdInSnapshot,
  resolveCartCacheScope,
} from '../../lib/cart/cart-snapshot-cache';
import { dispatchCartUpdated } from '../../lib/cart/cart-events';
import {
  confirmCartMutation,
  scheduleCartRevalidate,
} from '../../lib/cart/cart-revalidate';
import { registerPendingCartAdd } from '../../lib/cart/cart-pending-add';
import { openCartDrawer } from '../../lib/cart-drawer-events';
import { playCartFlyAnimation } from '../../lib/cart-fly-animation';

interface ProductDetails {
  id: string;
  slug: string;
  variants?: Array<{
    id: string;
    sku: string;
    price: number;
    stock: number;
    available: boolean;
  }>;
}

export interface AddToCartFlyContext {
  origin?: HTMLElement | null;
  clickTarget?: EventTarget | null;
  imageUrl?: string | null;
}

interface UseAddToCartProps {
  productId: string;
  productSlug: string;
  productTitle?: string;
  productImage?: string | null;
  inStock: boolean;
  defaultVariantId?: string | null;
  price?: number;
}

function pushOptimisticSnapshot(
  scope: ReturnType<typeof resolveCartCacheScope>,
  input: Parameters<typeof applyOptimisticAddToSnapshot>[1],
  cartId: string,
): void {
  if (!scope) {
    return;
  }
  const cart = applyOptimisticAddToSnapshot(scope, input, cartId);
  dispatchCartUpdated({ itemsCount: cart.itemsCount, fromMutation: true });
}

/**
 * Hook for adding products to cart — optimistic snapshot + instant drawer.
 */
export function useAddToCart({
  productId,
  productSlug,
  productTitle,
  productImage,
  inStock,
  defaultVariantId,
  price: propPrice,
}: UseAddToCartProps) {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { t } = useTranslation();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addToCart = async (fly?: AddToCartFlyContext) => {
    if (!inStock) {
      return;
    }

    if (!productSlug || productSlug.trim() === '' || productSlug.includes(' ')) {
      logger.warn('[PRODUCT CARD] Invalid product slug', { productSlug });
      alert(t('common.alerts.invalidProduct'));
      return;
    }

    const flyTrigger =
      fly?.origin ??
      (fly?.clickTarget instanceof HTMLElement ? fly.clickTarget : null);

    playCartFlyAnimation({
      fromElement: flyTrigger,
      imageUrl: fly?.imageUrl ?? productImage ?? null,
    });

    const scope = resolveCartCacheScope(isLoggedIn, user?.id);
    const imageForLine = fly?.imageUrl ?? productImage ?? null;
    const optimisticLine = (variantId: string, variantPrice: number) => ({
      productId,
      productSlug,
      variantId,
      quantityToAdd: 1,
      price: variantPrice,
      productTitle,
      productImage: imageForLine,
    });

    if (!isLoggedIn) {
      setIsAddingToCart(true);
      try {
        const stored = localStorage.getItem(CART_KEY);
        const cart: Array<{
          productId: string;
          productSlug: string;
          variantId?: string;
          quantity: number;
          price?: number;
        }> = stored ? JSON.parse(stored) : [];

        let variantId: string;
        let variantStock: number | undefined;
        let variantPrice: number | undefined = propPrice || undefined;

        if (defaultVariantId) {
          variantId = defaultVariantId;
        } else {
          const encodedSlug = encodeURIComponent(productSlug.trim());
          const productDetails = await apiClient.get<ProductDetails>(
            `/api/v1/products/${encodedSlug}`,
          );
          if (!productDetails.variants || productDetails.variants.length === 0) {
            alert(t('common.alerts.noVariantsAvailable'));
            return;
          }
          variantId = productDetails.variants[0].id;
          variantStock = productDetails.variants[0].stock;
          if (!variantPrice) {
            variantPrice = productDetails.variants[0].price;
          }
        }

        const existingItem = cart.find(
          (item) => item.productId === productId && item.variantId === variantId,
        );
        const totalQuantity = (existingItem?.quantity || 0) + 1;

        if (variantStock !== undefined && totalQuantity > variantStock) {
          alert(t('common.alerts.noMoreStockAvailable'));
          return;
        }

        if (existingItem) {
          existingItem.quantity = totalQuantity;
          if (!existingItem.productSlug) {
            existingItem.productSlug = productSlug;
          }
          if (variantPrice) {
            existingItem.price = variantPrice;
          }
        } else {
          cart.push({
            productId,
            productSlug,
            variantId,
            quantity: 1,
            price: variantPrice || 0,
          });
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        pushOptimisticSnapshot(scope, optimisticLine(variantId, variantPrice || 0), 'guest-cart');
        openCartDrawer();
        scheduleCartRevalidate(false, null, t, { force: true });
      } catch (error: unknown) {
        logger.error('[PRODUCT CARD] Error adding to guest cart', { error });
        const err = error as { message?: string; status?: number };
        if (
          err?.message?.includes('does not exist') ||
          err?.message?.includes('404') ||
          err?.status === 404
        ) {
          alert(t('common.alerts.productNotFound'));
        } else {
          router.push(`/login?redirect=/products`);
        }
      } finally {
        setIsAddingToCart(false);
      }
      return;
    }

    setIsAddingToCart(true);

    try {
      let variantId: string;
      let variantStock: number | undefined;
      const unitPrice = propPrice ?? 0;

      if (defaultVariantId) {
        variantId = defaultVariantId;
        pushOptimisticSnapshot(
          scope,
          optimisticLine(variantId, unitPrice),
          `user-cart-${user?.id ?? 'pending'}`,
        );
        openCartDrawer();
      } else {
        const encodedSlug = encodeURIComponent(productSlug.trim());
        const productDetails = await apiClient.get<ProductDetails>(
          `/api/v1/products/${encodedSlug}`,
        );
        if (!productDetails.variants || productDetails.variants.length === 0) {
          alert(t('common.alerts.noVariantsAvailable'));
          return;
        }
        variantId = productDetails.variants[0].id;
        variantStock = productDetails.variants[0].stock;
        const price = unitPrice || productDetails.variants[0].price;
        pushOptimisticSnapshot(
          scope,
          optimisticLine(variantId, price),
          `user-cart-${user?.id ?? 'pending'}`,
        );
        openCartDrawer();
      }

      const addRequest = apiClient.post<{
        item: { id: string; quantity: number; price: number };
        cartSummary?: { itemsCount: number; total: number };
      }>('/api/v1/cart/items', {
        productId,
        variantId,
        quantity: 1,
      });

      registerPendingCartAdd(
        { productId, variantId },
        addRequest.then(() => undefined),
      );

      const response = await addRequest;

      if (scope && response.item?.id) {
        patchCartLineIdInSnapshot(scope, productId, variantId, response.item.id);
      }

      const itemsCount = response.cartSummary?.itemsCount;
      if (typeof itemsCount === 'number') {
        dispatchCartUpdated({ itemsCount, fromMutation: true });
      }

      confirmCartMutation(true, user?.id ?? null, t);
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        status?: number;
        statusCode?: number;
        response?: { data?: { detail?: string; title?: string } };
      };

      if (error instanceof ApiError && isQuietCartStockValidationError(error.status, error.data)) {
        alert(t('common.alerts.noMoreStockAvailable'));
        scheduleCartRevalidate(true, user?.id ?? null, t, { force: true });
        return;
      }

      if (
        err?.message?.includes('does not exist') ||
        err?.message?.includes('404') ||
        err?.status === 404 ||
        err?.statusCode === 404
      ) {
        alert(t('common.alerts.productNotFound'));
        return;
      }

      if (
        err.response?.data?.detail?.includes('No more stock available') ||
        err.response?.data?.detail?.includes('exceeds available stock') ||
        err.response?.data?.title === 'Insufficient stock'
      ) {
        alert(t('common.alerts.noMoreStockAvailable'));
        return;
      }

      logger.error('[PRODUCT CARD] Error adding to cart', { error });

      if (
        err.message?.includes('401') ||
        err.message?.includes('Unauthorized') ||
        err?.status === 401 ||
        err?.statusCode === 401
      ) {
        router.push(`/login?redirect=/products`);
      } else {
        alert(t('common.alerts.failedToAddToCart'));
      }
      scheduleCartRevalidate(true, user?.id ?? null, t, { force: true });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return { isAddingToCart, addToCart };
}
