'use client';

import { useCallback } from 'react';
import { formatPrice, type CurrencyCode } from '../../lib/currency';
import { useCurrency } from '../../components/hooks/useCurrency';
import { useTranslation } from '../../lib/i18n-client';
import { removeWishlistItem } from '../../lib/wishlist/wishlist-storage';
import type { WishlistProductSnapshot } from '../../lib/wishlist/wishlist-types';
import {
  WishlistProductCard,
  WishlistProductCardSkeleton,
} from './WishlistProductCard';
import { useWishlistCartActions } from './useWishlistCartActions';

type WishlistProductGridProps = {
  products: WishlistProductSnapshot[];
  pendingCount: number;
};

function resolveComparePrice(
  product: WishlistProductSnapshot,
  currency: CurrencyCode,
): string | null {
  const compareValue =
    product.originalPrice != null && product.originalPrice > product.price
      ? product.originalPrice
      : product.compareAtPrice != null && product.compareAtPrice > product.price
        ? product.compareAtPrice
        : null;

  return compareValue != null ? formatPrice(compareValue, currency) : null;
}

/**
 * Renders wishlist products with shared page-level hooks (not per card).
 */
export function WishlistProductGrid({ products, pendingCount }: WishlistProductGridProps) {
  const { t } = useTranslation();
  const currency = useCurrency();
  const { addToCart, addingProductId } = useWishlistCartActions();

  const handleRemove = useCallback((productId: string) => {
    removeWishlistItem(productId);
  }, []);

  const handleAddToCart = useCallback(
    (product: WishlistProductSnapshot) => {
      void addToCart(product);
    },
    [addToCart],
  );

  return (
    <div className="grid w-full grid-cols-1 justify-items-center gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <WishlistProductCard
          key={product.id}
          product={product}
          priceLabel={formatPrice(product.price, currency)}
          comparePriceLabel={resolveComparePrice(product, currency)}
          removeLabel={t('common.ariaLabels.removeFromWishlist')}
          addToCartLabel={t('common.buttons.addToCart')}
          outOfStockLabel={t('common.stock.outOfStock')}
          isAddingToCart={addingProductId === product.id}
          onRemove={handleRemove}
          onAddToCart={handleAddToCart}
        />
      ))}
      {Array.from({ length: pendingCount }).map((_, index) => (
        <WishlistProductCardSkeleton key={`pending-${index}`} />
      ))}
    </div>
  );
}
